---
phase: 17-personnel-data-extraction
plan: 01
subsystem: database
tags: [typescript, data-extraction, personnel, exhibits, tdd]

# Dependency graph
requires:
  - phase: 16-section-type-rendering
    provides: Complete exhibit data model with section types
provides:
  - ExhibitPersonnelEntry interface on Exhibit data model
  - personnel[] arrays on 13 exhibits (B through N)
  - Test coverage for DATA-01 through DATA-06
affects: [17-02 (Exhibit A personnel), rendering components]

# Tech tracking
tech-stack:
  added: []
  patterns: [personnel extraction from table sections, em-dash name parsing, anonymous entry pattern]

key-files:
  created: []
  modified:
    - src/data/exhibits.ts
    - src/data/exhibits.test.ts

key-decisions:
  - "ExhibitPersonnelEntry interface added with all optional fields (name, title, organization, role, isSelf)"
  - "Exhibit J Investigation Lead mapped as anonymous entry (omit name field) per RNDR-02 downstream rendering"
  - "Exhibit L em-dash parsing separates name from title; anonymized entries use title-only"
  - "Parenthetical annotations preserved verbatim (e.g., 'subject of both cascades', 'BP Account')"
  - "Table row order preserved in personnel arrays"

patterns-established:
  - "Personnel extraction: read table rows, map to ExhibitPersonnelEntry by column structure pattern"
  - "Anonymous entries: omit name field, put descriptor in title field"

requirements-completed: [DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06]

# Metrics
duration: 4min
completed: 2026-04-02
---

# Phase 17 Plan 01: Personnel Data Extraction Summary

**ExhibitPersonnelEntry interface and personnel[] arrays populated on 13 exhibits (B-N) from table section data with TDD validation**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-02T23:40:22Z
- **Completed:** 2026-04-02T23:44:43Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added ExhibitPersonnelEntry interface and Exhibit.personnel field to data model
- Populated personnel[] arrays on all 13 exhibits B through N from their table section data
- Three column patterns handled: Name/Title/Org (10 exhibits), Name/Title/Role (2 exhibits), Role/Involvement with em-dash parsing (1 exhibit)
- 42 new tests covering DATA-01 through DATA-06; 69 of 71 pass (2 Exhibit A tests deferred to Plan 02)
- Dan Novak entries marked isSelf: true across all 13 exhibits

## Task Commits

Each task was committed atomically:

1. **Task 1: Write personnel data validation tests (TDD RED)** - `a23299d` (test)
2. **Task 2: Populate personnel arrays for exhibits B through N (TDD GREEN)** - `78930f5` (feat)

## Files Created/Modified
- `src/data/exhibits.ts` - Added ExhibitPersonnelEntry interface, Exhibit.personnel field, and 13 personnel arrays
- `src/data/exhibits.test.ts` - Added 42 tests covering all 6 DATA requirements

## Decisions Made
- Exhibit J "Investigation Lead" mapped as anonymous (no name field, title: 'Investigation Lead') to support RNDR-02 downstream rendering
- Exhibit L em-dash parsing: "Dan Novak -- Development Lead" split into name + title; entries without em-dash use title-only (anonymous)
- Parenthetical annotations preserved verbatim throughout (e.g., "(subject of both cascades)", "(BP Account)")
- Lengthy title descriptions in Exhibit I preserved verbatim in title field
- Table row order preserved in all personnel arrays

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added ExhibitPersonnelEntry interface and personnel field to Exhibit**
- **Found during:** Task 1 (test writing)
- **Issue:** Plan assumed ExhibitPersonnelEntry interface and Exhibit.personnel field already existed in exhibits.ts, but they did not
- **Fix:** Added the interface definition and the optional personnel field to the Exhibit interface
- **Files modified:** src/data/exhibits.ts
- **Verification:** TypeScript compiles clean, tests reference the types correctly
- **Committed in:** a23299d (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for plan execution. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Exhibit A personnel extraction ready for Plan 02 (special handling: prose extraction, existing partial personnel replacement, experimental section removal)
- 2 test failures (Exhibit A DATA-01 and DATA-05) will be resolved by Plan 02

---
*Phase: 17-personnel-data-extraction*
*Completed: 2026-04-02*
