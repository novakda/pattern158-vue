---
phase: 35-interactive-components
plan: 01
subsystem: ui
tags: [vue, accordion, aria, accessibility, faq, storybook]

requires:
  - phase: none
    provides: standalone component
provides:
  - FaqAccordionItem.vue accessible accordion component
  - FaqItem type with id, categories[], exhibitNote?, exhibitUrl?
  - 13 vitest tests for accordion behavior
  - 4 Storybook stories for visual verification
affects: [35-02, 36-faq-page-integration]

tech-stack:
  added: []
  patterns: [WAI-ARIA accordion pattern with h3>button, controlled component with isOpen prop and toggle emit]

key-files:
  created: [src/components/FaqAccordionItem.vue, src/components/FaqAccordionItem.test.ts, src/components/FaqAccordionItem.stories.ts]
  modified: [src/types/faq.ts, src/data/faq.ts, src/data/json/faq.json, src/pages/FaqPage.vue]

key-decisions:
  - "Updated FaqItem type to add id, categories[], exhibitNote?, exhibitUrl? fields for accordion support"
  - "Used boolean binding for aria-expanded instead of String() to satisfy Vue type system"

patterns-established:
  - "WAI-ARIA accordion: h3 > button with aria-expanded and aria-controls, region panel with hidden attribute"
  - "Controlled accordion: parent owns open state via isOpen prop, component emits toggle"

requirements-completed: [ACRD-01, ACRD-02, ACRD-03, ACRD-04, ACRD-05]

duration: 5min
completed: 2026-04-08
---

# Phase 35 Plan 01: FaqAccordionItem Summary

**Accessible FAQ accordion component with WAI-ARIA pattern, category pills, CSS rotate icon, and 13 passing tests**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-08T19:33:34Z
- **Completed:** 2026-04-08T19:39:13Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- FaqAccordionItem.vue implements full WAI-ARIA accordion pattern (h3 > button, aria-expanded, aria-controls)
- Category pills render from item.categories array, icon rotates 45deg via CSS on is-open class
- FaqItem type schema extended with id, categories[], exhibitNote?, exhibitUrl? and all 14 FAQ items migrated
- 4 Storybook stories covering Closed, Open, MultiCategory, and WithExhibitNote states

## Task Commits

Each task was committed atomically:

1. **Task 1: Create FaqAccordionItem component and tests (TDD)** - `987b82b` (test: RED), `c28187e` (feat: GREEN)
2. **Task 2: Create FaqAccordionItem Storybook stories** - `cfe51f5` (feat)

## Files Created/Modified
- `src/components/FaqAccordionItem.vue` - Accessible accordion item with ARIA, toggle emit, category pills
- `src/components/FaqAccordionItem.test.ts` - 13 vitest tests for accordion behavior
- `src/components/FaqAccordionItem.stories.ts` - 4 stories for visual verification
- `src/types/faq.ts` - FaqItem extended with id, categories[], exhibitNote?, exhibitUrl?
- `src/data/json/faq.json` - All 14 items migrated to new schema (id, categories array)
- `src/data/faq.ts` - FaqCategory type widened from literal union to string
- `src/pages/FaqPage.vue` - Updated filter from singular category to categories.includes()

## Decisions Made
- Updated FaqItem type to add `id`, `categories[]`, `exhibitNote?`, `exhibitUrl?` -- required for accordion component to work with planned interface
- Changed FaqCategory.id from literal union to `string` to support future category expansion
- Used boolean binding for `aria-expanded` instead of `String()` to satisfy Vue's Booleanish type constraint
- Converted `category` (singular) to `categories` (array) in JSON data to support multi-category FAQ items

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated FaqItem type and data schema**
- **Found during:** Task 1 (component implementation)
- **Issue:** Plan's interface section specified FaqItem with id, categories[], exhibitNote?, exhibitUrl? but actual type had category (singular string), no id, no optional fields
- **Fix:** Updated src/types/faq.ts, src/data/json/faq.json (all 14 items), src/data/faq.ts, and src/pages/FaqPage.vue
- **Files modified:** src/types/faq.ts, src/data/json/faq.json, src/data/faq.ts, src/pages/FaqPage.vue
- **Verification:** npx vue-tsc --noEmit clean, all 108 tests pass
- **Committed in:** c28187e (Task 1 commit)

**2. [Rule 1 - Bug] Fixed aria-expanded type error**
- **Found during:** Task 1 (component implementation)
- **Issue:** `String(isOpen)` returns string but Vue expects Booleanish for aria-expanded
- **Fix:** Changed to `:aria-expanded="isOpen"` -- Vue renders boolean as "true"/"false" string automatically
- **Files modified:** src/components/FaqAccordionItem.vue
- **Verification:** npx vue-tsc --noEmit clean, all tests still pass
- **Committed in:** c28187e (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correctness. Type schema update was required by plan's own interface specification. No scope creep.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- FaqAccordionItem ready for integration into FaqPage (Phase 36)
- FaqFilterBar (Plan 02) can proceed independently -- shares same FaqItem/FaqCategory types
- Old FaqItem.vue still exists for deletion in Phase 36 after integration verified

---
*Phase: 35-interactive-components*
*Completed: 2026-04-08*
