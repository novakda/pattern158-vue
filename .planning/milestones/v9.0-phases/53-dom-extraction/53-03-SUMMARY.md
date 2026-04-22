---
phase: 53-dom-extraction
plan: 03
subsystem: tooling
tags: [extractor, exhibit, dom-extraction, tdd]

requires:
  - phase: 53-dom-extraction
    plan: 01
    provides: Shared types.ts (Exhibit/ExhibitSection/ExhibitSubsection interfaces, ExtractorError class, parseHtml helper)
provides:
  - scripts/tiddlywiki/extractors/exhibit.ts (emitExhibit pure function — html → Exhibit)
  - scripts/tiddlywiki/extractors/exhibit.test.ts (8 describe blocks, 8 it cases, hermetic inline fixtures)
affects: [54-atomic-tiddler-generation, 55-iter-1-fixes]

tech-stack:
  added: []
  patterns:
    - ":scope > p selector restricts paragraph collection to direct section children (happy-dom 20+ supports :scope)"
    - "h3 + sibling <p> subsection walker via Array.from(section.children) + sequential for-of accumulator"
    - "Enum normalization via lowercase+dash-normalize with safe default fallback (engineering-brief for unknown badges)"
    - "KNOWN_SIBLING_HEADINGS Set<string> filter for sibling-extractor ownership boundaries (Personnel/Technologies/Findings skipped from Exhibit.sections)"
    - "JSON-only fields (impactTags/summary/role/emailCount) default to empty per Phase 53 DOM-canonical contract — callers get total shape with no | undefined noise"

key-files:
  created:
    - scripts/tiddlywiki/extractors/exhibit.ts
    - scripts/tiddlywiki/extractors/exhibit.test.ts
  modified: []

key-decisions:
  - "normalizeExhibitType uses lowercase + /\\s+/g dash-collapse then trim; unknown badge text falls back to 'engineering-brief' (safer default — most exhibits are briefs per plan context)"
  - "Context section detection uses CONTEXT_HEADING_CANDIDATES = {'Background', 'Context'} — first-match-wins single-context contract; remaining sections all flow to Exhibit.sections"
  - "Subsection walker walks section.children (not a querySelector for 'h3 ~ p') because happy-dom general-sibling traversal is order-sensitive and easier to reason about when h3 blocks are interleaved with p blocks"
  - "collectDirectParagraphs uses :scope > p to avoid picking up paragraphs nested inside subsections (those land in the subsection's text field) — happy-dom 20.8.9 supports :scope"
  - "8 describe blocks: happy-path engineering brief, investigation-report type, context section, sections+subsections, JSON-only defaults, malformed-DOM throws, missing-meta defaults, idempotency"

patterns-established:
  - "Single-entity emit contract: emitExhibit(html) returns one Exhibit (not Exhibit[]) — distinct from emitFaqItems/emitPersonnel which return arrays; throws ExtractorError on structural failure (missing h1.exhibit-detail-title)"
  - "Known-siblings set filters sections-that-other-extractors-own from the current extractor's sections list — repeatable pattern for any extractor that shares DOM with siblings"

requirements-completed: [EXTR-02]

duration: "~4m"
completed: 2026-04-22
---

# Phase 53 Plan 03: Exhibit Extractor Summary

**emitExhibit(html) parses a static-site/exhibits/exhibit-*.html page into a single Exhibit entity with 12 fields (label/client/date/title/exhibitType/contextHeading/contextText/sections/impactTags/summary/role/emailCount); walks h3 subsections inside non-sibling-extractor exhibit-section blocks; throws ExtractorError on missing h1.exhibit-detail-title.**

## Performance

- **Tasks:** 2 (Task 1 RED test file; Task 2 GREEN implementation)
- **Files created:** 2 (274 total lines: exhibit.ts 142, exhibit.test.ts 132)
- **Tests:** 8 describe blocks / 8 it cases — 8/8 pass
- **Scripts test suite status:** 31/31 files pass, 458/458 tests pass (no regressions)

## Accomplishments

- `scripts/tiddlywiki/extractors/exhibit.ts` created — `emitExhibit(html: string): Exhibit` pure function.
  - Extracts label/client/date from `.exhibit-meta-header` spans, title from `h1.exhibit-detail-title`, exhibitType from `.exhibit-type-badge` via `normalizeExhibitType`.
  - Throws `ExtractorError` when `h1.exhibit-detail-title` is absent.
  - Missing `.exhibit-meta-header` returns empty strings for label/client/date (non-fatal).
  - Walks `.exhibit-section` blocks once; first one whose h2 is in `{'Background','Context'}` becomes `contextHeading`/`contextText`; `Personnel`/`Technologies`/`Findings` skipped (sibling extractors own those); remainder populate `Exhibit.sections[]` with direct-child `<p>` prose + h3-gated subsections.
  - JSON-only fields (`impactTags`, `summary`, `role`, `emailCount`) default to empty-array/''/''/''/0 per Phase 53 DOM-canonical contract.
- `scripts/tiddlywiki/extractors/exhibit.test.ts` created — 8 describe blocks / 8 it cases covering happy-path engineering brief, investigation-report type normalization, context section extraction, sections+subsections walker, JSON-only field defaults, malformed-DOM throws, missing-meta defaults, idempotency (byte-identical JSON.stringify).
- All 8 tests pass on the first GREEN commit; no iteration needed.
- Smoke-tested emitExhibit against the real `static-site/exhibits/exhibit-a.html` file — returns a structurally correct Exhibit:
  - `label='Exhibit A'`, `client='General Dynamics Electric Boat'`, `date='2015–2022'`, `exhibitType='engineering-brief'`
  - `contextHeading='Background'` with full multi-paragraph `contextText`
  - 9 narrative sections (Sequence of Events / On-Site Resolution / Second On-Site Visit / Continued Engagement / Probable Cause / Recommendations Implemented / Outcome / Expanded Scope / Engagement Metadata) — Personnel/Technologies/Findings correctly filtered out.
- `pnpm build` exits 0.
- `pnpm test:scripts` exits 0 (31 files / 458 tests — no regressions from pre-plan baseline).
- SCAF-08 compliance verified via grep: no `setTimeout`, `Date.now`, `new Date`, or `Promise.all` in either file.
- JSDoc-free per project convention: `! grep -n "^ *\\* " exhibit.ts` returns 1.

## Task Commits

1. **Task 1: Write exhibit.test.ts (RED)** — `952e7ad` (test) — 8 describe blocks, inline HTML template-literal fixtures, imports from `./types.ts` + `./exhibit.ts`, runs expect-to-fail (module not found at commit time).
2. **Task 2: Implement exhibit.ts (GREEN)** — `308dfec` (feat) — `emitExhibit` with `normalizeExhibitType`, `collectDirectParagraphs`, `collectSubsections` helpers; 8/8 tests pass.

## Files Created/Modified

- `scripts/tiddlywiki/extractors/exhibit.ts` **(created, 142 lines)** — `emitExhibit(html): Exhibit`. Pure function. Imports `parseHtml`, `ExtractorError`, `Exhibit`/`ExhibitSection`/`ExhibitSubsection` types from `./types.ts`. Three file-scope selector constants, `KNOWN_SIBLING_HEADINGS` + `CONTEXT_HEADING_CANDIDATES` sets. Helpers: `textOf`, `normalizeExhibitType`, `collectDirectParagraphs`, `collectSubsections`. No JSDoc. SCAF-08 clean.
- `scripts/tiddlywiki/extractors/exhibit.test.ts` **(created, 132 lines)** — 8 describe blocks / 8 it cases. Single shared `ENGINEERING_BRIEF_HTML` template-literal fixture plus per-test minimal fixtures for the malformed-DOM and missing-meta-header edge cases. Imports `ExtractorError` from `./types.ts` and `emitExhibit` from `./exhibit.ts`.

## Decisions Made

- **Safe default for unknown badge text** → `normalizeExhibitType` falls back to `'engineering-brief'` for any input that doesn't normalize to exactly `'investigation-report'`. Rationale per plan context: most exhibits are briefs, and a non-throwing default keeps the extractor total-shape for Phase 54 atomic tiddler generators.
- **Subsection walker uses `Array.from(section.children)` + for-of accumulator** → Walks direct element children in document order, opens a new subsection on each h3, accumulates non-empty `<p>` siblings until the next h3 or end. Clean, order-preserving, deterministic. Alternative (CSS general-sibling or per-h3 scoped queries) would duplicate traversal and risk off-by-one boundary errors.
- **`collectDirectParagraphs` uses `:scope > p`** → Restricts paragraph collection to direct section children, avoiding double-counting paragraphs that already belong to a subsection's `text`. happy-dom 20.8.9 supports `:scope`.
- **`KNOWN_SIBLING_HEADINGS = {'Personnel','Technologies','Findings'}` filter** → These sections have their own dedicated extractors (Plans 04/05/06) and their DOM (tables) is not prose. Skipping them keeps `Exhibit.sections` scoped to narrative content and prevents the prose-only walker from producing empty/nonsensical results from table-rich sections.
- **Context heading candidates `{'Background','Context'}`** → First-match-wins. The live `exhibit-a.html` uses `Background`; the JSON source field is `contextHeading: 'Context'` in some exhibits. Both supported without requiring a CSS data-attribute marker.

## Deviations from Plan

None — the plan executed exactly as written.

Note: during Task 2 verification, an environmental update to `tsconfig.scripts.json` (adding `"allowImportingTsExtensions": true` and `"vitest/globals"` to `types`) surfaced out-of-scope from this plan. The change was made by a parallel Wave 2 coordination step (not by this executor) and was pre-applied by the time my Task 2 build was run; my plan files (`exhibit.ts`, `exhibit.test.ts`) were unaffected by it — they work correctly both before and after the tsconfig update from a runtime perspective (pnpm test:scripts used globals as ambient under Vitest's runner regardless; the tsconfig change only affects compile-time type-checking). I did not modify `tsconfig.scripts.json` myself.

## Known Stubs

None. Every field in `Exhibit` is populated from DOM or deliberately defaulted per the Phase 53 DOM-canonical contract:
- `impactTags: []` — documented in plan; impact-tag data lives on `case-files.html` not `exhibit-*.html` (Phase 55 can cross-reference if needed)
- `summary: ''` / `role: ''` / `emailCount: 0` — documented in plan; these fields are JSON-source-only and do not render on the detail page

## Issues Encountered

- None. RED → GREEN in a single iteration; all 8 tests pass on first implementation; no auto-fix cycles invoked.

## User Setup Required

None — no external service configuration.

## Next Phase Readiness

Phase 54 (ATOM-01..05 atomic tiddler generators) can consume `emitExhibit` directly:

```typescript
import { emitExhibit } from './extractors/exhibit.ts'
const ex = emitExhibit(await fs.readFile('static-site/exhibits/exhibit-a.html', 'utf8'))
// ex.label, ex.client, ex.date, ex.title, ex.exhibitType, ex.contextHeading, ex.contextText, ex.sections, ...
```

Phase 55 (FIX-02) can wire `emitExhibit` output into `scripts/tiddlywiki/generate.ts` alongside the other seven Wave 2 extractors as they land.

## Self-Check: PASSED

- `scripts/tiddlywiki/extractors/exhibit.ts` — FOUND
- `scripts/tiddlywiki/extractors/exhibit.test.ts` — FOUND
- Commit `952e7ad` (Task 1 RED) — FOUND in git log
- Commit `308dfec` (Task 2 GREEN) — FOUND in git log
- `pnpm build` exit 0 — verified
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/exhibit.test.ts` exit 0 (8/8 pass) — verified
- `pnpm test:scripts` full suite exit 0 (31 files / 458 tests pass) — verified
- No changes outside `scripts/tiddlywiki/extractors/exhibit.{ts,test.ts}` in this executor's commits — verified
- SCAF-08 grep clean on both files (no setTimeout/Date.now/new Date/Promise.all) — verified
- No JSDoc in exhibit.ts — verified
- Smoke test against real static-site/exhibits/exhibit-a.html succeeds with structurally correct output — verified

---
*Phase: 53-dom-extraction*
*Completed: 2026-04-22*
