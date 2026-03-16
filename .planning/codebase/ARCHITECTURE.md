# Architecture

**Analysis Date:** 2026-03-15

## Pattern Overview

**Overall:** Client-side Single Page Application (SPA) with file-based routing

**Key Characteristics:**
- Vue 3 Composition API with TypeScript
- Client-side navigation via Vue Router
- Static site structure (portfolio/marketing)
- Component-based UI with composable logic
- SEO-aware head management for static content
- Theme management via data attributes

## Layers

**UI Components:**
- Purpose: Reusable layout and interaction components
- Location: `src/components/`
- Contains: Layout wrappers (NavBar, FooterBar), interactive features (ThemeToggle)
- Depends on: Vue 3, Vue Router (for navigation links)
- Used by: Root App component and page components

**Pages:**
- Purpose: Route-matched page components that define content sections
- Location: `src/pages/`
- Contains: Full-page components mapped to routes (HomePage, ContactPage, etc.)
- Depends on: Composables (useSeo), components
- Used by: Vue Router (via lazy imports in `src/router.ts`)

**Composables:**
- Purpose: Reusable logic extraction (Vue 3 composition functions)
- Location: `src/composables/`
- Contains: `useSeo()` for metadata management
- Depends on: @unhead/vue library
- Used by: Page components for SEO setup

**Root Component:**
- Purpose: Application shell and route outlet
- Location: `src/App.vue`
- Contains: Navigation, main content outlet, footer; accessibility markup
- Depends on: Components (NavBar, FooterBar)
- Used by: Vue app initialization in `src/main.ts`

**Styling:**
- Purpose: Design system with tokens and cascade layers
- Location: `src/assets/css/main.css`
- Contains: CSS custom properties (design tokens), layered components, responsive utilities
- Depends on: External fonts (Google Fonts), system font stacks
- Used by: All components (global stylesheet)

## Data Flow

**Page Load → Route Change:**

1. Browser requests `/` or navigates to route
2. Vue Router matches path to page component in `src/router.ts`
3. Route component (e.g., `src/pages/HomePage.vue`) lazy-loads
4. Page component calls `useSeo()` composable to inject head tags
5. @unhead/vue injects meta tags, title, canonical links into document head
6. Page content renders within `<router-view />` in `src/App.vue`
7. Navigation remains consistent (NavBar, FooterBar persist)

**Theme Change:**

1. User clicks ThemeToggle button in NavBar
2. `src/components/ThemeToggle.vue` toggles `isDark` state
3. Theme is applied via `applyTheme()` function to `document.documentElement`
4. `data-theme="dark"` attribute set/removed on `<html>` element
5. CSS custom properties and dark mode selectors respond to attribute
6. Theme preference persisted to localStorage (key: `'theme'`)
7. Cross-tab synchronization via storage events

**SEO Metadata Setup:**

1. Page component initializes with `useSeo({ title, description, path })`
2. Composable constructs full URL from BASE_URL constant
3. Meta tags generated: description, og:*, twitter:* properties
4. Canonical link set to full URL
5. @unhead/vue injects all tags into document `<head>`
6. Static site content does not require runtime data fetching

## Key Abstractions

**Route Definition:**
- Purpose: Map paths to page components
- Examples: `src/router.ts`
- Pattern: Array of RouteRecordRaw with lazy-loaded component imports
- Rationale: Code splitting for better initial load performance

**SEO Composable:**
- Purpose: Centralize head tag management and prevent duplication
- Examples: `src/composables/useSeo.ts`
- Pattern: Function returning void that calls @unhead/vue useHead hook
- Rationale: Consistent metadata across pages, single source of truth for site name/URL

**Design Tokens:**
- Purpose: Centralize design decisions (colors, spacing, typography)
- Examples: CSS custom properties in `src/assets/css/main.css` (--color-primary, --space-md, etc.)
- Pattern: CSS variables organized in root :root selector
- Rationale: Accessible color system (WCAG AA verified), responsive spacing, dark mode support

**Navigation State:**
- Purpose: Track mobile menu open/close state
- Examples: `menuOpen` ref in `src/components/NavBar.vue`
- Pattern: Single ref tracking boolean state with event listeners for cleanup
- Rationale: Responsive navigation with keyboard and resize handlers

## Entry Points

**HTML Entry:**
- Location: `index.html`
- Triggers: Browser page load
- Responsibilities: Load fonts, theme detection script, mount Vue app, reference main.ts

**Application Bootstrap:**
- Location: `src/main.ts`
- Triggers: Module script in index.html
- Responsibilities: Create Vue app, configure router, attach @unhead, mount to #app

**Router:**
- Location: `src/router.ts`
- Triggers: Vue Router initialization in main.ts
- Responsibilities: Define all routes, lazy-load page components, handle scroll behavior

**Theme Detection:**
- Location: Inline `<script>` in `index.html`
- Triggers: Before CSS loads (prevents flash of unstyled theme)
- Responsibilities: Read localStorage, check system preference, set data-theme attribute early

## Error Handling

**Strategy:** No explicit error handling detected (static site, no API calls)

**Patterns:**
- localStorage access wrapped in try/catch blocks (in ThemeToggle, index.html theme detection)
- Graceful degradation if localStorage unavailable
- No route error boundaries defined (9 routes all map to valid components)

## Cross-Cutting Concerns

**Logging:** Not implemented (no console logging observed in source)

**Validation:** Not required (static content, no form inputs or API integration)

**Authentication:** Not applicable (public portfolio site)

**Accessibility:**
- Skip-to-content link in App.vue
- ARIA labels on interactive elements (hamburger menu, theme toggle)
- ARIA current page indicator in NavBar links
- Semantic HTML (nav, main, footer, header)
- Color contrast ratios verified in CSS comments (WCAG AA compliance)
- Focus management (keyboard escape to close mobile menu)
- Responsive design (media query breakpoints embedded in CSS)

**Theme Management:**
- Data attribute-based system (`data-theme="dark"`)
- LocalStorage persistence with fallback to system preference
- Cross-tab synchronization via storage events
- Early detection script prevents FOUC (Flash of Unstyled Content)

---

*Architecture analysis: 2026-03-15*
