---
phase: 26-element-picker-selection
plan: 01
subsystem: ui
tags: [css-selector-generator, dom-capture, vue-component-detection, feedback-collector]

requires:
  - phase: 25-feedback-foundation
    provides: FeedbackState types, useFeedback composable, FeedbackCollector shell
provides:
  - captureElement pure function for DOM element context extraction
  - useFeedback selectElement action transitioning to annotating phase
  - useFeedback deactivate action for Escape-key cancel from picking
  - css-selector-generator dependency for stable selector paths
affects: [26-02-picker-overlay, 27-screenshot-capture, 28-annotation-panel]

tech-stack:
  added: [css-selector-generator@3.9.1]
  patterns: [pure-function-capture, vue-component-ancestor-walk, blacklist-regex-selectors]

key-files:
  created:
    - src/components/feedback/captureElement.ts
    - src/components/feedback/captureElement.test.ts
  modified:
    - src/composables/useFeedback.ts
    - package.json

key-decisions:
  - "css-selector-generator blacklist uses regexes for data-v-* and data-test-* to produce stable selectors"
  - "Vue component name detection walks up to 10 ancestors via __vueParentComponent.type.name"

patterns-established:
  - "Pure capture function: DOM context extraction separated from UI overlay for testability"
  - "Ancestor walk pattern: bounded DOM traversal with configurable depth limit"

requirements-completed: [PICK-04, PICK-05]

duration: 3min
completed: 2026-04-04
---

# Phase 26 Plan 01: Element Capture & Selection Summary

**captureElement pure function extracting tag/selector/rect/Vue-component-name from DOM elements, with useFeedback selectElement/deactivate actions**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T00:12:33Z
- **Completed:** 2026-04-04T00:16:01Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created captureElement utility that extracts tag, CSS selector path, bounding rect, and Vue component name from any DOM element
- Installed css-selector-generator with blacklist regexes excluding data-v-* and data-test-* for stable selectors
- Extended useFeedback with selectElement (stores capture, transitions to annotating) and deactivate (Escape from picking)
- 8 unit tests covering all capture behaviors including ancestor walk for Vue component detection

## Task Commits

Each task was committed atomically:

1. **Task 1: Install css-selector-generator and create captureElement utility** - `d33c797` (feat) - TDD: 8 tests
2. **Task 2: Extend useFeedback with selectElement action** - `ef86b87` (feat)

## Files Created/Modified
- `src/components/feedback/captureElement.ts` - Pure function extracting DOM element context (tag, selector, rect, component name)
- `src/components/feedback/captureElement.test.ts` - 8 unit tests covering all capture behaviors
- `src/composables/useFeedback.ts` - Added selectElement and deactivate actions, imported ElementCapture type
- `package.json` - Added css-selector-generator dependency

## Decisions Made
- css-selector-generator blacklist uses regexes `/^data-v-/` and `/^data-test-/` to exclude Vue scoped and test attributes from generated selectors, producing stable paths
- Vue component name detection bounded at 10 ancestors to prevent performance issues on deep DOM trees
- screenshotDataUri set to null as placeholder -- screenshot capture is Phase 27

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- captureElement is ready for PickerOverlay (plan 02) to call on click events
- useFeedback selectElement action is ready to receive capture data from the overlay
- deactivate action is ready for Escape key handling in picker mode

---
*Phase: 26-element-picker-selection*
*Completed: 2026-04-04*
