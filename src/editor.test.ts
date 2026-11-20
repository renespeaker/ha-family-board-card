// @vitest-environment happy-dom
/* ------------------------------------------------------------------ */
/*  Editor tests. `ha-form` is Home Assistant's own element and does   */
/*  not exist here, but the editor hands it its label and helper       */
/*  functions as properties - which is exactly what we want to check.  */
/* ------------------------------------------------------------------ */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import { FALLBACK_COLORS, PALETTES } from "./ha-family-board-card";

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

async function mountEditor(
  config: Record<string, unknown> = {},
  lang = "de",
  services: Record<string, Record<string, unknown>> = {},
) {
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
  el.hass = { locale: { language: lang }, states: {}, services };
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
    const fr = await mountEditor({}, "it");
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

describe("editor colours", () => {
  /**
   * The swatches must be the colours the card actually paints. They used to be
   * a separate palette, so picking a colour in the editor gave a person a hue
   * the card would never assign on its own - and a different one again from the
   * Family Task Card, which shares this palette.
   */
  it("offers exactly the palette the card paints with", async () => {
    const { root } = await mountEditor();
    const swatches = [...root.querySelectorAll(".person .swatch:not(.none)")].map((el) =>
      (el.getAttribute("style") ?? "").replace("background:", "").trim(),
    );
    expect(swatches).toEqual(FALLBACK_COLORS);
  });

  it("previews a person in the colour the card will use", async () => {
    const { root } = await mountEditor({ persons: [{ name: "Anna" }, { name: "Ben" }] });
    const dots = [...root.querySelectorAll(".person .pdot")].map((el) =>
      (el.getAttribute("style") ?? "").replace("background:", "").trim(),
    );
    expect(dots).toEqual([FALLBACK_COLORS[0], FALLBACK_COLORS[1]]);
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

describe("private calendar switch", () => {
  it("writes private: true for a calendar and removes it again", async () => {
    const { el, root } = await mountEditor({
      persons: [{ name: "Anna", calendar: ["calendar.anna", "calendar.work"] }],
    });
    const seen: Array<Record<string, unknown>> = [];
    el.addEventListener("config-changed", (e) =>
      seen.push((e as CustomEvent).detail.config as Record<string, unknown>),
    );
    const boxes = root.querySelectorAll<HTMLInputElement>(".cal-private input");
    expect(boxes).toHaveLength(2);
    expect(root.querySelector(".cal-private")?.textContent).toContain("nur „Privat“");
    boxes[1].checked = true;
    boxes[1].dispatchEvent(new Event("change"));
    expect(seen[seen.length - 1]?.calendars).toEqual({ "calendar.work": { private: true } });
    el.setConfig(seen[seen.length - 1]!);
    await el.updateComplete;
    const again = root.querySelectorAll<HTMLInputElement>(".cal-private input");
    expect(again[1].checked).toBe(true);
    again[1].checked = false;
    again[1].dispatchEvent(new Event("change"));
    expect(seen[seen.length - 1]?.calendars).toBeUndefined();
  });
});

describe("phone and pin board settings", () => {
  it("offers the companion-app phones Home Assistant knows, plus finding them automatically", async () => {
    const { root } = await mountEditor({}, "de", {
      notify: {
        mobile_app_bens_pixel: {},
        mobile_app_annas_iphone: {},
        persistent_notification: {},
      },
    });
    const form = root.querySelector(".person ha-form") as HTMLElement & {
      schema: Array<{ name: string; selector: any }>;
    };
    const notify = form.schema.find((f) => f.name === "notify")!;
    expect(notify.selector.select.options).toEqual([
      { value: "auto", label: "Automatisch finden (über die Person)" },
      { value: "mobile_app_annas_iphone", label: "annas_iphone" },
      { value: "mobile_app_bens_pixel", label: "bens_pixel" },
    ]);
    expect(form.schema.some((f) => f.name === "eta")).toBe(true);
  });

  it("groups pin board, wall messages, presence, topics and ride reminders", async () => {
    const { fields, groupTitles } = await mountEditor({ message_entity: "input_text.wand" });
    expect(groupTitles()).toContain("📱 Handy & Pinnwand");
    for (const f of [
      "pinboard",
      "message_entity",
      "message_hours",
      "show_presence",
      "ping_topics",
      "ride_push",
    ])
      expect(fields()).toContain(f);
  });
});

describe("look: style, palette and colours", () => {
  type Ed = HTMLElement & { setConfig(c: unknown): void; updateComplete: Promise<unknown> };
  const changes = (el: HTMLElement) => {
    const seen: Array<Record<string, unknown>> = [];
    el.addEventListener("config-changed", (e) =>
      seen.push((e as CustomEvent).detail.config as Record<string, unknown>),
    );
    return seen;
  };
  const dotColors = (root: ShadowRoot, sel: string) =>
    [...root.querySelectorAll(sel)].map((el) =>
      (el.getAttribute("style") ?? "").replace("background:", "").trim(),
    );

  it("offers six styles and writes the chosen one; Classic removes it again", async () => {
    const { el, root } = await mountEditor();
    const seen = changes(el);
    const tiles = [...root.querySelectorAll<HTMLButtonElement>(".look")];
    expect(tiles.map((t) => t.dataset.style)).toEqual([
      "classic",
      "paper",
      "bold",
      "pastel",
      "glass",
      "contrast",
    ]);
    expect(tiles.map((t) => t.textContent!.trim())).toEqual([
      "Klassisch",
      "Papier",
      "Kräftig",
      "Pastell",
      "Glas",
      "Hoher Kontrast",
    ]);
    tiles[2].click();
    expect(seen[seen.length - 1].style).toBe("bold");
    (el as Ed).setConfig(seen[seen.length - 1]);
    await (el as Ed).updateComplete;
    expect(root.querySelector(".look.on")?.getAttribute("data-style")).toBe("bold");
    root.querySelector<HTMLButtonElement>('.look[data-style="classic"]')!.click();
    expect("style" in seen[seen.length - 1]).toBe(false);
  });

  it("a palette changes the person dots and the colours offered per person", async () => {
    const { el, root } = await mountEditor({
      persons: [{ name: "Anna" }, { name: "Ben" }],
      palette: "colorblind",
    });
    expect(dotColors(root, ".person .pdot")).toEqual(PALETTES.colorblind.slice(0, 2));
    expect(dotColors(root, ".person:first-child .swatch:not(.none)")).toEqual(PALETTES.colorblind);
    const seen = changes(el);
    root.querySelector<HTMLButtonElement>(".pal")!.click(); // Standard
    expect("palette" in seen[seen.length - 1]).toBe(false);
  });

  it("sets and clears the theme colours", async () => {
    const { el, root } = await mountEditor();
    const seen = changes(el);
    const row = (key: string) =>
      [...root.querySelectorAll(".color-row")].find((r) =>
        r.querySelector(".swatch")?.getAttribute("aria-label")?.startsWith(key),
      )!;
    row("Hintergrund").querySelector<HTMLButtonElement>(".swatch")!.click();
    expect(seen[seen.length - 1].background_color).toBe("#ffffff");
    row("Akzentfarbe").querySelectorAll<HTMLButtonElement>(".swatch")[2].click();
    expect(seen[seen.length - 1].accent_color).toBe("#7c3aed");
    (el as Ed).setConfig(seen[seen.length - 1]);
    await (el as Ed).updateComplete;
    row("Akzentfarbe").querySelector<HTMLButtonElement>(".swatch.none")!.click();
    expect("accent_color" in seen[seen.length - 1]).toBe(false);
  });
});
