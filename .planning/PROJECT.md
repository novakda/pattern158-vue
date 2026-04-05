# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

The site now features a unified Case Files evidence section with two distinct exhibit types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts. v1.0–v1.1 completed the 11ty-to-Vue conversion; v2.0 restructured the information architecture to eliminate content redundancy. v2.1 restored CSS and section rendering; v2.2 promoted personnel from embedded tables to first-class data with purpose-built rendering components supporting anonymization. v2.3 applies the same promotion pattern to findings data. v3.0 adds a visual feedback collector for dev/staging bug reporting.

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

- ✓ FeedbackCollector with build-time gating (zero production bytes), self-contained --fb-* CSS namespace, env var validation (BUILD-01/02/03, PICK-01) — v3.0
- ✓ Element picker with Ctrl+Shift+F toggle, hover highlighting, click-to-capture context including Vue component name (PICK-02/03/04/05) — v3.0
- ✓ html2canvas screenshot capture with lazy loading and spinner overlay (SHOT-01/02) — v3.0
- ✓ AnnotationPanel with comment textarea, screenshot preview, metadata display, flip-logic positioning (ANNOT-01/02/03) — v3.0
- ✓ GitHub Issue submission via Gist upload with data URI fallback, configurable labels, success/error states (GH-01/02/03/04/05/06) — v3.0
- ✓ Canvas-based annotation drawing overlay with rectangles, arrows, undo, and compositing (ANNOT-04) — v3.0

### Active

<!-- Current scope. Building toward these. -->

None — planning next milestone.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/data fetching — stays fully static
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Interactive search/filter beyond type grouping — 15 items is far below where search adds value
- Tag-based filtering — useful at 50+ items, premature at 15
- Session replay / console capture / network capture — anti-features for lightweight dev feedback tool
- End-user facing feedback in production — dev/staging only, PAT exposure risk
- External feedback SaaS integration — self-contained by design, GitHub Issues is sole backend

## Current State

**Shipped:** v3.0 (2026-04-04)

The site's information architecture is complete with 15 exhibits presented through a unified Case Files page with two purpose-built detail layouts. Personnel and findings are promoted to first-class typed arrays with dedicated rendering components. v3.0 added a self-contained visual feedback collector for dev/staging — element picker with hover highlighting, html2canvas screenshot capture, annotation drawing overlay (rectangles/arrows), and GitHub Issue submission via Gist upload with data URI fallback. The feedback module is fully tree-shaken from production builds (zero bytes). ~7,950 LOC across 16 feedback-related files, 193+ unit tests passing, clean production build.

## Context

- The 11ty site is published and live. The Vue version has diverged from 11ty structure intentionally as of v2.0.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Codebase: ~7,950 LOC Vue + TypeScript, 193+ unit tests passing, clean production build.
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
| defineAsyncComponent + MODE gate for feedback | Zero production bytes via Vite tree-shaking; PAT never reaches prod bundle | ✓ Good — grep confirms zero feedback references in dist/ |
| Self-contained --fb-* CSS namespace | Future extraction as standalone package; no coupling to site design tokens | ✓ Good — fully independent styling |
| Native fetch over Octokit for GitHub API | Only 2 endpoints needed; avoids 5+ transitive deps for 800+ unused methods | ✓ Good — clean, minimal dependency |
| Gist-first screenshot upload with data URI fallback | GitHub Issue body limit is 65K chars; base64 PNGs easily exceed this | ✓ Good — multi-layer fallback handles all size scenarios |
| css-selector-generator over hand-rolled | Handles edge cases (shadow DOM, dynamic classes, duplicate IDs) that manual walkers miss | ✓ Good — stable, readable selectors |
| Dual-DOM annotation: canvas overlay + compositing at submit | Drawing stays separate from screenshot until final submission; clean separation of concerns | ✓ Good — annotations composited into PNG before upload |

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
*Last updated: 2026-04-04 after v3.0 milestone complete*
