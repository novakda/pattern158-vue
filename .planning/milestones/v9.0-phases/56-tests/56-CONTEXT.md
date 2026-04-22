# Phase 56: Tests - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Add automated test coverage for the complete tiddlywiki pipeline: per-extractor unit tests (TEST-01), per-generator tests (TEST-02), end-to-end smoke (TEST-03), and full-corpus cross-link integrity (TEST-04). Many of these are already in place from Phases 53-55; Phase 56 fills the coverage gaps and adds the e2e smoke test with a local fixture HTTP server.

Out of scope:
- Adding new features (Phase 55 scope).
- Theme / tzk scope (Phases 57-58).

</domain>

<decisions>
## Implementation Decisions

### Coverage Assessment (start-of-phase state)
- **TEST-01 (extractor unit tests):** Already shipped in Phase 53 — 8 extractors × 6-10 tests each = 57 tests. Status: ✅ adequate. No new work.
- **TEST-02 (generator unit tests):** Already shipped in Phase 54 — 67 tests across helpers + 6 generators. Status: ✅ adequate. No new work.
- **TEST-03 (e2e smoke):** NOT YET BUILT. Phase 55 smoke gate runs against real `static-site/` — not hermetic. Phase 56 adds a hermetic fixture-based e2e.
- **TEST-04 (cross-link integrity test):** The `verifyCrossLinkIntegrity` function has unit tests (Phase 54), AND Phase 55's `verify-integrity.ts` CLI runs it against the real corpus. Phase 56 adds a scripted test that runs this against the hermetic fixture corpus so it's part of `pnpm test:scripts`.

### TEST-03 Hermetic E2E Design
- Fixture directory: `scripts/tiddlywiki/__fixtures__/site/` — minimal static HTML site (6 pages: index/philosophy/technologies/contact/accessibility/faq/case-files + 2-3 exhibits).
- Fixture HTML hand-written to be the minimum that exercises every extractor.
- E2E test file: `scripts/tiddlywiki/__tests__/e2e.test.ts`.
- Test steps (no http-server — happy-dom handles file:// URLs):
  1. Build fixture bundle with `extractAll(fixtureRoot)`.
  2. Compose with `composeAllTiddlers(bundle)`.
  3. Run `verifyCrossLinkIntegrity(tiddlers)` — assert `orphans.length === 0`.
  4. Assert expected tiddler count + presence of key titles.
- No real network. Vitest only.

### TEST-04 Cross-Link Integrity Test (already covered, but adding explicit test)
- New test: `scripts/tiddlywiki/__tests__/integrity.test.ts`.
- Runs `extractAll(process.cwd())` against the real `static-site/` (or skips gracefully if `static-site/` doesn't exist), composes full tiddler set, verifies `orphans.length === 0`.
- Acts as a canary: any future refactor that breaks cross-links fails CI via `pnpm test:scripts`.

### TEST-01 / TEST-02 Gap Filling
- Audit existing extractor + generator tests for missing `describe` blocks vs. REQ acceptance criteria. If gaps found, add targeted tests.
- No wholesale rewrites — small surgical additions only.

### Scope Discipline
- Phase 56 does NOT modify any extractor, generator, or iter-1 module under `scripts/tiddlywiki/` outside `__fixtures__/` and `__tests__/`.
- All tests go under `scripts/tiddlywiki/__tests__/` OR alongside existing modules (for gap-fill tests).

</decisions>

<code_context>
## Existing Code Insights

### Test Inventory (as of Phase 55 complete)
- 41 test files / 577 tests passing under `pnpm test:scripts`.
- Extractor tests: `scripts/tiddlywiki/extractors/*.test.ts` × 8.
- Generator tests: `scripts/tiddlywiki/generators/*.test.ts` × 7.
- Wiring tests: `scripts/tiddlywiki/extract-all.test.ts`, `page-content-to-tiddlers.test.ts`, `sources.test.ts`, `verify-integrity.ts`.

### Reusable Assets
- `scripts/tiddlywiki/extract-all.ts:extractAll(projectRoot)` — the e2e pipeline entry point.
- `scripts/tiddlywiki/generate.ts:composeAllTiddlers(input)` — the full composition function.
- `scripts/tiddlywiki/generators/integrity-check.ts:verifyCrossLinkIntegrity(tiddlers)` — the orphan detector.

### Integration Points
- Phase 58 tzk build tests will extend from Phase 56 fixtures.

</code_context>

<specifics>
## Specific Ideas

- 4 plans recommended:
  - Plan 56-01 (Wave 1): Create fixture directory + e2e test. TEST-03.
  - Plan 56-02 (Wave 1, parallel): Add `integrity.test.ts` full-corpus test. TEST-04.
  - Plan 56-03 (Wave 1, parallel): Audit extractor + generator tests, add any missing coverage gaps. TEST-01 + TEST-02.
  - Plan 56-04 (Wave 2): Smoke gate — `pnpm test:scripts` exits 0, write `56-VERIFICATION.md`.

- Fixture directory is permanent (git-tracked, not gitignored).
- Tests should be fast (< 1s total for Phase 56 additions).

</specifics>

<deferred>
## Deferred Ideas

- Visual regression tests of generated wiki — out of scope, not in REQs.
- Snapshot tests for tiddler byte-identity — possibly valuable but not required by TEST-01..04.

</deferred>
