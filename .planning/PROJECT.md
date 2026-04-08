# Pattern 158 — Vue Conversion

## What This Is

An evidence-based portfolio site for Dan Novak, built in Vue 3, serving three audiences: hiring managers evaluating fit, potential clients assessing trust, and as the foundation of the Pattern 158 brand identity. The code quality, component architecture, and engineering decisions are themselves portfolio artifacts — the site showcases Vue skills by being built with them.

The site now features a unified Case Files evidence section with two distinct exhibit types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts. v1.0–v1.1 completed the 11ty-to-Vue conversion; v2.0 restructured the information architecture to eliminate content redundancy. v3.0 externalized all data to JSON with centralized TypeScript types, decoupling content from code for future CMS readiness. v4.0 normalized recurring exhibit table data (personnel, technologies, findings) into typed first-class arrays, eliminating 31 generic string[][] table sections.

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
- ✓ Impact tag pill/badge CSS restored after accidental deletion (CSS-01, CSS-02) — v2.1
- ✓ Timeline, metadata, flow section rendering with empty section suppression (SECT-01/02/03/04) — v2.1

- ✓ All 11 data files externalized from TypeScript to JSON with thin loaders (TYPE-01, SMPL-01-05, CPLX-01-04, EXHB-01) — v3.0
- ✓ Centralized type definitions in src/types/ with barrel exports (TYPE-01, TYPE-02) — v3.0
- ✓ Cross-boundary types (Tag, ExpertiseLevel) moved to src/types/ with backward-compatible shims (TYPE-02, TYPE-03) — v3.0
- ✓ Discriminated unions (exhibitType, section type) correctly asserted on JSON import (EXHB-02) — v3.0
- ✓ Zero component file changes — all existing imports resolve unchanged (VALD-03) — v3.0

- ✓ Personnel tables (13 exhibits, 3 column variants) promoted to typed `personnel: PersonnelEntry[]` arrays (PERS-01/02/03) — v4.0
- ✓ Technologies tables (11 exhibits) promoted to typed `technologies: TechnologyEntry[]` arrays (TECH-01/02/03) — v4.0
- ✓ Findings tables (7 exhibits, 3 column variants) promoted to typed `findings: FindingEntry[]` arrays with custom headings (FIND-01/02/03) — v4.0

- ✓ FindingEntry unified schema: finding, description?, resolution?, outcome?, category?, severity? — background removed (SCHM-01/02) — v5.0
- ✓ Findings backfilled for 4 exhibits (D, F, H, K) with NTSB-style diagnostic content (BKFL-01/02/04/05) — v5.0
- ✓ All 45 findings enriched with category, severity (diagnostic exhibits), resolution (where applicable) (ENRH-01/02/03) — v5.0
- ✓ Layout rendering: severity badges, category tags, resolution/outcome text in both detail layouts (LYOT-01/02/03/04) — v5.0

- ✓ Personnel and technologies mobile card layout matching findings pattern (PERS-04/05, TECH-04/05) — v5.1

- ✓ Personnel entries with titles/roles in name field corrected across 12 exhibits (DATA-01) — v5.2
- ✓ Exhibit L personnel normalized from role/involvement to standard name/title/organization schema (DATA-02) — v5.2
- ✓ PersonnelEntry type extended with entryType: 'individual' | 'group' | 'anonymized' (DATA-03) — v5.2
- ✓ All 7 group entries marked with entryType: 'group' (DATA-04) — v5.2
- ✓ All anonymized/unnamed personnel marked with entryType: 'anonymized' (DATA-05) — v5.2

- ✓ Group personnel entries render as compact/muted cards with reduced prominence (CARD-01) — v5.2
- ✓ Anonymized personnel entries render with italic/muted visual distinction (CARD-02) — v5.2
- ✓ Card heading logic uses best available field: name → title → role (CARD-03) — v5.2
- ✓ Desktop table rows reflect entryType distinctions (CARD-04) — v5.2

### Active

<!-- Current scope. Building toward these. -->

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Backend/CMS/runtime data fetching — JSON data layer is CMS-ready but no runtime fetching or backend yet
- Animations/transitions — defer to a future pass
- SSR/SSG — SPA is sufficient for a portfolio site
- New exhibit content creation — restructure existing content, don't write new exhibits
- Interactive search/filter beyond type grouping — 15 items is far below where search adds value
- Tag-based filtering — useful at 50+ items, premature at 15

## Current State

**Shipped:** v5.2 (2026-04-08) | **Status:** All milestones through v5.2 complete

All 11 data files externalized to JSON with thin TypeScript loaders in `src/data/`. Type definitions centralized in `src/types/` with barrel exports. Data layer is CMS-ready — content lives in pure JSON, types in TypeScript, and all component imports remain unchanged through backward-compatible loader pattern. Recurring exhibit table data (personnel, technologies, findings) promoted to typed first-class arrays — 31 generic string[][] sections eliminated, 6 one-off tables remain as generic sections. Findings unified across 11 exhibits with NTSB-style diagnostic content, category taxonomy, severity on diagnostic exhibits, and enriched layout rendering. Personnel data normalized: 26 title-as-name entries corrected, Exhibit L schema unified, all 66 entries typed with entryType (individual/group/anonymized). Mobile cards and desktop tables visually distinguish entry types with compact group cards, italic anonymized entries, and heading cascade (name → title → role). 95 unit tests passing, clean production build.

## Context

- The 11ty site is published and live. The Vue version has diverged from 11ty structure intentionally as of v2.0.
- Dan has 28+ years of professional experience, deep Vue brownfield expertise, but this is his first greenfield Vue project built from scratch with his own design preferences.
- Component extraction is driven by cognitive load management (ADHD-informed), not just reuse. A component is worth extracting if it names a concept, enforces a pattern, or makes a template scannable — even if it's only used once.
- The CSS is a comprehensive design system (~3500+ lines) already using custom properties and cascade layers. Components should work with this system, not replace it.
- Codebase: ~6,700 LOC Vue + TypeScript, 95 unit tests passing, clean production build.
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
| Thin loader pattern for JSON externalization | Each `src/data/*.ts` imports JSON, asserts types, re-exports — preserves all import paths with zero consumer changes | ✓ Good — all 11 files migrated, zero `.vue` files touched |
| Centralized `src/types/` with barrel exports | Single import path for all data types; eliminates scattered type co-location | ✓ Good — 13 type files, clean barrel, cross-boundary types resolved |
| `faqCategories` kept as `as const` in TypeScript | JSON cannot express literal type narrowing; `as const satisfies` preserves compile-time category validation | ✓ Good — faqItems in JSON, categories typed correctly |
| `as Exhibit[]` type assertion for discriminated unions | JSON import widens string literals to `string`; explicit assertion restores discriminated union narrowing | ✓ Good — TypeScript catches type mismatches, all consumers work |
| First-class typed arrays for recurring table data | Personnel (13), technologies (11), findings (7) tables promoted from generic `string[][]` to typed interfaces; one-off tables (6) stay as generic sections | ✓ Good — 31 sections eliminated, typed fields queryable |
| Field-presence variant detection in templates | `v-if="exhibit.findings[0].background !== undefined"` detects column variant at render time instead of storing variant type | ✓ Good — no extra discriminant needed, clean templates |
| `findingsHeading` for non-default headings | Custom findings headings (Exhibits J, L) stored as optional field; layout renders `findingsHeading \|\| 'Findings'` | ✓ Good — preserves original heading text without hardcoding |
| NTSB-style findings only | Findings must be diagnostic discoveries (what went wrong, why) — not outcomes, observations, or achievements. Some exhibits (G) don't have natural findings — skip rather than force | ✓ Good — Exhibit G skipped, Exhibit K findings revised from 4→2 to remove outcome-style entries |
| Severity only for diagnostic findings | Severity applies to technical/process issues, not observational content. Investigation-report types and diagnostic engineering-briefs get severity; pattern-recognition exhibits (E, M, N, O) don't | ✓ Good — consistent application across 11 exhibits with findings |
| `entryType` discriminant for personnel rendering | Three-way classification (individual/group/anonymized) drives CSS class bindings for mobile cards and desktop table rows — no rendering logic in templates beyond class binding | ✓ Good — clean separation of data classification from visual treatment |
| Heading cascade `name → title → role` | First available field becomes card heading; dynamic `data-label` matches the field used — handles all personnel variants without separate template branches | ✓ Good — Exhibit L entries with no name correctly show title |

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
*Last updated: 2026-04-08 after v5.2 milestone completion*
