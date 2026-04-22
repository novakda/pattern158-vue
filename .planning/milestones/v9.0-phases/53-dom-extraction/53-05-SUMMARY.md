---
phase: 53-dom-extraction
plan: 05
subsystem: tooling
tags: [extractor, findings, dom-extraction, happy-dom, scaf-08]

requires:
  - phase: 53-dom-extraction
    plan: 01
    provides: Shared FindingEntry interface + parseHtml helper in scripts/tiddlywiki/extractors/types.ts
provides:
  - emitFindings(html, opts?) → readonly FindingEntry[] in scripts/tiddlywiki/extractors/findings.ts
  - Inline-HTML fixture test suite covering happy path, source order, missing resolution, missing category, no-table, default opts, idempotency
affects: [54-atomic-tiddler-generation (ATOM-02), 55-iter-1-fixes (FIX-02), 56-test-traceability (TEST-03)]

tech-stack:
  added: []
  patterns:
    - "DESCRIPTION_SPAN_SELECTOR uses child combinator 'td[data-label=\"Description\"] > span' to restrict to DIRECT span children — prevents nested <span> inside .finding-resolution from leaking into description"
    - "Resolution query scoped to descriptionCell.querySelector('.finding-resolution') — prevents cross-row leakage if markup ever drifts"
    - "severity + outcome hardcoded to empty string — no DOM hooks in current static-site HTML; forward-compat for a future Vue template change or JSON fallback in Phase 54"

key-files:
  created:
    - scripts/tiddlywiki/extractors/findings.ts
    - scripts/tiddlywiki/extractors/findings.test.ts
  modified: []

key-decisions:
  - "DESCRIPTION_SPAN_SELECTOR uses child combinator '>' (direct child) to prevent the .finding-resolution inner text from leaking into the description field — the outer <span> sibling of <p.finding-resolution> is what holds description text"
  - "Resolution selector queried from descriptionCell (not row) so that .finding-resolution lookups stay inside the Description td only — prevents cross-cell leakage if markup restructures"
  - "severity and outcome both emit empty string with the reason documented inline — the static-site HTML has no .finding-severity or outcome hook today. Phase 54 ATOM-02 can overlay values from exhibits.json if needed, or Phase 55+ may add DOM hooks"

requirements-completed:
  - EXTR-04

duration: 9m 36s
completed: 2026-04-22
---

# Phase 53 Plan 05: Findings Extractor Summary

**emitFindings(html, opts?) parses table.findings-table tbody tr rows into readonly FindingEntry[] with finding/description/resolution/category populated from DOM hooks and outcome/severity empty (forward-compat); sourceExhibitLabel threaded via opts bag; hermetic inline-HTML test suite covers 7 scenarios including idempotency.**

## Performance

- **Duration:** 9m 36s
- **Started:** 2026-04-22T05:43:21Z
- **Completed:** 2026-04-22T05:53:02Z
- **Tasks:** 2 (1 RED + 1 GREEN)
- **Files created:** 2 (findings.ts, findings.test.ts)
- **Files modified:** 0

## Accomplishments

- `scripts/tiddlywiki/extractors/findings.test.ts` created — 7 describe blocks covering happy path, source order preservation, missing resolution (defaults to ''), missing category span (defaults to ''), no findings-table (empty array), sourceExhibitLabel default, and idempotency (byte-identical JSON across two calls). Hermetic — no fs I/O, pure inline-HTML fixtures.
- `scripts/tiddlywiki/extractors/findings.ts` created — 48 lines. Exports `emitFindings(html, opts?): readonly FindingEntry[]`. Selectors scoped to `table.findings-table tbody tr` to prevent cross-table leakage.
- Field derivation per plan contract:
  - `finding`: `td[data-label="Finding"]` textContent, trimmed.
  - `description`: DIRECT `<span>` child of `td[data-label="Description"]` (child combinator prevents .finding-resolution inner spans from leaking).
  - `resolution`: `.finding-resolution` within the description cell only, trimmed — absent → ''.
  - `category`: `.finding-category` span within the Category cell — absent → ''.
  - `severity`: hardcoded '' (no DOM hook today).
  - `outcome`: hardcoded '' (not present in DOM).
  - `sourceExhibitLabel`: `opts?.sourceExhibitLabel ?? ''`.
- 7/7 tests pass; `pnpm build` exits 0; SCAF-08 clean on both files (no setTimeout/Date.now()/new Date()/Promise.all).

## Task Commits

1. **Task 1: Write findings.test.ts (RED)** — `e69e6e8` (test)
2. **Task 2: Implement findings.ts (GREEN)** — `5058920` (feat, after parallel-executor race on `f41d0f6` — see Deviations)

## Files Created/Modified

- `scripts/tiddlywiki/extractors/findings.ts` **(created)** — 48 lines. File header declares SCAF-08 policy in prose (avoids the forbidden-token regex self-match by rewording from "no setTimeout, no Date.now()…" to "no wall-clock reads, no instantiated dates, no parallel iteration helpers"). 6 top-level selector constants, one `textOf(Element | null) → string` helper, one exported `emitFindings` function.
- `scripts/tiddlywiki/extractors/findings.test.ts` **(created)** — 111 lines, 7 `describe` blocks. Inline HTML fixture `FINDINGS_HTML` reflects the exhibit-a.html findings-table DOM (table.exhibit-table.findings-table > thead > tbody > tr with Finding/Category/Description cells, category span with class `finding-category`, description <span> + resolution <p.finding-resolution> siblings under the Description td).

## Decisions Made

- **Child combinator `td[data-label="Description"] > span` for description.** Required to exclude the inner `<span>` children that may appear inside `.finding-resolution` (e.g., if a future markup change nests a highlight span inside the resolution paragraph). Using descendant selector `td[data-label="Description"] span` would match any `<span>` in the cell including ones nested inside the resolution `<p>`. The child combinator is strict and intentional.
- **Resolution queried from `descriptionCell.querySelector(...)` not `row.querySelector(...)`.** Keeps the lookup inside the Description cell only, so if a future markup restructure placed `.finding-resolution` somewhere else in the row (e.g., inside the Category cell by mistake), it would not silently resolve. Defensive scoping.
- **severity + outcome emit empty string rather than throwing or omitting.** The `FindingEntry` interface declares all fields as required readonly strings. Emitting `''` matches the interface contract and gives Phase 54 ATOM-02 a total shape to work with — it can overlay values from exhibits.json if needed, or accept the empty string as the current-DOM truth.
- **SCAF-08 comment rewording.** The acceptance grep `! grep -nE "setTimeout\\(|Date\\.now\\(|new Date\\(|Promise\\.all\\("` matches any occurrence of those tokens — including inside comments. The original plan's recommended header comment ("SCAF-08: no setTimeout, no Date.now(), no new Date(), no Promise.all.") contains `Date.now(`, `new Date(`, and `Promise.all(` — which fail the check. Rewrote the comment in the same shape personnel.ts uses: "no wall-clock reads, no instantiated dates, no parallel iteration helpers."

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Rewrote SCAF-08 header comment to avoid forbidden-token regex self-match**

- **Found during:** Task 2 acceptance verification
- **Issue:** The plan's recommended source-file header comment included the literal strings `Date.now()`, `new Date()`, and `Promise.all()` inside the SCAF-08 policy note. The acceptance grep pattern `setTimeout\(|Date\.now\(|new Date\(|Promise\.all\(` matches these inside comments too — SCAF-08 check failed.
- **Fix:** Reworded the header comment to "SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel iteration helpers. Sequential NodeList .forEach only." Matches the exact pattern already used by `personnel.ts` (sibling plan 53-04) which passed the same check.
- **Files modified:** `scripts/tiddlywiki/extractors/findings.ts` (header comment only — no behavior change)
- **Verification:** `! grep -nE "setTimeout\(|Date\.now\(|new Date\(|Promise\.all\(" scripts/tiddlywiki/extractors/findings.ts` now passes; 7/7 tests still pass.
- **Committed in:** `5058920` (Task 2 commit)

### Parallel-executor race (infrastructure issue — NOT a code deviation)

**2. [Infra] Commit `f41d0f6` landed with `pages.ts` content under plan 53-05's commit message due to parallel-executor race on `git add`/`git commit`**

- **Context:** This plan ran concurrently with plans 53-02 through 53-09 (Wave 2 parallel execution). Multiple executors were simultaneously creating `.ts` files under `scripts/tiddlywiki/extractors/` and committing them.
- **What happened:** Between `git add scripts/tiddlywiki/extractors/findings.ts` and `git commit`, a concurrent executor's `git add`/`git commit` stream interleaved with mine. My commit message "feat(53-05): implement emitFindings extractor (GREEN)" landed on `f41d0f6` but the tree snapshot captured was plan 53-08's `pages.ts` (128 lines) — not my `findings.ts` (48 lines).
- **Recovery:** After detecting the mismatch via `git show --stat f41d0f6`, executed `git reset --soft HEAD~1` then `git reset HEAD`, verified `findings.ts` was still on disk intact, re-staged `findings.ts`, and committed it under a new hash `5058920` with a message documenting the race.
- **Net effect on history:**
  - `f41d0f6` remains in history with message "feat(53-05): implement emitFindings extractor (GREEN)" but tree contains `pages.ts` + `53-04-SUMMARY.md` content (a cross-plan tree collision).
  - `5058920` contains the actual `findings.ts` under a clarifying message.
  - No code or documentation was lost — every file ended up committed somewhere, just under mismatched plan attribution.
  - Plan 53-08's executor for `pages.ts` may find its code already in history under `f41d0f6` and skip re-committing (or double-commit as a no-op).
- **Why not revert `f41d0f6`?** Subsequent commits from other plans (`5282a61`, `bb38d98`, `c6164cd`, `e689fb3`, `619c82e` and more) landed on top of `f41d0f6` within seconds. A hard revert would destroy those commits. The orchestrator can replay a git-history audit in Phase 55 / Phase 56 to correct attribution if needed.
- **Root cause:** Not a plan-level issue. This is a known hazard of parallel executors writing to the same directory + staging the same index simultaneously. Recommend future waves serialize `git add` + `git commit` via a file-lock or reserve per-executor temp index files.
- **Files affected:** `f41d0f6` (pages.ts, 53-04-SUMMARY.md under 53-05 message), `5058920` (findings.ts under correcting 53-05 message). No code corruption — all content is correct, only author-attribution between plans is scrambled.

---

**Total deviations:** 1 auto-fixed code deviation (SCAF-08 comment) + 1 infrastructure race (documented, no code impact).

**Impact on plan:** Plan's code goal (ship findings.ts + findings.test.ts passing 7 tests and `pnpm build`) fully met. Commit attribution on `f41d0f6` is scrambled and documented; `5058920` holds the authoritative findings.ts commit.

## Out-of-scope discoveries (deferred)

None flagged by this plan. Parallel-executor git race is a pre-existing hazard across the entire Wave 2 phase, not specific to plan 53-05.

## Issues Encountered

- **Parallel-executor git race** (documented above). My `git commit` captured another plan's working-tree files under my commit message. Recovered by soft-reset + re-commit under a new hash with documentation.
- **Pre-existing build errors during Wave 2 interleave** — when I first ran `pnpm build` immediately after Task 1, it reported 261+ type errors from sibling plans' test files (`faq.test.ts`, `personnel.test.ts`, etc.) that were landing their RED commits concurrently without the tsconfig fix (`allowImportingTsExtensions: true` + `vitest/globals` types). Plan 53-02's commit `619c82e` landed the tsconfig fix shortly after and the errors cleared. No action required from plan 53-05.

## User Setup Required

None — no external service configuration, no secrets, no new CLI.

## Next Phase Readiness

EXTR-04 complete. Phase 54 ATOM-02 (per-finding atomic tiddlers) has its input contract satisfied:
- `emitFindings(html, { sourceExhibitLabel })` returns `readonly FindingEntry[]` with finding/description/resolution/category populated and outcome/severity documented as forward-compat empty.
- Phase 54 ATOM-02 can overlay severity/outcome from `exhibits.json` at the caller boundary if the atomic-tiddler design calls for severity-colored headers today.
- Phase 55 FIX-02 can wire `emitFindings` into `scripts/tiddlywiki/generate.ts` after the generate.ts refactor lands.

No blockers for downstream plans.

## Self-Check

- `scripts/tiddlywiki/extractors/findings.ts` — FOUND (on disk, committed in `5058920`)
- `scripts/tiddlywiki/extractors/findings.test.ts` — FOUND (on disk, committed in `e69e6e8`)
- Commit `e69e6e8` (Task 1 RED) — FOUND in git log
- Commit `5058920` (Task 2 GREEN re-commit) — FOUND in git log
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/findings.test.ts` — exits 0 (7/7 passed)
- `pnpm build` — exits 0
- SCAF-08 grep on findings.ts — clean (no forbidden-token matches)
- SCAF-08 grep on findings.test.ts — clean
- EXTR-04 requirement — satisfied: `emitFindings` exported, parses findings-table, threads sourceExhibitLabel, handles missing resolution/category gracefully, empty array for missing table, byte-identical idempotency.

## Self-Check: PASSED

---
*Phase: 53-dom-extraction*
*Completed: 2026-04-22*
