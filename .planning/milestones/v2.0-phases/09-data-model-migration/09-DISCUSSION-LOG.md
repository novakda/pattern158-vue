# Phase 9: Data Model Migration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 09-data-model-migration
**Areas discussed:** ExhibitType values & classification, Flagship data merge strategy, isDetailExhibit disposition, Migration safety approach, Flagship exhibit identification, ExhibitDetailPage badge text, Data validation approach

---

## ExhibitType Values & Classification

### Q1: Should exhibitType be required or optional?

| Option | Description | Selected |
|--------|-------------|----------|
| Required on all 15 | Every exhibit gets explicit type. Aligns with DATA-01. TypeScript enforces completeness. | ✓ |
| Optional (undefined = untyped) | Only detail-page exhibits get type. Simpler but less self-documenting. | |
| You decide | Claude picks. | |

**User's choice:** Required on all 15 (Recommended)

### Q2: Classification of 5 investigation-report and 10 engineering-brief

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, that's correct | 5 IR (J, L, K, F, H) and 10 EB. Matches existing flags. | |
| Need to review the split | Verify or adjust before locking in. | |
| You decide | Claude audits content and recommends. | ✓ |

**User's choice:** You decide

### Q3: Exhibit H classification (has investigationReport: false explicitly)

| Option | Description | Selected |
|--------|-------------|----------|
| Engineering brief (keep as-is) | Brief engagement, not deep forensic investigation. | |
| Investigation report | Reclassify despite current false flag. | |
| You decide | Claude reviews content to recommend. | ✓ |

**User's choice:** You decide

### Q4: Type union extensibility

| Option | Description | Selected |
|--------|-------------|----------|
| Two values only | Closed union. Simple, matches requirements. | ✓ |
| Extensible string enum | More flexible but less type-safe. | |
| You decide | Claude picks. | |

**User's choice:** Two values only (Recommended)

---

## Flagship Data Merge Strategy

### Q1: How to add flagship-only fields to Exhibit interface?

| Option | Description | Selected |
|--------|-------------|----------|
| Optional fields on Exhibit | Flat optional fields. Only flagship exhibits get values. | ✓ |
| Nested flagship object | Sub-object grouping. Adds nesting. | |
| You decide | Claude picks. | |

**User's choice:** Optional fields on Exhibit (Recommended)

### Q2: Quote merge strategy (Flagship single quote vs Exhibit quotes array)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep quotes array only | Flagship quotes already in exhibit array. No new field. | |
| Add flagshipQuote separately | Distinct field for portfolio card context. | |
| You decide | Claude audits and recommends. | ✓ |

**User's choice:** You decide

### Q3: Tags merge (Flagship tags vs Exhibit impactTags)

| Option | Description | Selected |
|--------|-------------|----------|
| Single tags field | Merge into one canonical tag list. | |
| Keep both fields | Separate concerns. | |
| You decide | Claude compares values and recommends. | ✓ |

**User's choice:** You decide

### Q4: portfolioNarratives.ts deletion timing

| Option | Description | Selected |
|--------|-------------|----------|
| Delete in Phase 9 | DATA-04 says remove. Nothing to consolidate. | |
| Leave for Phase 11 | Remove when consumer (Three Lenses) is removed. | |
| You decide | Claude determines cleanest sequencing. | ✓ |

**User's choice:** You decide

---

## isDetailExhibit Disposition

### Q1: Remove isDetailExhibit in Phase 9?

| Option | Description | Selected |
|--------|-------------|----------|
| Remove in Phase 9 | Delete from interface. All exhibits have detail pages now. Aligns with DATA-01. | ✓ |
| Keep until Phase 10 | Reduces Phase 9 blast radius. | |
| You decide | Claude determines safety. | |

**User's choice:** Remove in Phase 9 (Recommended)

### Q2: ExhibitCard CSS class when isDetailExhibit removed?

| Option | Description | Selected |
|--------|-------------|----------|
| Always apply class | All 15 are detail cards. Hardcode the class. | ✓ |
| Drop the class | Fold styles into base card. Distinction meaningless. | |
| You decide | Claude checks what it styles. | |

**User's choice:** Always apply class (Recommended)

---

## Migration Safety Approach

### Q1: Should Phase 9 update all consumers?

| Option | Description | Selected |
|--------|-------------|----------|
| Update all consumers now | Change data model AND all components, tests, Storybook. No broken refs remain. | ✓ |
| Data model only, consumers later | Temporary backwards-compat. Consumers update in Phase 10/11. | |
| You decide | Claude determines safest approach. | |

**User's choice:** Update all consumers now (Recommended)

### Q2: ExhibitCard CTA text logic?

| Option | Description | Selected |
|--------|-------------|----------|
| Type-based CTA | Different CTA per type. IR: "View Full Investigation Report". EB: different text. | ✓ |
| Uniform CTA for all | Single text regardless of type. | |
| You decide | Claude picks wording. | |

**User's choice:** Type-based CTA (Recommended)

### Q3: Test update scope?

| Option | Description | Selected |
|--------|-------------|----------|
| Update tests in Phase 9 | All test files use exhibitType. Tests pass at phase boundary. | ✓ |
| Minimal test fixes only | Only fix breaking tests. No new coverage. | |
| You decide | Claude determines scope. | |

**User's choice:** Update tests in Phase 9 (Recommended)

---

## Flagship Exhibit Identification

### Q1: Keep all 9 flagship exhibits?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep all 9 as-is | Transfer all 9 records. Data was authored intentionally. | |
| Curate the list | Review which truly need flagship data. | |
| You decide | Claude merges all 9, flags weak entries. | ✓ |

**User's choice:** You decide

### Q2: Explicit isFlagship marker?

| Option | Description | Selected |
|--------|-------------|----------|
| Implicit (has summary = flagship) | No new boolean. Simple. | |
| Explicit isFlagship field | Clear marker for downstream phases. | ✓ |
| You decide | Claude picks based on downstream usage. | |

**User's choice:** Explicit isFlagship field

---

## ExhibitDetailPage Badge Text

### Q1: Both types get badges?

| Option | Description | Selected |
|--------|-------------|----------|
| Both types get badges | Consistent labeling. Aligns with DTPL-04. | ✓ |
| Investigation Report only | Current behavior. EB is "default". | |
| You decide | Claude decides based on DTPL-04. | |

**User's choice:** Both types get badges (Recommended)

### Q2: Badge styling per type?

| Option | Description | Selected |
|--------|-------------|----------|
| Same style, different text | Both use existing badge styling. Visual distinction in Phase 10/11. | |
| Distinct colors per type | Different accent colors. Immediate visual differentiation. | ✓ |
| You decide | Claude picks from CSS tokens. | |

**User's choice:** Distinct colors per type (Recommended)

---

## Data Validation Approach

### Q1: Validation beyond TypeScript compilation?

| Option | Description | Selected |
|--------|-------------|----------|
| Test assertions | Assert counts: 15 total, 5 IR, 10 EB, no boolean flags. | ✓ |
| TypeScript only | Required field + union type prevents errors at compile time. | |
| You decide | Claude determines validation depth. | |

**User's choice:** Test assertions (Recommended)

---

## Claude's Discretion

- Exhibit classification audit (especially Exhibit H disposition)
- Quote field merge strategy (single vs array)
- Tags field merge strategy (impactTags vs tags)
- Flagship exhibit curation (flag weak entries)
- portfolioNarratives.ts deletion timing
- Engineering Brief CTA wording
- Engineering Brief badge color selection

## Deferred Ideas

None — discussion stayed within phase scope.
