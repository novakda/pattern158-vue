---
phase: 48-capture-playwright-io
plan: 05
subsystem: editorial-capture
tags: [editorial-capture, screenshots, filesystem, deterministic-paths, playwright, scaf-08, phase-48]

# Dependency graph
requires:
  - phase: 48-capture-playwright-io
    plan: 01
    provides: "slugify(input) — pure slug helper used for screenshot filename derivation"
  - phase: 48-capture-playwright-io
    plan: 02
    provides: "single `from 'playwright'` import with `type Page` — reused for captureScreenshot signature"
  - phase: 48-capture-playwright-io
    plan: 04
    provides: "`fsp` and `nodePath` stdlib imports already present — Plan 48-05 reuses them without re-importing"
  - phase: 47-config-routes-pure-logic
    provides: "EditorialConfig.outputPath (absolute, preflight-validated) — parent dir anchors the screenshots directory"
  - phase: 47-config-routes-pure-logic
    provides: "Route shape with optional sourceSlug — source-of-truth for screenshot slug seed on exhibit routes"
provides:
  - "resolveScreenshotDir(config) — pure derivation of <dirname(outputPath)>/site-editorial-capture/screenshots via nodePath.join; no I/O"
  - "ensureScreenshotDir(config) — fsp.mkdir({ recursive: true }) over the resolved path; returns the absolute path for direct reuse in buildScreenshotPath"
  - "buildScreenshotPath(config, index, route) — composes <NN>-<slug>.png where NN = String(index).padStart(2,'0') and slug = slugify(route.sourceSlug ?? route.path); deterministic per (config, index, route)"
  - "captureScreenshot(page, absPath) — thin Playwright wrapper locking { fullPage: true, path: absPath, type: 'png' }; Promise<void> return; errors propagate unwrapped"
affects: [48-03, 48-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Deterministic-path helper trio: resolveX (pure derivation) → ensureX (side-effecting mkdir returning the path) → buildX (composes resolveX + seed inputs into a leaf path). The same pattern scales to any tool-output directory where idempotent creation + deterministic per-item paths are needed."
    - "Thin Playwright option wrappers: export an async function whose sole body is `await page.<method>({ ...locked-options })` with no try/catch. Locks configuration at the call site while preserving native error propagation — callers higher in the stack (Plan 48-03) attach route context via their own try/catch."
    - "sourceSlug-precedence alignment across URL + filename: buildCaptureUrl (Plan 48-02) and buildScreenshotPath (this plan) both use `route.sourceSlug ?? route.path` as the slug seed — the cache-buster query slug and the screenshot filename slug stay in lockstep for exhibit routes, making logs correlate one-to-one."

key-files:
  created: []
  modified:
    - scripts/editorial/capture.ts

key-decisions:
  - "Directory literal `site-editorial-capture` + subdirectory literal `screenshots` hardcoded in resolveScreenshotDir, not parameterized. CONTEXT.md locks both names; making them config fields would invite drift and break the convention future Plan-48-06 orchestration (and Phase 49 convert.ts) relies on."
  - "ensureScreenshotDir returns `Promise<string>` (not `Promise<void>`) — the caller's capture loop (Plan 48-06) calls it once before the loop and re-uses the returned path as the second argument to buildScreenshotPath. Returning the path avoids a redundant resolveScreenshotDir call inside the loop body."
  - "2-digit padding is a FLOOR, not a cap. `String(index).padStart(2, '0')` preserves indices ≥100 as `100-...`. The 22 live routes (7 static + 15 exhibits) fit comfortably in two digits, but the helper does not clamp — future expansion past 99 would still produce valid, sortable filenames."
  - "sourceSlug precedence matches Plan 48-02's buildCaptureUrl verbatim (`route.sourceSlug ?? route.path`). This alignment is load-bearing: cache-buster slug and screenshot slug must match for exhibits so the screenshot filename can be cross-referenced with the request log entry directly."
  - "captureScreenshot body is literally `await page.screenshot(...)` with no try/catch. CONTEXT.md explicitly says 'no retries; any navigation failure / timeout / selector-miss aborts the entire run' — wrapping here would mask route context that only Plan 48-03's per-route loop can attach."
  - "`Promise<void>` return over `Promise<Buffer>`. `page.screenshot` natively returns the PNG buffer, but the tool writes to disk (via the `path` option) and never touches the buffer in memory. Returning `void` prevents a future caller from accidentally double-buffering or introducing memory pressure on long runs."
  - "Options object on `page.screenshot` locked to exactly 3 keys (`fullPage`, `path`, `type`). No `clip`, `omitBackground`, `animations`, `caret`, or `scale`. Keeping the set minimal preserves determinism — any additional option is a surface for environment-dependent rendering variation."

patterns-established:
  - "Deterministic tool-output path pattern: every tool-output directory gets a resolveX / ensureX / buildX trio co-located with its consumer. resolveX is pure, ensureX is idempotent mkdir, buildX composes the leaf path. Any future scripts/**/*.ts tool that writes batch artifacts (per-route, per-item, per-fixture) can reuse this scaffold verbatim."
  - "Screenshot slug precedence: exhibit routes declare `sourceSlug` in their Route payload, and every downstream slug consumer (URL cache-buster AND screenshot filename) honors `route.sourceSlug ?? route.path`. The convention lives in Route's shape, not in per-consumer logic — future consumers inherit it for free."

requirements-completed: [CAPT-13]

# Metrics
duration: ~3min
completed: 2026-04-20
---

# Phase 48 Plan 05: Screenshot IO Surface Summary

**Four new exports land in capture.ts — `resolveScreenshotDir`, `ensureScreenshotDir`, `buildScreenshotPath`, `captureScreenshot` — completing the deterministic path derivation + idempotent mkdir + locked Playwright screenshot wrapper that Plan 48-06's capture loop will call once per route. Screenshots land at `<dirname(outputPath)>/site-editorial-capture/screenshots/<NN>-<slug>.png`, with `NN` zero-padded to at least 2 digits and `slug = slugify(route.sourceSlug ?? route.path)` so cache-buster URL slugs and screenshot filenames stay in lockstep per exhibit.**

## Performance

- **Duration:** ~3 min (zero deviations; imports + slugify already available from Plans 48-01 / 48-04)
- **Started:** 2026-04-20T19:11:00Z
- **Completed:** 2026-04-20T19:13:51Z
- **Tasks:** 2
- **Files modified:** 1 (scripts/editorial/capture.ts only)

## Accomplishments

- **`resolveScreenshotDir(config)`** — pure derivation: `nodePath.join(nodePath.dirname(config.outputPath), 'site-editorial-capture', 'screenshots')`. No I/O. Same config always produces the same absolute path. The two directory-literal segments (`site-editorial-capture`, `screenshots`) are hardcoded per CONTEXT.md lock.
- **`ensureScreenshotDir(config)`** — `resolveScreenshotDir(config)` → `await fsp.mkdir(dir, { recursive: true })` → `return dir`. Idempotent via `recursive: true`: re-running the tool never fails on an existing directory, and the parent `site-editorial-capture/` is created in the same atomic call if it doesn't already exist. Returns the resolved path so the caller can reuse it without a second resolve call.
- **`buildScreenshotPath(config, index, route)`** — composes `nodePath.join(dir, \`${ordinal}-${slug}.png\`)` where `ordinal = String(index).padStart(2, '0')` and `slug = slugify(route.sourceSlug ?? route.path)`. Seed precedence matches Plan 48-02's `buildCaptureUrl` verbatim — cache-buster slug and screenshot filename slug align per-exhibit. Determinism locked: same (config, index, route) → same path.
- **`captureScreenshot(page, absPath)`** — `await page.screenshot({ fullPage: true, path: absPath, type: 'png' })`. Options object locked to exactly 3 keys (no `clip`, `omitBackground`, `quality`, `animations`, `caret`, `scale`). No try/catch — Playwright errors propagate unwrapped; Plan 48-03's per-route loop attaches route context via its own outer catch.
- **`captureRoutes` stub preserved** — still throws `'captureRoutes: not implemented until Plan 48-06 integration'`. No partial Playwright wiring introduced by this plan.
- **No new imports** — `fsp` (node:fs/promises), `nodePath` (node:path), and `type Page` (playwright) were all landed in Plans 48-02 / 48-04. This plan reuses them; the duplicate-import guard in the Task 1 acceptance criteria confirmed `grep -c "import \* as fsp" = 1` and `grep -c "import \* as nodePath" = 1`.
- **SCAF-08 gate clean** — no `Date.now()`, `new Date(`, `os.EOL`, `@/`, or `Promise.all` anywhere in capture.ts. All four new functions are pure or pure-I/O in shape; no concurrency.

## Task Commits

Each task was committed atomically to `scripts/editorial/capture.ts`:

1. **Task 1: Add resolveScreenshotDir + ensureScreenshotDir + buildScreenshotPath (CAPT-13 path logic)** — `928beb1` (feat)
2. **Task 2: Add captureScreenshot wrapper (CAPT-13 Playwright call)** — `ae290ae` (feat)

**Plan metadata:** (pending final docs commit by executor)

## Files Created/Modified

- `scripts/editorial/capture.ts` — grew from 245 → 316 lines (+71, within the plan's ~70-line estimate). Four new exported functions inserted between `runFaqPreCaptureHooks` and the `captureRoutes` stub: `resolveScreenshotDir`, `ensureScreenshotDir`, `buildScreenshotPath`, `captureScreenshot`. No existing exports altered. SCAF-08 banner preserved verbatim. `captureRoutes` stub unchanged. No new top-level imports needed — `fsp`, `nodePath`, and `type Page` all landed in Plans 48-02 / 48-04.

## Decisions Made

- **Directory literals hardcoded, not parameterized.** `'site-editorial-capture'` and `'screenshots'` are pinned in `resolveScreenshotDir`, not exposed as `EditorialConfig` fields. CONTEXT.md locks both names; making them configurable would allow drift across runs and break the correlation with Phase 49's `convert.ts` consumer that will need to re-resolve the same path to embed relative screenshot links in the Markdown output.
- **`ensureScreenshotDir` returns the path, not void.** Returning `Promise<string>` lets Plan 48-06's capture loop call `ensureScreenshotDir` once before the loop and re-use the returned path in every `buildScreenshotPath(config, i, route)` call — avoiding the per-iteration `resolveScreenshotDir` recomputation. The cost is trivial (a stack var) but the ergonomics carry forward to other tool-output directories in the editorial subsystem.
- **Zero-padding is a minimum, not a maximum.** `String(index).padStart(2, '0')` emits `00..99` for the 22 live routes and passes through `100, 101, ...` unclamped. Future expansion past 99 still produces valid, lexically-sortable filenames. `String.prototype.padStart` returns the input unchanged when `maxLength ≤ input.length`, so this is automatic — no explicit guard needed.
- **`sourceSlug ?? route.path` precedence, not `route.path ?? sourceSlug`.** Exhibit routes (`category === 'exhibit'`) carry `sourceSlug = 'exhibit-<letter>'` matching the `exhibits.json` slug; `route.path = '/exhibits/exhibit-<letter>'` would slugify to `exhibits-exhibit-<letter>` (double `exhibit-`). Using `sourceSlug` first collapses to the canonical single `exhibit-<letter>` slug. Matches Plan 48-02's `buildCaptureUrl` so cache-buster URL param and screenshot filename share the exact same slug for any given route.
- **`captureScreenshot` body is literally one `await` statement.** No retry, no try/catch, no fallback. CONTEXT.md: 'no retries; any navigation failure / timeout / selector-miss aborts the entire run'. The wrapper's only job is to lock the 3-key option set — error handling belongs to Plan 48-03's per-route loop where `Route` context exists for error annotation.
- **`Promise<void>` over `Promise<Buffer>`.** `page.screenshot` returns the PNG buffer when `path` is omitted, but when `path` is supplied the image is streamed to disk and the buffer is redundant. Returning `void` prevents a future call site from accidentally buffering the PNG in memory — a 1280×full-page screenshot can be several MB, and 22 routes × several MB is a real working-set footprint if buffered unnecessarily.
- **Options object locked to 3 keys exactly.** `fullPage`, `path`, `type`. No `clip` (would truncate), no `omitBackground` (inconsistent with the locked light colorScheme — transparent backgrounds would reveal the viewport's default fill, a rendering variable across Chromium minor versions), no `quality` (jpeg-only), no `animations` / `caret` / `scale` (each introduces per-environment rendering variation). Minimal option set = maximal determinism.

## Deviations from Plan

None — plan executed exactly as written. Both tasks landed on the first build/test cycle. The plan's two-task decomposition (path helpers → Playwright wrapper) mapped cleanly to two atomic commits with no cross-task rework, no SCAF-08 reword needed (unlike Plan 48-04 Deviation 1), and no new tsconfig lib concessions (unlike Plan 48-04 Deviation 2 — browser globals aren't referenced by any of this plan's function bodies; `page.screenshot` runs its work on the Playwright side of the RPC boundary).

**Total deviations:** 0
**Impact on plan:** N/A — plan executed verbatim.

## Issues Encountered

- None. All Plan-48-04 artifacts (`fsp`, `nodePath`, `type Page` import extension) had already landed in the file, so Task 1's 'add imports if not present' conditional resolved to the no-op branch. Build and test cycles green on the first attempt for both tasks.

## User Setup Required

None — the four new exports are a pure + pure-I/O + Playwright-wrapper triple with no external services, no environment variables, no CLI auth. The destination directory is created idempotently under the user's Obsidian vault path that Phase 47 preflight already validated as writable.

## Known Stubs

The `captureRoutes` export remains a throwing stub per the plan's explicit scope boundary:

- **File:** `scripts/editorial/capture.ts`, line 315
- **Message:** `'captureRoutes: not implemented until Plan 48-06 integration'`
- **Reason intentional:** Plan 48-06 replaces this stub with the orchestrator that composes `launchBrowser` + `buildContextOptions` + `buildCaptureUrl` + `loadFaqItemCount` + `runFaqPreCaptureHooks` + `ensureScreenshotDir` + `buildScreenshotPath` + `captureScreenshot`. Wiring it in this plan would force Plans 48-03 / 48-05 to race for the same file-owned symbol.
- **Resolution path:** Plan 48-06 (Wave 4) replaces the throw with the real implementation.

No other stubs introduced. No hardcoded empty arrays / nulls / placeholders / 'coming soon' text.

## Verification Results

- **Task 1 grep gate** — 18/18 required patterns present (fsp + nodePath imports singleton, resolveScreenshotDir signature, `nodePath.dirname(config.outputPath)` derivation, both directory literals, `ensureScreenshotDir` + `Promise<string>` return, `fsp.mkdir(dir, { recursive: true })`, `buildScreenshotPath` signature, `String(index).padStart(2, '0')` padding, `route.sourceSlug ?? route.path` precedence, `slugify(seed)` delegation, SCAF-08 banner preserved, SCAF-08 grep gate clean, captureRoutes stub preserved). PASS.
- **Task 2 grep gate** — 13/13 required patterns present (`captureScreenshot` signature, `page: Page` + `absPath: string` params, `Promise<void>` return, `await page.screenshot({`, locked keys `fullPage: true, path: absPath, type: 'png'`, absence of `clip`, `omitBackground`, `quality`, `animations`, absence of `return page.screenshot` forwarding, SCAF-08 clean, captureRoutes stub preserved). PASS.
- **SCAF-08 grep gate** — `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts` returns zero matches. PASS.
- **Import singletons** — `grep -c "import \* as fsp" = 1`, `grep -c "import \* as nodePath" = 1`, `grep -c "from 'playwright'" = 1`. PASS.
- **Export surface** — `grep -c "^export " scripts/editorial/capture.ts` returns `14` (CapturedPage interface, CaptureError class, slugify, detectInterstitial, loadFaqItemCount, launchBrowser, buildContextOptions, buildCaptureUrl, runFaqPreCaptureHooks, resolveScreenshotDir, ensureScreenshotDir, buildScreenshotPath, captureScreenshot, captureRoutes). Plan floor `>=9`. PASS.
- **Line count** — `wc -l scripts/editorial/capture.ts` = 316 (plan `min_lines: 160`). PASS.
- **`pnpm build`** — exit 0 after each task. Composite build (tsconfig.app + tsconfig.node + tsconfig.editorial) green. PASS.
- **`pnpm test:scripts`** — 18/18 files, 224/224 tests green after each task. No existing suite perturbed by the new exports. PASS.
- **Post-commit deletion check** — both task commits include only `scripts/editorial/capture.ts`; zero file deletions in the diff of either commit. PASS.

## Next Phase Readiness

- **Plan 48-03 (Wave 3, per-route capture loop)** — unchanged dependency surface. Plan 48-03 imports only the symbols its own plan text names (error wrapping, per-route navigation). The screenshot IO surface is consumed in Plan 48-06, not 48-03.
- **Plan 48-06 (Wave 4, integration)** — can now call `await ensureScreenshotDir(config)` once at the top of the capture run (outside the route loop), then inside the per-route body call `const absPath = buildScreenshotPath(config, index, route); await captureScreenshot(page, absPath)`. The screenshotPath field on `CapturedPage` is populated from `absPath`.
- **Phase 49 (`convert.ts`)** — the directory layout is now locked. `convert.ts` can hardcode the same `<dirname(outputPath)>/site-editorial-capture/screenshots/` relative-path resolution when embedding screenshot links in the generated Markdown (the path will be `./site-editorial-capture/screenshots/<NN>-<slug>.png` relative to the Markdown file itself, since both live in the same parent `site-editorial-capture/` sibling tree… except the Markdown is one level up from `screenshots/`). Exact relative-link form is a Phase 49 concern; this plan freezes the absolute-path contract.
- **Wave 2 parallelism check** — Plans 48-02, 48-04, 48-05 are all three file-owned-serialized against `scripts/editorial/capture.ts`. This plan lands on top of 48-04; Plan 48-03 (Wave 3) may now consume the full Wave 2 export surface.

No blockers. All Wave 2 plans now complete.

## Self-Check: PASSED

- FOUND: scripts/editorial/capture.ts (316 lines, 14 top-level exports, single playwright import, file-scoped DOM lib reference intact from Plan 48-04)
- FOUND: scripts/editorial/capture.ts exports `resolveScreenshotDir`, `ensureScreenshotDir`, `buildScreenshotPath`, `captureScreenshot` at runtime (verified via `grep -E "^export (async )?function (resolveScreenshotDir|ensureScreenshotDir|buildScreenshotPath|captureScreenshot)"`)
- FOUND: commit `928beb1` in `git log` (Task 1 — path helpers)
- FOUND: commit `ae290ae` in `git log` (Task 2 — captureScreenshot wrapper)
- PASS: `pnpm build` exit 0
- PASS: `pnpm test:scripts` 224/224 green
- PASS: SCAF-08 grep gate clean
- PASS: imports singleton (fsp, nodePath, playwright each imported exactly once)
- PASS: captureRoutes stub preserved verbatim (message unchanged from Plan 48-01)
- PASS: no deletions in either task commit
- PASS: CAPT-13 path shape contract satisfied (`<NN>-<slug>.png`, `sourceSlug ?? path` seed, `site-editorial-capture/screenshots/` subtree)

---
*Phase: 48-capture-playwright-io*
*Completed: 2026-04-20*
