# Domain Pitfalls — v8.0 Editorial Snapshot & Content Audit

**Domain:** Playwright-based SPA capture + HTML→Markdown editorial pipeline
**Project:** pattern158-vue (Vue 3 SPA on Cloudflare Pages)
**Researched:** 2026-04-19
**Overall confidence:** HIGH (Vue/Playwright/Turndown behavior is documented; project-specific claims verified against codebase)

Research lens: what causes a live-site capture pipeline to silently produce **incomplete, wrong, or unreviewable** Markdown when added to an existing Vue 3 + Vite + pnpm portfolio project. Each pitfall lists severity, prevention, and the phase that should address it.

---

## 1. Critical Pitfalls

*Would cause silent data loss, wrong content in the captured document, or output that cannot be used for editorial review.*

### CRIT-01: FAQ answers (and other content-behind-interaction) captured as empty
**What goes wrong:** `FaqAccordionItem.vue` renders the answer wrapper with `:hidden="!isOpen || undefined"`. The inner `<p>` elements are always in the DOM, but the wrapping `<div class="faq-answer">` carries the HTML `hidden` attribute when closed. Playwright's `innerText`, `textContent` via `.evaluate()` selecting visible text, or `page.locator(...).allInnerTexts()` will skip content inside `[hidden]`. Turndown run on `element.innerHTML` would *include* it — inconsistency between "what Playwright returned" and "what the editorial reader expected" is the bug.
Beyond FAQ: any content only present after a click (accordions, tabs, modals, "Show more", hover-disclosure) will be missing.
**Why it happens:** The v7.0 ABORT lesson #3 (no composition fidelity) applies inside the page too, not just across pages. "Rendered" means more than "route resolved" — component interactive state is also rendering.
**Consequences:** Editorial document is missing 14+ FAQ answers but looks complete. Dan reviews a partial document, makes decisions on incomplete evidence.
**Prevention:**
- Before capture, on FAQ route: programmatically open every `<button aria-expanded="false">` inside `.faq-accordion-item` (click sequentially or set `aria-expanded=true` + remove `hidden` via `page.evaluate`).
- Verify by asserting the count of visible answer paragraphs equals `faq.json` length × average paragraphs/answer.
- Use `element.innerHTML` (not `innerText`) as the Turndown input so `hidden` content is included whether or not the expansion step succeeded — then a subsequent verification counts answer blocks.
- Document a generic "reveal" step in the capture tool (selector list: `[aria-expanded="false"]`, `details:not([open])`, `[data-state="closed"]`). Extensible by page.
**Detection:** Post-capture assertion: for the FAQ route, Markdown contains at least N paragraphs where N = question count × min-expected-answer-paragraphs (use 1 to be safe).
**Severity:** CRITICAL
**Phase:** Capture phase (route-specific pre-capture hooks) + verification phase (post-capture content assertions)

### CRIT-02: FAQ filter bar hides most questions at page load
**What goes wrong:** `FaqPage` uses `FaqFilterBar` with `activeFilter` state. Depending on default state, only filtered items may be rendered in the accordion list. If the default active filter is a single category, 20+ FAQ items are not in the DOM at all.
**Why it happens:** Filter systems typically use `v-if` or `.filter()` before `v-for` to exclude non-matching items from the DOM entirely. This is distinct from `hidden` — items literally don't exist.
**Consequences:** Capture sees only the default-visible subset. Missing content is invisible to any scanner that counts nodes.
**Prevention:**
- Before capture, click the "All" filter pill (`[data-filter="all"]`) to ensure `activeFilter === null`.
- Assert `totalCount` matches rendered accordion count.
- Capture the filter pill labels once at the top of the FAQ section, then capture every question regardless of filter state.
**Detection:** Cross-check captured question count against `src/data/json/faq.json` length (should be equal).
**Severity:** CRITICAL
**Phase:** Capture phase (FAQ-specific preparation step)

### CRIT-03: SPA navigation "complete" before Vue router + Suspense + data have resolved
**What goes wrong:** Playwright's default `waitUntil: 'load'` or `'networkidle'` is not a reliable proxy for "Vue has rendered the route view." Common failure modes:
1. `load` fires on initial HTML; the Vue app hasn't mounted yet (empty `<div id="app">`).
2. `domcontentloaded` fires even earlier — same problem, worse.
3. `networkidle` waits for no network for 500 ms, but a lazy-loaded route chunk + webfont can race: networkidle fires *during* chunk eval, before the view component renders.
4. `<Suspense>` or async setup hooks resolve later than the router navigation event.
5. Route changes via `router-link` in an already-loaded SPA don't trigger any Playwright navigation event at all.
**Why it happens:** Playwright's navigation primitives are document-centric; Vue's rendering lifecycle is component-centric. There's no built-in bridge.
**Consequences:** Captured HTML is the previous route, or an empty shell, or a partially hydrated tree. Pages look plausible but may be missing entire sections.
**Prevention:** Use a content-based readiness signal, not a navigation signal:
- After every `page.goto(url)` or in-SPA navigation, `await page.waitForSelector('main h1', { state: 'visible' })` or similar per-route known-good selector.
- For in-SPA navigation, wait for URL change AND known selector AND absence of loading skeletons.
- As a belt-and-braces option, `await page.waitForFunction(() => document.fonts.ready)` before capture so text layout is stable (not required for DOM content, but good for screenshots).
- Use per-route selector manifest (e.g., HomePage → `section.home-hero`, FAQPage → `.faq-accordion-item`, ExhibitDetailPage → `h1.exhibit-title`) keyed off the route.
**Detection:** Before Turndown, assert the captured root element contains >N characters of text. If a page is empty, abort with a loud error rather than writing an empty section.
**Severity:** CRITICAL
**Phase:** Capture phase (core waitFor strategy, route-selector manifest)

### CRIT-04: Dynamic exhibit slug failures silently produce empty sections
**What goes wrong:** `src/data/json/exhibits.json` is the source of 15 exhibit slugs. If the tool iterates slugs and one doesn't resolve on the live site (typo, unpublished, Cloudflare cache returning 404 HTML, redirect), naive capture writes an empty section to the Markdown and moves on.
**Why it happens:** SPA 404s often return HTTP 200 with a NotFoundPage component (as `NotFoundPage.vue` exists in this project). HTTP status is not a reliable failure signal for SPAs.
**Consequences:** Editorial document says "Exhibit K" and is blank below it. Reviewer assumes exhibit K has no content.
**Prevention:**
- After navigating to each exhibit route, assert presence of a known-good selector (e.g., `.exhibit-detail h1` or `[data-exhibit-type]`).
- If missing, assert presence of NotFoundPage signature; if found, record the failure in a capture-errors section at the top of the Markdown document rather than omitting.
- Bound per-page capture with a timeout (e.g., 30s) and fail-loud, not fail-silent.
- Output a summary at the end of the Markdown: "Captured 15/15 exhibits" or "Captured 14/15 — Exhibit K failed (404)".
**Detection:** The capture tool's own exit reporting; CI-style summary line.
**Severity:** CRITICAL
**Phase:** Orchestration phase (per-route error handling + summary reporting)

### CRIT-05: Cloudflare edge cache serves stale content; capture doesn't reflect latest deploy
**What goes wrong:** Cloudflare Pages caches HTML/assets at the edge. If Dan just pushed and captures immediately, the edge may still serve the previous version. Conversely, if the edge cached an old version weeks ago and nothing invalidated it, captures are outdated. Captures are also non-deterministic across POPs: different runs can hit different cache tiers.
**Why it happens:** CDNs are caches; staleness is a default property, not a bug.
**Consequences:** Editorial decisions made against a version of the site that doesn't match git HEAD; rebuild direction derived from wrong content.
**Prevention:**
- Bypass cache on capture: append a cache-buster query (`?t=<timestamp>`) to each URL, AND set request header `Cache-Control: no-cache` AND `Pragma: no-cache`. Cloudflare will not cache URLs with most query strings by default, but being explicit is safer.
- Log the `cf-cache-status` response header for every capture; if any say `HIT` or `STALE`, warn.
- Record the deployed git SHA (fetch from `<meta name="build-sha">` if the build injects one, or from a known `/version.json` endpoint) at capture time and embed in the Markdown frontmatter.
- Optionally: capture against `localhost:4173` (`pnpm preview`) instead of the live site when absolute reproducibility matters. The v8.0 premise is live capture, but a local-preview mode is useful fallback.
**Detection:** Compare the captured content against a second capture 60s later; if they differ, cache is in play.
**Severity:** CRITICAL (for editorial fidelity) / MODERATE (for any single capture)
**Phase:** Capture phase (HTTP headers + URL strategy); Orchestration phase (version stamping)

### CRIT-06: Cloudflare bot/rate-limit protection blocks or fingerprints Playwright
**What goes wrong:** Cloudflare has a "Bot Fight Mode" and managed challenges that can present CAPTCHAs or return interstitials to automated browsers. Playwright's Chromium has known bot-detection signals (Navigator.webdriver, headless UA). If Pages has any security layer enabled, the capture gets an interstitial instead of content.
**Why it happens:** Cloudflare is an adversarial environment by design for automation.
**Consequences:** Captured content is a CAPTCHA page rendered as Markdown.
**Prevention:**
- Cloudflare Pages default project settings usually do NOT enable Bot Fight Mode for Pages deployments, but the zone-level setting can override. Verify in the Cloudflare dashboard before building the tool.
- Use headful mode (non-headless) for capture — reduces fingerprint surface significantly.
- Set a realistic User-Agent string (not the default Playwright one).
- Rate-limit captures: 1 request per 2–5s, not parallel per-route. 9 routes × 15 exhibits = 24 captures, which at 3s each is 72s total — acceptable for an editorial tool.
- Abort early if any response is < 200 bytes or contains known interstitial markers (`"Just a moment"`, `"cf-browser-verification"`).
**Detection:** Response size sanity check; screenshot-on-failure; look for `cf-ray` header on success.
**Severity:** CRITICAL (if triggered — total failure) / LOW (probability on Pages default config)
**Phase:** Capture phase (headful + UA + rate limit); Verification phase (response sanity)

### CRIT-07: Markdown output is non-deterministic → unusable for diffing between runs
**What goes wrong:** Editorial review often iterates — capture, edit, re-capture, see what changed. If the captured Markdown changes run-to-run due to non-content sources, every diff is 80% noise and 20% signal. Sources of non-determinism:
- Analytics scripts injecting content client-side with per-session IDs
- `Math.random()` keys, UUIDs in `v-bind:key`
- Timestamps rendered from `Date.now()` in any component
- `Object.keys()` order on iteration (safe in V8 but not spec-guaranteed across engines)
- Server-side A/B variants (not applicable here, but flag it)
- Image srcset with cache-busted URLs changing per-build
- Turndown's handling of collapsible whitespace when the DOM has different whitespace each run
**Why it happens:** Browsers and SPAs have many "live" behaviors; none were designed for content-stable scraping.
**Consequences:** `git diff` between captures becomes useless for editorial review.
**Prevention:**
- Before Turndown, strip known-noisy elements: `<script>`, `<style>`, `<noscript>`, any element with `data-analytics`, iframes, tracking pixels.
- Strip Vue-internal attributes: `data-v-*` (scoped style attributes), `v-cloak` artifacts. These change across builds as the hash suffix changes.
- Normalize whitespace in Turndown output (collapse multiple blank lines to max 2).
- Do not include capture timestamps *inside* the body of the Markdown (put them in frontmatter where Obsidian treats them as metadata, not prose). Consider making the frontmatter timestamp stable across "same content" runs — e.g., only update if the body changed.
- Sort any internally-unordered collections deterministically before emitting (e.g., if the tool outputs a "broken links" summary, sort alphabetically).
**Detection:** Run the tool twice in succession and `diff` the outputs. Any diff = non-determinism to hunt down.
**Severity:** CRITICAL (for editorial workflow usefulness)
**Phase:** Rendering phase (Turndown config + DOM sanitization); Verification phase (double-run diff test)

---

## 2. Moderate Pitfalls

*Would degrade editorial usefulness; captured document is usable but noisy, confusing, or lossy.*

### MOD-01: NavBar + FooterBar duplicated 24 times in captured Markdown
**What goes wrong:** Every route on this site renders `<NavBar>` and `<FooterBar>`. With 9 top-level routes + 15 exhibit detail routes = 24 captures, the unchanged nav + footer appears 24 times. If each is ~30 lines of Markdown, that's 720 lines of duplicate navigation content — roughly half the document for content-light pages.
**Why it happens:** Naive `document.body.innerHTML` → Turndown pipeline captures everything.
**Prevention:**
- Strip `<header>`, `<nav>`, `<footer>`, `.nav-bar`, `.footer-bar`, and `.skip-link` selectors before Turndown runs on each page.
- Capture NavBar and FooterBar **once** at the top (optional "Site Chrome" section) or omit entirely if Dan confirms they're not part of editorial review scope.
- Target `<main>` for content capture; if absent, fall back to `document.body` minus the stripped regions.
**Detection:** Manual scan of the output — if the phrase "Case Files" or "philosophy" appears > N times where N = expected mentions, over-capture is likely.
**Severity:** MODERATE (significantly impairs readability but doesn't lose content)
**Phase:** Rendering phase (DOM sanitization selector list)

### MOD-02: Readability.js strips portfolio content it doesn't recognize as article body
**What goes wrong:** `@mozilla/readability` is trained on news articles. Portfolio pages have hero sections, card grids, stat bars, sidebars — Readability may treat these as "chrome" and remove them. Testimonial quotes, specialty cards, FAQ pills can vanish.
**Why it happens:** Readability uses heuristics for "dense prose = content, sparse layout = chrome." Portfolio design inverts this assumption.
**Prevention:**
- **Do not use Readability.js for this project.** Use an explicit selector strategy: capture `<main>`, strip known chrome (see MOD-01), apply Turndown.
- If Readability were tried as a fallback, always cross-check output length against raw `<main>` text length — if Readability output is <50% of the raw, suspect over-stripping.
**Severity:** MODERATE (depending on which content it drops)
**Phase:** Stack decision phase (explicit rejection of Readability in STACK.md)

### MOD-03: Missing `<main>` on some pages → empty capture or full-body capture
**What goes wrong:** The capture tool defaults to `<main>` as the content root. If a page's template wraps content in a different landmark (`<article>`, a `<section>` without `<main>`), the selector fails.
**Why it happens:** Vue templates are flexible; not every page is required to have `<main>`. The project has an `App.vue` shell likely wrapping `<router-view>` in `<main>` once, but individual pages vary.
**Prevention:**
- Audit the rendered DOM once: on a real capture run, log the structure of `document.body` for each route. If every route has a single consistent `<main>`, use it. If not, establish a selector manifest keyed by route.
- Fallback strategy: if `<main>` not found, capture `<body>` minus chrome selectors, and log a warning.
**Detection:** Per-route content-length sanity check (see CRIT-03 detection).
**Severity:** MODERATE
**Phase:** Research phase (DOM audit) + Capture phase (selector manifest)

### MOD-04: Turndown heading level drift when Markdown is composed across routes
**What goes wrong:** Each page's `<h1>` becomes `# Title` in Markdown. Concatenating 24 pages produces 24 `# Title` lines — Obsidian (and Markdown outline viewers) treat them all as top-level. If the tool instead writes `# Route Name` as an H1 per route, the page's internal H1 becomes an H2, and all `<h2>` become H3s, and so on. If not done consistently, heading semantics drift.
**Why it happens:** Flat concatenation vs. nested structure has different heading-level requirements; the choice has to be made and enforced.
**Prevention:**
- Decide structure up front. Recommended: `# Pattern 158 Site Capture` (document title, H1 once), `## Route: /home` (per-route H2), page's content demoted one level (every `<h1>` → H2-equivalent is a problem because it collides — so demote to H3). Use Turndown's `headingStyle` with a custom rule that offsets all heading levels by the route's nesting depth.
- Or: use a thematic break (`---`) between routes, keeping original heading levels within each section. Simpler, less semantic.
- Lock the choice in a design doc; test with a "document has one H1" assertion.
**Severity:** MODERATE (affects Obsidian outline navigation — a core editorial review affordance)
**Phase:** Rendering phase (heading offset rule); Design phase (document structure decision)

### MOD-05: Turndown drops or mangles nested lists
**What goes wrong:** Known Turndown issues include:
- Nested `<ol>` inside `<ul>` losing indentation or ordinal markers
- `<li>` containing block elements (`<p>`, `<div>`) being flattened
- Whitespace between `</li>` and next `<li>` becoming significant
**Why it happens:** Turndown is a heuristic translator; complex nested HTML has ambiguous Markdown representations.
**Prevention:**
- Check the rendered site for nested lists. The PhilosophyPage, MethodologyStep components, and exhibit content may have them.
- Configure Turndown with `bulletListMarker: '-'` and `listIndent: '  '` explicitly (don't rely on defaults).
- Test round-trip: render known-good HTML through Turndown, parse Markdown back with a Markdown renderer, compare structure. If it's lossy, use `turndown-plugin-gfm` or custom rules.
- For tables (exhibit data), use `turndown-plugin-gfm` for GFM table support, since base Turndown doesn't handle `<table>` at all.
**Severity:** MODERATE
**Phase:** Rendering phase (Turndown configuration + plugin set)

### MOD-06: Tables with `rowspan`/`colspan` or complex formatting broken by Turndown
**What goes wrong:** GFM tables don't support row/column spans; Turndown's GFM plugin either crashes, flattens, or drops content. Exhibit tables on this site use personnel/technologies/findings data — check if any use spans.
**Why it happens:** Markdown table syntax is strictly rectangular.
**Prevention:**
- Audit rendered tables for spans. If found, capture as HTML blocks in Markdown (Obsidian renders HTML inline) rather than converting to Markdown tables. Turndown's `keep` rule can preserve `<table>` as-is.
- Configure Turndown with `keep: ['table']` for tables that exceed GFM's expressiveness, or make a custom rule.
- Desktop/mobile layouts differ on this site (findings have a mobile card view); capture in desktop viewport (`1280x800`) to get the table representation, not the cards.
**Severity:** MODERATE (depends on how many tables are complex)
**Phase:** Rendering phase (table handling strategy)

### MOD-07: DOM order ≠ visual order with flexbox/grid `order` or absolute positioning
**What goes wrong:** If any component uses CSS `order`, `flex-direction: row-reverse`, `grid-template-areas` with visual rearrangement, or absolute positioning, the DOM (source) order does not match what a human reading top-to-bottom, left-to-right sees. Turndown walks DOM order, so the Markdown reading order will be wrong.
**Why it happens:** CSS can visually reorder content without changing DOM.
**Project-specific check:** A quick grep for `order:` or `order-` in scoped styles and design tokens is worth doing. The site's design system mostly uses flow layout, but HomePage and stats bars might use grid.
**Prevention:**
- Grep the source for `order:` (CSS property), `flex-direction: *-reverse`, `position: absolute`, `grid-template-areas`. Audit each hit for visual-vs-DOM order mismatch.
- Where mismatch exists, fix the source if feasible (DOM order should match visual order for accessibility anyway), or document as a capture caveat.
- Editorial doc should note any route where capture order ≠ visual order.
**Detection:** Manual spot-check: scroll the page, compare to captured Markdown for the same page.
**Severity:** MODERATE (content present but read in wrong order)
**Phase:** Research phase (audit CSS); Capture phase (document known exceptions)

### MOD-08: Webfonts still loading → text positional shift (screenshots only, not text capture)
**What goes wrong:** If capture also includes screenshots, webfont loading can cause Flash of Unstyled Text / shifted layout, producing misleading visuals.
**Why it happens:** Fonts are async.
**Prevention:** `await page.evaluate(() => document.fonts.ready)` before any screenshot. No impact on text capture.
**Severity:** MODERATE (for screenshots) / NONE (for text)
**Phase:** Capture phase (if screenshots are in scope)

### MOD-09: Smart quotes and em/en dashes: preservation vs. normalization
**What goes wrong:** The exhibits.json source uses `'` (right single quote / U+2019) in prose — visible in the very first exhibit: "I'd consider the last couple days a success". The rendered HTML preserves it; Turndown's default behavior is to preserve it in Markdown. But if any part of the pipeline coerces through ASCII, these become `'` or worse `â€™` (mojibake). Similarly for em dashes (`—`, U+2014), en dashes (`–`), and ellipsis (`…`).
**Why it happens:** Encoding mismatches anywhere in the toolchain (browser → Node → file write).
**Prevention:**
- Ensure all I/O is explicit UTF-8: `fs.writeFile(path, content, { encoding: 'utf8' })`, Playwright default is UTF-8 for text extraction, Node's default is UTF-8 on Linux/WSL2.
- Do not call `.normalize()` / `.toASCII()` on content anywhere in the pipeline.
- Sanity check: after capture, grep the output for `â€` or `Â` — these are the telltales of double-UTF-8 encoding (mojibake).
- Do not "smart-quote" or "dumb-quote" automatically; preserve what's on the site. If Dan wants to normalize during editorial, that's a separate editorial decision, not an automated transform.
**Severity:** MODERATE (readable but ugly) / CRITICAL if mojibake (unreadable)
**Phase:** Rendering phase (UTF-8 explicit) + Verification phase (mojibake grep)

### MOD-10: Obsidian vault write fails silently or overwrites edits in progress
**What goes wrong:** Writing to a path outside the repo (`/c/main/Obsidian Vault/...` per global CLAUDE.md) has several failure modes on WSL2:
- Path doesn't exist → `ENOENT`. Parent directory missing.
- Permissions: WSL2 `/c/` mounts via `drvfs`; permissions model differs from native Linux. Writes usually work but symlinks and `chmod` don't.
- Obsidian has the file open and is writing to it: Obsidian auto-saves, so captures during an editing session can cause a write race — Obsidian's save could overwrite the capture's save, or vice versa.
- File locking: Windows holds file handles more aggressively than Linux; Obsidian might lock the file briefly during its save cycle.
- Path with spaces (`Obsidian Vault`) requires correct escaping in shell commands.
**Why it happens:** WSL2 + Obsidian + filesystem interop is a three-way interaction surface.
**Prevention:**
- Require the output path as a config value; fail loud with a specific error if the directory doesn't exist (don't auto-create the vault).
- Write to a `.tmp` file in the vault, then atomic rename to the final name (`fs.rename` is atomic on same filesystem).
- Before writing, check if the target file exists and is newer than the capture start time — if so, warn and require a `--force` flag (protects against overwriting Dan's in-progress edits).
- Output path from config, not hardcoded.
- Document the "close Obsidian before re-running" convention, or at least "don't have the target file open."
**Detection:** Post-write, re-read the file and byte-compare against what was written. If mismatch, error.
**Severity:** MODERATE (data loss in edge cases)
**Phase:** Writer phase (atomic write, staleness check, explicit config)

### MOD-11: Images captured as base64 inflate file size; URLs go dead later
**What goes wrong:** Turndown default for `<img>` is `![alt](src)`. If `src` is a relative path on the live site (`/images/foo.png`), the captured Markdown has broken image references when viewed outside the site context. If the tool rewrites to absolute URLs (`https://pattern158.solutions/images/foo.png`), the images work — until the site is rebuilt and the paths change. Inline base64 inflates the Markdown to multi-megabyte and makes diffs useless.
**Why it happens:** Portable Markdown and source Markdown have different image-handling needs.
**Prevention:**
- For editorial review, prefer **absolute URLs** — Obsidian can display them inline, they stay viewable as long as the live site is up.
- Add alt-text preservation as the fallback (never lose `alt`).
- Do NOT inline as base64 (breaks the determinism goal and bloats diffs).
- Optional: download referenced images to a sibling `_assets/` folder in the vault and rewrite to local paths. More complex; only worth it if the editorial horizon is long.
- Document the choice clearly in a header comment of the output.
**Severity:** MODERATE (editorial usefulness depends on image context)
**Phase:** Rendering phase (Turndown image rule); Writer phase (if downloading assets)

### MOD-12: Inline code and whitespace-around-code mangled by Turndown
**What goes wrong:** Turndown default preserves inline code (`<code>` → `` `code` ``), but:
- Whitespace before/after inline code can be collapsed or extended depending on surrounding context.
- `<code>` inside `<pre>` should become a fenced code block; sometimes becomes indented code.
- `<code>` with HTML entities (`&lt;`) should decode to `<` in the backtick block.
**Why it happens:** Markdown's code semantics are context-sensitive.
**Prevention:**
- Configure Turndown: `codeBlockStyle: 'fenced'`, `fence: '```'`.
- Test with known-good fixture HTML containing code (e.g., from exhibit content that mentions technical terms in `<code>`).
- Preserve language hints if the source has them (`<code class="language-ts">` → ```` ```ts ````).
**Severity:** MODERATE (technical-exhibit readability)
**Phase:** Rendering phase (Turndown config)

### MOD-13: Capture run hits production and skews analytics / triggers alerts
**What goes wrong:** If pattern158.solutions has analytics (GA, Plausible, Cloudflare Analytics), capture runs inflate pageview counts. If anything alerts on traffic spikes (unlikely on a portfolio site but worth flagging), alerts fire.
**Why it happens:** Automated browsers look like real users to analytics.
**Prevention:**
- Set a distinctive UA (`pattern158-editorial-capture/1.0 (playwright)`) so analytics can filter it out.
- In the capture tool, block analytics scripts via `page.route()` — intercept requests to known analytics domains (google-analytics, plausible, cloudflare-insights) and abort. Side benefit: faster captures, reduces determinism issues (CRIT-07).
**Severity:** MODERATE (cosmetic — analytics pollution)
**Phase:** Capture phase (request interception)

---

## 3. Minor Pitfalls

*Cosmetic or preferential; don't break editorial review but make it less polished.*

### MIN-01: Excess blank lines between sections
**What:** Turndown can emit 3+ blank lines where 1 or 2 suffice. Not a bug — heuristic choices.
**Prevention:** Post-process Markdown: collapse 3+ newlines to 2.
**Severity:** MINOR
**Phase:** Rendering phase (post-processor)

### MIN-02: Internal anchor links (`href="#section-id"`) go dead across documents
**What:** On the live site, `[Jump to section](#findings)` works. In the captured Markdown, if sections are flattened or renamed, the anchor doesn't resolve.
**Prevention:** Either rewrite anchors to point at the Markdown heading slug (use `github-slugger`, already installed in package.json), or strip anchor-only links. Document the choice.
**Severity:** MINOR
**Phase:** Rendering phase

### MIN-03: ARIA-only content (e.g., `aria-label` on icons) not captured
**What:** `<button aria-label="Close">×</button>` — Turndown captures `×`, loses the label. For editorial review, icon buttons mostly don't have content to edit, so this is fine.
**Prevention:** If important, custom Turndown rule to prefer `aria-label` over text content for icon-only buttons. Probably not needed.
**Severity:** MINOR
**Phase:** N/A unless user reports missing content

### MIN-04: Scoped style attributes (`data-v-<hash>`) leak into output
**What:** Vue SFCs with `<style scoped>` add `data-v-abc123` to every element. Turndown drops these (it drops attributes it doesn't know). But custom rules preserving HTML may include them.
**Prevention:** Strip `data-v-*` attributes in DOM sanitization step before Turndown.
**Severity:** MINOR
**Phase:** Rendering phase (DOM sanitization)

### MIN-05: Route order in capture arbitrary
**What:** Iterating over `exhibits.json` gives JSON-file order. NavBar order may differ. If the Markdown document is expected to match "reading the site as a visitor would," NavBar order is the right source.
**Prevention:** Define capture order explicitly: Home → NavBar routes in NavBar order → exhibit detail pages in CaseFilesPage order. Document in tool config.
**Severity:** MINOR (affects review flow, not content)
**Phase:** Orchestration phase

### MIN-06: No "last captured" metadata embedded
**What:** Dan can't tell when the Markdown was last generated.
**Prevention:** Frontmatter with `captured_at`, `source_url`, `site_version_sha` (if available), `tool_version`.
**Severity:** MINOR
**Phase:** Writer phase (frontmatter generator)

---

## 4. Project-Specific Warnings

*Pitfalls specific to the pattern158-vue codebase and its live deployment.*

### P158-01: FAQ accordion is the flagship behind-interaction content
**Why it matters:** 27 FAQ items (14 original + 13 vault-merged) are the densest prose on the site after exhibit details. Missing them in capture loses a disproportionate amount of Dan's voice and positioning.
**Specific behavior:** `FaqAccordionItem.vue:39-48` wraps the answer in a `<div>` with `:hidden="!isOpen || undefined"`. Inner paragraphs always exist in DOM. The filter bar (`FaqPage`) also filters items out via reactive state.
**Two actions required before capture:**
  1. Click "All" filter (`[data-filter="all"]`)
  2. Open every accordion (`.faq-accordion-item:not(.is-open) .faq-accordion-trigger[aria-expanded="false"]` → click each, or use the `is-open` class presence as the idempotency check)
**Verification:** Captured Markdown should contain the `answer` text of every item in `src/data/json/faq.json`. Add a post-capture assertion.
**Severity:** CRITICAL → see CRIT-01

### P158-02: Exhibit detail pages have desktop-only table variants
**Why it matters:** v5.1 added personnel/technologies/findings mobile card layouts matching the findings pattern. Desktop (≥ certain breakpoint) renders `<table>`; mobile renders stacked cards. The two versions carry the same data but *different* HTML structures. Capturing both duplicates; capturing only mobile loses the tabular relationships; capturing only desktop matches how a reviewer looking for "the data" would expect to see it.
**Action:** Capture at desktop viewport (`1280x800` or wider) so tables are used. Flag mobile-only content like entryType styling that might not have a desktop equivalent in the same detail.
**Severity:** MODERATE (content present either way, but structure matters for tables)

### P158-03: Exhibits are data-driven; the JSON is the source, but the rendered output is the truth
**Why it matters:** v7.0 ABORT lesson — data modules alone cannot reconstruct the rendered page. 15 exhibits × variable number of sections (text, table, timeline, metadata, flow, personnel, technologies, findings) × conditional rendering (sectionHasContent guard from v2.1) means the DOM is the ground truth. If the tool tries to "shortcut" by reading JSON directly, it will re-create the v7.0 failure mode.
**Action:** Never fall back to reading JSON for exhibit content. The whole point of v8.0 is to capture rendered output. Document this invariant in the tool.
**Severity:** CRITICAL (for getting v8.0 right vs. repeating v7.0's mistake)

### P158-04: Pages listing (audited: `src/pages/`)
Actual routes for capture planning:
  - `/` (HomePage)
  - `/philosophy` (PhilosophyPage)
  - `/technologies` (TechnologiesPage)
  - `/case-files` (CaseFilesPage) + 15 exhibit detail slugs
  - `/faq` (FaqPage)
  - `/contact` (ContactPage)
  - `/accessibility` (AccessibilityPage)
  - `/review` (ReviewPage) — present in pages/
  - `/personnel-diag` (PersonnelDiagPage) — likely internal/debug; decide whether to include
**Action:** Include a route manifest in the tool config, not an auto-discovery crawler. Explicit list = reproducible. Skip `/personnel-diag` unless Dan confirms it's for editorial review.
**Severity:** MINOR (configuration clarity)

### P158-05: NotFoundPage returns 200 OK (SPA default)
**Why it matters:** See CRIT-04. Bad slug → NotFoundPage renders → HTTP 200 → scraper thinks it succeeded.
**Action:** Known selector assertion per route (e.g., exhibit detail must have `[data-exhibit-type]` or `.exhibit-label`). If selector absent, treat as failure.
**Severity:** CRITICAL → see CRIT-04

### P158-06: Theme toggle (dark/light) affects rendered colors, not content
**Why it matters:** Not a capture problem (colors aren't in Markdown), but screenshot captures would vary.
**Action:** If screenshots included, pin theme via `localStorage` in a `page.addInitScript()` hook so runs are deterministic.
**Severity:** MINOR (only applies if screenshots are in scope)

### P158-07: `pnpm build` runs `build:markdown` which runs v7.0's `scripts/markdown-export/index.ts`
**Why it matters:** v7.0 was aborted, but `package.json` still has `"build": "vue-tsc -b && vite build && pnpm build:markdown"`. The v8.0 tool must not collide with or clobber the (retained but dormant) v7.0 output. They should occupy different directories.
**Action:** v8.0 tool lives in `scripts/editorial/` (per ABORT-NOTICE.md recommendation), writes to the Obsidian vault (external path), not to the repo. Zero collision with `scripts/markdown-export/`.
**Severity:** MINOR (already anticipated in ABORT-NOTICE.md)

### P158-08: `github-slugger` and `yaml` already in devDeps — reuse them
**Why it matters:** No need to add new deps for slug generation or YAML frontmatter. Reuse what Phase 38 shipped.
**Action:** v8.0 writer imports `github-slugger` for heading slugs (useful if anchor rewriting, MIN-02) and `yaml` for frontmatter.
**Severity:** MINOR (efficiency)

### P158-09: Playwright 1.58 already installed with browsers provisioned for tests
**Why it matters:** No new browser installs needed; piggyback on the existing playwright install.
**Action:** Use `import { chromium } from 'playwright'`. Consider launching with `channel: 'chromium'` and headful during development, headless for CI-like runs.
**Severity:** MINOR (efficiency)

### P158-10: The live site `pattern158.solutions` is not Wrangler preview; capture URL must be the production URL
**Why it matters:** The repo's `pnpm preview` runs `wrangler dev` — that's local Cloudflare Workers simulation, not the deployed site. Editorial review is of the live deployed artifact.
**Action:** Config default: `https://pattern158.solutions`. Allow override to `http://localhost:4173` or wrangler dev for local testing of the capture tool itself.
**Severity:** MINOR (config clarity)

### P158-11: The Obsidian vault path is `/c/main/Obsidian Vault/` on this machine (WSL2)
**Why it matters:** Hardcoding this path couples the tool to Dan's machine. Other contributors / CI runs fail.
**Action:** Config file or env var (`EDITORIAL_VAULT_PATH`). Default to a repo-local `.planning/editorial-captures/` if vault path not configured. Ensures tool is portable.
**Severity:** MODERATE (portability)

### P158-12: Cloudflare Pages may rewrite `/some-route` to `/index.html` (SPA fallback)
**Why it matters:** Standard SPA deployment: any unknown path serves index.html which the SPA router then handles. This means the HTTP response for `/case-files/exhibit-a` is byte-identical to `/` initially — the URL-specific content is JS-rendered. Confirms that `goto + waitForSelector` is the right pattern; URL-based HTTP checks are useless.
**Action:** Do not use HTTP status or response body inspection to validate "page loaded." Always use DOM-based checks after JS execution.
**Severity:** MODERATE → addressed by CRIT-03 prevention

---

## 5. Prevention Matrix

| Pitfall | Severity | Phase | Verification approach |
|---|---|---|---|
| CRIT-01 FAQ answers behind accordion | CRITICAL | Capture | Post-capture: answer count matches `faq.json` item count |
| CRIT-02 FAQ filter hides items | CRITICAL | Capture | Set filter to "All" before capture; assert rendered count = total |
| CRIT-03 Navigation completes before Vue renders | CRITICAL | Capture | Per-route `waitForSelector` of known-good selector; content-length sanity check |
| CRIT-04 Dynamic exhibit slug 404 | CRITICAL | Orchestration | Post-nav selector assertion; NotFoundPage signature detection; captured-count summary |
| CRIT-05 Cloudflare edge cache serves stale | CRITICAL | Capture | Cache-buster query; log `cf-cache-status`; embed build SHA in frontmatter |
| CRIT-06 Cloudflare bot detection / rate limit | CRITICAL | Capture | Headful Chromium; realistic UA; rate-limited sequential captures; interstitial detection |
| CRIT-07 Non-deterministic Markdown output | CRITICAL | Rendering / Verification | Double-run `diff` test as part of tool's self-test |
| MOD-01 NavBar/FooterBar duplication | MODERATE | Rendering | Strip `<nav>`, `<footer>`; target `<main>` |
| MOD-02 Readability strips portfolio content | MODERATE | Stack decision | Reject Readability in STACK.md |
| MOD-03 Missing `<main>` | MODERATE | Research + Capture | DOM audit pass + per-route selector manifest |
| MOD-04 Heading level drift | MODERATE | Rendering | Document structure decision + "single H1 in document" assertion |
| MOD-05 Nested list mangling | MODERATE | Rendering | Turndown config + round-trip tests against fixture HTML |
| MOD-06 Table with rowspan/colspan | MODERATE | Rendering | Audit rendered tables; `keep: ['table']` fallback; desktop viewport |
| MOD-07 DOM ≠ visual order (CSS `order`) | MODERATE | Research + Capture | CSS grep + manual spot-check + document exceptions |
| MOD-08 Webfonts pending layout shift | MODERATE (screenshots only) | Capture | `document.fonts.ready` before screenshot |
| MOD-09 Smart quotes / em-dash / mojibake | MODERATE-CRITICAL | Rendering + Verification | Explicit UTF-8 I/O; `â€` grep post-capture |
| MOD-10 Obsidian vault write race / file lock | MODERATE | Writer | Atomic write via temp+rename; staleness check; config path |
| MOD-11 Image handling (base64 vs URL) | MODERATE | Rendering | Absolute URLs with alt preserved; document choice |
| MOD-12 Inline code whitespace | MODERATE | Rendering | Turndown `codeBlockStyle: 'fenced'`; fixture tests |
| MOD-13 Capture pollutes analytics | MODERATE | Capture | Distinctive UA + `page.route()` block of analytics domains |
| MIN-01 Excess blank lines | MINOR | Rendering | Post-process: collapse 3+ newlines to 2 |
| MIN-02 Dead anchor links | MINOR | Rendering | Rewrite to slugs via `github-slugger` or strip |
| MIN-03 ARIA-only content lost | MINOR | N/A | Only address if content loss noticed |
| MIN-04 `data-v-*` attribute leakage | MINOR | Rendering | Strip `data-v-*` in DOM sanitization |
| MIN-05 Arbitrary route order | MINOR | Orchestration | Explicit route list in config, matching NavBar + CaseFiles order |
| MIN-06 No capture metadata | MINOR | Writer | Frontmatter: `captured_at`, `source_url`, `site_version_sha`, `tool_version` |
| P158-01 FAQ behind-interaction | CRITICAL | Capture (FAQ-specific preparation step) | Open-all + filter-all idempotent; count assertion |
| P158-02 Desktop table vs mobile card | MODERATE | Capture | Fixed 1280×800 viewport |
| P158-03 Never fall back to JSON | CRITICAL (avoiding v7.0 re-occurrence) | Architecture | Tool invariant: all content comes from rendered DOM; no JSON reads |
| P158-04 Route manifest explicit | MINOR | Orchestration | Config-driven manifest, not auto-crawl |
| P158-05 SPA 404 = HTTP 200 | CRITICAL → CRIT-04 | Capture | Known-good selector per route |
| P158-06 Theme toggle + screenshots | MINOR | Capture (if screenshots) | Pin theme via `addInitScript` + localStorage |
| P158-07 Coexist with v7.0 `build:markdown` | MINOR | Repo layout | `scripts/editorial/` separate from `scripts/markdown-export/` |
| P158-08 Reuse `yaml` + `github-slugger` | MINOR | Stack | Don't add duplicate deps |
| P158-09 Reuse installed Playwright | MINOR | Stack | Import from existing `playwright` devDep |
| P158-10 Live URL not Wrangler preview | MINOR | Config | Default to `https://pattern158.solutions`, override via config |
| P158-11 Obsidian vault path portability | MODERATE | Config | Env var or config file; sensible repo-local default |
| P158-12 SPA HTML fallback makes HTTP checks useless | MODERATE | Capture | DOM-based validation only |

---

## Sources

- **Direct code inspection:**
  - `/home/xhiris/projects/pattern158-vue/src/components/FaqAccordionItem.vue` (confirmed `:hidden="!isOpen || undefined"` behavior)
  - `/home/xhiris/projects/pattern158-vue/src/components/FaqFilterBar.vue` (filter state mechanism)
  - `/home/xhiris/projects/pattern158-vue/src/data/json/exhibits.json` (15 exhibits, smart-quote source evidence)
  - `/home/xhiris/projects/pattern158-vue/src/pages/` (route listing)
  - `/home/xhiris/projects/pattern158-vue/package.json` (existing deps, scripts conflict check)
- **Planning context:**
  - `/home/xhiris/projects/pattern158-vue/.planning/v7.0-ABORT-NOTICE.md` (fidelity failure modes informing v8.0 direction)
  - `/home/xhiris/projects/pattern158-vue/.planning/RETROSPECTIVE.md` (v7.0 lessons: composition fidelity, reading-order fidelity, dynamic routes)
  - `/home/xhiris/projects/pattern158-vue/.planning/PROJECT.md` (stack constraints, Key Decisions)
- **Training-data-informed claims** (flagged where relevant):
  - Playwright navigation semantics (`waitUntil` options, `waitForSelector`) — HIGH confidence from Playwright docs stable across 1.x releases
  - Turndown behavior on nested lists, tables, smart quotes — MEDIUM confidence; verify against specific v2.x behavior during implementation
  - Cloudflare Pages edge caching, Bot Fight Mode defaults — MEDIUM confidence; verify against Cloudflare dashboard before relying on defaults
  - Readability.js design assumptions (news-article heuristics) — HIGH confidence based on mozilla/readability README and issue tracker history
  - WSL2 `/c/` drvfs semantics — HIGH confidence (stable Microsoft documentation)
