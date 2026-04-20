# Phase 38: IR + Markdown Primitives + Scaffold - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 038-ir-markdown-primitives-scaffold
**Areas discussed:** Package Manager, Scripts Dir Layout, IR + Primitive Design, Scripts Build/Test Wiring

---

## Area Selection

**Question:** Which areas do you want to discuss for Phase 38?

| Option | Description | Selected |
|--------|-------------|----------|
| IR + primitive design | Architectural spine — DocNode inline granularity + primitive return type | ✓ |
| Scripts build/test wiring | tsconfig.scripts.json shape + vitest project wiring | ✓ |
| Scripts dir layout | Flat vs subdivided structure under scripts/markdown-export/ | ✓ |
| Package manager | Resolve pnpm-lock.yaml vs package-lock.json ambiguity | ✓ |

**User's choice:** All four areas.
**Notes:** No gray areas deferred to Claude's discretion at selection time.

---

## Package Manager

### Q1: Lockfile resolution

| Option | Description | Selected |
|--------|-------------|----------|
| Stay on npm, delete pnpm-lock | Treat pnpm-lock.yaml as stray from worktree merge; keep committed package-lock.json as canonical | |
| Migrate to pnpm | Delete package-lock.json, commit pnpm-lock.yaml, install new devDeps with pnpm add -D | ✓ |
| Defer — keep both until planning | Leave unresolved | |

**User's choice:** Migrate to pnpm.
**Notes:** User opted for the migration despite it adding pnpm transition work to Phase 38 scope. Decision honors the accidentally-present pnpm-lock.yaml rather than discarding it.

### Q2: Migration sequencing

| Option | Description | Selected |
|--------|-------------|----------|
| Fold into Phase 38 Wave 1 | Swap lockfiles as the first task, then install new devDeps via pnpm | ✓ |
| Insert decimal Phase 37.5 | Separate tiny phase for npm→pnpm swap before Phase 38 | |
| Pre-phase chore commit (outside GSD) | Manual swap bypassing GSD state | |

**User's choice:** Fold into Phase 38 Wave 1.
**Notes:** Keeps v7.0 foundation in a single merge commit with a clean audit trail.

---

## Scripts Dir Layout

### Q1: Layout shape

| Option | Description | Selected |
|--------|-------------|----------|
| Flat with co-located tests | All .ts files at scripts/markdown-export/ root | |
| Subdivided by concern | Subdirs: ir/, primitives/, frontmatter/, escape/, __tests__/ | ✓ |
| Hybrid: flat for 38, subdirs for 39-45 | Grow subdirs only when needed | |

**User's choice:** Subdivided by concern.
**Notes:** User selected the fully-subdivided layout, accepting the upfront scaffolding cost for clearer separation of concerns.

### Q2: Placeholder directories

| Option | Description | Selected |
|--------|-------------|----------|
| Only create what has content | No .gitkeep files; future phases create dirs when they land code | ✓ |
| Pre-create all future dirs with .gitkeep | Visual sitemap upfront | |
| (Third option was mis-posed — became its own question) | — | |

**User's choice:** Only create what has content.

### Q3: Primitives file granularity

| Option | Description | Selected |
|--------|-------------|----------|
| One file per primitive | heading.ts + heading.test.ts, paragraph.ts + paragraph.test.ts, etc. | ✓ |
| Single primitives/index.ts | All builders co-located in one file | |
| Grouped by block vs inline | block.ts + inline.ts | |

**User's choice:** One file per primitive.
**Notes:** Consistent with the subdivided-by-concern philosophy picked in Q1.

---

## IR + Primitive Design

### Q1: Inline granularity

| Option | Description | Selected |
|--------|-------------|----------|
| Structured inline tree | InlineSpan discriminated union mirroring src/content ParagraphContent | ✓ |
| Flat strings with escape-at-build-time | Paragraph.text is a plain markdown string | |
| Hybrid — structured for links, flat for emphasis | Links stay structured; em/strong/code pre-flattened | |

**User's choice:** Structured inline tree.
**Notes:** Aligns with the locked two-mode renderer architecture (link spans need different renderings in mono vs Obsidian).

### Q2: Primitive function semantics (pre-clarification)

**User's initial response:** "I'm not familiar with any of the options. Why would I choose one over the others?"

Claude provided a detailed explanation covering:
- What "primitive" means in this context (small helper functions for building markdown)
- The three options in plain English with analogies (recipe cards vs baked cake)
- Why Option A fits the locked "two-mode renderer sharing DocNode IR" decision
- What the code actually looks like end-to-end

**User's follow-up:** "What is IR? I'm leaning towards simplicity and clarity, but option A feels like it could be clearer if I grokked it properly. I like rigor."

Claude provided a second detailed explanation covering:
- What "Intermediate Representation" means (compiler/build-tool term)
- The pipeline pattern: source → extract → IR → render → output
- Real-world IR examples (TypeScript AST, Babel AST, remark MDAST, Vite module graph)
- Why Option A is *strictly more rigorous* (type-level exhaustiveness)
- Why Option A is *also clearer* (each concern has exactly one home)
- The "Option A vs Option B total code size" trade-off for a two-renderer project
- The concrete code walkthrough for a single paragraph with a link

**User's decision:** "I like Option A now. Please add an article to the main vault describing these contexts."

Claude wrote `TOPICS/Web-Development/Intermediate Representation and Primitive Factories.md` to the main Obsidian vault before returning to the question.

### Q2: Primitive function semantics (post-clarification)

| Option | Description | Selected |
|--------|-------------|----------|
| IR factories (return DocNode/InlineSpan) | Primitives return plain data objects; rendering deferred to renderer pass | ✓ |
| String emitters (return markdown strings) | Primitives return final markdown text directly | |
| Split: IR factories + separate emit helpers | IR factories + throwaway test-only emit(node) helper | |

**User's choice:** IR factories.
**Notes:** Decision driven by the user's "I like rigor" preference (type-level exhaustiveness) combined with the locked "two-mode renderer sharing DocNode IR — divergences only in renderer branches" constraint in PROJECT.md.

---

## Scripts Build/Test Wiring

### Q1: tsconfig.scripts.json (pre-clarification)

**User's initial response:** "Please explain each one and why I would pick it over the others."

Claude provided a comprehensive explanation covering:
- What problem a separate tsconfig solves (different runtime, different file set, locked constraints)
- A terminology cheat sheet (ESM, NodeNext vs bundler, noEmit, isolatedModules, strict, paths, project references, tsx)
- Each of the three options in detail with concrete code, pros, cons, and "who this fits"
- A decision matrix
- An explicit recommendation tied to the user's stated rigor preference

**User's decision:** "Choose 1, and also add an article explaining all this to the vault."

Claude wrote `TOPICS/Web-Development/TypeScript Project References and Separate tsconfig.md` to the main Obsidian vault before continuing.

### Q1: tsconfig.scripts.json (post-clarification)

| Option | Description | Selected |
|--------|-------------|----------|
| NodeNext ESM, strict, noEmit, referenced from root | Matches tsx runtime semantics; typecheck matches runtime | ✓ |
| ESNext + bundler, match root tsconfig | Consistency with src/; no .js extensions in imports | |
| Separate 'scripts' workspace with its own package.json | Full monorepo-style isolation | |

**User's choice:** NodeNext + references (Shape 1).
**Notes:** Chosen because it honors the locked "no @/ in scripts/markdown-export/" rule at the compiler level (paths: {}) and because typecheck-matches-runtime rigor aligns with the user's stated preference for catching bugs at compile time rather than runtime.

### Q2: Vitest wiring

| Option | Description | Selected |
|--------|-------------|----------|
| Add new 'scripts' vitest project | Third project alongside unit and browser; environment: node | ✓ |
| Expand 'unit' project include glob | Add scripts tests to existing unit project | |
| Separate vitest.scripts.config.ts | Standalone vitest config for scripts/ | |

**User's choice:** Add new 'scripts' vitest project.
**Notes:** Matches the existing multi-project architecture. Gives scripts tests their own named scope and isolates Node-only tests from src/ DOM tests.

---

## Final Confirmation

**Question:** Anything still unclear before I write CONTEXT.md?

| Option | Description | Selected |
|--------|-------------|----------|
| I'm ready for context | Write 038-CONTEXT.md and auto-advance to plan-phase | ✓ |
| Explore the discretion items | Walk through frontmatter order, docs/ audit, escape helpers, emit helper | |
| Revisit one of the four decided areas | Reopen IR, layout, PM, or build/test wiring | |

**User's choice:** I'm ready for context.

---

## Claude's Discretion

Areas where the user explicitly or implicitly deferred to Claude's judgment:
- **Test-only emit() helper** — No module shipped; inline in test files if needed
- **PageDoc exact field list** — Minimum fields locked; ergonomic additions at planning time
- **Primitive argument sugar specifics** — Most permissive sugar that produces valid IR
- **Test fixture file locations** — Inline for small fixtures, separate files when reused
- **Wave structure and parallelization** — Natural 3-wave decomposition proposed; planner finalizes
- **Frontmatter canonical key order** — Proposed: title → aliases → tags → date → cssclasses
- **docs/ collision audit deliverable location** — Proposed: standalone 038-DOCS-AUDIT.md
- **Escape helper character scope** — Proposed: standard set per GFM + Obsidian compatibility

## Deferred Ideas

Ideas surfaced during discussion that were explicitly noted for future phases or as rejected:
- Vite plugin version of exporter — rejected in v7.0 milestone research
- `unified`/`remark`/`turndown`/`gray-matter` — rejected in v7.0 locked decisions
- Separate pnpm workspace for scripts/markdown-export/ — considered, rejected (overkill)
- Lint rule for template string literals — deferred from Phase 37
- `.gitkeep` files in empty future directories — rejected
- Test-only `emit()` helper module — rejected (inline if needed)

## Vault Articles Written

During this session, two reference articles were added to the main Obsidian vault to capture the reasoning behind the major architectural decisions:

1. `TOPICS/Web-Development/Intermediate Representation and Primitive Factories.md` — Explains what an IR is, why markdown generators use one, and the three ways primitive builder functions can be shaped.
2. `TOPICS/Web-Development/TypeScript Project References and Separate tsconfig.md` — Explains why a project sometimes needs more than one tsconfig, what project references do, and how to choose between NodeNext ESM, ESNext + bundler, and a full workspace package.

Both articles are cross-linked and tagged `web-development`, `typescript`, `pattern158`.
