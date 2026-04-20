---
phase: 037-sfc-content-extraction
plan: 08
subsystem: testing
tags: [vitest, vitest-browser-vue, playwright, chromium, browser-tests, regression, vue, unhead]

requires:
  - phase: 037-sfc-content-extraction
    provides: 7 refactored pages (01–07) sourcing all prose from `src/content/*.ts` and `src/content/sections/*.ts`
provides:
  - 7 `.browser.test.ts` files (one per refactored page) running under Vitest's `browser` project on chromium
  - Round-trip regression coverage — each test imports the SAME content module its page imports, so a dropped string breaks both the page and the test at once
  - Canonical browser-test pattern for future pages — `render()` + `createHead()` plugin + `RouterLinkStub` + visible-text locators
affects: [phase-038, phase-039, future-content-modules, future-page-refactors]

tech-stack:
  added: []
  patterns:
    - "Browser regression test template: `render(Page, { global: { plugins: [createHead()], stubs: { 'router-link': RouterLinkStub } } })`"
    - "Visible-text locators only (`getByRole` + `getByText`) — no DOM snapshots, no screenshot diffs"
    - "Content-module import parity — test imports exactly what the page imports"
    - "Strict-mode heading disambiguation via `{ level: 1, exact: true }` when a h1 collides with a h2 substring match"

key-files:
  created:
    - src/pages/HomePage.browser.test.ts
    - src/pages/PhilosophyPage.browser.test.ts
    - src/pages/FaqPage.browser.test.ts
    - src/pages/ContactPage.browser.test.ts
    - src/pages/AccessibilityPage.browser.test.ts
    - src/pages/TechnologiesPage.browser.test.ts
    - src/pages/CaseFilesPage.browser.test.ts
  modified:
    - .gitignore

key-decisions:
  - "Install @unhead/vue createHead() as a global plugin per render() — not a module mock. Mirrors main.ts production setup and keeps tests honest."
  - "RouterLinkStub from @vue/test-utils on every page, even pages without router-link, to keep the helper uniform and future-proof."
  - "Shared `renderOptions()` factory per file to avoid duplicating the plugin + stub block."
  - "TechnologiesPage h1 uses `{ level: 1, exact: true }` to disambiguate from the <h2>Historical Technologies</h2>."
  - ".vitest-attachments/ and src/pages/__screenshots__/ are runtime failure artifacts from @vitest/browser-playwright — gitignored, never committed."

patterns-established:
  - "Browser regression test: render + createHead plugin + RouterLinkStub + visible-text locators, importing shared content modules"
  - "Strict-mode locator disambiguation via level/exact when heading substrings collide"
  - "Single `renderOptions()` factory per test file — keeps per-test call sites minimal"

requirements-completed: [SFC-01, SFC-02, SFC-03, SFC-04, SFC-05, SFC-06, SFC-07]

duration: 4min
completed: 2026-04-10
---

# Phase 37 Plan 08: Browser Regression Tests Summary

**7 chromium browser tests (19 assertions) using `vitest-browser-vue` `render()` + visible-text locators, importing the same content modules the pages import — round-trip regression coverage that breaks both page and test if a string is dropped.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-10T23:38:38Z
- **Completed:** 2026-04-10T23:42:38Z
- **Tasks:** 3
- **Files modified:** 8 (7 new test files + `.gitignore`)

**Test-run timing (chromium cold-start):**
- Browser suite only: **2.69s** for 7 files / 19 tests (target: <60s — met with 22x margin)
- Full suite (unit + browser): **2.90s** for 18 files / 146 tests

## Accomplishments

- 7 `.browser.test.ts` files covering every refactored page (HomePage, PhilosophyPage, FaqPage, ContactPage, AccessibilityPage, TechnologiesPage, CaseFilesPage)
- 19 total browser test assertions, all green on chromium under the existing `@vitest/browser-playwright` provider
- Zero new dependencies — used existing `vitest-browser-vue@2.1.0`, `@vitest/browser-playwright@4.1.2`, `@vue/test-utils` (`RouterLinkStub`)
- Zero changes to `vitest.config.ts` — leveraged the pre-wired `browser` project verbatim
- Every test imports from `@/content/*` — NOT hardcoded string literals, so Phase 39's static-extraction pipeline can use the exact same modules
- Canonical `render(Page, { global: { plugins: [createHead()], stubs: { 'router-link': RouterLinkStub } } })` pattern documented for future pages

## Task Commits

1. **Task 1: HomePage, PhilosophyPage, FaqPage browser tests** — `dfa2e35` (test)
2. **Task 2: ContactPage, AccessibilityPage, TechnologiesPage browser tests** — `d39fa3d` (test)
3. **Task 3: CaseFilesPage browser test + gitignore vitest artifacts** — `20aca7d` (test)

**Plan metadata:** (pending — added in final commit)

## Files Created/Modified

- `src/pages/HomePage.browser.test.ts` — 3 tests: intro heading/body, section headings, both teaser quotes
- `src/pages/PhilosophyPage.browser.test.ts` — 3 tests: Pattern 158 origin, design thinking + moral spine quote + methodology step 1, AI clarity + closing line
- `src/pages/FaqPage.browser.test.ts` — 2 tests: hero title/subtitle, colleague quotes heading + both quotes
- `src/pages/ContactPage.browser.test.ts` — 3 tests: hero + role fit heading, role fit item 0 + company fit thesis 0, compensation row 0 + colleague quote 0
- `src/pages/AccessibilityPage.browser.test.ts` — 3 tests: hero + commitment, testing method 0, feedback email + technical specs intro
- `src/pages/TechnologiesPage.browser.test.ts` — 2 tests: h1 hero title/subtitle (exact-level disambiguation), intro paragraph
- `src/pages/CaseFilesPage.browser.test.ts` — 3 tests: hero + classification + stats[0], Investigation Reports + Project Directory headings, first industry group + first client entry
- `.gitignore` — added `.vitest-attachments/` and `src/pages/__screenshots__/` (runtime failure artifacts from vitest-browser-playwright)

## Decisions Made

- **@unhead/vue provided via `createHead()` plugin, not mocked.** Every refactored page calls `useSeo()` → `useHead()` from `@unhead/vue`, which requires head context from a provider. Installing `createHead()` as a `global.plugins` entry on each `render()` call mirrors `src/main.ts` production setup, keeps tests honest, and avoids module-level `vi.mock()` calls that could bleed across test files.
- **Shared `renderOptions()` factory per file.** Each test file defines a single `renderOptions()` helper that returns the `global: { plugins, stubs }` block so each test call site is a one-liner. Avoids 40+ lines of duplicate options objects per file.
- **`RouterLinkStub` on every page, even `TechnologiesPage` and `ContactPage` which don't use `<router-link>` directly.** Keeps the helper pattern uniform — if a future child component adds a router-link, the test won't break.
- **Strict-mode locator fix for `TechnologiesPage`.** Both `<h1>Technologies</h1>` and `<h2>Historical Technologies</h2>` match `getByRole('heading', { name: 'Technologies' })`, which triggers Playwright's strict-mode violation (2 elements). Resolved by adding `{ level: 1, exact: true }` — the minimal disambiguation, documented as a pattern for future similar collisions.
- **Runtime failure artifacts gitignored.** `@vitest/browser-playwright` writes `.vitest-attachments/` and `src/pages/__screenshots__/` on test failure. These are never intentional artifacts and should not pollute the repo.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `useHead()` crashed on missing provider context**

- **Found during:** Task 1, Test 1 (first run of `HomePage.browser.test.ts`)
- **Issue:** Every page calls `useSeo()` which calls `useHead()` from `@unhead/vue`. The composable requires the head context to be `provide()`d at the app level — normally done by `main.ts` via `app.use(createHead())`. Without it, all 3 initial HomePage tests failed with `Error: useHead() was called without provide context, ensure you call it through the setup() function.`
- **Fix:** Added `createHead()` as a `global.plugins` entry on every `render()` call across all 7 browser test files. Imported from `@unhead/vue/client`.
- **Files modified:** All 7 `.browser.test.ts` files (added `import { createHead } from '@unhead/vue/client'` + `plugins: [createHead()]` in the shared `renderOptions()` factory)
- **Verification:** HomePage browser suite went from 0/3 passing to 3/3 passing on first retry; full browser suite 19/19 green.
- **Committed in:** `dfa2e35` (Task 1)

**2. [Rule 1 - Bug] Playwright strict-mode violation on `TechnologiesPage` hero heading**

- **Found during:** Task 2 (first run of `TechnologiesPage.browser.test.ts`)
- **Issue:** `screen.getByRole('heading', { name: 'Technologies' })` resolved to TWO elements: `<h1>Technologies</h1>` (the intended match) and `<h2 id="historical-heading">Historical Technologies</h2>` (substring match). Playwright's strict-mode locator rejects ambiguous matches.
- **Fix:** Changed the selector to `getByRole('heading', { name: hero.title, exact: true, level: 1 })`. `level: 1` restricts to `<h1>`; `exact: true` is belt-and-suspenders against future substring collisions.
- **Files modified:** `src/pages/TechnologiesPage.browser.test.ts`
- **Verification:** 2/2 TechnologiesPage tests passing on retry; full Task 2 batch 8/8 green.
- **Committed in:** `d39fa3d` (Task 2)

**3. [Rule 3 - Blocking] Runtime failure artifacts left untracked after passing runs**

- **Found during:** Task 3 pre-commit `git status` check
- **Issue:** The two earlier auto-fixes produced `.vitest-attachments/` and `src/pages/__screenshots__/` artifacts from the failing-then-passing runs. Neither directory was in `.gitignore`, leaving binary PNGs and metadata files as untracked debris. These are pure runtime output — never intentional artifacts.
- **Fix:** Added `.vitest-attachments/` and `src/pages/__screenshots__/` to `.gitignore`. Removed the existing directories before commit so the working tree was clean.
- **Files modified:** `.gitignore`
- **Verification:** `git status --short` shows only the intentional new test files; no untracked screenshot/attachment directories.
- **Committed in:** `20aca7d` (Task 3)

---

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All three deviations were unavoidable test-environment setup issues that the plan's template didn't anticipate. The `createHead()` fix hardened the canonical browser-test pattern for every future Vue page test. The strict-mode fix established the heading-disambiguation pattern. The gitignore fix prevents runtime artifacts from polluting the repo. No scope creep — zero source code changes, zero dependency additions, zero config changes.

## Issues Encountered

- **Vite dependency optimization reload on first run.** The first `@unhead/vue/client` import triggered `[vite] new dependencies optimized: @unhead/vue/client` → `optimized dependencies changed. reloading` → a one-time reload warning. Tests still passed on the reload cycle. Subsequent runs were clean. Noted but not worth fixing — single-time cost, no flakiness.
- **Q6 fallback NOT needed.** RESEARCH.md §Open Questions Q6 pre-authorized falling back from `expect.element(page.getByText(...)).toBeVisible()` to `expect(page.getByText(...).element()).toBeDefined()` if the primary API failed. The primary API worked on first attempt — no fallback used.

## User Setup Required

None — no external service configuration required. The Vitest `browser` project is already configured in `vitest.config.ts`; Playwright chromium was already installed via `@vitest/browser-playwright`.

## Next Phase Readiness

- **Plan 037-09 (the last plan in Phase 37):** ready to start. This plan added regression coverage for every refactored page; 037-09 can now introduce the forbidden-tokens enforcement test with confidence that breaking a prose string will immediately show up in both unit tests (037-09's new assertion) and browser tests (this plan).
- **Phase 39 (static markdown export):** the content modules now have belt-and-suspenders verification — any extraction script that touches `src/content/*.ts` can run `npm run test` and catch regressions in both the page rendering layer (browser tests) and the content invariants layer (unit tests from 037-09).
- **No blockers.** Full suite green; no deferred items.

## Self-Check: PASSED

**Files verified (`test -f`):**
- FOUND: src/pages/HomePage.browser.test.ts
- FOUND: src/pages/PhilosophyPage.browser.test.ts
- FOUND: src/pages/FaqPage.browser.test.ts
- FOUND: src/pages/ContactPage.browser.test.ts
- FOUND: src/pages/AccessibilityPage.browser.test.ts
- FOUND: src/pages/TechnologiesPage.browser.test.ts
- FOUND: src/pages/CaseFilesPage.browser.test.ts

**Commits verified (`git log --oneline | grep`):**
- FOUND: dfa2e35 (Task 1)
- FOUND: d39fa3d (Task 2)
- FOUND: 20aca7d (Task 3)

**Acceptance criteria verified:**
- FOUND: 7 `.browser.test.ts` files (target: 7)
- FOUND: 0 `toMatchSnapshot` / `toMatchInlineSnapshot` occurrences (target: 0)
- FOUND: `vitest.config.ts` unchanged (target: unchanged)
- FOUND: `package.json` unchanged — zero new deps (target: 0 new deps)
- FOUND: `npm run test:browser` exits 0 with 7 files / 19 tests passing (target: 7 files / ≥18 tests)
- FOUND: `npm run test` exits 0 with 18 files / 146 tests passing (target: unit ≥127 + browser ≥18)

---
*Phase: 037-sfc-content-extraction*
*Completed: 2026-04-10*
