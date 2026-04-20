// scripts/editorial/config.ts
// Phase 46 placeholder — real implementation lands in Phase 47 (WRIT-01, WRIT-02).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

export interface EditorialConfig {
  readonly outputPath: string
  readonly baseUrl: string
  readonly headful: boolean
  readonly mirror: boolean
}

export function loadEditorialConfig(): EditorialConfig {
  throw new Error('loadEditorialConfig: not implemented until Phase 47 (WRIT-01)')
}
