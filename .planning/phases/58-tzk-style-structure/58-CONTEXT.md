# Phase 58: Tzk-Style Structure - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Formalize a tzk-inspired directory structure + public/private build pipeline under `tiddlywiki/`. Default every generator-emitted tiddler to the `public` tag; add `[!tag[private]]` filter build variant. Ensure generate + build scripts are idempotent and deploy-ready.

Out of scope:
- Actually publishing to pattern158.solutions/wiki (deployment config only; no DNS).
- New tiddler types (Phase 54 + 55 scope).

</domain>

<decisions>
## Implementation Decisions

### Directory Layout (TZK-05)
- `tiddlywiki/tiddlers/` — canonical source (git-tracked, already in place).
- `tiddlywiki/output/` — build artifacts (gitignored).
- `tiddlywiki/config/` — theme CSS + custom plugin config + site-meta; move Phase 57 `$__plugins_pattern158_*` files HERE if the generator supports multi-source loading; otherwise leave in `tiddlers/` and document.
- `tiddlywiki/build/` — build scripts (`build-public.sh`, `build-all.sh`).
- `tiddlywiki/README.md` — workflow doc (also serves DOC-02 scope via reference from Phase 59).

**Pragmatic recommendation:** Keep theme files under `tiddlywiki/tiddlers/` (Phase 57 location) since TiddlyWiki auto-discovers them. The `tiddlywiki/config/` dir exists but holds only build-script configuration JSON. This aligns with the existing `tiddlywiki.info` convention.

### Public/Private Tag Strategy (TZK-01)
- **Every generator-emitted tiddler gets `public` tag by default** — update `scripts/tiddlywiki/sources.ts` + `scripts/tiddlywiki/generators/*` prepend step. Actually, since Phase 54 generators are LOCKED, handle this at the `generate.ts` composition layer: apply a `withPublicTag(tiddler)` transform to the full list before write.
- `private` tag available for drafts/notes (user-authored via TW UI).
- Filter: `[!tag[private]]` or `[tag[public]]` (functionally equivalent since everything is public-by-default; prefer `[!tag[private]]` so user-tagged private content is excluded even if they forget to add `public`).

### Build Pipeline (TZK-02 + TZK-04)
- New pnpm scripts in `package.json`:
  - `tiddlywiki:build-public`: `npx tiddlywiki tiddlywiki --build public-index` (uses tiddlywiki.info `build.public-index` config with filter `[!tag[private]]`)
  - `tiddlywiki:build-all`: `npx tiddlywiki tiddlywiki --build all-index` (full build, no filter)
- Update `tiddlywiki.info` to declare both build targets.
- Output at `tiddlywiki/output/index.html` (public) and `tiddlywiki/output/all.html` (full).
- Add `tiddlywiki/output/` to `.gitignore`.

### Git Workflow (TZK-03)
- `tiddlywiki/tiddlers/*.tid` is the source of truth — checked into git.
- Regeneration flow: `pnpm tiddlywiki:generate` → `git diff tiddlywiki/tiddlers/` → review → commit.
- Document this workflow in `tiddlywiki/README.md`.

### Idempotency
- `pnpm tiddlywiki:generate` must produce byte-identical output across runs (already the case per SCAF-08 discipline).
- `pnpm tiddlywiki:build-public` must produce deterministic HTML (TiddlyWiki's build is deterministic by default).

### Phase 57 Follow-Up (Flagged)
- Phase 57 SUMMARY flagged that `scripts/tiddlywiki/sources.ts:siteMetaTiddlers()` hardcodes a subtitle that overwrites Phase 57's `$__SiteSubtitle` override. Fix: update `siteMetaTiddlers()` to emit the Phase 57 Pattern-158-branded subtitle ("Evidence-Based Portfolio"). This is a 1-line edit in Phase 58 scope (touches generate.ts boundary).

### Autonomous Gate
- Smoke gate: `pnpm tiddlywiki:generate` exits 0 + `pnpm tiddlywiki:build-public` exits 0 + `tiddlywiki/output/index.html` exists AND has non-zero byte count AND does NOT contain any `private`-tagged tiddler body text (verifiable via grep if we plant a sample).

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/tiddlywiki/generate.ts:composeAllTiddlers` — the composition point for the `withPublicTag` transform.
- `scripts/tiddlywiki/tid-writer.ts:writeTiddlywikiInfo` — emits the current `tiddlywiki.info` with a single `build.index` target; extend to add `public-index` + `all-index` targets.
- `scripts/tiddlywiki/sources.ts:siteMetaTiddlers` — the small override-able function.

### Established Patterns
- pnpm scripts in `package.json` use kebab-case colon-separators (`tiddlywiki:generate`, `tiddlywiki:build`).

### Integration Points
- Phase 59 docs reference TZK-02 + TZK-03 workflows.

</code_context>

<specifics>
## Specific Ideas

- 4-5 plans:
  - Plan 58-01: Add `public` tag default + `withPublicTag` transform in generate.ts. (TZK-01)
  - Plan 58-02: Extend `writeTiddlywikiInfo` with `public-index` + `all-index` build targets. (TZK-02)
  - Plan 58-03: Add pnpm scripts + `.gitignore` entry + fix siteMetaTiddlers subtitle. (TZK-02 + TZK-04 + Phase 57 follow-up)
  - Plan 58-04: Directory scaffolding (`tiddlywiki/config/` + `build/` if needed + README stub). (TZK-05)
  - Plan 58-05: Smoke gate — generate + build-public exits 0, output/index.html exists. (Verification)

- Plan 58-04 is light — just directory creation + README seed.

</specifics>

<deferred>
## Deferred Ideas

- Actual deployment to pattern158.solutions/wiki — not in REQs.
- GitHub Actions CI for the build — not in REQs.

</deferred>
