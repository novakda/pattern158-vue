# Phase 27: Screenshot Capture - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

After clicking an element in picker mode, html2canvas captures it as a base64 PNG data URI. A loading spinner shows during capture. The capture result is stored in the feedback state (ElementCapture.screenshotDataUri) for the annotation panel in Phase 28.

</domain>

<decisions>
## Implementation Decisions

### Screenshot Library
- Install html2canvas (v1.4.1) — industry standard, single-call API
- Lazy-load via dynamic import to keep dev chunk separate
- Pass the selected element directly to html2canvas (not document.body) for element-scoped capture
- Use scale: 1 to avoid oversized captures

### Loading State
- Add 'capturing' phase to FeedbackPhase type union (between 'picking' and 'annotating')
- Show a centered spinner overlay during capture — use existing fb- CSS namespace
- Spinner is a simple CSS animation (rotating border), no external library

### Error Handling
- If html2canvas fails, transition to 'error' phase with descriptive message
- Console.warn the html2canvas error for debugging
- User can retry or cancel from error state

### Claude's Discretion
- Spinner visual design (CSS-only animation)
- html2canvas options beyond scale (logging, useCORS, etc.)
- Where to place the capture call (extend captureElement.ts or new screenshotCapture.ts)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/feedback/captureElement.ts` — returns ElementCapture with null screenshotDataUri slot
- `src/composables/useFeedback.ts` — state machine with selectElement(), needs capture step inserted
- `src/components/feedback/feedback.types.ts` — FeedbackPhase type, ElementCapture.screenshotDataUri already typed
- `src/components/feedback/feedback.css` — fb- namespace, --fb-accent token

### Integration Points
- PickerOverlay.vue emits element selection → useFeedback.selectElement() → screenshot capture should happen here
- ElementCapture.screenshotDataUri is already nullable — gets populated after html2canvas

</code_context>

<specifics>
## Specific Ideas

- Research flagged html2canvas can't render box-shadow, text-shadow, backdrop-filter — accept approximate screenshots, document limitation
- modern-screenshot is the fallback if html2canvas rendering is unacceptable

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
