---
phase: 50-write-preflight-orchestration
fixed_at: 2026-04-20T20:19:00Z
review_path: .planning/phases/50-write-preflight-orchestration/50-REVIEW.md
iteration: 1
findings_in_scope: 2
fixed: 2
skipped: 0
status: all_fixed
---

# Phase 50: Code Review Fix Report

**Fixed at:** 2026-04-20T20:19:00Z
**Source review:** `.planning/phases/50-write-preflight-orchestration/50-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 2 (2 Warnings; 5 Info deferred per fix_scope)
- Fixed: 2
- Skipped: 0

**Gates:**
- `pnpm test:scripts` → 391/391 passing (after both fixes)
- `pnpm build` → exit 0 (after both fixes)
- SCAF-08 token ledger in `scripts/editorial/index.ts` → 1 `new Date(` + 2 `execSync` (unchanged; no forbidden tokens added)

## Fixed Issues

### WR-01: `context.close()` in outer-finally dereferences `context` even when `newContext()` failed

**Files modified:** `scripts/editorial/index.ts`
**Commit:** `fbdedee`
**Applied fix:**
- Added `import type { BrowserContext } from 'playwright'` to the top-of-file import block (type-only, zero runtime cost; `BrowserContext` is already re-exported from Phase 48's `capture.ts`).
- Declared `let context: BrowserContext | undefined` before the outer try.
- Moved `context = await browser.newContext(buildContextOptions())` inside the outer try.
- Collapsed the nested try/finally into a single outer try; the unified `finally` now runs `await context?.close()` (no-ops when `newContext` threw before assignment) followed by `await browser.close()`.
- Close-ordering invariant (context → browser) preserved.
- Comment block rewritten to document the new guard against future awaitable insertions between `context = ...` and the per-route loop.

**Verification:**
- Tier 1: re-read lines 151-215; `let context`, outer-try assignment, and unified finally all present and syntactically intact.
- Tier 2: `pnpm test:scripts` → 23/23 test files, 391/391 tests passing (no TS diagnostics in the modified file).

### WR-02: CLI-invocation guard breaks on paths with spaces or URL-encoded characters

**Files modified:** `scripts/editorial/index.ts`
**Commit:** `383b9cd`
**Applied fix:**
- Added `import { fileURLToPath } from 'node:url'` (runtime import; added alongside the `BrowserContext` type import in the WR-01 edit, committed at WR-02 activation).
- Replaced `if (import.meta.url === \`file://${process.argv[1]}\`)` with `if (process.argv[1] === fileURLToPath(import.meta.url))`.
- Extended the guard comment to document why the previous string-concatenation form was fragile and why `fileURLToPath` is portable across paths containing spaces, unicode, `#`, `?`, and other URL-reserved characters.

**Verification:**
- Tier 1: re-read lines 330-345; `fileURLToPath` symbol imported from `node:url` at line 21 and referenced at line 343.
- Tier 2: `pnpm test:scripts` → 391/391 passing; `pnpm build` exit 0. The CLI guard is intentionally unreachable under Vitest (module is imported, not executed as entry), so the tests do not evaluate the guard branch but do confirm no import-time resolution failures.

## Skipped Issues

None. All in-scope findings were fixed.

## Out-of-Scope Findings

Per fix_scope = `critical_warning`, the 5 Info findings (IN-01 through IN-05) were deferred:

- **IN-01** — documentary-only ToC trailing-newline asymmetry in `document.ts`; the empty-routes path is unreachable from `main()`.
- **IN-02** — `extractSiteVersionSha` regex attribute-order assumption; downstream `SAFE_SHA_RE` is the authoritative guard.
- **IN-03** — mocked `assembleDocument` / `writePrimaryAndMirror` returns in the integration test; end-to-end byte-integrity lands in Phase 51 first-live-run.
- **IN-04** — `process.cwd()` coupling in `write.ts` mirror-path resolution; documented usage (`pnpm editorial:capture` from repo root) holds.
- **IN-05** — silent `git` ENOENT fallback to `editorial-capture/unknown`; behavior is safe, only the stderr signal is missing.

These may be addressed in a later grooming pass or during Phase 51.

---

_Fixed: 2026-04-20_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
