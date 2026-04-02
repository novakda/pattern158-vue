# Phase 10: Detail Template Extraction - Research

**Researched:** 2026-03-31
**Domain:** Vue 3 component refactoring -- splitting monolithic page into dispatcher + layout components
**Confidence:** HIGH

## Summary

Phase 10 is a pure refactoring phase with no new dependencies. The existing ExhibitDetailPage.vue (157 lines) must be split into a thin dispatcher (~30 lines) plus two self-contained layout components: InvestigationReportLayout and EngineeringBriefLayout. All rendering logic, CSS classes, and section type handling already exist and work correctly -- this phase redistributes them.

The critical research finding is the data audit of all 15 exhibits. Investigation Reports (5 exhibits: J, K, L, M, N) consistently use NTSB-style forensic framing with headings like "Investigation Methodology," "Probable Cause," "Findings," and "Sequence of Events" (timeline sections). Engineering Briefs (10 exhibits: A-I, O) use a broader variety of headings emphasizing technical contributions, outcomes, and context -- but crucially, the raw section data is structurally identical (same ExhibitSection types). The layout differentiation per DTPL-03 must come from presentation framing and section ordering/labeling in the layout component, not from different data structures.

**Primary recommendation:** Both layouts render the same section types using the same existing template logic (lift directly from ExhibitDetailPage.vue). The EngineeringBriefLayout differs from InvestigationReportLayout primarily in its contextual framing: the header area and any introductory context should emphasize "constraints navigated, approach taken, and lasting results" rather than forensic diagnosis language. The section rendering engine itself is identical.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** ExhibitDetailPage.vue uses explicit `v-if`/`v-else` branching to delegate to layout components -- no dynamic `:is` lookup. Matches the codebase's existing conditional rendering patterns and is clearer for a closed two-value union.
- **D-02:** Dispatcher stays thin (~30 lines): route slug lookup, SEO head tag, 404 redirect, and the v-if/v-else layout delegation. Nothing else.
- **D-03:** Each layout component is fully self-contained -- renders header, badges, back-nav, quotes, sections, resolution table, and impact tags. No shared rendering in the dispatcher.
- **D-04:** Shared sections (quotes, impactTags, resolutionTable) are duplicated across both layouts rather than extracted into the dispatcher. Keeps each layout independent and the dispatcher minimal.
- **D-05:** Header structure (back-nav, exhibit meta, title, type badge) lives inside each layout component, not the dispatcher. Badge text and color already implemented in Phase 9 (badge-aware for IR, badge-deep for EB).

### Claude's Discretion
- **D-06 (EB Layout):** Claude audits the actual data patterns of all 10 engineering brief exhibits to determine how the EngineeringBriefLayout should differ from InvestigationReportLayout. DTPL-03 says emphasize "constraints navigated, approach taken, and lasting results" rather than forensic diagnosis framing -- Claude decides the concrete layout based on what the data contains.
- **D-07 (Header Differences):** Claude determines whether the two layout headers should differ or remain identical (beyond the badge text/color that already differs).

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DTPL-01 | ExhibitDetailPage dispatches to InvestigationReportLayout or EngineeringBriefLayout based on `exhibitType` | Dispatcher pattern fully defined by D-01/D-02. Use `v-if`/`v-else` on `exhibit.exhibitType`. Exhibit interface already has the discriminant field. |
| DTPL-02 | Investigation Report layout preserves existing NTSB-style presentation (timeline, probable cause, contributing factors, personnel tables) | Data audit confirms all 5 IRs use timeline sections, "Probable Cause" headings, findings tables, and personnel tables. Current rendering logic handles all these section types correctly -- lift directly. |
| DTPL-03 | Engineering Brief layout emphasizes constraints navigated, approach taken, and lasting results rather than forensic diagnosis framing | Data audit shows EB section headings naturally use non-forensic language ("Background," "The Problem," "The Solution," "Technical Contributions," "Outcome"). No data transformation needed -- the data itself already frames correctly. Layout wrapper can reinforce this with a contextual subtitle or framing element. |
| DTPL-04 | Both layout types display appropriate type label in detail page header | Badge rendering already exists in current ExhibitDetailPage.vue (lines 51-52). Each layout duplicates this per D-05. |
</phase_requirements>

## Data Audit: Exhibit Type Patterns

### Investigation Reports (5 exhibits)

| Exhibit | Section Types | Key Headings | Has Timeline | Has Findings Table | Has "Probable Cause" |
|---------|--------------|--------------|--------------|-------------------|---------------------|
| J (GM) | text, table, timeline, table, text, text, table, metadata | Investigation Methodology, Personnel, Sequence of Events, Findings (Swiss Cheese), Probable Cause, Outcome & Validation, Technologies | Yes | Yes | Yes |
| K (Microsoft) | text, table, text, table, text, text, text, table, metadata | Background, Personnel, The Prompt Engineering Ceiling, Hybrid Architecture, Key Insight, Architectural Pattern, Outcome, Technologies | No | No (has architecture table) | No (uses "Key Insight") |
| L (Power Platform) | text, text, table, flow, text, table, text, text, table, metadata | Background, The Learning Curve, Personnel, Requirements Degradation Chain, Forensic Methodology, Findings (5 Gaps), Probable Cause, Outcome, Technologies | No (has flow) | Yes | Yes |
| M (SCORM Debugger) | text, table, table, text, text, metadata | Background, Personnel, Findings, Probable Cause, Outcome | No | Yes | Yes |
| N (BP) | text, table, table, text, text, text, table, metadata | Background, Personnel, Findings, Pattern Recognition, Scope Challenge, Outcome, Technologies | No | Yes | No (uses "Pattern Recognition") |

**IR Pattern Summary:** 4 of 5 have a "Findings" table. 3 of 5 have "Probable Cause." Only 1 has a timeline section. All have Personnel tables. All have Engagement Metadata. The "NTSB-style" framing is primarily in the contextHeading ("Investigation Summary") and section heading language, not in unique section types.

### Engineering Briefs (10 exhibits)

| Exhibit | Section Types | Key Headings | contextHeading |
|---------|--------------|--------------|----------------|
| A (Electric Boat) | text, text, table, timeline(8), text, text, text, text, text, table, metadata | Background, Personnel, Sequence of Events, Findings, Probable Cause, Recommendations, Outcome, Technologies | "Context" |
| B (Recognition) | text, table, text, text, text, text, metadata | Background, Personnel, First/Second Recognition Cascade, Pattern Analysis, Significance | "Context" |
| C (1216 Lessons) | text, text, text, table, table, text, table, metadata | Background, The Problem, The Solution, Personnel, Impact Metrics, Outcome, Technologies | "Context" |
| D (Wells Fargo) | text, table, text, text, text, text, text, text, table, metadata | Background, Personnel, Technical Contributions, Findings, Probable Cause, Context, Significance, Outcome, Technologies | "Context" |
| E (CSBB Dispatch) | text, table, timeline(8), table, text, text, text, table, metadata | Background, Personnel, Sequence of Events, Findings, Probable Cause, Naming, Outcome, Technologies | "Context" |
| F (HSBC) | text, table, text, text, text, text, text, text, table, metadata | Background, Personnel, SCORM API Wrapper Bug, Flash Recovery, Global Localization, Findings, Probable Cause, Outcome, Technologies | "Context" |
| G (SunTrust) | text, table, text, text, text, text, text, table, metadata | Background, Personnel, Integration Challenge, Security and Trust, Technical Approach, Evidence Analysis, Significance, Technologies | "Context" |
| H (Metal Additive) | text, table, text, text, metadata | Background, Personnel, Root Cause Analysis, Outcome | "Context" |
| I (TD Bank) | text, table, text, text, text, text, table, text, text, table, metadata | Background, Personnel, Standards Gap, GP's Practice, What Dan Brought, Testing Protocol, Accessibility Scope, Significance, Outcome, Technologies | "Context" |
| O (ContentAIQ) | text, text, text, text, table, text, text, table, metadata | Background, BP Platform, AICPA Bridge, ContentAIQ, Findings, Probable Cause, Pattern Recognition, Technologies | "Context" |

**EB Pattern Summary:** All use contextHeading "Context" (vs IRs which use "Investigation Summary"). Many EBs also have "Probable Cause" and "Findings" headings (A, D, E, F, O) -- this is notable because it means the section heading text alone cannot distinguish types. The framing difference per DTPL-03 must come from the layout component's wrapper/chrome, not from filtering or transforming section data.

### Key Data Insight (D-06 Resolution)

Both exhibit types use the same section type union (`text | table | flow | timeline | metadata`) and the same rendering logic. The differentiation for DTPL-03 should be:

1. **contextHeading already differs**: IRs use "Investigation Summary," EBs use "Context" -- the data naturally frames itself differently.
2. **The layout wrapper should NOT rewrite or filter section headings** -- the data is already appropriate for each type.
3. **The EngineeringBriefLayout can add a subtle framing element** (e.g., a brief intro line or visual treatment) that signals "this is a technical brief about what was built and why" vs the IR's "this is a forensic investigation." But the section content renders identically.
4. **Practical recommendation:** Both layouts share identical section rendering logic. The difference is in the header area and the contextual introduction above the sections. Headers already differ by badge. Adding a subtitle or descriptor line below the title (e.g., "Technical constraints, approach, and outcomes" for EB vs nothing extra for IR) would satisfy DTPL-03 with minimal code.

### D-07 Resolution: Header Differences

Headers should remain structurally identical between the two layouts, with only the existing badge differences (text and color class). Reasons:
- The exhibit meta (label, client, date) and title are the same data structure for both types
- The badge already communicates the type distinction clearly
- Adding structural differences to the header would be gratuitous differentiation

The contextHeading/contextText block (rendered below the header in the body area) already naturally frames differently because IRs have "Investigation Summary" as their contextHeading while EBs have "Context."

## Architecture Patterns

### Recommended Project Structure
```
src/
  pages/
    ExhibitDetailPage.vue          # Thin dispatcher (~30 lines)
  components/
    exhibit/
      InvestigationReportLayout.vue  # Full IR detail rendering
      EngineeringBriefLayout.vue     # Full EB detail rendering
```

**Rationale:** `src/components/exhibit/` groups the two layout components together since they are exhibit-specific components (not page-level routes). This follows the codebase pattern where `src/pages/` contains route-matched components and `src/components/` contains reusable/supporting components.

### Pattern 1: Thin Dispatcher
**What:** ExhibitDetailPage.vue handles only: route param lookup, SEO head, 404 redirect, and v-if/v-else delegation.
**Example:**
```typescript
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { exhibits } from '@/data/exhibits'
import InvestigationReportLayout from '@/components/exhibit/InvestigationReportLayout.vue'
import EngineeringBriefLayout from '@/components/exhibit/EngineeringBriefLayout.vue'

const route = useRoute()
const router = useRouter()

useBodyClass('page-exhibit-detail')

const exhibit = computed(() => {
  const slug = route.params.slug as string
  return exhibits.find(e => e.exhibitLink === `/exhibits/${slug}`) ?? null
})

if (!exhibit.value) {
  router.replace({ name: 'not-found' })
}

useHead(computed(() => ({
  title: exhibit.value
    ? `${exhibit.value.label}: ${exhibit.value.title} | Pattern 158`
    : 'Exhibit | Pattern 158',
  meta: [{ name: 'description', content: exhibit.value?.contextText ?? exhibit.value?.title ?? '' }],
})))
</script>

<template>
  <InvestigationReportLayout v-if="exhibit?.exhibitType === 'investigation-report'" :exhibit="exhibit" />
  <EngineeringBriefLayout v-else-if="exhibit" :exhibit="exhibit" />
</template>
```

This is ~30 lines of script + ~4 lines of template. The dispatcher owns SEO because `useHead` needs exhibit data before any layout renders.

### Pattern 2: Self-Contained Layout Component
**What:** Each layout receives the full Exhibit object as a prop and renders everything: header, body sections, quotes, resolution table, impact tags.
**Example props interface:**
```typescript
import type { Exhibit } from '@/data/exhibits'
defineProps<{ exhibit: Exhibit }>()
```

### Anti-Patterns to Avoid
- **Extracting shared section rendering into the dispatcher:** Violates D-03/D-04. Keep each layout independent even if it means duplicating the section v-for loop.
- **Using dynamic `:is` component:** Violates D-01. Use explicit v-if/v-else.
- **Creating a shared mixin or composable for section rendering:** The duplication across two files is trivial (~80 lines each). Extracting to a composable adds indirection for no maintenance benefit at this scale.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Section type rendering | Abstract section renderer component | Inline v-if chains per section type | Only 5 section types, already working. Abstraction would add complexity for 2 consumers. |
| Layout selection logic | Route-level layout system | Simple v-if/v-else in dispatcher | Only 2 types. Router-level layouts are overkill. |

## Common Pitfalls

### Pitfall 1: Breaking Existing CSS
**What goes wrong:** Moving template markup to new components breaks CSS selectors that depend on parent-child DOM hierarchy.
**Why it happens:** CSS classes like `.exhibit-detail-page .exhibit-detail-header` rely on nesting. If the layout component introduces a new wrapper div, selectors break.
**How to avoid:** Layout components should NOT add a wrapper div around their content. Use `<template>` fragments or ensure the outermost element uses the same class structure. The current page has `div.exhibit-detail-page > section.exhibit-detail-header + section.exhibit-detail-body`. Each layout should reproduce this exact DOM structure.
**Warning signs:** Visual regressions after refactoring -- header styling breaks, body padding changes.

### Pitfall 2: Forgetting contextText/contextHeading Fallback
**What goes wrong:** The current page has a `v-else-if="exhibit.contextText"` fallback when sections are empty (line 128-131). If layouts omit this, exhibits without sections would show blank bodies.
**How to avoid:** Both layouts must include the contextText fallback block. Audit which exhibits use it: most have sections arrays, but the fallback must be preserved.
**Warning signs:** An exhibit detail page that shows only header + impact tags with no body content.

### Pitfall 3: Test Coupling to Old Component
**What goes wrong:** Existing tests import ExhibitDetailPage directly and test rendering within it. After refactoring, the tests still pass (dispatcher delegates correctly) but don't test the layout components directly.
**How to avoid:** Tests should verify: (1) dispatcher delegates to correct layout based on exhibitType, (2) layout components render expected content when given an exhibit prop. The existing tests test through the dispatcher, which is fine for integration coverage. Add targeted layout component tests for DTPL-02/DTPL-03 specific behaviors.
**Warning signs:** Tests pass but new layout-specific rendering logic has no coverage.

### Pitfall 4: SEO Head Reactivity
**What goes wrong:** Moving useHead into layout components instead of the dispatcher. If the layout component unmounts/remounts during navigation, head tags flicker.
**How to avoid:** Per D-02, useHead stays in the dispatcher. The dispatcher has the exhibit data and the head should be set before any layout renders.

## Code Examples

### Current Section Rendering (lines 69-127 of ExhibitDetailPage.vue)
This entire block is lifted directly into both layout components. No modifications needed except wrapping in the layout's template structure.

### Layout Component Template Structure
```vue
<template>
  <div class="exhibit-detail-page">
    <section class="exhibit-detail-header">
      <div class="container">
        <nav class="exhibit-back-nav">
          <router-link to="/portfolio">&larr; Back to Portfolio</router-link>
        </nav>
        <div class="exhibit-meta-header">
          <span class="exhibit-label">{{ exhibit.label }}</span>
          <span class="exhibit-client">{{ exhibit.client }}</span>
          <span class="exhibit-date">{{ exhibit.date }}</span>
        </div>
        <h1 class="exhibit-detail-title">{{ exhibit.title }}</h1>
        <!-- Badge: IR uses badge-aware, EB uses badge-deep -->
        <span class="expertise-badge badge-aware exhibit-type-badge">Investigation Report</span>
      </div>
    </section>

    <section class="exhibit-detail-body">
      <div class="container">
        <!-- quotes, sections, resolutionTable, impactTags -->
        <!-- (identical rendering logic from current page) -->
      </div>
    </section>
  </div>
</template>
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vite.config.ts` (test.projects configuration) |
| Quick run command | `npx vitest run --project unit src/pages/ExhibitDetailPage.test.ts` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DTPL-01 | Dispatcher routes to correct layout based on exhibitType | unit | `npx vitest run --project unit src/pages/ExhibitDetailPage.test.ts -t "dispatches"` | Existing file needs update |
| DTPL-02 | IR layout renders timeline, probable cause, findings, personnel | unit | `npx vitest run --project unit src/components/exhibit/InvestigationReportLayout.test.ts` | Wave 0 |
| DTPL-03 | EB layout renders with non-forensic framing | unit | `npx vitest run --project unit src/components/exhibit/EngineeringBriefLayout.test.ts` | Wave 0 |
| DTPL-04 | Both layouts display type label badge | unit | `npx vitest run --project unit src/components/exhibit/*.test.ts -t "badge"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit src/pages/ExhibitDetailPage.test.ts src/components/exhibit/`
- **Per wave merge:** `npx vitest run --project unit`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/exhibit/InvestigationReportLayout.test.ts` -- covers DTPL-02, DTPL-04
- [ ] `src/components/exhibit/EngineeringBriefLayout.test.ts` -- covers DTPL-03, DTPL-04
- [ ] Update `src/pages/ExhibitDetailPage.test.ts` -- covers DTPL-01 (dispatcher delegation verification)

## Sources

### Primary (HIGH confidence)
- `src/pages/ExhibitDetailPage.vue` -- current implementation (157 lines), all rendering patterns audited
- `src/data/exhibits.ts` -- all 15 exhibit records audited for section types, headings, and contextHeading values
- `src/pages/ExhibitDetailPage.test.ts` -- existing test coverage (6 tests)
- `.planning/phases/10-detail-template-extraction/10-CONTEXT.md` -- locked decisions D-01 through D-07

### Secondary (MEDIUM confidence)
- `vite.config.ts` -- Vitest configuration verified (unit project with happy-dom)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, pure refactoring of existing code
- Architecture: HIGH -- dispatcher pattern fully specified by user decisions, data audit resolves D-06/D-07
- Pitfalls: HIGH -- identified from direct code analysis of current implementation

**Research date:** 2026-03-31
**Valid until:** No expiry -- this is project-specific structural refactoring with no external dependency risk
