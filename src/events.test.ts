import { describe, it, expect } from "vitest";
import { parseRawEvent, splitIntoSegments, layoutDayColumns, DAY_MS, BoardEvent } from "./events";

// A Monday at local midnight for deterministic week math.
const monday = (() => {
  const d = new Date(2024, 0, 1); // 2024-01-01 is a Monday
  d.setHours(0, 0, 0, 0);
  return d;
})();

const seg = (
  day: number,
  startMin: number,
  endMin: number,
  extra: Partial<BoardEvent> = {},
): BoardEvent => ({
  ref: {} as any,
  personIdx: 0,
  day,
  startMin,
  endMin,
  title: "x",
  allDay: false,
  color: "#000",
  continuesBefore: false,
  continuesAfter: false,
  ...extra,
});

describe("parseRawEvent", () => {
  it("parses a timed event", () => {
    const r = parseRawEvent(
      {
        start: { dateTime: "2024-01-01T10:00:00+00:00" },
        end: { dateTime: "2024-01-01T11:00:00+00:00" },
        summary: "Yoga",
      },
      0,
      "calendar.x",
      "#abc",
    )!;
    expect(r.allDay).toBe(false);
    expect(r.summary).toBe("Yoga");
    expect(r.end.getTime() - r.start.getTime()).toBe(60 * 60000);
  });

  it("treats all-day end date as exclusive", () => {
    const r = parseRawEvent(
      { start: { date: "2024-01-01" }, end: { date: "2024-01-02" }, summary: "Feiertag" },
      0,
      "calendar.x",
      "#abc",
    )!;
    expect(r.allDay).toBe(true);
    // exactly one day long
    expect(r.end.getTime() - r.start.getTime()).toBe(DAY_MS);
  });

  it("falls back to a default summary", () => {
    const r = parseRawEvent(
      { start: { dateTime: "2024-01-01T10:00:00Z" }, end: { dateTime: "2024-01-01T11:00:00Z" } },
      0,
      "calendar.x",
      "#abc",
    )!;
    expect(r.summary).toBe("Termin");
  });

  it("returns null for malformed input", () => {
    expect(parseRawEvent({}, 0, "calendar.x", "#abc")).toBeNull();
    expect(
      parseRawEvent({ start: { dateTime: "nope" }, end: { dateTime: "nope" } }, 0, "c", "#abc"),
    ).toBeNull();
  });

  it("passes through recurrence info (rrule / recurrence_id)", () => {
    const r = parseRawEvent(
      {
        start: { dateTime: "2024-01-01T10:00:00Z" },
        end: { dateTime: "2024-01-01T11:00:00Z" },
        rrule: "FREQ=WEEKLY",
        recurrence_id: "2024-01-01T10:00:00",
      },
      0,
      "calendar.x",
      "#abc",
    )!;
    expect(r.rrule).toBe("FREQ=WEEKLY");
    expect(r.recurrence_id).toBe("2024-01-01T10:00:00");
  });
});

describe("splitIntoSegments", () => {
  it("keeps a single-day timed event on its day", () => {
    const raw = parseRawEvent(
      { start: { dateTime: "2024-01-01T10:00:00" }, end: { dateTime: "2024-01-01T11:30:00" } },
      0,
      "calendar.x",
      "#abc",
    )!;
    const segs = splitIntoSegments(raw, monday);
    expect(segs).toHaveLength(1);
    expect(segs[0].day).toBe(0);
    expect(segs[0].startMin).toBe(600);
    expect(segs[0].endMin).toBe(690);
    expect(segs[0].continuesAfter).toBe(false);
  });

  it("splits an event crossing midnight into two days", () => {
    const raw = parseRawEvent(
      { start: { dateTime: "2024-01-01T22:00:00" }, end: { dateTime: "2024-01-02T01:00:00" } },
      0,
      "calendar.x",
      "#abc",
    )!;
    const segs = splitIntoSegments(raw, monday).sort((a, b) => a.day - b.day);
    expect(segs).toHaveLength(2);
    expect(segs[0]).toMatchObject({ day: 0, startMin: 1320, endMin: 1440, continuesAfter: true });
    expect(segs[1]).toMatchObject({ day: 1, startMin: 0, endMin: 60, continuesBefore: true });
  });

  it("spreads a multi-day all-day event across each covered day", () => {
    const raw = parseRawEvent(
      { start: { date: "2024-01-01" }, end: { date: "2024-01-04" } }, // exclusive -> 3 days
      0,
      "calendar.x",
      "#abc",
    )!;
    const segs = splitIntoSegments(raw, monday);
    expect(segs.map((s) => s.day)).toEqual([0, 1, 2]);
    expect(segs.every((s) => s.allDay && s.startMin === 0 && s.endMin === 1440)).toBe(true);
  });

  it("ignores events outside the visible week", () => {
    const raw = parseRawEvent(
      { start: { dateTime: "2024-02-01T10:00:00" }, end: { dateTime: "2024-02-01T11:00:00" } },
      0,
      "calendar.x",
      "#abc",
    )!;
    expect(splitIntoSegments(raw, monday)).toHaveLength(0);
  });
});

describe("layoutDayColumns", () => {
  it("gives non-overlapping events a single column", () => {
    const out = layoutDayColumns([seg(0, 600, 660), seg(0, 700, 760)]);
    expect(out.every((e) => e.cols === 1 && e.col === 0)).toBe(true);
  });

  it("places two overlapping events side by side", () => {
    const out = layoutDayColumns([seg(0, 600, 720), seg(0, 660, 780)]);
    expect(out.every((e) => e.cols === 2)).toBe(true);
    expect(new Set(out.map((e) => e.col))).toEqual(new Set([0, 1]));
  });

  it("reuses a column after the first event ends", () => {
    // A 9-10, B 9-11, C 10-11 -> A and C share col 0, B is col 1; cols=2
    const out = layoutDayColumns([seg(0, 540, 600), seg(0, 540, 660), seg(0, 600, 660)]);
    expect(Math.max(...out.map((e) => e.cols))).toBe(2);
  });

  it("starts a fresh cluster after a gap", () => {
    const out = layoutDayColumns([seg(0, 540, 600), seg(0, 545, 605), seg(0, 700, 760)]);
    const last = out.find((e) => e.startMin === 700)!;
    expect(last.cols).toBe(1);
    expect(last.col).toBe(0);
  });
});
