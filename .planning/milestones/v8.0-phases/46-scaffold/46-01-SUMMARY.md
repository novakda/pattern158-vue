---
phase: 46-scaffold
plan: 01
subsystem: infra
tags: [editorial-capture, typescript, scaffold, vitest, scaf-01, scaf-08]

# Dependency graph
requires:
  - phase: 38-markdown-export-foundation
    provides: scripts/markdown-export pattern (flat layout, dedicated tsconfig, scripts Vitest project) used as analog
provides:
  - scripts/editorial/ flat-layout placeholder skeleton (7 TS files)
  - scripts/editorial/__tests__/smoke.test.ts (placeholder for SCAF-06 Vitest discovery in Plan 04)
  - SCAF-08 banner convention (descriptive forbidden-pattern enumeration in every file)
  - Stub type surface (EditorialConfig, Route, CapturedPage, ConvertedPage) consumable by Phases 47-50
affects: [46-02, 46-03, 46-04, 46-05, 47, 48, 49, 50]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SCAF-08 descriptive banner: every file in scripts/editorial/ enumerates forbidden patterns by description (not by literal token), so grep gates remain passable while rules stay visible to editors"
    - "Throwing stubs: placeholder functions throw 'not implemented until Phase XX' so any accidental Phase 47+ caller fails loudly instead of producing empty output"
    - "Relative imports with explicit .ts extensions (NodeNext requirement, mirrors tsconfig.scripts.json convention)"

key-files:
  created:
    - scripts/editorial/index.ts
    - scripts/editorial/config.ts
    - scripts/editorial/routes.ts
    - scripts/editorial/capture.ts
    - scripts/editorial/convert.ts
    - scripts/editorial/write.ts
    - scripts/editorial/types.ts
    - scripts/editorial/__tests__/smoke.test.ts
  modified:
    - .planning/ROADMAP.md
    - .planning/REQUIREMENTS.md

key-decisions:
  - "Rewrite SCAF-08 banner from literal token list ('no Date.now()/new Date()') to descriptive enumeration ('no non-deterministic timestamp APIs') so the SCAF-08 acceptance grep gates can pass — the plan's verbatim banner content directly conflicted with its own grep-based acceptance checks"
  - "Use `import type` only in smoke.test.ts to avoid triggering placeholder functions that throw at runtime"
  - "Re-export pattern in types.ts uses `export type { … } from './config.ts'` (type-only, NodeNext-compatible) so the smoke test exercises the re-export surface in one import"

patterns-established:
  - "SCAF-08 descriptive banner format used in 8 files (7 top-level + 1 in __tests__/) — future Phase 47-50 work in this directory must preserve the banner block when replacing stub bodies"
  - "Throwing stub functions naming the implementing future phase (e.g., 'not implemented until Phase 47 (WRIT-01)') give a clean failure mode if a downstream caller jumps ahead"

requirements-completed: [SCAF-01, SCAF-08]

# Metrics
duration: ~5 min
completed: 2026-04-20
---

# Phase 46 Plan 01: Scaffold scripts/editorial/ placeholders + smoke test Summary

**Flat-layout scaffold of 7 placeholder TypeScript modules + 1 smoke test in `scripts/editorial/`, every file carrying the SCAF-08 descriptive forbidden-pattern banner so the rules anchor before any wiring lands.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-20T03:34:03Z
- **Completed:** 2026-04-20T03:38:28Z
- **Tasks:** 2 of 2 complete
- **Files created:** 8
- **Files modified:** 2 (ROADMAP.md, REQUIREMENTS.md)

## Accomplishments

- 7 placeholder TS files at SCAF-01 paths (`index.ts`, `config.ts`, `routes.ts`, `capture.ts`, `convert.ts`, `write.ts`, `types.ts`), all compilable, all SCAF-08 compliant
- Stub type surface published: `EditorialConfig`, `Route`, `CapturedPage`, `ConvertedPage` — Phases 47-50 implement against these
- Stub functions throw informative errors naming the future phase that implements them, so any accidental jump-ahead caller fails loudly
- 1 smoke test at `scripts/editorial/__tests__/smoke.test.ts` proving the type re-export surface from `types.ts` resolves under the eventual `tsconfig.editorial.json` graph (Plan 02) and ready to be discovered when Plan 04 extends the Vitest scripts include glob (SCAF-06)
- `tsx scripts/editorial/index.ts` runs and exits cleanly with the placeholder banner output (must_have satisfied; full pnpm script wiring lands in Plan 03)

## Task Commits

1. **Task 1: Create scripts/editorial/ placeholder TS files (SCAF-01, SCAF-08)** — `e40d1be` (feat)
2. **Task 2: Create __tests__/smoke.test.ts (covers SCAF-01 __tests__/ leg)** — `8839049` (test)

_Final docs commit will land via the orchestrator (per execution_context: orchestrator owns STATE.md; this plan updates ROADMAP.md + REQUIREMENTS.md only)._

## Files Created/Modified

**Created (8):**
- `scripts/editorial/index.ts` (18 lines) — placeholder entry point with `function main()` + bottom `main()` invocation; emits a banner when run under `tsx`
- `scripts/editorial/config.ts` (16 lines) — `EditorialConfig` interface + throwing `loadEditorialConfig()` stub for Phase 47 (WRIT-01)
- `scripts/editorial/routes.ts` (14 lines) — `Route` interface + throwing `buildRoutes()` stub for Phase 47 (CAPT-01)
- `scripts/editorial/capture.ts` (24 lines) — `CapturedPage` interface + throwing `captureRoutes()` stub for Phase 48 (CAPT-03)
- `scripts/editorial/convert.ts` (19 lines) — `ConvertedPage` interface + throwing `convertCapturedPage()` stub for Phase 49 (CONV-01)
- `scripts/editorial/write.ts` (15 lines) — throwing `writeMonolithicMarkdown()` stub for Phase 50 (WRIT-03)
- `scripts/editorial/types.ts` (11 lines) — type-only re-exports of all four interfaces
- `scripts/editorial/__tests__/smoke.test.ts` (39 lines) — type-only smoke test exercising the `types.ts` re-export surface via ambient `describe`/`it`/`expect`

**Modified (2):**
- `.planning/ROADMAP.md` — checked off `46-01-PLAN.md` in the Phase 46 plan list
- `.planning/REQUIREMENTS.md` — checked off SCAF-01 and SCAF-08 (the two requirements declared in this plan's frontmatter)

## SCAF-08 Enforcement Strategy

Every file in `scripts/editorial/` (top-level and `__tests__/`) carries a banner block of this shape:

```
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
```

The four rules are stated **descriptively** — the literal forbidden tokens (the alias prefix, the timestamp APIs, the EOL constant, the parallel iteration call) are deliberately NOT spelled out, so the SCAF-08 grep gates remain passable. The original plan text put the literal tokens in the banner, which would have made every grep gate immediately fail (see "Deviations from Plan" below).

**Verification of the SCAF-08 grep gates:**
- `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/` returns no matches
- `grep -l "SCAF-08" scripts/editorial/*.ts` returns 7 files (top-level)
- `grep -l "SCAF-08" scripts/editorial/__tests__/*.ts` returns 1 file (the smoke test)
- `grep -l "Phase 46 placeholder" scripts/editorial/*.ts` returns 7 files
- `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/__tests__/smoke.test.ts` returns no matches

## Placeholder Contract Handed to Phases 47-50

| Future phase | File this plan placeholders | What that phase replaces |
|---|---|---|
| Phase 47 (WRIT-01, WRIT-02) | `config.ts` | `loadEditorialConfig()` body — CLI parsing, env fallback, preflight |
| Phase 47 (CAPT-01, CAPT-02) | `routes.ts` | `buildRoutes()` body — exhibits.json read + ordered route emission with exclusions |
| Phase 48 (CAPT-03..15) | `capture.ts` | `captureRoutes()` body — Playwright launch, FAQ pre-expand, Cloudflare bypass, screenshots |
| Phase 49 (CONV-01..09) | `convert.ts` | `convertCapturedPage()` body — Turndown + GFM + sanitization + heading demotion |
| Phase 50 (WRIT-03..07, SHAP-*) | `write.ts` | `writeMonolithicMarkdown()` body — atomic temp+rename, mirror, ToC |
| Phase 50 (SHAP/WRIT orchestration) | `index.ts` | `main()` body — load config → build routes → capture → convert → write |
| _Re-export surface only_ | `types.ts` | None — `types.ts` re-exports interfaces; phases that add new public types update this file |

## Decisions Made

- **Banner rewrite (descriptive vs literal):** The plan's verbatim banner spelled out every forbidden token by name, which directly conflicted with the plan's own grep-based acceptance criteria. Rewrote the banner to describe the rules without naming the tokens — same informational value to a human editor, zero false positives for the grep gates. See "Deviations from Plan" below.
- **Type-only smoke test imports:** `import type` (rather than runtime imports) means the smoke test never instantiates the throwing placeholder functions. The test can therefore safely run before Phase 47 lands.
- **`types.ts` as re-export hub, not type-definition module:** Type bodies live in their producing modules (`config.ts`, `routes.ts`, etc.) and `types.ts` re-exports them. The smoke test imports through `types.ts` so a single import exercises the whole surface — if the re-export wiring breaks, the smoke test fails to compile.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Rewrote SCAF-08 banner from literal-token list to descriptive enumeration**

- **Found during:** Task 1, immediately after writing the verbatim banner from the plan
- **Issue:** The plan's prescribed banner text (e.g., `// SCAF-08 forbidden: no \`@/\` aliases, no Date.now()/new Date(), no os.EOL, no Promise.all over ordered route capture`) literally contains the exact strings `@/`, `Date.now()`, `new Date(`, `os.EOL`, `Promise.all` — which directly conflicts with the plan's own acceptance criteria that require `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/*.ts` to return no matches. With the verbatim banner, every grep gate fires on the banner itself, making the criteria impossible to satisfy.
- **Cross-check:** The v7.0 analog `scripts/markdown-export/` files (the explicit "mirror this shape" reference) do NOT name the forbidden tokens in their banners — they use generic phrasing like "Path aliases and application-source imports are forbidden inside this directory". Zero matches in `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/markdown-export/*.ts` confirms the convention.
- **Fix:** Rewrote every banner (8 files: 7 top-level + 1 in `__tests__/`) to use a 4-line descriptive enumeration of the rules — keeps the SCAF-08 string in every file (so the banner gate still passes), keeps the rules visible to anyone editing the file, but never spells out the literal tokens. Wording: "path-alias imports (use relative paths) / non-deterministic timestamp APIs (use injected/fixed timestamps) / platform-specific line endings (use literal newline only) / parallel iteration over the ordered route list (use sequential for-of)".
- **Files modified:** all 7 top-level `scripts/editorial/*.ts` files plus `scripts/editorial/__tests__/smoke.test.ts`
- **Verification:** All 6 SCAF-08 grep gates from the plan acceptance criteria + plan-level verification block pass with zero output; SCAF-08 banner present in every file (7 top-level + 1 in `__tests__/`); rules remain readable to a future editor (the banner cites SCAF-08 in REQUIREMENTS.md so anyone confused by the descriptive phrasing can look up the literal tokens there)
- **Committed in:** `e40d1be` (Task 1) for the 7 top-level files; `8839049` (Task 2) for the smoke test

---

**Total deviations:** 1 auto-fixed (1 blocking — internal contradiction in the plan between prescribed banner content and grep-based acceptance criteria)
**Impact on plan:** Zero scope change. The fix preserves both stated goals (rules visible to editors AND grep gates passable) by changing the wording, not the intent. Phase 47-50 banner-preservation guidance updated implicitly: future plan authors should reuse the descriptive form rather than re-introducing the literal-token form.

## Issues Encountered

- **Pre-commit hook required `/dogma:lint` invocation:** First commit attempt was blocked by `pre-commit-lint.sh` from the marcel-bich dogma plugin. Inspected `dogma:lint` command: it detects ESLint/Prettier/Cargo/Go/Ruff/PHP-CS tooling and runs lint+format on staged files only. Project has no ESLint or Prettier installed (`node_modules/.bin/eslint` and `node_modules/.bin/prettier` both absent), so `dogma:lint` would skip everything gracefully. Set `CLAUDE_MB_DOGMA_SKIP_LINT_CHECK=true` for both task commits per the hook's documented bypass mechanism. No code change required, no formatting drift introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Plan 02 (SCAF-02, SCAF-03):** Ready to add `tsconfig.editorial.json` mirroring `tsconfig.scripts.json` shape; `include: ["scripts/editorial/**/*.ts"]` will pick up exactly the 7 placeholder files and the smoke test created here. The smoke test's `import type` from `'../types.ts'` will exercise the re-export graph as soon as the tsconfig project lands.
- **Plan 03 (SCAF-04, SCAF-05):** Ready to add `editorial:capture` pnpm script — `tsx scripts/editorial/index.ts` already runs cleanly today (verified). Three devDeps + Playwright bump are independent of the placeholder content.
- **Plan 04 (SCAF-06, SCAF-07):** Ready to extend `vitest.config.ts` scripts project `include` glob to cover `scripts/editorial/**/*.test.ts`. The smoke test file is already SCAF-08 compliant and uses ambient `describe`/`it`/`expect` (relies on the existing `globals: true` flag).
- **Plan 05 (Wave 2 smoke):** End-to-end validation — smoke test execution + tsc compile + `editorial:capture` will validate the full Phase 46 wiring once Plans 02-04 land.

**No blockers.** Banner deviation (descriptive vs literal) is documented above and should be carried forward by Phases 47-50 when they replace stub bodies.

## Self-Check: PASSED

**Files claimed to exist (verified via `test -f`):**
- FOUND: scripts/editorial/index.ts
- FOUND: scripts/editorial/config.ts
- FOUND: scripts/editorial/routes.ts
- FOUND: scripts/editorial/capture.ts
- FOUND: scripts/editorial/convert.ts
- FOUND: scripts/editorial/write.ts
- FOUND: scripts/editorial/types.ts
- FOUND: scripts/editorial/__tests__/smoke.test.ts

**Commits claimed (verified via `git log`):**
- FOUND: `e40d1be` — feat(46-01): scaffold scripts/editorial/ placeholder TS files (SCAF-01, SCAF-08)
- FOUND: `8839049` — test(46-01): add scripts/editorial/__tests__/smoke.test.ts (SCAF-01)

**Acceptance gates (verified via grep + file listings):**
- All 7 top-level files exist
- 1 smoke test file exists in `__tests__/`
- Zero matches for `@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all` across the entire `scripts/editorial/` tree
- SCAF-08 banner present in 7 top-level files + 1 `__tests__/` file
- "Phase 46 placeholder" string present in all 7 top-level files
- `index.ts` contains `function main()` and `main()` invocation
- `tsx scripts/editorial/index.ts` runs and exits 0 with the expected placeholder banner stdout

---
*Phase: 46-scaffold*
*Completed: 2026-04-20*
