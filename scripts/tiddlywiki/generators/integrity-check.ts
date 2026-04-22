// scripts/tiddlywiki/generators/integrity-check.ts
// Phase 54 Plan 07 — ATOM-05 consumer half.
// Walks tiddler bodies and reports [[target]] links whose target is not a
// tiddler title in the given set.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers, deterministic output.

import type { Tiddler } from './types.ts'

const LINK_REGEX = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g

export interface Orphan {
  readonly source: string
  readonly link: string
}

export interface IntegrityResult {
  readonly orphans: readonly Orphan[]
}

function extractLinkTargets(body: string): string[] {
  const targets: string[] = []
  for (const match of body.matchAll(LINK_REGEX)) {
    targets.push(match[1])
  }
  return targets
}

function compareOrphan(a: Orphan, b: Orphan): number {
  if (a.source !== b.source) return a.source < b.source ? -1 : 1
  if (a.link !== b.link) return a.link < b.link ? -1 : 1
  return 0
}

export function verifyCrossLinkIntegrity(
  tiddlers: readonly Tiddler[],
): IntegrityResult {
  if (tiddlers.length === 0) return { orphans: [] }
  const titles = new Set<string>()
  for (const t of tiddlers) titles.add(t.title)
  const orphans: Orphan[] = []
  for (const t of tiddlers) {
    const targets = extractLinkTargets(t.text)
    for (const target of targets) {
      if (!titles.has(target)) {
        orphans.push({ source: t.title, link: target })
      }
    }
  }
  orphans.sort(compareOrphan)
  return { orphans }
}
