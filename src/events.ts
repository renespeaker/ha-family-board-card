/* ------------------------------------------------------------------ */
/*  Pure calendar-event logic (no DOM / no hass) — unit-testable.      */
/* ------------------------------------------------------------------ */

export const DAY_MS = 86400000;

/** A raw event as returned by HA, kept so we can edit/delete it. */
export interface RawEvent {
  personIdx: number;
  calendar: string;
  uid?: string;
  recurrence_id?: string;
  summary: string;
  description?: string;
  location?: string;
  allDay: boolean;
  start: Date; // absolute start
  end: Date; // absolute end (exclusive)
  color: string;
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
}

/** A timed segment with its side-by-side overlap placement. */
export interface LaidOutEvent extends BoardEvent {
  col: number; // 0-based column within an overlap cluster
  cols: number; // total columns in that cluster
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
    summary: ev.summary || "Termin",
    description: ev.description,
    location: ev.location,
    allDay,
    start,
    end,
    color,
  };
}

/** Split a RawEvent into per-day display segments within the visible week. */
export function splitIntoSegments(raw: RawEvent, monday: Date): BoardEvent[] {
  const segs: BoardEvent[] = [];
  for (let d = 0; d < 7; d++) {
    const dayStart = new Date(monday.getTime() + d * DAY_MS);
    const dayEnd = new Date(dayStart.getTime() + DAY_MS);
    const segStartMs = Math.max(raw.start.getTime(), dayStart.getTime());
    const segEndMs = Math.min(raw.end.getTime(), dayEnd.getTime());
    if (segEndMs <= segStartMs) continue;
    const startMin = raw.allDay ? 0 : Math.round((segStartMs - dayStart.getTime()) / 60000);
    const endMin = raw.allDay ? 1440 : Math.round((segEndMs - dayStart.getTime()) / 60000);
    segs.push({
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
  const colEnds: number[] = [];

  const flush = () => {
    if (cluster.length) {
      const cols = Math.max(...cluster.map((e) => e.col)) + 1;
      cluster.forEach((e) => (e.cols = cols));
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
    const laid: LaidOutEvent = { ...ev, col, cols: 1 };
    cluster.push(laid);
    result.push(laid);
    clusterEnd = cluster.length === 1 ? ev.endMin : Math.max(clusterEnd, ev.endMin);
  }
  flush();
  return result;
}
