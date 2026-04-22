// scripts/tiddlywiki/extractors/case-files-index.ts
// EXTR-08 — Case Files index page extractor.
// SCAF-08 forbidden in this file: wall-clock reads, timers, instantiated
// dates, parallel iteration helpers, randomness.

import {
  parseHtml,
  type CaseFilesIndex,
  type CaseFilesIndexEntry,
} from './types.ts'

const CARD_SELECTOR = '.exhibit-card.detail-exhibit'
const LABEL_SELECTOR = '.exhibit-label'
const CLIENT_SELECTOR = '.exhibit-client'
const DATE_SELECTOR = '.exhibit-date'
const TITLE_SELECTOR = '.exhibit-title'

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

function deriveExhibitType(
  card: Element,
): 'investigation-report' | 'engineering-brief' {
  if (card.classList.contains('type-investigation-report')) {
    return 'investigation-report'
  }
  return 'engineering-brief'
}

export function emitCaseFilesIndex(html: string): CaseFilesIndex {
  const doc = parseHtml(html)
  const cards = doc.querySelectorAll(CARD_SELECTOR)
  const entries: CaseFilesIndexEntry[] = []
  cards.forEach((card) => {
    entries.push({
      label: textOf(card.querySelector(LABEL_SELECTOR)),
      client: textOf(card.querySelector(CLIENT_SELECTOR)),
      date: textOf(card.querySelector(DATE_SELECTOR)),
      title: textOf(card.querySelector(TITLE_SELECTOR)),
      exhibitType: deriveExhibitType(card),
    })
  })
  return { entries }
}
