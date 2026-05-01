# Phase 48: Capture (Playwright IO) - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning
**Mode:** Smart discuss — 5 explicit success criteria + 13 locked REQ-IDs (CAPT-03..15); 3 grey areas resolved

<domain>
## Phase Boundary

Build `scripts/editorial/capture.ts` so that `captureRoutes(config, routes)` drives headless Chromium through the live production site (`https://pattern158.solutions`) and returns `CapturedPage[]` with hydrated main-content HTML, HTTP status, console errors, SEO meta, and per-route PNG screenshots. Every Cloudflare / SPA / FAQ / SPA-404 mitigation is in place. **No Markdown conversion, no file orchestration beyond screenshots** — those land in phases 49 and 50.

</domain>

<decisions>
## Implementation Decisions

### Playwright Orchestration
- **Lifecycle**: single `chromium.launch()`, single `browser.newContext()`, fresh `context.newPage()` per route. Context is disposed at the end of the run via `finally { await browser.close() }`. Cookies/CF clearance persist across routes — reduces Cloudflare challenge frequency.
- **Inter-request delay**: fixed `await page.waitForTimeout(1500)` after each capture. Deterministic, mid-range of CAPT-12 spec (1–2s), SCAF-08 compliant.
- **Timeouts**: `page.goto(url, { timeout: 30_000, waitUntil: 'domcontentloaded' })` + `page.waitForSelector('#main-content', { timeout: 10_000 })` for per-route page-ready detection (CAPT-04).
- **Retry policy**: none. Any navigation failure, timeout, selector-miss, or interstitial detection aborts the entire run with a typed error. Matches CRIT-* "fail early" ethos — editorial capture requires trustworthy output; partial captures are worse than failures.

### Cloudflare Mitigation (CAPT-10, CAPT-11)
- **Cache-buster**: append `?_cb=<route-slug>` to every navigation URL. Stable across runs (SCAF-08), per-route, legible in logs. For routes without a slug (static), use a slugified `route.label` or the path segment.
- **Cache-Control**: `Cache-Control: no-cache` via `context.setExtraHTTPHeaders({ 'Cache-Control': 'no-cache' })`.
- **Interstitial detection** (layered — any signal trips the abort):
  1. `<title>` contains `"Just a moment"` (case-insensitive)
  2. Response body < 200 bytes
  3. DOM contains `[class*="challenge-platform"]` OR `cf-chl-opt` marker
- **On interstitial**: throw `CaptureError('Cloudflare bot interstitial detected on {path} — retry with --headful or wait for challenge to subside')`. Abort entire run — no silent capture of the interstitial page.
- **`cf-cache-status` logging**: read from `response.headers()['cf-cache-status']`, stored on `CapturedPage.cfCacheStatus?: string`.

### FAQ Pre-Capture Hooks (CAPT-07, CAPT-08)
- **Path gate**: hooks fire only when `route.path === '/faq'`. No try/catch swallowing "selector missing" on other routes.
- **Ordering**: (1) click `[data-filter="all"]` first, wait for filter render; (2) THEN click every `[aria-expanded="false"]` in `.faq-accordion-item`, wait for all to be `aria-expanded="true"`.
- **Assertions** (hard-fail):
  - Rendered `.faq-accordion-item` count **must equal** `faq.json` length (CRIT-02 / CAPT-08). Load `faq.json` at capture time for comparison.
  - Expanded-answer count **must equal** `faq.json` length (CRIT-01 / CAPT-07).
  - Either failure throws `CaptureError` — abort run.

### Dynamic Route Validation (CAPT-09)
- **Exhibit routes** (`category === 'exhibit'`): post-navigation, assert `await page.locator('.exhibit-detail h1').count() === 1` OR a suitable selector proven against the current site. Silent `NotFoundPage` render at HTTP 200 must trip this check and throw `CaptureError`.
- **Static routes**: rely on `#main-content` presence + content-length > 200 bytes (from CAPT-04).

### Viewport, Theme, Screenshots (CAPT-12, CAPT-13)
- Viewport: `{ width: 1280, height: 800 }` via `context({ viewport })`.
- Theme: `context({ colorScheme: 'light' })` — fixed, ignores user prefers-color-scheme.
- **Screenshots**: `await page.screenshot({ fullPage: true, path: <screenshotPath>, type: 'png' })`.
  - Directory: `<config.outputPath parent dir>/site-editorial-capture/screenshots/` — derived from `path.dirname(config.outputPath)` + `'/site-editorial-capture/screenshots'`. Created via `fs.mkdir({ recursive: true })` on first capture.
  - Filename: `<ordinal>-<slug>.png` where `ordinal` is 2-digit zero-padded route index and `slug` is `route.sourceSlug ?? slugify(route.path)`. Determinism preserved — same routes → same filenames.
  - Stored on `CapturedPage.screenshotPath: string` (absolute).

### Console Errors (CAPT-14)
- Attach `page.on('pageerror', ...)` and `page.on('console', msg => msg.type() === 'error' && ...)` listeners before `page.goto`.
- Collected into a `string[]` per route, stored on `CapturedPage.consoleErrors: readonly string[]`.
- Warnings and info messages are NOT captured — errors only.

### SEO Meta (CAPT-15)
- After page-ready, read `document.title` via `page.title()` and `<meta name="description">` via `page.locator('meta[name="description"]').getAttribute('content')` (fallback empty string).
- Stored on `CapturedPage.title: string` and `CapturedPage.description: string`.

### `CapturedPage` Final Shape (extends Phase 46 placeholder; lock for Phase 49)
```ts
interface CapturedPage {
  readonly route: Route
  readonly httpStatus: number
  readonly mainHtml: string              // page.locator('main#main-content').innerHTML()
  readonly title: string                 // document.title
  readonly description: string           // meta[name="description"] content (or "")
  readonly consoleErrors: readonly string[]
  readonly screenshotPath: string        // absolute PNG path
  readonly cfCacheStatus?: string        // Cloudflare cf-cache-status response header
}
```

### Determinism + SCAF-08 Discipline
- No `Date.now()`, no `Math.random()` — cache-buster is route-slug, not timestamp.
- No `os.EOL` — literal `\n` only.
- No `@/` aliases — relative `.ts` imports only.
- Sequential `for...of` over `routes` — NO `Promise.all`.

### Error Surface
- New: `CaptureError extends Error` class in `capture.ts` with `route?: Route`, `cause?: unknown` fields.
- `index.ts` already catches `ConfigError` with exit 2; `CaptureError` maps to exit 1 (runtime error).
- Error messages: include the route path AND which assertion tripped (e.g., `"FAQ accordion: expected 27 expanded items, got 24 — aborting capture"`).

### Test Surface (CAPT-03..15 coverage)
- `capture.test.ts` uses `playwright` against a locally served fixture site OR mocked `Page` — prefer fixtures where possible. Real live-site calls stay out of unit tests (hermetic).
- Browser launch mock + route stubbing for deterministic tests of: interstitial detection (all 3 signals), cache-buster URL shape, header injection, screenshot path resolution, FAQ assertion failure paths, exhibit-404 detection, console error aggregation, inter-request delay invariant.
- An optional smoke test against `https://pattern158.solutions` can run locally but is gated to NOT run in CI / default `test:scripts` (guard via env var or `.skip` default).

### Claude's Discretion
- Exact class structure (single `CaptureRunner` class vs. composed free functions) — pick whichever keeps `captureRoutes` under ~60 lines top-level.
- Choice of `type` vs `interface` for internal helpers — consistent with Phase 47 (`interface` for public shapes, `type` for unions).
- Error message wording — terse, actionable, no Claude-isms.
- Precise selector for exhibit 404 detection (e.g., `.exhibit-detail h1` or alternative) — pick the most stable anchor after reading `ExhibitDetailPage.vue` / `NotFoundPage.vue`.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/editorial/capture.ts` (Phase 46 placeholder) — interface stub + throwing body. Phase 48 replaces the body, extends `CapturedPage` fields, and exports `CaptureError`.
- `scripts/editorial/types.ts` — re-exports `CapturedPage` from `capture.ts`. Will pick up the extended shape automatically. Add `CaptureError` re-export alongside `ConfigError`.
- `scripts/editorial/config.ts` (Phase 47) — `EditorialConfig` already has `outputPath`, `baseUrl`, `headful`, `exhibitsJsonPath`. No new fields needed in Phase 48.
- `scripts/editorial/routes.ts` (Phase 47) — produces `Route[]` with `{ path, label, category, sourceSlug? }`. `sourceSlug` anchors screenshot filenames as designed.
- `src/data/json/faq.json` — read at capture time for FAQ count assertions.
- `src/views/ExhibitDetailPage.vue` / `src/views/NotFoundPage.vue` — inspect for stable 404-discriminator selector.
- `playwright` 1.59.1 already in devDependencies per Phase 46 SCAF-05.

### Established Patterns
- Composite TS project + NodeNext: `.ts` extension on relative imports (Phase 46, 47 proven).
- Vitest `scripts` project globals available in `__tests__/*.ts`.
- Throwing-stub → concrete impl pattern: replace the Phase 46 placeholder body, keep the SCAF-08 banner header verbatim.
- `ConfigError` precedent for typed runtime errors → `CaptureError` mirrors the pattern.

### Integration Points
- `index.ts` (still placeholder after Phase 47) — Phase 50 wires `captureRoutes` into orchestration. Phase 48 should NOT modify `index.ts`.
- `convert.ts` — consumes `CapturedPage[]` in Phase 49. This phase's `CapturedPage` shape is the contract Phase 49 reads.
- Forbidden-pattern grep gate from Phase 46 still applies.

</code_context>

<specifics>
## Specific Ideas

- `CaptureError` class shape:
  ```ts
  export class CaptureError extends Error {
    readonly route?: Route
    readonly cause?: unknown
    constructor(message: string, opts?: { route?: Route; cause?: unknown }) {
      super(message)
      this.name = 'CaptureError'
      this.route = opts?.route
      this.cause = opts?.cause
    }
  }
  ```
- `slugify(pathOrLabel: string)` helper: lowercase, strip leading `/`, replace non-alphanumeric with `-`, collapse dashes. Used for cache-buster + screenshot filename derivation.
- Screenshot path derivation rule (lock for Phase 49): `path.join(path.dirname(config.outputPath), 'site-editorial-capture', 'screenshots', `${String(index).padStart(2, '0')}-${slug}.png`)`.
- FAQ-hook waits: after clicking filter-all, `page.waitForFunction(() => document.querySelectorAll('.faq-accordion-item').length > 0)`. After expanding accordions, `page.waitForFunction(() => Array.from(document.querySelectorAll('.faq-accordion-item [aria-expanded]')).every(el => el.getAttribute('aria-expanded') === 'true'))`.
- Interstitial content-length check uses `response.body().then(b => b.length)` — not `text().length`.

</specifics>

<deferred>
## Deferred Ideas

- Dark-theme capture variant (CAPT-DARK in REQUIREMENTS out-of-scope) — only if editorial review surfaces theme-specific issues.
- Parallel route capture — explicitly forbidden by SCAF-08 this milestone.
- Headful auto-escalation on interstitial — stays a manual `--headful` flag per CAPT-03. Revisit if Cloudflare blocks the headless UA repeatedly in practice.
- Full-run live smoke against prod in CI — kept as a manual local-only command to avoid flaky CI on CF challenges.

</deferred>
