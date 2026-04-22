---
phase: 53-dom-extraction
plan: 06
subsystem: tooling
tags: [extractor, technologies, happy-dom, tdd, EXTR-05, dom-extraction]

requires:
  - phase: 53-dom-extraction
    plan: 01
    provides: Shared types.ts exporting TechnologyEntry + parseHtml happy-dom helper
provides:
  - emitTechnologies(html, opts?) pure extractor yielding readonly TechnologyEntry[]
  - V1 locked contract: paren-inner commas split naively (Test 3)
  - Caller-supplied sourceExhibitLabel via opts-bag (default '' when omitted)
affects:
  - 54-atomic-tiddler-generation
  - 55-iter-1-fixes

tech-stack:
  added: []
  patterns:
    - "NodeList.forEach on row selector + for-of on split tokens — SCAF-08 sequential iteration; string[] is iterable in ES2022 without lib.DOM.Iterable"
    - "Literal-ampersand selector `td[data-label=\"Technologies & Tools\"]` — happy-dom decodes &amp; in attribute values so querySelector matches on the decoded string"
    - "Two-level early-exit: `if (toolsText.length === 0) return` skips the row inside forEach; `continue` inside for-of skips empty tokens after split"
    - "Readonly return type `readonly TechnologyEntry[]` — matches Phase-53 entity shape discipline"

key-files:
  created:
    - scripts/tiddlywiki/extractors/technologies.ts
    - scripts/tiddlywiki/extractors/technologies.test.ts
  modified: []

key-decisions:
  - "V1 locked contract: tools cells with parenthesized inline notes (e.g. 'cross-domain communication (postMessage, EasyXDM)') split naively on the paren-inner comma — Test 3 pins this behavior. Phase 54 atomic tiddler logic can post-process if needed; extractor stays dumb + pure"
  - "Selector uses literal ampersand `td[data-label=\"Technologies & Tools\"]` not `&amp;` — happy-dom decodes HTML entities into attribute values before querySelector matches, so the literal is correct"
  - "sourceExhibitLabel defaults to '' when opts is omitted — consistent with Phase 53 entity-shape discipline (optional-in-JSON becomes required-with-default-in-output)"
  - "Empty tools cell skips the row entirely (no entries) — matches Plan 53-06 must_have 'Missing .technologies-table yields empty array' extended to empty-cell rows"

requirements-completed: [EXTR-05]

duration: 3m 56s
completed: 2026-04-22
---

# Phase 53 Plan 06: Technologies Extractor Summary

**`emitTechnologies(html, opts?)` comma-splits `td[data-label="Technologies & Tools"]` from a `.technologies-table` on an exhibit detail page into `readonly TechnologyEntry[]`, sharing each row's Category as context. V1 locked behavior: paren-inner commas also split (tested explicitly).**

## Performance

- **Duration:** 3m 56s
- **Started:** 2026-04-22T05:43:08Z
- **Completed:** 2026-04-22T05:47:04Z
- **Tasks:** 2
- **Files modified:** 2 (2 created, 0 modified)

## Accomplishments

- `scripts/tiddlywiki/extractors/technologies.ts` created — `emitTechnologies(html, opts?)` parses `table.technologies-table tbody tr`, reads `td[data-label="Category"]` as row context, comma-splits `td[data-label="Technologies & Tools"]` into one `TechnologyEntry` per non-empty trimmed token. Uses shared `parseHtml` helper from `./types.ts`. SCAF-08 clean (no timers, no `Date`, no `Promise.all`).
- `scripts/tiddlywiki/extractors/technologies.test.ts` created — 6 describe blocks / 6 `it` cases covering the full EXTR-05 contract:
  - Single-technology row (`'LMS Platforms'` → 1 entry)
  - Comma-split multi-entry (`'SCORM 1.2, SCORM 2004, AICC'` → 3 entries sharing context)
  - Parenthesized inner-comma split locked as V1 contract (3 entries: `'cross-domain communication (postMessage'`, `'EasyXDM)'`, `'same-origin workarounds'`)
  - Empty tools cell → no entries
  - No `.technologies-table` → empty array
  - Idempotency (byte-identical `JSON.stringify` across two calls)
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/technologies.test.ts` exits 0 — 6/6 tests green.
- TDD gate sequence preserved: `test(53-06)` RED commit → `feat(53-06)` GREEN commit.

## Task Commits

1. **Task 1: Write technologies.test.ts (RED)** — `57c2584` (test)
2. **Task 2: Implement technologies.ts (GREEN)** — `8c1c0b4` (feat)

## Files Created/Modified

- `scripts/tiddlywiki/extractors/technologies.ts` **(created)** — 39 lines. Module-level const selectors (`ROW_SELECTOR`, `CATEGORY_SELECTOR`, `TOOLS_SELECTOR`); private `textOf(el | null): string` helper; exported `emitTechnologies(html, opts?): readonly TechnologyEntry[]`. Documents the `&amp;` → `&` attribute-decoding rationale in a block comment above `TOOLS_SELECTOR`.
- `scripts/tiddlywiki/extractors/technologies.test.ts` **(created)** — 89 lines. Module-level `TECH_HTML` constant (2-row fixture: eLearning Protocols 3-tool row + LMS Platforms 1-tool row) used across tests 1/2/6; per-test inline HTML fixtures for tests 3/4/5. Vitest globals (`describe`/`it`/`expect`) — no explicit import. Hermetic: no fs I/O, no `__fixtures__/` reads.

## Decisions Made

- **V1 contract: paren-inner commas split naively.** Test 3 explicitly locks this — a tools cell `'cross-domain communication (postMessage, EasyXDM), same-origin workarounds'` yields 3 entries with names `['cross-domain communication (postMessage', 'EasyXDM)', 'same-origin workarounds']`. The plan's `<interfaces>` block explicitly documented this decision with the "keep extractor dumb + pure" rationale; the test pins it so Phase 54 atomic tiddler logic knows the contract and can post-process if needed.
- **Literal ampersand in selector.** `TOOLS_SELECTOR = 'td[data-label="Technologies & Tools"]'` — not `&amp;`. happy-dom (like all DOM parsers) decodes `&amp;` in attribute values into `&` before the attribute is exposed to `querySelector`. Tested implicitly by the HTML fixture which uses `&amp;` in the HTML source yet the selector matches. A one-line comment in the source documents this.
- **Empty tools cell skipped entirely.** `if (toolsText.length === 0) return` early-exits the row callback before the comma-split loop runs, yielding 0 entries for that row. Avoids emitting a single spurious `{ name: '', ...}` entry. Test 4 pins this.
- **Default `sourceExhibitLabel` to `''`.** `opts?.sourceExhibitLabel ?? ''` — same defaulting pattern as other Phase 53 extractors (required-with-default-in-output per Plan 53-01's entity-shape discipline).

## Deviations from Plan

### Out-of-Scope Discovery (logged and subsequently resolved by parallel executor)

**1. [Rule: scope-boundary → RESOLVED by Plan 53-02] `pnpm build` failed with pre-existing Wave-2 systemic TS errors**

- **Found during:** Task 2 acceptance gate (`pnpm build; test $? -eq 0`)
- **Symptom observed:** `pnpm build` failed with two classes of TS errors in EVERY Wave-2 test file (all 8 sibling extractor `*.test.ts` files, including my `technologies.test.ts`):
  - `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled` — on `from './X.ts'` imports
  - `TS2593: Cannot find name 'describe' / 'it'` and `TS2304: Cannot find name 'expect'` — Vitest globals not in `tsconfig.scripts.json` `types: ["node"]`
- **Verification this was pre-existing:** `git stash` of all my changes + `pnpm build` at the pre-Plan-53-06 HEAD reproduced identical errors across sibling plans. My changes introduced no new error classes.
- **Why Plan 53-06 did not fix:** Plan 53-06 scope is strictly limited to `scripts/tiddlywiki/extractors/technologies.ts` + `technologies.test.ts`. Fixing this required modifying `tsconfig.scripts.json` — which would touch every other Wave-2 plan's scope too. Per `<deviation_rules>` `SCOPE BOUNDARY`: out-of-scope discoveries log to `deferred-items.md`, do NOT auto-fix.
- **Resolution:** While Plan 53-06 was drafting its SUMMARY, parallel executor landed commit `619c82e` (`fix(53-02): add vitest/globals + allowImportingTsExtensions to scripts tsconfig`) — Plan 53-02 executor applied exactly the fix documented in `deferred-items.md` as an in-scope auto-fix (Rule 3) within its own FAQ extractor plan. Post-fix, `pnpm build` exits 0 AND `pnpm test:scripts --run scripts/tiddlywiki/extractors/technologies.test.ts` still exits 0 (6/6 green). Both Plan 53-06 gate requirements now met.
- **Files modified by Plan 53-06:** `.planning/phases/53-dom-extraction/deferred-items.md` (created — kept in the repo as a historical record of the wave-coordination discovery; fix-ownership attribution for Plan 53-02 now appended in-file).

---

**Total deviations:** 0 plan-code deviations; 1 out-of-scope infrastructure discovery (logged; independently resolved by Plan 53-02 executor before Plan 53-06 SUMMARY finalized).
**Impact on plan:** Plan 53-06 code is correct and test-verified. Plan-level `pnpm build` gate passes after Plan 53-02's concurrent `tsconfig.scripts.json` fix.

## TDD Gate Compliance

- RED gate: `test(53-06): add failing tests for technologies extractor (RED)` — `57c2584` (test-only commit; test file fails with `Cannot find module './technologies.ts'` when run at this commit)
- GREEN gate: `feat(53-06): implement emitTechnologies (GREEN)` — `8c1c0b4` (implementation commit; all 6 tests pass at this commit)
- REFACTOR gate: not needed (implementation is 39 lines; selectors extracted to module-level consts from the start; no smell emerged)

## Issues Encountered

- Git stash conflict during build-state verification (minor): popping the stash to diff pre/post-Plan-53-06 state triggered a merge note about untracked Wave-2 sibling `.ts` files from parallel executors. Resolved with a targeted `git stash drop`; no impact on Plan 53-06 commits or file contents. Artifact only — did not affect correctness of Task 1 or Task 2.

## User Setup Required

None — no external service configuration.

## Next Phase Readiness

- Phase 54 ATOM-03 (one technology per atomic tiddler) can `import { emitTechnologies } from '../../scripts/tiddlywiki/extractors/technologies.ts'` (or wherever the import boundary lands after Phase 55 FIX-02) and trust:
  - `readonly TechnologyEntry[]` return shape with required `name` / `context` / `sourceExhibitLabel` fields — no `| undefined` noise.
  - Idempotent JSON serialization across calls (locked by Test 6).
  - Paren-inner comma split is a KNOWN V1 behavior, not a bug — post-processing must handle it at the caller boundary if balanced-paren tokens are needed.

- Wave-2 build-gate blocker RESOLVED by commit `619c82e` (Plan 53-02 auto-fix): `tsconfig.scripts.json` now has `allowImportingTsExtensions: true` + `types: ["node", "vitest/globals"]`. `pnpm build` exits 0 at current HEAD.

## Self-Check: PASSED

- `scripts/tiddlywiki/extractors/technologies.ts` — FOUND
- `scripts/tiddlywiki/extractors/technologies.test.ts` — FOUND
- `.planning/phases/53-dom-extraction/53-06-SUMMARY.md` — FOUND
- `.planning/phases/53-dom-extraction/deferred-items.md` — FOUND (historical record; issue resolved by Plan 53-02 `619c82e`)
- Commit `57c2584` (Task 1 RED) — FOUND in git log
- Commit `8c1c0b4` (Task 2 GREEN) — FOUND in git log
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/technologies.test.ts` exit 0, 6 tests passed — re-verified post-619c82e
- `pnpm build` exit 0 — re-verified post-619c82e (full build clean: vue-tsc composite + vite + markdown-export)

---
*Phase: 53-dom-extraction*
*Completed: 2026-04-22*
