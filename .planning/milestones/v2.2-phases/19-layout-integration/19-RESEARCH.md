# Phase 19: Layout Integration - Research

**Researched:** 2026-04-02
**Domain:** Vue 3 component integration, layout template modification
**Confidence:** HIGH

## Summary

Phase 19 is a straightforward wiring task: import the existing `PersonnelCard` component into both `InvestigationReportLayout.vue` and `EngineeringBriefLayout.vue`, add a guarded personnel section block, and write tests confirming rendering and empty-state behavior. The two layouts are nearly identical templates (130 lines each), and the change is symmetrical across both.

All building blocks exist: `PersonnelCard.vue` accepts `personnel: ExhibitPersonnelEntry[]`, the `Exhibit` type already has an optional `personnel?` field, and 13 of 15 exhibits have populated personnel arrays. The integration follows the exact pattern already used by `TechTags` in both layouts. No new dependencies, no new CSS, no new types.

**Primary recommendation:** Apply identical changes to both layouts -- import PersonnelCard, add a `v-if` guarded `.exhibit-section` block after the resolution table and before `.exhibit-impact-tags`, heading "Project Team". Add PersonnelCard to test stubs. Write tests for personnel rendering and empty-state suppression.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Personnel section appears after the sections loop, before Skills & Technologies -- personnel context precedes technical tags
- Section heading text is "Project Team" -- clear, professional, matches portfolio tone
- Guard with `v-if="exhibit.personnel?.length"` -- no wrapper div rendered at all (matches existing empty-section suppression pattern from Phase 16)
- Wrap in `.exhibit-section` div with `<h2>` heading for visual consistency with other sections

### Claude's Discretion
- Import statement placement and ordering in script setup
- Test structure and assertion patterns (follow existing layout test conventions)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RNDR-04 | InvestigationReportLayout renders `exhibit.personnel` using PersonnelCard | Template insertion pattern verified; Exhibit J (IR fixture) has personnel data; insertion point between resolution table and impact tags confirmed at line 121 |
| RNDR-05 | EngineeringBriefLayout renders `exhibit.personnel` using PersonnelCard | Template insertion pattern verified; Exhibit A (EB fixture) has personnel data; insertion point between resolution table and impact tags confirmed at line 121 |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue 3 | 3.x | Component framework | Already in use; `<script setup>` + `defineProps` pattern |
| Vitest | 4.1.2 | Test runner | Already configured and running 128 passing tests |
| @vue/test-utils | (installed) | Component mounting | Already in use across all layout tests |

No new packages to install. This phase uses only existing dependencies.

## Architecture Patterns

### Integration Pattern (from TechTags precedent)

The exact pattern for wiring a child component into a layout is already established by `TechTags`:

1. Import in `<script setup>`:
```typescript
import PersonnelCard from '@/components/PersonnelCard.vue'
```

2. Use in template with guard:
```html
<div v-if="exhibit.personnel?.length" class="exhibit-section">
  <h2>Project Team</h2>
  <PersonnelCard :personnel="exhibit.personnel" />
</div>
```

3. Placement: after the `.exhibit-resolution` div (line ~120), before the `.exhibit-impact-tags` div (line ~122).

### Test Pattern (from existing layout tests)

Both layout test files follow identical conventions:
- Import component, `exhibits` array, and `Exhibit` type from `@/data/exhibits`
- Use real exhibit data as fixture (not mocks)
- Stub `RouterLink` and `TechTags` in `mountOptions.global.stubs`
- Test rendering presence with `.text().toContain()` and `.find().exists()`
- Test empty state with minimal `Exhibit` objects that omit optional fields

New tests should:
- Add `PersonnelCard: true` to the stubs object
- Test that "Project Team" heading appears when exhibit has personnel
- Test that no `.exhibit-section` with "Project Team" renders when personnel is absent
- Use existing fixture exhibits (Exhibit J for IR, Exhibit A for EB) which both have personnel data

### Insertion Point (verified)

Both layouts have identical structure at the insertion point:

```
Line ~107: <div v-if="exhibit.resolutionTable?.length" class="exhibit-resolution">
Line ~120: </div>  <!-- end resolution -->
           <!-- INSERT HERE -->
Line ~122: <div class="exhibit-impact-tags">
```

### Anti-Patterns to Avoid
- **Rendering an empty wrapper div:** The guard MUST be on the outer `.exhibit-section` div itself, not on the PersonnelCard inside a wrapper. This matches Phase 16's empty-section suppression pattern.
- **Divergent layouts:** Both layouts must receive identical personnel block markup. Do not customize per layout type.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Personnel rendering | Custom inline template | `PersonnelCard` component | Already built and tested in Phase 18 with named/anonymous/self modes |
| Empty state handling | Custom logic function | `v-if="exhibit.personnel?.length"` | Simple optional chaining guard; no helper function needed |

## Common Pitfalls

### Pitfall 1: Forgetting to stub PersonnelCard in tests
**What goes wrong:** Tests try to render PersonnelCard fully, which may cause import resolution issues or make tests brittle to PersonnelCard internals.
**Why it happens:** Existing tests only stub `RouterLink` and `TechTags`. Easy to forget adding the new component.
**How to avoid:** Add `PersonnelCard: true` to the stubs object alongside existing stubs.
**Warning signs:** Tests become slower or fail with import errors.

### Pitfall 2: Inserting at wrong template position
**What goes wrong:** Personnel section appears in wrong visual order (e.g., before resolution table or after impact tags).
**Why it happens:** Both layouts are 130 lines of template with multiple conditional blocks.
**How to avoid:** Insert immediately before the `.exhibit-impact-tags` div. Search for `exhibit-impact-tags` as the anchor.
**Warning signs:** Visual inspection shows personnel after Skills & Technologies.

### Pitfall 3: Using wrong import path
**What goes wrong:** Build or test failure.
**Why it happens:** PersonnelCard is at `src/components/PersonnelCard.vue` (top-level components), not in the `exhibit/` subdirectory.
**How to avoid:** Use `@/components/PersonnelCard.vue` (same level as TechTags import already in the file).

### Pitfall 4: Breaking exhibit-section count assertions
**What goes wrong:** Existing tests that count `.exhibit-section` elements may break because personnel adds one more.
**Why it happens:** Tests like `findAll('.exhibit-section').length` are sensitive to count.
**How to avoid:** Review existing assertions. Current tests use `toBeGreaterThan(0)` not exact counts, so this is low risk. But verify after implementation.

## Code Examples

### Layout template change (identical for both layouts)
```html
<!-- After resolution table, before impact tags -->
<div v-if="exhibit.personnel?.length" class="exhibit-section">
  <h2>Project Team</h2>
  <PersonnelCard :personnel="exhibit.personnel" />
</div>

<div class="exhibit-impact-tags">
  <h2>Skills &amp; Technologies</h2>
  <TechTags :tags="exhibit.impactTags" />
</div>
```

### Script setup addition (both layouts)
```typescript
import type { Exhibit, ExhibitSection } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'
import PersonnelCard from '@/components/PersonnelCard.vue'
```

### Test: personnel renders (InvestigationReportLayout example)
```typescript
const mountOptions = {
  global: { stubs: { RouterLink: true, TechTags: true, PersonnelCard: true } },
}

it('renders Project Team section when exhibit has personnel', () => {
  const wrapper = mount(InvestigationReportLayout, {
    props: { exhibit: irFixture },
    ...mountOptions,
  })
  expect(wrapper.text()).toContain('Project Team')
})
```

### Test: empty state (no personnel)
```typescript
it('does not render Project Team section when exhibit has no personnel', () => {
  const minimalExhibit: Exhibit = {
    label: 'Test', client: 'Test', date: '2025', title: 'Test',
    exhibitType: 'investigation-report',
    impactTags: ['test'], exhibitLink: '/exhibits/test',
    // no personnel field
  }
  const wrapper = mount(InvestigationReportLayout, {
    props: { exhibit: minimalExhibit },
    ...mountOptions,
  })
  expect(wrapper.text()).not.toContain('Project Team')
})
```

### Test fixture reference
| Layout | Test File | Existing Fixture | Has Personnel? |
|--------|-----------|-----------------|----------------|
| InvestigationReportLayout | `InvestigationReportLayout.test.ts` | Exhibit J (`/exhibits/exhibit-j`) | Yes |
| EngineeringBriefLayout | `EngineeringBriefLayout.test.ts` | Exhibit A (`/exhibits/exhibit-a`) | Yes |
| EngineeringBriefLayout | `EngineeringBriefLayout.test.ts` | Exhibit L (`/exhibits/exhibit-l`) | Yes |
| (empty state) | Both test files | Inline minimal `Exhibit` objects | No (no personnel field) |

Exhibit O is an `engineering-brief` type with no `personnel` field -- natural validation for the empty guard if needed in a real-data test.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` or inline in `vite.config.ts` |
| Quick run command | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts src/components/exhibit/EngineeringBriefLayout.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RNDR-04 | IR layout renders personnel with PersonnelCard | unit | `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts -x` | Exists (add new tests) |
| RNDR-05 | EB layout renders personnel with PersonnelCard | unit | `npx vitest run src/components/exhibit/EngineeringBriefLayout.test.ts -x` | Exists (add new tests) |

### Sampling Rate
- **Per task commit:** `npx vitest run src/components/exhibit/InvestigationReportLayout.test.ts src/components/exhibit/EngineeringBriefLayout.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green (currently 128 tests passing)

### Wave 0 Gaps
None -- existing test files cover both layouts. New test cases are additions to existing files, not new files.

## Project Constraints (from CLAUDE.md)

No project-level CLAUDE.md found at the repository root. Global CLAUDE.md instructions noted:
- Use search tools provided by Docker MCP Toolkit for internet queries (not relevant to this code-only phase)
- Playwright browser tools for visual verification (relevant for UI hint verification)

## Sources

### Primary (HIGH confidence)
- `src/components/exhibit/InvestigationReportLayout.vue` -- current template structure, line-by-line insertion point verified
- `src/components/exhibit/EngineeringBriefLayout.vue` -- confirmed identical structure to IR layout
- `src/components/PersonnelCard.vue` -- prop interface: `personnel: ExhibitPersonnelEntry[]`
- `src/data/exhibits.ts` -- `Exhibit.personnel?` field confirmed, 13/15 exhibits populated
- `src/components/exhibit/InvestigationReportLayout.test.ts` -- test conventions: stubs, fixtures, assertion patterns
- `src/components/exhibit/EngineeringBriefLayout.test.ts` -- test conventions confirmed identical to IR tests
- `.planning/phases/19-layout-integration/19-CONTEXT.md` -- locked decisions on placement, heading, guard
- `.planning/phases/19-layout-integration/19-UI-SPEC.md` -- visual contract for section wrapper, heading, spacing

### Secondary (MEDIUM confidence)
- None needed -- all research based on direct source code inspection

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all existing
- Architecture: HIGH -- exact pattern already in codebase (TechTags), verified by reading source
- Pitfalls: HIGH -- straightforward integration with well-understood edge cases

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- no external dependency drift risk)
