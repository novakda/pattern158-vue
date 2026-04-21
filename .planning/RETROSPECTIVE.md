# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

---

## Milestone: v8.0 — Editorial Snapshot & Content Audit (SHIPPED)

**Shipped:** 2026-04-20
**Phases completed:** 7 (46-52) | **Plans:** 24 | **Tests added:** ~260 new across 7 new `__tests__` files (401 total) | **Milestone notice:** `.planning/v8.0-AUDIT-NOTICE.md`

### What Was Built

- Playwright-based live-site editorial capture tool at `scripts/editorial/` — headless Chromium driver against production `pattern158.solutions` with Cloudflare mitigation (cache-buster + `Cache-Control: no-cache` + 3-signal interstitial abort), `<main id="main-content">` scoping, FAQ accordion pre-expansion + filter-all hooks, silent-SPA-404 detection, per-route full-page PNG screenshots at fixed 1280×800 light theme, SEO meta + console-error capture
- Turndown 7.2.4 + full `@joplin/turndown-plugin-gfm` conversion with `happy-dom` pre-sanitization (strip `<script>`/`<style>`/`<noscript>`/`[aria-hidden="true"]` subtrees + every `data-v-*` SFC attribute), heading demotion (H1→H3 with h6 clamp), badge/pill class-allowlist rendered as `**bold**`, alt-text-only image rule, blank-line collapse, byte-equal determinism proven by unit tests
- Single monolithic Markdown artifact at `<vault>/career/website/site-editorial-capture.md` with YAML frontmatter provenance (`captured_at`, `source_url`, `site_version_sha`, `tool_version`), auto-generated ToC via `github-slugger`, per-route `## Route: /path` heading + omit-empty blockquote metadata, `---` separators; atomic `tmp+rename` write with PID suffix, optional `--mirror` dual-write, idempotent
- Orchestrator-owned per-route resilience (Phase 50 drives `capturePage` directly instead of the strict `captureRoutes`) — interstitial aborts whole run, other `CaptureError`s are logged and capture continues; exit code 0 only when all routes return 200 status AND ≥200 bytes AND zero failures; stdout human summary + stderr JSON for CI
- Auto-emitted findings scaffold at `<vault>/career/website/site-editorial-findings.md` (EDIT-05) — idempotent non-overwriting; seeds Inconsistencies / Structural / Copy / Alignment Gaps / Open Questions with priority labels + career-doc cross-reference stubs
- Live production run validated end-to-end: 22/22 routes captured in ~42s, zero failures, ~186 KB Markdown output + 22 screenshots

### What Was Deferred (intentionally human work)

- **EDIT-01..04 (Phase 51):** Dan reads the captured artifact in Obsidian, populates the findings scaffold with prioritized cross-referenced findings against the three career positioning docs. Tool side (EDIT-05) is shipped.
- **AUDT-02 / AUDT-03 (Phase 52):** v9.0 direction verdict per candidate (static HTML rebuild, Vue content rewrite, framework rebuild, other) with Rosetta Stone alignment check. Audit notice template is in place (`.planning/v8.0-AUDIT-NOTICE.md`) with TBD verdict sections ready to populate.

### What Went Well

- **Live smoke found a real bug.** Phase 48 verification passed all automated gates (5/5 must-haves, 309 tests green), but a 2-route smoke against production caught a stale-Locator regression in the FAQ accordion expansion loop (`.all()` handles went stale after the first click mutated the DOM). Switched to in-page JS `document.querySelectorAll(...).forEach(t => t.click())` — atomic from Playwright's perspective, bypasses actionability checks. Lesson: **automated tests + live smoke catch different failure classes.** Mocked-browser tests don't exercise DOM mutation semantics; live smoke does.
- **Plan-checker iterative feedback paid off across Phases 49–50.** Checker caught real issues before execution each time:
  - Phase 49: missing `/// <reference lib="dom" />` directive under `tsconfig.editorial.json`'s ES2022-only lib; `@mixmark-io/domino` not hoisted under pnpm strict isolation (switched to `happy-dom`); missing TypeScript shim for `@joplin/turndown-plugin-gfm`; badge regex missing `badge-\w+` alternation
  - Phase 50: contradictory `buildToc` signature across plan sections; Task 1/Task 2 export-surface mismatch in orchestrator; CLI-guard robustness against paths with spaces/unicode
- **CONTEXT.md lock discipline scaled cleanly.** Every phase's CONTEXT.md became the single source of truth for planner + executor + verifier + code-reviewer. Grey-area decisions captured once, honored verbatim downstream.
- **Atomic commits per task paid off for debuggability.** When Phase 48's FAQ bug was found and fixed, the fix landed as one atomic commit (`fix(48): atomic in-page click for FAQ accordion expansion`) with the original logic and its replacement clearly isolated in history.
- **Strict-vs-resilient capture boundary worked.** Phase 48's `captureRoutes` stays strict (abort on first error) to enforce editorial-artifact trustworthiness; Phase 50 bypasses it and drives `capturePage` directly with its own per-route try/catch for real-world run resilience. Clean API separation — neither module had to compromise.

### What Would Be Done Differently in v9.0

- **SCAF-08 grep gates bit comments repeatedly.** Line-based greps can't distinguish code from comments, so any JSDoc or SCAF-08 banner that referenced a forbidden token (`Date.now()`, `Promise.all`, package-name strings with `@/`) tripped the gate. Every executor agent hit this and had to rephrase prose mid-execution. A smarter gate would be token-aware (AST-based or language-grammar-aware). For v9.0, either relax the grep to operate on non-comment lines or use a dedicated lint rule with AST context.
- **Smart-discuss grey-area tables are still too granular for well-spec'd phases.** Phases 48, 49, 50 each had 5 ROADMAP success criteria + 9–13 REQ-IDs — many decisions were pre-locked, leaving only 3–4 genuinely gray areas per phase. The discuss-phase framework still asked per-question overrides even when "Accept all" was the realistic user path 90%+ of the time. Consider a fast-path "all defaults" single-click for phases with ≤3 genuine gray areas.
- **State/roadmap SDK handlers had format drift.** Multiple executor agents flagged `state.advance-plan`, `state.record-metric`, and `roadmap.update-plan-progress` as failing to parse the project's current STATE.md / ROADMAP.md shapes. Manual fallback edits worked but accumulated technical debt. For v9.0, either standardize on the SDK's expected shapes or update SDK handlers to be robust to format variations.
- **Phase 51 "manual" designation could be more explicit.** The phase's 5 REQ-IDs mixed 1 executable (EDIT-05) with 4 human (EDIT-01..04). Autonomous mode had no first-class way to express "this phase has a tool side and a human side." Considering a `manual: true` or `partial: { tool, human }` annotation in ROADMAP.md for future hybrid phases.

### Decisions Locked for Future Reference

- **Cache-buster shape**: `?_cb=<route-slug>` (deterministic per route, stable across runs). Never timestamp-based.
- **Interstitial detection**: layered 3-signal (title + body size + `cf-chl-opt`/`challenge-platform` markup). Any match aborts.
- **FAQ hook ordering**: filter-all click FIRST, then expand-all click. In-page JS click (NOT Playwright Locator iteration) to avoid stale handles.
- **Pre-Turndown sanitization phase**: strip subtrees → walk `data-v-*` attrs → demote headings → serialize to HTML string → hand to Turndown. NOT a Turndown filter-rule chain.
- **Document assembly via `yaml` package + minimal builder.** The v7.0 `scripts/markdown-export/frontmatter/serialize.ts` has Obsidian-note-specific constraints (canonical `title`/`tags`/`aliases` key order, forbidden singular keys) that DON'T generalize to provenance frontmatter. Don't force reuse — write a small dedicated builder when shapes diverge.
- **`captured_at` wall-clock read** lives in `index.ts` at the orchestration boundary (exactly 1 `new Date()`, exactly 2 `execSync` for git sha + dirty check). Library modules (`capture.ts`, `convert.ts`, `document.ts`, `write.ts`) stay pure.
- **Per-route resilience belongs in the orchestrator, not the capture library.** `captureRoutes` remains strict; `index.ts` wraps `capturePage` calls with `try/catch` + interstitial re-throw + log-and-continue on other `CaptureError`s.

### Metrics

- **Plans shipped:** 24 across 7 phases (46: 5, 47: 6, 48: 6, 49: 4, 50: 3, 51: 1 tool-only, 52: 1 doc-only)
- **Test growth:** ~260 new tests (baseline 143 from v7.0 retained → 401 at v8.0 completion)
- **Live artifact size:** ~186 KB Markdown + 22 full-page PNGs
- **End-to-end capture time:** ~42 seconds against production Cloudflare-fronted site
- **Autonomous iteration time:** entire v8.0 (Phases 48-52 portion, after Phases 46-47 completed prior) drove to shipped tool + live-validated artifact in a single autonomous session
- **Code review findings:** Phase 48: 2 MED + 3 LOW + 6 INFO (all fixed or explicitly deferred); Phase 49: 1 WARN + 7 INFO (all WARNING + quick-win INFOs fixed); Phase 50: 2 WARN + 5 INFO (both WARNINGs fixed)
- **Plan-checker revisions required:** Phase 48: 0 iterations; Phase 49: 1 iteration (2 blockers + 4 warnings resolved); Phase 50: 1 iteration (2 blockers + 3 warnings resolved)

---

## Milestone: v7.0 — Static Markdown Export Pipeline (ABORTED)

**Aborted:** 2026-04-19
**Phases attempted:** 2 shipped (37, 38), 1 planned (39), 6 not started | **Plans:** 16 completed before abort | **Abort notice:** `.planning/v7.0-ABORT-NOTICE.md`

### What Was Built (before abort)

- 14 `src/content/*.ts` prose modules extracted from 15 Vue files, SFCs now `v-for` over imported typed arrays, 7 Playwright browser regression tests per refactored page
- Thin-loader invariant formalized with enforcement test (`src/data/__tests__/loaders.thin.test.ts`)
- `scripts/markdown-export/` scaffold: separate `tsconfig.scripts.json` project reference, pnpm migration, Vitest `scripts` project, three devDeps (tsx, yaml, github-slugger), `build:markdown` + `test:scripts` npm scripts
- Complete IR contract: `DocNode` discriminated union (6 block kinds), `InlineSpan` inline tree (6 kinds), `PageDoc` wrapper, `HeadingLevel`, `assertNever` exhaustiveness helper
- Four context-specific escape helpers with 53 unit tests (prose, table-cell, wikilink target, code-block)
- Frontmatter YAML serializer with canonical key order, plural-key enforcement, block-style arrays
- Nine IR primitive factories (text, heading, paragraph, link, wikilink, caption, list, table, blockquote) with zero rendering/escape logic
- `docs/` directory collision audit (verdict GO)

### What Was Aborted and Why

**Scope stopped:** Phase 39 (static page extractors) planning docs written but not executed; Phases 40-45 (exhibit extractor, monolithic renderer, Obsidian vault renderer, writer/orchestrator, build integration, docs) not started.

**Reason:** The pipeline was well-engineered for producing derived renderings from `src/content/*.ts` modules with type preservation, drift detection, and round-trip guarantees. But the actual current need is **editorial, not publication** — reading the full rendered site as a single semantic document to identify inconsistencies with recent career positioning work and make structural/copy decisions before a rebuild.

Source-module extraction misses what editorial work needs:

1. **Incomplete coverage** — `src/content/*.ts` captures prose Phase 37 extracted, but data modules (`src/data/json/*.json`) only appear as prose when rendered; hardcoded component text only surfaces at render time
2. **No reading-order fidelity** — source modules are unordered; templates define the order readers encounter
3. **No composition fidelity** — component composition, conditional rendering, dynamic data interpolation only exist in rendered output
4. **Dynamic routes** — exhibit detail pages and case file filtering only materialize real prose when hit

v7.0 also locks in a direction (Vue canonical → derived Markdown) that may need to be reversed for a longer-term Rosetta Stone vision (neutral content → multiple framework implementations).

### Key Lessons

1. **Engineering quality ≠ fit for purpose.** Phase 37 and 38 shipped with high craft — composable IR, 53-test escape helper coverage, deterministic frontmatter, round-trip test scaffolding. That quality was real but solving the wrong problem. Before deeper investment, validate that the *output shape* (source-derived Markdown) is what the user will actually consume. In this case, the user needed rendered-site Markdown, not source-module Markdown.
2. **Editorial fidelity lives at the render layer.** If the goal is to read, edit, and restructure content, capture the rendered site — not the authoring source. This is the same lesson 11ty and SSG taxonomies teach: templates define reading order, components define composition, data modules alone cannot reconstruct either.
3. **Know when to abort versus pivot in place.** An abort was the right call here because v7.0 and v8.0 solve different problems, not variations of the same problem. A pivot-in-place would have kept accruing architectural commitments to the wrong direction. Writing a dedicated ABORT-NOTICE.md that preserves the reasoning is worth the small cost — future-you (or a successor) will want it.
4. **Shipped foundation work is not wasted.** Phase 37 improved the Vue codebase independent of the pipeline — the `src/content/*.ts` modules are still the right place for extracted prose. Phase 38's IR primitives are shipped, tested, and harmless to leave in place. If a future pipeline direction resurfaces, the work isn't lost; if it doesn't, the existing codebase benefits anyway.

### Patterns Established

- **Content module pattern (src/content/\*.ts):** named typed exports, no default export, consumed via `{{ expression }}` and `v-for` — established in Phase 37, applicable beyond any pipeline
- **Thin-loader invariant:** `src/data/*.ts` loaders may only import JSON + assert types + re-export; no transformation logic; `as const satisfies` literal registries allowlisted — guards against loader drift regardless of consumer
- **IR + primitive architecture:** discriminated unions for block nodes, factory functions for construction, renderer-agnostic primitives, per-renderer branching for format divergences — reusable design even if this specific pipeline is shelved
- **Abort-notice convention:** root `.planning/v7.0-ABORT-NOTICE.md` as primary record + `milestones/v7.0-MILESTONE-AUDIT.md` as archival mirror + RETROSPECTIVE entry. Preserves reasoning without requiring a GSD-native abort command (none exists)

### Cost Observations

- Model mix: balanced profile across all phases
- Phase 37 duration: ~2026-04-10 (1 day, 9 plans)
- Phase 38 duration: 2026-04-10 → 2026-04-11 (~2 days, 7 plans)
- Phase 39 planning only: 2026-04-11 (never executed)
- Abort: 2026-04-19 (8 days after Phase 38 shipped — time spent on career positioning work and design-philosophy documents that informed the pivot)

---

## Milestone: v1.1 — Exhibit Content Consistency

**Shipped:** 2026-03-19
**Phases:** 4 (Phases 5-8) | **Plans:** 5 | **Commits:** ~48

### What Was Built

- Complete 15-exhibit audit with 45 Playwright screenshots, structured comparison table, and all variations classified (intentional / fixable / gap)
- Structural normalization: `contextHeading` labels unified on Exhibits M/N, "Investigation Report" badge added to ExhibitDetailPage, quote attribution standardized (Exhibit A)
- Content gap decision list (07-01-GAPS.md) with 8 approved and 3 excluded items — user-gated, zero unsanctioned content added
- Approved content additions to Exhibits A, C, D, G matching 11ty source exactly
- ExhibitCard CTA text inversion fixed via TDD — "View Full Investigation Report" now correctly maps to `investigationReport: true`

### What Worked

- **Audit-first approach**: Phase 5 produced a standalone document Dan could review without context — the classified variation table drove all subsequent phases cleanly
- **Three-source requirement cross-referencing**: Checking VERIFICATION.md + SUMMARY frontmatter + REQUIREMENTS.md traceability exposed the STRUCT-02 partial closure gap that required Phase 8
- **TDD for behavioral bugs**: Writing failing tests before fixing `ExhibitCard.vue:55` locked the correct semantic mapping and caught the exact line in one pass
- **User-gating for content**: CONT-02 gate (no additions without Dan's approval) kept scope tight — zero scope creep in the content fill phase
- **Milestone audit before archiving**: The audit correctly identified the STRUCT-02 ExhibitCard gap left by Phase 6, leading to Phase 8 being added rather than shipped incomplete

### What Was Inefficient

- SUMMARY.md `one_liner` fields were not populated — the CLI `summary-extract` tool returned nothing useful; accomplishments had to be extracted manually from `provides:` frontmatter
- Phase 8 was an unplanned gap-closure phase; the original Phase 6 plan should have addressed both the badge and the CTA text in one phase (both are STRUCT-02)
- STATE.md performance metrics table was not populated — all velocity rows show dashes despite the phase durations being logged in the same file

### Patterns Established

- **RouterLink slot-rendering stub**: To assert CTA text in ExhibitCard tests, `RouterLink` must use a template slot stub: `<span><slot/></span>` — otherwise `wrapper.text()` is empty
- **Playwright `.cjs` extension**: When `package.json` has `type: "module"`, Playwright scripts must use `.cjs` extension or they will fail to execute
- **`.badge-aware` CSS class**: Muted/neutral badge style that avoids color collision with teal exhibit label on dark header backgrounds
- **Phase summaries**: Use `provides:` frontmatter array rather than `one_liner` for machine-readable accomplishments (one_liner is undefined in most summaries)

### Key Lessons

1. **Audit phases should capture human-verification items explicitly** — Phase 5 screenshots required a comprehension check that was never scheduled; carry human-verification tasks forward as explicit todos
2. **Requirement traceability across two phases needs explicit closure tracking** — STRUCT-02 spanning Phase 6 and Phase 8 created a documentation gap in Phase 8's SUMMARY frontmatter; multi-phase requirements benefit from a closure checklist
3. **Gap-closure phases are small but high-value** — Phase 8 was 3min/3 tasks/5 files; the TDD fix was minimal but closed a semantically wrong behavior visible to every site visitor

### Cost Observations

- Model mix: balanced profile (sonnet-primary) across all phases
- Sessions: ~8 sessions across 4 phases (2026-03-17 → 2026-03-19)
- Notable: Phase 6 (4min) and Phase 8 (3min) were extremely fast due to precise audit targets; Phase 5 (70min) dominated due to Playwright screenshot generation across 45 views

---

## Milestone: v2.0 — Site IA Restructure — Evidence-Based Portfolio

**Shipped:** 2026-04-02
**Phases:** 6 (Phases 9-14) | **Plans:** 10 | **Commits:** ~93

### What Was Built

- Migrated all 15 exhibits to explicit `exhibitType` discriminant ('investigation-report' | 'engineering-brief'), merged flagship data into single source of truth (exhibits.ts)
- Split monolithic ExhibitDetailPage into thin dispatcher (~40 lines) plus InvestigationReportLayout and EngineeringBriefLayout components
- Built unified CaseFilesPage with type-grouped exhibits (5 IR + 10 EB), stats bar, and 38-project directory
- Atomic route migration: /case-files replaces /portfolio and /testimonials with vue-router redirect objects, NavBar consolidated from 8 to 6 entries
- Retired 7 orphaned files and ~390 lines dead CSS
- Phase 14 gap closure: patched SUMMARY frontmatter and created missing VERIFICATION.md

### What Worked

- **Data model first**: Phase 9 establishing `exhibitType` as the single discriminant made Phases 10-13 predictable — every downstream consumer had a clean interface to work with
- **Parallel-capable phases**: Phases 10 (detail templates) and 11 (listing page) only depended on Phase 9, enabling conceptual independence even though executed sequentially
- **Atomic route migration**: Phase 12 changed all 13 route references in a single phase — no intermediate broken states where some links pointed to old routes
- **Milestone audit → gap closure phase**: The v2.0 audit correctly identified 5 documentation gaps (SUMMARY frontmatter + missing VERIFICATION.md), and Phase 14 closed them in 2 minutes
- **Execution velocity**: 10 plans across 6 phases in 4 days, with most plans completing in 2-6 minutes

### What Was Inefficient

- **Phase 10 plan/codebase mismatch**: Plan referenced `exhibitType` for dispatch but codebase still had `investigationReport` boolean — required a deviation and correction during execution
- **STATE.md metrics still incomplete**: Progress percent showed 0% throughout execution despite all phases completing; the CLI state tracking didn't sync with actual completion
- **Audit created before gap closure**: The milestone audit was run, gaps found, Phase 14 created and executed, but the audit file wasn't re-run — shipped with stale `gaps_found` status (gaps were actually closed)

### Patterns Established

- **Thin dispatcher + layout components**: ExhibitDetailPage is ~40 lines of routing logic; all DOM structure lives in layout components. Pattern scales to additional exhibit types.
- **Vue Router redirect objects**: For deprecated routes, `{ path: '/portfolio', redirect: '/case-files' }` is cleaner than redirect components
- **Border accent reusing badge token values**: `--color-badge-aware` (gray) for IR, `--color-badge-deep` (teal) for EB — consistent type identity across cards and detail badges
- **Gap closure as separate phase**: Separating documentation fixes from code work keeps code phases clean and gap closure auditable

### Key Lessons

1. **Plans must be verified against actual codebase state** — Phase 10's plan assumed `exhibitType` existed on the interface before Phase 9 actually shipped it; research phase should verify the exact interface shape, not assume from requirements
2. **Re-run audit after gap closure** — Shipping with stale audit status creates confusion; the audit should be refreshed or at minimum annotated after gap phases complete
3. **Milestone audit is high-value at low cost** — Finding 5 documentation gaps before archival prevented shipping with incomplete traceability; total cost was ~5 minutes (audit + Phase 14 fix)

### Cost Observations

- Model mix: balanced profile (sonnet-primary) for execution, opus for planning
- Sessions: ~6 sessions across 6 phases (2026-03-29 → 2026-04-02)
- Notable: Phase 12 (atomic route migration, 2min for 10 files) was the highest-leverage single plan in the milestone

---

## Milestone: v2.1 — Case Files Bug Fixes

**Shipped:** 2026-04-06
**Phases:** 2 (Phases 15-16) | **Plans:** 2 | **Commits:** ~34

### What Was Built

- Restored `.impact-tag` and `.impact-tags` CSS rules accidentally deleted in Phase 13 as "dead CSS" — pill badge styling restored on Case Files and detail pages
- Added timeline (6 occurrences), metadata (15), and flow (1) section rendering to both InvestigationReportLayout and EngineeringBriefLayout
- `sectionHasContent()` guard function suppresses empty sections from DOM output
- 13 quick-task bug fixes from GitHub issues: logo contrast, hover animation removal, compact cards, card spacing, mobile table labels

### What Worked

- **TDD for template rendering**: 10 tests written RED before implementation; all GREEN on first pass — no rework needed
- **Audit-verified completion**: Milestone audit confirmed 6/6 requirements satisfied before archival; only documentation debt found (no functional gaps)
- **Quick task parallelism**: GitHub issue intake workflow enabled rapid bug fixes (5 issues closed in a single session)
- **Minimal milestone scope**: Bug-fix-only milestone kept scope tight — 2 phases completed in 1 day

### What Was Inefficient

- **REQUIREMENTS.md checkbox drift**: CSS-01/CSS-02 checkboxes were not updated after Phase 15 completion — caught only by milestone audit cross-referencing VERIFICATION.md
- **Phase 15 SUMMARY frontmatter gaps**: Missing `requirements-completed` field; documentation-only issue but created extra audit noise
- **Retroactive milestone completion**: v2.1 archival happened after v2.2/v2.3/v3.0 were already tagged — ideally milestone completion should happen immediately after the last phase ships

### Patterns Established

- **sectionHasContent guard**: Centralized content-existence check using switch/case per section type — prevents empty section DOM pollution
- **Template v-if/v-else-if chain**: Single render path per section type within v-for loop — clean conditional rendering without nested ternaries

### Key Lessons

1. **Mark requirements checked immediately after phase completion** — delaying checkbox updates creates audit noise; add to phase completion checklist
2. **Complete milestones before starting the next** — retroactive archival works but loses temporal context and creates tag ordering confusion
3. **Bug-fix milestones are high-value, low-cost** — v2.1's 2-phase scope fixed 22 previously broken section renders across 15 exhibits in a single day

### Cost Observations

- Model mix: balanced profile (sonnet-primary) for execution
- Sessions: ~3 sessions across 2 phases (2026-04-02)
- Notable: Phase 16 completed in 3 minutes with TDD — fastest plan-to-ship in the project

---

## Milestone: v6.0 — FAQ Page Redesign

**Shipped:** 2026-04-08
**Phases:** 4 | **Plans:** 5

### What Was Built

- FaqItem type extended with `id`, `categories[]`, `exhibitNote?`, `exhibitUrl?`; 7-category unified taxonomy (Phase 33)
- 13 career-vault FAQ questions merged with 14 existing, 3 overlaps reconciled, 6 exhibit cross-references extracted (Phase 34)
- FaqAccordionItem with WAI-ARIA pattern, multi-open, +/× icon rotation, full keyboard support (Phase 35-01)
- FaqFilterBar with category pills, single active filter, live aria-live count label (Phase 35-02)
- FaqPage rewritten with accordion, filter, exhibit callout blocks, full-width stacked layout; old FaqItem deleted; global .page-faq CSS cleaned up (Phase 36)

### What Worked

- **Replace-not-extend strategy**: Old FaqItem.vue was 15 lines with no state — clean rewrite was cheaper than incremental migration
- **Content merge after schema**: New content landed on new shape — zero transitional JSON states
- **CSS Grid rotate over transform**: Accordion icon rotation used a single CSS class instead of JS-driven transform — test-friendly and tokenizable
- **Category taxonomy up front**: Human-in-the-loop taxonomy design in Phase 33 prevented re-tagging churn during content merge
- **Storybook stories for filter/accordion components**: Caught aria-live verbalization issues before page integration

### What Was Inefficient

- **Visual verification deferred across multiple phases**: Phase 35 and Phase 36 both carry "visual verification deferred" tech debt — should've been resolved inline while context was warm
- **Global .page-faq CSS audit late**: Audit of main.css specificity conflicts happened in Phase 36 instead of as a precursor, risking specificity fights during integration
- **FaqCategoryId type alias orphaned**: Widening to string left an unused alias that Phase 33 didn't catch — tech debt carried to audit

### Patterns Established

- **Flat filtered list over nested groups**: Single filter bar + flat accordion list out-scales per-category sections as content grows (27 items across 7 categories)
- **Live aria-live count label**: Filter state feedback for screen readers without visible verbosity — reusable pattern for future filterable lists
- **Exhibit callout component**: Left-bordered accent block for case-file cross-references — applicable beyond FAQ to philosophy/homepage exhibit mentions

### Key Lessons

1. **Content schema changes are cheaper when decoupled from UI rewrites**: Phase 33 (schema) and Phase 35 (components) in separate phases allowed parallel reasoning about data shape and component contract
2. **Categories-as-array from day one**: Single-category → multi-category migration would have cost more later; getting DATA-02 right in v6.0 was load-bearing
3. **Visual verification is not optional**: Deferring accordion icon rotation verification and exhibit callout layout to "later" is how tech debt accumulates — should be part of the plan's exit criteria

### Cost Observations

- Model mix: balanced profile (sonnet-primary)
- Sessions: ~2 sessions across 4 phases (2026-04-08)
- Notable: Entire milestone from roadmap to ship in a single day — schema + merge + components + integration completed in one push

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 4 | 14 | Established component extraction pattern + Storybook-all-components discipline |
| v1.1 | 4 | 5 | Introduced audit-first workflow; milestone audit caught requirement gap pre-archival |
| v2.0 | 6 | 10 | Data-model-first IA restructure; thin dispatcher pattern; gap closure as separate phase |
| v2.1 | 2 | 2 | Bug-fix-only milestone; TDD for template rendering; sectionHasContent guard pattern |
| v6.0 | 4 | 5 | FAQ interactive redesign; WAI-ARIA accordion + filter pattern; replace-not-extend for no-state components |

### Cumulative Quality

| Milestone | Vitest Tests | Storybook Stories | Notes |
|-----------|-------------|-------------------|-------|
| v1.0 | baseline | all components | dual-environment config (node + browser) |
| v1.1 | +5 (ExhibitCard) | +2 (ExhibitCard variants) | TDD pattern introduced |
| v2.0 | 54 total (+22) | — | Layout components, CaseFilesPage, route migration tests |
| v2.1 | 64 total (+10) | — | Section type rendering TDD (timeline, metadata, flow, empty suppression) |

### Top Lessons (Verified Across Milestones)

1. **Audit before acting**: Phase 5's classification table prevented content drift in Phase 7 — knowing what to fix vs what to leave intentional is worth an entire phase
2. **Three-source traceability finds gaps**: Cross-referencing VERIFICATION + SUMMARY + REQUIREMENTS.md surfaces documentation gaps that single-source review misses
3. **Data model first**: Establishing a clean discriminant type (v2.0 Phase 9) before building consumers prevents interface mismatches — confirmed across 5 downstream phases
4. **Milestone audit → gap closure is cheap insurance**: v1.1 and v2.0 both benefited from pre-archival audits catching small but real gaps; total cost < 10 minutes combined
