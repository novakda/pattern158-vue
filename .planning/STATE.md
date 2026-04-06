---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Data Externalization
status: defining_requirements
stopped_at: "Defining requirements for v3.0"
last_updated: "2026-04-06"
last_activity: 2026-04-06
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-06)

**Core value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency
**Current focus:** Defining requirements for v3.0 Data Externalization

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-06 — Milestone v3.0 started

## Accumulated Context

### Decisions

- Types will be centralized in `src/types/` (not kept in `src/data/` or co-located with JSON)
- Out of Scope updated to clarify JSON externalization prepares for CMS but doesn't add runtime fetching

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

Last session: 2026-04-06
Stopped at: Starting v3.0 Data Externalization milestone
Resume file: None
