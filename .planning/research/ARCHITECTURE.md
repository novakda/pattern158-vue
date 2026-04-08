# Architecture Research: FAQ Page Redesign (v6.0)

**Domain:** Vue 3 interactive component integration into existing data/type/component architecture
**Researched:** 2026-04-08
**Confidence:** HIGH -- derived from direct analysis of all existing FAQ files, established project patterns, and v6.0 milestone spec

## System Overview

### Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Page Layer                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ FaqPage.vue                                         │    │
│  │   Iterates faqCategories, filters faqItems per cat  │    │
│  │   Renders <section> per category + <FaqItem> list   │    │
│  └──────────┬──────────────────────────────────────────┘    │
│             │ props: question, answer                       │
│  ┌──────────▼──────────────────────────────────────────┐    │
│  │ FaqItem.vue                                         │    │
│  │   Stateless render: h3 question + split-paragraph   │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                              │
│  ┌──────────────┐    ┌───────────────────┐                  │
│  │ faq.ts       │───>│ json/faq.json     │                  │
│  │ (thin loader)│    │ (14 items)        │                  │
│  └──────────────┘    └───────────────────┘                  │
│  faqCategories: as const in faq.ts (not in JSON)            │
├─────────────────────────────────────────────────────────────┤
│                     Type Layer                              │
│  ┌──────────────┐    ┌───────────────────┐                  │
│  │ types/faq.ts │    │ types/index.ts    │                  │
│  │ FaqItem      │───>│ barrel export     │                  │
│  │ FaqCategory  │    └───────────────────┘                  │
│  │ FaqCategoryId│                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

**Current data flow:** FaqPage iterates `faqCategories` as the outer loop, rendering a `<section>` per category. Inside each section, it filters `faqItems` with `i.category === cat.id` and renders a `<FaqItem>` per match. FaqItem is a 15-line stateless component that takes `question` and `answer` as individual string props and renders an h3 + paragraph-split answer.

### Target Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Page Layer                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ FaqPage.vue                                         │    │
│  │   Owns: activeFilter ref, filteredItems computed    │    │
│  │   Renders: <FaqFilterBar> + <FaqAccordionItem> list │    │
│  └───────┬─────────────────────────┬───────────────────┘    │
│          │                         │                        │
│  ┌───────▼──────────┐    ┌────────▼────────────────────┐   │
│  │ FaqFilterBar.vue  │    │ FaqAccordionItem.vue        │   │
│  │ (NEW)             │    │ (REPLACES FaqItem.vue)      │   │
│  │ emit: filter      │    │ Props: item (full FaqItem)  │   │
│  │ Props: categories,│    │ Local: isOpen ref           │   │
│  │   activeFilter,   │    │ Renders: toggle header,     │   │
│  │   counts          │    │   answer body,              │   │
│  └───────────────────┘    │   optional ExhibitCallout   │   │
│                           └────────────────────────────────┘│
│                           ┌────────────────────────────────┐│
│                           │ ExhibitCallout.vue (NEW)       ││
│                           │ Props: exhibitNote string      ││
│                           │ Renders: accent-bordered block ││
│                           └────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                              │
│  ┌──────────────┐    ┌───────────────────┐                  │
│  │ faq.ts       │───>│ json/faq.json     │                  │
│  │ (thin loader)│    │ (expanded items)  │                  │
│  └──────────────┘    └───────────────────┘                  │
│  faqCategories: extended if new IDs added, still as const   │
├─────────────────────────────────────────────────────────────┤
│                     Type Layer                              │
│  ┌──────────────┐                                           │
│  │ types/faq.ts │ FaqItem.category --> categories: array   │
│  │              │ FaqItem.exhibitNote --> optional string   │
│  │              │ FaqCategoryId --> expanded union if needed│
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Status | Communicates With |
|-----------|----------------|--------|-------------------|
| **FaqPage.vue** | Filter state, filtered list computation, layout, SEO | MODIFIED (rewrite) | FaqFilterBar, FaqAccordionItem, data layer |
| **FaqAccordionItem.vue** | Accordion toggle, question/answer render, exhibit callout | NEW (replaces FaqItem) | ExhibitCallout (child) |
| **FaqFilterBar.vue** | Category pill buttons, "All" default, live count display | NEW | FaqPage (via emit) |
| **ExhibitCallout.vue** | Accent-bordered callout block for exhibit cross-references | NEW | None (leaf component) |
| **FaqItem.vue** | Deprecated after migration | DELETE | N/A |

## Integration Points with Existing Architecture

### 1. Type Layer -- `src/types/faq.ts`

**Current:**
```typescript
export interface FaqItem {
  question: string
  answer: string
  category: FaqCategoryId  // single string
}

export interface FaqCategory {
  id: 'hiring' | 'expertise' | 'style' | 'process'
  heading: string
  intro: string
}

export type FaqCategoryId = FaqCategory['id']
```

**Target:**
```typescript
export interface FaqCategory {
  id: 'hiring' | 'expertise' | 'style' | 'process' // extend union if career-vault adds categories
  heading: string
  intro: string
}

export type FaqCategoryId = FaqCategory['id']

export interface FaqItem {
  question: string
  answer: string
  categories: FaqCategoryId[]  // CHANGED: single string --> array
  exhibitNote?: string         // ADDED: optional cross-reference text
}
```

**Migration impact:** The `category` to `categories` rename is a breaking change. Every reference to `item.category` must become `item.categories`. Since `FaqItem` is only consumed by `FaqPage.vue` and `FaqItem.vue` (which is being replaced), the blast radius is exactly two files -- both being rewritten in this milestone.

**Key decision: Clean rename, not additive.** Do not add `categories` alongside `category`. Keeping both creates ambiguity about which is authoritative. The old field has zero surviving consumers after the page rewrite.

### 2. Data Layer -- `src/data/faq.ts` + `src/data/json/faq.json`

**faq.json migration:**
```json
// BEFORE
{ "category": "hiring", "question": "...", "answer": "..." }

// AFTER
{ "categories": ["hiring"], "question": "...", "answer": "..." }

// Items with exhibit cross-references:
{ "categories": ["expertise", "process"], "question": "...", "answer": "...",
  "exhibitNote": "See Exhibit B for a detailed case study of this approach." }
```

All 14 items need `category` renamed to `categories` array. Most will be single-element arrays initially. Items referencing case files in their answers are candidates for `exhibitNote`.

**faq.ts thin loader -- no structural change:**
```typescript
import type { FaqItem, FaqCategory } from '@/types'
import faqItemsData from './json/faq.json'

export type { FaqItem, FaqCategory }
export const faqItems: FaqItem[] = faqItemsData as FaqItem[]
```

The loader pattern stays identical -- only the imported type shape changes. The `as FaqItem[]` assertion bridges JSON's inability to enforce the `FaqCategoryId` literal union, same as today.

**`faqCategories` stays in TypeScript** (established v3.0 decision). JSON cannot express `as const` literal types. The categories array is structural metadata (4 items, rarely changes), not content data. If new category IDs are added for career-vault content, update three places:
1. `FaqCategory['id']` union in `types/faq.ts`
2. `faqCategories` array in `data/faq.ts`
3. Items in `json/faq.json`

### 3. Component Layer -- Replace vs Extend Decision

**Recommendation: Replace FaqItem.vue with new FaqAccordionItem.vue.**

Rationale:
- FaqItem.vue is 15 lines with zero state, no slots, and only two string props. There is nothing to extend.
- The accordion component needs: local `isOpen` ref, click handler, toggle icon, conditional body rendering, optional `exhibitNote` rendering. This is a fundamentally different component.
- Renaming makes the component self-documenting (project philosophy: components name concepts, per COMP-01).
- The old FaqItem.vue has exactly one consumer (FaqPage.vue), which is being rewritten. Zero risk of breaking other pages.
- Storybook story for FaqItem.vue should be replaced, not preserved.

**Delete FaqItem.vue** and its story after FaqAccordionItem.vue is working. Do not leave dead code.

### 4. Page Layer -- FaqPage.vue Rewrite

**Current layout:** Category-grouped sections (outer loop over `faqCategories`, inner filter per category). Renders h2 category headings + intro paragraphs above each group.

**Target layout:** Flat filtered list with filter bar.

```
FaqPage.vue
├── HeroMinimal (unchanged)
├── FaqFilterBar (NEW)
│   props: categories, activeFilter, counts
│   emit: update:filter
├── <FaqAccordionItem v-for="item in filteredItems"> (NEW)
│   props: item (full FaqItem object)
├── <hr> separators between items
└── TestimonialQuote section (unchanged)
```

**State ownership in FaqPage.vue:**
```typescript
const activeFilter = ref<FaqCategoryId | 'all'>('all')

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return faqItems
  return faqItems.filter(item =>
    item.categories.includes(activeFilter.value as FaqCategoryId)
  )
})

const categoryCounts = computed(() => {
  const counts: Record<string, number> = { all: faqItems.length }
  for (const cat of faqCategories) {
    counts[cat.id] = faqItems.filter(item =>
      item.categories.includes(cat.id)
    ).length
  }
  return counts
})
```

**Layout change:** The grouped-by-category sections go away. Category headings/intros no longer render as section headers. The filter bar replaces that navigation pattern. This is a simplification -- one flat list with one level of filtering, not nested sections.

**Testimonial section at bottom is unchanged.** It is independent of FAQ data/component changes.

## Data Flow

### Filter Flow

```
User clicks category pill
    |
FaqFilterBar emits update:filter(categoryId | 'all')
    |
FaqPage.vue sets activeFilter ref
    |
filteredItems computed re-evaluates (reactive dependency)
    |
v-for re-renders visible FaqAccordionItem list
    |
categoryCounts computed updates pill counts (reactive)
```

### Accordion State Flow

```
User clicks accordion header
    |
FaqAccordionItem toggles local isOpen ref
    |
Answer body shows/hides (v-show preferred for DOM persistence)
    |
Icon state changes (+/x)
```

Accordion state is **local to each item**. No page-level tracking needed because multi-open is supported (no "only one open at a time" constraint). This is the simplest correct approach. If single-open behavior is ever needed later, lift state to the page -- but the spec explicitly says multi-open.

### Multi-Category Filter Logic

With `categories` as an array, an item tagged `["expertise", "process"]` appears under both filters. The filter uses `Array.includes()`. This means per-category counts may sum to more than the total item count. The "All" pill shows the true total. This is standard UX for multi-tag systems.

## Architectural Patterns

### Pattern 1: Thin Loader with Type Assertion (Existing)

**What:** JSON data imported through a TypeScript file that asserts the type, re-exports both data and types.
**Status:** Established in v3.0, unchanged. The loader shape is identical; only the imported type changes.

### Pattern 2: Props-Down, Events-Up for Filter State

**What:** FaqPage owns filter state, passes it down to FaqFilterBar as props, receives changes via emit.
**Why:** Single source of truth for filter state. FaqFilterBar is a controlled component. The filter state must affect the sibling item list, so it cannot live inside the filter bar.
**Implementation:**
```vue
<!-- FaqFilterBar.vue -->
<script setup lang="ts">
defineProps<{
  categories: readonly FaqCategory[]
  activeFilter: FaqCategoryId | 'all'
  counts: Record<string, number>
}>()

const emit = defineEmits<{
  'update:filter': [value: FaqCategoryId | 'all']
}>()
</script>
```

### Pattern 3: Full Object Prop (Not Destructured Props)

**What:** Pass the entire `FaqItem` object to `FaqAccordionItem` rather than individual props.
**Why:** FaqItem has 3-4 fields. Passing individually is verbose and fragile -- adding a field means updating both page template and component props. A single `item` prop keeps the interface stable.
**Example:**
```vue
<!-- Preferred -->
<FaqAccordionItem v-for="item in filteredItems" :key="item.question" :item="item" />

<!-- Not this -->
<FaqAccordionItem :question="item.question" :answer="item.answer"
  :categories="item.categories" :exhibit-note="item.exhibitNote" />
```

### Pattern 4: Component Extraction for Concept Naming (Existing)

**What:** ExhibitCallout is extracted as a component even though initially used only inside FaqAccordionItem.
**Why:** Project philosophy -- components name concepts (COMP-01). "ExhibitCallout" is a recognizable concept (accent-bordered cross-reference block) that makes the accordion template scannable.
**Caveat:** If the callout turns out to be just a styled `<div>` with one line of text and no rendering logic, inline it. Extract only if it has its own concern (e.g., parsing exhibit slugs into links, distinct accessibility semantics).

## Anti-Patterns to Avoid

### Anti-Pattern 1: Shared Accordion State Store

**What people do:** Create a Pinia store or provide/inject to track which accordion items are open.
**Why it's wrong:** With multi-open support, there is no cross-item state to coordinate. A store adds complexity for zero benefit.
**Do this instead:** Each FaqAccordionItem owns a local `ref<boolean>` for its open state.

### Anti-Pattern 2: Keeping Both `category` and `categories`

**What people do:** Add `categories` array while keeping `category` string for backward compatibility.
**Why it's wrong:** The old field has exactly one consumer (FaqPage.vue) which is being rewritten in the same milestone. Keeping both creates ambiguity and requires sync logic.
**Do this instead:** Clean rename in one pass. Update type, JSON, and page together.

### Anti-Pattern 3: Category Sections with Filter Overlay

**What people do:** Keep the current grouped-by-category sections and add filter behavior on top, hiding/showing entire sections.
**Why it's wrong:** Multi-category items would need to appear in multiple sections (duplicated DOM). The filter bar becomes redundant with the section headings.
**Do this instead:** Flat list with filter bar. One rendering of each item, filter controls visibility.

### Anti-Pattern 4: Extending FaqItem Instead of Replacing

**What people do:** Add accordion behavior to the existing FaqItem component with optional props and conditional rendering.
**Why it's wrong:** FaqItem is a 15-line stateless renderer. Adding state, click handlers, icons, and conditional sections turns it into a different component wearing the old name. The name "FaqItem" no longer describes what it does.
**Do this instead:** New component, new name, delete the old one.

### Anti-Pattern 5: v-if for Accordion Body

**What people do:** Use `v-if="isOpen"` to conditionally render the answer body.
**Why it's wrong for this case:** With 14 items, DOM creation cost is negligible. `v-if` destroys and recreates DOM on every toggle, losing scroll position and adding layout shift.
**Do this instead:** Use `v-show="isOpen"` to toggle visibility. DOM is created once and stays. Only matters if items have non-trivial content; with text paragraphs, either works, but `v-show` is the safer default for accordion patterns.

## Suggested Build Order

Based on dependency analysis, build bottom-up:

| Order | Task | Depends On | Rationale |
|-------|------|------------|-----------|
| 1 | Update `types/faq.ts` | Nothing | Types are the foundation. Everything downstream depends on correct types. |
| 2 | Migrate `json/faq.json` + update `data/faq.ts` | Step 1 | Data must match new types. Validate with `npm run type-check`. |
| 3 | Build `ExhibitCallout.vue` | Nothing | Leaf component, zero dependencies. Can parallel with steps 4-5. |
| 4 | Build `FaqAccordionItem.vue` | Steps 1, 3 | Needs FaqItem type. Uses ExhibitCallout if exhibitNote present. |
| 5 | Build `FaqFilterBar.vue` | Step 1 | Needs FaqCategoryId type. Can be built with mock categories/counts. |
| 6 | Rewrite `FaqPage.vue` | Steps 2, 4, 5 | Integrates all new components with real data. |
| 7 | Delete `FaqItem.vue` + old story | Step 6 | Only after new page is working and verified. |
| 8 | Add Storybook stories | Steps 3-6 | Stories for FaqAccordionItem, FaqFilterBar, ExhibitCallout. |

**Steps 3, 4, and 5 can be partially parallelized** since they are independent leaf components. Steps 4 and 5 need the type from step 1 but not the data from step 2.

## File Changes Summary

| File | Action | Details |
|------|--------|---------|
| `src/types/faq.ts` | MODIFY | `category` to `categories: FaqCategoryId[]`, add `exhibitNote?: string` |
| `src/types/index.ts` | NO CHANGE | Already exports FaqItem, FaqCategory, FaqCategoryId |
| `src/data/json/faq.json` | MODIFY | `category` string to `categories` array, add `exhibitNote` where applicable |
| `src/data/faq.ts` | MINOR MODIFY | Update `faqCategories` if new category IDs added; loader shape unchanged |
| `src/components/FaqItem.vue` | DELETE | Replaced by FaqAccordionItem |
| `src/components/FaqAccordionItem.vue` | CREATE | Accordion item with toggle, answer body, optional ExhibitCallout |
| `src/components/FaqFilterBar.vue` | CREATE | Category pills with active state and live counts |
| `src/components/ExhibitCallout.vue` | CREATE | Accent-bordered cross-reference block |
| `src/pages/FaqPage.vue` | REWRITE | New filter state, flat list layout, new component imports |

**Blast radius:** 5 modified/deleted files, 3 new files. All changes are within the FAQ feature boundary. Zero impact on any other page, component, or data file.

## Sources

- Direct code analysis: `src/types/faq.ts`, `src/data/faq.ts`, `src/data/json/faq.json`, `src/components/FaqItem.vue`, `src/pages/FaqPage.vue`
- Established project patterns: `src/data/exhibits.ts` (thin loader), `src/types/index.ts` (barrel exports)
- PROJECT.md v6.0 milestone specification, key decisions log, and architectural constraints

---
*Architecture research for: FAQ Page Redesign (v6.0)*
*Researched: 2026-04-08*
