// scripts/editorial/config.ts
// Phase 47 contract — real implementation in Plan 47-02 (loadEditorialConfig body).
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
  readonly exhibitsJsonPath: string
}

export class ConfigError extends Error {
  public readonly cause?: unknown
  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ConfigError'
    this.cause = cause
  }
}

export function loadEditorialConfig(): EditorialConfig {
  throw new Error('loadEditorialConfig: not implemented until Phase 47 Plan 02 (WRIT-01)')
}
