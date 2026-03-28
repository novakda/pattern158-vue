---
phase: quick
plan: 260327-nnz
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/ux-review-script.ts
  - .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/screenshots/
  - .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/260327-nnz-REVIEW.md
autonomous: true
requirements: []
must_haves:
  truths:
    - "Screenshots captured at 375px, 768px, and 1280px for multiple exhibit detail pages"
    - "Review document contains specific findings on typography, density, hierarchy, spacing, accessibility, and responsiveness"
    - "Findings are actionable with CSS property references, not vague observations"
  artifacts:
    - path: ".planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/260327-nnz-REVIEW.md"
      provides: "Structured UX/accessibility review with actionable findings"
    - path: ".planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/screenshots/"
      provides: "Playwright screenshots at 3 viewport widths"
  key_links: []
---

<objective>
Run a comprehensive UX, accessibility, and appearance review of ExhibitDetailPage using Playwright screenshots at 375px, 768px, and 1280px viewports. The user reports these pages feel dense and hard to read.

Purpose: Produce a structured review document with specific, actionable findings the user can prioritize for a follow-up fix task.
Output: Screenshot set + 260327-nnz-REVIEW.md with categorized findings.
</objective>

<execution_context>
@/home/xhiris/projects/pattern158-vue/.claude/get-shit-done/workflows/execute-plan.md
@/home/xhiris/projects/pattern158-vue/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@src/pages/ExhibitDetailPage.vue
@src/data/exhibits.ts (first 50 lines for data model)

Key CSS lives in src/assets/css/main.css lines ~4339-4480 under `.page-exhibit-detail` selectors.

Exhibits using ExhibitDetailPage (isDetailExhibit: true):
- exhibit-a (quotes + sections + resolution table — most content-rich)
- exhibit-c (quotes + sections)
- exhibit-e, exhibit-j, exhibit-k, exhibit-l, exhibit-m, exhibit-n, exhibit-o

Select 3 representative exhibits for review:
1. exhibit-a — heaviest content (quotes, multiple sections, resolution table, tags)
2. exhibit-k — mid-weight (check for typical density)
3. exhibit-m — lighter content (check spacing with less content)
</context>

<tasks>

<task type="auto">
  <name>Task 1: Capture Playwright screenshots at 3 viewports for 3 representative exhibits</name>
  <files>
    .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/ux-review-script.ts
    .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/screenshots/
  </files>
  <action>
1. Start the Vite dev server (`npm run dev`) in the background on the default port (5173).
2. Write a Playwright script at the files path above that:
   - Imports chromium from playwright
   - For each of 3 exhibits (exhibit-a, exhibit-k, exhibit-m) and each of 3 viewports (375x812, 768x1024, 1280x900):
     - Opens the page at http://localhost:5173/exhibits/{slug}
     - Waits for network idle
     - Takes a full-page screenshot saved to screenshots/{slug}-{width}.png
   - That is 9 screenshots total (3 exhibits x 3 widths)
3. Run the script with `npx tsx ux-review-script.ts` from the quick task directory.
4. Stop the dev server after screenshots are captured.

Do NOT use vitest/browser tests — use Playwright directly as a script for screenshot capture.
  </action>
  <verify>
    <automated>ls -la .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/screenshots/*.png | wc -l</automated>
  </verify>
  <done>9 PNG screenshots exist: 3 exhibits x 3 viewport widths</done>
</task>

<task type="auto">
  <name>Task 2: Analyze screenshots and CSS to produce structured review document</name>
  <files>.planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/260327-nnz-REVIEW.md</files>
  <action>
Review each of the 9 screenshots visually (use the Read tool on the PNG files). Also read the exhibit-detail CSS rules in src/assets/css/main.css (lines 4339-4480) to correlate visual issues with specific CSS properties.

Write 260327-nnz-REVIEW.md with this structure:

```
# Exhibit Detail Page UX Review
Date: 2026-03-27
Pages reviewed: exhibit-a, exhibit-k, exhibit-m
Viewports: 375px, 768px, 1280px

## Executive Summary
[2-3 sentence overview of the density/readability concern and top issues]

## Findings by Category

### 1. Typography and Readability
[Font sizes, line-height, font-weight, contrast. Reference specific CSS properties like `.page-exhibit-detail .exhibit-quote p { font-size, line-height }`. Rate severity: high/medium/low.]

### 2. Content Density and Spacing
[Margins, padding between sections. Are exhibit-quote, exhibit-section, exhibit-resolution blocks too tightly packed? Reference specific gap/margin values.]

### 3. Visual Hierarchy
[Are headings distinct enough from body text? Is the meta-header visually separated from body? Does the eye have clear entry points?]

### 4. Whitespace and Breathing Room
[Container max-width, section padding, overall page feel. Compare across viewport widths.]

### 5. Accessibility
[Color contrast ratios (estimate from screenshots), heading structure (h1 -> h2 flow), semantic HTML concerns, touch target sizes at 375px.]

### 6. Responsive Behavior
[How does the layout adapt? Are tables readable at 375px? Do quotes break well? Any overflow issues?]

## Prioritized Recommendations
[Numbered list, highest impact first. Each item: what to change, which CSS selector, suggested direction. Do NOT provide exact fix code — just actionable guidance.]

## Screenshots Reference
[List all 9 screenshots with viewport labels]
```

For each finding:
- Be SPECIFIC: name the CSS selector, the current value, and what is wrong
- Rate severity: high (actively hurts readability), medium (noticeable), low (polish)
- Note which viewport(s) are affected

This is a REVIEW task. Do NOT implement any fixes.
  </action>
  <verify>
    <automated>test -f .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/260327-nnz-REVIEW.md && grep -c "###" .planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/260327-nnz-REVIEW.md</automated>
  </verify>
  <done>Review document exists with all 6 categories populated, specific CSS references, severity ratings, and a prioritized recommendations list</done>
</task>

</tasks>

<verification>
- 9 screenshots captured (3 exhibits x 3 viewports)
- Review document has findings in all 6 categories
- Findings reference specific CSS selectors and values from main.css
- Recommendations are prioritized and actionable
- No code changes were made to the application
</verification>

<success_criteria>
User receives a structured review document that identifies why exhibit detail pages feel dense and hard to read, with specific CSS-level findings they can act on in a follow-up fix task.
</success_criteria>

<output>
After completion, create `.planning/quick/260327-nnz-run-full-ux-accessibility-and-appearance/260327-nnz-SUMMARY.md`
</output>
