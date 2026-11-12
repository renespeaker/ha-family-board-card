/* ------------------------------------------------------------------ */
/*  README screenshots, English and German, from the browser harness.  */
/*  Fixed date and zone so they come out the same every time.          */
/*  Run: npm run build && npm run screenshots                          */
/* ------------------------------------------------------------------ */
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const PORT = Number(process.env.PORT ?? 8941);
const EXEC = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
// a Wednesday in the autumn holidays: family band, weather and every view have something to show
const NOW = "2026-10-07T10:20:00+02:00"; // 10:20 in Europe/Berlin, the zone the pages run in

const server = createServer(async (req, res) => {
  const path = normalize(decodeURI((req.url ?? "/").split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((ok) => server.listen(PORT, "127.0.0.1", ok));
// Some machines (this CI container among them) carry GNU Unifont, and Chrome's
// fallback picks its outline glyph for a few emoji (🍽️). No phone or PC shows
// that, so leave Unifont out and let the colour emoji font answer.
const FONTS = join(tmpdir(), "fb-screenshots-fonts.conf");
await writeFile(
  FONTS,
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>
  <include ignore_missing="yes">/etc/fonts/fonts.conf</include>
  <selectfont><rejectfont><glob>*[Uu]nifont*</glob></rejectfont></selectfont>
</fontconfig>`,
);
const browser = await chromium.launch({
  executablePath: EXEC,
  env: { ...process.env, FONTCONFIG_FILE: FONTS },
});

// name, query, viewport width, viewport height, [time], [ms to wind on]
const SHOTS = [
  ["day", "view=day&alerts=1&late=1&rides=1", 1400, 900],
  ["now", "view=now", 1100, 520],
  ["week", "view=week", 1400, 1000],
  ["month", "view=month", 1400, 900],
  ["timeline", "view=timeline", 1400, 700],
  ["agenda", "view=agenda", 560, 900],
  ["phone", "view=day", 400, 820],
  ["dark", "view=now&dark=1", 1100, 520],
  ["night", "view=day&night=1", 1100, 520, "2026-10-07T23:10:00+02:00"],
  ["rides", "view=day&alerts=1&rides=1", 1400, 900, "2026-10-07T14:20:00+02:00"],
  // the slideshow starts after a minute without touch: wind the clock on
  ["saver", "view=now&saver=1", 1100, 520, NOW, 65000],
];

for (const lang of ["en", "de"]) {
  for (const [name, query, width, height, time = NOW, wait = 0] of SHOTS) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 2,
      locale: lang === "de" ? "de-DE" : "en-US",
      timezoneId: "Europe/Berlin",
    });
    await page.clock.install({ time: new Date(time) });
    // the slideshow shuffles its photos: fix the dice so every run shows the same one
    await page.addInitScript(() => {
      Math.random = () => 0.42;
    });
    await page.goto(`http://127.0.0.1:${PORT}/tools/preview/index.html?${query}&lang=${lang}`);
    await page.waitForTimeout(1500);
    if (wait) {
      await page.clock.fastForward(wait);
      await page.waitForTimeout(1500);
    }
    const file = `docs/preview-${name}${lang === "en" ? "-en" : ""}.png`;
    // the card itself, cut to the viewport so tall views stay a sensible size
    const box = await page.locator("family-board-card").boundingBox();
    await page.screenshot({
      path: join(ROOT, file),
      clip: { x: 0, y: 0, width, height: Math.min(box.height, height) },
    });
    console.log(file);
    await page.close();
  }
}
await browser.close();
server.close();
