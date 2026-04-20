// scripts/editorial/types.ts
// Shared type + value re-exports for the editorial capture tool.
// Real type bodies live in their producing modules (config.ts, routes.ts, etc.).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

export type { EditorialConfig } from './config.ts'
export type { Route } from './routes.ts'
export type { CapturedPage } from './capture.ts'
export type { ConvertedPage } from './convert.ts'

// ConfigError is re-exported as a runtime value (class), not `export type`,
// so downstream code can use `err instanceof ConfigError` at runtime.
export { ConfigError } from './config.ts'

// CaptureError is re-exported as a runtime value (class) for the same reason —
// Phase 50's index.ts uses `err instanceof CaptureError` at the outermost boundary
// to map capture failures to exit code 1 (vs. ConfigError → exit 2).
export { CaptureError } from './capture.ts'
