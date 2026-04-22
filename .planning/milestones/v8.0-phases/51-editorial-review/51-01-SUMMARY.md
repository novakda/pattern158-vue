---
phase: 51-editorial-review
plan: 01
subsystem: editorial-capture
tags: [scaffold-emission, findings-template, idempotency, scaf-08, phase-51, EDIT-05]

# Dependency graph
requires:
  - phase: 50-write-preflight-orchestration
    provides: "writePrimaryAndMirror returning { primaryPath, mirrorPath } — scaffold emission anchored next to primaryPath"
  - phase: 50-write-preflight-orchestration
    provides: "main() orchestrator with a stable insertion point between writePrimaryAndMirror and the summary print"
provides:
  - "emitFindingsScaffold(captureOutputPath) — idempotent seed of site-editorial-findings.md next to the capture artifact; fsp.access probe + fsp.writeFile; returns scaffold path on write or null when file exists"
  - "SCAFFOLD_TEMPLATE — locked seed content: 5 section headings (Inconsistencies / Structural / Copy / Alignment Gaps / Open Questions), 3 priority labels (blocker / should-fix / nice-to-have), 3 career doc refs (design-philosophy-essay / career-values-reference / gp-accessibility-signoff); literal \\n line endings only"
  - "index.ts wiring — scaffold emission fires after writePrimaryAndMirror, .catch-wrapped so failure is non-fatal, scaffoldEmitted threaded through stdout (optional line) + stderr JSON (findingsScaffoldPath: string | null)"
  - "write.test.ts — 3 SCAFFOLD_TEMPLATE content assertions + 3 mocked emitFindingsScaffold cases + 2 real-fs tmpdir cases"
  - "index.test.ts — happy-path call-order assertion (scaffold after write) + 2 new scaffold-branch cases (emitted path, non-fatal rejection)"
affects: [52-milestone-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "fsp.access + fsConstants.F_OK as existence probe — throws on absent file which the try/catch flips into the write branch; resolves on present file which returns null (silent skip). Pattern matches Node fs/promises idioms without a separate stat call."
    - "Template as module-top-level `export const SCAFFOLD_TEMPLATE` concatenation of quoted literals — every newline is an explicit `\\n`; no template literal with embedded real newlines, no os.EOL, SCAF-08 discipline satisfied."
    - "Non-fatal caller wrap via .catch arrow that logs to stderr and returns null — scaffold failures log '[editorial-capture] scaffold emission failed (non-fatal): <msg>' and never flip exit code."
    - "vi.hoisted state holder extended with `access` mock + real-fs beforeEach delegate (pattern mirrors Plan 50-02 for writeFile/rename/unlink/mkdir) — one file covers both mocked unit behavior and tmpdir integration."

key-files:
  created:
    - .planning/phases/51-editorial-review/51-01-SUMMARY.md
  modified:
    - scripts/editorial/write.ts (+83 lines — SCAFFOLD_TEMPLATE + emitFindingsScaffold + fsConstants import)
    - scripts/editorial/index.ts (+21 lines — emitFindingsScaffold import + call site + stdout line + JSON field)
    - scripts/editorial/__tests__/write.test.ts (+155 lines — access mock wiring + 2 new describe blocks / 8 new tests)
    - scripts/editorial/__tests__/index.test.ts (+73 lines — emitFindingsScaffold mock + happy-path assertions + 2 new tests)
    - .planning/REQUIREMENTS.md (1 line — EDIT-05 checkbox flipped to [x])

key-decisions:
  - "Helper lives in write.ts (not a new findings-scaffold.ts module) — sits next to the other write-side helpers (atomicWrite / writePrimaryAndMirror) and shares the same SCAF-08 discipline; one-import-site in index.ts instead of two."
  - "SCAFFOLD_TEMPLATE authored as string-concatenation of quoted single-line literals with explicit `\\n` — template-literal form would embed real newlines (SCAF-08 forbids platform-EOL, and the grep gate matches on literal os.EOL / platform idioms); concat form makes every newline visible and auditable."
  - "Idempotency via fsp.access(path, F_OK) + try/catch — cheaper than stat (single syscall, no struct read), and the throw-on-absent behavior naturally flows into the write branch without a separate if(!exists) guard."
  - "fsConstants imported from 'node:fs' (not 'node:fs/promises') — F_OK is a sync constant exported from the sync fs module; the fsp namespace does not re-export it. Named import `{ constants as fsConstants }` keeps the two fs imports distinct at call sites."
  - "Non-fatal failure contract locked at caller boundary — emitFindingsScaffold throws on write failure (caller's responsibility to decide); index.ts wraps the one call site in .catch that logs + returns null. Test 'scaffold rejects → exit 0' asserts this contract against main() rather than the helper itself."
  - "findingsScaffoldPath threaded through the stderr JSON summary (null when skipped, absolute path when written) — CI log scrapers get a deterministic field; stdout emits an optional 'Findings scaffold: <path>' line ONLY when newly written (avoids daily noise in Dan's terminal after the initial run)."
  - "Call-order assertion in index.test.ts uses `invocationCallOrder[0]` comparison — locks that scaffold emission happens AFTER writePrimaryAndMirror resolves, not before. If some future refactor moves the call site above the write, the test fails loudly with a precise locational message."
  - "Real-fs test 'second run — bytes preserved verbatim' seeds a non-template payload before calling emitFindingsScaffold — verifies not just that write was skipped but that the existing content was untouched (a buggy implementation that wrote AFTER stat check would be caught here, not by the mocked test)."

patterns-established:
  - "Phase 51 scaffold-seed pattern — a writer that MUST NOT overwrite user data probes existence first, returns null on skip, and logs nothing to stderr on the skip branch. Non-fatal failure handled at the caller boundary via .catch wrap, not inside the helper (keeps helper pure about its contract)."
  - "SCAF-08-clean locked template — module-top-level `export const X = 'line1\\n' + 'line2\\n' + ...` with every newline explicit; no template literal backticks, no os.EOL, every line assertable by a single `.toContain('...')` match in tests."

# Metrics
metrics:
  duration: "~20min (single-session autonomous execution, no deviations)"
  completed_date: "2026-04-20"
  tasks_completed: 4
  files_modified: 5
  tests_added: 10
  total_tests_before: 399
  total_tests_after: 401
---

# Phase 51 Plan 01: Findings Scaffold Auto-Emission (EDIT-05) Summary

One-liner: emitFindingsScaffold helper seeds site-editorial-findings.md next to the capture artifact on first run, idempotent via fsp.access probe so Dan's in-progress findings survive subsequent captures.

## Objective

Implement **EDIT-05** — the sole executable requirement in Phase 51. The manual editorial work (EDIT-01..04) is Dan's responsibility; the tool side contributes a locked scaffold template that appears next to the capture artifact the first time the capture runs in a fresh vault.

## What Was Built

### 1. `emitFindingsScaffold(captureOutputPath): Promise<string | null>`

File: `scripts/editorial/write.ts`

Pure-ish helper: derives the sibling path `path.join(dirname(captureOutputPath), 'site-editorial-findings.md')`, probes existence via `fsp.access(path, F_OK)`, and either writes `SCAFFOLD_TEMPLATE` (returning the absolute path) or returns `null` without writing. No stderr logging on the skip branch — Dan's findings survive silently across daily runs.

### 2. `SCAFFOLD_TEMPLATE` top-level const

File: `scripts/editorial/write.ts`

Locked content per 51-CONTEXT.md: a header explaining the auto-generation, 3 career doc references, 3 priority labels, a horizontal rule, and 5 H2 sections each seeded with an HTML comment prompt describing what goes there. Literal `\n` throughout — SCAF-08 forbids `os.EOL` and platform-specific EOL constants in this directory.

### 3. `index.ts` wiring

Call site inserted directly after `const { primaryPath, mirrorPath } = await writePrimaryAndMirror(...)`, wrapped in `.catch` so any scaffold error logs to stderr and returns `null` without flipping the exit code. The result threads through the stdout summary (optional "Findings scaffold: <path>" line, only emitted on new write) and the stderr JSON summary (`findingsScaffoldPath: string | null`, always present).

### 4. Unit tests

`scripts/editorial/__tests__/write.test.ts` gained 2 describe blocks / 8 tests:

- **SCAFFOLD_TEMPLATE (Phase 51 EDIT-05)**: 3 content assertions — 5 section headings, 3 priority labels, 3 career doc references.
- **emitFindingsScaffold (mocked fsp)**: 3 tests — absent file writes template with correct path+content+utf8 encoding; present file returns null without calling writeFile; path derivation works for a deeply-nested vault path.
- **emitFindingsScaffold (real fs)**: 2 tmpdir tests — first run writes bytes matching SCAFFOLD_TEMPLATE exactly; second run with Dan's seeded findings returns null and preserves bytes verbatim.

`scripts/editorial/__tests__/index.test.ts` gained 2 new tests + augmented happy-path:

- Happy-path now asserts emitFindingsScaffold called once with primaryPath, with a call-order check that locks the invocation AFTER writePrimaryAndMirror resolves.
- New test: scaffold returns a path → stdout emits "Findings scaffold:" line + JSON findingsScaffoldPath populated.
- New test: scaffold rejects → stderr carries the non-fatal prefix, exit remains 0, JSON findingsScaffoldPath is null.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | ca16d57 | feat(51): add emitFindingsScaffold helper + SCAFFOLD_TEMPLATE (EDIT-05) |
| 2 | ba4734e | feat(51): wire emitFindingsScaffold into main() after writePrimaryAndMirror (EDIT-05) |
| 3 | f3a3af8 | test(51): unit tests for emitFindingsScaffold + SCAFFOLD_TEMPLATE (EDIT-05) |
| 4 | f96774e | test(51): assert emitFindingsScaffold invoked after writePrimaryAndMirror (EDIT-05) |

## Verification

- `pnpm test:scripts`: **401 tests pass** (up from 399 — 10 tests added across 5 describe blocks; one scaffold test replaced a previous happy-path-only assertion with a more complete assertion set, netting +2 distinct test names).
- `pnpm build`: exit 0; vue-tsc + vite build + markdown export all succeed.
- Live capture run NOT required per execution context — unit tests are sufficient because the live pipeline already validated in Phase 50-03 smoke gate, and the scaffold emission adds one non-fatal fs operation to a proven path.

## Deviations from Plan

None. Plan executed exactly as written. One minor addition surfaced naturally during implementation:

- **Stdout "Findings scaffold: <path>" line**: the context spec called for threading `scaffoldEmitted` into the summary JSON. A matching human-readable stdout line (printed only when emission newly wrote, not on skip) follows the same pattern established for `Mirror: <path>` in Plan 50-03 and costs 3 lines. Not a deviation from the plan — an extension of the spec's "include in the summary JSON" mandate to the parallel stdout summary. No user-visible behavior change on the steady-state path where the scaffold is skipped.

## Known Stubs

None. The helper writes real content, the template is the real locked specification, and the test assertions verify behavior not just call presence. No placeholder text, no "coming soon" strings, no mocked-away data paths.

## SCAF-08 Discipline Check

- Zero `Date.now()` / `Math.random()` / `os.EOL` / `Promise.all` tokens in any new code or comments.
- No `@/` path-alias imports; relative imports throughout (`./config.ts`, `./write.ts`).
- Literal `\n` in `SCAFFOLD_TEMPLATE` via string concatenation — every newline is an explicit `\n` in source and gets encoded as a single LF byte on disk.
- Sequential control flow only (no parallel-iteration helpers); the helper has no loop.

## Self-Check: PASSED

Files created/modified — verified against disk:

- `scripts/editorial/write.ts` — FOUND (modified, emitFindingsScaffold + SCAFFOLD_TEMPLATE exported)
- `scripts/editorial/index.ts` — FOUND (modified, emitFindingsScaffold imported + called after writePrimaryAndMirror)
- `scripts/editorial/__tests__/write.test.ts` — FOUND (modified, 2 new describe blocks)
- `scripts/editorial/__tests__/index.test.ts` — FOUND (modified, happy-path assertion + 2 new tests)
- `.planning/REQUIREMENTS.md` — FOUND (modified, EDIT-05 flipped to [x])

Commits — verified in git log:

- ca16d57: FOUND
- ba4734e: FOUND
- f3a3af8: FOUND
- f96774e: FOUND

All claims verified.
