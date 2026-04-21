// scripts/tiddlywiki/sources.ts
// Per-content-type tiddler generators.
// Input: project JSON data files + static-site HTML pages.
// Output: Tiddler[] arrays per source type.

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'

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

export function faqItemsToTiddlers(items: readonly FaqJsonItem[]): Tiddler[] {
  return items.map((item) => {
    const body =
      `${renderAnswerParagraphs(item.answer)}\n\n` +
      `---\n\n` +
      `!! See also\n\n` +
      `[[FAQ Index]]\n`
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

export function exhibitsToTiddlers(
  exhibits: readonly ExhibitJson[],
): Tiddler[] {
  return exhibits.map((ex) => {
    const title = `${ex.label} — ${ex.title}`
    const tags = [
      'exhibit',
      ex.exhibitType,
      ex.client,
    ]
    const sections: string[] = []

    if (ex.summary) {
      sections.push(`''Summary:'' ${ex.summary}`)
    }
    if (ex.role) {
      sections.push(`''Role:'' ${ex.role}`)
    }
    if (ex.date) {
      sections.push(`''Date:'' ${ex.date}`)
    }
    if (ex.emailCount !== undefined) {
      sections.push(`''Email count:'' ${ex.emailCount}`)
    }

    if (ex.contextText) {
      const heading = ex.contextHeading ?? 'Context'
      sections.push(`\n! ${heading}\n\n${ex.contextText}`)
    }

    if (ex.sections && ex.sections.length > 0) {
      for (const sec of ex.sections) {
        if (sec.heading) sections.push(`\n!! ${sec.heading}`)
        if (sec.text) sections.push(`\n${sec.text}`)
        if (sec.subsections) {
          for (const sub of sec.subsections) {
            if (sub.heading) sections.push(`\n!!! ${sub.heading}`)
            if (sub.text) sections.push(`\n${sub.text}`)
          }
        }
      }
    }

    if (ex.impactTags && ex.impactTags.length > 0) {
      sections.push(`\n! Impact Tags\n`)
      for (const tag of ex.impactTags) {
        sections.push(`* ${tag}`)
      }
    }

    if (ex.quotes && ex.quotes.length > 0) {
      sections.push(`\n! Testimonials\n`)
      for (const q of ex.quotes) {
        sections.push(`<<<\n${q.text}\n<<<`)
        const attrRole = q.role ? ` — ${q.role}` : ''
        sections.push(`''— ${q.attribution}''${attrRole}\n`)
      }
    }

    if (ex.personnel && ex.personnel.length > 0) {
      sections.push(
        `\n! Personnel\n\n{{!!personnel-count}} personnel entries — see the detail page for the full table. //(Iteration 2: split to atomic personnel tiddlers.)//\n`,
      )
    }
    if (ex.technologies && ex.technologies.length > 0) {
      sections.push(
        `\n! Technologies\n\n{{!!technologies-count}} technologies — see the detail page for the full list. //(Iteration 2: link to Technology tiddlers.)//\n`,
      )
    }
    if (ex.findings && ex.findings.length > 0) {
      sections.push(
        `\n! Findings\n\n{{!!findings-count}} findings captured. //(Iteration 2: split to atomic Finding tiddlers.)//\n`,
      )
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
    if (ex.personnel) fields['personnel-count'] = String(ex.personnel.length)
    if (ex.technologies) fields['technologies-count'] = String(ex.technologies.length)
    if (ex.findings) fields['findings-count'] = String(ex.findings.length)

    return {
      title,
      type: 'text/vnd.tiddlywiki',
      tags,
      fields,
      text: sections.join('\n'),
    }
  })
}

/**
 * Generate a "Case Files Index" tiddler listing every exhibit by type.
 */
export function caseFilesIndexTiddler(
  exhibits: readonly ExhibitJson[],
): Tiddler {
  const investigations: string[] = []
  const briefs: string[] = []
  for (const ex of exhibits) {
    const title = `${ex.label} — ${ex.title}`
    const line = `* [[${title}]] — //${ex.client}, ${ex.date}//`
    if (ex.exhibitType === 'investigation-report') investigations.push(line)
    else briefs.push(line)
  }
  const text =
    `All case files, organized by type. Each exhibit is its own tiddler — tagged with its exhibit type and client. Filter by tag to narrow.\n\n` +
    `! Investigation Reports\n\n` +
    investigations.join('\n') +
    `\n\n! Engineering Briefs\n\n` +
    briefs.join('\n') +
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
    const slug = ex.label.toLowerCase().replace(/\s+/g, '-')
    map[`/exhibits/${slug}`] = `${ex.label} — ${ex.title}`
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
      title: '$:/SiteSubtitle',
      type: 'text/vnd.tiddlywiki',
      tags: [],
      fields: { created: TIMESTAMP, modified: TIMESTAMP },
      text: 'Dan Novak — Portfolio & Case Files',
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
