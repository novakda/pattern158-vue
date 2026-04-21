# Requirements: Pattern 158 — Editorial Snapshot & Content Audit

**Milestone:** v8.0
**Defined:** 2026-04-19
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v8.0 Scope

Capture the live rendered pattern158.solutions as a single Markdown document for editorial review, produce a findings doc that informs the v9.0 rebuild direction.

**Three-stage lifecycle:** Capture → Editorial review → Milestone audit + v9.0 direction decision.

**Locked decisions** (from research synthesis + user confirmation 2026-04-19):
- Playwright (bumped to 1.59.1) + Turndown 7.2.4 + @joplin/turndown-plugin-gfm 1.0.64
- New `scripts/editorial/` directory, new `tsconfig.editorial.json` project reference
- Vitest `scripts` project extended (no new Vitest project)
- CLI `--output` primary + `EDITORIAL_OUT_PATH` env fallback, fail-loud if neither
- Captures from production `https://pattern158.solutions`, `--base-url` override available
- Output: single monolithic Markdown doc at `<vault>/career/website/site-editorial-capture.md`
- Heading strategy: demote page H1 under `## Route: /path` (shift page headings down 1 level)
- Screenshots: include full-page PNG per route alongside markdown
- `/review`, `/diag/*`, redirect routes excluded from capture
- Tool committed to main (retained like `scripts/markdown-export/`); implementation on feature branch `v8.0/editorial-capture` merging back when validated
- Full `@joplin/turndown-plugin-gfm` plugin (not cherry-picked)
- FAQ accordion pre-expanded + filter set to "All" before capture (CRIT-01/02 mitigation)

## v1 Requirements

Requirements grouped by category. Each maps to one roadmap phase.

### Capture

- [x] **CAPT-01
**: `scripts/editorial/routes.ts` builds a deterministic ordered route list — 7 static routes hardcoded + exhibit slugs from `src/data/json/exhibits.json` via `fs.readFile` + `JSON.parse` (not ESM JSON import assert)
- [x] **CAPT-02
**: Excluded routes explicitly skipped: `/review`, `/diag/*`, redirect routes (`/portfolio` → `/case-files`, `/testimonials` → `/case-files`), 404 fallback
- [x] **CAPT-03
**: `scripts/editorial/capture.ts` launches headless Chromium via `playwright` (not `@playwright/test`); `--headful` flag available for Cloudflare interstitial fallback
- [x] **CAPT-04
**: Per-route page-ready detection via `waitForSelector` on `#main-content` plus content-length sanity floor (reject < 200 bytes as likely interstitial)
- [x] **CAPT-05
**: HTTP response status recorded per route; non-200 logged loudly in run summary but capture continues
- [x] **CAPT-06
**: Captured content scoped to `<main id="main-content">` only — NavBar, FooterBar, skip-link excluded automatically
- [x] **CAPT-07
**: FAQ accordion pre-capture hook: click every `[aria-expanded="false"]` in `.faq-accordion-item` before `innerHTML` extraction; assert captured answer count == `faq.json` length (CRIT-01, P158-01)
- [x] **CAPT-08
**: FAQ filter pre-capture hook: click `[data-filter="all"]` before capture; assert rendered question count == `totalCount` (CRIT-02)
- [x] **CAPT-09
**: Dynamic-route validation: post-navigation selector assertion (e.g., `.exhibit-detail h1`) rejects silent `NotFoundPage` renders with HTTP 200 (CRIT-04)
- [x] **CAPT-10
**: Cloudflare cache-bypass: cache-buster query param + `Cache-Control: no-cache` request header per request; log `cf-cache-status` response header (CRIT-05)
- [x] **CAPT-11
**: Bot-interstitial detection: string match on "Just a moment", Cloudflare challenge markup, or response size anomaly → abort with clear error (CRIT-06)
- [x] **CAPT-12
**: Fixed 1280×800 viewport, fixed light theme (via prefers-color-scheme override), sequential navigation with 1–2s inter-request delay
- [x] **CAPT-13
**: Per-route full-page PNG screenshots captured alongside markdown; saved to `<vault>/career/website/site-editorial-capture/screenshots/` (subdirectory)
- [x] **CAPT-14
**: Console-error capture per route, aggregated into run log
- [x] **CAPT-15
**: SEO meta captured per route (title, description) recorded in per-page metadata blocks

### Conversion

- [x] **CONV-01
**: `scripts/editorial/convert.ts` uses Turndown 7.2.4 with `@joplin/turndown-plugin-gfm` full plugin (tables, task lists, strikethrough)
- [x] **CONV-02
**: Pre-conversion DOM sanitization strips `<script>`, `<style>`, `<noscript>`, elements with `aria-hidden="true"`, and all `data-v-*` Vue SFC attributes (CRIT-07)
- [x] **CONV-03
**: Image handling: alt-text only output (not inline base64, not image references)
- [x] **CONV-04
**: Heading-demotion rule: page H1 → H3 (shift all headings down by 2), because each route gets a `## Route: /path` wrapper heading
- [x] **CONV-05
**: Badge/pill inline spans pass through as Markdown (e.g., category tags, severity badges); preserve as bold or italic rather than dropping
- [x] **CONV-06
**: DOM-order reading preservation — no reordering; Turndown walks DOM in document order
- [x] **CONV-07
**: Link hrefs preserved verbatim (no internal-link rewriting for v1 — deferred)
- [ ] **CONV-08**: Blank-line collapse: 3+ consecutive blank lines reduced to 2 in final output
- [ ] **CONV-09**: Unit tests with inline HTML fixtures covering: plain prose, GFM table, nested list, badge span, image with alt, heading hierarchy, aria-hidden strip

### Document shape

- [ ] **SHAP-01**: Single monolithic Markdown file (not per-page splits)
- [ ] **SHAP-02**: Top-level frontmatter with provenance: `captured_at` (ISO 8601 UTC, deterministic from run start), `source_url`, `site_version_sha` (from `<meta name="git-sha">` or `/version.json` if present), `tool_version` (pnpm script + git SHA)
- [ ] **SHAP-03**: Per-route sections use `## Route: /path` heading; page original H1 demoted to H3
- [ ] **SHAP-04**: Auto-generated ToC at top, one entry per route, using `github-slugger` for anchor IDs (reuse existing devDep)
- [ ] **SHAP-05**: Per-page metadata block: captured-at, HTTP status, title, description (inline after route heading)
- [ ] **SHAP-06**: `---` horizontal-rule separator between captured routes
- [ ] **SHAP-07**: Route ordering: home → philosophy → technologies → case-files → faq → contact → accessibility → exhibits A–O (exhibits.json order)

### Write + Output

- [x] **WRIT-01
**: `scripts/editorial/config.ts` parses CLI args (`--output <path>`, `--base-url <url>`, `--headful`) + env fallbacks (`EDITORIAL_OUT_PATH`, `EDITORIAL_BASE_URL`); fails loud with help text if required config missing
- [x] **WRIT-02
**: Preflight path validation runs BEFORE browser launch: absolute path, parent dir exists, parent dir writable — fail fast on `ENOENT`/`EACCES`
- [ ] **WRIT-03**: `scripts/editorial/write.ts` writes via atomic temp-file + rename to handle Obsidian file-lock races; UTF-8 encoding explicit, `\n` line endings only
- [ ] **WRIT-04**: Idempotent overwrite (no timestamped versioning); re-running replaces prior capture cleanly
- [ ] **WRIT-05**: Optional dual-write mirror to `.planning/research/site-editorial-capture.md` for repo-scoped review (CLI flag: `--mirror`)
- [ ] **WRIT-06**: Stdout run summary: N routes captured, M failed, total size, output path, elapsed time; exit code 0 only on all routes ≥200 bytes
- [ ] **WRIT-07**: Per-route failure logged with route, error, response status; capture continues for remaining routes

### Scaffold + Build integration

- [x] **SCAF-01**: New `scripts/editorial/` directory with flat structure — `index.ts`, `config.ts`, `routes.ts`, `capture.ts`, `convert.ts`, `write.ts`, `types.ts`, `__tests__/`
- [x] **SCAF-02**: New `tsconfig.editorial.json` mirroring `tsconfig.scripts.json` — composite=true, rootDir=., `include: ["scripts/editorial/**/*.ts"]`, `paths: {}`, outDir `.tsbuildinfo-editorial`, `lib: ["ES2022"]` (DOM added only if Phase C needs it)
- [x] **SCAF-03**: Root `tsconfig.json` `references` array extended with `./tsconfig.editorial.json`
- [x] **SCAF-04**: pnpm script `editorial:capture` wired in `package.json`: `tsx scripts/editorial/index.ts`
- [x] **SCAF-05**: Three new devDeps installed: `turndown@^7.2.4`, `@joplin/turndown-plugin-gfm@^1.0.64`, `@types/turndown@^5.0.6`; Playwright bumped to `^1.59.1`
- [x] **SCAF-06**: Existing Vitest `scripts` project `include` array extended to cover `scripts/editorial/**/*.test.ts` (no new Vitest project)
- [x] **SCAF-07**: `.gitignore` entry for `.tsbuildinfo-editorial`
- [x] **SCAF-08**: Forbidden patterns enforced in `scripts/editorial/`: no `@/` aliases, no `Date.now()`/`new Date()` for deterministic output, no `os.EOL`, no `Promise.all` over ordered route capture

### Editorial review (manual phase)

- [ ] **EDIT-01**: Dan reads captured Markdown document in Obsidian; annotates in-place or in separate notes
- [ ] **EDIT-02**: `FINDINGS.md` produced at `<vault>/career/website/site-editorial-findings.md` with structured sections: Inconsistencies / Structural / Copy / Alignment Gaps / Open Questions
- [ ] **EDIT-03**: Findings cross-reference career positioning docs: `career/reference-data/design-philosophy-essay.md`, `career-values-reference.md`, `case-study-gp-accessibility-signoff.md`
- [ ] **EDIT-04**: Each finding prioritized: blocker / should-fix / nice-to-have
- [ ] **EDIT-05**: Findings doc scaffold template auto-created by capture tool run (empty sections ready to fill) if not already present

### Milestone audit + v9.0 direction

- [ ] **AUDT-01**: Decision-record artifact at `.planning/v8.0-AUDIT-NOTICE.md` (mirroring `v7.0-ABORT-NOTICE.md` structure)
- [ ] **AUDT-02**: Audit documents: context from findings, options considered for v9.0, verdict with rationale, retained work, Rosetta Stone alignment check, next actions
- [ ] **AUDT-03**: Explicit go/no-go per candidate v9.0 direction: static HTML rebuild, content rewrite in Vue, framework rebuild, other
- [ ] **AUDT-04**: PROJECT.md, MILESTONES.md, ROADMAP.md updated to reflect v8.0 completion and v9.0 scope
- [ ] **AUDT-05**: Retrospective entry added to `.planning/RETROSPECTIVE.md` with lessons learned

## Future Requirements (deferred)

- **CONV-INTL**: Internal-link rewriting (V13) — convert route hrefs to in-doc anchors. Moderate complexity; deferred from v1.
- **CAPT-DARK**: Dark-theme capture variant alongside light — only if editorial review surfaces theme-specific issues.
- **WRIT-TIMESTAMP**: Timestamped version history (`site-editorial-capture-2026-04-19.md`) — deferred; idempotent overwrite is simpler.

## Out of Scope (explicit exclusions with reasoning)

- **Readability.js content extraction** — site has stable `<main>` landmark; heuristic adds complexity without value.
- **Multi-file output** — fragments editorial flow; decided by milestone framing.
- **In-tool Markdown diff** — use Obsidian or `git diff` for run-to-run comparison; don't bloat the capture tool.
- **JSON run-report sidecar** — stdout summary is sufficient; JSON bloats output with no editorial consumer.
- **Network trace log** — console errors are enough; full HAR is debug-mode territory.
- **Retry/backoff** — one-shot capture; if it fails, re-run the whole thing.
- **Auth/session handling** — site is public.
- **Automated copy linter or inconsistency detection** — editorial judgment is human; tool just captures.
- **NotFoundPage capture** — 404 is explicitly detected and skipped, not captured.

## Traceability

Every REQ-ID maps to exactly one phase in `.planning/ROADMAP.md`. 56/56 requirements mapped.

| Phase | REQ-IDs | Count |
|-------|---------|-------|
| Phase 46 — Scaffold | SCAF-01, SCAF-02, SCAF-03, SCAF-04, SCAF-05, SCAF-06, SCAF-07, SCAF-08 | 8 |
| Phase 47 — Config + Routes (pure logic) | CAPT-01, CAPT-02, WRIT-01, WRIT-02 | 4 |
| Phase 48 — Capture (Playwright IO) | CAPT-03, CAPT-04, CAPT-05, CAPT-06, CAPT-07, CAPT-08, CAPT-09, CAPT-10, CAPT-11, CAPT-12, CAPT-13, CAPT-14, CAPT-15 | 13 |
| Phase 49 — Convert (Turndown) | CONV-01, CONV-02, CONV-03, CONV-04, CONV-05, CONV-06, CONV-07, CONV-08, CONV-09 | 9 |
| Phase 50 — Write + Preflight + Orchestration | SHAP-01, SHAP-02, SHAP-03, SHAP-04, SHAP-05, SHAP-06, SHAP-07, WRIT-03, WRIT-04, WRIT-05, WRIT-06, WRIT-07 | 12 |
| Phase 51 — Editorial Review (manual) | EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05 | 5 |
| Phase 52 — Milestone Audit + v9.0 Direction | AUDT-01, AUDT-02, AUDT-03, AUDT-04, AUDT-05 | 5 |
| **Total** | | **56** |

### Per-REQ-ID lookup

| REQ-ID | Phase |
|--------|-------|
| SCAF-01..08 | Phase 46 |
| CAPT-01 | Phase 47 |
| CAPT-02 | Phase 47 |
| CAPT-03..15 | Phase 48 |
| CONV-01..09 | Phase 49 |
| SHAP-01..07 | Phase 50 |
| WRIT-01 | Phase 47 |
| WRIT-02 | Phase 47 |
| WRIT-03..07 | Phase 50 |
| EDIT-01..05 | Phase 51 |
| AUDT-01..05 | Phase 52 |

## Decision Lineage

- v7.0 aborted 2026-04-19 (see `.planning/v7.0-ABORT-NOTICE.md`) — source-module extraction wrong tool for editorial need
- v8.0 scope defined 2026-04-19 via `/gsd-new-milestone` with 4-parallel-researcher pass
- Research outputs: `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`, `SUMMARY.md`
- User-locked decisions 2026-04-19: heading demotion, screenshots included, /review excluded, tool committed to main
- v8.0 roadmap (7 phases, 46–52, strict sequential) created 2026-04-19
