# Pattern 158 — Vue Conversion

## What This Is

A conversion of the Pattern 158 portfolio site from static 11ty HTML to Vue 3, serving as both Dan Novak's professional portfolio and a self-demonstrating greenfield Vue.js project. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

v1.1 delivered exhibit content consistency: all 15 exhibit detail pages were audited, structural formatting inconsistencies fixed, and approved content gaps filled.

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

### Active

<!-- Current scope. Building toward these. -->

*(No active requirements — planning next milestone)*

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- New features beyond what the 11ty site has — this is a conversion, not an expansion
- Backend/CMS/data fetching — stays fully static
- Animations/transitions — defer to a future pass
- Routing changes — keep current route structure
- SSR/SSG — SPA is sufficient for a portfolio site
- `isDetailExhibit` flag documentation — classification logic undocumented but not blocking; no v1.1 requirement affected

## Context

- The 11ty site is published and live. The Vue version needs to reach visual parity before it can replace it.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- v1.1 shipped with 15 exhibits fully audited, 5 `investigationReport: true`, content normalized across all detail pages.
- Known human-verification pending: Storybook router decorator timing (Phase 4), badge visual on dark header (Phase 6), live browser slug resolution. Non-blocking — all automated tests pass.

## Constraints

- **Tech stack**: Vue 3 Composition API + TypeScript + Vite — already established, no changes
- **Styling**: Existing CSS design token system — components should consume tokens, not introduce new styling approaches
- **Content**: Must match published 11ty site content exactly — no editorial changes
- **Complexity**: Favor clarity over cleverness — extract components for readability, not for abstraction points

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Components for consistency, not just reuse | ADHD-informed: named components reduce cognitive load when scanning templates | ✓ Good — pattern held through all 8 phases |
| No new features in this pass | Clean conversion scope prevents scope creep | ✓ Good — audit found only fixable items, no drift |
| Storybook for all components | Portfolio piece — demonstrates testing/documentation practices | ✓ Good — all components documented |
| CONT-02 user-gated (no content without approval) | Exhibit content is authoritative — Dan must approve each gap fill | ✓ Good — zero unsanctioned content added |
| `useHead(computed(...))` for ExhibitDetailPage SEO | `useSeo()` only accepts plain strings; dynamic title needed per slug | ✓ Good — works correctly |
| `.badge-aware` CSS class for investigation badge | Muted/neutral styling avoids color collision with teal exhibit label on dark header | ✓ Good — visually subordinate to title as intended |
| TDD for ExhibitCard CTA fix (Phase 8) | CTA text inversion was a behavioral bug — tests lock the correct mapping | ✓ Good — RouterLink slot-rendering stub pattern established |

---
*Last updated: 2026-03-19 after v1.1 milestone*
