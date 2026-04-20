---
phase: 037-sfc-content-extraction
plan: 03
subsystem: ui
tags: [vue, sfc, content-extraction, faq, testimonial]

# Dependency graph
requires:
  - phase: 037-sfc-content-extraction
    provides: Pattern for src/content/*.ts extraction (Plans 01/02 establish conventions)
provides:
  - src/content/faqPage.ts content module (hero + colleagueQuotes + colleagueQuotesHeading)
  - FaqPage.vue refactored to consume prose via named imports
  - ColleagueQuote interface for typed testimonial entries
affects: [phase-39-markdown-export, faq-rendering, sfc-content-extraction]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content module named faqPage.ts (not faq.ts) to avoid collision with src/data/faq.ts loader"
    - "Testimonial block iterated via v-for over typed ColleagueQuote[] array"
    - "Unicode escapes (\\u2019, \\u2014) instead of HTML entities in content modules"

key-files:
  created:
    - src/content/faqPage.ts
  modified:
    - src/pages/FaqPage.vue

key-decisions:
  - "Named content module faqPage.ts (not faq.ts) to prevent confusion with @/data/faq loader"
  - "FAQ accordion/filter logic (filteredItems, categoryCounts computed refs) left in place — operates on data, not prose, so out of scope per RESEARCH.md §F Caveat 1"
  - "FaqAccordionItem and FaqFilterBar untouched — already fully prop-driven from @/data/faq"

patterns-established:
  - "Page-level content extraction: hero + incidental prose → src/content/{page}.ts, data-driven child components untouched"
  - "Typed ColleagueQuote interface with optional cite/context/variant fields for testimonial v-for"

requirements-completed: [SFC-03]

# Metrics
duration: 3min
completed: 2026-04-10
---

# Phase 37 Plan 03: FaqPage Content Extraction Summary

**Hardcoded FaqPage prose (hero + 2 colleague testimonials) extracted to src/content/faqPage.ts; accordion/filter logic and data-driven children untouched**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-10T16:30:08Z
- **Completed:** 2026-04-10T16:32:23Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments
- Created `src/content/faqPage.ts` with `hero`, `colleagueQuotesHeading`, `colleagueQuotes` named exports plus `ColleagueQuote` interface
- Refactored `FaqPage.vue` template to bind hero/testimonial prose from the content module
- Testimonial block now renders via `v-for` over a typed array — adding quotes is data-only
- Avoided filename collision with `src/data/faq.ts` by using `faqPage.ts`
- All 127 existing unit tests green, `vue-tsc` clean, production build successful

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/content/faqPage.ts** — `509329e` (feat)
2. **Task 2: Refactor FaqPage.vue to import from @/content/faqPage** — `fd88875` (refactor)

## Files Created/Modified
- `src/content/faqPage.ts` — New content module: `hero` (title/subtitle), `colleagueQuotesHeading`, `colleagueQuotes: ColleagueQuote[]`, `ColleagueQuote` interface
- `src/pages/FaqPage.vue` — Imports from `@/content/faqPage`; `<HeroMinimal>` bound via `:title`/`:subtitle`; testimonial section iterates `colleagueQuotes` with `v-for`

## Decisions Made
- **Module name `faqPage.ts`:** Per plan/RESEARCH.md §C3, avoids collision with `src/data/faq.ts` loader which owns FAQ items + categories. Clear separation: `@/content/faqPage` = page prose, `@/data/faq` = FAQ data.
- **Left filter/accordion logic untouched:** `filteredItems` and `categoryCounts` computed refs operate on `faqItems` data (not prose), so they are out of Phase 37 scope per RESEARCH.md §F Caveat 1.
- **Unicode escapes in content module:** `\u2019` (right single quotation) and `\u2014` (em dash) used instead of HTML entities — entities would leak into markdown export in Phase 39.

## Deviations from Plan

None — plan executed exactly as written. Both tasks completed with no auto-fixes required.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness
- FaqPage is now Phase 39 markdown-export ready: generator can import `@/content/faqPage` without parsing `.vue` SFCs
- FaqAccordionItem and FaqFilterBar already consume `@/data/faq` directly; no SFC parsing needed for FAQ list content either
- Parallel Wave 1 plans (037-01 HomePage, 037-02 PhilosophyPage) established the same pattern independently

## Self-Check: PASSED

**Files verified:**
- FOUND: src/content/faqPage.ts
- FOUND: src/pages/FaqPage.vue (modified)
- CONFIRMED MISSING: src/content/faq.ts (collision avoided)

**Commits verified:**
- FOUND: 509329e (feat Task 1)
- FOUND: fd88875 (refactor Task 2)

**Untouched files verified:**
- src/components/FaqAccordionItem.vue — no changes
- src/components/FaqFilterBar.vue — no changes
- src/data/faq.ts — no changes

**Verification commands:**
- `npm run test:unit` → 127 passed, 11 test files, exit 0
- `npx vue-tsc -b --force` → exit 0
- `npm run build` → exit 0, FaqPage chunk 26.14 kB

---
*Phase: 037-sfc-content-extraction*
*Completed: 2026-04-10*
