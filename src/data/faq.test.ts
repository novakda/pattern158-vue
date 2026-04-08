import { describe, it, expect } from 'vitest'
import { faqItems, faqCategories } from './faq'

describe('FAQ Schema Validation', () => {
  it('faqCategories has exactly 7 entries', () => {
    expect(faqCategories).toHaveLength(7)
  })

  it('faqCategories has the correct IDs', () => {
    const ids = faqCategories.map(c => c.id)
    expect(ids).toEqual([
      'hiring',
      'expertise',
      'approach',
      'architecture',
      'legacy',
      'collaboration',
      'ai-tooling',
    ])
  })

  it('has 24 FAQ items after content merge', () => {
    expect(faqItems).toHaveLength(24)
  })

  it('every faqItem has a unique id', () => {
    const ids = faqItems.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
    ids.forEach(id => expect(typeof id).toBe('string'))
    ids.forEach(id => expect(id.length).toBeGreaterThan(0))
  })

  it('every faqItem has a non-empty categories array', () => {
    faqItems.forEach(item => {
      expect(Array.isArray(item.categories)).toBe(true)
      expect(item.categories.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('every category in faqItems exists in faqCategories', () => {
    const validIds: Set<string> = new Set(faqCategories.map(c => c.id))
    faqItems.forEach(item => {
      item.categories.forEach(cat => {
        expect(validIds.has(cat)).toBe(true)
      })
    })
  })

  it('exhibitNote is optional and string when present', () => {
    faqItems.forEach(item => {
      if (item.exhibitNote !== undefined) {
        expect(typeof item.exhibitNote).toBe('string')
      }
    })
  })

  it('has exhibit cross-references with valid URLs', () => {
    const withExhibits = faqItems.filter(item => item.exhibitNote)
    expect(withExhibits.length).toBe(6)
    withExhibits.forEach(item => {
      expect(item.exhibitUrl).toBeDefined()
      expect(item.exhibitUrl).toMatch(/^\/exhibits\/exhibit-[a-z]$/)
    })
  })

  it('does not contain replaced item IDs', () => {
    const ids = faqItems.map(item => item.id)
    expect(ids).not.toContain('legacy-systems')
    expect(ids).not.toContain('ai-automation-experience')
    expect(ids).not.toContain('unclear-requirements-approach')
  })
})
