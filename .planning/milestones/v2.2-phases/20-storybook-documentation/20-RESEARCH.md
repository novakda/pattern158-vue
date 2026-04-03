# Phase 20: Storybook Documentation - Research

**Researched:** 2026-04-02
**Domain:** Storybook stories for Vue 3 component documentation
**Confidence:** HIGH

## Summary

Phase 20 adds Storybook stories for the PersonnelCard component, covering three display variants: named person (all fields populated), anonymous person (no name), and self-highlighted entry (isSelf: true). This is a single-file addition following patterns already established across 20+ existing stories in the project.

The project uses Storybook 10 with `@storybook/vue3-vite`. All existing stories follow a consistent pattern: CSF3 format with `Meta` and `StoryObj` types imported from `@storybook/vue3-vite`, `meta` object with `title` and `component`, and named exports for each story variant with `args` providing mock data. No research gaps exist -- this is direct pattern replication.

**Primary recommendation:** Create `src/components/PersonnelCard.stories.ts` following the exact CSF3 pattern used by FindingCard.stories.ts and ExhibitCard.stories.ts, with three named story exports matching the three success criteria.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None -- all implementation choices at Claude's discretion.

### Claude's Discretion
All implementation choices are at Claude's discretion -- pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions. Follow existing Storybook story patterns established in the project.

### Deferred Ideas (OUT OF SCOPE)
None.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DOC-01 | Storybook stories for PersonnelCard covering named, anonymous, and self variants | Three story exports matching each variant; mock data derived from ExhibitPersonnelEntry interface fields |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

No project-level CLAUDE.md exists in the repository root. Global CLAUDE.md directives:
- Use search tools provided by Docker MCP Toolkit for internet queries (not applicable to this phase)
- Use Playwright browser tools for visual verification

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| storybook | ^10.2.19 | Story runner and UI | Already installed and configured |
| @storybook/vue3-vite | ^10.2.19 | Vue 3 + Vite framework integration | Already installed; provides Meta/StoryObj types |
| @storybook/addon-docs | ^10.2.19 | Auto-generated docs from stories | Already configured in .storybook/main.ts |
| @storybook/addon-a11y | ^10.2.19 | Accessibility checks | Already configured |

### Supporting
No additional libraries needed. All dependencies are already installed.

**Installation:** None required -- all packages already present.

## Architecture Patterns

### Project Story File Convention

All component stories in this project follow this exact structure:

```typescript
// Source: src/components/FindingCard.stories.ts (project convention)
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ComponentName from './ComponentName.vue'

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const VariantName: Story = {
  args: {
    // prop data
  },
}
```

Key observations from existing stories:
- Import types from `@storybook/vue3-vite` (NOT from `@storybook/vue3`)
- `meta` uses `satisfies Meta<typeof Component>` pattern
- Stories are named exports with `Story` type
- No decorators needed -- main.css is globally loaded via `.storybook/preview.ts`
- No router dependencies for PersonnelCard (it has no router-link usage)

### PersonnelCard Component Interface

```typescript
// Source: src/data/exhibits.ts
export interface ExhibitPersonnelEntry {
  name?: string
  title?: string
  organization?: string
  role?: string
  isSelf?: boolean
}

// Component prop: personnel: ExhibitPersonnelEntry[]
```

The component receives an array and renders a grid. Each story must pass an array, not a single entry.

### Three Required Story Variants

1. **NamedPerson** -- all fields populated including name, title, organization, role
2. **AnonymousPerson** -- no `name` field; title displayed in name position with anonymous styling
3. **SelfHighlighted** -- entry with `isSelf: true`; applies `personnel-card--self` CSS class

### Anti-Patterns to Avoid
- **Importing real exhibit data:** Stories should use inline mock data (consistent with all existing project stories)
- **Single-entry arrays only:** Include multiple entries in at least one story to show the grid layout
- **Missing the array wrapper:** Component expects `personnel: ExhibitPersonnelEntry[]`, not a single object

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Story format | Custom story wrapper | CSF3 with args | Project standard, works with addon-docs auto-generation |
| Mock data | Importing from exhibits.ts | Inline object literals | Stories should be self-contained; existing pattern in project |

## Common Pitfalls

### Pitfall 1: Wrong Type Import Path
**What goes wrong:** Importing Meta/StoryObj from `@storybook/vue3` instead of `@storybook/vue3-vite`
**Why it happens:** Many online examples use the older path
**How to avoid:** Copy the import line from any existing .stories.ts file in the project
**Warning signs:** TypeScript errors about incompatible types

### Pitfall 2: Passing Single Object Instead of Array
**What goes wrong:** `args: { personnel: { name: 'Dan' } }` instead of `args: { personnel: [{ name: 'Dan' }] }`
**Why it happens:** Forgetting the component takes an array prop
**How to avoid:** Always wrap in array brackets
**Warning signs:** Vue warning about expected Array, got Object

### Pitfall 3: Insufficient Variant Coverage
**What goes wrong:** Creating a "default" story but not explicitly covering the three required variants
**Why it happens:** Treating stories as a demo rather than documentation contract
**How to avoid:** One named export per success criterion: NamedPerson, AnonymousPerson, SelfHighlighted

## Code Examples

### Complete PersonnelCard Story File Pattern

```typescript
// Source: Synthesized from project conventions + PersonnelCard interface
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PersonnelCard from './PersonnelCard.vue'

const meta = {
  title: 'Components/PersonnelCard',
  component: PersonnelCard,
} satisfies Meta<typeof PersonnelCard>

export default meta
type Story = StoryObj<typeof meta>

export const NamedPerson: Story = {
  args: {
    personnel: [
      {
        name: 'Dan Novak',
        title: 'Lead Investigator',
        organization: 'GP Strategies',
        role: 'Solution architecture',
        isSelf: true,
      },
      {
        name: 'Jane Smith',
        title: 'Program Manager',
        organization: 'Client Corp',
        role: 'Project oversight',
      },
    ],
  },
}

export const AnonymousPerson: Story = {
  args: {
    personnel: [
      {
        title: 'Program Manager',
        organization: 'GP Strategies',
        role: 'Coordinated engagement',
      },
    ],
  },
}

export const SelfHighlighted: Story = {
  args: {
    personnel: [
      {
        name: 'Dan Novak',
        title: 'Technical Lead',
        organization: 'GP Strategies',
        isSelf: true,
      },
    ],
  },
}
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (unit) + Storybook 10 (visual) |
| Config file | vitest.config.ts, .storybook/main.ts |
| Quick run command | `npx vitest run --project unit src/components/PersonnelCard.test.ts` |
| Full suite command | `npx vitest run --project unit` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DOC-01 (named) | Story renders named person with all fields | manual (Storybook visual) | `npx storybook build` (build succeeds = stories compile) | -- Wave 0 |
| DOC-01 (anon) | Story renders anonymous person | manual (Storybook visual) | `npx storybook build` (build succeeds = stories compile) | -- Wave 0 |
| DOC-01 (self) | Story renders self-highlighted entry | manual (Storybook visual) | `npx storybook build` (build succeeds = stories compile) | -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx storybook build 2>&1 | tail -5` (verifies stories compile without error)
- **Per wave merge:** Full Storybook build + unit test suite
- **Phase gate:** `storybook build` succeeds and all three named exports exist in story file

### Wave 0 Gaps
None -- existing Storybook infrastructure covers all phase requirements. The only deliverable is the new story file itself.

## Sources

### Primary (HIGH confidence)
- Project source: `src/components/PersonnelCard.vue` -- component implementation
- Project source: `src/components/PersonnelCard.test.ts` -- existing test patterns with mock data
- Project source: `src/components/FindingCard.stories.ts` -- CSF3 story pattern reference
- Project source: `src/components/ExhibitCard.stories.ts` -- multi-variant story reference
- Project source: `src/data/exhibits.ts` -- ExhibitPersonnelEntry interface definition
- Project source: `.storybook/main.ts` -- Storybook configuration
- Project source: `.storybook/preview.ts` -- global CSS and router setup
- Project source: `package.json` -- Storybook ^10.2.19 version confirmed

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all packages already installed and configured
- Architecture: HIGH - 20+ existing stories establish clear pattern
- Pitfalls: HIGH - simple domain, pitfalls derived from component interface

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (stable domain, no external dependencies)
