# Phase 47: Config + Routes (pure logic) - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning
**Mode:** Smart discuss — well-spec'd phase, decisions locked by ROADMAP success criteria + REQUIREMENTS

<domain>
## Phase Boundary

Build the two pure-logic modules — `scripts/editorial/config.ts` and `scripts/editorial/routes.ts` — that produce a validated `EditorialConfig` and a deterministic, ordered `Route[]` from CLI args + env vars + the exhibits JSON. Heavy unit-test coverage. NO network, NO browser, NO Playwright in this phase. Capture/Convert/Write modules stay as Phase 46 placeholders until phases 48–50 land.

</domain>

<decisions>
## Implementation Decisions

### CLI argument shape (WRIT-01)
- Flag form: `--output <path>`, `--base-url <url>`, `--headful` (boolean), `--mirror` (boolean) — long-form only, no short aliases (no `-o`, `-u`).
- CLI arg parser: hand-rolled `process.argv` walker (no `commander` / `yargs` dependency — adds bundle weight for a 4-flag tool). Place a small `parseArgs(argv: readonly string[]): RawArgs` helper in `config.ts` so tests can drive it directly without `process.argv` mutation.
- Help text: `--help` / `-h` prints synopsis + each flag with description + env fallback name + default value, exits 0. Required-but-missing config triggers same help block + a one-line "missing: --output / EDITORIAL_OUT_PATH" message and exits non-zero.

### Env fallback precedence (WRIT-01)
- Resolution order: explicit CLI flag > env var > built-in default. Built-in defaults are only provided for non-required fields (e.g., `--base-url` defaults to `https://pattern158.solutions`, but `--output` has no default — must be supplied).
- Env var names match the documented contract verbatim: `EDITORIAL_OUT_PATH`, `EDITORIAL_BASE_URL`. No additional env vars introduced this phase.

### Preflight failure mode (WRIT-02)
- Fail loud, fail early: preflight runs synchronously inside `loadConfig()` after CLI/env merging, BEFORE the function returns. Throws a typed `ConfigError` with cause + suggested fix; `index.ts` catches at the outermost boundary, prints to stderr, exits 2 (config error) — distinct from runtime errors which exit 1.
- Validation set: (a) output path resolves to an absolute path (resolve `~` and relative paths against `process.cwd()`); (b) parent directory exists; (c) parent directory is writable (test via `fs.access` with `W_OK`); (d) base URL parses as a valid URL with `https:` scheme.
- Errors surface the offending value AND the env/flag that supplied it: `"--output resolved to /tmp/missing/cap.md (parent /tmp/missing does not exist)"`.

### Route construction (CAPT-01, CAPT-02)
- Static route order (hardcoded, in this exact sequence): `home → philosophy → technologies → case-files → faq → contact → accessibility`.
- Exhibit routes appended in the EXACT order they appear in `src/data/json/exhibits.json` after the 7 static routes. Reading via `await fs.readFile(path, 'utf8')` + `JSON.parse(...)` — NOT via `@/` alias (forbidden by SCAF-08), NOT via ESM JSON import assertion (browser-incompatible / Node version constraints), NOT via `await import()` of the JSON module.
- Excluded set (CAPT-02 — never appear in the emitted `Route[]`): `/review`, any path matching `/diag/*` (prefix match), `/portfolio` (redirect → `/case-files`), `/testimonials` (redirect → `/case-files`), and the 404 fallback. Implementation: a single `EXCLUDED_PREFIXES: readonly string[]` constant + a `isExcluded(path: string): boolean` helper for clarity (also gives unit tests a clean target).
- Route shape: `{ path: string, label: string, category: 'static' | 'exhibit', sourceSlug?: string }` — `sourceSlug` set only for exhibit routes (== the exhibits.json `slug` field) to anchor screenshot filenames in Phase 48.

### Determinism (project-wide invariant inherited from Phase 46 SCAF-08)
- No `Date.now()` / `new Date()` anywhere in either module — config and route construction must be pure functions of (argv, env, json file contents).
- No `Promise.all` over the route list — phase 47 doesn't need parallelism (it's pure parsing); phase 48 is when sequential `for...of` becomes load-bearing.
- No `os.EOL` — all line splitting / joining uses `\n`.
- No `@/` aliases inside `scripts/editorial/` — relative imports only, with `.ts` extensions per NodeNext.

### Test surface (success criterion 5)
- Test file naming: `__tests__/config.test.ts`, `__tests__/routes.test.ts`. Smoke test from Phase 46 stays as-is.
- Coverage targets: every public function in both modules; CLI parser table-driven against argv fixtures; routes builder fed an inline mock exhibits.json (don't read the real file in unit tests — keep tests hermetic).
- Plan must include at least: routes ordering (static + exhibit interleave), excluded-route filtering (each excluded path), exhibits.json JSON-parse error path, config CLI/env precedence (3-way table), config missing-required failure, preflight ENOENT, preflight EACCES, base URL parse failure.

### Claude's Discretion
- Choice of types vs interfaces in `types.ts` extension (Phase 46 used `interface` — stay consistent).
- Internal helper structure (one big `loadConfig` vs. composed parsers) — pick whatever keeps each public function under ~30 lines for readability.
- Error message wording — keep terse, actionable, no Claude-isms.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/editorial/types.ts` (Phase 46) — already exports `EditorialConfig`, `Route`, `CapturedPage`, `ConvertedPage` interface stubs. Phase 47 expands EditorialConfig + Route with the real fields + may add `RawArgs`, `ConfigError`.
- `scripts/editorial/config.ts`, `scripts/editorial/routes.ts` (Phase 46) — placeholder bodies + SCAF-08 banners. Phase 47 replaces the bodies, KEEPS the SCAF-08 banner header verbatim.
- `scripts/editorial/__tests__/smoke.test.ts` (Phase 46) — Vitest project wired, `vitest/globals` available. Phase 47 drops in `config.test.ts` and `routes.test.ts` next to it; smoke.test.ts stays untouched.
- `src/data/json/exhibits.json` — the real source of exhibit slugs. Routes module reads it at runtime; tests use inline fixtures.
- `scripts/markdown-export/` (v7.0 retained) — analog for "pure-logic TS module + Vitest tests under scripts/" shape; check its `parseArgs` style if any.

### Established Patterns
- Composite TS project + NodeNext requires `.ts` extension on relative imports (proven in Phase 46 build).
- Vitest globals (`describe`, `it`, `expect`) available in `__tests__/*.ts` thanks to Plan 46-05 adding `vitest/globals` to `tsconfig.editorial.json` types.
- Throwing-stub pattern from Phase 46 placeholders — when something is intentionally unimplemented, throw a clear "Not implemented in this phase" error so silent no-ops are impossible.

### Integration Points
- `index.ts` (still placeholder after Phase 47) — Phase 50 wires `loadConfig()` + `loadRoutes()` into the orchestration. Phase 47 should NOT modify `index.ts` beyond perhaps importing the new types if a smoke check requires it.
- `capture.ts`, `convert.ts`, `write.ts` — untouched in this phase.
- Forbidden-pattern grep gate from Phase 46 still applies — Phase 47 must not regress it.

</code_context>

<specifics>
## Specific Ideas

- `EditorialConfig` final shape (lock for downstream phases):
  ```ts
  interface EditorialConfig {
    readonly outputPath: string;        // resolved absolute path
    readonly baseUrl: string;           // validated https:// URL, no trailing slash
    readonly headful: boolean;
    readonly mirror: boolean;           // optional dual-write to .planning/research/
    readonly exhibitsJsonPath: string;  // absolute path to src/data/json/exhibits.json
  }
  ```
- `Route` final shape (lock for downstream phases):
  ```ts
  interface Route {
    readonly path: string;              // begins with "/"; no trailing slash except "/"
    readonly label: string;             // human-readable, used in ToC anchors in Phase 50
    readonly category: 'static' | 'exhibit';
    readonly sourceSlug?: string;       // exhibits.json slug, exhibit routes only
  }
  ```
- `parseArgs` returns a `RawArgs` shape that's deliberately permissive — string-or-undefined per flag. Validation happens in `mergeConfig(rawArgs, env)` which is what produces the typed `EditorialConfig`. This split makes the parser pure (no I/O, no validation) and the merge testable in isolation.
- The exhibits.json reader is a one-shot async function. Cache nothing in module scope (determinism).

</specifics>

<deferred>
## Deferred Ideas

- TUI-style argument parsing with auto-help generation — out of scope; hand-rolled is fine for 4 flags.
- Config schema validation library (zod, valibot) — overkill for 5 fields; manual checks are clearer here.
- CLI bash completions — defer to a future phase if anyone asks.

</deferred>
