# Phase 49: Convert (Turndown) - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning
**Mode:** Smart discuss — 5 ROADMAP success criteria + 9 CONV-01..09 REQ-IDs; 3 grey areas resolved

<domain>
## Phase Boundary

Build `scripts/editorial/convert.ts` so that `convertCapturedPage(page: CapturedPage): ConvertedPage` produces clean, deterministic Markdown from the hydrated `<main id="main-content">` HTML captured in Phase 48. Turndown 7.2.4 + `@joplin/turndown-plugin-gfm` (full plugin). Pre-conversion DOM sanitization strips `<script>`, `<style>`, `<noscript>`, `[aria-hidden="true"]` subtrees and all `data-v-*` SFC attributes. Heading demotion (H1→H3), badge/pill preservation as bold, alt-text-only images, href preservation verbatim, blank-line collapse to 2. Unit tests cover all fixture types.

**Not in scope:** file I/O, orchestration (Phase 50), internal-link rewriting (`CONV-INTL` deferred).

</domain>

<decisions>
## Implementation Decisions

### DOM Sanitization (CONV-02, CONV-07)
- **Parser**: Turndown's built-in JSDOM-based parser (comes with the `turndown` package in Node). No extra dep (cheerio, parse5) added.
- **Phase**: pre-Turndown. Parse raw HTML once → mutate DOM in place (strip subtrees + attribute walk) → serialize → hand to Turndown. Turndown walks clean DOM; no post-filter churn.
- **Strip subtrees**: `<script>`, `<style>`, `<noscript>`, any element with `aria-hidden="true"` — removed entirely (including children) from the DOM before serialization.
- **Strip attributes**: every element — remove any attribute whose name matches `/^data-v-/`. Walked via `element.attributes` iteration + `removeAttribute`. No regex-on-string (fragile with quoted values).
- **Preserve**: element content, text nodes, `class`, `href`, `alt`, `aria-label` (for accessibility context), all non-`data-v-*` data attributes, GFM-table classes.
- **Module surface**: single exported `sanitizeHtml(rawHtml: string): string` helper. Pure, deterministic, unit-testable in isolation from Turndown.

### Badge/Pill Preservation (CONV-05)
- **Detection**: class allowlist — any `<span>` (or `<a>`) matching `.badge`, `.pill`, `.chip`, `.tag`, `.tag-*` (via `[class*=" tag-"]` / `[class^="tag-"]`), `.severity-*`, `.category-*`. Matches the site's actual design-system CSS from Phase 7+.
- **Rendering**: **bold** (`**text**`) — scannable in editorial review, survives Obsidian reading view. Applied via Turndown custom rule (`filter` matches the allowlist, `replacement` returns `**${content}**`).
- **Nested structure**: if badge contains icon + text spans, flatten to text-only (strip icon subtree before rendering).
- **Inline behavior**: badges stay inline (not block) — no forced line break.
- **Non-goal**: no per-badge-type conditional rendering. Uniform bold.

### Heading Demotion (CONV-04)
- **Impl**: pre-Turndown DOM mutation — walk `h1..h6`, rewrite each tag to `h(level+2)`, clamp at `h6` (h5→h6, h6→h6). Handled INSIDE `sanitizeHtml` as its last step (after subtree strip + data-v-* attr walk) so Turndown sees the demoted DOM directly.
- **Why pre-Turndown**: post-Turndown string transform on `#` prefix is fragile (ATX vs. setext, code blocks, fenced-block content). DOM rewrite is deterministic and visible in tests.
- **Nesting contract** (for Phase 50): page H1 becomes H3 so it nests cleanly under the `## Route: /path` wrapper heading that Phase 50 adds.

### Blank-Line Collapse (CONV-08)
- **Impl**: post-Turndown string transform — `markdown.replace(/\n{3,}/g, '\n\n')`. Runs once at the end of `convertCapturedPage`. Idempotent.
- **Code-block exemption**: not needed. Turndown emits fenced blocks with `\`\`\`` or `~~~` and does not produce 3+ consecutive blank lines inside fences. Smoke-tested during unit tests.

### Image Handling (CONV-03)
- **Rule**: Turndown custom rule on `img`. If `alt` is a non-empty string, emit plain text of the alt value. If `alt` is missing/empty, skip the image entirely (return empty string). **No** `![alt](src)` Markdown anywhere. **No** base64 data URLs ever.
- **Rationale**: editorial-review corpus needs text-only; screenshots provide visual reference.

### Link Handling (CONV-07)
- **Rule**: Turndown default behavior, with hrefs preserved verbatim. No internal-link rewriting. No URL normalization. `<a href="/faq">FAQ</a>` → `[FAQ](/faq)` exactly.
- **Mailto / tel / external**: all pass through.

### GFM Plugin (CONV-01)
- **Plugin**: `@joplin/turndown-plugin-gfm` `gfm` combined export (tables + strikethrough + task lists). `turndownService.use(gfm)` once, after custom rules are registered.
- **Version lock**: Turndown 7.2.4 (from `package.json`). `@joplin/turndown-plugin-gfm` 1.0.64. Both already installed in v7.0 scaffolding.

### Turndown Config (CONV-06, CONV-01)
- Service config: `{ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*', strongDelimiter: '**', linkStyle: 'inlined', linkReferenceStyle: 'full' }`.
- DOM-order preservation: Turndown walks DOM in document order by default; no config needed. Verified by unit test (nested-list + table fixture).
- **Sequential only**: no parallel iteration (SCAF-08).

### Export Surface
```ts
// scripts/editorial/convert.ts
export function sanitizeHtml(rawHtml: string): string
export function demoteHeadings(doc: Document): void        // in-place mutation (used by sanitizeHtml)
export function configureTurndown(): TurndownService        // factory — registers rules + GFM plugin
export function collapseBlankLines(markdown: string): string
export function convertCapturedPage(page: CapturedPage): ConvertedPage
export function convertCapturedPages(pages: readonly CapturedPage[]): readonly ConvertedPage[]
```

### `ConvertedPage` Final Shape (lock for Phase 50)
```ts
interface ConvertedPage {
  readonly route: CapturedPage['route']
  readonly markdown: string
  readonly httpStatus: number
  readonly title: string
  readonly description: string
  readonly consoleErrors: readonly string[]
  readonly screenshotPath: string
  readonly cfCacheStatus?: string
}
```
Carries Phase 48 capture metadata through to Phase 50 so the writer has everything it needs in one object per page.

### Test Surface (CONV-09)
- File: `scripts/editorial/__tests__/convert.test.ts`.
- Unit tests:
  - **Sanitization**: strip `<script>`, `<style>`, `<noscript>`; strip `[aria-hidden="true"]` subtree; strip every `data-v-*` attribute.
  - **Heading demotion**: h1→h3, h2→h4, h3→h5, h4→h6, h5→h6 (clamp), h6→h6 (clamp).
  - **Badge/pill**: `<span class="badge">HIGH</span>` → `**HIGH**`; `<span class="tag-accessibility">A11Y</span>` → `**A11Y**`; icon+text badge flattens to text-only bold.
  - **GFM table**: simple 2-col table → pipe-table markdown.
  - **Nested list**: 3-level nested `<ul>`/`<ol>` preserves hierarchy.
  - **Image with alt**: `<img alt="Hero" src="/x.png">` → `Hero` (bare text).
  - **Image without alt**: `<img src="/x.png">` → (empty, skipped).
  - **Link hrefs**: `/faq` preserved verbatim; external preserved verbatim.
  - **Blank-line collapse**: input with 4 consecutive blanks → output with 2.
  - **Determinism self-test** (CONV-02): convert the richest combined fixture twice, assert byte-equal.
  - **DOM-order preservation**: table after list after paragraph stays in that order.
- All fixtures inline in the test file (hermetic, no file reads).

### Determinism + SCAF-08 Discipline
- No `Date.now()`, no `Math.random()` — conversion is a pure function of input HTML.
- No `os.EOL` — literal `\n` only.
- No `@/` aliases — relative `.ts` imports only.
- No `Promise.all` over pages — `convertCapturedPages` uses sequential `for...of`.

### Error Surface
- `sanitizeHtml` and `configureTurndown` do not throw on valid HTML. If parsing fails (malformed DOM), Turndown's parser is permissive — emit best-effort markdown.
- `convertCapturedPage` accepts any `CapturedPage` shape. If `mainHtml` is empty string, output is empty markdown. No `ConvertError` class — conversion failures would indicate a capture-phase bug.

### Claude's Discretion
- Exact Turndown rule name strings (e.g., `'pattern158-badges'`) — pick whatever reads well.
- Order of sanitizeHtml sub-steps (subtree-strip → attr-walk → demote) — stable, document it.
- Internal type `type BadgeSelector = string` or similar — keep it simple.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/editorial/convert.ts` (Phase 46 placeholder) — interface stub + throwing body. Phase 49 replaces the body and extends `ConvertedPage` with 3 extra fields (`consoleErrors`, `screenshotPath`, `cfCacheStatus?`).
- `scripts/editorial/types.ts` — re-exports `ConvertedPage` from `convert.ts`. Picks up the extended shape automatically.
- `scripts/editorial/capture.ts` (Phase 48, just landed) — exports `CapturedPage` with `route`, `httpStatus`, `mainHtml`, `title`, `description`, `consoleErrors`, `screenshotPath`, `cfCacheStatus?`. `convertCapturedPage` reads `page.mainHtml` as input.
- `turndown` 7.2.4 + `@joplin/turndown-plugin-gfm` 1.0.64 + `@types/turndown` 5.0.6 — all installed from Phase 46 SCAF-05.

### Established Patterns
- Composite TS project + NodeNext: `.ts` extension on relative imports.
- Vitest `scripts` project globals; inline test fixtures.
- Throwing-stub → concrete impl pattern proven across Phases 46, 47, 48.
- `CaptureError` class precedent — no equivalent `ConvertError` needed (per decision above).

### Integration Points
- `index.ts` (still placeholder after Phase 48) — Phase 50 wires `convertCapturedPages` into orchestration.
- `write.ts` — consumes `ConvertedPage[]` in Phase 50. This phase's `ConvertedPage` shape is the contract Phase 50 reads.
- Forbidden-pattern grep gate from Phase 46 still applies.

### Badge/Pill Class Inventory (verified against site CSS)
From Phase 5+/7+ design system (Phase 7 refactor):
- `.badge` / `.badge-*` — general pill
- `.pill` — specific button/chip pill
- `.chip` — utility chip
- `.tag` / `.tag-accessibility` / `.tag-performance` / etc. — category tags
- `.severity-high` / `.severity-medium` / `.severity-low` — finding severity
- `.category-*` — finding category

</code_context>

<specifics>
## Specific Ideas

- **sanitizeHtml sub-step order**:
  1. Parse raw HTML into `Document` via Turndown's JSDOM.
  2. Remove subtrees: `document.querySelectorAll('script, style, noscript, [aria-hidden="true"]').forEach(el => el.remove())`.
  3. Attribute walk: iterate every element in document; `for (const attr of [...el.attributes]) { if (attr.name.startsWith('data-v-')) el.removeAttribute(attr.name) }`.
  4. Heading demote: `document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(el => rewriteTag(el, clampedLevel+2))`.
  5. Serialize `document.body.innerHTML` (or `main` if wrapping persists).
- **Turndown rule order**: register custom `img` rule + `pattern158-badges` rule BEFORE `.use(gfm)` — so the GFM plugin's own `strikethrough`/`tables`/`task-list` rules don't interfere.
- **Badge rule** — selector form for Turndown `filter`:
  ```ts
  filter: (node) => {
    const tag = node.nodeName.toLowerCase()
    if (tag !== 'span' && tag !== 'a') return false
    const cls = node.getAttribute('class') ?? ''
    return /(^|\s)(badge|pill|chip|tag|tag-\w+|severity-\w+|category-\w+)(\s|$)/.test(cls)
  }
  ```
- **Clamp helper**:
  ```ts
  const newLevel = Math.min(6, Math.max(1, currentLevel + 2))
  ```
- **Heading rewrite implementation**: since `node.tagName` is read-only, rewriting requires creating a new element and replacing — `const newEl = doc.createElement(\`h${newLevel}\`); newEl.innerHTML = oldEl.innerHTML; oldEl.replaceWith(newEl)`.

</specifics>

<deferred>
## Deferred Ideas

- **Internal-link rewriting** (`CONV-INTL`) — route hrefs → in-doc anchors. Out of scope for v8.0, tracked in REQUIREMENTS.md.
- **Table column alignment preservation** — GFM pipe tables currently emit default alignment; explicit left/right/center detection from CSS is deferred.
- **Inline styles** — `style="..."` attributes are ignored (no CSS-to-markdown); if editorial review surfaces style-carrying content, revisit in v9.0.
- **SVG content** — inline `<svg>` is dropped by Turndown; acceptable for editorial text corpus.
- **`<picture>` / `<source>`** — treated as containers; inner `<img>` rule fires as normal.

</deferred>
