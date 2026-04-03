# Phase 18: PersonnelCard Component - Research

**Researched:** 2026-04-02
**Domain:** Vue 3 component development, CSS grid layout, conditional rendering
**Confidence:** HIGH

## Summary

This phase builds a single Vue 3 component (`PersonnelCard`) that renders `ExhibitPersonnelEntry` objects with three display modes: named persons (full details), anonymous persons (title as name substitute), and self-entries (visual highlight). The data model is already defined and populated from Phase 17. The existing codebase provides clear patterns for component structure, prop typing, and CSS design token usage.

The component is straightforward -- no external libraries needed, no complex state management, no API calls. The primary challenge is getting the information hierarchy right across the three display modes while respecting the design system tokens. Exhibit A has the most personnel (12 entries including 5 anonymous), which serves as the stress test for layout.

**Primary recommendation:** Build a single `PersonnelCard.vue` component receiving the full `ExhibitPersonnelEntry[]` array as a prop, rendering a CSS grid of mini cards with conditional class application for the three display modes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Mini card layout -- each personnel entry gets its own small card block with stacked fields, not inline rows or chips.
- **D-02:** Responsive CSS grid arrangement -- flows from 1 to 3 columns based on viewport width.
- **D-03:** Role field takes visual priority over title. Role is the more meaningful descriptor of someone's contribution to the project.
- **D-04:** Title serves as the name substitute for anonymous persons -- it occupies the primary/name position on the card when `name` is absent.
- **D-05:** Use existing CSS design system tokens (custom properties from main.css) for colors, spacing, typography. Component adds minimal scoped CSS for its own layout only.
- **D-06:** Anonymous entries (no `name` field) show title in the name position with muted/italic styling to signal it's a role, not a person's name.
- **D-07:** Render whatever fields exist on an entry -- no minimum field requirements. A card with just a title is fine.

### Claude's Discretion
- Information order within cards (respecting D-03 role > title and D-04 title-as-name for anonymous)
- Card chrome (borders, background tint, or flat text blocks)
- Section heading ("Project Team" or defer to Phase 19 layout)
- Large list handling (show all or collapsible threshold)
- Self-entry visual treatment (accent border, background tint, badge, etc.)
- Self-entry positioning (sort to top or maintain data order)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RNDR-01 | PersonnelCard component displays named persons showing name, title, organization, and role | Data model verified: `ExhibitPersonnelEntry` has all four optional fields. 14 exhibits with personnel data populated. Component renders conditionally based on field presence (D-07). |
| RNDR-02 | PersonnelCard displays anonymous persons (no `name`) as "Title, Organization" | 9 anonymous entries found across data (5 in Exhibit A, 1 in Exhibit J, 3 in Exhibit M). D-04/D-06 specify title occupies name position with muted/italic styling. |
| RNDR-03 | PersonnelCard visually highlights `isSelf` entries | All 14 exhibits have exactly one `isSelf: true` entry (Dan Novak). Discretion area for visual treatment. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 | ^3.5.0 | Component framework | Already in project |
| TypeScript | ~5.7.0 | Type safety | Already in project |
| Vitest | ^4.1.0 | Unit testing | Already in project |
| @vue/test-utils | (installed) | Component mounting in tests | Already used by existing layout tests |

### Supporting
No additional libraries needed. This is a pure Vue component using:
- `<script setup lang="ts">` with `defineProps`
- Scoped CSS using design system tokens from `main.css`
- No runtime dependencies beyond Vue itself

**Installation:** None required -- all dependencies already present.

## Architecture Patterns

### Component Location
```
src/components/
  PersonnelCard.vue          # The component
  PersonnelCard.test.ts      # Unit tests (happy-dom)
```

### Pattern 1: Prop Design -- Array Prop with Grid Wrapper
**What:** Component receives the full `ExhibitPersonnelEntry[]` array and renders the grid internally, rather than receiving individual entries.
**Why:** D-01 and D-02 specify a CSS grid of mini cards. The grid container must be in the same component that owns the cards so CSS grid properties apply correctly. Passing individual entries would require the parent to also handle grid layout, violating separation.

```vue
<script setup lang="ts">
import type { ExhibitPersonnelEntry } from '@/data/exhibits'

defineProps<{
  personnel: ExhibitPersonnelEntry[]
}>()
</script>
```

### Pattern 2: Conditional Rendering per Display Mode
**What:** Use computed class bindings and v-if/v-else to handle the three modes.
**When:** Every card render.

```vue
<template>
  <div class="personnel-grid">
    <div
      v-for="(person, i) in personnel"
      :key="i"
      :class="['personnel-card', { 'personnel-card--self': person.isSelf }]"
    >
      <!-- Named person: show name -->
      <div v-if="person.name" class="personnel-name">{{ person.name }}</div>
      <!-- Anonymous person: show title in name position with muted style -->
      <div v-else-if="person.title" class="personnel-name personnel-name--anonymous">
        {{ person.title }}
      </div>

      <!-- Role (priority over title per D-03) -->
      <div v-if="person.role" class="personnel-role">{{ person.role }}</div>

      <!-- Title (only when not already used as name substitute) -->
      <div v-if="person.name && person.title" class="personnel-title">{{ person.title }}</div>

      <!-- Organization -->
      <div v-if="person.organization" class="personnel-org">{{ person.organization }}</div>
    </div>
  </div>
</template>
```

### Pattern 3: CSS Grid with Design Tokens (D-02, D-05)
**What:** Responsive grid using existing spacing/color tokens.

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
}

.personnel-card--self {
  border-left: 3px solid var(--color-primary);
  background: var(--color-primary-subtle);
}

.personnel-name--anonymous {
  font-style: italic;
  color: var(--color-text-muted);
}
```

### Pattern 4: Existing Component Convention
**What:** Follow ExhibitCard.vue patterns.
- `<script setup lang="ts">` at top
- Typed `defineProps<{}>()` (no withDefaults needed since array is required)
- Template uses `:class` array syntax for conditional classes
- No `<style>` block in component -- CSS goes in main.css or uses scoped styles

**Key observation:** ExhibitCard.vue has NO `<style>` block -- all styles live in main.css. The layout components also have no style blocks. This project puts CSS in main.css organized by page/component sections. PersonnelCard should follow this pattern: add a `PERSONNEL CARD` section to main.css.

### Anti-Patterns to Avoid
- **Separate wrapper + card components:** Over-engineering for this use case. One component handles both the grid and the cards.
- **Slot-heavy API:** The component has a single clear rendering path per mode. Slots would add complexity with no benefit since Phase 19 just passes the array.
- **Using `v-html`:** All content is plain text from typed data. No HTML rendering needed.
- **Hardcoded colors/spacing:** Use design tokens exclusively (D-05).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive grid | Custom JS resize observer | CSS `grid-template-columns: repeat(auto-fill, minmax())` | Pure CSS solution, no JS needed |
| Dark mode support | Manual color switching | Design tokens already handle light/dark via CSS custom properties | Project already has dark mode token system |

## Common Pitfalls

### Pitfall 1: Title Appearing Twice for Named Persons
**What goes wrong:** If rendering logic is not careful, a named person shows their title both in the details area AND in the name position.
**Why it happens:** D-04 says title occupies the name position for anonymous persons, but it should still appear as a detail field for named persons.
**How to avoid:** Use `v-if="person.name"` to gate the name display, and conditionally show title in the details area only when `person.name` exists (so it is not duplicated from the name position).
**Warning signs:** A card showing the same title string twice.

### Pitfall 2: Empty Cards for Minimal Data
**What goes wrong:** A card with only one field (e.g., just `title`) renders with too much empty space or broken layout.
**Why it happens:** D-07 says render whatever fields exist, so some cards may have very little content.
**How to avoid:** Use minimal padding and let the card shrink naturally. Test with the actual data -- the sparsest real entries have at least `title` + `organization` or `title` + `role`.
**Warning signs:** Large empty card blocks in the grid.

### Pitfall 3: CSS Not Scoped Properly
**What goes wrong:** PersonnelCard styles leak to other parts of the app, or existing personnel table styles bleed into the new component.
**Why it happens:** Existing `.person-name` and `.person-org` classes exist in main.css scoped to `.page-exhibit-a` and `.page-exhibit-j/k/l`. New component uses different class names but could conflict if not careful.
**How to avoid:** Use `.personnel-` prefix (not `.person-`) for all new classes. The existing classes use `.person-name`, `.person-org` -- the new component should use `.personnel-name`, `.personnel-org`, etc.
**Warning signs:** Style changes appearing on exhibit detail pages.

### Pitfall 4: Grid Column Count on Mobile
**What goes wrong:** Cards render too small on narrow viewports.
**Why it happens:** `minmax(240px, 1fr)` may still try to fit 2 columns on a 500px viewport.
**How to avoid:** The `auto-fill` with `minmax(240px, 1fr)` naturally collapses to 1 column below ~480px. Test at 320px and 375px viewports. If needed, add a media query override for single column below a breakpoint.
**Warning signs:** Cards appearing squished on mobile.

## Code Examples

### Exhibit A Personnel Data (12 entries, largest dataset)
```typescript
// Source: src/data/exhibits.ts lines 101-114
// 7 named entries + 5 anonymous entries
{ name: 'Dan Novak', title: 'Lead Investigator / Solution Architect', organization: 'GP Strategies', isSelf: true }
{ name: 'Tracey Nicholson', title: 'Chief of Learning Services...', organization: 'Electric Boat' }
// ...5 more named entries...
{ title: 'Program Manager', organization: 'GP Strategies', role: 'Coordinated engagement' }  // anonymous
{ title: 'Co-Investigator', organization: 'GP Strategies', role: 'Assisted with testing' }     // anonymous
// ...3 more anonymous entries...
```

### Exhibit J Personnel Data (anonymous entry with role, no org)
```typescript
// Source: src/data/exhibits.ts line 1246
{ title: 'Investigation Lead', role: 'Project authorization, stakeholder management...' }
// No name, no organization -- just title and role
```

### Exhibit M Personnel Data (anonymized entries)
```typescript
// Source: src/data/exhibits.ts lines 1445-1447
{ title: 'External Power Platform Consultancy', role: 'Original architects...' }
{ title: 'Lead Developer (anonymized)', role: 'Primary developer...' }
{ title: 'Governance Architect (anonymized)', role: 'Recipient of the findings deliverable...' }
```

### Existing Test Pattern (from EngineeringBriefLayout.test.ts)
```typescript
// Source: src/components/exhibit/EngineeringBriefLayout.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const mountOptions = {
  global: { stubs: { RouterLink: true, TechTags: true } },
}

// Tests use real exhibit data as fixtures
const fixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')!
```

### Design Token Reference
```css
/* Source: src/assets/css/main.css lines 9-99 */
/* Key tokens for PersonnelCard */
--color-primary: #0e7c8c;           /* accent color */
--color-primary-subtle: rgba(14, 124, 140, 0.15);  /* subtle background for self highlight */
--color-text-muted: #666666;        /* muted text for anonymous title-as-name */
--color-border: #dddddd;            /* card border */
--color-heading: #1a2838;           /* name text */
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--radius-md: 4px;
--font-size-sm: 0.875rem;
--font-size-xs: var(--space-ms);    /* 0.75rem */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

## Data Inventory

### Personnel Entry Counts by Exhibit
| Exhibit | Entries | Named | Anonymous | Has isSelf |
|---------|---------|-------|-----------|------------|
| A | 12 | 7 | 5 | Yes |
| B | 7 | 7 | 0 | Yes |
| C | 4 | 4 | 0 | Yes |
| D | 6 | 6 | 0 | Yes |
| E | 4 | 4 | 0 | Yes |
| F | 7 | 7 | 0 | Yes |
| G | 4 | 4 | 0 | Yes |
| H | 3 | 3 | 0 | Yes |
| I | 3 | 3 | 0 | Yes |
| J | 3 | 2 | 1 | Yes |
| K | 5 | 5 | 0 | Yes |
| L | 4 | 4 | 0 | Yes |
| M | 2 (+3 anon) | 1 | 3 | Yes |
| N | 2 | 2 | 0 | Yes |

**Key insight:** Maximum 12 entries (Exhibit A). No exhibit exceeds a comfortable 3-column grid display without scrolling. A collapsible threshold is unnecessary for the current data.

### Field Combinations Present in Data
| Combination | Count | Example |
|-------------|-------|---------|
| name + title + org | Most common | Named person with organization |
| name + title + org + isSelf | 14 | Dan Novak entries |
| name + title + role + isSelf | 2 | Exhibit E, J (Dan entries with role instead of org) |
| title + org + role | 5 | Anonymous Exhibit A entries |
| title + role (no org) | 4 | Anonymous Exhibit J, M entries |
| name + title + org + role | 0 | Not present in current data |

## Section Heading Pattern Analysis

Both `InvestigationReportLayout.vue` and `EngineeringBriefLayout.vue` use `<h2>` headings inside their section content areas for labeled sections (e.g., "Resolution", "Skills & Technologies"). Section headings come from the data (`section.heading`) or are hardcoded for known sections.

**Recommendation:** The PersonnelCard component should NOT include a section heading. The heading ("Project Team" or similar) should be the responsibility of the layout component in Phase 19, consistent with how "Resolution" and "Skills & Technologies" headings are placed in the layout templates, not in child components like `TechTags`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 with happy-dom |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run --project unit src/components/PersonnelCard.test.ts` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RNDR-01 | Named person shows name, title, org, role | unit | `npx vitest run --project unit src/components/PersonnelCard.test.ts` | No -- Wave 0 |
| RNDR-02 | Anonymous person shows title in name position, no "Unknown" text | unit | same | No -- Wave 0 |
| RNDR-03 | isSelf entry has distinct visual class | unit | same | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit src/components/PersonnelCard.test.ts`
- **Per wave merge:** `npx vitest run --project unit`
- **Phase gate:** Full unit suite green before verify

### Wave 0 Gaps
- [ ] `src/components/PersonnelCard.test.ts` -- covers RNDR-01, RNDR-02, RNDR-03
- Framework and test utils already installed and configured

## Sources

### Primary (HIGH confidence)
- `src/data/exhibits.ts` -- ExhibitPersonnelEntry interface (lines 42-48), personnel data for all 14 exhibits
- `src/components/ExhibitCard.vue` -- component structure pattern (no style block, typed defineProps)
- `src/components/exhibit/EngineeringBriefLayout.vue` -- section heading patterns, integration target
- `src/components/exhibit/InvestigationReportLayout.vue` -- section heading patterns, integration target
- `src/components/exhibit/EngineeringBriefLayout.test.ts` -- test pattern with mount, stubs, real fixtures
- `src/assets/css/main.css` -- design tokens, existing personnel table CSS (reference only)
- `vitest.config.ts` -- test configuration with unit (happy-dom) and browser projects
- `package.json` -- dependency versions verified

### Secondary (MEDIUM confidence)
- None needed -- this phase is entirely internal to the existing codebase

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies already in project, no new libraries
- Architecture: HIGH -- patterns directly observed from existing components
- Pitfalls: HIGH -- derived from actual data inspection and existing CSS analysis

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- pure component build with no external dependencies)
