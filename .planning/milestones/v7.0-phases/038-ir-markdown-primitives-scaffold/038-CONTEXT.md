# Phase 38: IR + Markdown Primitives + Scaffold - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Lay the foundation layer for the v7.0 static markdown export pipeline. Phase 38 delivers:

1. `scripts/markdown-export/` directory scaffold with subdivided structure
2. `tsconfig.scripts.json` wired into the root via project references
3. Three new devDeps installed via pnpm: `tsx`, `yaml`, `github-slugger`
4. Package manager migration: `npm` → `pnpm` (folded into this phase, Wave 1)
5. `DocNode` + `InlineSpan` + `PageDoc` type definitions (the IR)
6. Markdown primitives as IR factories (`heading`, `paragraph`, `list`, `table`, `blockquote`, `link`, `wikilink`, `caption`, etc. — one file per primitive)
7. Frontmatter serializer (YAML, canonical key order, plural-only keys)
8. Context-specific escape helpers (`escapeProse`, `escapeTableCell`, `escapeWikilinkTarget`, `escapeCodeBlockContent`) with unit tests
9. `docs/` directory collision audit against Vite/Storybook/Vitest/Wrangler
10. New `scripts` project in `vitest.config.ts` wiring scripts tests into the existing test runner

**Out of scope for this phase:** Any extractor (Phase 39/40), any renderer (Phase 41/42), the orchestrator or fs-writer (Phase 43), build integration (Phase 44), or documentation (Phase 45). Phase 38 ships the *building blocks* only — no end-to-end pipeline yet.

</domain>

<decisions>
## Implementation Decisions

### Package Manager (D-01, D-02)
- **D-01:** Migrate from npm to pnpm. Delete committed `package-lock.json`, commit currently-untracked `pnpm-lock.yaml` (originates from worktree-agent-af18ea90 merge). All future install/run commands use `pnpm`.
- **D-02:** The pnpm migration lands in Phase 38 Wave 1 as the first task — before the three new devDeps (`tsx`, `yaml`, `github-slugger`) are installed. Sequence: swap lockfiles → verify `pnpm install && pnpm test` all-green → install new devDeps via `pnpm add -D` → continue with scaffold. Keeps the v7.0 foundation in a single merge commit with a clean audit trail.

### Scripts Directory Layout (D-03, D-04, D-05)
- **D-03:** Subdivided-by-concern layout under `scripts/markdown-export/`:
  ```
  scripts/markdown-export/
  ├─ ir/
  │  ├─ types.ts
  │  └─ types.test.ts
  ├─ primitives/
  │  ├─ heading.ts           + heading.test.ts
  │  ├─ paragraph.ts         + paragraph.test.ts
  │  ├─ list.ts              + list.test.ts
  │  ├─ table.ts             + table.test.ts
  │  ├─ blockquote.ts        + blockquote.test.ts
  │  ├─ link.ts              + link.test.ts
  │  ├─ wikilink.ts          + wikilink.test.ts
  │  ├─ caption.ts           + caption.test.ts
  │  └─ (text/strong/emphasis/code/image/hr as needed)
  ├─ frontmatter/
  │  ├─ serialize.ts
  │  └─ serialize.test.ts
  ├─ escape/
  │  ├─ prose.ts             + prose.test.ts
  │  ├─ table-cell.ts        + table-cell.test.ts
  │  ├─ wikilink.ts          + wikilink.test.ts
  │  └─ code-block.ts        + code-block.test.ts
  └─ index.ts                (placeholder for Phase 43 orchestrator; empty re-exports)
  ```
- **D-04:** One file per primitive inside `primitives/`. Tests co-located with source (`heading.ts` next to `heading.test.ts`). Matches the co-located convention already used in `src/`.
- **D-05:** Only create directories that have content in Phase 38. Do NOT create empty `extractors/`, `renderers/`, or `fs-writer/` placeholder directories with `.gitkeep` files — Phases 39, 41, 43 create those directories when they land actual code.

### IR Design (D-06, D-07, D-08)
- **D-06:** `DocNode` is a discriminated union of block-level kinds: `heading`, `paragraph`, `list` (ordered + items), `table` (headers + rows), `blockquote` (nested `DocNode[]`), `hr`. Each kind tag is a string literal on the `kind` field. Exhaustiveness enforced via TypeScript's `never` pattern in renderer switch statements (renderer code arrives in Phase 41).
- **D-07:** Inline formatting uses a **structured inline tree**, not pre-flattened markdown strings. `InlineSpan` is a discriminated union: `{kind:'text',value}`, `{kind:'strong',children}`, `{kind:'emphasis',children}`, `{kind:'code',value}`, `{kind:'link',href,children}`, `{kind:'image',src,alt}`. Block nodes that can contain inline content carry `children: InlineSpan[]`. Rationale: mirrors the `ParagraphContent` shape already in use across `src/content/*.ts`, and honors the locked "two-mode renderer sharing DocNode IR — divergences only in renderer branches" decision from PROJECT.md (needed because `link` spans render as `[text](#anchor)` in the mono renderer but `[[Target|text]]` in the Obsidian renderer).
- **D-08:** `PageDoc` wraps a `DocNode[]` body with page-level metadata (`title`, `aliases`, `tags`, optional `date`, source route) used by extractors to attach everything a renderer needs about a single page in one object. Exact shape to be finalized in the `ir/types.ts` PR but must include at minimum: `title: string`, `aliases: string[]`, `tags: string[]`, `body: DocNode[]`, `sourceRoute: string`.

### Primitive Function Semantics (D-09, D-10)
- **D-09:** Primitives are **IR factories**. `heading(2, 'Foo')` returns `{kind:'heading',level:2,children:[{kind:'text',value:'Foo'}]}` — NOT a markdown string. Primitives contain zero rendering logic, zero escape logic, and zero knowledge of which output mode (mono vs Obsidian) is being rendered.
- **D-10:** Primitives accept convenience argument shapes where helpful: `heading(2, 'Foo')` is sugar for `heading(2, [text('Foo')])`, and primitives may also accept pre-built `InlineSpan[]` arrays for composed content. The sugar lives inside the primitive function body — callers get both ergonomics and type safety.

### tsconfig.scripts.json (D-11, D-12, D-13)
- **D-11:** Shape: `module: NodeNext` + `moduleResolution: NodeNext` + `strict: true` + `noEmit: true` + `paths: {}` + `target: ES2022` + `lib: ['ES2022']` + `types: ['node']` + standard hygiene flags (`isolatedModules`, `esModuleInterop`, `resolveJsonModule`, `skipLibCheck`). `include: ['scripts/markdown-export/**/*.ts']`.
- **D-12:** Wired into root `tsconfig.json` via project references: `"references": [{ "path": "./tsconfig.scripts.json" }]`. Root `tsconfig.json` itself is NOT changed except for adding the references array — its `include`, `compilerOptions`, and `paths` remain identical.
- **D-13:** The npm build script becomes `"build": "vue-tsc -b && vite build && pnpm build:markdown"`. The `vue-tsc -b` invocation picks up project references and type-checks `scripts/markdown-export/` as part of the same pass that checks `src/`. No separate scripts-typecheck command needed.

### Vitest Wiring (D-14, D-15)
- **D-14:** Add a third project `scripts` to `vitest.config.ts` alongside existing `unit` and `browser` projects. Config: `name: 'scripts'`, `include: ['scripts/markdown-export/**/*.test.ts']`, `environment: 'node'`, `globals: true`, extends: true. Does NOT touch the existing `unit` or `browser` project configs.
- **D-15:** Add `"test:scripts": "vitest run --project scripts"` to `package.json`. `pnpm test` (runs all projects) gains scripts tests automatically; CI gains them as well without config changes.

### Frontmatter Serialization (D-16, D-17)
- **D-16:** Canonical key order (deterministic output): `title` → `aliases` → `tags` → `date` (optional) → `cssclasses` (optional). Keys omitted when empty/undefined. All keys PLURAL — the locked forbidden-list bans singular `tag`, `alias`, `cssclass`.
- **D-17:** Frontmatter serialization uses the `yaml` package (locked devDep) with quoting rules tuned for Obsidian property parsing: wikilinks inside property values quoted as `"[[Target]]"`, flat arrays for multi-value keys, no inline/flow style for `tags` or `aliases`.

### docs/ Collision Audit (D-18)
- **D-18:** The collision audit deliverable is a standalone `038-DOCS-AUDIT.md` in the phase directory. Audit covers: (a) Vite `outDir` default (`dist`, no collision), (b) Storybook static build (`storybook-static`, no collision), (c) Vitest coverage output (no default collision), (d) Wrangler deploy dir (`dist`, no collision), (e) `.gitignore` current state (does not exclude `docs/`, good), (f) `.gitattributes` current state (check if EOL normalization needed for `docs/**`). Audit findings feed both the Phase 38 scaffold decisions and Phase 44 build integration.

### Escape Helper Scope (D-19)
- **D-19:** Four context-specific helpers with clearly-bounded responsibilities:
  - `escapeProse(s)` — escapes `\`, `*`, `_`, `[`, `]`, `` ` ``, `<`, `>`, `#`, `!`, `|`, `~`, HTML entities (`&amp;` etc.), NBSP (U+00A0), BOM (U+FEFF). Safe to call on any text that will appear outside of table cells, wikilink targets, or code blocks.
  - `escapeTableCell(s)` — superset of `escapeProse` plus pipe (`|`) escaping and newline replacement with `<br>` or similar. Used for any `InlineSpan` rendered inside a GFM table cell.
  - `escapeWikilinkTarget(s)` — escapes `|`, `]`, `[`, `#`, `^`, `\\`, and sanitizes reserved filesystem chars (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`) for Obsidian vault compatibility. Used for wikilink targets only, NOT for display text.
  - `escapeCodeBlockContent(s)` — only escapes triple-backticks (by switching to a longer fence, per GFM). Does NOT escape markdown syntax characters since code blocks preserve content verbatim.
- Each helper has its own unit test file with fixtures covering edge cases: pipes, backticks, HTML entities, NBSP, BOM, nested markdown syntax, unicode surrogates.

### Claude's Discretion

- **Test-only emit() helper:** Phase 38 unit tests assert on DocNode/InlineSpan object shape directly — no separate `emit(node)` helper module is shipped. If a specific primitive test benefits from a one-off emit helper, it lives inline in the test file (private to that file) and will be absorbed into the real renderer in Phase 41/42. Rationale: avoids scaffolding that gets deleted later.
- **PageDoc exact field list:** The minimum fields are locked (D-08), but whether `PageDoc` also carries `description`, `sourceFile`, `childRoutes`, or similar ergonomic fields is a planning-time decision. Err toward fewer fields — additions are cheap, removals cause churn.
- **Primitive argument sugar specifics:** Whether `list(['a', 'b', 'c'])` is sugar for `list({ordered: false, items: [paragraph(text('a')), ...]})` vs requiring the caller to build items manually is Claude's discretion. Err toward the most permissive sugar that still produces valid IR.
- **Test fixture file locations:** Whether escape/frontmatter test fixtures live co-located (e.g., `escape/prose.fixtures.ts`) or inline inside test files is Claude's discretion. Err toward inline for small fixtures, separate files when a fixture is reused across test files.
- **Wave structure and parallelization:** Plan-phase will decide wave ordering. Natural decomposition is: Wave 1 = pnpm migration + devDep install + tsconfig.scripts.json + vitest.config.ts update (serial, blocks everything). Wave 2 = ir/types.ts + escape/ helpers + frontmatter/serialize.ts + primitives/* (parallel, no inter-dependencies). Wave 3 = docs/ collision audit (informational, can run any time after Wave 1).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level locked constraints
- `.planning/PROJECT.md` §"v7.0 Foundation" (lines 89-150) — Full list of locked scoping decisions, forbidden list, and foundation requirements for the v7.0 milestone
- `.planning/PROJECT.md` §"Hard constraints / forbidden list" — Enumerates forbidden APIs (`Date.now()`, `new Date()`, `@/` imports inside `scripts/markdown-export/**`, `Promise.all` on ordered reads, `os.EOL`, `postinstall`/`prepare` hooks, `assert { type: 'json' }`, singular frontmatter keys, line-wrapping of prose, mtime/hash skip-unchanged, `.vue` SFC parsing)

### Roadmap
- `.planning/ROADMAP.md` line 158 — Phase 38 one-line definition: "IR + Markdown Primitives + Scaffold -- `scripts/markdown-export/` scaffold, `tsconfig.scripts.json`, 3 new devDeps, `DocNode`/`PageDoc` types, escape + frontmatter + primitives with unit tests, `docs/` collision audit"
- `.planning/ROADMAP.md` lines 159-165 — Downstream phases (39-45) the Phase 38 foundation must enable

### Prior phase outputs (Phase 37 — completed)
- `.planning/phases/037-sfc-content-extraction/037-RESEARCH.md` — Phase 37 research, including the `src/content/*.ts` shape and `ParagraphContent` discriminated union that the IR inline tree mirrors
- `.planning/phases/037-sfc-content-extraction/037-VERIFICATION.md` — Confirms LOAD-01 thin-loader invariant is enforced and `src/content/` is canonical
- `src/content/` (existing source tree) — Content modules with `ParagraphContent`-shaped inline segments that Phase 39 extractors will read; IR shape must accommodate this directly

### Codebase intel
- `.planning/codebase/STACK.md` — Current dependencies and tooling baseline
- `.planning/codebase/CONVENTIONS.md` — Test co-location convention, import style, naming rules
- `.planning/codebase/STRUCTURE.md` — Directory layout and where new `scripts/markdown-export/` fits

### External documentation (library references — read before planning primitive implementations)
- `tsx` docs — https://tsx.is — Runtime semantics, ESM support, how `.ts` files are loaded at runtime (matters for D-11 NodeNext resolution choice)
- `yaml` package docs — https://eemeli.org/yaml/ — Quoting rules, canonical key order support, flow vs block style (matters for D-16/D-17 frontmatter serializer)
- `github-slugger` docs — https://github.com/Flet/github-slugger — Slug generation rules (matters for anchor generation in Phase 41, but Phase 38 just installs it)
- TypeScript project references — https://www.typescriptlang.org/docs/handbook/project-references.html — Reference semantics, how `tsc -b` / `vue-tsc -b` walk references (matters for D-12)
- Vitest projects — https://vitest.dev/guide/projects.html — Multi-project configuration (matters for D-14 vitest wiring)
- GFM spec — https://github.github.com/gfm/ — Reference for all GFM constructs the primitives emit (matters for D-19 escape helper character sets)
- Obsidian frontmatter properties — https://help.obsidian.md/Editing+and+formatting/Properties — Property parsing rules, plural keys requirement (matters for D-16 canonical order + D-17 wikilink quoting)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`src/content/*.ts` ParagraphContent pattern** — Already-shipped discriminated union for inline formatting (text / strong / emphasis / link segments). The Phase 38 `InlineSpan` shape is a direct mirror so Phase 39 extractors can do a 1:1 mapping instead of a format conversion.
- **Existing `package.json` scripts architecture** — Already has `test`, `test:unit`, `test:browser` — adding `build:markdown` and `test:scripts` is additive and follows the existing naming pattern.
- **Existing `vitest.config.ts` multi-project setup** — Already has `unit` (happy-dom) and `browser` (Playwright) projects. Adding a third `scripts` project (environment: node) follows the exact pattern already in place.
- **Existing `vue-tsc -b` in build script** — Already uses TypeScript build mode (`-b`). Project references to `tsconfig.scripts.json` are picked up automatically with no build-script change beyond appending `pnpm build:markdown`.

### Established Patterns
- **Co-located tests** — `src/` tests live next to their source files (verified across 14+ existing test files). Phase 38 follows this convention for `scripts/markdown-export/**/*.test.ts`.
- **Discriminated unions for structural variation** — `Exhibit` type, `ExhibitSection` type, `ParagraphContent` type, `entryType` on personnel — the project consistently models "one of several shapes" with `kind`/`type` discriminants. `DocNode`/`InlineSpan` fit this idiom exactly.
- **Type assertions on JSON imports** — `src/data/*.ts` loaders use `as Exhibit[]` and `as const satisfies` to preserve discriminated-union narrowing across the JSON boundary. Phase 38 scaffolding does not touch `src/data/`, but Phase 39 extractors will need to understand this pattern when reading JSON.
- **Strict TypeScript throughout** — Root tsconfig has `strict: true`. The new scripts tsconfig must match or exceed this strictness (D-11 confirms `strict: true`).

### Integration Points
- **Root `tsconfig.json`** — Modified to add `"references": [{ "path": "./tsconfig.scripts.json" }]`. No other change.
- **Root `vitest.config.ts`** — Modified to add third `scripts` project. Existing `unit` and `browser` projects untouched.
- **Root `package.json`** — Modified to: (a) switch lockfile via pnpm migration, (b) add `tsx`/`yaml`/`github-slugger` to devDependencies, (c) add `"build:markdown": "tsx scripts/markdown-export/index.ts"` (empty orchestrator for Phase 38 — real wiring comes in Phase 43), (d) append `&& pnpm build:markdown` to the `build` script, (e) add `"test:scripts": "vitest run --project scripts"`.
- **New `tsconfig.scripts.json`** — Created per D-11, referenced from root per D-12.
- **New `scripts/markdown-export/` directory tree** — Created per D-03 layout.
- **Existing `src/content/*.ts` modules** — NOT touched by Phase 38. Only read conceptually to confirm the IR inline shape matches. Actual reads happen in Phase 39 extractors.
- **Existing `src/data/*.ts` modules and JSON files** — NOT touched by Phase 38. The orchestrator placeholder does not yet load them.

</code_context>

<specifics>
## Specific Ideas

- **"I like rigor."** (Captured from discussion 2026-04-10.) This preference drove two decisions:
  1. IR factories over string emitters (D-09) — type-safe exhaustiveness is strictly more rigorous than string-level tests.
  2. NodeNext over ESNext + bundler (D-11) — typecheck matches runtime, catches bugs at compile time rather than at midnight in CI.
- **"Simplicity and clarity."** (Captured from discussion 2026-04-10.) This preference drove:
  1. Subdivided-by-concern layout (D-03) — each file has one job, easier to reason about, easier to grep.
  2. One file per primitive (D-04) — scoped test failures, clear import paths.
  3. Rejection of Option C "split factories + emit helpers" for primitives (D-09) — the emit helper is temporary scaffolding that would get deleted later, adding unnecessary mental overhead.
- **Two Obsidian vault articles written during this session** capture the reasoning behind the IR-vs-strings and tsconfig-shape decisions for future reference:
  - `TOPICS/Web-Development/Intermediate Representation and Primitive Factories.md`
  - `TOPICS/Web-Development/TypeScript Project References and Separate tsconfig.md`

</specifics>

<deferred>
## Deferred Ideas

- **Vite plugin version of the markdown exporter** — Rejected during v7.0 milestone research synthesis. A standalone `tsx` script has better iteration speed, testability, and isolation. Not revisited.
- **`unified`/`remark`/`turndown`/`gray-matter` dependency** — Rejected in v7.0 milestone locked decisions. Phase 38 uses hand-rolled primitives + `yaml` + `github-slugger` only.
- **Separate pnpm workspace for `scripts/markdown-export/`** — Considered and rejected (tsconfig Shape 3 option). Overkill for an internal build step; workspace isolation cost is only worth paying for publishable tools. May revisit if the exporter ever graduates into a standalone CLI package.
- **Lint rule blocking string literals > N chars inside `<template>` blocks** — Previously surfaced in Phase 37 research (§5.1 Pitfall 2.1 mitigation). Still deferred — requires an ESLint setup decision that Phase 38 does not litigate.
- **`.gitkeep` files in empty `extractors/`, `renderers/`, `fs-writer/` directories** — Rejected (D-05). Future phases create those dirs when they have real content.
- **Test-only `emit()` helper module** — Rejected as Claude's discretion (see D-09 follow-up). If needed, inline in test files; never ship as a module.

</deferred>

---

*Phase: 038-ir-markdown-primitives-scaffold*
*Context gathered: 2026-04-10*
