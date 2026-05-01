# Contributing to the Pattern 158 TiddlyWiki

Editing guide for the Pattern 158 wiki. The wiki has two sources of truth
that you must keep straight — otherwise edits get silently clobbered on
the next regenerate.

See also:
- [`README.md`](README.md) — directory layout, tag taxonomy, deploy,
  git cadence, iteration patterns.
- [`/scripts/tiddlywiki/README.md`](../scripts/tiddlywiki/README.md) —
  generator architecture, module index, tiddler-type reference,
  troubleshooting.

## The two edit paths

Every tiddler under `tiddlywiki/tiddlers/` is owned by exactly one of
these paths:

1. **Generator-owned** — written by `pnpm tiddlywiki:generate` from
   upstream source data. Edits in place get clobbered on the next
   regenerate.
2. **Author-owned** — theme plugins, site-meta overrides, `private`
   drafts, anything the generator doesn't emit. Edit in place; the
   generator preserves these.

Knowing which path you're on is the difference between a durable edit
and a phantom one.

## Decision tree: direct-edit vs regenerate

```
┌─────────────────────────────────────────────────┐
│ I want to change a tiddler.                     │
└─────────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Does the tiddler title appear in                │
│ scripts/tiddlywiki/generate.ts's composed list? │
│ (pages, exhibits, findings, personnel,          │
│  technologies, testimonials, FAQ, case files    │
│  index, site-meta)                              │
└─────────────────────────────────────────────────┘
         │                                │
        YES                               NO
         │                                │
         ▼                                ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│ Generator-owned.         │   │ Author-owned.            │
│ Editing the .tid file    │   │ Edit the .tid file       │
│ directly will be lost    │   │ directly and commit.     │
│ on next regenerate.      │   │                          │
│                          │   │ Examples:                │
│ Instead:                 │   │  • $:/plugins/pattern158 │
│  1. Edit upstream source │   │    /styles               │
│     (HTML / JSON / TS)   │   │  • $:/plugins/pattern158 │
│  2. pnpm tiddlywiki:gen  │   │    /palette/*            │
│  3. git diff tiddlers/   │   │  • $:/plugins/pattern158 │
│  4. Commit the hunks     │   │    /view/*               │
│                          │   │  • private-tagged drafts │
│                          │   │  • $:/SiteTitle if you   │
│                          │   │    don't want it to      │
│                          │   │    round-trip back to    │
│                          │   │    the generator source  │
└──────────────────────────┘   └──────────────────────────┘
```

### Which titles are generator-owned?

Run this check to see the exhaustive list:

```bash
pnpm tiddlywiki:generate    # writes its full composed list
```

Then:

```bash
ls tiddlywiki/tiddlers/ | wc -l     # total tiddlers in tiddlers/
```

Any tiddler whose `.tid` file is freshly modified after a regenerate is
generator-owned. Everything else (theme plugins, `$__StoryList`, private
drafts) is author-owned.

Concretely, the generator composes (see
`scripts/tiddlywiki/generate.ts:composeAllTiddlers`):

- Site meta: `$:/SiteTitle`, `$:/SiteSubtitle`, `$:/DefaultTiddlers`
- Pages: `Home`, `Philosophy`, `Technologies`, `Contact`,
  `Accessibility`
- Case Files Index + one tiddler per exhibit (`Exhibit A`, `Exhibit B`,
  …)
- One atomic tiddler per unique person / finding / technology /
  testimonial across the exhibit corpus
- FAQ Index + one tiddler per FAQ question

**Anything else** is author-owned. That set currently includes:

- Theme plugins: `$:/plugins/pattern158/styles`,
  `$:/plugins/pattern158/palette/{default,dark,light}`,
  `$:/plugins/pattern158/view/{exhibit,finding,person,testimonial}`
- `$:/StoryList` (gitignored; TiddlyWiki rewrites it every interaction)
- Anything you create with the `private` tag

## When to re-capture vs edit in place

The generator's upstream source is `static-site/*.html` — the Playwright
capture of the rendered Vue app (`pnpm editorial:capture`). For content
changes that originate in the Vue site:

1. Edit the Vue source (`src/pages/*.vue`, `src/data/json/*.json`, or
   wherever the content actually lives).
2. Re-run the capture: `pnpm editorial:capture` (writes new
   `static-site/*.html`).
3. Regenerate: `pnpm tiddlywiki:generate` (writes new
   `tiddlywiki/tiddlers/*.tid`).
4. Inspect + commit: `git diff tiddlywiki/tiddlers/` then commit.

**Edit-in-place, skip the capture** when:

- Changing theme / palette / view-template tiddlers (author-owned).
- Adding a `private`-tagged draft (author-owned).
- Overriding a site-meta tiddler manually and deliberately wanting it
  to drift from the generator source (rare — usually you should edit
  `scripts/tiddlywiki/sources.ts:siteMetaTiddlers` instead so the drift
  is permanent and the source of truth is one place).

**Edit upstream + regenerate** when:

- Fixing a typo in any exhibit body.
- Adding / removing an FAQ item.
- Rewriting any page tiddler body (Home, Philosophy, Technologies, …).
- Adding a new person / finding / technology / testimonial to an exhibit.
- Changing the Case Files Index row ordering (edit
  `src/data/json/exhibits.json`).

**Edit the generator** (`scripts/tiddlywiki/*.ts`) when:

- Changing the *shape* of a generated tiddler type — title format, tag
  set, body template, field layout. Phase 54 atomic generators are
  LOCKED; transformations belong at the composition boundary
  (`generate.ts:composeAllTiddlers` / `withPublicTag`).
- Changing site-meta defaults (`siteMetaTiddlers` in `sources.ts`).
- Fixing an orphan-link class (find the title-formula mismatch; both
  the emitter in `helpers.ts` / `exhibit-cross-links.ts` and the atomic
  generator's `titleFor` must agree).

## Merge conflicts on `.tid` files

`.tid` files are line-based and git-mergeable in principle, but in
practice most conflicts are better resolved by regenerating than by
hand-merging. The generator produces byte-identical output on identical
inputs (SCAF-08), so the canonical content is one `pnpm
tiddlywiki:generate` away.

### Generator-owned tiddler conflicts

If the conflict is in a tiddler whose title appears in the composed list:

1. Accept either side of the merge mechanically (`git checkout --ours`
   or `git checkout --theirs` — doesn't matter).
2. Resolve the upstream conflict instead (`static-site/*.html`,
   `src/data/json/*.json`, or the generator source under
   `scripts/tiddlywiki/`).
3. `pnpm tiddlywiki:generate` — regenerates the tiddler from the now-
   clean upstream state.
4. `git add tiddlywiki/tiddlers/` and complete the merge.

Hand-merging a generator-owned `.tid` file is *never* the right answer:
the next regenerate will overwrite your hand-merge anyway, and the
conflict was almost certainly upstream in the first place.

### Author-owned tiddler conflicts

Theme / palette / view-template / `private`-draft tiddlers conflict the
usual way. Hand-merge, run `pnpm tiddlywiki:build-all` to sanity-check,
commit.

### `tiddlywiki.info` conflicts

Emitted by `scripts/tiddlywiki/tid-writer.ts:writeTiddlywikiInfo`. If
this file conflicts, regenerate:

```bash
pnpm tiddlywiki:generate
git add tiddlywiki/tiddlywiki.info
```

Hand-edits here are pointless — the next generate overwrites them.

### `pattern158-tiddlers.json` conflicts

Same story — it's a pure byproduct of `tiddlersToJson(tiddlers)` in
`tid-writer.ts`. Regenerate and commit.

## Making a change end-to-end — worked examples

### Example 1: Fix a typo in an exhibit finding

The finding body is part of an exhibit investigation. Upstream source:
`static-site/exhibits/exhibit-<letter>.html`.

```bash
# 1. Find and fix the typo upstream.
$EDITOR static-site/exhibits/exhibit-a.html

# 2. Regenerate.
pnpm tiddlywiki:generate

# 3. Verify the diff is scoped to what you expected.
git diff tiddlywiki/tiddlers/A\ Finding_*.tid

# 4. Run the integrity gate.
pnpm tsx scripts/tiddlywiki/verify-integrity.ts

# 5. Commit.
git add static-site/exhibits/exhibit-a.html tiddlywiki/tiddlers/
git commit -m "fix(exhibit-a): correct SCORM finding wording"
```

### Example 2: Update the wiki site title

The title is emitted by `siteMetaTiddlers()`. Editing `$:/SiteTitle.tid`
directly would be clobbered on the next regenerate.

```bash
# 1. Edit the generator source.
$EDITOR scripts/tiddlywiki/sources.ts     # change text in siteMetaTiddlers()

# 2. Regenerate.
pnpm tiddlywiki:generate

# 3. Commit both together.
git add scripts/tiddlywiki/sources.ts tiddlywiki/tiddlers/\$__SiteTitle.tid
git commit -m "chore(tiddlywiki): update site title"
```

### Example 3: Tweak the dark palette

Palette tiddlers are author-owned theme plugins.

```bash
# 1. Edit the palette tiddler directly.
$EDITOR tiddlywiki/tiddlers/\$__plugins_pattern158_palette_dark.tid

# 2. Rebuild the full wiki to preview.
pnpm tiddlywiki:build-all
# open tiddlywiki/output/all.html

# 3. Commit.
git add tiddlywiki/tiddlers/\$__plugins_pattern158_palette_dark.tid
git commit -m "style(tiddlywiki): tune dark palette contrast"
```

### Example 4: Park a draft exhibit as `private`

```bash
# 1. Create the tiddler in the UI tagged `private`, or author a .tid file
#    directly under tiddlywiki/tiddlers/.
cat > tiddlywiki/tiddlers/Exhibit\ Draft.tid <<'EOF'
created: 20260421000000000
modified: 20260421000000000
tags: private exhibit
title: Exhibit Draft
type: text/vnd.tiddlywiki

Draft body. Not for publication yet.
EOF

# 2. Verify it's excluded from the public build.
pnpm tiddlywiki:build-public
grep -c "Exhibit Draft" tiddlywiki/output/index.html   # → 0

# 3. Verify it's present in the full build.
pnpm tiddlywiki:build-all
grep -c "Exhibit Draft" tiddlywiki/output/all.html     # → ≥1

# 4. Commit.
git add tiddlywiki/tiddlers/Exhibit\ Draft.tid
git commit -m "chore(tiddlywiki): add Exhibit Draft (private)"
```

## Checklist before committing wiki changes

- [ ] Ran `pnpm tiddlywiki:generate` if upstream content changed.
- [ ] Ran `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` — zero
      orphan links.
- [ ] Diff under `tiddlywiki/tiddlers/` matches the intent of the
      change (no surprise drift).
- [ ] Did not commit `tiddlywiki/output/*.html` (gitignored).
- [ ] Did not commit `$__StoryList.tid` (gitignored).
- [ ] If this is a generator-owned tiddler fix, upstream source is
      committed alongside the regenerated `.tid` files.
