// scripts/tiddlywiki/extractors/personnel.ts
// EXTR-03 — personnel-table extractor.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Sequential for-of and NodeList .forEach only.

import {
  parseHtml,
  type PersonnelEntry,
  type PersonnelEntryType,
} from './types.ts'

const ROW_SELECTOR = 'table.personnel-table tbody tr'
const NAME_SELECTOR = '.personnel-name'
const TITLE_SELECTOR = '.personnel-title'
const ORG_CELL_SELECTOR = 'td[data-label="organization"]'
const ROLE_CELL_SELECTOR = 'td[data-label="role"]'

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

function deriveEntryType(row: Element): PersonnelEntryType {
  if (row.classList.contains('personnel-entry-anonymized')) return 'anonymized'
  if (row.classList.contains('personnel-entry-group')) return 'group'
  return 'individual'
}

export function emitPersonnel(
  html: string,
  opts?: { sourceExhibitLabel?: string },
): readonly PersonnelEntry[] {
  const doc = parseHtml(html)
  const rows = doc.querySelectorAll(ROW_SELECTOR)
  const sourceExhibitLabel = opts?.sourceExhibitLabel ?? ''
  const out: PersonnelEntry[] = []
  rows.forEach((row) => {
    out.push({
      name: textOf(row.querySelector(NAME_SELECTOR)),
      title: textOf(row.querySelector(TITLE_SELECTOR)),
      organization: textOf(row.querySelector(ORG_CELL_SELECTOR)),
      role: textOf(row.querySelector(ROLE_CELL_SELECTOR)),
      entryType: deriveEntryType(row),
      sourceExhibitLabel,
    })
  })
  return out
}
