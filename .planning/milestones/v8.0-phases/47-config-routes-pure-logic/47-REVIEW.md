---
phase: 47
status: findings
reviewed_at: 2026-04-19T10:42:00Z
depth: standard
files_reviewed: 6
findings_total: 8
findings_by_severity:
  high: 0
  medium: 0
  low: 2
  info: 6
---

# Phase 47: Config + Routes (pure logic) — Code Review Report

**Reviewed:** 2026-04-19T10:42:00Z
**Depth:** standard
**Files Reviewed:** 6 (`scripts/editorial/types.ts`, `config.ts`, `routes.ts`, `__tests__/config.test.ts`, `__tests__/routes.test.ts`, `tsconfig.editorial.json`)
**Status:** findings (low + info — no high/medium issues)

## Executive Summary

Phase 47 is a clean, disciplined landing of two pure-logic modules with comprehensive hermetic test coverage. All 5 ROADMAP success criteria are demonstrably met (224/224 tests green; 22-route integration smoke against the real `src/data/json/exhibits.json` confirmed). The locked contracts (`EditorialConfig`, `Route`, `ConfigError`) match CONTEXT.md verbatim and are stable for downstream consumption by Phases 48-50. SCAF-08 forbidden-pattern grep gate is clean across all 10 files in `scripts/editorial/`; the descriptive banner is preserved in every file; the throwing stubs from Phase 46 are fully replaced; `index.ts` is untouched (Phase 50 territory respected). The `tsconfig.editorial.json` change (`allowImportingTsExtensions: true`) is necessary, minimal, and correctly paired with the pre-existing `emitDeclarationOnly: true`. The 8 findings below are all Low or Info severity — two small parser edge cases that lack test coverage (single-dash flag accidentally consumed as a value; repeated-flag last-wins undocumented), one defensive-filter contract observation worth noting before Phase 48 wires this up, and several quality/forward-looking observations for Phases 48-50. None block phase closure.

## Findings

### Low

#### LO-01: `parseArgs` accepts single-dash flags (e.g. `-h`) as values for `--output`/`--base-url`

**File:** `scripts/editorial/config.ts:78, 87`
**Issue:** The "missing value" guard is `value === undefined || value.startsWith('--')`. This catches double-dash flags as accidental values (`--output --mirror` correctly throws), but `parseArgs(['--output', '-h'])` succeeds and returns `{ output: '-h' }`. Today `-h` is the only short-form alias, but the asymmetry means a user typing `pnpm editorial:capture --output -h` gets a config with `outputPath` resolved against `'-h'` (path.resolve will produce `<cwd>/-h`), then preflight fails downstream with a confusing "parent does not exist" message rather than the expected "--output requires a value" or "did you mean --help?". No corresponding test in `config.test.ts`.
**Fix:**
```ts
// In both --output and --base-url branches, broaden the flag check to catch -h too:
if (value === undefined || value.startsWith('-')) {
  throw new ConfigError('--output requires a value (path to output Markdown file)')
}
```
Add a corresponding test:
```ts
it('throws ConfigError when --output is followed by -h', () => {
  expect(() => parseArgs(['--output', '-h'])).toThrow(/--output requires a value/)
})
```
Caveat: this would also reject legitimate value strings beginning with `-` (e.g. `--output -filename.md` would be unusual but not impossible). Alternative: keep `--` check and explicitly enumerate the known short aliases (`['-h']`). Given the project uses long-form-only flags by design, broadening to `startsWith('-')` is the simpler and safer choice.
**Severity rationale:** Low — the failure mode is poor UX (a confusing downstream preflight error) rather than a security or correctness problem. A user invoking the CLI with a typo gets a worse-than-necessary error message; no data loss, no security exposure.

#### LO-02: `parseArgs` silently last-wins on repeated flags; behavior undocumented and untested

**File:** `scripts/editorial/config.ts:64-116`
**Issue:** `parseArgs(['--output', '/a', '--output', '/b'])` returns `{ output: '/b' }` with no warning, no error, and no test asserting this behavior. The same applies to `--base-url`, `--headful`, `--mirror`. Last-wins is a defensible convention (matches `getopt` and most CLI tools), but the absence of a test means a future refactor could silently change to first-wins or to "throw on duplicate" without breaking the suite. CONTEXT.md does not specify which semantics is intended.
**Fix:** Pick one and test it explicitly. Options: (a) document last-wins as the contract by adding a test; (b) reject duplicates explicitly in `parseArgs` for stricter ergonomics:
```ts
case '--output': {
  if (result.output !== undefined) {
    throw new ConfigError('--output may only be supplied once')
  }
  // ... existing value-extraction logic
}
```
Recommendation: option (a) — add a one-line test asserting `parseArgs(['--output', '/a', '--output', '/b']).output === '/b'`. Cheaper than (b), preserves backward compatibility with the unwritten convention, and locks the behavior against silent regression. If (b) is preferred for strictness, plumb it through all four flag handlers consistently.
**Severity rationale:** Low — current behavior is reasonable and matches common CLI conventions; the gap is in the regression net, not in the implementation. Without a test, the contract is implicit.

### Info

#### IN-01: HELP_TEXT documents Phase-50 mirror destination ahead of implementation

**File:** `scripts/editorial/config.ts:50`
**Issue:** The `--mirror` flag's help text reads `"Also write the capture to .planning/research/site-editorial-capture.md"` — but the actual mirror write path is not implemented until Phase 50 (`write.ts`). If Phase 50 lands at a different path (e.g. the vault path mentioned in 47-CONTEXT.md), this user-facing doc will silently drift from reality.
**Fix:** Either (a) leave as-is and treat HELP_TEXT as the source-of-truth contract Phase 50 must honor (recommended — locks the spec); or (b) generalize the help text to "Also write the capture to a project-local mirror path" until Phase 50 lands the concrete destination, then narrow it. Option (a) is preferable because Phase 50 then has a stable string to grep against during implementation; the assertion in `HELP_TEXT > documents both env var fallbacks by name` already covers env-var stability, so a similar `expect(HELP_TEXT).toContain('.planning/research/site-editorial-capture.md')` test would lock it.
**Severity rationale:** Info — purely a forward-looking consistency concern. The help text is correct as a forward-spec; flagged so the Phase 50 author doesn't accidentally drift the mirror destination.

#### IN-02: Defensive `isExcluded` filter could silently drop static routes if EXCLUDED_PREFIXES grows

**File:** `scripts/editorial/routes.ts:102-103`
**Issue:** The defense-in-depth filter `allRoutes.filter((r) => !isExcluded(r.path))` is documented in 47-03-SUMMARY as "today filters zero routes." If a future contributor adds `/contact` (or any static-route path) to `EXCLUDED_PREFIXES` — even temporarily during debugging — the filter silently drops the static route from the output without warning. The `routes.test.ts > buildRoutes > result contains no excluded paths` test would still pass (the result obeys the contract); the missing-route would only surface in downstream Phase 48 capture when the `/contact` page is conspicuously absent. There is no test asserting "buildRoutes against a fixture where N exhibits map to N exhibit routes (no silent drops)."
**Fix:** Add a sanity-check assertion in `buildRoutes` that the post-filter length equals `STATIC_ROUTES.length + exhibitRoutes.length` (i.e., zero routes were dropped), and throw a descriptive error if not:
```ts
const allRoutes: Route[] = [...STATIC_ROUTES, ...exhibitRoutes]
const filtered = allRoutes.filter((r) => !isExcluded(r.path))
if (filtered.length !== allRoutes.length) {
  const dropped = allRoutes.filter((r) => isExcluded(r.path)).map((r) => r.path)
  throw new Error(
    `buildRoutes: defensive isExcluded filter dropped ${dropped.length} route(s): ${dropped.join(', ')}. ` +
    `Either remove the path from STATIC_ROUTES/exhibits.json or remove it from EXCLUDED_PREFIXES.`,
  )
}
return filtered
```
Alternatively (lighter-weight): add a unit test that constructs a `STATIC_ROUTES`-shaped input via dependency injection or via a fixture that includes an excluded path, and asserts that the filter behavior is observable (today it isn't, because no input is excluded). This exposes the contract.
**Severity rationale:** Info — current behavior is correct and the filter is documented as defense-in-depth. Flagged because the silent-drop failure mode is the kind of latent bug that surfaces only at integration time, and a one-line invariant check would catch it loudly.

#### IN-03: `runPreflight` doesn't validate `exhibitsJsonPath` exists or is readable

**File:** `scripts/editorial/config.ts:148-193`
**Issue:** `EditorialConfig.exhibitsJsonPath` is a required field of the validated config, but `runPreflight` only checks `outputPath` (absolute + parent writable) and `baseUrl` (parses + https). If `exhibitsJsonPath` points to a missing or unreadable file, the failure surfaces only later in `buildRoutes` via an ENOENT from `fs.readFile`. CONTEXT.md's preflight validation set lists (a) absolute output, (b) parent exists, (c) parent writable, (d) baseUrl valid + https — `exhibitsJsonPath` is intentionally not in the set. This is a deliberate scoping decision (exhibitsJsonPath defaults to a project-local file that should always exist; failure to read it is a developer error rather than a user-facing config error). However, the symmetry break is worth noting: the user gets a "config error → exit 2" for a bad output path but a "runtime error → exit 1" for a bad exhibits path, even though both are pre-network-pre-browser failures of the same kind.
**Fix:** No change required for Phase 47 (out of scope per CONTEXT.md). Phase 50's `index.ts` error boundary should be aware of this asymmetry when categorizing exit codes — consider catching `ENOENT` from `buildRoutes` and re-classifying as a config error if the missing file is `exhibitsJsonPath`. Document the rationale in the Phase 50 plan so it's not re-litigated.
**Severity rationale:** Info — by-design omission per CONTEXT.md scoping. Flagged for the Phase 50 orchestration author so the exit-code semantics stay sensible.

#### IN-04: `isExhibitsJsonEntry` treats arrays as objects (latent edge case, not a bug today)

**File:** `scripts/editorial/routes.ts:59-70`
**Issue:** The first guard `typeof value !== 'object' || value === null` rejects null and primitives but accepts arrays (since `typeof [] === 'object'`). An exhibits.json containing `[[1,2,3], {label,exhibitLink}]` would pass the first guard for the array entry, then fail at `typeof e.label !== 'string'` (since `[1,2,3].label` is undefined). The resulting error message would be `"exhibits.json entry at index 0 has no string \"label\" field"` — technically true but misleading (the entry is an array, not a missing-field object). No test for this case.
**Fix:** Add an explicit array check in `isExhibitsJsonEntry`:
```ts
if (typeof value !== 'object' || value === null || Array.isArray(value)) {
  throw new Error(`exhibits.json entry at index ${index} is not an object`)
}
```
And a corresponding test:
```ts
it('rejects with descriptive Error when an entry is an array', async () => {
  const fixturePath = await writeRawFixture('[[1, 2, 3]]')
  await expect(buildRoutes(fixturePath)).rejects.toThrow(/index 0/)
  await expect(buildRoutes(fixturePath)).rejects.toThrow(/not an object/)
})
```
**Severity rationale:** Info — current behavior surfaces an error (just a confusing one). The real exhibits.json is hand-curated by the project owner and unlikely to contain arrays; the edge case is purely defensive.

#### IN-05: `mergeConfig`'s `exhibitsJsonPath` recomputation against `process.cwd()` is silent — surprises if cwd changes mid-run

**File:** `scripts/editorial/config.ts:135-138`
**Issue:** `exhibitsJsonPath = path.resolve(process.cwd(), 'src/data/json/exhibits.json')` is computed at every call to `mergeConfig`. If `loadEditorialConfig` is called multiple times in a long-running process and `process.chdir` happens between calls, each call yields a different `exhibitsJsonPath`. For Phase 47 this is fine (`loadEditorialConfig` is called once per process), but Phase 50's orchestration should be aware: any future test that exercises `loadEditorialConfig` from a different working directory (e.g. `process.chdir(tmpDir)`) will see a different exhibits path and likely fail with ENOENT in `buildRoutes`. The behavior is asserted in `mergeConfig > resolves exhibitsJsonPath to src/data/json/exhibits.json under cwd` so it's locked, but not flagged as cwd-sensitive in any comment.
**Fix:** Add a short comment at the call site to document the cwd-sensitivity:
```ts
// exhibitsJsonPath is resolved against the current process.cwd() — callers that
// chdir after loadEditorialConfig() returns get a stale path. Phase 47 callers
// invoke this once at startup, before any chdir, so this is safe today.
const exhibitsJsonPath = path.resolve(process.cwd(), 'src/data/json/exhibits.json')
```
Or expose a flag to override the path explicitly (already partially possible via the `EditorialConfig.exhibitsJsonPath` field being settable by callers — no work needed, just document).
**Severity rationale:** Info — current behavior is correct for the documented use case (one-shot CLI). Flagged because cwd-sensitivity is the kind of latent surprise that bites in tests or in long-running orchestrators.

#### IN-06: Inconsistent error type — `runPreflight`/`mergeConfig`/`parseArgs` throw `ConfigError`, but `buildRoutes` throws plain `Error`

**File:** `scripts/editorial/routes.ts:61, 65, 68, 80, 89-92`
**Issue:** Every error path in `routes.ts` (missing-field, non-array root, bad prefix) throws plain `Error`, not `ConfigError`. This means Phase 50's `index.ts` error boundary cannot uniformly distinguish "config-class error → exit 2" from "runtime error → exit 1" using `instanceof ConfigError`: a malformed `exhibits.json` is structurally a config-class problem (the file is part of the config surface) but will be caught as a generic runtime error and exit 1. The asymmetry mirrors IN-03 (preflight scope). CONTEXT.md doesn't explicitly require ConfigError for routes errors, but the runtime classification implication may not have been considered.
**Fix:** Either (a) accept the asymmetry and document it in the Phase 50 error-boundary plan ("ENOENT/SyntaxError from buildRoutes are runtime errors, not config errors — exit 1"); or (b) wrap routes errors in ConfigError when they originate from `exhibits.json` shape problems:
```ts
// routes.ts — wrap shape-violation errors to mark them config-class:
function isExhibitsJsonEntry(value: unknown, index: number): asserts value is ExhibitsJsonEntry {
  if (typeof value !== 'object' || value === null) {
    throw new ConfigError(`exhibits.json entry at index ${index} is not an object`)
  }
  // ...etc
}
```
This requires importing `ConfigError` from `./config.ts` in `routes.ts`, which creates a new cross-module dependency. Recommendation: option (a) — document the asymmetry in Phase 50 and let `instanceof ConfigError` mean "configuration input was rejected" (parseArgs/mergeConfig/runPreflight) while routes errors mean "configured input file is malformed" (a separate exit code or message class). The test `buildRoutes > rejects with SyntaxError on malformed JSON` already locks the SyntaxError pass-through; ConfigError-wrapping would force a contract change.
**Severity rationale:** Info — by-design today; flagged because the Phase 50 author needs to make an explicit decision about how `index.ts` classifies the two error origins.

## Strengths Observed

- **All 5 ROADMAP success criteria met with evidence** — proof matrix in `47-VERIFICATION.md` cites specific test names and log paths; integration smoke against the real `exhibits.json` (15 entries → 22 routes, exhibit-a through exhibit-o in source order) is reproducible.
- **SCAF-08 grep gate is clean** across all 10 files in `scripts/editorial/` (top-level + `__tests__/`). Verified via `grep -RE "@/|Date\.now\(\)|new Date\(|os\.EOL|Promise\.all" scripts/editorial/` returning zero matches.
- **SCAF-08 descriptive banner is preserved verbatim** in every file — never spells out the literal forbidden tokens, so the gate stays clean even when grepping the banners themselves.
- **Locked contracts match CONTEXT.md exactly** — `EditorialConfig` 5 readonly fields, `Route` 4 fields with optional `sourceSlug`, `ConfigError extends Error` with optional `cause: unknown`. No drift, no scope creep.
- **`ConfigError` exported as runtime value** from `types.ts` (via `export { ConfigError }`, not `export type`) — `instanceof` checks at the Phase 50 error boundary will work as intended. The `tsconfig.editorial.json` `allowImportingTsExtensions: true` accommodation is necessary, minimal, and correctly paired with the pre-existing `emitDeclarationOnly: true`.
- **Hand-rolled CLI parser is clean and readable** — switch/case state machine, no commander/yargs dependency, ~50 lines covering 6 flag forms with explicit error messages for unknown flags and missing values.
- **Parser/merger split is principled** — `parseArgs` is pure (no I/O), `mergeConfig` is pure (no I/O), `runPreflight` is the only synchronous I/O step. This makes precedence assertions hermetic in tests (no `process.argv`/`process.env` mutation anywhere).
- **`isExcluded` uses segment-aware prefix matching** (`P === E || P.startsWith(E + '/')`) — correctly avoids the `/diagnostics` collision with `/diag` that a naive `startsWith` would cause. Locked by the `does NOT match substring-but-not-segment paths` it.each block (4 sentinel cases).
- **Sequential `for` loop with explicit index** in `buildRoutes` — preserves index for per-entry error messages AND satisfies SCAF-08 "no parallel iteration" rule literally. Phase 48 inherits this pattern.
- **Per-entry error messages name BOTH the index AND the offending field** — `"exhibits.json entry at index 1 has no string \"label\" field"` is far more useful than a generic "validation failed". Tests assert each piece independently (`/index 1/` AND `/label/`) so either regression surfaces.
- **`runPreflight` error messages distinguish ENOENT, EACCES, and other errno codes** — each branch produces a unique substring AND attaches the original `ErrnoException` as `ConfigError.cause` for downstream introspection. The `cause.code` assertions in tests lock both the message and the structured cause chain.
- **EACCES test uses chmod 0o500 fixture with root-skip guard** — `if (typeof process.getuid === 'function' && process.getuid() === 0) return` keeps the suite green inside containers running as root while still exercising the EACCES branch on dev workstations. The chmod 0o700 restore before leaving the test body lets afterEach cleanup succeed.
- **All test fixtures are hermetic** — per-test `fs.mkdtemp` (with plan-specific prefix `p47-config-test-` / `p47-routes-test-` to avoid intra-process collision), `afterEach fs.rm({recursive,force})` cleanup. The real `src/data/json/exhibits.json` is never read in unit tests (verified via `! grep src/data/json/exhibits.json` in `routes.test.ts`).
- **`it.each` table-driven tests** for the exclusion matrix — 22 cases (4 exact + 3 subpath + 4 substring-collision + 7 STATIC_ROUTES + 2 exhibit + 2 edge) covered without copy-paste; failure messages include the row's `%s -> %s` substitution for clear diagnostics.
- **`scripts/editorial/index.ts` untouched from Phase 46** (verified `git diff scripts/editorial/index.ts | wc -l` returns 0) — Phase 50 territory respected exactly as planned.
- **No throwing-stub bodies remain** in `config.ts` or `routes.ts` (`grep "not implemented"` returns nothing) — Plans 47-02 and 47-03 fully replaced them.
- **Test count growth is healthy** — 145 → 224 (+79), exceeding the plan floor of +50. The over-delivery comes from `it.each` row expansion, not from scope creep.

## Recommendations for Phases 48-50

1. **Phase 48 capture.ts: iterate `Route[]` sequentially, no `Promise.all`.** The SCAF-08 rule is descriptive in the banner but enforced by the grep gate. Phase 48 must use `for (const route of routes) { await capture(route) }` — both for determinism (capture order = file output order) AND for politeness to the live production site being scraped. The Phase 47 `buildRoutes` implementation establishes this pattern; preserve it.

2. **Phase 50 orchestration: classify error sources explicitly at the `index.ts` boundary.** Per IN-03 and IN-06, the current asymmetry is:
   - `loadEditorialConfig` throws `ConfigError` → exit 2 (config error)
   - `buildRoutes` throws plain `Error` (incl. `SyntaxError`, `NodeJS.ErrnoException`) → exit 1 (runtime error)
   - But `buildRoutes` reading a malformed `exhibits.json` is structurally a config-class problem.

   Decide explicitly: either (a) re-classify `buildRoutes` errors as exit 2 when they originate from the configured `exhibitsJsonPath`, or (b) document that exit 1 is the correct code for "configured input file malformed" and let user-facing docs reflect that. The current test `rejects with SyntaxError on malformed JSON` locks the SyntaxError pass-through, so option (a) requires wrapping in `index.ts` rather than changing `routes.ts`.

3. **Phase 50 orchestration: be aware of `exhibitsJsonPath` cwd-sensitivity.** Per IN-05, `mergeConfig` resolves against `process.cwd()` at call time. If Phase 50 introduces any `process.chdir` or runs orchestration from a temp directory, `loadEditorialConfig` must be called BEFORE the chdir. Document this at the call site.

4. **Phase 50 orchestration: HELP_TEXT mirror destination is the contract.** Per IN-01, `HELP_TEXT` documents `--mirror` writes to `.planning/research/site-editorial-capture.md`. Phase 50's `write.ts` must honor this exact path or update HELP_TEXT in the same plan. Adding `expect(HELP_TEXT).toContain('.planning/research/site-editorial-capture.md')` to the HELP_TEXT describe block in `config.test.ts` would lock this against silent drift.

5. **Phase 48-50: preserve the SCAF-08 descriptive banner block** when adding bodies to `capture.ts`, `convert.ts`, `write.ts`, `index.ts`. The banner is descriptive (no literal forbidden tokens) — DO NOT spell out the tokens in the banner, or the grep gate will self-trip. Phase 47 preserved this correctly across 5 modified files; the convention is established.

6. **Optional: tighten parser to reject `-` prefixed values for `--output`/`--base-url`** (LO-01). One-line change broadens `startsWith('--')` → `startsWith('-')`, paired with one new test. Improves UX for `pnpm editorial:capture --output -h` typo recovery. Worth folding into the first Phase 48 plan that touches `config.ts` (if any) — not worth a standalone phase.

7. **Optional: lock the parser's last-wins-on-duplicate behavior with a test** (LO-02). One-line test in `parseArgs` describe block. Cheap insurance against silent regression. Same Phase 48 piggyback as #6.

8. **Optional: add an invariant check in `buildRoutes` that the defensive `isExcluded` filter dropped zero routes** (IN-02). Either fail loud if it dropped any, or add a test that exercises the drop path explicitly. Today the filter is silent and untestable from inputs (no static or exhibit path matches an excluded prefix); the silent-drop failure mode would only surface at Phase 48 integration.

---

_Reviewed: 2026-04-19T10:42:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
