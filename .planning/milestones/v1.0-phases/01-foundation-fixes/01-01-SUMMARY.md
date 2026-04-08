---
phase: 01-foundation-fixes
plan: 01
subsystem: ui
tags: [vue3, accessibility, a11y, routing, fragment-template]

# Dependency graph
requires: []
provides:
  - Three page templates refactored to Vue 3 fragments (no duplicate main landmark)
  - ContactPage HeroMinimal import fixed
  - NotFoundPage with useBodyClass, useSeo, and home link
  - Router catch-all route as last entry pointing to NotFoundPage
affects: [all-pages, phase-2, phase-3]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Vue 3 fragment pattern: page templates use multiple section roots, no wrapper div or main"
    - "Body class scoping: useBodyClass provides CSS namespace, page wrapper divs are redundant"
    - "Catch-all route: /:pathMatch(.*)*  as last router entry handles all unknown URLs"

key-files:
  created:
    - src/pages/NotFoundPage.vue
  modified:
    - src/pages/TechnologiesPage.vue
    - src/pages/ContactPage.vue
    - src/pages/HomePage.vue
    - src/router.ts

key-decisions:
  - "Pages must not contain main elements — App.vue owns the single main#main-content landmark"
  - "Vue 3 fragments (multiple root nodes) are the correct page template pattern, following PhilosophyPage as reference"
  - "NotFoundPage uses same composable pattern as all other pages (useBodyClass + useSeo)"

patterns-established:
  - "Fragment pattern: page templates start directly with section elements, no wrapping div or main"
  - "Catch-all route must be last in routes array — Vue Router matches first-wins"

requirements-completed: [A11Y-01]

# Metrics
duration: 10min
completed: 2026-03-16
---

# Phase 1 Plan 01: Foundation Fixes — Nested Main + 404 Summary

**Removed duplicate main landmark from three pages and added 404 catch-all route with NotFoundPage using Vue 3 fragment pattern**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-16T22:00:00Z
- **Completed:** 2026-03-16T22:10:33Z
- **Tasks:** 2
- **Files modified:** 5 (3 modified, 1 created, 1 modified)

## Accomplishments
- Eliminated duplicate main#main-content landmark in TechnologiesPage, ContactPage, and HomePage — DOM now has exactly one main per route (from App.vue)
- Fixed pre-existing missing HeroMinimal import in ContactPage (was rendered but import was absent)
- Created NotFoundPage with correct structure: useBodyClass, useSeo, h1, home link, no main wrapper
- Added catch-all route as last entry in router.ts — unknown routes now show NotFoundPage instead of blank screen

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove nested main wrappers from TechnologiesPage, ContactPage, and HomePage** - `3712941` (fix)
2. **Task 2: Create NotFoundPage and add catch-all route** - `da405af` (feat)

## Files Created/Modified
- `src/pages/TechnologiesPage.vue` - Removed outer div.page-technologies and inner main#main-content; template is now a Vue 3 fragment starting with HeroMinimal
- `src/pages/ContactPage.vue` - Removed main#main-content wrapper; added missing HeroMinimal import
- `src/pages/HomePage.vue` - Removed main#main-content wrapper; template is now a Vue 3 fragment starting with section.hero
- `src/pages/NotFoundPage.vue` - New 404 page with useBodyClass('page-not-found'), useSeo, h1 "Page Not Found", RouterLink home button
- `src/router.ts` - Added /:pathMatch(.*)*  catch-all route as last entry, lazy-importing NotFoundPage

## Decisions Made
- Vue 3 fragment pattern confirmed as the standard for all page templates — PhilosophyPage was already using this correctly and served as the reference
- Body class scoping via useBodyClass makes wrapper divs redundant — the CSS namespace comes from the body class, not a wrapper element

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three pages are now valid HTML fragments — no duplicate ARIA landmark violations
- 404 handling is live — unmatched routes show a proper page instead of blank screen
- ContactPage HeroMinimal import fixed — component was rendering via global registration quirk but is now properly imported
- Ready to proceed with Phase 1 Plan 02

---
*Phase: 01-foundation-fixes*
*Completed: 2026-03-16*
