# Milestones

## v5.0 Findings Schema Unification (Shipped: 2026-04-08)

**Phases completed:** 4 phases, 4 plans

**Key accomplishments:**

- FindingEntry type unified with 6 optional fields (outcome, category added; background removed)
- 4 exhibits backfilled with NTSB-style diagnostic findings (D, F, H, K) — user-approved content
- All 45 findings enriched with category taxonomy; severity on 6 diagnostic exhibits; resolution on 4
- Layout rendering updated: unified 2-column table, severity/category pills, resolution/outcome text
- Established findings standard: NTSB-style diagnostic discoveries only, not outcomes or observations

---

## v4.0 Exhibit Data Normalization (Shipped: 2026-04-07)

**Phases completed:** 3 phases, 6 plans, 4 tasks

**Key accomplishments:**

- PersonnelEntry type added to Exhibit with 13 exhibits transformed from string[][] table rows to typed personnel arrays
- Both layout components render personnel from typed arrays with field-presence-based variant detection covering all 3 column patterns

---

## v3.0 Data Externalization (Shipped: 2026-04-06)

**Phases completed:** 3 phases, 5 plans, 9 tasks

**Key accomplishments:**

- Centralized src/types/ directory with 6 data interfaces, barrel index, and backward-compatible component type shims
- 5 simple data files migrated to JSON + thin TypeScript loader pattern with zero consumer breakage
- faqItems migrated to JSON with faqCategories preserved as const satisfies in TypeScript for literal type narrowing
- Migrated 1581-line exhibits.ts (15 exhibits, 8 interfaces, discriminated unions) to JSON + thin TypeScript loader, completing v3.0 Data Externalization

---

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
