// scripts/editorial/capture.ts
// Phase 48 — Playwright-driven editorial capture pipeline (CAPT-03..15).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of in Phase 48)
//
// File-scoped DOM lib reference: Playwright's page.waitForFunction / page.$$eval
// callbacks run in the browser context and reference `document` + DOM Element
// types. The editorial tsconfig intentionally omits the 'dom' lib globally
// (this is a Node tool), so the reference is scoped to this one file.
/// <reference lib="dom" />

import * as fsp from 'node:fs/promises'
import * as nodePath from 'node:path'
import type { EditorialConfig } from './config.ts'
import type { Route } from './routes.ts'
import { chromium, type Browser, type BrowserContext, type BrowserContextOptions, type Page } from 'playwright'

/**
 * Extended CapturedPage shape — locked for Phase 49 (convert.ts consumer).
 * Added in Phase 48 vs. Phase 46 placeholder:
 *   - consoleErrors: per-route aggregated console.error + pageerror messages (CAPT-14)
 *   - screenshotPath: absolute path to the PNG screenshot (CAPT-13)
 *   - cfCacheStatus: Cloudflare `cf-cache-status` response header, when present (CAPT-10)
 */
export interface CapturedPage {
  readonly route: Route
  readonly httpStatus: number
  readonly mainHtml: string
  readonly title: string
  readonly description: string
  readonly consoleErrors: readonly string[]
  readonly screenshotPath: string
  readonly cfCacheStatus?: string
}

/**
 * Typed capture-runtime error. Distinguished from ConfigError so the outermost
 * boundary (index.ts, Phase 50) maps CaptureError -> exit 1 and ConfigError -> exit 2.
 * CAPT-11: interstitial detection throws CaptureError with an actionable message.
 */
export class CaptureError extends Error {
  public readonly route?: Route
  public readonly cause?: unknown
  constructor(message: string, opts?: { route?: Route; cause?: unknown }) {
    super(message)
    this.name = 'CaptureError'
    this.route = opts?.route
    this.cause = opts?.cause
  }
}

/**
 * slugify: lowercase, strip leading '/', collapse non-alphanumeric runs to a
 * single '-', trim leading/trailing '-'. Root path '/' maps to 'home'.
 *
 * Used by:
 *   - the cache-buster URL builder (Plan 48-02): `?_cb=<slug>`
 *   - the screenshot filename builder (Plan 48-05): `<ordinal>-<slug>.png`
 *
 * Determinism invariant (SCAF-08): no wall-clock timestamps, no randomness — pure function of input.
 */
export function slugify(input: string): string {
  if (input === '/') return 'home'
  const trimmed = input.trim()
  if (trimmed.length === 0) return ''
  const lowered = trimmed.toLowerCase()
  const withoutLeadingSlash = lowered.replace(/^\/+/, '')
  const dashedCore = withoutLeadingSlash.replace(/[^a-z0-9]+/g, '-')
  const collapsed = dashedCore.replace(/-+/g, '-')
  const trimmedDashes = collapsed.replace(/^-+|-+$/g, '')
  return trimmedDashes
}

/**
 * detectInterstitial: pure classifier for Cloudflare bot-challenge signals.
 * Returns null when the response looks like a real site page; returns a non-empty
 * reason string when any of the 3 layered signals trips. Caller (Plan 48-03) wraps
 * the non-null return in a CaptureError and aborts the run (CAPT-11).
 *
 * Layered signals (any match => interstitial):
 *   1. <title> contains 'Just a moment' (case-insensitive)
 *   2. Response body size < 200 bytes
 *   3. DOM contains 'cf-chl-opt' OR 'challenge-platform' substring
 */
export function detectInterstitial(input: {
  readonly title: string
  readonly bodyBytes: number
  readonly html: string
}): string | null {
  if (/just a moment/i.test(input.title)) {
    return `title contains "Just a moment" — got "${input.title}"`
  }
  if (input.bodyBytes < 200) {
    return `response body < 200 bytes (got ${input.bodyBytes}) — likely CF challenge stub`
  }
  if (input.html.includes('cf-chl-opt')) {
    return 'DOM contains "cf-chl-opt" marker — Cloudflare challenge page'
  }
  if (input.html.includes('challenge-platform')) {
    return 'DOM contains "challenge-platform" marker — Cloudflare challenge page'
  }
  return null
}

/**
 * loadFaqItemCount — source-of-truth count for FAQ assertions (CAPT-07, CAPT-08).
 * Derives the faq.json path from exhibitsJsonPath (both live in
 * src/data/json/). Read via fs.readFile + JSON.parse (same mechanism as
 * routes.ts — SCAF-08 bars path-alias imports, JSON import assertions, and
 * dynamic-import JSON loading, so direct stdlib I/O is the only option).
 *
 * Throws native Error on parse failure / non-array; caller (Plan 48-03)
 * wraps the error in a CaptureError with route context.
 */
export async function loadFaqItemCount(
  exhibitsJsonPath: string,
): Promise<number> {
  const dir = nodePath.dirname(exhibitsJsonPath)
  const faqJsonPath = nodePath.join(dir, 'faq.json')
  const fileContents = await fsp.readFile(faqJsonPath, 'utf8')
  const parsed: unknown = JSON.parse(fileContents)
  if (!Array.isArray(parsed)) {
    throw new Error(
      `faq.json must be a JSON array (read from ${faqJsonPath}; got ${typeof parsed})`,
    )
  }
  return parsed.length
}

/**
 * launchBrowser — single chromium.launch() per run. Respects --headful via
 * config.headful; headless by default (CAPT-03). Caller owns the returned
 * Browser and MUST call browser.close() in a finally block (Plan 48-06 does this).
 */
export function launchBrowser(config: EditorialConfig): Promise<Browser> {
  return chromium.launch({ headless: !config.headful })
}

/**
 * buildContextOptions — deterministic BrowserContextOptions for the single
 * context used across all route captures. Fixed 1280x800 viewport + fixed
 * light colorScheme (CAPT-12); Cache-Control: no-cache applied to every
 * request originating from this context (CAPT-10).
 */
export function buildContextOptions(): BrowserContextOptions {
  return {
    viewport: { width: 1280, height: 800 },
    colorScheme: 'light',
    extraHTTPHeaders: { 'Cache-Control': 'no-cache' },
  }
}

/**
 * buildCaptureUrl — append a deterministic `_cb=<slug>` cache-buster query
 * parameter to `${baseUrl}${route.path}`. Slug seed is route.sourceSlug when
 * present (exhibit routes) else slugify(route.path). Uses `?` if route.path
 * has no query string, `&` if it already contains `?` (defensive).
 *
 * Determinism: no timestamp, no random — same (baseUrl, route) => same URL.
 * CAPT-10: cache-buster query param on every request.
 */
export function buildCaptureUrl(baseUrl: string, route: Route): string {
  const seed = route.sourceSlug ?? route.path
  const slug = slugify(seed)
  const separator = route.path.includes('?') ? '&' : '?'
  return `${baseUrl}${route.path}${separator}_cb=${slug}`
}

/**
 * runFaqPreCaptureHooks — FAQ page pre-capture DOM choreography (CAPT-07, CAPT-08).
 *
 * Order (LOCKED per CONTEXT.md):
 *   1. Click [data-filter="all"]; wait for .faq-accordion-item rendered
 *      count === faqItemCount (10s timeout).
 *   2. Click every .faq-accordion-item [aria-expanded="false"] sequentially;
 *      wait for every .faq-accordion-item [aria-expanded] to equal 'true'
 *      (10s timeout).
 *
 * Hard-fail: both waits throw CaptureError with an actionable message on
 * timeout / count mismatch. Caller (Plan 48-03) attaches the Route to the
 * error via opts.route when re-throwing.
 */
export async function runFaqPreCaptureHooks(
  page: Page,
  faqItemCount: number,
): Promise<void> {
  // Step 1: filter-all click + count wait (CAPT-08).
  await page.click('[data-filter="all"]')
  try {
    await page.waitForFunction(
      (expected: number) =>
        document.querySelectorAll('.faq-accordion-item').length === expected,
      faqItemCount,
      { timeout: 10_000 },
    )
  } catch (cause) {
    const actualCount = await page
      .$$eval('.faq-accordion-item', (els) => els.length)
      .catch(() => -1)
    throw new CaptureError(
      `FAQ rendered count mismatch: expected ${faqItemCount}, got ${actualCount} after filter-all click`,
      { cause },
    )
  }

  // Step 2: sequentially click every aria-expanded="false" trigger (CAPT-07).
  const collapsedTriggers = await page
    .locator('.faq-accordion-item [aria-expanded="false"]')
    .all()
  for (const trigger of collapsedTriggers) {
    await trigger.click()
  }

  // Wait for every trigger to report aria-expanded="true".
  try {
    await page.waitForFunction(
      () =>
        Array.from(
          document.querySelectorAll('.faq-accordion-item [aria-expanded]'),
        ).every((el) => el.getAttribute('aria-expanded') === 'true'),
      undefined,
      { timeout: 10_000 },
    )
  } catch (cause) {
    throw new CaptureError(
      `FAQ accordion expansion timed out: expected ${faqItemCount} expanded items, some remained aria-expanded="false"`,
      { cause },
    )
  }
}

/**
 * resolveScreenshotDir — derive the absolute screenshots directory from
 * config.outputPath. Path shape (LOCKED per CONTEXT.md):
 *   <dirname(outputPath)>/site-editorial-capture/screenshots
 *
 * Pure function. Same config always produces the same path (SCAF-08
 * determinism).
 */
export function resolveScreenshotDir(config: EditorialConfig): string {
  return nodePath.join(
    nodePath.dirname(config.outputPath),
    'site-editorial-capture',
    'screenshots',
  )
}

/**
 * ensureScreenshotDir — resolve + create the screenshots directory.
 * Idempotent via fs.mkdir({ recursive: true }). Returns the absolute path
 * so the caller can feed it straight into buildScreenshotPath without
 * re-resolving.
 */
export async function ensureScreenshotDir(
  config: EditorialConfig,
): Promise<string> {
  const dir = resolveScreenshotDir(config)
  await fsp.mkdir(dir, { recursive: true })
  return dir
}

/**
 * buildScreenshotPath — compose the absolute PNG filepath for one route.
 * Filename: `<NN>-<slug>.png` where NN is index zero-padded to 2 digits
 * (minimum; 3+ digit indices pass through unclamped) and slug is
 * slugify(route.sourceSlug ?? route.path).
 *
 * Determinism: same (config, index, route) => same path. No timestamps.
 */
export function buildScreenshotPath(
  config: EditorialConfig,
  index: number,
  route: Route,
): string {
  const dir = resolveScreenshotDir(config)
  const ordinal = String(index).padStart(2, '0')
  const seed = route.sourceSlug ?? route.path
  const slug = slugify(seed)
  return nodePath.join(dir, `${ordinal}-${slug}.png`)
}

/**
 * captureScreenshot — wrap page.screenshot with the locked options for CAPT-13:
 *   fullPage: true (captures beyond the viewport)
 *   path: absolute PNG destination (caller supplies via buildScreenshotPath)
 *   type: 'png' (no jpeg quality branch)
 *
 * Caller is responsible for ensureScreenshotDir(config) having run once at
 * the start of the capture phase so the destination directory exists.
 * Any Playwright error propagates — Plan 48-03's loop wraps with route context.
 */
export async function captureScreenshot(
  page: Page,
  absPath: string,
): Promise<void> {
  await page.screenshot({
    fullPage: true,
    path: absPath,
    type: 'png',
  })
}

/**
 * capturePage — per-route capture orchestration.
 *
 * Orchestrates CAPT-04 (page-ready wait), CAPT-05 (HTTP status), CAPT-06
 * (main-content scoping), CAPT-09 (exhibit-404 detection), CAPT-11
 * (interstitial detection), CAPT-13 (screenshot), CAPT-14 (console errors),
 * CAPT-15 (SEO meta), with FAQ pre-capture hooks (CAPT-07/08) gated on
 * route.path === '/faq'.
 *
 * Inter-request delay (1500ms per CONTEXT.md) is the caller's responsibility
 * (captureRoutes in Plan 48-06) — this function returns as soon as the single
 * route is fully captured.
 */
export async function capturePage(
  context: BrowserContext,
  config: EditorialConfig,
  route: Route,
  index: number,
  faqItemCount: number,
): Promise<CapturedPage> {
  const page = await context.newPage()

  try {
    const consoleErrors: string[] = []

    // Attach listeners BEFORE navigation (CAPT-14) — any error between goto
    // start and main-content ready would otherwise be missed. Attachment lives
    // INSIDE the try block so a throw during page.on() (e.g. "Target closed"
    // on a racing page teardown) still triggers the finally { page.close() }
    // cleanup below.
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message)
    })

    const url = buildCaptureUrl(config.baseUrl, route)
    const response = await page.goto(url, {
      timeout: 30_000,
      waitUntil: 'domcontentloaded',
    })

    const httpStatus = response?.status() ?? 0
    const cfCacheStatus = response?.headers()['cf-cache-status']

    // Cloudflare interstitial detection (CAPT-11) — MUST run BEFORE
    // waitForSelector('#main-content') because real CF challenge pages never
    // render <main id="main-content">; the selector wait would TimeoutError
    // first, masking the actionable interstitial message.
    //
    // CONTEXT.md <specifics> (line 144) locks the content-length signal to
    // `response.body().then(b => b.length)` — the raw HTTP response body,
    // NOT the scoped main-content innerHTML. Read it once here and feed both
    // byteLength (signal 2) and the utf8 string (signal 3 DOM-marker scan)
    // through detectInterstitial. page.title() is wrapped in catch('') because
    // a challenge page may tear down the title lookup before domcontentloaded.
    const rawBody = (await response?.body()) ?? Buffer.alloc(0)
    const rawBodyHtml = rawBody.toString('utf8')
    const preReadyTitle = await page.title().catch(() => '')
    const interstitialReason = detectInterstitial({
      title: preReadyTitle,
      bodyBytes: rawBody.byteLength,
      html: rawBodyHtml,
    })
    if (interstitialReason !== null) {
      throw new CaptureError(
        `Cloudflare bot interstitial detected on ${route.path} — ${interstitialReason}`,
        { route },
      )
    }

    await page.waitForSelector('#main-content', { timeout: 10_000 })

    // FAQ pre-capture hooks (CAPT-07/08) — gated on route path.
    if (route.path === '/faq') {
      await runFaqPreCaptureHooks(page, faqItemCount)
    }

    // SEO meta capture (CAPT-15).
    const pageTitle = await page.title()
    const description =
      (await page.locator('meta[name="description"]').getAttribute('content')) ?? ''

    // Main-content scoping (CAPT-06) — NavBar, FooterBar, skip-link excluded.
    const mainHtml = await page.locator('main#main-content').innerHTML()

    // Exhibit-route SPA-404 assertion (CAPT-09) — silent NotFoundPage at HTTP 200
    // is detected by missing .exhibit-detail-title (both exhibit layouts render it).
    if (route.category === 'exhibit') {
      const exhibitTitleCount = await page.locator('.exhibit-detail-title').count()
      if (exhibitTitleCount !== 1) {
        throw new CaptureError(
          `Exhibit route ${route.path} did not render .exhibit-detail-title (count=${exhibitTitleCount}) — likely silent 404`,
          { route },
        )
      }
    }

    // Screenshot (CAPT-13) — full-page PNG at the deterministic filename.
    const screenshotPath = buildScreenshotPath(config, index, route)
    await captureScreenshot(page, screenshotPath)

    const result: CapturedPage = {
      route,
      httpStatus,
      mainHtml,
      title: pageTitle,
      description,
      consoleErrors: [...consoleErrors],
      screenshotPath,
      cfCacheStatus,
    }
    return result
  } finally {
    await page.close()
  }
}

/**
 * captureRoutes — Playwright-driven per-route capture (Plan 48-06 integration).
 *
 * Thin sequential orchestrator that composes every Wave 1/2/3 helper:
 *   1. ensureScreenshotDir(config) — fail-loud preflight BEFORE browser boot.
 *   2. loadFaqItemCount(config.exhibitsJsonPath) — also preflight; missing
 *      faq.json must fail before spawning Chromium (expensive).
 *   3. launchBrowser(config) — single Browser per run.
 *   4. browser.newContext(buildContextOptions()) — single BrowserContext (shared
 *      CF clearance + Cache-Control header + fixed 1280x800 viewport).
 *   5. for (let i = 0; i < routes.length; i += 1): capturePage per route,
 *      push result, then — if NOT the last route — sleep 1500ms via a throwaway
 *      page.waitForTimeout(). CONTEXT.md: 1500ms deterministic delay via
 *      Playwright's approved sleep channel (SCAF-08 forbids Node timers and
 *      parallel-iteration helpers on the ordered route list).
 *   6. Nested try/finally guarantees context.close + browser.close even on
 *      CaptureError abort (Cloudflare interstitial, silent 404, FAQ mismatch).
 *
 * Error policy (CONTEXT.md "no retries" ethos):
 *   - CaptureError thrown by capturePage propagates unchanged (preserves the
 *     original route + reason).
 *   - Any other thrown value is wrapped in CaptureError with route context so
 *     Plan 50's index.ts error printer always has a route to display.
 */
export async function captureRoutes(
  config: EditorialConfig,
  routes: readonly Route[],
): Promise<readonly CapturedPage[]> {
  // Fail-loud preflight BEFORE browser boot (CONTEXT.md: "fail early" ethos).
  await ensureScreenshotDir(config)
  const faqItemCount = await loadFaqItemCount(config.exhibitsJsonPath)

  const browser = await launchBrowser(config)
  try {
    const context = await browser.newContext(buildContextOptions())
    try {
      const captured: CapturedPage[] = []
      for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i]
        try {
          const page = await capturePage(context, config, route, i, faqItemCount)
          captured.push(page)
        } catch (err) {
          // Attach route context to non-CaptureError failures so Plan 50's
          // index.ts error printer always has a route to display.
          if (err instanceof CaptureError) {
            throw err
          }
          const message = err instanceof Error ? err.message : String(err)
          throw new CaptureError(
            `Capture failed for ${route.path}: ${message}`,
            { route, cause: err },
          )
        }

        // Inter-request delay (CONTEXT.md locked: 1500ms). Skip after last route.
        // Uses page.waitForTimeout on a throwaway page — Playwright's approved
        // sleep channel; Node timers and wall-clock busy-waits are SCAF-08 forbidden.
        if (i < routes.length - 1) {
          const tempPage = await context.newPage()
          try {
            await tempPage.waitForTimeout(1500)
          } finally {
            await tempPage.close()
          }
        }
      }
      return captured
    } finally {
      await context.close()
    }
  } finally {
    await browser.close()
  }
}
