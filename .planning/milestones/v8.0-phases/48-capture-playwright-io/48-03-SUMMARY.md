---
phase: 48-capture-playwright-io
plan: 03
subsystem: editorial-capture
tags: [editorial-capture, playwright, per-route, main-content, spa-404, console-errors, seo-meta, phase-48]

# Dependency graph
requires:
  - phase: 48-01-capture-pure-logic
    provides: CaptureError class + slugify + detectInterstitial + extended CapturedPage interface
  - phase: 48-02-browser-lifecycle
    provides: launchBrowser + buildContextOptions + buildCaptureUrl (used for URL construction)
  - phase: 48-04-faq-hooks
    provides: loadFaqItemCount + runFaqPreCaptureHooks (called on /faq route)
  - phase: 48-05-screenshot-io
    provides: resolveScreenshotDir + ensureScreenshotDir + buildScreenshotPath + captureScreenshot
provides:
  - capturePage(context, config, route, index, faqItemCount) — single async function orchestrating CAPT-04/05/06/09/11/13/14/15 per route
  - BrowserContext type imported into capture.ts (extends playwright import line)
  - Locked operation order for per-route capture: navigate → status → main-content wait → FAQ hooks (gated) → SEO meta → mainHtml → interstitial check → exhibit-404 check → screenshot → return CapturedPage
affects: [48-06, 49-convert, 50-orchestration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pre-navigation listener attachment: page.on('console'/'pageerror') wired BEFORE page.goto so nothing fires unheard"
    - "try/finally for fresh-page lifecycle: page = context.newPage() -> work -> finally page.close() (no resource leak on throw)"
    - "Pure-classifier composition: detectInterstitial returns string|null; caller wraps non-null in CaptureError with route context"
    - "Error surface with route context: throw new CaptureError(msg, { route }) gives callers a route-scoped diagnostic surface for Plan 48-06"
    - "Defensive copy on return boundary: consoleErrors: [...consoleErrors] prevents late-fire listener mutations on the returned CapturedPage"

key-files:
  created: []
  modified:
    - scripts/editorial/capture.ts

key-decisions:
  - "Listeners attached BEFORE page.goto — Playwright does NOT buffer pre-listener events; any error fired during navigation would otherwise go unheard. This is the CAPT-14 correctness invariant."
  - "Operation order LOCKED top-to-bottom: goto -> status/cf-cache-status -> waitForSelector -> FAQ hooks -> meta -> mainHtml -> interstitial -> exhibit-404 -> screenshot -> return. FAQ hooks MUST run BEFORE meta/HTML reads (hooks mutate DOM). Interstitial check MUST run AFTER mainHtml read (needs html + bodyBytes). Exhibit-404 check MUST run AFTER interstitial (no point asserting on a challenge page). Screenshot runs LAST (after all assertions pass — don't waste disk on aborted captures)."
  - "Selector choices: `main#main-content` scopes the mainHtml read and excludes NavBar/FooterBar/skip-link (CAPT-06); `.exhibit-detail-title` (the h1 class from InvestigationReportLayout.vue + EngineeringBriefLayout.vue) is the stable SPA-404 anchor for exhibit routes — NotFoundPage does not render this class (CAPT-09)."
  - "Exhibit-404 count check is `=== 1` (strict), not `>= 1` — a second `.exhibit-detail-title` would also indicate a template regression worth aborting over."
  - "Inter-request delay (1500ms per CONTEXT.md) is NOT inside capturePage — it lives in captureRoutes (Plan 48-06) so capturePage stays pure about a single-route round-trip. Keeps the function testable and single-responsibility."
  - "Error surface convention: interstitial + exhibit-404 throw `new CaptureError(msg, { route })` directly with the route attached. Playwright TimeoutErrors (from goto/waitForSelector) propagate raw — Plan 48-06 wraps them with route context at the loop boundary."
  - "Defensive copy of consoleErrors on the returned CapturedPage (`[...consoleErrors]`) decouples the array from any late-fire events that would otherwise mutate the returned object. The interface declares `readonly string[]` so the copy is type-aligned."

patterns-established:
  - "Two-task scaffold-then-complete pattern for larger function bodies: Task 1 lands the scaffold with listeners/navigation + a sentinel throw so compile stays green; Task 2 removes the sentinel and lands the remaining assertions/returns. The sentinel string is verifiable by grep so the verifier can catch a stalled Task 1."
  - "Single-line chained Playwright calls (`page.locator(...).innerHTML()`) preferred for grep-friendliness in plan verification gates; multi-line wrapping is reserved for locator expressions that take arguments too long to fit on one line."

requirements-completed: [CAPT-04, CAPT-05, CAPT-06, CAPT-09, CAPT-14, CAPT-15]

# Metrics
duration: 4m59s
completed: 2026-04-20
---

# Phase 48 Plan 03: capturePage Per-Route Orchestration Summary

**Adds `capturePage(context, config, route, index, faqItemCount)` to `scripts/editorial/capture.ts`: a single async function that navigates Playwright through one route, enforces the main-content readiness signal (CAPT-04), records HTTP status + `cf-cache-status` (CAPT-05), scopes HTML to `main#main-content` (CAPT-06), runs FAQ hooks when `route.path === '/faq'` (CAPT-07/08 delegated), guards against Cloudflare interstitials (CAPT-11) and silent SPA 404s (CAPT-09), aggregates console errors (CAPT-14), captures SEO meta (CAPT-15), writes a full-page screenshot (CAPT-13), and returns a typed `CapturedPage` — ready for Plan 48-06 to wire into the top-level loop.**

## Performance

- **Duration:** ~4m59s
- **Started:** 2026-04-20T19:18:18Z
- **Completed:** 2026-04-20T19:23:17Z (approx.)
- **Tasks:** 2
- **Files modified:** 1 (scripts/editorial/capture.ts)

## Accomplishments

- **`capturePage`** — new exported async function (lines 319–415 of capture.ts). Orchestrates the six REQ-IDs this plan owns plus delegates to CAPT-07/08/11/13 helpers from prior plans.
- **`BrowserContext` type** imported into the existing single-line playwright import (`chromium, type Browser, type BrowserContext, type BrowserContextOptions, type Page`). Exactly one `from 'playwright'` import remains in the file.
- **Pre-navigation listener attachment** — `page.on('console', ...)` (filtered to `msg.type() === 'error'`) and `page.on('pageerror', ...)` both fire BEFORE `page.goto`. Errors between goto start and main-content ready are now captured.
- **Fresh-page-per-call lifecycle** — `context.newPage()` at the start, `page.close()` in a `finally` block. No resource leak even when interstitial/404 assertions throw.
- **Locked operation order** — 13 steps from page creation through CapturedPage return (listed below).
- **Error surface with route context** — interstitial + exhibit-404 throw `new CaptureError(msg, { route })` directly. Playwright TimeoutErrors propagate raw for Plan 48-06 to wrap with route context at the loop boundary.
- **`captureRoutes` stub preserved** — Plan 48-06 replaces its throwing body with the top-level for-of loop that calls `capturePage`.

## `capturePage` Orchestration Flow (13 Steps)

1. `const page = await context.newPage()` — fresh page per route (CONTEXT.md lifecycle).
2. Allocate `consoleErrors: string[] = []` buffer.
3. Attach `page.on('console', ...)` — filtered to error-type messages only (CAPT-14).
4. Attach `page.on('pageerror', ...)` — pushes `err.message` (CAPT-14).
5. `page.goto(buildCaptureUrl(config.baseUrl, route), { timeout: 30_000, waitUntil: 'domcontentloaded' })` — locked timeouts per CONTEXT.md.
6. Read `httpStatus = response?.status() ?? 0` (CAPT-05 — no throw on non-200; Plan 48-06 logs loudly).
7. Read `cfCacheStatus = response?.headers()['cf-cache-status']` (CAPT-10 observability — `undefined` on local dev / non-CF origin).
8. `page.waitForSelector('#main-content', { timeout: 10_000 })` — page-ready signal (CAPT-04).
9. Conditional: if `route.path === '/faq'`, `await runFaqPreCaptureHooks(page, faqItemCount)` BEFORE any innerHTML read (hooks mutate DOM).
10. SEO meta capture: `pageTitle = await page.title()`; `description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? ''` (CAPT-15).
11. `mainHtml = await page.locator('main#main-content').innerHTML()` — scoped to `<main>` (CAPT-06).
12. Interstitial check: `detectInterstitial({ title: pageTitle, bodyBytes: mainHtml.length, html: mainHtml })`; non-null throws `CaptureError` with route context (CAPT-11).
13. Exhibit-404 check: if `route.category === 'exhibit'`, assert `page.locator('.exhibit-detail-title').count() === 1`; mismatch throws `CaptureError` (CAPT-09).
14. Screenshot: `captureScreenshot(page, buildScreenshotPath(config, index, route))` (CAPT-13).
15. Return `result: CapturedPage = { route, httpStatus, mainHtml, title, description, consoleErrors: [...consoleErrors], screenshotPath, cfCacheStatus }` — defensive copy on consoleErrors.
16. `finally { await page.close() }` — unconditional cleanup.

(Steps 1–8 are Task 1; steps 9–15 are Task 2; step 16 straddles both.)

## Task Commits

Each task was committed atomically:

1. **Task 1: capturePage scaffold — listeners + goto + status + main-content wait** — `1946112` (feat)
2. **Task 2: Complete capturePage body — FAQ hooks + mainHtml + interstitial + exhibit-404 + screenshot** — `8379ad1` (feat)

## Files Created/Modified

- `scripts/editorial/capture.ts` — Added `BrowserContext` to the playwright import and inserted the `capturePage` function (lines 319–415) between `captureScreenshot` and the `captureRoutes` stub. File is now **421 lines** (within the plan's 280–450 bound). Top-level exports count: **15**. SCAF-08 banner preserved verbatim.

## Decisions Made

- **Listener attachment timing** — Playwright does NOT buffer events emitted before a listener is attached. Attaching `console`/`pageerror` listeners BEFORE `page.goto` is the only way to observe errors that fire during the initial navigation + hydration window.
- **Operation order is LOCKED** — FAQ hooks before meta/HTML reads (DOM mutation), interstitial check after mainHtml read (needs `html` + `bodyBytes`), exhibit-404 after interstitial (no point asserting on a challenge page), screenshot last (after all assertions pass, don't waste disk on aborted captures).
- **Selector for `mainHtml`** — `main#main-content` (the `<main id="main-content">` anchor rendered by `src/App.vue:11`). This scopes the HTML read to the page's primary content region and excludes NavBar, FooterBar, and the skip-link.
- **Selector for SPA-404 detection on exhibit routes** — `.exhibit-detail-title`, the `<h1 class="exhibit-detail-title">` rendered by both `InvestigationReportLayout.vue:31` and `EngineeringBriefLayout.vue:31`. `NotFoundPage` does NOT render this class, so on a silent 404 the locator count is 0 and the `!== 1` assertion throws. Count check is strict `=== 1` (not `>= 1`) because a double-render would also indicate a template regression.
- **`response?.status() ?? 0` fallback** — `page.goto` can theoretically return `null` (network abort, same-URL navigation). The `?? 0` gives callers a sentinel value distinct from any real HTTP status, and the function intentionally does NOT throw on non-200 — that policy belongs to Plan 48-06's loop (CAPT-05 "non-200 logged loudly in run summary but capture continues").
- **`cfCacheStatus` left `undefined` when absent** — typed as optional on `CapturedPage`. Local-dev and non-CF origins naturally omit the header; downstream tools (Plan 49/50) can conditionally emit only when present.
- **Inter-request 1500ms delay lives in the caller** — CONTEXT.md assigns it to `captureRoutes` (Plan 48-06) so `capturePage` stays pure about a single-route round-trip. Keeps the function single-responsibility and testable.
- **Defensive copy of `consoleErrors` on return** — `[...consoleErrors]` decouples the returned array from the live in-function buffer that late-fire console events might still mutate after `capturePage` returns.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Collapsed three chained Playwright locator calls to single lines to satisfy plan's own verify-grep patterns**

- **Found during:** Task 2 automated verification step
- **Issue:** The plan's `<action>` code example wrapped `page.locator('main#main-content').innerHTML()`, `page.locator('.exhibit-detail-title').count()`, and `page.locator('meta[name="description"]').getAttribute('content')` across multiple lines for readability. However, the plan's `<verify>` grep patterns required each full chain to match on a single line (`grep -q "page.locator('main#main-content').innerHTML()"` etc.). Grep is line-based, so the multi-line code did not match.
- **Fix:** Collapsed the three chained locator calls to single lines inside the `capturePage` body. Behaviour unchanged (grep-formatting change only).
- **Files modified:** scripts/editorial/capture.ts (Task 2 body)
- **Verification:** All 24 Task-2 grep patterns pass; `pnpm build` exit 0; `pnpm test:scripts` 224/224.
- **Committed in:** `8379ad1` (Task 2 commit — the collapse was applied before the commit landed)

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Formatting-only change to satisfy the plan's own verify-grep patterns. No semantic or behavioural change; the function still reads the same three attributes via the same Playwright locators.

## Issues Encountered

- None beyond the deviation above.

## User Setup Required

None — pure code addition, no environment variables, no external services, no filesystem/network I/O at import time.

## Verification Results

**Task 1 gate:**
- All 21 grep patterns present (`from 'playwright'` count === 1; `type BrowserContext`; capturePage signature; listeners; goto with locked opts; status + cf-cache-status reads; main-content wait; try/finally close; sentinel throw) — PASS.
- `pnpm build` exit 0.
- `pnpm test:scripts` 224/224 pass.
- SCAF-08 grep gate clean.

**Task 2 gate:**
- Sentinel removed (`! grep -q "capturePage: Task 1 scaffold"`) — PASS.
- All 24 task-2 grep patterns present (FAQ gate; runFaqPreCaptureHooks call; page.title + meta description chain; main-content innerHTML chain; interstitial dispatch with all 3 inputs; interstitial throw; exhibit-gate; exhibit-title count chain; exhibit-404 throw; screenshot path + captureScreenshot call; typed result literal; defensive-copy consoleErrors; return result; captureRoutes stub preserved) — PASS.
- `pnpm build` exit 0 — tsc composite build resolves all types across `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.editorial.json`.
- `pnpm test:scripts` 224/224 pass.
- SCAF-08 grep gate clean: no matches for `@/`, `Date.now()`, `new Date(`, `os.EOL`, `Promise.all`.

**Plan-level verification:**
- `grep -c "throw new CaptureError" scripts/editorial/capture.ts` = 4 (2 FAQ hook + 1 interstitial + 1 exhibit-404; plan required ≥ 2).
- `grep -c "^export " scripts/editorial/capture.ts` = 15 (plan required ≥ 10).
- `wc -l scripts/editorial/capture.ts` = 421 (plan required 280–450).
- SCAF-08 clean across the whole file.

## Next Phase Readiness

- **Plan 48-06 (Wave 4)** is unblocked. It can now replace the throwing `captureRoutes` stub with a thin orchestration loop: `launchBrowser -> newContext(buildContextOptions) -> loadFaqItemCount -> ensureScreenshotDir -> for (route, i) of routes { capturePage(context, config, route, i, faqItemCount); await page.waitForTimeout(1500) } -> finally browser.close()`.
- **Phase 49 (`convert.ts`)** can now rely on the full `CapturedPage` shape being populated by `capturePage` on every route — all 8 fields have a concrete, observable source (as documented in the 13-step flow above).
- **Phase 50 (`index.ts` outermost boundary)** — error routing story is complete: Playwright TimeoutErrors → wrapped to CaptureError in Plan 48-06; interstitial/exhibit-404 → CaptureError raised directly from `capturePage`. Outermost boundary does `err instanceof CaptureError` to exit 1.

No blockers. Wave 3 Plan 48-03 is complete; only Plan 48-06 remains in Phase 48.

## Self-Check: PASSED

- FOUND: scripts/editorial/capture.ts (421 lines; capturePage signature at line 319; body spans lines 325–415)
- FOUND: commit 1946112 in `git log` (Task 1 — capturePage scaffold)
- FOUND: commit 8379ad1 in `git log` (Task 2 — complete capturePage body)
- PASS: `pnpm build` exit 0
- PASS: `pnpm test:scripts` 224/224 green
- PASS: SCAF-08 grep gate clean
- PASS: single `from 'playwright'` import line with `BrowserContext` type included
- PASS: `captureRoutes` throwing stub preserved (line 422) for Plan 48-06
- PASS: sentinel string `capturePage: Task 1 scaffold` no longer present in capture.ts
- PASS: 4 `throw new CaptureError` occurrences (2 FAQ + 1 interstitial + 1 exhibit-404)
- PASS: 15 top-level exports; line count 421 within plan bounds

---
*Phase: 48-capture-playwright-io*
*Completed: 2026-04-20*
