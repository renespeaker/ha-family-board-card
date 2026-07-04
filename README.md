# Family Board Card

![Family Board Card – Tagesansicht](docs/preview-v2.svg)

Ein Familienkalender bzw. „Wer ist wann wo"-Board für [Home Assistant](https://www.home-assistant.io/). Personen stehen als Spalten oben (mit Avatar aus der `person.*`-Entität), links läuft die Zeitleiste. Die Karte zeigt auf einen Blick, welche Aktivitäten gleichzeitig an unterschiedlichen Orten stattfinden — für bis zu 10 Personen.

- **Tagesansicht** – Personen als Spalten, geteilte Zeitachse, Jetzt-Linie; **überlappende Termine** werden nebeneinander dargestellt.
- **Wochenansicht** – Wochentage als Zeilen, Personen als Spalten, kompakte Termin-Chips.
- **Monatsansicht** – klassisches Monats-Grid mit farbigen Terminen pro Person; Klick auf einen Tag springt in die Tagesansicht.
- **Agenda-/Listenansicht** – chronologische Terminliste, nach Tagen gruppiert; ideal fürs Handy.
- **Ansichten wählbar** – im Editor festlegen, welche Umschalter (Tag/Woche/Monat/Agenda) erscheinen.
- **Wochen-Navigation** – vor/zurück blättern, ein Klick auf den Datumsbereich springt zurück zu „heute".
- **Theme-aware** – übernimmt Farben und Schrift des aktiven Dashboard-Themes (nutzt durchgehend HA-CSS-Variablen).
- **Konfigurierbar** – Zeitraster 15/30/60 min, Tagesfenster, Wochenende ein/aus, Einfärben nach Person oder Ort, Auto-Aktualisierung.
- **Termine verwalten** – anlegen/bearbeiten/löschen direkt in der Karte, **aber nur** bei Kalendern, die das unterstützen (Local Calendar, CalDAV …). Schreibgeschützte Kalender (z. B. ICS-Abos) werden automatisch erkannt und nur angezeigt. Wiederkehrende Termine: Wahl **„nur dieser / dieser und folgende"**.
- **Mehrere Kalender pro Person** – z. B. Arbeit + privat in einer Spalte (im Editor auswählbar).
- **Robuste Termin-Logik** – Ganztags-Events (Ende exklusiv), über Mitternacht laufende und mehrtägige Termine werden korrekt auf die Tage aufgeteilt; Zeitzonen werden berücksichtigt.
- **Mehrsprachig & lokalisiert** – Texte in Deutsch/Englisch, Wochentage und Uhrzeiten (12/24 h) aus der HA-Locale; relative Tage („Heute/Morgen").
- **Alltags-Politur** – vergangene Termine ausgegraut, Einfärben auch nach Kalender, Ort direkt in Google Maps öffnen, störende Termine per Muster ausblenden.
- **Live-Fortschritt & Countdown** – laufende Termine zeigen einen Fortschrittsbalken (abschaltbar), kommende in der Agenda ein „in 20 Min."; aktualisiert minütlich.
- **Wetter** – Symbol + Temperatur pro Tag aus einer `weather.*`-Entität im Tages-/Agenda-Header (HA-Standort, nicht die Termin-Adresse).
- **Dichte Tage bleiben lesbar** – überlappen mehr Termine als `max_columns` erlaubt, werden die zusätzlichen Spalten zu einem „+N"-Chip zusammengefasst (Klick öffnet die Agenda) statt zu unlesbar schmalen Streifen zu schrumpfen.
- **Lange Termine als Hintergrund-Band** – Dauertermine (z. B. OGS/Betreuung, „Freispiel") ab einer einstellbaren Länge laufen als dezentes Vollbreiten-Band hinter der Spalte, statt die kurzen Stunden nebeneinander zu quetschen. So bekommen die eigentlichen Termine die volle Breite.
- **Auto-Fit-Höhe** – optional passt sich die Tagesansicht automatisch an die verfügbare Kartenhöhe an, sodass Start–Endstunde ohne Scrollen komplett sichtbar sind (ideal für Wandtablets/Kiosk).
- **Füllt den Bildschirm** – Personenspalten wachsen mit der Kartenbreite mit (Panel-Ansicht/breite Karten); mit `full_height` reicht das Board bis zum unteren Bildschirmrand. Spaltenbreite, Achsenbreite und Abstände sind einstellbar.
- **Vorläufige Termine** – Termine, deren Titel ein `tentative_patterns`-Muster enthält, werden gestrichelt und leicht transparent dargestellt (opt-in; der Kalender-Status wird bewusst nicht ausgewertet).
- **Entitäts-Badges pro Person** – beliebige Entitäten (Handy-Akku, Sensoren …) als kleine Chips unter dem Personenkopf; Klick öffnet den More-Info-Dialog.
- **Kiosk-Modus** – optional nach X Minuten Inaktivität automatisch zurück zur Startansicht und zu „heute"; größere Touch-Ziele auf Touch-Geräten.
- **Visueller Editor** – Personen inkl. Entity-Auswahl (`person.*`/`calendar.*`) komplett ohne YAML pflegbar.

> Status: **v0.11 – Anzeige + Schreibzugriff + Skalierung/i18n + lesbare dichte Tage.**

## Installation (HACS, Custom Repository)

Solange die Karte nicht im offiziellen HACS-Store ist:

1. HACS öffnen → oben rechts auf die drei Punkte → **Custom repositories**.
2. URL `https://github.com/renespeaker/ha-family-board-card` eintragen, Typ **Dashboard**, **ADD**.
3. Karte installieren. Die Lovelace-Resource wird im Storage-Mode automatisch als `/hacsfiles/ha-family-board-card/ha-family-board-card.js` registriert (im YAML-Mode manuell eintragen).
4. Karte aufs Dashboard setzen: `type: custom:family-board-card`.

### Manuell (schneller Test ohne HACS)

`dist/ha-family-board-card.js` nach `config/www/` kopieren und als Resource hinzufügen:

```yaml
url: /local/ha-family-board-card.js
type: module
```

## Konfiguration

```yaml
type: custom:family-board-card
title: Familienplan  # optional, eigener Kartentitel
view: day            # day | week
time_grid: 30        # 15 | 30 | 60
start_hour: 6
end_hour: 22
show_weekends: true
show_now_line: true
color_by: person     # person | location
hour_height: 64      # Pixel pro Stunde (40–96), Tagesansicht
refresh_interval: 300 # Sekunden; 0 = aus
persons:
  - name: Anna
    person: person.anna       # Avatar (entity_picture) + Live-Status
    calendar: calendar.anna   # Quelle der Termine
    color: '#8B7CF6'          # optional, sonst Default-Palette
  - name: Ben
    person: person.ben
    calendar:                   # mehrere Kalender pro Person möglich
      - calendar.ben_arbeit
      - calendar.ben_privat
```

| Option          | Typ     | Default | Beschreibung |
|-----------------|---------|---------|--------------|
| `persons`       | Liste   | –       | 1–10 Personen mit `name`, `person`, `calendar` (String **oder Liste**), optional `color` und `badges` (Liste von Entitäten als Chips im Personenkopf) |
| `hide_empty_persons` | boolean | `false` | Wochenansicht: Personen ohne Termine in der Woche ausblenden |
| `auto_return`   | number  | `0`     | Kiosk: nach X Minuten ohne Berührung zurück zur Startansicht/heute (0 = aus) |
| `title`          | string  | –       | Eigener Kartentitel (Default: lokalisiert „Familienplan") |
| `view`          | string  | `day`   | Startansicht: `day`, `week`, `month` oder `agenda` |
| `views`         | Liste   | alle    | Welche Ansichten im Umschalter erscheinen, z. B. `[day, agenda]` |
| `time_grid`     | number  | `30`    | Raster der Zeitleiste in Minuten |
| `start_hour`    | number  | `6`     | Erste sichtbare Stunde |
| `end_hour`      | number  | `22`    | Letzte sichtbare Stunde |
| `show_weekends` | boolean | `true`  | Sa/So anzeigen |
| `show_now_line` | boolean | `true`  | Aktuelle Uhrzeit als Linie |
| `color_by`      | string  | `person`| Einfärben nach `person`, `location` oder `calendar` |
| `dim_past`      | boolean | `true`  | Bereits vergangene Termine ausgrauen |
| `hide_patterns` | Liste   | –       | Termine ausblenden, deren Titel eines der Textmuster enthält (z. B. `["Frei", "Privat"]`) |
| `show_progress` | boolean | `true`  | Fortschrittsbalken am laufenden Termin |
| `weather_entity`| string  | –       | `weather.*`-Entität für die Tages-Vorhersage (HA-Standort) |
| `show_weather`  | boolean | `true`* | Wetter im Header anzeigen (*wirkt nur, wenn `weather_entity` gesetzt) |
| `hour_height`   | number  | `64`    | Höhe einer Stunde in px (40–96) – Tagesansicht skalieren (Wandtablet); bei `fit_height` die Obergrenze |
| `fit_height`    | boolean | `false` | Tagesansicht automatisch so verkleinern, dass Start–Endstunde ohne Scrollen komplett sichtbar sind (Wandtablet/Kiosk) |
| `full_height`   | boolean | `false` | Board bis zum unteren Bildschirmrand strecken (Panel-/Wandtablet-Ansicht); Standard ist eine 58 %-Deckelung |
| `col_min_width` | number  | `120`   | Mindestbreite (px) pro Personenspalte, darunter wird horizontal gescrollt; Spalten wachsen darüber hinaus mit der Kartenbreite |
| `background_hours` | number | `3`  | Timed-Termine ab dieser Länge (Std.) als dezentes Hintergrund-Band statt als Spalte; `0` = aus |
| `max_columns`   | number  | `3`     | Max. nebeneinander liegende Spalten pro Person/Tag; bei mehr Überlappungen erscheint ein „+N"-Chip (1–8) |
| `tentative_patterns` | Liste | –    | Termine mit passendem Titel-Muster als vorläufig (gestrichelt/transparent) markieren |
| `first_day`     | string  | `monday`| Wochenstart: `monday` oder `sunday` |
| `scroll_to_now` | boolean | `true`  | Tagesansicht beim Laden automatisch zur aktuellen Uhrzeit scrollen |
| `refresh_interval` | number | `300` | Auto-Aktualisierung der Termine in Sekunden (0 = aus); zusätzlich bei Tablet-Aufwachen |

Jede `calendar.*`-Entität funktioniert – egal ob `local_calendar` (lokal, ohne Cloud), Google oder CalDAV. Home Assistant liefert alle einheitlich.

## Aussehen anpassen (Theme / card-mod)

Die Karte übernimmt automatisch Farben & Schrift des Themes. Für Feintuning gibt es zusätzlich eigene CSS-Variablen, die du im **Theme** oder per **card-mod** überschreiben kannst:

| Token | Default | Wirkung |
|-------|---------|---------|
| `--fb-accent` | `--primary-color` | „Heute"-/Akzentfarbe |
| `--fb-now-color` | `--error-color` | Jetzt-Linie & Fortschritt |
| `--fb-radius` | `7px` | Ecken der Termin-Blöcke |
| `--fb-radius-sm` | `5px` | Ecken der Chips |
| `--fb-avatar-size` | `34px` | Avatar-Größe |
| `--fb-past-opacity` | `0.5` | Deckkraft vergangener Termine |
| `--fb-title-size` | `16px` | Kartentitel |
| `--fb-name-size` | `13px` | Personennamen |
| `--fb-event-size` | `11.5px` | Termin-Titel |
| `--fb-time-size` | `9.5px` | Uhrzeiten im Block |
| `--fb-chip-size` | `10.5px` | Chip-Schriftgröße |
| `--fb-hourline` / `--fb-halfhour` / `--fb-row-shade` | – | Rasterlinien / Zeilenschattierung |
| `--fb-col-min` | `120px` | Mindestbreite einer Personenspalte |
| `--fb-axis-width` | `56px` | Breite der Zeitachse links |
| `--fb-board-max-height` | `58vh` | Höhen-Deckel des Tages-Boards (ohne `full_height`) |
| `--fb-event-pad` | `4px 7px` | Innenabstand der Termin-Blöcke |
| `--fb-head-pad` | `10px 6px` | Innenabstand der Personen-Köpfe |

Beispiel (card-mod):

```yaml
type: custom:family-board-card
card_mod:
  style: |
    :host {
      --fb-accent: #e91e63;
      --fb-event-size: 13px;
      --fb-radius: 12px;
      --fb-avatar-size: 40px;
    }
persons: …
```

## Entwicklung

```bash
npm install
npm run build        # baut dist/ha-family-board-card.js
npm run watch        # Rebuild bei Änderungen
npm run lint         # tsc --noEmit (Typecheck)
npm test             # Vitest (Event-Logik)
npm run format       # Prettier
```

Schneller Loop gegen die laufende HA-Instanz: `dist/ha-family-board-card.js` nach `config/www/` kopieren und die Seite hart neu laden.

Die fehleranfällige Event-Logik (Splitting über Mitternacht, Ganztags-Exklusivität, Zeitzonen, Überlappungs-Layout) liegt isoliert in [`src/events.ts`](src/events.ts) und ist über [`src/events.test.ts`](src/events.test.ts) abgedeckt.

## Termine anlegen / bearbeiten / löschen

In der Tagesansicht eine freie Stelle in der Personenspalte anklicken (oder das **＋** im Spaltenkopf) öffnet den Dialog zum Anlegen; ein Klick auf einen Termin öffnet ihn zum Bearbeiten/Löschen. Ob das möglich ist, hängt vom Kalender ab: Die Karte liest `supported_features` der jeweiligen `calendar.*`-Entität und blendet Schreibaktionen aus, wenn der Kalender sie nicht unterstützt. Intern werden die WebSocket-Kommandos `calendar/event/create|update|delete` genutzt (dieselben wie die native HA-Kalenderoberfläche).

## Roadmap

- [x] Termine anlegen/bearbeiten/löschen, nur bei schreibbaren Kalendern
- [x] Personen-Editor im visuellen Config-Editor
- [x] Wochen-Navigation & Nebeneinander-Layout überlappender Termine
- [x] Mehrsprachigkeit (i18n, DE/EN) + Locale-Zeitformat
- [ ] Orts-/Konflikterkennung (z. B. „niemand zuhause", Abhol-Lücken)
- [ ] Kiosk-/Wandtablet-Modus
- [ ] Aufnahme in den offiziellen HACS-Store ([Anleitung](docs/HACS_STORE.md))

## Lizenz

MIT
