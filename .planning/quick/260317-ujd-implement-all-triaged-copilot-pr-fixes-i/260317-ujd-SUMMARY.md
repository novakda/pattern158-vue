---
phase: quick-260317-ujd
plan: 01
subsystem: pattern158.solutions static site
tags: [html-validity, css, sitemap, accessibility, json-ld]
dependency_graph:
  requires: []
  provides: [valid-html-index, valid-html-philosophy, valid-html-faq, valid-html-accessibility, clean-sitemap, testimonial-css-coverage]
  affects: [pattern158.solutions/index.html, pattern158.solutions/philosophy.html, pattern158.solutions/faq.html, pattern158.solutions/accessibility.html, pattern158.solutions/sitemap.xml, pattern158.solutions/css/main.css]
tech_stack:
  added: []
  patterns: [comma-separated CSS selector expansion, HTML block-element nesting rules]
key_files:
  created: []
  modified:
    - C:/main/pattern158.solutions/index.html
    - C:/main/pattern158.solutions/philosophy.html
    - C:/main/pattern158.solutions/faq.html
    - C:/main/pattern158.solutions/accessibility.html
    - C:/main/pattern158.solutions/sitemap.xml
    - C:/main/pattern158.solutions/css/main.css
decisions:
  - "Replaced axe-core dd claim with accurate manual DevTools/keyboard testing description per exact_fixes spec"
  - "Retained inner paragraph tags in accessibility.html while removing only outer p wrappers around block elements"
metrics:
  duration: ~8 minutes
  completed: 2026-03-17
  tasks_completed: 3
  files_modified: 6
---

# Quick Task 260317-ujd: Implement All Triaged Copilot PR Fixes (I) — Summary

**One-liner:** Applied 8 Copilot PR review fixes across 6 files: JSON-LD comment removal, invalid p-wrapping of block elements, duplicate class attributes, stray p tags, false axe-core claim, dead sitemap URL, and CSS testimonial selector expansion.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fix HTML validity in index.html, philosophy.html, faq.html | 923f2d0 | index.html, philosophy.html, faq.html |
| 2 | Fix accessibility.html block content wrapping and false axe-core claim | b088d26 | accessibility.html |
| 3 | Remove dead sitemap URL and expand CSS testimonial selectors | c57c485 | sitemap.xml, css/main.css |

## Changes by File

### index.html
- Removed two HTML comment lines (`<!-- JSONLD_KNOWS_START -->` / `<!-- JSONLD_KNOWS_END -->`) from inside the JSON-LD `knowsAbout` array. Result: `"knowsAbout": []` — valid JSON.

### philosophy.html
- Removed `<p>` wrapper around `<dl class="brand-elements-list">` (block element cannot be child of p)
- Merged `class="testimonial" class="testimonial-divider"` into `class="testimonial testimonial-divider"` (duplicate attribute)
- Removed stray `<p>` immediately before `</blockquote>` in first testimonial
- Removed stray `</p>` after `</div>` before `</section>` close

### faq.html
- Merged duplicate class attribute on testimonial section
- Removed stray `<p>` before `</blockquote>`
- Removed stray `</p>` after `</div>` before `</section>`

### accessibility.html
- Removed outer `<p>` wrappers around all 8 block-content sections (each wrapped `<h2>` + `<p>` + `<ul>`/`<dl>` in an invalid `<p>`)
- Also removed orphaned `<p></div></p>` pattern at end of content section
- Updated `<dt>Automated Testing</dt>` `<dd>` from false axe-core claim to: "Manual verification using browser DevTools Accessibility panel, keyboard navigation testing, and visual inspection across representative pages in both light and dark themes."

### sitemap.xml
- Removed entire `<url>` block for `https://pattern158.solutions/admin/` (dead path, not indexed)

### css/main.css
- Expanded 5 testimonial rule sets from `.page-contact`-only to also cover `.page-philosophy` and `.page-faq`:
  - `.page-contact .testimonial` → + `.page-philosophy .testimonial, .page-faq .testimonial`
  - `.page-contact .testimonial-quote` → + philosophy and faq variants
  - `.page-contact .testimonial-quote::before` → + philosophy and faq variants
  - `.page-contact .testimonial-secondary` → + philosophy and faq variants
  - `.page-contact .testimonial-secondary .quote-text` → + philosophy and faq variants

## Deviations from Plan

None — plan executed exactly as written. All 8 Copilot-flagged issues resolved per exact_fixes specification.

## Verification

All 8 success criteria confirmed:

1. `grep "JSONLD_KNOWS" index.html` — no matches (PASS)
2. `grep '<p><dl' philosophy.html` — no matches (PASS)
3. `grep 'class="testimonial" class=' philosophy.html faq.html` — no matches (PASS)
4. Stray p tags in philosophy/faq testimonials removed — confirmed by inspection
5. `grep '<p><h2\|<p><ul\|<p><dl' accessibility.html` — no matches (PASS)
6. `grep "axe-core" accessibility.html` — no matches (PASS)
7. `grep "admin/" sitemap.xml` — no matches (PASS)
8. `grep -c "page-philosophy.*testimonial" css/main.css` — 5 matches (PASS)

## Self-Check: PASSED

All 3 commits present on `pr-1-fixes` branch in `C:/main/pattern158.solutions`:
- 923f2d0 — Task 1
- b088d26 — Task 2
- c57c485 — Task 3
