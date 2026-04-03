# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

The site now features a unified Case Files evidence section with two distinct exhibit types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts. v1.0–v1.1 completed the 11ty-to-Vue conversion; v2.0 restructured the information architecture to eliminate content redundancy. v2.1 restored CSS and section rendering; v2.2 promoted personnel from embedded tables to first-class data with purpose-built rendering components supporting anonymization. v2.3 applies the same promotion pattern to findings data. v3.0 adds a visual feedback collector for dev/staging bug reporting.

## Current Milestone: v3.0 Visual Feedback Collector

**Goal:** Build a self-contained, dev/staging feedback tool that lets testers click any element on the page, annotate it, and file a GitHub Issue with full context — screenshot, element selector, viewport, and user agent.

**Target features:**
- Picker mode activation (button trigger + keyboard shortcut)
- DOM element hover highlighting with visible outline
- Element capture: tag, CSS selector path, bounding rect, html2canvas screenshot
- Comment/annotation overlay panel anchored near selected element
- GitHub Issue submission with screenshot upload (Gist primary, data URI fallback)
- Configurable via env vars (VITE_GITHUB_TOKEN, VITE_GITHUB_REPO)
- Dev/staging only — not exposed in production builds

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

- ✓ Personnel data extracted from 14 exhibits into typed personnel[] arrays with 3 column pattern mappings (DATA-01/02/03/04/05/06) — v2.2
- ✓ PersonnelCard component with named/anonymous/self display modes, CSS grid layout, design token styling (RNDR-01/02/03) — v2.2
- ✓ Personnel rendering wired into both InvestigationReportLayout and EngineeringBriefLayout (RNDR-04/05) — v2.2
- ✓ Storybook stories for PersonnelCard covering all 3 display variants (DOC-01) — v2.2

- ✓ Findings data extracted from 7 exhibits into typed findings[] arrays with 3 column pattern mappings and findingsHeading support (DATA-01/02/03/04/05/06) — v2.3
- ✓ FindingsTable component with dual-DOM responsive rendering (table desktop, card grid mobile at 768px), column-adaptive detection, severity badges (RNDR-01/02/03/04) — v2.3
- ✓ Findings rendering wired into both InvestigationReportLayout and EngineeringBriefLayout with empty-state suppression (RNDR-05/06) — v2.3
- ✓ Storybook stories for FindingsTable covering 2-col, severity, and background/resolution variants (DOC-01) — v2.3

### Active

<!-- Current scope. Building toward these. -->

- Picker mode with DOM element selection and highlighting
- Element context capture (selector path, bounding rect, screenshot)
- Comment/annotation overlay panel
- GitHub Issue submission with screenshot upload
- Dev/staging build gating

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/data fetching — stays fully static
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Interactive search/filter beyond type grouping — 15 items is far below where search adds value
- Tag-based filtering — useful at 50+ items, premature at 15

## Current State

**Shipped:** v2.3 (2026-04-03)

The site's information architecture is complete through v2.0 with 15 exhibits presented through a unified Case Files page. Two purpose-built detail layouts serve Investigation Reports and Engineering Briefs. v2.1 restored CSS and added five section type renderers. v2.2 promoted personnel from embedded table sections to first-class exhibit data — 14 exhibits have typed personnel[] arrays, rendered via PersonnelCard component with named/anonymous/self display modes. v2.3 promoted findings from embedded table sections to first-class typed arrays — 7 exhibits have ExhibitFindingEntry[] with column-adaptive rendering (2-col and 3-col patterns), rendered via FindingsTable component with dual-DOM responsive layout (table desktop, card grid mobile at 768px), severity badges, wired into both layouts with empty-state suppression. 185 unit tests passing, clean production build.

**Building:** v3.0 — Visual Feedback Collector (dev/staging bug reporting tool). Self-contained styling for future extraction. html2canvas screenshots, GitHub Issues API, Gist-based image hosting.

## Context

- The 11ty site is published and live. The Vue version has diverged from 11ty structure intentionally as of v2.0.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Codebase: ~6,800 LOC Vue + TypeScript, 185 unit tests passing, clean production build.
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
| Personnel as top-level arrays, old tables kept | Preparatory for future JSON migration; both representations coexist | ✓ Good — clean data layer, no rendering disruption |
| PersonnelCard with 3 display modes | Named/anonymous/self covers all 14 exhibits' personnel patterns | ✓ Good — single component handles all variations |
| TDD for layout integration (Phase 19) | Wiring existing component — tests lock contract before touching templates | ✓ Good — 4 tests, symmetrical change |
| Findings promotion with old section removal (unlike personnel coexistence) | Prevent duplicate rendering; findings tables have no value once first-class arrays exist | ✓ Good — 84 lines removed, no regressions |
| Dual-DOM responsive approach for FindingsTable | Render both table and card grid, CSS media query toggles visibility at 768px | ✓ Good — cleaner separation than CSS-only display transform |
| Column-adaptive detection from data shape | Auto-inspect first finding's fields to determine 2-col or 3-col layout, no explicit prop | ✓ Good — component adapts to data without configuration |
| Exhibit F corrected to M in migration set | Research discovered F has text-type findings, M has table-type — corrected from original scope | ✓ Good — research caught data classification error before execution |

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
*Last updated: 2026-04-03 after v3.0 milestone started*
