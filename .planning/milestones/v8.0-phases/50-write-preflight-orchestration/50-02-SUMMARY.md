---
phase: 50-write-preflight-orchestration
plan: 02
subsystem: editorial-capture
tags: [atomic-write, mirror, fs-promises, idempotent, vitest, phase-50, WRIT-03, WRIT-04, WRIT-05]

# Dependency graph
requires:
  - phase: 46-editorial-capture-scaffold
    provides: "Phase 46 write.ts throwing stub (writeMonolithicMarkdown) — replaced in this plan"
  - phase: 47-config-routes-pure-logic
    provides: "EditorialConfig contract (outputPath / mirror fields) and preflight guarantee that config.outputPath parent exists + is writable"
provides:
  - "atomicWrite(absPath, content): PID-suffixed temp file + fsp.rename with best-effort unlink cleanup on failure"
  - "writePrimaryAndMirror(config, content): primary write unconditional, mirror guarded by config.mirror, .planning/research/ mkdir recursive, mirror failure logged+absorbed"
  - "MIRROR_RELATIVE_PATH constant (.planning/research/site-editorial-capture.md) — hardcoded, never user-controlled"
  - "write.test.ts: 13 hermetic Vitest cases covering mocked temp+rename sequence, mocked mirror on/off/failure paths, real-fs idempotency + byte-verbatim + dual-write integration"
affects: [50-03-index-orchestrator, 51-editorial-review]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "vi.mock('node:fs/promises', factory) + vi.hoisted state holders — sidesteps ESM 'Cannot redefine property' on vi.spyOn over namespace bindings"
    - "Mock-swap pattern for real-fs integration — beforeEach delegates mock impls to vi.importActual so tmpdir-based tests exercise the true filesystem while the module-under-test still resolves through vi.mock"
    - "process.cwd spy for mirror path redirection — vi.spyOn(process, 'cwd').mockReturnValue(tmpDir) keeps mirror writes hermetic without env mutation"

key-files:
  created:
    - scripts/editorial/__tests__/write.test.ts
  modified:
    - scripts/editorial/write.ts

key-decisions:
  - "atomicWrite is fully path-trusting — Phase 47 preflight is the validation boundary; re-validating in write.ts would duplicate logic and couple layers"
  - "Mirror path is a file-scope const (MIRROR_RELATIVE_PATH) not a config field — CONTEXT.md LOCKS the relative path and making it configurable would expose user-controlled path traversal surface"
  - "Mirror parent dir mkdir uses { recursive: true } — matches Phase 48's ensureScreenshotDir pattern; no pre-check; idempotent"
  - "Mirror failure LOGS to stderr and returns { primaryPath } only — mirror is optional per WRIT-05; losing the repo-scoped copy should not fail an otherwise successful editorial capture"
  - "Primary write is load-bearing: if atomicWrite(config.outputPath, content) throws, writePrimaryAndMirror rejects immediately — mirror block is skipped entirely (Test 2e locks this)"
  - "Rule 3 auto-fix during execution: vi.spyOn(fsp, ...) failed with 'Cannot redefine property' under ESM NodeNext in Vitest 4 — swapped to vi.mock + vi.hoisted pattern, which works in the same scripts test project without requiring module graph changes"
  - "Rule 1 auto-fix during execution: TS2322 Promise<void> vs Promise<undefined> when the real-fs block swapped mock impls to realFsp.rename/unlink/mkdir — added .then(() => undefined) thenables to coerce the return types to match the hoisted mock signature"

patterns-established:
  - "vi.hoisted + vi.mock(nodeModule, factory) for mocking ESM namespace bindings that vi.spyOn cannot touch"
  - "Real-fs integration inside an otherwise-mocked module — swap mock impls to delegate to vi.importActual instead of splitting into two test files"
  - "PID-suffixed temp filename convention (${absPath}.tmp-${process.pid}) — collision-free under accidental parallel runs, deterministic for assertion"
  - "Stderr-logged best-effort side-effect on the mirror path — primary write is load-bearing, mirror is optional; diagnostic emission must not affect exit code"

requirements-completed: [WRIT-03, WRIT-04, WRIT-05]

# Metrics
duration: 6min
completed: 2026-04-21
---

# Phase 50 Plan 02: Write (atomicWrite + mirror) Summary

**PID-suffix-tempfile atomic writer with optional `.planning/research/` mirror — primary load-bearing, mirror best-effort; 13 new Vitest cases covering mocked temp+rename sequence, mocked mirror success/failure paths, and real-fs idempotency + byte-verbatim preservation**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-21T02:43:51Z
- **Completed:** 2026-04-21T02:49:39Z
- **Tasks:** 2
- **Files modified:** 2 (1 created, 1 rewritten)

## Accomplishments

- **WRIT-03 (atomic temp+rename)** — `atomicWrite(absPath, content)` writes to `${absPath}.tmp-${process.pid}` with explicit `{ encoding: 'utf8' }`, then `fsp.rename`s over the destination. Best-effort `fsp.unlink(temp).catch(() => undefined)` in the catch block prevents stale sibling temp files on failure.
- **WRIT-04 (idempotent overwrite)** — Real-fs integration test writes twice to the same path with different content; second content wins; `readdir(tmpDir)` returns exactly `['out.md']` (zero `*.tmp-<pid>` leaks).
- **WRIT-05 (optional mirror)** — `writePrimaryAndMirror(config, content)` writes primary unconditionally; mirror only when `config.mirror === true`; mirror parent dir created with `{ recursive: true }`; mirror failure (mkdir EACCES or mirror atomicWrite throw) logged to stderr and absorbed, returning `{ primaryPath }` only.
- **Phase 46 stub removed** — `writeMonolithicMarkdown` (throwing placeholder) and its unused `ConvertedPage` import are deleted; the new public surface is exactly two exports.
- **13-test delta** — `pnpm test:scripts` 350 → 363 (22 files total, up from 21). All existing tests still green.

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace write.ts stub with atomicWrite + writePrimaryAndMirror** — `be56fb6` (feat)
2. **Task 2: Create write.test.ts — mocked fsp + real-fs integration** — `d45c0bd` (test)

**Plan metadata:** will be added with this SUMMARY + STATE.md (docs).

## Files Created/Modified

- `scripts/editorial/write.ts` — **rewritten from Phase 46 stub**. Exports `atomicWrite` + `writePrimaryAndMirror`. `MIRROR_RELATIVE_PATH = '.planning/research/site-editorial-capture.md'` file-scope const. 73 lines. Imports only `node:fs/promises`, `node:path`, and the `EditorialConfig` type.
- `scripts/editorial/__tests__/write.test.ts` — **created**. 369 lines; 13 `it()` cases across 3 `describe` blocks: `atomicWrite (mocked fsp)` (4 cases), `writePrimaryAndMirror (mocked fsp)` (5 cases), `atomicWrite + writePrimaryAndMirror (real fs)` (4 cases).

## Key Decisions

- **Atomic temp-filename convention**: `${absPath}.tmp-${process.pid}`. Plan/CONTEXT-locked. Collision-free under accidental parallel runs (OS guarantees unique PIDs per live process).
- **Mirror path is file-scope const** (not config field). Hardcoded `.planning/research/site-editorial-capture.md`. Resolved via `nodePath.resolve(process.cwd(), MIRROR_RELATIVE_PATH)` so the mirror always lands under the repo root where `pnpm editorial:capture` was invoked.
- **Mirror failure is absorbed** — stderr-logged via `process.stderr.write('[editorial-capture] mirror write failed: <msg>\n')`; returns `{ primaryPath }` without `mirrorPath`. Primary failure rejects the whole function; mirror block skipped entirely.
- **Test strategy**: `vi.mock('node:fs/promises', factory)` + `vi.hoisted` state holders. The factory spreads `vi.importActual` as a base layer (so `mkdtemp`/`rm`/`readFile`/`readdir` used by real-fs tests remain live) and overrides the four functions the writer touches (`writeFile`, `rename`, `unlink`, `mkdir`) with hoisted `vi.fn()`s that tests control per-case via `mockImplementation`/`mockRejectedValue`.
- **Real-fs integration inside the same file**: Instead of splitting into `write.unit.test.ts` + `write.integration.test.ts`, a third `describe` block re-delegates the hoisted mocks to `vi.importActual`-resolved `realFsp`. One test file, two behaviors, no module graph duplication.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] ESM namespace spy failure**

- **Found during:** Task 2 (initial write.test.ts run).
- **Issue:** `vi.spyOn(fsp, 'writeFile')` (as the plan's action step prescribed) threw `TypeError: Cannot spy on export "writeFile". Module namespace is not configurable in ESM.` under Vitest 4 + NodeNext ESM. All 9 mocked tests failed with "Cannot redefine property".
- **Fix:** Replaced `vi.spyOn(fsp, ...)` with `vi.mock('node:fs/promises', async () => ({ ...await vi.importActual(...), writeFile: state.writeFile, rename: state.rename, unlink: state.unlink, mkdir: state.mkdir }))`. State holders declared via `vi.hoisted` so they survive the `vi.mock` hoist. The real-fs `describe` block delegates the hoisted mocks back to `vi.importActual` via `mockImplementation`.
- **Files modified:** `scripts/editorial/__tests__/write.test.ts` (only — write.ts is unchanged; the public API surface is preserved exactly).
- **Verification:** `pnpm test:scripts` 363/363 pass. All behaviors the plan called out (PID-suffix tempfile, rename-after-writeFile ordering, best-effort unlink on failure, original-error-preservation, primary-only vs mirror, mkdir reject → primary-only + stderr, mirror-writeFile reject → primary-only + stderr, primary reject aborts mirror block) are locked by the 13 test cases.
- **Committed in:** `d45c0bd` (Task 2 commit).

**2. [Rule 1 - Bug] TS2322 Promise&lt;void&gt; vs Promise&lt;undefined&gt; in real-fs mock swap**

- **Found during:** Task 2 build verification after the vi.mock rewrite.
- **Issue:** `pnpm build` caught `error TS2322: Type 'Promise<void>' is not assignable to type 'Promise<undefined>'` on `state.rename.mockImplementation((from, to) => realFsp.rename(...))` and `state.unlink.mockImplementation((p) => realFsp.unlink(p))`. The hoisted mocks were declared returning `Promise<undefined>` (from `async () => undefined`), but `realFsp.rename`/`unlink` return `Promise<void>`.
- **Fix:** Added `.then(() => undefined)` chained on all four real-fs delegations (`writeFile`, `rename`, `unlink`, `mkdir`) to coerce the return type to the hoisted signature.
- **Files modified:** `scripts/editorial/__tests__/write.test.ts`.
- **Verification:** `pnpm build` exit 0. Tests still green at 363/363.
- **Committed in:** `d45c0bd` (Task 2 commit — same as deviation 1, TS error surfaced only once the vi.mock rewrite introduced the delegation pattern).

---

**Total deviations:** 2 auto-fixed (1 blocking ESM spy failure, 1 TS build error in the fix for deviation 1)
**Impact on plan:** Both auto-fixes are scoped to the test file; the plan-locked public API surface of `write.ts` (the two exports, the PID-temp-rename sequence, the mirror semantics) is preserved verbatim. No scope creep, no architectural changes. Behaviors under test are identical to the plan's enumerated test cases.

## Issues Encountered

- **ESM "Cannot redefine property" on namespace spy** — The plan's action step prescribed `vi.spyOn(fsp, 'writeFile')` as the mocking entry point. This works for `vi.spyOn(chromium, 'launch')` (Phase 48) because `playwright`'s `chromium` export is a plain object, but `node:fs/promises` exports non-configurable bindings under Vitest 4's ESM resolver. Swapped to `vi.mock` + `vi.hoisted` — documented as deviation 1 above. **Lesson for future Phase 50 plans (and any plan mocking `node:*` modules):** `vi.spyOn` works on plain object exports but fails on ESM namespace bindings; `vi.mock` with `vi.importActual` spread + `vi.hoisted` state is the correct pattern for `node:fs/promises`, `node:child_process`, etc.

## SCAF-08 Grep Gate

Verified clean on both files:

| Token | write.ts | write.test.ts |
| ----- | -------- | ------------- |
| `Date.now(` | absent | absent |
| `new Date(` | absent | absent |
| `os.EOL` | absent | absent |
| `Promise.all` | absent | absent |
| `setTimeout` | absent | absent |
| `from '@/` | absent | absent |

One-shot grep: `! grep -qE "Date\.now\(|new Date\(|os\.EOL|Promise\.all|setTimeout|from '@/" scripts/editorial/write.ts scripts/editorial/__tests__/write.test.ts` — exits 0.

## Build + Test Results

- `pnpm build` — exit 0 (TS2322 auto-fixed; full repo including `build:markdown` step passes).
- `pnpm test:scripts` — 22 files / 363 tests pass (baseline 21/350; delta +1 file / +13 tests).

## Phase 50-03 Readiness

- `writePrimaryAndMirror(config, content)` is ready to wire into the Phase 50-03 orchestrator:
  ```ts
  import { writePrimaryAndMirror } from './write.ts'
  const { primaryPath, mirrorPath } = await writePrimaryAndMirror(config, documentContent)
  ```
- `primaryPath` (always defined) and `mirrorPath` (defined iff `config.mirror === true` AND mirror write succeeded) can be surfaced directly in the stdout / stderr-JSON run summary.
- The Phase 46 `writeMonolithicMarkdown` symbol is gone from `write.ts`; any leftover reference anywhere in the tree would fail TypeScript compilation. Verified: `grep -rn "writeMonolithicMarkdown" --include="*.ts"` returns only stale `.tsbuildinfo-editorial/` artifacts, not source.

## Next Phase Readiness

- **Plan 50-03 (orchestrator `index.ts`)** — ready. Write surface is complete; combined with Plan 50-01's document assembler, the pipeline shape is `config → routes → capture → convert → assembleDocument → writePrimaryAndMirror`.
- **No blockers.**

## Self-Check: PASSED

- `scripts/editorial/write.ts` — FOUND (73 lines; exports `atomicWrite` + `writePrimaryAndMirror`; no `writeMonolithicMarkdown`).
- `scripts/editorial/__tests__/write.test.ts` — FOUND (369 lines; 13 `it()` cases across 3 `describe` blocks).
- Commit `be56fb6` — FOUND in `git log --all`.
- Commit `d45c0bd` — FOUND in `git log --all`.
- `pnpm build` exit 0 — verified.
- `pnpm test:scripts` 363/363 — verified.
- SCAF-08 grep gate — verified clean on both files.

---
*Phase: 50-write-preflight-orchestration*
*Plan: 02*
*Completed: 2026-04-21*
