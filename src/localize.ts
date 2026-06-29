/* ------------------------------------------------------------------ */
/*  Lightweight i18n. Static UI strings ship as EN/DE; dates, times    */
/*  and weekday names are derived from the HA locale via Intl.         */
/* ------------------------------------------------------------------ */

type Dict = Record<string, string>;

const EN: Dict = {
  board_title: "Family board",
  day: "Day",
  week: "Week",
  agenda: "Agenda",
  all_day: "all-day",
  this_week: "This week",
  prev_week: "Previous week",
  next_week: "Next week",
  today: "Today",
  status_home: "home",
  status_away: "away",
  add_event: "Add event",
  new_event: "New event",
  event: "Event",
  edit_event: "Edit event",
  close: "Close",
  field_title: "Title",
  field_all_day: "All-day",
  field_start: "Start",
  field_end: "End",
  field_location: "Location",
  field_note: "Note",
  field_calendar: "Calendar",
  recurring: "Recurring event",
  recur_this: "This event only",
  recur_future: "This and following",
  read_only: "This calendar is read-only.",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  err_invalid: "Please enter valid times.",
  err_end_before: "End is before start.",
  err_end_equal: "End must be after start.",
  save_failed: "Saving failed.",
  delete_failed: "Deleting failed.",
  default_title: "Event",
  load_error: "Calendar could not be loaded.",
  no_events: "No events.",
};

const DE: Dict = {
  board_title: "Familienplan",
  day: "Tag",
  week: "Woche",
  agenda: "Agenda",
  all_day: "ganztägig",
  this_week: "Diese Woche",
  prev_week: "Vorherige Woche",
  next_week: "Nächste Woche",
  today: "Heute",
  status_home: "zuhause",
  status_away: "unterwegs",
  add_event: "Termin hinzufügen",
  new_event: "Neuer Termin",
  event: "Termin",
  edit_event: "Termin bearbeiten",
  close: "Schließen",
  field_title: "Titel",
  field_all_day: "Ganztägig",
  field_start: "Start",
  field_end: "Ende",
  field_location: "Ort",
  field_note: "Notiz",
  field_calendar: "Kalender",
  recurring: "Wiederkehrender Termin",
  recur_this: "Nur dieser Termin",
  recur_future: "Dieser und folgende",
  read_only: "Dieser Kalender ist schreibgeschützt.",
  delete: "Löschen",
  cancel: "Abbrechen",
  save: "Speichern",
  err_invalid: "Bitte gültige Zeiten angeben.",
  err_end_before: "Ende liegt vor dem Start.",
  err_end_equal: "Ende muss nach dem Start liegen.",
  save_failed: "Speichern fehlgeschlagen.",
  delete_failed: "Löschen fehlgeschlagen.",
  default_title: "Termin",
  load_error: "Kalender konnte nicht geladen werden.",
  no_events: "Keine Termine.",
};

const TABLE: Record<string, Dict> = { en: EN, de: DE };

/** Two-letter language from a HA-style locale object. */
export function langOf(hass: any): string {
  const l = (hass?.locale?.language || navigator?.language || "en").toLowerCase();
  return l.split("-")[0];
}

export function localize(hass: any, key: string): string {
  const lang = langOf(hass);
  return TABLE[lang]?.[key] ?? EN[key] ?? key;
}

/** BCP-47 tag for Intl, preferring the full HA locale language. */
function intlLocale(hass: any): string {
  return hass?.locale?.language || navigator?.language || "en";
}

/** Whether to use 12-hour clock, based on the HA time_format preference. */
function use12h(hass: any): boolean {
  const tf = hass?.locale?.time_format;
  if (tf === "12") return true;
  if (tf === "24") return false;
  // "language"/"system"/undefined -> let Intl decide from the locale
  const probe = new Intl.DateTimeFormat(intlLocale(hass), { hour: "numeric" }).format(
    new Date(2020, 0, 1, 13),
  );
  return /\s?[AaPp]\.?[Mm]\.?/.test(probe) || /1\s?PM/i.test(probe);
}

/** Format an absolute Date as a locale-aware time (HH:mm or h:mm AM/PM). */
export function formatTime(hass: any, date: Date): string {
  return new Intl.DateTimeFormat(intlLocale(hass), {
    hour: use12h(hass) ? "numeric" : "2-digit",
    minute: "2-digit",
    hour12: use12h(hass),
  }).format(date);
}

/** Format minutes-from-midnight (of an arbitrary day) as a locale time. */
export function formatMinutes(hass: any, min: number): string {
  const d = new Date(2020, 0, 1, 0, 0, 0, 0);
  d.setMinutes(min);
  return formatTime(hass, d);
}

/**
 * Localized weekday names ordered by the given week start.
 * `style`: "short" | "long". `firstDayJs`: 0=Sunday, 1=Monday (default).
 */
export function weekdayNames(hass: any, style: "short" | "long", firstDayJs: number = 1): string[] {
  const fmt = new Intl.DateTimeFormat(intlLocale(hass), { weekday: style });
  // 2024-01-07 is a Sunday -> index by JS weekday (0=Sun..6=Sat).
  const byJs = Array.from({ length: 7 }, (_, js) => {
    const s = fmt.format(new Date(2024, 0, 7 + js));
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  return Array.from({ length: 7 }, (_, i) => byJs[(firstDayJs + i) % 7]);
}

/** Localized "1 Jan – 7 Jan" style range for a week. */
export function formatWeekRange(hass: any, monday: Date): string {
  const sunday = new Date(monday.getTime() + 6 * 86400000);
  const fmt = new Intl.DateTimeFormat(intlLocale(hass), { day: "numeric", month: "short" });
  return `${fmt.format(monday)} – ${fmt.format(sunday)}`;
}
