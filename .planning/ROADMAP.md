# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-06)
- ✅ **v3.0 Data Externalization** — Phases 17-19 (shipped 2026-04-06)
- ✅ **v4.0 Exhibit Data Normalization** — Phases 20-22 (shipped 2026-04-07)
- [ ] **v5.0 Findings Schema Unification** — Phases 23-26 (in progress)

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

<details>
<summary>v4.0 Exhibit Data Normalization (Phases 20-22) -- SHIPPED 2026-04-07</summary>

- [x] Phase 20: Personnel Migration (2/2 plans) -- completed 2026-04-07
- [x] Phase 21: Technologies Migration (2/2 plans) -- completed 2026-04-07
- [x] Phase 22: Findings Migration (2/2 plans) -- completed 2026-04-07

Full details: `.planning/milestones/v4.0-ROADMAP.md`

</details>

### v5.0 Findings Schema Unification (In Progress)

**Milestone Goal:** Unify all exhibit findings into a consistent schema with optional enrichment fields, backfill findings for exhibits that currently lack them, and update layout rendering to handle the new optional fields.

- [ ] **Phase 23: Schema Foundation** - Update FindingEntry type with unified field set and normalize Exhibit A field naming
- [ ] **Phase 24: Findings Backfill** - Extract findings from narrative sections for 5 exhibits and promote findingsHeading
- [ ] **Phase 25: Field Enrichment** - Populate severity, resolution, and category values across all exhibits with findings
- [ ] **Phase 26: Layout Rendering** - Render severity badges, resolution/outcome text, and category tags in detail layouts

## Phase Details

### Phase 23: Schema Foundation
**Goal**: FindingEntry type supports the full unified field set and Exhibit A data conforms to it
**Depends on**: Phase 22
**Requirements**: SCHM-01, SCHM-02
**Success Criteria** (what must be TRUE):
  1. `FindingEntry` type in `src/types/` includes optional fields: `severity`, `resolution`, `outcome`, `category` alongside existing `finding` and `description`
  2. Exhibit A's findings use `description` instead of `background` (field renamed in exhibits.json, no data loss)
  3. All existing unit tests pass and `vite build` succeeds — no rendering breakage from type or data changes
**Plans:** 1 plan

Plans:
- [ ] 23-01-PLAN.md — Update FindingEntry type and normalize Exhibit A background to description

### Phase 24: Findings Backfill
**Goal**: Five exhibits that currently lack findings arrays have structured findings extracted from their narrative content, and all exhibits with non-default headings carry a findingsHeading field
**Depends on**: Phase 23
**Requirements**: BKFL-01, BKFL-02, BKFL-03, BKFL-04, BKFL-05, SCHM-03
**Success Criteria** (what must be TRUE):
  1. Exhibit D (Wells Fargo) has a `findings[]` array with entries extracted from its narrative sections
  2. Exhibit F (HSBC) has a `findings[]` array with entries extracted from its narrative sections
  3. Exhibit G (SunTrust) has a `findings[]` array with entries extracted from its narrative sections
  4. Exhibit H (Metal Additive) has a `findings[]` array with entries extracted from its narrative sections
  5. Exhibit K (Microsoft MCAPS) has a `findings[]` array with entries extracted from its narrative sections
**Plans**: TBD

### Phase 25: Field Enrichment
**Goal**: All exhibits with findings have enrichment fields populated where applicable — severity, resolution, and category values drawn from existing exhibit content
**Depends on**: Phase 24
**Requirements**: ENRH-01, ENRH-02, ENRH-03
**Success Criteria** (what must be TRUE):
  1. Severity values are populated on findings where the source content supports it (at minimum Exhibit L; Exhibits J and K evaluated)
  2. Resolution values are populated on findings where applicable (Exhibit A already has them; other exhibits backfilled from Outcome/Probable Cause sections)
  3. Category values are populated on all findings using a consistent taxonomy (architecture, protocol, ux, process, tooling, environment)
  4. All enrichment values are drawn from existing exhibit content — no fabricated content (CONT-02 gate applies)
**Plans**: TBD

### Phase 26: Layout Rendering
**Goal**: Detail layout components render the new optional FindingEntry fields with appropriate visual treatment
**Depends on**: Phase 23
**Requirements**: LYOT-01, LYOT-02, LYOT-03, LYOT-04
**Success Criteria** (what must be TRUE):
  1. When a finding has a `severity` value, a severity badge renders inline with the finding title
  2. When a finding has a `resolution` value, resolution text renders below the finding description
  3. When a finding has an `outcome` value, outcome text renders below the finding description
  4. When a finding has a `category` value, a subtle category label/tag renders with the finding
  5. Findings without optional fields render exactly as they do today — no visual regression
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 23 -> 24 -> 25 -> 26

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
| 20. Personnel Migration | v4.0 | 2/2 | Complete | 2026-04-07 |
| 21. Technologies Migration | v4.0 | 2/2 | Complete | 2026-04-07 |
| 22. Findings Migration | v4.0 | 2/2 | Complete | 2026-04-07 |
| 23. Schema Foundation | v5.0 | 0/1 | Not started | - |
| 24. Findings Backfill | v5.0 | 0/0 | Not started | - |
| 25. Field Enrichment | v5.0 | 0/0 | Not started | - |
| 26. Layout Rendering | v5.0 | 0/0 | Not started | - |
