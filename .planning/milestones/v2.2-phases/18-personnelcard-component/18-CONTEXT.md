# Phase 18: PersonnelCard Component - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a PersonnelCard component that renders individual `ExhibitPersonnelEntry` objects with visual distinction between three display modes: named persons (full details), anonymous persons (title as name substitute), and self-entries (`isSelf: true` highlight). This phase covers the component only — layout integration (wiring into detail pages) is Phase 19.

</domain>

<decisions>
## Implementation Decisions

### Layout & Grid
- **D-01:** Mini card layout — each personnel entry gets its own small card block with stacked fields, not inline rows or chips.
- **D-02:** Responsive CSS grid arrangement — flows from 1 to 3 columns based on viewport width.

### Information Hierarchy
- **D-03:** Role field takes visual priority over title. Role is the more meaningful descriptor of someone's contribution to the project.
- **D-04:** Title serves as the name substitute for anonymous persons — it occupies the primary/name position on the card when `name` is absent.

### Styling
- **D-05:** Use existing CSS design system tokens (custom properties from main.css) for colors, spacing, typography. Component adds minimal scoped CSS for its own layout only.

### Anonymous Display
- **D-06:** Anonymous entries (no `name` field) show title in the name position with muted/italic styling to signal it's a role, not a person's name.
- **D-07:** Render whatever fields exist on an entry — no minimum field requirements. A card with just a title is fine.

### Claude's Discretion
The following areas are left to Claude's judgment during planning and execution:

- **Information order within cards** — Claude decides the stacking order of name, title, organization, role based on what reads best with actual exhibit data, respecting D-03 (role > title priority) and D-04 (title as name substitute for anonymous)
- **Card chrome** — Whether cards have borders, background tint, or are flat text blocks. Choose what fits the existing design system.
- **Section heading** — Whether the component includes a heading like "Project Team" or defers heading responsibility to the layout component (Phase 19). Base decision on how other sections handle headings in InvestigationReportLayout and EngineeringBriefLayout.
- **Large list handling** — For exhibits with many personnel (e.g., Exhibit A ~49 entries), Claude decides whether to show all at once or add a collapsible threshold based on visual impact.
- **Self-entry visual treatment** — How `isSelf: true` entries stand out (accent border, background tint, badge, or other). Pick what fits the design system.
- **Self-entry positioning** — Whether `isSelf` entries sort to the top of the grid or maintain original data order.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Model
- `src/data/exhibits.ts` — `ExhibitPersonnelEntry` interface (lines 42-47) with optional `name`, `title`, `organization`, `role`, `isSelf` fields. `Exhibit.personnel?: ExhibitPersonnelEntry[]` field (line 59).

### Requirements
- `.planning/REQUIREMENTS.md` — RNDR-01 (named display), RNDR-02 (anonymous display as "Title, Organization"), RNDR-03 (isSelf highlight)

### Existing Patterns
- `src/components/ExhibitCard.vue` — Reference for component structure, prop typing, CSS class patterns
- `src/assets/css/main.css` §PERSONNEL TABLE (lines 2291-2326, 2578-2620) — Existing personnel table CSS with `.person-name`, `.person-org` classes (for reference, not reuse)
- `src/components/exhibit/InvestigationReportLayout.vue` — Integration target (Phase 19), read for section heading patterns
- `src/components/exhibit/EngineeringBriefLayout.vue` — Integration target (Phase 19), read for section heading patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitPersonnelEntry` interface: already defined with all needed fields — no new types required
- CSS design tokens: custom properties for colors, spacing, typography available via main.css
- Component co-location pattern: `.vue`, `.stories.ts`, `.test.ts` files in same directory

### Established Patterns
- Components use `<script setup lang="ts">` with typed `defineProps`
- PascalCase component names with `.vue` extension
- `@/` path alias for all imports
- 2-space indentation, single quotes, semicolons

### Integration Points
- Component will be imported by InvestigationReportLayout and EngineeringBriefLayout in Phase 19
- Personnel data is a `ExhibitPersonnelEntry[]` array — component receives individual entries or the full array as a prop

</code_context>

<specifics>
## Specific Ideas

- Role is more important than title in the user's mental model — role describes what someone DID on the project, title is their HR designation
- Title serves double duty: it's a regular field for named persons, but becomes the primary identifier (name substitute) for anonymous persons
- The italic/muted treatment for anonymous title-as-name should be visually distinct enough to signal "this is a role description, not a person's name" without feeling like a warning or error state

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 18-personnelcard-component*
*Context gathered: 2026-04-02*
