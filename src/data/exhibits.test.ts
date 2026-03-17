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
