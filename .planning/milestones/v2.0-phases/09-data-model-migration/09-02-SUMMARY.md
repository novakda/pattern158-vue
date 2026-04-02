---
phase: 09-data-model-migration
plan: 02
subsystem: ui
tags: [vue-components, exhibitType, discriminant-union, storybook, vitest]

# Dependency graph
requires:
  - phase: 09-data-model-migration plan 01
    provides: ExhibitType discriminant union and updated Exhibit interface
provides:
  - ExhibitCard using exhibitType for CTA text (investigation-report vs engineering-brief)
  - ExhibitDetailPage with type-specific badges (badge-aware for IR, badge-deep for EB)
  - All consumer tests passing with exhibitType-based assertions
  - Storybook stories using exhibitType field
affects: [10-detail-template-extraction, 11-listing-page]

# Tech tracking
tech-stack:
  added: []
  patterns: [type-discriminant conditional rendering in Vue templates]

key-files:
  created: []
  modified:
    - src/components/ExhibitCard.vue
    - src/pages/ExhibitDetailPage.vue
    - src/assets/css/main.css
    - src/components/ExhibitCard.test.ts
    - src/pages/ExhibitDetailPage.test.ts
    - src/components/ExhibitCard.stories.ts

key-decisions:
  - "Hardcoded detail-exhibit class on ExhibitCard since all 15 exhibits now have detail pages"
  - "badge-aware (gray/muted) for Investigation Report, badge-deep (teal/primary) for Engineering Brief per D-15"
  - "Renamed exhibit-investigation-badge to exhibit-type-badge as general-purpose layout class"

patterns-established:
  - "ExhibitType conditional rendering: use exhibit.exhibitType === 'value' pattern in Vue templates"

requirements-completed: [DATA-01, DATA-02]

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 09 Plan 02: Consumer Component Migration Summary

**ExhibitCard and ExhibitDetailPage updated to use exhibitType discriminant with type-specific CTA text, badges, and distinct badge colors; all 27 unit tests passing**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-30T21:27:27Z
- **Completed:** 2026-03-30T21:29:47Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- ExhibitCard now shows "View Full Investigation Report" for investigation-report and "View Engineering Brief" for engineering-brief exhibits
- ExhibitCard detail-exhibit class hardcoded (no longer conditional on removed isDetailExhibit flag)
- ExhibitDetailPage renders type-specific badges with distinct colors (badge-aware gray for IR, badge-deep teal for EB)
- All consumer tests rewritten for exhibitType, Storybook stories updated, zero boolean flag references remain

## Task Commits

Each task was committed atomically:

1. **Task 1: Update ExhibitCard and ExhibitDetailPage components** - `5714ccb` (feat)
2. **Task 2: Update component tests and Storybook stories** - `1accd4b` (test)

## Files Created/Modified
- `src/components/ExhibitCard.vue` - Hardcoded detail-exhibit class, exhibitType-based CTA text
- `src/pages/ExhibitDetailPage.vue` - Type-specific badges with badge-aware/badge-deep styling
- `src/assets/css/main.css` - Renamed .exhibit-investigation-badge to .exhibit-type-badge
- `src/components/ExhibitCard.test.ts` - 2 tests using exhibitType (was 3 with boolean flags)
- `src/pages/ExhibitDetailPage.test.ts` - Badge tests for both investigation-report and engineering-brief
- `src/components/ExhibitCard.stories.ts` - 4 stories using exhibitType field

## Decisions Made
- Hardcoded detail-exhibit class since all 15 exhibits have detail pages (per D-11)
- Used badge-aware for Investigation Report and badge-deep for Engineering Brief per D-15
- Renamed CSS class from exhibit-investigation-badge to exhibit-type-badge for generality
- Removed third ExhibitCard test ("absent/undefined" case) since exhibitType is now required

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added exhibitType to WithoutLink story**
- **Found during:** Task 2 (Storybook stories)
- **Issue:** WithoutLink story was missing exhibitType field entirely, causing TS2741 error since exhibitType is now required
- **Fix:** Added `exhibitType: 'engineering-brief' as const` to the WithoutLink story args
- **Files modified:** src/components/ExhibitCard.stories.ts
- **Verification:** vue-tsc --noEmit passes clean
- **Committed in:** 1accd4b (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Required addition for type correctness. No scope creep.

## Known Stubs

None - all components render real data from exhibit records.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All consumer files migrated to exhibitType discriminant
- Full TypeScript compilation passes with zero errors
- All 27 unit tests pass
- Ready for Plan 03 (cleanup of removed data sources) and Phase 10 (detail template extraction)

## Self-Check: PASSED

All files exist, all commits verified.

---
*Phase: 09-data-model-migration*
*Completed: 2026-03-30*
