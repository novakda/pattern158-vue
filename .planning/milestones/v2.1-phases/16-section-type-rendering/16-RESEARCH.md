# Phase 16: Section Type Rendering - Research

**Researched:** 2026-04-02
**Domain:** Vue 3 template rendering, CSS design system integration
**Confidence:** HIGH

## Summary

Phase 16 addresses a rendering gap in the two exhibit detail layout components (`InvestigationReportLayout.vue` and `EngineeringBriefLayout.vue`). Both layouts currently handle only `text` and `table` section types via `v-if` conditions in their section iteration loops, but the data model defines five section types: `text`, `table`, `timeline`, `metadata`, and `flow`. The three unhandled types (`timeline` at 6 occurrences, `metadata` at 15, `flow` at 1) silently produce empty `.exhibit-section` divs with orphaned `<h2>` headings and no content.

The CSS design system already contains complete styles for all three missing section types under the `.page-exhibit-detail` scope -- timeline with vertical line and dot markers, flow with horizontal arrow chain (stacking vertically on mobile), and metadata with card grid layout. The work is purely template-level: adding `v-else-if` branches for each section type in both layout components, and adding a guard to suppress empty sections entirely.

**Primary recommendation:** Add three `v-else-if` template blocks (timeline, metadata, flow) to both layout components' section loops, matching the CSS class names already defined in `main.css`. Add a computed or inline guard on each section to skip rendering when the type-specific content array is empty.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SECT-01 | Timeline sections (6 occurrences) render entries with dates and descriptions | Data has `entries: ExhibitTimelineEntry[]` with `date`, `heading`, `body`, optional `quote`/`quoteAttribution`. CSS classes `.exhibit-timeline`, `.timeline-entry`, `.timeline-marker`, `.timeline-date`, `.timeline-heading`, `.timeline-body`, `.timeline-quote` all exist in main.css. |
| SECT-02 | Metadata sections (15 occurrences) render key-value items in structured layout | Data has `items: ExhibitMetadataItem[]` with `label` and `value`. CSS classes `.exhibit-metadata`, `.metadata-card` with `<dl>/<dt>/<dd>` structure exist in main.css as a card grid. |
| SECT-03 | Flow sections (1 occurrence) render step content | Data has `steps: ExhibitFlowStep[]` with `label` and `detail`, plus optional `body` for introductory text. CSS classes `.flow-step`, `.flow-node`, `.flow-label`, `.flow-detail`, `.flow-arrow` exist in main.css as horizontal arrow chain. |
| SECT-04 | Sections with no renderable content produce no DOM output | Both layouts must guard section rendering: skip the entire `.exhibit-section` div (including heading) when the type-specific content array is empty/undefined. Currently, a section with type `timeline` but no `entries` would still emit `<div class="exhibit-section"><h2>...</h2></div>`. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 | ^3.5.0 | Component framework | Already established in project |
| Vitest | ^4.1.0 | Unit testing | Already established in project |
| @vue/test-utils | (installed) | Component mounting in tests | Already established in project |

No new libraries needed. This phase is purely template and test changes within the existing stack.

## Architecture Patterns

### Current Section Rendering Pattern (both layouts are identical)
```vue
<template v-if="exhibit.sections?.length">
  <div v-for="(section, i) in exhibit.sections" :key="i" class="exhibit-section">
    <h2 v-if="section.heading">{{ section.heading }}</h2>
    <p v-if="section.type === 'text' && section.body">{{ section.body }}</p>
    <table v-if="section.type === 'table' && section.rows?.length" class="exhibit-table">
      <!-- table rendering -->
    </table>
  </div>
</template>
```

### Required Pattern: Add rendering branches for timeline, metadata, flow

The section loop needs three new `v-else-if` blocks and a wrapper guard. The exact CSS class names are dictated by the existing stylesheet:

**Timeline** (`entries` array):
```vue
<div v-else-if="section.type === 'timeline' && section.entries?.length" class="exhibit-timeline">
  <p v-if="section.body">{{ section.body }}</p>
  <div v-for="(entry, ei) in section.entries" :key="ei" class="timeline-entry">
    <span class="timeline-marker"></span>
    <span class="timeline-date">{{ entry.date }}</span>
    <h3 v-if="entry.heading" class="timeline-heading">{{ entry.heading }}</h3>
    <p v-if="entry.body" class="timeline-body">{{ entry.body }}</p>
    <blockquote v-if="entry.quote" class="timeline-quote">
      <p>{{ entry.quote }}</p>
      <footer v-if="entry.quoteAttribution">{{ entry.quoteAttribution }}</footer>
    </blockquote>
  </div>
</div>
```

**Metadata** (`items` array):
```vue
<dl v-else-if="section.type === 'metadata' && section.items?.length" class="exhibit-metadata">
  <div v-for="(item, mi) in section.items" :key="mi" class="metadata-card">
    <dt>{{ item.label }}</dt>
    <dd>{{ item.value }}</dd>
  </div>
</dl>
```

**Flow** (`steps` array):
```vue
<div v-else-if="section.type === 'flow' && section.steps?.length">
  <p v-if="section.body">{{ section.body }}</p>
  <div class="exhibit-flow" style="display:flex;flex-wrap:wrap;align-items:center;">
    <template v-for="(step, si) in section.steps" :key="si">
      <div v-if="si > 0" class="flow-arrow"></div>
      <div class="flow-step">
        <div class="flow-node">
          <span class="flow-label">{{ step.label }}</span>
          <span class="flow-detail">{{ step.detail }}</span>
        </div>
      </div>
    </template>
  </div>
</div>
```

### Pattern: Empty Section Suppression (SECT-04)

The outer `<div class="exhibit-section">` wrapping each section must be conditionally rendered. A section should be hidden when its type-specific content is absent:

```vue
<template v-for="(section, i) in exhibit.sections" :key="i">
  <div v-if="sectionHasContent(section)" class="exhibit-section">
    <h2 v-if="section.heading">{{ section.heading }}</h2>
    <!-- type-specific rendering -->
  </div>
</template>
```

Where `sectionHasContent` checks:
- `text`: `section.body` is truthy
- `table`: `section.rows?.length > 0`
- `timeline`: `section.entries?.length > 0`
- `metadata`: `section.items?.length > 0`
- `flow`: `section.steps?.length > 0`

This can be an inline helper function or a simple computed/method. Given the layouts don't use `<script setup>` heavily, a function in the script block is cleanest.

### Both Layouts Must Be Updated Identically

`InvestigationReportLayout.vue` and `EngineeringBriefLayout.vue` have identical section rendering logic (lines 38-55 in both files). Both need the same three new branches and the same empty-section guard. The only difference between the layouts is the header badge text/class.

### Anti-Patterns to Avoid
- **Adding new CSS classes not in main.css:** The CSS already defines all needed classes. Use exactly the class names from the stylesheet.
- **Extracting a shared section renderer component prematurely:** Both layouts are simple and identical section loops. A shared component could be a future refactor, but for a bug fix phase, duplicating the template branches is the correct scope.
- **Using `v-show` instead of `v-if` for empty sections:** `v-show` still renders DOM nodes (just hides them with `display:none`). SECT-04 requires no DOM output, so `v-if` is correct.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Timeline visualization | Custom timeline component | CSS already in main.css | 80+ lines of timeline CSS already exist with markers, vertical line, responsive breakpoints |
| Flow arrow chain | SVG arrows or custom drawing | CSS `::after` pseudo-elements | Flow arrows already implemented via `.flow-arrow::after` with right-arrow (desktop) and down-arrow (mobile) |
| Metadata card grid | Custom grid layout | CSS grid in main.css | `.exhibit-metadata` already uses `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))` |

**Key insight:** This is a template-only change. All visual styling is already implemented in the CSS design system. The bug is that the Vue templates never emit the HTML elements that the CSS targets.

## Common Pitfalls

### Pitfall 1: CSS Class Name Mismatch
**What goes wrong:** Using different class names than what main.css expects, resulting in unstyled content.
**Why it happens:** The CSS uses `.page-exhibit-detail .exhibit-timeline` (scoped to the page body class), and specific class names like `.timeline-marker`, `.timeline-heading`, `.timeline-body`.
**How to avoid:** Cross-reference every class name against main.css. The `useBodyClass('page-exhibit-detail')` in ExhibitDetailPage.vue already adds the required ancestor class.
**Warning signs:** Content renders but has no styling (no vertical line, no markers, no grid).

### Pitfall 2: Forgetting the `body` field on timeline and flow sections
**What goes wrong:** Some timeline sections have an optional `body` field at the section level (not the entry level) that provides introductory context. The flow section also has a `body` field.
**Why it happens:** The `body` field exists on `ExhibitSection` as an optional field used by text sections, but timeline and flow sections also use it for introductory paragraphs.
**How to avoid:** Check the data -- timeline sections at lines 164-166 and 192-194 have section-level `body` text. The flow section at line 1295 also has `body`. Render `section.body` before the entries/steps when present.
**Warning signs:** Missing introductory paragraphs on timeline and flow sections.

### Pitfall 3: Orphaned heading on empty section (SECT-04 regression)
**What goes wrong:** Adding content rendering but forgetting the outer guard, so a section with a heading but no entries/items/steps still renders `<div class="exhibit-section"><h2>Heading</h2></div>`.
**Why it happens:** The `v-if` on the content block prevents empty content, but the parent div and h2 still render.
**How to avoid:** Wrap the entire `.exhibit-section` div in a `v-if` that checks for content presence, or use a `<template>` wrapper with the content check.

### Pitfall 4: Flow container missing flex layout
**What goes wrong:** Flow steps stack vertically instead of flowing horizontally with arrows.
**Why it happens:** The CSS expects a flex container wrapping `.flow-step` and `.flow-arrow` elements. Looking at the CSS, `.flow-step` has `display: flex; align-items: center;` and `.flow-arrow` is a sibling element.
**How to avoid:** The flow rendering needs a wrapper div that the CSS can target. Check the CSS structure carefully -- the existing CSS at `.page-exhibit-detail .flow-step` expects the flow-step to contain `.flow-node`.

## Code Examples

### Data Type Interfaces (from src/data/exhibits.ts)
```typescript
// Source: src/data/exhibits.ts lines 12-38
export interface ExhibitFlowStep {
  label: string
  detail: string
}

export interface ExhibitTimelineEntry {
  date: string
  heading: string
  body: string
  quote?: string
  quoteAttribution?: string
}

export interface ExhibitMetadataItem {
  label: string
  value: string
}

export interface ExhibitSection {
  heading?: string
  type: 'text' | 'table' | 'flow' | 'timeline' | 'metadata'
  body?: string
  columns?: string[]
  rows?: string[][]
  steps?: ExhibitFlowStep[]
  entries?: ExhibitTimelineEntry[]
  items?: ExhibitMetadataItem[]
}
```

### CSS Class Inventory (from src/assets/css/main.css)

**Timeline classes (lines ~3818-3912):**
- `.page-exhibit-detail .exhibit-timeline` -- container with left padding and vertical line via `::before`
- `.page-exhibit-detail .timeline-entry` -- individual entry with relative positioning
- `.page-exhibit-detail .timeline-marker` -- circular dot positioned on the vertical line
- `.page-exhibit-detail .timeline-date` -- mono font, primary color, uppercase
- `.page-exhibit-detail .timeline-heading` -- bold heading for each entry
- `.page-exhibit-detail .timeline-body` -- body text
- `.page-exhibit-detail .timeline-quote` -- left-bordered blockquote with italic text

**Flow classes (lines ~3920-4006):**
- `.page-exhibit-detail .flow-step` -- flex container
- `.page-exhibit-detail .flow-node` -- flex column with centered items
- `.page-exhibit-detail .flow-label` -- heading font, bold
- `.page-exhibit-detail .flow-detail` -- smaller text
- `.page-exhibit-detail .flow-arrow` -- uses `::after` with right arrow character, rotates to down arrow on mobile

**Metadata classes (lines ~4008-4042):**
- `.page-exhibit-detail .exhibit-metadata` -- CSS grid with auto-fill columns
- `.page-exhibit-detail .metadata-card` -- bordered card with border-radius
- `.page-exhibit-detail .metadata-card dt` -- label (uppercase, small, muted)
- `.page-exhibit-detail .metadata-card dd` -- value text

### Section-level data counts (verified via grep)
| Type | Count | Exhibits Using |
|------|-------|----------------|
| text | 77 | Most exhibits |
| table | 37 | Multiple exhibits |
| timeline | 6 | Exhibit A (4 timelines), Exhibit E (1), Exhibit J (1) |
| metadata | 15 | All 15 exhibits (one each) |
| flow | 1 | Exhibit L only |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.x with happy-dom |
| Config file | vitest.config.ts (inferred from package.json scripts) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SECT-01 | Timeline sections render entries with dates and descriptions | unit | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts -x` | Exists (needs new tests) |
| SECT-02 | Metadata sections render key-value items | unit | `npx vitest run src/components/exhibit/EngineeringBriefLayout.test.ts -x` | Exists (needs new tests) |
| SECT-03 | Flow section renders step content | unit | `npx vitest run src/components/exhibit/EngineeringBriefLayout.test.ts -x` | Exists (needs new tests) -- flow is in Exhibit L (engineering-brief) |
| SECT-04 | Empty sections produce no DOM output | unit | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts -x` | Exists (needs new tests) |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Add timeline rendering tests to `InvestigationReportLayout.test.ts` (Exhibit A has 4 timelines, Exhibit J has 1)
- [ ] Add metadata rendering tests to both layout test files (all exhibits have metadata)
- [ ] Add flow rendering test to `EngineeringBriefLayout.test.ts` (Exhibit L has flow)
- [ ] Add empty-section suppression tests to both layout test files (use synthetic exhibit data with empty arrays)

### Test Fixtures Available
- **Exhibit A** (`/exhibits/exhibit-a`): Engineering Brief with 4 timeline sections, 1 metadata section. Used in `EngineeringBriefLayout.test.ts`.
- **Exhibit J** (`/exhibits/exhibit-j`): Investigation Report with 1 timeline section, 1 metadata section. Used in `InvestigationReportLayout.test.ts`.
- **Exhibit L** (`/exhibits/exhibit-l`): Engineering Brief with the single flow section plus metadata. Not currently used in any test but available via `exhibits.find()`.

### Existing Test Coverage
Current tests already verify:
- Section headings render (IR test checks "Sequence of Events" text)
- Section count is > 0
- Context fallback works when no sections present
- Impact tags render

Tests do NOT verify:
- Timeline entry content (dates, descriptions, quotes)
- Metadata card content (labels, values)
- Flow step content (labels, details)
- Empty section suppression

## Open Questions

1. **Shared section rendering component?**
   - What we know: Both layouts have identical section rendering logic. Extracting a shared component would reduce duplication.
   - What's unclear: Whether the project philosophy ("components for readability") favors extraction now or later.
   - Recommendation: For this bug-fix phase, duplicate the template branches in both layouts. Note the duplication as a future cleanup opportunity. The project's Key Decision log shows a pattern of keeping scope tight in bug-fix phases.

2. **Flow container element structure**
   - What we know: CSS targets `.flow-step` and `.flow-arrow` as siblings, with `.flow-node` inside `.flow-step`. The CSS does not show an explicit `.exhibit-flow` wrapper class.
   - What's unclear: Whether the horizontal flow needs an explicit flex wrapper or if the CSS handles this via the parent `.exhibit-section`.
   - Recommendation: Review the CSS carefully during implementation. The `.flow-step` CSS already has `display: flex; align-items: center;` suggesting each step is a flex row. The overall flow container may need `display: flex; flex-wrap: wrap;` or the CSS may handle this through the exhibit-section parent. Test visually.

## Sources

### Primary (HIGH confidence)
- `src/data/exhibits.ts` lines 1-61 -- type definitions for all section types
- `src/components/exhibit/InvestigationReportLayout.vue` -- current template (text + table only)
- `src/components/exhibit/EngineeringBriefLayout.vue` -- current template (identical to IR)
- `src/assets/css/main.css` lines 3694-4042 -- complete CSS for exhibit-detail sections including timeline, flow, metadata
- `src/data/exhibits.ts` grep counts -- 6 timeline, 15 metadata, 1 flow confirmed

### Secondary (MEDIUM confidence)
- CSS class name mapping -- derived from reading main.css, should be verified during implementation by visual inspection

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, all existing
- Architecture: HIGH - data types, CSS classes, and template patterns all directly inspected in source
- Pitfalls: HIGH - derived from concrete code analysis, not general knowledge

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- this is a bug fix on existing code)
