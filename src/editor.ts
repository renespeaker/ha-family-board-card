import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import type { FamilyBoardConfig } from "./ha-family-board-card";

interface PersonConfig {
  name?: string;
  person?: string;
  calendar?: string | string[];
  color?: string;
  badges?: string[];
}

const SETTINGS_SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    name: "view",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "day", label: "Tag" },
          { value: "week", label: "Woche" },
          { value: "timeline", label: "Zeitstrahl" },
          { value: "month", label: "Monat" },
          { value: "agenda", label: "Agenda" },
        ],
      },
    },
  },
  {
    name: "views",
    selector: {
      select: {
        multiple: true,
        options: [
          { value: "day", label: "Tag" },
          { value: "week", label: "Woche" },
          { value: "timeline", label: "Zeitstrahl" },
          { value: "month", label: "Monat" },
          { value: "agenda", label: "Agenda" },
        ],
      },
    },
  },
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
  { name: "start_hour", selector: { number: { min: 0, max: 23, mode: "box" } } },
  { name: "end_hour", selector: { number: { min: 1, max: 24, mode: "box" } } },
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
  {
    name: "hour_height",
    selector: { number: { min: 40, max: 96, step: 4, mode: "slider", unit_of_measurement: "px" } },
  },
  {
    name: "hour_width",
    selector: { number: { min: 48, max: 240, step: 8, mode: "slider", unit_of_measurement: "px" } },
  },
  {
    name: "max_columns",
    selector: { number: { min: 1, max: 8, step: 1, mode: "slider" } },
  },
  { name: "fit_height", selector: { boolean: {} } },
  { name: "full_height", selector: { boolean: {} } },
  { name: "trim_hours", selector: { boolean: {} } },
  {
    name: "col_min_width",
    selector: {
      number: { min: 60, max: 400, step: 10, mode: "slider", unit_of_measurement: "px" },
    },
  },
  {
    name: "background_hours",
    selector: { number: { min: 0, max: 12, step: 1, mode: "slider", unit_of_measurement: "h" } },
  },
  { name: "hide_empty_persons", selector: { boolean: {} } },
  {
    name: "auto_return",
    selector: { number: { min: 0, max: 60, step: 1, mode: "box", unit_of_measurement: "min" } },
  },
  { name: "show_weekends", selector: { boolean: {} } },
  { name: "show_now_line", selector: { boolean: {} } },
  { name: "scroll_to_now", selector: { boolean: {} } },
  { name: "dim_past", selector: { boolean: {} } },
  { name: "show_progress", selector: { boolean: {} } },
  { name: "hide_patterns", selector: { text: { multiple: true } } },
  { name: "tentative_patterns", selector: { text: { multiple: true } } },
  {
    name: "weather_entity",
    selector: { entity: { filter: { domain: "weather" } } },
  },
  { name: "show_weather", selector: { boolean: {} } },
  {
    name: "refresh_interval",
    selector: { number: { min: 0, max: 3600, mode: "box", unit_of_measurement: "s" } },
  },
];

const LABELS: Record<string, string> = {
  title: "Kartentitel",
  refresh_interval: "Auto-Aktualisierung (Sek., 0 = aus)",
  view: "Standardansicht",
  views: "Verfügbare Ansichten (Umschalter)",
  time_grid: "Zeitraster",
  start_hour: "Startstunde",
  end_hour: "Endstunde",
  hour_height: "Höhe pro Stunde (max. bei Auto-Fit)",
  hour_width: "Zeitstrahl: Breite pro Stunde",
  fit_height: "Auto-Fit: Tag ohne Scrollen einpassen",
  full_height: "Volle Höhe: bis zum unteren Bildschirmrand",
  trim_hours: "Leere Randstunden automatisch ausblenden",
  col_min_width: "Min. Spaltenbreite pro Person",
  background_hours: "Lange Termine als Hintergrund-Band ab (Std., 0 = aus)",
  max_columns: "Max. Spalten pro Tag (dichte Termine)",
  first_day: "Wochenstart",
  scroll_to_now: "Auto-Scroll zu jetzt",
  color_by: "Einfärben nach",
  show_weekends: "Wochenende anzeigen",
  show_now_line: "Jetzt-Linie",
  dim_past: "Vergangene Termine ausgrauen",
  show_progress: "Fortschrittsbalken anzeigen",
  hide_patterns: "Termine ausblenden (Text-Muster)",
  tentative_patterns: "Als vorläufig markieren (Text-Muster)",
  weather_entity: "Wetter-Entität (weather.*)",
  show_weather: "Wetter anzeigen",
  hide_empty_persons: "Woche: Personen ohne Termine ausblenden",
  auto_return: "Kiosk: nach Inaktivität zur Startansicht (Min., 0 = aus)",
  name: "Anzeigename",
  person: "Person (Avatar & Status)",
  calendar: "Kalender (Termine, mehrere möglich)",
  color: "Farbe (optional)",
  badges: "Badges (Entitäten, z. B. Akku/Sensor)",
};

// One ha-form per person row, with entity pickers filtered by domain.
const PERSON_SCHEMA = [
  { name: "name", selector: { text: {} } },
  {
    name: "person",
    selector: { entity: { filter: { domain: "person" } } },
  },
  {
    name: "calendar",
    selector: { entity: { filter: { domain: "calendar" }, multiple: true } },
  },
  { name: "color", selector: { text: {} } },
  {
    name: "badges",
    selector: { entity: { multiple: true } },
  },
];

export class FamilyBoardCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;

  public setConfig(config: FamilyBoardConfig): void {
    this._config = config;
  }

  private get _persons(): PersonConfig[] {
    return Array.isArray(this._config.persons) ? this._config.persons : [];
  }

  private get _settingsData() {
    return { ...this._config, time_grid: String(this._config.time_grid ?? 30) };
  }

  private _emit(config: FamilyBoardConfig): void {
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config } }));
  }

  private _settingsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const next = { ...ev.detail.value };
    if (typeof next.time_grid === "string") next.time_grid = Number(next.time_grid);
    // keep the persons list untouched by the settings form
    this._emit({ ...this._config, ...next, persons: this._persons });
  }

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

  private _addPerson(): void {
    const persons = [...this._persons, { name: "", person: "", calendar: "" }];
    this._emit({ ...this._config, persons });
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

  protected render() {
    if (!this._config) return nothing;
    const persons = this._persons;
    return html`
      <div class="section-title">Personen</div>
      <div class="persons">
        ${persons.length === 0
          ? html`<div class="hint">Noch keine Person. Füge unten die erste hinzu.</div>`
          : nothing}
        ${persons.map(
          (p, idx) => html`
            <div class="person">
              <div class="person-head">
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
              <ha-form
                .hass=${this.hass}
                .data=${this._personData(p)}
                .schema=${PERSON_SCHEMA}
                .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
                @value-changed=${(e: CustomEvent) => this._personChanged(idx, e)}
              ></ha-form>
            </div>
          `,
        )}
        <button class="add" @click=${this._addPerson}>＋ Person hinzufügen</button>
      </div>

      <div class="section-title">Darstellung</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._settingsData}
        .schema=${SETTINGS_SCHEMA}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        @value-changed=${this._settingsChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    .section-title {
      font-weight: 600;
      font-size: 14px;
      margin: 14px 2px 8px;
    }
    .section-title:first-child {
      margin-top: 4px;
    }
    .hint {
      font-size: 12.5px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
      line-height: 1.5;
    }
    .persons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .person {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 8px 10px 4px;
    }
    .person-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
    }
    .pidx {
      font-weight: 600;
      font-size: 13px;
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
    code {
      font-family: var(--code-font-family, monospace);
      font-size: 11.5px;
    }
  `;
}

customElements.define("ha-family-board-card-editor", FamilyBoardCardEditor);
