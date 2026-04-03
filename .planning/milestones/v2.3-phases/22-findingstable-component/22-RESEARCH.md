# Phase 22: FindingsTable Component - Research

**Researched:** 2026-04-02
**Domain:** Vue 3 SFC component with responsive dual-DOM rendering
**Confidence:** HIGH

## Summary

This phase builds a single Vue 3 SFC (`FindingsTable.vue`) that renders exhibit findings data in two DOM representations: a semantic HTML `<table>` for desktop and stacked cards for mobile. The component auto-detects which column pattern to use (2-col or 3-col) by inspecting the findings data, and renders severity badges for exhibits that include severity data.

The project has a well-established component pattern from PersonnelCard.vue (Phase 17-18) that serves as the direct template for this work. The CSS design token system is mature with all needed tokens already defined. The test infrastructure (Vitest 4.1 + happy-dom + @vue/test-utils) is proven and the TDD pattern from PersonnelCard.test.ts provides the exact testing approach to follow.

**Primary recommendation:** Follow the PersonnelCard pattern exactly -- same SFC structure, same test structure, same CSS token consumption. The only novel aspects are the dual-DOM rendering (table + cards toggled by media query) and the column-detection logic.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Component name: `FindingsTable.vue` with CSS class prefix `.findings-table-*`
- Props interface: `{ findings: ExhibitFindingEntry[], heading?: string }`
- Column detection: auto-inspect first finding's populated fields (no explicit column prop)
- Dual DOM approach: render both `<table>` and card grid, CSS media query toggles at 768px
- Desktop: semantic `<table>` element with column headers
- Mobile: CSS grid cards similar to PersonnelCard layout
- Severity badges: inline colored pills using `--color-danger` (Critical) and `--color-accent` (High)
- Severity badge only renders when severity field is populated (currently only Exhibit L)

### Claude's Discretion
- Exact CSS grid card layout details (gap, padding, field arrangement within card)
- Dark theme token mapping for severity badge colors
- Table column header text derivation from populated fields
- TDD test structure and assertion patterns

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RNDR-01 | FindingsTable renders as semantic `<table>` on desktop | Existing `.exhibit-table` CSS pattern (main.css:4000-4025) provides exact styling reference; dual-DOM approach with `.findings-table-desktop` class |
| RNDR-02 | FindingsTable renders as stacked cards on mobile (768px breakpoint) | PersonnelCard.vue `.personnel-grid`/`.personnel-card` CSS (main.css:758-774) provides card pattern; `.findings-table-mobile` shown below 768px |
| RNDR-03 | Column-adaptive rendering for 2-col and 3-col patterns | Three patterns identified from real data: 2-col (Finding/Description), 3-col (Finding/Background/Resolution), 3-col (Finding/Severity/Description). Detection logic inspects `severity` and `background` fields |
| RNDR-04 | Severity badges with visual treatment | UI-SPEC defines pill badges with `--radius-pill`, `--font-size-xs`, weight 700, uppercase. Light: colored bg + white text. Dark: colored text + transparent bg + border |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 | (project version) | SFC component with `<script setup>` | Project standard |
| TypeScript | (project version) | Type-safe props via `ExhibitFindingEntry` | Project standard |

### Supporting (Test)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.2 | Unit test runner | TDD: write tests before component |
| @vue/test-utils | (project version) | Component mounting + DOM assertions | All component tests |
| happy-dom | (project version) | DOM environment for unit tests | Vitest unit project config |

No new packages needed. All dependencies already installed.

## Architecture Patterns

### Component File Structure
```
src/components/
  FindingsTable.vue          # New SFC (this phase)
  FindingsTable.test.ts      # New test file (this phase)
  PersonnelCard.vue          # Reference pattern (exists)
  PersonnelCard.test.ts      # Reference test pattern (exists)
```

### Pattern 1: Single-File Component with Scoped Logic
**What:** Vue 3 SFC using `<script setup lang="ts">` with typed props, no scoped styles (CSS in main.css)
**When to use:** All components in this project
**Example (from PersonnelCard.vue):**
```typescript
<script setup lang="ts">
import type { ExhibitFindingEntry } from '@/data/exhibits'

defineProps<{
  findings: ExhibitFindingEntry[]
  heading?: string
}>()
</script>
```
Source: `/home/xhiris/projects/pattern158-vue/src/components/PersonnelCard.vue`

### Pattern 2: Dual-DOM Responsive Rendering
**What:** Render both desktop (`<table>`) and mobile (card grid) DOM, toggle visibility with CSS media queries
**When to use:** This component specifically -- chosen over single-DOM reflow because table and card are structurally different
**Example:**
```html
<template>
  <section class="findings-table-section">
    <h3 v-if="heading" class="findings-table-heading">{{ heading }}</h3>

    <!-- Desktop: semantic table -->
    <table class="findings-table-desktop">
      <thead>...</thead>
      <tbody>...</tbody>
    </table>

    <!-- Mobile: stacked cards -->
    <div class="findings-table-mobile">
      <div v-for="..." class="findings-table-card">...</div>
    </div>
  </section>
</template>
```

### Pattern 3: Column Detection via Computed Property
**What:** Inspect findings array to determine which column set to render
**When to use:** This component -- determines table columns and card fields dynamically
**Logic:**
```typescript
const columnPattern = computed(() => {
  if (props.findings.some(f => f.severity)) return 'severity'    // Finding + Description + Severity
  if (props.findings.some(f => f.background)) return 'background' // Finding + Background + Resolution
  return 'default'                                                 // Finding + Description
})
```
Source: CONTEXT.md column detection decision, verified against real data in exhibits.ts

### Pattern 4: TDD Test Structure (from PersonnelCard.test.ts)
**What:** Tests organized by requirement ID, using mount helper, mixing inline fixtures with real data
**Example:**
```typescript
describe('FindingsTable', () => {
  const mountTable = (findings: ExhibitFindingEntry[], heading?: string) =>
    mount(FindingsTable, { props: { findings, heading } })

  describe('RNDR-01: Desktop table rendering', () => { ... })
  describe('RNDR-02: Mobile card rendering', () => { ... })
  describe('RNDR-03: Column-adaptive rendering', () => { ... })
  describe('RNDR-04: Severity badges', () => { ... })
})
```
Source: `/home/xhiris/projects/pattern158-vue/src/components/PersonnelCard.test.ts`

### Anti-Patterns to Avoid
- **Scoped styles in SFC:** This project puts all CSS in `main.css` within cascade layers, not in `<style scoped>` blocks
- **JS-based responsive switching:** Do NOT use `window.matchMedia` or resize observers for responsive toggling -- use CSS media queries on the dual DOM
- **Explicit column prop:** Column detection is automatic from data shape, not passed as a prop

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive table | JS resize observer | CSS media query on dual DOM | Simpler, no hydration issues, matches project pattern |
| Severity color mapping | Inline style with hex values | CSS classes consuming design tokens | Dark/light theme handled automatically |
| Column configuration | Generic table component with column config | Computed property inspecting data shape | Only 3 known patterns, YAGNI |

## Common Pitfalls

### Pitfall 1: CSS Class Collision with Existing Styles
**What goes wrong:** Using `.finding-*` classes (already used by homepage FindingCard) or `.exhibit-table` (used by legacy table styling)
**Why it happens:** Similar naming domains
**How to avoid:** Strict `.findings-table-*` prefix as locked in CONTEXT.md
**Warning signs:** Unexpected styling on other pages after adding CSS

### Pitfall 2: Dual DOM Accessibility
**What goes wrong:** Screen readers see both table and cards, reading content twice
**Why it happens:** CSS `display: none` hides visually but both DOMs exist
**How to avoid:** `display: none` actually does remove elements from accessibility tree in modern browsers. However, verify with `aria-hidden` if needed on the hidden variant.
**Warning signs:** Content duplication in screen reader testing

### Pitfall 3: Severity Badge Color Contrast in Dark Mode
**What goes wrong:** Using light-mode badge approach (colored background + white text) in dark mode results in poor contrast
**Why it happens:** Dark theme needs inverted treatment
**How to avoid:** UI-SPEC defines separate dark mode treatment: colored text on transparent background with 1px border. Use `[data-theme="dark"]` selector.
**Warning signs:** Badges look washed out or unreadable in dark mode

### Pitfall 4: Testing CSS Media Query Toggle
**What goes wrong:** Trying to test responsive behavior in happy-dom unit tests
**Why it happens:** happy-dom doesn't fully support CSS media queries
**How to avoid:** Unit tests verify both DOM structures exist and have correct classes. Visual responsive testing is for Storybook/browser tests (Phase 24).
**Warning signs:** Tests trying to assert visibility based on viewport width

### Pitfall 5: Column Detection on Empty Array
**What goes wrong:** Calling `.some()` on empty array returns false -- which is correct but the component should not render at all when findings is empty
**Why it happens:** Edge case not considered
**How to avoid:** Parent layout handles empty suppression (Phase 23), but component should still be defensive -- `v-if="findings.length"` at root or rely on parent

## Code Examples

### Real Data Shapes (from exhibits.ts)

**2-col pattern (Finding + Description):** Exhibits E, J, N, O
```typescript
{ finding: 'Cross-domain architecture', description: 'EasyXDM-based communication layer...' }
```

**3-col background pattern (Finding + Background + Resolution):** Exhibit A
```typescript
{
  finding: 'SCORM courses dependent on Cornerstone Network Player',
  background: 'SCORM requires a player to communicate...',
  resolution: 'Dan provided a cross-domain SCORM wrapper...'
}
```

**3-col severity pattern (Finding + Severity + Description):** Exhibit L
```typescript
{ finding: 'No data model', severity: 'Critical', description: 'No fully defined data model existed...' }
{ finding: 'No data model governance', severity: 'High', description: 'No schema review process...' }
```

### Custom Headings (from exhibits.ts)
Two exhibits use custom `findingsHeading`:
- Exhibit J: `"Findings -- Five Concurrent Systemic Failures (Swiss Cheese Model)"`
- Exhibit L: `"Findings -- Five Foundational Gaps"`

All other exhibits with findings use the default "Findings" heading.

### Severity Badge CSS Pattern
```css
/* Light mode */
.findings-table-badge {
    display: inline-block;
    border-radius: var(--radius-pill);
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1;
}

.findings-table-badge--critical {
    background: var(--color-danger);
    color: #fff;
}

.findings-table-badge--high {
    background: var(--color-accent-on-alt);
    color: #fff;
}

/* Dark mode */
[data-theme="dark"] .findings-table-badge--critical {
    background: transparent;
    color: var(--color-danger);  /* #ff8c99 in dark mode */
    border: 1px solid currentColor;
}

[data-theme="dark"] .findings-table-badge--high {
    background: transparent;
    color: var(--color-accent);  /* #d9b232 in dark mode */
    border: 1px solid currentColor;
}
```
Source: UI-SPEC severity badge contracts + existing dark theme tokens (main.css:173-176)

### Existing Table CSS Reference (main.css:4000-4025)
```css
.page-exhibit-detail .exhibit-table {
    width: 100%;
    border-collapse: collapse;
}
.page-exhibit-detail .exhibit-table th {
    background: var(--color-background-alt);
    padding: var(--space-sm) var(--space-md);
    /* font-weight: 600, font-size: --font-size-sm, 2px bottom border */
}
.page-exhibit-detail .exhibit-table td {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
}
.page-exhibit-detail .exhibit-table tr:hover td {
    background: var(--color-background-alt);
}
```

### Existing Card CSS Reference (main.css:758-774)
```css
.personnel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--space-md);
}
.personnel-card {
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
}
```

## State of the Art

No external dependencies or evolving APIs. This is pure Vue 3 + CSS custom properties, both stable.

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.exhibit-table` with CSS reflow on mobile | Dual DOM with dedicated table + card markup | This phase | Cleaner separation, no hacky `display: block` on table rows |
| `data-label` attribute for mobile pseudo-element labels | Explicit label elements in card DOM | This phase | More reliable, no pseudo-element content issues |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` (unit project: happy-dom) |
| Quick run command | `npx vitest run --project unit src/components/FindingsTable.test.ts` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RNDR-01 | Desktop table renders with `<table>`, `<th>`, `<td>` elements | unit | `npx vitest run --project unit src/components/FindingsTable.test.ts` | No -- Wave 0 |
| RNDR-02 | Mobile card grid renders with `.findings-table-card` elements | unit | same | No -- Wave 0 |
| RNDR-03 | Column detection: 2-col default, 3-col severity, 3-col background | unit | same | No -- Wave 0 |
| RNDR-04 | Severity badge renders with correct class for Critical/High | unit | same | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit src/components/FindingsTable.test.ts`
- **Per wave merge:** `npx vitest run --project unit`
- **Phase gate:** Full suite green before verification

### Wave 0 Gaps
- [ ] `src/components/FindingsTable.test.ts` -- covers RNDR-01 through RNDR-04
- No new fixtures needed -- uses `ExhibitFindingEntry` inline mocks + real exhibit data from `exhibits.ts`
- No framework install needed -- Vitest 4.1.2 and @vue/test-utils already configured

## Open Questions

1. **Heading default behavior**
   - What we know: `heading` prop is optional, default is "Findings" per copywriting contract
   - What's unclear: Should the component render a heading when prop is omitted, or only when explicitly passed?
   - Recommendation: Render "Findings" as default when prop is omitted (`heading ?? 'Findings'`), since all exhibits need a heading and parent layouts can override via prop. UI-SPEC confirms default is "Findings".

2. **CSS placement: main.css vs scoped styles**
   - What we know: Project convention puts CSS in main.css within cascade layers, not scoped styles
   - What's unclear: Whether new components should continue this pattern or start using scoped styles
   - Recommendation: Follow existing convention -- add to `@layer components` in main.css. This is how PersonnelCard CSS is structured.

## Sources

### Primary (HIGH confidence)
- `src/components/PersonnelCard.vue` -- direct component pattern reference
- `src/components/PersonnelCard.test.ts` -- direct test pattern reference
- `src/data/exhibits.ts` -- ExhibitFindingEntry interface and real data shapes
- `src/assets/css/main.css` -- design tokens, existing table CSS, personnel card CSS
- `vitest.config.ts` -- test infrastructure configuration
- `22-CONTEXT.md` -- locked implementation decisions
- `22-UI-SPEC.md` -- visual and interaction contracts

### Secondary (MEDIUM confidence)
- None needed -- all information from project source code

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already in project, versions verified
- Architecture: HIGH - direct precedent in PersonnelCard, all patterns from existing code
- Pitfalls: HIGH - identified from real CSS class names and dark mode token analysis

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- no external dependency changes expected)
