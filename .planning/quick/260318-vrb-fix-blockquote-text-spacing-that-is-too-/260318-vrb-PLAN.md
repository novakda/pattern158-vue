---
phase: quick
plan: 260318-vrb
type: execute
wave: 1
depends_on: []
files_modified:
  - src/assets/css/main.css
autonomous: true
requirements: []
must_haves:
  truths:
    - "The .role span in testimonial attributions renders on its own line below the attribution name"
    - "The .role span in exhibit attributions renders on its own line below the attribution name"
    - "There is visible vertical space between the attribution name and the .role text"
  artifacts:
    - path: src/assets/css/main.css
      provides: "display: block and margin-top on .attribution .role for both page-testimonials and page-exhibit"
  key_links:
    - from: ".page-testimonials .attribution .role"
      to: "inline span element in attribution div"
      via: "display: block overrides inline default"
      pattern: "display:\\s*block"
---

<objective>
Fix attribution `.role` span display so it appears on its own line below the attribution name in blockquote testimonials.

Purpose: The `.role` span is currently inline, causing attribution text like "Chief of Learning Services, Electric Boat" to run directly into "in summary email to EB leadership" on the same line, reading as "Electric Boatin summary...". Making `.role` a block element with a small top margin gives it a dedicated line and clear visual separation.

Output: Two CSS rule additions in main.css — one for `.page-testimonials` and one for `.page-exhibit`.
</objective>

<execution_context>
@C:/main/pattern158-vue/.claude/get-shit-done/workflows/execute-plan.md
@C:/main/pattern158-vue/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add display:block and margin-top to .role in both attribution selectors</name>
  <files>src/assets/css/main.css</files>
  <action>
    In `src/assets/css/main.css`, make two targeted edits:

    1. At line 1890 — `.page-testimonials .attribution .role` — add two properties so the full rule reads:

    ```css
    .page-testimonials .attribution .role {
        display: block;
        margin-top: var(--space-xs);
        font-weight: 400;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }
    ```

    2. At line 2240 — `.page-exhibit .attribution .role` — same two additions:

    ```css
    .page-exhibit .attribution .role {
        display: block;
        margin-top: var(--space-xs);
        font-weight: 400;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }
    ```

    Do NOT touch the responsive breakpoint rules at lines ~3742 and ~3766 — those only override blockquote padding/font-size and have no .role selectors to fix.
  </action>
  <verify>
    <automated>grep -n "display: block" src/assets/css/main.css | grep -E "attribution|role"</automated>
  </verify>
  <done>Both `.attribution .role` selectors contain `display: block` and `margin-top: var(--space-xs)`. The role context text renders on a separate line from the attribution name on the testimonials page.</done>
</task>

</tasks>

<verification>
After the edit, confirm:
- `grep -n "display: block" src/assets/css/main.css` shows the new rules near lines 1890 and 2240
- `npm run build` (or `vite build`) completes without errors
</verification>

<success_criteria>
Visiting /testimonials, attribution blocks show the person's name on one line and their role/context (e.g., "in summary email to EB leadership") on a distinct line below with visible spacing. No runon inline text.
</success_criteria>

<output>
After completion, create `.planning/quick/260318-vrb-fix-blockquote-text-spacing-that-is-too-/260318-vrb-SUMMARY.md`
</output>
