/* ------------------------------------------------------------------ */
/*  Every shipped language must be complete: the same keys as English, */
/*  no empty text, and the placeholders the code fills in.             */
/* ------------------------------------------------------------------ */
import { describe, it, expect } from "vitest";
import { CARD_STRINGS, localize } from "./localize";
import { EDITOR_STRINGS, et } from "./editor-i18n";

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();

for (const [what, table] of [
  ["card", CARD_STRINGS],
  ["editor", EDITOR_STRINGS],
] as const) {
  describe(`${what} texts`, () => {
    const en = table.en;
    it("ships English, German, Dutch, French and Spanish", () => {
      expect(Object.keys(table).sort()).toEqual(["de", "en", "es", "fr", "nl"]);
    });
    for (const [lang, dict] of Object.entries(table)) {
      it(`${lang}: has every key, nothing empty, the same placeholders`, () => {
        expect(Object.keys(dict).sort()).toEqual(Object.keys(en).sort());
        for (const [key, text] of Object.entries(dict)) {
          expect(text.trim(), `${lang}.${key}`).not.toBe("");
          expect(placeholders(text), `${lang}.${key}`).toEqual(placeholders(en[key]));
        }
      });
    }
  });
}

describe("language choice", () => {
  const hass = (language: string) => ({ locale: { language } });
  it("follows Home Assistant, also with a region", () => {
    expect(localize(hass("nl"), "today")).toBe("Vandaag");
    expect(localize(hass("fr-BE"), "today")).toBe("Aujourd'hui");
    expect(localize(hass("es-MX"), "today")).toBe("Hoy");
    expect(et("nl", "l_view")).toBe("Standaardweergave");
  });
  it("falls back to English for a language it does not ship", () => {
    expect(localize(hass("it"), "today")).toBe("Today");
    expect(et("it", "l_view")).toBe("Default view");
  });
});
