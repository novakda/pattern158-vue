# Phase 30: Annotation Drawing Overlay - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

After screenshot capture, users can draw rectangles and arrows on the screenshot preview to highlight areas of concern. Annotations are composited into the final screenshot image before GitHub submission. This phase adds AnnotationCanvas.vue, drawing tool selection, and compositing logic.

</domain>

<decisions>
## Implementation Decisions

### Drawing Canvas Design
- HTML5 Canvas overlay on top of screenshot thumbnail in AnnotationPanel
- Two toggle buttons (Rectangle, Arrow) above screenshot for tool selection
- Drawing color: red (#ff3333) — high contrast, universally "attention here"
- Single undo button removes last shape — simple, no full history stack

### Compositing & Integration
- At submit time: draw screenshot image onto new canvas, draw annotations on top, export as PNG data URI replacing original screenshotDataUri
- Canvas sized to match screenshot thumbnail dimensions (proportional to preview)
- New AnnotationCanvas.vue component rendered inside AnnotationPanel below screenshot preview

### Drawing Mechanics
- Click-and-drag for both tools: mousedown starts, mousemove previews, mouseup commits shape
- Rectangles: stroke-only (2px red border, no fill) — doesn't obscure underlying screenshot
- Arrows: line with arrowhead at end point — standard annotation convention
- Shapes stored as array of objects `{ type: 'rect'|'arrow', startX, startY, endX, endY }`
- Canvas redraws all shapes on each frame during drag (standard immediate-mode pattern)

### Claude's Discretion
- Arrow head geometry (triangle size, angle)
- Touch event support (nice-to-have, not required)
- Canvas cursor during drawing (crosshair recommended)
- Whether to show shape count or drawing instructions

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/feedback/AnnotationPanel.vue` — has screenshot preview section where canvas goes
- `src/components/feedback/feedback.css` — fb- namespace for toolbar/button styles
- `src/composables/useFeedback.ts` — state.capture.screenshotDataUri to be replaced after compositing
- `src/components/feedback/feedback.types.ts` — ElementCapture with screenshotDataUri field

### Integration Points
- AnnotationPanel.vue — renders AnnotationCanvas below screenshot, passes screenshotDataUri
- useFeedback.submit() — compositing must happen before this call (replace screenshotDataUri in capture)
- githubSubmit.ts — receives the already-composited screenshotDataUri, no changes needed

</code_context>

<specifics>
## Specific Ideas

- Compositing should be a method on AnnotationCanvas exposed via defineExpose or a composable
- The annotation toolbar should be visually distinct from the comment form — positioned directly above/overlapping the screenshot preview area

</specifics>

<deferred>
## Deferred Ideas

- Freehand drawing tool — adds complexity, rectangles + arrows cover 95% of annotation needs
- Color picker — red is sufficient for dev/staging use

</deferred>
