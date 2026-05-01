// scripts/tiddlywiki/generators/exhibit-cross-links.test.ts
// Phase 54 Plan 06 — ATOM-05 producer-half tests.
// Hermetic: inline object-literal fixtures.
// SCAF-08: no wall-clock reads, no instantiated dates, no parallel iteration.

import type {
  Exhibit,
  PersonnelEntry,
  FindingEntry,
  TechnologyEntry,
  Testimonial,
} from './types.ts'
import { buildExhibitCrossLinks } from './exhibit-cross-links.ts'

function makeExhibit(label: string): Exhibit {
  return {
    label,
    client: 'Acme',
    date: '2026-01-01',
    title: 't',
    exhibitType: 'investigation-report',
    contextHeading: '',
    contextText: '',
    sections: [],
    impactTags: [],
    summary: '',
    role: '',
    emailCount: 0,
  }
}

describe('buildExhibitCrossLinks — happy path', () => {
  it('returns a bundle with all four link arrays populated for a single-entry exhibit', () => {
    const exhibit = makeExhibit('A')
    const personnel: readonly PersonnelEntry[] = [
      { name: 'Jane Doe', title: '', organization: 'Acme', role: '', entryType: 'individual', sourceExhibitLabel: 'A' },
    ]
    const findings: readonly FindingEntry[] = [
      { finding: 'CI broke', description: '', resolution: '', outcome: '', category: '', severity: '', sourceExhibitLabel: 'A' },
    ]
    const technologies: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: '', sourceExhibitLabel: 'A' },
    ]
    const testimonials: readonly Testimonial[] = [
      { text: 't', attribution: 'John Smith', role: '', sourcePageLabel: 'Exhibit A' },
    ]
    const result = buildExhibitCrossLinks(exhibit, { personnel, findings, technologies, testimonials })
    expect(result.personnelLinks).toEqual(['[[Jane Doe]]'])
    expect(result.findingsLinks).toEqual(['[[A Finding: CI broke]]'])
    expect(result.technologiesLinks).toEqual(['[[Tech: TypeScript]]'])
    expect(result.testimonialsLinks).toEqual(['[[Testimonial: John Smith]]'])
  })
})

describe('buildExhibitCrossLinks — per-exhibit filter', () => {
  it('excludes personnel entries belonging to other exhibits', () => {
    const exhibit = makeExhibit('A')
    const personnel: readonly PersonnelEntry[] = [
      { name: 'Jane (A)', title: '', organization: '', role: '', entryType: 'individual', sourceExhibitLabel: 'A' },
      { name: 'Bob (B)', title: '', organization: '', role: '', entryType: 'individual', sourceExhibitLabel: 'B' },
    ]
    const result = buildExhibitCrossLinks(exhibit, {
      personnel,
      findings: [],
      technologies: [],
      testimonials: [],
    })
    expect(result.personnelLinks).toEqual(['[[Jane (A)]]'])
  })
})

describe('buildExhibitCrossLinks — anonymized name fallback', () => {
  it('uses {role} @ {organization} title for empty-name anonymized entries', () => {
    const exhibit = makeExhibit('A')
    const personnel: readonly PersonnelEntry[] = [
      { name: '', title: '', organization: 'Acme', role: 'DevOps', entryType: 'anonymized', sourceExhibitLabel: 'A' },
    ]
    const result = buildExhibitCrossLinks(exhibit, {
      personnel,
      findings: [],
      technologies: [],
      testimonials: [],
    })
    expect(result.personnelLinks).toEqual(['[[DevOps @ Acme]]'])
  })
})

describe('buildExhibitCrossLinks — finding truncation', () => {
  it('truncates finding title to <= 60 chars at word boundary inside the link', () => {
    const exhibit = makeExhibit('A')
    const longFinding = 'Misconfigured CI pipeline silently dropped test failures for the entire release cycle across multiple teams'
    const findings: readonly FindingEntry[] = [
      { finding: longFinding, description: '', resolution: '', outcome: '', category: '', severity: '', sourceExhibitLabel: 'A' },
    ]
    const result = buildExhibitCrossLinks(exhibit, { personnel: [], findings, technologies: [], testimonials: [] })
    expect(result.findingsLinks).toHaveLength(1)
    const link = result.findingsLinks[0]
    expect(link.startsWith('[[A Finding: ')).toBe(true)
    expect(link.endsWith(']]')).toBe(true)
    const inner = link.slice(2, -2)
    const findingPart = inner.slice('A Finding: '.length)
    expect(findingPart.length).toBeLessThanOrEqual(60)
    expect(findingPart.endsWith('…')).toBe(true)
  })
})

describe('buildExhibitCrossLinks — technology case-merge', () => {
  it('merges case-variants of the same tech into one link with first-seen casing', () => {
    const exhibit = makeExhibit('A')
    const technologies: readonly TechnologyEntry[] = [
      { name: 'TypeScript', context: '', sourceExhibitLabel: 'A' },
      { name: 'typescript', context: '', sourceExhibitLabel: 'A' },
    ]
    const result = buildExhibitCrossLinks(exhibit, { personnel: [], findings: [], technologies, testimonials: [] })
    expect(result.technologiesLinks).toEqual(['[[Tech: TypeScript]]'])
  })
})

describe('buildExhibitCrossLinks — empty inputs', () => {
  it('returns all four arrays empty when no entities provided', () => {
    const exhibit = makeExhibit('A')
    const result = buildExhibitCrossLinks(exhibit, { personnel: [], findings: [], technologies: [], testimonials: [] })
    expect(result.personnelLinks).toEqual([])
    expect(result.findingsLinks).toEqual([])
    expect(result.technologiesLinks).toEqual([])
    expect(result.testimonialsLinks).toEqual([])
  })
})

describe('buildExhibitCrossLinks — testimonial source filter', () => {
  it('excludes page-scoped testimonials when building exhibit cross-links', () => {
    const exhibit = makeExhibit('A')
    const testimonials: readonly Testimonial[] = [
      { text: 't', attribution: 'Jane', role: '', sourcePageLabel: 'Home' },
      { text: 't', attribution: 'Bob', role: '', sourcePageLabel: 'Exhibit A' },
    ]
    const result = buildExhibitCrossLinks(exhibit, { personnel: [], findings: [], technologies: [], testimonials })
    expect(result.testimonialsLinks).toEqual(['[[Testimonial: Bob]]'])
  })
})

describe('buildExhibitCrossLinks — deterministic sort', () => {
  it('sorts personnel links alphabetically regardless of input order', () => {
    const exhibit = makeExhibit('A')
    const personnel: readonly PersonnelEntry[] = [
      { name: 'Zoe', title: '', organization: '', role: '', entryType: 'individual', sourceExhibitLabel: 'A' },
      { name: 'Alice', title: '', organization: '', role: '', entryType: 'individual', sourceExhibitLabel: 'A' },
    ]
    const result = buildExhibitCrossLinks(exhibit, { personnel, findings: [], technologies: [], testimonials: [] })
    expect(result.personnelLinks).toEqual(['[[Alice]]', '[[Zoe]]'])
  })
})

describe('buildExhibitCrossLinks — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const exhibit = makeExhibit('A')
    const personnel: readonly PersonnelEntry[] = [
      { name: 'Jane', title: '', organization: '', role: '', entryType: 'individual', sourceExhibitLabel: 'A' },
    ]
    const first = JSON.stringify(buildExhibitCrossLinks(exhibit, { personnel, findings: [], technologies: [], testimonials: [] }))
    const second = JSON.stringify(buildExhibitCrossLinks(exhibit, { personnel, findings: [], technologies: [], testimonials: [] }))
    expect(second).toBe(first)
  })
})

describe('buildExhibitCrossLinks — bundle shape', () => {
  it('returns exactly four named arrays', () => {
    const exhibit = makeExhibit('A')
    const result = buildExhibitCrossLinks(exhibit, { personnel: [], findings: [], technologies: [], testimonials: [] })
    const keys = Object.keys(result).sort()
    expect(keys).toEqual(['findingsLinks', 'personnelLinks', 'technologiesLinks', 'testimonialsLinks'])
  })
})
