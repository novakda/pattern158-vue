# Pattern 158 TiddlyWiki

Tzk-inspired directory layout for the Pattern 158 portfolio wiki. The
generator re-reads `static-site/*.html` + `src/data/json/*.json`, composes a
deterministic tiddler list, and writes `.tid` files here. TiddlyWiki builds a
single-file HTML wiki from those tiddlers.

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
