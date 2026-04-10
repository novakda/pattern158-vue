# Architecture: Static Markdown Export Pipeline (v7.0)

**Project:** pattern158-vue
**Milestone:** v7.0 — Static Markdown Export
**Researched:** 2026-04-10
**Overall confidence:** HIGH (existing codebase inspected directly; Vite layout convention verified against official docs)

---

## 1. Overview

The v7.0 milestone adds a build-time pipeline that emits two markdown artifacts from the same content that powers the running site:

1. **Monolithic artifact** — `docs/site-content.md`: one file, entire site, hierarchical heading levels mirroring the nav tree.
2. **Obsidian vault artifact** — `docs/obsidian-vault/`: one `.md` per page, folder structure mirroring the menu, YAML frontmatter, `[[wikilinks]]`, category tags.

The pipeline runs three ways, all driven from the same orchestrator:

- **Standalone:** `npm run build:markdown` (fast iteration during v7.0 development)
- **Integrated:** `npm run build` runs the markdown export after the Vite build completes
- **Manual test:** `npm run test` snapshots the two artifacts and fails if they drift

The core architectural choice: the export pipeline is a **pure Node.js TypeScript program that imports the existing `src/data/*.ts` thin loaders directly**. It does NOT run Vue, does NOT require a browser, and does NOT touch the Vite dev server. It shares the project's tsconfig paths (`@/data/*`, `@/types/*`) so the data layer is consumed with zero duplication.

The single hard problem is **content sourcing for prose that currently lives inside `.vue` templates**. This document recommends a specific path (option B: partial SFC refactor) and details its scope.

---

## 2. Proposed Directory Layout

```
pattern158-vue/
├── scripts/                          # NEW — build-time tooling (Vite convention: not in src/)
│   └── markdown-export/
│       ├── index.ts                  # Orchestrator entry — npm run build:markdown target
│       ├── site-map.ts               # Declarative page → route → content source registry
│       ├── content/                  # Page content extractors (one per page)
│       │   ├── home.ts
│       │   ├── philosophy.ts
│       │   ├── technologies.ts
│       │   ├── case-files.ts
│       │   ├── faq.ts
│       │   ├── contact.ts
│       │   ├── accessibility.ts
│       │   └── exhibit.ts            # Parametric — called 15x, once per exhibit
│       ├── ir/                       # Intermediate representation types
│       │   ├── nodes.ts              # DocNode union (Heading, Paragraph, List, Table, ...)
│       │   └── page.ts               # PageDoc (metadata + DocNode[])
│       ├── markdown/                 # Shared markdown primitives (renderer-agnostic)
│       │   ├── primitives.ts         # heading(), paragraph(), list(), table(), link(), blockquote()
│       │   ├── escape.ts             # Character escaping, HTML entity unescaping
│       │   └── frontmatter.ts        # YAML frontmatter builder
│       ├── renderers/
│       │   ├── monolithic.ts         # PageDoc[] → single string (site-content.md)
│       │   └── obsidian.ts           # PageDoc[] → { path: string, content: string }[]
│       ├── writers/
│       │   └── fs-writer.ts          # Writes to docs/, cleans stale files, idempotent
│       └── __tests__/
│           ├── primitives.test.ts
│           ├── monolithic.snapshot.test.ts
│           └── obsidian.snapshot.test.ts
│
├── src/                              # unchanged — runtime Vue code only
│   ├── content/                      # NEW — prose extracted from .vue SFCs
│   │   ├── home.ts                   # intro paragraphs, section headings
│   │   ├── philosophy.ts             # design-thinking, moral-spine sections
│   │   ├── sections/                 # section components backing JSON
│   │   │   ├── howIWork.ts           # was HowIWorkSection.vue template text
│   │   │   ├── aiClarity.ts          # was AiClaritySection.vue template text
│   │   │   ├── pattern158Origin.ts   # was Pattern158OriginSection.vue template text
│   │   │   └── testimonialBlocks.ts  # recurring "What Colleagues Say" quote sets
│   │   └── meta.ts                   # Page titles, slugs, nav order, SEO descriptions
│   ├── data/                         # unchanged
│   ├── types/                        # unchanged
│   ├── pages/                        # MODIFIED — import from src/content/ instead of hardcoding prose
│   └── components/                   # MODIFIED — HowIWorkSection etc. v-for over imported content
│
├── docs/                             # NEW — committed build output
│   ├── site-content.md
│   └── obsidian-vault/
│       ├── index.md
│       ├── philosophy.md
│       ├── case-files/
│       │   ├── index.md
│       │   └── exhibits/
│       │       ├── exhibit-a.md
│       │       └── ... (15 files)
│       └── ...
│
├── package.json                      # MODIFIED — build:markdown script, build script chain
└── tsconfig.scripts.json             # NEW — extends tsconfig, includes scripts/
```

**Rationale for `scripts/` at repo root (not `src/export/` or `tools/`):**

- `src/` is reserved by Vite convention for code shipped to the browser. Putting build-time Node code in `src/` causes tree-shaking confusion and risks accidental bundling.
- `scripts/` is the dominant convention in Vue/Vite ecosystem projects for Node-side tooling that is invoked via `npm run` but not bundled.
- `tools/` is used by some repos but typically implies external-facing dev tools; `scripts/` better signals "project-internal npm scripts".
- The pipeline is one coherent program — it gets its own subdirectory (`scripts/markdown-export/`) rather than being sprayed across multiple files at `scripts/` root.

**Rationale for `src/content/`:**

- Content extracted from `.vue` SFCs has to live somewhere importable by both the runtime Vue pages and the build-time exporter.
- Placing it under `src/` lets Vue pages import it with the existing `@/content/*` path alias — no alias changes required.
- Keeping it separate from `src/data/` preserves the meaning of `data/` (structured records, JSON-backed) vs `content/` (prose, string-backed).

---

## 3. Module Inventory

### New modules

| Module | Responsibility | Consumers |
|--------|---------------|-----------|
| `scripts/markdown-export/index.ts` | Orchestrator: load site-map → run extractors → render both artifacts → write files | `npm run build:markdown`, `npm run build` |
| `scripts/markdown-export/site-map.ts` | Single source of truth for which pages exist, their order, nav hierarchy, file paths, and which extractor handles them | Orchestrator |
| `scripts/markdown-export/content/*.ts` | Per-page extractors. Each exports `extract(): PageDoc`. Reads from `src/data/*` and `src/content/*`. Pure function, no side effects. | Orchestrator |
| `scripts/markdown-export/content/exhibit.ts` | Parametric extractor: `extract(exhibit: Exhibit): PageDoc`. Called once per exhibit (15x). | Orchestrator |
| `scripts/markdown-export/ir/nodes.ts` | `DocNode` discriminated union: Heading, Paragraph, List, OrderedList, Table, Blockquote, CodeBlock, Link, Image (alt → caption), HorizontalRule | Extractors, renderers |
| `scripts/markdown-export/ir/page.ts` | `PageDoc` type: frontmatter metadata (title, slug, navPath, tags, date) + `DocNode[]` body | Extractors, renderers |
| `scripts/markdown-export/markdown/primitives.ts` | Stateless markdown string builders: `heading(level, text)`, `list(items)`, `table(cols, rows)`, `link(text, href)`, `blockquote(text, cite?)` | Both renderers |
| `scripts/markdown-export/markdown/escape.ts` | `escapeMd(s)`, `unescapeHtmlEntities(s)` — converts `&mdash;` to `—`, escapes `*`, `_`, `[`, `]` in prose | Primitives |
| `scripts/markdown-export/markdown/frontmatter.ts` | `frontmatter(meta)` → YAML block for Obsidian files | Obsidian renderer |
| `scripts/markdown-export/renderers/monolithic.ts` | `render(pages: PageDoc[]): string`. Promotes `PageDoc[]` to one document, shifting heading levels by nav depth. Resolves internal links to anchor fragments. | Orchestrator |
| `scripts/markdown-export/renderers/obsidian.ts` | `render(pages: PageDoc[]): {path, content}[]`. Emits one file per page with frontmatter, converts internal links to `[[wikilinks]]`. | Orchestrator |
| `scripts/markdown-export/writers/fs-writer.ts` | Idempotent write: wipes `docs/obsidian-vault/` cleanly, writes new files, preserves directory. | Orchestrator |
| `src/content/meta.ts` | `pageMeta` record: per-route { title, navPath, navOrder, seoDescription, obsidianFilename }. Runtime pages can use this instead of duplicating title strings in `useSeo()` calls. | Pages, site-map, extractors |
| `src/content/home.ts` | HomePage intro heading + paragraphs + teaser quote set as typed data. | HomePage.vue, home extractor |
| `src/content/philosophy.ts` | PhilosophyPage design-thinking + moral-spine prose. | PhilosophyPage.vue, philosophy extractor |
| `src/content/sections/howIWork.ts` | Three methodology steps as `{ heading, paragraphs: string[] }[]`. | HowIWorkSection.vue, philosophy extractor |
| `src/content/sections/aiClarity.ts` | Prose block for AiClaritySection. | AiClaritySection.vue, philosophy extractor |
| `src/content/sections/pattern158Origin.ts` | Prose block for Pattern158OriginSection. | Pattern158OriginSection.vue, philosophy extractor |
| `src/content/sections/testimonialBlocks.ts` | Named quote sets (`philosophyColleagueQuotes`, `faqColleagueQuotes`) used by the recurring "What Colleagues Say" blocks. | PhilosophyPage.vue, FaqPage.vue, extractors |
| `tsconfig.scripts.json` | Extends root tsconfig, includes `scripts/**/*`, targets Node ESM, no DOM lib. | `tsx` / `vite-node` runner |

### Modified modules

| Module | Change | Reason |
|--------|--------|--------|
| `package.json` | Add `build:markdown` script running `tsx scripts/markdown-export/index.ts`. Modify `build` to `vue-tsc -b && vite build && npm run build:markdown`. Add `tsx` to devDependencies. | Pipeline integration |
| `src/pages/HomePage.vue` | Replace intro `<h2>` + `<p>` literals with `{{ homeContent.introHeading }}` and `v-for` over `homeContent.introParagraphs`. Move `teaserQuotes` const into `src/content/home.ts`. | Make prose importable by extractor |
| `src/pages/PhilosophyPage.vue` | Replace design-thinking and moral-spine hardcoded prose with imports from `src/content/philosophy.ts`. Move testimonial pair to `testimonialBlocks.ts`. | Same |
| `src/pages/FaqPage.vue` | Move colleague testimonial pair to `testimonialBlocks.ts`. | Same |
| `src/pages/ContactPage.vue` | Move hardcoded intro prose (if any) to `src/content/contact.ts`. | Same |
| `src/pages/AccessibilityPage.vue` | Move prose paragraphs to `src/content/accessibility.ts`. | Same |
| `src/pages/TechnologiesPage.vue` | Move any section headings/intros to `src/content/technologies.ts`. | Same |
| `src/components/HowIWorkSection.vue` | Replace three hardcoded `<li>` blocks with `v-for` over imported steps array. | Same |
| `src/components/AiClaritySection.vue` | Replace template literal with import + render loop. | Same |
| `src/components/Pattern158OriginSection.vue` | Same. | Same |
| `src/components/HeroMinimal.vue` | No change (already prop-driven). | — |
| `.gitignore` | Ensure `docs/` is NOT ignored. | Committed output |
| `vitest.config.ts` (if needed) | Ensure `scripts/**/__tests__/**` is picked up by unit project. | Test discovery |

### Unchanged

Everything in `src/data/`, `src/types/`, the router, existing exhibit components, layouts, and 15 exhibit JSON files. The exhibit extractor reads directly from `exhibits.ts` — no SFC refactor needed for exhibit detail pages because they are already 100% data-driven.

---

## 4. Content Sourcing Decision

This is the highest-leverage decision in the milestone.

### The three options

**Option A — Manual page content map in TS that duplicates page strings**
Create `src/content/*.ts` with the prose copy-pasted from the SFCs. Leave `.vue` files untouched. The extractor reads only from `src/content/`.

- Pros: Fastest to ship. Zero risk of breaking the running site. No Vue refactor.
- Cons: Two sources of truth. Every future copy edit requires touching both files. The risk of drift between the live site and the markdown artifact is unbounded over time. Defeats a core purpose of the artifact (faithful mirror of site content).
- Verdict: Reject. Duplication is the exact failure mode the milestone should avoid.

**Option B — Refactor Vue SFCs to import content from TS** (RECOMMENDED)
Move hardcoded prose out of `.vue` templates into `src/content/*.ts`. SFCs `v-for` over imported arrays. Both runtime rendering and build-time extraction read the same source.

- Pros: Single source of truth. Aligns with the v3.0/v4.0 pattern already established for JSON data (content decoupled from code). Makes future CMS migration trivially easy. Extractor is a one-line import. The refactor is bounded: inspection of the pages shows prose concentrated in ~7 SFC files.
- Cons: Touches runtime Vue code — needs to pass existing 95 unit tests and visual regression. Modest additional scope vs option A.
- Scope audit (verified by inspection):
  - `HomePage.vue` — 1 intro heading, 1 intro paragraph, 1 "Featured Projects" heading, 1 "From the Field" heading + subtitle, 2 teaser quotes. Small.
  - `PhilosophyPage.vue` — 2 content sections (design-thinking ~4 paragraphs, moral-spine ~4 paragraphs + 1 blockquote), 1 closing line, 1 testimonial block of 2 quotes. Medium.
  - `HowIWorkSection.vue` — 3 methodology steps, each with heading + 2-3 paragraphs. Small.
  - `AiClaritySection.vue`, `Pattern158OriginSection.vue` — small (each <20 lines of prose).
  - `FaqPage.vue` — 1 testimonial block. Tiny.
  - `ContactPage.vue`, `AccessibilityPage.vue`, `TechnologiesPage.vue` — small intros.
  - Total: roughly 150-200 lines of prose to move. Mechanical refactor.
- Verdict: **Recommended primary path.**

**Option C — Parse Vue SFCs statically with `@vue/compiler-sfc`**
Run `parse()` on each SFC, walk the template AST, extract text nodes.

- Pros: Zero runtime Vue refactor. "Just works" on existing code.
- Cons:
  - Template AST walking for content extraction is genuinely complex: text is interleaved with component tags, directives, interpolations, slots, conditional blocks, scoped CSS class references. Producing clean markdown requires re-implementing a subset of Vue template semantics in the extractor.
  - Component content (`<HowIWorkSection />`) has no text at the page level — the extractor would need to recursively expand component trees to reach the prose, re-implementing component composition.
  - Brittle: any template structure change (rewording an `h2`, reordering paragraphs, adding a wrapping `<div>`) can silently break extraction or produce garbled output. The build would pass but the artifact would rot.
  - HTML entities (`&mdash;`, `&ldquo;`, `&rdquo;`, `&x2014;`) litter the existing templates and would need un-escaping.
  - Debugging markdown drift means debugging the AST walker — slow and specialized.
- Verdict: Reject. This is the clever option. The milestone wants clarity.

### Recommendation: Option B

Treat the SFC refactor as a prerequisite phase (not a separate milestone). This is the same pattern used in v3.0 when data was moved from TS to JSON — a one-time cost that pays dividends for every future content change.

**Mitigation for the "touches runtime code" risk:**

1. Do the refactor page-by-page, not all at once. Run the existing test suite after each page.
2. The refactor is purely structural — strings move from template literals to `.ts` exports, then SFC v-for renders them. Visual output is byte-identical if done correctly.
3. Add one Playwright browser-mode regression test per refactored page that asserts the key heading + first paragraph text appears in the rendered DOM. This guards against accidental omissions during the extraction.
4. HTML entities in the source (`&mdash;`, `&ldquo;`) should be converted to Unicode characters during the move. This is a small cleanup that also improves the markdown output automatically.

---

## 5. Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ SOURCES (existing)                                              │
│                                                                 │
│  src/data/json/*.json   src/data/*.ts    src/types/*.ts         │
│  (11 data files)        (thin loaders)   (type definitions)     │
│                                                                 │
│  src/content/*.ts       src/content/sections/*.ts               │
│  (NEW: page prose)      (NEW: section prose)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ SITE MAP (scripts/markdown-export/site-map.ts)                  │
│                                                                 │
│  const siteMap: PageSpec[] = [                                  │
│    { slug: 'home',         route: '/',          navOrder: 0,    │
│      extract: homeExtract, navPath: [] },                       │
│    { slug: 'philosophy',   route: '/philosophy', navOrder: 1,   │
│      extract: philosophyExtract, navPath: [] },                 │
│    ...                                                          │
│    { slug: 'case-files',   route: '/case-files', navOrder: 4,   │
│      extract: caseFilesExtract, navPath: [],                    │
│      children: exhibits.map(e => ({                             │
│        slug: e.slug,                                            │
│        route: e.exhibitLink,                                    │
│        extract: () => exhibitExtract(e),                        │
│        navPath: ['case-files']                                  │
│      }))                                                        │
│    },                                                           │
│  ]                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │  orchestrator walks tree
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ EXTRACTORS (scripts/markdown-export/content/*.ts)               │
│                                                                 │
│  Each extractor is pure: (inputs) → PageDoc                     │
│                                                                 │
│  homeExtract()          — reads home.ts + specialties +         │
│                           stats + influences + findings         │
│  philosophyExtract()    — reads philosophy.ts + sections/* +    │
│                           brandElements + philosophyInfluences  │
│  faqExtract()           — reads faq.ts, groups by category      │
│  caseFilesExtract()     — reads exhibits.ts, groups by type     │
│  exhibitExtract(e)      — reads one Exhibit, walks sections     │
│  ...                                                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │  returns PageDoc[]
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│ INTERMEDIATE REPRESENTATION                                     │
│                                                                 │
│  type DocNode =                                                 │
│    | { type: 'heading'; level: 1|2|3|4; text: string; id?: str} │
│    | { type: 'paragraph'; text: string }                        │
│    | { type: 'list'; ordered: boolean; items: string[] }        │
│    | { type: 'table'; headers: string[]; rows: string[][] }     │
│    | { type: 'blockquote'; text: string; cite?: string }        │
│    | { type: 'link'; text: string; href: string; internal:bool} │
│    | { type: 'image'; alt: string }    // rendered as caption   │
│    | { type: 'hr' }                                             │
│                                                                 │
│  interface PageDoc {                                            │
│    slug: string                                                 │
│    title: string                                                │
│    navPath: string[]       // ['case-files'] for exhibits       │
│    navOrder: number                                             │
│    tags: string[]          // for Obsidian frontmatter          │
│    date?: string                                                │
│    description?: string                                         │
│    body: DocNode[]                                              │
│    internalLinks: InternalLink[]   // collected during extract  │
│  }                                                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
┌─────────────────────┐  ┌──────────────────────┐
│ MONOLITHIC RENDERER │  │ OBSIDIAN RENDERER    │
│                     │  │                      │
│ - Walks siteMap in  │  │ - Walks siteMap;     │
│   nav order         │  │   each PageDoc       │
│ - For each PageDoc: │  │   becomes one file   │
│   shifts heading    │  │ - Adds YAML          │
│   levels by         │  │   frontmatter        │
│   navPath.length+1  │  │ - Converts internal  │
│ - Internal links    │  │   links to           │
│   become anchors    │  │   [[wikilinks]]      │
│   (#slug-heading-1) │  │ - Adds category tags │
│ - Emits TOC at top  │  │ - Respects navPath   │
│                     │  │   → folder hierarchy │
│ Uses shared         │  │                      │
│ primitives for      │  │ Uses shared          │
│ heading/list/table  │  │ primitives + extra   │
│                     │  │ wikilink helper      │
└─────────┬───────────┘  └──────────┬───────────┘
          │                         │
          │ string                  │ { path, content }[]
          ▼                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ FILE WRITER (scripts/markdown-export/writers/fs-writer.ts)      │
│                                                                 │
│  - Wipes docs/obsidian-vault/ (clean rebuild)                   │
│  - Writes docs/site-content.md                                  │
│  - Creates directories for Obsidian folder structure            │
│  - Writes each Obsidian file                                    │
│  - Logs summary (N pages, M bytes)                              │
└─────────────────────────────────────────────────────────────────┘
```

### Extraction contracts (examples)

```ts
// scripts/markdown-export/content/home.ts
import { homeContent } from '@/content/home'
import { specialties } from '@/data/specialties'
import { stats } from '@/data/stats'
import { findings } from '@/data/findings'
import type { PageDoc } from '../ir/page'

export function homeExtract(): PageDoc {
  return {
    slug: 'home',
    title: 'Pattern 158 — Dan Novak',
    navPath: [],
    navOrder: 0,
    tags: ['home'],
    body: [
      { type: 'heading', level: 1, text: homeContent.heroHeading },
      { type: 'paragraph', text: homeContent.heroSubhead },
      { type: 'heading', level: 2, text: homeContent.introHeading },
      ...homeContent.introParagraphs.map(p => ({ type: 'paragraph' as const, text: p })),
      { type: 'heading', level: 3, text: 'Specialties' },
      { type: 'list', ordered: false, items: specialties.map(s => `**${s.title}** — ${s.description}`) },
      // ... stats, findings, teaser quotes ...
    ],
    internalLinks: [{ text: 'View All Case Files', href: '/case-files' }],
  }
}
```

```ts
// scripts/markdown-export/content/exhibit.ts
import type { Exhibit } from '@/types'
import type { PageDoc } from '../ir/page'

export function exhibitExtract(exhibit: Exhibit): PageDoc {
  const slug = exhibit.exhibitLink.replace('/exhibits/', '')
  const body: DocNode[] = [
    { type: 'heading', level: 1, text: `${exhibit.label}: ${exhibit.title}` },
    { type: 'paragraph', text: `**Client:** ${exhibit.client}  |  **Date:** ${exhibit.date}` },
  ]
  if (exhibit.contextText) {
    body.push({ type: 'heading', level: 2, text: exhibit.contextHeading ?? 'Context' })
    body.push({ type: 'paragraph', text: exhibit.contextText })
  }
  if (exhibit.personnel?.length) {
    body.push({ type: 'heading', level: 2, text: 'Personnel' })
    body.push({
      type: 'table',
      headers: ['Name', 'Title', 'Organization'],
      rows: exhibit.personnel.map(p => [p.name ?? '', p.title ?? '', p.organization ?? '']),
    })
  }
  // ... technologies, findings, sections (text/table/flow/timeline/metadata), quotes ...
  return {
    slug: `exhibits/${slug}`,
    title: `${exhibit.label}: ${exhibit.title}`,
    navPath: ['case-files', 'exhibits'],
    navOrder: 0,
    tags: ['exhibit', exhibit.exhibitType, ...exhibit.impactTags],
    date: exhibit.date,
    description: exhibit.summary ?? exhibit.contextText,
    body,
    internalLinks: [],
  }
}
```

---

## 6. Two-Renderer Strategy

### Shared layer

Both renderers consume the same `PageDoc[]` and the same markdown primitives:

```ts
// scripts/markdown-export/markdown/primitives.ts
export const heading = (level: 1|2|3|4|5|6, text: string) =>
  `${'#'.repeat(level)} ${text}\n`

export const paragraph = (text: string) =>
  `${text}\n`

export const list = (items: string[], ordered = false) =>
  items.map((item, i) => `${ordered ? `${i+1}.` : '-'} ${item}`).join('\n') + '\n'

export const table = (headers: string[], rows: string[][]) => {
  const head = `| ${headers.join(' | ')} |`
  const sep  = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map(r => `| ${r.join(' | ')} |`).join('\n')
  return `${head}\n${sep}\n${body}\n`
}

export const blockquote = (text: string, cite?: string) => {
  const lines = text.split('\n').map(l => `> ${l}`).join('\n')
  return cite ? `${lines}\n> — ${cite}\n` : `${lines}\n`
}

export const link = (text: string, href: string) => `[${text}](${href})`
export const wikilink = (text: string, target?: string) =>
  target ? `[[${target}|${text}]]` : `[[${text}]]`
```

Both renderers share a `renderNode(node: DocNode): string` function that dispatches on `node.type` and calls the right primitive.

### Divergences

| Aspect | Monolithic | Obsidian |
|--------|-----------|----------|
| Output shape | One string | Array of `{path, content}` |
| Heading levels | Shifted by nav depth: top-level pages get `#`, children get `##`, grandchildren get `###`. `PageDoc` heading of level N renders as `#`.repeat(depth + N). | Kept as declared in `PageDoc`. H1 = page title. |
| Internal links | Markdown anchor links: `[text](#case-files-exhibit-a)`. Anchor slugs are generated from the shifted heading. | Obsidian wikilinks: `[[case-files/exhibits/exhibit-a\|text]]`. Path matches folder layout. |
| Page breaks | `\n\n---\n\n` between top-level pages, no separator for children | N/A — files are separate |
| Frontmatter | None (raw markdown) | YAML block with `title`, `tags`, `date?`, `description?`, `aliases?` |
| TOC | Auto-generated at top of monolithic file from `PageDoc[]` walk | None (Obsidian has built-in outline) |
| Image handling | `*Alt text caption*` italic caption | Same |
| Tag rendering | N/A (tags are metadata only) | Inline `#tag` at top of body + in frontmatter |
| Title derivation | First `heading` DocNode is used as-is; the page title in siteMap is the monolithic section marker | `PageDoc.title` becomes frontmatter `title`, body H1 is also `PageDoc.title` |

### Renderer signature

```ts
// scripts/markdown-export/renderers/monolithic.ts
export function renderMonolithic(pages: PageDoc[], siteMap: PageSpec[]): string

// scripts/markdown-export/renderers/obsidian.ts
export interface ObsidianFile { path: string; content: string }
export function renderObsidian(pages: PageDoc[], siteMap: PageSpec[]): ObsidianFile[]
```

Both take the full page set so they can resolve cross-page links.

### Divergence that stays in renderers only

- Level shifting (monolithic concern)
- Frontmatter (obsidian concern)
- Link format (both have their own strategy)
- File naming (obsidian concern)

Everything else — `DocNode` → markdown string — is shared primitives. If a third renderer (e.g., "flat concatenation" or "per-page monolithic") were added later, it would only need to plug in three helpers: link format, heading level transform, page separator.

---

## 7. Build Order Recommendation

Phases are ordered to respect the dependency graph: content sources → IR → primitives → renderers → orchestration → integration → tests → docs. Each phase should ship green tests before the next begins.

**Phase 1 — Content source extraction (SFC refactor)**
Move hardcoded prose from `.vue` templates into `src/content/*.ts`. Do it page by page, running tests after each:
1. Create `src/content/meta.ts` with per-page titles/descriptions/nav order.
2. `HomePage.vue` → `src/content/home.ts`.
3. `PhilosophyPage.vue` + `HowIWorkSection.vue` + `AiClaritySection.vue` + `Pattern158OriginSection.vue` → `src/content/philosophy.ts` + `src/content/sections/*.ts`.
4. `ContactPage.vue`, `AccessibilityPage.vue`, `TechnologiesPage.vue`, `FaqPage.vue` → `src/content/*.ts`.
5. Add one browser test per refactored page asserting first heading + first paragraph text.
Gate: all 95+ existing tests green, new browser assertions green, `npm run build` succeeds, manual visual diff of each page.

**Phase 2 — IR and shared primitives**
No runtime code changes in this phase.
1. Create `scripts/markdown-export/` scaffold.
2. Define `ir/nodes.ts` and `ir/page.ts` types.
3. Implement `markdown/primitives.ts` with unit tests for every primitive.
4. Implement `markdown/escape.ts` (entity unescaping + markdown escaping) with unit tests.
5. Implement `markdown/frontmatter.ts` with unit tests.
6. Add `tsconfig.scripts.json`, add `tsx` dep, add `build:markdown` script (pointing at a stub that prints "hello").
Gate: primitives unit tests green; `npm run build:markdown` runs without error.

**Phase 3 — Extractors (non-exhibit pages)**
1. Define `site-map.ts` with the 7 static routes.
2. Implement one extractor per page: `home.ts`, `philosophy.ts`, `technologies.ts`, `case-files.ts` (index only, not children), `faq.ts`, `contact.ts`, `accessibility.ts`.
3. Write unit tests that assert each extractor returns a `PageDoc` with expected top-level structure (heading count, title, nav path).
Gate: every extractor returns a valid `PageDoc`.

**Phase 4 — Exhibit extractor**
1. Implement `exhibit.ts` extractor handling all `ExhibitSection` types (text, table, flow, timeline, metadata) and first-class arrays (personnel, technologies, findings).
2. Add children to `site-map.ts` by mapping `exhibits` array.
3. Unit tests: feed a fixture exhibit through extractor, assert structure. Test all section types, both exhibit types, edge cases (missing findings, custom findingsHeading, group/anonymized personnel, entity unescaping).
Gate: all 15 exhibits extract without errors, snapshot locked for one representative exhibit.

**Phase 5 — Monolithic renderer**
1. Implement `renderers/monolithic.ts` with heading-level shifting and anchor-based internal link resolution.
2. Snapshot test: full pipeline → `site-content.md` → committed snapshot. Any accidental change fails the test loudly.
3. Integration test: parse the generated markdown back with a markdown parser (e.g., `marked` or `remark`) and assert heading hierarchy is well-formed (no H3 without an H2 parent, etc.).
Gate: `site-content.md` snapshot committed, looks correct by manual review.

**Phase 6 — Obsidian renderer**
1. Implement `renderers/obsidian.ts` with frontmatter, wikilinks, folder hierarchy.
2. Snapshot test for the full `docs/obsidian-vault/` tree (hash of sorted file list + content hashes).
3. Integration test: load vault in a throwaway Obsidian-compatible parser or just verify YAML frontmatter parses cleanly and all wikilink targets exist as files.
Gate: vault snapshot committed, opens cleanly in Obsidian (manual verification — human smoke test).

**Phase 7 — File writer + orchestrator**
1. Implement `writers/fs-writer.ts` with clean wipe of `docs/obsidian-vault/` and idempotent writes.
2. Wire orchestrator `index.ts`: load site-map → run all extractors → render both artifacts → write to disk.
3. End-to-end test: `npm run build:markdown` in isolated temp dir, verify files exist and sizes are in expected ranges.
Gate: `npm run build:markdown` produces both artifacts cleanly in `docs/`.

**Phase 8 — Build integration**
1. Modify `package.json` `build` script to chain markdown export after `vite build`.
2. Verify `npm run build` passes.
3. Verify `docs/` changes land in git status after build.
4. Update `.gitignore` to confirm `docs/` is tracked.
Gate: full `npm run build` green, artifacts checked into version control.

**Phase 9 — Documentation + polish**
1. Add `scripts/markdown-export/README.md` explaining architecture and how to add a new page.
2. Update `PROJECT.md` with v7.0 completion notes and key decisions.
3. Run one final full audit: open every generated exhibit page in Obsidian, compare against live site side-by-side.
Gate: milestone complete.

---

## 8. Testing Strategy

### Unit tests (scripts/markdown-export/__tests__/)

- `primitives.test.ts` — One test per primitive. Heading escaping, list ordering, table alignment, blockquote multi-line, link escaping, wikilink with and without alias. Fast, stateless, 20-30 tests.
- `escape.test.ts` — `&mdash;` → `—`, `&ldquo;` → `"`, `*` in prose → `\*`, leave code blocks alone.
- `frontmatter.test.ts` — YAML escaping, array tags, date format, optional fields.
- `ir.test.ts` — Type guards for `DocNode` discriminated union (smoke test TypeScript is catching malformed nodes).

### Extractor unit tests

One test file per extractor. Each asserts:
- Returned `PageDoc.title` matches meta.
- `body` contains at least one heading of the expected level.
- Body length is within expected range (± tolerance).
- Internal links match expected routes.

For `exhibit.ts`, parametrize over all 15 exhibits and run smoke assertions (extract succeeds, body is non-empty, tables have matching column counts). Then do a deep structural snapshot for one representative `investigation-report` and one `engineering-brief`.

### Renderer snapshot tests

This is the heart of the test suite.

- `monolithic.snapshot.test.ts` — Run full pipeline, compare against committed `site-content.md` snapshot. Any diff fails. Rebaseline deliberately with `--update-snapshots`.
- `obsidian.snapshot.test.ts` — Run full pipeline, produce a normalized manifest of the vault (sorted file paths + SHA-256 of each content), compare against committed snapshot.

Rationale for snapshots: the purpose of the artifact is textual fidelity. Snapshot testing is the only way to catch accidental drift from a seemingly-innocuous code change elsewhere (e.g., someone adds an `&ldquo;` to the FAQ JSON). The diff is human-readable and rebaselining is a one-liner.

### Integration tests

- `full-export.test.ts` — Run `index.ts` programmatically in a temp dir, assert both artifacts exist with non-trivial size, assert no extra files, assert `docs/obsidian-vault/` has the expected folder structure.
- `markdown-validity.test.ts` — Parse the generated monolithic file with `remark-parse`, assert no parse errors, walk the AST and verify heading hierarchy is monotonic (no jumps from H1 to H3).
- `wikilink-integrity.test.ts` — For every wikilink in the vault, assert the target file exists.

### Regression tests (runtime site)

From Phase 1 (SFC refactor):
- One Playwright browser test per refactored page asserting the first heading and first paragraph text are visible. Guards against accidental content omission during the move from template to `.ts`.

### CI gate

`npm test` should run unit + snapshots + integration tests. A failing snapshot blocks PR merge until either content was intentionally changed (rebaseline) or unintentionally (fix the bug).

---

## 9. Open Questions

These are genuine unknowns that phase planning should flag for clarification or research, not gaps in this architecture doc:

1. **Link resolution in the monolithic artifact:** When `HomePage` links to `/case-files`, the monolithic renderer needs to convert that to an anchor. What anchor format? GitHub-flavored slugs (`#case-files`)? Auto-generated from the heading? If two headings collide ("Findings" appears in many exhibits), how are collisions resolved? Recommendation: prefix anchors with the nav path (`#case-files-exhibit-a-findings`).

2. **Obsidian filename collisions:** Obsidian uses filenames as wikilink targets. Two exhibits with the same title would collide. Current exhibits use unique labels (`Exhibit A`, `Exhibit B`) so this is probably safe, but the renderer should assert uniqueness and fail loudly if collisions appear.

3. **Date metadata for non-exhibit pages:** Exhibits have dates. Static pages (Home, Philosophy) don't. Should the Obsidian frontmatter `date` be omitted, set to the git commit date, or set to the build date? Recommendation: omit for static pages, preserve exhibit dates as-is.

4. **Do the two testimonial blocks on Philosophy and FAQ pages belong in the export?** They are decorative recurrences of testimonials that probably live in a future `testimonials.json`. For v7.0, recommend: yes, export them as-is. If they become duplicates of a future testimonials page, dedupe at that milestone.

5. **Storybook stories** — should they also be exported? Recommendation: no. Stories are developer documentation, not site content. Out of scope.

6. **The `/review` and `/diag/personnel` routes** — these are internal/diagnostic pages. Recommendation: exclude from `site-map.ts` entirely. Document the exclusion in the site-map file.

7. **Image handling:** milestone spec says "images skipped, alt text preserved as italicized captions". Where does alt text come from? The site uses very few images in prose (mostly decorative). Need to audit actual image usage during Phase 1 content extraction to determine whether this even applies in practice. Recommendation: implement the caption fallback but expect most pages to emit zero image nodes.

8. **Build performance:** Running the markdown export as part of `npm run build` adds time. For 22 pages (7 static + 15 exhibits) with pure in-memory extraction + string concatenation, expected cost is <500ms — negligible. If it grows, consider gating behind a flag.

9. **Does `tsx` play well with the existing tsconfig paths (`@/data/*`)?** It should — `tsx` honors `tsconfig.json` paths natively — but worth verifying in Phase 2. Fallback is `vite-node scripts/markdown-export/index.ts` which inherits Vite's resolver.

---

## Sources

- Direct inspection of `/home/xhiris/projects/pattern158-vue/src/` (pages, components, data, types, router)
- `/home/xhiris/projects/pattern158-vue/.planning/PROJECT.md` — milestone scope and current state
- `/home/xhiris/projects/pattern158-vue/package.json` — existing build scripts and dependencies
- [Vite Guide — Getting Started](https://vite.dev/guide/) — project structure conventions (`src/` for runtime, tooling outside)
- [Vite Guide — Building for Production](https://vite.dev/guide/build) — build hook conventions
- Established v3.0 pattern in this codebase: JSON externalization via thin TS loaders — the same decoupling pattern is recommended for prose in v7.0
