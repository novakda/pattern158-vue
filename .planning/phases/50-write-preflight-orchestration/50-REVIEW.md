---
phase: 50-write-preflight-orchestration
reviewed: 2026-04-20T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - scripts/editorial/index.ts
  - scripts/editorial/document.ts
  - scripts/editorial/write.ts
  - scripts/editorial/__tests__/index.test.ts
  - scripts/editorial/__tests__/document.test.ts
  - scripts/editorial/__tests__/write.test.ts
  - scripts/editorial/types.ts
findings:
  critical: 0
  warning: 2
  info: 5
  total: 7
status: issues_found
---

# Phase 50: Code Review Report

**Reviewed:** 2026-04-20
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Phase 50 wires the editorial-capture pipeline end-to-end: `config → routes → capture → convert → document → write → summary → exit`. The implementation is disciplined and holds tight to the locked SCAF-08 determinism contract: wall-clock and `execSync` reads are concentrated at a single orchestration boundary (`main()`), library modules (`document.ts`, `write.ts`) are pure, and the frontmatter SHA-injection threat (T-50-01) is defended via a strict `[a-zA-Z0-9._+-]*` allowlist.

**Strengths**
- Nested try/finally cleanup for browser + context is correct on every abort path.
- Atomic write uses the canonical temp+rename pattern with best-effort temp cleanup on error, preserving the original error.
- Interstitial discriminator is case-insensitive, tied to Phase 48's locked message format, and unit-tested for 6 branches.
- Frontmatter builder uses `yaml.stringify` against a plain object (no hand-rolled string splicing), so YAML structural chars from untrusted input either pass `SAFE_SHA_RE` or fall back to empty string — any that do flow through are quoted/escaped by `yaml.stringify`, not interpolated raw.
- `git rev-parse --short HEAD` / `git status --porcelain` use static string commands with no user-controlled interpolation — no shell-injection surface.
- Determinism lock: the entire document body is a pure function of inputs; two unit tests assert byte-equality on rich multi-route fixtures.

**Key concerns**
- The per-route capture loop creates a `tempPage` for inter-request delay but the page inside `capturePage` is not tracked by the orchestrator — Phase 48 owns its own page lifecycle, which is fine. However, the orchestrator's comment at line 156 mentions `const page = await context.newPage()` in the pseudocode but the real code correctly delegates to `capturePage` which creates its own page. Cosmetic.
- One genuine bug: if `loadEditorialConfig()` or `buildRoutes()` throw after `startHrtime` / `capturedAt` are read but before the browser is launched, there is no cleanup needed — safe. But if `ensureScreenshotDir` or `loadFaqItemCount` throw, they also run before browser launch — also safe.
- The real concern is the `context.close()` path: `context` is declared inside the outer try, so if `browser.newContext(...)` itself throws, the `finally { await context.close() }` block will throw `ReferenceError: context is not defined` (or TypeError on undefined). See WR-01.

All findings below are non-blocking for Phase 51 unblocking. None rise to the Critical bar (no injection, no data loss, no auth bypass, no crash in the documented happy or documented failure paths).

## Warnings

### WR-01: `context.close()` in outer-finally dereferences `context` even when `newContext()` failed

**File:** `scripts/editorial/index.ts:154-205`
**Issue:** The nested try/finally structure declares `context` via `const context = await browser.newContext(...)` on line 154, inside the outer `try { ... } finally { await browser.close() }`. The inner try/finally block's `finally { await context.close() }` on line 204 runs unconditionally — but if `browser.newContext(buildContextOptions())` itself rejects, `context` was never assigned, and the inner `finally` block is never reached (because the inner `try` never opened). That part is actually fine. **However**, if an exception throws between the `const context = ...` assignment and the inner `try {` block (there is none in the current code, so this is latent risk only), the `finally` block would try to close an undefined `context`. More concretely today: the inner try covers lines 155-202, and `const context = ...` is on line 154 — outside the inner try. So a throw from `newContext` cannot trigger the inner finally. The code is correct by construction today, but the pattern is fragile — a future edit that moves any awaitable between `const context = ...` and `try {` (e.g., logging, context configuration) would create a real dereference bug.
**Fix:**
```ts
let context: BrowserContext | undefined
try {
  context = await browser.newContext(buildContextOptions())
  try {
    // ... capture loop
  } finally {
    await context.close()
  }
} finally {
  await browser.close()
}
```
Or, preferred, hoist `newContext` into the same try and narrow the finally:
```ts
try {
  const context = await browser.newContext(buildContextOptions())
  try { ... } finally { await context.close() }
} finally {
  await browser.close()
}
```
(The current code already matches the second form — the warning is primarily to document the brittleness against future edits.)

### WR-02: CLI-invocation guard breaks on paths with spaces or URL-encoded characters

**File:** `scripts/editorial/index.ts:329`
**Issue:** The guard `if (import.meta.url === \`file://${process.argv[1]}\`)` naively concatenates `file://` with `process.argv[1]`. `import.meta.url` is always a fully-URL-encoded `file://` URL (spaces become `%20`, unicode percent-encoded, etc.), whereas `process.argv[1]` is a raw filesystem path. On any system where the repo is cloned into a path containing a space, unicode, `#`, `?`, or other URL-reserved character, the two strings will not compare equal and `main()` will never fire — the tool silently does nothing under `tsx scripts/editorial/index.ts`. This does not affect `pnpm editorial:capture` on CI (where the repo path is ASCII-safe) nor the author's current `/home/xhiris/projects/pattern158-vue` checkout. But it is a real portability bug.
**Fix:**
```ts
import { fileURLToPath } from 'node:url'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(handleTopLevelError)
}
```
This is the Node-idiomatic ESM entrypoint-detection idiom and is robust against all path-character pathologies.

## Info

### IN-01: Empty-ToC output has an unexpected trailing blank line

**File:** `scripts/editorial/document.ts:155,166`
**Issue:** `buildToc([], [], [])` initializes `lines = ['## Contents', '']` and then returns `lines.join('\n')`, yielding `'## Contents\n'` — not `'## Contents'`. The test at `document.test.ts:163-165` locks this behavior (`expect(toc).toBe('## Contents\n')`), so it is intentional, but it is subtle: the empty-ToC output carries a trailing newline that the non-empty-ToC output does not. In `assembleDocument`, the TOC is joined with `parts.push(frontmatter, '', toc, '', '---', '')` + `parts.join('\n')`, which can produce `## Contents\n\n\n---` (three consecutive newlines) in the empty-routes case. Phase 50 never actually reaches this case (routes is always non-empty from `buildRoutes`), so this is documentary only.
**Fix:** Either document the asymmetry in the `buildToc` JSDoc, or normalize to `lines.join('\n')` without the trailing `''`:
```ts
const lines: string[] = ['## Contents']
if (routes.length > 0) lines.push('')  // blank separator only when bullets follow
```

### IN-02: `extractSiteVersionSha` regex does not constrain attribute order

**File:** `scripts/editorial/index.ts:93-95`
**Issue:** The regex `/<meta\s+name="git-sha"\s+content="([^"]+)"/i` assumes `name` appears before `content`. HTML allows arbitrary attribute order: `<meta content="abc123" name="git-sha">` would not match. This is a known limitation — the home page template is under our control, so order is stable — but the downstream `sanitizeSha` in `buildFrontmatter` serves as a safety net (any garbage extracted here gets scrubbed there). Worth noting in a comment so future template edits that reorder attributes don't silently break the SHA extraction.
**Fix:** Either switch to a real HTML parser (happy-dom is already a dep via `convert.ts`) or widen the regex and sort out captures:
```ts
const metaTag = home.mainHtml.match(/<meta\s+[^>]*name="git-sha"[^>]*>/i)?.[0]
const match = metaTag?.match(/content="([^"]+)"/i)
return match?.[1] ?? ''
```
Better still, document the assumption in JSDoc and rely on `SAFE_SHA_RE` downstream.

### IN-03: Integration tests mock `assembleDocument` and `writePrimaryAndMirror` to opaque returns

**File:** `scripts/editorial/__tests__/index.test.ts:113,118-122`
**Issue:** The happy-path integration test (`2 successful routes`) mocks `assembleDocument` to always return the string `'DOC'` and `writePrimaryAndMirror` to a fixed result. This lets the test verify that `main()` calls these functions with the right inputs, but it does NOT verify end-to-end byte-integrity: a regression in how `main()` wires up captured/failures/routes into the `assembleDocument` input would be caught here (the test does inspect `asmInput.captured`, `asmInput.failures`, `asmInput.capturedAt`). This is reasonable for unit scope. The gap to flag: no test proves the `documentContent` string actually flows unchanged into `writePrimaryAndMirror` — `mock.calls[0][1]` is checked against literal `'DOC'`, which is the mock's return, not a real assembled document. A Phase 51 first-live-run will be the end-to-end proof. Acceptable for v1.
**Fix:** (optional) Add one test that uses the real `assembleDocument` and only mocks Playwright + fs boundaries, proving the full document bytes flow through.

### IN-04: `writePrimaryAndMirror` uses `process.cwd()` at call time — implicit global state

**File:** `scripts/editorial/write.ts:63`
**Issue:** `const mirrorPath = nodePath.resolve(process.cwd(), MIRROR_RELATIVE_PATH)` resolves the mirror path against the current working directory at the moment `writePrimaryAndMirror` is called. If `pnpm editorial:capture` is invoked from a subdirectory of the repo (not the repo root), the mirror lands under the wrong directory. The code is correct for the documented usage (`pnpm editorial:capture` sets CWD to the repo root), but the dependency on `process.cwd()` is implicit. The integration test at `write.test.ts:325` spies on `process.cwd()` to redirect it — which confirms the coupling is load-bearing.
**Fix:** Either document the CWD requirement in the `writePrimaryAndMirror` JSDoc, or derive the repo root from a more stable anchor (e.g., walking upward from `import.meta.url` until finding `package.json`). For v1, a JSDoc note is sufficient.

### IN-05: `buildToolVersion` assumes `git` is on PATH

**File:** `scripts/editorial/index.ts:63,66`
**Issue:** `childProcess.execSync('git rev-parse --short HEAD', ...)` throws `ENOENT` if `git` is not on PATH (e.g., a minimal container image). The function catches any throw and returns `'editorial-capture/unknown'`, so behavior is safe — but the fallback is silent: the user gets no signal that provenance has degraded. Consider logging the fallback to stderr:
```ts
} catch (err) {
  process.stderr.write(`[editorial-capture] warning: git unavailable, tool_version=unknown (${err instanceof Error ? err.message : String(err)})\n`)
  return 'editorial-capture/unknown'
}
```
Non-blocking; existing behavior is correct.

---

_Reviewed: 2026-04-20_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
