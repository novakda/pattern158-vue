---
phase: 47-config-routes-pure-logic
plan: 05
subsystem: editorial-capture
tags: [editorial-capture, vitest, tests, routes, exhibits-fixture, hermetic-fs, scaf-08, phase-47]

# Dependency graph
requires:
  - phase: 47-03-routes-impl
    provides: "STATIC_ROUTES (7 entries, locked order), EXCLUDED_PREFIXES (4 entries), isExcluded (segment-aware prefix matcher), buildRoutes (async; reads exhibits.json via fs.readFile + JSON.parse, validates per-entry shape, derives sourceSlug, applies defensive isExcluded filter), error-message contract strings"
provides:
  - "scripts/editorial/__tests__/routes.test.ts — 4 describe blocks (STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded, buildRoutes), 43 test cases, all hermetic via per-test temp dirs (prefix p47-routes-test-)"
  - "Coverage of all ROADMAP success-criterion-5 vectors for routes.ts: ordering (static-then-exhibit + source-order preservation), exclusion filter (each excluded prefix + segment-aware false cases), exhibit slug integration (sourceSlug = exhibitLink.slice('/exhibits/'.length)), JSON-parse error path (SyntaxError + non-array + per-entry field-name + bad prefix + ENOENT)"
affects: [47-06-smoke-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hermetic FS fixture pattern via fs.mkdtemp with plan-specific prefix (p47-routes-test-) — distinct from Plan 04's p47-config-test- prefix to avoid intra-process collision"
    - "Inline JSON fixture helpers: writeExhibitsFixture(entries: unknown) + writeRawFixture(content: string) for malformed-JSON path"
    - "vitest .rejects.toThrow(...) for async rejection assertions including SyntaxError class match and regex message match"
    - "vitest it.each([...] as const) for table-driven exclusion-matrix tests — keeps test count high without copy-paste"
    - "try/catch + expect.unreachable() pattern for inspecting NodeJS.ErrnoException.code on rejected promises (ENOENT case)"

key-files:
  created:
    - "scripts/editorial/__tests__/routes.test.ts (293 lines, 4 describe blocks, 43 test cases)"
  modified: []

key-decisions:
  - "Used per-test temp dir prefix 'p47-routes-test-' (Plan 04 uses 'p47-config-test-') so both files can run in the same Vitest process without mkdtemp template collision"
  - "Exhibit-shape error-path tests assert both index AND field name in two separate .rejects.toThrow() calls — clearer regression diagnostic than a single combined regex"
  - "ENOENT test uses try/catch + expect.unreachable() pattern (rather than .rejects.toMatchObject({code: 'ENOENT'})) to make the error.code property assertion explicit and the failure mode obvious"
  - "Exclusion-matrix tests organized as 5 it.each blocks (exact-match true, /diag subpath true, substring-but-not-segment false, STATIC_ROUTES false, exhibit-paths false) plus 1 it() for empty string — covers every CAPT-02 vector with no copy-paste and no test bleed"
  - "Static order assertion uses the explicit literal array, not derived from STATIC_ROUTES.map — catches a regression where someone mutates STATIC_ROUTES order; reading the source-of-truth from STATIC_ROUTES would tautologically pass any reorder"
  - "First/last static route covered with full deep-equal (not just path) — locks label and category alongside path for the bookend entries"

patterns-established:
  - "Hermetic Vitest pattern for editorial subsystem: per-test mkdtemp + plan-specific prefix + inline JSON.stringify fixtures + raw-string fixture helper for malformed-input paths. Real on-disk source files (exhibits.json, etc.) are NEVER read in unit tests — those are smoke-gate territory."
  - "Per-entry validation tests assert BOTH the entry index AND the offending field name (separate .rejects.toThrow() calls) — gives downstream maintainers a clear diagnostic when error messages change"

requirements-completed: [CAPT-01, CAPT-02]

# Metrics
duration: 3m 20s
completed: 2026-04-20
---

# Phase 47 Plan 05: Routes module unit tests Summary

**Landed `scripts/editorial/__tests__/routes.test.ts` — a 293-line Vitest suite with 4 describe blocks (STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded, buildRoutes) and 43 test cases that prove every public function in `scripts/editorial/routes.ts` behaves per the CONTEXT.md / Plan-03 contract. All fixtures are inline (per-test temp dir, prefix `p47-routes-test-`); the real `src/data/json/exhibits.json` is never read.**

## Performance

- **Duration:** 3 min 20 sec
- **Started:** 2026-04-20T17:21:29Z
- **Completed:** 2026-04-20T17:24:49Z
- **Tasks:** 2
- **Files created:** 1
- **Files modified:** 0

## Accomplishments

- **`STATIC_ROUTES` describe block (6 cases):** asserts count=7, deep-equal on the locked path order (`/`, `/philosophy`, `/technologies`, `/case-files`, `/faq`, `/contact`, `/accessibility`), deep-equal on the locked Title Case labels (`Home`, `Philosophy`, `Technologies`, `Case Files`, `FAQ`, `Contact`, `Accessibility`), category=`'static'` and sourceSlug=undefined for every entry, full deep-equal on the home (index 0) and accessibility (last) bookends.
- **`EXCLUDED_PREFIXES` describe block (2 cases):** asserts count=4, sorted-equal on the locked exclusion set (`/diag`, `/portfolio`, `/review`, `/testimonials`).
- **`isExcluded` describe block (21 it.each rows + 1 it case = 22 total):** exact-match true for each of the 4 excluded prefixes; subpath-under-`/diag` true for `/diag/network`, `/diag/foo/bar`, `/diag/v1/health`; segment-aware false for `/diagnostics` (the substring-collision sentinel), `/reviewx`, `/portfoliography`, `/testimonials-archive`; false for each of the 7 STATIC_ROUTES paths; false for `/exhibits/exhibit-a` and `/exhibits/exhibit-o`; false for the empty string.
- **`buildRoutes` describe block (14 cases):** routes count=10 for a 3-entry fixture; first 7 routes' paths equal `STATIC_ROUTES.map(r => r.path)`; routes 8–10 paths equal `['/exhibits/exhibit-a', '/exhibits/exhibit-b', '/exhibits/exhibit-c']`; source-order preservation (input `[B, A, C]` → output `[B, A, C]`, NOT alphabetical); sourceSlug derived by stripping `/exhibits/` (asserts `'exhibit-a'` and `'exhibit-m'`); category=`'static'` for first 7 and category=`'exhibit'` for the rest; empty-array fixture returns exactly the 7 STATIC_ROUTES; sourceSlug=undefined for static routes and non-empty `=path.slice('/exhibits/'.length)` for exhibits; defensive `isExcluded` returns false for every result entry; rejects with native `SyntaxError` on malformed JSON (`'{not valid json'`); rejects with `/must be a JSON array/` on `{"not": "an array"}`; rejects with `/index 1/` AND `/label/` when entry index 1 is missing `label`; rejects with `/index 0/` AND `/exhibitLink/` when entry index 0 is missing `exhibitLink`; rejects with `/must start with/` AND `/\/wrong\/exhibit-x/` when `exhibitLink` lacks the `/exhibits/` prefix; rejects with `(err as NodeJS.ErrnoException).code === 'ENOENT'` for a non-existent fixture path.
- **Hermetic per-test temp dirs:** `beforeEach` runs `fs.mkdtemp(path.join(os.tmpdir(), 'p47-routes-test-'))`; `afterEach` runs `fs.rm(tmpRoot, { recursive: true, force: true })`. Two helpers — `writeExhibitsFixture(entries)` (`JSON.stringify` inline) and `writeRawFixture(content)` (raw string for the malformed-JSON path) — both write to `path.join(tmpRoot, 'exhibits.json')`. The real `src/data/json/exhibits.json` is never referenced anywhere in `routes.test.ts` (verified via `! grep src/data/json/exhibits.json`).
- **SCAF-08 banner present** at file head (descriptive form — never spells out the literal forbidden tokens). SCAF-08 forbidden-pattern grep gate clean across `scripts/editorial/__tests__/` (`@/`, `Date.now()`, `new Date(`, `os.EOL`, `Promise.all` — zero hits).
- **Ambient Vitest globals** used throughout — no `import { describe, it, expect } from 'vitest'`, consistent with `smoke.test.ts` and `config.test.ts`.
- **Relative `.ts` import** for the SUT: `from '../routes.ts'`, NOT `from '../routes'`. Consistent with NodeNext composite-project requirements proven in Phase 46.
- **Test counts:**
  - Plan 47-04 baseline: 17 files / 181 tests
  - After Task 1 (STATIC_ROUTES + EXCLUDED_PREFIXES + isExcluded): 18 files / 210 tests (+1 file, +29 tests)
  - After Task 2 (buildRoutes appended): 18 files / 224 tests (+0 files, +14 tests)
  - Net plan delta: +1 file, +43 tests
- `pnpm test:scripts` exits 0 with all 224 tests green; `routes.test.ts` discovered via the existing `scripts/editorial/**/*.test.ts` include glob.

## Task Commits

Each task was committed atomically on main:

1. **Task 1: Add STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded Vitest blocks (CAPT-02)** — `7c2c81e` (test)
2. **Task 2: Add buildRoutes Vitest block — hermetic FS fixtures + error paths (CAPT-01)** — `a86df7d` (test)

## Files Created/Modified

- **`scripts/editorial/__tests__/routes.test.ts`** (created, 293 lines) — Phase 47 Vitest suite for all four public exports of `scripts/editorial/routes.ts`. SCAF-08 banner header (descriptive form). Imports: `node:fs/promises`, `node:os`, `node:path`, plus `STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded, buildRoutes` from `'../routes.ts'`. Four `describe` blocks; 43 test cases total (29 from Task 1 + 14 from Task 2 once `it.each` rows are expanded). Hermetic via per-test `mkdtemp` (`p47-routes-test-` prefix, distinct from Plan 04's `p47-config-test-`).

## Coverage matrix — ROADMAP Phase 47 success-criterion-5 vectors for routes.ts

| Vector | Required by CONTEXT.md / plan | Test case(s) | Status |
| ------ | ----------------------------- | ------------ | ------ |
| Static route order (locked sequence) | "home → philosophy → technologies → case-files → faq → contact → accessibility" | `STATIC_ROUTES > lists routes in the locked CONTEXT.md order` | green |
| Static route count | exactly 7 | `STATIC_ROUTES > contains exactly 7 entries` | green |
| Static route labels | locked Title Case | `STATIC_ROUTES > uses the locked Title Case labels` | green |
| Static route category | `'static'` for every entry, no sourceSlug | `STATIC_ROUTES > marks every entry with category 'static' and no sourceSlug` | green |
| EXCLUDED_PREFIXES content | `['/review', '/diag', '/portfolio', '/testimonials']` | `EXCLUDED_PREFIXES > contains the locked exclusion set` | green |
| isExcluded — exact match per excluded prefix | true for `/review`, `/diag`, `/portfolio`, `/testimonials` | `isExcluded > exact-matches excluded prefix %s -> %s` (4 it.each rows) | green |
| isExcluded — subpath match under `/diag` | true for `/diag/*` | `isExcluded > matches subpaths under /diag` (3 rows) | green |
| isExcluded — segment-aware NOT-match (substring collision) | false for `/diagnostics` (the canonical `/diag` collision sentinel), `/reviewx`, `/portfoliography`, `/testimonials-archive` | `isExcluded > does NOT match substring-but-not-segment paths` (4 rows) | green |
| isExcluded — STATIC_ROUTES paths not excluded | false for all 7 | `isExcluded > does NOT exclude any STATIC_ROUTES path` (7 rows) | green |
| isExcluded — exhibit paths not excluded | false for `/exhibits/exhibit-*` | `isExcluded > does NOT exclude exhibit paths` (2 rows) | green |
| Routes ordering (static-then-exhibit interleave) | first 7 = STATIC_ROUTES, then exhibits | `buildRoutes > appends exhibits AFTER the 7 static routes in source order` | green |
| Exhibit source-order preservation | input `[B, A, C]` → output `[B, A, C]` (NOT alphabetical) | `buildRoutes > preserves exhibit source order even when input is not alphabetical` | green |
| Empty exhibits fixture | returns exactly 7 STATIC_ROUTES | `buildRoutes > returns only the 7 static routes for an empty exhibits array` | green |
| Exhibit slug integration | sourceSlug = `exhibitLink.slice('/exhibits/'.length)` | `buildRoutes > derives sourceSlug by stripping the '/exhibits/' prefix from exhibitLink` AND `static routes ... have sourceSlug undefined; exhibit routes have non-empty sourceSlug` | green |
| Exhibit category labeling | `'exhibit'` for exhibits, `'static'` for the rest | `buildRoutes > marks exhibit routes with category 'exhibit' (and static routes with category 'static')` | green |
| Defensive isExcluded filter | none of the returned routes match an excluded prefix | `buildRoutes > result contains no excluded paths (defensive isExcluded filter)` | green |
| exhibits.json JSON-parse error path | native SyntaxError on malformed JSON | `buildRoutes > rejects with SyntaxError on malformed JSON` | green |
| Non-array root JSON value | `"exhibits.json must be a JSON array"` | `buildRoutes > rejects with Error containing "must be a JSON array" when value is not an array` | green |
| Per-entry "missing label" error | `"index <i>"` AND `"label"` in message | `buildRoutes > rejects with Error naming the entry index when label is missing` | green |
| Per-entry "missing exhibitLink" error | `"index <i>"` AND `"exhibitLink"` in message | `buildRoutes > rejects with Error naming the entry index when exhibitLink is missing` | green |
| Per-entry bad-prefix error | `"must start with"` AND offending value in message | `buildRoutes > rejects with Error containing 'must start with' when exhibitLink lacks the /exhibits/ prefix` | green |
| Missing-file (ENOENT) error | NodeJS.ErrnoException with code='ENOENT' | `buildRoutes > rejects with ENOENT when the exhibits.json path does not exist` | green |

Every required vector has at least one corresponding test case; all 43 cases pass on first run.

## Decisions Made

- **Per-test temp dir prefix `p47-routes-test-`:** Distinct from Plan 04's `p47-config-test-` so both files can coexist in the same Vitest process without `mkdtemp` template collision. (Vitest runs files in parallel by default within a project.)
- **Two fixture helpers (`writeExhibitsFixture` for objects, `writeRawFixture` for strings):** The malformed-JSON path needs to write a deliberately invalid string (`'{not valid json'`) that `JSON.stringify` cannot produce. Splitting the helpers makes each call site self-documenting.
- **ENOENT test uses try/catch + `expect.unreachable()` instead of `.rejects.toMatchObject({code: 'ENOENT'})`:** Makes the `(err as NodeJS.ErrnoException).code` cast explicit at the assertion site and gives a clearer failure diagnostic if the rejection shape regresses (e.g., if buildRoutes ever wraps the fs error in a custom class).
- **Per-entry error tests assert index AND field name in two separate `.rejects.toThrow()` calls:** A combined regex like `/index 1.*label/` would tautologically depend on the message ordering. Two separate `.toThrow(/index 1/)` and `.toThrow(/label/)` calls catch both pieces of information independently and give a clearer diagnostic when one regresses.
- **Static order asserted via explicit literal array (not via `STATIC_ROUTES.map`):** Reading the source-of-truth from `STATIC_ROUTES` would tautologically pass any reorder. The hard-coded literal `['/', '/philosophy', '/technologies', '/case-files', '/faq', '/contact', '/accessibility']` is the regression boundary.
- **First and last static routes covered with full `toEqual({path, label, category})`:** Locks the bookends comprehensively (path + label + category in one assertion) instead of only the path. Catches regressions where the home or accessibility entry's label/category drifts.
- **`it.each` for table-driven exclusion-matrix tests:** Keeps the test count high (each row counts as a separate test at runtime) without copy-paste. Failure messages include the row's `%s -> %s` substitution so the offending input/expected pair is obvious from the failure log.

## Deviations from Plan

None - plan executed exactly as written. All `<behavior>` requirements, all `<acceptance_criteria>`, and all `<success_criteria>` verified green on first pass.

**Total deviations:** 0.
**Impact on plan:** Zero.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. All fixtures are inline; tests run hermetically against per-test temp dirs.

## Next Phase Readiness

- **Plan 47-06 (smoke gate)** — final plan in this phase. Has both `config.test.ts` (Plan 04) and `routes.test.ts` (Plan 05) on disk plus a green `pnpm test:scripts` baseline (18 files / 224 tests) to gate against. The SCAF-08 grep gate is clean across `scripts/editorial/__tests__/` so the smoke gate's forbidden-pattern enforcement is a no-op for tests; routes.ts and config.ts already passed the gate in their respective implementation plans.
- **Phase 48 (capture)** — `buildRoutes` is now contract-tested at every error path AND every success vector. `capture.ts` can iterate the returned `Route[]` sequentially, trusting that:
  - The first 7 entries are the locked static routes in the locked order.
  - The remainder are exhibit routes in the source order of `src/data/json/exhibits.json`.
  - Every entry has `path`, `label`, `category`; exhibit entries additionally have `sourceSlug` for screenshot filename anchoring.
  - No entry matches an excluded prefix (defensive filter already applied).
- **Coverage debt for routes.ts:** Zero — every public function and every error branch has at least one test case.

## Self-Check: PASSED

Verification:

- `scripts/editorial/__tests__/routes.test.ts`: present at 293 lines.
- File contains 4 `describe` blocks: `STATIC_ROUTES`, `EXCLUDED_PREFIXES`, `isExcluded`, `buildRoutes` (verified via grep).
- File imports `STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded, buildRoutes` from `'../routes.ts'` (verified via grep).
- File imports `node:fs/promises`, `node:os`, `node:path` (verified via grep).
- File uses `fs.mkdtemp(path.join(os.tmpdir(), 'p47-routes-test-'))` for hermetic temp dir (verified via grep).
- File contains both fixture helpers `writeExhibitsFixture` and `writeRawFixture` (verified via grep).
- File asserts `rejects.toThrow(SyntaxError)` for malformed JSON path (verified via grep).
- File asserts `must be a JSON array`, `must start with`, `ENOENT` (verified via grep).
- File does NOT reference `src/data/json/exhibits.json` (verified via `! grep`).
- SCAF-08 forbidden-pattern grep gate (`@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all`) returns no matches across `scripts/editorial/__tests__/`.
- Commit `7c2c81e` (Task 1 — STATIC_ROUTES + EXCLUDED_PREFIXES + isExcluded suite) present in `git log --oneline`.
- Commit `a86df7d` (Task 2 — buildRoutes suite append) present in `git log --oneline`.
- `pnpm test:scripts` exits 0 with `Test Files 18 passed (18)` and `Tests 224 passed (224)` — net plan delta from the 17/181 Plan-04 baseline is +1 file and +43 tests.
- Verbose reporter confirms all 14 `buildRoutes` tests and all 29 STATIC_ROUTES/EXCLUDED_PREFIXES/isExcluded tests in `routes.test.ts` ran to green status.

---
*Phase: 47-config-routes-pure-logic*
*Completed: 2026-04-20*
