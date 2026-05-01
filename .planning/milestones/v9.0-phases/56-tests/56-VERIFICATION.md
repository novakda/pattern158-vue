---
phase: 56
phase_name: Tests
status: passed
verified_at: 2026-04-21
---

# Phase 56 Verification

## Status: PASSED

Phase 56 (Tests) delivered end-to-end in a single pass. All four REQs (TEST-01 through TEST-04) are covered, with TEST-01/02 relying on the substantial coverage already shipped in Phases 53 and 54 (audited — no gaps found) and TEST-03/04 newly shipped in this phase via a hermetic fixture site, an end-to-end smoke test, and a full-corpus integrity canary.

## Smoke Gates

| Gate | Command | Result |
|------|---------|--------|
| Scripts tests | `pnpm test:scripts --run` | exit 0 — **584 tests / 43 files passed** (up from 577 / 41 at Phase 55 close; +7 tests / +2 files from this phase) |
| Integrity CLI | `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` | exit 0 — 367 tiddlers, 0 orphaned links (unchanged from Phase 55) |

## Requirements Coverage

| REQ ID | Covered By | Status | Evidence |
|--------|-----------|--------|----------|
| TEST-01 (Extractor unit tests) | Phase 53 (shipped) + Phase 56 audit | ✓ Complete | 8 extractor `.test.ts` files, 114 tests covering happy paths, edge cases, missing-field fallbacks, malformed DOM guards, idempotency. Audit in this phase found zero gaps — no additional tests needed. |
| TEST-02 (Generator unit tests) | Phase 54 (shipped) + Phase 56 audit | ✓ Complete | 7 generator `.test.ts` files, 128 tests covering per-tiddler-type shape, tag lists, field completeness, cross-link integrity, determinism. Audit found zero gaps. |
| TEST-03 (Hermetic e2e smoke) | Phase 56 (this phase) | ✓ Complete | `scripts/tiddlywiki/__tests__/e2e.test.ts` (6 tests): fixture-site → extractAll → compose → verifyCrossLinkIntegrity. Full corpus of 27 tiddlers, 0 orphans, byte-identical across runs. No network, no dependency on live `static-site/`. |
| TEST-04 (Cross-link integrity) | Phase 56 (this phase) | ✓ Complete | `scripts/tiddlywiki/__tests__/integrity.test.ts` (1 test): composes the real-site corpus and asserts `orphans.length === 0`. Mirrors `verify-integrity.ts` CLI gate. Resilient to missing `static-site/` (trivial-pass with skip log). |

## Deliverables Shipped

### 1. Fixture site — `scripts/tiddlywiki/__fixtures__/site/`

11 files, 333 lines of HTML + JSON. Minimum content exercising every extractor:

| File | Exercises |
|------|-----------|
| `static-site/index.html` | `emitPageContent` + `emitTestimonials` (testimonial-quote variant on home) |
| `static-site/philosophy.html` | `emitPageContent` with h1 + h2 hierarchy |
| `static-site/technologies.html` | `emitPageContent` |
| `static-site/contact.html` | `emitPageContent` |
| `static-site/accessibility.html` | `emitPageContent` |
| `static-site/faq.html` | `emitFaqItems` — 3 `.faq-accordion-item` entries across 2 categories |
| `static-site/case-files.html` | `emitCaseFilesIndex` — 2 exhibit cards (1 investigation-report + 1 engineering-brief) |
| `static-site/exhibits/exhibit-a.html` | `emitExhibit` + `emitPersonnel` (individual + anonymized rows) + `emitFindings` + `emitTechnologies` (comma-split multi-entry) + `emitTestimonials` (exhibit-quote variant) |
| `static-site/exhibits/exhibit-b.html` | `emitExhibit` + `emitPersonnel` (individual + group rows) + `emitFindings` + `emitTechnologies` (single entry) + `emitTestimonials` |
| `src/data/json/exhibits.json` | Verbose-label form (`"Exhibit A"`) to exercise `normalizeExhibitLabel` path |
| `src/data/json/faq.json` | JSON fallback shape (not needed at runtime since HTML present, but included per spec) |

Pipeline produces 27 tiddlers: 3 site-meta + 5 pages + Case Files Index + 2 exhibit tiddlers + 4 person tiddlers (Alice Alpha, Bob Beta, Fixture Review Committee, Technical Liaison @ Fixture Client Alpha) + 2 finding tiddlers + 3 technology tiddlers (Tech: TypeScript / Node.js / Vitest — merged across exhibits) + 3 testimonial tiddlers + FAQ Index + 3 FAQs.

### 2. E2E smoke test — `scripts/tiddlywiki/__tests__/e2e.test.ts`

176 lines, 6 tests:

1. `bundle exposes non-empty counts for every extractor category` — asserts 3 faqItems, 2 exhibits, 4 personnel, 2 findings, 4 technologies, 3 testimonials, 5 pages, 2 case-files entries.
2. `bundle.exhibits[*].label is "A"/"B"` — locks `normalizeExhibitLabel` behavior on verbose-label JSON.
3. `produces 27 tiddlers` — locks full corpus size.
4. `key tiddlers present in corpus by title` — spot-checks titles across all 7 tiddler types (site meta, page, index, exhibit, person, finding, technology, FAQ).
5. `verifyCrossLinkIntegrity reports orphans.length === 0` — proves cross-link graph integrity end-to-end on the fixture.
6. `two sequential compose runs yield byte-identical JSON` — determinism gate.

### 3. Integrity test — `scripts/tiddlywiki/__tests__/integrity.test.ts`

162 lines, 1 test. Runs `extractAll(process.cwd())`, composes the full real-site tiddler corpus using the same order as `composeAllTiddlers`, and asserts `verifyCrossLinkIntegrity(tiddlers).orphans.length === 0`. Sanity floor: `tiddlers.length > 50`. On a clean checkout (no `static-site/exhibits/*.html`) the test trivially passes with a stdout skip log — the hermetic e2e.test.ts remains the guaranteed-running canary.

Currently running against the live corpus: **367 tiddlers, 0 orphans**.

### 4. TEST-01 / TEST-02 coverage audit — no gaps found

Audited all 8 extractor and 7 generator test files for happy-path + edge-case + malformed-DOM coverage against REQ acceptance criteria. Every file has:

- Happy-path assertions on primary output shape
- At least one missing-field / empty-input edge case
- At least one malformed-DOM or invalid-input guard (where the extractor throws, e.g. faq, exhibit)
- Byte-identical idempotency assertion

No surgical additions required; existing coverage meets TEST-01 and TEST-02 acceptance criteria.

## Design Notes

### Hermetic test avoids `generate.ts` import

Both `e2e.test.ts` and `integrity.test.ts` inline the composition order from `composeAllTiddlers` rather than importing it from `generate.ts`. Rationale: `generate.ts` invokes `main()` as a module-level side effect, which writes tiddlers to `tiddlywiki/tiddlers/` against `process.cwd()` and logs to stdout at import time — breaking hermeticity and leaking output. The inline replica mirrors the CLI compose order exactly; any future drift in `composeAllTiddlers` would surface here as an orphan or a tiddler-count mismatch. This keeps Phase 56 strictly within scope (no edits to `generate.ts`).

### Fixture vs live dialect

The fixture `exhibits.json` uses verbose labels (`"Exhibit A"`) — matching the live `src/data/json/exhibits.json` convention. This intentionally exercises the `normalizeExhibitLabel` codepath (added in the 55.1-hotfix) and protects against regressions of the "Exhibit Exhibit A" double-prefix orphan class.

### Vitest glob includes `__tests__/`

The existing `vitest.config.ts` `scripts` project glob `scripts/tiddlywiki/**/*.test.ts` already matches files in `__tests__/` subdirectories (recursive `**`). No config change required.

## Phase Boundary Confirmation

All Phase 56 work lives in `scripts/tiddlywiki/__fixtures__/` and `scripts/tiddlywiki/__tests__/`. Zero edits to:

- `scripts/tiddlywiki/extractors/` (locked: Phase 53)
- `scripts/tiddlywiki/generators/` (locked: Phase 54)
- `scripts/tiddlywiki/extract-all.ts`, `sources.ts`, `generate.ts`, `verify-integrity.ts`, `page-content-to-tiddlers.ts`, `tid-writer.ts`, `html-to-wikitext.ts` (locked: Phases 53-55)

## Commits

| Hash | Subject |
|------|---------|
| `08ec50c` | test(56-01): add hermetic fixture site exercising every extractor |
| `8379496` | test(56-02): add hermetic e2e smoke test against fixture site (TEST-03) |
| `54472fc` | test(56-03): add full-corpus integrity test against real static-site (TEST-04) |

## Next Phase

**Phase 56 is CLOSED.**

- [x] TEST-03 hermetic e2e canary passing (6 tests, 27-tiddler fixture corpus, 0 orphans)
- [x] TEST-04 live-corpus integrity canary passing (1 test, 367-tiddler real corpus, 0 orphans)
- [x] TEST-01 + TEST-02 audited — existing Phase 53/54 coverage adequate, no gaps
- [x] Overall `pnpm test:scripts --run` — 584 tests / 43 files / exit 0
- [x] Phase boundary held — zero edits outside `__fixtures__/` and `__tests__/`
- [ ] Next: Phase 57 — Wiki Theme (THEME-01..05)

---

*Phase: 56 (Tests)*
*Verified: 2026-04-21*
*Smoke gates: green*
