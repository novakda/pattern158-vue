# Phase 53: DOM Extraction - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Eight extractor modules under `scripts/tiddlywiki/extractors/` parse the captured HTML pages under `static-site/*.html` (emitted by v8.0 `writeStaticSite`) into typed domain entities via pure `emit()` functions, each paired with inline-HTML fixture tests in the `scripts` Vitest project. This phase delivers **extractor modules + fixture tests only** — wiring the extractor layer into `scripts/tiddlywiki/generate.ts` is deferred to Phase 55 (FIX-02).

Out of scope for Phase 53:
- Refactoring `generate.ts` to consume extractor output (Phase 55 FIX-02).
- Atomic tiddler generation / cross-link integrity graph (Phase 54 ATOM-01..05).
- Live-fixture integration test against real `static-site/*.html` (Phase 56 TEST-03).

</domain>

<decisions>
## Implementation Decisions

### Extractor Contract & Parser
- DOM parser: **happy-dom** (already a devDep; Phase 49 locked pick; convert.ts + static-html.ts both use it).
- Extractor input shape: **`emit(html: string, opts?): EntityData[]`** — each extractor owns its own `new Window()`; pure function; no shared parser state.
- Extractor output shape: pure typed arrays (or single entity for `Exhibit` / `CaseFilesIndex`). Throw **`ExtractorError`** on structural failure. No `Result<T, E>` wrapper; no partial-emit + warning bag.
- Source-exhibit back-reference (EXTR-03 / EXTR-04 / EXTR-05): **caller-supplied** via `emit(html, { sourceExhibitLabel })` arg — keeps extractor pure, label stays at the caller boundary.

### Fallback Strategy & Integration Scope
- JSON fallback scope: **FAQ only (EXTR-01)** — only extractor whose REQ mentions fallback. Others throw `ExtractorError` on missing / malformed input.
- Fallback trigger: **file-existence** — if `static-site/faq.html` absent, fall back to `src/data/json/faq.json`. Emit one-line stderr warning: `[tiddlywiki:extract] faq.html absent — using JSON fallback`.
- `generate.ts` wiring: **deferred to Phase 55 (FIX-02)** — Phase 53 ships extractor modules + tests only; no changes to `scripts/tiddlywiki/generate.ts`, `sources.ts`, or `html-to-wikitext.ts`.
- Idempotency: per-extractor idempotency assertion inside each `*.test.ts` (same HTML → byte-identical `JSON.stringify` output across two runs); no separate cross-module idempotency suite.

### Types Organization & Test Fixture Pattern
- Entity types: **one shared `scripts/tiddlywiki/extractors/types.ts`** exporting `FaqItem`, `Exhibit`, `ExhibitSection`, `PersonnelEntry`, `FindingEntry`, `TechnologyEntry`, `Testimonial`, `PageContent`, `CaseFilesIndex`, and `ExtractorError` class. Mirrors the `scripts/editorial/types.ts` pattern.
- Fixture pattern: **inline HTML template literals** in each `*.test.ts` file — hermetic, no fs I/O, matches Phase 48/49 convention (CONTEXT locked in prior phases).
- Minimum coverage: **3 scenarios per extractor** — happy path + missing-field edge + malformed-DOM guard → 8 × 3 = **24 `it` cases minimum**.
- All tests run under `pnpm test:scripts` (existing Vitest `scripts` project — no new project).

### Claude's Discretion
- Precise DOM selectors for each extractor are at Claude's discretion during planning — should mirror Vue SFC class hooks (`.faq-accordion-item`, `.exhibit-detail-title`, `.personnel-card`, `.finding-card`, etc.) verified against `static-site/*.html` during plan-phase research.
- Within-extractor helper decomposition (one top-level function vs several sub-helpers) at Claude's discretion.
- JSDoc comment style follows Phase 48 Plan 06 discipline: prose must not name SCAF-08-forbidden tokens; avoid the `*/` end-marker hazard inside glob literals.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `happy-dom` `Window` parser — imported and used in `scripts/editorial/convert.ts:sanitizeHtml` and `scripts/editorial/static-html.ts:sanitizeForHtml`. Same pattern transfers to extractors.
- `scripts/editorial/types.ts` — precedent for a shared types module under a script subtree (24 lines, type re-exports only).
- `scripts/tiddlywiki/sources.ts` already contains TypeScript types for `ExhibitJson`, `FaqJsonItem`, `ExhibitSection`, `PageSpec`, etc. — reuse the field names (not the interfaces themselves; extractor output types are distinct from JSON-source types).
- `static-site/*.html` directory is the upstream input — 8 top-level pages already present (`index.html`, `philosophy.html`, `technologies.html`, `case-files.html`, `faq.html`, `contact.html`, `accessibility.html`, plus `exhibits/` subdirectory) written by `writeStaticSite` preserving class attributes.
- `faq.json` is the fallback source for FAQ extractor — already consumed by `sources.ts:faqItemsToTiddlers`.

### Established Patterns
- SCAF-08 discipline: no `setTimeout`, no `Date.now()` / `Date()` for reading wall-clock, no `Promise.all`, sequential `for...of` only, deterministic output byte-for-byte across runs. Enforced by grep-based acceptance gates.
- File-scoped `/// <reference lib="dom" />` when DOM globals are needed (not a tsconfig-wide `lib: ['DOM']`). Followed in `scripts/editorial/capture.ts` and `scripts/editorial/static-html.ts`.
- Inline HTML test fixtures via template literals in `*.test.ts`. Vitest `scripts` project already configured via `vitest.config.ts` include glob and `tsconfig.editorial.json` project reference (TSCFG-NOTE: extractors tsconfig may reuse editorial tsconfig or get its own; verify in plan-phase).
- Every module emits JSDoc-free TypeScript (codebase convention — CONVENTIONS.md: "JSDoc/TSDoc: Not used in current codebase"). Functions are named descriptively; types speak for themselves.

### Integration Points
- Phase 55 (FIX-02) will wire extractor output into `generate.ts` via new calls like `pageContentToTiddlers(extractedPages)` replacing the `pageSpecsToTiddlers(PROJECT_ROOT, PAGES, linkMap)` HTML-to-wikitext path.
- Phase 54 (ATOM-*) will import extractor output types directly to build per-entity tiddlers (person / finding / technology / testimonial).
- Phase 56 (TEST-*) will add e2e / integration tests against a local fixture http-server + live `static-site/` HTML.

</code_context>

<specifics>
## Specific Ideas

- Eight extractor modules, one per REQ: `faq.ts`, `exhibit.ts`, `personnel.ts`, `findings.ts`, `technologies.ts`, `testimonials.ts`, `pages.ts`, `case-files-index.ts`.
- One shared `types.ts` with re-exportable interfaces + `ExtractorError` class (constructor: `new ExtractorError(message, opts?: { extractor?: string; cause?: unknown })`).
- `faq.ts` is the only extractor with fallback — `emit(html: string)` reads `faq.html`; if parsing yields 0 items OR the wrapper selector is missing, a sibling `emitFromJsonFallback(rawJson: string): FaqItem[]` exists for the caller to invoke. File-absence check lives at the caller (extractor is pure).
- Each `*.test.ts` ships the 3-scenario matrix (happy / missing-field / malformed-DOM) + idempotency assertion.

</specifics>

<deferred>
## Deferred Ideas

- Live integration smoke (run all 8 extractors against real `static-site/*.html` and assert entity counts ~66 personnel, ~45 findings, ~40-80 technologies) — defer to Phase 56 TEST-03.
- `generate.ts` wiring (swap `sources.ts` paths for extractor paths) — defer to Phase 55 FIX-02.
- Cross-link integrity check — deferred to Phase 54 ATOM-05.
- `pnpm tiddlywiki:extract` CLI that runs all 8 extractors and dumps JSON — not required by any EXTR REQ; add only if planning exposes a clean integration need.

</deferred>
