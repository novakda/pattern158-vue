# Architecture — v8.0 Editorial Snapshot & Content Audit

**Milestone:** v8.0 (live-site editorial capture; successor to aborted v7.0)
**New directory:** `scripts/editorial/`
**Researched:** 2026-04-19
**Overall confidence:** HIGH (integration pattern mirrors v7.0 Phase 38, verified against existing files)

---

## Guiding Principle

v8.0 is a **one-off editorial tool**, not a long-lived pipeline. Over-engineering is the named risk. Every decision below is biased toward "smallest viable structure that honors the existing project's invariants."

The existing `scripts/markdown-export/` in this repo is the template for *how* a scripts subproject integrates (pnpm, tsconfig project reference, Vitest `scripts` project, forbidden-pattern discipline). It is **not** the template for *shape*. `scripts/markdown-export/` is a multi-phase pipeline with IR, primitives, renderers, writers. `scripts/editorial/` should be substantially flatter.

---

## 1. Proposed Directory Structure

```
scripts/
├── markdown-export/          # v7.0 — RETAINED, not extended by v8.0
│   ├── ir/ primitives/ escape/ frontmatter/ index.ts
│
└── editorial/                # v8.0 — NEW
    ├── index.ts              # CLI entry point — orchestrates the capture
    ├── config.ts             # Resolves env vars / CLI args → typed Config object
    ├── routes.ts             # Builds route list from exhibits.json + static routes
    ├── capture.ts            # Playwright: launch → for-each-route → page.content()
    ├── convert.ts            # Turndown service + custom rules → Markdown
    ├── write.ts              # fs.writeFile with preflight directory check
    ├── types.ts              # Local types (Route, CapturedPage, EditorialOptions)
    └── __tests__/
        ├── routes.test.ts    # Pure — route-list builder given fixture exhibits
        └── convert.test.ts   # Pure — fixture HTML strings → expected Markdown
```

### File role summary

| File | LOC estimate | Role | Pure/IO |
|------|-------------:|------|---------|
| `index.ts` | 40–80 | CLI entry; parses argv, invokes phases in order, handles exit codes | IO |
| `config.ts` | 30–60 | Reads `process.argv` + `process.env`, validates, returns `EditorialConfig` | IO-adjacent (reads env) but logic is pure-testable |
| `routes.ts` | 40–80 | `buildRouteList(exhibits)` — pure function; reads `exhibits.json` via fs at entry | Pure core + thin IO boundary |
| `capture.ts` | 80–150 | Orchestrates Playwright; exports `capturePages(routes, baseUrl) → CapturedPage[]` | IO (browser) |
| `convert.ts` | 60–120 | `htmlToMarkdown(html) → string`; Turndown service + custom rules for the site's patterns | Pure (HTML in, MD out) |
| `write.ts` | 30–50 | `writeCapture(path, markdown)` — preflight + write | IO (disk) |
| `types.ts` | 20–40 | `Route`, `CapturedPage`, `EditorialConfig` — local, not shared with `scripts/markdown-export/` | - |

Total: ~300–580 LOC for the whole tool. This is intentionally smaller than `scripts/markdown-export/`'s current footprint.

### What's deliberately NOT here

- **No `capture/`, `convert/`, `output/` subdirectories.** At ~300-580 LOC total, subdirectories add navigation cost without locality benefit. Flat is correct at this scale.
- **No `ir/` or reuse of `scripts/markdown-export/primitives/`.** Those primitives encode a source-module-first mental model (the one v7.0 abandoned). v8.0 works from rendered HTML; Turndown output is the IR. Importing the v7.0 primitives would re-introduce the coupling the abort notice explicitly severs.
- **No `fixtures/` directory.** Test HTML strings live inline in the test files until we have enough fixtures that extraction pays off (current estimate: we never will — this is one-off).
- **No `cli/` wrapper separate from `index.ts`.** The entry *is* the CLI. Splitting them is the v7.0 orchestrator pattern; v8.0 doesn't need it.

---

## 2. TypeScript & Build Integration

### Decision: **New `tsconfig.editorial.json` + new project reference in root**

Mirror the `tsconfig.scripts.json` pattern exactly. Do not piggyback on `tsconfig.scripts.json`, and do not rely on "just tsx runs it without typechecking."

#### Rationale

Three reasons, in descending order:

1. **Forbidden-pattern isolation.** `tsconfig.scripts.json` has `"paths": {}` to make `@/*` resolution impossible inside `scripts/markdown-export/**`. v8.0 needs the same guarantee — the forbidden list (no `@/`, no `os.EOL`, no non-deterministic `Date.now()` etc.) applies equally to `scripts/editorial/`. A separate tsconfig with `"paths": {}` + `"include": ["scripts/editorial/**/*.ts"]` is the mechanical enforcement.
2. **Separation from v7.0.** The abort notice (`.planning/v7.0-ABORT-NOTICE.md` §"Immediate") explicitly says editorial "lives outside `scripts/markdown-export/` to keep v7.0 and the pivot cleanly separated." If they share a tsconfig, they share a TS project graph, and a breaking edit in one can surface as a type error in the other. Separate projects mean independent decay/evolution.
3. **`vue-tsc -b` picks it up for free.** The root `tsconfig.json` already has a `"references"` array. Adding a second entry `{ "path": "./tsconfig.editorial.json" }` hooks it into the build chain with zero other changes. `pnpm build` already calls `vue-tsc -b` and will type-check all referenced projects.

#### `tsconfig.editorial.json` shape

Near-copy of `tsconfig.scripts.json`, with only two things changed:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "composite": true,
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": ".tsbuildinfo-editorial",
    "rootDir": ".",
    "isolatedModules": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "lib": ["ES2022"],
    "types": ["node"],
    "paths": {},
    "baseUrl": "."
  },
  "include": ["scripts/editorial/**/*.ts"]
}
```

Changes from `tsconfig.scripts.json`:
- `"outDir": ".tsbuildinfo-editorial"` (separate tsbuildinfo; the root `.gitignore` likely already covers `.tsbuildinfo*` — verify in planning)
- `"include": ["scripts/editorial/**/*.ts"]`

Everything else locked identical. `"paths": {}` is the load-bearing discipline line.

#### Root `tsconfig.json` change

Add one line to the references array:

```json
"references": [
  { "path": "./tsconfig.scripts.json" },
  { "path": "./tsconfig.editorial.json" }
]
```

No other root tsconfig changes.

#### Forbidden patterns that extend to `scripts/editorial/`

From `scripts/markdown-export/`'s hard-won discipline:
- No `@/` path alias imports (enforced by `"paths": {}`)
- No imports from `src/...` via relative paths (NOTE: this is the one we have to loosen slightly — see §3 Route-list loading)
- No `Date.now()`, `new Date()`, `process.hrtime()`, `performance.now()` (determinism — but the capture itself is inherently non-deterministic because it's a live-site scrape; see §7)
- No `os.EOL` — always `\n`
- No `Promise.all` on operations that must be ordered (route capture order matters for editorial reading flow)
- No `postinstall` or `prepare` hooks

One nuance: the editorial tool captures the live site at a point in time, so it is *inherently* non-reproducible across runs. The spirit of "determinism" from v7.0 translated for v8.0 means: **within a single run, output should be deterministic order (routes processed in declared order, single-threaded)**. It does NOT mean "same input produces same output across weeks" — that's impossible when the input is a live website.

---

## 3. Data & Output Flow

```
 ┌────────────────────────────────────────────────────────────┐
 │  src/data/json/exhibits.json   (authoritative slug source) │
 └──────────────────────────┬─────────────────────────────────┘
                            │ fs.readFile + JSON.parse in routes.ts
                            ▼
 ┌──────────────────────────────────┐      ┌─────────────────────┐
 │  Static routes (hardcoded list)  │──┐   │ CLI args / env vars │
 │  /, /philosophy, /faq, ...       │  │   │ BASE_URL, OUT_PATH  │
 └──────────────────────────────────┘  │   └──────────┬──────────┘
                                       ▼              │
                          ┌───────────────────┐       │
                          │   Route[]         │       │
                          │   (ordered)       │       │
                          └─────────┬─────────┘       │
                                    │                 │
                                    ▼                 ▼
                          ┌───────────────────────────────┐
                          │  capture.ts (Playwright)      │
                          │  chromium.launch              │
                          │  for route of routes:         │
                          │    page.goto(base + route)    │
                          │    page.waitForLoadState      │
                          │    html = page.content()      │
                          │    main = page.locator('main')│
                          │          .innerHTML()         │
                          └─────────────┬─────────────────┘
                                        ▼
                          ┌──────────────────────────────┐
                          │  CapturedPage[]              │
                          │  { route, title, html,       │
                          │    status, error? }          │
                          └─────────────┬────────────────┘
                                        ▼
                          ┌──────────────────────────────┐
                          │  convert.ts (Turndown)       │
                          │  per page: HTML → Markdown   │
                          │  then join with page headers │
                          └─────────────┬────────────────┘
                                        ▼
                          ┌──────────────────────────────┐
                          │  write.ts                    │
                          │  preflight: dir exists &     │
                          │    writable?                 │
                          │  fs.writeFile(OUT_PATH, md)  │
                          └──────────────────────────────┘
                                        ▼
              /mnt/c/main/Obsidian Vault/career/website/
                           site-editorial-capture.md
```

### Route list loading — thin-loader invariant interpretation

The thin-loader rule in `src/data/*.ts` forbids sort/filter/computed/map/ref/reactive/watch. It applies to **Vue-side** loaders whose job is to re-export JSON with type assertions so components get strongly-typed data without processing work at import time.

**That invariant does NOT apply to `scripts/editorial/routes.ts`** for two reasons:

1. Scope: the invariant is scoped to `src/data/**`, not project-wide. `scripts/**` has always been allowed to do derivational work (v7.0 extractors were planned to do exactly that).
2. Purpose: the whole point of `routes.ts` is to *derive* a URL list from exhibit data — that is inherently transformational. Making it a thin re-export would just push the derivation somewhere else.

**How `routes.ts` reads `exhibits.json`:**

Use `fs.readFile` + `JSON.parse` at runtime. Do **not** use `import exhibits from '../../src/data/json/exhibits.json'` with `assert { type: 'json' }` (forbidden list; brittle across bundlers).

```ts
// scripts/editorial/routes.ts (shape)
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const EXHIBITS_PATH = resolve(
  import.meta.dirname,
  '..', '..', 'src', 'data', 'json', 'exhibits.json'
)

export async function loadExhibits(): Promise<ExhibitLite[]> {
  const raw = await readFile(EXHIBITS_PATH, 'utf8')
  return JSON.parse(raw) as ExhibitLite[]
}

export function buildRouteList(exhibits: ExhibitLite[]): Route[] {
  const staticRoutes: Route[] = [
    { path: '/', label: 'Home' },
    { path: '/philosophy', label: 'Philosophy' },
    { path: '/faq', label: 'FAQ' },
    { path: '/technologies', label: 'Technologies' },
    { path: '/case-files', label: 'Case Files' },
    { path: '/contact', label: 'Contact' },
    { path: '/accessibility', label: 'Accessibility' },
  ]
  const exhibitRoutes: Route[] = exhibits.map(e => ({
    path: `/exhibits/${e.slug}`,
    label: `${e.label} — ${e.title}`,
  }))
  return [...staticRoutes, ...exhibitRoutes]
}
```

Rationale: `buildRouteList` is a **pure function** — trivially unit-testable with fixture input (§4). The IO boundary (`readFile`) is the thinnest possible wrapper around it.

The static route list is hardcoded **inside `routes.ts`**, not pulled from `src/router.ts`. Reason: `src/router.ts` uses `() => import()` lazy-loaded component refs and redirect objects, which means naïvely importing it from scripts pulls in Vue's ecosystem (components, router-link, SFCs). The static route list for a portfolio site is six entries long and changes rarely — duplicating it in `routes.ts` is cheaper than building a router-agnostic introspection bridge. Accept the minor duplication; add a comment in both files noting they must stay in sync; the editorial tool is one-off anyway.

### Output destination — CLI arg (primary) + env var (fallback)

The user runs this as a one-off command from their own shell. The target is an absolute path outside the repo (Obsidian vault at `/mnt/c/main/Obsidian Vault/career/website/site-editorial-capture.md`).

**Decision: accept both, prefer CLI arg over env var; default to env var if arg missing; error if neither.**

```
Priority:
  1. --output <path>          CLI flag        (highest precedence)
  2. EDITORIAL_OUT_PATH env   (fallback)
  3. No default               (fail fast if neither set)
```

Rationale:
- **CLI arg is primary** because the user is running the tool ad-hoc, not in a CI pipeline. Typing `--output /path` in the command line is the most grep-able, most discoverable form.
- **Env var is the fallback** because one-off runs get repetitive — the user likely wants to set `EDITORIAL_OUT_PATH` once in their shell profile or `.envrc` and stop thinking about it.
- **No hardcoded default** because hardcoding `/mnt/c/main/Obsidian Vault/...` would bake Dan's specific filesystem into the repo. Even though this tool is one-off and won't ship, it reads well for the editorial review (someone other than Dan reading `.planning/` should see "configurable output path," not "Dan's private path").
- **`--base-url`** should be the same shape: `--base-url https://pattern158.solutions` or env `EDITORIAL_BASE_URL`, defaulting to `https://pattern158.solutions` (the site is already public; this default is safe to hardcode).

### Preflight check in `write.ts`

Before the expensive Playwright launch, `index.ts` calls `write.ts`'s preflight validator:

```ts
// write.ts (shape)
export async function validateOutputPath(path: string): Promise<void> {
  // 1. Absolute? (reject relative paths — editorial writes outside repo)
  if (!isAbsolute(path)) throw new Error(`--output must be absolute, got: ${path}`)
  // 2. Parent directory exists?
  const dir = dirname(path)
  try { await stat(dir) }
  catch { throw new Error(`Output directory does not exist: ${dir}`) }
  // 3. Writable? (touch a temp file alongside)
  try {
    const probe = join(dir, `.editorial-probe-${process.pid}`)
    await writeFile(probe, '')
    await unlink(probe)
  } catch { throw new Error(`Output directory not writable: ${dir}`) }
}
```

**Call order in `index.ts`:** validate args → preflight output path → load exhibits → build route list → launch browser → capture → convert → write. Preflight BEFORE browser launch avoids spending 30 seconds scraping only to fail on `ENOENT` at the last step.

---

## 4. Test Strategy

### Testable vs untestable

| Component | Testable? | How |
|-----------|-----------|-----|
| `routes.ts` — `buildRouteList()` | YES, trivially | Unit test: fixture exhibits array in, expected `Route[]` out. No IO. |
| `convert.ts` — `htmlToMarkdown()` | YES, valuable | Unit test: fixture HTML strings in, expected Markdown out. Turndown + custom rules are deterministic. |
| `config.ts` — `parseArgs()` | YES, light | Unit test: `parseArgs(['--output', '/tmp/x'])` returns expected config; missing required → throws. |
| `capture.ts` — `capturePages()` | NO (unit). Integration only. | Launches real Playwright against real URL. Test by running against the live site once. |
| `write.ts` — `validateOutputPath()` | YES, with tmpdir fixture | Use `os.tmpdir()` for positive cases; nonexistent dir for negative cases. |
| `write.ts` — `writeCapture()` | Marginal | Trivial one-liner around `fs.writeFile`. Not worth mocking. |
| `index.ts` | NO | Pure orchestration. Test via running the real tool. |

### Coverage target

Unit tests for `routes.ts` + `convert.ts` + `config.ts` + `validateOutputPath` should cover the non-IO logic. The rest is "tested by running it." Explicitly state in the phase plan: **integration verification is "run the tool once against the live site, review the output markdown, and confirm it opens cleanly in Obsidian."** That is Dan's manual acceptance check — don't pretend unit tests can replace it.

### Vitest integration — decision

**Extend the existing `scripts` Vitest project to cover both `scripts/markdown-export/` and `scripts/editorial/`.** Do not create a fourth `editorial` project.

Change in `vitest.config.ts`:

```ts
{
  extends: true,
  test: {
    name: 'scripts',
    include: [
      'scripts/markdown-export/**/*.test.ts',
      'scripts/editorial/**/*.test.ts',  // NEW
    ],
    environment: 'node',
    globals: true,
  },
}
```

Rationale: both script subprojects have identical test requirements (Node env, no Vue, no DOM globals, `globals: true`). A fourth project adds config bloat for zero semantic benefit. Separation of concerns is already provided by the two tsconfig project references (type-checking is separate); test runtime can share.

**`pnpm test:scripts` continues to work unchanged** and now runs both subprojects' tests together. No new pnpm test script needed for editorial.

### What about Playwright in tests?

The repo already has Playwright installed (v1.58.2) via the `@vitest/browser-playwright` provider used by the `browser` Vitest project. **No new Playwright install is needed** — the `scripts/editorial/capture.ts` code does `import { chromium } from 'playwright'` and consumes the already-installed dep. This is a meaningful architectural win: no new devDep, no peer-dep concerns, no Playwright browser binary re-download (if `pnpm exec playwright install chromium` was run once, it's cached).

Note: the `browser` Vitest project uses Playwright via a different code path (the `@vitest/browser-playwright` provider wraps it). That doesn't conflict with direct `import { chromium } from 'playwright'` in a Node-environment script. They can coexist because they hit different APIs of the same underlying installed package.

---

## 5. Suggested Build Order

This order flows phases from infrastructure outward, each phase shippable independently and each with a clear test gate. Parallelism is explicitly avoided — this is a small tool and sequential phases keep the milestone legible.

### Phase A — Scaffold (foundation)
Mirror v7.0 Phase 38-01 exactly.
- Create `tsconfig.editorial.json` with `"paths": {}`, `"include": ["scripts/editorial/**/*.ts"]`.
- Add `{ "path": "./tsconfig.editorial.json" }` to root `tsconfig.json` `references`.
- Extend `vitest.config.ts` `scripts` project `include` array to add `scripts/editorial/**/*.test.ts`.
- Add pnpm script: `"capture:editorial": "tsx scripts/editorial/index.ts"`.
- Install new devDep: `pnpm add -D turndown @types/turndown`. (Playwright already present.)
- Scaffold `scripts/editorial/index.ts` as placeholder that logs a banner and exits 0 (mirrors Phase 38-01's placeholder pattern).
- Acceptance: `pnpm exec vue-tsc -b` green, `pnpm capture:editorial` exits 0, `pnpm test:scripts` still green.

### Phase B — Config + Routes (pure logic first)
Build the testable pure logic before wiring any IO.
- `scripts/editorial/types.ts` — `EditorialConfig`, `Route`, `CapturedPage`, `ExhibitLite`.
- `scripts/editorial/config.ts` — `parseArgs(argv)` + `loadConfig()` (applies env var fallback).
- `scripts/editorial/routes.ts` — `loadExhibits()` + `buildRouteList(exhibits)`.
- Tests: `routes.test.ts` with fixture exhibits, `config.test.ts` with various argv combos.
- Acceptance: `pnpm test:scripts` green with new tests; running `tsx scripts/editorial/index.ts --output /tmp/x.md` builds a route list (logs it) without launching a browser yet.

### Phase C — Capture (Playwright layer)
Introduce the IO layer. Highest failure-mode density.
- `scripts/editorial/capture.ts` — `capturePages(routes, baseUrl): Promise<CapturedPage[]>`.
- Strategy: launch chromium headless, for-each-route navigate with `waitUntil: 'domcontentloaded'`, then `page.waitForLoadState('networkidle', { timeout: 5000 })`, grab `page.locator('main').innerHTML()`.
- Include a failure mode: if navigation fails or `main` locator is absent, record the error in `CapturedPage.error` and continue to next route. Do NOT abort the whole run for one bad page.
- Acceptance: run against live pattern158.solutions, confirm all routes return HTML.

### Phase D — Convert (Turndown layer)
Pure logic again — fully unit-testable.
- `scripts/editorial/convert.ts` — `htmlToMarkdown(html, options): string`.
- Turndown v7 configured with ATX headings, `-` bullet markers, fenced code blocks.
- Custom rules for site-specific patterns discovered in Phase C's captured output (examples likely: ExhibitCard structure, findings severity badges, personnel cards).
- Fixture-driven tests: inline HTML string in, expected Markdown out.
- Acceptance: `pnpm test:scripts` green; running the full pipeline now produces a legible `.md` file.

### Phase E — Write + Preflight (finalize output)
- `scripts/editorial/write.ts` — `validateOutputPath()` + `writeCapture()`.
- `scripts/editorial/index.ts` — wire all phases in order, error handling, exit codes.
- Acceptance: full end-to-end run: `pnpm capture:editorial --output "/mnt/c/main/Obsidian Vault/career/website/site-editorial-capture.md"` produces the file, Dan opens it in Obsidian and confirms it's readable.

### Phase F — Editorial review (no code)
- Dan reads the captured markdown.
- Produces findings in `career/website/site-editorial-findings.md` (Obsidian vault, alongside the capture).
- No code changes in this phase.

### Phase G — Milestone audit → v9.0 direction decision
- Write `.planning/milestones/v8.0-phases/XXX-EDITORIAL-AUDIT.md` summarizing findings and recommending rebuild direction (static HTML first vs alternative).
- Update PROJECT.md Validated / Out-of-Scope.

### Where findings docs live

**Capture output** → Obsidian vault only (`career/website/site-editorial-capture.md`). The capture is derived from a live site; it should not be versioned in the Vue repo. Even a brief check-in would produce noise (differs every run) and pollute git history.

**Editorial findings (Dan's manual review notes)** → Obsidian vault (`career/website/site-editorial-findings.md`). Findings are working documents; the vault is where Dan already stores editorial work.

**Milestone audit (GSD-level decision record)** → `.planning/milestones/v8.0-phases/XXX-EDITORIAL-AUDIT.md`. This is a project-planning artifact, belongs in `.planning/`, follows the same pattern as `.planning/phases/038-ir-markdown-primitives-scaffold/038-DOCS-AUDIT.md`.

### Gitignore concerns

Add to `.gitignore`:
```
# v8.0 editorial — typecheck artifacts
.tsbuildinfo-editorial
.tsbuildinfo-editorial/
```

No other gitignore changes needed. The editorial tool writes to an absolute path outside the repo; no files land inside the working tree that need ignoring. Confirm `.tsbuildinfo-scripts` is already in `.gitignore` from Phase 38; if so, the new `.tsbuildinfo-editorial` follows the same pattern.

---

## 6. Open Questions for Dan

These are decisions that affect Phase A/B scoping but aren't blocking for research completion. The roadmap creation should prompt these during milestone planning.

1. **Per-page Markdown files or single monolith?** The abort notice says "a single Markdown document of all rendered page content in reading order." That's probably right (editorial review reads better as a single scroll), but Obsidian handles split files well too, and a split would make diff-ing captures across runs much easier if the tool is ever re-run. Proposed default: **single monolith** per the abort notice, but Phase B/E should expose this as a CLI flag (`--split` / `--monolith` with monolith as default).

2. **Static route list: hardcoded or router-file scraped?** Current recommendation: hardcoded in `routes.ts` with comment pointing to `src/router.ts`. Alternative: a separate `scripts/editorial/fetch-routes.ts` that runs `tsx` against a small extractor that reads `src/router.ts` via regex. The extractor approach is a whole phase of work and brittle; hardcoding is five lines and obvious. **Flagging for Dan to veto.**

3. **Screenshot artifacts alongside markdown?** Playwright makes this nearly free (`page.screenshot()`). Could be written to a sibling directory in the vault (`career/website/site-editorial-capture-screenshots/`). Editorial value: visually-rendered design decisions (spacing, badge colors, card layouts) don't survive HTML→Markdown conversion. Downside: ~15 PNGs, file-size cost in the vault. **Flagging for Dan — defer to milestone planning.**

4. **Networkidle timeout tuning.** Proposed 5s is a guess. Real-world SPA with lazy-loaded routes may need 10s. Finalize during Phase C when running against the real site.

5. **Handling authenticated routes.** The site has no auth — confirmed in `src/router.ts` (all routes are public). No concern, but confirm before Phase C.

6. **Turndown custom-rule scope.** The site uses semantic HTML (`<main>`, `<article>`, `<section>`, `<h2>`, `<table>`). Turndown handles all of these out of the box. But severity badges (colored spans), personnel cards (nested divs), findings tables (structured markup) may render as noise without custom rules. Scope of Phase D custom rules unknown until Phase C's output is inspected. **Budget flex: Phase D may be bigger than the 60-120 LOC estimate if the site's markup is rich.**

7. **Is the tool committed to the repo, or is it throwaway?** Recommendation: **committed**. Even though it's one-off for this editorial pass, (a) it costs ~500 LOC so keeping it is cheap, (b) the Rosetta Stone vision in the abort notice implies similar captures against future framework implementations, (c) the committed code serves as a portfolio artifact itself. But Dan may prefer throwaway-in-a-separate-branch-never-merged. **Default to committed; flag for confirmation.**

---

## Confidence Assessment

| Area | Confidence | Source |
|------|-----------|--------|
| tsconfig project-reference pattern | HIGH | Directly mirrors existing `tsconfig.scripts.json` + Phase 38-01 plan |
| Vitest `scripts` project extension | HIGH | Current vitest.config.ts read verbatim; include array is trivially extensible |
| Turndown v7 API + Node support | HIGH | Context7 `/mixmark-io/turndown` (v7 uses domino internally, no jsdom needed) |
| Playwright `chromium.launch` pattern | HIGH | Context7 `/microsoft/playwright` — official library-js docs |
| Forbidden-pattern application to editorial | HIGH | Abort notice + Phase 38-01 plan both explicit |
| Route list strategy (hardcode vs extract) | MEDIUM | Recommendation is clear; final call is Dan's preference |
| Screenshot inclusion | LOW | Not mentioned in abort notice; speculative addition |
| Integration with `vitest-browser-vue` Playwright | HIGH | Both consume the same installed `playwright` package; different APIs, no conflict |

---

## Summary for Roadmap

**One-off tool, ~500 LOC, flat structure, five source files + tests.** Integration points: new `tsconfig.editorial.json` project reference (mirrors `tsconfig.scripts.json`), extended Vitest `scripts` project `include`, one new pnpm script (`capture:editorial`), one new devDep (`turndown`). Output goes to Obsidian vault only, no repo artifacts. Seven phases suggested (A-G), phases A-E are code, F is manual review, G is decision document. Build order is strict-sequential — parallelism is a risk, not a benefit, at this scale.
