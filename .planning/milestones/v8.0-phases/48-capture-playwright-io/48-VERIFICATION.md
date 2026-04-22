---
phase: 48-capture-playwright-io
verified: 2026-04-20T19:40:00Z
status: human_needed
score: 5/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Run full live-site smoke against https://pattern158.solutions (out of band)"
    expected: "captureRoutes yields CapturedPage[] for 22 routes with no Cloudflare interstitial, FAQ accordion count matches faq.json, no exhibit silent-404, 22 PNGs under site-editorial-capture/screenshots/."
    why_human: "Phase 48 is a Playwright TOOL targeting the live production site. CONTEXT.md explicitly gates live-site calls out of default test:scripts to avoid flaky CI on Cloudflare challenges; full-run wiring is deferred to Phase 50 (index.ts orchestration) and surfaces to Dan's editorial review in Phase 51. The unit-test layer is exhaustively hermetic (19 test files, 260 tests, mocked chromium) — but 'every mitigation in place' against real Cloudflare/SPA timing/FAQ accordion/silent-404 is only provable by running against prod."
---

# Phase 48: Capture (Playwright IO) Verification Report

**Phase Goal:** Given a validated `Route[]`, the tool drives headless Chromium through the live production site and returns a `CapturedPage[]` with hydrated main-content HTML, HTTP status, console errors, SEO meta, and per-route PNG screenshots — with every mitigation in place for Cloudflare, SPA timing, FAQ accordion, and silent SPA 404s.

**Verified:** 2026-04-20T19:40:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Must-Have Matrix, MH-1..MH-5)

| #    | Truth                                                                                                                                                                        | Status     | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MH-1 | Sequential capture with `<main id="main-content">` scoping; NavBar/FooterBar absent from captured HTML.                                                                       | VERIFIED   | `capture.ts:448` `for (let i = 0; i < routes.length; i += 1)` — sequential; `capture.ts:363` `page.locator('main#main-content').innerHTML()` — scoped extraction. No `Promise.all` anywhere in `capture.ts` or `capture.test.ts` (SCAF-08 grep clean). Integration test `captureRoutes integration > returns N CapturedPage entries` asserts ordered results against mocked context.                                                                         |
| MH-2 | FAQ captures all answers expanded; rendered count equals `faq.json` length; hard-fail on mismatch.                                                                            | VERIFIED   | `capture.ts:186-233 runFaqPreCaptureHooks`: (1) click `[data-filter="all"]` FIRST (line 191), (2) wait for `.faq-accordion-item` count === `faqItemCount` (lines 193-198, `CaptureError` on timeout line 203), (3) sequentially click every `[aria-expanded="false"]` (lines 210-215), (4) wait for every `[aria-expanded]` to be `'true'` (lines 218-226, `CaptureError` on timeout line 228). Path-gated `if (route.path === '/faq')` on line 353.        |
| MH-3 | Exhibit route silent-404 detection via selector assertion; HTTP-200 NotFoundPage aborts run.                                                                                  | VERIFIED   | `capture.ts:381-389`: `if (route.category === 'exhibit')` runs `page.locator('.exhibit-detail-title').count()`, throws `CaptureError` when `count !== 1`. Integration test `detects silent 404 on exhibit routes (count !== 1)` confirms mocked exhibit route with `exhibitTitleCount: 0` triggers abort with `/did not render \.exhibit-detail-title/`.                                                                                                    |
| MH-4 | Cloudflare cache-buster + `Cache-Control: no-cache` + `cf-cache-status` logging + 3-signal interstitial abort.                                                                | VERIFIED   | Cache-buster: `capture.ts:165-170 buildCaptureUrl` appends `?_cb=<slug>` / `&_cb=<slug>` (5 test rows); no-cache: `capture.ts:152 extraHTTPHeaders: { 'Cache-Control': 'no-cache' }`; cf-cache-status: `capture.ts:348` stored on `CapturedPage.cfCacheStatus`; 3-signal abort: `capture.ts:88-106 detectInterstitial` covers title / <200 bytes / cf-chl-opt / challenge-platform (5 test rows). Integration test `aborts on interstitial signal` confirms. |
| MH-5 | Per-route PNG screenshots at 1280×800 light theme + console errors + SEO meta captured.                                                                                       | VERIFIED   | Viewport + theme: `capture.ts:149-151 { viewport: { width: 1280, height: 800 }, colorScheme: 'light' }`; screenshot: `capture.ts:295-304 captureScreenshot` with `fullPage: true, type: 'png'`; filename `<NN>-<slug>.png` via `buildScreenshotPath` line 279 `padStart(2, '0')`; console errors: `capture.ts:331-338` listeners BEFORE `page.goto`; SEO meta: `capture.ts:358-360` `page.title()` + `meta[name="description"]` content.                      |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact                                                       | Expected                                                                            | Status     | Details                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/editorial/capture.ts`                                 | Exports 15 symbols; `captureRoutes` real body; SCAF-08 clean; data flows to tests. | VERIFIED   | 486 lines, real Playwright orchestration. All 15 required exports present (line numbers 28 `CapturedPage`, 44 `CaptureError`, 65 `slugify`, 88 `detectInterstitial`, 118 `loadFaqItemCount`, 138 `launchBrowser`, 148 `buildContextOptions`, 165 `buildCaptureUrl`, 186 `runFaqPreCaptureHooks`, 243 `resolveScreenshotDir`, 257 `ensureScreenshotDir`, 273 `buildScreenshotPath`, 295 `captureScreenshot`, 319 `capturePage`, 435 `captureRoutes`). |
| `scripts/editorial/types.ts`                                   | Re-exports `CaptureError` as runtime value and `CapturedPage` as type.              | VERIFIED   | `types.ts:12 export type { CapturedPage }`; `types.ts:22 export { CaptureError }` — matches Phase 48 Plan 01 contract.                                                                                                                                                                                                                                                                                                                             |
| `scripts/editorial/__tests__/capture.test.ts`                  | Hermetic tests for pure helpers + mocked-browser integration.                      | VERIFIED   | 497 lines, 8 describe blocks, 36 tests (table-driven `slugify` 9 rows, `detectInterstitial` 6 rows, `buildCaptureUrl` 5 rows, `buildContextOptions` 2 cases, `resolveScreenshotDir + buildScreenshotPath` 5 rows, `loadFaqItemCount` 3 cases, `CaptureError` 2 cases, `captureRoutes integration` 4 scenarios — happy path, non-CaptureError wrap, silent 404, interstitial abort).                                                                |

### Key Link Verification

| From                   | To                          | Via                                                                   | Status | Details                                                                                                                                                                                                      |
| ---------------------- | --------------------------- | --------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `captureRoutes`        | `playwright.chromium`       | `launchBrowser(config)` → `chromium.launch({ headless: !config.headful })` | WIRED  | `capture.ts:19 import { chromium, ... } from 'playwright'`; `capture.ts:139 chromium.launch({ headless: !config.headful })`; called from line 443.                                                           |
| `captureRoutes`        | `capturePage`               | Sequential for-loop                                                   | WIRED  | `capture.ts:448 for (let i = 0; i < routes.length; i += 1)`; `capture.ts:451 const page = await capturePage(context, config, route, i, faqItemCount)`.                                                       |
| `capturePage`          | `runFaqPreCaptureHooks`     | path gate `if (route.path === '/faq')`                                | WIRED  | `capture.ts:353-355`.                                                                                                                                                                                        |
| `capturePage`          | `detectInterstitial`        | After mainHtml + SEO capture                                          | WIRED  | `capture.ts:367-377`; throws `CaptureError` with route context on non-null reason.                                                                                                                           |
| `capturePage`          | `.exhibit-detail-title`     | `page.locator('.exhibit-detail-title').count()` gated on exhibit category | WIRED  | `capture.ts:381-389`.                                                                                                                                                                                        |
| `capturePage`          | `captureScreenshot`         | `buildScreenshotPath(config, index, route)` → PNG write                | WIRED  | `capture.ts:392-393`.                                                                                                                                                                                        |
| `captureRoutes`        | `ensureScreenshotDir`       | preflight BEFORE browser boot                                         | WIRED  | `capture.ts:440`; mkdir(recursive:true).                                                                                                                                                                     |
| `captureRoutes`        | `loadFaqItemCount`          | preflight BEFORE browser boot                                         | WIRED  | `capture.ts:441`; reads `faq.json` derived from `config.exhibitsJsonPath`.                                                                                                                                   |
| `captureRoutes`        | 1500ms inter-request delay  | `tempPage.waitForTimeout(1500)` skipped after last route              | WIRED  | `capture.ts:469-476`; `if (i < routes.length - 1)` guard; throwaway `context.newPage()` approved Playwright sleep channel (not Node timer).                                                                  |
| `types.ts`             | `CaptureError` runtime      | `export { CaptureError } from './capture.ts'`                         | WIRED  | `types.ts:22`. Phase 50 `index.ts` will `instanceof CaptureError` map to exit 1.                                                                                                                              |

### Data-Flow Trace (Level 4)

| Artifact              | Data Variable                       | Source                                                                | Produces Real Data | Status   |
| --------------------- | ----------------------------------- | --------------------------------------------------------------------- | ------------------ | -------- |
| `capture.ts`          | `mainHtml` (returned in `CapturedPage`) | `page.locator('main#main-content').innerHTML()` — real DOM extraction | Yes (from live page) | FLOWING  |
| `capture.ts`          | `httpStatus`                         | `response?.status() ?? 0` from `page.goto`                            | Yes                | FLOWING  |
| `capture.ts`          | `cfCacheStatus`                      | `response?.headers()['cf-cache-status']`                              | Yes (optional)     | FLOWING  |
| `capture.ts`          | `consoleErrors`                      | `page.on('console', ...)` + `page.on('pageerror', ...)` before goto   | Yes                | FLOWING  |
| `capture.ts`          | `title`, `description`              | `page.title()` + `meta[name="description"]` attribute                 | Yes                | FLOWING  |
| `capture.ts`          | `screenshotPath`                     | `buildScreenshotPath(config, index, route)` → `page.screenshot(...)`  | Yes                | FLOWING  |
| `capture.ts`          | `faqItemCount`                       | `fsp.readFile + JSON.parse` of `faq.json`                             | Yes                | FLOWING  |

No hollow props, no static fallbacks, no disconnected data sources. `captureRoutes` body is the real orchestrator, NOT a throwing stub (line 435-485, 51 LOC body composed of preflight + `launchBrowser` + nested `try/finally` + sequential loop).

### Behavioral Spot-Checks

| Behavior                                             | Command                                             | Result                                  | Status |
| ---------------------------------------------------- | --------------------------------------------------- | --------------------------------------- | ------ |
| TypeScript project compiles                          | `pnpm build`                                        | exit 0 (vue-tsc + vite-build + markdown-export) | PASS   |
| Unit + mocked-integration test suite passes          | `pnpm test:scripts`                                 | `Test Files 19 passed (19) / Tests 260 passed (260)` | PASS   |
| SCAF-08 forbidden-pattern grep on `capture.ts`       | `grep -E '@/\|Date.now()\|new Date(\|os.EOL\|Promise.all'` | No matches                             | PASS   |
| SCAF-08 forbidden-pattern grep on `capture.test.ts`  | `grep -E '@/\|Date.now()\|new Date(\|os.EOL\|Promise.all'` | No matches                             | PASS   |
| All 15 required exports present                      | `grep -E '^export ...' capture.ts`                  | 15/15 symbols found                     | PASS   |
| Git status clean on phase tracked files              | `git status --short .planning/phases/48-... scripts/editorial/capture.ts types.ts __tests__/capture.test.ts` | empty output                           | PASS   |
| Live-site smoke against production                   | (deferred)                                          | Not runnable in verification scope; gated out of CI by CONTEXT.md | SKIP   |

### Requirements Coverage (CAPT-03..15)

All 13 CAPT IDs are `- [x]` in `REQUIREMENTS.md`. Mapped to implementation evidence:

| Requirement | Source Plan(s)            | Implementation Evidence                                                                                                                          | Status    |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------- |
| CAPT-03     | 48-02, 48-06              | `launchBrowser` respects `config.headful` (line 139); `captureRoutes` uses single `chromium.launch()` per run                                    | SATISFIED |
| CAPT-04     | 48-03                     | `page.goto({ timeout: 30_000, waitUntil: 'domcontentloaded' })` (line 343); `page.waitForSelector('#main-content', { timeout: 10_000 })` (line 350) | SATISFIED |
| CAPT-05     | 48-03                     | `httpStatus = response?.status() ?? 0` (line 347); stored on `CapturedPage`                                                                      | SATISFIED |
| CAPT-06     | 48-03                     | `page.locator('main#main-content').innerHTML()` (line 363) — NavBar/FooterBar excluded                                                           | SATISFIED |
| CAPT-07     | 48-04                     | `runFaqPreCaptureHooks` clicks every `[aria-expanded="false"]` sequentially (lines 210-215); waits for all to become true                         | SATISFIED |
| CAPT-08     | 48-04                     | Filter-all clicked FIRST (line 191); count-assertion `CaptureError` on mismatch (line 203)                                                       | SATISFIED |
| CAPT-09     | 48-03                     | Exhibit category selector assertion `.exhibit-detail-title` count !== 1 → `CaptureError` (lines 381-389)                                         | SATISFIED |
| CAPT-10     | 48-02, 48-06              | Cache-buster `?_cb=<slug>` via `buildCaptureUrl` (line 165); `Cache-Control: no-cache` (line 152); `cf-cache-status` stored (line 348)           | SATISFIED |
| CAPT-11     | 48-01, 48-03              | `detectInterstitial` 3-signal classifier (lines 88-106); `CaptureError` abort on non-null reason (lines 372-376)                                 | SATISFIED |
| CAPT-12     | 48-02, 48-06              | `viewport: { width: 1280, height: 800 }` (line 150); 1500ms `waitForTimeout` between captures (line 472)                                         | SATISFIED |
| CAPT-13     | 48-05                     | Screenshot `<NN>-<slug>.png` under `<dir>/site-editorial-capture/screenshots/`; `fullPage: true, type: 'png'`                                   | SATISFIED |
| CAPT-14     | 48-03                     | `page.on('console'/'pageerror')` listeners attached BEFORE `page.goto` (lines 331-338); aggregated into `consoleErrors[]` on `CapturedPage`      | SATISFIED |
| CAPT-15     | 48-03                     | `page.title()` (line 358) + `meta[name="description"]` content (line 360) stored on `CapturedPage.title` / `.description`                         | SATISFIED |

No orphaned requirements.

### Anti-Patterns Found

No blockers. A single-file `/// <reference lib="dom" />` directive at `capture.ts:13` is intentional (Node tool with browser-context callbacks for `page.waitForFunction` / `page.$$eval`) and is documented in the file header — not an anti-pattern.

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| —    | —    | None    | —        | —      |

### Human Verification Required

See `human_verification` frontmatter. In brief:

**1. Live-site smoke against https://pattern158.solutions**

- **Test:** Run `pnpm editorial:capture` against production once Phase 50 wires the entry point, OR invoke `captureRoutes(config, routes)` from a local one-off script with a real `EditorialConfig` pointing at the live base URL.
- **Expected:**
  - 22 `CapturedPage` entries (home + philosophy + technologies + case-files + faq + contact + accessibility + 15 exhibits).
  - No `CaptureError` thrown (no Cloudflare interstitial, no silent exhibit 404, no FAQ count mismatch).
  - 22 PNGs written under `<outputPath parent>/site-editorial-capture/screenshots/` with `<NN>-<slug>.png` names.
  - `mainHtml` for each route is non-empty and scoped to `<main id="main-content">` (NavBar / FooterBar absent).
  - FAQ page's `mainHtml` contains all answers from `faq.json` fully expanded.
  - Per-route `cfCacheStatus` logged when Cloudflare returns the header.
- **Why human:** The phase goal explicitly targets live production. CONTEXT.md defers the full-run smoke out of `pnpm test:scripts` to avoid flaky CI from Cloudflare challenges, and the full orchestration entry point (`index.ts`) doesn't land until Phase 50. The hermetic mocked-browser integration suite (19 test files, 260 tests) proves every code path in isolation — but real-world Cloudflare timing, SPA hydration, and FAQ accordion rendering can only be confirmed against prod. This is the phase-boundary limit: Phase 48 ships the tool; Phase 50 wires it; Phase 51 (Dan) validates the output.

### Gaps Summary

No automated gaps. The phase goal is fully satisfied at the unit + mocked-integration layer; the only outstanding verification is a live-site smoke that is intentionally gated out of `pnpm test:scripts` per CONTEXT.md's deferred-items list and that does not block Phase 48 completion under the roadmap's phased structure (Phase 50 orchestration + Phase 51 editorial review are the natural hosts for live-site validation).

---

_Verified: 2026-04-20T19:40:00Z_
_Verifier: Claude (gsd-verifier)_
