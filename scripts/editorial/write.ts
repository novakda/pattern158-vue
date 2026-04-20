// scripts/editorial/write.ts
// Phase 46 placeholder — real implementation lands in Phase 50 (WRIT-03..07, SHAP-*).
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
// Atomic writes use temp+rename only.

import type { ConvertedPage } from './convert.ts'
import type { EditorialConfig } from './config.ts'

export function writeMonolithicMarkdown(
  _config: EditorialConfig,
  _pages: readonly ConvertedPage[],
): Promise<void> {
  throw new Error('writeMonolithicMarkdown: not implemented until Phase 50 (WRIT-03)')
}
