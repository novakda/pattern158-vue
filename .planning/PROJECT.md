# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

v1.0–v1.1 completed the 11ty-to-Vue conversion with full content parity and exhibit consistency. v2.0 restructures the site's information architecture to resolve content redundancy and introduce two distinct exhibit presentation types.

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

*(See REQUIREMENTS.md for v2.0 milestone requirements)*

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/data fetching — stays fully static
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- `isDetailExhibit` flag documentation — classification logic undocumented but not blocking; no v1.1 requirement affected
- Full site narrative rework (homepage, philosophy, technologies) — v2.0 focuses on the evidence layer; broader narrative is a future milestone
- New exhibit content creation — restructure existing content, don't write new exhibits

## Current Milestone: v2.0 Site IA Restructure — Evidence-Based Portfolio

**Goal:** Restructure the site's information architecture so every page earns its place, replacing redundant Portfolio and Field Reports pages with a unified evidence section that distinguishes two exhibit types.

**Target features:**
- Audit and classify all 15 exhibits as "Investigation Report" or "Engineering Brief"
- Unified Case Files listing page replacing both Portfolio and Field Reports
- Distinct card styles per exhibit type on the listing page
- New "Engineering Brief" detail page template
- Remove Three Lenses (AI-generated, not authored content)
- Relocate 38-project directory as breadth signal
- Update navigation and homepage CTAs

## Context

- The 11ty site is published and live. The Vue version reached visual parity in v1.0–v1.1; v2.0 diverges from the 11ty structure intentionally.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- v1.1 shipped with 15 exhibits fully audited, 5 `investigationReport: true`, content normalized across all detail pages.
- Known human-verification pending: Storybook router decorator timing (Phase 4), badge visual on dark header (Phase 6), live browser slug resolution. Non-blocking — all automated tests pass.

## Constraints

- **Tech stack**: Vue 3 Composition API + TypeScript + Vite — already established, no changes
- **Styling**: Existing CSS design token system — components should consume tokens, not introduce new styling approaches
- **Content**: Restructure existing content; no new exhibit creation. Content wording stays as-is unless reclassification requires framing changes (e.g., heading labels)
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
*Last updated: 2026-03-27 after v2.0 milestone start*
