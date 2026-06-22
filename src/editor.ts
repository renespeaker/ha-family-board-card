import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";
import type { FamilyBoardConfig } from "./ha-family-board-card";

const SCHEMA = [
  { name: "view", selector: { select: { mode: "dropdown", options: [
    { value: "day", label: "Tag" }, { value: "week", label: "Woche" }] } } },
  { name: "time_grid", selector: { select: { mode: "dropdown", options: [
    { value: "60", label: "60 min" }, { value: "30", label: "30 min" }, { value: "15", label: "15 min" }] } } },
  { name: "start_hour", selector: { number: { min: 0, max: 23, mode: "box" } } },
  { name: "end_hour", selector: { number: { min: 1, max: 24, mode: "box" } } },
  { name: "color_by", selector: { select: { mode: "dropdown", options: [
    { value: "person", label: "Person" }, { value: "location", label: "Ort" }] } } },
  { name: "show_weekends", selector: { boolean: {} } },
  { name: "show_now_line", selector: { boolean: {} } },
];

const LABELS: Record<string, string> = {
  view: "Standardansicht",
  time_grid: "Zeitraster",
  start_hour: "Startstunde",
  end_hour: "Endstunde",
  color_by: "Einfärben nach",
  show_weekends: "Wochenende anzeigen",
  show_now_line: "Jetzt-Linie",
};

export class FamilyBoardCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: FamilyBoardConfig;

  public setConfig(config: FamilyBoardConfig): void {
    this._config = config;
  }

  private get _data() {
    return { ...this._config, time_grid: String(this._config.time_grid ?? 30) };
  }

  private _valueChanged(ev: CustomEvent): void {
    const next = { ...ev.detail.value };
    if (typeof next.time_grid === "string") next.time_grid = Number(next.time_grid);
    const config: FamilyBoardConfig = { ...this._config, ...next };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config } }));
  }

  protected render() {
    if (!this._config) return nothing;
    return html`
      <div class="hint">
        Personen werden derzeit über YAML gepflegt (Liste <code>persons:</code> mit
        <code>name</code>, <code>person</code>, <code>calendar</code> und optional <code>color</code>).
        Ein vollwertiger Personen-Editor folgt.
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${this._data}
        .schema=${SCHEMA}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    .hint {
      font-size: 12.5px;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    code {
      font-family: var(--code-font-family, monospace);
      font-size: 11.5px;
    }
  `;
}

customElements.define("ha-family-board-card-editor", FamilyBoardCardEditor);
