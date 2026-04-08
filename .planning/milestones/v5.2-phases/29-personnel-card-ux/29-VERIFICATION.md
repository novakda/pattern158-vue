---
phase: 29-personnel-card-ux
verified: 2026-04-07T21:28:00Z
status: human_needed
score: 5/5 must-haves verified
human_verification:
  - test: "View a group personnel entry on mobile viewport (<=480px)"
    expected: "Card appears with 0.7 opacity, dashed left border, GROUP label above heading, reduced padding compared to individual cards"
    why_human: "CSS visual rendering (opacity, dashed border, pseudo-element label) cannot be verified programmatically"
  - test: "View an anonymized personnel entry on mobile viewport (<=480px)"
    expected: "Card text is italic, heading color is muted (gray) instead of dark heading color"
    why_human: "Italic styling and muted color distinction requires visual confirmation"
  - test: "View a personnel entry with no name field on mobile"
    expected: "Card heading shows title (or role if no title) instead of blank/missing text"
    why_human: "Heading fallback cascade rendering needs visual confirmation that the correct field displays as heading"
  - test: "View group and anonymized rows in desktop table view"
    expected: "Group rows have muted italic text across all columns; anonymized rows have italic text in name and title columns only"
    why_human: "Desktop table styling distinctions require visual confirmation"
---

# Phase 29: Personnel Card UX Verification Report

**Phase Goal:** Mobile cards and desktop tables visually distinguish individual, group, and anonymized personnel with consistent heading logic
**Verified:** 2026-04-07T21:28:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Group personnel entries render as compact/muted cards with dashed border and GROUP label on mobile | VERIFIED | CSS at main.css:4405-4423 has opacity 0.7, dashed border, GROUP pseudo-element; class binding on tr at InvestigationReportLayout.vue:60 and EngineeringBriefLayout.vue:60 |
| 2 | Anonymized personnel entries render with italic text and muted heading color on mobile | VERIFIED | CSS at main.css:4426-4432 has font-style italic and color muted on first-child; class binding wired in both templates |
| 3 | Card headings display name if present, falling back to title then role | VERIFIED | Both templates use `p.name \|\| p.title \|\| p.role` at line 61 with dynamic data-label matching source field |
| 4 | Desktop table rows show muted italic text for group entries and italic name/title for anonymized entries | VERIFIED | CSS at main.css:2738-2746 has group td muted+italic and anonymized first-child+nth-child(2) italic |
| 5 | Dead involvement template branch is removed from both layout components | VERIFIED | grep "involvement" returns 0 matches in both InvestigationReportLayout.vue and EngineeringBriefLayout.vue |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/exhibit/InvestigationReportLayout.vue` | entryType class bindings and heading logic | VERIFIED | Line 60: class binding for group/anonymized; Line 61: heading cascade with dynamic data-label |
| `src/components/exhibit/EngineeringBriefLayout.vue` | entryType class bindings and heading logic | VERIFIED | Identical changes as InvestigationReportLayout -- line 60 class binding, line 61 heading cascade |
| `src/assets/css/main.css` | Mobile card and desktop table styles for group/anonymized | VERIFIED | Desktop rules at 2737-2746; Mobile rules at 4402-4432; Heading selector at 4392-4400 |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| InvestigationReportLayout.vue | main.css | CSS class `personnel-entry-group` on tr | WIRED | Template binds class at line 60; CSS targets `.personnel-table tr.personnel-entry-group` at lines 2738 and 4405 |
| InvestigationReportLayout.vue | main.css | CSS class `personnel-entry-anonymized` on tr | WIRED | Template binds class at line 60; CSS targets `.personnel-table tr.personnel-entry-anonymized` at lines 2743 and 4426 |
| src/types/exhibit.ts | InvestigationReportLayout.vue | entryType field driving class binding | WIRED | Type defines `entryType?: 'individual' \| 'group' \| 'anonymized'` at exhibit.ts:36; template uses `p.entryType` at line 60 |
| EngineeringBriefLayout.vue | main.css | Same class bindings | WIRED | Identical template code at line 60; shares same CSS rules |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| InvestigationReportLayout.vue | exhibit.personnel[].entryType | src/data/json/exhibits.json | Yes -- 10 group entries, 33 anonymized entries across exhibits | FLOWING |
| InvestigationReportLayout.vue | p.name, p.title, p.role | src/data/json/exhibits.json | Yes -- static JSON with real personnel data | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compiles clean | `npx vue-tsc --noEmit` | No errors (exit 0) | PASS |
| All tests pass | `npx vitest run` | 95 passed, 0 failed | PASS |
| No involvement dead code | `grep -c involvement` in layouts | 0 matches in both files | PASS |
| entryType class in both layouts | `grep -c personnel-entry-group` | 1 match each in both layout files | PASS |
| Heading cascade in both layouts | `grep -c "p.name \|\| p.title \|\| p.role"` | 1 match each in both layout files | PASS |
| CSS rules present | grep counts in main.css | 7 personnel-entry-group refs, 4 personnel-entry-anonymized refs | PASS |
| GROUP pseudo-element | `grep 'content: "GROUP"'` | Found at main.css:4413 | PASS |
| Data has entryType values | grep in exhibits.json | group: 10, anonymized: 33 entries | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| CARD-01 | 29-01-PLAN | Group personnel entries render as compact/muted cards | SATISFIED | CSS group card rules (opacity 0.7, dashed border, GROUP label) at main.css:4405-4423; class binding in both templates |
| CARD-02 | 29-01-PLAN | Anonymized personnel entries render with visual distinction | SATISFIED | CSS anonymized card rules (italic, muted heading) at main.css:4426-4432; class binding in both templates |
| CARD-03 | 29-01-PLAN | Card heading logic uses best available field (name/title/role) | SATISFIED | `p.name \|\| p.title \|\| p.role` in both templates with dynamic data-label; heading CSS at main.css:4392-4400 |
| CARD-04 | 29-01-PLAN | Desktop table view handles entryType distinctions | SATISFIED | Desktop CSS at main.css:2738-2746: group rows muted+italic, anonymized rows italic on name/title |

No orphaned requirements found -- all 4 CARD requirements are mapped to Phase 29 in REQUIREMENTS.md traceability table and all are covered by plan 29-01.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | -- | -- | -- | No anti-patterns detected in any modified file |

### Human Verification Required

### 1. Group Card Mobile Rendering

**Test:** Open an exhibit with group personnel (e.g., one with "entryType": "group") on a mobile viewport (<=480px)
**Expected:** Group cards appear with reduced opacity (0.7), dashed left border, uppercase "GROUP" label above heading text, and compact padding
**Why human:** CSS visual rendering (opacity, dashed border, pseudo-element label positioning) cannot be verified programmatically

### 2. Anonymized Card Mobile Rendering

**Test:** Open an exhibit with anonymized personnel on a mobile viewport (<=480px)
**Expected:** Anonymized cards display all text in italic with muted (gray) heading color instead of standard dark heading color
**Why human:** Italic styling and color distinction require visual confirmation in browser

### 3. Heading Fallback Cascade

**Test:** View a personnel entry that has no name field (title-only or role-only) on mobile
**Expected:** Card heading shows title as the heading text (or role if no title), not blank space
**Why human:** The fallback cascade rendering needs visual confirmation that the correct field displays prominently as the card heading

### 4. Desktop Table entryType Distinctions

**Test:** View personnel table on desktop viewport (>480px) with mixed entry types
**Expected:** Group rows show muted gray italic text across all columns; anonymized rows show italic text only in name and title columns; individual rows unchanged
**Why human:** Desktop table styling distinctions require visual confirmation

### Gaps Summary

No gaps found. All five observable truths are verified through code inspection: entryType class bindings are present in both layout templates, CSS rules cover all three entry variants (individual/group/anonymized) for both mobile cards and desktop tables, the heading fallback cascade is implemented with dynamic data-label, and the dead involvement template branch has been removed. All 95 tests pass and TypeScript compiles clean. Four human verification items remain for visual confirmation of rendered CSS output.

---

_Verified: 2026-04-07T21:28:00Z_
_Verifier: Claude (gsd-verifier)_
