# Phase 46: Scaffold - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning
**Mode:** Smart discuss — infrastructure phase auto-detected

<domain>
## Phase Boundary

`scripts/editorial/` directory is wired into the build (tsconfig project reference, Vitest project include, pnpm script, devDeps installed) so the subsequent phases can write code that type-checks, tests, and runs from day one. Pure plumbing — no editorial behavior is implemented in this phase.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP success criteria + REQUIREMENTS (SCAF-01..08) as the spec, mirror the existing `scripts/markdown-export/` + `tsconfig.scripts.json` pattern from v7.0 for project structure / tsconfig shape, and follow REQUIREMENTS forbidden patterns (SCAF-08).

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/markdown-export/` (from v7.0, retained) — established pattern for a TS-only script project: flat layout, dedicated tsconfig, Vitest `scripts` project, pnpm script entry.
- `tsconfig.scripts.json` — referenced from root `tsconfig.json` via `references: [{ "path": "./tsconfig.scripts.json" }]`. `tsconfig.editorial.json` will mirror this shape and be added alongside.
- `.planning/codebase/{STACK,STRUCTURE,CONVENTIONS,TESTING}.md` — codebase maps available; STRUCTURE confirms `scripts/` is the canonical home for non-runtime tooling.

### Established Patterns
- Composite TS projects under `scripts/` are referenced from root `tsconfig.json` `references[]`; `pnpm build` runs `vue-tsc -b` which builds all referenced projects.
- Vitest `scripts` project (separate from app project) discovers `*.test.ts` under `scripts/**/__tests__/` — the editorial scaffold will extend its `include` glob, NOT create a new Vitest project (per SCAF-06).
- pnpm scripts that wrap `tsx` for one-shot tooling (cf. v7.0 pattern); `editorial:capture` follows suit.

### Integration Points
- Root `tsconfig.json` `references[]` — append `./tsconfig.editorial.json`.
- Root `package.json` `scripts` — add `editorial:capture: tsx scripts/editorial/index.ts`.
- Root `package.json` `devDependencies` — add turndown@^7.2.4, @joplin/turndown-plugin-gfm@^1.0.64, @types/turndown@^5.0.6; bump playwright to ^1.59.1.
- `vitest.config.ts` (or equivalent scripts project config) — extend `include` to cover `scripts/editorial/**/*.test.ts`.
- `.gitignore` — add `.tsbuildinfo-editorial`.

</code_context>

<specifics>
## Specific Ideas

- Flat layout per SCAF-01 (no nested subdirs except `__tests__/`): `index.ts`, `config.ts`, `routes.ts`, `capture.ts`, `convert.ts`, `write.ts`, `types.ts`, `__tests__/`.
- All files start as compilable placeholders (e.g., `export {};` or stub exports). Real logic lands in phases 47–50.
- `tsconfig.editorial.json`: composite=true, rootDir=., `include: ["scripts/editorial/**/*.ts"]`, `paths: {}`, outDir/.tsbuildinfo `.tsbuildinfo-editorial`, `lib: ["ES2022"]` only (no DOM yet — Phase 49 may add it).
- Forbidden patterns enforced from day one in placeholders (SCAF-08): no `@/` aliases, no `Date.now()` / `new Date()`, no `os.EOL`, no `Promise.all` over ordered route capture.
- `pnpm-lock.yaml` must reflect all four dep changes after `pnpm install`.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope (infrastructure auto-skip).

</deferred>
