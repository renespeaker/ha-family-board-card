/* ------------------------------------------------------------------ */
/*  Layout checks in a real browser. Everything in here is something   */
/*  happy-dom cannot see, because it does not do layout.               */
/* ------------------------------------------------------------------ */
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const PORT = Number(process.env.PORT ?? 8931);
const EXEC = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const server = createServer(async (req, res) => {
  const path = normalize(decodeURI((req.url ?? "/").split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const file = join(ROOT, path.endsWith("/") ? `${path}tools/preview/index.html` : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((ok) => server.listen(PORT, "127.0.0.1", ok));

const failures = [];
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures.push(name);
};

const browser = await chromium.launch({ executablePath: EXEC });

/** Open the harness with the clock pinned, so "now" is reproducible. */
async function open({
  view = "day",
  lang = "de",
  dark = false,
  width = 1400,
  locale = "de-DE",
  slim = false,
  writable = false,
  swipe = false,
  night = false,
  timezoneId,
  time,
  extra = "",
}) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, locale, timezoneId });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const at = time ?? new Date();
  if (!time) at.setHours(10, 20, 0, 0);
  await page.clock.install({ time: at });
  const url = `http://127.0.0.1:${PORT}/tools/preview/index.html?view=${view}&lang=${lang}&alerts=1${dark ? "&dark=1" : ""}${slim ? "&slim=1" : ""}${writable ? "&writable=1" : ""}${swipe ? "&swipe=1" : ""}${night ? "&night=1" : ""}${extra}`;
  await page.goto(url);
  await page.waitForTimeout(1500);
  return { page, errors };
}

/* --- the dialog must keep its fields inside, in every locale -------- */
for (const locale of ["de-DE", "en-US"]) {
  for (const width of [1400, 400]) {
    const { page, errors } = await open({ width, locale });
    await page.evaluate(() => {
      const root = document.querySelector("family-board-card").renderRoot;
      root.querySelector(".event").click();
    });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => {
      const d = document.querySelector("family-board-card").renderRoot.querySelector(".dialog");
      return d.scrollWidth - d.clientWidth;
    });
    check(`Dialog ohne Überlauf (${locale}, ${width}px)`, overflow <= 0, `${overflow}px`);
    check(`keine Konsolenfehler (${locale}, ${width}px)`, errors.length === 0, errors.join(" | "));
    await page.close();
  }
}

/* --- the new-event dialog with a series still fits ------------------ */
for (const locale of ["de-DE", "en-US"]) {
  for (const width of [1400, 400]) {
    const { page, errors } = await open({ width, locale, writable: true });
    await page.evaluate(async () => {
      const el = document.querySelector("family-board-card");
      el._openCreate(0, el._day, 16 * 60);
      await el.updateComplete;
      const sel = el.renderRoot.querySelector(".dialog select");
      sel.value = "WEEKLY";
      sel.dispatchEvent(new Event("change"));
      await el.updateComplete;
    });
    const r = await page.evaluate(() => {
      const d = document.querySelector("family-board-card").renderRoot.querySelector(".dialog");
      return {
        overflow: d.scrollWidth - d.clientWidth,
        until: !!d.querySelector('input[type="date"]'),
      };
    });
    check(
      `Serien-Dialog ohne Überlauf (${locale}, ${width}px)`,
      r.overflow <= 0 && r.until,
      `${r.overflow}px${r.until ? "" : ", kein Bis-Feld"}`,
    );
    check(
      `keine Konsolenfehler (Serie, ${locale}, ${width}px)`,
      errors.length === 0,
      errors.join(" | "),
    );
    await page.close();
  }
}

/* --- the timeline's outer hour labels must stay readable ------------ */
{
  const { page } = await open({ view: "timeline" });
  const labels = await page.evaluate(() => {
    const root = document.querySelector("family-board-card").renderRoot;
    const wrap = root.querySelector(".tlwrap").getBoundingClientRect();
    const hours = [...root.querySelectorAll(".tlhour")];
    const box = (n) => n.getBoundingClientRect();
    return {
      first: { text: hours[0].textContent.trim(), cut: box(hours[0]).left < wrap.left - 0.5 },
      last: {
        text: hours.at(-1).textContent.trim(),
        cut: box(hours.at(-1)).right > wrap.right + 0.5,
      },
    };
  });
  check(`erstes Stundenlabel vollständig (${labels.first.text})`, !labels.first.cut);
  check(`letztes Stundenlabel vollständig (${labels.last.text})`, !labels.last.cut);
  await page.close();
}

/* --- the now-line time label: fully visible, never covered ---------- */
for (const [locale, lang, width] of [
  ["en-US", "en", 1400],
  ["en-US", "en", 400],
  ["de-DE", "de", 400],
]) {
  const { page } = await open({ view: "day", lang, locale, width });
  const r = await page.evaluate(() => {
    const root = document.querySelector("family-board-card").renderRoot;
    const span = root.querySelector(".nowline span");
    if (!span) return { ok: false, why: "keine Jetzt-Linie" };
    const s = span.getBoundingClientRect();
    const card = root.querySelector(".board").getBoundingClientRect();
    // what is on top at the label's last character (where the dot used to
    // sit); the line ignores the pointer, so let hit-testing see it here
    span.parentElement.style.pointerEvents = span.style.pointerEvents = "auto";
    const hit = root.elementFromPoint(s.right - 4, s.top + s.height / 2);
    return {
      ok: s.left >= card.left - 0.5 && (hit === span || span.contains(hit)),
      why: `"${span.textContent.trim()}" ${Math.round(s.left)}..${Math.round(s.right)}px, oben: ${hit?.tagName}`,
    };
  });
  check(`Uhrzeit an der Jetzt-Linie lesbar (${lang}, ${width}px)`, r.ok, r.why);
  await page.close();
}

/* --- the timeline's now label stays on one line ---------------------- */
for (const [locale, lang] of [
  ["en-US", "en"],
  ["de-DE", "de"],
]) {
  const { page } = await open({ view: "timeline", lang, locale });
  const h = await page.evaluate(() => {
    const span = document
      .querySelector("family-board-card")
      .renderRoot.querySelector(".tlnow span");
    return span
      ? {
          text: span.textContent.trim(),
          lines: Math.round(span.getBoundingClientRect().height / 14),
        }
      : null;
  });
  check(
    `Zeitstrahl-Uhrzeit einzeilig (${lang})`,
    !!h && h.lines <= 1,
    h ? `"${h.text}", ${h.lines} Zeile(n)` : "keine Jetzt-Linie",
  );
  await page.close();
}

/* --- the agenda must land on today, not at the top of the week ------ */
{
  const { page } = await open({ view: "agenda", width: 560 });
  const landed = await page.evaluate(() => {
    const root = document.querySelector("family-board-card").renderRoot;
    const box = root.querySelector(".agenda");
    const today = box.querySelector(".agenda-date.today")?.closest(".agenda-day");
    if (!today) return { ok: false, why: "kein Heute-Abschnitt" };
    const offset =
      today.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
    return {
      ok: Math.abs(box.scrollTop - offset) < 8,
      why: `scrollTop=${Math.round(box.scrollTop)} heute=${Math.round(offset)}`,
    };
  });
  check("Agenda scrollt auf heute", landed.ok, landed.why);
  await page.close();
}

/* --- the slim header has to actually be slimmer --------------------- */
{
  const headerHeight = async (slim) => {
    const { page } = await open({ slim });
    const px = await page.evaluate(() => {
      const root = document.querySelector("family-board-card").renderRoot;
      const card = root.querySelector("ha-card") ?? root.firstElementChild;
      const board = root.querySelector(".board");
      return Math.round(board.getBoundingClientRect().top - card.getBoundingClientRect().top);
    });
    await page.close();
    return px;
  };
  const wide = await headerHeight(false);
  const slim = await headerHeight(true);
  check("schlanker Kopf spart Hoehe", slim < wide - 20, `${wide}px -> ${slim}px`);
}

/* --- the month grid across a daylight-saving change (#62) ----------- */
{
  // 2026-10-25 is the day the clocks go back in Europe: 25 hours long. Stepping
  // days by a flat 24 hours used to render that day twice and shift the rest of
  // the grid off its weekday column.
  const { page, errors } = await open({
    view: "month",
    timezoneId: "Europe/Paris",
    locale: "fr-FR",
    time: new Date("2026-10-15T10:00:00+02:00"),
  });
  const grid = await page.evaluate(() => {
    const root = document.querySelector("family-board-card").renderRoot;
    return [...root.querySelectorAll(".monthgrid > *")].map((cell) =>
      parseInt((cell.textContent ?? "").trim(), 10),
    );
  });
  const repeated = grid.filter((n, i) => i > 0 && n === grid[i - 1]);
  check(
    "Monatsraster ohne doppelten Tag (Zeitumstellung)",
    grid.length > 0 && repeated.length === 0,
    repeated.length ? `doppelt: ${repeated.join(", ")}` : `${grid.length} Zellen`,
  );
  check("keine Konsolenfehler (Monat, Zeitumstellung)", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* --- weather chips must fit their weekday / month cell -------------- */
for (const [view, sel, width] of [
  ["week", ".wday", 1400],
  ["week", ".wday", 400],
  ["month", ".mcell", 1400],
  ["month", ".mcell", 400],
]) {
  const { page } = await open({ view, width });
  const fit = await page.evaluate((sel) => {
    const root = document.querySelector("family-board-card").renderRoot;
    const cells = [...root.querySelectorAll(sel)].filter((c) => c.querySelector(".wx"));
    const bad = cells.filter((c) => {
      const box = c.getBoundingClientRect();
      const wx = c.querySelector(".wx").getBoundingClientRect();
      return wx.right > box.right + 0.5 || wx.left < box.left - 0.5;
    });
    return { n: cells.length, bad: bad.length };
  }, sel);
  check(
    `Wetter passt in ${sel} (${view}, ${width}px)`,
    fit.n > 0 && fit.bad === 0,
    `${fit.n} Zellen mit Wetter, ${fit.bad} zu schmal`,
  );
  await page.close();
}

/* --- family calendar chips must fit their day / month cell ---------- */
for (const [view, sel, width] of [
  ["week", ".wday", 1400],
  ["week", ".wday", 400],
  ["month", ".mcell", 1400],
  ["month", ".mcell", 400],
  ["day", ".famband", 400],
  ["now", ".cdband", 400],
]) {
  const { page } = await open({ view, width });
  const fit = await page.evaluate((sel) => {
    const root = document.querySelector("family-board-card").renderRoot;
    const cells = [...root.querySelectorAll(sel)].filter((c) =>
      c.querySelector(".famchip, .cdchip"),
    );
    const bad = cells.filter((c) => {
      const box = c.getBoundingClientRect();
      return [...c.querySelectorAll(".famchip, .cdchip")].some((chip) => {
        const r = chip.getBoundingClientRect();
        // the chip box leaves the cell, or its text spills out of the chip
        // (an ellipsis clips inside the chip and is fine)
        return (
          r.right > box.right + 0.5 ||
          r.left < box.left - 0.5 ||
          chip.scrollWidth > chip.clientWidth + 1
        );
      });
    });
    return { n: cells.length, bad: bad.length };
  }, sel);
  check(
    `Familien-Chips passen in ${sel} (${view}, ${width}px)`,
    fit.n > 0 && fit.bad === 0,
    `${fit.n} Zellen mit Familien-Terminen, ${fit.bad} zu schmal`,
  );
  await page.close();
}

/* --- swipe: pages where nothing scrolls, never fights a scroll ------- */
{
  // a real touch gesture through Chrome's input pipeline, so the browser
  // itself decides whether it is a scroll (that is the point of the check)
  const touchSwipe = async (page, x0, y0, x1, y1) => {
    const cdp = await page.context().newCDPSession(page);
    const point = (x, y) => [{ x, y, id: 1 }];
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: point(x0, y0) });
    for (let i = 1; i <= 8; i++) {
      const x = x0 + ((x1 - x0) * i) / 8;
      const y = y0 + ((y1 - y0) * i) / 8;
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: point(x, y) });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(300);
  };
  const state = (page, scroller) =>
    page.evaluate((scroller) => {
      const el = document.querySelector("family-board-card");
      const box = el.renderRoot.querySelector(scroller);
      return { day: el._day, week: el._weekOffset, scrolled: Math.round(box?.scrollLeft ?? 0) };
    }, scroller);
  for (const [view, width, scroller, expectPage] of [
    ["day", 1400, ".board", true], // nothing scrolls sideways: the swipe pages
    ["week", 1400, ".weekwrap", true],
    ["timeline", 400, ".tlwrap", false], // the timeline scrolls sideways: scrolling wins
  ]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      hasTouch: true,
      isMobile: width < 600,
    });
    const at = new Date();
    at.setHours(10, 20, 0, 0);
    await page.clock.install({ time: at });
    await page.goto(`http://127.0.0.1:${PORT}/tools/preview/index.html?view=${view}&swipe=1`);
    await page.waitForTimeout(1500);
    // across the grid itself, right to left, inside the viewport
    const y = await page.evaluate((scroller) => {
      const r = document
        .querySelector("family-board-card")
        .renderRoot.querySelector(scroller)
        .getBoundingClientRect();
      return Math.round(Math.min(r.top + r.height * 0.6, innerHeight - 40));
    }, scroller);
    const before = await state(page, scroller);
    await touchSwipe(page, width * 0.75, y, width * 0.2, y);
    const after = await state(page, scroller);
    const paged = after.day !== before.day || after.week !== before.week;
    check(
      expectPage
        ? `Wischen blättert (${view}, ${width}px)`
        : `Wischen lässt seitliches Scrollen in Ruhe (${view}, ${width}px)`,
      expectPage ? paged : !paged && after.scrolled !== before.scrolled,
      `Tag ${before.day}→${after.day}, Woche ${before.week}→${after.week}, scrollLeft ${before.scrolled}→${after.scrolled}`,
    );
    await page.close();
  }
}

/* --- accessibility: axe-core over every view ------------------------ */
// Structure, roles, names and ARIA must be clean everywhere. Colour contrast
// is checked separately below: most of it comes from the user's HA theme and
// from past events that are faded on purpose (past_opacity).
const AXE = await readFile(join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8");
const axe = (page, context, options) =>
  page.addScriptTag({ content: AXE }).then(() =>
    page.evaluate(
      async ([context, options]) => {
        const res = await window.axe.run(context ?? document.querySelector("family-board-card"), {
          resultTypes: ["violations"],
          ...options,
        });
        return res.violations.map((v) => `${v.id} ×${v.nodes.length}`);
      },
      [context, options],
    ),
  );
for (const [view, dark, dialog, night] of [
  ["now"],
  ["day"],
  ["timeline"],
  ["week"],
  ["month"],
  ["agenda"],
  ["day", true],
  ["day", false, true],
  ["day", false, false, true],
]) {
  const { page } = await open(
    night
      ? {
          view,
          night: true,
          time: (() => {
            const d = new Date();
            d.setHours(23, 10, 0, 0);
            return d;
          })(),
        }
      : { view, dark },
  );
  if (dialog) {
    await page.evaluate(() =>
      document.querySelector("family-board-card").renderRoot.querySelector(".event").click(),
    );
    await page.waitForTimeout(300);
  }
  const found = await axe(page, null, { rules: { "color-contrast": { enabled: false } } });
  const name = `${view}${dark ? " dunkel" : ""}${dialog ? " + Dialog" : ""}${night ? " nachts" : ""}`;
  check(`axe: keine Barrierefreiheits-Fehler (${name})`, found.length === 0, found.join(", "));
  await page.close();
}

/* --- the new warnings, rides and the photo screensaver ------------- */
// late warning, rides and private markers in the day, now and agenda views
for (const [view, dark] of [["day"], ["day", true], ["now"], ["agenda"]]) {
  const { page, errors } = await open({ view, dark, extra: "&late=1&rides=1" });
  const found = await axe(page, null, { rules: { "color-contrast": { enabled: false } } });
  const name = `${view}${dark ? " dunkel" : ""} + Fahrten/zuhause`;
  check(`axe: keine Barrierefreiheits-Fehler (${name})`, found.length === 0, found.join(", "));
  check(`keine Konsolenfehler (${name})`, errors.length === 0, errors.join(" | "));
  if (view === "day") {
    const sel = ".alert.a-late, .alert.a-ride, .eride";
    const n = await page.evaluate(
      (sel) => document.querySelector("family-board-card").renderRoot.querySelectorAll(sel).length,
      sel,
    );
    const contrast = await axe(
      page,
      { include: [{ fromShadowDom: ["family-board-card", sel] }] },
      { runOnly: ["color-contrast"] },
    );
    check(
      `Kontrast ausreichend: Warn-Chips und Fahrer (${name})`,
      n >= 3 && contrast.length === 0,
      `${n} Elemente; ${contrast.join(", ")}`,
    );
  }
  await page.close();
}

// the slideshow: same height as the board, readable clock, ends with a key
{
  const { page, errors } = await open({ view: "day", extra: "&saver=1" });
  const boardH = await page.evaluate(
    () => document.querySelector("family-board-card").offsetHeight,
  );
  await page.clock.fastForward(65000);
  await page.waitForTimeout(1500);
  const shown = await page.evaluate(() => {
    const el = document.querySelector("family-board-card");
    const card = el.renderRoot.querySelector(".saver");
    const img = el.renderRoot.querySelector(".saverimg");
    return {
      on: !!card,
      h: el.offsetHeight,
      photo: !!img && img.complete && img.naturalWidth > 0,
    };
  });
  check(
    "Bildschirmschoner startet mit Foto, so hoch wie das Board",
    shown.on && shown.photo && Math.abs(shown.h - boardH) <= 2,
    `an: ${shown.on}, Foto: ${shown.photo}, ${boardH}px → ${shown.h}px`,
  );
  const found = await axe(page, null);
  check(
    "axe: keine Barrierefreiheits-Fehler (Bildschirmschoner)",
    found.length === 0,
    found.join(", "),
  );
  await page.evaluate(() =>
    document.querySelector("family-board-card").renderRoot.querySelector(".saver").focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const back = await page.evaluate(
    () => !!document.querySelector("family-board-card").renderRoot.querySelector(".board"),
  );
  check("Enter beendet den Bildschirmschoner", back);
  check("keine Konsolenfehler (Bildschirmschoner)", errors.length === 0, errors.join(" | "));
  await page.close();
}

/* --- contrast of the card's own small texts on tinted event blocks --- */
for (const dark of [false, true]) {
  for (const [view, sel] of [
    ["day", ".event:not(.past) .etime"],
    ["week", ".wchip:not(.past) small"],
    ["now", ".nrow .nnext, .nrow .nuntil, .nrow .nstat"],
  ]) {
    const { page } = await open({ view, dark });
    const found = await axe(
      page,
      { include: [{ fromShadowDom: ["family-board-card", sel] }] },
      { runOnly: ["color-contrast"] },
    );
    check(
      `Kontrast ausreichend: ${sel} (${view}${dark ? ", dunkel" : ""})`,
      found.length === 0,
      found.join(", "),
    );
    await page.close();
  }
}

/* --- keyboard: tab lists, dialog focus and focus trap ---------------- */
{
  const { page } = await open({ view: "day" });
  const active = () =>
    page.evaluate(() => {
      const a = document.querySelector("family-board-card").renderRoot.activeElement;
      return a
        ? { tag: a.tagName, text: a.textContent.trim(), inDialog: !!a.closest(".dialog") }
        : {};
    });
  await page.keyboard.press("Tab");
  const first = await active();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const moved = await active();
  check(
    "Pfeiltaste wechselt die Ansicht",
    first.text === "Tag" && moved.text === "Zeitstrahl",
    `${first.text} → ${moved.text}`,
  );
  // the whole tab list is a single Tab stop
  await page.keyboard.press("Tab");
  const after = await active();
  check("Ansichts-Tabs sind ein einziger Tab-Stopp", after.text !== "Woche", after.text);
  await page.keyboard.press("ArrowLeft"); // harmless outside a tab list
  await page.evaluate(() => {
    const el = document.querySelector("family-board-card");
    el._view = "day";
  });
  await page.waitForTimeout(800);
  await page.evaluate(() =>
    document.querySelector("family-board-card").renderRoot.querySelector(".event").focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  check("Dialog bekommt den Fokus", (await active()).inDialog === true);
  let stayed = true;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press(i < 8 ? "Tab" : "Shift+Tab");
    if (!(await active()).inDialog) stayed = false;
  }
  check("Tab bleibt im Dialog", stayed);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const back = await active();
  check(
    "Fokus kehrt nach Escape zum Termin zurück",
    back.tag === "DIV" && !back.inDialog,
    back.text,
  );
  await page.close();
}

/* --- nothing may scroll sideways out of the card -------------------- */
for (const [view, width] of [
  ["day", 400],
  ["agenda", 400],
  ["week", 400],
  ["month", 400],
]) {
  const { page } = await open({ view, width });
  const bleed = await page.evaluate(() => {
    const el = document.querySelector("family-board-card");
    return el.scrollWidth - el.clientWidth;
  });
  check(`${view} läuft bei ${width}px nicht seitlich aus`, bleed <= 0, `${bleed}px`);
  await page.close();
}

await browser.close();
server.close();
console.log(
  failures.length ? `\n${failures.length} Prüfung(en) fehlgeschlagen` : "\nalles in Ordnung",
);
process.exit(failures.length ? 1 : 0);
