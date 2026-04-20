// scripts/editorial/routes.ts
// Phase 47 — deterministic ordered route list builder (CAPT-01, CAPT-02).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

export interface Route {
  readonly path: string
  readonly label: string
  readonly category: 'static' | 'exhibit'
  readonly sourceSlug?: string
}

/**
 * The 7 hardcoded static routes, in the exact order they must appear in the
 * captured Markdown document (per ROADMAP Phase 47 success criterion 3).
 */
export const STATIC_ROUTES: readonly Route[] = [
  { path: '/', label: 'Home', category: 'static' },
  { path: '/philosophy', label: 'Philosophy', category: 'static' },
  { path: '/technologies', label: 'Technologies', category: 'static' },
  { path: '/case-files', label: 'Case Files', category: 'static' },
  { path: '/faq', label: 'FAQ', category: 'static' },
  { path: '/contact', label: 'Contact', category: 'static' },
  { path: '/accessibility', label: 'Accessibility', category: 'static' },
]

/**
 * Path prefixes that are NEVER captured (CAPT-02). The match semantics are:
 * a path P is excluded iff there exists a prefix E in EXCLUDED_PREFIXES such
 * that P === E OR P.startsWith(E + '/'). This prevents '/diagnostics' from
 * matching '/diag' (substring would; segment-aware prefix does not).
 */
export const EXCLUDED_PREFIXES: readonly string[] = [
  '/review',
  '/diag',
  '/portfolio',
  '/testimonials',
]

export function isExcluded(routePath: string): boolean {
  for (const prefix of EXCLUDED_PREFIXES) {
    if (routePath === prefix || routePath.startsWith(prefix + '/')) {
      return true
    }
  }
  return false
}

export function buildRoutes(_exhibitsJsonPath: string): Promise<readonly Route[]> {
  throw new Error('buildRoutes: not implemented until Phase 47 Plan 03 Task 2 (CAPT-01)')
}
