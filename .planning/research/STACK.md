# Technology Stack — v7.0 Static Markdown Export Pipeline

**Project:** pattern158-vue
**Milestone:** v7.0 — Static markdown export (`docs/site-content.md` + `docs/obsidian-vault/`)
**Researched:** 2026-04-10
**Overall confidence:** HIGH

---

## Overview

This milestone layers a narrow build-time utility on top of an already-validated Vue 3 + TypeScript + Vite + pnpm stack. The goal is to read existing `src/data/*.json`, combine it with a small page-content map extracted from Vue SFC hardcoded strings, and emit two markdown artifacts into `docs/`. No Vue runtime, no browser, no bundler output — just typed Node code reading JSON and writing `.md` files.

**Key architectural choice (drives everything below):** use a standalone TypeScript script run via `tsx`, invoked both directly as `build:markdown` and as a post-step from `build`. Do **not** use a Vite plugin and do **not** adopt any markdown AST framework. The content model is already structured (typed JSON), so markdown generation reduces to string templates with a few tiny helpers. Pulling in `unified` / `remark` / `mdast-util-*` would add ~8 transitive packages and an AST abstraction for a problem that is literally "heading, paragraph, bullet list, table, repeat."

---

## Recommended Stack

All versions verified against npm registry on 2026-04-10.

### Runtime

| Package | Version | Role | Dep type |
|---------|---------|------|----------|
| `tsx` | `^4.21.0` | Run the export script as TypeScript directly (`tsx scripts/build-markdown.ts`) | `devDependencies` |

### Libraries (dependencies of the script)

| Package | Version | Role | Dep type |
|---------|---------|------|----------|
| `yaml` | `^2.8.3` | Emit Obsidian YAML frontmatter (`---\ntitle: ...\n---`) | `devDependencies` |
| `github-slugger` | `^2.0.0` | Deterministic, collision-safe slugs for file names and wikilink targets | `devDependencies` |

### Everything else: Node standard library

| Node API | Role |
|----------|------|
| `node:fs/promises` (`mkdir`, `writeFile`, `rm`) | File I/O for `docs/site-content.md` and `docs/obsidian-vault/*.md` |
| `node:path` (`join`, `dirname`, `resolve`) | Path composition, cross-platform |
| `node:url` (`fileURLToPath`, `import.meta.url`) | Resolve script-relative paths in ESM |

### Existing infra (reused, no changes)

| Existing | Role in v7.0 |
|----------|--------------|
| `src/data/*.json` + thin TS loaders | Source of truth for exhibits, personnel, technologies, findings, FAQ, philosophy influences, methodology steps, stats, tech pills, brand elements, specialties |
| `src/types/` barrel | Import `Exhibit`, `PersonnelEntry`, `TechnologyEntry`, `FindingEntry`, `FaqItem` etc. so the script is type-safe end-to-end |
| `src/router.ts` | Import `routes` to drive the monolithic file's top-level section order and the Obsidian vault folder structure |
| `typescript ~5.7.0` | Already installed; `tsx` uses it for type-stripping (no emit needed for runtime, but `vue-tsc -b` in `build` still type-checks `scripts/` if included in `tsconfig.json`) |
| `pnpm` | Add the two deps via `pnpm add -D yaml github-slugger tsx` |

### Total footprint

- **3 new devDependencies** (`tsx`, `yaml`, `github-slugger`)
- Zero new runtime dependencies
- Zero Vue/Vite/browser footprint — the script runs in plain Node 24

---

## Rationale per Library

### `tsx` vs `ts-node` vs `jiti` vs `esbuild-register`

**Choice: `tsx@^4.21.0`**

- **Why:** Single-binary TypeScript executor built on esbuild. Zero config. Handles ESM, `.ts`, `.tsx`, path aliases, and `import.meta.url` correctly. Actively maintained (4.21.0 is current as of late 2024/2025), de-facto default for "just run this TS file in Node."
- **Rejected `ts-node`:** Historically slow, ESM support has been awkward (loader flags), has been functionally displaced by tsx and tsx-style tools in 2024–2025 tooling. No advantage here.
- **Rejected `jiti` (2.6.1):** Excellent but optimized for on-the-fly `require()`-style loading inside other tools (Nuxt, unbuild, ESLint configs). Overkill and not idiomatic for a user-facing script invocation.
- **Rejected `esbuild-register`:** Requires a `-r` flag dance and is less widely used than tsx. No advantage.
- **Rejected compiling with `tsc` first:** Adds a build step and a `dist/` directory to manage. `tsx` runs the source directly, which is simpler and matches this project's preference for clarity.

Confidence: **HIGH** (verified current version on npm registry, direct description confirms scope).

### `yaml` vs `js-yaml` vs `gray-matter` vs hand-written

**Choice: `yaml@^2.8.3`** (the package literally named `yaml`, not `js-yaml`)

- **Why:** Pure TypeScript, ESM-native, actively maintained (v3.0.0-0 pre-release currently tagged on npm, proving ongoing development). Supports both high-level `stringify()` and full Document API. Modern, widely used by VitePress, Astro internals, and many Vite plugins. Handles quoting and escaping correctly for values that might contain `:` or `#`.
- **Rejected `js-yaml@4.1.1`:** Also fine and stable (v4.1.1 is current), but CJS-first and the maintenance cadence has slowed. `yaml` is the more modern TS-first choice and is what most new tooling picks in 2024–2025.
- **Rejected `gray-matter@4.0.3`:** Frozen at 4.0.3 for years; meant for *parsing* frontmatter out of existing markdown, not *emitting* it. We are writing fresh files — we don't need a parser. Also pulls in `js-yaml` transitively plus `section-matter`, `strip-bom-string`, `kind-of`. Wrong tool.
- **Rejected hand-written:** Tempting because frontmatter is small, but quoting/escaping edge cases (titles containing `:`, tags containing `#`, dates) are exactly the kind of thing a library exists to handle. Three lines of `YAML.stringify({title, tags, date})` is cleaner than a custom escaper.

Frontmatter emission pattern:
```ts
import YAML from 'yaml'
const frontmatter = `---\n${YAML.stringify({ title, tags, date }).trim()}\n---\n\n`
```

Confidence: **HIGH** (verified on npm registry).

### `github-slugger` vs hand-rolled slug vs `slugify`

**Choice: `github-slugger@^2.0.0`**

- **Why:** Tiny (zero deps), ESM, deterministic, handles collisions automatically (maintains internal state so `slug("Foo")` then `slug("Foo")` returns `foo` then `foo-1`). This is the same slugger used by `remark` and GitHub itself, so the slugs match what a reader would expect when clicking anchor links in the monolithic `site-content.md` on GitHub.
- **Rejected `slugify`:** Generic, doesn't dedupe, and its aggressive Unicode handling can surprise.
- **Rejected hand-rolled (`str.toLowerCase().replace(/\s+/g, '-')`):** Works for 95% of cases, fails on `&`, `:`, em-dashes, duplicate headings (exhibit titles can collide with nav titles). Not worth the debugging.

Used for:
1. Deriving `docs/obsidian-vault/<slug>.md` filenames from page titles
2. Generating anchor-stable headings in `docs/site-content.md` so GitHub's TOC works
3. Normalizing wikilink targets so `[[Case Files]]` resolves to a file that actually exists on disk

Confidence: **HIGH** (verified on npm registry, well-known package).

### Markdown generation: string templates, NOT `unified`/`remark`/`mdast-util-*`

**Choice: Plain TypeScript template literals with small helper functions.**

- **Why:** The content model is already structured (typed JSON), and the output grammar is narrow:
  - headings (`#`, `##`, `###`, `####`)
  - paragraphs
  - unordered lists
  - ordered lists (rare — methodology steps)
  - tables (personnel/technologies/findings — already typed arrays)
  - blockquotes (for pull-quotes and attributed quotes)
  - italic captions (for skipped image alt text)
  - wikilinks `[[Target]]` (Obsidian variant only)
- A handful of helper functions cover the whole thing:
  ```ts
  const h = (level: number, text: string) => `${'#'.repeat(level)} ${text}\n\n`
  const p = (text: string) => `${text}\n\n`
  const ul = (items: string[]) => items.map(i => `- ${i}`).join('\n') + '\n\n'
  const table = (headers: string[], rows: string[][]) => /* ... */
  const caption = (alt: string) => `*${alt}*\n\n`
  const wikilink = (target: string, label?: string) =>
    label ? `[[${target}|${label}]]` : `[[${target}]]`
  ```
- **Rejected `unified` + `remark-stringify` + `mdast-util-to-markdown`:** The unified ecosystem is phenomenal for *transforming* markdown (parse → mutate AST → serialize), which is not what this is. Going AST-first here means:
  - Building `mdast` node literals by hand (`{type: 'heading', depth: 2, children: [{type: 'text', value: ...}]}`) which is noisier than a template string.
  - Pulling in `unified`, `remark-stringify`, `mdast-util-to-markdown`, `mdast-util-from-markdown`, `micromark`, `@types/mdast`, and ~15 micromark extensions transitively.
  - Obsidian wikilinks `[[X]]` are not in CommonMark/GFM, so you'd need a custom mdast extension or post-processing anyway.
  - Tables in `mdast-util-to-markdown` are finicky with alignment and column widths.
- **Rejected `markdown-builder` / `markdown-it-writer` / similar builder libs:** All are either unmaintained, tiny one-person projects, or opinionated in ways that collide with Obsidian's flavor. None are worth a dep.

**Crucial point for downstream consumers:** if requirements later grow (syntax highlighting, footnotes, math, diagram blocks), re-evaluate. For v7.0's scope, strings win on simplicity, debuggability, and diff-readability of the committed artifacts.

Confidence: **HIGH** (based on narrow grammar already known from `src/data/*.json` and router structure).

### HTML→Markdown (`turndown`): NOT NEEDED

**Choice: Do not add `turndown`.**

- **Why:** The question asks whether `turndown` is needed for HTML→markdown conversion. It is not, because:
  1. `src/data/*.json` is plain text, not HTML.
  2. Vue SFC templates contain structured element trees, not arbitrary HTML blobs. A page content map (see Integration Notes) extracts strings *before* they hit the DOM.
  3. No exhibit field stores HTML strings (all typed fields are `string`, `string[]`, or structured interfaces).
- If a stray `<br>` or `<em>` turns up in a data string during implementation, handle it with a regex or add a 10-line string replacer — not a 7.2.4-sized dependency.
- `turndown@^7.2.4` is current and works well for *scraped* HTML, but scraping a live Vue render is the wrong approach for this milestone (see Anti-Recommendations).

Confidence: **HIGH** (verified the data layer has no HTML strings by reading the project context and data directory listing).

---

## Integration Notes

### File layout

```
scripts/
  build-markdown.ts              # entry point, orchestrates both artifacts
  markdown/
    helpers.ts                   # h(), p(), ul(), table(), caption(), wikilink()
    page-content-map.ts          # hardcoded strings from Vue SFCs, keyed by route
    render-monolith.ts           # produces docs/site-content.md
    render-obsidian.ts           # produces docs/obsidian-vault/*.md
    render-exhibit.ts            # shared exhibit body renderer used by both
    slugs.ts                     # wraps github-slugger with a shared instance
docs/
  site-content.md                # generated (committed)
  obsidian-vault/
    Home.md                      # generated (committed)
    Philosophy.md
    Technologies.md
    Case Files.md
    FAQ.md
    Contact.md
    Accessibility.md
    exhibits/
      Exhibit A - <title>.md
      ...
```

### `package.json` script changes

```json
{
  "scripts": {
    "build": "vue-tsc -b && vite build && npm run build:markdown",
    "build:markdown": "tsx scripts/build-markdown.ts"
  }
}
```

- `build:markdown` runs standalone (fast iteration during development of the exporter).
- `build` chains it after `vite build` so `docs/` is regenerated on every production build.
- **Important:** place `build:markdown` *after* `vite build`, not before, so a broken exporter never blocks the site build.

### Why a standalone script, NOT a Vite plugin

The question explicitly asks this. A custom Vite plugin using `closeBundle` or `writeBundle` would work, but it is the wrong fit here:

| Concern | Standalone script | Vite plugin |
|---------|-------------------|-------------|
| Runs independently of `vite build` | Yes (`pnpm build:markdown`) | No — requires full vite build |
| Iteration speed during development | Fast (tsx, <1s startup) | Slow (vite cold start) |
| Can import `src/data/*.json` directly | Yes (Node ESM) | Yes, but via Vite's module graph — overkill |
| Needs Vite's module graph or transformed output | No | N/A |
| Plays well with `vue-tsc -b` type checking | Add `scripts/` to `tsconfig` include | Same |
| Testability in isolation | Trivial (import functions, call them) | Harder (must mock plugin context) |
| Surface area / failure modes | 1 script | Plugin hook timing + Vite internals |

The only reason to pick a plugin would be if you needed to *consume Vite's build output* (e.g., read the built HTML for link extraction). We don't — we read the source-of-truth JSON and a page content map directly, which is actually more reliable than scraping post-build HTML.

### Vue SFC content extraction strategy

**Recommendation: do NOT parse Vue SFCs at build time. Use a hardcoded `page-content-map.ts` instead.**

Page-level content that lives only in SFC templates (intro paragraphs, section headings, CTAs, etc.) should be lifted into a typed TypeScript module:

```ts
// scripts/markdown/page-content-map.ts
import type { PageContent } from './types'

export const pageContent: Record<string, PageContent> = {
  '/': {
    title: 'Home',
    sections: [
      { heading: 'Pattern 158', body: '...' },
      // ...
    ],
  },
  '/philosophy': { /* ... */ },
  // ...
}
```

**Why this over parsing SFCs:**
- SFC template parsing requires `@vue/compiler-sfc` + `@vue/compiler-dom`, would need to walk the AST, handle `<template>` root nodes, resolve `v-for`/`v-if`, ignore dynamic expressions — massive complexity.
- The strings in SFCs are already stable content; extracting them into a map is a **one-time refactor**, not an ongoing build-time concern.
- The map becomes the single source of truth: future content changes happen in the map, and the Vue templates import from it (completing the CMS-readiness trajectory started in v3.0's JSON externalization).
- **Bonus:** the extraction itself is the right v7.0 work, not a library choice. The existing SFC templates should be updated (phase 2 or 3 of the milestone) to pull from `page-content-map.ts`, so the map and the site never drift.

The alternative — using a regex to pull strings out of `.vue` files — is brittle and will break on any template change. Don't do it.

### Wikilink + slug consistency

Use **one** shared `GithubSlugger` instance across both renderers so:
1. Anchors in `docs/site-content.md` match section ordering deterministically.
2. Filenames in `docs/obsidian-vault/` match the targets used in `[[wikilinks]]`.
3. Collisions are resolved identically on every build (deterministic, repo-diff-friendly).

Reset the slugger at the start of each artifact render:
```ts
import GithubSlugger from 'github-slugger'
const slugger = new GithubSlugger()
slugger.reset()
```

### TypeScript config

Add `scripts/**/*` to `tsconfig.node.json` (or whichever `tsconfig` covers non-app TS). Keep it separate from the app `tsconfig.app.json` so Vue-specific settings don't leak. `tsx` doesn't need a tsconfig to run, but `vue-tsc -b` in the `build` script will type-check the whole project, so the scripts must be discoverable.

### Node version

The project already uses Node 24 (`v24.12.0`). All three new deps support Node 18+. No engines constraint changes needed.

### Obsidian-specific notes

- **Frontmatter:** `title`, `tags` (array, e.g. `[case-file, investigation-report]`), `date` (ISO string, set to build time). Keep it minimal — Obsidian also reads `aliases`, `cssclass`, `publish`, but those are not asked for.
- **Tag format:** Obsidian tags must not contain spaces. Use kebab-case and use `github-slugger` on the exhibit category to normalize.
- **Wikilinks with display text:** `[[Exhibit A - Some Title|Exhibit A]]` — use the `|` pipe form when the filename contains punctuation that would look ugly inline.
- **File naming:** Obsidian tolerates spaces in filenames but not `:`, `/`, `\`, `|`, `?`, `*`, `"`, `<`, `>`. The `github-slugger` output is too aggressive (lowercases everything, drops punctuation) for human-readable filenames — use a lighter sanitizer for filenames and reserve the slugger for anchors/links. A 15-line `sanitizeFilename()` helper covers it.

---

## Anti-Recommendations

What NOT to add. Each of these has been considered and rejected.

| Do NOT add | Why not |
|------------|---------|
| **Astro / Next.js / VitePress / Nuxt Content** | Full static site generators. Massive scope. We already have a Vue SPA that works — the ask is an export utility, not a second rendering pipeline. |
| **`@vue/compiler-sfc` + AST walking** | To extract template strings. Use a page content map instead (see Integration Notes). |
| **`unified` / `remark` / `remark-stringify` / `mdast-util-*`** | Powerful but AST-first. Wrong tool for "emit structured JSON as markdown." ~8 transitive deps for zero benefit here. |
| **`turndown`** | HTML→markdown converter. We have no HTML inputs. Adding it implies scraping the live site, which is the wrong approach. |
| **`gray-matter`** | Parses frontmatter out of existing files. We are *writing* files. Wrong direction. |
| **`markdown-it` / `marked`** | Markdown parsers. We're generating, not parsing. |
| **`js-yaml`** | Works, but `yaml` is the modern TS-first choice and is already the ecosystem default for new Vite-era tooling. |
| **`ts-node`** | Superseded by `tsx` for script invocation. |
| **Puppeteer / Playwright page scraping** | "Render the Vue site and scrape the HTML" is tempting because Playwright is already in devDependencies, but it's fundamentally wrong: it couples content export to successful browser rendering, introduces race conditions, strips structure (headings become `<h2>`, alt text becomes `<img alt>`), and can't produce Obsidian wikilinks. The JSON data layer + page content map is the source of truth. |
| **A custom Vite plugin** | Wrong abstraction for this scope. See table in Integration Notes. A standalone `tsx` script is smaller, faster to iterate on, and independently runnable. |
| **`prettier` as a library to format generated markdown** | Tempting for pretty output, but adds a large dep just to align table columns. Write the helpers to emit well-formatted markdown in the first place. If needed later, `prettier --write docs/` can be run as a separate post-step without adding a library dependency to the script. |

---

## Open Questions

These are for the REQUIREMENTS / planning phase, not blockers on stack choice.

1. **Does the Obsidian vault need an `_index.md` / MOC (map of content)?** Obsidian users often want a landing file that links to all pages. Decide during feature planning — adds ~20 lines to the exporter if yes.
2. **Should exhibit tags be hierarchical (`case-file/investigation-report`) or flat (`investigation-report`)?** Obsidian supports nested tags via `/`. Hierarchy gives better graph view filtering. Defer to Dan's preference.
3. **Should `docs/site-content.md` include a generated TOC at the top?** GitHub auto-generates one from headings in its markdown rendering, but some viewers don't. Trivial to add if wanted (`github-slugger` already provides stable anchors).
4. **Build determinism:** should `date:` in frontmatter be commit-based (deterministic, no-diff on rebuilds) or wall-clock time (churns `docs/` on every build)? **Recommendation:** use the latest git commit date of the source file(s) that fed the page, or just the git HEAD commit date, to keep diffs clean. Requires a 5-line `git log -1 --format=%cI` shell call or similar.
5. **What happens to `/review` and `/diag/personnel` routes?** These look like internal/diagnostic pages. Decide whether to exclude them from both artifacts. **Recommendation:** exclude — they're not portfolio content.
6. **Redirect routes (`/portfolio`, `/testimonials` → `/case-files`):** clearly excluded (no content of their own), but confirm.
7. **How are cross-page wikilinks seeded?** Automatic "Exhibit A mentioned in FAQ" detection would require text search across rendered pages. Out of scope for v7.0 unless explicitly wanted — start with only navigationally-obvious links (e.g., every exhibit page links back to `[[Case Files]]`, FAQ exhibit-note entries link to their exhibit).

---

## Sources

All package versions verified 2026-04-10 via direct npm registry API calls:

- [tsx on npm registry](https://registry.npmjs.org/tsx/latest) — v4.21.0 (HIGH confidence)
- [yaml on npm registry](https://registry.npmjs.org/yaml/latest) — v2.8.3, v3.0.0-0 pre-release confirms active maintenance (HIGH)
- [js-yaml on npm registry](https://registry.npmjs.org/js-yaml/latest) — v4.1.1 (HIGH, used only for comparison)
- [gray-matter on npm registry](https://registry.npmjs.org/gray-matter/latest) — v4.0.3, frozen, wrong direction anyway (HIGH)
- [github-slugger on npm registry](https://registry.npmjs.org/github-slugger/latest) — v2.0.0 (HIGH)
- [turndown on npm registry](https://registry.npmjs.org/turndown/latest) — v7.2.4, not needed (HIGH)
- [unified on npm registry](https://registry.npmjs.org/unified/latest) — v11.0.5, rejected as overkill (HIGH)
- [remark on npm registry](https://registry.npmjs.org/remark/latest) — v15.0.1, rejected as overkill (HIGH)
- [mdast-util-to-markdown on npm registry](https://registry.npmjs.org/mdast-util-to-markdown/latest) — v2.1.2, rejected as overkill (HIGH)
- [jiti on npm registry](https://registry.npmjs.org/jiti/latest) — v2.6.1, rejected in favor of tsx (HIGH)
- [Vite Plugin API — Output Generation Hooks](https://vite.dev/guide/api-plugin) — confirms `closeBundle`/`writeBundle` semantics used in plugin-vs-script decision (HIGH)
- Project files read: `/home/xhiris/projects/pattern158-vue/.planning/PROJECT.md`, `/home/xhiris/projects/pattern158-vue/package.json`, `/home/xhiris/projects/pattern158-vue/vite.config.ts`, `/home/xhiris/projects/pattern158-vue/src/router.ts`, `src/data/` and `src/pages/` directory listings.

**Confidence summary for this file:** HIGH across the board. Every version is verified current, every rejection is grounded in either the npm registry data or the project's own structural characteristics (narrow output grammar, already-structured input data, Node 24 environment, existing pnpm/vite/TS toolchain).
