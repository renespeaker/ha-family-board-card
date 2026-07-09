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
  splitAcrossDays,
  layoutDayColumns,
} from "./events";
import {
  localize,
  formatMinutes,
  formatCountdown,
  weekdayNames,
  formatWeekRange,
} from "./localize";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ViewName = "day" | "week" | "month" | "agenda" | "timeline";
const ALL_VIEWS: ViewName[] = ["day", "timeline", "week", "month", "agenda"];

interface PersonConfig {
  name?: string;
  person?: string; // person.* entity -> avatar (entity_picture) + live status
  calendar?: string | string[]; // calendar.* entity/entities -> events
  color?: string; // optional override; default falls back to a palette
  badges?: string[]; // extra entities shown as chips under the person header
}

export interface FamilyBoardConfig extends LovelaceCardConfig {
  persons: PersonConfig[];
  title?: string;
  view?: ViewName;
  views?: ViewName[]; // which views appear in the toggle. default: all
  time_grid?: 15 | 30 | 60;
  start_hour?: number;
  end_hour?: number;
  show_weekends?: boolean;
  show_now_line?: boolean;
  color_by?: "person" | "location" | "calendar";
  dim_past?: boolean; // fade events that already ended. default true
  hide_patterns?: string[]; // hide events whose title matches any pattern
  tentative_patterns?: string[]; // mark events tentative when title matches
  show_progress?: boolean; // progress bar on running events. default true
  weather_entity?: string; // weather.* entity for the daily forecast
  show_weather?: boolean; // show weather in headers. default true when entity set
  refresh_interval?: number; // seconds; 0 disables. default 300
  hour_height?: number; // px per hour in the day view. default 64
  hour_width?: number; // px per hour in the timeline view. default 96
  fit_height?: boolean; // shrink the day view so start..end fits without scroll
  full_height?: boolean; // stretch the board to the bottom of the screen (wall tablet)
  col_min_width?: number; // min px per person column before horizontal scroll. default 120
  hide_empty_persons?: boolean; // week view: skip persons without events that week
  auto_return?: number; // kiosk: minutes of inactivity before returning to the default view. 0=off
  trim_hours?: boolean; // day view: cut empty edge hours so events get the full height. default true
  background_hours?: number; // timed events >= this many hours become a faint band. default 3, 0=off
  max_columns?: number; // max side-by-side columns per person/day. default 3
  first_day?: "monday" | "sunday"; // week start. default monday
  scroll_to_now?: boolean; // auto-scroll day view to current time. default true
}

/** A collapsed "+N more" marker for dense overlap clusters in the day view. */
interface Overflow {
  col: number;
  cols: number;
  startMin: number;
  endMin: number;
  count: number;
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
  recurring?: boolean; // event is part of a recurring series
  recurrenceRange: "" | "THISANDFUTURE"; // scope for edit/delete of a series
  calendarOptions?: string[]; // when a person has several writable calendars
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

// HA weather condition -> mdi icon
const WEATHER_ICON: Record<string, string> = {
  "clear-night": "weather-night",
  cloudy: "weather-cloudy",
  fog: "weather-fog",
  hail: "weather-hail",
  lightning: "weather-lightning",
  "lightning-rainy": "weather-lightning-rainy",
  partlycloudy: "weather-partly-cloudy",
  pouring: "weather-pouring",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  "snowy-rainy": "weather-snowy-rainy",
  sunny: "weather-sunny",
  windy: "weather-windy",
  "windy-variant": "weather-windy-variant",
  exceptional: "weather-cloudy-alert",
};

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

/** Deterministic palette color from a string (for location/calendar coloring). */
const hashColor = (s: string): string => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return FALLBACK_COLORS[h % FALLBACK_COLORS.length];
};

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
export class FamilyBoardCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;
  @state() private _events: BoardEvent[] = [];
  @state() private _view: ViewName = "day";
  @state() private _day: number = (new Date().getDay() + 6) % 7;
  @state() private _weekOffset = 0;
  @state() private _monthOffset = 0;
  @state() private _dialog?: DialogState;
  @state() private _loadError = false;
  @state() private _loading = false;
  @state() private _fitPx = 0; // measured px/min when fit_height is on (0 = not measured)

  private _raw: RawEvent[] = [];
  private _fetchedKey = "";
  private _timer?: number;
  private _tick?: number;
  @state() private _forecast: Record<string, { temp: number; condition: string }> = {};
  private _weatherKey = "";
  private _scrolledKey = "";
  private _restoreFocus?: HTMLElement;
  private _ro?: ResizeObserver;
  private _lastInteract = Date.now();

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
    const enabled = this._enabledViews;
    const wanted = config.view ?? "day";
    this._view = enabled.includes(wanted) ? wanted : enabled[0];
    this._day = this._todayIndex();
    // simple size knobs -> CSS tokens (also overridable via theme/card-mod)
    const colMin = Number(config.col_min_width);
    if (Number.isFinite(colMin) && colMin >= 60) {
      this.style.setProperty("--fb-col-min", `${Math.min(colMin, 400)}px`);
    } else {
      this.style.removeProperty("--fb-col-min");
    }
    if (this.isConnected) this._startTimer();
  }

  /** Views shown in the toggle (config order-independent, default all). */
  private get _enabledViews(): ViewName[] {
    const v = this._config?.views;
    const chosen = Array.isArray(v) ? ALL_VIEWS.filter((x) => v.includes(x)) : [];
    return chosen.length ? chosen : [...ALL_VIEWS];
  }

  /** JS weekday (0=Sun..6=Sat) of the configured week start. */
  private get _firstDayJs(): number {
    return this._config?.first_day === "sunday" ? 0 : 1;
  }
  /** Column index (0..6 from week start) of the real today. */
  private _todayIndex(): number {
    return (new Date().getDay() - this._firstDayJs + 7) % 7;
  }

  public getCardSize(): number {
    return 12;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("keydown", this._onKeyDown);
    document.addEventListener("visibilitychange", this._onVisible);
    window.addEventListener("focus", this._onVisible);
    this._startTimer();
    this.addEventListener("pointerdown", this._onInteract);
    // minute tick so countdowns and progress bars stay live when idle
    this._tick = window.setInterval(() => {
      this._kioskReturn();
      this.requestUpdate();
    }, 60000);
    // recompute the fit-to-height scaling whenever the card is resized
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => requestAnimationFrame(() => this._measureFit()));
      this._ro.observe(this);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeyDown);
    document.removeEventListener("visibilitychange", this._onVisible);
    window.removeEventListener("focus", this._onVisible);
    this.removeEventListener("pointerdown", this._onInteract);
    this._stopTimer();
    if (this._tick) {
      clearInterval(this._tick);
      this._tick = undefined;
    }
    this._ro?.disconnect();
    this._ro = undefined;
  }

  private get _progressOn(): boolean {
    return this._config?.show_progress !== false;
  }
  /** Whether an event is happening right now. */
  private _isCurrent(e: BoardEvent): boolean {
    const n = Date.now();
    return e.ref.start.getTime() <= n && n < e.ref.end.getTime();
  }
  /** Elapsed percentage (0–100) of a currently running event. */
  private _progressPct(e: BoardEvent): number {
    const s = e.ref.start.getTime();
    const en = e.ref.end.getTime();
    if (en <= s) return 0;
    return Math.min(100, Math.max(0, ((Date.now() - s) / (en - s)) * 100));
  }

  private _onInteract = (): void => {
    this._lastInteract = Date.now();
  };

  /** Kiosk mode: after `auto_return` minutes without touch, go back to the default view. */
  private _kioskReturn(): void {
    const min = Number(this._config?.auto_return ?? 0);
    if (!Number.isFinite(min) || min <= 0) return;
    if (Date.now() - this._lastInteract < min * 60000) return;
    if (this._dialog) return; // never yank an open dialog away
    const wanted = this._config.view ?? "day";
    const view = this._enabledViews.includes(wanted) ? wanted : this._enabledViews[0];
    if (this._view !== view) this._view = view;
    if (this._weekOffset !== 0) this._weekOffset = 0;
    if (this._monthOffset !== 0) this._monthOffset = 0;
    this._day = this._todayIndex();
  }

  /** Refresh when the tab/tablet becomes visible again. */
  private _onVisible = (): void => {
    if (document.visibilityState !== "hidden" && this.hass && this._config) this._refetch();
  };

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
      this._maybeFetchWeather();
    }
    if (changed.has("_dialog")) this._manageDialogFocus(changed.get("_dialog") as DialogState);
    this._measureFit();
    this._maybeScrollToNow();
  }

  /**
   * When `fit_height` is on, shrink the day grid so the whole start..end range
   * fits inside the board without scrolling. Only ever scales DOWN from the
   * configured hour height (never blows small days up into giant blocks).
   */
  private _measureFit(): void {
    this._applyFullHeight();
    if (!this._config?.fit_height || this._view !== "day") {
      if (this._fitPx !== 0) this._fitPx = 0;
      return;
    }
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    const header = board.querySelector(".header-row") as HTMLElement | null;
    const allday = board.querySelector(".allday-row") as HTMLElement | null;
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const win = this._dayWindow(day);
    const span = win.endMin - win.startMin;
    if (span <= 0) return;
    const chrome = (header?.offsetHeight ?? 0) + (allday?.offsetHeight ?? 0);
    const avail = board.clientHeight - chrome - 2;
    if (avail <= 0) return;
    const configuredPx =
      Math.min(
        HOUR_HEIGHT_MAX,
        Math.max(HOUR_HEIGHT_MIN, this._config.hour_height ?? DEFAULT_HOUR_HEIGHT),
      ) / 60;
    // shrink to fit, floored at the minimum readable height, capped at configured
    const px = Math.max(HOUR_HEIGHT_MIN / 60, Math.min(configuredPx, avail / span));
    if (Math.abs(px - this._fitPx) > 0.02) this._fitPx = px;
  }

  /**
   * `full_height`: stretch the board down to the bottom of the viewport
   * (wall-tablet / panel view). Applied as inline styles so the default
   * 58vh cap stays for normal dashboards.
   */
  private _applyFullHeight(): void {
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    if (!board) return;
    if (!this._config?.full_height) {
      if (board.style.height) {
        board.style.height = "";
        board.style.maxHeight = "";
      }
      return;
    }
    const top = board.getBoundingClientRect().top + window.scrollY;
    const h = Math.max(200, Math.round(window.innerHeight - top - 16));
    const want = `${h}px`;
    if (board.style.height !== want) {
      board.style.height = want;
      board.style.maxHeight = want;
    }
  }

  /** Scroll the day board so the current time is in view (once per view). */
  private _maybeScrollToNow(): void {
    if (this._view !== "day" || this._config?.scroll_to_now === false) return;
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    if (!this._isRealToday(day)) return;
    const key = `${this._weekOffset}|${this._day}|${this._config?.hour_height}`;
    if (key === this._scrolledKey) return;
    const board = this.renderRoot?.querySelector(".board") as HTMLElement | null;
    const now = this.renderRoot?.querySelector(".nowline") as HTMLElement | null;
    if (!board || !now) return;
    this._scrolledKey = key;
    requestAnimationFrame(() => {
      const target = now.offsetTop - board.clientHeight / 3;
      board.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    });
  }

  /** Focus the first dialog field on open; restore focus on close. */
  private _manageDialogFocus(prev?: DialogState): void {
    if (this._dialog && !prev) {
      this._restoreFocus = (this.renderRoot as ShadowRoot)?.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const input = this.renderRoot?.querySelector(".dialog input") as HTMLElement | null;
        input?.focus();
      });
    } else if (!this._dialog && prev) {
      this._restoreFocus?.focus?.();
      this._restoreFocus = undefined;
    }
  }

  /* ---- data ---------------------------------------------------- */
  private _weekBounds(): { monday: Date; nextMonday: Date } {
    const now = new Date();
    const monday = new Date(now); // "monday" = configured week start
    monday.setHours(0, 0, 0, 0);
    monday.setDate(
      now.getDate() - ((now.getDay() - this._firstDayJs + 7) % 7) + this._weekOffset * 7,
    );
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return { monday, nextMonday };
  }

  /** Grid geometry for the currently shown month (week-start aware). */
  private _monthGrid(): { gridStart: Date; weeks: number; month: number; year: number } {
    const base = new Date();
    const target = new Date(base.getFullYear(), base.getMonth() + this._monthOffset, 1);
    const offset = (target.getDay() - this._firstDayJs + 7) % 7;
    const gridStart = startOfDay(new Date(target.getFullYear(), target.getMonth(), 1 - offset));
    const daysInMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil((offset + daysInMonth) / 7);
    return { gridStart, weeks, month: target.getMonth(), year: target.getFullYear() };
  }

  /** Fetch window for the current view. */
  private _fetchRange(): { start: Date; end: Date } {
    if (this._view === "month") {
      const { gridStart, weeks } = this._monthGrid();
      return { start: gridStart, end: new Date(gridStart.getTime() + weeks * 7 * DAY_MS) };
    }
    const { monday, nextMonday } = this._weekBounds();
    return { start: monday, end: nextMonday };
  }

  private async _maybeFetch(): Promise<void> {
    const cals = this._config.persons.map((p) => this._calsOf(p).join("+")).join(",");
    const scope = this._view === "month" ? `m${this._monthOffset}` : `w${this._weekOffset}`;
    const key = `${scope}|${cals}`;
    if (key === this._fetchedKey) return;
    this._fetchedKey = key;
    await this._fetchEvents();
  }

  /** Force a refresh on next update (e.g. after a mutation or timer). */
  private async _refetch(): Promise<void> {
    this._fetchedKey = "";
    await this._maybeFetch();
  }

  /** Fetch the daily forecast for the configured weather entity (once/day). */
  private async _maybeFetchWeather(): Promise<void> {
    const ent = this._config.weather_entity;
    if (!ent || this._config.show_weather === false || !this.hass.states[ent]) {
      if (Object.keys(this._forecast).length) this._forecast = {};
      this._weatherKey = "";
      return;
    }
    const key = `${ent}|${new Date().toISOString().slice(0, 10)}`;
    if (key === this._weatherKey) return;
    this._weatherKey = key;
    try {
      const res: any = await this.hass.callWS({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: ent },
        return_response: true,
      });
      const list: any[] = res?.response?.[ent]?.forecast ?? [];
      const map: Record<string, { temp: number; condition: string }> = {};
      for (const f of list) {
        if (!f?.datetime) continue;
        map[toLocalDate(new Date(f.datetime))] = {
          temp: Math.round(f.temperature),
          condition: f.condition,
        };
      }
      this._forecast = map;
    } catch (e) {
      this._forecast = {};
    }
  }

  /** Small weather chip (icon + temperature) for a given date, or nothing. */
  private _weatherChip(date: Date) {
    const f = this._forecast[toLocalDate(date)];
    if (!f) return nothing;
    const icon = WEATHER_ICON[f.condition] || "weather-cloudy";
    const unit = (this.hass.config as any)?.unit_system?.temperature ?? "°";
    return html`<span class="wx" title=${f.condition}>
      <ha-icon icon="mdi:${icon}"></ha-icon>${f.temp}${unit}
    </span>`;
  }

  /** Whether an event title matches a configured hide pattern (case-insensitive). */
  private _hidden(summary: string): boolean {
    const pats = this._config.hide_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  /** Whether an event title marks it as tentative/provisional (case-insensitive). */
  private _matchesTentative(summary: string): boolean {
    const pats = this._config.tentative_patterns;
    if (!Array.isArray(pats) || pats.length === 0) return false;
    const s = summary.toLowerCase();
    return pats.some((p) => {
      const pat = String(p).trim().toLowerCase();
      return pat.length > 0 && s.includes(pat);
    });
  }

  private async _fetchEvents(): Promise<void> {
    const { start, end } = this._fetchRange();
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const raws: RawEvent[] = [];
    let anyError = false;
    this._loading = true;

    await Promise.all(
      this._config.persons.flatMap((p, idx) => {
        const color = personColor(p, idx);
        return this._calsOf(p)
          .filter((cal) => this.hass.states[cal])
          .map(async (cal) => {
            try {
              const events = await this.hass.callApi<any[]>(
                "GET",
                `calendars/${cal}?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`,
              );
              for (const ev of events) {
                const raw = parseRawEvent(ev, idx, cal, color);
                if (raw && !this._hidden(raw.summary)) {
                  if (this._matchesTentative(raw.summary)) raw.tentative = true;
                  raws.push(raw);
                }
              }
            } catch (err) {
              anyError = true;
            }
          });
      }),
    );
    this._raw = raws;
    // Week views index events by weekday; month builds its own grid from _raw.
    const { monday } = this._weekBounds();
    this._events = this._view === "month" ? [] : raws.flatMap((r) => splitIntoSegments(r, monday));
    this._loadError = anyError && raws.length === 0;
    this._loading = false;
  }

  /* ---- capabilities -------------------------------------------- */
  /** A person's calendars, normalized to a (possibly empty) array. */
  private _calsOf(p: PersonConfig): string[] {
    if (Array.isArray(p.calendar)) return p.calendar.filter(Boolean);
    return p.calendar ? [p.calendar] : [];
  }
  /** Calendars of a person that allow creating events. */
  private _writableCals(p: PersonConfig): string[] {
    return this._calsOf(p).filter((c) => this._canCreate(c));
  }
  /** Whether the person's add (+) affordance should be shown. */
  private _personCanCreate(p: PersonConfig): boolean {
    return this._writableCals(p).length > 0;
  }
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
  /** Pixels per minute, derived from the configurable hour height (or fit mode). */
  private get _pxPerMin(): number {
    if (this._config.fit_height && this._fitPx > 0) return this._fitPx;
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
  /**
   * Visible minute window of the day view. With `trim_hours` (default on) the
   * configured start/end window is shrunk to the hours that actually contain
   * events, so the occupied part of the day gets the full height instead of
   * being squeezed by empty morning/evening hours.
   */
  private _dayWindow(day: number): { startMin: number; endMin: number } {
    const cfgStart = this._startMin;
    const cfgEnd = this._endMin;
    if (this._config.trim_hours === false) return { startMin: cfgStart, endMin: cfgEnd };
    const evs = this._events.filter((e) => e.day === day && !e.allDay);
    if (evs.length === 0) return { startMin: cfgStart, endMin: cfgEnd };
    let first = Math.min(...evs.map((e) => e.startMin));
    let last = Math.max(...evs.map((e) => e.endMin));
    // keep the now-line visible on today
    if (this._isRealToday(day)) {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      if (nowMin >= cfgStart && nowMin <= cfgEnd) {
        first = Math.min(first, nowMin);
        last = Math.max(last, nowMin);
      }
    }
    let s = Math.max(cfgStart, Math.floor(first / 60) * 60);
    let e = Math.min(cfgEnd, Math.ceil(last / 60) * 60);
    // never shrink below a sane 6-hour window
    const MIN_WINDOW = 6 * 60;
    if (e - s < MIN_WINDOW) {
      e = Math.min(cfgEnd, s + MIN_WINDOW);
      s = Math.max(cfgStart, e - MIN_WINDOW);
    }
    return { startMin: s, endMin: e };
  }
  /** Column index (0..6 from week start) -> JS weekday (0=Sun..6=Sat). */
  private _jsDay(index: number): number {
    return (this._firstDayJs + index) % 7;
  }
  private get _visibleDays(): number[] {
    const all = [0, 1, 2, 3, 4, 5, 6];
    if (this._config.show_weekends === false) {
      return all.filter((i) => {
        const js = this._jsDay(i);
        return js !== 0 && js !== 6; // hide Sat/Sun wherever they fall
      });
    }
    return all;
  }
  private _t(key: string): string {
    return localize(this.hass, key);
  }
  /** Color for an event respecting the color_by option. */
  private _eventColor(e: BoardEvent): string {
    const by = this._config.color_by;
    if (by === "location" && e.location) return hashColor(e.location);
    if (by === "calendar" && e.ref.calendar) return hashColor(e.ref.calendar);
    return e.color;
  }
  /** Whether an event has already ended (for dimming). */
  private _isPast(e: BoardEvent): boolean {
    return this._config.dim_past !== false && e.ref.end.getTime() <= Date.now();
  }
  /** Localized "Today"/"Tomorrow"/"Yesterday" for a date, else null. */
  private _relativeDay(date: Date): string | null {
    const diff = Math.round(
      (startOfDay(date).getTime() - startOfDay(new Date()).getTime()) / DAY_MS,
    );
    if (diff === 0) return this._t("today");
    if (diff === 1) return this._t("tomorrow");
    if (diff === -1) return this._t("yesterday");
    return null;
  }
  private _timedFor(day: number, idx: number): LaidOutEvent[] {
    const evs = this._events.filter(
      (e) => e.day === day && e.personIdx === idx && !e.allDay && !this._isBackground(e),
    );
    return layoutDayColumns(evs);
  }
  /** Threshold (minutes) at/above which a timed event becomes a background band. */
  private _bgMinMin(): number {
    const h = Number(this._config.background_hours ?? 3);
    if (!Number.isFinite(h) || h <= 0) return 0; // 0 disables background bands
    return h * 60;
  }
  /** Long, day-spanning events (e.g. OGS/Freispiel) shown as a faint full-width band. */
  private _isBackground(e: BoardEvent): boolean {
    const min = this._bgMinMin();
    return min > 0 && !e.allDay && e.endMin - e.startMin >= min;
  }
  /** Background-band segments for a person/day, longest first (so they stack cleanly). */
  private _bgFor(day: number, idx: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx && !e.allDay && this._isBackground(e))
      .sort((a, b) => b.endMin - b.startMin - (a.endMin - a.startMin));
  }
  /** Max side-by-side columns before dense overlaps collapse into a "+N" chip. */
  private _maxCols(): number {
    const n = Number(this._config.max_columns);
    if (!Number.isFinite(n) || n < 1) return 3;
    return Math.min(Math.round(n), 8);
  }
  /**
   * Cap the per-day overlap columns so events stay readable. Clusters with more
   * columns than `max_columns` keep the first columns and collapse the rest into
   * one "+N" overflow chip in the last column.
   */
  private _dayLayout(day: number, idx: number): { events: LaidOutEvent[]; overflows: Overflow[] } {
    const laid = this._timedFor(day, idx);
    const maxCols = this._maxCols();
    const byCluster = new Map<number, LaidOutEvent[]>();
    for (const e of laid) {
      const g = byCluster.get(e.cluster);
      if (g) g.push(e);
      else byCluster.set(e.cluster, [e]);
    }
    const events: LaidOutEvent[] = [];
    const overflows: Overflow[] = [];
    for (const group of byCluster.values()) {
      const trueCols = group[0].cols;
      if (trueCols <= maxCols) {
        events.push(...group);
        continue;
      }
      // Keep columns 0..maxCols-2, reserve the last column for the overflow chip.
      let count = 0;
      let startMin = Infinity;
      let endMin = -Infinity;
      for (const e of group) {
        if (e.col <= maxCols - 2) {
          events.push({
            ...e,
            cols: maxCols,
            span: Math.max(1, Math.min(e.span, maxCols - e.col)),
          });
        } else {
          count++;
          startMin = Math.min(startMin, e.startMin);
          endMin = Math.max(endMin, e.endMin);
        }
      }
      if (count > 0) {
        overflows.push({ col: maxCols - 1, cols: maxCols, startMin, endMin, count });
      }
    }
    return { events, overflows };
  }
  /** Whether an event is flagged tentative/provisional. */
  private _isTentative(e: BoardEvent): boolean {
    return e.ref.tentative === true;
  }
  /** Jump to the agenda list for a given weekday so collapsed events stay reachable. */
  private _showDayAgenda(day: number): void {
    this._day = day;
    if (this._enabledViews.includes("agenda")) this._view = "agenda";
  }
  /** Jump from the week view into the day view of a given weekday. */
  private _openDayView(day: number): void {
    this._day = day;
    if (this._enabledViews.includes("day")) this._view = "day";
  }
  private _allDayFor(day: number, idx: number): BoardEvent[] {
    return this._events.filter((e) => e.day === day && e.personIdx === idx && e.allDay);
  }
  private _eventsFor(day: number, idx: number): BoardEvent[] {
    return this._events
      .filter((e) => e.day === day && e.personIdx === idx)
      .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin);
  }
  /** Week-start-based column index -> absolute Date in the shown week. */
  private _dateForDay(day: number): Date {
    const { monday } = this._weekBounds();
    return new Date(monday.getTime() + day * DAY_MS);
  }
  private _isRealToday(day: number): boolean {
    return this._weekOffset === 0 && day === this._todayIndex();
  }
  /** Open an item on Enter/Space for keyboard users. */
  private _onItemKey(e: KeyboardEvent, ev: BoardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      this._openEvent(ev);
    }
  }
  private _dayHasEvents(day: number): boolean {
    return this._persons.some((_, i) => this._eventsFor(day, i).length > 0);
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

  /** Small entity chips (battery, sensors …) under a person header. */
  private _badges(p: PersonConfig) {
    const ids = Array.isArray(p.badges) ? p.badges.filter(Boolean) : [];
    if (ids.length === 0) return nothing;
    return html`<div class="pbadges">
      ${ids.map((id) => {
        const st = this.hass.states[id];
        if (!st) return nothing;
        const icon = st.attributes?.icon as string | undefined;
        const unit = (st.attributes?.unit_of_measurement as string | undefined) ?? "";
        return html`<span
          class="pbadge"
          title=${(st.attributes?.friendly_name as string | undefined) ?? id}
          role="button"
          tabindex="0"
          @click=${(ev: MouseEvent) => {
            ev.stopPropagation();
            this._moreInfo(id);
          }}
          @keydown=${(k: KeyboardEvent) => {
            if (k.key === "Enter" || k.key === " ") {
              k.preventDefault();
              this._moreInfo(id);
            }
          }}
        >
          ${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}
          <span>${st.state}${unit}</span>
        </span>`;
      })}
    </div>`;
  }

  /** Open the standard HA more-info dialog for an entity. */
  private _moreInfo(entityId: string): void {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  private _prevWeek = () => {
    this._weekOffset -= 1;
  };
  private _nextWeek = () => {
    this._weekOffset += 1;
  };
  private _thisWeek = () => {
    this._weekOffset = 0;
    this._day = this._todayIndex();
  };
  private _prevMonth = () => {
    this._monthOffset -= 1;
  };
  private _nextMonth = () => {
    this._monthOffset += 1;
  };
  private _thisMonth = () => {
    this._monthOffset = 0;
  };
  /** Jump to the day view for a specific date (from the month grid). */
  private _goToDate(date: Date): void {
    const today = startOfDay(new Date());
    const toWeekStart = (d: Date) => {
      const s = startOfDay(d);
      s.setDate(s.getDate() - ((s.getDay() - this._firstDayJs + 7) % 7));
      return s;
    };
    const weeks = Math.round(
      (toWeekStart(date).getTime() - toWeekStart(today).getTime()) / (7 * DAY_MS),
    );
    this._weekOffset = weeks;
    this._day = (date.getDay() - this._firstDayJs + 7) % 7;
    this._view = this._enabledViews.includes("day") ? "day" : this._view;
  }

  /* ---- render -------------------------------------------------- */
  protected render() {
    if (!this._config || !this.hass) return nothing;
    const title = this._config.title ?? this._t("board_title");
    return html`
      <ha-card>
        <div class="top">
          <div class="title">${title}</div>
          ${this._enabledViews.length > 1
            ? html`<div class="switch" role="tablist">
                ${this._enabledViews.map(
                  (v) =>
                    html`<button
                      role="tab"
                      aria-selected=${this._view === v}
                      class=${this._view === v ? "on" : ""}
                      @click=${() => (this._view = v)}
                    >
                      ${this._t(v)}
                    </button>`,
                )}
              </div>`
            : nothing}
        </div>
        ${this._view === "day"
          ? this._renderDay()
          : this._view === "timeline"
            ? this._renderTimeline()
            : this._view === "week"
              ? this._renderWeek()
              : this._view === "month"
                ? this._renderMonth()
                : this._renderAgenda()}
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
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
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
    const { startMin, endMin } = this._dayWindow(day);
    const height = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long", this._firstDayJs);

    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);

    const now = new Date();
    const nowMin = Math.max(startMin, Math.min(endMin, now.getHours() * 60 + now.getMinutes()));
    const showNow = this._config.show_now_line !== false && this._isRealToday(day);
    const hasAllDay = this._persons.some((_, i) => this._allDayFor(day, i).length > 0);

    return html`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(day)) ?? full[day]}
          ${this._weatherChip(this._dateForDay(day))}${this._loading && this._raw.length === 0
            ? html`<span class="spinner"></span>`
            : nothing}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="board">
        <div class="header-row">
          <div class="axis-spacer"></div>
          ${this._persons.map((p, i) => {
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            return html`
              <div class="phead">
                ${this._avatar(p, i)}
                <div class="pname">${this._personName(p, i)}</div>
                <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
                ${this._badges(p)}
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
                        const tent = this._isTentative(e);
                        return html`
                          <div
                            class="adchip ${tent ? "tentative" : ""}"
                            style="border-left:3px ${tent
                              ? "dashed"
                              : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                            title="${e.title}"
                            tabindex="0"
                            role="button"
                            @click=${() => this._openEvent(e)}
                            @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
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
            const canCreate = this._personCanCreate(p);
            const layout = this._dayLayout(day, i);
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
                ${this._bgFor(day, i)
                  .filter((e) => e.endMin > startMin && e.startMin < endMin)
                  .map((e, bi) => {
                    const top = (e.startMin - startMin) * px;
                    const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                    const c = this._eventColor(e);
                    const tent = this._isTentative(e);
                    return html`
                      <div
                        class="band ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                        tabindex="0"
                        role="button"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._openEvent(e);
                        }}
                        @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                        style="top:${top + 1.5}px;height:${h}px;
                               border:1.5px dashed ${c}55;
                               background:${c}0d;
                               background:repeating-linear-gradient(45deg,
                                 color-mix(in srgb, ${c} 8%, transparent) 0 8px,
                                 transparent 8px 16px)"
                        title="${e.title} · ${formatMinutes(this.hass, e.startMin)}–${formatMinutes(
                          this.hass,
                          e.endMin,
                        )}"
                      >
                        <span
                          class="etitle"
                          style="margin-top:${bi * 19}px;
                                 background:${c}26;
                                 background:color-mix(in srgb, ${c} 16%, var(--card-background-color, #fff))"
                          >${e.continuesBefore ? "« " : ""}${e.title}${e.continuesAfter
                            ? " »"
                            : ""}</span
                        >
                      </div>
                    `;
                  })}
                ${(() => {
                  // consecutive full-width mini events sit at min block height;
                  // nudge each one below the previous strip so labels never stack
                  let lastSlimBottom = -Infinity;
                  return layout.events
                    .filter((e) => e.endMin > startMin && e.startMin < endMin)
                    .map((e) => {
                      let top = (e.startMin - startMin) * px;
                      const h = Math.max((e.endMin - e.startMin) * px - 3, 16);
                      const c = this._eventColor(e);
                      const leftPct = (e.col / e.cols) * 100;
                      const widthPct = ((e.span ?? 1) / e.cols) * 100;
                      const tent = this._isTentative(e);
                      const slim = h < 24; // very short events: single-line strip on top
                      if (slim && e.cols === 1) {
                        top = Math.max(top, lastSlimBottom + 1);
                        lastSlimBottom = top + h;
                      }
                      return html`
                        <div
                          class="event ${this._isPast(e) ? "past" : ""} ${tent
                            ? "tentative"
                            : ""} ${slim ? "slim" : ""}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px);
                               border-left:3px ${tent ? "dashed" : "solid"} ${c};
                               background:${c}40;
                               background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff))"
                          title="${e.title} · ${formatMinutes(
                            this.hass,
                            e.startMin,
                          )}–${formatMinutes(this.hass, e.endMin)}"
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
                          ${this._progressOn && this._isCurrent(e)
                            ? html`<div class="eprog">
                                <div style="width:${this._progressPct(e)}%"></div>
                              </div>`
                            : nothing}
                        </div>
                      `;
                    });
                })()}
                ${layout.overflows
                  .filter((o) => o.endMin > startMin && o.startMin < endMin)
                  .map((o) => {
                    const top = (o.startMin - startMin) * px;
                    const h = Math.max((o.endMin - o.startMin) * px - 3, 16);
                    const leftPct = (o.col / o.cols) * 100;
                    const widthPct = 100 / o.cols;
                    return html`
                      <div
                        class="event overflow"
                        tabindex="0"
                        role="button"
                        title="${o.count} ${this._t("more_events")}"
                        @click=${(ev: MouseEvent) => {
                          ev.stopPropagation();
                          this._showDayAgenda(day);
                        }}
                        @keydown=${(k: KeyboardEvent) => {
                          if (k.key === "Enter" || k.key === " ") {
                            k.preventDefault();
                            this._showDayAgenda(day);
                          }
                        }}
                        style="top:${top + 1.5}px;height:${h}px;
                               left:calc(${leftPct}% + 2px);width:calc(${widthPct}% - 4px)"
                      >
                        <span class="etitle">+${o.count}</span>
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
          ${!this._loading && !this._loadError && !this._dayHasEvents(day)
            ? html`<div class="empty">${this._t("no_events")}</div>`
            : nothing}
        </div>
      </div>
    `;
  }

  /** Horizontal timeline: persons as rows on the left, time flowing left → right. */
  private _renderTimeline() {
    const day = this._visibleDays.includes(this._day) ? this._day : this._visibleDays[0];
    const { startMin, endMin } = this._dayWindow(day);
    const hourPx = Math.min(240, Math.max(48, Number(this._config.hour_width) || 96));
    const px = hourPx / 60;
    const width = (endMin - startMin) * px;
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const hours: number[] = [];
    for (let h = startMin / 60; h <= endMin / 60; h++) hours.push(h);
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const showNow =
      this._config.show_now_line !== false &&
      this._isRealToday(day) &&
      nowMin >= startMin &&
      nowMin <= endMin;
    const LANE = 30;

    return html`
      <div class="dayhead">
        <span class="dayname">
          ${this._relativeDay(this._dateForDay(day)) ?? full[day]}
          ${this._weatherChip(this._dateForDay(day))}${this._loading && this._raw.length === 0
            ? html`<span class="spinner"></span>`
            : nothing}
        </span>
        ${this._weekNav()}
      </div>
      ${this._renderDayTabs()}
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="tlwrap">
        <div class="tlgrid" style="min-width:calc(var(--fb-tl-label, 150px) + ${width}px)">
          <div class="tlhead">
            <div class="tlcorner"></div>
            <div class="tlhours" style="width:${width}px">
              ${hours.map(
                (h) =>
                  html`<span class="tlhour" style="left:${(h * 60 - startMin) * px}px"
                    >${pad(h)}:00</span
                  >`,
              )}
            </div>
          </div>
          ${this._persons.map((p, i) => {
            const evs = this._events.filter((e) => e.day === day && e.personIdx === i);
            const laid = layoutDayColumns(evs);
            const lanes = laid.length ? Math.max(...laid.map((e) => e.cols)) : 1;
            const canCreate = this._personCanCreate(p);
            const stateObj = p.person ? this.hass.states[p.person] : undefined;
            return html`
              <div class="tlrow">
                <div class="tlperson">
                  ${this._avatar(p, i)}
                  <div>
                    <div class="pname">${this._personName(p, i)}</div>
                    <div class="pstatus">${stateObj ? this._statusLabel(stateObj.state) : ""}</div>
                  </div>
                </div>
                <div
                  class="tlcanvas ${canCreate ? "creatable" : ""}"
                  style="width:${width}px;height:${lanes * LANE + 8}px;
                         background-image:repeating-linear-gradient(90deg, var(--fb-hourline) 0 1px, transparent 1px ${hourPx}px),
                         repeating-linear-gradient(90deg, var(--fb-halfhour) 0 1px, transparent 1px ${hourPx /
                  2}px)"
                  @click=${(ev: MouseEvent) => this._onTimelineClick(ev, i, day, px, startMin)}
                >
                  ${laid
                    .filter((e) => e.endMin > startMin && e.startMin < endMin)
                    .map((e) => {
                      const s = Math.max(e.startMin, startMin);
                      const en = Math.min(e.endMin, endMin);
                      const w = Math.max((en - s) * px - 3, 20);
                      const c = this._eventColor(e);
                      const tent = this._isTentative(e);
                      const before = e.continuesBefore || e.startMin < startMin;
                      const after = e.continuesAfter || e.endMin > endMin;
                      return html`
                        <div
                          class="tlbar ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
                          style="left:${(s - startMin) * px + 1.5}px;width:${w}px;
                                 top:${e.col * LANE + 4}px;height:${LANE - 6}px;
                                 border-left:3px ${tent ? "dashed" : "solid"} ${c};
                                 background:${c}40;
                                 background:color-mix(in srgb, ${c} 32%, var(--card-background-color, #fff))"
                          title="${e.title}${e.allDay
                            ? ` · ${this._t("all_day")}`
                            : ` · ${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`}"
                        >
                          <span class="etitle"
                            >${before ? "« " : ""}${e.title}${after ? " »" : ""}</span
                          >
                          ${!e.allDay && w > 120
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
              </div>
            `;
          })}
          ${showNow
            ? html`<div
                class="tlnow"
                style="left:calc(var(--fb-tl-label, 150px) + ${(nowMin - startMin) * px}px)"
              >
                <span>${formatMinutes(this.hass, nowMin)}</span>
              </div>`
            : nothing}
        </div>
        ${!this._loading && !this._loadError && !this._dayHasEvents(day)
          ? html`<div class="empty">${this._t("no_events")}</div>`
          : nothing}
      </div>
    `;
  }

  private _onTimelineClick(
    ev: MouseEvent,
    idx: number,
    day: number,
    px: number,
    startMin: number,
  ): void {
    const p = this._persons[idx];
    if (!this._personCanCreate(p)) return;
    const target = ev.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetX = ev.clientX - rect.left;
    let min = startMin + offsetX / px;
    const grid = this._grid;
    min = Math.round(min / grid) * grid;
    min = Math.max(0, Math.min(min, 24 * 60 - grid));
    this._openCreate(idx, day, min);
  }

  private _renderWeek() {
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    // optionally hide persons without any events in the shown week
    const people = this._persons
      .map((p, i) => ({ p, i }))
      .filter(
        ({ i }) =>
          this._config.hide_empty_persons !== true || this._events.some((e) => e.personIdx === i),
      );
    const shown = people.length > 0 ? people : this._persons.map((p, i) => ({ p, i }));
    const cols = `70px repeat(${shown.length}, minmax(110px, 1fr))`;
    return html`
      <div class="weekhead">${this._weekNav()}</div>
      <div class="weekwrap">
        <div class="weekgrid" style="grid-template-columns:${cols}">
          <div class="corner"></div>
          ${shown.map(
            ({ p, i }) =>
              html`<div class="wphead">
                ${this._avatar(p, i)}<span>${this._personName(p, i)}</span>
              </div>`,
          )}
          ${this._visibleDays.map(
            (d) => html`
              <div
                class="wday ${this._isRealToday(d) ? "today" : ""}"
                role="button"
                tabindex="0"
                title=${this._t("day")}
                @click=${() => this._openDayView(d)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._openDayView(d);
                  }
                }}
              >
                <b>${short[d]}</b>
              </div>
              ${shown.map(({ p, i }) => {
                const canCreate = this._personCanCreate(p);
                return html`
                  <div
                    class="wcell ${this._isRealToday(d) ? "today" : ""} ${canCreate
                      ? "creatable"
                      : ""}"
                    @click=${() => canCreate && this._openCreate(i, d)}
                  >
                    ${this._eventsFor(d, i).map((e) => {
                      const c = this._eventColor(e);
                      const tent = this._isTentative(e);
                      return html`
                        <div
                          class="wchip ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                          style="border-left:2.5px ${tent
                            ? "dashed"
                            : "solid"} ${c};background:${c}30;background:color-mix(in srgb, ${c} 22%, var(--card-background-color, #fff))"
                          title="${e.title}"
                          tabindex="0"
                          role="button"
                          @click=${(ev: MouseEvent) => {
                            ev.stopPropagation();
                            this._openEvent(e);
                          }}
                          @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
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

  private _renderAgenda() {
    const full = weekdayNames(this.hass, "long", this._firstDayJs);
    const dateFmt = new Intl.DateTimeFormat(this.hass.locale?.language || "en", {
      day: "numeric",
      month: "short",
    });
    const groups = this._visibleDays
      .map((d) => ({
        d,
        items: this._events
          .filter((e) => e.day === d)
          .sort((a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin),
      }))
      .filter((g) => g.items.length > 0);

    return html`
      <div class="weekhead">${this._weekNav()}</div>
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="agenda">
        ${groups.length === 0
          ? html`<div class="agenda-empty">
              ${this._loading ? html`<span class="spinner"></span>` : this._t("no_events")}
            </div>`
          : groups.map(
              (g) => html`
                <div class="agenda-day">
                  <div class="agenda-date ${this._isRealToday(g.d) ? "today" : ""}">
                    ${this._relativeDay(this._dateForDay(g.d)) ?? full[g.d]} ·
                    ${dateFmt.format(this._dateForDay(g.d))}
                    ${this._weatherChip(this._dateForDay(g.d))}
                  </div>
                  ${g.items.map((e) => this._agendaRow(e))}
                </div>
              `,
            )}
      </div>
    `;
  }

  private _agendaRow(e: BoardEvent) {
    const c = this._eventColor(e);
    const name = this._personName(this._persons[e.personIdx], e.personIdx);
    const time = e.allDay
      ? this._t("all_day")
      : `${formatMinutes(this.hass, e.startMin)}–${formatMinutes(this.hass, e.endMin)}`;
    const current = this._isCurrent(e);
    const tent = this._isTentative(e);
    const countdown =
      !e.allDay && !current && !e.continuesBefore ? formatCountdown(this.hass, e.ref.start) : "";
    return html`
      <div
        class="agenda-row ${this._isPast(e) ? "past" : ""} ${current ? "current" : ""} ${tent
          ? "tentative"
          : ""}"
        tabindex="0"
        role="button"
        @click=${() => this._openEvent(e)}
        @keydown=${(k: KeyboardEvent) => this._onItemKey(k, e)}
      >
        <span class="agenda-time">${time}</span>
        <span class="agenda-bar" style="background:${c}"></span>
        <span class="agenda-main">
          <span class="agenda-title"
            >${e.continuesBefore ? "« " : ""}${e.title}${e.continuesAfter ? " »" : ""}</span
          >
          <span class="agenda-meta">${name}${e.location ? ` · ${e.location}` : ""}</span>
          ${current && this._progressOn
            ? html`<span class="agenda-prog"
                ><span style="width:${this._progressPct(e)}%;background:${c}"></span
              ></span>`
            : nothing}
        </span>
        ${countdown ? html`<span class="agenda-cd">${countdown}</span>` : nothing}
      </div>
    `;
  }

  private _renderMonth() {
    const { gridStart, weeks, month, year } = this._monthGrid();
    const numDays = weeks * 7;
    const short = weekdayNames(this.hass, "short", this._firstDayJs);
    const locale = this.hass.locale?.language || "en";
    const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
      new Date(year, month, 1),
    );
    const byDay = new Map<number, BoardEvent[]>();
    for (const r of this._raw) {
      for (const s of splitAcrossDays(r, gridStart, numDays)) {
        const arr = byDay.get(s.day);
        if (arr) arr.push(s);
        else byDay.set(s.day, [s]);
      }
    }
    const today = startOfDay(new Date()).getTime();
    const maxChips = 3;
    return html`
      <div class="weekhead">
        <div class="weeknav">
          <button class="nav" aria-label=${this._t("prev_month")} @click=${this._prevMonth}>
            ‹
          </button>
          <button class="nav-now" @click=${this._thisMonth}>${monthName}</button>
          <button class="nav" aria-label=${this._t("next_month")} @click=${this._nextMonth}>
            ›
          </button>
        </div>
      </div>
      ${this._loadError ? html`<div class="banner">${this._t("load_error")}</div>` : nothing}
      <div class="monthwrap">
        <div class="monthhead">${short.map((s) => html`<div class="mhcell">${s}</div>`)}</div>
        <div class="monthgrid">
          ${Array.from({ length: numDays }, (_, d) => {
            const date = new Date(gridStart.getTime() + d * DAY_MS);
            const inMonth = date.getMonth() === month;
            const isToday = date.getTime() === today;
            const items = (byDay.get(d) || []).sort(
              (a, b) => Number(b.allDay) - Number(a.allDay) || a.startMin - b.startMin,
            );
            return html`
              <div
                class="mcell ${inMonth ? "" : "out"} ${isToday ? "today" : ""} ${date.getDay() ===
                  0 || date.getDay() === 6
                  ? "wkend"
                  : ""}"
                role="button"
                tabindex="0"
                @click=${() => this._goToDate(date)}
                @keydown=${(k: KeyboardEvent) => {
                  if (k.key === "Enter" || k.key === " ") {
                    k.preventDefault();
                    this._goToDate(date);
                  }
                }}
              >
                <div class="mdate ${isToday ? "today" : ""}">${date.getDate()}</div>
                <div class="mchips">
                  ${items.slice(0, maxChips).map((e) => {
                    const col = this._eventColor(e);
                    const tent = this._isTentative(e);
                    return html`<div
                      class="mchip ${this._isPast(e) ? "past" : ""} ${tent ? "tentative" : ""}"
                      style="background:${col}30;background:color-mix(in srgb, ${col} 22%, var(--card-background-color, #fff));border-left:2px ${tent
                        ? "dashed"
                        : "solid"} ${col}"
                      title="${e.title}"
                      @click=${(ev: MouseEvent) => {
                        ev.stopPropagation();
                        this._openEvent(e);
                      }}
                    >
                      ${e.continuesBefore ? "« " : ""}${e.title}
                    </div>`;
                  })}
                  ${items.length > maxChips
                    ? html`<div class="mmore">+${items.length - maxChips}</div>`
                    : nothing}
                </div>
              </div>
            `;
          })}
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
    if (!this._personCanCreate(p)) return;
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
    const writable = this._writableCals(p);
    if (writable.length === 0) return;
    const base = startOfDay(this._dateForDay(day));
    const sMin = startMin ?? Math.max(this._startMin, 9 * 60);
    const start = new Date(base.getTime() + sMin * 60000);
    const end = new Date(start.getTime() + 60 * 60000);
    this._dialog = {
      mode: "create",
      personIdx: idx,
      calendar: writable[0],
      calendarOptions: writable.length > 1 ? writable : undefined,
      canUpdate: true,
      canDelete: false,
      summary: "",
      location: "",
      description: "",
      allDay: false,
      start: toLocalInput(start),
      end: toLocalInput(end),
      recurrenceRange: "",
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
      recurring: !!(raw.recurrence_id || raw.rrule),
      recurrenceRange: "",
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
          recurrence_range: d.recurring ? d.recurrenceRange : "",
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
        recurrence_range: d.recurring ? d.recurrenceRange : "",
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
          ${d.calendarOptions && d.calendarOptions.length > 1
            ? html`<label class="fld">
                <span>${this._t("field_calendar")}</span>
                <select
                  .value=${d.calendar}
                  @change=${(e: Event) =>
                    this._dlgField("calendar", (e.target as HTMLSelectElement).value)}
                >
                  ${d.calendarOptions.map(
                    (c) =>
                      html`<option value=${c} ?selected=${c === d.calendar}>
                        ${this.hass.states[c]?.attributes?.friendly_name || c}
                      </option>`,
                  )}
                </select>
              </label>`
            : html`<div class="dlg-cal">${calName}</div>`}

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
            <span>
              ${this._t("field_location")}
              ${d.location.trim()
                ? html`<a
                    class="maplink"
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      d.location,
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click=${(e: Event) => e.stopPropagation()}
                    >${this._t("open_map")}</a
                  >`
                : nothing}
            </span>
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

          ${d.mode === "edit" && d.recurring && !readOnly
            ? html`<div class="recur">
                <span class="recur-label">${this._t("recurring")}</span>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${d.recurrenceRange === ""}
                    @change=${() => this._dlgField("recurrenceRange", "")}
                  />
                  <span>${this._t("recur_this")}</span>
                </label>
                <label class="recur-opt">
                  <input
                    type="radio"
                    name="recur"
                    ?checked=${d.recurrenceRange === "THISANDFUTURE"}
                    @change=${() => this._dlgField("recurrenceRange", "THISANDFUTURE")}
                  />
                  <span>${this._t("recur_future")}</span>
                </label>
              </div>`
            : nothing}
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
      /* customization tokens — override via theme or card-mod */
      --fb-accent: var(--primary-color);
      --fb-now-color: var(--error-color, #ff5252);
      --fb-radius: 7px;
      --fb-radius-sm: 5px;
      --fb-avatar-size: 34px;
      --fb-past-opacity: 0.5;
      --fb-title-size: 16px;
      --fb-name-size: 13px;
      --fb-event-size: 11.5px;
      --fb-time-size: 9.5px;
      --fb-chip-size: 10.5px;
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
      font-size: var(--fb-title-size);
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
      padding: 5px 12px;
      border-radius: 999px;
      font: inherit;
      font-size: 13px;
      transition:
        background 0.12s ease,
        color 0.12s ease;
    }
    .switch button:hover:not(.on),
    .tabs button:hover:not(.on) {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .switch button.on,
    .tabs button.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 600;
      box-shadow: 0 1px 4px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }
    .tabs button.today:not(.on) {
      box-shadow: inset 0 -2px 0 var(--fb-accent);
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
      font-weight: 700;
      font-size: 15.5px;
      display: inline-flex;
      align-items: center;
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
    .spinner {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      vertical-align: middle;
      border: 2px solid var(--divider-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: fb-spin 0.7s linear infinite;
    }
    @keyframes fb-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2s;
      }
    }
    .empty {
      position: absolute;
      top: 0;
      left: var(--fb-axis-width, 56px);
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      font-size: 13px;
      pointer-events: none;
    }
    .board {
      max-height: var(--fb-board-max-height, 58vh);
      overflow: auto;
      margin-top: 8px;
    }
    /* keep header, all-day and body columns pixel-aligned: borders must not
       change box width, or the vertical dividers break between the rows. */
    .axis-spacer,
    .phead,
    .axis,
    .col,
    .allday-cell,
    .allday-label {
      box-sizing: border-box;
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
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
      position: sticky;
      left: 0;
      background: inherit;
    }
    .phead {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      padding: var(--fb-head-pad, 10px 6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-left: 1px solid var(--divider-color);
      position: relative;
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
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      border-left: 1px solid var(--divider-color);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .adchip {
      border-radius: var(--fb-radius-sm);
      padding: 2px 6px;
      font-size: var(--fb-chip-size);
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .avatar {
      width: var(--fb-avatar-size);
      height: var(--fb-avatar-size);
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
      font-size: var(--fb-name-size);
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
      width: var(--fb-axis-width, 56px);
      flex: 0 0 var(--fb-axis-width, 56px);
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
    /* first hour label would be clipped by the header above */
    .hour:first-child {
      transform: none;
      margin-top: 1px;
    }
    .col {
      flex: 1 1 0;
      min-width: var(--fb-col-min, 120px);
      position: relative;
      border-left: 1px solid var(--divider-color);
    }
    .col.creatable {
      cursor: copy;
    }
    .event {
      position: absolute;
      border-radius: var(--fb-radius);
      padding: var(--fb-event-pad, 4px 7px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 2;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .event:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 4;
    }
    /* long "background" events (OGS, Freispiel …): faint full-width band behind
       the normal event blocks so short lessons keep the full column width. */
    .band {
      position: absolute;
      left: 2px;
      right: 2px;
      border-radius: var(--fb-radius);
      padding: 3px 7px;
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      z-index: 1;
      display: flex;
      justify-content: flex-end; /* keep label clear of left-aligned event blocks */
      align-items: flex-start;
    }
    .band .etitle {
      max-width: 90%;
      font-weight: 600;
      font-size: 10px;
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 1px 8px;
    }
    .event.tentative {
      opacity: 0.72;
      border-style: dashed;
      background-image: repeating-linear-gradient(
        135deg,
        transparent 0 6px,
        rgba(255, 255, 255, 0.06) 6px 12px
      );
    }
    .event.overflow {
      background: var(--secondary-background-color);
      border: 1px dashed var(--divider-color);
      align-items: center;
      justify-content: center;
      color: var(--secondary-text-color);
      z-index: 6;
    }
    .event.overflow .etitle {
      font-weight: 700;
    }
    /* very short events (breaks etc.): thin single-line strip drawn on top so
       neighbours' min-height can't cover them */
    .event.slim {
      z-index: 3;
      flex-direction: row;
      align-items: center;
      gap: 4px;
      padding: 0 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .event.slim .etitle {
      font-size: calc(var(--fb-event-size) - 1.5px);
      font-weight: 600;
    }
    .event.slim .etime,
    .event.slim .eprog {
      display: none;
    }
    .pbadges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 3px;
      margin-top: 2px;
    }
    .pbadge {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 10px;
      font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 1px 7px;
      cursor: pointer;
      white-space: nowrap;
    }
    .pbadge ha-icon {
      --mdc-icon-size: 12px;
      width: 12px;
      height: 12px;
      display: inline-flex;
      align-items: center;
    }
    @media (pointer: coarse) {
      .switch button,
      .tabs button {
        padding: 8px 14px;
      }
    }
    /* phones: tighter columns, smaller chrome, everything still scrollable */
    @media (max-width: 600px) {
      :host {
        --fb-col-min: 96px;
        --fb-avatar-size: 28px;
        --fb-axis-width: 42px;
        --fb-title-size: 14px;
        --fb-name-size: 11.5px;
        --fb-event-size: 10.5px;
        --fb-chip-size: 10px;
      }
      .top {
        flex-wrap: wrap;
        gap: 6px;
      }
      .phead {
        padding: 6px 4px;
        gap: 2px;
      }
      .hour {
        font-size: 9.5px;
        right: 4px;
      }
      .weeknav {
        gap: 4px;
      }
      .band .etitle {
        font-size: 9px;
        padding: 1px 6px;
      }
      .pbadge {
        font-size: 9px;
        padding: 1px 5px;
      }
    }
    .wchip,
    .adchip,
    .mchip {
      transition: box-shadow 0.12s ease;
    }
    .wchip:hover,
    .adchip:hover,
    .mchip:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }
    .agenda-row {
      transition: background 0.12s ease;
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .wchip.tentative,
    .mchip.tentative,
    .adchip.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .agenda-row.tentative .agenda-bar {
      opacity: 0.55;
    }
    .agenda-row.tentative .agenda-title {
      font-style: italic;
    }
    .etitle {
      font-size: var(--fb-event-size);
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .etime {
      font-size: var(--fb-time-size);
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .nowline {
      position: absolute;
      left: var(--fb-axis-width, 56px);
      right: 0;
      border-top: 2px solid var(--fb-now-color);
      z-index: 7;
      pointer-events: none;
    }
    .nowline::after {
      content: "";
      position: absolute;
      left: -3px;
      top: -5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--fb-now-color);
      animation: fb-pulse 2s ease-out infinite;
    }
    @keyframes fb-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--fb-now-color) 40%, transparent);
      }
      50% {
        box-shadow: 0 0 0 7px transparent;
      }
    }
    @keyframes fb-fade {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
    .board,
    .weekwrap,
    .agenda,
    .monthgrid {
      animation: fb-fade 0.18s ease;
    }
    .board::-webkit-scrollbar,
    .weekwrap::-webkit-scrollbar,
    .agenda::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .board::-webkit-scrollbar-thumb,
    .weekwrap::-webkit-scrollbar-thumb,
    .agenda::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 8px;
    }
    @media (prefers-reduced-motion: reduce) {
      .board,
      .weekwrap,
      .agenda,
      .monthgrid,
      .nowline::after,
      .event {
        animation: none !important;
        transition: none !important;
      }
    }
    .nowline span {
      position: absolute;
      left: -50px;
      top: -8px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* timeline (horizontal) */
    .tlwrap {
      overflow: auto;
      max-height: var(--fb-board-max-height, 58vh);
      margin-top: 8px;
      animation: fb-fade 0.18s ease;
    }
    .tlgrid {
      position: relative;
    }
    .tlhead {
      display: flex;
      position: sticky;
      top: 0;
      z-index: 5;
      background: var(--card-background-color, var(--ha-card-background));
      border-bottom: 1px solid var(--divider-color);
      height: 26px;
    }
    .tlcorner {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      background: inherit;
      z-index: 2;
    }
    .tlhours {
      position: relative;
    }
    .tlhour {
      position: absolute;
      top: 5px;
      transform: translateX(-50%);
      font-size: 10.5px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .tlrow {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
    }
    .tlperson {
      width: var(--fb-tl-label, 150px);
      flex: 0 0 var(--fb-tl-label, 150px);
      position: sticky;
      left: 0;
      z-index: 4;
      background: var(--card-background-color, var(--ha-card-background));
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px;
      box-sizing: border-box;
      border-right: 1px solid var(--divider-color);
    }
    .tlperson .pname {
      font-size: 12.5px;
    }
    .tlcanvas {
      position: relative;
      flex: 0 0 auto;
    }
    .tlcanvas.creatable {
      cursor: copy;
    }
    .tlbar {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 7px;
      border-radius: var(--fb-radius);
      overflow: hidden;
      box-sizing: border-box;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        box-shadow 0.12s ease,
        transform 0.12s ease;
    }
    .tlbar:hover {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
      transform: translateY(-1px);
      z-index: 3;
    }
    .tlbar.tentative {
      opacity: 0.72;
      border-style: dashed;
    }
    .tlbar .etime {
      flex: 0 0 auto;
    }
    .tlnow {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 2px solid var(--fb-now-color);
      z-index: 6;
      pointer-events: none;
    }
    .tlnow span {
      position: absolute;
      top: 2px;
      left: -1px;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-primary-color, #fff);
      background: var(--fb-now-color);
      padding: 1px 5px;
      border-radius: 5px;
      font-variant-numeric: tabular-nums;
    }
    /* agenda */
    .agenda {
      max-height: 60vh;
      overflow: auto;
      padding: 4px 0 8px;
    }
    .agenda-empty {
      padding: 28px 16px;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .agenda-day {
      padding: 0 12px;
    }
    .agenda-date {
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
      font-weight: 600;
      font-size: 13px;
      padding: 8px 4px 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-date.today {
      color: var(--primary-color);
    }
    .agenda-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      cursor: pointer;
      border-bottom: 1px solid var(--divider-color);
    }
    .agenda-row:hover {
      background: var(--secondary-background-color);
    }
    .agenda-time {
      flex: 0 0 92px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .agenda-bar {
      flex: 0 0 4px;
      align-self: stretch;
      border-radius: 2px;
    }
    .agenda-main {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .agenda-title {
      font-size: 13.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .agenda-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* month */
    .monthwrap {
      overflow: auto;
      max-height: 62vh;
      padding: 0 8px 8px;
    }
    .monthhead {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      position: sticky;
      top: 0;
      z-index: 2;
      background: var(--card-background-color, var(--ha-card-background));
    }
    .mhcell {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: var(--secondary-text-color);
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .monthgrid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(64px, 1fr);
    }
    .mcell {
      border-right: 1px solid var(--divider-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 3px;
      cursor: pointer;
      overflow: hidden;
      box-sizing: border-box;
    }
    .mcell:nth-child(7n) {
      border-right: none;
    }
    .mcell.out {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 4%, transparent);
    }
    .mcell.out .mdate {
      opacity: 0.45;
    }
    .mcell:hover {
      background: var(--secondary-background-color);
    }
    .mcell.today {
      background: color-mix(in srgb, var(--fb-accent) 7%, transparent);
      box-shadow: inset 0 0 0 1.5px var(--fb-accent);
    }
    .mcell.wkend:not(.today) {
      background: color-mix(in srgb, var(--secondary-text-color, #888) 3.5%, transparent);
    }
    .mdate {
      font-size: 12px;
      font-weight: 600;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .mdate.today {
      background: var(--fb-accent);
      color: var(--text-primary-color, #fff);
      border-radius: 50%;
    }
    .mchips {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 2px;
    }
    .mchip {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mmore {
      font-size: 9.5px;
      color: var(--secondary-text-color);
      padding-left: 4px;
    }
    /* weather chip */
    .wx {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      vertical-align: middle;
      font-variant-numeric: tabular-nums;
      background: var(--secondary-background-color);
      border-radius: 999px;
      padding: 2px 9px 2px 5px;
      margin-left: 6px;
    }
    .wx ha-icon {
      --mdc-icon-size: 18px;
      color: var(--primary-text-color);
    }
    .agenda-date .wx {
      margin-left: 4px;
    }
    /* faded past events + map link */
    .past {
      opacity: var(--fb-past-opacity);
    }
    /* progress bar inside a running day event */
    .eprog {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: var(--divider-color);
    }
    .eprog > div {
      height: 100%;
      background: var(--fb-now-color);
    }
    /* agenda: countdown + running progress */
    .agenda-cd {
      flex: 0 0 auto;
      font-size: 11px;
      font-weight: 600;
      color: var(--primary-color);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .agenda-row.current {
      background: color-mix(in srgb, var(--fb-accent) 6%, transparent);
    }
    .agenda-prog {
      display: block;
      height: 3px;
      margin-top: 4px;
      border-radius: 2px;
      background: var(--divider-color);
      overflow: hidden;
    }
    .agenda-prog > span {
      display: block;
      height: 100%;
    }
    .maplink {
      margin-left: 8px;
      font-size: 11px;
      color: var(--primary-color);
      text-decoration: none;
    }
    .maplink:hover {
      text-decoration: underline;
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
      cursor: pointer;
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
      background: color-mix(in srgb, var(--fb-accent) 8%, transparent);
    }
    .wchip {
      border-radius: var(--fb-radius-sm);
      padding: 3px 5px;
      display: flex;
      align-items: center;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
    }
    .wchip span {
      font-size: var(--fb-chip-size);
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
    textarea,
    select {
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
    .recur {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 12px;
      margin-bottom: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
    }
    .recur-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      width: 100%;
    }
    .recur-opt {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      cursor: pointer;
    }
    .recur-opt input {
      width: auto;
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
  "%c FAMILY-BOARD-CARD %c v0.19.0 ",
  "background:#5B8CFF;color:#fff;border-radius:3px 0 0 3px",
  "background:#222;color:#fff;border-radius:0 3px 3px 0",
);
