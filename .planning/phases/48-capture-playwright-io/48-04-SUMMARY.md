---
phase: 48-capture-playwright-io
plan: 04
subsystem: editorial-capture
tags: [editorial-capture, faq, accordion, filter, hard-fail, playwright, scaf-08, phase-48]

# Dependency graph
requires:
  - phase: 48-capture-playwright-io
    plan: 01
    provides: CaptureError class (used for hard-fail wrapping of both FAQ assertion failure paths)
  - phase: 48-capture-playwright-io
    plan: 02
    provides: "single `from 'playwright'` import line — Plan 48-04 extends it with `type Page`"
  - phase: 47-config-routes-pure-logic
    provides: "EditorialConfig.exhibitsJsonPath — source directory anchor for faq.json"
provides:
  - loadFaqItemCount(exhibitsJsonPath) — derives faq.json path via nodePath.dirname + nodePath.join, reads via fsp.readFile + JSON.parse, returns array length; throws native Error on non-array
  - runFaqPreCaptureHooks(page, faqItemCount) — Playwright-driven FAQ DOM choreography; filter-all click FIRST, expand-all SECOND; both waits 10s timeout; both failure paths throw CaptureError with the greppable substrings tests will assert
  - file-scoped `/// <reference lib="dom" />` so waitForFunction + $$eval callback bodies reference `document` + DOM Element types without leaking `dom` globals across the editorial tsconfig
affects: [48-03, 48-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Node-stdlib aliased imports: `fsp` for `node:fs/promises` and `nodePath` for `node:path` — the alias prevents shadowing the future Plan-48-05 screenshot-path parameter conventionally named `path`"
    - "File-scoped `/// <reference lib=\"dom\" />` triple-slash directive — scopes DOM globals to capture.ts only so the rest of the editorial Node subsystem stays free of browser-context typings"
    - "Playwright `page.waitForFunction(fn, arg, { timeout })` 3-arg shape: first wait passes `faqItemCount` as the runtime arg so the browser-eval body references `expected` by parameter name; second wait passes `undefined` as the arg because the body closes over no runtime data"
    - "Hard-fail wrap pattern: `try { await page.waitForFunction(...) } catch (cause) { /* optional DOM probe */ throw new CaptureError(msg, { cause }) }` — one wrap per wait, Playwright TimeoutError preserved as `cause` for postmortem"

key-files:
  created: []
  modified:
    - scripts/editorial/capture.ts

key-decisions:
  - "Path derivation via `nodePath.dirname(exhibitsJsonPath) + nodePath.join(..., 'faq.json')` — NOT `exhibitsJsonPath.replace('exhibits.json', 'faq.json')`. The path helpers survive future directory renames and make the dependency on 'both JSON sources share a parent directory' explicit in code."
  - "Return `Promise<number>` (not `Promise<readonly unknown[]>`). CONTEXT.md locks the assertion to count-based only — returning the content would invite drift toward 'FAQ content mismatch' assertions that the phase explicitly does NOT want."
  - "File-scoped `/// <reference lib=\"dom\" />` instead of editing `tsconfig.editorial.json` to add `'dom'` to `lib`. Adding `dom` globally would leak browser globals into every file in `scripts/editorial/` — an architectural regression. The triple-slash reference contains the concession to this single file where Playwright browser-context callbacks actually live."
  - "Expansion signal is `[aria-expanded=\"true\"]`, NOT `.is-open` CSS class. The accessibility contract is the stable API; CSS class names are implementation details. FaqAccordionItem.vue binds `:aria-expanded=\"isOpen\"`, so the attribute tracks the Vue reactive state directly."
  - "Sequential `for...of` over `collapsedTriggers` — SCAF-08 forbids `Promise.all` on the ordered route set, and extending the same discipline to sequential DOM actions matches the 'no parallel browser-side work' spirit of the milestone."
  - "`loadFaqItemCount` throws native `Error` (not `CaptureError`) on non-array. The caller in Plan 48-03 has the `Route` context and wraps; this function is pure I/O with no route awareness. Mirrors the Plan 48-01 decision to keep `detectInterstitial` a pure classifier that does not throw typed errors directly."
  - "Extend the existing `from 'playwright'` import with `type Page` rather than adding a separate `import type { Page }` line. Keeps the import topology at exactly one line `from 'playwright'` across the file — the plan-level verification grep counts this."

patterns-established:
  - "Browser-context vs Node-context type-hygiene pattern: when a single Node file must reference DOM globals inside a callback (Playwright waitForFunction / $$eval), use file-scoped `/// <reference lib=\"dom\" />` instead of widening the project tsconfig's lib list. Contains the concession."
  - "Count-based hard-fail assertion pattern: read source-of-truth count from a data file (loadFaqItemCount → faq.json.length), pass it to the browser-side choreography helper, and wrap each count comparison in a try/catch that throws a CaptureError with a greppable substring. Tests grep the substring; live runs get actionable error messages."

requirements-completed: [CAPT-07, CAPT-08]

# Metrics
duration: 5min
completed: 2026-04-20
---

# Phase 48 Plan 04: FAQ Pre-Capture Hooks Summary

**loadFaqItemCount + runFaqPreCaptureHooks land in capture.ts — FAQ-page DOM choreography with filter-first-then-expand ordering LOCKED per CONTEXT.md, both assertions hard-fail with CaptureError on count mismatch or expansion timeout; file-scoped `/// <reference lib="dom" />` lets Playwright browser-context callbacks type-check against DOM globals without leaking `dom` lib into the rest of the editorial subsystem.**

## Performance

- **Duration:** ~5 min (two auto-fix deviations added ~90 s)
- **Started:** 2026-04-20T19:01Z
- **Completed:** 2026-04-20T19:06Z
- **Tasks:** 2
- **Files modified:** 1 (scripts/editorial/capture.ts only)

## Accomplishments

- **`loadFaqItemCount(exhibitsJsonPath)`** — single helper that anchors the FAQ assertion count. Derives `faq.json` path from `exhibitsJsonPath` via `nodePath.dirname + nodePath.join` (not string replace), reads via `fsp.readFile(..., 'utf8')`, parses with `JSON.parse`, asserts `Array.isArray`, and returns `.length`. Native `Error` on non-array; caller (Plan 48-03) wraps in `CaptureError`. No caching — fresh read per call, matching the `buildRoutes` determinism pattern.
- **`runFaqPreCaptureHooks(page, faqItemCount)`** — LOCKED two-step choreography:
  1. `page.click('[data-filter="all"]')` → `page.waitForFunction((expected) => document.querySelectorAll('.faq-accordion-item').length === expected, faqItemCount, { timeout: 10_000 })`. On timeout, probe the actual count via `page.$$eval` (with a `.catch(() => -1)` guard) and throw `CaptureError` with `'FAQ rendered count mismatch: expected N, got M after filter-all click'`.
  2. `page.locator('.faq-accordion-item [aria-expanded="false"]').all()` → sequential `for...of` clicks → `page.waitForFunction(() => Array.from(...).every(el => el.getAttribute('aria-expanded') === 'true'), undefined, { timeout: 10_000 })`. On timeout, throw `CaptureError` with `'FAQ accordion expansion timed out: expected N expanded items, some remained aria-expanded="false"'`.
- **Import extension** — existing `from 'playwright'` line now includes `type Page`. Still exactly one `from 'playwright'` import across the file (plan-level invariant).
- **File-scoped DOM lib reference** — `/// <reference lib="dom" />` added below the SCAF-08 banner with a short comment explaining why the editorial tsconfig intentionally omits `'dom'` globally. This is the minimum-surface concession for Playwright browser-context callbacks.
- **`captureRoutes` stub preserved** — still throws `'captureRoutes: not implemented until Plan 48-06 integration'`. No partial Playwright wiring introduced by this plan.
- **CaptureError substring contract** — both error messages contain the exact substrings locked in the plan's `<interfaces>` required-substring table:
  - CAPT-08 failure: `'FAQ rendered count mismatch'` + `'expected ${faqItemCount}'` + `'got ${actualCount}'`
  - CAPT-07 failure: `'FAQ accordion expansion timed out'` + `'expected ${faqItemCount} expanded'`
- **SCAF-08 gate clean** — no `Date.now()`, `new Date(`, `os.EOL`, `@/`, or `Promise.all` anywhere in capture.ts. Sequential iteration over collapsed triggers via `for...of`; both browser-context callbacks are pure functions of their arguments.

## Task Commits

Each task was committed atomically to `scripts/editorial/capture.ts`:

1. **Task 1: Add loadFaqItemCount helper (CAPT-07/08 count source-of-truth)** — `8a7a06a` (feat)
2. **Task 2: Add runFaqPreCaptureHooks (CAPT-07 expand + CAPT-08 filter, hard-fail)** — `e573614` (feat)

**Plan metadata:** (pending final docs commit by executor)

## Files Created/Modified

- `scripts/editorial/capture.ts` — grew from 149 → 245 lines (+96). Added two new imports (`node:fs/promises` as `fsp`, `node:path` as `nodePath`), extended the existing playwright import with `type Page`, added the `/// <reference lib="dom" />` directive, and inserted two new exported functions (`loadFaqItemCount` between `detectInterstitial` and `launchBrowser`; `runFaqPreCaptureHooks` between `buildCaptureUrl` and the `captureRoutes` stub). No existing exports altered. SCAF-08 banner preserved verbatim. `captureRoutes` stub unchanged.

## Decisions Made

- **Path derivation helper strategy** — chose `nodePath.dirname + nodePath.join` over `String.prototype.replace`. The path helpers survive directory renames and make the 'both JSON sources share a parent directory' constraint explicit in code. A future move of `faq.json` that breaks the sibling relationship would surface as a clear I/O error at `faqJsonPath`, not as a silent subtle regex mismatch.
- **Return `Promise<number>`, not `Promise<readonly unknown[]>`** — CONTEXT.md explicitly locks the FAQ assertion to count-based. Returning the content would invite drift toward 'FAQ content mismatch' assertions outside this phase's scope.
- **`??` not `||` for any falsy-fallback** — n/a in this plan (no optional fields), but preserved as the editorial-tsconfig convention.
- **File-scoped DOM lib reference** — editing `tsconfig.editorial.json` to add `'dom'` to `lib` would leak browser globals (`document`, `window`, `Element`, etc.) into every file in `scripts/editorial/`. The triple-slash `/// <reference lib="dom" />` directive contains the concession to `capture.ts` alone — the one file that actually drives a browser. Future editorial files (e.g., Plan 48-05 screenshot-path helpers) still compile against the Node-only `ES2022` lib.
- **Accessibility-attribute signal over CSS class** — `aria-expanded="true"` is the stable API; `.is-open` is a CSS implementation detail. `FaqAccordionItem.vue` binds `:aria-expanded="isOpen"` so the attribute tracks the Vue reactive state directly. Using the attribute keeps the hook driven by the accessibility contract, not by a stylesheet convention that CSS refactors could break.
- **Sequential `for...of` over collapsed triggers** — SCAF-08 forbids `Promise.all` on the ordered route set. Extending that discipline to sequential DOM actions matches the 'no parallel browser-side work' spirit and keeps the click order deterministic — the browser's task queue processes them in the FaqAccordionItem DOM order.
- **Native `Error` for `loadFaqItemCount` non-array case** — this helper is pure I/O with no route awareness. `CaptureError` needs a `route`, and Plan 48-03 is the caller that has that context. Mirrors the Plan 48-01 `detectInterstitial` decision to keep pure classifiers/readers free of typed error wrapping.
- **Extend the existing playwright import, don't add a second** — the plan-level invariant counts exactly one `from 'playwright'` line. Extending the existing line with `type Page` satisfies the invariant; adding `import type { Page } from 'playwright'` would break it. Plan 48-02 already landed `chromium, type Browser, type BrowserContextOptions`, so the extension is mechanical.
- **`actualCount` probe with `.catch(() => -1)`** — the outer `catch (cause)` handler needs to build an error message that includes the observed count. If the `$$eval` probe itself also fails (bizarre but possible — the page could be dead), returning `-1` keeps the error message honest ("we don't know the count") rather than cascading a second exception that would mask the original TimeoutError.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Reworded loadFaqItemCount JSDoc to clear the SCAF-08 grep gate**

- **Found during:** Task 1 automated verification step.
- **Issue:** The plan's verbatim action block contained the literal string `forbidden: @/ alias, JSON import assertion, await import()` inside the `loadFaqItemCount` JSDoc. The Task 1 SCAF-08 grep gate (`! grep -qE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts`) is line-based and does not distinguish code from comments, so it matched the literal `@/` inside the comment and tripped the gate. Same class of self-grep false-positive the Plan 48-01 executor ran into on `Date.now()`.
- **Fix:** Reworded the comment to `SCAF-08 bars path-alias imports, JSON import assertions, and dynamic-import JSON loading, so direct stdlib I/O is the only option` — preserves the explanatory intent (why this function uses raw `fs.readFile` + `JSON.parse`) without literally typing the banned prefix `@/`.
- **Files modified:** scripts/editorial/capture.ts (Task 1)
- **Verification:** `grep -qE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts` returns no matches; Task 1 grep gate emitted `GREP_PASS`; `pnpm build` exit 0 before committing.
- **Committed in:** `8a7a06a` (Task 1 commit — the fix was applied before the commit landed).

**2. [Rule 3 — Blocking] Added file-scoped `/// <reference lib="dom" />` so Playwright browser-context callbacks type-check**

- **Found during:** Task 2 `pnpm build` step.
- **Issue:** `vue-tsc -b` reported three errors — `scripts/editorial/capture.ts(189,9): error TS2584: Cannot find name 'document'` (filter-wait callback), `scripts/editorial/capture.ts(216,11): error TS2584: Cannot find name 'document'` (expansion-wait callback), and `scripts/editorial/capture.ts(217,25): error TS18046: 'el' is of type 'unknown'` (dependent error on the DOM-less Element type). Root cause: `tsconfig.editorial.json` has `"lib": ["ES2022"]` only — DOM globals like `document`, `Element`, `HTMLElement` are not in scope. The `page.waitForFunction(() => ..., undefined, { timeout })` and `page.$$eval(selector, (els) => els.length)` callbacks run in the browser context and reference those globals.
- **Fix considered (rejected):** adding `"dom"` to `tsconfig.editorial.json`'s `lib` list. Rejected because it would leak browser globals into every `scripts/editorial/**/*.ts` file, an architectural regression (future Node-only helpers could accidentally type-check references to `window` / `document`). This would have been a Rule 4 escalation.
- **Fix applied:** added `/// <reference lib="dom" />` triple-slash directive at the top of `capture.ts` (immediately below the SCAF-08 banner, with a short comment explaining the scope). The directive is file-scoped: DOM globals are in scope only when compiling this one file. `tsconfig.editorial.json` stays untouched, so every other editorial file still compiles against the Node-only `ES2022` lib.
- **Files modified:** scripts/editorial/capture.ts (Task 2)
- **Verification:** `pnpm build` exit 0 after the fix; `pnpm test:scripts` 224/224 green; the three TS errors cleared.
- **Committed in:** `e573614` (Task 2 commit — the fix was applied before the commit landed).

---

**Total deviations:** 2 auto-fixed (both Rule 3 — Blocking)

**Impact on plan:** Zero scope creep. Deviation 1 is a comment-only reword that preserves the documentation intent. Deviation 2 adds a single triple-slash directive + explanatory banner comment; no `tsconfig.*.json` was touched, no runtime behavior changed. Both fixes were necessary to satisfy the plan's own automated gates (Task 1 grep gate and Task 2 build step) against the verbatim action-block prose.

## Issues Encountered

- None beyond the two deviations above. Plan 48-02 had already landed the `from 'playwright'` import, so Task 2's "extend or add" decision resolved cleanly to "extend".

## User Setup Required

None — the new exports are pure helpers (`loadFaqItemCount` is filesystem I/O on a project-local JSON file, `runFaqPreCaptureHooks` is pure Playwright orchestration with no external services or environment variables). No CLI auth, no network calls beyond Playwright's in-run DOM probes (which only fire when a live page is handed in — not during this plan's verification).

## Known Stubs

The `captureRoutes` export remains a throwing stub per the plan's explicit scope boundary:

- **File:** `scripts/editorial/capture.ts`, line 244
- **Message:** `'captureRoutes: not implemented until Plan 48-06 integration'`
- **Reason intentional:** Plan 48-06 replaces this stub with the orchestrator that composes `launchBrowser` + `buildContextOptions` + `buildCaptureUrl` + `loadFaqItemCount` + `runFaqPreCaptureHooks` + the exhibit-404 check + the screenshot writer. Wiring it in this plan would force Plans 48-03 / 48-05 to race for the same file-owned symbol.
- **Resolution path:** Plan 48-06 (Wave 4) replaces the throw with the real implementation.

No other stubs introduced. No hardcoded empty arrays / nulls / "coming soon" placeholders.

## Verification Results

- **Task 1 grep gate** — 10/10 required patterns present after the Deviation-1 reword (both stdlib imports, `loadFaqItemCount` signature with `Promise<number>` return, `nodePath.dirname` derivation, `nodePath.join` file construction, `fsp.readFile` 'utf8', `JSON.parse(fileContents)`, `Array.isArray` guard, 'faq.json must be a JSON array' error string, `return parsed.length`, stub preserved, SCAF-08 clean). PASS.
- **Task 2 grep gate** — 23/23 required patterns present: `type Page` imported, single `from 'playwright'` line, `runFaqPreCaptureHooks` signature, filter-all click selector verbatim, two `waitForFunction` calls, filter-wait browser-eval body, both CaptureError substrings ('FAQ rendered count mismatch', 'FAQ accordion expansion timed out'), expand-selector verbatim, `for...of` sequential loop, `aria-expanded === 'true'` attribute check, two `timeout: 10_000` sites, two `throw new CaptureError` sites, no `Promise.all`, no `.forEach(...click`, no `waitForSelector('.is-open')`, SCAF-08 clean, stub preserved. PASS.
- **SCAF-08 grep gate** — `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/capture.ts` returns zero matches. PASS.
- **Playwright import singleton** — `grep -c "from 'playwright'" scripts/editorial/capture.ts` returns `1`. PASS.
- **Export surface** — `grep -c "^export " scripts/editorial/capture.ts` returns `10` (CapturedPage interface, CaptureError class, slugify, detectInterstitial, loadFaqItemCount, runFaqPreCaptureHooks, launchBrowser, buildContextOptions, buildCaptureUrl, captureRoutes). Plan requires `>=6`. PASS.
- **Line count** — `wc -l scripts/editorial/capture.ts` = 245 (plan `min_lines: 200`). PASS.
- **`pnpm build`** — exit 0 after each task (Task 2 initially failed on the three DOM-global TS errors, fixed via Deviation 2, then exit 0). Types resolve across the Playwright import; composite build (tsconfig.app + tsconfig.node + tsconfig.editorial) green. PASS.
- **`pnpm test:scripts`** — 18/18 files, 224/224 tests green after each task. Phase 46 smoke test + Phase 47 config/routes suites + Plan 48-01 pure-logic + Plan 48-02 scaffold suites all still pass. Adding new exports did not perturb any existing structural assertion. PASS.
- **Post-commit deletion check** — both task commits include only `scripts/editorial/capture.ts`; zero file deletions in the diff of either commit. PASS.

## Next Phase Readiness

- **Plan 48-03 (Wave 3, per-route capture loop)** — can now import `loadFaqItemCount` to compute `faqItemCount` once per run before the route loop, and call `runFaqPreCaptureHooks(page, faqItemCount)` inside the per-route block whenever `route.path === '/faq'`. Both CaptureError throw-paths will propagate to the per-route `try/catch` that Plan 48-03 wraps around the whole route body — Plan 48-03 re-throws with `{ route }` attached for the outermost `index.ts` boundary.
- **Plan 48-05 (Wave 3, screenshots)** — no new dependency introduced. Plan 48-05 continues to consume only `slugify` from capture.ts.
- **Plan 48-06 (Wave 4, integration)** — replaces the `captureRoutes` throwing stub. The final `captureRoutes` will call `loadFaqItemCount(config.exhibitsJsonPath)` once at the top of the run (outside the route loop), then pass `faqItemCount` into `runFaqPreCaptureHooks` inside the loop when the route is `/faq`. Both CaptureError messages will show up unwrapped in the outermost `try/catch` with the route context attached by Plan 48-03.
- **Plan 48-06 test surface (CAPT-07, CAPT-08 test coverage)** — the CaptureError substring contract ('FAQ rendered count mismatch', 'FAQ accordion expansion timed out', 'expected N expanded') is now frozen; test 48-06 can grep those substrings to assert failure-mode coverage without being coupled to the full message wording.
- **Phase 49 (`convert.ts`)** — no direct dependency on this plan's exports; `CapturedPage` shape was locked in Plan 48-01 and remains untouched.
- **Phase 50 (`index.ts` outermost boundary)** — no new decision surface. `err instanceof CaptureError` still distinguishes capture failures (exit 1) from config failures (exit 2), and both FAQ failure modes flow through that same boundary.

No blockers. Wave 2 / Wave 3 overlap is now at 3 of 4 plans landed (48-01, 48-02, 48-04). Plans 48-03 and 48-05 can still proceed in parallel under the file-ownership serialization rule.

## Self-Check: PASSED

- FOUND: scripts/editorial/capture.ts (245 lines, 10 top-level exports, single playwright import, file-scoped DOM lib reference present)
- FOUND: scripts/editorial/capture.ts exports `loadFaqItemCount` and `runFaqPreCaptureHooks` at runtime (verified via `grep -E "^export (async )?function (loadFaqItemCount|runFaqPreCaptureHooks)"`)
- FOUND: commit `8a7a06a` in `git log` (Task 1 — loadFaqItemCount)
- FOUND: commit `e573614` in `git log` (Task 2 — runFaqPreCaptureHooks)
- PASS: `pnpm build` exit 0
- PASS: `pnpm test:scripts` 224/224 green
- PASS: SCAF-08 grep gate clean
- PASS: single `from 'playwright'` import, extended with `type Page`
- PASS: captureRoutes stub preserved verbatim (message unchanged from Plan 48-01)
- PASS: no deletions in either task commit
- PASS: CaptureError substring contract satisfied (all 5 required substrings grep-present)

---
*Phase: 48-capture-playwright-io*
*Completed: 2026-04-20*
