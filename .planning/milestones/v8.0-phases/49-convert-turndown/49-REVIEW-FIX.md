---
phase: 49
fixed_at: 2026-04-20T18:20:00Z
review_path: .planning/phases/49-convert-turndown/49-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 4
status: all_fixed
---

# Phase 49: Code Review Fix Report

**Fixed at:** 2026-04-20T18:20:00Z
**Source review:** .planning/phases/49-convert-turndown/49-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (1 warning + 3 info, low-risk quick wins)
- Fixed: 4
- Skipped (out of scope): 4
- Tests after each fix: `pnpm test:scripts` 309/309 pass
- Final build: `pnpm build` exit 0

## Fixed Issues

### WR-01: `demoteHeadings` drops all attributes on the rewritten heading

**Files modified:** `scripts/editorial/convert.ts`, `scripts/editorial/__tests__/convert.test.ts`
**Commit:** 5b93efa
**Applied fix:** Added an `Array.from(oldEl.attributes)` copy loop immediately before the existing `innerHTML` + `replaceWith` calls in `demoteHeadings`. Every attribute (class/id/aria-label/data-*/lang/dir/role/etc.) is now carried verbatim onto the new heading element. Added a regression test `preserves attributes (class/id/aria-label/data-*) on the demoted heading` asserting all four attribute types survive the `h1`→`h3` rewrite. Restores conformance with the 49-CONTEXT.md `<decisions>` preserve contract.

### IN-02: `<span class="tags">` (plural) — explicit negative test

**Files modified:** `scripts/editorial/__tests__/convert.test.ts`
**Commit:** 82100d6
**Applied fix:** Added a parameterized `it.each` block in the `pattern158-badges rule (CONV-05)` describe with four boundary-case rows — `tags` (plural), `tagged`, `badger`, `my-badge` — each asserting the span content appears unbolded in the markdown output. Guards the regex word-boundary anchors against future drift.

### IN-05: `document.documentElement.innerHTML = '<html><body>...</body></html>'` parse shape

**Files modified:** `scripts/editorial/convert.ts`
**Commit:** 3c8566c
**Applied fix:** Replaced `document.documentElement.innerHTML = \`<html><body>${rawHtml}</body></html>\`` with `document.body.innerHTML = rawHtml` in `sanitizeHtml`. Equivalent parse result (the outer `<html>` tags were being stripped by the parser anyway per HTML spec), removes reliance on happy-dom parser leniency. All existing sanitize / heading-demote / badge / table / list / link / determinism tests remain green.

### IN-06: `linkReferenceStyle: 'full'` dead config

**Files modified:** `scripts/editorial/convert.ts`
**Commit:** ec566d0
**Applied fix:** Removed the `linkReferenceStyle: 'full'` key from the `TurndownService` config in `configureTurndown` since Turndown only reads it when `linkStyle === 'referenced'`, and `linkStyle` is locked to `'inlined'`. Updated the surrounding JSDoc to document the omission rather than a dead option. Zero output behavior change (confirmed by the unchanged determinism self-test).

## Skipped Issues

### IN-01: Badge regex does not match bare `.category` / `.severity`

**File:** `scripts/editorial/convert.ts:175`
**Reason:** out of fix scope — review classifies this as a confirmation request, not a finding. Current regex matches the 49-CONTEXT.md class inventory (`.category-*` and `.severity-high|medium|low`). No code change warranted until production CSS is re-audited.

### IN-03: caret-range determinism exposure

**File:** `package.json:28,39,43`
**Reason:** out of fix scope — ecosystem convention, not a Phase 49 concern. Changing dependency pin style is a cross-cutting decision better handled at the repository level, not mid-phase.

### IN-04: happy-dom Window without explicit JS-disable settings

**File:** `scripts/editorial/convert.ts:92`
**Reason:** out of fix scope — defense-in-depth hardening, not required for the locked-input editorial capture pipeline. Noted for future revisit if the capture source broadens beyond the trusted own-site corpus.

### IN-07: `as unknown as Document` double-cast

**File:** `scripts/editorial/convert.ts:111`
**Reason:** out of fix scope — structural drift guard is intentional per the file-scoped DOM lib reference pattern. The cast is load-bearing (happy-dom Document vs standard-lib DOM Document) and changing the signature of `demoteHeadings` to accept a union type widens the exported API surface.

---

_Fixed: 2026-04-20T18:20:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
