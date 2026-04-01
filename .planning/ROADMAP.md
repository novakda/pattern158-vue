# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- 🚧 **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-13 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-03-17</summary>

- [x] Phase 1: Foundation Fixes (2/2 plans) — completed 2026-03-16
- [x] Phase 2: Homepage + Extraction Pattern (3/3 plans) — completed 2026-03-17
- [x] Phase 3: Remaining Pages + Completion (6/6 plans) — completed 2026-03-17
- [x] Phase 4: Exhibit Detail Pages + Data Fix (3/3 plans) — completed 2026-03-17

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 Exhibit Content Consistency (Phases 5-8) — SHIPPED 2026-03-19</summary>

- [x] Phase 5: Exhibit Audit (1/1 plans) — completed 2026-03-18
- [x] Phase 6: Structural Normalization (1/1 plans) — completed 2026-03-18
- [x] Phase 7: Content Gap Fill (2/2 plans) — completed 2026-03-18
- [x] Phase 8: Fix STRUCT-02 ExhibitCard Link Text (1/1 plans) — completed 2026-03-19

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

### 🚧 v2.0 Site IA Restructure — Evidence-Based Portfolio (In Progress)

**Milestone Goal:** Restructure the site's information architecture so every page earns its place, replacing redundant Portfolio and Field Reports pages with a unified evidence section that distinguishes two exhibit types.

- [ ] **Phase 9: Data Model Migration** - Replace ambiguous boolean flags with explicit exhibitType discriminant and consolidate data sources
- [x] **Phase 10: Detail Template Extraction** - Split monolithic detail page into dispatcher plus two focused layout components (completed 2026-03-31)
- [x] **Phase 11: Unified Listing Page** - Build Case Files page with type-grouped exhibits, relocated breadth signals, and Three Lenses removal (completed 2026-03-31)
- [x] **Phase 12: Navigation and Route Migration** - Atomic switchover of routes, NavBar, homepage CTAs, and all internal link references (completed 2026-04-01)
- [ ] **Phase 13: Page Retirement** - Remove old Portfolio and Testimonials pages after all traffic routes elsewhere

## Phase Details

### Phase 9: Data Model Migration
**Goal**: Every exhibit has a self-documenting type classification and all exhibit data lives in a single source of truth
**Depends on**: Phase 8 (v1.1 complete)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. TypeScript compiler accepts `exhibitType` on every exhibit with no boolean flag references remaining in the Exhibit interface
  2. All 15 exhibits have correct `exhibitType` value (5 investigation-report, 10 engineering-brief) and the app renders without errors
  3. Flagship summary and quote fields are accessible on Exhibit objects directly (no separate portfolioFlagships.ts import needed)
  4. `portfolioFlagships.ts` and `portfolioNarratives.ts` files are deleted and no imports reference them
**Plans:** 1/3 plans executed
Plans:
- [x] 09-01-PLAN.md — Migrate Exhibit interface to exhibitType discriminant and merge flagship data
- [x] 09-02-PLAN.md — Update consumer components, tests, and Storybook stories
- [x] 09-03-PLAN.md — Delete portfolioFlagships.ts and portfolioNarratives.ts, update remaining consumers

### Phase 10: Detail Template Extraction
**Goal**: Each exhibit type renders through a purpose-built layout that emphasizes its strengths
**Depends on**: Phase 9
**Requirements**: DTPL-01, DTPL-02, DTPL-03, DTPL-04
**Success Criteria** (what must be TRUE):
  1. Navigating to any of the 5 investigation report exhibits shows NTSB-style layout (timeline, probable cause, contributing factors, personnel tables)
  2. Navigating to any of the 10 engineering brief exhibits shows constraints-approach-results layout rather than forensic diagnosis framing
  3. Both exhibit types display their type label (Investigation Report or Engineering Brief) in the detail page header
  4. ExhibitDetailPage.vue is a thin dispatcher (under ~100 lines) that delegates body rendering to the appropriate layout component
**Plans:** 2/2 plans complete
Plans:
- [x] 10-01-PLAN.md — Create layout components and rewrite dispatcher
- [x] 10-02-PLAN.md — Create layout component tests and update dispatcher tests

### Phase 11: Unified Listing Page
**Goal**: A single Case Files page presents all evidence with type-aware styling and breadth context, replacing content that lived on two separate pages
**Depends on**: Phase 9
**Requirements**: LIST-01, LIST-02, LIST-03, LIST-04, LIST-05, CLN-01, CLN-02
**Success Criteria** (what must be TRUE):
  1. Case Files page renders all 15 exhibits with visually distinct card styles per exhibit type (badge, border, or icon variation)
  2. Exhibits are grouped into Investigation Reports and Engineering Briefs sections on the listing page
  3. Stats bar (38 Projects, 6,000+ Emails, 15+ Industries) and 38-project directory table are visible on the Case Files page
  4. Three Lenses section and NarrativeCard component are removed from the codebase
**Plans:** 2/2 plans complete
Plans:
- [x] 11-01-PLAN.md — ExhibitCard type class and CaseFilesPage creation
- [x] 11-02-PLAN.md — Border accent CSS, NarrativeCard deletion, and comprehensive tests

### Phase 12: Navigation and Route Migration
**Goal**: Users reach Case Files through every path that previously led to Portfolio or Field Reports, with zero broken links
**Depends on**: Phase 10, Phase 11
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, CLN-04, CLN-05
**Success Criteria** (what must be TRUE):
  1. NavBar shows a single "Case Files" entry where Portfolio and Field Reports used to be
  2. Visiting `/case-files` loads the Case Files page; visiting `/portfolio` or `/testimonials` redirects to `/case-files`
  3. Every hardcoded route reference across the codebase (10+ files) points to the new Case Files route
  4. Detail page back-navigation links say "Back to Case Files" and navigate to the Case Files page
  5. Homepage CTAs ("View My Work", "View All Field Reports") point to Case Files
**Plans:** 1/1 plans complete
Plans:
- [x] 12-01-PLAN.md — Atomic route migration: add /case-files route, redirects, NavBar, all hardcoded references, and tests

### Phase 13: Page Retirement
**Goal**: Dead pages and their dependencies are removed, leaving a clean codebase with no orphaned files
**Depends on**: Phase 12
**Requirements**: CLN-03
**Success Criteria** (what must be TRUE):
  1. PortfolioPage.vue and TestimonialsPage.vue are deleted from the codebase
  2. No TypeScript import or Vue Router reference to the deleted pages exists anywhere in the codebase
  3. The application builds without errors and all existing functionality works after removal
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11 → 12 → 13
(Phases 10 and 11 both depend only on Phase 9 and could potentially execute in parallel)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation Fixes | v1.0 | 2/2 | Complete | 2026-03-16 |
| 2. Homepage + Extraction Pattern | v1.0 | 3/3 | Complete | 2026-03-17 |
| 3. Remaining Pages + Completion | v1.0 | 6/6 | Complete | 2026-03-17 |
| 4. Exhibit Detail Pages + Data Fix | v1.0 | 3/3 | Complete | 2026-03-17 |
| 5. Exhibit Audit | v1.1 | 1/1 | Complete | 2026-03-18 |
| 6. Structural Normalization | v1.1 | 1/1 | Complete | 2026-03-18 |
| 7. Content Gap Fill | v1.1 | 2/2 | Complete | 2026-03-18 |
| 8. Fix STRUCT-02 ExhibitCard Link Text | v1.1 | 1/1 | Complete | 2026-03-19 |
| 9. Data Model Migration | v2.0 | 1/3 | In Progress|  |
| 10. Detail Template Extraction | v2.0 | 2/2 | Complete    | 2026-03-31 |
| 11. Unified Listing Page | v2.0 | 2/2 | Complete    | 2026-03-31 |
| 12. Navigation and Route Migration | v2.0 | 1/1 | Complete    | 2026-04-01 |
| 13. Page Retirement | v2.0 | 0/0 | Not started | - |
