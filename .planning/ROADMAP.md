# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-06)
- [ ] **v3.0 Data Externalization** — Phases 17-19 (in progress)

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

### v3.0 Data Externalization (In Progress)

**Milestone Goal:** Extract all hardcoded TypeScript data from `src/data/` into JSON files, centralizing type definitions in `src/types/`, to decouple content from code and enable future CMS integration.

- [ ] **Phase 17: Types Infrastructure and Simple Data Migration** - Establish `src/types/` directory and prove the thin loader pattern on 5 simple data files
- [ ] **Phase 18: Complex Data Migration** - Migrate 4 files with nested structures, union types, and `as const` handling
- [ ] **Phase 19: Exhibits Migration** - Migrate the most complex data file (exhibits.ts) with discriminated unions and 9 consumer components

## Phase Details

### Phase 17: Types Infrastructure and Simple Data Migration
**Goal**: Developers can import data and types from a clean, centralized architecture -- types live in `src/types/`, simple data lives in JSON, and all existing imports continue working unchanged
**Depends on**: Phase 16
**Requirements**: TYPE-01, TYPE-02, TYPE-03, SMPL-01, SMPL-02, SMPL-03, SMPL-04, SMPL-05, VALD-01, VALD-02, VALD-03
**Success Criteria** (what must be TRUE):
  1. A `src/types/` directory exists with a barrel `index.ts` exporting all data interfaces, and all 5 simple data files have corresponding type definitions there
  2. Five data files (stats, techPills, specialties, brandElements, methodologySteps) each have a JSON file in `src/data/json/` and a thin TypeScript loader in `src/data/` that re-exports both data and types
  3. All 64+ existing unit tests pass and `vite build` produces a clean production build
  4. Zero `.vue` and zero `.test.ts` files are modified -- all existing component imports resolve without changes
**Plans**: TBD

### Phase 18: Complex Data Migration
**Goal**: Data files with nested objects, optional fields, union types, and `as const` constructs are externalized to JSON while preserving all type safety
**Depends on**: Phase 17
**Requirements**: CPLX-01, CPLX-02, CPLX-03, CPLX-04
**Success Criteria** (what must be TRUE):
  1. Four data files (findings, philosophyInfluences, influences, faq) each have a JSON file in `src/data/json/` and a thin TypeScript loader preserving the import API
  2. `faqCategories` `as const` literal type behavior is preserved (explicit union type in `src/types/` or const array kept in TypeScript, not moved to JSON)
  3. All 64+ unit tests pass and `vite build` succeeds
  4. Zero `.vue` and zero `.test.ts` files are modified
**Plans**: TBD

### Phase 19: Exhibits Migration
**Goal**: The most complex data file (exhibits.ts -- 138KB, 8 interfaces, discriminated unions, 9 consumer components) is externalized to JSON with all type safety preserved
**Depends on**: Phase 18
**Requirements**: EXHB-01, EXHB-02, EXHB-03
**Success Criteria** (what must be TRUE):
  1. `exhibits.json` exists in `src/data/json/` containing all 15 exhibits, and the thin loader in `src/data/exhibits.ts` re-exports typed data and all exhibit interfaces
  2. Discriminated union types (`exhibitType`, `ExhibitSection.type`) are correctly asserted on JSON import -- TypeScript catches type errors if section data mismatches its `type` field
  3. All 9 exhibit consumer components (ExhibitCard, ExhibitDetailPage, both layouts, CaseFilesPage, etc.) render correctly with no code changes
  4. All 64+ unit tests pass, `vite build` succeeds, and all 11 data files are now externalized to JSON
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 17 -> 18 -> 19

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
| 17. Types Infrastructure and Simple Data Migration | v3.0 | 0/0 | Not started | - |
| 18. Complex Data Migration | v3.0 | 0/0 | Not started | - |
| 19. Exhibits Migration | v3.0 | 0/0 | Not started | - |
