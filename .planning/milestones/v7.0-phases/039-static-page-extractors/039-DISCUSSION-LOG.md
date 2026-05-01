# Phase 39: Static Page Extractors - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 039-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-19
**Phase:** 039-static-page-extractors
**Mode:** mixed (checkpoint-resume + batch-proposal)
**Areas discussed:** Page metadata location, site-map.ts shape + exclusions, Content → IR + heading policy, Extractor testing strategy

---

## Area 1: Page Metadata Location (resumed from checkpoint)

Four decisions previously captured in `039-DISCUSS-CHECKPOINT.json` (2026-04-19 earlier session):

| Question | Answer |
|----------|--------|
| Where should page-level metadata live? | `src/content/meta.ts` (shared) — later refined in CONTEXT.md to `scripts/markdown-export/meta.ts` because page metadata is extractor-layer concern, not content-layer. |
| Static page tags? | One flat kebab-case tag per page |
| Page aliases? | No aliases for static pages (`aliases: []`) |
| Nav hierarchy? | Flat: `navOrder: number` |

**Note on meta.ts location:** The original checkpoint said `src/content/meta.ts`. On review before writing CONTEXT.md, metadata belongs in `scripts/markdown-export/meta.ts` — it is a property of the extractor layer (tags, navOrder, aliases are export-pipeline concerns), not of the content modules (which the Vue SFCs also import and shouldn't pick up tags/navOrder). CONTEXT.md D-01 records the refined location.

---

## Area 2: site-map.ts Shape + Exclusions (resumed from checkpoint)

Six decisions previously captured:

| Question | Answer |
|----------|--------|
| Entry extractor reference? | Direct function ref: `extract: (ctx) => PageDoc` |
| Excluded routes? | Block comment at top; no exported `excludedRoutes` |
| Phase 40 children stub? | Define slot `children?: readonly SiteMapEntry[]` now, empty for static pages |
| sourceRoute source? | Passed to extractor via `ExtractorContext` |
| Drift-guard test? | Yes — programmatic test with hardcoded `KNOWN_EXCLUSIONS` allowlist |
| ExtractorContext shape? | Minimal: `{ sourceRoute: string }` |

---

## Area 3: Content → IR + Heading Policy (batch proposal, 2026-04-19)

Proposed as batch table, user accepted all rows.

### Row 3.1 — Where does the H1 live?
| Option | Selected |
|--------|----------|
| `PageDoc.title` only; extractors do NOT emit H1 DocNode | ✓ |
| Extractor emits `heading(1, title)` as first body node | |
| Renderer-configurable (extractor emits optional first H1) | |

**Rationale:** Phase 41 renderer decides whether to emit `# {title}`; Phase 42 relies on frontmatter `title`. Extractors stay renderer-agnostic per Phase 38 D-09.

### Row 3.2 — Section mapping
| Option | Selected |
|--------|----------|
| One named export with `heading` field → one H2 + section body in extractor-defined order | ✓ |
| One named export → one H2 + section body in module-declaration order | |
| Extractor-defined grouping + semantic restructuring | |

**Rationale:** Module shape is unordered object keys; extractor composes the section order. Matches SFC rendering.

### Row 3.3 — Sub-section heading level
| Option | Selected |
|--------|----------|
| H2 for section headings; sub-content stays as paragraphs/lists (no fabricated H3) | ✓ |
| Fabricate H3 for labeled bullets / definition lists | |
| Use H3 only if content module explicitly has nested `heading` | |

**Rationale:** No existing module has nested heading fields. Avoid inventing structure.

### Row 3.4 — DefinitionList + LabeledBullet rendering
| Option | Selected |
|--------|----------|
| GFM bullet list: `paragraph([strong(term), text(' — '), text(description)])` | ✓ |
| HTML `<dl>`/`<dt>`/`<dd>` | |
| Bold heading line + indented paragraph | |

**Rationale:** GFM-only (Phase 38 D6). Mono and Obsidian renderers treat bullet lists identically.

### Row 3.5 — Quotes
| Option | Selected |
|--------|----------|
| `blockquote([paragraph(text), paragraph(emphasis(cite))])` — plain IR, renderer-agnostic | ✓ |
| Extractor emits Obsidian `> [!quote]` callout string | |
| New `callout` primitive in Phase 39 | |

**Rationale:** Extractors stay renderer-agnostic. Obsidian callout syntax is Phase 42 renderer concern.

### Row 3.6 — Nav-depth heading shift
| Option | Selected |
|--------|----------|
| Out of scope for Phase 39; always emit H2 as first body level | ✓ |
| Extractor takes `navDepth` in `ExtractorContext` and emits shifted headings | |

**Rationale:** Already locked in ROADMAP.md Phase 41 scope. Keeps Phase 39 minimal.

---

## Area 4: Extractor Testing Strategy (batch proposal, 2026-04-19)

Proposed as batch table, user accepted all rows.

### Row 4.1 — Per-extractor test file
| Option | Selected |
|--------|----------|
| One co-located `{page}.test.ts` per extractor | ✓ |
| One shared `extractors.test.ts` | |
| Tests in `__tests__/` directory | |

**Rationale:** Matches Phase 38 co-location convention.

### Row 4.2 — Shared test helper module
| Option | Selected |
|--------|----------|
| No shared helper in Phase 39; inline assertions in test files | ✓ |
| Ship `test-helpers.ts` now with common assertions | |

**Rationale:** Premature abstraction. Same reasoning that rejected Phase 38 `emit()` helper.

### Row 4.3 — Per-extractor test assertions
Selected minimum assertion set:
- (a) Title matches `meta.ts`
- (b) Tags and aliases match `meta.ts`
- (c) `body[0]` is H2 (not H1)
- (d) Round-trip section coverage + body length
- (e) No H1 anywhere in body

### Row 4.4 — Snapshot tests
| Option | Selected |
|--------|----------|
| One Vitest inline snapshot per extractor via `toMatchInlineSnapshot()` | ✓ |
| External `__snapshots__/` directory | |
| No snapshots (shape-only assertions) | |

**Rationale:** Reviewable in diff; no snapshot rot from external files.

### Row 4.5 — Round-trip against source content
| Option | Selected |
|--------|----------|
| Extractors import the same `src/content/*.ts` modules as SFCs; tests derive from those imports | ✓ |
| Duplicated fixture data in test files | |
| Separate `__fixtures__/` JSON snapshots | |

**Rationale:** Single source of truth (LOAD-01-compatible). Parallels Phase 37 browser-test pattern.

### Row 4.6 — Drift-guard location
| Option | Selected |
|--------|----------|
| Shared `site-map.test.ts` asserting bidirectional router ↔ site-map coverage + `KNOWN_EXCLUSIONS` allowlist | ✓ |
| Per-extractor test asserts its own route exists in router | |
| CI-only grep script, no Vitest test | |

**Rationale:** Specifies where the previously-agreed drift-guard lives.

### Row 4.7 — Error-path testing
| Option | Selected |
|--------|----------|
| Extractors throw on missing content; Phase 39 tests skip error paths | ✓ |
| Extractors return Result<PageDoc, ExtractorError>; Phase 39 tests cover both | |

**Rationale:** Error paths belong to Phase 43 orchestrator integration tests. Keeps Phase 39 scope tight.

---

## Claude's Discretion

Captured in `039-CONTEXT.md` under the `### Claude's Discretion` subsection — extractor directory structure (flat vs grouped), `meta.ts` data shape (Record vs named exports), primitive import style (per-module vs barrel), per-module content-shape bridging (private adapter vs inline), wave decomposition for planning.

## Deferred Ideas

Captured in `039-CONTEXT.md` `<deferred>` section.
