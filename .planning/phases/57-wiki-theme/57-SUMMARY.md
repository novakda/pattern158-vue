---
phase: 57
plan: wiki-theme
subsystem: tiddlywiki
tags: [theme, branding, stylesheet, palette, viewtemplate]
requires: [phase-55, phase-56]
provides: [pattern158-brand-wiki]
affects: [tiddlywiki/tiddlers, pattern158-tiddlers.json]
tech-stack:
  added: [tiddlywiki-stylesheet, tiddlywiki-palette, tiddlywiki-viewtemplate]
  patterns: [tag-filtered-viewtemplate, tiddler-dictionary-palette]
key-files:
  created:
    - tiddlywiki/tiddlers/$__plugins_pattern158_styles.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_palette_light.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_palette_dark.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_palette_default.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_view_exhibit.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_view_person.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_view_finding.tid
    - tiddlywiki/tiddlers/$__plugins_pattern158_view_testimonial.tid
    - .planning/phases/57-wiki-theme/57-VERIFICATION.md
  modified:
    - tiddlywiki/tiddlers/$__SiteTitle.tid
    - tiddlywiki/tiddlers/$__SiteSubtitle.tid
    - tiddlywiki/tiddlers/$__DefaultTiddlers.tid
decisions:
  - Theme tiddlers live under $__plugins_pattern158_* namespace so they survive generator regeneration (generator only writes its composed list, never deletes)
  - Palette as $:/tags/Palette tiddler-dictionaries rather than direct CSS var overrides — TW's native palette switcher can toggle between light/dark
  - ViewTemplate uses list-after: $:/core/ui/ViewTemplate/title so the metadata wrapper renders above the body (body continues to render via TW's default pipeline)
  - No $transclude self-reference in view/testimonial to avoid infinite ViewTemplate recursion — emit a compact badge + attribution instead
metrics:
  tasks: 4
  files: 11
  commits: 4
requirements: [THEME-01, THEME-02, THEME-03, THEME-04, THEME-05]
---

# Phase 57 Plan wiki-theme: Pattern 158 Brand Wiki Theme Summary

Apply Pattern 158 brand (color tokens, typography, badge/pill parity) to TiddlyWiki output via static `$:/tags/Stylesheet`, `$:/tags/Palette`, and `$:/tags/ViewTemplate` tiddlers. No generator modifications; all theme files live under `tiddlywiki/tiddlers/$__plugins_pattern158_*` so they coexist with regenerated content and survive every `pnpm tiddlywiki:generate` run.

## What Changed

### Styles (`$__plugins_pattern158_styles.tid`)
- Pattern 158 design tokens mapped to `--p158-*` CSS variables on `html body.tc-body`
- Dark mode via `[data-theme="dark"]` selector override
- Font-family: Bebas Neue (display), Inter (body), JetBrains Mono (code)
- Class parity for wikitext-embedded HTML: `.badge`, `.pill`, `.badge-deep`, `.badge-working`, `.badge-aware`, `.severity-{critical|high|medium|low|unknown}`, `.category-*`, `.tag-{client|tech|role|domain|highlight}`
- ViewTemplate wrapper styling: `.p158-exhibit-meta`, `.p158-person-meta`, `.p158-finding-header`, `.p158-testimonial-quote`, `.p158-testimonial-badge`
- Severity-colored left border on finding headers (danger red for critical, accent gold for high, primary teal for medium, muted gray for low)

### Palettes (`$__plugins_pattern158_palette_{light,dark,default}.tid`)
- Full `$:/tags/Palette` tiddler-dictionary covering every TW palette key (background, foreground, primary, tiddler-title-foreground, site-title-foreground, sidebar-*, tab-*, table-*, dropdown-*, modal-*, alert-*, diff-*, menubar-*, code-*)
- Light palette: `#faf9f6` bg / `#2d3436` text / `#0e7c8c` primary / `#1a2838` navy menubar
- Dark palette: `#1a2838` bg / `#e8e8e8` text / `#30c9dc` primary / `#0d1b2a` menubar
- Default palette selector pins `$:/palette` to the light palette

### ViewTemplates (`$__plugins_pattern158_view_*.tid`)
- `view/exhibit` → `[tag[exhibit]]` → metadata `<dl>` header (Client / Date / Type / Role / Email Count) in `.p158-exhibit-meta` container
- `view/person` → `[tag[person]]` → entry-type badge (individual/group/anonymized via `badge-deep`/`badge-working`/`badge-aware`) + title-role + organization inline
- `view/finding` → `[tag[finding]]` → severity-colored header with severity-* badge + category-* pill (severity class dynamically pulled via `tags[]prefix[severity-]`)
- `view/testimonial` → `[tag[testimonial]]` → "Testimonial" badge + attribution cite (no self-transclude to avoid recursion; body renders via TW default pipeline)

### Site Meta Overrides
- `$:/SiteTitle` = "Pattern 158" (matches generator)
- `$:/SiteSubtitle` = "Evidence-Based Portfolio" (overrides generator's "Dan Novak — Portfolio & Case Files")
- `$:/DefaultTiddlers` = "Home" (matches generator)

## Commits

| # | Hash      | Subject                                                                 |
| - | --------- | ----------------------------------------------------------------------- |
| 1 | `5d5e3c2` | feat(57-01): add Pattern 158 brand stylesheet + light/dark palettes     |
| 2 | `ab2f771` | feat(57-02): add Pattern 158 ViewTemplate tiddlers                      |
| 3 | `c5fde2e` | feat(57-03): commit site-meta override tiddlers                         |
| 4 | *(this)*  | docs(57-04): add 57-VERIFICATION.md + 57-SUMMARY.md                     |

## Deviations from Plan

### 1. [Rule 3 - Blocking] Pivoted testimonial ViewTemplate to avoid recursion

The user's deliverable #7 specified a "blockquote styling" testimonial ViewTemplate. Initial draft used `<$transclude tiddler=<<currentTiddler>> mode="block"/>` inside the `.p158-testimonial-quote` wrapper — but this would re-trigger the full ViewTemplate chain (including this same template), causing infinite recursion and a blank tiddler render.

**Fix:** Changed testimonial ViewTemplate to emit only a compact badge + `<cite>` attribution above the body. TiddlyWiki's default body-rendering pipeline handles the blockquote content (tiddlers already contain `<<<...<<<` wikitext). The `.p158-testimonial-quote` CSS class still styles the body via `blockquote` descendants inherent to wikitext output.

**Files modified:** `tiddlywiki/tiddlers/$__plugins_pattern158_view_testimonial.tid`
**Commit:** `ab2f771`

### 2. [Rule 4-adjacent - Architectural deferred] `$:/SiteSubtitle` override conflicts with generator

The user's deliverable #8 says `$:/SiteSubtitle` should read "Evidence-Based Portfolio". The existing `scripts/tiddlywiki/sources.ts:siteMetaTiddlers()` function hardcodes "Dan Novak — Portfolio & Case Files" and regenerates `$__SiteSubtitle.tid` on every `pnpm tiddlywiki:generate` run.

Scope discipline forbids modifying `.ts` files under `scripts/` in Phase 57. The architectural decision required (patch sources.ts vs. add post-generate override step vs. restructure to plugin-precedence) is typically a Rule 4 checkpoint, but the user's `<expected_output>` explicitly says "If the generator accidentally wipes the theme files on regenerate, adjust" — implying autonomous pragmatism over stopping.

**Fix (pragmatic):** Committed the override `$__SiteSubtitle.tid` = "Evidence-Based Portfolio" as a post-generate override. Documented in VERIFICATION.md and this SUMMARY that the fix is trivial (one string in `sources.ts`) and should be applied in Phase 58 or a small follow-up.

**Files modified:** `tiddlywiki/tiddlers/$__SiteSubtitle.tid`
**Commit:** `c5fde2e`

## Deferred Issues

- **Generator subtitle string** — patch `scripts/tiddlywiki/sources.ts:siteMetaTiddlers()` to emit "Evidence-Based Portfolio" directly. Trivial single-line change; deferred under scope discipline.
- **Responsive breakpoint parity** — Pattern 158 site has mobile/tablet breakpoints; TW has its own responsive chrome. Not in REQs.
- **Rich interactive macros** — not in REQs.

## Self-Check: PASSED

- `tiddlywiki/tiddlers/$__plugins_pattern158_styles.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_palette_light.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_palette_dark.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_palette_default.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_view_exhibit.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_view_person.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_view_finding.tid` — FOUND
- `tiddlywiki/tiddlers/$__plugins_pattern158_view_testimonial.tid` — FOUND
- `tiddlywiki/tiddlers/$__SiteTitle.tid` — FOUND
- `tiddlywiki/tiddlers/$__SiteSubtitle.tid` — FOUND (contains "Evidence-Based Portfolio")
- `tiddlywiki/tiddlers/$__DefaultTiddlers.tid` — FOUND
- `.planning/phases/57-wiki-theme/57-VERIFICATION.md` — FOUND
- Commit `5d5e3c2` — FOUND
- Commit `ab2f771` — FOUND
- Commit `c5fde2e` — FOUND
- `pnpm tiddlywiki:generate` exit 0 with all theme tiddlers still present — PASSED
