# Codebase Structure

**Analysis Date:** 2026-03-15

## Directory Layout

```
pattern158-vue/
├── src/                                  # Source code (Vue 3 app)
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css                 # Design system, tokens, global styles
│   │   └── images/                      # Not committed - generated/downloaded assets
│   ├── components/                       # Reusable UI components
│   │   ├── NavBar.vue                   # Header navigation with mobile menu
│   │   ├── FooterBar.vue                # Footer content
│   │   └── ThemeToggle.vue              # Dark/light mode switcher
│   ├── pages/                           # Route-matched page components
│   │   ├── HomePage.vue
│   │   ├── PhilosophyPage.vue
│   │   ├── FaqPage.vue
│   │   ├── TechnologiesPage.vue
│   │   ├── PortfolioPage.vue
│   │   ├── ContactPage.vue
│   │   ├── TestimonialsPage.vue
│   │   ├── AccessibilityPage.vue
│   │   └── ReviewPage.vue
│   ├── composables/                     # Reusable composition functions
│   │   └── useSeo.ts                    # Head tag management for SEO
│   ├── App.vue                          # Root component (shell)
│   ├── main.ts                          # Bootstrap/entry point
│   └── router.ts                        # Route definitions
├── public/                              # Static assets (committed)
│   ├── assets/
│   │   └── images/
│   │       ├── hero/
│   │       ├── icons/
│   │       └── logos/
│   ├── robots.txt
│   └── sitemap.xml
├── dist/                                # Build output (generated)
├── index.html                           # HTML entry point
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite build configuration
├── env.d.ts                             # TypeScript ambient declarations
└── .planning/                           # GSD planning documents
    └── codebase/
```

## Directory Purposes

**`src/`:**
- Purpose: All application source code
- Contains: Vue components, TypeScript modules, CSS
- Key files: `main.ts` (bootstrap), `router.ts` (routing), `App.vue` (shell)

**`src/components/`:**
- Purpose: Reusable UI components shared across pages
- Contains: Layout components (header, footer), interactive controls
- Key files: `NavBar.vue` (navigation), `ThemeToggle.vue` (theme switcher)

**`src/pages/`:**
- Purpose: Full-page components mapped to routes
- Contains: Page content components (one per route)
- Key files: All nine page components correspond to routes in `src/router.ts`

**`src/composables/`:**
- Purpose: Reusable composition functions (Vue 3 Composition API)
- Contains: Logic extraction, custom hooks
- Key files: `useSeo.ts` (metadata injection)

**`src/assets/css/`:**
- Purpose: Global styling and design system
- Contains: CSS custom properties (tokens), cascade layers, utility classes
- Key files: `main.css` (1000+ lines of design tokens, components, utilities)

**`src/assets/images/`:**
- Purpose: Source images (not yet committed in this scaffold)
- Contains: To be populated with hero images, logos, icons

**`public/`:**
- Purpose: Static assets served as-is to browser
- Contains: Pre-built images, SEO metadata files
- Key files: `robots.txt`, `sitemap.xml`, brand images in `public/assets/images/`

**`dist/`:**
- Purpose: Build output (generated on `npm run build`)
- Contains: Compiled JavaScript, CSS, optimized assets
- Generated: Yes | Committed: No (in .gitignore)

## Key File Locations

**Entry Points:**
- `index.html`: HTML document shell, includes theme detection script, mounts Vue app
- `src/main.ts`: Vue app initialization, router creation, @unhead setup
- `src/router.ts`: Route definitions with lazy-loaded page components

**Configuration:**
- `package.json`: Dependencies (Vue 3, Vue Router, @unhead/vue, Vite, TypeScript)
- `tsconfig.json`: TypeScript compiler options, path aliases (@/), strict mode enabled
- `vite.config.ts`: Vite bundler config, Vue plugin, path alias resolution
- `env.d.ts`: TypeScript ambient declarations for Vite client types

**Core Logic:**
- `src/App.vue`: Root component (header, router-view, footer)
- `src/composables/useSeo.ts`: SEO metadata injection logic
- `src/components/ThemeToggle.vue`: Theme state management and persistence
- `src/components/NavBar.vue`: Navigation routing and mobile menu handling

**Styling:**
- `src/assets/css/main.css`: Design tokens, cascade layers, global components

**Testing:**
- Not yet implemented (no test files present)

## Naming Conventions

**Files:**
- Vue components: PascalCase with `.vue` extension (e.g., `NavBar.vue`, `HomePage.vue`)
- TypeScript modules: camelCase with `.ts` extension (e.g., `useSeo.ts`, `main.ts`, `router.ts`)
- CSS files: lowercase with hyphen separators (e.g., `main.css`)

**Directories:**
- Feature folders: lowercase plural (e.g., `components/`, `pages/`, `composables/`, `assets/`)
- Logical grouping: `assets/` contains `css/` and `images/` subdirs

**Functions:**
- Composables: prefix with `use` (e.g., `useSeo`)
- Event handlers: prefix with `on` or descriptive verb (e.g., `onMounted`, `toggleMenu`, `closeMenu`)
- State refs: descriptive camelCase (e.g., `menuOpen`, `isDark`)

**Types:**
- Interfaces: PascalCase (e.g., `SeoOptions` in useSeo.ts)
- Type aliases: PascalCase

**CSS:**
- Custom properties (tokens): lowercase with hyphens, prefixed by category (e.g., `--color-primary`, `--space-md`, `--font-heading`)
- Class selectors: kebab-case (e.g., `.skip-link`, `.hamburger`, `.logo-link`)
- Component classes: descriptive kebab-case (e.g., `.theme-toggle`, `.nav-menu`)

## Where to Add New Code

**New Page:**
1. Create page component in `src/pages/[PageName]Page.vue`
2. Add route to `src/router.ts` with lazy import
3. Import `useSeo` composable and call with page metadata
4. Structure content using existing components (NavBar/FooterBar in App.vue)

**New Reusable Component:**
1. Create component in `src/components/[ComponentName].vue`
2. Use Vue 3 Composition API with `<script setup>`
3. Export and import in consuming pages/components

**New Composable:**
1. Create function in `src/composables/use[FeatureName].ts`
2. Follow pattern: accept options object, use Vue hooks, return reactive values or functions
3. Example pattern from useSeo: define interface for options, construct URLs, call useHead()

**Styling:**
- Add design tokens to `src/assets/css/main.css` in `:root` section (--token-name format)
- Add component styles in cascade layer `@layer components` or use scoped styles in `.vue` files
- Ensure WCAG AA color contrast (documented in CSS comments)

**Utilities:**
- Create small helper functions as `.ts` files in appropriate feature folder
- Or export from `src/main.ts` if global utility

## Special Directories

**`.planning/`:**
- Purpose: GSD planning and architecture documentation
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- Generated: No | Committed: No (initially)
- Used by: GSD orchestrator to guide implementation phases

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (via npm install) | Committed: No (in .gitignore)
- Contains: Vue 3, Vue Router, @unhead/vue, Vite, TypeScript

**`.git/`:**
- Purpose: Git repository metadata
- Generated: Yes | Committed: N/A (Git internals)

**`dist/`:**
- Purpose: Production build output
- Generated: Yes (via npm run build) | Committed: No (in .gitignore)
- Contains: Optimized JS, CSS, HTML, assets

---

*Structure analysis: 2026-03-15*
