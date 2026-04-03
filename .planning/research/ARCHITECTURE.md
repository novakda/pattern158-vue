# Architecture Research

**Domain:** Visual feedback collector overlay for Vue 3 SPA
**Researched:** 2026-04-03
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        App Shell (App.vue)                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ <NavBar />                                          z:100-101│  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ <router-view />  (page content)                              │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ <FooterBar />                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ <FeedbackCollector />  (conditional, dev/staging only) z:10k │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐     │  │
│  │  │ TriggerFab │  │ PickerOverlay│  │ AnnotationPanel   │     │  │
│  │  │ (always)   │  │ (picker mode)│  │ (after selection) │     │  │
│  │  └────────────┘  └──────────────┘  └───────────────────┘     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  useFeedback() composable ── state machine, orchestrates pipeline  │
│  useFeedbackConfig() composable ── env var resolution              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │  External Services  │
                    │  ┌──────────────┐   │
                    │  │ html2canvas  │   │
                    │  │ (screenshot) │   │
                    │  ├──────────────┤   │
                    │  │ GitHub Gist  │   │
                    │  │ (img upload) │   │
                    │  ├──────────────┤   │
                    │  │ GitHub Issues│   │
                    │  │ (submission) │   │
                    │  └──────────────┘   │
                    └─────────────────────┘
```

## Component Responsibilities

### New Components

| Component | Responsibility | Type | Location |
|-----------|----------------|------|----------|
| `FeedbackCollector.vue` | Root orchestrator; mounts trigger, picker, and panel; owns lifecycle | SFC (new) | `src/components/feedback/FeedbackCollector.vue` |
| `FeedbackTrigger.vue` | Floating action button + keyboard shortcut listener; emits `activate` | SFC (new) | `src/components/feedback/FeedbackTrigger.vue` |
| `PickerOverlay.vue` | Full-viewport transparent overlay; tracks mouse, highlights hovered element, emits `select` with element ref | SFC (new) | `src/components/feedback/PickerOverlay.vue` |
| `AnnotationPanel.vue` | Slide-in panel anchored near selection; comment textarea, metadata display, submit/cancel actions | SFC (new) | `src/components/feedback/AnnotationPanel.vue` |

### New Composables

| Composable | Responsibility | Location |
|------------|----------------|----------|
| `useFeedback()` | State machine (idle/picking/annotating/submitting/done/error), element capture, screenshot orchestration, submission pipeline | `src/composables/useFeedback.ts` |
| `useFeedbackConfig()` | Reads `VITE_*` env vars, validates presence, exposes typed config reactive | `src/composables/useFeedbackConfig.ts` |

### New Services (pure functions, no Vue dependency)

| Service | Responsibility | Location |
|---------|----------------|----------|
| `captureElement.ts` | Given DOM element: extract tag, compute CSS selector path, read bounding rect, call html2canvas | `src/services/feedback/captureElement.ts` |
| `githubSubmit.ts` | Upload screenshot to Gist, create Issue with markdown body linking screenshot | `src/services/feedback/githubSubmit.ts` |

### Modified Files

| File | Change | Why |
|------|--------|-----|
| `App.vue` | Add conditional `<FeedbackCollector />` after `<FooterBar />` | Mount point for the overlay system |

No other existing files are modified. The feedback system is fully additive. `vite.config.ts` needs no changes -- `import.meta.env.VITE_*` works out of the box.

## Recommended Project Structure

```
src/
├── components/
│   ├── feedback/                  # NEW -- self-contained feedback module
│   │   ├── FeedbackCollector.vue  # Root orchestrator
│   │   ├── FeedbackTrigger.vue    # FAB + keyboard shortcut
│   │   ├── PickerOverlay.vue      # Element selection overlay
│   │   ├── AnnotationPanel.vue    # Comment + submit panel
│   │   ├── feedback.css           # All feedback styles (self-contained)
│   │   └── feedback.types.ts      # Shared TypeScript types
│   ├── exhibit/                   # existing
│   ├── NavBar.vue                 # existing
│   ├── FooterBar.vue              # existing
│   └── ...                        # existing
├── composables/
│   ├── useFeedback.ts             # NEW -- state machine + pipeline
│   ├── useFeedbackConfig.ts       # NEW -- env var config
│   ├── useBodyClass.ts            # existing
│   └── useSeo.ts                  # existing
├── services/
│   └── feedback/                  # NEW -- pure business logic
│       ├── captureElement.ts      # DOM capture + html2canvas
│       └── githubSubmit.ts        # Gist + Issues API
└── ...
```

### Structure Rationale

- **`components/feedback/`:** Groups all feedback UI in a subdirectory following the existing `components/exhibit/` precedent. Self-contained for potential future extraction into a standalone package.
- **`composables/`:** Follows existing flat pattern (`useBodyClass`, `useSeo`). Two new composables at the same level.
- **`services/feedback/`:** New directory. Pure functions with no Vue dependency -- testable in isolation with happy-dom, no component mounting needed. Separates API/DOM concerns from Vue reactivity.
- **`feedback.css`:** Single CSS file imported by `FeedbackCollector.vue`, not added to `main.css`. Keeps feedback styles completely decoupled from the design system. Uses its own CSS custom properties prefixed with `--fb-*` to avoid token collision.

## Architectural Patterns

### Pattern 1: Conditional Mount with Build-Time Dead Code Elimination

**What:** Wrap the entire feedback system in an `import.meta.env` check so Vite tree-shakes it from production builds.
**When to use:** Dev/staging-only features that must have zero production footprint.
**Trade-offs:** Simple and reliable. Vite statically replaces `import.meta.env.MODE` at build time, so the entire component tree is eliminated. No runtime cost.

**Implementation in App.vue:**
```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'

// Dynamic import -- only resolved when condition is true
// Vite replaces import.meta.env.MODE at build time
const FeedbackCollector = import.meta.env.MODE !== 'production'
  ? defineAsyncComponent(() => import('@/components/feedback/FeedbackCollector.vue'))
  : null
</script>

<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header>
    <NavBar />
  </header>
  <main id="main-content" aria-label="Main content">
    <router-view />
  </main>
  <FooterBar />
  <FeedbackCollector v-if="FeedbackCollector" />
</template>
```

**Why `defineAsyncComponent` + conditional:** Vite's static analysis sees `import.meta.env.MODE !== 'production'` as a compile-time constant. In production mode, the condition is `false`, the dynamic import is never reached, and the entire `FeedbackCollector` chunk (plus html2canvas, etc.) is tree-shaken from the bundle. Zero bytes in production.

**Alternative considered (env var toggle):** A `VITE_FEEDBACK_ENABLED=true` env var adds flexibility but is less foolproof. The mode-based approach guarantees no accidental production exposure. Support both: mode check as the primary gate, env var as an override for testing in staging-like builds.

### Pattern 2: State Machine Composable

**What:** A composable that manages the feedback flow through explicit states rather than scattered boolean flags.
**When to use:** Multi-step workflows where the UI depends on which step is active.
**Trade-offs:** Slightly more code up front, but prevents impossible state combinations (e.g., picker active while submitting).

**State machine:**
```
idle --> picking --> annotating --> submitting --> done
                        |                          |
                      idle (cancel)              idle (reset)
                                                   |
                                               error --> idle (retry/dismiss)
```

**Composable shape:**
```typescript
interface FeedbackState {
  phase: 'idle' | 'picking' | 'annotating' | 'submitting' | 'done' | 'error'
  selectedElement: HTMLElement | null
  capture: ElementCapture | null  // selector, rect, screenshot
  comment: string
  error: string | null
  issueUrl: string | null
}

export function useFeedback() {
  const state = reactive<FeedbackState>({ /* defaults */ })

  function activate() { state.phase = 'picking' }
  function selectElement(el: HTMLElement) { /* capture + transition to annotating */ }
  function submit() { /* transition to submitting, call services, then done/error */ }
  function cancel() { state.phase = 'idle'; reset() }
  function reset() { /* clear all state */ }

  return {
    state: readonly(state),
    activate, selectElement, submit, cancel, reset
  }
}
```

**Why a single composable, not component-local state:** The picker overlay, annotation panel, and trigger button all need to read/write the same state. A shared composable avoids prop-drilling through three levels or reaching for a store library.

### Pattern 3: Transparent Overlay for Element Picking

**What:** A full-viewport `position: fixed` transparent div that intercepts all pointer events during picker mode. Mouse position determines which underlying element to highlight (via `document.elementFromPoint` after temporarily hiding the overlay).
**When to use:** Any "click to select an element" interaction.
**Trade-offs:** Requires briefly toggling `pointer-events: none` on the overlay to probe the real DOM beneath. This is a standard technique used by browser DevTools-style element pickers.

**Core technique:**
```typescript
function handleMouseMove(e: MouseEvent) {
  // Temporarily hide overlay to probe real DOM
  overlay.value!.style.pointerEvents = 'none'
  const el = document.elementFromPoint(e.clientX, e.clientY)
  overlay.value!.style.pointerEvents = 'auto'

  if (el && el !== document.body && el !== document.documentElement) {
    highlightElement(el as HTMLElement)
  }
}
```

**Highlight rendering:** Use a separate absolutely-positioned div that mirrors the target element's `getBoundingClientRect()`. Do not mutate the target element's styles -- that would break layouts and corrupt screenshots.

### Pattern 4: Self-Contained Styling (No Design Token Coupling)

**What:** The feedback system uses its own CSS file with `--fb-*` prefixed custom properties, imported only by `FeedbackCollector.vue`. Does not consume the site's design tokens.
**When to use:** When building a tool overlay that should be visually distinct from the host application and potentially extractable.
**Trade-offs:** Some visual inconsistency with the host site (acceptable -- the feedback tool is a developer tool, not a user-facing feature). Gains full portability.

**CSS isolation approach:**
```css
/* feedback.css -- scoped via .fb- class prefix */
.fb-root {
  --fb-bg: #1a1a2e;
  --fb-text: #e0e0e0;
  --fb-accent: #4fc3f7;
  --fb-radius: 8px;
  --fb-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  --fb-z-overlay: 10000;
  --fb-z-panel: 10001;
  --fb-z-trigger: 9998;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

All feedback component classes prefixed with `fb-` to avoid collision with the site's `@layer` system.

## Data Flow

### Picker-to-Capture-to-Submit Pipeline

```
[User clicks FAB / presses shortcut]
    |
[useFeedback.activate()] --> phase: 'picking'
    |
[PickerOverlay mounts] --> listens mousemove, renders highlight div
    |
[User clicks element]
    |
[useFeedback.selectElement(el)]
    ├── captureElement(el) --> { tag, selectorPath, boundingRect }
    ├── html2canvas(el) --> screenshot as data URI
    └── phase: 'annotating'
    |
[AnnotationPanel mounts] --> shows screenshot preview, metadata, comment textarea
    |
[User types comment, clicks Submit]
    |
[useFeedback.submit()] --> phase: 'submitting'
    ├── githubSubmit.uploadScreenshot(dataUri) --> Gist URL
    ├── githubSubmit.createIssue({ comment, selectorPath, rect, viewport, ... })
    └── phase: 'done' (or 'error')
    |
[AnnotationPanel shows success] --> Issue URL link
    |
[Auto-reset or user dismiss] --> phase: 'idle'
```

### Element Capture Detail

```
HTMLElement
    |
captureElement(el)
    ├── el.tagName                         --> "DIV"
    ├── computeSelectorPath(el)            --> "main > section:nth-child(2) > .card"
    ├── el.getBoundingClientRect()         --> { x, y, width, height }
    └── html2canvas(el, { useCORS: true }) --> Canvas --> toDataURL('image/png')
    |
ElementCapture { tag, selectorPath, boundingRect, screenshotDataUri }
```

### GitHub Submission Detail

```
ElementCapture + comment + browser context
    |
githubSubmit.uploadScreenshot(dataUri, token)
    ├── Base64-decode data URI
    ├── POST /gists { files: { 'screenshot.png': { content: base64 } } }
    └── Return raw file URL from Gist response
    |
githubSubmit.createIssue({ token, repo, title, body })
    ├── Build markdown body:
    │   - Comment text
    │   - Screenshot image (Gist URL or inline data URI fallback)
    │   - Element: tag + selector path
    │   - Bounding rect
    │   - Viewport dimensions
    │   - User agent
    │   - Current URL + route path
    ├── POST /repos/{owner}/{repo}/issues
    └── Return issue URL
```

## Z-Index Strategy

The existing site uses this z-index hierarchy (audited from `main.css`):

| Layer | Current z-index | Usage |
|-------|----------------|-------|
| Skip link | 9999 | Accessibility skip-to-content |
| Hamburger button | 101 | Mobile nav toggle |
| Nav bar / mobile menu | 100 | Sticky header, slide-out menu |
| Content decorative | 1-2 | Pseudo-elements, hover effects |

The feedback system must sit above everything except the skip link in idle mode, and above everything during active picking:

| Layer | z-index | Rationale |
|-------|---------|-----------|
| `--fb-z-trigger` (FAB) | 9998 | Below skip link (9999), above nav (100). Always visible in dev. |
| `--fb-z-overlay` (picker) | 10000 | Above skip link during picking -- picker must intercept all clicks. |
| `--fb-z-panel` (annotation) | 10001 | Above overlay so panel is interactive. |
| `--fb-z-highlight` | 10000 | Same as overlay (child of overlay). |

The skip link (9999) only appears on keyboard focus. During picker mode the overlay (10000) covers everything, which is correct -- the picker is a modal interaction that should block all other UI. When the picker is dismissed, it unmounts and the skip link is accessible again.

## Build-Time Feature Gating

### Mechanism

Vite replaces `import.meta.env.MODE` with the string literal `"production"` or `"development"` at build time. This is a compile-time constant, not a runtime check.

```
npm run dev     --> MODE = "development"  --> FeedbackCollector included
npm run build   --> MODE = "production"   --> FeedbackCollector dead-code eliminated
npm run preview --> MODE = "production"   --> FeedbackCollector absent
```

### Env Var Configuration

```bash
# .env.development (checked into repo -- no secrets)
VITE_FEEDBACK_ENABLED=true

# .env.local (gitignored -- developer-specific secrets)
VITE_GITHUB_TOKEN=ghp_...
VITE_GITHUB_REPO=owner/repo
```

The composable validates at mount time:
```typescript
export function useFeedbackConfig() {
  const token = import.meta.env.VITE_GITHUB_TOKEN ?? ''
  const repo = import.meta.env.VITE_GITHUB_REPO ?? ''
  const enabled = import.meta.env.VITE_FEEDBACK_ENABLED === 'true'

  const isConfigured = computed(() => enabled && !!token && !!repo)
  const missingVars = computed(() => {
    const missing: string[] = []
    if (!token) missing.push('VITE_GITHUB_TOKEN')
    if (!repo) missing.push('VITE_GITHUB_REPO')
    return missing
  })

  return { token, repo, enabled, isConfigured, missingVars }
}
```

If env vars are missing, the FAB renders in a "disabled" state with a tooltip explaining what to configure. No console errors, no silent failure.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| html2canvas | NPM dependency, called from `captureElement.ts` | ~40KB gzipped. Renders DOM to canvas. Known limitations: no CSS `backdrop-filter`, no `video`/`iframe` content. Sufficient for static portfolio content. |
| GitHub Gist API | REST `POST /gists` from `githubSubmit.ts` | Used for screenshot hosting. Public gist = publicly accessible raw URL for embedding in Issue body. Token needs `gist` scope. |
| GitHub Issues API | REST `POST /repos/{owner}/{repo}/issues` from `githubSubmit.ts` | Token needs `repo` scope (or `public_repo` for public repos). |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| App.vue to FeedbackCollector | Conditional render, no props | FeedbackCollector is self-sufficient via composables |
| FeedbackCollector to child components | Props down, events up | Standard Vue parent-child. State lives in `useFeedback()` composable called by FeedbackCollector. |
| Composables to services | Direct function calls | Services are pure functions. Composable awaits promises. |
| Feedback system to host page | Read-only DOM access | Picker reads element positions. Never mutates host DOM. Screenshot via html2canvas reads only. |

## Anti-Patterns

### Anti-Pattern 1: Mutating Host DOM During Picking

**What people do:** Add CSS classes or inline styles directly to the hovered element to show a highlight.
**Why it's wrong:** Mutating the target element can trigger layout reflow, break CSS animations, and produce incorrect screenshots (the highlight border would appear in the capture).
**Do this instead:** Render a separate absolutely-positioned highlight `<div>` that mirrors the target's `getBoundingClientRect()`. The highlight is a visual overlay, not a DOM mutation.

### Anti-Pattern 2: Importing Design Tokens Into Feedback CSS

**What people do:** Use `var(--color-primary)` and other host tokens in feedback component styles.
**Why it's wrong:** Creates coupling between the feedback tool and the host site's theme. Breaks extraction. Dark/light theme changes could make feedback UI unreadable if token values shift unexpectedly.
**Do this instead:** Define `--fb-*` custom properties on `.fb-root`. The feedback tool owns its own visual language.

### Anti-Pattern 3: Runtime Feature Flag Instead of Build-Time Gating

**What people do:** Check a runtime variable or API response to decide whether to show the feedback tool.
**Why it's wrong:** The entire feedback system (html2canvas, GitHub API code, overlay components) ships in the production bundle even when hidden. Wastes approximately 50-80KB gzipped for code that will never execute.
**Do this instead:** Use `import.meta.env.MODE` check with `defineAsyncComponent` so Vite eliminates the entire code path at build time.

### Anti-Pattern 4: Using Vuex/Pinia for Feedback State

**What people do:** Add a Pinia store for the feedback tool's state.
**Why it's wrong:** The project does not currently use Pinia. Adding a state management library for a single dev-only tool is over-engineering. The state is local to the feedback flow, not shared application state.
**Do this instead:** A single `useFeedback()` composable with `reactive()` state. The composable is the store.

### Anti-Pattern 5: Mounting Feedback Inside Router View

**What people do:** Register the feedback collector as a route or mount it inside `<router-view>`.
**Why it's wrong:** The feedback tool must persist across route navigations. If mounted inside the router view, it unmounts and remounts on every navigation, losing state mid-flow.
**Do this instead:** Mount at the App.vue level, outside `<router-view>`. It lives for the entire session.

## Suggested Build Order

Dependencies flow downward -- each phase builds on the prior.

| Phase | What to Build | Depends On | Rationale |
|-------|---------------|------------|-----------|
| 1 | `feedback.types.ts`, `useFeedbackConfig.ts`, `FeedbackTrigger.vue`, `FeedbackCollector.vue` (shell), App.vue mount point, `feedback.css` (initial) | Nothing | Establishes the feature gate, env var config, and visible FAB. Can verify build-time elimination immediately. |
| 2 | `PickerOverlay.vue`, highlight rendering | Phase 1 (trigger activates picker) | Core interaction: hover + highlight. No external dependencies yet. |
| 3 | `captureElement.ts`, html2canvas integration | Phase 2 (picker selects element) | Adds screenshot capability. First external dependency (html2canvas). |
| 4 | `AnnotationPanel.vue`, `useFeedback.ts` state machine | Phase 2-3 (needs capture data to display) | Comment UI + metadata display. Full local flow works end-to-end (minus submission). |
| 5 | `githubSubmit.ts`, Gist upload, Issue creation | Phase 4 (needs comment + capture to submit) | Final piece: external API integration. Last because it requires token config and is the most complex to test. |
| 6 | Keyboard shortcuts, edge cases, Storybook stories, polish | All prior phases | Polish pass. Keyboard shortcut (e.g., Ctrl+Shift+F). Stories for each sub-component. |

**Rationale for this order:** Each phase produces a testable, visible increment. Phase 1 validates the critical architecture decision (build-time gating) before writing any feature code. Phases 2-4 build the local pipeline without needing API tokens. Phase 5 adds external integration last, when the local flow is proven.

## Sources

- Vite env var handling: `import.meta.env` static replacement is core Vite behavior, verified by examining `vite.config.ts` and existing build scripts (HIGH confidence)
- html2canvas: well-established library for DOM-to-canvas rendering (HIGH confidence)
- GitHub REST API (Gists, Issues): Official GitHub API documentation (HIGH confidence)
- Vue 3 `defineAsyncComponent`: Vue 3 core API (HIGH confidence)
- Z-index values: Derived directly from `src/assets/css/main.css` audit -- skip-link at 9999, nav at 100-101, content decorative at 1-2 (HIGH confidence, primary source)
- Overlay pointer-events technique: Standard pattern used by browser DevTools element pickers (HIGH confidence)
- Existing codebase patterns: `components/exhibit/` subdirectory, `useBodyClass`/`useSeo` composables, `@layer` CSS system, all verified by direct file reads (HIGH confidence)

---
*Architecture research for: Pattern 158 v3.0 -- Visual Feedback Collector*
*Researched: 2026-04-03*
