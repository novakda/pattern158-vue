---
phase: 038-ir-markdown-primitives-scaffold
plan: 04
subsystem: markdown-export
tags: [yaml, frontmatter, obsidian, serializer, tdd]

requires:
  - phase: 038-01
    provides: "yaml devDependency, scripts/markdown-export/ scaffold, tsconfig.scripts.json, vitest scripts project"
provides:
  - "serializeFrontmatter(FrontmatterInput): string — deterministic YAML frontmatter serializer"
  - "FORBIDDEN_SINGULAR_KEYS constant (tag, alias, cssclass)"
  - "FrontmatterInput interface (title required, aliases/tags/date/cssclasses optional)"
  - "Canonical key order enforcement (title → aliases → tags → date → cssclasses)"
  - "Wikilink-safe double-quoted title scalars (D-17)"
affects: [042-obsidian-vault-renderer, 041-monolithic-renderer, 039-extractors]

tech-stack:
  added: []  # yaml already installed in 038-01
  patterns:
    - "yaml Document API for per-scalar type control (forced QUOTE_DOUBLE on title, PLAIN on array items)"
    - "Hardcoded SINGULAR_TO_PLURAL map instead of suffix concat (avoids 'alias'→'aliass' bug)"
    - "collectionStyle: 'block' in ToStringOptions to force block-style arrays"

key-files:
  created:
    - "scripts/markdown-export/frontmatter/serialize.ts"
    - "scripts/markdown-export/frontmatter/serialize.test.ts"
  modified: []

key-decisions:
  - "Document API + typed Scalar nodes instead of stringify() options to get per-field quoting (title quoted, items plain)"
  - "SINGULAR_TO_PLURAL map (not string concat) — 'alias' + 's' = 'aliass' bug surfaced during GREEN phase"
  - "collectionStyle: 'block' is the ToStringOptions equivalent of flowLevel: -1 (plan-suggested flowLevel is not in yaml 2.8.3's ToStringOptions type)"

patterns-established:
  - "Forced scalar type pattern: new Scalar(v); node.type = Scalar.QUOTE_DOUBLE — used when yaml's auto type inference is insufficient"
  - "Canonical key order by imperative assignment to a fresh object (JS object insertion order is preserved)"
  - "Forbidden-list comments that reference forbidden literals must paraphrase (e.g., 'platform line-ending constant' instead of 'os.EOL') so grep -E guards don't false-positive"

requirements-completed: [FM-01, FM-02]

duration: 4m7s
completed: 2026-04-11
---

# Phase 038 Plan 04: Frontmatter Serializer Summary

**Deterministic YAML frontmatter serializer with canonical key order, forced double-quoted title, plain-style block array items, and forbidden singular key rejection — built via yaml package's Document API for per-scalar type control.**

## Performance

- **Duration:** 4m 7s
- **Started:** 2026-04-11T01:55:42Z
- **Completed:** 2026-04-11T01:59:49Z
- **Tasks:** 1 (TDD: RED + GREEN)
- **Files modified:** 2 (both new)

## Accomplishments

- Shipped `serializeFrontmatter(input: FrontmatterInput): string` with strict canonical ordering: title → aliases → tags → date → cssclasses
- Title always emitted as double-quoted scalar to prevent YAML type coercion and wikilink corruption (D-17)
- Array fields (aliases, tags, cssclasses) emitted in block style with plain unquoted items when safe
- Empty arrays and undefined optional fields omitted from output (no `key: []` noise)
- Forbidden singular keys (`tag`, `alias`, `cssclass`) throw descriptive errors at runtime pointing users to the correct plural
- Output deterministic byte-for-byte, LF line endings only, wrapped in `---\n` document separators
- 21 unit tests in `serialize.test.ts` covering every must-have truth from the plan frontmatter
- Full scripts test suite: **91/91 passing**; `vue-tsc -b` clean

## Task Commits

Each task was committed atomically with `--no-verify` (Wave 2 parallel execution):

1. **Task 1 RED: Failing tests** - `29d4ade` (test)
2. **Task 1 GREEN: Implementation** - `c5071e2` (feat)

## Files Created/Modified

- `scripts/markdown-export/frontmatter/serialize.ts` — Serializer implementation (101 LOC) using yaml Document API with forced QUOTE_DOUBLE title scalar
- `scripts/markdown-export/frontmatter/serialize.test.ts` — 21 unit tests (142 LOC) covering canonical order, plurals, wikilinks, type coercion, determinism, LF-only

## Decisions Made

- **Document API over stringify() with defaultStringType: 'QUOTE_DOUBLE':** The plan's initial suggestion of `defaultStringType: 'QUOTE_DOUBLE'` would quote every string including array items, producing `- "page"` instead of the required `- page`. Switched to `new Document(ordered)` with a hand-built `Scalar` node for the title (type=QUOTE_DOUBLE) and `defaultStringType: 'PLAIN'` for everything else. This gives per-field quoting without hand-rolling YAML.
- **SINGULAR_TO_PLURAL lookup map:** The plan's proposed `${singular}s` concat produces `aliass` for `alias`. Replaced with an explicit map `{ tag: 'tags', alias: 'aliases', cssclass: 'cssclasses' }`. Caught by the `alias → aliases` test during GREEN phase.
- **collectionStyle: 'block' (not flowLevel: -1):** `flowLevel` is not a valid property of `ToStringOptions` in yaml 2.8.3. The `ToStringOptions.collectionStyle: 'block'` field is the correct way to force block-style arrays via the Document API.
- **Comment paraphrasing to satisfy forbidden-grep:** The original comment `"Always \n — never os.EOL."` matched the `os\.EOL` forbidden-grep guard. Rewrote to `"Always LF (\n) literals — never the platform line-ending constant"` so the guard passes without loss of meaning.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan-suggested `${singular}s` pluralization produces 'aliass'**
- **Found during:** Task 1 GREEN phase (test run)
- **Issue:** `alias` + `s` = `aliass`. The `it('rejects forbidden singular key alias')` test expects error message to contain `alias.*aliases`, which failed.
- **Fix:** Introduced `SINGULAR_TO_PLURAL: Record<string, string>` lookup map with explicit correct mappings.
- **Files modified:** `scripts/markdown-export/frontmatter/serialize.ts`
- **Verification:** Test passes; error message now reads `"Frontmatter forbidden singular key 'alias' — use plural 'aliases' instead ..."`.
- **Committed in:** `c5071e2` (GREEN commit)

**2. [Rule 1 - Bug] Plan-suggested `defaultStringType: 'QUOTE_DOUBLE'` over-quotes array items**
- **Found during:** Task 1 GREEN phase (first test run)
- **Issue:** `stringify()` with `defaultStringType: 'QUOTE_DOUBLE'` quotes every string scalar, producing `- "page"` and `- "home"` inside the tags array. The plan's expected output and tests require plain unquoted items (`- page`, `- home`). Setting it to `'PLAIN'` globally would then fail to quote the title (breaking the numeric/boolean/null coercion tests).
- **Fix:** Switched from `stringify()` to `new Document(ordered).toString(...)` with a helper `quotedScalar()` that builds a `Scalar` node with `.type = Scalar.QUOTE_DOUBLE` for the title only. Array items use `defaultStringType: 'PLAIN'`.
- **Files modified:** `scripts/markdown-export/frontmatter/serialize.ts`
- **Verification:** All 21 frontmatter tests pass including `title: "42"` and `tags:\n  - page\n  - home\n`.
- **Committed in:** `c5071e2` (GREEN commit)

**3. [Rule 3 - Blocking] `flowLevel: -1` is not valid in yaml 2.8.3 `ToStringOptions`**
- **Found during:** Task 1 GREEN phase (`vue-tsc -b` type-check)
- **Issue:** The plan suggested `flowLevel: -1` to force block style; TypeScript error `TS2353: Object literal may only specify known properties, and 'flowLevel' does not exist in type 'ToStringOptions'`. Verified against `node_modules/yaml/dist/options.d.ts` — the correct property is `collectionStyle: 'any' | 'block' | 'flow'`.
- **Fix:** Replaced `flowLevel: -1` with `collectionStyle: 'block'`.
- **Files modified:** `scripts/markdown-export/frontmatter/serialize.ts`
- **Verification:** `pnpm exec vue-tsc -b` exits 0.
- **Committed in:** `c5071e2` (GREEN commit)

**4. [Rule 3 - Blocking] `input as Record<string, unknown>` fails strict overlap check**
- **Found during:** Task 1 GREEN phase (`vue-tsc -b` type-check)
- **Issue:** `TS2352: Conversion of type 'FrontmatterInput' to type 'Record<string, unknown>' may be a mistake because neither type sufficiently overlaps with the other.` The `FrontmatterInput` interface has a fixed key set, so TS refuses the direct cast.
- **Fix:** Changed to `input as unknown as Record<string, unknown>` (double-cast via unknown).
- **Files modified:** `scripts/markdown-export/frontmatter/serialize.ts`
- **Verification:** `pnpm exec vue-tsc -b` exits 0.
- **Committed in:** `c5071e2` (GREEN commit)

**5. [Rule 3 - Blocking] `os.EOL` literal in a comment triggers forbidden-grep guard**
- **Found during:** Task 1 GREEN phase (acceptance criteria grep)
- **Issue:** The comment `"Always \n — never os.EOL."` contains the literal string `os.EOL` which the acceptance-criteria grep `! grep -E '(@/|os\.EOL|Date\.now|new Date)'` matches, failing verification even though the literal appears only in a comment.
- **Fix:** Paraphrased the comment to `"Always LF (\n) literals — never the platform line-ending constant (forbidden-list disallows platform EOL)"` — preserves the intent without matching the guard pattern.
- **Files modified:** `scripts/markdown-export/frontmatter/serialize.ts`
- **Verification:** `! grep -E '(@/|os\.EOL|Date\.now|new Date)' scripts/markdown-export/frontmatter/serialize.ts` exits 1 (no matches).
- **Committed in:** `c5071e2` (GREEN commit)

---

**Total deviations:** 5 auto-fixed (2 bugs in plan-suggested code, 3 blocking type/grep issues)
**Impact on plan:** All five were narrow fixes to plan-provided code snippets that didn't survive the actual yaml 2.8.3 API and strict TypeScript. Functional intent preserved exactly. No scope creep — serializer behavior matches every "must_haves.truths" item in the plan frontmatter.

## Issues Encountered

- **Transient sibling failure in `escape/prose.test.ts`:** During the first RED-phase test run, one test in a sibling Wave 2 plan (`escape/prose.test.ts`) was failing. This was explicitly out of scope (different plan, parallel agent working on it). By the time the GREEN-phase run happened, the parallel agent had fixed it and all 91 scripts tests passed. Not logged to `deferred-items.md` because it resolved itself naturally.

## User Setup Required

None — pure TypeScript serializer, no external services, no environment variables, no dashboard configuration.

## Next Phase Readiness

- **Phase 042 (Obsidian vault renderer)** can now import `serializeFrontmatter` from `scripts/markdown-export/frontmatter/serialize.js` to prepend YAML frontmatter blocks to every vault note. The `FrontmatterInput` interface shape is the locked contract.
- **Phase 041 (Monolithic renderer)** may optionally use the same serializer for a top-level banner block.
- **No blockers.** All 91 scripts tests green, `vue-tsc -b` clean, forbidden-grep clean, commit history atomic.

## Self-Check: PASSED

- `scripts/markdown-export/frontmatter/serialize.ts` — FOUND
- `scripts/markdown-export/frontmatter/serialize.test.ts` — FOUND
- Commit `29d4ade` (test RED) — FOUND
- Commit `c5071e2` (feat GREEN) — FOUND
- `pnpm test:scripts` → 91/91 passing
- `pnpm exec vue-tsc -b` → exit 0
- Forbidden-grep clean

---
*Phase: 038-ir-markdown-primitives-scaffold*
*Completed: 2026-04-11*
