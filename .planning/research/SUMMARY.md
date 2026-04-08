# Project Research Summary

**Project:** FAQ Page Redesign (v6.0)
**Domain:** Interactive FAQ accordion with category filtering on Vue 3 SPA portfolio site
**Researched:** 2026-04-08
**Confidence:** HIGH

## Executive Summary

The v6.0 FAQ page redesign transforms a static, category-grouped FAQ listing into an interactive accordion with category filter pills, live question counts, and exhibit cross-reference callout blocks. The existing codebase already contains every technology, design token, and CSS pattern needed. Zero new dependencies are required -- the entire feature set is achievable with Vue 3 Composition API reactivity (`ref`, `computed`), native ARIA attributes, and CSS transitions using established project patterns (pill badges, left-border accents, transform-based icon rotation).

The recommended approach is a bottom-up build: update TypeScript types and JSON data first (locking the category taxonomy), then build three new leaf components (`FaqAccordionItem`, `FaqFilterBar`, `ExhibitCallout`), and finally rewrite `FaqPage.vue` to integrate them as a flat filtered list replacing the current category-grouped sections. The existing `FaqItem.vue` (15 lines, stateless) is deleted -- not extended. The `category` string field becomes a `categories` array (breaking but zero-blast-radius rename since both consumers are rewritten in this milestone).

The primary risks are: (1) category taxonomy collision when merging career vault content (10 categories across 27 questions makes filtering useless -- design the unified taxonomy before writing code), (2) accessibility gaps if the accordion is built visually without WAI-ARIA semantics from day one (retrofitting ARIA is expensive), and (3) CSS specificity conflicts between global `.page-faq` styles in `main.css` and new scoped component styles. All three are preventable with upfront design decisions and the build order specified in the architecture research.

## Key Findings

### Recommended Stack

No new dependencies. The existing Vue 3.5 + TypeScript 5.7 + Vite 6 + Vitest 4 + Storybook 10 stack handles everything. The accordion is a `ref<Set<string>>` with Set-replacement reactivity (Vue 3 does not deeply track Set mutations -- must replace the reference). Filter state is a single `ref<FaqCategoryId | 'all'>` with `computed` for filtered items and category counts. The expand/collapse animation uses CSS `grid-template-rows: 0fr/1fr` transition (modern, no max-height hack), though animations may be deferred per PROJECT.md scope. The +/x icon uses CSS `transform: rotate(45deg)` -- identical to the existing NavBar hamburger pattern. See [STACK.md](STACK.md) for full analysis.

**Core technologies (all already installed):**
- **Vue 3 Composition API:** `ref`, `computed` for all interactive state -- no Pinia, no state library needed
- **TypeScript 5.7:** Extended `FaqItem` interface with `categories[]` array and optional `exhibitNote`
- **CSS design tokens:** All styling uses existing `--color-*`, `--space-*`, `--font-size-*` tokens; zero new custom properties
- **Vitest + Storybook:** Unit tests for toggle/filter logic; stories for all component states

### Expected Features

See [FEATURES.md](FEATURES.md) for the full inventory, dependency graph, and prioritization matrix.

**Must have (table stakes):**
- Click-to-toggle accordion with multi-open support (each item independent)
- Visual +/x expand/collapse indicator on each item
- Keyboard accessibility (Tab, Enter/Space on `<button>` triggers)
- Full ARIA implementation (`aria-expanded`, `aria-controls`, `role="region"`)
- Responsive full-width stacked layout with HR separators
- Category section headings preserved in filtered views

**Should have (differentiators):**
- Category filter bar with pill buttons (single-select, "All" default)
- Live question count badges on filter pills
- Exhibit cross-reference callout blocks (accent-bordered aside when `exhibitNote` present)

**Defer (v6.x / v7+):**
- CSS open/close animation (deferred per PROJECT.md animation scope)
- URL query param for active filter
- Search input (only if FAQ grows past 40 questions)
- Expand All / Collapse All (only if FAQ grows past 25 questions)
- Deep linking to individual questions

**Anti-features (explicitly rejected):**
- Single-open accordion (hostile UX -- users want to compare answers)
- Accordion state persistence in localStorage (FAQ is not a dashboard)
- Tag-based multi-select filtering (faceted search for 14 items is absurd)
- Markdown renderer dependency for plain-text FAQ content

### Architecture Approach

Replace-not-extend strategy. Three new components replace the single stateless `FaqItem.vue`. FaqPage owns filter state and passes it down via props-down/events-up. Accordion state is local to each item (no shared store needed for multi-open). The page layout shifts from nested category sections to a flat filtered list -- eliminating the duplicated-DOM problem that multi-category items would cause in grouped sections. Data flows through the established thin-loader pattern. See [ARCHITECTURE.md](ARCHITECTURE.md) for full component diagrams, data flow, and build order.

**Major components:**
1. **FaqPage.vue** (rewrite) -- owns `activeFilter` ref, `filteredItems` and `categoryCounts` computeds, renders filter bar + accordion list
2. **FaqAccordionItem.vue** (new, replaces FaqItem) -- local `isOpen` ref, button trigger with ARIA, answer body via `v-show`, optional ExhibitCallout child
3. **FaqFilterBar.vue** (new) -- controlled component receiving categories/activeFilter/counts as props, emits `update:filter`
4. **ExhibitCallout.vue** (new) -- leaf component, accent-bordered aside for exhibit cross-references

**Key architectural decisions:**
- `category` cleanly renamed to `categories[]` (not additive -- both consumers rewritten in this milestone)
- Accordion state tracked by stable `id` field, not array index or question text
- `v-show` preferred over `v-if` for accordion body (preserves DOM, avoids layout shift)
- Full object prop (`item`) passed to FaqAccordionItem, not destructured individual props

### Critical Pitfalls

See [PITFALLS.md](PITFALLS.md) for all 6 pitfalls with warning signs, phase mapping, and recovery strategies.

1. **Category taxonomy collision** -- Career vault uses 6 different categories from the site's 4. Merging naively creates 10 categories for 27 questions. Design a unified 5-7 category taxonomy mapped to both sources BEFORE writing any code.
2. **Accordion accessibility gaps** -- Build ARIA semantics from the start (`<button>` inside `<h3>`, `aria-expanded`, `aria-controls`, keyboard handlers). Retrofitting is HIGH recovery cost.
3. **Vue Set reactivity trap** -- `ref<Set>` does not track `.add()`/`.delete()` mutations. Must replace the entire Set reference on each toggle.
4. **CSS specificity conflicts** -- Global `.page-faq` styles in `main.css` will collide with scoped component styles. Audit and clean up global FAQ CSS in the same PR.
5. **Career vault markdown in plain-text renderer** -- Strip markdown during content migration; extract exhibit references to structured `exhibitNote` field.

## Implications for Roadmap

Based on combined research, suggested 4-phase structure following dependency chain and increasing integration scope.

### Phase 1: Data Schema and Content Foundation

**Rationale:** Types and data are the foundation everything builds on. Taxonomy design is a content decision that must be locked before component work. The `category` to `categories` rename propagates to all downstream files.
**Delivers:** Updated TypeScript types (`FaqItem` with `categories[]`, `exhibitNote`), migrated JSON data, unified category taxonomy designed
**Addresses:** FaqItem type extension, data migration, stable ID field addition
**Avoids:** Pitfall 1 (taxonomy collision), Pitfall 2 (type union break), Pitfall 4 (markdown in answers)

### Phase 2: Core Interactive Components

**Rationale:** Components can be built and tested in isolation once types are stable. FaqAccordionItem and FaqFilterBar are independent leaf components that can be developed in parallel. Building accessibility in from the start prevents the highest-cost pitfall.
**Delivers:** FaqAccordionItem (with full ARIA), FaqFilterBar (with counts), ExhibitCallout -- all with unit tests and Storybook stories
**Addresses:** Accordion toggle, +/x indicator, multi-open, filter pills, live counts, exhibit callouts, keyboard accessibility
**Avoids:** Pitfall 3 (accordion state leaking into filter), Pitfall 5 (missing ARIA), Pitfall 6 (CSS specificity)

### Phase 3: Page Integration and Cleanup

**Rationale:** FaqPage rewrite depends on all components being ready. This phase wires everything together, audits global CSS, and removes dead code.
**Delivers:** Rewritten FaqPage with flat filtered layout, cleaned global CSS, deleted FaqItem.vue and old stories
**Addresses:** Full-width stacked layout, HR separators, filter-accordion interaction, responsive behavior
**Avoids:** Anti-pattern of keeping category sections AND filter bar simultaneously

### Phase 4: Content Merge (Career Vault)

**Rationale:** Content merge is a separate concern from the interactive redesign. The components and page should work with existing 14 questions first, then expand. Career vault content requires markdown stripping and exhibit reference extraction -- a content task, not a code task.
**Delivers:** Merged FAQ content (~27 questions), exhibit callout data populated, taxonomy validated with real content
**Addresses:** Career vault FAQ integration, exhibit cross-references populated with real data

### Phase Ordering Rationale

- **Types-first** (Phase 1) ensures TypeScript compiler guides all downstream work and catches errors early
- **Components-before-page** (Phase 2 before 3) enables isolated testing, parallel development, and Storybook-driven component validation
- **Content-last** (Phase 4) decouples the interactive redesign from the content migration -- either can ship independently
- **Each phase is independently deployable:** Phase 1-3 delivers a working interactive FAQ with existing content; Phase 4 expands content

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Category taxonomy design needs a content review session -- mapping career vault categories to site categories is a design decision requiring human input
- **Phase 4:** Career vault content transformation (markdown stripping, exhibit reference extraction) may need a content audit to identify which questions have exhibit references

Phases with standard patterns (skip research-phase):
- **Phase 2:** Accordion and filter components follow well-documented WAI-ARIA APG and Vue Composition API patterns. No novel technical challenges.
- **Phase 3:** Page integration is straightforward wiring of components built in Phase 2. Standard Vue composition with established project patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies; all recommendations verified against existing `package.json` and codebase patterns |
| Features | HIGH | Feature list derived from PROJECT.md requirements, existing codebase capabilities, and established FAQ UX conventions |
| Architecture | HIGH | Architecture derived from direct analysis of all 9 affected files; blast radius contained to FAQ feature boundary (5 modified/deleted, 3 new) |
| Pitfalls | HIGH | Pitfalls identified from codebase-specific analysis (CSS specificity, Vue Set reactivity, type assertion gaps) and WAI-ARIA standards |

**Overall confidence:** HIGH -- all research is grounded in direct codebase analysis, not external assumptions. Zero new dependencies eliminates version compatibility unknowns.

### Gaps to Address

- **Unified category taxonomy:** The specific mapping of career vault categories to site categories is a content decision requiring human input. Research identified constraints (5-7 categories, 3+ questions each) but cannot make the mapping decision.
- **Exhibit callout content:** Which of the 14 existing questions should get `exhibitNote` fields, and what those notes should say, requires content authoring.
- **Animation scope clarity:** PROJECT.md lists animations as "out of scope" but the accordion expand/collapse transition is functional UI feedback, not decorative. The roadmap should explicitly decide: is the CSS `grid-template-rows` transition in or out for v6.0?
- **Filter-on-change accordion behavior:** Should filtering collapse all open items (fresh context) or preserve open state? Research documented both options but the UX policy needs an explicit decision.

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: `src/types/faq.ts`, `src/data/faq.ts`, `src/data/json/faq.json`, `src/components/FaqItem.vue`, `src/pages/FaqPage.vue`, `src/assets/css/main.css`, `package.json`
- PROJECT.md v6.0 milestone specification and key decisions log
- WAI-ARIA Authoring Practices Guide: Accordion Pattern

### Secondary (MEDIUM confidence)
- Career vault content: `/home/xhiris/career-vault/job-search/interview-prep/website-faq-content.md` -- content structure analyzed but taxonomy mapping not finalized
- CSS `grid-template-rows` transition technique -- well-documented, supported in all evergreen browsers since late 2023

---
*Research completed: 2026-04-08*
*Ready for roadmap: yes*
