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

interface BoardEvent {
  personIdx: number;
  day: number;       // 0 = Monday
  startMin: number;  // minutes from midnight
  endMin: number;
  title: string;
  location?: string;
  allDay: boolean;
  color: string;
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

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
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
            const allDay = !ev.start?.dateTime;
            const s = new Date(ev.start?.dateTime ?? `${ev.start?.date}T00:00:00`);
            const e = new Date(ev.end?.dateTime ?? `${ev.end?.date}T23:59:00`);
            const day = (s.getDay() + 6) % 7;
            out.push({
              personIdx: idx,
              day,
              startMin: allDay ? 0 : s.getHours() * 60 + s.getMinutes(),
              endMin: allDay ? 24 * 60 : e.getHours() * 60 + e.getMinutes(),
              title: ev.summary || "Termin",
              location: ev.location,
              allDay,
              color,
            });
          }
        } catch (err) {
          // calendar might be unavailable; skip quietly
        }
      }),
    );
    this._events = out;
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
  private _eventsFor(day: number, idx: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => a.startMin - b.startMin);
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
    const colorBy = this._config.color_by ?? "person";

    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

    const realToday = (new Date().getDay() + 6) % 7;
    const now = new Date();
    const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
    const showNow = this._config.show_now_line !== false && day === realToday;

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
            return html`
              <div class="phead">
                ${this._avatar(p, i)}
                <div class="pname">${name}</div>
                <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
              </div>
            `;
          })}
        </div>
        <div class="body" style="height:${height}px">
          <div class="axis">
            ${hours.map(
              (h) => html`<div class="hour" style="top:${(h * 60 - startMin) * px}px">${pad(h)}:00</div>`,
            )}
          </div>
          ${this._persons.map((p, i) => {
            const gridPx = this._grid * px;
            return html`
              <div
                class="col"
                style="background-image:
                  repeating-linear-gradient(var(--divider-color,#8884) 0 1px, transparent 1px ${gridPx}px),
                  repeating-linear-gradient(var(--divider-color,#8888) 0 1px, transparent 1px ${60 * px}px)"
              >
                ${this._eventsFor(day, i)
                  .filter((e) => !e.allDay && e.endMin > startMin && e.startMin < endMin)
                  .map((e) => {
                    const top = (e.startMin - startMin) * px;
                    const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                    const c = colorBy === "person" ? e.color : e.color;
                    return html`
                      <div
                        class="event"
                        style="top:${top + 1.5}px;height:${h}px;border-left:3px solid ${c};
                               background:linear-gradient(135deg, ${c}30, ${c}1a)"
                        title="${e.title} · ${fmt(e.startMin)}–${fmt(e.endMin)}"
                      >
                        <span class="etitle">${e.title}</span>
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
    const colorBy = this._config.color_by ?? "person";
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
                return html`
                  <div class="wcell ${d === realToday ? "today" : ""}">
                    ${this._eventsFor(d, i).map((e) => {
                      const c = colorBy === "person" ? e.color : e.color;
                      return html`
                        <div class="wchip" style="border-left:2.5px solid ${c};background:${c}22" title="${e.title}">
                          <span>${e.title}</span>
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

console.info("%c FAMILY-BOARD-CARD %c v0.1.0 ", "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px", "background:#222;color:#fff;border-radius:0 3px 3px 0");
