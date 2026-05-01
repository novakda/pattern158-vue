// scripts/tiddlywiki/extractors/findings.test.ts
// EXTR-04 tests. SCAF-08 clean.

import { emitFindings } from './findings.ts'

const FINDINGS_HTML = `
<div class="exhibit-section">
  <h2>Findings</h2>
  <table class="exhibit-table findings-table">
    <thead><tr><th>Finding</th><th>Category</th><th>Description</th></tr></thead>
    <tbody>
      <tr>
        <td data-label="Finding">SCORM courses dependent on Cornerstone Network Player</td>
        <td data-label="Category"><span class="finding-category">protocol</span></td>
        <td data-label="Description">
          <span>SCORM requires a player to communicate between course and LMS.</span>
          <p class="finding-resolution">Dan provided a cross-domain SCORM wrapper.</p>
        </td>
      </tr>
      <tr>
        <td data-label="Finding">No tools to verify SCORM data flow</td>
        <td data-label="Category"><span class="finding-category">tooling</span></td>
        <td data-label="Description">
          <span>IT was disabling troubleshooting tools.</span>
          <p class="finding-resolution">Dan provided an LMS simulation tool.</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>
`

describe('emitFindings — happy path', () => {
  it('extracts finding / description / resolution / category for each row', () => {
    const findings = emitFindings(FINDINGS_HTML, { sourceExhibitLabel: 'Exhibit A' })
    expect(findings).toHaveLength(2)
    const first = findings[0]
    expect(first.finding).toBe('SCORM courses dependent on Cornerstone Network Player')
    expect(first.description).toContain('SCORM requires a player')
    expect(first.resolution).toContain('cross-domain SCORM wrapper')
    expect(first.category).toBe('protocol')
    expect(first.severity).toBe('')
    expect(first.outcome).toBe('')
    expect(first.sourceExhibitLabel).toBe('Exhibit A')
  })
})

describe('emitFindings — preserves source order', () => {
  it('second row is "No tools to verify SCORM data flow"', () => {
    const findings = emitFindings(FINDINGS_HTML, { sourceExhibitLabel: 'Exhibit A' })
    expect(findings[1].finding).toBe('No tools to verify SCORM data flow')
    expect(findings[1].category).toBe('tooling')
  })
})

describe('emitFindings — missing resolution', () => {
  it('resolution defaults to empty string when .finding-resolution absent', () => {
    const html = `
      <table class="exhibit-table findings-table">
        <tbody>
          <tr>
            <td data-label="Finding">F</td>
            <td data-label="Category"><span class="finding-category">x</span></td>
            <td data-label="Description"><span>D</span></td>
          </tr>
        </tbody>
      </table>
    `
    const findings = emitFindings(html, { sourceExhibitLabel: 'X' })
    expect(findings[0].resolution).toBe('')
  })
})

describe('emitFindings — missing category span', () => {
  it('category defaults to empty string', () => {
    const html = `
      <table class="exhibit-table findings-table">
        <tbody>
          <tr>
            <td data-label="Finding">F</td>
            <td data-label="Category"></td>
            <td data-label="Description"><span>D</span></td>
          </tr>
        </tbody>
      </table>
    `
    const findings = emitFindings(html, { sourceExhibitLabel: 'X' })
    expect(findings[0].category).toBe('')
  })
})

describe('emitFindings — no findings-table', () => {
  it('returns empty array', () => {
    expect(emitFindings('<div>no table</div>', { sourceExhibitLabel: 'X' })).toEqual([])
  })
})

describe('emitFindings — sourceExhibitLabel default', () => {
  it('defaults to empty string when opts omitted', () => {
    const findings = emitFindings(FINDINGS_HTML)
    expect(findings[0].sourceExhibitLabel).toBe('')
  })
})

describe('emitFindings — idempotency', () => {
  it('byte-identical across two calls', () => {
    const a = JSON.stringify(emitFindings(FINDINGS_HTML, { sourceExhibitLabel: 'Exhibit A' }))
    const b = JSON.stringify(emitFindings(FINDINGS_HTML, { sourceExhibitLabel: 'Exhibit A' }))
    expect(b).toBe(a)
  })
})
