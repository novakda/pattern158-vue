# Pitfalls Research

**Domain:** Findings data promotion and responsive rendering -- exhibit table-to-typed-array migration (Vue 3 SPA)
**Researched:** 2026-04-02
**Confidence:** HIGH (based on direct codebase analysis of exhibits.ts, findings.ts, FindingCard.vue, PersonnelCard.vue, both layout components, main.css responsive patterns, and v2.2 milestone audit)

## Critical Pitfalls

### Pitfall 1: Naming Collision Between Homepage "Finding" and Exhibit "Finding"

**What goes wrong:**
The codebase already has a `Finding` interface in `src/data/findings.ts` with fields `number`, `title`, `meta`, `analysis`, `solution`, `outcome`, `link`, `tags`. This powers the homepage `FindingCard` component -- the hero case highlights section. Creating a new `Finding` or `ExhibitFinding` type for exhibit findings table data will cause import confusion, autocomplete collisions in IDEs, and potentially wrong-type imports that compile but render incorrectly (both have a `title`-like string field).

**Why it happens:**
The word "finding" is overloaded. The homepage concept is a "case highlight" displayed as investigation-style cards. The exhibit concept is a row from a findings table within an individual exhibit. Both are legitimate uses of the word "finding" but represent completely different data shapes with different rendering contexts.

**How to avoid:**
Name the new type `ExhibitFindingEntry` (paralleling the established `ExhibitPersonnelEntry` convention). Never name it `Finding`, `ExhibitFinding`, or `FindingEntry` -- all are too close to the homepage `Finding` type. The prefix `Exhibit` and suffix `Entry` together disambiguate completely. Place it in `src/data/exhibits.ts` alongside `ExhibitPersonnelEntry`, not in a new file that might be confused with `findings.ts`.

The component should follow the same pattern: `FindingsTable.vue` or `ExhibitFindings.vue` -- not `FindingCard.vue` (already taken).

**Warning signs:**
- Import autocomplete suggesting `Finding` from `@/data/findings` when you meant the exhibit type
- TypeScript accepting a prop because both types happen to share a field name
- A developer writing `import type { Finding }` and getting the wrong one
- Test files importing from the wrong `findings` module

**Phase to address:**
Phase 1 (interface definition). The naming decision must be locked before any code references the type. Document the naming convention in the phase plan.

---

### Pitfall 2: Column Variance Producing a Lowest-Common-Denominator Interface

**What goes wrong:**
The 9 exhibits with findings sections have three distinct column patterns:
- 5 exhibits: `['Finding', 'Description']` (2-column)
- 1 exhibit (A): `['Finding', 'Background', 'Resolution']` (3-column)
- 1 exhibit (J): `['Finding', 'Severity', 'Description']` (3-column)
- 2 exhibits (C, F): text-type findings (prose paragraphs, not table rows)

A naive interface that tries to normalize all patterns into identical fields either (a) loses data from 3-column exhibits by cramming extra columns into a generic field, or (b) makes every field optional, producing an interface so loose that the rendering component cannot make any assumptions about what data it will receive.

**Why it happens:**
The personnel promotion in v2.2 faced a similar issue (3 column patterns: NTO, NTR, Role/Involvement) but personnel had a natural mapping where different column names mapped to the same semantic concepts (name, title, role, organization). Findings columns are not semantically equivalent -- "Background" and "Severity" are genuinely different data.

**How to avoid:**
Design the `ExhibitFindingEntry` interface with a required `finding` field (the finding title/name -- present in every table pattern) and optional fields for each distinct column concept: `description`, `background`, `resolution`, `severity`. This maps to the actual data:
- 2-column exhibits: `{ finding, description }`
- Exhibit A: `{ finding, background, resolution }`
- Exhibit J: `{ finding, severity, description }`

The rendering component then uses `v-if` guards on each optional field, exactly as `PersonnelCard` does for `role` vs `organization`. The component adapts to the data shape rather than forcing the data into a single shape.

Do NOT attempt to promote the 2 text-type findings sections (Exhibits C and F). These are prose paragraphs, not structured data. They should remain as `type: 'text'` sections. Attempting to parse prose into structured entries will produce artificial, lossy data. The PROJECT.md scope says "9 exhibits' existing table data" -- interpret this as the 7 exhibits with actual table-type findings sections.

**Warning signs:**
- An interface where every field except one is optional (too loose)
- A `columns` or `columnPattern` discriminator on the interface (over-engineering; let the data speak)
- Prose findings being shoehorned into structured entries with a single giant `description` field
- Loss of the "Severity" column data from Exhibit J or "Background"/"Resolution" from Exhibit A

**Phase to address:**
Phase 1 (interface definition). The interface shape drives everything downstream. Get it wrong and the rendering component, tests, and data migration all cascade from a bad foundation.

---

### Pitfall 3: Responsive Table-to-Card Pattern Breaking on Variable Column Counts

**What goes wrong:**
The existing responsive CSS for `.exhibit-table` at 480px hides `<thead>` and uses `td::before { content: attr(data-label) }` to label each cell. This works because the current approach renders all table sections generically with whatever columns exist. A purpose-built findings component needs its own responsive behavior that handles both 2-column and 3-column findings gracefully. Using a single fixed card layout for all findings means either (a) 2-column findings have empty card slots, or (b) 3-column findings truncate/lose data.

**Why it happens:**
Developers build the responsive card layout using the most common pattern (2-column, 5 of 7 exhibits) and never test the 3-column variants. The 3-column exhibits (A and J) are edge cases that only surface during full integration testing.

**How to avoid:**
Build the card layout to render whatever fields are present, not a fixed grid of slots. The component template should be:
1. Always show the finding title prominently (card header)
2. Render each optional field (`description`, `background`, `resolution`, `severity`) as a labeled block only when present
3. Use CSS that flows naturally whether there are 1, 2, or 3 detail fields below the title

This is the same pattern as `PersonnelCard` -- it renders name, role, title, and organization only when present, with no fixed grid slots.

On desktop, a table layout with dynamic column headers works. The component should accept the column configuration and render appropriate `<th>` elements. On mobile, collapse to cards that show whatever fields exist.

**Warning signs:**
- Card layout hardcodes exactly 2 slots (e.g., "Finding" and "Description" columns only)
- Visual testing only uses 2-column exhibit data
- Storybook stories only show the common 2-column pattern
- Empty space or "undefined" appearing in cards for Exhibits A or J

**Phase to address:**
Phase 2 (component build). The component must be designed for field variance from the start. Storybook stories must cover 2-column and 3-column variants explicitly.

---

### Pitfall 4: Custom Heading Suffixes Lost During Promotion

**What goes wrong:**
Two exhibits have custom findings headings that carry semantic meaning:
- Exhibit I: `"Findings -- Five Concurrent Systemic Failures (Swiss Cheese Model)"`
- Exhibit J: `"Findings -- Five Foundational Gaps"`

If the rendering component hardcodes `<h2>Findings</h2>` (as the personnel section hardcodes `<h2>Project Team</h2>`), these descriptive suffixes are silently lost. The headings are not just labels -- they frame the findings in context. "Five Concurrent Systemic Failures" tells the reader what pattern to look for.

**Why it happens:**
Personnel sections had uniform headings across all exhibits, so hardcoding was correct. Findings sections vary. Developers follow the personnel pattern without noticing the heading variance.

**How to avoid:**
Add a `findingsHeading` field to the `Exhibit` interface (optional, defaults to "Findings" in the component). Populate it from the original section heading during data extraction. The component renders `exhibit.findingsHeading ?? 'Findings'` as the section heading. Alternatively, store it on each entry if the heading is considered part of the findings data, but a single exhibit-level field is cleaner since the heading applies to the group, not individual entries.

**Warning signs:**
- All exhibits render the same "Findings" heading
- The custom heading text exists only in the old `sections[]` table data (which is kept but not rendered by the new component)
- Exhibit I loses "Swiss Cheese Model" framing; Exhibit J loses "Five Foundational Gaps" framing

**Phase to address:**
Phase 1 (data extraction). Capture the heading during migration. If deferred to the rendering phase, the heading data is already lost from the typed array and must be re-extracted.

---

### Pitfall 5: Old Table Sections and New Findings Rendering Both Visible

**What goes wrong:**
The v2.2 personnel approach kept old table sections in `sections[]` and added `personnel[]` as a new top-level array. The layouts render `personnel[]` via PersonnelCard and still render all `sections[]` including the old personnel table -- both are visible on the page. This was intentional for personnel (coexistence during transition). For findings, the same approach means the exhibit detail page shows findings data twice: once from the new `findings[]` rendered by the purpose-built component, and once from the old table section still in `sections[]`.

**Why it happens:**
The layout templates iterate over all sections and render table-type sections generically. There is no mechanism to skip a section that has been "promoted" to a top-level array. The sections loop does not know which sections have dedicated renderers.

**How to avoid:**
Two options:
1. **Filter approach:** When rendering sections, skip sections whose heading starts with "Findings" if `exhibit.findings?.length` exists. This is the cleanest -- the layout template adds a filter condition to the sections loop.
2. **Remove approach:** Remove findings table sections from `sections[]` during data migration (breaking from the v2.2 coexistence pattern). This is cleaner long-term but a bigger change.

Option 1 is recommended because it follows the established coexistence pattern from v2.2 and is trivially reversible. The filter is a single additional condition in the `v-if` of the sections template loop. However, be aware this means the original table data remains in `sections[]` as a redundant copy -- document this explicitly as intentional for future cleanup.

**Warning signs:**
- Exhibit detail pages show findings content twice (table section + new component)
- Users see the same data in two different visual treatments on the same page
- Test for "findings section renders" passes but visual review shows duplication

**Phase to address:**
Phase 3 (layout integration). The decision on coexistence vs removal must be made before wiring the component into layouts. If using the filter approach, the filter must be added in the same phase as the component wiring -- never add the new rendering without addressing duplication.

---

### Pitfall 6: New CSS Classes Bypassing the Design Token System

**What goes wrong:**
The new findings rendering component introduces CSS that hardcodes colors, spacing, or typography values instead of consuming the existing design token custom properties. The component looks correct in light mode but breaks in dark mode, or looks correct at the developer's screen size but has spacing inconsistencies with adjacent sections.

**Why it happens:**
The codebase has ~3500+ lines of CSS in `main.css` with a comprehensive custom property system (`--color-*`, `--space-*`, `--font-size-*`). New developers (or new component phases) start with hardcoded values during rapid development and intend to "fix it later." The PersonnelCard component correctly uses the token system -- but only because it was explicitly specified in the phase plan.

**How to avoid:**
The phase plan for the component build phase must mandate: "All spacing uses `--space-*` tokens. All colors use `--color-*` tokens. All font sizes use `--font-size-*` tokens. No hardcoded `px`, `rem`, `#hex`, or `rgb()` values except for structural properties like `border-width: 1px`." Verify by grepping the new CSS for hardcoded values.

The existing responsive patterns in `main.css` for `.exhibit-table` provide the exact breakpoints and spacing values to mirror. The new component's mobile card pattern should use the same breakpoint (480px) and spacing tokens as the existing table-to-card pattern at lines 4289-4326 of main.css.

**Warning signs:**
- New CSS contains hardcoded color values (`#`, `rgb(`, `hsl(`)
- Component looks wrong in dark mode (colors not adapting)
- Spacing feels "off" compared to adjacent personnel or resolution sections
- No `[data-theme="dark"]` overrides for the new component (if needed)

**Phase to address:**
Phase 2 (component build). CSS review should be a checklist item in the phase verification.

---

### Pitfall 7: Data Migration Accuracy -- Content Truncation and Character Encoding

**What goes wrong:**
When extracting findings table rows from `sections[]` into typed `findings[]` arrays, content is silently truncated or character-encoding issues introduce artifacts. The exhibit findings contain long-form prose in table cells (some cells are 2-3 sentences). Copy-paste errors during migration truncate cells, drop Unicode characters (em-dashes, curly quotes), or introduce whitespace artifacts.

**Why it happens:**
v2.2 personnel extraction encountered this with em-dash separators in Exhibit L's role descriptions and with multi-line personnel descriptions. The findings data has similar complexity: cells contain em-dashes (Unicode `\u2014`), technical terms with special characters, and long prose that is easy to clip when manually transforming array structures.

**How to avoid:**
1. Write a data validation test BEFORE migration that counts the expected number of findings entries per exhibit (from the original table rows) and verifies no entry has an empty `finding` field
2. After migration, run a character-level comparison of the new `findings[]` data against the original `sections[]` table data -- a test that reads both representations and verifies content match
3. Do not hand-edit the long prose cells; copy them exactly from the existing `rows[]` arrays
4. Test that Unicode characters (em-dashes, quotes) survive the migration intact

**Warning signs:**
- Findings count in `findings[]` does not match row count in the original table section
- Truncated text in rendered findings cards (sentences ending mid-word)
- Em-dashes (`\u2014`) replaced with hyphens or question marks
- Empty description fields where the original table had content

**Phase to address:**
Phase 1 (data extraction). Validation tests must run before and after migration. This is the same TDD pattern used successfully in v2.2 Phase 17.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keeping old findings table sections alongside new `findings[]` arrays | Zero rendering disruption during transition; original data preserved as verification reference | Two representations of the same data in `exhibits.ts`; file size grows | Acceptable during v2.3 -- consistent with v2.2 personnel approach. Should be cleaned up in a future "data normalization" milestone |
| Hardcoding the section heading filter in layout templates | Quick duplication prevention without touching the sections data | Filter logic is implicit; future developers must understand why some table sections skip rendering | Acceptable -- low complexity, and comment explaining the filter makes it self-documenting |
| Not promoting text-type findings (Exhibits C, F) | Avoids lossy prose-to-structured conversion | Two exhibits' findings remain as prose in `sections[]` while 7 have structured `findings[]` | Acceptable -- these are genuinely different content shapes. Forcing structure would be worse than the inconsistency |
| Single CSS file for all component styles | Consistent with codebase convention (all CSS in `main.css`) | File continues growing (already 3500+ lines) | Acceptable -- this is the established pattern. Scoped styles or CSS modules would be a bigger refactor than v2.3 scope |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `ExhibitFindingEntry` placement | Creating a new `findings.ts` types file alongside the existing `src/data/findings.ts` (homepage data) | Define in `src/data/exhibits.ts` alongside `ExhibitPersonnelEntry` -- same pattern, same location |
| Layout template sections loop | Adding findings rendering without filtering the sections loop, causing duplication | Add a computed or inline filter that skips findings-headed table sections when `exhibit.findings?.length` is truthy |
| Both layouts need identical changes | Updating `InvestigationReportLayout` but forgetting `EngineeringBriefLayout` (or vice versa) | Both layouts are near-identical -- the same integration change applies to both. Update symmetrically in the same phase plan, as v2.2 Phase 19 did for personnel |
| Storybook story data | Using the homepage `Finding` type in stories by mistake | Import `ExhibitFindingEntry` from `@/data/exhibits`, not `Finding` from `@/data/findings` |
| CSS class naming | Using `.finding-*` classes (already taken by homepage FindingCard styles in main.css lines 653-1140) | Use `.exhibit-findings-*` or `.findings-table-*` prefix to avoid collision with existing `.finding-card`, `.finding-header`, `.finding-label`, `.finding-title`, `.finding-meta`, `.finding-section` classes |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| None significant | N/A | N/A | This is a static portfolio site with 15 exhibits. No performance traps at this scale. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Desktop table with horizontal scroll on narrow-ish screens (768-1024px) | 3-column findings tables (Exhibits A, J) overflow on tablets, requiring horizontal scrolling | The 3-column tables have long prose cells -- use the responsive card pattern at a higher breakpoint (768px) for 3-column variants, not just 480px |
| Card layout losing tabular scan pattern | Users can no longer visually compare findings across rows when each finding is a separate card | On desktop, maintain table format for scanability. Cards are for mobile only. Do not use a card grid at all screen sizes |
| Severity field not visually emphasized | Exhibit J has a "Severity" column (Critical/High/etc.) that is meaningful but renders as plain text in a card | Apply visual treatment to severity values -- even just bold text or a subtle color accent using existing badge tokens |
| Inconsistent section ordering | Findings section appears in different positions relative to personnel, resolution, and other sections across exhibits | Place findings rendering in a consistent position in both layouts (after main sections, before personnel) -- let the component's placement in the template determine order, not the data |

## "Looks Done But Isn't" Checklist

- [ ] **Naming:** New type is `ExhibitFindingEntry`, not `Finding` or `ExhibitFinding` -- verify no import collisions with `src/data/findings.ts`
- [ ] **CSS classes:** New component uses `.exhibit-findings-*` prefix -- verify no collision with `.finding-*` classes (grep main.css)
- [ ] **Column variance:** Storybook has stories for 2-column AND 3-column findings -- verify Exhibit A pattern (finding/background/resolution) and Exhibit J pattern (finding/severity/description) both render correctly
- [ ] **Custom headings:** Exhibits I and J display their custom heading suffixes ("Five Concurrent Systemic Failures", "Five Foundational Gaps") -- not just generic "Findings"
- [ ] **No duplication:** Exhibit detail pages do NOT show findings data twice (once in sections loop, once in new component) -- visually verify on at least one exhibit with findings
- [ ] **Text findings untouched:** Exhibits C and F still render their prose findings via the existing sections text renderer -- not promoted, not broken
- [ ] **Data accuracy:** Findings count per exhibit matches original table row count -- run validation test
- [ ] **Dark mode:** New component renders correctly in dark mode -- verify both table (desktop) and card (mobile) layouts
- [ ] **Empty state:** Exhibits without findings (e.g., Exhibit O) show no findings section and no empty container -- same empty-state suppression as personnel
- [ ] **Design tokens:** New CSS contains zero hardcoded colors, spacing, or font sizes -- grep for `#`, `rgb(`, `hsl(`, literal `px` values outside borders
- [ ] **Both layouts:** Changes applied symmetrically to InvestigationReportLayout AND EngineeringBriefLayout

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Naming collision (wrong Finding type imported) | LOW | Rename type, update imports. TypeScript compiler catches type mismatches if fields differ enough; but if both have similar string fields, runtime behavior may be wrong without type errors. Rename early. |
| Column variance data loss | LOW | Re-extract from original `sections[]` table data (preserved via coexistence pattern). The original data is never deleted. |
| Duplicate rendering | LOW | Add section filter condition to layout templates. Single-line fix per layout. |
| CSS collision with homepage `.finding-*` classes | MEDIUM | Rename all new component classes. Requires updating component template and main.css. More disruptive if styles have already been refined. |
| Custom heading loss | LOW | Add `findingsHeading` field to exhibits; re-extract from original section headings. Data is preserved in `sections[]`. |
| Data migration truncation | LOW | Compare against original `sections[]` rows (still in codebase). Re-copy truncated content. Validation test catches this before merge. |
| Dark mode broken | LOW | Add `[data-theme="dark"]` CSS overrides using existing token values. Pattern well-established in main.css. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Naming collision (Pitfall 1) | Phase 1: Interface definition | `grep -r "import.*Finding.*from.*findings" src/` returns only homepage imports; new type imports come from `exhibits.ts` |
| Column variance (Pitfall 2) | Phase 1: Interface definition | Interface has `finding` (required) + optional `description`, `background`, `resolution`, `severity`; no data loss in migration |
| Responsive breakage (Pitfall 3) | Phase 2: Component build | Storybook stories render 2-col and 3-col variants; visual review at 1280px, 768px, and 375px widths |
| Custom heading loss (Pitfall 4) | Phase 1: Data extraction | Exhibits I and J have `findingsHeading` field populated; component renders custom heading |
| Duplicate rendering (Pitfall 5) | Phase 3: Layout integration | Visual review of exhibit with findings shows content once, not twice; old table section filtered from sections loop |
| CSS token bypass (Pitfall 6) | Phase 2: Component build | `grep -E '#[0-9a-f]{3,6}|rgb\(|hsl\(' main.css` in new component section shows zero new hardcoded values |
| Data truncation (Pitfall 7) | Phase 1: Data extraction | Validation test compares `findings[].length` against original table `rows[].length` per exhibit; content spot-checks pass |

## Sources

- Direct codebase analysis of `src/data/exhibits.ts` -- all 9 exhibits with "Findings" headings examined (7 table-type, 2 text-type), column patterns catalogued (HIGH confidence)
- Direct codebase analysis of `src/data/findings.ts` -- homepage Finding interface and data (HIGH confidence)
- Direct codebase analysis of `src/components/FindingCard.vue` -- homepage Finding component (HIGH confidence)
- Direct codebase analysis of `src/components/PersonnelCard.vue` -- v2.2 rendering pattern as precedent (HIGH confidence)
- Direct codebase analysis of `src/components/exhibit/InvestigationReportLayout.vue` and `EngineeringBriefLayout.vue` -- layout integration patterns (HIGH confidence)
- Direct codebase analysis of `src/assets/css/main.css` -- responsive table patterns (lines 4000-4370), `.finding-*` class inventory (lines 653-1140), design token system (HIGH confidence)
- v2.2 milestone audit (`.planning/milestones/v2.2-MILESTONE-AUDIT.md`) -- personnel promotion precedent and lessons learned (HIGH confidence)
- v2.2 roadmap (`.planning/milestones/v2.2-ROADMAP.md`) -- phase structure and success criteria patterns (HIGH confidence)

---
*Pitfalls research for: Findings data promotion and responsive rendering -- exhibit table-to-typed-array migration*
*Researched: 2026-04-02*
