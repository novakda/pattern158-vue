// scripts/tiddlywiki/generators/person.test.ts
// Phase 54 Plan 02 — ATOM-01 tests.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Hermetic: inline object-literal fixtures only.

import type { PersonnelEntry } from './types.ts'
import { emitPersonTiddlers } from './person.ts'

const CLIENT = 'Acme Corp'

describe('emitPersonTiddlers — individual happy path', () => {
  it('produces one tiddler with title=name, locked tags, body with exhibit back-ref', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'Jane Doe',
        title: 'Senior Engineer',
        organization: 'Acme Corp',
        role: 'Lead Developer',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Jane Doe')
    expect(result[0].tags).toEqual(['person', '[[Acme Corp]]', 'entry-type-individual'])
    expect(result[0].text).toContain('[[Exhibit A]]')
  })
})

describe('emitPersonTiddlers — anonymized with empty name', () => {
  it('falls back to "{role} @ {organization}" title when name is empty', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: '',
        title: '',
        organization: 'Acme Corp',
        role: 'DevOps',
        entryType: 'anonymized',
        sourceExhibitLabel: 'B',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('DevOps @ Acme Corp')
    expect(result[0].tags).toContain('entry-type-anonymized')
  })
})

describe('emitPersonTiddlers — anonymized with non-empty name', () => {
  it('uses name as title when name is present, regardless of entryType', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'Redacted-01',
        title: '',
        organization: 'Acme Corp',
        role: 'DevOps',
        entryType: 'anonymized',
        sourceExhibitLabel: 'B',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    expect(result[0].title).toBe('Redacted-01')
  })
})

describe('emitPersonTiddlers — group entryType', () => {
  it('applies entry-type-group tag', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'Ops Team',
        title: '',
        organization: 'Acme Corp',
        role: 'Operations',
        entryType: 'group',
        sourceExhibitLabel: 'C',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    expect(result[0].tags).toContain('entry-type-group')
  })
})

describe('emitPersonTiddlers — multi-exhibit merge', () => {
  it('collapses two entries for same person into one tiddler with both exhibits in body', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'Jane Doe',
        title: 'Senior Engineer',
        organization: 'Acme Corp',
        role: 'Lead Developer',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
      {
        name: 'Jane Doe',
        title: 'Senior Engineer',
        organization: 'Acme Corp',
        role: 'Lead Developer',
        entryType: 'individual',
        sourceExhibitLabel: 'B',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    expect(result).toHaveLength(1)
    expect(result[0].text).toContain('[[Exhibit A]]')
    expect(result[0].text).toContain('[[Exhibit B]]')
  })

  it('sorts exhibit back-references alphabetically regardless of input order', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'Jane Doe',
        title: '',
        organization: 'Acme Corp',
        role: '',
        entryType: 'individual',
        sourceExhibitLabel: 'C',
      },
      {
        name: 'Jane Doe',
        title: '',
        organization: 'Acme Corp',
        role: '',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    const posA = result[0].text.indexOf('[[Exhibit A]]')
    const posC = result[0].text.indexOf('[[Exhibit C]]')
    expect(posA).toBeGreaterThan(-1)
    expect(posC).toBeGreaterThan(-1)
    expect(posA).toBeLessThan(posC)
  })
})

describe('emitPersonTiddlers — empty input', () => {
  it('returns empty array without throwing', () => {
    expect(emitPersonTiddlers([], { client: CLIENT })).toEqual([])
  })
})

describe('emitPersonTiddlers — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two sequential calls', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'Jane Doe',
        title: 'Senior Engineer',
        organization: 'Acme Corp',
        role: 'Lead Developer',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
    ]
    const first = JSON.stringify(emitPersonTiddlers(entries, { client: CLIENT }))
    const second = JSON.stringify(emitPersonTiddlers(entries, { client: CLIENT }))
    expect(second).toBe(first)
  })
})

describe('emitPersonTiddlers — disambiguation by organization', () => {
  it('produces two distinct tiddlers for same-name people at different organizations', () => {
    const entries: readonly PersonnelEntry[] = [
      {
        name: 'John Smith',
        title: '',
        organization: 'Org-A',
        role: '',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
      {
        name: 'John Smith',
        title: '',
        organization: 'Org-B',
        role: '',
        entryType: 'individual',
        sourceExhibitLabel: 'B',
      },
    ]
    const result = emitPersonTiddlers(entries, { client: CLIENT })
    expect(result).toHaveLength(2)
  })
})
