// scripts/editorial/routes.ts
// Phase 47 contract — real implementation in Plan 47-03 (buildRoutes body).
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

export function buildRoutes(): readonly Route[] {
  throw new Error('buildRoutes: not implemented until Phase 47 Plan 03 (CAPT-01)')
}
