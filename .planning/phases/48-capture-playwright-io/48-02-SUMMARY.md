---
phase: 48-capture-playwright-io
plan: 02
subsystem: editorial-capture
tags: [editorial-capture, playwright, browser-lifecycle, cloudflare, cache-buster, viewport, phase-48, scaf-08]

# Dependency graph
requires:
  - phase: 48-capture-playwright-io
    plan: 01
    provides: slugify pure helper (root-path special case + regex pipeline); CaptureError; extended CapturedPage shape
  - phase: 47-config-routes-pure-logic
    provides: EditorialConfig (headful field consumed by launchBrowser) + Route (sourceSlug field consumed by buildCaptureUrl)
  - phase: 46-editorial-scaffold
    provides: playwright ^1.59.1 dependency (SCAF-05) + SCAF-08 banner in capture.ts
provides:
  - launchBrowser(config) — Promise<Browser> via chromium.launch({ headless: !config.headful }); CAPT-03 scaffolding
  - buildContextOptions() — deterministic BrowserContextOptions (viewport 1280x800, colorScheme 'light', Cache-Control: no-cache); CAPT-10 + CAPT-12 scaffolding
  - buildCaptureUrl(baseUrl, route) — pure cache-buster URL builder with sourceSlug-wins precedence + defensive '?'/'&' separator; CAPT-10 core
  - single `import { chromium, type Browser, type BrowserContextOptions } from 'playwright'` (not @playwright/test per CAPT-03)
affects: [48-03, 48-05, 48-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Three-helper browser-lifecycle scaffold: launch + context-options + URL-builder — composable, consumable by downstream plans without running a live site"
    - "Deterministic cache-buster precedence: route.sourceSlug ?? slugify(route.path) — keeps cache-buster slug aligned with screenshot filename slug (Plan 48-05 will use the same precedence)"
    - "Defensive '?'/'&' separator on query concat — future-proof against routes that already carry a query string even though production routes do not"
    - "Template-literal URL construction (not new URL / URLSearchParams) — preserves determinism: slugs are `[a-z0-9-]+` and paths are already URL-safe, so no encoding nuances"

key-files:
  created: []
  modified:
    - scripts/editorial/capture.ts

key-decisions:
  - "Imported from 'playwright' (not '@playwright/test') per CAPT-03 explicit constraint — runtime package, not the test runner"
  - "launchBrowser inverts config.headful: headless: !config.headful — headless by default, --headful opens a visible window for Cloudflare interstitial manual fallback"
  - "Viewport hardcoded as { width: 1280, height: 800 } and colorScheme hardcoded as 'light' — determinism demands fixed dimensions; CAPT-12 locks both values and they are NOT configurable"
  - "Cache-Control header uses canonical capitalization 'Cache-Control' (not lowercase) — Playwright normalizes either way but the spec + tests grep for the canonical form"
  - "buildCaptureUrl uses ?? not || for seed fallback — ?? matches the Phase 47 convention and falls through only on null/undefined (not empty string, which is what || would do)"
  - "buildCaptureUrl uses template literal + manual '?'/'&' branch rather than URL/URLSearchParams — avoids encoding-nuance determinism risk; slugs are already [a-z0-9-]+ and route paths are already URL-safe"
  - "captureRoutes kept as the Plan 48-01 throwing stub — Plan 48-06 replaces it once Plans 48-03/04/05 land their pieces"

patterns-established:
  - "Browser-lifecycle scaffolding pattern: expose launch/context/url-builder as three independent helpers so Plan 48-06 orchestrator is the only place that holds a live Browser reference"
  - "sourceSlug-wins precedence rule for exhibit routes shared across cache-buster (Plan 48-02) and screenshot filename (Plan 48-05)"

requirements-completed: [CAPT-03, CAPT-10, CAPT-12]

# Metrics
duration: 2min15s
completed: 2026-04-20
---

# Phase 48 Plan 02: Browser Lifecycle + Cache-Buster Summary

**launchBrowser, buildContextOptions, and buildCaptureUrl land in capture.ts — three pure scaffolding helpers that let Plan 48-06 orchestrate the capture loop without relitigating launch/context/URL decisions; Playwright imported from 'playwright' (not '@playwright/test') per CAPT-03.**

## Performance

- **Duration:** ~2 min 15 s
- **Started:** 2026-04-20T18:56:05Z
- **Completed:** 2026-04-20T18:58:20Z
- **Tasks:** 2
- **Files modified:** 1 (scripts/editorial/capture.ts only)

## Accomplishments

- **`launchBrowser(config)`** — single `chromium.launch({ headless: !config.headful })` per run, returns `Promise<Browser>`. Caller owns `browser.close()` in a `finally` block (Plan 48-06). CAPT-03 scaffolding complete.
- **`buildContextOptions()`** — returns the locked deterministic context shape: `{ viewport: { width: 1280, height: 800 }, colorScheme: 'light', extraHTTPHeaders: { 'Cache-Control': 'no-cache' } }`. CAPT-10 header + CAPT-12 viewport/theme scaffolding complete.
- **`buildCaptureUrl(baseUrl, route)`** — deterministic cache-buster URL builder. Matches the 5-row spec table: `/ -> home`, `/philosophy -> philosophy`, `/exhibits/exhibit-a (sourceSlug='exhibit-a') -> exhibit-a` (sourceSlug wins), `/faq?already=here -> &_cb=faq-already-here` (defensive `&` branch). CAPT-10 cache-buster core complete.
- **Playwright import** — `import { chromium, type Browser, type BrowserContextOptions } from 'playwright'` added directly below the existing route-type import. Single import, correct package (not `@playwright/test`).
- **`captureRoutes` stub preserved** — still throws `'captureRoutes: not implemented until Plan 48-06 integration'`. No partial Playwright wiring introduced.
- **SCAF-08 gate clean** — no `Date.now()`, `new Date(`, `os.EOL`, `@/`, or `Promise.all` anywhere in capture.ts. Cache-buster slug is derived from the route itself (pure function of input), never a timestamp.

## Task Commits

Each task was committed atomically to `scripts/editorial/capture.ts`:

1. **Task 1: Playwright import + launchBrowser + buildContextOptions (CAPT-03, CAPT-10, CAPT-12)** — `bef18e0` (feat)
2. **Task 2: buildCaptureUrl cache-buster helper (CAPT-10)** — `d9532b7` (feat)

**Plan metadata:** (pending final docs commit by executor)

## Files Created/Modified

- `scripts/editorial/capture.ts` — grew from 109 to 149 lines (+40). Added a single new import line and three new exported helper functions between `detectInterstitial` and the `captureRoutes` stub. No existing exports altered. SCAF-08 banner preserved verbatim. `captureRoutes` stub unchanged.

## Decisions Made

- **Package import** — `from 'playwright'` (runtime automation package), NOT `from '@playwright/test'` (test runner). CAPT-03 is explicit about this distinction; the test runner wraps Playwright but adds fixture machinery that this script doesn't need.
- **Headful inversion** — `{ headless: !config.headful }` — passing the negation is the one point where the flag semantics flip. The flag name `headful` is user-facing (CLI `--headful`); Playwright's option is `headless`, so the boolean is negated once at the boundary.
- **Hardcoded viewport + theme** — 1280x800 and 'light' are not configurable. Determinism demands fixed dimensions for CAPT-12: the same site captured on two machines must produce byte-identical screenshots (modulo font rendering). Adding viewport config later would require either breaking determinism or bumping the screenshot-hash invariant.
- **Cache-Control canonical casing** — `'Cache-Control': 'no-cache'` uses the canonical header form. Playwright normalizes header casing before sending so either casing produces the same wire output, but the CONTEXT.md spec uses the canonical form and the grep-based verification gate matches the literal string.
- **sourceSlug-wins precedence** — `route.sourceSlug ?? route.path` prefers the exhibit-route's `sourceSlug` (which also anchors the screenshot filename via Plan 48-05). This keeps the cache-buster slug and the screenshot filename visually aligned in logs: `?_cb=exhibit-a` <-> `01-exhibit-a.png`.
- **`??` not `||` for seed fallback** — `??` only falls through on `null`/`undefined`, not on empty string. `sourceSlug` is typed `string | undefined`, so the observable behavior is identical, but `??` is the Phase 47 convention for "optional field with fallback".
- **Template-literal URL construction** — chose `${baseUrl}${route.path}${separator}_cb=${slug}` over `new URL(...)` / `URLSearchParams`. The `URL` constructor re-encodes path segments which would change the output shape for paths like `/exhibits/exhibit-a` in subtle ways, breaking determinism against the spec table. Slugs are already `[a-z0-9-]+` (see `slugify`) and route paths are already URL-safe (Phase 47 preflight), so a raw concat is safe.
- **Defensive `?`/`&` separator branch** — production routes do not carry pre-existing query strings, but the plan's Behavior 4 test case requires correct handling of `/faq?already=here`. Handling this at the scaffold level is cheaper than adding a test-only code path later.

## Deviations from Plan

None — plan executed exactly as written. Both tasks' verbatim action blocks matched the final file verbatim; the SCAF-08 grep gate passed on first build. No auto-fixes, no auth gates, no architectural escalations.

## Issues Encountered

None.

## User Setup Required

None — pure scaffolding plan. No environment variables, no CLI auth, no filesystem I/O beyond what Playwright's installed binaries already do. The three helpers are consumable by Plan 48-03 + Plan 48-06 without requiring a live site.

## Known Stubs

The `captureRoutes` export remains a throwing stub per the plan's explicit scope boundary:

- **File:** `scripts/editorial/capture.ts`, line 148
- **Message:** `'captureRoutes: not implemented until Plan 48-06 integration'`
- **Reason intentional:** Plan 48-06 replaces this stub with the orchestrator that composes `launchBrowser` + `buildContextOptions` + `buildCaptureUrl` plus the FAQ/exhibit hooks from Plans 48-03/04. Wiring it in this plan would force Plan 48-03/04 to race for the same file-owned symbol.
- **Resolution path:** Plan 48-06 (Wave 4) replaces the throw with the real implementation.

No other stubs introduced. No hardcoded empty arrays / nulls / "coming soon" placeholders.

## Verification Results

- **Task 1 grep gate** — 10/10 required patterns present: playwright import (exact form), `launchBrowser` signature, inverted headless flag, `buildContextOptions` signature, exact viewport literal, exact colorScheme literal, canonical Cache-Control header, no `@playwright/test` import, `captureRoutes` stub preserved, SCAF-08 clean. PASS.
- **Task 2 grep gate** — 9/9 required patterns present: `buildCaptureUrl` signature, `?? route.path` seed, `slugify(seed)` call, exact separator branch, exact template literal, stub preserved, SCAF-08 clean, no `new URL(` constructor, no `URLSearchParams` reference. PASS.
- **SCAF-08 grep gate** — `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts` returns zero matches. PASS.
- **Playwright import singleton** — `grep -c "from 'playwright'" scripts/editorial/capture.ts` returns `1`; `grep -c "from '@playwright/test'" scripts/editorial/capture.ts` returns `0`. PASS.
- **Export surface** — `grep -c "^export function " scripts/editorial/capture.ts` returns `6` (slugify, detectInterstitial, launchBrowser, buildContextOptions, buildCaptureUrl, captureRoutes). Plan accepts >=5. PASS.
- **Line count** — `wc -l scripts/editorial/capture.ts` = 149 (within 140-220 range for Task 2 and 110-200 for Task 1 intermediate). PASS.
- **`pnpm build`** — exit 0 after each task. Types resolve across the Playwright import; composite build (tsconfig.app + tsconfig.node + tsconfig.editorial) green. PASS.
- **`pnpm test:scripts`** — 18/18 files, 224/224 tests green after each task. Phase 46 smoke test + Phase 47 config/routes suites + Plan 48-01 pure-logic suite all still pass. Adding runtime helpers did not perturb the shape any existing test asserts against. PASS.
- **Post-commit deletion check** — both task commits include only `scripts/editorial/capture.ts`; zero file deletions. PASS.

## Next Phase Readiness

- **Plan 48-03 (Wave 3, per-route navigation)** — can import `buildCaptureUrl` for URL construction inside the per-route capture loop and `buildContextOptions` to configure `browser.newContext()`. The capture loop will consume `page.goto(buildCaptureUrl(config.baseUrl, route), { waitUntil: 'domcontentloaded', timeout: 30_000 })` plus the `#main-content` selector wait + `detectInterstitial` check.
- **Plan 48-05 (Wave 3, screenshots)** — independent of this plan (screenshot filename uses slugify directly, not buildCaptureUrl). No new dependency introduced.
- **Plan 48-06 (Wave 4, integration)** — owns the orchestrator. Will call `launchBrowser(config)` once, wrap `await browser.close()` in a finally, call `browser.newContext(buildContextOptions())` once, then loop routes calling `buildCaptureUrl` per route. Replaces the throwing `captureRoutes` stub.
- **Phase 49 (convert.ts)** — no direct dependency on this plan's exports; it consumes `CapturedPage[]` which was locked in Plan 48-01.

No blockers. Wave 2 complete. Plans 48-03 / 48-04 / 48-05 (Wave 3) are now unblocked — they can start in parallel since they write to disjoint sections of `capture.ts`, though the GSD wave model still serializes them per file-ownership rules.

## Self-Check: PASSED

- FOUND: scripts/editorial/capture.ts (149 lines, 6 top-level exports, single playwright import)
- FOUND: commit `bef18e0` in git log (Task 1 — launchBrowser + buildContextOptions)
- FOUND: commit `d9532b7` in git log (Task 2 — buildCaptureUrl)
- PASS: `pnpm build` exit 0
- PASS: `pnpm test:scripts` 224/224 green
- PASS: SCAF-08 grep gate clean
- PASS: correct playwright package imported (not @playwright/test)
- PASS: captureRoutes stub preserved verbatim from Plan 48-01

---
*Phase: 48-capture-playwright-io*
*Completed: 2026-04-20*
