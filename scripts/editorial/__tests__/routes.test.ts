// scripts/editorial/__tests__/routes.test.ts
// Phase 47 — Vitest suite for routes.ts (STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded, buildRoutes).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient via tsconfig.editorial.json types.

import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'

import {
  STATIC_ROUTES,
  EXCLUDED_PREFIXES,
  isExcluded,
  buildRoutes,
} from '../routes.ts'

describe('STATIC_ROUTES', () => {
  it('contains exactly 7 entries', () => {
    expect(STATIC_ROUTES).toHaveLength(7)
  })

  it('lists routes in the locked CONTEXT.md order', () => {
    expect(STATIC_ROUTES.map((r) => r.path)).toEqual([
      '/',
      '/philosophy',
      '/technologies',
      '/case-files',
      '/faq',
      '/contact',
      '/accessibility',
    ])
  })

  it('uses the locked Title Case labels', () => {
    expect(STATIC_ROUTES.map((r) => r.label)).toEqual([
      'Home',
      'Philosophy',
      'Technologies',
      'Case Files',
      'FAQ',
      'Contact',
      'Accessibility',
    ])
  })

  it("marks every entry with category 'static' and no sourceSlug", () => {
    for (const route of STATIC_ROUTES) {
      expect(route.category).toBe('static')
      expect(route.sourceSlug).toBeUndefined()
    }
  })

  it('begins with the home route at /', () => {
    expect(STATIC_ROUTES[0]).toEqual({ path: '/', label: 'Home', category: 'static' })
  })

  it('ends with the accessibility route', () => {
    expect(STATIC_ROUTES[STATIC_ROUTES.length - 1]).toEqual({
      path: '/accessibility',
      label: 'Accessibility',
      category: 'static',
    })
  })
})

describe('EXCLUDED_PREFIXES', () => {
  it('contains exactly 4 entries', () => {
    expect(EXCLUDED_PREFIXES).toHaveLength(4)
  })

  it('contains the locked exclusion set', () => {
    expect([...EXCLUDED_PREFIXES].sort()).toEqual(
      ['/diag', '/portfolio', '/review', '/testimonials'].sort(),
    )
  })
})

describe('isExcluded', () => {
  it.each([
    ['/review', true],
    ['/diag', true],
    ['/portfolio', true],
    ['/testimonials', true],
  ] as const)('exact-matches excluded prefix %s -> %s', (input, expected) => {
    expect(isExcluded(input)).toBe(expected)
  })

  it.each([
    ['/diag/network', true],
    ['/diag/foo/bar', true],
    ['/diag/v1/health', true],
  ] as const)('matches subpaths under /diag (%s -> %s)', (input, expected) => {
    expect(isExcluded(input)).toBe(expected)
  })

  it.each([
    ['/diagnostics', false],
    ['/reviewx', false],
    ['/portfoliography', false],
    ['/testimonials-archive', false],
  ] as const)('does NOT match substring-but-not-segment paths (%s -> %s)', (input, expected) => {
    expect(isExcluded(input)).toBe(expected)
  })

  it.each([
    ['/', false],
    ['/philosophy', false],
    ['/technologies', false],
    ['/case-files', false],
    ['/faq', false],
    ['/contact', false],
    ['/accessibility', false],
  ] as const)('does NOT exclude any STATIC_ROUTES path (%s -> %s)', (input, expected) => {
    expect(isExcluded(input)).toBe(expected)
  })

  it.each([
    ['/exhibits/exhibit-a', false],
    ['/exhibits/exhibit-o', false],
  ] as const)('does NOT exclude exhibit paths (%s -> %s)', (input, expected) => {
    expect(isExcluded(input)).toBe(expected)
  })

  it('returns false for the empty string', () => {
    expect(isExcluded('')).toBe(false)
  })
})

describe('buildRoutes', () => {
  let tmpRoot: string

  beforeEach(async () => {
    tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'p47-routes-test-'))
  })

  afterEach(async () => {
    await fs.rm(tmpRoot, { recursive: true, force: true })
  })

  async function writeExhibitsFixture(entries: unknown): Promise<string> {
    const fixturePath = path.join(tmpRoot, 'exhibits.json')
    await fs.writeFile(fixturePath, JSON.stringify(entries), 'utf8')
    return fixturePath
  }

  async function writeRawFixture(content: string): Promise<string> {
    const fixturePath = path.join(tmpRoot, 'exhibits.json')
    await fs.writeFile(fixturePath, content, 'utf8')
    return fixturePath
  }

  it('returns 7 static + N exhibit routes (10 total for a 3-entry fixture)', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
      { label: 'Exhibit B', exhibitLink: '/exhibits/exhibit-b' },
      { label: 'Exhibit C', exhibitLink: '/exhibits/exhibit-c' },
    ])
    const routes = await buildRoutes(fixturePath)
    expect(routes).toHaveLength(10)
  })

  it('appends exhibits AFTER the 7 static routes in source order', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
      { label: 'Exhibit B', exhibitLink: '/exhibits/exhibit-b' },
      { label: 'Exhibit C', exhibitLink: '/exhibits/exhibit-c' },
    ])
    const routes = await buildRoutes(fixturePath)
    // First 7 are static (path equality is sufficient — Plan 03 spreads STATIC_ROUTES).
    expect(routes.slice(0, 7).map((r) => r.path)).toEqual(
      STATIC_ROUTES.map((r) => r.path),
    )
    // Routes 8-10 are exhibits in source order.
    expect(routes.slice(7).map((r) => r.path)).toEqual([
      '/exhibits/exhibit-a',
      '/exhibits/exhibit-b',
      '/exhibits/exhibit-c',
    ])
  })

  it('preserves exhibit source order even when input is not alphabetical', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit B', exhibitLink: '/exhibits/exhibit-b' },
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
      { label: 'Exhibit C', exhibitLink: '/exhibits/exhibit-c' },
    ])
    const routes = await buildRoutes(fixturePath)
    expect(routes.slice(7).map((r) => r.label)).toEqual([
      'Exhibit B',
      'Exhibit A',
      'Exhibit C',
    ])
  })

  it("derives sourceSlug by stripping the '/exhibits/' prefix from exhibitLink", async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
      { label: 'Exhibit M', exhibitLink: '/exhibits/exhibit-m' },
    ])
    const routes = await buildRoutes(fixturePath)
    expect(routes[7].sourceSlug).toBe('exhibit-a')
    expect(routes[8].sourceSlug).toBe('exhibit-m')
  })

  it("marks exhibit routes with category 'exhibit' (and static routes with category 'static')", async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
    ])
    const routes = await buildRoutes(fixturePath)
    for (const r of routes.slice(0, 7)) expect(r.category).toBe('static')
    for (const r of routes.slice(7)) expect(r.category).toBe('exhibit')
  })

  it('returns only the 7 static routes for an empty exhibits array', async () => {
    const fixturePath = await writeExhibitsFixture([])
    const routes = await buildRoutes(fixturePath)
    expect(routes).toHaveLength(7)
    expect(routes.map((r) => r.path)).toEqual(STATIC_ROUTES.map((r) => r.path))
  })

  it('static routes in the result have sourceSlug undefined; exhibit routes have non-empty sourceSlug', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
    ])
    const routes = await buildRoutes(fixturePath)
    for (const r of routes.slice(0, 7)) expect(r.sourceSlug).toBeUndefined()
    for (const r of routes.slice(7)) {
      expect(r.sourceSlug).toBeTruthy()
      expect(r.sourceSlug).toBe(r.path.slice('/exhibits/'.length))
    }
  })

  it('result contains no excluded paths (defensive isExcluded filter)', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
      { label: 'Exhibit B', exhibitLink: '/exhibits/exhibit-b' },
    ])
    const routes = await buildRoutes(fixturePath)
    for (const r of routes) {
      expect(isExcluded(r.path)).toBe(false)
    }
  })

  it('rejects with SyntaxError on malformed JSON', async () => {
    const fixturePath = await writeRawFixture('{not valid json')
    await expect(buildRoutes(fixturePath)).rejects.toThrow(SyntaxError)
  })

  it('rejects with Error containing "must be a JSON array" when value is not an array', async () => {
    const fixturePath = await writeRawFixture('{"not": "an array"}')
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/must be a JSON array/)
  })

  it('rejects with Error naming the entry index when label is missing', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A', exhibitLink: '/exhibits/exhibit-a' },
      { exhibitLink: '/exhibits/exhibit-b' }, // missing label
    ])
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/index 1/)
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/label/)
  })

  it('rejects with Error naming the entry index when exhibitLink is missing', async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit A' }, // missing exhibitLink
    ])
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/index 0/)
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/exhibitLink/)
  })

  it("rejects with Error containing 'must start with' when exhibitLink lacks the /exhibits/ prefix", async () => {
    const fixturePath = await writeExhibitsFixture([
      { label: 'Exhibit X', exhibitLink: '/wrong/exhibit-x' },
    ])
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/must start with/)
    await expect(buildRoutes(fixturePath)).rejects.toThrow(/\/wrong\/exhibit-x/)
  })

  it('rejects with ENOENT when the exhibits.json path does not exist', async () => {
    const missingPath = path.join(tmpRoot, 'does-not-exist.json')
    try {
      await buildRoutes(missingPath)
      expect.unreachable('should have thrown')
    } catch (err) {
      expect((err as NodeJS.ErrnoException).code).toBe('ENOENT')
    }
  })
})
