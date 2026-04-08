# Phase 29: Personnel Card UX - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Mobile cards and desktop tables visually distinguish individual, group, and anonymized personnel with consistent heading logic. Uses entryType markers from Phase 28 to drive rendering decisions. Also removes dead Exhibit L involvement template branch (normalized in Phase 28).

</domain>

<decisions>
## Implementation Decisions

### Group Entry Card Treatment
- Muted opacity (0.7) + reduced padding on mobile cards for group entries
- Dashed left border instead of solid — visual distinction without removing structure
- Small uppercase "Group" label before the group name on mobile cards
- Desktop table: muted text color (--color-text-muted) + italic for group rows

### Anonymized Personnel Treatment
- Italic text + muted color on mobile cards for anonymized entries
- No explicit "anonymized" label — italic styling is sufficient
- Desktop table: italic text in name/title columns for anonymized rows

### Card Heading Logic
- Heading field priority: name → title → role (person identity first, falls back to role)
- First td in mobile card gets h3-style heading treatment (matches findings card pattern)
- Remove dead involvement template branch — Exhibit L normalized in Phase 28, code is now unreachable

### Claude's Discretion
- Specific CSS class naming conventions for entryType-based styling
- Whether to use computed properties or inline v-if for heading logic
- Test structure and assertion patterns

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Personnel table rendering in both `InvestigationReportLayout.vue` (lines 49-78) and `EngineeringBriefLayout.vue`
- Mobile card CSS at `main.css:3505+` — `.personnel-table tr` gets card treatment at ≤480px
- Desktop personnel table CSS at `main.css:2335+` and `main.css:2622+`
- Existing `data-label` attribute pattern for mobile card pseudo-element headings

### Established Patterns
- v5.0 findings: desktop table + mobile card view with severity badges and category tags
- v5.1: personnel/technologies card layout matching findings pattern
- Field-presence variant detection via `v-if` on optional fields (v4.0 decision)
- CSS custom properties for all colors, spacing, typography

### Integration Points
- `src/components/exhibit/InvestigationReportLayout.vue` �� personnel table template
- `src/components/exhibit/EngineeringBriefLayout.vue` — personnel table template
- `src/assets/css/main.css` — personnel-table desktop and mobile CSS
- `src/types/exhibit.ts` — PersonnelEntry with entryType field (added in Phase 28)

</code_context>

<specifics>
## Specific Ideas

- The first `<td>` in mobile view should render as the card heading (h3-style) using the best available field: name if present, then title, then role
- Group entries should feel visually subordinate — not hidden, just clearly different from individual personnel
- The involvement template branch (lines 54-57, 67-70 in InvestigationReportLayout.vue) is dead code after Phase 28 normalization

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
