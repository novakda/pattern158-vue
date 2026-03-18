---
quick_task: 260317-vrl
title: Fix 6 new Copilot PR findings — philosophy HTML nesting, CSS quote selectors, accessibility text, exhibit inline styles
type: quick
autonomous: true
target_repo: C:/main/pattern158.solutions
branch: pr-1-fixes
---

# Quick Task 260317-vrl: Fix 6 New Copilot PR Findings

## Objective

Fix invalid HTML nesting in philosophy.html, expand CSS quote selectors to philosophy/faq pages, fix inaccurate accessibility.html test result claim, and extract repeated inline style blocks from 15 exhibit files into main.css.

## Tasks

### Task 1: philosophy.html — Remove all invalid HTML nesting

**File:** `C:/main/pattern158.solutions/philosophy.html`

Fix three patterns of invalid block-in-inline nesting:

- Pattern A: Remove outer `<p>` wrapping `<ol class="methodology-steps">...</ol>`
- Pattern B: Remove outer `<p>` wrapping inner `<p ...>` tags throughout the file
- Pattern C: Remove outer `<p>` wrapping `<div class="origin-story">` (two occurrences)

Commit: `fix(pr-1): remove invalid block-in-inline nesting in philosophy.html`

### Task 2: css/main.css — Expand quote selectors to philosophy and faq

**File:** `C:/main/pattern158.solutions/css/main.css`

Expand four selectors (and their media query duplicates) from `.page-contact` only to also include `.page-philosophy` and `.page-faq`:

- `.page-contact .quote-text`
- `.page-contact .quote-attribution`
- `.page-contact .quote-attribution cite`
- `.page-contact .quote-context`
- Media query duplicate of `.page-contact .quote-text` (line ~3757)
- Media query duplicate of `.page-contact .testimonial-quote::before` (line ~3761)

Commit: `fix(pr-1): expand quote selectors to cover philosophy and faq pages`

### Task 3: accessibility.html — Fix inaccurate test result claim

**File:** `C:/main/pattern158.solutions/accessibility.html`

- Change "21/21 pages pass all WCAG 2.1 AA automated tests (100% compliance)" to "21/21 pages pass manual WCAG 2.1 AA review (100% compliant)"
- Change "Last Verified: February 21, 2026" to "Last Verified: March 15, 2026"

Commit: `fix(pr-1): correct inaccurate automated test claim in accessibility.html`

### Task 4: exhibits — Extract inline style blocks to main.css

**Files:** `C:/main/pattern158.solutions/css/main.css` + all 15 exhibit HTML files

Step 1: Append print styles and breadcrumb styles to end of main.css (once).
Step 2: Remove both `<style>...</style>` blocks from each of the 15 exhibit files (exhibit-a.html through exhibit-o.html).

Commit: `fix(pr-1): extract exhibit inline styles to main.css`

## Success Criteria

- No `<p><ol`, `<p><div`, `<p><p` patterns remain in philosophy.html
- `.page-philosophy` and `.page-faq` are covered by all four quote selectors in main.css
- Accessibility page no longer claims automated tests; date is March 15, 2026
- All 15 exhibit files have no `<style>` blocks; main.css contains the extracted styles once
