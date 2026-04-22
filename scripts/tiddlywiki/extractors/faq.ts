// scripts/tiddlywiki/extractors/faq.ts
// EXTR-01 — FAQ extractor with JSON fallback sibling.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Sequential for-of and NodeList .forEach only.

import { parseHtml, ExtractorError, type FaqItem } from './types.ts'

const FAQ_ITEM_SELECTOR = '.faq-accordion-item'
const QUESTION_SELECTOR = '.faq-accordion-question'
const CATEGORY_PILL_SELECTOR = '.faq-category-pill'
const ANSWER_SELECTOR = '.faq-answer'

function slugifyQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function emitFaqItems(html: string): readonly FaqItem[] {
  const doc = parseHtml(html)
  const items = doc.querySelectorAll(FAQ_ITEM_SELECTOR)
  if (items.length === 0) {
    throw new ExtractorError(
      'No .faq-accordion-item elements found in input HTML',
      { extractor: 'faq' },
    )
  }
  const out: FaqItem[] = []
  items.forEach((item) => {
    const questionEl = item.querySelector(QUESTION_SELECTOR)
    const question = (questionEl?.textContent ?? '').trim()
    const answerEl = item.querySelector(ANSWER_SELECTOR)
    const answer = (answerEl?.textContent ?? '').trim()
    const categories: string[] = []
    item.querySelectorAll(CATEGORY_PILL_SELECTOR).forEach((pill) => {
      const cat = (pill.textContent ?? '').trim()
      if (cat.length > 0) categories.push(cat)
    })
    out.push({
      id: slugifyQuestion(question),
      question,
      answer,
      categories,
    })
  })
  return out
}

export function emitFaqItemsFromJson(rawJson: string): readonly FaqItem[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawJson)
  } catch (err) {
    throw new ExtractorError('Failed to parse FAQ JSON fallback', {
      extractor: 'faq',
      cause: err,
    })
  }
  if (!Array.isArray(parsed)) {
    throw new ExtractorError(
      'FAQ JSON fallback root must be an array',
      { extractor: 'faq' },
    )
  }
  const out: FaqItem[] = []
  for (const raw of parsed) {
    if (raw === null || typeof raw !== 'object') continue
    const r = raw as Record<string, unknown>
    const id = typeof r.id === 'string' ? r.id : ''
    const question = typeof r.question === 'string' ? r.question : ''
    const answer = typeof r.answer === 'string' ? r.answer : ''
    const categories = Array.isArray(r.categories)
      ? r.categories.filter((c): c is string => typeof c === 'string')
      : []
    out.push({ id, question, answer, categories })
  }
  return out
}
