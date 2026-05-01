// scripts/tiddlywiki/generators/technology.ts
// Phase 54 Plan 04 — ATOM-03 atomic technology-tiddler generator.
// Case-insensitive grouping; first-seen display casing wins for title.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type { TechnologyEntry, Tiddler } from './types.ts'
import { formatExhibitTitle, wikiLink } from './helpers.ts'

interface TechBucket {
  displayName: string
  // Map from sourceExhibitLabel -> context blurb (last-write-wins per exhibit).
  readonly contexts: Map<string, string>
}

export function emitTechnologyTiddlers(
  entries: readonly TechnologyEntry[],
): Tiddler[] {
  if (entries.length === 0) return []
  const buckets = new Map<string, TechBucket>()
  for (const entry of entries) {
    const key = entry.name.toLowerCase().trim()
    if (key.length === 0) continue
    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = { displayName: entry.name, contexts: new Map<string, string>() }
      buckets.set(key, bucket)
    }
    bucket.contexts.set(entry.sourceExhibitLabel, entry.context)
  }
  const out: Tiddler[] = []
  const keys = Array.from(buckets.keys()).sort()
  for (const key of keys) {
    const bucket = buckets.get(key)!
    const exhibitLabels = Array.from(bucket.contexts.keys()).sort()
    const sections: string[] = []
    for (const label of exhibitLabels) {
      const ctx = bucket.contexts.get(label) ?? ''
      const heading = `!! ${wikiLink(formatExhibitTitle(label))}`
      sections.push(ctx.length > 0 ? `${heading}\n\n${ctx}` : heading)
    }
    out.push({
      title: `Tech: ${bucket.displayName}`,
      type: 'text/vnd.tiddlywiki',
      tags: ['technology'],
      fields: {},
      text: sections.join('\n\n') + '\n',
    })
  }
  return out
}
