// scripts/tiddlywiki/extract-all.test.ts
// Phase 55 Plan 01 — tests for the extract-all orchestrator.
// SCAF-08 policy: no wall-clock reads, no instantiated dates, no parallel
// iteration helpers. Hermetic: fs fixtures built per-test in os.tmpdir().

import { promises as fsp } from 'node:fs'
import * as nodePath from 'node:path'
import * as os from 'node:os'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { extractAll } from './extract-all.ts'

const HOME_HTML = `<!doctype html><html><body><main id="main-content">
<h1>Home</h1>
<p>Welcome to Pattern 158.</p>
</main></body></html>`

const PHILOSOPHY_HTML = `<!doctype html><html><body><main id="main-content">
<h1>Philosophy</h1>
<p>Philosophy body.</p>
</main></body></html>`

const TECHNOLOGIES_HTML = `<!doctype html><html><body><main id="main-content">
<h1>Technologies</h1>
<p>Tech body.</p>
</main></body></html>`

const CONTACT_HTML = `<!doctype html><html><body><main id="main-content">
<h1>Contact</h1>
<p>Contact body.</p>
</main></body></html>`

const ACCESSIBILITY_HTML = `<!doctype html><html><body><main id="main-content">
<h1>Accessibility</h1>
<p>Access body.</p>
</main></body></html>`

const FAQ_HTML_MIN = `<!doctype html><html><body>
<div class="faq-accordion-item">
  <div class="faq-accordion-question">Q from HTML</div>
  <span class="faq-category-pill">general</span>
  <div class="faq-answer">A from HTML</div>
</div>
</body></html>`

const FAQ_JSON_MIN = JSON.stringify([
  { id: 'q-from-json', question: 'Q from JSON', answer: 'A from JSON', categories: ['general'] },
])

const CASE_FILES_HTML_MIN = `<!doctype html><html><body>
<article class="exhibit-card detail-exhibit type-investigation-report">
  <span class="exhibit-label">A</span>
  <span class="exhibit-client">Acme</span>
  <span class="exhibit-date">2024</span>
  <span class="exhibit-title">Sample Investigation</span>
</article>
</body></html>`

const EXHIBIT_A_HTML_MIN = `<!doctype html><html><body>
<div class="exhibit-meta-header">
  <span class="exhibit-label">A</span>
  <span class="exhibit-client">Acme</span>
  <span class="exhibit-date">2024</span>
</div>
<span class="exhibit-type-badge">investigation-report</span>
<h1 class="exhibit-detail-title">Sample Investigation</h1>
<section class="exhibit-section"><h2>Background</h2><p>Context text.</p></section>
<table class="personnel-table"><tbody>
  <tr><td data-label="person"><span class="personnel-name">Jane Doe</span></td><td data-label="organization">Acme</td><td data-label="role">Lead</td></tr>
  <tr><td data-label="person"><span class="personnel-name">John Smith</span></td><td data-label="organization">Acme</td><td data-label="role">Dev</td></tr>
</tbody></table>
<table class="findings-table"><tbody>
  <tr><td data-label="Finding">Issue X</td><td data-label="Description"><span>Description of X</span></td></tr>
</tbody></table>
</body></html>`

const EXHIBITS_JSON_A_ONLY = JSON.stringify([
  { label: 'A', client: 'Acme', date: '2024', title: 'Sample Investigation', exhibitType: 'investigation-report' },
])

const EXHIBITS_JSON_A_AND_Z = JSON.stringify([
  { label: 'A', client: 'Acme', date: '2024', title: 'Sample Investigation', exhibitType: 'investigation-report' },
  { label: 'Z', client: 'Ghost', date: '2099', title: 'Nonexistent', exhibitType: 'investigation-report' },
])

let tmpRoot: string

async function writeFile(relPath: string, contents: string): Promise<void> {
  const abs = nodePath.join(tmpRoot, relPath)
  await fsp.mkdir(nodePath.dirname(abs), { recursive: true })
  await fsp.writeFile(abs, contents, { encoding: 'utf8' })
}

async function writeAllPages(): Promise<void> {
  await writeFile('static-site/index.html', HOME_HTML)
  await writeFile('static-site/philosophy.html', PHILOSOPHY_HTML)
  await writeFile('static-site/technologies.html', TECHNOLOGIES_HTML)
  await writeFile('static-site/contact.html', CONTACT_HTML)
  await writeFile('static-site/accessibility.html', ACCESSIBILITY_HTML)
}

beforeEach(async () => {
  tmpRoot = await fsp.mkdtemp(nodePath.join(os.tmpdir(), 'p158-extract-all-'))
  await fsp.mkdir(nodePath.join(tmpRoot, 'static-site', 'exhibits'), { recursive: true })
  await fsp.mkdir(nodePath.join(tmpRoot, 'src', 'data', 'json'), { recursive: true })
})

afterEach(async () => {
  await fsp.rm(tmpRoot, { recursive: true, force: true })
})

describe('extractAll — FAQ JSON fallback when HTML absent', () => {
  it('returns faqItems from faq.json when static-site/faq.html is missing', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('static-site/exhibits/exhibit-a.html', EXHIBIT_A_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', EXHIBITS_JSON_A_ONLY)
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const bundle = await extractAll(tmpRoot)
    expect(bundle.faqItems.length).toBeGreaterThan(0)
    expect(bundle.faqItems[0].id).toBe('q-from-json')
    expect(bundle.faqItems[0].question).toBe('Q from JSON')
  })
})

describe('extractAll — FAQ HTML preferred over JSON', () => {
  it('returns faqItems from faq.html when both HTML and JSON exist', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('static-site/exhibits/exhibit-a.html', EXHIBIT_A_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', EXHIBITS_JSON_A_ONLY)
    await writeFile('static-site/faq.html', FAQ_HTML_MIN)
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const bundle = await extractAll(tmpRoot)
    expect(bundle.faqItems.length).toBeGreaterThan(0)
    expect(bundle.faqItems[0].question).toBe('Q from HTML')
  })
})

describe('extractAll — bundle shape', () => {
  it('returns an object with all 8 named keys populated as arrays or CaseFilesIndex', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('static-site/exhibits/exhibit-a.html', EXHIBIT_A_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', EXHIBITS_JSON_A_ONLY)
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const bundle = await extractAll(tmpRoot)
    expect(Array.isArray(bundle.faqItems)).toBe(true)
    expect(Array.isArray(bundle.exhibits)).toBe(true)
    expect(Array.isArray(bundle.personnelByExhibit)).toBe(true)
    expect(Array.isArray(bundle.findingsByExhibit)).toBe(true)
    expect(Array.isArray(bundle.technologiesByExhibit)).toBe(true)
    expect(Array.isArray(bundle.testimonials)).toBe(true)
    expect(Array.isArray(bundle.pages)).toBe(true)
    expect(bundle.caseFilesIndex).toBeDefined()
    expect(Array.isArray(bundle.caseFilesIndex.entries)).toBe(true)
  })
})

describe('extractAll — missing exhibit HTML tolerated', () => {
  it('skips exhibit Z when exhibit-z.html does not exist', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('static-site/exhibits/exhibit-a.html', EXHIBIT_A_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', EXHIBITS_JSON_A_AND_Z)
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const bundle = await extractAll(tmpRoot)
    expect(bundle.exhibits).toHaveLength(1)
    expect(bundle.exhibits[0].label).toBe('A')
  })
})

describe('extractAll — pages array scoped to the 5 static-site page files', () => {
  it('emits one pages entry per present page with locked sourceHtmlPath', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', JSON.stringify([]))
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const bundle = await extractAll(tmpRoot)
    expect(bundle.pages).toHaveLength(5)
    const titles = bundle.pages.map((p) => p.pageTitle)
    expect(titles).toEqual(['Home', 'Philosophy', 'Technologies', 'Contact', 'Accessibility'])
    const paths = bundle.pages.map((p) => p.sourceHtmlPath)
    expect(paths).toEqual([
      'static-site/index.html',
      'static-site/philosophy.html',
      'static-site/technologies.html',
      'static-site/contact.html',
      'static-site/accessibility.html',
    ])
  })
})

describe('extractAll — sourceExhibitLabel threading', () => {
  it('threads exhibit label into personnel and finding entries', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('static-site/exhibits/exhibit-a.html', EXHIBIT_A_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', EXHIBITS_JSON_A_ONLY)
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const bundle = await extractAll(tmpRoot)
    expect(bundle.personnelByExhibit.length).toBeGreaterThanOrEqual(2)
    for (const p of bundle.personnelByExhibit) {
      expect(p.sourceExhibitLabel).toBe('A')
    }
    expect(bundle.findingsByExhibit.length).toBeGreaterThanOrEqual(1)
    for (const f of bundle.findingsByExhibit) {
      expect(f.sourceExhibitLabel).toBe('A')
    }
  })
})

describe('extractAll — idempotent', () => {
  it('two sequential calls return byte-identical JSON', async () => {
    await writeAllPages()
    await writeFile('static-site/case-files.html', CASE_FILES_HTML_MIN)
    await writeFile('static-site/exhibits/exhibit-a.html', EXHIBIT_A_HTML_MIN)
    await writeFile('src/data/json/exhibits.json', EXHIBITS_JSON_A_ONLY)
    await writeFile('src/data/json/faq.json', FAQ_JSON_MIN)

    const first = JSON.stringify(await extractAll(tmpRoot))
    const second = JSON.stringify(await extractAll(tmpRoot))
    expect(second).toBe(first)
  })
})
