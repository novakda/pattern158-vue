import { describe, it, expect } from 'vitest'
import { exhibits } from '@/data/exhibits'

describe('exhibits data', () => {
  it('has exactly 16 entries', () => {
    expect(exhibits).toHaveLength(16)
  })

  it('every entry has a valid exhibitLink', () => {
    exhibits.forEach(e => {
      expect(e.exhibitLink).toMatch(/^\/exhibits\/.+$/)
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

  it('contains Exhibit P entry', () => {
    const exhibitP = exhibits.find(e => e.exhibitLink === '/exhibits/career-evidence-system')
    expect(exhibitP).toBeDefined()
  })

  it('Exhibit P has correct label and exhibitType', () => {
    const exhibitP = exhibits.find(e => e.exhibitLink === '/exhibits/career-evidence-system')
    expect(exhibitP?.label).toBe('Exhibit P')
    expect(exhibitP?.exhibitType).toBe('engineering-brief')
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

  it('exactly 11 are engineering-brief', () => {
    const count = exhibits.filter(e => e.exhibitType === 'engineering-brief').length
    expect(count).toBe(11)
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
  it('exactly 10 exhibits are flagships', () => {
    const count = exhibits.filter(e => e.isFlagship).length
    expect(count).toBe(10)
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
