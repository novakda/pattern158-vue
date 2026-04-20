---
phase: 037-sfc-content-extraction
plan: 01
subsystem: ui
tags: [vue, typescript, content-module, sfc-refactor, pattern-1]

requires:
  - phase: 036
    provides: Existing HomePage.vue with 127-test baseline (v6.0 design system)
provides:
  - src/content/ directory established (first content-module in codebase)
  - src/content/home.ts with 4 typed named exports + 2 interfaces
  - HomePage.vue prose-free template consuming @/content/home imports
  - Pattern 1 reference implementation for Wave 1 parallel plans
affects: [037-02, 037-03, 037-04, 037-05, 037-06, 037-07, phase-38, phase-39]

tech-stack:
  added: []
  patterns:
    - "Pattern 1: Content-module with named typed exports consumed via v-for / interpolation"
    - "Unicode normalization convention: \\u escapes or literal chars, NO HTML entity names in .ts files"

key-files:
  created:
    - src/content/home.ts
  modified:
    - src/pages/HomePage.vue

key-decisions:
  - "Used Unicode escape sequences (\\u2019, \\u2014, \\u2026) for HTML entities so Phase 39 extractors see pure JS string literals"
  - "Named exports only, no default export — makes tree-shaking and static extraction unambiguous"
  - "intro object is untyped (inferred) while heading objects use HomeSectionHeading interface — optional subtitle requires the interface"
  - "Did NOT touch useSeo() arguments — SEO metadata extraction is Phase 38+ per RESEARCH.md §Deferred"

patterns-established:
  - "Pattern 1: Page SFC imports prose from src/content/{page}.ts, binds via {{ expression }} / v-for — establishes the content-module shape every Wave 1 plan will mirror"

requirements-completed: [SFC-01]

duration: 2min
completed: 2026-04-10
---

# Phase 37 Plan 01: HomePage SFC Content Extraction Summary

**HomePage prose moved to src/content/home.ts (4 named exports, 2 interfaces); HomePage.vue now binds all headings, body, and teaser quotes from the typed content module — establishes Pattern 1 reference for Wave 1**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-10T23:29:38Z
- **Completed:** 2026-04-10T23:31:40Z
- **Tasks:** 3
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments

- Created `src/content/` directory (new content-module home for the codebase)
- Shipped `src/content/home.ts` with `intro`, `featuredProjectsHeading`, `fieldReportsHeading`, `teaserQuotes` exports plus `HomeSectionHeading` / `HomeTeaserQuote` interfaces
- Refactored HomePage.vue: zero hardcoded English prose remains, all headings/paragraphs/quotes bound via Vue interpolation
- Verified 127/127 unit tests still green, vue-tsc clean, vite build succeeds — no visual regression
- Established Pattern 1 reference implementation the six other Wave 1 plans will mirror

## Task Commits

1. **Task 1: CI pre-flight + src/content/ directory creation** — no commit (directory creation + documentation, no trackable files; folded into Task 2 commit body)
2. **Task 2: Create src/content/home.ts with typed named exports** — `2684c20` (feat)
3. **Task 3: Refactor HomePage.vue to import from @/content/home** — `4ba1df5` (refactor)

**Plan metadata commit:** (to follow — captures SUMMARY.md + STATE.md + ROADMAP.md)

## Files Created/Modified

- `src/content/home.ts` *(created)* — HomePage prose module with 4 named exports (`intro`, `featuredProjectsHeading`, `fieldReportsHeading`, `teaserQuotes`) and 2 interfaces (`HomeSectionHeading`, `HomeTeaserQuote`)
- `src/pages/HomePage.vue` *(modified)* — removed local `teaserQuotes` const + 6 hardcoded prose strings, added `@/content/home` import, bound headings/body/subtitle via `{{ expression }}`, bound section id via `:id`

## CI Pre-flight Finding

`ls -la .github/workflows/` returned ENOENT — **no CI workflow files exist** in this repository. Therefore the Research §Pitfall 5 concern (`npx playwright install chromium` missing from CI before browser tests run) is **N/A for this project**. When CI is added in a future phase, the workflow author must include `npx playwright install chromium` before any `npm run test:browser` step. Recorded here for future reference; no action needed in Phase 37.

## Decisions Made

- **Unicode escapes over literal characters.** Em-dash encoded as `\u2014`, curly apostrophe as `\u2019`, ellipsis as `\u2026`. Rationale: (1) ASCII-safe source file, (2) Phase 39 static extractor will see pure JS string literals and can decode via standard JS engine, (3) explicit avoidance of HTML entity names (`&#x2014;`, `&mdash;`) which would break a Phase 39 AST walker.
- **`intro` is untyped (inferred); headings are typed.** `HomeSectionHeading` interface needed to allow optional `subtitle?`. The `intro` object has different shape (`heading` + `body`) so a dedicated interface wasn't justified for a single object.
- **Named exports only.** No default export — aligns with Pattern 1 and makes tree-shaking + static extraction unambiguous.
- **Untouched SEO metadata.** `useSeo({ title, description, path })` in HomePage.vue was left hardcoded; Phase 37 scope is body prose only. SEO metadata extraction is a Phase 38+ concern per RESEARCH.md §Deferred.
- **Import placement:** Added `@/content/home` import between composables and `@/data/*` imports for readability (groups content-like imports together).

## Deviations from Plan

None - plan executed exactly as written. Every acceptance-criteria grep matched the expected count on the first attempt, and all three verification gates (unit tests, vue-tsc, vite build) were green without iteration.

## Issues Encountered

None. One write-tool read-before-edit reminder fired during Task 3 because the hook doesn't track that `HomePage.vue` was already loaded via the initial `<files_to_read>` block — the file HAD already been read in this session, the write had already succeeded, and verification grep confirmed the refactor landed cleanly. No functional impact.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Pattern 1 reference is live.** The six other Wave 1 plans (037-02 through 037-07) can now mirror the exact structure of `src/content/home.ts` + `HomePage.vue` for their respective pages.
- **src/content/ directory exists.** Subsequent Wave 1 plans do NOT need to create the directory — they add sibling `.ts` files only.
- **Unicode normalization convention established.** Future plans should follow the same `\u` escape discipline (no HTML entity names in `.ts` files, no `v-html` in templates).
- **Baseline preserved.** 127 unit tests still green — any Wave 1 plan that breaks this count is regressing shared component contracts, not Pattern 1 itself.
- **No blockers.** Phase 37 Wave 1 can proceed in parallel.

## Self-Check: PASSED

- `test -f src/content/home.ts` → FOUND
- `test -f src/pages/HomePage.vue` → FOUND (modified)
- `git log --oneline` contains `2684c20` → FOUND
- `git log --oneline` contains `4ba1df5` → FOUND
- `grep -r "I Reverse-Engineer Chaos" src/` → matches only in `src/content/home.ts` (verified)
- `npm run test:unit` → 127/127 pass
- `npx vue-tsc -b --force` → exit 0
- `npm run build` → exit 0

---
*Phase: 037-sfc-content-extraction*
*Completed: 2026-04-10*
