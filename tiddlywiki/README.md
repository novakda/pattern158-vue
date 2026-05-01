# Pattern 158 TiddlyWiki

Tzk-inspired directory layout for the Pattern 158 portfolio wiki. The
generator re-reads `static-site/*.html` + `src/data/json/*.json`, composes a
deterministic tiddler list, and writes `.tid` files here. TiddlyWiki builds a
single-file HTML wiki from those tiddlers.

See also:
- [`/scripts/tiddlywiki/README.md`](../scripts/tiddlywiki/README.md) — generator
  architecture, module index, tiddler-type reference, troubleshooting.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — editing guide: direct-edit vs
  regenerate, merge-conflict resolution, when to re-capture.

## Directory layout

```
tiddlywiki/
├── tiddlers/          # canonical source — git-tracked .tid files
├── config/            # reserved for future custom plugin / theme config
├── build/             # reserved for future shell helpers (pnpm scripts
│                      # currently cover every build path — see below)
├── output/            # build artifacts (gitignored via .gitignore)
│   ├── index.html     # public wiki (filter: [!tag[private]])
│   └── all.html       # full wiki (no filter, local authoring)
├── pattern158-tiddlers.json  # drag-drop byproduct (regenerable)
├── tiddlywiki.info    # TiddlyWiki manifest (emitted by the generator)
├── CONTRIBUTING.md
└── README.md
```

`tiddlers/` is the source of truth. `output/` is regenerable. The generator
never deletes files it did not author, so hand-authored theme tiddlers (e.g.
`$__plugins_pattern158_*`) under `tiddlers/` survive every regenerate.

## Workflow

### 1. Regenerate tiddlers from source data

```bash
pnpm tiddlywiki:generate
```

Runs the Phase 53 extractor layer + Phase 54 atomic generators + iter-1
`sources.ts` helpers through `scripts/tiddlywiki/generate.ts`. Every
generator-emitted tiddler is tagged `public` by default (TZK-01) unless it
already declares itself `private` or `public`. Output lands in
`tiddlers/*.tid` + `pattern158-tiddlers.json` + `tiddlywiki.info`.

### 2. Review + commit source changes

```bash
git diff tiddlywiki/tiddlers/
git add tiddlywiki/tiddlers/ tiddlywiki/tiddlywiki.info tiddlywiki/pattern158-tiddlers.json
git commit -m "chore(tiddlywiki): regenerate from source data"
```

The generator is deterministic (SCAF-08 discipline) — byte-identical output
across runs on identical inputs. Non-empty diffs indicate real data-level
changes.

### 3. Build the public wiki (TZK-02 + TZK-04)

```bash
pnpm tiddlywiki:build-public
```

Produces `output/index.html` with filter `[!tag[private]]` applied via
`$:/core/save/all`'s `publishFilter` variable. This file is deploy-ready for
`pattern158.solutions/wiki/` or similar subpath.

### 4. Build the full wiki (local authoring)

```bash
pnpm tiddlywiki:build-all
```

Produces `output/all.html` with no filter. Useful for reviewing drafts /
private tiddlers locally without a filter-gated build.

### Convenience combo

```bash
pnpm tiddlywiki            # regenerate + build-public in one shot
```

## Public / private tag workflow (TZK-01)

Every tiddler gets the `public` tag unless it already carries `public` or
`private`.

- **`public`** — visible in `output/index.html`. Default for every
  generator-emitted tiddler.
- **`private`** — excluded from `output/index.html`; visible in
  `output/all.html`. Use for drafts, internal notes, staging content.

You can add/remove tags:

- Via the TiddlyWiki UI (round-trips through `tiddlers/*.tid` because the
  TiddlyWeb plugin is enabled).
- Directly in the `.tid` file header (manual edit).

The generator preserves `private` tags on round-trip: a tiddler you tag
`private` in the UI stays `private` across `pnpm tiddlywiki:generate` runs as
long as it lives under `tiddlers/`.

### When to use `private`

- Drafts of a new exhibit or testimonial not yet cleared for publication.
- Internal planning / TODO tiddlers kept alongside the wiki for context.
- Staging content under review before a redeploy.
- Client-confidential variants parked inline with their public counterparts.

Anything tagged `private` survives in `tiddlywiki/tiddlers/` (git-tracked)
and in `output/all.html` (local full-wiki), but never reaches
`output/index.html` (deploy artifact).

### Tag taxonomy

Complete set of tags produced by the v9.0 pipeline. Tags marked **(core)**
are applied by `withPublicTag` in `generate.ts`; the rest come from the
atomic generators or composite sources.

| Tag                          | Meaning                                                                 | Applied by                                     |
| ---------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| `public` **(core)**          | Visible in the public build; default on all generated tiddlers          | `generate.ts:withPublicTag`                    |
| `private` **(core)**         | Excluded from the public build; preserved on round-trip                 | Author (UI or direct edit)                     |
| `page`                       | Top-level page tiddler (Home, Philosophy, Technologies, Contact, …)     | `page-content-to-tiddlers.ts`, indexes         |
| `case-files`                 | The sortable Case Files Index tiddler                                   | `sources.ts:caseFilesIndexTiddler`             |
| `exhibit`                    | Per-exhibit investigation-report / engineering-brief tiddler            | `sources.ts:exhibitsToTiddlers`                |
| `investigation-report`       | Exhibit subtype — full post-mortem narrative                            | `sources.ts:exhibitsToTiddlers`                |
| `engineering-brief`          | Exhibit subtype — focused technical brief                               | `sources.ts:exhibitsToTiddlers`                |
| `[[<Client>]]`               | Client-name tag on exhibit + person tiddlers (bracketed for multi-word) | `exhibitsToTiddlers`, `emitPersonTiddlers`     |
| `person`                     | Atomic personnel tiddler                                                | `generators/person.ts`                         |
| `entry-type-individual`      | Person sub-tag — named individual                                       | `generators/person.ts`                         |
| `entry-type-group`           | Person sub-tag — collective entry (e.g. "15+ Team Members")             | `generators/person.ts`                         |
| `entry-type-anonymized`      | Person sub-tag — role-only entry with no personal name                  | `generators/person.ts`                         |
| `finding`                    | Atomic finding tiddler                                                  | `generators/finding.ts`                        |
| `severity-<slug>`            | Finding severity (e.g. `severity-high`, `severity-critical`)            | `generators/finding.ts`                        |
| `category-<slug>`            | Finding category (e.g. `category-scorm-compliance`)                     | `generators/finding.ts`                        |
| `[[Exhibit <letter>]]`       | Per-finding back-ref to the source exhibit tiddler                      | `generators/finding.ts`                        |
| `technology`                 | Atomic technology tiddler                                               | `generators/technology.ts`                     |
| `testimonial`                | Atomic testimonial tiddler                                              | `generators/testimonial.ts`                    |
| `[[<SourcePage>]]`           | Testimonial back-ref — e.g. `[[Home]]`, `[[Exhibit A]]`                 | `generators/testimonial.ts`                    |
| `faq`                        | FAQ Index tiddler + every FAQ item tiddler                              | `sources.ts:faqIndexTiddler`, `faqItemsToTiddlers` |
| `<faq-category-slug>`        | Per-FAQ-item category tag (1..N per item)                               | `sources.ts:faqItemsToTiddlers`                |
| `$:/tags/Stylesheet`         | Theme stylesheet — hand-authored                                        | Manual (theme plugin)                          |
| `$:/tags/ViewTemplate`       | Theme view template — hand-authored                                     | Manual (theme plugin)                          |
| `$:/tags/Palette`            | Theme palette — hand-authored                                           | Manual (theme plugin)                          |

## Build targets reference

The generator writes three targets into `tiddlywiki.info.build`:

| Target         | Filter              | Output file                 | Use case                     |
| -------------- | ------------------- | --------------------------- | ---------------------------- |
| `index`        | (none, legacy)      | `index.html`                | backward-compat / docs       |
| `public-index` | `[!tag[private]]`   | `output/index.html`         | deploy                       |
| `all-index`    | (none)              | `output/all.html`           | local full-wiki authoring    |

Each target is invoked by the corresponding pnpm script above. Internally
they call `tiddlywiki tiddlywiki --build <target-name>` through the
`tiddlywiki` CLI shipped via `devDependencies`.

## Deploy

The public build is a single self-contained HTML file. No server-side
runtime, no database, no build pipeline beyond the one this repo ships.

**Simple copy deploy:**

```bash
pnpm tiddlywiki              # regenerate + build-public
# tiddlywiki/output/index.html is now deploy-ready (~2.8MB)

# Example — SCP to a static webserver:
scp tiddlywiki/output/index.html user@host:/var/www/pattern158.solutions/wiki/index.html

# Or — copy under a subpath of whatever static host you're using:
cp tiddlywiki/output/index.html /path/to/static/site/wiki/index.html
```

The HTML is self-contained: open `tiddlywiki/output/index.html` directly in
a browser to preview exactly what a deploy target will serve. TiddlyWiki's
core + plugins + stylesheet + every public tiddler are all inlined.

No CI wiring is required and none is recommended at this milestone — the
build is fast (2–4s for `build-public`), deterministic, and the artifact is
git-ignorable. Treat the `output/*.html` files as ephemeral and rebuild
before each deploy.

**What's in the public build vs. the full build:**

| Content                                   | `output/index.html` (public) | `output/all.html` (full) |
| ----------------------------------------- | ---------------------------- | ------------------------ |
| Every `public`-tagged tiddler             | yes                          | yes                      |
| Pattern 158 theme plugins                 | yes (all tagged `public`)    | yes                      |
| `private`-tagged drafts / internal notes  | no                           | yes                      |
| Legacy iter-1 tiddlers without `public`   | no (filtered out)            | yes                      |

## Git cadence

The generator's determinism (SCAF-08) is the foundation of a sane git
workflow: every `pnpm tiddlywiki:generate` produces byte-identical output
on identical inputs, so any non-empty diff under
`git diff tiddlywiki/tiddlers/` reflects a real upstream data change.

**Standard content-change loop:**

```bash
# 1. Edit upstream content (static-site HTML, JSON data, or re-capture).
pnpm editorial:capture         # only if re-running the Playwright capture

# 2. Regenerate.
pnpm tiddlywiki:generate

# 3. Inspect the diff — every hunk should correspond to an intentional change.
git diff tiddlywiki/tiddlers/ | less

# 4. Commit the tiddler diff separately from the upstream source diff.
git add tiddlywiki/tiddlers/ tiddlywiki/tiddlywiki.info tiddlywiki/pattern158-tiddlers.json
git commit -m "chore(tiddlywiki): regenerate from <source>"

# 5. Rebuild + deploy when ready.
pnpm tiddlywiki
```

**What to commit:**

- **Yes, commit:** all `.tid` files under `tiddlywiki/tiddlers/`,
  `tiddlywiki/tiddlywiki.info`, `tiddlywiki/pattern158-tiddlers.json`. These
  are the canonical serialized form of the wiki. Theme tiddlers
  (`$__plugins_pattern158_*`) belong in git because the generator doesn't
  recreate them.
- **Yes, commit:** generator source changes under `scripts/tiddlywiki/`
  and upstream content changes under `static-site/` or `src/data/json/`.
  These drive the tiddler diffs.
- **No, don't commit:** `tiddlywiki/output/*.html` — gitignored, rebuilt on
  demand.
- **No, don't commit:** `$__StoryList.tid` — gitignored because TiddlyWiki
  rewrites it on every user interaction and the noise is not useful
  history.

**When diffs surprise you:**

- If `pnpm tiddlywiki:generate` produces a non-empty diff without any
  upstream change, something in the generator is non-deterministic.
  Investigate — SCAF-08 forbids it.
- If a regenerate clobbers a tiddler you expected to preserve, the
  tiddler's title is in the generator's composed list. See the
  [editing guide](CONTRIBUTING.md) for the direct-edit vs regenerate
  decision.

## How to iterate

The wiki supports two edit paths. Pick based on whether the change lives
in upstream source data or in the wiki's own presentation.

### Direct edit in the TiddlyWiki UI

Use for:

- **Theme + palette tweaks** — `$:/plugins/pattern158/styles`,
  `$:/plugins/pattern158/palette/*`, `$:/plugins/pattern158/view/*`.
- **Site meta** — `$:/SiteTitle`, `$:/SiteSubtitle`, `$:/DefaultTiddlers`
  (these *are* in the generator's composed list, but the source lives in
  `scripts/tiddlywiki/sources.ts:siteMetaTiddlers` — edit there if the
  change should persist across regenerates; edit in the UI only for
  transient experiments).
- **Adding `private`-tagged drafts** — quick notes that never need to
  round-trip through the generator.

The TiddlyWeb + filesystem plugins are enabled, so UI edits round-trip
into `tiddlers/*.tid` when you run a filesystem-backed TW server. For
single-file HTML viewing, edits won't persist — serve the edition via
`npx tiddlywiki tiddlywiki --server`.

### Regenerate from upstream source

Use for:

- **Exhibit content** — edit `static-site/exhibits/exhibit-<letter>.html`
  (or the upstream Vue source + re-capture) then `pnpm tiddlywiki:generate`.
- **FAQ entries** — edit `src/data/json/faq.json` or
  `static-site/faq.html` then regenerate.
- **Page copy** (Home, Philosophy, Technologies, Contact, Accessibility) —
  edit `static-site/*.html` then regenerate.
- **Case files index** — edit `src/data/json/exhibits.json` then
  regenerate.
- **Tiddler templates / body formatting** — edit the atomic generator
  under `scripts/tiddlywiki/generators/` or `sources.ts`, then regenerate.

**Rule of thumb:** if the change applies to content that originates from
the Vue site or its JSON data, edit upstream and regenerate. If the
change applies to presentation (colors, layout, view templates) or to
transient drafts, edit in place.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for a full decision tree and
merge-conflict resolution guidance.
