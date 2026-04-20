// scripts/editorial/routes.ts
// Phase 47 — deterministic ordered route list builder (CAPT-01, CAPT-02).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

import * as fs from 'node:fs/promises'

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

interface ExhibitsJsonEntry {
  readonly label: string
  readonly exhibitLink: string
}

function isExhibitsJsonEntry(value: unknown, index: number): asserts value is ExhibitsJsonEntry {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`exhibits.json entry at index ${index} is not an object`)
  }
  const e = value as Record<string, unknown>
  if (typeof e.label !== 'string' || e.label.length === 0) {
    throw new Error(`exhibits.json entry at index ${index} has no string "label" field`)
  }
  if (typeof e.exhibitLink !== 'string' || e.exhibitLink.length === 0) {
    throw new Error(`exhibits.json entry at index ${index} has no string "exhibitLink" field`)
  }
}

const EXHIBIT_LINK_PREFIX = '/exhibits/'

export async function buildRoutes(
  exhibitsJsonPath: string,
): Promise<readonly Route[]> {
  const fileContents = await fs.readFile(exhibitsJsonPath, 'utf8')
  const parsed: unknown = JSON.parse(fileContents)
  if (!Array.isArray(parsed)) {
    throw new Error(
      `exhibits.json must be a JSON array (read from ${exhibitsJsonPath}; got ${typeof parsed})`,
    )
  }
  const exhibitRoutes: Route[] = []
  for (let i = 0; i < parsed.length; i += 1) {
    const entry = parsed[i]
    isExhibitsJsonEntry(entry, i)
    if (!entry.exhibitLink.startsWith(EXHIBIT_LINK_PREFIX)) {
      throw new Error(
        `exhibits.json entry at index ${i} has invalid exhibitLink ` +
        `"${entry.exhibitLink}" (must start with "${EXHIBIT_LINK_PREFIX}")`,
      )
    }
    const sourceSlug = entry.exhibitLink.slice(EXHIBIT_LINK_PREFIX.length)
    exhibitRoutes.push({
      path: entry.exhibitLink,
      label: entry.label,
      category: 'exhibit',
      sourceSlug,
    })
  }
  const allRoutes: Route[] = [...STATIC_ROUTES, ...exhibitRoutes]
  return allRoutes.filter((r) => !isExcluded(r.path))
}
