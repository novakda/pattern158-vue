// scripts/editorial/__tests__/routes.test.ts
// Phase 47 — Vitest suite for routes.ts (STATIC_ROUTES, EXCLUDED_PREFIXES, isExcluded, buildRoutes).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient via tsconfig.editorial.json types.

import {
  STATIC_ROUTES,
  EXCLUDED_PREFIXES,
  isExcluded,
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
