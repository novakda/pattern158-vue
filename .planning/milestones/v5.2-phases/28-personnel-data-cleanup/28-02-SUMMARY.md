---
phase: 28-personnel-data-cleanup
plan: 02
subsystem: database
tags: [json, personnel, data-cleanup, entryType, validation]

requires:
  - phase: 28-personnel-data-cleanup/01
    provides: "PersonnelEntry interface with entryType field, Exhibit L normalized schema"
provides:
  - "Clean personnel data with entryType on all 66 entries across 14 exhibits"
  - "Validation test suite for DATA-01, DATA-04, DATA-05 requirements"
affects: [phase-29-card-ux-rendering]

tech-stack:
  added: []
  patterns: ["title merge with em-dash for role descriptions", "slash merge for redundant titles"]

key-files:
  created: []
  modified:
    - src/data/json/exhibits.json
    - src/data/exhibits.test.ts

key-decisions:
  - "Actual personnel count is 66 (not 83 as plan estimated) — plan overcounted"
  - "Exhibits A and B group entries keep name field per plan spec; other groups move name to title"
  - "Em-dash merge pattern for title+description; slash merge for redundant role titles"

patterns-established:
  - "entryType discriminant on all personnel entries enables type-aware card rendering"

requirements-completed: [DATA-01, DATA-04, DATA-05]

duration: 4min
completed: 2026-04-07
---

# Phase 28 Plan 02: Personnel Data Cleanup Summary

**Fixed 26 title-as-name field misplacements across 12 exhibits and added entryType markers to all 66 personnel entries (29 individual, 7 group, 30 anonymized)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-08T03:47:20Z
- **Completed:** 2026-04-08T03:51:40Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Removed titles/roles from name fields across 26 entries in 12 exhibits (B,C,D,F,G,H,I,J,K,N)
- Added entryType markers to all 66 personnel entries: 29 individual, 7 group, 30 anonymized
- Added 8 validation tests confirming DATA-01, DATA-04, DATA-05 requirements
- All 95 tests passing, TypeScript compiles cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix title-as-name entries and add entryType to all personnel** - `cc3d8de` (feat)
2. **Task 2: Add comprehensive validation tests for DATA-01, DATA-04, DATA-05** - `4fcfa18` (test)

## Files Created/Modified
- `src/data/json/exhibits.json` - Fixed 26 title-as-name entries, added entryType to all 66 personnel entries
- `src/data/exhibits.test.ts` - Added 8 validation tests, updated 1 existing test for entryType population

## Decisions Made
- Actual personnel count is 66, not 83 as the plan estimated (plan overcounted). Test assertions use correct count.
- Group entries in Exhibits A and B keep the `name` field (per plan spec "name is acceptable for groups"); other group entries move name to title with em-dash merge
- Title merge patterns: em-dash ("OldName -- Description") for role+description, slash ("Title1 / Title2") for redundant role titles (Exhibits H, J)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected personnel total count from 83 to 66**
- **Found during:** Task 1
- **Issue:** Plan stated 83 total personnel entries but actual count across 14 exhibits is 66
- **Fix:** Used correct count of 66 in test assertions; classification breakdown: 29 individual + 7 group + 30 anonymized = 66
- **Files modified:** src/data/exhibits.test.ts
- **Committed in:** 4fcfa18

---

**Total deviations:** 1 auto-fixed (1 bug in plan specification)
**Impact on plan:** Count correction only. All transformations and classifications executed exactly as specified per exhibit.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All personnel entries have correct field placement and typed classification
- entryType discriminant enables Phase 29 card UX rendering with type-aware display
- No blockers

---
*Phase: 28-personnel-data-cleanup*
*Completed: 2026-04-07*
