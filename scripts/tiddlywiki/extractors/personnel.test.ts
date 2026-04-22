// scripts/tiddlywiki/extractors/personnel.test.ts
// EXTR-03 tests. SCAF-08 clean. Hermetic.

import { emitPersonnel } from './personnel.ts'

const PERSONNEL_HTML = `
<div class="exhibit-section">
  <h2>Personnel</h2>
  <table class="exhibit-table personnel-table">
    <thead><tr><th>Name / Title</th><th>Organization</th><th>Role on Project</th></tr></thead>
    <tbody>
      <tr class="">
        <td data-label="person">
          <span class="personnel-name">Dan Novak</span>
          <span class="personnel-title">Solution Architect</span>
        </td>
        <td data-label="organization">GP Strategies</td>
        <td data-label="role">Lead Investigator</td>
      </tr>
      <tr class="personnel-entry-anonymized">
        <td data-label="person">
          <span class="personnel-title">Chief of Learning Services</span>
        </td>
        <td data-label="organization">Electric Boat</td>
        <td data-label="role">Primary client contact</td>
      </tr>
      <tr class="personnel-entry-group">
        <td data-label="person">
          <span class="personnel-name">Multiple EB Personnel</span>
          <span class="personnel-title">49 contacts across departments</span>
        </td>
        <td data-label="organization">Electric Boat</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>
`

describe('emitPersonnel — individual row', () => {
  it('extracts name, title, organization, role, entryType="individual"', () => {
    const rows = emitPersonnel(PERSONNEL_HTML, { sourceExhibitLabel: 'Exhibit A' })
    expect(rows[0].name).toBe('Dan Novak')
    expect(rows[0].title).toBe('Solution Architect')
    expect(rows[0].organization).toBe('GP Strategies')
    expect(rows[0].role).toBe('Lead Investigator')
    expect(rows[0].entryType).toBe('individual')
    expect(rows[0].sourceExhibitLabel).toBe('Exhibit A')
  })
})

describe('emitPersonnel — anonymized row', () => {
  it('has empty name, entryType="anonymized"', () => {
    const rows = emitPersonnel(PERSONNEL_HTML, { sourceExhibitLabel: 'Exhibit A' })
    expect(rows[1].name).toBe('')
    expect(rows[1].title).toBe('Chief of Learning Services')
    expect(rows[1].entryType).toBe('anonymized')
  })
})

describe('emitPersonnel — group row', () => {
  it('has name + title, entryType="group"', () => {
    const rows = emitPersonnel(PERSONNEL_HTML, { sourceExhibitLabel: 'Exhibit A' })
    expect(rows[2].name).toBe('Multiple EB Personnel')
    expect(rows[2].entryType).toBe('group')
  })
})

describe('emitPersonnel — empty role cell', () => {
  it('role defaults to empty string', () => {
    const rows = emitPersonnel(PERSONNEL_HTML, { sourceExhibitLabel: 'Exhibit A' })
    expect(rows[2].role).toBe('')
  })
})

describe('emitPersonnel — sourceExhibitLabel default', () => {
  it('defaults to empty when opts omitted', () => {
    const rows = emitPersonnel(PERSONNEL_HTML)
    expect(rows[0].sourceExhibitLabel).toBe('')
  })
})

describe('emitPersonnel — no personnel-table', () => {
  it('returns empty array', () => {
    expect(emitPersonnel('<div>no table</div>', { sourceExhibitLabel: 'X' })).toEqual([])
  })
})

describe('emitPersonnel — idempotency', () => {
  it('byte-identical JSON across two calls', () => {
    const a = JSON.stringify(emitPersonnel(PERSONNEL_HTML, { sourceExhibitLabel: 'Exhibit A' }))
    const b = JSON.stringify(emitPersonnel(PERSONNEL_HTML, { sourceExhibitLabel: 'Exhibit A' }))
    expect(b).toBe(a)
  })
})
