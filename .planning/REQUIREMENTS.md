# Requirements: Pattern 158 — Vue Conversion

**Defined:** 2026-04-08
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v5.3 Requirements

Requirements for FAQ Content Audit milestone. Each maps to roadmap phases.

### Content Audit

- [ ] **AUDIT-01**: User can review a structured cross-page audit comparing every FAQ answer against corresponding content on all other site pages
- [ ] **AUDIT-02**: Audit findings include issue type (stale reference, factual drift, content overlap, missing content) and recommended fix

### Stale References

- [ ] **REFS-01**: FAQ answer referencing "portfolio" uses "case files" terminology consistent with v2.0 site restructure
- [ ] **REFS-02**: FAQ technology listing reflects current primary technologies shown on TechnologiesPage (including React, Python, Power Platform, Claude Code)

### Content Accuracy

- [ ] **ACCY-01**: FAQ industry list is factually accurate and consistent with client references on Contact and Case Files pages
- [ ] **ACCY-02**: FAQ AI/automation answer reflects current tooling and experience (Claude Code as primary, Copilot Studio, practical AI focus)
- [ ] **ACCY-03**: "GitHub Spec Kit" reference verified or corrected
- [ ] **ACCY-04**: Accessibility standard phrasing consistent across FAQ and Contact page ("WCAG 2.1 AA" / "Section 508")

### Content Overlap

- [ ] **OVLP-01**: FAQ work arrangement, communication, and independence questions don't redundantly duplicate Contact page CultureFit/RoleFit content
- [ ] **OVLP-02**: FAQ "typical workflow" answer doesn't redundantly duplicate Philosophy page "How I Work" section
- [ ] **OVLP-03**: Where overlap exists, FAQ adds value beyond what Contact/Philosophy already covers (different angle, different audience, or consolidated)

## Future Requirements

None — this is a focused content audit milestone.

## Out of Scope

| Feature | Reason |
|---------|--------|
| New FAQ questions beyond audit findings | Audit-driven only — no speculative content |
| FAQ component/layout redesign | This milestone is content, not UX |
| FaqItem.vue or FaqPage.vue component refactoring | No structural changes unless required by content fixes |
| faqCategories restructure | Category changes only if audit findings warrant it |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUDIT-01 | Phase 30 | Pending |
| AUDIT-02 | Phase 30 | Pending |
| REFS-01 | Phase 31 | Pending |
| REFS-02 | Phase 31 | Pending |
| ACCY-01 | Phase 31 | Pending |
| ACCY-02 | Phase 31 | Pending |
| ACCY-03 | Phase 31 | Pending |
| ACCY-04 | Phase 31 | Pending |
| OVLP-01 | Phase 32 | Pending |
| OVLP-02 | Phase 32 | Pending |
| OVLP-03 | Phase 32 | Pending |

**Coverage:**
- v5.3 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after roadmap creation*
