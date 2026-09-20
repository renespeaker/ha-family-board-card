# Browser-Harness

Die Karte in einem echten Browser, gegen ein nachgebautes Home Assistant.

`npm test` deckt Logik (`events.ts`) und Verhalten (happy-dom) ab — aber **kein
Layout**: happy-dom rechnet keine Größen aus, `getBoundingClientRect()` liefert
dort Nullen. Fehler wie „das Ende-Feld ragt 75 px aus dem Dialog" oder „das
erste Stundenlabel wird vom Scrollrand halbiert" lassen sich deshalb nur hier
finden.

```bash
npm run build          # das Harness lädt dist/
npm run preview        # http://127.0.0.1:8931/tools/preview/
npm run check:browser  # Layout-Prüfungen, schreibt Screenshots nach /tmp
```

`check:browser` läuft **nicht** in der CI: es braucht einen Browser (Chromium
über `playwright-core`, Pfad via `CHROMIUM_PATH`, Vorgabe
`/opt/pw-browsers/chromium`). Vor einer Release-Kandidatin lohnt ein Durchlauf.

## Parameter

`index.html` versteht `?view=day|timeline|week|month|agenda`, `?lang=de|en`,
`?dark=1` (Home-Assistant-Dark-Theme) und `?alerts=1` (Tages-Check).

Die Daten sind erfunden und die Namen generisch — die Screenshots im README
entstehen hier, es sollen keine echten Familiennamen hineingeraten.
