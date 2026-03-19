---
phase: 06-structural-normalization
plan: 01
subsystem: ui
tags: [vue, vitest, tdd, exhibits, badge, data-fix]

# Dependency graph
requires:
  - phase: 05-exhibit-audit
    provides: "Audit findings for STRUCT-01/02/03 structural inconsistencies"
provides:
  - "Exhibits M and N contextHeading corrected to 'Investigation Summary'"
  - "Exhibit A quote 2 attribution populated"
  - "ExhibitDetailPage renders 'Investigation Report' badge via v-if on investigationReport flag"
  - "CSS rule for .exhibit-investigation-badge positioning"
  - "5 new passing tests covering all three structural fixes"
affects: [07-content-gaps]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD RED/GREEN cycle: failing tests committed before implementation"
    - "v-if badge pattern: expertise-badge + badge-aware + component-specific class"

key-files:
  created:
  modified:
    - src/data/exhibits.ts
    - src/pages/ExhibitDetailPage.vue
    - src/assets/css/main.css
    - src/data/exhibits.test.ts
    - src/pages/ExhibitDetailPage.test.ts

key-decisions:
  - "Used .badge-aware class for investigation badge — muted/neutral, avoids color collision with teal exhibit label on dark header background"
  - "Badge placed immediately after h1 exhibit-detail-title — visible but visually subordinate to title"

patterns-established:
  - "Investigation badge pattern: <span v-if='exhibit.investigationReport' class='expertise-badge badge-aware exhibit-investigation-badge'>Investigation Report</span>"

requirements-completed: [STRUCT-01, STRUCT-02, STRUCT-03]

# Metrics
duration: 4min
completed: 2026-03-18
---

# Phase 6 Plan 01: Structural Normalization Summary

**Three audit-identified data and rendering fixes: M/N contextHeading corrected to 'Investigation Summary', Exhibit A quote 2 attribution populated, and ExhibitDetailPage now renders an 'Investigation Report' badge for forensic exhibits**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-18T09:27:09Z
- **Completed:** 2026-03-18T09:30:34Z
- **Tasks:** 2 (TDD RED + GREEN)
- **Files modified:** 5

## Accomplishments
- Exhibit M and N contextHeading aligned with J/K/L pattern ('Investigation Summary')
- Exhibit A second quote attribution populated: 'Chief of Learning Services, Electric Boat'
- ExhibitDetailPage renders 'Investigation Report' badge for exhibits with investigationReport: true — visitors can now identify forensic investigation reports
- CSS rule for .exhibit-investigation-badge added to ExhibitDetailPage section in main.css
- 5 new tests (3 data + 2 component) — full suite 17/17 green

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing tests (RED)** - `47d9331` (test)
2. **Task 2: Implement structural fixes (GREEN)** - `0c71a98` (feat)

_Note: TDD tasks have RED commit (failing tests) then GREEN commit (implementation)_

## Files Created/Modified
- `src/data/exhibits.ts` - Exhibit M/N contextHeading fixed; Exhibit A quote 2 attribution populated
- `src/pages/ExhibitDetailPage.vue` - Investigation Report badge added after h1 via v-if
- `src/assets/css/main.css` - .exhibit-investigation-badge display/margin rule added
- `src/data/exhibits.test.ts` - 3 new tests for STRUCT-01 (M/N contextHeading) and STRUCT-03 (Exhibit A attribution)
- `src/pages/ExhibitDetailPage.test.ts` - 2 new tests for STRUCT-02 (badge renders/not-renders)

## Decisions Made
- Used `.badge-aware` variant for the investigation badge — muted neutral color avoids collision with the teal exhibit label on the dark header background
- Badge placed immediately after `<h1>` to appear visually subordinate to the title

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three structural inconsistencies resolved — Exhibits M and N now visually consistent with J, K, L
- Phase 7 (Content Gaps) is user-gated — cannot begin until Dan reviews the CONT-01 content gap list
- Phase 6 is complete upon this plan's execution

---
*Phase: 06-structural-normalization*
*Completed: 2026-03-18*
