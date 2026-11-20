import { describe, it, expect } from "vitest";
import {
  clearCall,
  etaMinutes,
  guessNotify,
  notifyService,
  parseMessage,
  parseTopic,
  pingCall,
  presenceSpans,
  rideCall,
} from "./companion";

describe("notify services", () => {
  it("accepts the service with or without the domain, nothing else", () => {
    expect(notifyService("notify.mobile_app_ben")).toBe("mobile_app_ben");
    expect(notifyService("mobile_app_ben")).toBe("mobile_app_ben");
    expect(notifyService("notify.x; rm")).toBeUndefined();
    expect(notifyService(undefined)).toBeUndefined();
  });

  it("finds the phone through the person's device trackers", () => {
    const services = { mobile_app_bens_pixel: {}, persistent_notification: {} };
    expect(guessNotify(["device_tracker.router_ben", "device_tracker.bens_pixel"], services)).toBe(
      "mobile_app_bens_pixel",
    );
    expect(guessNotify(["device_tracker.other"], services)).toBeUndefined();
    expect(guessNotify(undefined, services)).toBeUndefined();
  });
});

describe("wall messages", () => {
  const names = ["Anna", "Ben"];
  it("knows who wrote it", () => {
    expect(parseMessage("Ben: 18:30, Stau", names)).toEqual({
      text: "18:30, Stau",
      personIdx: 1,
      name: "Ben",
    });
    expect(parseMessage("ben:  bin gleich da", names)?.personIdx).toBe(1);
  });
  it("keeps other text as it is, and ignores nothing", () => {
    expect(parseMessage("Treffen: 18 Uhr am Tor", names)).toEqual({
      text: "Treffen: 18 Uhr am Tor",
    });
    expect(parseMessage("", names)).toBeUndefined();
    expect(parseMessage("unknown", names)).toBeUndefined();
    expect(parseMessage(undefined, names)).toBeUndefined();
  });
});

describe("pings", () => {
  it("reads icon, text and whether it asks for an answer", () => {
    expect(parseTopic("🍽️ Essen ist fertig")).toEqual({
      icon: "🍽️",
      text: "Essen ist fertig",
      ask: false,
    });
    expect(parseTopic("? 🕐 Wann kommst du?")).toEqual({
      icon: "🕐",
      text: "Wann kommst du?",
      ask: true,
    });
    expect(parseTopic("Ruf an")).toEqual({ icon: "📣", text: "Ruf an", ask: false });
    expect(parseTopic("  ")).toBeUndefined();
  });

  it("asks with a text field and quick replies that carry the name", () => {
    const call = pingCall({ icon: "🕐", text: "Wann kommst du?", ask: true }, "Ben", "Board", {
      custom: "Antworten",
      quick: ["In 10 Min.", "Später"],
    });
    expect(call.message).toBe("🕐 Wann kommst du?");
    expect(call.data.actions).toEqual([
      { action: "FAMILY_BOARD|Ben|", title: "Antworten", behavior: "textInput" },
      { action: "FAMILY_BOARD|Ben|In 10 Min.", title: "In 10 Min." },
      { action: "FAMILY_BOARD|Ben|Später", title: "Später" },
    ]);
    const plain = pingCall({ icon: "🍽️", text: "Essen", ask: false }, "Ben", "Board", {
      custom: "x",
      quick: [],
    });
    expect(plain.data.actions).toBeUndefined();
  });
});

describe("ride push", () => {
  it("counts down to the start and can be taken away by its tag", () => {
    const start = new Date("2026-09-11T16:00:00+02:00");
    const call = rideCall("abc", "🚗 Mia abholen", "16:00", start);
    expect(call.data).toMatchObject({
      tag: "family-board-ride-abc",
      chronometer: true,
      when: start.getTime() / 1000,
    });
    expect(clearCall("abc")).toEqual({
      message: "clear_notification",
      data: { tag: "family-board-ride-abc" },
    });
  });
});

describe("where someone really was", () => {
  const at = (h: number, m = 0) => new Date(2026, 8, 11, h, m);
  const lu = (d: Date) => d.getTime() / 1000;
  it("turns the history into stretches from the start of the day until now", () => {
    const spans = presenceSpans(
      [
        { s: "home", lu: lu(at(6)) - 3600 * 12 }, // since last night
        { s: "Schule", lu: lu(at(7, 52)) },
        { s: "unknown", lu: lu(at(9)) },
        { s: "Schule", lu: lu(at(9, 5)) },
        { s: "home", lu: lu(at(13, 20)) },
      ],
      at(0),
      at(15),
    );
    expect(spans.map((s) => [s.state, s.from.getHours(), s.from.getMinutes()])).toEqual([
      ["home", 0, 0],
      ["Schule", 7, 52],
      ["Schule", 9, 5],
      ["home", 13, 20],
    ]);
    expect(spans[3].to).toEqual(at(15));
  });
  it("joins stretches in the same place", () => {
    const spans = presenceSpans(
      [
        { s: "home", lu: lu(at(1)) },
        { s: "home", lu: lu(at(2)) },
      ],
      at(0),
      at(3),
    );
    expect(spans).toHaveLength(1);
  });
});

describe("arrival time", () => {
  it("reads minutes, hours and seconds", () => {
    expect(etaMinutes("12", "min")).toBe(12);
    expect(etaMinutes("0.5", "h")).toBe(30);
    expect(etaMinutes("600", "s")).toBe(10);
    expect(etaMinutes("unknown")).toBeUndefined();
    expect(etaMinutes("-3")).toBeUndefined();
  });
});
