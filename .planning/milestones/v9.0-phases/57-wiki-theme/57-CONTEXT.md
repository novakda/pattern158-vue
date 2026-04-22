# Phase 57: Wiki Theme (Pattern 158 brand) - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Apply Pattern 158 brand (color tokens, typography, layout) to TiddlyWiki output via TW CSS tiddlers + ViewTemplate customizations. Tiddlers themselves (content) do NOT change. Theme is achieved through `tiddlywiki/config/` CSS + site-meta tiddlers that get bundled into the build output.

Out of scope:
- Generator modifications (Phase 54 scope).
- Deployment pipeline (Phase 58 scope).

</domain>

<decisions>
## Implementation Decisions

### Brand Source of Truth
- Color palette + typography extracted from `src/assets/css/main.css` `:root` design tokens.
- Key tokens to mirror:
  - `--color-primary: #0e7c8c` (teal)
  - `--color-primary-on-dark: #20b8cc`
  - `--color-accent: #8f6d00` (gold, darkened for AA)
  - `--color-background: #faf9f6` (light warm off-white)
  - `--color-text: #2d3436` (near-black)
  - `--color-heading: #1a2838` (navy)
  - `--font-heading: 'Bebas Neue', 'Arial Black', sans-serif`
  - `--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
  - `--font-mono: 'JetBrains Mono', 'Courier New', monospace`

### TiddlyWiki Theme Architecture
- **Location:** `tiddlywiki/config/` (git-tracked; Phase 58 will formalize as `tzk-style` structure).
- **Files produced:**
  - `tiddlywiki/config/theme/$__plugins_pattern158_theme.tid` — custom theme wrapper
  - `tiddlywiki/config/theme/styles.tid` — `$:/tags/Stylesheet` tagged CSS tiddler mapping Pattern 158 tokens to TW CSS variables
  - `tiddlywiki/config/view-templates/exhibit.tid` — `$:/tags/ViewTemplate` filtered to `[tag[exhibit]]`
  - `tiddlywiki/config/view-templates/person.tid` — filtered to `[tag[person]]`
  - `tiddlywiki/config/view-templates/finding.tid` — filtered to `[tag[finding]]`
  - `tiddlywiki/config/view-templates/testimonial.tid` — filtered to `[tag[testimonial]]`
  - `tiddlywiki/config/site-meta.tid` — `$:/SiteTitle`, `$:/SiteSubtitle`, `$:/DefaultTiddlers`

### Scope Pragmatism
- THEME-01 (color tokens) + THEME-02 (typography): shipped via `styles.tid`.
- THEME-03 (sidebar nav + topbar): simple — tag-based filter in `$:/DefaultTiddlers` or a topbar override. No heavy custom JS.
- THEME-04 (type-specific ViewTemplates): 4 ViewTemplate overrides (exhibit/person/finding/testimonial) — each a small wikitext template with type-specific structure.
- THEME-05 (badge/pill passthrough): a CSS tiddler that maps Vue's `.badge`, `.pill`, `.tag-*`, `.severity-*`, `.category-*` class names to the Pattern 158 colors.

### Integration Into generate.ts
- `scripts/tiddlywiki/sources.ts:siteMetaTiddlers` already returns a small array — extend it with a new function `brandThemeTiddlers()` that reads the static CSS/wikitext files from `tiddlywiki/config/` and emits them as `Tiddler[]`.
- Alternatively: leave the `tiddlywiki/config/` files as they are (TW will find them when `tiddlywiki --build` runs because they're in the `tiddlers/` directory). This is simpler and Phase 58 is where the build wiring formalizes.
- **Recommendation:** Option B — put the files at `tiddlywiki/tiddlers/$__plugins_pattern158_*.tid` so they're already in the build path. No generate.ts changes needed.

### Dark Mode
- Pattern 158 site has dark mode via `[data-theme="dark"]` attribute selectors. TiddlyWiki has its own light/dark plugin (`$:/palette`). For Phase 57, ship a Pattern 158 dark palette tiddler; users can toggle via TW's built-in palette switcher.
- Dark palette tokens from the Vue site's `[data-theme="dark"]` CSS rules (mirrored 1:1).

### Testing
- No unit tests for pure CSS/wikitext. Phase 58 build gate will verify the output HTML file loads the theme correctly.
- Phase 57 smoke gate: `pnpm tiddlywiki:generate` exit 0 AND generated output includes the theme tiddlers.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/assets/css/main.css` — full Pattern 158 design system (tokens + components).
- `scripts/tiddlywiki/sources.ts:siteMetaTiddlers()` — extension point for theme tiddlers if needed.

### Established Patterns
- Static theme files under `tiddlywiki/tiddlers/` get picked up automatically by `tiddlywiki --build`.

</code_context>

<specifics>
## Specific Ideas

- 2-3 plans:
  - Plan 57-01: Extract tokens + create `styles.tid` (THEME-01 + THEME-02 + THEME-05).
  - Plan 57-02: Create ViewTemplate tiddlers (THEME-04) + sidebar/nav meta (THEME-03).
  - Plan 57-03: Smoke gate + 57-VERIFICATION.md.

- All new files go under `tiddlywiki/tiddlers/` with `$__plugins_pattern158_*` naming so they're namespaced.

</specifics>

<deferred>
## Deferred Ideas

- Rich interactive TiddlyWiki macros — not in REQs.
- Responsive breakpoints — TW has its own; overrides deferred.

</deferred>
