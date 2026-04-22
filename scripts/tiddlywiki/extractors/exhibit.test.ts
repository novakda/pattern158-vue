// scripts/tiddlywiki/extractors/exhibit.test.ts
// Phase 53 Plan 03 — EXTR-02 hermetic test suite for the exhibit extractor.
//
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic wall-clock APIs (no timers, no instantiated dates)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered section list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient under the scripts Vitest project.
// Fixtures are inline HTML template literals — hermetic, no fs I/O.

import { ExtractorError } from './types.ts'
import { emitExhibit } from './exhibit.ts'

const ENGINEERING_BRIEF_HTML = `
<div class="exhibit-detail-page">
  <section class="exhibit-detail-header">
    <div class="container">
      <nav class="exhibit-back-nav"><a href="/case-files">Back</a></nav>
      <div class="exhibit-meta-header">
        <span class="exhibit-label">Exhibit A</span>
        <span class="exhibit-client">General Dynamics Electric Boat</span>
        <span class="exhibit-date">2015–2022</span>
      </div>
      <h1 class="exhibit-detail-title">Cross-Domain SCORM Resolution &amp; Embedded Technical Advisory</h1>
      <span class="expertise-badge badge-deep exhibit-type-badge">Engineering Brief</span>
    </div>
  </section>
  <section class="exhibit-detail-body">
    <div class="container">
      <div class="exhibit-section"><h2>Personnel</h2><table class="exhibit-table personnel-table"></table></div>
      <div class="exhibit-section"><h2>Technologies</h2><table class="exhibit-table technologies-table"></table></div>
      <div class="exhibit-section"><h2>Findings</h2><table class="exhibit-table findings-table"></table></div>
      <div class="exhibit-section">
        <h2>Background</h2>
        <p>First context paragraph about EB.</p>
        <p>Second paragraph about the engagement.</p>
      </div>
      <div class="exhibit-section">
        <h2>Outcome</h2>
        <p>Summary of outcome.</p>
        <h3>Rollout</h3>
        <p>Details of rollout.</p>
        <p>More rollout details.</p>
      </div>
    </div>
  </section>
</div>
`

describe('emitExhibit — happy path (engineering brief)', () => {
  it('extracts label, client, date, title, exhibitType from .exhibit-meta-header and badge', () => {
    const ex = emitExhibit(ENGINEERING_BRIEF_HTML)
    expect(ex.label).toBe('Exhibit A')
    expect(ex.client).toBe('General Dynamics Electric Boat')
    expect(ex.date).toBe('2015–2022')
    expect(ex.title).toContain('Cross-Domain SCORM Resolution')
    expect(ex.exhibitType).toBe('engineering-brief')
  })
})

describe('emitExhibit — investigation report type', () => {
  it('normalizes badge text "Investigation Report" to investigation-report', () => {
    const html = ENGINEERING_BRIEF_HTML.replace('>Engineering Brief<', '>Investigation Report<')
    const ex = emitExhibit(html)
    expect(ex.exhibitType).toBe('investigation-report')
  })
})

describe('emitExhibit — context section', () => {
  it('extracts contextHeading + contextText from the Background section', () => {
    const ex = emitExhibit(ENGINEERING_BRIEF_HTML)
    expect(ex.contextHeading).toBe('Background')
    expect(ex.contextText).toContain('First context paragraph about EB.')
    expect(ex.contextText).toContain('Second paragraph about the engagement.')
  })
})

describe('emitExhibit — sections + subsections', () => {
  it('builds sections[] excluding Personnel/Technologies/Findings/Background', () => {
    const ex = emitExhibit(ENGINEERING_BRIEF_HTML)
    expect(ex.sections).toHaveLength(1)
    expect(ex.sections[0].heading).toBe('Outcome')
    expect(ex.sections[0].text).toContain('Summary of outcome.')
    expect(ex.sections[0].subsections).toHaveLength(1)
    expect(ex.sections[0].subsections[0].heading).toBe('Rollout')
    expect(ex.sections[0].subsections[0].text).toContain('Details of rollout.')
    expect(ex.sections[0].subsections[0].text).toContain('More rollout details.')
  })
})

describe('emitExhibit — JSON-only fields default to empty', () => {
  it('impactTags=[], summary=role="", emailCount=0', () => {
    const ex = emitExhibit(ENGINEERING_BRIEF_HTML)
    expect(ex.impactTags).toEqual([])
    expect(ex.summary).toBe('')
    expect(ex.role).toBe('')
    expect(ex.emailCount).toBe(0)
  })
})

describe('emitExhibit — malformed DOM (missing title)', () => {
  it('throws ExtractorError when h1.exhibit-detail-title is absent', () => {
    const html = '<div class="exhibit-detail-page"><div class="container">nothing</div></div>'
    expect(() => emitExhibit(html)).toThrow(ExtractorError)
  })
})

describe('emitExhibit — missing meta header defaults to empty strings', () => {
  it('label/client/date are empty when .exhibit-meta-header is absent', () => {
    const html = `
      <div class="exhibit-detail-page">
        <h1 class="exhibit-detail-title">Lonely Title</h1>
        <span class="exhibit-type-badge">Engineering Brief</span>
      </div>
    `
    const ex = emitExhibit(html)
    expect(ex.label).toBe('')
    expect(ex.client).toBe('')
    expect(ex.date).toBe('')
    expect(ex.title).toBe('Lonely Title')
  })
})

describe('emitExhibit — idempotency', () => {
  it('produces byte-identical JSON.stringify output across two calls', () => {
    const first = JSON.stringify(emitExhibit(ENGINEERING_BRIEF_HTML))
    const second = JSON.stringify(emitExhibit(ENGINEERING_BRIEF_HTML))
    expect(second).toBe(first)
  })
})
