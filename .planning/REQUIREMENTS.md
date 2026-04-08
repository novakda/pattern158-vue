# Requirements: Pattern 158 — FAQ Page Redesign

**Defined:** 2026-04-08
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v6.0 Requirements

Requirements for FAQ page redesign milestone. Each maps to roadmap phases.

### Data Schema

- [ ] **DATA-01**: FaqItem type extended with `id: string` unique identifier per item
- [ ] **DATA-02**: FaqItem type changed from `category: string` to `categories: string[]` for multi-tag support
- [ ] **DATA-03**: FaqItem type extended with optional `exhibitNote: string` for exhibit cross-references
- [ ] **DATA-04**: FaqCategory taxonomy unified to 6-8 categories covering both existing and career-vault content
- [ ] **DATA-05**: All FAQ items in JSON updated to new schema (id, categories array, exhibitNote where applicable)

### Accordion

- [ ] **ACRD-01**: User can click any FAQ item to toggle its answer open or closed
- [ ] **ACRD-02**: Multiple FAQ items can be open simultaneously
- [ ] **ACRD-03**: Closed state shows question text + category pills + "+" icon; open state rotates icon 45° to "×"
- [ ] **ACRD-04**: Accordion uses WAI-ARIA pattern: `<button>` trigger inside heading, `aria-expanded`, `aria-controls`
- [ ] **ACRD-05**: Keyboard accessible: Tab to question, Enter/Space to toggle

### Filter

- [ ] **FLTR-01**: Filter bar displays "All" pill plus one pill per unique category
- [ ] **FLTR-02**: Only one filter active at a time; clicking a category shows only matching items
- [ ] **FLTR-03**: "All" restores full list; active pill is visually distinct
- [ ] **FLTR-04**: Live count label below filter bar reads "N questions" and updates on filter change

### Content

- [ ] **CONT-01**: 13 career-vault FAQ questions merged with existing 14, overlapping topics reconciled
- [ ] **CONT-02**: Exhibit cross-reference notes extracted from career-vault markdown to structured `exhibitNote` field
- [ ] **CONT-03**: All items tagged with unified category taxonomy (multi-tag where appropriate)

### Layout

- [ ] **LYOT-01**: Exhibit callout renders as left-bordered accent callout block inside open answers
- [ ] **LYOT-02**: Full-width stacked layout with `border-top` rules between items, `border-bottom` on last
- [ ] **LYOT-03**: Category tag pills render below question text, always visible regardless of open/closed state
- [ ] **LYOT-04**: Question text, filter pills, count label, and answer prose are all left-aligned

## Future Requirements

### Deferred

- **ANIM-01**: Smooth CSS transition on accordion open/close (grid-template-rows 0fr/1fr)
- **DEEP-01**: Deep linking to individual FAQ questions via URL hash
- **SRCH-01**: Text search input for filtering FAQ questions

## Out of Scope

| Feature | Reason |
|---------|--------|
| Single-open accordion (auto-close others) | Multi-open is better UX — users compare answers side by side |
| Expand All / Collapse All buttons | At ~27 items, expand-all recreates the wall-of-text problem |
| Accordion state persistence (localStorage) | FAQ is not a dashboard; reset on page load is correct |
| Multi-select category filtering | Single active filter is sufficient for ~27 items across 6-8 categories |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | — | Pending |
| DATA-02 | — | Pending |
| DATA-03 | — | Pending |
| DATA-04 | — | Pending |
| DATA-05 | — | Pending |
| ACRD-01 | — | Pending |
| ACRD-02 | — | Pending |
| ACRD-03 | — | Pending |
| ACRD-04 | — | Pending |
| ACRD-05 | — | Pending |
| FLTR-01 | — | Pending |
| FLTR-02 | — | Pending |
| FLTR-03 | — | Pending |
| FLTR-04 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| LYOT-01 | — | Pending |
| LYOT-02 | — | Pending |
| LYOT-03 | — | Pending |
| LYOT-04 | — | Pending |

**Coverage:**
- v6.0 requirements: 21 total
- Mapped to phases: 0
- Unmapped: 21 ⚠️

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after initial definition*
