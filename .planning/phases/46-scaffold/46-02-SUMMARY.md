---
phase: 46-scaffold
plan: 02
subsystem: infra
tags: [typescript, tsconfig, project-references, composite, vue-tsc, build]

# Dependency graph
requires:
  - phase: 46-scaffold
    provides: "scripts/editorial/ placeholder TS files (Plan 01) — these are the files the new tsconfig project includes"
provides:
  - "tsconfig.editorial.json: composite TS project covering scripts/editorial/**/*.ts"
  - "Root tsconfig.json references[] extended to build editorial alongside scripts"
  - "paths={} in editorial project enforces SCAF-08 'no @/ aliases' at type-check level"
affects: [46-scaffold-plan-03, 46-scaffold-plan-05, 47-capture, 48-routes, 49-convert, 50-write]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Composite TS project per script directory (mirrors v7.0 tsconfig.scripts.json pattern)"
    - "paths={} on script-tier projects enforces strict no-alias imports"

key-files:
  created:
    - tsconfig.editorial.json
  modified:
    - tsconfig.json

key-decisions:
  - "Mirrored tsconfig.scripts.json verbatim with three deltas only (outDir, include, derived from analog) — minimizes drift between sibling script projects"
  - "DOM lib intentionally NOT added to editorial project — deferred to Phase 49 if Turndown's TS types require DOM globals at the type level"
  - "Appended editorial reference after scripts (preserves diff minimalism; references[] is order-insensitive for vue-tsc -b)"

patterns-established:
  - "Pattern: Each script-tier project has its own composite tsconfig with isolated outDir and paths={} for alias-free strictness"
  - "Pattern: Root tsconfig.json acts as a project graph orchestrator via references[] — vue-tsc -b builds the entire graph"

requirements-completed: [SCAF-02, SCAF-03]

# Metrics
duration: 1min 15s
completed: 2026-04-20
---

# Phase 46 Plan 02: tsconfig.editorial.json Composite Project Summary

**Composite TS project tsconfig.editorial.json (mirrors tsconfig.scripts.json with editorial-specific outDir/include) registered in root references[] for vue-tsc -b orchestration**

## Performance

- **Duration:** 1min 15s
- **Started:** 2026-04-20T03:42:04Z
- **Completed:** 2026-04-20T03:43:19Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created `tsconfig.editorial.json` at repo root with composite=true and `include: ["scripts/editorial/**/*.ts"]`
- Registered `./tsconfig.editorial.json` in root `tsconfig.json` references[] alongside the existing scripts entry
- Enforced SCAF-08's "no `@/` aliases" rule at the type-check level via `paths: {}` in the editorial project
- Established the project-graph plumbing that makes SCAF-02 success criterion 2 (`pnpm build` zero-error compile of editorial project) achievable in Plan 05

## Task Commits

Each task was committed atomically:

1. **Task 1: Create tsconfig.editorial.json (SCAF-02)** - `d5fdb8d` (feat)
2. **Task 2: Add tsconfig.editorial.json to root tsconfig.json references (SCAF-03)** - `fc4f813` (feat)

## Files Created/Modified
- `tsconfig.editorial.json` (created) - Composite TS project for `scripts/editorial/`. Mirrors `tsconfig.scripts.json` shape with three deltas: `outDir` is `.tsbuildinfo-editorial`, `include` is `["scripts/editorial/**/*.ts"]`, and (implicitly) markdown-export glob removed.
- `tsconfig.json` (modified) - Appended `{ "path": "./tsconfig.editorial.json" }` to `references[]`. No other field touched.

## Deltas vs. tsconfig.scripts.json Analog

The editorial config is a verbatim mirror of the scripts config with exactly three intentional deltas:

| Field | scripts (analog) | editorial (this plan) |
|-------|------------------|------------------------|
| `compilerOptions.outDir` | `.tsbuildinfo-scripts` | `.tsbuildinfo-editorial` |
| `include` | `["scripts/markdown-export/**/*.ts"]` | `["scripts/editorial/**/*.ts"]` |
| (target directory) | scripts/markdown-export/ | scripts/editorial/ |

Everything else identical: `target: ES2022`, `module: NodeNext`, `moduleResolution: NodeNext`, `strict: true`, `composite: true`, `declaration: true`, `emitDeclarationOnly: true`, `rootDir: "."`, `isolatedModules: true`, `esModuleInterop: true`, `resolveJsonModule: true`, `skipLibCheck: true`, `lib: ["ES2022"]`, `types: ["node"]`, `paths: {}`, `baseUrl: "."`.

## Project Graph State After This Plan

```
root tsconfig.json (noEmit; src/**/*, env.d.ts)
  references:
    -> tsconfig.scripts.json    (composite; scripts/markdown-export/**/*.ts)
    -> tsconfig.editorial.json  (composite; scripts/editorial/**/*.ts)   <-- NEW
```

`pnpm build` (which runs `vue-tsc -b`) will now traverse all three projects. End-to-end compile is NOT verified in this plan because Plan 03 has not yet installed editorial devDeps (turndown, etc.) — Plan 05 runs the full build verification once Wave 1 completes.

## Why DOM Lib Is NOT Added Yet

`tsconfig.editorial.json` declares `lib: ["ES2022"]` only — no `"DOM"` entry. Rationale:

- The Phase 46 scaffold + the convert.ts implementation in Phase 49 may require DOM globals (Turndown's TS signatures historically reference `Node`, `HTMLElement`, etc.).
- However, decisions about lib additions should land with the code that needs them. Adding DOM speculatively now would: (a) violate "minimal scaffold" intent, and (b) hide the actual Phase 49 forcing function when it arises.
- Phase 49's plan author will inspect `@types/turndown` after install and add `"DOM"` to `lib` if and only if the TS types fail to resolve without it.
- This deferral is documented in the plan's Task 1 action notes, so the Phase 49 author has the breadcrumb.

## Decisions Made
- Verbatim mirror of `tsconfig.scripts.json` shape with only three deltas — keeps sibling script projects in lockstep and minimizes drift surface
- `paths: {}` retained from analog as the type-checker enforcement of SCAF-08's no-alias rule (defense in depth alongside ESLint, if added later)
- DOM lib deferred to Phase 49 (see "Why DOM Lib Is NOT Added Yet" above)
- Appended editorial reference (vs. prepending) — references[] ordering is not load-bearing for vue-tsc -b, so append minimizes diff

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The editorial composite project is registered in the build graph, so Plan 03's devDep installation + Plan 05's `pnpm build` end-to-end verification can proceed.
- Plan 04 (Vitest project include extension) is independent of this plan's files (different config file: `vitest.config.ts`).
- No blockers.

## Self-Check: PASSED

- FOUND: `/home/xhiris/projects/pattern158-vue/tsconfig.editorial.json`
- FOUND: commit `d5fdb8d` (Task 1)
- FOUND: commit `fc4f813` (Task 2)
- VERIFIED: `tsconfig.json` references[] contains both `./tsconfig.scripts.json` and `./tsconfig.editorial.json`
- VERIFIED: `tsconfig.editorial.json` has composite=true, outDir=.tsbuildinfo-editorial, paths={}, include=["scripts/editorial/**/*.ts"], lib=["ES2022"] (no DOM), module=NodeNext, types=["node"]

---
*Phase: 46-scaffold*
*Completed: 2026-04-20*
