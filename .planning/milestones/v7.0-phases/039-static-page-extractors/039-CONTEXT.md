# Phase 39: Static Page Extractors - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 39 delivers the **site-map and extractor layer** for 7 static pages in the v7.0 markdown export pipeline:

1. `scripts/markdown-export/site-map.ts` — the canonical registry of static routes, each entry pointing at its extractor.
2. Seven per-page extractors under `scripts/markdown-export/extractors/`: `home`, `philosophy`, `technologies`, `case-files`, `faq`, `contact`, `accessibility`.
3. A shared `meta.ts` module holding page-level metadata (title/tags/aliases/navOrder) for those 7 pages.
4. Per-extractor co-located unit tests plus a shared `site-map.test.ts` drift-guard.

**Out of scope for this phase:** The exhibit (dynamic) extractor (Phase 40), renderers (Phase 41 mono / Phase 42 Obsidian vault), orchestrator + fs-writer (Phase 43), build integration (Phase 44), and docs (Phase 45). Phase 39 ships the extractor layer only — no file emission yet.

</domain>

<decisions>
## Implementation Decisions

### Page Metadata Location (D-01 … D-04)
- **D-01:** Page-level metadata lives in a shared module: `scripts/markdown-export/meta.ts`. Each of the 7 static pages gets one entry. Single source of truth for title/tags/aliases/navOrder.
- **D-02:** Static-page tags: exactly **one flat kebab-case tag per page** (e.g., `philosophy`, `accessibility`, `case-files`). No nested tag hierarchies. Matches the flat-tag policy locked for the Obsidian vault renderer (VAULT-03).
- **D-03:** No aliases for static pages: `aliases: []` is the default. Static pages don't need label variants — the route name is canonical. (Exhibits will use aliases in Phase 40.)
- **D-04:** Nav hierarchy is flat: each `SiteMapEntry` carries `navOrder: number`. The renderer in Phase 41 uses this to compute heading-shift depth. No nested parent/child metadata on static entries.

### site-map.ts Shape + Exclusions (D-05 … D-10)
- **D-05:** Each `SiteMapEntry` carries a **direct extractor function reference**: `extract: (ctx: ExtractorContext) => PageDoc`. No string-based lookups, no module path strings. Types catch broken references at `vue-tsc -b`.
- **D-06:** Excluded routes (`/review`, `/diag`, 404 catch-all) are documented in a **block comment at the top of `site-map.ts`** explaining why each route is excluded. There is NO exported `excludedRoutes` array — exclusion is by omission from the site-map.
- **D-07:** Phase 40 children slot is defined now but empty for static pages: `children?: readonly SiteMapEntry[]`. Keeps the Phase 39 type shape forward-compatible with the exhibit extractor's parametric expansion in Phase 40. Static entries set `children: []` or omit the field.
- **D-08:** `sourceRoute` (e.g., `/philosophy`) is passed to extractors via `ExtractorContext`, not embedded in the extractor body. Keeps the extractor function pure and the route-to-extractor binding in one place (`site-map.ts`).
- **D-09:** Drift-guard test: a programmatic test (`site-map.test.ts`) with a hardcoded `KNOWN_EXCLUSIONS` allowlist asserts the Vue router's route list minus `KNOWN_EXCLUSIONS` equals the site-map's route list. Any router addition without a matching site-map entry (or allowlist update) fails CI.
- **D-10:** `ExtractorContext` shape is minimal: `{ sourceRoute: string }`. No injected loaders, no IR builders, no renderer hints. Extractors import what they need directly. Context grows only if Phase 40 or later demands it.

### Content → IR + Heading Policy (D-11 … D-16)
- **D-11:** **H1 lives in `PageDoc.title` only.** Extractors do NOT emit a `heading` DocNode with `level: 1` in `PageDoc.body`. The Phase 41 renderer decides whether to emit `# {title}` at the top of the monolithic file; the Phase 42 Obsidian renderer relies on frontmatter `title`. Keeps extractors renderer-agnostic (matches Phase 38 D-09 — primitives and IR contain zero rendering decisions).
- **D-12:** Section mapping: each **named export in a content module that has a `heading` field** maps to one `heading(2, ...)` node followed by that section's body nodes (paragraphs, lists, blockquotes, tables), in the order the extractor composes them. Section order inside `PageDoc.body` is defined by the extractor, not by the shape of the content module (module shape is unordered object keys).
- **D-13:** Section heading = **H2**. Sub-headings inside a section (e.g., labeled bullets with `label`+`body`) stay as paragraphs/lists — no H3 is fabricated unless the content module explicitly has a nested `heading` field. Avoids inventing structure that doesn't exist in source.
- **D-14:** `DefinitionListItem[]` and `LabeledBullet[]` render as **GFM bullet lists**: each item becomes `paragraph([strong(term), text(' — '), text(description)])` wrapped in a `list` primitive. No HTML `<dl>` — GFM-only per Phase 38 D6. Same output for mono and Obsidian renderers.
- **D-15:** Quotes (`PhilosophyQuote`, `ColleagueQuote`, `HomeTeaserQuote`): extractors emit `blockquote([paragraph(text), paragraph(emphasis(cite))])`. Obsidian `> [!quote]` callouts are a **Phase 42 renderer decision** — extractors do not emit callout syntax.
- **D-16:** **Nav-depth heading shift is out of scope for Phase 39.** Extractors always emit H2 as the first body-level heading. Phase 41's monolithic renderer performs the shift (per ROADMAP.md Phase 41 scope "heading-level shifting by nav depth").

### Extractor Testing Strategy (D-17 … D-23)
- **D-17:** One test file per extractor, co-located: `scripts/markdown-export/extractors/home.ts` + `home.test.ts`, etc. Matches Phase 38 co-location convention.
- **D-18:** **No shared extractor-test-helper module in Phase 39.** If two test files need the same assertion, inline it in one of them. Revisit only when duplication reaches 3+ call sites. Avoids premature abstraction (same reasoning that rejected the Phase 38 `emit()` helper).
- **D-19:** Per-extractor test must assert at minimum:
  - (a) `PageDoc.title` matches the expected canonical title (from `meta.ts`).
  - (b) `PageDoc.tags` and `PageDoc.aliases` match `meta.ts`.
  - (c) `body[0].kind === 'heading' && body[0].level === 2` — first body node is an H2, never an H1.
  - (d) Round-trip section coverage: for each section in the content module, a matching H2 appears in body order; body length equals expected block count.
  - (e) No `kind: 'heading' && level: 1` anywhere in `body`.
- **D-20:** One **Vitest inline snapshot** per extractor via `toMatchInlineSnapshot()` asserting the full `PageDoc`. No separate `__snapshots__/` directory — keeps snapshot rot localized to the test file. Snapshots are reviewable in diff.
- **D-21:** Round-trip against source: extractors **import the same `src/content/*.ts` modules the Vue SFCs import**. Tests assert extractor output derives from those imports — no duplicated fixture data. Parallels the Phase 37 browser-test pattern. If content changes, both the page and the doc export update together (single source of truth, LOAD-01 compatible).
- **D-22:** Drift-guard lives in `scripts/markdown-export/site-map.test.ts` (shared, not per-extractor) and asserts: (i) every non-excluded route in `src/router.ts` has a matching `SiteMapEntry`; (ii) every `SiteMapEntry` points at a route present in the router; (iii) `KNOWN_EXCLUSIONS` exactly matches the set of router routes with no site-map entry.
- **D-23:** Extractors **throw on missing content** (e.g., expected named export is undefined). Phase 39 tests do NOT assert on error paths — error paths belong to the orchestrator-integration tests in Phase 43. Keeps Phase 39 test surface tight.

### Claude's Discretion

- **Extractor directory structure inside `scripts/markdown-export/extractors/`:** Flat (one `.ts` per page) vs grouped is Claude's call during planning. Flat is preferred given only 7 files.
- **`meta.ts` data shape:** Whether `meta.ts` exports a single `PAGE_META` Record keyed by route, or one named export per page, is Claude's discretion — err toward the ergonomics that make `site-map.ts` the cleanest.
- **Helper imports inside extractors:** Whether extractors import primitives individually (`import { heading, paragraph } from './primitives/...'`) or via a barrel (`from '../primitives'`) is Claude's call. Phase 38 has no barrel yet — either pattern is fine as long as it's consistent across all 7 extractors.
- **Content-module shape bridging:** When a content module has a slightly different shape (e.g., `{heading, intro, bullets}` vs `{heading, paragraphs}`), whether extractors use a private per-module adapter function or inline the conversion is Claude's discretion. Err toward inlining for clarity when the adapter would only be called once.
- **Wave decomposition:** Plan-phase decides. Natural split is: Wave 1 = `meta.ts` + `SiteMapEntry` / `ExtractorContext` types + `site-map.ts` scaffold (serial, unblocks everything). Wave 2 = seven extractors in parallel (no inter-dependencies). Wave 3 = `site-map.test.ts` drift-guard (depends on all Wave 2 extractors existing).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-level locked constraints
- `.planning/PROJECT.md` §"v7.0 Active" (lines 83–150) — Locked scope for the v7.0 milestone, forbidden list, monolithic-vs-Obsidian decisions, and the extractor-layer requirements.
- `.planning/PROJECT.md` §"Hard constraints / forbidden list" — `Date.now()`, `new Date()`, `@/` imports inside `scripts/markdown-export/**`, `Promise.all` on ordered reads, `os.EOL`, `postinstall`/`prepare` hooks, `assert { type: 'json' }`, singular frontmatter keys, line-wrapping of prose, mtime/hash skip-unchanged, `.vue` SFC parsing.

### Roadmap
- `.planning/ROADMAP.md` line 167 — Phase 39 one-liner: "Static Page Extractors -- `site-map.ts` with 7 static routes + one extractor per static page (home, philosophy, technologies, case-files, faq, contact, accessibility)".
- `.planning/ROADMAP.md` lines 168–173 — Downstream Phase 40 (Exhibit Extractor), Phase 41 (Mono Renderer), Phase 42 (Obsidian Renderer), Phase 43 (Writer+Orchestrator). Phase 39 must not pre-empt these phases' concerns.

### Prior phase outputs (Phase 38 — completed)
- `.planning/phases/038-ir-markdown-primitives-scaffold/038-CONTEXT.md` — Locked IR and primitive semantics (D-06 through D-10), frontmatter shape (D-16/17), escape helpers (D-19). Phase 39 consumes everything Phase 38 built.
- `scripts/markdown-export/ir/types.ts` — `DocNode`, `InlineSpan`, `PageDoc`, `HeadingLevel`, `assertNever` — the types Phase 39 extractors produce.
- `scripts/markdown-export/primitives/` — Nine primitives: `text`, `heading`, `paragraph`, `link`, `wikilink`, `caption`, `list`, `table`, `blockquote`. Phase 39 extractors compose these.
- `scripts/markdown-export/frontmatter/serialize.ts` — NOT used directly by extractors (extractors produce `PageDoc`, renderer serializes frontmatter), but the canonical key order (title→aliases→tags→date→cssclasses) constrains what `meta.ts` entries must shape to.
- `scripts/markdown-export/escape/` — NOT used directly by extractors; renderers apply escaping.

### Prior phase outputs (Phase 37 — completed)
- `.planning/phases/037-sfc-content-extraction/037-CONTEXT.md` — Captures the `src/content/*.ts` shape convention and LOAD-01 thin-loader invariant. Phase 39 extractors must read content modules the same way SFCs do.
- `src/content/` (existing source tree): `home.ts`, `philosophy.ts`, `technologies.ts`, `caseFiles.ts`, `faqPage.ts`, `contact.ts`, `accessibility.ts`, plus `src/content/sections/` (aiClarity, companyFit, compensation, contactMethods, cultureFit, howIWork, pattern158Origin, roleFit) — the content modules Phase 39 extractors import.
- `.planning/phases/037-sfc-content-extraction/037-VERIFICATION.md` — Confirms `src/content/` is canonical and LOAD-01 is enforced.

### Codebase intel
- `.planning/codebase/STACK.md` — Current tooling baseline (Vue 3, Vite, Vitest, pnpm, tsx).
- `.planning/codebase/CONVENTIONS.md` — Test co-location convention, import style, naming rules.
- `.planning/codebase/STRUCTURE.md` — Directory layout; how `scripts/markdown-export/extractors/` fits in the tree.

### Router + route source of truth
- `src/router.ts` (or wherever Vue Router is configured) — The canonical route list that the drift-guard test compares against. Phase 39 drift-guard reads from this.

### External documentation (library references)
- Vitest `toMatchInlineSnapshot()` — https://vitest.dev/api/expect.html#tomatchinlinesnapshot — Inline snapshot semantics (relevant to D-20).
- GFM spec — https://github.github.com/gfm/ — Bullet list and blockquote syntax the extractor must produce valid IR for.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`scripts/markdown-export/ir/types.ts`** — `DocNode`, `InlineSpan`, `PageDoc`, `HeadingLevel`, `assertNever`. Every extractor function's return type is `PageDoc`.
- **`scripts/markdown-export/primitives/*.ts`** — Nine primitives already shipped: `text`, `heading`, `paragraph`, `link`, `wikilink`, `caption`, `list`, `table`, `blockquote`. Extractors compose these — no new primitives needed.
- **`src/content/*.ts`** — Seven page modules (`home`, `philosophy`, `technologies`, `caseFiles`, `faqPage`, `contact`, `accessibility`) plus 8 section sub-modules under `src/content/sections/`. All use the `ParagraphContent`-shaped inline segments the IR mirrors.
- **Vitest `scripts` project** (configured in Phase 38) — `pnpm test:scripts` runs extractor tests alongside unit + browser projects.

### Established Patterns
- **Co-located tests** — Confirmed across Phase 38 (18 test files) and `src/` (14+ files). Phase 39 extractors follow the same pattern.
- **Discriminated unions with `kind` tag** — Used for `DocNode`, `InlineSpan`, `ExhibitSection`, `entryType`. Consistent idiom for structural variation.
- **LOAD-01 thin-loader invariant** — `src/data/*.ts` loaders may only import JSON + assert types + re-export. Phase 39 extractors import content modules (not data loaders) and transform IR — they are NOT loaders, so LOAD-01 doesn't bind extractors, but they must consume content modules in the same read-only way.
- **Strict TypeScript** — `strict: true` in both root and `tsconfig.scripts.json`. Extractors must be fully typed, no `any`.

### Integration Points
- **New `scripts/markdown-export/site-map.ts`** — Single registry exporting `SiteMapEntry[]`. Consumed by Phase 43 orchestrator.
- **New `scripts/markdown-export/meta.ts`** — Page metadata registry. Consumed by the 7 extractors.
- **New `scripts/markdown-export/extractors/{page}.ts`** — One file per page, each exporting one `extract(ctx): PageDoc` function.
- **Existing `src/content/*.ts`** — Read by extractors (no modifications).
- **Existing `src/router.ts`** — Read by drift-guard test (no modifications).
- **Existing `scripts/markdown-export/ir/types.ts`** — `SiteMapEntry` + `ExtractorContext` types added here (or in a new `site-map.types.ts` if `types.ts` is meant to stay IR-only — planning's call).
- **Existing `package.json`** — No changes. `pnpm test:scripts` already runs the new tests.
- **Existing `tsconfig.scripts.json`** — `include` already covers `scripts/markdown-export/**/*.ts`. No tsconfig change.

</code_context>

<specifics>
## Specific Ideas

- **Extractors stay renderer-agnostic** — The Phase 38 D-09 lock-in (primitives carry zero rendering logic, zero escape logic, zero knowledge of output mode) extends to extractors in Phase 39. No callout syntax, no wikilink emission (extractors emit `link` primitives; renderers decide mono anchors vs Obsidian wikilinks), no heading shift. If a decision is between "extractor knows" or "renderer knows", Phase 39 defers to the renderer.
- **Round-trip fidelity first, exotic structure never** — Extractors match the shape of the source content modules. Where a module has 5 named section exports, the extractor produces 5 H2 sections in the obvious order. Extractors do NOT reorganize, deduplicate, or re-group content beyond what the SFC already does.
- **Single source of truth for content** — Extractors read the same `src/content/*.ts` modules SFCs read (LOAD-01-compatible). No fixture data, no duplication. If the content changes, the page, the monolithic markdown file, and the Obsidian vault file all change together.

</specifics>

<deferred>
## Deferred Ideas

- **Exhibit (dynamic) extractor** — Phase 40 scope. Covers 15 exhibits and 5 section types. Phase 39's `children?: readonly SiteMapEntry[]` slot is where Phase 40 plugs in.
- **Nav-depth heading shift** — Phase 41 monolithic-renderer scope. Phase 39 always emits H2 as the first body heading level.
- **Obsidian `> [!quote]` callouts** — Phase 42 Obsidian-renderer scope. Phase 39 emits plain `blockquote` DocNodes; the Obsidian renderer wraps them in callout syntax.
- **Frontmatter serialization at extractor time** — Phase 42/43 scope (extractor produces `PageDoc.{title, aliases, tags, date?, cssclasses?}`; renderer serializes via `scripts/markdown-export/frontmatter/serialize.ts`).
- **Route → anchor link rewriting** — Phase 41 monolithic-renderer scope. Extractors emit `link` primitives with route strings as `href`; the renderer rewrites them.
- **Drift-guard for Phase 40 exhibit routes** — Phase 40 scope. Phase 39 drift-guard only covers static routes.
- **Shared extractor-test helper module** — Explicitly rejected for Phase 39 (D-18). Revisit when duplication crosses 3+ call sites.

</deferred>

---

*Phase: 039-static-page-extractors*
*Context gathered: 2026-04-19*
