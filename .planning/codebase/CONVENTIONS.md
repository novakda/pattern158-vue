# Coding Conventions

**Analysis Date:** 2026-03-15

## Naming Patterns

**Files:**
- Components: PascalCase with `.vue` extension - `NavBar.vue`, `ThemeToggle.vue`, `FooterBar.vue`
- Pages: PascalCase with `Page` suffix - `HomePage.vue`, `FaqPage.vue`, `AccessibilityPage.vue`
- Composables: camelCase with `use` prefix - `useSeo.ts`
- Router and config: camelCase - `router.ts`, `main.ts`

**Functions:**
- camelCase for all function names - `toggleMenu()`, `closeMenu()`, `onEscape()`, `applyTheme()`
- Event handlers prefixed with `on` - `onMounted()`, `onUnmounted()`, `onEscape()`, `onResize()`
- Utility functions named descriptively - `useSeo()`, `toggle()`

**Variables:**
- camelCase for all variable names - `menuOpen`, `isDark`, `navLinks`, `route`
- Constants in UPPER_SNAKE_CASE - `STORAGE_KEY`, `THEME_ATTR`, `SITE_NAME`, `BASE_URL`, `OG_IMAGE`
- Private/internal use indicated by underscore prefix in destructured parameters - `_to`, `_from` in `scrollBehavior(_to, _from, savedPosition)`

**Types:**
- Interfaces in PascalCase with descriptive names - `SeoOptions`
- Type imports use `type` keyword - `import type { RouteRecordRaw } from 'vue-router'`
- Type annotations use explicit typing in function signatures and interfaces

## Code Style

**Formatting:**
- No explicit formatter detected in project (no `.prettierrc`, `eslint.config.*`, or `biome.json`)
- Consistent 2-space indentation observed throughout codebase
- Single quotes used for strings in TypeScript/Vue scripts
- Semicolons present at end of statements

**Linting:**
- No linting configuration detected in project
- TypeScript strict mode enabled in `tsconfig.json` with `"strict": true`
- Vue components use `<script setup lang="ts">` syntax consistently

**Type Safety:**
- Explicit TypeScript typing required with `strict: true` in `tsconfig.json`
- Type annotations required for function parameters and return types
- Vue components declare interfaces for options passed to composables

## Import Organization

**Order:**
1. Vue core imports - `import { ref, onMounted } from 'vue'`
2. Vue Router/library imports - `import { useRoute } from 'vue-router'`
3. Third-party library imports - `import { useHead } from '@unhead/vue'`
4. Local component imports - `import NavBar from '@/components/NavBar.vue'`
5. Local utility/composable imports - `import { useSeo } from '@/composables/useSeo'`
6. CSS/asset imports - `import './assets/css/main.css'`

**Path Aliases:**
- `@/` alias used for `./src/` paths in `tsconfig.json` and `vite.config.ts`
- Consistent usage across all imports - never use relative paths like `../` when `@/` is available

## Error Handling

**Patterns:**
- Try-catch blocks used for potentially failing operations like `localStorage` access
- Silent error catching with empty catch blocks - `try { ... } catch {}`
- Optional chaining not observed; explicit property checks used instead
- No throw statements or Error class instantiation in current codebase
- Errors are silently caught in non-critical operations (storage, theme persistence)

**Example Pattern:**
```typescript
try {
  localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
} catch {}
```

## Logging

**Framework:** Console not used in current codebase

**Patterns:**
- No explicit logging framework detected
- No `console.log()`, `console.error()`, or other console methods observed
- Development logging appears to be left to IDE/browser DevTools

## Comments

**When to Comment:**
- Inline comments used sparingly
- Comments document intent of CSS design tokens (see `/src/assets/css/main.css`)
- No JSDoc comments observed in TypeScript files
- Business logic appears self-documenting through clear naming

**JSDoc/TSDoc:**
- Not used in current codebase
- Type information provided through explicit TypeScript interfaces instead

## Function Design

**Size:**
- Most functions are short and focused - average 5-15 lines
- Single responsibility principle observed
- Composables like `useSeo()` are concise (36 lines total including exports)

**Parameters:**
- Use destructured objects for multiple parameters - `useSeo({ title, description, path })`
- Default parameters used where appropriate - `canonical?: string` in interfaces
- Callback functions used for event handlers - `@click="toggleMenu"`, `@click.stop="closeMenu"`

**Return Values:**
- Functions return explicit types
- Vue composables return nothing (void) as they use reactive state internally
- Router configuration exports arrays of route objects

## Module Design

**Exports:**
- Named exports preferred - `export const routes:`, `export function useSeo()`
- Single default export for Vue components - `export default` is implicit in SFC
- Router module exports constants and data structures

**Barrel Files:**
- Not used in current codebase
- Imports always directly reference source files

## Vue-Specific Conventions

**Script Setup:**
- `<script setup lang="ts">` used exclusively in all components
- Variables and functions defined in script scope directly used in template
- No component registration needed - imports are automatic

**Reactive State:**
- `ref()` used for simple boolean/string state - `ref(false)`, `ref(true)`
- Reactive references accessed with `.value` in TypeScript - `menuOpen.value`
- Shorthand used in templates without `.value` - `{{ menuOpen }}`

**Lifecycle Hooks:**
- `onMounted()` used for setup after DOM mount
- `onUnmounted()` used for cleanup (event listener removal)
- Proper cleanup with `removeEventListener()` pairing

**Event Handling:**
- Template directives: `@click`, `@change`, `@keydown`
- Event handlers call methods defined in script - `@click="toggleMenu"`
- `v-for` loops use `:key` binding - `:key="link.to"`

**Template Attributes:**
- ARIA attributes used for accessibility - `aria-label`, `aria-expanded`, `aria-controls`, `aria-current`, `aria-pressed`
- Data binding with dynamic classes - `:class="{ 'is-active': menuOpen }"`
- Conditional rendering - `:aria-current="route.path === link.to ? 'page' : undefined"`

---

*Convention analysis: 2026-03-15*
