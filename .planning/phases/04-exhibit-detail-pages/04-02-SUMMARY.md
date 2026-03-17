---
phase: 04-exhibit-detail-pages
plan: 02
subsystem: ui
tags: [vue3, vue-router, vitest, tdd, unhead, seo, composables]

# Dependency graph
requires:
  - phase: 04-01
    provides: /exhibits/:slug route and 15-entry exhibits data array with ExhibitDetailPage.vue stub

provides:
  - ExhibitDetailPage.vue: full dynamic exhibit detail page with slug lookup, custom header, conditional sections, TechTags, not-found redirect, and dynamic SEO
  - ExhibitDetailPage.test.ts: 4 unit tests covering slug render, label render, portfolio link, and unknown-slug redirect

affects:
  - Portfolio page (FlagshipCard/ExhibitCard router-links now resolve to real content)
  - v1.0 launch (PAGE-03, PAGE-05 requirements closed)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useHead(computed(...)) for dynamic reactive SEO titles (useSeo not suitable for computed values)"
    - "Vue 3 fragment pattern: single root div with v-if guard instead of template fragment"
    - "Stub router-link-stub selector pattern in tests: wrapper.find('[to=\"/portfolio\"]') instead of findAllComponents by name"

key-files:
  created:
    - src/pages/ExhibitDetailPage.vue
    - src/pages/ExhibitDetailPage.test.ts
  modified: []

key-decisions:
  - "router-link-stub in Vue Test Utils renders with attribute selector — use wrapper.find('[to=\"/portfolio\"]') not findAllComponents({ name: 'RouterLink' })"
  - "useHead(computed(...)) used for dynamic title — useSeo() only accepts plain strings and cannot react to slug changes"

patterns-established:
  - "Dynamic page SEO: useHead(computed(() => ({ title: ..., meta: [...] }))) for slug-based pages"
  - "Unknown slug redirect: synchronous router.replace({ name: 'not-found' }) in script setup before template renders"

requirements-completed: [PAGE-03, PAGE-05]

# Metrics
duration: 2min
completed: 2026-03-17
---

# Phase 4 Plan 02: ExhibitDetailPage Summary

**Dynamic exhibit detail page with slug lookup, custom header (label/client/date/title), conditional content sections, TechTags, and not-found redirect — closes PAGE-03 and PAGE-05**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-17T22:31:49Z
- **Completed:** 2026-03-17T22:33:54Z
- **Tasks:** 2 (TDD: RED + GREEN)
- **Files modified:** 2

## Accomplishments
- ExhibitDetailPage.vue fully implemented: slug lookup from exhibits array, custom header, Back to Portfolio link, conditional quotes/context/resolutionTable sections, TechTags for impactTags, not-found redirect, dynamic SEO via useHead(computed(...)), useBodyClass
- 4 unit tests written and passing: slug render, label render, portfolio link presence, unknown-slug redirect
- Full test suite green: 12/12 tests pass across 4 test files
- No `<main>` wrapper (Vue 3 fragment), no `v-html` anywhere

## Task Commits

Each task was committed atomically:

1. **Task 1: Write ExhibitDetailPage unit test scaffold (RED)** - `33f0fe2` (test)
2. **Task 2: Implement ExhibitDetailPage.vue (GREEN)** - `8193b31` (feat)

_Note: TDD plan — test commit (RED) followed by implementation commit (GREEN)_

## Files Created/Modified
- `src/pages/ExhibitDetailPage.vue` - Full dynamic exhibit detail page replacing stub; slug lookup, custom header, conditional sections, TechTags, not-found redirect, dynamic SEO
- `src/pages/ExhibitDetailPage.test.ts` - 4 unit tests: known-slug render, label render, Back to Portfolio link, unknown-slug redirect

## Decisions Made
- Used `useHead(computed(...))` for dynamic SEO title instead of `useSeo()` — `useSeo()` takes plain strings and cannot react to route slug changes; `useHead` with a `computed` ref provides reactivity
- `wrapper.find('[to="/portfolio"]')` selector used in tests instead of `findAllComponents({ name: 'RouterLink' })` — Vue Test Utils renders `RouterLink: true` stubs as `<router-link-stub>` DOM elements with attribute selectors, not named components

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed test assertion for stubbed RouterLink**
- **Found during:** Task 2 (implement ExhibitDetailPage.vue — GREEN phase)
- **Issue:** Test used `findAllComponents({ name: 'RouterLink' })` to find the Back to Portfolio link, but Vue Test Utils renders `RouterLink: true` stubs as `<router-link-stub>` elements, not as named components; `findAllComponents` returned empty, causing `portfolioLink` to be undefined
- **Fix:** Changed test assertion to `wrapper.find('[to="/portfolio"]').exists()` — directly queries the stub DOM element by its `to` attribute
- **Files modified:** `src/pages/ExhibitDetailPage.test.ts`
- **Verification:** Test passes; all 4 tests green
- **Committed in:** `8193b31` (Task 2 feat commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in test assertion)
**Impact on plan:** Required fix for test correctness. Component implementation matches plan exactly; only test query strategy adjusted.

## Issues Encountered
- Vue Test Utils router-link stub behavior: `RouterLink: true` creates a `<router-link-stub>` DOM element with attribute selectors, not a named component findable via `findAllComponents`. Resolved by using attribute selector in `wrapper.find()`.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- ExhibitDetailPage.vue is fully functional; all exhibit router-links from ExhibitCard and FlagshipCard now resolve to rendered content
- PAGE-03 and PAGE-05 requirements closed
- Phase 4 complete — v1.0 milestone ready for final verification

---
*Phase: 04-exhibit-detail-pages*
*Completed: 2026-03-17*

## Self-Check: PASSED

- ExhibitDetailPage.vue: FOUND
- ExhibitDetailPage.test.ts: FOUND
- 04-02-SUMMARY.md: FOUND
- Commit 33f0fe2 (test RED): FOUND
- Commit 8193b31 (feat GREEN): FOUND
