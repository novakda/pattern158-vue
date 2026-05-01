// scripts/tiddlywiki/generators/finding.ts
// Phase 54 Plan 03 — ATOM-02 atomic finding-tiddler generator.
// One Tiddler per FindingEntry. No merging.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type { FindingEntry, Tiddler } from './types.ts'
import { truncateAtWordBoundary, formatExhibitTitle } from './helpers.ts'

const FINDING_TRUNCATE_CHARS = 60

function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function severityTag(severity: string): string {
  const slug = slugifyTerm(severity)
  return slug.length > 0 ? `severity-${slug}` : 'severity-unknown'
}

function categoryTag(category: string): string {
  const slug = slugifyTerm(category)
  return slug.length > 0 ? `category-${slug}` : 'category-uncategorized'
}

function bodyFor(entry: FindingEntry): string {
  const parts: string[] = []
  if (entry.finding.length > 0) {
    parts.push(`! Finding\n\n${entry.finding}`)
  }
  if (entry.description.length > 0) {
    parts.push(`! Description\n\n${entry.description}`)
  }
  if (entry.resolution.length > 0) {
    parts.push(`! Resolution\n\n${entry.resolution}`)
  }
  if (entry.outcome.length > 0) {
    parts.push(`! Outcome\n\n${entry.outcome}`)
  }
  return parts.join('\n\n') + '\n'
}

export function emitFindingTiddlers(
  entries: readonly FindingEntry[],
): Tiddler[] {
  if (entries.length === 0) return []
  const out: Tiddler[] = []
  for (const entry of entries) {
    const truncated = truncateAtWordBoundary(entry.finding, FINDING_TRUNCATE_CHARS)
    const title = `${entry.sourceExhibitLabel} Finding: ${truncated}`
    out.push({
      title,
      type: 'text/vnd.tiddlywiki',
      tags: [
        'finding',
        severityTag(entry.severity),
        categoryTag(entry.category),
        `[[${formatExhibitTitle(entry.sourceExhibitLabel)}]]`,
      ],
      fields: {},
      text: bodyFor(entry),
    })
  }
  return out
}
