# Phase 1: Foundation Fixes - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Clear known defects before adding more pages: fix nested `<main>` accessibility violations, add a 404 catch-all route with NotFoundPage, and install a complete test infrastructure. No new features, no content porting.

</domain>

<decisions>
## Implementation Decisions

### Nested `<main>` fix
- Remove the nested `<main>` wrapper entirely from TechnologiesPage, ContactPage, and HomePage — App.vue already provides `<main id="main-content">`
- Use Vue 3 fragments (multiple root nodes) — no replacement wrapper element needed
- Pages become bare templates with `<section>` siblings at the top level

### Claude's Discretion
- Whether to keep or drop page-level classes/ids from the old `<main>` wrappers — check if CSS targets them, keep only if needed
- NotFoundPage design (message tone, navigation links, visual style) — was not discussed; use a simple, clean approach consistent with the site's existing design system
- Exact vitest.config.ts settings and test script naming

### Test infrastructure
- Full test infra setup, not just package install: vitest.config.ts, test scripts in package.json
- Install both vitest-browser-vue (real browser component tests) AND happy-dom (fast unit tests for composables/utilities)
- Config should support both test environments
- Include one smoke test to verify the infra works end-to-end — no meaningful test coverage yet (that's Phase 2+)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Accessibility fix
- `.planning/codebase/CONCERNS.md` — Documents the nested `<main>` issue in TechnologiesPage and ContactPage, plus the missing 404 route
- `.planning/REQUIREMENTS.md` — A11Y-01 requirement for fixing nested `<main>`

### Existing patterns
- `.planning/codebase/CONVENTIONS.md` — Naming patterns, Vue conventions, import organization to follow
- `.planning/codebase/TESTING.md` — Recommended test setup approach, package list, config examples
- `.planning/codebase/ARCHITECTURE.md` — App.vue structure showing the existing `<main>` wrapper

### Router
- `src/router.ts` — Current route definitions (no catch-all exists)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `App.vue` already has `<main id="main-content" aria-label="Main content">` wrapping `<RouterView>` — pages should NOT duplicate this
- `src/composables/useSeo.ts` — Existing composable pattern to follow for any new composables
- CSS design token system in `src/assets/css/main.css` — NotFoundPage should use existing tokens

### Established Patterns
- All pages use `<script setup lang="ts">` exclusively
- Pages are PascalCase with `Page` suffix (e.g., `NotFoundPage.vue`)
- `@/` alias used for all imports
- PhilosophyPage is the only complete page — reference for structure

### Integration Points
- `src/router.ts` — catch-all route needs to be added here
- `package.json` — test scripts and devDependencies additions
- New `vitest.config.ts` at project root

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-fixes*
*Context gathered: 2026-03-16*
