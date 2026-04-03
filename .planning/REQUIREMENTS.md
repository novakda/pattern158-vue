# Requirements: Pattern 158 — Vue Conversion

**Defined:** 2026-04-02
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v2.3 Requirements

Requirements for Findings Data & Rendering milestone. Each maps to roadmap phases.

### Data Model

- [ ] **DATA-01**: ExhibitFindingEntry interface with typed fields (finding required; description, background, resolution, severity all optional)
- [ ] **DATA-02**: findings[] optional array added to Exhibit interface
- [ ] **DATA-03**: findingsHeading optional string added to Exhibit interface (default: "Findings")
- [ ] **DATA-04**: 7 exhibits' table rows extracted to findings[] arrays (A, E, F, J, L, N, O)
- [ ] **DATA-05**: Custom headings preserved for exhibits with non-default headings (J, L)
- [x] **DATA-06**: Old findings table sections removed from migrated exhibits' sections[]

### Rendering

- [x] **RNDR-01**: FindingsTable component renders as semantic `<table>` on desktop
- [x] **RNDR-02**: FindingsTable renders as stacked cards on mobile (768px breakpoint)
- [x] **RNDR-03**: Column-adaptive rendering — 2-col and 3-col patterns handled automatically based on populated fields
- [x] **RNDR-04**: Severity badges with visual treatment for findings that have severity data
- [x] **RNDR-05**: FindingsTable wired into InvestigationReportLayout with empty-state suppression
- [x] **RNDR-06**: FindingsTable wired into EngineeringBriefLayout with empty-state suppression

### Documentation

- [ ] **DOC-01**: Storybook stories covering 2-col, 3-col severity, and 3-col background/resolution variants

## Previous Milestone Requirements

<details>
<summary>v2.2 Personnel Data & Rendering (12 requirements — all complete)</summary>

### Data Migration

- [x] **DATA-01**: All 14 exhibits with personnel table sections have corresponding top-level `personnel[]` arrays with properly mapped fields
- [x] **DATA-02**: Name/Title/Organization column exhibits (B, C, D, F, G, H, I, K, M, N) map to `name`, `title`, `organization` fields
- [x] **DATA-03**: Name/Title/Role column exhibits (E, J) map to `name`, `title`, `role` fields
- [x] **DATA-04**: Role/Involvement column exhibit (L) parses embedded names and maps to appropriate fields
- [x] **DATA-05**: Dan Novak entries across all exhibits have `isSelf: true` set
- [x] **DATA-06**: Old personnel table sections remain intact in `sections[]`

### Rendering

- [x] **RNDR-01**: PersonnelCard component displays named persons showing name, title, organization, and role
- [x] **RNDR-02**: PersonnelCard displays anonymous persons (no `name`) as "Title, Organization"
- [x] **RNDR-03**: PersonnelCard visually highlights `isSelf` entries
- [x] **RNDR-04**: InvestigationReportLayout renders `exhibit.personnel` using PersonnelCard
- [x] **RNDR-05**: EngineeringBriefLayout renders `exhibit.personnel` using PersonnelCard

### Documentation

- [x] **DOC-01**: Storybook stories for PersonnelCard covering named, anonymous, and self variants

</details>

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
| Promoting text-type findings (Exhibits D, M) | Prose findings don't decompose into structured rows — would lose narrative flow |
| Cross-exhibit finding comparison | 30 total findings across 7 exhibits — premature at this scale |
| Finding numbering/ID system | Not all exhibits use investigation framing — forced formality |
| Expandable/collapsible finding details | 1-3 sentences per finding — too short for progressive disclosure |
| Rich text in finding descriptions | All current descriptions are plain text — no current need |
| Remove old personnel table sections | Preparatory for future JSON/schema migration — keep both representations |
| Personnel for Exhibit O | Meta-exhibit about pattern recognition across projects, not a single team engagement |
| Three Lenses narrative cards | Content consolidation was intentional in v2.0; may revisit in future milestone |
| Featured Engagement / Flagship cards | Content consolidation was intentional in v2.0; may revisit in future milestone |
| Exhibit URL migration to /case-files/:slug | Current /exhibits/:slug paths work correctly; URL change is cosmetic |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 21 | Complete |
| DATA-02 | Phase 21 | Complete |
| DATA-03 | Phase 21 | Complete |
| DATA-04 | Phase 21 | Complete |
| DATA-05 | Phase 21 | Complete |
| DATA-06 | Phase 21 | Complete |
| RNDR-01 | Phase 22 | Complete |
| RNDR-02 | Phase 22 | Complete |
| RNDR-03 | Phase 22 | Complete |
| RNDR-04 | Phase 22 | Complete |
| RNDR-05 | Phase 23 | Complete |
| RNDR-06 | Phase 23 | Complete |
| DOC-01 | Phase 24 | Pending |

**Coverage:**
- v2.3 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-04-02*
*Last updated: 2026-04-02 after v2.3 roadmap creation*
