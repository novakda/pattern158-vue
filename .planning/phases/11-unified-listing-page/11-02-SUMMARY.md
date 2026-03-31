---
phase: 11-unified-listing-page
plan: 02
subsystem: ui
tags: [vue, css, testing, cleanup, case-files]

# Dependency graph
requires:
  - phase: 11-unified-listing-page
    plan: 01
    provides: CaseFilesPage.vue, ExhibitCard type class
provides:
  - Border accent CSS for type-aware cards on Case Files page
  - CaseFilesPage unit tests covering all LIST requirements
  - ExhibitCard type class unit tests (LIST-03)
affects: [12-route-migration, 13-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns: [CSS scoped border accents via body class, vitest page-level testing]

key-files:
  created: [src/pages/CaseFilesPage.test.ts]
  modified: [src/assets/css/main.css, src/components/ExhibitCard.test.ts]
  deleted: [src/components/NarrativeCard.vue, src/components/NarrativeCard.stories.ts]

key-decisions:
  - "Border accents use same tokens as badge colors: --color-text-muted for IR, --color-primary for EB"
  - "NarrativeCard deleted without removing PortfolioPage import -- expected breakage per D-08, PortfolioPage retired in Phase 13"

patterns-established:
  - "Page-scoped CSS via useBodyClass: .page-case-files selector scopes card styles to one page"

requirements-completed: [LIST-03, CLN-01, CLN-02]

# Metrics
duration: 13min
completed: 2026-03-31
---

# Phase 11 Plan 02: Visual Type Distinction, Cleanup, and Tests Summary

**Border accent CSS for type-grouped exhibit cards, NarrativeCard deletion (CLN-02), and comprehensive unit tests for ExhibitCard type class and CaseFilesPage**

## Performance

- **Duration:** 13 min
- **Started:** 2026-03-31T23:19:12Z
- **Completed:** 2026-03-31T23:32:00Z
- **Tasks:** 2
- **Files modified:** 4 (2 modified, 1 created, 2 deleted)

## Accomplishments

- Added border accent CSS scoped under `.page-case-files` for visual type differentiation
- Investigation Report cards get gray left border (`--color-text-muted`), Engineering Brief cards get teal (`--color-primary`)
- Deleted NarrativeCard.vue and NarrativeCard.stories.ts (CLN-02 complete)
- ExhibitCard test updated with type class assertions for both exhibit types (LIST-03)
- CaseFilesPage test created with 6 test cases covering all listing requirements
- Full unit test suite passes (50 tests across 8 files)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add border accent CSS and delete NarrativeCard files** - `5de1695` (feat)
2. **Task 2: Create CaseFilesPage tests and update ExhibitCard type class test** - `bb22ee8` (test)

## Files Created/Modified

- `src/assets/css/main.css` - Border accent rules for `.type-investigation-report` and `.type-engineering-brief`
- `src/components/ExhibitCard.test.ts` - Added type class assertion describe block (LIST-03)
- `src/pages/CaseFilesPage.test.ts` - New test file with 6 test cases (15 exhibits, type grouping, stats, directory, no Three Lenses, hero)
- `src/components/NarrativeCard.vue` - DELETED (CLN-02)
- `src/components/NarrativeCard.stories.ts` - DELETED (CLN-02)

## Decisions Made

- Border accents reuse badge token values for visual consistency (gray=IR, teal=EB)
- NarrativeCard deleted without fixing PortfolioPage import -- expected breakage per D-08, PortfolioPage retired in Phase 13

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Known Stubs

None - all data is wired from exhibits.ts, no placeholder content.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 11 complete: CaseFilesPage with type-grouped exhibits, border accents, and full test coverage
- Route registration deferred to Phase 12
- PortfolioPage cleanup (removing NarrativeCard import) deferred to Phase 13

## Self-Check: PASSED

- All created files verified on disk
- All deleted files confirmed removed
- All commit hashes found in git log

---
*Phase: 11-unified-listing-page*
*Completed: 2026-03-31*
