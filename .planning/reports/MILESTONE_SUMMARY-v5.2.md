# Milestone v5.2 — Project Summary

**Generated:** 2026-04-08
**Purpose:** Team onboarding and project review

---

## 1. Project Overview

Pattern 158 is an evidence-based portfolio site for Dan Novak, built in Vue 3 + TypeScript + Vite. It serves hiring managers, potential clients, and establishes the Pattern 158 brand identity. The site features a unified Case Files section with 15 exhibits across two types (Investigation Reports and Engineering Briefs), each with purpose-built detail layouts.

**Core value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency, reducing cognitive load for both the developer and anyone reviewing the codebase.

**What v5.2 addressed:** Personnel data across 14 exhibits had inconsistencies — titles stored in name fields, group entries mixed with individuals, Exhibit L using a completely different schema. Mobile card rendering couldn't distinguish between individual people, groups, and anonymized entries. This milestone cleaned the data and added visual distinctions.

## 2. Architecture & Technical Decisions

- **`entryType` discriminant on PersonnelEntry:** Three-way classification (`individual` | `group` | `anonymized`) added as an optional field on the existing `PersonnelEntry` interface. Drives CSS class bindings for mobile cards and desktop table rows — no rendering logic in templates beyond class binding.
  - **Why:** Clean separation of data classification from visual treatment. Templates stay scannable.
  - **Phase:** 28

- **Heading cascade `name → title → role`:** First available field becomes the card heading using `{{ p.name || p.title || p.role }}`. Dynamic `data-label` matches the field used.
  - **Why:** Handles all personnel variants (named, anonymized, role-only) without separate template branches.
  - **Phase:** 29

- **CSS pseudo-element GROUP label:** Group entries get a "GROUP" uppercase label via `td:first-child::before` CSS pseudo-element rather than an inline `<span>`.
  - **Why:** Keeps template clean — label is a styling concern, not content.
  - **Phase:** 29

- **Em-dash merge pattern for title+description:** When a personnel entry had a role in `name` and a description in `title`, they were merged with em-dash: `"QA Coordinator — close collaborator on..."`.
  - **Why:** Preserves context while moving data to the correct field.
  - **Phase:** 28

- **Dead code removal (involvement branch):** Exhibit L's unique `role`/`involvement` template branch was removed from both layout components after data normalization.
  - **Why:** Exhibit L now uses standard schema — old branch was unreachable dead code.
  - **Phase:** 29

## 3. Phases Delivered

| Phase | Name | Status | One-Liner |
|-------|------|--------|-----------|
| 28 | Personnel Data Cleanup | Complete | Fixed 26 title-as-name entries, normalized Exhibit L schema, added entryType to all 66 entries |
| 29 | Personnel Card UX | Complete | EntryType-driven card variants with group/anonymized styling, heading cascade, dead code removal |

## 4. Requirements Coverage

All 9 requirements satisfied. Audit passed 9/9.

### Data Normalization
- ✅ **DATA-01**: Personnel entries with titles/roles in name field corrected across 12 exhibits
- ✅ **DATA-02**: Exhibit L normalized from role/involvement to standard name/title/organization schema
- ✅ **DATA-03**: PersonnelEntry type extended with `entryType: 'individual' | 'group' | 'anonymized'`
- ✅ **DATA-04**: All 7 group entries marked with `entryType: 'group'`
- ✅ **DATA-05**: All anonymized/unnamed personnel marked with `entryType: 'anonymized'`

### Card UX
- ✅ **CARD-01**: Group entries render as compact/muted cards (opacity 0.7, dashed border, GROUP label)
- ✅ **CARD-02**: Anonymized entries render with italic/muted visual distinction
- ✅ **CARD-03**: Card heading cascade: name → title → role, consistent across all variants
- ✅ **CARD-04**: Desktop table rows reflect entryType (muted italic for group, italic for anonymized)

## 5. Key Decisions Log

| # | Decision | Phase | Rationale |
|---|----------|-------|-----------|
| 1 | Split "Dan Novak - Development Lead" into separate name/title fields | 28 | Exhibit L entry 1 had both person and role in one field |
| 2 | Keep role/involvement fields on PersonnelEntry type | 28 | Exhibits E, J still use these fields — type must remain backward-compatible |
| 3 | Actual personnel count is 66 (not 83 as estimated) | 28 | Plan overcounted — no impact on correctness |
| 4 | Em-dash merge for title+description; slash merge for redundant titles | 28 | Consistent pattern across all title corrections |
| 5 | `td:first-child` selector for heading treatment (not `td[data-label='Name']`) | 29 | Supports dynamic data-label from heading cascade |
| 6 | GROUP label via CSS pseudo-element | 29 | Template stays clean; label is a styling concern |

## 6. Tech Debt & Deferred Items

**Tech debt:** None identified.

**Deferred items:** None — discussion stayed within phase scope for both phases.

**Known human verification items:** 4 visual items in Phase 29 were validated via Playwright during execution:
1. Group card mobile rendering (opacity, dashed border, GROUP label)
2. Anonymized card mobile rendering (italic, muted)
3. Heading fallback cascade
4. Desktop table entryType distinctions

## 7. Getting Started

- **Run the project:** `npm run dev` (Vite dev server on port 5173)
- **Run tests:** `npx vitest run` (95 tests across 8 files)
- **Type check:** `npx tsc --noEmit` or `npx vue-tsc --noEmit`
- **Key directories:**
  - `src/types/exhibit.ts` — PersonnelEntry interface with entryType field
  - `src/data/json/exhibits.json` — all exhibit data including 66 personnel entries
  - `src/components/exhibit/InvestigationReportLayout.vue` — IR detail layout with personnel rendering
  - `src/components/exhibit/EngineeringBriefLayout.vue` — EB detail layout with personnel rendering
  - `src/assets/css/main.css` — full design system including personnel card/table CSS
- **Where to look first:** The personnel rendering chain flows from `PersonnelEntry.entryType` in the type system → JSON data → Vue template class bindings → CSS selectors for mobile cards and desktop tables.

---

## Stats

- **Timeline:** 2026-04-07 → 2026-04-08 (1 day)
- **Phases:** 2/2 complete
- **Plans:** 3 total (2 in Phase 28, 1 in Phase 29)
- **Commits:** 23 (between v5.1 and v5.2 tags)
- **Source files changed:** 6 (+322 / -162)
- **Tests:** 95 passing (up from 86 at v5.1)
