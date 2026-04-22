---
phase: 53-dom-extraction
plan: 04
subsystem: tooling
tags: [extractor, personnel, dom-extraction, happy-dom, tdd]

requires:
  - phase: 53-dom-extraction
    plan: 01
    provides: "Shared types.ts (PersonnelEntry, PersonnelEntryType) + parseHtml helper + scripts/tiddlywiki/extractors/ path coverage in tsconfig + vitest"
provides:
  - "scripts/tiddlywiki/extractors/personnel.ts exporting emitPersonnel(html, opts?) → readonly PersonnelEntry[] for EXTR-03"
  - "Inline-HTML test coverage (7 describe blocks) for individual/anonymized/group rows, empty-role cell, sourceExhibitLabel threading, no-table guard, idempotency"
affects: [54-atomic-tiddler-generation (ATOM-01 per-person tiddlers consume emitPersonnel output), 55-iter-1-fixes (FIX-02 wires extractor into generate.ts)]

tech-stack:
  added: []
  patterns:
    - "Scoped selector 'table.personnel-table tbody tr' — prevents cross-table leakage on exhibit detail pages that also render a technologies-table"
    - "classList.contains on happy-dom Element drives the entryType discriminator (individual / group / anonymized)"
    - "Options-bag for source-exhibit back-reference (opts?.sourceExhibitLabel) — keeps extractor pure, caller owns label attribution"
    - "Null-safe textOf helper via optional chaining: (el?.textContent ?? '').trim() — absent cells (<td></td>, missing .personnel-name) produce empty strings rather than throwing"

key-files:
  created:
    - scripts/tiddlywiki/extractors/personnel.ts
    - scripts/tiddlywiki/extractors/personnel.test.ts
  modified: []

key-decisions:
  - "Row selector scoped to 'table.personnel-table tbody tr' rather than the looser '.personnel-table tbody tr' — exhibit pages render multiple exhibit-table variants (personnel, technologies, findings) and a looser selector is fragile if class combinations evolve"
  - "textOf helper centralizes the null-safe text-extraction pattern — four call sites (name, title, organization, role) benefit; matches the faq.ts sibling's extraction style"
  - "deriveEntryType ladder checks anonymized BEFORE group — a row could theoretically carry both classes; anonymized wins by policy (personal identity protection takes precedence over group-membership signaling)"
  - "forEach over NodeList instead of for-of — matches the faq.ts sibling and avoids the NodeList-iterable lib reference requirement (DOM-lib-scoped file keeps happy-dom's Element typing without pulling the iterator protocol)"

requirements-completed: [EXTR-03]

duration: 5m 32s
completed: 2026-04-22
---

# Phase 53 Plan 04: Personnel Extractor Summary

**EXTR-03 delivered: `emitPersonnel(html, opts?) → readonly PersonnelEntry[]` parses `.personnel-table` rows on exhibit detail pages, discriminates individual/group/anonymized entry types via `tr` class hooks, threads caller-supplied `sourceExhibitLabel`, returns `[]` on missing table.**

## Performance

- **Duration:** 5m 32s
- **Started:** 2026-04-22T05:42:58Z
- **Completed:** 2026-04-22T05:48:30Z
- **Tasks:** 2 (TDD RED + GREEN)
- **Files created:** 2 (`personnel.ts`, `personnel.test.ts`)

## Accomplishments

- `scripts/tiddlywiki/extractors/personnel.test.ts` created — 7 `describe` blocks, 7 `it` cases, inline-HTML template-literal fixtures (no fs I/O), hermetic, SCAF-08 clean.
- `scripts/tiddlywiki/extractors/personnel.ts` created — 47 lines, pure function + two named helpers (`textOf`, `deriveEntryType`), happy-dom only via `parseHtml` import from shared `./types.ts`. SCAF-08 clean.
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/personnel.test.ts` exits 0 — 7/7 tests pass.
- Phase-boundary respected: only `personnel.ts` + `personnel.test.ts` under `scripts/tiddlywiki/extractors/` authored by this plan (subject to one parallel-execution race, see Deviations § 1).

## Task Commits

1. **Task 1: Write personnel.test.ts (RED)** — `fdff849` (test)
2. **Task 2: Implement personnel.ts (GREEN)** — `7628f7c` (feat)

## Files Created

- `scripts/tiddlywiki/extractors/personnel.ts` **(created)** — Pure DOM-extractor for the personnel-table section of an exhibit detail page.
  - File-scoped SCAF-08 policy comment (prose, no forbidden tokens), imports `parseHtml` + `PersonnelEntry` + `PersonnelEntryType` from shared `./types.ts`.
  - Five named selector constants (`ROW_SELECTOR`, `NAME_SELECTOR`, `TITLE_SELECTOR`, `ORG_CELL_SELECTOR`, `ROLE_CELL_SELECTOR`) keep the extraction path self-documenting.
  - `textOf(el)` helper — null-safe text extraction via optional chaining, trims whitespace.
  - `deriveEntryType(row)` — ladder from `'anonymized'` → `'group'` → `'individual'` default.
  - `emitPersonnel(html, opts?)` — parses HTML via `parseHtml`, iterates tbody rows with `NodeList.forEach`, pushes one `PersonnelEntry` per row.
  - Returns `readonly PersonnelEntry[]` (caller-immutable).
- `scripts/tiddlywiki/extractors/personnel.test.ts` **(created)** — Vitest-globals test file (describe/it/expect, no explicit import).
  - One shared `PERSONNEL_HTML` template-literal fixture covering an individual, anonymized, and group row on the same synthetic personnel-table.
  - 7 describe blocks: individual row, anonymized row, group row, empty role cell, sourceExhibitLabel default (opts omitted), no-personnel-table (empty HTML), idempotency (byte-identical JSON.stringify across two calls).
  - No fs reads, no `__fixtures__` directory — matches Phase 48/49 inline-HTML convention.

## Decisions Made

- **Row selector scoped to the personnel-table** (`table.personnel-table tbody tr`) rather than `.personnel-table tbody tr`. Exhibit detail pages render multiple `exhibit-table` variants (personnel, technologies, findings). Scoping to the `<table>` element keeps the extractor robust against sibling-table class drift.
- **`textOf` helper centralizes null-safe extraction** across four call sites (name, title, organization, role). Matches the `faq.ts` sibling's extraction discipline. Optional chaining + null coalescing + trim in one function yields total-shape strings at every extraction boundary.
- **anonymized check BEFORE group check** in `deriveEntryType`. A row carrying both classes (theoretical, not currently observed in `static-site/`) resolves to `'anonymized'` — identity protection wins over group-membership labeling.
- **`forEach` over `for-of`** on the NodeList — matches faq.ts and avoids a NodeList-iterable lib reference. The surrounding `/// <reference lib="dom" />` (transitive via types.ts's parseHtml) is enough for `.forEach` but the NodeList iterator protocol under TypeScript's strict lib scoping would need an additional target bump.
- **Empty role cell yields `''`** without special-case handling — `row.querySelector('td[data-label="role"]')` returns `null` for an empty `<td></td>`, and `textOf(null)` returns `''`. Two edge cases (absent cell, empty cell) collapse into one branch.

## Deviations from Plan

### Logged Out-of-Scope Blockers

**1. `[Rule 4 → Out-of-scope]` `pnpm build` red across all Wave-2 plans — tsconfig.scripts.json scaffold gap**

- **Found during:** Task 2 `<verify>` block (plan mandates `pnpm build` as a gate after tests pass).
- **Issue:** `pnpm build` exits 2 with TS errors in EVERY Wave-2 extractor file (including my `personnel.ts` + `personnel.test.ts`):
  - `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled` — on `from './types.ts'` (the exact import pattern the plan's `must_haves.key_links.pattern` mandates).
  - `TS2593: Cannot find name 'describe' / 'it'` and `TS2304: Cannot find name 'expect'` — Vitest globals absent from the scripts-tsconfig `types: ["node"]` array.
- **Root cause:** Plan 53-01's scaffold extended `tsconfig.scripts.json` include-glob to `scripts/tiddlywiki/**/*.ts` but did NOT add `allowImportingTsExtensions: true` or `vitest/globals` to `types`. This went undetected because no Wave-2 files existed at Plan 53-01 validation time. The sibling `tsconfig.editorial.json` has BOTH settings — the scripts tsconfig needs to match.
- **Scope constraint:** project_conventions restrict this plan to `personnel.ts` + `personnel.test.ts`. Fixing the tsconfig is out of scope; already logged to `.planning/phases/53-dom-extraction/deferred-items.md` § 1 by Plan 53-06 executor before me with full remediation instructions and ownership suggestion (Plan 53-10 or Phase 55 FIX-02).
- **Evidence I did not introduce the failure:**
  - `faq.ts` (committed before my plan by Plan 53-02) has the identical TS5097 error on its own `from './types.ts'` import — confirming the failure is scaffold-wide, not personnel-specific.
  - `pnpm test:scripts --run scripts/tiddlywiki/extractors/personnel.test.ts` (the per-plan task-level gate) exits 0 — Vitest uses its own resolver, bypasses the broken tsconfig composite-build graph.
- **Fix:** None applied in this plan (scope-boundary). Plan 53-02's executor landed the scaffold fix in commit `619c82e` (`fix(53-02): add vitest/globals + allowImportingTsExtensions to scripts tsconfig`) during concurrent Wave-2 execution. Post-fix re-run: `pnpm build` exits 0 at the time this SUMMARY was finalized — MY plan's `pnpm build` gate is therefore RESOLVED (GREEN) via upstream parallel fix.
- **Files modified:** None (this plan changes ZERO files outside its two-file scope).

**2. `[Parallel-execution race]` Task 2 commit `7628f7c` accidentally carried `scripts/tiddlywiki/extractors/testimonials.ts` (Plan 53-07's implementation file)**

- **Found during:** Post-commit `git show --stat HEAD` verification.
- **Issue:** `git add scripts/tiddlywiki/extractors/personnel.ts` staged my file at time T. Between T and my subsequent `git commit`, a concurrent Plan 53-07 executor wrote `testimonials.ts` to disk AND likely invoked its own `git add` (or a batch add) staging that file into the shared index. My `git commit` therefore landed both files in a single commit.
- **Impact:** `testimonials.ts` is now tracked under my commit rather than Plan 53-07's. Content is Plan 53-07's authored implementation — not my output.
- **Why not reverted:** Plan 53-02's GREEN commit (`9ae3fa0`) landed on top of mine (`7628f7c`) in the same race window. `git reset --mixed HEAD~1` to rewrite my commit would orphan or force rewrite of 53-02's commit — higher risk than accepting the carried file. Amending was rejected per commit protocol ("Always create NEW commits rather than amending").
- **Mitigation:** Plan 53-07's executor will discover their intended source file is already committed and can commit ONLY their test file (they still own `testimonials.test.ts` which landed in Plan 53-07's own RED commit `4fbad4a`). Their SUMMARY should document this inversion.
- **Phase-level follow-up:** Consider adding a pre-commit race guard for Wave-N parallel plans (e.g., `git add --pathspec-from-file` with strict glob) or serialize `git add`/`git commit` via a phase-dir lockfile. Log to `deferred-items.md` recommended.
- **Files affected outside my scope:** `scripts/tiddlywiki/extractors/testimonials.ts` (Plan 53-07's file, committed in my `7628f7c`).

**3. `[Cosmetic]` File-header SCAF-08 comment rephrased to match faq.ts convention**

- **Found during:** Task 2 post-write acceptance grep.
- **Issue:** Initial personnel.ts header included `// SCAF-08: no setTimeout, no Date.now(), no new Date(), no Promise.all.` — the verbatim call syntax tripped the SCAF-08 acceptance grep. The CONTEXT.md note at the end of the `<decisions>` block says "prose must not name SCAF-08-forbidden tokens".
- **Fix:** Rephrased to match the faq.ts sibling verbatim: `// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel iteration helpers. Sequential for-of and NodeList .forEach only.`
- **Files modified:** `scripts/tiddlywiki/extractors/personnel.ts` (in-flight before first commit — rolled into `7628f7c`, no separate commit).

---

**Total deviations:** 3 (1 out-of-scope-then-resolved-upstream, 1 parallel-execution race documented, 1 cosmetic in-flight fix)
**Impact on plan correctness:** Zero. All 7 test-level acceptance criteria pass; all grep-based acceptance gates pass; the `pnpm build` gate is GREEN at SUMMARY finalization time (resolved via Plan 53-02's parallel scaffold fix `619c82e`).

## Issues Encountered

- Parallel Wave-2 execution caused one unintended file inclusion in my GREEN commit (Deviation § 2). No data loss, no test regressions.

## User Setup Required

None.

## Next Phase Readiness

- Plan 54 (ATOM-01 — per-person atomic tiddler generation) can import `emitPersonnel` from `scripts/tiddlywiki/extractors/personnel.ts` and consume `readonly PersonnelEntry[]` with full `PersonnelEntryType` discrimination.
- Plan 55 FIX-02 (wiring extractor into `generate.ts`) has a deterministic extractor interface: `(html: string, opts?: { sourceExhibitLabel?: string }) => readonly PersonnelEntry[]`.
- Plan 56 TEST-03 (live-fixture integration) can exercise `emitPersonnel` against real `static-site/exhibits/exhibit-*.html` pages; the no-personnel-table guard ensures the extractor tolerates exhibits that omit personnel sections.

## TDD Gate Compliance

- RED commit (`fdff849`, `test(53-04): add failing tests for emitPersonnel (RED)`) — PRESENT.
- GREEN commit (`7628f7c`, `feat(53-04): implement emitPersonnel extractor (GREEN)`) — PRESENT.
- REFACTOR phase — SKIPPED (no post-GREEN cleanup needed; implementation is at its minimum viable shape: 47 lines, two named helpers, one public function).

## Self-Check: PASSED

- `scripts/tiddlywiki/extractors/personnel.ts` — FOUND (47 lines)
- `scripts/tiddlywiki/extractors/personnel.test.ts` — FOUND (95 lines, 7 describes)
- Commit `fdff849` (Task 1 RED) — FOUND in git log
- Commit `7628f7c` (Task 2 GREEN) — FOUND in git log
- Task-level test gate `pnpm test:scripts --run scripts/tiddlywiki/extractors/personnel.test.ts` — exits 0 (7/7)
- Plan-level `pnpm build` gate — exits 0 (unblocked by Plan 53-02's concurrent scaffold fix `619c82e` adding `allowImportingTsExtensions: true` + `vitest/globals` to `tsconfig.scripts.json`; see Deviation § 1)
- SCAF-08 grep on both files — CLEAN
- All Task 2 acceptance grep patterns (personnel-table, personnel-name, personnel-title, personnel-entry-anonymized, personnel-entry-group, export function emitPersonnel) — PASS

---
*Phase: 53-dom-extraction*
*Completed: 2026-04-22*
