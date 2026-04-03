# Stack Research

**Domain:** Visual feedback collector for Vue 3 SPA (dev/staging bug-reporting tool)
**Researched:** 2026-04-03
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| html2canvas | 1.4.1 | DOM-to-canvas screenshot capture | Industry standard for client-side screenshots. Mature, single-call API: `html2canvas(element)` returns a canvas. 3.4MB unpacked but only loaded in dev/staging builds, so zero production impact. Last published 2022-01-22 — stable and complete, not abandoned. MIT license. |
| css-selector-generator | 3.9.1 | Unique CSS selector from clicked DOM element | Actively maintained (last publish 2026-03-29). Purpose-built for generating optimal, unique CSS selectors from DOM elements. Handles edge cases (shadow DOM, iframes, duplicate IDs, dynamic classes) that hand-rolled solutions miss. Ships with TypeScript declarations. |
| Native fetch | N/A | GitHub REST API calls (Issues + Gists) | This tool makes exactly 2 API calls: create a Gist (image upload) and create an Issue. @octokit/rest pulls in 5+ transitive deps for typed wrappers around fetch — massive overkill. Native fetch with typed response interfaces is simpler, smaller, and keeps the feedback collector self-contained for future extraction. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none added) | -- | -- | The existing stack (Vue 3 + TypeScript + Vite) provides everything else: composables for state, Vite env vars for config, dynamic imports for code splitting, Teleport for overlay positioning |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vite env vars | Runtime config for GitHub token and repo | `VITE_FEEDBACK_GITHUB_TOKEN`, `VITE_FEEDBACK_GITHUB_REPO`, `VITE_FEEDBACK_ENABLED`. Namespace with `FEEDBACK_` to avoid future collisions. |
| Vite dead-code elimination | Production build exclusion | Gate the entire feedback module behind `import.meta.env.DEV` so Vite tree-shakes it from prod. |
| Existing Vitest + happy-dom | Unit testing feedback composables and logic | No new test tooling needed. Screenshot capture mocked in unit tests; visual verification via Storybook. |

## Installation

```bash
# Runtime dependencies (loaded only in dev/staging, but installed as regular deps)
npm install html2canvas css-selector-generator
```

No new dev dependencies needed.

## Integration Points with Existing Stack

### Vue 3 Composition API
- **Feedback state:** Single `useFeedbackCollector()` composable manages picker mode, selected element, overlay visibility, submission state via `ref()` and `reactive()`
- **Overlay UI:** Standard Vue 3 SFC with `<Teleport to="body">` for overlay positioning outside the app DOM hierarchy
- **Lifecycle:** `onMounted`/`onUnmounted` for event listener cleanup (mousemove, click, keydown handlers)
- **Provide/inject not needed:** The feedback tool is a single entry point, not a distributed component tree

### Vite Build System
- **Env vars:** `import.meta.env.VITE_FEEDBACK_*` — works out of the box, no vite.config changes
- **Dynamic import:** `const { default: html2canvas } = await import('html2canvas')` — lazy-load only when picker activates. Vite splits this into a separate chunk automatically.
- **Production exclusion:** Wrap component registration in `if (import.meta.env.DEV)` — Vite replaces with `if (false)` in production, and the bundler eliminates the dead code path including the dynamic import

### Vue Router
- **Current route capture:** `useRoute().fullPath` provides page context for the issue body — already available, no changes needed

### Existing CSS Design Token System
- **Self-contained styling:** Feedback collector uses its own scoped CSS with `--fc-*` prefixed custom properties to avoid polluting the design token namespace
- **Consumes base tokens:** Font family, base colors for text readability, but defines its own overlay/highlight/toolbar colors
- **Future extraction:** Self-contained tokens and prefixed classes make it extractable into a standalone package later

## GitHub API Surface (Why Not Octokit)

Only two endpoints. TypeScript interfaces for response shapes total ~20 lines vs pulling in @octokit/rest (8KB core + 5 transitive deps with 800+ endpoint methods).

### 1. Create Gist (screenshot upload)
```typescript
// POST https://api.github.com/gists
interface CreateGistRequest {
  files: Record<string, { content: string }>
  public: boolean
  description?: string
}
// Response includes files[name].raw_url for embedding in issue body
```

### 2. Create Issue (bug report)
```typescript
// POST https://api.github.com/repos/{owner}/{repo}/issues
interface CreateIssueRequest {
  title: string
  body: string       // Markdown with embedded screenshot URL from Gist
  labels?: string[]  // e.g., ["feedback", "visual-bug"]
}
```

### Fallback: Data URI
If Gist creation fails (rate limit, token scope), fall back to embedding the screenshot as a base64 data URI directly in the issue body. GitHub Issues support inline images via `![screenshot](data:image/png;base64,...)` — larger issue body but functional without Gist permissions.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| html2canvas 1.4.1 | modern-screenshot 4.6.8 | If html2canvas has rendering bugs with the site's CSS cascade layers or custom properties. modern-screenshot (185KB unpacked, actively maintained through 2026-01-26) is a lighter fork with newer CSS support. Try html2canvas first — its broader adoption means more known workarounds. |
| html2canvas 1.4.1 | html-to-image 1.11.13 | Avoid. 2-year publish gap (2023-02 to 2025-02) signals inconsistent maintenance. modern-screenshot is the better fallback. |
| css-selector-generator 3.9.1 | @medv/finder 4.0.2 | If selector output quality is poor for this site's DOM. finder is simpler (14KB vs 427KB) but less configurable — no control over selector strategy priority. Last update 2024-12-13, less actively maintained. |
| css-selector-generator 3.9.1 | Hand-rolled selector generation | Never. Edge cases (duplicate IDs, Vue-generated class hashes, namespaced attributes, nth-child ambiguity) make hand-rolled selectors unreliable in real DOMs. |
| Native fetch | @octokit/rest 22.0.1 | Only if the project later needs many GitHub API endpoints. For 2 endpoints, Octokit adds unjustified dependency weight and complexity. |
| Native fetch | @octokit/core 7.0.6 | Even the "lightweight" core pulls 7 transitive deps. Not worth it for 2 fetch calls with simple JSON payloads. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| @octokit/rest or @octokit/core | 5-7 transitive deps for 2 API calls. Typed methods for 800+ endpoints we never use. Excessive for a dev tool. | Native fetch + 2 TypeScript interfaces |
| dom-to-image | Abandoned since 2017. html-to-image forked from it, modern-screenshot forked from that. | html2canvas |
| html-to-image | Inconsistent maintenance (2-year publish gap). modern-screenshot is the maintained fork. | html2canvas (primary) or modern-screenshot (fallback) |
| Any feedback SaaS SDK (BugHerd, Userback, Marker.io) | External service dependency. This is a self-hosted dev tool using GitHub as backend. Adding SaaS defeats the purpose. | Native GitHub API integration |
| Pinia or Vuex for feedback state | Overkill. Feedback state is ephemeral (picker on/off, selected element ref, comment text, submission status). A composable with `ref()` handles this. | `useFeedbackCollector()` composable |
| External image hosting (Imgur, Cloudinary) | Third-party dependency for a dev tool. GitHub Gists accept file content directly. | GitHub Gist API with base64-encoded PNG |
| Floating UI / Popper.js for overlay positioning | The overlay is a full-panel or anchored dialog, not a tooltip tracking dynamic positions. CSS `position: fixed` or simple offset from bounding rect is sufficient. | CSS positioning with `getBoundingClientRect()` |

## Stack Patterns by Variant

**If html2canvas fails on cascade layers or CSS custom properties:**
- Swap to `modern-screenshot` — similar API: `domToPng(element)` returns a base64 string directly (no canvas intermediate)
- Both produce base64 PNG for Gist upload
- html2canvas was last updated 2022; CSS cascade layers shipped in browsers mid-2022. If rendering is wrong, modern-screenshot (updated 2026) handles newer CSS

**If screenshot quality or fidelity is insufficient:**
- Consider `navigator.mediaDevices.getDisplayMedia()` for actual viewport capture
- Trade-off: requires user permission prompt, but captures exactly what's on screen
- Only pursue if DOM-to-canvas produces visibly wrong output for this site's CSS

**If GitHub token security is a concern:**
- Token is exposed in client-side code — acceptable because tool is dev/staging only
- Use a fine-grained personal access token scoped to only the target repo + gist permissions
- Vite's `import.meta.env.DEV` gate ensures token is never in production bundles
- `.env.local` (gitignored) for the actual token value

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| html2canvas@1.4.1 | Vite 6.x, Vue 3.5.x | Pure JS library, no framework coupling. ESM + CJS exports. Works with Vite's dynamic import code splitting. |
| css-selector-generator@3.9.1 | Vite 6.x, Vue 3.5.x | Pure JS library with ESM exports. Ships TypeScript declarations. No DOM framework dependencies. |
| html2canvas@1.4.1 | TypeScript ~5.7 | Check if `@types/html2canvas` is needed at install time. The package may or may not bundle its own type declarations. |
| css-selector-generator@3.9.1 | TypeScript ~5.7 | Ships built-in TypeScript declarations. No `@types/` package needed. |

## Dependency Impact Summary

| Metric | Before v3.0 | After v3.0 | Delta |
|--------|-------------|------------|-------|
| Runtime deps | 3 (vue, vue-router, @unhead/vue) | 5 (+html2canvas, +css-selector-generator) | +2 packages |
| Production bundle | Unchanged | Unchanged | +0 bytes (dev-only gating) |
| Dev bundle | Current | +html2canvas chunk (~150KB gzipped, lazy-loaded) | Loaded on demand only |
| Dev deps | 14 | 14 | +0 (no new dev deps) |

## Sources

- npm registry (queried 2026-04-03) -- version numbers, publish dates, unpacked sizes, dependency trees for: html2canvas, html-to-image, modern-screenshot, @octokit/rest, @octokit/core, css-selector-generator, @medv/finder
- Repository `package.json` -- confirmed 3 runtime deps, 14 dev deps, Vue 3.5, Vite 6, TypeScript 5.7
- Repository `vite.config.ts` -- confirmed dynamic import support, no special config needed for env vars
- Repository `vitest.config.ts` -- confirmed happy-dom unit test setup, no new test tooling needed
- GitHub REST API docs (training data, MEDIUM confidence) -- Gist and Issue creation endpoints, request/response shapes

---
*Stack research for: v3.0 Visual Feedback Collector*
*Researched: 2026-04-03*
