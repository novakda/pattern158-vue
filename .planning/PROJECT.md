# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

The site features a unified Case Files evidence section with two distinct exhibit types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts. v1.0–v1.1 completed the 11ty-to-Vue conversion; v2.0 restructured the information architecture; v3.0 externalized all data to JSON with centralized TypeScript types; v4.0 normalized recurring exhibit table data into typed first-class arrays; v5.x unified the findings schema and personnel data; v6.0 rebuilt the FAQ page as an accessible accordion; v8.0 built a Playwright-based live-site editorial capture pipeline; **v9.0 turned the site into a tzk-style living TiddlyWiki** with canonical-source-is-the-live-site architecture — structured DOM extractors feed atomic tiddlers into a Pattern 158-branded wiki with private/public publishing workflow.

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
- ✓ v8.0 milestone audit notice `.planning/milestones/v8.0-AUDIT-NOTICE.md` (AUDT-01), RETROSPECTIVE.md v8.0 entry (AUDT-05), PROJECT.md/MILESTONES.md/ROADMAP.md v8.0-complete updates (AUDT-04 partial — v9.0 verdict resolved out-of-band 2026-04-21) — v8.0

- ✓ Eight DOM extractors under `scripts/tiddlywiki/extractors/` (FAQ, exhibit, personnel, findings, technologies, testimonials, pages, case-files-index) parse captured HTML into typed domain entities via pure `emit` functions over `happy-dom`-parsed input with inline-HTML fixture tests (EXTR-01..08) — v9.0
- ✓ Six atomic tiddler generators decompose entities into per-person / per-finding / per-technology / per-testimonial tiddlers plus exhibit cross-link bundles and `verify-integrity.ts` orphan detector (ATOM-01..05) — v9.0
- ✓ Iter-1 generator refactored (not rewritten): `exhibitsToTiddlers` subsection walker fix, `pageContentToTiddlers` replaces HTML→wikitext path for pages, FAQ footer enriched with siblings + exhibit callouts, Case Files Index as sortable TiddlyWiki table, Phase 55 HARD GATE enforcing 0 orphaned cross-links (FIX-01..04) — v9.0
- ✓ Test coverage: 593 tests passing, hermetic e2e smoke (fixture http-server round-trip, 27 fixture tiddlers, 0 orphans), full-corpus integrity test (TEST-01..04) — v9.0
- ✓ Pattern 158 brand theme: color tokens, typography, 4 type-specific ViewTemplates (exhibit/person/finding/default), badge/pill CSS passthrough, dark/light parity matching Vue site design tokens (THEME-01..05) — v9.0
- ✓ Tzk-inspired structure: `public` default tag, `private` opt-out via `+[!tag[private]]` filter (canary-tiddler-locked), `pnpm tiddlywiki:build-public` + `pnpm tiddlywiki:build-all` targets producing 2.8 MB deploy-ready HTML, `tiddlywiki/` layout (`tiddlers/`/`output/`/`config/`/`build/`) (TZK-01..05) — v9.0
- ✓ Documentation: three docs (4,919 words total) — `scripts/tiddlywiki/README.md` (architecture), `tiddlywiki/README.md` (tzk workflow), `tiddlywiki/CONTRIBUTING.md` (editing guide) (DOC-01..03) — v9.0
- ✓ Phase 55 hotfix canonicalized exhibit tiddler title to short form (`"Exhibit A"`), resolving 267 orphaned cross-links and unlocking the integrity gate — v9.0

### Active

<!-- Current scope. Building toward these. -->

_No active milestone. v9.0 shipped 2026-04-22. Next milestone TBD — use `/gsd:new-milestone` to define._

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/runtime data fetching — JSON data layer is CMS-ready but no runtime fetching or backend yet
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Search input for FAQ — category filtering is sufficient for ~27 items; search adds value at 50+
- **v7.0 static markdown export pipeline (Phases 39-45)** — ABORTED 2026-04-19. Extractors (MAP-01, EXT-01..07, EXB-01..03), monolithic renderer (MONO-01..06), Obsidian vault renderer (VAULT-01..12, QA-01), writer + orchestrator (WRIT-01, ORCH-01), build integration + drift guard (INTG-01..04) are not being pursued. Source-module extraction misses the fidelity needed for editorial work. Replaced by v8.0 live-site editorial capture. Phase 37 `src/content/*.ts` modules and Phase 38 IR primitives remain in place — harmless, may be reused if pipeline direction is ever resurfaced.
- **Career vault / Obsidian intake** (v9.0 exclusion) — canonical source is the live site only; vault content is editorial reference, not canonical.
- **Email archive intake** (v9.0 exclusion) — archive content is a separate editorial surface; not in tiddlywiki scope.
- **TW plugin authoring** (v9.0 exclusion) — stock TW5 + tzk-inspired patterns only.
- **Auth / multi-user editing on the wiki** (v9.0 exclusion) — single-author wiki; re-evaluate if collaboration is ever needed.

## Current State

**Shipped:** v9.0 Continue tiddlywiki intake and conversion (2026-04-22, 34/34 REQs, see `.planning/milestones/v9.0-MILESTONE-AUDIT.md`) | **Prior:** v8.0 Editorial Snapshot & Content Audit (2026-04-20) | **Aborted:** v7.0 Static Markdown Export Pipeline (2026-04-19, `.planning/v7.0-ABORT-NOTICE.md`) | **Active:** none — next milestone pending

v9.0 turned pattern158.solutions into a tzk-style living TiddlyWiki. Eight DOM extractors parse captured HTML (from the v8.0 editorial pipeline) into typed entities; six atomic tiddler generators decompose them into per-person / per-finding / per-technology / per-testimonial tiddlers; the full pipeline produces 367 tiddlers composed into a single-file wiki with Pattern 158 brand theme and public/private build variants (2.8 MB each). 593 tests passing; 0 orphaned cross-links enforced by Phase 55 HARD GATE; hermetic e2e smoke locks correctness. Deploy-ready `tiddlywiki/output/index.html` (public) and `all.html` (authoring). Three contributor docs shipped (4,919 words).

Prior milestone output still stands: v8.0 editorial-capture tool operational (22 routes in ~42s, ~186 KB Markdown + 22 screenshots). v3.0–v6.0 data layer stable (JSON externalized, centralized types, personnel/technologies/findings as typed arrays, FAQ redesigned as accordion). v7.0 retained artifacts (`src/content/*.ts` prose, `scripts/markdown-export/` IR primitives) remain harmless.

Known deferred from v8.0, still open, non-blocking: EDIT-01..04 (human editorial findings writeup). v9.0 direction verdict (AUDT-02/03) was resolved out-of-band 2026-04-21 via smart-discuss — decisions live in the v9.0 REQUIREMENTS archive header.

## Context

- The 11ty site is published and live. The Vue version has diverged from 11ty structure intentionally as of v2.0.
- As of v9.0, `pattern158.solutions` is also the canonical source for a generated TiddlyWiki deploy — structured DOM extractors + screenshots feed the wiki; project JSON files and Obsidian vault are not canonical for wiki content.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Codebase: Vue site + `scripts/editorial/` (v8.0 capture tool) + `scripts/tiddlywiki/` (v9.0 extractors + generators) + `tiddlywiki/` (TW5 edition with tiddlers/output/config/build); 593 scripts tests + existing Vue tests all passing; clean production build.

## Constraints

- **Tech stack**: Vue 3 Composition API + TypeScript + Vite — already established, no changes
- **Styling**: Existing CSS design token system — components should consume tokens, not introduce new styling approaches
- **Complexity**: Favor clarity over cleverness — extract components for readability, not for abstraction points
- **Determinism (v8.0+)**: `scripts/editorial/` and `scripts/tiddlywiki/` enforce SCAF-08 discipline (no wall-clock, no parallel iteration, no `@/` alias imports) via grep-based acceptance gates — producers are deterministic and idempotent.

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
| `entryType` discriminant for personnel rendering | Three-way classification (individual/group/anonymized) drives CSS class bindings — no rendering logic in templates beyond class binding | ✓ Good — clean separation of data classification from visual treatment |
| Heading cascade `name → title → role` | First available field becomes card heading; dynamic `data-label` matches the field used — handles all personnel variants without separate template branches | ✓ Good — Exhibit L entries with no name correctly show title |
| SCAF-08 discipline with grep-based acceptance gates (v8.0+) | Determinism/idempotency enforced by source+test grep for forbidden tokens (`Date.now`, `Promise.all`, `@/` alias, `setTimeout`) — comments and code both inspected | ✓ Good — pattern scaled cleanly across v8.0 editorial tool and v9.0 tiddlywiki pipeline |
| Canonical source = live pattern158.solutions (v9.0) | Playwright DOM + screenshots feed the wiki; project JSON files and Obsidian vault are editorial reference, not canonical — prevents drift between shipped site and wiki | ✓ Good — editorial-capture pipeline + 8 DOM extractors produce 367-tiddler corpus with 0 orphaned links |
| Atomic decomposition (v9.0) | Per-person / per-finding / per-technology / per-testimonial tiddlers alongside page + FAQ + exhibit-overview tiddlers — enables cross-linking at scale | ✓ Good — ~250 atomic tiddlers in 367-tiddler corpus, integrity gate enforces graph consistency |
| Phase boundaries LOCKED: extractors (pure DOM parse) → generators (pure data transforms) → wiring in generate.ts (v9.0) | No cross-boundary modifications during extension work; each layer owns its own test surface | ✓ Good — clean refactor path preserved iter-1 through the migration |
| happy-dom everywhere for HTML parsing (v9.0) | Single parser across editorial convert + tiddlywiki extractors — one dependency, one deprecation surface; pnpm-hoist safe via direct top-level dep | ✓ Good — no parser divergence; file-scoped `/// <reference lib="dom" />` pattern reused across both pipelines |
| No JSDoc convention (v9.0) | `CONVENTIONS.md` codifies: line-comments only, no `/** */` blocks — avoids JSDoc `*/` end-marker hazard inside block comments during grep-based audits | ✓ Good — pattern survived 593 tests across the tiddlywiki codebase |
| Exhibit tiddler title canonicalized to short form `"Exhibit A"` (v9.0 Phase 55 hotfix) | Long-form titles (`"Exhibit A: Meridian Legacy System"`) had drifted between producer sites — 267 orphaned cross-links surfaced only at corpus scale | ✓ Good — single-source constants + grep-based title canon lock means future drift trips CI |
| Tzk `+[!tag[private]]` filter with `+` intersection prefix (v9.0 Phase 58) | Raw `[!tag[private]]` unions with `saveTiddlerFilter`; `+` narrows the set correctly — verified via canary-tiddler smoke test (sentinel absent from public, present in all) | ✓ Good — public/all build split correct; canary locks the contract |

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
*Last updated: 2026-04-22 — v9.0 shipped (tzk-style living TiddlyWiki, 34/34 REQs, 367 tiddlers, 0 orphaned cross-links). See `.planning/milestones/v9.0-MILESTONE-AUDIT.md` (audit) and `.planning/milestones/v9.0-ROADMAP.md` / `v9.0-REQUIREMENTS.md` (archives).*
