# Aufnahme in den offiziellen HACS-Store

Diese Karte ist bereits per **Custom Repository** installierbar. Damit sie im
**Standard-HACS-Store** (ohne Custom-Repo, direkt suchbar) auftaucht, muss das
Repo einmalig in die `hacs/default`-Liste aufgenommen werden.

## Voraussetzungen (alle erfüllt ✅)

- [x] Öffentliches Repository
- [x] Repo-**Description** gesetzt
- [x] Repo-**Topics** gesetzt
- [x] `hacs.json` mit `name` und `filename`
- [x] README mit Beschreibung **und Bild**
- [x] `hacs/action` (Plugin) Validierung grün — siehe `.github/workflows/validate.yml`
- [ ] **Mindestens ein veröffentlichtes GitHub-Release** mit angehängtem
      `ha-family-board-card.js` (übernimmt `.github/workflows/release.yml` automatisch)

> Wichtig: Ohne veröffentlichtes Release lehnt HACS die Aufnahme ab. Das Release
> muss **published** sein (nicht „Draft"); erst dann existiert das Tag und der
> Release-Workflow hängt das Bundle an.

## Schritt 1 – Release veröffentlichen

```bash
gh release create v0.3.0 \
  --repo renespeaker/ha-family-board-card \
  --target main \
  --title "v0.3.0" \
  --notes "Wochen-Navigation, Nebeneinander-Layout, color_by location, Auto-Refresh, i18n (DE/EN), Tests/CI."
```

Danach prüfen, dass unter **Releases → v0.3.0 → Assets** die Datei
`ha-family-board-card.js` hängt.

## Schritt 2 – PR an `hacs/default`

1. `https://github.com/hacs/default` forken.
2. In der Datei **`plugin`** (eine Repo-Slug pro Zeile, alphabetisch) ergänzen:

   ```
   renespeaker/ha-family-board-card
   ```

3. Pull Request öffnen. Die HACS-Action im `hacs/default`-Repo prüft das Repo
   automatisch erneut; bei grünem Check übernimmt ein Maintainer den Merge.

## Schritt 3 – nach dem Merge

- Die Karte ist über HACS → **Frontend** direkt suchbar.
- Neue Versionen werden allein durch ein neues **GitHub-Release** ausgeliefert
  (Tag erhöhen → `release.yml` baut & hängt das Bundle an → HACS bietet Update an).

## Brands (optional)

Für ein Icon/Logo in HACS kann zusätzlich ein PR an
[`home-assistant/brands`](https://github.com/home-assistant/brands) gestellt
werden. Für Lovelace-Plugins ist das **nicht zwingend**.
