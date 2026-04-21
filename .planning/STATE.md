---
gsd_state_version: 1.0
milestone: v8.0
milestone_name: Editorial Snapshot & Content Audit
status: executing
last_updated: "2026-04-21T00:49:05.372Z"
last_activity: 2026-04-21
progress:
  total_phases: 7
  completed_phases: 3
  total_plans: 21
  completed_plans: 19
  percent: 90
---

# Project State

## Project Reference

See: .planning/PROJECT.md
Milestone: v8.0 Editorial Snapshot & Content Audit (started 2026-04-19)
Prior milestone: v7.0 ABORTED (.planning/v7.0-ABORT-NOTICE.md)

**Core value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency
**Current focus:** Phase 49 Plan 01 complete — ready for Plan 49-02 (configureTurndown + GFM plugin)

## Current Position

Phase: 49 (Convert Turndown) — IN PROGRESS
Plan: 2 of 4 (49-01 complete)
Status: Ready to execute
Last activity: 2026-04-21

Progress: [█████████░] 90%

## Performance Metrics

**Velocity:**

- Total plans completed: 5 (v6.0) + 16 (v7.0 partial before abort)
- Average duration: —
- Total execution time: —

## Accumulated Context

Retained from v7.0 (still valid for v8.0 background):

| Phase 037 P01 | 2min | 3 tasks | 2 files |
| Phase 37 P06 | 106 | 2 tasks | 2 files |
| Phase 037 P03 | 3min | 2 tasks | 2 files |
| Phase 37 P05 | 2m 23s | 2 tasks | 2 files |
| Phase 37 P02 | 3 min | 3 tasks | 8 files |
| Phase 37 P04 | 3 | 3 tasks | 12 files |
| Phase 037 P07 | 3min | 2 tasks | 2 files |
| Phase 037 P08 | 4min | 3 tasks | 8 files |
| Phase 037 P09 | 2min | 3 tasks | 1 files |
| Phase 038 P01 | 6m31s | 3 tasks | 7 files |
| Phase 038 P05 | 4min | 1 tasks | 1 files |
| Phase 038 P02 | 5min | 1 tasks | 2 files |
| Phase 038 P03 | 4m | 2 tasks | 8 files |
| Phase 038 P04 | 4m7s | 1 tasks | 2 files |
| Phase 038 P06 | 3min | 2 tasks | 12 files |
| Phase 038 P07 | 3m32s | 2 tasks | 6 files |
| Phase 48 P06 | 5min | 2 tasks | 2 files |
| Phase 49 P01 | 3min | 1 tasks | 1 files |

### Decisions

Historical decisions preserved. v8.0 decisions logged in PROJECT.md Key Decisions table as they land.

- Phase 48 Plan 01: CaptureError uses options-bag constructor (message, opts?: { route?, cause? }) — route-scoped errors get route as first-class field
- Phase 48 Plan 01: detectInterstitial returns string | null (pure classifier); caller wraps non-null in CaptureError at call site where Route context is available
- Phase 48 Plan 01: slugify('/') short-circuits to 'home' before regex pipeline; all other inputs go through trim → lowercase → strip leading / → collapse non-alphanumeric → collapse dashes → trim dashes
- Phase 48 Plan 02: Playwright imported from 'playwright' (runtime automation package), not '@playwright/test' (test runner) — CAPT-03 explicit constraint
- Phase 48 Plan 02: launchBrowser inverts config.headful at the boundary — chromium.launch({ headless: !config.headful })
- Phase 48 Plan 02: viewport 1280x800 + colorScheme 'light' hardcoded in buildContextOptions — not configurable; determinism for CAPT-12
- Phase 48 Plan 02: buildCaptureUrl uses template-literal concat (not URL/URLSearchParams) to preserve determinism; slugs are [a-z0-9-]+ and paths URL-safe
- Phase 48 Plan 02: sourceSlug-wins precedence for cache-buster slug (route.sourceSlug ?? route.path) — aligns cache-buster slug with screenshot filename slug (Plan 48-05)
- Path derivation: nodePath.dirname + nodePath.join for faq.json, not string replace — survives directory renames
- FAQ expansion signal: aria-expanded attribute (a11y contract), not .is-open CSS class
- File-scoped /// <reference lib="dom" /> in capture.ts instead of adding 'dom' to editorial tsconfig lib — contains browser globals to the one file that drives a browser
- Sequential for...of over collapsed accordion triggers — extends SCAF-08 no-Promise.all discipline to browser-side DOM actions
- Phase 48 Plan 05: Screenshots land at <dirname(outputPath)>/site-editorial-capture/screenshots/<NN>-<slug>.png — directory literals hardcoded (CONTEXT.md lock), NN is 2-digit floor padding via String(index).padStart(2,'0'), slug seed follows sourceSlug ?? path precedence matching Plan 48-02 buildCaptureUrl
- Phase 48 Plan 05: ensureScreenshotDir returns Promise<string> (not void) so Plan 48-06 capture loop calls it once outside the loop and reuses the returned path in every buildScreenshotPath(config, i, route) call
- Phase 48 Plan 05: captureScreenshot locks page.screenshot options to exactly 3 keys (fullPage: true, path: absPath, type: 'png'); no clip, omitBackground, quality, animations, caret, scale; no try/catch — errors propagate for Plan 48-03 route-context wrapping; Promise<void> return prevents buffering PNG in memory
- Phase 48 Plan 03: capturePage attaches console + pageerror listeners BEFORE page.goto — Playwright does not buffer pre-listener events, so attaching after would silently drop hydration-window errors (CAPT-14 correctness invariant)
- Phase 48 Plan 03: capturePage operation order LOCKED — goto -> status -> waitForSelector -> FAQ hooks -> meta -> mainHtml -> interstitial -> exhibit-404 -> screenshot -> return. FAQ hooks must run before HTML read (DOM mutation); interstitial after mainHtml (needs bodyBytes+html); exhibit-404 after interstitial (no point asserting on challenge page); screenshot last (after all assertions pass)
- Phase 48 Plan 03: SPA-404 detection on exhibit routes uses .exhibit-detail-title (h1 class on both InvestigationReportLayout and EngineeringBriefLayout) with strict === 1 count assertion — NotFoundPage does not render this class, so silent 404 at HTTP 200 trips the assertion; double-render also aborts (template regression)
- Phase 48 Plan 03: inter-request 1500ms delay lives in captureRoutes (Plan 48-06), not capturePage — keeps capturePage pure about a single-route round-trip and single-responsibility; capturePage returns as soon as one route is captured
- Phase 48 Plan 06: captureRoutes preflight order is ensureScreenshotDir → loadFaqItemCount → launchBrowser. Both preflights run BEFORE browser spawn so a misconfigured env fails in ~10ms without paying the 2-3s Chromium boot cost; order between preflights is ensureScreenshotDir first (faster, more common misconfiguration target)
- Phase 48 Plan 06: inter-request 1500ms delay implemented as throwaway page.waitForTimeout(1500) with skip-after-last guard (if i < routes.length - 1). Playwright's approved sleep channel; no Node timer, no wall-clock busy-wait (SCAF-08). Throwaway page lifecycle (open → waitForTimeout → close-in-finally) is load-bearing — tests assert newPage called exactly 2+(N-1)=3 times for N=2 routes
- Phase 48 Plan 06: nested try/finally (outer browser.close, inner context.close) guarantees cleanup on any abort path including context-creation failure; flatter structure leaks Browser
- Phase 48 Plan 06: CaptureError wrap for non-CaptureError happens inside the for-loop catch, NOT at the function boundary — preserves the exact route that failed (not the first/last in the array). CaptureError passthrough branch preserves original route context set by capturePage
- Phase 48 Plan 06: hermetic test suite via vi.spyOn(chromium, 'launch') per-test + vi.restoreAllMocks() in afterEach, NOT vi.mock('playwright') at module level. Lets pure-helper tests and integration tests coexist in the same file without mock pollution
- Phase 48 Plan 06: integration tests cover 4 distinct paths (happy, non-CaptureError wrap, silent 404, interstitial) and all 3 error-path tests assert mockBrowser.close called exactly once — proves outer finally ran. All 3 error-path tests also grep for the exact error string captureRoutes/capturePage throws, so regressions in user-visible error messages fail loudly
- Phase 48 Plan 06: JSDoc prose cannot mention forbidden tokens by name (setTimeout, Date.now, Promise.all) because the SCAF-08 acceptance grep `! grep -q <token>` matches comments as well as code. Describe the policy without naming the tokens: "SCAF-08 forbids Node timers and parallel-iteration helpers"
- Phase 49 Plan 01: DOM parser locked to happy-dom (top-level devDep, pnpm-hoist safe); the transitive-only domino parser rejected because a direct import from convert.ts breaks under pnpm strict hoisting; Turndown's internal parser not publicly exposed as standalone API
- Phase 49 Plan 01: sanitizeHtml sub-step order LOCKED — parse happy-dom window → strip script/style/noscript/[aria-hidden=true] subtrees → data-v-* attribute walk via Array.from(el.attributes) snapshot → demoteHeadings → serialize body.innerHTML
- Phase 49 Plan 01: demoteHeadings uses .forEach (not for-of) because editorial tsconfig lib: [ES2022] + file-scoped DOM triple-slash does NOT include DOM.Iterable; for-of on NodeListOf fails type-check (auto-fix Rule 3 during execution)
- Phase 49 Plan 01: heading rewrite uses createElement + replaceWith because Element.tagName is read-only; querySelectorAll returns a static NodeList snapshot so mutation during iteration is safe; clamp newLevel = Math.min(6, currentLevel + 2)
- Phase 49 Plan 01: JSDoc prose must avoid the literal rejected-parser package name because the acceptance grep is line-based and matches comments as well as code (same SCAF-08 comment discipline locked in Phase 48 Plan 06)
- Ambient module shim colocation: untyped upstream package's .d.ts lives next to consumer (scripts/editorial/turndown-plugin-gfm.d.ts); tsconfig include glob covers it without a typings/ dir or global.d.ts
- JSDoc end-marker hazard discovered: the byte sequence */ inside a block comment prematurely closes it; keep glob wildcards (badge-*, tag-*) out of /** */ doc blocks — use backticked literals or use line-comments (//) where the hazard is harmless
- Turndown default import works under esModuleInterop + NodeNext: 'import TurndownService from turndown' compiles directly because @types/turndown uses export = TurndownService

### Pending Todos

None.

### Blockers/Concerns

None. Research complete, requirements defined, ready for roadmap.

## Session Continuity

Last session: 2026-04-21T00:48:49.789Z
Current activity: Phase 49 Plan 01 complete — sanitizeHtml + demoteHeadings landed (`3a208bf`); next up Plan 49-02 (configureTurndown + GFM plugin)
Resume file: None

**Planned Phase:** 49 (Convert (Turndown)) — 4 plans — IN PROGRESS (1/4 complete; 49-01 shipped 2026-04-21T00:31:48Z)
