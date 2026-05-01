// scripts/tiddlywiki/sources.test.ts
// Phase 55 Plan 03 — FIX-01 tests for the exhibit tiddler renderer.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Hermetic: inline object-literal fixtures only.

import { describe, expect, it } from 'vitest'

import {
  caseFilesIndexTiddler,
  exhibitsToTiddlers,
  faqItemsToTiddlers,
  type ExhibitJson,
  type FaqJsonItem,
} from './sources.ts'
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

// ---- 55.1-hotfix: exhibit tiddler title shape ----

describe('exhibitsToTiddlers — title is "Exhibit <label>" (no marketing suffix)', () => {
  it('emits title "Exhibit A" for label "A"', () => {
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT }]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].title).toBe('Exhibit A')
  })
  it('normalizes verbose JSON label "Exhibit A" to title "Exhibit A"', () => {
    const input: ExhibitJson[] = [
      { ...BASE_EXHIBIT, label: 'Exhibit A' },
    ]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].title).toBe('Exhibit A')
  })
})

describe('exhibitsToTiddlers — marketing title moves into body as top-level heading', () => {
  it('prepends the marketing title as "! <title>" at the start of the body', () => {
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT }]
    const tiddlers = exhibitsToTiddlers(input)
    expect(tiddlers[0].text).toContain('! Sample Investigation')
  })
})

describe('exhibitsToTiddlers — cross-link lookup tolerates verbose JSON labels', () => {
  it('matches bundle.exhibits[*] to ExhibitJson via normalized short label', () => {
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
      extractedExhibits: [BASE_EXTRACTED], // label: 'A'
      personnel,
      findings: [] as FindingEntry[],
      technologies: [] as TechnologyEntry[],
      testimonials: [] as Testimonial[],
    }
    // JSON label verbose — must still resolve to the extracted exhibit keyed
    // on short label, so the Personnel footer emits the [[Jane Doe]] link.
    const input: ExhibitJson[] = [{ ...BASE_EXHIBIT, label: 'Exhibit A' }]
    const tiddlers = exhibitsToTiddlers(input, ctx)
    expect(tiddlers[0].text).toContain('[[Jane Doe]]')
  })
})

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

// ---- FIX-03: faqItemsToTiddlers footer enrichment ----

describe('faqItemsToTiddlers — sibling FAQ detection', () => {
  it('links to another FAQ in the same category', () => {
    const items: FaqJsonItem[] = [
      { id: 'q1', question: 'Q one?', answer: 'A one.', categories: ['hiring'] },
      { id: 'q2', question: 'Q two?', answer: 'A two.', categories: ['hiring'] },
    ]
    const tiddlers = faqItemsToTiddlers(items)
    expect(tiddlers[0].text).toContain('! Related questions')
    expect(tiddlers[0].text).toContain('[[Q two?]]')
  })
})

describe('faqItemsToTiddlers — sibling dedupe + sort across multiple categories', () => {
  it('unions siblings across categories, dedupes, sorts alphabetically', () => {
    const items: FaqJsonItem[] = [
      { id: 'a', question: 'A Question?', answer: 'ans a', categories: ['hiring', 'expertise'] },
      { id: 'b', question: 'B Question?', answer: 'ans b', categories: ['hiring'] },
      { id: 'c', question: 'C Question?', answer: 'ans c', categories: ['expertise'] },
    ]
    const tiddlers = faqItemsToTiddlers(items)
    const bodyA = tiddlers[0].text
    expect(bodyA).toContain('[[B Question?]]')
    expect(bodyA).toContain('[[C Question?]]')
    const posB = bodyA.indexOf('[[B Question?]]')
    const posC = bodyA.indexOf('[[C Question?]]')
    expect(posB).toBeGreaterThan(-1)
    expect(posC).toBeGreaterThan(-1)
    expect(posB).toBeLessThan(posC)
  })
})

describe('faqItemsToTiddlers — no siblings', () => {
  it('omits the Related questions block but keeps FAQ Index backlink', () => {
    const items: FaqJsonItem[] = [
      { id: 'solo', question: 'Alone?', answer: 'solo.', categories: ['unique-cat'] },
    ]
    const tiddlers = faqItemsToTiddlers(items)
    expect(tiddlers[0].text).not.toContain('! Related questions')
    expect(tiddlers[0].text).toContain('[[FAQ Index]]')
  })
})

describe('faqItemsToTiddlers — exhibit callout when referenced in answer', () => {
  it('emits Referenced exhibits block for known labels', () => {
    const items: FaqJsonItem[] = [
      { id: 'q', question: 'About J?', answer: 'See Exhibit J for context.', categories: ['x'] },
    ]
    const tiddlers = faqItemsToTiddlers(items, { exhibitLabels: ['J'] })
    expect(tiddlers[0].text).toContain('! Referenced exhibits')
    expect(tiddlers[0].text).toContain('[[Exhibit J]]')
  })
})

describe('faqItemsToTiddlers — unknown exhibit label filtered out', () => {
  it('omits exhibits the project does not have', () => {
    const items: FaqJsonItem[] = [
      { id: 'q', question: 'About Z?', answer: 'See Exhibit Z.', categories: ['x'] },
    ]
    const tiddlers = faqItemsToTiddlers(items, { exhibitLabels: ['A', 'B'] })
    expect(tiddlers[0].text).not.toContain('[[Exhibit Z]]')
  })
})

describe('faqItemsToTiddlers — multiple exhibit refs dedupe + sort', () => {
  it('dedupes repeated refs and sorts labels alphabetically', () => {
    const items: FaqJsonItem[] = [
      {
        id: 'q',
        question: 'About A and C?',
        answer: 'See Exhibit A and Exhibit A and Exhibit C.',
        categories: ['x'],
      },
    ]
    const tiddlers = faqItemsToTiddlers(items, { exhibitLabels: ['A', 'B', 'C'] })
    const body = tiddlers[0].text
    const posA = body.indexOf('[[Exhibit A]]')
    const posC = body.indexOf('[[Exhibit C]]')
    expect(posA).toBeGreaterThan(-1)
    expect(posC).toBeGreaterThan(-1)
    expect(posA).toBeLessThan(posC)
    const count = (body.match(/\[\[Exhibit A\]\]/g) ?? []).length
    expect(count).toBe(1)
  })
})

describe('faqItemsToTiddlers — ctx undefined', () => {
  it('omits the exhibit block entirely when ctx is not provided', () => {
    const items: FaqJsonItem[] = [
      { id: 'q', question: 'About J?', answer: 'See Exhibit J.', categories: ['x'] },
    ]
    const tiddlers = faqItemsToTiddlers(items)
    expect(tiddlers[0].text).not.toContain('! Referenced exhibits')
  })
})

describe('faqItemsToTiddlers — FAQ Index backlink always present', () => {
  it('includes [[FAQ Index]] at the footer end', () => {
    const items: FaqJsonItem[] = [
      { id: 'q', question: 'Q?', answer: 'A.', categories: ['x'] },
    ]
    const tiddlers = faqItemsToTiddlers(items)
    expect(tiddlers[0].text).toMatch(/\[\[FAQ Index\]\]\s*$/)
  })
})

// ---- FIX-04: caseFilesIndexTiddler → sortable table ----

describe('caseFilesIndexTiddler — header row', () => {
  it('emits the canonical 5-column table header', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'A', client: 'Acme', date: '2024', title: 'Sample', exhibitType: 'investigation-report' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.text).toContain('|!Date |!Client |!Type |!Case |!Title |')
  })
})

describe('caseFilesIndexTiddler — data row shape', () => {
  it('emits a row with date, client, type-cell, [[Exhibit A]] link, and marketing title', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'A', client: 'Acme', date: '2024', title: 'Sample', exhibitType: 'investigation-report' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.text).toContain('|2024 |Acme |Investigation |[[Exhibit A]] |Sample |')
  })
})

describe('caseFilesIndexTiddler — type cell mapping', () => {
  it('maps investigation-report to "Investigation" and engineering-brief to "Brief"', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'A', client: 'Acme', date: '2024', title: 'Inv', exhibitType: 'investigation-report' },
      { label: 'B', client: 'Beta', date: '2025', title: 'Bri', exhibitType: 'engineering-brief' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.text).toContain('|2024 |Acme |Investigation |[[Exhibit A]] |Inv |')
    expect(t.text).toContain('|2025 |Beta |Brief |[[Exhibit B]] |Bri |')
  })
})

describe('caseFilesIndexTiddler — unknown type falls through', () => {
  it('passes an unknown exhibitType through verbatim', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'X', client: 'Xco', date: '2020', title: 'Misc', exhibitType: 'other' as unknown as ExhibitJson['exhibitType'] },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.text).toContain('|2020 |Xco |other |[[Exhibit X]] |Misc |')
  })
})

describe('caseFilesIndexTiddler — sort order by label', () => {
  it('sorts rows alphabetically by label regardless of input order', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'C', client: 'C', date: '2030', title: 'CC', exhibitType: 'engineering-brief' },
      { label: 'A', client: 'A', date: '2020', title: 'AA', exhibitType: 'investigation-report' },
      { label: 'B', client: 'B', date: '2025', title: 'BB', exhibitType: 'engineering-brief' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    const posA = t.text.indexOf('[[Exhibit A]]')
    const posB = t.text.indexOf('[[Exhibit B]]')
    const posC = t.text.indexOf('[[Exhibit C]]')
    expect(posA).toBeGreaterThan(-1)
    expect(posB).toBeGreaterThan(posA)
    expect(posC).toBeGreaterThan(posB)
  })
})

describe('caseFilesIndexTiddler — iter-1 bulleted format removed', () => {
  it('does not emit the iter-1 "! Investigation Reports" / "! Engineering Briefs" section headings or bullet list', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'A', client: 'Acme', date: '2024', title: 'Sample', exhibitType: 'investigation-report' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.text).not.toContain('! Investigation Reports')
    expect(t.text).not.toContain('! Engineering Briefs')
    expect(t.text).not.toContain('* [[A — Sample]]')
  })
})

describe('caseFilesIndexTiddler — caption', () => {
  it('starts with the locked caption sentence', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'A', client: 'Acme', date: '2024', title: 'S', exhibitType: 'investigation-report' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.text).toMatch(/^All case files in a sortable table\./)
  })
})

describe('caseFilesIndexTiddler — tiddler metadata preserved', () => {
  it('keeps title "Case Files Index" and tags [page, case-files]', () => {
    const exhibits: ExhibitJson[] = [
      { label: 'A', client: 'Acme', date: '2024', title: 'S', exhibitType: 'investigation-report' },
    ]
    const t = caseFilesIndexTiddler(exhibits)
    expect(t.title).toBe('Case Files Index')
    expect(t.tags).toContain('page')
    expect(t.tags).toContain('case-files')
  })
})
