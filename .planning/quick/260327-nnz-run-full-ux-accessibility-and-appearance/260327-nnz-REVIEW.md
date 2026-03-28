# Exhibit Detail Page UX Review

Date: 2026-03-27
Pages reviewed: exhibit-a, exhibit-k, exhibit-m
Viewports: 375px, 768px, 1280px

## Executive Summary

The exhibit detail pages suffer from insufficient vertical breathing room between content blocks, monotonous typographic rhythm, and an overly uniform visual weight that makes scanning difficult. The user's report of "dense and hard to read" is confirmed: the body sections (Background, Personnel, Findings, etc.) stack with minimal separation, headings do not create strong enough visual breaks, and the quote blocks at the top consume significant vertical space without adequate differentiation from body content. The most impactful improvements would be increasing section spacing, adding stronger heading hierarchy, and reducing quote block visual weight.

## Findings by Category

### 1. Typography and Readability

**[HIGH] Body text line-height is tight for long paragraphs**
- Selector: `.page-exhibit-detail` inherits global body `line-height` (not explicitly set for detail body)
- The Background and Outcome sections on exhibit-a and exhibit-m contain dense paragraph text that would benefit from `line-height: 1.7` or higher
- Affected viewports: all, most noticeable at 375px where narrow columns create more lines

**[MEDIUM] Section headings (h2) lack font-size declaration for detail page**
- Selector: `.page-exhibit-detail h2` has no specific rule; inherits from `h1, h2, h3 { font-family: var(--font-heading); letter-spacing: 1px }` with browser default sizing
- The h2 headings (BACKGROUND, PERSONNEL, FINDINGS, etc.) use Bebas Neue at browser-default h2 size (~1.5em). They appear as ALL-CAPS blocky labels but are not significantly larger than body text, weakening their role as section dividers
- At 1280px: headings read at roughly the same visual weight as bold table headers, diminishing hierarchy
- Affected viewports: all

**[MEDIUM] Quote text is italic with no font-size differentiation**
- Selector: `.page-exhibit-detail .exhibit-quote p { font-style: italic; }` inherits base font-size (1rem / 16px)
- The quotes on exhibit-a (4 blockquotes stacked) create a wall of italic text that blurs together
- A slightly larger font-size (--font-size-lg / 1.25rem) or a lighter font-weight would create better visual distinction
- Affected viewports: all

**[LOW] Attribution text is small but adequate**
- Selector: `.exhibit-quote .attribution { font-size: var(--font-size-sm) }` = 0.875rem
- This is appropriately sized; no change needed

### 2. Content Density and Spacing

**[HIGH] Vertical spacing between sections is insufficient**
- There is no `.exhibit-section` CSS rule at all. The `<div class="exhibit-section">` elements have zero explicit margin or padding
- Sections (Background, Personnel, Findings, Probable Cause, Outcome) stack with only the browser default margin on the h2 and p tags, creating approximately 1em of gap between the bottom of one section and the heading of the next
- Compare to other pages on the site which use `var(--space-4xl)` (5rem / 80px) between major sections
- This is the single biggest contributor to the "dense" feeling
- Affected viewports: all, worst at 375px

**[HIGH] Quote blocks are too tightly stacked**
- Selector: `.page-exhibit-detail .exhibit-quote { margin: 0 0 var(--space-md) }` = margin-bottom: 1rem (16px)
- Exhibit-a has 4 blockquotes. With only 16px between them, they read as one continuous block of italic text
- Suggested direction: increase to `var(--space-lg)` (1.5rem) or `var(--space-xl)` (2rem)
- Affected viewports: all

**[MEDIUM] Table cells are appropriately padded but tables lack top/bottom section margin**
- Selector: `.resolution-table td { padding: var(--space-sm) var(--space-md) }` = 0.5rem 1rem
- The resolution table on exhibit-a flows directly after the preceding section with minimal gap
- The `exhibit-resolution` wrapper has `margin-bottom: var(--space-xl)` but no `margin-top`, so the gap above it depends entirely on whatever precedes it
- Same issue for `.exhibit-context { margin-bottom: var(--space-xl) }` -- has bottom margin but no top margin
- Affected viewports: all

**[MEDIUM] Body padding is only `var(--space-xl)` (2rem) top and bottom**
- Selector: `.page-exhibit-detail .exhibit-detail-body { padding: var(--space-xl) 0 }` = 2rem top/bottom
- Other pages use `var(--space-4xl)` (5rem) for section padding. The detail body has less than half the breathing room at top and bottom
- Affected viewports: all, most noticeable at 1280px where the narrow content column has ample side whitespace but insufficient vertical space

### 3. Visual Hierarchy

**[HIGH] No visual separation between content sections**
- The Background, Personnel, Findings, Probable Cause, and Outcome sections on exhibit-k and exhibit-m flow into each other as one continuous stream. The only break is the h2 heading, which (per Finding 1.2) is not visually dominant enough
- There is no horizontal rule, border, background change, or spacing increase to signal a new section
- At 375px on exhibit-a, the page scrolls for thousands of pixels with no visual rest points
- Affected viewports: all

**[MEDIUM] The "Investigation Report" badge is undersized relative to the title**
- On exhibit-a at 375px, the teal badge below the title is small and could be missed
- This is a minor hierarchy issue; the badge serves its purpose at 768px+
- Affected viewports: 375px

**[LOW] Meta header (label, client, date) is well-structured**
- Selector: `.exhibit-meta-header { font-size: var(--font-size-sm); display: flex; gap: var(--space-xs) }`
- The dot separators and teal label color create adequate hierarchy in the header area
- No change needed

### 4. Whitespace and Breathing Room

**[HIGH] Container max-width of 1200px is too wide for long-form reading**
- Selector: `.container { max-width: 1200px }` applies to the detail body
- At 1280px viewport, the body content stretches to nearly full width. For the long-form text in Background and Outcome sections, the line lengths are 90+ characters per line, exceeding the recommended 65-75 characters for comfortable reading
- Exhibit detail pages would benefit from a narrower content container (e.g., max-width: 800px or 900px) for the body section specifically
- Affected viewports: 1280px

**[MEDIUM] Header section vertical padding is adequate but creates a strong contrast**
- Selector: `.exhibit-detail-header { padding: var(--space-lg) 0 var(--space-xl) }` = 1.5rem top, 2rem bottom
- The dark header is the most well-spaced part of the page. This actually accentuates the density of the body section below it, as the transition from spacious dark header to compressed light body is jarring
- Affected viewports: all

**[LOW] Impact tags section has adequate top margin**
- Selector: `.exhibit-impact-tags { margin-top: var(--space-xl) }` = 2rem
- The tags section at the bottom has reasonable spacing from the preceding content
- Affected viewports: all

### 5. Accessibility

**[MEDIUM] Heading hierarchy jumps from h1 to h2 correctly but h2s are unmarked visually**
- The page uses h1 for the title and h2 for each section heading. This is semantically correct
- However, the visual treatment of h2 (Bebas Neue, browser-default size, no color differentiation from body text at dark mode) makes it harder for users scanning by visual landmarks
- Affected viewports: all

**[MEDIUM] Table readability at 375px**
- The Personnel table on exhibit-a at 375px has three columns (Name, Title, Organization) that squeeze into narrow space. Text wraps heavily but remains readable
- The Resolution table at 375px is more problematic: two columns of paragraph text create very narrow reading columns with frequent line breaks
- The `data-label` attributes are present on td elements, which enables responsive table patterns, but no CSS uses them currently
- Affected viewports: 375px

**[LOW] Color contrast passes WCAG AA throughout**
- The color tokens in :root are documented with contrast ratios. All body text on light background uses `--color-text: #2d3436` (12.04:1). Quote attribution uses `--color-text-medium: #555555` (7.08:1). Both exceed 4.5:1 AA requirement
- Dark header text uses `--color-inverse-text: #faf9f6` (14.20:1 on `--color-inverse: #1a2838`)
- No contrast issues found

**[LOW] Touch targets are adequate**
- The "Back to Portfolio" link at the top is the only interactive element beyond navigation. It uses default link sizing, which is small but acceptable since it is not in a touch-dense area
- No touch target concerns

### 6. Responsive Behavior

**[MEDIUM] No responsive adjustments for exhibit detail page**
- There are no `@media` queries specific to `.page-exhibit-detail` in main.css
- At 375px, the page relies entirely on the global `.container` padding (`var(--space-xl)` = 2rem), which is generous side padding on mobile but there are no font-size, padding, or layout adjustments for the detail body content
- The header meta items wrap naturally via `flex-wrap: wrap` which works acceptably

**[MEDIUM] Tables do not switch to stacked layout on mobile**
- The Personnel table (3 columns) and Resolution table (2 columns) maintain their tabular layout at 375px
- The `data-label` attributes on cells suggest a stacked-table responsive pattern was intended but never implemented
- At 375px, the Resolution table columns become very narrow, making the resolution text hard to read
- Affected viewports: 375px

**[LOW] Full-page screenshots show exhibit-a is extremely long at 375px**
- Exhibit-a at 375px produces a very tall page with 4 quotes, multiple text sections, personnel table, findings table, resolution table, and impact tags
- There is no content collapsing, accordion, or "read more" pattern to manage the scroll length
- This is expected given the data density of exhibit-a, but the lack of section spacing (Finding 2.1) makes it feel like an unbroken wall

## Prioritized Recommendations

1. **Add explicit section spacing to `.exhibit-section`** -- Create a new CSS rule: `.page-exhibit-detail .exhibit-section { margin-bottom: var(--space-3xl) }` (4rem). This is the highest-impact single change. Currently there is zero explicit spacing between sections.

2. **Increase exhibit body padding** -- Change `.page-exhibit-detail .exhibit-detail-body { padding: var(--space-xl) 0 }` to use `var(--space-3xl)` or `var(--space-4xl)` for the top padding, creating breathing room after the dark header.

3. **Add a narrower max-width for detail body content** -- Add `.page-exhibit-detail .exhibit-detail-body .container { max-width: 900px }` to limit line length for readability at desktop widths. This single change would dramatically improve the reading experience at 1280px.

4. **Increase quote block spacing** -- Change `.page-exhibit-detail .exhibit-quote { margin: 0 0 var(--space-md) }` to `margin: 0 0 var(--space-lg)` or `var(--space-xl)` to separate stacked quotes.

5. **Style section headings for detail page** -- Add `.page-exhibit-detail .exhibit-section h2 { font-size: var(--font-size-2xl); margin-top: var(--space-xl); margin-bottom: var(--space-md); color: var(--color-heading); }` to create stronger visual breaks. Consider adding a subtle top border or increased top padding.

6. **Add line-height to body paragraphs** -- Add `.page-exhibit-detail p { line-height: 1.7 }` to improve readability of dense paragraph text in Background, Outcome, and Key Insight sections.

7. **Implement responsive stacked tables at 375px** -- Use the existing `data-label` attributes to create a stacked card layout for tables below 768px. This would address the narrow-column readability issue on Resolution and Findings tables.

8. **Add section dividers** -- Consider adding a subtle `border-top: 1px solid var(--color-border)` with `padding-top: var(--space-xl)` to `.exhibit-section` for additional visual separation beyond spacing alone.

9. **Consider a "quotes" container heading** -- The quote blocks on content-heavy exhibits (exhibit-a) would benefit from a visual label or lighter background treatment to distinguish them from the body sections below.

10. **Add responsive media queries** -- Add a `@media (max-width: 768px)` block for `.page-exhibit-detail` to adjust body padding, heading sizes, and table layout for mobile viewports.

## Screenshots Reference

| Exhibit | 375px | 768px | 1280px |
|---------|-------|-------|--------|
| exhibit-a | `screenshots/exhibit-a-375.png` | `screenshots/exhibit-a-768.png` | `screenshots/exhibit-a-1280.png` |
| exhibit-k | `screenshots/exhibit-k-375.png` | `screenshots/exhibit-k-768.png` | `screenshots/exhibit-k-1280.png` |
| exhibit-m | `screenshots/exhibit-m-375.png` | `screenshots/exhibit-m-768.png` | `screenshots/exhibit-m-1280.png` |
