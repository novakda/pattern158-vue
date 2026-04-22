---
phase: 55-iter-1-fixes
plan: 07
subsystem: tiddlywiki-generator
tags: [smoke-gate, verification, integrity-check, wave-7, blocked, composeAllTiddlers]

# Dependency graph
requires:
  - phase: 55-iter-1-fixes
    plan: 01
    provides: extractAll + ExtractedBundle — consumed by composeAllTiddlers as input argument and by verify-integrity.ts directly
  - phase: 55-iter-1-fixes
    plan: 02
    provides: pageContentToTiddlers — composed alongside other generators inside composeAllTiddlers
  - phase: 55-iter-1-fixes
    plan: 03
    provides: exhibitsToTiddlers with ExhibitsToTiddlersContext — invoked inside composeAllTiddlers with bundle entity data
  - phase: 55-iter-1-fixes
    plan: 04
    provides: atomic tiddler wiring (person/finding/technology/testimonial generators) — now lifted into composeAllTiddlers
  - phase: 55-iter-1-fixes
    plan: 05
    provides: faqItemsToTiddlers with FaqFooterContext — called inside composeAllTiddlers
  - phase: 55-iter-1-fixes
    plan: 06
    provides: caseFilesIndexTiddler as sortable table — unchanged call signature, consumed as-is inside composeAllTiddlers
  - phase: 54-iter-1-generators
    plan: 07
    provides: verifyCrossLinkIntegrity(tiddlers) + Orphan shape — consumed by verify-integrity.ts as the audit predicate
provides:
  - composeAllTiddlers(input: ComposeInput): Tiddler[] — pure in-memory tiddler composer extracted from generate.ts main(); single source of truth for tiddler assembly order
  - ComposeInput interface — { bundle, exhibitsJson, faqItemsJson }
  - scripts/tiddlywiki/verify-integrity.ts — CLI smoke-gate that runs extractAll + composeAllTiddlers + verifyCrossLinkIntegrity in memory; exits 1 with deterministic orphan list on any [[target]] miss, exits 0 with tiddler count + zero-orphan line on clean corpus
  - tsconfig.scripts.json exclude for verify-integrity.ts (mirrors generate.ts / sources.ts exclusion)
  - .planning/phases/55-iter-1-fixes/55-VERIFICATION.md — phase-close verdict (FAILED)
  - .planning/phases/55-iter-1-fixes/55-ORPHAN-REPORT.md — NTSB-style root-cause report for the 14-unique-target orphan set
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure composer extraction: refactor main() I/O orchestration into three layers — (1) extractAll + readJson (I/O in), (2) composeAllTiddlers (pure compute), (3) writeTiddlerFile + writeTiddlywikiInfo + fsp.writeFile (I/O out). Enables in-memory audit script to share the compose layer verbatim."
    - "Smoke-gate CLI contract: import the pure compose function, run in-memory, assert via a dedicated audit function (verifyCrossLinkIntegrity), exit 1 with deterministic stderr lines on FAIL, exit 0 with one-line stdout on PASS. No partial results; no warnings; no mutation."
    - "Orphan-handling policy enforced: the plan explicitly forbids rewriting extractors/ or generators/ in Plan 55-07, so when orphans surfaced, surface upward via VERIFICATION + ORPHAN-REPORT instead of fixing in-place. Plan 55-07 ends as BLOCKED, not failed-silently."

key-files:
  created:
    - scripts/tiddlywiki/verify-integrity.ts
    - .planning/phases/55-iter-1-fixes/55-VERIFICATION.md
    - .planning/phases/55-iter-1-fixes/55-ORPHAN-REPORT.md
  modified:
    - scripts/tiddlywiki/generate.ts
    - tsconfig.scripts.json

key-decisions:
  - "composeAllTiddlers() extracted as the single source of truth for tiddler assembly order. Both generate.ts main() and verify-integrity.ts consume it; any future tiddler-assembly change lands in one place."
  - "ComposeInput argument bundles bundle + exhibitsJson + faqItemsJson into a single readonly record so callers pass one object instead of three positional args — easier to extend when FIX-related data grows (e.g. case-files-index might become an input)."
  - "Per-category atomic-count stdout line dropped from main() per plan authorization — total tiddler count + the new integrity gate cover the meaningful operator signal; keeping per-category counts would have required composeAllTiddlers to return a {tiddlers, counts} record and threaded the counts up, inflating the API surface for no gain."
  - "tsconfig.scripts.json exclude extended to cover verify-integrity.ts — mirrors the pattern Plan 55-03 applied for sources.test.ts. Required because verify-integrity.ts imports generate.ts, which is already excluded (vue-tsc cascades TS6307 through excluded-but-imported modules)."
  - "Orphan-handling policy enforced strictly: HARD GATE fails → write VERIFICATION.md (status=failed) + ORPHAN-REPORT.md with Option A/B/C fix menu → surface to developer → return PLAN BLOCKED. No scope-creep attempt to patch extractors/, generators/, or sources.ts."

patterns-established:
  - "Compose-then-write orchestration for generate scripts: pure compose function that returns the full output collection in memory, separated from the write-side helpers. Enables audit tools (verify-integrity, future byte-identical-across-runs assertion) to share the compose layer."
  - "ORPHAN-REPORT + VERIFICATION.md pairing on smoke-gate failure: VERIFICATION holds the verdict + smoke-gate exit codes + REQ coverage; ORPHAN-REPORT holds the root-cause analysis + fix menu. Both committed together when gate fails; ORPHAN-REPORT archived when gate turns green."

requirements-completed: []

# Metrics
duration: 6 min 19 sec
completed: 2026-04-22
---

# Phase 55 Plan 07: composeAllTiddlers + Integrity HARD GATE Summary

**Smoke-gate integrity audit shipped and RED — `composeAllTiddlers` extracted from `generate.ts` main() as the pure in-memory composer consumed by both the CLI and the new `scripts/tiddlywiki/verify-integrity.ts`. The integrity check runs cleanly but surfaces 267 orphaned `[[Exhibit Exhibit <letter>]]` links across 235 atomic tiddlers, all traceable to a cross-boundary (Phase 53 extractor + Phase 54 generator) title-schema mismatch that Plan 55-07 scope explicitly forbids fixing in-place. Plan ends as PLAN BLOCKED.**

## Performance

- **Duration:** 6 min 19 sec
- **Start:** 2026-04-22T08:28:11Z
- **End:** 2026-04-22T08:34:30Z
- **Tasks:** 2 (1 refactor+new-script, 1 verification doc)
- **Files created:** 3 (verify-integrity.ts, 55-VERIFICATION.md, 55-ORPHAN-REPORT.md)
- **Files modified:** 2 (generate.ts, tsconfig.scripts.json)

## Accomplishments

- **`composeAllTiddlers(input: ComposeInput): Tiddler[]` extracted + exported** from `scripts/tiddlywiki/generate.ts`. Pure function; assembles the full tiddler list from a bundle + two JSON inputs. `main()` now calls it and retains only disk-writing + stdout summary.
- **`ComposeInput` interface exported** — `{ bundle: ExtractedBundle, exhibitsJson: readonly ExhibitJson[], faqItemsJson: readonly FaqJsonItem[] }`.
- **`scripts/tiddlywiki/verify-integrity.ts` new** — 55-line smoke-gate CLI. Imports `extractAll`, `composeAllTiddlers`, `verifyCrossLinkIntegrity`, runs in memory, prints `[55-07] ORPHAN:` lines + `[55-07] FAIL: N orphaned link(s) across M tiddler(s).` on orphans → exit 1; prints `[55-07] PASS: N tiddlers, 0 orphaned links.` on clean → exit 0.
- **`tsconfig.scripts.json`** extended exclude list with `scripts/tiddlywiki/verify-integrity.ts` (mirrors generate.ts / sources.ts / sources.test.ts / html-to-wikitext.ts exclusions).
- **`pnpm build`** — exit 0.
- **`pnpm test:scripts --run`** — exit 0 (564 tests across 41 files — no new tests this plan; verify-integrity.ts is itself the test).
- **`pnpm tiddlywiki:generate`** — exit 0 (367 tiddlers composed; 344 `.tid` files on disk — same count as end-of-Plan-55-06, confirming no regression).
- **`pnpm tsx scripts/tiddlywiki/verify-integrity.ts`** — **exit 1, 267 orphaned links surfaced.** See "Integrity Gate Result" below.
- **Phase boundary held.** `git diff` confirms zero changes under `scripts/tiddlywiki/extractors/`, `scripts/tiddlywiki/generators/`, or to `sources.ts`, `sources.test.ts`, `extract-all.ts`, `extract-all.test.ts`, `page-content-to-tiddlers.ts`, `page-content-to-tiddlers.test.ts`, `html-to-wikitext.ts`, `tid-writer.ts`.
- **`55-VERIFICATION.md` committed** — status FAILED, all smoke-gate exit codes + FIX-01..04 REQ coverage + phase-boundary audit + orphan-gate result.
- **`55-ORPHAN-REPORT.md` committed** — root-cause diagnostic + Option A/B/C hotfix menu + affected-tiddler sample + unique-missing-targets listing.

## Integrity Gate Result (HARD GATE — RED)

```
$ pnpm tsx scripts/tiddlywiki/verify-integrity.ts
[55-07] ORPHAN: tiddler " @ GP Strategies" links to missing "Exhibit Exhibit A"
[55-07] ORPHAN: tiddler "Dan Novak" links to missing "Exhibit Exhibit A"
... (265 lines elided — see 55-ORPHAN-REPORT.md)
[55-07] FAIL: 267 orphaned link(s) across 235 tiddler(s).
```

- **Total orphan occurrences:** 267.
- **Source tiddlers affected:** 235 (atomic person/finding/technology/testimonial tiddlers).
- **Unique missing targets:** 14 — `Exhibit Exhibit A` through `Exhibit Exhibit N`.
- **Shape:** all orphans are `[[Exhibit Exhibit <letter>]]` doubled-prefix targets.
- **Root cause:** Plan 55-01's `extract-all.ts` populates `bundle.exhibits[*].label` and `sourceExhibitLabel` with **verbose** DOM-extracted labels (`"Exhibit A"`). Phase 54's `formatExhibitTitle(label)` assumes **short** labels and prefixes `"Exhibit "`. Composition yields `"Exhibit Exhibit A"`. Additionally, `exhibitsToTiddlers` titles exhibits as `"Exhibit A — <marketing title>"`, so even a single-prefix fix would not produce an on-disk match.
- **Fix location crosses Phase 53/54 boundary.** Plan 55-07 forbids modifications under `extractors/` or `generators/`. Surfacing upward.

See `.planning/phases/55-iter-1-fixes/55-ORPHAN-REPORT.md` for full text + Option A/B/C fix menu (recommended: Option C — alias tiddlers, which avoids Phase 53/54 module edits).

## Task Commits

1. **Task 1: composeAllTiddlers refactor + verify-integrity.ts** — `208d4e7` (feat)
2. **Task 2: 55-VERIFICATION.md + 55-ORPHAN-REPORT.md** — `81b6616` (docs)

## Tiddler Count on Disk

- **Before Phase 55 (pre-Plan-55-01):** ~25
- **After Plan 55-02 (FIX-02):** 49 (page wikitext cleaned, no atomic-tiddler growth yet)
- **After Plan 55-03 (FIX-01):** 49 (exhibit walker fix + cross-link footer; no new tiddlers)
- **After Plan 55-04 (atomic wiring):** 344 (person/finding/technology/testimonial emission)
- **After Plan 55-05 (FIX-03):** 344 (FAQ footer enrichment — body-only change)
- **After Plan 55-06 (FIX-04):** 344 (Case Files Index shape change — body-only)
- **After Plan 55-07 (this plan):** **344** (integrity audit only; no new tiddlers emitted; `composeAllTiddlers` produces 367 in memory, tid-writer collapses to 344 on disk as documented in Plan 55-04 SUMMARY)

Tiddler-count threshold (≥ 100) is met 3.4×.

## Files Created/Modified

- `scripts/tiddlywiki/generate.ts` (modified) — `composeAllTiddlers` + `ComposeInput` now top-level exports; `main()` body trimmed from ~96 lines to ~36 lines (compose call + write loop + summary). Per-category atomic-count stdout line dropped per plan authorization.
- `scripts/tiddlywiki/verify-integrity.ts` (new, 55 lines) — imports `extractAll`, `composeAllTiddlers`, `verifyCrossLinkIntegrity`. No new dependencies; no JSDoc; SCAF-08 grep clean.
- `tsconfig.scripts.json` (modified) — added `verify-integrity.ts` to excludes.
- `.planning/phases/55-iter-1-fixes/55-VERIFICATION.md` (new) — status `failed`, all smoke-gate exit codes + REQ coverage + phase boundary audit + orphan gate result.
- `.planning/phases/55-iter-1-fixes/55-ORPHAN-REPORT.md` (new) — root cause diagnostic + 14-unique-target listing + Option A/B/C fix menu + sample affected-tiddler table + next-actions block.

## Decisions Made

1. **composeAllTiddlers as pure composer.** Not a class method, not a generator function, not a streaming API. Takes one `ComposeInput` record, returns `Tiddler[]`. Keeps the audit script trivially independent of disk-writing side effects.
2. **Dropped per-category atomic stdout line.** The plan explicitly authorized this decision. Alternative considered: have `composeAllTiddlers` return `{ tiddlers, counts }` so main() could still print per-category totals. Rejected — inflates the API surface just for a cosmetic stdout line, and the integrity gate is the load-bearing operator signal now.
3. **Surfaced orphans per policy, did not auto-fix.** The plan's `<orphan-handling-policy>` block explicitly forbids rewriting extractors/generators/sources.ts in Plan 55-07 on the grounds that the fix crosses phase boundaries. Plan 55-07's role is the detection machinery + surfacing; the actual fix is a future plan's work. Logged full diagnostic + Option A/B/C menu in 55-ORPHAN-REPORT.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocker] Extend `tsconfig.scripts.json` excludes to cover `verify-integrity.ts`**
- **Found during:** Task 1 Step C (`pnpm build` after creating verify-integrity.ts)
- **Issue:** `vue-tsc` surfaced TS6307 cascading: `verify-integrity.ts` imports `generate.ts` (excluded); the cascade also re-detected `sources.ts` and `html-to-wikitext.ts` through the import graph. Build failed exit 2.
- **Root cause:** Same mechanism that forced Plan 55-03 to exclude `sources.test.ts`. When a tsconfig include file imports from an excluded file, TS cascades TS6307 through every module in the transitive import graph.
- **Fix:** Added `"scripts/tiddlywiki/verify-integrity.ts"` to the `exclude` array in `tsconfig.scripts.json`. One-line change, exactly mirrors the established Plan 55-03 pattern.
- **Files modified:** `tsconfig.scripts.json`
- **Verification:** `pnpm build` re-run → exit 0. Full test suite 564/564. Plan acceptance criteria `pnpm build` now passes.
- **Committed in:** `208d4e7` (Task 1 commit)

**Note on plan frontmatter:** `files_modified` listed only `verify-integrity.ts` + `55-VERIFICATION.md`. The tsconfig modification + generate.ts refactor were both covered by the plan body (action Step A + Interfaces spec). Logging here for completeness.

### HARD GATE Result (not a deviation — expected policy outcome)

**Integrity gate: FAILED (267 orphans).** This is the plan's hard-gate assertion; a non-zero orphan count is the plan's explicit halt condition. Per plan's `<orphan-handling-policy>`:

- Plan 55-07 does NOT attempt to fix orphans (would require touching Phase 53/54-locked modules).
- 55-VERIFICATION.md status set to `failed`.
- 55-ORPHAN-REPORT.md written with full diagnostic + Option A/B/C hotfix menu.
- Plan returns `PLAN BLOCKED` to orchestrator.

This is policy-compliant, not a deviation. Recording here to make the signal unmistakable.

---

**Total deviations:** 1 auto-fixed (Rule 3 blocker: tsconfig exclude).
**Impact:** Exclude change unblocks build; mirrors existing Phase 55-03 precedent; no semantic change to type-checking scope for any file actually type-checked by `pnpm build`.

## Issues Encountered

**Primary issue: 267 orphaned links (HARD GATE FAIL).** See "Integrity Gate Result" above and `55-ORPHAN-REPORT.md`. This is the surfaced blocker; Phase 55 cannot close until resolved.

Secondary (resolved): tsconfig TS6307 cascade on first build — fixed per Deviation §1.

## User Setup Required

None.

## Next Phase Readiness

**Phase 55 is NOT closable.** Required sequence:

1. Author hotfix plan (suggested: Phase 55.1-hotfix or fold into Phase 56 TEST work) implementing Option C (alias tiddlers) or Option A/B per ORPHAN-REPORT.
2. Hotfix plan re-runs `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` — must exit 0 with zero orphans on the live corpus.
3. Amend `55-VERIFICATION.md` status `failed` → `passed`. Archive `55-ORPHAN-REPORT.md`.
4. Then proceed to Phase 56 — Tests (TEST-01..04) as originally planned.

## Verification Results (final)

```
$ pnpm build
  ✓ built in ~760ms (vue-tsc + vite build + markdown export all exit 0)

$ pnpm test:scripts --run
  Test Files  41 passed (41)
  Tests       564 passed (564)

$ pnpm tiddlywiki:generate
  [tiddlywiki:generate] Wrote 367 tiddlers → tiddlywiki/tiddlers
                        3 meta, 5 pages, 16 exhibits, 25 FAQ

$ ls tiddlywiki/tiddlers/ | wc -l
  344

$ pnpm tsx scripts/tiddlywiki/verify-integrity.ts
  [55-07] ORPHAN: ... (267 lines)
  [55-07] FAIL: 267 orphaned link(s) across 235 tiddler(s).
  # exit 1

$ git log --oneline -3
  81b6616 docs(55-07): Phase 55 verification — FAIL, 267 orphaned links
  208d4e7 feat(55-07): extract composeAllTiddlers + add integrity audit script (Plan 55-07)
  2d0a1a1 docs(55-06): complete Case Files Index table plan (FIX-04)
```

## Self-Check: PASSED (files/commits) — BLOCKED (hard gate)

- `scripts/tiddlywiki/verify-integrity.ts` — FOUND on disk
- `scripts/tiddlywiki/generate.ts` — FOUND on disk (modified; `composeAllTiddlers` + `ComposeInput` both exported)
- `tsconfig.scripts.json` — FOUND on disk (includes `verify-integrity.ts` in excludes)
- `.planning/phases/55-iter-1-fixes/55-VERIFICATION.md` — FOUND on disk (status: failed)
- `.planning/phases/55-iter-1-fixes/55-ORPHAN-REPORT.md` — FOUND on disk
- Commit `208d4e7` — FOUND in git log (Task 1 feat)
- Commit `81b6616` — FOUND in git log (Task 2 docs)
- Acceptance-criteria grep suite — 8/8 token checks passed (composeAllTiddlers export, ComposeInput export, composeAllTiddlers call, verify-integrity.ts exists, verify imports composeAllTiddlers + verifyCrossLinkIntegrity, PASS + ORPHAN prefix literals)
- SCAF-08 grep clean on generate.ts + verify-integrity.ts (no `setTimeout(`, `Date.now(`, `new Date(`, `Promise.all(`)
- Phase boundary confirmed — 0 files changed under `extractors/`, `generators/`, or in `sources.ts`, `sources.test.ts`, `extract-all.ts`, `extract-all.test.ts`, `page-content-to-tiddlers.ts`, `page-content-to-tiddlers.test.ts`, `html-to-wikitext.ts`, `tid-writer.ts`
- **HARD GATE — `pnpm tsx scripts/tiddlywiki/verify-integrity.ts`: FAIL (267 orphans)** — this is the blocking condition; detection + reporting machinery verified healthy.

---

*Phase: 55-iter-1-fixes*
*Completed: 2026-04-22 (BLOCKED on hotfix — integrity gate RED)*
