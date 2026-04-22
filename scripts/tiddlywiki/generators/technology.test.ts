// scripts/tiddlywiki/generators/technology.test.ts
// Phase 54 Plan 04 — ATOM-03 tests.
// Hermetic: inline object-literal fixtures.
// SCAF-08: no wall-clock reads, no instantiated dates, no parallel iteration.

import type { TechnologyEntry } from './types.ts'
import { emitTechnologyTiddlers } from './technology.ts'

describe('emitTechnologyTiddlers — happy path', () => {
  it('produces one tiddler with Tech: prefix title, technology tag, aggregated body', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: 'Primary type system', sourceExhibitLabel: 'A' },
    ]
    const result = emitTechnologyTiddlers(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Tech: TypeScript')
    expect(result[0].tags).toEqual(['technology'])
    expect(result[0].text).toContain('!! [[Exhibit A]]')
    expect(result[0].text).toContain('Primary type system')
  })
})

describe('emitTechnologyTiddlers — multi-exhibit aggregation', () => {
  it('merges two exhibits using the same tech into one tiddler with both headings', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: 'CI only', sourceExhibitLabel: 'A' },
      { name: 'TypeScript', context: 'Service layer', sourceExhibitLabel: 'B' },
    ]
    const result = emitTechnologyTiddlers(entries)
    expect(result).toHaveLength(1)
    expect(result[0].text).toContain('!! [[Exhibit A]]')
    expect(result[0].text).toContain('!! [[Exhibit B]]')
    expect(result[0].text).toContain('CI only')
    expect(result[0].text).toContain('Service layer')
  })

  it('sorts exhibit headings alphabetically regardless of input order', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: 'ctx-C', sourceExhibitLabel: 'C' },
      { name: 'TypeScript', context: 'ctx-A', sourceExhibitLabel: 'A' },
    ]
    const text = emitTechnologyTiddlers(entries)[0].text
    expect(text.indexOf('!! [[Exhibit A]]')).toBeLessThan(text.indexOf('!! [[Exhibit C]]'))
  })
})

describe('emitTechnologyTiddlers — case-normalized merge', () => {
  it('merges TypeScript and typescript into one tiddler', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: 'a', sourceExhibitLabel: 'A' },
      { name: 'typescript', context: 'b', sourceExhibitLabel: 'B' },
    ]
    const result = emitTechnologyTiddlers(entries)
    expect(result).toHaveLength(1)
  })

  it('first-seen casing wins for title', () => {
    const firstThenLower = emitTechnologyTiddlers([
      { name: 'TypeScript', context: '', sourceExhibitLabel: 'A' },
      { name: 'typescript', context: '', sourceExhibitLabel: 'B' },
    ])
    expect(firstThenLower[0].title).toBe('Tech: TypeScript')

    const lowerThenFirst = emitTechnologyTiddlers([
      { name: 'typescript', context: '', sourceExhibitLabel: 'A' },
      { name: 'TypeScript', context: '', sourceExhibitLabel: 'B' },
    ])
    expect(lowerThenFirst[0].title).toBe('Tech: typescript')
  })
})

describe('emitTechnologyTiddlers — empty context blurb', () => {
  it('emits exhibit heading even when context is empty', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'Vue', context: '', sourceExhibitLabel: 'A' },
    ]
    const text = emitTechnologyTiddlers(entries)[0].text
    expect(text).toContain('!! [[Exhibit A]]')
  })
})

describe('emitTechnologyTiddlers — multi-tech', () => {
  it('produces distinct tiddlers for distinct names', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'Vue', context: '', sourceExhibitLabel: 'A' },
      { name: 'Pinia', context: '', sourceExhibitLabel: 'A' },
    ]
    const result = emitTechnologyTiddlers(entries)
    expect(result).toHaveLength(2)
  })
})

describe('emitTechnologyTiddlers — empty input', () => {
  it('returns empty array without throwing', () => {
    expect(emitTechnologyTiddlers([])).toEqual([])
  })
})

describe('emitTechnologyTiddlers — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const entries: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: 'x', sourceExhibitLabel: 'A' },
      { name: 'TypeScript', context: 'y', sourceExhibitLabel: 'B' },
    ]
    const first = JSON.stringify(emitTechnologyTiddlers(entries))
    const second = JSON.stringify(emitTechnologyTiddlers(entries))
    expect(second).toBe(first)
  })
})
