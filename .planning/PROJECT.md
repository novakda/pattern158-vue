# Pattern 158 — Vue Conversion

## What This Is

A conversion of the Pattern 158 portfolio site from static 11ty HTML to Vue 3, serving as both Dan Novak's professional portfolio and a self-demonstrating greenfield Vue.js project. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

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

### Active

<!-- Current scope. Building toward these. -->

- [ ] Port all remaining pages from 11ty HTML to Vue (Home, FAQ, Portfolio, Contact, Testimonials, Accessibility, Review)
- [ ] Extract reusable layout components where they enforce design patterns (HeroMinimal, ContentSection, etc.)
- [ ] Refactor page templates to use extracted components — templates should read like outlines
- [ ] Ensure visual parity with published 11ty site across all pages
- [ ] Update Storybook stories to reflect new/refactored components
- [ ] Clean commit history and portfolio-ready repo structure

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- New features beyond what the 11ty site has — this is a conversion, not an expansion
- Backend/CMS/data fetching — stays fully static
- Animations/transitions — defer to a future pass
- Routing changes — keep current route structure
- SSR/SSG — SPA is sufficient for a portfolio site

## Context

- The 11ty site is published and live. The Vue version needs to reach visual parity before it can replace it.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Most pages are currently TODO placeholders with just a `hero-minimal` section and a subtitle.

## Constraints

- **Tech stack**: Vue 3 Composition API + TypeScript + Vite — already established, no changes
- **Styling**: Existing CSS design token system — components should consume tokens, not introduce new styling approaches
- **Content**: Must match published 11ty site content exactly — no editorial changes
- **Complexity**: Favor clarity over cleverness — extract components for readability, not for abstraction points

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Components for consistency, not just reuse | ADHD-informed: named components reduce cognitive load when scanning templates | — Pending |
| No new features in this pass | Clean conversion scope prevents scope creep | — Pending |
| Storybook for all components | Portfolio piece — demonstrates testing/documentation practices | — Pending |

---
*Last updated: 2026-03-16 after initialization*
