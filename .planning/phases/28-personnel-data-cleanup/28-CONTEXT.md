# Phase 28: Personnel Data Cleanup - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning
**Mode:** Infrastructure phase — discuss skipped (data migration/normalization)

<domain>
## Phase Boundary

Correct misplaced fields in personnel data across 14 exhibits, normalize Exhibit L from role/involvement to standard name/title/organization schema, and add entryType markers ('individual' | 'group' | 'anonymized') to all personnel entries. Pure data and type changes — no rendering changes in this phase.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key data issues documented in memory:
1. **Title-as-name** (~26 entries across 12 exhibits): name field contains roles like "Senior Vice President", "QA Lead"
2. **Group entries** (7 across 7 exhibits): "Multiple EB Personnel", "15+ Team Members", etc.
3. **Exhibit L different schema** (4 entries): Uses role/involvement instead of name/title/organization
4. **Exhibit A unnamed personnel** (5 entries): Missing name, have title+org — correctly anonymized
5. **Descriptive name** (1 entry): Colleague ("The Slacker") in Exhibit C

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PersonnelEntry` interface in `src/types/exhibit.ts` (lines 30-36) — all fields optional, needs `entryType` added
- `src/data/json/exhibits.json` — single JSON file with all 15 exhibits including personnel arrays

### Established Patterns
- v4.0 migration pattern: modify JSON data + update TypeScript types, verify via `npm run type-check` and `npm test`
- Field-presence variant detection in templates (v-if on optional fields) — existing pattern for card rendering
- All exhibit data in single `exhibits.json` file, loaded via thin TypeScript loader in `src/data/exhibits.ts`

### Integration Points
- `src/types/exhibit.ts` — PersonnelEntry interface (add entryType field)
- `src/data/json/exhibits.json` — all personnel data lives here
- Layout components consume personnel arrays — rendering changes deferred to Phase 29

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
