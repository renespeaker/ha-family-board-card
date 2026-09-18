// @vitest-environment happy-dom
/* ------------------------------------------------------------------ */
/*  Editor tests. `ha-form` is Home Assistant's own element and does   */
/*  not exist here, but the editor hands it its label and helper       */
/*  functions as properties - which is exactly what we want to check.  */
/* ------------------------------------------------------------------ */
import { describe, it, expect, beforeAll, afterEach } from "vitest";

beforeAll(async () => {
  await import("./editor");
});

type Schema = { name: string; type?: string; title?: string; schema?: Schema[] };
type Form = HTMLElement & {
  computeLabel: (s: { name: string }) => string;
  computeHelper: (s: { name: string }) => string | undefined;
  schema: Schema[];
};

const mounted: HTMLElement[] = [];

async function mountEditor(config: Record<string, unknown> = {}, lang = "de") {
  const el = document.createElement("ha-family-board-card-editor") as HTMLElement & {
    setConfig(c: unknown): void;
    hass: unknown;
    updateComplete: Promise<unknown>;
  };
  el.setConfig({
    type: "custom:family-board-card",
    persons: [{ name: "Anna", calendar: "calendar.anna" }],
    ...config,
  });
  el.hass = { locale: { language: lang }, states: {} };
  document.body.appendChild(el);
  mounted.push(el);
  await el.updateComplete;
  const root = el.shadowRoot as ShadowRoot;
  const forms = [...root.querySelectorAll("ha-form")] as Form[];
  return {
    el,
    root,
    settings: forms[forms.length - 1],
    text: () => (root.textContent ?? "").replace(/\s+/g, " ").trim(),
    /** Flatten the expandable groups into one list of field names. */
    fields: () => {
      const out: string[] = [];
      const walk = (schema: Schema[]) =>
        schema.forEach((s) => (s.schema ? walk(s.schema) : out.push(s.name)));
      walk(forms[forms.length - 1].schema);
      return out;
    },
    groupTitles: () =>
      forms[forms.length - 1].schema.filter((s) => s.type === "expandable").map((s) => s.title),
  };
}

afterEach(() => {
  mounted.splice(0).forEach((el) => el.remove());
});

describe("editor language", () => {
  it("labels and helper texts follow the Home Assistant language", async () => {
    const de = await mountEditor();
    expect(de.settings.computeLabel({ name: "view" })).toBe("Standardansicht");
    expect(de.settings.computeHelper({ name: "show_focus" })).toContain("Kompakte Leiste");

    const en = await mountEditor({}, "en");
    expect(en.settings.computeLabel({ name: "view" })).toBe("Default view");
    expect(en.settings.computeHelper({ name: "show_focus" })).toContain("Compact bar");
  });

  it("falls back to English for a language we do not ship", async () => {
    const fr = await mountEditor({}, "fr");
    expect(fr.settings.computeLabel({ name: "view" })).toBe("Default view");
  });

  it("shows the raw option name rather than nothing for an unknown field", async () => {
    const de = await mountEditor();
    expect(de.settings.computeLabel({ name: "some_future_option" })).toBe("some_future_option");
    expect(de.settings.computeHelper({ name: "some_future_option" })).toBeUndefined();
  });

  it("translates the group titles and the section headings", async () => {
    const de = await mountEditor();
    expect(de.groupTitles().join(" ")).toContain("Ansichten");
    expect(de.text()).toContain("Personen");

    const en = await mountEditor({}, "en");
    expect(en.groupTitles().join(" ")).toContain("Views");
    expect(en.text()).toContain("People");
  });

  it("greets an empty card in the right language", async () => {
    const de = await mountEditor({ persons: [] });
    expect(de.text()).toContain("Willkommen beim Familienplan");
    const en = await mountEditor({ persons: [] }, "en");
    expect(en.text()).toContain("Welcome to the family board");
  });
});

describe("editor schema", () => {
  it("only offers timeline and day settings for the views in use", async () => {
    const dayOnly = await mountEditor({ views: ["day"] });
    expect(dayOnly.fields()).toContain("hour_height");
    expect(dayOnly.fields()).not.toContain("hour_width");

    const timeline = await mountEditor({ views: ["timeline"] });
    expect(timeline.fields()).toContain("hour_width");

    const agenda = await mountEditor({ views: ["agenda"] });
    expect(agenda.fields()).not.toContain("hour_height");
    expect(agenda.fields()).toContain("hide_past");
  });

  it("reveals the gap threshold only once the day check is on", async () => {
    expect((await mountEditor()).fields()).not.toContain("gap_min");
    expect((await mountEditor({ show_alerts: true })).fields()).toContain("gap_min");
  });

  it("reveals the weather switch only once an entity is picked", async () => {
    expect((await mountEditor()).fields()).not.toContain("show_weather");
    expect((await mountEditor({ weather_entity: "weather.home" })).fields()).toContain(
      "show_weather",
    );
  });
});

describe("editor presets", () => {
  const clickPreset = async (label: string, lang = "de") => {
    const { el, root } = await mountEditor({}, lang);
    const changed: unknown[] = [];
    el.addEventListener("config-changed", (e) => changed.push((e as CustomEvent).detail.config));
    const button = [...root.querySelectorAll(".presets button")].find((b) =>
      (b.textContent ?? "").includes(label),
    ) as HTMLButtonElement;
    button.click();
    return changed[0] as Record<string, unknown>;
  };

  it("the wall tablet profile turns on the kiosk settings", async () => {
    const cfg = await clickPreset("Wandtablet");
    expect(cfg).toMatchObject({ view: "day", full_height: true, fit_height: true });
    expect(cfg.persons).toHaveLength(1); // people survive a profile switch
  });

  it("the phone profile starts in the agenda", async () => {
    const cfg = await clickPreset("Handy");
    expect(cfg.view).toBe("agenda");
    expect(cfg.full_height).toBeUndefined();
  });
});
