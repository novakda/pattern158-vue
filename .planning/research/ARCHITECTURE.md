# Architecture Patterns

**Domain:** Findings data promotion and responsive rendering for portfolio exhibit system
**Researched:** 2026-04-02
**Confidence:** HIGH (all findings based on direct codebase analysis; no external dependencies)

## Context: The v2.2 Personnel Precedent

v2.2 established the exact promotion pattern this milestone follows:

1. Define typed interface (`ExhibitPersonnelEntry`)
2. Add optional typed array to `Exhibit` interface (`personnel?: ExhibitPersonnelEntry[]`)
3. Extract data from existing `sections[]` table rows into new typed arrays
4. Build dedicated rendering component (`PersonnelCard`)
5. Wire into both layout components with empty-state suppression (`v-if` guard)
6. Add Storybook stories
7. Keep original table sections untouched (coexistence)

v2.3 follows this pattern with one significant difference: **responsive rendering** (table on desktop, card grid on mobile). PersonnelCard only needed a card grid. FindingsDisplay needs two rendering modes.

## Recommended Architecture

### New Type: ExhibitFindingEntry

```typescript
// In src/data/exhibits.ts
export interface ExhibitFindingEntry {
  finding: string          // REQUIRED - the finding title (column 1 in all tables)
  description?: string     // 2-col pattern: "Description" column (5 exhibits)
  background?: string      // 3-col pattern: "Background" column (Exhibit A only)
  resolution?: string      // 3-col pattern: "Resolution" column (Exhibit A only)
  severity?: string        // 3-col pattern: "Severity" column (Exhibit L only)
}
```

**Rationale:** All 7 promotable findings tables share column 1 as "Finding" (the title). The variation is in columns 2-3:
- **2-col** `['Finding', 'Description']` -- 5 exhibits: E, G, M, N, O
- **3-col with Background/Resolution** `['Finding', 'Background', 'Resolution']` -- 1 exhibit: A
- **3-col with Severity/Description** `['Finding', 'Severity', 'Description']` -- 1 exhibit: L
- **Text-type findings** (prose paragraphs, not tabular) -- 2 exhibits: D, F -- NOT promoted

Making all fields optional except `finding` handles every variant cleanly. The component renders whatever fields are present.

### Exhibit Interface Change

```typescript
export interface Exhibit {
  // ... existing fields
  findings?: ExhibitFindingEntry[]  // NEW - optional, 7 exhibits get this
}
```

### Component Boundaries

| Component | Responsibility | Communicates With | New/Modified |
|-----------|---------------|-------------------|--------------|
| `ExhibitFindingEntry` (type) | Typed finding data shape | `Exhibit` interface | **NEW** |
| `FindingsDisplay` | Renders findings as table (desktop) or card grid (mobile) | Layout components via props | **NEW** |
| `InvestigationReportLayout` | IR detail page template | FindingsDisplay (new import) | **MODIFIED** (add findings section) |
| `EngineeringBriefLayout` | EB detail page template | FindingsDisplay (new import) | **MODIFIED** (add findings section) |
| `exhibits.ts` data | Static exhibit data source | All consumers | **MODIFIED** (add findings[] to 7 exhibits) |

**NOT modified:**
- `ExhibitDetailPage.vue` -- thin dispatcher, no changes needed
- `FindingCard.vue` -- this is the **HomePage** featured projects component, completely unrelated to exhibit findings. Different data source (`src/data/findings.ts`), different purpose, different rendering. Do NOT conflate these.
- `PersonnelCard.vue` -- untouched
- `src/data/findings.ts` -- homepage featured projects data, unrelated

### Critical Naming Distinction

The codebase has TWO unrelated "findings" concepts:

| Concept | File | Type | Used By |
|---------|------|------|---------|
| Homepage "Featured Projects" | `src/data/findings.ts` | `Finding` | `FindingCard.vue` on `HomePage.vue` |
| Exhibit findings sections | `src/data/exhibits.ts` | `ExhibitFindingEntry` (new) | `FindingsDisplay.vue` (new) on detail layouts |

The new component MUST be named `FindingsDisplay` (not `FindingsCard` or `FindingsList`) to avoid confusion with the existing `FindingCard`.

## Data Flow

```
exhibits.ts                    Layout Components              Rendering
============                   ================               =========

Exhibit {                      InvestigationReportLayout
  findings?: [                   v-if="exhibit.findings?.length"
    { finding, description },      <FindingsDisplay             FindingsDisplay
    { finding, severity,             :findings="exhibit.findings"   Desktop: <table>
      description },               />                              Mobile: <div class="findings-grid">
  ]                                                                          <article> cards
}                              EngineeringBriefLayout
                                 (same pattern)
```

**Placement in layout template:** Between existing `sections` rendering and `resolutionTable`, matching how personnel was added after content sections. The exact position:

```
sections (existing)
  |
findings (NEW - between sections and resolution)
  |
resolutionTable (existing)
  |
personnel (existing)
  |
impactTags (existing)
```

## Patterns to Follow

### Pattern 1: Responsive Dual-Mode Rendering
**What:** Single component renders both a table and a card grid; CSS media queries toggle visibility.
**When:** Data is tabular but tables are unreadable on mobile.
**Implementation:**

```vue
<!-- FindingsDisplay.vue -->
<template>
  <!-- Desktop: semantic table -->
  <table class="findings-table">
    <thead>
      <tr>
        <th>Finding</th>
        <th v-if="hasSeverity">Severity</th>
        <th v-if="hasBackground">Background</th>
        <th v-if="hasDescription">Description</th>
        <th v-if="hasResolution">Resolution</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(f, i) in findings" :key="i">
        <td>{{ f.finding }}</td>
        <td v-if="hasSeverity">{{ f.severity }}</td>
        <!-- etc -->
      </tr>
    </tbody>
  </table>

  <!-- Mobile: card grid -->
  <div class="findings-grid">
    <article v-for="(f, i) in findings" :key="i" class="findings-entry">
      <h3>{{ f.finding }}</h3>
      <div v-if="f.severity" class="findings-field">
        <span class="findings-field-label">Severity</span>
        <span>{{ f.severity }}</span>
      </div>
      <!-- etc -->
    </article>
  </div>
</template>
```

```css
/* Desktop default: table visible, grid hidden */
.findings-grid { display: none; }

@media (max-width: 768px) {
  .findings-table { display: none; }
  .findings-grid { display: grid; }
}
```

**Why CSS not JS:** The existing CSS system uses media queries throughout (~3500 lines). No JavaScript viewport detection exists in the codebase. CSS-only approach is consistent, simpler, and avoids hydration/resize complexity.

### Pattern 2: Empty-State Suppression via v-if Guard
**What:** Parent layout wraps the findings section in `v-if="exhibit.findings?.length"` so exhibits without findings show no section and no empty container.
**When:** Always, for any optional exhibit data.
**Precedent:** PersonnelCard integration uses identical pattern:
```vue
<div v-if="exhibit.personnel?.length" class="exhibit-section">
  <h2>Project Team</h2>
  <PersonnelCard :personnel="exhibit.personnel" />
</div>
```

### Pattern 3: Dynamic Column Detection
**What:** The component determines which columns to show based on what fields are actually populated in the findings array.
**When:** Different exhibits have different field combinations.
**Implementation:**

```typescript
const hasDescription = computed(() => props.findings.some(f => f.description))
const hasSeverity = computed(() => props.findings.some(f => f.severity))
const hasBackground = computed(() => props.findings.some(f => f.background))
const hasResolution = computed(() => props.findings.some(f => f.resolution))
```

This avoids hardcoding column layouts or passing column config as props. The data drives the rendering.

### Pattern 4: TDD Before Template Changes (Established Practice)
**What:** Write tests first, then implement. Established in Phase 16 (section rendering) and Phase 19 (layout integration).
**Tests to write:**
- FindingsDisplay unit tests (renders table, renders card entries, handles field variations, handles empty/missing fields)
- Layout integration tests (findings section appears when data exists, suppressed when absent)

### Pattern 5: Coexistence with Original Table Sections
**What:** Original `sections[]` table entries with heading "Findings" remain in the data. The new `findings[]` array coexists alongside them.
**Why:** Matches v2.2 personnel pattern. Original tables are still rendered by the generic section renderer.
**Key difference from v2.2:** Personnel coexistence was non-visible because the old personnel tables and new PersonnelCard rendered in different visual locations. Findings WILL visually duplicate because both old table sections and new FindingsDisplay appear in the same content flow. **The old "Findings" table sections should be removed from `sections[]` after findings data is promoted, or the section renderer should be taught to skip them.** This is the primary architectural decision point.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Reusing FindingCard for Exhibit Findings
**What:** Importing the existing `FindingCard.vue` component for exhibit finding display.
**Why bad:** `FindingCard` renders homepage "Featured Projects" with completely different fields (number, meta, analysis, solution, outcome, link, tags). It imports from `@/data/findings` not `@/data/exhibits`. Reusing it would require either breaking its existing contract or creating a confused hybrid.
**Instead:** Create a new `FindingsDisplay.vue` component purpose-built for exhibit findings data.

### Anti-Pattern 2: JavaScript Viewport Detection for Responsive Layout
**What:** Using `window.matchMedia()` or resize observers to toggle between table and card rendering.
**Why bad:** Adds runtime complexity, creates flash-of-wrong-layout, fights the CSS-first approach of the entire codebase.
**Instead:** Render both DOM structures, use CSS `display: none` / media queries to toggle visibility.

### Anti-Pattern 3: Promoting Text-Type Findings to Typed Arrays
**What:** Trying to parse the prose paragraphs in Exhibits D and F into structured `ExhibitFindingEntry` objects.
**Why bad:** Those findings are narrative paragraphs, not tabular data. Forcing them into a title/description structure loses their meaning and coherence.
**Instead:** Leave text-type findings as `sections[]` text blocks. Only promote the 7 table-type findings exhibits (A, E, G, J, L, M, N).

### Anti-Pattern 4: Passing Column Configuration as Props
**What:** Having layouts pass `columns={['Finding', 'Description']}` to the display component.
**Why bad:** Duplicates knowledge that's already in the data. Creates tight coupling between layout and data shape. Prone to drift.
**Instead:** Component auto-detects which fields are populated and renders accordingly.

## Integration Points (Explicit)

### Files Created (NEW)
1. `src/components/FindingsDisplay.vue` -- responsive findings rendering component
2. `src/components/FindingsDisplay.test.ts` -- unit tests
3. `src/components/FindingsDisplay.stories.ts` -- Storybook stories

### Files Modified
1. `src/data/exhibits.ts` -- add `ExhibitFindingEntry` interface, add `findings?` to `Exhibit`, add `findings[]` arrays to 7 exhibits, remove old "Findings" table sections from those 7 exhibits
2. `src/components/exhibit/InvestigationReportLayout.vue` -- import FindingsDisplay, add findings section with v-if guard
3. `src/components/exhibit/EngineeringBriefLayout.vue` -- same as above
4. `src/components/exhibit/InvestigationReportLayout.test.ts` -- add findings rendering/suppression tests
5. `src/components/exhibit/EngineeringBriefLayout.test.ts` -- add findings rendering/suppression tests
6. `src/assets/css/main.css` -- add findings-table, findings-grid, findings-entry styles with responsive breakpoint

### Files NOT Modified
- `src/components/FindingCard.vue` -- unrelated homepage component
- `src/data/findings.ts` -- unrelated homepage data
- `src/pages/ExhibitDetailPage.vue` -- thin dispatcher, no changes
- `src/pages/HomePage.vue` -- unrelated

## Suggested Build Order

The dependency chain mirrors v2.2 exactly:

### Phase 1: Type Definition + Data Extraction
**Depends on:** Nothing
**Scope:**
- Add `ExhibitFindingEntry` interface to `exhibits.ts`
- Add `findings?: ExhibitFindingEntry[]` to `Exhibit` interface
- Extract data from 7 table-type exhibits (A, E, G, J, L, M, N) into `findings[]` arrays
- Remove old "Findings" table sections from `sections[]` for those 7 exhibits (prevents double-rendering)
- Data validation tests (all 7 exhibits have findings, field mapping correct, old table sections removed)

**Why remove old tables in this phase:** Unlike v2.2 personnel where old tables and new PersonnelCard occupied different visual locations, findings tables and FindingsDisplay will render in the same content area. Keeping both creates visible duplication. Removing old tables at data extraction time is cleaner than adding skip-logic to the section renderer.

### Phase 2: FindingsDisplay Component (TDD)
**Depends on:** Phase 1 (needs the type definition and sample data)
**Scope:**
- Write tests first: table rendering, card rendering, field variation handling, empty field graceful handling, dynamic column detection
- Build `FindingsDisplay.vue` with dual-mode rendering (table desktop, card grid mobile)
- CSS styles in `main.css` using existing design tokens

### Phase 3: Layout Integration (TDD)
**Depends on:** Phase 2 (needs FindingsDisplay component)
**Scope:**
- Write tests first: findings section appears when data exists, suppressed when absent (mirror personnel integration tests exactly)
- Wire into `InvestigationReportLayout.vue` and `EngineeringBriefLayout.vue`
- Symmetrical change to both files

### Phase 4: Storybook Documentation
**Depends on:** Phase 2 (needs FindingsDisplay component, can run parallel with Phase 3)
**Scope:**
- Stories covering: 2-col findings (description only), 3-col findings with background/resolution (Exhibit A pattern), 3-col findings with severity (Exhibit L pattern), single finding, many findings

## Exhibit Inventory: Findings by Type

| Exhibit | Label | exhibitType | Findings Format | Columns | Promote? |
|---------|-------|-------------|-----------------|---------|----------|
| A | Exhibit A | engineering-brief | table | Finding, Background, Resolution | YES |
| D | Exhibit D | engineering-brief | text (prose) | N/A | NO |
| E | Exhibit E | engineering-brief | table | Finding, Description | YES |
| F | Exhibit F | engineering-brief | text (prose) | N/A | NO |
| G | Exhibit G | engineering-brief | table | Finding, Description | YES |
| J | Exhibit J | investigation-report | table | Finding, Description | YES |
| L | Exhibit L | investigation-report | table | Finding, Severity, Description | YES |
| M | Exhibit M | investigation-report | table | Finding, Description | YES |
| N | Exhibit N | investigation-report | table | Finding, Description | YES |

**Count:** 7 exhibits promoted (not 9). The milestone description says "9 exhibits have findings tables" -- this counts all 9 findings sections, but 2 are prose text, not tabular. Only 7 have tabular data suitable for typed arrays.

**Exhibit type distribution of promotable findings:**
- Engineering Briefs with table findings: A, E, G (3 exhibits)
- Investigation Reports with table findings: J, L, M, N (4 exhibits)

Both layout components need the FindingsDisplay integration.

## Sources

- Direct codebase analysis of `src/data/exhibits.ts` (all type definitions, exhibit data, column patterns)
- v2.2 roadmap and implementation pattern (`.planning/milestones/v2.2-ROADMAP.md`)
- Existing component implementations: `PersonnelCard.vue`, `InvestigationReportLayout.vue`, `EngineeringBriefLayout.vue`, `FindingCard.vue`
- Existing test patterns: `PersonnelCard.test.ts`, `InvestigationReportLayout.test.ts`
- PROJECT.md milestone context and constraints

---
*Architecture research for: Pattern 158 v2.3 -- Findings Data Promotion & Responsive Rendering*
*Researched: 2026-04-02*
