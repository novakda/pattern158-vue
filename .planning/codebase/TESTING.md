# Testing Patterns

**Analysis Date:** 2026-03-15

## Test Framework

**Runner:**
- Not configured - no test runner detected in project

**Assertion Library:**
- Not configured - no test framework installed

**Run Commands:**
- Not available - testing infrastructure not yet established

## Current Testing Status

**No Testing Framework Installed:**
- `package.json` contains no testing dependencies (Vitest, Jest, etc.)
- No test configuration files found (`vitest.config.*`, `jest.config.*`)
- No test files exist in codebase (`.test.ts`, `.spec.ts`, `.test.vue` not found)

**Development Dependencies:**
Current dev dependencies are limited to build tools:
```json
{
  "@vitejs/plugin-vue": "^5.2.0",
  "typescript": "~5.7.0",
  "vite": "^6.2.0",
  "vue-tsc": "^2.2.0"
}
```

## Recommended Testing Setup

**For Unit & Component Testing:**
- Framework: Vitest (Vue-aligned, Vite-integrated alternative to Jest)
- Component testing: Vue Test Utils (official Vue testing library)
- Assertion library: Vitest's built-in assertion or Chai

**For integration testing:**
- Consider Vitest for composable/utility function testing
- Vue Test Utils for component integration testing

## Code Testability Patterns

**Current Patterns That Support Testing:**

**Composables:**
- `useSeo()` composable in `src/composables/useSeo.ts` is well-structured for unit testing
- Takes options object parameter with clear interface `SeoOptions`
- No external dependencies beyond `@unhead/vue` - easily mockable
- Logic is isolated and focused

Example testable function:
```typescript
export function useSeo({ title, description, path }: SeoOptions) {
  const fullUrl = `${BASE_URL}${path}`
  useHead({
    // ... meta setup
  })
}
```

**Vue Components:**
- Components use dependency injection through props/route
- Components import and use composables directly - `import { useSeo } from '@/composables/useSeo'`
- Event handlers are named functions - testable via `wrapper.find('button').trigger('click')`
- Template logic is minimal - mostly conditional classes and loops

Example testable component pattern:
```typescript
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}
```

**Utilities:**
- Theme toggle logic in `ThemeToggle.vue` could be extracted to composable for easier testing
- localStorage operations wrapped in try-catch, allowing for mock storage
- Media queries use standard `window.matchMedia()` - mockable in tests

## Testing Considerations

**What Should Be Tested:**

1. **Composables:**
   - `useSeo()` - verify correct meta tags generated for different title/description/path combinations
   - Test URL construction with various paths

2. **Component Logic:**
   - `NavBar.vue` - menu toggle state, keyboard close (Escape key), resize handling
   - `ThemeToggle.vue` - theme state toggle, localStorage persistence (mocked), system preference sync
   - Route matching for active link detection

3. **Routing:**
   - Verify all routes in `router.ts` are accessible and load correct components
   - Test scroll behavior on navigation

**What's Currently Hard to Test:**

- DOM manipulation directly on `document.body` and `document.documentElement`
- `localStorage` operations (can be mocked)
- `window.matchMedia()` (can be mocked)
- Global event listeners if not properly cleaned up

## Mocking Strategy

**Framework:** Not yet configured

**Patterns to Mock:**

1. **Browser APIs:**
   - `localStorage` - mock for theme persistence tests
   - `window.matchMedia()` - mock system preference changes
   - `window.addEventListener` / `removeEventListener` - verify cleanup

2. **Vue Composables:**
   - `useHead()` from `@unhead/vue` - mock meta tag application
   - `useRoute()` from `vue-router` - provide test route objects

3. **Components:**
   - Child components can be stubbed in parent component tests
   - Example: Stub `ThemeToggle.vue` when testing `NavBar.vue`

## Test File Organization

**Recommended Location:**
- Co-located pattern: Place `.test.ts` and `.spec.ts` files alongside source files
- Example structure:
  ```
  src/
  ├── composables/
  │   ├── useSeo.ts
  │   └── useSeo.test.ts
  ├── components/
  │   ├── NavBar.vue
  │   └── NavBar.test.ts
  ```

**Alternative (if using separate test directory):**
- Mirror src structure in `tests/` directory
- Example: `tests/composables/useSeo.test.ts`

**Naming Convention:**
- `.test.ts` suffix preferred (matches Jest/Vitest standard)
- `.spec.ts` suffix acceptable (Jasmine convention)
- `.test.vue` for Vue component tests

## Test Structure Pattern

**Recommended Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useSeo } from '@/composables/useSeo'

describe('useSeo', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    // Cleanup
  })

  it('should set head meta tags with correct title', () => {
    // Test implementation
  })
})
```

**Common Test Patterns:**

1. **Setup/Teardown:**
   - `beforeEach()` for test initialization
   - `afterEach()` for cleanup

2. **Assertions:**
   - `expect(value).toBe(expected)`
   - `expect(mock).toHaveBeenCalledWith(args)`

3. **Async Testing:**
   - Vue composables using `onMounted()` require async handling
   - Use async/await or Vitest's async test syntax

## Coverage

**Target:** Not enforced

**View Coverage:** Not configured

**Recommended approach:**
- Establish minimum coverage threshold in vitest.config
- Aim for >80% coverage on critical paths
- Prioritize composables and utility functions

## Test Types

**Unit Tests:**
- Scope: Individual functions and composables
- Approach: Test `useSeo()` composable with various input combinations
- Example area: `src/composables/useSeo.ts`

**Component Tests:**
- Scope: Vue component behavior and templates
- Approach: Mount component, trigger events, verify state changes
- Example areas: `NavBar.vue` menu toggle, `ThemeToggle.vue` theme changes

**Integration Tests:**
- Scope: Multi-component interactions and routing
- Approach: Test navigation flow, theme sync across components
- Example: Verify theme toggle in NavBar affects global theme

**E2E Tests:**
- Framework: Not currently used
- Could be added with Playwright or Cypress if needed

## Missing Test Infrastructure

**To Enable Testing:**

1. Install dependencies:
   ```bash
   npm install -D vitest @vitest/ui vue-test-utils @vue/test-utils happy-dom
   npm install -D @testing-library/vue @testing-library/user-event
   ```

2. Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'
   import vue from '@vitejs/plugin-vue'
   import { fileURLToPath } from 'node:url'

   export default defineConfig({
     plugins: [vue()],
     test: {
       environment: 'happy-dom',
       globals: true,
     },
     resolve: {
       alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url))
       }
     }
   })
   ```

3. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

4. Create first test file: `src/composables/useSeo.test.ts`

---

*Testing analysis: 2026-03-15*
