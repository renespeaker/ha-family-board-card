import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import { autoDetectPersons } from "./ha-family-board-card";
import type { FamilyBoardConfig } from "./ha-family-board-card";

interface PersonConfig {
  name?: string;
  person?: string;
  calendar?: string | string[];
  color?: string;
  badges?: string[];
}

/** Curated family palette for one-click color picking. */
const PALETTE = [
  "#7986cb",
  "#4fc3f7",
  "#4db6ac",
  "#aed581",
  "#ffd54f",
  "#ffb74d",
  "#e57373",
  "#f06292",
  "#f48fb1",
  "#ce93d8",
  "#9575cd",
  "#90a4ae",
];

const VIEW_OPTIONS = [
  { value: "day", label: "Tag" },
  { value: "timeline", label: "Zeitstrahl" },
  { value: "week", label: "Woche" },
  { value: "month", label: "Monat" },
  { value: "agenda", label: "Agenda" },
];

const LABELS: Record<string, string> = {
  title: "Kartentitel",
  refresh_interval: "Auto-Aktualisierung (Sek., 0 = aus)",
  view: "Standardansicht",
  views: "Verfügbare Ansichten (Umschalter)",
  time_grid: "Zeitraster",
  start_hour: "Startstunde",
  end_hour: "Endstunde",
  hour_height: "Höhe pro Stunde",
  hour_width: "Zeitstrahl: Breite pro Stunde",
  fit_height: "Auto-Fit: Tag ohne Scrollen einpassen",
  full_height: "Volle Höhe: bis zum unteren Bildschirmrand",
  trim_hours: "Leere Randstunden automatisch ausblenden",
  col_min_width: "Min. Spaltenbreite pro Person",
  background_hours: "Lange Termine als Hintergrund-Band ab (Std.)",
  max_columns: "Max. Spalten pro Tag",
  first_day: "Wochenstart",
  scroll_to_now: "Auto-Scroll zu jetzt",
  color_by: "Einfärben nach",
  show_weekends: "Wochenende anzeigen",
  show_now_line: "Jetzt-Linie",
  dim_past: "Vergangene Termine ausgrauen",
  show_progress: "Fortschrittsbalken anzeigen",
  hide_patterns: "Termine ausblenden",
  show_patterns: "Nur Termine zeigen mit",
  replace_patterns: "Titel ersetzen",
  filter_duplicates: "Doppelte Termine zusammenfassen",
  tentative_patterns: "Als vorläufig markieren",
  auto_icons: "Auto-Symbole nach Stichwort",
  icon_patterns: "Eigene Symbol-Regeln",
  show_focus: "„Jetzt / als Nächstes“-Leiste",
  weather_entity: "Wetter-Entität",
  show_weather: "Wetter anzeigen",
  hide_empty_persons: "Woche: Personen ohne Termine ausblenden",
  auto_return: "Nach Inaktivität zur Startansicht (Min., 0 = aus)",
  event_size: "Schriftgröße Termine",
  radius: "Ecken-Radius der Blöcke",
  past_opacity: "Deckkraft vergangener Termine",
  name: "Anzeigename",
  person: "Person (Avatar & Status)",
  calendar: "Kalender (mehrere möglich)",
  color: "Eigene Farbe (Hex, optional)",
  badges: "Badges (z. B. Akku, Sensoren)",
};

const HELPERS: Record<string, string> = {
  hide_patterns: "Textmuster, z. B. „Hofpause“ – Treffer werden ausgeblendet",
  show_patterns: "Allow-Liste: nur Termine, deren Titel eines der Muster enthält",
  replace_patterns: "z. B. „Klassenverbund => Unterricht“ (ohne => wird der Text entfernt)",
  tentative_patterns: "Treffer werden gestrichelt/transparent dargestellt",
  filter_duplicates: "Gleicher Termin in mehreren Kalendern nur einmal",
  auto_return: "Kiosk: springt nach X Minuten ohne Berührung zurück zu „heute“",
  background_hours: "0 = aus. Lange Dauertermine (OGS, Betreuung …) als dezentes Band",
  fit_height: "Staucht den Tag, bis alles ohne Scrollen sichtbar ist",
  full_height: "Für Panel-Ansicht / Wandtablet",
  trim_hours: "Zeigt nur die Stunden, in denen wirklich Termine liegen",
  col_min_width: "Darunter wird horizontal gescrollt",
  weather_entity: "Tages-Vorhersage im Kopf (HA-Standort)",
  auto_icons: "z. B. Arzt → 🩺, Sport → 🏃, Geburtstag → 🎂 (Titel mit Emoji bleiben unberührt)",
  icon_patterns: "eigene Regeln, z. B. „Oma => 👵“",
  show_focus: "Kompakte Leiste über den Ansichten: was läuft jetzt / kommt als Nächstes",
  views: "Welche Umschalter oben erscheinen",
  badges: "Kleine Chips unter dem Personenkopf; Klick öffnet Details",
  color: "Leer lassen für Palettenfarbe",
};

// One ha-form per person row, with entity pickers filtered by domain.
const PERSON_SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "person", selector: { entity: { filter: { domain: "person" } } } },
  { name: "calendar", selector: { entity: { filter: { domain: "calendar" }, multiple: true } } },
  { name: "badges", selector: { entity: { multiple: true } } },
  { name: "color", selector: { text: {} } },
];

/** Expandable group for ha-form (flat data, name must stay empty). */
const group = (title: string, icon: string, schema: unknown[]) => ({
  name: "",
  type: "expandable",
  title,
  icon,
  schema,
});

export class FamilyBoardCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;

  public setConfig(config: FamilyBoardConfig): void {
    this._config = config;
  }

  private get _persons(): PersonConfig[] {
    return Array.isArray(this._config.persons) ? this._config.persons : [];
  }

  /** True when nothing meaningful is configured yet -> show the wizard. */
  private get _isFresh(): boolean {
    return !this._persons.some((p) => p.name || p.person || p.calendar);
  }

  private get _settingsData() {
    return { ...this._config, time_grid: String(this._config.time_grid ?? 30) };
  }

  /** Grouped settings schema; irrelevant fields are hidden contextually. */
  private _schema(): unknown[] {
    const cfg = this._config;
    const views =
      Array.isArray(cfg.views) && cfg.views.length ? cfg.views : VIEW_OPTIONS.map((v) => v.value);
    const hasDay = views.includes("day");
    const hasTimeline = views.includes("timeline");
    const hasWeek = views.includes("week");

    const layout: unknown[] = [];
    if (hasDay || hasTimeline) {
      layout.push(
        { name: "start_hour", selector: { number: { min: 0, max: 23, mode: "box" } } },
        { name: "end_hour", selector: { number: { min: 1, max: 24, mode: "box" } } },
        { name: "trim_hours", selector: { boolean: {} } },
      );
    }
    if (hasDay) {
      layout.push(
        {
          name: "hour_height",
          selector: {
            number: { min: 40, max: 96, step: 4, mode: "slider", unit_of_measurement: "px" },
          },
        },
        { name: "fit_height", selector: { boolean: {} } },
        {
          name: "col_min_width",
          selector: {
            number: { min: 60, max: 400, step: 10, mode: "slider", unit_of_measurement: "px" },
          },
        },
        { name: "max_columns", selector: { number: { min: 1, max: 8, step: 1, mode: "slider" } } },
        {
          name: "background_hours",
          selector: {
            number: { min: 0, max: 12, step: 1, mode: "slider", unit_of_measurement: "h" },
          },
        },
      );
    }
    if (hasTimeline) {
      layout.push({
        name: "hour_width",
        selector: {
          number: { min: 48, max: 240, step: 8, mode: "slider", unit_of_measurement: "px" },
        },
      });
    }
    layout.push({ name: "full_height", selector: { boolean: {} } });

    const extras: unknown[] = [
      {
        name: "auto_return",
        selector: { number: { min: 0, max: 60, step: 1, mode: "box", unit_of_measurement: "min" } },
      },
      { name: "scroll_to_now", selector: { boolean: {} } },
      { name: "show_now_line", selector: { boolean: {} } },
      { name: "show_progress", selector: { boolean: {} } },
      { name: "weather_entity", selector: { entity: { filter: { domain: "weather" } } } },
    ];
    if (cfg.weather_entity) extras.push({ name: "show_weather", selector: { boolean: {} } });
    extras.push({
      name: "refresh_interval",
      selector: { number: { min: 0, max: 3600, mode: "box", unit_of_measurement: "s" } },
    });

    return [
      { name: "title", selector: { text: {} } },
      group("🗓️ Ansichten", "mdi:calendar-multiselect", [
        {
          name: "view",
          selector: { select: { mode: "dropdown", options: VIEW_OPTIONS } },
        },
        { name: "views", selector: { select: { multiple: true, options: VIEW_OPTIONS } } },
        {
          name: "time_grid",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "60", label: "60 min" },
                { value: "30", label: "30 min" },
                { value: "15", label: "15 min" },
              ],
            },
          },
        },
        {
          name: "first_day",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "monday", label: "Montag" },
                { value: "sunday", label: "Sonntag" },
              ],
            },
          },
        },
        { name: "show_weekends", selector: { boolean: {} } },
      ]),
      group("📐 Layout & Größe", "mdi:resize", layout),
      group("🧹 Filter & Aufräumen", "mdi:broom", [
        { name: "hide_patterns", selector: { text: { multiple: true } } },
        { name: "show_patterns", selector: { text: { multiple: true } } },
        { name: "replace_patterns", selector: { text: { multiple: true } } },
        { name: "filter_duplicates", selector: { boolean: {} } },
        { name: "tentative_patterns", selector: { text: { multiple: true } } },
        ...(hasWeek ? [{ name: "hide_empty_persons", selector: { boolean: {} } }] : []),
      ]),
      group("🎨 Aussehen (Feintuning)", "mdi:palette", [
        { name: "show_focus", selector: { boolean: {} } },
        { name: "auto_icons", selector: { boolean: {} } },
        ...(cfg.auto_icons
          ? [{ name: "icon_patterns", selector: { text: { multiple: true } } }]
          : []),
        {
          name: "color_by",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: "person", label: "Person" },
                { value: "location", label: "Ort" },
                { value: "calendar", label: "Kalender" },
              ],
            },
          },
        },
        { name: "dim_past", selector: { boolean: {} } },
        {
          name: "event_size",
          selector: {
            number: { min: 9, max: 16, step: 0.5, mode: "slider", unit_of_measurement: "px" },
          },
        },
        {
          name: "radius",
          selector: {
            number: { min: 0, max: 18, step: 1, mode: "slider", unit_of_measurement: "px" },
          },
        },
        {
          name: "past_opacity",
          selector: {
            number: { min: 10, max: 100, step: 5, mode: "slider", unit_of_measurement: "%" },
          },
        },
      ]),
      group("🖥️ Kiosk & Extras", "mdi:tablet-dashboard", extras),
    ];
  }

  private _emit(config: FamilyBoardConfig): void {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config } }));
  }

  private _settingsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const next = { ...ev.detail.value };
    if (typeof next.time_grid === "string") next.time_grid = Number(next.time_grid);
    // keep persons + calendars untouched by the settings form
    this._emit({
      ...this._config,
      ...next,
      persons: this._persons,
      ...(this._config.calendars ? { calendars: this._config.calendars } : {}),
    });
  }

  /* ---- presets --------------------------------------------------- */
  private _applyPreset(kind: "tablet" | "phone" | "reset"): void {
    const cfg: FamilyBoardConfig = { ...this._config, persons: this._persons };
    const clear = (keys: string[]) =>
      keys.forEach((k) => delete (cfg as Record<string, unknown>)[k]);
    if (kind === "tablet") {
      Object.assign(cfg, {
        view: "day",
        full_height: true,
        fit_height: true,
        trim_hours: true,
        scroll_to_now: true,
        auto_return: 5,
      });
    } else if (kind === "phone") {
      Object.assign(cfg, { view: "agenda", col_min_width: 96 });
      clear(["full_height", "fit_height", "auto_return"]);
    } else {
      clear([
        "full_height",
        "fit_height",
        "trim_hours",
        "auto_return",
        "col_min_width",
        "hour_height",
        "hour_width",
        "max_columns",
        "background_hours",
        "event_size",
        "radius",
        "past_opacity",
      ]);
      cfg.view = "day";
    }
    this._emit(cfg);
  }

  /* ---- persons ---------------------------------------------------- */
  private _personChanged(idx: number, ev: CustomEvent): void {
    ev.stopPropagation();
    const value = { ...ev.detail.value } as PersonConfig;
    // drop empty optional fields so the YAML stays clean
    if (!value.color) delete value.color;
    if (Array.isArray(value.badges) && value.badges.length === 0) delete value.badges;
    // collapse a single-calendar array back to a string for tidy YAML
    if (Array.isArray(value.calendar)) {
      if (value.calendar.length === 0) delete value.calendar;
      else if (value.calendar.length === 1) value.calendar = value.calendar[0];
    }
    const persons = this._persons.map((p, i) => (i === idx ? value : p));
    this._emit({ ...this._config, persons });
  }

  /** Normalize a person's calendar to an array for the multi-entity picker. */
  private _personData(p: PersonConfig): PersonConfig {
    const calendar = Array.isArray(p.calendar) ? p.calendar : p.calendar ? [p.calendar] : [];
    return { ...p, calendar };
  }

  private _setPersonColor(idx: number, color?: string): void {
    const persons = this._persons.map((p, i) => {
      if (i !== idx) return p;
      const next = { ...p };
      if (color) next.color = color;
      else delete next.color;
      return next;
    });
    this._emit({ ...this._config, persons });
  }

  private _addPerson(): void {
    const persons = [...this._persons, { name: "", person: "", calendar: "" }];
    this._emit({ ...this._config, persons });
  }

  /** One-click setup: detect person.* entities and their matching calendars. */
  private _autoDetect(): void {
    const detected = autoDetectPersons(this.hass);
    if (detected.length === 0) return;
    const known = new Set(this._persons.map((p) => p.person).filter(Boolean));
    const merged = [...this._persons.filter((p) => p.name || p.person || p.calendar)];
    for (const d of detected) if (!known.has(d.person)) merged.push(d);
    this._emit({ ...this._config, persons: merged });
  }

  private _removePerson(idx: number): void {
    const persons = this._persons.filter((_, i) => i !== idx);
    this._emit({ ...this._config, persons });
  }

  private _movePerson(idx: number, delta: number): void {
    const persons = [...this._persons];
    const target = idx + delta;
    if (target < 0 || target >= persons.length) return;
    [persons[idx], persons[target]] = [persons[target], persons[idx]];
    this._emit({ ...this._config, persons });
  }

  /* ---- calendars mapping ------------------------------------------ */
  private _calsUsed(): string[] {
    const all: string[] = [];
    for (const p of this._persons) {
      const cals = Array.isArray(p.calendar) ? p.calendar : p.calendar ? [p.calendar] : [];
      for (const c of cals) if (c && !all.includes(c)) all.push(c);
    }
    return all;
  }

  private _setCalMeta(
    entity: string,
    patch: { color?: string | null; label?: string | null },
  ): void {
    const map = { ...(this._config.calendars ?? {}) };
    const entry = { ...(map[entity] ?? {}) };
    if (patch.color !== undefined) {
      if (patch.color) entry.color = patch.color;
      else delete entry.color;
    }
    if (patch.label !== undefined) {
      if (patch.label) entry.label = patch.label;
      else delete entry.label;
    }
    if (Object.keys(entry).length === 0) delete map[entity];
    else map[entity] = entry;
    const cfg = { ...this._config, persons: this._persons } as FamilyBoardConfig;
    if (Object.keys(map).length === 0) delete (cfg as Record<string, unknown>).calendars;
    else cfg.calendars = map;
    this._emit(cfg);
  }

  private _calName(entity: string): string {
    return (this.hass.states[entity]?.attributes?.friendly_name as string | undefined) || entity;
  }

  /* ---- render ------------------------------------------------------ */
  private _swatches(current: string | undefined, pick: (c?: string) => void) {
    return html`
      <div class="swatches">
        ${PALETTE.map(
          (c) => html`
            <button
              class="swatch ${current?.toLowerCase() === c ? "on" : ""}"
              style="background:${c}"
              title=${c}
              @click=${() => pick(c)}
            ></button>
          `,
        )}
        <button
          class="swatch none ${!current ? "on" : ""}"
          title="Automatisch"
          @click=${() => pick()}
        >
          A
        </button>
      </div>
    `;
  }

  protected render() {
    if (!this._config) return nothing;

    if (this._isFresh) {
      return html`
        <div class="wizard">
          <div class="wtitle">👨‍👩‍👧‍👦 Willkommen beim Familienplan!</div>
          <div class="wtext">
            In zwei Klicks startklar – die Karte erkennt deine Familie automatisch aus den Personen-
            und Kalender-Entitäten deines Home Assistant.
          </div>
          <button class="wbtn primary" @click=${this._autoDetect}>
            ✨ Schritt 1: Personen automatisch erkennen
          </button>
          <div class="wtext small">
            Danach optional: Profil wählen (unten) oder Feinheiten in den Gruppen einstellen.
            Natürlich kannst du Personen auch von Hand anlegen:
          </div>
          <button class="wbtn" @click=${this._addPerson}>＋ Leer starten</button>
        </div>
      `;
    }

    const persons = this._persons;
    const cals = this._calsUsed();
    return html`
      <div class="presets">
        <button
          title="Vollbild, Auto-Fit, Rückkehr zu heute"
          @click=${() => this._applyPreset("tablet")}
        >
          🖥️ Wandtablet
        </button>
        <button
          title="Agenda als Startansicht, kompakte Spalten"
          @click=${() => this._applyPreset("phone")}
        >
          📱 Handy
        </button>
        <button
          title="Layout-Einstellungen zurücksetzen"
          @click=${() => this._applyPreset("reset")}
        >
          🧩 Standard
        </button>
      </div>

      <div class="section-title">Personen</div>
      <div class="persons">
        ${persons.map(
          (p, idx) => html`
            <div class="person">
              <div class="person-head">
                <span
                  class="pdot"
                  style="background:${p.color || PALETTE[idx % PALETTE.length]}"
                ></span>
                <span class="pidx">${p.name || `Person ${idx + 1}`}</span>
                <div class="ptools">
                  <button
                    class="icon"
                    title="Nach oben"
                    ?disabled=${idx === 0}
                    @click=${() => this._movePerson(idx, -1)}
                  >
                    ↑
                  </button>
                  <button
                    class="icon"
                    title="Nach unten"
                    ?disabled=${idx === persons.length - 1}
                    @click=${() => this._movePerson(idx, 1)}
                  >
                    ↓
                  </button>
                  <button
                    class="icon danger"
                    title="Entfernen"
                    @click=${() => this._removePerson(idx)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ${this._swatches(p.color, (c) => this._setPersonColor(idx, c))}
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(p)}
                .schema=${PERSON_SCHEMA}
                .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
                .computeHelper=${(s: { name: string }) => HELPERS[s.name]}
                @value-changed=${(e: CustomEvent) => this._personChanged(idx, e)}
              ></ha-form>
            </div>
          `,
        )}
        <div class="addrow">
          <button class="add" @click=${this._addPerson}>＋ Person hinzufügen</button>
          <button class="add detect" @click=${this._autoDetect}>✨ Automatisch erkennen</button>
        </div>
      </div>

      ${cals.length > 1 || this._config.calendars
        ? html`
            <div class="section-title">Kalender (Farbe & Label)</div>
            <div class="cals">
              ${cals.map((c) => {
                const meta = this._config.calendars?.[c] ?? {};
                return html`
                  <div class="cal">
                    <div class="cal-head">
                      <span
                        class="pdot"
                        style="background:${meta.color || "var(--divider-color)"}"
                      ></span>
                      <span class="cal-name" title=${c}>${this._calName(c)}</span>
                      <input
                        class="cal-label"
                        type="text"
                        placeholder="Eigenes Label"
                        .value=${meta.label ?? ""}
                        @change=${(e: Event) =>
                          this._setCalMeta(c, {
                            label: (e.target as HTMLInputElement).value || null,
                          })}
                      />
                    </div>
                    ${this._swatches(meta.color, (col) =>
                      this._setCalMeta(c, { color: col ?? null }),
                    )}
                  </div>
                `;
              })}
              <div class="hint">
                Farben wirken bei „Einfärben nach: Kalender“; Labels erscheinen im Termin-Dialog.
              </div>
            </div>
          `
        : nothing}

      <div class="section-title">Einstellungen</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${this._schema()}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        .computeHelper=${(s: { name: string }) => HELPERS[s.name]}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    .wizard {
      border: 1px dashed var(--divider-color);
      border-radius: 12px;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
    .wtitle {
      font-size: 17px;
      font-weight: 700;
    }
    .wtext {
      font-size: 13px;
      color: var(--secondary-text-color);
      line-height: 1.5;
    }
    .wtext.small {
      font-size: 12px;
    }
    .wbtn {
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 600;
    }
    .wbtn.primary {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
    }
    .presets {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }
    .presets button {
      flex: 1;
      border: 1px solid var(--divider-color);
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 999px;
      padding: 8px 10px;
      cursor: pointer;
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
    }
    .presets button:hover {
      border-color: var(--primary-color);
    }
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin: 14px 2px 8px;
    }
    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      line-height: 1.4;
      padding: 2px 2px 0;
    }
    .persons,
    .cals {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .person,
    .cal {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 8px 10px 6px;
    }
    .person-head,
    .cal-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .pdot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex: 0 0 12px;
    }
    .pidx {
      font-weight: 600;
      font-size: 13px;
      flex: 1;
    }
    .cal-name {
      font-weight: 600;
      font-size: 12.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cal-label {
      margin-left: auto;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      padding: 4px 8px;
      width: 130px;
    }
    .ptools {
      display: inline-flex;
      gap: 2px;
    }
    .icon {
      border: none;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border-radius: 6px;
      width: 26px;
      height: 26px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1;
    }
    .icon:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .icon.danger:hover {
      background: var(--error-color, #ff5252);
      color: #fff;
    }
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin: 2px 0 6px;
    }
    .swatch {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      padding: 0;
    }
    .swatch.on {
      border-color: var(--primary-text-color);
      box-shadow: 0 0 0 2px var(--card-background-color, #fff) inset;
    }
    .swatch.none {
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
    }
    .addrow {
      display: flex;
      gap: 8px;
    }
    .addrow .add {
      flex: 1;
    }
    .add.detect {
      border-style: solid;
    }
    .add {
      border: 1px dashed var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      border-radius: 10px;
      padding: 10px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
    }
  `;
}

customElements.define("ha-family-board-card-editor", FamilyBoardCardEditor);
