---
phase: 55
phase_name: Iter-1 Fixes
status: failed
verified_at: 2026-04-22
---

# Phase 55 Verification

## Status: FAILED

FIX-01..04 delivered end-to-end on disk (all four per-plan smoke-checks green). The phase-close **integrity HARD GATE fails**: `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` reports 267 orphaned `[[Exhibit Exhibit <letter>]]` links across 235 atomic tiddlers. Root cause crosses the Phase 53/54 boundary — fix is NOT in Plan 55-07 scope. See `55-ORPHAN-REPORT.md` for the full diagnostic and recommended hotfix options.

Phase 55 cannot close until the upstream fix lands and the integrity gate exits 0.

## Smoke Gates

| Gate | Command | Result |
|------|---------|--------|
| Build | `pnpm build` | exit 0 |
| Scripts tests | `pnpm test:scripts --run` | exit 0 — 564 tests / 41 files passed |
| Generate | `pnpm tiddlywiki:generate` | exit 0 — 367 tiddlers composed, 344 .tid files on disk |
| Tiddler count | `ls tiddlywiki/tiddlers/ \| wc -l` | 344 (threshold ≥ 100 — passed 3.4×) |
| Integrity | `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` | **exit 1 — 267 orphaned link(s) across 235 tiddler(s)** |

## Requirements Coverage

| REQ ID | Covered By | Status | Evidence |
|--------|-----------|--------|----------|
| FIX-01 | Plan 55-03 | Delivered on disk | `grep -l "! Personnel" tiddlywiki/tiddlers/Exhibit*.tid \| wc -l` → 14 (every exhibit tiddler now emits a Personnel footer) |
| FIX-02 | Plan 55-02 | Delivered on disk | `grep -q "^!! " tiddlywiki/tiddlers/Philosophy.tid` → 0; `grep -q "<h[1-6]" tiddlywiki/tiddlers/Home.tid` → 1 (no HTML heading bleed) |
| FIX-03 | Plan 55-05 | Delivered on disk | `grep -l "! Related questions" tiddlywiki/tiddlers/*.tid \| wc -l` → 24 |
| FIX-04 | Plan 55-06 | Delivered on disk | `grep -q "\|!Date \|!Client \|!Type \|!Case \|" "tiddlywiki/tiddlers/Case Files Index.tid"` → 0 (present) |

All four FIX REQs have on-disk evidence from their respective plans. Each produced artifact individually verified. Phase-wide **integrity** gate, however, is red — orphan links surfaced cross-module.

## Integrity Audit

**verifyCrossLinkIntegrity orphan count: 267 (across 235 tiddlers)**

**Unique missing targets (14):**

```
Exhibit Exhibit A
Exhibit Exhibit B
Exhibit Exhibit C
Exhibit Exhibit D
Exhibit Exhibit E
Exhibit Exhibit F
Exhibit Exhibit G
Exhibit Exhibit H
Exhibit Exhibit I
Exhibit Exhibit J
Exhibit Exhibit K
Exhibit Exhibit L
Exhibit Exhibit M
Exhibit Exhibit N
```

**Orphan-shape diagnosis (short form — full text in `55-ORPHAN-REPORT.md`):**

- Every orphan is a `[[Exhibit Exhibit <letter>]]` link emitted by a Phase 54 atomic generator (`person.ts`, `finding.ts`, `technology.ts`, `testimonial.ts` via `helpers.formatExhibitTitle`).
- `formatExhibitTitle(label)` assumes short labels (`"A"`) and prefixes `"Exhibit "`. Plan 55-01's `extract-all.ts` populates `sourceExhibitLabel` with verbose DOM-extracted labels (`"Exhibit A"`). Composition yields `"Exhibit Exhibit A"`.
- Additionally, `exhibitsToTiddlers` builds exhibit tiddler titles as `"Exhibit A — <marketing title>"`, so no tiddler named simply `"Exhibit A"` exists on disk either — fixing the double-prefix alone is not sufficient.

**Fix location crosses Phase 53/54 boundary.** Plan 55-07 explicitly forbids modifying `scripts/tiddlywiki/extractors/` or `scripts/tiddlywiki/generators/`. Surfacing to developer per plan's orphan-handling policy. Recommended hotfix: add thin alias tiddlers per exhibit (Option C in ORPHAN-REPORT) — does not require extractor/generator edits.

See `55-ORPHAN-REPORT.md` for full root-cause analysis, fix options, and next actions.

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

- **HOTFIX REQUIRED — orphan resolution.** See `55-ORPHAN-REPORT.md`. Recommended: Option C (alias tiddlers) — cheapest, no Phase 53/54 module touch. Authoring as a Phase 55.1-hotfix or rolling into Phase 56 TEST work.
- **Phase 56 TEST-01..04** — dedicated test hardening (regression fixtures, byte-identical-across-runs assertion). The verify-integrity script from this plan becomes a permanent CI gate.
- **Phase 58** — retire `html-to-wikitext.ts` on disk (currently unreachable from the default path; module kept per CONTEXT.md locked refactor-don't-rewrite clause).

## Next Phase

**Phase 55 is NOT ready to close.** Required sequence:

1. Hotfix plan authored to resolve the 14 unique-target orphan set.
2. `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` must exit 0 on the live corpus.
3. This document amended status `failed` → `passed`; `55-ORPHAN-REPORT.md` archived.
4. Then: Phase 56 — Tests (TEST-01..04).

---

*Plan: 55-07*
*Verified: 2026-04-22*
*Smoke gate machinery: in place; hotfix needed to turn gate green*
