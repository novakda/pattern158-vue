---
phase: 47-config-routes-pure-logic
plan: 03
subsystem: editorial-capture
tags: [typescript, routes, exhibits-json, exclusion-filter, nodenext, scaf-08, phase-47]

# Dependency graph
requires:
  - phase: 47-01-interface-contracts
    provides: "Final Route shape (path, label, category: 'static' | 'exhibit', optional sourceSlug); throwing-stub buildRoutes in routes.ts; SCAF-08 descriptive banner"
provides:
  - "STATIC_ROUTES: readonly Route[] — 7 hardcoded static routes in locked CONTEXT.md order (home → philosophy → technologies → case-files → faq → contact → accessibility)"
  - "EXCLUDED_PREFIXES: readonly string[] — 4-entry exclusion set ('/review', '/diag', '/portfolio', '/testimonials')"
  - "isExcluded(path): segment-aware prefix matcher — P === E OR P.startsWith(E + '/'); prevents '/diagnostics' from colliding with '/diag'"
  - "buildRoutes(exhibitsJsonPath): Promise<readonly Route[]> — async; reads exhibits.json via fs.readFile + JSON.parse; validates array shape + per-entry shape; derives sourceSlug from exhibitLink via prefix strip; concatenates STATIC_ROUTES + exhibit routes in source order; applies defensive isExcluded filter"
affects: [47-04-config-tests, 47-05-routes-tests, 47-06-smoke-gate, 48-capture, 50-orchestration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "node:fs/promises subpath import for async fs operations"
    - "TypeScript assertion function (asserts value is T) for per-entry JSON validation with type-narrowing"
    - "Spread concatenation preserving STATIC_ROUTES object identity — downstream tests can assert reference equality"
    - "Sequential for-loop over JSON array preserves index for per-entry error messages and satisfies SCAF-08 no-parallel-iteration rule"
    - "Defense-in-depth exclusion: filter runs over the final concatenated list even though today no route matches an excluded prefix"

key-files:
  created: []
  modified:
    - "scripts/editorial/routes.ts (added node:fs/promises import; added STATIC_ROUTES const, EXCLUDED_PREFIXES const, isExcluded helper; replaced throwing-stub buildRoutes with full async implementation incl. ExhibitsJsonEntry assertion function and EXHIBIT_LINK_PREFIX)"

key-decisions:
  - "Segment-aware prefix match (P === E || P.startsWith(E + '/')) instead of plain startsWith — guarantees /diagnostics does not collide with /diag (a real concern since /diag is in the excluded set and /diagnostics would be a plausible future route)"
  - "sourceSlug derived from exhibitLink (not a JSON slug field) — exhibits.json uses exhibitLink (e.g. '/exhibits/exhibit-a'); strip leading '/exhibits/' to get 'exhibit-a'. This follows the planner-audit note in the 47-01 SUMMARY (exhibits.json has no slug field)"
  - "STATIC_ROUTES spread into final array so object identities are preserved — downstream tests and index.ts reference comparisons stay stable"
  - "Defense-in-depth exclusion filter runs even though today no static or exhibit path matches an excluded prefix — documents the exclusion contract at the boundary where routes are consumed"
  - "JSON.parse allowed to throw SyntaxError natively — no try/catch wrap, propagated error is a Plan 47-05 test target"
  - "EXHIBIT_LINK_PREFIX kept module-private (not exported) — internal constant, not part of the public API surface"
  - "Sequential for-loop with explicit index (let i = 0; i < parsed.length; i += 1) instead of for-of/forEach — preserves index for per-entry error messages and satisfies SCAF-08 'no parallel iteration over the ordered route list' rule literally"

patterns-established:
  - "JSON reader pattern for the editorial subsystem: fs.readFile(path, 'utf8') + JSON.parse — NOT @/ alias, NOT ESM JSON import assertion, NOT await import(). Enforced by SCAF-08 grep gate."
  - "Per-entry assertion function pattern: TypeScript asserts value is T narrow + explicit throw with offending index/value in the error message"

requirements-completed: [CAPT-01, CAPT-02]

# Metrics
duration: 3m 10s
completed: 2026-04-20
---

# Phase 47 Plan 03: Routes module implementation Summary

**Replaced the scripts/editorial/routes.ts throwing stub with STATIC_ROUTES (7 hardcoded static routes in locked order), EXCLUDED_PREFIXES + isExcluded (segment-aware prefix matcher), and an async buildRoutes that reads exhibits.json via fs.readFile + JSON.parse, validates per-entry shape, derives sourceSlug from exhibitLink by stripping '/exhibits/', concatenates 7 static + N exhibit routes in source order, and applies a defense-in-depth exclusion filter.**

## Performance

- **Duration:** 3 min 10 sec
- **Started:** 2026-04-20T17:05:21Z
- **Completed:** 2026-04-20T17:08:31Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- `STATIC_ROUTES` — readonly Route[] with exactly 7 entries in the locked CONTEXT.md order: `/` (Home), `/philosophy` (Philosophy), `/technologies` (Technologies), `/case-files` (Case Files), `/faq` (FAQ), `/contact` (Contact), `/accessibility` (Accessibility). Each entry has `category: 'static'` and no `sourceSlug`.
- `EXCLUDED_PREFIXES` — readonly string[] with exactly 4 entries: `'/review'`, `'/diag'`, `'/portfolio'`, `'/testimonials'`. The 404 fallback is structural (no route is built for unknown paths), not a string in this list.
- `isExcluded(routePath)` — segment-aware prefix matcher: returns true iff `routePath === prefix || routePath.startsWith(prefix + '/')` for any prefix in EXCLUDED_PREFIXES. Verified behavior: `/review`, `/diag`, `/diag/network`, `/portfolio`, `/testimonials` → true; `/`, `/philosophy`, `/exhibits/exhibit-a`, `/diagnostics` → false.
- `buildRoutes(exhibitsJsonPath)` — async; reads the given absolute path via `await fs.readFile(path, 'utf8')` + `JSON.parse`; validates the parsed value is an array (`"exhibits.json must be a JSON array"`), validates each entry has string `label` + `exhibitLink` via TS assertion function `isExhibitsJsonEntry`, validates each exhibitLink starts with `/exhibits/` (throws naming the offending value), derives `sourceSlug` by slicing off the `/exhibits/` prefix, appends exhibit routes after STATIC_ROUTES, and applies a defensive `isExcluded` filter as the final pass.
- Functional smoke: fed the real `src/data/json/exhibits.json` (15 entries, Exhibit A → O), `buildRoutes` produces exactly 22 routes (7 static + 15 exhibit) with sourceSlugs `exhibit-a` through `exhibit-o` in source order.
- SCAF-08 descriptive banner preserved verbatim; SCAF-08 forbidden-pattern grep gate returns zero hits (`@/`, `Date.now()`, `new Date(`, `os.EOL`, `Promise.all`) across `scripts/editorial/routes.ts`.
- No JSON import assertion form leaked in (`with { type: 'json' }`, `await import()`).
- Sequential for-loop with explicit index — SCAF-08 "no parallel iteration over the ordered route list" rule literally satisfied.
- `pnpm build` exits 0 (vue-tsc -b walks all composite projects clean; Vite production bundle rebuilt; markdown-export script regenerated markdown).
- `pnpm test:scripts` passes 16 files / 145 tests — Phase 46 smoke test still green (Route interface unchanged, types.ts re-export unchanged).
- `routes.ts` final line count: 104 (within the plan's 70-140 target).

## Task Commits

Each task was committed atomically on main:

1. **Task 1: Add STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded helper (CAPT-02)** — `ba89f7a` (feat)
2. **Task 2: Implement buildRoutes — read exhibits.json + append in source order (CAPT-01)** — `cf28e84` (feat)

## Files Created/Modified

- `scripts/editorial/routes.ts` — Added `import * as fs from 'node:fs/promises'` below the SCAF-08 banner block; added `STATIC_ROUTES` const (7 entries in locked order), `EXCLUDED_PREFIXES` const (4 entries), `isExcluded` function (segment-aware prefix matcher); added `ExhibitsJsonEntry` private interface + `isExhibitsJsonEntry` TS assertion function + module-private `EXHIBIT_LINK_PREFIX` constant; replaced the throwing-stub body of `buildRoutes` with the full async implementation (read file → JSON.parse → array guard → sequential entry loop → spread-concat → defensive isExcluded filter). Existing `Route` interface from Plan 47-01 untouched. Final file is 104 lines.

## Route-construction rules (locked, post-47-03)

| Rule | Value / Behavior |
| ---- | ---------------- |
| Static route count | exactly 7 |
| Static route order | home → philosophy → technologies → case-files → faq → contact → accessibility |
| Exhibit route append order | EXACT order of exhibits.json array (no sort, no filter) |
| Read mechanism | `await fs.readFile(path, 'utf8')` + `JSON.parse` |
| sourceSlug derivation | `exhibitLink.slice('/exhibits/'.length)` — e.g. `/exhibits/exhibit-a` → `"exhibit-a"` |
| exhibit route `path` | equals `entry.exhibitLink` verbatim |
| exhibit route `label` | equals `entry.label` verbatim |
| exhibit route `category` | literal `'exhibit'` |
| static route `category` | literal `'static'` |
| Excluded prefix set | `['/review', '/diag', '/portfolio', '/testimonials']` |
| Exclusion match semantics | `P === E \|\| P.startsWith(E + '/')` (segment-aware prefix) |
| Final list order | `[...STATIC_ROUTES, ...exhibitRoutes].filter(r => !isExcluded(r.path))` |

## Error-surface contract (Plan 47-05 test targets)

| Branch | Trigger | Error message substring |
| ------ | ------- | ----------------------- |
| Malformed JSON | `JSON.parse` throws | Native `SyntaxError` propagated unchanged (no wrap) |
| Non-array root | parsed value is not an array | `"exhibits.json must be a JSON array"` |
| Non-object entry | entry is `null` or not an object | `"exhibits.json entry at index <i> is not an object"` |
| Missing label | entry.label absent/empty/non-string | `"exhibits.json entry at index <i> has no string "label" field"` |
| Missing exhibitLink | entry.exhibitLink absent/empty/non-string | `"exhibits.json entry at index <i> has no string "exhibitLink" field"` |
| Malformed exhibitLink | does not start with `/exhibits/` | `"exhibits.json entry at index <i> has invalid exhibitLink "<value>" (must start with "/exhibits/")"` |

## Export surface (final, post-47-03)

```ts
// scripts/editorial/routes.ts
export interface Route                                           // unchanged from 47-01
export const STATIC_ROUTES: readonly Route[]                     // NEW in 47-03
export const EXCLUDED_PREFIXES: readonly string[]                // NEW in 47-03
export function isExcluded(routePath: string): boolean            // NEW in 47-03
export async function buildRoutes(exhibitsJsonPath: string): Promise<readonly Route[]>   // body replaced in 47-03
```

`types.ts` re-export (from 47-01) continues to forward `Route` as a type-only re-export — no changes needed in this plan.

## Decisions Made

- **`isExcluded` uses segment-aware prefix match, not plain `startsWith`:** A naive `routePath.startsWith(prefix)` would falsely exclude `/diagnostics` because it starts with `/diag`. The implemented `routePath === prefix || routePath.startsWith(prefix + '/')` matches only whole path segments, which aligns with CAPT-02's intent ("`/diag/*` prefix match") and is explicit in the plan's acceptance criteria.
- **`sourceSlug` derived from `exhibitLink`, not a JSON `slug` field:** The 47-01 SUMMARY and the parent executor prompt both called out the planner-audit correction: `src/data/json/exhibits.json` entries expose `exhibitLink` (e.g., `/exhibits/exhibit-a`) but no `slug` field. The implementation strips the `/exhibits/` prefix to derive `sourceSlug = "exhibit-a"`. A defensive prefix check surfaces any future malformed link with the offending value in the error message.
- **Spread concatenation (`[...STATIC_ROUTES, ...exhibitRoutes]`) preserves static-route object identity:** The plan's constraint says "tests can assert `result[0] === STATIC_ROUTES[0]` if they want to." Plain concat via spread satisfies this; `Array.prototype.concat` would too, but spread is the project's idiomatic choice (consistent with Plan 47-02 and the broader Vue codebase).
- **Defensive `isExcluded` filter on the concatenated list:** Today, none of the static routes or exhibit routes match an excluded prefix, so the filter is a no-op. It's retained because (a) the plan explicitly prescribes it, (b) it makes the exclusion contract explicit at the module's output boundary, and (c) it preemptively protects against a future static route being added that collides with an excluded prefix.
- **JSON.parse `SyntaxError` propagated unchanged:** Not wrapped in try/catch. Plan 47-05's test fixture for malformed JSON asserts on the native `SyntaxError`, which is the standard Node/V8 error class.
- **Sequential for-loop with explicit index instead of for-of or forEach:** Preserves per-entry index for error messages AND satisfies SCAF-08's "no parallel iteration over the ordered route list" rule literally (no `Promise.all`, no `.forEach` with async callback). Phase 48's capture.ts will iterate this Route[] sequentially too — this module establishes the pattern.
- **`EXHIBIT_LINK_PREFIX` module-private:** Not exported. Internal constant only; no test or downstream module needs it outside this file.

## Deviations from Plan

None - plan executed exactly as written. All `<behavior>` requirements, all `<acceptance_criteria>`, and all `<success_criteria>` verified green on first pass.

**Total deviations:** 0.
**Impact on plan:** Zero.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Plan 47-04 (config tests)** — independent of this plan; unblocked from the start of Wave 3 (tests plan for config.ts only).
- **Plan 47-05 (routes tests)** — ready to start: the locked export surface (`STATIC_ROUTES`, `EXCLUDED_PREFIXES`, `isExcluded`, `buildRoutes`) and the error-message contract strings are stable. Tests will use inline fixtures (not the real exhibits.json) for hermeticity, per CONTEXT.md.
- **Plan 47-06 (smoke gate)** — still has a green smoke test + clean SCAF-08 gate to gate against. The 4-name import surface in `__tests__/smoke.test.ts` is unchanged.
- **Phase 48 (capture)** — `buildRoutes(config.exhibitsJsonPath)` is ready for `capture.ts` to iterate sequentially; each Route has `path`, `label`, `category`, and (for exhibit routes) `sourceSlug` for screenshot filename anchoring.
- **Phase 50 (orchestration)** — `loadEditorialConfig()` + `buildRoutes(config.exhibitsJsonPath)` can both be plumbed into `index.ts`'s main() with a single try/catch at the outermost boundary.
- **SCAF-08 gate** — clean across `scripts/editorial/routes.ts`; ready for Plan 47-06 enforcement.

## Self-Check: PASSED

Verification (repeating the key acceptance checks):

- `scripts/editorial/routes.ts`: present at 104 lines, contains `import * as fs from 'node:fs/promises'`, `export interface Route`, `export const STATIC_ROUTES` (7 entries, verified), `export const EXCLUDED_PREFIXES` (4 entries), `export function isExcluded(routePath: string): boolean` with segment-aware match `routePath === prefix || routePath.startsWith(prefix + '/')`, `export async function buildRoutes(exhibitsJsonPath: string): Promise<readonly Route[]>`, `await fs.readFile(exhibitsJsonPath, 'utf8')`, `JSON.parse(fileContents)`, `if (!Array.isArray(parsed))`, `asserts value is ExhibitsJsonEntry`, `EXHIBIT_LINK_PREFIX = '/exhibits/'`, `entry.exhibitLink.slice(EXHIBIT_LINK_PREFIX.length)`, `[...STATIC_ROUTES, ...exhibitRoutes]`, `allRoutes.filter((r) => !isExcluded(r.path))`, `for (let i = 0; i < parsed.length; i += 1)`.
- Throwing stub `"not implemented until Phase 47 Plan 03 Task 2"` no longer present.
- SCAF-08 descriptive banner preserved verbatim (1 occurrence at file head).
- `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/routes.ts` returns no matches (SCAF-08 forbidden-pattern grep gate clean).
- `grep -RE "JSON import|with \{ type: 'json' \}" scripts/editorial/routes.ts` returns no matches (no JSON import assertion form).
- Commits `ba89f7a` (Task 1) and `cf28e84` (Task 2) present in `git log --oneline`.
- `pnpm build` exits 0 (vue-tsc -b walks all composite projects clean; Vite production bundle rebuilt; markdown-export script ran).
- `pnpm test:scripts` passes 16 files / 145 tests (Phase 46 smoke test still green; no regressions from this plan).
- Functional smoke against real `src/data/json/exhibits.json`: `buildRoutes` returns exactly 22 routes (7 static in locked order + 15 exhibit in source order, sourceSlugs exhibit-a through exhibit-o), `isExcluded` returns true for all 4 excluded prefixes (and `/diag/network`) and false for `/`, `/philosophy`, `/exhibits/exhibit-a`, `/diagnostics`.

---
*Phase: 47-config-routes-pure-logic*
*Completed: 2026-04-20*
