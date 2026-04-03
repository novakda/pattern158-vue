---
phase: 02-homepage-extraction-pattern
plan: 01
subsystem: ui
tags: [vue, typescript, data-layer, components]

requires: []
provides:
  - Typed data files for stats, specialties, techPills, findings, influences in src/data/
  - TechTags component accepting (Tag | string)[] with internal normalization
  - TestimonialQuote component with optional cite prop for anonymous teasers
  - TechTags.types.ts extracted for plain-tsc compatibility
affects:
  - 02-02 (components needing these data types)
  - Any component importing Tag type

tech-stack:
  added: []
  patterns:
    - "Data file pattern: interface + named const export, 2-space indent, single quotes, semicolons"
    - "Type extraction pattern: shared interface in *.types.ts file (parallel to ExpertiseBadge.types.ts)"
    - "Union prop normalization: computed() maps (Tag | string)[] to Tag[] for backwards-compat widening"

key-files:
  created:
    - src/data/stats.ts
    - src/data/specialties.ts
    - src/data/techPills.ts
    - src/data/findings.ts
    - src/data/influences.ts
    - src/components/TechTags.types.ts
  modified:
    - src/components/TechTags.vue
    - src/components/TestimonialQuote.vue
    - src/data/technologies.ts

key-decisions:
  - "Tag interface extracted to TechTags.types.ts so plain tsc can resolve it; TechTags.vue re-exports Tag for vue-tsc backward compat"
  - "Influence data uses InfluenceSegment[] (text + optional link) to model mixed inline-link content in a type-safe way"
  - "findings[1] intentionally has no link property — Legacy CMS Rescue has no exhibit page"

requirements-completed: [COMP-02]

duration: 5min
completed: 2026-03-16
---

# Phase 02 Plan 01: Data Layer and Component Contracts Summary

**Five typed data files (stats, specialties, techPills, findings, influences) plus TechTags union-type widening and TestimonialQuote optional cite — all backing the seven HomePage extraction components in Plan 02**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-16T23:32:53Z
- **Completed:** 2026-03-16T23:37:11Z
- **Tasks:** 2
- **Files modified:** 9 (6 created, 3 modified)

## Accomplishments

- Five typed data files in `src/data/` with correct TypeScript interfaces, named exports only, literal Unicode characters, and no `.html` path extensions
- `TechTags.vue` extended to accept `(Tag | string)[]` via `normalizedTags` computed — strings are auto-normalized to `{ label, title }` objects
- `TestimonialQuote.vue` `cite` made optional with `v-if="cite"` conditional footer — enables anonymous testimonial teasers on HomePage
- Pre-existing `tsc` TS2614 error fixed by extracting `Tag` to `TechTags.types.ts` (follows `ExpertiseBadge.types.ts` pattern)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create five typed data files in src/data/** - `91eacb5` (feat)
2. **Task 2: Extend TechTags for string[] and make TestimonialQuote cite optional** - `cc0c82c` (feat)

## Files Created/Modified

- `src/data/stats.ts` - Stat interface + stats array (4 career metrics)
- `src/data/specialties.ts` - Specialty interface + specialties array (4 entries)
- `src/data/techPills.ts` - techPills string[] (8 hero pills)
- `src/data/findings.ts` - Finding interface + findings array (3 NTSB-style projects, Finding 2 has no link)
- `src/data/influences.ts` - Influence/InfluenceLink/InfluenceSegment interfaces + influences array (5 entries with mixed inline links)
- `src/components/TechTags.types.ts` - Extracted Tag interface (auto-fix for plain tsc compatibility)
- `src/components/TechTags.vue` - Extended props to (Tag | string)[], normalizedTags computed, Tag re-exported
- `src/components/TestimonialQuote.vue` - cite made optional, footer wrapped in v-if="cite"
- `src/data/technologies.ts` - Updated Tag import path from .vue to .types (auto-fix)

## Decisions Made

- `Tag` interface extracted to `TechTags.types.ts` instead of staying only in `TechTags.vue` — fixes pre-existing plain tsc TS2614 error (vue-tsc already worked); `TechTags.vue` re-exports `Tag` so existing `import type { Tag } from '@/components/TechTags.vue'` still works under vue-tsc
- `Influence` data modeled with `InfluenceSegment[]` (text + optional InfluenceLink) to type-safely represent mixed inline-link descriptions without HTML concatenation
- `findings[1]` (Legacy CMS Rescue) has no `link` property — confirmed from source that no exhibit page exists for this entry

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing tsc TS2614 error preventing plan acceptance criteria from passing**
- **Found during:** Task 1 (verification step after creating data files)
- **Issue:** `src/data/technologies.ts` imported `Tag` from `@/components/TechTags.vue`. Plain `tsc --noEmit` emits TS2614 because the generic `declare module '*.vue'` in `env.d.ts` only exposes a default export, not named exports. This pre-existed before any task changes. `vue-tsc --noEmit` passed correctly — only plain tsc was broken.
- **Fix:** Created `src/components/TechTags.types.ts` with the `Tag` interface (following `ExpertiseBadge.types.ts` pattern). Updated `technologies.ts` import to `@/components/TechTags.types`. Updated `TechTags.vue` to import `Tag` from the types file and re-export it for backward compatibility.
- **Files modified:** `src/components/TechTags.types.ts` (created), `src/data/technologies.ts` (import path), `src/components/TechTags.vue` (import + re-export)
- **Verification:** `npx tsc --noEmit` exits 0, `npx vue-tsc --noEmit` exits 0
- **Committed in:** `91eacb5` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — pre-existing bug)
**Impact on plan:** Auto-fix necessary for plan acceptance criteria. Established the *.types.ts extraction pattern as the correct approach for shared types from .vue files.

## Issues Encountered

None beyond the pre-existing tsc error documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All five data files ready for immediate import by Plan 02 HomePage components
- `TechTags` now accepts `string[]` — `FindingCard` tags (plain strings) can use TechTags directly
- `TestimonialQuote` cite-optional — `TestimonialsTeaser` component can render anonymous quotes
- `npx tsc --noEmit` and `npx vue-tsc --noEmit` both pass — Plan 02 components can add imports without inheriting errors

---
*Phase: 02-homepage-extraction-pattern*
*Completed: 2026-03-16*
