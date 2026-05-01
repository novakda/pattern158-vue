# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-06)
- ✅ **v3.0 Data Externalization** — Phases 17-19 (shipped 2026-04-06)
- [ ] **v4.0 Exhibit Data Normalization** — Phases 20-22 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-4) -- SHIPPED 2026-03-17</summary>

- [x] Phase 1: Foundation Fixes (2/2 plans) -- completed 2026-03-16
- [x] Phase 2: Homepage + Extraction Pattern (3/3 plans) -- completed 2026-03-17
- [x] Phase 3: Remaining Pages + Completion (6/6 plans) -- completed 2026-03-17
- [x] Phase 4: Exhibit Detail Pages + Data Fix (3/3 plans) -- completed 2026-03-17

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>v1.1 Exhibit Content Consistency (Phases 5-8) -- SHIPPED 2026-03-19</summary>

- [x] Phase 5: Exhibit Audit (1/1 plans) -- completed 2026-03-18
- [x] Phase 6: Structural Normalization (1/1 plans) -- completed 2026-03-18
- [x] Phase 7: Content Gap Fill (2/2 plans) -- completed 2026-03-18
- [x] Phase 8: Fix STRUCT-02 ExhibitCard Link Text (1/1 plans) -- completed 2026-03-19

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

<details>
<summary>v2.0 Site IA Restructure -- Evidence-Based Portfolio (Phases 9-14) -- SHIPPED 2026-04-02</summary>

- [x] Phase 9: Data Model Migration (3/3 plans) -- completed 2026-03-31
- [x] Phase 10: Detail Template Extraction (2/2 plans) -- completed 2026-03-31
- [x] Phase 11: Unified Listing Page (2/2 plans) -- completed 2026-03-31
- [x] Phase 12: Navigation and Route Migration (1/1 plans) -- completed 2026-04-01
- [x] Phase 13: Page Retirement (1/1 plans) -- completed 2026-04-01
- [x] Phase 14: Documentation Gap Closure (1/1 plans) -- completed 2026-04-02

Full details: `.planning/milestones/v2.0-ROADMAP.md`

</details>

<details>
<summary>v2.1 Case Files Bug Fixes (Phases 15-16) -- SHIPPED 2026-04-06</summary>

- [x] Phase 15: Impact Tag Style Restoration (1/1 plans) -- completed 2026-04-02
- [x] Phase 16: Section Type Rendering (1/1 plans) -- completed 2026-04-02

Full details: `.planning/milestones/v2.1-ROADMAP.md`

</details>

<details>
<summary>v3.0 Data Externalization (Phases 17-19) -- SHIPPED 2026-04-06</summary>

- [x] Phase 17: Types Infrastructure and Simple Data Migration (2/2 plans) -- completed 2026-04-06
- [x] Phase 18: Complex Data Migration (2/2 plans) -- completed 2026-04-06
- [x] Phase 19: Exhibits Migration (1/1 plans) -- completed 2026-04-06

Full details: `.planning/milestones/v3.0-ROADMAP.md`

</details>

### v4.0 Exhibit Data Normalization (In Progress)

**Milestone Goal:** Migrate recurring table-type data (personnel, technologies, findings) from generic `rows: string[][]` sections to typed first-class arrays on exhibit objects, removing migrated sections and updating layout rendering.

- [x] **Phase 20: Personnel Migration** - Promote personnel tables to typed `PersonnelEntry[]` arrays with section removal and layout rendering (completed 2026-04-07)
- [x] **Phase 21: Technologies Migration** - Promote technologies tables to typed `TechnologyEntry[]` arrays with section removal and layout rendering (completed 2026-04-07)
- [x] **Phase 22: Findings Migration** - Promote findings tables to typed `FindingEntry[]` arrays with section removal and layout rendering (completed 2026-04-07)

## Phase Details

### Phase 20: Personnel Migration
**Goal**: Exhibit personnel data lives in typed first-class arrays instead of generic table rows, and layout components render it from the new structure
**Depends on**: Phase 19
**Requirements**: PERS-01, PERS-02, PERS-03
**Success Criteria** (what must be TRUE):
  1. Each of the 13 exhibits with personnel data has a `personnel: PersonnelEntry[]` array on its exhibit object, with typed fields (not string arrays)
  2. The `sections[]` array in exhibits.json no longer contains any personnel table sections for those 13 exhibits
  3. Both InvestigationReportLayout and EngineeringBriefLayout render a personnel table from the typed `personnel` array (visually identical output to the old generic table)
  4. All existing unit tests pass and `vite build` succeeds with no rendering breakage
**Plans**: 2 plans

Plans:
- [ ] 20-01-PLAN.md — Type definitions + JSON data transformation (PERS-01, PERS-02)
- [ ] 20-02-PLAN.md — Layout rendering + test coverage (PERS-03)

### Phase 21: Technologies Migration
**Goal**: Exhibit technologies data lives in typed first-class arrays instead of generic table rows, and layout components render it from the new structure
**Depends on**: Phase 20
**Requirements**: TECH-01, TECH-02, TECH-03
**Success Criteria** (what must be TRUE):
  1. Each of the 11 exhibits with technologies data has a `technologies: TechnologyEntry[]` array on its exhibit object, with typed fields (not string arrays)
  2. The `sections[]` array in exhibits.json no longer contains any technologies table sections (heading "Technologies") for those 11 exhibits
  3. Both layout components render a technologies table from the typed `technologies` array (visually identical output to the old generic table)
  4. All existing unit tests pass and `vite build` succeeds with no rendering breakage
**Plans**: 2 plans

Plans:
- [ ] 21-01-PLAN.md — Type definitions + JSON data transformation (TECH-01, TECH-02)
- [x] 21-02-PLAN.md — Layout rendering + test coverage (TECH-03)

### Phase 22: Findings Migration
**Goal**: Exhibit findings data lives in typed first-class arrays instead of generic table rows, and layout components render it from the new structure
**Depends on**: Phase 21
**Requirements**: FIND-01, FIND-02, FIND-03
**Success Criteria** (what must be TRUE):
  1. Each of the 7 exhibits with findings data has a `findings: FindingEntry[]` array on its exhibit object, with typed fields handling all 3 column variants
  2. The `sections[]` array in exhibits.json no longer contains any findings table sections for those 7 exhibits
  3. Both layout components render a findings table from the typed `findings` array, adapting to column variant differences (visually identical output)
  4. All existing unit tests pass and `vite build` succeeds with no rendering breakage
**Plans**: 2 plans

Plans:
- [ ] 22-01-PLAN.md — Type definitions + JSON data transformation (FIND-01, FIND-02)
- [ ] 22-02-PLAN.md — Layout rendering + test coverage (FIND-03)

## Progress

**Execution Order:**
Phases execute in numeric order: 20 -> 21 -> 22

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
| 17. Types Infrastructure and Simple Data Migration | v3.0 | 2/2 | Complete | 2026-04-06 |
| 18. Complex Data Migration | v3.0 | 2/2 | Complete | 2026-04-06 |
| 19. Exhibits Migration | v3.0 | 1/1 | Complete | 2026-04-06 |
| 20. Personnel Migration | v4.0 | 0/2 | Complete    | 2026-04-07 |
| 21. Technologies Migration | v4.0 | 0/2 | Complete    | 2026-04-07 |
| 22. Findings Migration | v4.0 | 0/2 | Complete    | 2026-04-07 |
