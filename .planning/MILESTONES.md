# Milestones

## v8.0 Editorial Snapshot & Content Audit (Shipped: 2026-04-20)

**Phases completed:** 7 phases (46-52), 24 plans, 401 tests

**Key accomplishments:**

- Playwright-based live-site editorial capture tool (`scripts/editorial/`) that drives headless Chromium through production `pattern158.solutions`, scoped to `<main id="main-content">` with Cloudflare cache-bypass, 3-signal bot-interstitial detection, silent-SPA-404 detection, FAQ accordion pre-expansion + filter-all hooks, per-route full-page PNG screenshots, SEO meta + console-error capture
- HTML→Markdown conversion via Turndown 7.2.4 + full `@joplin/turndown-plugin-gfm` plugin with `happy-dom` pre-sanitization (strip `<script>`/`<style>`/`<noscript>`/`[aria-hidden="true"]` subtrees + every `data-v-*` attr), heading demotion (H1→H3), badge/pill class-allowlist rendered as `**bold**`, alt-text-only image rule, blank-line collapse
- Full orchestration in `index.ts` with per-route resilience (drives `capturePage` directly, not the strict `captureRoutes`), atomic `tmp+rename` writes with PID-suffix, optional `.planning/research/` mirror, stdout human summary + stderr JSON for CI
- Monolithic editorial artifact at `<vault>/career/website/site-editorial-capture.md` with YAML frontmatter provenance (`captured_at`, `source_url`, `site_version_sha`, `tool_version`), auto-generated ToC via `github-slugger`, per-route `## Route: /path` heading + blockquote metadata (omit-empty), `---` separators
- Live run against production captures all 22 non-excluded routes in ~42s with zero failures (~186 KB Markdown + 22 screenshots)
- Auto-emitted findings scaffold at `<vault>/career/website/site-editorial-findings.md` (idempotent non-overwriting) to anchor the editorial review phase

**Partial completion:** Editorial findings authorship (EDIT-01..04) and v9.0 direction verdict (AUDT-02/03) are intentionally manual and deferred to Dan's human review — tracked in `.planning/v8.0-AUDIT-NOTICE.md`.

**Milestone notice:** `.planning/v8.0-AUDIT-NOTICE.md`

---

## v7.0 Static Markdown Export Pipeline (ABORTED: 2026-04-19)

**Phases attempted:** 2 shipped (37, 38), 1 planned (39), 6 not started (40-45)
**Plans:** 16/~20 completed across Phases 37-38 before abort
**Abort notice:** `.planning/v7.0-ABORT-NOTICE.md`

**What shipped before abort:**

- Phase 37: Hardcoded prose extracted from 15 Vue files into 14 `src/content/*.ts` modules; SFCs `v-for` over imported arrays; 7 Playwright browser regression tests; thin-loader invariant formalized (SFC-01..07, LOAD-01)
- Phase 38: `scripts/markdown-export/` scaffold with separate tsconfig + Vitest project + pnpm migration; three new devDeps (tsx, yaml, github-slugger); complete IR contract (DocNode + InlineSpan + PageDoc); four context-specific escape helpers with 53 unit tests; frontmatter YAML serializer with canonical key order; nine IR primitive factories; `docs/` collision audit (SCAF-01..03, AUDT-01, IR-01/02, ESCP-01..04, FM-01/02, PRIM-01)

**Why aborted:**

The real need is editorial, not publication. v7.0's source-module extraction approach misses hardcoded component text, data modules rendered into prose, reading-order fidelity, composition decisions, and dynamic exhibit routes. For editorial work, the rendered live site is the highest-fidelity representation. Replaced by v8.0 Playwright-based live-site editorial capture.

**What's retained:** `src/content/*.ts` modules improved the Vue codebase independent of the pipeline. IR primitives in `scripts/markdown-export/` are shipped, tested, and harmless. Phase 39 planning docs retained as design reference.

---

## v6.0 FAQ Page Redesign (Shipped: 2026-04-08)

**Phases completed:** 4 phases, 5 plans, 4 tasks

**Key accomplishments:**

- Accessible FAQ accordion component with WAI-ARIA pattern, category pills, CSS rotate icon, and 13 passing tests
- Category filter bar with pill buttons, radio-style active state, and live aria-live count label

---

## v5.2 Personnel Data Normalization & Card UX (Shipped: 2026-04-08)

**Phases completed:** 2 phases, 3 plans, 6 tasks

**Key accomplishments:**

- Added entryType discriminant to PersonnelEntry type and normalized Exhibit L from unique role/involvement schema to standard name/title/organization schema
- Fixed 26 title-as-name field misplacements across 12 exhibits and added entryType markers to all 66 personnel entries (29 individual, 7 group, 30 anonymized)
- Personnel entryType-driven card variants with group/anonymized styling on mobile cards and desktop tables, heading fallback cascade, dead involvement branch removed

---

## v5.1 Personnel & Technologies Card Layout (Shipped: 2026-04-08)

**Phases completed:** 1 phase, 1 plan

**Key accomplishments:**

- Personnel and technologies sections get mobile card layout matching findings pattern
- `.personnel-table` and `.technologies-table` CSS classes with desktop table headers
- Mobile (≤480px): card view with h3-style headings (name for personnel, category for technologies)

---

## v5.0 Findings Schema Unification (Shipped: 2026-04-08)

**Phases completed:** 4 phases, 4 plans

**Key accomplishments:**

- FindingEntry type unified with 6 optional fields (outcome, category added; background removed)
- 4 exhibits backfilled with NTSB-style diagnostic findings (D, F, H, K) — user-approved content
- All 45 findings enriched with category taxonomy; severity on 6 diagnostic exhibits; resolution on 4
- Layout rendering updated: unified 2-column table, severity/category pills, resolution/outcome text
- Established findings standard: NTSB-style diagnostic discoveries only, not outcomes or observations

---

## v4.0 Exhibit Data Normalization (Shipped: 2026-04-07)

**Phases completed:** 3 phases, 6 plans, 4 tasks

**Key accomplishments:**

- PersonnelEntry type added to Exhibit with 13 exhibits transformed from string[][] table rows to typed personnel arrays
- Both layout components render personnel from typed arrays with field-presence-based variant detection covering all 3 column patterns

---

## v3.0 Data Externalization (Shipped: 2026-04-06)

**Phases completed:** 3 phases, 5 plans, 9 tasks

**Key accomplishments:**

- Centralized src/types/ directory with 6 data interfaces, barrel index, and backward-compatible component type shims
- 5 simple data files migrated to JSON + thin TypeScript loader pattern with zero consumer breakage
- faqItems migrated to JSON with faqCategories preserved as const satisfies in TypeScript for literal type narrowing
- Migrated 1581-line exhibits.ts (15 exhibits, 8 interfaces, discriminated unions) to JSON + thin TypeScript loader, completing v3.0 Data Externalization

---

## v2.1 Case Files Bug Fixes (Shipped: 2026-04-06)

**Phases:** 15-16 | **Plans:** 2 | **Requirements:** 6/6 satisfied
**Git range:** `v2.0`..`a19b3ff` | **Timeline:** 2026-04-02 (1 day)

**Key accomplishments:**

- Restored impact tag pill/badge CSS accidentally deleted in Phase 13 cleanup (CSS-01, CSS-02)
- Added timeline (6), metadata (15), and flow (1) section rendering to both layout components (SECT-01/02/03)
- sectionHasContent() guard suppresses empty sections from DOM output (SECT-04)
- TDD approach: 10 new tests written first, all 64 tests passing
- 13 quick-task bug fixes from GitHub issues (#1, #2, #5, #6, #7)

---

## v2.0 Site IA Restructure — Evidence-Based Portfolio (Shipped: 2026-04-02)

**Phases completed:** 6 phases, 10 plans, 18 tasks

**Key accomplishments:**

- Migrated Exhibit data model to explicit `exhibitType` discriminant replacing boolean flags; merged flagship data into single source of truth
- Split ExhibitDetailPage into thin dispatcher + InvestigationReportLayout and EngineeringBriefLayout components
- Built unified CaseFilesPage with type-grouped exhibits (5 IR + 10 EB), stats bar, and 38-project directory
- Atomic route migration: /case-files replaces /portfolio and /testimonials with redirects, NavBar consolidated
- Retired 7 orphaned files and ~390 lines dead CSS from retired pages
- 54 unit tests passing, all 23 requirements satisfied

---

## v1.1 Exhibit Content Consistency (Shipped: 2026-03-19)

**Phases:** 5-8 | **Plans:** 5 | **Requirements:** 7/7 satisfied
**Git range:** `b2cbe4a` → `63a070d`

**Key accomplishments:**

- Produced complete 15-exhibit audit with 45 Playwright screenshots and structured comparison table classifying all formatting variations as intentional, fixable, or content gap
- Normalized `contextHeading` labels on Exhibits M/N to "Investigation Summary" and standardized quote attribution on Exhibit A (STRUCT-01/03)
- Fixed `investigationReport` badge rendering on ExhibitDetailPage — investigation exhibits now display a visible "Investigation Report" badge (STRUCT-02, Phase 6)
- Fixed `ExhibitCard.vue` CTA text inversion via TDD — "View Full Investigation Report" now correctly maps to `investigationReport: true` (STRUCT-02, Phase 8)
- Produced CONT-01 gap decision list and implemented all approved content additions to Exhibits A, C, D, G (CONT-01/02)

---

## v1.0 MVP (Shipped: 2026-03-18)

**Phases completed:** 4 phases, 14 plans, 0 tasks

**Key accomplishments:**

- (none recorded)

---
