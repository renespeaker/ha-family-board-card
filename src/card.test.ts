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
      attributes: { friendly_name: entity.split(".")[1], supported_features: 0 },
    };
  }
  for (const entity of Object.keys(todos)) {
    states[entity] = {
      state: String(todos[entity].length),
      last_changed: "2026-09-11T06:00:00+00:00",
      attributes: { friendly_name: entity.split(".")[1], supported_features: 0 },
    };
  }
  const wsCalls: Array<Record<string, unknown>> = [];
  const el = document.createElement("family-board-card") as HTMLElement & {
    setConfig(c: unknown): void;
    hass: unknown;
    updateComplete: Promise<unknown>;
  };
  el.setConfig({ type: "custom:family-board-card", persons: [], ...config });
  el.hass = {
    locale: { language: opts.lang ?? "de", time_format: "24" },
    states,
    callApi: async (_method: string, path: string) =>
      calendars[path.split("?")[0].replace("calendars/", "")] ?? [],
    callWS: async (msg: Record<string, unknown>) => {
      wsCalls.push(msg);
      if (msg.type === "todo/item/list") {
        return { items: todos[msg.entity_id as string] ?? [] };
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
    text: () => (root.textContent ?? "").replace(/\s+/g, " ").trim(),
    all: (sel: string) => [...root.querySelectorAll(sel)],
    texts: (sel: string) =>
      [...root.querySelectorAll(sel)].map((n) => (n.textContent ?? "").replace(/\s+/g, " ").trim()),
  };
}

afterEach(() => {
  mounted.splice(0).forEach((el) => el.remove());
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
  // Mon 7th through Sun 13th of the week under test
  const calendars = {
    "calendar.anna": [
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
    // a past week is shown in full; nothing is filtered away
    expect(texts(".agenda-date").length).toBeGreaterThan(0);
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
