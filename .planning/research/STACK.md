# Stack Research

**Domain:** Responsive table-to-card rendering for exhibit findings data (Vue 3 portfolio app)
**Researched:** 2026-04-02
**Confidence:** HIGH

---

## Context

The core stack (Vue 3, TypeScript, Vite, Storybook 10, Vitest) and CSS design token system are established through v2.2. This research answers: **what CSS patterns and Vue techniques are needed to render exhibit findings as a table on desktop and cards on mobile, integrated with the existing design token system?**

The answer: **no new packages, no new CSS methodology**. The codebase already contains two proven implementations of the exact CSS-only table-to-card responsive pattern needed. The work is component creation and CSS authoring within established conventions.

---

## Recommended Stack

### Core Technologies (No Changes)

| Technology | Version | Purpose | Why No Change Needed |
|------------|---------|---------|----------------------|
| CSS `data-label` + `::before` pattern | N/A (CSS-only) | Table-to-card responsive switching | Already proven at 2 codebase locations: exhibit-table (480px) and directory-table (768px). Zero JS overhead |
| CSS Grid `auto-fill, minmax()` | N/A (CSS-only) | Card grid on mobile | PersonnelCard already uses `minmax(240px, 1fr)`. Intrinsic sizing, no breakpoint math |
| CSS cascade layers | N/A (existing) | Scope FindingsTable styles | New styles go in `@layer components` alongside PersonnelCard. Predictable specificity |
| Vue 3 Composition API | 3.5.30 | Component definition | `defineProps` with typed interface, same as PersonnelCard |

### New Packages Required

**None.** Zero new dependencies for v2.3.

### Development Tools (Already Installed)

| Tool | Purpose | Notes |
|------|---------|-------|
| Storybook 10 | Visual testing of table/card states | Use viewport addon to preview mobile card layout alongside desktop table |
| Vitest | Unit tests for conditional column rendering | Test correct DOM for varying field combinations (2-col, 3-col, with/without severity) |

---

## The Responsive Pattern (Detail)

### What the codebase already does

Two existing implementations of CSS-only table-to-card:

**1. Exhibit detail tables** (`main.css` lines 4289-4326, at 480px):
```css
/* thead hidden, tr becomes block card, td::before shows data-label */
.page-exhibit-detail .exhibit-table thead { display: none; }
.page-exhibit-detail .exhibit-table tr { display: block; margin-bottom: var(--space-md); }
.page-exhibit-detail .exhibit-table td { display: block; border-bottom: none; }
.page-exhibit-detail .exhibit-table td::before {
    content: attr(data-label);
    display: block;
    font-weight: 700;
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
}
```

**2. Industries directory tables** (`main.css` lines 3757-3784, at 768px):
```css
/* Same pattern, different breakpoint for text-heavy multi-column tables */
.page-industries .directory-table thead { display: none; }
.page-industries .directory-table tr {
    display: block;
    margin-bottom: var(--space-md);
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: 4px;
}
.page-industries .directory-table td::before {
    content: attr(data-label) ": ";
    font-weight: 700;
    font-family: var(--font-mono);
}
```

The `data-label` attributes are already being set on `<td>` elements in InvestigationReportLayout.vue (line 63: `:data-label="section.columns?.[ci]"`).

### Why CSS-only, not JavaScript viewport detection

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **CSS `@media` + `data-label`** | Zero JS, no hydration cost, no layout flash, 2 precedents in codebase | Slightly more CSS to write | **Use this** |
| Vue `v-if` with `useMediaQuery` | Can render different DOM trees | Adds JS complexity, potential FOUC, no precedent in codebase | **Reject** |
| CSS container queries | Modern, component-scoped | No precedent in codebase, over-engineering for this use case | **Reject** |
| Third-party responsive table library | Pre-built | Unnecessary dependency for a pattern implemented twice already | **Reject** |

### Recommended breakpoint: 768px

The existing exhibit-table switches at 480px, but findings data has long-form text in Description/Background/Resolution columns (some cells are 2-3 sentences). At 768px on a 3-column findings table, cells are already too cramped to scan.

The Industries directory-table uses 768px for the same reason: multi-column tables with text content need the card layout earlier than tables with short values.

**Use 768px for FindingsTable** to match the directory-table precedent and serve the content's width needs.

---

## Component Architecture Decision

**Recommendation: Dedicated `FindingsTable.vue` component.**

Why not reuse the generic section table renderer:

| Factor | Generic Section Table | Dedicated FindingsTable | Winner |
|--------|----------------------|------------------------|--------|
| Semantic field names | Generic columns[] | Named `finding`, `description`, `severity` | FindingsTable |
| Severity badges | Would need conditional logic inside generic renderer | Component owns its badge styling | FindingsTable |
| Responsive breakpoint | Shares 480px with all exhibit-tables | Can use 768px for text-heavy findings content | FindingsTable |
| Precedent | N/A | PersonnelCard: promoted data gets dedicated component | FindingsTable |
| Testability | Tests coupled to generic table behavior | Tests target finding-specific rendering | FindingsTable |

The generic `exhibit-table` in section rendering continues to serve non-promoted table sections (Technologies, Expanded Scope, etc.) unchanged.

---

## Integration with Existing Design Token System

### Tokens to reuse (do NOT create new ones)

| Token | Used For in FindingsTable |
|-------|--------------------------|
| `--color-surface` | Card background on mobile |
| `--color-border` | Card border, table cell borders |
| `--color-background-alt` | Table header background, hover rows |
| `--color-text-muted` | Data-label text on mobile cards |
| `--color-danger` | Critical severity badge |
| `--color-accent` | High severity badge |
| `--color-primary` | Finding title emphasis |
| `--space-sm`, `--space-md`, `--space-lg` | Padding, gaps, margins |
| `--radius-md` | Card border-radius (matches PersonnelCard) |
| `--font-mono` | Column headers, severity badges, data-labels |
| `--font-size-xs`, `--font-size-sm` | Label text, badge text |
| `--overlay-hover-row` | Table row hover (already defined for resolution-table) |

### New CSS classes (in `@layer components`)

Following PersonnelCard placement in main.css (lines 758-773 in `@layer components`):

```
.findings-table          -- <table> element, desktop presentation
.findings-table th       -- header cells (reuse exhibit-table th visual pattern)
.findings-table td       -- data cells with data-label attributes
.findings-table tr:hover -- hover state using --overlay-hover-row
.finding-severity        -- severity badge base
.finding-severity--critical  -- red badge (--color-danger)
.finding-severity--high      -- amber badge (--color-accent)
.finding-severity--medium    -- muted badge
.finding-severity--low       -- subtle badge
```

**Critical: single DOM, two visual presentations.** Do NOT render two separate DOM trees (table + card grid) and toggle visibility. Use the proven pattern: one `<table>` in HTML, CSS `display: block` transforms it into stacked cards at the breakpoint.

---

## Implementation Pattern

### Component signature (following PersonnelCard)

```typescript
// FindingsTable.vue
import type { ExhibitFindingEntry } from '@/data/exhibits'

defineProps<{
  findings: ExhibitFindingEntry[]
}>()
```

### Conditional columns via computed

```typescript
const hasDescriptions = computed(() => props.findings.some(f => f.description))
const hasBackgrounds = computed(() => props.findings.some(f => f.background))
const hasResolutions = computed(() => props.findings.some(f => f.resolution))
const hasSeverities = computed(() => props.findings.some(f => f.severity))
```

This avoids empty columns when an exhibit's findings only use 2 fields (e.g., Finding + Description). Same principle as PersonnelCard's conditional `v-if` for optional fields like `organization` and `role`.

### HTML structure (single DOM, dual presentation)

```html
<table class="findings-table">
  <thead>
    <tr>
      <th>Finding</th>
      <th v-if="hasDescriptions">Description</th>
      <th v-if="hasBackgrounds">Background</th>
      <th v-if="hasResolutions">Resolution</th>
      <th v-if="hasSeverities">Severity</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(f, i) in findings" :key="i">
      <td data-label="Finding">{{ f.finding }}</td>
      <td v-if="hasDescriptions" data-label="Description">{{ f.description }}</td>
      <td v-if="hasBackgrounds" data-label="Background">{{ f.background }}</td>
      <td v-if="hasResolutions" data-label="Resolution">{{ f.resolution }}</td>
      <td v-if="hasSeverities" data-label="Severity">
        <span :class="['finding-severity', `finding-severity--${f.severity}`]">
          {{ f.severity }}
        </span>
      </td>
    </tr>
  </tbody>
</table>
```

CSS transforms this into stacked cards at 768px using `display: block` + `data-label::before`.

### Layout integration (following PersonnelCard pattern)

```html
<!-- In InvestigationReportLayout.vue / EngineeringBriefLayout.vue -->
<div v-if="exhibit.findings?.length" class="exhibit-section">
  <h2>Findings</h2>
  <FindingsTable :findings="exhibit.findings" />
</div>
```

Empty-state suppression via `v-if` on the array, identical to how `personnel` is wired.

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| CSS `@media` table-to-card | Vue `v-if` with `useMediaQuery` composable | Adds JS for a solved CSS problem. No precedent in codebase. Potential FOUC |
| 768px breakpoint | 480px (matching current exhibit-table) | Findings have 3+ text columns; content is unreadable at 500-768px widths |
| Dedicated FindingsTable component | Extend generic section table renderer | Severity badges and semantic fields need component logic, not generic rendering |
| Single DOM with CSS transform | Dual DOM (table + card grid, toggle visibility) | Doubles DOM size, accessibility issues with duplicate content, violates DRY |
| Severity as BEM modifier classes | Inline styles or utility classes | Project uses semantic CSS classes with design tokens, not inline/utility patterns |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| VueUse `useMediaQuery` / `useBreakpoints` | Adds runtime JS for what CSS handles natively. Not in dependency list. Creates precedent for JS-driven responsive logic that diverges from existing CSS-only approach | CSS `@media` queries |
| AG Grid / Tanstack Table | Massive overkill for static read-only data with 2-10 rows per exhibit | Plain HTML `<table>` with CSS responsive pattern |
| CSS container queries (`@container`) | No precedent in codebase. Adds cognitive overhead without benefit for a page-level breakpoint | Standard `@media` queries at 768px |
| `<template v-if="isMobile">` dual-render | Two DOM trees doubles test surface and creates accessibility issues (screen readers see duplicate content) | Single DOM, CSS display switching |
| New design tokens | Token system is comprehensive. All needed color, spacing, typography, and radius values already exist | Reuse `--color-*`, `--space-*`, `--font-*`, `--radius-*` tokens |
| Responsive table npm packages | Unnecessary dependency for ~25 lines of CSS following an existing codebase pattern | Copy directory-table responsive pattern |
| Scoped styles in SFC | Project uses global CSS in cascade layers. Mixing scoped + global creates specificity confusion | Add styles in `@layer components` in main.css |

---

## Data Model Addition

The `Exhibit` interface needs one new field and one new interface:

```typescript
export interface ExhibitFindingEntry {
  finding: string           // Required: the finding title/name
  description?: string      // What was found
  background?: string       // Context/history
  resolution?: string       // How it was resolved
  severity?: 'critical' | 'high' | 'medium' | 'low'  // Severity level
}

export interface Exhibit {
  // ... existing fields ...
  findings?: ExhibitFindingEntry[]  // Optional, same pattern as personnel?
}
```

All fields except `finding` are optional because exhibit findings vary:
- Exhibit A has: Finding, Background, Resolution (3 columns)
- Exhibit E has: Finding, Description (2 columns)
- Exhibit L has: Finding, Severity, Description (3 columns)
- Exhibit N has: Finding, Description (2 columns)
- Exhibit O has: Finding, Description (2 columns)

---

## Severity Badge Color Mapping

Map to existing tokens, no new values needed:

| Severity | Token | Visual | Rationale |
|----------|-------|--------|-----------|
| `critical` | `--color-danger` (#c82333) | Red | Already WCAG-verified for text contrast |
| `high` | `--color-accent` (#8f6d00) | Amber | Already WCAG-verified, used for emphasis throughout site |
| `medium` | `--color-text-muted` (#666666) | Gray | De-emphasized, passes contrast |
| `low` | `--color-text-light` (#737373) | Light gray | Most subtle, still passes 4.5:1 |

Badge backgrounds use 15% alpha variants (same approach as `--color-primary-subtle`).

---

## Version Compatibility

No new packages. All patterns use:
- Standard CSS (`@media`, `display: block`, `::before`, `attr()`) -- universal browser support
- Vue 3.x `defineProps` + `computed` -- already in use throughout codebase
- `data-*` HTML attributes -- universal support
- CSS cascade layers -- supported in all evergreen browsers (Chrome 99+, Firefox 97+, Safari 15.4+)

---

## Installation

```bash
# No new packages required for v2.3
# All patterns use CSS and Vue 3 built-in features
```

---

## Sources

- Codebase: `src/assets/css/main.css` lines 3757-3784 -- directory-table responsive pattern at 768px -- HIGH confidence
- Codebase: `src/assets/css/main.css` lines 4289-4326 -- exhibit-table responsive pattern at 480px -- HIGH confidence
- Codebase: `src/components/PersonnelCard.vue` -- component signature and card grid precedent -- HIGH confidence
- Codebase: `src/components/exhibit/InvestigationReportLayout.vue` line 63 -- `data-label` attribute usage -- HIGH confidence
- Codebase: `src/assets/css/main.css` lines 758-773 -- PersonnelCard CSS in `@layer components` -- HIGH confidence
- Codebase: `src/data/exhibits.ts` -- existing table sections with Findings headings (exhibits A, E, J, L, N, O) -- HIGH confidence

---

*Stack research for: v2.3 Findings Data & Rendering*
*Researched: 2026-04-02*
