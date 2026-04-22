---
phase: 53-dom-extraction
plan: 02
subsystem: tooling
tags: [extractor, faq, json-fallback, happy-dom, dom-extraction, tdd, scaf-08]

requires:
  - phase: 53-dom-extraction
    plan: 01
    provides: FaqItem interface, ExtractorError class, parseHtml helper in scripts/tiddlywiki/extractors/types.ts
provides:
  - "emitFaqItems(html) — parses .faq-accordion-item DOM into FaqItem[] with slugified id, question text, concatenated answer, category-pill array"
  - "emitFaqItemsFromJson(rawJson) — JSON fallback path: parses raw FAQ JSON into FaqItem[] with type-guard defaulting"
  - scripts/tiddlywiki/extractors/faq.test.ts — 8 it-cases covering happy path, multiple categories, missing-field, malformed-DOM guard, idempotency, exhibit-callout passthrough, JSON fallback happy path, JSON fallback malformed
affects: [53-05, 53-06, 53-07, 53-08, 53-09, 55-iter-1-fixes]

tech-stack:
  added: []
  patterns:
    - "NodeList .forEach mirrors Wave 1 parseHtml pattern; scripts tsconfig ES2022 lib excludes DOM.Iterable so for-of on NodeList would fail type-check — for-of is reserved for plain Array iteration over the JSON fallback output"
    - "Slugification of the question as the id derivation rule when HTML has no explicit id attribute (JSON fallback carries id verbatim)"
    - "textContent on .faq-answer div concatenates all descendant text including exhibit-callout anchor text — callers that need stripped callouts do post-processing at their layer"

key-files:
  created:
    - scripts/tiddlywiki/extractors/faq.ts
    - scripts/tiddlywiki/extractors/faq.test.ts
  modified:
    - tsconfig.scripts.json

key-decisions:
  - "emitFaqItems throws ExtractorError when zero .faq-accordion-item elements exist in the input HTML — matches the plan's malformed-DOM guard test"
  - "Missing .faq-answer inside a FAQ item yields an empty-string answer rather than throwing — callers get a total shape even under partial DOM"
  - "JSON fallback defaults missing/non-string fields to empty strings and missing categories array to empty array — extractors own the defaulting per Wave 1 scaffold pattern"
  - "readonly FaqItem[] return type on both functions — internal mutable FaqItem[] buffer is returned as readonly at the type boundary"
  - "Three commits (test / feat / fix) rather than two — Wave 1 scaffold gap required a separate tsconfig.scripts.json fix that affects all Wave 2 plans, documented under deviations"

patterns-established:
  - "Extractor module shape: import { parseHtml, ExtractorError, type EntityInterface } from './types.ts'; top-level const SELECTOR_NAME = '...'; throw ExtractorError on wrapper-missing; return readonly EntityInterface[]"
  - "JSON fallback sibling module shape: JSON.parse inside try/catch throwing ExtractorError with cause, Array.isArray root check, per-item type guard with required-with-default coercion — no throws on missing fields, only on parse failure or non-array root"

requirements-completed: [EXTR-01]

duration: 6m 01s
completed: 2026-04-22
---

# Phase 53 Plan 02: FAQ Extractor (EXTR-01) Summary

**FAQ DOM extractor with JSON fallback: emitFaqItems parses `.faq-accordion-item` into FaqItem[]; emitFaqItemsFromJson is the sibling fallback the caller invokes when HTML source is absent. 8 inline-HTML-fixture tests green, byte-identical idempotency verified, EXTR-01 satisfied.**

## Performance

- **Duration:** 6m 01s
- **Started:** 2026-04-22T05:42:43Z
- **Completed:** 2026-04-22T05:48:44Z
- **Tasks:** 2 (plus 1 Rule 3 scaffold deviation)
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments

- `scripts/tiddlywiki/extractors/faq.ts` created — 79 lines, two exported pure functions.
  - `emitFaqItems(html: string): readonly FaqItem[]` — parses `.faq-accordion-item` DOM via the Wave 1 `parseHtml` helper. Selectors: `.faq-accordion-item` (wrapper), `.faq-accordion-question` (question text source), `.faq-category-pill` (category array, DOM source order), `.faq-answer` (answer `textContent`, includes exhibit-callout anchor text). ID derived by slugifying the question (`lowercase → non-[a-z0-9]+ runs replaced with '-' → trim leading/trailing '-'`).
  - `emitFaqItemsFromJson(rawJson: string): readonly FaqItem[]` — parses the fallback JSON root (must be an array). Type-guards each field; missing/non-string fields default to empty string, missing categories default to empty array. Non-string entries in categories are filtered out.
  - Both functions throw `ExtractorError` on structural failure: `emitFaqItems` throws when zero `.faq-accordion-item` elements exist; `emitFaqItemsFromJson` throws on invalid JSON or non-array root.
- `scripts/tiddlywiki/extractors/faq.test.ts` created — 140 lines, 8 `describe` blocks / 8 `it` cases:
  1. `emitFaqItems — happy path`: two-item fixture, id/question/answer/categories populated
  2. `emitFaqItems — multiple categories`: source-order preservation (`['hiring', 'approach']`)
  3. `emitFaqItems — missing-field edge`: missing `.faq-answer` yields empty-string answer, no throw
  4. `emitFaqItems — malformed-DOM guard`: `<div>no faq here</div>` throws `ExtractorError`
  5. `emitFaqItems — idempotency`: two sequential calls produce byte-identical `JSON.stringify` output
  6. `emitFaqItems — exhibit-callout inside answer`: answer `textContent` includes callout anchor text (no stripping)
  7. `emitFaqItemsFromJson — happy path`: well-formed JSON → FaqItem[] with verbatim id
  8. `emitFaqItemsFromJson — malformed JSON`: `'not json at all'` throws `ExtractorError`
- `tsconfig.scripts.json` modified — added `allowImportingTsExtensions: true` + `"vitest/globals"` to `types`. See Deviation 1 below.
- `pnpm build` exits 0 after the tsconfig fix.
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/faq.test.ts` exits 0 with 8/8 tests passing.
- `pnpm test:scripts --run` (full scripts project) exits 0 with 31 files / 458 tests passing — no regression on markdown-export or editorial tests after adding `"vitest/globals"` to the types array.
- SCAF-08 grep clean on both files (`setTimeout\(|Date\.now\(|new Date\(|Promise\.all\(` returns exit 1 = no matches).
- Strict type-check (`tsc --noEmit --project tsconfig.scripts.json`) produces zero errors attributable to `faq.ts` or `faq.test.ts`.

## Task Commits

1. **Task 1 (RED): Add failing FAQ extractor tests** — `b2714ab` (test). Inline HTML template-literal fixtures, no fs I/O, 8 describe blocks covering all 9 plan behaviors (multiple-categories test also verifies the happy-path categories-list shape, so tests 1+2 collapse into 2 describes but still cover both behaviors).
2. **Task 2 (GREEN): Implement emitFaqItems + emitFaqItemsFromJson** — `9ae3fa0` (feat). All 8 tests pass; idempotency holds; EXTR-01 satisfied.
3. **Deviation fix: Add vitest/globals + allowImportingTsExtensions to scripts tsconfig** — `619c82e` (fix). Unblocks `pnpm build` for this plan and all parallel Wave 2 plans.

## DOM Selectors Used

| Selector                   | Purpose                                                      | Source                         |
| -------------------------- | ------------------------------------------------------------ | ------------------------------ |
| `.faq-accordion-item`      | FAQ wrapper (`<details>`); length check gates throw          | `static-site/faq.html:15`      |
| `.faq-accordion-question`  | Question text inside `<summary>` span                        | `static-site/faq.html:15` etc. |
| `.faq-category-pill`       | Category span (multiple per item, source-order preserved)    | `static-site/faq.html:15` etc. |
| `.faq-answer`              | Answer div; `textContent` includes nested exhibit-callout    | `static-site/faq.html:15` etc. |

DOM shape confirmed against the live file via grep on `static-site/faq.html` during research: 24 `.faq-accordion-item` elements, some with 1 category pill, some with 2, some with embedded `<div class="exhibit-callout">` children inside `.faq-answer`. The test fixtures mirror each of these real-world variants inline.

## Decisions Made

- **Id derivation from slugified question (not from a DOM id attribute)** — the live `static-site/faq.html` `.faq-accordion-item` elements carry `class="faq-accordion-item is-open"` and `open=""` but no `id` attribute. The JSON fallback source does carry an explicit `id`, so `emitFaqItemsFromJson` preserves it verbatim while `emitFaqItems` derives it. Slugify algorithm lifted directly from the plan: lowercase → `[^a-z0-9]+` runs replaced with `-` → trim leading/trailing `-`.
- **textContent for the answer body (not innerHTML / stripped HTML)** — per the plan test 9, exhibit-callout anchor text must appear in the emitted answer. `textContent` concatenates all descendant text including anchor text, which is the correct behavior for downstream tiddler generation. Callers that want stripped callouts do their own post-processing.
- **Missing .faq-answer yields empty string (not undefined, not throw)** — matches the Wave 1 scaffold pattern "optional-in-source fields become required-with-default-in-output (empty string / empty array / 0) to give callers total shapes". Keeps the FaqItem shape non-optional and eliminates `| undefined` noise at downstream call sites.
- **Throw only on wrapper-missing (not on per-item missing question)** — the plan's Test 4 establishes the wrapper-missing guard as the only structural failure mode. Per-item partial shapes are tolerated via defaulting. This matches the extractor-wide pattern from `types.ts` / Wave 1.
- **`forEach` over `for-of` for NodeList iteration** — scripts tsconfig ES2022 lib does not include DOM.Iterable, so `for-of` on NodeList would fail type-check. The Wave 1 scaffold (and convert.ts reference) already uses this exact pattern. `for-of` is reserved for plain-array iteration over the JSON fallback output, where ES2022 Array iteration is fine.
- **Three commits instead of two** — separating the tsconfig deviation into its own `fix(53-02): …` commit lets git blame attribute that scaffold-gap fix separately from the plan's scoped work. Clean attribution matters because every parallel Wave 2 plan depends on the same fix.

## Test Scenario Count and Pass Rate

- **Describe blocks:** 8 (plan floor: 7, so >= 7 gate met)
- **It-cases:** 8 (one per describe; happy path + multiple-categories share the two-item fixture through test 1 but the source-order preservation is asserted in its own case)
- **Pass rate:** 8/8 = 100%
- **Idempotency:** byte-identical `JSON.stringify` output confirmed across two sequential `emitFaqItems(html)` calls on the same input

## Idempotency Confirmation

Test 5 (`emitFaqItems — idempotency`) runs `JSON.stringify(emitFaqItems(html))` twice in the same process on the same input HTML and asserts equality. Implementation is deterministic by construction: `parseHtml` constructs a fresh happy-dom `Window` per call (no shared parser state); selectors are literal strings; slugify is a pure function; no wall-clock reads; no randomness; NodeList iteration order is deterministic given a fixed input DOM. Test passes. EXTR-01 idempotency requirement met.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking scaffold gap] Added `vitest/globals` + `allowImportingTsExtensions` to tsconfig.scripts.json**

- **Found during:** Task 2 verification (first `pnpm build` after faq.ts implementation committed).
- **Issue:** `pnpm build` failed with TS2593 (`Cannot find name 'describe' / 'it' / 'expect'`) and TS5097 (`An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled`) errors on every Wave 2 `*.test.ts` file, including `faq.test.ts`. Root cause: Wave 1 Plan 53-01 extended `tsconfig.scripts.json` `include` to cover `scripts/tiddlywiki/**/*.ts` but did not copy over the two compiler options that test files rely on. The existing `tsconfig.editorial.json` already has `allowImportingTsExtensions: true` and `types: ["node", "vitest/globals"]`; `tsconfig.scripts.json` only had `types: ["node"]` with no `allowImportingTsExtensions` key. `scripts/markdown-export/**/*.test.ts` files worked around this by using explicit `import { describe, it, expect } from 'vitest'` + `.js`-extension imports; the Wave 2 extractor tests (this plan and 5 sibling RED commits already on main) instead use globals + `.ts` imports per the Wave 2 plan instructions.
- **Why this is Rule 3 not Rule 4:** Pure compiler-option fix with a direct Wave 1 precedent (`tsconfig.editorial.json`). No architectural change, no new dependency, no break in existing behavior. Both flags are safe additions: `emitDeclarationOnly: true` is already set (a precondition for `allowImportingTsExtensions`), and adding `"vitest/globals"` to `types` is additive — explicit `import { describe } from 'vitest'` in the markdown-export tests continues to work.
- **Why the scope expansion beyond files_modified:** The Wave 1 scaffold gap breaks every Wave 2 plan's `pnpm build` exit 0 requirement. All 6 parallel Wave 2 executors would otherwise need to apply the same fix concurrently, creating merge churn. Resolving it once here is strictly scope-preserving for the shared scaffold boundary; the plan's `faq.ts` + `faq.test.ts` are unchanged from what the plan specified.
- **Fix:** Added `"allowImportingTsExtensions": true` and extended `types` from `["node"]` to `["node", "vitest/globals"]`.
- **Files modified:** `tsconfig.scripts.json` (2 insertions, 1 deletion).
- **Verification:** `pnpm build` exits 0; full `pnpm test:scripts` exits 0 with 31 files / 458 tests (up from 401 pre-Wave-2, delta +57 from the Wave 2 extractor tests); `faq.test.ts` 8/8 green; `tsc --noEmit --project tsconfig.scripts.json` reports zero errors attributable to my files.
- **Committed in:** `619c82e` (`fix(53-02): add vitest/globals + allowImportingTsExtensions to scripts tsconfig`).
- **Wave 1 / sibling-plan follow-up:** None needed. Wave 1 SUMMARY's truth claim `import { FaqItem, ExtractorError, parseHtml, … } from './types.ts' resolves under both pnpm build and pnpm test:scripts` was only verified for production code, not for test files; this fix retroactively honors that claim for the test-file path. Sibling Wave 2 plans benefit automatically from the shared tsconfig.

---

**Total deviations:** 1 auto-fixed (Rule 3 scaffold gap).
**Impact on plan:** Scope-preserving for the plan's in-directory files. Necessary scope expansion to `tsconfig.scripts.json` is surgical and documented.

## Issues Encountered

- One SCAF-08 grep false positive on the initial `faq.ts` header comment: `// SCAF-08 forbidden tokens: no setTimeout, no Date.now(), no new Date(), no Promise.all, …` — the regex `Date\.now\(` and `new Date\(` matched the prose. Rewrote the header to use prose phrasing (`no wall-clock reads, no instantiated dates, no parallel iteration helpers`) that describes the policy without triggering the grep. Fix applied before commit, so the committed faq.ts is clean.
- Build failure during verification was attributable to the Wave 1 scaffold gap described in Deviation 1, not to any `faq.*` file. Isolation verified by running `tsc --noEmit` and filtering errors for `faq.ts` / `faq.test.ts` — zero errors attributable to my files before the tsconfig fix was committed.

## User Setup Required

None — no external service configuration. The extractor is a pure function consumed by Phase 55 (FIX-02) when it wires `generate.ts`; Phase 53 ships the extractor contract only.

## Next Phase Readiness

- **Phase 54 (ATOM-*)**: can `import { emitFaqItems } from '../extractors/faq.ts'` if FAQ-derived tiddlers are needed.
- **Phase 55 (FIX-02)**: wires extractor layer into `scripts/tiddlywiki/generate.ts`. For FAQ specifically, the caller decides the fallback trigger:
  ```ts
  // conceptual — Phase 55 will implement:
  const faqHtmlPath = 'static-site/faq.html'
  let faqItems: readonly FaqItem[]
  if (fs.existsSync(faqHtmlPath)) {
    faqItems = emitFaqItems(fs.readFileSync(faqHtmlPath, 'utf8'))
  } else {
    process.stderr.write('[tiddlywiki:extract] faq.html absent — using JSON fallback\n')
    faqItems = emitFaqItemsFromJson(fs.readFileSync('src/data/json/faq.json', 'utf8'))
  }
  ```
  Both functions return the same readonly FaqItem[] shape — the caller swap is a one-conditional branch.
- **Sibling Wave 2 plans (53-03..53-09)**: automatically benefit from the scripts-tsconfig fix; their `pnpm build` should now exit 0 without any changes on their side.

## Self-Check: PASSED

- `scripts/tiddlywiki/extractors/faq.ts` — FOUND
- `scripts/tiddlywiki/extractors/faq.test.ts` — FOUND
- `tsconfig.scripts.json` — modified (`allowImportingTsExtensions: true` + `"vitest/globals"` in types)
- Commit `b2714ab` (Task 1 RED) — FOUND in git log
- Commit `9ae3fa0` (Task 2 GREEN) — FOUND in git log
- Commit `619c82e` (Rule 3 tsconfig fix) — FOUND in git log
- `pnpm build` exit 0 — verified
- `pnpm test:scripts --run scripts/tiddlywiki/extractors/faq.test.ts` exit 0 (8/8 tests) — verified
- `pnpm test:scripts --run` (full scripts project) exit 0 (31 files / 458 tests) — verified
- SCAF-08 grep clean on both faq.ts and faq.test.ts — verified (`grep -nE 'setTimeout\(|Date\.now\(|new Date\(|Promise\.all\('` exits 1 on both)
- EXTR-01 satisfied: emitFaqItems parses HTML, emitFaqItemsFromJson parses JSON fallback, both return readonly FaqItem[], idempotent by construction, throw ExtractorError on structural failure

## TDD Gate Compliance

- **RED gate:** `test(53-02): add failing FAQ extractor tests (RED)` — commit `b2714ab`. Tests failed at the module-resolution layer (`faq.ts` not yet on disk), matching the plan's Task 1 expectation.
- **GREEN gate:** `feat(53-02): implement FAQ extractor with JSON fallback (GREEN)` — commit `9ae3fa0`. All 8 tests pass.
- **REFACTOR gate:** not triggered — initial GREEN implementation is idiomatic and covered by the plan-provided skeleton; no post-GREEN cleanup needed.
- **Deviation fix:** commit `619c82e` is not part of the RED-GREEN-REFACTOR gate sequence — it's a scaffold-scope Rule 3 auto-fix on `tsconfig.scripts.json`, applied after GREEN to unblock the plan's `pnpm build` verification.

---
*Phase: 53-dom-extraction*
*Completed: 2026-04-22*
