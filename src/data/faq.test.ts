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
})
