# v7.0 Research Synthesis — Static Markdown Export Pipeline

**Milestone:** v7.0 — emit two committed markdown artifacts from the existing Vue 3 + TypeScript + Vite site content
**Researched:** 2026-04-10
**Inputs:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
**Synthesis confidence:** HIGH (all four researchers converged on the same core decisions)

---

## 1. Milestone Recap

Two build-time artifacts, both committed under `docs/`:

1. **`docs/site-content.md`** — single monolithic markdown doc, heading levels mirror the site tree. Primary audience: hiring managers skimming on GitHub.
2. **`docs/obsidian-vault/`** — one `.md` per site page + 15 exhibit detail pages, folder structure mirrors the menu, YAML frontmatter, `[[wikilinks]]`, exhibit category tags. Primary audience: future CMS / Obsidian workflow.

Triggered by both `npm run build` (chained after `vite build`) and `npm run build:markdown` (standalone).

**User-confirmed decisions (from milestone intake):**

- Both trigger modes (chained + standalone)
- Output committed in repo at fixed `docs/` path
- Scope = all site pages + every exhibit detail (exclude `/review`, `/diag`, 404)
- Full Obsidian treatment — frontmatter, wikilinks, category tags
- Content sourced from JSON data + page templates (prose extracted from SFCs, NOT headless Vue render / SFC AST parsing)
- Images skipped, alt text preserved as italicized captions

---

## 2. Recommended Stack

**3 new devDependencies only** — everything else is Node standard library.

| Package | Version | Role |
|---|---|---|
| `tsx` | `^4.21.0` | Run the export script as TypeScript directly |
| `yaml` | `^2.8.3` | Emit Obsidian YAML frontmatter |
| `github-slugger` | `^2.0.0` | Deterministic slugs for filenames and anchor-stable headings |

Standard library: `node:fs/promises`, `node:path`, `node:url`.

**Explicitly rejected:**

- `unified` / `remark` / `mdast-util-*` — AST framework, ~8 transitive deps for a narrow grammar already known from typed JSON
- `turndown` — no HTML inputs
- `gray-matter` — parses frontmatter; we're emitting, not parsing
- `@vue/compiler-sfc` — prose extraction from templates is a maintenance pit (see §4)
- `ts-node` — superseded by `tsx`; ESM support awkward
- `vite-node` — pulls full Vite config + Vue plugins into a script that touches no `.vue` files
- `prettier` as a library — use well-formatted helpers instead
- Custom Vite plugin — wrong abstraction (standalone script is smaller, faster to iterate, independently runnable)

**Markdown generation:** plain TypeScript template literals with small helper functions. The output grammar is narrow (headings, paragraphs, lists, tables, blockquotes, wikilinks). A handful of helpers covers everything:

```ts
const h = (level: number, text: string) => `${'#'.repeat(level)} ${text}\n\n`
const p = (text: string) => `${text}\n\n`
const ul = (items: string[]) => items.map(i => `- ${i}`).join('\n') + '\n\n'
const table = (headers: string[], rows: string[][]) => /* ... */
const caption = (alt: string) => `*${alt}*\n\n`
const wikilink = (target: string, label?: string) =>
  label ? `[[${target}|${label}]]` : `[[${target}]]`
```

---

## 3. Feature Categories

### Table Stakes (hard minimum — ship is broken without these)

| ID | Feature | Complexity |
|---|---|---|
| T1 | Deterministic, reproducible output (byte-identical across runs) | Low |
| T2 | Build-time integration + standalone script sharing one implementation | Low |
| T3 | Monolithic doc with site-tree heading hierarchy | Medium |
| T5 | Content-addressable internal cross-references (anchors in mono, wikilinks in vault) | Medium |
| T6 | YAML frontmatter on every vault file (`title`, `aliases`, `tags`, `date?`) | Low |
| T7 | Wikilinks between vault notes | Low-Medium |
| T8 | Folder structure mirrors the menu | Low |
| T11 | GFM markdown tables for personnel / technologies / findings | Medium |
| T15 | All 5 exhibit section variants rendered (text, table, timeline, metadata, flow) | Medium |

### Near-minimum (ship is ugly without these)

| ID | Feature |
|---|---|
| T4 | Auto-generated ToC in monolithic doc |
| T9 | Tag taxonomy for exhibits |
| T10 | Image handling (skip files, italicize alt text) |
| T12 | Accurate heading depth for exhibit sections |
| T13 | FAQ question-per-entry rendering |
| T14 | Stable, collision-free filenames for vault notes |

### Quick wins (cheap polish — should ship with MVP)

| ID | Feature |
|---|---|
| D3 | Obsidian callout blocks for exhibit quotes (`> [!quote]`) — graceful GitHub degradation |
| D4 | Aliases for FAQ questions / exhibits |
| D6 | Monolithic doc uses GFM only (no Obsidian-isms) |
| D8 | Generated-file warning banner on every file |

### Higher-cost differentiators (sequence as follow-up if scope tight)

| ID | Feature |
|---|---|
| D1 | Case Files index note / MOC (Map of Content) |
| D2 | Backlinks-friendly FAQ→exhibit cross-references |
| D5 | Per-exhibit block anchors (`^background`, `^findings`) for deep linking |
| D7 | Content extraction from Vue SFCs (becomes Phase 1 — see §5) |
| D9 | Deterministic per-page date semantics (omit if no source date) |
| D10 | Tag hierarchy matching menu structure |

### Anti-features (explicit NO in PLAN.md)

Dataview queries, image copying, bidirectional sync, search index, graph view customization, reproducing Vue component behavior, per-section-type custom YAML schemas, lossless HTML fidelity, i18n, watch mode.

---

## 4. Architecture Decisions

### 4.1 Content sourcing: refactor SFCs (Option B — unanimous)

Three options were considered. All four researchers chose **Option B**:

- **A** Manual page content map duplicated from SFCs → rejected (two sources of truth, drift over time)
- **B** Refactor SFCs to import content from `src/content/*.ts` → **recommended**
- **C** Parse SFCs statically with `@vue/compiler-sfc` → rejected (AST walking is brittle, component composition adds re-implementation cost)

**Scope of the refactor** (verified by inspection):

- `HomePage.vue` — intro heading, intro paragraph, 2 teaser quotes. Small.
- `PhilosophyPage.vue` + `HowIWorkSection.vue` + `AiClaritySection.vue` + `Pattern158OriginSection.vue` — ~8 paragraphs, 2 quotes. Medium.
- `FaqPage.vue`, `ContactPage.vue`, `AccessibilityPage.vue`, `TechnologiesPage.vue` — small intros. Small.
- Total: ~150-200 lines of prose moved mechanically. Guarded by existing 95 unit tests + one new Playwright browser test per refactored page.

### 4.2 Standalone `tsx` script, NOT a Vite plugin

| Concern | Standalone script | Vite plugin |
|---|---|---|
| Runs independently of `vite build` | Yes | No |
| Iteration speed during dev | <1s (tsx) | Slow (vite cold start) |
| Testability in isolation | Trivial | Harder (mock plugin context) |
| Failure modes | 1 script | Plugin hook timing + Vite internals |

Chained via `"build": "vue-tsc -b && vite build && npm run build:markdown"`. `build:markdown` runs **after** `vite build` so a broken exporter never blocks the site build.

### 4.3 Two-mode renderer sharing a DocNode IR

```
Extractors → PageDoc[] (DocNode union) → [Monolithic renderer | Obsidian renderer] → FS writer
```

- **DocNode union** — `Heading | Paragraph | List | Table | Blockquote | Link | Image | HR`
- **PageDoc** — frontmatter metadata (title, slug, navPath, tags, date) + `DocNode[]` body
- **Shared primitives** — `heading()`, `paragraph()`, `list()`, `table()`, `blockquote()`, `link()`, `wikilink()`
- **Divergences**: monolithic shifts heading levels by nav depth, emits anchor links, no frontmatter; obsidian keeps declared heading levels, emits `[[wikilinks]]`, emits YAML frontmatter and folder structure.

### 4.4 Directory layout

```
scripts/markdown-export/
  index.ts                    # orchestrator
  site-map.ts                 # routes → extractors, nav hierarchy
  content/*.ts                # per-page extractors (pure functions)
  ir/{nodes,page}.ts          # DocNode + PageDoc types
  markdown/{primitives,escape,frontmatter}.ts
  renderers/{monolithic,obsidian}.ts
  writers/fs-writer.ts
  __tests__/*.test.ts

src/content/                  # NEW — prose extracted from .vue SFCs
  meta.ts
  home.ts, philosophy.ts, ...
  sections/*.ts               # HowIWorkSection, AiClaritySection, Pattern158OriginSection prose

docs/
  site-content.md             # committed
  obsidian-vault/             # committed
    index.md
    case-files/exhibits/exhibit-*.md
    ...

tsconfig.scripts.json         # extends root, includes scripts/**, targets Node ESM
```

### 4.5 `tsx` + relative imports (NOT `@/`)

**Critical finding from PITFALLS §1.1:** `tsx` uses esbuild in *transform* mode, which does NOT resolve `tsconfig.paths`. Using `@/` inside `scripts/**` will crash at runtime. Enforcement:

- `scripts/tsconfig.json` sets `"paths": {}` so `@/` becomes a type error in scripts
- Lint rule scoped to `scripts/**` forbids `@/` imports
- Document in PLAN.md as forbidden

### 4.6 JSON loading: `fs.readFile` + `JSON.parse`

Avoid `import foo from 'x.json' with { type: 'json' }` despite it being correct — it drags TypeScript JSON-module type noise and couples to Node version. Read JSON via `fs.readFile` in the exporter; import only **types** from `src/types/`.

### 4.7 Thin-loader invariant (must be formalized)

Already implicit in v3.0 but must be explicit in v7.0 PLAN.md: loaders in `src/data/*.ts` may only `import JSON`, `as` assert types, and re-export. **No sort/filter/computed fields**, otherwise the exporter (which reads JSON directly) and the Vue site (which reads loaders) will drift silently.

---

## 5. Critical Pitfalls (drive phase ordering and forbidden lists)

### 5.1 Block-severity traps (must be mitigated before ship)

| Section | Pitfall | Mitigation |
|---|---|---|
| 1.1 | `@/` alias breaks under tsx | Relative imports only in `scripts/**` + lint rule |
| 1.2 | `type: module` + JSON import footgun | Use `fs.readFile` + `JSON.parse`, not import attributes |
| 1.5 | Loader transforms cause JSON vs rendered-data drift | Thin-loader invariant enforced in PLAN.md |
| 2.1 | Prose hardcoded in `.vue` templates invisible to extractor | Phase 1 SFC refactor + lint rule blocking string literals > N chars in templates |
| 2.2 | Silent drift after content edits (no "did you regenerate?" check) | **CI drift guard: `npm run build:markdown && git diff --exit-code docs/`** — single most valuable mitigation in the milestone |
| 3.1 | Non-deterministic iteration order causes noisy diffs | Sort everything that becomes ordered output with explicit comparators |
| 3.2 | `Date.now()` in frontmatter defeats drift guard | Forbid `Date.now()` / `new Date()` in generator; use git commit dates or omit |
| 4.1 | Wikilink basename collisions | Generator uniqueness assertion on vault basenames |
| 4.2 | Reserved characters in Obsidian filenames (`# \| ^ : %% [ ]`) | Filename sanitizer with snapshot tests; original title preserved in frontmatter |
| 4.3 | Wikilink heading anchor mismatches | Two-pass build: collect heading map, then reference; assert empty "unresolved" list |
| 4.4 | Wrong frontmatter keys (`tag` vs `tags`) | Unit test frontmatter serializer; forbid singular forms |
| 4.5 | Obsidian tag format violations (spaces, numeric-only) | Tag sanitizer + kebab-case normalization |
| 5.1 | Unescaped `\|` in table cells breaks layout | `escapeTableCell()` helper applied to every cell |
| 5.2 | Unescaped `<`, `*`, `_`, `` ` `` in prose corrupts rendering | Context-specific escape helpers (`escapeProse`, `escapeTableCell`, `escapeWikilinkTarget`) |
| 5.4 | Triple-backtick inside code block content | Scan for longest backtick run, fence with `max(m+1, 3)` |
| 6.1 | Committed generated files anti-pattern without determinism | Determinism + CI drift guard + DO NOT EDIT headers |
| 6.3 | `docs/` directory collisions with other tools | Audit against Vite outDir, Storybook, Wrangler, Vitest in foundation phase |
| 8.2 | Trailing-whitespace and invisible-character drift | Post-process strip trailing whitespace, normalize NBSP/BOM, final newline |
| 8.4 | Passing unit tests but broken in real Obsidian | **Manual Obsidian QA checkpoint** mid-implementation and pre-ship |

### 5.2 Forbidden list (copy into PLAN.md as hard constraints)

- `@/` imports inside `scripts/markdown-export/**`
- `Date.now()`, `new Date()`, `process.hrtime`, `performance.now()` in generator output
- `Promise.all` on reads whose results feed ordered output
- `os.EOL` — always `\n` literals
- Manual editing of any file under `docs/`
- `postinstall` / `prepare` hooks running the generator
- Hand-written ToC anchors or heading-anchor wikilinks (generator computes or throws)
- `assert { type: 'json' }` import syntax
- Singular frontmatter keys `tag`, `alias`, `cssclass`
- Line wrapping of prose in generated markdown
- mtime/hash-based "skip unchanged" logic
- Bidirectional sync (markdown → JSON)
- Asset / image copying into the vault
- Full HTML rendering alongside markdown
- Parsing `.vue` SFCs from the generator (prose must live in JSON/TS)

### 5.3 Scope creep to firmly say NO to

Search index, graph export, full HTML rendering, asset copying, bidirectional sync, "just a few more frontmatter fields."

---

## 6. Recommended Phase Ordering

Researcher consensus on dependency graph:

| Phase | Name | Scope |
|---|---|---|
| **1** | **SFC content extraction** | Move hardcoded prose from 7 Vue files into `src/content/*.ts`. Run full test suite + one Playwright regression per page. Gate: all tests green, visual parity. **This is the highest-risk phase — do it first, bounded, page by page.** |
| **2** | **IR + shared primitives** | Scaffold `scripts/markdown-export/`. Define `DocNode` / `PageDoc` types. Implement `primitives.ts`, `escape.ts`, `frontmatter.ts` with unit tests. Add `tsx` dep, `tsconfig.scripts.json`, `build:markdown` stub. Gate: primitives unit tests green. |
| **3** | **Extractors (non-exhibit pages)** | `site-map.ts` + 7 static-page extractors. Unit tests per extractor. Gate: every extractor returns valid `PageDoc`. |
| **4** | **Exhibit extractor** | All 5 section types, all three typed arrays (personnel, technologies, findings), all 15 exhibits. Snapshot one investigation-report + one engineering-brief. Gate: all 15 exhibits extract without errors. |
| **5** | **Monolithic renderer** | Heading-level shifting, anchor-based link resolution, GFM-only output. Snapshot `site-content.md`. Integration test: re-parse with `remark-parse`, assert monotonic heading hierarchy. |
| **6** | **Obsidian renderer** | Frontmatter, wikilinks, folder hierarchy, callouts, tag taxonomy. Uniqueness assertion on basenames. Link-target whitelist. Snapshot vault manifest. **First manual Obsidian QA checkpoint.** |
| **7** | **File writer + orchestrator** | `fs-writer.ts` with clean wipe + idempotent writes. Wire `index.ts`. E2E test in temp dir. Gate: `npm run build:markdown` produces both artifacts. |
| **8** | **Build integration + CI drift guard** | Chain `build:markdown` after `vite build`. Add `.gitattributes` (`docs/** text eol=lf`). **CI job: regenerate + `git diff --exit-code docs/`**. Two-run determinism test in CI. Gate: full `npm run build` green, drift guard passes. |
| **9** | **Documentation + final polish** | `scripts/markdown-export/README.md`. Update PROJECT.md. Final manual Obsidian QA pass. Gate: milestone complete. |

**Rationale for Phase 1 first:** the SFC refactor is both the highest-risk phase and the prerequisite for every later phase. Running tests + Playwright checks in isolation is cheaper than doing the refactor while also debugging the exporter. This matches the v3.0 pattern where JSON externalization preceded any data-driven rendering work.

---

## 7. Open Questions (resolve during requirements / discuss-phase)

1. **FAQ granularity** — one note per question (27 files, wikilink-addressable) or one note per page with H3 per question + block anchors? Recommendation: **one note per page, questions as H3, block anchors for deep linking.**
2. **Tag namespace** — flat (`investigation-report`) or nested (`case-file/investigation-report`)? Recommendation: **flat** (matches v5.3/v6.0 FAQ taxonomy, safer to rename).
3. **Monolithic doc depth** — full exhibit details inline (~50-100 KB) or summaries with links? Recommendation: **full details inline** — GitHub handles it, TOC + anchors make navigation usable.
4. **MOC for Case Files** — include `docs/obsidian-vault/Case Files/Case Files.md` index note? Recommendation: **yes** (D1 — Medium complexity, high perceived value).
5. **Date metadata for static pages** — omit, git commit date, or build date? Recommendation: **omit for static pages, preserve exhibit dates as-is**.
6. **Exhibit filename format** — `Exhibit A.md`, `Exhibit A - Title.md`, or `exhibit-a.md`? Recommendation: **`Exhibit A - Short Title.md` with multi-alias frontmatter** so `[[Exhibit A]]` and `[[Title]]` both resolve.
7. **`.gitattributes` linguist-generated marker** — mark `docs/**` as generated so they don't inflate GitHub language stats? Recommendation: **yes** (low cost).
8. **FAQ ↔ exhibit backlinks injection** — auto-generate "Referenced in FAQ" callouts on exhibit notes (D2)? Two-pass build required. Recommendation: **stretch — defer if scope tight**.
9. **Block anchors (D5)** — add `^background`, `^findings` to exhibit notes for deep linking? Vault-only emission. Recommendation: **stretch — low cost, include if time permits**.

---

## 8. Consensus Recommendations (cross-researcher agreement)

Every recommendation below was independently reached by at least 3 of the 4 researchers:

1. **Phase 1 = SFC content refactor.** Hardcoded prose in `.vue` templates is the biggest drift risk. Extract before any exporter code.
2. **Standalone `tsx` script, NOT a Vite plugin.** Iteration speed, testability, decoupling from Vite lifecycle.
3. **Two-mode renderer sharing a DocNode IR.** Monolithic and Obsidian consume the same `PageDoc[]` through the same primitives; divergences live only in the renderers.
4. **Snapshot testing is the test strategy spine.** Small, targeted snapshots (one representative exhibit, individual primitives) + determinism two-run test — NOT a whole-file `site-content.md` snapshot.
5. **CI drift guard is mandatory** — `npm run build:markdown && git diff --exit-code docs/` is the single most valuable mitigation in the milestone.
6. **Only 3 new devDependencies** — `tsx`, `yaml`, `github-slugger`. Reject `unified`/`remark`/`turndown`/`gray-matter`/`ts-node`/`vite-node`.
7. **Relative imports only in `scripts/**`** — `tsx` does not resolve `@/` aliases. Enforce via separate tsconfig + lint rule.
8. **Thin-loader invariant** — formalize v3.0's implicit rule that `src/data/*.ts` loaders may not sort/filter/compute, so exporter (reading JSON) and site (reading loaders) can't drift.
9. **Manual Obsidian QA checkpoints** — mid-implementation and pre-ship. Unit tests don't catch Obsidian-specific rendering issues. Milestone cannot ship without at least one manual QA pass.
10. **Freeze the frontmatter schema in foundation phase.** Any new field requires a PLAN.md amendment with a stated Obsidian-side consumer.

---

## Sources

- `.planning/research/STACK.md` — toolchain verification against npm registry (2026-04-10)
- `.planning/research/FEATURES.md` — Obsidian conventions verified against `obsidianmd/obsidian-help` master
- `.planning/research/ARCHITECTURE.md` — direct codebase inspection (pages, components, data, types, router)
- `.planning/research/PITFALLS.md` — Obsidian rules, tsx/esbuild path handling, Node import attributes verified against official sources
