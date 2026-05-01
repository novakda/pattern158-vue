---
phase: 55
phase_name: Iter-1 Fixes
status: passed
verified_at: 2026-04-22
hotfix_applied: 2026-04-22
---

# Phase 55 Verification

## Status: PASSED (after 55.1-hotfix)

FIX-01..04 delivered end-to-end on disk. The phase-close **integrity HARD GATE now passes**: `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` reports 0 orphaned links across 367 tiddlers.

The 267 orphaned `[[Exhibit Exhibit <letter>]]` links originally reported were resolved by the 55.1-hotfix documented in `55-HOTFIX-SUMMARY.md` — two coordinated changes in `extract-all.ts` and `sources.ts` that aligned the exhibit label dialect across the extractor/generator boundary without touching `extractors/` or `generators/`.

## Smoke Gates

| Gate | Command | Result |
|------|---------|--------|
| Build | `pnpm build` | exit 0 |
| Scripts tests | `pnpm test:scripts --run` | exit 0 — 577 tests / 41 files passed (up from 564 pre-hotfix; +13 tests for normalize helper + exhibit-title shape + cross-link lookup) |
| Generate | `pnpm tiddlywiki:generate` | exit 0 — 367 tiddlers composed, 343 .tid files on disk |
| Tiddler count | `ls tiddlywiki/tiddlers/ \| wc -l` | 343 (threshold ≥ 100 — passed 3.4×) |
| Integrity | `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` | **exit 0 — 0 orphaned link(s)** |

## Requirements Coverage

| REQ ID | Covered By | Status | Evidence |
|--------|-----------|--------|----------|
| FIX-01 | Plan 55-03 | Delivered on disk | `grep -l "! Personnel" tiddlywiki/tiddlers/Exhibit*.tid \| wc -l` → 14 (every exhibit tiddler now emits a Personnel footer) |
| FIX-02 | Plan 55-02 | Delivered on disk | `grep -q "^!! " tiddlywiki/tiddlers/Philosophy.tid` → 0; `grep -q "<h[1-6]" tiddlywiki/tiddlers/Home.tid` → 1 (no HTML heading bleed) |
| FIX-03 | Plan 55-05 | Delivered on disk | `grep -l "! Related questions" tiddlywiki/tiddlers/*.tid \| wc -l` → 24 |
| FIX-04 | Plan 55-06 | Delivered on disk | `grep -q "\|!Date \|!Client \|!Type \|!Case \|" "tiddlywiki/tiddlers/Case Files Index.tid"` → 0 (present) |

All four FIX REQs have on-disk evidence from their respective plans. Each produced artifact individually verified. Phase-wide **integrity** gate, however, is red — orphan links surfaced cross-module.

## Integrity Audit

**verifyCrossLinkIntegrity orphan count: 0 (post-hotfix)**

**Pre-hotfix state (historical):** 267 orphans across 235 tiddlers, 14 unique missing targets of shape `"Exhibit Exhibit <letter>"`.

**Fix summary (see `55-HOTFIX-SUMMARY.md` for details):**

- `scripts/tiddlywiki/extract-all.ts` — added `normalizeExhibitLabel(raw)` helper; strips a leading `"Exhibit "` prefix. Applied inside the exhibit-iteration loop so `bundle.exhibits[*].label`, `sourceExhibitLabel` on every personnel/finding/technology entry, and `sourcePageLabel` on exhibit testimonials all use the short form (`"A"`). The live static-site HTML's `.exhibit-label` carries `"Exhibit A"`; normalization converts it back to `"A"` before threading downstream.
- `scripts/tiddlywiki/sources.ts` — `exhibitsToTiddlers` now emits title `"Exhibit A"` (not `"Exhibit A — <marketing title>"`), and moves the marketing title into the body as a top-level heading. `byLabel` lookup key normalized to short form so verbose JSON labels still resolve. `caseFilesIndexTiddler` changed to a 5-column table — marketing title moved from the link text to a dedicated `!Title` column so the `!Case` column can be the unpiped `[[Exhibit A]]` link (the integrity-check regex uses the pre-pipe segment as its resolution target; pretty-link form would orphan). `defaultLinkMap` updated to point `/exhibits/<letter>` to the new short-form tiddler title.

**Phase 53/54 boundary held.** Changes live exclusively in `extract-all.ts` and `sources.ts` (both Phase 55 scope). `extractors/` and `generators/` directories unchanged.

See `55-HOTFIX-SUMMARY.md` for root-cause analysis, change inventory, and test evidence. `55-ORPHAN-REPORT.md` now carries a `RESOLVED` annotation at the top.

## Phase Boundary Confirmation

`git diff --name-only` audit for `scripts/tiddlywiki/` against pre-Plan-55 baseline:

**UNCHANGED this plan (Plan 55-07 scope boundary):**

- `scripts/tiddlywiki/extractors/` — 0 files changed
- `scripts/tiddlywiki/generators/` — 0 files changed
- `scripts/tiddlywiki/html-to-wikitext.ts` — 0 files changed
- `scripts/tiddlywiki/tid-writer.ts` — 0 files changed
- `scripts/tiddlywiki/sources.ts` — 0 files changed (this plan only)
- `scripts/tiddlywiki/sources.test.ts` — 0 files changed (this plan only)
- `scripts/tiddlywiki/extract-all.ts` — 0 files changed (this plan only)
- `scripts/tiddlywiki/page-content-to-tiddlers.ts` — 0 files changed (this plan only)

**MODIFIED across Phase 55 (Plan-ownership table):**

| File | Owning Plan(s) | Status |
|------|---------------|--------|
| `scripts/tiddlywiki/extract-all.ts` (new) | 55-01 | Created |
| `scripts/tiddlywiki/extract-all.test.ts` (new) | 55-01 | Created |
| `scripts/tiddlywiki/page-content-to-tiddlers.ts` (new) | 55-02 | Created |
| `scripts/tiddlywiki/page-content-to-tiddlers.test.ts` (new) | 55-02 | Created |
| `scripts/tiddlywiki/generate.ts` | 55-02, 55-03, 55-04, 55-05, **55-07** | Modified (this plan: `composeAllTiddlers` extracted + exported) |
| `scripts/tiddlywiki/sources.ts` | 55-03, 55-05, 55-06 | Modified (not this plan) |
| `scripts/tiddlywiki/sources.test.ts` (new) | 55-03, 55-05, 55-06 | Created (not this plan) |
| `scripts/tiddlywiki/verify-integrity.ts` (new) | **55-07** | Created this plan |
| `tsconfig.scripts.json` | 55-03, **55-07** | Modified (this plan: `verify-integrity.ts` added to excludes) |

Phase boundary held — no touch to extractors/ or generators/ or to the iter-1 HTML-to-wikitext converter.

## Known Follow-ups

- **55.1-hotfix delivered 2026-04-22.** Integrity gate now green. See `55-HOTFIX-SUMMARY.md`.
- **Phase 56 TEST-01..04** — dedicated test hardening (regression fixtures, byte-identical-across-runs assertion). The verify-integrity script from this plan is now a permanent CI gate (currently exits 0).
- **Phase 58** — retire `html-to-wikitext.ts` on disk (currently unreachable from the default path; module kept per CONTEXT.md locked refactor-don't-rewrite clause).

## Next Phase

**Phase 55 is CLOSED.**

- [x] Hotfix resolved the 14 unique-target orphan set (fix lived in Phase 55 scope; no extractor/generator edits).
- [x] `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` exits 0 on the live corpus.
- [x] This document status flipped `failed` → `passed`; `55-ORPHAN-REPORT.md` annotated RESOLVED.
- [ ] Then: Phase 56 — Tests (TEST-01..04).

---

*Plan: 55-07 (hotfix: 55.1)*
*Verified: 2026-04-22*
*Hotfix applied: 2026-04-22*
*Smoke gate machinery: in place and green*
