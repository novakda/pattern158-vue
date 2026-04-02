---
phase: 09-data-model-migration
plan: 03
subsystem: database
tags: [typescript, data-cleanup, exhibit-type, portfolio-page, flagship-card]

# Dependency graph
requires:
  - phase: 09-01
    provides: Exhibit interface with ExhibitType discriminant, isFlagship, summary, emailCount, role fields
  - phase: 09-02
    provides: Consumer components updated to use exhibitType instead of boolean flags
provides:
  - portfolioFlagships.ts deleted (consumers migrated to exhibits.ts)
  - portfolioNarratives.ts deleted (narrative data inlined in PortfolioPage)
  - FlagshipCard accepts Exhibit type with correct field mappings
  - PortfolioPage sources flagship data from exhibits.filter(e => e.isFlagship)
affects: [11-listing-page, 13-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns: [inline small doomed data instead of creating new files]

key-files:
  created: []
  modified:
    - src/components/FlagshipCard.vue
    - src/components/FlagshipCard.stories.ts
    - src/components/NarrativeCard.vue
    - src/pages/PortfolioPage.vue
    - src/data/exhibits.ts

key-decisions:
  - "Narrative data (3 objects) inlined in PortfolioPage rather than creating a new file -- content is removed entirely in Phase 11 (CLN-01)"
  - "FlagshipCard.stories.ts updated to use Exhibit-shaped data (Rule 3 blocking fix -- type errors prevented compilation)"

patterns-established:
  - "Inline small doomed data: when data has a known removal date and only one consumer, inline rather than create new files"

requirements-completed: [DATA-04]

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 09 Plan 03: Legacy Data File Deletion Summary

**Deleted portfolioFlagships.ts and portfolioNarratives.ts; FlagshipCard/NarrativeCard/PortfolioPage rewired to exhibits.ts as single source of truth**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-30T21:31:38Z
- **Completed:** 2026-03-30T21:33:48Z
- **Tasks:** 1
- **Files modified:** 7 (5 modified, 2 deleted)

## Accomplishments
- Deleted `portfolioFlagships.ts` (15 flagship records, now redundant after Plan 01 merge)
- Deleted `portfolioNarratives.ts` (3 narrative records, inlined in PortfolioPage)
- Updated FlagshipCard.vue to accept `Exhibit` type with field mappings: `dates->date`, `tags->impactTags`, `quote->quotes[0]`
- Updated NarrativeCard.vue with inlined type definition (no external import)
- Updated PortfolioPage.vue to source flagships via `exhibits.filter(e => e.isFlagship)`
- Zero grep hits for deleted file references across entire `src/` directory

## Task Commits

Each task was committed atomically:

1. **Task 1: Update PortfolioPage consumers and delete data files** - `3e299e2` (feat)

## Files Created/Modified
- `src/data/portfolioFlagships.ts` - DELETED (15 flagship records migrated to exhibits.ts in Plan 01)
- `src/data/portfolioNarratives.ts` - DELETED (3 narrative records inlined in PortfolioPage)
- `src/components/FlagshipCard.vue` - Updated: imports Exhibit type, uses date/impactTags/quotes fields
- `src/components/FlagshipCard.stories.ts` - Updated: all 3 stories use Exhibit-shaped mock data
- `src/components/NarrativeCard.vue` - Updated: inlined Narrative type definition
- `src/pages/PortfolioPage.vue` - Updated: imports exhibits, filters by isFlagship, inlines narrative data
- `src/data/exhibits.ts` - Updated: cleaned provenance comment

## Decisions Made
- Narrative data (3 small objects) inlined in PortfolioPage rather than creating a new file -- PortfolioPage is the only consumer and the content is removed entirely in Phase 11 (CLN-01)
- FlagshipCard.stories.ts updated as part of consumer migration (not in original plan but required for compilation)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated FlagshipCard.stories.ts to use Exhibit type**
- **Found during:** Task 1, Step 5 (verification)
- **Issue:** FlagshipCard.stories.ts used old Flagship-shaped data (dates, tags, quote) causing 3 TypeScript errors
- **Fix:** Updated all 3 story args to use Exhibit-shaped data with label, exhibitType, date, impactTags, quotes fields
- **Files modified:** src/components/FlagshipCard.stories.ts
- **Verification:** `npx vue-tsc --noEmit` exits 0
- **Committed in:** 3e299e2 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for compilation. No scope creep.

## Known Stubs

None -- all data is real content, narrative data copied verbatim from portfolioNarratives.ts.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 09 (data-model-migration) is now complete: all 3 plans executed
- exhibits.ts is the single source of truth for all exhibit data
- FlagshipCard, NarrativeCard, and PortfolioPage are wired to exhibits.ts
- Ready for Phase 10 (detail-template-extraction) and Phase 11 (listing-page)

---
*Phase: 09-data-model-migration*
*Completed: 2026-03-30*
