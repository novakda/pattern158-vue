---
phase: 46
status: clean
reviewed_at: 2026-04-19T16:05:00Z
depth: standard
files_reviewed: 14
findings_total: 4
findings_by_severity:
  high: 0
  medium: 0
  low: 0
  info: 4
---

# Phase 46: Scaffold — Code Review Report

**Reviewed:** 2026-04-19T16:05:00Z
**Depth:** standard
**Files Reviewed:** 14
**Status:** clean (info-only observations)

## Executive Summary

Phase 46 ships exactly what it advertises: an inert, type-safe, build-wired skeleton. All 7 placeholder TS files are minimal and well-disciplined; types match what the smoke test imports through `types.ts`; the cross-file type chain (`capture.ts` → `routes.ts` + `config.ts`; `convert.ts` → `capture.ts`; `write.ts` → `convert.ts` + `config.ts`) is internally consistent and reachable end-to-end via `types.ts`. NodeNext `.ts` extensions are used consistently in every relative import. The Vitest project topology is preserved (still 3 projects, no duplicate `name: 'scripts'`). The `.gitignore` block correctly mirrors the analog scripts-project pattern. Forbidden-pattern grep on `scripts/editorial/` is clean. No bugs, no security issues, no quality regressions vs. the `scripts/markdown-export/` analog. The four observations below are minor info-level notes about consistency drift that future phases (47–50) may want to address opportunistically — none block phase closure.

## Findings

### Info

#### IN-01: `tsconfig.editorial.json` `types` array diverges silently from `tsconfig.scripts.json`

**File:** `tsconfig.editorial.json:17`
**Issue:** The editorial tsconfig declares `"types": ["node", "vitest/globals"]` while the analog `tsconfig.scripts.json:17` still declares only `"types": ["node"]`. This is a deliberate, documented divergence (Plan 05's Rule 3 auto-fix to satisfy the smoke test's use of ambient `describe`/`it`/`expect`), but the two configs are no longer mechanical mirrors. The divergence is invisible at the file level — there is no comment in `tsconfig.editorial.json` explaining why the `vitest/globals` entry is present here and absent in the scripts analog. A future maintainer reading `tsconfig.editorial.json` cold has no in-file pointer to the rationale (only the SUMMARY captures it).
**Fix suggestion:** Either (a) add a one-line `// note` is not legal in JSON — instead, opportunistically align by ALSO adding `"vitest/globals"` to `tsconfig.scripts.json` `types` (zero functional effect there since `markdown-export` tests use explicit imports, but restores mirror parity); or (b) accept the divergence and note it in `.planning/codebase/CONVENTIONS.md` so the rationale survives outside the SUMMARY. Recommendation: option (a) costs nothing and restores the "mirror" invariant. Defer this as a tiny housekeeping task — not a Phase 46 blocker.
**Severity rationale:** Info — does not affect compilation, runtime, or correctness. Pure consistency hygiene between sibling configs.

#### IN-02: `convert.ts` references `CapturedPage['route']` instead of importing `Route` directly

**File:** `scripts/editorial/convert.ts:12`
**Issue:** `ConvertedPage.route` is typed as `CapturedPage['route']` (indexed access) rather than `Route` directly. Both resolve to the same `Route` type, but the indexed-access form creates an indirect coupling: any future change to `CapturedPage.route`'s type (e.g., Phase 48 tightens it to `Route & { capturedAt: string }`) silently propagates into `ConvertedPage.route`, which is downstream of capture and may not want that change. The other modules (`capture.ts`, `write.ts`) all import `Route`/`CapturedPage`/`EditorialConfig` directly via `import type`. This is the sole asymmetry.
**Fix suggestion:** When Phase 49 fills in the body, change to:
```ts
import type { CapturedPage } from './capture.ts'
import type { Route } from './routes.ts'

export interface ConvertedPage {
  readonly route: Route
  // ...
}
```
This makes the dependency on `Route` explicit at the import level (matching the pattern in `capture.ts` and `write.ts`) and decouples `ConvertedPage` from any future evolution of `CapturedPage.route`.
**Severity rationale:** Info — current behavior is correct and the indexed-access form is valid TS. Flagging because it's a subtle convention drift the Phase 49 author should be aware of when expanding the file.

#### IN-03: Smoke test asserts `_route`/`_captured`/`_converted` are `undefined` — tautological by construction

**File:** `scripts/editorial/__tests__/smoke.test.ts:23-30`
**Issue:** The first `it()` block declares four `const _x: T | undefined = undefined` and then asserts each is `toBeUndefined()`. The assertions are tautologies — the constants are literal `undefined`, so the test cannot ever fail at runtime regardless of whether the type imports are wired. The actual smoke value of this test is at **compile time** (if any of the four type names cannot resolve through `types.ts`, `vue-tsc` errors out before the test executes) — which the test's own comment correctly notes ("if these symbols cannot be resolved, the test file itself fails to compile"). The runtime `expect(...).toBeUndefined()` calls add no signal beyond making Vitest count it as a passing test.
**Fix suggestion:** Acceptable as-is — the runtime no-op exists deliberately so Vitest's discovery glob has something to report (proves SCAF-06 is wired). If Phase 47+ wants a stronger smoke test, replace the `toBeUndefined()` block with a single assertion that the **runtime exports** of `../types.ts` is an empty object (since it's type-only re-exports): `expect(Object.keys(await import('../types.ts'))).toHaveLength(0)`. That at least exercises the runtime module-resolution graph in addition to the type graph. Not a Phase 46 fix — note for Phase 47.
**Severity rationale:** Info — test passes for the right reason (compile-time type resolution). Runtime assertions are decorative; this is a documentation-vs-implementation note for whoever extends the smoke test.

#### IN-04: `.gitignore` `*.tsbuildinfo` catch-all already covers `tsconfig.editorial.tsbuildinfo`

**File:** `.gitignore:18, 22`
**Issue:** Line 18 declares `*.tsbuildinfo` (a catch-all that matches any `.tsbuildinfo` file at any depth). Line 22 then explicitly declares `tsconfig.editorial.tsbuildinfo`, which is already matched by the catch-all. The same redundancy exists for the scripts analog (`tsconfig.scripts.tsbuildinfo` at line 17). This is intentional per Plan 04 ("self-documents the per-project ignore intent") and harmless, but a reader unfamiliar with the rationale may try to "clean up" the duplicate and lose the per-project signal.
**Fix suggestion:** Either (a) accept as-is (the redundancy is documented in Plan 04's SUMMARY and explicitly mirrors the analog), or (b) add a one-line comment in `.gitignore` itself explaining the intentional redundancy:
```
# (.tsbuildinfo-editorial/ + tsconfig.editorial.tsbuildinfo are explicit even though
#  *.tsbuildinfo above already matches the latter — preserves per-project visibility.)
```
Recommendation: leave as-is. The pattern is consistent with the scripts block above it; future maintainers who follow the existing convention will reproduce it correctly without needing the comment.
**Severity rationale:** Info — pure stylistic redundancy that is documented in plan history and consistent with the analog block. No functional impact.

## Strengths Observed

- **NodeNext `.ts` import extensions used consistently** in every relative import across `capture.ts`, `convert.ts`, `write.ts`, `types.ts`, and `__tests__/smoke.test.ts` — matches the Plan 01 spec exactly and won't trip up the editorial tsconfig's `module: NodeNext`.
- **`import type` used everywhere** for cross-module references in placeholder modules and the smoke test — zero runtime risk of accidentally instantiating one of the throwing stubs.
- **Throwing stubs name the implementing future phase** in their error messages (e.g., `'not implemented until Phase 47 (WRIT-01)'`) — gives a clear failure mode if a downstream caller jumps ahead.
- **`paths: {}` in `tsconfig.editorial.json`** correctly enforces SCAF-08's "no `@/` aliases" rule at the type-checker level (defense in depth alongside the grep gate).
- **`types.ts` re-export surface is complete and consistent** — every interface declared in `config.ts`, `routes.ts`, `capture.ts`, `convert.ts` is re-exported, and the smoke test imports all four through this single entry point, so a missing re-export would surface immediately.
- **`vitest.config.ts` extension preserves all three project names** (`unit`, `browser`, `scripts`) and keeps `globals: true` / `environment: 'node'` on the scripts project intact — SCAF-06 contract (no new project) honored.
- **`.gitignore` mirror block** (`.tsbuildinfo-editorial/` + `tsconfig.editorial.tsbuildinfo`) follows the exact shape of the scripts analog above it — pattern is self-propagating.
- **`package.json` `editorial:capture` script is intentionally NOT chained into `pnpm build`** — correct decision since the editorial tool talks to a live production site; running it during a build would be wrong.
- **Pinned versions in `pnpm-lock.yaml` exactly match the SCAF-05 spec** (turndown 7.2.4, @joplin/turndown-plugin-gfm 1.0.64, @types/turndown 5.0.6, playwright 1.59.1) — verified via specifier lines.
- **SCAF-08 banner format is consistent across all 8 files** (7 top-level + 1 smoke test) — descriptive phrasing avoids self-tripping the grep gate while keeping rules visible.

## Recommendations for Phases 47-50

1. **Preserve the SCAF-08 banner block when replacing stub bodies.** Phases 47–50 will rewrite `loadEditorialConfig()`, `buildRoutes()`, `captureRoutes()`, `convertCapturedPage()`, `writeMonolithicMarkdown()`, and `main()`. Keep the descriptive banner at the top of every file — the grep gate depends on the descriptive form, and a future plan author who reverts to the literal-token form (e.g., spelling out `Date.now()` in the banner) will silently break the gate. The Plan 01 SUMMARY's "Deviations from Plan" section is the canonical reference; consider adding a CONVENTIONS.md note so it's not buried in plan history.

2. **`convert.ts` should switch to direct `Route` import** when Phase 49 expands the file (see IN-02). The indexed-access form `CapturedPage['route']` works today but creates an unnecessary coupling once the modules grow.

3. **`tsconfig.editorial.json` already includes `vitest/globals`** so all future test files under `scripts/editorial/__tests__/` can use ambient `describe`/`it`/`expect` without per-file imports. Phase 47–50 test files should follow this convention (matches the smoke test) rather than the explicit-import style used in `scripts/markdown-export/**/*.test.ts`.

4. **Phase 49 will likely need to add `"DOM"` to `lib`** in `tsconfig.editorial.json` if `@types/turndown` references DOM globals (`Node`, `HTMLElement`, etc.). Plan 02's SUMMARY documents this as an intentional deferral. The Phase 49 author should inspect `node_modules/@types/turndown/lib/turndown.d.ts` first and add DOM only if compilation actually fails — speculative DOM addition would expand attack surface (DOM globals leaking into Node-only code paths).

5. **`types.ts` re-export shape is the smoke-test contract.** Keep `EditorialConfig`, `Route`, `CapturedPage`, `ConvertedPage` exported by name from `types.ts` — the smoke test imports all four and will fail to compile if any is renamed or removed. If a phase adds a new public type (e.g., `CaptureBudget`), add it to `types.ts` re-exports as part of the same plan so the surface stays complete.

6. **No `Promise.all` in `captureRoutes()` Phase 48 body.** SCAF-08 forbids parallel iteration over the ordered route list. Phase 48 must use sequential `for...of` with `await` — both for determinism (route capture order = file output order) and for politeness to the live production site being scraped.

7. **Opportunistic cleanup for `tsconfig.scripts.json`** — adding `"vitest/globals"` to its `types` array (matching `tsconfig.editorial.json`) is a zero-risk parity restore (markdown-export tests use explicit imports today, so the addition is a no-op there). Any future phase touching that file could fold this in. See IN-01.

---

_Reviewed: 2026-04-19T16:05:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
