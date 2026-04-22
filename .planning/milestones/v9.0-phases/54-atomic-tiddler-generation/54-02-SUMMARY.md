---
phase: 54-atomic-tiddler-generation
plan: 02
subsystem: generators
tags: [tiddlywiki, generators, person, atom-01, tdd, scaf-08]

# Dependency graph
requires:
  - phase: 54-atomic-tiddler-generation
    plan: 01
    provides: >
      scripts/tiddlywiki/generators/types.ts (Tiddler + PersonnelEntry
      re-exports) and scripts/tiddlywiki/generators/helpers.ts
      (formatExhibitTitle, wikiLink) — Wave-1 scaffold
provides:
  - Atomic person-tiddler generator (scripts/tiddlywiki/generators/person.ts)
    exporting emitPersonTiddlers(entries, opts: { client }): Tiddler[] with
    identity-keyed bucket merge, locked title/tag format, and deterministic
    alphabetical exhibit back-reference output
  - Hermetic 9-test suite (scripts/tiddlywiki/generators/person.test.ts)
    across 8 describe blocks covering happy / anonymized-empty /
    anonymized-named / group / multi-exhibit-merge / exhibit-order /
    empty / idempotency / disambiguation behaviors
affects:
  - 54-08 (Wave-3 wiring / summary)
  - 55 (FIX-02 integrates generators into main pipeline)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Identity-keyed bucketing via Map<string, { representative, exhibitLabels: Set<string> }> — collapses repeated PersonnelEntry rows for the same person across multiple exhibits"
    - "Alphabetical key sort + Set→sorted-array label emission for deterministic, idempotent output"
    - "TDD RED/GREEN across two atomic commits (test(54-02) → feat(54-02)) with partial commit (git commit -o) on GREEN to avoid index-race with sibling Wave-2 plans"

key-files:
  created:
    - scripts/tiddlywiki/generators/person.ts
    - scripts/tiddlywiki/generators/person.test.ts
  modified: []

key-decisions:
  - "Identity key formula: named entries use '{name}|{entryType}|{organization}' so two 'John Smith' entries at different organizations produce two distinct tiddlers; anonymized-empty-name entries fall back to '{role}|{organization}|anonymized' so the identity aligns with the generated title inputs"
  - "Tag order LOCKED to ['person', '[[{Client}]]', 'entry-type-{individual|group|anonymized}'] per ATOM-01 CONTEXT.md line 34 — Client tag emitted as literal [[...]]-bracketed string because tid-writer's formatTagsField will pass it through unchanged (matches exhibit-tiddler pattern in sources.ts)"
  - "Title rule: titleFor(entry) returns entry.name when trimmed name is non-empty, regardless of entryType; only when name is empty does it fall back to '{role} @ {organization}' — 'name wins' semantics still let anonymized entries carry names like 'Redacted-01'"
  - "Body header degrades gracefully: when name is empty the title already carries {role} @ {organization}, so bodyFor suppresses organization in the header to avoid duplication (entryType='anonymized' + empty name path); named entries get the full 'role, organization, title' header"
  - "exhibitLabels stored as Set<string> to dedupe accidental same-entry-in-one-exhibit duplicates; labels converted to sorted array before rendering for alphabetical determinism"
  - "Bucket emission order uses Array.from(buckets.keys()).sort() — sorted by identity key, not insertion order — so two runs of the same input produce byte-identical Tiddler[] output"
  - "fields: {} (empty record) on every emitted Tiddler — Phase 55 FIX-02 is responsible for created/modified field threading once pipeline wiring lands; tid-writer's serializer skips empty-value fields"
  - "Helpers reused: wikiLink(formatExhibitTitle(label)) composes the [[Exhibit X]] body token from Wave-1 helpers (Plan 54-01); no re-implementation of formatting logic"

patterns-established:
  - "Pattern: identity-keyed bucket merge for atomic-tiddler generators that collapse multi-exhibit PersonnelEntry[] into one tiddler per unique person — direct template for Plan 54-04 (technology tiddlers aggregating exhibit back-refs)"
  - "Pattern: Wave-2 GREEN commit via git commit -o <pathspec> to isolate partial commit from untracked sibling-plan files produced in parallel (prevents index races)"
  - "Pattern: name-wins title rule for anonymized entries (only empty-name falls back to role@org synthesis)"

requirements-completed: [ATOM-01]

# Metrics
duration: 2m33s
completed: 2026-04-22
---

# Phase 54 Plan 02: Atomic Tiddler Generation — Person Generator Summary

**`emitPersonTiddlers(entries, { client })` produces one Tiddler per unique person, disambiguated by identity key (name+entryType+organization or role+org+anonymized), with locked tag order `['person', '[[{Client}]]', 'entry-type-{type}']` and an alphabetically-sorted `[[Exhibit X]]` back-reference list in the body.**

## Performance

- **Duration:** 2m33s
- **Started:** 2026-04-22T07:15:28Z
- **Completed:** 2026-04-22T07:18:01Z
- **Tasks:** 2 (RED test + GREEN implementation)
- **Files created:** 2
- **Files modified:** 0

## Accomplishments

- Delivered ATOM-01: atomic person-tiddler generator with identity-keyed bucket merge collapsing repeated PersonnelEntry rows across multiple exhibits into one tiddler per unique person.
- Locked tag order per CONTEXT.md line 34: `['person', '[[{Client}]]', 'entry-type-{individual|group|anonymized}']` — Client literally bracketed (tid-writer passes through unchanged).
- Title rule "name wins": `titleFor(entry)` uses `entry.name` if non-empty regardless of entryType; only empty-name entries fall back to `{role} @ {organization}`.
- Deterministic output: alphabetical bucket-key sort + Set→sorted-array label emission → byte-identical `JSON.stringify` across repeated calls.
- Hermetic test suite (8 describe blocks / 9 it cases) covers happy, anonymized-empty, anonymized-named, group, multi-exhibit-merge, exhibit-sort, empty, idempotency, and organization-disambiguation.
- Full RED → GREEN TDD cycle as two atomic commits; plan-level `pnpm build` and `pnpm test:scripts` both exit 0.

## Task Commits

Each task committed atomically:

1. **Task 1: Write person.test.ts (RED) — ATOM-01 behavior coverage** — `3bb8fca` (test)
2. **Task 2: Implement person.ts (GREEN) — emitPersonTiddlers with identity-keyed grouping** — `39df8d8` (feat)

**Plan metadata commit:** _(pending — captures SUMMARY.md + STATE.md + ROADMAP.md + REQUIREMENTS.md)_

## Files Created/Modified

- `scripts/tiddlywiki/generators/person.ts` — exports `emitPersonTiddlers(entries: readonly PersonnelEntry[], opts: { client: string }): Tiddler[]` + `EmitPersonOpts` interface. Module-private: `identityKey`, `titleFor`, `bodyFor` helpers and `PersonBucket` interface. Imports `formatExhibitTitle` + `wikiLink` from `./helpers.ts`, and type-imports `PersonnelEntry` + `Tiddler` from `./types.ts`. No I/O, no side effects.
- `scripts/tiddlywiki/generators/person.test.ts` — 8 describe blocks, 9 it cases. Hermetic inline PersonnelEntry fixtures; imports from `./person.ts` and `./types.ts`; no `readFile`/`__fixtures__`/`setTimeout`/`Date`.

## Exported Symbol + Signature

```typescript
export interface EmitPersonOpts {
  readonly client: string
}

export function emitPersonTiddlers(
  entries: readonly PersonnelEntry[],
  opts: EmitPersonOpts,
): Tiddler[]
```

## Identity Key Formula

| Entry shape                      | Identity key                               |
| -------------------------------- | ------------------------------------------ |
| Named (any entryType)            | `{name}|{entryType}|{organization}`        |
| Anonymized + empty name          | `{role}|{organization}|anonymized`         |

**Disambiguation behavior:**
- Two "John Smith" PersonnelEntry rows at different `organization` values → 2 distinct tiddlers.
- Two "Jane Doe" rows at same org, same entryType, different `sourceExhibitLabel` → 1 tiddler with 2 exhibit back-refs.
- One "Jane Doe" + one anonymous `'' / DevOps / Acme Corp` at the same org → 2 distinct tiddlers (name-branch key vs anonymized-branch key).

## Title Format Branch Table

| Condition                            | Title                               | Example                     |
| ------------------------------------ | ----------------------------------- | --------------------------- |
| `name.trim().length > 0`             | `entry.name`                        | `Jane Doe`, `Redacted-01`   |
| `name === ''` (any entryType)        | `{role} @ {organization}`           | `DevOps @ Acme Corp`        |

Name wins over entryType: an entry with `entryType='anonymized'` and `name='Redacted-01'` produces title `Redacted-01`, NOT the role@org synthesis. Only truly empty-name entries fall back to synthesis.

## Tag Format (LOCKED)

```typescript
tags: [
  'person',
  `[[${opts.client}]]`,
  `entry-type-${entry.entryType}`,
]
```

- Index 0 always the literal `'person'`.
- Index 1 the client name wrapped in `[[ ]]` (e.g. `'[[Acme Corp]]'`) — tid-writer's `formatTagsField` passes already-bracketed multi-word tags through unchanged.
- Index 2 always `entry-type-{individual|group|anonymized}` — typed off `PersonnelEntryType` union, so an unknown type would fail extraction upstream.

## Body Format

```
{role}[, {organization}][, {title}]

! Appears in

* [[Exhibit A]]
* [[Exhibit B]]
```

- Header parts joined with `', '`; any empty field is omitted.
- Organization is included in the header ONLY when name is non-empty (anonymized-empty-name path suppresses org in header because the title already carries it).
- Exhibit back-refs sorted alphabetically; produced via `wikiLink(formatExhibitTitle(label))` helper composition.
- When ALL header parts are empty, body starts directly with `! Appears in`.

## Test Results

- **Scenario count:** 9 it cases across 8 describe blocks
- **Coverage:** individual happy path, anonymized empty-name fallback, anonymized with name (name-wins), group entryType tag, multi-exhibit merge, deterministic exhibit sort, empty input, idempotency, organization disambiguation
- **Pass rate:** 9/9 (100%)
- **Runtime:** ~110ms (transform 27ms, import 33ms, tests 4ms)

## Idempotency Confirmation

Test "emitPersonTiddlers — idempotency" asserts `JSON.stringify(first) === JSON.stringify(second)` on two sequential calls with the same input. Confirmed PASSING. Determinism is load-bearing for Phase 55 FIX-02 content-hash caching.

## Decisions Made

See `key-decisions` frontmatter above. Highlights:
- Identity key includes `entryType` so the same person listed anonymously in one exhibit and by name in another produces distinct tiddlers (different redaction states = different entities).
- Name wins over entryType for title (anonymized ≠ nameless; `Redacted-01` is still a title-worthy name).
- Alphabetical sort on both bucket keys AND exhibit labels — two determinism surfaces locked in one pass.

## Deviations from Plan

None — plan executed exactly as written. Task 1 RED failed with the expected "Cannot find module './person.ts'" error; Task 2 GREEN passed 9/9 tests on the first run. No Rule-1/2/3 auto-fixes required; no Rule-4 checkpoints triggered.

**Total deviations:** 0
**Impact on plan:** None.

## Issues Encountered

None.

## TDD Gate Compliance

Plan tasks carry `tdd="true"`; the gate sequence is clean:
- **RED gate commit:** `3bb8fca` (`test(54-02): add failing person.test.ts (RED) for emitPersonTiddlers`) — confirmed failing on "Cannot find module './person.ts'"
- **GREEN gate commit:** `39df8d8` (`feat(54-02): implement generators/person.ts (GREEN) for ATOM-01`) — all 9 tests pass
- **REFACTOR:** not required — implementation was minimal and clean on first GREEN.

## Known Stubs

None. `emitPersonTiddlers` is a pure total function: empty input returns `[]`, non-empty input returns fully-populated `Tiddler[]`. No hardcoded placeholders, no TODO comments, no "coming soon" strings.

`fields: {}` on every emitted Tiddler is INTENTIONAL (Phase 55 FIX-02 owns `created/modified` field threading when pipeline wiring lands). This is documented in CONTEXT.md and in a source comment — it is not a stub masquerading as wired data.

## Wave-3 Readiness

- ATOM-01 complete and shippable. Generator output shape matches Tiddler interface from `tid-writer.ts`.
- Import path for Plan 54-08 / Phase 55: `import { emitPersonTiddlers } from './person.ts'` (type-only imports from `./types.ts` already covered by Plan 54-01).
- No blockers for sibling Wave-2 plans (54-03 through 54-07) — all run in parallel against the same Wave-1 scaffold.
- No blockers for Phase 55 FIX-02 integration.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Plan 54-02 complete; sibling Wave-2 plans (54-03, 54-04, 54-05, 54-06, 54-07) may execute in parallel; Wave-3 (Plan 54-08) remains gated behind full Wave-2 completion.

## Self-Check: PASSED

Verified:
- `scripts/tiddlywiki/generators/person.ts` exists
- `scripts/tiddlywiki/generators/person.test.ts` exists
- Commit `3bb8fca` present in git log
- Commit `39df8d8` present in git log

---
*Phase: 54-atomic-tiddler-generation*
*Completed: 2026-04-22*
