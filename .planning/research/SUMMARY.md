# Project Research Summary

**Project:** Pattern 158 v3.0 -- Visual Feedback Collector
**Domain:** Dev/staging-only visual bug reporting tool for Vue 3 SPA
**Researched:** 2026-04-03
**Confidence:** HIGH

## Executive Summary

The v3.0 milestone adds a self-contained visual feedback collector to the Pattern 158 portfolio site. This is a well-understood domain -- commercial tools like BugHerd, Marker.io, and UserSnap have established the interaction pattern: activate picker, hover to highlight, click to select, annotate, submit. The scope is narrower than these commercial products because this is a single-developer dev tool with GitHub Issues as the sole backend. The recommended stack is minimal: html2canvas for screenshots, css-selector-generator for element identification, and native fetch for two GitHub API calls (Gist upload + Issue creation). No new frameworks, state libraries, or dev dependencies are needed -- the existing Vue 3 + TypeScript + Vite stack provides everything else.

The architecture is fully additive: 4 new Vue components in a `components/feedback/` directory, 2 composables, and 2 pure service modules. Only `App.vue` is modified (one conditional component mount). The feedback system uses its own CSS namespace (`--fb-*` prefixed tokens, `fb-` class prefix) to remain extractable as a standalone package later. Build-time gating via `import.meta.env.MODE` with `defineAsyncComponent` ensures zero production footprint -- no code, no token, no bytes in the prod bundle.

The primary risks are: (1) html2canvas cannot render this site's extensive use of `box-shadow`, `text-shadow`, and `backdrop-filter`, producing approximate screenshots -- accept this limitation, don't fight it; (2) base64 screenshots exceed GitHub's 65K character issue body limit -- the Gist-first upload strategy is mandatory, not optional; (3) the GitHub PAT must never reach production -- build-time dead code elimination is the primary defense, with post-build grep verification as a CI check. All six identified pitfalls have clear prevention strategies mapped to specific implementation phases.

## Key Findings

### Recommended Stack

The stack is intentionally minimal. Two runtime dependencies are added (html2canvas, css-selector-generator), both dev-only and lazy-loaded. Production bundle size is unchanged. See [STACK.md](STACK.md) for full rationale and alternatives.

**Core technologies:**
- **html2canvas 1.4.1:** DOM-to-canvas screenshot capture -- industry standard, stable, single-call API. Lazy-loaded via dynamic import (~150KB gzipped dev chunk)
- **css-selector-generator 3.9.1:** Unique CSS selector from clicked DOM element -- actively maintained, handles edge cases (shadow DOM, duplicate IDs, dynamic classes) that hand-rolled solutions miss
- **Native fetch:** GitHub REST API calls -- only 2 endpoints needed (Gist + Issue). Octokit pulls 5+ transitive deps for 800+ endpoint methods we never use

**Key constraint:** No new dev dependencies, no state management library, no image hosting service, no SaaS SDK. The existing Vite env vars, Vue composables, and dynamic imports handle all infrastructure concerns.

### Expected Features

See [FEATURES.md](FEATURES.md) for full feature landscape, dependency graph, and competitor analysis.

**Must have (table stakes -- P1):**
- Dev/staging build gate (security, must be first)
- Picker mode toggle (floating button + keyboard shortcut)
- DOM element hover highlighting
- Element click-to-select with context capture (tag, selector, bounding rect)
- Screenshot capture via html2canvas
- Comment input panel
- Environment metadata (viewport, UA, URL, theme)
- Gist screenshot upload + GitHub Issue creation
- Basic keyboard navigation (Escape to cancel)

**Should have (differentiators -- P2):**
- Annotation drawing overlay (rectangles, arrows, freehand on screenshot) -- highest portfolio impact, most complex single feature
- Vue component name in element metadata
- Issue labels and categorization

**Defer (post-v3.0):**
- Standalone npm package extraction
- Non-GitHub issue tracker support
- Session replay, console capture, network capture (anti-features for this scope)

### Architecture Approach

The feedback system follows a state machine pattern with explicit phases (idle, picking, annotating, submitting, done, error) managed by a single `useFeedback()` composable. Components communicate via props-down/events-up, with shared state in the composable. The picker uses a transparent full-viewport overlay with `elementFromPoint` probing. All UI is teleported to body with high z-index values (10000+) to avoid stacking context conflicts. See [ARCHITECTURE.md](ARCHITECTURE.md) for full component diagram, data flow, and anti-patterns.

**Major components:**
1. **FeedbackCollector.vue** -- root orchestrator, conditional mount in App.vue
2. **FeedbackTrigger.vue** -- floating action button + keyboard shortcut listener
3. **PickerOverlay.vue** -- full-viewport transparent overlay for element selection
4. **AnnotationPanel.vue** -- comment textarea, metadata display, submit/cancel actions
5. **captureElement.ts** -- pure service: DOM introspection + html2canvas call
6. **githubSubmit.ts** -- pure service: Gist upload + Issue creation

### Critical Pitfalls

See [PITFALLS.md](PITFALLS.md) for all 6 pitfalls with detailed prevention and recovery strategies.

1. **html2canvas CSS rendering gaps** -- this site uses 30+ box-shadows, 8 text-shadows, and backdrop-filter, none of which html2canvas supports. Accept approximate screenshots; document the limitation in UI. Do not waste time trying to fix html2canvas output.
2. **Base64 screenshots exceed GitHub 65K issue body limit** -- Gist-first upload is mandatory. Data URI fallback must use aggressive JPEG compression + crop + size check. Test with the largest page (CaseFilesPage).
3. **PAT token leaked in production bundle** -- build-time dead code elimination via `import.meta.env.MODE` conditional + `defineAsyncComponent`. Post-build grep verification. Minimal scopes (`public_repo` + `gist`). Dedicated bot account.
4. **Z-index war with existing site chrome** -- skip-to-content is at z:9999, nav at z:100-101. Feedback overlay at z:10000+, teleported to body. Test with mobile nav open and skip link focused.
5. **Fragile CSS selectors** -- skip `data-v-*` attributes, transient classes. Prefer semantic class names. Include visible text content as human-readable fallback. Cap depth at 4-5 levels.
6. **Event listener leaks** -- use `watchEffect` with `onCleanup` for state-dependent listeners. Store named function references. Test with repeated toggle cycles.

## Implications for Roadmap

Based on dependency analysis across all four research files, here is the recommended phase structure. Each phase produces a testable, visible increment.

### Phase 1: Foundation and Build Gating
**Rationale:** Security-critical setup must be proven before any feature code. PAT exposure (Pitfall 3) is the highest-severity risk. Architecture research confirms only App.vue is modified.
**Delivers:** Feature gate verified in production build, env var config composable, FAB trigger button visible in dev, self-contained CSS foundation, TypeScript types.
**Addresses:** Build gating, self-contained styling, picker mode activation (trigger only), env documentation
**Avoids:** Pitfall 3 (token exposure), Pitfall 4 (z-index -- establishes strategy early)

### Phase 2: Element Picker and Selection
**Rationale:** The picker is the foundational interaction -- all downstream features (screenshot, annotation, submission) depend on element selection. No external dependencies needed yet.
**Delivers:** Hover highlighting, element click-to-select, element context capture (tag, selector, bounding rect), picker overlay with escape-to-cancel.
**Uses:** css-selector-generator (first new dependency)
**Implements:** PickerOverlay.vue, captureElement.ts (selector portion)
**Avoids:** Pitfall 5 (fragile selectors -- configure generator correctly from the start), Pitfall 6 (listener leaks -- establish cleanup patterns)

### Phase 3: Screenshot Capture
**Rationale:** Screenshot depends on element selection (Phase 2). This is the first external library integration (html2canvas) and introduces async complexity. Kept separate from submission to isolate issues.
**Delivers:** html2canvas integration, screenshot as data URI, loading state during capture, "screenshot approximate" disclaimer.
**Uses:** html2canvas (second new dependency, lazy-loaded)
**Implements:** captureElement.ts (screenshot portion)
**Avoids:** Pitfall 1 (CSS rendering gaps -- set expectations, don't over-optimize), Performance trap (capture spinner, scale:1)

### Phase 4: Annotation Panel and Comment Flow
**Rationale:** Panel depends on both element selection and screenshot data to display. State machine composable ties together all prior phases. Full local flow works end-to-end without external API calls.
**Delivers:** AnnotationPanel.vue, useFeedback.ts state machine (idle through annotating), comment textarea, metadata display, screenshot preview.
**Implements:** AnnotationPanel.vue, useFeedback.ts
**Avoids:** UX pitfall (panel covering selected element -- position to side with flip logic)

### Phase 5: GitHub Integration
**Rationale:** External API calls come last because they require token config, are hardest to test, and the local flow must be proven first. Two sequential API calls (Gist then Issue) with error handling for each.
**Delivers:** Gist upload, Issue creation with structured markdown body, success/error feedback with Issue URL link, rate limit handling.
**Uses:** Native fetch, GitHub REST API
**Implements:** githubSubmit.ts, submission states in useFeedback.ts
**Avoids:** Pitfall 2 (base64 size limit -- Gist-first strategy), Integration gotchas (secret gists, error code mapping, raw_url from response)

### Phase 6: Enhancement and Polish
**Rationale:** Core flow is complete. Enhancements add portfolio value and UX polish without risking the critical path.
**Delivers:** Annotation drawing overlay (if scoped to v3.0), Vue component name in metadata, issue labels, full keyboard workflow, Storybook stories for all states, "looks done but isn't" checklist verification.
**Implements:** Remaining P2 features, Storybook coverage, edge case handling

### Phase Ordering Rationale

- **Security before features:** Build gating must be proven before any code referencing the GitHub token is written. This is non-negotiable.
- **Local before remote:** Phases 2-4 build the complete local pipeline (pick, capture, annotate) without needing API tokens. A developer can validate the entire UX flow offline. Phase 5 adds the external integration only when the local flow is solid.
- **Dependencies flow forward:** Each phase builds on the prior. Picker before capture, capture before panel, panel before submission. No phase requires work from a later phase.
- **High-risk isolation:** html2canvas (Pitfall 1) is isolated in Phase 3. GitHub API (Pitfall 2) is isolated in Phase 5. If either requires a pivot (e.g., swap html2canvas for modern-screenshot), the blast radius is contained.
- **Polish last:** Annotation drawing overlay is the most complex single feature but is a P2 enhancement. It belongs in the final phase where it cannot delay the core feedback loop.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Screenshot Capture):** html2canvas behavior with this site's specific CSS (cascade layers, custom properties, extensive shadows) should be validated with a quick spike before detailed planning. If rendering is unacceptable, modern-screenshot is the documented fallback.
- **Phase 5 (GitHub Integration):** Gist API behavior with large base64 content and the exact raw_url format should be verified with a test call. GitHub API docs in training data are MEDIUM confidence.
- **Phase 6 (Annotation Drawing):** Canvas drawing overlay is a mini-app within the tool. If included in v3.0 scope, it needs its own focused design.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Vite env vars, conditional component mounting, CSS custom properties -- all well-documented, verified against existing codebase patterns.
- **Phase 2 (Picker):** elementFromPoint overlay technique is a standard pattern used by browser DevTools. css-selector-generator has a straightforward API.
- **Phase 4 (Annotation Panel):** Standard Vue component with reactive state, textarea, positioned panel. No novel patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All libraries verified on npm registry (2026-04-03). Version compatibility confirmed. Existing codebase inspected for integration points. |
| Features | HIGH | Well-established domain with 5+ commercial precedents analyzed. Feature dependencies mapped. MVP clearly scoped to dev-only use case. |
| Architecture | HIGH | Component structure follows existing codebase patterns (exhibit/ subdirectory, composable conventions). Z-index audit from direct CSS inspection. Build gating verified against Vite behavior. |
| Pitfalls | HIGH | All pitfalls verified against official sources (html2canvas feature page, GitHub API docs, Vite docs). CSS usage counts from direct codebase grep. Recovery strategies documented. |

**Overall confidence:** HIGH

### Gaps to Address

- **html2canvas rendering quality on this specific site:** Training data confirms unsupported CSS features, but actual visual output needs validation. Run a 30-minute spike in Phase 3 planning to capture the hero section and a card. If unacceptable, swap to modern-screenshot.
- **GitHub Gist raw_url stability:** The raw_url format from the Gist creation response is the recommended approach, but training data for the exact response shape is MEDIUM confidence. Validate with a real API call during Phase 5 implementation.
- **Annotation drawing overlay scope:** FEATURES.md marks this as P2. Whether it ships in v3.0 or defers to v3.1 is a scope decision, not a research gap. If included, Phase 6 needs its own mini-research for canvas drawing patterns.
- **Keyboard shortcut conflict:** Ctrl+Shift+F may conflict with Firefox find-in-page. The exact shortcut should be decided during Phase 1 implementation and tested across Chrome, Firefox, and Edge.

## Sources

### Primary (HIGH confidence)
- npm registry (2026-04-03) -- version numbers, publish dates, dependency trees for html2canvas, css-selector-generator, modern-screenshot, @octokit/rest
- Repository source code -- package.json, vite.config.ts, vitest.config.ts, main.css (direct reads)
- html2canvas feature page (html2canvas.hertzen.com/features) -- supported/unsupported CSS properties
- GitHub REST API docs -- Issue creation, Gist creation, OAuth scopes, rate limits
- Vite documentation -- import.meta.env behavior, static replacement, tree-shaking

### Secondary (MEDIUM confidence)
- GitHub community discussions -- Issue body 65K character limit, Gist as image hosting workaround
- Commercial tool comparisons (Marker.io blog, Feedbucket, BugHerd) -- feature landscape and UX patterns
- monday.com engineering blog -- html2canvas vs alternatives analysis

### Tertiary (LOW confidence)
- GitHub Gist raw_url response format -- inferred from API docs in training data, needs validation with real call

---
*Research completed: 2026-04-03*
*Ready for roadmap: yes*
