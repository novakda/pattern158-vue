// scripts/tiddlywiki/extractors/testimonials.test.ts
// EXTR-06 tests. SCAF-08 clean.

import { emitTestimonials } from './testimonials.ts'

describe('emitTestimonials — testimonial-quote with cite + context', () => {
  it('extracts text, attribution, role', () => {
    const html = `
      <blockquote class="testimonial-quote">
        <p class="quote-text">Thank you so much for putting time into this.</p>
        <footer class="quote-attribution">
          <cite>Program Manager, Microsoft Account</cite>
          <p class="quote-context">GP Strategies — on a SCORM architecture analysis document</p>
        </footer>
      </blockquote>
    `
    const t = emitTestimonials(html, { sourcePageLabel: 'philosophy' })
    expect(t).toHaveLength(1)
    expect(t[0].text).toContain('Thank you so much')
    expect(t[0].attribution).toBe('Program Manager, Microsoft Account')
    expect(t[0].role).toContain('GP Strategies')
    expect(t[0].sourcePageLabel).toBe('philosophy')
  })
})

describe('emitTestimonials — testimonial-quote without footer', () => {
  it('attribution and role default to empty string', () => {
    const html = `
      <blockquote class="testimonial-quote">
        <p class="quote-text">A bare quote.</p>
      </blockquote>
    `
    const t = emitTestimonials(html, { sourcePageLabel: 'home' })
    expect(t[0].attribution).toBe('')
    expect(t[0].role).toBe('')
  })
})

describe('emitTestimonials — exhibit-quote with footer.attribution', () => {
  it('extracts attribution from first span', () => {
    const html = `
      <blockquote class="exhibit-quote">
        <p>I'd consider the last couple days a success.</p>
        <footer class="attribution">
          <span>Chief of Learning Services</span>
        </footer>
      </blockquote>
    `
    const t = emitTestimonials(html, { sourcePageLabel: 'exhibit-a' })
    expect(t[0].text).toContain('last couple days a success')
    expect(t[0].attribution).toBe('Chief of Learning Services')
  })
})

describe('emitTestimonials — exhibit-quote with role span', () => {
  it('extracts role from span.role', () => {
    const html = `
      <blockquote class="exhibit-quote">
        <p>Thanks for the work.</p>
        <footer class="attribution">
          <span>Director of Learning Technologies</span>
          <span class="role">in summary email to leadership</span>
        </footer>
      </blockquote>
    `
    const t = emitTestimonials(html, { sourcePageLabel: 'exhibit-a' })
    expect(t[0].role).toBe('in summary email to leadership')
    expect(t[0].attribution).toBe('Director of Learning Technologies')
  })
})

describe('emitTestimonials — multiple blockquotes across shapes', () => {
  it('extracts all three quotes from the page', () => {
    const html = `
      <blockquote class="testimonial-quote">
        <p class="quote-text">Quote 1.</p>
      </blockquote>
      <blockquote class="testimonial-quote">
        <p class="quote-text">Quote 2.</p>
      </blockquote>
      <blockquote class="exhibit-quote">
        <p>Quote 3.</p>
        <footer class="attribution"><span>Someone</span></footer>
      </blockquote>
    `
    const t = emitTestimonials(html, { sourcePageLabel: 'mixed' })
    expect(t).toHaveLength(3)
    expect(t[2].attribution).toBe('Someone')
  })
})

describe('emitTestimonials — sourcePageLabel default', () => {
  it('defaults to empty when opts omitted', () => {
    const html = `<blockquote class="testimonial-quote"><p class="quote-text">X</p></blockquote>`
    const t = emitTestimonials(html)
    expect(t[0].sourcePageLabel).toBe('')
  })
})

describe('emitTestimonials — no blockquotes', () => {
  it('returns empty array', () => {
    expect(emitTestimonials('<div>no quotes</div>', { sourcePageLabel: 'X' })).toEqual([])
  })
})

describe('emitTestimonials — idempotency', () => {
  it('byte-identical JSON across two calls', () => {
    const html = `<blockquote class="testimonial-quote"><p class="quote-text">X</p></blockquote>`
    const a = JSON.stringify(emitTestimonials(html, { sourcePageLabel: 'X' }))
    const b = JSON.stringify(emitTestimonials(html, { sourcePageLabel: 'X' }))
    expect(b).toBe(a)
  })
})
