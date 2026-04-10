# Feature Research: Static Markdown Export Pipeline

**Milestone:** v7.0 — Static Markdown Export
**Researched:** 2026-04-10
**Confidence:** HIGH (Obsidian conventions verified against the official `obsidianmd/obsidian-help` repository; markdown export patterns verified against widely adopted tools and GFM behavior)

## Scope

Two artifacts, both generated at build time and via a standalone `build:markdown` script, both committed under `docs/`:

1. **`docs/site-content.md`** — a single monolithic markdown document containing the entire site, where heading levels mirror the site tree (site → section → page → section → subsection).
2. **`docs/obsidian-vault/`** — a folder per menu section, one `.md` file per site page plus the 15 exhibit detail pages, with YAML frontmatter, `[[wikilinks]]`, and tag taxonomy.

Input sources already available:
- 11 JSON files in `src/data/json/` (exhibits, faq, technologies, findings, personnel via exhibit sub-arrays, philosophyInfluences, methodologySteps, specialties, stats, brandElements, techPills, influences)
- 9 live routes + 15 exhibit slug routes in `src/router.ts`
- Typed interfaces in `src/types/`
- Some page copy currently lives as literal template text inside `src/pages/*.vue` SFCs and is not in JSON — this is a known extraction dependency.

---

## Table Stakes

Features users expect. A markdown export pipeline that lacks any of these will feel broken.

### T1. Deterministic, reproducible output
**What:** Running the exporter twice on identical input must produce byte-identical files. Sort keys are stable, iteration order is stable, no timestamps in body content.
**Why expected:** Output is committed to git. Non-deterministic output floods diffs with noise and destroys the "what changed" signal.
**Complexity:** Low.
**Dependencies:** None beyond disciplined sort ordering when iterating objects.
**Note:** A single "generated on" timestamp at the top of `site-content.md` is fine; per-page timestamps inside the vault should use the source data's own `date` fields, not `Date.now()`.

### T2. Build-time integration and standalone script
**What:** `npm run build` runs the exporter after the Vite build; `npm run build:markdown` runs just the exporter. Both share one implementation.
**Why expected:** The milestone goal explicitly names both entry points. Standalone is needed for iteration without a full Vite rebuild.
**Complexity:** Low.
**Dependencies:** `package.json` scripts, a single exporter entry module importable outside Vite.

### T3. Monolithic document with site-tree heading hierarchy
**What:** `docs/site-content.md` with `#` (H1) = site title, `##` (H2) = top-level menu pages (Home, Philosophy, Technologies, Case Files, FAQ, Contact, Accessibility), `###`+ for internal page sections. Case Files H2 contains H3 per exhibit, with exhibit sections at H4+.
**Why expected:** The milestone goal literally says "heading levels follow site tree." A heading hierarchy that skips levels (e.g., H2 → H4) breaks GitHub's auto-TOC and assistive-tech outlines.
**Complexity:** Medium. Must track current depth while recursively walking data; must rewrite exhibit section headings (which are currently rendered at their own H-level by the Vue layouts) to land at the correct offset.
**Dependencies:** A mapping from route → display order, plus a heading-depth parameter threaded through every render function.

### T4. Auto-generated table of contents in the monolithic doc
**What:** A table of contents section between the H1 and the first H2, built from the heading walk. Anchor links use GitHub-flavored markdown slug rules: lowercase, spaces → hyphens, punctuation stripped (except hyphens and underscores).
**Why expected:** A 15-exhibit, 27-FAQ monolithic doc will be long enough that "browse from the top" is not a reasonable UX. GitHub renders the TOC inline when the file is browsed.
**Complexity:** Low–Medium. Must mirror the slug algorithm GitHub uses (lower + hyphenate + strip) and de-duplicate collisions with `-1`, `-2` suffixes the way GitHub does.
**Dependencies:** Heading list captured during render pass; slug utility.
**Source:** GitHub's slug rules are stable and mirrored by popular libraries (`github-slugger` is the de-facto implementation). HIGH confidence.

### T5. Content-addressable internal cross-references
**What:** When content in JSON references another page (e.g., FAQ answers that say "see Philosophy page"), the exporter rewrites the reference to the right target for the format:
- Monolithic: anchor link `[see Philosophy](#philosophy)`
- Vault: wikilink `[[Philosophy]]`
**Why expected:** Broken links in exported docs are the #1 smell that an exporter was rushed.
**Complexity:** Medium. Requires a central route-to-filename and route-to-anchor map, plus a link-rewrite pass that recognizes site-internal URLs (`/exhibits/exhibit-j`, `/philosophy`, etc.) and leaves external URLs alone.
**Dependencies:** `src/router.ts` is the canonical list. FAQ JSON already carries `exhibitUrl` fields like `/exhibits/exhibit-j` — these must resolve in both formats. HIGH confidence this is needed (verified: 6 `exhibitUrl` entries in `faq.json` plus prose references like "the Philosophy page").

### T6. YAML frontmatter on every vault file
**What:** Each `.md` in `docs/obsidian-vault/` starts with a `---`-delimited YAML block containing at minimum `title`, `aliases`, `tags`, and (where source data provides it) `date`.
**Why expected:** Frontmatter is the Obsidian convention for metadata. Without it, the vault looks like a pile of markdown, not an Obsidian vault.
**Complexity:** Low.
**Dependencies:** A YAML emitter that quotes strings containing colons, uses list-of-string format for `tags` and `aliases`, and escapes wikilinks with quotes when they appear in property values (Obsidian's documented requirement for `[[Link]]` inside YAML strings).
**Source:** `obsidianmd/obsidian-help` `en/Editing and formatting/Properties.md`. HIGH confidence.

### T7. Wikilinks between vault notes
**What:** Internal links in vault files use `[[Note name]]` or `[[Note name|display text]]` syntax, not relative markdown links.
**Why expected:** Wikilinks are the Obsidian default and the only link format that participates in the graph view, backlinks pane, and link-update-on-rename. The milestone goal explicitly says "Full Obsidian treatment ... `[[wikilinks]]`."
**Complexity:** Low–Medium. The link rewrite pass (T5) is already required; emitting wikilinks in vault mode is a branch inside that pass.
**Dependencies:** Same route map as T5. Vault filenames must exactly match the link target (Obsidian matches `[[X]]` to `X.md` by basename, case-insensitive but case-preserving).
**Source:** `obsidianmd/obsidian-help` `en/Linking notes and files/Internal links.md`. HIGH confidence.

### T8. Folder structure mirrors the menu
**What:** `docs/obsidian-vault/` top-level folders correspond to the nav menu: Home, Philosophy, Technologies, Case Files, FAQ, Contact, Accessibility. Exhibits live under `Case Files/Exhibits/` (or similar).
**Why expected:** Milestone goal states "folder structure matches menu." Obsidian renders folders in the file explorer exactly as the filesystem shows them, so the filesystem layout IS the navigation.
**Complexity:** Low.
**Dependencies:** A single declaration of the menu → folder map, probably alongside the route map.

### T9. Tag taxonomy for exhibits
**What:** Each exhibit vault file gets tags drawn from its exhibit properties: `exhibit-type/investigation-report` vs `exhibit-type/engineering-brief`, plus category tags drawn from any findings categories present on the exhibit (already normalized in v5.0).
**Why expected:** The milestone goal says "exhibit category tags." Obsidian nested tags (`parent/child`) are the idiomatic way to encode typed taxonomies.
**Complexity:** Low–Medium. Requires deciding the tag namespace up front (see Open Questions).
**Dependencies:** `exhibitType` discriminant (v2.0) and `findings[].category` (v5.0) are already in place — no data work needed.
**Source:** `obsidianmd/obsidian-help` `en/Editing and formatting/Tags.md` confirms nested tag syntax and list-format in YAML. HIGH confidence.

### T10. Image handling — skip files, preserve alt text
**What:** Image references in content are not copied into the output. Instead the exporter emits the alt text as an italicized caption: `*[Image: description of visual content]*`.
**Why expected:** Milestone goal explicitly says "Images skipped, alt text kept." Preserving alt text keeps the semantic content intact for LLM consumption and for users reading on GitHub.
**Complexity:** Low.
**Dependencies:** Source content must actually have alt text. Existing exhibit sections don't currently reference images in prose, so this is mostly defensive; the PagePortraits component and exhibit flagship images would be where this matters if portrait rendering is added later.

### T11. Markdown tables for tabular data (personnel, technologies, findings)
**What:** Render personnel, technologies, and findings arrays as GitHub-flavored markdown tables, with column headers matching the TypeScript interface field labels. Drop empty columns (e.g., don't emit a "Resolution" column if no finding in that exhibit has a resolution).
**Why expected:** These are already tables on the site and the data is already typed as `PersonnelEntry[]`, `TechnologyEntry[]`, `FindingEntry[]`. Users coming from GitHub or Obsidian expect markdown tables for tabular data.
**Complexity:** Medium. Column width padding is trivial; the real work is the column-presence detection pass and escaping pipe characters inside cell content.
**Dependencies:** v4.0/v5.0 typed arrays. This is why those milestones mattered — without them, finding categories would still be in untyped `string[][]`.
**See also:** Tabular Data Rendering Strategies section below.

### T12. Accurate heading levels on exhibit sections
**What:** An exhibit's own section headings (`contextHeading`, `sections[].heading`, `findingsHeading`) must land at the right depth relative to the enclosing document. In the monolithic doc they're H4; in the vault they're H2 (since the exhibit page itself is an H1 title inside the note).
**Why expected:** The existing exhibit JSON was authored assuming the site layout wraps each exhibit in its own page context, so section headings are written as second-level within the exhibit. The exporter must respect that.
**Complexity:** Low once the depth parameter is threaded through (T3).
**Dependencies:** None new.

### T13. FAQ question-per-entry rendering
**What:** Each FAQ item becomes an H3 (in vault) / appropriate depth (in mono) with the question as heading and the answer as body. Categories become inline tags or a metadata line.
**Why expected:** The FAQ page is currently an accordion. In markdown, questions-as-headings is the idiomatic equivalent and makes the FAQ TOC-discoverable.
**Complexity:** Low.
**Dependencies:** `faq.json`. The `exhibitNote` + `exhibitUrl` fields must trigger a cross-reference callout (T5).

### T14. Stable filenames for vault notes
**What:** Vault filenames are derived from a deterministic slugify of the page title, with collision avoidance. Exhibit files use `Exhibit A - Cross-Domain SCORM Resolution.md` style (human-readable, matches the site label + title).
**Why expected:** Obsidian shows filenames as note titles in the sidebar and in wikilink autocomplete. Cryptic filenames break the experience.
**Complexity:** Low.
**Dependencies:** Slug utility that tolerates unicode, strips filesystem-hostile characters (`# | ^ : [ ] / \`), and truncates to a safe length.
**Source:** `obsidianmd/obsidian-help` `en/Linking notes and files/Internal links.md` documents these exact characters as invalid for links: `# | ^ : %% [[ ]]`. HIGH confidence.

### T15. Exhibit sub-content rendering
**What:** For each exhibit, render all five section variants that appear in the data: `text`, `table`, `timeline`, `metadata`, `flow`. Verified by inspection of `exhibits.json` — these are the only five variants in use.
**Why expected:** An exporter that silently drops `timeline` or `flow` sections would lose narrative evidence for roughly half the exhibits (timelines appear in investigation reports; flow sections in most engineering briefs).
**Complexity:** Medium. Each section type needs its own renderer:
- `text` → heading + paragraphs (split on `\n\n`)
- `table` → markdown table
- `timeline` → definition list or bullet list with date as lead
- `metadata` → markdown table or YAML-like block
- `flow` → ordered list with each step
**Dependencies:** Existing typed exhibit section discriminated union (v3.0/v4.0).

---

## Differentiators

Features that set this exporter apart. Not expected, but they make the vault feel thoughtful.

### D1. Case Files index note (MOC) for the vault
**What:** `docs/obsidian-vault/Case Files/Case Files.md` — an auto-generated Map of Content note that lists all 15 exhibits grouped by type, with one-line descriptions, linked via wikilinks. Each folder also gets an index note.
**Why valuable:** MOCs (Maps of Content) are the Obsidian-community-standard way to add curated navigation on top of folder-based structure. A vault without index notes forces users to use the file explorer, which is not the intended Obsidian experience.
**Complexity:** Medium. The grouping logic already exists in `CaseFilesPage.vue`. The exporter just needs to render it as markdown instead of Vue components.
**Dependencies:** `exhibits.json`, `exhibitType` discriminant.
**Source confidence:** MEDIUM — "MOC" is a community term popularized by the LYT (Linking Your Thinking) project, not core Obsidian documentation. But it is widely used and community-standard.

### D2. Backlinks-friendly cross-references from FAQ to exhibits
**What:** FAQ answers that reference exhibits produce bidirectional links: the FAQ note wikilinks to the exhibit, and the exhibit's "Referenced in FAQ" callout (auto-generated on the exhibit note) wikilinks back.
**Why valuable:** Obsidian's backlinks pane already surfaces reverse links automatically — BUT an explicit "Referenced in" section in the note body is visible on GitHub too, which the backlinks pane is not.
**Complexity:** Medium. Requires a two-pass build: first walk everything to collect references, then emit files with the reverse-index injected.
**Dependencies:** `exhibitUrl` fields in `faq.json` (already present, 6 entries).

### D3. Obsidian callout blocks for quotes
**What:** Quote attribution blocks (`quotes[]` in exhibits) render as Obsidian callouts:
```
> [!quote] Chief of Learning Services, Electric Boat
> I'd consider the last couple days a success...
```
**Why valuable:** Callouts render as stylized boxes in Obsidian and degrade gracefully to regular blockquotes on GitHub (which ignores the `[!quote]` directive and shows the quote normally). Best of both worlds.
**Complexity:** Low.
**Dependencies:** `exhibit.quotes[]` shape (already present).
**Source:** `obsidianmd/obsidian-help` `en/Editing and formatting/Callouts.md`. HIGH confidence on syntax.

### D4. Aliases for FAQ questions
**What:** Each FAQ vault note gets `aliases:` in frontmatter covering common phrasings of the question, enabling Obsidian's quick-switcher to find the note by any alias. Exhibit notes get aliases for both the label ("Exhibit A") and the client ("General Dynamics Electric Boat").
**Why valuable:** Aliases are the #1 reason to use Obsidian frontmatter at all — they make search and wikilink autocomplete dramatically more useful.
**Complexity:** Low once a policy is set (question → first-sentence alias, exhibit → label + client alias).
**Dependencies:** None new.
**Source:** `obsidianmd/obsidian-help` Properties.md confirms `aliases` is a reserved default property. HIGH confidence.

### D5. Per-exhibit block anchors for deep linking
**What:** Key sub-sections (Background, Personnel, Findings, Outcome) get Obsidian block references (`^background`, `^findings`) at the end of their heading paragraphs, so other notes can deep-link with `[[Exhibit A#^findings]]`.
**Why valuable:** Enables future vault authors (Dan, when taking notes) to reference specific parts of exhibits directly.
**Complexity:** Low.
**Dependencies:** None new.
**Source:** `obsidianmd/obsidian-help` Internal links.md documents `^block-id` syntax. HIGH confidence. Note: block references are Obsidian-only and will appear as literal `^background` in the monolithic doc — only emit them in vault mode.

### D6. GitHub-renderable monolithic doc (no Obsidian-only syntax)
**What:** The monolithic `docs/site-content.md` is CommonMark + GFM only. No wikilinks, no callouts with unknown directives, no block refs. Everything renders correctly when browsing on github.com.
**Why valuable:** The monolithic doc's primary audience is hiring managers skimming on GitHub. Obsidian-isms would show up as broken syntax.
**Complexity:** Low (just a renderer mode flag).
**Dependencies:** The renderer must be parameterized by target (`"mono"` vs `"vault"`) from day one.

### D7. Content extraction from Vue SFCs for page copy
**What:** Pages like HomePage, PhilosophyPage, AccessibilityPage, and ContactPage have significant prose content currently hard-coded in Vue templates. The exporter extracts this via one of three strategies: (a) relocate copy into JSON before exporting, (b) parse SFC `<template>` blocks with a restricted HTML-to-markdown converter, or (c) execute the compiled Vue components and serialize their rendered HTML.
**Why valuable:** Without this, the exported docs are missing 40%+ of the site's actual content.
**Complexity:** HIGH. This is the single largest source of risk in the milestone and probably deserves a research flag (see PITFALLS.md).
**Dependencies:** Depends on the strategy chosen. Strategy (a) is the cleanest and matches the v3.0 "JSON-first data layer" direction but is the most invasive to existing pages.

### D8. Generated-file warning banner
**What:** First line of every generated file (after frontmatter in vault mode) is an HTML comment: `<!-- AUTO-GENERATED by scripts/build-markdown.ts — DO NOT EDIT — Source: src/data/json/... -->`.
**Why valuable:** Prevents the inevitable "I edited the docs file and my changes got clobbered" bug report.
**Complexity:** Trivial.
**Dependencies:** None.

### D9. Deterministic per-page "created/updated" semantics
**What:** Vault notes with source data that has a `date` field (exhibits have `date: "2015-2022"`-style ranges) put it in frontmatter as `date:` or `period:`. Notes without source dates omit the field entirely rather than falling back to `Date.now()`.
**Why valuable:** Obsidian plugins (Dataview, etc.) expect `created:` and `updated:` but NULL/synthetic values poison queries. Better to omit than to fake.
**Complexity:** Low.
**Dependencies:** None.

### D10. Tag hierarchy that matches menu structure
**What:** Beyond exhibit-category tags, every vault note gets a section tag derived from its folder: `#site/philosophy`, `#site/faq`, `#site/case-files/engineering-brief`. Enables Obsidian tag-pane browsing as an alternative to folder browsing.
**Why valuable:** Redundant nav paths are good in Obsidian — some users navigate by folders, others by tags, others by graph view.
**Complexity:** Low.
**Dependencies:** Menu map (T8).

---

## Anti-Features

Features to explicitly NOT build. Reasons included so they don't get re-added later.

### A1. Dataview queries inside vault notes
**Why avoid:** Dataview is a community plugin, not core Obsidian. Any `dataview` code block in a generated note breaks when the plugin isn't installed AND emits literal `\`\`\`dataview` on GitHub. If the vault content is supposed to be queryable, the exporter should pre-compute and emit plain markdown tables.
**Instead:** Pre-compute any cross-exhibit rollups (e.g., "all exhibits with HIGH severity findings") and emit them as regular markdown tables in MOC notes.

### A2. Copying images into the vault
**Why avoid:** The milestone explicitly says images are skipped. Committing images to `docs/` balloons the repository and duplicates content that already lives in `public/` for the live site.
**Instead:** Italicized alt-text captions (T10). If visual fidelity becomes important later, link to the live site's image URL as an external `![](https://...)` reference.

### A3. Bidirectional sync or round-tripping
**Why avoid:** This is an export, not a sync. Parsing edited `docs/` files back into JSON would require a full markdown AST walker and would permanently blur the ownership of content.
**Instead:** `docs/` is read-only output. Any content change happens in `src/data/json/` and then gets re-exported.

### A4. Search index (flexsearch, lunr, etc.)
**Why avoid:** GitHub has built-in search over markdown files in a repo. Obsidian has built-in full-text search over vault files. Shipping a third search index is pure overhead.
**Instead:** Nothing — rely on both platforms' native search.

### A5. Graph view customization or custom CSS snippets
**Why avoid:** These are per-vault user preferences, not vault content. The exporter should produce a vault that works with default Obsidian and let users customize their own instance.
**Instead:** Nothing.

### A6. Reproducing Vue component behavior
**Why avoid:** The ExhibitCard, FaqAccordionItem, etc. are presentational. The data they present is what goes in markdown. Trying to "port" the component structure into markdown makes the exporter a brittle duplicate of the render tree.
**Instead:** Export from JSON/data, not from the rendered DOM. Vue components should only be consulted when the copy isn't already in JSON (D7).

### A7. Per-section-type custom YAML schemas
**Why avoid:** Giving `timeline` sections their own frontmatter fields leaks internal section-type plumbing into vault metadata. The frontmatter should describe the whole note (title, tags, aliases, date), not the internal section shapes.
**Instead:** Frontmatter is page-level only. Section-level metadata goes in body content where it's visible on GitHub.

### A8. Lossless round-trip fidelity with Vue templates
**Why avoid:** Trying to match the exact rendered HTML of Vue templates (button styles, badge colors, card layouts, etc.) pulls the exporter toward HTML-in-markdown or custom CSS — neither of which works on GitHub or Obsidian out of the box.
**Instead:** Accept semantic fidelity (right text, right headings, right links, right tables) and skip visual fidelity.

### A9. Multi-language / i18n handling
**Why avoid:** The site is English-only and has no i18n infrastructure. Adding a language axis to the exporter adds complexity with zero users.
**Instead:** Single English output. Revisit if i18n is ever added to the site itself.

### A10. Hot-reload / watch mode for the exporter
**Why avoid:** The exporter runs on `npm run build` and the standalone `build:markdown` script. Watch mode implies the generated files are part of a feedback loop during development — but they're committed artifacts for browsing, not dev-loop files.
**Instead:** Run `build:markdown` manually when you want to regenerate. If this feels painful, the fix is making the script fast, not adding a watcher.

---

## Obsidian Conventions Reference

All items in this section are verified against `github.com/obsidianmd/obsidian-help` (`master` branch) — the canonical Obsidian help vault. This is the highest-authority source short of the closed-source app binary itself.

### Frontmatter: default (reserved) property names

Source: `en/Editing and formatting/Properties.md`.

Obsidian ships with three properties that have special behavior:

| Property | Type | Behavior |
|---|---|---|
| `tags` | List | Indexed by the tag pane. Must be a YAML list of strings. Do NOT prefix values with `#` inside the list. Nested tags use `/`. |
| `aliases` | List | Alternate names used in quick-switcher, wikilink autocomplete, and unlinked mentions. Must be a YAML list. |
| `cssclasses` | List | Adds CSS classes to the note wrapper for styling via CSS snippets. Not relevant to this exporter unless custom styling is needed. |

Additional conventional (but not reserved) properties commonly used:

| Property | Type | Convention |
|---|---|---|
| `title` | Text | Override the displayed title; overrides the filename in some plugins. |
| `date` / `created` / `updated` | Date or Text | Widely used by community plugins (Dataview, Calendar). No core Obsidian behavior; format matters only if a plugin consumes them. |
| `publish` | Checkbox | Used by Obsidian Publish. Omit if not using Publish. |
| `permalink` | Text | Used by Obsidian Publish. Omit. |
| `description` | Text | Common convention, no special behavior. |

### Frontmatter: YAML format rules (verified)

- Property names case-sensitive; values follow YAML spec.
- Markdown formatting is NOT rendered inside property values — intentional limitation.
- Nested properties (maps/objects) are not supported in the Obsidian UI (they render only in source mode). Stick to flat keys.
- Bulk-editing / multi-value operations are not supported in-UI.
- **Wikilinks inside text properties must be quoted**: `link: "[[Episode IV]]"`. Unquoted wikilinks in properties break.
- Each property name must be unique within a note.

### Links: syntax matrix (verified)

Source: `en/Linking notes and files/Internal links.md` and `en/Linking notes and files/Embed files.md`.

| Goal | Syntax | Notes |
|---|---|---|
| Link to a note | `[[Note name]]` or `[[Note name.md]]` | Equivalent; `.md` optional. |
| Link with display text | `[[Note name\|Display]]` | Pipe separator. Use for one-off labels; prefer `aliases` for reusable alternate names. |
| Link to a heading in another note | `[[Note#Heading]]` | Heading text must match exactly. |
| Link to a sub-heading | `[[Note#Heading#Subheading]]` | Multiple `#` permitted. |
| Link to a block | `[[Note#^block-id]]` | Block IDs are Latin letters, numbers, dashes only. |
| Embed a note inline | `![[Note]]` | Renders the note's content inline in Obsidian. On GitHub this shows as literal `![[Note]]` — **only use embeds in vault mode**. |
| Embed a heading or block | `![[Note#Heading]]` / `![[Note#^id]]` | Same caveat. |
| Markdown alternative | `[text](Note%20name.md)` | URL-encoded spaces. Works in both Obsidian and GitHub but loses wikilink benefits (no autocomplete, no auto-update on rename). |

**Invalid filename characters** (Obsidian-documented): `# | ^ : %% [[ ]]`. Also avoid OS filesystem reserved characters (`< > : " / \ | ? *` on Windows).

### Tags: format rules (verified)

Source: `en/Editing and formatting/Tags.md`.

- Inline tags: `#tagname` in body content.
- Frontmatter tags: YAML list under `tags:`, without `#` prefix.
- Allowed characters: letters, numbers, `_`, `-`, `/` (for nesting), most unicode.
- Must contain at least one non-numeric character (`#1984` is invalid, `#y1984` works).
- Case-insensitive but casing is preserved on first creation.
- **No spaces** — use camelCase, PascalCase, snake_case, or kebab-case.
- Nested tags: `#exhibit-type/investigation-report` matches both the parent `#exhibit-type` and the full nested path in search.

### Callouts (verified, relevant for quotes)

Source: `en/Editing and formatting/Callouts.md`.

```
> [!quote] Optional title
> Quote body. Can span multiple lines.
```

Valid types include `note`, `info`, `tip`, `warning`, `danger`, `quote`, `abstract`, `example`. On GitHub, the `[!quote]` directive is ignored and the content renders as a standard blockquote — graceful degradation.

### MOCs (Maps of Content)

**Source confidence:** MEDIUM (community convention, not core Obsidian doc).

A MOC is an index note that wikilinks out to a collection of related notes. By convention it lives at the root of its folder and shares the folder's name (e.g., `Case Files/Case Files.md`). The note body is usually a hand-curated or auto-generated outline with links, sometimes with short annotations. Obsidian does not enforce any MOC structure — it's pure convention — but the practice is widespread and the term is understood.

---

## Tabular Data Rendering Strategies

The site has three first-class typed tables (v4.0): `personnel`, `technologies`, `findings`. The exporter has to pick a markdown rendering strategy for each. Options evaluated:

| Strategy | Pros | Cons | Verdict |
|---|---|---|---|
| **GitHub-flavored markdown tables** | Universal, renders everywhere, grep-friendly, preserves tabular relationships | Wide tables wrap awkwardly on narrow screens (GitHub, Obsidian mobile); pipe characters in cell content must be escaped | **Recommended for `personnel` and `technologies`** |
| **Definition lists** (`term : definition`) | Natural for name-value pairs | GitHub doesn't render them as definition lists (they appear as literal text with colons); Obsidian renders them with a plugin only | Reject — portability failure |
| **Nested headings** (`#### Person Name\n- Title: ...\n- Org: ...`) | Generates TOC entries; each entry is wikilink-target-able in Obsidian | Enormous vertical sprawl; 66 personnel entries become 66 headings; pollutes heading hierarchy | Reject for personnel/technologies — acceptable only for findings where there are ~4 per exhibit and each finding has real narrative content |
| **HTML tables** (`<table>`) | Full control over width and multi-line cells | Break in many Obsidian themes; ugly in raw markdown view; defeats "idiomatic markdown" goal | Reject |

### Specific recommendations

- **Personnel table** → GitHub markdown table with columns: Name, Title, Organization (drop any column where all rows are empty; for `entryType: 'group'` entries render the single populated field in the Name column with an italicized *(group)* marker).
- **Technologies table** → GitHub markdown table with columns: Technology, Role/Purpose, Notes.
- **Findings table** → Hybrid: a nested-heading-per-finding (`#### Finding: ...`) with the supporting fields (description, resolution, outcome, category, severity) as a short bullet list beneath. Rationale: findings have real prose bodies that are badly cramped in table cells, and there are only ~4 per exhibit. Category and severity can also be rendered as inline tags (`#severity/high #category/architecture`) for Obsidian filtering.
- **Generic `sections[].type === "table"` blocks** → GitHub markdown table from the raw `columns` + `rows` arrays. Straightforward.
- **Timeline sections** → Bullet list with date-bolded lead: `- **September 5, 2017** — Dan Responds: body text here.`  Avoid tables for timelines because the `body` field is long-form prose.
- **Flow sections** → Ordered list (`1.`, `2.`, ...) since flow steps are inherently sequential.
- **Metadata sections** → Two-column markdown table (`| Key | Value |`) since all metadata sections inspected are flat key-value pairs.

### Pipe-escaping rule (critical)

Any cell content that contains a literal `|` must escape it as `\|` or wrap the cell in `` ` `` backticks. Content with newlines inside a cell must be replaced with `<br>` (GFM) or joined with `; `. Content in personnel `title` fields currently has no pipes (verified by inspection of `exhibits.json`), but the escape pass is still required defensively.

---

## Internal Link Rewriting: Per-Format Rules

The site has internal links in several places:
- `faq.json` → `exhibitUrl: "/exhibits/exhibit-j"` (6 entries) — structured.
- FAQ answer prose → phrases like "see Philosophy page", "see the FAQ" — unstructured.
- Exhibit section body text → generally self-contained, no cross-exhibit prose links detected.
- Vue SFC page templates → `<RouterLink to="/philosophy">` — only visible to the exporter if Strategy (a) of D7 is chosen (copy relocated to JSON).

### Rewrite rules

| Source form | Monolithic target | Vault target |
|---|---|---|
| `/exhibits/exhibit-j` | `[Exhibit J](#exhibit-j-gm-course-completion-investigation)` (GFM slug of the heading) | `[[Exhibit J - GM Course Completion Investigation]]` |
| `/philosophy` | `[Philosophy](#philosophy)` | `[[Philosophy]]` |
| `/faq#question-id` | `[FAQ: ...](#faq-question-id)` | `[[FAQ#Question text]]` |
| External `https://...` URL | Preserved as-is | Preserved as-is |
| Prose phrase "see the Philosophy page" (unstructured) | Left as-is (no autolinking of prose) | Left as-is |

**Rationale for not autolinking prose:** Auto-detecting "Philosophy page" in free text and rewriting it as a link is an NLP problem with a high false-positive rate. The structured link sources (`exhibitUrl`, explicit route strings) cover the high-signal cases; unstructured prose references stay as prose.

**Slug collision handling:** When two headings would produce the same slug (e.g., two "Background" sections in different exhibits in the monolithic doc), append `-1`, `-2`, etc., matching GitHub's behavior. The `github-slugger` npm package implements this correctly; reimplementation is ~30 lines.

---

## MVP vs Stretch Prioritization

If scope pressure demands a cut, the minimum viable exporter is T1–T15 (all Table Stakes). That produces a working, committed, browse-able pair of artifacts. Differentiators D1, D3, D4, D6, D8 are low-cost additions that dramatically improve perceived quality and should be included if the MVP comes in under budget. D2, D5, D7 are higher-cost and should be sequenced as follow-up work.

**Hard minimum (cannot ship without):**
T1 (determinism), T2 (build integration), T3 (heading hierarchy), T5 (link rewriting), T6 (frontmatter), T7 (wikilinks), T8 (folder structure), T11 (tables), T15 (all section types rendered).

**Near-minimum (ship is ugly without):**
T4 (TOC), T9 (tags), T10 (image handling), T12 (heading depth), T13 (FAQ), T14 (filenames).

**Quick wins to include in MVP if possible:**
D3 (callouts — low effort, big polish), D6 (mono-doc GFM-only mode — forced by T3 anyway), D8 (generated-file banner — trivial), D4 (aliases — low effort).

---

## Open Questions

These are genuine unknowns that will block or shape implementation and should be resolved before or during the requirements phase.

1. **Where does page copy for HomePage/PhilosophyPage/ContactPage live?** Significant prose is currently in Vue SFC templates, not JSON. Does v7.0 also move that copy into JSON (D7 strategy a), or does the exporter parse SFCs (strategy b/c)? This single decision probably doubles or halves milestone scope. **Strong recommendation:** extract copy to JSON as part of v7.0 — it aligns with the v3.0 "CMS-ready data layer" direction and makes v7.0 a reinforcing investment rather than a one-off.

2. **Tag namespace for exhibit categories.** Should the tag be `#exhibit-type/investigation-report` or `#case-file/investigation-report` or just `#investigation-report`? The nested form is recommended for Obsidian-idiomatic navigation, but requires a naming decision.

3. **Should FAQ items be one note per question, or one note per page with questions as H3 sections?** One-note-per-question maximizes wikilink granularity (you can `[[What does 28 years of experience actually mean]]`) but creates 27 small files. One-note-per-page keeps the vault cleaner but makes wikilinks coarser. Recommend: one note per page, questions as H3, with block anchors (`^id`) for deep linking.

4. **Does the monolithic doc include ALL 15 exhibit details, or just a summary with links?** If all details inline, the file is long (estimated 50-100 KB). If summaries only, the "entire site in one file" promise isn't met. Recommend: all details inline — GitHub handles long markdown files fine, and the TOC + anchor links make navigation usable.

5. **What happens to the `/review` and `/diag/personnel` routes?** These are diagnostic/internal routes not in the user-facing menu. Recommend: exclude from both outputs. They're not part of the "site" that the export is meant to preserve.

6. **Exhibit filename format — `Exhibit A.md` or `Exhibit A - Title.md` or `exhibit-a.md`?** This affects wikilink ergonomics (`[[Exhibit A]]` is most natural) and filesystem browsing legibility (`Exhibit A - Cross-Domain SCORM Resolution.md` is most informative). Recommend: `Exhibit A - Short Title.md` with `aliases: ["Exhibit A", "Cross-Domain SCORM Resolution", "Electric Boat"]` so both wikilink forms work.

7. **Does the `docs/` folder get a `.gitattributes` entry marking generated files as linguist-generated?** Would keep the exporter's output from inflating Dan's GitHub language stats. Low-cost, recommend yes.

8. **What Node/TypeScript stack does the exporter run on?** Vite uses Node + ESM. The exporter should be plain TypeScript compiled on the fly (`tsx` or `vite-node`) to keep one toolchain — avoid introducing `ts-node`, Babel, etc. See STACK.md for detail.

---

## Sources

- `github.com/obsidianmd/obsidian-help` (master branch, authoritative Obsidian help vault)
  - `en/Editing and formatting/Properties.md` — YAML frontmatter conventions, default property names, format rules
  - `en/Linking notes and files/Internal links.md` — wikilinks, heading links, block links, aliases, invalid characters
  - `en/Linking notes and files/Embed files.md` — embed syntax (`![[...]]`)
  - `en/Editing and formatting/Tags.md` — tag format rules, nested tags, YAML list format
  - `en/Editing and formatting/Callouts.md` — callout syntax, gracefully-degrading directives
- `src/data/json/exhibits.json` (inspected — all 5 section variants confirmed: text, table, timeline, metadata, flow)
- `src/data/json/faq.json` (inspected — 6 `exhibitUrl` cross-references confirmed)
- `src/router.ts` (inspected — 9 primary routes, 2 redirects, 1 dynamic exhibit route, 2 diag routes, 1 catch-all)
- `.planning/PROJECT.md` (inspected — v7.0 milestone goals)
- GitHub Flavored Markdown slug behavior: community-standard, implemented by `github-slugger` npm package. MEDIUM confidence (no single canonical spec document, but implementation is stable and widely mirrored).
- MOC (Map of Content) convention: Linking Your Thinking community. MEDIUM confidence (community convention, not core Obsidian).
