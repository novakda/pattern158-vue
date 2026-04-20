# Feature Landscape — v8.0 Editorial Snapshot & Content Audit

**Domain:** One-off live-site editorial capture tool for pattern158.solutions (Vue 3 SPA, 15 exhibits + 8 static routes) feeding a human editorial pass and subsequent v9.0 direction audit.
**Researched:** 2026-04-19
**Overall confidence:** HIGH

## Framing

v8.0 is a **three-stage cycle**, not a product:

1. **Capture** — Playwright visits every route, serialises rendered content to one Markdown doc.
2. **Editorial** — Dan reads the captured doc, annotates issues, drafts a findings document.
3. **Audit** — Findings + the captured doc feed a decision record that shapes v9.0's direction.

Everything below is evaluated against that lifecycle. A "feature" that only pays off if the tool lives for a year is an **anti-feature** here. The tool is disposable; the *output* is what matters.

The site is small (23 routes total, all known ahead of time, all on one origin, all static-enough that JSON-sourced slugs are the truth). Treat that as a gift: it lets us skip crawler complexity, queueing, politeness delays, and authentication that real scrapers spend 90% of their code on.

---

## 1. Capture Features

What the tool does when it visits a page.

| # | Feature | Classification | Complexity | Depends On | Rationale |
|---|---------|----------------|------------|------------|-----------|
| C1 | Route list from typed sources (hardcoded static list + `exhibits.json` slug enumeration) | table-stakes | trivial | — | Routes are known; no discovery needed. `src/router.ts` and `exhibitLink` fields are the truth. |
| C2 | Playwright headless Chromium session, single browser context, sequential navigation | table-stakes | trivial | — | Site is ~23 pages. Parallelism adds bugs, not speed. Sequential makes the output deterministic and interleaves cleanly with logging. |
| C3 | Page-ready detection via `waitForSelector('#main-content')` + `domcontentloaded` | table-stakes | trivial | C2 | Vue SPA with a stable `<main id="main-content">` landmark (confirmed in `App.vue`). Selector-wait beats `networkidle` for SPAs — theme toggles, analytics, and font loaders keep the network alive. |
| C4 | Per-route URL verification (HTTP status recorded alongside capture) | table-stakes | trivial | C1, C2 | Catches broken exhibit slugs (source-JSON drift) and redirect surprises. `response.status()` is free data — record it, don't gate on it. |
| C5 | Skip nav / header / footer / skip-link from captured output | table-stakes | trivial | C3 | Scope capture to `<main id="main-content">` only. Otherwise every page starts with the same nav and ends with the same footer, which drowns the editorial signal. |
| C6 | Capture rendered DOM (`page.$eval('#main-content', el => el.outerHTML)`), not raw HTML from network | table-stakes | trivial | C3 | SPAs have empty `<body>` before hydration. We need the hydrated DOM. |
| C7 | Handle dynamic content revealed by user interaction (accordions, filters) | **decision required** | moderate | C3, C5 | FAQ page uses an accordion (v6.0). Two options: (a) expand all accordions before capture so all Q/A text is in the doc, (b) capture collapsed state and rely on underlying prose being present in DOM. *Recommendation: pre-expand via `page.evaluate` before capture — editorial review needs the full answer text.* |
| C8 | Viewport locked to a single size (desktop, e.g. 1280×800) | table-stakes | trivial | C2 | Mobile cards render different DOM shapes (v5.1 personnel cards). Editorial review wants *one* consistent rendering. Choose desktop for maximum content density. |
| C9 | Fixed theme (light) for capture | table-stakes | trivial | C2 | Theme affects no content, but stabilises snapshots if we ever screenshot. Sets a clean `localStorage.theme = 'light'` before navigation. |
| C10 | Skip `/portfolio` and `/testimonials` (Vue Router redirects) | table-stakes | trivial | C1 | They resolve to `/case-files`. Capturing them produces duplicate content. Filter from route list. |
| C11 | Skip `/diag/personnel` and `/review` (internal diagnostic pages) | table-stakes | trivial | C1 | Not part of the editorial site. Dan confirm. |
| C12 | Handle `NotFoundPage` catch-all | anti-feature | trivial | — | No user-facing editorial content. Skip. |
| C13 | Screenshots per route alongside Markdown | differentiator | moderate | C3 | Useful for "does this page *look* right?" during editorial review. Visual issues (spacing, overflow, broken layout) don't surface in DOM text. Write to `screenshots/` dir next to the Markdown. PNG, full-page. |
| C14 | Capture JSON-LD / meta tags / SEO metadata per route | differentiator | trivial | C3 | One-time value: editorial review can flag stale `<meta description>` copy. Small effort — `page.evaluate` on `<head>`. Include as collapsible section per-page. |
| C15 | Network request log / trace per page | anti-feature | moderate | — | Debug tooling for scrapers. Irrelevant for editorial review. |
| C16 | Retry / backoff / rate limiting | anti-feature | moderate | — | Local tool hitting a local dev server or Cloudflare CDN. 23 pages, sequential, no politeness needed. |
| C17 | Authentication / cookies / session state | anti-feature | moderate | — | Public site. No login. |
| C18 | Capture console errors and page errors | differentiator | trivial | C2 | Cheap (`page.on('pageerror', ...)`). Surfaces JS breakage Dan might not notice via browser. Log to capture report, not into editorial doc. |
| C19 | Capture against local dev server (`pnpm dev`) vs production | **decision required** | trivial | C1 | *Recommendation: support both, default to production (`pattern158.solutions`).* Production is the canonical source of truth and what human readers see. Dev server useful when iterating on content changes mid-editorial. One CLI flag. |

### Route list for v8.0 (confirmed from `src/router.ts` + `exhibits.json`)

**Static routes (7 for capture):**
- `/`
- `/philosophy`
- `/faq`
- `/technologies`
- `/case-files`
- `/contact`
- `/accessibility`

**Dynamic exhibit routes (15):**
- `/exhibits/exhibit-a` through `/exhibits/exhibit-o`

**Skipped:** `/portfolio` (redirect), `/testimonials` (redirect), `/diag/personnel` (diagnostic), `/review` (diagnostic), `/:pathMatch(.*)*` (404 catch-all).

**Total:** 22 pages captured.

---

## 2. Conversion Features

Rendered HTML → Markdown.

| # | Feature | Classification | Complexity | Depends On | Rationale |
|---|---------|----------------|------------|------------|-----------|
| V1 | Turndown as HTML→Markdown engine | table-stakes | trivial | C6 | Mature, actively maintained, plugin ecosystem, used by web2md and similar tools. Training data and community converge here. |
| V2 | `turndown-plugin-gfm` for tables | table-stakes | trivial | V1 | Personnel, technologies, findings all render as tables. Without GFM plugin, tables become garbage. |
| V3 | Configure `headingStyle: 'atx'`, `bulletListMarker: '-'`, `codeBlockStyle: 'fenced'` | table-stakes | trivial | V1 | Obsidian-friendly defaults, match Dan's vault conventions. |
| V4 | Custom Turndown rule for badge/pill spans (strip classes, preserve text) | table-stakes | trivial | V1 | Site has many decorative badges (`.badge-aware`, `.impact-tag`, severity pills). Raw Turndown keeps them as inline text which is correct — just don't let them disappear silently. |
| V5 | Custom Turndown rule for images: alt-text only (no src, no base64, no reference links) | table-stakes | trivial | V1 | Editorial review is about copy. Alt text *is* copy. Image bytes are not. Emit `[image: alt text]` or similar so alt-text gaps are visible. |
| V6 | Preserve semantic heading levels from source DOM | table-stakes | trivial | V1 | DOM is already correct — page has one `<h1>`, sections use `<h2>`/`<h3>`. Turndown default behaviour is correct. |
| V7 | Skip `aria-hidden="true"` elements | table-stakes | trivial | V1 | Decorative icons, SVG noise. Register a custom rule to filter them. |
| V8 | Readability.js content extraction | anti-feature | moderate | — | Designed for news articles with article/aside/sidebar ambiguity. We already know the content region (`#main-content`). Readability adds guesswork where we have certainty. |
| V9 | Reading-order preservation via DOM traversal order | table-stakes | trivial | V1 | Turndown walks the DOM in source order. Site has no CSS `order:` flex shenanigans (confirmed by project context — no animations/reorder patterns in v1.0-v6.0 scope). DOM order = reading order. |
| V10 | Collapse multiple blank lines to one | table-stakes | trivial | V1 | Turndown can over-emit whitespace with nested divs. Post-process with `/\n{3,}/g → '\n\n'`. |
| V11 | Strip `<script>`, `<style>`, `<noscript>` | table-stakes | trivial | V1 | Turndown defaults handle this but confirm explicitly. |
| V12 | Preserve link hrefs as Markdown links | table-stakes | trivial | V1 | Editorial review wants to see "link to X" — helps catch broken internal refs. Default Turndown behaviour. |
| V13 | Rewrite absolute internal links to relative-within-doc anchors | differentiator | moderate | V1, D3 | Nice if `[Exhibit A](/exhibits/exhibit-a)` in body copy links to the exhibit's section *in the same Markdown doc*. Editorial review stays in one doc. Moderate effort; skip if time-pressed. |
| V14 | Syntax-highlighted code blocks (language detection) | anti-feature | trivial | — | Site has no code samples in prose. Not needed. |
| V15 | Math / LaTeX preservation | anti-feature | trivial | — | Site has no math. |

---

## 3. Document-Shape Features

How the captured pages assemble into one Markdown doc.

| # | Feature | Classification | Complexity | Depends On | Rationale |
|---|---------|----------------|------------|------------|-----------|
| D1 | Single concatenated Markdown file | table-stakes (decided) | trivial | V1 | Decided in milestone framing. One file = one editorial read. Multi-file fragments the review and breaks Ctrl-F across the site. |
| D2 | Frontmatter block at doc top (capture date, base URL, git SHA of site, tool version, route count) | table-stakes | trivial | — | Provenance. Essential when the doc lives in Obsidian weeks later and Dan asks "when was this captured, against what?" |
| D3 | Per-page section heading with route path (e.g. `# Route: /exhibits/exhibit-a`) | table-stakes | trivial | V9 | Sets a stable Markdown anchor, gives each page a visual boundary. Use `#` for route headers and demote page-native headings by one level (site's `<h1>` becomes `##` in the combined doc). |
| D4 | Table of contents at top (route list with anchor links) | table-stakes | trivial | D3 | Navigating a single 15k-line Markdown doc without ToC is painful. Auto-generated from D3. |
| D5 | Per-page metadata block (URL, HTTP status, page title, meta description, capture timestamp) | table-stakes | trivial | C4, C14, D3 | Small YAML-ish block or callout beneath each route heading. Editorial review needs this context. |
| D6 | Horizontal rule (`---`) between pages | table-stakes | trivial | D3 | Visual separator. Cheap. |
| D7 | Route sections ordered: home → static pages → exhibits A-O | table-stakes | trivial | D3 | Matches site IA and reading order a visitor would take. Alphabetical exhibits match existing IA. |
| D8 | One file per route (multi-file output) | anti-feature | moderate | — | Contradicts D1 (milestone decision). Fragments editorial flow. Dan already rejected. |
| D9 | HTML sidecar alongside Markdown | anti-feature | moderate | — | If Markdown fidelity fails, debug by inspecting HTML. But Turndown is mature. Don't preemptively add a second output. |
| D10 | Diff against previous capture (Markdown-level diff) | differentiator | moderate | D1 | Useful if the tool is re-run during editorial pass and Dan wants to see what changed. `git diff` does this for free if the output file lives in a git-tracked location. **Skip in-tool; rely on git.** |

---

## 4. Output & Storage Features

Where the file goes and how re-runs behave.

| # | Feature | Classification | Complexity | Depends On | Rationale |
|---|---------|----------------|------------|------------|-----------|
| O1 | Configurable output path (CLI arg or env var) | table-stakes | trivial | D1 | Output goes to Obsidian vault (outside repo), per milestone framing. Don't hardcode paths. |
| O2 | Idempotent overwrite (last run wins) | table-stakes | trivial | O1 | The file is derived; regenerating is the happy path. Timestamped filenames create clutter nobody cleans up. If Dan wants history, he puts the target file in a git-tracked dir (vault *is* git-tracked — confirmed from CLAUDE.md) and commits between runs. |
| O3 | Secondary copy into `.planning/research/` or equivalent repo-local path | differentiator | trivial | O1 | Cheap, and makes the captured doc easy to reference in phase plans without asking Dan to open the vault. Dual-write with the vault path primary. |
| O4 | Screenshots output dir alongside Markdown | differentiator | trivial | C13, O1 | Already covered by C13. |
| O5 | Run summary printed to stdout (routes captured, elapsed, errors, byte count of output) | table-stakes | trivial | — | Free ergonomics. No UI complexity. |
| O6 | JSON run-report sidecar (machine-readable summary) | anti-feature | moderate | — | Solves no human problem. The tool is invoked by Dan, not chained into automation. |
| O7 | Emit warning/log when a route returns non-200 | table-stakes | trivial | C4, O5 | Don't swallow errors. Surface 404s and 500s loudly. |
| O8 | Continue past per-route failures (don't abort whole run) | table-stakes | trivial | O7 | One broken exhibit shouldn't kill a 22-page capture. Record the error in the doc at the route's section, keep going. |

---

## 5. Editorial Review Features

The human-in-the-loop stage. These are **practices and artifact shapes**, not tool features — but they belong here because they define what the capture doc has to support.

| # | Feature | Classification | Complexity | Depends On | Rationale |
|---|---------|----------------|------------|------------|-----------|
| E1 | Dan reads the captured Markdown in Obsidian | table-stakes | N/A | O1 | The whole point. Obsidian gives folding, graph, backlinks, Ctrl-F. No tool change needed beyond putting the file in the vault. |
| E2 | Dan annotates the captured doc in place (strikethroughs, inline comments, `TODO:` markers) | table-stakes | N/A | E1 | Standard editorial workflow. Capture doc is a working copy. Re-runs must not clobber annotations unprompted — hence O2 overwrite is fine *if* annotations happen in a copy, not the source. See open question Q1. |
| E3 | Findings document as separate artifact | table-stakes | N/A | E1, E2 | The findings doc is the deliverable that feeds v9.0. Captured Markdown is raw material; findings doc is analysis. Keep them separate. |
| E4 | Findings doc structured sections: Inconsistencies / Structural Issues / Copy Changes / Alignment Gaps / Open Questions | table-stakes | trivial | E3 | Matches NN/g and standard content audit patterns. Each finding is NTSB-style: what's wrong, where (route + heading), why it matters. Mirrors existing `FindingEntry` conventions from v5.0 — diagnostic, not observational. |
| E5 | Findings cross-referenced to career positioning docs | table-stakes | trivial | E3 | Milestone explicitly names `career/reference-data/design-philosophy-essay.md`, `career-values-reference.md`, `case-study-gp-accessibility-signoff.md` as the alignment benchmarks. Findings cite which document the captured copy deviates from. |
| E6 | Findings prioritised (blocker / should-fix / nice-to-have) | table-stakes | trivial | E3 | v9.0 scoping needs "what *must* change before rebuild" vs "what *could* change". |
| E7 | Findings doc is a template the tool scaffolds | differentiator | trivial | E3 | Tool emits an empty `findings-template.md` with section headers Dan then fills. Saves 2 minutes. Low value but low cost. |
| E8 | Automated copy-style checker (prose linting, readability score) | anti-feature | significant | — | Scope creep. Adds dependencies for marginal value. Dan's editorial judgment is the value; a linter can't replicate it. |
| E9 | Inconsistency *detection* from the capture doc | anti-feature | significant | — | "Find all mentions of X and flag where they disagree" sounds great; in practice needs NLP or lots of hand-written rules. Dan's eyes catch these in one read. Revisit in v9.0 if the rebuilt site accretes more pages. |

---

## 6. Milestone Audit Features

The v8.0 → v9.0 decision record.

| # | Feature | Classification | Complexity | Depends On | Rationale |
|---|---------|----------------|------------|------------|-----------|
| A1 | Decision record artifact (one doc, not a deck) | table-stakes | trivial | E3 | Lives in `.planning/` alongside `v7.0-ABORT-NOTICE.md`. Same pattern: name it plainly (`v9.0-DIRECTION-DECISION.md` or similar), cite the findings doc and capture doc, state the verdict. |
| A2 | Direction decision sections: context, options considered, verdict, rationale, retained work, next actions | table-stakes | trivial | A1 | Mirrors `v7.0-ABORT-NOTICE.md` structure — it works; reuse it. |
| A3 | Explicit list of v9.0 candidates with go/no-go per option (static HTML rebuild, content rewrite only, framework rebuild, hybrid) | table-stakes | trivial | A1 | Forces the decision to engage with alternatives rather than defaulting. |
| A4 | Signals that informed the decision (what the capture + findings surfaced) | table-stakes | trivial | A1 | Makes the decision reviewable later. If v9.0 drifts, future-Dan can reread and check whether the signals still apply. |
| A5 | Rosetta Stone alignment check | table-stakes | trivial | A1 | Milestone framing explicitly connects v8.0 to the longer-term multi-framework portfolio vision. Decision must state: "does this direction serve Rosetta Stone, work against it, or is it orthogonal?" |
| A6 | Updated `PROJECT.md` and `MILESTONES.md` entries | table-stakes | trivial | A1 | Existing GSD workflow. Handled by `/gsd:complete-milestone`. |

---

## Feature Dependency Map

```
C1 (route list) → C4 (status check)
C2 (browser)    → C3 (ready detection) → C5 (scope to main) → C6 (hydrated DOM)
                                              ↓
                            V1..V12 (HTML→Markdown conversion)
                                              ↓
              D1 (single file) → D3 (route headings) → D4 (ToC) → D5 (per-page meta)
                                              ↓
              O1 (output path) → O2 (idempotent) → O5 (run summary)
                                              ↓
              E1 (read) → E2 (annotate) → E3 (findings doc) → E4..E6
                                              ↓
              A1 (decision doc) → A2..A5 → A6 (evolve project docs)
```

Each arrow is "consumes output of". The chain is short and linear — which is the correct shape for a disposable tool feeding a human editorial pass.

---

## Recommended Scope for v8.0

### IN (table-stakes, ship this)

**Capture:** C1, C2, C3, C4, C5, C6, C7 (pre-expand FAQ accordions), C8, C9, C10, C11, C18 (console errors to log)

**Conversion:** V1, V2, V3, V4, V5, V6, V7, V9, V10, V11, V12

**Document shape:** D1, D2, D3, D4, D5, D6, D7

**Output:** O1, O2, O5, O7, O8

**Editorial:** E1, E2, E3, E4, E5, E6

**Audit:** A1, A2, A3, A4, A5, A6

### CONSIDER (differentiators, include if easy)

- **C13 — Screenshots per route.** Marginal complexity, high editorial value for layout issues. *Recommend: include.*
- **C14 — SEO metadata capture.** Trivial. *Recommend: include.*
- **O3 — Dual-write to `.planning/`.** Trivial and convenient. *Recommend: include.*
- **E7 — Scaffold empty findings-template.** Trivial, mild ergonomics. *Recommend: include.*
- **V13 — Rewrite internal links to in-doc anchors.** Moderate effort; real editorial value. *Recommend: include if phase budget allows; defer otherwise.*

### OUT (anti-features, don't build)

- Readability.js content extraction (V8) — we already have a known content region
- Multi-file output (D8) — contradicts milestone decision
- HTML sidecar (D9) — no known need
- In-tool diff (D10) — git does it
- JSON run-report (O6) — no consumer
- Network log / trace (C15) — debug-tool scope
- Retry / backoff (C16) — single origin, tiny site
- Authentication (C17) — public site
- NotFoundPage capture (C12) — no editorial content
- Automated copy linter (E8) — adds deps for marginal value
- Automated inconsistency detection (E9) — rebuild it in v9.0+ if the page count grows

---

## Opinionated Summary

The right shape for v8.0 is a **~200-line script** (`scripts/editorial/capture-site.ts` or similar) that:

1. Reads the route list from `src/router.ts` exports + `exhibits.json` (no sitemap parsing, no crawl).
2. Launches Playwright, navigates each route sequentially, waits for `#main-content`, pre-expands accordions, snapshots the hydrated `outerHTML` of `#main-content`.
3. Runs each snapshot through Turndown + GFM plugin with a small custom-rule pack (strip aria-hidden, image→alt, badge passthrough).
4. Assembles one Markdown file with frontmatter, ToC, and per-route sections separated by `---`.
5. Writes to the vault path (primary) and `.planning/research/` (mirror).
6. Prints a summary, exits non-zero if any route 404'd or errored.

Then Dan opens the captured doc in Obsidian, reads it, annotates it, writes `FINDINGS.md`. Then a short `v9.0-DIRECTION-DECISION.md` cites both and states the rebuild direction. That's the milestone.

The discipline here: **every feature not on the IN list makes the tool live longer than its purpose.** The tool should be deletable once v9.0 direction is locked, or trivially re-runnable as a sanity check against future iterations. No framework, no CLI lib heavier than `mri`/`yargs`/bare `process.argv`, no plugin system, no config file.

---

## Open Questions for Dan

**Q1 — Re-run and annotations:** If Dan annotates the captured doc inside Obsidian and then re-runs the capture, O2 (idempotent overwrite) clobbers the annotations. Options:
- (a) Tool always overwrites; annotations live in a *second* file (`EDITORIAL-NOTES.md`) that references the capture.
- (b) Tool refuses to overwrite if the target file has been modified since last capture (mtime check).
- (c) Capture filename is content-hash-suffixed (`site-capture-2026-04-19.md`); Dan picks which to annotate.
- (d) Capture lives in the vault's git, and Dan relies on git to preserve annotations via commits between runs.

*Recommendation: (a) — clean separation of raw capture and editorial notes. Simplest mental model.*

**Q2 — Production vs dev capture (C19):** Default to production URL, or to `pnpm dev`? Production is the canonical source of truth for editorial work; dev is useful during active content editing. *Recommendation: default production, CLI flag `--base-url` to override.*

**Q3 — FAQ accordion handling (C7):** Confirm: pre-expand all accordions before capture so all Q/A text is in the doc. Alternative (collapse-state capture) is worse because Markdown won't reflect the rendered-after-interaction state.

**Q4 — Diagnostic pages (C11):** Confirm `/diag/personnel` and `/review` are excluded. The `ReviewPage` route suggests it might be a reviewer-facing page — if so, should it be captured? If it's internal QA tooling, skip it.

**Q5 — Screenshots (C13):** Include or skip? They add ~3-5MB of PNG to the output tree but are valuable for layout sanity checks during editorial review. Cheap to add, cheap to delete later.

**Q6 — Internal link rewriting (V13):** Worth the extra complexity, or skip? Editorial review *is* easier when `[See Exhibit A](/exhibits/exhibit-a)` clicks within the doc, but it's not load-bearing. Skip if it pushes v8.0 timeline; add in a later polish phase if worth it.

**Q7 — Output path primary location:** Where in the Obsidian vault does the capture live? Candidates: `career/website/captures/`, `career/reference-data/`, a new `career/site-capture/` directory. Needs Dan's IA preference.

**Q8 — Findings doc template (E7):** Auto-scaffold or not? Trivial either way. If yes, which sections beyond the recommended five (Inconsistencies / Structural Issues / Copy Changes / Alignment Gaps / Open Questions)?

---

## Sources

- [Playwright waitForLoadState — BrowserStack (2026)](https://www.browserstack.com/guide/playwright-waitforloadstate) — `networkidle` unreliable for SPAs with ongoing polling/analytics
- [Playwright WaitUntil option — Browserless](https://www.browserless.io/blog/waituntil-option-for-puppeteer-and-playwright) — selector-wait preferred over load-state for SPAs
- [mixmark-io/turndown — GitHub](https://github.com/mixmark-io/turndown) — canonical HTML→Markdown library, custom rule API
- [Turndown Customization — DeepWiki](https://deepwiki.com/mixmark-io/turndown/4-customization) — rule filters, keep/remove, options
- [turndown-plugin-gfm](https://github.com/mixmark-io/turndown-plugin-gfm) — required for table conversion
- [Improving Web Scraping with Readability and Table Support — ainoya.dev](https://ainoya.dev/posts/use-readability/) — Readability+Turndown pattern; noted Readability misses content when region is already known
- [Content Inventory and Auditing 101 — NN/G](https://www.nngroup.com/articles/content-audits/) — standard content audit structure, inventory-then-evaluate pattern
- [How to conduct a content audit — TechTarget](https://www.techtarget.com/searchcontentmanagement/tip/How-to-conduct-a-content-audit-Step-by-step-with-template) — findings prioritisation taxonomy
- [Crawlee Playwright Crawler](https://crawlee.dev/js/docs/examples/playwright-crawler) — reference architecture for multi-page capture (intentionally not adopted; our route list is known)
- Internal: `src/router.ts` (route enumeration), `src/data/json/exhibits.json` (15 exhibit slugs via `exhibitLink` field), `src/App.vue` (`<main id="main-content">` landmark), `.planning/v7.0-ABORT-NOTICE.md` (editorial rationale)
