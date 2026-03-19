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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 4 | 14 | Established component extraction pattern + Storybook-all-components discipline |
| v1.1 | 4 | 5 | Introduced audit-first workflow; milestone audit caught requirement gap pre-archival |

### Cumulative Quality

| Milestone | Vitest Tests | Storybook Stories | Notes |
|-----------|-------------|-------------------|-------|
| v1.0 | baseline | all components | dual-environment config (node + browser) |
| v1.1 | +5 (ExhibitCard) | +2 (ExhibitCard variants) | TDD pattern introduced |

### Top Lessons (Verified Across Milestones)

1. **Audit before acting**: Phase 5's classification table prevented content drift in Phase 7 — knowing what to fix vs what to leave intentional is worth an entire phase
2. **Three-source traceability finds gaps**: Cross-referencing VERIFICATION + SUMMARY + REQUIREMENTS.md surfaces documentation gaps that single-source review misses
