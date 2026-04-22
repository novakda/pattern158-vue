// scripts/tiddlywiki/generators/testimonial.test.ts
// Phase 54 Plan 05 — ATOM-04 tests.
// Hermetic inline object-literal fixtures.
// SCAF-08: no wall-clock reads, no instantiated dates, no parallel iteration.

import type { Testimonial } from './types.ts'
import { emitTestimonialTiddlers } from './testimonial.ts'

describe('emitTestimonialTiddlers — happy path', () => {
  it('produces tiddler with Testimonial: prefix title, locked tags, blockquote body', () => {
    const entries: readonly Testimonial[] = [
      {
        text: 'Dan delivered rapidly',
        attribution: 'Jane Doe',
        role: 'CTO',
        sourcePageLabel: 'Exhibit A',
      },
    ]
    const result = emitTestimonialTiddlers(entries)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Testimonial: Jane Doe')
    expect(result[0].tags).toEqual(['testimonial', '[[Exhibit A]]'])
    expect(result[0].text).toContain('<<<')
    expect(result[0].text).toContain('Dan delivered rapidly')
    expect(result[0].text).toContain("''— Jane Doe''")
    expect(result[0].text).toContain('CTO')
  })
})

describe('emitTestimonialTiddlers — long-attribution truncation', () => {
  it('truncates attribution portion of title to <= 40 chars at word boundary', () => {
    const longAttr = 'Aaaaaaaa Bbbbbbbb Cccccccc Dddddddd Eeeeeeee Ffffffff Gggggggg'
    const entries: readonly Testimonial[] = [
      { text: 't', attribution: longAttr, role: '', sourcePageLabel: 'Home' },
    ]
    const result = emitTestimonialTiddlers(entries)
    const prefix = 'Testimonial: '
    const attrPart = result[0].title.slice(prefix.length)
    expect(attrPart.length).toBeLessThanOrEqual(40)
    expect(attrPart.endsWith('…')).toBe(true)
  })
})

describe('emitTestimonialTiddlers — empty attribution fallback', () => {
  it('emits "(anonymous)" title portion when attribution is empty', () => {
    const entries: readonly Testimonial[] = [
      { text: 'quote', attribution: '', role: '', sourcePageLabel: 'Home' },
    ]
    const result = emitTestimonialTiddlers(entries)
    expect(result[0].title).toBe('Testimonial: (anonymous)')
  })
})

describe('emitTestimonialTiddlers — empty role', () => {
  it('omits trailing role fragment when role is empty', () => {
    const entries: readonly Testimonial[] = [
      { text: 't', attribution: 'Jane Doe', role: '', sourcePageLabel: 'Home' },
    ]
    const body = emitTestimonialTiddlers(entries)[0].text
    expect(body).toContain("''— Jane Doe''")
    expect(body).not.toContain("''— Jane Doe'' —")
  })
})

describe('emitTestimonialTiddlers — empty sourcePageLabel', () => {
  it('emits only the testimonial tag when source label is empty', () => {
    const entries: readonly Testimonial[] = [
      { text: 't', attribution: 'Jane', role: '', sourcePageLabel: '' },
    ]
    const result = emitTestimonialTiddlers(entries)
    expect(result[0].tags).toEqual(['testimonial'])
  })
})

describe('emitTestimonialTiddlers — page-scoped source', () => {
  it('wraps non-Exhibit source page labels in [[ ]] as second tag', () => {
    const entries: readonly Testimonial[] = [
      { text: 't', attribution: 'Jane', role: '', sourcePageLabel: 'Home' },
    ]
    const result = emitTestimonialTiddlers(entries)
    expect(result[0].tags).toContain('[[Home]]')
  })
})

describe('emitTestimonialTiddlers — multi-entry', () => {
  it('produces one tiddler per entry (no merging)', () => {
    const entries: readonly Testimonial[] = [
      { text: 't1', attribution: 'A', role: '', sourcePageLabel: 'Home' },
      { text: 't2', attribution: 'B', role: '', sourcePageLabel: 'Home' },
    ]
    expect(emitTestimonialTiddlers(entries)).toHaveLength(2)
  })
})

describe('emitTestimonialTiddlers — empty input', () => {
  it('returns empty array without throwing', () => {
    expect(emitTestimonialTiddlers([])).toEqual([])
  })
})

describe('emitTestimonialTiddlers — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const entries: readonly Testimonial[] = [
      { text: 't', attribution: 'Jane Doe', role: 'CTO', sourcePageLabel: 'Exhibit A' },
    ]
    const first = JSON.stringify(emitTestimonialTiddlers(entries))
    const second = JSON.stringify(emitTestimonialTiddlers(entries))
    expect(second).toBe(first)
  })
})
