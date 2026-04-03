# Phase 22: FindingsTable Component - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the FindingsTable Vue 3 component with dual-mode responsive rendering: semantic HTML table on desktop, CSS grid cards (like PersonnelCard) on mobile at 768px breakpoint. Component handles column-adaptive rendering for 2-col and 3-col finding patterns automatically, plus severity badge visual treatment.

</domain>

<decisions>
## Implementation Decisions

### Component Structure & Naming
- Component name: `FindingsTable.vue` (distinct from existing homepage `FindingCard.vue`)
- CSS class prefix: `.findings-table-*` (distinct from existing `.finding-*` homepage classes)
- Props interface: `{ findings: ExhibitFindingEntry[], heading?: string }` — heading prop for custom section headings
- Column detection: auto-inspect first finding's populated fields to determine column set (no explicit column prop needed)

### Responsive Strategy
- Dual DOM approach: render both `<table>` and card grid in the template, use CSS media query to toggle visibility at 768px breakpoint
- Desktop: semantic `<table>` element with column headers
- Mobile: CSS grid cards similar to PersonnelCard component layout
- Breakpoint: 768px (matches directory-table precedent for text-heavy content)

### Severity Badge Design
- Severity badges rendered as inline colored pills using existing design tokens (`--color-danger` for Critical, `--color-accent` for High)
- Badge placement: inside the severity column cell (desktop table) and inside the card field (mobile grid)
- Only renders when severity field is populated (currently only Exhibit L)

### Claude's Discretion
- Exact CSS grid card layout details (gap, padding, field arrangement within card)
- Dark theme token mapping for severity badge colors
- Table column header text derivation from populated fields
- TDD test structure and assertion patterns

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PersonnelCard.vue` — direct reference for CSS grid card layout pattern on mobile
- `FindingCard.vue` + `FindingCard.stories.ts` — homepage component (different concept, but Storybook pattern reference)
- `ExhibitFindingEntry` interface in `src/data/exhibits.ts` — typed data consumed by this component
- Existing `.exhibit-table` CSS in `main.css` — responsive table pattern reference (lines ~4000-4358)
- Design tokens for colors: `--color-danger`, `--color-accent`, `--color-text-muted`, `--color-text-light`

### Established Patterns
- CSS design token system (~3500+ lines) with cascade layers — new component CSS must consume existing tokens
- Component extraction pattern: single-file Vue components with scoped styles
- TDD pattern from v2.2: write tests first, then implement component

### Integration Points
- Props: `findings: ExhibitFindingEntry[]` + `heading?: string`
- Will be consumed by InvestigationReportLayout and EngineeringBriefLayout (Phase 23)

</code_context>

<specifics>
## Specific Ideas

- Use PersonnelCard as visual reference for mobile card grid layout
- Auto-detect columns from data: if any finding has `background` → show Background/Resolution columns; if any has `severity` → show Severity column; otherwise 2-col Finding/Description
- Three column patterns to handle: 2-col (Finding/Description), 3-col (Finding/Background/Resolution), 3-col (Finding/Severity/Description)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
