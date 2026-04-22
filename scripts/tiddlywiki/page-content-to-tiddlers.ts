// scripts/tiddlywiki/page-content-to-tiddlers.ts
// Phase 55 Plan 02 — FIX-02 generator.
// Converts Phase 53 PageContent (via extract-all.ts's ExtractedPage) into a
// page tiddler with heading-anchored wikitext body. Replaces the default
// path that previously went through the iter-1 HTML wikitext converter.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type { ExtractedPage } from './extract-all.ts'
import type { Tiddler } from './tid-writer.ts'

const TIMESTAMP = '20260421000000000'

function bangsFor(level: number): string {
  if (level <= 1) return '!'
  if (level >= 6) return '!!!!!!'
  return '!'.repeat(level)
}

function renderBody(page: ExtractedPage): string {
  const segments = page.content.segments
  if (segments.length === 0) return ''
  const parts: string[] = []
  let skippedIntro = false
  for (const seg of segments) {
    // The first segment, when its heading equals the page title at level 1,
    // renders as intro text only (title lives in tiddler.title field).
    if (
      !skippedIntro
      && seg.heading.level === 1
      && seg.heading.text === page.content.title
    ) {
      if (seg.text.length > 0) parts.push(seg.text)
      skippedIntro = true
      continue
    }
    const bangs = bangsFor(seg.heading.level)
    if (seg.text.length === 0) {
      parts.push(`${bangs} ${seg.heading.text}`)
    } else {
      parts.push(`${bangs} ${seg.heading.text}\n\n${seg.text}`)
    }
  }
  return parts.join('\n\n') + '\n'
}

export function pageContentToTiddlers(
  pages: readonly ExtractedPage[],
): Tiddler[] {
  if (pages.length === 0) return []
  const out: Tiddler[] = []
  for (const page of pages) {
    out.push({
      title: page.pageTitle,
      type: 'text/vnd.tiddlywiki',
      tags: ['page'],
      fields: {
        created: TIMESTAMP,
        modified: TIMESTAMP,
        'source-html': page.sourceHtmlPath,
      },
      text: renderBody(page),
    })
  }
  return out
}
