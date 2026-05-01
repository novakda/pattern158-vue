// scripts/tiddlywiki/extractors/pages.ts
// EXTR-07 — non-exhibit page-content extractor.
// Parses the main-content region of static-site pages (Home, Philosophy,
// Technologies index, Contact, Accessibility) into a heading-anchored
// PageContent structure (title + flat heading list + per-heading segments).
// SCAF-08 forbidden in this file: wall-clock reads (timers, instantiated
// dates), parallel iteration helpers, randomness.

/// <reference lib="dom" />

import {
  parseHtml,
  type PageContent,
  type PageHeading,
  type PageSegment,
} from './types.ts'

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6'
const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6'])

// NodeFilter.SHOW_ELEMENT (1) | NodeFilter.SHOW_TEXT (4) — spec-stable
// numeric value. Used directly because happy-dom's NodeFilter surface has
// historically had gaps across versions; the numeric constants are part of
// the DOM spec and identical everywhere.
const SHOW_ELEMENT_AND_TEXT = 0x5

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

function levelFromTag(tagName: string): number {
  return Number(tagName.charAt(1))
}

function resolveMain(doc: Document): Element {
  const main = doc.querySelector('main#main-content')
  if (main !== null) return main
  return doc.body
}

function collectSegmentText(
  root: Element,
  headingEl: Element,
  nextHeadingEl: Element | null,
): string {
  // Walk the root in document order using a TreeWalker over elements + text
  // nodes. Start accumulating text after `headingEl` is visited; stop when
  // `nextHeadingEl` is reached (or when the walk ends). Text nodes that are
  // descendants of a heading element (including headingEl itself) are
  // excluded — each heading owns its own textContent via `headings[i]`, not
  // via its segment body.
  const doc = root.ownerDocument
  const walker = doc.createTreeWalker(root, SHOW_ELEMENT_AND_TEXT)
  const parts: string[] = []
  let started = false
  let node: Node | null = walker.firstChild()
  while (node !== null) {
    if (node === headingEl) {
      started = true
      node = walker.nextNode()
      continue
    }
    if (node === nextHeadingEl) break
    if (!started) {
      node = walker.nextNode()
      continue
    }
    if (node.nodeType === 1) {
      const el = node as Element
      if (HEADING_TAGS.has(el.tagName)) {
        // Defensive guard: any heading encountered inside our ownership
        // window that is not `nextHeadingEl` (checked above) should have
        // been the next heading — the caller loops with consecutive pairs.
        // Break so heading text never bleeds into the segment body.
        break
      }
      node = walker.nextNode()
      continue
    }
    // Text node — skip text that is a descendant of any heading element.
    const parent = node.parentNode
    if (parent !== null && isInsideHeading(parent)) {
      node = walker.nextNode()
      continue
    }
    const text = (node.nodeValue ?? '').trim()
    if (text.length > 0) parts.push(text)
    node = walker.nextNode()
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

function isInsideHeading(node: Node): boolean {
  let current: Node | null = node
  while (current !== null && current.nodeType === 1) {
    const el = current as Element
    if (HEADING_TAGS.has(el.tagName)) return true
    current = el.parentNode
  }
  return false
}

export function emitPageContent(html: string): PageContent {
  const doc = parseHtml(html)
  const main = resolveMain(doc)

  const headingEls = Array.from(main.querySelectorAll(HEADING_SELECTOR))
  const headings: PageHeading[] = headingEls.map((el) => ({
    level: levelFromTag(el.tagName),
    text: textOf(el),
  }))

  const firstH1 = headings.find((h) => h.level === 1)
  const title = firstH1?.text ?? ''

  const segments: PageSegment[] = []
  for (let i = 0; i < headingEls.length; i++) {
    const headingEl = headingEls[i]
    const nextHeadingEl = i + 1 < headingEls.length ? headingEls[i + 1] : null
    const segmentText = collectSegmentText(main, headingEl, nextHeadingEl)
    segments.push({
      heading: headings[i],
      text: segmentText,
    })
  }

  return { title, headings, segments }
}
