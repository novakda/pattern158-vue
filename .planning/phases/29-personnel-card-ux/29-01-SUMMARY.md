---
phase: 29-personnel-card-ux
plan: 01
subsystem: ui
tags: [vue, css, personnel, entryType, mobile-cards, desktop-tables]

requires:
  - phase: 28-personnel-data-cleanup/02
    provides: "entryType field on all 66 personnel entries (individual/group/anonymized)"
provides:
  - "entryType-driven class bindings on personnel table rows in both layout components"
  - "CSS for group (muted/compact/dashed) and anonymized (italic/muted) card variants on mobile"
  - "Desktop table styles for group and anonymized rows"
  - "Heading fallback cascade: name -> title -> role on personnel cards"
affects: []

tech-stack:
  added: []
  patterns: ["entryType-driven CSS class binding on tr elements", "heading field fallback cascade via template expression", "CSS pseudo-element GROUP label on mobile cards"]

key-files:
  created: []
  modified:
    - src/components/exhibit/InvestigationReportLayout.vue
    - src/components/exhibit/EngineeringBriefLayout.vue
    - src/assets/css/main.css

key-decisions:
  - "Used td:first-child selector instead of td[data-label='Name'] for heading treatment — supports dynamic data-label from heading cascade"
  - "GROUP label via CSS pseudo-element rather than inline span — keeps template clean, styling-only concern"

patterns-established:
  - "entryType class binding pattern: :class on tr drives visual variants without template branching"

requirements-completed: [CARD-01, CARD-02, CARD-03, CARD-04]

duration: 4min
completed: 2026-04-07
---

# Phase 29 Plan 01: Personnel Card UX Summary

**Personnel entryType-driven card variants with group/anonymized styling on mobile cards and desktop tables, heading fallback cascade, dead involvement branch removed**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-08T04:19:34Z
- **Completed:** 2026-04-08T04:23:45Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Removed dead involvement template branch from both layout components (Exhibit L normalized in Phase 28)
- Added entryType class bindings driving group and anonymized visual variants on personnel rows
- Implemented heading fallback cascade (name -> title -> role) with matching dynamic data-label
- Added desktop table styles: muted italic for group rows, italic name/title for anonymized rows
- Added mobile card styles: group cards with 0.7 opacity, dashed border, GROUP label; anonymized cards with italic text and muted heading
- All 95 tests passing, TypeScript compiles clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Update personnel templates with entryType class bindings and heading logic** - `1af9347` (feat)
2. **Task 2: Add CSS for group and anonymized entry variants on mobile cards and desktop tables** - `c8f1a6e` (feat)

## Files Created/Modified
- `src/components/exhibit/InvestigationReportLayout.vue` - entryType class bindings, heading cascade, dead involvement branch removed
- `src/components/exhibit/EngineeringBriefLayout.vue` - identical changes as InvestigationReportLayout
- `src/assets/css/main.css` - Desktop entryType variants, mobile card group/anonymized styles, heading selector update

## Decisions Made
- Used `td:first-child` selector instead of `td[data-label="Name"]` for heading treatment to support the dynamic data-label from the heading cascade (name/title/role fallback)
- GROUP label implemented via CSS pseudo-element on `td:first-child::before` rather than inline template span, keeping the concern purely in CSS

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Worktree branch was behind main and missing Phase 28 changes (entryType data, personnel table sections in layout components). Merged from `gsd/v5.2-personnel-data-normalization-card-ux` branch to get prerequisite Phase 28 commits before executing.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Personnel card UX rendering is complete for all three entry types
- All entryType visual distinctions render correctly on mobile cards and desktop tables
- No blockers

---
*Phase: 29-personnel-card-ux*
*Completed: 2026-04-07*
