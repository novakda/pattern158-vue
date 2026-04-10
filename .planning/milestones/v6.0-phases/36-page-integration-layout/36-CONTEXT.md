# Phase 36: Page Integration & Layout - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite FaqPage.vue to use FaqAccordionItem and FaqFilterBar components. Add exhibit callout rendering. Apply full-width stacked layout with border rules. Delete old FaqItem.vue and clean up global CSS. Update Storybook stories.

</domain>

<decisions>
## Implementation Decisions

### FaqPage Rewrite
- Replace grouped-by-category sections with flat filtered list
- Import FaqAccordionItem, FaqFilterBar, and data from @/data/faq
- Accordion state: `ref<Set<string>>` tracking open item IDs
- Filter state: `ref<string | null>` — null = "all"
- Computed: filtered items based on active filter (categories.includes)
- Computed: category counts for filter bar pills
- Keep HeroMinimal header and TestimonialQuote section
- Keep useSeo and useBodyClass composables

### Exhibit Callout (per user spec)
- Two optional fields: exhibitNote (display text) and exhibitUrl (path)
- If only exhibitNote: static left-bordered callout with → prefix, accent color
- If both exhibitNote and exhibitUrl: same callout as `<a>` tag linking to exhibit page
- Visually identical whether linked or not — only difference is navigability
- Link styling: inherit accent text color, no underline default, underline on hover
- Renders inside the open answer area of FaqAccordionItem

### Layout
- Full-width stacked layout, no card wrapper
- border-top rules between items
- border-bottom on last item
- Question text, filter pills, count label, answer prose all left-aligned

### Cleanup
- Delete src/components/FaqItem.vue (replaced by FaqAccordionItem)
- Delete src/components/FaqItem.stories.ts
- Audit global .page-faq CSS in main.css — remove or scope conflicting rules
- Update FaqPage.stories.ts for new component structure

### Claude's Discretion
- Whether to render exhibit callout inline in FaqAccordionItem or as extracted component
- Exact CSS values for callout border, spacing, colors
- How to structure FaqPage.stories.ts updates

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/components/FaqAccordionItem.vue (Phase 35 — accordion with ARIA)
- src/components/FaqFilterBar.vue (Phase 35 — filter pills with counts)
- src/pages/FaqPage.vue (current page to rewrite)
- src/components/HeroMinimal.vue (keep for page header)
- src/components/TestimonialQuote.vue (keep for testimonial section)

### Established Patterns
- ref + computed for reactive state (Vue 3 Composition API)
- Scoped CSS using design tokens
- Design token variables: --color-accent, --color-border, --space-*, --font-mono

### Integration Points
- FaqAccordionItem props: item (FaqItem), isOpen (boolean), emits: toggle
- FaqFilterBar props: categories, activeFilter, counts; emits: filter-change
- Router: /faq route already configured
- Global .page-faq CSS class applied via useBodyClass

</code_context>

<specifics>
## Specific Ideas

- User spec: "Items are stacked vertically with border-top rules between them and a border-bottom on the last item"
- User spec: "The question text, filter pills, count label, and answer prose are all left-aligned"
- Callout spec: "left-bordered callout block in an accent color, visually distinct from the answer prose"
- Callout spec: "→ prefix retained as part of the visible text"
- Callout spec: "Style the link to inherit the callout's accent text color with no underline by default, underline on hover"

</specifics>

<deferred>
## Deferred Ideas

None — this is the final phase.

</deferred>
