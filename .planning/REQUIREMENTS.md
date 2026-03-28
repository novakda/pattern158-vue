# Requirements: Pattern 158 Vue — v2.0 IA Restructure

**Defined:** 2026-03-27
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v2.0 Requirements

Requirements for site IA restructure. Each maps to roadmap phases.

### Data Model

- [ ] **DATA-01**: Exhibit interface uses explicit `exhibitType: 'investigation-report' | 'engineering-brief'` discriminant replacing ambiguous boolean flags
- [ ] **DATA-02**: All 15 exhibits classified with correct `exhibitType` value (5 investigation reports, 10 engineering briefs) via audit
- [ ] **DATA-03**: Flagship summary fields from `portfolioFlagships.ts` merged into Exhibit interface as single source of truth
- [ ] **DATA-04**: `portfolioFlagships.ts` and `portfolioNarratives.ts` removed after data consolidation

### Listing Page

- [ ] **LIST-01**: Unified Case Files page renders all 15 exhibits with type-aware card styling
- [ ] **LIST-02**: Exhibits grouped by type on listing page (Investigation Reports section and Engineering Briefs section)
- [ ] **LIST-03**: Visual type distinction on cards (badge, border, or icon variation per exhibit type)
- [ ] **LIST-04**: Stats bar consolidated onto Case Files page (38 Projects, 6,000+ Emails, 15+ Industries)
- [ ] **LIST-05**: 38-project directory table relocated to Case Files page as breadth signal

### Detail Templates

- [ ] **DTPL-01**: ExhibitDetailPage dispatches to InvestigationReportLayout or EngineeringBriefLayout via `<component :is>` based on `exhibitType`
- [ ] **DTPL-02**: Investigation Report layout preserves existing NTSB-style presentation (timeline, probable cause, contributing factors, personnel tables)
- [ ] **DTPL-03**: Engineering Brief layout emphasizes constraints navigated, approach taken, and lasting results rather than forensic diagnosis framing
- [ ] **DTPL-04**: Both layout types display appropriate type label in detail page header

### Navigation & Routes

- [ ] **NAV-01**: NavBar updated: two menu items (Portfolio + Field Reports) collapsed to single Case Files entry
- [ ] **NAV-02**: `/case-files` route added (or equivalent agreed name)
- [ ] **NAV-03**: `/portfolio` and `/testimonials` routes redirect to new Case Files route
- [ ] **NAV-04**: All hardcoded references to old routes updated across codebase (10+ files identified by research)
- [ ] **NAV-05**: Detail page back-navigation links updated to point to Case Files

### Content Cleanup

- [ ] **CLN-01**: Three Lenses section removed from site (AI-generated content, not authored)
- [ ] **CLN-02**: NarrativeCard component removed
- [ ] **CLN-03**: PortfolioPage.vue and TestimonialsPage.vue retired after Case Files is live
- [ ] **CLN-04**: Homepage "View My Work" CTA updated to point to Case Files
- [ ] **CLN-05**: Homepage "View All Field Reports" link updated to point to Case Files

## v2.x Requirements

Deferred to after v2.0 validation. Tracked but not in current roadmap.

### Refinements

- **REF-01**: Storybook stories for new/modified components (CaseFilesPage, layouts, updated cards)
- **REF-02**: Engineering Brief layout refinements based on per-exhibit review
- **REF-03**: TestimonialsMetrics component disposition (keep, relocate, or absorb)

### Future Consideration (v3+)

- **FUT-01**: New exhibit content creation (additional Engineering Briefs or Investigation Reports)
- **FUT-02**: Technology cross-references between exhibits ("See also" links)
- **FUT-03**: Expanded/filterable project directory if it grows past 38

## Out of Scope

| Feature | Reason |
|---------|--------|
| Interactive search/filter beyond type grouping | 15 items is far below where search adds value; overengineering signals poor judgment |
| New exhibit content creation | IA restructure only; content creation is a separate activity |
| Animations/transitions | Explicitly deferred in PROJECT.md; adds complexity without evidence value |
| CMS or markdown content | Static TS data is correct for 15 exhibits; typed data file is itself a portfolio artifact |
| Tag-based filtering | Useful at 50+ items, premature at 15 |
| Full site narrative rework (homepage, philosophy, technologies) | v2.0 focuses on evidence layer; broader narrative is a future milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | — | Pending |
| DATA-02 | — | Pending |
| DATA-03 | — | Pending |
| DATA-04 | — | Pending |
| LIST-01 | — | Pending |
| LIST-02 | — | Pending |
| LIST-03 | — | Pending |
| LIST-04 | — | Pending |
| LIST-05 | — | Pending |
| DTPL-01 | — | Pending |
| DTPL-02 | — | Pending |
| DTPL-03 | — | Pending |
| DTPL-04 | — | Pending |
| NAV-01 | — | Pending |
| NAV-02 | — | Pending |
| NAV-03 | — | Pending |
| NAV-04 | — | Pending |
| NAV-05 | — | Pending |
| CLN-01 | — | Pending |
| CLN-02 | — | Pending |
| CLN-03 | — | Pending |
| CLN-04 | — | Pending |
| CLN-05 | — | Pending |

**Coverage:**
- v2.0 requirements: 23 total
- Mapped to phases: 0
- Unmapped: 23 (pending roadmap)

---
*Requirements defined: 2026-03-27*
*Last updated: 2026-03-27 after initial definition*
