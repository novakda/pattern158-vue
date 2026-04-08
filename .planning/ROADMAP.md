# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-06)
- ✅ **v3.0 Data Externalization** — Phases 17-19 (shipped 2026-04-06)
- ✅ **v4.0 Exhibit Data Normalization** — Phases 20-22 (shipped 2026-04-07)
- ✅ **v5.0 Findings Schema Unification** — Phases 23-26 (shipped 2026-04-08)
- 🚧 **v5.1 Personnel & Technologies Card Layout** — Phase 27 (in progress)

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

<details>
<summary>v5.0 Findings Schema Unification (Phases 23-26) -- SHIPPED 2026-04-08</summary>

- [x] Phase 23: Schema Foundation (1/1 plans) -- completed 2026-04-08
- [x] Phase 24: Findings Backfill (1/1 plans) -- completed 2026-04-08
- [x] Phase 25: Field Enrichment (1/1 plans) -- completed 2026-04-08
- [x] Phase 26: Layout Rendering (1/1 plans) -- completed 2026-04-08

Full details: `.planning/milestones/v5.0-ROADMAP.md`

</details>

### v5.1 Personnel & Technologies Card Layout (In Progress)

**Milestone Goal:** Apply responsive card layout pattern (desktop table / mobile cards) to personnel and technologies sections, matching the findings-table pattern from v5.0.

- [ ] **Phase 27: Personnel & Technologies Card Layout** - Desktop table classes and mobile card views for both section types across both layouts

## Phase Details

### Phase 27: Personnel & Technologies Card Layout
**Goal**: Personnel and technologies sections render as structured tables on desktop and readable cards on mobile, matching the findings layout pattern
**Depends on**: Phase 26
**Requirements**: PERS-04, PERS-05, TECH-04, TECH-05
**Success Criteria** (what must be TRUE):
  1. Personnel section on desktop displays with `.personnel-table` class and visible column headers for all field variants
  2. Personnel section at 480px or narrower renders as stacked cards with each person's name styled as an h3-level heading
  3. Technologies section on desktop displays with `.technologies-table` class and visible column headers
  4. Technologies section at 480px or narrower renders as stacked cards with the technology category as the card heading
  5. Both card layouts appear identically in EngineeringBriefLayout and InvestigationReportLayout
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 27. Personnel & Technologies Card Layout | 0/TBD | Not started | - |
