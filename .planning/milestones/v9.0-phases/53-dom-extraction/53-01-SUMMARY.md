---
phase: 53-dom-extraction
plan: 01
subsystem: tooling
tags: [extractors, types, tsconfig, vitest, happy-dom, scaffold, dom-extraction]

requires:
  - phase: 48-editorial-capture-playwright
    provides: CaptureError options-bag constructor pattern
  - phase: 49-html-to-markdown-conversion
    provides: happy-dom Window parser usage with file-scoped /// <reference lib="dom" /> cast-at-boundary pattern
provides:
  - Shared scripts/tiddlywiki/extractors/types.ts exporting 13 entity/sub-entity interfaces, ExtractorError class, and parseHtml helper
  - tsconfig.scripts.json coverage of scripts/tiddlywiki/**/*.ts (with explicit exclude for three pre-Phase-53 files refactored in Phase 55)
  - vitest.config.ts scripts-project coverage of scripts/tiddlywiki/**/*.test.ts
affects: [53-02, 53-03, 53-04, 53-05, 53-06, 53-07, 53-08, 53-09, 53-10, 54-atomic-tiddler-generation, 55-iter-1-fixes]

tech-stack:
  added: []
  patterns:
    - "File-scoped /// <reference lib=\"dom\" /> + happy-dom Window; one Window per parseHtml call; standard-lib Document cast at return boundary (mirrors scripts/editorial/convert.ts:120)"
    - "ExtractorError options-bag constructor (message, opts?: { extractor?, cause? }) — mirrors Phase 48 CaptureError"
    - "Readonly-everywhere entity interfaces; optional-in-source fields become required-with-default-in-output (empty string / empty array / 0) to give callers total shapes"
    - "Single shared tsconfig.scripts.json extends cover both scripts/markdown-export and scripts/tiddlywiki subtrees; editorial stays on its own tsconfig"

key-files:
  created:
    - scripts/tiddlywiki/extractors/types.ts
  modified:
    - tsconfig.scripts.json
    - vitest.config.ts

key-decisions:
  - "Single shared tsconfig.scripts.json (extend include glob to cover tiddlywiki) over a separate tsconfig.tiddlywiki.json — editorial + tiddlywiki share the same compilerOptions shape (ES2022 + NodeNext + no DOM lib), no composite-build benefit to splitting"
  - "ExtractorError exported as runtime value (export class, not export type) so `err instanceof ExtractorError` works at runtime in extractors and tests"
  - "parseHtml returns `document as unknown as Document` — single cast at the producer boundary lets every extractor use standard-lib DOM Element/Document types under the file-scoped lib reference"
  - "All entity fields readonly; optional-in-JSON fields become required-with-default in the output type (empty string / empty array / 0) — extractors own the defaulting, callers get a total shape with no `| undefined` noise"
  - "tsconfig.scripts.json gains an explicit exclude list covering generate.ts / sources.ts / html-to-wikitext.ts — pre-Phase-53 files that use .ts-extension imports + have a happy-dom-to-standard-DOM type mismatch. Phase 55 FIX-02 will retire this exclude when those files are refactored"

patterns-established:
  - "Shared types.ts under a script subtree owns entity contracts directly (not type re-exports from producer modules, which scripts/editorial/types.ts does) — extractors produce pure data with no producer/consumer split, so one central definitions file is idiomatic"
  - "Exclude lists in composite-project tsconfigs scope type-check coverage in Phase-boundary-aware slices, letting new subtrees be covered while deferred-scope files stay out of the build graph"

requirements-completed: []

duration: 4m 28s
completed: 2026-04-22
---

# Phase 53 Plan 01: DOM Extraction Scaffold Summary

**Shared extractor entity contracts (9 primary + 4 nested interfaces), ExtractorError class, parseHtml happy-dom helper; scripts tsconfig + vitest scripts project extended to cover scripts/tiddlywiki/**/*.ts with Phase-55-scope exclude for pre-existing tiddlywiki files**

## Performance

- **Duration:** 4m 28s
- **Started:** 2026-04-22T05:33:00Z
- **Completed:** 2026-04-22T05:37:28Z
- **Tasks:** 3
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- `scripts/tiddlywiki/extractors/types.ts` created — 9 primary entity interfaces (FaqItem, Exhibit, PersonnelEntry, FindingEntry, TechnologyEntry, Testimonial, PageContent, CaseFilesIndex) + 4 nested sub-interfaces (ExhibitSection, ExhibitSubsection, PageHeading, PageSegment, CaseFilesIndexEntry) + `PersonnelEntryType` union + runtime `ExtractorError` class + `parseHtml` helper. 16 top-level exports.
- `tsconfig.scripts.json` include glob extended to cover `scripts/tiddlywiki/**/*.ts`; explicit exclude keeps pre-Phase-53 tiddlywiki files out of the build graph.
- `vitest.config.ts` scripts project include extended to cover `scripts/tiddlywiki/**/*.test.ts` (third entry alongside existing markdown-export + editorial).
- `pnpm build` exit 0 (vue-tsc composite build + vite build + markdown export all clean).
- `pnpm test:scripts` exit 0 (23 test files, 401 tests green — editorial + markdown-export unchanged, tiddlywiki extractor tests land in Wave 2).
- Phase boundary enforced: only `types.ts` exists under `scripts/tiddlywiki/extractors/`; no other changes under `scripts/tiddlywiki/` outside the extractors subdirectory (verified via `git diff --name-only`).

## Task Commits

1. **Task 1: Create shared entity contracts + ExtractorError + parseHtml** — `83f4ad1` (feat)
2. **Task 2: Extend tsconfig.scripts.json + vitest.config.ts** — `1ff7ada` (feat)
3. **Task 3: Validate scaffold (auto-fix: exclude pre-Phase-53 tiddlywiki files)** — `2038daf` (fix)

## Files Created/Modified

- `scripts/tiddlywiki/extractors/types.ts` **(created)** — Shared entity contracts for the DOM-extractor layer. 169 lines. SCAF-08 policy comment in the header; file-scoped `/// <reference lib="dom" />`; `import { Window } from 'happy-dom'`. Exports:
  - Interfaces: `FaqItem`, `Exhibit`, `ExhibitSection`, `ExhibitSubsection`, `PersonnelEntry`, `FindingEntry`, `TechnologyEntry`, `Testimonial`, `PageContent`, `PageHeading`, `PageSegment`, `CaseFilesIndex`, `CaseFilesIndexEntry`
  - Type alias: `PersonnelEntryType` (`'individual' | 'group' | 'anonymized'`)
  - Runtime class: `ExtractorError` (options-bag constructor)
  - Function: `parseHtml(html: string): Document`
- `tsconfig.scripts.json` **(modified)** — `include` array extended from `["scripts/markdown-export/**/*.ts"]` to `["scripts/markdown-export/**/*.ts", "scripts/tiddlywiki/**/*.ts"]`; new `exclude` array added covering the three pre-Phase-53 tiddlywiki files (see Deviation 1).
- `vitest.config.ts` **(modified)** — scripts project `include` array gains `'scripts/tiddlywiki/**/*.test.ts'` as a third entry; `unit` + `browser` project configs unchanged.

## Decisions Made

- **Single shared tsconfig.scripts.json** over a new tsconfig.tiddlywiki.json. Editorial tsconfig stays on its own project (it has editorial-specific lib wiring and its own `.tsbuildinfo-editorial` outDir). Tiddlywiki extractors share the exact compilerOptions shape used by markdown-export, so a new tsconfig would be redundant and would bloat the composite project graph.
- **ExtractorError exported as runtime value** (not `export type`) so downstream `err instanceof ExtractorError` works at runtime in both extractors and test files — same pattern as Phase 48 CaptureError and Phase 47 ConfigError.
- **`document as unknown as Document` cast inside parseHtml** (single cast at the producer boundary) so every Wave-2 extractor consumes a standard-lib `Document` without re-casting per call site. Mirrors `scripts/editorial/convert.ts` line 120 (demoteHeadings cast point).
- **All entity fields `readonly`** and optional-in-JSON fields become required-with-default-in-output (empty string / empty array / 0). Extractors own the defaulting so callers receive total shapes — no `| undefined` noise at consumption sites in Wave 2 / Phase 54 / Phase 55.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug fix / scope-bound] Added explicit `exclude` list to tsconfig.scripts.json to keep pre-Phase-53 tiddlywiki files out of the build graph**

- **Found during:** Task 3 (first `pnpm build` run after Task 2 include-glob extension)
- **Issue:** Extending `tsconfig.scripts.json` `include` to cover `scripts/tiddlywiki/**/*.ts` pulled the pre-existing tiddlywiki files (`generate.ts`, `sources.ts`, `html-to-wikitext.ts`) into the composite build graph for the first time. Those files were previously only executed via `tsx` (no type-check). Compile errors surfaced:
  - `generate.ts` + `sources.ts`: `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled` (they use `.ts`-extension imports like `./sources.ts` and `./tid-writer.ts`).
  - `html-to-wikitext.ts`: `TS2345: Argument of type 'HTMLBodyElement' is not assignable to parameter of type 'Node'` (happy-dom `document.body` passed to a `renderChildren(node: Node, …)` helper — same cross-lib assignment mismatch that Phase 49 resolved in `convert.ts` with `document as unknown as Document`).
- **Why not "add `allowImportingTsExtensions: true` + fix the DOM cast"?** Phase 53 scope forbids modifying `generate.ts`, `sources.ts`, or `html-to-wikitext.ts` (explicit in 53-CONTEXT.md "Fallback Strategy & Integration Scope" and in this plan's `<verification>` clause: `git diff --name-only scripts/tiddlywiki/ | grep -v '^scripts/tiddlywiki/extractors/'` must return empty). Even if the tsconfig flag were added, the DOM-cast fix would require touching `html-to-wikitext.ts`.
- **Why not narrow the include glob to `scripts/tiddlywiki/extractors/**/*.ts`?** That would fail the plan's Task 2 acceptance grep (`grep -q 'scripts/tiddlywiki/\*\*/\*.ts' tsconfig.scripts.json`) and fail the plan's `must_haves.truths` clause `"include glob covers scripts/tiddlywiki/**/*.ts"`.
- **Fix:** Keep the broader `include` glob (per plan) and add an explicit `exclude` list covering the three files. `tid-writer.ts` stays included (clean compile, pure-Node helper, no `.ts` imports, no DOM types — type-checking it is a bonus hardening).
- **Files modified:** `tsconfig.scripts.json` (added `exclude` array with 3 entries)
- **Verification:** `pnpm build` exits 0; `pnpm test:scripts` exits 0 (23 test files / 401 tests green); all Task 2 acceptance grep patterns still pass; Phase boundary assertion passes (no changes under `scripts/tiddlywiki/` outside `extractors/`).
- **Committed in:** `2038daf` (Task 3 commit)
- **Phase 55 follow-up:** FIX-02 should retire this `exclude` list when it refactors `generate.ts` / `sources.ts` / `html-to-wikitext.ts` to consume extractor output (at which point it can either add `allowImportingTsExtensions: true` to the scripts tsconfig matching Phase 47's editorial precedent, or migrate the imports to drop the `.ts` suffix, and apply the `document as unknown as Document` cast inside `html-to-wikitext.ts`).

---

**Total deviations:** 1 auto-fixed (1 scope-bound bug fix)
**Impact on plan:** Scope-preserving. Plan's include glob string literally present in tsconfig; plan's verification constraint ("no changes to generate.ts / sources.ts / html-to-wikitext.ts") preserved; compile errors on pre-Phase-53 files handled via exclude rather than modification. No scope creep.

## Issues Encountered

- None beyond Deviation 1. All build + test gates green on final validation.

## User Setup Required

None — no external service configuration.

## Next Phase Readiness

Wave 2 (plans 53-02 through 53-09) can now add `scripts/tiddlywiki/extractors/{faq,exhibit,personnel,findings,technologies,testimonials,pages,case-files-index}.ts` + matching `*.test.ts` files and trust:

- `import { FaqItem, ExtractorError, parseHtml, … } from './types.ts'` resolves under both `pnpm build` and `pnpm test:scripts`.
- Tests are discovered by the scripts Vitest project without further config changes.
- The exclude list in `tsconfig.scripts.json` only shadows the three specific pre-Phase-53 files; any new file under `scripts/tiddlywiki/` (including extractors and their tests) compiles under the scripts tsconfig.

No blockers. Wave 2 can run 8 plans in parallel.

## Self-Check: PASSED

- `scripts/tiddlywiki/extractors/types.ts` — FOUND
- Commit `83f4ad1` (Task 1) — FOUND in git log
- Commit `1ff7ada` (Task 2) — FOUND in git log
- Commit `2038daf` (Task 3) — FOUND in git log
- `pnpm build` exit 0 — verified
- `pnpm test:scripts` exit 0 (23 files / 401 tests) — verified
- Phase boundary (no changes under `scripts/tiddlywiki/` outside `extractors/`) — verified via `git diff --name-only HEAD~3 HEAD -- scripts/tiddlywiki/ | grep -v '^scripts/tiddlywiki/extractors/'` returned empty

---
*Phase: 53-dom-extraction*
*Completed: 2026-04-22*
