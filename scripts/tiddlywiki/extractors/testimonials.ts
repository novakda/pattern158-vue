// scripts/tiddlywiki/extractors/testimonials.ts
// EXTR-06 — testimonial extractor (testimonial-quote + exhibit-quote shapes).
// SCAF-08: no wall-clock reads, no parallel iteration helpers.

import { parseHtml, type Testimonial } from './types.ts'

const BLOCKQUOTE_SELECTOR = 'blockquote.testimonial-quote, blockquote.exhibit-quote'
const TESTIMONIAL_CLASS = 'testimonial-quote'

function textOf(el: Element | null): string {
  return (el?.textContent ?? '').trim()
}

function firstNonRoleSpan(footer: Element): Element | null {
  const spans = footer.querySelectorAll('span')
  for (const span of Array.from(spans)) {
    if (!span.classList.contains('role')) return span
  }
  return null
}

function extractTestimonialQuote(bq: Element): { text: string; attribution: string; role: string } {
  return {
    text: textOf(bq.querySelector('.quote-text')),
    attribution: textOf(bq.querySelector('cite')),
    role: textOf(bq.querySelector('.quote-context')),
  }
}

function extractExhibitQuote(bq: Element): { text: string; attribution: string; role: string } {
  const text = textOf(bq.querySelector(':scope > p'))
  const footer = bq.querySelector('footer.attribution')
  const attribution = footer === null ? '' : textOf(firstNonRoleSpan(footer))
  const role = textOf(bq.querySelector('footer.attribution span.role'))
  return { text, attribution, role }
}

export function emitTestimonials(
  html: string,
  opts?: { sourcePageLabel?: string },
): readonly Testimonial[] {
  const doc = parseHtml(html)
  const blockquotes = doc.querySelectorAll(BLOCKQUOTE_SELECTOR)
  const sourcePageLabel = opts?.sourcePageLabel ?? ''
  const out: Testimonial[] = []
  blockquotes.forEach((bq) => {
    const extracted = bq.classList.contains(TESTIMONIAL_CLASS)
      ? extractTestimonialQuote(bq)
      : extractExhibitQuote(bq)
    out.push({
      text: extracted.text,
      attribution: extracted.attribution,
      role: extracted.role,
      sourcePageLabel,
    })
  })
  return out
}
