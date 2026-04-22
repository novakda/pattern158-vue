---
phase: 55-iter-1-fixes
plan: 04
subsystem: tiddlywiki-generator
tags: [tiddlywiki, atomic-tiddlers, generate, phase-54-consumer, wiring, scaf-08]

# Dependency graph
requires:
  - phase: 55-iter-1-fixes
    plan: 01
    provides: extractAll returning ExtractedBundle with personnelByExhibit + findingsByExhibit + technologiesByExhibit + testimonials + exhibits keys (consumed to drive the atomic generator call sites)
  - phase: 54-iter-1-generators
    plan: 02
    provides: emitPersonTiddlers(entries, { client }) — ATOM-01 per-person Tiddler[] with [[{Client}]] tag
  - phase: 54-iter-1-generators
    plan: 03
    provides: emitFindingTiddlers(entries) — ATOM-02 per-finding Tiddler[]
  - phase: 54-iter-1-generators
    plan: 04
    provides: emitTechnologyTiddlers(entries) — ATOM-03 case-insensitive-merged technology Tiddler[]
  - phase: 54-iter-1-generators
    plan: 05
    provides: emitTestimonialTiddlers(entries) — ATOM-04 per-testimonial Tiddler[]
  - phase: 55-iter-1-fixes
    plan: 03
    provides: exhibitsToTiddlers footer that emits [[Person]] / [[Exhibit X Finding: …]] / [[Tech: …]] / [[Testimonial: …]] links — these now resolve to tiddlers that exist on disk
provides:
  - Live default generate path emits atomic person/finding/technology/testimonial tiddlers alongside meta/pages/exhibits/FAQ
  - Person tiddlers tagged `[[{Client}]]` via per-client grouping keyed on bundle.exhibits label → client lookup
  - Finding / Technology / Testimonial tiddlers emitted via single-call on the respective bundle arrays
  - Orphan guard — personnel entries whose sourceExhibitLabel does not match any extracted exhibit are skipped
  - stdout summary extended with atomic counts line (`N persons, N findings, N technologies, N testimonials`)
affects: [55-07-smoke-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-client personnel grouping: iter-1 bundle has flat personnelByExhibit; Phase 54 emitPersonTiddlers takes one client per call (ATOM-01 locked tag format). Build `clientByLabel` Map<string,string> from `bundle.exhibits`, then iterate `bundle.personnelByExhibit` into `Map<client, PersonnelEntry[]>` buckets. Invoke emitPersonTiddlers once per sorted client key — deterministic output order."
    - "Orphan-entry skip guard: `clientByLabel.get(p.sourceExhibitLabel) === undefined` → continue. Prevents untagged person tiddlers when exhibits.json references a label with no corresponding static-site HTML (emitExhibit throw / missing file cases)."
    - "Finding / Technology / Testimonial: single flat call on `bundle.findingsByExhibit` / `bundle.technologiesByExhibit` / `bundle.testimonials`. No grouping needed — these generators already carry their source-exhibit metadata in each entry."
    - "Insertion order: atomic tiddlers placed after `exhibitsToTiddlers(...)` and before `faqIndexTiddler(...)` — sits between the exhibits that link to them and the FAQ which doesn't. Keeps JSON byproduct readable."
    - "Inline-type import — `import { type PersonnelEntry } from './extractors/types.ts'` (not `import type { … }`). Matches the plan's literal-text acceptance grep `grep -q \"type PersonnelEntry\"` while still erasing at build time."

key-files:
  created: []
  modified:
    - scripts/tiddlywiki/generate.ts

key-decisions:
  - "Plan said `import type { PersonnelEntry }` but the acceptance criterion `grep -q \"type PersonnelEntry\"` demands the literal sequence `type PersonnelEntry` adjacent in the file. Used inline `import { type PersonnelEntry } from …` instead — semantically identical (type-only import, erased at build time), but satisfies the grep. No runtime difference."
  - "PersonnelEntry import path — `./extractors/types.ts`, not `./generators/types.ts`. Both export the type; the plan specifies the extractors path and that's the canonical source-of-truth definition. Generators/types.ts is a re-export barrel for generator-side consumers."
  - "No new test file added. The wiring is pure glue: 4 function calls + 1 for-of grouping loop. The atomic generators are already unit-tested in Phase 54. End-to-end coverage is Plan 55-07's smoke gate + verifyCrossLinkIntegrity assertion. This matches the plan's explicit no-new-test guidance."
  - "Live corpus emits 318 atomic tiddlers in memory (64 persons + 45 findings + 188 technologies + 21 testimonials = 318), but only 247 unique atomic .tid files land on disk (the tid-writer collision behavior — filename normalization collapses, e.g., multiple Tech_ entries with near-identical display names). Total on-disk tid count = 344; plan threshold ≥100 is met 3.4×."

patterns-established:
  - "Bundle-driven atomic-tiddler composition: when the call site needs to route bundle arrays to per-entity generators, the pattern is (a) build a lookup Map from the richer extractor entity, (b) bucket the flat bundle array by the lookup key, (c) iterate sorted keys for determinism. Reusable for any future per-category-scoped generator."
  - "Insertion-order convention: meta → pages → case-files-index → exhibits (with footer) → atomic (person/finding/technology/testimonial) → faq-index → faq-items. Documenting for future additions."

requirements-completed: []

# Metrics
duration: ~5 min
completed: 2026-04-21
---

# Phase 55 Plan 04: Wire Atomic Tiddler Generators Summary

**Phase 54 atomic tiddler generators are now emitted on the default generate path. Total tiddler output grew from 49 → 367; on-disk `.tid` files grew ~50 → 344. Plan 55-03's cross-link footer ([[Jane Doe]] etc.) now resolves to real tiddlers on disk.**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-04-21
- **Tasks:** 1 (single glue-code wire-up; no TDD cycle — generators already covered in Phase 54)
- **Files created:** 0
- **Files modified:** 1 (scripts/tiddlywiki/generate.ts)

## Accomplishments

- Added 4 atomic-generator imports to `generate.ts`:
  - `emitPersonTiddlers` from `./generators/person.ts`
  - `emitFindingTiddlers` from `./generators/finding.ts`
  - `emitTechnologyTiddlers` from `./generators/technology.ts`
  - `emitTestimonialTiddlers` from `./generators/testimonial.ts`
- Added `PersonnelEntry` type import from `./extractors/types.ts` (inline `{ type … }` form).
- New composition block in `main()` before the `tiddlers[]` literal:
  - `clientByLabel = new Map(bundle.exhibits → label→client)`
  - `personnelByClient = new Map<string, PersonnelEntry[]>()` built by iterating `bundle.personnelByExhibit`, skipping orphans (entries whose `sourceExhibitLabel` is not in `clientByLabel`).
  - `personTiddlers` built by sorted-key iteration over `personnelByClient`, one `emitPersonTiddlers(entries, { client })` call per client.
  - `findingTiddlers` = `emitFindingTiddlers(bundle.findingsByExhibit)`.
  - `technologyTiddlers` = `emitTechnologyTiddlers(bundle.technologiesByExhibit)`.
  - `testimonialTiddlers` = `emitTestimonialTiddlers(bundle.testimonials)`.
- Spread all four atomic arrays into `tiddlers[]` between `...exhibitsToTiddlers(...)` and `faqIndexTiddler(...)`.
- Extended stdout summary with `${personTiddlers.length} persons, ${findingTiddlers.length} findings, ${technologyTiddlers.length} technologies, ${testimonialTiddlers.length} testimonials` line.

## Task Commits

1. **Task 1: Wire atomic tiddler generators into generate.ts main()** — `6c38766` (feat)

## Files Created/Modified

- `scripts/tiddlywiki/generate.ts` — +38 lines, 0 deletions. Adds 5 imports (4 generator fns + PersonnelEntry type), the personnelByClient grouping + per-client emit loop, and a single atomic-counts stdout line. The `tiddlers[]` literal now spreads the four atomic arrays after `...exhibitsToTiddlers(...)` and before `faqIndexTiddler(...)`.

## Files Confirmed Untouched (by this plan)

- `scripts/tiddlywiki/sources.ts` — 0-line diff
- `scripts/tiddlywiki/extract-all.ts` — 0-line diff
- `scripts/tiddlywiki/page-content-to-tiddlers.ts` — 0-line diff
- `scripts/tiddlywiki/html-to-wikitext.ts` — 0-line diff
- `scripts/tiddlywiki/tid-writer.ts` — 0-line diff
- `scripts/tiddlywiki/extractors/` — 0 files changed
- `scripts/tiddlywiki/generators/` — 0 files changed

## Live-Corpus Results

`pnpm tiddlywiki:generate` stdout (post-wiring):

```
[tiddlywiki:generate] Wrote 367 tiddlers → /home/xhiris/projects/pattern158-vue/tiddlywiki/tiddlers
                      3 meta, 5 pages, 16 exhibits, 25 FAQ
                      64 persons, 45 findings, 188 technologies, 21 testimonials
                      JSON byproduct: /home/xhiris/projects/pattern158-vue/tiddlywiki/pattern158-tiddlers.json
```

Atomic counts:
- **Persons:** 64 (grouped across N clients via bundle.exhibits lookup)
- **Findings:** 45 (one per FindingEntry)
- **Technologies:** 188 (case-insensitive-merged across exhibits)
- **Testimonials:** 21 (includes both exhibit-sourced and homepage-sourced)
- **Atomic total emitted:** 318

Tiddler-count delta:
- **Before (Plan 55-03 end):** 49 tiddlers emitted, ~50 .tid files on disk.
- **After (Plan 55-04 end):** 367 tiddlers emitted, 344 .tid files on disk.
- **Growth:** +318 atomic tiddlers emitted; 344 unique tid files (on-disk count differs from emitted count because tid-writer's tiddlerTitleToFilename collapses some near-duplicates — e.g. Tech_ variants — into the same filename; the last write wins).

Plan threshold ≥100 on-disk tid files: **344 ≥ 100 → pass (3.4×)**.

## Spot-Check Results

Filename patterns confirm each atomic generator produced live tiddlers:

```
# Person tiddlers — capitalized personal names and anonymized Role @ Org fallbacks
$ ls tiddlywiki/tiddlers/ | grep -E '^[A-Z].*\.tid' | head -5
(many; mixed with Exhibit/Home/etc.)

# Technology tiddlers — Tech_ prefix (colon→underscore in filename)
$ ls tiddlywiki/tiddlers/ | grep -E '^Tech_' | head -5
Tech_ 10-year relationship_ Windows 10 eLearning.tid
Tech_ AI code interpreter).tid
Tech_ AICC (HACP protocol).tid
Tech_ AICC (reference implementation for HTTP-based patterns).tid
Tech_ AICC.tid

# Testimonial tiddlers — Testimonial_ prefix
$ ls tiddlywiki/tiddlers/ | grep -E '^Testimonial_' | head -5
Testimonial_ (anonymous).tid
Testimonial_ Chief of Learning Services, Electric….tid
Testimonial_ Chief of Learning Services, Metrics,….tid
Testimonial_ Director of Learning Technologies, GP….tid
Testimonial_ GP Strategies (Energy Sector).tid

# Finding tiddlers — "Exhibit X Finding" prefix (colon→underscore)
$ ls tiddlywiki/tiddlers/ | grep -E '^Exhibit [A-Z] Finding' | head -5
Exhibit A Finding_ Bulk SCORM import not available.tid
Exhibit A Finding_ HTML5 courses failing under AICC protocol.tid
Exhibit A Finding_ No tools to verify SCORM data flow.tid
Exhibit A Finding_ Quiz bookmarking and reset failures.tid
Exhibit A Finding_ SCORM courses dependent on Cornerstone Network Player.tid

# Combined atomic-file count (Tech_ + Testimonial_ + Exhibit * Finding)
$ ls tiddlywiki/tiddlers/ | grep -cE "^Tech_|^Testimonial_|^Exhibit [A-Z] Finding"
247
```

Plan acceptance threshold (≥3 atomic tiddler files): **247 ≥ 3 → pass**.

## Decisions Made

1. **Plan said `import type { PersonnelEntry }`; used `import { type PersonnelEntry }` instead.** The acceptance grep literal is `type PersonnelEntry`, which does not match `import type { PersonnelEntry }` because of the intervening `{ ` characters. Used the inline-type-import form to satisfy the literal regex; semantically identical (erased at build time).
2. **PersonnelEntry sourced from `./extractors/types.ts`, not `./generators/types.ts`.** Both re-export the same symbol, but the extractors path is the canonical definition site and matches the plan directive.
3. **No new test file.** The wiring is 4 function calls + 1 for-of grouping loop; the generators are already unit-tested in Phase 54. End-to-end coverage arrives with Plan 55-07's smoke gate. Plan explicitly instructed "pure glue code — no test file".
4. **Insertion order between exhibits and FAQ.** Atomic tiddlers conceptually sit between exhibits (which link into them via Plan 55-03 footer) and FAQ (which doesn't). Tiddlers[] literal order: meta → pages → case-files-index → exhibits-with-footer → atomic (person/finding/technology/testimonial) → faq-index → faq-items.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocker] Plan-specified `import type { PersonnelEntry }` did not satisfy acceptance grep**
- **Found during:** Task 1 post-write verification (running plan's own acceptance grep list).
- **Issue:** Plan body says `import type { PersonnelEntry } from './extractors/types.ts'`, but the acceptance criterion reads `grep -q "type PersonnelEntry" scripts/tiddlywiki/generate.ts`. The literal sequence "type PersonnelEntry" does not appear in `import type { PersonnelEntry } …` because the tokens are separated by ` { `. Running the grep as written returned MISS.
- **Fix:** Swapped to `import { type PersonnelEntry } from './extractors/types.ts'` — inline-type-import syntax. Functionally identical (type-only import, erased at build), matches the acceptance grep, and the `type` keyword explicitly marks the symbol as type-only for TS consistency.
- **Files modified:** `scripts/tiddlywiki/generate.ts` (swap on a single line).
- **Verification:** `grep -q "type PersonnelEntry" scripts/tiddlywiki/generate.ts && echo OK` → OK. Build + tests + generate all re-run green.
- **Committed in:** `6c38766` (single-commit task; the swap landed before the atomic commit).

---

**Total deviations:** 1 auto-fixed (1 Rule 3 blocker — acceptance-criterion / plan-body text mismatch).
**Impact on plan:** Zero behavior change; only the import-statement word order changed. All acceptance grep assertions now pass.

## Issues Encountered

None blocking. Build, test, and generate all passed on first composed run. The one deviation above was a plan-grep-vs-plan-code consistency fix, not a code defect.

## User Setup Required

None.

## Verification Results

```
$ pnpm build
(exit 0 — vue-tsc + vite + markdown export)

$ pnpm test:scripts
 Test Files  41 passed (41)
      Tests  548 passed (548)
(exit 0)

$ pnpm tiddlywiki:generate
[tiddlywiki:generate] Wrote 367 tiddlers → …/tiddlywiki/tiddlers
                      3 meta, 5 pages, 16 exhibits, 25 FAQ
                      64 persons, 45 findings, 188 technologies, 21 testimonials
(exit 0)

$ ls tiddlywiki/tiddlers/ | wc -l
344   # >= 100 ✓

$ ls tiddlywiki/tiddlers/ | grep -cE "^Tech_|^Testimonial_|^Exhibit [A-Z] Finding"
247   # >= 3 ✓

$ grep -q "from './generators/person.ts'" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "from './generators/finding.ts'" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "from './generators/technology.ts'" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "from './generators/testimonial.ts'" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "type PersonnelEntry" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "clientByLabel" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "\.\.\.personTiddlers" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "\.\.\.findingTiddlers" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "\.\.\.technologyTiddlers" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "\.\.\.testimonialTiddlers" scripts/tiddlywiki/generate.ts && echo OK
OK
$ grep -q "for (const client of Array.from" scripts/tiddlywiki/generate.ts && echo OK
OK
$ ! grep -q "Promise\.all" scripts/tiddlywiki/generate.ts && echo OK
OK
$ ! grep -nE "setTimeout\(|Date\.now\(|new Date\(|Promise\.all\(" scripts/tiddlywiki/generate.ts && echo OK
OK  # SCAF-08 clean

# Untouched-files check
$ git diff HEAD~1 -- scripts/tiddlywiki/sources.ts | wc -l
0
$ git diff HEAD~1 -- scripts/tiddlywiki/extract-all.ts | wc -l
0
$ git diff HEAD~1 -- scripts/tiddlywiki/page-content-to-tiddlers.ts | wc -l
0
$ git diff HEAD~1 -- scripts/tiddlywiki/html-to-wikitext.ts | wc -l
0
$ git diff HEAD~1 -- scripts/tiddlywiki/tid-writer.ts | wc -l
0
$ git diff --name-only HEAD~1 -- scripts/tiddlywiki/extractors/ | wc -l
0
$ git diff --name-only HEAD~1 -- scripts/tiddlywiki/generators/ | wc -l
0
```

All plan acceptance criteria pass.

## Next Phase Readiness

- **ATOM-01..04 now live on the default path.** Person / Finding / Technology / Testimonial tiddlers land on disk every time `pnpm tiddlywiki:generate` runs.
- **Plan 55-03's cross-link footer resolves.** The `[[Jane Doe]]` / `[[Exhibit A Finding: …]]` / `[[Tech: …]]` / `[[Testimonial: …]]` links emitted by `exhibitsToTiddlers` now point at tiddlers that exist in the output corpus. Any remaining orphans trace to data-quality issues (empty-name personnel, malformed attributions) — out of scope for Plan 55-04 and noted in Plan 55-03's SUMMARY under data-normalization deferral.
- **Plan 55-07 smoke gate unblocked.** The gate can now run `verifyCrossLinkIntegrity(tiddlers).orphans.length === 0` against the full 367-tiddler corpus. If the assertion fails post-Plan-55-07, the orphans will fall into either (a) data-quality pockets in extractor output (empty-name personnel) or (b) exhibit-body links not rewritten by Plan 55-02/03 — both Plan 55-07 diagnostic scope.
- **Phase boundary held.** Only `scripts/tiddlywiki/generate.ts` touched. Extractors, generators, sources, extract-all, page-content-to-tiddlers, html-to-wikitext, tid-writer all unchanged. Plans 55-05 (FAQ footer) and 55-06 (case-files table) can consume `bundle.*` keys from this state as-is.

## Self-Check: PASSED

- `scripts/tiddlywiki/generate.ts` — FOUND on disk (modified; new imports + composition block + stdout line)
- `.planning/phases/55-iter-1-fixes/55-04-SUMMARY.md` — FOUND on disk
- Commit `6c38766` — FOUND in git log (Task 1: atomic tiddler generator wiring)
- Spot-check: `Tech_AICC.tid`, `Testimonial_ (anonymous).tid`, `Exhibit A Finding_ Bulk SCORM import not available.tid` all present in `tiddlywiki/tiddlers/`
- Plan threshold `ls tiddlywiki/tiddlers/ | wc -l >= 100` → 344
- Plan threshold `grep -cE "^Tech_|^Testimonial_|^Exhibit [A-Z] Finding" >= 3` → 247
- `pnpm test:scripts` → 548/548 green
- `pnpm build` → exit 0
- `pnpm tiddlywiki:generate` → exit 0

---
*Phase: 55-iter-1-fixes*
*Completed: 2026-04-21*
