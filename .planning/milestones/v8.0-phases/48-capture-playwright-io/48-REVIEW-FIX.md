---
phase: 48-capture-playwright-io
fixed_at: 2026-04-20T00:00:00Z
review_path: .planning/phases/48-capture-playwright-io/48-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 48: Code Review Fix Report

**Fixed at:** 2026-04-20
**Source review:** .planning/phases/48-capture-playwright-io/48-REVIEW.md
**Iteration:** 1
**Scope:** MEDIUM + LOW findings only (INFO deferred per fixer contract)

**Summary:**
- Findings in scope: 5 (2 MEDIUM + 3 LOW; 6 INFO out of scope)
- Fixed: 5
- Skipped: 0
- Test gate: `pnpm test:scripts` — 19 files / 260 tests passing after every fix
- Build gate: `pnpm build` — exit 0 after full fix series

## Fixed Issues

### MED-02: Listener attachment moved inside the try/finally

**Files modified:** `scripts/editorial/capture.ts`
**Commit:** `a6608f8`
**Applied fix:**
Moved `const consoleErrors: string[] = []` and both `page.on('console', …)` /
`page.on('pageerror', …)` listener attachments from before the `try { … }`
block to inside it. A throw during `page.on()` attachment (e.g. "Target
closed" on a racing page teardown) now still triggers the existing
`finally { await page.close() }` cleanup, matching the one-try-per-resource
convention used for browser+context in `captureRoutes`. Added an inline
comment explaining the rationale.

### MED-01 + LOW-01: Interstitial check uses raw response body and runs before selector wait

**Files modified:** `scripts/editorial/capture.ts`, `scripts/editorial/__tests__/capture.test.ts`
**Commit:** `8172de6`
**Applied fix:**
These two findings are a single coupled change — MED-01's content-length
signal source (`response.body().byteLength`) is only meaningful if the check
runs before `waitForSelector('#main-content')` (LOW-01), because real CF
challenge pages never render `<main id="main-content">` and the selector wait
would TimeoutError out first, masking the actionable CAPT-11 message.

Changes in `capture.ts`:
- After `page.goto()`, read `const rawBody = (await response?.body()) ?? Buffer.alloc(0)`
  per CONTEXT.md `<specifics>` lock (line 144).
- Feed `rawBody.byteLength` and `rawBody.toString('utf8')` into
  `detectInterstitial` as `bodyBytes` and `html` respectively — the full HTTP
  response body per CAPT-11 spec, not the scoped `main` innerHTML.
- Use `await page.title().catch(() => '')` for the title signal so a
  challenge page that never settles title lookup still classifies.
- Moved the entire interstitial block BEFORE `page.waitForSelector(...)` so
  CAPT-11's three layered signals all become reachable.
- Removed the old (post-mainHtml) interstitial block that passed
  `mainHtml.length` as `bodyBytes` — the INF-01 misleading-param issue
  dissolves as a side effect (parameter name now matches the value passed).

Changes in `capture.test.ts`:
- Added `body: async () => bodyBuffer` to the `goto` return-value mock in
  `makeMockPage`. The mock uses `opts.mainHtml` as a stand-in raw body
  string; byteLength and DOM-marker semantics are identical for integration
  purposes. All three existing interstitial-path tests (benign / silent-404 /
  interstitial) keep passing with the new plumbing because the test fixtures
  already padded mainHtml to >=500 bytes.

### LOW-02: Page-ready selector normalized to `main#main-content`

**Files modified:** `scripts/editorial/capture.ts`
**Commit:** `f4eb813`
**Applied fix:**
Changed `page.waitForSelector('#main-content', { timeout: 10_000 })` to
`page.waitForSelector('main#main-content', { timeout: 10_000 })` so the
page-ready selector matches the HTML-scoping selector on the same function
(`page.locator('main#main-content').innerHTML()`). If a future Vue template
regression ever renames the outer `<main>` or introduces a duplicate
`#main-content` node, this is now caught at the wait rather than surfacing
as a non-descript locator error at the innerHTML() call. Added a short
comment to document the cross-reference.

### LOW-03: `instanceof CaptureError` assertions added to all three error-path integration tests

**Files modified:** `scripts/editorial/__tests__/capture.test.ts`
**Commit:** `581526e`
**Applied fix:**
All three failure-path tests — "wraps non-CaptureError errors", "detects
silent 404 on exhibit routes", "aborts on interstitial signal" — were
rewritten from the one-shot `await expect(...).rejects.toThrow(/regex/)`
pattern to a capture-once, assert-twice shape:

```ts
let caught: unknown
try { await captureRoutes(config, routes) } catch (err) { caught = err }
expect(caught).toBeInstanceOf(CaptureError)
expect((caught as CaptureError).message).toMatch(/<original regex>/)
```

This closes the regression gap where a bare `Error` with matching message
would silently satisfy the old assertion but break Plan 50's outermost
`err instanceof CaptureError` → exit-code dispatch (CaptureError → 1 vs
ConfigError → 2). Uses `CaptureError` imported at the top of the file.

Also verified that the single-invocation pattern preserves the existing
`expect(mockBrowser.close).toHaveBeenCalledTimes(1)` invariant (prior
`.rejects.toThrow` chained twice would have called the orchestrator twice
and broken the close-count assertion).

## Skipped Issues

None — all 5 in-scope findings were fixed.

## Out of Scope (INFO findings, deferred)

Per fixer contract, the 6 INFO findings (INF-01 through INF-06) were NOT
touched. Noting their status for the record:

- **INF-01** (`bodyBytes` parameter name misleading): INCIDENTALLY RESOLVED
  by the MED-01 fix. `detectInterstitial` now receives
  `response.body().byteLength`, so the parameter name and the value agree
  without a rename.
- **INF-02** (integration tests don't assert `page.close` / `context.close`):
  unchanged. Would require either a shared mockPage reference or a mock
  factory that tracks close calls centrally.
- **INF-03** (ENOENT test passes on any rejection): unchanged.
- **INF-04** (cache-buster encodes query string): unchanged; cosmetic-only.
- **INF-05** (`/faq` code path untested at integration layer): unchanged.
- **INF-06** (error message echoes raw page title): unchanged; non-issue for
  self-capture scope.

## Verification Record

| Fix | `pnpm test:scripts` | Notes |
|---|---|---|
| Baseline (pre-fix) | 19 files / 260 tests passing | |
| MED-02 applied | 19 / 260 passing | Post-commit a6608f8 |
| MED-01 + LOW-01 applied | 19 / 260 passing | Post-commit 8172de6 |
| LOW-02 applied | 19 / 260 passing | Post-commit f4eb813 |
| LOW-03 applied | 19 / 260 passing | Post-commit 581526e |
| Final `pnpm build` | exit 0 | vue-tsc + vite + build:markdown all green |

All 4 atomic fix commits land on top of `d20e478` (Phase 48-06 plan completion).

## SCAF-08 Audit

No SCAF-08 forbidden patterns introduced:
- no `Date.now()` or `Math.random()`
- no `os.EOL` (literal `\n` only)
- no `@/` alias imports (relative `.ts` imports only)
- no `Promise.all` over routes (sequential `for…of` preserved)
- no parallel-iteration helpers on the ordered route list

## CONTEXT.md Lock Audit

- Interstitial content-length signal now uses `response.body().then(b => b.length)`
  per `<specifics>` line 144. LOCK RESTORED.
- Abort-on-interstitial policy unchanged — no retries introduced.
- FAQ pre-capture hook ordering, viewport, theme, screenshot path, console-error
  policy, inter-request delay all unchanged.

---

_Fixed: 2026-04-20_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
