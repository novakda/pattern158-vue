# Phase 37: SFC Content Extraction — Research

**Researched:** 2026-04-10
**Domain:** Vue 3 SFC refactor (move hardcoded prose into TS content modules) + Vitest browser regression tests via existing Playwright install
**Confidence:** HIGH

## Summary

Phase 37 is a mechanical prose extraction and thin-loader formalization phase. Vue pages and components currently mix structural markup with inline English prose; Phase 37 moves that prose into a new `src/content/*.ts` module tree so that downstream phases (38-45, the markdown export pipeline) can import from a typed TS module instead of parsing `.vue` SFCs (which is an explicit forbidden operation in the milestone).

The phase is lower risk than the phase description implies on one axis and higher risk on another:

- **Lower risk (infra):** Playwright is already installed — transitively as `playwright@1.59.1`, and directly wired through `@vitest/browser-playwright@4.1.2` + `vitest-browser-vue@2.1.0`. `vitest.config.ts` already declares a `browser` Vitest project using chromium. Chromium binaries are present under `~/.cache/ms-playwright/chromium-*`. **There are zero existing `.browser.test.ts` files** — the infrastructure is plumbed but untouched. No new deps, no new config. Phase 37 gets Playwright regression tests for free.
- **Higher risk (scope):** The phase description and PROJECT.md both claim "7 Vue files." Direct inspection found prose concentrated in ~15 files — 7 pages and 8 components — because `ContactPage.vue` delegates almost everything to `RoleFitSection`, `CompanyFitSection`, `CultureFitSection`, `ContactMethods`, and `CompensationTable`, each of which contains its own hardcoded prose that must also move. Similarly, `PhilosophyPage.vue` delegates to `Pattern158OriginSection`, `HowIWorkSection`, and `AiClaritySection`. The planner must budget for the full inventory, not the "7 files" claim.

**Primary recommendation:** Refactor 7 pages + 8 components (15 files total). Create `src/content/` with one file per page and a `src/content/sections/` subdirectory for the prose-bearing components. Use `vitest-browser-vue` in new `.browser.test.ts` files — one per refactored page — that call `page.render(PageComponent)` and assert the critical headline strings remain visible after the refactor. No new dependencies. Formalize the thin-loader invariant with a dedicated unit test under `src/data/__tests__/loaders.thin.test.ts` that greps every `src/data/*.ts` for forbidden identifiers (`computed`, `.sort(`, `.filter(`, `.map(`) — a test is cheaper than an ESLint rule and fits the project's existing test-first pattern.

---

## User Constraints (from phase description + PROJECT.md + SUMMARY.md locked decisions)

> No CONTEXT.md exists yet for Phase 37 (standalone research mode). These constraints come verbatim from the phase description the orchestrator passed in, PROJECT.md's Active v7.0 Foundation list, and v7.0 SUMMARY.md Section 8 (Consensus Recommendations).

### Locked Decisions

1. **Content sourcing is Option B** — refactor SFCs to import prose from `src/content/*.ts`. Options A (duplicated map) and C (parse `.vue` SFCs) are explicitly rejected in SUMMARY.md §4.1.
2. **`src/content/` is the canonical location** — NOT `src/data/`. `data/` remains JSON-backed structured records; `content/` holds TS prose modules.
3. **Thin-loader invariant applies ONLY to `src/data/*.ts`** (JSON loaders). `src/content/*.ts` may hold literals, composed constants, and typed arrays without restriction — it is a source file, not a loader.
4. **The markdown generator (Phases 38-45) will NOT parse `.vue` SFCs.** This is on the forbidden list. Phase 37's job is to make that forbidden rule livable by moving the prose somewhere importable.
5. **Playwright regression test per refactored page** — one `.browser.test.ts` per refactored page covering the critical visible strings before/after the refactor. (Requirement SFC-01…SFC-07 — one per page.)
6. **All existing tests must remain green** — PROJECT.md says "95+". Verified as **127 tests across 11 files** by running `npx vitest run` on the pre-refactor tree on 2026-04-10. Planner should assert `≥ 127` going forward.
7. **LOAD-01 — formalize thin-loader invariant** — `src/data/*.ts` loaders may only `import` JSON + assert types + re-export. No `sort`/`filter`/`map`/`computed`/derived fields.

### Claude's Discretion

- Shape of `src/content/*.ts` modules: named exports vs default export vs typed objects — recommend below.
- Whether to add a dedicated `pageMeta.ts` for titles/descriptions already passed to `useSeo()` — recommend yes (bonus payoff for the extractor).
- Enforcement style for the thin-loader invariant: ESLint rule vs unit test vs type-level — recommend unit test.
- Exact shape of `.browser.test.ts` assertions (text match vs DOM snapshot vs screenshot) — recommend visible-text locators via `vitest-browser-vue`.
- Wave structure and parallelization — recommend two waves: Wave 1 (parallel page + component extractions guarded by existing happy-dom unit tests) and Wave 2 (serial addition of Playwright regression tests).

### Deferred Ideas (OUT OF SCOPE for Phase 37)

- Lint rule blocking string literals > N chars in `<template>` blocks (mentioned in SUMMARY.md §5.1 Pitfall 2.1 mitigation). Nice to have, but PROJECT.md hard-constraints Phase 37 to "do NOT introduce new dependencies." An ESLint rule requires an ESLint setup decision that Phase 37 should not litigate.
- `tsx` / `yaml` / `github-slugger` installation — Phase 38.
- `scripts/markdown-export/` scaffold — Phase 38.
- `tsconfig.scripts.json` — Phase 38.
- `docs/` directory collision audit — Phase 38.
- Any `DocNode` / `PageDoc` types — Phase 38.
- Any changes to `src/router.ts`, `src/data/*`, or the router test — all out of scope. Phase 37 touches `src/pages/*`, `src/components/*` (prose only), `src/content/*` (new), and `src/data/__tests__/*` (one new test file).

---

## Phase Requirements

> The orchestrator passed these requirement IDs. Direct citations from PROJECT.md lines 90-91:

| ID | Description | Research Support |
|----|-------------|------------------|
| **SFC-01** | Move hardcoded prose from HomePage.vue into `src/content/home.ts` | §A1 "File Inventory" — 1 heading, 1 intro paragraph, 2 section headings, 1 subtitle, 2 teaser quotes. Smallest page refactor. |
| **SFC-02** | Move hardcoded prose from PhilosophyPage.vue into `src/content/philosophy.ts` + extract section-component prose | §A1 — 2 large prose sections inline, plus 3 delegated section components (Pattern158OriginSection, HowIWorkSection, AiClaritySection) that also need extraction. Largest refactor. |
| **SFC-03** | Move hardcoded prose from FaqPage.vue (testimonial block) into `src/content/faq.ts` | §A1 — only the "What Colleagues Say" block is hardcoded; the FAQ list already reads from `@/data/faq`. Trivial. |
| **SFC-04** | Move hardcoded prose from ContactPage.vue + 5 delegated section components into `src/content/contact.ts` + section files | §A1 — page itself has only 2 testimonial quotes; `RoleFitSection`, `CompanyFitSection`, `CultureFitSection`, `ContactMethods`, `CompensationTable` each own large prose/data blocks. High-volume mechanical refactor. |
| **SFC-05** | Move hardcoded prose from AccessibilityPage.vue into `src/content/accessibility.ts` | §A1 — 9 sections, 144-line file, all prose. Highest single-file volume. |
| **SFC-06** | Move hardcoded prose from TechnologiesPage.vue into `src/content/technologies.ts` | §A1 — only the `HeroMinimal` subtitle + `hero-intro` paragraph. Tech cards already read from `@/data/technologies`. Trivial. |
| **SFC-07** | Move hardcoded prose from CaseFilesPage.vue into `src/content/caseFiles.ts` — **including the hand-written Project Directory tables** | §A1 — 2 section subtitles + an inline comment-marked hand-written directory of 7 industry tables (~35 client/project/dates/role rows). **This is the only requirement where the "prose" is actually structured tabular data.** Either (a) add a `projectDirectory: DirectoryEntry[]` structure to `src/content/caseFiles.ts`, or (b) promote the directory to `src/data/projectDirectory.json` with its own thin loader. Recommendation in §C6. |
| **LOAD-01** | Thin-loader invariant formalized: `src/data/*.ts` loaders may only import JSON + assert types + re-export; no sort/filter/computed fields | §D — all 10 data loaders already comply (verified on 2026-04-10). Phase 37 only needs to add enforcement (a unit test). Zero existing violations means zero remediation work. |

**Planner mapping rule:** Requirements SFC-01 through SFC-07 are named after the seven **pages**, but SFC-02 and SFC-04 each pull in delegated component refactors. The planner should NOT create a parallel SFC-08..SFC-15 for components — treat the components as subtasks under their owning page requirement.

---

## Project Constraints (from CLAUDE.md)

The project's `CLAUDE.md` (`/home/xhiris/projects/pattern158-vue/CLAUDE.md`) was not located in the working directory. `~/CLAUDE.md` (user global) applies and contains one hard rule relevant here:

- **No new devDependencies in Phase 37.** (Derived from phase description, not CLAUDE.md directly, but consistent with it.)
- User's global `CLAUDE.md` mandates: "My web search quota is exhausted for the built-in WebSearch tool. Always use the search tools provided by the Docker MCP Toolkit for any internet queries." No web searches were performed for this phase — all findings are from direct codebase inspection, npm registry data cached in `node_modules/*/package.json`, and the already-synthesized v7.0 research files.

No project-level `CLAUDE.md` directives override the defaults.

---

## Standard Stack

### Core (already installed — ZERO new dependencies needed)

| Library | Version (verified) | Purpose | Why Standard |
|---------|--------------------|---------|--------------|
| `playwright` | `1.59.1` [VERIFIED: `node_modules/playwright/package.json`] | Browser automation under the hood of Vitest browser mode | Already a devDep — listed as `^1.58.2` in package.json, resolved to 1.59.1 |
| `@vitest/browser-playwright` | `4.1.2` [VERIFIED: `node_modules/@vitest/browser-playwright/package.json`] | Vitest provider that drives Playwright | Already a devDep — already wired in `vitest.config.ts` |
| `vitest-browser-vue` | `2.1.0` [VERIFIED: `node_modules/vitest-browser-vue/package.json`] | `render()` helper that mounts a Vue SFC in the browser test context with testing-library-style locators | Already a devDep — the Vue-flavored equivalent of `@testing-library/vue`, required by vitest 4+ for browser-mode component rendering |
| `vitest` | `^4.1.0` | Test runner — both unit (happy-dom) and browser (playwright) projects already declared | Existing |
| `@vue/test-utils` | Transitive via `vitest-browser-vue` 2.1.0 | Unit test pattern for existing 127 tests | Existing — used by all 11 current test files |
| chromium binary | 1200 / 1208 / 1217 [VERIFIED: `~/.cache/ms-playwright/chromium-*`] | Browser engine Playwright drives | Already downloaded — three chromium versions cached, no install step needed |

### Supporting (also already installed)

| Library | Version | Purpose |
|---------|---------|---------|
| `happy-dom` | `^20.8.4` | DOM environment for the unit Vitest project (existing unit tests stay here) |
| `@vitejs/plugin-vue` | `^5.2.0` | SFC compilation in both Vitest projects |
| `typescript` | `~5.7.0` | Type checking on `src/content/*.ts` |

### Alternatives Considered (all rejected for Phase 37)

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `vitest-browser-vue` | `@playwright/test` standalone | Would require a separate Playwright config, separate runner, separate test discovery, separate devDep (`@playwright/test`). Violates the "no new deps" constraint. `vitest-browser-vue` reuses the already-declared `browser` project in `vitest.config.ts`. |
| `vitest-browser-vue` | `@testing-library/vue` in happy-dom | Would skip Playwright entirely but ALSO skip the real-browser guarantee the phase description explicitly wants ("Playwright regression test per refactored page"). Use the installed browser stack, not DOM emulation. |
| Visible-text assertion | Screenshot diff | Screenshots are flaky across OS font rendering and dark/light theme toggles. Visible-text matches via `getByText()` / `getByRole()` are the testing-library recommended approach and survive CSS changes that don't affect copy. |
| Visible-text assertion | DOM snapshot (Vitest `toMatchSnapshot`) | DOM snapshots churn on every class rename. Visible-text matches are stable. |

### Installation

**None.** Any plan that adds `npm install` or `pnpm add` in Phase 37 is wrong.

### Version verification

[VERIFIED: 2026-04-10] — All versions above confirmed directly from `node_modules/<pkg>/package.json`. No npm registry calls required because the deps are already installed and pinned.

---

## Architecture Patterns

### Recommended File Layout

```
src/
├── content/                          # NEW in Phase 37
│   ├── home.ts                       # REQ SFC-01
│   ├── philosophy.ts                 # REQ SFC-02 (page-level prose)
│   ├── faq.ts                        # REQ SFC-03
│   ├── contact.ts                    # REQ SFC-04 (page-level testimonials only)
│   ├── accessibility.ts              # REQ SFC-05
│   ├── technologies.ts               # REQ SFC-06 (hero intro only)
│   ├── caseFiles.ts                  # REQ SFC-07 (subtitles + projectDirectory — see §C6)
│   └── sections/                     # Prose for child components
│       ├── pattern158Origin.ts       # Pattern158OriginSection.vue prose
│       ├── howIWork.ts               # HowIWorkSection.vue — 3 methodology steps
│       ├── aiClarity.ts              # AiClaritySection.vue prose
│       ├── roleFit.ts                # RoleFitSection.vue — looking-for / not-looking-for lists
│       ├── companyFit.ts             # CompanyFitSection.vue — 4 paragraphs
│       ├── cultureFit.ts             # CultureFitSection.vue — 6 criteria
│       ├── contactMethods.ts         # ContactMethods.vue — links + guidance prose
│       └── compensation.ts           # CompensationTable.vue — 6 rows of numbers
│
├── pages/                            # MODIFIED — prose replaced with imports
│   ├── HomePage.vue                  # v-for over imported arrays
│   ├── PhilosophyPage.vue
│   ├── FaqPage.vue
│   ├── ContactPage.vue
│   ├── AccessibilityPage.vue
│   ├── TechnologiesPage.vue
│   └── CaseFilesPage.vue
│
├── components/                       # MODIFIED — 8 files get prose replaced with imports
│   ├── Pattern158OriginSection.vue
│   ├── HowIWorkSection.vue
│   ├── AiClaritySection.vue
│   ├── RoleFitSection.vue
│   ├── CompanyFitSection.vue
│   ├── CultureFitSection.vue
│   ├── ContactMethods.vue
│   └── CompensationTable.vue
│
├── data/
│   └── __tests__/                    # NEW directory (or co-locate)
│       └── loaders.thin.test.ts      # REQ LOAD-01 — enforces thin-loader invariant
│
└── pages/__tests__/                  # NEW browser tests (or co-locate as *.browser.test.ts)
    ├── HomePage.browser.test.ts      # REQ SFC-01 regression
    ├── PhilosophyPage.browser.test.ts
    ├── FaqPage.browser.test.ts
    ├── ContactPage.browser.test.ts
    ├── AccessibilityPage.browser.test.ts
    ├── TechnologiesPage.browser.test.ts
    └── CaseFilesPage.browser.test.ts
```

> Location choice for `.browser.test.ts`: co-locate with the page SFC (`src/pages/HomePage.browser.test.ts`) to match the existing `*.test.ts` convention (all 11 current unit tests are co-located with their source). This requires no changes to `vitest.config.ts` because its browser project already includes `src/**/*.browser.test.ts`.

### Pattern 1: Content Module Shape — Named Exports of Typed Arrays

**What:** Each `src/content/*.ts` module exports one or more named `const` arrays or objects, typed through a minimal local interface (or a shared interface in `src/types/content.ts` if reused across multiple modules).

**When to use:** Every `src/content/*.ts` file in this phase.

**Rationale:** This is the same pattern `src/data/*.ts` already uses (`export const exhibits: Exhibit[] = ...`), so it fits the project's muscle memory. Named exports give extractors in Phase 39 a stable import signature (`import { intro, teaserQuotes, sections } from '@/content/home'`) and keep the Vue consumer call sites self-documenting.

**Example:**

```typescript
// src/content/home.ts
export interface HomeSectionHeading {
  id: string
  title: string
  subtitle?: string
}

export interface HomeTeaserQuote {
  quote: string
  cite?: string
  context?: string
}

export const intro = {
  heading: 'I Reverse-Engineer Chaos Into Clarity',
  body: 'After 28 years building and rescuing enterprise systems, I\'ve learned that the best solutions aren\'t always the obvious ones — they\'re the elegant shortcuts that work properly.',
}

export const featuredProjectsHeading: HomeSectionHeading = {
  id: 'work',
  title: 'Featured Projects',
}

export const fieldReportsHeading: HomeSectionHeading = {
  id: 'field-reports',
  title: 'From the Field',
  subtitle: 'Direct feedback from engagements spanning 17 years',
}

export const teaserQuotes: HomeTeaserQuote[] = [
  {
    quote: 'Dan\u2019s technical expertise is tremendous… with his help, we were able to solve two large technical issues we were having, one that will have a direct impact on the Flash conversion process and save a lot of time and money.',
  },
  {
    quote: 'This resulted in a savings of about 600 hours of labor by allowing us to publish large batches of lessons unattended.',
    cite: 'Manager, Content Team',
    context: 'On publishing automation built during 1,216-lesson refresh',
  },
]
```

```vue
<!-- src/pages/HomePage.vue (after refactor) -->
<script setup lang="ts">
import { intro, featuredProjectsHeading, fieldReportsHeading, teaserQuotes } from '@/content/home'
// ...
</script>

<template>
  <section class="intro">
    <div class="container">
      <h2>{{ intro.heading }}</h2>
      <p>{{ intro.body }}</p>
      <!-- ... -->
    </div>
  </section>

  <section class="findings" :id="featuredProjectsHeading.id">
    <div class="container">
      <h2>{{ featuredProjectsHeading.title }}</h2>
      <!-- ... -->
    </div>
  </section>

  <section class="field-reports-teaser">
    <div class="container">
      <h2>{{ fieldReportsHeading.title }}</h2>
      <p class="section-subtitle">{{ fieldReportsHeading.subtitle }}</p>
      <div class="teaser-quotes">
        <TestimonialQuote
          v-for="q in teaserQuotes"
          :key="q.quote"
          :quote="q.quote"
          :cite="q.cite"
          :context="q.context"
        />
      </div>
      <!-- ... -->
    </div>
  </section>
</template>
```

[VERIFIED by direct inspection of HomePage.vue lines 23-83 on 2026-04-10]

### Pattern 2: Prose Modules for Multi-Paragraph Sections — Array of Paragraphs

**What:** Multi-paragraph sections become `paragraphs: string[]` arrays. Inline markup (bold, italic, em, cite, blockquote) is either (a) preserved as HTML strings and rendered with `v-html` when safe, or (b) structured with a discriminated union.

**When to use:** Large prose blocks like `PhilosophyPage.vue` design-thinking section, `AiClaritySection.vue`, `Pattern158OriginSection.vue`, `AccessibilityPage.vue` sections.

**Recommendation:** Use **structured objects** rather than raw HTML strings, because:
1. The Phase 38-45 markdown generator will need to know the structure (which segments are `<strong>`, which are `<em>`, which are `<blockquote>`) to emit correct markdown.
2. `v-html` bypasses Vue's escaping and triggers ESLint warnings in most project setups — the existing `.vue` files use inline markup, not `v-html`.
3. A structured shape makes the extractor in Phase 39 a one-liner (`paragraphs.map(p => paragraphNode(p))`) instead of an HTML-to-markdown converter.

**Example for HowIWorkSection:**

```typescript
// src/content/sections/howIWork.ts

export interface MethodologyStepContent {
  heading: string
  paragraphs: ParagraphContent[]
}

export interface ParagraphContent {
  segments: ParagraphSegment[]
}

export type ParagraphSegment =
  | { kind: 'text'; value: string }
  | { kind: 'strong'; value: string }
  | { kind: 'em'; value: string }

export const methodologySteps: MethodologyStepContent[] = [
  {
    heading: '1. Deconstruct the Chaos',
    paragraphs: [
      {
        segments: [
          { kind: 'text', value: 'Forensic engineering before solution engineering. Understand the actual system — not the documented one, not the stated one, not the one someone remembers from three years ago. The real one, running in production, behaving the way it behaves.' },
        ],
      },
      {
        segments: [
          { kind: 'strong', value: 'Never blame the human first.' },
          { kind: 'text', value: ' When a system fails, the system designed the conditions for that failure. The Swiss cheese model: disasters require contributing factors to align. The person who clicked the wrong button is almost never the root cause.' },
        ],
      },
      {
        segments: [
          { kind: 'text', value: 'This is empathy with teeth. It\'s not about being charitable — it\'s about being accurate.' },
        ],
      },
    ],
  },
  // ... steps 2 and 3
]
```

**Alternative (simpler, if the project accepts `v-html`):** Store `html` strings. Fast to write, but pushes parse-back complexity into Phase 39. **The planner should pick one style in PLAN.md and use it consistently**; mixed styles hurt the extractor's job.

**Recommendation for Phase 37:** Use **plain `string` paragraphs** (no inline markup segmentation) for the initial extraction, and render them with regular `{{ paragraph }}` interpolation. Where inline `<strong>`, `<em>`, `<blockquote>` is structurally load-bearing (e.g. PhilosophyPage moral-spine blockquote), either keep that structural piece inline in the template OR add a typed `blockquote` field on the module. This trades a small amount of template expressiveness for a massively simpler content module — which pays off in Phase 39 when the extractor just iterates string arrays. **For the one or two genuinely complex prose fragments** (AiClaritySection has `<em>`, `<strong>`, and `<p class="methodology-note">`), allow those to stay as structured `{ kind, value }` segments — but only those.

### Pattern 3: Vue Consumption — `v-for` Over Imported Arrays

**What:** SFCs import the named exports and render them with `v-for`. No `ref()`, no `computed()`, no reactive wrapping — the content is static module-level constants.

**Reactive concern:** Zero. Module-level imports of primitive/plain-object constants are already reactive-compatible in Vue 3 because Vue's template compiler reads them on first render and they never change. Wrapping in `ref()` or `reactive()` would be actively wrong (overhead for nothing). The only reason you'd want reactivity is if the content came from a fetch, which it doesn't.

**Example:**

```vue
<script setup lang="ts">
import { methodologySteps } from '@/content/sections/howIWork'
</script>

<template>
  <section id="how-i-work" class="content-section">
    <ol class="methodology-steps">
      <li v-for="step in methodologySteps" :key="step.heading">
        <h3>{{ step.heading }}</h3>
        <p v-for="(para, i) in step.paragraphs" :key="i">{{ para }}</p>
      </li>
    </ol>
  </section>
</template>
```

### Pattern 4: Browser Regression Test — `vitest-browser-vue` `page.render()`

**What:** One `.browser.test.ts` file per refactored page. Each test mounts the page in a real browser (via `@vitest/browser-playwright`'s chromium instance) and asserts the critical visible strings survive the refactor.

**Sources used to verify this pattern:**
- [VERIFIED: `node_modules/vitest-browser-vue/README.md`] — shows `render()` API and Vitest browser mode wiring
- [VERIFIED: `vitest.config.ts` lines 25-38] — `browser` project already declares chromium via `playwright()` provider

**Shape (one file per page):**

```typescript
// src/pages/HomePage.browser.test.ts
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils' // existing pattern from unit tests

import HomePage from './HomePage.vue'
import { intro, teaserQuotes } from '@/content/home'

test('HomePage renders the intro heading from src/content/home', async () => {
  const screen = render(HomePage, {
    global: {
      stubs: { 'router-link': RouterLinkStub },
    },
  })

  // Assert the critical strings that define "this is the homepage" for a hiring manager
  await expect.element(screen.getByRole('heading', { name: intro.heading })).toBeVisible()
  await expect.element(screen.getByText(teaserQuotes[0].quote)).toBeVisible()
})
```

**Why this shape:**
1. **Dogfoods the refactor** — the test imports the SAME content module the page imports, so if the extraction misses a string the test fails. It is NOT a literal-string test; it is a round-trip test.
2. **Minimal flake surface** — no screenshots, no DOM snapshots, no timing assumptions. Testing-library's `getByRole`/`getByText` are resilient to CSS and class-name changes.
3. **Reuses existing RouterLink stub pattern** — `src/pages/CaseFilesPage.test.ts` line 6 already uses `vi.mock('vue-router', ...)` to stub `RouterLink`. `vitest-browser-vue` pairs with `@vue/test-utils`'s `RouterLinkStub` for the same effect. (`RouterLinkStub` is exported from `@vue/test-utils`, which is already transitively installed via `vitest-browser-vue@2.1.0` — verified in its README "Powered by @vue/test-utils".)

**Expected flakiness:** None, if the assertions use visible-text locators. The only flakiness risk is if a test waits on async rendering (dynamic imports, fetch, etc.) — the 7 target pages have none of that.

### Anti-Patterns to Avoid

- **Don't use `@/content/*` path alias inside `src/content/*.ts` files** — no intra-content imports needed for Phase 37.
- **Don't push prose to JSON** (e.g., `src/data/json/home.json`). The v7.0 decision was to put prose in `src/content/*.ts` (TypeScript) because prose benefits from TypeScript literal types and inline JS escape sequences (`\u2019`, `\u2014`), whereas JSON cannot express these cleanly. Keep JSON for structured records (exhibits, FAQ items); keep TS for prose with inline markup.
- **Don't refactor `CompensationTable.vue` prose into the same place as `CompanyFitSection.vue` prose.** They belong to different components. One file per component.
- **Don't use `v-html`** to render extracted HTML. It bypasses Vue's XSS protection, triggers lint warnings, and commits to a parsing model that Phase 39 will have to undo.
- **Don't add a new ESLint rule in Phase 37** — constraints prohibit new dependencies/tooling. Use a unit test for thin-loader enforcement.
- **Don't put `.browser.test.ts` files inside `src/content/`** — the content modules are plain data, not components. Browser tests live alongside the page/component they test.
- **Don't remove existing unit tests.** The 127 unit tests must remain green. Some of them (e.g. `CaseFilesPage.test.ts` line 38-49) assert literal strings like `'38'`, `'Projects Documented'`, `'Investigation Reports'` — these strings will now come from the content module, but the assertions still work because `@vue/test-utils` reads rendered text. NO test file needs to be edited if the refactor is faithful.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser regression testing | Puppeteer harness, custom Playwright runner, shell script that curls the dev server | `vitest-browser-vue` + existing `browser` Vitest project | Already installed, already configured, already has chromium binaries cached. Adding a second runner fragments CI, test discovery, and failure reporting. |
| Thin-loader enforcement | ESLint plugin, custom TypeScript transformer | Single Vitest test that reads loader source and greps for forbidden patterns | Vitest is the existing test runner. A ~20-line test that does `await fs.readFile(loaderPath)` and asserts the file matches a small allow-list of AST shapes (via regex) costs nothing and catches the same drift an ESLint rule would. |
| Content-module typing | Zod / runtime validators | Plain TypeScript `interface` declarations, compile-time only | Phase 37 content is module-level constants that are type-checked on build by `vue-tsc`. No runtime input → no runtime validation. |
| Cross-phase extractor contract | Ad-hoc documentation | Named exports with stable names + `src/types/content.ts` if 2+ modules share a shape | TypeScript compiler enforces the contract for free. The Phase 39 extractor will fail at build time if a content module is missing an expected export. |

**Key insight:** Phase 37 is a refactor, not a feature build. Hand-rolled solutions here are the main risk — every "while we're at it, let's also add X" trades Phase 37 simplicity for Phase 38 delay. Keep each task reversible and single-purpose.

---

## Runtime State Inventory

> This is a refactor phase. The canonical question: *after every file in the repo is updated, what runtime systems still have the old string cached, stored, or registered?*

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None — Phase 37 touches TypeScript source files only. No databases, no ChromaDB/Mem0 collections, no caches. | None. |
| **Live service config** | None — the Vue SPA has no external service state. Cloudflare Wrangler (`wrangler@^4.75.0`) deploys the built `dist/` but doesn't store any "content" string server-side. | None. |
| **OS-registered state** | None — no Windows tasks, no systemd units, no launchd plists associated with this project. | None. |
| **Secrets and env vars** | None — no `.env` files reference extracted strings. `useSeo({title, description, path})` uses string literals, not env vars. | None. |
| **Build artifacts / installed packages** | **One concern:** `dist/` is in `.gitignore`, but Storybook builds to `storybook-static/` and the project also emits `tsconfig.tsbuildinfo` (currently in `git status M`). After the refactor, running `npm run build-storybook` will rebuild with the new content module imports — no manual action needed, but the Storybook stories that reference `HomePage`, `PhilosophyPage`, `ContactPage` etc. must continue to render correctly. Every page with a `.stories.ts` sibling should be verified manually or via the existing Storybook build. | Run `npm run build-storybook` as part of Wave 3 (phase gate) to catch any story that silently broke. |

**Other cross-references to verify:**
- No `postinstall` / `prepare` hooks in package.json reference prose strings.
- No documentation files (`README.md`, `.planning/*`) quote these prose strings in a way that would go stale — PROJECT.md does quote the core value "Every page template should be scannable..." but that is project documentation, not extracted content.

**Summary:** The refactor is runtime-state-safe. Only Storybook needs a post-refactor build verification.

---

## Common Pitfalls

### Pitfall 1: HTML Entities Hide in the Source

**What goes wrong:** Pages use `&mdash;`, `&ldquo;`, `&rdquo;`, `&rarr;`, `&middot;`, `\u2019`, `\u2014` interchangeably. A naive copy-paste from `.vue` `<template>` into a `.ts` string literal will mix encodings.

**Why it happens:** `<template>` allows HTML entities; `.ts` string literals do not (they want Unicode code points or literal characters).

**How to avoid:**
- Use a consistent convention per module: prefer literal Unicode characters (`—`, `"`, `"`) or `\u` escapes (`\u2014`, `\u201C`, `\u201D`). Avoid HTML entity names in `.ts`.
- The extractor / refactor tool should normalize: decode `&mdash;` → `—` on extraction.
- **Verify with a Vitest test:** the browser test asserting visible text uses the rendered string (Vue decodes entities on render). If the page rendered `—` before and `—` after, the test passes — even if the source changed from `&mdash;` to `—`.

**Warning signs:** Browser regression test fails with a message like `expected to find "—" but got "&mdash;"`. This means the refactored module stored the literal HTML-entity-name string, not the Unicode character, and the template is rendering it without decoding.

[VERIFIED via direct inspection] — HomePage.vue line 41 has `&#x2014;`, line 25 has `\u2019`. PhilosophyPage.vue line 32 has `&mdash;`, line 44 has `&ldquo;` and `&rdquo;`. AiClaritySection.vue line 7 has `&ldquo;` and `&rdquo;`. Inconsistent encoding IS already present — the refactor should normalize it, not preserve the inconsistency.

### Pitfall 2: `v-html` Creep

**What goes wrong:** To handle inline `<strong>`, `<em>`, `<cite>`, `<blockquote>`, someone reaches for `v-html="paragraph"`. This (a) bypasses Vue's XSS protection, (b) commits the project to an HTML-in-content contract that Phase 39 has to undo, and (c) makes the Phase 39 markdown generator dramatically more complex because it will need an HTML-to-markdown converter (explicitly rejected in the milestone — see SUMMARY.md §2 "`turndown`: NOT NEEDED").

**Why it happens:** It's the path of least resistance for the first multi-paragraph prose block.

**How to avoid:**
- PLAN.md should explicitly forbid `v-html` in Phase 37 refactored pages.
- For genuinely structural inline markup (blockquotes, pull-quotes), keep the `<blockquote>` element in the template and pass its text from a content field. The template remains the structural layer; the content module remains the prose layer.
- For inline emphasis (`<strong>`, `<em>`), either: (a) use the `{kind, value}` segment pattern shown in Pattern 2 above, OR (b) accept the string-level simplification (drop inline emphasis from the refactored pages) for Phase 37 and re-add it in Phase 39 when the markdown renderer exists. Recommendation: **(b) unless Dan explicitly wants to preserve the current visual emphasis**. This is a Discuss-Phase question.

**Warning signs:** A code review comment says "can we just use `v-html` here?" — push back.

### Pitfall 3: Storybook Stories Break Silently

**What goes wrong:** Every refactored page has a `.stories.ts` sibling. If the story imports the page component without stubbing the new content imports, Storybook might fail to build — or worse, render with empty strings (because the content module was mocked in the story).

**Why it happens:** The existing story files mount pages expecting the content to be hardcoded. After the refactor, the content lives in `src/content/*.ts` and Vite-Storybook bundler will resolve it — usually fine, but fragile if the story has any mock for `@/content/*`.

**How to avoid:**
- After the refactor, run `npm run build-storybook` and visually spot-check each affected story in a running `npm run storybook`.
- Add a step in Wave 3 (phase gate) that runs `npm run build-storybook` and fails the phase if the Storybook build exits non-zero.
- Do NOT add content mocks to story files — the content modules are tiny and should render directly in stories without mocking.

**Warning signs:** Storybook displays a page with blank sections, or story build logs include `Cannot find module '@/content/home'`.

### Pitfall 4: CaseFilesPage Project Directory Is Structured, Not Prose

**What goes wrong:** The "hardcoded prose" bucket gets a 35-row table shoved into it as a giant string, losing its structure.

**Why it happens:** CaseFilesPage.vue has an inline `<!-- Project Directory — structured prose table, kept inline per plan decision -->` comment. The comment says "structured prose table." Some past planner thought of it as prose. It is not — it's 7 industry groups × ~5 rows × 4 columns of structured data that happens to be rendered as `<table>`.

**How to avoid:**
- Decision point in Phase 37 PLAN.md: is the Project Directory (a) part of `src/content/caseFiles.ts` as a typed `projectDirectory: ProjectDirectoryGroup[]` structure, or (b) promoted to `src/data/projectDirectory.json` + a thin loader `src/data/projectDirectory.ts`?
- **Recommendation: (a) in `src/content/caseFiles.ts`** for Phase 37, keeping it as typed TS. Rationale: promoting to JSON would require a new data loader (and a new LOAD-01-constrained test), which expands Phase 37 scope. Keeping it in `src/content/` matches the "content, not data" distinction (this IS page content — it just happens to be structured). Phase 38's extractor will iterate the array the same way regardless.
- **Alternative: (b) in `src/data/`** if Dan prefers a stricter content/data split. Add to PLAN.md as a discussion question.

**Warning signs:** PLAN.md has a task called "stringify project directory table into markdown." Wrong direction.

### Pitfall 5: Running Browser Tests in CI Without Chromium

**What goes wrong:** CI worker has no Playwright chromium binary; browser tests fail with "Executable doesn't exist at /path/to/chromium".

**Why it happens:** Locally, chromium was downloaded by `npx playwright install`. CI workers won't have it unless a step runs `npx playwright install --with-deps chromium`.

**How to avoid:**
- Phase 37 may not need to touch CI, but the planner should verify whether the project's CI (if any) runs `npm run test` or `npm run test:browser`. Check `.github/workflows/*`, `wrangler.toml`, or any CI config.
- If CI exists and runs browser tests, add `npx playwright install --with-deps chromium` to the CI install step. If CI only runs `npm run test:unit`, this isn't a Phase 37 concern.
- Current reality: [VERIFIED] — `package.json` has `test`, `test:unit`, `test:browser` scripts. CI may or may not call them. No `.github/` directory at repo root was checked.

**Warning signs:** Green locally, red in CI, error message contains `playwright` and `Executable doesn't exist`.

### Pitfall 6: Refactoring `PhilosophyPage.vue` Changes the Blockquote Structure

**What goes wrong:** The moral-spine section has a `<blockquote>` with `<cite>`. Moving the quote into `src/content/philosophy.ts` as a plain string loses the `cite` attribution.

**Why it happens:** Inline `<blockquote>` markup requires both text and attribution; a string array cannot represent it.

**How to avoid:**
- Add a `blockquote: { text: string; cite: string }` field to `src/content/philosophy.ts`.
- Keep the `<blockquote>`, `<cite>`, `<em>` tags in the template; bind their content to the imported fields.

**Warning signs:** After refactor, the attributed quote loses its visual distinction (italic, indent, attribution line).

### Pitfall 7: The Browser Tests Take Too Long Locally

**What goes wrong:** Chromium startup + 7 page renders + assertion waits takes 20-40 seconds. Developers skip `npm run test` because it's slow.

**Why it happens:** Vitest's browser project cold-starts chromium per run.

**How to avoid:**
- Keep browser tests in a **separate** Vitest project (already done — `name: 'browser'` in vitest.config.ts).
- Dev loop uses `npm run test:unit` (fast happy-dom, existing 127 tests) for iterative work.
- CI and pre-commit hooks run `npm run test` (both projects).
- Phase 37 browser tests should cover 1 critical assertion per page (not 10) — keep the runtime budget lean.

**Warning signs:** Developers commenting "browser tests are too slow" within the first week after merge.

---

## Code Examples

### Example 1: Thin-Loader Invariant Enforcement Test (REQ LOAD-01)

```typescript
// src/data/__tests__/loaders.thin.test.ts
import { describe, it, expect } from 'vitest'
import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOADERS_DIR = join(__dirname, '..')

// Allowed top-level constructs in a thin loader:
// 1. `import type { ... }` statements
// 2. `import <name> from './json/*.json'` statements
// 3. `export type { ... }` re-exports
// 4. `export const <name>: <Type> = <data>[ as <Type>]` — single line, no method calls
// 5. `export const <name> = [...] as const satisfies ...` — for literal const registries (e.g. faq.ts category list)
const FORBIDDEN_TOKENS: Array<{ token: RegExp; reason: string }> = [
  { token: /\.filter\s*\(/, reason: 'loaders may not filter data' },
  { token: /\.map\s*\(/, reason: 'loaders may not map data' },
  { token: /\.sort\s*\(/, reason: 'loaders may not sort data' },
  { token: /\.reduce\s*\(/, reason: 'loaders may not reduce data' },
  { token: /\bcomputed\s*\(/, reason: 'loaders may not expose computed refs' },
  { token: /\bref\s*\(/, reason: 'loaders may not expose refs' },
  { token: /\breactive\s*\(/, reason: 'loaders may not expose reactive()' },
]

describe('LOAD-01: thin-loader invariant', () => {
  it('every src/data/*.ts loader is thin (no sort/filter/map/computed/ref)', async () => {
    const files = await readdir(LOADERS_DIR)
    const loaders = files.filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))

    expect(loaders.length).toBeGreaterThan(0)

    const violations: string[] = []
    for (const loader of loaders) {
      const source = await readFile(join(LOADERS_DIR, loader), 'utf8')
      for (const { token, reason } of FORBIDDEN_TOKENS) {
        if (token.test(source)) {
          violations.push(`${loader}: ${reason} (matched ${token.source})`)
        }
      }
    }

    expect(violations, `Loader violations:\n${violations.join('\n')}`).toEqual([])
  })

  it('every src/data/*.ts loader imports its JSON sibling', async () => {
    const files = await readdir(LOADERS_DIR)
    const loaders = files
      .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))
      // techPills is allowed to import plain array data without type aliasing
      .filter(f => f !== 'techPills.ts' ? true : true)

    for (const loader of loaders) {
      const source = await readFile(join(LOADERS_DIR, loader), 'utf8')
      expect(source, `${loader} should import from ./json/*`).toMatch(
        /import\s+\w+\s+from\s+['"]\.\/json\/[\w.-]+\.json['"]/,
      )
    }
  })
})
```

**Why this shape:** Regex-based source greps are brittle in general, but these patterns are narrow (method calls on known Array prototype methods) and the loaders are small (all under 20 lines). The test catches the 90%-case drift without a full AST walker. If a loader legitimately needs a helper in the future, the PLAN.md amendment process requires a justification that either (a) removes the loader from `src/data/` or (b) updates this test.

[VERIFIED: all 10 current loaders pass this test as of 2026-04-10 — see §D below.]

### Example 2: Browser Regression Test Template

```typescript
// src/pages/HomePage.browser.test.ts
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'

import HomePage from './HomePage.vue'
import { intro, teaserQuotes, featuredProjectsHeading, fieldReportsHeading } from '@/content/home'

test('HomePage: intro heading and body from content module are visible', async () => {
  const screen = render(HomePage, {
    global: { stubs: { 'router-link': RouterLinkStub } },
  })
  await expect.element(screen.getByRole('heading', { name: intro.heading })).toBeVisible()
  await expect.element(screen.getByText(intro.body)).toBeVisible()
})

test('HomePage: section headings from content module render as h2', async () => {
  const screen = render(HomePage, {
    global: { stubs: { 'router-link': RouterLinkStub } },
  })
  await expect.element(screen.getByRole('heading', { name: featuredProjectsHeading.title })).toBeVisible()
  await expect.element(screen.getByRole('heading', { name: fieldReportsHeading.title })).toBeVisible()
})

test('HomePage: both teaser quotes from content module render inside testimonial components', async () => {
  const screen = render(HomePage, {
    global: { stubs: { 'router-link': RouterLinkStub } },
  })
  for (const q of teaserQuotes) {
    await expect.element(screen.getByText(q.quote)).toBeVisible()
  }
})
```

**Note on `RouterLinkStub`:** `vitest-browser-vue` 2.1.0 uses `@vue/test-utils` under the hood, so the stub pattern carries over. If the project prefers a real Vue Router instance, create one inline (`createRouter({ history: createMemoryHistory(), routes: [] })`) and pass it in `global.plugins`. The stub is simpler.

### Example 3: PhilosophyPage Content Module with Blockquote

```typescript
// src/content/philosophy.ts
export interface PhilosophyQuote {
  text: string
  cite: string  // "Moe Howard, Healthy, Wealthy and Dumb, 1938"
}

export const designThinking = {
  heading: 'This Is What Design Thinking Looks Like When It\'s a Personality, Not a Process',
  paragraphs: [
    'Design thinking was invented to teach people who don\'t naturally do certain things to do them systematically. Empathize before you solve. Define the real problem before you build. Iterate through failure without shame.',
    'I didn\'t learn this from a framework. I absorbed it from air crash investigators, speedrunners, and a Three Stooges short from 1938.',
    'The result is the same disposition — but without the scaffolding, because the scaffolding was never load-bearing for me. The fish doesn\'t have a water strategy.',
    'What I do have is a three-step pattern that has repeated across every significant project in 28 years:',
  ],
}

export const moralSpine = {
  heading: 'The Moral Spine',
  intro: 'The three-step pattern is how I work. This is why:',
  quote: {
    text: 'You want to cheat, cheat fair — anything I hate is a crookin\' crook.',
    cite: 'Moe Howard, Healthy, Wealthy and Dumb, 1938',
  } satisfies PhilosophyQuote,
  paragraphs: [
    'Every tool I build is a cheat. Automating a manual process is cheating. Jumping to any course state in seconds instead of clicking through every section is cheating. Building a framework that eliminates a class of problem is cheating.',
    'But cheating fair means the output is proper, documented, and maintainable. It means you could hand it to another engineer and they could understand, extend, and improve it. Hoarding a clever solution — keeping the elegant shortcut to yourself — is the real dishonesty. The knowledge isn\'t yours. It came from everyone who documented the problem before you, and it belongs to everyone who\'ll encounter it after you.',
    'Clever shortcuts and corner-cutting look identical from the outside. The difference is in the craftsmanship.',
  ],
}

export const influencesHeading = {
  heading: 'Five Sources That Shaped the Method',
  intro: 'These aren\'t abstract inspirations. They\'re specific sources I can point to and say: this changed how I solve problems.',
}

export const brandElementsHeading = {
  heading: 'The Six Brand Elements',
  intro: 'Six patterns extracted from 28 years of actual work — not marketing slogans, but recurring themes from real projects.',
}

export const colleagueQuotes: Array<{ quote: string; cite?: string; context?: string; variant?: 'secondary' }> = [
  {
    quote: 'Thank you so much for Dan for putting time into thinking this through and writing it up.',
    cite: 'Program Manager, Microsoft Account',
    context: 'GP Strategies — on a SCORM architecture analysis document',
  },
  {
    quote: 'Dan, thank you for being such a team player with the GP team and the client, and thank you for your incredible knowledge and expertise.',
    cite: 'Account Manager, GP Strategies',
    context: 'Entergy engagement — on cross-team collaboration',
    variant: 'secondary',
  },
]

export const closingLine = 'Pattern 158: I cheat, but I cheat fair.'
```

---

## A. File Inventory (Exhaustive)

[VERIFIED via direct read of each file on 2026-04-10]

### A1. Pages with Page-Level Hardcoded Prose (7 — matches requirement count)

| File | Prose Volume | Content | SFC-ID |
|------|--------------|---------|--------|
| `src/pages/HomePage.vue` (83 lines) | Small | 1 intro heading + 1 intro paragraph + 2 section headings + 1 subtitle + 2 teaser quotes (`teaserQuotes` const in script setup) | SFC-01 |
| `src/pages/PhilosophyPage.vue` (87 lines) | Medium | 2 section headings + 4 paragraphs of design-thinking prose + 4 paragraphs + 1 blockquote (with cite) of moral-spine prose + 1 "Five Sources" heading+intro + 1 "Six Brand Elements" heading+intro + 1 "What Colleagues Say" block with 2 testimonials + 1 closing italic line. Plus imports from 3 delegated section components (each with its own prose). | SFC-02 |
| `src/pages/FaqPage.vue` (151 lines; prose is concentrated in last 15) | Tiny | 1 "What Colleagues Say" block with 2 testimonial quotes. FAQ list and filter bar already fully data-driven from `@/data/faq`. | SFC-03 |
| `src/pages/ContactPage.vue` (42 lines) | Small at page level | `HeroMinimal` subtitle string + 2 testimonial quotes. Almost everything is delegated to 5 child section components. | SFC-04 |
| `src/pages/AccessibilityPage.vue` (144 lines) | **Largest** | 9 sections — Commitment / Standards / Testing methodology (`<dl>` with 4 terms) / Current Status / Browsers / Features / Known Issues / Feedback / Technical Specs. All prose, lists, and a definition list. No delegation. | SFC-05 |
| `src/pages/TechnologiesPage.vue` (53 lines) | Tiny | `HeroMinimal` subtitle + 1 hero-intro paragraph. Tech categories and cards already fully data-driven from `@/data/technologies`. | SFC-06 |
| `src/pages/CaseFilesPage.vue` (149 lines) | **Mixed — prose + structured tabular data** | `HeroMinimal` subtitle + classification line + 2 section subtitles + **inline Project Directory**: 7 industry groups × ~5 rows × 4 columns (~35 rows total) of client/project/dates/role data. The inline comment reads "structured prose table, kept inline per plan decision." The exhibit cards themselves are data-driven from `@/data/exhibits`; the `exhibits.filter(...)` computation in script setup is NOT a thin-loader violation (it lives in a page, not a loader). | SFC-07 |

**Out-of-scope pages (no Phase 37 work):**
- `src/pages/NotFoundPage.vue` — 404, excluded from site-map per SUMMARY.md §1
- `src/pages/ReviewPage.vue` — `/review` internal, excluded from site-map
- `src/pages/PersonnelDiagPage.vue` — `/diag/personnel` internal, excluded from site-map
- `src/pages/ExhibitDetailPage.vue` — 100% data-driven from `@/data/exhibits` (confirmed in v7.0 ARCHITECTURE.md §3 "Unchanged"). Zero hardcoded prose to extract.

### A2. Components with Hardcoded Prose (8 — pulled in by SFC-02 and SFC-04)

| File | Owning Requirement | Prose Content |
|------|-------------------|---------------|
| `src/components/Pattern158OriginSection.vue` | SFC-02 | 1 heading "Pattern 158" + 5 paragraphs (the Myst origin story), with inline `<em>`, `<strong>` |
| `src/components/HowIWorkSection.vue` | SFC-02 | 1 `<ol>` with 3 methodology steps, each with `<h3>` heading and 2-3 paragraphs (with inline `<strong>`). ~14 paragraph-equivalent units. |
| `src/components/AiClaritySection.vue` | SFC-02 | 1 heading "On AI and This Site" + 1 intro + ~10 paragraphs with heavy inline markup (`<em>`, `<strong>`, `<blockquote>`-equivalent via `methodology-note` class) |
| `src/components/RoleFitSection.vue` | SFC-04 | 1 heading + 1 intro + two `<ul>`s ("I'm looking for:" — 3 structured items with `<strong>` role names and descriptions; "I'm not looking for:" — 5 bullet items) |
| `src/components/CompanyFitSection.vue` | SFC-04 | 1 heading + 4 paragraphs each leading with a bolded thesis (Product company, Mid-size, Late-stage startup, Domain complexity) |
| `src/components/CultureFitSection.vue` | SFC-04 | 1 heading + 6 `.culture-item` blocks each with a bolded lead and a paragraph (Remote-first, Autonomy, Craftsmanship, Evidence over credentials, No leetcode, Rising tide) |
| `src/components/ContactMethods.vue` | SFC-04 | 1 heading + 1 intro + 4 contact links (email / LinkedIn / GitHub / Case Files — URLs + labels) + 1 closing guidance paragraph. **Note:** LinkedIn and GitHub URLs (`linkedin.com/in/pattern158`, `github.com/novakda`) are hardcoded. Consider adding `contactLinks: ContactLink[]` to the content module. |
| `src/components/CompensationTable.vue` | SFC-04 | 1 heading + structured 6-row `<table>` with 2 columns (Employment / Base salary / Floor / Contract rate / Location / Timezone + values). **This is structured data, not prose** — analogous to the CaseFilesPage Project Directory decision. |

**Components that are already data-driven (NO Phase 37 work):**
- `HomeHero.vue`, `HeroMinimal.vue`, `NavBar.vue`, `FooterBar.vue`, `ThemeToggle.vue`, `TestimonialQuote.vue`, `ExhibitCard.vue`, `FindingCard.vue`, `StatItem.vue`, `StatsSection.vue`, `TechCard.vue`, `TechTags.vue`, `SpecialtyCard.vue`, `BrandElement.vue`, `InfluenceArticle.vue`, `InfluencesList.vue`, `MethodologyStep.vue`, `PatternVisual.vue`, `ExpertiseBadge.vue`, `CtaButtons.vue`, `FaqAccordionItem.vue`, `FaqFilterBar.vue`, `exhibit/InvestigationReportLayout.vue`, `exhibit/EngineeringBriefLayout.vue` — all 24 are purely prop-driven or consume `@/data/*`.

**Total files touched by Phase 37:**
- 7 pages modified
- 8 components modified
- **15 existing files refactored**
- 7 new `src/content/*.ts` files (one per page)
- 8 new `src/content/sections/*.ts` files (one per prose component)
- 7 new `src/pages/*.browser.test.ts` files
- 1 new `src/data/__tests__/loaders.thin.test.ts` file
- **23 new files created**
- **Total: 38 files touched**

The "7 files" claim in the phase description is roughly half of reality. **Planner must budget accordingly.**

---

## B. Playwright Install Status (critical for planning)

[VERIFIED: 2026-04-10]

| Item | Status | Details |
|------|--------|---------|
| `playwright` package | Installed | v1.59.1 (via transitive; `package.json` declares `^1.58.2`) |
| `@vitest/browser-playwright` | Installed | v4.1.2, declared in devDeps |
| `vitest-browser-vue` | Installed | v2.1.0, declared in devDeps |
| `vitest` browser project | Configured | `vitest.config.ts` lines 25-38 declares `name: 'browser'` with `include: ['src/**/*.browser.test.ts']`, `browser.enabled: true`, `provider: playwright()`, `instances: [{ browser: 'chromium' }]` |
| Chromium binaries | Downloaded | `~/.cache/ms-playwright/chromium-1200`, `chromium-1208`, `chromium-1217` (three versions cached from prior work). Firefox and WebKit also present. |
| Existing `.browser.test.ts` files | **Zero** | `src/**/*.browser.test.ts` returns no matches |
| `npm run test:browser` script | Declared | `package.json` line 14: `"test:browser": "vitest run --project browser"` |

**Conclusion:** The only thing Phase 37 needs to do for browser testing is **write the test files**. No install, no config, no binary download. This significantly reduces Phase 37 risk.

**One open question:** Does CI (if any exists) run `npm run test` or just `npm run test:unit`? If the former, CI workers need `npx playwright install --with-deps chromium` — existing CI may already handle this. **Recommendation:** planner should add a task to Wave 3 (phase gate) that verifies CI behavior or explicitly documents "browser tests run locally and are excluded from CI" in PLAN.md.

---

## C. Recommended Content Module Shape Per Page (concrete)

### C1. `src/content/home.ts`

Named exports: `intro`, `featuredProjectsHeading`, `fieldReportsHeading`, `teaserQuotes`. See Code Example 1 in Pattern 1 above.

### C2. `src/content/philosophy.ts`

Named exports: `designThinking`, `moralSpine` (with `quote: { text, cite }`), `influencesHeading`, `brandElementsHeading`, `colleagueQuotes`, `closingLine`. See Code Example 3 above.

### C3. `src/content/faq.ts`

**Note:** Do NOT collide with `src/data/faq.ts`. Use a different name for what's exported, or import-path-disambiguate in consumers. Named exports: `colleagueQuotes` (the 2 testimonials).

### C4. `src/content/contact.ts`

Named exports: `heroSubtitle`, `colleagueQuotes`. Page-level only — child components have their own files under `src/content/sections/`.

### C5. `src/content/accessibility.ts`

Named exports: `commitment`, `standards`, `testing` (with `methods: DefinitionListItem[]`), `currentStatus`, `browsers`, `features`, `knownIssues`, `feedback`, `technicalSpecs`. Nine objects matching the 9 sections in the page. Each has `{ heading, paragraphs?, list?, definitionList? }`.

The definition list in the Testing section is structured — use a discriminated shape:

```typescript
export interface DefinitionListItem {
  term: string
  description: string
}

export const testing = {
  heading: 'Accessibility Testing',
  intro: 'We employ multiple testing methodologies to ensure accessibility compliance:',
  methods: [
    { term: 'Automated Testing', description: 'axe-core automated accessibility engine...' },
    { term: 'Manual Testing', description: 'Keyboard navigation testing...' },
    { term: 'Cross-Browser Validation', description: 'Functional testing on Chromium...' },
    { term: 'Viewport Testing', description: 'Responsive design validated...' },
  ] satisfies DefinitionListItem[],
}
```

### C6. `src/content/caseFiles.ts` — Project Directory Decision

**The question:** Is the Project Directory prose or data?

**My recommendation:** Treat it as **structured content, stored in `src/content/caseFiles.ts`** (not `src/data/`).

Rationale:
- `src/data/` is for JSON-backed records with discriminated unions (exhibits, FAQ items, etc.). Adding a new JSON file + thin loader expands Phase 37 scope into a parallel "data normalization" mini-phase, which fights the phase's single-purpose mandate.
- `src/content/` is for page content. The Project Directory IS page content, it just happens to be tabular.
- The Phase 39 extractor will iterate `projectDirectory: IndustryGroup[]` the same way regardless of source location.
- Future maintenance is easier when all "CaseFiles page content" lives in one file.

**Schema:**

```typescript
// src/content/caseFiles.ts
export interface ProjectDirectoryEntry {
  client: string
  project: string
  dates: string   // "2018" or "2015–2018"
  role: string
}

export interface ProjectDirectoryGroup {
  industry: string
  entries: ProjectDirectoryEntry[]
}

export const heroClassification = 'Corroborated · Primary Sources · 2005–2022'

export const sectionSubtitles = {
  investigationReports: 'Methodology-driven case studies',
  engineeringBriefs: 'Constraints navigated, results delivered',
}

export const projectDirectory: ProjectDirectoryGroup[] = [
  {
    industry: 'Financial Services',
    entries: [
      { client: 'Bank of America', project: 'Lectora Course LMS Troubleshooting', dates: '2018', role: 'LMS Troubleshooting Lead' },
      { client: 'SunTrust Bank', project: 'AWARE Onboarding & eLearning Platform', dates: '2015–2018', role: 'Lead Technical Engineer' },
      // ...
    ],
  },
  // 6 more groups
]

export const projectDirectoryHeading = {
  title: 'Complete Project Directory',
  subtitle: 'All documented client engagements organized by industry',
}
```

**Open question for Discuss-Phase:** Is this the right home, or should it become `src/data/projectDirectory.json`? The recommendation defers to discuss-phase.

### C7. `src/content/technologies.ts`

Named exports: `heroSubtitle`, `heroIntro`. Two strings — this is the smallest content file.

### C8. `src/content/sections/*.ts`

One file per prose-bearing child component. All use the same shape pattern: typed interface + named exports.

---

## D. Thin-Loader Invariant — Current State Audit

[VERIFIED: read all 10 loader files on 2026-04-10]

| Loader | Lines | Pattern | Verdict |
|--------|-------|---------|---------|
| `src/data/brandElements.ts` | 5 | `import type` + `import JSON` + `export type { ... }` + `export const = data` | ✅ Thin |
| `src/data/exhibits.ts` | 5 | Same + `as Exhibit[]` assertion | ✅ Thin |
| `src/data/faq.ts` | 19 | Imports JSON + **declares `faqCategories` const as literal-array `as const satisfies`** + exports `faqItems` | ⚠️ Edge case — see below |
| `src/data/findings.ts` | 5 | Same pattern as exhibits.ts | ✅ Thin |
| `src/data/influences.ts` | 5 | Same | ✅ Thin |
| `src/data/methodologySteps.ts` | 5 | Same | ✅ Thin |
| `src/data/philosophyInfluences.ts` | 5 | Same | ✅ Thin |
| `src/data/specialties.ts` | 5 | Same | ✅ Thin |
| `src/data/stats.ts` | 5 | Same | ✅ Thin |
| `src/data/techPills.ts` | 3 | Import JSON + `export const: string[] = data` | ✅ Thin |
| `src/data/technologies.ts` | 5 | Same as exhibits.ts | ✅ Thin |

**`faq.ts` edge case:** Declares a `faqCategories` const as an inline literal array with `as const satisfies readonly FaqCategory[]`. This is NOT a transform of JSON data — it is a **literal registry** that couldn't be expressed in JSON (JSON can't encode TypeScript literal types for const narrowing). PROJECT.md Key Decisions table documents this: "`faqCategories` kept as `as const` in TypeScript — JSON cannot express literal type narrowing".

**Recommendation for LOAD-01:** The thin-loader invariant must explicitly allow literal `as const satisfies` registries. Rephrase the rule:

> **Thin-loader invariant (LOAD-01, revised wording):** `src/data/*.ts` loaders may only contain:
> 1. `import type { ... } from '@/types'` / `import type { ... } from '@/types/...'` statements
> 2. `import <name> from './json/*.json'` statements
> 3. `export type { ... }` re-exports
> 4. `export const <name>: <Type> = <jsonData>[ as <Type>]` single-line assignments from imported JSON
> 5. `export const <name> = [...literal...] as const satisfies <Type>` compile-time-only literal registries
>
> Loaders MAY NOT call `.sort()`, `.filter()`, `.map()`, `.reduce()`, `computed()`, `ref()`, `reactive()`, or any data-transforming function. Loaders MAY NOT define classes, functions, or exported helpers.

The test in Example 1 enforces points 4 and 5 via forbidden-token grep. It does NOT statically parse the AST — good enough for a 10-file surface area.

**Net result:** Zero existing violations. LOAD-01 is purely enforcement scaffolding. Phase 37 only adds the test, no loader remediation required.

---

## E. Wave Structure Recommendation

> This is a planner-input recommendation, not a locked decision.

### Wave 1 — Content module creation + page refactors (parallelizable)

**Parallelism:** HIGH. Each page's extraction is independent of every other page's extraction. Two wave lanes:

**Wave 1a — Standalone pages (parallel):**
- SFC-01: HomePage
- SFC-03: FaqPage
- SFC-05: AccessibilityPage
- SFC-06: TechnologiesPage
- SFC-07: CaseFilesPage

**Wave 1b — Pages with delegated components (serial within lane, parallel across lanes):**
- SFC-02 lane: Pattern158OriginSection → HowIWorkSection → AiClaritySection → PhilosophyPage
- SFC-04 lane: RoleFitSection → CompanyFitSection → CultureFitSection → ContactMethods → CompensationTable → ContactPage

Rationale for serial ordering within Wave 1b: extracting a child component first means the parent page's subsequent extraction only has to handle the remaining page-level strings, not the component's internal strings. It also means each component refactor can be validated independently by the existing 127 happy-dom unit tests before the page is touched.

**Wave 1 exit gate:** All 127 existing unit tests still pass. No new tests yet.

### Wave 2 — Browser regression tests (parallelizable)

**Parallelism:** HIGH. Each `.browser.test.ts` is independent.

- Add `src/pages/HomePage.browser.test.ts`
- Add `src/pages/PhilosophyPage.browser.test.ts`
- Add `src/pages/FaqPage.browser.test.ts`
- Add `src/pages/ContactPage.browser.test.ts`
- Add `src/pages/AccessibilityPage.browser.test.ts`
- Add `src/pages/TechnologiesPage.browser.test.ts`
- Add `src/pages/CaseFilesPage.browser.test.ts`

Each file: 1-3 `test()` blocks, visible-text assertions, uses `RouterLinkStub` pattern.

**Wave 2 exit gate:** `npm run test:browser` passes all 7 new files. Each test runs in under 3 seconds (budget: 21s for the browser project).

### Wave 3 — LOAD-01 enforcement + phase gate

**Serial.** One task:
- Add `src/data/__tests__/loaders.thin.test.ts` (per Code Example 1).

Then the phase gate:
- `npm run test` (both projects) — 127+ unit tests + 7+ browser tests green.
- `npm run build` — clean vue-tsc + vite build.
- `npm run build-storybook` — clean Storybook build (catches story regressions).
- Manual: load the dev server (`npm run dev`) and spot-check each refactored page visually in a browser. (Optional if test coverage is high enough, but cheap insurance for a refactor phase.)

**Wave 3 exit gate = phase complete.**

**Alternative ordering:** Wave 0 could add the LOAD-01 test FIRST as a pre-flight check to confirm the baseline is clean before the refactor. Recommendation: put it in Wave 3 to keep Wave 1 focused on the content moves. Either ordering is valid; planner's call.

---

## F. Risk: Prose Computed from Props/Slots/Reactive State

**Question from the phase prompt:** "any prose currently computed from props, slots, or reactive state that CAN'T simply be moved to a static `.ts` module?"

[VERIFIED by direct inspection of all 7 pages and 8 prose-bearing components]

**Answer: No — with three caveats:**

1. **`FaqPage.vue` has `filteredItems` and `categoryCounts` `computed()` refs** — these operate on `faqItems` and `faqCategories` from `@/data/faq`, not on prose. The prose being extracted (the "What Colleagues Say" testimonial block) is static.

2. **`CaseFilesPage.vue` has `investigationReports` and `engineeringBriefs` module-level `.filter()` calls** — these operate on `exhibits` from `@/data/exhibits`. Module-level, not reactive, not prose. No issue for Phase 37.

3. **`HomePage.vue` has a `teaserQuotes` const in `<script setup>`** — this IS the prose being extracted. It's already a const, no reactivity. Moving it to `src/content/home.ts` is a trivial cut-and-paste.

**No slots, no dynamic components, no v-if branches around prose, no i18n, no `useI18n()`.** All prose is render-stable text that can be moved to plain TS modules.

**One genuine complication (not a blocker):** `AccessibilityPage.vue` section "Current Status" contains a date (`Last Verified: February 21, 2026`). This is content, not metadata — it should go in `src/content/accessibility.ts` as a string. It will go stale. That is an existing problem; Phase 37 should not try to fix it.

---

## Environment Availability

> Phase 37 uses only tools already in the project. This section is a courtesy audit.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | All Vitest runs | ✓ | Project uses Node 24 per STACK.md | — |
| pnpm / npm | Script execution | ✓ | `package-lock.json` absent; `pnpm-lock.yaml` present | — |
| `playwright` | Browser regression tests | ✓ | 1.59.1 installed | — |
| Playwright chromium binary | Browser tests at runtime | ✓ | Cached at `~/.cache/ms-playwright/chromium-1217` (and 1200, 1208) | — |
| `@vitest/browser-playwright` | Vitest browser provider | ✓ | 4.1.2 installed | — |
| `vitest-browser-vue` | `render()` helper | ✓ | 2.1.0 installed | — |
| `vitest` | Test runner | ✓ | ^4.1.0 declared | — |
| `vue-tsc` | Type-check the phase's changes | ✓ | ^2.2.0 declared | — |
| TypeScript | Content module type-checking | ✓ | ~5.7.0 declared | — |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None.

Phase 37 is fully executable in the current environment.

---

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json`. This section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.x (unit + browser projects configured in `vitest.config.ts`) |
| Config file | `vitest.config.ts` (existing, no changes needed) |
| Quick run command | `npm run test:unit` — runs 127 existing unit tests against happy-dom, ~1 second total |
| Browser run command | `npm run test:browser` — runs `.browser.test.ts` files via Playwright chromium |
| Full suite command | `npm run test` — both projects (`vitest run`) |
| Phase gate commands | `npm run test && npm run build && npm run build-storybook` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| **SFC-01** | HomePage prose renders from `src/content/home.ts` | browser | `npx vitest run --project browser src/pages/HomePage.browser.test.ts` | ❌ Wave 2 |
| **SFC-01** | HomePage component mounts with no console errors (existing unit) | unit (happy-dom) | `npx vitest run --project unit src/pages/HomePage.stories.ts` — indirect via Storybook's test hookup OR direct if a unit test is added | ⚠️ Currently no unit test for HomePage. Existing coverage is Storybook stories only. Phase 37 should NOT add a unit test for HomePage (browser test covers it). |
| **SFC-02** | PhilosophyPage prose + section-component prose renders correctly | browser | `npx vitest run --project browser src/pages/PhilosophyPage.browser.test.ts` | ❌ Wave 2 |
| **SFC-03** | FaqPage testimonial block renders from content module | browser | `npx vitest run --project browser src/pages/FaqPage.browser.test.ts` | ❌ Wave 2 |
| **SFC-03** | FaqPage filter/accordion still works (existing) | unit | `npx vitest run --project unit src/components/FaqAccordionItem.test.ts src/components/FaqFilterBar.test.ts` | ✅ Already exists (13 + ?) |
| **SFC-04** | ContactPage + 5 section components render prose from content modules | browser | `npx vitest run --project browser src/pages/ContactPage.browser.test.ts` | ❌ Wave 2 |
| **SFC-05** | AccessibilityPage all 9 sections render correctly | browser | `npx vitest run --project browser src/pages/AccessibilityPage.browser.test.ts` | ❌ Wave 2 |
| **SFC-06** | TechnologiesPage hero intro renders from content module | browser | `npx vitest run --project browser src/pages/TechnologiesPage.browser.test.ts` | ❌ Wave 2 |
| **SFC-07** | CaseFilesPage renders all 15 exhibits (existing) | unit | `npx vitest run --project unit src/pages/CaseFilesPage.test.ts` | ✅ Already exists (6 tests) |
| **SFC-07** | CaseFilesPage Project Directory renders all 7 industry groups from content module | browser | `npx vitest run --project browser src/pages/CaseFilesPage.browser.test.ts` | ❌ Wave 2 |
| **LOAD-01** | All `src/data/*.ts` loaders are thin (no sort/filter/map/computed) | unit | `npx vitest run --project unit src/data/__tests__/loaders.thin.test.ts` | ❌ Wave 3 |
| **LOAD-01** | Every `src/data/*.ts` loader imports its JSON sibling | unit | (same file) | ❌ Wave 3 |

### Sampling Rate

- **Per task commit (iterative loop):** `npm run test:unit` (~1 second, 127 tests)
- **Per wave merge:** `npm run test` (both projects, ~10-30 seconds with browser startup)
- **Phase gate (pre-merge to main):** `npm run test && npm run build && npm run build-storybook`
- **Manual smoke (Wave 3):** `npm run dev` and visually spot-check each of the 7 refactored pages in both light and dark themes

### Wave 0 Gaps

> "Wave 0" here means "tests that must exist before Wave 1 starts." This phase has no Wave 0 gaps — existing test infrastructure is sufficient.

- ✅ Vitest unit project — exists, passing 127 tests
- ✅ Vitest browser project — exists, configured, zero tests (will fill in Wave 2)
- ✅ Playwright chromium — cached locally
- ✅ Shared fixtures — existing `RouterLinkStub` pattern from `@vue/test-utils`
- ❌ **None.** All infrastructure ready. Wave 1 can begin immediately.

**Note for the planner:** If browser tests prove unexpectedly slow or flaky, the fallback is to skip them for fast-iteration phases and rely solely on the 127 happy-dom unit tests + manual Storybook verification. The phase prompt explicitly requires "Playwright regression per page" so this fallback should only be invoked if a technical blocker appears.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@testing-library/vue` for component tests | `vitest-browser-vue` + Vitest Browser Mode | Vitest 4.0 (late 2024/2025) | Real chromium instead of jsdom; same testing-library API; faster cold start via Vite bundling |
| Puppeteer for Vue E2E | Playwright (via `@vitest/browser-playwright`) | 2024 onward | Multi-browser support; first-class Vitest integration |
| `ts-node` for Node script execution | `tsx` (Phase 38+, not Phase 37) | 2024 onward | Native ESM + esbuild speed |

**Deprecated/outdated:**
- `@playwright/test` standalone runner — still widely used, but duplicative when `@vitest/browser-playwright` already provides browser mode through the project's existing Vitest setup. Adding `@playwright/test` would fragment the test surface.
- DOM snapshots in browser tests — testing-library principles strongly discourage them.
- `vue-tsc --noEmit` called separately — replaced by `vue-tsc -b` incremental mode (already in the project's `build` script).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `vitest-browser-vue@2.1.0` pairs correctly with `@vue/test-utils`'s `RouterLinkStub` pattern | Pattern 4 | MEDIUM — if incompatible, the planner must substitute an inline-created Vue Router instance or a custom stub. Workaround is simple; no blockers. |
| A2 | Phase 37 should NOT touch CI config | Pitfall 5, Env Availability | LOW — if CI doesn't currently run browser tests, Phase 37 is safe. If CI does run browser tests, `playwright install` must be verified. Planner should search `.github/workflows/**` and `.gitlab-ci.yml` during Wave 0. |
| A3 | `faqCategories` `as const satisfies` literal should be allowed by the thin-loader invariant | §D, Code Example 1 | LOW — this is a rewording of LOAD-01, not a change. The PROJECT.md Key Decisions table already blesses the pattern. Planner should include the revised wording in PLAN.md. |
| A4 | CaseFilesPage Project Directory belongs in `src/content/caseFiles.ts` rather than promoted to `src/data/projectDirectory.json` | Pitfall 4, §C6 | MEDIUM — reversible, but affects Phase 37 scope. Recommend Discuss-Phase question. |
| A5 | Plain-string paragraphs (not structured `{kind, value}` segments) are the right shape for multi-paragraph prose, accepting the trade-off of losing inline `<strong>`/`<em>` emphasis in rare cases | Pattern 2 | MEDIUM — Dan may disagree for aesthetic reasons. Recommend Discuss-Phase question: "Are you OK with losing inline bold/italic in the refactored pages if it simplifies the content modules, or do you want per-paragraph segment typing?" |
| A6 | Chromium binaries cached at `~/.cache/ms-playwright/chromium-*` are the correct version for `playwright@1.59.1` | Environment Availability | LOW — three versions cached. Worst case: `npx playwright install chromium` downloads the correct version on first test run. |
| A7 | The project has no `.github/workflows/` CI that runs browser tests | Pitfall 5 | UNKNOWN — `ls .github/workflows/` was not run during this research. Planner should verify in Wave 0. |
| A8 | Storybook stories for the 7 pages will continue to render after the refactor with no story-level changes | Pitfall 3 | MEDIUM — stories sometimes stub or mock parent imports. Planner should verify by running `npm run build-storybook` in Wave 3. |
| A9 | ContactMethods hardcoded links (`linkedin.com/in/pattern158`, `github.com/novakda`) should move into the content module as-is | §A2 | LOW — they're content. Might be worth a Discuss-Phase note to confirm these URLs are current. |
| A10 | `AccessibilityPage.vue`'s `Last Verified: February 21, 2026` line should move as a literal string (Phase 37 does not try to fix the staleness) | §F | LOW — staleness is pre-existing; not in Phase 37's remit. |

---

## Open Questions

1. **CaseFilesPage Project Directory — content or data?**
   - What we know: It's structured tabular data, currently inline in the SFC with an explicit comment. §C6 recommends storing in `src/content/caseFiles.ts` as a typed array.
   - What's unclear: Whether Dan prefers a stricter `content/` vs `data/` split.
   - Recommendation: **Discuss-Phase question.** Default to `src/content/caseFiles.ts`.

2. **Inline `<strong>` / `<em>` in extracted prose — preserve or drop?**
   - What we know: Several paragraphs use bold lead-ins (e.g., CompanyFitSection.vue, CultureFitSection.vue) and em-phrases (e.g., Pattern158OriginSection "The final page is in the fireplace…"). These contribute to visual emphasis.
   - What's unclear: Whether the Phase 38-45 markdown output will preserve these, and whether Dan cares.
   - Recommendation: **Discuss-Phase question.** Three options:
     - (a) Keep inline markup in the `<template>` using bound strings (e.g., `<strong>{{ lead }}</strong>{{ body }}`) with explicit `lead`/`body` fields — ugly but preserves emphasis
     - (b) Use the `{kind, value}` segment shape from Pattern 2 — more code, cleanest Phase 39 handoff
     - (c) Drop inline emphasis during extraction, re-add in Phase 39 via markdown rendering — simplest, slight temporary visual regression
   - Recommended default: **(c)** for everything except genuinely structural blockquotes (moral-spine quote in PhilosophyPage), which get dedicated typed fields.

3. **LOAD-01 edge case — `faqCategories` literal registry**
   - What we know: `src/data/faq.ts` declares a non-JSON registry as `as const satisfies`. §D proposes revised wording that allows this.
   - What's unclear: Whether the test in Code Example 1 is strict enough to catch future violations without false positives on the registry.
   - Recommendation: **Planner should verify the test accepts `faq.ts` as-is by running it against the current tree before writing content modules.** If false positive, adjust the regex to whitelist `as const satisfies` blocks.

4. **CI browser test execution**
   - What we know: `package.json` has `test:browser`. `~/.cache/ms-playwright` is local.
   - What's unclear: Whether CI (if any) runs it.
   - Recommendation: **Wave 0 pre-flight check:** `ls .github/workflows/ 2>&1`. If workflows exist, grep for `test`, `playwright`, `browser`. Document findings in PLAN.md.

5. **Should Phase 37 rename `useSeo({title, ...})` calls to read from `src/content/meta.ts`?**
   - What we know: ARCHITECTURE.md §3 proposes a `src/content/meta.ts` for page titles/descriptions. v7.0 Phase 39 extractors will need page titles.
   - What's unclear: Whether adding meta extraction expands Phase 37 scope unacceptably.
   - Recommendation: **Defer meta.ts to Phase 39.** Phase 37 does not need to touch `useSeo()` calls. The titles are tiny strings; extracting them later is cheap.

6. **Testing-library `expect.element(...).toBeVisible()` — browser-mode API availability**
   - What we know: vitest-browser-vue 2.1.0 ships with `expect.element` support per its README, and the README references "locators" from https://vitest.dev/guide/browser/locators.
   - What's unclear: Whether the project's Vitest version (`^4.1.0`) has the `expect.element` global shipped or if the `.toBeVisible()` matcher requires additional imports.
   - Recommendation: **Wave 2 sanity check — write ONE browser test first**, run it, confirm the assertion API. Only then write the other 6.

---

## Sources

### Primary (HIGH confidence — direct file inspection on 2026-04-10)

- `/home/xhiris/projects/pattern158-vue/package.json` — dep versions, scripts, type: module
- `/home/xhiris/projects/pattern158-vue/vitest.config.ts` — browser project already declared with chromium provider
- `/home/xhiris/projects/pattern158-vue/node_modules/playwright/package.json` — v1.59.1
- `/home/xhiris/projects/pattern158-vue/node_modules/@vitest/browser-playwright/package.json` — v4.1.2
- `/home/xhiris/projects/pattern158-vue/node_modules/vitest-browser-vue/package.json` — v2.1.0
- `/home/xhiris/projects/pattern158-vue/node_modules/vitest-browser-vue/README.md` — `render()` API, testing-library principles
- `/home/xhiris/projects/pattern158-vue/node_modules/vitest-browser-vue/dist/index.d.ts` — type signatures
- `~/.cache/ms-playwright/chromium-*` — three chromium versions cached
- `src/pages/HomePage.vue`, `PhilosophyPage.vue`, `FaqPage.vue`, `ContactPage.vue`, `AccessibilityPage.vue`, `TechnologiesPage.vue`, `CaseFilesPage.vue` — direct read of all prose
- `src/components/HowIWorkSection.vue`, `AiClaritySection.vue`, `Pattern158OriginSection.vue`, `RoleFitSection.vue`, `CompanyFitSection.vue`, `CultureFitSection.vue`, `ContactMethods.vue`, `CompensationTable.vue` — direct read of delegated prose
- `src/data/*.ts` (all 10 loaders) — direct read to audit thin-loader invariant
- `src/pages/CaseFilesPage.test.ts` — existing RouterLinkStub pattern
- `src/router.ts` — verified /review, /diag, /portfolio, /testimonials, 404 routes
- `npx vitest run` output — verified 127 passing tests across 11 files (on the pre-refactor tree, 2026-04-10)
- `.planning/PROJECT.md` (lines 83-92, 152-168) — v7.0 Active requirements and locked scoping decisions
- `.planning/STATE.md` — milestone status confirmed "ready to plan Phase 37"
- `.planning/ROADMAP.md` (lines 144-157) — Phase 37 scope phrase
- `.planning/research/SUMMARY.md` §§1-8 — content sourcing Option B, phase ordering, consensus recommendations
- `.planning/research/STACK.md` — tsx/yaml/github-slugger Phase 38 deps, RecommendationS, anti-deps
- `.planning/research/ARCHITECTURE.md` §§1-4 — proposed layout, module inventory, content sourcing
- `.planning/research/PITFALLS.md` §§1.5, 2.1, 2.2 — thin-loader drift, SFC extraction invisibility, regeneration drift
- `.planning/config.json` — `nyquist_validation: true`

### Secondary (MEDIUM confidence)

- `testing-library/vue` principles as referenced by the `vitest-browser-vue` README — the recommended "visible text via locators" pattern
- `@vue/test-utils` `RouterLinkStub` — transitively available via `vitest-browser-vue` dep chain

### Tertiary (LOW confidence — flagged as Assumptions)

- A1, A6, A7 — see Assumptions Log

### Not Used

- Context7 MCP — not required; all information came from direct file inspection
- WebSearch — disabled per user's global `CLAUDE.md` (quota exhausted; user mandates MCP toolkit for any web queries)
- Exa / Firecrawl / Brave — `init` confirmed `exa_search: false`, `firecrawl: false`, `brave_search: false`

---

## Metadata

**Confidence breakdown:**
- Phase inventory (files to touch): **HIGH** — 100% from direct file inspection
- Playwright / vitest-browser install status: **HIGH** — verified via `node_modules/*/package.json` and `~/.cache/ms-playwright/`
- Existing test count (127): **HIGH** — verified via `npx vitest run`
- Thin-loader invariant audit: **HIGH** — read all 10 loaders directly
- Content module shape recommendations: **MEDIUM-HIGH** — patterns grounded in v3.0 loader pattern and ARCHITECTURE.md, but final shape is planner's call after Discuss-Phase
- Wave structure: **MEDIUM** — parallelization analysis is sound but may change if SFC-02 / SFC-04 component refactors uncover hidden prop coupling
- `vitest-browser-vue` test shape: **MEDIUM** — based on README; a Wave 2 spike is recommended before committing to the pattern across 7 files

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (30 days — stable refactor phase; only external dependency is the already-installed test stack which won't change)

**Research complete. Planner may proceed.**
