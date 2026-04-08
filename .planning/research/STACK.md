# Stack Research: FAQ Page Redesign (v6.0)

**Domain:** Interactive FAQ with accordion, filter pills, exhibit cross-reference callouts
**Researched:** 2026-04-08
**Confidence:** HIGH

## Recommendation: Zero New Dependencies

Every feature in v6.0 is achievable with native Vue 3 reactivity + the existing CSS design token system. Adding a UI library for an accordion and filter pills would be architectural overreach for a 15-question FAQ on a portfolio site.

## Existing Stack (No Changes)

| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| Vue 3 | ^3.5.0 | Composition API, `ref`, `computed`, `v-model` | Already installed |
| TypeScript | ~5.7.0 | Type safety for FAQ data structures | Already installed |
| Vite | ^6.2.0 | Build tooling | Already installed |
| Vitest | ^4.1.0 | Unit tests | Already installed |
| Storybook 10 | ^10.2.19 | Component stories | Already installed |

## Feature-by-Feature Stack Decisions

### 1. Accordion Behavior

**Use:** Native Vue reactivity (`ref<Set<string>>`) + CSS transitions

**Why not a library:**
- The site already uses native `<details>/<summary>` on TechnologiesPage for collapsible sections. The existing CSS handles the disclosure triangle rotation with `transform: rotate(90deg)` on `details[open]`.
- However, `<details>` does not support animated open/close natively. The v6.0 spec calls for animated +/x icon transitions, which requires JS-controlled expand/collapse.
- A `ref<Set<string>>` holding open question IDs gives multi-open behavior with O(1) toggle. This is 3 lines of reactive state -- no library warranted.

**Implementation pattern:**
```typescript
const openItems = ref<Set<string>>(new Set())
const toggle = (id: string) => {
  const next = new Set(openItems.value)
  next.has(id) ? next.delete(id) : next.add(id)
  openItems.value = next
}
```

**Important note on Vue Set reactivity:** Vue 3's reactivity system (as of 3.5) does not deeply track `Set.add()` / `Set.delete()` mutations on a `ref<Set>`. You must replace the entire Set reference for the template to re-render. The pattern above creates a new `Set` on each toggle, which triggers reactivity correctly. Alternatively, use a `ref<string[]>` and toggle with array methods, but `Set` with replacement is cleaner for O(1) membership checks via `.has()` in the template.

**CSS transition for expand/collapse:**
- Use `grid-template-rows: 0fr` / `1fr` transition with `overflow: hidden` on the inner wrapper. This is the modern approach (supported in all evergreen browsers) and avoids the `max-height` hack which requires guessing a maximum value.
- The codebase already uses `transition: all 0.3s` extensively (NavBar, buttons, cards). Match that timing.
- The +/x icon rotation uses `transform: rotate(45deg)` on the open state -- identical to the hamburger pattern already in NavBar (`transform: translateY(-50%) rotate(45deg)`).

**Why not `<details>/<summary>`:**
- Cannot animate open/close height transitions (browser limitation)
- Cannot programmatically control which items are open for filter resets
- The TechnologiesPage uses `<details>` for a simple show/hide -- appropriate there, but insufficient for the interactive accordion spec

### 2. Category Filter Pills with Live Count

**Use:** Native `ref<FaqCategoryId | null>` + `computed` for filtered list and counts

**Why not a library:**
- Single-select filter with "All" default is a `ref` holding `null | categoryId`.
- Live counts are a `computed` that runs `.filter().length` on 15 items. No performance concern.
- The codebase already has pill/badge CSS patterns: `.impact-tag` (pill shape with border-radius), `.badge-deep/.badge-working/.badge-aware` (colored badges), `.finding-category` (inline category labels). Filter pills should follow the `.impact-tag` pattern with an `.active` modifier.

**Implementation pattern:**
```typescript
const activeFilter = ref<FaqCategoryId | null>(null)

const filteredItems = computed(() =>
  activeFilter.value
    ? faqItems.filter(i =>
        i.category === activeFilter.value ||
        i.categories?.includes(activeFilter.value!)
      )
    : faqItems
)

// Pre-compute counts (static data, runs once)
const categoryCounts = computed(() =>
  Object.fromEntries(
    faqCategories.map(c => [
      c.id,
      faqItems.filter(i =>
        i.category === c.id || i.categories?.includes(c.id)
      ).length
    ])
  ) as Record<FaqCategoryId, number>
)
```

**Existing CSS precedent:**
- `.impact-tag` provides the pill shape (`border-radius`, `padding`, `font-size`)
- `.impact-tag.highlight` provides the active/selected state with `background: var(--color-primary)`
- Filter pills should use this same token system, adding `cursor: pointer` and the existing `transition: background-color 0.2s` pattern

### 3. Exhibit Cross-Reference Callout Blocks

**Use:** CSS-only styled `<aside>` with left-border accent

**Why not a component library:**
- The codebase already has left-border accent styling on blockquotes: `border-left: 3px solid var(--color-primary)` used consistently on PhilosophyPage, ExhibitCard, and exhibit detail pages. This is a well-established visual pattern.
- Callout blocks are purely presentational -- a CSS class on an `<aside>` element.
- Data comes from an optional `exhibitNote` field on `FaqItem` (new field in the JSON schema).

**CSS pattern:**
```css
.exhibit-callout {
    border-left: 3px solid var(--color-accent);
    background: var(--color-surface, var(--color-background));
    padding: var(--space-sm) var(--space-md);
    margin-top: var(--space-sm);
    font-size: var(--font-size-sm);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
```

Uses `--color-accent` (teal) to distinguish from blockquote citations which use `--color-primary`. This follows the existing badge convention: primary = investigation reports, accent/teal = engineering briefs. The callout references case files (which are the accent-colored engineering brief territory), making teal the correct semantic choice.

### 4. Full-Width Stacked Layout with HR Separators

**Use:** CSS-only layout changes to existing `.faq-item` / `.faq-category` classes

**No stack implications.** Replace the current category-grouped sections with a flat list. `<hr>` elements between items, styled with existing `--color-border` token.

## Data Structure Changes

### FaqItem Type Extension

```typescript
export interface FaqItem {
  id: string                    // NEW: stable identifier for Set tracking
  question: string
  answer: string
  category: FaqCategoryId
  categories?: FaqCategoryId[]  // NEW: multi-tag support (optional, backward-compat)
  exhibitNote?: string          // NEW: optional cross-reference callout text
  exhibitSlug?: string          // NEW: optional link target for callout
}
```

**Why `id` field:** The accordion `Set<string>` needs stable keys. Currently `question` is used as `:key` -- fragile if questions are edited. Add a short stable `id` (e.g., `"availability"`, `"legacy-systems"`).

**Why `categories` array:** PROJECT.md says "multi-tag categories". Keep `category` as primary for backward compat; add optional `categories` array for items that span multiple categories. Filter logic: match if `categories?.includes(filter) || category === filter`.

## New Components

| Component | Purpose | Complexity |
|-----------|---------|------------|
| `FaqAccordionItem.vue` | Replaces `FaqItem.vue` -- adds toggle button, expand/collapse, callout rendering | Medium |
| `FaqFilterBar.vue` | Category pill buttons with counts, "All" option | Low |

**Note:** The existing `FaqItem.vue` is 15 lines with no scoped styles. It will be replaced, not wrapped. The new `FaqAccordionItem` is a clean replacement.

## Accessibility Considerations (No Library Needed)

The accordion needs these ARIA attributes, all achievable with native Vue binding:

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `aria-expanded="true/false"` | Toggle button | Announces open/closed state |
| `aria-controls="panel-{id}"` | Toggle button | Links button to content panel |
| `id="panel-{id}"` | Content panel | Target for `aria-controls` |
| `role="region"` | Content panel | Identifies expandable region |

This is straightforward Vue template binding (`:aria-expanded="openItems.has(item.id)"`). Headless UI libraries exist to automate this, but for a single accordion component the manual approach is clearer and adds zero dependencies.

## Alternatives Considered

| Feature | Recommended | Alternative | Why Not Alternative |
|---------|-------------|-------------|---------------------|
| Accordion state | Native `ref<Set>` + CSS | Headless UI / Radix Vue | 50KB+ for 15 FAQ items is absurd overkill; ARIA needs are 4 attributes |
| Accordion element | JS-controlled `div` | `<details>/<summary>` | Cannot animate transitions; cannot programmatically reset on filter change |
| Filter state | Native `ref` + `computed` | Vue filter library / Pinia | Single-select on 4 categories -- a `ref` is the entire state management |
| Callout blocks | CSS `<aside>` | Vue component with slots | Pure presentation, no logic -- a CSS class is sufficient |
| Height transition | CSS `grid-template-rows` | CSS `max-height` | `max-height` requires an arbitrary large value; `grid-template-rows: 0fr/1fr` is clean and precise |
| Height transition | CSS `grid-template-rows` | Vue `<Transition>` | `<Transition>` is for enter/leave of DOM elements. Accordion content stays in DOM, just collapses. CSS is the right tool. |
| +/x icon | CSS pseudo-element + `transform` | Icon library (Lucide, Heroicons) | The indicator is a single character with rotation. The hamburger menu already does this exact pattern with CSS transforms. |

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|---------------------|
| Headless UI / Radix Vue | Adds runtime dependency for a disclosure pattern on 15 items. This is a portfolio site demonstrating Vue skills -- building it natively IS the portfolio artifact. | Native `ref` + `aria-expanded` |
| Pinia / state management | FAQ filter state is local to FaqPage. No cross-component sharing needed. | Component-local `ref` + `computed` |
| VueUse `useToggle` / `useSet` | Utility composable for a 3-line toggle adds indirection without reducing complexity. | Inline `ref<Set<string>>` with replacement pattern |
| Animation libraries (GSAP, Motion) | Out of scope per PROJECT.md: "Animations/transitions -- defer to a future pass". CSS transitions for accordion open/close are functional UI feedback, not decorative animation. | CSS `transition` on `grid-template-rows` and `transform` |
| Icon font / icon library | The +/x indicator is a CSS pseudo-element with `transform: rotate(45deg)` -- identical to the existing hamburger pattern. | CSS `::before` with `content: '+'` and transform |
| `vue-collapsed` / `vue-accordion` | Small utility libraries that wrap what amounts to 10 lines of Vue code. Adds a dependency to maintain for negligible value. | Native implementation |

## Integration Points with Existing System

| Existing Pattern | How v6.0 Uses It |
|------------------|------------------|
| Design tokens (`--color-*`, `--space-*`, `--font-size-*`) | All new CSS uses existing tokens. No new custom properties needed. |
| `.impact-tag` pill CSS | Filter pills extend this pattern with interactive states (`.active` modifier) |
| `blockquote` left-border accent (`3px solid var(--color-primary)`) | Callout blocks use same visual technique with `--color-accent` instead |
| NavBar hamburger `transform: rotate(45deg)` | Accordion +/x icon uses identical CSS transform technique |
| `transition: all 0.3s` site-wide timing | Accordion expand/collapse and icon rotation match this timing |
| `src/types/faq.ts` type definitions | Extended with `id`, `categories`, `exhibitNote`, `exhibitSlug` fields |
| `src/data/json/faq.json` data | Extended with new fields per updated type |
| `src/data/faq.ts` thin loader | Unchanged -- `as FaqItem[]` assertion handles new optional fields transparently |
| Vitest unit tests | New tests for toggle logic, filter computed, category counts |
| Storybook stories | New stories for FaqAccordionItem (open/closed/with-callout) and FaqFilterBar (with/without active filter) |

## Installation

```bash
# No new packages required.
# All features use existing Vue 3 + TypeScript + CSS capabilities.
```

## Version Compatibility

No new packages means no compatibility concerns. All features use Vue 3.5+ Composition API features (`ref`, `computed`, `defineProps`, `defineEmits`) and standard CSS properties that are stable across all evergreen browsers.

| Feature | Browser Support | Notes |
|---------|----------------|-------|
| CSS `grid-template-rows` transition | Chrome 117+, Firefox 66+, Safari 16+ | Modern approach; all evergreen browsers supported |
| CSS `transform: rotate()` | Universal | Used throughout existing codebase |
| `Set` in JavaScript | ES2015+ | Universal in all target browsers |
| `aria-expanded` / `aria-controls` | All screen readers | Standard WAI-ARIA attributes |

## Sources

- **Existing codebase analysis** (HIGH confidence) -- all recommendations verified against actual project files:
  - `package.json` -- current dependency versions (zero additions needed)
  - `src/components/FaqItem.vue` -- current FAQ component (15 lines, static, no interactivity)
  - `src/pages/FaqPage.vue` -- current page structure with category grouping
  - `src/pages/TechnologiesPage.vue` -- existing `<details>/<summary>` disclosure pattern with CSS rotation
  - `src/types/faq.ts` -- current FaqItem/FaqCategory types (extension points identified)
  - `src/data/faq.ts` -- current loader with `as const satisfies` category pattern
  - `src/assets/css/main.css` -- design tokens, `.impact-tag` pills, blockquote accents, hamburger transforms, transition timing patterns
- **Vue 3 Composition API** (HIGH confidence) -- `ref`, `computed`, reactive Set replacement are stable core features
- **CSS `grid-template-rows` transition** (HIGH confidence) -- supported in all evergreen browsers since late 2023; well-documented technique for height animation without `max-height` hacks

---
*Stack research for: FAQ Page Redesign (v6.0)*
*Researched: 2026-04-08*
