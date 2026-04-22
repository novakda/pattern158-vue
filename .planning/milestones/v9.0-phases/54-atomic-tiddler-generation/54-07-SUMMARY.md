---
phase: 54-atomic-tiddler-generation
plan: 07
subsystem: generators
tags: [tiddlywiki, generators, integrity, cross-links, atomic-tiddler, atom-05, consumer, tdd, scaf-08]

# Dependency graph
requires:
  - phase: 54-atomic-tiddler-generation
    plan: 01
    provides: >
      Tiddler type re-export via scripts/tiddlywiki/generators/types.ts
      (sourced from scripts/tiddlywiki/tid-writer.ts). Phase 54 Plan 01
      established the single import surface all Wave-2 generators consume.
provides:
  - verifyCrossLinkIntegrity(tiddlers) — pure function that walks every
    tiddler body, extracts every [[target]] / [[display|target]] link via
    the CONTEXT-locked regex, and returns { orphans: { source, link }[] }
    for every link whose target is not a known tiddler title.
  - Orphan + IntegrityResult type exports (readonly shapes) from
    scripts/tiddlywiki/generators/integrity-check.ts
  - Deterministic output contract: orphans sorted ascending by
    (source, link) tuple for byte-stable JSON.stringify output.
  - Hermetic test suite (11 it cases across 11 describe blocks) including
    a deliberately-orphaned fixture proving detection works AND a clean
    fixture proving happy path yields orphans=[].
affects:
  - 54-08 (Wave-3 wiring / phase summary — uses integrity checker in
    cross-wave acceptance assertions)
  - 55-XX (FIX-02 smoke gate — will run verifyCrossLinkIntegrity against
    the real generated tiddler set)
  - 56-XX (TEST-04 full-corpus integrity — will consume this same API
    against full real extractor output)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ES2020 String#matchAll with /g flag + capture-group-1 extraction for CONTEXT-locked link-syntax regex"
    - "Set<string> of tiddler titles for O(1) orphan membership checks"
    - "Stable lexicographic sort by (source, link) tuple for deterministic output ordering"
    - "TDD RED then GREEN split across two atomic commits (test(54-07) → feat(54-07))"
    - "Inline Tiddler object-literal fixtures (hermetic, no fs I/O) — extends Phase 53/54-01 convention"

key-files:
  created:
    - scripts/tiddlywiki/generators/integrity-check.ts
    - scripts/tiddlywiki/generators/integrity-check.test.ts
  modified: []

key-decisions:
  - "LINK_REGEX = /\\[\\[([^\\]|]+)(?:\\|[^\\]]+)?\\]\\]/g verbatim from CONTEXT.md line 41. Group 1 = pre-pipe segment; Phase 54 generators emit only unpiped [[X]] links so the pipe-form path is defensive (and documented by test 6)."
  - "No orphan deduping. Two [[Ghost]] links in the same body produce two Orphan entries. Deferred until a generator actually emits duplicate inline links (Phase 54 generators do not)."
  - "Empty-input short-circuit returns { orphans: [] } without entering the title-set build or body-scan loops."
  - "Sort by (source, link) ascending for deterministic JSON.stringify output across repeated calls (required by idempotency test 10)."
  - "matchAll + match[1] rather than String#match + capture parsing — matchAll with /g returns RegExpMatchArray per iteration with [1] = first capture group; ES2020, in spec under tsconfig.scripts.json lib=ES2022."

patterns-established:
  - "Pattern: cross-link integrity check consumes the same [[title]] wikitext the generator producer half (ATOM-05 producer in 54-06) emits — identical regex both sides guarantees round-trip consistency."
  - "Pattern: hermetic Tiddler fixtures via a tiddler(title, text) factory helper inside each test file (no shared fixture module, no fs)."

requirements-completed: [ATOM-05]

# Metrics
duration: 2m31s
completed: 2026-04-22
---

# Phase 54 Plan 07: Cross-link integrity checker (ATOM-05 consumer half) Summary

**ATOM-05 consumer delivered: `verifyCrossLinkIntegrity(tiddlers)` walks every tiddler body via the CONTEXT-locked `/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g` regex, flags every link whose target is not a known tiddler title, and returns `{ orphans: { source, link }[] }` sorted ascending by (source, link) for deterministic output.**

## Performance

- **Duration:** 2m31s
- **Started:** 2026-04-22T07:15:45Z
- **Completed:** 2026-04-22T07:18:16Z
- **Tasks:** 2 (RED test + GREEN implementation)
- **Files created:** 2
- **Files modified:** 0

## Accomplishments

- Shipped the consumer half of ATOM-05: pure function `verifyCrossLinkIntegrity(tiddlers)` that detects every `[[target]]` link whose target is not a known tiddler title in the input set.
- Locked the link-extraction regex verbatim to CONTEXT.md line 41 (`/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g`) — group 1 is the pre-pipe segment, consistent both for unpiped `[[X]]` and pipe-form `[[Display|Target]]` tokens. Phase 54 generators emit only unpiped links; the pipe-form behavior is defensive and documented by a dedicated test.
- Locked deterministic output contract: orphans array sorted ascending by (source, link) tuple so `JSON.stringify(result)` is byte-identical across repeated calls.
- Proved consumer correctness with 11 hermetic test cases across 11 describe blocks — clean fixture (zero orphans), deliberate orphan (detection works), multi-orphan same source, multi-orphan different sources, unpiped link resolves, pipe-form regex-locked behavior, empty input, deterministic ordering, no-links body, idempotency, and link-embedded-in-prose.
- Executed full RED → GREEN TDD cycle as two atomic commits.

## Task Commits

Each task committed atomically:

1. **Task 1: Write integrity-check.test.ts (RED) — ATOM-05 consumer coverage** — `78ede7d` (test)
2. **Task 2: Implement integrity-check.ts (GREEN)** — `6f4148a` (feat)

**Plan metadata commit:** _(pending — captures SUMMARY.md + STATE.md + ROADMAP.md + REQUIREMENTS.md)_

## Files Created

- `scripts/tiddlywiki/generators/integrity-check.ts` (52 lines) — exports `verifyCrossLinkIntegrity(tiddlers: readonly Tiddler[]): IntegrityResult`, `IntegrityResult`, `Orphan`. Module-scoped `LINK_REGEX` = `/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g` (verbatim CONTEXT lock). Uses `String#matchAll` + `match[1]` for group-1 target extraction. `Set<string>` title index for O(1) membership. Stable lexicographic sort by (source, link). Empty-input short-circuit. No I/O, no side effects.
- `scripts/tiddlywiki/generators/integrity-check.test.ts` (139 lines) — 11 describe blocks, 11 it cases. Inline `tiddler(title, text)` factory; no shared fixture module, no fs I/O. Imports `verifyCrossLinkIntegrity` from `./integrity-check.ts` and `Tiddler` type from `./types.ts`.

## Exported Symbols

| Symbol | Kind | Signature |
| --- | --- | --- |
| `verifyCrossLinkIntegrity` | function | `(tiddlers: readonly Tiddler[]) => IntegrityResult` |
| `IntegrityResult` | interface | `{ readonly orphans: readonly Orphan[] }` |
| `Orphan` | interface | `{ readonly source: string; readonly link: string }` |

## Regex Lock (verbatim from CONTEXT.md line 41)

```
/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
```

- Group 1 = target title (pre-pipe segment)
- Optional non-capturing `(?:\|[^\]]+)?` consumes the display portion of pipe-form links
- `g` flag enables `String#matchAll` iteration
- Unpiped `[[Home]]` → group 1 = `'Home'`
- Pipe-form `[[Display|Target]]` → group 1 = `'Display'` (documented by test 6; Phase 54 generators do not emit pipe-form)

## Orphan Ordering Rule

Orphans sorted ascending by (source, link) tuple:
1. Primary key: `source` string (ascending lexicographic)
2. Secondary key: `link` string (ascending lexicographic)

Test 8 asserts this exact order for two sources × three links:
```
[ { source: 'A-Source', link: 'Ghost-C' },
  { source: 'Z-Source', link: 'Ghost-A' },
  { source: 'Z-Source', link: 'Ghost-B' } ]
```

Idempotency test 10 asserts byte-identical `JSON.stringify(result)` across two sequential calls on the same input.

## Test Results

- **Describe count:** 11 (≥ 10 required by acceptance criteria)
- **It-case count:** 11 (all green)
- **Pass rate:** 11/11 (100%)
- **Runtime:** ~104ms (transform 22ms, import 27ms, tests 4ms)
- **Deliberate-orphan fixture:** test 2 (`describe: deliberate orphan`) — asserts `verifyCrossLinkIntegrity([tiddler('Home', 'See [[Ghost]].')]).orphans` equals `[{ source: 'Home', link: 'Ghost' }]`. Confirmed passing.
- **Clean fixture:** test 1 (`describe: clean fixture`) — three tiddlers (Home, Exhibit A, Exhibit B) where every `[[target]]` resolves; asserts `orphans === []`. Confirmed passing.

## Scenario Coverage

| # | Describe | Scenario |
| --- | --- | --- |
| 1 | clean fixture | all links resolve → orphans=[] |
| 2 | deliberate orphan | unknown [[Ghost]] → single orphan |
| 3 | multi-orphan same source | [[Ghost]] + [[Phantom]] from one body → 2 orphans |
| 4 | multi-orphan different sources | [[Ghost]] from A and B → 2 orphans |
| 5 | unpiped link resolves | [[Exhibit A]] with Exhibit A present → clean |
| 6 | pipe-form documented | [[Display Text\|Target]] → group 1 = 'Display Text' flagged as orphan (locked semantics) |
| 7 | empty input | `verifyCrossLinkIntegrity([])` → orphans=[] |
| 8 | deterministic ordering | sorted by (source, link) asc |
| 9 | no links in body | plain prose contributes 0 orphans |
| 10 | idempotency | byte-identical JSON.stringify across two calls |
| 11 | link embedded in prose | [[Known Tiddler]] inside surrounding text resolves |

## Decisions Made

See `key-decisions` frontmatter above. Summary:

- **Regex locked verbatim from CONTEXT.md** — no redesign; the `/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g` pattern is the contract both producer (54-06) and consumer (54-07) halves agree on. Pipe-form behavior (group 1 = pre-pipe segment) is defensive — documented by test 6 — because Phase 54 generators emit only unpiped `[[X]]` links.
- **No orphan deduping** — two `[[Ghost]]` links in the same body yield two Orphan entries. Phase 54 generators do not emit duplicate inline links, so no dedupe contract is needed yet. The public shape (`readonly Orphan[]`) does not forbid adding a Set-based dedupe pass later without breaking callers.
- **Stable sort by (source, link) ascending** — enables byte-identical `JSON.stringify` output across repeated calls (idempotency test 10) and predictable diff output for future corpus integrity reports (Phase 55 smoke gate, Phase 56 TEST-04).
- **Empty-input short-circuit** — returns `{ orphans: [] }` without entering the title-set build loop, matching the semantic "no tiddlers means no cross-links to check".
- **`String#matchAll` over `String#match(/g/)`** — matchAll returns a full RegExpMatchArray per match (with `[1]` = capture group 1), whereas `match` with `/g` returns only full-match strings and loses capture groups. ES2020 feature, in-spec under `tsconfig.scripts.json` lib=ES2022.

## Deviations from Plan

None — plan executed exactly as written. Task 1 (RED) and Task 2 (GREEN) each passed their acceptance criteria on the first run. No Rule-1/2/3 auto-fixes required; no Rule-4 checkpoints triggered.

**Total deviations:** 0
**Impact on plan:** None.

## Issues Encountered

One cross-plan observation: `pnpm build` (the plan-level verify gate) fails with TS2307 errors from three unrelated plans running in parallel — `person.test.ts` (54-02), `technology.test.ts` (54-04), and `exhibit-cross-links.test.ts` (54-06) — each importing a sibling implementation file that those plans' GREEN tasks have not yet committed. Per SCOPE BOUNDARY rule, these are out-of-scope failures caused by in-flight parallel executors, not by 54-07 changes.

Verification that 54-07 files type-check cleanly in isolation:
- `pnpm exec vue-tsc --noEmit --project tsconfig.scripts.json` (scripts subproject) exits 0
- `pnpm test:scripts --run scripts/tiddlywiki/generators/integrity-check.test.ts` passes 11/11
- No errors reference `integrity-check.ts` or `integrity-check.test.ts` in any TS diagnostic

The `pnpm build` gate will pass once the sibling Wave-2 plans (54-02, 54-04, 54-06) ship their GREEN commits. Plan 54-07's work is complete and verifiable in isolation.

## TDD Gate Compliance

Plan frontmatter carries `type: execute`, but both tasks used `tdd="true"` and produced the expected gate sequence:

- RED gate commit: `78ede7d` (`test(54-07): add failing integrity-check.test.ts (RED) for ATOM-05 consumer`)
- GREEN gate commit: `6f4148a` (`feat(54-07): implement generators/integrity-check.ts (GREEN) for ATOM-05`)
- REFACTOR: not required — implementation was minimal and clean on first GREEN.

## Wave-3 Readiness

- `scripts/tiddlywiki/generators/integrity-check.ts` ready for import by Phase 54 Plan 08 (Wave-3 wiring / phase summary).
- API contract for downstream consumers (Phase 55 FIX-02 smoke gate, Phase 56 TEST-04 corpus integrity):
  ```typescript
  import { verifyCrossLinkIntegrity } from './generators/integrity-check.ts'
  import type { IntegrityResult, Orphan } from './generators/integrity-check.ts'

  const result: IntegrityResult = verifyCrossLinkIntegrity(allTiddlers)
  if (result.orphans.length > 0) {
    // deterministic sorted (source, link) list — safe to diff, safe to assert on
  }
  ```
- Round-trip consistency with ATOM-05 producer (54-06): the identical `/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g` pattern both emits (implicit via the producer's `[[title]]` wikitext token format) and consumes, guaranteeing a closed cross-link graph when both halves agree on tiddler titles.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Plan 54-07 complete. Safe for parallel continuation of sibling Wave-2 plans (54-02, 54-03, 54-04, 54-05, 54-06). Wave-3 (plan 54-08) remains gated behind full Wave-2 completion.

## Self-Check: PASSED

Verified:
- `scripts/tiddlywiki/generators/integrity-check.ts` exists (52 lines)
- `scripts/tiddlywiki/generators/integrity-check.test.ts` exists (139 lines)
- Commit `78ede7d` present in git log (RED)
- Commit `6f4148a` present in git log (GREEN)
- 11/11 tests pass
- Scripts subproject type-check exits 0
- No SCAF-08 forbidden tokens in either file
- No JSDoc-style comments in either file
- Regex verbatim from CONTEXT.md line 41 present in implementation
- `verifyCrossLinkIntegrity`, `IntegrityResult`, `Orphan` all exported

---
*Phase: 54-atomic-tiddler-generation*
*Completed: 2026-04-22*
