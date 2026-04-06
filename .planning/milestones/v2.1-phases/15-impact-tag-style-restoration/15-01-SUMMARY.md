---
phase: 15-impact-tag-style-restoration
plan: 01
status: complete
started: 2026-04-02
completed: 2026-04-02
---

## Summary

Restored the base `.impact-tag` and `.impact-tags` CSS rules that were accidentally deleted in Phase 13 (commit 72b0a11) as "dead CSS". Impact tags now render as styled pill badges on both the Case Files listing page and exhibit detail pages.

## What Changed

- Added `.impact-tags` rule: flexbox wrap container with gap spacing
- Added `.impact-tag` rule: pill badge with dark background, light text, border-radius, padding
- Added `.impact-tag.highlight` rule: primary color background variant
- Insertion point: after card border accent rules, before `.tech-summary` (line ~2947)

## Key Files

key-files:
  created: []
  modified:
    - src/assets/css/main.css

## Verification

- `grep -c "^\.impact-tag {"` returns 1 (exactly one standalone rule)
- `grep -c "^\.impact-tags {"` returns 1 (exactly one container rule)
- `grep -c "^\.impact-tag\.highlight {"` returns 1 (highlight variant)
- `npm run build` succeeds
- Human verified: impact tags display as styled pills on Case Files and exhibit detail pages

## Self-Check: PASSED

All acceptance criteria met:
- [x] Standalone `.impact-tags` with flexbox wrap layout
- [x] Standalone `.impact-tag` with pill styling (background, border-radius, padding)
- [x] `.impact-tag.highlight` with primary color background
- [x] Rules appear before `.tech-tags` contextual override
- [x] No duplicate rules
- [x] Build passes
- [x] Human visual verification approved

## Deviations

None — exact CSS from commit 72b0a11 was restored with updated comment.

## Issues

None
