---
name: release
description: Release workflow for the Family Board Card — version bump, PR, merge, English release notes, and verifying the published release (tag, workflow, bundle asset). Use when the user asks to release, publish, "live bringen", bump the version, or write release notes.
---

# Release workflow

The user publishes GitHub releases themselves. Claude prepares everything up to
that point and verifies the result afterwards. Claude cannot edit a published
release, so the notes must be final before the user clicks "Publish".

## 1. Prepare the version (on the `claude/*` working branch)

Only `claude/*` branches can be pushed. Never push to `main` directly.

1. Pick the version (semver): fix → patch, new option/feature → minor.
2. Bump it in **all** places (they must match):
   - `package.json` → `"version"`
   - `package-lock.json` → top-level `"version"` and `packages[""].version`
   - `src/ha-family-board-card.ts` → console banner `"%c FAMILY-BOARD-CARD %c vX.Y.Z "`
3. Rebuild and commit the bundle — `dist/ha-family-board-card.js` is tracked
   because HACS serves it from the release:
   ```bash
   rm -rf dist && npm run build
   ```
   Delete `dist` first so a failed build can never leave a stale bundle that
   looks fine.
4. Run the full gate; everything must be green before the PR:
   ```bash
   npm run lint && npm run format:check && npm test && npm run build
   npm run check:browser   # Playwright checks, needs /opt/pw-browsers/chromium
   ```
5. Commit (German commit messages are fine), push with
   `git push -u origin <branch>`.

## 2. PR and merge

- Open the PR only when the user asks. Title/body in English, neutral and
  feature-focused.
- Merge only after the user says so (squash merge), and only with green checks.

## 3. Release notes (hand to the user before they publish)

Write them in **English**, Markdown, ready to paste. Template:

```markdown
## <emoji> <Headline of the main change>

<1–2 sentences: what users get.>

### <Feature / Fix>
- what changed, how to enable it (`option: value`), visual editor mention

### 🐛 Fixed: <short title> (#<issue>)
<what users saw, what happens now>

---
All green: build, lint, format, <N> tests, <M> browser checks, HACS validate.
```

Tell the user: tag `vX.Y.Z` on `main`, release title `vX.Y.Z`, paste notes,
Publish.

## 4. Verify after the user publishes

1. `get_release_by_tag` → release exists, not draft, tag on the merge commit.
2. The **Release** workflow run for that tag succeeded (`actions_list`).
3. The release has the asset `ha-family-board-card.js`; compare its size with
   the local `dist/` build.
4. If an issue is fixed by this release: reply on it (show the draft to the
   user first) and close it with `state_reason: completed`.

## Rules for anything public (PRs, release notes, README, issue replies)

- Neutral and feature-focused. Never say a feature was taken or copied from
  another project.
- No version indicator inside the card UI (the console banner is fine).
- The board and the Family Task Card are independent: separate versions and
  releases, no runtime dependency on each other. The other card may only be
  mentioned as a hint.
- Docs are English-first (`README.md`); keep `README.de.md` in sync.
- No marketing posts (forums, Reddit) unless the user asks.
- Never include a model name in commits, PRs or release notes.
