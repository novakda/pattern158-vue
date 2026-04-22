// scripts/tiddlywiki/extractors/technologies.ts
// EXTR-05 — technologies-table extractor.
// SCAF-08 forbidden in this file: wall-clock reads, parallel-iteration helpers,
// randomness.

import { parseHtml, type TechnologyEntry } from './types.ts'

const ROW_SELECTOR = 'table.technologies-table tbody tr'
const CATEGORY_SELECTOR = 'td[data-label="Category"]'
// The Technologies & Tools cell header uses an HTML entity `&amp;` in the
// DOM but querySelector matches the parsed attribute value verbatim as an
// ampersand. Use the literal ampersand here.
const TOOLS_SELECTOR = 'td[data-label="Technologies & Tools"]'

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

export function emitTechnologies(
  html: string,
  opts?: { sourceExhibitLabel?: string },
): readonly TechnologyEntry[] {
  const doc = parseHtml(html)
  const rows = doc.querySelectorAll(ROW_SELECTOR)
  const sourceExhibitLabel = opts?.sourceExhibitLabel ?? ''
  const out: TechnologyEntry[] = []
  rows.forEach((row) => {
    const context = textOf(row.querySelector(CATEGORY_SELECTOR))
    const toolsText = textOf(row.querySelector(TOOLS_SELECTOR))
    if (toolsText.length === 0) return
    const tokens = toolsText.split(',')
    for (const token of tokens) {
      const name = token.trim()
      if (name.length === 0) continue
      out.push({ name, context, sourceExhibitLabel })
    }
  })
  return out
}
