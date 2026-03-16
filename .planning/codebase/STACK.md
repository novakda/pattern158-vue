# Technology Stack

**Analysis Date:** 2026-03-15

## Languages

**Primary:**
- TypeScript 5.7 - All source code, configuration, and composables

**Template Language:**
- Vue 3 Single File Components (.vue) - All component and page definitions

## Runtime

**Environment:**
- Node.js 24.11.1+ (inferred from current version)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present and committed)

## Frameworks

**Core:**
- Vue 3 (^3.5.0) - SPA frontend framework with Composition API
- Vue Router 4 (^4.5.0) - Client-side routing with lazy-loaded pages

**Head Management:**
- @unhead/vue (^2.0.0) - Server-side rendering and dynamic head management for SEO meta tags and canonical URLs

**Build/Dev:**
- Vite 6 (^6.2.0) - Build tool and dev server with hot module replacement
- @vitejs/plugin-vue (^5.2.0) - Vue 3 single-file component support for Vite
- vue-tsc (^2.2.0) - TypeScript compiler and type checking for Vue components

## Key Dependencies

**Critical:**
- vue (3.5.0+) - Core UI framework using Composition API `<script setup>` syntax
- vue-router (4.5.0+) - Provides client-side routing with lazy-loaded route components via `() => import()`
- @unhead/vue (2.0.0+) - Manages document head (meta tags, title, canonical URLs, OG tags) for SEO

**Build Infrastructure:**
- vite (6.2.0+) - Module bundler and dev server with ES modules support
- @vitejs/plugin-vue (5.2.0+) - Enables .vue single-file component compilation
- typescript (5.7.x) - Static type checking with strict mode enabled

## Configuration

**TypeScript:**
- Target: ES2020
- Module: ESNext
- Module Resolution: bundler
- Strict Mode: Enabled (`strict: true`)
- JSX: preserve (Vue handles template compilation)
- Path Aliases: `@` → `./src/*` defined in `tsconfig.json`

**Vite:**
- Vue plugin enabled with SFC support
- Path alias for `@` pointing to `src/` directory
- Config file: `vite.config.ts`

**ESM Modules:**
- All code uses ES module syntax (`import`/`export`)
- `package.json` declares `"type": "module"`

## Platform Requirements

**Development:**
- Node.js 18+ (compatible with TypeScript 5.7 and Vite 6)
- npm 9+ (ships with Node.js)
- Modern browser with ES2020 support (Chrome, Firefox, Safari, Edge)

**Production:**
- Static hosting (Vite builds to `dist/` directory with no backend required)
- Hosting platform: Any static file server (GitHub Pages, Netlify, Vercel, S3, etc.)
- No server-side runtime required

## Build Artifacts

**Output:**
- Directory: `dist/` (generated, not committed)
- Includes: HTML entry point, JavaScript bundles (lazy-loaded per route), CSS, assets
- Build command: `npm run build` (runs `vue-tsc -b && vite build`)

---

*Stack analysis: 2026-03-15*
