---
phase: 12-navigation-and-route-migration
plan: 01
subsystem: ui
tags: [vue-router, navigation, routing, redirects]

# Dependency graph
requires:
  - phase: 11-unified-listing-page
    provides: CaseFilesPage component at /case-files target
provides:
  - /case-files route with lazy-loaded CaseFilesPage
  - /portfolio and /testimonials redirect to /case-files
  - NavBar with 6 entries including Case Files
  - All 13 route references migrated to /case-files
affects: [13-dead-page-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns: [vue-router redirect for deprecated routes]

key-files:
  created: []
  modified:
    - src/router.ts
    - src/router.test.ts
    - src/components/NavBar.vue
    - src/components/HomeHero.vue
    - src/pages/HomePage.vue
    - src/components/ContactMethods.vue
    - src/components/exhibit/EngineeringBriefLayout.vue
    - src/components/exhibit/InvestigationReportLayout.vue
    - src/pages/ExhibitDetailPage.test.ts
    - src/components/CtaButtons.stories.ts

key-decisions:
  - "Used vue-router redirect objects instead of component-based redirect pages for /portfolio and /testimonials"

patterns-established:
  - "Route redirect pattern: { path: '/old', redirect: '/new' } with no component property"

requirements-completed: [NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, CLN-04, CLN-05]

# Metrics
duration: 2min
completed: 2026-03-31
---

# Phase 12 Plan 01: Navigation and Route Migration Summary

**Atomic migration of all 13 route references from /portfolio and /testimonials to /case-files with router redirects and 4 new tests**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-01T04:12:11Z
- **Completed:** 2026-04-01T04:14:02Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Added /case-files route with lazy-loaded CaseFilesPage component
- Set up /portfolio and /testimonials as pure redirects to /case-files (no component imports)
- Updated NavBar from 7 items to 6 items (Portfolio + Field Reports replaced by Case Files)
- Migrated all 13 hardcoded route references across 8 source files
- Added 4 new router tests (7 total), full suite of 54 tests passing

## Task Commits

Each task was committed atomically:

1. **Task 1: Add /case-files route, redirects, and route tests** - `f9a87a3` (feat)
2. **Task 2: Update all hardcoded route references across 8 files** - `997e182` (feat)

## Files Created/Modified
- `src/router.ts` - Added /case-files route, converted /portfolio and /testimonials to redirects
- `src/router.test.ts` - Added 4 new tests for /case-files route and redirects
- `src/components/NavBar.vue` - Replaced Portfolio+Field Reports with single Case Files entry
- `src/components/HomeHero.vue` - CTA now reads "View Case Files" linking to /case-files
- `src/pages/HomePage.vue` - Testimonial CTA reads "View All Case Files" linking to /case-files
- `src/components/ContactMethods.vue` - Portfolio link updated to case-files
- `src/components/exhibit/EngineeringBriefLayout.vue` - Back-nav says "Back to Case Files"
- `src/components/exhibit/InvestigationReportLayout.vue` - Back-nav says "Back to Case Files"
- `src/pages/ExhibitDetailPage.test.ts` - Updated back-nav test assertion to /case-files
- `src/components/CtaButtons.stories.ts` - Updated story args to /case-files

## Decisions Made
- Used vue-router redirect objects ({ redirect: '/case-files' }) instead of component-based redirects for /portfolio and /testimonials -- cleaner, no component imports needed
- Kept PortfolioPage.vue and TestimonialsPage.vue files intact -- deletion is Phase 13 scope

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All route references migrated; /case-files is the canonical path for the unified listing
- PortfolioPage.vue and TestimonialsPage.vue are dead code ready for Phase 13 cleanup
- Zero stale /portfolio or /testimonials references remain in active source files

---
*Phase: 12-navigation-and-route-migration*
*Completed: 2026-03-31*
