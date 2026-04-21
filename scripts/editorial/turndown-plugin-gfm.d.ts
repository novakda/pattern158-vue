// scripts/editorial/turndown-plugin-gfm.d.ts
// Ambient module shim for @joplin/turndown-plugin-gfm (v1.0.64).
// Upstream ships no .d.ts; this local declaration provides the four exports
// we consume. TypeScript picks this up via the editorial tsconfig include
// glob ("scripts/editorial/**/*.ts").
declare module '@joplin/turndown-plugin-gfm' {
  import type TurndownService from 'turndown'
  export const gfm: (service: TurndownService) => void
  export const tables: (service: TurndownService) => void
  export const taskListItems: (service: TurndownService) => void
  export const strikethrough: (service: TurndownService) => void
}
