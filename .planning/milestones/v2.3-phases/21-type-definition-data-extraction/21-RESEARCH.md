# Phase 21: Type Definition & Data Extraction - Research

**Researched:** 2026-04-02
**Domain:** TypeScript interface design, data migration in static exhibit data
**Confidence:** HIGH

## Summary

Phase 21 is a pure data-layer phase: define an `ExhibitFindingEntry` interface, add `findings[]` and `findingsHeading` fields to the `Exhibit` interface, populate the arrays from existing table-section data, and remove the migrated table sections. The direct precedent is the v2.2 personnel promotion (Phase 17) which followed an identical pattern -- except that phase kept old table sections, whereas this phase removes them (DATA-06).

All changes are confined to a single file: `src/data/exhibits.ts`. The interface design follows the established `ExhibitPersonnelEntry` pattern (one required field, rest optional). The data migration is mechanical: convert `string[][]` rows from table-type findings sections into typed `ExhibitFindingEntry` objects, then delete those sections from `sections[]`.

**Primary recommendation:** Follow the ExhibitPersonnelEntry pattern exactly. Flag the Exhibit F/M discrepancy (see Open Questions) before implementation begins.

**CRITICAL DISCREPANCY FOUND:** The phase description and CONTEXT.md list "7 exhibits: A, E, F, J, L, N, O" but Exhibit F has **text-type** findings (not table). Exhibit M has **table-type** findings but is listed as out of scope. The correct set of 7 table-type exhibits is: **A, E, J, L, M, N, O**. See Open Questions for resolution recommendation.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None -- all implementation choices are at Claude's discretion per CONTEXT.md.

### Claude's Discretion
All implementation choices are at Claude's discretion -- pure infrastructure/data migration phase. Follow the v2.2 personnel promotion pattern (ExhibitPersonnelEntry) as direct reference. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | ExhibitFindingEntry interface with typed fields (finding required; description, background, resolution, severity all optional) | Interface pattern from ExhibitPersonnelEntry; field names map to existing column headers |
| DATA-02 | findings[] optional array added to Exhibit interface | Same pattern as `personnel?: ExhibitPersonnelEntry[]` on Exhibit interface |
| DATA-03 | findingsHeading optional string added to Exhibit interface (default: "Findings") | Parallels `contextHeading` pattern; only J and L have non-default headings |
| DATA-04 | 7 exhibits' table rows extracted to findings[] arrays | See column mapping table in Architecture Patterns; **verify correct 7 exhibits per Open Questions** |
| DATA-05 | Custom headings preserved for exhibits with non-default headings (J, L) | J: "Findings -- Five Concurrent Systemic Failures (Swiss Cheese Model)", L: "Findings -- Five Foundational Gaps" |
| DATA-06 | Old findings table sections removed from migrated exhibits' sections[] | Unlike v2.2 personnel (kept both), this phase removes old sections to avoid duplicate data |
</phase_requirements>

## Standard Stack

No new dependencies. All work is in existing TypeScript data file.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | (project version) | Interface definitions | Already in use |
| Vitest | (project version) | Test verification | Already configured with unit + browser projects |

## Architecture Patterns

### Target File
```
src/data/exhibits.ts   # ALL changes happen here (interface + data)
```

### Pattern: Interface with Required Primary + Optional Fields
**What:** One field is the primary identifier (required), all others are optional.
**Source:** Existing ExhibitPersonnelEntry in the same file.

```typescript
// Existing pattern to follow:
export interface ExhibitPersonnelEntry {
  name?: string      // optional (anonymous entries exist)
  title?: string
  organization?: string
  role?: string
  isSelf?: boolean
}

// New interface to create:
export interface ExhibitFindingEntry {
  finding: string        // REQUIRED - the finding name/title
  description?: string   // optional - detailed description
  background?: string    // optional - context/background (Exhibit A only)
  resolution?: string    // optional - how it was resolved (Exhibit A only)
  severity?: string      // optional - severity level (Exhibit L only)
}
```

### Column-to-Field Mapping (Verified from Source Data)

| Exhibit | Columns in Source | Field Mapping | Row Count |
|---------|-------------------|---------------|-----------|
| A | `[Finding, Background, Resolution]` | finding, background, resolution | 5 |
| E | `[Finding, Description]` | finding, description | 5 |
| J | `[Finding, Description]` | finding, description | 5 |
| L | `[Finding, Severity, Description]` | finding, severity, description | 5 |
| M* | `[Finding, Description]` | finding, description | 5 |
| N | `[Finding, Description]` | finding, description | 5 |
| O | `[Finding, Description]` | finding, description | 5 |

*See Open Questions -- M may replace F in the migration list.

**Total findings entries:** 35 (7 exhibits x 5 rows each)

### Pattern: Optional Heading with Implicit Default
**What:** `findingsHeading` only set on exhibits with non-default headings. Rendering layer uses "Findings" as default.
**Source:** Parallels how `contextHeading` works (only set when not the default).

Only two exhibits need explicit `findingsHeading`:
- **Exhibit J:** `"Findings \u2014 Five Concurrent Systemic Failures (Swiss Cheese Model)"`
- **Exhibit L:** `"Findings \u2014 Five Foundational Gaps"`

All other exhibits use the default "Findings" heading (no need to set `findingsHeading`).

### Pattern: Section Removal (NEW -- differs from v2.2)
**What:** After migrating findings data to `findings[]`, the corresponding table section is removed from `sections[]`.
**Key difference from v2.2:** Personnel migration (Phase 17) explicitly kept both representations (DATA-06 in v2.2 said "Old personnel table sections remain intact in sections[]"). This phase does the opposite -- removes old sections to avoid duplicate data.

**Identification criteria for sections to remove:**
- `type === 'table'`
- `heading` starts with `'Findings'`
- Has `columns` array with first element `'Finding'`

### Anti-Patterns to Avoid
- **Naming collision with Finding:** `src/data/findings.ts` has a `Finding` interface (homepage featured findings). The new interface MUST be named `ExhibitFindingEntry` to avoid collision -- consistent with `ExhibitPersonnelEntry` naming.
- **Setting findingsHeading on all exhibits:** Only set it on J and L. Let the rendering layer handle the default.
- **Partial migration:** All 7 exhibits must be migrated in the same change. A half-migrated state would break any rendering code that checks for `findings[]`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Data validation | Runtime schema validation | TypeScript compile-time types + Vitest assertions | Static data file -- compile-time is sufficient |
| Finding ID system | Auto-incrementing IDs | No IDs needed | Out of scope per REQUIREMENTS.md |

## Common Pitfalls

### Pitfall 1: Wrong Exhibit List (F vs M)
**What goes wrong:** Exhibit F is listed in CONTEXT.md as table-type but actually has text-type findings. Exhibit M has table-type findings but is listed as out of scope.
**Why it happens:** The CONTEXT.md was auto-generated and may have carried forward an error from roadmap discussion.
**How to avoid:** Verify each exhibit's findings section type before migration. Use the column mapping table in this research.
**Warning signs:** Attempting to access `rows` on Exhibit F's findings section will find nothing (it's a text body, not a table).

### Pitfall 2: Removing Wrong Table Sections
**What goes wrong:** Exhibits have multiple table sections (Personnel, Technologies, Expanded Scope, etc.). Removing the wrong one corrupts data.
**Why it happens:** Naive filter on `type === 'table'` without checking the heading.
**How to avoid:** Match on BOTH `type === 'table'` AND heading starting with `'Findings'`. The findings tables all have headings starting with "Findings".
**Warning signs:** Personnel tables or Technologies tables disappearing from rendered pages.

### Pitfall 3: Unicode Em-Dash in Headings
**What goes wrong:** Exhibit J and L headings use em-dashes (\u2014), not regular dashes.
**Why it happens:** Copy-paste from rendered text vs source code.
**How to avoid:** Copy `findingsHeading` values directly from the existing `heading` field in source data -- do not retype.
**Warning signs:** Heading comparison fails because `—` (em-dash) !== `-` (hyphen).

### Pitfall 4: Column Order Varies Between Exhibits
**What goes wrong:** Assuming all 3-column exhibits have the same column order.
**Why it happens:** Exhibit A is `[Finding, Background, Resolution]` but Exhibit L is `[Finding, Severity, Description]`.
**How to avoid:** Map columns by header name, not by position index. The column mapping table documents each exhibit's specific order.
**Warning signs:** `severity` field populated with description text, or `background` field populated with severity text.

## Code Examples

### Interface Definition (DATA-01)
```typescript
// Place after ExhibitPersonnelEntry, before ExhibitType
export interface ExhibitFindingEntry {
  finding: string
  description?: string
  background?: string
  resolution?: string
  severity?: string
}
```

### Exhibit Interface Extension (DATA-02, DATA-03)
```typescript
export interface Exhibit {
  // ... existing fields ...
  personnel?: ExhibitPersonnelEntry[]
  findings?: ExhibitFindingEntry[]       // NEW (DATA-02)
  findingsHeading?: string               // NEW (DATA-03)
  // ... remaining fields ...
}
```

### Data Migration Example -- 2-col exhibit (Exhibit E)
```typescript
// BEFORE (in sections[]):
{
  type: 'table',
  heading: 'Findings',
  columns: ['Finding', 'Description'],
  rows: [
    ['Cross-domain architecture', 'EasyXDM-based communication layer...'],
    // ...
  ],
}

// AFTER (top-level field, section REMOVED):
findings: [
  { finding: 'Cross-domain architecture', description: 'EasyXDM-based communication layer...' },
  // ...
],
// No findingsHeading needed (default "Findings" applies)
```

### Data Migration Example -- 3-col with severity (Exhibit L)
```typescript
// Column order: [Finding, Severity, Description]
findings: [
  { finding: 'No data model', severity: 'Critical', description: 'No fully defined data model existed...' },
  { finding: 'No version control', severity: 'Critical', description: 'No git, no source control of any kind...' },
  // ...
],
findingsHeading: 'Findings \u2014 Five Foundational Gaps',
```

### Data Migration Example -- 3-col with background/resolution (Exhibit A)
```typescript
// Column order: [Finding, Background, Resolution]
findings: [
  { finding: 'SCORM courses dependent on Cornerstone Network Player', background: 'SCORM requires a player...', resolution: 'Dan provided a cross-domain SCORM wrapper...' },
  // ...
],
// No findingsHeading needed (default "Findings" applies)
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (unit project, happy-dom environment) |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run --project unit src/data/exhibits.test.ts` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | ExhibitFindingEntry interface exists with correct fields | unit (type-check) | `npx vue-tsc --noEmit` | N/A (compile check) |
| DATA-02 | findings[] array on exhibits that have findings | unit | `npx vitest run --project unit src/data/exhibits.test.ts -t "findings arrays"` | Wave 0 |
| DATA-03 | findingsHeading on J and L only | unit | `npx vitest run --project unit src/data/exhibits.test.ts -t "findingsHeading"` | Wave 0 |
| DATA-04 | 7 exhibits have correct findings[] data | unit | `npx vitest run --project unit src/data/exhibits.test.ts -t "findings data"` | Wave 0 |
| DATA-05 | J and L have custom findingsHeading values | unit | `npx vitest run --project unit src/data/exhibits.test.ts -t "custom headings"` | Wave 0 |
| DATA-06 | No findings table sections remain in migrated exhibits | unit | `npx vitest run --project unit src/data/exhibits.test.ts -t "sections removed"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --project unit src/data/exhibits.test.ts`
- **Per wave merge:** `npx vitest run --project unit`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] New test block in `src/data/exhibits.test.ts` -- covers DATA-01 through DATA-06 for findings migration
- [ ] No new test files needed -- extends existing test file following Phase 17 pattern

## Open Questions

1. **Exhibit F vs Exhibit M -- Incorrect Exhibit List**
   - What we know: CONTEXT.md and phase success criteria list "A, E, F, J, L, N, O" as the 7 table-type exhibits. However, source code verification shows Exhibit F has **text-type** findings (line 805: `type: 'text'`, `heading: 'Findings'`). Meanwhile, Exhibit M has **table-type** findings (line 1481: `type: 'table'`, `columns: ['Finding', 'Description']`, 5 rows). REQUIREMENTS.md out-of-scope lists "Promoting text-type findings (Exhibits D, M)" but M actually has table findings.
   - What's unclear: Whether the intent was to include M (which has structured table data) or F (which would require a different extraction approach for prose text).
   - Recommendation: **Replace F with M in the migration list.** The phase goal is "extract table data to typed arrays" -- F has no table data to extract. M has the same 2-col table structure as E, J, N, O. If the user wants F's prose findings handled, that's a different kind of extraction (text parsing) that belongs in a separate scope. The planner should note this correction and proceed with A, E, J, L, M, N, O.

## Sources

### Primary (HIGH confidence)
- Direct source code inspection of `src/data/exhibits.ts` -- all 15 exhibits analyzed
- Direct source code inspection of `src/data/findings.ts` -- confirmed naming collision avoidance needed
- Direct source code inspection of `src/data/exhibits.test.ts` -- Phase 17 test patterns verified
- Direct source code inspection of `vitest.config.ts` -- test framework configuration confirmed

### Secondary (MEDIUM confidence)
- CONTEXT.md auto-generated decisions -- exhibit list may contain error (see Open Questions)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all existing tooling
- Architecture: HIGH - direct precedent in ExhibitPersonnelEntry pattern, all source data verified
- Pitfalls: HIGH - identified from direct code inspection, column mapping verified per-exhibit

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable -- static data file, no external dependencies)
