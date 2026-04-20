---
phase: 038-ir-markdown-primitives-scaffold
plan: 03
subsystem: markdown-export
tags: [markdown, gfm, obsidian, escape, wikilink, code-block, vitest]

requires:
  - phase: 038-01
    provides: scripts/markdown-export scaffold, tsconfig.scripts.json, pnpm test:scripts
provides:
  - escapeProse helper (ESCP-01) with backslash-first GFM escape set + BOM strip + HTML-ampersand entity
  - escapeTableCell helper (ESCP-02) as prose superset with CRLF/LF to <br> normalization
  - escapeWikilinkTarget helper (ESCP-03) with filesystem sanitization + wikilink markdown escape
  - escapeCodeBlockContent helper (ESCP-04) implementing GFM longer-fence-wins rule
  - 53 co-located unit tests covering empty strings, HTML entities, NBSP, BOM, unicode surrogate pairs, fence escalation
affects: [038-05-frontmatter-serializer, 041-monolithic-renderer, 042-obsidian-vault-renderer]

tech-stack:
  added: []
  patterns:
    - "Context-specific escape helpers: one pure function per markdown rendering context (prose, table cell, wikilink target, code block)"
    - "Single-pass escape contract: escapeProse must not be composed with itself — backslash is escaped first to guarantee idempotent output shape"
    - "Delegation over duplication: escapeTableCell imports escapeProse rather than duplicating character tables"
    - "Filesystem-first sanitization for wikilink targets: reserved chars sanitized to '-' before markdown escape to prevent Obsidian note-filename collisions"
    - "Content-preserving fence escalation: escapeCodeBlockContent returns {content, fence} so caller assembles the fence, content is never mutated"

key-files:
  created:
    - scripts/markdown-export/escape/prose.ts
    - scripts/markdown-export/escape/prose.test.ts
    - scripts/markdown-export/escape/table-cell.ts
    - scripts/markdown-export/escape/table-cell.test.ts
    - scripts/markdown-export/escape/wikilink.ts
    - scripts/markdown-export/escape/wikilink.test.ts
    - scripts/markdown-export/escape/code-block.ts
    - scripts/markdown-export/escape/code-block.test.ts
  modified: []

key-decisions:
  - "Prose ( and ) parentheses are NOT in the D-19 escape set; plan test case included them erroneously — test fixed to match D-19 authoritative spec"
  - "Filesystem sanitization dominates markdown escape for wikilink backslash: '\\' becomes '-' not '\\\\' because Obsidian cannot save notes with backslashes in the filename"
  - "escapeCodeBlockContent uses Math.max(3, longestRun + 1) so the default fence stays at 3 backticks when content has no triple-backticks"
  - "Table cell CRLF replacement runs before LF replacement to avoid emitting <br><br> for a single CRLF sequence"

patterns-established:
  - "Pattern: Context-scoped escape functions — each helper owns exactly one target context and has a bounded, documented character set (no cross-contamination)"
  - "Pattern: NodeNext explicit .js extension on relative imports inside scripts/markdown-export/**"
  - "Pattern: Co-located .test.ts files next to source modules under scripts/markdown-export/**"

requirements-completed: [ESCP-01, ESCP-02, ESCP-03, ESCP-04]

duration: 4m
completed: 2026-04-10
---

# Phase 038 Plan 03: Escape Helpers Summary

**Four context-specific markdown escape helpers (prose, table cell, wikilink target, code block) with 53 unit tests, zero cross-contamination between character sets, and a single-pass backslash-first contract**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-11T01:55:00Z (approx)
- **Completed:** 2026-04-11T01:59:00Z (approx)
- **Tasks:** 2
- **Files created:** 8

## Accomplishments

- escapeProse (ESCP-01): 12-char GFM escape set + HTML ampersand entity + BOM strip + NBSP preservation, single-pass backslash-first contract
- escapeTableCell (ESCP-02): prose superset + CRLF/LF to `<br>` normalization via `split('\r\n')` before `split('\n')`
- escapeWikilinkTarget (ESCP-03): 8-char filesystem sanitization (reserved chars to `-`) then 5-char wikilink markdown escape (`|`, `[`, `]`, `#`, `^`)
- escapeCodeBlockContent (ESCP-04): GFM longer-fence-wins rule, returns `{ content, fence }` with content never mutated
- 53 unit tests across four co-located test files, all passing under `pnpm test:scripts`
- Zero forbidden APIs (no `@/`, `os.EOL`, `Date.now()`, `new Date()`)

## Task Commits

Each task was committed atomically with `--no-verify` (parallel Wave 2 execution):

1. **Task 1: escapeProse + escapeTableCell** — `9ff7100` (feat)
2. **Task 2: escapeWikilinkTarget + escapeCodeBlockContent** — `6a5f887` (feat)

## Files Created/Modified

- `scripts/markdown-export/escape/prose.ts` — escapeProse with 12-char escape table, backslash-first ordering
- `scripts/markdown-export/escape/prose.test.ts` — 18 tests covering empty string, plain text, each escape char, ampersand entity, NBSP, BOM, surrogate pairs, combined chars
- `scripts/markdown-export/escape/table-cell.ts` — escapeTableCell delegating to escapeProse then CRLF/LF to `<br>`
- `scripts/markdown-export/escape/table-cell.test.ts` — 10 tests covering prose delegation, newline variants, mixed content
- `scripts/markdown-export/escape/wikilink.ts` — escapeWikilinkTarget with FILESYSTEM_RESERVED + MARKDOWN_ESCAPES arrays
- `scripts/markdown-export/escape/wikilink.test.ts` — 17 tests covering each reserved char, each markdown escape char, realistic exhibit filename scenario
- `scripts/markdown-export/escape/code-block.ts` — escapeCodeBlockContent with regex-based longest-run detection
- `scripts/markdown-export/escape/code-block.test.ts` — 8 tests covering default fence, 4-backtick escalation, 5-backtick escalation, content preservation

## Decisions Made

- **Test expectation for combined special chars fixed:** plan line 252 expected `\\[link\\]\\(x)` escaping parens, but D-19 authoritative spec (plan lines 67, 254) explicitly excludes `(` and `)` from the prose set. Test updated to `\\[link\\](x)` to match the authoritative spec. Applied as Rule 1 (test-spec bug fix) rather than modifying source to escape parens, because adding parens would break link-text rendering in downstream primitives.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed prose.test.ts combined-special-chars expectation**
- **Found during:** Task 1 (running `pnpm test:scripts` after initial file creation)
- **Issue:** Plan task `<behavior>` and `<action>` section 2 both contained a test assertion expecting parentheses to be escaped (`\\[link\\]\\(x)`), but the plan's own authoritative D-19 character set and the inline code comment both state parentheses are NOT in the prose escape set. Contradiction within the plan.
- **Fix:** Updated expected value in `prose.test.ts` from `'\\`code\\` \\*bold\\* \\[link\\]\\(x) \\#h'` to `'\\`code\\` \\*bold\\* \\[link\\](x) \\#h'` to match the D-19 spec. Source `prose.ts` was already correct (does not escape parens).
- **Files modified:** scripts/markdown-export/escape/prose.test.ts
- **Verification:** `pnpm exec vitest run scripts/markdown-export/escape/` reports 53/53 passing
- **Committed in:** 9ff7100 (Task 1 commit, fix applied before commit)

---

**Total deviations:** 1 auto-fixed (1 bug in plan test spec)
**Impact on plan:** Minimal. Source implementation matches D-19 verbatim; only a plan-internal test assertion contradiction was reconciled in favor of the authoritative character-set spec. No scope creep.

## Issues Encountered

- **Parallel-wave git staging race (informational, not a Task 1/2 failure):** First `git commit` for Task 1 was blocked by a pre-tool lint hook. Between the blocked attempt and the retry, another parallel Wave 2 agent (plan 02 working on ir/types) staged its files. The retry commit `ce24c93` ended up with plan 02's files under a plan 03 commit message. Correct Task 1 commit is `9ff7100`; orchestrator-level parallel-wave cleanup (if any) should ignore the mislabeled commit. Both commits are present in history and the escape helper files are all in my intended commit (`9ff7100`).
- **Out-of-scope test failures from other Wave 2 agents:** `scripts/markdown-export/frontmatter/serialize.test.ts` cannot resolve `./serialize.js` — this is plan 038-04's in-progress work and is explicitly out of scope per the scope boundary rule. Not fixed, not blocking my escape tests.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All four escape helpers are ready for consumption by Phase 41 monolithic renderer and Phase 42 Obsidian vault renderer.
- The `escapeProse` single-pass contract must be enforced at the renderer layer: renderers should call `escapeProse` exactly once per span, never on already-escaped strings.
- `escapeCodeBlockContent` caller assembly pattern: `${fence}${info}\n${content}\n${fence}` — downstream code-block primitive in 038-02 (IR Wave 2 sibling) or later primitives plan should wire this.
- Table cell newline semantics are locked: `<br>` replacement, not `&NewLine;` or literal newline (GFM tables forbid literal newlines).

## Self-Check: PASSED

**Files exist:**
- FOUND: scripts/markdown-export/escape/prose.ts
- FOUND: scripts/markdown-export/escape/prose.test.ts
- FOUND: scripts/markdown-export/escape/table-cell.ts
- FOUND: scripts/markdown-export/escape/table-cell.test.ts
- FOUND: scripts/markdown-export/escape/wikilink.ts
- FOUND: scripts/markdown-export/escape/wikilink.test.ts
- FOUND: scripts/markdown-export/escape/code-block.ts
- FOUND: scripts/markdown-export/escape/code-block.test.ts

**Commits exist:**
- FOUND: 9ff7100 (Task 1: escapeProse + escapeTableCell)
- FOUND: 6a5f887 (Task 2: escapeWikilinkTarget + escapeCodeBlockContent)

**Test suite:** 53/53 escape tests passing (`pnpm exec vitest run scripts/markdown-export/escape/`)

---
*Phase: 038-ir-markdown-primitives-scaffold*
*Completed: 2026-04-10*
