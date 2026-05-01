// scripts/tiddlywiki/extractors/findings.ts
// EXTR-04 — findings-table extractor.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Sequential NodeList .forEach only.

import { parseHtml, type FindingEntry } from './types.ts'

const ROW_SELECTOR = 'table.findings-table tbody tr'
const FINDING_CELL_SELECTOR = 'td[data-label="Finding"]'
const DESCRIPTION_CELL_SELECTOR = 'td[data-label="Description"]'
const DESCRIPTION_SPAN_SELECTOR = 'td[data-label="Description"] > span'
const RESOLUTION_SELECTOR = '.finding-resolution'
const CATEGORY_SELECTOR = '.finding-category'

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

export function emitFindings(
  html: string,
  opts?: { sourceExhibitLabel?: string },
): readonly FindingEntry[] {
  const doc = parseHtml(html)
  const rows = doc.querySelectorAll(ROW_SELECTOR)
  const sourceExhibitLabel = opts?.sourceExhibitLabel ?? ''
  const out: FindingEntry[] = []
  rows.forEach((row) => {
    const finding = textOf(row.querySelector(FINDING_CELL_SELECTOR))
    const descriptionCell = row.querySelector(DESCRIPTION_CELL_SELECTOR)
    const description = textOf(row.querySelector(DESCRIPTION_SPAN_SELECTOR))
    const resolution = textOf(
      descriptionCell === null
        ? null
        : descriptionCell.querySelector(RESOLUTION_SELECTOR),
    )
    const category = textOf(row.querySelector(CATEGORY_SELECTOR))
    out.push({
      finding,
      description,
      resolution,
      outcome: '',
      category,
      severity: '',
      sourceExhibitLabel,
    })
  })
  return out
}
