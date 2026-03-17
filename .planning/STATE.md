---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Completed 02-homepage-extraction-pattern-03-PLAN.md
last_updated: "2026-03-17T00:53:05.463Z"
last_activity: 2026-03-16 — Roadmap created; phases derived from requirements
progress:
  total_phases: 3
  completed_phases: 2
  total_plans: 5
  completed_plans: 5
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-16)

**Core value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency
**Current focus:** Phase 1 — Foundation Fixes

## Current Position

Phase: 1 of 3 (Foundation Fixes)
Plan: 0 of TBD in current phase
Status: Ready to plan
Last activity: 2026-03-16 — Roadmap created; phases derived from requirements

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

*Updated after each plan completion*
| Phase 01-foundation-fixes P01 | 10 | 2 tasks | 5 files |
| Phase 01-foundation-fixes P02 | 3 | 2 tasks | 3 files |
| Phase 02-homepage-extraction-pattern P01 | 5 | 2 tasks | 9 files |
| Phase 02-homepage-extraction-pattern P02 | 2 | 2 tasks | 7 files |
| Phase 02-homepage-extraction-pattern P03 | 15 | 2 tasks | 1 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Port-first, extract-second per page — content must exist before component APIs can be designed
- [Init]: Extract components when they (a) are reused, (b) name a concept, or (c) enforce a pattern — not for abstraction points
- [Phase 01-foundation-fixes]: Pages must not contain main elements — App.vue owns the single main#main-content landmark
- [Phase 01-foundation-fixes]: Vue 3 fragment pattern confirmed as standard for all page templates (no wrapper div or main)
- [Phase 01-foundation-fixes]: vitest.config.ts: use projects array (Vitest 4 API) with extends: true on each project for root alias inheritance
- [Phase 01-foundation-fixes]: Test file naming: *.test.ts = unit (happy-dom), *.browser.test.ts = browser (Playwright)
- [Phase 02-homepage-extraction-pattern]: Tag interface extracted to TechTags.types.ts for plain tsc compatibility; TechTags.vue re-exports for vue-tsc backward compat
- [Phase 02-homepage-extraction-pattern]: Influence segments model (InfluenceSegment[]) chosen for type-safe inline-link content rendering
- [Phase 02-homepage-extraction-pattern]: HomeHero renders tech pills inline with hero-tech-pills/tech-pill classes (not TechTags) to preserve existing CSS class structure
- [Phase 02-homepage-extraction-pattern]: Teaser quotes stored as local const in script setup (not a data file) — page-scoped content not shared across pages

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1]: `TechnologiesPage.vue` and `ContactPage.vue` have nested `<main>` — invalid HTML breaking accessibility; must fix before adding pages
- [Phase 1]: `PhilosophyPage.vue` has four `<router-link>` tags to non-existent exhibit routes — no catch-all 404 route exists, failures are silent
- [Phase 4/v2]: Deployment hosting environment not confirmed — history-mode redirect config format differs by host (Netlify `_redirects` vs. others); confirm before go-live

## Session Continuity

Last session: 2026-03-17T00:53:05.461Z
Stopped at: Completed 02-homepage-extraction-pattern-03-PLAN.md
Resume file: None
