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
async function open({ view = "day", lang = "de", dark = false, width = 1400, locale = "de-DE" }) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, locale });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  const at = new Date();
  at.setHours(10, 20, 0, 0);
  await page.clock.install({ time: at });
  const url = `http://127.0.0.1:${PORT}/tools/preview/index.html?view=${view}&lang=${lang}&alerts=1${dark ? "&dark=1" : ""}`;
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
