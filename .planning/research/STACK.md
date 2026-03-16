# Stack Research

**Domain:** Vue 3 SPA — Portfolio/Static Site with Component Architecture Focus
**Researched:** 2026-03-16
**Confidence:** HIGH (core stack verified against official docs; version numbers sourced from npm/official release posts)

---

## Context

The core stack is already established and non-negotiable: Vue 3 + TypeScript 5.7 + Vite 6. This research focuses on the complementary tooling layer — testing, component documentation, and developer experience — where decisions still need to be made or validated.

The project has already installed Storybook 10, Vitest 4, Playwright, and @vitest/browser-playwright. This research confirms those choices are correct and fills in the remaining gaps.

---

## Recommended Stack

### Core Technologies (Established — No Changes)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vue 3 | ^3.5.0 | UI framework | Composition API + `<script setup>` is the current standard; Options API is legacy |
| TypeScript | ~5.7.0 | Type safety | Strict mode catches prop contract violations at compile time, not runtime |
| Vite 6 | ^6.2.0 | Build tool + dev server | HMR is near-instant for Vue SFCs; ESM-native means no CommonJS shim overhead |
| Vue Router 4 | ^4.5.0 | Client-side routing | Official Vue router; lazy-loaded routes via dynamic import reduce initial bundle |
| @unhead/vue | ^2.0.0 | Head management | Manages `<title>`, meta, OG tags, canonical URLs reactively per-route |

### Testing Stack (Installed — Confirmed Correct)

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| Vitest | ^4.1.0 | Test runner | Native Vite integration means same transform pipeline as the app; no separate Babel/Jest config |
| @vitest/browser-playwright | ^4.1.0 | Browser mode provider | Vitest 4 requires a separate provider package; Playwright is the most capable option |
| vitest-browser-vue | ^2.1.0 | Vue component rendering in browser mode | Official Vitest package for rendering Vue components in real browser (not JSDOM) |
| @vitest/coverage-v8 | ^4.1.0 | Coverage reporting | V8-native coverage; more accurate than istanbul for ESM projects |
| Playwright | ^1.58.2 | Browser automation | Required by @vitest/browser-playwright; provides real Chromium for component tests |

**Note on vitest-browser-vue:** This package is NOT currently in package.json. It is the official Vitest-maintained package for rendering Vue components in browser mode. Install it: `npm install -D vitest-browser-vue`. Version 2.1.0 requires Vitest 4.0.0+, which is already installed.

### Component Documentation Stack (Installed — Confirmed Correct)

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| Storybook | ^10.2.19 | Component workshop | ESM-only in v10 (29% smaller install); stories serve as living documentation and portfolio artifact |
| @storybook/vue3-vite | ^10.2.19 | Vue 3 + Vite framework adapter | Shares Vite config with the app; no separate build tool configuration |
| @storybook/addon-vitest | ^10.2.19 | Story-to-test bridge | Transforms stories into Vitest component tests; stories and tests colocated |
| @storybook/addon-a11y | ^10.2.19 | Accessibility audit in Storybook | Runs axe-core against each story; catches ARIA issues without a separate audit tool |
| @storybook/addon-docs | ^10.2.19 | MDX-based documentation | Auto-generates component API docs from TypeScript types and JSDoc |
| @chromatic-com/storybook | ^5.0.1 | Visual regression (future) | Chromatic integration for automated visual diffing if connected to CI later |

### Supporting Libraries (Not Yet Installed — Evaluate as Needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/vue | ^8.1.0 | User-centric component testing | If you want Testing Library's `userEvent` / `getByRole` API on top of Vue Test Utils; add only if the vitest-browser-vue API proves insufficient |
| @vue/test-utils | ^2.x | Low-level component mounting | Already a transitive dependency of @testing-library/vue; use directly only for testing component internals that user-centric tests can't reach |

---

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| vue-tsc 2 | TypeScript type-checking for `.vue` files | Runs as part of `npm run build`; catches type errors in templates |
| Vite path aliases | `@` → `./src/*` | Already configured; use everywhere to avoid `../../..` relative imports |
| @vitejs/plugin-vue | SFC compilation | Single-file component support in Vite |

---

## Installation

The core stack is already installed. The one gap to fill:

```bash
# vitest-browser-vue — needed for component tests in browser mode
npm install -D vitest-browser-vue
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| vitest-browser-vue | @testing-library/vue | If your team already knows Testing Library API well and doesn't want to learn new render utilities |
| vitest-browser-vue (browser mode) | jsdom/happy-dom simulation | Never for component tests — simulation misses real browser layout/event behavior; fine only for pure composable/logic tests |
| @storybook/addon-vitest | Storybook test-runner (@storybook/test-runner) | If you're on Webpack (not Vite) or on Storybook 8; test-runner is deprecated in favor of addon-vitest for Vite projects |
| Playwright (via @vitest/browser-playwright) | WebdriverIO | If your org already has a WebdriverIO investment; Playwright is simpler to set up for greenfield projects |
| @storybook/vue3-vite | @storybook/vue3-webpack5 | Never for this project — Webpack adds a second build system; Vite-native is the only sensible choice |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Jest | Requires separate transform config for ESM/Vue SFCs; Vitest shares the Vite pipeline and is dramatically faster | Vitest |
| jsdom / happy-dom for component tests | DOM simulation misses real layout, real events, and real browser APIs; leads to false-positive passing tests | Vitest browser mode with vitest-browser-vue |
| Pinia | No global state in a static portfolio site; overkill that adds conceptual overhead for zero benefit | Vue 3 `provide/inject` or component props for any shared state |
| Nuxt | SSR/SSG is out of scope per PROJECT.md; SPA with Vite is faster to build and adequate for a portfolio | Vite + Vue Router (already in place) |
| Vue Options API | Legacy pattern; Composition API + `<script setup>` is the current standard, more readable, better TypeScript inference | `<script setup lang="ts">` |
| CSS-in-JS (tailwind, UnoCSS, etc.) | The project has a 3500-line CSS design token system; a utility framework would conflict with it and introduce duplication | Existing CSS custom properties system |
| @storybook/addon-interactions separately | Merged into @storybook/addon-vitest in Storybook 10; installing both causes conflicts | @storybook/addon-vitest (already installed) |

---

## Stack Patterns by Variant

**For component tests (rendering, interaction):**
- Use vitest-browser-vue + Vitest browser mode
- Run in Playwright Chromium
- Stories with play functions double as tests via @storybook/addon-vitest

**For composable/logic tests (no DOM needed):**
- Use Vitest directly with no browser mode
- Pure function tests — no mounting, no render

**For accessibility testing:**
- Primary: @storybook/addon-a11y (axe-core, runs in Storybook per story)
- Secondary: Vitest browser mode `toBeAccessible` assertion if spot-checking in CI

**For visual regression (future scope):**
- @chromatic-com/storybook is already installed; connect to Chromatic service if visual diffs are needed
- Alternatively, Vitest 4's `toMatchScreenshot` for self-hosted visual regression

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| vitest ^4.1.0 | vitest-browser-vue ^2.1.0 | vitest-browser-vue 2.x requires Vitest 4.0.0+ |
| vitest ^4.1.0 | @storybook/addon-vitest ^10.2.19 | Storybook 10 adds explicit Vitest 4 support |
| @vitest/browser-playwright ^4.1.0 | playwright ^1.58.2 | Must match major version of Vitest |
| storybook ^10.2.19 | @storybook/vue3-vite ^10.2.19 | All Storybook packages must be same major.minor |
| vite ^6.2.0 | @vitejs/plugin-vue ^5.2.0 | plugin-vue 5.x targets Vite 5+; compatible with Vite 6 |

---

## Sources

- [Storybook 10 release blog](https://storybook.js.org/blog/storybook-10/) — ESM-only, Vitest 4 support, Vue 3 portable stories — HIGH confidence
- [Vitest 4.0 announcement](https://vitest.dev/blog/vitest-4) — Browser mode stable, provider packages, visual regression — HIGH confidence
- [vitest-browser-vue npm/GitHub](https://github.com/vitest-community/vitest-browser-vue) — v2.1.0 requires Vitest 4+, official Vitest package — HIGH confidence
- [Vitest browser mode docs](https://vitest.dev/guide/browser/) — Recommended approach over JSDOM for component tests — HIGH confidence
- [Storybook Vitest addon docs](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon/index) — Story-to-test bridge, Vite-only — HIGH confidence
- [@testing-library/vue npm](https://www.npmjs.com/package/@testing-library/vue) — v8.1.0 current, last published 2 years ago — MEDIUM confidence (less actively maintained than vitest-browser-vue)
- [Vue.js official testing guide](https://vuejs.org/guide/scaling-up/testing) — Vitest + Testing Library as recommended stack — HIGH confidence

---

*Stack research for: Vue 3 portfolio SPA — component architecture + testing tooling*
*Researched: 2026-03-16*
