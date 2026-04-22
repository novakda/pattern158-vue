---
phase: 55
plan: 55.1-hotfix
subsystem: tiddlywiki-generator
status: delivered
applied_at: 2026-04-22
resolves: 55-07 integrity HARD GATE (267 orphans → 0)
depends_on: 55-01 (extract-all.ts), 55-06 (caseFilesIndexTiddler)
key_files:
  modified:
    - scripts/tiddlywiki/extract-all.ts
    - scripts/tiddlywiki/extract-all.test.ts
    - scripts/tiddlywiki/sources.ts
    - scripts/tiddlywiki/sources.test.ts
  docs_updated:
    - .planning/phases/55-iter-1-fixes/55-VERIFICATION.md
    - .planning/phases/55-iter-1-fixes/55-ORPHAN-REPORT.md
metrics:
  tests_before: 564
  tests_after: 577
  tests_added: 13
  orphans_before: 267
  orphans_after: 0
  unique_missing_targets_before: 14
  unique_missing_targets_after: 0
---

# Phase 55.1-hotfix Summary — Orphan Link HARD GATE Green

Two coordinated edits inside Phase 55 scope closed the 267-orphan integrity gate failure without touching `scripts/tiddlywiki/extractors/` or `scripts/tiddlywiki/generators/`. Root cause was a label-dialect mismatch across the extractor/generator boundary — the live static-site HTML's `.exhibit-label` carries `"Exhibit A"` (verbose), but Phase 54 atomic generators call `formatExhibitTitle(label)` which unconditionally prefixes `"Exhibit "`, producing the `"Exhibit Exhibit A"` double-prefix orphan class.

## One-liner

Normalize verbose DOM-extracted exhibit labels to short form in `extract-all.ts`, and shorten `exhibitsToTiddlers` titles to `"Exhibit A"` in `sources.ts`, so `[[Exhibit A]]` cross-links emitted by Phase 54 atomic generators resolve to real tiddlers.

## Changes

### Change 1 — `scripts/tiddlywiki/extract-all.ts` + test

Added exported helper:

```ts
export function normalizeExhibitLabel(raw: string): string {
  const prefix = 'exhibit '
  if (raw.length > prefix.length && raw.slice(0, prefix.length).toLowerCase() === prefix) {
    return raw.slice(prefix.length)
  }
  return raw
}
```

Applied inside the per-exhibit loop so every downstream consumer speaks the short-form dialect:

- `bundle.exhibits[i].label` — rewritten via `{ ...exhibit, label: normalizeExhibitLabel(exhibit.label) }` before push.
- `sourceExhibitLabel` on personnel / findings / technologies — threaded from the normalized `label` local.
- `sourcePageLabel` on exhibit testimonials — formed as `\`Exhibit ${normalizedLabel}\``, producing `"Exhibit A"` (not `"Exhibit Exhibit A"`).

Tests added (6 new):
- `normalizeExhibitLabel — strips "Exhibit " prefix when present` (happy path, case-insensitive, empty-ish inputs, prefix-only guard)
- `extractAll — normalizes verbose DOM-extracted exhibit labels` (bundle.exhibits[i].label, personnel sourceExhibitLabel, testimonial sourcePageLabel — all asserting short form when HTML carries verbose label)

**Commit:** `da1ab69` `fix(55.1-hotfix): normalize verbose exhibit labels in extract-all`

### Change 2 — `scripts/tiddlywiki/sources.ts` + test

Imported `normalizeExhibitLabel` from `extract-all.ts` and applied it across three sites:

1. **`exhibitsToTiddlers` title:** changed from `\`${ex.label} — ${ex.title}\`` to `\`Exhibit ${normalizeExhibitLabel(ex.label)}\``. Marketing title moved into the body as a top-level `! <title>` heading — same information, link-compatible title shape.
2. **`exhibitsToTiddlers` byLabel lookup:** `byLabel.set(normalizeExhibitLabel(ex.label), ex)` so verbose JSON labels (`"Exhibit A"`) match the normalized bundle.exhibits[*].label (`"A"`). Cross-link footer continues to emit correctly.
3. **`caseFilesIndexTiddler`:** table shape changed from 4-column to 5-column. `!Case` column is now the unpiped `[[Exhibit A]]` link (the locked integrity-check regex uses the pre-pipe segment as its resolution target — pretty-link form would have orphaned). `!Title` column carries the marketing title as plain text.
4. **`defaultLinkMap`:** `/exhibits/<letter>` now points to `"Exhibit <letter>"` instead of `"<verbose-label> — <marketing-title>"`.

Tests updated + added (7 net new):
- `exhibitsToTiddlers — title is "Exhibit <label>" (no marketing suffix)` — short and verbose JSON label both yield `"Exhibit A"`
- `exhibitsToTiddlers — marketing title moves into body as top-level heading`
- `exhibitsToTiddlers — cross-link lookup tolerates verbose JSON labels` — asserts `[[Jane Doe]]` footer emits for verbose-label input
- `caseFilesIndexTiddler — header row` updated to expect 5-column header (`|!Date |!Client |!Type |!Case |!Title |`)
- Row-shape tests updated to expect `|... |[[Exhibit A]] |Sample |` instead of `|... |[[A — Sample]] |`
- Sort-order test updated to search for `[[Exhibit A]]`, `[[Exhibit B]]`, `[[Exhibit C]]`

**Commit:** `305f793` `fix(55.1-hotfix): shorten exhibit tiddler title to 'Exhibit <label>'`

## Evidence

| Gate | Command | Pre-hotfix | Post-hotfix |
|------|---------|------------|-------------|
| Build | `pnpm build` | exit 0 | exit 0 |
| Scripts tests | `pnpm test:scripts --run` | 564 / 41 files | 577 / 41 files |
| Generate | `pnpm tiddlywiki:generate` | exit 0 (367 tiddlers) | exit 0 (367 tiddlers) |
| **Integrity** | `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` | **exit 1 — 267 orphans** | **exit 0 — 0 orphans** |

Final integrity output:
```
[55-07] PASS: 367 tiddlers, 0 orphaned links.
```

## Deviations from fix_strategy

The strategy as written said "Keep `bundle.exhibits[i].label` as-is (verbose) for display purposes; only the cross-link field gets normalized." Following this literally would have broken the exhibit cross-link footer: `sources.ts:exhibitsToTiddlers` builds a `byLabel` Map keyed on `bundle.exhibits[i].label` and then filters in `buildExhibitCrossLinks` via `e.sourceExhibitLabel !== exhibit.label`. With `bundle.exhibits[i].label = "Exhibit A"` (verbose, unchanged) and `sourceExhibitLabel = "A"` (normalized), that comparison never matches — zero personnel/findings/technologies link to any exhibit, and FIX-01 regresses.

**Resolution:** normalized `bundle.exhibits[i].label` to the short form too, and normalized the `byLabel` lookup key on both sides in `sources.ts`. Result: every label-flowing field speaks the same short-form dialect from the extractor all the way through to the atomic generators. Documented in `extract-all.ts` comments. No regression in FIX-01..04 on-disk evidence (all four still green — verified via `grep -l "! Personnel" tiddlywiki/tiddlers/Exhibit*.tid`).

The strategy also said to use the marketing title as `!! <title>`-style heading in the body. I used `! <title>` (top-level) since the rest of the exhibit tiddler body uses `! Heading` for major sections. Same information, consistent heading hierarchy.

The strategy did not anticipate the `caseFilesIndexTiddler` link-target issue — its `[[${ex.label} — ${ex.title}]]` link targets would all orphan after the title shortening. My pretty-link (`[[display|target]]`) attempt also failed because `integrity-check.ts`'s locked regex treats the pre-pipe segment as the resolution target (phase 54 `pipe-form documented behavior` test). Resolution: reshape the table to 5 columns with the marketing title in its own cell and an unpiped short-form link.

## Scope Boundary Held

`git diff main~2 -- scripts/tiddlywiki/` shows only:
- `scripts/tiddlywiki/extract-all.ts`
- `scripts/tiddlywiki/extract-all.test.ts`
- `scripts/tiddlywiki/sources.ts`
- `scripts/tiddlywiki/sources.test.ts`

No files under `scripts/tiddlywiki/extractors/` or `scripts/tiddlywiki/generators/` were touched. Phase 53/54 boundary preserved.

## Self-Check

- [x] `normalizeExhibitLabel` exported from `extract-all.ts` and applied to all `sourceExhibitLabel` writes (personnel, findings, technologies; testimonial `sourcePageLabel` formed from normalized label).
- [x] `exhibitsToTiddlers` produces title `"Exhibit A"` (verified via test `exhibitsToTiddlers — title is "Exhibit <label>" (no marketing suffix)`).
- [x] `pnpm build` exit 0.
- [x] `pnpm test:scripts --run` exit 0, 577 tests passed.
- [x] `pnpm tiddlywiki:generate` exit 0, 367 tiddlers.
- [x] `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` exit 0, 0 orphans.
- [x] `55-VERIFICATION.md` status frontmatter flipped `failed` → `passed`.
- [x] `55-ORPHAN-REPORT.md` annotated `RESOLVED` at top, status `failed` → `resolved`.
