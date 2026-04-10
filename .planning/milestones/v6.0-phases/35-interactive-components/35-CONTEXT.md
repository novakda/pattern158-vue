# Phase 35: Interactive Components - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Build FaqAccordionItem.vue and FaqFilterBar.vue components with full WAI-ARIA accessibility, keyboard support, and scoped CSS using design tokens. These are leaf components — FaqPage integration happens in Phase 36. Delete old FaqItem.vue.

</domain>

<decisions>
## Implementation Decisions

### Component Architecture
- Two new components: FaqAccordionItem.vue (replaces FaqItem.vue) and FaqFilterBar.vue
- FaqAccordionItem receives: item (FaqItem), isOpen (boolean) props; emits toggle event
- FaqFilterBar receives: categories (FaqCategory[]), activeFilter (string | null), counts (Record<string, number>) props; emits filter-change event
- Accordion state: `ref<Set<string>>` in FaqPage tracking open item IDs — passed down as isOpen prop
- Filter state: `ref<string | null>` in FaqPage — null means "all", string is active category ID
- Old FaqItem.vue deleted after new components are verified working

### Accordion Behavior
- Click anywhere on question row toggles open/closed
- Multiple items can be open simultaneously (multi-open, no coordination)
- Closed state: question text + category pills + "+" icon on right
- Open state: answer revealed below question, icon rotates 45° to form "×"
- Category pills always visible in both open and closed states
- No animations/transitions (deferred per PROJECT.md out-of-scope)

### Accessibility (WAI-ARIA)
- `<h3>` containing `<button>` with `aria-expanded` and `aria-controls` attributes
- `aria-controls` references answer container ID (derived from item.id)
- Button receives keyboard focus; Enter/Space toggles
- Focus-visible styling for keyboard navigation

### Icon Implementation
- CSS pseudo-element (`::after`) on the button
- "+" rendered via `content: '+'` with design token sizing
- `.is-open` class triggers `transform: rotate(45deg)` to form "×"
- Same technique as existing NavBar hamburger icon

### Filter Bar
- "All" pill button + one pill per category from faqCategories
- One active filter at a time (radio behavior)
- Active pill visually distinct (filled background vs outline)
- Reuse existing `.impact-tag` pill CSS pattern with `.active` modifier
- Live count label below filter bar: "N questions" — updates on filter change
- Count per pill derived from filtered faqItems

### Styling
- Scoped CSS in both components using existing design tokens (--color-*, --space-*, etc.)
- Audit and override any conflicting global `.page-faq` rules from main.css
- Category pills rendered as small monospace text below question
- Full-width layout, no card wrapper

### Claude's Discretion
- Exact CSS property values for pill styling, icon sizing, spacing
- Whether to extract ExhibitCallout as a sub-component or inline it in FaqAccordionItem
- Test structure and coverage strategy

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/faq.ts` — FaqItem (id, question, answer, categories[], exhibitNote?, exhibitUrl?)
- `src/data/faq.ts` — faqCategories array, faqItems (24 items)
- `.impact-tag` CSS class in main.css — existing pill/badge styling
- NavBar hamburger icon — CSS transform rotate pattern reference

### Established Patterns
- Props-down / events-up component communication
- `<script setup>` with defineProps/defineEmits
- Design token consumption via var(--token-name)
- Scoped CSS with `:deep()` only when needed

### Integration Points
- FaqPage.vue will import these components (Phase 36)
- FaqItem.stories.ts will need updating for new component

</code_context>

<specifics>
## Specific Ideas

- The user's original design spec: "Clicking anywhere on the row toggles it open or closed"
- "The closed state shows only the question text and a + icon on the right"
- "The open state reveals the answer below the question and rotates the icon 45 degrees to form an ×"
- "Category tags render as small monospace pills below the question text and are always visible regardless of open/closed state"
- "A row of pill buttons at the top — one 'all' button plus one button per unique category"
- "A small live count below the filter row reads 'N questions' and updates on every filter change"

</specifics>

<deferred>
## Deferred Ideas

- Smooth CSS transition on accordion open/close (ANIM-01 in future requirements)
- Exhibit callout rendering inside answers (Phase 36 LYOT-01)

</deferred>
