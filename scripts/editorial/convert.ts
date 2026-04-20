// scripts/editorial/convert.ts
// Phase 46 placeholder — real implementation lands in Phase 49 (CONV-01..09).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)

import type { CapturedPage } from './capture.ts'

export interface ConvertedPage {
  readonly route: CapturedPage['route']
  readonly markdown: string
  readonly httpStatus: number
  readonly title: string
  readonly description: string
}

export function convertCapturedPage(_page: CapturedPage): ConvertedPage {
  throw new Error('convertCapturedPage: not implemented until Phase 49 (CONV-01)')
}
