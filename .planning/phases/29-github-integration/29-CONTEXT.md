# Phase 29: GitHub Integration - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Clicking Submit in the annotation panel uploads the screenshot as a secret Gist, creates a GitHub Issue with structured markdown body containing all context, and shows success (with Issue URL link) or error (with retry). Falls back to JPEG data URI if Gist fails, with aggressive size checks. Configurable labels applied to issues. This phase adds the githubSubmit service and wires the submitting/done/error states in the state machine.

</domain>

<decisions>
## Implementation Decisions

### GitHub API Strategy
- Two sequential native fetch calls: Gist first (screenshot upload), then Issue (with raw_url from Gist response)
- No Octokit — only 2 endpoints needed, native fetch is sufficient
- Secret Gist (not public) for screenshot hosting
- Classic PAT with `public_repo` + `gist` scopes (fine-grained tokens cannot create gists per research)

### Screenshot Upload — Primary Path (Gist)
- POST base64 PNG content to api.github.com/gists as a secret gist
- Filename: `feedback-screenshot-{timestamp}.png`
- Extract raw_url from response: `files["feedback-screenshot-{timestamp}.png"].raw_url`
- Embed in issue body as `![screenshot]({raw_url})`

### Screenshot Upload — Fallback Path (Data URI)
- If Gist POST fails for any reason: use base64 data URI directly in issue body
- Check total issue body character length before embedding
- GitHub Issues hard limit: ~65,536 characters
- If data URI would push body over 60,000 chars (leave headroom):
  - Re-capture element only (not full page) via html2canvas
  - Scale down: `canvas.toDataURL('image/jpeg', 0.5)`
  - If still exceeds: omit screenshot entirely with note "> Screenshot omitted: too large to embed"
- Console.warn identifying which fallback was used

### Issue Body Structure
- Structured markdown with sections: Comment, Screenshot, Element Context, Environment
- Element context: tag, CSS selector, bounding rect, Vue component name
- Environment: page URL, viewport dimensions, user agent, theme (dark/light)
- All fields from useFeedback.state.capture + AnnotationPanel's EnvironmentMeta

### Labels & Configuration
- Default labels: `["feedback"]` — configurable via optional VITE_GITHUB_LABELS env var (comma-separated)
- Labels applied at issue creation time via GitHub API labels field

### Success/Error States
- Success: transition to 'done' phase, display clickable link to created Issue URL, "New Report" button to reset
- Error: transition to 'error' phase, display actionable message (what failed), "Retry" button to re-attempt submission
- Error messages should distinguish: network error, auth error (401/403), rate limit (403 with rate limit headers), Gist-specific failure vs Issue-specific failure

### Token Scope Warning
- At submit time, before attempting Gist upload, validate token exists (already done by useFeedbackConfig)
- If Gist creation returns 404 (scope issue), warn: "Token may lack 'gist' scope"

### Claude's Discretion
- Exact markdown template for issue body
- Rate limit handling details (retry-after header parsing)
- Whether to add metadata as HTML comments or visible sections in issue body
- SuccessPanel and ErrorPanel as separate components or states within AnnotationPanel

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/composables/useFeedback.ts` — setPhase('submitting'/'done'/'error'), state.error, state.issueUrl fields
- `src/composables/useFeedbackConfig.ts` — token, repo, enabled, isConfigured
- `src/components/feedback/feedback.types.ts` — FeedbackState with all fields, FeedbackConfig, EnvironmentMeta
- `src/components/feedback/feedback.css` — full token set for styling success/error states
- `src/components/feedback/AnnotationPanel.vue` — submit button emits event, ready to wire

### Integration Points
- AnnotationPanel.vue submit → calls useFeedback action → triggers githubSubmit service
- useFeedback.state.issueUrl — populated on success for display
- useFeedback.state.error — populated on error for display
- FeedbackCollector.vue — needs to render done/error state UI

</code_context>

<specifics>
## Specific Ideas

- User originally specified file as `src/utils/githubIssue.js` — use `src/components/feedback/githubSubmit.ts` to keep within the feedback module (TypeScript, not JS)
- The submission service should be a pure async function, not a composable — no reactive state, just input→output
- VITE_GITHUB_LABELS env var is optional — default to `["feedback"]` if not set

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
