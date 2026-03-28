# Stack Research

**Domain:** Vue 3 SPA — Dual Exhibit Templates and IA Restructure (v2.0)
**Researched:** 2026-03-27
**Confidence:** HIGH (zero new dependencies; all patterns use Vue 3.5 / Vue Router 4.6 features already installed)

---

## Context

The core stack (Vue 3.5.30, TypeScript 5.7, Vite 6, Vue Router 4.6.4, Storybook 10, Vitest 4) is established and validated in v1.0/v1.1. This research answers a narrower question: **what Vue patterns and (if any) new packages are needed to support dual exhibit templates, a unified listing page with type-based card rendering, and navigation restructure?**

The answer: **no new packages**. Everything required is achievable with Vue's built-in component system and the existing router. The work is architectural (component design, data model extension, route changes), not tooling.

---

## Recommended Stack

### Core Technologies (Established -- No Changes)

| Technology | Installed Version | Purpose | v2.0 Impact |
|------------|-------------------|---------|-------------|
| Vue 3 | 3.5.30 | UI framework | `defineAsyncComponent`, `<component :is>`, computed filtering -- all built-in |
| TypeScript | 5.7.x | Type safety | Discriminated union types for exhibit type branching |
| Vite 6 | 6.2.x | Build tool | No config changes needed |
| Vue Router 4 | 4.6.4 | Routing | Route additions/removals, alias support for redirects |
| @unhead/vue | 2.x | Head management | No changes -- `useHead(computed(...))` pattern already works for dynamic exhibit titles |

### New Packages Required

**None.** Zero new dependencies for v2.0.

### Supporting Libraries (Already Installed -- No Changes)

All testing and documentation tooling from v1.0/v1.1 carries forward unchanged. See v1.1 STACK.md research for details on Vitest, Storybook, Playwright.

---

## Vue Patterns for v2.0 Features

### Pattern 1: Discriminated Union Type for Exhibit Classification

The `Exhibit` interface currently has `investigationReport?: boolean`. For v2.0, extend the data model with a required `exhibitType` discriminator field.

**Why a string literal union, not a boolean:** The current `investigationReport?: boolean` creates three states (true, false, undefined) with unclear semantics. A required `'investigation-report' | 'engineering-brief'` field is self-documenting, enables TypeScript narrowing, and extends cleanly if a third type ever appears.

```typescript
// Extend the Exhibit interface
export type ExhibitType = 'investigation-report' | 'engineering-brief'

export interface Exhibit {
  // ... existing fields ...
  exhibitType: ExhibitType  // Required, replaces investigationReport?: boolean
  investigationReport?: boolean  // Keep temporarily for backward compat, derive from exhibitType
}
```

**Confidence:** HIGH -- standard TypeScript pattern, no library involvement.

### Pattern 2: Conditional Detail Template via Dynamic Component

Two approaches exist for rendering different detail page layouts per exhibit type. Use `<component :is>` with a computed component map.

**Why `<component :is>` over `v-if`/`v-else`:** With two exhibit types, `v-if`/`v-else` inside a single ExhibitDetailPage.vue is viable but creates a monolithic template. Separate template components via `<component :is>` keep each layout focused, testable in isolation, and independently story-able in Storybook.

```typescript
// In ExhibitDetailPage.vue
import { defineAsyncComponent, computed } from 'vue'

const templateMap = {
  'investigation-report': defineAsyncComponent(
    () => import('@/components/InvestigationReportLayout.vue')
  ),
  'engineering-brief': defineAsyncComponent(
    () => import('@/components/EngineeringBriefLayout.vue')
  ),
} as const

const activeTemplate = computed(() =>
  exhibit.value ? templateMap[exhibit.value.exhibitType] : null
)
```

```html
<component :is="activeTemplate" v-if="activeTemplate" :exhibit="exhibit" />
```

**Why `defineAsyncComponent`:** Each layout is only loaded when needed. For 15 exhibits this is a minor optimization, but it establishes the right pattern and keeps initial bundle lean. Vue 3.5's `defineAsyncComponent` handles loading/error states if needed.

**Confidence:** HIGH -- `<component :is>` is a core Vue feature documented in the official guide.

### Pattern 3: Type-Based Card Rendering on Listing Page

The unified Case Files page needs different card styles for investigation reports vs. engineering briefs. Two viable approaches:

**Recommended: Single ExhibitCard with type-driven CSS class + conditional slots**

```html
<!-- CaseFilesPage.vue -->
<ExhibitCard
  v-for="exhibit in exhibits"
  :key="exhibit.exhibitLink"
  :exhibit="exhibit"
/>
```

```html
<!-- ExhibitCard.vue -- extend existing component -->
<div :class="['exhibit-card', `exhibit-card--${exhibit.exhibitType}`]">
  <!-- Shared header markup -->
  <template v-if="exhibit.exhibitType === 'investigation-report'">
    <!-- Investigation-specific card content -->
  </template>
  <template v-else>
    <!-- Engineering brief card content -->
  </template>
</div>
```

**Why a single card component, not two:** The card-level differences are cosmetic (badge, CTA text, accent color, possibly a summary field). The structure (header, tags, link) is shared. Two separate card components would duplicate 70%+ of the template markup. A single component with type-driven CSS modifier class (`.exhibit-card--investigation-report`, `.exhibit-card--engineering-brief`) leverages the existing CSS design token system via cascade layers.

**Alternative considered: Two card components via `<component :is>`** -- Use if the two card layouts diverge significantly (different DOM structure, not just styling). Premature to split now; refactor later if needed.

**Confidence:** HIGH -- this is how the existing ExhibitCard already works (it has `exhibit.isDetailExhibit ? 'detail-exhibit' : ''`).

### Pattern 4: Computed Filtering for Listing Page Sections

If the Case Files page groups exhibits by type (e.g., "Investigation Reports" section then "Engineering Briefs" section):

```typescript
const investigationReports = computed(() =>
  exhibits.filter(e => e.exhibitType === 'investigation-report')
)
const engineeringBriefs = computed(() =>
  exhibits.filter(e => e.exhibitType === 'engineering-brief')
)
```

**Why computed over methods or reactive state:** The exhibit data is static (imported from `data/exhibits.ts`). Computed properties cache the filtered arrays and only recalculate if the source changes (which it won't at runtime). This is the idiomatic Vue pattern for derived data.

**Confidence:** HIGH -- fundamental Vue reactivity.

### Pattern 5: Router Changes for IA Restructure

Current routes that change:

| Current | v2.0 | Rationale |
|---------|------|-----------|
| `/portfolio` | `/case-files` (or similar) | Unified listing page replaces Portfolio |
| `/review` | Remove | Placeholder page with no content |
| `/exhibits/:slug` | Keep as-is | Slug-based detail routing is correct; both exhibit types share the route |

**Redirect for backward compatibility:**

```typescript
// In router.ts
{ path: '/portfolio', redirect: '/case-files' },
```

Vue Router 4.6 supports `redirect` as a string, object, or function. A simple string redirect is sufficient here. This ensures any bookmarked `/portfolio` URLs still work.

**Do NOT use named routes for the redirect** -- the current router uses anonymous routes (no `name` property). Adding names just for redirects adds ceremony with no benefit.

**New route:**

```typescript
{ path: '/case-files', component: () => import('./pages/CaseFilesPage.vue') },
```

**Confidence:** HIGH -- Vue Router redirect is documented core functionality.

---

## What NOT to Add

| Avoid | Why | What to Do Instead |
|-------|-----|---------------------|
| Pinia / Vuex | Exhibit data is static imports, not global state. No async fetching, no mutations, no cross-component state sharing needed | Import `exhibits` array directly where needed |
| `vue-router` route guards for exhibit type | The exhibit type is data-driven, not route-driven. Both types share `/exhibits/:slug` | Resolve type from exhibit data in the detail page component |
| Separate routes per exhibit type (`/reports/:slug`, `/briefs/:slug`) | Creates URL coupling to classification. If an exhibit gets reclassified, its URL changes and breaks bookmarks | Single `/exhibits/:slug` route with type resolved from data |
| Dynamic `<component :is>` for cards | Premature abstraction. Card differences are styling + minor content, not structural. A single component with CSS modifiers is simpler | Single ExhibitCard with `.exhibit-card--{type}` class |
| renderless components / slots-only pattern for templates | Over-engineered for two templates. Direct `<component :is>` with two concrete components is clearer | Concrete InvestigationReportLayout.vue and EngineeringBriefLayout.vue |
| New CSS methodology (BEM, CSS Modules, scoped styles) | Project uses cascade layers + custom properties system. Introducing a second system creates confusion | Follow existing CSS conventions with new `.exhibit-card--{type}` modifiers |
| `provide/inject` for exhibit data | Exhibit data flows parent-to-child through one level of props. provide/inject is for deep injection (3+ levels) | Direct props |

---

## Data Model Changes (No Package Impact)

The `Exhibit` interface in `src/data/exhibits.ts` needs these additions:

| Field | Type | Purpose |
|-------|------|---------|
| `exhibitType` | `'investigation-report' \| 'engineering-brief'` | Required discriminator replacing `investigationReport?: boolean` |
| `summary` | `string` (optional) | Short description for card rendering on listing page; currently cards show quotes which may not suit engineering briefs |

The existing `investigationReport?: boolean` can be derived: `investigationReport: exhibitType === 'investigation-report'` during a transition period, then removed.

---

## Version Compatibility

No new packages means no new compatibility concerns. Existing compatibility matrix from v1.1 research remains valid:

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Vue 3.5.30 | Vue Router 4.6.4 | `<component :is>` with `defineAsyncComponent` stable since Vue 3.0 |
| Vue Router 4.6.4 | Vite 6 | Lazy routes via `() => import()` is Vite-native |
| TypeScript 5.7 | Discriminated unions | Feature available since TypeScript 2.0; fully mature |

---

## Installation

```bash
# No new packages required for v2.0
# All patterns use Vue 3 built-in features
```

---

## Stack Patterns by Variant

**For the detail page (two layout templates):**
- Use `<component :is>` with `defineAsyncComponent` in ExhibitDetailPage.vue
- Create InvestigationReportLayout.vue and EngineeringBriefLayout.vue as layout components
- Both receive the full `Exhibit` object as a prop
- Each layout is independently testable and story-able

**For the listing page (mixed card types):**
- Use single ExhibitCard.vue with CSS modifier class per exhibit type
- Use computed properties for filtering/grouping by type
- Consider splitting into two components only if card DOM structure diverges significantly

**For navigation restructure:**
- Add new `/case-files` route, remove `/review` route
- Add `/portfolio` -> `/case-files` redirect for backward compatibility
- Update NavBar links and HomePage CTAs

**For testing the new patterns:**
- Test each layout component in isolation (unit test + Storybook story)
- Test ExhibitDetailPage template resolution with different exhibit types
- Test ExhibitCard rendering for both types
- Test router redirects in router.test.ts

---

## Sources

- Vue 3 Dynamic Components documentation (vuejs.org/guide/essentials/component-basics#dynamic-components) -- `<component :is>` pattern -- HIGH confidence
- Vue 3 Async Components documentation (vuejs.org/guide/components/async) -- `defineAsyncComponent` -- HIGH confidence
- Vue Router Redirect and Alias documentation (router.vuejs.org/guide/essentials/redirect-and-alias) -- route redirects -- HIGH confidence
- TypeScript Discriminated Unions (typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) -- type narrowing pattern -- HIGH confidence
- Existing codebase analysis: `src/data/exhibits.ts`, `src/pages/ExhibitDetailPage.vue`, `src/components/ExhibitCard.vue`, `src/router.ts` -- direct inspection -- HIGH confidence

---

*Stack research for: Vue 3 portfolio SPA -- dual exhibit templates and IA restructure (v2.0)*
*Researched: 2026-03-27*
