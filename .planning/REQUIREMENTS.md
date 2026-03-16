# Requirements: Pattern 158 Vue Conversion

**Defined:** 2026-03-16
**Core Value:** Every page template should be scannable and self-documenting through well-named components

## v1 Requirements

Requirements for conversion milestone. Each maps to roadmap phases.

### Page Conversion

- [ ] **PAGE-01**: Port HomePage from 11ty with complete content
- [ ] **PAGE-02**: Port FaqPage from 11ty with complete content
- [ ] **PAGE-03**: Port PortfolioPage from 11ty with complete content
- [ ] **PAGE-04**: Port ContactPage from 11ty with complete content
- [ ] **PAGE-05**: Port TestimonialsPage from 11ty with complete content
- [ ] **PAGE-06**: Port AccessibilityPage from 11ty with complete content
- [ ] **PAGE-07**: Port ReviewPage from 11ty with complete content

### Component Architecture

- [ ] **COMP-01**: Extract named concept components (FindingCard, SpecialtyCard, StatItem, FaqItem, etc.)
- [ ] **COMP-02**: All extracted components use `defineProps<{}>()` TypeScript generic form
- [ ] **COMP-03**: Page templates read as scannable outlines (target <50 lines per template)
- [ ] **COMP-04**: Layout components use named slots for flexible composition

### Accessibility Fix

- [x] **A11Y-01**: Fix nested `<main>` invalid HTML in TechnologiesPage and ContactPage

### Storybook

- [ ] **STORY-01**: All new and refactored components have Storybook stories with prop variants

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
| PAGE-01 | Phase 2 | Pending |
| PAGE-02 | Phase 3 | Pending |
| PAGE-03 | Phase 3 | Pending |
| PAGE-04 | Phase 3 | Pending |
| PAGE-05 | Phase 3 | Pending |
| PAGE-06 | Phase 3 | Pending |
| PAGE-07 | Phase 3 | Pending |
| COMP-01 | Phase 3 | Pending |
| COMP-02 | Phase 2 | Pending |
| COMP-03 | Phase 3 | Pending |
| COMP-04 | Phase 3 | Pending |
| A11Y-01 | Phase 1 | Complete |
| STORY-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

**Note:** COMP-04 moved from Phase 2 to Phase 3 during plan revision. Phase 2 components are concept components (FindingCard, SpecialtyCard, etc.) that are props-driven. Named slots for flexible composition applies to layout-level components which Phase 3 will introduce when porting remaining pages.

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 after plan revision (COMP-04 moved to Phase 3)*
