---
phase: 037-sfc-content-extraction
plan: 06
subsystem: content-extraction
tags: [sfc, content-extraction, technologies, hero]
requires:
  - src/pages/TechnologiesPage.vue
  - src/data/technologies.ts
provides:
  - src/content/technologies.ts
  - "hero export: { title, subtitle, introParagraph }"
affects:
  - src/pages/TechnologiesPage.vue
tech_stack_added: []
tech_stack_patterns:
  - "Named hero export from src/content/*.ts consumed via :title/:subtitle/text interpolation in SFC"
key_files_created:
  - src/content/technologies.ts
key_files_modified:
  - src/pages/TechnologiesPage.vue
decisions:
  - "Preserved existing `import { technologies } from '@/data/technologies'` alongside new `import { hero } from '@/content/technologies'` — both imports coexist because category data was already data-driven and only hero prose needed extraction"
  - "Used `\\u2014` escape for em-dash in introParagraph for .ts consistency — same codepoint as template literal `—`"
metrics:
  duration_seconds: 106
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 1
  tests_passing: 127
  completed: 2026-04-10
requirements: [SFC-06]
---

# Phase 37 Plan 06: TechnologiesPage Content Extraction Summary

**One-liner:** Extracted 3 hardcoded prose strings (hero title/subtitle/intro) from `TechnologiesPage.vue` into `src/content/technologies.ts`, leaving the data-driven tech-category loop untouched.

## Objective

Make `TechnologiesPage.vue` markdown-exportable by Phase 39 by moving its only hardcoded English prose — the `<HeroMinimal>` title/subtitle props and hero-intro paragraph — into a named `hero` export at `src/content/technologies.ts`. Tech categories and cards were already fully data-driven from `@/data/technologies`, making this the smallest content-module refactor in Phase 37.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Create src/content/technologies.ts | 9c4e6e8 | src/content/technologies.ts (new) |
| 2 | Refactor TechnologiesPage.vue to import from @/content/technologies | 380e1ca | src/pages/TechnologiesPage.vue |

## Implementation Notes

**Task 1 — Content module creation:**
- Created `src/content/technologies.ts` with a single named `hero` export containing three fields: `title`, `subtitle`, `introParagraph`
- Em-dash in `introParagraph` encoded as `\u2014` for .ts file consistency (same Unicode codepoint as the template literal `—`)
- `src/data/technologies.ts` loader and `src/data/json/technologies.json` category data left untouched — the file-name collision is intentional and disambiguated by import path (`@/content/technologies` vs `@/data/technologies`)

**Task 2 — SFC refactor:**
- Added `import { hero } from '@/content/technologies'` on its own line after the existing `import { technologies } from '@/data/technologies'` — both imports now coexist because each plays a distinct role: `hero` is prose, `technologies` is category data for the v-for loop
- `<HeroMinimal title="Technologies" subtitle="...">` → `<HeroMinimal :title="hero.title" :subtitle="hero.subtitle">`
- `<p class="hero-intro">Curated expertise…</p>` → `<p class="hero-intro">{{ hero.introParagraph }}</p>`
- `v-for="category in technologies"` loop, both `!category.historical` and `category.historical` branches, `useBodyClass('page-technologies')`, and `useSeo({...})` all preserved verbatim per plan directives

## Verification Results

- `npx vue-tsc -b --force` → exit 0 (after Task 1 and Task 2)
- `npm run test:unit` → 127/127 passing (11 test files), both after Task 1 and Task 2
- `npm run build` → clean production build after Task 2, `TechnologiesPage-Bkd4PNZ6.js` chunk emitted (23.01 kB)
- `grep -r "Production-proven expertise" src/pages/` → no results (prose fully extracted)
- `ls src/data/technologies.ts` → present (loader untouched)
- All 11 plan grep acceptance criteria satisfied on both tasks

## Decisions Made

1. **Dual-import pattern retained** — Plan explicitly forbade replacing the `@/data/technologies` import, so both `hero` (prose) and `technologies` (category data) imports coexist in the script-setup block. No import reordering; `@/data/technologies` remains the first import since it was there originally.
2. **Em-dash as `\u2014`** — Plan instructions specified escaping the em-dash for .ts file consistency. Both the source (template literal) and the destination (.ts string) resolve to the same U+2014 codepoint at runtime.

## Deviations from Plan

None — plan executed exactly as written. All 11 grep criteria, the two `type="auto"` verifications (`vue-tsc`, `test:unit`, `build`), and the overall verification block (`grep -r`, `ls src/data/technologies.ts`) passed on the first attempt for both tasks.

## Key Changes

**Created (1 file):**
- `src/content/technologies.ts` — Named `hero` export with `{ title, subtitle, introParagraph }` (5 lines)

**Modified (1 file):**
- `src/pages/TechnologiesPage.vue` — Added one import line; template hero block went from 7 lines of hardcoded prose to 3 lines of bound expressions. Tech-category section (lines 22–48 in the final file) untouched.

## Files Touched (absolute paths)

- `/home/xhiris/projects/pattern158-vue/src/content/technologies.ts` (new)
- `/home/xhiris/projects/pattern158-vue/src/pages/TechnologiesPage.vue` (modified)

## Self-Check: PASSED

- FOUND: src/content/technologies.ts
- FOUND: src/pages/TechnologiesPage.vue (modified)
- FOUND: commit 9c4e6e8 (Task 1)
- FOUND: commit 380e1ca (Task 2)
- FOUND: src/data/technologies.ts (untouched, per plan directive)
- Tests: 127/127 passing
- Build: clean
