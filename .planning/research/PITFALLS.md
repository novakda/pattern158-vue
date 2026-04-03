# Pitfalls Research

**Domain:** Visual feedback collector added to existing Vue 3 SPA (html2canvas + GitHub Issues API)
**Researched:** 2026-04-03
**Confidence:** HIGH (verified against official docs, GitHub API documentation, html2canvas feature page, and direct codebase inspection of CSS/z-index/composable patterns)

## Critical Pitfalls

### Pitfall 1: html2canvas Cannot Render This Site's CSS Accurately

**What goes wrong:**
html2canvas does not support `box-shadow`, `filter`, `backdrop-filter`, `mix-blend-mode`, or `text-shadow`. This site uses all of them extensively -- 30+ `box-shadow` declarations across cards, navbars, and buttons; `text-shadow` on 8+ hero elements; `backdrop-filter: blur(4px)` on the hero overlay. Screenshots will look visually wrong: cards without depth, hero text without glow, overlays without blur. Testers will file "screenshot doesn't match what I see" bugs about the feedback tool itself.

**Why it happens:**
html2canvas re-renders DOM to canvas by parsing computed styles. It implements a subset of CSS -- it is not a browser engine. Developers assume "screenshot" means "pixel-perfect capture" but html2canvas is closer to "best-effort re-render."

**How to avoid:**
1. Document upfront that screenshots are approximate, not pixel-perfect. Add a visual disclaimer in the feedback UI: "Screenshot is approximate."
2. Do NOT try to fix html2canvas output -- accept the limitation. The screenshot's purpose is to show *which element* was selected and *rough context*, not to be a visual regression test.
3. Capture element bounding rect coordinates as structured data alongside the screenshot, so the issue contains both an approximate visual and precise location data.
4. Use `html2canvas(element, { scale: 1, logging: false, useCORS: true, allowTaint: false })` -- avoid `window.devicePixelRatio` scaling which increases file size with no accuracy benefit given the rendering gaps.

**Warning signs:**
- Hero section screenshots appear flat (no text-shadow, no backdrop blur)
- Card screenshots missing shadows
- Any time spent "fixing" html2canvas rendering quality
- Bug reports about the feedback tool's screenshot quality

**Phase to address:**
Screenshot capture phase. Set expectations in the PR description and component JSDoc. Write a brief "known limitations" note in the annotation panel UI.

---

### Pitfall 2: Base64 Screenshots Blow Past GitHub Issue Body Limit (65,536 chars)

**What goes wrong:**
GitHub Issue bodies have a hard limit of 65,536 characters (confirmed by GitHub staff -- stored as MySQL mediumblob with 4-byte unicode limit). A full-viewport html2canvas screenshot at reasonable quality produces a base64 string of 200KB-1MB+ (266K-1.3M+ characters after base64 encoding). Even a cropped element screenshot at low JPEG quality can exceed 65K characters for larger elements. Embedding the screenshot as a `data:image/png;base64,...` URI in the issue body will fail with a 422 Validation error.

**Why it happens:**
The naive approach is `![screenshot](data:image/png;base64,...)` inline in the issue body. Developers test with small elements (a button, a heading) and don't hit the limit until a larger element or full-page capture is attempted.

**How to avoid:**
Gist-first strategy is correct (already planned in PROJECT.md). The flow must be:
1. Capture screenshot as canvas
2. Convert to blob via `canvas.toBlob()` (not `toDataURL()` -- avoid holding the full base64 string in memory)
3. Base64-encode the blob for the Gist API (Gist requires text content, not binary)
4. Upload to Gist as a file with `public: false` (Gist files support up to 1MB)
5. Use the `files[filename].raw_url` from the Gist creation response in the issue body: `![screenshot](https://gist.githubusercontent.com/...)`
6. Data URI fallback (when Gist fails): use aggressive JPEG compression (quality 0.3-0.5), crop to element bounding rect only, and warn user that screenshot may be omitted if too large

**Warning signs:**
- 422 errors from GitHub Issues API
- Screenshots appearing truncated in issues
- Issue creation working for small elements but failing for larger ones (size-dependent failures)
- Tests only covering small-element screenshots

**Phase to address:**
GitHub integration phase. Gist upload must be implemented and tested before Issue creation is wired up. Test with the CaseFilesPage (largest DOM tree, most elements).

---

### Pitfall 3: PAT Token Leaked in Production Bundle

**What goes wrong:**
`VITE_GITHUB_TOKEN` is baked into the client bundle at build time by Vite's `import.meta.env` substitution. Vite statically replaces `import.meta.env.VITE_GITHUB_TOKEN` with the literal string value during the build. If the feedback collector code is included in a production build (even if the UI is hidden via `v-if` or CSS), the token string is in the JavaScript bundle. Anyone can extract it from browser DevTools Sources tab or by reading the built JS files.

**Why it happens:**
The `VITE_` prefix exists specifically to mark variables as "intended for client exposure." Developers use it correctly for non-secret config (site URL, feature flags) but forget that a PAT is a secret. The Vite docs warn about this, but the warning is easy to miss when following env var patterns from other parts of the app.

**How to avoid:**
1. **Build-time tree-shaking (primary defense):** The entire feedback collector module must be excluded from production builds. Use a conditional dynamic import gated on mode:
   ```typescript
   if (import.meta.env.MODE !== 'production') {
     import('./feedback/FeedbackCollector.vue')
   }
   ```
   Vite's tree-shaking eliminates dead code paths where the condition is statically false at build time.
2. **Minimal PAT scopes:** `public_repo` + `gist` only (classic token). Never `repo` (grants private repo access). Never `admin`, `delete_repo`, or write scopes beyond what's needed.
3. **Dedicated bot account:** Create a GitHub account specifically for this tool. No org membership, no access to private repos. If the token leaks, blast radius is limited to creating issues/gists on public repos.
4. **Never commit `.env`:** Add `.env`, `.env.local`, `.env.*.local` to `.gitignore`. Provide `.env.example` with placeholder values and scope documentation.
5. **Post-build verification:** After production build, run `grep -r "ghp_\|github_pat_" dist/` to confirm no token is present. Add this as a CI check.

**Warning signs:**
- `VITE_GITHUB_TOKEN` value visible when searching `dist/assets/*.js`
- PAT with more than `public_repo` + `gist` scopes
- PAT attached to a personal account with org access
- No `.env.example` documenting required scopes

**Phase to address:**
First phase (project scaffolding/env setup). Must be established before any GitHub API code is written. The build gating pattern must be proven before any code that references the token is merged.

---

### Pitfall 4: Overlay Z-Index War with Existing Site Chrome

**What goes wrong:**
The feedback collector needs overlays (hover highlight, annotation panel, picker mode indicator) that must appear above all site content. This site's z-index inventory:
- `z-index: 9999` -- skip-to-content link (line 374 of main.css)
- `z-index: 101` -- mobile nav overlay (line 3426)
- `z-index: 100` -- navbar and mobile nav panel (lines 387, 3444)
- `z-index: 1-2` -- various page-level stacking (hero, sections)

A feedback overlay at z-index 1000 would appear behind the skip-to-content link. At z-index 10000 it would work today -- until a future CSS change adds a higher value.

**Why it happens:**
Z-index conflicts are the classic "works on the page I tested, breaks on another page" bug. The feedback tool author tests on a content page, doesn't encounter the mobile nav overlay or skip-to-content link.

**How to avoid:**
1. **Teleport to body:** Mount the feedback collector UI in a `<Teleport to="body">` outside the Vue app's root `#app` element. This creates an independent stacking context that doesn't participate in the app's z-index hierarchy.
2. **Max z-index:** Use `z-index: 2147483647` (max 32-bit signed int) for the feedback overlay. This is the established convention for browser devtools-style overlays (React DevTools, Vue DevTools, Sentry feedback widgets all use this).
3. **Fixed positioning:** Use `position: fixed` for all overlay elements so they don't participate in the app's document flow.
4. **Test matrix:** Verify overlay visibility with: mobile nav open, skip-to-content focused, any scrolled position, both light and dark themes.

**Warning signs:**
- Feedback overlay disappearing behind navbar on scroll
- Hover highlight not visible on the hero section (hero has internal z-index stacking)
- Mobile nav covering the feedback panel
- Skip-to-content link appearing above the feedback overlay when focused

**Phase to address:**
UI overlay phase. Must be validated against all existing z-index contexts before integration is considered complete.

---

### Pitfall 5: CSS Selector Generation Produces Fragile or Useless Paths

**What goes wrong:**
Auto-generated CSS selectors for the clicked element end up being either too fragile (relying on Vue's `data-v-*` scoped style attributes that change every build) or too generic (`div > div > div > div > span`). When another developer reads the GitHub Issue, the selector doesn't help them find the element.

**Why it happens:**
Naive selector generation walks up the DOM and uses tag names, nth-child indices, and available attributes. This codebase has specific challenges:
- Vue scoped styles add `data-v-*` attributes (build-specific hashes)
- CSS cascade layers don't affect DOM but may confuse attribute-based selectors
- `<RouterView>` and `<Transition>` add wrapper elements to the DOM tree
- Dynamic class names like `router-link-active`, `router-link-exact-active` are state-dependent
- The site uses semantic class names (`.exhibit-card`, `.nav-bar`) but they're on parent elements, not always on the clicked element

**How to avoid:**
1. Prefer `id` when available (most stable, but rare in this codebase).
2. Prefer semantic class names: `.exhibit-card`, `.finding-card`, `.nav-bar`, `.personnel-card`, etc. Skip over wrapper divs to find the nearest semantically-named ancestor.
3. Skip `data-v-*` attributes entirely -- they change every build.
4. Skip classes matching known transient patterns: `v-enter*`, `v-leave*`, `router-link-active`, `router-link-exact-active`.
5. Include the element's visible text content (truncated to ~80 chars) in the issue body for human readability: "Element: `.exhibit-card h3` containing 'Exhibit A: The Organ Pipe Migration'"
6. Include bounding rect `{ top, left, width, height }` as fallback identification.
7. Cap selector depth at 4-5 levels. Deeper selectors are noise.

**Warning signs:**
- Selectors containing `data-v-` hashes
- Selectors with 6+ levels of `> div > div` nesting
- Selectors that don't match any element when pasted into browser DevTools on the same page
- Selectors that match multiple elements (not unique)

**Phase to address:**
Element capture phase. Selector generation logic needs a focused test suite with representative DOM fragments from this site (exhibit card, nav item, hero text, findings table row).

---

### Pitfall 6: Event Listener Leaks in Feedback Composable

**What goes wrong:**
The feedback collector needs global event listeners: `mousemove` for hover highlighting, `click` for element selection, `keydown` for keyboard shortcut activation, possibly `resize`/`scroll` for overlay repositioning. If these aren't cleaned up on component unmount, they accumulate on route navigation (Vue Router keeps the app alive, just swaps route components). After navigating 5 pages, there are 5 sets of `mousemove` listeners causing performance degradation and ghost hover highlights on stale element references.

**Why it happens:**
The existing `useBodyClass` composable correctly uses `onMounted`/`onUnmounted` for cleanup -- but it only adds/removes a single class, not dynamic listeners. The feedback collector is more complex: it has conditional listeners (only active in picker mode) and listeners that need to be added/removed based on reactive state. Common mistakes:
- Adding a listener in a `watch` callback but not returning a cleanup function
- Using arrow functions inline in `addEventListener` (can't reference the same function for `removeEventListener`)
- Adding listeners in `onMounted` but referencing them in `onUnmounted` with a different function identity

**How to avoid:**
1. Store listener references as named `const`s at composable scope: `const handleMouseMove = (e: MouseEvent) => { ... }`. Use the same reference for both `addEventListener` and `removeEventListener`.
2. For state-dependent listeners (only active in picker mode), use `watchEffect` with its cleanup pattern:
   ```typescript
   watchEffect((onCleanup) => {
     if (isPickerActive.value) {
       document.addEventListener('mousemove', handleMouseMove)
       onCleanup(() => document.removeEventListener('mousemove', handleMouseMove))
     }
   })
   ```
3. Write a test that toggles picker mode on/off multiple times and asserts no listener accumulation.
4. Use `onScopeDispose` as a final safety net to remove all listeners when the composable's effect scope is destroyed.

**Warning signs:**
- Performance degradation after toggling picker mode multiple times
- Hover highlights appearing on elements from a previous route
- Console warnings about detached DOM nodes
- Memory growth in DevTools Performance tab during extended use

**Phase to address:**
Core composable phase (where `useFeedbackCollector` or equivalent is built). Cleanup must be part of the initial implementation, not retrofitted.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline base64 screenshot in issue body (skip Gist) | Simpler code, one fewer API call | Fails for most real screenshots (65K char limit). Creates habit of bypassing Gist path. | Never for primary path. Acceptable only as documented fallback when Gist API is unreachable, with aggressive compression + crop + size check. |
| Single monolithic `useFeedbackCollector` composable | Fast to prototype | 500+ line composable mixing DOM manipulation, API calls, state management, UI logic. Untestable in isolation. | Early prototype only. Must be decomposed before milestone completion into: state (`useFeedbackState`), picker (`useElementPicker`), capture (`useScreenshot`), submit (`useGitHubSubmit`). |
| Hardcoded GitHub repo/owner in code | Works for this single site | Prevents extraction as reusable tool (PROJECT.md states: "self-contained for future extraction") | Never. Use `VITE_GITHUB_REPO` env var from day one. |
| Skipping Storybook stories for feedback components | Faster delivery | Breaks established project convention (every component has stories). Inconsistent portfolio artifact. | Never. This project's identity is that the code itself demonstrates engineering standards. |
| Feedback collector CSS in main.css | Consistent with existing codebase pattern | Couples feedback tool to site's design system, preventing clean extraction later | Use scoped styles or a separate CSS file imported only by the feedback module. This is a deliberate exception to the main.css convention because the tool is designed for extraction. |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| GitHub Issues API | Using `repo` scope PAT when `public_repo` suffices | Use `public_repo` + `gist` scopes only. Classic PAT. Create a dedicated bot account. |
| GitHub Issues API | Not distinguishing 422 (validation/spam) from 403 (auth) from 404 (repo not found) | Map each status code to a specific user-facing message. 422 often means body too long OR GitHub's spam filter triggered. 403 means token expired/revoked/wrong scope. 404 means repo name misconfigured in env var. |
| GitHub Gists API | Constructing raw URL manually instead of using API response | Use `response.files[filename].raw_url` from the creation response. The raw URL format has changed before and manual construction is fragile. |
| GitHub Gists API | Creating public gists (the default), exposing screenshot context | Always set `public: false` to create secret gists. Secret gists are accessible by URL but not listed in the user's public gist page and not indexed by search engines. |
| GitHub API rate limits | Not handling rate limit responses (403 with `X-RateLimit-Remaining: 0`) | Check `X-RateLimit-Remaining` header on responses. Show user-friendly "rate limited, try again in X minutes" message. Authenticated requests get 5,000/hour which is generous, but Gist upload + Issue creation = 2 requests per submission minimum. |
| html2canvas | Passing `document.body` for a "full page" screenshot | Capture only the selected element or its nearest semantic parent. Use the `x`, `y`, `width`, `height` options to crop to bounding rect. Full-body capture is slow, large, and includes the feedback overlay itself. |
| html2canvas | Not handling the Promise rejection on cross-origin errors | The hero background image (`/assets/images/hero/pattern158_organ_pipes_hero.png`) is same-origin, so CORS is not an issue for this site currently. But set `useCORS: true, allowTaint: false` defensively, and wrap in try/catch with fallback to "screenshot unavailable" in the issue body. |
| Vite env vars | Assuming `import.meta.env.VITE_GITHUB_TOKEN` is undefined in production (it's not -- it's the literal value or empty string) | The entire module tree referencing the token must be excluded via conditional dynamic import, not just checked at runtime. Vite replaces `import.meta.env.MODE` at build time, so `if (import.meta.env.MODE !== 'production')` enables tree-shaking of the import. |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unthrottled mousemove listener | Hover highlight repaints 60+ times/sec. Jank on lower-end devices, especially with DOM queries on each move. | Throttle to `requestAnimationFrame` cadence (16ms). Cache the previously-highlighted element and skip if unchanged. | Immediately noticeable on older hardware or when DevTools is open (doubles overhead). |
| html2canvas on large DOM trees | Screenshot capture takes 2-5+ seconds on CaseFilesPage (15 exhibit cards, stats bar, type headers). UI appears frozen. | Show a spinner/loading state during capture. Use `scale: 1` (not `window.devicePixelRatio`). Consider capturing only the selected element's subtree, not the entire visible page. | Pages with 50+ visible DOM nodes. CaseFilesPage is borderline at ~100+ nodes. |
| Highlight overlay triggering layout reflow | Adding/moving highlight div causes surrounding elements to shift, making the page "jump." | Use `position: fixed` with `pointer-events: none` for the highlight. Never insert elements into the existing DOM flow. Use `transform` for positioning (GPU-composited, no reflow). | Any page -- reflow is immediate and visible. |
| Capturing screenshot of element behind overlay | html2canvas renders the DOM tree including the feedback overlay, producing a screenshot with the overlay visible on top of the target element. | Temporarily hide the overlay (`display: none` or remove from DOM) before calling `html2canvas`, then restore it after the canvas Promise resolves. | Every screenshot -- the overlay is always visible when the user clicks "capture." |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| PAT with `repo` scope instead of `public_repo` | Token holder gets read/write access to ALL private repos on the account | Use `public_repo` + `gist` scopes only. Use a dedicated bot account with no org membership. |
| Committing `.env` with PAT to git | Token exposed in repo history permanently (even after file deletion, it's in git history) | `.gitignore` must include `.env*` (except `.env.example`). Consider a pre-commit hook that rejects files matching `.env`. |
| Not revoking PAT after feedback collection period | Stale token with unnecessary permissions persists indefinitely | Document PAT lifecycle: create at milestone start, revoke when feedback collection period ends. Set token expiration (90 days max). |
| Feedback collector code in production bundle | Exposes PAT string, allows arbitrary issue creation by anyone who reads the JS, potential for spam/abuse | Build-time code exclusion via conditional dynamic import on `import.meta.env.MODE`. Post-build verification grep. |
| Token stored in `localStorage` or cookie | XSS attack can exfiltrate the token | Token should only exist as a build-time constant, never stored in browser storage. It's baked into the JS by Vite at build time and exists only in memory at runtime. |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visual feedback during screenshot capture | User clicks "submit," nothing visible happens for 2-3 seconds, they click again. Duplicate issues created. | Show immediate loading state on click. Disable submit button. Show progress indicator ("Capturing screenshot..."). |
| Annotation panel covers the selected element | User can't see what they selected while writing their comment | Position annotation panel to the side of the selected element. If element is near viewport edge, flip panel to the other side. Consider a slight offset with an arrow/connector pointing to the element. |
| Picker mode has no visible escape hatch | User activates picker mode and can't figure out how to exit. Every click selects elements instead of navigating the site. | Visible "Exit picker" button fixed in a corner. Escape key always exits. Semi-transparent banner across top: "Feedback mode active -- click any element. Press Esc to exit." |
| Keyboard shortcut conflicts with browser shortcuts | The activation shortcut shadows an existing browser shortcut (e.g., Ctrl+Shift+F is Firefox's "Find in page" in some configurations) | Use an uncommon combo. Avoid Ctrl+Shift+[letter] (many browser extensions use these). Consider Ctrl+Alt+F or a double-tap pattern. Document the shortcut in a tooltip on the activation button. |
| No confirmation after successful issue submission | User doesn't know if their feedback was received | Show success toast with clickable link to the created GitHub Issue URL. Show error toast with actionable message on failure ("Token expired -- contact admin"). |
| Feedback button blocks site content on small screens | Fixed-position button overlaps important content on mobile viewports | Use a small, semi-transparent FAB (floating action button) in bottom-right corner. Allow it to be temporarily dismissed/minimized. |

## "Looks Done But Isn't" Checklist

- [ ] **Build gating:** Feedback collector code is tree-shaken from production bundle -- verify by running `grep -r "html2canvas\|GITHUB_TOKEN\|gist" dist/assets/` on production build output (should return nothing)
- [ ] **Listener cleanup:** Activate picker mode, navigate to another route via Vue Router, return to original route -- no ghost highlights, no console errors, no accumulated listeners
- [ ] **Dark mode:** Feedback overlay (highlight outline, annotation panel, activation button) is readable and contrasted in both light and dark themes. Must not use hardcoded colors.
- [ ] **Mobile nav interaction:** Feedback activation button doesn't conflict with hamburger menu position. Picker mode works (or is gracefully disabled) with mobile nav open.
- [ ] **Screenshot of overlaid element:** Screenshot does NOT include the feedback overlay itself -- overlay is hidden before capture and restored after
- [ ] **Gist privacy:** Screenshots are uploaded as secret gists (`public: false`), not public. Verify in the API request body.
- [ ] **Error states:** Token missing, token invalid/expired, network failure, repo not found, rate limited, Gist creation failed, issue body too large -- ALL show user-friendly messages, not unhandled Promise rejections
- [ ] **Keyboard accessibility:** Picker mode can be activated, element navigated, and annotation submitted entirely via keyboard
- [ ] **Storybook coverage:** All feedback collector components have stories demonstrating each state: inactive, picker active with hover, element selected, annotation panel open, submitting (loading), success, error
- [ ] **Self-contained styles:** Feedback collector CSS uses scoped styles or its own dedicated file, NOT the site's `main.css` cascade layers -- enables clean extraction later
- [ ] **No site style leakage:** The feedback collector's CSS does not accidentally override site styles (verify no global selectors like `button`, `input`, `textarea` without scoping)
- [ ] **Env documentation:** `.env.example` exists with all required variables, placeholder values, and comments documenting required PAT scopes

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| PAT exposed in production build | HIGH | Immediately revoke PAT on GitHub. Create new PAT with correct scopes on bot account. Audit GitHub for unauthorized issues/gists. Fix build gating. Redeploy. Rotate any other credentials on the same account. |
| Base64 inline instead of Gist upload | MEDIUM | Refactor issue body to use Gist URL reference. Existing issues with truncated screenshots cannot be retroactively fixed but can be manually re-captured. |
| Monolithic composable | MEDIUM | Decompose into: `useFeedbackState` (reactive state), `useElementPicker` (DOM interaction + hover), `useScreenshot` (html2canvas wrapper), `useGitHubSubmit` (API calls). Test each in isolation. |
| Z-index conflicts discovered late | LOW | Switch to `<Teleport to="body">` + max z-index approach. Isolated fix, does not affect existing site CSS. |
| Fragile CSS selectors in filed issues | LOW | Improve selector generation algorithm. Existing issues still contain screenshots and human-written descriptions, so selector quality is supplementary. |
| Event listener leaks | MEDIUM | Audit all `addEventListener` calls, ensure matching `removeEventListener` with same function reference. Refactor to `watchEffect` cleanup pattern. Test with repeated mount/unmount/toggle cycles. |
| Feedback styles leaking into site | MEDIUM | Move all feedback CSS to scoped styles or shadow DOM. Rename any global selectors. Verify no visual regressions on existing site pages. |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| PAT exposure (Pitfall 3) | Env setup / build gating (first phase) | `grep -r "ghp_\|github_pat_\|html2canvas" dist/` returns nothing after `npm run build` |
| Base64 size limit (Pitfall 2) | GitHub integration phase | Submit screenshot of CaseFilesPage hero (largest visual area) -- issue created with Gist-hosted image, no 422 error |
| html2canvas CSS gaps (Pitfall 1) | Screenshot capture phase | JSDoc and UI note document known limitations. Screenshot of hero section produces output (even without shadows/blur). |
| Z-index conflicts (Pitfall 4) | UI overlay phase | Open feedback overlay with: mobile nav expanded (z:101), skip-to-content focused (z:9999) -- overlay is above both |
| Fragile selectors (Pitfall 5) | Element capture phase | Selector for `.exhibit-card` does not contain `data-v-`. Selector resolves to 1 element in `document.querySelector()`. |
| Listener leaks (Pitfall 6) | Core composable phase | Toggle picker mode 10 times, navigate 3 routes, return -- no console errors, no ghost highlights, no memory growth |
| Dark mode contrast | UI overlay phase | Storybook stories render feedback UI in both themes. WCAG AA contrast verified on overlay text. |
| Gist visibility | GitHub integration phase | API call body includes `"public": false`. Response URL contains expected Gist path. |
| Token scope documentation | Env setup (first phase) | `.env.example` lists `VITE_GITHUB_TOKEN` with comment: "Requires public_repo + gist scopes only" |
| Style encapsulation | Component build phase | Feedback module uses scoped styles. No selectors in feedback CSS match existing site elements. `main.css` unchanged. |

## Sources

- html2canvas supported/unsupported CSS features: https://html2canvas.hertzen.com/features (confirmed: box-shadow, filter, backdrop-filter, text-shadow, mix-blend-mode unsupported) -- HIGH confidence
- GitHub Issue body limit: 65,536 characters -- confirmed via GitHub staff response at https://github.com/orgs/community/discussions/27190 -- HIGH confidence
- GitHub Gist file size limit: 1MB per file -- confirmed via GitHub REST API docs for Gists -- HIGH confidence
- GitHub OAuth scopes: `public_repo` for public repo issues, `gist` for gist creation -- confirmed via https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps -- HIGH confidence
- GitHub API rate limits: 5,000 requests/hour authenticated, 60/hour unauthenticated -- confirmed via https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api -- HIGH confidence
- Codebase CSS inspection: `box-shadow` (30+ uses), `text-shadow` (8 uses), `backdrop-filter` (1 use), z-index up to 9999 (skip-to-content), 1127 CSS custom property `var(--` references, cascade layers (`@layer reset, base, components, pages, utilities`) -- HIGH confidence (direct grep)
- Existing composable pattern: `useBodyClass.ts` uses `onMounted`/`onUnmounted` lifecycle hooks for cleanup -- HIGH confidence (direct read)
- Vite env var behavior: `VITE_` prefixed vars are statically replaced at build time -- HIGH confidence (established Vite behavior, documented in Vite docs)

---
*Pitfalls research for: Visual feedback collector on Vue 3 SPA (v3.0)*
*Researched: 2026-04-03*
