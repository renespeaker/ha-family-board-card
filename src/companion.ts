/* ------------------------------------------------------------------ */
/*  The board and the Home Assistant companion app. Pure helpers: who */
/*  a wall message is from, what a push looks like, where someone     */
/*  really was today and how far away they are. The card only talks  */
/*  to Home Assistant – notify services and entities – never to the   */
/*  app itself.                                                        */
/* ------------------------------------------------------------------ */

/** Action ids start with this, so the shipped automation knows which taps are ours. */
export const ACTION_PREFIX = "FAMILY_BOARD";

/** "notify.mobile_app_ben" or "mobile_app_ben" -> "mobile_app_ben"; anything odd -> undefined. */
export function notifyService(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const name = raw.trim().replace(/^notify\./, "");
  return /^[a-z0-9_]+$/.test(name) ? name : undefined;
}

/**
 * The phone of a person, found through the person's device trackers:
 * `device_tracker.bens_pixel` belongs to `notify.mobile_app_bens_pixel` when
 * that service exists.
 */
export function guessNotify(
  trackers: unknown,
  services: Record<string, unknown>,
): string | undefined {
  if (!Array.isArray(trackers)) return undefined;
  for (const t of trackers) {
    const id = typeof t === "string" ? t.split(".")[1] : undefined;
    if (id && `mobile_app_${id}` in services) return `mobile_app_${id}`;
  }
  return undefined;
}

export interface WallMessage {
  text: string;
  /** Who wrote it, when "Name: text" names a person on the board. */
  personIdx?: number;
  name?: string;
}

/** "Ben: 18:30, traffic" -> from Ben; a message without a known name is just text. */
export function parseMessage(raw: unknown, names: string[]): WallMessage | undefined {
  if (typeof raw !== "string") return undefined;
  const text = raw.trim();
  if (!text || text === "unknown" || text === "unavailable") return undefined;
  const m = /^([^:]{1,40}):\s*(.+)$/s.exec(text);
  if (m) {
    const who = m[1].trim().toLocaleLowerCase();
    const idx = names.findIndex((n) => n && n.trim().toLocaleLowerCase() === who);
    if (idx >= 0) return { text: m[2].trim(), personIdx: idx, name: names[idx] };
  }
  return { text };
}

export interface PingTopic {
  icon: string;
  text: string;
  /** Ask for an answer: a text field and quick replies in the notification. */
  ask?: boolean;
}

/** "🛒 Bitte Milch mitbringen" / "? Wann kommst du?" -> a topic; a leading "?" asks for an answer. */
export function parseTopic(raw: string): PingTopic | undefined {
  let text = String(raw ?? "").trim();
  if (!text) return undefined;
  let ask = false;
  if (text.startsWith("?")) {
    ask = true;
    text = text.slice(1).trim();
  }
  const m = /^(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)\s*(.*)$/u.exec(text);
  if (m && m[2]) return { icon: m[1], text: m[2], ask };
  return text ? { icon: "📣", text, ask } : undefined;
}

/**
 * The notify call for a ping. Answers come back through the shipped
 * automation as "Name: answer" in the message entity, so each action carries
 * the name of the person who answers.
 */
export function pingCall(
  topic: PingTopic,
  person: string,
  title: string,
  replies: { custom: string; quick: string[] },
): { title: string; message: string; data: Record<string, unknown> } {
  const data: Record<string, unknown> = { tag: "family-board-ping", group: "family-board" };
  if (topic.ask) {
    data.actions = [
      {
        action: `${ACTION_PREFIX}|${person}|`,
        title: replies.custom,
        behavior: "textInput",
      },
      ...replies.quick.map((q) => ({ action: `${ACTION_PREFIX}|${person}|${q}`, title: q })),
    ];
  }
  return { title, message: `${topic.icon} ${topic.text}`, data };
}

/** The push to the driver: a running countdown on Android, a plain reminder elsewhere. */
export function rideCall(
  key: string,
  title: string,
  message: string,
  start: Date,
): { title: string; message: string; data: Record<string, unknown> } {
  return {
    title,
    message,
    data: {
      tag: `family-board-ride-${key}`,
      group: "family-board",
      chronometer: true,
      when: Math.round(start.getTime() / 1000),
      notification_icon: "mdi:car",
      sticky: true,
    },
  };
}

/** Taking a ride notification away again. */
export function clearCall(key: string): { message: string; data: Record<string, unknown> } {
  return { message: "clear_notification", data: { tag: `family-board-ride-${key}` } };
}

export interface PresenceSpan {
  state: string;
  from: Date;
  to: Date;
}

/**
 * Where someone was between `from` and `now`, from the history of a
 * `person.*` entity (compressed states: `s` state, `lu` seconds). Unknown
 * stretches are left out; neighbours in the same place are joined.
 */
export function presenceSpans(
  history: Array<{ s?: string; state?: string; lu?: number; last_updated?: string }>,
  from: Date,
  now: Date,
): PresenceSpan[] {
  const points = history
    .map((h) => ({
      state: String(h.s ?? h.state ?? ""),
      at: h.lu !== undefined ? new Date(h.lu * 1000) : new Date(h.last_updated ?? NaN),
    }))
    .filter((p) => !isNaN(p.at.getTime()))
    .sort((a, b) => a.at.getTime() - b.at.getTime());
  const out: PresenceSpan[] = [];
  points.forEach((p, i) => {
    const start = p.at < from ? from : p.at;
    const end = i + 1 < points.length ? points[i + 1].at : now;
    if (end <= start || !p.state || p.state === "unknown" || p.state === "unavailable") return;
    const last = out[out.length - 1];
    if (last && last.state === p.state && last.to.getTime() === start.getTime()) last.to = end;
    else out.push({ state: p.state, from: start, to: end });
  });
  return out;
}

/** Minutes until someone is home, from a travel-time sensor; undefined when it says nothing useful. */
export function etaMinutes(state: unknown, unit?: unknown): number | undefined {
  const n = Number(state);
  if (!Number.isFinite(n) || n < 0) return undefined;
  const u = String(unit ?? "min").toLowerCase();
  if (u === "h") return Math.round(n * 60);
  if (u === "s") return Math.round(n / 60);
  return Math.round(n);
}
