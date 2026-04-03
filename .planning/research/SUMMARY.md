# Project Research Summary

**Project:** Pattern 158 v2.3 -- Findings Data Promotion & Responsive Rendering
**Domain:** Vue 3 SPA portfolio site -- exhibit findings data promotion (table-to-typed-array migration)
**Researched:** 2026-04-02
**Confidence:** HIGH

## Executive Summary

v2.3 is a focused data promotion milestone that extracts exhibit findings from embedded table sections into typed top-level arrays with purpose-built rendering. This is the third promotion milestone, following v2.2's personnel promotion, and the pattern is well-established: define typed interface, add optional array to Exhibit, migrate data from 7 table-type exhibits, build a dedicated rendering component, wire into both layout templates with empty-state suppression. The key architectural difference from v2.2 is that findings are genuinely tabular data requiring a responsive dual-mode component -- table on desktop, stacked cards on mobile -- rather than a card-only layout like PersonnelCard.

The recommended approach requires zero new dependencies. The codebase already contains two proven CSS-only table-to-card responsive patterns (at 480px and 768px breakpoints) using `data-label` attributes and `::before` pseudo-elements. A dedicated `FindingsTable` component renders a single semantic `<table>` DOM that CSS transforms into stacked cards at 768px. Column-adaptive rendering via computed properties handles the three distinct column patterns (2-col finding/description, 3-col finding/background/resolution, 3-col finding/severity/description) without configuration props -- the data drives the rendering.

The primary risks are naming collisions (the codebase has an unrelated `Finding` type and `FindingCard` component for the homepage), duplicate rendering (old table sections and new component both visible), and CSS class namespace conflicts (existing `.finding-*` classes span ~500 lines). All risks have straightforward mitigations: use `ExhibitFindingEntry` naming, filter old sections from the layout loop, and prefix new CSS classes to avoid collision. Recovery cost for all identified pitfalls is LOW because the coexistence pattern preserves original data as a fallback.

## Key Findings

### Recommended Stack

No new packages or technologies needed. v2.3 is pure CSS authoring and Vue component creation within established conventions.

**Core technologies (all existing):**
- CSS `data-label` + `::before` pattern: responsive table-to-card switching -- two proven implementations already in codebase
- CSS Grid `auto-fill, minmax()`: card grid on mobile -- PersonnelCard precedent
- CSS cascade layers (`@layer components`): scope FindingsTable styles -- consistent with all component CSS
- Vue 3 Composition API (`defineProps` + `computed`): component definition -- identical to PersonnelCard pattern

**Critical version note:** None. All patterns use standard CSS and Vue 3 built-in features with universal browser support.

### Expected Features

**Must have (table stakes):**
- `ExhibitFindingEntry` interface with required `finding` field and optional `description`, `background`, `resolution`, `severity`
- `findings[]` optional array on Exhibit interface for 7 promotable exhibits
- `FindingsTable` component with desktop table and mobile stacked card rendering
- Column-adaptive rendering (2-col and 3-col patterns handled automatically via computed field detection)
- Wired into both InvestigationReportLayout and EngineeringBriefLayout with empty-state suppression
- Severity badge rendering for Exhibit L findings using existing design tokens
- Custom `findingsHeading` field preserved from original section headings (Exhibits I, J have custom suffixes)
- Old findings table sections removed/filtered to prevent duplicate rendering
- Storybook stories covering all column variants

**Should have (differentiators):**
- Severity visual badges with color-coded design token mapping (critical=red, high=amber, medium=gray, low=light)
- Finding title as scannable primary identifier (card heading on mobile, first column on desktop)
- Custom section headings preserving investigation narrative framing ("Five Concurrent Systemic Failures")

**Defer (not v2.3):**
- Promoting text-type findings from Exhibits D and M -- prose does not fit structured model
- Cross-exhibit finding relationships -- premature at ~30 total findings
- Finding numbering/ID system -- not all exhibits use investigation framing
- Expandable/collapsible details -- content too short for progressive disclosure
- Rich text in descriptions -- no current need
- Severity filtering/sorting -- only 1 of 7 exhibits has severity data

### Architecture Approach

The architecture follows the v2.2 personnel promotion pattern exactly: type definition in `exhibits.ts`, optional typed array on `Exhibit` interface, dedicated rendering component, symmetrical wiring into both layouts. The single new component (`FindingsDisplay` or `FindingsTable`) owns both rendering modes via CSS media queries -- a semantic `<table>` on desktop, CSS-transformed stacked cards on mobile at 768px. Dynamic column detection via computed properties (`hasDescription`, `hasSeverity`, etc.) eliminates the need for column configuration props.

**Major components:**
1. `ExhibitFindingEntry` (type) -- typed finding data shape in `exhibits.ts`
2. `FindingsTable.vue` (new component) -- responsive dual-mode rendering with column-adaptive layout
3. `InvestigationReportLayout.vue` (modified) -- findings section wiring with v-if guard
4. `EngineeringBriefLayout.vue` (modified) -- identical findings section wiring
5. `exhibits.ts` data (modified) -- findings arrays added to 7 exhibits, old table sections removed

**Not modified:** ExhibitDetailPage.vue (thin dispatcher), FindingCard.vue (unrelated homepage component), PersonnelCard.vue (untouched), src/data/findings.ts (unrelated homepage data).

### Critical Pitfalls

1. **Naming collision with homepage Finding type** -- Name the new type `ExhibitFindingEntry` (not `Finding` or `ExhibitFinding`). Place in `exhibits.ts` alongside `ExhibitPersonnelEntry`. Name component `FindingsTable.vue` (not `FindingCard.vue` which exists). Prefix CSS classes with `findings-table` or `exhibit-findings` to avoid the existing `.finding-*` namespace (~500 lines).

2. **Duplicate rendering of findings data** -- Old table sections in `sections[]` and new FindingsTable both render in the same content flow. Either filter sections with "Findings" heading when `exhibit.findings?.length` exists, or remove old table sections from `sections[]` during data migration. Removal is cleaner; filtering follows v2.2 coexistence pattern. Decision must be made before layout wiring.

3. **Column variance breaking responsive layout** -- Build card layout to render whatever fields are present (labeled blocks under finding title), not a fixed grid of slots. Test 2-col AND 3-col variants in Storybook. The 3-column exhibits (A and L) are edge cases easily missed during development.

4. **Custom heading suffixes silently lost** -- Add `findingsHeading` field to Exhibit interface during data extraction phase. Exhibits I/J have meaningful heading suffixes ("Swiss Cheese Model", "Five Foundational Gaps") that frame the findings.

5. **CSS bypassing design token system** -- Mandate all spacing uses `--space-*`, all colors use `--color-*`, all font sizes use `--font-size-*`. Grep for hardcoded values as verification step. Dark mode breakage is the symptom of skipped tokens.

## Implications for Roadmap

Based on research, the milestone follows a 4-phase structure mirroring v2.2 exactly. Dependencies are strictly sequential: types before data, data before component, component before integration.

### Phase 1: Type Definition + Data Extraction
**Rationale:** The interface shape drives everything downstream. Data migration must happen before the component can be tested with real data. Naming decisions must be locked first.
**Delivers:** `ExhibitFindingEntry` interface, `findings[]` arrays on 7 exhibits, `findingsHeading` field, old table sections removed from migrated exhibits
**Addresses:** ExhibitFindingEntry interface, findings[] array, data migration, findingsHeading field, old table section removal
**Avoids:** Naming collision (Pitfall 1), column variance data loss (Pitfall 2), custom heading loss (Pitfall 4), data truncation (Pitfall 7)

### Phase 2: FindingsTable Component (TDD)
**Rationale:** Component needs the type definition and sample data from Phase 1. TDD approach established in v2.2. Desktop table and mobile card rendering are the core deliverable.
**Delivers:** `FindingsTable.vue` component with dual-mode responsive rendering, unit tests, CSS styles in `@layer components`
**Uses:** CSS `data-label` + `::before` pattern at 768px breakpoint, existing design tokens (no new tokens)
**Implements:** Responsive dual-mode rendering, dynamic column detection, severity badges
**Avoids:** Responsive breakage on variable columns (Pitfall 3), CSS token bypass (Pitfall 6)

### Phase 3: Layout Integration (TDD)
**Rationale:** Component must exist before wiring into layouts. Both layouts get identical changes. Duplicate rendering prevention is critical here.
**Delivers:** FindingsTable wired into InvestigationReportLayout and EngineeringBriefLayout with empty-state suppression, integration tests
**Addresses:** Layout wiring, empty-state suppression, section filtering to prevent duplication
**Avoids:** Duplicate rendering (Pitfall 5)

### Phase 4: Storybook + Documentation
**Rationale:** Can run partially parallel with Phase 3 but logically last. Stories document the component's field variations for future reference.
**Delivers:** Storybook stories covering 2-col, 3-col-severity, 3-col-background-resolution variants, milestone documentation

### Phase Ordering Rationale

- Types before data: interface shape drives migration. Wrong interface cascades to every downstream phase.
- Data before component: real exhibit data is the best test fixture. Component tests use actual findings arrays.
- Component before integration: layout wiring is trivial once the component works. Integration tests verify the handoff.
- Storybook last: documentation layer, lowest risk. Can overlap with Phase 3.
- Old table section removal happens in Phase 1 (with data migration) rather than Phase 3 (with integration) because removing at extraction time is cleaner and prevents any period where duplicate rendering exists.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Component):** The responsive dual-mode rendering is the only genuinely new pattern in v2.3. The STACK and ARCHITECTURE research provide detailed implementation guidance, but the CSS class naming (avoiding `.finding-*` collision) and the exact 768px breakpoint behavior with 3-column tables should be validated during phase planning.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Types + Data):** Direct replication of v2.2 Phase 17 pattern. Well-documented, mechanical transformation.
- **Phase 3 (Integration):** Direct replication of v2.2 Phase 19 pattern. Symmetrical changes to both layouts.
- **Phase 4 (Storybook):** Standard Storybook story authoring. PersonnelCard.stories.ts is the template.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Zero new dependencies. All patterns verified against existing codebase implementations with exact line numbers. |
| Features | HIGH | Complete audit of all 15 exhibits. Column patterns enumerated. v2.2 precedent provides clear feature scope. |
| Architecture | HIGH | Direct codebase analysis. Component boundaries, data flow, and integration points all map to existing patterns. |
| Pitfalls | HIGH | All pitfalls derived from actual codebase analysis (naming conflicts, CSS class inventory, v2.2 lessons learned). |

**Overall confidence:** HIGH

### Gaps to Address

- **Exhibit labeling discrepancy:** Research files have minor inconsistencies in which exhibits have text-type findings (FEATURES says D/M, ARCHITECTURE says D/F, PITFALLS says C/F). During Phase 1 planning, the exact exhibit inventory must be confirmed against `exhibits.ts` data. The count of 7 promotable table-type exhibits is consistent across all files.
- **Component naming:** STACK.md recommends `FindingsTable`, ARCHITECTURE.md recommends `FindingsDisplay`. Either works; decision should be locked in Phase 1. `FindingsTable` is slightly more descriptive of the desktop rendering mode.
- **Breakpoint value:** STACK.md recommends 768px for all findings tables. PITFALLS.md suggests 768px specifically for 3-column variants. Since the component renders a single breakpoint for all findings, 768px is correct for the worst case (3-column text-heavy tables).
- **Coexistence vs removal:** PITFALLS.md recommends filtering (coexistence), ARCHITECTURE.md recommends removal. Removal is cleaner and avoids the section-heading filter complexity. Recommend removal during data migration (Phase 1).

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis: `src/data/exhibits.ts` -- all exhibit types, section structures, column patterns
- Direct codebase analysis: `src/assets/css/main.css` -- responsive table patterns (lines 3757-3784, 4289-4326), `.finding-*` class inventory (lines 653-1140), design token system
- Direct codebase analysis: `src/components/PersonnelCard.vue` -- v2.2 rendering component precedent
- Direct codebase analysis: `src/components/exhibit/InvestigationReportLayout.vue`, `EngineeringBriefLayout.vue` -- layout integration patterns
- Direct codebase analysis: `src/data/findings.ts`, `src/components/FindingCard.vue` -- homepage naming conflict inventory
- v2.2 milestone audit and roadmap -- promotion pattern precedent and lessons learned

### Secondary (MEDIUM confidence)
- None. All research is based on direct codebase analysis with no external sources.

### Tertiary (LOW confidence)
- None.

---
*Research completed: 2026-04-02*
*Ready for roadmap: yes*
