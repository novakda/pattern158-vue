---
phase: 48-capture-playwright-io
plan: 01
subsystem: editorial-capture
tags: [capture-error, slugify, interstitial-detection, cloudflare, pure-logic, phase-48, scaf-08]

# Dependency graph
requires:
  - phase: 47-config-routes-pure-logic
    provides: EditorialConfig type + Route type, ConfigError runtime re-export pattern
  - phase: 46-editorial-scaffold
    provides: SCAF-08 banner + capture.ts placeholder with CapturedPage interface stub
provides:
  - CaptureError class with `route?: Route` and `cause?: unknown` fields; `name === 'CaptureError'`
  - Extended CapturedPage interface (8 readonly fields; 3 new: consoleErrors, screenshotPath, cfCacheStatus?)
  - slugify(input) pure helper — lowercase, strip leading slash, collapse non-alphanumeric, trim dashes; '/' -> 'home'
  - detectInterstitial({title, bodyBytes, html}) pure classifier — 3 layered CF signals, returns string|null
  - types.ts runtime re-export of CaptureError (symmetrical with ConfigError pattern from Phase 47)
affects: [48-02, 48-03, 48-04, 48-05, 48-06, 49, 50]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Typed runtime error classes with options-bag constructor: `new CaptureError(msg, { route, cause })`"
    - "Pure-classifier pattern: detect* returns string|null; caller wraps non-null in typed error"
    - "Homepage '/' special case in slug pipeline (root maps to 'home', everything else through regex)"

key-files:
  created: []
  modified:
    - scripts/editorial/capture.ts
    - scripts/editorial/types.ts

key-decisions:
  - "CaptureError constructor uses options-bag shape `(message, opts?: { route?, cause? })` — distinct from ConfigError's positional cause but matches CONTEXT.md spec for route-scoped capture errors"
  - "detectInterstitial is a pure classifier that does NOT throw — returns `string | null`. Caller (Plan 48-03) wraps the non-null return in CaptureError. Separation keeps the unit-test surface clean in Plan 48-06."
  - "Signal-check order in detectInterstitial: title (most actionable) -> bodyBytes (cheapest) -> cf-chl-opt (specific) -> challenge-platform (generic). First match wins so the error message names the specific signal."
  - "slugify('/') short-circuits to 'home' BEFORE the regex pipeline. Every other input passes through trim -> lowercase -> strip leading /+ -> replace [^a-z0-9]+ -> collapse -+ -> trim -+."
  - "captureRoutes stays a throwing stub until Plan 48-06 integration — per CONTEXT.md 'Deferred' guidance, no partial Playwright wiring in pure-logic plan."
  - "CaptureError re-exported as `export { CaptureError }` (runtime value), NOT `export type` — mirrors ConfigError precedent from Phase 47 so `err instanceof CaptureError` works at the outermost boundary in Phase 50."

patterns-established:
  - "Dual re-export pattern in types.ts barrel: `export type` for interfaces, `export { Class }` for error classes that need runtime `instanceof` checks"
  - "Multi-signal CF interstitial detection: 3 layered heuristics (title/body-size/DOM markers) with short-circuit return of the tripped signal's reason string"

requirements-completed: [CAPT-11]

# Metrics
duration: 3min
completed: 2026-04-20
---

# Phase 48 Plan 01: Capture Pure-Logic Building Blocks Summary

**CaptureError class, slugify helper, and 3-signal Cloudflare-interstitial classifier land in capture.ts; types.ts barrel re-exports CaptureError as a runtime value so downstream Plans 48-02..06 can share the error surface.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-20T18:49:00Z (approx.)
- **Completed:** 2026-04-20T18:52:19Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- **CaptureError** class exported from `capture.ts` with `route?: Route` and `cause?: unknown` fields; `name === 'CaptureError'` at runtime so Phase 50's boundary can map it to exit 1.
- **Extended CapturedPage** interface — Phase 46 placeholder now has the full 8-field shape locked for Phase 49 (`route`, `httpStatus`, `mainHtml`, `title`, `description`, `consoleErrors`, `screenshotPath`, optional `cfCacheStatus`).
- **`slugify(input)`** — pure helper matching the 9-row spec table; `'/' -> 'home'`, homepage special case, regex pipeline handles the rest. Anchors the cache-buster URL builder (Plan 48-02) and screenshot filename builder (Plan 48-05).
- **`detectInterstitial({title, bodyBytes, html})`** — pure classifier with 3 layered Cloudflare signals (title regex / body-size threshold / DOM markers); returns `string | null`. Caller wraps non-null in `CaptureError`.
- **`types.ts`** runtime re-export of `CaptureError` — symmetrical with the existing `ConfigError` runtime re-export; 4 type re-exports + 2 runtime class re-exports (6 total).
- `captureRoutes` kept as a throwing stub per plan — real Playwright integration deferred to Plan 48-06.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend capture.ts — CaptureError + slugify + detectInterstitial + extended CapturedPage** — `b17c659` (feat)
2. **Task 2: Re-export CaptureError as a runtime value from types.ts** — `fb23ecb` (feat)

**Plan metadata:** (pending final docs commit by executor)

## Files Created/Modified

- `scripts/editorial/capture.ts` — Replaced Phase 46 placeholder body. Now exports `CapturedPage` (extended), `CaptureError`, `slugify`, `detectInterstitial`, and a throwing `captureRoutes` stub. SCAF-08 banner preserved verbatim. 109 lines.
- `scripts/editorial/types.ts` — Added single new line `export { CaptureError } from './capture.ts'` (plus 3-line explanatory comment) immediately below the existing `ConfigError` runtime re-export. All existing re-exports unchanged.

## Decisions Made

- **CaptureError options-bag constructor** — chose `constructor(message, opts?: { route?, cause? })` per CONTEXT.md specifics, rather than mirroring ConfigError's positional `(message, cause?)`. Rationale: capture errors are route-scoped, so the route field is semantically first-class and belongs alongside `cause` in a named bag.
- **Pure classifier vs. throwing classifier** — `detectInterstitial` returns `string | null` instead of throwing directly. Plan 48-03 will wrap the non-null return in a `CaptureError`. This keeps the unit-test surface hermetic (pure function in, pure value out) and puts the error-construction responsibility at the call site where the `Route` context is available.
- **Signal ordering in detectInterstitial** — title -> bodyBytes -> cf-chl-opt -> challenge-platform. First match wins; earlier signals yield more actionable error messages ("title contains 'Just a moment'" is more helpful than "DOM contains 'challenge-platform'").
- **`slugify('/')` short-circuits to `'home'`** before the regex pipeline. Every other input passes through the 6-step pipeline: trim -> lowercase -> strip leading `/+` -> replace `[^a-z0-9]+` with `-` -> collapse `-+` -> trim leading/trailing `-`.
- **captureRoutes stays a stub** — explicit per plan. No partial Playwright wiring in a pure-logic plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Reworded JSDoc comment to clear SCAF-08 grep gate**

- **Found during:** Task 1 automated verification step
- **Issue:** The task's `action` block contained the line `* Determinism invariant (SCAF-08): no Date.now(), no random, pure function of input.` inside the `slugify` JSDoc. The task's own SCAF-08 grep gate (`! grep -qE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts`) is line-based and does not distinguish code from comments, so it matched the literal string `Date.now()` in the comment and tripped.
- **Fix:** Changed the comment to `* Determinism invariant (SCAF-08): no wall-clock timestamps, no randomness — pure function of input.` — preserves the intent (explain what SCAF-08 forbids in this helper) without mentioning the literal API name that the grep gate bans.
- **Files modified:** scripts/editorial/capture.ts (Task 1)
- **Verification:** `grep -qE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts` now returns no matches; `pnpm build` exit 0; `pnpm test:scripts` exit 0 (224/224).
- **Committed in:** `b17c659` (Task 1 commit; the fix was applied before the first commit landed)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Comment-only wording change. Preserves the documentation intent and does not change the behaviour, shape, or ordering of any export. No scope creep — the fix was needed purely to satisfy the plan's own SCAF-08 grep gate against the verbatim task-action prose.

## Issues Encountered

- None beyond the deviation above.

## User Setup Required

None — pure-logic plan, no external services, no environment variables, no filesystem/network I/O.

## Verification Results

- `grep` gate (Task 1 automated): all 15 grep-required patterns present (banner, interface, 3 new fields, CaptureError class + name, slugify + root case, detectInterstitial + 4 signals, stub body) — PASS.
- `grep` gate (Task 2 automated): all 4 existing type re-exports preserved; both runtime class re-exports present; no `export type { CaptureError }` anti-pattern; 6 total `^export ` lines — PASS.
- SCAF-08 grep gate: no matches for `@/`, `Date.now()`, `new Date(`, `os.EOL`, or `Promise.all` in either file — PASS.
- No `from 'playwright'` import in capture.ts (deferred to Plan 48-02) — PASS.
- `pnpm build` exit 0 — tsc composite build resolves all types across `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.editorial.json`.
- `pnpm test:scripts` exit 0 — 18 test files, 224 tests passing. Phase 46 smoke test still compiles because the extended `CapturedPage` is a structural superset of its Phase-46 shape.
- `wc -l scripts/editorial/capture.ts` = 109 (within the 80–160 range).

## Next Phase Readiness

- **Plan 48-02 (Wave 2)** can now import `slugify` from `./capture.ts` for the cache-buster URL builder and can import `CaptureError` for browser-lifecycle failures.
- **Plan 48-03 (Wave 3)** can import `detectInterstitial` and wrap its non-null return in `new CaptureError(reason, { route })`.
- **Plan 48-05 (Wave 3)** can import `slugify` for screenshot filename derivation (`<ordinal>-<slug>.png`).
- **Plan 48-06 (Wave 4)** replaces the throwing `captureRoutes` stub with the Playwright-driven integration; the extended `CapturedPage` shape is the contract it must return.
- **Phase 49** (`convert.ts`) can rely on the locked `CapturedPage` shape — all 3 new Phase-48 fields (`consoleErrors`, `screenshotPath`, `cfCacheStatus?`) are now guaranteed present.
- **Phase 50** (`index.ts` outermost boundary) can do `err instanceof CaptureError` (via either direct import from `./capture.ts` or the `./types.ts` barrel) to distinguish capture failures (exit 1) from config failures (exit 2).

No blockers. Wave-1 pure-logic surface is complete; Wave 2 (Plan 48-02) can start.

## Self-Check: PASSED

- FOUND: scripts/editorial/capture.ts (109 lines, all required exports present)
- FOUND: scripts/editorial/types.ts (6 export lines: 4 type + 2 runtime)
- FOUND: commit b17c659 in `git log` (Task 1)
- FOUND: commit fb23ecb in `git log` (Task 2)
- PASS: `pnpm build` exit 0
- PASS: `pnpm test:scripts` 224/224 green
- PASS: SCAF-08 grep gate clean across both files
- PASS: no playwright import yet in capture.ts
- PASS: CaptureError usable at runtime from both direct import and types.ts barrel

---
*Phase: 48-capture-playwright-io*
*Completed: 2026-04-20*
