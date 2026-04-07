---
gsd_state_version: 1.0
milestone: v4.0
milestone_name: Exhibit Data Normalization
status: executing
stopped_at: Completed 20-02 personnel layout rendering
last_updated: "2026-04-07T06:13:36.082Z"
last_activity: 2026-04-07
progress:
  total_phases: 3
  completed_phases: 1
  total_plans: 6
  completed_plans: 3
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-02)

**Core value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency
**Current focus:** Phase 22 — Findings Migration

## Current Position

Phase: 22
Plan: Not started
Status: Executing Phase 22
Last activity: 2026-04-07

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 10 (v2.0)
- Timeline: 4 days (2026-03-29 → 2026-04-02)

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 09 P01 | 6min | 1 tasks | 2 files |
| Phase 09 P02 | 2min | 2 tasks | 6 files |
| Phase 09 P03 | 2min | 1 tasks | 7 files |
| Phase 10 P01 | 3min | 2 tasks | 3 files |
| Phase 10 P02 | 2min | 2 tasks | 5 files |
| Phase 11 P01 | 3min | 2 tasks | 2 files |
| Phase 11 P02 | 13min | 2 tasks | 4 files |
| Phase 12 P01 | 2min | 2 tasks | 10 files |
| Phase 13 P01 | — | — | 7 files |
| Phase 14 P01 | 2min | 2 tasks | 2 files |
| Phase 16 P01 | 3min | 2 tasks | 4 files |
| Phase 17 P02 | 2min | 2 tasks | 10 files |
| Phase 18 P01 | 4min | 2 tasks | 11 files |
| Phase 18 P02 | 2min | 1 tasks | 2 files |
| Phase 19 P01 | 3min | 2 tasks | 4 files |
| Phase 20 P02 | 3min | 2 tasks | 4 files |

## Accumulated Context

### Decisions

- [v2.0 Phase 13]: `.impact-tag` / `.impact-tags` CSS was deleted as "dead CSS" but was actually in use
- [v2.0 Phase 10]: Layout components do not handle `metadata`, `timeline`, or `flow` section types

*(v2.0 decisions archived to PROJECT.md Key Decisions table — 2026-04-02)*

- [Phase 16]: sectionHasContent() guard function checks content arrays per type before rendering section div
- [Phase 16]: v-if/v-else-if chain ensures only one content block renders per section type
- [Phase 17]: Centralized src/types/ directory with barrel index for all data interfaces
- [Phase 17]: Component .types.ts files converted to backward-compat re-export shims from @/types
- [Phase 17]: JSON externalization pattern: data in src/data/json/*.json, thin loader imports + type-asserts + re-exports
- [Phase 18]: Type assertions (as T[]) needed for JSON loaders with optional fields
- [Phase 18]: faqCategories kept as const satisfies in TypeScript; only faqItems moved to JSON
- [Phase 19]: Programmatic extraction of 1581-line exhibits.ts to JSON via Node.js eval
- [Phase 20]: Column variant detection via field presence (involvement for Variant C, organization for A vs B)

### Pending Todos

None.

### Blockers/Concerns

None.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260317-wd3 | Fix 3 new Copilot findings: exhibit-h.html extra closing divs + section-heading indent in all 6 report sections, accessibility.html dt rename "Automated Testing" → "Tool-Assisted Review", PR description updated | 2026-03-17 | 73c9be6 | [260317-wd3-fix-3-new-copilot-findings-exhibit-h-div](.planning/quick/260317-wd3-fix-3-new-copilot-findings-exhibit-h-div/) |
| 260317-tl7 | Fix UX audit findings: ExhibitDetailPage wrong CSS tokens, btn touch target, timezone-note border-radius, dead FAQ CSS, orphaned section-alt rule | 2026-03-18 | 3537f95 | [260317-tl7-fix-ux-audit-findings-exhibitdetailpage-](.planning/quick/260317-tl7-fix-ux-audit-findings-exhibitdetailpage-/) |
| 260317-ucm | Document 8 Copilot PR review findings for novakda/pattern158.solutions PR #1 — triaged by severity with exact fix actions | 2026-03-18 | 37c7468 | [260317-ucm-review-copilot-pull-request-comments-on-](.planning/quick/260317-ucm-review-copilot-pull-request-comments-on-/) |
| 260317-ujd | Apply all 8 triaged Copilot PR fixes to pattern158.solutions: JSON-LD comments, p-wrapping dl, duplicate class attrs, stray p tags, false axe-core claim, dead sitemap URL, CSS testimonial selector expansion | 2026-03-17 | c57c485 | [260317-ujd-implement-all-triaged-copilot-pr-fixes-i](.planning/quick/260317-ujd-implement-all-triaged-copilot-pr-fixes-i/) |
| 260317-vrl | Fix 6 new Copilot PR findings: philosophy.html invalid HTML nesting (p>ol, p>div, p>p, p>article), CSS quote selectors expanded to philosophy/faq, accessibility.html test claim corrected, 15 exhibit inline style blocks extracted to main.css | 2026-03-17 | f78a3db | [260317-vrl-fix-6-new-copilot-pr-findings-philosophy](.planning/quick/260317-vrl-fix-6-new-copilot-pr-findings-philosophy/) |
| 260318-vrb | Fix blockquote text spacing that is too tight on testimonials page | 2026-03-19 | 55e31fa | [260318-vrb-fix-blockquote-text-spacing-that-is-too-](.planning/quick/260318-vrb-fix-blockquote-text-spacing-that-is-too-/) |
| 260327-nnz | Run full UX/accessibility/appearance review of ExhibitDetailPage with Playwright screenshots at 3 viewports and structured review document | 2026-03-27 | 721b800 | [260327-nnz-run-full-ux-accessibility-and-appearance](.planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/) |
| 260402-3b9 | ExhibitCard has lost styling on the exhibit-header from previous versions | 2026-04-02 | 56cafde | [260402-3b9-exhibitcard-has-lost-styling-on-the-exhi](.planning/quick/260402-3b9-exhibitcard-has-lost-styling-on-the-exhi/) |
| 260402-45z | Fix navbar logo contrast — add framed border/padding treatment (fixes #1) | 2026-04-02 | 61fa7c8 | [260402-45z-1-bug-caught-on-pattern158-solutions-log](.planning/quick/260402-45z-1-bug-caught-on-pattern158-solutions-log/) |
| 260402-ghi | Remove hover animation on exhibit cards (fixes #2) | 2026-04-02 | f529824 | — |
| 260402-gh5 | Exhibit cards too big — add compact mode with first quote only (fixes #5) | 2026-04-02 | 3736552 | — |
| 260402-gh6 | Exhibit cards look seamless — add margin-bottom spacing (fixes #6) | 2026-04-02 | 8e38618 | — |
| 260402-gh7 | Hide redundant mobile table labels on personnel/resolution tables (fixes #7) | 2026-04-02 | 6b9346e | — |

## Session Continuity

Last session: 2026-04-07T05:38:31.621Z
Stopped at: Completed 20-02 personnel layout rendering
Resume file: None
