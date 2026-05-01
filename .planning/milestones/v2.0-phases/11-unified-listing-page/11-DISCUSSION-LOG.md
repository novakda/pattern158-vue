# Phase 11: Unified Listing Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 11-unified-listing-page
**Areas discussed:** Page layout & sections, Card type styling, Flagship treatment, TestimonialsMetrics, Section headings & copy, FlagshipCard disposition, Page component name, ExhibitCard modifications, Three Lenses removal

---

## Page Layout & Section Order

| Option | Description | Selected |
|--------|-------------|----------|
| Evidence first | Hero → Stats → IR group → EB group → Directory | ✓ |
| Directory first | Hero → Stats → Directory → IR → EB | |
| Mixed with context | Hero → Exec Summary → Stats → IR → EB → Directory | |

**User's choice:** Evidence first
**Notes:** Leads with strongest content; directory as supporting breadth signal at bottom

## Hero Framing

| Option | Description | Selected |
|--------|-------------|----------|
| Forensic tone | "Case Files" + "Documented evidence from 28+ years..." | ✓ |
| Professional neutral | "Case Files" + "Project case studies and engineering analyses" | |
| Quantitative lead | "Case Files" + "38 engagements. 15 deep-dive exhibits. 28 years of evidence." | |

**User's choice:** Forensic tone
**Notes:** Matches NTSB/investigation brand identity

## Stats Bar Content

| Option | Description | Selected |
|--------|-------------|----------|
| Portfolio stats | 38 Projects / 6,000+ Emails / 15+ Industries | |
| Merged set | Combined from both pages | |
| You decide | Claude picks best combination | ✓ |

**User's choice:** You decide

## Card Type Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Border accent | Left border color: gray for IR, teal for EB | ✓ |
| Badge on card | Small type badge in card header | |
| Background tint | Subtle background color per type | |
| You decide | Claude picks visual differentiation | |

**User's choice:** Border accent
**Notes:** Consistent with Phase 9 badge color system

## Flagship Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform ExhibitCard | All 15 use ExhibitCard, no FlagshipCard | ✓ |
| Featured row per section | Flagships get promoted card at top of each section | |
| You decide | Claude determines value of flagship treatment | |

**User's choice:** Uniform ExhibitCard
**Notes:** Type grouping and border accents are sufficient visual hierarchy

## TestimonialsMetrics

| Option | Description | Selected |
|--------|-------------|----------|
| Drop it | Redundant when all 15 exhibits visible | |
| Keep at bottom | After Project Directory as closing summary | |
| Relocate to homepage | Social proof section on homepage | |
| You decide | Claude evaluates during planning | ✓ |

**User's choice:** You decide

## Section Headings & Copy

| Option | Description | Selected |
|--------|-------------|----------|
| Type names | "Investigation Reports" / "Engineering Briefs" with subtitles | ✓ |
| Numbered format | Include count: "Investigation Reports (5)" | |
| You decide | Claude picks heading text | |

**User's choice:** Type names with subtitles

## FlagshipCard Disposition

| Option | Description | Selected |
|--------|-------------|----------|
| Leave for Phase 13 | Still imported by PortfolioPage | ✓ |
| Delete now | Accept PortfolioPage breakage | |

**User's choice:** Leave for Phase 13

## Page Component Name

| Option | Description | Selected |
|--------|-------------|----------|
| CaseFilesPage.vue | Matches page title and XxxPage.vue convention | ✓ |
| EvidencePage.vue | More generic | |
| You decide | Claude picks | |

**User's choice:** CaseFilesPage.vue

## ExhibitCard Modifications

| Option | Description | Selected |
|--------|-------------|----------|
| Keep full card | Full rendering: quotes, context, table, tags | ✓ |
| Slim summary card | Label, client, title, first quote, CTA only | |
| You decide | Claude evaluates density | |

**User's choice:** Keep full card

## Three Lenses / NarrativeCard Removal

| Option | Description | Selected |
|--------|-------------|----------|
| Delete NarrativeCard now | Delete .vue, .stories.ts, .test.ts in Phase 11 | ✓ |
| Leave for Phase 13 | Delete with PortfolioPage atomically | |
| You decide | Claude picks sequencing | |

**User's choice:** Delete NarrativeCard now
**Notes:** Satisfies CLN-02. PortfolioPage Three Lenses section breaks — expected, page dies in Phase 13.

---

## Claude's Discretion

- Stats bar content selection
- TestimonialsMetrics disposition
- Section subtitle wording
- CSS implementation strategy
- Body class naming
- Project Directory relocation details

## Deferred Ideas

- FlagshipCard deletion — Phase 13
- Route registration — Phase 12
- NavBar update — Phase 12
- Storybook stories — REF-01 (v2.x)
