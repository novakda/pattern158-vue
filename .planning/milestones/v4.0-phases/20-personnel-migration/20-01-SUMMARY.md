---
phase: 20-personnel-migration
plan: 01
subsystem: data
tags: [typescript, json, data-modeling, exhibits, personnel]

requires:
  - phase: 16-section-type-rendering
    provides: "ExhibitSection type with table/text/flow/timeline/metadata types"
provides:
  - "PersonnelEntry interface exported from types barrel and thin loader"
  - "Typed personnel arrays on 13 exhibits in exhibits.json"
  - "Personnel table sections removed from sections arrays"
affects: [20-02-personnel-rendering]

tech-stack:
  added: []
  patterns: ["Union-friendly optional fields for column variant mapping"]

key-files:
  created: []
  modified:
    - src/types/exhibit.ts
    - src/types/index.ts
    - src/data/exhibits.ts
    - src/data/json/exhibits.json

key-decisions:
  - "PersonnelEntry uses all-optional fields to cover 3 column variants without discriminant"
  - "Exhibit A text-type Personnel section left untouched (not a table migration target)"

patterns-established:
  - "Column-variant-to-typed-object mapping: map string[][] rows to typed interfaces based on column headers"

requirements-completed: [PERS-01, PERS-02]

duration: 2min
completed: 2026-04-07
---

# Phase 20 Plan 01: Personnel Data Migration Summary

**PersonnelEntry type added to Exhibit with 13 exhibits transformed from string[][] table rows to typed personnel arrays**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-07T05:29:07Z
- **Completed:** 2026-04-07T05:31:29Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Added PersonnelEntry interface covering all 3 column variants (Name/Title/Org, Name/Title/Role, Role/Involvement)
- Transformed 13 exhibits from generic table sections to typed personnel arrays
- Removed all personnel table sections from sections arrays (zero remaining)
- All 64 existing tests pass, clean production build

## Task Commits

Each task was committed atomically:

1. **Task 1: Add PersonnelEntry type and personnel field to Exhibit** - `f8088f1` (feat)
2. **Task 2: Transform exhibits.json -- add personnel arrays, remove personnel sections** - `442acca` (feat)

## Files Created/Modified
- `src/types/exhibit.ts` - Added PersonnelEntry interface, personnel field on Exhibit
- `src/types/index.ts` - Added PersonnelEntry to type barrel export
- `src/data/exhibits.ts` - Added PersonnelEntry to thin loader import/export
- `src/data/json/exhibits.json` - 13 exhibits gained personnel arrays, personnel table sections removed

## Decisions Made
- PersonnelEntry uses all-optional fields (name?, title?, organization?, role?, involvement?) to cover 3 column variants without needing a discriminant union -- simpler for rendering since components can just check field existence
- Exhibit A has a text-type "Personnel" section (not table-type) which was correctly left untouched -- it is not a data migration target

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Personnel data is typed and available on exhibit objects for Plan 02 (rendering)
- PersonnelEntry exported from all type surfaces (types barrel, thin loader)
- Ready for PersonnelTable component implementation

---
*Phase: 20-personnel-migration*
*Completed: 2026-04-07*
