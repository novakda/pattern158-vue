// scripts/tiddlywiki/generators/finding.test.ts
// Phase 54 Plan 03 — ATOM-02 tests.
// Hermetic: inline object-literal fixtures only.
// SCAF-08: no wall-clock reads, no instantiated dates, no parallel iteration
// helpers.

import type { FindingEntry } from './types.ts'
import { emitFindingTiddlers } from './finding.ts'

describe('emitFindingTiddlers — happy path', () => {
  it('produces tiddler with locked title + tags + body', () => {
    const entries: readonly FindingEntry[] = [
      {
        finding: 'Misconfigured CI pipeline',
        description: 'The CI pipeline dropped test failures silently.',
        resolution: 'Rewire the reporter stage.',
        outcome: 'Fixed — no silent drops since.',
        category: 'Infrastructure',
        severity: 'High',
        sourceExhibitLabel: 'A',
      },
    ]
    const result = emitFindingTiddlers(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('A Finding: Misconfigured CI pipeline')
    expect(result[0].tags).toContain('finding')
    expect(result[0].tags).toContain('severity-high')
    expect(result[0].tags).toContain('category-infrastructure')
    expect(result[0].tags).toContain('[[Exhibit A]]')
  })
})

describe('emitFindingTiddlers — long-finding truncation', () => {
  it('truncates finding portion of title to <= 60 chars at word boundary', () => {
    const longFinding = 'Misconfigured CI pipeline silently dropped test failures for the entire release cycle across multiple teams and projects over months'
    const entries: readonly FindingEntry[] = [
      {
        finding: longFinding,
        description: '',
        resolution: '',
        outcome: '',
        category: '',
        severity: '',
        sourceExhibitLabel: 'B',
      },
    ]
    const result = emitFindingTiddlers(entries)
    const prefix = 'B Finding: '
    const findingPart = result[0].title.slice(prefix.length)
    expect(findingPart.length).toBeLessThanOrEqual(60)
    expect(findingPart.endsWith('…')).toBe(true)
  })
})

describe('emitFindingTiddlers — missing severity', () => {
  it('emits severity-unknown tag when severity is empty', () => {
    const entries: readonly FindingEntry[] = [
      {
        finding: 'X',
        description: '',
        resolution: '',
        outcome: '',
        category: 'Ops',
        severity: '',
        sourceExhibitLabel: 'A',
      },
    ]
    const result = emitFindingTiddlers(entries)
    expect(result[0].tags).toContain('severity-unknown')
  })
})

describe('emitFindingTiddlers — missing category', () => {
  it('emits category-uncategorized tag when category is empty', () => {
    const entries: readonly FindingEntry[] = [
      {
        finding: 'X',
        description: '',
        resolution: '',
        outcome: '',
        category: '',
        severity: 'Low',
        sourceExhibitLabel: 'A',
      },
    ]
    const result = emitFindingTiddlers(entries)
    expect(result[0].tags).toContain('category-uncategorized')
  })
})

describe('emitFindingTiddlers — category slugification', () => {
  it('slugifies category names with spaces and ampersands', () => {
    const entries: readonly FindingEntry[] = [
      {
        finding: 'X',
        description: '',
        resolution: '',
        outcome: '',
        category: 'Operations & Security',
        severity: 'High',
        sourceExhibitLabel: 'A',
      },
    ]
    const result = emitFindingTiddlers(entries)
    expect(result[0].tags).toContain('category-operations-security')
  })
})

describe('emitFindingTiddlers — body composition', () => {
  it('includes all four section headings in order when all fields populated', () => {
    const entries: readonly FindingEntry[] = [
      {
        finding: 'F',
        description: 'D',
        resolution: 'R',
        outcome: 'O',
        category: 'ops',
        severity: 'low',
        sourceExhibitLabel: 'A',
      },
    ]
    const text = emitFindingTiddlers(entries)[0].text
    const posF = text.indexOf('! Finding')
    const posD = text.indexOf('! Description')
    const posR = text.indexOf('! Resolution')
    const posO = text.indexOf('! Outcome')
    expect(posF).toBeGreaterThan(-1)
    expect(posD).toBeGreaterThan(posF)
    expect(posR).toBeGreaterThan(posD)
    expect(posO).toBeGreaterThan(posR)
  })
})

describe('emitFindingTiddlers — empty sections collapse', () => {
  it('omits description/resolution headings when those fields are empty', () => {
    const entries: readonly FindingEntry[] = [
      {
        finding: 'F',
        description: '',
        resolution: '',
        outcome: 'O',
        category: 'ops',
        severity: 'low',
        sourceExhibitLabel: 'A',
      },
    ]
    const text = emitFindingTiddlers(entries)[0].text
    expect(text).toContain('! Finding')
    expect(text).toContain('! Outcome')
    expect(text).not.toContain('! Description')
    expect(text).not.toContain('! Resolution')
  })
})

describe('emitFindingTiddlers — multi-entry', () => {
  it('produces one tiddler per entry (no merging)', () => {
    const entries: readonly FindingEntry[] = [
      { finding: 'F1', description: '', resolution: '', outcome: '', category: 'ops', severity: 'low', sourceExhibitLabel: 'A' },
      { finding: 'F2', description: '', resolution: '', outcome: '', category: 'ops', severity: 'low', sourceExhibitLabel: 'A' },
    ]
    const result = emitFindingTiddlers(entries)
    expect(result).toHaveLength(2)
  })
})

describe('emitFindingTiddlers — empty input', () => {
  it('returns empty array without throwing', () => {
    expect(emitFindingTiddlers([])).toEqual([])
  })
})

describe('emitFindingTiddlers — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const entries: readonly FindingEntry[] = [
      { finding: 'F', description: 'D', resolution: 'R', outcome: 'O', category: 'ops', severity: 'low', sourceExhibitLabel: 'A' },
    ]
    const first = JSON.stringify(emitFindingTiddlers(entries))
    const second = JSON.stringify(emitFindingTiddlers(entries))
    expect(second).toBe(first)
  })
})
