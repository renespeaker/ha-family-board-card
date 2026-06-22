import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface PersonConfig {
  name?: string;
  person?: string;   // person.* entity -> avatar (entity_picture) + live status
  calendar?: string; // calendar.* entity -> events
  color?: string;    // optional override; default falls back to a palette
}

export interface FamilyBoardConfig extends LovelaceCardConfig {
  persons: PersonConfig[];
  view?: "day" | "week";
  time_grid?: 15 | 30 | 60;
  start_hour?: number;
  end_hour?: number;
  show_weekends?: boolean;
  show_now_line?: boolean;
  color_by?: "person" | "location";
}

/** A raw event as returned by HA, kept so we can edit/delete it. */
interface RawEvent {
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  summary: string;
  description?: string;
  location?: string;
  allDay: boolean;
  start: Date;      // absolute start
  end: Date;        // absolute end (exclusive)
  color: string;
}

/** A per-day display segment derived from a RawEvent. */
interface BoardEvent {
  ref: RawEvent;
  personIdx: number;
  day: number;       // 0 = Monday, within the current week
  startMin: number;  // minutes from midnight of `day`
  endMin: number;    // minutes from midnight of `day` (1440 = end of day)
  title: string;
  location?: string;
  allDay: boolean;
  color: string;
  continuesBefore: boolean;
  continuesAfter: boolean;
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
  "#8B7CF6", "#34D399", "#FBBF24", "#FB7185", "#22D3EE",
  "#C084FC", "#A3E635", "#FB923C", "#F472B6", "#60A5FA",
];
const DAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const DAYS_FULL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const GRID_PX_PER_MIN: Record<number, number> = { 60: 0.95, 30: 1.25, 15: 1.7 };

// CalendarEntityFeature bitmask (home-assistant/core)
const FEAT_CREATE = 1;
const FEAT_DELETE = 2;
const FEAT_UPDATE = 4;

const DAY_MS = 86400000;
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (min: number) => `${pad(Math.floor(min / 60) % 24)}:${pad(min % 60)}`;
const personColor = (p: PersonConfig, idx: number) =>
  p.color || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

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

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
export class FamilyBoardCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;
  @state() private _events: BoardEvent[] = [];
  @state() private _view: "day" | "week" = "day";
  @state() private _day: number = (new Date().getDay() + 6) % 7;
  @state() private _dialog?: DialogState;

  private _fetchedKey = "";

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
  }

  public getCardSize(): number {
    return 12;
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
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
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

  /** Force a refresh on next update (e.g. after a mutation). */
  private async _refetch(): Promise<void> {
    this._fetchedKey = "";
    await this._maybeFetch();
  }

  private async _fetchEvents(): Promise<void> {
    const { monday, nextMonday } = this._weekBounds();
    const start = monday.toISOString();
    const end = nextMonday.toISOString();
    const out: BoardEvent[] = [];

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
            const raw = this._toRawEvent(ev, idx, p.calendar, color);
            if (raw) out.push(...this._segments(raw, monday));
          }
        } catch (err) {
          // calendar might be unavailable; skip quietly
        }
      }),
    );
    this._events = out;
  }

  /** Normalize a HA calendar API item into an absolute-time RawEvent. */
  private _toRawEvent(ev: any, idx: number, calendar: string, color: string): RawEvent | null {
    const allDay = !ev.start?.dateTime;
    let start: Date;
    let end: Date;
    if (allDay) {
      // All-day: dates are timezone-naive; end is EXCLUSIVE.
      if (!ev.start?.date) return null;
      start = new Date(`${ev.start.date}T00:00:00`);
      end = ev.end?.date ? new Date(`${ev.end.date}T00:00:00`) : new Date(start.getTime() + DAY_MS);
    } else {
      start = new Date(ev.start.dateTime);
      end = new Date(ev.end?.dateTime ?? ev.start.dateTime);
    }
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    if (end.getTime() <= start.getTime()) end = new Date(start.getTime() + (allDay ? DAY_MS : 0) + 1);
    return {
      personIdx: idx,
      calendar,
      uid: ev.uid,
      recurrence_id: ev.recurrence_id,
      summary: ev.summary || "Termin",
      description: ev.description,
      location: ev.location,
      allDay,
      start,
      end,
      color,
    };
  }

  /** Split a RawEvent into per-day display segments within the visible week. */
  private _segments(raw: RawEvent, monday: Date): BoardEvent[] {
    const segs: BoardEvent[] = [];
    for (let d = 0; d < 7; d++) {
      const dayStart = new Date(monday.getTime() + d * DAY_MS);
      const dayEnd = new Date(dayStart.getTime() + DAY_MS);
      // overlap of [start,end) with [dayStart,dayEnd)
      const segStartMs = Math.max(raw.start.getTime(), dayStart.getTime());
      const segEndMs = Math.min(raw.end.getTime(), dayEnd.getTime());
      if (segEndMs <= segStartMs) continue;
      const startMin = raw.allDay ? 0 : Math.round((segStartMs - dayStart.getTime()) / 60000);
      const endMin = raw.allDay ? 1440 : Math.round((segEndMs - dayStart.getTime()) / 60000);
      segs.push({
        ref: raw,
        personIdx: raw.personIdx,
        day: d,
        startMin,
        endMin: Math.min(endMin, 1440),
        title: raw.summary,
        location: raw.location,
        allDay: raw.allDay,
        color: raw.color,
        continuesBefore: raw.start.getTime() < dayStart.getTime(),
        continuesAfter: raw.end.getTime() > dayEnd.getTime(),
      });
    }
    return segs;
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
  private get _startMin(): number {
    return (this._config.start_hour ?? 6) * 60;
  }
  private get _endMin(): number {
    return (this._config.end_hour ?? 22) * 60;
  }
  private get _visibleDays(): number[] {
    return this._config.show_weekends === false ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5, 6];
  }
  private _timedFor(day: number, idx: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx && !e.allDay)
      .sort((a, b) => a.startMin - b.startMin);
  }
  private _allDayFor(day: number, idx: number): BoardEvent[] {
    return this._events.filter((e) => e.day === day && e.personIdx === idx && e.allDay);
  }
  private _eventsFor(day: number, idx: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  /** Monday-based weekday index -> absolute Date in current week. */
  private _dateForDay(day: number): Date {
    const { monday } = this._weekBounds();
    return new Date(monday.getTime() + day * DAY_MS);
  }
  private _avatar(p: PersonConfig, idx: number) {
    const color = personColor(p, idx);
    const st = p.person ? this.hass.states[p.person] : undefined;
    const pic = st?.attributes?.entity_picture as string | undefined;
    const name = p.name || st?.attributes?.friendly_name || `Person ${idx + 1}`;
    const initials = name.slice(0, 2).toUpperCase();
    return pic
      ? html`<div class="avatar" style="background-image:url('${pic}');box-shadow:0 0 0 2px ${color}55"></div>`
      : html`<div class="avatar initials" style="background:${color}">${initials}</div>`;
  }

  /* ---- render -------------------------------------------------- */
  protected render() {
    if (!this._config || !this.hass) return nothing;
    return html`
      <ha-card>
        <div class="top">
          <div class="title">Familienplan</div>
          <div class="switch">
            <button class=${this._view === "day" ? "on" : ""} @click=${() => (this._view = "day")}>Tag</button>
            <button class=${this._view === "week" ? "on" : ""} @click=${() => (this._view = "week")}>Woche</button>
          </div>
        </div>
        ${this._view === "day" ? this._renderDay() : this._renderWeek()}
      </ha-card>
      ${this._dialog ? this._renderDialog() : nothing}
    `;
  }

  private _renderDayTabs() {
    return html`
      <div class="tabs">
        ${this._visibleDays.map(
          (d) => html`
            <button
              class=${d === this._day ? "on" : ""}
              @click=${() => (this._day = d)}
            >
              ${DAYS_SHORT[d]}
            </button>
          `,
        )}
      </div>
    `;
  }

  private _renderDay() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const px = GRID_PX_PER_MIN[this._grid] ?? 1.25;
    const startMin = this._startMin;
    const endMin = this._endMin;
    const height = (endMin - startMin) * px;

    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

    const realToday = (new Date().getDay() + 6) % 7;
    const now = new Date();
    const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
    const showNow = this._config.show_now_line !== false && day === realToday;
    const hasAllDay = this._persons.some((_, i) => this._allDayFor(day, i).length > 0);

    return html`
      <div class="dayhead">
        <span class="dayname">${DAYS_FULL[day]}</span>
        ${this._renderDayTabs()}
      </div>
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((p, i) => {
            const name = p.name || this.hass.states[p.person ?? ""]?.attributes?.friendly_name || `Person ${i + 1}`;
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            const canCreate = this._canCreate(p.calendar);
            return html`
              <div class="phead">
                ${this._avatar(p, i)}
                <div class="pname">${name}</div>
                <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
                ${canCreate
                  ? html`<button class="addbtn" title="Termin hinzufügen"
                      @click=${() => this._openCreate(i, day)}>＋</button>`
                  : nothing}
              </div>
            `;
          })}
        </div>
        ${hasAllDay
          ? html`
              <div class="allday-row">
                <div class="axis-spacer allday-label">ganztägig</div>
                ${this._persons.map((p, i) => html`
                  <div class="allday-cell">
                    ${this._allDayFor(day, i).map(
                      (e) => html`
                        <div class="adchip" style="border-left:3px solid ${e.color};background:${e.color}22"
                          title="${e.title}" @click=${() => this._openEvent(e)}>
                          ${e.continuesBefore ? "« " : ""}${e.title}${e.continuesAfter ? " »" : ""}
                        </div>
                      `,
                    )}
                  </div>
                `)}
              </div>
            `
          : nothing}
        <div class="body" style="height:${height}px">
          <div class="axis">
            ${hours.map(
              (h) => html`<div class="hour" style="top:${(h * 60 - startMin) * px}px">${pad(h)}:00</div>`,
            )}
          </div>
          ${this._persons.map((p, i) => {
            const gridPx = this._grid * px;
            const canCreate = this._canCreate(p.calendar);
            return html`
              <div
                class="col ${canCreate ? "creatable" : ""}"
                @click=${(ev: MouseEvent) => this._onColClick(ev, i, day, px, startMin)}
                style="background-image:
                  repeating-linear-gradient(var(--divider-color,#8884) 0 1px, transparent 1px ${gridPx}px),
                  repeating-linear-gradient(var(--divider-color,#8888) 0 1px, transparent 1px ${60 * px}px)"
              >
                ${this._timedFor(day, i)
                  .filter((e) => e.endMin > startMin && e.startMin < endMin)
                  .map((e) => {
                    const top = (e.startMin - startMin) * px;
                    const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                    const c = e.color;
                    return html`
                      <div
                        class="event"
                        @click=${(ev: MouseEvent) => { ev.stopPropagation(); this._openEvent(e); }}
                        style="top:${top + 1.5}px;height:${h}px;border-left:3px solid ${c};
                               background:linear-gradient(135deg, ${c}30, ${c}1a)"
                        title="${e.title} · ${fmt(e.startMin)}–${fmt(e.endMin)}"
                      >
                        <span class="etitle">${e.continuesBefore ? "« " : ""}${e.title}</span>
                        ${h > 32 ? html`<span class="etime">${fmt(e.startMin)}–${fmt(e.endMin)}</span>` : nothing}
                      </div>
                    `;
                  })}
              </div>
            `;
          })}
          ${showNow
            ? html`<div class="nowline" style="top:${(nowMin - startMin) * px}px"><span>${fmt(nowMin)}</span></div>`
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderWeek() {
    const realToday = (new Date().getDay() + 6) % 7;
    const cols = `70px repeat(${this._persons.length}, minmax(110px, 1fr))`;
    return html`
      <div class="weekhead"><span class="dayname">Diese Woche</span></div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${cols}">
          <div class="corner"></div>
          ${this._persons.map(
            (p, i) => html`<div class="wphead">${this._avatar(p, i)}<span>${p.name || `Person ${i + 1}`}</span></div>`,
          )}
          ${this._visibleDays.map(
            (d) => html`
              <div class="wday ${d === realToday ? "today" : ""}">
                <b>${DAYS_SHORT[d]}</b>
              </div>
              ${this._persons.map((p, i) => {
                const canCreate = this._canCreate(p.calendar);
                return html`
                  <div class="wcell ${d === realToday ? "today" : ""} ${canCreate ? "creatable" : ""}"
                    @click=${() => canCreate && this._openCreate(i, d)}>
                    ${this._eventsFor(d, i).map((e) => {
                      const c = e.color;
                      return html`
                        <div class="wchip" style="border-left:2.5px solid ${c};background:${c}22" title="${e.title}"
                          @click=${(ev: MouseEvent) => { ev.stopPropagation(); this._openEvent(e); }}>
                          <span>${e.continuesBefore ? "« " : ""}${e.title}</span>
                          ${!e.allDay ? html`<small>${fmt(e.startMin)}</small>` : nothing}
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
    if (state === "home") return "zuhause";
    if (state === "not_home") return "unterwegs";
    return state;
  }

  /* ---- create / edit / delete ---------------------------------- */
  private _onColClick(ev: MouseEvent, idx: number, day: number, px: number, startMin: number): void {
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
    const raw = e.ref;
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
      end: raw.allDay
        ? toLocalDate(new Date(raw.end.getTime() - DAY_MS))
        : toLocalInput(raw.end),
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
      this._dialog = { ...d, allDay, start: d.start.slice(0, 10), end: d.end.slice(0, 10), error: undefined };
    } else if (!allDay && d.allDay) {
      this._dialog = { ...d, allDay, start: `${d.start}T09:00`, end: `${d.end}T10:00`, error: undefined };
    }
  }

  /** Build the event payload expected by calendar/event/* WS commands. */
  private _buildPayload(d: DialogState): Record<string, string> {
    const ev: Record<string, string> = { summary: d.summary.trim() || "Termin" };
    if (d.location.trim()) ev.location = d.location.trim();
    if (d.description.trim()) ev.description = d.description.trim();
    if (d.allDay) {
      // end date is exclusive -> last selected day + 1
      const endExcl = new Date(`${d.end}T00:00:00`);
      endExcl.setDate(endExcl.getDate() + 1);
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
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "Bitte gültige Zeiten angeben.";
    if (e.getTime() < s.getTime()) return "Ende liegt vor dem Start.";
    if (!d.allDay && e.getTime() === s.getTime()) return "Ende muss nach dem Start liegen.";
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
      this._dialog = { ...d, busy: false, error: e?.message || "Speichern fehlgeschlagen." };
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
      this._dialog = { ...d, busy: false, error: e?.message || "Löschen fehlgeschlagen." };
    }
  }

  private _closeDialog(): void {
    this._dialog = undefined;
  }

  private _renderDialog() {
    const d = this._dialog!;
    const readOnly = d.mode === "edit" && !d.canUpdate;
    const calName =
      this.hass.states[d.calendar]?.attributes?.friendly_name || d.calendar;
    return html`
      <div class="overlay" @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) this._closeDialog(); }}>
        <div class="dialog" role="dialog" aria-modal="true">
          <div class="dlg-head">
            <span>${d.mode === "create" ? "Neuer Termin" : readOnly ? "Termin" : "Termin bearbeiten"}</span>
            <button class="icon" @click=${this._closeDialog} title="Schließen">✕</button>
          </div>
          <div class="dlg-cal">${calName}</div>

          <label class="fld">
            <span>Titel</span>
            <input type="text" .value=${d.summary} ?disabled=${readOnly}
              @input=${(e: Event) => this._dlgField("summary", (e.target as HTMLInputElement).value)} />
          </label>

          <label class="chk">
            <input type="checkbox" .checked=${d.allDay} ?disabled=${readOnly}
              @change=${(e: Event) => this._toggleAllDay((e.target as HTMLInputElement).checked)} />
            <span>Ganztägig</span>
          </label>

          <div class="row">
            <label class="fld">
              <span>Start</span>
              <input type=${d.allDay ? "date" : "datetime-local"} .value=${d.start} ?disabled=${readOnly}
                @input=${(e: Event) => this._dlgField("start", (e.target as HTMLInputElement).value)} />
            </label>
            <label class="fld">
              <span>Ende</span>
              <input type=${d.allDay ? "date" : "datetime-local"} .value=${d.end} ?disabled=${readOnly}
                @input=${(e: Event) => this._dlgField("end", (e.target as HTMLInputElement).value)} />
            </label>
          </div>

          <label class="fld">
            <span>Ort</span>
            <input type="text" .value=${d.location} ?disabled=${readOnly}
              @input=${(e: Event) => this._dlgField("location", (e.target as HTMLInputElement).value)} />
          </label>

          <label class="fld">
            <span>Notiz</span>
            <textarea rows="2" .value=${d.description} ?disabled=${readOnly}
              @input=${(e: Event) => this._dlgField("description", (e.target as HTMLTextAreaElement).value)}></textarea>
          </label>

          ${readOnly
            ? html`<div class="ro-note">Dieser Kalender ist schreibgeschützt.</div>`
            : nothing}
          ${d.error ? html`<div class="dlg-error">${d.error}</div>` : nothing}

          <div class="dlg-actions">
            ${d.mode === "edit" && d.canDelete
              ? html`<button class="danger" ?disabled=${d.busy} @click=${this._deleteDialog}>Löschen</button>`
              : nothing}
            <span class="spacer"></span>
            <button class="ghost" ?disabled=${d.busy} @click=${this._closeDialog}>Abbrechen</button>
            ${!readOnly
              ? html`<button class="primary" ?disabled=${d.busy} @click=${this._saveDialog}>
                  ${d.busy ? "…" : "Speichern"}
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
      /* inherit dashboard font; fall back to HA body font */
      font-family: var(--ha-font-family-body, var(--mdc-typography-font-family, inherit));
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
    .board {
      max-height: 58vh;
      overflow: auto;
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
      position: absolute;
      top: 6px;
      right: 6px;
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      width: 22px;
      height: 22px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
      padding: 0;
    }
    .addbtn:hover {
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
      left: 4px;
      right: 4px;
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

customElements.define("family-board-card", FamilyBoardCard);

// register in the card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "family-board-card",
  name: "Family Board Card",
  description: "Familienkalender / Wer-ist-wann-wo Übersicht für mehrere Personen.",
  preview: true,
  documentationURL: "https://github.com/renespeaker/ha-family-board-card",
});

console.info("%c FAMILY-BOARD-CARD %c v0.2.0 ", "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px", "background:#222;color:#fff;border-radius:0 3px 3px 0");
