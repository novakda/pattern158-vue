# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- 🚧 **v2.1 Case Files Bug Fixes** — Phases 15-16 (in progress)

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

### v2.1 Case Files Bug Fixes (In Progress)

**Milestone Goal:** Fix CSS deletion and unhandled section type rendering bugs from the v2.0 migration.

- [x] **Phase 15: Impact Tag Style Restoration** - Restore deleted `.impact-tag` / `.impact-tags` base CSS styles (completed 2026-04-02)
- [x] **Phase 16: Section Type Rendering** - Add rendering for unhandled section types and hide empty sections (completed 2026-04-02)

## Phase Details

### Phase 15: Impact Tag Style Restoration
**Goal**: Impact tags display with their intended pill/badge styling on all pages
**Depends on**: Nothing (independent CSS fix)
**Requirements**: CSS-01, CSS-02
**Success Criteria** (what must be TRUE):
  1. Impact tags on the Case Files listing page render as styled pills with background color, border-radius, and padding
  2. Impact tags on exhibit detail pages render with the same pill styling
  3. Impact tag containers use flexbox wrap layout so tags flow naturally with consistent gap spacing
**Plans**: 1 plan
Plans:
- [x] 15-01-PLAN.md — Restore base .impact-tag/.impact-tags CSS and verify visual rendering
**UI hint**: yes

### Phase 16: Section Type Rendering
**Goal**: All exhibit section types render their content; sections with no content are hidden
**Depends on**: Phase 15
**Requirements**: SECT-01, SECT-02, SECT-03, SECT-04
**Success Criteria** (what must be TRUE):
  1. Timeline sections (6 occurrences across exhibits) render entries showing dates and descriptions
  2. Metadata sections (15 occurrences across exhibits) render key-value items in a structured layout
  3. The single flow section renders its step content visibly
  4. Sections that have no renderable content produce no DOM output (no orphaned headings or empty containers)
**Plans**: 1 plan
Plans:
- [x] 16-01-PLAN.md — Add timeline, metadata, flow rendering and empty section guard
**UI hint**: yes

## Progress

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
| 15. Impact Tag Style Restoration | v2.1 | 1/1 | Complete    | 2026-04-02 |
| 16. Section Type Rendering | v2.1 | 1/1 | Complete    | 2026-04-02 |
| 21. Type Definition & Data Extraction | v2.2 | 2/2 | Complete    | 2026-04-03 |
