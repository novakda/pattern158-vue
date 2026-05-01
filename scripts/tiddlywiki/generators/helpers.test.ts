// scripts/tiddlywiki/generators/helpers.test.ts
// Phase 54 Plan 01 — shared helpers test suite.
// Hermetic: inline string fixtures only; no fs I/O.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers.

import {
  truncateAtWordBoundary,
  formatExhibitTitle,
  wikiLink,
} from './helpers.ts'

describe('truncateAtWordBoundary — happy path', () => {
  it('truncates at last word boundary and appends ellipsis', () => {
    const result = truncateAtWordBoundary('The quick brown fox jumps over', 15)
    expect(result.length).toBeLessThanOrEqual(16)
    expect(result.endsWith('…')).toBe(true)
    expect(result).not.toContain(' fox')
  })
})

describe('truncateAtWordBoundary — short-circuit', () => {
  it('returns input unchanged when shorter than maxLen', () => {
    expect(truncateAtWordBoundary('short', 60)).toBe('short')
  })
  it('returns input unchanged when exactly equal to maxLen', () => {
    const exact = 'exactly-sixty-chars-long-string-abcdefghijklmnopqrstuvwxyz12'
    expect(exact.length).toBe(60)
    expect(truncateAtWordBoundary(exact, 60)).toBe(exact)
  })
})

describe('truncateAtWordBoundary — empty input', () => {
  it('returns empty string without throwing or appending ellipsis', () => {
    expect(truncateAtWordBoundary('', 60)).toBe('')
  })
})

describe('truncateAtWordBoundary — determinism', () => {
  it('produces byte-identical output across two sequential calls', () => {
    const input = 'Deterministic truncation must not drift between calls'
    const first = truncateAtWordBoundary(input, 20)
    const second = truncateAtWordBoundary(input, 20)
    expect(second).toBe(first)
  })
})

describe('formatExhibitTitle — happy path', () => {
  it('wraps a label with the Exhibit prefix', () => {
    expect(formatExhibitTitle('J')).toBe('Exhibit J')
  })
  it('trims whitespace around the label argument', () => {
    expect(formatExhibitTitle('  J  ')).toBe('Exhibit J')
  })
})

describe('wikiLink — happy path', () => {
  it('wraps a string in double-bracket wikitext syntax', () => {
    expect(wikiLink('Exhibit J')).toBe('[[Exhibit J]]')
  })
  it('passes colons and spaces through unchanged (tech-tiddler title pattern)', () => {
    expect(wikiLink('Tech: TypeScript')).toBe('[[Tech: TypeScript]]')
  })
})
