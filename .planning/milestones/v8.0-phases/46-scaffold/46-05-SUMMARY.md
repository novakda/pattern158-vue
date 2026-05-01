---
phase: 46-scaffold
plan: 05
subsystem: infra
tags: [smoke-test, build-gate, vitest, typescript, tooling]

# Dependency graph
requires:
  - phase: 46-scaffold
    provides: Plan 01 placeholder TS files + smoke test under scripts/editorial/
  - phase: 46-scaffold
    provides: Plan 02 tsconfig.editorial.json composite project (outDir .tsbuildinfo-editorial)
  - phase: 46-scaffold
    provides: Plan 03 editorial:capture pnpm script + 4 dep changes (turndown, GFM plugin, @types/turndown, playwright bump)
  - phase: 46-scaffold
    provides: Plan 04 Vitest scripts project include extension + .gitignore entry
provides:
  - End-to-end proof that the scaffold compiles, runs, tests, and ignores artifacts
  - All 5 Phase 46 success criteria demonstrably TRUE
  - Phase 47 unblocked — types compile, tests run, tsx invokes cleanly
affects: [47-config-routes, 48-capture, 49-convert, 50-orchestrate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Wave 2 smoke gate: end-to-end validation lands as a separate plan, not folded into the last Wave 1 plan — failures surface in the gate, not in the next phase"
    - "tsconfig types array as the canonical place for ambient test-runner declarations (vitest/globals) when test files use globals: true"

key-files:
  created:
    - .planning/phases/46-scaffold/46-05-SUMMARY.md
  modified:
    - tsconfig.editorial.json

key-decisions:
  - "Fix the tsconfig (add vitest/globals to types) rather than rewrite the smoke test (add explicit imports). Preserves Plan 01's smoke test design intent (the file's comment explicitly says globals are ambient via vitest config). Also makes the scaffold consistent for Phases 47-50 — future test files can rely on globals without per-file imports."
  - "Pre-existing untracked files (.planning/config.json modified, .planning/graphs/, CAREER-DATA.md, graphify-out/) left untouched per orchestrator instructions — they predate Phase 46."

patterns-established:
  - "When a composite tsconfig project includes vitest test files that use ambient globals, add `vitest/globals` alongside `node` in the project's `types` array — `globals: true` in vitest.config.ts only affects runtime test discovery, not tsc compilation"

requirements-completed: [SCAF-02, SCAF-04, SCAF-06]

# Metrics
duration: 2m 26s
completed: 2026-04-20
---

# Phase 46 Plan 05: Wave 2 End-to-End Smoke Gate Summary

**End-to-end smoke gate proved Phase 46 scaffold is fully wired: `pnpm build` compiles the editorial tsconfig project clean, `pnpm editorial:capture` exits 0 with the placeholder banner, `pnpm test:scripts` discovers and passes `scripts/editorial/__tests__/smoke.test.ts` alongside the existing 14 markdown-export test files (145 tests total, zero regressions). One blocking deviation surfaced and was fixed inline (Rule 3): tsconfig.editorial.json was missing `vitest/globals` from its `types` array, breaking `vue-tsc -b` on the smoke test's ambient describe/it/expect calls.**

## Performance

- **Duration:** 2m 26s
- **Started:** 2026-04-20T15:36:50Z
- **Completed:** 2026-04-20T15:39:16Z
- **Tasks:** 2
- **Files modified:** 1 (deviation fix)

## Accomplishments

- `pnpm build` exits 0 — `vue-tsc -b` walks root `tsconfig.json` references and successfully builds both `tsconfig.scripts.json` and the new `tsconfig.editorial.json` (8 .d.ts files emitted under `.tsbuildinfo-editorial/`)
- `.tsbuildinfo-editorial/` exists on disk after build but is absent from `git status --porcelain` — proves SCAF-07 (Plan 04 .gitignore entry) is wired correctly
- `pnpm editorial:capture` exits 0 with stdout `<!-- editorial capture tool — phase 46 scaffold placeholder -->` — proves tsx + NodeNext + .ts-extension imports work end-to-end
- `pnpm test:scripts` exits 0 with 16 test files / 145 tests passed, including the 2 `it()` blocks in `scripts/editorial/__tests__/smoke.test.ts` (`reaches the placeholder type surface from types.ts`, `uses only literal newline endings (SCAF-08 determinism check on test file itself)`); zero regressions in pre-existing `scripts/markdown-export/` tests
- SCAF-08 forbidden-pattern grep on `scripts/editorial/` returns no output — `@/`, `Date.now()`, `new Date(`, `os.EOL`, `Promise.all` all absent
- Vitest project topology unchanged at 3 (`unit`, `browser`, `scripts`) — SCAF-06 "no new project" contract honored
- All 5 Phase 46 success criteria from ROADMAP demonstrably TRUE

## Task Commits

This plan is a verification gate. Only the inline deviation fix produced a code change (Task 1); Task 2 produced no source changes. The plan-completion docs commit will be the SUMMARY + ROADMAP update.

1. **Task 1: Smoke-run pnpm build (SCAF-02 success criterion 2)** — `824e3c2` (fix) — auto-fixed missing `vitest/globals` in tsconfig.editorial.json types array (Rule 3 — blocking issue)
2. **Task 2: Smoke-run pnpm editorial:capture + pnpm test:scripts (SCAF-04, SCAF-06)** — no source change (verification only)

**Plan metadata:** TBD on final commit (this SUMMARY + ROADMAP.md update)

## Files Created/Modified

- `tsconfig.editorial.json` — `types` array extended from `["node"]` to `["node", "vitest/globals"]` so vue-tsc can resolve ambient `describe`/`it`/`expect` symbols in `scripts/editorial/__tests__/smoke.test.ts`. No other compilerOptions changed.
- `.planning/phases/46-scaffold/46-05-SUMMARY.md` — this file.

## Smoke command outputs (verbatim excerpts)

### `pnpm build`

```
> pattern158-vue@0.1.0 build /home/xhiris/projects/pattern158-vue
> vue-tsc -b && vite build && pnpm build:markdown

vite v6.4.1 building for production...
transforming...
✓ 177 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                                 1.79 kB │ gzip:  0.78 kB
... (24 dist chunks omitted) ...
✓ built in 906ms

> pattern158-vue@0.1.0 build:markdown /home/xhiris/projects/pattern158-vue
> tsx scripts/markdown-export/index.ts

<!-- auto-generated by scripts/markdown-export — do not edit by hand -->
```
Exit code: 0.

`.tsbuildinfo-editorial/` listing after build:

```
.tsbuildinfo-editorial/scripts/editorial/config.d.ts
.tsbuildinfo-editorial/scripts/editorial/index.d.ts
.tsbuildinfo-editorial/scripts/editorial/routes.d.ts
.tsbuildinfo-editorial/scripts/editorial/convert.d.ts
.tsbuildinfo-editorial/scripts/editorial/write.d.ts
.tsbuildinfo-editorial/scripts/editorial/capture.d.ts
.tsbuildinfo-editorial/scripts/editorial/types.d.ts
.tsbuildinfo-editorial/scripts/editorial/__tests__/smoke.test.d.ts
.tsbuildinfo-editorial/tsconfig.editorial.tsbuildinfo
```
8 `.d.ts` files (one per source `.ts` in `scripts/editorial/`) — proves tsc actually compiled the project, did not silently skip it.

`git status --porcelain | grep tsbuildinfo-editorial` → no output (SCAF-07 confirmed).

### `pnpm editorial:capture`

```
> pattern158-vue@0.1.0 editorial:capture /home/xhiris/projects/pattern158-vue
> tsx scripts/editorial/index.ts

<!-- editorial capture tool — phase 46 scaffold placeholder -->
```
Exit code: 0. Banner matches Plan 01's `PLACEHOLDER_BANNER` constant verbatim.

### `pnpm test:scripts`

```
 RUN  v4.1.2 /home/xhiris/projects/pattern158-vue

 Test Files  16 passed (16)
      Tests  145 passed (145)
   Start at  08:38:18
   Duration  282ms (transform 780ms, setup 0ms, import 1.10s, tests 72ms, environment 6ms)
```
Exit code: 0.

Verbose reporter confirms `smoke.test.ts` discovered:
```
✓ |scripts| scripts/editorial/__tests__/smoke.test.ts > editorial scaffold smoke > reaches the placeholder type surface from types.ts 1ms
✓ |scripts| scripts/editorial/__tests__/smoke.test.ts > editorial scaffold smoke > uses only literal newline endings (SCAF-08 determinism check on test file itself) 1ms
```
Existing `scripts/markdown-export/**/*.test.ts` tests (escape, ir, primitives, frontmatter) all still pass — zero regression from Plan 04's include-array reformat.

### SCAF-08 forbidden-pattern grep

```
$ grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/
$ echo $?
1
```
Empty output, exit 1 (no matches). Plan 01's discipline held.

### Vitest project topology check

```
$ grep -c "name: '" vitest.config.ts
3
```
Three projects (`unit`, `browser`, `scripts`) — SCAF-06 "no new Vitest project" contract honored.

## Phase 46 success criteria — proof matrix

| # | ROADMAP criterion | Proof |
|---|-------------------|-------|
| 1 | `scripts/editorial/` flat layout exists; placeholder files compile cleanly | `ls scripts/editorial/` shows `index.ts`, `config.ts`, `routes.ts`, `capture.ts`, `convert.ts`, `write.ts`, `types.ts`, `__tests__/`. `pnpm build` (Task 1) exits 0 — every file compiled. |
| 2 | `tsconfig.editorial.json` exists, listed in root `references`, `pnpm build` (vue-tsc -b) zero errors | `tsconfig.editorial.json` present (Plan 02). `tsconfig.json` `references[]` includes `./tsconfig.editorial.json` (Plan 02). `pnpm build` exit 0 (Task 1). 8 `.d.ts` files emitted (proof of actual compilation, not skip). |
| 3 | `turndown@^7.2.4`, `@joplin/turndown-plugin-gfm@^1.0.64`, `@types/turndown@^5.0.6` installed; `playwright` bumped to `^1.59.1`; `pnpm-lock.yaml` reflects all four | `package.json` `devDependencies` shows all four entries (Plan 03). `pnpm install` was run in Plan 03 — `pnpm editorial:capture` (Task 2) successfully resolves `tsx` (also a Plan 03 dep), proving the lockfile-driven install completed. |
| 4 | `pnpm editorial:capture` runs `tsx scripts/editorial/index.ts` and exits cleanly | Task 2: exit 0, expected banner on stdout. |
| 5 | `pnpm test:scripts` discovers and runs tests under `scripts/editorial/__tests__/`; `.tsbuildinfo-editorial` is in `.gitignore` | Task 2: 16 test files / 145 tests passed; verbose reporter explicitly lists `scripts/editorial/__tests__/smoke.test.ts > editorial scaffold smoke > ...`. `.gitignore` contains `.tsbuildinfo-editorial/` (Plan 04) and `git status` after `pnpm build` shows zero entries matching `tsbuildinfo-editorial` (Task 1). |

All 5 criteria PASS. Phase 46 success criteria are demonstrably TRUE end-to-end.

## Decisions Made

- **Fix the tsconfig types array, not the smoke test.** When `pnpm build` failed on Task 1 with TS2593/TS2304 (`Cannot find name 'describe'/'it'/'expect'`), two valid fixes existed: (a) add `vitest/globals` to `tsconfig.editorial.json` `types`, or (b) add explicit `import { describe, it, expect } from 'vitest'` to the smoke test (matching how `scripts/markdown-export/escape/prose.test.ts` does it). Chose (a) because: (1) the smoke test's own header comment says "Globals (describe/it/expect) are ambient because the scripts Vitest project declares globals=true in vitest.config.ts — no explicit imports needed" — fix (a) makes that comment true; (2) future Phase 47-50 test files can rely on the same convention without per-file boilerplate; (3) the runtime behavior is unchanged either way (vitest config `globals: true` was already correct). Trade-off: tsconfig.editorial.json now diverges slightly from tsconfig.scripts.json (which still uses `types: ["node"]` — and works because markdown-export tests use explicit imports). That divergence is acceptable: each tsconfig declares the types its own test files actually need.
- **Wave 2 as a separate gate plan, not folded into Plan 04.** Confirmed valuable: the build break surfaced HERE, in the gate plan that owns smoke verification, not in Phase 47 when someone is trying to write `config.ts`. The fix took ~1 minute because the failure mode was specific and isolated — the tsconfig edit landed on first try.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Add `vitest/globals` to tsconfig.editorial.json `types` array**

- **Found during:** Task 1 (`pnpm build`)
- **Issue:** `vue-tsc -b` reported 7 errors on `scripts/editorial/__tests__/smoke.test.ts`:
  - TS2593: `Cannot find name 'describe'`
  - TS2593: `Cannot find name 'it'` (×2)
  - TS2304: `Cannot find name 'expect'` (×5)
  
  Root cause: Plan 01's smoke test was authored to rely on vitest globals (per its own header comment, intentionally — for ergonomic parity with how Phase 47-50 tests will be written). Plan 02's `tsconfig.editorial.json` mirrored `tsconfig.scripts.json` shape exactly (`types: ["node"]`). The `globals: true` in `vitest.config.ts` only affects vitest's *runtime* test discovery — `vue-tsc` (which is invoked first by `pnpm build`) needs the type declarations to be visible at compile time, which means adding `vitest/globals` to the project's `types` array.
- **Fix:** Edit `tsconfig.editorial.json`: change `"types": ["node"]` to `"types": ["node", "vitest/globals"]`. Single-line change. Re-ran `pnpm build` — exit 0, all 8 `.d.ts` files emitted as expected.
- **Files modified:** `tsconfig.editorial.json` (1 line changed)
- **Commit:** `824e3c2` (`fix(46-05): add vitest/globals to editorial tsconfig types`)
- **Why this is Rule 3 not Rule 4:** Not architectural — it's a config mismatch between two Wave 1 outputs (Plan 01's test design + Plan 02's tsconfig types). The fix is local, reversible, and doesn't change the scaffold shape or any other plan's output. No new dependencies, no schema change, no API change.

## Issues Encountered

### Authentication gates

None — all three smoke commands ran to completion locally without external service interaction.

### Warnings

- **`vue-tsc -b` is silent on success.** Default output writes nothing when the project graph is up-to-date or successfully built. The proof of work is the `.tsbuildinfo-editorial/` directory listing (8 .d.ts files) and exit code 0, not stdout. Verified explicitly.
- **`pnpm install` was not re-run** because Plan 03 already completed it in Wave 1. Confirmed by: (a) `pnpm editorial:capture` resolves `tsx` (added in Plan 03) successfully; (b) `pnpm test:scripts` resolves vitest globals successfully. If the install had been incomplete, both commands would have failed with module-not-found errors.

## User Setup Required

None — this is a pure smoke gate. No external service config, no credentials, no manual verification steps.

## Next Phase Readiness

**Phase 46 is COMPLETE.** Hand-off note for Phase 47 (Config + Routes):

- The scaffold is proven end-to-end. Phase 47 can write real `types.ts`, `config.ts`, and `routes.ts` knowing:
  1. `pnpm build` will pick up changes (composite project, watch via `vue-tsc -b -w` available)
  2. New test files under `scripts/editorial/__tests__/` will be auto-discovered by `pnpm test:scripts` (single glob extension already in place)
  3. New test files can use ambient `describe`/`it`/`expect` (no per-file vitest import needed) — see decision above
  4. `tsx scripts/editorial/index.ts` works — Phase 47 only needs to replace `main()` body
- Phase 47 should NOT touch `tsconfig.editorial.json`, `vitest.config.ts`, or `package.json` scripts unless adding a new dep — the scaffold is locked.
- The placeholder TS files (`config.ts`, `routes.ts`, etc.) have empty/stub re-exports per Plan 01 — Phase 47 will replace those bodies with real implementations. The `types.ts` re-export shape (`EditorialConfig`, `Route`, `CapturedPage`, `ConvertedPage`) is the contract that the smoke test pins down — keep those four type names exported so the smoke test stays green.

No blockers, no concerns.

## Self-Check: PASSED

Verified post-write:

**Files modified exist with expected content:**
- `tsconfig.editorial.json` — FOUND, `types` array now `["node", "vitest/globals"]`
- `.planning/phases/46-scaffold/46-05-SUMMARY.md` — FOUND (this file)

**Commits exist in git log:**
- `824e3c2` — FOUND (`fix(46-05): add vitest/globals to editorial tsconfig types`)

**Build artifacts confirmed:**
- `.tsbuildinfo-editorial/` exists with 8 `.d.ts` files
- `git status --porcelain | grep tsbuildinfo-editorial` returns no output

**Smoke commands re-verified manually:** `pnpm build` exit 0; `pnpm editorial:capture` stdout contains `phase 46 scaffold placeholder`; `pnpm test:scripts` exit 0 with 145/145 tests passing including both smoke.test.ts cases.

---
*Phase: 46-scaffold*
*Completed: 2026-04-20*
