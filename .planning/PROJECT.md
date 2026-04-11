# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

The site now features a unified Case Files evidence section with two distinct exhibit types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts. v1.0–v1.1 completed the 11ty-to-Vue conversion; v2.0 restructured the information architecture to eliminate content redundancy. v3.0 externalized all data to JSON with centralized TypeScript types, decoupling content from code for future CMS readiness. v4.0 normalized recurring exhibit table data (personnel, technologies, findings) into typed first-class arrays, eliminating 31 generic string[][] table sections.

## Core Value

Every page template should be scannable and self-documenting through well-named components that enforce design consistency, reducing cognitive load for both the developer and anyone reviewing the codebase.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Vue 3 + TypeScript + Vite scaffold — existing
- ✓ Client-side routing with Vue Router (9 routes, lazy-loaded) — existing
- ✓ SEO composable (useSeo) with meta/OG/canonical tags — existing
- ✓ Dark/light theme toggle with localStorage persistence and cross-tab sync — existing
- ✓ Responsive NavBar with mobile hamburger menu and keyboard support — existing
- ✓ FooterBar with contact info and links — existing
- ✓ Skip-to-content link and ARIA accessibility patterns — existing
- ✓ Design token system (CSS custom properties for colors, spacing, typography) — existing
- ✓ FOUC prevention via early theme detection script — existing
- ✓ PhilosophyPage fully ported with all content sections — existing
- ✓ TechnologiesPage fully ported with tech categories and proficiency data — existing
- ✓ Storybook 10 setup with stories for all components and pages — existing
- ✓ All 9 pages fully ported with named concept components (COMP-01/02/03/04, PAGE-01-07, A11Y-01, STORY-01) — v1.0
- ✓ ExhibitDetailPage with slug routing, conditional content sections, Storybook stories (PAGE-03/05) — v1.0
- ✓ Complete 15-exhibit audit with classified variations table (AUDIT-01/02) — v1.1
- ✓ Structural normalization: contextHeading labels, investigationReport badge, quote attribution (STRUCT-01/02/03) — v1.1
- ✓ Content gap fill: approved additions to Exhibits A, C, D, G from 11ty source (CONT-01/02) — v1.1
- ✓ Explicit exhibitType discriminant replacing boolean flags, flagship data merged into single source of truth (DATA-01/02/03/04) — v2.0
- ✓ Detail page dispatcher with InvestigationReportLayout and EngineeringBriefLayout components (DTPL-01/02/03/04) — v2.0
- ✓ Unified Case Files page with type-grouped exhibits, stats bar, project directory (LIST-01/02/03/04/05) — v2.0
- ✓ Navigation consolidated: /case-files route, redirects from /portfolio and /testimonials, NavBar updated (NAV-01/02/03/04/05) — v2.0
- ✓ Content cleanup: Three Lenses removed, NarrativeCard deleted, old pages retired, homepage CTAs updated (CLN-01/02/03/04/05) — v2.0
- ✓ Impact tag pill/badge CSS restored after accidental deletion (CSS-01, CSS-02) — v2.1
- ✓ Timeline, metadata, flow section rendering with empty section suppression (SECT-01/02/03/04) — v2.1

- ✓ All 11 data files externalized from TypeScript to JSON with thin loaders (TYPE-01, SMPL-01-05, CPLX-01-04, EXHB-01) — v3.0
- ✓ Centralized type definitions in src/types/ with barrel exports (TYPE-01, TYPE-02) — v3.0
- ✓ Cross-boundary types (Tag, ExpertiseLevel) moved to src/types/ with backward-compatible shims (TYPE-02, TYPE-03) — v3.0
- ✓ Discriminated unions (exhibitType, section type) correctly asserted on JSON import (EXHB-02) — v3.0
- ✓ Zero component file changes — all existing imports resolve unchanged (VALD-03) — v3.0

- ✓ Personnel tables (13 exhibits, 3 column variants) promoted to typed `personnel: PersonnelEntry[]` arrays (PERS-01/02/03) — v4.0
- ✓ Technologies tables (11 exhibits) promoted to typed `technologies: TechnologyEntry[]` arrays (TECH-01/02/03) — v4.0
- ✓ Findings tables (7 exhibits, 3 column variants) promoted to typed `findings: FindingEntry[]` arrays with custom headings (FIND-01/02/03) — v4.0

- ✓ FindingEntry unified schema: finding, description?, resolution?, outcome?, category?, severity? — background removed (SCHM-01/02) — v5.0
- ✓ Findings backfilled for 4 exhibits (D, F, H, K) with NTSB-style diagnostic content (BKFL-01/02/04/05) — v5.0
- ✓ All 45 findings enriched with category, severity (diagnostic exhibits), resolution (where applicable) (ENRH-01/02/03) — v5.0
- ✓ Layout rendering: severity badges, category tags, resolution/outcome text in both detail layouts (LYOT-01/02/03/04) — v5.0

- ✓ Personnel and technologies mobile card layout matching findings pattern (PERS-04/05, TECH-04/05) — v5.1

- ✓ Personnel entries with titles/roles in name field corrected across 12 exhibits (DATA-01) — v5.2
- ✓ Exhibit L personnel normalized from role/involvement to standard name/title/organization schema (DATA-02) — v5.2
- ✓ PersonnelEntry type extended with entryType: 'individual' | 'group' | 'anonymized' (DATA-03) — v5.2
- ✓ All 7 group entries marked with entryType: 'group' (DATA-04) — v5.2
- ✓ All anonymized/unnamed personnel marked with entryType: 'anonymized' (DATA-05) — v5.2

- ✓ Group personnel entries render as compact/muted cards with reduced prominence (CARD-01) — v5.2
- ✓ Anonymized personnel entries render with italic/muted visual distinction (CARD-02) — v5.2
- ✓ Card heading logic uses best available field: name → title → role (CARD-03) — v5.2
- ✓ Desktop table rows reflect entryType distinctions (CARD-04) — v5.2

- ✓ FAQ cross-page audit: all 14 answers compared against 6 site pages, 13 issues identified and classified (AUDIT-01/02) — v5.3
- ✓ FAQ stale references fixed: "portfolio"→"case files", tech listing expanded with React/Python/Power Platform/Claude Code (REFS-01/02) — v5.3
- ✓ FAQ content accuracy: industry list corrected with verified clients, AI/automation updated, accessibility phrasing aligned (ACCY-01-04) — v5.3
- ✓ FAQ overlap resolved: Q2 and Q12 shortened to complementary summaries with cross-references to Contact and Philosophy pages (OVLP-01-03) — v5.3

- ✓ FaqItem type extended with id, categories[], exhibitNote?, exhibitUrl?; 7-category unified taxonomy (DATA-01-05) — v6.0
- ✓ 13 career-vault FAQ questions merged with existing 14, 3 overlaps reconciled, 6 exhibit cross-references (CONT-01-03) — v6.0
- ✓ FaqAccordionItem with WAI-ARIA pattern, multi-open, +/× icon rotation, keyboard accessible (ACRD-01-05) — v6.0
- ✓ FaqFilterBar with category pills, single active filter, live count (FLTR-01-04) — v6.0
- ✓ FaqPage rewritten with accordion, filter bar, exhibit callout blocks, full-width stacked layout (LYOT-01-04) — v6.0

### Active

<!-- Current scope. Building toward these. -->

**v7.0 Static Markdown Export Pipeline — MVP + Quick Wins scope**

**Foundation (prerequisite phase):**
- [x] SFC content extraction: hardcoded prose moved from 15 Vue files (7 pages + 8 delegated components) into 14 `src/content/*.ts` modules, SFCs `v-for` over imported arrays, 7 Playwright browser regression tests per refactored page, 149/149 tests green (SFC-01/02/03/04/05/06/07) — shipped Phase 37
- [x] Thin-loader invariant formalized: `src/data/*.ts` loaders may only import JSON + assert types + re-export; no sort/filter/computed/map/ref/reactive/watch; `as const satisfies` literal registries allowlisted; enforcement test in `src/data/__tests__/loaders.thin.test.ts` (LOAD-01) — shipped Phase 37
- [ ] `scripts/markdown-export/` scaffold with separate `tsconfig.scripts.json` (paths: {}), `tsx` + `yaml` + `github-slugger` devDeps, `build:markdown` npm script (SCAF-01/02/03)
- [ ] `docs/` directory collision audit (Vite outDir, Storybook, Wrangler, Vitest) documented in PLAN (AUDT-01)

**IR + shared primitives:**
- [ ] `DocNode` discriminated union (Heading, Paragraph, List, Table, Blockquote, Link, Image, HR) + `PageDoc` type (IR-01/02)
- [ ] Markdown primitives: `heading()`, `paragraph()`, `list()`, `table()`, `blockquote()`, `link()`, `wikilink()`, `caption()` (PRIM-01)
- [ ] Context-specific escape helpers: `escapeProse`, `escapeTableCell`, `escapeWikilinkTarget`, `escapeCodeBlockContent` with unit tests for pipes, backticks, HTML entities, NBSP, BOM (ESCP-01/02/03/04)
- [ ] Frontmatter serializer with canonical key order, forbidden singular keys (`tag`, `alias`, `cssclass`), wikilink-in-property quoting (FM-01/02)

**Extractors:**
- [ ] `site-map.ts` with 7 static routes + dynamic exhibit children, excludes `/review`, `/diag`, 404 (MAP-01)
- [ ] One extractor per static page: home, philosophy, technologies, case-files, faq, contact, accessibility (EXT-01/02/03/04/05/06/07)
- [ ] `exhibit.ts` extractor handling all 5 section types (text, table, timeline, metadata, flow) + typed personnel/technologies/findings arrays + quotes across all 15 exhibits (EXB-01/02/03)

**Monolithic renderer (`docs/site-content.md`):**
- [ ] Heading-level shifting by nav depth (T3) — full exhibit details inline (MONO-01)
- [ ] Auto-generated ToC at top of monolithic file using `github-slugger` anchors (T4, MONO-02)
- [ ] Internal link rewriting: route strings → anchor links (T5, MONO-03)
- [ ] GFM only, no Obsidian-isms in monolithic output (D6, MONO-04)
- [ ] Generated-file warning banner (HTML comment at top) (D8, MONO-05)
- [ ] Monotonic heading hierarchy verified via `remark-parse` integration test (MONO-06)

**Obsidian vault renderer (`docs/obsidian-vault/`):**
- [ ] Folder structure mirrors menu (T8, VAULT-01)
- [ ] YAML frontmatter: `title`, `aliases`, `tags`, optional `date` — plural keys only (T6, VAULT-02)
- [ ] Flat kebab-case exhibit tags from `exhibitType` + `findings[].category` (T9, VAULT-03)
- [ ] Wikilinks between vault notes with whitelist + uniqueness assertion on basenames (T7, VAULT-04)
- [ ] Aliases for exhibits (label + client) and page title variants (D4, VAULT-05)
- [ ] Exhibit filename format `Exhibit A - Short Title.md` with sanitized reserved chars (T14, VAULT-06)
- [ ] Obsidian callout blocks for exhibit quotes (`> [!quote]`) — graceful GitHub degradation (D3, VAULT-07)
- [ ] FAQ rendered as one note per page with questions as H3 + `^question-id` block anchors (T13, VAULT-08)
- [ ] Images skipped, alt text emitted as italicized captions (T10, VAULT-09)
- [ ] GFM tables for personnel / technologies; finding-per-H4 for findings with pill-style inline tags (T11, VAULT-10)
- [ ] Generated-file warning banner after frontmatter (D8, VAULT-11)
- [ ] All section types rendered (text / table / timeline / metadata / flow) (T15, VAULT-12)
- [ ] Manual Obsidian QA pass — tags visible in tag pane, wikilinks resolve, frontmatter parses (QA-01)

**File writer + orchestration:**
- [ ] Clean wipe of `docs/obsidian-vault/` + idempotent writes, `\n` line endings only (WRIT-01)
- [ ] `scripts/markdown-export/index.ts` orchestrator wires site-map → extractors → renderers → writer (ORCH-01)

**Build integration:**
- [ ] `"build": "vue-tsc -b && vite build && npm run build:markdown"` chain (INTG-01)
- [ ] `docs/**` tracked in git (`.gitignore` audit) + `.gitattributes` entry `docs/** text eol=lf linguist-generated` (INTG-02)
- [ ] **CI drift guard:** `npm run build:markdown && git diff --exit-code docs/` fails PRs with stale artifacts (INTG-03)
- [ ] Two-run determinism test in CI: regenerate twice, diff outputs, assert byte-identical (INTG-04)

**Hard constraints / forbidden list (PLAN.md inheritance):**
- Forbidden: `@/` imports inside `scripts/markdown-export/**`
- Forbidden: `Date.now()`, `new Date()`, `process.hrtime`, `performance.now()` in generator
- Forbidden: `Promise.all` on reads feeding ordered output
- Forbidden: `os.EOL` — always `\n` literals
- Forbidden: manual editing of files under `docs/`
- Forbidden: `postinstall` / `prepare` hooks running the generator
- Forbidden: `assert { type: 'json' }` — use `fs.readFile` + `JSON.parse`
- Forbidden: singular frontmatter keys `tag`, `alias`, `cssclass`
- Forbidden: line wrapping of prose in generated markdown
- Forbidden: mtime/hash-based "skip unchanged" logic
- Forbidden: parsing `.vue` SFCs from the generator

## Current Milestone: v7.0 Static Markdown Export Pipeline

**Goal:** Generate two static markdown artifacts alongside the site build — a single monolithic document mirroring the site tree by heading levels, and an Obsidian-ready vault folder with one markdown page per site page organized to match the menu structure.

**Scope:** MVP + Quick Wins (all table-stakes T1-T15 + D3 callouts + D4 aliases + D6 GFM-only mono + D8 generated banner). Stretch items (D1 MOC, D2 FAQ↔exhibit backlinks, D5 block anchors) deferred to a future milestone if warranted.

**Key scoping decisions (from research synthesis):**
- Content sourcing: **Option B** — refactor SFCs to import prose from `src/content/*.ts`, Phase 1 prerequisite
- Script runtime: **standalone `tsx` script**, NOT a Vite plugin (better iteration speed, testability, isolation)
- Renderer architecture: **two-mode renderer sharing a `DocNode` IR** — divergences (heading shift, frontmatter, link format) live only in renderer branches
- Dependencies: **3 new devDeps only** — `tsx`, `yaml`, `github-slugger`. Reject `unified`/`remark`/`turndown`/`gray-matter`/`ts-node`/`vite-node`
- Tag format: **flat kebab-case** (matches v5.3/v6.0 FAQ taxonomy)
- FAQ granularity: **one note per page, questions as H3 + block anchors** (clean vault, still deep-linkable)
- Monolithic depth: **full exhibit details inline** (~50-100 KB, GitHub handles it, honors 'whole site in one file' promise)
- Imports: **relative only inside `scripts/markdown-export/**`** (`tsx` does not resolve `@/` aliases)
- Testing: **snapshot testing at small granularity** (one representative exhibit + individual primitives) + two-run determinism test
- CI drift guard: `npm run build:markdown && git diff --exit-code docs/` is mandatory

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/runtime data fetching — JSON data layer is CMS-ready but no runtime fetching or backend yet
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Search input for FAQ — category filtering is sufficient for ~27 items; search adds value at 50+

## Current State

**Shipped:** v6.0 (2026-04-08) | **Status:** All milestones through v6.0 complete

All 11 data files externalized to JSON with thin TypeScript loaders in `src/data/`. Type definitions centralized in `src/types/` with barrel exports. Data layer is CMS-ready — content lives in pure JSON, types in TypeScript, and all component imports remain unchanged through backward-compatible loader pattern. Recurring exhibit table data (personnel, technologies, findings) promoted to typed first-class arrays — 31 generic string[][] sections eliminated, 6 one-off tables remain as generic sections. Findings unified across 11 exhibits with NTSB-style diagnostic content, category taxonomy, severity on diagnostic exhibits, and enriched layout rendering. Personnel data normalized: 26 title-as-name entries corrected, Exhibit L schema unified, all 66 entries typed with entryType (individual/group/anonymized). Mobile cards and desktop tables visually distinguish entry types with compact group cards, italic anonymized entries, and heading cascade (name → title → role). 95 unit tests passing, clean production build.

## Context

- The 11ty site is published and live. The Vue version has diverged from 11ty structure intentionally as of v2.0.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Codebase: ~6,700 LOC Vue + TypeScript, 95 unit tests passing, clean production build.
- Known human-verification pending: Storybook router decorator timing (Phase 4), badge visual on dark header (Phase 6), live browser slug resolution, Phase 9 badge colors and CTA text, Phase 11 border accent visual appearance, Phase 12 NavBar visual layout and browser redirect behavior. Non-blocking — all automated tests pass.

## Constraints

- **Tech stack**: Vue 3 Composition API + TypeScript + Vite — already established, no changes
- **Styling**: Existing CSS design token system — components should consume tokens, not introduce new styling approaches
- **Complexity**: Favor clarity over cleverness — extract components for readability, not for abstraction points

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Components for consistency, not just reuse | ADHD-informed: named components reduce cognitive load when scanning templates | ✓ Good — pattern held through all 14 phases |
| No new features in this pass | Clean conversion scope prevents scope creep | ✓ Good — audit found only fixable items, no drift |
| Storybook for all components | Portfolio piece — demonstrates testing/documentation practices | ✓ Good — all components documented |
| CONT-02 user-gated (no content without approval) | Exhibit content is authoritative — Dan must approve each gap fill | ✓ Good — zero unsanctioned content added |
| `useHead(computed(...))` for ExhibitDetailPage SEO | `useSeo()` only accepts plain strings; dynamic title needed per slug | ✓ Good — works correctly |
| `.badge-aware` CSS class for investigation badge | Muted/neutral styling avoids color collision with teal exhibit label on dark header | ✓ Good — visually subordinate to title as intended |
| TDD for ExhibitCard CTA fix (Phase 8) | CTA text inversion was a behavioral bug — tests lock the correct mapping | ✓ Good — RouterLink slot-rendering stub pattern established |
| `exhibitType` discriminant union over boolean flags | Self-documenting type classification; enables type-specific layouts and card styling | ✓ Good — clean dispatch pattern, no boolean ambiguity |
| Thin dispatcher + layout components | ExhibitDetailPage stays under 40 lines; layouts own their own DOM structure | ✓ Good — easy to add new exhibit types later |
| Vue Router redirect objects for deprecated routes | Clean redirect without components; /portfolio and /testimonials both → /case-files | ✓ Good — zero broken links |
| Border accent reusing badge token values | Visual consistency: gray=IR, teal=EB across cards and detail badges | ✓ Good — cohesive type identity |
| Phase 14 for documentation gap closure | Separated doc cleanup from code work; kept Phase 13 scope pure | ✓ Good — audit gaps closed cleanly |
| TDD for section type rendering (Phase 16) | Template-only bug fix with existing CSS — tests lock rendering contracts before implementation | ✓ Good — 10 new tests, all green on first pass |
| Thin loader pattern for JSON externalization | Each `src/data/*.ts` imports JSON, asserts types, re-exports — preserves all import paths with zero consumer changes | ✓ Good — all 11 files migrated, zero `.vue` files touched |
| Centralized `src/types/` with barrel exports | Single import path for all data types; eliminates scattered type co-location | ✓ Good — 13 type files, clean barrel, cross-boundary types resolved |
| `faqCategories` kept as `as const` in TypeScript | JSON cannot express literal type narrowing; `as const satisfies` preserves compile-time category validation | ✓ Good — faqItems in JSON, categories typed correctly |
| `as Exhibit[]` type assertion for discriminated unions | JSON import widens string literals to `string`; explicit assertion restores discriminated union narrowing | ✓ Good — TypeScript catches type mismatches, all consumers work |
| First-class typed arrays for recurring table data | Personnel (13), technologies (11), findings (7) tables promoted from generic `string[][]` to typed interfaces; one-off tables (6) stay as generic sections | ✓ Good — 31 sections eliminated, typed fields queryable |
| Field-presence variant detection in templates | `v-if="exhibit.findings[0].background !== undefined"` detects column variant at render time instead of storing variant type | ✓ Good — no extra discriminant needed, clean templates |
| `findingsHeading` for non-default headings | Custom findings headings (Exhibits J, L) stored as optional field; layout renders `findingsHeading \|\| 'Findings'` | ✓ Good — preserves original heading text without hardcoding |
| NTSB-style findings only | Findings must be diagnostic discoveries (what went wrong, why) — not outcomes, observations, or achievements. Some exhibits (G) don't have natural findings — skip rather than force | ✓ Good — Exhibit G skipped, Exhibit K findings revised from 4→2 to remove outcome-style entries |
| Severity only for diagnostic findings | Severity applies to technical/process issues, not observational content. Investigation-report types and diagnostic engineering-briefs get severity; pattern-recognition exhibits (E, M, N, O) don't | ✓ Good — consistent application across 11 exhibits with findings |
| `entryType` discriminant for personnel rendering | Three-way classification (individual/group/anonymized) drives CSS class bindings for mobile cards and desktop table rows — no rendering logic in templates beyond class binding | ✓ Good — clean separation of data classification from visual treatment |
| Heading cascade `name → title → role` | First available field becomes card heading; dynamic `data-label` matches the field used — handles all personnel variants without separate template branches | ✓ Good — Exhibit L entries with no name correctly show title |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-11 — Phase 37 complete (SFC content extraction + LOAD-01 enforced)*
