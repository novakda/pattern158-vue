// scripts/tiddlywiki/page-content-to-tiddlers.test.ts
// Phase 55 Plan 02 — FIX-02 wiring tests.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Hermetic: inline object-literal fixtures only.

import { describe, expect, it } from 'vitest'

import { pageContentToTiddlers } from './page-content-to-tiddlers.ts'
import type { ExtractedPage } from './extract-all.ts'

const HOME_PAGE: ExtractedPage = {
  pageTitle: 'Home',
  sourceHtmlPath: 'static-site/index.html',
  content: {
    title: 'Home',
    headings: [
      { level: 1, text: 'Home' },
      { level: 2, text: 'Philosophy' },
    ],
    segments: [
      { heading: { level: 1, text: 'Home' }, text: 'Welcome to Pattern 158.' },
      { heading: { level: 2, text: 'Philosophy' }, text: 'Calm, clear, careful.' },
    ],
  },
}

describe('pageContentToTiddlers — empty', () => {
  it('returns empty array for empty input', () => {
    expect(pageContentToTiddlers([])).toEqual([])
  })
})

describe('pageContentToTiddlers — happy path', () => {
  it('emits one tiddler per input page with locked tags and heading-anchored body', () => {
    const result = pageContentToTiddlers([HOME_PAGE])
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Home')
    expect(result[0].tags).toEqual(['page'])
    expect(result[0].text).toContain('Welcome to Pattern 158.')
    expect(result[0].text).toContain('!! Philosophy')
    expect(result[0].text).toContain('Calm, clear, careful.')
  })
})

describe('pageContentToTiddlers — heading-level-to-bang mapping', () => {
  it('maps level 2 to double-bang, 3 to triple-bang, 4 to quad-bang', () => {
    const page: ExtractedPage = {
      pageTitle: 'Multi',
      sourceHtmlPath: 'static-site/multi.html',
      content: {
        title: 'Multi',
        headings: [
          { level: 1, text: 'Multi' },
          { level: 2, text: 'L2' },
          { level: 3, text: 'L3' },
          { level: 4, text: 'L4' },
        ],
        segments: [
          { heading: { level: 1, text: 'Multi' }, text: 'intro' },
          { heading: { level: 2, text: 'L2' }, text: 't2' },
          { heading: { level: 3, text: 'L3' }, text: 't3' },
          { heading: { level: 4, text: 'L4' }, text: 't4' },
        ],
      },
    }
    const body = pageContentToTiddlers([page])[0].text
    expect(body).toContain('!! L2')
    expect(body).toContain('!!! L3')
    expect(body).toContain('!!!! L4')
  })
})

describe('pageContentToTiddlers — empty segment text', () => {
  it('collapses empty segment text to a heading-only line', () => {
    const page: ExtractedPage = {
      pageTitle: 'Contact',
      sourceHtmlPath: 'static-site/contact.html',
      content: {
        title: 'Contact',
        headings: [
          { level: 1, text: 'Contact' },
          { level: 2, text: 'Reach Out' },
        ],
        segments: [
          { heading: { level: 1, text: 'Contact' }, text: '' },
          { heading: { level: 2, text: 'Reach Out' }, text: '' },
        ],
      },
    }
    const body = pageContentToTiddlers([page])[0].text
    expect(body).toContain('!! Reach Out')
    expect(body).not.toMatch(/!! Reach Out\n\n\n/)
  })
})

describe('pageContentToTiddlers — fields', () => {
  it('threads source-html path and locked timestamps', () => {
    const result = pageContentToTiddlers([HOME_PAGE])
    expect(result[0].fields['source-html']).toBe('static-site/index.html')
    expect(result[0].fields.created).toBe('20260421000000000')
    expect(result[0].fields.modified).toBe('20260421000000000')
  })
})

describe('pageContentToTiddlers — pageTitle wins over content.title', () => {
  it('uses the page.pageTitle (PAGES array canonical) not content.title', () => {
    const page: ExtractedPage = {
      pageTitle: 'Home',
      sourceHtmlPath: 'static-site/index.html',
      content: {
        title: 'Welcome',
        headings: [{ level: 1, text: 'Welcome' }],
        segments: [{ heading: { level: 1, text: 'Welcome' }, text: 'Hello.' }],
      },
    }
    expect(pageContentToTiddlers([page])[0].title).toBe('Home')
  })
})

describe('pageContentToTiddlers — clean wikitext (no raw HTML)', () => {
  it('produces output with no angle brackets for plain-text input', () => {
    const result = pageContentToTiddlers([HOME_PAGE])
    expect(result[0].text).not.toMatch(/[<>]/)
  })
})

describe('pageContentToTiddlers — idempotent', () => {
  it('byte-identical JSON stringify across two sequential calls', () => {
    const first = JSON.stringify(pageContentToTiddlers([HOME_PAGE]))
    const second = JSON.stringify(pageContentToTiddlers([HOME_PAGE]))
    expect(second).toBe(first)
  })
})
