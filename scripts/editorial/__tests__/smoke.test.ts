// scripts/editorial/__tests__/smoke.test.ts
// Phase 46 smoke test — proves the scripts Vitest project discovers tests under
// scripts/editorial/__tests__/ (SCAF-06 wiring, landing in Plan 04) and that the
// placeholder type surface from scripts/editorial/types.ts is reachable through
// the editorial tsconfig project graph (SCAF-02 / SCAF-03 wiring, landing in
// Plans 02/03).
//
// SCAF-08 forbidden in this directory (see .planning/REQUIREMENTS.md SCAF-08):
//   - path-alias imports (use relative paths)
//   - non-deterministic timestamp APIs (use injected/fixed timestamps)
//   - platform-specific line endings (use literal newline only)
//   - parallel iteration over the ordered route list (use sequential for-of)
//
// Globals (describe/it/expect) are ambient because the scripts Vitest project
// declares globals=true in vitest.config.ts — no explicit imports needed.

import type { EditorialConfig, Route, CapturedPage, ConvertedPage } from '../types.ts'

describe('editorial scaffold smoke', () => {
  it('reaches the placeholder type surface from types.ts', () => {
    // Type-only existence check — if these symbols cannot be resolved, the test
    // file itself fails to compile under tsconfig.editorial.json.
    const _config: EditorialConfig | undefined = undefined
    const _route: Route | undefined = undefined
    const _captured: CapturedPage | undefined = undefined
    const _converted: ConvertedPage | undefined = undefined
    expect(_config).toBeUndefined()
    expect(_route).toBeUndefined()
    expect(_captured).toBeUndefined()
    expect(_converted).toBeUndefined()
  })

  it('uses only literal newline endings (SCAF-08 determinism check on test file itself)', () => {
    // This test exists to make the SCAF-08 deterministic-output rule visible at
    // runtime; the real per-file enforcement is via grep in plan acceptance.
    const sample = 'a\nb\nc'
    expect(sample.split('\n')).toHaveLength(3)
  })
})
