# Requirements: Pattern 158 — Vue Conversion

**Defined:** 2026-04-02
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v2.2 Requirements

Requirements for Personnel Data & Rendering milestone. Each maps to roadmap phases.

### Data Migration

- [ ] **DATA-01**: All 14 exhibits with personnel table sections have corresponding top-level `personnel[]` arrays with properly mapped fields
- [ ] **DATA-02**: Name/Title/Organization column exhibits (B, C, D, F, G, H, I, K, M, N) map to `name`, `title`, `organization` fields
- [ ] **DATA-03**: Name/Title/Role column exhibits (E, J) map to `name`, `title`, `role` fields
- [ ] **DATA-04**: Role/Involvement column exhibit (L) parses embedded names and maps to appropriate fields
- [ ] **DATA-05**: Dan Novak entries across all exhibits have `isSelf: true` set
- [ ] **DATA-06**: Old personnel table sections remain intact in `sections[]`

### Rendering

- [ ] **RNDR-01**: PersonnelCard component displays named persons showing name, title, organization, and role
- [ ] **RNDR-02**: PersonnelCard displays anonymous persons (no `name`) as "Title, Organization"
- [ ] **RNDR-03**: PersonnelCard visually highlights `isSelf` entries
- [ ] **RNDR-04**: InvestigationReportLayout renders `exhibit.personnel` using PersonnelCard
- [ ] **RNDR-05**: EngineeringBriefLayout renders `exhibit.personnel` using PersonnelCard

### Documentation

- [ ] **DOC-01**: Storybook stories for PersonnelCard covering named, anonymous, and self variants

## Previous Milestone Requirements

<details>
<summary>v2.1 Case Files Bug Fixes (6 requirements — all complete)</summary>

### CSS Restoration

- [x] **CSS-01**: Impact tags on Case Files page and exhibit detail pages display with pill/badge styling (background, border-radius, padding)
- [x] **CSS-02**: Impact tags container uses flexbox wrap layout with proper gap spacing

### Section Rendering

- [x] **SECT-01**: Timeline sections (6 occurrences) render their entries with dates and descriptions
- [x] **SECT-02**: Metadata sections (15 occurrences) render their key-value items in a structured layout
- [x] **SECT-03**: Flow sections (1 occurrence) render their step content
- [x] **SECT-04**: Sections with no renderable content do not render at all (no orphaned headings)

</details>

## Future Requirements

None identified.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Remove old personnel table sections | Preparatory for future JSON/schema migration — keep both representations |
| Personnel for Exhibit O | Meta-exhibit about pattern recognition across projects, not a single team engagement |
| Three Lenses narrative cards | Content consolidation was intentional in v2.0; may revisit in future milestone |
| Featured Engagement / Flagship cards | Content consolidation was intentional in v2.0; may revisit in future milestone |
| Exhibit URL migration to /case-files/:slug | Current /exhibits/:slug paths work correctly; URL change is cosmetic |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 17 | Pending |
| DATA-02 | Phase 17 | Pending |
| DATA-03 | Phase 17 | Pending |
| DATA-04 | Phase 17 | Pending |
| DATA-05 | Phase 17 | Pending |
| DATA-06 | Phase 17 | Pending |
| RNDR-01 | Phase 18 | Pending |
| RNDR-02 | Phase 18 | Pending |
| RNDR-03 | Phase 18 | Pending |
| RNDR-04 | Phase 19 | Pending |
| RNDR-05 | Phase 19 | Pending |
| DOC-01 | Phase 20 | Pending |

**Coverage:**
- v2.2 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after roadmap creation*
