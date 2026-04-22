---
phase: 59
plan: documentation
subsystem: tiddlywiki
tags: [docs, architecture-guide, contributor-guide, workflow-doc]
requires: [phase-58]
provides: [pattern158-tiddlywiki-documentation]
affects: [scripts/tiddlywiki/README.md, tiddlywiki/README.md, tiddlywiki/CONTRIBUTING.md]
tech-stack:
  added: []
  patterns: [three-tier-docs, generator-owned-vs-author-owned]
key-files:
  created:
    - scripts/tiddlywiki/README.md
    - tiddlywiki/CONTRIBUTING.md
    - .planning/phases/59-documentation/59-VERIFICATION.md
    - .planning/phases/59-documentation/59-SUMMARY.md
  modified:
    - tiddlywiki/README.md
decisions:
  - Three-tier doc layout: architecture doc (`scripts/tiddlywiki/README.md`) sits next to the code it documents; workflow doc (`tiddlywiki/README.md`) lives with the tiddlers; contributor guide (`tiddlywiki/CONTRIBUTING.md`) lives at the conventional `CONTRIBUTING.md` position — maximum discoverability for each audience
  - Generator-owned vs author-owned dichotomy surfaced as the core mental model for contributors — framing every "should I edit the .tid file or upstream?" decision as a single lookup against the composed-tiddler list
  - Merge-conflict guidance prefers regenerate over hand-merge for generator-owned tiddlers — exploits the determinism contract rather than fighting it
  - Tag taxonomy table enumerates all 21 tags produced by the v9.0 pipeline (core, subtype, back-ref, theme) in a single scanning-optimized table rather than prose
  - Deploy section intentionally minimal — simple scp/copy, no CI, reflecting the milestone's "no live URL yet" deferred scope
metrics:
  tasks: 3
  files: 5
  commits: 3
  duration: ~15min
requirements: [DOC-01, DOC-02, DOC-03]
completed: 2026-04-21
---

# Phase 59: Documentation Summary

Three cross-linked documentation files that make the v9.0 TiddlyWiki
pipeline self-servable: an architecture doc for the generator code, an
expanded workflow doc for the wiki directory, and a contributor guide
resolving the generator-owned vs author-owned edit ambiguity.

## What Changed

### DOC-01: `scripts/tiddlywiki/README.md` (new, ~1,905 words)

Architecture-layer doc co-located with the generator code. Sections:

- **Overview** — 4 layers (extractors → bundle assembly → atomic +
  composite generators → orchestrator) + `tid-writer.ts` serializer.
- **Architecture diagram** — ASCII flow from `static-site/*.html` +
  JSON sources through extractors, bundle, generators, `composeAllTiddlers`
  (with `withPublicTag`), `.tid` + JSON + `.info` output, and CLI build
  targets.
- **Module index** — three tables covering every `.ts` file under
  `scripts/tiddlywiki/` (8 extractors, 8 generators, 7 orchestration /
  I/O modules) with role + key exports.
- **Tiddler types** — 11-row table: title convention + pre-`withPublicTag`
  tag set + emitter for each type (page, case-files-index, exhibit,
  finding, person, technology, testimonial, faq-index, faq-item, site-meta,
  theme). Plus cross-link invariants block.
- **Commands** — 6 pnpm scripts + `verify-integrity.ts` CLI with what /
  exit code / typical duration.
- **Troubleshooting** — 5 common issues (orphans, stale output, tsconfig
  exclude regressions, clobbered theme worry, double-prefix exhibits).
- **SCAF-08 discipline** — determinism contract + Phase 54 lock callout.

### DOC-02: `tiddlywiki/README.md` (expanded from ~400 → ~1,692 words)

Expanded the Phase 58 seed. Kept all existing content; added:

- **Cross-refs** — links to DOC-01 and DOC-03 at the top.
- **When to use `private`** — 4 bullet-point use cases framing the tag's
  intended semantics.
- **Tag taxonomy** — 21-row table enumerating every tag produced by the
  pipeline (core, page, exhibit subtypes, client back-refs, person
  entry-types, severity, category, FAQ, testimonial back-refs, theme
  marker tags) with "applied by" attribution.
- **Deploy** — scp / copy steps, no CI recommendation, public-vs-full
  content matrix.
- **Git cadence** — full content-change loop (5 steps), what-to-commit
  vs what-to-not-commit matrix, diff-surprise debugging guidance.
- **How to iterate** — direct-edit-in-TW vs regenerate-from-source,
  with concrete upstream paths for each content type and a rule-of-thumb
  summary.

### DOC-03: `tiddlywiki/CONTRIBUTING.md` (new, ~1,322 words)

Contributor-facing editing guide at the conventional position. Sections:

- **The two edit paths** — generator-owned vs author-owned framing.
- **Decision tree** — ASCII flow chart: "Does the tiddler title appear
  in `composeAllTiddlers`'s list?" → YES (edit upstream) or NO (edit in
  place).
- **Which titles are generator-owned?** — enumeration of every type the
  generator emits + enumeration of author-owned exceptions.
- **When to re-capture vs edit in place** — 3 scenarios: Vue-source
  changes (re-capture), theme/palette/private tiddlers (edit in place),
  tiddler-shape changes (edit generator source).
- **Merge conflict resolution** — 4 subcases (generator-owned,
  author-owned, `tiddlywiki.info`, `pattern158-tiddlers.json`) with the
  "regenerate over hand-merge" heuristic for everything the generator
  owns.
- **4 worked examples** — typo fix in exhibit finding, site title
  update, dark palette tweak, parking a private draft. Each shows the
  full edit → regenerate → verify → commit loop.
- **Pre-commit checklist** — 6-item checklist covering regenerate +
  integrity-gate + diff review + gitignore hygiene.

### Verification + summary

- `.planning/phases/59-documentation/59-VERIFICATION.md` — REQ coverage
  table, full cross-reference audit (6 links), factual claim audit (12
  code-source claims verified), stub/placeholder scan (none found),
  scope-compliance check.
- `.planning/phases/59-documentation/59-SUMMARY.md` — this file.

## Commits

| # | Hash      | Subject                                                 |
| - | --------- | ------------------------------------------------------- |
| 1 | `7f89dfd` | docs(59-01): add scripts/tiddlywiki/README.md (DOC-01)  |
| 2 | `c0402a1` | docs(59-02): expand tiddlywiki/README.md (DOC-02)       |
| 3 | `6d6431d` | docs(59-03): add tiddlywiki/CONTRIBUTING.md (DOC-03)    |

## Deviations from Plan

None — plan executed exactly as written. Every deliverable shipped with
the sections specified in the objective. No architectural changes, no
scope expansion, no bugs discovered in the code being documented.

## Cross-reference integrity

Every doc-to-doc link was verified to resolve against the filesystem:

- DOC-01 → DOC-02: `../../tiddlywiki/README.md` ✓
- DOC-01 → DOC-03: `../../tiddlywiki/CONTRIBUTING.md` ✓
- DOC-02 → DOC-01: `../scripts/tiddlywiki/README.md` ✓
- DOC-02 → DOC-03: `CONTRIBUTING.md` ✓
- DOC-03 → DOC-02: `README.md` ✓
- DOC-03 → DOC-01: `../scripts/tiddlywiki/README.md` ✓

All 6 cross-links resolve.

## Self-Check: PASSED

- `scripts/tiddlywiki/README.md` — FOUND (~1,905 words)
- `tiddlywiki/README.md` — FOUND (~1,692 words, expanded from Phase 58 seed)
- `tiddlywiki/CONTRIBUTING.md` — FOUND (~1,322 words)
- `.planning/phases/59-documentation/59-VERIFICATION.md` — FOUND
- `.planning/phases/59-documentation/59-SUMMARY.md` — FOUND
- Commit `7f89dfd` — FOUND
- Commit `c0402a1` — FOUND
- Commit `6d6431d` — FOUND
- All 6 inter-doc cross-references resolve
- All 12 code-factual claims match code state
- No stubs / TODOs / placeholders in any deliverable
