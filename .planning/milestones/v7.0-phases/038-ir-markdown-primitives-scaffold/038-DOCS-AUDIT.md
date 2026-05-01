# Phase 38 AUDT-01: docs/ Directory Collision Audit

**Phase:** 038-ir-markdown-primitives-scaffold
**Requirement:** AUDT-01
**Decision reference:** D-18 (038-CONTEXT.md §"docs/ Collision Audit")
**Audit date:** 2026-04-11 (per `.planning/STATE.md` `last_updated`)

## Purpose

Phases 41 and 42 of the v7.0 Static Markdown Export Pipeline will write generated markdown into a git-tracked `docs/` directory at the repo root:
- Phase 41 → `docs/site-content.md` (monolithic renderer)
- Phase 42 → `docs/obsidian-vault/**` (Obsidian vault renderer)

Before committing to that path, this audit confirms that `docs/` is not already claimed by any tool currently installed in the repo, and identifies any `.gitignore` / `.gitattributes` changes Phase 44 (build integration) will need to make.

## Tools Audited

### 1. Vite (build.outDir)

- **Default:** `dist`
- **Current config:** default — `vite.config.ts` does not set `build.outDir` (no `build:` block in the exported `defineConfig`); Vite will write to `dist/`
- **Source:** `vite.config.ts` lines 11-41 — `defineConfig` contains only `plugins`, `resolve.alias`, and `test:` (Vitest projects). No `build` key.
- **Collision with docs/:** NO — `dist/` is the only Vite output directory.

### 2. Storybook (build-storybook output)

- **Default:** `storybook-static`
- **Current config:** default — `package.json` `build-storybook` script is the bare command `"storybook build"` with no `-o` / `--output-dir` override
- **On disk:** `storybook-static/` already exists at the repo root from prior `pnpm build-storybook` runs (and is excluded via `.gitignore` line 7)
- **Source:** `package.json` line 12 (`"build-storybook": "storybook build"`)
- **Collision with docs/:** NO — Storybook output lives in `storybook-static/`, never `docs/`.

### 3. Vitest coverage output

- **Default:** `coverage`
- **Current config:** not configured — `vitest.config.ts` has no `test.coverage` block; `@vitest/coverage-v8` is installed as a devDep but no project enables coverage reporting yet
- **On disk:** `coverage/` directory does not exist (no coverage runs have been executed)
- **Source:** `vitest.config.ts` lines 13-50 — `test:` contains only `passWithNoTests` and `projects`; no `coverage` field. `package.json` devDep `@vitest/coverage-v8: ^4.1.0`.
- **Collision with docs/:** NO — even if coverage is enabled later, the default reportsDirectory is `coverage/`, not `docs/`.

### 4. Wrangler (deploy target)

- **Config file(s) found:** `wrangler.jsonc` (the only `wrangler.*` file at the repo root)
- **Static asset directory:** `./dist` (explicit in `wrangler.jsonc` `assets.directory`)
- **Source:** `wrangler.jsonc` lines 8-11:
  ```jsonc
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
  ```
- **Collision with docs/:** NO — Wrangler reads from `./dist` (the Vite output), never from `docs/`. There is no `site.bucket`, no other `assets.*` path, and no `[[rules]]` block touching `docs/`.

### 5. Any other `docs/`-writing tooling

- **package.json scripts referencing docs:** the only script that writes into `docs/` is `"build:markdown": "tsx scripts/markdown-export/index.ts"` — and that is the v7.0 pipeline itself (the consumer this audit is clearing). No other script (`dev`, `build`, `preview`, `storybook`, `build-storybook`, `test*`, `deploy`) names `docs/`.
- **Other generators:** none. There is no TypeDoc, no VitePress, no Storybook docgen-to-disk, no `@vue/api-docgen`, no `swagger-jsdoc` configured. The repo has zero documentation-generation tooling other than the (in-progress) markdown-export script.
- **Source:** `package.json` lines 7-18 (full `scripts` block).
- **Collision with docs/:** NO.

## Current .gitignore state

```
no docs entries
```

Full grep result for `docs` against `.gitignore`: zero matches. The complete `.gitignore` (19 lines) excludes `node_modules`, `dist`, `*.local`, `.vite`, `*storybook.log`, `storybook-static`, `.claude/worktrees/`, `.claude/`, `.vitest-attachments/`, `src/pages/__screenshots__/`, `.tsbuildinfo-scripts/`, `tsconfig.scripts.tsbuildinfo`, and `*.tsbuildinfo`. None of these patterns match `docs/`.

**Analysis:**
- `docs/` is **NOT excluded** by `.gitignore`. Phase 44 can create and track `docs/**` without removing or rewriting any existing exclusion pattern. No `.gitignore` edit is required for `docs/` (though Phase 44 may still add an explicit comment marking it as intentionally tracked).

## Current .gitattributes state

```
no .gitattributes file exists
```

There is no `.gitattributes` file at the repo root. `ls .gitattributes` returns "NO .gitattributes file".

**Analysis:**
- `docs/**` has **no** existing attribute rules — there is nothing to override and no EOL/linguist/binary rules currently in effect for any path. Phase 44 (`INTG-02`) will need to **create** `.gitattributes` from scratch and add the `docs/** text eol=lf linguist-generated` line. This is additive and cannot conflict with existing rules.

## Existing `docs/` directory

- **Exists on disk:** NO
- **Tracked by git:** NO
- **Contents (first 20 entries):**
```
empty — `ls -d docs/` returns "docs/ does not exist"; `git ls-files docs/` returns zero entries
```

**Analysis:** No collision — `docs/` does not exist on disk and no files are tracked under that path. Phase 41 (mono renderer) and Phase 42 (vault renderer) can create `docs/site-content.md` and `docs/obsidian-vault/**` from a clean slate without clobbering any existing content.

## Phase 44 Prerequisites (derived from this audit)

Phase 44 (`INTG-02`, `INTG-03`, `INTG-04`) must do the following based on the audit results above:

1. **`.gitignore`** — NO CHANGE needed. `docs/` is not currently excluded; Phase 44 may optionally add an explanatory comment, but no functional edit is required.
2. **`.gitattributes`** — CREATE the file (does not exist) and ADD `docs/** text eol=lf linguist-generated` (per PROJECT.md INTG-02 requirement). This is an additive create-from-scratch operation with no merge risk.
3. **CI drift guard** — Add `pnpm build:markdown && git diff --exit-code docs/` to CI (INTG-03). The `build:markdown` script is already wired into `pnpm build` (verified `package.json` line 8: `"build": "vue-tsc -b && vite build && pnpm build:markdown"`).
4. **Determinism test** — Two-run regeneration byte-comparison (INTG-04). No prerequisites from this audit; gated only on the renderer code in Phases 41/42.

## Verdict

### GO — Phase 44 may create and track docs/

All audited tools output to different directories:
- Vite → `dist/`
- Storybook → `storybook-static/`
- Vitest coverage (if ever enabled) → `coverage/`
- Wrangler → reads from `./dist` (asset source, not output)
- No other tool writes to `docs/`

`.gitignore` does **not** exclude `docs/` — no edit required. `.gitattributes` does **not** exist — Phase 44 must create it from scratch and add the EOL normalization + `linguist-generated` line per INTG-02. No existing `docs/` directory will be clobbered (none exists, none tracked).

The path is clear for Phase 41 to write `docs/site-content.md` and Phase 42 to write `docs/obsidian-vault/**` against a clean filesystem with zero risk of overwriting another tool's output.

## Sources

- `vite.config.ts` (lines 11-41) — confirms no `build.outDir` override, defaults to `dist/`
- `package.json` (lines 7-18) — `scripts` block; `build-storybook` uses default `storybook-static`, no `docs/`-writing scripts other than the pipeline itself
- `vitest.config.ts` (lines 13-50) — no `coverage` configuration block
- `wrangler.jsonc` (lines 8-11) — `assets.directory: "./dist"`
- `.gitignore` (19 lines) — zero `docs` matches
- `.gitattributes` — file does not exist
- `git ls-files docs/` — returns zero entries
- `ls -d docs/` — directory does not exist
- `.planning/phases/038-ir-markdown-primitives-scaffold/038-CONTEXT.md` §"docs/ Collision Audit (D-18)"
- `.planning/STATE.md` `last_updated: 2026-04-11T01:53:36.435Z` — audit date source
