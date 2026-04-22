---
phase: 47-config-routes-pure-logic
plan: 01
subsystem: editorial-capture
tags: [typescript, interfaces, contracts, nodenext, scaf-08, phase-47]

# Dependency graph
requires:
  - phase: 46-scaffold
    provides: "interface stubs in scripts/editorial/{config,routes,types}.ts; SCAF-08 descriptive banner convention; smoke.test.ts contract importing 4 type names from types.ts"
provides:
  - "Final EditorialConfig shape (5 readonly fields incl. exhibitsJsonPath)"
  - "Final Route shape (path, label, category union, optional sourceSlug)"
  - "ConfigError class re-exported as runtime value from types.ts (instanceof-checkable across module boundary)"
  - "tsconfig.editorial.json gains allowImportingTsExtensions to permit runtime .ts re-exports under NodeNext (paired with pre-existing emitDeclarationOnly)"
affects: [47-02-config-impl, 47-03-routes-impl, 47-04-config-tests, 47-05-routes-tests, 47-06-smoke-gate, 48-capture, 50-orchestration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Runtime re-export of class symbols via plain export (not export type) for instanceof checks"
    - "ConfigError pattern: typed Error subclass with optional unknown cause for typed error boundary in index.ts"
    - "Throwing-stub continuation: interface shape locked, body throws 'not implemented until Plan 47-NN' to keep smoke tests compiling while downstream plans land bodies"

key-files:
  created: []
  modified:
    - "scripts/editorial/config.ts (EditorialConfig +exhibitsJsonPath, +ConfigError class)"
    - "scripts/editorial/routes.ts (Route +category union, +sourceSlug?)"
    - "scripts/editorial/types.ts (+runtime re-export of ConfigError)"
    - "tsconfig.editorial.json (+allowImportingTsExtensions for runtime .ts re-export)"

key-decisions:
  - "ConfigError re-exported as plain export (not export type) so downstream code can use err instanceof ConfigError at runtime"
  - "Added allowImportingTsExtensions to tsconfig.editorial.json — required because the new runtime .ts re-export survives emit (type-only re-exports were exempt under TS NodeNext); emitDeclarationOnly already satisfies the flag's prerequisite"
  - "Kept throwing-stub bodies for loadEditorialConfig() and buildRoutes() per plan — bodies land in Plans 47-02 and 47-03 respectively"
  - "Preserved SCAF-08 descriptive banner verbatim in all three modified .ts files (literal forbidden tokens deliberately absent so the grep gate stays clean)"

patterns-established:
  - "Runtime class re-export via index/types module: types.ts now uses export type {...} for type-only symbols and bare export {...} for class symbols"
  - "tsconfig.editorial.json policy: allowImportingTsExtensions + emitDeclarationOnly enables .ts-suffixed imports across all editorial modules without breaking emit"

requirements-completed: [CAPT-01, WRIT-01]

# Metrics
duration: 4min
completed: 2026-04-20
---

# Phase 47 Plan 01: Lock Config + Route Interface Contracts Summary

**Locked the final EditorialConfig (5 readonly fields incl. exhibitsJsonPath), Route (path, label, category union, optional sourceSlug), and ConfigError shapes; types.ts now runtime-re-exports ConfigError so index.ts can use instanceof at the error boundary in Phase 50.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-20T16:52:01Z
- **Completed:** 2026-04-20T16:56:01Z
- **Tasks:** 2
- **Files modified:** 4 (3 source + 1 tsconfig — see Deviations)

## Accomplishments

- `EditorialConfig` finalized with `exhibitsJsonPath` field (was 4 fields, now 5) — locks the contract Plan 47-02's loader will populate
- `Route` finalized with `category: 'static' | 'exhibit'` union and optional `sourceSlug` — locks the contract Plan 47-03's builder will populate (sourceSlug only on exhibit routes, sourced from exhibits.json's `slug` field, e.g. `exhibit-a`)
- `ConfigError` class added to config.ts and re-exported from types.ts as a runtime value (not type-only), enabling `err instanceof ConfigError` checks at the index.ts error boundary in Phase 50
- Phase 46 smoke test (`scripts/editorial/__tests__/smoke.test.ts`) still passes — its 4-name import surface (`EditorialConfig`, `Route`, `CapturedPage`, `ConvertedPage` from `../types.ts`) preserved verbatim
- SCAF-08 descriptive banner preserved verbatim in all three edited source files; SCAF-08 grep gate clean

## Task Commits

1. **Task 1: Extend EditorialConfig and add ConfigError in config.ts (WRIT-01)** — `1a01ef7` (feat)
2. **Task 2: Extend Route interface in routes.ts + re-export ConfigError from types.ts (CAPT-01)** — `16d8882` (feat)

_Note: Task 2 commit also includes the tsconfig.editorial.json fix described under Deviations Rule 3._

## Files Created/Modified

- `scripts/editorial/config.ts` — Added `exhibitsJsonPath: string` to `EditorialConfig` (now 5 readonly fields); added `ConfigError extends Error` class with optional `cause: unknown`; preserved throwing stub for `loadEditorialConfig()` (body lands in Plan 47-02)
- `scripts/editorial/routes.ts` — Added `category: 'static' | 'exhibit'` and optional `sourceSlug?: string` to `Route`; preserved throwing stub for `buildRoutes()` (body lands in Plan 47-03)
- `scripts/editorial/types.ts` — Added `export { ConfigError } from './config.ts'` as a runtime re-export (separate from the four pre-existing `export type {...}` lines, which are type-only); banner preserved
- `tsconfig.editorial.json` — Added `"allowImportingTsExtensions": true` (Deviation Rule 3 — see below)

## Decisions Made

- **ConfigError as runtime re-export (not `export type`):** Required so downstream code (index.ts in Phase 50) can use `err instanceof ConfigError` to distinguish config errors (exit 2) from runtime errors (exit 1) per CONTEXT.md preflight failure-mode decision.
- **Throwing-stub continuation kept intact:** Per plan, the function bodies stay as throwing stubs in this plan so the smoke test still compiles. Plans 47-02 (config) and 47-03 (routes) replace the bodies.
- **`cause` field on ConfigError:** Declared as `public readonly cause?: unknown` on the class (rather than passing through to `Error`'s standard `cause` option) — the plan's interface spec explicitly names `cause` as a class field accessible via `instanceof ConfigError && err.cause`. This avoids relying on the platform's ES2022 `Error.cause` runtime semantics across Node versions and keeps the field fully under our control.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `allowImportingTsExtensions` to `tsconfig.editorial.json`**

- **Found during:** Task 2 (re-exporting `ConfigError` as runtime value from `types.ts`)
- **Issue:** First `pnpm build` after Task 2 failed with `error TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled.` at `scripts/editorial/types.ts(17,29)` on the new line `export { ConfigError } from './config.ts'`. The four pre-existing `export type { ... } from './X.ts'` lines compiled fine because TypeScript erases type-only re-exports before the extension check. The new runtime re-export survives to emit and triggers the rule under NodeNext module resolution.
- **Fix:** Added `"allowImportingTsExtensions": true` to `tsconfig.editorial.json`. The flag's prerequisite (`noEmit` OR `emitDeclarationOnly`) is already satisfied by the existing `"emitDeclarationOnly": true`, so no additional config changes were needed. This is a one-line addition consistent with the Phase 46 / CONTEXT.md decision that "relative imports only, with `.ts` extensions per NodeNext" — Phase 46 didn't need the flag because there were no runtime cross-file imports yet inside `scripts/editorial/`; Plan 47-01 introduces the first one.
- **Files modified:** `tsconfig.editorial.json` (one added line)
- **Verification:** `pnpm build` now exits 0 (vue-tsc -b walks all three composite projects clean). `pnpm test:scripts` still passes 16 files / 145 tests. SCAF-08 grep gate remains clean.
- **Committed in:** `16d8882` (Task 2 commit, included with the source changes that motivated the fix)

---

**Total deviations:** 1 auto-fixed (1 Rule 3 - Blocking)
**Impact on plan:** Necessary tsconfig accommodation for the runtime re-export pattern the plan explicitly prescribes. No scope creep — flag is the canonical solution per TypeScript docs (verified via Context7 ctx7 CLI lookup of `/microsoft/typescript`). All other aspects of the plan executed exactly as written.

## Issues Encountered

None beyond the deviation above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Plan 47-02 (config impl)** ready to start: `EditorialConfig` shape locked, `ConfigError` class available to throw from `loadEditorialConfig()`.
- **Plan 47-03 (routes impl)** ready to start: `Route` shape locked with `category` union and optional `sourceSlug`. Note for 47-03 author: per the planner's audit referenced in the parent prompt, the exhibits.json field that anchors `sourceSlug` is named `exhibitLink` (e.g. `/exhibits/exhibit-a`), not `slug` — derive the slug suffix from the link path when populating exhibit routes.
- **Plans 47-04 / 47-05 (tests)** can target the locked interface surfaces (no churn risk).
- **Plan 47-06 (smoke gate)** still has a green smoke test to gate against; the 4-name import surface in `__tests__/smoke.test.ts` is unchanged.
- **Phase 50 orchestration**: `index.ts` can rely on `import { ConfigError } from './types.ts'` and `err instanceof ConfigError` at the error boundary.

## Self-Check: PASSED

Verification:
- `scripts/editorial/config.ts`: present, contains `interface EditorialConfig` with 5 readonly fields, `class ConfigError extends Error`, throwing `loadEditorialConfig()` stub.
- `scripts/editorial/routes.ts`: present, contains `interface Route` with `category: 'static' | 'exhibit'` and `readonly sourceSlug?: string`, throwing `buildRoutes()` stub.
- `scripts/editorial/types.ts`: present, contains four `export type { ... }` lines + one runtime `export { ConfigError } from './config.ts'`.
- `tsconfig.editorial.json`: present, contains `"allowImportingTsExtensions": true`.
- Commits `1a01ef7` and `16d8882` present in `git log --oneline`.
- `pnpm build` exits 0; `pnpm test:scripts` passes 16 files / 145 tests; SCAF-08 grep gate clean across all three modified source files.

---
*Phase: 47-config-routes-pure-logic*
*Completed: 2026-04-20*
