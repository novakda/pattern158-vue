# Phase 26: Layout Rendering - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Update both layout components (InvestigationReportLayout, EngineeringBriefLayout) to render the new optional FindingEntry fields: severity badges, resolution/outcome text, and category tags. No regression for findings without optional fields.

</domain>

<decisions>
## Implementation Decisions

### Visual Treatment
- Severity: Inline colored pill/tag next to finding title. Critical=red-toned, High=amber-toned, using existing design tokens
- Resolution: Below finding description in distinct paragraph with subtle "Resolution:" label
- Outcome: Same treatment as resolution — below description with "Outcome:" label
- Category: Subtle muted pill/tag (similar to impactTags but smaller) below or beside finding title

### CSS Approach
- Styles in existing main.css using design tokens
- Keep existing table structure — add new elements within finding rows for enrichment fields
- No layout change (table stays as table)

### Claude's Discretion
- Exact CSS token choices for severity colors
- Responsive behavior of new elements
- Exact DOM structure for enrichment elements within table cells

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- main.css design token system (~3500+ lines)
- .impact-tag pill CSS (existing pill/tag pattern to reuse)
- Both layout components have identical findings rendering logic

### Established Patterns
- v-if guards for optional fields (field-presence detection)
- data-label attributes for responsive table behavior
- Design tokens: --color-*, --space-*, --font-size-*

### Integration Points
- src/components/exhibit/EngineeringBriefLayout.vue (findings table ~lines 97-135)
- src/components/exhibit/InvestigationReportLayout.vue (findings table ~lines 97-135)
- src/assets/main.css (design token system)

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the visual decisions above.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
