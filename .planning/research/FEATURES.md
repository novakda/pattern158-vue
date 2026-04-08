# Feature Research

**Domain:** Interactive FAQ page with accordion, category filtering, and exhibit cross-references
**Researched:** 2026-04-08
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist on any interactive FAQ page. Missing these = feels broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Click-to-toggle accordion | Users expect to expand/collapse individual answers; all-visible is a wall of text | LOW | Replace static `FaqItem.vue` with button-driven toggle. Button + `aria-expanded` + `aria-controls` is the standard accessible pattern. Avoid `<details>`/`<summary>` — limited styling control and inconsistent animation support. |
| Visual expand/collapse indicator | Users need affordance showing items are interactive; +/x or chevron rotation is universal | LOW | +/x icon matches PROJECT.md spec. CSS-only swap on `.is-open` class. Use existing design token sizing. |
| Multi-open support | Users expect to compare answers side by side. Single-open (only one at a time) feels hostile on desktop. | LOW | Simpler than single-open — each item manages its own boolean, no coordination needed. |
| Category section headings preserved | Existing page has named sections with intros. Removing them degrades scannability. | LOW | Already exist in `faqCategories`. Keep `<h2>` + intro text per category section. |
| Keyboard accessibility | Tab to question, Enter/Space to toggle, focus visible states | LOW | Native with `<button>` trigger. Must not use `<div @click>` — existing codebase uses ARIA correctly elsewhere (NavBar). |
| Responsive layout | Full-width stacked layout that works mobile through desktop | LOW | Existing `.faq-category` already constrained to 800px max-width. Stacked layout is the natural accordion shape. |
| Horizontal rule separators between items | Visual separation between FAQ entries in a full-width stacked layout | LOW | `border-bottom` on each item or `<hr>` between items. Use existing `--color-border` token. |

### Differentiators (Competitive Advantage)

Features that elevate this FAQ page from generic to portfolio-grade showcase.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Category filter bar with pill buttons | Lets users drill into a category (hiring, expertise, style, process) without scrolling. Live question count shows content density per category. Demonstrates Vue reactivity and component design. | MEDIUM | Pill buttons map 1:1 to existing `faqCategories` array. "All" pseudo-category shows everything. One active filter at a time (radio behavior, not multi-select). `computed` filters `faqItems` by selected category. Count badge on each pill = `faqItems.filter(i => i.category === cat.id).length`. |
| Exhibit cross-reference callout blocks | Connects FAQ answers to case file evidence. Portfolio-specific — shows the site's content is interconnected, not siloed. Demonstrates attention to information architecture. | MEDIUM | New optional `exhibitNote` field on `FaqItem` type. Renders as a styled aside/callout block with left-border accent (matching existing exhibit detail border accent pattern). Only renders when `exhibitNote` is present. Not a link to exhibit — just a textual reference with visual distinction. |
| Live question count on filter pills | Shows users how many questions exist per category before they filter. Micro-detail that signals polish. | LOW | Derived from data — `faqItems.filter(i => i.category === id).length` rendered in pill. Updates if items are filtered. |
| Smooth open/close transition | CSS transition on max-height or grid-template-rows for answer reveal. Avoids jarring jump. | LOW | `grid-template-rows: 0fr` to `1fr` transition is the modern approach (no max-height hack). Wrap answer in container with `overflow: hidden`. BUT — PROJECT.md lists "Animations/transitions" as out of scope. Implement with CSS class toggle only; defer animation to future pass. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this specific context.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Search/filter text input | "Let users search questions" | 14 questions across 4 categories. Search adds UI complexity, empty-state handling, and debounce logic for zero benefit at this scale. PROJECT.md explicitly lists this as out of scope. | Category filter pills handle navigation. At 14 items, scanning is faster than typing. |
| Single-open accordion (auto-close others) | "Clean look, one answer visible" | Frustrating on desktop — users want to compare Q4 and Q6 side by side. Forces re-opening previously read answers. Mobile might benefit, but consistency across breakpoints matters more. | Multi-open (each item independent). Users control their own reading flow. |
| Deep linking to individual questions | "Share link to specific answer" | Adds URL hash management, scroll-into-view logic, and auto-expand-on-load behavior. Over-engineered for 14 questions on a portfolio site. No external consumers are linking to individual FAQ answers. | Category filter state in URL query param (if needed at all — probably not for 14 items). |
| Expand All / Collapse All buttons | "Power user convenience" | Adds two more buttons to the UI. At 14 items, "expand all" creates the same wall-of-text problem the accordion solves. "Collapse all" is just page reload. | Not needed. Multi-open gives users granular control. |
| Animated icons (spinning chevrons, morphing plus-to-minus) | "Feels polished" | PROJECT.md explicitly defers animations/transitions. CSS transitions add complexity for a v6.0 launch. | Static icon swap (+/x) via CSS class toggle. Class `.is-open` swaps icon. Revisit animation in a future pass. |
| Tag-based multi-category filtering | "Some questions span categories" | Multi-tag filtering adds complexity (AND vs OR logic, multi-select UI, clear-all state). 14 items across 4 categories does not need faceted search. PROJECT.md mentions multi-tag categories in target features, but the data currently has single-category assignment and that is sufficient. | Keep single category per item. If a question genuinely spans categories, pick the primary one. The user can always view "All". |
| Accordion state persistence (localStorage) | "Remember which items were open" | FAQ is not a dashboard. Users visit, read, leave. Persisting open/closed state adds localStorage management for zero user value. | Reset to all-collapsed on page load. |

## Feature Dependencies

```
[Category filter bar]
    └──requires──> [FAQ data with category field]  (ALREADY EXISTS in FaqItem.category)
                       └──requires──> [faqCategories array]  (ALREADY EXISTS in src/data/faq.ts)

[Exhibit callout blocks]
    └──requires──> [Extended FaqItem type with optional exhibitNote field]
                       └──requires──> [faq.json schema update]

[Accordion toggle]
    └──requires──> [Refactored FaqItem.vue with button trigger + open state]
                       └──independent (no data dependency)

[Live question count]
    └──requires──> [Category filter bar]  (count renders inside pills)

[Horizontal rule separators]
    └──independent (CSS only)
```

### Dependency Notes

- **Category filter bar requires existing data:** No data migration needed. `FaqItem.category` and `faqCategories` already exist with the exact shape needed. Filter is pure view logic.
- **Exhibit callout blocks require type extension:** `FaqItem` interface needs optional `exhibitNote: string` field. JSON entries that reference exhibits get the field; others omit it. Backward-compatible — no existing consumers break.
- **Accordion is independent of filtering:** Toggle state is per-component instance. Filtering changes which items render, but each rendered item manages its own open/closed state independently.
- **Live question count enhances filter bar:** Count is derived data (`computed`), not stored. Makes sense to build as part of the filter bar, not separately.

## MVP Definition

### Launch With (v6.0)

Minimum set to replace the static FAQ page with an interactive one.

- [ ] Accordion FaqItem with button trigger, `aria-expanded`, open/closed state — core interaction
- [ ] +/x icon indicator on each item — visual affordance for interactivity
- [ ] Multi-open behavior (each item independent) — user-controlled reading flow
- [ ] Category filter bar with pill buttons — primary navigation enhancement
- [ ] "All" default filter showing all questions — safe default, no empty state
- [ ] Live question count on pills — low cost, high polish signal
- [ ] Horizontal rule separators between items — visual structure for stacked layout
- [ ] Extended `FaqItem` type with optional `exhibitNote` — data schema for callouts
- [ ] Exhibit callout block rendering — accent-styled aside when `exhibitNote` present

### Add After Validation (v6.x)

Features to add once the interactive page is live and reviewed.

- [ ] CSS open/close transition (grid-template-rows) — once animations/transitions are in scope
- [ ] URL query param for active category filter — if Dan wants shareable filtered views
- [ ] Career-vault FAQ content merged — depends on content review and approval

### Future Consideration (v7+)

- [ ] Expand All / Collapse All — only if FAQ grows past ~25 questions
- [ ] Search input — only if FAQ grows past ~40 questions
- [ ] Deep linking to individual questions — only if external sites need to link to specific answers

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Accordion toggle | HIGH | LOW | P1 |
| +/x icon indicator | HIGH | LOW | P1 |
| Multi-open behavior | HIGH | LOW | P1 |
| Category filter bar | HIGH | MEDIUM | P1 |
| "All" default filter | HIGH | LOW | P1 |
| Live question count | MEDIUM | LOW | P1 |
| Horizontal rule separators | MEDIUM | LOW | P1 |
| FaqItem type extension (exhibitNote) | MEDIUM | LOW | P1 |
| Exhibit callout blocks | MEDIUM | MEDIUM | P1 |
| CSS open/close transition | LOW | LOW | P2 |
| URL query param for filter | LOW | LOW | P3 |
| Career-vault content merge | MEDIUM | MEDIUM | P2 |

**Priority key:**
- P1: Must have for v6.0 launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Existing Data Structure (for dependency clarity)

Current `FaqItem` interface (from `src/types/faq.ts`):

```typescript
interface FaqItem {
  question: string
  answer: string
  category: FaqCategoryId  // 'hiring' | 'expertise' | 'style' | 'process'
}
```

Required extension for v6.0:

```typescript
interface FaqItem {
  question: string
  answer: string
  category: FaqCategoryId
  exhibitNote?: string  // NEW — optional cross-reference text for callout block
}
```

Current `faqCategories` (from `src/data/faq.ts`) — kept as `as const` in TypeScript (not JSON) for literal type narrowing:

```typescript
const faqCategories = [
  { id: 'hiring', heading: 'Hiring Logistics', intro: '...' },
  { id: 'expertise', heading: 'Technical Expertise', intro: '...' },
  { id: 'style', heading: 'Working Style', intro: '...' },
  { id: 'process', heading: 'Process & Methodology', intro: '...' },
]
```

No changes needed to `faqCategories` for v6.0. The filter bar consumes this array directly.

## Existing CSS Patterns to Reuse

| Pattern | Source | Reuse For |
|---------|--------|-----------|
| Pill/badge styling | `.expertise-badge`, impact tag pills | Category filter pill buttons |
| Left-border accent | `.exhibit-type-badge`, exhibit detail border accents | Exhibit callout block left border |
| Design tokens | `--color-border`, `--space-*`, `--font-size-*` | All new components |
| Max-width container | `.faq-category { max-width: 800px }` | Keep for accordion layout |
| Muted text color | `--color-text-muted` | Category intro, callout text |

## Accordion UX Behavior Specification

Standard accordion behavior patterns based on WAI-ARIA Authoring Practices.

### Interaction Model

| Action | Behavior |
|--------|----------|
| Click question button | Toggle that item's open/closed state |
| Enter/Space on focused question | Toggle that item's open/closed state |
| Tab | Move focus to next focusable element (next question button or page element) |
| Initial page load | All items collapsed |
| Filter change | Re-render visible items; all collapsed (filter = fresh context) |

### ARIA Requirements

| Element | Attribute | Value |
|---------|-----------|-------|
| Question button | `aria-expanded` | `true` when open, `false` when closed |
| Question button | `aria-controls` | ID of the answer panel |
| Answer panel | `id` | Matches `aria-controls` value |
| Answer panel | `role` | `region` (optional, adds landmark semantics) |
| Answer panel | `aria-labelledby` | ID of the question button (optional) |

### Filter Bar Interaction

| Action | Behavior |
|--------|----------|
| Click category pill | Set active filter; show only items in that category |
| Click "All" pill | Clear filter; show all items grouped by category |
| Active pill visual | Filled/highlighted state (distinguish from inactive pills) |
| Question counts | Update to reflect visible items per category |

## Sources

- Existing codebase analysis: `src/types/faq.ts`, `src/data/faq.ts`, `src/data/json/faq.json`, `src/components/FaqItem.vue`, `src/pages/FaqPage.vue`, `src/assets/css/main.css`
- PROJECT.md active requirements and out-of-scope boundaries
- WAI-ARIA Authoring Practices: Accordion pattern (button trigger, `aria-expanded`, `aria-controls`)
- Established web UX conventions for FAQ accordion pages

---
*Feature research for: Interactive FAQ page with accordion, category filtering, and exhibit cross-references*
*Researched: 2026-04-08*
