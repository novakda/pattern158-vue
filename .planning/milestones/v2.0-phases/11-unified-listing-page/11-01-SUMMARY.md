---
phase: 11-unified-listing-page
plan: 01
subsystem: ui
tags: [vue, exhibit-card, case-files, listing-page, portfolio]

# Dependency graph
requires:
  - phase: 09-exhibit-data-model
    provides: exhibitType discriminant on Exhibit interface, exhibits.ts single source of truth
provides:
  - CaseFilesPage.vue unified listing page with type-grouped exhibits
  - ExhibitCard.vue type-specific CSS class on root element
affects: [11-02-styling, 12-route-migration, 13-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns: [type-grouped exhibit filtering, dynamic CSS class from data model]

key-files:
  created: [src/pages/CaseFilesPage.vue]
  modified: [src/components/ExhibitCard.vue]

key-decisions:
  - "Project directory copied verbatim from PortfolioPage -- no data-driven refactor per plan decision"
  - "No style section in CaseFilesPage -- border accents deferred to Plan 02 per plan spec"

patterns-established:
  - "Type-grouped filtering: exhibits.filter(e => e.exhibitType === 'type') for section separation"
  - "Dynamic type class: 'type-' + exhibit.exhibitType on card root for parent-scoped styling"

requirements-completed: [LIST-01, LIST-02, LIST-03, LIST-04, LIST-05, CLN-01]

# Metrics
duration: 3min
completed: 2026-03-31
---

# Phase 11 Plan 01: Unified Listing Page Summary

**CaseFilesPage with hero, stats bar, two type-grouped exhibit sections (5 IR + 10 EB), and 38-row project directory; ExhibitCard root element gains dynamic type class**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-31T23:03:13Z
- **Completed:** 2026-03-31T23:17:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- ExhibitCard root element now includes `type-investigation-report` or `type-engineering-brief` class for parent-scoped styling
- CaseFilesPage.vue created with evidence-first layout: Hero, Stats, Investigation Reports, Engineering Briefs, Project Directory
- All 15 exhibits rendered in two type-grouped sections via exhibits.filter()
- Project directory with 7 industry tables and 38 rows copied verbatim from PortfolioPage
- No Three Lenses, NarrativeCard, or TestimonialsMetrics content included (CLN-01 satisfied)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add exhibitType CSS class to ExhibitCard root element** - `e10582a` (feat)
2. **Task 2: Create CaseFilesPage.vue with full content** - `579fe42` (feat)

## Files Created/Modified
- `src/components/ExhibitCard.vue` - Dynamic type class on root div via :class binding
- `src/pages/CaseFilesPage.vue` - Unified Case Files listing page (149 lines)

## Decisions Made
- Project directory copied verbatim from PortfolioPage (inline HTML tables) -- no data-driven refactor, consistent with plan direction to keep existing class names
- No `<style>` section added to CaseFilesPage -- border accent CSS goes in main.css in Plan 02

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- CaseFilesPage.vue ready for Plan 02 styling (border accents, type-specific visual differentiation)
- ExhibitCard type class hook in place for CSS targeting
- Route registration deferred to Phase 12

## Self-Check: PASSED

- All files verified on disk
- All commit hashes found in git log

---
*Phase: 11-unified-listing-page*
*Completed: 2026-03-31*
