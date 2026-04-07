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

describe('PERS-01/PERS-02: personnel migration', () => {
  it('exactly 13 exhibits have personnel arrays', () => {
    const count = exhibits.filter(e => e.personnel && e.personnel.length > 0).length
    expect(count).toBe(13)
  })

  it('no exhibit has a personnel table section', () => {
    exhibits.forEach(e => {
      const personnelSections = (e.sections || []).filter(
        s => s.type === 'table' && s.heading === 'Personnel'
      )
      expect(personnelSections).toHaveLength(0)
    })
  })

  it('Exhibit B personnel has typed name field (Name/Title/Organization variant)', () => {
    const exhibitB = exhibits.find(e => e.label === 'Exhibit B')
    expect(exhibitB?.personnel?.[0].name).toBe('Dan Novak')
    expect(exhibitB?.personnel?.[0].organization).toBe('GP Strategies')
  })

  it('Exhibit L personnel has involvement field (Role/Involvement variant)', () => {
    const exhibitL = exhibits.find(e => e.label === 'Exhibit L')
    expect(exhibitL?.personnel?.[0].role).toBeTruthy()
    expect(exhibitL?.personnel?.[0].involvement).toBeTruthy()
  })

  it('Exhibit E personnel has role field (Name/Title/Role variant)', () => {
    const exhibitE = exhibits.find(e => e.label === 'Exhibit E')
    expect(exhibitE?.personnel?.[0].name).toBe('Dan Novak')
    expect(exhibitE?.personnel?.[0].role).toBeTruthy()
  })
})

describe('TECH-01/TECH-02: technologies migration', () => {
  it('exactly 11 exhibits have technologies arrays', () => {
    const count = exhibits.filter(e => e.technologies && e.technologies.length > 0).length
    expect(count).toBe(11)
  })

  it('no exhibit has a technologies table section with heading "Technologies"', () => {
    exhibits.forEach(e => {
      const techSections = (e.sections || []).filter(
        s => s.type === 'table' && s.heading === 'Technologies'
      )
      expect(techSections).toHaveLength(0)
    })
  })

  it('Exhibit A technologies has typed category field', () => {
    const exhibitA = exhibits.find(e => e.label === 'Exhibit A')
    expect(exhibitA?.technologies?.[0].category).toBe('eLearning Protocols')
    expect(exhibitA?.technologies?.[0].tools).toContain('SCORM')
  })

  it('Exhibit O retains generic Technologies Across Three Projects table', () => {
    const exhibitO = exhibits.find(e => e.label === 'Exhibit O')
    const techSection = (exhibitO?.sections || []).find(
      s => s.type === 'table' && s.heading === 'Technologies Across Three Projects'
    )
    expect(techSection).toBeDefined()
    expect(exhibitO?.technologies).toBeUndefined()
  })
})

describe('FIND-01/FIND-02: findings migration', () => {
  it('exactly 7 exhibits have findings arrays', () => {
    const count = exhibits.filter(e => e.findings && e.findings.length > 0).length
    expect(count).toBe(7)
  })

  it('no exhibit has a findings table section', () => {
    exhibits.forEach(e => {
      const findingsSections = (e.sections || []).filter(
        s => s.type === 'table' && s.heading && s.heading.startsWith('Findings')
      )
      expect(findingsSections).toHaveLength(0)
    })
  })

  it('Exhibit A findings has background/resolution variant', () => {
    const exhibitA = exhibits.find(e => e.label === 'Exhibit A')
    expect(exhibitA?.findings?.[0].finding).toBeTruthy()
    expect(exhibitA?.findings?.[0].background).toBeTruthy()
    expect(exhibitA?.findings?.[0].resolution).toBeTruthy()
  })

  it('Exhibit L findings has severity variant', () => {
    const exhibitL = exhibits.find(e => e.label === 'Exhibit L')
    expect(exhibitL?.findings?.[0].finding).toBeTruthy()
    expect(exhibitL?.findings?.[0].severity).toBeTruthy()
    expect(exhibitL?.findings?.[0].description).toBeTruthy()
  })

  it('Exhibit E findings has description variant', () => {
    const exhibitE = exhibits.find(e => e.label === 'Exhibit E')
    expect(exhibitE?.findings?.[0].finding).toBeTruthy()
    expect(exhibitE?.findings?.[0].description).toBeTruthy()
    expect(exhibitE?.findings?.[0].background).toBeUndefined()
  })

  it('exactly 2 exhibits have custom findingsHeading', () => {
    const count = exhibits.filter(e => e.findingsHeading).length
    expect(count).toBe(2)
  })

  it('Exhibit J has custom findings heading', () => {
    const exhibitJ = exhibits.find(e => e.label === 'Exhibit J')
    expect(exhibitJ?.findingsHeading).toContain('Swiss Cheese Model')
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
