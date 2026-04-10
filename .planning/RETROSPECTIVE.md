# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

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
