// scripts/tiddlywiki/generators/person.ts
// Phase 54 Plan 02 — ATOM-01 atomic person-tiddler generator.
// Input: extracted PersonnelEntry[] + client label for tagging.
// Output: one Tiddler per unique person with aggregated exhibit back-references.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type { PersonnelEntry, Tiddler } from './types.ts'
import { formatExhibitTitle, wikiLink } from './helpers.ts'

export interface EmitPersonOpts {
  readonly client: string
}

interface PersonBucket {
  readonly representative: PersonnelEntry
  readonly exhibitLabels: Set<string>
}

function identityKey(entry: PersonnelEntry): string {
  if (entry.name.trim().length > 0) {
    return `${entry.name}|${entry.entryType}|${entry.organization}`
  }
  return `${entry.role}|${entry.organization}|anonymized`
}

function titleFor(entry: PersonnelEntry): string {
  if (entry.name.trim().length > 0) return entry.name
  return `${entry.role} @ ${entry.organization}`
}

function bodyFor(entry: PersonnelEntry, exhibitLabels: readonly string[]): string {
  const headerParts: string[] = []
  if (entry.role.length > 0) headerParts.push(entry.role)
  if (entry.organization.length > 0 && entry.name.trim().length > 0) {
    headerParts.push(entry.organization)
  }
  if (entry.title.length > 0) headerParts.push(entry.title)
  const header = headerParts.join(', ')
  const links: string[] = []
  for (const label of exhibitLabels) {
    links.push(`* ${wikiLink(formatExhibitTitle(label))}`)
  }
  const appearsIn = `! Appears in\n\n${links.join('\n')}`
  return header.length > 0 ? `${header}\n\n${appearsIn}\n` : `${appearsIn}\n`
}

export function emitPersonTiddlers(
  entries: readonly PersonnelEntry[],
  opts: EmitPersonOpts,
): Tiddler[] {
  if (entries.length === 0) return []
  const buckets = new Map<string, PersonBucket>()
  for (const entry of entries) {
    const key = identityKey(entry)
    const existing = buckets.get(key)
    if (existing) {
      existing.exhibitLabels.add(entry.sourceExhibitLabel)
    } else {
      const labels = new Set<string>()
      labels.add(entry.sourceExhibitLabel)
      buckets.set(key, { representative: entry, exhibitLabels: labels })
    }
  }
  const out: Tiddler[] = []
  const keys = Array.from(buckets.keys()).sort()
  for (const key of keys) {
    const bucket = buckets.get(key)!
    const sortedLabels = Array.from(bucket.exhibitLabels).sort()
    const rep = bucket.representative
    out.push({
      title: titleFor(rep),
      type: 'text/vnd.tiddlywiki',
      tags: [
        'person',
        `[[${opts.client}]]`,
        `entry-type-${rep.entryType}`,
      ],
      fields: {},
      text: bodyFor(rep, sortedLabels),
    })
  }
  return out
}
