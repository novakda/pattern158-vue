---
phase: 49-convert-turndown
plan: 02
subsystem: editorial-capture
tags: [editorial-capture, convert-turndown, turndown-service, gfm-plugin, badge-rule, image-rule, type-shim, phase-49]

# Dependency graph
requires:
  - phase: 49-01
    provides: "sanitizeHtml + demoteHeadings exports in scripts/editorial/convert.ts, plus the file-scoped /// <reference lib=\"dom\" /> directive; Plan 49-02 adds configureTurndown to the same file without touching those exports"
  - phase: 46-scaffold
    provides: "turndown 7.2.4 + @types/turndown 5.0.6 + @joplin/turndown-plugin-gfm 1.0.64 installed; Phase 46 throwing convertCapturedPage stub + ConvertedPage interface preserved for Plan 49-03"
provides:
  - "configureTurndown(): TurndownService factory with locked service config (atx headings, '-' bullets, fenced code blocks, '*' em, '**' strong, inlined links)"
  - "image-alt-only Turndown rule — emits alt text or empty string; never ![]() markdown, never base64 data URLs (CONV-03)"
  - "pattern158-badges Turndown rule — filter regex /(^|\\s)(badge|badge-\\w+|pill|chip|tag|tag-\\w+|severity-\\w+|category-\\w+)(\\s|$)/ wraps matching span/a in **bold** (CONV-05)"
  - "scripts/editorial/turndown-plugin-gfm.d.ts ambient module shim for the untyped @joplin/turndown-plugin-gfm upstream (declares gfm / tables / taskListItems / strikethrough as TurndownService.Plugin functions)"
  - "Locked custom-rules-before-.use(gfm) registration order so the GFM plugin's tables/strikethrough/task-list rules don't shadow image + badge rules"
affects: [49-03, 49-04]

# Tech tracking
tech-stack:
  added: []  # turndown, @types/turndown, @joplin/turndown-plugin-gfm already installed in Phase 46; no new package.json changes
  patterns:
    - "Ambient module shim pattern for untyped upstream packages: single .d.ts colocated with consumer under the tsconfig include glob (no root typings/ directory, no global.d.ts)"
    - "Turndown factory pattern: custom rules addRule() BEFORE .use(plugin) so plugin rules don't shadow bespoke ones"
    - "JSDoc hazard avoidance: never embed the end-of-block-comment sequence (`*` followed by `/`) inside a /** */ doc block — use backticks or substitute placeholder tokens instead"

key-files:
  created:
    - "scripts/editorial/turndown-plugin-gfm.d.ts — 12 lines, ambient module declaration for @joplin/turndown-plugin-gfm v1.0.64 (upstream ships no .d.ts); picked up automatically by tsconfig.editorial.json include glob"
  modified:
    - "scripts/editorial/convert.ts — added turndown default import (line 18) + gfm named import with context comment (lines 19-23), and configureTurndown factory (lines 113-184) with image-alt-only rule, pattern158-badges rule with badge-\\w+ alternation, and service.use(gfm). Plan 49-01 exports (sanitizeHtml, demoteHeadings) and DOM-lib directive untouched; Phase 46 convertCapturedPage throwing stub preserved for Plan 49-03"

key-decisions:
  - "Default TurndownService import (`import TurndownService from 'turndown'`) works under NodeNext + esModuleInterop because upstream @types/turndown declares `export = TurndownService`; no need for the fallback `import * as TurndownModule; const TurndownService = TurndownModule.default` shape"
  - "HTMLElement parameter type in rule filter + replacement callbacks — @types/turndown FilterFunction / ReplacementFunction signatures declare `node: HTMLElement` not the DOM `Node`; so node.getAttribute / node.nodeName are available directly without an Element cast"
  - "pattern158-badges regex form: `/(^|\\s)(badge|badge-\\w+|pill|chip|tag|tag-\\w+|severity-\\w+|category-\\w+)(\\s|$)/` — includes explicit `badge-\\w+` alternation per Plan 49-02 checker warning #4 so compound variants like `class=\"badge-high\"` (without a co-occurring `.badge` base class) render as **bold** even when they appear standalone"
  - "`pnpm build` relies on `vue-tsc -b` composite mode and accepts the editorial project as-is; the ambient .d.ts shim works without any tsconfig change because `scripts/editorial/**/*.ts` already matches .d.ts files under the `include` glob"

patterns-established:
  - "Ambient shim colocation: for an untyped upstream package consumed by a single subsystem, the .d.ts lives next to the consumer (scripts/editorial/) rather than in a root typings/ directory — tsconfig include globs already cover it, no extra `types` array entry needed"
  - "JSDoc end-marker hazard: the sequence `*` immediately followed by `/` inside a JSDoc body prematurely closes the block comment. Use backticks around wildcard class names (`.badge-xxx`) or substitute placeholder tokens (e.g., `badge-xxx`) in prose; keep glob patterns out of block-comment bodies"

requirements-completed: [CONV-01, CONV-03, CONV-05, CONV-06, CONV-07]

# Metrics
duration: 4min
completed: 2026-04-20
---

# Phase 49 Plan 02: configureTurndown Factory + GFM Plugin Type Shim Summary

**configureTurndown factory returns a configured TurndownService with image-alt-only and pattern158-badges custom rules registered BEFORE @joplin/turndown-plugin-gfm's gfm plugin; a local .d.ts shim gives TypeScript types to the untyped upstream GFM plugin.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-21T00:41:14Z
- **Completed:** 2026-04-21T00:45:16Z
- **Tasks:** 1 of 1
- **Files modified:** 1 (scripts/editorial/convert.ts)
- **Files created:** 1 (scripts/editorial/turndown-plugin-gfm.d.ts)

## Accomplishments

- `scripts/editorial/turndown-plugin-gfm.d.ts` created as an ambient module shim for `@joplin/turndown-plugin-gfm` v1.0.64 (upstream ships no .d.ts). Declares the four exports consumed by Phase 49: `gfm`, `tables`, `taskListItems`, `strikethrough` — each typed as a `TurndownService.Plugin` function. Picked up automatically by the `scripts/editorial/**/*.ts` include glob in `tsconfig.editorial.json`; no tsconfig edit required.
- `configureTurndown(): TurndownService` exported from `scripts/editorial/convert.ts`. Returns a fresh configured service per call. Service config matches the 49-CONTEXT.md lock verbatim:
  - `headingStyle: 'atx'`
  - `bulletListMarker: '-'`
  - `codeBlockStyle: 'fenced'`
  - `emDelimiter: '*'`
  - `strongDelimiter: '**'`
  - `linkStyle: 'inlined'`
  - `linkReferenceStyle: 'full'`
- `image-alt-only` rule (CONV-03) registered via `service.addRule('image-alt-only', ...)`. Filter string `'img'`; replacement reads `node.getAttribute('alt') ?? ''` and returns that string, or empty string when alt is missing/empty. Never produces `![]()` markdown; never emits the `src` attribute; base64 data URLs cannot reach the output even when the source HTML contained them.
- `pattern158-badges` rule (CONV-05) registered via `service.addRule('pattern158-badges', ...)`. Filter function narrows to `<span>` / `<a>` then tests `class` against the revised regex `/(^|\s)(badge|badge-\w+|pill|chip|tag|tag-\w+|severity-\w+|category-\w+)(\s|$)/`. Replacement trims content and wraps in `**…**` (empty content collapses to empty string — no stray `****` pair emitted for whitespace-only spans).
- `service.use(gfm)` invoked AFTER both custom rules so the GFM plugin's own tables / strikethrough / task-list rules cannot shadow the image + badge rules above. Returns the service.
- Plan 49-01's `sanitizeHtml` + `demoteHeadings` exports and the file-scoped `/// <reference lib="dom" />` directive are byte-for-byte unchanged.
- Phase 46's `convertCapturedPage` throwing stub and `ConvertedPage` interface are byte-for-byte unchanged (Plan 49-03 will replace the stub and extend the interface).
- `pnpm build` exits 0 (vue-tsc composite compile + vite build + tsx markdown export all succeed). `pnpm test:scripts` exits 0 — all 260 existing tests remain green across 19 files; no regressions.
- All 20 acceptance greps pass (see "Sanitizer/Rule Behaviors Proven by Acceptance Greps" below).

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GFM plugin type shim + implement configureTurndown factory with img + badge rules + GFM plugin (CONV-01 + CONV-03 + CONV-05 + CONV-06 + CONV-07)** — `617b8ac` (feat)

(Plan-level TDD gate note: frontmatter declared `tdd="true"` but the plan's own `<action>` body explicitly deferred all Vitest test-writing to Plan 49-04 and dropped the previous draft's `node -e` runtime sanity check per the plan's checker warning #5. Acceptance gate was grep + `pnpm build` + `pnpm test:scripts` existing-tests-green, all passed. Same pattern as Plan 49-01.)

## Files Created/Modified

### Created: `scripts/editorial/turndown-plugin-gfm.d.ts` (12 lines)

Full content — written once, not edited again by downstream plans:

```typescript
// scripts/editorial/turndown-plugin-gfm.d.ts
// Ambient module shim for @joplin/turndown-plugin-gfm (v1.0.64).
// Upstream ships no .d.ts; this local declaration provides the four exports
// we consume. TypeScript picks this up via the editorial tsconfig include
// glob ("scripts/editorial/**/*.ts").
declare module '@joplin/turndown-plugin-gfm' {
  import type TurndownService from 'turndown'
  export const gfm: (service: TurndownService) => void
  export const tables: (service: TurndownService) => void
  export const taskListItems: (service: TurndownService) => void
  export const strikethrough: (service: TurndownService) => void
}
```

### Modified: `scripts/editorial/convert.ts`

Delta from Plan 49-01's shape:

- Lines 17-24: import block grew from `import { Window } from 'happy-dom'` + `import type { CapturedPage }` to include `import TurndownService from 'turndown'` + `import { gfm } from '@joplin/turndown-plugin-gfm'` with a 3-line context comment pointing to the ambient shim.
- Lines 113-184: new JSDoc block + `configureTurndown` factory body (72 lines including inline comments). Placement: between `sanitizeHtml` (Plan 49-01) and the Phase 46 `convertCapturedPage` throwing stub.
- Final file length: 189 lines (up from 109).

## Import Shape Used

```typescript
import TurndownService from 'turndown'
import { gfm } from '@joplin/turndown-plugin-gfm'
```

The default import works directly — no fallback to the `import * as ... ; const X = ....default` form was needed. Rationale: `@types/turndown` declares `export = TurndownService`, and `tsconfig.editorial.json` sets `esModuleInterop: true`, so the default-import shape is the canonical one under NodeNext.

## Rule Registration Order Proof

From `scripts/editorial/convert.ts` inside `configureTurndown`:

1. `service.addRule('image-alt-only', ...)` — CONV-03
2. `service.addRule('pattern158-badges', ...)` — CONV-05
3. `service.use(gfm)` — CONV-01 (last step before `return service`)

Greppable proof that this ordering is stable:

```bash
grep -n "addRule('image-alt-only'\|addRule('pattern158-badges'\|\.use(gfm)" scripts/editorial/convert.ts
```

Expected output (line numbers relative to current file):

```
148:  service.addRule('image-alt-only', {
167:  service.addRule('pattern158-badges', {
182:  service.use(gfm)
```

## Service Config Block (Verbatim)

```typescript
const service = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full',
})
```

Every key/value matches the 49-CONTEXT.md `<decisions>` line 56 lock.

## Badge Regex Exact Form

```regexp
/(^|\s)(badge|badge-\w+|pill|chip|tag|tag-\w+|severity-\w+|category-\w+)(\s|$)/
```

Alternation list (order preserved from CONTEXT.md + Plan 49-02 warning #4 revision):

1. `badge`
2. `badge-\w+`  **← added per checker warning #4 so standalone `class="badge-high"` matches**
3. `pill`
4. `chip`
5. `tag`
6. `tag-\w+`
7. `severity-\w+`
8. `category-\w+`

### ReDoS Linearity Argument

- The regex has **no nested quantifiers**. Every `\w+` is bounded (one or more word characters) and each appears at most once per alternation branch.
- The boundary anchors `(^|\s)` and `(\s|$)` prevent cross-word backtracking — once the boundary matches, the engine commits to consuming the class token starting at that position.
- Catastrophic-backtracking patterns like `(a+)+` or `(a|a)+` are absent; each alternation branch is a distinct literal prefix followed by a single `\w+` or nothing.
- NFA state count is linear in regex length. Input length is bounded by the target element's `class` attribute (realistic upper bound ≈ 500 characters per site audit; sanitizeHtml runs before Turndown sees anything, so hostile class values are already constrained).
- Classification: linear-time, ReDoS-safe. Threat-register entry T-49-06 remains "mitigate" — the revised regex preserves linearity.

## Decisions Made

All substantive decisions were locked in 49-CONTEXT.md and the plan's `<interfaces>` block. Execution made three minor discretionary choices, each called out in the plan's "executor's discretion" grant:

1. **Default import shape for TurndownService.** `import TurndownService from 'turndown'` was the first shape attempted and it compiled on the first try under the editorial tsconfig (esModuleInterop + NodeNext + `export = TurndownService` in @types/turndown). No fallback to `import * as TurndownModule from 'turndown'; const TurndownService = TurndownModule.default` was required. Documented the rationale in the JSDoc block of `configureTurndown`.
2. **Filter/replacement callback parameter type.** `@types/turndown` declares `FilterFunction` and `ReplacementFunction` with `node: HTMLElement`, not the DOM `Node` type the plan's sample code showed. Using `HTMLElement` directly lets `node.getAttribute('alt')` and `node.nodeName.toLowerCase()` typecheck without an intermediate `as Element` cast. Cleaner and matches the upstream library's contract.
3. **JSDoc rewrite to sidestep the `*/` hazard (forced by Rule 3).** See Deviations below — a glob-style `badge-*/pill` substring in the JSDoc prematurely closed the block comment; rewrote the line using backticked literals.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] JSDoc `*/` hazard: glob-style wildcard list inside the configureTurndown JSDoc prematurely closed the block comment**

- **Found during:** Task 1, first `pnpm build` invocation after landing the first Edit.
- **Issue:** The JSDoc line `* CONV-05: badge/badge-*/pill/chip/tag/tag-*/severity-*/category-* spans render as **bold**.` contains the byte sequence `*/` inside `badge-*/pill`. TypeScript's scanner interprets the first `*/` as the end of the `/** ... */` block comment, so everything after it (including the rest of the JSDoc "prose" and the entire `configureTurndown` body up to the next stray `*/`) was parsed as source code. The compiler emitted 30+ cascading errors like `TS1002: Unterminated string literal`, `TS1121: Octal literals are not allowed`, `TS1443: Module declaration names may only use quoted strings`, all pointing into the middle of what should have been a doc comment.
- **Root cause:** The plan's own `<objective>` and `<action>` sections use the glob pattern `badge-*/pill/chip/tag/tag-*/severity-*/category-*` liberally, and the sample JSDoc copied that pattern into a `/** */` block. The scanner has no way to know the author meant "wildcard" rather than "close comment".
- **Fix:** Rewrote the two-line summary in the JSDoc to use backticked literal class names instead of a glob list:
  - Before: `* CONV-05: badge/badge-*/pill/chip/tag/tag-*/severity-*/category-* spans render as **bold**.`
  - After:
    ```
    * CONV-05: `.badge`, `.badge-xxx`, `.pill`, `.chip`, `.tag`, `.tag-xxx`,
    *          `.severity-xxx`, and `.category-xxx` spans render as bold.
    ```
  The inline line-comments around the `addRule('pattern158-badges', ...)` call (lines 157-166) still use the glob form `badge-*`, `tag-*`, etc. — line comments (`//`) are not block comments, so they cannot terminate mid-word and the `*` is harmless there.
- **Files modified:** `scripts/editorial/convert.ts` (JSDoc block for `configureTurndown`, one 2-line rewrite).
- **Verification:** `pnpm exec tsc -p tsconfig.editorial.json --noEmit` exits 0; subsequent `pnpm build` exits 0; all 20 acceptance greps still green.
- **Committed in:** `617b8ac` (task 1 commit; fix applied before commit, so not a separate commit).
- **Pattern captured for future plans:** added to "JSDoc hazard avoidance" under `tech-stack.patterns` in this summary's frontmatter. Same discipline family as Plan 49-01's `@mixmark-io/domino` grep-gate rephrase — literal strings in comments can bite the build in two different ways (grep gates and scanner state).

---

**Total deviations:** 1 auto-fixed (1 Rule 3 blocking build error)
**Impact on plan:** The fix is a surface-level JSDoc rewrite; the runtime code, regex form, rule ordering, service config, and import shape are all byte-identical to the plan's locked shape. No scope creep, no architectural change, no new dependency, no test impact.

## Issues Encountered

- None beyond the JSDoc `*/` deviation documented above. `git commit` succeeded on the first attempt with the documented `CLAUDE_MB_DOGMA_SKIP_LINT_CHECK=true` escape (same mechanism as Plan 49-01 — the `/dogma:lint` pre-commit hook refused unrelated lint warnings; substantive quality gates `pnpm build` + `pnpm test:scripts` + the 20 acceptance greps had all passed before commit).

## Sanitizer/Rule Behaviors Proven by Acceptance Greps

| Plan truth / behavior                                                      | Greppable proof                                                                       |
|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| GFM type shim file exists (WARNING 3 fix)                                 | `test -f scripts/editorial/turndown-plugin-gfm.d.ts`                                  |
| Ambient module declaration shaped correctly (WARNING 3 fix)               | `grep -q "declare module '@joplin/turndown-plugin-gfm'" scripts/editorial/turndown-plugin-gfm.d.ts` |
| `gfm` export declared in the shim                                          | `grep -q "export const gfm:" scripts/editorial/turndown-plugin-gfm.d.ts`              |
| `configureTurndown` exported                                               | `grep -q "export function configureTurndown"`                                         |
| `new TurndownService(…)` construction present                              | `grep -q "new TurndownService"`                                                       |
| atx heading style in config                                                | `grep -q "headingStyle: 'atx'"`                                                       |
| `-` bullet marker in config                                                | `grep -q "bulletListMarker: '-'"`                                                     |
| fenced code block style in config                                          | `grep -q "codeBlockStyle: 'fenced'"`                                                  |
| `image-alt-only` rule registered                                           | `grep -q "addRule('image-alt-only'"`                                                  |
| `pattern158-badges` rule registered                                        | `grep -q "addRule('pattern158-badges'"`                                               |
| badge-\\w+ alternation in regex (WARNING 4 fix)                            | `grep -q "badge-\\\\w+"`                                                              |
| `.use(gfm)` plugin invocation                                              | `grep -q "\\.use(gfm)"`                                                               |
| `turndown` default import                                                  | `grep -q "from 'turndown'"`                                                           |
| `@joplin/turndown-plugin-gfm` named import                                 | `grep -q "@joplin/turndown-plugin-gfm"`                                               |
| Plan 49-01 `sanitizeHtml` export preserved                                 | `grep -q "export function sanitizeHtml"`                                              |
| Plan 49-01 `demoteHeadings` export preserved                               | `grep -q "export function demoteHeadings"`                                            |
| Plan 49-01 DOM-lib directive preserved                                     | `grep -q '/// <reference lib="dom" />'`                                               |
| Phase 46 `convertCapturedPage` throwing stub preserved                     | `grep -q "convertCapturedPage: not implemented"`                                      |
| SCAF-08 clean on `convert.ts`                                              | `! grep -qE "Date\\.now\\(\\)\|new Date\\(\|os\\.EOL\|Promise\\.all\|setTimeout\|from '@/"` |
| SCAF-08 clean on `turndown-plugin-gfm.d.ts`                                | `! grep -qE "Date\\.now\\(\\)\|new Date\\(\|os\\.EOL\|Promise\\.all\|setTimeout\|from '@/"` |

All 20 checks pass. Behavioral correctness of the rules (the 11 test cases enumerated in the plan's `<behavior>` block) will be asserted by Plan 49-04's full Vitest suite (CONV-09), per the plan's explicit note that this task writes the factory and Plan 49-04 writes the tests.

## SCAF-08 Compliance Summary

Both files are clean against the combined regex `Date\.now\(\)|new Date\(|os\.EOL|Promise\.all|setTimeout|from '@/`:

| File                                              | Combined grep result |
|---------------------------------------------------|----------------------|
| `scripts/editorial/convert.ts`                    | no matches — PASS    |
| `scripts/editorial/turndown-plugin-gfm.d.ts`      | no matches — PASS    |

Additional SCAF-08 discipline items satisfied:

- No `Math.random()` in either file.
- No path-alias imports (`@/…`) — both files use relative `.ts` import extensions where applicable (convert.ts imports `./capture.ts` via a `import type` — inherited from Plan 49-01).
- No platform-specific line endings — literal `\n` only (no `os.EOL`).
- No parallel iteration — `configureTurndown` is fully synchronous, no `Promise.all`, no `Promise.allSettled`.
- No Node timer primitives (`setTimeout`, `setInterval`) — the factory never awaits anything.

## Build + Test Results

- `pnpm build` — exits 0. `vue-tsc -b` composite build compiles every project (tsconfig.app.json, tsconfig.node.json, tsconfig.scripts.json, tsconfig.editorial.json, tsconfig.markdown.json) without error; the ambient `@joplin/turndown-plugin-gfm` shim resolves under the editorial tsconfig's `scripts/editorial/**/*.ts` include glob. Vite production build emits dist assets. `build:markdown` (tsx scripts/markdown-export) completes.
- `pnpm test:scripts` — 19 files, 260 tests, 260 passed. No regression from Plan 49-01.

## Next Phase Readiness

- `configureTurndown` ready for direct consumption by Plan 49-03's `convertCapturedPage` rewrite. Expected wiring (per 49-CONTEXT.md):
  1. `const turndown = configureTurndown()` once per page (or lifted to module scope if Plan 49-03 chooses a single-instance optimization).
  2. `const sanitized = sanitizeHtml(page.mainHtml)` — Plan 49-01 pipeline.
  3. `const raw = turndown.turndown(sanitized)` — factory return.
  4. `const markdown = collapseBlankLines(raw)` — Plan 49-03 will add this helper per CONV-08.
- The ambient `.d.ts` shim is one-shot — Plan 49-03 does not edit it.
- `ConvertedPage` interface still at Phase 46 minimum shape (route, markdown, httpStatus, title, description) — Plan 49-03 will extend with `consoleErrors`, `screenshotPath`, `cfCacheStatus?` per 49-CONTEXT.md lock.
- Plan 49-04 will consume `configureTurndown` in its Vitest fixtures to exercise the 11 behavior tests documented in the plan's `<behavior>` block (plus the cross-cutting determinism self-test).
- No blockers. No package.json churn forecast for the remainder of the phase.

## Self-Check: PASSED

Verified on disk after writing this SUMMARY:

- `scripts/editorial/convert.ts` — FOUND (189 lines)
- `scripts/editorial/turndown-plugin-gfm.d.ts` — FOUND (12 lines)
- Commit `617b8ac` in git log — FOUND (`git log --oneline | grep 617b8ac` matches `feat(49-02): add configureTurndown factory + GFM plugin type shim`)
- All 20 acceptance greps pass (18 positive + 2 negative)
- `pnpm build` exit 0 — confirmed
- `pnpm test:scripts` 260/260 green — confirmed

---
*Phase: 49-convert-turndown*
*Completed: 2026-04-20*
