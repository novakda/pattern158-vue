---
phase: 05-exhibit-audit
plan: 01
subsystem: audit
tags: [playwright, screenshots, content-audit, exhibits, 11ty, markdown]

# Dependency graph
requires:
  - phase: 04-exhibit-detail-pages
    provides: ExhibitDetailPage.vue rendering template and exhibits.ts data model
provides:
  - "45 Playwright screenshots of all 15 exhibits at 375px, 768px, 1280px"
  - "05-01-AUDIT.md: complete structured exhibit audit with comparison table, classified variations, investigationReport rendering gap finding, 11ty cross-reference, best-of-breed assessment, and Phase 6/7 recommended actions"
affects:
  - "06-structural-normalization: STRUCT-01 (contextHeading M/N), STRUCT-02 (investigationReport rendering), STRUCT-03 (Exhibit A attribution)"
  - "07-content-gap-fill: CONT-01 gap list (Exhibit A and D confirmed gaps, Exhibit C optional), CONT-02 user gate"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Playwright CJS script (.cjs extension required when package.json has type:module) for one-off screenshot capture"
    - "Four-category audit classification schema: intentional / formatting-inconsistency / content-gap / needs-review"

key-files:
  created:
    - ".planning/phases/05-exhibit-audit/screenshot-exhibits.cjs"
    - ".planning/phases/05-exhibit-audit/screenshots/ (45 PNG files)"
    - ".planning/phases/05-exhibit-audit/05-01-AUDIT.md"
  modified: []

key-decisions:
  - "screenshot-exhibits.js renamed to .cjs: package.json type:module requires CJS files to use .cjs extension"
  - "Best-of-breed: Exhibits F/G/H/I are the normalization reference target (quote + context + tags); J/K/L are investigation report sub-reference"
  - "Exhibit C classified intentional (not content-gap): the 11ty quotes would enrich but the current exhibits.ts accurately represents the core message"
  - "Exhibit H quote consolidation classified intentional: combined attribution is accurate and representative"
  - "Exhibit G missing follow-up quote ('Do you have a figure?') noted as minor enrichment opportunity, not a critical gap"

patterns-established:
  - "Audit classification is applied at the row level (most significant variation per exhibit), not field level"
  - "Content-gap requires: (a) content exists in 11ty source AND (b) content is absent from exhibits.ts; absent fields with no 11ty source content are intentional or needs-review"

requirements-completed: [AUDIT-01, AUDIT-02]

# Metrics
duration: 70min
completed: 2026-03-18
---

# Phase 5 Plan 01: Exhibit Audit Summary

**Structured audit of all 15 exhibit detail pages: comparison table with 15 rows x 8 columns, investigationReport rendering gap named as concrete finding, all 15 11ty source files cross-referenced, 45 Playwright screenshots captured, and Phase 6/7 action handoff written**

## Performance

- **Duration:** ~70 min (including 15 11ty source fetches and screenshot capture)
- **Started:** 2026-03-18T08:53:56Z
- **Completed:** 2026-03-18T10:03:26Z
- **Tasks:** 2 (Task 2 and Task 3; Task 1 was human-action completed prior to this agent)
- **Files modified:** 3 created (screenshot-exhibits.cjs, screenshots/ directory with 45 PNGs, 05-01-AUDIT.md)

## Accomplishments

- Captured all 45 screenshots (15 exhibits x 3 breakpoints: 375, 768, 1280px) using Playwright via dev server on port 5178
- Fetched all 15 11ty source HTML files from the deploy branch; confirmed content gaps on Exhibit A (missing contextText, 5+ additional quotes) and Exhibit D (missing contextText + second quote)
- Wrote a 438-line standalone audit document covering: comparison table, 7 classified variation subsections, named `investigationReport` rendering gap finding, per-exhibit 11ty cross-reference, best-of-breed visual assessment, and structured Phase 6/7 recommended actions
- All 12 vitest tests pass — no regressions (phase makes no application code changes)

## Task Commits

1. **Task 2: Screenshot capture** — `f4fd189` (feat: 45 screenshots + screenshot-exhibits.cjs)
2. **Task 3: Audit document** — `0dffca6` (feat: 05-01-AUDIT.md, 438 lines, all 7 sections)

## Files Created/Modified

- `.planning/phases/05-exhibit-audit/screenshot-exhibits.cjs` — Playwright script for capturing all 45 exhibit screenshots at 3 breakpoints
- `.planning/phases/05-exhibit-audit/screenshots/` — 45 PNG files (exhibit-a-375.png through exhibit-o-1280.png), all non-zero size
- `.planning/phases/05-exhibit-audit/05-01-AUDIT.md` — Complete exhibit audit document (primary deliverable)

## Decisions Made

- **screenshot-exhibits.cjs extension:** The plan specified `.js` but this project has `"type": "module"` in package.json, which causes Node to parse `.js` files as ESM. The CJS `require()` syntax in the script fails in ESM mode. Rule 3 (blocking issue) — renamed to `.cjs` so Node treats it as CommonJS.
- **Best-of-breed selection:** After reviewing all screenshots at 1280px, selected Exhibits F, G, H, I as the normalization reference group (quote + context + tags = standard complete structure). Exhibit B selected as dual-quote variant reference. Exhibits J, K, L selected as investigation summary sub-reference. Exhibit D identified as the worst-case sparse state (1 quote + tags, nothing else).
- **Exhibit C classification:** The 11ty source contains quotable material (Content Team Manager's "The Fiddler" nickname quote with 600 hours savings). Classified as `intentional` rather than `content-gap` because the current exhibits.ts accurately represents the exhibit's core message. The 11ty quotes are enrichment, not missing structural content. Noted in audit for Dan's awareness.
- **Exhibit H quote consolidation:** The 11ty source has 3 separate quotes; exhibits.ts has 1 combined with attribution "GP Strategies (combined from respondents)". Classified as `intentional` — the consolidation is disclosed and accurate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Renamed screenshot script from .js to .cjs**
- **Found during:** Task 2 (first script execution)
- **Issue:** `package.json` has `"type": "module"` which causes Node to treat `.js` files as ESM. The CJS `require('playwright')` call throws `ReferenceError: require is not defined in ES module scope`.
- **Fix:** Renamed `screenshot-exhibits.js` to `screenshot-exhibits.cjs`. No code changes — only file extension changed.
- **Files modified:** `.planning/phases/05-exhibit-audit/screenshot-exhibits.cjs` (renamed from .js)
- **Verification:** Script ran successfully, all 45 screenshots captured.
- **Committed in:** f4fd189 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 3 — blocking)
**Impact on plan:** Minimal. File extension change only; the script content and behavior are identical to the plan specification. The `.cjs` extension is the correct approach for CJS scripts in ESM packages.

## Issues Encountered

- None beyond the .js/.cjs extension issue documented above.

## User Setup Required

None — no external service configuration required. The dev server (Task 1) was confirmed running at http://localhost:5178 before this agent was spawned.

## Next Phase Readiness

**Phase 6 (Structural Normalization) is ready to begin.** The audit provides:
- STRUCT-01 target: change `contextHeading` on Exhibits M and N from `"Context"` to `"Investigation Summary"` (2 exhibit entries, 1-line change each)
- STRUCT-02 target: implement `investigationReport` rendering in `ExhibitDetailPage.vue` (requires Dan to confirm semantic mapping before implementation)
- STRUCT-03 target: populate empty `attribution` on Exhibit A, quote 2 (1-line change: `"Chief of Learning Services, Electric Boat"`)

**Phase 7 (Content Gap Fill) is blocked by CONT-02 gate.** Dan must review and approve the CONT-01 gap list from `05-01-AUDIT.md` Section 7.2 before any `exhibits.ts` content changes can proceed.

---
*Phase: 05-exhibit-audit*
*Completed: 2026-03-18*

## Self-Check: PASSED

- screenshot-exhibits.cjs: FOUND
- screenshots/ (45 PNGs): FOUND
- 05-01-AUDIT.md: FOUND
- 05-01-SUMMARY.md: FOUND
- f4fd189 (task 2 commit): FOUND
- 0dffca6 (task 3 commit): FOUND
