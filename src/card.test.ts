// @vitest-environment happy-dom
/* ------------------------------------------------------------------ */
/*  Component tests: the card rendered against a fake Home Assistant.  */
/*  They cover what the pure tests in events.test.ts cannot - what the */
/*  user actually ends up seeing.                                      */
/* ------------------------------------------------------------------ */
import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import type { FamilyBoardConfig } from "./ha-family-board-card";

beforeAll(async () => {
  await import("./ha-family-board-card");
});

/** An event as the HA calendar API hands it over. */
const ev = (summary: string, from: string, to: string, extra: Record<string, unknown> = {}) => {
  const day = "2026-09-11";
  return {
    uid: `${summary}-${from}`,
    summary,
    start: { dateTime: `${day}T${from}:00` },
    end: { dateTime: `${day}T${to}:00` },
    ...extra,
  };
};

const allDay = (summary: string, from = "2026-09-11", to = "2026-09-12") => ({
  uid: `${summary}-allday`,
  summary,
  start: { date: from },
  end: { date: to },
});

interface MountOpts {
  calendars?: Record<string, unknown[]>;
  /** todo.* entity -> its items, as `todo/item/list` would return them. */
  todos?: Record<string, unknown[]>;
  lang?: string;
  /** weather.forecast_home daily forecast, as weather.get_forecasts returns it. */
  forecast?: unknown[];
  /** calendar.* entities the card may write to (create, update, delete). */
  writable?: string[];
  /** Extra entity states, e.g. { "person.anna": "home" }. */
  states?: Record<string, string>;
  /** Home Assistant with live calendar updates; "old" = command unknown. */
  live?: "new" | "old";
  /** The REST answer never arrives (to see what is shown before it). */
  slowApi?: boolean;
  /** Media folder for the screensaver: what media_source/browse_media lists. */
  media?: Array<{ media_content_id: string; media_class: string }>;
  /** Local wall-clock time the test pretends it is. */
  now?: string;
}

const mounted: HTMLElement[] = [];

/** Render the card with a fake hass and wait until its events are in. */
async function mount(config: Partial<FamilyBoardConfig>, opts: MountOpts = {}) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(opts.now ?? "2026-09-11T10:20:00"));
  const calendars = opts.calendars ?? {};
  const todos = opts.todos ?? {};
  const states: Record<string, unknown> = {};
  for (const entity of Object.keys(calendars)) {
    states[entity] = {
      state: "on",
      attributes: {
        friendly_name: entity.split(".")[1],
        supported_features: opts.writable?.includes(entity) ? 7 : 0,
      },
    };
  }
  for (const entity of Object.keys(todos)) {
    states[entity] = {
      state: String(todos[entity].length),
      last_changed: "2026-09-11T06:00:00+00:00",
      attributes: { friendly_name: entity.split(".")[1], supported_features: 0 },
    };
  }
  if (opts.forecast) states["weather.forecast_home"] = { state: "sunny", attributes: {} };
  for (const [entity, state] of Object.entries(opts.states ?? {})) {
    states[entity] = { state, attributes: { friendly_name: entity.split(".")[1] } };
  }
  const wsCalls: Array<Record<string, unknown>> = [];
  const apiPaths: string[] = [];
  const subs: Array<{
    msg: Record<string, unknown>;
    push: (events: unknown[] | null) => void;
    unsubscribed: boolean;
  }> = [];
  const el = document.createElement("family-board-card") as HTMLElement & {
    setConfig(c: unknown): void;
    hass: unknown;
    updateComplete: Promise<unknown>;
  };
  el.setConfig({ type: "custom:family-board-card", persons: [], ...config });
  el.hass = {
    locale: { language: opts.lang ?? "de", time_format: "24" },
    states,
    connection: opts.live
      ? {
          subscribeMessage: async (
            cb: (m: { events: unknown[] | null }) => void,
            msg: Record<string, unknown>,
          ) => {
            if (opts.live === "old") throw new Error("Unknown command.");
            const sub = {
              msg,
              push: (events: unknown[] | null) => cb({ events }),
              unsubscribed: false,
            };
            subs.push(sub);
            return async () => {
              sub.unsubscribed = true;
            };
          },
        }
      : undefined,
    callApi: async (_method: string, path: string) => {
      apiPaths.push(path);
      if (opts.slowApi) return new Promise(() => undefined);
      return calendars[path.split("?")[0].replace("calendars/", "")] ?? [];
    },
    callWS: async (msg: Record<string, unknown>) => {
      wsCalls.push(msg);
      if (msg.type === "media_source/browse_media") return { children: opts.media ?? [] };
      if (msg.type === "media_source/resolve_media") {
        const id = String(msg.media_content_id);
        return { url: `/media/local/${id.split("/").pop()}?authSig=x`, mime_type: "image/jpeg" };
      }
      if (msg.type === "todo/item/list") {
        return { items: todos[msg.entity_id as string] ?? [] };
      }
      if (msg.type === "call_service" && msg.service === "get_forecasts") {
        return { response: { "weather.forecast_home": { forecast: opts.forecast ?? [] } } };
      }
      return {};
    },
  };
  document.body.appendChild(el);
  mounted.push(el);
  // let the fetch promise chain and the resulting re-render settle
  for (let i = 0; i < 8; i++) {
    await vi.advanceTimersByTimeAsync(0);
    await el.updateComplete;
  }
  const root = el.shadowRoot as ShadowRoot;
  return {
    el,
    root,
    wsCalls,
    apiPaths,
    subs,
    text: () => (root.textContent ?? "").replace(/\s+/g, " ").trim(),
    all: (sel: string) => [...root.querySelectorAll(sel)],
    texts: (sel: string) =>
      [...root.querySelectorAll(sel)].map((n) => (n.textContent ?? "").replace(/\s+/g, " ").trim()),
  };
}

afterEach(() => {
  mounted.splice(0).forEach((el) => el.remove());
  localStorage.clear();
  vi.useRealTimers();
});

describe("configuration", () => {
  it("refuses a config without persons, in the browser language", async () => {
    await import("./ha-family-board-card");
    const el = document.createElement("family-board-card") as HTMLElement & {
      setConfig(c: unknown): void;
    };
    expect(() => el.setConfig({ type: "custom:family-board-card" })).toThrow(/persons/);
  });

  it("falls back to an enabled view when the default is not among them", async () => {
    const { root } = await mount({
      persons: [{ name: "Anna" }],
      view: "month",
      views: ["agenda", "day"],
      start_hour: 7,
      end_hour: 20,
    });
    // month was asked for but is not enabled, so the card must not render it;
    // the enabled views keep their canonical order, which puts the day first
    expect(root.querySelector(".month")).toBeNull();
    expect(root.querySelector(".board")).not.toBeNull();
  });

  it("renders the localized default title, or a configured one", async () => {
    expect((await mount({ persons: [{ name: "A" }] })).text()).toContain("Familienplan");
    expect((await mount({ persons: [{ name: "A" }] }, { lang: "en" })).text()).toContain(
      "Family board",
    );
    expect((await mount({ persons: [{ name: "A" }], title: "Wer ist wo?" })).text()).toContain(
      "Wer ist wo?",
    );
  });
});

describe("day check", () => {
  const twoPeople: Partial<FamilyBoardConfig> = {
    persons: [
      { name: "Anna", calendar: "calendar.anna" },
      { name: "Ben", calendar: "calendar.ben" },
    ],
    view: "day",
    views: ["day"],
    show_alerts: true,
    gap_min: 60,
    background_hours: 0,
    start_hour: 7,
    end_hour: 20,
  };
  const calendars = {
    "calendar.anna": [ev("Meeting", "09:00", "11:00"), ev("Zahnarzt", "10:30", "12:00")],
    "calendar.ben": [ev("Schule", "08:00", "13:00"), ev("Turnen", "15:00", "16:30")],
  };

  it("names the person and the window of a double booking", async () => {
    const { texts } = await mount(twoPeople, { calendars, now: "2026-09-11T07:00:00" });
    const conflict = texts(".alert.a-conflict");
    expect(conflict).toHaveLength(1);
    expect(conflict[0]).toContain("Anna");
    expect(conflict[0]).toContain("10:30–11:00");
  });

  it("reports care gaps and the nobody-home window", async () => {
    const { texts } = await mount(twoPeople, { calendars, now: "2026-09-11T07:00:00" });
    expect(texts(".alert.a-gap").join(" ")).toContain("Ben");
    expect(texts(".alert.a-empty").join(" ")).toContain("09:00–12:00");
  });

  it("drops windows that are already over", async () => {
    const early = await mount(twoPeople, { calendars, now: "2026-09-11T07:00:00" });
    const late = await mount(twoPeople, { calendars, now: "2026-09-11T17:00:00" });
    expect(early.all(".alert").length).toBeGreaterThan(0);
    expect(late.all(".alert")).toHaveLength(0);
  });

  it("stays out of the way unless switched on", async () => {
    const { all } = await mount(
      { ...twoPeople, show_alerts: false },
      { calendars, now: "2026-09-11T07:00:00" },
    );
    expect(all(".alert")).toHaveLength(0);
  });

  it("translates the chips", async () => {
    const { texts } = await mount(twoPeople, {
      calendars,
      lang: "en",
      now: "2026-09-11T07:00:00",
    });
    expect(texts(".alert").join(" ")).toContain("two events at once");
    expect(texts(".alert").join(" ")).toContain("nobody home");
  });
});

describe("agenda", () => {
  const base: Partial<FamilyBoardConfig> = {
    persons: [{ name: "Anna", calendar: "calendar.anna" }],
    view: "agenda",
    views: ["agenda"],
  };
  // Mon 7th through Sun 13th of the week under test, plus one in the week before
  const calendars = {
    "calendar.anna": [
      {
        uid: "vw",
        summary: "Vorwoche",
        start: { dateTime: "2026-09-02T09:00:00" },
        end: { dateTime: "2026-09-02T10:00:00" },
      },
      {
        uid: "mo",
        summary: "Montag",
        start: { dateTime: "2026-09-07T09:00:00" },
        end: { dateTime: "2026-09-07T10:00:00" },
      },
      {
        uid: "do",
        summary: "Gestern",
        start: { dateTime: "2026-09-10T09:00:00" },
        end: { dateTime: "2026-09-10T10:00:00" },
      },
      {
        uid: "fr",
        summary: "Heute",
        start: { dateTime: "2026-09-11T09:00:00" },
        end: { dateTime: "2026-09-11T10:00:00" },
      },
      {
        uid: "sa",
        summary: "Morgen",
        start: { dateTime: "2026-09-12T09:00:00" },
        end: { dateTime: "2026-09-12T10:00:00" },
      },
    ],
  };

  it("groups events by day and marks today", async () => {
    const { texts, all } = await mount(base, { calendars });
    expect(texts(".agenda-date")).toHaveLength(4);
    expect(all(".agenda-date.today")).toHaveLength(1);
    expect(texts(".agenda-date.today")[0]).toContain("Heute");
  });

  it("hide_past starts the list at today", async () => {
    const { texts } = await mount({ ...base, hide_past: true }, { calendars });
    expect(texts(".agenda-row").join(" ")).not.toContain("Gestern");
    expect(texts(".agenda-row").join(" ")).toContain("Heute");
  });

  it("keeps a week the user paged back to complete", async () => {
    const { el, root, texts } = await mount({ ...base, hide_past: true }, { calendars });
    (root.querySelector("button.nav") as HTMLButtonElement).click();
    await vi.advanceTimersByTimeAsync(0);
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    // a past week is shown in full; nothing is filtered away - and it is
    // really that week's data, not the current week's left on screen
    expect(texts(".agenda-row").join(" ")).toContain("Vorwoche");
    expect(texts(".agenda-row").join(" ")).not.toContain("Heute");
  });
});

describe("event clean-up", () => {
  const base: Partial<FamilyBoardConfig> = {
    persons: [{ name: "Anna", calendar: "calendar.anna" }],
    view: "agenda",
    views: ["agenda"],
  };

  it("hides events matching hide_patterns", async () => {
    const calendars = {
      "calendar.anna": [ev("Hofpause", "09:00", "09:20"), ev("Sport", "10:00", "11:00")],
    };
    const { texts } = await mount({ ...base, hide_patterns: ["hofpause"] }, { calendars });
    expect(texts(".agenda-row").join(" ")).not.toContain("Hofpause");
    expect(texts(".agenda-row").join(" ")).toContain("Sport");
  });

  it("show_patterns keeps only what matches", async () => {
    const calendars = {
      "calendar.anna": [ev("Hofpause", "09:00", "09:20"), ev("Sport", "10:00", "11:00")],
    };
    const { texts } = await mount({ ...base, show_patterns: ["sport"] }, { calendars });
    expect(texts(".agenda-row")).toHaveLength(1);
    expect(texts(".agenda-row")[0]).toContain("Sport");
  });

  it("rewrites titles via replace_patterns", async () => {
    const calendars = { "calendar.anna": [ev("Klassenverbund", "09:00", "10:00")] };
    const { texts } = await mount(
      { ...base, replace_patterns: ["Klassenverbund => Unterricht"] },
      { calendars },
    );
    expect(texts(".agenda-row")[0]).toContain("Unterricht");
  });

  it("shows the same event from two calendars once when asked", async () => {
    const shared = ev("Kino", "18:00", "20:00");
    const calendars = { "calendar.anna": [shared], "calendar.ben": [{ ...shared, uid: "other" }] };
    const persons = [
      { name: "Anna", calendar: "calendar.anna" },
      { name: "Ben", calendar: "calendar.ben" },
    ];
    const withDupes = await mount({ ...base, persons }, { calendars });
    const deduped = await mount({ ...base, persons, filter_duplicates: true }, { calendars });
    expect(withDupes.texts(".agenda-row")).toHaveLength(2);
    expect(deduped.texts(".agenda-row")).toHaveLength(1);
  });
});

describe("day offset", () => {
  // 2026-09-11 is a Friday; the tests mount at 10:20 that day.
  const evAt = (day: string, summary: string) => ({
    uid: summary,
    summary,
    start: { dateTime: `${day}T09:00:00` },
    end: { dateTime: `${day}T10:00:00` },
  });
  const calendars = {
    "calendar.anna": [
      evAt("2026-09-10", "Donnerstag"),
      evAt("2026-09-11", "Freitag"),
      evAt("2026-09-12", "Samstag"),
      evAt("2026-09-14", "Montag danach"),
    ],
  };
  const dayView: Partial<FamilyBoardConfig> = {
    persons: [{ name: "Anna", calendar: "calendar.anna" }],
    view: "day",
    views: ["day"],
    start_hour: 7,
    end_hour: 20,
    background_hours: 0,
  };

  it("stands on today without an offset", async () => {
    const { texts } = await mount(dayView, { calendars });
    expect(texts(".event").join(" ")).toContain("Freitag");
  });

  it("starts on tomorrow when asked to", async () => {
    const { texts } = await mount({ ...dayView, day_offset: 1 }, { calendars });
    expect(texts(".event").join(" ")).toContain("Samstag");
    expect(texts(".event").join(" ")).not.toContain("Freitag");
  });

  it("takes a negative offset for yesterday", async () => {
    const { texts } = await mount({ ...dayView, day_offset: -1 }, { calendars });
    expect(texts(".event").join(" ")).toContain("Donnerstag");
  });

  it("carries the offset across the week boundary", async () => {
    // Friday + 3 is Monday, which lives in the *following* week
    const { texts } = await mount({ ...dayView, day_offset: 3 }, { calendars });
    expect(texts(".event").join(" ")).toContain("Montag danach");
  });

  it("returns to the offset day, not to today, after kiosk inactivity", async () => {
    const { el, root, texts } = await mount(
      { ...dayView, day_offset: 1, auto_return: 1 },
      { calendars },
    );
    const settle = async () => {
      await vi.advanceTimersByTimeAsync(0);
      await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    };
    // wander off to another day, then let the kiosk timer bring the card back
    (root.querySelectorAll(".tabs button")[0] as HTMLElement).click();
    await settle();
    await vi.advanceTimersByTimeAsync(2 * 60000);
    await settle();
    expect(texts(".event").join(" ")).toContain("Samstag");
  });
});

describe("slim header", () => {
  const base: Partial<FamilyBoardConfig> = {
    persons: [{ name: "Anna" }],
    view: "day",
    views: ["day"],
    start_hour: 7,
    end_hour: 20,
  };

  it("keeps the weekday buttons on their own line by default", async () => {
    const { el, root } = await mount(base);
    expect(el.hasAttribute("slim")).toBe(false);
    const dayhead = root.querySelector(".dayhead") as HTMLElement;
    expect(dayhead.contains(root.querySelector(".tabs"))).toBe(false);
  });

  it("moves them up onto the navigation line", async () => {
    const { el, root } = await mount({ ...base, slim_header: true });
    expect(el.hasAttribute("slim")).toBe(true);
    const dayhead = root.querySelector(".dayhead") as HTMLElement;
    expect(dayhead.contains(root.querySelector(".tabs"))).toBe(true);
    // exactly one row of weekday buttons, not one per place it could live
    expect(root.querySelectorAll(".tabs")).toHaveLength(1);
  });

  it("does the same in the timeline", async () => {
    const { root } = await mount({
      ...base,
      view: "timeline",
      views: ["timeline"],
      slim_header: true,
    });
    const dayhead = root.querySelector(".dayhead") as HTMLElement;
    expect(dayhead.contains(root.querySelector(".tabs"))).toBe(true);
  });

  it("wraps name and status so they can sit beside the avatar", async () => {
    const { root } = await mount({ ...base, slim_header: true });
    const meta = root.querySelector(".phead .pmeta");
    expect(meta).not.toBeNull();
    expect(meta?.querySelector(".pname")?.textContent).toContain("Anna");
  });
});

describe("due tasks", () => {
  const task = (uid: string, summary: string, due?: string, status = "needs_action") => ({
    uid,
    summary,
    status,
    ...(due ? { due } : {}),
  });
  const dayView: Partial<FamilyBoardConfig> = {
    view: "day",
    views: ["day"],
    start_hour: 7,
    end_hour: 20,
  };

  it("says nothing about tasks and asks Home Assistant nothing when none are configured", async () => {
    const { root, wsCalls } = await mount(
      { ...dayView, persons: [{ name: "Anna", calendar: "calendar.anna" }] },
      {
        calendars: { "calendar.anna": [ev("Sport", "10:00", "11:00")] },
        todos: { "todo.anna": [task("t1", "Müll rausbringen", "2026-09-11")] },
      },
    );
    // a board without configured lists must not even ask for them
    expect(wsCalls.filter((c) => c.type === "todo/item/list")).toHaveLength(0);
    expect(root.querySelectorAll(".taskchip")).toHaveLength(0);
  });

  it("shows a task due today as a chip", async () => {
    const { texts } = await mount(
      { ...dayView, persons: [{ name: "Anna", tasks: "todo.anna" }] },
      { todos: { "todo.anna": [task("t1", "Müll rausbringen", "2026-09-11")] } },
    );
    expect(texts(".taskchip").join(" ")).toContain("Müll rausbringen");
  });

  it("leaves out completed tasks and tasks without a due date", async () => {
    const { root } = await mount(
      { ...dayView, persons: [{ name: "Anna", tasks: "todo.anna" }] },
      {
        todos: {
          "todo.anna": [
            task("t1", "Erledigt", "2026-09-11", "completed"),
            task("t2", "Irgendwann"),
          ],
        },
      },
    );
    expect(root.querySelectorAll(".taskchip")).toHaveLength(0);
  });

  it("marks an overdue task and keeps it on today", async () => {
    const { root, texts } = await mount(
      { ...dayView, persons: [{ name: "Anna", tasks: "todo.anna" }] },
      { todos: { "todo.anna": [task("t1", "Längst fällig", "2026-09-08")] } },
    );
    expect(texts(".taskchip.overdue").join(" ")).toContain("Längst fällig");
    expect(root.querySelectorAll(".taskchip")).toHaveLength(1);
  });

  it("does not carry an overdue task onto other days of the week", async () => {
    const { root } = await mount(
      { ...dayView, persons: [{ name: "Anna", tasks: "todo.anna" }] },
      {
        todos: { "todo.anna": [task("t1", "Längst fällig", "2026-09-08")] },
        now: "2026-09-12T09:00:00",
      },
    );
    // the 12th is today now, so the overdue task moves along with today
    expect(root.querySelectorAll(".taskchip")).toHaveLength(1);
  });

  it("hides the tasks of a person who is switched off", async () => {
    const { el, root } = await mount(
      { ...dayView, persons: [{ name: "Anna", tasks: "todo.anna" }] },
      { todos: { "todo.anna": [task("t1", "Müll rausbringen", "2026-09-11")] } },
    );
    expect(root.querySelectorAll(".taskchip")).toHaveLength(1);
    (root.querySelector(".phead") as HTMLElement).click();
    await vi.advanceTimersByTimeAsync(0);
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(root.querySelectorAll(".taskchip")).toHaveLength(0);
  });

  it("lists due tasks in the agenda as well", async () => {
    const { texts } = await mount(
      { view: "agenda", views: ["agenda"], persons: [{ name: "Anna", tasks: "todo.anna" }] },
      { todos: { "todo.anna": [task("t1", "Müll rausbringen", "2026-09-11")] } },
    );
    expect(texts(".agenda-row.task").join(" ")).toContain("Müll rausbringen");
  });

  it("survives a list that cannot be read", async () => {
    const el = document.createElement("family-board-card") as HTMLElement & {
      setConfig(c: unknown): void;
      hass: unknown;
      updateComplete: Promise<unknown>;
    };
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-11T10:20:00"));
    el.setConfig({
      type: "custom:family-board-card",
      view: "day",
      views: ["day"],
      persons: [{ name: "Anna", tasks: "todo.kaputt" }],
    });
    el.hass = {
      locale: { language: "de" },
      states: { "todo.kaputt": { state: "1", last_changed: "x", attributes: {} } },
      callApi: async () => [],
      callWS: async () => {
        throw new Error("not supported");
      },
    };
    document.body.appendChild(el);
    mounted.push(el);
    for (let i = 0; i < 8; i++) {
      await vi.advanceTimersByTimeAsync(0);
      await el.updateComplete;
    }
    expect((el.shadowRoot as ShadowRoot).textContent).toContain("Familienplan");
  });
});

describe("people", () => {
  it("collapses a person on a header click and brings them back", async () => {
    const calendars = { "calendar.anna": [ev("Sport", "10:00", "11:00")] };
    const { el, root, texts } = await mount(
      {
        persons: [{ name: "Anna", calendar: "calendar.anna" }],
        view: "day",
        views: ["day"],
        start_hour: 7,
        end_hour: 20,
        background_hours: 0,
      },
      { calendars },
    );
    const settle = async () => {
      await vi.advanceTimersByTimeAsync(0);
      await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    };
    expect(texts(".event").join(" ")).toContain("Sport");
    (root.querySelector(".phead") as HTMLElement).click();
    await settle();
    expect(texts(".event").join(" ")).not.toContain("Sport");
    (root.querySelector(".phead") as HTMLElement).click();
    await settle();
    expect(texts(".event").join(" ")).toContain("Sport");
  });

  it("starts a person collapsed when hidden is set", async () => {
    const calendars = { "calendar.anna": [ev("Sport", "10:00", "11:00")] };
    const { texts } = await mount(
      {
        persons: [{ name: "Anna", calendar: "calendar.anna", hidden: true }],
        view: "day",
        views: ["day"],
        start_hour: 7,
        end_hour: 20,
      },
      { calendars },
    );
    expect(texts(".event").join(" ")).not.toContain("Sport");
  });
});

describe("all-day events", () => {
  it("lands in the all-day row, not in the time grid", async () => {
    const calendars = { "calendar.anna": [allDay("Ferien")] };
    const { root, texts } = await mount(
      {
        persons: [{ name: "Anna", calendar: "calendar.anna" }],
        view: "day",
        views: ["day"],
        start_hour: 7,
        end_hour: 20,
      },
      { calendars },
    );
    expect(root.querySelector(".allday-row")?.textContent ?? "").toContain("Ferien");
    expect(texts(".event").join(" ")).not.toContain("Ferien");
  });
});

describe("weather", () => {
  const forecast = [
    { datetime: "2026-09-11T10:00:00+00:00", condition: "rainy", temperature: 17.6, templow: 9.2 },
    { datetime: "2026-09-12T10:00:00+00:00", condition: "sunny", temperature: 21, templow: 11 },
  ];
  const base = {
    persons: [{ name: "Anna", calendar: "calendar.anna" }],
    weather_entity: "weather.forecast_home",
    start_hour: 7,
    end_hour: 20,
  };

  it("shows high and low in the day header", async () => {
    const { texts } = await mount({ ...base, view: "day" }, { forecast });
    expect(texts(".dayhead .wx")).toEqual(["18° / 9°"]);
  });

  it("shows the high next to each weekday in the week view", async () => {
    const { all } = await mount({ ...base, view: "week" }, { forecast });
    const chips = all(".wday .wx.short");
    expect(chips.map((c) => (c.textContent ?? "").trim())).toEqual(["18°", "21°"]);
    // the tooltip still carries the full forecast
    expect(chips[0].getAttribute("title")).toBe("rainy · 18° / 9°");
  });

  it("shows only the symbol in month cells", async () => {
    const { all } = await mount({ ...base, view: "month" }, { forecast });
    const chips = all(".mcell .wx.icon");
    expect(chips).toHaveLength(2);
    expect((chips[0].textContent ?? "").trim()).toBe("");
    expect(chips[0].querySelector("ha-icon")?.getAttribute("icon")).toBe("mdi:weather-rainy");
  });

  it("leaves out the low when the provider does not send one", async () => {
    const { texts } = await mount(
      { ...base, view: "day" },
      {
        forecast: [{ datetime: "2026-09-11T10:00:00+00:00", condition: "sunny", temperature: 20 }],
      },
    );
    expect(texts(".dayhead .wx")).toEqual(["20°"]);
  });

  it("shows no weather when show_weather is off", async () => {
    const { all, wsCalls } = await mount(
      { ...base, view: "week", show_weather: false },
      { forecast },
    );
    expect(all(".wx")).toHaveLength(0);
    expect(wsCalls.some((m) => m.service === "get_forecasts")).toBe(false);
  });
});

describe("now view", () => {
  const persons = [
    { name: "Anna", calendar: "calendar.anna" },
    { name: "Mia", calendar: "calendar.mia" },
    { name: "Leon", calendar: "calendar.leon" },
  ];
  const calendars = {
    "calendar.anna": [ev("Büro", "09:00", "17:00"), ev("Abholen", "17:30", "18:00")],
    "calendar.mia": [
      allDay("Projektwoche"),
      ev("Schule", "08:00", "10:00"),
      ev("Schwimmen", "10:45", "11:30"),
    ],
    "calendar.leon": [
      {
        uid: "kita",
        summary: "Kita",
        start: { dateTime: "2026-09-12T08:00:00" },
        end: { dateTime: "2026-09-12T12:00:00" },
      },
    ],
  };

  it("is opt-in: boards without a views list do not get a new tab", async () => {
    const { texts } = await mount({ persons, view: "day" }, { calendars });
    expect(texts(".switch button")).not.toContain("Jetzt");
  });

  it("is switched on by choosing it as the default view", async () => {
    const { root, texts } = await mount({ persons, view: "now" }, { calendars });
    expect(texts(".switch button")[0]).toBe("Jetzt");
    expect(root.querySelector(".now")).not.toBeNull();
  });

  it("shows what everyone is doing now and what comes next", async () => {
    const { texts } = await mount({ persons, view: "now", views: ["now"] }, { calendars });
    const rows = texts(".nrow");
    // Anna: running event with its end time
    expect(rows[0]).toContain("Büro");
    expect(rows[0]).toContain("bis 17:00");
    // more than an hour away: the clock time, not "in 7 h"
    expect(rows[0]).toContain("als Nächstes: Abholen 17:30");
    // Mia: school has ended (10:00), swimming starts in 25 minutes at 10:45
    expect(rows[1]).toContain("frei");
    expect(rows[1]).toMatch(/als Nächstes: Schwimmen in 25 Min/);
    // the all-day event of today is shown as a chip
    expect(texts(".nrow:nth-child(2) .nallday")).toEqual(["Projektwoche"]);
    // Leon: free today, next event tomorrow is named by day and time
    expect(rows[2]).toContain("frei");
    expect(rows[2]).toContain("Morgen 08:00");
  });

  it("shows how far the running event has got", async () => {
    const { root } = await mount({ persons, view: "now", views: ["now"] }, { calendars });
    // 09:00-17:00 at 10:20 -> 80 of 480 minutes
    const bar = root.querySelector(".nrow .nprog");
    expect(bar?.getAttribute("aria-valuenow")).toBe("17");
  });

  it("fetches from today on, so a Sunday night still sees Monday", async () => {
    const { apiPaths } = await mount(
      { persons, view: "now", views: ["now"] },
      { calendars, now: "2026-09-13T21:00:00" },
    );
    // Sunday 13 Sep: the week view would stop at midnight; the now view looks ahead
    const q = new URLSearchParams(apiPaths[0].split("?")[1]);
    expect(new Date(q.get("start") as string).getDate()).toBe(13);
    expect(new Date(q.get("end") as string).getDate()).toBe(21);
  });

  it("hides the focus bar there - the view already is one", async () => {
    const { root } = await mount(
      { persons, view: "now", views: ["now", "day"], show_focus: true },
      { calendars },
    );
    expect(root.querySelector(".focus")).toBeNull();
  });
});

describe("accessibility", () => {
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = { "calendar.anna": [ev("Abholen", "16:30", "17:00")] };

  it("announces events with title, time and person", async () => {
    const { root } = await mount(
      { persons, view: "day", views: ["day"], start_hour: 7, end_hour: 20 },
      { calendars },
    );
    expect(root.querySelector(".event")?.getAttribute("aria-label")).toBe(
      "Abholen, 16:30–17:00, Anna",
    );
  });

  it("tells whether a person column is shown", async () => {
    const { el, root } = await mount(
      { persons, view: "day", views: ["day"], start_hour: 7, end_hour: 20 },
      { calendars },
    );
    const head = () => root.querySelector(".phead") as HTMLElement;
    expect(head().getAttribute("aria-pressed")).toBe("true");
    head().click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(head().getAttribute("aria-pressed")).toBe("false");
  });

  it("makes each tab list a single Tab stop, arrows move through it", async () => {
    const { el, root } = await mount({ persons, view: "day" }, { calendars });
    const tabs = () => [...root.querySelectorAll(".switch [role=tab]")] as HTMLElement[];
    expect(tabs().map((t) => t.tabIndex)).toEqual([0, -1, -1, -1, -1]);
    root
      .querySelector(".switch")
      ?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(tabs().map((t) => t.tabIndex)).toEqual([-1, 0, -1, -1, -1]);
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");
  });

  it("reads month cells as a date with their events, not a bare number", async () => {
    const { root } = await mount({ persons, view: "month", views: ["month"] }, { calendars });
    // no aria-label: it would hide the visible text from voice control
    // ("label in name"); the full date is added as screen-reader-only text
    const cells = [...root.querySelectorAll(".mcell")];
    expect(cells.every((c) => !c.hasAttribute("aria-label"))).toBe(true);
    const name = (c: Element) => (c.textContent ?? "").replace(/\s+/g, " ").trim();
    expect(cells.map(name)).toContain("Freitag, 11. September: 11 Abholen");
  });

  it("keeps the visible weekday in its name and adds the date", async () => {
    const { root } = await mount({ persons, view: "week", views: ["week"] }, { calendars });
    const day = root.querySelectorAll(".wday")[4];
    expect(day.hasAttribute("aria-label")).toBe(false);
    expect((day.textContent ?? "").replace(/\s+/g, " ").trim()).toBe("Freitag, 11. September: Fr");
  });

  it("reads month events hidden behind +N at the end", async () => {
    const many = {
      "calendar.anna": ["A", "B", "C", "D", "E"].map((t, i) =>
        ev(t, `0${i + 1}:00`, `0${i + 1}:30`),
      ),
    };
    const { root } = await mount({ persons, view: "month", views: ["month"] }, { calendars: many });
    const cell = [...root.querySelectorAll(".mcell")].find((c) =>
      c.textContent?.includes("Freitag, 11. September"),
    );
    expect(cell?.querySelector(".mmore")?.textContent).toBe("+2");
    expect(cell?.querySelector(".mmore + .sr")?.textContent).toBe("D, E");
  });
});

describe("family calendars", () => {
  const persons = [
    { name: "Anna", calendar: "calendar.anna" },
    { name: "Mia", calendar: "calendar.mia" },
  ];
  const calendars = {
    "calendar.anna": [ev("Büro", "09:00", "17:00")],
    "calendar.mia": [ev("Schule", "08:00", "13:00")],
    "calendar.muell": [allDay("Gelbe Tonne")],
    "calendar.ferien": [allDay("Herbstferien", "2026-09-10", "2026-09-15")],
    "calendar.familie": [ev("Elternabend", "09:30", "10:30")],
  };
  const base = {
    persons,
    family_calendars: ["calendar.muell", "calendar.ferien", "calendar.familie"],
    start_hour: 7,
    end_hour: 20,
  };

  it("shows family events as a band above the people, with the time for timed ones", async () => {
    const { texts, root } = await mount({ ...base, view: "day", views: ["day"] }, { calendars });
    // chronological: the holidays started the day before
    expect(texts(".famband .famchip")).toEqual([
      "Herbstferien",
      "Gelbe Tonne",
      "09:30 Elternabend",
    ]);
    // they belong to nobody: no person column shows them
    const columns = [...root.querySelectorAll(".board .event, .board .band")].map(
      (n) => n.textContent ?? "",
    );
    expect(columns.join(" ")).not.toMatch(/Tonne|Elternabend/);
  });

  it("never counts them as a double booking or for the focus bar", async () => {
    // Anna is free at 10:20 - a leaked family event would be "now" for her
    const { root, texts } = await mount(
      { ...base, view: "day", views: ["day"], show_alerts: true, show_focus: true },
      { calendars: { ...calendars, "calendar.anna": [] } },
    );
    const alerts = [...root.querySelectorAll(".alert")].map((n) => n.textContent ?? "").join(" ");
    expect(alerts).not.toContain("Elternabend");
    expect(texts(".focus").join(" ")).not.toContain("Elternabend");
  });

  it("puts them under each weekday in the week, multi-day ones on every day", async () => {
    const { all } = await mount({ ...base, view: "week", views: ["week"] }, { calendars });
    const perDay = all(".wday").map((d) =>
      [...d.querySelectorAll(".famchip .famtext")].map((c) => c.textContent),
    );
    // Mon 7 .. Sun 13: holidays from Thu 10 on, bin and parents' evening on Fri 11
    expect(perDay[2]).toEqual([]);
    expect(perDay[3]).toEqual(["Herbstferien"]);
    expect(perDay[4]).toEqual(["Herbstferien", "Gelbe Tonne", "Elternabend"]);
    expect(perDay[6]).toEqual(["Herbstferien"]);
  });

  it("shows them in month cells and reads them out", async () => {
    const { root } = await mount({ ...base, view: "month", views: ["month"] }, { calendars });
    const cell = [...root.querySelectorAll(".mcell")].find((c) =>
      c.textContent?.includes("Freitag, 11. September"),
    );
    expect((cell?.textContent ?? "").replace(/\s+/g, " ").trim()).toBe(
      "Freitag, 11. September: 11 Herbstferien Gelbe Tonne 09:30 Elternabend Schule Büro",
    );
    expect(cell?.querySelectorAll(".famchip")).toHaveLength(3);
  });

  it("lists a day in the agenda even when only the family has something", async () => {
    const { texts } = await mount(
      { ...base, view: "agenda", views: ["agenda"] },
      { calendars: { ...calendars, "calendar.anna": [], "calendar.mia": [] } },
    );
    // Thu 10 has nothing but the start of the holidays
    expect(texts(".agenda-date").some((t) => t.startsWith("Gestern"))).toBe(true);
  });

  it("shows today's family events in the now view", async () => {
    const { texts } = await mount({ ...base, view: "now", views: ["now"] }, { calendars });
    expect(texts(".now .famband .famtext")).toEqual(["Herbstferien", "Gelbe Tonne", "Elternabend"]);
  });

  it("stays out of the way when not configured", async () => {
    const { root, apiPaths } = await mount(
      { persons, view: "day", views: ["day"], start_hour: 7, end_hour: 20 },
      { calendars },
    );
    expect(root.querySelector(".famband")).toBeNull();
    expect(apiPaths.some((p) => p.includes("calendar.muell"))).toBe(false);
  });
});

describe("auto icons", () => {
  it("gives a nap the nap icon, even when its German name starts like lunch", async () => {
    const calendars = {
      "calendar.leon": [ev("Mittagessen", "11:30", "12:15"), ev("Mittagsschlaf", "12:15", "14:00")],
    };
    const { texts } = await mount(
      {
        persons: [{ name: "Leon", calendar: "calendar.leon" }],
        view: "agenda",
        views: ["agenda"],
        auto_icons: true,
      },
      { calendars },
    );
    expect(texts(".agenda-title")).toEqual(["🍽️ Mittagessen", "😴 Mittagsschlaf"]);
  });
});

describe("new recurring events", () => {
  type Card = HTMLElement & {
    _openCreate(idx: number, day: number, startMin?: number): void;
    updateComplete: Promise<unknown>;
  };
  const persons = [{ name: "Mia", calendar: "calendar.mia" }];

  async function openDialog(now = "2026-09-11T10:20:00", day = 4) {
    const m = await mount(
      { persons, view: "day", views: ["day"], start_hour: 7, end_hour: 20 },
      { calendars: { "calendar.mia": [] }, writable: ["calendar.mia"], now },
    );
    const el = m.el as unknown as Card;
    el._openCreate(0, day, 16 * 60);
    await el.updateComplete;
    const q = <T extends Element>(sel: string) => m.root.querySelector(sel) as T;
    return { ...m, el, q };
  }

  it("saves a weekly series with its last day", async () => {
    const { el, q, wsCalls } = await openDialog();
    const select = q<HTMLSelectElement>(".dialog select");
    select.value = "WEEKLY";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    const until = q<HTMLInputElement>('.dialog input[type="date"]');
    until.value = "2026-12-18";
    until.dispatchEvent(new Event("input"));
    q<HTMLInputElement>(".dialog input[type=text]").value = "Fußball";
    q<HTMLInputElement>(".dialog input[type=text]").dispatchEvent(new Event("input"));
    await el.updateComplete;
    q<HTMLButtonElement>(".dialog button.primary").click();
    await vi.advanceTimersByTimeAsync(0);
    const create = wsCalls.find((c) => c.type === "calendar/event/create") as {
      event: Record<string, string>;
    };
    // 18 Dec, end of the day in Berlin (CET) = 22:59:59 UTC
    expect(create.event.rrule).toBe("FREQ=WEEKLY;UNTIL=20261218T225959Z");
    expect(create.event.summary).toBe("Fußball");
  });

  it("creates a single event when repeat stays on never", async () => {
    const { el, q, wsCalls } = await openDialog();
    q<HTMLButtonElement>(".dialog button.primary").click();
    await vi.advanceTimersByTimeAsync(0);
    await el.updateComplete;
    const create = wsCalls.find((c) => c.type === "calendar/event/create") as {
      event: Record<string, string>;
    };
    expect(create.event.rrule).toBeUndefined();
  });

  it("refuses a series that would end before it starts", async () => {
    const { el, q, wsCalls, text } = await openDialog();
    const select = q<HTMLSelectElement>(".dialog select");
    select.value = "DAILY";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    const until = q<HTMLInputElement>('.dialog input[type="date"]');
    until.value = "2026-09-01";
    until.dispatchEvent(new Event("input"));
    await el.updateComplete;
    q<HTMLButtonElement>(".dialog button.primary").click();
    await el.updateComplete;
    expect(wsCalls.some((c) => c.type === "calendar/event/create")).toBe(false);
    expect(text()).toContain("Die Serie kann nicht vor ihrem Beginn enden.");
  });

  it("proposes the clicked wall-clock time even on the day the clocks go back", async () => {
    // Sunday 25 Oct 2026: 25 hours long; the 16:00 slot must stay 16:00
    const { q } = await openDialog("2026-10-25T10:00:00", 6);
    const start = q<HTMLInputElement>('.dialog input[type="datetime-local"]');
    expect(start.value).toBe("2026-10-25T16:00");
  });
});

describe("swipe to page", () => {
  type Card = HTMLElement & {
    _day: number;
    _weekOffset: number;
    _monthOffset: number;
    updateComplete: Promise<unknown>;
  };
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = { "calendar.anna": [ev("Büro", "09:00", "17:00")] };

  /**
   * A touch gesture from (x0, y0) to (x1, y1) on the given element; `between`
   * runs while the finger is down (e.g. the browser scrolling something).
   */
  function swipe(
    target: Element,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    between?: () => void,
  ) {
    const touch = (type: string, x: number, y: number, down: boolean) => {
      const ev = new Event(type, { bubbles: true, composed: true });
      const point = { clientX: x, clientY: y };
      Object.defineProperty(ev, "touches", { value: down ? [point] : [] });
      Object.defineProperty(ev, "changedTouches", { value: [point] });
      target.dispatchEvent(ev);
    };
    touch("touchstart", x0, y0, true);
    between?.();
    touch("touchend", x1, y1, false);
  }

  async function board(extra: Partial<FamilyBoardConfig> = {}) {
    const m = await mount(
      {
        persons,
        view: "day",
        views: ["day", "week", "month"],
        start_hour: 7,
        end_hour: 20,
        swipe: true,
        ...extra,
      },
      { calendars },
    );
    return { ...m, el: m.el as unknown as Card };
  }

  it("pages to the next and previous day in the day view", async () => {
    const { el, root } = await board();
    expect(el._day).toBe(4); // Friday 11 Sep
    swipe(root.querySelector(".col") as Element, 300, 200, 150, 210);
    expect(el._day).toBe(5);
    swipe(root.querySelector(".col") as Element, 150, 200, 300, 190);
    expect(el._day).toBe(4);
  });

  it("skips hidden weekend days into the next week", async () => {
    const { el, root } = await board({ show_weekends: false });
    swipe(root.querySelector(".col") as Element, 300, 200, 150, 200);
    expect([el._weekOffset, el._day]).toEqual([1, 0]); // Monday of next week
  });

  it("pages weeks in the week view and months in the month view", async () => {
    const { el, root } = await board({ view: "week" });
    swipe(root.querySelector(".wcell") as Element, 150, 200, 300, 200);
    expect(el._weekOffset).toBe(-1);
    const m = await board({ view: "month" });
    swipe(m.root.querySelector(".monthgrid") as Element, 300, 200, 100, 200);
    expect(m.el._monthOffset).toBe(1);
  });

  it("does nothing when switched off, for scrolls, taps or a drag on an event", async () => {
    const off = await board({ swipe: false });
    swipe(off.root.querySelector(".col") as Element, 300, 200, 150, 200);
    expect(off.el._day).toBe(4);

    const { el, root } = await board();
    const col = root.querySelector(".col") as Element;
    swipe(col, 300, 200, 200, 500); // 100 px sideways, 300 down: a scroll
    swipe(col, 300, 200, 270, 200); // too short: a tap
    const scroller = root.querySelector(".board") as HTMLElement;
    swipe(col, 300, 200, 100, 200, () => (scroller.scrollLeft = 120)); // the browser scrolled
    expect(el._day).toBe(4);
  });

  it("leaves dragging an event alone, but pages over events that only open on tap", async () => {
    // read-only calendar: the event only opens on tap, so a swipe over it pages
    const ro = await board();
    swipe(ro.root.querySelector(".event, .band") as Element, 300, 200, 100, 200);
    expect(ro.el._day).toBe(5);
    // writable calendar: the event is draggable, the gesture belongs to it
    const m = await mount(
      { persons, view: "day", views: ["day"], start_hour: 7, end_hour: 20, swipe: true },
      {
        calendars: { "calendar.anna": [ev("Arzt", "10:00", "11:00")] },
        writable: ["calendar.anna"],
      },
    );
    const el = m.el as unknown as Card;
    swipe(m.root.querySelector(".event.draggable") as Element, 300, 200, 100, 200);
    expect(el._day).toBe(4);
  });
});

describe("rolling week (first_day: today)", () => {
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = {
    "calendar.anna": [
      ev("Büro", "09:00", "17:00"),
      {
        uid: "mo",
        summary: "Zahnarzt",
        start: { dateTime: "2026-09-14T10:00:00" },
        end: { dateTime: "2026-09-14T11:00:00" },
      },
    ],
  };
  const name = (n: Element) => (n.textContent ?? "").replace(/\s+/g, " ").trim();

  it("starts the week view today and reaches into next week", async () => {
    const { all, text, apiPaths } = await mount(
      { persons, view: "week", views: ["week"], first_day: "today" },
      { calendars },
    );
    expect(name(all(".wday")[0])).toMatch(/^Freitag, 11\. September/);
    expect(name(all(".wday")[6])).toMatch(/^Donnerstag, 17\. September/);
    // Monday the 14th belongs to next calendar week, but is in the rolling one
    expect(text()).toContain("Zahnarzt");
    const q = new URLSearchParams(apiPaths[0].split("?")[1]);
    expect(new Date(q.get("start") as string).getDate()).toBe(11);
    expect(new Date(q.get("end") as string).getDate()).toBe(18);
  });

  it("puts today first in the day tabs", async () => {
    const { texts } = await mount(
      { persons, view: "day", views: ["day"], first_day: "today", start_hour: 7, end_hour: 20 },
      { calendars },
    );
    expect(texts(".tabs [role=tab]")).toEqual(["Fr", "Sa", "So", "Mo", "Di", "Mi", "Do"]);
    expect(texts(".tabs [aria-selected=true]")).toEqual(["Fr"]);
  });

  it("keeps the month grid on Monday columns", async () => {
    const { texts } = await mount(
      { persons, view: "month", views: ["month"], first_day: "today" },
      { calendars },
    );
    expect(texts(".mhcell")[0]).toBe("Mo");
  });
});

describe("countdowns (now view)", () => {
  const at = (summary: string, day: string, extra: Record<string, unknown> = {}) => ({
    uid: `${summary}-${day}`,
    summary,
    start: { date: day },
    end: { date: day },
    ...extra,
  });
  const calendars = {
    "calendar.anna": [
      ev("Büro", "09:00", "17:00"),
      at("Urlaub Ostsee", "2026-09-23"),
      at("Urlaub Harz", "2026-09-01"), // already over
      at("Zahnarzt", "2026-09-15"), // no keyword
      at("Urlaub geheim", "2026-09-20"), // hidden by hide_patterns
    ],
    "calendar.familie": [at("Geburtstag Oma", "2026-09-12")],
  };
  const base = {
    persons: [{ name: "Anna", calendar: "calendar.anna" }],
    family_calendars: ["calendar.familie"],
    countdowns: ["urlaub", "geburtstag"],
    hide_patterns: ["geheim"],
  };

  it("shows coming matching events with the days left, soonest first", async () => {
    const { texts } = await mount({ ...base, view: "now", views: ["now"] }, { calendars });
    expect(texts(".cdchip")).toEqual(["🎂Geburtstag Oma morgen", "🏖️Urlaub Ostsee in 12 Tagen"]);
  });

  it("looks ahead countdown_days with a request of its own", async () => {
    const { apiPaths } = await mount(
      { ...base, view: "now", views: ["now"], countdown_days: 30 },
      { calendars },
    );
    const long = apiPaths
      .map((p) => new URLSearchParams(p.split("?")[1]))
      .filter((q) => new Date(q.get("end") as string).getMonth() === 9); // reaches October
    expect(long.length).toBeGreaterThan(0);
    expect(new Date(long[0].get("end") as string).getDate()).toBe(12); // 11 Sep + 31 days
  });

  it("costs nothing outside the now view or without keywords", async () => {
    const day = await mount(
      { ...base, view: "day", views: ["day", "now"], start_hour: 7, end_hour: 20 },
      { calendars },
    );
    expect(day.root.querySelector(".cdchip")).toBeNull();
    const plain = await mount(
      { persons: base.persons, view: "now", views: ["now"] },
      { calendars },
    );
    expect(plain.root.querySelector(".cdband")).toBeNull();
    expect(day.apiPaths.concat(plain.apiPaths).every((p) => !p.includes("2026-10"))).toBe(true);
  });
});

describe("night screen", () => {
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = {
    "calendar.anna": [
      {
        uid: "fr",
        summary: "Frühdienst",
        start: { dateTime: "2026-09-14T06:00:00" }, // Monday: next week
        end: { dateTime: "2026-09-14T14:00:00" },
      },
    ],
  };
  const base = {
    persons,
    view: "day" as const,
    views: ["day" as const, "week" as const],
    start_hour: 7,
    end_hour: 20,
    night_start: "21:00",
    night_end: "06:30",
  };

  it("shows the calm night screen in the night hours, whatever the view", async () => {
    // Sunday night in the day view: the week ends at midnight, the night screen
    // still has to find Monday's early shift
    const { el, root, text, apiPaths } = await mount(base, {
      calendars,
      now: "2026-09-13T23:00:00",
    });
    // asked from today on, past the end of the week
    const q = new URLSearchParams(apiPaths[apiPaths.length - 1].split("?")[1]);
    expect(new Date(q.get("start") as string).getDate()).toBe(13);
    expect(new Date(q.get("end") as string).getDate()).toBe(21);
    expect(el.hasAttribute("night")).toBe(true);
    expect(root.querySelector(".nightcard .now")).not.toBeNull();
    expect(root.querySelector(".switch")).toBeNull();
    // what comes first tomorrow
    expect(text()).toContain("Frühdienst");
    expect(text()).toContain("Morgen 06:00");
  });

  it("also after midnight, and not during the day", async () => {
    const late = await mount(base, { calendars, now: "2026-09-12T02:00:00" });
    expect(late.el.hasAttribute("night")).toBe(true);
    const day = await mount(base, { calendars, now: "2026-09-11T10:20:00" });
    expect(day.el.hasAttribute("night")).toBe(false);
    expect(day.root.querySelector(".switch")).not.toBeNull();
  });

  it("wakes on a touch and falls asleep again after a while", async () => {
    const { el, root } = await mount(base, { calendars, now: "2026-09-11T23:00:00" });
    const card = el as unknown as { updateComplete: Promise<unknown> };
    el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await card.updateComplete;
    expect(el.hasAttribute("night")).toBe(false);
    expect(root.querySelector(".board")).not.toBeNull();
    await vi.advanceTimersByTimeAsync(3 * 60000); // the minute tick re-checks
    await card.updateComplete;
    expect(el.hasAttribute("night")).toBe(true);
  });

  it("wakes while a motion sensor reports movement, and sleeps again after it stops", async () => {
    const { el } = await mount(
      { ...base, night_wake_entity: "binary_sensor.flur" },
      { calendars, now: "2026-09-11T23:00:00", states: { "binary_sensor.flur": "off" } },
    );
    const card = el as unknown as {
      hass: { states: Record<string, { state: string }> };
      updateComplete: Promise<unknown>;
    };
    const motion = async (state: string) => {
      card.hass = {
        ...card.hass,
        states: { ...card.hass.states, "binary_sensor.flur": { state } },
      };
      await card.updateComplete;
    };
    expect(el.hasAttribute("night")).toBe(true);
    await motion("on");
    expect(el.hasAttribute("night")).toBe(false);
    await vi.advanceTimersByTimeAsync(5 * 60000); // still moving: stays awake
    await card.updateComplete;
    expect(el.hasAttribute("night")).toBe(false);
    await motion("off");
    expect(el.hasAttribute("night")).toBe(false); // a short while longer, like a touch
    await vi.advanceTimersByTimeAsync(3 * 60000);
    await card.updateComplete;
    expect(el.hasAttribute("night")).toBe(true);
  });

  it("ignores motion during the day", async () => {
    const { el, root } = await mount(
      { ...base, night_wake_entity: ["binary_sensor.flur"] },
      { calendars, now: "2026-09-11T10:20:00", states: { "binary_sensor.flur": "on" } },
    );
    expect(el.hasAttribute("night")).toBe(false);
    expect(root.querySelector(".switch")).not.toBeNull();
  });

  it("stays off without both times", async () => {
    const { el } = await mount(
      { ...base, night_end: undefined },
      { calendars, now: "2026-09-11T23:00:00" },
    );
    expect(el.hasAttribute("night")).toBe(false);
  });
});

describe("live updates and instant display", () => {
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = { "calendar.anna": [ev("Büro", "09:00", "17:00")] };
  const base = { persons, view: "agenda" as const, views: ["agenda" as const] };

  it("subscribes to the shown range and takes pushed changes at once", async () => {
    const { subs, text, el } = await mount(base, { calendars, live: "new" });
    expect(subs).toHaveLength(1);
    expect(subs[0].msg).toMatchObject({
      type: "calendar/event/subscribe",
      entity_id: "calendar.anna",
    });
    expect(new Date(subs[0].msg.start as string).getDate()).toBe(7); // Monday of the week
    // someone adds an appointment on the phone; HA pushes the new list
    subs[0].push([
      {
        summary: "Büro",
        start: "2026-09-11T09:00:00+02:00",
        end: "2026-09-11T17:00:00+02:00",
        all_day: false,
      },
      {
        summary: "Zahnarzt",
        start: "2026-09-11T15:00:00+02:00",
        end: "2026-09-11T16:00:00+02:00",
        all_day: false,
      },
    ]);
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(text()).toContain("Zahnarzt");
    expect(text()).toContain("15:00");
  });

  it("keeps the board when a push says the calendar could not be read", async () => {
    const { subs, text, el } = await mount(base, { calendars, live: "new" });
    subs[0].push(null);
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(text()).toContain("Büro");
  });

  it("works as before on a Home Assistant without live updates", async () => {
    const { text, subs } = await mount(base, { calendars, live: "old" });
    expect(subs).toHaveLength(0);
    expect(text()).toContain("Büro");
  });

  it("unsubscribes when the board leaves the screen, and when the range changes", async () => {
    const { subs, el, root } = await mount(base, { calendars, live: "new" });
    (root.querySelectorAll("button.nav")[1] as HTMLButtonElement).click(); // next week
    for (let i = 0; i < 4; i++) {
      await vi.advanceTimersByTimeAsync(0);
      await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    }
    expect(subs[0].unsubscribed).toBe(true);
    expect(subs).toHaveLength(2);
    el.remove();
    expect(subs[1].unsubscribed).toBe(true);
  });

  it("shows the last known events at once while the fresh answer is on its way", async () => {
    await mount(base, { calendars }); // a first visit fills the cache
    mounted.splice(0).forEach((n) => n.remove());
    const { text } = await mount(base, { calendars, slowApi: true });
    expect(text()).toContain("Büro");
  });

  it("keeps a cache per board, so two boards on one dashboard both start instantly", async () => {
    const ben = { ...base, persons: [{ name: "Ben", calendar: "calendar.ben" }] };
    const both = { ...calendars, "calendar.ben": [ev("Training", "18:00", "19:30")] };
    await mount(base, { calendars: both });
    await mount(ben, { calendars: both });
    mounted.splice(0).forEach((n) => n.remove());
    const { text } = await mount(base, { calendars: both, slowApi: true });
    expect(text()).toContain("Büro");
  });

  it("does not show cached events of another board", async () => {
    await mount(base, { calendars });
    mounted.splice(0).forEach((n) => n.remove());
    const other = { ...base, persons: [{ name: "Ben", calendar: "calendar.ben" }] };
    const { text } = await mount(other, { calendars: { "calendar.ben": [] }, slowApi: true });
    expect(text()).not.toContain("Büro");
  });
});

describe("still at home (late_warning)", () => {
  const persons = [
    { name: "Anna", person: "person.anna", calendar: "calendar.anna" },
    { name: "Ben", person: "person.ben", calendar: "calendar.ben" },
  ];
  const calendars = {
    "calendar.anna": [ev("Zahnarzt", "10:30", "11:00", { location: "Praxis Dr. Meier" })],
    "calendar.ben": [ev("Training", "10:35", "12:00", { location: "Sporthalle" })],
  };
  const states = { "person.anna": "home", "person.ben": "not_home" };
  const base = {
    persons,
    late_warning: 20,
    start_hour: 7,
    end_hour: 20,
  };

  it("warns in the day view for whoever is still home", async () => {
    const { texts } = await mount({ ...base, view: "day", views: ["day"] }, { calendars, states });
    expect(texts(".alert.a-late")).toEqual(["🚪 Anna noch zuhause – Zahnarzt 10:30"]);
  });

  it("puts the warning into the person's row in the now view", async () => {
    const { texts } = await mount({ ...base, view: "now", views: ["now"] }, { calendars, states });
    expect(texts(".nrow .nlate")).toEqual(["🚪 Zahnarzt 10:30 · noch zuhause"]);
  });

  it("shows nothing without the option, or on another day", async () => {
    const off = await mount(
      { ...base, late_warning: 0, view: "day", views: ["day"] },
      { calendars, states },
    );
    expect(off.root.querySelector(".a-late")).toBeNull();
    const { el, root } = await mount(
      { ...base, view: "day", views: ["day"] },
      { calendars, states },
    );
    const card = el as unknown as { _day: number; updateComplete: Promise<unknown> };
    card._day = 5; // Saturday
    await card.updateComplete;
    expect(root.querySelector(".a-late")).toBeNull();
  });
});

describe("rides (driver)", () => {
  const persons = [
    { name: "Anna", calendar: "calendar.anna", driver: true },
    { name: "Ben", calendar: "calendar.ben", driver: true },
    { name: "Mia", calendar: "calendar.mia" },
  ];
  const calendars = {
    "calendar.anna": [ev("Büro", "09:00", "17:00")],
    "calendar.ben": [ev("Homeoffice", "08:00", "12:00")],
    "calendar.mia": [
      ev("Anna: vom Sport abholen", "16:00", "16:30"),
      ev("Zum Training bringen", "17:00", "17:30"),
      ev("Ben: Musikschule abholen", "18:00", "18:30"),
    ],
  };
  const base = { persons, start_hour: 7, end_hour: 20 };

  it("tags rides with their driver, and warns about missing or busy drivers", async () => {
    const { texts, root } = await mount({ ...base, view: "day", views: ["day"] }, { calendars });
    expect(texts(".eride")).toEqual(["🚗 Anna", "🚗 ?", "🚗 Ben"]);
    expect(root.querySelector(".eride.none")?.textContent).toBe("🚗 ?");
    expect(texts(".alert.a-ride")).toEqual([
      "🚗 Anna ist belegt – Anna: vom Sport abholen 16:00",
      "🚗 Mia Zum Training bringen – kein Fahrer 17:00",
    ]);
    const label = root.querySelector(".event[aria-label*='Training']")?.getAttribute("aria-label");
    expect(label).toContain("kein Fahrer");
  });

  it("shows the driver in the agenda", async () => {
    const { texts } = await mount({ ...base, view: "agenda", views: ["agenda"] }, { calendars });
    expect(texts(".agenda-meta .eride")).toEqual(["🚗 Anna", "🚗 ?", "🚗 Ben"]);
  });

  it("does nothing while nobody is marked as a driver", async () => {
    const plain = persons.map(({ driver: _d, ...p }) => p);
    const { root } = await mount(
      { ...base, persons: plain, view: "day", views: ["day"] },
      { calendars },
    );
    expect(root.querySelector(".eride")).toBeNull();
    expect(root.querySelector(".a-ride")).toBeNull();
  });
});

describe("private events", () => {
  const persons = [
    { name: "Anna", calendar: "calendar.anna" },
    { name: "Ben", calendar: "calendar.ben" },
  ];
  const calendars = {
    "calendar.anna": [
      ev("Therapie", "10:00", "11:00", { location: "Praxis Dr. Meier", description: "#privat" }),
      ev("Büro", "12:00", "17:00"),
    ],
    "calendar.ben": [ev("Bewerbungsgespräch", "14:00", "15:00", { location: "Firma X" })],
  };
  const base = {
    persons,
    private_patterns: ["#privat"],
    calendars: { "calendar.ben": { private: true } },
    start_hour: 7,
    end_hour: 20,
  };

  it("shows only “Private” and the time, never title or place", async () => {
    const { text, texts } = await mount(
      { ...base, view: "agenda", views: ["agenda"] },
      { calendars },
    );
    expect(text()).not.toContain("Therapie");
    expect(text()).not.toContain("Praxis");
    expect(text()).not.toContain("Bewerbung");
    expect(text()).not.toContain("Firma X");
    expect(texts(".agenda-title")).toEqual(["🔒 Privat", "Büro", "🔒 Privat"]);
    expect(text()).toContain("10:00–11:00");
  });

  it("opens no dialog and cannot be dragged", async () => {
    const { root, el } = await mount(
      { ...base, view: "day", views: ["day"] },
      { calendars, writable: ["calendar.anna"] },
    );
    const priv = root.querySelector<HTMLElement>(".event[aria-label^='🔒']")!;
    expect(priv.classList.contains("draggable")).toBe(false);
    priv.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(root.querySelector(".dialog")).toBeNull();
    root.querySelector<HTMLElement>("[aria-label*='Büro']")!.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(root.querySelector(".dialog")).not.toBeNull();
  });

  it("keeps the details out of the browser cache, and stays private when started from it", async () => {
    await mount({ ...base, view: "agenda", views: ["agenda"] }, { calendars });
    const stored = Object.keys(localStorage)
      .map((k) => localStorage.getItem(k))
      .join(" ");
    expect(stored).toContain("Büro");
    expect(stored).not.toContain("Therapie");
    expect(stored).not.toContain("Praxis");
    expect(stored).not.toContain("Bewerbung");
    mounted.splice(0).forEach((n) => n.remove());
    const { texts } = await mount(
      { ...base, view: "agenda", views: ["agenda"] },
      { calendars, slowApi: true },
    );
    expect(texts(".agenda-title")).toEqual(["🔒 Privat", "Büro", "🔒 Privat"]);
  });
});

describe("photo screensaver", () => {
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = { "calendar.anna": [ev("Zahnarzt", "10:30", "11:00")] };
  const folder = "media-source://media_source/local/fotos";
  const media = [
    { media_content_id: `${folder}/a.jpg`, media_class: "image" },
    { media_content_id: `${folder}/b.jpg`, media_class: "image" },
    { media_content_id: `${folder}/clip.mp4`, media_class: "video" },
    { media_content_id: `${folder}/urlaub`, media_class: "directory" },
  ];
  const base = {
    persons,
    view: "day" as const,
    views: ["day" as const],
    screensaver_media: folder,
    screensaver_after: 5,
    screensaver_interval: 10,
    start_hour: 7,
    end_hour: 20,
  };
  type Card = { updateComplete: Promise<unknown> };
  const settle = async (el: HTMLElement) => {
    for (let i = 0; i < 4; i++) {
      await vi.advanceTimersByTimeAsync(0);
      await (el as unknown as Card).updateComplete;
    }
  };

  it("starts after the idle time, shows photos with a clock, and moves on", async () => {
    const { el, root, wsCalls } = await mount(base, { calendars, media });
    expect(wsCalls.find((m) => m.type === "media_source/browse_media")).toMatchObject({
      media_content_id: folder,
    });
    expect(root.querySelector(".saver")).toBeNull();
    await vi.advanceTimersByTimeAsync(4 * 60000);
    await settle(el);
    expect(root.querySelector(".saver")).toBeNull(); // not yet
    await vi.advanceTimersByTimeAsync(60000);
    await settle(el);
    expect(root.querySelector(".saver")).not.toBeNull();
    expect(root.querySelector(".board")).toBeNull();
    expect(root.querySelector(".savertime")?.textContent).toBe("10:25");
    const first = root.querySelector<HTMLImageElement>(".saverimg")?.getAttribute("src");
    expect(first).toMatch(/^\/media\/local\/[ab]\.jpg\?authSig=x$/);
    await vi.advanceTimersByTimeAsync(10000);
    await settle(el);
    const second = root.querySelector<HTMLImageElement>(".saverimg")?.getAttribute("src");
    expect(second).not.toBe(first);
    // only photos are shown: two photos, so the third turn is the first again
    const resolved = wsCalls
      .filter((m) => m.type === "media_source/resolve_media")
      .map((m) => String(m.media_content_id).split("/").pop());
    expect(resolved.every((id) => id === "a.jpg" || id === "b.jpg")).toBe(true);
  });

  it("a tap brings the board back without opening what lies below", async () => {
    const { el, root } = await mount(base, { calendars, media });
    await vi.advanceTimersByTimeAsync(5 * 60000);
    await settle(el);
    const saver = root.querySelector<HTMLElement>(".saver")!;
    saver.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await settle(el);
    expect(root.querySelector(".saver")).toBeNull();
    // the click of that same tap lands on the board and must be swallowed
    root.querySelector<HTMLElement>("[aria-label*='Zahnarzt']")!.click();
    await settle(el);
    expect(root.querySelector(".dialog")).toBeNull();
    // the next tap works as usual
    root.querySelector<HTMLElement>("[aria-label*='Zahnarzt']")!.click();
    await settle(el);
    expect(root.querySelector(".dialog")).not.toBeNull();
  });

  it("can be ended with the keyboard", async () => {
    const { el, root } = await mount(base, { calendars, media });
    await vi.advanceTimersByTimeAsync(5 * 60000);
    await settle(el);
    root
      .querySelector<HTMLElement>(".saver")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await settle(el);
    expect(root.querySelector(".saver")).toBeNull();
  });

  it("stays away without photos, and gives way to the night screen", async () => {
    const empty = await mount(base, { calendars, media: [] });
    await vi.advanceTimersByTimeAsync(10 * 60000);
    await settle(empty.el);
    expect(empty.root.querySelector(".saver")).toBeNull();
    mounted.splice(0).forEach((n) => n.remove());
    const night = await mount(
      { ...base, night_start: "21:00", night_end: "06:30" },
      { calendars, media, now: "2026-09-11T23:00:00" },
    );
    await vi.advanceTimersByTimeAsync(10 * 60000);
    await settle(night.el);
    expect(night.root.querySelector(".saver")).toBeNull();
    expect(night.el.hasAttribute("night")).toBe(true);
    // and no photos are fetched behind the night screen
    expect(night.wsCalls.some((m) => m.type === "media_source/resolve_media")).toBe(false);
  });
});

describe("birthdays with age", () => {
  const persons = [{ name: "Anna", calendar: "calendar.anna" }];
  const calendars = {
    "calendar.anna": [
      {
        uid: "oma",
        summary: "Geburtstag Oma (1946)",
        start: { date: "2026-09-11" },
        end: { date: "2026-09-12" },
      },
      ev("Klassentreffen (1996)", "18:00", "22:00"),
    ],
  };
  const base = { persons, start_hour: 7, end_hour: 20 };

  it("shows the age in the agenda and the now view", async () => {
    const ag = await mount(
      { ...base, birthday_age: true, view: "agenda", views: ["agenda"] },
      { calendars },
    );
    expect(ag.texts(".agenda-title")).toEqual([
      "Geburtstag Oma (wird 80)",
      "Klassentreffen (1996)",
    ]);
    const now = await mount(
      { ...base, birthday_age: true, view: "now", views: ["now"] },
      { calendars },
    );
    expect(now.texts(".nallday")).toEqual(["Geburtstag Oma (wird 80)"]);
  });

  it("keeps the real title for editing", async () => {
    const { root, el } = await mount(
      { ...base, birthday_age: true, view: "agenda", views: ["agenda"] },
      { calendars, writable: ["calendar.anna"] },
    );
    root.querySelector<HTMLElement>(".agenda-row")!.click();
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    expect(root.querySelector<HTMLInputElement>(".dialog input[type=text]")?.value).toBe(
      "Geburtstag Oma (1946)",
    );
  });

  it("changes nothing while the option is off", async () => {
    const { texts } = await mount({ ...base, view: "agenda", views: ["agenda"] }, { calendars });
    expect(texts(".agenda-title")[0]).toBe("Geburtstag Oma (1946)");
  });
});
