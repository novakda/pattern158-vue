# Phase 20: Storybook Documentation - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Document PersonnelCard in Storybook with interactive examples of every display variant: named person (all fields populated), anonymous person (no name), and self-highlighted entry (isSelf: true).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions. Follow existing Storybook story patterns established in the project.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PersonnelCard.vue` — component to document, accepts `personnel: ExhibitPersonnelEntry[]` prop
- Existing `.stories.ts` files in `src/components/` and `src/pages/` — established story patterns

### Established Patterns
- Storybook 10 already set up with stories for all components and pages
- Stories follow component-name.stories.ts naming convention

### Integration Points
- Storybook config already configured — just add new story file

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — discuss phase skipped.

</deferred>
