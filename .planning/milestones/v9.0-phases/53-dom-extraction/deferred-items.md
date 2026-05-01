# Phase 53 Deferred Items

Out-of-scope discoveries logged by plan executors during Wave 2 execution.

## 1. `tsconfig.scripts.json` lacks `allowImportingTsExtensions` + vitest global types — surfaces across ALL Wave-2 test files

**Discovered by:** Plan 53-06 executor during Task 2 (pre-commit `pnpm build` gate)
**Discovery date:** 2026-04-22

**Symptom:** `pnpm build` fails with the following classes of TS errors in EVERY Wave-2 test file (`scripts/tiddlywiki/extractors/{personnel,findings,technologies,testimonials,pages,case-files-index,exhibit,faq}.test.ts`) and their implementations when present:

1. `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled` — on every `from './X.ts'` import from a test file to its sibling implementation.
2. `TS2593: Cannot find name 'describe' / 'it'` and `TS2304: Cannot find name 'expect'` — Vitest globals not in the scripts-tsconfig `types` array (currently `["node"]` only).

**Root cause:**

- `tsconfig.scripts.json` was extended in Plan 53-01 to include `scripts/tiddlywiki/**/*.ts` — this made the Wave-2 test files part of the composite-build graph for the first time. Plan 53-01 tested by running `pnpm build` before any Wave-2 tests existed; build was green because the NEW files only landed in Wave 2.
- Each Wave-2 plan's `<action>` block specifies `import { … } from './X.ts'` literally (with `.ts` suffix) AND uses Vitest global-style `describe`/`it`/`expect` (no explicit import) — neither is supported by the current `tsconfig.scripts.json`.
- `tsconfig.editorial.json` (not scripts) has `allowImportingTsExtensions: true` and `types: ["node", "vitest/globals"]` — this is the pattern the scripts tsconfig needs to match.

**Scope boundary:**
- Each Wave-2 plan's `files_modified` list is strictly limited to the two files (`X.ts` + `X.test.ts`) for its own extractor. Modifying `tsconfig.scripts.json` exceeds every plan's scope.
- Task-level verification uses `pnpm test:scripts --run scripts/tiddlywiki/extractors/X.test.ts`, which PASSES for every correctly-implemented plan (Vitest runs with its own tsconfig resolution, not the scripts composite build).
- Plan-level verification uses `pnpm build`, which FAILS because of this config gap.

**Fix required (out of scope for any individual Wave-2 plan):**

Add to `tsconfig.scripts.json` compilerOptions:
```json
"allowImportingTsExtensions": true,
"noEmit": true,           // required alongside allowImportingTsExtensions when declaration output is configured
```
And extend `types`:
```json
"types": ["node", "vitest/globals"]
```

Note `emitDeclarationOnly: true` + `allowImportingTsExtensions: true` is incompatible — `noEmit: true` is the canonical pairing. Since `scripts/` is not a library (no `.d.ts` consumers), switching from `emitDeclarationOnly` to `noEmit` is fine.

**Recommended owner:** Plan 53-10 (iter-1-fixes-prep) OR a new Wave-3 scaffold touch-up plan prior to 53-10. If not done in Phase 53, Phase 55 FIX-02 (which already has the remit to refactor `generate.ts` / `sources.ts` / `html-to-wikitext.ts` and remove the tsconfig `exclude` list from Plan 53-01) is the natural home.

**Impact of deferral:**
- `pnpm test:scripts` works for each plan in isolation (vitest bypasses the broken build graph).
- `pnpm build` is red until this is fixed.
- Other Wave-2 plans (53-02..53-09) have the same issue — they either documented the build failure as a deviation or ran their test-only gate.

**Evidence:**
- `pnpm build` 2>&1 output at discovery-HEAD showed identical error classes across `{personnel,findings,technologies,testimonials,pages}.test.ts` files.
- `git stash` + `pnpm build` at pre-Plan-53-06 HEAD reproduced the same errors — confirming Plan 53-06 did not introduce them.

**RESOLUTION (appended by Plan 53-06 executor after fix landed):**

Commit `619c82e` (`fix(53-02): add vitest/globals + allowImportingTsExtensions to scripts tsconfig`) landed from the Plan 53-02 executor during Plan 53-06 SUMMARY drafting. The fix applied exactly the proposed change above:
- `allowImportingTsExtensions: true` added to compilerOptions
- `noEmit: true` paired (declaration-emit removed)
- `types: ["node", "vitest/globals"]` extended

Post-fix verification (by Plan 53-06 executor, 2026-04-22):
- `pnpm build` exits 0 (vue-tsc + vite + markdown-export all clean)
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/technologies.test.ts` exits 0 (6/6 green)

Plan 53-02 executor correctly scoped this as a Rule-3 auto-fix inside its own plan scope (FAQ extractor required the same config fix to compile). All Wave-2 plans benefit. This entry is kept in-repo as a historical record of the wave-coordination discovery pattern, not an open action item.
