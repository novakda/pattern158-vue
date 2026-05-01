# v8.0 Research Synthesis — Editorial Snapshot & Content Audit

**Date:** 2026-04-19
**Inputs:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md (+ PROJECT.md, v7.0-ABORT-NOTICE.md for context)
**Overall confidence:** HIGH — all 4 researchers converge on the same mental model; verified against codebase and live upstream registries on research day.

---

## 1. Milestone Framing

v8.0 is a **disposable, ~500-LOC, Playwright-driven capture tool** (`scripts/editorial/`) that visits every route on the live pattern158.solutions site, converts each page's rendered `<main>` to Markdown, and assembles one monolithic document for an editorial review pass. Output lives in the Obsidian vault at `career/website/site-editorial-capture.md`, is read and annotated by Dan, then feeds a `FINDINGS.md` doc and a milestone audit that decides v9.0's rebuild direction.

The milestone explicitly replaces aborted v7.0. v7.0 extracted *source* modules as canonical truth; v8.0 treats the *rendered live site* as canonical truth for editorial judgment. Three-stage lifecycle — Capture → Editorial → Audit — is a pipeline feeding a human decision, not a product. `scripts/editorial/` shares zero imports with `scripts/markdown-export/` so the v7.0 retention boundary stays clean.

---

## 2. Stack Decisions (Locked)

### Add (3 new devDependencies)

| Package | Version | Role |
|---------|---------|------|
| `turndown` | `^7.2.4` | HTML→Markdown engine. Active again as of 2026-04-03. Embedded `@mixmark-io/domino` DOM means no jsdom. |
| `@joplin/turndown-plugin-gfm` | `^1.0.64` | GFM tables (essential for personnel/technologies/findings). |
| `@types/turndown` | `^5.0.6` | TS types (upstream ships no types). DefinitelyTyped. |

### Bump

- `playwright` 1.58.2 → `^1.59.1` (recommended; minor, transparent, one-time fresh chromium download).

### Reuse (already installed)

- `playwright` (transitive via `vitest-browser-vue`), `tsx` 4.21.0, `yaml`, `github-slugger`.

### Rejected

| Rejected | Why |
|---|---|
| `@playwright/test` | Test-runner flavor — we're writing a script, not a suite. |
| `playwright-core` | Loses `playwright install` UX; second install path. |
| `turndown-plugin-gfm` (original) | Dead since 2017; 8+ years stale. |
| `node-html-markdown` | Smaller ecosystem, narrower rule API than Turndown's `addRule()`. |
| `@mozilla/readability` + `jsdom` | Heuristic for unknown pages; we already know `<main>`. |
| `cheerio` / standalone `jsdom` | Playwright already owns the DOM — re-parsing is waste. |
| `pandoc` | External native binary, platform-coupled, overkill. |
| `marked` / `remark` / `unified` | Wrong direction (MD→HTML). |

---

## 3. Feature Scope

### IN — Table-stakes (ship this)

**Capture (12):** Route list from typed sources (C1); headless sequential Chromium (C2); selector-based page-ready via `#main-content` (C3); HTTP status recording (C4); `<main>` scope only (C5); hydrated DOM via `page.locator('main').innerHTML()` (C6); **pre-expand FAQ accordions + set "All" filter (C7)**; fixed 1280×800 viewport (C8); fixed light theme (C9); skip redirect routes (C10); skip `/diag/*` and `/review` (C11); console-error capture to run log (C18).

**Conversion (11):** Turndown (V1); GFM tables plugin (V2); Obsidian-friendly config (V3); badge/pill passthrough (V4); image→alt-only (V5); preserve heading levels (V6); skip `aria-hidden` (V7); DOM-order reading preservation (V9); collapse 3+ blank lines (V10); strip script/style/noscript (V11); preserve link hrefs (V12).

**Document shape (7):** Single concatenated file (D1); frontmatter with provenance (D2); per-route `##` headings + demote page H1 (D3); auto-ToC (D4); per-page metadata block (D5); `---` separators (D6); ordered home → static → exhibits A–O (D7).

**Output (5):** Configurable path via CLI/env (O1); idempotent overwrite (O2); stdout summary (O5); loud non-200 warnings (O7); continue past per-route failures (O8).

**Editorial (6):** Obsidian-based read (E1); in-place annotation (E2); separate findings doc (E3); structured findings sections — Inconsistencies / Structural / Copy / Alignment / Open Questions (E4); cross-reference to career positioning docs (E5); blocker / should-fix / nice-to-have prioritization (E6).

**Audit (6):** Decision record artifact (A1); v7.0-ABORT-style structure (A2); explicit go/no-go per v9.0 candidate (A3); signals that informed the decision (A4); Rosetta Stone alignment check (A5); evolve PROJECT.md + MILESTONES.md (A6).

### CONSIDER — Differentiators

- **C13 screenshots per route** — trivial, real value for layout sanity checks. Recommend: include.
- **C14 SEO metadata capture** — trivial; surfaces stale meta descriptions. Recommend: include.
- **O3 dual-write mirror to `.planning/research/`** — trivial convenience. Recommend: include.
- **E7 scaffold empty findings template** — trivial ergonomics. Recommend: include.
- **V13 rewrite internal links to in-doc anchors** — moderate effort; defer if budget tight.

### OUT — Anti-features

Readability.js content extraction (V8); multi-file output (D8); HTML sidecar (D9); in-tool Markdown diff (D10); JSON run-report (O6); network trace log (C15); retry/backoff (C16); auth/session (C17); NotFoundPage capture (C12); automated copy linter (E8); automated inconsistency detection (E9).

---

## 4. Architecture Summary

### Directory layout (flat, ~300–580 LOC total)

```
scripts/editorial/
├── index.ts         # CLI entry — orchestrates phases, exit codes
├── config.ts        # argv + env → typed EditorialConfig
├── routes.ts        # buildRouteList(exhibits) — pure
├── capture.ts       # Playwright: launch → for-each-route → innerHTML
├── convert.ts       # Turndown + custom rules — pure
├── write.ts         # preflight + atomic write
├── types.ts         # Route, CapturedPage, EditorialConfig
└── __tests__/
    ├── routes.test.ts
    ├── convert.test.ts
    └── config.test.ts
```

### TypeScript integration

- **New `tsconfig.editorial.json`** — near-copy of `tsconfig.scripts.json`, `"include": ["scripts/editorial/**/*.ts"]`, `"outDir": ".tsbuildinfo-editorial"`. `"paths": {}` for forbidden-pattern isolation.
- **Add to root `tsconfig.json` `references`** — `vue-tsc -b` picks it up during `pnpm build`.
- **Forbidden patterns extended:** no `@/` aliases; no `Date.now()`/`new Date()` for deterministic fields; no `os.EOL`; no `Promise.all` over ordered capture; no postinstall hooks.

### Vitest integration

**Extend the existing `scripts` Vitest project `include` array** to cover `scripts/editorial/**/*.test.ts`. No 4th project.

### Data flow

```
exhibits.json ─→ routes.ts (pure buildRouteList)
                      │
CLI/env args ─────────┤
                      ▼
              Route[] (ordered)
                      ▼
              capture.ts (Playwright chromium.launch, sequential)
                      ▼
              CapturedPage[] { route, title, html, status, error? }
                      ▼
              convert.ts (Turndown + GFM + custom rules)
                      ▼
              write.ts (validateOutputPath → atomic tmp+rename)
                      ▼
    <vault>/career/website/site-editorial-capture.md
```

Preflight runs BEFORE browser launch — fail fast on `ENOENT`/permissions.

### Phase-count recommendation

**Seven phases (A–G):** A Scaffold → B Config+Routes (pure logic) → C Capture (Playwright IO) → D Convert (Turndown) → E Write+Preflight+Integration → F Editorial review (manual, no code) → G Milestone audit + v9.0 decision doc. Strictly sequential.

---

## 5. Critical Pitfalls & Required Mitigations

| # | Pitfall | Prevention |
|---|---------|------------|
| **CRIT-01** | FAQ answers behind accordion captured as empty (`:hidden="!isOpen \|\| undefined"`) | Pre-capture hook clicks every `[aria-expanded="false"]` in `.faq-accordion-item`; use `innerHTML` not `innerText`; assert answer count == `faq.json` length. |
| **CRIT-02** | FAQ filter bar excludes most questions from DOM | Click `[data-filter="all"]` before capture; assert rendered count == `totalCount`. |
| **CRIT-03** | SPA navigation "complete" before Vue router/Suspense/data resolve | Per-route known-good `waitForSelector`; content-length sanity check before Turndown. |
| **CRIT-04** | Exhibit slug 404 silently renders `NotFoundPage` with HTTP 200 | Post-nav selector assertion (`.exhibit-detail h1`); NotFoundPage signature detection; captured-count summary. |
| **CRIT-05** | Cloudflare edge cache serves stale content | Cache-buster query + `Cache-Control: no-cache` headers; log `cf-cache-status`; embed git SHA in frontmatter. |
| **CRIT-06** | Cloudflare bot detection serves interstitial instead of content | Headful option available; realistic UA; rate-limit 1 req/2-5s; detect `"Just a moment"` / response size < 200 bytes. |
| **CRIT-07** | Non-deterministic Markdown → run-to-run diffs useless | Strip `<script>`, `<style>`, `data-v-*`, analytics BEFORE Turndown; no body-embedded timestamps; double-run diff as self-test. |

**Project-specific CRITICAL warnings:**
- **P158-01** FAQ accordion — 27 items, densest prose — MUST open all + filter "All".
- **P158-03** Never fall back to reading JSON directly for exhibit content — that is the v7.0 failure mode this milestone exists to correct.
- **P158-05** SPA 404 = HTTP 200 → DOM-based validation is the only reliable signal.

---

## 6. Consolidated Open Questions for Dan

### A. Output & invocation (load-bearing)

- **Q-OUT-1** Output path mechanism. **Recommend: CLI `--output` primary, `EDITORIAL_OUT_PATH` env fallback, fail-loud if neither.**
- **Q-OUT-2** Primary vault location — user specified `career/website/site-editorial-capture.md`. Confirmed.
- **Q-OUT-3** Dual-write mirror to `.planning/research/`? Recommend yes (trivial).
- **Q-OUT-4** Re-run + annotation handling — recommend captures stay raw; annotations in separate `EDITORIAL-NOTES.md`.

### B. Capture behavior (load-bearing)

- **Q-CAP-1** Base URL — `https://pattern158.solutions` production default, `--base-url` override.
- **Q-CAP-2** Confirm FAQ pre-expand + "All" filter strategy (CRIT-01 / CRIT-02 / P158-01 mitigation).
- **Q-CAP-3** Confirm `/diag/personnel` and `/review` are excluded.
- **Q-CAP-4** Playwright bump 1.58.2 → 1.59.1 now? Recommend yes.
- **Q-CAP-5** Headful vs. headless — headless default, headful flag for Cloudflare interstitial fallback?

### C. Output shape

- **Q-SHAPE-1** Single monolithic file — milestone framing decided this.
- **Q-SHAPE-2** Heading level strategy — demote page H1 under per-route `##`, OR keep original levels with `---` separators?
- **Q-SHAPE-3** Screenshots per route — include? Recommend yes.
- **Q-SHAPE-4** Internal link rewriting (V13) — recommend defer.

### D. Build & integration

- **Q-BLD-1** Add `tsconfig.editorial.json` to root `references`? Recommend yes.
- **Q-BLD-2** Full `@joplin/turndown-plugin-gfm` vs. tables-only cherry-pick? Recommend full plugin.
- **Q-BLD-3** Tool committed vs. throwaway post-v9.0? Recommend keep.

### E. Findings & audit

- **Q-AUDIT-1** Auto-emit empty findings doc template (E7)? Recommend yes.

---

## 7. Recommended Phase Breakdown (7 phases, sequential)

| Phase | Name | Scope |
|-------|------|-------|
| **A (46)** | Scaffold | `tsconfig.editorial.json`, root `references` update, Vitest `scripts` include update, `.gitignore` entry, pnpm script `editorial:capture`, install 3 devDeps, placeholder `index.ts` |
| **B (47)** | Config + Routes (pure) | `types.ts`, `config.ts` (`parseArgs` + env fallback), `routes.ts` (`loadExhibits` + `buildRouteList`) + unit tests |
| **C (48)** | Capture (Playwright IO) | `capture.ts` — chromium launch, per-route selector manifest, `waitForSelector` + content-length check, `innerHTML()`, FAQ pre-expand + filter-all hooks, cache-buster + no-cache headers, analytics block, error-per-route recording |
| **D (49)** | Convert (Turndown) | `convert.ts` — Turndown v7 + GFM plugin, custom rules (strip `data-v-*`, aria-hidden, chrome selectors, image→alt, badge passthrough), heading-offset rule, whitespace collapse; fixture unit tests |
| **E (50)** | Write + Preflight + Orchestration | `write.ts` (validate → temp → atomic rename), `index.ts` wiring, exit codes, stdout summary, ToC generation, frontmatter (`captured_at`, `source_url`, `site_version_sha`, `tool_version`), optional dual-write + screenshots |
| **F (51)** | Editorial Review | Dan reads capture; produces `career/website/site-editorial-findings.md` — Inconsistencies / Structural / Copy / Alignment / Open Questions; cross-referenced to career positioning docs; prioritized |
| **G (52)** | Milestone Audit → v9.0 Direction | Decision doc mirroring `v7.0-ABORT-NOTICE.md` structure; v9.0 direction locked |

---

## 8. Cross-Researcher Conflicts

Two minor conflicts; neither load-bearing.

### Conflict 1: `"lib": ["ES2022", "DOM"]` vs. `"lib": ["ES2022"]`

Resolution: start with `["ES2022"]` (stricter), add DOM only if Phase C surfaces unresolvable `page.evaluate()` callback typing errors. Cheap to flip.

### Conflict 2: pnpm script name (`editorial:capture` vs. `capture:editorial`)

Resolution: existing repo convention is verb-first (`build:markdown`, `test:scripts`). Recommend **`editorial:capture`** (milestone-first namespacing); lock in Phase A.

### No conflicts on

Directory layout, Turndown + Joplin GFM + types stack, rejection of Readability/cheerio/jsdom/`@playwright/test`, Vitest `scripts` project extension, separate `tsconfig.editorial.json`, FAQ pre-expand + filter "All" mitigation, production URL default, CLI + env var output path, seven-phase strictly-sequential build order.

---

## 9. Confidence Assessment

| Area | Confidence | Notes |
|------|-----------|-------|
| Stack | HIGH | Versions verified against npm registry 2026-04-19. |
| Features | HIGH | Route list verified from `src/router.ts` + `exhibits.json`. |
| Architecture | HIGH | Mirrors `scripts/markdown-export/` Phase 38 pattern. |
| Pitfalls | HIGH | Vue/Playwright/Turndown behavior documented; FAQ accordion verified in codebase. |
| Cloudflare bot/cache | MEDIUM | Zone-level settings should be verified in dashboard before Phase C. |
| Turndown on nested lists / complex tables | MEDIUM | Phase D fixture tests will confirm against actual site markup. |

### Gaps to address during phase planning

1. Cloudflare zone settings verification (Bot Fight Mode off, cache-bypass works).
2. DOM audit per route — not every page may have consistent `<main>`.
3. Turndown custom-rule scope for badges/pills/cards — unknown until Phase C output inspected.
4. Mojibake risk on WSL2 write — post-write `â€` grep in Phase E verification.
5. Obsidian file-lock race — atomic temp+rename mitigates; Phase E test should exercise "Obsidian has file open" case.
