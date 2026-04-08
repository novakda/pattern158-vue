---
phase: quick-260407-v5k
plan: 01
one_liner: "Replace dynamic personnel table header with static 'Organization' in both layout components"
subsystem: ui
tags: [vue, personnel, cleanup]
key-files:
  modified:
    - src/components/exhibit/InvestigationReportLayout.vue
    - src/components/exhibit/EngineeringBriefLayout.vue
key-decisions:
  - "Static 'Organization' header — dynamic td data-label kept since it correctly reflects row-level content"
---

# Quick Task 260407-v5k: Fix dynamic personnel table header

## What Changed
Replaced `{{ exhibit.personnel[0].organization !== undefined ? 'Organization' : 'Role' }}` with static `<th>Organization</th>` in both InvestigationReportLayout.vue and EngineeringBriefLayout.vue.

## Why
The dynamic header was a leftover from pre-v5.2 when exhibits had varying column schemas. After v5.2 data normalization, all exhibits use name/title/organization — the dynamic check was dead logic.

## Verification
- 95/95 tests passing
- Both layout components updated identically
