// scripts/editorial/__tests__/convert.test.ts
// Phase 49 Plan 04 — CONV-09 hermetic test suite for scripts/editorial/convert.ts.
//
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient under the scripts Vitest project.

import {
  sanitizeHtml,
  configureTurndown,
  collapseBlankLines,
  convertCapturedPage,
  convertCapturedPages,
} from '../convert.ts'
import type { CapturedPage } from '../capture.ts'

function makeCapturedPage(
  mainHtml: string,
  overrides: Partial<CapturedPage> = {},
): CapturedPage {
  return {
    route: { path: '/', label: 'Home', category: 'static' },
    httpStatus: 200,
    mainHtml,
    title: 'Test Page',
    description: 'Test description',
    consoleErrors: [],
    screenshotPath: '/tmp/test.png',
    ...overrides,
  }
}

describe('sanitizeHtml — subtree strip', () => {
  it.each([
    // [description, input fragment, substring that MUST be absent, substring that MUST be present]
    ['<script>', '<p>ok</p><script>alert(1)</script>', 'alert(1)', 'ok'],
    ['<style>', '<style>.x{color:red}</style><p>ok</p>', 'color:red', 'ok'],
    ['<noscript>', '<noscript>fallback</noscript><p>ok</p>', 'fallback', 'ok'],
    ['[aria-hidden="true"]', '<div aria-hidden="true">hidden-icon</div><p>visible</p>', 'hidden-icon', 'visible'],
  ])('strips %s', (_desc, input, forbidden, present) => {
    const output = sanitizeHtml(input)
    expect(output).not.toContain(forbidden)
    expect(output).toContain(present)
  })
})

describe('sanitizeHtml — data-v-* attribute walk', () => {
  it('strips data-v-* attributes but preserves class/href/alt/data-other', () => {
    const input = '<p data-v-abc123 class="x" data-other="keep"><a href="/h" data-v-xyz789>link</a></p>'
    const output = sanitizeHtml(input)
    expect(output).not.toMatch(/data-v-/)
    expect(output).toContain('class="x"')
    expect(output).toContain('data-other="keep"')
    expect(output).toContain('href="/h"')
  })

  it('is deterministic — same input yields byte-equal output', () => {
    const input = '<h1>T</h1><p data-v-a class="k">body <span class="badge">X</span></p>'
    expect(sanitizeHtml(input)).toBe(sanitizeHtml(input))
  })
})

describe('heading demotion (CONV-04)', () => {
  it.each([
    ['h1 -> h3', '<h1>T</h1>', '<h3>T</h3>'],
    ['h2 -> h4', '<h2>T</h2>', '<h4>T</h4>'],
    ['h3 -> h5', '<h3>T</h3>', '<h5>T</h5>'],
    ['h4 -> h6', '<h4>T</h4>', '<h6>T</h6>'],
    ['h5 -> h6 (clamp)', '<h5>T</h5>', '<h6>T</h6>'],
    ['h6 -> h6 (clamp, no-op)', '<h6>T</h6>', '<h6>T</h6>'],
  ])('sanitizeHtml demotes %s', (_desc, input, expected) => {
    const output = sanitizeHtml(input)
    expect(output).toContain(expected)
  })

  it('preserves attributes (class/id/aria-label/data-*) on the demoted heading', () => {
    // WR-01 regression guard: rewriting h1→h3 via createElement used to drop
    // every attribute on the original heading. The attribute-copy loop must
    // carry class/id/aria-label/data-other verbatim onto the new element.
    const input = '<h1 class="page-title" id="top" aria-label="Page header" data-other="keep">X</h1>'
    const output = sanitizeHtml(input)
    expect(output).toContain('<h3')
    expect(output).toContain('class="page-title"')
    expect(output).toContain('id="top"')
    expect(output).toContain('aria-label="Page header"')
    expect(output).toContain('data-other="keep"')
    expect(output).toContain('>X</h3>')
  })
})

describe('pattern158-badges rule (CONV-05)', () => {
  it.each([
    ['span.badge', '<span class="badge">HIGH</span>', '**HIGH**'],
    ['span.badge-high', '<span class="badge-high">HIGH</span>', '**HIGH**'], // checker warning #4 coverage — validates `badge-\w+` regex alternation
    ['span.pill', '<span class="pill">Beta</span>', '**Beta**'],
    ['span.chip', '<span class="chip">Info</span>', '**Info**'],
    ['span.tag', '<span class="tag">general</span>', '**general**'],
    ['span.tag-accessibility', '<span class="tag-accessibility">A11Y</span>', '**A11Y**'],
    ['span.severity-high', '<span class="severity-high">Critical</span>', '**Critical**'],
    ['span.category-design', '<span class="category-design">UX</span>', '**UX**'],
  ])('turns %s into **bold**', (_desc, input, expectedBold) => {
    const service = configureTurndown()
    const sanitized = sanitizeHtml(input)
    const md = service.turndown(sanitized)
    expect(md).toContain(expectedBold)
  })

  it('leaves non-allowlisted span classes alone (no bold wrapping)', () => {
    const service = configureTurndown()
    const md = service.turndown(sanitizeHtml('<span class="not-a-badge">plain</span>'))
    expect(md).not.toContain('**plain**')
    expect(md).toContain('plain')
  })

  // IN-02 regression guards — ensure the badge regex does not bold adjacent
  // or lookalike tokens. Guards against future regex drift (e.g., someone
  // removing the word-boundary anchors or adding `\w*` suffix matching).
  it.each([
    ['tags (plural)',   '<span class="tags">plain</span>'],
    ['tagged',          '<span class="tagged">plain</span>'],
    ['badger',          '<span class="badger">plain</span>'],
    ['prefixed-badge',  '<span class="my-badge">plain</span>'],
  ])('does not bold %s', (_desc, input) => {
    const md = configureTurndown().turndown(sanitizeHtml(input))
    expect(md).not.toContain('**plain**')
    expect(md).toContain('plain')
  })
})

describe('pattern158-badges rule (CONV-05) — icon flatten', () => {
  it('flattens icon+text badge to text-only bold', () => {
    // The icon is an <i aria-hidden="true"> child. Plan 49-01's sanitizeHtml
    // strips aria-hidden subtrees, leaving only "HIGH" wrapped in **bold**.
    const input = '<span class="badge"><i aria-hidden="true" class="icon-warn"></i>HIGH</span>'
    const md = configureTurndown().turndown(sanitizeHtml(input))
    expect(md).toContain('**HIGH**')
  })
})

describe('GFM plugin — tables (CONV-01)', () => {
  it('renders a 2-col table as pipe-table markdown', () => {
    const input = `
      <table>
        <thead><tr><th>Name</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td>Dan</td><td>Eng</td></tr>
          <tr><td>Sam</td><td>Design</td></tr>
        </tbody>
      </table>
    `
    const md = configureTurndown().turndown(sanitizeHtml(input))
    // @joplin/turndown-plugin-gfm emits single-space padding around each cell
    // (cells ≥ 3 chars are not further padded; cells < 3 chars get padded to 3
    // so the `---` separator alignment holds — exercised by the A/B table in
    // the determinism self-test below). Assertions here use the exact emitted
    // form for deterministic regression detection.
    expect(md).toContain('| Name | Role |')
    expect(md).toContain('| Dan | Eng |')
    expect(md).toContain('| Sam | Design |')
  })
})

describe('nested list preservation', () => {
  it('preserves 3-level nested hierarchy', () => {
    const input = `
      <ul>
        <li>L1a
          <ul>
            <li>L2a
              <ul>
                <li>L3a</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>L1b</li>
      </ul>
    `
    const md = configureTurndown().turndown(sanitizeHtml(input))
    // Turndown's list renderer pads the bullet marker with 3 spaces for nested
    // alignment (deterministic, see @joplin/turndown-plugin-gfm list output).
    expect(md).toContain('-   L1a')
    expect(md).toContain('-   L2a')
    expect(md).toContain('-   L3a')
    expect(md).toContain('-   L1b')
    const l1a = md.indexOf('L1a')
    const l2a = md.indexOf('L2a')
    const l3a = md.indexOf('L3a')
    const l1b = md.indexOf('L1b')
    expect(l1a).toBeLessThan(l2a)
    expect(l2a).toBeLessThan(l3a)
    expect(l3a).toBeLessThan(l1b)
  })
})

describe('image-alt-only rule (CONV-03) — with alt', () => {
  it('emits bare alt text when alt is non-empty', () => {
    const md = configureTurndown().turndown(sanitizeHtml('<p><img alt="Hero" src="/x.png"></p>'))
    expect(md).toContain('Hero')
    expect(md).not.toContain('![')
    expect(md).not.toContain('/x.png')
  })

  it('never emits base64 data URLs even when alt text is provided', () => {
    const base64 = 'data:image/png;base64,iVBORw0KGgo='
    const md = configureTurndown().turndown(
      sanitizeHtml(`<p><img alt="Chart" src="${base64}"></p>`),
    )
    expect(md).toContain('Chart')
    expect(md).not.toContain(base64)
  })
})

describe('image-alt-only rule (CONV-03) — without alt', () => {
  it('emits nothing when alt is missing', () => {
    const md = configureTurndown().turndown(sanitizeHtml('<p>before<img src="/x.png">after</p>'))
    expect(md).toContain('before')
    expect(md).toContain('after')
    expect(md).not.toContain('![')
    expect(md).not.toContain('/x.png')
  })

  it('emits nothing when alt is empty string', () => {
    const md = configureTurndown().turndown(sanitizeHtml('<p>before<img alt="" src="/x.png">after</p>'))
    expect(md).not.toContain('![')
    expect(md).not.toContain('/x.png')
  })
})

describe('link hrefs (CONV-07)', () => {
  it.each([
    ['internal', '<a href="/faq">FAQ</a>', '[FAQ](/faq)'],
    ['external http', '<a href="http://example.com">Ext</a>', '[Ext](http://example.com)'],
    ['external https', '<a href="https://pattern158.solutions/x">Home</a>', '[Home](https://pattern158.solutions/x)'],
    ['mailto', '<a href="mailto:dan@example.com">email</a>', '[email](mailto:dan@example.com)'],
  ])('preserves %s href verbatim', (_desc, input, expected) => {
    const md = configureTurndown().turndown(sanitizeHtml(input))
    expect(md).toContain(expected)
  })
})

describe('collapseBlankLines (CONV-08)', () => {
  it.each([
    ['4 newlines -> 2', 'a\n\n\n\nb', 'a\n\nb'],
    ['3 newlines -> 2', 'a\n\n\nb', 'a\n\nb'],
    ['2 newlines (already correct)', 'a\n\nb', 'a\n\nb'],
    ['1 newline unchanged', 'a\nb', 'a\nb'],
    ['no newlines unchanged', 'ab', 'ab'],
    ['multiple runs collapsed independently', 'a\n\n\nb\n\n\n\nc', 'a\n\nb\n\nc'],
  ])('%s', (_desc, input, expected) => {
    expect(collapseBlankLines(input)).toBe(expected)
  })

  it('is idempotent', () => {
    const input = 'a\n\n\n\n\nb\n\n\nc'
    expect(collapseBlankLines(collapseBlankLines(input))).toBe(collapseBlankLines(input))
  })
})

describe('determinism self-test (CONV-02)', () => {
  it('convertCapturedPage on a richest combined fixture yields byte-equal markdown across two calls', () => {
    const richHtml = `
      <h1>Page Title</h1>
      <p data-v-abc>Intro with a <a href="/faq">link</a> and a <span class="badge">tag</span>.</p>
      <h2>Section</h2>
      <ul>
        <li>item 1</li>
        <li>item 2
          <ul><li>nested</li></ul>
        </li>
      </ul>
      <table>
        <thead><tr><th>A</th><th>B</th></tr></thead>
        <tbody><tr><td>1</td><td>2</td></tr></tbody>
      </table>
      <img alt="Diagram" src="/x.png">
      <div aria-hidden="true">decorative</div>
      <style>.x{color:red}</style>
    `
    const page = makeCapturedPage(richHtml)
    const first = convertCapturedPage(page).markdown
    const second = convertCapturedPage(page).markdown
    expect(first).toBe(second) // byte-equal determinism check
    // Smoke-check the fixture produced non-empty markdown with the expected shape:
    expect(first).toContain('### Page Title')          // H1 demoted to H3
    expect(first).toContain('#### Section')            // H2 demoted to H4
    expect(first).toContain('[link](/faq)')            // href preserved
    expect(first).toContain('**tag**')                 // badge as bold
    expect(first).toContain('| A   | B   |')           // GFM table header (@joplin GFM plugin pads to min 3 chars for --- separator)
    expect(first).toContain('-   item 1')              // bullet marker locked to - (Turndown pads with 3 spaces)
    expect(first).toContain('Diagram')                 // image alt bare text
    expect(first).not.toContain('![')                  // no image markdown syntax
    expect(first).not.toContain('decorative')          // aria-hidden stripped
    expect(first).not.toContain('color:red')           // <style> stripped
    expect(first).not.toMatch(/data-v-/)               // data-v-* stripped
  })
})

describe('DOM-order preservation (CONV-06)', () => {
  it('paragraph -> list -> table stays in document order', () => {
    const input = `
      <p>para-text</p>
      <ul><li>list-item</li></ul>
      <table><thead><tr><th>col</th></tr></thead><tbody><tr><td>cell</td></tr></tbody></table>
    `
    const md = convertCapturedPage(makeCapturedPage(input)).markdown
    const paraIdx = md.indexOf('para-text')
    const listIdx = md.indexOf('list-item')
    const tableIdx = md.indexOf('cell')
    expect(paraIdx).toBeGreaterThanOrEqual(0)
    expect(listIdx).toBeGreaterThan(paraIdx)
    expect(tableIdx).toBeGreaterThan(listIdx)
  })
})

describe('convertCapturedPages', () => {
  it('returns a readonly array of the same length and order as input', () => {
    const p1 = makeCapturedPage('<p>one</p>', { route: { path: '/a', label: 'A', category: 'static' } })
    const p2 = makeCapturedPage('<p>two</p>', { route: { path: '/b', label: 'B', category: 'static' } })
    const p3 = makeCapturedPage('<p>three</p>', { route: { path: '/c', label: 'C', category: 'static' } })
    const out = convertCapturedPages([p1, p2, p3])
    expect(out).toHaveLength(3)
    expect(out[0].route.path).toBe('/a')
    expect(out[1].route.path).toBe('/b')
    expect(out[2].route.path).toBe('/c')
    expect(out[0].markdown).toContain('one')
    expect(out[1].markdown).toContain('two')
    expect(out[2].markdown).toContain('three')
  })

  it('handles empty input array', () => {
    expect(convertCapturedPages([])).toEqual([])
  })

  it('carries Phase 48 capture metadata through to ConvertedPage', () => {
    const page = makeCapturedPage('<p>x</p>', {
      consoleErrors: ['err1', 'err2'],
      screenshotPath: '/abs/path/00-home.png',
      cfCacheStatus: 'HIT',
    })
    const out = convertCapturedPage(page)
    expect(out.consoleErrors).toEqual(['err1', 'err2'])
    expect(out.screenshotPath).toBe('/abs/path/00-home.png')
    expect(out.cfCacheStatus).toBe('HIT')
  })
})
