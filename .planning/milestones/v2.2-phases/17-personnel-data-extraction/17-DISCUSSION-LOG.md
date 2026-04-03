# Phase 17: Personnel Data Extraction - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 17-personnel-data-extraction
**Areas discussed:** Aggregate/placeholder rows, Exhibit L name parsing, Anonymized entries, Exhibit A existing data, Personnel text sections, Exhibit A 'new mode' section, Dan Novak name variations, Extraction ordering, Title field overloading, Parenthetical annotations, LLM extraction approach

---

## Aggregate/Placeholder Rows

| Option | Description | Selected |
|--------|-------------|----------|
| Skip them (Recommended) | Don't include aggregate rows in personnel[]. Summary data, not individuals. | |
| Include as entries | Add to personnel[] with text as-is. | |
| You decide | Claude's discretion per exhibit. | ✓ |

**User's choice:** You decide
**Notes:** Claude has discretion on whether to include or skip aggregate rows like "Multiple EB Personnel" per exhibit.

---

## Exhibit L Name Parsing

| Option | Description | Selected |
|--------|-------------|----------|
| Split on em-dash (Recommended) | Where 'Name — Title' pattern exists, split into name + title. | |
| Entire Role column as title | Don't parse names out. Whole string becomes title. | |
| You decide | Claude's discretion per entry. | ✓ |

**User's choice:** You decide
**Notes:** Claude has discretion on how to parse Exhibit L's Role/Involvement columns.

---

## Anonymized Entries

| Option | Description | Selected |
|--------|-------------|----------|
| No name, role as title (Recommended) | Leave name undefined, put descriptive text as title. | |
| Descriptive text as name | Put role descriptions in name field. | |
| You decide | Claude's discretion for downstream rendering. | ✓ |

**User's choice:** You decide
**Notes:** Claude decides what best serves RNDR-02 (anonymous renders as "Title, Organization").

---

## Exhibit A Existing Data

| Option | Description | Selected |
|--------|-------------|----------|
| Replace with full extraction (Recommended) | Delete partial array, rebuild from table data (7 entries). | ✓ |
| Build on existing | Keep Dan Novak entry, fix TODO, add remaining 6. | |
| You decide | Claude's discretion on cleanest approach. | |

**User's choice:** Replace with full extraction
**Notes:** All exhibits get the same treatment — full extraction from source data.

---

## Personnel Text Sections

| Option | Description | Selected |
|--------|-------------|----------|
| Tables only (Recommended) | Extract from table rows only. Prose is narrative context. | |
| Tables + prose parsing | Also extract from prose sections. More complete. | ✓ |
| You decide | Claude's discretion on reliable data. | |

**User's choice:** Tables + prose parsing
**Notes:** Extract personnel from both tables AND prose text sections for completeness.

---

## Prose Extraction Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Best effort from context | Extract what prose clearly states. Leave fields empty when not explicit. | |
| Fill all fields manually | Read each prose section and populate all available fields. | |
| You decide | Claude's discretion based on text clarity. | |

**User's choice:** Other — "Use LLM to extract from prose, not regex or parsing as it could be varying formats."
**Notes:** Critical decision: use LLM intelligence for prose extraction, not mechanical parsing. Formats vary across exhibits.

---

## Exhibit A 'New Mode' Section

| Option | Description | Selected |
|--------|-------------|----------|
| Remove it (Recommended) | Experimental artifact misusing timeline type. Clean it out. | ✓ |
| Keep it | Leave as-is per DATA-06. | |
| You decide | Claude's discretion on DATA-06 applicability. | |

**User's choice:** Remove it
**Notes:** Explicit approval to remove the "Personnel (new mode)" timeline section. Exception to DATA-06.

---

## Dan Novak Name Variations

| Option | Description | Selected |
|--------|-------------|----------|
| Exact match sufficient (Recommended) | All exhibits use 'Dan Novak' consistently. | |
| Case-insensitive partial match | More defensive but unnecessary. | |
| You decide | Claude's discretion on detection approach. | ✓ |

**User's choice:** You decide
**Notes:** Claude decides the matching approach based on actual data patterns.

---

## Extraction Ordering

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve table order (Recommended) | Keep entries in same order as table rows. | |
| isSelf first | Put Dan Novak first in every array. | |
| You decide | Claude's discretion on ordering. | ✓ |

**User's choice:** You decide
**Notes:** Claude decides ordering strategy.

---

## Title Field Overloading

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve verbatim (Recommended) | Map column value directly to title field. | |
| Split title vs role | Separate job titles from role descriptions. | |
| You decide | Claude's discretion per entry. | ✓ |

**User's choice:** You decide
**Notes:** Claude decides per entry what produces the most useful data.

---

## Parenthetical Annotations

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve as-is (Recommended) | Keep parentheticals — they provide context. | |
| Strip parentheticals | Remove annotations for cleaner data. | |
| You decide | Claude's discretion per entry. | ✓ |

**User's choice:** You decide
**Notes:** Claude decides per entry whether to preserve or strip.

---

## LLM Extraction Approach

| Option | Description | Selected |
|--------|-------------|----------|
| One-time during execution (Recommended) | Claude reads prose, extracts personnel, writes into exhibits.ts. Static data. | ✓ |
| Build-time script | Script calling LLM API. Adds dependency. | |
| You decide | Claude's discretion. | |

**User's choice:** One-time during execution
**Notes:** Results baked directly into exhibits.ts. No runtime LLM dependency.

---

## Claude's Discretion

Aggregate rows, Exhibit L parsing, anonymized entries, name detection, ordering, title overloading, parenthetical annotations — all left to Claude's judgment during execution.

## Deferred Ideas

None — discussion stayed within phase scope.
