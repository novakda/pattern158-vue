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
