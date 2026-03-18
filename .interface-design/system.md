# Pattern 158 Design System

Extracted from `src/assets/css/main.css` (4,493 lines), cascade-layered.

---

## Direction

NTSB-inspired portfolio. Navy/cream color story. Bebas Neue headings for authority. Technical precision aesthetic. Investigative-report structure throughout. Dark mode is first-class via `[data-theme="dark"]`.

---

## Color Tokens

### Light Mode (`:root`)

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary` | `#0e7c8c` | Links, accents, CTA, left-border accents |
| `--color-primary-hover` | `#0a6a78` | Button/link hover |
| `--color-primary-on-dark` | `#20b8cc` | Primary on dark/inverse backgrounds |
| `--color-primary-on-alt` | `#0c6f7e` | Primary on `--color-background-alt` |
| `--color-primary-subtle` | `rgba(14,124,140,0.15)` | Subtle bg tints |
| `--color-accent` | `#8f6d00` | Gold accent (blockquotes, email badges) |
| `--color-background` | `#faf9f6` | Page background (cream) |
| `--color-background-alt` | `#e8e8e8` | Alternating section backgrounds |
| `--color-surface` | `#ffffff` | Cards, panels |
| `--color-text` | `#2d3436` | Body text |
| `--color-text-muted` | `#666666` | Secondary/supporting text |
| `--color-text-light` | `#737373` | Tertiary text |
| `--color-text-medium` | `#555555` | Mid-hierarchy text |
| `--color-text-source` | `#707070` | Source/citation text |
| `--color-text-timeline` | `#444444` | Timeline dates |
| `--color-inverse` | `#1a2838` | Navy — nav, hero, dark sections |
| `--color-inverse-text` | `#faf9f6` | Text on inverse backgrounds |
| `--color-inverse-text-muted` | `rgba(250,249,246,0.8)` | Muted on inverse |
| `--color-inverse-text-light` | `rgba(250,249,246,0.7)` | Light on inverse |
| `--color-heading` | `#1a2838` | h1/h2/h3 color |
| `--color-border` | `#dddddd` | General borders |
| `--color-border-primary` | `rgba(14,124,140,0.3)` | Primary-tinted borders |
| `--color-hover-background` | `#f0f0f0` | Row/item hover |
| `--color-danger` | `#c82333` | Error states |

### Dark Mode (`[data-theme="dark"]`)

Three-tier elevation: `--color-background` (#1a2838) → `--color-background-alt` (#243447) → `--color-surface` (#2a3f54).

Primary lightened to `#30c9dc` for WCAG AA on dark surfaces. Accent to `#d9b232`. Additional tokens: `--color-on-primary` (#0a1e2e), `--color-on-accent` (#1a1400) for text on bright bg.

---

## Typography

### Font Families

| Token | Value |
|-------|-------|
| `--font-heading` | `'Bebas Neue', 'Arial Black', sans-serif` |
| `--font-body` | `'Inter', system-ui, sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'Courier New', monospace` |

### Font Size Scale

| Token | Value | Use |
|-------|-------|-----|
| `--font-size-xs` | `0.75rem` | Labels, tags |
| `--font-size-sm` | `0.875rem` | Nav, captions, meta |
| `--font-size-base` | `1rem` | Body copy |
| `--font-size-md` | `1.125rem` | Lead text |
| `--font-size-lg` | `1.25rem` | Subtitles, subheadings |
| `--font-size-xl` | `1.5rem` | Section subheadings |
| `--font-size-2xl` | `1.875rem` | Card titles |
| `--font-size-3xl` | `2.25rem` | Section h2 |
| `--font-size-4xl` | `3.5rem` | Page h1 |
| `--font-size-5xl` | `5rem` | Hero h1 |

**Mobile overrides** (`max-width: 768px`) via `!important` on `html`:
- 5xl→3rem, 4xl→2.25rem, 3xl→1.75rem, 2xl→1.5rem, xl→1.25rem, lg→1.125rem

### Line Height Scale

| Token | Value |
|-------|-------|
| `--line-height-xs` | `1.4` |
| `--line-height-sm/base/md/lg` | `1.5–1.6` |
| `--line-height-xl` | `1.5` |
| `--line-height-2xl` | `1.4` |
| `--line-height-3xl` | `1.3` |
| `--line-height-4xl` | `1.2` |
| `--line-height-5xl` | `1.1` |

---

## Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | `0.25rem` (4px) |
| `--space-sm` | `0.5rem` (8px) |
| `--space-ms` | `0.75rem` (12px) — mobile horizontal padding |
| `--space-md` | `1rem` (16px) |
| `--space-lg` | `1.5rem` (24px) |
| `--space-xl` | `2rem` (32px) |
| `--space-2xl` | `3rem` (48px) |
| `--space-3xl` | `4rem` (64px) |
| `--space-4xl` | `5rem` (80px) — standard section padding |
| `--space-5xl` | `6rem` (96px) |

**Section padding default:** `var(--space-4xl) var(--space-xl)` desktop → `var(--space-2xl) var(--space-ms)` mobile

---

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | `3px` | Code, labels |
| `--radius-md` | `4px` | Buttons, cards, inputs |
| `--radius-pill` | `20px` | Tags, pills |

**Only 3 defined values.** Any value outside these is a violation.

---

## Shadows

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.08)` | Cards |
| `--shadow-md` | `0 2px 10px rgba(0,0,0,0.1)` | Nav |
| `--shadow-focus` | `0 0 0 4px rgba(14,124,140,0.2)` | Focus ring (light) |
| `--shadow-focus-inverse` | `0 0 0 4px rgba(250,249,246,0.3)` | Focus ring (dark) |
| `--shadow-hover` | `0 4px 8px rgba(0,0,0,0.2)` | Button/card hover lift |

---

## Component Patterns

### Button

```css
/* Base */
.btn { padding: var(--space-md) var(--space-xl); border-radius: var(--radius-md); font-weight: 500; transition: all 0.3s; }

/* Primary */
.btn-primary { background: var(--color-primary); color: var(--color-surface); }
.btn-primary:hover { background: var(--color-primary-hover); transform: translateY(-2px); box-shadow: var(--shadow-hover); }

/* Secondary — CONTEXT-SCOPED: inverse/dark backgrounds ONLY */
.btn-secondary { background: transparent; color: var(--color-inverse-text); border: 2px solid var(--color-inverse-text); }

/* Social */
.btn-social { background: var(--color-primary); min-height: 44px; min-width: 200px; }
```

**Note:** `.btn` has no `min-height`. Only `.btn-social` and `.copy-btn` enforce 44px touch target.

### Card

Three card archetypes with shared base:
```css
.finding-card, .exhibit-card, .specialty-card {
  background: var(--color-surface);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s;
}
```

Finding card and flagship card: `border-left: 6px solid var(--color-primary); hover: translateX(4px)`
Narrative card: `border-left: 4px solid var(--color-primary)` (no hover)
Specialty card: `border-left: 4px solid var(--color-primary)` (light mode uses `--color-background` bg)

### Hero Minimal

```css
.hero-minimal { background: var(--color-inverse); color: var(--color-inverse-text); padding: var(--space-4xl) var(--space-xl); text-align: center; }
```

Used by: Philosophy, FAQ, Contact, Portfolio, Technologies, Review, Accessibility.

### Stats Bar

Grid: `repeat(auto-fit, minmax(180px, 1fr))`. Item has 4px top border in primary, surface background, centered text. Stat number uses `--font-heading --font-size-3xl --color-primary`.

### Left-Border Accent Pattern

Consistent pattern across the site: `border-left: 3px|4px|6px solid var(--color-primary)`. Width signals hierarchy:
- 3px: quotes, dd elements, answer panels
- 4px: narrative cards, methodology notes, guidance list items
- 6px: finding cards, flagship cards (primary content)

---

## Layout

- **Max container width:** `1200px`
- **Container padding:** `0 var(--space-xl)` desktop → `0 var(--space-ms)` mobile
- **Single breakpoint:** `max-width: 768px`
- **CSS layers:** `reset → base → components → pages → utilities`

---

## Token Naming Convention

**Correct prefixes:**
- Colors: `--color-*`
- Spacing: `--space-*`
- Font size: `--font-size-*`
- Line height: `--line-height-*`
- Font family: `--font-*`
- Border radius: `--radius-*`
- Shadow: `--shadow-*`

**Do NOT use** shorthand aliases: `--space-l`, `--space-m`, `--space-s`, `--text-*`, `--color-inverse-bg`, `--color-surface-raised` — these tokens do not exist.
