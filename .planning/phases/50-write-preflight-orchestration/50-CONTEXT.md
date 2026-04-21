# Phase 50: Write + Preflight + Orchestration - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning
**Mode:** Smart discuss — 5 ROADMAP success criteria + 12 SHAP-01..07/WRIT-03..07 REQ-IDs; 3 grey areas resolved

<domain>
## Phase Boundary

Wire `scripts/editorial/index.ts` end-to-end: `loadConfig` → `loadRoutes` → per-route `capturePage` (with Phase 50–owned resilience, NOT strict `captureRoutes`) → `convertCapturedPage` → assemble monolithic Markdown document → atomic write → summary. Produces `<vault>/career/website/site-editorial-capture.md` (+ optional `.planning/research/` mirror). Implements `scripts/editorial/write.ts` + `scripts/editorial/document.ts` (document assembly) as new modules.

**Not in scope:** capture/convert logic (Phase 48/49), editorial review of the produced artifact (Phase 51), v9.0 direction decision (Phase 52).

</domain>

<decisions>
## Implementation Decisions

### Orchestration Topology — Phase 48 strict vs. Phase 50 resilient

**Locked tension resolution:** Phase 48's `captureRoutes` is strict (abort on first CaptureError). Phase 50 needs per-route failure + continue (WRIT-07). **Phase 50 does NOT call `captureRoutes`.** Instead, Phase 50's orchestrator drives the capture loop itself:

```ts
// index.ts orchestration (simplified)
const browser = await launchBrowser(config)
const context = await browser.newContext(buildContextOptions())
const faqItemCount = await loadFaqItemCount(config.exhibitsJsonPath)
await ensureScreenshotDir(config)

const captured: CapturedPage[] = []
const failures: RouteFailure[] = []

try {
  for (let i = 0; i < routes.length; i += 1) {
    const page = await context.newPage()
    try {
      const result = await capturePage(context, config, routes[i], i, faqItemCount)
      captured.push(result)
    } catch (err) {
      if (isInterstitialFailure(err)) throw err  // abort whole run
      failures.push({ route: routes[i], error: err })
    } finally {
      await page.close()
    }
    if (i < routes.length - 1) {
      const tempPage = await context.newPage()
      await tempPage.waitForTimeout(1500)
      await tempPage.close()
    }
  }
} finally {
  await browser.close()
}
```

- **Uses Phase 48's exported helpers directly**: `launchBrowser`, `buildContextOptions`, `loadFaqItemCount`, `ensureScreenshotDir`, `capturePage`. NO new wrapper in capture.ts.
- **Interstitial is fatal**: if `err instanceof CaptureError && err.message.startsWith('Cloudflare bot interstitial')` (or equivalent sniff) → re-throw to abort. Other `CaptureError`s (silent 404, FAQ assertion mismatch, selector timeout) are logged and capture continues for remaining routes.
- **`isInterstitialFailure(err)` discriminator**: helper in `index.ts` that checks `err instanceof CaptureError && /bot interstitial/.test(err.message)`. Tight coupling to the message format is acceptable — both live in the same package.
- **Failed route placeholder in document**: the document assembler emits a `## Route: /path` heading + metadata block with `> **Capture failed:** <error summary>` + `---` separator. Keeps route visible in ToC and document for editorial review.

### Document Shape (SHAP-02..06)

- **Frontmatter serializer**: custom minimal builder in `scripts/editorial/document.ts` — uses the `yaml` package (already a direct dep, added in v7.0). Does NOT reuse `scripts/markdown-export/frontmatter/serialize.ts` — that module has Obsidian-note-specific constraints (canonical title/tags/aliases key order, forbidden singular keys) that don't apply to editorial-capture provenance frontmatter. A thin 15-line builder fits better. (Discovered during context gathering: the v7.0 serializer's shape doesn't generalize cleanly.)
- **Frontmatter shape (SHAP-02)** — YAML:
  ```yaml
  ---
  captured_at: 2026-04-20T17:30:00.000Z
  source_url: https://pattern158.solutions
  site_version_sha: abc1234              # empty string if <meta name="git-sha"> absent
  tool_version: editorial-capture/def5678+dirty
  routes_captured: 22
  routes_failed: 0
  ---
  ```
- **ToC (SHAP-04)** — Right below frontmatter, before the first `## Route:` heading. Shape:
  ```markdown
  ## Contents

  - [Home](#route-home)
  - [Philosophy](#route-philosophy)
  - [Case Files](#route-case-files)
  ...
  ```
  - Anchor derivation: `githubSlugger.slug(\`route-${route.path === '/' ? 'home' : route.path.replace(/^\//, '').replace(/\//g, '-')}\`)`. Matches the `## Route: /path` heading slug.
  - `github-slugger` already a v7.0 devDep.
  - Label source: `route.label` (from Phase 47 Route shape).
- **Route heading (SHAP-03)** — `## Route: /path` — literal `/` preserved. Original page H1 already demoted to H3 by Phase 49 `demoteHeadings`, so nesting is `## Route > ### PageH1 > #### PageH2 ...`.
- **Per-page metadata block (SHAP-05)** — blockquote, immediately after route heading, before the converted Markdown:
  ```markdown
  ## Route: /faq

  > **Captured:** 2026-04-20T17:30:01.342Z
  > **Status:** 200
  > **CF Cache:** HIT
  > **Title:** FAQ | Pattern 158 - Dan Novak
  > **Description:** Frequently asked questions about hiring Dan Novak...

  ### FAQ
  ...
  ```
  - **Omit empty/missing fields entirely.** If description is empty, no `Description:` line. If `cfCacheStatus` is undefined, no `CF Cache:` line.
  - **Captured-at** per-route is the per-route navigation timestamp — but since capture is sequential and deterministic, we inject the RUN-START time for every route's per-page `Captured` line. Phase 48 does not record per-route timestamps; using run-start keeps the document deterministic (byte-equal re-runs on identical input). If per-route timestamps become valuable, revisit in v9.0.
  - **Console errors**: NOT in the metadata block (too noisy for editorial review). Surfaced in the stdout summary only.
- **Route separator (SHAP-06)** — `\n\n---\n\n` between routes. Between the last route body and EOF: newline then end.
- **Route ordering (SHAP-07)** — delegated to Phase 47's `loadRoutes(config)`. Already locked.

### Write Semantics (WRIT-03..05)

- **Atomic write (WRIT-03)**:
  ```ts
  const temp = `${config.outputPath}.tmp-${process.pid}`
  await fsp.writeFile(temp, finalMarkdown, { encoding: 'utf8' })
  await fsp.rename(temp, config.outputPath)
  ```
  - PID-based temp suffix avoids collisions on accidental parallel runs.
  - `encoding: 'utf8'` explicit.
  - Line endings: `\n` only (SCAF-08). No `\r\n` anywhere — `document.ts` uses literal `\n` throughout; the joined markdown is `\n`-native.
- **Idempotent overwrite (WRIT-04)**:
  - `fsp.rename` silently overwrites on POSIX (which WSL is). No `unlink` pre-step.
  - Two consecutive runs against the same site must produce byte-equal files. Guaranteed by: deterministic frontmatter (run-start timestamp is run-specific, but `captured_at` is the ONE expected wall-clock value; the rest of the document is pure-function of HTML). Inside a single run, every `Captured:` line is the same ISO string.
  - **Determinism test** (locked via unit test): run the assembler twice against the same input fixture with the same `captured_at` injected — assert byte-equal.
- **`--mirror` (WRIT-05)**:
  - When `config.mirror === true`: after the primary atomic write, ALSO write byte-for-byte-identical file to `.planning/research/site-editorial-capture.md`.
  - Same atomic pattern (temp + rename).
  - Same content — no additional frontmatter indicating "this is a mirror." Mirror file is a pure duplicate for repo-scoped review.

### Provenance (SHAP-02)

- **`captured_at`** — captured ONCE at orchestrator start via `new Date().toISOString()`. Passed down as a string into `assembleDocument(config, captured, failures, capturedAt, toolVersion, siteVersionSha)`. This is the single allowed wall-clock read per run; it lives at the boundary in `index.ts` (not inside `capture.ts`, `convert.ts`, or `document.ts`). SCAF-08 is about **library-code** determinism — the orchestrator may inject a run-start timestamp, but library modules may not invent one.
- **`source_url`** — `config.baseUrl` verbatim.
- **`site_version_sha`** — try to read from the HOME route's `mainHtml`:
  ```ts
  const homeHtml = captured.find(p => p.route.path === '/')?.mainHtml ?? ''
  const match = homeHtml.match(/<meta\s+name="git-sha"\s+content="([^"]+)"/i)
  const siteVersionSha = match?.[1] ?? ''
  ```
  Fallback: empty string. No separate `/version.json` fetch.
- **`tool_version`** — `editorial-capture/${git-short-sha}${isDirty ? '+dirty' : ''}`:
  ```ts
  const shortSha = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  const isDirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0
  const toolVersion = `editorial-capture/${shortSha}${isDirty ? '+dirty' : ''}`
  ```
  If git execution fails (unlikely — this is a git repo), fallback to `editorial-capture/unknown`.

### Summary + Exit Code (WRIT-06, WRIT-07)

- **Stdout** (human-readable):
  ```
  [editorial-capture] Captured 22 routes in 48.3s → /home/.../site-editorial-capture.md (142.7 KB)
                      Failed: 0
  ```
  (Or `Failed: 2 — /exhibit-x: silent 404; /exhibit-y: selector timeout` if `failures.length > 0`.)
- **Stderr** (structured JSON):
  ```json
  {
    "captured": 22,
    "failed": 0,
    "outputPath": "/home/...",
    "outputBytes": 146123,
    "elapsedMs": 48321,
    "failures": []
  }
  ```
  Emitted to stderr so CI scrapers don't collide with human stdout.
- **Exit code (WRIT-06)**:
  - `0` iff every captured page has `httpStatus === 200` AND `mainHtml.length >= 200` AND `failures.length === 0`.
  - `1` otherwise — any per-route failure or any short-body capture.
  - Interstitial abort exits `1` (general runtime error, not config).
- **Per-route failure logging (WRIT-07)** is the `failures` array. Emitted both in stdout summary and JSON stderr. Capture continues past any non-interstitial failure.

### Export Surface (NEW modules)

**`scripts/editorial/document.ts`** — new module:
```ts
export interface DocumentAssemblyInput {
  readonly config: EditorialConfig
  readonly captured: readonly ConvertedPage[]
  readonly failures: readonly RouteFailure[]
  readonly capturedAt: string        // ISO 8601
  readonly toolVersion: string
  readonly siteVersionSha: string
}

export interface RouteFailure {
  readonly route: Route
  readonly error: unknown            // CaptureError | Error
  readonly httpStatus?: number
}

export function assembleDocument(input: DocumentAssemblyInput): string
export function buildFrontmatter(input: DocumentAssemblyInput): string
export function buildToc(captured: readonly ConvertedPage[], failures: readonly RouteFailure[]): string
export function buildRouteSection(page: ConvertedPage, capturedAt: string): string
export function buildFailedRouteSection(failure: RouteFailure, capturedAt: string): string
export function slugForRoute(route: Route): string
```

**`scripts/editorial/write.ts`** — new module:
```ts
export async function atomicWrite(absPath: string, content: string): Promise<void>
export async function writePrimaryAndMirror(config: EditorialConfig, content: string): Promise<{
  readonly primaryPath: string
  readonly mirrorPath?: string
}>
```

**`scripts/editorial/index.ts`** — rewrite of the Phase 46 placeholder:
- `main()` — async. Orchestrates: loadConfig, loadRoutes, browser+context setup, per-route capture (w/ resilience), convert, assemble, write, summary. Exits with proper code.
- No new exports needed — this is the CLI entry.

### Test Surface

- `document.test.ts`:
  - `buildFrontmatter` produces expected YAML for a simple input.
  - `buildToc` generates anchors matching `## Route:` heading slugs.
  - `buildRouteSection` includes heading + metadata blockquote + markdown + separator.
  - `buildRouteSection` omits metadata lines when fields are empty.
  - `buildFailedRouteSection` includes heading + error blockquote + separator.
  - `slugForRoute` — home `/` → `route-home`, `/faq` → `route-faq`, `/exhibit/a` → `route-exhibit-a`.
  - `assembleDocument` end-to-end: frontmatter → ToC → routes → separators → EOF newline. Byte-equal on two identical inputs with same `capturedAt`.
- `write.test.ts`:
  - `atomicWrite` uses temp+rename (spy on fsp.rename, assert called with correct paths).
  - `writePrimaryAndMirror` writes both files when `config.mirror === true`; only primary when `false`.
  - Atomic-write temp cleanup on failure (best-effort).
- `index.test.ts` (integration smoke, mocked Playwright + happy-dom capture):
  - End-to-end: mock capture returns 2 fake `CapturedPage`s → main produces expected file contents.
  - Per-route failure: mock throws CaptureError on route 2 → document includes failed-route section, exit code is 1, other routes captured.
  - Interstitial abort: mock throws Cloudflare-interstitial CaptureError → process exits early, no file written.

### Determinism + SCAF-08 Discipline

- Every library module (capture, convert, document, write) is a pure function of inputs.
- `index.ts` is the ONE place wall-clock is read (`new Date().toISOString()` + `execSync` for git info). These reads happen ONCE at startup.
- No `Promise.all` over routes (sequential for-of).
- No `os.EOL` — literal `\n`.
- No `@/` aliases — relative imports.

### Error Surface

- `ConfigError` (Phase 47) → exit 2.
- `CaptureError` interstitial → exit 1 with clear message.
- Other `CaptureError` per route → logged, capture continues, exit 1 at end IF any non-interstitial failures occurred.
- `fs.rename` failure → fatal, exit 1 with cleanup attempt on temp file.
- `execSync` failure for git info → fallback strings, continue.
- `document.ts` assembly is pure — throws only on logic bugs (never in production).

### Claude's Discretion

- Exact interstitial-discrimination regex (`/bot interstitial/` vs `/Cloudflare/` etc.) — pick a robust marker.
- Exact stdout formatting (column alignment, whether to use emoji) — keep terse.
- Whether to bracket `tool_version` git SHA in a code span for readability in Obsidian — probably no.
- Buffering strategy for document assembly — array-join is fine, no streaming needed.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/editorial/capture.ts` (Phase 48) — exports `capturePage`, `launchBrowser`, `buildContextOptions`, `loadFaqItemCount`, `runFaqPreCaptureHooks`, `ensureScreenshotDir`, `buildCaptureUrl`, `CaptureError`. Phase 50 composes these; does NOT use `captureRoutes` (too strict).
- `scripts/editorial/convert.ts` (Phase 49) — exports `convertCapturedPage`, `convertCapturedPages`. Phase 50 uses `convertCapturedPage` per-route inside the orchestration loop (consistent with the per-route resilience pattern).
- `scripts/editorial/routes.ts` (Phase 47) — `loadRoutes(config)` produces ordered `Route[]`. Phase 50 invokes once at startup.
- `scripts/editorial/config.ts` (Phase 47) — `loadConfig()` produces `EditorialConfig`. Phase 50 invokes once at startup.
- `scripts/editorial/index.ts` (Phase 46 placeholder) — rewritten entirely in Phase 50.
- `scripts/editorial/write.ts` (Phase 46 placeholder) — replaced; Phase 46 body is a throwing stub.
- `github-slugger` — devDep from v7.0, available for ToC anchor generation.
- `yaml` — direct dep from v7.0, available for frontmatter serialization.
- `node:child_process.execSync` — for git SHA extraction.

### Established Patterns
- Composite TS project + NodeNext, `.ts` extensions on relative imports.
- Throwing-stub → concrete impl replacement.
- Typed errors with structured fields (`ConfigError`, `CaptureError`).
- Sequential for-of over ordered collections (SCAF-08).
- Hermetic unit tests with inline fixtures.

### Integration Points
- `scripts/editorial/index.ts` becomes the CLI entry. `pnpm editorial:capture` script in package.json already points to it via `tsx scripts/editorial/index.ts`.
- Obsidian vault path comes from `EditorialConfig.outputPath` — already validated by Phase 47 preflight.
- `.planning/research/` directory may or may not exist — `writePrimaryAndMirror` creates it recursively if `--mirror` is set.

### Pre-existing Frontmatter Serializer
`scripts/markdown-export/frontmatter/serialize.ts` (v7.0 Phase 38) has Obsidian-note-specific constraints (canonical `title/tags/aliases` order, forbidden singular keys `tag`/`alias`/`cssclass`). Does NOT generalize to editorial-capture provenance frontmatter. Phase 50 writes its own minimal builder using the `yaml` package directly.

</code_context>

<specifics>
## Specific Ideas

- **Interstitial discriminator**:
  ```ts
  function isInterstitialFailure(err: unknown): boolean {
    return err instanceof CaptureError && /bot interstitial/i.test(err.message)
  }
  ```

- **Document EOF convention**: `assembleDocument` returns with EXACTLY one trailing `\n`. No trailing blank line.

- **Metadata blockquote construction**:
  ```ts
  const lines: string[] = [`> **Captured:** ${capturedAt}`, `> **Status:** ${page.httpStatus}`]
  if (page.cfCacheStatus) lines.push(`> **CF Cache:** ${page.cfCacheStatus}`)
  if (page.title) lines.push(`> **Title:** ${page.title}`)
  if (page.description) lines.push(`> **Description:** ${page.description}`)
  return lines.join('\n')
  ```

- **ToC entry for failed route**: show label with a strikethrough or `(failed)` suffix:
  ```markdown
  - [FAQ (failed)](#route-faq)
  ```

- **Assembly order in `assembleDocument`**:
  1. Frontmatter (`---\n...\n---`)
  2. blank line
  3. `## Contents\n\n` ToC block
  4. blank line
  5. `---` separator
  6. blank line
  7. For each captured/failed route in `routes` order: route section + blank line + `---` + blank line
  8. After the LAST route, trim trailing `---\n\n` and end with `\n`.

- **Mirror write semantics**: `writePrimaryAndMirror` performs the primary write first; if primary succeeds, then attempts the mirror. Mirror failure is LOGGED (stderr) but does NOT fail the overall run (`--mirror` is optional per WRIT-05).

- **Path safety**: Phase 47 preflight has already validated `config.outputPath` is writable. Phase 50 does NOT re-validate. For `--mirror`, `.planning/research/` path is project-relative; it's always safe to create.

</specifics>

<deferred>
## Deferred Ideas

- **Timestamped version history** (`WRIT-TIMESTAMP`) — explicitly deferred in REQUIREMENTS.md; idempotent overwrite is simpler.
- **Retry on Cloudflare challenge** — not implemented; user escalates via `--headful`.
- **Parallel capture + write streaming** — forbidden by SCAF-08 this milestone.
- **Partial-run resume** — out of scope for v1; re-runs are full.
- **HTML output variant** — out of scope; Markdown only.
- **Editorial findings format in the document** — Phase 51 writes its own findings artifact; Phase 50 doesn't pre-structure for it.

</deferred>
