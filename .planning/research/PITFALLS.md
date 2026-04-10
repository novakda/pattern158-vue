# Domain Pitfalls — Static Markdown Export Pipeline (v7.0)

**Domain:** Build-time markdown export from Vue 3 + Vite + TypeScript SPA to monolithic `.md` + Obsidian vault
**Researched:** 2026-04-10
**Stack under consideration:** Vue 3.5, Vite 6.2, TypeScript 5.7 (`"type": "module"`, `moduleResolution: "bundler"`, `paths: { "@/*": ["./src/*"] }`), data in `src/data/json/*.json` with thin TS loaders, content partially hardcoded in `.vue` SFCs
**Overall confidence:** MEDIUM-HIGH — Obsidian rules, tsx/esbuild path handling, and Node import attributes verified against official sources; markdown generation, determinism, and commit-generated-files guidance drawn from well-established community practice.

> Format note: each pitfall has **Description, Why It Happens, Prevention, Detection, Phase Hint, Severity**.
> `warn` severity = log a warning and continue; `block` severity = CI/pre-commit must fail hard.
> Phase hints: **foundation** (script runtime + content model, earliest phases), **implementation** (renderers, frontmatter, wikilinks), **polish** (determinism, CI guards, testing hardening).

---

## 1. Vite / Node / TypeScript Runtime Traps

### 1.1 `@/` path alias silently breaks when the script runs outside Vite

**Description:** The script imports `import { exhibits } from '@/data/exhibits'` and works in `vite dev`, `vite build`, and inside Storybook — but `tsx scripts/build-markdown.ts` explodes with `Cannot find module '@/data/exhibits'`.

**Why It Happens:**
- `@/` is a Vite `resolve.alias` AND a TypeScript `paths` entry. Both are **build-time conveniences**; neither is understood by Node's ESM resolver at runtime.
- tsx uses esbuild in *transform* mode, not *bundle* mode. Per esbuild docs: "using esbuild for import path transformation requires bundling to be enabled, as esbuild's path resolution only happens during bundling." (HIGH confidence — esbuild official docs). So tsx does **not** automatically resolve `tsconfig.paths` for you in the way most devs assume.
- TypeScript's `paths` is a type-checking hint only; it emits nothing at runtime.
- `moduleResolution: "bundler"` makes this worse — it silences TS errors about unresolvable aliases because it assumes a bundler will deal with it.

**Prevention:**
- **Pick ONE rule** for the markdown script's source files and enforce it:
  - Option A (recommended): use **relative imports only** inside `scripts/build-markdown/**`. No `@/` anywhere in that subtree. Add an ESLint rule scoped to `scripts/**` that forbids `@/` imports.
  - Option B: run the script via Vite itself using `vite-node scripts/build-markdown.ts` or a small Vite plugin hooked into `closeBundle`. This gets alias resolution for free but couples the script to Vite's lifecycle (see 1.4).
- If Option A is chosen, add a `scripts/tsconfig.json` that extends the root but sets `"paths": {}` so `@/` resolves nowhere — this turns the alias into a type error in scripts, not just a runtime crash.
- Do NOT try to patch this with `tsconfig-paths/register` — that package does not work cleanly with pure ESM (`"type": "module"`) without contortions and it's a time sink.

**Detection:** First run of the script in CI after someone adds an `@/` import. Add a CI step that runs the script in a clean checkout (`npm ci && npm run build:markdown`) before the Vite build, so aliasing failures surface independently of Vite's cache.

**Phase Hint:** foundation
**Severity:** block

---

### 1.2 `"type": "module"` + `.ts` script + JSON import = footgun trio

**Description:** The script tries `import exhibits from '../src/data/json/exhibits.json'` and crashes with either `Unknown file extension ".json"`, `Module needs an import attribute of "type: json"`, or (on older examples) `import assertions are not supported`.

**Why It Happens:**
- `package.json` has `"type": "module"`, so every `.js`/`.ts` is ESM by default.
- Node ≥ 22 **dropped** `assert { type: 'json' }` and **requires** `with { type: 'json' }`. Node 20.10+ / 18.20+ added the `with` form. (HIGH confidence — Node.js official docs.)
- Blog posts and Stack Overflow answers written between 2022 and early 2024 use the old `assert` form, which now throws a syntax error on Node 22+.
- Vite + TS consumers (`src/data/*.ts`) happily use `import foo from './json/foo.json'` with no attribute because Vite rewrites JSON imports at build time. That pattern will NOT survive outside Vite.

**Prevention:**
- Use `with { type: 'json' }` everywhere in scripts. Document Node ≥ 20.10 as the minimum and add an `engines.node` field to `package.json`.
- OR simply `await readFile(url, 'utf8').then(JSON.parse)` in the script — more verbose but zero syntax-version risk and it sidesteps TypeScript's JSON-module type noise entirely.
- **Recommended:** the script reads JSON via `fs.readFile` + `JSON.parse`, treats JSON files as data not modules, and imports only TypeScript **types** from `src/types/`.

**Detection:** Run the script under the CI Node version explicitly; don't rely on whatever Node happens to be on a dev laptop.

**Phase Hint:** foundation
**Severity:** block

---

### 1.3 tsx vs ts-node vs vite-node — choosing wrong locks you in

**Description:** Team picks `ts-node` because it's familiar, then spends a day fighting ESM-loader flags, then swaps to `tsx`, then discovers tsx doesn't resolve `@/` aliases, then swaps to `vite-node`, then discovers `vite-node` pulls Vue SFC plugins into the runtime unnecessarily. Meanwhile `PLAN.md` still says "use ts-node."

**Why It Happens:** Each runner has different trade-offs that aren't obvious until you hit them:

| Runner     | ESM native | Resolves tsconfig `paths` | Pulls Vite plugins | Startup |
|------------|------------|---------------------------|--------------------|---------|
| tsx        | yes        | **no** (esbuild transform mode — HIGH confidence) | no                 | fast    |
| ts-node    | painful w/ `type:module` | only with extra loader | no | slow |
| vite-node  | yes        | yes (via Vite resolve)    | yes (applies full Vite config) | medium |

**Prevention:**
- **Decide in foundation phase, write it in PLAN.md, don't revisit.**
- Recommended default for this project: **tsx + relative imports** (see 1.1). It's already the lowest-friction choice given the existing toolchain and avoids dragging `@vitejs/plugin-vue` into a script that does not touch `.vue` files.
- If the script ever needs to parse an actual `.vue` SFC (see 2.1), reconsider vite-node at that point — not before.

**Detection:** A `build:markdown` npm script that's been edited more than twice in the first week is the warning sign.

**Phase Hint:** foundation
**Severity:** warn

---

### 1.4 Wiring into `npm run build` the wrong way

**Description:** The markdown script is glued to the Vite build as `"build": "vue-tsc -b && vite build && tsx scripts/build-markdown.ts"`. Later someone runs `vite build` directly (or a deploy script does), and the markdown output is silently skipped.

**Why It Happens:**
- npm-script concatenation is invisible to anything that calls Vite directly (Storybook, Wrangler preview, CI steps, future SSG plugins).
- The shell `&&` form also means a failing markdown step aborts the deploy, which may or may not be desired.

**Prevention:**
- Make the markdown generator a **Vite plugin with a `closeBundle` or `writeBundle` hook** so it runs for every `vite build`, no matter who calls it. `closeBundle` fires after Vite finishes writing all outputs.
- OR keep it as a standalone script but guard it with a CI assertion: "after `npm run build` the git working tree must be clean" (see 6.1).
- Do NOT attach it to `postbuild` in `package.json` — npm `postbuild` runs only for `npm run build`, not `pnpm build`, not direct `vite build`, not for `npm run deploy` if that skips `build`.

**Detection:** Run `vite build` directly (bypassing npm script) in a test and diff `docs/`. If `docs/` changes, the script wasn't attached to Vite itself.

**Phase Hint:** foundation
**Severity:** warn

---

### 1.5 Running inside a Vite plugin hook vs a separate process — hidden coupling

**Description:** The Vite plugin approach (1.4) looks clean but the plugin reaches into `src/data/json/*.json` via `fs` instead of Vite's module graph. Later someone adds a data transform at import time in a `src/data/*.ts` loader (e.g. sorting, computed fields). The markdown output now disagrees with the rendered site because the plugin bypassed the loaders.

**Why It Happens:** Vue components see **loader-processed** data; a plugin that reads raw JSON sees **pre-processed** data. This drift is silent until someone notices the exhibit order in the markdown doesn't match the site.

**Prevention:**
- Treat JSON files as the source of truth. Forbid any transformation (sort, filter, computed fields) in `src/data/*.ts` loaders. Loaders may only: import JSON, `as` assert types, re-export. This rule already exists implicitly in v3.0's thin-loader decision — make it explicit in v7.0's PLAN.md.
- If ordering matters, bake it into the JSON file. If a computed field is needed, compute it identically in both the loader and the markdown generator, and unit-test the equivalence.
- Alternative: have the markdown generator import the same loader modules (via vite-node) so both consumers go through one code path. Adds coupling — use only if the "no transforms in loaders" rule can't hold.

**Detection:** Add a unit test: pick 3 exhibits, assert that `loader.exhibits[i].title === JSON.parse(readFile(...)).exhibits[i].title` and same for any ordering-sensitive field.

**Phase Hint:** foundation
**Severity:** block

---

## 2. Content-Sync Drift Between JSON, Vue SFCs, and Markdown Output

### 2.1 Content hardcoded inside Vue templates is invisible to the extractor

**Description:** `HomePage.vue` has a `<p>` with the project's tagline hardcoded in template markup. The markdown generator reads only `src/data/json/*.json`, so the monolithic `site-content.md` silently omits the homepage tagline. Nobody notices until a hiring manager reads the doc and asks "why does the site say X but the doc say nothing?"

**Why It Happens:**
- PROJECT.md confirms content is split between JSON data files and hardcoded Vue template strings. The extractor has to reconcile both.
- Parsing `.vue` SFCs from a Node script is non-trivial: `@vue/compiler-sfc` can give you the template AST, but extracting *prose* from an interpolation-laden template is error-prone (bindings, v-if branches, slot content, child components that own text).
- Regex scraping `.vue` files is fragile and silently drops whole branches on template edits.

**Prevention (pick ONE and enforce):**
- **Option A (recommended): "JSON-first" rule.** Any text destined for the markdown export MUST live in JSON or a dedicated `src/data/json/pageContent.json` map. Vue templates may only render JSON fields or structural/UI strings (button labels, aria-labels) that don't belong in docs. Audit every `.vue` page in foundation phase and extract prose strings before any generator code is written. Block new hardcoded prose with a lint rule (`no-restricted-syntax` or a custom check) that flags string literals over N characters in `<template>`.
- **Option B: "page content map" file.** Create `src/data/json/pageContent.json` keyed by page route with all prose the exporter needs. Vue pages import from it; exporter reads the same file. Lower migration effort than Option A but requires discipline to keep templates from drifting back to hardcoded strings.
- Do NOT parse `.vue` SFCs with `@vue/compiler-sfc` in the exporter unless you're prepared to maintain a small AST walker. This almost always escalates into a maintenance pit.

**Detection:**
- Manual audit in foundation phase: grep every `.vue` page for string literals longer than ~40 chars inside `<template>` blocks. Everything that shows up is potential drift.
- After migration: a CI check that greps `src/pages/**/*.vue` for text nodes >40 chars under `<template>` and fails if any survive outside an approved allowlist.

**Phase Hint:** foundation (audit), implementation (enforcement)
**Severity:** block (for the audit — if this isn't done first, the rest of the milestone builds on sand)

---

### 2.2 Silent drift after content edits — no "did you regenerate?" check

**Description:** Dan edits `src/data/json/exhibits.json` to fix a typo, commits the JSON but forgets `npm run build:markdown`. The committed `docs/site-content.md` now disagrees with the site. This repeats until docs rot completely.

**Why It Happens:** Humans forget. Pre-commit hooks are per-machine. CI usually runs *after* the PR already looks "done."

**Prevention:**
- **CI guard (must-have):** A `verify-markdown` CI job runs `npm run build:markdown` on a clean checkout, then `git diff --exit-code docs/`. Any drift fails the PR. This is the single most valuable pitfall mitigation in this entire milestone.
- **Pre-commit hint (nice-to-have):** A `lint-staged`/husky hook warns (not blocks) if staged JSON in `src/data/json/**` changed but nothing in `docs/` did. Advisory only — hard enforcement happens in CI.
- **Never** edit `docs/site-content.md` or files in `docs/obsidian-vault/` by hand. Put a prominent `<!-- GENERATED FILE — DO NOT EDIT. Source: src/data/json/**. Regenerate: npm run build:markdown -->` header on the monolithic file, and an `# DO NOT EDIT` admonition in the Obsidian vault's `README.md`.

**Detection:** The CI guard above. Additionally: a monthly audit step that regenerates in a clean clone and diffs — catches drift even if CI was accidentally bypassed.

**Phase Hint:** polish
**Severity:** block

---

### 2.3 Partial regeneration — only-changed-files optimization corrupts the vault

**Description:** To speed up the generator, someone adds "only regenerate files whose source changed." A later refactor renames a heading in `src/data/json/faq.json` — the per-page FAQ note regenerates, but the monolithic `site-content.md` (which also contains that heading) doesn't, because its "source" was unchanged by a naive mtime check.

**Why It Happens:** Incremental generation is attractive but the dependency graph is one-to-many: a single JSON file feeds both the monolithic artifact and an Obsidian-per-page file. Getting invalidation right is a caching problem.

**Prevention:**
- **Do not optimize.** Regenerate 100% of outputs every run. At this scale (~9 pages + 15 exhibits ≈ 25 files), full regeneration is O(ms). Incremental regen saves nothing and introduces a correctness bug surface.
- Forbid any mtime/hash-based "skip unchanged" logic in the generator for v7.0. Document this as a constraint in PLAN.md.

**Detection:** Code review. If a PR adds any file-change detection in the generator, block it.

**Phase Hint:** polish
**Severity:** warn (blocks if introduced)

---

## 3. Determinism & Idempotency

### 3.1 `Object.keys` / `Set` / `Map` iteration order ≠ guaranteed order

**Description:** Frontmatter tags come out as `[vue, typescript, design]` one day and `[typescript, vue, design]` the next. Every PR now has a noisy `docs/` diff. Review fatigue sets in, real changes get lost.

**Why It Happens:**
- `Set` iteration order is insertion order, which depends on how the generator happened to visit sources — which in turn depends on filesystem enumeration, concurrent Promise resolution, or `Object.keys` on the incoming JSON.
- `Object.keys` preserves insertion order for string keys, but that order is whatever the JSON parser produced, which is not alphabetical.
- `Promise.all` on a list of reads can resolve in a non-deterministic order if any step is async.

**Prevention:**
- **Sort everything that becomes an ordered list in output**, with an explicit comparator:
  - Frontmatter keys: fixed canonical order (`title`, `aliases`, `tags`, `date`, `category`, then everything else alphabetically).
  - Tag arrays: `.sort((a, b) => a.localeCompare(b, 'en'))` — and pass the explicit locale to avoid host-locale drift.
  - Exhibit ordering in the monolithic doc: sort by `id` (or whatever the JSON slug is), not by filesystem order.
  - `Set` and `Map` output: convert to sorted array before rendering.
- Use a YAML serializer that lets you **specify key order** (e.g. `js-yaml` with a custom `sortKeys` function). Don't rely on default serializer order.
- **Never** use `Promise.all(paths.map(read))` for an ordered output — use a sequential loop or sort the results after.

**Detection:** Run the generator twice back-to-back in CI and `diff -r` the outputs. Any difference = a determinism bug. Add this as a CI step (cheap — two runs of a 25-file generator).

**Phase Hint:** polish
**Severity:** block

---

### 3.2 `Date.now()` / build-time timestamps in frontmatter

**Description:** Frontmatter gets a `date: 2026-04-10T14:23:17.492Z`. Every `npm run build:markdown` produces a new diff even when nothing changed. Eventually someone disables the CI guard in 2.2 "because it's too noisy," and drift protection dies.

**Why It Happens:** "Add a build timestamp" sounds harmless and Obsidian's default templates include a `date` property, so it feels idiomatic. It is incompatible with a commit-generated-files workflow.

**Prevention:**
- **Forbid `Date.now()`, `new Date()`, `process.hrtime`, and `performance.now()` in the generator output.** Add a grep-based lint in CI: `grep -rE 'Date\.now|new Date\(' scripts/build-markdown && exit 1`.
- If a `date` frontmatter field is genuinely useful:
  - Use the **last git commit date** of the *source* JSON file (`git log -1 --format=%cI -- path/to/file.json`) as an ISO date-only string (strip time).
  - OR use a hand-maintained `publishedAt` / `updatedAt` field in the source JSON.
  - OR omit `date` entirely. This is the safest default. Obsidian does not require it.
- Pin the timezone if you keep a date: format as UTC `YYYY-MM-DD`, never local-time.

**Detection:** Run generator twice with a 1-second sleep between runs, diff output, expect zero changes.

**Phase Hint:** polish
**Severity:** block

---

### 3.3 Floating-point / locale-dependent number formatting

**Description:** Stats like "28+ years" render as `28.0` on one machine and `28` on another, or `1,234` vs `1234`, because the generator used `num.toLocaleString()` without a locale.

**Why It Happens:** `toLocaleString()` reads the host OS locale. CI runners, dev laptops, and WSL shells will disagree.

**Prevention:**
- Always pass an explicit locale: `num.toLocaleString('en-US', { ... })`.
- For integers destined for prose, prefer `String(num)` and hand-format. Reserve `toLocaleString` for values where grouping separators actually matter.
- Same rule applies to any `Intl.*` formatter — pin locale + options.

**Detection:** Same two-run diff as 3.1.

**Phase Hint:** polish
**Severity:** warn

---

### 3.4 Non-deterministic line endings (CRLF vs LF)

**Description:** Generated files land with LF on a Linux CI runner and CRLF when someone regenerates on Windows. Every cross-platform commit becomes a whole-file diff.

**Why It Happens:**
- Node's `fs.writeFile` writes whatever you give it. Templates using `\n` directly are fine; templates using `os.EOL` or backtick-embedded CR are not.
- Git's `core.autocrlf` + unconfigured `.gitattributes` can rewrite on checkout or commit.

**Prevention:**
- Generator always writes `\n` literals. Never `os.EOL`, never `\r\n`.
- Add to `.gitattributes`: `docs/** text eol=lf` and `*.md text eol=lf`.
- Final output always ends with **exactly one** trailing newline (POSIX). No trailing whitespace on any line (strip before write).

**Detection:** Two-run diff on a Windows machine and a Linux runner; files must byte-match.

**Phase Hint:** polish
**Severity:** warn

---

## 4. Obsidian-Specific Traps

> All rules below verified against Obsidian official help: Internal Links, Tags, and Properties pages (publish-01.obsidian.md mirror). Confidence HIGH unless noted.

### 4.1 Wikilink collision when two notes share a basename

**Description:** `docs/obsidian-vault/pages/Philosophy.md` and `docs/obsidian-vault/exhibits/Philosophy.md` (say, an exhibit renamed in a refactor) both exist. A wikilink `[[Philosophy]]` resolves to whichever Obsidian indexed first. Clicking it from the other file jumps to the wrong note.

**Why It Happens:**
- Obsidian resolves `[[Basename]]` to **any note with that basename in the vault**, regardless of folder. When two notes share a basename, resolution is ambiguous and Obsidian picks one (usually shortest-path, but this is not guaranteed across versions).
- Our vault export has two namespaces (pages/ and exhibits/) that can absolutely collide — exhibit titles can match page titles, and individual FAQ notes could collide with future content.

**Prevention:**
- **Every generated note has a globally unique basename.** Enforcement options:
  - Prefix exhibit notes: `Exhibit A - Flagship.md`, not `Flagship.md`.
  - Prefix page notes with namespace if ambiguous: `Page - Philosophy.md` vs `Exhibit - Philosophy.md`.
  - OR use **full-path wikilinks** everywhere: `[[exhibits/Philosophy|Philosophy]]`. Obsidian supports this and it disambiguates. But it requires discipline in every link the generator emits.
- **Uniqueness check in the generator:** build a `Map<basename, filepath>`, assert no collisions, fail the build with a clear message if any exist. This is cheap and catches the bug before it ships.

**Detection:** The generator's uniqueness assertion. Also: run `find docs/obsidian-vault -name '*.md' | xargs -n1 basename | sort | uniq -d` in CI and fail on any output.

**Phase Hint:** implementation
**Severity:** block

---

### 4.2 Reserved characters in Obsidian filenames and wikilinks

**Description:** Exhibit title contains `:` (e.g. "Pattern 158: Origin Story"). Generator naively writes `Pattern 158: Origin Story.md`. Obsidian refuses to accept it on some platforms, or the wikilink `[[Pattern 158: Origin Story]]` is broken because `#`, `|`, `^` are link-meta characters.

**Why It Happens:** Per Obsidian official docs (HIGH confidence), these characters must be avoided in filenames: `# | ^ : %% [[ ]]`. Additionally, OS filesystem restrictions apply: Windows disallows `< > : " / \ | ? *`; macOS allows colons in the Finder but stores them as `/` on-disk; Linux allows almost anything except `/` and NUL but you still shouldn't rely on that.

**Prevention:**
- **Filename sanitizer** applied to every generated filename, in a fixed canonical order:
  1. Replace each of `# | ^ : % [ ]` with `-` (or drop).
  2. Replace each of `< > " / \ ? *` with `-`.
  3. Collapse consecutive `-` to a single `-`.
  4. Trim leading/trailing whitespace and `-`.
  5. Truncate to 200 chars (leave room under the common 255-byte filename limit once UTF-8 is counted).
  6. Reject empty result — throw a build error, never silently write `.md`.
- **Keep the original title in frontmatter** (`title: "Pattern 158: Origin Story"`) and in the in-file `# H1`, so the human-readable title is preserved even though the filename is sanitized.
- Wikilinks use the sanitized filename but a display alias for the original: `[[Pattern 158 - Origin Story|Pattern 158: Origin Story]]`.
- Snapshot the sanitizer behavior with unit tests covering all the reserved characters, Unicode, empty input, and over-length input.

**Detection:** Unit tests on the sanitizer + a generator assertion that the written filename round-trips through the sanitizer unchanged.

**Phase Hint:** implementation
**Severity:** block

---

### 4.3 `[[Note#Heading]]` anchor mismatch

**Description:** Wikilink `[[Philosophy#Design Principles]]` doesn't resolve because the target file's heading is `## Design principles` (lowercase `p`), or `## Design Principles ` (trailing space), or was renamed.

**Why It Happens:**
- Obsidian heading matching is case-insensitive and whitespace-trimmed, but exact otherwise. A typo in the link or a rename of the heading breaks the link silently — Obsidian shows it as unresolved but the generator doesn't know.
- Headings also can't contain the `#`, `|`, `^`, `[`, `]` characters, same as filenames, or the wikilink parser stops at them.

**Prevention:**
- **Never hand-write heading anchors.** The generator produces wikilinks by looking up the target file's actual heading list. Build a `Map<filepath, string[]>` of headings during a first pass, then reference from a second pass.
- Strip `# | ^ [ ]` from headings before emitting them (same rule as filenames, minus `:` which is allowed in headings).
- Emit an **internal-link manifest** during generation: a machine-readable list of every `[[link]]` the generator produced and whether its target file + heading actually exists. Assert empty "unresolved" list at end of build.

**Detection:** The internal-link manifest assertion. Additionally, a post-generation script that parses all `.md` files, extracts every `[[...#...]]`, and verifies each one resolves. This is essentially a free link-checker once the manifest exists.

**Phase Hint:** implementation
**Severity:** block

---

### 4.4 Frontmatter reserved / default properties — tags, aliases, cssclasses

**Description:** Generator emits `tag: [foo, bar]` instead of `tags: [foo, bar]`. Obsidian ignores it — no error, just no tags in the tag pane. Three months later someone wonders why the category filter in Obsidian doesn't work.

**Why It Happens:** Per Obsidian official docs (HIGH confidence):
- Default/reserved frontmatter properties: `tags`, `aliases`, `cssclasses`.
- The old singular forms (`tag`, `alias`, `cssclass`) **lost default status in Obsidian 1.9** and should not be used.
- Publish-specific properties: `publish`, `permalink`, `description`, `image`, `cover`. These will behave specially if we ever use Obsidian Publish. Don't collide with them.
- Property names are unique per note — you can't have two `tags` keys.
- Once a property type is assigned to a name vault-wide, every note with that property must use the same type (list vs text vs number). Mixing types corrupts the property display.

**Prevention:**
- Generator uses exactly: `tags`, `aliases`, `cssclasses` (plural). Unit test on the frontmatter serializer that forbids singular forms.
- Don't emit `tag:`, `alias:`, `cssclass:` ever. Treat them as forbidden property names.
- Don't use our own property names that collide with `publish`, `permalink`, `description`, `image`, `cover` unless we mean the Publish semantics.
- Keep custom properties (title, date if any, category, exhibitType) in a stable, **documented** schema in the generator — write it down in `scripts/build-markdown/README.md` or in PLAN.md so future changes know what's reserved. Pin each property's type and never vary it across notes.

**Detection:** Unit tests on the frontmatter serializer. Also open the vault in Obsidian once in foundation phase to visually verify tags show up in the tag pane — training data can't substitute for actually launching the app.

**Phase Hint:** implementation
**Severity:** block

---

### 4.5 Obsidian tag format rules — spaces, leading digits, nested tags

**Description:** Generator emits `tags: ["Investigation Report", "1984"]`. Both are invalid Obsidian tags: spaces are prohibited, and tags must contain at least one non-numeric character. Obsidian silently discards them.

**Why It Happens:** Per Obsidian official docs (HIGH confidence):
- Tags: letters, numbers, `_`, `-`, `/` (for nesting), Unicode.
- **No spaces.** Use camelCase / PascalCase / snake_case / kebab-case.
- **Must contain at least one non-numerical character.** `#1984` is invalid; `#y1984` works.
- Forward slash creates nested hierarchies: `inbox/to-read`. Searching a parent tag matches all children.
- Case-insensitive in function but preserves first-used casing in display.

**Prevention:**
- **Tag sanitizer** applied to every tag:
  1. Replace spaces with `-` (or `_`, pick one — kebab-case is the conventional community default).
  2. Strip characters outside `[A-Za-z0-9_\-/]` plus Unicode letters. Keep this conservative — forbid emoji unless explicitly wanted, to avoid file encoding headaches.
  3. If the result is purely numeric, prefix with a letter (e.g. `y2026`) or throw.
  4. Normalize casing to one convention project-wide. Recommendation: **kebab-case**, because tag arrays in YAML look cleaner.
- For nested tags: define a small map from category → `category/subcategory` path. Do not auto-split on arbitrary punctuation.
- **Decision to make in foundation phase:** flat tags (`investigation-report`, `engineering-brief`) or nested (`case-file/investigation-report`, `case-file/engineering-brief`). Nested is more Obsidian-idiomatic but commits you to a taxonomy that's painful to rename later. Flat is safer for v7.0. The v5.3/v6.0 FAQ taxonomy (7 categories) is already flat — match that pattern.

**Detection:** Unit tests on the tag sanitizer. Open the vault in Obsidian's tag pane and verify all expected tags appear and none are missing.

**Phase Hint:** implementation
**Severity:** block

---

### 4.6 Circular wikilinks + unresolved links showing up as "ghost notes"

**Description:** Exhibit A links to Exhibit B which links back to Exhibit A. The exporter copies these fine, but then links to "HomePage" or "CaseFiles" that don't exist as notes because the generator only produced exhibit notes. Obsidian shows them as unresolved (ghost) notes — click and you get a "Create note?" prompt.

**Why It Happens:**
- Circular links are fine in Obsidian (they're just a graph). The real trap is links to *pages that the generator didn't create*.
- Internal navigation in the Vue site uses route paths (`/case-files`, `/philosophy`), which don't translate to wikilink targets.

**Prevention:**
- **Link-target whitelist.** The generator tracks every `.md` file it writes. When emitting any wikilink, it checks the target is in the whitelist. If not, it either (a) drops the link and keeps the display text, or (b) fails the build. Recommendation: **drop-and-keep-text by default, with a warning count printed at end of build. Block if warning count exceeds a small threshold (say, 5).**
- **Map Vue router paths to note basenames** in a single place (`scripts/build-markdown/routeMap.ts`). Every link conversion goes through this map. Unknown routes fail loudly.
- Make sure all 9 site routes (per PROJECT.md) produce a note, so internal nav links always have a target.

**Detection:** Post-build script that greps all `.md` files for `[[...]]` and asserts every target exists (same manifest pattern as 4.3).

**Phase Hint:** implementation
**Severity:** warn (block if manifest unresolved count > 0)

---

## 5. Markdown Generation Traps

### 5.1 Unescaped pipe `|` inside table cells

**Description:** A personnel entry's role field contains `Engineer | Tech Lead`. Generator renders a table row `| Jane | Engineer | Tech Lead | ACME |`. The table has too many columns in GitHub's and Obsidian's renderer, breaking layout or misaligning cells.

**Why It Happens:** GFM table cells use `|` as column separator. To include a literal pipe, it must be escaped as `\|`. This is the single most common markdown-table bug and the personnel/technologies/findings arrays that v4.0 promoted to first-class typed arrays are the highest-risk source because they will almost certainly render as tables.

**Prevention:**
- Write an `escapeTableCell(s)` helper. Apply to **every** cell. Rules:
  - Replace `\` with `\\` first.
  - Replace `|` with `\|`.
  - Replace newlines with `<br>` (GFM allows limited HTML in tables).
  - Preserve other characters as-is.
- Unit test with: pipes, backslashes, newlines, empty string, leading/trailing whitespace, HTML entities.
- Alternative: for prose-heavy content, skip tables and use definition lists or H3 sub-sections. Tables are brittle; use them only for genuinely tabular data.

**Detection:** Unit tests on the escape helper. Visual inspection in Obsidian of any exhibit that has personnel/technologies/findings.

**Phase Hint:** implementation
**Severity:** block

---

### 5.2 Unescaped `<`, `>`, `*`, `_`, `` ` `` in prose

**Description:** A finding's description contains `value < 0` or `React.Component<Props>`. Markdown renders partially, the `<` starts an HTML tag that never closes, and the rest of the paragraph disappears.

**Why It Happens:** CommonMark and GFM treat `<` as a possible HTML tag opener. Markdown also treats `*` / `_` as emphasis and `` ` `` as code span. Any of these in raw prose can corrupt rendering.

**Prevention:**
- Write an `escapeProse(s)` helper. Rules:
  - Escape `\` → `\\`
  - Escape `` ` `` → `` \` ``
  - Escape `*` → `\*`
  - Escape `_` → `\_` (only word-boundary ones in theory; escape all for safety)
  - Escape `[` → `\[` and `]` → `\]` (prevent accidental link syntax)
  - Replace `<` with `&lt;` and `>` with `&gt;` **unless** the string is inside a code block.
  - Leave `#` alone inside prose (it's only meaningful at start of line).
- **Use different escape helpers for different contexts**: `escapeProse`, `escapeTableCell`, `escapeWikilinkTarget`, `escapeCodeBlockContent` (no escaping — only check for triple-backtick collisions, see 5.4). Keep them in one module, unit-tested together.
- Do not use a "one-size-fits-all escape" function. Context matters.

**Detection:** Unit tests per helper. Visual inspection in Obsidian and on GitHub.

**Phase Hint:** implementation
**Severity:** block

---

### 5.3 Blank-line handling around lists and code blocks

**Description:** Generator emits a list immediately after a paragraph with no blank line: `Foo\n- bar\n- baz`. CommonMark-strict parsers treat `- bar` as part of the paragraph (or as a loose list, depending). GitHub's renderer is lenient, Obsidian's is slightly different, and a CommonMark linter in CI will fail.

**Why It Happens:** Markdown block rules require a blank line before certain block elements (lists, code fences, headings, tables) to ensure they start a new block. It's easy to miss when concatenating strings.

**Prevention:**
- **Block builder abstraction.** Instead of concatenating strings, represent the document as an array of block objects (`heading`, `paragraph`, `list`, `table`, `codeBlock`, `frontmatter`) and render at the end with `blocks.map(render).join('\n\n')`. The double-newline join guarantees blank-line separation between blocks.
- Exactly one blank line between blocks, two at the end of the document (trailing newline).
- Inside a list item, nested content (continuation paragraphs, sub-lists) needs 2 or 4 spaces of indentation — document the convention and use it consistently.
- Do not manually emit `\n\n` in render functions; rely on the join.

**Detection:**
- Run all generated files through a markdown linter (`markdownlint-cli2`) in CI. Preset a config that enforces blank lines around lists/headings/code blocks (`MD022`, `MD031`, `MD032`).
- Visual spot-check in both GitHub's preview and Obsidian.

**Phase Hint:** implementation
**Severity:** warn (block if markdownlint fails CI)

---

### 5.4 Triple-backtick inside code block content

**Description:** A code sample in an exhibit contains the literal characters ` ``` ` (maybe a nested markdown example). Generator wraps it in a triple-backtick fence. The inner backticks close the fence early, everything after leaks into the document.

**Why It Happens:** Markdown fence rules: a fence opened with N backticks is closed by a line of ≥N backticks of the same character.

**Prevention:**
- Scan each code block's content for the longest run of backticks (call it `m`), then open and close with `max(m+1, 3)` backticks. Code fences can be 3, 4, 5, … backticks.
- Always specify a language hint (` ```ts ` not ` ``` `) — small win for readability, zero cost.
- Strip trailing whitespace from each line of the code block before emission.

**Detection:** Unit test with a code block containing ` ``` ` and with 4-backtick inputs. Assert round-trip parses as a single fenced block.

**Phase Hint:** implementation
**Severity:** block (it corrupts the whole document downstream of the bad block)

---

### 5.5 To-wrap-or-not-to-wrap: line wrapping ruins diffs

**Description:** Generator wraps prose at 80 columns "for readability." Someone edits a single word in a paragraph — the wrap re-flows and the diff looks like the whole paragraph changed. PR reviewers can't tell what actually moved.

**Why It Happens:** Line wrapping is cosmetic but destroys diffability for content-driven files.

**Prevention:**
- **Never wrap prose.** One paragraph = one line, regardless of length.
- Markdown renderers handle soft-wrap at display time. Obsidian does this. GitHub does this. VS Code does this. There is zero benefit to hard-wrapping the source.
- Exception: YAML frontmatter arrays can be multi-line if they're long, because that's standard YAML. Use block style (`- foo\n- bar`) for arrays of 3+ items, inline (`[foo, bar]`) for 1-2.

**Detection:** A linter rule that enforces wrapping is the *wrong* detection. The correct detection is code review discipline: reject PRs to the generator that introduce any `wrap(text, N)` logic.

**Phase Hint:** implementation
**Severity:** warn

---

### 5.6 Heading collisions inside a single document and ToC anchor normalization

**Description:** Monolithic `site-content.md` has two `## Findings` sections (one under Exhibit A, one under Exhibit B). A generated ToC anchor link `#findings` points to whichever renders first. Click from Exhibit B's ToC row jumps back to Exhibit A.

**Why It Happens:**
- GitHub's markdown renderer generates anchor slugs by lowercasing, replacing spaces with `-`, and stripping punctuation. Duplicates get `-1`, `-2` suffixes.
- Obsidian's algorithm is slightly different.
- A hand-generated ToC will disagree with whichever parser you didn't test against.

**Prevention:**
- **Avoid duplicate headings in the monolithic doc.** Prefix sub-section headings with the exhibit id: `## Exhibit A — Findings`, `## Exhibit B — Findings`. This also reads better.
- **Don't generate a ToC manually.** GitHub renders markdown files with a built-in ToC in the file view; Obsidian has its own Outline pane. A hand-rolled `[Jump to Findings](#findings)` table duplicates work and will drift.
- If a ToC is required (e.g. someone explicitly wants it at the top of the monolithic doc), use a library like `markdown-toc` or `remark-toc` and regenerate it as part of the build — never hand-maintained.

**Detection:** Script that greps all headings from the monolithic file, finds duplicates, fails build.

**Phase Hint:** implementation
**Severity:** warn

---

## 6. Build Pipeline & Committed-Generated-Files Traps

### 6.1 Committing generated files is usually an anti-pattern — mitigations when it's intentional

**Description:** `docs/site-content.md` is committed to the repo. Every content change produces a two-file commit (source + generated), PRs get noisy, merge conflicts in the generated file become routine.

**Why It Happens:** The stated goal is "GitHub browsing" — so the files must be visible on GitHub, which means committed. This is a legitimate use case for committing generated files, but it has well-known trade-offs.

**Prevention (mitigations for a *deliberate* committed-generated-files pattern):**

1. **Determinism first.** Without strict determinism (section 3), every mitigation below fails. This is the non-negotiable prerequisite.
2. **CI drift guard** (restated from 2.2): `npm run build:markdown && git diff --exit-code docs/`. Fails any PR that didn't regenerate.
3. **"DO NOT EDIT" header** on every generated file:
   ```
   <!--
   THIS FILE IS GENERATED. DO NOT EDIT.
   Source: src/data/json/**
   Regenerate: npm run build:markdown
   -->
   ```
4. **Pre-commit hint** (advisory only): a `lint-staged` entry that warns if staged files include edits to `docs/` but no corresponding edits to `src/data/json/**` or generator scripts. Warn, don't block — this catches accidental hand-edits but lets intentional generator changes through.
5. **Merge strategy for `docs/**`**: accept that merge conflicts in `docs/` are resolved by regenerating from source. Document the recipe: "on conflict in `docs/`, run `npm run build:markdown` and accept its output."
6. **CODEOWNERS (optional)**: add `docs/ @dan` so PR-time review catches hand-edits.

**Alternative: don't commit them at all.** Serve via GitHub Actions artifacts or a release workflow. Downside: GitHub rendered view disappears. Decision point for foundation phase — but PROJECT.md already committed to "committed under `docs/` for GitHub browsing," so accept and mitigate.

**Detection:** CI guard (#2 above) is the primary detector.

**Phase Hint:** polish
**Severity:** block (for the CI guard specifically)

---

### 6.2 Generation timing: install-time vs build-time vs on-demand

**Description:** Team debates whether to put generation in `postinstall`, `build`, or `prepare`. Each has failure modes.

**Why It Happens:**
- `postinstall` runs on every `npm install` — adds latency to every CI run and every `node_modules` reinstall, for zero benefit if the source hasn't changed.
- `prepare` runs on install AND on publish — even worse, and this isn't a publishable package.
- Running only in `build` means `npm run test` / Storybook runs don't regenerate, which is correct behavior.
- On-demand only (`npm run build:markdown`) means forgetfulness (see 2.2).

**Prevention:**
- **Build-time + CI drift guard.** Generation runs as part of `vite build` (ideally as a Vite plugin, see 1.4), and CI enforces that `git diff docs/` is clean after build. That's the entire contract.
- Do NOT hook into `postinstall` or `prepare`. Document this in PLAN.md as a forbidden choice.
- Provide `npm run build:markdown` as a standalone entry point for fast local iteration, but don't make anything *depend* on it.

**Detection:** Code review — reject any PR that adds `postinstall` / `prepare` hooks for markdown generation.

**Phase Hint:** foundation
**Severity:** warn

---

### 6.3 Generated files in the wrong directory break everything downstream

**Description:** Generator writes to `docs/` which turns out to also be the GitHub Pages publish directory, or the Vite build output directory, or the Storybook build output, or all three. Generated markdown gets wiped on every build, or accidentally deployed, or served as web content.

**Why It Happens:** `docs/` is heavily overloaded in the JavaScript ecosystem. Multiple tools default to reading or writing it.

**Prevention:**
- **Audit directory conflicts in foundation phase.** Verify that `docs/`:
  - Is NOT in Vite's `outDir` (currently defaults to `dist/` — vite.config.ts has no explicit `outDir`, so safe).
  - Is NOT a Storybook build output (Storybook defaults to `storybook-static/`, so safe).
  - Is NOT a Cloudflare Pages / Wrangler publish directory — **needs explicit verification against `wrangler.toml`** before writing into `docs/`.
  - Is NOT scanned by Vitest (tests live under `src/` today, should be safe, but verify).
- Add `docs/` to deployment ignore lists if deployed content is served from `dist/` only.
- Consider a more specific name like `docs/markdown-export/` if `docs/` is risky — a sub-namespace inside docs is free insurance.
- Document the directory structure in PLAN.md with a note: "These directories are ONLY for the markdown export. Do not commit other docs here."

**Detection:** Run a full `npm run build && npm run build:markdown && npm run deploy -- --dry-run` sequence in foundation phase and inspect what ended up where.

**Phase Hint:** foundation
**Severity:** block

---

## 7. Scope Creep — Features to Firmly Say NO To

Each of these sounds small and will appear in review comments or follow-up issues. Write them in PLAN.md as explicit non-goals with a one-sentence reason.

### 7.1 Search index

**Description:** "Let's add a `docs/search-index.json` so the generated docs are searchable." Sounds small. Involves tokenization, stop words, scoring, a runtime to consume it, deciding what "searching markdown" even means.

**Prevention:** NO for v7.0. Obsidian already has full-text search for the vault. GitHub has full-text search for the monolithic file. There is no consumer for a custom search index.

**Phase Hint:** scope-boundary (document in PLAN.md out-of-scope)
**Severity:** block (if someone tries to add it)

---

### 7.2 Graph export / vault visualization

**Description:** "Can we also emit a `.mermaid` or `.gexf` graph of the wikilink structure?"

**Prevention:** NO. Obsidian's built-in graph view already shows the vault graph. A separate graph export is work for no consumer.

**Phase Hint:** scope-boundary
**Severity:** block

---

### 7.3 Full HTML rendering alongside markdown

**Description:** "While we're generating markdown, why not also generate rendered HTML so we have a static copy of the site?"

**Prevention:** NO. This is SSG, which is explicitly out-of-scope in PROJECT.md for v7.0. Markdown and HTML are different products with different fidelity requirements. Doing both doubles scope.

**Phase Hint:** scope-boundary
**Severity:** block

---

### 7.4 Asset copying (images, CSS, downloadable files)

**Description:** "Copy all images into `docs/obsidian-vault/assets/` so the vault is self-contained."

**Prevention:** NO. PROJECT.md already states "Images skipped, alt text preserved as italicized captions." Hold this line. Asset pipelines drag in:
- Image format conversions (Obsidian wants `.png`/`.jpg`, site may have `.webp`/`.svg`)
- Alt text vs caption rendering decisions
- Sizing decisions (vault can't easily do responsive images)
- Committing binary files to git (size bloat)
- Wikilink vs markdown image syntax (`![[image.png]]` vs `![](image.png)`)

**Phase Hint:** scope-boundary
**Severity:** block

---

### 7.5 Bidirectional sync (editing markdown regenerates JSON)

**Description:** "So can Dan also edit the markdown in Obsidian and have it sync back to the JSON source?"

**Prevention:** NO, NO, NO. One-way generation only. Bidirectional sync is a product category, not a feature. Document loud and clear: **JSON is source of truth. Markdown is a derived artifact. Edits to markdown are destroyed on next regen.**

**Phase Hint:** scope-boundary
**Severity:** block

---

### 7.6 "Just a few more frontmatter fields"

**Description:** A frontmatter schema that grows by one field per week: `author`, `status`, `lastReviewed`, `reviewer`, `confidence`, `visibility`, `relatedExhibits`, `supersedes`, …

**Prevention:** Freeze the frontmatter schema in foundation phase. Any new field requires an explicit PLAN.md amendment and a stated Obsidian-side consumer ("I want to filter exhibits by `status` in the Obsidian tag pane" is a valid consumer; "it might be useful someday" is not).

**Phase Hint:** scope-boundary
**Severity:** warn

---

## 8. Testing Traps

### 8.1 Snapshot fragility

**Description:** Every minor generator edit updates dozens of snapshot files. Team learns to `--update-snapshots` blindly, real regressions slip through.

**Why It Happens:** Snapshot testing the whole markdown output couples tests to every cosmetic detail (blank lines, heading capitalization, frontmatter key order).

**Prevention:**
- **Snapshot at the smallest useful granularity.** Test individual renderers: `renderFrontmatter(input)`, `renderWikilink(input)`, `escapeTableCell(input)`, `renderFindings(findings)`. Each snapshot is a few lines.
- **End-to-end test is a determinism test, not a snapshot test.** Run the generator twice, assert byte-equality of both runs. Do NOT snapshot the full `site-content.md` — that file should change whenever source content changes, which is most PRs.
- **One golden-path integration test**: for a single representative exhibit (e.g. Exhibit A), snapshot its full generated `.md` file. This catches structural breakage without snapshotting everything.

**Detection:** Measure snapshot update frequency. If snapshots update in more than ~10% of content-layer PRs, the snapshots are too fine-grained.

**Phase Hint:** polish
**Severity:** warn

---

### 8.2 Trailing-whitespace and invisible-character drift

**Description:** A test passes locally but fails in CI because the generator emitted `"foo \n"` (trailing space) on one platform and `"foo\n"` on another, or because a non-breaking space (U+00A0) snuck in from copy-pasted source content.

**Why It Happens:**
- Some template string compositions end up with stray trailing spaces from interpolation like `` `${value} ${maybeEmpty}` ``.
- Source JSON may contain invisible Unicode characters (BOM, NBSP, zero-width spaces) from content that was pasted from Word docs or web pages.

**Prevention:**
- **Generator post-process**: before writing each file, strip trailing whitespace on every line, normalize line endings to `\n`, strip any U+FEFF BOM at start, normalize NBSP (U+00A0) to regular space in prose (but preserve it inside code blocks if ever needed).
- Run the output through a lightweight whitespace normalizer as the very last step.
- Unit test the normalizer with fixtures containing all the invisible characters.
- Use a `.editorconfig` for `docs/*.md` specifying LF + trim trailing whitespace + final newline.

**Detection:** `git diff` on the generator output will surface trailing whitespace in red if git is configured normally. Also: a CI step that runs `grep -nP ' $' docs/` and fails if anything matches.

**Phase Hint:** polish
**Severity:** block

---

### 8.3 Windows vs Unix line ending drift

Covered under 3.4. Cross-referenced here for the testing checklist.

**Prevention:** `.gitattributes` pinning `docs/** text eol=lf`, generator writes `\n` literals only, CI test on at least one Linux runner validates byte-exact output.

**Phase Hint:** polish
**Severity:** warn

---

### 8.4 Testing Obsidian rendering without actually opening Obsidian

**Description:** All unit tests pass. Files look right in GitHub. Dan opens the vault in Obsidian — wikilinks are broken, tags don't show up, frontmatter is parsed as "no properties."

**Why It Happens:** Obsidian is not a pure CommonMark renderer. It has its own property parser, its own wikilink resolver, its own tag index. Unit-testing against a CommonMark parser catches some issues but not these.

**Prevention:**
- **Manual QA checkpoint**: early in the implementation phase (not at the end), open the generated vault in a real Obsidian instance. Check: tag pane shows expected tags, wikilinks resolve, frontmatter properties appear in the properties panel, search finds expected content. Write down findings as phase exit criteria.
- Maintain a small "vault sanity check" document: 5-10 items to manually verify per release. Check it at every milestone boundary.
- Consider screenshotting the Obsidian properties pane for a representative file and committing it to `docs/.qa/` as a visual baseline.

**Detection:** Manual. There is no substitute for opening Obsidian. Automation of Obsidian rendering is not practical for a small project.

**Phase Hint:** implementation (first check) + polish (final check)
**Severity:** block (milestone cannot ship without at least one manual Obsidian QA pass)

---

### 8.5 Markdown linter as a gate, not a dumping ground

**Description:** `markdownlint-cli2` runs in CI and has a growing list of disabled rules because each one was "too strict" for some file. Eventually the linter disables enough rules to be useless.

**Why It Happens:** Markdown linters have many rules; some conflict with generator output choices. Disabling rules file-by-file is the path of least resistance.

**Prevention:**
- **Pick a minimal lint set** in foundation phase and don't grow it. Recommended starter rules: `MD022` (blanks around headings), `MD031` (blanks around fences), `MD032` (blanks around lists), `MD040` (fenced code language), `MD041` (first line H1 or frontmatter), `MD047` (file ends with newline). These are all either already enforced by the generator or cheap to satisfy.
- **Disable in config, not per-file.** If a rule doesn't fit, disable it globally with a one-line comment explaining why. Per-file disables are a smell.
- Markdownlint is supplementary to determinism tests (3.1) and Obsidian manual QA (8.4). Don't treat it as the primary gate.

**Detection:** Code review of `.markdownlint.json`. If the disabled list grows in any single PR, push back.

**Phase Hint:** polish
**Severity:** warn

---

## Phase-Specific Warnings (Cross-Cutting Summary)

| Phase          | Likely Pitfalls (section refs)                                                                   | Mitigation                                                                                  |
|----------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **foundation** | 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 6.2, 6.3                                                           | Pick script runtime. Audit content sources. Audit `docs/` directory collisions. Write it in PLAN.md before coding. |
| **implementation** | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.6, 8.4 (first pass)                     | Build renderers with escape helpers and uniqueness checks. Manual Obsidian QA checkpoint mid-phase. |
| **polish**     | 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 6.1, 8.1, 8.2, 8.3, 8.4 (final), 8.5                              | Determinism tests, CI drift guard, line-ending/whitespace hardening, final Obsidian QA.    |
| **all phases** | 7.1–7.6 (scope creep)                                                                           | Say NO in PR review. Point at PROJECT.md and this PITFALLS.md.                             |

---

## Hard "Forbidden" List (for PLAN.md)

Copy-paste candidate for the PLAN.md of each phase:

- Forbidden: `@/` imports inside `scripts/build-markdown/**`.
- Forbidden: `Date.now()`, `new Date()`, `process.hrtime`, `performance.now()` anywhere in the generator output.
- Forbidden: `Promise.all` on read operations whose results feed ordered output.
- Forbidden: `os.EOL` in the generator. Always `\n` literals.
- Forbidden: manual editing of any file under `docs/`.
- Forbidden: `postinstall` or `prepare` hooks that run the generator.
- Forbidden: hand-written ToC anchors or heading-anchor wikilinks. Generator computes them or throws.
- Forbidden: `assert { type: 'json' }` import syntax. Use `with { type: 'json' }` or `fs.readFile` + `JSON.parse`.
- Forbidden: singular frontmatter keys `tag`, `alias`, `cssclass`. Only plural forms.
- Forbidden: line wrapping of prose in generated markdown.
- Forbidden: mtime/hash-based "skip unchanged" logic in the generator.
- Forbidden: bidirectional sync (markdown → JSON).
- Forbidden: asset/image copying into the vault.
- Forbidden: full HTML rendering alongside markdown.
- Forbidden: parsing `.vue` SFCs from the generator. Prose goes in JSON.

---

## Sources

- **Obsidian Properties (reserved field names, types):** https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Editing%20and%20formatting/Properties.md — HIGH confidence (official Obsidian Help publish mirror)
- **Obsidian Tags (format rules, nesting, invalid characters):** https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Editing%20and%20formatting/Tags.md — HIGH confidence
- **Obsidian Internal Links (wikilink syntax, disallowed filename characters `# | ^ : %% [[ ]]`):** https://publish-01.obsidian.md/access/f786db9fac45774fa4f0d8112e232d67/Linking%20notes%20and%20files/Internal%20links.md — HIGH confidence
- **Node.js import attributes (`with { type: 'json' }` mandatory in Node 22+):** https://nodejs.org/api/esm.html#import-attributes — HIGH confidence
- **esbuild tsconfig support (paths/baseUrl only resolved in bundle mode, not transform mode):** https://esbuild.github.io/content-types/#tsconfig-json — HIGH confidence
- **tsx documentation (confirms tsconfig paths support is delegated to esbuild):** https://tsx.is/typescript — HIGH confidence for the esbuild-delegation claim
- **Project context:** `.planning/PROJECT.md` v7.0 milestone, `package.json`, `tsconfig.json`, `vite.config.ts` — HIGH confidence (read directly)
- **Markdown generation, determinism, committed-generated-files guidance:** drawn from well-established community practice (GFM spec, CommonMark spec, and general software-engineering experience with generated files). MEDIUM confidence — not verified against a single authoritative source per claim, but each claim is well-documented in multiple ecosystem sources. Flag for validation: 5.3 blank-line behavior around lists differs slightly between CommonMark-strict and GitHub's renderer; test in both to be sure.
