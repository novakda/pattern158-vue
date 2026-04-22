---
phase: 58
plan: tzk-style-structure
subsystem: tiddlywiki
tags: [tzk, public-private, build-pipeline, directory-structure, workflow]
requires: [phase-57]
provides: [pattern158-tzk-structure]
affects: [tiddlywiki/, scripts/tiddlywiki/generate.ts, scripts/tiddlywiki/tid-writer.ts, scripts/tiddlywiki/sources.ts, scripts/tiddlywiki/html-to-wikitext.ts, package.json, tsconfig.scripts.json]
tech-stack:
  added: [tiddlywiki-cli]
  patterns: [public-tag-default-transform, publishFilter-intersection, tid-writer-manifest-build-targets]
key-files:
  created:
    - scripts/tiddlywiki/generate.test.ts
    - tiddlywiki/README.md
    - tiddlywiki/config/.gitkeep
    - tiddlywiki/build/.gitkeep
    - .planning/phases/58-tzk-style-structure/58-VERIFICATION.md
    - .planning/phases/58-tzk-style-structure/58-SUMMARY.md
  modified:
    - scripts/tiddlywiki/generate.ts
    - scripts/tiddlywiki/tid-writer.ts
    - scripts/tiddlywiki/sources.ts
    - scripts/tiddlywiki/html-to-wikitext.ts
    - package.json
    - tsconfig.scripts.json
decisions:
  - withPublicTag implemented at the composition layer (generate.ts) rather than at generator level — Phase 54 generators are LOCKED, composition is the single-point transform site
  - publishFilter value requires `+` intersection prefix (`+[!tag[private]]`) — raw `[!tag[private]]` unions rather than filters in TW DSL; verified via canary-tiddler smoke test
  - `--output tiddlywiki/output` uses CWD-relative path because TiddlyWiki resolves --output against the CLI's CWD (not the edition folder), and pnpm scripts always run from project root
  - Empty-string template argument to `--render` preserves the existing $:/core/save/all-as-filter invocation pattern (render.js:44 falls back to `template || title`)
  - Legacy `index` build target preserved alongside new targets for backward compatibility — never breaks existing `npx tiddlywiki tiddlywiki --build index` documentation
  - siteMetaTiddlers subtitle synced to "Evidence-Based Portfolio" at the generator source, eliminating the Phase 57 override-drift risk (57-SUMMARY Deferred Issue #1)
metrics:
  tasks: 7
  files: 12
  commits: 6
  duration: ~13min
requirements: [TZK-01, TZK-02, TZK-03, TZK-04, TZK-05]
completed: 2026-04-22
---

# Phase 58: Tzk-Style Structure Summary

Formalize a tzk-inspired directory + public/private build pipeline for the Pattern 158 TiddlyWiki: every generator-emitted tiddler defaults to the `public` tag, two build targets split public-filtered vs full wikis, directory scaffolding + workflow README document the intended layout and cadence, and a Phase 57 sources.ts subtitle follow-up closes a regenerate-drift risk.

## What Changed

### TZK-01: `withPublicTag` transform (`scripts/tiddlywiki/generate.ts`)

New exported `withPublicTag(tiddler)` function:

- Returns the input unchanged when `public` or `private` already in tags (idempotent, same-reference identity for test assertability).
- Otherwise returns a fresh `Tiddler` with `public` prepended to tags. Input object and input tag array are not mutated — frozen-array safe per the readonly contract of the generator layer.
- `composeAllTiddlers` now maps its full output through `withPublicTag` before returning. The transform sits at the composition boundary because Phase 54 generators are LOCKED; composition is the single-point override site.

### TZK-02: `writeTiddlywikiInfo` build targets (`scripts/tiddlywiki/tid-writer.ts`)

Three build targets now emitted into `tiddlywiki/tiddlywiki.info`:

| Target | `--output` | Render args | Filter |
| ------ | ---------- | ----------- | ------ |
| `index` | (none, edition default) | `$:/core/save/all index.html text/plain` | none |
| `public-index` | `tiddlywiki/output` | `$:/core/save/all index.html text/plain "" publishFilter "+[!tag[private]]"` | intersect non-private |
| `all-index` | `tiddlywiki/output` | `$:/core/save/all all.html text/plain` | none |

The `publishFilter` variable interpolates into `$:/core/save/all`'s `saveTiddlerFilter` via the `$(publishFilter)$` substitution (core/templates/save-all.tid:5). The `+` prefix is the TW filter DSL intersection operator — without it, the filter unions rather than narrows.

### TZK-02 / TZK-04: pnpm scripts + tiddlywiki devDep (`package.json`)

- New devDep: `tiddlywiki@^5.4.0` (resolved 5.4.0) so the CLI is installable without an npx prompt.
- New scripts:
  - `tiddlywiki:build-public` — `tiddlywiki tiddlywiki --build public-index` → `tiddlywiki/output/index.html`
  - `tiddlywiki:build-all` — `tiddlywiki tiddlywiki --build all-index` → `tiddlywiki/output/all.html`
  - `tiddlywiki` — convenience combo: `pnpm tiddlywiki:generate && pnpm tiddlywiki:build-public`
- Existing `tiddlywiki:generate` unchanged.

### TZK-05: Directory scaffolding (`tiddlywiki/`)

```
tiddlywiki/
├── tiddlers/     ← canonical source (.tid files, 367 tiddlers, all tagged `public`)
├── config/       ← reserved for future custom plugin / theme config (empty, .gitkeep)
├── build/        ← reserved for future shell helpers (empty, .gitkeep)
├── output/       ← gitignored build artifacts (index.html + all.html)
├── pattern158-tiddlers.json
├── tiddlywiki.info
└── README.md     ← workflow doc
```

`tiddlywiki/README.md` covers directory layout, regenerate/commit workflow, public/private tag semantics, build targets reference table, and git cadence per TZK-03.

### Phase 57 follow-up (`scripts/tiddlywiki/sources.ts`)

`siteMetaTiddlers()` subtitle changed from `Dan Novak — Portfolio & Case Files` to `Evidence-Based Portfolio`. This eliminates the Phase 57 override-drift risk: the Phase 57 manually-committed `$__SiteSubtitle.tid` no longer gets overwritten by each regenerate run. Generator source is now the single source of truth.

### `.gitignore`

Already contained `/tiddlywiki/output/` (line 28, added pre-Phase-58). No change.

## Commits

| # | Hash      | Subject                                                                          |
| - | --------- | -------------------------------------------------------------------------------- |
| 1 | `6f75aa1` | feat(58-01): add withPublicTag transform in generate.ts (TZK-01)                 |
| 2 | `0b0184f` | feat(58-02): extend tiddlywiki.info build targets + fix subtitle (TZK-02)        |
| 3 | `f5c0a48` | chore(58-03): add tiddlywiki devDep + build-public/build-all scripts             |
| 4 | `d3d7f23` | docs(58-04): add tzk-style directory scaffolding + workflow README (TZK-05)     |
| 5 | `6d00f72` | fix(58-05): filter + path + tsconfig fixes for public/all build targets          |
| 6 | `bbe212a` | chore(58-06): regenerate tiddlers with public tag + updated tiddlywiki.info      |

## Deviations from Plan

### 1. [Rule 3 — Blocking] Filter semantics required `+` intersection prefix

**Found during:** Task 7 smoke gate
**Issue:** Initial `publishFilter=[!tag[private]]` value did not filter — a canary `private`-tagged tiddler appeared in `output/index.html`. TiddlyWiki's filter DSL unions consecutive runs unless prefixed with `+` (intersection) or `-` (difference). `$:/core/save/all`'s saveTiddlerFilter definition appends `$(publishFilter)$` as a trailing run, so a bare `[!tag[private]]` adds all non-private tiddlers to the union rather than narrowing.
**Fix:** Changed value to `+[!tag[private]]`. Verified via canary: sentinel string `UNIQUESENTINEL_PRIVATE_ONLY_SHOULD_NOT_APPEAR_IN_PUBLIC_BUILD_XYZ123` absent from `output/index.html` (0 matches), present in `output/all.html` (1 match).
**Files modified:** `scripts/tiddlywiki/tid-writer.ts`
**Commit:** `6d00f72`

### 2. [Rule 3 — Blocking] `--output` resolution against CWD, not edition

**Found during:** Task 7 smoke gate
**Issue:** Initial `--output output` config landed HTML at `./output/` (project root), not `./tiddlywiki/output/`. TiddlyWiki's core/language/en-GB/Help/output.tid explicitly says "If the specified pathname is relative then it is resolved relative to the current working directory." Pnpm scripts always run from project root, so the relative path resolved there.
**Fix:** Changed value to `tiddlywiki/output`. Verified via `ls tiddlywiki/output/` after build.
**Files modified:** `scripts/tiddlywiki/tid-writer.ts`
**Commit:** `6d00f72`

### 3. [Rule 3 — Blocking] `tsconfig.scripts.json` excluded generate.ts chain

**Found during:** Task 7 smoke gate (`pnpm build`)
**Issue:** Phase 53 deferred a TypeScript build-gate fix by excluding `generate.ts`, `sources.ts`, `sources.test.ts`, `html-to-wikitext.ts`, and `verify-integrity.ts` from `tsconfig.scripts.json`. The new `generate.test.ts` imports `generate.ts`, which imports `sources.ts`, which imports `html-to-wikitext.ts` — breaking the project-references compile with TS6307 (file not listed) and TS2345 (HTMLBodyElement vs Node).
**Fix:** Removed all excludes from `tsconfig.scripts.json`. Resolved the underlying TS2345 in `html-to-wikitext.ts` via a single `as unknown as Node` cast at the `document.body` consumer boundary — mirrors the locked pattern from `extractors/types.ts:parseHtml` (STATE.md decisions, Phase 53 Plan 01).
**Files modified:** `scripts/tiddlywiki/html-to-wikitext.ts`, `tsconfig.scripts.json`
**Commit:** `6d00f72`
**Bonus:** `verify-integrity.ts` now type-checked; previously-excluded code is now under project-references supervision.

## Test Coverage

New: `scripts/tiddlywiki/generate.test.ts` — 9 scenarios for `withPublicTag`:

1. Prepends `public` to non-special tag list
2. Prepends `public` to empty tag list
3. No-op when `public` already present (same-reference)
4. No-op when `private` present (does NOT add `public`)
5. No-op when both `public` and `private` (same-reference)
6. Does not mutate input object or tag array
7. Idempotent (two applications equal one)
8. Preserves title, type, fields, text
9. Works on frozen tag array (`Object.freeze`-safe)

Total `test:scripts` suite: 44 files / 593 tests all passing.

## Metrics

- **Duration:** ~13 minutes
- **Tasks:** 7 logical groups → 6 commits (some consolidated)
- **Files created:** 6
- **Files modified:** 6
- **Tiddlers committed:** 367 (generator output, previously untracked)
- **Output files:** 2 × 2,810,984 bytes each (index.html + all.html)

## Self-Check: PASSED

- `scripts/tiddlywiki/generate.ts` — FOUND (withPublicTag exported)
- `scripts/tiddlywiki/generate.test.ts` — FOUND (9 tests)
- `scripts/tiddlywiki/tid-writer.ts` — FOUND (3 build targets)
- `scripts/tiddlywiki/sources.ts` — FOUND (subtitle = "Evidence-Based Portfolio")
- `scripts/tiddlywiki/html-to-wikitext.ts` — FOUND (DOM cast applied)
- `tsconfig.scripts.json` — FOUND (excludes cleared)
- `package.json` — FOUND (3 new scripts + tiddlywiki devDep)
- `tiddlywiki/README.md` — FOUND
- `tiddlywiki/config/.gitkeep` — FOUND
- `tiddlywiki/build/.gitkeep` — FOUND
- `tiddlywiki/tiddlywiki.info` — FOUND (3 build targets serialized)
- `tiddlywiki/output/index.html` — FOUND (2,810,984 bytes, no private content)
- `tiddlywiki/output/all.html` — FOUND (2,810,984 bytes)
- `.planning/phases/58-tzk-style-structure/58-VERIFICATION.md` — FOUND
- Commit `6f75aa1` — FOUND
- Commit `0b0184f` — FOUND
- Commit `f5c0a48` — FOUND
- Commit `d3d7f23` — FOUND
- Commit `6d00f72` — FOUND
- Commit `bbe212a` — FOUND
- `pnpm build` — exit 0
- `pnpm test:scripts --run` — exit 0, 593 tests pass
- `pnpm tiddlywiki:generate` — exit 0
- `pnpm tiddlywiki:build-public` — exit 0, produces 2.8MB filtered HTML
- `pnpm tiddlywiki:build-all` — exit 0, produces 2.8MB unfiltered HTML
- Canary `private`-tag filter test — PASSED (sentinel absent from public, present in all)
