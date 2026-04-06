# Milestones

## v2.1 Case Files Bug Fixes (Shipped: 2026-04-06)

**Phases:** 15-16 | **Plans:** 2 | **Requirements:** 6/6 satisfied
**Git range:** `v2.0`..`a19b3ff` | **Timeline:** 2026-04-02 (1 day)

**Key accomplishments:**

- Restored impact tag pill/badge CSS accidentally deleted in Phase 13 cleanup (CSS-01, CSS-02)
- Added timeline (6), metadata (15), and flow (1) section rendering to both layout components (SECT-01/02/03)
- sectionHasContent() guard suppresses empty sections from DOM output (SECT-04)
- TDD approach: 10 new tests written first, all 64 tests passing
- 13 quick-task bug fixes from GitHub issues (#1, #2, #5, #6, #7)

---

## v2.0 Site IA Restructure — Evidence-Based Portfolio (Shipped: 2026-04-02)

**Phases completed:** 6 phases, 10 plans, 18 tasks

**Key accomplishments:**

- Migrated Exhibit data model to explicit `exhibitType` discriminant replacing boolean flags; merged flagship data into single source of truth
- Split ExhibitDetailPage into thin dispatcher + InvestigationReportLayout and EngineeringBriefLayout components
- Built unified CaseFilesPage with type-grouped exhibits (5 IR + 10 EB), stats bar, and 38-project directory
- Atomic route migration: /case-files replaces /portfolio and /testimonials with redirects, NavBar consolidated
- Retired 7 orphaned files and ~390 lines dead CSS from retired pages
- 54 unit tests passing, all 23 requirements satisfied

---

## v1.1 Exhibit Content Consistency (Shipped: 2026-03-19)

**Phases:** 5-8 | **Plans:** 5 | **Requirements:** 7/7 satisfied
**Git range:** `b2cbe4a` → `63a070d`

**Key accomplishments:**

- Produced complete 15-exhibit audit with 45 Playwright screenshots and structured comparison table classifying all formatting variations as intentional, fixable, or content gap
- Normalized `contextHeading` labels on Exhibits M/N to "Investigation Summary" and standardized quote attribution on Exhibit A (STRUCT-01/03)
- Fixed `investigationReport` badge rendering on ExhibitDetailPage — investigation exhibits now display a visible "Investigation Report" badge (STRUCT-02, Phase 6)
- Fixed `ExhibitCard.vue` CTA text inversion via TDD — "View Full Investigation Report" now correctly maps to `investigationReport: true` (STRUCT-02, Phase 8)
- Produced CONT-01 gap decision list and implemented all approved content additions to Exhibits A, C, D, G (CONT-01/02)

---

## v1.0 MVP (Shipped: 2026-03-18)

**Phases completed:** 4 phases, 14 plans, 0 tasks

**Key accomplishments:**

- (none recorded)

---
