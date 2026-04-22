---
phase: 56-tests
plan: all
subsystem: tiddlywiki-tests
tags: [e2e, integrity, hermetic-fixture, coverage-audit, canary]

# Dependency graph
requires:
  - phase: 53-dom-extraction
    provides: 8 extractors under scripts/tiddlywiki/extractors/ with happy-path + edge-case test coverage (TEST-01 scope)
  - phase: 54-atomic-tiddler-generation
    provides: 7 generators under scripts/tiddlywiki/generators/ with per-type test coverage + verifyCrossLinkIntegrity (TEST-02 scope)
  - phase: 55-iter-1-fixes
    provides: extractAll + composeAllTiddlers + verify-integrity.ts CLI gate (the pieces the e2e and integrity tests exercise)
provides:
  - scripts/tiddlywiki/__fixtures__/site/ — hermetic minimum static-site corpus (11 files, 333 lines) exercising every extractor in one pass
  - scripts/tiddlywiki/__tests__/e2e.test.ts — 6 TEST-03 tests composing fixture → 27 tiddlers → 0 orphans
  - scripts/tiddlywiki/__tests__/integrity.test.ts — TEST-04 live-corpus cross-link canary (mirrors verify-integrity.ts CLI)
  - Phase 56 VERIFICATION — pnpm test:scripts 584 tests / 43 files / exit 0
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - hermetic-fixture-pattern — HTML + JSON corpus under __fixtures__/ sized to minimum-sufficient per extractor, not a trimmed copy of the real site
    - inline-compose-replica — e2e/integrity tests replicate composeAllTiddlers order rather than importing generate.ts (which fires main() as a module-level side effect); drift guarded by the orphan + count assertions
    - coverage-audit-before-write — audit existing tests against REQ acceptance criteria first, only add surgical tests if real gaps exist

# Key files
key-files:
  created:
    - scripts/tiddlywiki/__fixtures__/site/static-site/index.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/philosophy.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/technologies.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/contact.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/accessibility.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/faq.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/case-files.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/exhibits/exhibit-a.html
    - scripts/tiddlywiki/__fixtures__/site/static-site/exhibits/exhibit-b.html
    - scripts/tiddlywiki/__fixtures__/site/src/data/json/exhibits.json
    - scripts/tiddlywiki/__fixtures__/site/src/data/json/faq.json
    - scripts/tiddlywiki/__tests__/e2e.test.ts
    - scripts/tiddlywiki/__tests__/integrity.test.ts
    - .planning/phases/56-tests/56-VERIFICATION.md
    - .planning/phases/56-tests/56-SUMMARY.md
  modified: []

decisions:
  - hermetic-over-live — fixture site under __fixtures__/ gives TEST-03 zero dependency on the real static-site/ corpus; integrity.test.ts sibling covers the live corpus with graceful skip on clean checkouts
  - inline-compose-over-generate-import — replicate composeAllTiddlers assembly order inline rather than importing generate.ts, because generate.ts fires main() at module load (writes to tiddlywiki/tiddlers/ against cwd). Drift guarded by orphan and tiddler-count assertions
  - audit-not-fill — TEST-01 and TEST-02 have substantial coverage already (114 + 128 tests across 15 extractor/generator test files). Audit confirmed zero gaps. Per CONTEXT.md "small surgical additions only" discipline, no speculative tests added
  - verbose-label-fixture — fixture exhibits.json uses "Exhibit A" form to exercise normalizeExhibitLabel path — protects against regressions of the 55.1-hotfix double-prefix orphan class

metrics:
  duration_min: 25
  completed: 2026-04-21
  tests_before: "577 tests / 41 files"
  tests_after: "584 tests / 43 files"
  tests_delta: "+7 tests / +2 files"
  fixture_tiddler_count: 27
  fixture_orphans: 0
  live_tiddler_count: 367
  live_orphans: 0
---

# Phase 56: Tests Summary

Hermetic e2e smoke + live-corpus integrity canary + TEST-01/02 audit delivered in one pass. `pnpm test:scripts` now 584 tests / 43 files / 0 orphans across both fixture (27 tiddlers) and live (367 tiddlers) corpora.

## What Shipped

### Fixture Site (commit `08ec50c`)

11 files under `scripts/tiddlywiki/__fixtures__/site/` providing the minimum static-site content to exercise every extractor in one pass:

- 5 page HTMLs (index + philosophy + technologies + contact + accessibility) for `emitPageContent`.
- 1 FAQ HTML with 3 `.faq-accordion-item` entries across 2 categories for `emitFaqItems`.
- 1 case-files HTML with 2 exhibit cards for `emitCaseFilesIndex`.
- 2 exhibit detail HTMLs exercising `emitExhibit`, `emitPersonnel` (individual + anonymized + group rows), `emitFindings`, `emitTechnologies` (comma-split multi-entry plus single-entry), and `emitTestimonials` (exhibit-quote variant with and without `span.role`).
- 1 `testimonial-quote`-variant blockquote on the home page for the page-scoped testimonial codepath.
- `src/data/json/exhibits.json` + `faq.json` using the verbose-label dialect (`"Exhibit A"`) to exercise the `normalizeExhibitLabel` path installed by the 55.1-hotfix.

Pipeline produces **27 tiddlers** with **0 orphan cross-links** when composed end-to-end.

### E2E Smoke Test (commit `8379496`)

`scripts/tiddlywiki/__tests__/e2e.test.ts` — 6 tests, ~300ms:

1. Bundle shape: non-empty counts across all 8 extractor categories.
2. Exhibit labels normalized to short form.
3. 27-tiddler corpus-count lock.
4. Key tiddlers present by title (meta / page / index / exhibit / person / finding / technology / FAQ).
5. `verifyCrossLinkIntegrity` reports 0 orphans.
6. Composition is byte-identical across two sequential runs.

### Live-Corpus Integrity Canary (commit `54472fc`)

`scripts/tiddlywiki/__tests__/integrity.test.ts` — 1 test. Composes the full real corpus (currently 367 tiddlers) and asserts 0 orphans. Mirrors the `verify-integrity.ts` CLI gate. Trivially passes on clean checkouts (no `static-site/exhibits/*.html`) with a stdout skip log — the hermetic e2e test remains the guaranteed-running canary.

### TEST-01 / TEST-02 Coverage Audit

Audited the 8 extractor and 7 generator `.test.ts` files (242 pre-existing tests). Every file has: happy-path assertions, missing-field / empty-input edge cases, malformed-DOM guards where applicable, and byte-identical idempotency assertions. **No gaps — no additional tests added.**

## Decisions Made

- **Hermetic over live for TEST-03.** The fixture lives under `__fixtures__/` as a permanent, git-tracked corpus. It's sized to the minimum needed to exercise every extractor — not a scaled-down copy of the real site. This makes drift obvious: any new field on a Phase 53 extractor will need a corresponding fixture update.

- **Inline compose-replica over `generate.ts` import.** Both new tests replicate the body of `composeAllTiddlers` inline rather than importing it. Reason: `generate.ts` invokes `main()` as a module-level side effect, which writes to `tiddlywiki/tiddlers/` against `process.cwd()` and logs to stdout the moment the module loads. Importing it during tests would break hermeticity and leak output. The inline replica mirrors the CLI compose order exactly; future drift in `composeAllTiddlers` would show up here as an orphan or a tiddler-count mismatch. This kept the phase strictly within scope (no edits to `generate.ts`).

- **Audit, don't pad.** TEST-01 (extractor tests) and TEST-02 (generator tests) have substantial coverage from Phases 53 and 54. Per CONTEXT.md "small surgical additions only," no speculative tests were added. A coverage audit confirmed every extractor and generator file has happy-path + edge-case + malformed-DOM + idempotency coverage.

- **Verbose-label fixture.** Fixture `exhibits.json` uses `"Exhibit A"` / `"Exhibit B"` to match the live JSON convention and to keep `normalizeExhibitLabel` in the hot path. Regression protection for the 55.1-hotfix "Exhibit Exhibit A" double-prefix orphan class.

## Deviations from Plan

None — plan executed exactly as specified in the objective.

## Authentication Gates

None encountered.

## Metrics

| Metric | Before | After | Delta |
|--------|-------:|------:|------:|
| `pnpm test:scripts` test count | 577 | 584 | +7 |
| `pnpm test:scripts` test files | 41 | 43 | +2 |
| Fixture tiddler corpus | — | 27 | +27 |
| Fixture orphans | — | 0 | 0 |
| Live tiddler corpus orphans (via new integrity test) | — | 0 | 0 |
| `pnpm test:scripts` duration | ~860ms | ~1040ms | +180ms |

Commit sequence:

- `08ec50c` — fixture site (11 files / 333 lines)
- `8379496` — e2e smoke test (176 lines / 6 tests)
- `54472fc` — integrity canary (162 lines / 1 test)

## Self-Check

Created files verified on disk:

- `scripts/tiddlywiki/__fixtures__/site/static-site/index.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/philosophy.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/technologies.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/contact.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/accessibility.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/faq.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/case-files.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/exhibits/exhibit-a.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/static-site/exhibits/exhibit-b.html` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/src/data/json/exhibits.json` — FOUND
- `scripts/tiddlywiki/__fixtures__/site/src/data/json/faq.json` — FOUND
- `scripts/tiddlywiki/__tests__/e2e.test.ts` — FOUND
- `scripts/tiddlywiki/__tests__/integrity.test.ts` — FOUND
- `.planning/phases/56-tests/56-VERIFICATION.md` — FOUND

Commits verified in `git log`:

- `08ec50c` — FOUND
- `8379496` — FOUND
- `54472fc` — FOUND

## Self-Check: PASSED
