/* ------------------------------------------------------------------ */
/*  Pure calendar-event logic (no DOM / no hass) — unit-testable.      */
/* ------------------------------------------------------------------ */

export const DAY_MS = 86400000;

/**
 * Compute new start/end for a drag (move) or resize gesture.
 * `deltaMin` is the raw dragged offset in minutes; the result snaps to the
 * `gridMin` raster (absolute, from midnight of the event's day) and keeps a
 * minimum duration of one grid step.
 */
export function dragTimes(
  origStart: Date,
  origEnd: Date,
  deltaMin: number,
  mode: "move" | "resize",
  gridMin: number,
): { start: Date; end: Date } {
  const grid = Math.max(1, gridMin);
  const midnight = new Date(origStart);
  midnight.setHours(0, 0, 0, 0);
  const base = midnight.getTime();
  const startMin = (origStart.getTime() - base) / 60000;
  const durMin = (origEnd.getTime() - origStart.getTime()) / 60000;
  if (mode === "move") {
    const snapped = Math.round((startMin + deltaMin) / grid) * grid;
    const start = new Date(base + snapped * 60000);
    return { start, end: new Date(start.getTime() + durMin * 60000) };
  }
  // resize: keep start, move the end; floor the duration at one grid step
  let newDur = Math.round((durMin + deltaMin) / grid) * grid;
  if (newDur < grid) newDur = grid;
  return { start: origStart, end: new Date(origStart.getTime() + newDur * 60000) };
}

/** A raw event as returned by HA, kept so we can edit/delete it. */
export interface RawEvent {
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  rrule?: string;
  summary: string;
  description?: string;
  location?: string;
  allDay: boolean;
  start: Date; // absolute start
  end: Date; // absolute end (exclusive)
  color: string;
  tentative?: boolean; // provisional event (dashed styling)
}

/** A per-day display segment derived from a RawEvent. */
export interface BoardEvent {
  ref: RawEvent;
  personIdx: number;
  day: number; // 0 = Monday, within the current week
  startMin: number; // minutes from midnight of `day`
  endMin: number; // minutes from midnight of `day` (1440 = end of day)
  title: string;
  location?: string;
  allDay: boolean;
  color: string;
  continuesBefore: boolean;
  continuesAfter: boolean;
  part?: number; // 1-based day index for multi-day events ("day 2 of 5")
  parts?: number; // total days of a multi-day event; unset when single-day
}

/** A timed segment with its side-by-side overlap placement. */
export interface LaidOutEvent extends BoardEvent {
  col: number; // 0-based column within an overlap cluster
  cols: number; // total columns in that cluster
  span: number; // how many columns this event may stretch across (>= 1)
  cluster: number; // id of the overlap cluster this event belongs to
}

/** Normalize a HA calendar API item into an absolute-time RawEvent. */
export function parseRawEvent(
  ev: any,
  personIdx: number,
  calendar: string,
  color: string,
): RawEvent | null {
  const allDay = !ev?.start?.dateTime;
  let start: Date;
  let end: Date;
  if (allDay) {
    // All-day: dates are timezone-naive; end is EXCLUSIVE.
    if (!ev?.start?.date) return null;
    start = new Date(`${ev.start.date}T00:00:00`);
    end = ev.end?.date ? new Date(`${ev.end.date}T00:00:00`) : new Date(start.getTime() + DAY_MS);
  } else {
    start = new Date(ev.start.dateTime);
    end = new Date(ev.end?.dateTime ?? ev.start.dateTime);
  }
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  if (end.getTime() <= start.getTime()) {
    end = new Date(start.getTime() + (allDay ? DAY_MS : 60000));
  }
  return {
    personIdx,
    calendar,
    uid: ev.uid,
    recurrence_id: ev.recurrence_id,
    rrule: ev.rrule,
    summary: ev.summary || "Termin",
    description: ev.description,
    location: ev.location,
    allDay,
    start,
    end,
    color,
    // Tentative is opt-in via `tentative_patterns` only. We deliberately do NOT
    // derive it from the calendar status: some feeds (e.g. school timetables)
    // mark every event TENTATIVE, which would make whole columns look faded.
    tentative: false,
  };
}

/** Split a RawEvent into per-day display segments within the visible week. */
export function splitIntoSegments(raw: RawEvent, monday: Date): BoardEvent[] {
  return splitAcrossDays(raw, monday, 7);
}

/**
 * Split a RawEvent into per-day segments across `numDays` days starting at
 * `gridStart`. `day` is the 0-based offset from `gridStart`. Used by the week
 * views (numDays = 7) and the month grid (numDays = weeks * 7).
 */
export function splitAcrossDays(raw: RawEvent, gridStart: Date, numDays: number): BoardEvent[] {
  const segs: BoardEvent[] = [];
  // "day X of Y" for events that span multiple calendar days
  const firstDay = new Date(raw.start);
  firstDay.setHours(0, 0, 0, 0);
  const totalParts = Math.max(1, Math.ceil((raw.end.getTime() - firstDay.getTime()) / DAY_MS));
  for (let d = 0; d < numDays; d++) {
    const dayStart = new Date(gridStart.getTime() + d * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);
    const segStartMs = Math.max(raw.start.getTime(), dayStart.getTime());
    const segEndMs = Math.min(raw.end.getTime(), dayEnd.getTime());
    if (segEndMs <= segStartMs) continue;
    const startMin = raw.allDay ? 0 : Math.round((segStartMs - dayStart.getTime()) / 60000);
    const endMin = raw.allDay ? 1440 : Math.round((segEndMs - dayStart.getTime()) / 60000);
    const part =
      totalParts > 1
        ? Math.round((dayStart.getTime() - firstDay.getTime()) / DAY_MS) + 1
        : undefined;
    segs.push({
      part,
      parts: totalParts > 1 ? totalParts : undefined,
      ref: raw,
      personIdx: raw.personIdx,
      day: d,
      startMin,
      endMin: Math.min(endMin, 1440),
      title: raw.summary,
      location: raw.location,
      allDay: raw.allDay,
      color: raw.color,
      continuesBefore: raw.start.getTime() < dayStart.getTime(),
      continuesAfter: raw.end.getTime() > dayEnd.getTime(),
    });
  }
  return segs;
}

/**
 * Assign side-by-side columns to overlapping timed events so they don't
 * stack on top of each other. Events in the same "overlap cluster" share
 * the same `cols` count; each gets its own `col` index.
 */
export function layoutDayColumns(events: BoardEvent[]): LaidOutEvent[] {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
  const result: LaidOutEvent[] = [];
  let cluster: LaidOutEvent[] = [];
  let clusterEnd = -1;
  let clusterId = 0;
  const colEnds: number[] = [];

  const flush = () => {
    if (cluster.length) {
      const cols = Math.max(...cluster.map((e) => e.col)) + 1;
      cluster.forEach((e) => {
        e.cols = cols;
        e.cluster = clusterId;
        // Stretch into free columns to the right until we hit a column used by
        // an event that overlaps in time (Google-Calendar-style expansion).
        let limit = cols;
        for (const o of cluster) {
          if (o !== e && o.col > e.col && o.startMin < e.endMin && o.endMin > e.startMin) {
            limit = Math.min(limit, o.col);
          }
        }
        e.span = Math.max(1, limit - e.col);
      });
      clusterId++;
    }
    cluster = [];
  };

  for (const ev of sorted) {
    if (cluster.length && ev.startMin >= clusterEnd) {
      flush();
      colEnds.length = 0;
    }
    let col = colEnds.findIndex((end) => end <= ev.startMin);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(ev.endMin);
    } else {
      colEnds[col] = ev.endMin;
    }
    const laid: LaidOutEvent = { ...ev, col, cols: 1, span: 1, cluster: clusterId };
    cluster.push(laid);
    result.push(laid);
    clusterEnd = cluster.length === 1 ? ev.endMin : Math.max(clusterEnd, ev.endMin);
  }
  flush();
  return result;
}

/** A problem worth flagging for one day of the board. */
export interface DayAlert {
  kind: "conflict" | "gap" | "empty";
  personIdx?: number; // unset for "empty" (nobody home), which spans everyone
  startMin: number;
  endMin: number;
  titles: string[];
}

/**
 * Find the three situations a family board should warn about on a given day:
 *
 * - `conflict` – one person has two events running at the same time
 * - `gap` – one person has an unsupervised window of at least `gapMin`
 *   minutes between two of their own events (the classic pick-up gap)
 * - `empty` – every person is out at the same time ("nobody home"); only
 *   reported for two or more people, since a single column says nothing
 *   about the household
 *
 * `segments` must already be limited to one day and to the persons that are
 * actually visible. When `nowMin` is given, windows that are already over are
 * dropped — a gap at 09:00 is noise at 15:00.
 */
export function detectDayAlerts(
  segments: BoardEvent[],
  opts: { persons: number[]; gapMin: number; nowMin?: number },
): DayAlert[] {
  const timed = segments.filter((e) => !e.allDay && e.endMin > e.startMin);
  const alerts: DayAlert[] = [];

  for (const personIdx of opts.persons) {
    const mine = timed
      .filter((e) => e.personIdx === personIdx)
      .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

    // conflicts: compare each event with the ones that started before it
    for (let i = 0; i < mine.length; i++) {
      for (let j = i + 1; j < mine.length; j++) {
        const a = mine[i];
        const b = mine[j];
        if (b.startMin >= a.endMin) break; // sorted: nothing later can overlap
        alerts.push({
          kind: "conflict",
          personIdx,
          startMin: Math.max(a.startMin, b.startMin),
          endMin: Math.min(a.endMin, b.endMin),
          titles: [a.title, b.title],
        });
      }
    }

    // gaps: walk the merged busy blocks and look at the holes between them
    if (opts.gapMin > 0) {
      let cursor = -1;
      let prevTitle = "";
      for (const e of mine) {
        if (cursor >= 0 && e.startMin - cursor >= opts.gapMin) {
          alerts.push({
            kind: "gap",
            personIdx,
            startMin: cursor,
            endMin: e.startMin,
            titles: [prevTitle, e.title],
          });
        }
        if (e.endMin > cursor) {
          cursor = e.endMin;
          prevTitle = e.title;
        }
      }
    }
  }

  // nobody home: sweep the timeline and keep the stretches where every person
  // has something running
  if (opts.persons.length > 1) {
    const bounds = new Set<number>();
    for (const e of timed) {
      bounds.add(e.startMin);
      bounds.add(e.endMin);
    }
    const marks = [...bounds].sort((a, b) => a - b);
    let open: DayAlert | null = null;
    for (let i = 0; i < marks.length - 1; i++) {
      const from = marks[i];
      const to = marks[i + 1];
      const busy = opts.persons.filter((p) =>
        timed.some((e) => e.personIdx === p && e.startMin <= from && e.endMin >= to),
      );
      if (busy.length === opts.persons.length) {
        if (open && open.endMin === from) open.endMin = to;
        else {
          open = { kind: "empty", startMin: from, endMin: to, titles: [] };
          alerts.push(open);
        }
      } else {
        open = null;
      }
    }
  }

  const now = opts.nowMin;
  return alerts
    .filter((a) => a.endMin > a.startMin && (now === undefined || a.endMin > now))
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);
}
