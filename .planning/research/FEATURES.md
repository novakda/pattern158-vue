# Feature Research

**Domain:** Visual feedback collector for dev/staging bug reporting (v3.0 milestone)
**Researched:** 2026-04-03
**Confidence:** HIGH (well-established domain with commercial precedents; scoped to internal dev tooling, not end-user feedback)

---

## Context Note

This is a **dev/staging-only tool** for the Pattern 158 Vue portfolio site. The audience is Dan (the developer) and any future testers reviewing the site before deployment. This is NOT a production-facing feedback widget like BugHerd or Marker.io -- those tools serve end users, clients, and QA teams at scale. The v3.0 scope is narrower: a self-contained widget that lets a tester click an element, annotate it, and file a GitHub Issue with full technical context.

Commercial tools in this space (BugHerd, Marker.io, UserSnap, Ybug, Feedbucket) share a common interaction model: activate widget, select element, annotate, submit. The core UX pattern is well-established. What varies is the depth of metadata capture, annotation richness, and integration breadth. For a dev-only tool, most of the commercial complexity (user management, session replay, multi-project dashboards) is irrelevant.

The existing codebase is a Vue 3 + TypeScript + Vite SPA with ~6,800 LOC, 185 unit tests, comprehensive design token system, and Storybook 10. The feedback collector must be self-contained (isolated styling for potential future extraction) and gated to non-production builds.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that must work for the tool to be useful. A feedback tool that can't capture what the tester sees is broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Picker mode activation | Every visual feedback tool starts with "click to select." Without a clear entry point, the tool is invisible. BugHerd uses a sidebar toggle; Marker.io uses a floating button + keyboard shortcut | LOW | Floating button (corner-anchored) + keyboard shortcut (e.g., Ctrl+Shift+F). Button must be unobtrusive -- small icon, not a full widget bar. Toggle on/off state |
| DOM element hover highlighting | Visual confirmation that the tester is targeting the right element. All commercial tools show an outline/overlay on hover during picker mode. Without this, element selection is a guessing game | MEDIUM | CSS outline or overlay box around hovered element. Must track mousemove events, compute bounding rect, render highlight overlay. Performance concern: throttle mousemove handler. Must not interfere with page scroll or existing hover states |
| Element click to select | Clicking during picker mode locks the selection to the hovered element. This is the core interaction -- every commercial tool does it | LOW | Click handler during picker mode. preventDefault to avoid triggering links/buttons on the page. Store selected element reference |
| Element context capture | Developers need enough info to find the element in code. CSS selector path + bounding rect + tag name is the minimum. BugHerd captures the exact HTML element; Marker.io captures selector path | MEDIUM | Generate unique CSS selector path (walk up from element to body, using IDs, classes, nth-child). Capture: tagName, selector path, bounding rect (x, y, width, height), innerText snippet (truncated). Vue component name would be a bonus (accessible via `__vue_app__` or devtools hooks) |
| Screenshot capture | A picture is worth a thousand words. Every commercial tool captures a screenshot. Without it, the reporter has to describe what they see in text | HIGH | html2canvas (most popular, 2.6M weekly downloads, stable at v1.4.1) or html-to-image (faster, better modern CSS support). html2canvas is the safer choice for a portfolio-scale DOM. Captures the visible viewport. Known limitations: cross-origin images need CORS, some CSS filters may not render. For this portfolio site (no cross-origin content, standard CSS), limitations are minimal |
| Comment/annotation input | The tester needs to describe the issue. A text field anchored near the selected element is the minimum. All commercial tools provide at least a text input | LOW | Text area in an overlay panel. Positioned near the selected element (anchored to bounding rect, with viewport edge detection to stay on screen). Placeholder text: "Describe the issue..." |
| GitHub Issue submission | The output must go somewhere actionable. For this project, GitHub Issues is the target. The whole point is to reduce the friction between "I see a bug" and "there's a trackable issue" | HIGH | GitHub Issues API (POST /repos/{owner}/{repo}/issues). Requires VITE_GITHUB_TOKEN and VITE_GITHUB_REPO env vars. Issue body includes: screenshot, element selector, viewport dimensions, user agent, URL, comment text. Token must have `repo` scope (or `public_repo` for public repos) |
| Screenshot in the Issue | A screenshot that only exists in the browser is useless. It must be attached to or linked from the GitHub Issue. GitHub Issues API does not support direct image upload | HIGH | **Primary: Gist upload.** Create a secret Gist via API with base64 PNG embedded in markdown (`<img src="data:image/png;base64,...">`), then link the Gist URL in the issue body. **Fallback: inline data URI** directly in issue body (works but makes the issue body enormous). Gist approach keeps issues clean and screenshots persistent |
| Dev/staging build gating | This tool must NEVER appear in production. It exposes a GitHub token and is dev tooling, not a product feature | LOW | Vite environment variable check: only register the component/plugin when `import.meta.env.DEV` or a `VITE_FEEDBACK_ENABLED` flag is set. Conditional import in main.ts. Tree-shaking removes it from production bundle |
| Environment metadata in Issue | Viewport size, user agent, current URL, and dark/light theme state are standard context. Every commercial tool captures this automatically | LOW | `window.innerWidth`, `window.innerHeight`, `navigator.userAgent`, `window.location.href`, current theme from localStorage or DOM attribute. Format as markdown table in issue body |

### Differentiators (Competitive Advantage)

Features that make this tool more useful than a basic screenshot + issue form. These are worth building because they showcase Vue engineering skill (this is a portfolio piece) and because they genuinely improve the dev workflow.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Annotation drawing overlay | Arrows, rectangles, and freehand drawing on the screenshot let the tester circle the exact problem area. Marker.io and UserSnap both offer this. Text description alone often fails to communicate spatial problems ("the thing on the right is misaligned") | HIGH | Canvas overlay on top of the captured screenshot. Drawing tools: rectangle, arrow, freehand. Color picker (red default). Composited onto the screenshot before upload. This is the single most complex feature -- it requires a mini drawing app. Worth building because it's the most visible portfolio demonstration |
| Vue component name in metadata | Unlike generic tools, this one runs inside the Vue app. It can introspect `__vue_app__` or walk the component tree to include the Vue component name in the issue. Developers using this tool care about component names more than CSS selectors | MEDIUM | Walk up from the DOM element to find the nearest Vue component instance. Vue 3 exposes component info on DOM elements via internal properties. In dev mode, `__vueParentComponent` or similar is available. Include component name and file path (if available via source maps) in issue metadata |
| Keyboard-driven workflow | Power users (i.e., the developer himself) want speed. Keyboard shortcut to activate, Escape to cancel, Enter to submit. No mouse-only workflows | LOW | Keyboard event listeners: Ctrl+Shift+F to toggle picker, Escape to cancel/close, Tab through form fields, Enter/Ctrl+Enter to submit. Must not conflict with existing app shortcuts or browser defaults |
| Issue labels and categorization | Auto-label issues as "visual-feedback" or "bug" so they're filterable in the GitHub repo. Pre-populated labels reduce triage effort | LOW | Add `labels: ["visual-feedback"]` to the GitHub Issues API call. Optionally let the reporter pick from a small set: bug, visual, content, accessibility |
| Configurable Gist visibility | Secret Gists by default (not listed publicly but accessible via URL). Option for public if the repo is public and transparency is desired | LOW | Default to secret Gist (`public: false` in Gist API call). Configurable via env var if needed |
| Self-contained styling | All feedback collector CSS uses a unique namespace (`.feedback-collector-*` or CSS layer) that cannot leak into or be affected by the portfolio site's design tokens | MEDIUM | CSS containment strategy: either a dedicated CSS layer (`@layer feedback-collector`), BEM-namespaced classes, or shadow DOM. CSS layer is the cleanest approach given the existing cascade layer system in the portfolio. Enables future extraction as a standalone package |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Session replay / video recording | Commercial tools like UserSnap offer session replay on higher tiers | Massive complexity: requires recording DOM mutations, input events, scroll positions. Storage and playback are separate engineering problems. Entirely out of scope for a dev tool used by one person | A screenshot with element context and a text description is sufficient for a developer debugging their own site |
| Real-time collaboration / comments | "Multiple testers commenting on the same issue" | This is a single-developer portfolio. There are no concurrent testers. GitHub Issues already has a comment thread. Building a real-time layer duplicates GitHub's own collaboration features | Submit to GitHub Issues. Discussion happens there |
| Drag-and-drop pin placement | BugHerd's signature feature: colored pins on the page at exact coordinates | Pins require persistent state (where are the pins stored?), a backend, and a dashboard to manage them. This is a full SaaS feature, not a dev utility | Click-to-select already captures the element. The issue in GitHub is the persistent record, not a pin on the page |
| Multi-project support | "Configure different repos for different projects" | This tool serves one project. Multi-project config adds env var complexity and UI for selecting a target repo with zero benefit | Single repo configured via VITE_GITHUB_REPO. If reused later, fork and reconfigure |
| User authentication / reporter identity | "Track who reported what" | Dev tool used by one person. GitHub token already identifies the reporter (issues are created under that token's account). Adding auth is pure overhead | GitHub token implicitly identifies the reporter |
| Console log capture | Marker.io captures console logs on higher tiers. Useful for catching JS errors alongside visual bugs | Requires intercepting console.log/warn/error before they fire, maintaining a circular buffer, and serializing potentially huge log output. For a dev tool, the developer has the browser console open already | Include a note in the issue template: "Check browser console for errors." The developer is the reporter -- they have direct console access |
| Network request capture | Marker.io captures network waterfall | Same as console logs but worse: intercepting fetch/XHR, recording timing, payload sizes. This is a profiler feature, not a feedback feature. The portfolio site makes zero API calls (fully static) | Not applicable. The site is static. No network requests to capture |
| Full-page screenshot (scrolled) | "Capture the entire page, not just the viewport" | html2canvas can do this but it's slow on long pages, produces enormous images, and the viewport screenshot already shows what the tester sees. Full-page captures are rarely more useful than viewport captures for visual bugs | Capture the visible viewport. If context beyond the viewport matters, the tester can describe it in the comment |
| Screenshot comparison / diff | "Compare current screenshot to a baseline" | Requires storing baselines, computing pixel diffs, handling responsive variability. This is visual regression testing (Chromatic, Percy), not feedback collection | Use Playwright or Chromatic for visual regression. The feedback tool captures what looks wrong now, not what changed |

---

## Feature Dependencies

```
[Dev/staging build gating]  (independent, can be first)

[Picker mode activation]
    |
    +--enables--> [DOM element hover highlighting]
    |                 |
    |                 +--enables--> [Element click to select]
    |                                   |
    |                                   +--enables--> [Element context capture]
    |                                   |
    |                                   +--enables--> [Screenshot capture]
    |                                   |                 |
    |                                   |                 +--enables--> [Annotation drawing overlay]
    |                                   |                 |
    |                                   |                 +--enables--> [Screenshot in Issue (Gist upload)]
    |                                   |
    |                                   +--enables--> [Comment/annotation input panel]
    |
    +--enables--> [Keyboard-driven workflow]

[Comment/annotation input panel]
    +--requires--> [Element click to select] (panel anchors near selected element)

[GitHub Issue submission]
    +--requires--> [Comment/annotation input] (issue body text)
    +--requires--> [Element context capture] (metadata in issue)
    +--requires--> [Screenshot in Issue (Gist upload)] (visual evidence)
    +--requires--> [Environment metadata] (viewport, UA, URL, theme)

[Self-contained styling]  (cross-cutting, applies to all UI components)

[Vue component name in metadata] --enhances--> [Element context capture]
[Issue labels] --enhances--> [GitHub Issue submission]
```

### Dependency Notes

- **Picker mode is the foundation.** Everything else depends on the ability to enter selection mode and target an element. Build this first.
- **Screenshot capture and element context are parallel tracks** after element selection. Screenshot requires html2canvas; context requires DOM traversal. Both feed into the GitHub Issue.
- **Gist upload depends on screenshot capture.** The Gist is the hosting mechanism for the screenshot. Must be created before the issue so the Gist URL can be included in the issue body. Two sequential API calls: (1) create Gist with screenshot, (2) create Issue referencing Gist.
- **Annotation overlay depends on screenshot capture** but enhances it. The screenshot must exist before annotations can be drawn on it. This is the most complex feature and can be deferred to a later phase within v3.0.
- **Self-contained styling is cross-cutting.** Every UI element (button, overlay, panel) must use isolated CSS. This is an architectural decision made at the start, not a feature added later.
- **Build gating is independent and should be the very first thing wired.** If the tool accidentally ships to production, it exposes a GitHub token. Gate first, build features second.

---

## MVP Definition

### Launch With (v3.0 Core -- Minimum Useful Feedback Tool)

The minimum that makes "click element, file issue" work end-to-end.

- [ ] Dev/staging build gate (conditional registration, tree-shaken from production) -- safety first
- [ ] Self-contained styling strategy (CSS layer or BEM namespace) -- architectural foundation
- [ ] Picker mode toggle (floating button + Ctrl+Shift+F keyboard shortcut)
- [ ] DOM element hover highlighting (outline overlay tracking mousemove)
- [ ] Element click to select (lock selection, preventDefault on page elements)
- [ ] Element context capture (tag, CSS selector path, bounding rect)
- [ ] Screenshot capture via html2canvas (viewport of selected element's area)
- [ ] Comment input panel (text area anchored near selected element)
- [ ] Environment metadata (viewport, user agent, URL, theme state)
- [ ] Gist upload (secret Gist with base64 screenshot PNG)
- [ ] GitHub Issue creation (structured body with screenshot link, metadata, comment)
- [ ] Escape to cancel, basic keyboard navigation

### Add After Core Works (v3.0 Enhancement Pass)

Features to add once the core flow is validated end-to-end.

- [ ] Annotation drawing overlay (rectangle, arrow, freehand on screenshot) -- highest-impact enhancement but most complex
- [ ] Vue component name in element metadata -- dev-specific value add
- [ ] Issue labels (auto-tag "visual-feedback", optional category picker)
- [ ] Configurable Gist visibility (secret vs. public)
- [ ] Keyboard shortcuts for annotation tools

### Future Consideration (Post-v3.0)

Features that are out of scope but noted for completeness.

- [ ] Extract as standalone npm package -- requires removing Vue-specific dependencies
- [ ] Support for non-GitHub issue trackers (Jira, Linear) -- only if Dan's workflow changes
- [ ] Dark mode for the feedback widget itself -- nice but not necessary for a dev tool

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Dev/staging build gate | HIGH (security) | LOW | P1 |
| Self-contained styling | HIGH (architecture) | MEDIUM | P1 |
| Picker mode activation | HIGH | LOW | P1 |
| Hover highlighting | HIGH | MEDIUM | P1 |
| Element click to select | HIGH | LOW | P1 |
| Element context capture | HIGH | MEDIUM | P1 |
| Screenshot capture | HIGH | MEDIUM | P1 |
| Comment input panel | HIGH | LOW | P1 |
| Environment metadata | MEDIUM | LOW | P1 |
| Gist screenshot upload | HIGH | MEDIUM | P1 |
| GitHub Issue submission | HIGH | MEDIUM | P1 |
| Keyboard shortcuts (basic) | MEDIUM | LOW | P1 |
| Annotation drawing overlay | HIGH | HIGH | P2 |
| Vue component name capture | MEDIUM | MEDIUM | P2 |
| Issue labels | LOW | LOW | P2 |
| Configurable Gist visibility | LOW | LOW | P3 |

**Priority key:**
- P1: Core feedback loop. Must work for the tool to be useful.
- P2: Enhancement pass. Adds significant value once core is proven.
- P3: Polish. Nice to have, minimal effort.

---

## Competitor Feature Analysis

How commercial tools handle these features, and what our dev-only scope means for each.

| Feature | BugHerd | Marker.io | UserSnap | Our Approach (v3.0) |
|---------|---------|-----------|----------|---------------------|
| Activation | Sidebar toggle on page edge | Floating button + shortcut | Floating widget button | Floating button + Ctrl+Shift+F. Simpler than sidebar -- no persistent UI footprint |
| Element selection | Click to pin on element | Click anywhere on page | Click to select area | Click to select specific DOM element with hover preview |
| Highlighting | Colored pin at click point | Blue outline overlay | Blue highlight overlay | CSS outline overlay on hover, locked on click |
| Screenshot | Auto-capture on pin | Auto-capture with annotation tools | Auto-capture with drawing tools | html2canvas on selection. Annotation as P2 enhancement |
| Annotation | Basic text only | Arrows, rectangles, text, highlight, blur | Drawing, arrows, shapes, text | P2: Canvas overlay with rectangle + arrow + freehand |
| Metadata | Basic: browser, OS, URL | Full: console logs, network, selector, viewport | Full: console, network, user info | Element selector, bounding rect, viewport, UA, URL, theme. No console/network (static site, dev has console open) |
| Integration | Limited (own tracker) | GitHub, Jira, Trello, Asana, ClickUp | Jira, Trello, Slack, Azure DevOps | GitHub Issues only. Single integration, done well |
| Image hosting | Internal CDN | Internal CDN | Internal CDN | Gist (base64 PNG). No CDN needed -- Gist is persistent and free |
| Pricing | $41-$109/mo | $39-$79/mo | EUR39-EUR949/mo | Free (self-hosted, GitHub API) |
| Build gating | External script, always loaded | External script or npm | External script or npm | Compile-time gating via Vite env. Zero production footprint |

---

## UX Flow (Reference for Implementation)

The standard interaction pattern across all commercial tools, adapted for our dev scope:

```
1. IDLE STATE
   - Small floating button in bottom-right corner (or configurable)
   - Keyboard shortcut hint on hover

2. PICKER MODE (activated by button click or Ctrl+Shift+F)
   - Cursor changes to crosshair
   - Page elements highlight on hover (outline + semi-transparent overlay)
   - Page click handlers are intercepted (preventDefault)
   - Escape cancels and returns to idle

3. ELEMENT SELECTED (click during picker mode)
   - Highlight locks on selected element
   - Element context captured (selector, rect, metadata)
   - Screenshot triggered (html2canvas)
   - Comment panel appears near selected element

4. ANNOTATION (P2 -- after screenshot captured)
   - Screenshot displayed in panel with drawing tools
   - Rectangle, arrow, freehand tools
   - Drawings composited onto screenshot

5. SUBMISSION (user clicks "Submit" or Ctrl+Enter)
   - Screenshot uploaded to Gist (if screenshot exists)
   - GitHub Issue created with structured body
   - Success/failure feedback to user
   - Return to idle state
```

---

## Sources

- [Marker.io: Usersnap vs BugHerd vs Marker.io comparison](https://marker.io/blog/usersnap-vs-bugherd-vs-markerio) -- commercial tool feature comparison
- [Feedbucket: Usersnap vs BugHerd vs Marker.io vs Feedbucket](https://www.feedbucket.app/blog/usersnap-vs-bugherd-vs-marker-io/) -- independent comparison with feature matrices
- [BugHerd: Best Website Feedback Tools for 2025](https://bugherd.com/blog/website-feedback-tools) -- ecosystem overview
- [monday.com engineering: Capturing DOM as Image Is Harder Than You Think](https://engineering.monday.com/capturing-dom-as-image-is-harder-than-you-think-how-we-solved-it-at-monday-com/) -- html2canvas vs alternatives deep dive
- [npm-compare: html2canvas vs modern-screenshot vs html-to-image](https://npm-compare.com/html2canvas,modern-screenshot,puppeteer,screenshot-desktop) -- download stats and feature comparison
- [GitHub community discussion: Image upload via REST API](https://github.com/orgs/community/discussions/46951) -- confirms no direct image upload in Issues API
- [GitHub community discussion: Gist binary file upload](https://github.com/orgs/community/discussions/29217) -- Gist as image hosting workaround
- [Ybug.io](https://ybug.io/) -- lightweight visual feedback tool reference
- [UserSnap: Human-centered bug reporting](https://usersnap.com/blog/human-centered-bug-reporting-with-visual-elements/) -- UX patterns for visual feedback
- PROJECT.md v3.0 milestone definition -- HIGH confidence, project specification

---

*Feature research for: Visual feedback collector for dev/staging bug reporting*
*Researched: 2026-04-03*
