---
phase: 09-data-model-migration
plan: 01
subsystem: database
tags: [typescript, exhibit-type, discriminant-union, flagship-merge, data-model]

# Dependency graph
requires: []
provides:
  - ExhibitType union type ('investigation-report' | 'engineering-brief') exported from exhibits.ts
  - exhibitType required field on all 15 Exhibit records (5 IR, 10 EB)
  - Flagship fields (isFlagship, summary, emailCount, role) on 9 exhibits
  - Boolean flags isDetailExhibit and investigationReport removed
affects: [10-detail-template-extraction, 11-listing-page, 12-route-migration]

# Tech tracking
tech-stack:
  added: []
  patterns: [discriminant union for exhibit classification, flagship data co-location in exhibit records]

key-files:
  created: []
  modified:
    - src/data/exhibits.ts
    - src/data/exhibits.test.ts

key-decisions:
  - "D-05 Quote merge: Added flagship quotes to Exhibits C, E, J; skipped Exhibit A (already present in quotes array)"
  - "D-06 Tags merge: No new impactTags added; all flagship tags are curated subsets of existing impactTags"
  - "Classification: J, K, L, M, N as investigation-report; remaining 10 as engineering-brief per research D-03"

patterns-established:
  - "ExhibitType discriminant: use exhibitType field instead of boolean flags for exhibit classification"
  - "Flagship data co-location: flagship summary/role/emailCount live directly on Exhibit records"

requirements-completed: [DATA-01, DATA-02, DATA-03]

# Metrics
duration: 6min
completed: 2026-03-30
---

# Phase 09 Plan 01: Exhibit Data Model Migration Summary

**ExhibitType discriminant union replaces boolean flags on all 15 exhibits; 9 flagship records merged with summary, role, emailCount from portfolioFlagships.ts**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-30T21:19:14Z
- **Completed:** 2026-03-30T21:25:03Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files modified:** 2

## Accomplishments
- Added `ExhibitType` union type and required `exhibitType` field on all 15 exhibit records (5 investigation-report, 10 engineering-brief)
- Removed `isDetailExhibit` and `investigationReport` boolean flags from interface and all records
- Merged flagship data (isFlagship, summary, emailCount, role) onto 9 exhibits from portfolioFlagships.ts
- Added 8 new data validation tests (all passing alongside 7 existing tests)

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Failing tests for exhibitType and flagship merge** - `a9f0b29` (test)
2. **Task 1 GREEN: Migrate Exhibit interface with flagship merge** - `892cf8a` (feat)

## Files Created/Modified
- `src/data/exhibits.ts` - Updated Exhibit interface with ExhibitType discriminant and flagship fields; all 15 records populated with exhibitType, 9 with flagship data
- `src/data/exhibits.test.ts` - Added 8 data validation tests for type counts, flagship presence, boolean removal

## Decisions Made
- D-05 (Quote merge): Flagship quote for Exhibit A already present in quotes array -- skipped. Added flagship quotes to Exhibits C, E, J as new entries with attribution from flagship client field.
- D-06 (Tags merge): Compared all 9 flagship tag arrays against exhibit impactTags. All flagship tags are curated subsets or reframings of existing impactTags. No new tags appended to any exhibit.
- Classification follows research D-03: investigation-reports are J (GM), K (Microsoft MCAPS), L (Power Platform), M (SCORM Debugger), N (BP). All others are engineering-briefs.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all data fields are populated with real content from portfolioFlagships.ts.

## Issues Encountered
- `vitest -x` flag not supported in vitest v4.1.0; used `--bail 1` instead
- Type check shows expected consumer errors in ExhibitCard.vue, ExhibitCard.test.ts, ExhibitCard.stories.ts, and ExhibitDetailPage.vue referencing removed boolean fields -- these are expected and will be fixed in Plan 02

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- ExhibitType discriminant and flagship data are ready for Plan 02 (consumer component updates)
- Type errors in ExhibitCard and ExhibitDetailPage are expected -- Plan 02 will update these consumers to use exhibitType instead of boolean flags
- All data-level tests pass; no regressions

## Self-Check: PASSED

All files exist, all commits verified.

---
*Phase: 09-data-model-migration*
*Completed: 2026-03-30*
