// scripts/editorial/types.ts
// Phase 46 placeholder — shared type re-exports for the editorial capture tool.
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
