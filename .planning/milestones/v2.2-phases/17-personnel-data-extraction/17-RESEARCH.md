# Phase 17: Personnel Data Extraction - Research

**Researched:** 2026-04-02
**Domain:** Static TypeScript data extraction and structuring
**Confidence:** HIGH

## Summary

This phase is a pure data-entry task in a single file (`src/data/exhibits.ts`). The `ExhibitPersonnelEntry` interface and `Exhibit.personnel` field already exist and are well-defined. The work consists of: (1) reading each exhibit's existing personnel table section, (2) mapping table rows to `ExhibitPersonnelEntry` objects based on column structure, (3) adding the `personnel[]` array to each of the 14 exhibits (A-N), and (4) using LLM intelligence at execution time to extract additional personnel from Exhibit A's prose text section.

There are no new libraries to install, no new components to build, and no architecture decisions to make. The interfaces are locked. The column structures are verified across all 14 exhibits. The only complexity is Exhibit A (which has a prose text section, a table section, an experimental "new mode" section to remove, and an existing partial `personnel[]` to replace) and Exhibit L (which has a unique Role/Involvement column structure requiring name parsing from embedded strings).

**Primary recommendation:** Execute as a straightforward data extraction task. Map table rows directly to `ExhibitPersonnelEntry` objects per column structure. Use batch processing by column type (10 Name/Title/Org exhibits, then 2 Name/Title/Role exhibits, then Exhibit L, then Exhibit A last as the most complex).

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Extract personnel from BOTH table rows AND prose text sections. Tables provide structured columnar data; prose sections may mention additional people not in the table.
- **D-02:** For prose extraction, use LLM (Claude) at execution time to read prose sections and extract personnel entries. This is a one-time extraction during phase execution -- results are baked directly into `exhibits.ts` as static data. No runtime LLM dependency.
- **D-03:** Replace the existing partial `personnel[]` array on Exhibit A (which has a single Dan Novak entry with `title: 'TODO'`) with a complete extraction from table data (7 entries) plus any prose-derived entries.
- **D-04:** Remove the experimental `type: 'timeline'` section with heading "Personnel (new mode)" from Exhibit A. This is an artifact that misuses the timeline type and serves no purpose with proper `personnel[]` arrays. (Exception to DATA-06's "don't touch sections" rule -- this section is an experiment, not real content.)

### Claude's Discretion
- **Aggregate/placeholder rows** (e.g., "Multiple EB Personnel, 49 contacts across departments" in Exhibit A) -- include or skip based on what makes sense per exhibit
- **Exhibit L name parsing** -- the Role/Involvement column structure has embedded names like "Dan Novak -- Development Lead". Claude decides how to split into name/title fields vs treating entire strings as titles
- **Anonymized entries** (e.g., "Investigation Lead" in Exhibit J, "(anonymized)" labels in Exhibit L) -- Claude decides whether descriptive text maps to name or title field, guided by what best serves downstream rendering (RNDR-02: anonymous displays as "Title, Organization")
- **Dan Novak isSelf detection** -- Claude decides the matching approach (exact string, case-insensitive, etc.) based on actual data patterns
- **Extraction ordering** -- Claude decides whether personnel[] entries preserve table row order or reorder (e.g., isSelf first)
- **Title field overloading** -- some "Title" columns contain role descriptions instead of job titles. Claude decides whether to preserve verbatim or split into title vs role fields per entry
- **Parenthetical annotations** -- entries like "(subject of both cascades)" and "(BP Account)". Claude decides per entry whether to preserve or strip

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | All 14 exhibits with personnel table sections have corresponding top-level `personnel[]` arrays | Verified: 14 exhibits (A-N) each have a `type: 'table'` section with heading 'Personnel'. Column structures confirmed at lines 136, 358, 446, 528, 618, 754, 846, 938, 993, 1097, 1221, 1314, 1407, 1470 |
| DATA-02 | Name/Title/Organization exhibits (B, C, D, F, G, H, I, K, M, N) map to `name`, `title`, `organization` | Verified: All 10 exhibits have `columns: ['Name', 'Title', 'Organization']` |
| DATA-03 | Name/Title/Role exhibits (E, J) map to `name`, `title`, `role` | Verified: Both have `columns: ['Name', 'Title', 'Role']` |
| DATA-04 | Role/Involvement exhibit (L) parses embedded names | Verified: Exhibit L has `columns: ['Role', 'Involvement']` with embedded names like "Dan Novak -- Development Lead" in the Role column |
| DATA-05 | Dan Novak entries have `isSelf: true` | Verified: Dan Novak appears by name in table rows across exhibits. String matching on "Dan Novak" in the Name column (or Role column for Exhibit L) is sufficient |
| DATA-06 | Old personnel table sections remain intact in `sections[]` | Implementation: Do not modify `sections[]` arrays except for D-04 (Exhibit A experimental section removal) |

</phase_requirements>

## Standard Stack

No new libraries. This phase modifies a single TypeScript data file.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ~5.7 | Type checking of `exhibits.ts` | Already in project |
| Vitest | ^4.1 | Test verification | Already in project |

### Installation
None required.

## Architecture Patterns

### Data Structure (Already Exists)

```typescript
// Source: src/data/exhibits.ts lines 26-32
export interface ExhibitPersonnelEntry {
  name?: string       // Person's name (omit for anonymous)
  title?: string      // Job title or role description
  organization?: string  // Company/organization
  role?: string       // Role in the engagement
  isSelf?: boolean    // true for Dan Novak entries
}
```

### Column-to-Field Mapping

**Pattern 1: Name/Title/Organization (10 exhibits: B, C, D, F, G, H, I, K, M, N)**
```typescript
// Table columns: ['Name', 'Title', 'Organization']
// Row: ['Dan Novak', 'Technical Consultant', 'GP Strategies']
// Maps to:
{ name: 'Dan Novak', title: 'Technical Consultant', organization: 'GP Strategies', isSelf: true }
```

**Pattern 2: Name/Title/Role (2 exhibits: E, J)**
```typescript
// Table columns: ['Name', 'Title', 'Role']
// Row: ['Dan Novak', 'Architect / Developer', 'System architecture, cross-domain...']
// Maps to:
{ name: 'Dan Novak', title: 'Architect / Developer', role: 'System architecture, cross-domain...', isSelf: true }
```

**Pattern 3: Role/Involvement (1 exhibit: L)**
```typescript
// Table columns: ['Role', 'Involvement']
// Row: ['Dan Novak — Development Lead', 'Brought in to build model-driven apps...']
// Requires parsing name from Role column string
// Maps to:
{ name: 'Dan Novak', title: 'Development Lead', role: 'Brought in to build model-driven apps...', isSelf: true }
```

### Exhibit A Special Handling
Exhibit A requires four changes:
1. **Replace** existing partial `personnel[]` (line 101-108, single entry with `title: 'TODO'`) with complete extraction
2. **Remove** the experimental `type: 'timeline'` section with heading "Personnel (new mode)" (lines 124-132)
3. **Extract** from table rows (lines 137-145, 7 rows including aggregate row)
4. **Extract** from prose text section (lines 119-121, mentions additional people by role)

### Anti-Patterns to Avoid
- **Modifying sections[]:** Do NOT touch `sections[]` arrays on any exhibit except the Exhibit A "Personnel (new mode)" removal (D-04)
- **Runtime LLM calls:** All extraction happens at execution time and is baked into static data. No runtime dependency on Claude or any LLM.
- **Over-parsing parentheticals:** Don't strip context that helps identify people (e.g., "(BP Account)" in Exhibit N's organization field is meaningful context for the portfolio)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Prose text extraction | Regex/NLP parsing | Claude's reading at execution time | Prose formats vary; LLM reads context better than regex |
| Type validation | Manual field checking | TypeScript compiler (`vue-tsc -b`) | Interface already defined; compiler catches missing/wrong fields |
| Test coverage | Manual spot-checks | Vitest assertions per exhibit | Existing test file at `src/data/exhibits.test.ts` already tests exhibit structure |

## Common Pitfalls

### Pitfall 1: Forgetting isSelf on Dan Novak Entries
**What goes wrong:** Dan Novak entries across exhibits don't get `isSelf: true`, breaking downstream rendering (RNDR-03)
**Why it happens:** Manual data entry across 14 exhibits, easy to miss one
**How to avoid:** Write a test that asserts every exhibit's personnel[] with a "Dan Novak" entry has `isSelf: true`
**Warning signs:** Test failure in verification

### Pitfall 2: Exhibit A Incomplete Replacement
**What goes wrong:** The existing partial `personnel[]` on Exhibit A is left in place or only partially replaced, resulting in duplicate or incomplete data
**Why it happens:** Exhibit A has the most complex handling: existing personnel array, prose section, table section, and experimental section
**How to avoid:** Handle Exhibit A last; verify the `personnel[]` replaces the entire existing array
**Warning signs:** Exhibit A has only 1 entry (the original TODO entry)

### Pitfall 3: Exhibit L Name Parsing Inconsistency
**What goes wrong:** The em-dash-separated "Dan Novak -- Development Lead" format in Exhibit L's Role column gets mapped inconsistently
**Why it happens:** Exhibit L is the only exhibit with this structure; easy to handle it the same as others
**How to avoid:** Treat Exhibit L as its own batch with explicit parsing logic
**Warning signs:** Exhibit L personnel entries have empty name fields or the full "Dan Novak -- Development Lead" string in a single field

### Pitfall 4: Accidentally Modifying Table Sections
**What goes wrong:** Changing the `sections[]` array during extraction breaks DATA-06
**Why it happens:** When reading table data, it's tempting to mark sections as "processed" or modify them
**How to avoid:** Read table data as reference only; add `personnel[]` as a sibling to `sections[]`, not inside it. Exception: removing Exhibit A experimental section per D-04
**Warning signs:** Git diff shows changes to `rows:` or `columns:` arrays in any section

### Pitfall 5: TypeScript Compilation Failure
**What goes wrong:** The `personnel[]` arrays fail type checking because of wrong field names or missing optional markers
**Why it happens:** Typing `organization` when the field should be `role` for Name/Title/Role exhibits
**How to avoid:** Run `vue-tsc -b` after each batch of exhibits to catch type errors early
**Warning signs:** Build errors referencing `ExhibitPersonnelEntry`

## Code Examples

### Adding personnel[] to a Name/Title/Organization exhibit

```typescript
// Source: Direct mapping from existing table data
// Exhibit B (src/data/exhibits.ts line 332)
{
  label: 'Exhibit B',
  // ... existing fields unchanged ...
  personnel: [
    { name: 'Dan Novak', title: 'Technical Consultant (subject of both cascades)', organization: 'GP Strategies', isSelf: true },
    { name: 'Chris Sproule', title: 'Director of Learning Technologies', organization: 'GP Strategies' },
    { name: 'Josh Stoudt', title: 'Sr. Director of Learning Solutions (15+ years GP leadership)', organization: 'GP Strategies' },
    { name: 'Senior Vice President', title: 'SVP of Learning Solutions (initiated EB engagement Sept 2017)', organization: 'GP Strategies' },
    { name: 'Tracey Nicholson', title: 'Chief of Learning Services, Metrics, Processes & Technology', organization: 'Electric Boat' },
    { name: 'Quinn Gladu', title: 'Chief of Learning Services', organization: 'Electric Boat' },
    { name: 'GP On-Site EB Team', title: '3 members who independently relayed feedback (April 2019)', organization: 'GP Strategies' },
  ],
  // ... rest of exhibit unchanged ...
}
```

### Adding personnel[] to a Name/Title/Role exhibit

```typescript
// Exhibit E (src/data/exhibits.ts line 596)
{
  label: 'Exhibit E',
  // ... existing fields unchanged ...
  personnel: [
    { name: 'Dan Novak', title: 'Architect / Developer', role: 'System architecture, cross-domain communication layer, SCORM API proxy, package generation tooling', isSelf: true },
    { name: 'Zach Taylor', title: 'Primary Development Collaborator', role: 'GPiLEARN platform engineering' },
    { name: 'Ron Cyran', title: 'Program Manager', role: 'GPiLEARN program management and client coordination' },
    { name: 'Tom Pizer', title: 'Director of Learning Technologies', role: 'Technical direction and hosting infrastructure' },
  ],
  // ... rest of exhibit unchanged ...
}
```

### Exhibit L: Role/Involvement parsing

```typescript
// Source: Exhibit L table (line 1314)
// columns: ['Role', 'Involvement']
// Row: ['Dan Novak — Development Lead', 'Brought in to build model-driven apps...']
//
// Parse: split Role on ' — ' to get name + title
// 'Involvement' maps to role field
{
  name: 'Dan Novak',
  title: 'Development Lead',
  role: 'Brought in to build model-driven apps on Power Platform...',
  isSelf: true,
}
```

## Detailed Exhibit Inventory

Every exhibit's personnel table data, verified from source:

| Exhibit | Line | Columns | Row Count | Has Dan Novak | Notes |
|---------|------|---------|-----------|---------------|-------|
| A | 136 | Name/Title/Org | 7 | Yes | Also has prose text section + experimental timeline to remove |
| B | 358 | Name/Title/Org | 7 | Yes | Includes aggregate "GP On-Site EB Team" row |
| C | 446 | Name/Title/Org | 5 | Yes | |
| D | 528 | Name/Title/Org | 6 | Yes | |
| E | 618 | Name/Title/Role | 4 | Yes | |
| F | 754 | Name/Title/Org | 6 | Yes | |
| G | 846 | Name/Title/Org | 5 | Yes | |
| H | 938 | Name/Title/Org | 4 | Yes | |
| I | 993 | Name/Title/Org | 5 | Yes | Title column has lengthy descriptions |
| J | 1097 | Name/Title/Role | 3 | Yes | "Investigation Lead" is anonymous (no real name) |
| K | 1221 | Name/Title/Org | 4 | Yes | |
| L | 1314 | Role/Involvement | 4 | Yes | Embedded names in Role column, "(anonymized)" entries |
| M | 1407 | Name/Title/Org | 2 | Yes | |
| N | 1470 | Name/Title/Org | 2 | Yes | "(BP Account)" in organization |
| O | -- | -- | -- | -- | **EXCLUDED** -- meta-exhibit, no personnel table |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --project unit` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | All 14 exhibits (A-N) have `personnel[]` arrays | unit | `npx vitest run --project unit src/data/exhibits.test.ts` | Needs new tests |
| DATA-02 | Name/Title/Org exhibits map correctly | unit | same | Needs new tests |
| DATA-03 | Name/Title/Role exhibits map correctly | unit | same | Needs new tests |
| DATA-04 | Exhibit L entries parsed correctly | unit | same | Needs new tests |
| DATA-05 | Dan Novak entries have `isSelf: true` | unit | same | Needs new tests |
| DATA-06 | Table sections remain intact | unit | same | Needs new tests |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit src/data/exhibits.test.ts`
- **Per wave merge:** `npx vitest run --project unit`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/data/exhibits.test.ts` -- needs new `describe` blocks for DATA-01 through DATA-06
- [ ] No new test files needed -- existing test file covers the data layer

## Sources

### Primary (HIGH confidence)
- `src/data/exhibits.ts` -- Direct source code inspection of all 15 exhibit objects, all interfaces, all table column structures
- `src/data/exhibits.test.ts` -- Existing test file structure and patterns
- `vitest.config.ts` -- Test framework configuration

### Secondary (MEDIUM confidence)
- `.planning/phases/17-personnel-data-extraction/17-CONTEXT.md` -- User decisions and discretion areas

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, single file modification
- Architecture: HIGH -- interfaces already exist, column structures verified in source
- Pitfalls: HIGH -- straightforward data mapping with well-defined edge cases

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- static data, no external dependencies)
