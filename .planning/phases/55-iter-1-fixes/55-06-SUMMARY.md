---
phase: 55-iter-1-fixes
plan: 06
subsystem: tiddlywiki-sources
tags: [fix-04, case-files, table, sources]
requirements: [FIX-04]
dependencies:
  requires: [55-01, 55-02, 55-03, 55-04, 55-05]
  provides: [case-files-index-table]
  affects: [tiddlywiki/tiddlers/Case Files Index.tid]
tech_stack:
  added: []
  patterns: [module-scope-helpers, pure-sort-slice, label-ascending-order]
key_files:
  created: []
  modified:
    - scripts/tiddlywiki/sources.ts
    - scripts/tiddlywiki/sources.test.ts
decisions:
  - "Case Files Index body is a 4-column TiddlyWiki table: Date | Client | Type | Case"
  - "Rows sorted by label ascending via .slice().sort(compareByLabel) — deterministic output"
  - "typeCellFor mapping: investigation-report -> Investigation, engineering-brief -> Brief, else passthrough (defensive fallback)"
  - "iter-1 JSDoc above caseFilesIndexTiddler replaced with a single-line comment per codebase convention (no JSDoc)"
  - "caption line locked verbatim: 'All case files in a sortable table. Click a column header in TiddlyWiki to sort; filter by tag to narrow (tags: investigation-report, engineering-brief, {client}).'"
  - "Tiddler title 'Case Files Index' and tags [page, case-files] preserved unchanged"
metrics:
  duration: "2m 22s"
  completed: "2026-04-22"
  tasks: 1
  files: 2
---

# Phase 55 Plan 06: Case Files Index as Sortable Table (FIX-04) Summary

FIX-04 shipped: the `Case Files Index` tiddler body is now a label-sorted TiddlyWiki table (Date / Client / Type / Case) instead of the iter-1 bulleted two-section list (Investigation Reports / Engineering Briefs). Sortable and filterable in the TiddlyWiki renderer per the locked v9.0 requirement.

## Changes

### `scripts/tiddlywiki/sources.ts`

1. Removed iter-1 JSDoc block (`/** Generate a "Case Files Index" tiddler listing every exhibit by type. */`) above `caseFilesIndexTiddler`. Replaced with a single-line comment: `// Case Files Index tiddler — sortable table of every exhibit row (FIX-04).`
2. Added two module-scope helper functions (not exported) above `caseFilesIndexTiddler`:
   - `typeCellFor(exhibitType: string): string` — maps `investigation-report` → `Investigation`, `engineering-brief` → `Brief`, else passes through verbatim (defensive fallback for unknown/future types).
   - `compareByLabel(a: ExhibitJson, b: ExhibitJson): number` — lexicographic compare on `.label` returning -1 / 0 / 1 (standard Array.sort comparator shape).
3. Rewrote the body of `caseFilesIndexTiddler`:
   - Sort input via `exhibits.slice().sort(compareByLabel)` — `.slice()` over the readonly input preserves SCAF-08 immutability.
   - Build rows with `|${ex.date} |${ex.client} |${typeCellFor(ex.exhibitType)} |${caseLink} |` where `caseLink = `[[${ex.label} — ${ex.title}]]``.
   - Assemble text: caption sentence + blank line + header row `|!Date |!Client |!Type |!Case |` + newline + joined rows + trailing newline.
   - Tiddler metadata (`title`, `type`, `tags`, `fields.created`, `fields.modified`) unchanged.

### `scripts/tiddlywiki/sources.test.ts`

Added `caseFilesIndexTiddler` to the imports from `./sources.ts` (was previously unimported; Plan 55-03 / 55-05 scope did not touch this function). Appended 8 new describe blocks at the bottom of the file:

| # | Describe block | What it locks |
|---|----------------|---------------|
| 1 | header row | Literal `\|!Date \|!Client \|!Type \|!Case \|` appears in body |
| 2 | data row shape | `\|2024 \|Acme \|Investigation \|[[A — Sample]] \|` emitted |
| 3 | type cell mapping | `investigation-report` → `Investigation`, `engineering-brief` → `Brief` |
| 4 | unknown type falls through | `other` → `other` (defensive fallback, no throw) |
| 5 | sort order by label | Input `[C, A, B]` yields body order `A`, `B`, `C` |
| 6 | iter-1 bulleted format removed | No `! Investigation Reports`, `! Engineering Briefs`, or `* [[A — Sample]]` |
| 7 | caption | Body starts with `All case files in a sortable table.` |
| 8 | tiddler metadata preserved | `title === 'Case Files Index'`; tags contain `page` and `case-files` |

**Before:** 16 describe blocks (Plans 55-03 + 55-05).
**After:** 24 describe blocks. All 24 pass.

## Verification

```text
$ pnpm test:scripts --run scripts/tiddlywiki/sources.test.ts
 Test Files  1 passed (1)
      Tests  24 passed (24)

$ pnpm test:scripts
 Test Files  41 passed (41)
      Tests  564 passed (564)

$ pnpm build
✓ built in 746ms

$ pnpm tiddlywiki:generate
[tiddlywiki:generate] Wrote 367 tiddlers → /home/xhiris/projects/pattern158-vue/tiddlywiki/tiddlers
                      3 meta, 5 pages, 16 exhibits, 25 FAQ
                      64 persons, 45 findings, 188 technologies, 21 testimonials
```

### On-disk spot-check — `tiddlywiki/tiddlers/Case Files Index.tid`

```
created: 20260421000000000
modified: 20260421000000000
tags: page case-files
title: Case Files Index
type: text/vnd.tiddlywiki

All case files in a sortable table. Click a column header in TiddlyWiki to sort; filter by tag to narrow (tags: investigation-report, engineering-brief, {client}).

|!Date |!Client |!Type |!Case |
|2015–2022 |General Dynamics Electric Boat |Brief |[[Exhibit A — Cross-Domain SCORM Resolution & Embedded Technical Advisory]] |
|2018–2019 |GP Strategies Leadership |Brief |[[Exhibit B — Leadership Recognition Chain: A Repeatable Pattern]] |
...
|2024 |BP (via Leo Learning / GP Strategies) |Investigation |[[Exhibit N — BP Learning Platform: Federated System Integration]] |
|2024–2025 |GP Strategies (Internal Product) |Brief |[[Exhibit O — ContentAIQ — The Integration Thread: Pattern Recognition Across Three Projects]] |
```

- Header row present (1 row).
- 15 data rows — matches the 15 exhibits in `src/data/json/exhibits.json` (A through O) and the 15 `Exhibit X — ...tid` files on disk. `grep -c "^|"` on the tiddler returns 16 (1 header + 15 data).
- Label order: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O — ascending, deterministic.
- iter-1 sections (`! Investigation Reports`, `! Engineering Briefs`) absent.

### FIX-04 grep gate

```bash
$ grep -q "|!Date |!Client |!Type |!Case |" "tiddlywiki/tiddlers/Case Files Index.tid" && echo OK
OK
$ grep -q "! Investigation Reports" "tiddlywiki/tiddlers/Case Files Index.tid" || echo "iter-1 removed"
iter-1 removed
```

## Phase Boundary Confirmation

Only `scripts/tiddlywiki/sources.ts` and `scripts/tiddlywiki/sources.test.ts` modified (+ `tsconfig.tsbuildinfo` as a build byproduct).

Untouched this plan (verified via `git diff HEAD --`):
- `scripts/tiddlywiki/generate.ts` — no diff
- `scripts/tiddlywiki/extract-all.ts` — no diff
- `scripts/tiddlywiki/page-content-to-tiddlers.ts` — no diff
- `scripts/tiddlywiki/html-to-wikitext.ts` — no diff
- `scripts/tiddlywiki/tid-writer.ts` — no diff
- `scripts/tiddlywiki/extractors/` — 0 files changed
- `scripts/tiddlywiki/generators/` — 0 files changed

Inside `sources.ts` only `caseFilesIndexTiddler` + two new helpers above it; `faqItemsToTiddlers` (Plan 55-05), `exhibitsToTiddlers` (Plan 55-03), `pageSpecsToTiddlers`, `siteMetaTiddlers`, `defaultLinkMap`, `faqIndexTiddler`, `renderAnswerParagraphs`, `humanizeCategory`, `extractMainInner` — all untouched.

## SCAF-08 Compliance

Grep across both modified files:

```bash
$ grep -nE "setTimeout\(|Date\.now\(|new Date\(|Promise\.all\(" \
    scripts/tiddlywiki/sources.ts scripts/tiddlywiki/sources.test.ts
(no matches)
```

Sort uses `.slice().sort()` over the readonly input — no Promise.all, no timers, no wall-clock reads, no JSDoc blocks added.

## Deviations from Plan

None — plan executed exactly as written. All 8 tests green on first GREEN run; no Rule 1/2/3 auto-fixes needed; no architectural surprises.

## Commits

- `beb65a5` — `feat(55-06): rewrite Case Files Index as sortable table (FIX-04)` (sources.ts + sources.test.ts)

## Self-Check: PASSED

- FOUND: scripts/tiddlywiki/sources.ts (modified)
- FOUND: scripts/tiddlywiki/sources.test.ts (modified)
- FOUND: tiddlywiki/tiddlers/Case Files Index.tid (regenerated with table)
- FOUND: commit beb65a5 in git log
- FOUND: typeCellFor helper in sources.ts
- FOUND: compareByLabel helper in sources.ts
- FOUND: 8+ caseFilesIndexTiddler describe blocks in sources.test.ts (grep count: 18 occurrences)
- FOUND: header literal `|!Date |!Client |!Type |!Case |` in both sources.ts and Case Files Index.tid on disk
- VERIFIED: iter-1 `! Investigation Reports` / `! Engineering Briefs` absent from both sources.ts and Case Files Index.tid
- VERIFIED: no SCAF-08 violations in sources.ts or sources.test.ts
- VERIFIED: generate.ts / extract-all.ts / page-content-to-tiddlers.ts / html-to-wikitext.ts / tid-writer.ts / extractors/ / generators/ unchanged
