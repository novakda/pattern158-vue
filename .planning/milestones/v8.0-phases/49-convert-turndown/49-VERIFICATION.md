---
phase: 49-convert-turndown
verified: 2026-04-20T18:13:00Z
status: passed
score: 5/5 must-haves verified
overrides_applied: 0
---

# Phase 49: Convert (Turndown) Verification Report

**Phase Goal:** Given `CapturedPage[]`, produce clean deterministic Markdown per page via Turndown + GFM plugin with custom rules for Vue noise + heading demotion + badge/pill preservation — proven by fixture unit tests.
**Verified:** 2026-04-20T18:13:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Must-Haves)

| # | Must-Have | Status | Evidence |
|---|-----------|--------|----------|
| MH-1 | Turndown 7.2.4 + full GFM; tables render as pipe-table markdown | VERIFIED | `convert.ts:18` `import TurndownService from 'turndown'`; `convert.ts:23` `import { gfm } from '@joplin/turndown-plugin-gfm'`; `convert.ts:185` `service.use(gfm)`; `convert.test.ts:116` `describe('GFM plugin — tables (CONV-01)')` passes — emits `| Name | Role |` pipe-table output. `pnpm build` exit 0 against pinned `turndown@^7.2.4` + `@joplin/turndown-plugin-gfm@^1.0.64`. |
| MH-2 | Sanitization strips `<script>/<style>/<noscript>/[aria-hidden="true"]` subtrees + all `data-v-*` attrs; determinism byte-equal across 2 runs | VERIFIED | `convert.ts:96` `querySelectorAll('script, style, noscript, [aria-hidden="true"]').forEach(el => el.remove())`; `convert.ts:100-106` attribute walk with `attr.name.startsWith('data-v-')` filter; `convert.test.ts:37` subtree-strip describe (4 it.each rows) + `convert.test.ts:51` data-v-* describe + `convert.test.ts:236` determinism self-test on richest fixture `expect(first).toBe(second)` — all green. |
| MH-3 | Images alt-only (no `![]()`, no base64); hrefs verbatim; DOM order preserved | VERIFIED | `convert.ts:152-158` `addRule('image-alt-only')` returns `alt` string or empty — never `![]()` or base64 src. `convert.ts:145` `linkStyle: 'inlined'` preserves hrefs verbatim (Turndown default). `convert.test.ts:172-204` image describes (2 with alt + 2 without), `convert.test.ts:206` link hrefs (4 it.each rows), `convert.test.ts:275` DOM-order preservation test (paragraph → list → table via indexOf) — all green. |
| MH-4 | H1→H3 demotion + h6 clamp; 3+ blank lines collapse to 2 | VERIFIED | `convert.ts:53-66` `demoteHeadings` — `Math.min(6, currentLevel + 2)` clamp, h6→h6 skipped. `convert.ts:206-208` `collapseBlankLines` — `markdown.replace(/\n{3,}/g, '\n\n')`. `convert.test.ts:67` heading demotion describe (6 it.each rows: h1→h3..h6→h6) + `convert.test.ts:218` collapseBlankLines describe (6 it.each rows + idempotence) — all green. |
| MH-5 | Hermetic unit tests green covering full scenario matrix | VERIFIED | `scripts/editorial/__tests__/convert.test.ts` — 322 lines, 14 describe blocks, 44 test cases, zero filesystem I/O (all fixtures inline HTML string literals). `pnpm test:scripts` → 20 files, 304 passed, 0 failed. Covers sanitization, heading demote, badge/pill (+badge-high compound variant), GFM table, nested list, image-alt-only, link hrefs, blank-line collapse, determinism self-test, DOM-order, convertCapturedPages batch. |

**Score:** 5/5 must-haves verified

### Verification Gates

| # | Gate | Expected | Actual | Status |
|---|------|----------|--------|--------|
| 1 | All 4 SUMMARY.md files exist | 49-01..04-SUMMARY.md present | All 4 present (49-01/02/03/04-SUMMARY.md in phase dir) | PASS |
| 2 | CONV-01..09 all `[x]` in REQUIREMENTS.md | 9 ticked | All 9 lines are `- [x] **CONV-0N**` (lines 66-83) | PASS |
| 3 | convert.ts exports all 6 functions + ConvertedPage (8 fields) | `sanitizeHtml, demoteHeadings, configureTurndown, collapseBlankLines, convertCapturedPage, convertCapturedPages` + 8 readonly fields | All 6 exports present (lines 53, 91, 138, 206, 229, 259); ConvertedPage has 8 readonly fields (lines 27-34) | PASS |
| 4 | convert.ts imports `happy-dom` (NOT domino), `/// <reference lib="dom" />` directive | happy-dom + DOM ref present; no domino | Line 15 `/// <reference lib="dom" />`; Line 17 `import { Window } from 'happy-dom'`; grep for `domino` returns no matches | PASS |
| 5 | Badge regex contains `badge-\w+` alternation | Present in `pattern158-badges` rule | Line 175: `/(^|\s)(badge|badge-\w+|pill|chip|tag|tag-\w+|severity-\w+|category-\w+)(\s|$)/` | PASS |
| 6 | `turndown-plugin-gfm.d.ts` exists with `declare module '@joplin/turndown-plugin-gfm'` | Ambient shim file present with declaration | File exists (12 lines); line 6: `declare module '@joplin/turndown-plugin-gfm'` | PASS |
| 7 | SCAF-08 clean in convert.ts + convert.test.ts | No `Date.now()`, `new Date(`, `os.EOL`, `Promise.all`, `setTimeout`, `from '@/`, `Math.random` | Grep across both files returns zero matches for the forbidden-token regex | PASS |
| 8 | `pnpm build` exit 0 | exit 0 | vue-tsc -b + vite build + build:markdown all complete; exit code 0 | PASS |
| 9 | `pnpm test:scripts` exit 0, ~304 tests, 20 files | 304 tests across 20 files | 20 files passed, 304 tests passed, 0 failed (duration 486ms) | PASS |
| 10 | No uncommitted changes on tracked files | Clean working tree for Phase 49 files | Phase 49 files (convert.ts, convert.test.ts, turndown-plugin-gfm.d.ts, types.ts) all committed. Uncommitted tracked items (`tsconfig.tsbuildinfo`, `.planning/config.json`) are unrelated env drift — pre-existed in initial gitStatus, not Phase 49 artifacts | PASS |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `scripts/editorial/convert.ts` | 6 exports + ConvertedPage 8 fields + happy-dom parser + DOM ref + badge regex | VERIFIED | 267 lines; committed in 3a208bf (sanitizeHtml/demoteHeadings), 617b8ac (configureTurndown), 610b773 (collapseBlankLines, convertCapturedPage, convertCapturedPages, ConvertedPage extension). All exports grep-proven. |
| `scripts/editorial/turndown-plugin-gfm.d.ts` | Ambient shim for `@joplin/turndown-plugin-gfm` with `gfm`/`tables`/`taskListItems`/`strikethrough` | VERIFIED | 12 lines; committed in 617b8ac. All 4 exports declared; `TurndownService.Plugin` function type preserved. |
| `scripts/editorial/__tests__/convert.test.ts` | Hermetic unit-test suite with 14 describe blocks covering CONV-01..09 | VERIFIED | 322 lines; committed in 93eeedc. 14 describe blocks, 44 passing tests, zero filesystem I/O. All fixtures inline. |
| `scripts/editorial/types.ts` re-export | `export type { ConvertedPage } from './convert.ts'` preserved | VERIFIED | Line 13 intact; `pnpm build` composite compile passes — extended 8-field shape propagates through re-export boundary without TS2305/2315 errors. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `convertCapturedPage` | `sanitizeHtml` | direct call (line 230) | WIRED | Pipeline step 1: `const sanitized = sanitizeHtml(page.mainHtml)` |
| `convertCapturedPage` | `configureTurndown().turndown` | direct call (lines 231-232) | WIRED | Pipeline step 2-3: `const service = configureTurndown(); const rawMarkdown = service.turndown(sanitized)` |
| `convertCapturedPage` | `collapseBlankLines` | direct call (line 233) | WIRED | Pipeline step 4: `const markdown = collapseBlankLines(rawMarkdown)` |
| `configureTurndown` | `@joplin/turndown-plugin-gfm.gfm` | `service.use(gfm)` (line 185) | WIRED | GFM plugin applied AFTER custom rules so table/strikethrough/task-list rules don't shadow image/badge rules |
| `sanitizeHtml` | `happy-dom.Window` | `new Window()` (line 92) | WIRED | Fresh Window per invocation — no cross-call state leakage |
| `sanitizeHtml` | `demoteHeadings` | internal call (line 111) | WIRED | Locked sub-step 4 of 5-step pipeline |
| `convertCapturedPages` | `convertCapturedPage` | sequential for-of (lines 263-264) | WIRED | No parallelism, preserves order + length invariants |
| `convert.ts` ConvertedPage interface (8 fields) | `types.ts` re-export | `export type { ConvertedPage } from './convert.ts'` (line 13) | WIRED | TypeScript type re-export is reference-by-name — extended shape propagates automatically |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|---------------------|--------|
| `convertCapturedPage(page)` | `page.mainHtml` → `sanitized` → `rawMarkdown` → `markdown` | Input CapturedPage → happy-dom DOM → Turndown → blank-line collapse | Yes — `convert.test.ts:236` determinism fixture produces non-empty `markdown` with expected substrings (`### Page Title`, `[link](/faq)`, `**tag**`, `| A   | B   |`, etc.) | FLOWING |
| `ConvertedPage.consoleErrors/screenshotPath/cfCacheStatus` | Carried from input `CapturedPage` object | Direct property assignment (lines 240-242) | Yes — `convert.test.ts:311` metadata passthrough test asserts all 3 fields round-trip unchanged (`['err1', 'err2']`, `/abs/path/00-home.png`, `HIT`) | FLOWING |
| `configureTurndown()` → `TurndownService` | Returned service instance with rules + plugin applied | Fresh service per invocation | Yes — test suite proves pipe-table output, bold badges, alt-text-only images on real fixture HTML | FLOWING |
| `demoteHeadings` in-place mutation | `doc.querySelectorAll('h1..h6')` → new elements | DOM traversal + `createElement` + `replaceWith` | Yes — `convert.test.ts:67` heading demotion describe passes 6 distinct level-mapping assertions | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Turndown + GFM tables render as pipe-table | `pnpm test:scripts scripts/editorial/__tests__/convert.test.ts` (describe "GFM plugin — tables (CONV-01)") | 1 test passed; output contains `| Name | Role |` | PASS |
| Determinism byte-equal across 2 runs | Same command, describe "determinism self-test (CONV-02)" | 1 test passed; `expect(first).toBe(second)` on richest fixture | PASS |
| Heading demotion h1→h3..h6→h6 | Same command, describe "heading demotion (CONV-04)" | 6 it.each rows all passed | PASS |
| Full suite green | `pnpm test:scripts` | 20 files / 304 tests / 0 failures | PASS |
| Composite build exit 0 | `pnpm build` | vue-tsc -b + vite + build:markdown exit 0 | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| CONV-01 | 49-02 | Turndown 7.2.4 + `@joplin/turndown-plugin-gfm` full plugin | SATISFIED | `configureTurndown` factory + `service.use(gfm)` + pipe-table test green |
| CONV-02 | 49-01 (sanitize) + cross-cutting | DOM sanitization strips `<script>`/`<style>`/`<noscript>`/`aria-hidden="true"` subtrees + all `data-v-*` attrs; deterministic | SATISFIED | `sanitizeHtml` line 96 subtree strip + lines 100-106 attr walk + `convert.test.ts:236` byte-equal assertion |
| CONV-03 | 49-02 | Images alt-only, never base64, never image references | SATISFIED | `image-alt-only` rule at `convert.ts:152` returns `alt` or empty string; 4 test cases cover with-alt / without-alt / empty-alt / base64-src-never-emitted |
| CONV-04 | 49-01 | Heading demotion h1→h3, clamp at h6 | SATISFIED | `demoteHeadings` + `sanitizeHtml` sub-step 4; 6 it.each rows in heading-demotion describe |
| CONV-05 | 49-02 | Badge/pill/chip/tag/severity/category spans render as bold; `badge-\w+` compound variant supported | SATISFIED | `pattern158-badges` rule with explicit `badge-\w+` alternation; 8 it.each rows + icon-flatten + negative case |
| CONV-06 | 49-02/03 | DOM reading order preserved | SATISFIED | Turndown default document-order walk + sequential for-of in `convertCapturedPages`; paragraph→list→table indexOf test |
| CONV-07 | 49-02 | Hrefs preserved verbatim | SATISFIED | `linkStyle: 'inlined'` default Turndown behavior; 4 it.each rows (internal, http, https, mailto) |
| CONV-08 | 49-03 | Blank-line collapse 3+ → 2 | SATISFIED | `collapseBlankLines` ReDoS-safe regex; 6 it.each rows + idempotence test |
| CONV-09 | 49-04 | Unit tests with inline HTML fixtures for all scenarios | SATISFIED | 14 describe blocks, 44 tests, 322 lines, 100% hermetic (no fs I/O) |

No orphaned requirements — REQUIREMENTS.md lines 161 + 175 map Phase 49 to exactly CONV-01..09, all 9 satisfied.

### Anti-Patterns Found

None.

- No TODO/FIXME/XXX/HACK/PLACEHOLDER comments in convert.ts or convert.test.ts.
- No empty handlers, placeholder returns, or console.log-only implementations.
- No hardcoded empty props that reach rendering.
- SCAF-08 forbidden-token regex (`Date\.now\(\)|new Date\(|os\.EOL|Promise\.all|setTimeout|from '@/|Math\.random`) returns zero matches across all three Phase 49 source files (convert.ts, turndown-plugin-gfm.d.ts, convert.test.ts).
- Phase 46 throwing stub `convertCapturedPage: not implemented` removed (grep returns no matches) — replaced with real 4-step pipeline.

### Human Verification Required

None. Phase 49 is a pure-function library (HTML → Markdown conversion) with deterministic behavior fully asserted by hermetic unit tests. No UI, no runtime service, no external dependencies beyond installed packages. All must-haves verifiable programmatically.

### Gaps Summary

No gaps. All 5 must-haves VERIFIED, all 10 verification gates PASSED, all 9 CONV-* requirements SATISFIED, all wiring WIRED, all data-flow FLOWING, zero anti-patterns, full test suite green (304/304).

**Minor bookkeeping note (non-blocking):** ROADMAP.md line 251 still shows `- [ ] 49-04-PLAN.md` unchecked despite the plan being executed (commit 93eeedc) and the SUMMARY existing (49-04-SUMMARY.md). The actual deliverable (convert.test.ts with 44 passing tests) exists and all CONV-* requirements are `[x]`. This is a checkbox-maintenance gap, not a code gap — does not affect goal achievement or status.

---

_Verified: 2026-04-20T18:13:00Z_
_Verifier: Claude (gsd-verifier)_
