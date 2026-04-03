# Phase 16 -- UI Review

**Audited:** 2026-04-02
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md)
**Screenshots:** Not captured (no dev server detected on ports 3000, 5173, 8080)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | All labels are domain-specific and contextual; no generic "Submit" or "Click Here" patterns |
| 2. Visuals | 3/4 | Clear visual hierarchy with timeline markers, metadata cards, flow nodes; inline style on flow container conflicts with CSS |
| 3. Color | 4/4 | Entire design system uses CSS custom properties with documented WCAG AA contrast ratios |
| 4. Typography | 4/4 | Font sizes and weights reference design tokens consistently; no hardcoded values in templates |
| 5. Spacing | 4/4 | All spacing uses design token scale (--space-xs through --space-xl); no arbitrary pixel values in CSS |
| 6. Experience Design | 3/4 | Empty section suppression is solid; no loading or error states for exhibit data rendering |

**Overall: 21/24**

---

## Top 3 Priority Fixes

1. **Inline style on flow container duplicates and conflicts with CSS** -- The `style="display:flex;flex-wrap:wrap;align-items:center;"` on line 87 of both layout files overrides the stylesheet rule at main.css:3915 which declares `display: flex; align-items: flex-start;`. The inline `align-items:center` fights the CSS `align-items:flex-start`, and the inline `flex-wrap:wrap` is not present in the stylesheet. Fix: remove the inline style attribute entirely and add `flex-wrap: wrap;` to the `.exhibit-flow` rule in main.css if wrapping is desired. Update `align-items` in one place only.

2. **No aria-labels or accessibility attributes on interactive/structural elements** -- The timeline, metadata, and flow sections have no ARIA landmarks or roles. The `<dl>` for metadata is semantically correct, but the timeline and flow lack `role` attributes or `aria-label` descriptions. Fix: add `role="list"` and `aria-label="Timeline"` to `.exhibit-timeline`, `role="listitem"` to `.timeline-entry`, and `aria-label="Process flow"` to `.exhibit-flow`.

3. **No loading or error boundary for exhibit detail rendering** -- The layout components assume `exhibit` prop is always valid and populated. If the parent passes incomplete data, there is no fallback UI. The `sectionHasContent` guard handles empty sections well, but there is no top-level guard for a missing or malformed exhibit prop. Fix: add a `v-if="exhibit"` guard on the root element with a fallback message, or ensure the parent view handles this.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

All user-facing strings are contextual and domain-appropriate:

- Navigation: "Back to Case Files" (line 24) -- clear, specific
- Section headings: "Resolution", "Skills & Technologies" -- descriptive
- Badge labels: "Investigation Report", "Engineering Brief" -- domain terminology
- Data-driven content: exhibit titles, dates, timeline entries, metadata labels all come from typed data

No generic labels ("Submit", "OK", "Cancel", "Click Here") found anywhere in the exhibit components.

Minor gap: No explicit empty-state copy is rendered when an exhibit has zero sections and no contextText. The component renders nothing between the header and the impact tags, which could feel incomplete to users.

**Files examined:**
- `src/components/exhibit/InvestigationReportLayout.vue` (all lines)
- `src/components/exhibit/EngineeringBriefLayout.vue` (all lines)

### Pillar 2: Visuals (3/4)

Visual hierarchy is well-structured:

- **Timeline**: Vertical line with dot markers (`.timeline-marker`), dates in uppercase heading font, entry headings at `font-size-base` weight 600, body text at `font-size-sm`, blockquote with left border accent -- strong visual rhythm
- **Metadata**: CSS Grid card layout with `minmax(180px, 1fr)` auto-fill, labels in uppercase xs font, values in sm font -- clear label/value distinction
- **Flow**: Nodes in bordered cards with heading-font labels, detail text in muted color, arrow separators using Unicode character -- communicates process direction

Issue: The inline `style="display:flex;flex-wrap:wrap;align-items:center;"` on line 87 of both layout files conflicts with the CSS declaration at main.css:3915-3921. The stylesheet says `align-items: flex-start` but the inline style forces `align-items: center`. This creates a specificity problem where the inline style always wins, making the CSS rule dead code. Additionally, the mobile responsive override at main.css:3974 changes to `flex-direction: column`, but the inline `flex-wrap:wrap` could cause unexpected behavior.

No icon-only buttons exist in these components (no accessibility gap there).

### Pillar 3: Color (4/4)

The design system is exemplary in its color token approach:

- All 106 references to `--color-primary` in main.css use the token system
- WCAG AA contrast ratios are documented inline for every color token (lines 11-41 of main.css)
- No hardcoded hex values or `rgb()` calls found in any `.vue` template file in the exhibit directory
- Primary color is used purposefully: timeline markers, timeline dates, flow arrows, link hover states
- Accent color (`--color-accent`) is reserved for specific highlight use, not overused

The phase 16 additions use only CSS classes that reference tokens -- no new color declarations were needed.

### Pillar 4: Typography (4/4)

The design token system defines 10 font size steps (xs through 5xl) and the phase 16 CSS uses an appropriate subset:

- Timeline dates: `--font-size-sm` with `--font-heading` family, weight 600 -- creates visual anchor
- Timeline headings: `--font-size-base`, weight 600 -- secondary emphasis
- Timeline body: `--font-size-sm` -- readable body text
- Timeline quotes: `--font-size-xs` italic -- appropriately subordinate
- Flow labels: `--font-size-base` with `--font-heading` family, weight 600, uppercase
- Flow details: `--font-size-xs` in `--color-text-medium`
- Metadata labels: `--font-size-xs`, weight 600, uppercase
- Metadata values: `--font-size-sm`

Font weights in use across the phase 16 CSS: 600 (semibold for labels/headings) and 700 (bold for flow arrows). This is a disciplined two-weight approach within these components.

No hardcoded font sizes or weights in the Vue templates.

### Pillar 5: Spacing (4/4)

All spacing in the phase 16 CSS additions uses the design token scale:

| Token | Usage count (full CSS) |
|-------|----------------------|
| `--space-md` | 123 |
| `--space-xl` | 86 |
| `--space-sm` | 82 |
| `--space-lg` | 57 |
| `--space-xs` | 46 |
| `--space-ms` | 18 |

Phase 16 specific spacing (lines 3818-4042):
- Timeline: `padding-left: var(--space-xl)`, entry margin `var(--space-lg)`, quote padding `var(--space-xs) var(--space-sm)`
- Flow: node padding `var(--space-md) var(--space-lg)`, arrow padding `0 var(--space-sm)`, mobile adjustments to `var(--space-sm) var(--space-md)`
- Metadata: grid gap `var(--space-sm)`, card padding `var(--space-sm) var(--space-md)`

No arbitrary pixel values or `[custom]` spacing found. The only hardcoded pixel values are structural (e.g., timeline marker `width: 10px; height: 10px;` and vertical line `width: 2px`) which are appropriate for decorative elements.

### Pillar 6: Experience Design (3/4)

**Strengths:**
- `sectionHasContent()` guard comprehensively checks all 5 section types before rendering, preventing empty DOM nodes -- this is a well-designed pattern
- The `v-if/v-else-if` chain ensures mutual exclusivity of section type rendering
- Context fallback (`v-else-if="exhibit.contextText"`) handles exhibits that lack structured sections
- Tests cover both positive rendering and negative empty-suppression cases (10 new tests)

**Gaps:**
- No loading state: if exhibit data is async, the layout assumes it is already resolved
- No error boundary: a malformed section (e.g., `type: 'timeline'` with `entries: undefined` instead of `entries: []`) would pass the `sectionHasContent` guard (returns false) but there is no user feedback
- No explicit empty state when an exhibit has sections but ALL are empty -- it renders a page with only header and impact tags, no explanatory text
- The flow section `style` attribute (line 87) suggests a last-minute fix that bypasses the CSS design system

---

## Files Audited

- `/home/xhiris/projects/pattern158-vue/src/components/exhibit/InvestigationReportLayout.vue` (131 lines)
- `/home/xhiris/projects/pattern158-vue/src/components/exhibit/EngineeringBriefLayout.vue` (131 lines)
- `/home/xhiris/projects/pattern158-vue/src/components/exhibit/InvestigationReportLayout.test.ts` (129 lines)
- `/home/xhiris/projects/pattern158-vue/src/components/exhibit/EngineeringBriefLayout.test.ts` (128 lines)
- `/home/xhiris/projects/pattern158-vue/src/assets/css/main.css` (lines 3818-4042, timeline/flow/metadata CSS)
- `/home/xhiris/projects/pattern158-vue/.planning/phases/16-section-type-rendering/16-01-SUMMARY.md`
- `/home/xhiris/projects/pattern158-vue/.planning/phases/16-section-type-rendering/16-01-PLAN.md`
