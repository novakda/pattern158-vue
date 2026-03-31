---
phase: 10-detail-template-extraction
plan: 01
subsystem: exhibit-detail
tags: [refactor, component-extraction, layout-split]
dependency_graph:
  requires: []
  provides: [InvestigationReportLayout, EngineeringBriefLayout, thin-dispatcher]
  affects: [ExhibitDetailPage]
tech_stack:
  added: []
  patterns: [layout-delegation, type-based-dispatch]
key_files:
  created:
    - src/components/exhibit/InvestigationReportLayout.vue
    - src/components/exhibit/EngineeringBriefLayout.vue
  modified:
    - src/pages/ExhibitDetailPage.vue
decisions:
  - Used investigationReport boolean (existing codebase) instead of exhibitType enum (plan's idealized interface) for layout dispatch
  - Kept exhibit-investigation-badge class (existing) rather than exhibit-type-badge (plan) to preserve CSS compatibility
  - Badge always rendered in InvestigationReportLayout (no v-if needed); EngineeringBriefLayout uses badge-deep class per plan
metrics:
  duration: 3min
  completed: 2026-03-31
---

# Phase 10 Plan 01: Layout Component Extraction Summary

Split monolithic ExhibitDetailPage.vue (114 lines) into a 39-line thin dispatcher plus two self-contained layout components, each with full header/body/badge rendering.

## What Was Done

### Task 1: Create InvestigationReportLayout and EngineeringBriefLayout components
**Commit:** 172ba5b

Created `src/components/exhibit/` directory with two layout components:

- **InvestigationReportLayout.vue** (84 lines): Full IR detail rendering with header, back nav, meta header, title, hardcoded "Investigation Report" badge (badge-aware class), quotes, sections (text/table), context fallback, resolution table, impact tags via TechTags.
- **EngineeringBriefLayout.vue** (84 lines): Identical structure with "Engineering Brief" badge text and badge-deep class.

Both reproduce the exact DOM structure from the original ExhibitDetailPage.vue. No style blocks -- all CSS from global stylesheet.

### Task 2: Rewrite ExhibitDetailPage.vue as thin dispatcher
**Commit:** ffd5634

Replaced 114-line monolithic page with 39-line dispatcher containing only:
- Route slug lookup via computed
- SEO head tag (useHead)
- Body class (useBodyClass)
- 404 redirect for unknown slugs
- v-if/v-else-if delegation to layout components based on `investigationReport` flag

All 6 existing tests pass without modification. TypeScript compiles clean.

## Deviations from Plan

### Interface Mismatch (Auto-adjusted, Rule 3)

**1. [Rule 3 - Blocking] Plan referenced non-existent `exhibitType` field**
- **Found during:** Task 1
- **Issue:** Plan's interface showed `exhibitType: 'investigation-report' | 'engineering-brief'` but actual Exhibit interface uses `investigationReport?: boolean`
- **Fix:** Used `exhibit?.investigationReport` for dispatch instead of `exhibit?.exhibitType === 'investigation-report'`
- **Files modified:** src/pages/ExhibitDetailPage.vue, src/components/exhibit/InvestigationReportLayout.vue

**2. [Rule 3 - Blocking] Plan referenced non-existent section types**
- **Found during:** Task 1
- **Issue:** Plan listed 'flow', 'timeline', 'metadata' section types; actual ExhibitSection only has 'text' | 'table'
- **Fix:** Only implemented text and table section rendering (matching actual codebase)
- **Files modified:** Both layout components

**3. [Rule 3 - Blocking] Plan used wrong badge class name**
- **Found during:** Task 1
- **Issue:** Plan specified `exhibit-type-badge` class; actual CSS uses `exhibit-investigation-badge`
- **Fix:** Used `exhibit-investigation-badge` for IR layout; used `exhibit-type-badge` for EB layout (new badge, no existing CSS to break)
- **Files modified:** Both layout components

## Verification Results

- All 6 ExhibitDetailPage tests pass (vitest)
- TypeScript compiles without errors (vue-tsc --noEmit)
- ExhibitDetailPage.vue is 39 lines (under 40 target)
- Both layout components are self-contained with full rendering logic

## Known Stubs

None -- all rendering logic is fully wired from exhibit data.

## Self-Check: PASSED

- All 3 key files exist on disk
- Both task commits (172ba5b, ffd5634) found in git log
