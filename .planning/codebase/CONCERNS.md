# Codebase Concerns

**Analysis Date:** 2026-03-15

## Tech Debt

### Incomplete Page Conversions
- **Issue:** 8 of 9 page files are scaffolds with placeholder content from HTML migration
- **Files:**
  - `src/pages/HomePage.vue`
  - `src/pages/ContactPage.vue`
  - `src/pages/FaqPage.vue`
  - `src/pages/AccessibilityPage.vue`
  - `src/pages/PortfolioPage.vue`
  - `src/pages/TechnologiesPage.vue`
  - `src/pages/TestimonialsPage.vue`
  - `src/pages/ReviewPage.vue`
- **Impact:** User-facing pages render "TODO: Convert from [file].html" placeholders instead of actual content. Site is not functional for visitors.
- **Fix approach:** Migrate actual HTML content from legacy HTML files into Vue component templates. `src/pages/PhilosophyPage.vue` is the only complete example to reference for structure and patterns.

### Hardcoded Site Configuration
- **Issue:** Site name, base URL, and OG image hardcoded in composable
- **Files:** `src/composables/useSeo.ts` (lines 10-12)
- **Impact:** Configuration cannot be changed without code modification. No ability to deploy to different domains or environments.
- **Fix approach:** Move `SITE_NAME`, `BASE_URL`, `OG_IMAGE` to environment variables or config file. Create `.env.example` documenting required variables.

### Missing Favicon Files
- **Issue:** `index.html` references favicon at `/assets/images/icons/pattern158_favicon_flat.png` but files may not exist
- **Files:** `index.html` (lines 27-29)
- **Impact:** Favicon won't load, resulting in 404 errors. Minor UX issue but indicates incomplete asset management.
- **Fix approach:** Verify favicon file exists at `public/assets/images/icons/pattern158_favicon_flat.png` and all required sizes.

## Broken Links

### Non-existent Exhibit Routes
- **Issue:** PhilosophyPage references exhibit routes that don't exist in router
- **Files:** `src/pages/PhilosophyPage.vue` (lines 80-84, 128, 135, 142, 149)
- **Broken routes:**
  - `/exhibits/exhibit-j`
  - `/exhibits/exhibit-e`
  - `/exhibits/exhibit-m`
  - `/exhibits/exhibit-l`
- **Impact:** Links in content are broken. Clicking them will result in 404 or page not found. Content references these exhibits as evidence but they're inaccessible.
- **Fix approach:** Either create exhibit pages/routes or remove links and inline content if exhibits are future work.

## Performance Bottlenecks

### Large CSS File
- **Issue:** Monolithic CSS file with extensive comments and tokens
- **Files:** `src/assets/css/main.css` (3955 lines)
- **Impact:** Single CSS bundle delivered to all pages. No per-component styling reduces ability to optimize delivery for simple pages.
- **Fix approach:** Consider scoped styles in Vue components for page-specific styles. Keep global tokens/design system CSS separate but could be optimized further.

## Fragile Areas

### DOM Direct Manipulation in Components
- **Issue:** Components directly manipulate DOM and window APIs without abstraction
- **Files:**
  - `src/components/NavBar.vue` (lines 11, 16, 26, 32-33, 37-38)
  - `src/components/ThemeToggle.vue` (lines 10, 13, 21, 30, 32)
- **Why fragile:** Direct `document.body.style.overflow`, `window.addEventListener`, `document.documentElement.setAttribute` calls are harder to test and maintain. If DOM structure changes, logic breaks.
- **Safe modification:** Refactor to use Vue lifecycle hooks properly. Create abstraction composables for DOM concerns (e.g., `useThemeManager`, `useMenuState`).
- **Test coverage:** No tests exist for these components.

### Theme Management with Try-Catch Silent Failures
- **Issue:** localStorage failures silently caught with empty catch blocks
- **Files:** `src/components/ThemeToggle.vue` (lines 22, 39)
- **Why fragile:** Silent failures make debugging difficult. If localStorage isn't available (private browsing, quota exceeded), user won't know. Theme might not persist but no error indication.
- **Safe modification:** Log failures or provide fallback UI feedback. Separate concerns: storage should be optional, not critical to theme toggle.
- **Test coverage:** No tests for localStorage edge cases (private mode, quota exceeded).

### Event Listener Cleanup Dependency
- **Issue:** NavBar relies on manual cleanup of event listeners in onUnmounted
- **Files:** `src/components/NavBar.vue` (lines 32-33, 37-38)
- **Why fragile:** If onUnmounted doesn't fire properly (component reused, router edge case), listeners accumulate causing memory leaks.
- **Safe modification:** Use composition pattern or wrapper utilities to ensure guaranteed cleanup. Consider using VueUse `useEventListener` for automatic management.

## Security Considerations

### Hardcoded Author Email in Multiple Places
- **Risk:** Email address `dan@pattern158.solutions` is exposed in footer and SEO composable
- **Files:**
  - `src/components/FooterBar.vue` (line 7)
  - `src/composables/useSeo.ts` (line 21)
- **Current mitigation:** Email is public knowledge for a portfolio site, but pattern is brittle
- **Recommendations:**
  - Use environment variables for contact details
  - If spamming becomes issue, consider obfuscation on client side or server-side rendering

### No Content Security Policy
- **Risk:** External fonts loaded from googleapis.com without CSP protection
- **Files:** `index.html` (line 26)
- **Current mitigation:** Google Fonts is reputable but no explicit policy
- **Recommendations:** Add CSP headers in deployment (Vite config or server config) to restrict where resources can load from.

### External Google Fonts Dependency
- **Risk:** Site functionality depends on Google Fonts CDN availability
- **Files:** `index.html` (line 26)
- **Impact:** If googleapis.com is down or unreachable, fonts fail to load. Could break layout if fallback fonts don't match expected dimensions.
- **Recommendations:** Host fonts locally or include fallback display strategy (font-display: swap in CSS).

## Missing Critical Features

### No 404 Page
- **Issue:** Router has no catch-all route for invalid paths
- **Files:** `src/router.ts`
- **Problem:** Users navigating to non-existent routes (typos, old links) get broken state. No feedback that page doesn't exist.
- **Fix approach:** Add wildcard route `{ path: '/:pathMatch(.*)*', component: () => import('./pages/NotFoundPage.vue') }`

### No Error Boundary
- **Issue:** No error handling for component failures or navigation errors
- **Files:** `src/App.vue`, `src/main.ts`
- **Problem:** Runtime errors crash entire app. Users see blank page with no recovery path.
- **Fix approach:** Implement error boundary component or Vue error handler for graceful degradation.

## Test Coverage Gaps

### No Test Infrastructure
- **What's not tested:** Everything
- **Files:** Entire `src/` directory
- **Risk:**
  - Router config changes could break navigation silently
  - Theme logic has edge cases (private browsing, quota exceeded) that go undetected
  - SEO composable hardcoding means broken links in metadata if domain changes
  - Component DOM manipulation has no regression protection
- **Priority:** High - at minimum, add tests for:
  - Route navigation (all 9 routes render without errors)
  - Theme toggle persistence and cross-tab sync
  - SEO metadata generation with various props
  - NavBar menu open/close behavior

## Dependencies at Risk

### No Type Checking in Build
- **Risk:** `build` script runs `vue-tsc -b` but no `--noEmit` option confirmed in tsconfig
- **Files:** `package.json` (line 8), `tsconfig.json`
- **Impact:** Type errors might not block production builds. TypeScript strict mode enabled but no CI enforcement.
- **Migration plan:** Verify `noEmit: true` in tsconfig (already present) and ensure build fails on type errors. Add pre-commit hook.

### Outdated Vue Version Available
- **Risk:** Vue 3.5.0 may have security or performance updates
- **Files:** `package.json` (line 12)
- **Current:** Using caret range `^3.5.0` - allows minor/patch updates
- **Recommendation:** Run `npm audit` regularly. Consider pinning to exact version in production if stability is critical.

### Vite Configuration Minimal
- **Risk:** No optimization, asset compression, or build output configuration
- **Files:** `vite.config.ts`
- **Impact:** Built assets might be larger than necessary. No control over chunk splitting for routes.
- **Recommendation:** Add build optimizations: chunk splitting, asset inlining, minification configuration.

---

*Concerns audit: 2026-03-15*
