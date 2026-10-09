# Family Board Card – notes for Claude

Home Assistant Lovelace card (HACS): a family calendar board with people as
columns. Maintainer: renespeaker. Sister project: Family Task Card
(`renespeaker/ha-family-task-card`).

## Working with the maintainer
- Talk to the maintainer in **German**. Commit messages may be German.
- Show drafts of anything posted on GitHub (issue replies, comments) **before**
  posting. Open PRs, merge and release only when asked.
- The maintainer publishes releases. Claude prepares notes and verifies the
  result afterwards; see the `release` skill.
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
- New features get tests; verify a test bites by briefly breaking the code.
- New views/options are opt-in so existing boards don't change.

## Open items
- PR #57 (TypeScript 7): on hold until `@rollup/plugin-typescript` supports TS 7
  (12.3.0 does not). Check `npm view @rollup/plugin-typescript version`.
