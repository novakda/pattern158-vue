# Phase 26: Element Picker & Selection - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can activate picker mode via keyboard shortcut, hover to highlight page elements with a visible outline, click to capture element context (tag, CSS selector path, bounding rect, Vue component name), and deactivate picker mode. This phase adds the PickerOverlay component, the captureElement utility, installs css-selector-generator, and extends the useFeedback composable with element selection actions.

</domain>

<decisions>
## Implementation Decisions

### Picker Overlay Strategy
- Transparent full-viewport div with `pointer-events: none`, use `elementFromPoint` + temporarily hide overlay to probe underneath — proven DevTools-style pattern
- Highlight via positioned overlay div that mirrors target's boundingRect with 2px solid blue outline — avoids disrupting page layout
- Exclude elements with `fb-` class prefix or inside `.fb-root` from picking — prevents self-selection loops

### CSS Selector Generation
- Use css-selector-generator library (research recommended, handles edge cases)
- Exclude `data-v-*`, `data-test-*`, dynamically-generated class names for stable, readable selectors
- Cap selector depth at 5 levels

### Element Capture & Vue Component Detection
- Walk up DOM from clicked element checking `__vueParentComponent?.type?.name` for Vue component name
- `getBoundingClientRect()` at click time for bounding rect capture
- Capture logic in new `src/components/feedback/captureElement.ts` — pure function, no Vue dependency, testable

### Claude's Discretion
- Exact highlight color (recommend using `--fb-accent` token from Phase 25 CSS)
- PickerOverlay internal structure and event handler wiring
- How to handle Escape key during picker mode (toggle off)
- Whether to add cursor change during picker mode (crosshair recommended)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/feedback/feedback.types.ts` — FeedbackPhase includes 'picking', ElementCapture interface ready
- `src/components/feedback/feedback.css` — --fb-accent, --fb-bg, fb- class prefix established
- `src/composables/useFeedback.ts` — activate() sets phase to 'picking', state machine ready for selection actions
- `src/composables/useFeedbackConfig.ts` — config composable available

### Established Patterns
- Vue 3 Composition API with `<script setup lang="ts">`
- Phase 25's Teleport-to-body pattern for overlay components
- fb- class prefix convention for all feedback component CSS

### Integration Points
- FeedbackCollector.vue — will render PickerOverlay when phase is 'picking'
- useFeedback.ts — needs selectElement(el, capture) action to transition from 'picking' to 'annotating'
- feedback.css — picker overlay styles go here

</code_context>

<specifics>
## Specific Ideas

- css-selector-generator must be installed as a dependency (`npm install css-selector-generator`)
- The keyboard shortcut Ctrl+Shift+F should be registered on the document level
- PickerOverlay should be visible only when feedback state.phase === 'picking'

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
