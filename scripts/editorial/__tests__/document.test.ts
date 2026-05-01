// scripts/editorial/__tests__/document.test.ts
// Phase 50 — hermetic unit tests for the monolithic document assembler.
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient via the scripts Vitest project
// (globals=true in vitest.config.ts).

import {
  assembleDocument,
  buildFailedRouteSection,
  buildFrontmatter,
  buildRouteSection,
  buildToc,
  slugForRoute,
  type DocumentAssemblyInput,
  type RouteFailure,
} from '../document.ts'
import type { Route } from '../routes.ts'
import type { ConvertedPage } from '../convert.ts'
import type { EditorialConfig } from '../config.ts'

// ---------------------------------------------------------------------------
// Fixed constants — every test uses these so the assembly output is fully
// deterministic (no wall-clock values leak into assertions).
// ---------------------------------------------------------------------------

const FIXED_CAPTURED_AT = '2026-04-20T17:30:00.000Z'
const FIXED_TOOL_VERSION = 'editorial-capture/def5678+dirty'
const FIXED_SITE_SHA = 'abc1234'

function makeConfig(overrides: Partial<EditorialConfig> = {}): EditorialConfig {
  return {
    outputPath: '/tmp/editorial/out.md',
    baseUrl: 'https://pattern158.solutions',
    headful: false,
    mirror: false,
    exhibitsJsonPath: '/tmp/exhibits.json',
    ...overrides,
  }
}

function makeRoute(
  path: string,
  label: string,
  category: 'static' | 'exhibit' = 'static',
): Route {
  return { path, label, category }
}

function makePage(route: Route, overrides: Partial<ConvertedPage> = {}): ConvertedPage {
  return {
    route,
    markdown: `### ${route.label}\n\nbody text for ${route.path}`,
    httpStatus: 200,
    title: `${route.label} | Pattern 158`,
    description: `Description for ${route.label}`,
    consoleErrors: [],
    screenshotPath: `/tmp/screenshots/00-${route.label.toLowerCase()}.png`,
    cfCacheStatus: 'HIT',
    ...overrides,
  }
}

function makeFailure(route: Route, message: string, httpStatus?: number): RouteFailure {
  return { route, error: new Error(message), httpStatus }
}

function makeMinimalInput(overrides: Partial<DocumentAssemblyInput> = {}): DocumentAssemblyInput {
  const homeRoute = makeRoute('/', 'Home')
  return {
    config: makeConfig(),
    captured: [makePage(homeRoute)],
    failures: [],
    routes: [homeRoute],
    capturedAt: FIXED_CAPTURED_AT,
    toolVersion: FIXED_TOOL_VERSION,
    siteVersionSha: FIXED_SITE_SHA,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------

describe('slugForRoute', () => {
  it.each([
    ['/', 'route-home'],
    ['/philosophy', 'route-philosophy'],
    ['/faq', 'route-faq'],
    ['/case-files', 'route-case-files'],
    ['/exhibits/exhibit-a', 'route-exhibits-exhibit-a'],
    ['/contact', 'route-contact'],
  ])('slugForRoute({ path: %j }) → %j', (path, expected) => {
    expect(slugForRoute(makeRoute(path, 'x'))).toBe(expected)
  })

  it('produces the same slug on repeated calls (fresh slugger per call)', () => {
    const route = makeRoute('/faq', 'FAQ')
    expect(slugForRoute(route)).toBe(slugForRoute(route))
  })
})

describe('buildFrontmatter', () => {
  it('returns a string opening with `---\\n` and closing with `---`', () => {
    const fm = buildFrontmatter(makeMinimalInput())
    expect(fm.startsWith('---\n')).toBe(true)
    expect(fm.endsWith('---')).toBe(true)
  })

  it('contains the injected captured_at verbatim', () => {
    const fm = buildFrontmatter(makeMinimalInput())
    expect(fm).toContain(`captured_at: ${FIXED_CAPTURED_AT}`)
  })

  it('contains source_url from config.baseUrl', () => {
    const fm = buildFrontmatter(makeMinimalInput())
    expect(fm).toContain('source_url: https://pattern158.solutions')
  })

  it('contains site_version_sha when input passes the safe-alphabet test', () => {
    const fm = buildFrontmatter(makeMinimalInput({ siteVersionSha: 'abc1234' }))
    expect(fm).toContain('site_version_sha: abc1234')
  })

  it('sanitizes site_version_sha to empty for injection-looking input', () => {
    const fm = buildFrontmatter(
      makeMinimalInput({ siteVersionSha: '<script>alert(1)</script>' }),
    )
    // yaml renders empty string as `""` (double-quoted empty scalar).
    expect(fm).toContain('site_version_sha: ""')
    expect(fm).not.toContain('<script>')
    expect(fm).not.toContain('alert(1)')
  })

  it('contains tool_version', () => {
    const fm = buildFrontmatter(makeMinimalInput())
    expect(fm).toContain(`tool_version: ${FIXED_TOOL_VERSION}`)
  })

  it('emits routes_captured and routes_failed matching array lengths', () => {
    const routes = [makeRoute('/', 'Home'), makeRoute('/faq', 'FAQ'), makeRoute('/contact', 'Contact')]
    const input = makeMinimalInput({
      routes,
      captured: [makePage(routes[0]), makePage(routes[2]), makePage(routes[1])],
      failures: [makeFailure(makeRoute('/ghost', 'Ghost'), 'oops')],
    })
    const fm = buildFrontmatter(input)
    expect(fm).toContain('routes_captured: 3')
    expect(fm).toContain('routes_failed: 1')
  })

  it('produces byte-equal output for two calls with identical input', () => {
    const input = makeMinimalInput()
    expect(buildFrontmatter(input)).toBe(buildFrontmatter(input))
  })
})

describe('buildToc', () => {
  it('emits only the `## Contents` heading (with a blank line) when routes is empty', () => {
    const toc = buildToc([], [], [])
    expect(toc).toBe('## Contents\n')
  })

  it('preserves original route order across interleaved captured + failed routes', () => {
    const home = makeRoute('/', 'Home')
    const faq = makeRoute('/faq', 'FAQ')
    const exhibitA = makeRoute('/exhibits/exhibit-a', 'Exhibit A', 'exhibit')
    const routes = [home, faq, exhibitA]
    const captured = [makePage(home), makePage(exhibitA)]
    const failures = [makeFailure(faq, 'Cloudflare bot interstitial on /faq')]
    const toc = buildToc(routes, captured, failures)
    const expected = [
      '## Contents',
      '',
      '- [Home](#route-home)',
      '- [FAQ (failed)](#route-faq)',
      '- [Exhibit A](#route-exhibits-exhibit-a)',
    ].join('\n')
    expect(toc).toBe(expected)
  })

  it('anchor for each ToC entry equals slugForRoute(route)', () => {
    const home = makeRoute('/', 'Home')
    const faq = makeRoute('/faq', 'FAQ')
    const toc = buildToc([home, faq], [makePage(home), makePage(faq)], [])
    expect(toc).toContain(`[Home](#${slugForRoute(home)})`)
    expect(toc).toContain(`[FAQ](#${slugForRoute(faq)})`)
  })

  it('appends " (failed)" suffix on failed route labels only', () => {
    const faq = makeRoute('/faq', 'FAQ')
    const toc = buildToc([faq], [], [makeFailure(faq, 'x')])
    expect(toc).toContain('- [FAQ (failed)](#route-faq)')
    expect(toc).not.toContain('- [FAQ](#route-faq)') // plain (un-suffixed) form MUST NOT appear
  })

  it('silently skips routes that appear in neither captured nor failures', () => {
    const home = makeRoute('/', 'Home')
    const ghost = makeRoute('/ghost', 'Ghost')
    const toc = buildToc([home, ghost], [makePage(home)], [])
    expect(toc).toContain('- [Home](#route-home)')
    expect(toc).not.toContain('Ghost')
  })
})

describe('buildRouteSection', () => {
  it('renders full metadata blockquote when every field is populated', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'))
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).toContain('## Route: /faq')
    expect(section).toContain(`> **Captured:** ${FIXED_CAPTURED_AT}`)
    expect(section).toContain('> **Status:** 200')
    expect(section).toContain('> **CF Cache:** HIT')
    expect(section).toContain('> **Title:** FAQ | Pattern 158')
    expect(section).toContain('> **Description:** Description for FAQ')
  })

  it('omits `Description:` line entirely when description is empty string', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'), { description: '' })
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).not.toContain('Description:')
  })

  it('omits `CF Cache:` line entirely when cfCacheStatus is undefined', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'), { cfCacheStatus: undefined })
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).not.toContain('CF Cache:')
  })

  it('omits `CF Cache:` line entirely when cfCacheStatus is empty string', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'), { cfCacheStatus: '' })
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).not.toContain('CF Cache:')
  })

  it('omits `Title:` line entirely when title is empty string', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'), { title: '' })
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).not.toContain('Title:')
  })

  it('heading preserves the literal leading slash in route.path', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'))
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).toMatch(/^## Route: \/faq$/m)
  })

  it('includes page.markdown body and strips trailing newlines', () => {
    const page = makePage(makeRoute('/', 'Home'), {
      markdown: '### Home\n\nbody\n\n\n\n',
    })
    const section = buildRouteSection(page, FIXED_CAPTURED_AT)
    expect(section).toContain('### Home\n\nbody')
    expect(section.endsWith('body')).toBe(true)
  })

  it('produces byte-equal output on repeated calls', () => {
    const page = makePage(makeRoute('/faq', 'FAQ'))
    expect(buildRouteSection(page, FIXED_CAPTURED_AT)).toBe(
      buildRouteSection(page, FIXED_CAPTURED_AT),
    )
  })
})

describe('buildFailedRouteSection', () => {
  it('renders the error message from an Error instance verbatim', () => {
    const faq = makeRoute('/faq', 'FAQ')
    const failure: RouteFailure = {
      route: faq,
      error: new Error('Cloudflare bot interstitial detected on /faq — title contains "Just a moment"'),
    }
    const section = buildFailedRouteSection(failure, FIXED_CAPTURED_AT)
    expect(section).toContain('## Route: /faq')
    expect(section).toContain(
      '> **Capture failed:** Cloudflare bot interstitial detected on /faq — title contains "Just a moment"',
    )
  })

  it('includes `> **Status:** <n>` line when httpStatus is defined', () => {
    const failure: RouteFailure = {
      route: makeRoute('/exhibits/exhibit-x', 'Exhibit X', 'exhibit'),
      error: new Error('silent 404'),
      httpStatus: 404,
    }
    const section = buildFailedRouteSection(failure, FIXED_CAPTURED_AT)
    expect(section).toContain('> **Status:** 404')
  })

  it('omits `Status:` line when httpStatus is undefined', () => {
    const failure: RouteFailure = {
      route: makeRoute('/faq', 'FAQ'),
      error: new Error('interstitial'),
    }
    const section = buildFailedRouteSection(failure, FIXED_CAPTURED_AT)
    expect(section).not.toContain('Status:')
  })

  it('handles non-Error thrown values via String(err)', () => {
    const failure: RouteFailure = {
      route: makeRoute('/faq', 'FAQ'),
      error: 'boom',
    }
    const section = buildFailedRouteSection(failure, FIXED_CAPTURED_AT)
    expect(section).toContain('> **Capture failed:** boom')
  })

  it('handles plain objects with a `.message` field', () => {
    const failure: RouteFailure = {
      route: makeRoute('/faq', 'FAQ'),
      error: { message: 'object-based message', code: 'X' },
    }
    const section = buildFailedRouteSection(failure, FIXED_CAPTURED_AT)
    expect(section).toContain('> **Capture failed:** object-based message')
  })

  it('includes the injected capturedAt in the `> **Captured:**` line', () => {
    const failure: RouteFailure = {
      route: makeRoute('/faq', 'FAQ'),
      error: new Error('x'),
    }
    const section = buildFailedRouteSection(failure, FIXED_CAPTURED_AT)
    expect(section).toContain(`> **Captured:** ${FIXED_CAPTURED_AT}`)
  })
})

describe('assembleDocument', () => {
  it('end-to-end minimal input produces frontmatter + ToC + one route section + single trailing newline', () => {
    const result = assembleDocument(makeMinimalInput())
    expect(result.startsWith('---\n')).toBe(true)
    expect(result).toContain('## Contents')
    expect(result).toContain('## Route: /')
    expect(result.endsWith('\n')).toBe(true)
    expect(result.endsWith('\n\n')).toBe(false)
  })

  it('multi-route: captured + failed + captured preserves original route order', () => {
    const home = makeRoute('/', 'Home')
    const faq = makeRoute('/faq', 'FAQ')
    const about = makeRoute('/philosophy', 'Philosophy')
    const routes = [home, faq, about]
    const input: DocumentAssemblyInput = {
      config: makeConfig(),
      captured: [makePage(home), makePage(about)],
      failures: [makeFailure(faq, 'Cloudflare bot interstitial detected on /faq')],
      routes,
      capturedAt: FIXED_CAPTURED_AT,
      toolVersion: FIXED_TOOL_VERSION,
      siteVersionSha: FIXED_SITE_SHA,
    }
    const result = assembleDocument(input)
    // All three `## Route:` headings appear in order
    const homeIdx = result.indexOf('## Route: /\n')
    const faqIdx = result.indexOf('## Route: /faq')
    const aboutIdx = result.indexOf('## Route: /philosophy')
    expect(homeIdx).toBeGreaterThan(0)
    expect(faqIdx).toBeGreaterThan(homeIdx)
    expect(aboutIdx).toBeGreaterThan(faqIdx)
    // Failed route placeholder appears in body
    expect(result).toContain('> **Capture failed:** Cloudflare bot interstitial detected on /faq')
  })

  it('emits `\\n\\n---\\n\\n` between sections but NOT after the last route', () => {
    const home = makeRoute('/', 'Home')
    const faq = makeRoute('/faq', 'FAQ')
    const routes = [home, faq]
    const input: DocumentAssemblyInput = {
      config: makeConfig(),
      captured: [makePage(home), makePage(faq)],
      failures: [],
      routes,
      capturedAt: FIXED_CAPTURED_AT,
      toolVersion: FIXED_TOOL_VERSION,
      siteVersionSha: FIXED_SITE_SHA,
    }
    const result = assembleDocument(input)
    // Separator appears exactly 2 times: once after ToC, once between the two routes.
    // (The frontmatter fence closes with `---` on its own line — but that line is
    // not preceded+followed by blank lines in the same pattern, so the `\n\n---\n\n`
    // match-count is 2.)
    const separator = '\n\n---\n\n'
    let count = 0
    let idx = 0
    while (true) {
      const next = result.indexOf(separator, idx)
      if (next === -1) break
      count += 1
      idx = next + separator.length
    }
    expect(count).toBe(2)
    // Document does NOT end with the separator
    expect(result.endsWith(separator)).toBe(false)
    expect(result.endsWith('\n---\n\n')).toBe(false)
  })

  it('throws when a route is in `routes` but neither `captured` nor `failures`', () => {
    const ghost = makeRoute('/ghost', 'Ghost')
    const input: DocumentAssemblyInput = {
      config: makeConfig(),
      captured: [],
      failures: [],
      routes: [ghost],
      capturedAt: FIXED_CAPTURED_AT,
      toolVersion: FIXED_TOOL_VERSION,
      siteVersionSha: FIXED_SITE_SHA,
    }
    expect(() => assembleDocument(input)).toThrowError(/route \/ghost not found/)
  })

  it('places frontmatter before ToC and ToC before first route', () => {
    const home = makeRoute('/', 'Home')
    const result = assembleDocument(makeMinimalInput({ routes: [home], captured: [makePage(home)] }))
    const fmIdx = result.indexOf('---\n')
    const tocIdx = result.indexOf('## Contents')
    const routeIdx = result.indexOf('## Route: /')
    expect(fmIdx).toBe(0)
    expect(tocIdx).toBeGreaterThan(fmIdx)
    expect(routeIdx).toBeGreaterThan(tocIdx)
  })
})

describe('assembleDocument determinism', () => {
  it('produces byte-equal output for two calls with the same input (WRIT-04 lock)', () => {
    const routes = [
      makeRoute('/', 'Home'),
      makeRoute('/faq', 'FAQ'),
      makeRoute('/contact', 'Contact'),
    ]
    const input: DocumentAssemblyInput = {
      config: makeConfig(),
      captured: [makePage(routes[0]), makePage(routes[2])],
      failures: [makeFailure(routes[1], 'Cloudflare bot interstitial detected on /faq')],
      routes,
      capturedAt: FIXED_CAPTURED_AT,
      toolVersion: FIXED_TOOL_VERSION,
      siteVersionSha: FIXED_SITE_SHA,
    }
    const first = assembleDocument(input)
    const second = assembleDocument(input)
    expect(first).toBe(second)
  })

  it('produces byte-equal output for a rich multi-route fixture with varied metadata', () => {
    const home = makeRoute('/', 'Home')
    const faq = makeRoute('/faq', 'FAQ')
    const exhibitA = makeRoute('/exhibits/exhibit-a', 'Exhibit A', 'exhibit')
    const contact = makeRoute('/contact', 'Contact')
    const routes = [home, faq, exhibitA, contact]
    const input: DocumentAssemblyInput = {
      config: makeConfig({ baseUrl: 'https://pattern158.solutions', mirror: true }),
      captured: [
        makePage(home, { markdown: '### Home\n\nrich **bold** body.\n\n- list item' }),
        makePage(exhibitA, {
          markdown: '### Exhibit A\n\n> quoted claim\n\nevidence paragraph.',
          cfCacheStatus: 'MISS',
        }),
        makePage(contact, {
          markdown: '### Contact\n\nemail: hi@example.com',
          description: '',
          cfCacheStatus: undefined,
        }),
      ],
      failures: [
        {
          route: faq,
          error: new Error('Cloudflare bot interstitial detected on /faq — retry with --headful'),
          httpStatus: 403,
        },
      ],
      routes,
      capturedAt: FIXED_CAPTURED_AT,
      toolVersion: FIXED_TOOL_VERSION,
      siteVersionSha: FIXED_SITE_SHA,
    }
    const first = assembleDocument(input)
    const second = assembleDocument(input)
    expect(first).toBe(second)
    // Sanity: the rich fixture exercises every observable path.
    expect(first).toContain('## Route: /')
    expect(first).toContain('## Route: /faq')
    expect(first).toContain('## Route: /exhibits/exhibit-a')
    expect(first).toContain('## Route: /contact')
    expect(first).toContain('> **Capture failed:**')
    expect(first).toContain('> **Status:** 403')
    expect(first).toContain('> **CF Cache:** MISS')
    // Contact's description was '' → omitted.
    const contactHeadingIdx = first.indexOf('## Route: /contact')
    const contactSection = first.slice(contactHeadingIdx)
    expect(contactSection.indexOf('Description:')).toBe(-1)
  })
})
