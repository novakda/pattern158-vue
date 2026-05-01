// scripts/tiddlywiki/extractors/case-files-index.test.ts
// EXTR-08 tests. SCAF-08 clean.

import { emitCaseFilesIndex } from './case-files-index.ts'

const INDEX_HTML = `
<section class="case-files-exhibits">
  <h2>Investigation Reports</h2>
  <div class="exhibit-card detail-exhibit type-investigation-report">
    <div class="exhibit-header">
      <span class="exhibit-label">Exhibit J</span>
      <span class="exhibit-client">General Motors</span>
      <span class="exhibit-date">2017–2018</span>
    </div>
    <h3 class="exhibit-title">GM Learning Portal: Course Completion Anomaly Investigation</h3>
  </div>
  <div class="exhibit-card detail-exhibit type-investigation-report">
    <div class="exhibit-header">
      <span class="exhibit-label">Exhibit K</span>
      <span class="exhibit-client">Microsoft (MCAPS)</span>
      <span class="exhibit-date">2025–2026</span>
    </div>
    <h3 class="exhibit-title">Microsoft MCAPS: AI-Led Training Agent</h3>
  </div>
</section>
<section class="case-files-exhibits">
  <h2>Engineering Briefs</h2>
  <div class="exhibit-card detail-exhibit type-engineering-brief">
    <div class="exhibit-header">
      <span class="exhibit-label">Exhibit A</span>
      <span class="exhibit-client">General Dynamics Electric Boat</span>
      <span class="exhibit-date">2015–2022</span>
    </div>
    <h3 class="exhibit-title">Cross-Domain SCORM Resolution</h3>
  </div>
</section>
`

describe('emitCaseFilesIndex — happy path with mixed types', () => {
  it('produces 3 entries with correct exhibitTypes', () => {
    const idx = emitCaseFilesIndex(INDEX_HTML)
    expect(idx.entries).toHaveLength(3)
    expect(idx.entries[0].exhibitType).toBe('investigation-report')
    expect(idx.entries[1].exhibitType).toBe('investigation-report')
    expect(idx.entries[2].exhibitType).toBe('engineering-brief')
  })
})

describe('emitCaseFilesIndex — preserves source-page order', () => {
  it('entries match DOM document order J → K → A', () => {
    const idx = emitCaseFilesIndex(INDEX_HTML)
    expect(idx.entries[0].label).toBe('Exhibit J')
    expect(idx.entries[1].label).toBe('Exhibit K')
    expect(idx.entries[2].label).toBe('Exhibit A')
  })
})

describe('emitCaseFilesIndex — field completeness', () => {
  it('every entry has label/client/date/title/exhibitType', () => {
    const idx = emitCaseFilesIndex(INDEX_HTML)
    expect(idx.entries[0]).toEqual({
      label: 'Exhibit J',
      client: 'General Motors',
      date: '2017–2018',
      title: 'GM Learning Portal: Course Completion Anomaly Investigation',
      exhibitType: 'investigation-report',
    })
  })
})

describe('emitCaseFilesIndex — missing type class defaults to engineering-brief', () => {
  it('card without type-* class is classified as engineering-brief', () => {
    const html = `
      <div class="exhibit-card detail-exhibit">
        <div class="exhibit-header">
          <span class="exhibit-label">Exhibit X</span>
          <span class="exhibit-client">Client</span>
          <span class="exhibit-date">2020</span>
        </div>
        <h3 class="exhibit-title">Untyped</h3>
      </div>
    `
    const idx = emitCaseFilesIndex(html)
    expect(idx.entries[0].exhibitType).toBe('engineering-brief')
  })
})

describe('emitCaseFilesIndex — no cards', () => {
  it('returns empty entries', () => {
    const idx = emitCaseFilesIndex('<div>no cards</div>')
    expect(idx.entries).toEqual([])
  })
})

describe('emitCaseFilesIndex — idempotency', () => {
  it('byte-identical JSON across two calls', () => {
    const a = JSON.stringify(emitCaseFilesIndex(INDEX_HTML))
    const b = JSON.stringify(emitCaseFilesIndex(INDEX_HTML))
    expect(b).toBe(a)
  })
})
