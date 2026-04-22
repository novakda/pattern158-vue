# Phase 55: Iter-1 Fixes - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode; Phase 53/54 patterns locked)

<domain>
## Phase Boundary

Wire the Phase 53 extractors + Phase 54 generators into `scripts/tiddlywiki/generate.ts`, producing a full tiddler corpus (existing pages/FAQ/exhibits + ~150-200 new atomic tiddlers). Retire the iter-1 `html-to-wikitext.ts` path for non-exhibit pages. Enrich FAQ footers + Case Files Index shape.

Phase 55 retires (but does NOT delete) the iter-1 HTML→wikitext page converter. `html-to-wikitext.ts` remains on disk for exhibit content where the DOM extractor doesn't fully replace it; final retirement is Phase 58 scope if needed.

Out of scope for Phase 55:
- Theme / styling (Phase 57).
- Tzk-style directory layout + build pipeline (Phase 58).
- New tests beyond regression coverage of wired-up flows (Phase 56 adds TEST-01..04).

</domain>

<decisions>
## Implementation Decisions

### Refactor Strategy — Refactor, Don't Rewrite (LOCKED per v9.0 scope)
- `scripts/tiddlywiki/generate.ts` keeps its existing `main()` orchestration shape (read JSON + HTML → emit tiddlers + byproduct JSON + tiddlywiki.info).
- New call sites are ADDED alongside existing ones; iter-1 `faqItemsToTiddlers` / `exhibitsToTiddlers` / `pageSpecsToTiddlers` stay callable during the migration.
- End-state of Phase 55: the default generate path uses the extractor + generator pipeline for non-exhibit pages; JSON path becomes fallback (triggered by missing HTML or explicit env flag).
- `html-to-wikitext.ts` stays on disk unchanged in Phase 55. It becomes unreachable from the default path once `pageSpecsToTiddlers` is swapped out, but the module is retained so the git diff stays small and reversible.

### Wiring Order (FIX-01 through FIX-04 map to plan numbering)
- **Plan 55-01** (Wave 1): New `scripts/tiddlywiki/extract-all.ts` — orchestrates extractor calls against `static-site/*.html` + `static-site/exhibits/*.html` + `faq.json` fallback. Returns a typed bundle `{ faq, exhibits, personnelByExhibit, findingsByExhibit, technologiesByExhibit, testimonials, pages, caseFilesIndex }`. Pure TS — no tiddler assembly.
- **Plan 55-02** (Wave 2, depends 01): Wire `generate.ts` page path — swap `pageSpecsToTiddlers(..., linkMap)` for a call through the `pages.ts` extractor + a new `pageContentToTiddlers(pageContent)` generator. Ships FIX-02.
- **Plan 55-03** (Wave 2, depends 01): Wire `generate.ts` exhibit path — each exhibit tiddler now emits a Personnel/Findings/Technologies/Testimonials cross-link footer (via Phase 54's `buildExhibitCrossLinks`). Also fix FIX-01: iter-1 empty-subsection headings get actual body text when the extractor finds nested content.
- **Plan 55-04** (Wave 2, depends 01): Wire atomic tiddlers — `generate.ts` concatenates Phase 54 per-entity tiddlers (person, finding, technology, testimonial) into the output tiddler list.
- **Plan 55-05** (Wave 2, depends 01): Enrich FAQ footer (FIX-03) — per-FAQ tiddler footer lists sibling FAQs in same category + exhibit-linked callouts. Rewrite `faqItemsToTiddlers` body builder.
- **Plan 55-06** (Wave 2, depends 01): Case Files Index as sortable table (FIX-04) — rewrite `caseFilesIndexTiddler` body to emit a TiddlyWiki table macro with columns date | client | type | label. Each row links to the exhibit tiddler.
- **Plan 55-07** (Wave 3, depends 02..06): Smoke gate — run `pnpm tiddlywiki:generate` against live `static-site/`, assert tiddler count ≥ 100 (existing + ~150 atomic), assert `verifyCrossLinkIntegrity(tiddlers).orphans.length === 0`. Write `55-VERIFICATION.md`.

### Integration Test Strategy
- The smoke gate (Plan 55-07) runs the real generate script against the real `static-site/` HTML. Any orphaned cross-link aborts the gate with a printable list.
- Unit-level tests for the new wiring live in `pageContentToTiddlers.test.ts`, new `faqItemsToTiddlers.test.ts` coverage additions, and `caseFilesIndexTiddler.test.ts` — inline TS fixtures per Phase 54 pattern.
- E2E (local http-server against fixture site) is deferred to Phase 56 TEST-03.

### Backward Compatibility
- Running `pnpm tiddlywiki:generate` still produces output at the same paths (`tiddlywiki/tiddlers/*.tid`, `tiddlywiki/pattern158-tiddlers.json`, `tiddlywiki/tiddlywiki.info`).
- Existing tiddler titles are preserved where possible. New atomic tiddlers use the locked Phase 54 title formats.
- Orphan tiddlers found pre-Phase-55 (e.g., `[[FAQ Index]]` stubs) are resolved by the new generators; integrity check should pass cleanly post-wiring.

### Claude's Discretion
- Exact implementation of the extractor orchestration loop inside `extract-all.ts` — parallel vs sequential (should be sequential per SCAF-08).
- Whether `generate.ts` imports from `extractors/` + `generators/` directly or through a single re-export barrel file.
- Whether `html-to-wikitext.ts` is annotated `@deprecated` (no JSDoc convention) or left without marker — prefer leaving it untouched in Phase 55; final disposition is Phase 58 scope.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 53 extractors under `scripts/tiddlywiki/extractors/` — all 8 emit functions.
- Phase 54 generators under `scripts/tiddlywiki/generators/` — 5 `emit*Tiddlers` + cross-links + integrity-check.
- Existing `scripts/tiddlywiki/generate.ts` `main()` — the orchestrator to refactor (126 lines).
- `scripts/tiddlywiki/sources.ts` — contains `faqItemsToTiddlers`, `caseFilesIndexTiddler`, `exhibitsToTiddlers`, `pageSpecsToTiddlers`, `siteMetaTiddlers`, `defaultLinkMap` — all require modification or replacement for FIX-01..04.

### Established Patterns (Phase 53/54)
- SCAF-08 locked.
- `git commit -o <path>` for tracked-file edits.
- Inline TS fixtures in tests.
- Phase boundary enforced — don't touch Phase 53 extractors or Phase 54 generators.

### Integration Points
- Phase 56 TEST-03 will add e2e smoke (local http-server + fixture HTML).
- Phase 57 theme work will style the tiddlers emitted in this phase.

</code_context>

<specifics>
## Specific Ideas

- Add new helper `extract-all.ts` to orchestrate the 8 extractors — single entry point for `generate.ts`.
- FAQ footer enrichment: for each FAQ tiddler, emit `---\n\n!! See also\n\n{sibling FAQs same category} + {exhibit callouts}`.
- Case Files Index table body (TiddlyWiki wikitext syntax):
```
|!Date |!Client |!Type |!Case |
|2015 |General Dynamics |Engineering |[[Exhibit A]] |
```
- `pnpm tiddlywiki:generate` output count before Phase 55: ~25 tiddlers (5 meta + 5 pages + 16 exhibits + faq-index + ~27 FAQ items).
- After Phase 55: ~175-225 (existing + ~150 atomic).

</specifics>

<deferred>
## Deferred Ideas

- Full e2e against local http-server — Phase 56 TEST-03
- Deletion of `html-to-wikitext.ts` — if still unreachable post-Phase-58, remove in a cleanup commit
- Validation that tiddler file output is byte-identical across runs — Phase 56 adds this test

</deferred>
