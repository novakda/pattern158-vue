# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- 🚧 **v1.1 Exhibit Content Consistency** — Phases 5-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-03-17</summary>

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
**Requirements**: PAGE-01, COMP-02
**Success Criteria** (what must be TRUE):
  1. HomePage renders all sections with content that matches the live 11ty site at 375px, 768px, and 1280px in both light and dark themes (side-by-side comparison passes)
  2. `grep '\.html"' src/pages/HomePage.vue` returns zero results — all internal links use `<router-link>`
  3. FindingCard, SpecialtyCard, and StatItem components exist with `defineProps<{}>()` TypeScript generic form
  4. The HomePage template reads as a scannable outline — section-level components are named, not inline HTML blocks
**Plans:** 3/3 plans complete

Plans:
- [x] 02-01-PLAN.md — Create typed data layer (5 data files) and update existing component contracts (TechTags, TestimonialQuote)
- [x] 02-02-PLAN.md — Create all 7 new Vue SFC components (HomeHero, FindingCard, SpecialtyCard, StatItem, StatsSection, InfluencesList, CtaButtons)
- [x] 02-03-PLAN.md — Refactor HomePage.vue to compose extracted components + visual parity checkpoint

### Phase 3: Remaining Pages + Completion
**Goal**: All nine pages are fully ported with no TODO stubs, every named concept component is extracted and Storybook-documented, and page templates read as outlines
**Depends on**: Phase 2
**Requirements**: PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, COMP-01, COMP-03, COMP-04, STORY-01
**Success Criteria** (what must be TRUE):
  1. Every page route (FAQ, Portfolio, Contact, Testimonials, Accessibility, Review) renders complete content with no "TODO" or placeholder text visible
  2. All page templates are under 50 lines — a reviewer can scan any template and understand the page structure in 30 seconds
  3. `grep -r '\.html"' src/pages/` returns zero results across all pages
  4. Every extracted component (FindingCard, SpecialtyCard, StatItem, FaqItem, and any others) has a Storybook story demonstrating its prop variants
  5. Layout components use named slots for flexible composition (COMP-04)
  6. Visual parity with the live 11ty site confirmed at 375px, 768px, and 1280px in both light and dark themes for all six ported pages
**Plans:** 6/6 plans complete

Plans:
- [x] 03-01-PLAN.md — Port FaqPage, PortfolioPage, TestimonialsPage from 11ty HTML (content porting, data-heavy pages)
- [x] 03-02-PLAN.md — Port AccessibilityPage, ReviewPage + PhilosophyPage HeroMinimal adoption + ContactPage audit
- [x] 03-03-PLAN.md — Extract FAQ and Portfolio data files + FaqItem, NarrativeCard, FlagshipCard components
- [x] 03-04-PLAN.md — Extract Testimonials data + ExhibitCard (named slots) + PhilosophyPage/ContactPage extraction for COMP-03
- [x] 03-05-PLAN.md — Storybook stories backfill for Phase 2 components (8 components)
- [x] 03-06-PLAN.md — Storybook stories for Phase 3 components + page-level viewport stories (375px/768px/1280px)

### Phase 4: Exhibit Detail Pages + Data Fix
**Goal**: All exhibit router-links resolve to real pages with content, the Exhibit O data gap is fixed, and the "Exhibit detail navigation" E2E flow completes successfully
**Depends on**: Phase 3
**Requirements**: PAGE-03, PAGE-05
**Gap Closure:** Closes integration and flow gaps from v1.0 milestone audit
**Success Criteria** (what must be TRUE):
  1. Navigating any ExhibitCard or FlagshipCard router-link renders an ExhibitDetailPage with exhibit content (not the 404 catch-all)
  2. `exhibits.ts` contains an entry for Exhibit O matching the reference in `portfolioFlagships.ts`
  3. All `/exhibits/exhibit-*` routes are registered in `router.ts`
  4. ExhibitDetailPage has a Storybook story demonstrating prop variants
**Plans:** 3/3 plans complete

Plans:
- [x] 04-01-PLAN.md — Test scaffolds (exhibits + router) + Exhibit O data entry + /exhibits/:slug route registration
- [x] 04-02-PLAN.md — ExhibitDetailPage.vue implementation with slug lookup, custom header, conditional content, not-found redirect
- [x] 04-03-PLAN.md — ExhibitDetailPage Storybook story with 4 viewport exports

</details>

---

### 🚧 v1.1 Exhibit Content Consistency (In Progress)

**Milestone Goal:** Audit and normalize exhibit detail page content — particularly "Findings" sections — so all exhibits follow a consistent structure and formatting pattern. Every structural variation is either intentionally preserved or corrected, and no content gaps are filled without explicit approval.

#### Phase 5: Exhibit Audit
**Goal**: Every exhibit's content sections are documented in a structured comparison table with all formatting variations classified — so Dan has a complete picture of what needs fixing versus what is intentionally different
**Depends on**: Phase 4
**Requirements**: AUDIT-01, AUDIT-02
**Success Criteria** (what must be TRUE):
  1. A structured per-exhibit table exists covering all 15 exhibits, documenting which sections each exhibit has (headings, quotes, tables, flags) and how they differ from each other
  2. Every variation in the table is classified as one of: intentional (content-driven), formatting inconsistency (fixable without content decision), or content gap (needs review before changing)
  3. The audit output is readable as a standalone document — Dan can review it without any additional context and understand the scope of normalization work ahead
**Plans:** TBD

Plans:
- [ ] 05-01-PLAN.md — Audit all 15 exhibits and produce structured comparison table with classified variations

#### Phase 6: Structural Normalization
**Goal**: All code-level formatting inconsistencies identified in the audit are fixed — `contextHeading` labels are unified, the `investigationReport` flag renders correctly, and quote attribution follows a single format — without any content decisions required
**Depends on**: Phase 5
**Requirements**: STRUCT-01, STRUCT-02, STRUCT-03
**Success Criteria** (what must be TRUE):
  1. All exhibits use one consistent label convention for `contextHeading` — no exhibit uses a divergent naming pattern
  2. The `investigationReport` flag button text matches the actual flag value semantically — a `true` flag shows an affirmative label, a `false` flag shows a negative label (currently inverted)
  3. All exhibits that have quotes display attribution with consistent use of the `role` field — no exhibit omits role while others include it for equivalent quote types
**Plans:** TBD

Plans:
- [ ] 06-01-PLAN.md — Normalize contextHeading labels, fix investigationReport flag display logic, standardize quote attribution format

#### Phase 7: Content Gap Fill
**Goal**: All content gaps approved by Dan during review are added to `exhibits.ts` — no exhibit is missing context or quotes that the 11ty source provides — and no content is added without explicit approval
**Depends on**: Phase 6 + Dan's review of CONT-01 output (user-gated)
**Requirements**: CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. A content gap decision list is produced and handed to Dan for review — covering items such as Exhibit D missing context, exhibits without quotes, and any other gaps flagged in the audit
  2. Every item Dan approves from the gap list is implemented in `exhibits.ts` with content that matches the published 11ty source exactly
  3. No content changes are made to `exhibits.ts` beyond what appears in the approved gap list — scope is explicitly bounded
**Plans:** TBD

Plans:
- [ ] 07-01-PLAN.md — Produce content gap decision list (CONT-01)
- [ ] 07-02-PLAN.md — Implement approved content additions to exhibits.ts (CONT-02)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation Fixes | v1.0 | 2/2 | Complete | 2026-03-16 |
| 2. Homepage + Extraction Pattern | v1.0 | 3/3 | Complete | 2026-03-17 |
| 3. Remaining Pages + Completion | v1.0 | 6/6 | Complete | 2026-03-17 |
| 4. Exhibit Detail Pages + Data Fix | v1.0 | 3/3 | Complete | 2026-03-17 |
| 5. Exhibit Audit | v1.1 | 0/1 | Not started | - |
| 6. Structural Normalization | v1.1 | 0/1 | Not started | - |
| 7. Content Gap Fill | v1.1 | 0/2 | Not started | - |
