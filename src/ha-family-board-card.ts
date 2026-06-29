import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";
import {
  RawEvent,
  BoardEvent,
  LaidOutEvent,
  DAY_MS,
  parseRawEvent,
  splitIntoSegments,
  layoutDayColumns,
} from "./events";
import { localize, formatMinutes, weekdayNames, formatWeekRange } from "./localize";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PersonConfig {
  name?: string;
  person?: string; // person.* entity -> avatar (entity_picture) + live status
  calendar?: string; // calendar.* entity -> events
  color?: string; // optional override; default falls back to a palette
}

export interface FamilyBoardConfig extends LovelaceCardConfig {
  persons: PersonConfig[];
  title?: string;
  view?: "day" | "week";
  time_grid?: 15 | 30 | 60;
  start_hour?: number;
  end_hour?: number;
  show_weekends?: boolean;
  show_now_line?: boolean;
  color_by?: "person" | "location";
  refresh_interval?: number; // seconds; 0 disables. default 300
  hour_height?: number; // px per hour in the day view. default 64
}

/** State of the create/edit dialog. */
interface DialogState {
  mode: "create" | "edit";
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  canUpdate: boolean;
  canDelete: boolean;
  summary: string;
  location: string;
  description: string;
  allDay: boolean;
  start: string; // datetime-local ("YYYY-MM-DDTHH:mm") or date ("YYYY-MM-DD")
  end: string;
  busy?: boolean;
  error?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const FALLBACK_COLORS = [
  "#8B7CF6",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#22D3EE",
  "#C084FC",
  "#A3E635",
  "#FB923C",
  "#F472B6",
  "#60A5FA",
];
const DEFAULT_HOUR_HEIGHT = 64; // px per hour in the day view
const HOUR_HEIGHT_MIN = 40;
const HOUR_HEIGHT_MAX = 96;

// CalendarEntityFeature bitmask (home-assistant/core)
const FEAT_CREATE = 1;
const FEAT_DELETE = 2;
const FEAT_UPDATE = 4;

const pad = (n: number) => String(n).padStart(2, "0");

/** local Date -> "YYYY-MM-DDTHH:mm" for <input type=datetime-local> */
const toLocalInput = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
/** local Date -> "YYYY-MM-DD" for <input type=date> */
const toLocalDate = (d: Date) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
/** midnight (local) of the given date */
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const personColor = (p: PersonConfig, idx: number) =>
  p.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
export class FamilyBoardCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;
  @state() private _events: BoardEvent[] = [];
  @state() private _view: "day" | "week" = "day";
  @state() private _day: number = (new Date().getDay() + 6) % 7;
  @state() private _weekOffset = 0;
  @state() private _dialog?: DialogState;
  @state() private _loadError = false;

  private _fetchedKey = "";
  private _timer?: number;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement("ha-family-board-card-editor") as LovelaceCardEditor;
  }

  public static getStubConfig(): FamilyBoardConfig {
    return {
      type: "custom:family-board-card",
      view: "day",
      time_grid: 30,
      start_hour: 6,
      end_hour: 22,
      show_weekends: true,
      show_now_line: true,
      color_by: "person",
      persons: [
        { name: "Person 1", person: "", calendar: "" },
        { name: "Person 2", person: "", calendar: "" },
      ],
    };
  }

  public setConfig(config: FamilyBoardConfig): void {
    if (!config.persons || !Array.isArray(config.persons)) {
      throw new Error("Bitte mindestens eine Person unter 'persons' konfigurieren.");
    }
    this._config = config;
    this._view = config.view ?? "day";
    if (this.isConnected) this._startTimer();
  }

  public getCardSize(): number {
    return 12;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKeyDown);
    this._startTimer();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeyDown);
    this._stopTimer();
  }

  private _onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this._dialog) {
      e.stopPropagation();
      this._closeDialog();
    }
  };

  private _startTimer(): void {
    this._stopTimer();
    const s = this._config?.refresh_interval ?? 300;
    if (s > 0) this._timer = window.setInterval(() => this._refetch(), s * 1000);
  }
  private _stopTimer(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  protected updated(changed: PropertyValues): void {
    if ((changed.has("hass") || changed.has("_config")) && this.hass && this._config) {
      this._maybeFetch();
    }
  }

  /* ---- data ---------------------------------------------------- */
  private _weekBounds(): { monday: Date; nextMonday: Date } {
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + this._weekOffset * 7);
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return { monday, nextMonday };
  }

  private async _maybeFetch(): Promise<void> {
    const { monday } = this._weekBounds();
    const cals = this._config.persons.map((p) => p.calendar || "").join(",");
    const key = `${monday.toISOString().slice(0, 10)}|${cals}`;
    if (key === this._fetchedKey) return;
    this._fetchedKey = key;
    await this._fetchEvents();
  }

  /** Force a refresh on next update (e.g. after a mutation or timer). */
  private async _refetch(): Promise<void> {
    this._fetchedKey = "";
    await this._maybeFetch();
  }

  private async _fetchEvents(): Promise<void> {
    const { monday, nextMonday } = this._weekBounds();
    const start = monday.toISOString();
    const end = nextMonday.toISOString();
    const out: BoardEvent[] = [];
    let anyError = false;

    await Promise.all(
      this._config.persons.map(async (p, idx) => {
        if (!p.calendar || !this.hass.states[p.calendar]) return;
        const color = personColor(p, idx);
        try {
          const events = await this.hass.callApi<any[]>(
            "GET",
            `calendars/${p.calendar}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
          );
          for (const ev of events) {
            const raw = parseRawEvent(ev, idx, p.calendar!, color);
            if (raw) out.push(...splitIntoSegments(raw, monday));
          }
        } catch (err) {
          anyError = true;
        }
      }),
    );
    this._events = out;
    this._loadError = anyError && out.length === 0;
  }

  /* ---- capabilities -------------------------------------------- */
  private _calFeatures(entity?: string): number {
    if (!entity) return 0;
    const st = this.hass.states[entity];
    return Number(st?.attributes?.supported_features ?? 0);
  }
  private _canCreate(entity?: string) {
    return (this._calFeatures(entity) & FEAT_CREATE) !== 0;
  }
  private _canUpdate(entity?: string) {
    return (this._calFeatures(entity) & FEAT_UPDATE) !== 0;
  }
  private _canDelete(entity?: string) {
    return (this._calFeatures(entity) & FEAT_DELETE) !== 0;
  }

  /* ---- helpers ------------------------------------------------- */
  private get _persons(): PersonConfig[] {
    return this._config.persons;
  }
  private get _grid(): number {
    return this._config.time_grid ?? 30;
  }
  /** Pixels per minute, derived from the configurable hour height. */
  private get _pxPerMin(): number {
    const h = Math.min(
      HOUR_HEIGHT_MAX,
      Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
    );
    return h / 60;
  }
  private get _startMin(): number {
    return (this._config.start_hour ?? 6) * 60;
  }
  private get _endMin(): number {
    return (this._config.end_hour ?? 22) * 60;
  }
  private get _visibleDays(): number[] {
    return this._config.show_weekends === false ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5, 6];
  }
  private _t(key: string): string {
    return localize(this.hass, key);
  }
  /** Color for an event respecting the color_by option. */
  private _eventColor(e: BoardEvent): string {
    if (this._config.color_by === "location" && e.location) {
      let h = 0;
      for (let i = 0; i < e.location.length; i++) h = (h * 31 + e.location.charCodeAt(i)) >>> 0;
      return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
    }
    return e.color;
  }
  private _timedFor(day: number, idx: number): LaidOutEvent[] {
    const evs = this._events.filter((e) => e.day === day && e.personIdx === idx && !e.allDay);
    return layoutDayColumns(evs);
  }
  private _allDayFor(day: number, idx: number): BoardEvent[] {
    return this._events.filter((e) => e.day === day && e.personIdx === idx && e.allDay);
  }
  private _eventsFor(day: number, idx: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  /** Monday-based weekday index -> absolute Date in the shown week. */
  private _dateForDay(day: number): Date {
    const { monday } = this._weekBounds();
    return new Date(monday.getTime() + day * DAY_MS);
  }
  private _isRealToday(day: number): boolean {
    return this._weekOffset === 0 && day === (new Date().getDay() + 6) % 7;
  }
  private _personName(p: PersonConfig, idx: number): string {
    return (
      p.name || this.hass.states[p.person ?? ""]?.attributes?.friendly_name || `Person ${idx + 1}`
    );
  }
  private _avatar(p: PersonConfig, idx: number) {
    const color = personColor(p, idx);
    const st = p.person ? this.hass.states[p.person] : undefined;
    const pic = st?.attributes?.entity_picture as string | undefined;
    const name = this._personName(p, idx);
    const initials = name.slice(0, 2).toUpperCase();
    return pic
      ? html`<div
          class="avatar"
          style="background-image:url('${pic}');box-shadow:0 0 0 2px ${color}55"
        ></div>`
      : html`<div class="avatar initials" style="background:${color}">${initials}</div>`;
  }

  private _prevWeek = () => {
    this._weekOffset -= 1;
  };
  private _nextWeek = () => {
    this._weekOffset += 1;
  };
  private _thisWeek = () => {
    this._weekOffset = 0;
    this._day = (new Date().getDay() + 6) % 7;
  };

  /* ---- render -------------------------------------------------- */
  protected render() {
    if (!this._config || !this.hass) return nothing;
    const title = this._config.title ?? this._t("board_title");
    return html`
      <ha-card>
        <div class="top">
          <div class="title">${title}</div>
          <div class="switch" role="tablist">
            <button
              role="tab"
              aria-selected=${this._view === "day"}
              class=${this._view === "day" ? "on" : ""}
              @click=${() => (this._view = "day")}
            >
              ${this._t("day")}
            </button>
            <button
              role="tab"
              aria-selected=${this._view === "week"}
              class=${this._view === "week" ? "on" : ""}
              @click=${() => (this._view = "week")}
            >
              ${this._t("week")}
            </button>
          </div>
        </div>
        ${this._view === "day" ? this._renderDay() : this._renderWeek()}
      </ha-card>
      ${this._dialog ? this._renderDialog() : nothing}
    `;
  }

  private _weekNav() {
    const { monday } = this._weekBounds();
    return html`
      <div class="weeknav">
        <button class="nav" aria-label=${this._t("prev_week")} @click=${this._prevWeek}>‹</button>
        <button class="nav-now" @click=${this._thisWeek}>
          ${formatWeekRange(this.hass, monday)}
        </button>
        <button class="nav" aria-label=${this._t("next_week")} @click=${this._nextWeek}>›</button>
      </div>
    `;
  }

  private _renderDayTabs() {
    const short = weekdayNames(this.hass, "short");
    return html`
      <div class="tabs" role="tablist">
        ${this._visibleDays.map(
          (d) => html`
            <button
              role="tab"
              aria-selected=${d === this._day}
              class="${d === this._day ? "on" : ""} ${this._isRealToday(d) ? "today" : ""}"
              @click=${() => (this._day = d)}
            >
              ${short[d]}
            </button>
          `,
        )}
      </div>
    `;
  }

  private _renderDay() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const px = this._pxPerMin;
    const hourPx = 60 * px;
    const startMin = this._startMin;
    const endMin = this._endMin;
    const height = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long");

    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

    const now = new Date();
    const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
    const showNow = this._config.show_now_line !== false && this._isRealToday(day);
    const hasAllDay = this._persons.some((_, i) => this._allDayFor(day, i).length > 0);

    return html`
      <div class="dayhead">
        <span class="dayname">${full[day]}</span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((p, i) => {
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            const canCreate = this._canCreate(p.calendar);
            return html`
              <div class="phead">
                ${this._avatar(p, i)}
                <div class="pname">${this._personName(p, i)}</div>
                <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
                ${canCreate
                  ? html`<button
                      class="addbtn"
                      aria-label=${this._t("add_event")}
                      @click=${() => this._openCreate(i, day)}
                    >
                      ＋
                    </button>`
                  : nothing}
              </div>
            `;
          })}
        </div>
        ${hasAllDay
          ? html`
              <div class="allday-row">
                <div class="axis-spacer allday-label">${this._t("all_day")}</div>
                ${this._persons.map(
                  (p, i) => html`
                    <div class="allday-cell">
                      ${this._allDayFor(day, i).map((e) => {
                        const c = this._eventColor(e);
                        return html`
                          <div
                            class="adchip"
                            style="border-left:3px solid ${c};background:${c}22"
                            title="${e.title}"
                            tabindex="0"
                            @click=${() => this._openEvent(e)}
                          >
                            ${e.continuesBefore ? "« " : ""}${e.title}${e.continuesAfter
                              ? " »"
                              : ""}
                          </div>
                        `;
                      })}
                    </div>
                  `,
                )}
              </div>
            `
          : nothing}
        <div class="body" style="height:${height}px">
          <div class="axis">
            ${hours.map(
              (h) =>
                html`<div class="hour" style="top:${(h * 60 - startMin) * px}px">
                  ${pad(h)}:00
                </div>`,
            )}
          </div>
          ${this._persons.map((p, i) => {
            const canCreate = this._canCreate(p.calendar);
            return html`
              <div
                class="col ${canCreate ? "creatable" : ""}"
                @click=${(ev: MouseEvent) => this._onColClick(ev, i, day, px, startMin)}
                style="background-image:
                  repeating-linear-gradient(var(--fb-row-shade) 0 ${hourPx}px, transparent ${hourPx}px ${2 *
                hourPx}px),
                  repeating-linear-gradient(var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                2}px),
                  repeating-linear-gradient(var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px)"
              >
                ${this._timedFor(day, i)
                  .filter((e) => e.endMin > startMin && e.startMin < endMin)
                  .map((e) => {
                    const top = (e.startMin - startMin) * px;
                    const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                    const c = this._eventColor(e);
                    const leftPct = (e.col / e.cols) * 100;
                    const widthPct = 100 / e.cols;
                    return html`
                      <div
                        class="event"
                        tabindex="0"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._openEvent(e);
                        }}
                        style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px);
                               border-left:3px solid ${c};
                               background:linear-gradient(135deg, ${c}30, ${c}1a)"
                        title="${e.title} · ${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                          this.hass,
                          e.endMin,
                        )}"
                      >
                        <span class="etitle">${e.continuesBefore ? "« " : ""}${e.title}</span>
                        ${h > 32
                          ? html`<span class="etime"
                              >${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                                this.hass,
                                e.endMin,
                              )}</span
                            >`
                          : nothing}
                      </div>
                    `;
                  })}
              </div>
            `;
          })}
          ${showNow
            ? html`<div class="nowline" style="top:${(nowMin - startMin) * px}px">
                <span>${formatMinutes(this.hass, nowMin)}</span>
              </div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderWeek() {
    const short = weekdayNames(this.hass, "short");
    const cols = `70px repeat(${this._persons.length}, minmax(110px, 1fr))`;
    return html`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${cols}">
          <div class="corner"></div>
          ${this._persons.map(
            (p, i) =>
              html`<div class="wphead">
                ${this._avatar(p, i)}<span>${this._personName(p, i)}</span>
              </div>`,
          )}
          ${this._visibleDays.map(
            (d) => html`
              <div class="wday ${this._isRealToday(d) ? "today" : ""}">
                <b>${short[d]}</b>
              </div>
              ${this._persons.map((p, i) => {
                const canCreate = this._canCreate(p.calendar);
                return html`
                  <div
                    class="wcell ${this._isRealToday(d) ? "today" : ""} ${canCreate
                      ? "creatable"
                      : ""}"
                    @click=${() => canCreate && this._openCreate(i, d)}
                  >
                    ${this._eventsFor(d, i).map((e) => {
                      const c = this._eventColor(e);
                      return html`
                        <div
                          class="wchip"
                          style="border-left:2.5px solid ${c};background:${c}22"
                          title="${e.title}"
                          tabindex="0"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                        >
                          <span>${e.continuesBefore ? "« " : ""}${e.title}</span>
                          ${!e.allDay
                            ? html`<small>${formatMinutes(this.hass, e.startMin)}</small>`
                            : nothing}
                        </div>
                      `;
                    })}
                  </div>
                `;
              })}
            `,
          )}
        </div>
      </div>
    `;
  }

  private _statusLabel(state: string): string {
    if (state === "home") return this._t("status_home");
    if (state === "not_home") return this._t("status_away");
    if (state === "unknown" || state === "unavailable") return "–";
    return state;
  }

  /* ---- create / edit / delete ---------------------------------- */
  private _onColClick(
    ev: MouseEvent,
    idx: number,
    day: number,
    px: number,
    startMin: number,
  ): void {
    const p = this._persons[idx];
    if (!this._canCreate(p.calendar)) return;
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetY = ev.clientY - rect.top;
    let min = startMin + offsetY / px;
    const grid = this._grid;
    min = Math.round(min / grid) * grid;
    min = Math.max(0, Math.min(min, 24 * 60 - grid));
    this._openCreate(idx, day, min);
  }

  private _openCreate(idx: number, day: number, startMin?: number): void {
    const p = this._persons[idx];
    if (!p.calendar || !this._canCreate(p.calendar)) return;
    const base = startOfDay(this._dateForDay(day));
    const sMin = startMin ?? Math.max(this._startMin, 9 * 60);
    const start = new Date(base.getTime() + sMin * 60000);
    const end = new Date(start.getTime() + 60 * 60000);
    this._dialog = {
      mode: "create",
      personIdx: idx,
      calendar: p.calendar,
      canUpdate: true,
      canDelete: false,
      summary: "",
      location: "",
      description: "",
      allDay: false,
      start: toLocalInput(start),
      end: toLocalInput(end),
    };
  }

  private _openEvent(e: BoardEvent): void {
    const raw: RawEvent = e.ref;
    const cal = raw.calendar;
    const canUpdate = this._canUpdate(cal) && !!raw.uid;
    const canDelete = this._canDelete(cal) && !!raw.uid;
    this._dialog = {
      mode: "edit",
      personIdx: raw.personIdx,
      calendar: cal,
      uid: raw.uid,
      recurrence_id: raw.recurrence_id,
      canUpdate,
      canDelete,
      summary: raw.summary,
      location: raw.location ?? "",
      description: raw.description ?? "",
      allDay: raw.allDay,
      start: raw.allDay ? toLocalDate(raw.start) : toLocalInput(raw.start),
      // all-day end is exclusive in HA; show the inclusive last day to the user
      end: raw.allDay ? toLocalDate(new Date(raw.end.getTime() - DAY_MS)) : toLocalInput(raw.end),
    };
  }

  private _dlgField<K extends keyof DialogState>(key: K, value: DialogState[K]): void {
    if (!this._dialog) return;
    this._dialog = { ...this._dialog, [key]: value, error: undefined };
  }

  private _toggleAllDay(allDay: boolean): void {
    if (!this._dialog) return;
    const d = this._dialog;
    if (allDay && !d.allDay) {
      this._dialog = {
        ...d,
        allDay,
        start: d.start.slice(0, 10),
        end: d.end.slice(0, 10),
        error: undefined,
      };
    } else if (!allDay && d.allDay) {
      this._dialog = {
        ...d,
        allDay,
        start: `${d.start}T09:00`,
        end: `${d.end}T10:00`,
        error: undefined,
      };
    }
  }

  /** Build the event payload expected by calendar/event/* WS commands. */
  private _buildPayload(d: DialogState): Record<string, string> {
    const ev: Record<string, string> = { summary: d.summary.trim() || this._t("default_title") };
    if (d.location.trim()) ev.location = d.location.trim();
    if (d.description.trim()) ev.description = d.description.trim();
    if (d.allDay) {
      const endExcl = new Date(`${d.end}T00:00:00`);
      endExcl.setDate(endExcl.getDate() + 1); // end date is exclusive
      ev.dtstart = d.start;
      ev.dtend = toLocalDate(endExcl);
    } else {
      ev.dtstart = new Date(d.start).toISOString();
      ev.dtend = new Date(d.end).toISOString();
    }
    return ev;
  }

  private _validate(d: DialogState): string | null {
    const s = d.allDay ? new Date(`${d.start}T00:00:00`) : new Date(d.start);
    const e = d.allDay ? new Date(`${d.end}T00:00:00`) : new Date(d.end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return this._t("err_invalid");
    if (e.getTime() < s.getTime()) return this._t("err_end_before");
    if (!d.allDay && e.getTime() === s.getTime()) return this._t("err_end_equal");
    return null;
  }

  private async _saveDialog(): Promise<void> {
    if (!this._dialog) return;
    const d = this._dialog;
    const err = this._validate(d);
    if (err) {
      this._dialog = { ...d, error: err };
      return;
    }
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      const event = this._buildPayload(d);
      if (d.mode === "create") {
        await this.hass.callWS({ type: "calendar/event/create", entity_id: d.calendar, event });
      } else {
        await this.hass.callWS({
          type: "calendar/event/update",
          entity_id: d.calendar,
          uid: d.uid,
          recurrence_id: d.recurrence_id,
          recurrence_range: "",
          event,
        });
      }
      this._dialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._dialog = { ...d, busy: false, error: e?.message || this._t("save_failed") };
    }
  }

  private async _deleteDialog(): Promise<void> {
    if (!this._dialog || !this._dialog.uid) return;
    const d = this._dialog;
    this._dialog = { ...d, busy: true, error: undefined };
    try {
      await this.hass.callWS({
        type: "calendar/event/delete",
        entity_id: d.calendar,
        uid: d.uid,
        recurrence_id: d.recurrence_id,
        recurrence_range: "",
      });
      this._dialog = undefined;
      await this._refetch();
    } catch (e: any) {
      this._dialog = { ...d, busy: false, error: e?.message || this._t("delete_failed") };
    }
  }

  private _closeDialog(): void {
    this._dialog = undefined;
  }

  private _renderDialog() {
    const d = this._dialog!;
    const readOnly = d.mode === "edit" && !d.canUpdate;
    const calName = this.hass.states[d.calendar]?.attributes?.friendly_name || d.calendar;
    const heading =
      d.mode === "create"
        ? this._t("new_event")
        : readOnly
          ? this._t("event")
          : this._t("edit_event");
    return html`
      <div
        class="overlay"
        @click=${(e: MouseEvent) => {
          if (e.target === e.currentTarget) this._closeDialog();
        }}
      >
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${heading}>
          <div class="dlg-head">
            <span>${heading}</span>
            <button class="icon" aria-label=${this._t("close")} @click=${this._closeDialog}>
              ✕
            </button>
          </div>
          <div class="dlg-cal">${calName}</div>

          <label class="fld">
            <span>${this._t("field_title")}</span>
            <input
              type="text"
              .value=${d.summary}
              ?disabled=${readOnly}
              autofocus
              @input=${(e: Event) =>
                this._dlgField("summary", (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="chk">
            <input
              type="checkbox"
              .checked=${d.allDay}
              ?disabled=${readOnly}
              @change=${(e: Event) => this._toggleAllDay((e.target as HTMLInputElement).checked)}
            />
            <span>${this._t("field_all_day")}</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>${this._t("field_start")}</span>
              <input
                type=${d.allDay ? "date" : "datetime-local"}
                .value=${d.start}
                ?disabled=${readOnly}
                @input=${(e: Event) =>
                  this._dlgField("start", (e.target as HTMLInputElement).value)}
              />
            </label>
            <label class="fld">
              <span>${this._t("field_end")}</span>
              <input
                type=${d.allDay ? "date" : "datetime-local"}
                .value=${d.end}
                ?disabled=${readOnly}
                @input=${(e: Event) => this._dlgField("end", (e.target as HTMLInputElement).value)}
              />
            </label>
          </div>

          <label class="fld">
            <span>${this._t("field_location")}</span>
            <input
              type="text"
              .value=${d.location}
              ?disabled=${readOnly}
              @input=${(e: Event) =>
                this._dlgField("location", (e.target as HTMLInputElement).value)}
            />
          </label>

          <label class="fld">
            <span>${this._t("field_note")}</span>
            <textarea
              rows="2"
              .value=${d.description}
              ?disabled=${readOnly}
              @input=${(e: Event) =>
                this._dlgField("description", (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </label>

          ${readOnly ? html`<div class="ro-note">${this._t("read_only")}</div>` : nothing}
          ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}

          <div class="dlg-actions">
            ${d.mode === "edit" && d.canDelete
              ? html`<button class="danger" ?disabled=${d.busy} @click=${this._deleteDialog}>
                  ${this._t("delete")}
                </button>`
              : nothing}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${d.busy} @click=${this._closeDialog}>
              ${this._t("cancel")}
            </button>
            ${!readOnly
              ? html`<button class="primary" ?disabled=${d.busy} @click=${this._saveDialog}>
                  ${d.busy ? "…" : this._t("save")}
                </button>`
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  /* ---- styles (theme-aware) ------------------------------------ */
  static styles = css`
    :host {
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
      /* grid tokens — theme-aware, calm by default */
      --fb-hourline: var(--divider-color, #8884);
      --fb-halfhour: color-mix(in srgb, var(--divider-color, #8884) 45%, transparent);
      --fb-row-shade: color-mix(in srgb, var(--secondary-text-color, #888) 5%, transparent);
    }
    ha-card {
      overflow: hidden;
      color: var(--primary-text-color);
    }
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
    }
    .title {
      font-weight: 600;
      font-size: 16px;
    }
    .switch,
    .tabs {
      display: inline-flex;
      gap: 2px;
      background: var(--secondary-background-color);
      border-radius: 9px;
      padding: 2px;
    }
    .switch button,
    .tabs button {
      border: none;
      cursor: pointer;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 5px 11px;
      border-radius: 7px;
      font: inherit;
      font-size: 13px;
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
    }
    .tabs button.today:not(.on) {
      box-shadow: inset 0 -2px 0 var(--primary-color);
    }
    .tabs {
      margin: 8px 16px 0;
      flex-wrap: wrap;
    }
    .dayhead,
    .weekhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 16px;
      border-bottom: 1px solid var(--divider-color);
      flex-wrap: wrap;
    }
    .dayname {
      font-weight: 600;
      font-size: 15px;
    }
    .weeknav {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav,
    .nav-now {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 7px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      padding: 5px 10px;
    }
    .nav {
      font-size: 16px;
      line-height: 1;
      padding: 4px 9px;
    }
    .nav-now {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .banner {
      margin: 8px 16px 0;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12.5px;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
    }
    .board {
      max-height: 58vh;
      overflow: auto;
      margin-top: 8px;
    }
    .header-row {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .axis-spacer {
      width: 56px;
      flex: 0 0 56px;
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      width: 140px;
      flex: 0 0 140px;
      padding: 10px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
    }
    .addbtn {
      margin-top: 2px;
      border: none;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      width: 26px;
      height: 22px;
      border-radius: 11px;
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
      padding: 0;
    }
    .addbtn:hover,
    .addbtn:focus-visible {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .allday-row {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      background: var(--card-background-color, var(--ha-card-background));
    }
    .allday-label {
      font-size: 10px;
      color: var(--secondary-text-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
    }
    .allday-cell {
      width: 140px;
      flex: 0 0 140px;
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .adchip {
      border-radius: 5px;
      padding: 2px 6px;
      font-size: 10.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }
    .avatar.initials {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #11181f;
      font-weight: 700;
      font-size: 13px;
    }
    .pname {
      font-weight: 600;
      font-size: 13px;
    }
    .pstatus {
      font-size: 10.5px;
      color: var(--secondary-text-color);
    }
    .body {
      display: flex;
      position: relative;
    }
    .axis {
      width: 56px;
      flex: 0 0 56px;
      position: sticky;
      left: 0;
      background: var(--card-background-color, var(--ha-card-background));
      z-index: 4;
      border-right: 1px solid var(--divider-color);
    }
    .hour {
      position: absolute;
      right: 8px;
      transform: translateY(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .col {
      width: 140px;
      flex: 0 0 140px;
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      border-radius: 7px;
      padding: 4px 7px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .etitle {
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: 56px;
      right: 0;
      border-top: 2px solid var(--error-color, #ff5252);
      z-index: 7;
      pointer-events: none;
    }
    .nowline span {
      position: absolute;
      left: -50px;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--error-color, #ff5252);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* week */
    .weekwrap {
      overflow: auto;
      max-height: 60vh;
    }
    .weekgrid {
      display: grid;
    }
    .corner {
      position: sticky;
      left: 0;
      top: 0;
      z-index: 6;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
    }
    .wphead {
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      border-left: 1px solid var(--divider-color);
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .wphead .avatar {
      width: 28px;
      height: 28px;
    }
    .wday {
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 8px;
      display: flex;
      align-items: center;
      font-size: 12.5px;
    }
    .wcell {
      min-height: 70px;
      border-left: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .wcell.creatable {
      cursor: copy;
    }
    .wday.today,
    .wcell.today {
      background: color-mix(in srgb, var(--primary-color) 8%, transparent);
    }
    .wchip {
      border-radius: 5px;
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: 10.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wchip small {
      margin-left: auto;
      font-size: 8.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    /* focus visibility for a11y */
    button:focus-visible,
    .event:focus-visible,
    .wchip:focus-visible,
    .adchip:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    /* dialog */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99;
      padding: 16px;
    }
    .dialog {
      background: var(--card-background-color, var(--ha-card-background, #fff));
      color: var(--primary-text-color);
      border-radius: 14px;
      padding: 16px;
      width: 100%;
      max-width: 420px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
    }
    .dlg-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 16px;
    }
    .dlg-cal {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 2px 0 10px;
    }
    .icon {
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
    }
    .fld {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-bottom: 10px;
    }
    .fld > span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      gap: 10px;
    }
    .row .fld {
      flex: 1;
    }
    input,
    textarea {
      font: inherit;
      font-size: 14px;
      color: var(--primary-text-color);
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      width: 100%;
    }
    input:disabled,
    textarea:disabled {
      opacity: 0.7;
    }
    .chk {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    .chk input {
      width: auto;
    }
    .ro-note {
      font-size: 12px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px 10px;
      margin-bottom: 10px;
    }
    .dlg-error {
      font-size: 12.5px;
      color: var(--error-color, #ff5252);
      margin-bottom: 10px;
    }
    .dlg-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }
    .dlg-actions .spacer {
      flex: 1;
    }
    .dlg-actions button {
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
    .primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .ghost {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .danger {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    button:disabled {
      opacity: 0.6;
      cursor: default;
    }
  `;
}

if (!customElements.get("family-board-card")) {
  customElements.define("family-board-card", FamilyBoardCard);
}

// register in the card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "family-board-card",
  name: "Family Board Card",
  description: "Familienkalender / Wer-ist-wann-wo Übersicht für mehrere Personen.",
  preview: true,
  documentationURL: "https://github.com/renespeaker/ha-family-board-card",
});

console.info(
  "%c FAMILY-BOARD-CARD %c v0.4.1 ",
  "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px",
  "background:#222;color:#fff;border-radius:0 3px 3px 0",
);
