---
phase: 17-personnel-data-extraction
plan: 02
subsystem: database
tags: [typescript, data-extraction, personnel, exhibits, exhibit-a]

# Dependency graph
requires:
  - phase: 17-01
    provides: ExhibitPersonnelEntry interface and personnel arrays for 13 exhibits (B-N)
provides:
  - Complete personnel[] array on Exhibit A (12 entries from table + prose)
  - Clean ExhibitPersonnelEntry interface (duplicate removed)
  - All 14 exhibits fully populated with personnel data
affects: [rendering components, Phase 18 PersonnelCard]

# Tech tracking
tech-stack:
  added: []
  patterns: [prose personnel extraction, anonymous entry pattern for unnamed roles]

key-files:
  created: []
  modified:
    - src/data/exhibits.ts

key-decisions:
  - "Prose-derived anonymous entries included for 5 substantive roles: Program Manager, Co-Investigator, 2 Curriculum Developers, Training Analyst Specialist"
  - "Duplicate ExhibitPersonnelEntry interface from spike commits removed (Rule 1 - bug fix)"
  - "Duplicate personnel field on Exhibit interface removed (Rule 1 - bug fix)"
  - "Unused 'personnel' from ExhibitSection type union removed (spike artifact cleanup)"

patterns-established:
  - "Prose extraction: unnamed role references mapped to anonymous entries (omit name, use title + organization + role)"

requirements-completed: [DATA-01, DATA-03, DATA-05, DATA-06]

# Metrics
duration: 2min
completed: 2026-04-02
---

# Phase 17 Plan 02: Exhibit A Personnel Extraction Summary

**Complete Exhibit A personnel array (12 entries from table + prose), experimental section removed, spike artifacts cleaned up**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-02T23:48:29Z
- **Completed:** 2026-04-02T23:50:05Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Replaced spike personnel entry ("Jack Sprat") with 12 complete entries
- 7 entries from the personnel table section (Name/Title/Organization columns)
- 5 entries from prose text extraction (anonymous roles: Program Manager, Co-Investigator, 2 Curriculum Developers, Training Analyst Specialist)
- Dan Novak entry has isSelf: true
- Removed experimental "Personnel (new mode)" timeline section per D-04
- Cleaned up duplicate ExhibitPersonnelEntry interface and duplicate personnel field from spike commits
- Removed unused 'personnel' from ExhibitSection type union
- All 71 DATA tests pass, full suite of 120 tests green

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace Exhibit A personnel and remove experimental section** - `deab980` (feat)

## Files Created/Modified
- `src/data/exhibits.ts` - Exhibit A personnel array replaced (12 entries), experimental section removed, duplicate interface/field cleaned up

## Decisions Made
- Five prose-derived anonymous entries warranted inclusion: Program Manager (coordinated engagement), Co-Investigator (assisted with testing), two Curriculum Developers (collaborated on testing), and Training Analyst Specialist (provided technical data) -- all represent distinct substantive roles mentioned in the prose section
- Senior Vice President mentioned in prose was NOT added as separate entry -- role is contextual (initiated the opportunity) and not a distinct participant in the engagement
- Spike artifacts (duplicate interface, duplicate field, unused type union member) cleaned up as Rule 1 bug fix

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed duplicate ExhibitPersonnelEntry interface from spike commits**
- **Found during:** Task 1
- **Issue:** Two ExhibitPersonnelEntry interfaces existed: old spike version (required name/role/body) and correct Plan 01 version (all optional). The old version caused TypeScript compilation errors for all 13 exhibits from Plan 01.
- **Fix:** Removed the old spike interface (lines 26-30), duplicate personnel field on Exhibit interface (line 70), and unused 'personnel' from ExhibitSection type union
- **Files modified:** src/data/exhibits.ts
- **Commit:** deab980

**2. [Rule 1 - Bug] Exhibit A had spike test data instead of expected TODO stub**
- **Found during:** Task 1
- **Issue:** Plan referenced a partial personnel array with `title: 'TODO'` but actual data had a spike entry ("Jack Sprat" with role "pest"). Functionally identical situation -- both need full replacement.
- **Fix:** Replaced spike entry with complete 12-entry personnel array as planned
- **Files modified:** src/data/exhibits.ts
- **Commit:** deab980

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Essential cleanup. No scope creep.

## Issues Encountered
None

## Known Stubs
None -- all personnel data is complete and wired.

## User Setup Required
None

## Next Phase Readiness
- All 14 exhibits (A through N) now have populated personnel[] arrays
- Phase 18 (PersonnelCard Component) can proceed with complete data

---
*Phase: 17-personnel-data-extraction*
*Completed: 2026-04-02*

## Self-Check: PASSED
