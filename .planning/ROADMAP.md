# Roadmap: Pattern 158 Vue Conversion

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (shipped 2026-03-17)
- ✅ **v1.1 Exhibit Content Consistency** — Phases 5-8 (shipped 2026-03-19)
- ✅ **v2.0 Site IA Restructure — Evidence-Based Portfolio** — Phases 9-14 (shipped 2026-04-02)
- ✅ **v2.1 Case Files Bug Fixes** — Phases 15-16 (shipped 2026-04-02)
- ✅ **v2.2 Personnel Data & Rendering** — Phases 17-20 (shipped 2026-04-03)
- ✅ **v2.3 Findings Data & Rendering** — Phases 21-24 (shipped 2026-04-03)
- 🚧 **v3.0 Visual Feedback Collector** — Phases 25-30 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-03-17</summary>

- [x] Phase 1: Foundation Fixes (2/2 plans) — completed 2026-03-16
- [x] Phase 2: Homepage + Extraction Pattern (3/3 plans) — completed 2026-03-17
- [x] Phase 3: Remaining Pages + Completion (6/6 plans) — completed 2026-03-17
- [x] Phase 4: Exhibit Detail Pages + Data Fix (3/3 plans) — completed 2026-03-17

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v1.1 Exhibit Content Consistency (Phases 5-8) — SHIPPED 2026-03-19</summary>

- [x] Phase 5: Exhibit Audit (1/1 plans) — completed 2026-03-18
- [x] Phase 6: Structural Normalization (1/1 plans) — completed 2026-03-18
- [x] Phase 7: Content Gap Fill (2/2 plans) — completed 2026-03-18
- [x] Phase 8: Fix STRUCT-02 ExhibitCard Link Text (1/1 plans) — completed 2026-03-19

Full details: `.planning/milestones/v1.1-ROADMAP.md`

</details>

<details>
<summary>✅ v2.0 Site IA Restructure — Evidence-Based Portfolio (Phases 9-14) — SHIPPED 2026-04-02</summary>

- [x] Phase 9: Data Model Migration (3/3 plans) — completed 2026-03-31
- [x] Phase 10: Detail Template Extraction (2/2 plans) — completed 2026-03-31
- [x] Phase 11: Unified Listing Page (2/2 plans) — completed 2026-03-31
- [x] Phase 12: Navigation and Route Migration (1/1 plans) — completed 2026-04-01
- [x] Phase 13: Page Retirement (1/1 plans) — completed 2026-04-01
- [x] Phase 14: Documentation Gap Closure (1/1 plans) — completed 2026-04-02

Full details: `.planning/milestones/v2.0-ROADMAP.md`

</details>

<details>
<summary>✅ v2.1 Case Files Bug Fixes (Phases 15-16) — SHIPPED 2026-04-02</summary>

- [x] Phase 15: Impact Tag Style Restoration (1/1 plans) — completed 2026-04-02
- [x] Phase 16: Section Type Rendering (1/1 plans) — completed 2026-04-02

Full details: `.planning/milestones/v2.1-ROADMAP.md`

</details>

<details>
<summary>✅ v2.2 Personnel Data & Rendering (Phases 17-20) — SHIPPED 2026-04-03</summary>

- [x] Phase 17: Personnel Data Extraction (2/2 plans) — completed 2026-04-02
- [x] Phase 18: PersonnelCard Component (1/1 plans) — completed 2026-04-03
- [x] Phase 19: Layout Integration (1/1 plans) — completed 2026-04-03
- [x] Phase 20: Storybook Documentation (1/1 plans) — completed 2026-04-03

Full details: `.planning/milestones/v2.2-ROADMAP.md`

</details>

<details>
<summary>✅ v2.3 Findings Data & Rendering (Phases 21-24) — SHIPPED 2026-04-03</summary>

- [x] Phase 21: Type Definition & Data Extraction (2/2 plans) — completed 2026-04-03
- [x] Phase 22: FindingsTable Component (2/2 plans) — completed 2026-04-03
- [x] Phase 23: Layout Integration (1/1 plans) — completed 2026-04-03
- [x] Phase 24: Storybook Documentation (1/1 plans) — completed 2026-04-03

Full details: `.planning/milestones/v2.3-ROADMAP.md`

</details>

### v3.0 Visual Feedback Collector (In Progress)

**Milestone Goal:** Build a self-contained dev/staging feedback tool that lets testers click any element, annotate it, and file a GitHub Issue with full context -- screenshot, element selector, viewport, and user agent.

- [x] **Phase 25: Foundation & Build Gating** - Security-critical scaffold: conditional mount, env var config, FAB trigger, self-contained CSS namespace (completed 2026-04-03)
- [ ] **Phase 26: Element Picker & Selection** - DOM element hover highlighting, click-to-select with context capture, keyboard shortcut toggle
- [ ] **Phase 27: Screenshot Capture** - html2canvas integration with loading state and element screenshot as data URI
- [ ] **Phase 28: Annotation Panel & Comment Flow** - Comment textarea, metadata display, screenshot preview, panel positioning with flip logic
- [ ] **Phase 29: GitHub Integration** - Gist screenshot upload, Issue creation with structured body, success/error states, labels and retry
- [ ] **Phase 30: Annotation Drawing Overlay** - Canvas-based drawing overlay for rectangles and arrows on screenshot

## Phase Details

### Phase 25: Foundation & Build Gating
**Goal**: Dev/staging feedback tool scaffold is in place -- conditionally mounted, self-styled, and configurable
**Depends on**: Phase 24 (previous milestone complete)
**Requirements**: BUILD-01, BUILD-02, BUILD-03, PICK-01
**Success Criteria** (what must be TRUE):
  1. Production build contains zero bytes from the feedback collector (no component code, no token reference)
  2. Dev build shows a floating action button in a fixed screen position
  3. Missing VITE_GITHUB_TOKEN or VITE_GITHUB_REPO prints a console warning at mount time
  4. All feedback collector styles use --fb-* tokens and fb- class prefixes with no dependency on site design tokens
**Plans**: 2 plans
Plans:
- [x] 25-01-PLAN.md — Types, CSS namespace, config and state composables
- [x] 25-02-PLAN.md — FAB component, root orchestrator, App.vue mount, env docs
**UI hint**: yes

### Phase 26: Element Picker & Selection
**Goal**: Users can activate picker mode, hover to highlight elements, and click to capture element context
**Depends on**: Phase 25
**Requirements**: PICK-02, PICK-03, PICK-04, PICK-05
**Success Criteria** (what must be TRUE):
  1. Pressing Ctrl+Shift+F toggles picker mode on and off
  2. Hovering over any page element during picker mode shows a visible highlight outline around that element
  3. Clicking an element during picker mode captures its tag name, a unique CSS selector path, and bounding rect coordinates
  4. Captured element metadata includes the Vue component name when available in dev mode
**Plans**: TBD
**UI hint**: yes

### Phase 27: Screenshot Capture
**Goal**: Selected elements are captured as screenshot images with visible loading feedback
**Depends on**: Phase 26
**Requirements**: SHOT-01, SHOT-02
**Success Criteria** (what must be TRUE):
  1. After clicking an element in picker mode, html2canvas produces a base64 PNG data URI of that element
  2. A loading spinner is visible during the screenshot capture process
**Plans**: TBD

### Phase 28: Annotation Panel & Comment Flow
**Goal**: Users can review captured element context, preview the screenshot, write a comment, and cancel the flow
**Depends on**: Phase 27
**Requirements**: ANNOT-01, ANNOT-02, ANNOT-03
**Success Criteria** (what must be TRUE):
  1. Annotation panel displays a comment textarea, the captured screenshot preview, and element metadata (tag, selector, viewport, URL)
  2. Panel appears near the selected element without covering it (repositions via flip logic when near edges)
  3. Pressing Escape or clicking Cancel dismisses the panel and resets to idle state
**Plans**: TBD
**UI hint**: yes

### Phase 29: GitHub Integration
**Goal**: Users can submit feedback as a GitHub Issue with screenshot and full context in one click
**Depends on**: Phase 28
**Requirements**: GH-01, GH-02, GH-03, GH-04, GH-05, GH-06
**Success Criteria** (what must be TRUE):
  1. Clicking Submit uploads the screenshot as a secret Gist and creates a GitHub Issue with the Gist raw_url embedded in a structured markdown body
  2. Issue body contains comment text, screenshot image, element selector, page URL, viewport dimensions, and user agent
  3. When Gist upload fails, the system falls back to JPEG-compressed data URI with size validation
  4. Configured labels are applied to the created issue
  5. Success state displays a clickable link to the newly created GitHub Issue
  6. Error state shows an actionable message describing what failed, with a retry button
**Plans**: TBD

### Phase 30: Annotation Drawing Overlay
**Goal**: Users can draw rectangles and arrows on the screenshot to visually highlight areas of concern
**Depends on**: Phase 28
**Requirements**: ANNOT-04
**Success Criteria** (what must be TRUE):
  1. After screenshot capture, a canvas overlay appears on the screenshot preview allowing freeform drawing
  2. User can draw rectangles by click-and-drag on the screenshot
  3. User can draw arrows by click-and-drag on the screenshot
  4. Drawing annotations are composited into the final screenshot image before submission
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 25 -> 26 -> 27 -> 28 -> 29 -> 30
(Phase 30 depends on Phase 28 only, so could run parallel with Phase 29 if desired)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation Fixes | v1.0 | 2/2 | Complete | 2026-03-16 |
| 2. Homepage + Extraction Pattern | v1.0 | 3/3 | Complete | 2026-03-17 |
| 3. Remaining Pages + Completion | v1.0 | 6/6 | Complete | 2026-03-17 |
| 4. Exhibit Detail Pages + Data Fix | v1.0 | 3/3 | Complete | 2026-03-17 |
| 5. Exhibit Audit | v1.1 | 1/1 | Complete | 2026-03-18 |
| 6. Structural Normalization | v1.1 | 1/1 | Complete | 2026-03-18 |
| 7. Content Gap Fill | v1.1 | 2/2 | Complete | 2026-03-18 |
| 8. Fix STRUCT-02 ExhibitCard Link Text | v1.1 | 1/1 | Complete | 2026-03-19 |
| 9. Data Model Migration | v2.0 | 3/3 | Complete | 2026-03-31 |
| 10. Detail Template Extraction | v2.0 | 2/2 | Complete | 2026-03-31 |
| 11. Unified Listing Page | v2.0 | 2/2 | Complete | 2026-03-31 |
| 12. Navigation and Route Migration | v2.0 | 1/1 | Complete | 2026-04-01 |
| 13. Page Retirement | v2.0 | 1/1 | Complete | 2026-04-01 |
| 14. Documentation Gap Closure | v2.0 | 1/1 | Complete | 2026-04-02 |
| 15. Impact Tag Style Restoration | v2.1 | 1/1 | Complete | 2026-04-02 |
| 16. Section Type Rendering | v2.1 | 1/1 | Complete | 2026-04-02 |
| 17. Personnel Data Extraction | v2.2 | 2/2 | Complete | 2026-04-02 |
| 18. PersonnelCard Component | v2.2 | 1/1 | Complete | 2026-04-03 |
| 19. Layout Integration | v2.2 | 1/1 | Complete | 2026-04-03 |
| 20. Storybook Documentation | v2.2 | 1/1 | Complete | 2026-04-03 |
| 21. Type Definition & Data Extraction | v2.3 | 2/2 | Complete | 2026-04-03 |
| 22. FindingsTable Component | v2.3 | 2/2 | Complete | 2026-04-03 |
| 23. Layout Integration | v2.3 | 1/1 | Complete | 2026-04-03 |
| 24. Storybook Documentation | v2.3 | 1/1 | Complete | 2026-04-03 |
| 25. Foundation & Build Gating | v3.0 | 2/2 | Complete    | 2026-04-03 |
| 26. Element Picker & Selection | v3.0 | 0/0 | Not started | - |
| 27. Screenshot Capture | v3.0 | 0/0 | Not started | - |
| 28. Annotation Panel & Comment Flow | v3.0 | 0/0 | Not started | - |
| 29. GitHub Integration | v3.0 | 0/0 | Not started | - |
| 30. Annotation Drawing Overlay | v3.0 | 0/0 | Not started | - |
