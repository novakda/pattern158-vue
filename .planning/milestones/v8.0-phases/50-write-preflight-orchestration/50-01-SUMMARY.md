---
phase: 50-write-preflight-orchestration
plan: 01
subsystem: editorial-capture
tags: [document-shape, frontmatter, toc, github-slugger, yaml, determinism, scaf-08, phase-50]
dependency_graph:
  requires:
    - scripts/editorial/config.ts:EditorialConfig
    - scripts/editorial/routes.ts:Route
    - scripts/editorial/convert.ts:ConvertedPage
    - github-slugger 2.0.0
    - yaml 2.8.3
  provides:
    - scripts/editorial/document.ts:assembleDocument
    - scripts/editorial/document.ts:buildFrontmatter
    - scripts/editorial/document.ts:buildToc
    - scripts/editorial/document.ts:buildRouteSection
    - scripts/editorial/document.ts:buildFailedRouteSection
    - scripts/editorial/document.ts:slugForRoute
    - scripts/editorial/document.ts:RouteFailure (interface)
    - scripts/editorial/document.ts:DocumentAssemblyInput (interface)
  affects:
    - scripts/editorial/types.ts (re-exports)
    - scripts/editorial/index.ts (Phase 50-03 consumer — not yet landed)
tech_stack:
  added:
    - github-slugger (already devDep since v7.0) — first editorial consumer
    - yaml.stringify (already dep since v7.0) — first editorial consumer
  patterns:
    - "Pure pipeline module — every export is a deterministic function of inputs"
    - "Fresh GithubSlugger per slug() call — no state leak between routes"
    - "yaml.stringify + trailing-newline strip + explicit --- fences (no Obsidian-canonical key-order reuse)"
    - "Omit-empty metadata blockquote — no empty Description/CF Cache/Title lines"
    - "Synthetic heading-text pre-transform for slug derivation (so /exhibits/exhibit-a → route-exhibits-exhibit-a)"
    - "`parts.join('\\n') + '\\n'` guarantees exactly one trailing newline"
key_files:
  created:
    - scripts/editorial/document.ts (285 lines, 6 functions + 2 interfaces)
    - scripts/editorial/__tests__/document.test.ts (493 lines, 41 test cases across 8 describe blocks)
  modified:
    - scripts/editorial/types.ts (added `export type { RouteFailure, DocumentAssemblyInput } from './document.ts'`)
decisions:
  - "DocumentAssemblyInput includes a `routes: readonly Route[]` field beyond the CONTEXT.md line 176-184 shape — required for original-order ToC + section emission across interleaved captured/failed routes; documented in the interface's JSDoc"
  - "slugForRoute uses a synthetic pre-transformed heading text (`Route: exhibits-exhibit-a`) as slugger input rather than the literal heading text (`Route: /exhibits/exhibit-a`) — github-slugger drops `/` as punctuation, which would collapse multi-segment paths to `route-exhibitsexhibit-a`; the pre-transform matches the documented expected slug `route-exhibits-exhibit-a`"
  - "buildFrontmatter uses `yaml.stringify` directly against a plain object, NOT the v7.0 markdown-export serializer — CONTEXT.md line 63 explicit lock (v7.0 serializer has Obsidian-canonical key-order constraints that don't generalize)"
  - "SAFE_SHA_RE restricts scraped site_version_sha to `[a-zA-Z0-9._+-]*` before YAML rendering — mitigates threat T-50-01 (YAML-injection via scraped <meta name=\"git-sha\"> from live site); anything outside the class falls back to empty string"
  - "yaml.stringify renders empty string as `\"\"` (double-quoted) not `''` (single-quoted) — plan spec line 573 anticipated single-quoted form; test assertion updated to match actual yaml output (Rule 1 auto-fix — spec bug in plan, not implementation bug)"
  - "assembleDocument throws on unknown routes (route in `routes` but not in `captured` or `failures`) — defensive guard against orchestrator contract violation; should never fire in production since captured.length + failures.length === routes.length"
  - "errorSummary handles 3 shapes — Error instances (including CaptureError), non-Error objects with string .message, and primitives via String(err); unit-tested for all three"
metrics:
  duration: ~5min
  completed: 2026-04-21
  tasks_complete: 2
  files_created: 2
  files_modified: 1
  tests_added: 41
  tests_baseline: 309
  tests_after: 350
---

# Phase 50 Plan 01: Document Shape Assembler Summary

Implemented `scripts/editorial/document.ts` — a pure, side-effect-free module that assembles the `DocumentAssemblyInput` (captured pages + failures + run provenance) into a deterministic monolithic Markdown string. Every function is a deterministic function of its inputs with zero I/O, zero wall-clock reads, and zero Playwright dependency. Delivers all 6 SHAP requirements (SHAP-01..06) and locks the WRIT-04 idempotent-overwrite determinism at the unit-test layer.

## Final Export Surface

`scripts/editorial/document.ts` (285 lines):

| Line | Export                                                | Kind      |
| ---- | ----------------------------------------------------- | --------- |
| 29   | `RouteFailure`                                        | interface |
| 45   | `DocumentAssemblyInput`                               | interface |
| 103  | `slugForRoute(route): string`                         | function  |
| 123  | `buildFrontmatter(input): string`                     | function  |
| 150  | `buildToc(routes, captured, failures): string`        | function  |
| 185  | `buildRouteSection(page, capturedAt): string`         | function  |
| 221  | `buildFailedRouteSection(failure, capturedAt): string`| function  |
| 254  | `assembleDocument(input): string`                     | function  |

Private helpers (not exported): `SAFE_SHA_RE` (line 63), `sanitizeSha` (line 65), `errorSummary` (line 78).

`scripts/editorial/types.ts` re-export (added line 14):
```ts
export type { RouteFailure, DocumentAssemblyInput } from './document.ts'
```

## DocumentAssemblyInput Shape

```ts
export interface DocumentAssemblyInput {
  readonly config: EditorialConfig
  readonly captured: readonly ConvertedPage[]
  readonly failures: readonly RouteFailure[]
  readonly routes: readonly Route[]          // ← addition beyond CONTEXT.md lines 176-184
  readonly capturedAt: string                 // ISO 8601 UTC
  readonly toolVersion: string
  readonly siteVersionSha: string
}
```

**Rationale for `routes` field addition:** CONTEXT.md lines 176-184 enumerate only 6 fields. `routes` is required so `assembleDocument` + `buildToc` can iterate the ORIGINAL route order when emitting the ToC and per-route sections — captured routes and failed routes interleave in the source order, and without the `routes` field the assembler would have to guess ordering from two separate collections. Phase 50-03's orchestrator calls `buildRoutes(config)` once and threads the result through unchanged. Documented in the interface JSDoc (lines 36-43).

## Threat T-50-01 Defense — SHA Sanitization Proof

`buildFrontmatter` flows `input.siteVersionSha` through `sanitizeSha()`:

```ts
const SAFE_SHA_RE = /^[a-zA-Z0-9._+-]*$/
function sanitizeSha(sha: string): string {
  return SAFE_SHA_RE.test(sha) ? sha : ''
}
```

Any character outside `[a-zA-Z0-9._+-]` triggers a fallback to empty string. Git short-SHAs (`abc1234`), version-tagged forms (`v1.2.3`), and dirty-suffix forms (`abc1234+dirty`) all pass. HTML tags, newlines, YAML structural chars (`:`, `#`, `{`, `}`, `[`, `]`, `&`, `*`, `!`, `|`, `>`, `'`, `"`, `%`, `@`, `\``) all fail and resolve to empty.

**Unit-test proof (document.test.ts line 131-140):**
```ts
it('sanitizes site_version_sha to empty for injection-looking input', () => {
  const fm = buildFrontmatter(makeMinimalInput({ siteVersionSha: '<script>alert(1)</script>' }))
  expect(fm).toContain('site_version_sha: ""')
  expect(fm).not.toContain('<script>')
  expect(fm).not.toContain('alert(1)')
})
```

## WRIT-04 Determinism Proof

Two unit tests lock byte-equality of `assembleDocument` output:

1. **Minimal (3-route, 2 captured + 1 failed)** — document.test.ts lines 383-400.
2. **Rich multi-route fixture (4 routes, varied metadata, failed with httpStatus, missing cfCacheStatus, empty description)** — document.test.ts lines 402-437.

Both tests assert `expect(first).toBe(second)`. Any future leak of wall-clock or randomness into the assembler fails these tests loudly. The rich fixture also exercises every observable branch (omit-empty metadata, httpStatus inclusion, multi-segment path slug) so regressions in those paths surface in the same test.

## Test Count Delta

| Phase       | Test files | Tests       |
| ----------- | ---------- | ----------- |
| Pre-plan    | 20         | 309         |
| Post-plan   | 21         | 350 (+41)   |

Plan target was ≥20 new tests; delivered 41. New test file `scripts/editorial/__tests__/document.test.ts` (493 lines) — 100% hermetic (no fs I/O, no Playwright, no network).

## Describe Blocks (Test Gate Binding)

Eight describe blocks map 1:1 to export surface + the cross-cutting determinism lock:

| Describe                              | `it` count | Covers                                                    |
| ------------------------------------- | ---------- | --------------------------------------------------------- |
| `slugForRoute`                        | 7          | 6-path table + repeat-call determinism                    |
| `buildFrontmatter`                    | 8          | Fence shape, 6 locked keys, sha sanitization, determinism |
| `buildToc`                            | 5          | Empty routes, original order, anchor equality, suffix, skip |
| `buildRouteSection`                   | 8          | Full metadata, omit-empty x3, literal-slash, body trim, determinism |
| `buildFailedRouteSection`             | 6          | Error/string/object-.message, httpStatus in/out, captured-at |
| `assembleDocument`                    | 5          | End-to-end, multi-route, separator count, throw-on-missing, ordering |
| `assembleDocument determinism`        | 2          | Byte-equal x2 (minimal + rich fixture)                    |

## SCAF-08 Grep Gate Pass Table

Both new files pass the SCAF-08 forbidden-token gate:

| Token           | `document.ts` | `document.test.ts` |
| --------------- | ------------- | ------------------ |
| `Date.now(`     | 0             | 0                  |
| `new Date(`     | 0             | 0                  |
| `os.EOL`        | 0             | 0                  |
| `Promise.all`   | 0             | 0                  |
| `setTimeout`    | 0             | 0                  |
| `from '@/`      | 0             | 0                  |

Grep command used (exit 1 = no forbidden tokens found):
```bash
grep -nE "Date\.now\(|new Date\(|os\.EOL|Promise\.all|setTimeout|from '@/" scripts/editorial/document.ts
grep -nE "Date\.now\(|new Date\(|os\.EOL|Promise\.all|setTimeout|from '@/" scripts/editorial/__tests__/document.test.ts
```

## Build + Test Results

```
$ pnpm build
...
vue-tsc -b && vite build && pnpm build:markdown
built in 887ms
exit 0

$ pnpm test:scripts
Test Files  21 passed (21)
     Tests  350 passed (350)
  Duration  548ms
exit 0
```

## Phase 50-03 Readiness

The Phase 50-03 orchestrator (`scripts/editorial/index.ts`) can now import and compose the full assembler surface in one import line:

```ts
import {
  assembleDocument,
  type DocumentAssemblyInput,
  type RouteFailure,
} from './document.ts'
```

With the captured pages + failures + run-start capturedAt in hand, the orchestrator produces the final document string via a single call:

```ts
const finalMarkdown = assembleDocument({
  config,
  captured,
  failures,
  routes,
  capturedAt,
  toolVersion,
  siteVersionSha,
})
```

That string then flows into Phase 50-02's `writePrimaryAndMirror` for atomic write (WRIT-03) + optional mirror (WRIT-05).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Spec Bug] Test expectation for empty-SHA YAML rendering corrected**
- **Found during:** Task 2 (while writing the SHA sanitization test)
- **Issue:** Plan line 573 / test 2e specified `expect(fm).toContain("site_version_sha: ''")` — single-quoted empty string. Actual `yaml.stringify` output for an empty string scalar is `""` (double-quoted), not `''`.
- **Verified via:** `node -e "const yaml=require('yaml'); console.log(yaml.stringify({ x: '' }))"` → `x: ""`
- **Fix:** Updated the test assertion to `site_version_sha: ""`. Semantic intent preserved — the assertion still proves the empty-string fallback rendered into YAML; only the quote style differs.
- **Files modified:** `scripts/editorial/__tests__/document.test.ts` (line 136)
- **Commit:** 0358c45

### Noted, Not Deviating

- Plan said baseline was 304 tests; actual baseline (before this plan) was 309. Net delta is 41 new tests (vs. plan's ≥20 target). No deviation — reality just had more pre-existing tests than the plan's snapshot.
- Plan's TDD directive on Task 1 conflicts with its own `<action>` step 14 ("Do NOT create the test file in this task"). Resolved per `<action>` authority: implementation committed as `feat`, tests committed separately as `test` — satisfies Task 1's verify gate (`pnpm test:scripts` green with no test file added in Task 1) and the plan's overall structure.

## Known Stubs

None. `document.ts` is a complete pure assembler module; every function is fully implemented. Downstream integration (Phase 50-02 writer, Phase 50-03 orchestrator) is intentionally out of scope for this plan — see 50-02-PLAN.md and 50-03-PLAN.md.

## Commits

| Task | Commit  | Type | Message                                                |
| ---- | ------- | ---- | ------------------------------------------------------ |
| 1    | b2272de | feat | add document.ts assembler (SHAP-01..06)                |
| 2    | 0358c45 | test | add hermetic tests for document.ts (SHAP-01..06 proof) |

## Self-Check: PASSED

- [x] `scripts/editorial/document.ts` exists (285 lines)
- [x] `scripts/editorial/__tests__/document.test.ts` exists (493 lines)
- [x] `scripts/editorial/types.ts` re-exports `RouteFailure` + `DocumentAssemblyInput` (line 14)
- [x] Commit b2272de exists
- [x] Commit 0358c45 exists
- [x] `pnpm build` exits 0
- [x] `pnpm test:scripts` exits 0 (350/350)
- [x] SCAF-08 grep gate clean on both new files
- [x] All 8 required greps pass (6 function exports + 2 interface exports)
