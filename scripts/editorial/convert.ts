// scripts/editorial/convert.ts
// Phase 49 — DOM sanitization + heading demotion + Turndown conversion (CONV-01..09).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic wall-clock APIs (use injected/fixed values)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//   - Node timer primitives (use the DOM-parser's synchronous surface only)
//
// File-scoped DOM lib reference: sanitizeHtml + demoteHeadings reference
// standard DOM interfaces (Document, Element, HTMLImageElement) that happy-dom
// implements. The editorial tsconfig intentionally omits the 'dom' lib globally
// (this is a Node tool), so the reference is scoped to this one file — same
// pattern as capture.ts line 13.
/// <reference lib="dom" />

import { Window } from 'happy-dom'
import TurndownService from 'turndown'
// Ambient module shim for the untyped upstream GFM plugin lives at
// scripts/editorial/turndown-plugin-gfm.d.ts; it is picked up by the editorial
// tsconfig include glob and exposes `gfm`, `tables`, `taskListItems`, and
// `strikethrough` as TurndownService.Plugin functions.
import { gfm } from '@joplin/turndown-plugin-gfm'
import type { CapturedPage } from './capture.ts'

export interface ConvertedPage {
  readonly route: CapturedPage['route']
  readonly markdown: string
  readonly httpStatus: number
  readonly title: string
  readonly description: string
  readonly consoleErrors: readonly string[]
  readonly screenshotPath: string
  readonly cfCacheStatus?: string
}

/**
 * demoteHeadings — in-place DOM mutation that shifts every heading element
 * (h1..h6) down by 2 levels, clamped at h6.
 *
 * Mapping: h1→h3, h2→h4, h3→h5, h4→h6, h5→h6 (clamped), h6→h6 (skip).
 *
 * Implementation: since `tagName` is read-only on Element, rewriting requires
 * creating a new element of the target heading level, copying `innerHTML`
 * verbatim, then swapping via `replaceWith`. The querySelectorAll snapshot
 * captures matches at call time so mutation during iteration is safe.
 *
 * NOTE: this function is NOT idempotent under repeated invocation — calling
 * it twice shifts h1 to h5. sanitizeHtml calls it exactly once per input.
 *
 * CONV-04 (heading demotion).
 */
export function demoteHeadings(doc: Document): void {
  // .forEach is used over for-of because the editorial tsconfig lib is
  // ES2022-only; the file-scoped DOM reference brings in NodeListOf but
  // not DOM.Iterable, so for-of over a NodeList would fail type-check.
  // sanitizeHtml uses the same .forEach pattern for consistency.
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((oldEl) => {
    const currentLevel = Number(oldEl.tagName.charAt(1))
    const newLevel = Math.min(6, currentLevel + 2)
    if (newLevel === currentLevel) return
    const newEl = doc.createElement(`h${newLevel}`)
    // Copy attributes verbatim — sanitizeHtml's prior data-v-* walk has
    // already removed SFC attrs, so this preserves class/id/aria-label/
    // data-*/lang/dir/role/etc. per the 49-CONTEXT.md preserve contract.
    for (const attr of Array.from(oldEl.attributes)) {
      newEl.setAttribute(attr.name, attr.value)
    }
    newEl.innerHTML = oldEl.innerHTML
    oldEl.replaceWith(newEl)
  })
}

/**
 * sanitizeHtml — pure DOM-sanitization pipeline. Parse via happy-dom,
 * strip dangerous/noise subtrees, strip Vue SFC `data-v-*` attributes,
 * demote headings (h1→h3, clamp at h6), serialize body.innerHTML back.
 *
 * Sub-step order (locked in 49-CONTEXT.md):
 *   1. Parse rawHtml into a happy-dom Document via a fresh Window.
 *   2. Remove script / style / noscript / [aria-hidden="true"] subtrees.
 *   3. Walk every element; strip any attribute whose name starts with 'data-v-'.
 *   4. Call demoteHeadings(document) for in-place heading rewrite.
 *   5. Return document.body.innerHTML.
 *
 * Pure synchronous — no async iteration primitives, no wall-clock reads,
 * no randomness. Same input rawHtml always produces the same output string.
 *
 * Why happy-dom (not a transitive-only parser, not Turndown's internal parser):
 *   - happy-dom is a top-level devDep (package.json line 39), hoisted by pnpm.
 *   - Turndown's transitive DOM dep is not exposed for direct import under
 *     pnpm strict hoisting.
 *   - Turndown does not publicly expose its internal parser as a standalone API.
 *
 * CONV-02 (sanitization) + CONV-04 (heading demotion).
 */
export function sanitizeHtml(rawHtml: string): string {
  const window = new Window()
  const document = window.document
  document.documentElement.innerHTML = `<html><body>${rawHtml}</body></html>`
  // Step 2: strip subtrees.
  document.querySelectorAll('script, style, noscript, [aria-hidden="true"]').forEach((el) => el.remove())
  // Step 3: strip every data-v-* attribute on every element.
  // Array.from(el.attributes) snapshots the NamedNodeMap so removeAttribute
  // during iteration does not skip indices.
  document.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('data-v-')) {
        el.removeAttribute(attr.name)
      }
    }
  })
  // Step 4: heading demote (pre-Turndown — Turndown downstream will see the
  // already-demoted DOM once Plan 49-03 wires convertCapturedPage). happy-dom's
  // Document is structurally compatible with the standard-lib DOM Document; a
  // single cast at the call site lets demoteHeadings use the standard-lib type.
  demoteHeadings(document as unknown as Document)
  // Step 5: serialize body.innerHTML.
  return document.body.innerHTML
}

/**
 * configureTurndown — factory for a configured TurndownService. Returns a fresh
 * instance each call (callers own the lifecycle; GFM plugin registration is
 * idempotent per-instance). Custom rules register BEFORE .use(gfm) so the
 * GFM plugin's own rules don't shadow ours.
 *
 * Service config is locked per 49-CONTEXT.md (atx headings, `-` bullet marker,
 * fenced code blocks, `*` em, `**` strong, inlined links). linkReferenceStyle
 * is set to 'full' per the CONTEXT contract even though it is only consulted
 * when linkStyle === 'referenced'.
 *
 * CONV-01: Turndown 7.2.4 + @joplin/turndown-plugin-gfm full plugin.
 * CONV-03: images emit alt text only — no ![]() Markdown, no base64 data URLs.
 * CONV-05: `.badge`, `.badge-xxx`, `.pill`, `.chip`, `.tag`, `.tag-xxx`,
 *          `.severity-xxx`, and `.category-xxx` spans render as bold.
 * CONV-06: DOM-order preservation is Turndown's default — verified by Plan 49-04 tests.
 * CONV-07: hrefs preserved verbatim via linkStyle: 'inlined'.
 *
 * Default import of TurndownService works under NodeNext + esModuleInterop
 * because the upstream d.ts uses `export = TurndownService`; the ambient shim
 * for the GFM plugin provides a matching `TurndownService` default-type import.
 */
export function configureTurndown(): TurndownService {
  const service = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
    linkReferenceStyle: 'full',
  })

  // CONV-03: alt-text-only image rule. Override Turndown's default image
  // handler so `![]( )` Markdown and base64 data URLs never appear in output.
  // Empty / missing alt collapses the image to an empty string (skipped).
  service.addRule('image-alt-only', {
    filter: 'img',
    replacement: (_content, node) => {
      const alt = node.getAttribute('alt') ?? ''
      return alt.length === 0 ? '' : alt
    },
  })

  // CONV-05: pattern158 design-system badge/pill passthrough as **bold**.
  // Class allowlist matches Phase 5+/7+ design tokens: badge, badge-*, pill,
  // chip, tag, tag-*, severity-*, category-*. The `badge-\w+` alternation
  // catches compound variants like `badge-high` that appear standalone
  // (without a co-occurring `.badge` base class). Nested icon subtrees
  // flatten to text-only via Turndown's natural content recursion.
  //
  // ReDoS safety: the regex uses only bounded `\w+` quantifiers across a
  // small alternation. No nested quantifiers, linear-time NFA. Input length
  // is bounded by an element's `class` attribute (<500 chars in practice).
  service.addRule('pattern158-badges', {
    filter: (node) => {
      const tag = node.nodeName.toLowerCase()
      if (tag !== 'span' && tag !== 'a') return false
      const cls = node.getAttribute('class') ?? ''
      return /(^|\s)(badge|badge-\w+|pill|chip|tag|tag-\w+|severity-\w+|category-\w+)(\s|$)/.test(cls)
    },
    replacement: (content) => {
      const trimmed = content.trim()
      return trimmed.length === 0 ? '' : `**${trimmed}**`
    },
  })

  // CONV-01: GFM plugin AFTER custom rules — so tables/strikethrough/task-list
  // rules from the plugin don't shadow the image + badge rules above.
  service.use(gfm)

  return service
}

/**
 * collapseBlankLines — post-Turndown cleanup. Reduces any run of 3+ consecutive
 * newlines to exactly two (one blank line). Idempotent: applying twice yields
 * the same result as applying once. Runs exactly once at the end of
 * convertCapturedPage.
 *
 * Code-block exemption is NOT needed: Turndown emits fenced blocks with
 * triple-backticks (or tildes) and does not produce 3+ consecutive blank lines
 * inside fences — verified by Plan 49-04 unit tests.
 *
 * ReDoS safety: the regex `\n{3,}` is a single bounded quantifier with no
 * nested groups, no alternation, linear-time NFA. Input length bounded by the
 * converted markdown size per page.
 *
 * CONV-08.
 */
export function collapseBlankLines(markdown: string): string {
  return markdown.replace(/\n{3,}/g, '\n\n')
}

/**
 * convertCapturedPage — full per-page conversion pipeline.
 *
 * Steps:
 *   1. sanitizeHtml(page.mainHtml) — Plan 49-01 DOM cleanup + heading demote.
 *   2. configureTurndown() — Plan 49-02 factory, fresh TurndownService per
 *      page. Stateless — no cross-page rule-state leakage.
 *   3. service.turndown(sanitized) — HTML → raw markdown.
 *   4. collapseBlankLines(raw) — CONV-08 blank-line cleanup.
 *   5. Assemble ConvertedPage carrying all 8 fields from the input CapturedPage
 *      (plus the converted markdown) for Phase 50's writer.
 *
 * Empty mainHtml yields an empty markdown string — no throw (per
 * 49-CONTEXT.md line 110: "If mainHtml is empty string, output is empty
 * markdown. No ConvertError class").
 *
 * CONV-02 determinism self-test: same page in → byte-equal markdown out.
 * Plan 49-04 asserts this with the richest combined fixture.
 */
export function convertCapturedPage(page: CapturedPage): ConvertedPage {
  const sanitized = sanitizeHtml(page.mainHtml)
  const service = configureTurndown()
  const rawMarkdown = service.turndown(sanitized)
  const markdown = collapseBlankLines(rawMarkdown)
  return {
    route: page.route,
    markdown,
    httpStatus: page.httpStatus,
    title: page.title,
    description: page.description,
    consoleErrors: page.consoleErrors,
    screenshotPath: page.screenshotPath,
    cfCacheStatus: page.cfCacheStatus,
  }
}

/**
 * convertCapturedPages — sequential per-page conversion over the ordered
 * CapturedPage[]. Uses a plain for-of loop; the parallel-iteration helpers
 * SCAF-08 forbids on the ordered route list would preserve length but not
 * guarantee ordering without additional work, and the conversion pipeline is
 * CPU-bound pure computation where parallelism buys nothing anyway.
 *
 * Invariants:
 *   - output.length === pages.length (no filtering, no skipping)
 *   - output[i] corresponds to pages[i] (order preserved)
 *   - no retries on per-page errors — a thrown error from convertCapturedPage
 *     aborts the whole batch (per 49-CONTEXT.md "fail early" ethos)
 */
export function convertCapturedPages(
  pages: readonly CapturedPage[],
): readonly ConvertedPage[] {
  const out: ConvertedPage[] = []
  for (const page of pages) {
    out.push(convertCapturedPage(page))
  }
  return out
}
