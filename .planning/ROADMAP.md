# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-02)
- 🚧 **v2.2 Personnel Data & Rendering** — Phases 17-20 (in progress)

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

<details>
<summary>✅ v2.0 Site IA Restructure — Evidence-Based Portfolio (Phases 9-14) — SHIPPED 2026-04-02</summary>

- [x] Phase 9: Data Model Migration (3/3 plans) — completed 2026-03-31
- [x] Phase 10: Detail Template Extraction (2/2 plans) — completed 2026-03-31
- [x] Phase 11: Unified Listing Page (2/2 plans) — completed 2026-03-31
- [x] Phase 12: Navigation and Route Migration (1/1 plans) — completed 2026-04-01
- [x] Phase 13: Page Retirement (1/1 plans) — completed 2026-04-01
- [x] Phase 14: Documentation Gap Closure (1/1 plans) — completed 2026-04-02

Full details: `.planning/milestones/v2.0-ROADMAP.md`

</details>

<details>
<summary>✅ v2.1 Case Files Bug Fixes (Phases 15-16) — SHIPPED 2026-04-02</summary>

- [x] Phase 15: Impact Tag Style Restoration (1/1 plans) — completed 2026-04-02
- [x] Phase 16: Section Type Rendering (1/1 plans) — completed 2026-04-02

Full details: `.planning/milestones/v2.1-ROADMAP.md`

</details>

### v2.2 Personnel Data & Rendering (In Progress)

**Milestone Goal:** Promote personnel from embedded table sections to first-class exhibit data with purpose-built rendering components that support anonymization.

- [x] **Phase 17: Personnel Data Extraction** - Extract personnel table data from 14 exhibits into top-level personnel[] arrays with proper field mapping (completed 2026-04-02)
- [x] **Phase 18: PersonnelCard Component** - Build personnel rendering component with named, anonymous, and self display modes (completed 2026-04-03)
- [x] **Phase 19: Layout Integration** - Wire PersonnelCard rendering into both detail layout components (completed 2026-04-03)
- [x] **Phase 20: Storybook Documentation** - Add Storybook stories covering all PersonnelCard display variants (completed 2026-04-03)

## Phase Details

### Phase 17: Personnel Data Extraction
**Goal**: Every exhibit with personnel has a structured, typed personnel[] array that coexists with the original table section
**Depends on**: Nothing (data-only, type definition already exists)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06
**Success Criteria** (what must be TRUE):
  1. All 14 exhibits (A through N, excluding O) have a top-level `personnel[]` array in their data object
  2. Name/Title/Organization exhibits (B, C, D, F, G, H, I, K, M, N) have entries with `name`, `title`, and `organization` fields correctly populated from their table data
  3. Name/Title/Role exhibits (E, J) have entries with `name`, `title`, and `role` fields correctly populated
  4. Role/Involvement exhibit (L) has entries with parsed names and fields mapped from its different column structure
  5. Dan Novak entries across all exhibits have `isSelf: true`, and original table sections remain untouched in `sections[]`
**Plans**: 2 plans

Plans:
- [x] 17-01-PLAN.md — Tests + personnel arrays for exhibits B through N (13 standard exhibits)
- [x] 17-02-PLAN.md — Exhibit A special handling (replace partial array, remove experimental section, prose extraction)

### Phase 18: PersonnelCard Component
**Goal**: Users see personnel rendered with clear visual distinction between named persons, anonymous persons, and self-entries
**Depends on**: Phase 17 (needs personnel data to render)
**Requirements**: RNDR-01, RNDR-02, RNDR-03
**Success Criteria** (what must be TRUE):
  1. A named person entry displays their name, title, organization, and role (when present)
  2. An anonymous person entry (no `name` field) displays as "Title, Organization" without any placeholder or "Unknown" text
  3. An entry with `isSelf: true` is visually distinct from other entries (highlight, badge, or similar treatment)
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [x] 18-01-PLAN.md — TDD build of PersonnelCard component with tests, Vue template, and CSS in main.css

### Phase 19: Layout Integration
**Goal**: Personnel rendering appears on exhibit detail pages for both exhibit types, replacing nothing (additive alongside existing table sections)
**Depends on**: Phase 18 (needs PersonnelCard component)
**Requirements**: RNDR-04, RNDR-05
**Success Criteria** (what must be TRUE):
  1. InvestigationReportLayout renders the exhibit's `personnel[]` array using PersonnelCard when personnel data exists
  2. EngineeringBriefLayout renders the exhibit's `personnel[]` array using PersonnelCard when personnel data exists
  3. Exhibits without personnel data (Exhibit O) show no personnel section and no empty container
**Plans**: 1 plan
**UI hint**: yes

Plans:
- [ ] 19-01-PLAN.md — Wire PersonnelCard into both layout components with tests

### Phase 20: Storybook Documentation
**Goal**: PersonnelCard is documented in Storybook with interactive examples of every display variant
**Depends on**: Phase 18 (needs PersonnelCard component)
**Requirements**: DOC-01
**Success Criteria** (what must be TRUE):
  1. Storybook has a PersonnelCard story showing a named person with all fields populated
  2. Storybook has a PersonnelCard story showing an anonymous person (no name)
  3. Storybook has a PersonnelCard story showing a self-highlighted entry (`isSelf: true`)
**Plans**: 1 plan

Plans:
- [x] 20-01-PLAN.md — PersonnelCard Storybook stories for named, anonymous, and self-highlighted variants

## Progress

**Execution Order:**
Phases execute in numeric order: 17 → 18 → 19 → 20
(Phase 20 depends on Phase 18 only, so could run parallel with Phase 19 if desired)

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
| 9. Data Model Migration | v2.0 | 3/3 | Complete | 2026-03-31 |
| 10. Detail Template Extraction | v2.0 | 2/2 | Complete | 2026-03-31 |
| 11. Unified Listing Page | v2.0 | 2/2 | Complete | 2026-03-31 |
| 12. Navigation and Route Migration | v2.0 | 1/1 | Complete | 2026-04-01 |
| 13. Page Retirement | v2.0 | 1/1 | Complete | 2026-04-01 |
| 14. Documentation Gap Closure | v2.0 | 1/1 | Complete | 2026-04-02 |
| 15. Impact Tag Style Restoration | v2.1 | 1/1 | Complete | 2026-04-02 |
| 16. Section Type Rendering | v2.1 | 1/1 | Complete | 2026-04-02 |
| 17. Personnel Data Extraction | v2.2 | 2/2 | Complete    | 2026-04-02 |
| 18. PersonnelCard Component | v2.2 | 1/1 | Complete    | 2026-04-03 |
| 19. Layout Integration | v2.2 | 0/1 | Complete    | 2026-04-03 |
| 20. Storybook Documentation | v2.2 | 1/1 | Complete   | 2026-04-03 |
