// scripts/tiddlywiki/extractors/faq.test.ts
// EXTR-01 tests. SCAF-08 forbidden tokens absent. Hermetic — inline fixtures only.

import { ExtractorError, type FaqItem } from './types.ts'
import { emitFaqItems, emitFaqItemsFromJson } from './faq.ts'

describe('emitFaqItems — happy path', () => {
  it('extracts two FAQ items with id/question/answer/categories', () => {
    const html = `
      <div class="faq-list">
        <details class="faq-accordion-item">
          <summary class="faq-accordion-heading">
            <span class="faq-accordion-question">Are you available for new projects?</span>
          </summary>
          <div class="faq-category-pills"><span class="faq-category-pill">hiring</span></div>
          <div class="faq-answer"><p>Yes.</p></div>
        </details>
        <details class="faq-accordion-item">
          <summary class="faq-accordion-heading">
            <span class="faq-accordion-question">What technologies do you specialize in?</span>
          </summary>
          <div class="faq-category-pills">
            <span class="faq-category-pill">expertise</span>
          </div>
          <div class="faq-answer"><p>TypeScript, Vue.</p></div>
        </details>
      </div>
    `
    const result = emitFaqItems(html)
    expect(result).toHaveLength(2)
    expect(result[0].question).toBe('Are you available for new projects?')
    expect(result[0].id).toBe('are-you-available-for-new-projects')
    expect(result[0].answer).toContain('Yes.')
    expect(result[0].categories).toEqual(['hiring'])
    expect(result[1].categories).toEqual(['expertise'])
  })
})

describe('emitFaqItems — multiple categories', () => {
  it('preserves source order of category pills', () => {
    const html = `
      <details class="faq-accordion-item">
        <summary class="faq-accordion-heading">
          <span class="faq-accordion-question">Q?</span>
        </summary>
        <div class="faq-category-pills">
          <span class="faq-category-pill">hiring</span>
          <span class="faq-category-pill">approach</span>
        </div>
        <div class="faq-answer"><p>A</p></div>
      </details>
    `
    const result = emitFaqItems(html)
    expect(result[0].categories).toEqual(['hiring', 'approach'])
  })
})

describe('emitFaqItems — missing-field edge', () => {
  it('emits empty-string answer when .faq-answer is absent', () => {
    const html = `
      <details class="faq-accordion-item">
        <summary class="faq-accordion-heading">
          <span class="faq-accordion-question">Q without answer?</span>
        </summary>
        <div class="faq-category-pills"><span class="faq-category-pill">hiring</span></div>
      </details>
    `
    const result = emitFaqItems(html)
    expect(result).toHaveLength(1)
    expect(result[0].answer).toBe('')
    expect(result[0].question).toBe('Q without answer?')
  })
})

describe('emitFaqItems — malformed-DOM guard', () => {
  it('throws ExtractorError when no .faq-accordion-item exists', () => {
    expect(() => emitFaqItems('<div>no faq here</div>')).toThrow(ExtractorError)
  })
})

describe('emitFaqItems — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const html = `
      <details class="faq-accordion-item">
        <summary class="faq-accordion-heading">
          <span class="faq-accordion-question">Q?</span>
        </summary>
        <div class="faq-category-pills"><span class="faq-category-pill">hiring</span></div>
        <div class="faq-answer"><p>A</p></div>
      </details>
    `
    const first = JSON.stringify(emitFaqItems(html))
    const second = JSON.stringify(emitFaqItems(html))
    expect(second).toBe(first)
  })
})

describe('emitFaqItems — exhibit-callout inside answer', () => {
  it('includes callout anchor text in answer content', () => {
    const html = `
      <details class="faq-accordion-item">
        <summary class="faq-accordion-heading">
          <span class="faq-accordion-question">Q?</span>
        </summary>
        <div class="faq-category-pills"><span class="faq-category-pill">approach</span></div>
        <div class="faq-answer">
          <p>Main text.</p>
          <div class="exhibit-callout"><a href="/exhibits/exhibit-j" class="exhibit-callout-link">Exhibit J: GM Course Completion Investigation</a></div>
        </div>
      </details>
    `
    const result = emitFaqItems(html)
    expect(result[0].answer).toContain('Main text.')
    expect(result[0].answer).toContain('Exhibit J')
  })
})

describe('emitFaqItemsFromJson — happy path', () => {
  it('parses a well-formed JSON array into FaqItem[]', () => {
    const rawJson = JSON.stringify([
      {
        id: 'available-new-projects',
        question: 'Are you available for new projects?',
        answer: 'Yes.',
        categories: ['hiring'],
      },
    ])
    const result: readonly FaqItem[] = emitFaqItemsFromJson(rawJson)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('available-new-projects')
    expect(result[0].question).toBe('Are you available for new projects?')
    expect(result[0].categories).toEqual(['hiring'])
  })
})

describe('emitFaqItemsFromJson — malformed JSON', () => {
  it('throws ExtractorError on invalid JSON', () => {
    expect(() => emitFaqItemsFromJson('not json at all')).toThrow(ExtractorError)
  })
})
