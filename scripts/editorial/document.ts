// scripts/editorial/document.ts
// Phase 50 — monolithic Markdown document assembler (SHAP-01..06).
// Pure module: every export is a deterministic function of its inputs.
// No wall-clock reads, no I/O, no Playwright. SCAF-08 forbidden in this
// directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

import GithubSlugger from 'github-slugger'
import { stringify as yamlStringify } from 'yaml'
import type { EditorialConfig } from './config.ts'
import type { Route } from './routes.ts'
import type { ConvertedPage } from './convert.ts'

/**
 * RouteFailure — readonly record carrying a failed route's context from the
 * orchestrator (Phase 50-03 index.ts) into the document assembler. `error` is
 * typed `unknown` so both CaptureError instances and any other thrown value
 * flow through cleanly; the `errorSummary` helper normalizes it into a
 * single-line message for the `Capture failed:` blockquote.
 *
 * `httpStatus` is optional because most failures occur before a response is
 * received (interstitial detection, selector timeout). capturePage records
 * status BEFORE interstitial check, so some failed CaptureError objects
 * carry an httpStatus value — propagated here when available.
 */
export interface RouteFailure {
  readonly route: Route
  readonly error: unknown
  readonly httpStatus?: number
}

/**
 * DocumentAssemblyInput — the full input contract for `assembleDocument`.
 *
 * `routes` is included alongside `captured` + `failures` so the assembler can
 * iterate the ORIGINAL route order when emitting the ToC and per-route sections
 * (captured routes + failed routes interleave in the source order). Without
 * this field the assembler would have to guess ordering from two collections.
 * Phase 50-03's orchestrator builds `routes` once via `buildRoutes(config)` and
 * threads it through unchanged.
 */
export interface DocumentAssemblyInput {
  readonly config: EditorialConfig
  readonly captured: readonly ConvertedPage[]
  readonly failures: readonly RouteFailure[]
  readonly routes: readonly Route[]
  readonly capturedAt: string
  readonly toolVersion: string
  readonly siteVersionSha: string
}

/**
 * Restricts scraped `<meta name="git-sha">` content to a small safe alphabet
 * before it flows into the frontmatter YAML. Git short-SHAs match `[a-f0-9]{7,40}`;
 * the allowed set is widened slightly to accommodate suffixes like `+dirty` or
 * `-rc.1`. Any character outside this class triggers a fallback to empty string
 * to prevent YAML-structural injection from untrusted live-site HTML
 * (threat register T-50-01).
 */
const SAFE_SHA_RE = /^[a-zA-Z0-9._+-]*$/

function sanitizeSha(sha: string): string {
  return SAFE_SHA_RE.test(sha) ? sha : ''
}

/**
 * Extract a single-line error summary from an unknown thrown value.
 *
 * - Error instances (including CaptureError): use `.message` verbatim.
 * - Non-Error objects with a string `message` field: use that field.
 * - Everything else (primitives, null, undefined): use `String(err)`.
 *
 * Used by buildFailedRouteSection to render the `> **Capture failed:**` line.
 */
function errorSummary(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const msg = (err as { message: unknown }).message
    if (typeof msg === 'string') return msg
  }
  return String(err)
}

/**
 * slugForRoute — deterministic anchor slug derivation for the ToC.
 *
 * Home path `/` short-circuits to the synthetic heading text `Route: home` so
 * the anchor slug reads `route-home`. Every other path is pre-transformed —
 * leading slash stripped, inner slashes converted to dashes — and then passed
 * through github-slugger. This pre-transform matters for multi-segment paths
 * like `/exhibits/exhibit-a`: the raw slash-bearing heading text would slug to
 * `route-exhibitsexhibit-a` (slugger drops `/` as punctuation, joining the
 * segments), whereas the pre-transformed text `Route: exhibits-exhibit-a`
 * slugs to the expected `route-exhibits-exhibit-a`.
 *
 * A fresh GithubSlugger instance per call keeps the internal de-dup counter
 * clean — route paths are already unique across the ordered list, so no
 * `-1` suffix is ever needed, but a fresh instance guarantees it.
 */
export function slugForRoute(route: Route): string {
  const headingSlugInput =
    route.path === '/'
      ? 'Route: home'
      : `Route: ${route.path.replace(/^\//, '').replace(/\//g, '-')}`
  const slugger = new GithubSlugger()
  return slugger.slug(headingSlugInput)
}

/**
 * buildFrontmatter — emits the document's top-level YAML frontmatter fence
 * (`---\n<body>\n---`) with the 6 locked provenance keys. Uses `yaml.stringify`
 * directly against a plain object rather than reusing the v7.0 markdown-export
 * serializer (which has Obsidian-note canonical-key-order constraints that do
 * not apply here — see 50-CONTEXT.md line 63).
 *
 * Return value starts with `---\n` and ends with the closing `---` (no trailing
 * newline inside this function — the caller assembleDocument supplies the
 * blank-line separator after the fence).
 */
export function buildFrontmatter(input: DocumentAssemblyInput): string {
  const fm = {
    captured_at: input.capturedAt,
    source_url: input.config.baseUrl,
    site_version_sha: sanitizeSha(input.siteVersionSha),
    tool_version: input.toolVersion,
    routes_captured: input.captured.length,
    routes_failed: input.failures.length,
  }
  const body = yamlStringify(fm).replace(/\n+$/, '')
  return `---\n${body}\n---`
}

/**
 * buildToc — auto-generated table of contents.
 *
 * Iterates `routes` in original order. For each route, emits a bullet line:
 *   - Captured routes → `- [<label>](#<slug>)`
 *   - Failed routes   → `- [<label> (failed)](#<slug>)`
 *
 * Routes present in neither collection are silently skipped (defensive; the
 * orchestrator contract guarantees every route appears in exactly one of the
 * two collections, and assembleDocument's own loop throws if that invariant
 * is violated).
 *
 * No trailing newline — the caller supplies separators.
 */
export function buildToc(
  routes: readonly Route[],
  captured: readonly ConvertedPage[],
  failures: readonly RouteFailure[],
): string {
  const lines: string[] = ['## Contents', '']
  const capturedPaths = new Set(captured.map((p) => p.route.path))
  const failedPaths = new Set(failures.map((f) => f.route.path))
  for (const route of routes) {
    const slug = slugForRoute(route)
    if (capturedPaths.has(route.path)) {
      lines.push(`- [${route.label}](#${slug})`)
    } else if (failedPaths.has(route.path)) {
      lines.push(`- [${route.label} (failed)](#${slug})`)
    }
  }
  return lines.join('\n')
}

/**
 * buildRouteSection — per-page section for a successfully captured route.
 *
 * Structure:
 *   ## Route: <path>                                [heading — literal slash]
 *   <blank>
 *   > **Captured:** <capturedAt>                    [always]
 *   > **Status:** <httpStatus>                      [always]
 *   > **CF Cache:** <cfCacheStatus>                 [omit when undefined/empty]
 *   > **Title:** <title>                            [omit when empty]
 *   > **Description:** <description>                [omit when empty]
 *   <blank>
 *   <page.markdown verbatim, trailing newlines stripped>
 *
 * No trailing newline — the caller supplies separators between sections.
 */
export function buildRouteSection(page: ConvertedPage, capturedAt: string): string {
  const lines: string[] = [
    `## Route: ${page.route.path}`,
    '',
    `> **Captured:** ${capturedAt}`,
    `> **Status:** ${page.httpStatus}`,
  ]
  if (page.cfCacheStatus !== undefined && page.cfCacheStatus.length > 0) {
    lines.push(`> **CF Cache:** ${page.cfCacheStatus}`)
  }
  if (page.title.length > 0) {
    lines.push(`> **Title:** ${page.title}`)
  }
  if (page.description.length > 0) {
    lines.push(`> **Description:** ${page.description}`)
  }
  lines.push('')
  const trimmedMarkdown = page.markdown.replace(/\n+$/, '')
  lines.push(trimmedMarkdown)
  return lines.join('\n')
}

/**
 * buildFailedRouteSection — per-page section for a route that threw during
 * capture. Keeps the route visible in the document body (with a clear failure
 * marker) so editorial review sees what was missed and why.
 *
 * Structure:
 *   ## Route: <path>
 *   <blank>
 *   > **Capture failed:** <error summary>
 *   > **Status:** <httpStatus>                      [only when defined]
 *   > **Captured:** <capturedAt>                    [run-start timestamp]
 *
 * No trailing newline — the caller supplies separators.
 */
export function buildFailedRouteSection(failure: RouteFailure, capturedAt: string): string {
  const lines: string[] = [
    `## Route: ${failure.route.path}`,
    '',
    `> **Capture failed:** ${errorSummary(failure.error)}`,
  ]
  if (failure.httpStatus !== undefined) {
    lines.push(`> **Status:** ${failure.httpStatus}`)
  }
  lines.push(`> **Captured:** ${capturedAt}`)
  return lines.join('\n')
}

/**
 * assembleDocument — top-level composition of the monolithic editorial-capture
 * Markdown document. Pure function of its input: two invocations with the same
 * DocumentAssemblyInput produce byte-equal output (WRIT-04 idempotent-overwrite
 * lock; unit-tested in document.test.ts).
 *
 * Assembly order (50-CONTEXT.md specifics):
 *   1. Frontmatter fence
 *   2. Blank line
 *   3. `## Contents` + ToC lines
 *   4. Blank line
 *   5. `---` horizontal-rule separator
 *   6. Blank line
 *   7. For each route in original order: route section
 *      - Between sections (NOT after the last one): blank + `---` + blank
 *   8. Single trailing `\n`
 *
 * Throws if a route appears in `routes` but in neither `captured` nor
 * `failures` — indicates an orchestrator contract violation upstream.
 */
export function assembleDocument(input: DocumentAssemblyInput): string {
  const frontmatter = buildFrontmatter(input)
  const toc = buildToc(input.routes, input.captured, input.failures)
  const capturedByPath = new Map(input.captured.map((p) => [p.route.path, p]))
  const failedByPath = new Map(input.failures.map((f) => [f.route.path, f]))
  const sections: string[] = []
  for (const route of input.routes) {
    const capturedPage = capturedByPath.get(route.path)
    if (capturedPage !== undefined) {
      sections.push(buildRouteSection(capturedPage, input.capturedAt))
      continue
    }
    const failedRoute = failedByPath.get(route.path)
    if (failedRoute !== undefined) {
      sections.push(buildFailedRouteSection(failedRoute, input.capturedAt))
      continue
    }
    throw new Error(
      `assembleDocument: route ${route.path} not found in captured or failures — orchestrator contract broken`,
    )
  }
  const parts: string[] = [frontmatter, '', toc, '', '---', '']
  for (let i = 0; i < sections.length; i += 1) {
    parts.push(sections[i])
    if (i < sections.length - 1) {
      parts.push('')
      parts.push('---')
      parts.push('')
    }
  }
  return parts.join('\n') + '\n'
}
