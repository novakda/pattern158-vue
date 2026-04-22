---
phase: 49-convert-turndown
reviewed: 2026-04-20T12:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - scripts/editorial/convert.ts
  - scripts/editorial/turndown-plugin-gfm.d.ts
  - scripts/editorial/__tests__/convert.test.ts
  - scripts/editorial/types.ts
findings:
  critical: 0
  warning: 1
  info: 7
  total: 8
status: findings
---

# Phase 49: Code Review Report

**Reviewed:** 2026-04-20T12:00:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** findings (1 warning + 7 info, non-blocking)

## Summary

Phase 49 delivers a clean, well-documented conversion pipeline. The four exports (`sanitizeHtml`, `demoteHeadings`, `configureTurndown`, `collapseBlankLines`, `convertCapturedPage`, `convertCapturedPages`) are pure, synchronous, and deterministic by construction — no wall-clock reads, no RNG, no parallel iteration, sequential `for...of` over the ordered page list. The `ConvertedPage` shape matches the Phase 50 contract lock (8 fields, optional `cfCacheStatus`) exactly, and types.ts re-exports forward the extended shape cleanly. SCAF-08 grep gate is clean across all four files.

The 14-describe-block hermetic test suite (44 cases) binds directly to the CONTEXT.md test surface, including the byte-equal determinism self-test on the richest combined fixture and the `badge-high` compound-variant coverage called out in Plan 49-02.

One genuine functional gap surfaced during review: heading demotion drops every attribute on the rewritten heading element (class, id, aria-label, data-*), which deviates from the stated "preserve element class/aria-label" decision in 49-CONTEXT.md. Practical markdown output is unaffected today because Turndown ignores heading attributes for ATX rendering, but the behavior is silently diverging from the documented contract. The remaining items are minor hardening / coverage / documentation suggestions.

No security vulnerabilities, no determinism hazards in the code as written, no ReDoS patterns, and no test-quality concerns with the pipeline exercise — the determinism test does run the full `convertCapturedPage` end-to-end.

## Warnings

### WR-01: `demoteHeadings` drops all attributes on the rewritten heading

**File:** `scripts/editorial/convert.ts:58-65`

**Issue:** The heading-rewrite uses `doc.createElement(\`h${newLevel}\`)` + `newEl.innerHTML = oldEl.innerHTML` + `oldEl.replaceWith(newEl)`. Only `innerHTML` is copied from the original element; every attribute on the original heading — `class`, `id`, `aria-label`, non-`data-v-*` `data-*`, `lang`, `dir`, `role` — is silently discarded. This deviates from the 49-CONTEXT.md `<decisions>` block which explicitly states `sanitizeHtml` should **Preserve**: "element content, text nodes, `class`, `href`, `alt`, `aria-label` (for accessibility context), all non-`data-v-*` data attributes". In practice nothing breaks today because Turndown does not surface heading attributes in ATX output; this is a latent contract divergence that will bite the next time a downstream consumer reads a heading attribute (e.g., a custom Turndown rule keyed on `h3.category-header`).

**Fix:**
```ts
export function demoteHeadings(doc: Document): void {
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((oldEl) => {
    const currentLevel = Number(oldEl.tagName.charAt(1))
    const newLevel = Math.min(6, currentLevel + 2)
    if (newLevel === currentLevel) return
    const newEl = doc.createElement(`h${newLevel}`)
    // Copy attributes verbatim — sanitizeHtml's prior data-v-* walk
    // has already removed SFC attrs, so this preserves class/id/aria-label/etc.
    for (const attr of Array.from(oldEl.attributes)) {
      newEl.setAttribute(attr.name, attr.value)
    }
    newEl.innerHTML = oldEl.innerHTML
    oldEl.replaceWith(newEl)
  })
}
```
Add a test case asserting `sanitizeHtml('<h1 class="page-title" id="top">X</h1>')` yields output containing `class="page-title"` and `id="top"` on the resulting `<h3>`.

## Info

### IN-01: Badge regex does not match bare `.category` / `.severity` (CONTEXT.md inventory implies suffix required; reviewer focus implies otherwise)

**File:** `scripts/editorial/convert.ts:175`

**Issue:** The allowlist regex `/(^|\s)(badge|badge-\w+|pill|chip|tag|tag-\w+|severity-\w+|category-\w+)(\s|$)/` requires a hyphenated suffix for `severity-*` and `category-*`. Bare `<span class="category">` and `<span class="severity">` do NOT match. The review focus for this phase states `<span class="category">` *should* match, but the 49-CONTEXT.md class inventory (lines 139-147) lists only `.category-*` and `.severity-high/medium/low` — no bare `.category`. The current implementation matches the locked inventory, not the review-focus hypothesis. **No code change needed**; surfacing for confirmation. If bare `.category` / `.severity` tokens exist in the production design system and should render as bold, add bare alternatives: `category|category-\w+|severity|severity-\w+`.

**Fix:** Confirm intent against production CSS. If bare tokens are in scope, extend regex; if not, the existing behavior is correct and this item is informational.

### IN-02: `<span class="tags">` (plural) correctly excluded — add an explicit negative test

**File:** `scripts/editorial/__tests__/convert.test.ts:98-103`

**Issue:** The review focus calls out `<span class="tags">` as a must-not-match false-positive case. The current regex correctly excludes it (the trailing `s` prevents `(\s|$)` from matching after `tag`), but the only negative test uses `class="not-a-badge"`. There is no regression guardrail for the specific `tags` false-positive or the more subtle `taglike` / `badger` / `tagged` boundary cases.

**Fix:** Extend the existing "leaves non-allowlisted span classes alone" `it` with `.each` rows for the boundary cases:
```ts
it.each([
  ['unrelated class', '<span class="not-a-badge">plain</span>'],
  ['tags (plural)',   '<span class="tags">plain</span>'],
  ['tagged',          '<span class="tagged">plain</span>'],
  ['badger',          '<span class="badger">plain</span>'],
  ['prefixed-badge',  '<span class="my-badge">plain</span>'],
])('does not bold %s', (_desc, input) => {
  const md = configureTurndown().turndown(sanitizeHtml(input))
  expect(md).not.toContain('**plain**')
  expect(md).toContain('plain')
})
```

### IN-03: happy-dom / Turndown / GFM-plugin use caret ranges — determinism exposed to minor-version drift

**File:** `package.json:28,39,43` (referenced from `scripts/editorial/convert.ts`)

**Issue:** `package.json` pins `"happy-dom": "^20.8.4"`, `"turndown": "^7.2.4"`, `"@joplin/turndown-plugin-gfm": "^1.0.64"`. The caret allows minor/patch updates. CONV-02's byte-equal determinism contract can silently break across `pnpm install` runs if any of these three libraries changes serialization or rule output in a minor version (Plan 49-04 already discovered empirically that the GFM plugin pads 1-char table cells to width 3 — exactly the kind of format detail a minor release could shift). The lockfile pins versions for CI, but fresh clones + future `pnpm up` passes are exposed.

**Fix:** Consider pinning exact versions for the three libraries that materially affect output bytes: `"happy-dom": "20.8.4"`, `"turndown": "7.2.4"`, `"@joplin/turndown-plugin-gfm": "1.0.64"`. Alternatively, document the determinism-vs-maintenance trade-off in CONTEXT.md and rely on the CI determinism test to catch drift.

### IN-04: happy-dom Window created without explicit JS-disable settings (defense-in-depth)

**File:** `scripts/editorial/convert.ts:92`

**Issue:** `new Window()` uses happy-dom defaults. The editorial capture consumes HTML from pattern158.solutions (trusted, own site), so this is not an exploit path today. For defense-in-depth against a future capture of third-party content (or a supply-chain compromise upstream), happy-dom supports `disableJavaScriptEvaluation`, `disableJavaScriptFileLoading`, and `disableCSSFileLoading` settings that eliminate any possibility of inline `<script>` eval, `<img onerror>` handler fire, or network side-effects during `innerHTML` parsing.

**Fix:**
```ts
const window = new Window({
  settings: {
    disableJavaScriptEvaluation: true,
    disableJavaScriptFileLoading: true,
    disableCSSFileLoading: true,
  },
})
```

### IN-05: `document.documentElement.innerHTML = '<html><body>...</body></html>'` is an unusual parse shape

**File:** `scripts/editorial/convert.ts:94`

**Issue:** Setting `documentElement.innerHTML` with a string that itself contains `<html>...</html>` is atypical — by spec, `<html>` cannot nest inside `<html>`, so the outer tags are usually stripped by the parser. The simpler, equally correct form is `document.body.innerHTML = rawHtml`. The current form works (tests pass), but reads oddly and relies on happy-dom parser leniency.

**Fix:**
```ts
const window = new Window()
const document = window.document
document.body.innerHTML = rawHtml
```
Verify the existing test suite stays green after the change.

### IN-06: `linkReferenceStyle: 'full'` is dead config when `linkStyle: 'inlined'`

**File:** `scripts/editorial/convert.ts:146`

**Issue:** `linkReferenceStyle` is only consulted when `linkStyle === 'referenced'`. With `linkStyle: 'inlined'` (locked), this option has no effect. The CONTEXT.md contract calls for it so removing it changes the documented surface; the JSDoc at lines 123-125 correctly calls out that it's "consulted only when linkStyle === 'referenced'". Flagging for future cleanup (low priority).

**Fix:** No change required. Either leave as-is for explicit contract mirroring, or drop the key when the next CONTEXT.md lock revision happens.

### IN-07: `as unknown as Document` double-cast papers over a structural gap

**File:** `scripts/editorial/convert.ts:111`

**Issue:** `demoteHeadings(document as unknown as Document)` casts happy-dom's Document to the standard-lib DOM Document. The two types are structurally close but not identical — `createElement`, `querySelectorAll` return types, iterator protocols, and event-target shapes can drift. The double-cast silences TypeScript's structural guard, so a future happy-dom major could subtly break heading demotion at runtime without a compile-time signal. Low risk given happy-dom's DOM-conformance target, but the cast is an escape hatch worth tracking.

**Fix:** Option A (preferred long-term): import the happy-dom Document type and change `demoteHeadings`'s signature to accept both: `demoteHeadings(doc: Document | HappyDomDocument)` via a `type` alias. Option B (minimal): add a `// TODO(v9.0): revisit if happy-dom Document shape drifts` comment next to the cast so future readers know the cast is load-bearing.

---

_Reviewed: 2026-04-20T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
