// scripts/tiddlywiki/extractors/technologies.test.ts
// EXTR-05 tests. SCAF-08 clean.

import { emitTechnologies } from './technologies.ts'

const TECH_HTML = `
<table class="exhibit-table technologies-table">
  <thead><tr><th>Category</th><th>Technologies &amp; Tools</th></tr></thead>
  <tbody>
    <tr>
      <td data-label="Category">eLearning Protocols</td>
      <td data-label="Technologies &amp; Tools">SCORM 1.2, SCORM 2004, AICC</td>
    </tr>
    <tr>
      <td data-label="Category">LMS Platforms</td>
      <td data-label="Technologies &amp; Tools">Cornerstone OnDemand</td>
    </tr>
  </tbody>
</table>
`

describe('emitTechnologies — single technology row', () => {
  it('LMS Platforms row yields one entry', () => {
    const techs = emitTechnologies(TECH_HTML, { sourceExhibitLabel: 'Exhibit A' })
    const lms = techs.filter((t) => t.context === 'LMS Platforms')
    expect(lms).toHaveLength(1)
    expect(lms[0].name).toBe('Cornerstone OnDemand')
    expect(lms[0].sourceExhibitLabel).toBe('Exhibit A')
  })
})

describe('emitTechnologies — comma-split multi-entry', () => {
  it('eLearning Protocols row yields three entries', () => {
    const techs = emitTechnologies(TECH_HTML, { sourceExhibitLabel: 'Exhibit A' })
    const protos = techs.filter((t) => t.context === 'eLearning Protocols')
    expect(protos).toHaveLength(3)
    expect(protos.map((t) => t.name)).toEqual(['SCORM 1.2', 'SCORM 2004', 'AICC'])
  })
})

describe('emitTechnologies — parenthesized inner commas split naively', () => {
  it('locks v1 simple-split contract: paren commas also split', () => {
    const html = `
      <table class="exhibit-table technologies-table">
        <tbody>
          <tr>
            <td data-label="Category">Dev</td>
            <td data-label="Technologies &amp; Tools">cross-domain communication (postMessage, EasyXDM), same-origin workarounds</td>
          </tr>
        </tbody>
      </table>
    `
    const techs = emitTechnologies(html, { sourceExhibitLabel: 'X' })
    expect(techs).toHaveLength(3)
    expect(techs[0].name).toBe('cross-domain communication (postMessage')
    expect(techs[1].name).toBe('EasyXDM)')
    expect(techs[2].name).toBe('same-origin workarounds')
  })
})

describe('emitTechnologies — empty tools cell', () => {
  it('skips rows with empty tools', () => {
    const html = `
      <table class="exhibit-table technologies-table">
        <tbody>
          <tr>
            <td data-label="Category">X</td>
            <td data-label="Technologies &amp; Tools"></td>
          </tr>
        </tbody>
      </table>
    `
    expect(emitTechnologies(html, { sourceExhibitLabel: 'X' })).toEqual([])
  })
})

describe('emitTechnologies — no table', () => {
  it('returns empty array', () => {
    expect(emitTechnologies('<div>no table</div>', { sourceExhibitLabel: 'X' })).toEqual([])
  })
})

describe('emitTechnologies — idempotency', () => {
  it('byte-identical JSON across two calls', () => {
    const a = JSON.stringify(emitTechnologies(TECH_HTML, { sourceExhibitLabel: 'Exhibit A' }))
    const b = JSON.stringify(emitTechnologies(TECH_HTML, { sourceExhibitLabel: 'Exhibit A' }))
    expect(b).toBe(a)
  })
})
