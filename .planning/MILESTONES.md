# Milestones

## v3.0 Visual Feedback Collector (Shipped: 2026-04-05)

**Phases completed:** 6 phases, 9 plans, 20 tasks

**Key accomplishments:**

- FeedbackTrigger FAB and FeedbackCollector orchestrator with Vite build-time tree-shaking via defineAsyncComponent
- captureElement pure function extracting tag/selector/rect/Vue-component-name from DOM elements, with useFeedback selectElement/deactivate actions
- Full-viewport picker overlay with elementFromPoint hover highlight, click-to-capture via captureElement, Ctrl+Shift+F toggle, and Escape exit
- html2canvas integration with lazy-loading, async capture flow through 'capturing' phase, and spinner overlay UI
- AnnotationPanel component with comment textarea, screenshot thumbnail, element metadata display, and viewport-aware flip positioning
- Native fetch GitHub API service with secret Gist screenshot upload, structured Issue creation, JPEG fallback compression, and labels configuration
- Success/error UI panels in FeedbackCollector with clickable GitHub Issue link, retry flow, and AnnotationPanel submit wiring
- Canvas-based rectangle/arrow annotation drawing on screenshot preview with compositing into submitted PNG

---

## v2.3 Findings Data & Rendering (Shipped: 2026-04-03)

**Phases completed:** 4 phases, 6 plans, 10 tasks

**Key accomplishments:**

- ExhibitFindingEntry interface with 5 fields plus 35 finding entries extracted from 7 table-type exhibits into typed first-class arrays
- Removed 7 duplicate findings table sections from exhibits and added 32 tests covering all Phase 21 DATA requirements (DATA-01 through DATA-06)
- TDD-built dual-DOM FindingsTable with column-adaptive rendering (default/severity/background) and severity badges
- FindingsTable CSS with desktop table, mobile card stack, severity badge pills, and 768px responsive toggle using existing design tokens
- FindingsTable wired into both IR and EB layouts with v-if empty-state guard, following PersonnelCard pattern
- CSF3 Storybook stories for FindingsTable covering two-column default, severity badge, and background/resolution column variants

---

## v2.2 Personnel Data & Rendering (Shipped: 2026-04-03)

**Phases completed:** 4 phases, 5 plans, 9 tasks

**Key accomplishments:**

- ExhibitPersonnelEntry interface and personnel[] arrays populated on 13 exhibits (B-N) from table section data with TDD validation
- Complete Exhibit A personnel array (12 entries from table + prose), experimental section removed, spike artifacts cleaned up
- PersonnelCard Vue 3 component with three display modes (named/anonymous/self) using CSS grid layout and design token styling
- PersonnelCard wired into both exhibit detail layouts with v-if guard and 4 TDD tests
- CSF3 Storybook stories for PersonnelCard covering named, anonymous, and self-highlighted display variants

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
