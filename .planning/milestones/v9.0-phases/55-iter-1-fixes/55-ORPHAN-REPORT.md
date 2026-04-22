---
phase: 55-iter-1-fixes
plan: 07
status: resolved
orphan_count: 0
affected_tiddler_count: 0
unique_missing_targets: 0
generated_at: 2026-04-22
resolved_at: 2026-04-22
resolution: 55.1-hotfix
---

# Phase 55 Orphan Report — RESOLVED

> **RESOLVED 2026-04-22 via 55.1-hotfix.** Two Phase-55-scope changes — `normalizeExhibitLabel` helper in `scripts/tiddlywiki/extract-all.ts` and short-form exhibit tiddler titles in `scripts/tiddlywiki/sources.ts:exhibitsToTiddlers` — aligned the label dialect across the extractor/generator boundary without touching `extractors/` or `generators/`. The 267 orphans are now 0; see `55-HOTFIX-SUMMARY.md`. Contents below preserved for historical context.
>
> **Current integrity gate:** `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` → `[55-07] PASS: 367 tiddlers, 0 orphaned links.`
>
> ---

# Phase 55 Orphan Report (historical)

**Gate:** `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` — **FAIL**
**Total orphan occurrences:** 267 `[[target]]` links across 235 source tiddlers.
**Unique missing targets:** 14 (`Exhibit Exhibit A` … `Exhibit Exhibit N`).

All 267 orphan occurrences share a single shape: `[[Exhibit Exhibit <letter>]]`. Every orphan is emitted by a Phase 54 atomic tiddler generator (person / finding / technology / testimonial) linking back to its source exhibit.

## Root Cause

Two title conventions have diverged between the atomic generators and the exhibit generator. The atomic generators call `formatExhibitTitle(entry.sourceExhibitLabel)` to build back-links, where `formatExhibitTitle` is:

```typescript
// scripts/tiddlywiki/generators/helpers.ts (Phase 54 — LOCKED, Phase 55 boundary)
export function formatExhibitTitle(label: string): string {
  return `Exhibit ${label.trim()}`
}
```

This helper assumes a **short label** (e.g. `"A"`) and prefixes `"Exhibit "`. But Phase 55 Plan 55-01's `extract-all.ts` populates `bundle.exhibits[i].label` with the **DOM-extracted verbose label** (e.g. `"Exhibit A"` — Plan 55-01 Deviation §1). Consequently:

- Plan 55-01 normalized `"Exhibit A"` in the JSON to the `exhibit-a.html` filename (correct).
- But Plan 55-01 also wrote `emitExhibit`'s verbose label through to `sourceExhibitLabel` on every personnel/finding/technology/testimonial entry.
- The atomic generators (Phase 54 Plans 02/03/04/05) then compose `formatExhibitTitle("Exhibit A")` → `"Exhibit Exhibit A"` — a title that does **not** exist on disk.

Meanwhile, `exhibitsToTiddlers` in `scripts/tiddlywiki/sources.ts` (line 217) creates each exhibit tiddler with:

```typescript
const title = `${ex.label} — ${ex.title}`
```

So the canonical on-disk exhibit tiddler title is, e.g., `"Exhibit A — Cross-Domain SCORM Resolution & Embedded Technical Advisory"` — neither `"Exhibit A"` nor `"Exhibit Exhibit A"`. There is no tiddler on disk named `"Exhibit A"` at all.

**Net effect:** every atomic back-link points at a target that does not exist. The integrity gate therefore reports 267 orphans across all 235 atomic tiddlers that emit a back-link.

## Suspected Fix Scope (Phase 56 or separate hotfix — NOT in Plan 55-07 scope)

Two independent problems need a coordinated fix:

1. **Double-prefix bug (Phase 54 or Plan 55-01 scope).** Either:
   - `formatExhibitTitle` must become idempotent (strip a leading `Exhibit ` if present before re-prefixing), mirroring the slug-normalizer fix Plan 55-01 applied to `exhibitLabelToFilename`. One-line fix in `scripts/tiddlywiki/generators/helpers.ts` — but Plan 55-07 scope explicitly forbids modifications under `scripts/tiddlywiki/generators/`. OR
   - `extract-all.ts` should normalize `exhibit.label` to the short form (`"A"`) before emitting it through `bundle.exhibits[*]` and `sourceExhibitLabel` — but this would change the extractor-layer contract and conflict with the Phase 53-locked shape.

2. **Title-schema mismatch (Phase 54 or sources.ts scope).** Even with the double-prefix fixed, `formatExhibitTitle("A")` → `"Exhibit A"` still does not match `exhibitsToTiddlers`'s on-disk title `"Exhibit A — Cross-Domain …"`. A second alignment must land before the gate can pass:
   - Option A: Change `exhibitsToTiddlers` to use `title = \`Exhibit ${ex.label}\`` and move the long marketing title into a `subtitle` field (breaking change for exhibit tiddler titles on disk).
   - Option B: Change every atomic generator to compose the full verbose title `"Exhibit <label> — <title>"` — requires the atomic generators to know the exhibit's marketing title (currently they only carry `sourceExhibitLabel`).
   - Option C: Emit an additional alias tiddler per exhibit titled simply `"Exhibit A"` that redirects (via `_canonical_uri` or a TiddlyWiki list field) to the full-title tiddler. Cheapest; preserves both title schemas; no breaking change to existing tiddlers.

**Recommended:** Option C as a hotfix (add 14 thin alias tiddlers in a future plan under Phase 56 scope), since it avoids touching Phase 53/54-locked modules.

## Affected Source Tiddlers (sample — first 15 of 235)

| Source tiddler | Missing link target |
|----------------|--------------------|
| ` @ GP Strategies` | `Exhibit Exhibit A` |
| ` @ GP Strategies` | `Exhibit Exhibit B` |
| `15+ Team Members` | `Exhibit Exhibit C` |
| `2 Additional Testers` | `Exhibit Exhibit I` |
| `Dan Novak` | `Exhibit Exhibit A` …`Exhibit Exhibit N` (14 occurrences) |
| `Max Glick` | `Exhibit Exhibit K`, `Exhibit Exhibit M` |
| `Tech: AICC` | `Exhibit Exhibit A`, `Exhibit Exhibit F` |
| `Tech: SCORM 1.2` | `Exhibit Exhibit A`, `Exhibit Exhibit D`, `Exhibit Exhibit E`, `Exhibit Exhibit F` |
| `Tech: Articulate Storyline` | `Exhibit Exhibit A`, `Exhibit Exhibit J` |
| `Tech: Vue.js application development` | `Exhibit Exhibit F` |

Full raw output is reproducible via `pnpm tsx scripts/tiddlywiki/verify-integrity.ts 2>&1 | grep "ORPHAN"`.

## Unique Missing Targets

```
Exhibit Exhibit A
Exhibit Exhibit B
Exhibit Exhibit C
Exhibit Exhibit D
Exhibit Exhibit E
Exhibit Exhibit F
Exhibit Exhibit G
Exhibit Exhibit H
Exhibit Exhibit I
Exhibit Exhibit J
Exhibit Exhibit K
Exhibit Exhibit L
Exhibit Exhibit M
Exhibit Exhibit N
```

## Containment

- Plan 55-07 holds Phase 53/54 boundary. No files under `scripts/tiddlywiki/extractors/` or `scripts/tiddlywiki/generators/` are modified.
- Plan 55-07 does not rewrite `sources.ts` either (FIX-03 / FIX-04 scope already landed in Plans 55-05 / 55-06; the title-schema problem is a separate cross-boundary issue).
- Smoke-gate detection machinery is in place: `scripts/tiddlywiki/verify-integrity.ts` exits 1 until the upstream fix ships.

## Next Actions for Developer

1. Decide Option A / B / C (see "Suspected Fix Scope" above). Option C is recommended.
2. Author a hotfix plan (likely Phase 55.1-hotfix or roll into Phase 56 TEST-01..04) to implement the chosen option.
3. Re-run `pnpm tsx scripts/tiddlywiki/verify-integrity.ts` — must exit 0 before Phase 55 can close.
4. Amend 55-VERIFICATION.md status from `failed` → `passed` and drop this ORPHAN-REPORT once the gate is green.

---

*Generated: 2026-04-22*
*Plan: 55-07*
*Status: Surfaced — upstream fix required*
