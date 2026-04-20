// scripts/editorial/capture.ts
// Phase 46 placeholder — real implementation lands in Phase 48 (CAPT-03..15).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of in Phase 48)

import type { EditorialConfig } from './config.ts'
import type { Route } from './routes.ts'

export interface CapturedPage {
  readonly route: Route
  readonly httpStatus: number
  readonly mainHtml: string
  readonly title: string
  readonly description: string
  readonly consoleErrors: readonly string[]
}

export function captureRoutes(
  _config: EditorialConfig,
  _routes: readonly Route[],
): Promise<readonly CapturedPage[]> {
  throw new Error('captureRoutes: not implemented until Phase 48 (CAPT-03)')
}
