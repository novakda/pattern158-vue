// scripts/tiddlywiki/extract-all.ts
// Phase 55 Plan 01 — orchestrator for the 8 Phase 53 extractors.
// Reads the static-site/ HTML corpus + src/data/json/faq.json fallback,
// returns a typed ExtractedBundle consumed by Plans 55-02..06 wiring code.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Sequential for-of only.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

import { emitFaqItems, emitFaqItemsFromJson } from './extractors/faq.ts'
import { emitExhibit } from './extractors/exhibit.ts'
import { emitPersonnel } from './extractors/personnel.ts'
import { emitFindings } from './extractors/findings.ts'
import { emitTechnologies } from './extractors/technologies.ts'
import { emitTestimonials } from './extractors/testimonials.ts'
import { emitPageContent } from './extractors/pages.ts'
import { emitCaseFilesIndex } from './extractors/case-files-index.ts'
import type {
  CaseFilesIndex,
  Exhibit,
  FaqItem,
  FindingEntry,
  PageContent,
  PersonnelEntry,
  TechnologyEntry,
  Testimonial,
} from './extractors/types.ts'

export interface ExtractedPage {
  readonly pageTitle: string
  readonly sourceHtmlPath: string
  readonly content: PageContent
}

export interface ExtractedBundle {
  readonly faqItems: readonly FaqItem[]
  readonly exhibits: readonly Exhibit[]
  readonly personnelByExhibit: readonly PersonnelEntry[]
  readonly findingsByExhibit: readonly FindingEntry[]
  readonly technologiesByExhibit: readonly TechnologyEntry[]
  readonly testimonials: readonly Testimonial[]
  readonly pages: readonly ExtractedPage[]
  readonly caseFilesIndex: CaseFilesIndex
}

interface PageSpec {
  readonly pageTitle: string
  readonly relPath: string
}

const PAGE_SPECS: readonly PageSpec[] = [
  { pageTitle: 'Home', relPath: 'static-site/index.html' },
  { pageTitle: 'Philosophy', relPath: 'static-site/philosophy.html' },
  { pageTitle: 'Technologies', relPath: 'static-site/technologies.html' },
  { pageTitle: 'Contact', relPath: 'static-site/contact.html' },
  { pageTitle: 'Accessibility', relPath: 'static-site/accessibility.html' },
]

async function readText(projectRoot: string, relPath: string): Promise<string | null> {
  const abs = nodePath.join(projectRoot, relPath)
  try {
    return await fsp.readFile(abs, { encoding: 'utf8' })
  } catch {
    return null
  }
}

interface ExhibitJsonLite {
  readonly label: string
}

// Normalize an exhibit label to its static-site HTML filename. Accepts both
// short labels (e.g. "A") and verbose labels (e.g. "Exhibit A") — the live
// src/data/json/exhibits.json uses the verbose form while test fixtures use
// the short form. In both cases the target filename is
// static-site/exhibits/exhibit-<letter>.html (mirrors defaultLinkMap in
// sources.ts line 283).
function exhibitLabelToFilename(label: string): string {
  let slug = label.toLowerCase().replace(/\s+/g, '-')
  if (slug.startsWith('exhibit-')) slug = slug.slice('exhibit-'.length)
  return `static-site/exhibits/exhibit-${slug}.html`
}

async function loadFaqItems(projectRoot: string): Promise<readonly FaqItem[]> {
  const html = await readText(projectRoot, 'static-site/faq.html')
  if (html !== null) {
    try {
      return emitFaqItems(html)
    } catch {
      // fall through to JSON fallback
    }
  }
  const json = await readText(projectRoot, 'src/data/json/faq.json')
  if (json === null) return []
  try {
    return emitFaqItemsFromJson(json)
  } catch {
    return []
  }
}

async function loadExhibitsJson(projectRoot: string): Promise<readonly ExhibitJsonLite[]> {
  const raw = await readText(projectRoot, 'src/data/json/exhibits.json')
  if (raw === null) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (e): e is ExhibitJsonLite =>
      e !== null
      && typeof e === 'object'
      && typeof (e as { label?: unknown }).label === 'string',
  )
}

export async function extractAll(projectRoot: string): Promise<ExtractedBundle> {
  // FAQ — prefer HTML, fall back to JSON.
  const faqItems = await loadFaqItems(projectRoot)

  // Pages (5 static-site pages; missing files skipped).
  const pages: ExtractedPage[] = []
  for (const spec of PAGE_SPECS) {
    const html = await readText(projectRoot, spec.relPath)
    if (html === null) continue
    pages.push({
      pageTitle: spec.pageTitle,
      sourceHtmlPath: spec.relPath,
      content: emitPageContent(html),
    })
  }

  // Case Files Index.
  const caseFilesHtml = await readText(projectRoot, 'static-site/case-files.html')
  const caseFilesIndex: CaseFilesIndex = caseFilesHtml === null
    ? { entries: [] }
    : emitCaseFilesIndex(caseFilesHtml)

  // Exhibits + per-exhibit entities (personnel, findings, technologies, testimonials).
  const exhibitJsonList = await loadExhibitsJson(projectRoot)
  const exhibits: Exhibit[] = []
  const personnelByExhibit: PersonnelEntry[] = []
  const findingsByExhibit: FindingEntry[] = []
  const technologiesByExhibit: TechnologyEntry[] = []
  const testimonials: Testimonial[] = []

  for (const ex of exhibitJsonList) {
    const html = await readText(projectRoot, exhibitLabelToFilename(ex.label))
    if (html === null) continue
    let exhibit: Exhibit
    try {
      exhibit = emitExhibit(html)
    } catch {
      continue
    }
    exhibits.push(exhibit)
    const label = exhibit.label
    for (const p of emitPersonnel(html, { sourceExhibitLabel: label })) {
      personnelByExhibit.push(p)
    }
    for (const f of emitFindings(html, { sourceExhibitLabel: label })) {
      findingsByExhibit.push(f)
    }
    for (const t of emitTechnologies(html, { sourceExhibitLabel: label })) {
      technologiesByExhibit.push(t)
    }
    const sourcePageLabel = `Exhibit ${label}`
    for (const q of emitTestimonials(html, { sourcePageLabel })) {
      testimonials.push(q)
    }
  }

  // Homepage testimonials — separate sourcePageLabel so Plan 55-04 wiring can
  // tag them to the Home tiddler instead of an exhibit tiddler.
  const homeHtml = await readText(projectRoot, 'static-site/index.html')
  if (homeHtml !== null) {
    for (const q of emitTestimonials(homeHtml, { sourcePageLabel: 'Home' })) {
      testimonials.push(q)
    }
  }

  return {
    faqItems,
    exhibits,
    personnelByExhibit,
    findingsByExhibit,
    technologiesByExhibit,
    testimonials,
    pages,
    caseFilesIndex,
  }
}
