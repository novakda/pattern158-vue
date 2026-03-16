# Roadmap: Pattern 158 Vue Conversion

## Overview

Three phases to take the Vue 3 scaffold from partial conversion to a fully ported, component-extracted portfolio site with visual parity to the live 11ty site. Phase 1 clears the known defects that would compound if more pages were added on top of them. Phase 2 ports the homepage and establishes the component extraction pattern. Phase 3 applies that pattern to the remaining six pages and brings all components to Storybook-documented completion.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation Fixes** - Clear known defects before adding more pages (completed 2026-03-16)
- [ ] **Phase 2: Homepage + Extraction Pattern** - Port HomePage and establish component extraction model
- [ ] **Phase 3: Remaining Pages + Completion** - Port all remaining pages, complete component library, finalize Storybook

## Phase Details

### Phase 1: Foundation Fixes
**Goal**: The existing codebase has no known accessibility violations, no silent broken-link failures, and a complete testing stack before any new pages are added
**Depends on**: Nothing (first phase)
**Requirements**: A11Y-01
**Success Criteria** (what must be TRUE):
  1. Opening TechnologiesPage and ContactPage in a browser produces valid HTML with no nested `<main>` elements (verifiable via browser DevTools or W3C validator)
  2. Navigating to a non-existent route (e.g., `/does-not-exist`) shows a NotFoundPage rather than a blank screen or console error
  3. `npm ls vitest-browser-vue` confirms the package is installed and listed in devDependencies
**Plans:** 2/2 plans complete

Plans:
- [x] 01-01-PLAN.md — Fix nested main wrappers + add 404 catch-all route with NotFoundPage
- [x] 01-02-PLAN.md — Test infrastructure setup (vitest dual-environment config + smoke test)

### Phase 2: Homepage + Extraction Pattern
**Goal**: HomePage is fully ported with complete content, zero raw `.html` hrefs, and the named concept components (FindingCard, SpecialtyCard, StatItem) extracted with TypeScript props — establishing the pattern all subsequent pages follow
**Depends on**: Phase 1
**Requirements**: PAGE-01, COMP-02, COMP-04
**Success Criteria** (what must be TRUE):
  1. HomePage renders all sections with content that matches the live 11ty site at 375px, 768px, and 1280px in both light and dark themes (side-by-side comparison passes)
  2. `grep '\.html"' src/pages/HomePage.vue` returns zero results — all internal links use `<router-link>`
  3. FindingCard, SpecialtyCard, and StatItem components exist with `defineProps<{}>()` TypeScript generic form and named slots where applicable
  4. The HomePage template reads as a scannable outline — section-level components are named, not inline HTML blocks
**Plans:** 3 plans

Plans:
- [ ] 02-01-PLAN.md — Create typed data layer (5 data files) and update existing component contracts (TechTags, TestimonialQuote)
- [ ] 02-02-PLAN.md — Create all 7 new Vue SFC components (HomeHero, FindingCard, SpecialtyCard, StatItem, StatsSection, InfluencesList, CtaButtons)
- [ ] 02-03-PLAN.md — Refactor HomePage.vue to compose extracted components + visual parity checkpoint

### Phase 3: Remaining Pages + Completion
**Goal**: All nine pages are fully ported with no TODO stubs, every named concept component is extracted and Storybook-documented, and page templates read as outlines
**Depends on**: Phase 2
**Requirements**: PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, COMP-01, COMP-03, STORY-01
**Success Criteria** (what must be TRUE):
  1. Every page route (FAQ, Portfolio, Contact, Testimonials, Accessibility, Review) renders complete content with no "TODO" or placeholder text visible
  2. All page templates are under 50 lines — a reviewer can scan any template and understand the page structure in 30 seconds
  3. `grep -r '\.html"' src/pages/` returns zero results across all pages
  4. Every extracted component (FindingCard, SpecialtyCard, StatItem, FaqItem, and any others) has a Storybook story demonstrating its prop variants
  5. Visual parity with the live 11ty site confirmed at 375px, 768px, and 1280px in both light and dark themes for all six ported pages
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation Fixes | 2/2 | Complete   | 2026-03-16 |
| 2. Homepage + Extraction Pattern | 0/3 | Not started | - |
| 3. Remaining Pages + Completion | 0/TBD | Not started | - |
