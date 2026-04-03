# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-02)
- ✅ **v2.2 Personnel Data & Rendering** — Phases 17-20 (shipped 2026-04-03)
- 🚧 **v2.3 Findings Data & Rendering** — Phases 21-24 (in progress)

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

<details>
<summary>✅ v2.2 Personnel Data & Rendering (Phases 17-20) — SHIPPED 2026-04-03</summary>

- [x] Phase 17: Personnel Data Extraction (2/2 plans) — completed 2026-04-02
- [x] Phase 18: PersonnelCard Component (1/1 plans) — completed 2026-04-03
- [x] Phase 19: Layout Integration (1/1 plans) — completed 2026-04-03
- [x] Phase 20: Storybook Documentation (1/1 plans) — completed 2026-04-03

Full details: `.planning/milestones/v2.2-ROADMAP.md`

</details>

### v2.3 Findings Data & Rendering (In Progress)

**Milestone Goal:** Promote exhibit findings from embedded table sections to first-class typed arrays with purpose-built responsive rendering (table on desktop, stacked cards on mobile).

- [x] **Phase 21: Type Definition & Data Extraction** - Define ExhibitFindingEntry interface and migrate 7 exhibits' findings data to typed arrays (completed 2026-04-03)
- [x] **Phase 22: FindingsTable Component** - Build responsive dual-mode rendering component with TDD (table on desktop, cards on mobile) (completed 2026-04-03)
- [x] **Phase 23: Layout Integration** - Wire FindingsTable into both detail layouts with empty-state suppression using TDD (completed 2026-04-03)
- [x] **Phase 24: Storybook Documentation** - Document FindingsTable with stories covering all column and field variants (completed 2026-04-03)

## Phase Details

### Phase 21: Type Definition & Data Extraction
**Goal**: Exhibit findings exist as typed, validated data ready for purpose-built rendering
**Depends on**: Phase 20 (v2.2 complete)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06
**Success Criteria** (what must be TRUE):
  1. ExhibitFindingEntry interface exists in exhibits.ts with finding (required) and description, background, resolution, severity (all optional) fields
  2. Exhibit interface has optional findings[] array and optional findingsHeading string field
  3. All 7 table-type exhibits (A, E, F, J, L, N, O) have findings[] arrays populated from their existing table data
  4. Exhibits with non-default headings (J, L) have findingsHeading values preserving original section titles
  5. Old findings table sections are removed from migrated exhibits' sections[] arrays (no duplicate data)
**Plans**: 2 plans
Plans:
- [x] 21-01-PLAN.md — Interface definition + findings data migration for 7 exhibits
- [x] 21-02-PLAN.md — Section removal + test coverage

### Phase 22: FindingsTable Component
**Goal**: Users see exhibit findings rendered as a scannable table on desktop and readable stacked cards on mobile
**Depends on**: Phase 21
**Requirements**: RNDR-01, RNDR-02, RNDR-03, RNDR-04
**Success Criteria** (what must be TRUE):
  1. FindingsTable renders a semantic HTML table on desktop viewports
  2. FindingsTable renders stacked cards on mobile viewports (768px breakpoint)
  3. Column rendering adapts automatically based on populated fields (2-col finding/description and 3-col patterns both work without configuration)
  4. Findings with severity data display a visual severity badge
**Plans**: 2 plans
Plans:
- [x] 22-01-PLAN.md — TDD: FindingsTable tests + component implementation
- [x] 22-02-PLAN.md — FindingsTable CSS styling with responsive toggle and severity badges

### Phase 23: Layout Integration
**Goal**: Exhibit detail pages display findings through FindingsTable wherever findings data exists
**Depends on**: Phase 22
**Requirements**: RNDR-05, RNDR-06
**Success Criteria** (what must be TRUE):
  1. InvestigationReportLayout renders FindingsTable when exhibit has findings data
  2. EngineeringBriefLayout renders FindingsTable when exhibit has findings data
  3. Neither layout renders a findings section when exhibit has no findings data (empty-state suppression)
**Plans**: 1 plan
Plans:
- [x] 23-01-PLAN.md — TDD: Wire FindingsTable into both layouts with empty-state suppression
**UI hint**: yes

### Phase 24: Storybook Documentation
**Goal**: FindingsTable field variations are documented and visually reviewable in Storybook
**Depends on**: Phase 22
**Requirements**: DOC-01
**Success Criteria** (what must be TRUE):
  1. Storybook story exists showing 2-column variant (finding + description)
  2. Storybook story exists showing 3-column variant with severity data
  3. Storybook story exists showing 3-column variant with background/resolution data
**Plans**: 1 plan
Plans:
- [x] 24-01-PLAN.md — FindingsTable Storybook stories (3 column variants)

## Progress

**Execution Order:**
Phases execute in numeric order: 21 -> 22 -> 23 -> 24
(Phase 24 depends on Phase 22 only, so could run parallel with Phase 23 if desired)

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
| 17. Personnel Data Extraction | v2.2 | 2/2 | Complete | 2026-04-02 |
| 18. PersonnelCard Component | v2.2 | 1/1 | Complete | 2026-04-03 |
| 19. Layout Integration | v2.2 | 1/1 | Complete | 2026-04-03 |
| 20. Storybook Documentation | v2.2 | 1/1 | Complete | 2026-04-03 |
| 21. Type Definition & Data Extraction | v2.3 | 2/2 | Complete | 2026-04-03 |
| 22. FindingsTable Component | v2.3 | 2/2 | Complete    | 2026-04-03 |
| 23. Layout Integration | v2.3 | 1/1 | Complete    | 2026-04-03 |
| 24. Storybook Documentation | v2.3 | 1/1 | Complete   | 2026-04-03 |
