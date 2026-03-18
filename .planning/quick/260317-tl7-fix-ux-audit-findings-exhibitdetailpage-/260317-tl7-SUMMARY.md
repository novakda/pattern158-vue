---
phase: quick-260317-tl7
plan: 01
subsystem: ui
tags: [css, design-system, tokens, accessibility, touch-target]

requires: []
provides:
  - ExhibitDetailPage CSS using canonical design system token names
  - .btn enforcing 44px minimum touch target via inline-flex + min-height
  - .page-contact .timezone-note using --radius-md token
  - Dead FAQ details/summary CSS removed (never matched FaqItem div.faq-item)
  - Orphaned .section-alt link rule removed
affects: [ExhibitDetailPage, FaqPage, ContactPage, design-system-tokens]

tech-stack:
  added: []
  patterns:
    - "CSS token hygiene: use canonical token names (--space-lg not --space-l, --font-size-sm not --text-sm)"
    - "Touch target compliance: .btn uses display:inline-flex + min-height:44px per WCAG 2.5.5"

key-files:
  created: []
  modified:
    - src/assets/css/main.css

key-decisions:
  - ".btn changed from display:inline-block to inline-flex so min-height enforces touch target without affecting layout children"
  - "Dead .page-faq details/summary CSS removed; FaqItem renders div.faq-item not details element (confirmed from Phase 3 decision)"

patterns-established:
  - "Token rename mapping: --space-l -> --space-lg, --space-m -> --space-md, --space-s -> --space-sm, --text-sm -> --font-size-sm, --text-2xl -> --font-size-2xl"
  - "Color token rename: --color-inverse-bg -> --color-inverse, --color-surface-raised -> --color-background-alt"

requirements-completed:
  - TL7-CSS-TOKENS
  - TL7-BTN-TOUCH
  - TL7-RADIUS-TOKEN
  - TL7-DEAD-FAQ-CSS
  - TL7-ORPHANED-RULE

duration: 12min
completed: 2026-03-17
---

# Quick Task 260317-tl7: UX Audit CSS Fixes Summary

**Five CSS audit findings fixed in main.css: wrong token names in ExhibitDetailPage, missing 44px touch target on .btn, hardcoded border-radius on .timezone-note, dead FAQ details/summary selectors, and orphaned .section-alt link rule**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-03-17T00:00:00Z
- **Completed:** 2026-03-17T00:12:00Z
- **Tasks:** 2
- **Files modified:** 1 (src/assets/css/main.css)

## Accomplishments

- Corrected 7 token name categories in the ExhibitDetailPage block (~lines 4353-4493): space, font-size, and color tokens all renamed to canonical design system names
- Fixed `.btn` base rule: `display:inline-block` replaced with `display:inline-flex` + `align-items:center` + `justify-content:center` + `min-height:44px` for WCAG 2.5.5 touch target compliance
- Fixed `.page-contact .timezone-note` hardcoded `border-radius: 8px` replaced with `var(--radius-md)`
- Removed entire dead `/* Details/Summary styling */` block (~105 lines) that targeted `details`/`summary` elements FaqItem never renders
- Removed mobile media query overrides for the same dead selectors
- Removed orphaned `.section-alt a, .section-alt .link-primary` selector lines (class never applied in Vue templates)

## Task Commits

1. **Task 1: Fix ExhibitDetailPage wrong token names** - `8e9fc15` (fix)
2. **Task 2: Touch target + radius token + remove dead/orphaned CSS** - `3537f95` (fix)

## Files Created/Modified

- `src/assets/css/main.css` - All five UX audit fixes applied; net -120 lines from dead code removal

## Decisions Made

- `.btn` changed to `display:inline-flex` rather than adding `min-height` alone to `display:inline-block`, because inline-flex is the correct base for centering button content and is what most design systems use for accessible buttons
- `--color-inverse-bg, #1a2332` fallback removed entirely when renaming to `--color-inverse` — the token is defined in `:root` so the fallback was redundant

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All five CSS audit findings resolved; ExhibitDetailPage, ContactPage, and FaqPage CSS are now conformant with the canonical design system token names
- No further CSS work required for this quick task

## Self-Check: PASSED

- `src/assets/css/main.css` — FOUND
- Commit `8e9fc15` — FOUND
- Commit `3537f95` — FOUND

---
*Phase: quick-260317-tl7*
*Completed: 2026-03-17*
