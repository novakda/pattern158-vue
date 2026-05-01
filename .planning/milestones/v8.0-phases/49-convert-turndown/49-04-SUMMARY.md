---
phase: 49-convert-turndown
plan: 04
subsystem: testing
tags: [editorial-capture, convert-turndown, vitest, hermetic-fixtures, determinism, dom-order, it-each, scaf-08, conv-09, phase-49]

# Dependency graph
requires:
  - phase: 49-01
    provides: "sanitizeHtml + demoteHeadings exports tested via DOM subtree-strip, data-v-* attribute walk, and h1→h3..h5→h6 heading-demotion describe blocks"
  - phase: 49-02
    provides: "configureTurndown factory tested via pattern158-badges rule (including badge-high compound variant), image-alt-only rule (with + without alt), GFM table rendering, link href preservation, and nested-list hierarchy describe blocks"
  - phase: 49-03
    provides: "collapseBlankLines + convertCapturedPage + convertCapturedPages tested via blank-line-collapse describe, determinism self-test on richest combined fixture (byte-equal across two calls), DOM-order preservation (paragraph → list → table), and convertCapturedPages batch-semantics describe"
  - phase: 48-capture-playwright-io
    provides: "CapturedPage 8-field shape used by makeCapturedPage factory helper in the test file; convertCapturedPages metadata-passthrough test asserts consoleErrors/screenshotPath/cfCacheStatus flow through"
provides:
  - "scripts/editorial/__tests__/convert.test.ts — hermetic unit-test suite covering every CONV-01..09 requirement via the public convert.ts export surface. 14 describe blocks, 21 it/it.each declarations, 44 total test cases (260 → 304 total)"
  - "makeCapturedPage(mainHtml, overrides?) test-file-local factory — used across 5 describe blocks to build deterministic CapturedPage fixtures with readonly 8-field defaults and per-test overrides"
  - "Deterministic inline HTML fixtures for every CONV-* scenario — no fs.readFile, no external fixture files, 100% hermetic"
affects: [50-write-assemble]

# Tech tracking
tech-stack:
  added: []  # no new deps — vitest + @joplin/turndown-plugin-gfm + turndown + happy-dom all installed in Phase 46/48
  patterns:
    - "Scenario-to-describe-block 1:1 mapping: every CONTEXT.md test-surface scenario is bound to a named describe block, with acceptance-gate greps targeting the exact titles — drop a scenario, fail the gate loudly"
    - "it.each for parameterized-input coverage: 4 describe blocks use it.each tuples to expand a single test declaration into 4-8 cases (subtree-strip, heading-demote, pattern158-badges, link-hrefs, collapse-blank-lines) — 28 total tuple rows"
    - "Test-file-local fixture factory: makeCapturedPage builds full CapturedPage objects from a bare mainHtml string plus optional overrides — keeps per-test intent visible without repeating the 8-field literal"
    - "Double-invocation determinism self-test: assert convertCapturedPage(page).markdown === convertCapturedPage(page).markdown byte-equal on a richest combined fixture (headings + prose + link + badge + nested list + GFM table + image + aria-hidden + style) — CONV-02 cross-cutting verification"

key-files:
  created:
    - "scripts/editorial/__tests__/convert.test.ts — 322-line hermetic test suite. 14 describe blocks: sanitizeHtml — subtree strip (4 it.each rows), sanitizeHtml — data-v-* attribute walk (2 its), heading demotion CONV-04 (6 it.each rows), pattern158-badges rule CONV-05 (8 it.each rows + 1 negative it), pattern158-badges rule CONV-05 — icon flatten (1 it), GFM plugin — tables CONV-01 (1 it), nested list preservation (1 it), image-alt-only rule CONV-03 — with alt (2 its), image-alt-only rule CONV-03 — without alt (2 its), link hrefs CONV-07 (4 it.each rows), collapseBlankLines CONV-08 (6 it.each rows + 1 idempotence it), determinism self-test CONV-02 (1 it with richest fixture), DOM-order preservation CONV-06 (1 it), convertCapturedPages (3 its)."
  modified: []

key-decisions:
  - "Test-expectation alignment with @joplin/turndown-plugin-gfm actual output form: the plan's <action> code samples specified string literals like '| A | B |', '- item 1', '- L1a' for table/bullet assertions, but the library deterministically emits padded forms ('| A   | B   |' for short cells aligning with the '---' separator minimum width, '-   item 1' with 3-space padding after the bullet marker for nested-list alignment). Rule 1 auto-fix applied to all 4 affected assertions — semantic intent (presence of table cells, bullet markers, header/separator structure) preserved while matching the library's actual deterministic output verbatim."
  - "Determinism assertion uses `expect(first).toBe(second)` on the convertCapturedPage(page).markdown field directly, not on the full ConvertedPage object. ConvertedPage fields that are passed through from the input (consoleErrors, screenshotPath, cfCacheStatus) are trivially byte-equal; the semantic determinism contract is the markdown string output — that's what CONV-02 locks. The richest fixture also smoke-checks 11 separate substrings of the output to pin down any regression in heading-demote, GFM-table, bullet-marker, link-href, badge-bold, image-alt, aria-hidden-strip, style-strip, or data-v-strip behavior."
  - "DOM-order test uses indexOf ordering on three visible-text markers (para-text → list-item → cell) rather than asserting exact line numbers or whitespace. indexOf ordering is resilient to future Turndown cosmetic output changes (whitespace, blank lines) while still failing loudly if the GFM table or list renderer emits content out of document order — which is the actual CONV-06 invariant."
  - "Non-allowlisted span class test (`<span class=\"not-a-badge\">plain</span>` does NOT render as `**plain**`) is placed INSIDE the pattern158-badges rule describe block, not in a separate describe. This keeps the allowlist contract (positive cases + one negative case) co-located for readers."
  - "convertCapturedPages describe includes a metadata-passthrough test (consoleErrors/screenshotPath/cfCacheStatus flow from CapturedPage to ConvertedPage unchanged). This locks the Plan 49-03 field-preserving transform — any future refactor that drops a field or changes its type trips the test."

patterns-established:
  - "Scenario-binding acceptance-gate: when CONTEXT.md enumerates a test surface, the PLAN maps each scenario to a named describe block, and the verify-command greps the exact titles. The mapping is the contract between CONTEXT and the test file — it survives refactors because the grep would fail first."
  - "it.each for deterministic scenario expansion: parameterized tuples `[description, input, expected]` in it.each let a single describe block cover 4-8 cases without declaration churn. Coverage scales linearly with tuple rows; test count scales proportionally (8 badge cases, 6 heading cases, 6 blank-line cases, 4 link cases, 4 subtree-strip cases = 28 it.each rows across 5 describes)."
  - "Rule 1 test-expectation fix pattern: when an upstream library's actual deterministic output differs from a plan's sample assertion, treat the test assertion (not the library) as the bug. Update the test to assert on the actual emitted form, document the padding/format rationale inline as a comment, keep semantic intent (presence of structural markers) unchanged. Applied here 4 times across GFM tables and bullet lists."

requirements-completed: [CONV-09]

# Metrics
duration: 5m 8s
completed: 2026-04-21
---

# Phase 49 Plan 04: Hermetic CONV-09 Test Suite for convert.ts Summary

**14 scenario-bound describe blocks and 44 total test cases lock every CONV-01..09 behavior of convert.ts, covering sanitization, heading demotion, badge/pill bold rendering (including badge-\w+ compound variants), GFM tables, nested lists, image-alt-only rendering, verbatim href preservation, blank-line collapse, byte-equal determinism on a richest combined fixture, and DOM-order preservation — all via inline HTML fixtures with zero filesystem I/O.**

## Performance

- **Duration:** 5m 8s
- **Started:** 2026-04-21T00:59:49Z
- **Completed:** 2026-04-21T01:04:57Z
- **Tasks:** 1 of 1
- **Files created:** 1 (`scripts/editorial/__tests__/convert.test.ts`, 322 lines)
- **Files modified:** 0

## Accomplishments

- `scripts/editorial/__tests__/convert.test.ts` created with **14 describe blocks** mapped 1:1 to the CONTEXT.md lines 86-100 scenario list (11 primary + 2 cross-cutting: determinism + DOM-order + bonus convertCapturedPages batch block).
- Every CONTEXT.md scenario is bound to a named, greppable describe block matching the exact titles specified in the plan's `<objective>` mapping table (21 acceptance-gate greps all pass).
- `badge-high` compound-variant it.each row present (checker warning #4 coverage) — validates the `badge-\w+` regex alternation added in Plan 49-02 that distinguishes `.badge-high` standalone from `.badge` base class.
- Determinism self-test (CONV-02) asserts `convertCapturedPage(page).markdown` is byte-equal across two invocations on a richest combined fixture containing h1/h2, prose with link + badge, 3-level nested list, 2-col GFM table, image with alt, aria-hidden decorative block, inline `<style>` block, and a `data-v-*` attribute — all in one HTML string. The same fixture also smoke-checks 11 separate substrings to pin down regression surfaces.
- DOM-order test (CONV-06) asserts paragraph → list → table stays in document order via indexOf ordering on three visible-text markers.
- `convertCapturedPages` batch describe (bonus) covers 3 cases: ordered iteration (3 pages), empty input, and Phase 48 metadata passthrough (consoleErrors, screenshotPath, cfCacheStatus flow from CapturedPage to ConvertedPage).
- All fixtures are inline HTML string literals — no `fs.readFile`, no external fixture files. Suite is 100% hermetic.
- Test count: **260 → 304** (44 new test cases across 14 new describe blocks, via 21 it/it.each declarations expanding through 28 it.each tuple rows). Test file count: **19 → 20**.
- `pnpm build` exits 0. `pnpm test:scripts` — 20 files, 304 passed, 0 failed.
- SCAF-08 grep gate clean on the new test file (no Date.now, new Date, os.EOL, Promise.all, setTimeout, or `@/` aliases).

## Task Commits

Each task was committed atomically:

1. **Task 1: Create convert.test.ts with explicit scenario-to-describe mapping (CONV-09 full coverage)** — `93eeedc` (test)

## Files Created/Modified

### Created: `scripts/editorial/__tests__/convert.test.ts` (322 lines)

**File top matter (lines 1-19):** SCAF-08 paraphrased-token banner mirroring `smoke.test.ts` + imports from `../convert.ts` (sanitizeHtml, configureTurndown, collapseBlankLines, convertCapturedPage, convertCapturedPages) and `../capture.ts` (type-only CapturedPage). Vitest globals ambient.

**Fixture factory (lines 21-35):** `makeCapturedPage(mainHtml, overrides?)` returns a CapturedPage with 8-field defaults (home route, httpStatus 200, empty consoleErrors, /tmp/test.png screenshot) and spread-overrides for per-test route/errors/path/cfCacheStatus changes.

**14 describe blocks (lines 37-317) — exact mapping to CONTEXT.md lines 86-100:**

| # | Describe block title | CONTEXT.md scenario | Cases |
|---|----------------------|---------------------|-------|
| 1 | `sanitizeHtml — subtree strip` | `<script>` / `<style>` / `<noscript>` / `[aria-hidden="true"]` | 4 (it.each) |
| 2 | `sanitizeHtml — data-v-* attribute walk` | `data-v-*` attr walk + determinism | 2 |
| 3 | `heading demotion (CONV-04)` | h1→h3..h6→h6 clamp | 6 (it.each) |
| 4 | `pattern158-badges rule (CONV-05)` | badge/pill/chip/tag/tag-*/severity-*/category-* **+ `badge-high` compound** | 8 (it.each) + 1 negative |
| 5 | `pattern158-badges rule (CONV-05) — icon flatten` | icon+text flattens to bold text | 1 |
| 6 | `GFM plugin — tables (CONV-01)` | 2-col table → pipe-table | 1 |
| 7 | `nested list preservation` | 3-level nested ul | 1 |
| 8 | `image-alt-only rule (CONV-03) — with alt` | `<img alt="Hero" src="/x.png">` → `Hero`; base64 never emitted | 2 |
| 9 | `image-alt-only rule (CONV-03) — without alt` | missing alt / empty alt → empty | 2 |
| 10 | `link hrefs (CONV-07)` | internal / external http / external https / mailto | 4 (it.each) |
| 11 | `collapseBlankLines (CONV-08)` | 4→2, 3→2, 2→2, 1→1, 0→0, multiple runs + idempotence | 6 (it.each) + 1 |
| 12 | `determinism self-test (CONV-02)` | byte-equal markdown across two calls on richest fixture | 1 |
| 13 | `DOM-order preservation (CONV-06)` | paragraph → list → table | 1 |
| 14 | `convertCapturedPages` (bonus) | ordered batch + empty + metadata passthrough | 3 |

**Totals:** 14 describe blocks, 21 it/it.each declarations, 44 concrete test cases (expansion via 28 it.each tuple rows + 16 plain its).

## Decisions Made

All substantive decisions were locked in 49-CONTEXT.md lines 86-100 and the plan's `<objective>` scenario-mapping table. Execution-time decisions logged in the frontmatter `key-decisions` block, summarized:

1. **Test-expectation alignment to actual Turndown+@joplin/turndown-plugin-gfm output.** The plan's `<action>` code samples specified `'| A | B |'`, `'| Dan | Eng |'`, `'- item 1'`, `'- L1a'` etc. for table/bullet assertions. The library deterministically emits padded forms: short cells pad to width 3 aligning with the `---` separator (`'| A   | B   |'`), nested-list bullets get 3 trailing spaces (`'-   item 1'`, `'-   L1a'`). Rule 1 auto-fix was applied to four assertions across the GFM-tables and determinism-self-test and nested-list describe blocks; semantic intent (presence of table cells / bullet markers / header structure) fully preserved. Detailed in the Deviations section below.

2. **Use makeCapturedPage factory helper, not raw CapturedPage object literals.** Four describe blocks (`determinism self-test`, `DOM-order preservation`, `convertCapturedPages` batch + metadata-passthrough + empty-array) need CapturedPage instances. A local `makeCapturedPage(mainHtml, overrides?)` factory with 8-field defaults keeps per-test intent visible and avoids repeating the CapturedPage shape in every `it`.

3. **Keep the non-allowlisted span "negative case" inside the pattern158-badges describe.** A single `it` asserts `<span class="not-a-badge">plain</span>` does NOT render as `**plain**`. Co-locating positive + negative cases makes the allowlist contract readable end-to-end without describe switching.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] GFM table + nested-list assertions updated to match @joplin/turndown-plugin-gfm actual emitted form**

- **Found during:** Task 1, first `pnpm test:scripts` run (2 failures from the determinism + GFM-table describes)
- **Issue:** The plan's `<action>` code samples specified string literals `'| Name | Role |'`, `'| Dan | Eng |'`, `'| Sam | Design |'`, `'| A | B |'`, `'- item 1'`, `'- L1a'`, `'- L2a'`, `'- L3a'`, `'- L1b'` in four places. The actual @joplin/turndown-plugin-gfm 1.0.64 output pads:
  - Single-character cells to width 3 so the `---` separator minimum width aligns: `'| A   | B   |'` (3 chars + 1 space each side), separator line `'| --- | --- |'`.
  - Multi-char cells ≥ 3 chars: single space padding only (`'| Name | Role |'`).
  - Bullet-list items get 3 trailing spaces after the `-` marker for nested-list alignment: `'-   item 1'`, `'-   L1a'`.
  - These are deterministic library behaviors (no config knob toggles them); the plan's assertions just didn't match what the library emits.
- **Fix:** Updated 4 assertion sites to match actual output, preserving semantic intent:
  - Describe 6 (`GFM plugin — tables (CONV-01)`): `'| Name | Role |'`, `'| Dan | Eng |'`, `'| Sam | Design |'` — no change needed after investigation (multi-char cells emit with single-space padding as the plan specified).
  - Describe 7 (`nested list preservation`): `'- L1a'` → `'-   L1a'`, `'- L2a'` → `'-   L2a'`, `'- L3a'` → `'-   L3a'`, `'- L1b'` → `'-   L1b'`.
  - Describe 12 (`determinism self-test (CONV-02)`): `'| A | B |'` → `'| A   | B   |'`, `'- item 1'` → `'-   item 1'`.
- **Files modified:** `scripts/editorial/__tests__/convert.test.ts` (4 assertion updates with inline comments explaining the padding rationale)
- **Verification:** `pnpm test:scripts` now 304/304 green; all acceptance greps still pass (the greppable describe-block titles + `badge-high` + `byte-equal` tokens are unchanged; only the semantic-content assertions were adjusted).
- **Committed in:** `93eeedc` (Task 1 commit — the final on-disk version contains the fixed assertions, not the original plan-sample forms)

---

**Total deviations:** 1 auto-fixed (Rule 1 — test-expectation bug, three assertion sites updated across two describe blocks)
**Impact on plan:** Semantic content of the test suite unchanged. All 14 describe blocks present and named per the CONTEXT.md mapping; all 21 acceptance greps still pass; CONV-02 determinism self-test still exercises byte-equal markdown across two invocations; CONV-06 DOM-order test still asserts paragraph → list → table document order. The adjusted assertions now match the deterministic library output, which is what the tests should lock against.

## Issues Encountered

- **GFM padding algorithm discovered empirically.** The plan's code samples assumed `'| A | B |'` for 1-char cells and `'- item'` for all bullets. Actual empirical behavior (captured in the first test-run failure output): single-char cells pad to width 3 to match `---` separator; nested-list bullets get 3 trailing spaces. Resolved by reading the Vitest diff output directly and updating the 4 affected assertions with inline rationale comments. No library-version drift — `@joplin/turndown-plugin-gfm` 1.0.64 is the pinned Phase 46 dependency; this is just the way the library renders.
- **Baseline test run preserved.** Pre-commit baseline: 19 files / 260 tests. Post-commit: 20 files / 304 tests. Delta: +1 file, +44 cases. No existing tests regressed (smoke.test.ts, config.test.ts, routes.test.ts, capture.test.ts all remain green).

## Acceptance Greps — All Pass

Exact greppable checks enumerated in the plan's `<acceptance_criteria>` block (21 total — 14 describe-block title greps + badge-high + byte-equal + 5 import-usage greps + SCAF-08 forbidden-token negative grep):

| # | Plan-specified grep | Result |
|---|----------------------|--------|
| 1 | `test -f scripts/editorial/__tests__/convert.test.ts` | PASS |
| 2 | `grep -q "describe('sanitizeHtml — subtree strip'"` | PASS |
| 3 | `grep -q "describe('sanitizeHtml — data-v-\* attribute walk'"` | PASS |
| 4 | `grep -q "describe('heading demotion (CONV-04)'"` | PASS |
| 5 | `grep -q "describe('pattern158-badges rule (CONV-05)'"` | PASS |
| 6 | `grep -q "describe('pattern158-badges rule (CONV-05) — icon flatten'"` | PASS |
| 7 | `grep -q "describe('GFM plugin — tables (CONV-01)'"` | PASS |
| 8 | `grep -q "describe('nested list preservation'"` | PASS |
| 9 | `grep -q "describe('image-alt-only rule (CONV-03) — with alt'"` | PASS |
| 10 | `grep -q "describe('image-alt-only rule (CONV-03) — without alt'"` | PASS |
| 11 | `grep -q "describe('link hrefs (CONV-07)'"` | PASS |
| 12 | `grep -q "describe('collapseBlankLines (CONV-08)'"` | PASS |
| 13 | `grep -q "describe('determinism self-test (CONV-02)'"` | PASS |
| 14 | `grep -q "describe('DOM-order preservation (CONV-06)'"` | PASS |
| 15 | `grep -q "describe('convertCapturedPages'"` | PASS |
| 16 | `grep -q "badge-high"` (checker warning #4 coverage) | PASS |
| 17 | `grep -q "byte-equal"` (determinism annotation) | PASS |
| 18 | `grep -q "sanitizeHtml("` (import used) | PASS |
| 19 | `grep -q "configureTurndown()"` (import used) | PASS |
| 20 | `grep -q "collapseBlankLines("` (import used) | PASS |
| 21 | `grep -q "convertCapturedPage("` (import used) | PASS |
| 22 | `grep -q "convertCapturedPages("` (import used) | PASS |
| 23 | `! grep -qE "Date\.now\(\)\|new Date\(\|os\.EOL\|Promise\.all\|setTimeout\|from '@/"` (SCAF-08) | PASS |

## SCAF-08 Compliance Summary

`scripts/editorial/__tests__/convert.test.ts` is clean against the combined forbidden-token regex:

| Token | Check | Result |
|-------|-------|--------|
| `Date.now()` | `! grep -q "Date\.now()"` | PASS |
| `new Date(` | `! grep -q "new Date("` | PASS |
| `os.EOL` | `! grep -q "os\.EOL"` | PASS |
| `Promise.all` | `! grep -q "Promise\.all"` | PASS |
| `setTimeout` | `! grep -q "setTimeout"` | PASS |
| `from '@/` | `! grep -q "from '@/"` | PASS |
| `Math.random` | `! grep -q "Math\.random"` | PASS |

Additional discipline verified:
- Relative `.ts` imports only (`'../convert.ts'`, `'../capture.ts'`) — no path-alias imports.
- Banner paraphrases forbidden tokens ("non-deterministic timestamp APIs", "platform-specific line endings", "parallel iteration over the ordered route list") — matches smoke.test.ts and capture.test.ts banner form.
- All fixtures are synthetic (`"HIGH"`, `"Hero"`, `"L1a"`, `"para-text"`, `<p>ok</p>`, etc.) — no real site content embedded.
- Vitest globals ambient (describe/it/expect) via the scripts Vitest project's `globals: true` config — no explicit `import from 'vitest'` line needed.

## Build + Test Results

- `pnpm build` — exits 0. Full composite compile (tsconfig.app.json, tsconfig.node.json, tsconfig.scripts.json, tsconfig.editorial.json, tsconfig.markdown.json) passes; the new test file type-checks against Plan 49-01/02/03's exported surface. Vite production build emits dist assets; `build:markdown` (tsx scripts/markdown-export) completes.
- `pnpm test:scripts` — **20 files, 304 tests, 304 passed, 0 failed** (up from 19 files / 260 tests at the Plan 49-03 baseline). Delta: +1 file (convert.test.ts), +44 cases.
- Duration: 457ms (Vitest run time; no watch mode).

## Phase 49 Completion Status

All 4 plans in Phase 49 are complete. All 9 CONV-* requirements are now satisfied:

| Requirement | Plan | Satisfaction |
|-------------|------|--------------|
| CONV-01 (Turndown + GFM plugin) | 49-02 | `configureTurndown()` factory + `.use(gfm)` wired; Plan 49-04 describe 6 verifies 2-col pipe-table output |
| CONV-02 (determinism — no wall-clock, no RNG) | 49-01, 49-02, 49-03 | All three plans' exports are pure; Plan 49-04 describe 12 asserts byte-equal markdown across two invocations on the richest fixture |
| CONV-03 (image alt-only, never base64) | 49-02 | `image-alt-only` custom rule; Plan 49-04 describes 8 + 9 verify with-alt (bare text), without-alt (empty), empty-alt (empty), base64 src never emitted |
| CONV-04 (heading demote h1→h3, clamp at h6) | 49-01 | `demoteHeadings(doc)` in-place DOM mutation; Plan 49-04 describe 3 verifies all 6 demotion levels |
| CONV-05 (badge/pill bold rendering with badge-\w+ alternation) | 49-02 | `pattern158-badges` custom rule; Plan 49-04 describes 4 + 5 verify 8 class variants including `badge-high` compound + icon+text flatten |
| CONV-06 (DOM order preservation) | 49-02, 49-03 | Turndown default document-order walk + sequential for-of in convertCapturedPages; Plan 49-04 describe 13 verifies paragraph → list → table via indexOf |
| CONV-07 (hrefs verbatim) | 49-02 | `linkStyle: 'inlined'` default Turndown behavior; Plan 49-04 describe 10 verifies 4 href kinds (internal, http, https, mailto) |
| CONV-08 (blank-line collapse 3+ → 2) | 49-03 | `collapseBlankLines()` ReDoS-safe regex; Plan 49-04 describe 11 verifies 6 collapse cases + idempotence |
| CONV-09 (unit tests with inline fixtures) | 49-04 (this plan) | 14 describe blocks, 44 cases, 100% hermetic (no fs I/O) |

## Next Phase Readiness

- Phase 49 is **DONE**. All CONV-* requirements satisfied; full convert.ts export surface locked and tested; no deferred items or stubs.
- **Phase 50** (write + assemble) will import `convertCapturedPages` from `scripts/editorial/convert.ts`, call it on the Plan 48-06 `captureRoutes` output, and feed the resulting `readonly ConvertedPage[]` through the write-phase assembler. The 3 new ConvertedPage fields (`consoleErrors`, `screenshotPath`, `cfCacheStatus?`) are exactly what Phase 50's per-page metadata block needs.
- **v8.0 milestone** progress: Phase 49 complete; remaining phase(s) in the editorial-snapshot milestone track from here. No blockers. No new package.json dependencies needed for downstream phases — the convert module surface is feature-complete and frozen.

## Self-Check: PASSED

Verified on disk after writing this SUMMARY:

- `scripts/editorial/__tests__/convert.test.ts` exists (322 lines) — FOUND
- Commit `93eeedc` in git log — FOUND (`git log --oneline | grep 93eeedc` matches `test(49-04): add hermetic CONV-09 suite for convert.ts`)
- All 23 acceptance greps pass (21 positive + 1 negative + 1 file-exists)
- `pnpm build` exit 0 — confirmed
- `pnpm test:scripts` 304/304 green, 20 files — confirmed (up from 260/260 / 19 files at Plan 49-03 baseline)
- All 14 CONTEXT.md-scenario-bound describe blocks named and greppable per the plan's `<objective>` mapping table — confirmed
- `badge-high` compound-variant it.each row present in the pattern158-badges describe — confirmed (checker warning #4 coverage)
- Determinism self-test + DOM-order preservation are explicit named describe blocks — confirmed
- Hermetic: no fs.readFile, no external fixture files, no network — confirmed by source inspection (`grep -q "fs\." scripts/editorial/__tests__/convert.test.ts` returns no matches)
- SCAF-08 grep gate clean on the test file — confirmed

---
*Phase: 49-convert-turndown*
*Completed: 2026-04-21*
