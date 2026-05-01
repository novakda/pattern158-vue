// scripts/tiddlywiki/extractors/pages.test.ts
// EXTR-07 tests. SCAF-08 clean — no wall-clock reads, no parallel iteration.
// Hermetic — inline HTML fixtures only.

import { emitPageContent } from './pages.ts'

describe('emitPageContent — title from first h1', () => {
  it('returns title=Philosophy from h1', () => {
    const html = `
      <main id="main-content">
        <section><h1>Philosophy</h1><p>Intro text.</p></section>
      </main>
    `
    const page = emitPageContent(html)
    expect(page.title).toBe('Philosophy')
  })
})

describe('emitPageContent — flat heading list preserves document order', () => {
  it('4 headings produce 4-element headings array with correct levels', () => {
    const html = `
      <main id="main-content">
        <h1>Top</h1>
        <h2>Section A</h2>
        <h2>Section B</h2>
        <h3>Subsection</h3>
      </main>
    `
    const page = emitPageContent(html)
    expect(page.headings).toHaveLength(4)
    expect(page.headings[0]).toEqual({ level: 1, text: 'Top' })
    expect(page.headings[1]).toEqual({ level: 2, text: 'Section A' })
    expect(page.headings[2]).toEqual({ level: 2, text: 'Section B' })
    expect(page.headings[3]).toEqual({ level: 3, text: 'Subsection' })
  })
})

describe('emitPageContent — segments anchored to preceding heading', () => {
  it('3 headings with prose yield 3 segments', () => {
    const html = `
      <main id="main-content">
        <h1>Top</h1>
        <p>Top prose.</p>
        <h2>A</h2>
        <p>A prose.</p>
        <h3>A.1</h3>
        <p>A.1 prose.</p>
      </main>
    `
    const page = emitPageContent(html)
    expect(page.segments).toHaveLength(3)
    expect(page.segments[0].heading.text).toBe('Top')
    expect(page.segments[0].text).toContain('Top prose.')
    expect(page.segments[1].heading.text).toBe('A')
    expect(page.segments[1].text).toContain('A prose.')
    expect(page.segments[2].heading.text).toBe('A.1')
    expect(page.segments[2].text).toContain('A.1 prose.')
  })
})

describe('emitPageContent — no h1 fallback', () => {
  it('title defaults to empty string', () => {
    const html = `
      <main id="main-content">
        <h2>No Top</h2>
        <p>Prose.</p>
      </main>
    `
    const page = emitPageContent(html)
    expect(page.title).toBe('')
  })
})

describe('emitPageContent — missing main wrapper falls back to body', () => {
  it('parses direct body content when main is absent', () => {
    const html = `
      <section><h1>Loose</h1><p>Body.</p></section>
    `
    const page = emitPageContent(html)
    expect(page.title).toBe('Loose')
    expect(page.segments[0].text).toContain('Body.')
  })
})

describe('emitPageContent — nested heading inside ol/li', () => {
  it('h3 inside li still becomes a segment with its following p', () => {
    const html = `
      <main id="main-content">
        <h1>Title</h1>
        <ol>
          <li>
            <h3>Step 1</h3>
            <p>Step 1 body.</p>
          </li>
        </ol>
      </main>
    `
    const page = emitPageContent(html)
    const step1 = page.segments.find((s) => s.heading.text === 'Step 1')
    expect(step1).toBeDefined()
    expect(step1!.text).toContain('Step 1 body.')
  })
})

describe('emitPageContent — idempotency', () => {
  it('byte-identical JSON across two calls', () => {
    const html = `<main id="main-content"><h1>X</h1><p>Y</p></main>`
    const a = JSON.stringify(emitPageContent(html))
    const b = JSON.stringify(emitPageContent(html))
    expect(b).toBe(a)
  })
})
