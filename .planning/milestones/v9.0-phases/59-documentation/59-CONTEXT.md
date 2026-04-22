# Phase 59: Documentation - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (autonomous mode)

<domain>
## Phase Boundary

Three documentation deliverables that make the pipeline self-servable by future-me or a new contributor:
- DOC-01: `scripts/tiddlywiki/README.md` — architecture + commands + troubleshooting
- DOC-02: `tiddlywiki/README.md` — tzk workflow doc (already seeded in Phase 58; Phase 59 expands)
- DOC-03: Contributor editing guide — direct-edit vs regenerate, merge conflicts

Out of scope:
- Code changes (final milestone phase, pure docs).
- New features.

</domain>

<decisions>
## Implementation Decisions

### DOC-01 — `scripts/tiddlywiki/README.md`
Covers:
- **Overview:** What this directory does (DOM extraction → atomic tiddler generation → compose → TiddlyWiki output).
- **Architecture:** Diagram (ASCII) showing extractors/ → generators/ → extract-all.ts → generate.ts → tiddlywiki/tiddlers/*.tid → build-public/all → tiddlywiki/output/index.html.
- **Tiddler types:** Table of types (page / exhibit / person / finding / technology / testimonial / faq / site-meta / theme) with title conventions + tag lists.
- **Commands:** `pnpm tiddlywiki:generate`, `pnpm tiddlywiki:build-public`, `pnpm tiddlywiki:build-all`, `pnpm tsx scripts/tiddlywiki/verify-integrity.ts`, `pnpm test:scripts`.
- **Troubleshooting:** Orphan links (run verify-integrity), stale output (regenerate), build failures (check tsconfig.scripts.json excludes).

### DOC-02 — `tiddlywiki/README.md`
Phase 58 seeded the basic workflow doc. Phase 59 expands:
- **Private vs public workflow:** Tagging strategy, when to use `private`.
- **Deploy steps:** How to publish `tiddlywiki/output/index.html` (target: pattern158.solutions/wiki or similar subpath). Just filesystem copy; no CI wiring required.
- **Git cadence:** Regenerate → `git diff tiddlywiki/tiddlers/` → commit. When to commit generator source vs. output.
- **Tag taxonomy:** Full list of tags used across the corpus (`page`, `exhibit`, `person`, `finding`, `severity-*`, `category-*`, `technology`, `testimonial`, `faq`, `public`, `private`).
- **How to iterate:** Editing workflow — direct edit in TW UI for quick fixes vs. regenerate from upstream HTML for content corrections.

### DOC-03 — Contributor editing guide
Location: `tiddlywiki/CONTRIBUTING.md` (conventional position).
Covers:
- **Direct-edit-in-TW vs. regenerate-from-source:** Decision tree.
- **Merge-conflict resolution:** What to do when `.tid` files conflict (typically regenerate; manual edits to content-generated tiddlers get clobbered).
- **When to re-capture vs. edit in place:** Capture is the authoritative path for content tiddlers; theme/meta tiddlers can be edited directly.

### Cross-references
- All three docs link to each other where topics overlap.
- README in scripts/tiddlywiki/ links to tiddlywiki/README.md and vice-versa.

### Scope Discipline
- No code changes.
- Existing README content (Phase 58's `tiddlywiki/README.md` seed) is expanded, not replaced.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 58 seeded `tiddlywiki/README.md` — expand, don't rewrite.
- Project existing `README.md` at repo root — reference for top-level pointers.

### Integration Points
- None — pure docs.

</code_context>

<specifics>
## Specific Ideas

- 2 plans:
  - Plan 59-01: DOC-01 + DOC-02 expansion (both high-level).
  - Plan 59-02: DOC-03 + cross-link audit + 59-VERIFICATION.md.

- Each doc has an ASCII diagram where relevant.
- All docs are in Markdown.

</specifics>

<deferred>
## Deferred Ideas

- Publishing the wiki to a live URL (not in scope).
- Video walkthrough of the workflow.

</deferred>
