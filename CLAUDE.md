# Family Board Card – notes for Claude

Home Assistant Lovelace card (HACS): a family calendar board with people as
columns. Maintainer: renespeaker. Sister project: Family Task Card
(`renespeaker/ha-family-task-card`).

## Working with the maintainer
- Talk to the maintainer in **German**. Commit messages may be German.
- Show drafts of anything posted on GitHub (issue replies, comments) **before**
  posting. Open PRs, merge and release only when asked.
- The maintainer publishes releases. Claude prepares notes and verifies the
  result afterwards; see the `release` skill. Hand over link, title and notes
  as separate code blocks, ready to copy.
- If you suggest an idea, check the code first – several "new" ideas already
  existed (`show_focus`, `weather_entity`).

## Rules for anything public (README, PRs, release notes, issue replies)
- English first: `README.md` is English, `README.de.md` German – keep both in sync.
- Neutral and feature-focused. Never say a feature was taken from another project.
- No version indicator inside the card UI (the console banner is fine).
- No marketing posts (forums, Reddit) unless asked.
- No model names in commits, PRs or release notes.

## Board and Task Card are independent
Users may run only the board, only the task card, or both. Neither may depend
on the other at runtime – only on HA entities (`person.*`, `calendar.*`,
`todo.*`, `weather.*`). Separate versions and releases; the other card may only
be mentioned as a hint. `src/shared/person-palette.ts` is mirrored in both repos;
`npm run check:shared` warns (never fails) if they drift.

## Code map
- `src/ha-family-board-card.ts` – the card (views: now, day, timeline, week,
  month, agenda; dialog; drag & drop; styles).
- `src/companion.ts` – pure helpers for the companion app (notify calls,
  wall messages, presence spans, ETA). `blueprints/automation/` – the
  automation template that writes phone answers into `message_entity`
  (non-admin users may not subscribe to `mobile_app_notification_action`).
- `src/events.ts` – pure date/event logic. Do date math with `addDays` /
  `daysBetween` (calendar days), never `+ 24h`: DST bugs (#62) came from that.
- `src/editor.ts`, `src/editor-i18n.ts` – visual editor, fully EN/DE.
- `src/localize.ts` – card strings EN/DE.
- `dist/ha-family-board-card.js` – committed bundle; rebuild with `rm -rf dist && npm run build`.

## Checks
- `npm run lint`, `npm run format:check`, `npm test` (Vitest, runs in
  `Europe/Berlin` on purpose so DST bugs show up), `npm run build`.
- `npm run check:browser` – real-browser layout, axe-core accessibility and
  keyboard checks (`tools/preview/`, Chromium at `/opt/pw-browsers/chromium`).
  Not in CI; run it before every release.
- `npm run screenshots` – regenerates every README image (`docs/preview-*.png`,
  English and German) from the harness with a fixed date. Run it after a
  visible change and look at the images before committing them.
- New features get tests; verify a test bites by briefly breaking the code.
- New views/options are opt-in so existing boards don't change.

## Open items
- PR #57 (TypeScript 7): on hold until `@rollup/plugin-typescript` supports TS 7
  (12.3.0 does not). Check `npm view @rollup/plugin-typescript version`.

## Backlog (on hold – the maintainer wants to think it through first)
Do not start these without asking.
- **Styles / themes.** The WIP was taken out of v0.35.0 by commit `1f13697`
  ("Revert WIP: Stil-Vorlagen …"); bring it back with `git revert 1f13697`
  (or cherry-pick `e688207`). It had: `style` (classic, paper, bold, pastel,
  glass, contrast), `palette`, `accent_color`, `now_color`,
  `background_color` (text colour follows the background), an editor section
  "Look" with style tiles, palettes and colour swatches, tests and per-style
  browser checks. The plumbing is done; the maintainer found the looks too
  plain. Plan: richer, complete designs drawn as small SVG/CSS scenes – no
  bundled or hot-linked photos (size, privacy, licences) – e.g. Blueprint,
  Planner, Aurora, Concrete & Wood, Night, plus an own `background_image`
  (`/local/…` or the media folder). Show screenshots before releasing.
  Also: the README still only names card-mod; mention UIX, its successor.
- **Companion app – done in v0.35.0:** pin board (`pinboard`), presence
  (`show_presence`: "since", timeline strip), ETA (`eta`), pings with answers
  (`notify` per person, `ping_topics`), wall messages (`message_entity`,
  `message_hours`, blueprint for answers), ride push (`ride_push`).
- **Companion app – backlog:** do-not-disturb (iOS focus / Android DND)
  shown as 🔕 and respected by the ping button; QR code in the event dialog
  (navigation / add to own calendar); phone layout and haptics inside the
  app; kids' phone battery via `badges` as a README recipe; morning briefing
  per person as a blueprint; SOS button only with a clear "no emergency-call
  replacement" note.
