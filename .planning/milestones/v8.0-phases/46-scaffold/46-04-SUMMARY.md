---
phase: 46-scaffold
plan: 04
subsystem: infra
tags: [vitest, gitignore, typescript, tooling, build-config]

# Dependency graph
requires:
  - phase: 46-scaffold
    provides: Plan 01 placeholder TS files + smoke test under scripts/editorial/
  - phase: 46-scaffold
    provides: Plan 02 tsconfig.editorial.json composite project (outDir .tsbuildinfo-editorial)
provides:
  - Vitest `scripts` project discovers scripts/editorial/**/*.test.ts
  - .tsbuildinfo-editorial/ git-ignored
  - Plan 05 can run `pnpm test:scripts` end-to-end smoke gate
affects: [46-05, 47-capture, 48-convert, 49-write, 50-orchestrate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single Vitest project, multi-glob include — extension over duplication for sibling script directories"
    - "Per-project .gitignore block mirroring (named entry + bag-of-bytes catch-all preserved)"

key-files:
  created: []
  modified:
    - vitest.config.ts
    - .gitignore

key-decisions:
  - "Multi-line array reformat in vitest.config.ts include — future additions are 1-line append rather than string-split edit"
  - "Both .tsbuildinfo-editorial/ and tsconfig.editorial.tsbuildinfo entries added (mirrors scripts-project block) even though *.tsbuildinfo catch-all matches the marker file — explicit per-project intent self-documenting"
  - "No new Vitest project — extended existing `scripts` project's include glob (SCAF-06 contract)"

patterns-established:
  - "Sibling script directory wiring: extend scripts-project include array, do not introduce new Vitest project"
  - ".gitignore composite-project block: comment header + outDir directory entry + tsconfig marker entry, grouped per-project"

requirements-completed: [SCAF-06, SCAF-07]

# Metrics
duration: 1m 17s
completed: 2026-04-20
---

# Phase 46 Plan 04: Vitest + .gitignore Wiring Summary

**Editorial directory wired into the existing `scripts` Vitest project (extended include glob — no new project) and `.tsbuildinfo-editorial/` added to .gitignore so Plan 05 can run a clean smoke gate.**

## Performance

- **Duration:** 1m 17s
- **Started:** 2026-04-20T15:32:19Z
- **Completed:** 2026-04-20T15:33:36Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `vitest.config.ts` `scripts` project `include` array extended from 1 glob to 2 — now covers both `scripts/markdown-export/**/*.test.ts` and `scripts/editorial/**/*.test.ts`
- Exactly one `name: 'scripts'` declaration preserved (SCAF-06 contract: extension, not duplication)
- `.gitignore` gains `.tsbuildinfo-editorial/` directory entry plus parallel `tsconfig.editorial.tsbuildinfo` marker entry, mirroring the existing scripts-project block
- All `<acceptance_criteria>` from both tasks pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Vitest scripts project include for scripts/editorial/ (SCAF-06)** — `b3fb062` (feat)
2. **Task 2: Add .tsbuildinfo-editorial entry to .gitignore (SCAF-07)** — `d72537c` (chore)

**Plan metadata:** TBD on final commit (this SUMMARY + ROADMAP.md update)

## Files Created/Modified

- `vitest.config.ts` — `scripts` project `include` array extended to 2 globs (markdown-export + editorial); multi-line array reformat for future maintainability; `name: 'scripts'`, `environment: 'node'`, `globals: true` all preserved
- `.gitignore` — appended editorial-project block (`.tsbuildinfo-editorial/` directory entry + `tsconfig.editorial.tsbuildinfo` marker entry) immediately after the existing scripts-project block; no existing entries reformatted or removed

### Exact diffs applied

**`vitest.config.ts` — scripts project include array (lines 43–48 in diff):**

Before:
```ts
{
  extends: true,
  test: {
    name: 'scripts',
    include: ['scripts/markdown-export/**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
},
```

After:
```ts
{
  extends: true,
  test: {
    name: 'scripts',
    include: [
      'scripts/markdown-export/**/*.test.ts',
      'scripts/editorial/**/*.test.ts',
    ],
    environment: 'node',
    globals: true,
  },
},
```

**`.gitignore` — appended after the existing scripts-project block:**

Lines added (4 new lines including the leading blank separator and the comment header):
```

# TypeScript project-references build artifacts (editorial project)
.tsbuildinfo-editorial/
tsconfig.editorial.tsbuildinfo
```

## Decisions Made

- **Multi-line array reformat over single-line append.** The Vitest `include` array was reformatted from `['glob']` (single line) to a multi-line `[\n  'glob',\n  'glob',\n]`. Rationale: future additions (e.g., a v9.0 script directory) become a one-line append rather than a string-split edit. The literal patterns are unchanged.
- **Mirror the scripts-project `.gitignore` block exactly.** Added both `.tsbuildinfo-editorial/` (the `outDir` directory `tsc` writes) AND `tsconfig.editorial.tsbuildinfo` (the marker file `tsc -b` writes). The existing `*.tsbuildinfo` catch-all already matches the marker file, but the explicit redundant entry self-documents the per-project ignore intent. Plan body explicitly endorsed this redundancy.
- **No new Vitest project.** SCAF-06 explicitly forbids creating a new project — only the `scripts` project's `include` is extended. Verified: exactly one `name: 'scripts'` declaration in the config (also exactly one each for `'unit'` and `'browser'` — regression check).

## Deviations from Plan

None — plan executed exactly as written. Both tasks landed on the first edit pass; all acceptance criteria pass on first verification.

## Issues Encountered

None.

### SCAF-06 / SCAF-07 contract confirmation

- **SCAF-06:** `scripts` project still has `name: 'scripts'`, `environment: 'node'`, `globals: true`. No new Vitest project introduced. Total project count remains 3 (`unit`, `browser`, `scripts`).
- **SCAF-07:** `.tsbuildinfo-editorial/` directory entry present in `.gitignore`. Existing entries (`node_modules`, `dist`, `.tsbuildinfo-scripts/`, `*.tsbuildinfo`) all preserved.

### Smoke-run validation deferred to Plan 05

This plan only wires the configuration. End-to-end validation (`pnpm test:scripts` discovers and runs `scripts/editorial/__tests__/smoke.test.ts`; `pnpm build` produces `.tsbuildinfo-editorial/` without dirtying `git status`) is owned by Plan 46-05 (Wave 2 smoke gate).

## User Setup Required

None — pure infrastructure configuration. No external service config, no credentials, no manual steps.

## Next Phase Readiness

- Wave 1 (plans 46-01 through 46-04) is complete. Plan 46-05 (Wave 2 smoke gate) can now dispatch.
- Plan 46-05 will validate end-to-end: `pnpm test:scripts` should discover `scripts/editorial/__tests__/smoke.test.ts` (created in Plan 01) via the new `scripts/editorial/**/*.test.ts` glob, and `pnpm build` should write `.tsbuildinfo-editorial/` without leaving an untracked directory in `git status`.
- No blockers or concerns.

## Self-Check: PASSED

Verified post-write:

**Files modified exist with expected content:**
- `vitest.config.ts` — FOUND, contains `scripts/editorial/**/*.test.ts` and `scripts/markdown-export/**/*.test.ts`; exactly one `name: 'scripts'`
- `.gitignore` — FOUND, contains `.tsbuildinfo-editorial/` and `tsconfig.editorial.tsbuildinfo`; existing entries preserved

**Commits exist in git log:**
- `b3fb062` — FOUND (`feat(46-04): extend Vitest scripts project include for editorial (SCAF-06)`)
- `d72537c` — FOUND (`chore(46-04): add .tsbuildinfo-editorial entry to .gitignore (SCAF-07)`)

---
*Phase: 46-scaffold*
*Completed: 2026-04-20*
