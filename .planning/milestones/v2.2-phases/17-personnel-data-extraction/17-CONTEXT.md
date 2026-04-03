# Phase 17: Personnel Data Extraction - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract personnel table data from 14 exhibits (A through N, excluding O) into top-level `personnel[]` arrays in `exhibits.ts`. Each exhibit's existing table section data and prose text sections are mined for personnel entries. The `ExhibitPersonnelEntry` interface and `Exhibit.personnel` field already exist. Original table sections remain untouched per DATA-06.

</domain>

<decisions>
## Implementation Decisions

### Data Sources
- **D-01:** Extract personnel from BOTH table rows AND prose text sections. Tables provide structured columnar data; prose sections may mention additional people not in the table.
- **D-02:** For prose extraction, use LLM (Claude) at execution time to read prose sections and extract personnel entries. This is a one-time extraction during phase execution — results are baked directly into `exhibits.ts` as static data. No runtime LLM dependency.

### Exhibit A Special Handling
- **D-03:** Replace the existing partial `personnel[]` array on Exhibit A (which has a single Dan Novak entry with `title: 'TODO'`) with a complete extraction from table data (7 entries) plus any prose-derived entries.
- **D-04:** Remove the experimental `type: 'timeline'` section with heading "Personnel (new mode)" from Exhibit A. This is an artifact that misuses the timeline type and serves no purpose with proper `personnel[]` arrays. (Exception to DATA-06's "don't touch sections" rule — this section is an experiment, not real content.)

### Claude's Discretion
The following areas are left to Claude's judgment during execution:

- **Aggregate/placeholder rows** (e.g., "Multiple EB Personnel, 49 contacts across departments" in Exhibit A) — include or skip based on what makes sense per exhibit
- **Exhibit L name parsing** — the Role/Involvement column structure has embedded names like "Dan Novak — Development Lead". Claude decides how to split into name/title fields vs treating entire strings as titles
- **Anonymized entries** (e.g., "Investigation Lead" in Exhibit J, "(anonymized)" labels in Exhibit L) — Claude decides whether descriptive text maps to name or title field, guided by what best serves downstream rendering (RNDR-02: anonymous displays as "Title, Organization")
- **Dan Novak isSelf detection** — Claude decides the matching approach (exact string, case-insensitive, etc.) based on actual data patterns
- **Extraction ordering** — Claude decides whether personnel[] entries preserve table row order or reorder (e.g., isSelf first)
- **Title field overloading** — some "Title" columns contain role descriptions instead of job titles (e.g., Exhibit I's lengthy description). Claude decides whether to preserve verbatim or split into title vs role fields per entry
- **Parenthetical annotations** — entries like "(subject of both cascades)" and "(BP Account)". Claude decides per entry whether to preserve or strip

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Model
- `src/data/exhibits.ts` — Contains `ExhibitPersonnelEntry` interface (lines 26-32), `Exhibit` interface with `personnel?` field (line 59), and all 15 exhibit data objects with existing table sections

### Requirements
- `.planning/REQUIREMENTS.md` — DATA-01 through DATA-06 define field mapping requirements per exhibit column structure
- `.planning/ROADMAP.md` §Phase 17 — Success criteria specifying which exhibits have which column structures

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ExhibitPersonnelEntry` interface: already defined with `name?`, `title?`, `organization?`, `role?`, `isSelf?` — all optional fields
- `Exhibit.personnel?: ExhibitPersonnelEntry[]` — field already exists on the Exhibit interface
- `ExhibitSection.type` union: already includes `'personnel'` as a valid type

### Established Patterns
- Exhibit data is a single `exports const exhibits: Exhibit[]` array in `src/data/exhibits.ts` — all data is static TypeScript, no API calls
- Table sections use `columns: string[]` and `rows: string[][]` — clean columnar data for extraction

### Integration Points
- Three distinct column structures across exhibits:
  - **Name/Title/Organization** (10 exhibits: B, C, D, F, G, H, I, K, M, N)
  - **Name/Title/Role** (2 exhibits: E, J)
  - **Role/Involvement** (1 exhibit: L — unique structure with embedded names)
- Exhibit A has both a prose `type: 'text'` Personnel section and a table Personnel section
- Personnel metadata counts already exist in metadata sections (e.g., `{ label: 'Personnel Involved', value: '49 individuals' }`)

</code_context>

<specifics>
## Specific Ideas

- Use LLM intelligence (not regex/parsing) for prose extraction since formats vary across exhibits
- Exhibit A is the most complex: has prose section, table section, experimental "new mode" section, and existing partial personnel array — treat it as the reference case
- The "Personnel (new mode)" timeline section in Exhibit A is explicitly approved for removal

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 17-personnel-data-extraction*
*Context gathered: 2026-04-02*
