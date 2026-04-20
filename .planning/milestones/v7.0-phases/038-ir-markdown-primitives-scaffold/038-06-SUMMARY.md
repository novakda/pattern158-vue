---
phase: 038-ir-markdown-primitives-scaffold
plan: 06
subsystem: markdown-export
tags: [ir, primitives, docnode, inlinespan, wikilink, typescript]

# Dependency graph
requires:
  - phase: 038-02
    provides: "DocNode/InlineSpan/HeadingNode/ParagraphNode/LinkSpan/EmphasisSpan IR type contract in scripts/markdown-export/ir/types.ts"
provides:
  - "text(s): TextSpan factory"
  - "heading(level, string | InlineSpan[]): HeadingNode factory with compile-time level narrowing"
  - "paragraph(string | InlineSpan[]): ParagraphNode factory"
  - "link(href, string | InlineSpan[]): LinkSpan factory"
  - "wikilink(target, display?): LinkSpan factory with WIKILINK_HREF_PREFIX sentinel"
  - "caption(text): ParagraphNode wrapping EmphasisSpan (VAULT-09 italic caption)"
  - "WIKILINK_HREF_PREFIX = 'wikilink://' constant for Phase 42 renderer pickup"
affects:
  - 038-07 (compound primitives — list/table/blockquote build on text/paragraph)
  - 039 (extractors compose pages via primitives)
  - 041 (mono renderer walks DocNode tree)
  - 042 (Obsidian renderer recognizes WIKILINK_HREF_PREFIX sentinel)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure IR factory pattern: each primitive accepts `string | readonly InlineSpan[]` and returns a frozen DocNode/InlineSpan — zero escape/render logic (D-09)"
    - "Convenience-arg sugar (D-10): string → [text(s)] internally; array pass-through for composed spans"
    - "Sentinel-prefix strategy for wikilinks: primitive stays renderer-agnostic, renderers branch on href.startsWith(WIKILINK_HREF_PREFIX)"
    - "TDD with `@ts-expect-error` compile-time assertions to lock HeadingLevel 1-6 narrowing"

key-files:
  created:
    - "scripts/markdown-export/primitives/text.ts"
    - "scripts/markdown-export/primitives/text.test.ts"
    - "scripts/markdown-export/primitives/heading.ts"
    - "scripts/markdown-export/primitives/heading.test.ts"
    - "scripts/markdown-export/primitives/paragraph.ts"
    - "scripts/markdown-export/primitives/paragraph.test.ts"
    - "scripts/markdown-export/primitives/link.ts"
    - "scripts/markdown-export/primitives/link.test.ts"
    - "scripts/markdown-export/primitives/wikilink.ts"
    - "scripts/markdown-export/primitives/wikilink.test.ts"
    - "scripts/markdown-export/primitives/caption.ts"
    - "scripts/markdown-export/primitives/caption.test.ts"
  modified: []

key-decisions:
  - "Wikilink sentinel exported as WIKILINK_HREF_PREFIX constant (not a magic string) so renderers and tests import the same source of truth"
  - "caption() produces paragraph > emphasis > text so both mono and Obsidian renderers render italic without branching"
  - "primitive second-arg type is `string | readonly InlineSpan[]` (readonly modifier) to accept both mutable and frozen arrays"
  - "heading() accepts HeadingLevel (1-6) with compile-time rejection of out-of-range levels via `@ts-expect-error` test cases"

patterns-established:
  - "Pattern: Pure factory primitives. Every extractor-facing API in scripts/markdown-export/primitives/ is a pure function that returns IR, never a method on a builder class. Zero side effects, zero rendering logic, zero escape logic."
  - "Pattern: Sentinel hrefs for dialect-specific links. wikilink uses a URI-scheme-shaped prefix (wikilink://) so the Phase 41 mono renderer can fall back to treating it as a normal link while the Phase 42 Obsidian renderer recognizes and rewrites it to [[target|display]] syntax."
  - "Pattern: Test files colocated next to source files (primitives/wikilink.ts + primitives/wikilink.test.ts) matched against the scripts vitest project."

requirements-completed: [PRIM-01]

# Metrics
duration: "~3 min"
completed: 2026-04-11
---

# Phase 038 Plan 06: IR Markdown Primitives (inline + simple blocks) Summary

**Six pure IR factories (text, heading, paragraph, link, wikilink, caption) shipped as zero-escape zero-render primitives, with WIKILINK_HREF_PREFIX sentinel for Phase 42 renderer pickup.**

## Performance

- **Duration:** ~3 minutes
- **Started:** 2026-04-11T02:03:42Z
- **Completed:** 2026-04-11T02:06:04Z
- **Tasks:** 2
- **Files created:** 12 (6 source + 6 test)

## Accomplishments

- Shipped the 6 foundational IR factory primitives every future extractor will compose with: `text`, `heading`, `paragraph`, `link`, `wikilink`, `caption`
- Established the `WIKILINK_HREF_PREFIX = 'wikilink://'` sentinel convention so Phase 42's Obsidian renderer can recognize and rewrite wikilinks to `[[target|display]]` syntax at render time, while Phase 41's mono renderer falls back to regular markdown links
- Locked D-09 (primitives have zero escape/render logic) and D-10 (primitives accept `string | readonly InlineSpan[]` convenience args) as compile-checked contracts via 31 passing unit tests including `@ts-expect-error` compile-time assertions for out-of-range heading levels
- All primitives type-check against the Plan 02 IR contract in `scripts/markdown-export/ir/types.ts` with NodeNext-style `.js` relative imports

## Task Commits

Each task was committed atomically:

1. **Task 1: Ship text, heading, paragraph primitives + tests** — `4bfd5ba` (feat)
2. **Task 2: Ship link, wikilink, caption primitives + tests** — `233121b` (feat)

**Plan metadata:** (see final commit below)

_Both tasks are TDD — tests were written before implementation and failed on first run, then passed on implementation commit._

## Files Created/Modified

**Created:**

- `scripts/markdown-export/primitives/text.ts` — TextSpan factory (every other primitive's base)
- `scripts/markdown-export/primitives/text.test.ts` — 5 tests (empty, unicode, NBSP, HTML entities, markdown chars)
- `scripts/markdown-export/primitives/heading.ts` — HeadingNode factory with level 1-6 narrowing
- `scripts/markdown-export/primitives/heading.test.ts` — 6 tests including `@ts-expect-error` for levels 0 and 7
- `scripts/markdown-export/primitives/paragraph.ts` — ParagraphNode factory, accepts empty array
- `scripts/markdown-export/primitives/paragraph.test.ts` — 5 tests including newline-preservation contract
- `scripts/markdown-export/primitives/link.ts` — regular LinkSpan factory
- `scripts/markdown-export/primitives/link.test.ts` — 5 tests (anchor, URL, pre-built children, no-validation)
- `scripts/markdown-export/primitives/wikilink.ts` — wikilink factory + `WIKILINK_HREF_PREFIX` export
- `scripts/markdown-export/primitives/wikilink.test.ts` — 6 tests including escape-free contract lock
- `scripts/markdown-export/primitives/caption.ts` — caption factory producing paragraph > emphasis > text
- `scripts/markdown-export/primitives/caption.test.ts` — 4 tests including block-level guarantee

## Decisions Made

- **WIKILINK_HREF_PREFIX as exported constant, not magic string.** Tests and both renderers import the same source of truth (`from './wikilink.js'`), so changing the prefix would be a single-source edit. Wikilink test has an explicit case asserting `result.href.startsWith(WIKILINK_HREF_PREFIX)` to lock this convention.
- **caption() produces ParagraphNode (block-level), not standalone EmphasisSpan.** VAULT-09 requires captions to flow as their own block following the (skipped) image. Wrapping in paragraph ensures renderers emit the italic with proper block separation without branching.
- **`readonly InlineSpan[]` second-arg type.** Accepts both mutable arrays and `as const`/readonly arrays without force-casts at call sites. Callers can still compose arrays inline with spread without copying.
- **Heading level narrowing lives in the type, not the factory.** `HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6` from `ir/types.ts` does all the work — the factory has no runtime guard and no runtime cost. Invalid levels fail at compile time (verified by `@ts-expect-error` tests).

## Deviations from Plan

None — plan executed exactly as written. Both tasks completed on first pass with all verification checks green.

## Issues Encountered

**Parallel wave race visibility:** Sibling agent 038-07 (compound primitives) is writing `primitives/list.ts` and `primitives/list.test.ts` in parallel. While running `pnpm test:scripts`, the sibling's `list.test.ts` existed before its `list.ts`, causing a transient full-project failure unrelated to this plan. Mitigated by running a targeted test command with explicit file paths for only the 6 files owned by this plan (text/heading/paragraph/link/wikilink/caption). All 31 tests for this plan's files passed on both Task 1 and Task 2 verification. Similarly, `pnpm exec vue-tsc -b` flagged a transient TS2307 in `primitives/list.test.ts` — also sibling-owned and explicitly out of scope per the parallel execution protocol ("leave them alone — they belong to 038-07"). This plan's 12 files all type-check clean.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- 038-07 (compound primitives: list, table, blockquote) can proceed — all three will compose with `paragraph()` and/or raw `InlineSpan[]` from this plan's primitives
- Phase 39 extractors can begin importing from `scripts/markdown-export/primitives/` to compose PageDoc bodies
- Phase 42 Obsidian renderer has a clear sentinel contract: `import { WIKILINK_HREF_PREFIX } from '../primitives/wikilink.js'` and branch on `link.href.startsWith(WIKILINK_HREF_PREFIX)`
- Phase 41 mono renderer can render wikilinks as regular markdown links by stripping the prefix and looking up the slug — no branching on `kind` needed at that layer

## Self-Check

**Files created (expected 12):**

- `scripts/markdown-export/primitives/text.ts` — FOUND
- `scripts/markdown-export/primitives/text.test.ts` — FOUND
- `scripts/markdown-export/primitives/heading.ts` — FOUND
- `scripts/markdown-export/primitives/heading.test.ts` — FOUND
- `scripts/markdown-export/primitives/paragraph.ts` — FOUND
- `scripts/markdown-export/primitives/paragraph.test.ts` — FOUND
- `scripts/markdown-export/primitives/link.ts` — FOUND
- `scripts/markdown-export/primitives/link.test.ts` — FOUND
- `scripts/markdown-export/primitives/wikilink.ts` — FOUND
- `scripts/markdown-export/primitives/wikilink.test.ts` — FOUND
- `scripts/markdown-export/primitives/caption.ts` — FOUND
- `scripts/markdown-export/primitives/caption.test.ts` — FOUND

**Commits (verified against `git log`):**

- `4bfd5ba` — Task 1 (text, heading, paragraph)
- `233121b` — Task 2 (link, wikilink, caption)

**Tests:** 31 passing across 6 primitive test files (targeted run: `pnpm exec vitest run --project scripts scripts/markdown-export/primitives/{text,heading,paragraph,link,wikilink,caption}.test.ts`).

**Forbidden patterns:** zero `@/`, `os.EOL`, `Date.now(`, `new Date(`, `from '../escape` matches in any of the 6 source files. All escape/render/emit/stringify mentions are in comments describing what primitives intentionally DO NOT do.

## Self-Check: PASSED

---
*Phase: 038-ir-markdown-primitives-scaffold*
*Completed: 2026-04-11*
