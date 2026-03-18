---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Completed 04-03-PLAN.md
last_updated: "2026-03-18T03:52:33.589Z"
last_activity: 2026-03-16 — Roadmap created; phases derived from requirements
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 14
  completed_plans: 14
  percent: 100
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

Progress: [██████████] 100%

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
| Phase 03-remaining-pages-completion P02 | 25 | 2 tasks | 3 files |
| Phase 03-remaining-pages-completion P01 | 35 | 3 tasks | 3 files |
| Phase 03-remaining-pages-completion P03 | 6 | 2 tasks | 8 files |
| Phase 03-remaining-pages-completion P04 | 35 | 2 tasks | 17 files |
| Phase 03-remaining-pages-completion P05 | 4 | 1 tasks | 8 files |
| Phase 03-remaining-pages-completion P06 | 10 | 2 tasks | 15 files |
| Phase 04-exhibit-detail-pages P01 | 2 | 2 tasks | 5 files |
| Phase 04-exhibit-detail-pages P02 | 2 | 2 tasks | 2 files |
| Phase 04-exhibit-detail-pages P03 | 5 | 1 tasks | 1 files |

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
- [Phase 03-remaining-pages-completion]: ContactPage already in parity with 11ty source — no changes needed (PAGE-04 satisfied)
- [Phase 03-remaining-pages-completion]: AccessibilityPage lead paragraph placed in HeroMinimal default slot per component slot interface
- [Phase 03-remaining-pages-completion]: Static FAQ rendering confirmed: no accordion, no details/summary, no v-show per locked plan decision
- [Phase 03-remaining-pages-completion]: TestimonialQuote not used for exhibit cards: richer structure (tables, context, tags) does not map to component props
- [Phase 03-remaining-pages-completion]: FaqItem renders plain text split on double-newline — no v-html, no HTML markup in data strings
- [Phase 03-remaining-pages-completion]: PortfolioPage directory table kept inline (7 industry sections, 30+ rows) — structured prose per plan decision
- [Phase 03-remaining-pages-completion]: ExhibitCard named slots (quote/context/table/actions) accommodate structural variation across 14 exhibits without per-exhibit slot overrides
- [Phase 03-remaining-pages-completion]: PhilosophyInfluence.applicationParts uses (string | InfluenceLink)[] for type-safe router-link content instead of v-html
- [Phase 03-remaining-pages-completion]: Inline mock data used in story args rather than importing data files — keeps stories self-contained and avoids path resolution issues in Storybook context
- [Phase 03-remaining-pages-completion]: Page story files existed with Default only; added Mobile375/Tablet768/Desktop1280 viewport exports to satisfy STORY-01 coverage
- [Phase 03-remaining-pages-completion]: ExhibitCard WithCustomSlots story uses render function to demonstrate COMP-04 named slot composition pattern
- [Phase 04-exhibit-detail-pages]: ExhibitDetailPage.vue stub created to unblock router tests — Vite transform requires imported file to exist even for lazy route imports
- [Phase 04-exhibit-detail-pages]: /exhibits/:slug route inserted immediately before catch-all /:pathMatch(.*)*; no name property added to exhibit route
- [Phase 04-exhibit-detail-pages]: Exhibit O investigationReport: false — ContentAIQ is an integration thread narrative, not a forensic investigation report
- [Phase 04-exhibit-detail-pages]: useHead(computed(...)) used for dynamic SEO title on ExhibitDetailPage — useSeo() only accepts plain strings and cannot react to slug changes
- [Phase 04-exhibit-detail-pages]: Vue Test Utils router-link-stub: use wrapper.find('[to="/portfolio"]') not findAllComponents by name — stubs render as DOM elements with attribute selectors
- [Phase 04-exhibit-detail-pages]: Mock router decorator (makeExhibitRouter) provides vue-router instance pushed to /exhibits/exhibit-a — story renders with Exhibit A content without modifying component props

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1]: `TechnologiesPage.vue` and `ContactPage.vue` have nested `<main>` — invalid HTML breaking accessibility; must fix before adding pages
- [Phase 1]: `PhilosophyPage.vue` has four `<router-link>` tags to non-existent exhibit routes — no catch-all 404 route exists, failures are silent
- [Phase 4/v2]: Deployment hosting environment not confirmed — history-mode redirect config format differs by host (Netlify `_redirects` vs. others); confirm before go-live

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260317-wd3 | Fix 3 new Copilot findings: exhibit-h.html extra closing divs + section-heading indent in all 6 report sections, accessibility.html dt rename "Automated Testing" → "Tool-Assisted Review", PR description updated | 2026-03-17 | 73c9be6 | [260317-wd3-fix-3-new-copilot-findings-exhibit-h-div](.planning/quick/260317-wd3-fix-3-new-copilot-findings-exhibit-h-div/) |
| 260317-tl7 | Fix UX audit findings: ExhibitDetailPage wrong CSS tokens, btn touch target, timezone-note border-radius, dead FAQ CSS, orphaned section-alt rule | 2026-03-18 | 3537f95 | [260317-tl7-fix-ux-audit-findings-exhibitdetailpage-](.planning/quick/260317-tl7-fix-ux-audit-findings-exhibitdetailpage-/) |
| 260317-ucm | Document 8 Copilot PR review findings for novakda/pattern158.solutions PR #1 — triaged by severity with exact fix actions | 2026-03-18 | 37c7468 | [260317-ucm-review-copilot-pull-request-comments-on-](.planning/quick/260317-ucm-review-copilot-pull-request-comments-on-/) |
| 260317-ujd | Apply all 8 triaged Copilot PR fixes to pattern158.solutions: JSON-LD comments, p-wrapping dl, duplicate class attrs, stray p tags, false axe-core claim, dead sitemap URL, CSS testimonial selector expansion | 2026-03-17 | c57c485 | [260317-ujd-implement-all-triaged-copilot-pr-fixes-i](.planning/quick/260317-ujd-implement-all-triaged-copilot-pr-fixes-i/) |
| 260317-vrl | Fix 6 new Copilot PR findings: philosophy.html invalid HTML nesting (p>ol, p>div, p>p, p>article), CSS quote selectors expanded to philosophy/faq, accessibility.html test claim corrected, 15 exhibit inline style blocks extracted to main.css | 2026-03-17 | f78a3db | [260317-vrl-fix-6-new-copilot-pr-findings-philosophy](.planning/quick/260317-vrl-fix-6-new-copilot-pr-findings-philosophy/) |

## Session Continuity

Last session: 2026-03-17T00:00:00Z
Stopped at: Completed quick task 260317-wd3: Fixed exhibit-h extra divs, accessibility dt rename, PR description update
Resume file: None
