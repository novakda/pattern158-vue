// scripts/tiddlywiki/sources.test.ts
// Phase 55 Plan 03 — FIX-01 tests for the exhibit tiddler renderer.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Hermetic: inline object-literal fixtures only.

import { describe, expect, it } from 'vitest'

import { exhibitsToTiddlers, type ExhibitJson } from './sources.ts'
import type {
  Exhibit,
  FindingEntry,
  PersonnelEntry,
  TechnologyEntry,
  Testimonial,
} from './extractors/types.ts'

const BASE_EXHIBIT: ExhibitJson = {
  label: 'A',
  client: 'Acme',
  date: '2024',
  title: 'Sample Investigation',
  exhibitType: 'investigation-report',
}

const BASE_EXTRACTED: Exhibit = {
  label: 'A',
  client: 'Acme',
  date: '2024',
  title: 'Sample Investigation',
  exhibitType: 'investigation-report',
  contextHeading: '',
  contextText: '',
  sections: [],
  impactTags: [],
  summary: '',
  role: '',
  emailCount: 0,
}

describe('exhibitsToTiddlers — orphan heading is dropped', () => {
  it('drops a section with empty text and no subsections', () => {
    const input: ExhibitJson[] = [
      { ...BASE_EXHIBIT, sections: [{ heading: 'Background', text: '', subsections: [] }] },
    ]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].text).not.toContain('!! Background')
  })
})

describe('exhibitsToTiddlers — subsection text emitted when parent is empty', () => {
  it('emits parent heading and non-empty subsection body', () => {
    const input: ExhibitJson[] = [
      {
        ...BASE_EXHIBIT,
        sections: [
          {
            heading: 'Personnel Context',
            text: '',
            subsections: [{ heading: 'Role', text: 'Lead consultant' }],
          },
        ],
      },
    ]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].text).toContain('!! Personnel Context')
    expect(tiddlers[0].text).toContain('!!! Role')
    expect(tiddlers[0].text).toContain('Lead consultant')
  })
})

describe('exhibitsToTiddlers — empty subsections are dropped', () => {
  it('does not emit an empty subsection heading', () => {
    const input: ExhibitJson[] = [
      {
        ...BASE_EXHIBIT,
        sections: [
          {
            heading: 'Outcome',
            text: 'Completed.',
            subsections: [{ heading: 'Empty', text: '' }],
          },
        ],
      },
    ]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].text).toContain('!! Outcome')
    expect(tiddlers[0].text).toContain('Completed.')
    expect(tiddlers[0].text).not.toContain('!!! Empty')
  })
})

describe('exhibitsToTiddlers — backward compat without ctx', () => {
  it('returns tiddlers without throwing and without a cross-link footer', () => {
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT }]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers).toHaveLength(1)
    expect(tiddlers[0].text).not.toContain('! Personnel\n')
    expect(tiddlers[0].text).not.toContain('! Findings\n')
  })
})

describe('exhibitsToTiddlers — cross-link footer present when ctx provided', () => {
  it('appends the Personnel section with a [[name]] link', () => {
    const personnel: PersonnelEntry[] = [
      {
        name: 'Jane Doe',
        title: 'Senior Engineer',
        organization: 'Acme',
        role: 'Lead',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
    ]
    const ctx = {
      extractedExhibits: [BASE_EXTRACTED],
      personnel,
      findings: [] as FindingEntry[],
      technologies: [] as TechnologyEntry[],
      testimonials: [] as Testimonial[],
    }
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT }]
    const tiddlers = exhibitsToTiddlers(input, ctx)
    expect(tiddlers[0].text).toContain('! Personnel')
    expect(tiddlers[0].text).toContain('[[Jane Doe]]')
  })
})

describe('exhibitsToTiddlers — empty cross-link arrays are omitted', () => {
  it('does not emit a Findings section when findings array is empty', () => {
    const ctx = {
      extractedExhibits: [BASE_EXTRACTED],
      personnel: [] as PersonnelEntry[],
      findings: [] as FindingEntry[],
      technologies: [] as TechnologyEntry[],
      testimonials: [] as Testimonial[],
    }
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT }]
    const tiddlers = exhibitsToTiddlers(input, ctx)
    expect(tiddlers[0].text).not.toContain('! Findings\n')
    expect(tiddlers[0].text).not.toContain('! Technologies\n')
  })
})

describe('exhibitsToTiddlers — iter-1 placeholder stubs removed', () => {
  it('body does not contain Iteration 2 placeholder markers', () => {
    const input: ExhibitJson[] = [
      {
        ...BASE_EXHIBIT,
        personnel: [{ name: 'stub' }],
        findings: [{ finding: 'stub' }],
        technologies: [{ name: 'stub' }],
      } as ExhibitJson,
    ]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].text).not.toContain('Iteration 2')
    expect(tiddlers[0].text).not.toContain('personnel-count')
  })
})

describe('exhibitsToTiddlers — horizontal rule before cross-link footer', () => {
  it('emits --- separator when at least one cross-link array is non-empty', () => {
    const personnel: PersonnelEntry[] = [
      {
        name: 'Jane Doe',
        title: '',
        organization: 'Acme',
        role: 'Lead',
        entryType: 'individual',
        sourceExhibitLabel: 'A',
      },
    ]
    const ctx = {
      extractedExhibits: [BASE_EXTRACTED],
      personnel,
      findings: [] as FindingEntry[],
      technologies: [] as TechnologyEntry[],
      testimonials: [] as Testimonial[],
    }
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT }]
    const tiddlers = exhibitsToTiddlers(input, ctx)
    expect(tiddlers[0].text).toMatch(/---\s*\n\s*! Personnel/)
  })
})
