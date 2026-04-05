# Phase 28: Annotation Panel & Comment Flow - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

After an element is captured with screenshot, an annotation panel appears near the selected element showing a comment textarea, screenshot thumbnail, element metadata, and Submit/Cancel buttons. Escape or Cancel dismisses and resets to idle. Submit transitions to Phase 29's GitHub integration. This phase completes the full local pipeline — pick, capture, annotate — without external API calls.

</domain>

<decisions>
## Implementation Decisions

### Panel Layout & Positioning
- Panel anchored to right of selected element, flips to left/above/below when near viewport edges
- 360px fixed width
- Screenshot shown as thumbnail (max 200px wide) with click-to-expand
- Metadata displayed as compact summary (tag, selector truncated, viewport, URL) with collapsible detail section

### Comment Input & Actions
- Textarea: 4 rows default, auto-expand up to 8 rows
- Placeholder: "Describe the issue..."
- Action buttons: "Submit" (primary blue) + "Cancel" (secondary gray)
- Submit disabled when comment is empty

### Integration
- AnnotationPanel.vue renders when feedback state.phase === 'annotating'
- Panel receives capture data via props or composable
- Cancel calls useFeedback.cancel() → resets to idle
- Submit calls useFeedback.setPhase('submitting') → Phase 29 handles the rest
- Escape key listener on panel (not document-level — panel owns its own keyboard handling)

### Claude's Discretion
- Exact flip logic algorithm for panel repositioning
- Metadata detail section expand/collapse implementation
- Screenshot expand behavior (lightbox vs inline grow)
- Panel shadow/border styling within fb- namespace

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/feedback/feedback.types.ts` — FeedbackState with capture, comment fields
- `src/composables/useFeedback.ts` — cancel(), reset(), setPhase() ready
- `src/components/feedback/feedback.css` — full --fb-* token set including colors, spacing, typography
- `src/components/feedback/FeedbackCollector.vue` — conditional rendering based on phase

### Integration Points
- FeedbackCollector.vue — will render AnnotationPanel when phase === 'annotating'
- useFeedback.state.capture — contains tag, selectorPath, boundingRect, screenshotDataUri, componentName
- useFeedback.state.comment — bound to textarea via v-model
- feedback.css — panel styles go here

</code_context>

<specifics>
## Specific Ideas

- Environment metadata (viewport, URL, user agent) should be collected at annotation time, not capture time — viewport/URL could change between captures in theory
- The panel should include: page URL, viewport dimensions, user agent, current theme (dark/light)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
