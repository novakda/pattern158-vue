# Requirements: Pattern 158 Vue

**Defined:** 2026-04-06
**Core Value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency

## v3.0 Requirements

Requirements for data externalization milestone. Each maps to roadmap phases.

### Types Infrastructure

- [ ] **TYPE-01**: All data interfaces and types are centralized in `src/types/` with barrel exports
- [ ] **TYPE-02**: Cross-boundary types (`Tag`, `ExpertiseLevel`) are moved from component-local `.types.ts` files to `src/types/`
- [ ] **TYPE-03**: All existing component imports of types continue to resolve (backward-compatible re-exports or updated imports)

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

- [ ] **EXHB-01**: `exhibits.ts` data externalized to JSON with thin TypeScript loader
- [ ] **EXHB-02**: All discriminated union types (`exhibitType`, section `type`) correctly asserted on JSON import
- [ ] **EXHB-03**: All 9 exhibit consumer components render correctly after migration

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
| New data content | Structural refactor only -- no new exhibits, FAQs, or other content |
| Component refactoring | Thin loaders preserve all import paths; components stay unchanged |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TYPE-01 | Phase 17 | Pending |
| TYPE-02 | Phase 17 | Pending |
| TYPE-03 | Phase 17 | Pending |
| SMPL-01 | Phase 17 | Complete |
| SMPL-02 | Phase 17 | Complete |
| SMPL-03 | Phase 17 | Complete |
| SMPL-04 | Phase 17 | Complete |
| SMPL-05 | Phase 17 | Complete |
| CPLX-01 | Phase 18 | Complete |
| CPLX-02 | Phase 18 | Complete |
| CPLX-03 | Phase 18 | Complete |
| CPLX-04 | Phase 18 | Complete |
| EXHB-01 | Phase 19 | Pending |
| EXHB-02 | Phase 19 | Pending |
| EXHB-03 | Phase 19 | Pending |
| VALD-01 | Phase 17 | Complete |
| VALD-02 | Phase 17 | Complete |
| VALD-03 | Phase 17 | Complete |

**Coverage:**
- v3.0 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0

---
*Requirements defined: 2026-04-06*
*Last updated: 2026-04-06 after roadmap creation*
