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
import { chromium, type Browser, type BrowserContextOptions, type Page } from 'playwright'

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
 * captureRoutes — Playwright-driven per-route capture. STUB in Plan 48-01.
 * Real implementation lands in Plan 48-06 (integration) once Plans 48-02..05 have
 * landed their pure helpers + lifecycle scaffolding.
 */
export function captureRoutes(
  _config: EditorialConfig,
  _routes: readonly Route[],
): Promise<readonly CapturedPage[]> {
  throw new Error('captureRoutes: not implemented until Plan 48-06 integration')
}
