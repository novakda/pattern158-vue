// scripts/tiddlywiki/generators/testimonial.ts
// Phase 54 Plan 05 — ATOM-04 atomic testimonial-tiddler generator.
// One Tiddler per Testimonial. No merging.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type { Testimonial, Tiddler } from './types.ts'
import { truncateAtWordBoundary } from './helpers.ts'

const ATTRIBUTION_TRUNCATE_CHARS = 40
const ANONYMOUS_FALLBACK = '(anonymous)'

function titleFor(attribution: string): string {
  if (attribution.trim().length === 0) {
    return `Testimonial: ${ANONYMOUS_FALLBACK}`
  }
  return `Testimonial: ${truncateAtWordBoundary(attribution, ATTRIBUTION_TRUNCATE_CHARS)}`
}

function tagsFor(sourcePageLabel: string): string[] {
  if (sourcePageLabel.trim().length === 0) return ['testimonial']
  return ['testimonial', `[[${sourcePageLabel}]]`]
}

function bodyFor(entry: Testimonial): string {
  const quote = `<<<\n${entry.text}\n<<<`
  const attribution = entry.attribution.length > 0 ? entry.attribution : ANONYMOUS_FALLBACK
  const rolePart = entry.role.length > 0 ? ` — ${entry.role}` : ''
  const attrLine = `''— ${attribution}''${rolePart}`
  return `${quote}\n\n${attrLine}\n`
}

export function emitTestimonialTiddlers(
  entries: readonly Testimonial[],
): Tiddler[] {
  if (entries.length === 0) return []
  const out: Tiddler[] = []
  for (const entry of entries) {
    out.push({
      title: titleFor(entry.attribution),
      type: 'text/vnd.tiddlywiki',
      tags: tagsFor(entry.sourcePageLabel),
      fields: {},
      text: bodyFor(entry),
    })
  }
  return out
}
