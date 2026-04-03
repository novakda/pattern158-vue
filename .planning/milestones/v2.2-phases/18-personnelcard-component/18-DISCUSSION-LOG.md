# Phase 18: PersonnelCard Component - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 18-personnelcard-component
**Areas discussed:** Visual presentation, Self-entry highlight, Anonymous display

---

## Visual Presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Compact inline rows | Name, title, org on a single line — dense, table-like feel | |
| Mini cards | Each person gets a small card block with stacked name/title/org | ✓ |
| Chip/pill tags | Personnel as horizontal chips like impact tags | |

**User's choice:** Mini cards
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Responsive grid | CSS grid that flows 1-3 columns based on viewport | ✓ |
| Fixed 2-column | Always 2 columns on desktop, 1 on mobile | |
| You decide | Claude picks | |

**User's choice:** Responsive grid (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Title then Org | Name > Title > Organization > Role | |
| Org then Title | Name > Organization > Title > Role | |
| You decide | Claude picks based on actual data | ✓ |

**User's choice:** You decide
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Show all | Render every personnel entry, grid keeps it compact | |
| Collapsible with threshold | Show first N entries with toggle | |
| You decide | Claude picks based on data volumes | ✓ |

**User's choice:** You decide
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Design system tokens | Use existing CSS custom properties from main.css | ✓ |
| Fully scoped | Self-contained scoped styles in .vue SFC | |
| You decide | Claude picks | |

**User's choice:** Design system tokens (Recommended)
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| No heading in component | PersonnelCard just renders persons, layout handles context | |
| Built-in heading | Component includes heading like "Project Team" | |
| You decide | Claude picks based on existing section heading patterns | ✓ |

**User's choice:** You decide
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle card | Light border or background tint defining card boundary | |
| Borderless/flat | No visible card boundary, just text blocks with spacing | |
| You decide | Claude picks based on design system | ✓ |

**User's choice:** You decide
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| Italic/muted role | Title normal, role italic or lighter | |
| Same treatment | Role and title look the same | |
| You decide | Claude picks | |

**User's choice:** Other (free text)
**Notes:** "Role is more important than title. Title is used in lieu of name for anonymized people." — This reframed the information hierarchy: role > title priority, and title doubles as name substitute for anonymous entries.

---

## Self-entry Highlight

| Option | Description | Selected |
|--------|-------------|----------|
| Accent border | Left or full border in accent color | |
| Background tint | Slightly different background color | |
| Badge/label | Small "You" or star badge on card | |
| You decide | Claude picks best fit for design system | ✓ |

**User's choice:** You decide
**Notes:** None

---

| Option | Description | Selected |
|--------|-------------|----------|
| First position | Dan Novak's card always appears first | |
| Original order | Keep natural data order | |
| You decide | Claude picks | ✓ |

**User's choice:** You decide
**Notes:** None

---

## Anonymous Display

| Option | Description | Selected |
|--------|-------------|----------|
| Same card, title as name | Title in name position, no visual difference | |
| Muted/italic name area | Title in name position with italic/lighter styling | ✓ |
| You decide | Claude picks | |

**User's choice:** Muted/italic name area
**Notes:** Signals it's a role description, not a person's name

---

| Option | Description | Selected |
|--------|-------------|----------|
| Render whatever exists | Show whatever fields are present, no minimum | ✓ |
| Require title minimum | Skip entries with no title and no name | |
| You decide | Claude picks | |

**User's choice:** Render whatever exists (Recommended)
**Notes:** None

---

## Claude's Discretion

- Information order within cards (respecting role > title priority)
- Card chrome (borders, background, flat)
- Section heading (component vs layout responsibility)
- Large list handling (show all vs collapsible)
- Self-entry visual treatment (accent, tint, badge)
- Self-entry positioning (first vs original order)

## Deferred Ideas

None — discussion stayed within phase scope
