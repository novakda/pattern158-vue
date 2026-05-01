---
phase: 55-iter-1-fixes
plan: 01
subsystem: tiddlywiki-generator
tags: [tiddlywiki, extractor, orchestrator, static-site, faq, exhibits, pages, scaf-08, tdd]

# Dependency graph
requires:
  - phase: 53-iter-1-extractors
    provides: 8 DOM/JSON extractors (faq, exhibit, personnel, findings, technologies, testimonials, pages, case-files-index) + ExtractorError + parseHtml + entity type contracts
provides:
  - extractAll(projectRoot) — single entry point that orchestrates all 8 Phase 53 extractors against static-site/*.html + src/data/json/faq.json fallback
  - ExtractedBundle — typed bundle { faqItems, exhibits, personnelByExhibit, findingsByExhibit, technologiesByExhibit, testimonials, pages, caseFilesIndex } consumed by Plans 55-02..06
  - ExtractedPage — per-page wrapper { pageTitle, sourceHtmlPath, content: PageContent }
  - FAQ HTML-first / JSON-fallback policy (silent fall-through on extractor failure)
  - Missing-exhibit tolerance (skip without throwing when HTML file absent or emitExhibit throws)
  - exhibitLabelToFilename normalizer that handles both short ("A") and verbose ("Exhibit A") labels
affects: [55-02-page-wiring, 55-03-exhibit-crosslinks, 55-04-atomic-tiddlers, 55-05-faq-footer, 55-06-case-files-table, 55-07-smoke-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Sequential for-of across extractor invocations (SCAF-08 — no Promise.all)
    - readText helper swallows fs errors, returns null — caller decides whether to skip or fall back
    - Pure data-in/data-out orchestration — no tiddler assembly inside the extractor layer
    - Prose SCAF-08 header disclosure (no literal forbidden-token list in file headers)
    - Hermetic unit tests built in os.tmpdir() with afterEach rm cleanup

key-files:
  created:
    - scripts/tiddlywiki/extract-all.ts
    - scripts/tiddlywiki/extract-all.test.ts
  modified: []

key-decisions:
  - "exhibitLabelToFilename strips a leading 'exhibit-' slug prefix before reapplying it, so both short-label test fixtures ('A') and verbose live-data labels ('Exhibit A') resolve to the same static-site/exhibits/exhibit-<letter>.html filename."
  - "Homepage testimonials are collected with sourcePageLabel='Home' in the same testimonials array as exhibit testimonials (single flat list, polymorphic source label). Plan 55-04 will route on sourcePageLabel when building tiddlers."
  - "sourceExhibitLabel is threaded from exhibit.label (the DOM-extracted value), not from the JSON list — keeps the bundle internally consistent with what emitExhibit returns."
  - "FAQ fallback is silent: emitFaqItems throwing ExtractorError is caught, not surfaced. Matches the Phase 53 VERIFICATION line 60 fallback policy."

patterns-established:
  - "Orchestrator layer: one file per phase-of-concern (extract = read+parse) that the downstream wiring layer (generate + sources) calls as a single function."
  - "Post-commit filename-slug hygiene: match sources.ts defaultLinkMap (line 283) slug rule exactly rather than inventing a second convention."

requirements-completed: []

# Metrics
duration: 10 min
completed: 2026-04-21
---

# Phase 55 Plan 01: extract-all Orchestrator Summary

**Single-entrypoint `extractAll(projectRoot)` reads static-site/ HTML + faq.json fallback, runs all 8 Phase 53 extractors sequentially, and returns a typed `ExtractedBundle` with 8 keyed entity fields for downstream wiring.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-04-21T00:48Z (approx)
- **Completed:** 2026-04-21T00:52Z (approx)
- **Tasks:** 2 (1 RED test, 1 GREEN implementation)
- **Files created:** 2

## Accomplishments

- `extractAll(projectRoot: string): Promise<ExtractedBundle>` exists and is importable from `scripts/tiddlywiki/extract-all.ts`.
- Bundle contract locked: `{ faqItems, exhibits, personnelByExhibit, findingsByExhibit, technologiesByExhibit, testimonials, pages, caseFilesIndex }` — exactly the 8 keys Plans 55-02..06 will consume.
- FAQ HTML-first with JSON fallback works correctly (two dedicated tests).
- Missing exhibit HTML files are skipped without throwing — bundle remains partial-corpus-safe.
- `sourceExhibitLabel` threading verified end-to-end (personnel + findings both carry the DOM-extracted label).
- Idempotency verified — two sequential calls on the same fixture produce byte-identical JSON.
- `pnpm test:scripts scripts/tiddlywiki/extract-all.test.ts` — 7/7 green.
- `pnpm build` — exit 0.
- Phase boundary held: `generate.ts`, `sources.ts`, `html-to-wikitext.ts`, `generators/`, `extractors/` all untouched.

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): extract-all.test.ts** — `06b1c14` (test)
2. **Task 2 (GREEN): extract-all.ts** — `6758258` (feat)

_Plan metadata commit — added after this SUMMARY is written._

## Files Created/Modified

- `scripts/tiddlywiki/extract-all.ts` — 196-line orchestrator: `extractAll`, `ExtractedBundle`, `ExtractedPage`, internal `loadFaqItems`/`loadExhibitsJson`/`exhibitLabelToFilename` helpers. Imports from `./extractors/*.ts` only; no imports from `./generators/`, `./sources.ts`, or `./html-to-wikitext.ts`.
- `scripts/tiddlywiki/extract-all.test.ts` — 231-line vitest suite with 7 describe blocks: FAQ JSON fallback, FAQ HTML preferred, bundle shape, missing-exhibit tolerance, 5-page scope with locked sourceHtmlPath, sourceExhibitLabel threading, idempotency. Hermetic fixtures via `os.tmpdir()` + `afterEach fsp.rm`.

## Decisions Made

1. **Slug normalizer handles both label conventions.** Plan 55-01 text uses short labels (`'A'`) in test fixtures but `src/data/json/exhibits.json` uses verbose labels (`'Exhibit A'`). The naive `exhibit-${slug}.html` form from the plan's sample implementation would map `'Exhibit A'` → `exhibit-exhibit-a.html` (wrong). `exhibitLabelToFilename` now strips a leading `exhibit-` from the slugified label before re-prefixing, so both conventions resolve to `exhibit-<letter>.html`. See Deviations §1.
2. **JSON.parse failure on exhibits.json degrades to empty list, doesn't throw.** The plan sample would have propagated a `JSON.parse` exception; the implementation wraps it in try/catch and returns `[]`. Matches the overall orchestrator stance: partial-corpus safe, missing/malformed inputs never abort the whole extraction.
3. **FAQ JSON fallback wrapped in try/catch too.** `emitFaqItemsFromJson` throws `ExtractorError` on malformed JSON; the orchestrator swallows that and returns `[]` so a bad JSON file does not abort the bundle.
4. **Testimonials are a single flat array with polymorphic sourcePageLabel.** Exhibit testimonials carry `'Exhibit <label>'`; home testimonials carry `'Home'`. Plan 55-04 dispatches on the label string when building tiddlers.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] `exhibitLabelToFilename` would produce wrong filenames for verbose labels**
- **Found during:** Task 2 (GREEN — before writing the implementation, while cross-referencing `src/data/json/exhibits.json` against `static-site/exhibits/`)
- **Issue:** The plan's sample implementation (`return \`static-site/exhibits/exhibit-${slug}.html\`` with `slug = label.toLowerCase().replace(/\s+/g, '-')`) maps the real-data label `"Exhibit A"` to `exhibit-exhibit-a.html`, which does not exist on disk. Only the test fixture (using short labels like `"A"`) would have worked. The live corpus would have silently produced an empty `exhibits` array because every exhibit file read would return `null`.
- **Fix:** Added a slug-normalization step: after lowercasing and replacing whitespace, strip a leading `exhibit-` prefix if present before re-prefixing. Both `"A"` and `"Exhibit A"` now resolve to `static-site/exhibits/exhibit-a.html`.
- **Files modified:** `scripts/tiddlywiki/extract-all.ts`
- **Verification:** Test 4 (missing-exhibit tolerance) still passes with short-label fixture; a manual one-shot check against the live `src/data/json/exhibits.json` + `static-site/exhibits/` confirmed the real corpus would resolve correctly. The live smoke gate in Plan 55-07 will re-verify this end-to-end.
- **Committed in:** `6758258` (Task 2 GREEN commit)

**2. [Rule 2 — Missing Critical] Swallow `JSON.parse` + `emitFaqItemsFromJson` throws**
- **Found during:** Task 2 (GREEN)
- **Issue:** The plan sample `loadExhibitsJson` called `JSON.parse(raw)` unguarded and the plan sample `loadFaqItems` called `emitFaqItemsFromJson(json)` unguarded. A malformed `exhibits.json` or `faq.json` would therefore throw out of `extractAll` and abort the whole bundle. The stated orchestrator contract ("partial-corpus supported — missing exhibit HTML tolerated") implies the same robustness should apply to malformed auxiliary JSON inputs.
- **Fix:** Wrapped both calls in try/catch; parse/validation failure returns empty list instead of throwing.
- **Files modified:** `scripts/tiddlywiki/extract-all.ts`
- **Verification:** All 7 tests still green. No test explicitly exercises malformed-JSON-input, but the behavior is strictly more permissive than the plan sample, so no test can regress.
- **Committed in:** `6758258` (Task 2 GREEN commit)

---

**Total deviations:** 2 auto-fixed (1 Rule 1 bug, 1 Rule 2 missing critical).
**Impact on plan:** Both deviations preserve the orchestrator's stated contract (data-in / data-out, partial-corpus safe). No scope creep; no API shape change. The filename-slug fix is the one that will matter for Plan 55-07 smoke gate — without it, the live extraction would have returned an empty `exhibits` array.

## Issues Encountered

None — RED failed as expected, GREEN passed on the first run, `pnpm build` clean.

## User Setup Required

None.

## Next Phase Readiness

- **Ready for Plans 55-02, 55-03, 55-04, 55-05, 55-06** — all can now `import { extractAll, type ExtractedBundle } from './extract-all.ts'` and stop re-reading HTML directly. Each downstream plan adds its wiring to `generate.ts` against the typed bundle.
- **Plan 55-07 smoke gate** will run `extractAll(PROJECT_ROOT)` against the live `static-site/` and must observe all 15 exhibits in `bundle.exhibits` + ≥1 entry in each of the 4 per-exhibit arrays. The normalizer fix (Deviation §1) is what makes this work.
- **Phase boundary held:** `generate.ts`, `sources.ts`, `html-to-wikitext.ts`, `generators/`, `extractors/` all unchanged this plan.

## Verification Results (re-run post-SUMMARY)

```
pnpm test:scripts --run scripts/tiddlywiki/extract-all.test.ts
  Test Files  1 passed (1)
  Tests       7 passed (7)
pnpm build
  ✓ built in 810ms (vue-tsc + vite build + markdown export all exit 0)
git diff --name-only HEAD~2 HEAD
  scripts/tiddlywiki/extract-all.test.ts
  scripts/tiddlywiki/extract-all.ts
```

## Self-Check: PASSED

- `scripts/tiddlywiki/extract-all.ts` — FOUND on disk
- `scripts/tiddlywiki/extract-all.test.ts` — FOUND on disk
- `.planning/phases/55-iter-1-fixes/55-01-SUMMARY.md` — FOUND on disk
- Commit `06b1c14` — FOUND in git log (RED test)
- Commit `6758258` — FOUND in git log (GREEN impl)

---
*Phase: 55-iter-1-fixes*
*Completed: 2026-04-21*
