# Phase 54: Atomic Tiddler Generation - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (pattern established in Phase 53; locked decisions inherited)

<domain>
## Phase Boundary

Pure tiddler generators that consume the extractor output types from `scripts/tiddlywiki/extractors/types.ts` (Phase 53) and emit `Tiddler` records (`scripts/tiddlywiki/tid-writer.ts` shape). This phase ships **generator modules + fixture tests + cross-link integrity checker only** — wiring into the main pipeline is Phase 55 (FIX-02).

Out of scope for Phase 54:
- Modifying `scripts/tiddlywiki/generate.ts`, `sources.ts`, or `html-to-wikitext.ts` (Phase 55).
- Theme / styling (Phase 57).
- Deployment / build pipeline (Phase 58).

</domain>

<decisions>
## Implementation Decisions

### Module Layout & API
- Generators live under **`scripts/tiddlywiki/generators/`** (parallel sibling to `extractors/`).
- One generator module per atomic tiddler type:
  - `person.ts` — `emitPersonTiddlers(entries: PersonnelEntry[]): Tiddler[]` (ATOM-01)
  - `finding.ts` — `emitFindingTiddlers(entries: FindingEntry[]): Tiddler[]` (ATOM-02)
  - `technology.ts` — `emitTechnologyTiddlers(entries: TechnologyEntry[]): Tiddler[]` (ATOM-03)
  - `testimonial.ts` — `emitTestimonialTiddlers(entries: Testimonial[]): Tiddler[]` (ATOM-04)
  - `exhibit-cross-links.ts` — `buildExhibitCrossLinks(exhibit: Exhibit, { personnel, findings, technologies, testimonials }): { personnelLinks, findingsLinks, technologiesLinks, testimonialsLinks }` (ATOM-05 producer side)
  - `integrity-check.ts` — `verifyCrossLinkIntegrity(tiddlers: Tiddler[]): { orphans: { source: string; link: string }[] }` (ATOM-05 consumer side)
- Pure functions: input is typed data + optional opts bag, output is `Tiddler[]` or structured result. No I/O inside generators.

### Title & Tag Formats (LOCKED by ATOM REQs — copy verbatim into plan acceptance criteria)
- **Person tiddler:** title = `{Name}` (or `{Role} @ {Organization}` when `entryType === 'anonymized'` and name is empty); tags = `['person', '[[{Client}]]', 'entry-type-{individual|group|anonymized}']`; body lists every exhibit the person appears in as `[[Exhibit {Label}]]` link.
- **Finding tiddler:** title = `{Exhibit Label} Finding: {finding truncated to 60 chars at word boundary}`; tags = `['finding', 'severity-{level}', 'category-{slug}', '[[Exhibit {Label}]]']`; body = finding + description + resolution + outcome (each as labeled paragraph).
- **Technology tiddler:** title = `Tech: {Name}`; tags = `['technology']`; body aggregates all exhibit back-references (`[[Exhibit {Label}]]`) each with its context blurb.
- **Testimonial tiddler:** title = `Testimonial: {Attribution truncated to 40 chars at word boundary}`; tags = `['testimonial', '[[{Source Page or Exhibit}]]']`; body contains quote + attribution + role.

### Cross-Link Contract (ATOM-05)
- Generators produce `Tiddler.text` containing `[[...]]` wikitext links per the above title formats. Link targets must match the EXACT title another generator produces.
- **`verifyCrossLinkIntegrity(tiddlers)`** walks every tiddler body, extracts all `[[target]]` occurrences via regex `/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g`, builds a Set of all tiddler titles, and returns a list of `{ source, link }` for every link whose target is not in the title set. Empty `orphans` array = clean graph.
- Phase 54 ships the integrity checker AND a unit test with deliberately-orphaned fixtures proving it detects them. Full-corpus integrity (real generated tiddlers) is deferred to Phase 55 smoke gate and Phase 56 TEST-04.

### Types, Tests, SCAF-08 — Inherited From Phase 53
- happy-dom NOT used here — this phase operates on pre-parsed typed data.
- Named exports, camelCase, no JSDoc, single quotes, 2-space indent, semicolons.
- SCAF-08: no `setTimeout`, no `Date.now()`, no `new Date()` wall-clock, no `Promise.all`, sequential `for...of` only, deterministic output.
- Test pattern: inline TypeScript fixtures via object literals in each `*.test.ts`. Minimum 3 scenarios per generator (happy path + empty input + edge case) + idempotency assertion.
- Shared types.ts additions (if any new shared types beyond `Tiddler`) go in `scripts/tiddlywiki/generators/types.ts` (local), NOT in `scripts/tiddlywiki/extractors/types.ts` (Phase 53 boundary).

### Claude's Discretion
- Exact truncation helper (`truncateAtWordBoundary(text, maxLen)`) implementation is at Claude's discretion; should be deterministic.
- Whether person-tiddler title-generation helper belongs in `person.ts` or a shared `title-helpers.ts` is at Claude's discretion (prefer colocate unless used by 2+ generators).
- Whether `integrity-check.ts` lives under `generators/` or a sibling `checks/` dir is at Claude's discretion (recommend `generators/integrity-check.ts` for cohesion).

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets (From Phase 53 + earlier)
- `scripts/tiddlywiki/tid-writer.ts` exports `Tiddler` interface + `formatTagsField` + `tiddlerTitleToFilename` — reuse the `Tiddler` type; generators produce arrays of it.
- `scripts/tiddlywiki/extractors/types.ts` exports `PersonnelEntry`, `FindingEntry`, `TechnologyEntry`, `Testimonial`, `Exhibit` — generator inputs.
- `scripts/tiddlywiki/sources.ts` contains iter-1 `faqIndexTiddler`, `caseFilesIndexTiddler`, etc. — reference for Tiddler shape construction, not directly reused (iter-1 will be refactored in Phase 55).

### Established Patterns
- TDD RED/GREEN with inline fixtures (Phase 53 convention).
- SCAF-08 discipline via grep-based acceptance gates.
- Pure function APIs with opts-bag for optional context.

### Integration Points
- Phase 55 FIX-02 will call these generators from a refactored `scripts/tiddlywiki/generate.ts`.
- Phase 56 TEST-04 will add a cross-link integrity test against the full real tiddler set.

</code_context>

<specifics>
## Specific Ideas

- 6 generator/check modules: `person.ts`, `finding.ts`, `technology.ts`, `testimonial.ts`, `exhibit-cross-links.ts`, `integrity-check.ts`.
- ~150-200 atomic tiddlers will be produced at runtime (Phase 55 wiring) — this phase only proves the generator shape on fixtures.
- Truncation helper: truncate at last word boundary ≤ maxLen chars, append `…` if truncated.

</specifics>

<deferred>
## Deferred Ideas

- Full-corpus integrity check against real extractor output — Phase 55 smoke gate.
- Auto-regenerate on file changes — Phase 58 tzk workflow scope.

</deferred>
