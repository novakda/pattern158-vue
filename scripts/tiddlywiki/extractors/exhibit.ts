// scripts/tiddlywiki/extractors/exhibit.ts
// Phase 53 Plan 03 — EXTR-02 exhibit detail page extractor.
//
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic wall-clock APIs (no timers, no instantiated dates)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered section list (use sequential for-of)
//
// Extractor contract:
//   emitExhibit(html) → single Exhibit (not an array).
//   Pure function: no fs I/O, no network, no shared state. Deterministic.
//   Throws ExtractorError on structural failure (missing h1.exhibit-detail-title).

import {
  parseHtml,
  ExtractorError,
  type Exhibit,
  type ExhibitSection,
  type ExhibitSubsection,
} from './types.ts'

const LABEL_SELECTOR = '.exhibit-meta-header .exhibit-label'
const CLIENT_SELECTOR = '.exhibit-meta-header .exhibit-client'
const DATE_SELECTOR = '.exhibit-meta-header .exhibit-date'
const TITLE_SELECTOR = 'h1.exhibit-detail-title'
const BADGE_SELECTOR = '.exhibit-type-badge'
const SECTION_SELECTOR = '.exhibit-section'

// Sibling extractors (Plans 04/05/06) own Personnel/Technologies/Findings
// sections. Skip them in Exhibit.sections so the section list stays scoped
// to narrative prose (Background, Outcome, Sequence of Events, etc.).
const KNOWN_SIBLING_HEADINGS = new Set(['Personnel', 'Technologies', 'Findings'])

// First .exhibit-section whose h2 matches this set is treated as the context
// (contextHeading/contextText). Remaining sections become Exhibit.sections[].
const CONTEXT_HEADING_CANDIDATES = new Set(['Background', 'Context'])

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

function normalizeExhibitType(
  badgeText: string,
): 'investigation-report' | 'engineering-brief' {
  const normalized = badgeText.toLowerCase().replace(/\s+/g, '-').trim()
  if (normalized === 'investigation-report') return 'investigation-report'
  return 'engineering-brief'
}

function collectDirectParagraphs(section: Element): string {
  const paragraphs: string[] = []
  section.querySelectorAll(':scope > p').forEach((p) => {
    const t = textOf(p)
    if (t.length > 0) paragraphs.push(t)
  })
  return paragraphs.join('\n\n')
}

function collectSubsections(section: Element): readonly ExhibitSubsection[] {
  const subsections: ExhibitSubsection[] = []
  const children = Array.from(section.children)
  let current: { heading: string; texts: string[] } | null = null
  for (const child of children) {
    const tag = child.tagName.toLowerCase()
    if (tag === 'h3') {
      if (current !== null) {
        subsections.push({
          heading: current.heading,
          text: current.texts.join('\n\n'),
        })
      }
      current = { heading: textOf(child), texts: [] }
    } else if (current !== null && tag === 'p') {
      const t = textOf(child)
      if (t.length > 0) current.texts.push(t)
    }
  }
  if (current !== null) {
    subsections.push({
      heading: current.heading,
      text: current.texts.join('\n\n'),
    })
  }
  return subsections
}

export function emitExhibit(html: string): Exhibit {
  const doc = parseHtml(html)

  const titleEl = doc.querySelector(TITLE_SELECTOR)
  if (titleEl === null) {
    throw new ExtractorError(
      'Missing h1.exhibit-detail-title — not a valid exhibit detail page',
      { extractor: 'exhibit' },
    )
  }

  const label = textOf(doc.querySelector(LABEL_SELECTOR))
  const client = textOf(doc.querySelector(CLIENT_SELECTOR))
  const date = textOf(doc.querySelector(DATE_SELECTOR))
  const title = textOf(titleEl)
  const exhibitType = normalizeExhibitType(
    textOf(doc.querySelector(BADGE_SELECTOR)),
  )

  let contextHeading = ''
  let contextText = ''
  const sections: ExhibitSection[] = []

  doc.querySelectorAll(SECTION_SELECTOR).forEach((section) => {
    const h2 = section.querySelector(':scope > h2')
    const heading = textOf(h2)
    if (heading.length === 0) return
    if (KNOWN_SIBLING_HEADINGS.has(heading)) return
    if (contextHeading === '' && CONTEXT_HEADING_CANDIDATES.has(heading)) {
      contextHeading = heading
      contextText = collectDirectParagraphs(section)
      return
    }
    sections.push({
      heading,
      text: collectDirectParagraphs(section),
      subsections: collectSubsections(section),
    })
  })

  return {
    label,
    client,
    date,
    title,
    exhibitType,
    contextHeading,
    contextText,
    sections,
    impactTags: [],
    summary: '',
    role: '',
    emailCount: 0,
  }
}
