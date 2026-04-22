// scripts/tiddlywiki/sources.ts
// Per-content-type tiddler generators.
// Input: project JSON data files + static-site HTML pages.
// Output: Tiddler[] arrays per source type.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

import { normalizeExhibitLabel } from './extract-all.ts'
import type {
  Exhibit,
  FindingEntry,
  PersonnelEntry,
  TechnologyEntry,
  Testimonial,
} from './extractors/types.ts'
import {
  buildExhibitCrossLinks,
  type ExhibitEntities,
} from './generators/exhibit-cross-links.ts'
import { htmlToWikitext } from './html-to-wikitext.ts'
import type { Tiddler } from './tid-writer.ts'

const TIMESTAMP = '20260421000000000'

export interface ExhibitQuote {
  readonly text: string
  readonly attribution: string
  readonly role?: string
}

export interface ExhibitSection {
  readonly heading?: string
  readonly text?: string
  readonly subsections?: readonly { heading?: string; text?: string }[]
  readonly type?: string
}

export interface ExhibitJson {
  readonly label: string
  readonly client: string
  readonly date: string
  readonly title: string
  readonly exhibitType: 'investigation-report' | 'engineering-brief'
  readonly quotes?: readonly ExhibitQuote[]
  readonly contextHeading?: string
  readonly contextText?: string
  readonly sections?: readonly ExhibitSection[]
  readonly impactTags?: readonly string[]
  readonly summary?: string
  readonly emailCount?: number
  readonly role?: string
  readonly technologies?: readonly unknown[]
  readonly findings?: readonly unknown[]
  readonly personnel?: readonly unknown[]
}

export interface FaqJsonItem {
  readonly id: string
  readonly question: string
  readonly answer: string
  readonly categories: readonly string[]
}

// ---------------------------------------------------------------------------
// FAQ → tiddlers
// ---------------------------------------------------------------------------

export interface FaqFooterContext {
  readonly exhibitLabels: readonly string[]
}

const EXHIBIT_REF_REGEX = /\bExhibit\s+([A-Z])\b/g

export function faqItemsToTiddlers(
  items: readonly FaqJsonItem[],
  ctx?: FaqFooterContext,
): Tiddler[] {
  // Precompute: category → list of questions in that category
  const questionsByCategory = new Map<string, string[]>()
  for (const item of items) {
    for (const cat of item.categories) {
      const bucket = questionsByCategory.get(cat)
      if (bucket === undefined) questionsByCategory.set(cat, [item.question])
      else bucket.push(item.question)
    }
  }
  const knownExhibitLabels = ctx?.exhibitLabels ?? []
  const knownExhibitSet = new Set(knownExhibitLabels)

  return items.map((item) => {
    // Siblings
    const siblings = new Set<string>()
    for (const cat of item.categories) {
      const bucket = questionsByCategory.get(cat) ?? []
      for (const q of bucket) {
        if (q !== item.question) siblings.add(q)
      }
    }
    const sortedSiblings = Array.from(siblings).sort()

    // Exhibit refs
    const foundLabels = new Set<string>()
    if (knownExhibitSet.size > 0) {
      for (const match of item.answer.matchAll(EXHIBIT_REF_REGEX)) {
        const label = match[1]
        if (knownExhibitSet.has(label)) foundLabels.add(label)
      }
    }
    const sortedLabels = Array.from(foundLabels).sort()

    // Assemble footer
    const footerBlocks: string[] = []
    if (sortedSiblings.length > 0) {
      const lines = sortedSiblings.map((q) => `* [[${q}]]`).join('\n')
      footerBlocks.push(`! Related questions\n\n${lines}`)
    }
    if (sortedLabels.length > 0) {
      const lines = sortedLabels.map((l) => `* [[Exhibit ${l}]]`).join('\n')
      footerBlocks.push(`! Referenced exhibits\n\n${lines}`)
    }
    const footerBody = footerBlocks.length > 0
      ? `${footerBlocks.join('\n\n')}\n\n`
      : ''

    const body =
      `${renderAnswerParagraphs(item.answer)}\n\n` +
      `---\n\n` +
      `!! See also\n\n` +
      `${footerBody}[[FAQ Index]]\n`

    return {
      title: item.question,
      type: 'text/vnd.tiddlywiki',
      tags: ['faq', ...item.categories],
      fields: {
        created: TIMESTAMP,
        modified: TIMESTAMP,
        'faq-id': item.id,
      },
      text: body,
    }
  })
}

function renderAnswerParagraphs(answer: string): string {
  return answer
    .split(/\n{2,}/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join('\n\n')
}

/**
 * Generate a "FAQ Index" tiddler that lists every FAQ tiddler by category.
 */
export function faqIndexTiddler(items: readonly FaqJsonItem[]): Tiddler {
  const byCategory = new Map<string, FaqJsonItem[]>()
  for (const item of items) {
    for (const cat of item.categories) {
      if (!byCategory.has(cat)) byCategory.set(cat, [])
      byCategory.get(cat)!.push(item)
    }
  }
  const sections: string[] = []
  for (const cat of Array.from(byCategory.keys()).sort()) {
    sections.push(`! ${humanizeCategory(cat)}`)
    for (const item of byCategory.get(cat)!) {
      sections.push(`* [[${item.question}]]`)
    }
    sections.push('')
  }
  return {
    title: 'FAQ Index',
    type: 'text/vnd.tiddlywiki',
    tags: ['page', 'faq'],
    fields: {
      created: TIMESTAMP,
      modified: TIMESTAMP,
    },
    text:
      `Frequently asked questions, organized by category. Each question is its own tiddler — tagged with its category and the \`faq\` tag. Filter by category tag to narrow the view.\n\n` +
      sections.join('\n') +
      '\n',
  }
}

function humanizeCategory(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ---------------------------------------------------------------------------
// Exhibits → tiddlers
// ---------------------------------------------------------------------------

export interface ExhibitsToTiddlersContext {
  readonly extractedExhibits: readonly Exhibit[]
  readonly personnel: readonly PersonnelEntry[]
  readonly findings: readonly FindingEntry[]
  readonly technologies: readonly TechnologyEntry[]
  readonly testimonials: readonly Testimonial[]
}

export function exhibitsToTiddlers(
  exhibits: readonly ExhibitJson[],
  ctx?: ExhibitsToTiddlersContext,
): Tiddler[] {
  // Keyed on the normalized (short) label so the ExhibitJson-side lookup
  // below matches regardless of whether the JSON uses verbose ("Exhibit A")
  // or short ("A") labels. Phase 55.1-hotfix — prevents orphan double-prefix.
  const byLabel = new Map<string, Exhibit>()
  if (ctx !== undefined) {
    for (const ex of ctx.extractedExhibits) {
      byLabel.set(normalizeExhibitLabel(ex.label), ex)
    }
  }
  return exhibits.map((ex) => {
    // Exhibit tiddler title is the canonical short form "Exhibit <letter>" so
    // [[Exhibit A]] cross-links emitted by Phase 54 atomic generators resolve.
    // The marketing title moves into the body as a top-level heading — same
    // information, link-compatible title shape. Phase 55.1-hotfix.
    const shortLabel = normalizeExhibitLabel(ex.label)
    const title = `Exhibit ${shortLabel}`
    const tags = ['exhibit', ex.exhibitType, ex.client]
    const sections: string[] = []

    if (ex.title) sections.push(`! ${ex.title}`)
    if (ex.summary) sections.push(`''Summary:'' ${ex.summary}`)
    if (ex.role) sections.push(`''Role:'' ${ex.role}`)
    if (ex.date) sections.push(`''Date:'' ${ex.date}`)
    if (ex.emailCount !== undefined) sections.push(`''Email count:'' ${ex.emailCount}`)

    if (ex.contextText) {
      const heading = ex.contextHeading ?? 'Context'
      sections.push(`\n! ${heading}\n\n${ex.contextText}`)
    }

    if (ex.sections && ex.sections.length > 0) {
      for (const sec of ex.sections) {
        const parentText = sec.text ?? ''
        const nonEmptySubs = (sec.subsections ?? []).filter(
          (s) => (s.text ?? '').length > 0,
        )
        if (parentText.length === 0 && nonEmptySubs.length === 0) continue
        if (sec.heading) sections.push(`\n!! ${sec.heading}`)
        if (parentText.length > 0) sections.push(`\n${parentText}`)
        for (const sub of nonEmptySubs) {
          if (sub.heading) sections.push(`\n!!! ${sub.heading}`)
          sections.push(`\n${sub.text}`)
        }
      }
    }

    if (ex.impactTags && ex.impactTags.length > 0) {
      sections.push(`\n! Impact Tags\n`)
      for (const tag of ex.impactTags) sections.push(`* ${tag}`)
    }

    if (ex.quotes && ex.quotes.length > 0) {
      sections.push(`\n! Testimonials\n`)
      for (const q of ex.quotes) {
        sections.push(`<<<\n${q.text}\n<<<`)
        const attrRole = q.role ? ` — ${q.role}` : ''
        sections.push(`''— ${q.attribution}''${attrRole}\n`)
      }
    }

    // Cross-link footer via Phase 54 producer (buildExhibitCrossLinks).
    const extracted = byLabel.get(shortLabel)
    if (ctx !== undefined && extracted !== undefined) {
      const entities: ExhibitEntities = {
        personnel: ctx.personnel,
        findings: ctx.findings,
        technologies: ctx.technologies,
        testimonials: ctx.testimonials,
      }
      const links = buildExhibitCrossLinks(extracted, entities)
      const footerBlocks: string[] = []
      if (links.personnelLinks.length > 0) {
        const lines = links.personnelLinks.map((l) => `* ${l}`).join('\n')
        footerBlocks.push(`! Personnel\n\n${lines}`)
      }
      if (links.findingsLinks.length > 0) {
        const lines = links.findingsLinks.map((l) => `* ${l}`).join('\n')
        footerBlocks.push(`! Findings\n\n${lines}`)
      }
      if (links.technologiesLinks.length > 0) {
        const lines = links.technologiesLinks.map((l) => `* ${l}`).join('\n')
        footerBlocks.push(`! Technologies\n\n${lines}`)
      }
      if (links.testimonialsLinks.length > 0) {
        const lines = links.testimonialsLinks.map((l) => `* ${l}`).join('\n')
        footerBlocks.push(`! Testimonials\n\n${lines}`)
      }
      if (footerBlocks.length > 0) {
        sections.push(`\n---\n\n${footerBlocks.join('\n\n')}`)
      }
    }

    const fields: Record<string, string> = {
      created: TIMESTAMP,
      modified: TIMESTAMP,
      label: ex.label,
      client: ex.client,
      'exhibit-date': ex.date,
      'exhibit-type': ex.exhibitType,
    }
    if (ex.role) fields.role = ex.role
    if (ex.emailCount !== undefined) fields['email-count'] = String(ex.emailCount)

    return {
      title,
      type: 'text/vnd.tiddlywiki',
      tags,
      fields,
      text: sections.join('\n'),
    }
  })
}

function typeCellFor(exhibitType: string): string {
  if (exhibitType === 'investigation-report') return 'Investigation'
  if (exhibitType === 'engineering-brief') return 'Brief'
  return exhibitType
}

function compareByLabel(a: ExhibitJson, b: ExhibitJson): number {
  if (a.label < b.label) return -1
  if (a.label > b.label) return 1
  return 0
}

// Case Files Index tiddler — sortable table of every exhibit row (FIX-04).
// The Case column links to the short-form exhibit tiddler ("Exhibit A") and
// the Title column carries the marketing title as plain text so the table
// stays scannable without inventing per-marketing-title tiddlers. Unpiped
// [[...]] link form keeps the integrity-check regex (locked — Phase 54)
// happy. Phase 55.1-hotfix.
export function caseFilesIndexTiddler(
  exhibits: readonly ExhibitJson[],
): Tiddler {
  const sorted = exhibits.slice().sort(compareByLabel)
  const rows: string[] = []
  for (const ex of sorted) {
    const shortLabel = normalizeExhibitLabel(ex.label)
    const exhibitTitle = `Exhibit ${shortLabel}`
    const caseLink = `[[${exhibitTitle}]]`
    rows.push(`|${ex.date} |${ex.client} |${typeCellFor(ex.exhibitType)} |${caseLink} |${ex.title} |`)
  }
  const text =
    `All case files in a sortable table. Click a column header in TiddlyWiki to sort; filter by tag to narrow (tags: investigation-report, engineering-brief, {client}).\n\n` +
    `|!Date |!Client |!Type |!Case |!Title |\n` +
    rows.join('\n') +
    '\n'
  return {
    title: 'Case Files Index',
    type: 'text/vnd.tiddlywiki',
    tags: ['page', 'case-files'],
    fields: {
      created: TIMESTAMP,
      modified: TIMESTAMP,
    },
    text,
  }
}

// ---------------------------------------------------------------------------
// Pages from static-site HTML → tiddlers
// ---------------------------------------------------------------------------

/** Map of route path (as linked from other pages) → destination tiddler title */
export interface LinkMap {
  readonly [href: string]: string
}

export function defaultLinkMap(exhibits: readonly ExhibitJson[]): LinkMap {
  const map: Record<string, string> = {
    '/': 'Home',
    '/philosophy': 'Philosophy',
    '/technologies': 'Technologies',
    '/case-files': 'Case Files Index',
    '/faq': 'FAQ Index',
    '/contact': 'Contact',
    '/accessibility': 'Accessibility',
  }
  for (const ex of exhibits) {
    const shortLabel = normalizeExhibitLabel(ex.label)
    const slug = shortLabel.toLowerCase().replace(/\s+/g, '-')
    map[`/exhibits/${slug}`] = `Exhibit ${shortLabel}`
  }
  return map
}

export interface PageSpec {
  readonly title: string
  readonly sourceHtmlPath: string
  readonly tags: readonly string[]
}

export async function pageSpecsToTiddlers(
  projectRoot: string,
  pages: readonly PageSpec[],
  linkMap: LinkMap,
): Promise<Tiddler[]> {
  const tiddlers: Tiddler[] = []
  for (const p of pages) {
    const abs = nodePath.resolve(projectRoot, p.sourceHtmlPath)
    let html = ''
    try {
      html = await fsp.readFile(abs, { encoding: 'utf8' })
    } catch {
      continue
    }
    const main = extractMainInner(html)
    const wikitext = htmlToWikitext(main, linkMap)
    tiddlers.push({
      title: p.title,
      type: 'text/vnd.tiddlywiki',
      tags: p.tags,
      fields: {
        created: TIMESTAMP,
        modified: TIMESTAMP,
        'source-html': p.sourceHtmlPath,
      },
      text: wikitext,
    })
  }
  return tiddlers
}

function extractMainInner(fullHtml: string): string {
  const match = fullHtml.match(
    /<main[^>]*id="main-content"[^>]*>([\s\S]*?)<\/main>/i,
  )
  return match ? match[1] : fullHtml
}

// ---------------------------------------------------------------------------
// Site meta tiddlers
// ---------------------------------------------------------------------------

export function siteMetaTiddlers(): Tiddler[] {
  return [
    {
      title: '$:/SiteTitle',
      type: 'text/vnd.tiddlywiki',
      tags: [],
      fields: { created: TIMESTAMP, modified: TIMESTAMP },
      text: 'Pattern 158',
    },
    {
      // Phase 58 follow-up to Phase 57 SUMMARY flag: generator used to emit
      // "Dan Novak — Portfolio & Case Files" which overwrote the Phase 57
      // Pattern-158-branded override on every regenerate. Aligning the source
      // of truth here eliminates the override tiddler drift risk.
      title: '$:/SiteSubtitle',
      type: 'text/vnd.tiddlywiki',
      tags: [],
      fields: { created: TIMESTAMP, modified: TIMESTAMP },
      text: 'Evidence-Based Portfolio',
    },
    {
      title: '$:/DefaultTiddlers',
      type: 'text/vnd.tiddlywiki',
      tags: [],
      fields: { created: TIMESTAMP, modified: TIMESTAMP },
      text: 'Home',
    },
  ]
}
