# Requirements: Pattern 158 Vue Conversion

**Defined:** 2026-03-16
**Core Value:** Every page template should be scannable and self-documenting through well-named components

## v1.1 Requirements

Requirements for exhibit content consistency milestone. Each maps to roadmap phases.

### Audit

- [x] **AUDIT-01**: Produce structured per-exhibit comparison table documenting all section variations (headings, quotes, tables, flags) across all 15 exhibits
- [x] **AUDIT-02**: Classify each variation as intentional (content-driven), formatting inconsistency (fixable), or content gap (needs review)

### Structure

- [x] **STRUCT-01**: Normalize `contextHeading` naming — one consistent label convention applied across all exhibits
- [x] **STRUCT-02**: Fix `investigationReport` flag display logic — button text must semantically match the flag value (currently appears inverted)
- [x] **STRUCT-03**: Standardize quote attribution format — consistent use of `role` field across exhibits that have quotes

### Content

- [x] **CONT-01**: Produce content gap decision list for Dan's review (Exhibit D missing context, 8 exhibits without quotes, etc.)
- [x] **CONT-02**: Implement approved content additions to `exhibits.ts`

## v1 Requirements

Requirements for conversion milestone. Each maps to roadmap phases.

### Page Conversion

- [x] **PAGE-01**: Port HomePage from 11ty with complete content
- [x] **PAGE-02**: Port FaqPage from 11ty with complete content
- [x] **PAGE-03**: Port PortfolioPage from 11ty with complete content
- [x] **PAGE-04**: Port ContactPage from 11ty with complete content
- [x] **PAGE-05**: Port TestimonialsPage from 11ty with complete content
- [x] **PAGE-06**: Port AccessibilityPage from 11ty with complete content
- [x] **PAGE-07**: Port ReviewPage from 11ty with complete content

### Component Architecture

- [x] **COMP-01**: Extract named concept components (FindingCard, SpecialtyCard, StatItem, FaqItem, etc.)
- [x] **COMP-02**: All extracted components use `defineProps<{}>()` TypeScript generic form
- [x] **COMP-03**: Page templates read as scannable outlines (target <50 lines per template)
- [x] **COMP-04**: Layout components use named slots for flexible composition

### Accessibility Fix

- [x] **A11Y-01**: Fix nested `<main>` invalid HTML in TechnologiesPage and ContactPage

### Storybook

- [x] **STORY-01**: All new and refactored components have Storybook stories with prop variants

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Correctness

- **CORR-01**: All internal links use `<router-link>` with no `.html` hrefs
- **CORR-02**: 404 catch-all route with NotFoundPage component

### Visual Verification

- **VIS-01**: Visual parity verified at 375px/768px/1280px in light and dark themes
- **VIS-02**: HeroMinimal component adopted on all inner pages

### Data Architecture

- **DATA-01**: TypeScript data files in src/data/ for FAQ, testimonials, portfolio content

### Deployment

- **DEPLOY-01**: History-mode redirect config for static hosting
- **DEPLOY-02**: External links audit (rel="noopener" target="_blank")

### Testing

- **TEST-01**: Install vitest-browser-vue for real browser component testing

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| New features beyond 11ty site | Conversion, not expansion |
| Animations/transitions | Deferred to future pass; accessibility risk |
| Backend/CMS/data fetching | Stays fully static |
| Routing changes | Keep current route structure |
| Pinia state management | No shared reactive state in a static portfolio |
| Nuxt SSR/SSG | Architectural pivot, out of scope |
| Contact form backend | Not in 11ty site |
| Blog/article system | Scope creep |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAGE-01 | Phase 2 | Complete |
| PAGE-02 | Phase 3 | Complete |
| PAGE-03 | Phase 3, Phase 4 | Complete |
| PAGE-04 | Phase 3 | Complete |
| PAGE-05 | Phase 3, Phase 4 | Complete |
| PAGE-06 | Phase 3 | Complete |
| PAGE-07 | Phase 3 | Complete |
| COMP-01 | Phase 3 | Complete |
| COMP-02 | Phase 2 | Complete |
| COMP-03 | Phase 3 | Complete |
| COMP-04 | Phase 3 | Complete |
| A11Y-01 | Phase 1 | Complete |
| STORY-01 | Phase 3 | Complete |
| AUDIT-01 | Phase 5 | Complete |
| AUDIT-02 | Phase 5 | Complete |
| STRUCT-01 | Phase 6 | Complete |
| STRUCT-02 | Phase 8 | Complete |
| STRUCT-03 | Phase 6 | Complete |
| CONT-01 | Phase 7 | Complete |
| CONT-02 | Phase 7 | Complete |

**Coverage:**
- v1 requirements: 13 total — mapped: 13, unmapped: 0
- v1.1 requirements: 7 total — mapped: 7, unmapped: 0 (all complete)

**Note:** COMP-04 moved from Phase 2 to Phase 3 during plan revision. Phase 2 components are concept components (FindingCard, SpecialtyCard, etc.) that are props-driven. Named slots for flexible composition applies to layout-level components which Phase 3 will introduce when porting remaining pages.

**Note:** CONT-02 implementation confirmed complete in commit 3fcaa6a — all approved content additions verified present in exhibits.ts.

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-19 after Phase 8 completion (STRUCT-02 closed)*
