# Feature Research

**Domain:** Exhibit findings data promotion and responsive rendering (v2.3 milestone)
**Researched:** 2026-04-02
**Confidence:** HIGH (existing codebase fully audited, column patterns enumerated, v2.2 personnel promotion pattern established as reference)

---

## Context Note

This is the **third data promotion milestone** in the Pattern 158 Vue portfolio, following the established pattern from v2.2 (personnel promotion). The v2.2 pattern: extract structured data from embedded table sections into typed top-level arrays, build a purpose-built rendering component, wire into both layouts with empty-state suppression.

Nine of 15 exhibits have findings sections. These come in two storage forms and four column patterns:

**Storage forms:**
- **Table sections** (7 exhibits): Structured rows with column headers -- directly promotable
- **Text sections** (2 exhibits: D, M): Paragraph prose with heading "Findings" -- not structured data, leave as-is in sections

**Table column patterns (the 7 promotable exhibits):**
- 2-col Finding/Description: Exhibits E, F, J, N, O (5 exhibits -- dominant pattern)
- 3-col Finding/Background/Resolution: Exhibit A (1 exhibit)
- 3-col Finding/Severity/Description: Exhibit L (1 exhibit)

**Special heading variant:** Exhibit J uses "Findings -- Five Concurrent Systemic Failures (Swiss Cheese Model)" -- the subtitle is exhibit-specific context, not a column.

The existing CSS already has a responsive table pattern (desktop table, mobile stacked cards via `data-label` pseudo-elements) used by `.exhibit-table` and `.resolution-table`. The PersonnelCard component from v2.2 uses a CSS grid card layout instead. The findings component needs to decide which responsive strategy fits its content.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that the v2.3 milestone must deliver. Missing these = the promotion is incomplete or regresses current rendering.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| ExhibitFindingEntry interface | Typed data model is the foundation of the promotion pattern. v2.2 established ExhibitPersonnelEntry as precedent. All-optional fields except finding title matches the column variance across exhibits | LOW | Fields: `finding` (required), `description?`, `background?`, `resolution?`, `severity?`. Union of all observed columns across 7 table-type exhibits |
| findings[] array on Exhibit interface | Top-level typed array replaces table section data for 7 exhibits. Same structural position as personnel[] from v2.2 | LOW | Optional array. 7 exhibits populated, 8 exhibits empty/absent. Text-type findings sections (D, M) remain as sections -- they are prose, not structured data |
| Data migration from 7 exhibits | Extract existing table rows into typed findings[] arrays. Mechanical transformation: columns map to interface fields | MEDIUM | 7 exhibits, varying row counts (3-5 rows each). Total ~28 finding entries. Column-to-field mapping: "Finding" -> finding, "Description" -> description, "Background" -> background, "Resolution" -> resolution, "Severity" -> severity |
| Dedicated FindingsTable component | Purpose-built component renders findings with column-aware layout. Following v2.2 precedent (PersonnelCard), this is a single component handling all field variations | MEDIUM | Must handle: 2-col (finding + description), 3-col with background/resolution, 3-col with severity. Component reads which fields are populated and renders accordingly |
| Desktop table rendering | Findings are tabular data. Desktop users expect a proper table with headers and aligned columns. The existing `.exhibit-table` CSS proves this pattern works | LOW | Semantic `<table>` element. Column headers derived from populated fields. Existing design tokens for table styling |
| Mobile responsive rendering | Current exhibit tables use `data-label` stacked card pattern at 480px. Findings component must not regress mobile experience | MEDIUM | Two viable approaches: (1) reuse existing `data-label` pattern from CSS, (2) card grid like PersonnelCard. Decision depends on content density -- findings have long text descriptions that suit stacked cards better than grid cards |
| Wired into both layouts | InvestigationReportLayout and EngineeringBriefLayout must both render findings when present. Empty-state suppression (no heading, no component when findings[] is empty/absent) | LOW | Identical pattern to personnel[] wiring in v2.2 Phase 19. `v-if="exhibit.findings?.length"` guard + heading + component |
| Findings section heading preserved | Current table sections have headings like "Findings" or "Findings -- Five Foundational Gaps". The promoted rendering must preserve exhibit-specific headings | LOW | Add optional `findingsHeading?` field on Exhibit interface, defaulting to "Findings" when absent. Exhibit J and L have custom headings |
| Old table sections coexist or are removed | After promotion, the original table sections with heading "Findings" should be removed from sections[] to avoid duplicate rendering. Text-type findings sections (D, M) stay | LOW-MEDIUM | Removal is the clean approach -- avoids rendering same data twice. But must be careful: only remove table-type sections with findings heading, not text-type |
| Storybook stories | v2.2 established PersonnelCard.stories.ts as precedent. FindingsTable needs stories covering: 2-col, 3-col with severity, 3-col with background/resolution, single finding, many findings | LOW | Standard Storybook pattern. Use actual exhibit data as story fixtures |

### Differentiators (Competitive Advantage)

Features that elevate findings beyond basic table rendering. These leverage the NTSB investigation framing that makes this portfolio distinctive.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Severity indicators with visual treatment | Exhibit L has severity levels (Critical, High, etc.). Visual badges/colors for severity make the investigation feel rigorous -- like a real engineering assessment, not a portfolio bullet list | LOW | Only Exhibit L currently uses severity. CSS badge similar to exhibit-type badges. Design tokens for severity colors (critical=red, high=amber). Small touch, high signal-to-noise ratio |
| Finding title as primary identifier | Each finding has a short title ("Memory cache vulnerability", "No data model") that works as a scannable label. Desktop: first column. Mobile: card heading. This scanability mirrors how NTSB reports present contributing factors | LOW | Already the data pattern. The component design should emphasize finding titles as the entry point, with description/details as supporting text |
| Column-adaptive rendering | Component intelligently renders only the columns present in each exhibit's findings. 2-col exhibits get a clean two-column table; 3-col exhibits get the additional column. No empty columns, no wasted space | MEDIUM | Props-driven: component inspects the first finding's populated fields to determine column set. Or: explicit prop for column pattern. Inspection is more elegant -- the data drives the rendering |
| Custom section headings | "Findings -- Five Concurrent Systemic Failures (Swiss Cheese Model)" is more evocative than generic "Findings." Preserving exhibit-specific headings maintains the narrative framing unique to each investigation | LOW | Already discussed in table stakes. The differentiator is the intentionality -- most portfolio templates would flatten to generic headings |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Expandable/collapsible finding details | "Click to expand" accordion for long descriptions | Findings have 1-3 sentences of description. Not enough content to justify expand/collapse interaction. Adds JavaScript complexity for no user benefit. The content IS the point -- hiding it behind a click defeats the purpose of an evidence-based portfolio | Render all content visible. Short descriptions don't need progressive disclosure |
| Severity filtering/sorting | "Sort findings by severity" | Only 1 of 7 exhibits has severity data. Building filter/sort for a single exhibit is overengineering. 3-5 findings per exhibit is far below where sorting adds value | Display severity as inline badge. No interaction needed at this scale |
| Finding numbering/IDs | "F-01, F-02" identifiers like NTSB reports | The existing Exhibit J text references "F-01" through "F-05" in prose sections but these are part of the narrative, not data model IDs. Adding systematic IDs to all exhibits imposes a formality that doesn't match Engineering Briefs | Let exhibit prose reference IDs naturally where the investigation framing warrants it. Don't force IDs into the data model |
| Cross-exhibit finding comparison | "Show related findings across exhibits" | 9 exhibits with 3-5 findings each = ~30 findings total. Cross-referencing adds significant complexity for minimal discovery value. The exhibits are independent investigations | Keep findings scoped to their exhibit. The exhibit is the unit of evidence |
| Separate mobile component | FindingsTableDesktop.vue + FindingsCardMobile.vue | Two components for the same data doubles maintenance. CSS media queries handle responsive layout in a single component -- this is exactly what the existing `.exhibit-table` pattern does | Single component with CSS-driven responsive behavior. Table on desktop, stacked cards on mobile, one template |
| Rich text in finding descriptions | Markdown/HTML in description fields | All current finding descriptions are plain text. Adding rich text parsing for 28 entries is complexity with no current need. If a future finding needs emphasis, the prose can be rewritten to be clear without formatting | Keep string fields. Plain text is sufficient and type-safe |
| Promoting text-type findings (D, M) to structured data | "All findings should use the same component" | Exhibits D and M have paragraph-prose findings that don't decompose into rows. Forcing prose into a structured format would lose narrative flow. These are text sections, not tabular data | Leave Exhibits D and M findings as text-type sections in sections[]. Only promote table-type findings |

---

## Feature Dependencies

```
[ExhibitFindingEntry interface]
    |
    +--enables--> [findings[] array on Exhibit]
    |                 |
    |                 +--enables--> [Data migration from 7 exhibits]
    |                 |
    |                 +--enables--> [Layout wiring (both layouts)]
    |
    +--enables--> [FindingsTable component]
                      |
                      +--requires--> [Desktop table rendering]
                      |
                      +--requires--> [Mobile responsive rendering]
                      |
                      +--requires--> [Column-adaptive rendering]

[findingsHeading on Exhibit] --independent, can be added with interface or later--

[Severity visual treatment] --enhances--> [FindingsTable component]

[Old table section removal] --requires--> [Data migration complete]
                            --requires--> [FindingsTable wired into layouts]

[Storybook stories] --requires--> [FindingsTable component complete]
```

### Dependency Notes

- **Interface first, then data, then component, then wiring.** Same phase order as v2.2 personnel promotion: types -> data -> render -> integrate -> document.
- **Old section removal depends on both migration AND wiring.** Cannot remove table sections until the replacement rendering is live. This is the final step, not an early one.
- **Severity treatment is additive.** Can be built into FindingsTable from the start (Exhibit L data drives it) or added as enhancement. Building it in from the start is cleaner -- one exhibit's data shouldn't require a second pass.
- **Text-type findings (D, M) have no dependencies here.** They stay in sections[], rendered by existing text section renderer. No work needed.
- **findingsHeading is a small interface addition** that can ride with the main interface work. Only 2-3 exhibits need non-default headings.

---

## MVP Definition

### Launch With (v2.3 -- Findings Promotion Complete)

Minimum viable promotion that moves findings from embedded tables to first-class data with purpose-built rendering.

- [ ] ExhibitFindingEntry interface with all-optional fields except finding title
- [ ] findings[] optional array on Exhibit interface
- [ ] findingsHeading optional string on Exhibit interface (default: "Findings")
- [ ] Data migration: 7 exhibits' table rows extracted to findings[] arrays
- [ ] FindingsTable component: table on desktop, stacked cards on mobile
- [ ] Column-adaptive rendering (2-col and 3-col patterns handled automatically)
- [ ] Severity badge rendering for Exhibit L findings
- [ ] Wired into InvestigationReportLayout and EngineeringBriefLayout
- [ ] Empty-state suppression (no heading/component when findings absent)
- [ ] Old findings table sections removed from migrated exhibits
- [ ] Storybook stories covering field variations

### Defer (Not v2.3)

- [ ] Promoting text-type findings from Exhibits D and M -- prose doesn't fit structured model
- [ ] Cross-exhibit finding relationships -- premature at 30 findings
- [ ] Finding numbering/ID system -- not all exhibits use investigation framing
- [ ] Expandable details -- content is too short to warrant progressive disclosure
- [ ] Rich text in descriptions -- no current need

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| ExhibitFindingEntry interface | HIGH | LOW | P1 |
| findings[] array on Exhibit | HIGH | LOW | P1 |
| Data migration (7 exhibits) | HIGH | MEDIUM | P1 |
| FindingsTable component | HIGH | MEDIUM | P1 |
| Desktop table rendering | HIGH | LOW | P1 |
| Mobile responsive rendering | HIGH | MEDIUM | P1 |
| Column-adaptive rendering | HIGH | MEDIUM | P1 |
| Layout wiring (both layouts) | HIGH | LOW | P1 |
| Empty-state suppression | MEDIUM | LOW | P1 |
| findingsHeading field | MEDIUM | LOW | P1 |
| Old table section removal | MEDIUM | LOW-MEDIUM | P1 |
| Severity visual badges | MEDIUM | LOW | P1 |
| Storybook stories | LOW | LOW | P1 |

**Priority key:**
- P1: All features are v2.3 scope. This is a focused promotion milestone with no P2/P3 items -- everything listed is either in scope or explicitly deferred.

---

## Existing Component Reference: v2.2 Personnel Pattern

The v2.2 personnel promotion is the direct precedent for v2.3 findings. Key patterns to replicate:

| Aspect | v2.2 Personnel | v2.3 Findings (Recommended) |
|--------|---------------|----------------------------|
| Interface | ExhibitPersonnelEntry (all optional except implied presence) | ExhibitFindingEntry (all optional except `finding` title) |
| Array field | `personnel?: ExhibitPersonnelEntry[]` | `findings?: ExhibitFindingEntry[]` |
| Component | PersonnelCard -- CSS grid of cards | FindingsTable -- `<table>` on desktop, stacked cards on mobile |
| Display modes | 3 modes: named/anonymous/self | Column-adaptive: 2-col, 3-col-severity, 3-col-background-resolution |
| Layout wiring | `v-if="exhibit.personnel?.length"` + heading + component | Same pattern with findings |
| Responsive | CSS grid cards at all sizes | Table -> stacked cards at 480px (matches existing `.exhibit-table` CSS pattern) |
| Stories | PersonnelCard.stories.ts with 3 variants | FindingsTable.stories.ts with column variants |

**Key difference:** PersonnelCard always renders as cards (personnel are entity-like). FindingsTable should render as a proper `<table>` on desktop because findings are genuinely tabular -- they have aligned columns where scanning across rows is valuable. The existing `.exhibit-table` CSS responsive pattern (table on desktop, `data-label` stacked cards on mobile) is the correct model, not PersonnelCard's grid.

---

## Sources

- Existing codebase analysis: `exhibits.ts` (7 table-type findings sections, 2 text-type), `InvestigationReportLayout.vue` (table rendering with `data-label`), `PersonnelCard.vue` (v2.2 promotion pattern) -- HIGH confidence, primary source
- Existing CSS: `main.css` lines 4000-4358 (`.exhibit-table` responsive pattern, `data-label` mobile cards, dark theme support) -- HIGH confidence, primary source
- PROJECT.md v2.3 milestone definition -- HIGH confidence, project specification

---

*Feature research for: Exhibit findings data promotion and responsive rendering*
*Researched: 2026-04-02*
