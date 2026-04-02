# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

The site now features a unified Case Files evidence section with two distinct exhibit types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts. v1.0–v1.1 completed the 11ty-to-Vue conversion; v2.0 restructured the information architecture to eliminate content redundancy.

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

### Active

<!-- Current scope. Building toward these. -->

## Current Milestone: v2.2 Personnel Data & Rendering

**Goal:** Promote personnel from embedded table sections to first-class exhibit data with purpose-built rendering components that support anonymization.

**Target features:**
- Extract personnel table data from 14 exhibits into top-level `personnel[]` arrays (old table sections kept intact)
- Handle column variations (Name/Title/Org, Name/Title/Role, Role/Involvement) with proper field mapping
- Build personnel rendering component(s) with named/anonymous/self display logic
- Wire personnel rendering into both InvestigationReportLayout and EngineeringBriefLayout
- Exhibit O (no personnel — meta-exhibit about pattern recognition across projects) unchanged

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/data fetching — stays fully static
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Interactive search/filter beyond type grouping — 15 items is far below where search adds value
- Tag-based filtering — useful at 50+ items, premature at 15

## Current State

**Shipped:** v2.1 (2026-04-02) | **Building:** v2.2

The site's information architecture is complete through v2.0. All 15 exhibits are presented through a unified Case Files page with type-aware styling, backed by a clean data model with explicit `exhibitType` discriminant. Two purpose-built detail layouts serve Investigation Reports (NTSB-style) and Engineering Briefs (constraints-approach-results). v2.1 restored impact tag pill CSS and added rendering for all five section types with empty section suppression. 64 unit tests passing, clean production build. Personnel data currently embedded as table sections — v2.2 promotes it to first-class data with anonymization-aware rendering.

## Context

- The 11ty site is published and live. The Vue version has diverged from 11ty structure intentionally as of v2.0.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Codebase: ~6,400 LOC Vue + TypeScript, 64 unit tests passing, clean production build.
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
*Last updated: 2026-04-02 after milestone v2.2 started*
