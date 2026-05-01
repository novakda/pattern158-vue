---
phase: 27-personnel-technologies-card-layout
verified: 2026-04-07T19:02:00Z
status: human_needed
score: 5/5
human_verification:
  - test: "Open an exhibit with personnel data (e.g., Exhibit B) at desktop width and verify the personnel section renders as a table with visible column headers"
    expected: "Table with Name, Title, and Organization/Role columns visible in a structured row layout"
    why_human: "Visual layout verification requires browser rendering at desktop viewport"
  - test: "Resize the same exhibit to 480px or narrower and verify personnel renders as stacked cards with person name styled as an h3-level heading"
    expected: "Each person appears as a card block, name is bold/large heading text, title/org are secondary text below"
    why_human: "Responsive layout and visual heading style require browser viewport testing"
  - test: "Open an exhibit with technologies data at desktop width and verify the technologies section renders as a table with Category and Technologies & Tools columns"
    expected: "Table with two visible column headers and structured rows"
    why_human: "Visual layout verification requires browser rendering"
  - test: "Resize the technologies exhibit to 480px or narrower and verify it renders as stacked cards with category as the card heading"
    expected: "Each technology row becomes a card, category is bold/large heading text, tools listed below"
    why_human: "Responsive card layout requires visual browser verification"
  - test: "Compare personnel and technologies card layouts between an Engineering Brief exhibit and an Investigation Report exhibit"
    expected: "Both layout types render identical personnel and technologies sections"
    why_human: "Cross-layout visual comparison requires side-by-side browser testing"
---

# Phase 27: Personnel & Technologies Card Layout Verification Report

**Phase Goal:** Personnel and technologies sections render as structured tables on desktop and readable cards on mobile, matching the findings layout pattern
**Verified:** 2026-04-07T19:02:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Personnel section on desktop displays with `.personnel-table` class and visible column headers for all field variants | VERIFIED | Both layouts use `class="exhibit-table personnel-table"` with `<thead>` containing Name/Title/Org or Role/Involvement headers (EngineeringBriefLayout.vue:51-63, InvestigationReportLayout.vue:51-63). Desktop CSS styles at main.css:2335+ and 2622+ provide table layout. |
| 2 | Personnel section at 480px or narrower renders as stacked cards with each person's name styled as an h3-level heading | VERIFIED | CSS at main.css:4486-4545 inside `@media (max-width: 480px)` transforms `.personnel-table` to block display, hides thead, styles `td[data-label="Name"]` with font-weight:700, font-size:var(--font-size-lg), font-family:var(--font-heading). Role variant also styled identically. |
| 3 | Technologies section on desktop displays with `.technologies-table` class and visible column headers | VERIFIED | Both layouts use `class="exhibit-table technologies-table"` with `<thead>` containing Category and Technologies & Tools headers (EngineeringBriefLayout.vue:83-89, InvestigationReportLayout.vue:83-89). |
| 4 | Technologies section at 480px or narrower renders as stacked cards with the technology category as the card heading | VERIFIED | CSS at main.css:4547-4594 inside `@media (max-width: 480px)` transforms `.technologies-table` to block display, hides thead, styles `td[data-label="Category"]` with font-weight:700, font-size:var(--font-size-lg), font-family:var(--font-heading). |
| 5 | Both card layouts appear identically in EngineeringBriefLayout and InvestigationReportLayout | VERIFIED | Diff of both files (normalizing only badge type text) produces zero differences. Templates are structurally identical. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/exhibit/EngineeringBriefLayout.vue` | Personnel and technologies tables with classes and headers | VERIFIED | Lines 49-97: both sections with correct classes, thead, data-label attributes |
| `src/components/exhibit/InvestigationReportLayout.vue` | Identical personnel and technologies tables | VERIFIED | Lines 49-97: identical to EngineeringBriefLayout |
| `src/assets/css/main.css` | Mobile card styles for personnel-table and technologies-table at 480px | VERIFIED | Lines 4486-4594: card layout within @media (max-width: 480px) block |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| EngineeringBriefLayout.vue | main.css | `class="personnel-table"` | WIRED | Class applied at line 51, CSS targets at lines 2335, 4487 |
| EngineeringBriefLayout.vue | main.css | `class="technologies-table"` | WIRED | Class applied at line 83, CSS targets at line 4548 |
| InvestigationReportLayout.vue | main.css | `class="personnel-table"` | WIRED | Class applied at line 51, CSS targets at lines 2622, 4487 |
| InvestigationReportLayout.vue | main.css | `class="technologies-table"` | WIRED | Class applied at line 83, CSS targets at line 4548 |
| Personnel td elements | CSS mobile cards | `data-label` attributes | WIRED | data-label="Name", "Title", "Organization", "Role", "Involvement" all have matching CSS selectors |
| Technologies td elements | CSS mobile cards | `data-label` attributes | WIRED | data-label="Category", "Technologies & Tools" both have matching CSS selectors |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| EngineeringBriefLayout.vue | `exhibit.personnel` | Props from parent (exhibit data) | Yes -- data comes from exhibits.json | FLOWING |
| EngineeringBriefLayout.vue | `exhibit.technologies` | Props from parent (exhibit data) | Yes -- data comes from exhibits.json | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Type check passes | `npx vue-tsc --noEmit` | Clean (no errors) | PASS |
| All tests pass | `npx vitest run` | 86/86 tests passing | PASS |
| Personnel tests exist | grep in test files | Tests verify personnel heading renders for exhibits with personnel data | PASS |
| Technologies tests exist | grep in test files | Tests verify technologies heading renders for exhibits with technologies data | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| PERS-04 | 27-01 | Personnel section uses `.personnel-table` class with desktop column headers | SATISFIED | Class on table element, thead with column headers for all variants |
| PERS-05 | 27-01 | Personnel section renders as card view on mobile with name as h3-style heading | SATISFIED | CSS card layout at 480px, Name/Role styled as heading |
| TECH-04 | 27-01 | Technologies section uses `.technologies-table` class with desktop column headers | SATISFIED | Class on table element, thead with Category and Technologies & Tools headers |
| TECH-05 | 27-01 | Technologies section renders as card view on mobile with category as heading | SATISFIED | CSS card layout at 480px, Category styled as heading |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| (none) | - | - | - | No anti-patterns found |

### Human Verification Required

### 1. Desktop Personnel Table Layout

**Test:** Open an exhibit with personnel data (e.g., Exhibit B) at desktop width and verify the personnel section renders as a structured table with visible column headers.
**Expected:** Table with Name, Title, and Organization/Role columns visible in a structured row layout.
**Why human:** Visual layout verification requires browser rendering at desktop viewport.

### 2. Mobile Personnel Card Layout

**Test:** Resize the same exhibit to 480px or narrower and verify personnel renders as stacked cards with person name styled as an h3-level heading.
**Expected:** Each person appears as a card block, name is bold/large heading text, title/org are secondary text below.
**Why human:** Responsive layout and visual heading style require browser viewport testing.

### 3. Desktop Technologies Table Layout

**Test:** Open an exhibit with technologies data at desktop width and verify the technologies section renders as a table with Category and Technologies & Tools columns.
**Expected:** Table with two visible column headers and structured rows.
**Why human:** Visual layout verification requires browser rendering.

### 4. Mobile Technologies Card Layout

**Test:** Resize the technologies exhibit to 480px or narrower and verify it renders as stacked cards with category as the card heading.
**Expected:** Each technology row becomes a card, category is bold/large heading text, tools listed below.
**Why human:** Responsive card layout requires visual browser verification.

### 5. Cross-Layout Consistency

**Test:** Compare personnel and technologies card layouts between an Engineering Brief exhibit and an Investigation Report exhibit.
**Expected:** Both layout types render identical personnel and technologies sections.
**Why human:** Cross-layout visual comparison requires side-by-side browser testing.

### Gaps Summary

No code-level gaps found. All artifacts exist, are substantive, and are properly wired. The `.personnel-table` and `.technologies-table` classes are applied in both layout components with correct desktop headers and mobile card CSS at the 480px breakpoint. Both layouts are structurally identical (zero diff). All 86 tests pass with clean type checking.

Visual verification is required to confirm the rendered appearance matches expectations, as CSS responsive behavior cannot be verified without a browser.

---

_Verified: 2026-04-07T19:02:00Z_
_Verifier: Claude (gsd-verifier)_
