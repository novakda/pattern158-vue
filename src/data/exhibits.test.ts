import { describe, it, expect } from 'vitest'
import { exhibits } from '@/data/exhibits'

describe('exhibits data', () => {
  it('has exactly 15 entries', () => {
    expect(exhibits).toHaveLength(15)
  })

  it('every entry has a valid exhibitLink', () => {
    exhibits.forEach(e => {
      expect(e.exhibitLink).toMatch(/^\/exhibits\/exhibit-[a-o]$/)
    })
  })

  it('contains Exhibit O entry', () => {
    const exhibitO = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-o')
    expect(exhibitO).toBeDefined()
  })

  it('Exhibit O has correct label', () => {
    const exhibitO = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-o')
    expect(exhibitO?.label).toBe('Exhibit O')
  })
})

describe('structural normalization (STRUCT-01, STRUCT-03)', () => {
  it('Exhibit M has contextHeading "Investigation Summary"', () => {
    const exhibitM = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-m')
    expect(exhibitM?.contextHeading).toBe('Investigation Summary')
  })

  it('Exhibit N has contextHeading "Investigation Summary"', () => {
    const exhibitN = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-n')
    expect(exhibitN?.contextHeading).toBe('Investigation Summary')
  })

  it('Exhibit A second quote has non-empty attribution', () => {
    const exhibitA = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')
    const secondQuote = exhibitA?.quotes?.[1]
    expect(secondQuote?.attribution).toBeTruthy()
  })
})

describe('DATA-01/DATA-02: exhibitType discriminant', () => {
  it('every exhibit has exhibitType', () => {
    exhibits.forEach(e => {
      expect(e.exhibitType).toBeDefined()
    })
  })

  it('exactly 5 are investigation-report', () => {
    const count = exhibits.filter(e => e.exhibitType === 'investigation-report').length
    expect(count).toBe(5)
  })

  it('exactly 10 are engineering-brief', () => {
    const count = exhibits.filter(e => e.exhibitType === 'engineering-brief').length
    expect(count).toBe(10)
  })

  it('no exhibit has isDetailExhibit property', () => {
    exhibits.forEach(e => {
      expect('isDetailExhibit' in e).toBe(false)
    })
  })

  it('no exhibit has investigationReport property', () => {
    exhibits.forEach(e => {
      expect('investigationReport' in e).toBe(false)
    })
  })
})

describe('DATA-03: flagship data merged', () => {
  it('exactly 9 exhibits are flagships', () => {
    const count = exhibits.filter(e => e.isFlagship).length
    expect(count).toBe(9)
  })

  it('every flagship has summary', () => {
    exhibits.filter(e => e.isFlagship).forEach(e => {
      expect(e.summary).toBeTruthy()
    })
  })

  it('every flagship has role', () => {
    exhibits.filter(e => e.isFlagship).forEach(e => {
      expect(e.role).toBeTruthy()
    })
  })
})

describe('Phase 17: Personnel Data Extraction', () => {

  // DATA-01: All 14 exhibits A-N have personnel arrays
  describe('DATA-01: personnel arrays exist', () => {
    const exhibitLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n']
    exhibitLetters.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} has personnel array with entries`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        expect(exhibit?.personnel).toBeDefined()
        expect(exhibit!.personnel!.length).toBeGreaterThan(0)
      })
    })
  })

  // DATA-02: Name/Title/Org exhibits map correctly
  describe('DATA-02: Name/Title/Organization mapping', () => {
    const ntoExhibits = ['b','c','d','f','g','h','i','k','m','n']
    ntoExhibits.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} personnel have title and organization`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        exhibit!.personnel!.forEach(p => {
          expect(p.title).toBeDefined()
          expect(p.organization).toBeDefined()
        })
      })
    })
  })

  // DATA-03: Name/Title/Role exhibits map correctly
  describe('DATA-03: Name/Title/Role mapping', () => {
    ;['e','j'].forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} personnel have title and role`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        exhibit!.personnel!.forEach(p => {
          expect(p.title).toBeDefined()
          expect(p.role).toBeDefined()
        })
      })
    })
  })

  // DATA-04: Exhibit L parsed correctly
  describe('DATA-04: Exhibit L Role/Involvement parsing', () => {
    it('Exhibit L has personnel with parsed names', () => {
      const exhibitL = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')
      const danEntry = exhibitL!.personnel!.find(p => p.isSelf)
      expect(danEntry?.name).toBe('Dan Novak')
      expect(danEntry?.title).toBe('Development Lead')
    })
    it('Exhibit L entries do not have raw em-dash strings as names', () => {
      const exhibitL = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')
      exhibitL!.personnel!.forEach(p => {
        if (p.name) {
          expect(p.name).not.toContain(' \u2014 ')
        }
      })
    })
  })

  // DATA-05: isSelf on Dan Novak entries
  describe('DATA-05: isSelf flag', () => {
    const exhibitLetters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n']
    exhibitLetters.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} has a Dan Novak entry with isSelf: true`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        const selfEntries = exhibit!.personnel!.filter(p => p.isSelf === true)
        expect(selfEntries.length).toBeGreaterThanOrEqual(1)
        selfEntries.forEach(entry => {
          expect(entry.name).toContain('Dan Novak')
        })
      })
    })
  })

  // DATA-06: Table sections remain intact
  describe('DATA-06: original table sections preserved', () => {
    const exhibitLetters = ['b','c','d','e','f','g','h','i','j','k','l','m','n']
    exhibitLetters.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} still has a table section with rows`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        const tableSection = exhibit!.sections!.find(
          s => s.type === 'table' && s.columns && (
            s.columns.includes('Name') || s.columns.includes('Role')
          ) && s.rows && s.rows.length > 0
        )
        expect(tableSection).toBeDefined()
      })
    })
  })

  // DATA-06 for Exhibit A: table section preserved
  describe('DATA-06: Exhibit A table section preserved', () => {
    it('Exhibit A still has a personnel table section with rows', () => {
      const exhibitA = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')
      const tableSection = exhibitA!.sections!.find(
        s => s.type === 'table' && s.columns?.includes('Name') && s.rows && s.rows.length > 0
      )
      expect(tableSection).toBeDefined()
    })
  })
})

describe('Phase 21: Findings Data Extraction', () => {

  // DATA-01: ExhibitFindingEntry fields (compile-time check + runtime shape)
  describe('DATA-01: findings entries have correct shape', () => {
    it('Exhibit A findings have finding, background, resolution fields', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')
      exhibit!.findings!.forEach(f => {
        expect(f.finding).toBeTruthy()
        expect(f.background).toBeTruthy()
        expect(f.resolution).toBeTruthy()
      })
    })
    it('Exhibit L findings have finding, severity, description fields', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')
      exhibit!.findings!.forEach(f => {
        expect(f.finding).toBeTruthy()
        expect(f.severity).toBeTruthy()
        expect(f.description).toBeTruthy()
      })
    })
  })

  // DATA-02: findings[] arrays exist on all 7 exhibits
  describe('DATA-02: findings arrays exist', () => {
    const findingsExhibits = ['a', 'e', 'j', 'l', 'm', 'n', 'o']
    findingsExhibits.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} has findings array with entries`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        expect(exhibit?.findings).toBeDefined()
        expect(exhibit!.findings!.length).toBeGreaterThan(0)
      })
    })
  })

  // DATA-03: findingsHeading on J and L only
  describe('DATA-03: findingsHeading field', () => {
    it('Exhibit J has findingsHeading', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-j')
      expect(exhibit?.findingsHeading).toBeTruthy()
    })
    it('Exhibit L has findingsHeading', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')
      expect(exhibit?.findingsHeading).toBeTruthy()
    })
    it('exhibits without custom headings do not have findingsHeading', () => {
      const noHeading = ['a', 'e', 'm', 'n', 'o']
      noHeading.forEach(letter => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        expect(exhibit?.findingsHeading).toBeUndefined()
      })
    })
  })

  // DATA-04: correct row counts (5 per exhibit = 35 total)
  describe('DATA-04: findings data counts', () => {
    const findingsExhibits = ['a', 'e', 'j', 'l', 'm', 'n', 'o']
    findingsExhibits.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} has 5 findings`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        expect(exhibit!.findings!.length).toBe(5)
      })
    })
    it('total findings across all exhibits is 35', () => {
      const total = exhibits.reduce((sum, e) => sum + (e.findings?.length || 0), 0)
      expect(total).toBe(35)
    })
  })

  // DATA-05: custom headings with em-dashes
  describe('DATA-05: custom headings preserved', () => {
    it('Exhibit J heading contains Swiss Cheese Model', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-j')
      expect(exhibit?.findingsHeading).toContain('Swiss Cheese Model')
    })
    it('Exhibit L heading contains Five Foundational Gaps', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')
      expect(exhibit?.findingsHeading).toContain('Five Foundational Gaps')
    })
    it('headings use em-dash not hyphen', () => {
      const j = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-j')
      const l = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')
      expect(j?.findingsHeading).toContain('\u2014')
      expect(l?.findingsHeading).toContain('\u2014')
    })
  })

  // DATA-06: old findings table sections removed
  describe('DATA-06: findings table sections removed', () => {
    const findingsExhibits = ['a', 'e', 'j', 'l', 'm', 'n', 'o']
    findingsExhibits.forEach(letter => {
      it(`Exhibit ${letter.toUpperCase()} has no findings table section`, () => {
        const exhibit = exhibits.find(e => e.exhibitLink === `/exhibits/exhibit-${letter}`)
        const findingsTableSection = exhibit!.sections?.find(
          s => s.type === 'table' && s.heading?.startsWith('Findings')
        )
        expect(findingsTableSection).toBeUndefined()
      })
    })
    it('Exhibit D still has text-type findings section (not migrated)', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-d')
      const textSection = exhibit!.sections?.find(
        s => s.type === 'text' && s.heading === 'Findings'
      )
      expect(textSection).toBeDefined()
    })
    it('Exhibit F still has text-type findings section (not migrated)', () => {
      const exhibit = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-f')
      const textSection = exhibit!.sections?.find(
        s => s.type === 'text' && s.heading === 'Findings'
      )
      expect(textSection).toBeDefined()
    })
  })
})
