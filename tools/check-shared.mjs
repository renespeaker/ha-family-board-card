/* ------------------------------------------------------------------ */
/*  Compares the mirrored files with the copy in the sister repo.      */
/*  Reports drift, never blocks: a deliberate change lands in one repo */
/*  first, and that must not stop work in the other.                   */
/* ------------------------------------------------------------------ */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SISTER = "renespeaker/ha-family-task-card";
const BRANCH = process.env.SISTER_BRANCH ?? "main";
const MIRRORED = ["src/shared/person-palette.ts"];

const root = new URL("../", import.meta.url);
let drifted = 0;
let unreachable = 0;

for (const path of MIRRORED) {
  const mine = await readFile(fileURLToPath(new URL(path, root)), "utf8");
  const url = `https://raw.githubusercontent.com/${SISTER}/${BRANCH}/${path}`;
  let theirs;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    theirs = await res.text();
  } catch (err) {
    unreachable++;
    console.log(`  ?   ${path} — ${SISTER} nicht erreichbar (${err instanceof Error ? err.message : String(err)})`);
    continue;
  }
  if (mine === theirs) {
    console.log(`  ok  ${path} — identisch mit ${SISTER}`);
  } else {
    drifted++;
    // GitHub hebt das in der Zusammenfassung des Laufs hervor, statt es im
    // Protokoll untergehen zu lassen - sichtbar, aber ohne roten Lauf.
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning file=${path}::Laeuft auseinander mit ${SISTER}@${BRANCH}`);
    }
    console.log(`\n  ABWEICHUNG  ${path}`);
    console.log(`  Diese Datei unterscheidet sich von ${SISTER}@${BRANCH}.`);
    console.log(`  Gleiche beide Repos ab: ${url}\n`);
  }
}

if (drifted) console.log(`${drifted} gespiegelte Datei(en) laufen auseinander.`);
else if (!unreachable) console.log("Alle gespiegelten Dateien stimmen überein.");
// Absichtlich immer erfolgreich: eine Meldung, keine Blockade.
