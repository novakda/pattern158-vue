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

- ✓ SFC content extraction: hardcoded prose moved from 15 Vue files (7 pages + 8 delegated components) into 14 `src/content/*.ts` modules, SFCs `v-for` over imported arrays, 7 Playwright browser regression tests per refactored page, 149/149 tests green (SFC-01/02/03/04/05/06/07) — v7.0 (Phase 37, shipped before abort)
- ✓ Thin-loader invariant formalized: `src/data/*.ts` loaders may only import JSON + assert types + re-export; no sort/filter/computed/map/ref/reactive/watch; `as const satisfies` literal registries allowlisted; enforcement test in `src/data/__tests__/loaders.thin.test.ts` (LOAD-01) — v7.0 (Phase 37, shipped before abort)
- ✓ `scripts/markdown-export/` scaffold with separate `tsconfig.scripts.json`, pnpm migration, `tsx` + `yaml` + `github-slugger` devDeps, `build:markdown` + `test:scripts` npm scripts, Vitest `scripts` project (SCAF-01/02/03) — v7.0 (Phase 38, shipped before abort)
- ✓ `docs/` directory collision audit produced as `038-DOCS-AUDIT.md` — verdict GO (AUDT-01) — v7.0 (Phase 38, shipped before abort)
- ✓ `DocNode` discriminated union (6 block kinds) + `InlineSpan` inline tree (6 kinds) + `PageDoc` wrapper + `HeadingLevel` + `assertNever` (IR-01/02) — v7.0 (Phase 38, shipped before abort)
- ✓ Nine IR primitive factories: `text`, `heading`, `paragraph`, `link`, `wikilink`, `caption`, `list`, `table`, `blockquote` (PRIM-01) — v7.0 (Phase 38, shipped before abort)
- ✓ Four context-specific escape helpers with 53 unit tests (ESCP-01/02/03/04) — v7.0 (Phase 38, shipped before abort)
- ✓ Frontmatter YAML serializer with canonical key order + plural-key enforcement + block-style arrays (FM-01/02) — v7.0 (Phase 38, shipped before abort)

- ✓ `scripts/editorial/` flat-layout tool with `tsconfig.editorial.json` project reference, `editorial:capture` pnpm script, Playwright 1.59.1 + Turndown 7.2.4 + `@joplin/turndown-plugin-gfm` + happy-dom + yaml + github-slugger deps, Vitest `scripts` project extended, SCAF-08 forbidden-pattern grep discipline (SCAF-01..08) — v8.0
- ✓ `loadEditorialConfig` + hand-rolled CLI arg parser (`--output`, `--base-url`, `--headful`, `--mirror`) + env fallback + typed `ConfigError` exit-2, preflight path/URL validation; `buildRoutes` deterministic ordered `Route[]` from static list + `exhibits.json`, excluded-set filter (CAPT-01, CAPT-02, WRIT-01, WRIT-02) — v8.0
- ✓ Playwright `capturePage` orchestrator with single-browser single-context fresh-page-per-route lifecycle, 1500ms deterministic delay, 30s+10s timeouts, no retries (abort-on-error in strict `captureRoutes`), Cloudflare cache-buster + no-cache + 3-signal interstitial abort, `<main id="main-content">` scoping, FAQ filter-all-then-expand hooks, silent-SPA-404 detection via `.exhibit-detail-title`, per-route full-page PNG screenshots at 1280×800 light, SEO meta + console errors captured (CAPT-03..15) — v8.0
- ✓ Turndown 7.2.4 + full `@joplin/turndown-plugin-gfm` plugin with happy-dom pre-sanitization (strip `<script>`/`<style>`/`<noscript>`/`[aria-hidden="true"]` + every `data-v-*` attr), heading demotion H1→H3 (h6 clamp), badge/pill class-allowlist `**bold**`, alt-text-only image rule, blank-line collapse, byte-equal determinism proven (CONV-01..09) — v8.0
- ✓ `document.ts` assembler (YAML frontmatter with provenance, ToC via github-slugger, per-route `## Route: /path` + omit-empty blockquote metadata, `---` separators), `write.ts` atomic temp+rename with PID suffix + optional `.planning/research/` mirror, `index.ts` orchestrator with per-route resilience (drives `capturePage` directly, not strict `captureRoutes`), stdout + stderr-JSON summary, exit-code preconditions (SHAP-01..07, WRIT-03..07) — v8.0
- ✓ `emitFindingsScaffold` idempotent non-overwriting findings-template emission at `<vault>/career/website/site-editorial-findings.md` (EDIT-05) — v8.0
- ✓ Live production run validated: 22/22 routes captured in ~42s, zero failures, ~186 KB Markdown + 22 screenshots at `<vault>/career/website/site-editorial-capture.md` — v8.0
- ✓ v8.0 milestone audit notice `.planning/v8.0-AUDIT-NOTICE.md` (AUDT-01), RETROSPECTIVE.md v8.0 entry (AUDT-05), PROJECT.md/MILESTONES.md/ROADMAP.md v8.0-complete updates (AUDT-04 partial — v9.0 scope pending human verdict) — v8.0

### Active

<!-- Current scope. Building toward these. -->

**v9.0 Continue tiddlywiki intake and conversion** — see `.planning/REQUIREMENTS.md` for full REQ-ID list.

**Canonical source reframe:** The live `pattern158.solutions` site is the single source of truth for tiddler generation — NOT the project's JSON files (`src/data/json/*.json`) or Obsidian vault content. The editorial-capture pipeline (Playwright DOM + screenshots) feeds everything downstream. What ships to production IS the wiki input.

**DOM extraction (~6 extractors):** Structured parsers over captured HTML — FAQ items, exhibit sections, personnel rows, findings, technologies, testimonials, pages. Screenshots are the visual-fidelity fallback where DOM structure is lossy.

**Atomic decomposition (~150-200 tiddlers):** ~66 personnel + ~45 findings + ~40-80 technologies become individual tiddlers with cross-exhibit linking. Iter 1's page + FAQ + exhibit-overview tiddlers continue; atomic types stack on top.

**Tzk-style living wiki:** private/public tiddler split via tags, build pipeline, git-backed workflow, Pattern 158 brand theme matching the Vue site (colors, typography, layout).

**Test coverage + iter-1 fixes:** extractor unit tests, fix empty exhibit sections rendering bug, improve page body conversion quality.

**Key scoping decisions (locked 2026-04-21):**
- Source of truth: **live pattern158.solutions via Playwright**, not JSON. Screenshots + DOM as needed for structure.
- Out of scope for v9.0: career-vault intake, email-archive intake, Obsidian-broader intake. Live site only.
- Iter 1's `scripts/tiddlywiki/generate.ts` remains but is refactored to consume captured HTML via new DOM-extractor layer.
- Single-file wiki output continues (`npx tiddlywiki tiddlywiki --build index`). Tzk-style build pipeline augments but doesn't replace.

## Current Milestone: v9.0 Continue tiddlywiki intake and conversion

**Goal:** Turn `pattern158.solutions` into a tzk-style living TiddlyWiki: structured DOM extractors, atomic tiddlers for personnel/findings/technologies, Pattern 158 brand theme, private/public publishing workflow.

**Target features:**
- Canonical-source-is-the-live-site pipeline (DOM extractors over captured HTML + screenshots)
- Atomic tiddler decomposition (personnel, findings, technologies)
- Pattern 158 TiddlyWiki theme (brand-matched)
- Tzk-style private/public tiddler split + build pipeline
- Extractor test suite
- Iter-1 rough-edge fixes

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/runtime data fetching — JSON data layer is CMS-ready but no runtime fetching or backend yet
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Search input for FAQ — category filtering is sufficient for ~27 items; search adds value at 50+
- **v7.0 static markdown export pipeline (Phases 39-45)** — ABORTED 2026-04-19. Extractors (MAP-01, EXT-01..07, EXB-01..03), monolithic renderer (MONO-01..06), Obsidian vault renderer (VAULT-01..12, QA-01), writer + orchestrator (WRIT-01, ORCH-01), build integration + drift guard (INTG-01..04) are not being pursued. Source-module extraction misses the fidelity needed for editorial work (hardcoded component text, reading-order, composition, dynamic exhibits). Replaced by v8.0 live-site editorial capture. Phase 37 `src/content/*.ts` modules and Phase 38 IR primitives remain in place — harmless, may be reused if pipeline direction is ever resurfaced.

## Current State

**Shipped:** v8.0 Editorial Snapshot & Content Audit (2026-04-20) | **Shipped:** v6.0 (2026-04-08) | **Aborted:** v7.0 Static Markdown Export Pipeline (2026-04-19, see `.planning/v7.0-ABORT-NOTICE.md`) | **No active milestone** — v9.0 pending editorial findings + direction verdict

v8.0 delivered the Playwright-based live-site editorial capture tool (`scripts/editorial/`) shipped and validated against production — 22/22 routes captured in ~42s, zero failures, ~186 KB Markdown artifact + 22 full-page screenshots at `<vault>/career/website/site-editorial-capture.md`. Tool uses headless Chromium + Turndown 7.2.4 + `@joplin/turndown-plugin-gfm` + happy-dom pre-sanitization, with Cloudflare mitigation, FAQ accordion pre-expansion, silent-SPA-404 detection, atomic `tmp+rename` writes, auto-emitted findings scaffold. 401 unit tests green across 24 test files. Milestone audit notice at `.planning/v8.0-AUDIT-NOTICE.md` records the completion; v9.0 direction verdict (static HTML / Vue rewrite / framework rebuild / other) and Dan's editorial findings (EDIT-01..04) are queued for human review.

Prior shipped work still stands: all 11 data files externalized to JSON with thin TypeScript loaders; type definitions centralized with barrel exports; recurring exhibit table data (personnel, technologies, findings) promoted to typed first-class arrays; findings unified across 11 exhibits with NTSB-style diagnostic content; personnel data normalized with entryType. v7.0 retained output (Phase 37 `src/content/*.ts` prose modules + Phase 38 IR primitives in `scripts/markdown-export/`) remains in place — harmless and potentially reusable.

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
*Last updated: 2026-04-19 — v7.0 aborted, v8.0 scoping pending (see .planning/v7.0-ABORT-NOTICE.md)*
