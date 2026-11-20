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
- **Styles / themes.** Work in progress on branch `claude/clever-brown-nhu10w`
  (commit "WIP: Stil-Vorlagen …"): `style` (classic, paper, bold, pastel,
  glass, contrast), `palette`, `accent_color`, `now_color`,
  `background_color` (text colour follows the background), an editor section
  "Look" with style tiles, palettes and colour swatches, tests and per-style
  browser checks. The plumbing is done; the maintainer found the looks too
  plain. Plan: richer, complete designs drawn as small SVG/CSS scenes – no
  bundled or hot-linked photos (size, privacy, licences) – e.g. Blueprint,
  Planner, Aurora, Concrete & Wood, Night, plus an own `background_image`
  (`/local/…` or the media folder). Show screenshots before releasing.
  Also: the README still only names card-mod; mention UIX, its successor.
- **Companion app – chosen by the maintainer (next candidates, ask before building):**
  1. *Pin board* (`todo.*` list as sticky notes on the wall, anyone adds from
     the phone/voice, tap = done) – card only, no push rights.
  2. *Plan vs. reality* – from the `person.*` history: "Mia arrived at school
     07:52", "Ben home since 17:10"; in the timeline next to the plan.
  3. *ETA on the person header* – "Ben – home in 12 min" from a travel-time
     or proximity entity.
  4. *"When are you home?" with text reply* – the answer from the
     notification ("18:30, traffic") shows as a chip on the wall tablet.
  5. *Pick-up countdown* – Android chronometer notification "pick up Mia in
     14:59", cleared when the driver leaves.
  6. *Message to the wall from the phone* – shown big on the tablet, as a
     toast or on the screensaver (the reverse of the ping button).
  4–6 need the board to receive app events (see the open question below) or
  a shipped automation blueprint.
- **Companion app – backlog:** do-not-disturb (iOS focus / Android DND)
  shown as 🔕 and respected by the ping button; QR code in the event dialog
  (navigation / add to own calendar); phone layout and haptics inside the
  app; kids' phone battery via `badges` as a README recipe; morning briefing
  per person as a blueprint; SOS button only with a clear "no emergency-call
  replacement" note; editor finds each person's `notify.mobile_app_*` from
  the person's device trackers.
- **Companion app.** Ideas: per person a `notify.mobile_app_*` service;
  a "ping" button on the wall tablet with topics (dinner's ready, call me,
  bring milk, when are you home?) and answer buttons sent back to the board;
  rides as push with "I'll do it / can't" (can't → "no driver" alert);
  the still-at-home warning as push; "send event to phone"; next alarm on the
  night screen; phone layout inside the app. Open question: may a non-admin
  user subscribe to `mobile_app_notification_action`? Else ship an
  automation blueprint.
