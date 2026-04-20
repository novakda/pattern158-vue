# v8.0 Stack Research — Editorial Snapshot & Content Audit

**Scope:** Stack additions for a Playwright-driven live-site capture tool at `scripts/editorial/`.
**Date:** 2026-04-19
**Confidence:** HIGH — all versions and maintenance claims verified against npm registry and upstream repos on 2026-04-19.

This document deliberately does NOT re-research Vue 3, TypeScript, Vite, pnpm, tsx, or Vitest. Those are validated in `.planning/PROJECT.md` and remain unchanged.

---

## 1. Recommended Stack

| Purpose | Choice | Version | Rationale |
|---------|--------|---------|-----------|
| Browser automation | `playwright` | `^1.59.1` (already `^1.58.2` installed as transitive for vitest-browser-vue; bump to 1.59.1) | Full package bundles the API client + CLI (`playwright install`) for browser binaries. Already installed — this is the same package vitest-browser-vue pulls in, so no duplicate browser download. Node `>=18` engine matches tsx/project baseline. |
| HTML → Markdown | `turndown` | `^7.2.4` | Actively maintained (release 2026-04-03, 18 days ago). 11.1k stars. Pluggable `addRule()` API is the right seam for handling Vue-specific markup we'll encounter (RouterLinks rendered as `<a>`, component-wrapped images, etc.). Ships dual CJS+ESM (`lib/turndown.es.js` via `module` field), works with `"type": "module"` + tsx. Has its own embedded DOM via `@mixmark-io/domino` — no jsdom requirement for conversion step. |
| GFM extensions for Turndown | `@joplin/turndown-plugin-gfm` | `^1.0.64` | **NOT the official `turndown-plugin-gfm`** — that package is dead (last release 2017-12, dep of dead-for-9-years code). Joplin maintains an active fork (released 2025-10-18) with the same API surface. Provides GFM tables, strikethrough, task lists. Portfolio site uses tables (exhibit personnel / technologies / findings) — table support is essential, not nice-to-have. |
| Turndown TypeScript types | `@types/turndown` | `^5.0.6` | Turndown v7 ships NO bundled types (only `lib/turndown.{cjs,es,umd}.js`). DefinitelyTyped package updated 2025-10-26, covers the v7 API. Dev-only dependency. |
| Content region isolation | **None** (use Playwright `page.locator('main').innerHTML()`) | — | See §2 — Readability rejected. Site has a stable `<main>` landmark (per existing Vue Router layout), so a CSS-selector extraction in Playwright is simpler and more deterministic than running a readability algorithm. |
| TypeScript project reference | New `tsconfig.editorial.json` | — | Analogous to `tsconfig.scripts.json`. Separate from `scripts/markdown-export/` to honor the v7.0 abort boundary. `include: ["scripts/editorial/**/*.ts"]`. See §3 for full config. |

### Installation command

```bash
pnpm add -D turndown@^7.2.4 @joplin/turndown-plugin-gfm@^1.0.64 @types/turndown@^5.0.6
# playwright already installed as ^1.58.2; bump with:
pnpm up playwright@latest
# ensure chromium binary (already present at ~/.cache/ms-playwright/chromium-1217; safe re-run):
pnpm exec playwright install chromium
```

Net new deps: **3** (`turndown`, `@joplin/turndown-plugin-gfm`, `@types/turndown`). All devDependencies. All pure JS, no native bindings.

---

## 2. Rejected Alternatives

| Name | Reason Rejected |
|------|-----------------|
| `@playwright/test` | Test-runner flavor. We're writing a one-off capture script, not a test suite. `@playwright/test` bundles fixtures, expect assertions, a CLI runner, reporters — none of which this tool needs. Would also collide conceptually with the existing Vitest browser tests. |
| `playwright-core` | Ships API without the `playwright install` CLI and without browser download management. Since we're adding a user-facing pnpm script Dan will run locally, the `playwright install` UX is valuable. Also, `playwright` is already the installed package (transitive via vitest-browser-vue) — choosing `playwright-core` would add a second Playwright install path with separate versioning. Avoid. |
| Standalone `playwright/chromium` installer + `playwright-core` | Over-engineering for a portfolio site with ~22 routes. The size savings (~5MB) are irrelevant in a devDependency used on Dan's machine only. Adds cognitive load without benefit. |
| `turndown-plugin-gfm` (original, not Joplin fork) | **Dead package.** Last release 2017-12-19 (8.3 years stale). Last commit 2017. 8 open issues unresolved. Hard reject for a new 2026 tool. Users in its issue tracker routinely point to the Joplin fork as the live maintenance path. |
| `node-html-markdown` | Plausible alternative — actively maintained (v2.0.0 released 2025-11-14, ships TS types, claims ~1.57x Turndown speed). Rejected because: (1) much smaller ecosystem (260 stars vs 11.1k) means fewer Stack Overflow answers / prior art when we hit edge cases; (2) its rule-customization surface is narrower than Turndown's `addRule()` — and we will need custom rules for Vue-rendered markup; (3) performance isn't relevant for a ~22-page capture run; (4) Turndown's `@mixmark-io/domino` embedded DOM is a feature, not a bug, for our monolithic concatenation step. Keep as a fallback if Turndown output quality is poor (low probability). |
| `@mozilla/readability` (+ `jsdom`) | Readability is a content-extraction heuristic designed for arbitrary unknown web pages (Firefox Reader View use case). We control the Vue site's DOM structure and have a semantic `<main>` landmark on every page. Using Readability here adds: `jsdom@29.0.2` (~15MB devDep, heavy), Readability's own fuzzy scoring (may drop content we want to keep — e.g. metadata sidebars on exhibit pages, FAQ accordion items it might score as "boilerplate"), and an extra DOM round-trip (Playwright DOM → HTML string → jsdom DOM → Readability → HTML string → Turndown). We'd be laundering our own known DOM through three parsers to fight our own markup. Reject. If `<main>` selection later proves insufficient, revisit with a narrower page-specific selector strategy before reaching for Readability. |
| `cheerio` | No legitimate role here. Playwright already exposes a full DOM via `page.evaluate` / `page.locator`. Adding cheerio would mean serializing Playwright's DOM back to HTML only to re-parse it with cheerio — pure waste. Also: explicitly called out in the quality-gate brief as a rejection candidate. |
| `jsdom` (standalone, not via Readability) | Same objection as cheerio — Playwright already owns the DOM. Only reason to add jsdom would be to feed Readability, which we're not doing. |
| `turndown-plugin-gfm` monkey-patched / forked ourselves | Maintenance burden for zero benefit. The Joplin fork already exists, is MIT-licensed, and tracks upstream Turndown. Use it. |
| `pandoc` (shelled out as child process) | Heavyweight dependency external to npm, platform-specific install, not portable across Dan's dev machines, overkill for HTML→MD of a site we wrote ourselves. |
| `marked` / `remark` / `unified` | These are Markdown→HTML or Markdown-AST pipelines — wrong direction. Not applicable. |

---

## 3. Integration Points

### 3.1 Directory layout

```
scripts/
  editorial/                     ← NEW (this milestone)
    index.ts                     ← entry invoked by pnpm script
    capture.ts                   ← Playwright browser driver
    convert.ts                   ← Turndown configuration + rules
    routes.ts                    ← builds route list from exhibits.json
    types.ts                     ← local types (CapturedPage, etc.)
  markdown-export/               ← UNCHANGED (v7.0 Phase 37-38 output, retained but unused by this tool)
```

This keeps the v7.0 abort boundary clean. `scripts/editorial/` has zero imports from `scripts/markdown-export/`. If anyone needs to delete `scripts/markdown-export/` later, this tool is unaffected.

### 3.2 `tsconfig.editorial.json`

Mirrors `tsconfig.scripts.json` exactly except for `outDir` and `include`:

```jsonc
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
    "lib": ["ES2022", "DOM"],          // DOM added for page.evaluate() typings
    "types": ["node"],
    "paths": {},
    "baseUrl": "."
  },
  "include": ["scripts/editorial/**/*.ts"]
}
```

Separate config (not shared with `tsconfig.scripts.json`) because:
1. Abort-boundary hygiene (see §3.1).
2. This tool needs `"DOM"` in `lib` for `page.evaluate()` callback types — the markdown-export scaffolding doesn't and shouldn't.
3. Cleaner `.tsbuildinfo-editorial` artifact separates incremental-compile state.

Will need to be referenced from the root `tsconfig.json` `references` array alongside `tsconfig.scripts.json` so `vue-tsc -b` picks it up during `pnpm build`. (Open Question #2 — see §4.)

### 3.3 pnpm script wiring

Add to `package.json` `scripts`:

```jsonc
{
  "scripts": {
    "editorial:capture": "tsx scripts/editorial/index.ts"
  }
}
```

- Runs via existing `tsx 4.21.0` devDep (no addition).
- No `&&` chaining with `build` — this is an on-demand tool, not a build step. Explicitly separate from `build:markdown` (which runs the retained-but-unused v7.0 scaffold).
- Accepts CLI args / env vars for output path — see Open Question #1.

### 3.4 Reading `src/data/json/exhibits.json`

tsx + `tsconfig.editorial.json` with `resolveJsonModule: true` lets `scripts/editorial/routes.ts` do:

```ts
import exhibits from '../../src/data/json/exhibits.json' with { type: 'json' };
```

The `with { type: 'json' }` import attribute is Node 22+ stable; tsx handles it. Alternative fallback: `fs.readFileSync` + `JSON.parse` if we want to avoid coupling tsc resolution to `src/`. Either works; the import approach is more type-safe since TS narrows the JSON shape.

Note: `src/data/json/exhibits.json` sits outside the `scripts/editorial/` include glob, but `resolveJsonModule` + a cross-tree import compile fine. If vue-tsc complains under `-b` composite mode, a secondary pattern is to pass the exhibits list through an env var or a tiny generated manifest — but that's almost certainly overkill.

### 3.5 pnpm peer-dep resolution check

None of the 3 new deps have peerDependencies:

- `turndown@7.2.4` — `peerDependencies: undefined`, single runtime dep (`@mixmark-io/domino`)
- `@joplin/turndown-plugin-gfm@1.0.64` — peer-dep-free; the plugin calls `TurndownService.prototype.use()` at runtime
- `@types/turndown@5.0.6` — type-only, no runtime

No pnpm workspace hoisting or `.npmrc` changes required. No risk of the dreaded pnpm strict-peer-dep warning storms.

### 3.6 Playwright browser binary management

`playwright` 1.59.1 currently has chromium-1217 cached at `~/.cache/ms-playwright/chromium-1217/`. Bumping from 1.58.2 → 1.59.1 may trigger a fresh chromium download on first run (they version-pin). One-time cost. The capture tool should launch `chromium` headless (no webkit/firefox needed) — cheapest binary.

### 3.7 Runtime vs dev classification

All 3 new packages go in `devDependencies`. This tool never runs in production (Cloudflare Pages build), never runs in CI by default, and never ships to users. It's a developer utility that Dan runs against the live production site.

---

## 4. Open Questions for Dan

### Q1. Output destination — CLI arg, env var, or config file?

The tool writes a single Markdown file to an absolute path (Obsidian vault). Three reasonable patterns:

| Option | Invocation | Tradeoff |
|--------|------------|----------|
| **A. CLI arg** | `pnpm editorial:capture --out /c/main/Obsidian\ Vault/career/…/snapshot.md` | Explicit, no hidden state, easy to override per-run. Verbose. |
| **B. Env var** | `EDITORIAL_OUT=/c/… pnpm editorial:capture` | Good for CI-free local runs, hideable from shell history. Implicit. |
| **C. `.editorialrc.json` (gitignored)** | `pnpm editorial:capture` | Set once, forget. But adds config-file drift risk and a new ignore entry. |

**Researcher recommendation:** **A + B** — CLI arg wins if provided, env var is fallback, no config file. Matches Unix convention. Fail with an actionable error if neither present.

### Q2. tsconfig composite references

Should `tsconfig.editorial.json` be added to the root `tsconfig.json` `references` array (so `vue-tsc -b` type-checks it on every `pnpm build`)?

**Argument for:** Catches TS errors in the capture tool without a separate script.
**Argument against:** The editorial tool is an on-demand developer utility — gating `pnpm build` on its type correctness couples unrelated things. If the tool breaks, the site build still needs to ship.

**Researcher recommendation:** **Add to references.** Cost is ~0.5s incremental vue-tsc time. Benefit is the TS safety net. `pnpm build` currently also type-checks `scripts/markdown-export/` (per existing setup) without breaking anything — same pattern.

### Q3. Bump Playwright to 1.59.1 now, or stay at 1.58.2?

vitest-browser-vue@^2.1.0 currently pulls Playwright ^1.58.2. Upgrading to 1.59.1 is a minor bump (same major) and should be transparent, but will force a fresh chromium download (1217 → whatever 1.59.1 pins). If we stay at 1.58.2, we're using an older chromium to capture a site built with current tooling — low risk but worth naming.

**Researcher recommendation:** **Bump to 1.59.1.** Patch-level chromium diffs are immaterial for rendering a portfolio site; staying current is free once the download happens.

### Q4. Strikethrough / task lists — do we actually need them?

The portfolio site uses tables (personnel, technologies, findings). It does NOT use strikethrough or GitHub task lists (`- [ ]`). `@joplin/turndown-plugin-gfm` ships all three as a single package; we can either:
- Use the full `gfm` plugin (simpler, includes unused strikethrough/task rules at negligible cost)
- Cherry-pick just `tables` via `import { tables } from '@joplin/turndown-plugin-gfm'`

**Researcher recommendation:** **Full `gfm` plugin.** Zero-cost future-proofing. If the captured output ever contains unexpected `~~strike~~` or `<s>` tags from rich-text content Dan pastes into an exhibit later, it Just Works.

---

## 5. Version Currency Notes

All versions verified against npm registry on **2026-04-19** via `npm view <pkg> version time.modified`.

| Package | Version | Last modified | Source of truth |
|---------|---------|---------------|-----------------|
| `playwright` | 1.59.1 | (latest tag, recent) | npm registry, GitHub repo `microsoft/playwright` |
| `@playwright/test` | 1.59.1 | (matches playwright) | npm registry |
| `playwright-core` | 1.59.1 | (matches playwright) | npm registry |
| `turndown` | 7.2.4 | 2026-04-03 (16 days before research) | npm registry, github.com/mixmark-io/turndown |
| `turndown-plugin-gfm` (rejected) | 1.0.2 | 2022-05-22 (≈4 years stale) | npm registry, github.com/domchristie/turndown-plugin-gfm |
| `@joplin/turndown-plugin-gfm` | 1.0.64 | 2025-10-18 (≈6 months old, actively maintained) | npm registry |
| `@joplin/turndown` (noted, not used) | 4.0.82 | 2025-10-18 | npm registry — Joplin's fork of turndown itself; unused because upstream turndown 7.2.4 is now active again |
| `@types/turndown` | 5.0.6 | 2025-10-26 | npm registry (DefinitelyTyped) |
| `node-html-markdown` (rejected) | 2.0.0 | 2025-11-14 | npm registry, github.com/crosstype/node-html-markdown |
| `@mozilla/readability` (rejected) | 0.6.0 | 2025-03-03 | npm registry, github.com/mozilla/readability |
| `jsdom` (rejected) | 29.0.2 | 2026-04-07 | npm registry |
| `tsx` (existing) | 4.21.0 | existing in package.json | no change |
| `typescript` (existing) | ~5.7.0 | existing in package.json | no change |

### Active-maintenance assertions

- **turndown**: 7.2.3 (2026-04-03) and 7.2.4 (2026-04-03, 3.5 hours later) both shipped on research day -16 → active. 11.1k stars, 109 open issues (healthy for a library this size), 30 open PRs (triaged). Concerns about dormancy between 2018 and 2024 are resolved — 7.2.x cadence has picked up (5 releases since 2024-03). HIGH confidence.
- **@joplin/turndown-plugin-gfm**: 1.0.64 shipped 2025-10-18 → within 12-month freshness window. The `@joplin/*` scope is maintained as part of the Joplin note-taking app's core — it's a downstream consumer with skin in the game. HIGH confidence.
- **playwright**: Major-tech company (Microsoft) product, weekly-to-biweekly releases, 1.59.1 current. HIGH confidence.
- **@types/turndown**: Updated 2025-10-26 to cover current API surface. DefinitelyTyped maintainers ship quickly. MEDIUM-HIGH confidence (always worth a spot-check at install time for drift against turndown 7.2.4's runtime shape).

---

## Summary for Roadmap

**Net adds:** 3 devDependencies (`turndown`, `@joplin/turndown-plugin-gfm`, `@types/turndown`), 1 new tsconfig file, 1 new pnpm script, 1 new directory (`scripts/editorial/`).

**Net bumps:** `playwright` 1.58.2 → 1.59.1 (recommended, not required).

**No:** runtime deps, peer-dep negotiation, workspace config, `.npmrc` changes, native bindings, chromium double-install, jsdom, cheerio, Readability, `@playwright/test`.

**Decision points requiring Dan's lock-in:** Q1 (output path mechanism), Q2 (composite reference), Q3 (Playwright bump), Q4 (full GFM vs tables-only). All four have researcher recommendations; Dan's call.
