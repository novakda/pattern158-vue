# Requirements: Pattern 158 Vue

**Defined:** 2026-04-07
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v5.0 Requirements

Requirements for findings schema unification milestone. Each maps to roadmap phases.

### Schema Unification

- [ ] **SCHM-01**: `FindingEntry` type updated with unified field set: `finding`, `description`, `severity?`, `resolution?`, `outcome?`, `category?`
- [ ] **SCHM-02**: Exhibit A findings normalized from `background`/`resolution` to `description`/`resolution` (background content moves to description)
- [ ] **SCHM-03**: `findingsHeading` field present on all exhibits with non-default headings

### Findings Backfill

- [ ] **BKFL-01**: Exhibit D (Wells Fargo) findings extracted from narrative sections into typed `findings[]` array
- [ ] **BKFL-02**: Exhibit F (HSBC) findings extracted from narrative sections into typed `findings[]` array
- [ ] **BKFL-03**: Exhibit G (SunTrust) findings extracted from narrative sections into typed `findings[]` array
- [ ] **BKFL-04**: Exhibit H (Metal Additive) findings extracted from narrative sections into typed `findings[]` array
- [ ] **BKFL-05**: Exhibit K (Microsoft MCAPS) findings extracted from narrative sections into typed `findings[]` array

### Field Enrichment

- [ ] **ENRH-01**: Severity values populated on findings where applicable (at minimum Exhibit L; consider J, K)
- [ ] **ENRH-02**: Resolution values populated on findings where applicable (Exhibit A already has them; backfill others from Outcome/Probable Cause sections)
- [ ] **ENRH-03**: Category values populated on all findings using consistent taxonomy (architecture, protocol, ux, process, tooling, environment)

### Layout Rendering

- [ ] **LYOT-01**: Severity badges render inline with finding titles when `severity` is present
- [ ] **LYOT-02**: Resolution text renders below finding description when `resolution` is present
- [ ] **LYOT-03**: Outcome text renders below finding description when `outcome` is present
- [ ] **LYOT-04**: Category renders as a subtle label/tag when `category` is present

## v4.0 Requirements (Completed)

### Personnel Migration

- [x] **PERS-01**: Personnel tables (11 occurrences, 3 column variants) migrated to typed `personnel: PersonnelEntry[]` on Exhibit
- [x] **PERS-02**: Original personnel table sections removed from `sections[]` array in exhibits.json
- [x] **PERS-03**: Layout components render personnel from the new typed array

### Technologies Migration

- [x] **TECH-01**: Technologies tables (8 occurrences) migrated to typed `technologies: TechnologyEntry[]` on Exhibit
- [x] **TECH-02**: Original technologies table sections removed from `sections[]` array in exhibits.json
- [x] **TECH-03**: Layout components render technologies from the new typed array

### Findings Migration

- [x] **FIND-01**: Findings tables (6 occurrences, 3 column variants) migrated to typed `findings: FindingEntry[]` on Exhibit
- [x] **FIND-02**: Original findings table sections removed from `sections[]` array in exhibits.json
- [x] **FIND-03**: Layout components render findings from the new typed array

## v3.0 Requirements (Completed)

### Types Infrastructure

- [x] **TYPE-01**: All data interfaces and types are centralized in `src/types/` with barrel exports
- [x] **TYPE-02**: Cross-boundary types (`Tag`, `ExpertiseLevel`) are moved from component-local `.types.ts` files to `src/types/`
- [x] **TYPE-03**: All existing component imports of types continue to resolve (backward-compatible re-exports or updated imports)

### Simple Data Migration

- [x] **SMPL-01**: `stats.ts` data externalized to JSON with thin TypeScript loader
- [x] **SMPL-02**: `techPills.ts` data externalized to JSON with thin TypeScript loader
- [x] **SMPL-03**: `specialties.ts` data externalized to JSON with thin TypeScript loader
- [x] **SMPL-04**: `brandElements.ts` data externalized to JSON with thin TypeScript loader
- [x] **SMPL-05**: `methodologySteps.ts` data externalized to JSON with thin TypeScript loader

### Complex Data Migration

- [x] **CPLX-01**: `findings.ts` data externalized to JSON with thin TypeScript loader
- [x] **CPLX-02**: `philosophyInfluences.ts` data externalized to JSON with thin TypeScript loader
- [x] **CPLX-03**: `influences.ts` data externalized to JSON with thin TypeScript loader
- [x] **CPLX-04**: `faq.ts` data externalized to JSON with thin TypeScript loader, `faqCategories` `as const` handling preserved

### Exhibits Migration

- [x] **EXHB-01**: `exhibits.ts` data externalized to JSON with thin TypeScript loader
- [x] **EXHB-02**: All discriminated union types (`exhibitType`, section `type`) correctly asserted on JSON import
- [x] **EXHB-03**: All 9 exhibit consumer components render correctly after migration

### Validation

- [x] **VALD-01**: All existing unit tests pass after each data file conversion (64+ tests)
- [x] **VALD-02**: Clean production build (`vite build`) succeeds after each conversion
- [x] **VALD-03**: No component file changes required (thin loader pattern preserves import paths)

## Future Requirements

### CMS Integration

- **CMS-01**: Data fetched from headless CMS at build time instead of bundled JSON
- **CMS-02**: JSON schema validation for CMS-sourced content
- **CMS-03**: Preview/draft mode for CMS content editing

## Out of Scope

| Feature | Reason |
|---------|--------|
| Runtime data fetching | Site stays fully static; JSON is bundled at build time |
| Runtime validation (Zod/Valibot) | Data is version-controlled and compile-time checked; runtime validation adds deps for zero benefit |
| CMS integration | This milestone prepares the data layer; actual CMS is a future milestone |
| New exhibit content | Structural unification only — no new exhibits or narrative content creation |
| Backfill B, C, I findings | These exhibits (Recognition Chain, 1216-Lesson, TD Bank Accessibility) don't have natural findings to extract without forcing the format |
| Removing narrative findings sections | Backfilled exhibits keep their narrative sections — the findings array is additive, not a replacement |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHM-01 | Phase 23 | Pending |
| SCHM-02 | Phase 23 | Pending |
| SCHM-03 | Phase 24 | Pending |
| BKFL-01 | Phase 24 | Pending |
| BKFL-02 | Phase 24 | Pending |
| BKFL-03 | Phase 24 | Pending |
| BKFL-04 | Phase 24 | Pending |
| BKFL-05 | Phase 24 | Pending |
| ENRH-01 | Phase 25 | Pending |
| ENRH-02 | Phase 25 | Pending |
| ENRH-03 | Phase 25 | Pending |
| LYOT-01 | Phase 26 | Pending |
| LYOT-02 | Phase 26 | Pending |
| LYOT-03 | Phase 26 | Pending |
| LYOT-04 | Phase 26 | Pending |

**Coverage:**
- v5.0 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-04-07*
*Last updated: 2026-04-07 after roadmap creation*
