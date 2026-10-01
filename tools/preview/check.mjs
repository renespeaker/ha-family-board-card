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
  timezoneId,
  time,
}) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, locale, timezoneId });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const at = time ?? new Date();
  if (!time) at.setHours(10, 20, 0, 0);
  await page.clock.install({ time: at });
  const url = `http://127.0.0.1:${PORT}/tools/preview/index.html?view=${view}&lang=${lang}&alerts=1${dark ? "&dark=1" : ""}${slim ? "&slim=1" : ""}`;
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
    return { ok: Math.abs(box.scrollTop - offset) < 8, why: `scrollTop=${Math.round(box.scrollTop)} heute=${Math.round(offset)}` };
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
for (const [view, dark, dialog] of [
  ["now"],
  ["day"],
  ["timeline"],
  ["week"],
  ["month"],
  ["agenda"],
  ["day", true],
  ["day", false, true],
]) {
  const { page } = await open({ view, dark });
  if (dialog) {
    await page.evaluate(() =>
      document.querySelector("family-board-card").renderRoot.querySelector(".event").click(),
    );
    await page.waitForTimeout(300);
  }
  const found = await axe(page, null, { rules: { "color-contrast": { enabled: false } } });
  const name = `${view}${dark ? " dunkel" : ""}${dialog ? " + Dialog" : ""}`;
  check(`axe: keine Barrierefreiheits-Fehler (${name})`, found.length === 0, found.join(", "));
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
      return a ? { tag: a.tagName, text: a.textContent.trim(), inDialog: !!a.closest(".dialog") } : {};
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
  check("Fokus kehrt nach Escape zum Termin zurück", back.tag === "DIV" && !back.inDialog, back.text);
  await page.close();
}

/* --- nothing may scroll sideways out of the card -------------------- */
for (const [view, width] of [["day", 400], ["agenda", 400], ["week", 400], ["month", 400]]) {
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
console.log(failures.length ? `\n${failures.length} Prüfung(en) fehlgeschlagen` : "\nalles in Ordnung");
process.exit(failures.length ? 1 : 0);
