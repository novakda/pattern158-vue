---
phase: 54-atomic-tiddler-generation
plan: 06
subsystem: generators
tags: [tiddlywiki, generators, exhibit-cross-links, atomic-tiddler, tdd, scaf-08]

# Dependency graph
requires:
  - phase: 54-atomic-tiddler-generation
    plan: 01
    provides: >
      Shared import surface (generators/types.ts re-exporting Exhibit,
      PersonnelEntry, FindingEntry, TechnologyEntry, Testimonial) and shared
      pure helpers (truncateAtWordBoundary, formatExhibitTitle, wikiLink)
provides:
  - Producer half of ATOM-05 — buildExhibitCrossLinks(exhibit, entities) pure
    function returning a CrossLinkBundle of four deterministic, sorted, deduped
    [[...]] wikitext link arrays (personnel / findings / technologies /
    testimonials) whose targets match the exact titles Plans 54-02..05 emit
  - CrossLinkBundle + ExhibitEntities TS contracts used by Phase 55 exhibit
    body wiring
affects:
  - 54-07 (integrity-check consumer ATOM-05 — orphan detection walks these link
    targets; this plan locks the title-format contracts the checker assumes)
  - 54-08 (Wave-3 wiring / phase summary)
  - Phase 55 FIX-02 (refactored generate.ts calls buildExhibitCrossLinks when
    composing the exhibit tiddler body)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Central cross-link producer that duplicates title-format constants
      from Plans 54-02..05 by design — the orphan checker (Plan 54-07) is the
      drift alarm if any generator changes its title formula"
    - "Sorted + Set-deduped link arrays (sortedUniqueLinks) — byte-stable
      output across two calls on the same input"
    - "Case-insensitive technology merge with first-seen casing wins —
      producer mirrors Plan 54-04 tiddler emission so link targets align"

key-files:
  created:
    - scripts/tiddlywiki/generators/exhibit-cross-links.ts
    - scripts/tiddlywiki/generators/exhibit-cross-links.test.ts
  modified: []

key-decisions:
  - "FINDING_TRUNCATE_CHARS=60 and ATTRIBUTION_TRUNCATE_CHARS=40 duplicated
    from the tiddler generators on purpose — title-format contracts are
    SOURCE-OF-TRUTH in 54-CONTEXT.md, and Plan 54-07's integrity checker is
    the drift alarm if any producer diverges"
  - "Technology merge runs inside the producer (case-insensitive key,
    first-seen casing wins) so cross-link targets align with Plan 54-04's
    tiddler titles; without merging, '[[Tech: typescript]]' would orphan
    against '[[Tech: TypeScript]]'"
  - "Testimonials filter compares sourcePageLabel to formatExhibitTitle(label)
    — i.e. the full 'Exhibit A' title rather than the bare 'A' label — to
    match Plan 54-05's testimonial tag/source contract"
  - "Anonymous testimonial fallback title is 'Testimonial: (anonymous)'
    (hard-coded parenthetical sentinel) so attribution-empty rows still
    resolve to a valid tiddler title"
  - "Personnel disambiguation by organization (used in Plan 54-02 tiddler
    titles for same-name-different-org collisions) is NOT reproduced here —
    within a single exhibit, same-name collisions are rare and sortedUniqueLinks
    dedupes to one link; Phase 55 wiring can add a disambiguator helper if
    runtime data shows collisions"
  - "sortedUniqueLinks sorts AFTER wrapping in [[...]]; lexicographic sort on
    the bracketed string is equivalent to sorting on the target since the
    prefix '[[' is constant — simpler than sort-then-wrap"

patterns-established:
  - "Pattern: pure producer → CrossLinkBundle contract that a downstream
    wiring step (Phase 55) composes into tiddler body wikitext"
  - "Pattern: title-format constants duplicated deliberately across producers;
    integrity checker catches drift — prefer loud failure over implicit coupling"

requirements-completed:
  - ATOM-05 (producer half — consumer half ships in Plan 54-07)

# Metrics
duration: 2m18s
completed: 2026-04-22
---

# Phase 54 Plan 06: Exhibit Cross-Links Producer Summary

**ATOM-05 producer-half delivered: pure `buildExhibitCrossLinks` function returning a deterministic four-array `CrossLinkBundle` whose `[[...]]` link targets reproduce the exact tiddler titles Plans 54-02..05 emit, ready for Phase 55 exhibit-body wiring.**

## Performance

- **Started:** 2026-04-22T00:16:30Z
- **Completed:** 2026-04-22T00:18:48Z
- **Duration:** ~2m18s
- **Tasks:** 2 (RED test + GREEN implementation)
- **Files created:** 2
- **Files modified:** 0

## Accomplishments

- Delivered `buildExhibitCrossLinks(exhibit, entities): CrossLinkBundle` — a pure function that computes the four `[[...]]` wikitext link arrays an exhibit body needs (personnel, findings, technologies, testimonials), filtered to rows belonging to the given exhibit.
- Reproduced the tiddler title formulas from Plans 54-02..05 exactly so cross-links resolve to real tiddler titles (no orphans) when Plan 54-07's integrity checker runs.
- Applied the same case-insensitive first-seen-casing tech merge Plan 54-04 uses so `'TypeScript' + 'typescript'` collapse to one `[[Tech: TypeScript]]` link.
- Kept SCAF-08 discipline: no wall-clock reads, no instantiated dates, no parallel iteration; deterministic sorted + deduped output.
- Full RED → GREEN TDD cycle committed atomically across two tasks.

## Task Commits

1. **Task 1: Write exhibit-cross-links.test.ts (RED)** — `ad41919` (test)
2. **Task 2: Implement exhibit-cross-links.ts (GREEN)** — `ade8ea3` (feat)

**Plan metadata commit:** _(pending — captures SUMMARY.md + STATE.md + ROADMAP.md)_

## Files Created/Modified

- `scripts/tiddlywiki/generators/exhibit-cross-links.ts` — ATOM-05 producer. Exports `buildExhibitCrossLinks`, `CrossLinkBundle`, `ExhibitEntities`. Imports `Exhibit`, `PersonnelEntry`, `FindingEntry`, `TechnologyEntry`, `Testimonial` from `./types.ts` and `truncateAtWordBoundary`, `formatExhibitTitle`, `wikiLink` from `./helpers.ts`. Internal helpers `personnelTitle`, `findingTitle`, `testimonialTitle`, `sortedUniqueLinks`. Module-scoped constants `FINDING_TRUNCATE_CHARS = 60`, `ATTRIBUTION_TRUNCATE_CHARS = 40`, `ANONYMOUS_FALLBACK = '(anonymous)'`.
- `scripts/tiddlywiki/generators/exhibit-cross-links.test.ts` — 10 describe blocks, 10 it cases. Hermetic inline object-literal fixtures via `makeExhibit(label)` helper; imports only from `./types.ts` and `./exhibit-cross-links.ts`.

## Exported Symbols

| Symbol | Kind | Signature |
| --- | --- | --- |
| `buildExhibitCrossLinks` | function | `(exhibit: Exhibit, entities: ExhibitEntities) => CrossLinkBundle` |
| `CrossLinkBundle` | interface | `{ personnelLinks, findingsLinks, technologiesLinks, testimonialsLinks: readonly string[] }` |
| `ExhibitEntities` | interface | `{ personnel, findings, technologies, testimonials: readonly …[] }` |

## Title Formulas Locked (duplicated from Plans 54-02..05)

| Entity | Target title (the string inside `[[...]]`) |
| --- | --- |
| Person (named) | `{name}` |
| Person (anonymized, empty name) | `{role} @ {organization}` |
| Finding | `{exhibit-label} Finding: {finding truncated to 60 chars at word boundary}` |
| Technology | `Tech: {first-seen casing}` (case-insensitive merge) |
| Testimonial (attributed) | `Testimonial: {attribution truncated to 40 chars at word boundary}` |
| Testimonial (empty attribution) | `Testimonial: (anonymous)` |

These are orphan-prevention lock points. If Plan 54-02/04/05 changes a title formula, the duplicated constants in `exhibit-cross-links.ts` diverge → Plan 54-07's `verifyCrossLinkIntegrity` reports `{ source, link }` orphans at full-corpus run (Phase 55/56).

## Filter Rules

- **Personnel / Findings / Technologies:** `entry.sourceExhibitLabel === exhibit.label` — bare label compare (e.g. `'A'`, not `'Exhibit A'`).
- **Testimonials:** `entry.sourcePageLabel === formatExhibitTitle(exhibit.label)` — full-title compare (e.g. `'Exhibit A'`). Page-scoped testimonials (sourcePageLabel = `'Home'` etc.) are excluded from exhibit cross-links.

## Determinism Guarantees

- Each of the four arrays passes through `sortedUniqueLinks`: wrap every title via `wikiLink(...)`, dedupe via `Set`, then `Array.sort()`.
- Sorting on the bracketed string is equivalent to sorting on the target (constant `[[` prefix).
- Idempotency test asserts `JSON.stringify` byte-equality across two calls on the same input.

## Test Results

- **Scenario count:** 10 it cases across 10 describe blocks (1-to-1 describe→it ratio for clarity).
- **Coverage:** happy path / per-exhibit filter / anonymized-name fallback / finding truncation / technology case-merge / empty inputs / testimonial source filter / deterministic sort / idempotency / bundle shape.
- **Pass rate:** 10/10 (100%) against `pnpm test:scripts --run scripts/tiddlywiki/generators/exhibit-cross-links.test.ts`.
- **Runtime:** ~120ms (transform 28ms, import 34ms, tests 5ms).
- **Build:** `pnpm build` exits 0.

## Decisions Made

See `key-decisions` frontmatter above. Summary:
- Title-format constants intentionally duplicated here and in the per-entity generators; Plan 54-07 is the drift alarm.
- Technology case-merge runs in the producer (not deferred to the consumer) so link targets align with Plan 54-04 tiddler titles.
- Testimonial filter matches full `'Exhibit A'` source label (not bare `'A'`) per Plan 54-05 contract.
- Anonymous testimonial fallback is the hard-coded `'Testimonial: (anonymous)'` sentinel — any zero-attribution row collapses to one tiddler target.
- Personnel organization-disambiguation (Plan 54-02 same-name collision handling) is deliberately not reproduced in the producer; sortedUniqueLinks dedupes same-name collisions to one link and Phase 55 can add disambiguation if runtime data requires it.

## Deviations from Plan

None — plan executed exactly as written. Task 1 RED commit landed on the first try; Task 2 GREEN implementation passed 10/10 tests + `pnpm build` on the first run with no auto-fixes. No Rule-1/2/3 deviations; no Rule-4 checkpoints triggered.

**Total deviations:** 0
**Impact on plan:** None.

## Issues Encountered

None. Test infrastructure (vitest globals via `globals: true` in `vitest.config.ts` scripts project) was already in place from Plan 54-01 so no `describe`/`it`/`expect` imports were needed.

## TDD Gate Compliance

Plan is `type: execute` (not `type: tdd`), but both tasks used `tdd="true"` and produced the expected gate sequence in `git log`:
- RED gate commit: `ad41919` (`test(54-06): add failing exhibit-cross-links.test.ts (RED) for ATOM-05 producer`)
- GREEN gate commit: `ade8ea3` (`feat(54-06): implement exhibit-cross-links producer (GREEN) for ATOM-05`)
- REFACTOR: not required — implementation was minimal and clean on first GREEN (three tiny title helpers + one sortedUniqueLinks + main function with four iteration blocks).

## Wave-3 Readiness

- `buildExhibitCrossLinks` is ready for Plan 54-07's integrity checker to sanity-check against fixtures: produce a bundle, look up each bracketed target in the combined tiddler title set, flag orphans.
- `buildExhibitCrossLinks` is ready for Phase 55's `generate.ts` refactor: call once per exhibit with the four entity arrays, splice the four link arrays into the exhibit body wikitext.
- Import paths for downstream consumers:
  - `import { buildExhibitCrossLinks, type CrossLinkBundle, type ExhibitEntities } from './exhibit-cross-links.ts'`
- `pnpm build` and `pnpm test:scripts` exit 0; no root config changes required.

## User Setup Required

None — pure function producer, no external service configuration required.

## Self-Check: PASSED

Verified:
- `scripts/tiddlywiki/generators/exhibit-cross-links.ts` exists
- `scripts/tiddlywiki/generators/exhibit-cross-links.test.ts` exists
- Commit `ad41919` present in git log (RED)
- Commit `ade8ea3` present in git log (GREEN)
- 10/10 tests pass; `pnpm build` exit 0

---
*Phase: 54-atomic-tiddler-generation*
*Completed: 2026-04-22*
