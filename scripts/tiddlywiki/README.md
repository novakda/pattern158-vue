# scripts/tiddlywiki/

Generator toolchain for the Pattern 158 TiddlyWiki (v9.0). Reads the captured
`static-site/*.html` corpus + `src/data/json/{exhibits,faq}.json`, runs a pure
DOM-extractor → atomic-generator → compose → serialize pipeline, and writes
`.tid` files under `/tiddlywiki/tiddlers/`. TiddlyWiki's CLI then builds a
single-file HTML wiki from those tiddlers.

See also:
- [`/tiddlywiki/README.md`](../../tiddlywiki/README.md) — tzk-style workflow,
  public/private tag semantics, build-target reference, deploy instructions.
- [`/tiddlywiki/CONTRIBUTING.md`](../../tiddlywiki/CONTRIBUTING.md) — editing
  guide: direct-edit vs regenerate, merge-conflict resolution, when to
  re-capture.

## Overview

The pipeline has four layers and one orchestrator:

1. **Extractors** (`extractors/*.ts`) — 8 pure parsers. Each reads a slice of
   captured HTML via `happy-dom` and returns typed immutable entities
   (`FaqItem`, `Exhibit`, `PersonnelEntry`, `FindingEntry`, `TechnologyEntry`,
   `Testimonial`, `PageContent`, `CaseFilesIndex`). No I/O — strings in,
   structured objects out. Defined in `extractors/types.ts`.

2. **Bundle assembly** (`extract-all.ts`) — walks the known `static-site/`
   paths, runs each extractor in sequence (SCAF-08: `for-of`, no
   `Promise.all`), and returns an `ExtractedBundle` aggregating every entity
   collection. Falls back to `src/data/json/faq.json` when the FAQ HTML is
   missing.

3. **Atomic generators** (`generators/*.ts`) — 6 pure emitters (Phase 54
   LOCKED). Each takes an entity collection and produces `Tiddler[]`:
   `emitPersonTiddlers`, `emitFindingTiddlers`, `emitTechnologyTiddlers`,
   `emitTestimonialTiddlers`, `buildExhibitCrossLinks` (producer half for the
   exhibit footer), plus `verifyCrossLinkIntegrity` (audit consumer).
   Generator types re-exported via `generators/types.ts`; shared pure string
   helpers in `generators/helpers.ts`.

4. **Composite generators** (`sources.ts`, `page-content-to-tiddlers.ts`) —
   emit multi-field tiddlers (exhibits, case-files index, FAQ index + items,
   page tiddlers, site-meta tiddlers). Older iter-1 helper
   `html-to-wikitext.ts` remains for the legacy `pageSpecsToTiddlers` path
   but is no longer on the active generation route.

5. **Orchestrator** (`generate.ts`) — `composeAllTiddlers({bundle,
   exhibitsJson, faqItemsJson})` is the single source of truth for tiddler
   assembly order. Applies `withPublicTag` (TZK-01) to every emitted tiddler.
   `main()` drives I/O: reads JSON, calls `extractAll`, composes, writes
   `.tid` files + `pattern158-tiddlers.json` + `tiddlywiki.info` via
   `tid-writer.ts`.

## Architecture

```
          static-site/*.html                 src/data/json/*.json
                   │                                   │
                   ▼                                   │
         extractors/*.ts                               │
         (8 pure DOM parsers)                          │
                   │                                   │
                   ▼                                   │
         extract-all.ts ─── ExtractedBundle            │
           { faqItems, exhibits,                       │
             personnelByExhibit, ... }                 │
                   │                                   │
                   ▼                                   ▼
         generators/*.ts  +  sources.ts  +  page-content-to-tiddlers.ts
         (atomic + composite emitters)
                   │
                   ▼
         generate.ts :: composeAllTiddlers
           ── withPublicTag on every tiddler ──►  Tiddler[]  (~367 tiddlers)
                   │
                   ▼
         tid-writer.ts ─────► tiddlywiki/tiddlers/*.tid
                        └──► tiddlywiki/pattern158-tiddlers.json
                        └──► tiddlywiki/tiddlywiki.info
                   │
                   ▼
         tiddlywiki CLI (pnpm tiddlywiki:build-{public,all})
                   │
                   ▼
         tiddlywiki/output/index.html   (publishFilter +[!tag[private]])
         tiddlywiki/output/all.html     (no filter)
```

Hand-authored theme tiddlers (`$__plugins_pattern158_*`) also live under
`/tiddlywiki/tiddlers/`. The generator never deletes tiddlers it did not
author — it only writes the titles in its composed list — so theme and
manually-edited tiddlers round-trip across regenerates untouched.

## Module index

### Extractors — `extractors/`

| Module                  | Role                                                                | Key exports                                                                                                           |
| ----------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `types.ts`              | Shared entity contracts + `parseHtml` helper + `ExtractorError`     | `FaqItem`, `Exhibit`, `ExhibitSection`, `PersonnelEntry`, `FindingEntry`, `TechnologyEntry`, `Testimonial`, `PageContent`, `CaseFilesIndex`, `parseHtml`, `ExtractorError` |
| `faq.ts`                | FAQ (EXTR-01) — HTML primary, JSON fallback                         | `emitFaqItems(html)`, `emitFaqItemsFromJson(json)`                                                                    |
| `exhibit.ts`            | Exhibit (EXTR-02) — context + sections + subsections + impact tags  | `emitExhibit(html)`                                                                                                   |
| `personnel.ts`          | Personnel (EXTR-03) — individual / group / anonymized entries       | `emitPersonnel(html, { sourceExhibitLabel })`                                                                         |
| `findings.ts`           | Findings (EXTR-04) — per-exhibit finding rows with severity/category | `emitFindings(html, { sourceExhibitLabel })`                                                                          |
| `technologies.ts`       | Technologies (EXTR-05) — per-exhibit tech rows with context blurbs  | `emitTechnologies(html, { sourceExhibitLabel })`                                                                      |
| `testimonials.ts`       | Testimonials (EXTR-06) — quote + attribution + role                 | `emitTestimonials(html, { sourcePageLabel })`                                                                         |
| `pages.ts`              | Pages (EXTR-07) — heading-anchored `PageContent`                    | `emitPageContent(html)`                                                                                               |
| `case-files-index.ts`   | Case Files index (EXTR-08) — summary rows for every exhibit         | `emitCaseFilesIndex(html)`                                                                                            |

### Generators — `generators/`

| Module                     | Role                                                                                          | Key exports                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `types.ts`                 | Import surface — re-exports `Tiddler` + extractor entity types                                | type re-exports only                                               |
| `helpers.ts`               | Pure string helpers used by every atomic generator                                            | `truncateAtWordBoundary`, `formatExhibitTitle`, `wikiLink`         |
| `person.ts`                | ATOM-01 person tiddler emitter — dedupe by identity, aggregate exhibit back-refs              | `emitPersonTiddlers(entries, { client })`                          |
| `finding.ts`               | ATOM-02 finding tiddler emitter — one tiddler per entry, tagged with severity + category      | `emitFindingTiddlers(entries)`                                     |
| `technology.ts`            | ATOM-03 technology tiddler emitter — case-insensitive dedupe, grouped exhibit contexts        | `emitTechnologyTiddlers(entries)`                                  |
| `testimonial.ts`           | ATOM-04 testimonial tiddler emitter — one tiddler per quote                                   | `emitTestimonialTiddlers(entries)`                                 |
| `exhibit-cross-links.ts`   | ATOM-05 producer — per-exhibit `[[...]]` link arrays for the four cross-link footer sections  | `buildExhibitCrossLinks(exhibit, entities)`, `CrossLinkBundle`     |
| `integrity-check.ts`       | ATOM-06 consumer — scans all tiddler bodies for orphan `[[target]]` links                     | `verifyCrossLinkIntegrity(tiddlers)`                               |

### Orchestration + I/O

| Module                          | Role                                                                                                       | Key exports                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `extract-all.ts`                | Bundle assembly — walks `static-site/`, runs 8 extractors, returns `ExtractedBundle`                       | `extractAll(projectRoot)`, `normalizeExhibitLabel(raw)`, `ExtractedBundle`, `ExtractedPage`                 |
| `page-content-to-tiddlers.ts`   | FIX-02 page generator — heading-anchored wikitext bodies from `ExtractedPage[]`                            | `pageContentToTiddlers(pages)`                                                                              |
| `sources.ts`                    | Composite generators — exhibit, case-files index, FAQ index/items, legacy `pageSpecsToTiddlers`, site-meta | `exhibitsToTiddlers`, `caseFilesIndexTiddler`, `faqItemsToTiddlers`, `faqIndexTiddler`, `siteMetaTiddlers`, `defaultLinkMap`, `ExhibitJson`, `FaqJsonItem` |
| `generate.ts`                   | Orchestrator — composes full tiddler list + applies `withPublicTag` + writes to disk                       | `composeAllTiddlers(input)`, `withPublicTag(tiddler)`, `ComposeInput`                                       |
| `tid-writer.ts`                 | `.tid` file serializer + JSON byproduct + `tiddlywiki.info` manifest                                       | `Tiddler`, `tiddlerToTidFile`, `writeTiddlerFile`, `tiddlersToJson`, `writeTiddlywikiInfo`                  |
| `verify-integrity.ts`           | Smoke-gate CLI — runs pipeline in memory, fails non-zero on any orphan link                                | (CLI entry; no exports)                                                                                     |
| `html-to-wikitext.ts`           | Legacy iter-1 HTML → wikitext converter — still used by `pageSpecsToTiddlers` but off the active route     | `htmlToWikitext(html, linkMap)`                                                                             |

## Tiddler types

Every generator-emitted tiddler passes through `withPublicTag` before being
written, so unless a tiddler already carries `public` or `private`, the
`public` tag is prepended. The `tags` column below shows the tags applied
*before* that transform.

| Tiddler type                       | Title convention                                                                                    | Tags                                                         | Emitted by                                           |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| **page**                           | `Home`, `Philosophy`, `Technologies`, `Contact`, `Accessibility`                                    | `page`                                                       | `pageContentToTiddlers`                              |
| **case-files-index**               | `Case Files Index`                                                                                  | `page`, `case-files`                                         | `caseFilesIndexTiddler`                              |
| **exhibit**                        | `Exhibit A`, `Exhibit B`, … (short-letter form)                                                     | `exhibit`, `<exhibitType>`, `<client>`                       | `exhibitsToTiddlers`                                 |
| **exhibit-finding** (atomic)       | `<label> Finding: <truncated-statement>` — e.g. `A Finding: Bulk SCORM import not available`       | `finding`, `severity-<slug>`, `category-<slug>`, `[[Exhibit <label>]]` | `emitFindingTiddlers`                         |
| **exhibit-personnel** (atomic)     | `<name>` for individuals; `<role> @ <organization>` for group/anonymized                            | `person`, `[[<client>]]`, `entry-type-<individual\|group\|anonymized>` | `emitPersonTiddlers`                          |
| **technology**                     | `Tech: <display-name>`                                                                              | `technology`                                                 | `emitTechnologyTiddlers`                             |
| **testimonial**                    | `Testimonial: <truncated-attribution>` or `Testimonial: (anonymous)`                                | `testimonial`, `[[<sourcePageLabel>]]` (omitted if empty)    | `emitTestimonialTiddlers`                            |
| **faq-index**                      | `FAQ Index`                                                                                         | `page`, `faq`                                                | `faqIndexTiddler`                                    |
| **faq-item**                       | `<question-text>` (verbatim)                                                                        | `faq`, `<category-slug>` (one per category)                  | `faqItemsToTiddlers`                                 |
| **site-meta**                      | `$:/SiteTitle`, `$:/SiteSubtitle`, `$:/DefaultTiddlers`                                             | (none before `withPublicTag`)                                | `siteMetaTiddlers`                                   |
| **theme** (hand-authored)          | `$:/plugins/pattern158/styles`, `$:/plugins/pattern158/palette/*`, `$:/plugins/pattern158/view/*`  | `$:/tags/Stylesheet`, `$:/tags/ViewTemplate`, `$:/tags/Palette`, etc. | N/A — manually committed under `tiddlywiki/tiddlers/` |

**Cross-link invariants** (enforced by `verify-integrity.ts`):
- Every `[[Exhibit X]]` emitted by atomic generators resolves because
  `exhibitsToTiddlers` emits a tiddler with exactly that title.
- Every `[[<person-title>]]` / `[[<finding-title>]]` /
  `[[Tech: <name>]]` / `[[Testimonial: <attribution>]]` referenced from an
  exhibit footer resolves because the atomic generators emit those
  tiddlers with the same formatter in `generators/helpers.ts` and
  `exhibit-cross-links.ts`.

## Commands

All commands are pnpm scripts defined in the repo root `package.json`. Run
from project root (the CWD semantics matter — the TiddlyWiki CLI resolves
relative paths against the CWD).

| Command                                                      | What it does                                                                                                              | Exit code | Typical duration |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------- |
| `pnpm tiddlywiki:generate`                                   | Runs `scripts/tiddlywiki/generate.ts` via `tsx`. Reads corpus, composes ~367 tiddlers, writes `.tid` + JSON + `.info`.    | `0` on success, `1` on any thrown error | 1–3s             |
| `pnpm tiddlywiki:build-public`                               | `tiddlywiki tiddlywiki --build public-index` → `tiddlywiki/output/index.html` with `publishFilter=+[!tag[private]]`.      | `0` on success                          | 2–4s             |
| `pnpm tiddlywiki:build-all`                                  | `tiddlywiki tiddlywiki --build all-index` → `tiddlywiki/output/all.html` with no filter.                                  | `0` on success                          | 2–4s             |
| `pnpm tiddlywiki`                                            | Convenience combo: `tiddlywiki:generate` then `tiddlywiki:build-public`.                                                  | `0` on success                          | 4–7s             |
| `pnpm tsx scripts/tiddlywiki/verify-integrity.ts`            | Runs the pipeline in memory (no disk writes). Fails non-zero listing every orphan `[[target]]` link and its source tiddler. | `0` if clean, `1` if any orphan        | 1–2s             |
| `pnpm test:scripts`                                          | Vitest run of the `scripts` project — extractor units + generator units + composition tests + integrity test + e2e.      | `0` on all tests passing                | ~1s              |

## Troubleshooting

### Orphan wikitext links

A `[[Target Tiddler]]` link in an emitted body that doesn't match any
composed tiddler title. TiddlyWiki will render it as a clickable stub
that creates a new empty tiddler when clicked — bad UX.

1. Run `pnpm tsx scripts/tiddlywiki/verify-integrity.ts`. It prints every
   orphan as `[55-07] ORPHAN: tiddler "<source>" links to missing "<link>"`.
2. Fix **upstream**: the orphan is almost always a mismatch between the
   emitter formula in `generators/helpers.ts` /
   `generators/exhibit-cross-links.ts` / `sources.ts` and the title formula
   in the atomic generator. Find both sites, confirm they use the same
   `formatExhibitTitle` / `personnelTitle` / `findingTitle` /
   `testimonialTitle` helper, and reconcile.
3. Re-run `pnpm tiddlywiki:generate` then `verify-integrity.ts`. Gate
   should pass.

### Stale output

The `tiddlywiki/output/*.html` build artifacts don't reflect recent
source-data changes.

- Ensure you ran `pnpm tiddlywiki:generate` *before*
  `tiddlywiki:build-{public,all}`. The build targets read from
  `tiddlywiki/tiddlers/` and `tiddlywiki/tiddlywiki.info`, both of which
  are written by the generator.
- Use `pnpm tiddlywiki` to combine generate + build-public in one shot.
- Remember: `output/` is gitignored (see repo-root `.gitignore`). Its
  contents are ephemeral — regenerate whenever they're missing.

### Build failures from `tsconfig.scripts.json`

`pnpm build` fails with TS6307 ("not listed within the file list") or
TS2345 on happy-dom types.

- Every `.ts` file under `scripts/tiddlywiki/` must be visible to
  `tsconfig.scripts.json`. The config's `include` globs
  `scripts/tiddlywiki/**/*.ts`; its `exclude` is empty (Phase 58 cleared
  it). If you add a new module, it's picked up automatically.
- If you see a DOM-type mismatch (happy-dom vs standard DOM), mirror the
  `extractors/types.ts:parseHtml` pattern — `as unknown as Document` at
  the producer boundary.

### Regenerating clobbers theme / manually-edited tiddlers

It doesn't. `scripts/tiddlywiki/generate.ts` only calls
`writeTiddlerFile` for the tiddlers in its composed list. Any `.tid`
file under `/tiddlywiki/tiddlers/` whose title is not in that list —
theme plugins (`$:/plugins/pattern158/*`), hand-authored drafts,
`$:/StoryList` — is untouched by the regenerate.

Exception: if you manually edit a tiddler whose title *is* in the
composed list (e.g. `Home.tid`, `Exhibit A.tid`, an FAQ item), the
next `pnpm tiddlywiki:generate` overwrites your edits with the
freshly-composed body. Edit upstream (the static-site HTML) instead —
see [`/tiddlywiki/CONTRIBUTING.md`](../../tiddlywiki/CONTRIBUTING.md).

### Double-prefixed exhibit titles (`Exhibit Exhibit A`)

Historical class of orphan from Phase 55. Fixed by
`extract-all.ts:normalizeExhibitLabel`, which strips a leading
`Exhibit ` from every extracted label before passing through the
pipeline. If you see this reappear, check that a new extractor is
normalizing its label via `normalizeExhibitLabel` before propagating
it to downstream generators.

## SCAF-08 discipline

Every module in this directory follows the SCAF-08 determinism policy:

- No wall-clock reads (`Date.now()`, `new Date()`, `setTimeout`,
  `setInterval`).
- No randomness (`Math.random`, `crypto.random*`).
- No parallel iteration (`Promise.all`, `Promise.allSettled`,
  `Promise.race` over fan-outs). Use sequential `for-of` — see
  `extract-all.ts:extractAll` for the canonical pattern.
- Deterministic output on identical inputs: byte-identical `.tid` files
  across runs. Non-empty `git diff tiddlywiki/tiddlers/` always
  represents a real upstream data change.
- All timestamps use the shared `TIMESTAMP = '20260421000000000'`
  constant (`sources.ts`, `page-content-to-tiddlers.ts`). Do not
  introduce new timestamps by reading the clock.

Phase 54 atomic generators (`generators/person.ts`,
`generators/finding.ts`, `generators/technology.ts`,
`generators/testimonial.ts`, `generators/exhibit-cross-links.ts`) are
LOCKED — bug fixes require a new plan; transformations happen at the
composition boundary (`generate.ts:composeAllTiddlers` /
`withPublicTag`).
