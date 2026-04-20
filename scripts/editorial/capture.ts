// scripts/editorial/capture.ts
// Phase 48 — Playwright-driven editorial capture pipeline (CAPT-03..15).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of in Phase 48)

import type { EditorialConfig } from './config.ts'
import type { Route } from './routes.ts'
import { chromium, type Browser, type BrowserContextOptions } from 'playwright'

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
