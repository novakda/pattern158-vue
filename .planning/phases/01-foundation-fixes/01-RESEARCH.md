# Phase 1: Foundation Fixes - Research

**Researched:** 2026-03-16
**Domain:** Vue 3 accessibility fixes, Vue Router catch-all, Vitest browser-mode test infrastructure
**Confidence:** HIGH

## Summary

Phase 1 has three discrete, well-bounded tasks: (1) remove nested `<main>` elements from pages that duplicate App.vue's outer `<main>`, (2) add a catch-all 404 route and create NotFoundPage, and (3) complete the test infrastructure by installing `vitest-browser-vue` and writing a working `vitest.config.ts`. All three tasks are internally simple but have specific gotchas worth flagging for the planner.

The nested `<main>` fix requires understanding the CSS scoping architecture: `.page-technologies`, `.page-contact`, and `.page-index` classes are applied to `<body>` via `useBodyClass()` — they do NOT come from the old `<main class="...">` wrappers. The wrappers can be removed entirely, and CSS will continue to work correctly through the `<body>` class applied by the composable.

The test infrastructure situation is more interesting than it appears. `vitest@4.1.0`, `@vitest/browser-playwright@4.1.0`, `playwright@1.58.2`, and `@vitest/coverage-v8@4.1.0` are already installed. Only `vitest-browser-vue` is missing. The phase needs a `vitest.config.ts` at the project root and test scripts in `package.json` — neither exist yet. `@storybook/addon-vitest` is also installed and expects a `vitest.config.ts` with its projects pattern, so the config needs to coexist with Storybook's test plugin.

**Primary recommendation:** Remove `<main>` from three pages using Vue fragments, add a single catch-all router entry pointing to NotFoundPage, install `vitest-browser-vue`, and write a dual-project `vitest.config.ts` supporting both `happy-dom` (unit) and browser/Playwright (component) environments.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Remove the nested `<main>` wrapper entirely from TechnologiesPage, ContactPage, and HomePage — App.vue already provides `<main id="main-content" aria-label="Main content">`
- Use Vue 3 fragments (multiple root nodes) — no replacement wrapper element needed
- Pages become bare templates with `<section>` siblings at the top level
- Full test infra setup, not just package install: vitest.config.ts, test scripts in package.json
- Install both vitest-browser-vue (real browser component tests) AND happy-dom (fast unit tests for composables/utilities)
- Config should support both test environments
- Include one smoke test to verify the infra works end-to-end — no meaningful test coverage yet (that's Phase 2+)

### Claude's Discretion
- Whether to keep or drop page-level classes/ids from the old `<main>` wrappers — check if CSS targets them, keep only if needed
- NotFoundPage design (message tone, navigation links, visual style) — use a simple, clean approach consistent with the site's existing design system
- Exact vitest.config.ts settings and test script naming

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| A11Y-01 | Fix nested `<main>` invalid HTML in TechnologiesPage and ContactPage | Vue 3 fragments allow multi-root templates; CSS scoping confirmed via useBodyClass on body, not the old main wrappers; HomePage also has the same violation |
</phase_requirements>

---

## Standard Stack

### Core — Already Installed
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | 4.1.0 | Test runner | Vue/Vite native; Composition API aware |
| @vitest/browser-playwright | 4.1.0 | Browser mode provider | Real DOM testing without JSDOM fidelity gaps |
| playwright | 1.58.2 | Browser automation | The provider vitest-browser-vue requires |
| @vitest/coverage-v8 | 4.1.0 | Code coverage | V8-native; no istanbul transform overhead |

### Needs Installing
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest-browser-vue | ^0.1.0 | Vue component rendering in browser mode | Official Vitest community package; replaces @testing-library/vue for browser-mode tests |
| happy-dom | latest | Fast DOM simulation for unit tests | Faster than jsdom; standard vitest unit env |

**Installation:**
```bash
npm install -D vitest-browser-vue happy-dom
```

**Note:** `happy-dom` may already be available — check with `npm ls happy-dom` before installing.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vitest-browser-vue | @testing-library/vue | @testing-library/vue is jsdom-oriented; vitest-browser-vue is designed for real browser mode — required for the locked decision |
| happy-dom | jsdom | jsdom is heavier; happy-dom is the vitest default recommendation for speed |

---

## Architecture Patterns

### File Locations

```
src/
├── pages/
│   ├── TechnologiesPage.vue    # EDIT: remove <main> wrapper
│   ├── ContactPage.vue         # EDIT: remove <main> wrapper
│   ├── HomePage.vue            # EDIT: remove <main> wrapper
│   └── NotFoundPage.vue        # NEW: catch-all 404 page
├── router.ts                   # EDIT: add catch-all route
vitest.config.ts                # NEW: dual-environment config
package.json                    # EDIT: add test scripts
src/composables/
│   └── useSeo.test.ts          # NEW: smoke test (or any simple .test.ts)
```

### Pattern 1: Vue 3 Fragment — Removing the `<main>` Wrapper

**What:** Replace a single-root template wrapped in `<main>` with a multi-root template (Vue 3 fragment). Vue 3 natively supports multiple root nodes — no wrapper div required.

**When to use:** When the outer wrapper is semantically wrong (nested `<main>`) and CSS does not depend on the wrapper element's own class or id.

**CSS scoping — confirmed safe to remove:**
The CSS in `main.css` scopes all page-specific styles via `.page-technologies`, `.page-index`, and `.page-contact` classes on `<body>` (applied by `useBodyClass()`). The old `<main>` and `<div>` wrappers do NOT provide the scoping class — `useBodyClass` adds it to `<body>`. Removing the wrappers will not break any CSS rule.

**TechnologiesPage — current structure:**
```html
<template>
  <div class="page-technologies">   <!-- outer wrapper with class -->
    <HeroMinimal ... />
    <main id="main-content" ...>    <!-- NESTED main — invalid -->
      <template v-for="...">
        <section ...>...</section>
      </template>
    </main>
  </div>
</template>
```

**TechnologiesPage — corrected structure (fragment):**
```html
<template>
  <HeroMinimal ... />
  <template v-for="category in technologies" :key="category.id">
    <section ...>...</section>
    <section ...>...</section>
  </template>
</template>
```

The `.page-technologies` class was on the `<div>` wrapper, NOT on the `<main>`. Since CSS scoping comes from `<body class="page-technologies">` (via `useBodyClass`), the div wrapper is redundant and can be dropped.

**ContactPage — current structure:**
```html
<template>
  <HeroMinimal ... />              <!-- already fragment root 1 -->
  <main id="main-content" ...>    <!-- NESTED main — invalid -->
    <section ...>...</section>
    <section ...>...</section>
    <section ...>...</section>
  </main>
</template>
```

**ContactPage — corrected structure (already almost a fragment):**
```html
<template>
  <HeroMinimal ... />
  <section class="contact-methods">...</section>
  <section class="guidance">...</section>
  <section class="testimonial">...</section>
</template>
```

ContactPage note: `HeroMinimal` is referenced in the template but NOT imported in script setup — this is a pre-existing bug. Import needs adding.

**HomePage — current structure:**
```html
<template>
  <main id="main-content" ...>    <!-- NESTED main — invalid -->
    <section class="hero">...</section>
    ...more sections...
  </main>
</template>
```

**HomePage — corrected structure:**
```html
<template>
  <section class="hero">...</section>
  <section class="intro">...</section>
  ...
</template>
```

### Pattern 2: Vue Router Catch-All Route

**What:** A wildcard route added at the end of the routes array that catches any path not matched by earlier routes.

**Source:** CONCERNS.md documents the fix approach verbatim.

**Example:**
```typescript
// src/router.ts — add as LAST entry in routes array
{ path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') }
```

**Why last:** Vue Router matches routes in order. The catch-all must be last or it will swallow valid routes.

### Pattern 3: NotFoundPage Structure

**What:** A simple page component following the same conventions as PhilosophyPage (the reference page). Uses existing design tokens. No `<main>` wrapper (App.vue provides it). Uses `useSeo` and `useBodyClass`.

**Example:**
```vue
<script setup lang="ts">
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import { useRouter } from 'vue-router'

useBodyClass('page-not-found')
useSeo({
  title: '404 — Page Not Found | Pattern 158',
  description: 'The page you requested could not be found.',
  path: '/404',
})

const router = useRouter()
</script>

<template>
  <section class="not-found">
    <div class="container">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
    </div>
  </section>
</template>
```

### Pattern 4: Dual-Environment vitest.config.ts

**What:** A single `vitest.config.ts` using the `projects` array (Vitest 4+ API) to run unit tests in `happy-dom` and component tests in real Playwright browser.

**Source:** Verified against vitest.dev/guide/browser docs (2025) — `projects` is the Vitest 4 API; `workspace` is the older name.

```typescript
// vitest.config.ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.browser.test.ts'],
          environment: 'happy-dom',
          globals: true,
        },
      },
      {
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          globals: true,
        },
      },
    ],
  },
})
```

**File naming convention:** `.test.ts` = unit (happy-dom), `.browser.test.ts` = browser component tests.

**Note on Storybook:** `@storybook/addon-vitest` is already installed and has its own `vitest.config` templates that include a `storybook` project entry. The phase config above does NOT include the storybook project — that would be added in Phase 3 when Storybook stories are written. The config is forward-compatible: adding a third project entry later is additive.

### Pattern 5: Smoke Test

**What:** The simplest possible test that proves the infrastructure works end-to-end. Tests `useBodyClass` (trivial, no external deps) or a pure function. Phase 2+ adds meaningful coverage.

**Example (`src/composables/useBodyClass.test.ts`):**
```typescript
import { describe, it, expect } from 'vitest'

describe('useBodyClass — infrastructure smoke test', () => {
  it('composable module imports without error', async () => {
    const mod = await import('@/composables/useBodyClass')
    expect(mod.useBodyClass).toBeTypeOf('function')
  })
})
```

This test requires zero mocking and proves: vitest runs, `@/` alias resolves, TypeScript compiles.

### Anti-Patterns to Avoid

- **Adding a `<div>` wrapper to replace `<main>`:** The decision is Vue 3 fragments — no replacement wrapper needed.
- **Putting catch-all before specific routes:** Router matches first-wins, catch-all must be last.
- **Adding `<main>` to NotFoundPage:** App.vue provides it. Pages render inside `<router-view>` which is already inside `<main>`.
- **Setting a single environment globally in vitest.config.ts:** Overrides browser mode per-project and breaks dual-environment setup.
- **Importing `storybookTest` plugin in Phase 1 config:** Premature. Storybook integration comes in Phase 3.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Vue component mounting in tests | Custom mount utilities | vitest-browser-vue `render()` | Handles cleanup, locators, retrying assertions natively |
| Browser DOM environment | JSDOM wrapper | Playwright via `@vitest/browser-playwright` | Real browser; correct event model, no JSDOM fidelity gaps |
| Multi-root template wrapping | Extra `<div>` wrappers | Vue 3 fragment (no wrapper) | Fragments are idiomatic Vue 3; extra divs bloat DOM |
| 404 routing | Custom navigation guard | Vue Router `/:pathMatch(.*)*` | Standard router pattern; guards are for auth/guards, not 404 |

---

## Common Pitfalls

### Pitfall 1: ContactPage Missing HeroMinimal Import

**What goes wrong:** ContactPage uses `<HeroMinimal>` in its template but the component is not imported in `<script setup>`. Currently the outer `<main>` wrapper hides this because the whole thing might be served from a partial scaffold. When the fix removes the `<main>` and cleans up the template, the missing import becomes a runtime error.

**Why it happens:** Pre-existing bug in a scaffold file — the component was used in the template but `import HeroMinimal from '@/components/HeroMinimal.vue'` was not added.

**How to avoid:** Add the import as part of ContactPage's `<main>` removal task.

**Warning signs:** Vue warn: `[Vue warn]: Failed to resolve component: HeroMinimal`

### Pitfall 2: TechnologiesPage has a `<div class="page-technologies">` Wrapping `<main>`

**What goes wrong:** The class `page-technologies` appears on BOTH the outer `<div>` wrapper AND is applied to `<body>` by `useBodyClass`. If a planner removes only the `<main>` but leaves the outer `<div>`, the nested `<main>` is still gone (good) but there's an unnecessary div wrapper. If a planner removes the entire template and rebuilds it, the class is redundant.

**Why it happens:** The scaffold was built before `useBodyClass` was established as the pattern, so both approaches were applied.

**How to avoid:** In TechnologiesPage, remove both the outer `<div class="page-technologies">` AND the inner `<main id="main-content">`. The `useBodyClass('page-technologies')` call in script already handles body-class scoping. Result is a clean fragment starting with `<HeroMinimal>` and `<template v-for...>`.

### Pitfall 3: `projects` vs `workspace` API in Vitest Config

**What goes wrong:** `workspace` was the Vitest 3.x API; `projects` is the Vitest 4.x API. Mixing them causes silent fallback or errors depending on the vitest version.

**Why it happens:** Documentation for older vitest versions still shows `workspace`. The existing Storybook template in `node_modules/@storybook/addon-vitest/templates/vitest.config.template.ts` still uses `workspace` (legacy 3.x template).

**How to avoid:** Use `projects` (not `workspace`) since `vitest@4.1.0` is installed. Confirmed: the newer template `vitest.config.4.template.ts` already uses `projects`.

**Warning signs:** Config silently ignores test project settings or throws `workspace is not supported`.

### Pitfall 4: `@/` Alias Not Configured in vitest.config.ts

**What goes wrong:** Vitest needs its own `resolve.alias` for `@/` since it runs outside of Vite's main dev build context. Without it, any test importing `@/composables/...` fails with `Cannot find module '@/composables/...'`.

**Why it happens:** `vite.config.ts` has the alias but `vitest.config.ts` is a separate file that doesn't inherit it automatically.

**How to avoid:** Add `resolve.alias` to `vitest.config.ts` using `fileURLToPath(new URL('./src', import.meta.url))`.

### Pitfall 5: Skip-to-Content Link Target Breaks After Fix

**What goes wrong:** `App.vue` has `<a href="#main-content" class="skip-link">Skip to main content</a>` and `<main id="main-content">`. If page content no longer provides `id="main-content"` (they won't after the fix, which is correct), the skip link now correctly targets App.vue's `<main>`. This is the desired behavior — but if someone checks the old behavior, it may look like the skip link "broke".

**Why it happens:** Before the fix, pages had their OWN `id="main-content"` as duplicates. The skip link technically resolved twice (two elements with the same id). After the fix, only the correct one exists.

**How to avoid:** Understand that the skip link pointing to App.vue's `<main id="main-content">` is the correct, fixed state. Verify in browser: skip link focus should land on the `<main>` in App.vue.

---

## Code Examples

Verified patterns from official/codebase sources:

### Vue 3 Fragment (verified from PhilosophyPage — existing working example)
```vue
<!-- PhilosophyPage.vue — has NO outer wrapper, multiple <section> roots -->
<template>
  <section class="hero-minimal">...</section>
  <section id="brand-elements" class="content-section">...</section>
  <section id="how-i-work" class="content-section">...</section>
  <!-- ... more sections ... -->
</template>
```
PhilosophyPage is the in-project proof that Vue 3 fragments work correctly with the existing CSS and routing.

### Vue Router Catch-All (source: CONCERNS.md documents exact syntax)
```typescript
// Wildcard — MUST be last entry
{ path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue') }
```

### useBodyClass Pattern (source: existing composable in project)
```typescript
// src/composables/useBodyClass.ts
import { onMounted, onUnmounted } from 'vue'

export function useBodyClass(className: string) {
  onMounted(() => document.body.classList.add(className))
  onUnmounted(() => document.body.classList.remove(className))
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `workspace` array in vitest config | `projects` array | Vitest 4.0 | Use `projects` — `workspace` is deprecated |
| `@testing-library/vue` for component tests | `vitest-browser-vue` with browser mode | 2024-2025 | Real browser APIs instead of JSDOM simulation |
| Single environment for all tests | Per-project environments in `projects` array | Vitest 3+ | Unit tests use fast happy-dom; component tests use real browser |

---

## Open Questions

1. **Does `happy-dom` need explicit installation?**
   - What we know: It's a standard vitest dependency but may be bundled or separate depending on version.
   - What's unclear: Whether `npm ls happy-dom` shows it already available via vitest's own deps.
   - Recommendation: Run `npm ls happy-dom` in Wave 0. If not present, install `-D happy-dom`.

2. **Storybook vitest.config interaction**
   - What we know: `@storybook/addon-vitest` was installed and expects to be a named project in vitest.config.ts.
   - What's unclear: Whether running `npm test` without the storybook project entry causes warnings.
   - Recommendation: The Phase 1 config excludes the storybook project intentionally. If Storybook setup generates warnings about a missing vitest config, they can be ignored until Phase 3.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | `vitest.config.ts` — does NOT exist yet; Wave 0 creates it |
| Quick run command | `npx vitest run --project unit` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| A11Y-01 | No `<main>` wrapper in TechnologiesPage, ContactPage, HomePage | manual | Browser DevTools or W3C validator | N/A — HTML structure; no automated test written in Phase 1 |
| (infra) | vitest-browser-vue is installed | smoke | `npm ls vitest-browser-vue` | ❌ Wave 0 |
| (infra) | Test infrastructure runs end-to-end | smoke | `npx vitest run --project unit` | ❌ Wave 0 |

**Note on A11Y-01:** The success criterion is verified by opening the page in a browser and inspecting the DOM — no automated test needed for Phase 1. The test infrastructure Wave 0 provides a passing smoke test to confirm vitest itself works.

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — dual-environment (unit + browser) config
- [ ] `src/composables/useBodyClass.test.ts` — smoke test proving infra works
- [ ] Framework install: `npm install -D vitest-browser-vue happy-dom` — if `npm ls happy-dom` shows missing

---

## Sources

### Primary (HIGH confidence)
- Codebase — `src/App.vue`, `src/pages/*.vue`, `src/router.ts`, `src/assets/css/main.css` — direct inspection
- `.planning/codebase/CONCERNS.md` — documents issues and fix approach verbatim
- `.planning/codebase/TESTING.md` — recommended setup approach
- `.planning/phases/01-foundation-fixes/01-CONTEXT.md` — locked decisions

### Secondary (MEDIUM confidence)
- [vitest.dev — Browser Mode Guide](https://vitest.dev/guide/browser/) — dual-project config pattern verified
- [vitest.dev — Vue component testing](https://vitest.dev/api/browser/vue) — vitest-browser-vue render API
- [vitest-browser-vue npm/GitHub](https://github.com/vitest-dev/vitest-browser-vue) — package install confirmed, requires vitest 4.0+
- `node_modules/@storybook/addon-vitest/templates/vitest.config.4.template.ts` — Vitest 4 `projects` API confirmed

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Nested `<main>` fix: HIGH — pages directly inspected; CSS confirmed via grep; PhilosophyPage is a working in-project fragment example
- Router catch-all: HIGH — syntax documented in CONCERNS.md; Vue Router 4 standard
- Test infrastructure: HIGH — packages already installed in node_modules (except vitest-browser-vue); dual-project config verified against vitest 4 docs
- NotFoundPage design: MEDIUM — no specific design decisions locked; follows PhilosophyPage pattern (HIGH) but visual details at implementer's discretion

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable ecosystem — vitest 4 and Vue Router 4 are stable releases)
