# Requirements: Pattern 158

**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

This file tracks requirements across milestones. Active milestone is at the top; shipped milestones below for history.

---

# v9.0 Continue tiddlywiki intake and conversion

**Milestone:** v9.0
**Defined:** 2026-04-21

## v9.0 Scope

Turn `pattern158.solutions` into a tzk-style living TiddlyWiki with **canonical-source-is-the-live-site** architecture: structured DOM extractors feed atomic tiddlers (personnel, findings, technologies) into a Pattern-158-branded wiki with tzk-inspired private/public publishing workflow.

**Locked decisions** (2026-04-21 smart-discuss):
- **Canonical source = live pattern158.solutions** via Playwright DOM + screenshots. NOT the project's JSON files, NOT the Obsidian vault, NOT email archive.
- **Atomic decomposition:** personnel + findings + technologies all get per-entity tiddlers.
- **Ambition:** tzk-style living wiki (private/public split, build pipeline, git workflow, Pattern 158 theme).
- **Iter 1 output preserved:** `scripts/tiddlywiki/generate.ts` keeps working through the milestone — refactor, don't rewrite. JSON-source path becomes fallback; DOM extraction is the new primary path.

## v9.0 Requirements

Requirements grouped by category. Each maps to one roadmap phase.

### DOM Extraction

Structured parsers over captured HTML. Foundation for everything else.

- [x] **EXTR-01
**: `scripts/tiddlywiki/extractors/faq.ts` parses `.faq-accordion-item` DOM from captured FAQ page — emits `FaqItem[]` with question, answer, categories, id. Fallback to `src/data/json/faq.json` if live capture is stale.
- [x] **EXTR-02
**: `scripts/tiddlywiki/extractors/exhibit.ts` parses exhibit detail page DOM — emits structured `Exhibit` with label, client, date, title, exhibitType, context, sections (with nested subsections), impactTags, summary, role, emailCount.
- [x] **EXTR-03
**: `scripts/tiddlywiki/extractors/personnel.ts` parses personnel tables/cards on exhibit pages — emits `PersonnelEntry[]` with name, title, role, organization, entryType (individual / group / anonymized) + source-exhibit back-reference.
- [x] **EXTR-04
**: `scripts/tiddlywiki/extractors/findings.ts` parses findings sections on exhibit pages — emits `FindingEntry[]` with finding, description, resolution, outcome, category, severity + source-exhibit back-reference.
- [x] **EXTR-05
**: `scripts/tiddlywiki/extractors/technologies.ts` parses technology sections — emits `TechnologyEntry[]` with name, context, aggregated exhibit cross-references.
- [x] **EXTR-06
**: `scripts/tiddlywiki/extractors/testimonials.ts` parses blockquote + attribution across all pages — emits `Testimonial[]` with text, attribution, role, source-page back-reference.
- [x] **EXTR-07
**: `scripts/tiddlywiki/extractors/pages.ts` parses main content for non-exhibit pages (Home, Philosophy, Technologies index, Contact, Accessibility) — emits `PageContent[]` with title, heading hierarchy, body segments preserving semantic structure.
- [ ] **EXTR-08**: `scripts/tiddlywiki/extractors/case-files-index.ts` parses the Case Files index page — emits `CaseFilesIndex` with exhibit list in source-page order (for wiki index-tiddler generation).

### Atomic Tiddler Generation

Decompose extracted data into per-entity tiddlers with cross-linking.

- [ ] **ATOM-01**: Per-person tiddlers emitted with title `{Name}` (or `{Role} @ {Organization}` for anonymized), tags `person`, `[[{Client}]]`, `entry-type-{individual|group|anonymized}`; back-references list all exhibits the person appears in.
- [ ] **ATOM-02**: Per-finding tiddlers emitted with title `{Exhibit Label} Finding: {truncated finding}`, tags `finding`, `severity-{level}`, `category-{slug}`, `[[{Exhibit Label}]]`; body contains finding + description + resolution + outcome.
- [ ] **ATOM-03**: Per-technology tiddlers emitted with title `Tech: {Name}`, tags `technology`; body aggregates exhibit back-references with per-exhibit context blurbs.
- [ ] **ATOM-04**: Per-testimonial tiddlers emitted with title `Testimonial: {Attribution truncated}`, tags `testimonial`, `[[{Source Page or Exhibit}]]`; body contains quote + attribution + role.
- [ ] **ATOM-05**: Cross-link graph integrity — exhibit tiddlers list Personnel / Findings / Technologies / Testimonials as `[[...]]` wikitext links; every link resolves to an existing tiddler; integrity check runs as part of generate script.

### Wiki Theme (Pattern 158 brand)

- [ ] **THEME-01**: Color tokens matching Vue site — Pattern 158 brand palette (primary, accent, background, foreground) applied to TW CSS variables with dark/light theme support parity.
- [ ] **THEME-02**: Typography matching Pattern 158 — heading font family, body font family, sizes, line-heights aligned with Vue site's design tokens.
- [ ] **THEME-03**: Layout customization — sidebar navigation structure (Pages / Case Files / Index / Tags), topbar branding, tiddler chrome matching Pattern 158 visual hierarchy.
- [ ] **THEME-04**: Tiddler view customization — exhibit tiddlers use a special layout (metadata header + sections + cross-links footer); person tiddlers use compact bio layout; finding tiddlers use severity-colored header.
- [ ] **THEME-05**: Badge/pill styling passthrough — TW CSS mirrors Vue site's `.badge`/`.pill`/`.tag-*`/`.severity-*`/`.category-*` styles so wikitext `**bold**`-to-bold mapping + raw HTML badge spans render visually consistent.

### Tzk-Style Structure

Private/public split, build pipeline, git-backed workflow — inspired by `sobjornstad/tzk`.

- [ ] **TZK-01**: Tiddlers tagged `public` by default; `private` tag available for drafts/notes. Tag-based filter controls which tiddlers appear in the deployed wiki.
- [ ] **TZK-02**: Build pipeline — `pnpm tiddlywiki:build-public` runs `tiddlywiki` with filter `[!tag[private]]` to produce `./tiddlywiki/output/index.html` containing only public tiddlers. `pnpm tiddlywiki:build-all` builds full wiki for local authoring.
- [ ] **TZK-03**: Git-backed workflow — regeneration script (`pnpm tiddlywiki:generate`) re-reads captured HTML + emits fresh tiddlers to `./tiddlywiki/tiddlers/`; git diff surfaces what changed since last capture. Source-of-truth is git; tiddler files are committable.
- [ ] **TZK-04**: Deploy-ready public wiki — `tiddlywiki/output/index.html` includes only public tiddlers, Pattern 158 theme, no draft/private content, suitable to publish at `pattern158.solutions/wiki/` or similar subpath.
- [ ] **TZK-05**: Tzk-inspired directory structure — `./tiddlywiki/` gets `tiddlers/` (canonical source), `output/` (build artifacts, gitignored), `config/` (theme CSS, site-meta tiddlers), `build/` (build scripts), `README.md` (workflow doc).

### Iter-1 Fixes

Rough edges from the v9.0 starter tiddlywiki generator.

- [ ] **FIX-01**: Empty exhibit sections render correctly — `exhibitsToTiddlers` walks subsections fully, emits their text even when headings are present; no more empty `!! Background` / `!! Personnel` / `!! Sequence of Events` headings.
- [ ] **FIX-02**: Page body conversion quality improved — Home, Philosophy, Technologies pages produce clean wikitext (not HTML-heavy) via the DOM extractor pipeline (replaces the iter-1 HTML→wikitext converter path for pages).
- [ ] **FIX-03**: FAQ "See also" footer enriched — per-FAQ tiddler's footer lists sibling FAQs in the same category + any linked exhibit callouts, not just the generic `[[FAQ Index]]` stub.
- [ ] **FIX-04**: Case Files Index improvements — renders with tiddler title as filterable-searchable table (sortable by date, client, type) rather than simple bulleted list.

### Tests

- [ ] **TEST-01**: Extractor unit tests — inline HTML fixtures per extractor, assertions on structured output shapes; coverage for edge cases (missing fields, empty sections, malformed DOM).
- [ ] **TEST-02**: Generator unit tests — per-tiddler-type: tiddler shape, tag lists, field completeness, cross-link integrity for atomic types.
- [ ] **TEST-03**: End-to-end smoke test — run `pnpm editorial:capture` against a static fixture site (local http-server + fixture HTML), then `pnpm tiddlywiki:generate`, assert expected tiddler count + key tiddler presence.
- [ ] **TEST-04**: Cross-link integrity test — iterate every tiddler body, parse all `[[...]]` wikitext links, verify target tiddler exists; failing tests list orphaned links.

### Documentation

- [ ] **DOC-01**: `scripts/tiddlywiki/README.md` — overview, DOM extractor architecture, tiddler-types diagram, commands, troubleshooting.
- [ ] **DOC-02**: Tzk workflow doc — private-vs-public workflow, deploy steps, git cadence, tag taxonomy, how to iterate.
- [ ] **DOC-03**: Contributor/editing guide — how to edit tiddlers directly in TW vs. regenerate from source, merge-conflict resolution on tiddler files, when to re-capture vs. when to edit in place.

## v9.0 Traceability

Roadmap created 2026-04-21 (see `.planning/ROADMAP.md` Phase 53–59). Each REQ maps to exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| EXTR-01 | Phase 53 (DOM Extraction) | Pending |
| EXTR-02 | Phase 53 (DOM Extraction) | Pending |
| EXTR-03 | Phase 53 (DOM Extraction) | Pending |
| EXTR-04 | Phase 53 (DOM Extraction) | Pending |
| EXTR-05 | Phase 53 (DOM Extraction) | Pending |
| EXTR-06 | Phase 53 (DOM Extraction) | Pending |
| EXTR-07 | Phase 53 (DOM Extraction) | Pending |
| EXTR-08 | Phase 53 (DOM Extraction) | Pending |
| ATOM-01 | Phase 54 (Atomic Tiddler Generation) | Pending |
| ATOM-02 | Phase 54 (Atomic Tiddler Generation) | Pending |
| ATOM-03 | Phase 54 (Atomic Tiddler Generation) | Pending |
| ATOM-04 | Phase 54 (Atomic Tiddler Generation) | Pending |
| ATOM-05 | Phase 54 (Atomic Tiddler Generation) | Pending |
| FIX-01 | Phase 55 (Iter-1 Fixes) | Pending |
| FIX-02 | Phase 55 (Iter-1 Fixes) | Pending |
| FIX-03 | Phase 55 (Iter-1 Fixes) | Pending |
| FIX-04 | Phase 55 (Iter-1 Fixes) | Pending |
| TEST-01 | Phase 56 (Tests) | Pending |
| TEST-02 | Phase 56 (Tests) | Pending |
| TEST-03 | Phase 56 (Tests) | Pending |
| TEST-04 | Phase 56 (Tests) | Pending |
| THEME-01 | Phase 57 (Wiki Theme) | Pending |
| THEME-02 | Phase 57 (Wiki Theme) | Pending |
| THEME-03 | Phase 57 (Wiki Theme) | Pending |
| THEME-04 | Phase 57 (Wiki Theme) | Pending |
| THEME-05 | Phase 57 (Wiki Theme) | Pending |
| TZK-01 | Phase 58 (Tzk-Style Structure) | Pending |
| TZK-02 | Phase 58 (Tzk-Style Structure) | Pending |
| TZK-03 | Phase 58 (Tzk-Style Structure) | Pending |
| TZK-04 | Phase 58 (Tzk-Style Structure) | Pending |
| TZK-05 | Phase 58 (Tzk-Style Structure) | Pending |
| DOC-01 | Phase 59 (Documentation) | Pending |
| DOC-02 | Phase 59 (Documentation) | Pending |
| DOC-03 | Phase 59 (Documentation) | Pending |

**Coverage:** 34 v9.0 requirements, 34 mapped, 0 unmapped ✓
**Counts:** 7 phases — EXTR (8 REQs), ATOM (5), FIX (4), TEST (4), THEME (5), TZK (5), DOC (3).

---

# v8.0 Editorial Snapshot & Content Audit (Shipped 2026-04-20)

**Milestone:** v8.0
**Defined:** 2026-04-19
**Shipped:** 2026-04-20 (tool portion; editorial findings + v9.0 verdict intentionally deferred to human review per `.planning/v8.0-AUDIT-NOTICE.md`)

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

## v8.0 Requirements

Requirements grouped by category. Each maps to one roadmap phase.

### Capture

- [x] **CAPT-01**: `scripts/editorial/routes.ts` builds a deterministic ordered route list — 7 static routes hardcoded + exhibit slugs from `src/data/json/exhibits.json` via `fs.readFile` + `JSON.parse` (not ESM JSON import assert)
- [x] **CAPT-02**: Excluded routes explicitly skipped: `/review`, `/diag/*`, redirect routes (`/portfolio` → `/case-files`, `/testimonials` → `/case-files`), 404 fallback
- [x] **CAPT-03**: `scripts/editorial/capture.ts` launches headless Chromium via `playwright` (not `@playwright/test`); `--headful` flag available for Cloudflare interstitial fallback
- [x] **CAPT-04**: Per-route page-ready detection via `waitForSelector` on `#main-content` plus content-length sanity floor (reject < 200 bytes as likely interstitial)
- [x] **CAPT-05**: HTTP response status recorded per route; non-200 logged loudly in run summary but capture continues
- [x] **CAPT-06**: Captured content scoped to `<main id="main-content">` only — NavBar, FooterBar, skip-link excluded automatically
- [x] **CAPT-07**: FAQ accordion pre-capture hook: click every `[aria-expanded="false"]` in `.faq-accordion-item` before `innerHTML` extraction; assert captured answer count == `faq.json` length (CRIT-01, P158-01)
- [x] **CAPT-08**: FAQ filter pre-capture hook: click `[data-filter="all"]` before capture; assert rendered question count == `totalCount` (CRIT-02)
- [x] **CAPT-09**: Dynamic-route validation: post-navigation selector assertion (e.g., `.exhibit-detail h1`) rejects silent `NotFoundPage` renders with HTTP 200 (CRIT-04)
- [x] **CAPT-10**: Cloudflare cache-bypass: cache-buster query param + `Cache-Control: no-cache` request header per request; log `cf-cache-status` response header (CRIT-05)
- [x] **CAPT-11**: Bot-interstitial detection: string match on "Just a moment", Cloudflare challenge markup, or response size anomaly → abort with clear error (CRIT-06)
- [x] **CAPT-12**: Fixed 1280×800 viewport, fixed light theme (via prefers-color-scheme override), sequential navigation with 1–2s inter-request delay
- [x] **CAPT-13**: Per-route full-page PNG screenshots captured alongside markdown; saved to `<vault>/career/website/site-editorial-capture/screenshots/` (subdirectory)
- [x] **CAPT-14**: Console-error capture per route, aggregated into run log
- [x] **CAPT-15**: SEO meta captured per route (title, description) recorded in per-page metadata blocks

### Conversion

- [x] **CONV-01**: `scripts/editorial/convert.ts` uses Turndown 7.2.4 with `@joplin/turndown-plugin-gfm` full plugin (tables, task lists, strikethrough)
- [x] **CONV-02**: Pre-conversion DOM sanitization strips `<script>`, `<style>`, `<noscript>`, elements with `aria-hidden="true"`, and all `data-v-*` Vue SFC attributes (CRIT-07)
- [x] **CONV-03**: Image handling: alt-text only output (not inline base64, not image references)
- [x] **CONV-04**: Heading-demotion rule: page H1 → H3 (shift all headings down by 2), because each route gets a `## Route: /path` wrapper heading
- [x] **CONV-05**: Badge/pill inline spans pass through as Markdown (e.g., category tags, severity badges); preserve as bold or italic rather than dropping
- [x] **CONV-06**: DOM-order reading preservation — no reordering; Turndown walks DOM in document order
- [x] **CONV-07**: Link hrefs preserved verbatim (no internal-link rewriting for v1 — deferred)
- [x] **CONV-08**: Blank-line collapse: 3+ consecutive blank lines reduced to 2 in final output
- [x] **CONV-09**: Unit tests with inline HTML fixtures covering: plain prose, GFM table, nested list, badge span, image with alt, heading hierarchy, aria-hidden strip

### Document shape

- [x] **SHAP-01**: Single monolithic Markdown file (not per-page splits)
- [x] **SHAP-02**: Top-level frontmatter with provenance: `captured_at` (ISO 8601 UTC, deterministic from run start), `source_url`, `site_version_sha` (from `<meta name="git-sha">` or `/version.json` if present), `tool_version` (pnpm script + git SHA)
- [x] **SHAP-03**: Per-route sections use `## Route: /path` heading; page original H1 demoted to H3
- [x] **SHAP-04**: Auto-generated ToC at top, one entry per route, using `github-slugger` for anchor IDs (reuse existing devDep)
- [x] **SHAP-05**: Per-page metadata block: captured-at, HTTP status, title, description (inline after route heading)
- [x] **SHAP-06**: `---` horizontal-rule separator between captured routes
- [x] **SHAP-07**: Route ordering: home → philosophy → technologies → case-files → faq → contact → accessibility → exhibits A–O (exhibits.json order)

### Write + Output

- [x] **WRIT-01**: `scripts/editorial/config.ts` parses CLI args (`--output <path>`, `--base-url <url>`, `--headful`) + env fallbacks (`EDITORIAL_OUT_PATH`, `EDITORIAL_BASE_URL`); fails loud with help text if required config missing
- [x] **WRIT-02**: Preflight path validation runs BEFORE browser launch: absolute path, parent dir exists, parent dir writable — fail fast on `ENOENT`/`EACCES`
- [x] **WRIT-03**: `scripts/editorial/write.ts` writes via atomic temp-file + rename to handle Obsidian file-lock races; UTF-8 encoding explicit, `\n` line endings only
- [x] **WRIT-04**: Idempotent overwrite (no timestamped versioning); re-running replaces prior capture cleanly
- [x] **WRIT-05**: Optional dual-write mirror to `.planning/research/site-editorial-capture.md` for repo-scoped review (CLI flag: `--mirror`)
- [x] **WRIT-06**: Stdout run summary: N routes captured, M failed, total size, output path, elapsed time; exit code 0 only on all routes ≥200 bytes
- [x] **WRIT-07**: Per-route failure logged with route, error, response status; capture continues for remaining routes

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
- [x] **EDIT-05**: Findings doc scaffold template auto-created by capture tool run (empty sections ready to fill) if not already present

### Milestone audit + v9.0 direction

- [x] **AUDT-01**: Decision-record artifact at `.planning/v8.0-AUDIT-NOTICE.md` (mirroring `v7.0-ABORT-NOTICE.md` structure)
- [ ] **AUDT-02**: Audit documents: context from findings, options considered for v9.0, verdict with rationale, retained work, Rosetta Stone alignment check, next actions
- [ ] **AUDT-03**: Explicit go/no-go per candidate v9.0 direction: static HTML rebuild, content rewrite in Vue, framework rebuild, other
- [ ] **AUDT-04**: PROJECT.md, MILESTONES.md, ROADMAP.md updated to reflect v8.0 completion and v9.0 scope
- [x] **AUDT-05**: Retrospective entry added to `.planning/RETROSPECTIVE.md` with lessons learned

## Future Requirements (deferred from v8.0)

- **CONV-INTL**: Internal-link rewriting (V13) — convert route hrefs to in-doc anchors. Moderate complexity; deferred from v1.
- **CAPT-DARK**: Dark-theme capture variant alongside light — only if editorial review surfaces theme-specific issues.
- **WRIT-TIMESTAMP**: Timestamped version history (`site-editorial-capture-2026-04-19.md`) — deferred; idempotent overwrite is simpler.

## Out of Scope

Explicit exclusions with reasoning.

### v9.0 Out of Scope

- **Career vault / Obsidian intake** — canonical source is the live site only; vault content is editorial reference, not canonical.
- **Email archive intake** — archive content is separate editorial surface; out of scope for this milestone.
- **External content import** — no third-party sources. What's on `pattern158.solutions` is what goes in the wiki.
- **TW plugin authoring** — use stock TW5 + tzk-inspired patterns. No custom TW plugin development.
- **Auth / multi-user editing** — single-author wiki. If collaboration is ever needed, re-evaluate.

### v8.0 Out of Scope

| Feature | Reason |
|---------|--------|
| Readability.js content extraction | Site has stable `<main>` landmark; heuristic adds complexity without value. |
| Multi-file output | Fragments editorial flow; decided by milestone framing. |
| In-tool Markdown diff | Use Obsidian or `git diff` for run-to-run comparison; don't bloat the capture tool. |
| JSON run-report sidecar | Stdout summary is sufficient; JSON bloats output with no editorial consumer. |
| Network trace log | Console errors are enough; full HAR is debug-mode territory. |
| Retry/backoff | One-shot capture; if it fails, re-run the whole thing. |
| Auth/session handling | Site is public. |
| Automated copy linter | Editorial judgment is human; tool just captures. |
| NotFoundPage capture | 404 is explicitly detected and skipped, not captured. |

## v8.0 Traceability

Every v8.0 REQ-ID maps to exactly one phase in `.planning/ROADMAP.md`. 56/56 requirements shipped or deferred per plan.

| Phase | REQ-IDs | Count |
|-------|---------|-------|
| Phase 46 — Scaffold | SCAF-01, SCAF-02, SCAF-03, SCAF-04, SCAF-05, SCAF-06, SCAF-07, SCAF-08 | 8 |
| Phase 47 — Config + Routes (pure logic) | CAPT-01, CAPT-02, WRIT-01, WRIT-02 | 4 |
| Phase 48 — Capture (Playwright IO) | CAPT-03..15 | 13 |
| Phase 49 — Convert (Turndown) | CONV-01..09 | 9 |
| Phase 50 — Write + Preflight + Orchestration | SHAP-01..07, WRIT-03..07 | 12 |
| Phase 51 — Editorial Review (manual) | EDIT-01..05 | 5 |
| Phase 52 — Milestone Audit + v9.0 Direction | AUDT-01..05 | 5 |
| **Total** | | **56** |

## Decision Lineage

- v7.0 aborted 2026-04-19 (see `.planning/v7.0-ABORT-NOTICE.md`) — source-module extraction wrong tool for editorial need
- v8.0 scope defined 2026-04-19 via `/gsd-new-milestone` with 4-parallel-researcher pass
- v8.0 research outputs: `.planning/research/STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, `PITFALLS.md`, `SUMMARY.md`
- v8.0 user-locked decisions 2026-04-19: heading demotion, screenshots included, /review excluded, tool committed to main
- v8.0 roadmap (7 phases, 46–52, strict sequential) created 2026-04-19, shipped 2026-04-20
- **v9.0 scope defined 2026-04-21** via `/gsd:new-milestone "Continue tiddlywiki intake and conversion"` — canonical-source-is-live-site reframe + atomic decomposition + tzk-style ambition (skipped research; iter-1 experience sufficient foundation)
