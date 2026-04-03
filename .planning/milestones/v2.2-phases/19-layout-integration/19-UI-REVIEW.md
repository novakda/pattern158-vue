# Phase 19 -- UI Review

**Audited:** 2026-04-02
**Baseline:** 19-UI-SPEC.md (design contract)
**Screenshots:** captured (dev server on localhost:5173)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Section heading "Project Team" matches spec exactly; no generic labels found |
| 2. Visuals | 4/4 | Personnel grid renders with clear visual hierarchy; section integrates seamlessly with existing layout |
| 3. Color | 4/4 | No new colors introduced; accent reserved for isSelf border only; all colors via CSS custom properties |
| 4. Typography | 4/4 | Section h2 inherits exhibit-section h2 styles (font-size-xl, semibold); card typography uses declared scale |
| 5. Spacing | 4/4 | exhibit-section class provides spec-matching spacing (margin-bottom: space-xl, padding-top: space-md, border-top) |
| 6. Experience Design | 4/4 | Empty state properly suppressed via v-if guard; no wrapper rendered when personnel absent; tests cover both states |

**Overall: 24/24**

---

## Top 3 Priority Fixes

No priority fixes identified. Implementation matches the UI-SPEC design contract on all 6 pillars. The phase was a minimal, additive integration (4 lines of template, 1 import line per layout) that correctly reuses existing styling infrastructure.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

The only new copy element is the section heading "Project Team", which appears at:
- `src/components/exhibit/InvestigationReportLayout.vue:124`
- `src/components/exhibit/EngineeringBriefLayout.vue:124`

This matches the UI-SPEC Copywriting Contract exactly. No generic labels (Submit, Click Here, OK) found in the modified files. No error or empty state copy needed per spec (static typed data, v-if guard suppresses section entirely).

### Pillar 2: Visuals (4/4)

Visual inspection of full-page screenshots confirms:
- Personnel grid renders as a 3-column card layout on desktop (1440px)
- Cards show clear name/role/title/org hierarchy with differentiated styling
- Self-entry cards have a distinct teal left border accent
- Anonymous entries use italic muted styling per Phase 18 spec
- Section integrates visually with surrounding exhibit-section blocks (consistent border-top separator)
- "Project Team" heading matches other section headings in size and weight

The section appears after Resolution and before Skills & Technologies, matching the specified placement order.

### Pillar 3: Color (4/4)

No hardcoded colors found in any modified files. All color values flow through CSS custom properties:
- `--color-border` for section separator
- `--color-surface` for card backgrounds
- `--color-primary` for self-entry border (accent usage)
- `--color-primary-subtle` for self-entry background tint

Accent color usage is confined to `personnel-card--self` class only, matching the spec's "accent reserved for isSelf: true card styling only" constraint.

### Pillar 4: Typography (4/4)

The `<h2>` heading inherits `.page-exhibit-detail .exhibit-section h2` styles:
- `font-size: var(--font-size-xl)` (24px) -- matches spec
- `margin-top: 0` -- matches spec
- `margin-bottom: var(--space-md)` (16px) -- matches spec
- `letter-spacing: 2px` -- consistent with other section headings

No new font sizes or weights introduced. Card-level typography (personnel-name, personnel-role, personnel-title, personnel-org) was established in Phase 18 and is not modified here.

### Pillar 5: Spacing (4/4)

The personnel section wrapper uses `class="exhibit-section"`, which provides:
- `margin-bottom: var(--space-xl)` (32px) -- matches spec
- `padding-top: var(--space-md)` (16px) -- matches spec
- `border-top: 1px solid var(--color-border)` -- matches spec

Mobile responsive override at main.css:4267 reduces `margin-bottom` to `var(--space-lg)` (24px), matching the spec's responsive behavior note.

No arbitrary spacing values (`[Npx]`, `[Nrem]`) found in any modified component files.

### Pillar 6: Experience Design (4/4)

**Empty state handling:** The `v-if="exhibit.personnel?.length"` guard on the outer `<div>` ensures:
- No wrapper div rendered when personnel is absent or empty
- No heading rendered
- No empty container or placeholder text

This matches the existing empty-section suppression pattern (e.g., `sectionHasContent()` guard function) and is verified by 4 tests:
- `InvestigationReportLayout.test.ts:109` -- renders when personnel present
- `InvestigationReportLayout.test.ts:117` -- suppresses when absent
- `EngineeringBriefLayout.test.ts:118` -- renders when personnel present
- `EngineeringBriefLayout.test.ts:126` -- suppresses when absent

**Template symmetry:** `diff` confirms identical personnel section markup across both layouts, preventing divergence (a risk noted in the research phase).

Loading states and error boundaries are not applicable -- this is static typed data with no runtime fetching, as noted in the UI-SPEC.

---

## Files Audited

- `src/components/exhibit/InvestigationReportLayout.vue` (137 lines)
- `src/components/exhibit/EngineeringBriefLayout.vue` (137 lines)
- `src/components/PersonnelCard.vue` (33 lines)
- `src/components/exhibit/InvestigationReportLayout.test.ts` (149 lines)
- `src/components/exhibit/EngineeringBriefLayout.test.ts` (148 lines)
- `src/assets/css/main.css` (personnel-grid, personnel-card, exhibit-section rules)

## Screenshots Captured

- `.planning/ui-reviews/19-20260402-185248/desktop-ir-full.png` -- Investigation Report (Exhibit J), desktop 1440px
- `.planning/ui-reviews/19-20260402-185248/desktop-eb-full.png` -- Engineering Brief (Exhibit A), desktop 1440px
- `.planning/ui-reviews/19-20260402-185248/mobile-ir-full.png` -- Investigation Report (Exhibit J), mobile 375px
- `.planning/ui-reviews/19-20260402-185248/mobile-eb-full.png` -- Engineering Brief (Exhibit A), mobile 375px
