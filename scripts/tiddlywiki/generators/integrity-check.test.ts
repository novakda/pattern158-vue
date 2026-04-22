// scripts/tiddlywiki/generators/integrity-check.test.ts
// Phase 54 Plan 07 — ATOM-05 consumer-half tests.
// Hermetic: inline Tiddler object-literal fixtures.
// SCAF-08: no wall-clock reads, no instantiated dates, no parallel iteration.

import type { Tiddler } from './types.ts'
import { verifyCrossLinkIntegrity } from './integrity-check.ts'

function tiddler(title: string, text: string): Tiddler {
  return {
    title,
    type: 'text/vnd.tiddlywiki',
    tags: [],
    fields: {},
    text,
  }
}

describe('verifyCrossLinkIntegrity — clean fixture', () => {
  it('reports no orphans when every link resolves to a known tiddler', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', 'See also [[Exhibit A]] and [[Exhibit B]].'),
      tiddler('Exhibit A', 'Back to [[Home]].'),
      tiddler('Exhibit B', 'Back to [[Home]].'),
    ]
    expect(verifyCrossLinkIntegrity(tiddlers).orphans).toEqual([])
  })
})

describe('verifyCrossLinkIntegrity — deliberate orphan', () => {
  it('detects a link whose target is not in the tiddler set', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', 'See [[Ghost]].'),
    ]
    const result = verifyCrossLinkIntegrity(tiddlers)
    expect(result.orphans).toEqual([{ source: 'Home', link: 'Ghost' }])
  })
})

describe('verifyCrossLinkIntegrity — multi-orphan same source', () => {
  it('reports every orphan link from the same source', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', 'See [[Ghost]] and [[Phantom]].'),
    ]
    const result = verifyCrossLinkIntegrity(tiddlers)
    expect(result.orphans).toHaveLength(2)
    expect(result.orphans).toContainEqual({ source: 'Home', link: 'Ghost' })
    expect(result.orphans).toContainEqual({ source: 'Home', link: 'Phantom' })
  })
})

describe('verifyCrossLinkIntegrity — multi-orphan different sources', () => {
  it('reports the same missing target once per source that links to it', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('A', '[[Ghost]]'),
      tiddler('B', '[[Ghost]]'),
    ]
    const result = verifyCrossLinkIntegrity(tiddlers)
    expect(result.orphans).toHaveLength(2)
    expect(result.orphans).toContainEqual({ source: 'A', link: 'Ghost' })
    expect(result.orphans).toContainEqual({ source: 'B', link: 'Ghost' })
  })
})

describe('verifyCrossLinkIntegrity — unpiped link resolves', () => {
  it('treats [[Known]] as resolved when Known is a known title', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', '[[Exhibit A]]'),
      tiddler('Exhibit A', ''),
    ]
    expect(verifyCrossLinkIntegrity(tiddlers).orphans).toEqual([])
  })
})

describe('verifyCrossLinkIntegrity — pipe-form documented behavior', () => {
  it('uses regex group 1 (pre-pipe segment) as the resolution target', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', '[[Display Text|Target]]'),
      tiddler('Target', ''),
    ]
    const result = verifyCrossLinkIntegrity(tiddlers)
    // Per CONTEXT-locked regex, group 1 = 'Display Text'; 'Display Text' is not
    // a known tiddler, so it is flagged as an orphan. This documents the
    // locked regex behavior. Phase 54 generators emit no pipe-form links, so
    // production code never hits this path.
    expect(result.orphans).toEqual([{ source: 'Home', link: 'Display Text' }])
  })
})

describe('verifyCrossLinkIntegrity — empty input', () => {
  it('returns { orphans: [] } for an empty tiddler set', () => {
    expect(verifyCrossLinkIntegrity([]).orphans).toEqual([])
  })
})

describe('verifyCrossLinkIntegrity — deterministic ordering', () => {
  it('sorts orphans alphabetically by (source, link)', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Z-Source', '[[Ghost-A]] and [[Ghost-B]]'),
      tiddler('A-Source', '[[Ghost-C]]'),
    ]
    const { orphans } = verifyCrossLinkIntegrity(tiddlers)
    expect(orphans).toEqual([
      { source: 'A-Source', link: 'Ghost-C' },
      { source: 'Z-Source', link: 'Ghost-A' },
      { source: 'Z-Source', link: 'Ghost-B' },
    ])
  })
})

describe('verifyCrossLinkIntegrity — no links in body', () => {
  it('contributes zero orphans from tiddlers with no [[...]] tokens', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', 'Plain prose with no links at all.'),
    ]
    expect(verifyCrossLinkIntegrity(tiddlers).orphans).toEqual([])
  })
})

describe('verifyCrossLinkIntegrity — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', '[[Ghost]]'),
    ]
    const first = JSON.stringify(verifyCrossLinkIntegrity(tiddlers))
    const second = JSON.stringify(verifyCrossLinkIntegrity(tiddlers))
    expect(second).toBe(first)
  })
})

describe('verifyCrossLinkIntegrity — link embedded in prose', () => {
  it('extracts links embedded in surrounding prose', () => {
    const tiddlers: readonly Tiddler[] = [
      tiddler('Home', 'Here is a [[Known Tiddler]] reference inside prose.'),
      tiddler('Known Tiddler', ''),
    ]
    expect(verifyCrossLinkIntegrity(tiddlers).orphans).toEqual([])
  })
})
