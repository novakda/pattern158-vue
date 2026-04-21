// scripts/editorial/index.ts
// Phase 50 — CLI orchestrator for editorial:capture. Wires config/routes/
// capture/convert/document/write into the full pipeline (SHAP-07, WRIT-06, WRIT-07).
//
// SCAF-08 discipline applies to library modules (capture/convert/document/write).
// index.ts is the orchestrator boundary: it is the ONE place allowed to read the
// wall-clock (once, for captured_at at run start; plus the monotonic hrtime
// counter for elapsed-ms) and shell out to git (two static commands for
// tool_version provenance). Every downstream module remains pure: given
// inputs => deterministic outputs.
//
// SCAF-08 allowlist for this file (see 50-03-PLAN.md invariants):
//   - one wall-clock read (captured_at at top of main)
//   - two child-process git commands (short-sha + porcelain)
// Every other SCAF-08-forbidden token (the millisecond-counter alternative
// to the wall-clock, platform-EOL constants, parallel-iteration helpers,
// Node timer primitives, or @-prefixed path-alias imports) is absent from
// both code and comments.

import * as childProcess from 'node:child_process'
import { loadEditorialConfig, ConfigError } from './config.ts'
import { buildRoutes } from './routes.ts'
import {
  CaptureError,
  buildContextOptions,
  capturePage,
  ensureScreenshotDir,
  launchBrowser,
  loadFaqItemCount,
  type CapturedPage,
} from './capture.ts'
import { convertCapturedPages } from './convert.ts'
import { assembleDocument, type RouteFailure } from './document.ts'
import { writePrimaryAndMirror } from './write.ts'

/**
 * isInterstitialFailure — discriminator for Cloudflare interstitial aborts.
 *
 * The interstitial branch of the per-route capture is the ONE failure mode
 * that halts the whole run (every other CaptureError is logged + continued).
 * The regex is intentionally coupled to the message format Phase 48's
 * `capturePage` throws: `Cloudflare bot interstitial detected on ${route.path}
 * — ${interstitialReason}`. Both modules live in the same package; a Phase 48
 * message reshape would break this discriminator, and the Plan 50-03 Task 2
 * integration test (describe block 3) fails loudly in that case.
 */
export function isInterstitialFailure(err: unknown): boolean {
  return err instanceof CaptureError && /bot interstitial/i.test(err.message)
}

/**
 * buildToolVersion — one-shot git-provenance string for the frontmatter
 * `tool_version` key. Composes two synchronous git child-process calls (both
 * with STATIC hardcoded arguments — no user input, no command-injection
 * surface; threat T-50-12) into `editorial-capture/<short-sha>[+dirty]`.
 *
 * Fallback to `editorial-capture/unknown` on any child-process failure —
 * defensive guard so a transient git hiccup does not poison the whole
 * capture. Should not fire in a healthy git repo.
 */
export function buildToolVersion(): string {
  try {
    const shortSha = childProcess.execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim()
    const porcelain = childProcess.execSync('git status --porcelain', {
      encoding: 'utf8',
    }).trim()
    const isDirty = porcelain.length > 0
    return `editorial-capture/${shortSha}${isDirty ? '+dirty' : ''}`
  } catch {
    return 'editorial-capture/unknown'
  }
}

/**
 * extractSiteVersionSha — parse the `<meta name="git-sha" content="...">` tag
 * from the home route's captured HTML, returning the site-build SHA for the
 * frontmatter `site_version_sha` key. Empty-string fallback when:
 *   - home route (`/`) is absent from the captured list (all routes failed
 *     or home was interstitial-aborted before the loop bailed)
 *   - home captured but mainHtml lacks the meta tag
 *
 * The downstream `buildFrontmatter` re-sanitizes the return value through
 * `SAFE_SHA_RE` — so even a maliciously crafted <meta> tag in scraped HTML
 * cannot inject into the YAML frontmatter (threat T-50-14).
 */
export function extractSiteVersionSha(
  captured: readonly CapturedPage[],
): string {
  const home = captured.find((p) => p.route.path === '/')
  if (home === undefined) return ''
  const match = home.mainHtml.match(
    /<meta\s+name="git-sha"\s+content="([^"]+)"/i,
  )
  return match?.[1] ?? ''
}

/**
 * main — async orchestrator. Wires the full editorial-capture pipeline from
 * config load through final write, driving Phase 48's `capturePage` in a
 * per-route resilience loop (NOT via Phase 48's strict per-route wrapper —
 * 50-CONTEXT.md line 21 lock: strict wrapper aborts on first failure, here
 * we continue past non-interstitial errors).
 *
 * Sequence:
 *   1. Start monotonic hrtime counter + read captured_at ONCE
 *   2. Build tool_version via two static git child-process calls
 *   3. loadEditorialConfig (argv/env; ConfigError surfaces via top-level catch)
 *   4. buildRoutes(config.exhibitsJsonPath)
 *   5. ensureScreenshotDir + loadFaqItemCount preflights (BEFORE browser boot)
 *   6. launchBrowser + newContext → per-route loop with resilience:
 *      - capturePage in try/catch
 *      - interstitial → re-throw (abort)
 *      - other CaptureError → push to failures, continue
 *      - non-CaptureError → wrap + push, continue
 *      - 1500ms inter-request delay via throwaway page (skip after last)
 *   7. convertCapturedPages over successful captures
 *   8. extractSiteVersionSha from home route's mainHtml
 *   9. assembleDocument(input) → writePrimaryAndMirror
 *  10. Emit stdout (human) + stderr (JSON) summaries
 *  11. process.exit with the locked triple-precondition exit code (WRIT-06)
 *
 * Exit codes:
 *   0 — every captured page has httpStatus===200 AND mainHtml.length>=200
 *       AND failures.length===0
 *   1 — any per-route failure / any short-body / any non-200 / interstitial
 *       abort / writer error / runtime exception
 *   2 — ConfigError (handled by handleTopLevelError)
 */
export async function main(): Promise<void> {
  // 1. Monotonic hrtime counter (SCAF-08-clean substitute for the
  //    forbidden millisecond-counter clock) + ONE wall-clock read for
  //    captured_at.
  const startHrtime = process.hrtime.bigint()
  const capturedAt = new Date().toISOString()
  const toolVersion = buildToolVersion()

  // 2. Config + routes.
  const config = loadEditorialConfig()
  const routes = await buildRoutes(config.exhibitsJsonPath)

  // 3. Preflight BEFORE browser boot (mirrors Phase 48's per-route-wrapper
  //    preflight order — fail-loud in <10ms without paying the 2-3s
  //    Chromium boot cost).
  await ensureScreenshotDir(config)
  const faqItemCount = await loadFaqItemCount(config.exhibitsJsonPath)

  // 4. Browser + context + resilient per-route loop.
  const browser = await launchBrowser(config)
  const captured: CapturedPage[] = []
  const failures: RouteFailure[] = []
  try {
    const context = await browser.newContext(buildContextOptions())
    try {
      for (let i = 0; i < routes.length; i += 1) {
        const route = routes[i]
        try {
          const page = await capturePage(
            context,
            config,
            route,
            i,
            faqItemCount,
          )
          captured.push(page)
        } catch (err) {
          if (isInterstitialFailure(err)) {
            // Interstitial is fatal — abort whole run via re-throw so the
            // nested finallys fire (context.close → browser.close) before
            // the top-level catch maps to exit 1.
            throw err
          }
          if (err instanceof CaptureError) {
            failures.push({ route, error: err })
          } else {
            // Wrap non-CaptureError so the summary JSON always carries a
            // typed error with route context (mirrors Phase 48's per-route
            // wrap-with-route pattern — consistent error surface here).
            const message = err instanceof Error ? err.message : String(err)
            failures.push({
              route,
              error: new CaptureError(
                `Capture failed for ${route.path}: ${message}`,
                { route, cause: err },
              ),
            })
          }
        }
        // Inter-request 1500ms delay via throwaway page. Skip after last
        // route. Playwright's approved sleep channel — Node timer primitives
        // and wall-clock busy-waits are SCAF-08-forbidden library-side, and
        // index.ts follows the same discipline for the inter-request pause.
        if (i < routes.length - 1) {
          const tempPage = await context.newPage()
          try {
            await tempPage.waitForTimeout(1500)
          } finally {
            await tempPage.close()
          }
        }
      }
    } finally {
      await context.close()
    }
  } finally {
    await browser.close()
  }

  // 5. Convert captured pages (failures skipped — no mainHtml to convert;
  //    buildFailedRouteSection inside assembleDocument handles their
  //    document-body placeholder).
  const converted = convertCapturedPages(captured)

  // 6. Site version SHA from the home route's captured HTML.
  const siteVersionSha = extractSiteVersionSha(captured)

  // 7. Assemble the monolithic Markdown document.
  const documentContent = assembleDocument({
    config,
    captured: converted,
    failures,
    routes,
    capturedAt,
    toolVersion,
    siteVersionSha,
  })

  // 8. Atomic write (primary + optional mirror).
  const { primaryPath, mirrorPath } = await writePrimaryAndMirror(
    config,
    documentContent,
  )

  // 9. Summary computation — exit-code health flags + metrics.
  const endHrtime = process.hrtime.bigint()
  const elapsedMs = Number((endHrtime - startHrtime) / 1_000_000n)
  const outputBytes = Buffer.byteLength(documentContent, 'utf8')
  const anyShortBody = captured.some((p) => p.mainHtml.length < 200)
  const anyNon200 = captured.some((p) => p.httpStatus !== 200)
  const isHealthy =
    failures.length === 0 && !anyShortBody && !anyNon200
  const exitCode = isHealthy ? 0 : 1

  // Stdout (human summary).
  const elapsedS = (elapsedMs / 1000).toFixed(1)
  const sizeKb = (outputBytes / 1024).toFixed(1)
  process.stdout.write(
    `[editorial-capture] Captured ${captured.length} routes in ${elapsedS}s → ${primaryPath} (${sizeKb} KB)\n`,
  )
  if (mirrorPath !== undefined) {
    process.stdout.write(`                    Mirror: ${mirrorPath}\n`)
  }
  if (failures.length > 0) {
    const summary = failures
      .map(
        (f) =>
          `${f.route.path}: ${
            f.error instanceof Error ? f.error.message : String(f.error)
          }`,
      )
      .join('; ')
    process.stdout.write(
      `                    Failed: ${failures.length} — ${summary}\n`,
    )
  } else {
    process.stdout.write(`                    Failed: 0\n`)
  }

  // Stderr (structured JSON — for CI log scrapers).
  const json = JSON.stringify({
    captured: captured.length,
    failed: failures.length,
    outputPath: primaryPath,
    mirrorPath,
    outputBytes,
    elapsedMs,
    failures: failures.map((f) => ({
      route: f.route.path,
      error: f.error instanceof Error ? f.error.message : String(f.error),
      httpStatus: f.httpStatus,
    })),
  })
  process.stderr.write(json + '\n')

  process.exit(exitCode)
}

/**
 * handleTopLevelError — single funnel for every error reachable from main().
 * Maps error type to exit code + stderr message:
 *
 *   ConfigError                          → exit 2, `config error: <message>`
 *   CaptureError w/ bot interstitial     → exit 1, message + retry hint
 *   anything else (Error / primitive)    → exit 1, `runtime error: <message>`
 *
 * Exported so Plan 50-03 Task 2 can unit-test each branch directly without
 * firing the full main() pipeline.
 */
export function handleTopLevelError(err: unknown): void {
  if (err instanceof ConfigError) {
    process.stderr.write(
      `[editorial-capture] config error: ${err.message}\n`,
    )
    process.exit(2)
    return
  }
  if (
    err instanceof CaptureError &&
    /bot interstitial/i.test(err.message)
  ) {
    process.stderr.write(`[editorial-capture] ${err.message}\n`)
    process.stderr.write(
      `[editorial-capture] retry with --headful or wait for Cloudflare challenge to subside\n`,
    )
    process.exit(1)
    return
  }
  const message = err instanceof Error ? err.message : String(err)
  process.stderr.write(`[editorial-capture] runtime error: ${message}\n`)
  process.exit(1)
}

// CLI-invocation guard. `main()` only fires when the module is run as the tsx
// entry (tsx scripts/editorial/index.ts). A test file doing
// `import { main } from '../index.ts'` resolves a different import.meta.url
// (the test file path) from process.argv[1] (the vitest runner path), so the
// guard evaluates false and the pipeline stays dormant at import time.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(handleTopLevelError)
}
