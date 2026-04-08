# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-06)
- ✅ **v3.0 Data Externalization** — Phases 17-19 (shipped 2026-04-06)
- ✅ **v4.0 Exhibit Data Normalization** — Phases 20-22 (shipped 2026-04-07)
- ✅ **v5.0 Findings Schema Unification** — Phases 23-26 (shipped 2026-04-08)
- ✅ **v5.1 Personnel & Technologies Card Layout** — Phase 27 (shipped 2026-04-08)
- 🚧 **v5.2 Personnel Data Normalization & Card UX** — Phases 28-29 (in progress)

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

<details>
<summary>v5.1 Personnel & Technologies Card Layout (Phase 27) -- SHIPPED 2026-04-08</summary>

- [x] Phase 27: Personnel & Technologies Card Layout (1/1 plans) -- completed 2026-04-08

Full details: `.planning/milestones/v5.1-ROADMAP.md`

</details>

### v5.2 Personnel Data Normalization & Card UX (In Progress)

**Milestone Goal:** Clean up personnel data inconsistencies across 14 exhibits and improve mobile card rendering for edge cases (group entries, anonymized personnel, field misplacement).

- [x] **Phase 28: Personnel Data Cleanup** - Correct misplaced fields, normalize Exhibit L schema, add entryType markers to all personnel entries (completed 2026-04-08)
- [ ] **Phase 29: Personnel Card UX** - Render entryType distinctions on mobile cards and desktop tables with consistent heading logic

## Phase Details

### Phase 28: Personnel Data Cleanup
**Goal**: All personnel entries across 14 exhibits have correct field placement, consistent schema, and typed entry classification
**Depends on**: Phase 27 (v5.1 card layout provides the rendering foundation)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05
**Success Criteria** (what must be TRUE):
  1. No personnel entry has a title or role stored in the `name` field — names contain person names or are omitted
  2. Exhibit L personnel use the same `name`/`title`/`organization` schema as all other exhibits (no `role`/`involvement` fields)
  3. Every personnel entry across all 14 exhibits has an `entryType` value of `'individual'`, `'group'`, or `'anonymized'`
  4. All 7 group entries are marked `entryType: 'group'` and all anonymized/title-only entries are marked `entryType: 'anonymized'`
  5. TypeScript types compile cleanly with the new optional `entryType` field and all existing tests pass
**Plans:** 2/2 plans complete
Plans:
- [x] 28-01-PLAN.md — Add entryType to PersonnelEntry type and normalize Exhibit L schema
- [x] 28-02-PLAN.md — Fix title-as-name entries and add entryType markers to all personnel

### Phase 29: Personnel Card UX
**Goal**: Mobile cards and desktop tables visually distinguish individual, group, and anonymized personnel with consistent heading logic
**Depends on**: Phase 28 (entryType markers must exist in data before rendering can use them)
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04
**Success Criteria** (what must be TRUE):
  1. Group personnel entries render as compact/muted cards with reduced visual prominence compared to individual entries
  2. Anonymized personnel entries render with visible distinction (italic or muted treatment) on mobile cards
  3. Card headings display the best available field (name if present, then title, then role) consistently across all variants
  4. Desktop table rows reflect entryType distinctions — muted rows for group entries, italic for anonymized entries
**Plans:** 1 plan
Plans:
- [ ] 29-01-PLAN.md — Template entryType class bindings, heading cascade, and CSS for all entry variants

## Progress

**Execution Order:** Phase 28 then Phase 29.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 28. Personnel Data Cleanup | 2/2 | Complete    | 2026-04-08 |
| 29. Personnel Card UX | 0/1 | Not started | - |
