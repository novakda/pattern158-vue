# Phase 25: Foundation & Build Gating - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Dev/staging feedback tool scaffold is in place — conditionally mounted, self-styled, and configurable. This phase creates the directory structure, the root orchestrator component with build-time gating, the floating action button trigger, the composable shell, the CSS namespace foundation, and env var validation. No picker logic, no screenshot capture, no GitHub API — just the skeleton that subsequent phases flesh out.

</domain>

<decisions>
## Implementation Decisions

### Component Structure & Mounting
- Feedback components live in `src/components/feedback/` subdirectory — follows existing `exhibit/` pattern
- Build gating via `defineAsyncComponent` + `import.meta.env.DEV` conditional in App.vue — Vite tree-shakes the entire module from production
- FeedbackCollector uses `<Teleport to="body">` internally — App.vue gets one conditional line added
- Single composable at `src/composables/useFeedbackPicker.ts` for picker state machine

### FAB Trigger Design
- Position: bottom-right corner (`right: 20px; bottom: 20px`)
- Visual: Bug icon (🐛 or SVG) with subtle background
- Size: 48×48px circle
- Visibility: Always visible in dev mode at 0.7 opacity, full opacity on hover

### CSS Namespace & Theming
- Token prefix: `--fb-` for all custom properties
- Class prefix: `fb-` for all classes (e.g., `fb-trigger`, `fb-overlay`)
- Color scheme: Neutral gray palette with blue accent for actions
- Dark mode: Respect `prefers-color-scheme` via CSS media query, independent of site's theme toggle

### Claude's Discretion
- Exact SVG icon for the FAB (can use a simple bug/beetle path or emoji fallback)
- Internal file naming within `src/components/feedback/`
- TypeScript interface shapes for feedback state

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/composables/useBodyClass.ts` — established composable pattern with lifecycle cleanup
- `src/composables/useSeo.ts` — another composable reference
- `src/components/exhibit/` — subdirectory pattern precedent for related components

### Established Patterns
- Vue 3 Composition API with `<script setup lang="ts">` throughout
- CSS design tokens via custom properties in `src/assets/css/main.css`
- `@` alias resolves to `src/` via Vite config
- No Pinia or external state management — composables handle shared state

### Integration Points
- `src/App.vue` — only file modified (conditional async component mount)
- Z-index landscape: skip-link at 9999, navbar at 100-101, mobile nav overlay at 101. FAB should use 9998 (below skip-link, above all content)
- Vite env vars via `import.meta.env.VITE_*` — standard pattern, no `.env` file exists yet

</code_context>

<specifics>
## Specific Ideas

- User specified `src/utils/githubIssue.js` in original task — will be created in Phase 29 (GitHub Integration), not this phase
- User wants `<FeedbackPicker />` droppable into App.vue with no required props — the root component handles all config internally
- The `.env.local` file for VITE_GITHUB_TOKEN and VITE_GITHUB_REPO should be documented but not committed

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
