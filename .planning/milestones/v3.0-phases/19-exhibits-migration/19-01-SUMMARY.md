---
phase: 19-exhibits-migration
plan: 01
subsystem: data
tags: [json, typescript, data-migration, exhibits, discriminated-unions]

requires:
  - phase: 18-complex-data-migration
    provides: "Established thin loader pattern and src/types/ directory"
provides:
  - "All 15 exhibits externalized to src/data/json/exhibits.json"
  - "Exhibit type definitions in src/types/exhibit.ts"
  - "Thin loader in src/data/exhibits.ts with full type re-exports"
  - "v3.0 Data Externalization milestone complete (all 11 data files externalized)"
affects: []

tech-stack:
  added: []
  patterns: ["JSON data externalization with type assertion for discriminated unions"]

key-files:
  created:
    - src/types/exhibit.ts
    - src/data/json/exhibits.json
  modified:
    - src/types/index.ts
    - src/data/exhibits.ts

key-decisions:
  - "Used eval-based extraction to programmatically convert 1581-line TS to JSON without manual transcription errors"
  - "Type assertion (as Exhibit[]) narrows JSON string fields back to discriminated union literal types"

patterns-established:
  - "Large data file migration: programmatic extraction over manual conversion"

requirements-completed: [EXHB-01, EXHB-02, EXHB-03]

duration: 3min
completed: 2026-04-06
---

# Phase 19 Plan 01: Exhibits Migration Summary

**Migrated 1581-line exhibits.ts (15 exhibits, 8 interfaces, discriminated unions) to JSON + thin TypeScript loader, completing v3.0 Data Externalization**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-06T21:58:38Z
- **Completed:** 2026-04-06T22:02:02Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Extracted all 8 exhibit interfaces/types to src/types/exhibit.ts with barrel re-exports
- Converted 15 exhibits (149KB) from TypeScript to JSON preserving all discriminated union values
- Replaced 1581-line data file with 5-line thin loader
- All 64 unit tests pass, clean production build, zero .vue files modified

## Task Commits

Each task was committed atomically:

1. **Task 1: Create exhibit type definitions and extract data to JSON** - `fd61e0e` (feat)
2. **Task 2: Convert exhibits.ts to thin loader and verify all tests pass** - `d969f2a` (feat)

## Files Created/Modified
- `src/types/exhibit.ts` - All 8 exhibit interfaces/types (ExhibitQuote, ExhibitResolutionRow, ExhibitFlowStep, ExhibitTimelineEntry, ExhibitMetadataItem, ExhibitSection, ExhibitType, Exhibit)
- `src/types/index.ts` - Added barrel re-exports for all exhibit types
- `src/data/json/exhibits.json` - All 15 exhibit data records (149KB, 2578 lines)
- `src/data/exhibits.ts` - Thin loader (5 lines) replacing 1581-line data file

## Decisions Made
- Used programmatic extraction (Node.js eval) to convert TypeScript data to JSON, avoiding manual transcription errors on a 1581-line file
- Type assertion `as Exhibit[]` used to narrow JSON string fields back to discriminated union literal types (exhibitType, section type)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 11 data files are now externalized to JSON (v3.0 Data Externalization milestone complete)
- All consumer components continue to work with unchanged import paths
- Ready for milestone completion

## Self-Check: PASSED

- All 4 files exist on disk
- Both commit hashes verified in git log
- exhibits.ts is 5 lines (thin loader confirmed)
- 64 tests passing, clean build

---
*Phase: 19-exhibits-migration*
*Completed: 2026-04-06*
