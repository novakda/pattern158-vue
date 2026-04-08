# Pitfalls Research

**Domain:** Interactive FAQ accordion + category filter on existing Vue 3 SPA portfolio site
**Researched:** 2026-04-08
**Confidence:** HIGH (based on direct codebase analysis, established Vue/a11y patterns)

## Critical Pitfalls

### Pitfall 1: Category Taxonomy Collision Between Two Content Sources

**What goes wrong:**
The existing 14 questions use 4 categories (`hiring`, `expertise`, `style`, `process`). The career vault's 13 questions use 6 completely different categories (`approach`, `architecture`, `legacy-systems`, `collaboration`, `accessibility`, `ai-tooling`). Naively merging creates 10 categories for ~27 questions -- averaging 2.7 questions per category, which makes filtering nearly useless. The filter bar becomes a wall of pills that fragments rather than organizes.

**Why it happens:**
The two sources were authored independently with different taxonomies. The existing site categories are visitor-oriented ("What can you do for me?") while the career vault categories are skill-oriented ("What are you good at?"). Neither taxonomy was designed for multi-tag use.

**How to avoid:**
Design the unified taxonomy BEFORE migrating content. Decide: are categories visitor-intent or skill-domain? Likely answer: a hybrid set of 5-7 categories that both sources map into cleanly, with multi-tag allowing items to live in multiple categories. Map every question from both sources to the new taxonomy in a spreadsheet/table before writing any code. The category design is a content decision, not a code decision.

**Warning signs:**
- More than 7 filter pills in the bar
- Any category with fewer than 3 questions
- Category names that overlap semantically (e.g., "process" vs. "approach")
- Filter bar wrapping to multiple lines on mobile

**Phase to address:**
Data schema design phase (first phase). Lock the taxonomy before touching components.

---

### Pitfall 2: Breaking the FaqCategoryId Type Union Without Updating All Consumers

**What goes wrong:**
`FaqCategoryId` is currently `'hiring' | 'expertise' | 'style' | 'process'` -- a narrow string literal union. Changing `FaqItem.category` from a single `FaqCategoryId` to `categories: string[]` silently breaks type safety. The inline filter in FaqPage.vue (`faqItems.filter(i => i.category === cat.id)`) will fail at compile time, but any test fixtures, Storybook args, or hardcoded references to the old category IDs will only fail at runtime or silently produce empty results.

**Why it happens:**
The `as const satisfies` pattern in `src/data/faq.ts` creates compile-time safety that disappears when JSON data is loaded with `as FaqItem[]` type assertion. Type assertions bypass checking -- if the JSON schema changes but the TypeScript interface doesn't match, no error is thrown. The assertion trusts the data.

**How to avoid:**
1. Update `FaqItem` interface in `src/types/faq.ts` first
2. Update `faqCategories` array in `src/data/faq.ts` with new category IDs
3. Let TypeScript compiler errors guide all downstream fixes (FaqPage.vue filter logic, Storybook stories)
4. Add a runtime validation check in the data loader that verifies every item's categories array contains only known category IDs
5. Update the barrel export in `src/types/index.ts` if any type names change

**Warning signs:**
- Filter buttons that show "0 questions" for any category
- TypeScript builds succeeding but questions not rendering
- Storybook stories showing empty states

**Phase to address:**
Data schema migration phase. TypeScript types change first, then JSON, then components.

---

### Pitfall 3: Accordion State Management Leaking Into Filter Logic

**What goes wrong:**
When a user has several FAQ items expanded, then applies a category filter, the question becomes: do expanded items stay expanded when they reappear after clearing the filter? If accordion state is tracked by array index, filtering reorders items and the wrong items appear expanded. If state is tracked by question text, items that were expanded before filtering reappear expanded -- which may or may not be desired. The most common bug: all items collapse on filter change, losing the user's place.

**Why it happens:**
Accordion open/close state and filter visibility are two independent concerns that interact. Developers often use a single reactive array (`openItems: Ref<number[]>`) indexed by position, which breaks when the displayed list changes.

**How to avoid:**
Track open state by a stable unique identifier (question slug or explicit ID field), not by array index. Use a `Set<string>` for open item IDs. When filter changes, the Set is unaffected -- items that were open remain open if they pass the new filter. Decide the UX policy explicitly: "filter changes do not collapse open items" or "filter changes reset all items to collapsed." Document the decision.

**Warning signs:**
- Using `v-for` index as the open/close key
- Accordion state stored as `boolean[]` instead of `Set<string>`
- No explicit test for "expand item, change filter, clear filter, item still expanded"

**Phase to address:**
Component implementation phase. Design the state model before building the accordion.

---

### Pitfall 4: Career Vault Content Contains Markdown That Won't Render

**What goes wrong:**
The existing `FaqItem.vue` splits answers on `\n\n` and renders each chunk as a plain `<p>` tag. The career vault content contains markdown blockquotes (`> *Exhibit J: GM Course Completion Investigation*`), em dashes, and italic markers (`*text*`) that will render as literal characters, not formatted text. The exhibit cross-reference callouts -- a key v6.0 feature -- will appear as raw markdown strings.

**Why it happens:**
The existing FAQ content was plain text by design. The career vault content was authored in Obsidian (markdown-native) and includes markdown formatting. The two sources have incompatible content formats.

**How to avoid:**
Choose ONE content format for the merged FAQ data:
- **Option A (recommended):** Keep plain text for answer bodies. Extract exhibit references into a structured `exhibitNote` field in the JSON schema. Render exhibit callouts as a separate styled component, not inline markdown.
- **Option B:** Add a lightweight markdown renderer (e.g., `marked` or `markdown-it`). But this adds a dependency for ~27 FAQ items, most of which are plain text.

Option A is better because it keeps the exhibit cross-references as structured data (queryable, styleable, testable) rather than embedded formatting. The career vault content needs to be stripped of markdown and have exhibit references extracted to the `exhibitNote` field during the content merge.

**Warning signs:**
- Asterisks or `>` symbols visible in rendered FAQ answers
- Exhibit references rendering as plain text instead of styled callout blocks
- Inconsistent formatting between old and new questions

**Phase to address:**
Data schema design phase (define `exhibitNote` field) AND content migration phase (transform career vault content).

---

### Pitfall 5: Accordion Accessibility -- Missing ARIA Pattern Implementation

**What goes wrong:**
A visually functional accordion that fails keyboard navigation and screen reader announcements. Common failures: no `aria-expanded` on the trigger, answer region not associated with its trigger via `aria-controls`/`id`, Enter and Space don't toggle, arrow keys don't navigate between items, focus doesn't move predictably. Screen readers announce nothing about collapsed/expanded state.

**Why it happens:**
The WAI-ARIA Accordion Pattern (APG) has specific requirements that go beyond `display: none`/`display: block` toggling. Developers build the visual behavior and skip the semantics. The existing `FaqItem.vue` is a static `<div>` with an `<h3>` -- zero interactive semantics. Converting it to an accordion requires adding a `<button>` inside the heading, ARIA attributes, and keyboard event handlers.

**How to avoid:**
Follow the WAI-ARIA Authoring Practices Guide (APG) Accordion Pattern exactly:
- Each item heading contains a `<button>` with `aria-expanded="true|false"`
- Each button has `aria-controls` pointing to the panel's `id`
- Each panel has `role="region"` and `aria-labelledby` pointing to the button's `id`
- Keyboard: Enter/Space toggles, optional Home/End for first/last item
- Focus management: tab moves between accordion headers (buttons), not into collapsed panels
- The `<h3>` wraps the `<button>`, not the other way around

Use native `<details>`/`<summary>` as an alternative -- it gets most of this for free from the browser. But `<details>` has limited animation support and inconsistent screen reader behavior across browsers, so the custom ARIA approach gives more control for a portfolio site demonstrating accessibility skills.

**Warning signs:**
- No `<button>` element inside accordion headers
- Missing `aria-expanded` attribute
- Answer panels reachable by Tab when collapsed
- No keyboard toggle on Enter/Space
- Screen reader announces heading but not expanded/collapsed state

**Phase to address:**
Component implementation phase. Build accessibility into the component from the start -- not as a remediation pass. Write accessibility tests first (test that `aria-expanded` toggles, test keyboard interaction).

---

### Pitfall 6: CSS Specificity Conflicts With Global Design System

**What goes wrong:**
The existing FAQ styles in `main.css` (lines 1482-1499) use `.page-faq .faq-category` selectors. New accordion styles added as scoped CSS in the component will have lower specificity than these global rules. The global styles set `margin`, `padding`, `font-size`, and `color` on `.faq-category h2` and `.category-intro`. If the page structure changes (e.g., removing category sections in favor of a flat accordion list), the global styles become dead CSS. If the structure stays similar, scoped component styles may not override global rules without `!important` or increased specificity.

**Why it happens:**
The codebase has a deliberate pattern: global CSS in `main.css` for page-level layout, with components being presentational. Accordion behavior adds interactive state that needs style changes (rotate icon, show/hide panel), which naturally belongs in the component. The two styling approaches collide.

**How to avoid:**
1. Audit existing `.page-faq` CSS rules in `main.css` before writing component styles
2. Decide which styles move to the component and which stay global
3. If the page layout changes significantly (removing category sections), remove the orphaned global styles in the same PR
4. For interactive states (expanded/collapsed), use scoped CSS in the component with class bindings (`:class="{ 'is-expanded': isOpen }"`)
5. For layout (max-width, margin, padding), keep in global CSS to maintain the design system pattern

**Warning signs:**
- Using `!important` in component scoped styles
- Accordion items rendering with wrong spacing or font sizes
- Dead CSS rules in `main.css` after the redesign
- Inconsistent spacing between FAQ items and other page sections

**Phase to address:**
Component implementation phase. Audit and plan CSS strategy before writing styles.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using array index as accordion item key | Quick implementation | Breaks when items are filtered, reordered, or added/removed | Never -- use stable IDs |
| Hardcoding category IDs in filter component | Fast filter bar | Any category change requires component code change | Never -- derive from data |
| Keeping old category sections AND new filter bar | Avoids reworking page structure | Two navigation paradigms confuse users, double the CSS surface | Never -- pick one approach |
| Skipping `exhibitNote` structured field, using inline markdown | Faster content migration | Exhibit callouts not independently styleable or testable | Never -- structured data is a v6.0 goal |
| Adding `marked`/`markdown-it` for 27 FAQ items | Handles career vault markdown natively | Runtime dependency for minimal use, inconsistent with plain-text pattern | Only if FAQ content will grow significantly and markdown is the authoring format going forward |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Career vault content merge | Copy-pasting markdown answers directly into JSON | Strip markdown formatting, extract exhibit references to `exhibitNote` field, convert to plain text with `\n\n` paragraph breaks |
| Storybook stories | Updating component but not stories, resulting in broken/stale stories | Update stories in the same phase as component changes; add stories for new states (expanded, collapsed, filtered, with exhibit note) |
| Existing unit tests | No FAQ tests exist currently (0 test files) -- adding accordion without tests | Write tests first for accordion toggle behavior, filter logic, and ARIA attributes before implementing |
| `faqCategories` `as const` pattern | Changing category IDs without updating the `as const satisfies` assertion | Update the satisfies type alongside the category array; TypeScript will flag mismatches |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| All items collapsed on page load | User sees only questions, must click to read anything -- high friction for first visit | Start with first item expanded, or provide an "Expand All" option |
| Filter resets scroll position | User clicks filter, jumps to top of page, loses context | Filter in place without scroll; if filtering reduces content significantly, smooth-scroll to the filter bar |
| No visual feedback on filter state | User doesn't know which filter is active, or that "All" is an option | Active filter pill has distinct styling; always show an "All" pill as the default state |
| Tiny click target on accordion toggle | Mobile users miss the toggle button, especially the +/x icon | Make the entire heading row clickable, not just the icon -- the heading `<button>` should span full width |
| Category count shows "0" | User sees a filter option with no results, feels like a bug | Hide categories with 0 matching items, or disable the pill with muted styling |
| No animation on expand/collapse | Accordion feels janky -- content appears/disappears instantly | Use CSS `max-height` transition or `grid-template-rows: 0fr/1fr` for smooth expand. But note: animations are listed as "out of scope" in PROJECT.md -- defer this |

## "Looks Done But Isn't" Checklist

- [ ] **Accordion toggle:** Tab key reaches every accordion button sequentially -- verify no items are skipped or trapped
- [ ] **Accordion ARIA:** `aria-expanded` is `"true"` when open AND `"false"` when closed (not just absent) -- verify with browser DevTools
- [ ] **Filter + accordion interaction:** Expand 3 items, filter to a category with 1 of those items, clear filter -- verify the 3 items are still expanded
- [ ] **Exhibit callout rendering:** Career vault questions with exhibit references render styled callout blocks, not plain text -- verify visually
- [ ] **Mobile filter bar:** 5+ category pills don't overflow or wrap awkwardly on 375px viewport -- verify in Storybook Mobile375 story
- [ ] **Dark theme:** Accordion icon (+/x), filter pill active state, and exhibit callout border all have appropriate dark theme colors -- verify in both themes
- [ ] **Empty state:** If a filter yields 0 results (shouldn't happen with good taxonomy, but edge case), the page shows a meaningful message, not blank space
- [ ] **Content merge completeness:** All 13 career vault questions are present in final JSON, no duplicates with existing 14 -- verify count matches expected total
- [ ] **Paragraph splitting:** Career vault answers with exhibit notes don't produce empty `<p>` tags from trailing `\n\n` -- verify DOM output
- [ ] **Storybook stories:** Stories exist for FaqItem (collapsed, expanded, with exhibitNote), FaqPage (no filter, filtered, mobile), and filter bar component

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Category taxonomy too fragmented | MEDIUM | Redesign taxonomy, update JSON data, update filter component -- no structural changes needed |
| Type union breaks at runtime | LOW | Fix TypeScript interface, let compiler guide fixes, re-run tests |
| Accordion state bugs with filtering | MEDIUM | Refactor state from index-based to ID-based; requires touching state management and tests |
| Markdown rendering in answers | LOW | Strip markdown from career vault content in JSON; add `exhibitNote` field if not already present |
| Accessibility failures | HIGH | Retrofitting ARIA onto a visual-only accordion requires restructuring the DOM (adding buttons inside headings, adding IDs/aria-controls); harder to add after than to build in |
| CSS specificity conflicts | LOW-MEDIUM | Audit and refactor global styles; may require touching `main.css` carefully to avoid breaking other pages sharing selectors |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Category taxonomy collision | Data schema design (Phase 1) | Every category has 3+ questions; total categories <= 7; no semantic overlaps |
| FaqCategoryId type break | Data schema migration (Phase 1) | TypeScript compiles cleanly; no `as any` or type assertions added to work around errors |
| Accordion state + filter interaction | Component implementation (Phase 2-3) | Unit test: expand, filter, clear filter, items still expanded |
| Markdown in career vault content | Content migration (Phase 1-2) | Visual inspection: no raw `*`, `>`, or markdown syntax visible in rendered answers |
| Accordion accessibility | Component implementation (Phase 2) | Unit tests for aria-expanded, keyboard toggle; manual screen reader test |
| CSS specificity conflicts | Component implementation (Phase 2) | No `!important` in new code; global `.page-faq` styles audited and cleaned |
| Storybook story breakage | Every phase with component changes | `npm run storybook` builds without errors; all FAQ stories render correctly |
| Content merge duplicates/gaps | Content migration (Phase 1-2) | Final question count = expected total; no duplicate questions; all categories populated |

## Sources

- Direct codebase analysis: `src/types/faq.ts`, `src/data/faq.ts`, `src/data/json/faq.json`, `src/components/FaqItem.vue`, `src/pages/FaqPage.vue`, `src/assets/css/main.css`
- Career vault content: `/home/xhiris/career-vault/job-search/interview-prep/website-faq-content.md`
- WAI-ARIA Authoring Practices Guide: Accordion Pattern (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- Project context: `.planning/PROJECT.md` (v6.0 requirements, out-of-scope constraints)

---
*Pitfalls research for: FAQ Page Redesign (v6.0) -- Vue 3 accordion + filter + content merge*
*Researched: 2026-04-08*
