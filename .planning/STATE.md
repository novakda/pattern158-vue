---
gsd_state_version: 1.0
milestone: v9.0
milestone_name: Continue tiddlywiki intake and conversion
status: verifying
last_updated: "2026-04-22T09:30:00.000Z"
last_activity: 2026-04-22
progress:
  total_phases: 14
  completed_phases: 6
  total_plans: 49
  completed_plans: 48
  percent: 98
---

# Project State

## Project Reference

See: .planning/PROJECT.md
Milestone: v9.0 Continue tiddlywiki intake and conversion (started 2026-04-21)
Prior milestone: v8.0 Editorial Snapshot & Content Audit (shipped 2026-04-20, `.planning/v8.0-AUDIT-NOTICE.md`)

**Core value:** Every page template should be scannable and self-documenting through well-named components that enforce design consistency
**Current focus:** Phase 53 — DOM Extraction

## Current Position

Phase: 58 — tzk-style-structure — COMPLETE
Plan: End-to-end executed in one pass
Status: Phase complete — ready for verification
Last activity: 2026-04-22

Progress: [██████████] 98%

## Performance Metrics

**Velocity:**

- Total plans completed: 5 (v6.0) + 16 (v7.0 partial before abort)
- Average duration: —
- Total execution time: —

## Accumulated Context

Retained from v7.0 (still valid for v8.0 background):

| Phase 037 P01 | 2min | 3 tasks | 2 files |
| Phase 37 P06 | 106 | 2 tasks | 2 files |
| Phase 037 P03 | 3min | 2 tasks | 2 files |
| Phase 37 P05 | 2m 23s | 2 tasks | 2 files |
| Phase 37 P02 | 3 min | 3 tasks | 8 files |
| Phase 37 P04 | 3 | 3 tasks | 12 files |
| Phase 037 P07 | 3min | 2 tasks | 2 files |
| Phase 037 P08 | 4min | 3 tasks | 8 files |
| Phase 037 P09 | 2min | 3 tasks | 1 files |
| Phase 038 P01 | 6m31s | 3 tasks | 7 files |
| Phase 038 P05 | 4min | 1 tasks | 1 files |
| Phase 038 P02 | 5min | 1 tasks | 2 files |
| Phase 038 P03 | 4m | 2 tasks | 8 files |
| Phase 038 P04 | 4m7s | 1 tasks | 2 files |
| Phase 038 P06 | 3min | 2 tasks | 12 files |
| Phase 038 P07 | 3m32s | 2 tasks | 6 files |
| Phase 48 P06 | 5min | 2 tasks | 2 files |
| Phase 49 P01 | 3min | 1 tasks | 1 files |
| Phase 49 P04 | 5m 8s | 1 tasks | 1 files |
| Phase 53 P01 | 4m 28s | 3 tasks | 3 files |
| Phase 54 P01 | 2m25s | 3 tasks | 3 files |
| Phase 54 P02 | 2m33s | 2 tasks | 2 files |

### Decisions

Historical decisions preserved. v8.0 decisions logged in PROJECT.md Key Decisions table as they land.

- Phase 48 Plan 01: CaptureError uses options-bag constructor (message, opts?: { route?, cause? }) — route-scoped errors get route as first-class field
- Phase 48 Plan 01: detectInterstitial returns string | null (pure classifier); caller wraps non-null in CaptureError at call site where Route context is available
- Phase 48 Plan 01: slugify('/') short-circuits to 'home' before regex pipeline; all other inputs go through trim → lowercase → strip leading / → collapse non-alphanumeric → collapse dashes → trim dashes
- Phase 48 Plan 02: Playwright imported from 'playwright' (runtime automation package), not '@playwright/test' (test runner) — CAPT-03 explicit constraint
- Phase 48 Plan 02: launchBrowser inverts config.headful at the boundary — chromium.launch({ headless: !config.headful })
- Phase 48 Plan 02: viewport 1280x800 + colorScheme 'light' hardcoded in buildContextOptions — not configurable; determinism for CAPT-12
- Phase 48 Plan 02: buildCaptureUrl uses template-literal concat (not URL/URLSearchParams) to preserve determinism; slugs are [a-z0-9-]+ and paths URL-safe
- Phase 48 Plan 02: sourceSlug-wins precedence for cache-buster slug (route.sourceSlug ?? route.path) — aligns cache-buster slug with screenshot filename slug (Plan 48-05)
- Path derivation: nodePath.dirname + nodePath.join for faq.json, not string replace — survives directory renames
- FAQ expansion signal: aria-expanded attribute (a11y contract), not .is-open CSS class
- File-scoped /// <reference lib="dom" /> in capture.ts instead of adding 'dom' to editorial tsconfig lib — contains browser globals to the one file that drives a browser
- Sequential for...of over collapsed accordion triggers — extends SCAF-08 no-Promise.all discipline to browser-side DOM actions
- Phase 48 Plan 05: Screenshots land at <dirname(outputPath)>/site-editorial-capture/screenshots/<NN>-<slug>.png — directory literals hardcoded (CONTEXT.md lock), NN is 2-digit floor padding via String(index).padStart(2,'0'), slug seed follows sourceSlug ?? path precedence matching Plan 48-02 buildCaptureUrl
- Phase 48 Plan 05: ensureScreenshotDir returns Promise<string> (not void) so Plan 48-06 capture loop calls it once outside the loop and reuses the returned path in every buildScreenshotPath(config, i, route) call
- Phase 48 Plan 05: captureScreenshot locks page.screenshot options to exactly 3 keys (fullPage: true, path: absPath, type: 'png'); no clip, omitBackground, quality, animations, caret, scale; no try/catch — errors propagate for Plan 48-03 route-context wrapping; Promise<void> return prevents buffering PNG in memory
- Phase 48 Plan 03: capturePage attaches console + pageerror listeners BEFORE page.goto — Playwright does not buffer pre-listener events, so attaching after would silently drop hydration-window errors (CAPT-14 correctness invariant)
- Phase 48 Plan 03: capturePage operation order LOCKED — goto -> status -> waitForSelector -> FAQ hooks -> meta -> mainHtml -> interstitial -> exhibit-404 -> screenshot -> return. FAQ hooks must run before HTML read (DOM mutation); interstitial after mainHtml (needs bodyBytes+html); exhibit-404 after interstitial (no point asserting on challenge page); screenshot last (after all assertions pass)
- Phase 48 Plan 03: SPA-404 detection on exhibit routes uses .exhibit-detail-title (h1 class on both InvestigationReportLayout and EngineeringBriefLayout) with strict === 1 count assertion — NotFoundPage does not render this class, so silent 404 at HTTP 200 trips the assertion; double-render also aborts (template regression)
- Phase 48 Plan 03: inter-request 1500ms delay lives in captureRoutes (Plan 48-06), not capturePage — keeps capturePage pure about a single-route round-trip and single-responsibility; capturePage returns as soon as one route is captured
- Phase 48 Plan 06: captureRoutes preflight order is ensureScreenshotDir → loadFaqItemCount → launchBrowser. Both preflights run BEFORE browser spawn so a misconfigured env fails in ~10ms without paying the 2-3s Chromium boot cost; order between preflights is ensureScreenshotDir first (faster, more common misconfiguration target)
- Phase 48 Plan 06: inter-request 1500ms delay implemented as throwaway page.waitForTimeout(1500) with skip-after-last guard (if i < routes.length - 1). Playwright's approved sleep channel; no Node timer, no wall-clock busy-wait (SCAF-08). Throwaway page lifecycle (open → waitForTimeout → close-in-finally) is load-bearing — tests assert newPage called exactly 2+(N-1)=3 times for N=2 routes
- Phase 48 Plan 06: nested try/finally (outer browser.close, inner context.close) guarantees cleanup on any abort path including context-creation failure; flatter structure leaks Browser
- Phase 48 Plan 06: CaptureError wrap for non-CaptureError happens inside the for-loop catch, NOT at the function boundary — preserves the exact route that failed (not the first/last in the array). CaptureError passthrough branch preserves original route context set by capturePage
- Phase 48 Plan 06: hermetic test suite via vi.spyOn(chromium, 'launch') per-test + vi.restoreAllMocks() in afterEach, NOT vi.mock('playwright') at module level. Lets pure-helper tests and integration tests coexist in the same file without mock pollution
- Phase 48 Plan 06: integration tests cover 4 distinct paths (happy, non-CaptureError wrap, silent 404, interstitial) and all 3 error-path tests assert mockBrowser.close called exactly once — proves outer finally ran. All 3 error-path tests also grep for the exact error string captureRoutes/capturePage throws, so regressions in user-visible error messages fail loudly
- Phase 48 Plan 06: JSDoc prose cannot mention forbidden tokens by name (setTimeout, Date.now, Promise.all) because the SCAF-08 acceptance grep `! grep -q <token>` matches comments as well as code. Describe the policy without naming the tokens: "SCAF-08 forbids Node timers and parallel-iteration helpers"
- Phase 49 Plan 01: DOM parser locked to happy-dom (top-level devDep, pnpm-hoist safe); the transitive-only domino parser rejected because a direct import from convert.ts breaks under pnpm strict hoisting; Turndown's internal parser not publicly exposed as standalone API
- Phase 49 Plan 01: sanitizeHtml sub-step order LOCKED — parse happy-dom window → strip script/style/noscript/[aria-hidden=true] subtrees → data-v-* attribute walk via Array.from(el.attributes) snapshot → demoteHeadings → serialize body.innerHTML
- Phase 49 Plan 01: demoteHeadings uses .forEach (not for-of) because editorial tsconfig lib: [ES2022] + file-scoped DOM triple-slash does NOT include DOM.Iterable; for-of on NodeListOf fails type-check (auto-fix Rule 3 during execution)
- Phase 49 Plan 01: heading rewrite uses createElement + replaceWith because Element.tagName is read-only; querySelectorAll returns a static NodeList snapshot so mutation during iteration is safe; clamp newLevel = Math.min(6, currentLevel + 2)
- Phase 49 Plan 01: JSDoc prose must avoid the literal rejected-parser package name because the acceptance grep is line-based and matches comments as well as code (same SCAF-08 comment discipline locked in Phase 48 Plan 06)
- Ambient module shim colocation: untyped upstream package's .d.ts lives next to consumer (scripts/editorial/turndown-plugin-gfm.d.ts); tsconfig include glob covers it without a typings/ dir or global.d.ts
- JSDoc end-marker hazard discovered: the byte sequence */ inside a block comment prematurely closes it; keep glob wildcards (badge-*, tag-*) out of /** */ doc blocks — use backticked literals or use line-comments (//) where the hazard is harmless
- Turndown default import works under esModuleInterop + NodeNext: 'import TurndownService from turndown' compiles directly because @types/turndown uses export = TurndownService
- Phase 49 Plan 03: ConvertedPage extended from Phase 46 placeholder 5-field shape to locked 8-field shape per CONTEXT.md lines 72-84 — added readonly consoleErrors/screenshotPath/cfCacheStatus? so Phase 48 capture metadata flows through to Phase 50 writer in a single object per page
- Phase 49 Plan 03: collapseBlankLines uses /\n{3,}/g (bounded quantifier, linear-time, ReDoS-safe); no code-block exemption needed because Turndown fenced blocks never emit 3+ consecutive blank lines inside fences
- Phase 49 Plan 03: convertCapturedPage constructs a fresh TurndownService per page via configureTurndown() — stateless, no cross-page rule-state leakage; factory is cheap; empty mainHtml yields empty markdown (no throw, per CONTEXT.md line 110)
- Phase 49 Plan 03: convertCapturedPages uses explicit 'const out = []; for (const page of pages) out.push(convertCapturedPage(page))' accumulator pattern over .map — SCAF-08 visibility; CONTEXT.md line 106 sequential for-of; canonical pattern for ordered readonly arrays where no parallelism helps
- Phase 49 Plan 03: types.ts source unchanged — TypeScript type re-exports forward-by-name, so the extended ConvertedPage shape propagates through 'export type { ConvertedPage } from ./convert.ts' automatically; verified by pnpm build exit 0 (TS2305/TS2315 would have fired on shape mismatch)
- Phase 49 Plan 04: convert.test.ts asserts on @joplin/turndown-plugin-gfm actual emitted form (padded cells + padded bullet markers) not the plan's unpadded literal samples — Rule 1 auto-fix to 3 assertion sites; semantic intent preserved, deterministic output locked
- Phase 49 Plan 04: 14 describe blocks mapped 1:1 to CONTEXT.md lines 86-100 scenarios (11 primary + determinism + DOM-order + bonus convertCapturedPages batch); scenario-binding acceptance-gate via grep on exact describe titles — dropping any scenario fails the gate loudly
- Phase 49 Plan 04: 260 -> 304 test delta (44 new cases, 21 it/it.each declarations, 28 it.each tuple rows); 19 -> 20 test files; 100% hermetic (no fs I/O, no external fixtures)
- Phase 50 Plan 02: atomicWrite uses PID-suffix temp filename (${absPath}.tmp-${process.pid}) + fsp.rename with best-effort fsp.unlink.catch(() => undefined) cleanup — prevents stale sibling temp files on either writeFile or rename failure; rename sequence is WRIT-03 lock
- Phase 50 Plan 02: writePrimaryAndMirror primary-first / mirror-best-effort ordering LOCKED — primary atomicWrite failure rejects the whole function; mirror block (mkdir recursive + atomicWrite) runs only after primary succeeds; mirror failure LOGS to stderr ('[editorial-capture] mirror write failed: <msg>') and returns { primaryPath } without mirrorPath; test 2e locks primary-reject → mirror-never-attempted
- Phase 50 Plan 02: vi.spyOn(fsp, ...) rejected under Vitest 4 ESM NodeNext — namespace bindings are non-configurable ('Cannot redefine property'); replaced with vi.mock('node:fs/promises', async () => ({ ...await vi.importActual(...), writeFile/rename/unlink/mkdir: state.X })) + vi.hoisted state holders; real-fs describe block re-delegates mocks via realFsp = await vi.importActual(...) so one test file covers both mocked unit and tmpdir-based integration
- Phase 50 Plan 02: MIRROR_RELATIVE_PATH is a file-scope const (.planning/research/site-editorial-capture.md) — not exposed in EditorialConfig; resolved via nodePath.resolve(process.cwd(), MIRROR_RELATIVE_PATH); making it user-configurable would expose path-traversal surface and contradicts CONTEXT.md line 281 lock
- Phase 50 Plan 03: namespace child-process import (import * as childProcess from 'node:child_process') — required to keep the SCAF-08 grep-exact-count allowlist of two literal execSync occurrences satisfied; destructured import produced 3 (import + 2 calls), namespace form produces 2 (both calls)
- Phase 50 Plan 03: ExitSentinel throw pattern via vi.spyOn(process, 'exit').mockImplementation(() => throw) — test-time substitute for process.exit lets tests await main() rejection and inspect code via spy.mock.calls without killing the Vitest runner
- Phase 50 Plan 03: Multi-module vi.mock graph extends Plan 50-02's vi.hoisted pattern to 7 modules (node:child_process + config/routes/capture/convert/document/write) — all factories use ...actual spread to preserve original class exports so instanceof checks in index.ts still succeed
- Phase 50 Plan 03: CLI-invocation guard via 'if (import.meta.url === `file://${process.argv[1]}`) main().catch(handleTopLevelError)' — idiomatic Node-ESM entrypoint detection that gates side-effectful invocation; test imports of { main } do not trigger the pipeline
- Phase 51 Plan 01: emitFindingsScaffold helper lives in write.ts (not a new findings-scaffold.ts module) — sits next to atomicWrite/writePrimaryAndMirror, shares SCAF-08 discipline, one-import-site in index.ts
- Phase 51 Plan 01: SCAFFOLD_TEMPLATE authored as module-top-level quoted-literal concatenation with explicit \n — template-literal form with real newlines would be SCAF-08-adjacent and harder to audit; concat form makes every newline visible
- Phase 51 Plan 01: idempotency probe uses fsp.access(path, F_OK) + try/catch — throw-on-absent flows naturally into write branch; cheaper than stat (no struct read)
- Phase 51 Plan 01: non-fatal failure contract locked at caller boundary — helper throws on write failure, index.ts wraps in .catch that logs [editorial-capture] scaffold emission failed (non-fatal) and returns null; exit code never flipped by scaffold errors
- Phase 51 Plan 01: findingsScaffoldPath threaded through stderr JSON summary (null/absolute-path); stdout 'Findings scaffold: <path>' line emitted ONLY on new write — avoids daily noise after initial run
- Phase 53 Plan 01: single shared tsconfig.scripts.json extended to cover scripts/tiddlywiki/**/*.ts — editorial tsconfig stays on its own project (different outDir, same compilerOptions shape); new tsconfig.tiddlywiki.json would be redundant
- Phase 53 Plan 01: ExtractorError options-bag constructor (message, opts?: { extractor?, cause? }) — runtime class export (not export type) so err instanceof ExtractorError works at runtime; mirrors Phase 48 CaptureError and Phase 47 ConfigError
- Phase 53 Plan 01: parseHtml returns 'document as unknown as Document' cast at producer boundary — single cast in shared helper lets every Wave-2 extractor consume standard-lib DOM types under the file-scoped /// <reference lib="dom" /> without per-site re-casts; mirrors convert.ts line 120 pattern
- Phase 53 Plan 01: all extractor entity fields readonly; optional-in-JSON fields become required-with-default-in-output (empty string / empty array / 0) — extractors own defaulting, callers get total shapes with no '| undefined' noise at consumption sites
- Phase 53 Plan 01: tsconfig.scripts.json gains explicit exclude list for pre-Phase-53 tiddlywiki files (generate.ts, sources.ts, html-to-wikitext.ts) — Rule 1 auto-fix: broader include glob surfaced pre-existing TS5097 (.ts-extension imports need allowImportingTsExtensions) + TS2345 (happy-dom HTMLBodyElement vs standard DOM Node) errors that cannot be fixed without modifying those files, and Phase 53 scope forbids modification (deferred to Phase 55 FIX-02). tid-writer.ts stays included (clean compile)
- Phase 53 Plan 03: normalizeExhibitType uses lowercase+dash-collapse with safe fallback to engineering-brief; collectSubsections walks section.children with for-of accumulator (not :scope queries); KNOWN_SIBLING_HEADINGS filter keeps Personnel/Technologies/Findings out of Exhibit.sections (sibling extractors own them); CONTEXT_HEADING_CANDIDATES={Background,Context} first-match-wins
- Plan 53-04: Row selector scoped to 'table.personnel-table tbody tr' to avoid cross-table leakage
- Plan 53-04: deriveEntryType checks anonymized BEFORE group — identity protection wins over group-membership labeling when both classes present
- 53-02: emitFaqItems returns readonly FaqItem[] via NodeList forEach; emitFaqItemsFromJson is the caller-invoked fallback sibling
- Phase 53 Plan 08: TreeWalker with numeric filter 0x5 used for pages extractor — avoids happy-dom NodeFilter constant gaps; isInsideHeading parent-chain guard filters heading-descendant text from segment bodies
- Phase 53 Plan 06: V1 technology-split contract — tools cells with parenthesized inline notes split naively on paren-inner comma (Test 3 locks behavior); keeps extractor pure + dumb; Phase 54 atomic tiddler logic can post-process if needed
- Phase 53 Plan 06: Literal-ampersand selector td[data-label="Technologies & Tools"] (not &amp;) — happy-dom decodes HTML entities in attribute values before querySelector evaluation
- Phase 53 Plan 06: Wave-2 build-gate discovery — tsconfig.scripts.json missing allowImportingTsExtensions + vitest/globals types broke pnpm build across all 8 Wave-2 test files; out of Plan 53-06 scope; logged to deferred-items.md; RESOLVED during this wave by Plan 53-02 fix commit 619c82e
- Phase 53 Plan 07: Unified 'blockquote.testimonial-quote, blockquote.exhibit-quote' selector with classList-based shape dispatch — one DOM pass, branch per shape via classList.contains(TESTIMONIAL_CLASS); preserves Testimonial total-shape contract across both DOM variants
- Phase 53 Plan 07: :scope > p child-combinator in exhibit-quote text extraction prevents nested p capture; footer === null flow-sensitive narrowing avoids non-null assertion in firstNonRoleSpan call
- Phase 53 Plan 05 (EXTR-04): DESCRIPTION_SPAN_SELECTOR uses child combinator to prevent finding-resolution inner spans from leaking into description field
- Phase 53 Plan 05 (EXTR-04): severity and outcome emit empty string (no DOM hooks in current static-site HTML); forward-compat for Phase 54 ATOM-02 overlay from exhibits.json
- Phase 54 Plan 01: truncateAtWordBoundary ellipsis is single codepoint '…' (U+2026), not three ASCII dots; reserves 1 char of budget for ellipsis (sliceBudget = maxLen - 1)
- Phase 54 Plan 01: generators/types.ts uses 'export type { ... }' (not 'export { ... }') to avoid runtime edge-load of happy-dom Window imported by extractors/types.ts — generators never need happy-dom
- Phase 54 Plan 01: formatExhibitTitle trims label argument so extractor edge cases ('  J  ') still produce canonical 'Exhibit J'; wikiLink is a pure [[...]] wrapper with no escaping
- Phase 54 Plan 02 (ATOM-01): Identity key includes entryType so the same person listed anonymously in one exhibit and by name in another produces distinct tiddlers; name wins over entryType for title (anonymized != nameless)
- Phase 54 Plan 02 (ATOM-01): Tag order LOCKED ['person', '[[{Client}]]', 'entry-type-{type}']; Client literally bracketed because tid-writer formatTagsField passes through unchanged (matches sources.ts exhibit-tiddler pattern)
- Phase 54 Plan 02 (ATOM-01): Deterministic output via Array.from(buckets.keys()).sort() for bucket emission + Set→sorted-array exhibit-label rendering — byte-identical JSON.stringify across repeated calls (idempotency test locked)
- Plan 54-06: Title-format constants duplicated from Plans 54-02..05 deliberately; Plan 54-07 integrity checker is the drift alarm
- Plan 54-06: Technology case-insensitive merge (first-seen casing wins) runs inside cross-link producer so targets align with Plan 54-04 tiddler titles
- Phase 54 Plan 04: technology tiddler bucket key = name.toLowerCase().trim(); first-seen casing wins for displayName/title
- Phase 54 Plan 04: technology tiddler tags = ['technology'] exactly one element; exhibit back-refs go in body not tags
- Phase 54 Plan 04: technology body aggregates '!! [[Exhibit X]]' headings + per-exhibit context blurbs, alphabetical by label, trailing \n
- Phase 54 Plan 03: FINDING_TRUNCATE_CHARS = 60 promoted to module-top-level const in finding.ts — single source of truth for ATOM-02 title-length lock, easier grep target for future audits
- Phase 54 Plan 03: slugifyTerm in finding.ts mirrors Phase 53 faq.ts slugify (two-regex chain: /[^a-z0-9]+/g -> '-' then /^-+|-+$/g -> ''); fallback tokens severity-unknown/category-uncategorized only when slug collapses to empty
- Phase 54 Plan 03: Finding tiddler exhibit back-ref tag is a literal '[[Exhibit L]]' string (not wikiLink(formatExhibitTitle(...))) — matches ATOM-01 client-tag precedent and keeps tags a flat string[]
- Phase 54 Plan 03: bodyFor uses parts[] accumulator with .length > 0 guards so empty finding fields collapse to omitted heading blocks — section order (finding → description → resolution → outcome) preserved regardless of which subset populated
- Phase 55 Plan 06 (FIX-04): Case Files Index body is a 4-column TiddlyWiki table (|!Date |!Client |!Type |!Case |) sorted by label ascending via .slice().sort(compareByLabel); typeCellFor maps investigation-report->Investigation, engineering-brief->Brief, else passthrough; two module-scope helpers (typeCellFor, compareByLabel) live above caseFilesIndexTiddler; iter-1 JSDoc block dropped in favor of a single line-comment per codebase no-JSDoc convention
- Phase 58 (TZK-01): withPublicTag transform lives at generate.ts composition layer (Phase 54 generators LOCKED); idempotent same-reference no-op when `public` or `private` already present; prepends `public` otherwise; frozen-tag-array safe via new Tiddler object construction
- Phase 58 (TZK-02): publishFilter value REQUIRES `+` intersection prefix (`+[!tag[private]]`); raw `[!tag[private]]` unions with saveTiddlerFilter rather than narrowing — verified via canary-tiddler smoke test (sentinel absent from public build, present in all build)
- Phase 58 (TZK-02): `--output tiddlywiki/output` resolves against CWD (pnpm runs from project root per TW core/language/en-GB/Help/output.tid), NOT the edition root; legacy `index` build target preserved `--output`-free for backward compatibility with pre-Phase-58 docs
- Phase 58 (TZK-02): empty-string template slot in --render args preserves `$:/core/save/all`-as-filter invocation (render.js line 44 falls back to `template || title`); form is `[filter, filename, type, '', 'publishFilter', '+[!tag[private]]']`
- Phase 58: tsconfig.scripts.json excludes (deferred from Phase 53 Plan 01) fully cleared — html-to-wikitext.ts `document.body as unknown as Node` cast at producer boundary mirrors extractors/types.ts parseHtml pattern; generate.ts + sources.ts + sources.test.ts + html-to-wikitext.ts + verify-integrity.ts now under project-references supervision
- Phase 58 (Phase 57 follow-up): siteMetaTiddlers subtitle synced to "Evidence-Based Portfolio" at the generator source; eliminates the regenerate-drift risk flagged in 57-SUMMARY Deferred Issue #1 where manually-committed override got overwritten every generate run

### Pending Todos

None.

### Blockers/Concerns

None. Research complete, requirements defined, ready for roadmap.

## Session Continuity

Last session: 2026-04-22T09:30:00.000Z
Current activity: Phase 58 (Tzk-Style Structure) executed end-to-end in one pass. Delivered withPublicTag transform (TZK-01), extended tiddlywiki.info with public-index + all-index build targets (TZK-02), added tiddlywiki devDep + pnpm build scripts (TZK-02+TZK-04), directory scaffolding + README (TZK-05), and closed the Phase 57 sources.ts subtitle follow-up. Six commits (6f75aa1, 0b0184f, f5c0a48, d3d7f23, 6d00f72, bbe212a). Canary-tiddler filter smoke test proved public/all split correct. All 593 scripts tests pass, build exits 0, generated tiddlers + output HTML (2.8MB each) committed.
Resume file: None

**Next step:** Phase 59 — DOC-* requirements. Or `/gsd:verify-phase 58` to formalize completion.
