---
phase: 37
slug: sfc-content-extraction
status: draft
nyquist_compliant: false
wave_0_complete: true
created: 2026-04-10
---

# Phase 37 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `037-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.x (unit + browser projects configured in `vitest.config.ts`) |
| **Config file** | `vitest.config.ts` (existing — no changes needed) |
| **Quick run command** | `npm run test:unit` (~1 second, 127 existing unit tests against happy-dom) |
| **Browser run command** | `npm run test:browser` (runs `.browser.test.ts` files via Playwright chromium) |
| **Full suite command** | `npm run test` (both projects, ~10–30 seconds) |
| **Phase gate command** | `npm run test && npm run build && npm run build-storybook` |
| **Estimated runtime** | ~1 s unit, ~30 s full, ~2 min phase gate |

---

## Sampling Rate

- **After every task commit:** `npm run test:unit` (~1 second, 127 tests)
- **After every plan wave:** `npm run test` (both unit + browser projects)
- **Before `/gsd:verify-work`:** `npm run test && npm run build && npm run build-storybook` must be green
- **Max feedback latency:** ~1 second (unit only); ~30 seconds (full)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 37-01-* | 01 (HomePage) | 1 | SFC-01 | refactor + happy-dom regression | `npm run test:unit` | ✅ existing | ⬜ pending |
| 37-01-* | 01 (HomePage) | 2 | SFC-01 | browser regression | `npx vitest run --project browser src/pages/HomePage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-02-* | 02 (PhilosophyPage + 3 sections) | 1 | SFC-02 | refactor + happy-dom regression | `npm run test:unit` | ✅ existing | ⬜ pending |
| 37-02-* | 02 (PhilosophyPage + 3 sections) | 2 | SFC-02 | browser regression | `npx vitest run --project browser src/pages/PhilosophyPage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-03-* | 03 (FaqPage) | 1 | SFC-03 | refactor + happy-dom regression (FaqAccordionItem + FaqFilterBar) | `npx vitest run --project unit src/components/FaqAccordionItem.test.ts src/components/FaqFilterBar.test.ts` | ✅ existing | ⬜ pending |
| 37-03-* | 03 (FaqPage) | 2 | SFC-03 | browser regression | `npx vitest run --project browser src/pages/FaqPage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-04-* | 04 (ContactPage + 5 sections) | 1 | SFC-04 | refactor + happy-dom regression | `npm run test:unit` | ✅ existing | ⬜ pending |
| 37-04-* | 04 (ContactPage + 5 sections) | 2 | SFC-04 | browser regression | `npx vitest run --project browser src/pages/ContactPage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-05-* | 05 (AccessibilityPage) | 1 | SFC-05 | refactor + happy-dom regression | `npm run test:unit` | ✅ existing | ⬜ pending |
| 37-05-* | 05 (AccessibilityPage) | 2 | SFC-05 | browser regression | `npx vitest run --project browser src/pages/AccessibilityPage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-06-* | 06 (TechnologiesPage) | 1 | SFC-06 | refactor + happy-dom regression | `npm run test:unit` | ✅ existing | ⬜ pending |
| 37-06-* | 06 (TechnologiesPage) | 2 | SFC-06 | browser regression | `npx vitest run --project browser src/pages/TechnologiesPage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-07-* | 07 (CaseFilesPage) | 1 | SFC-07 | refactor + happy-dom regression | `npx vitest run --project unit src/pages/CaseFilesPage.test.ts` | ✅ existing (6 tests) | ⬜ pending |
| 37-07-* | 07 (CaseFilesPage) | 2 | SFC-07 | browser regression | `npx vitest run --project browser src/pages/CaseFilesPage.browser.test.ts` | ❌ created Wave 2 | ⬜ pending |
| 37-08-* | 08 (LOAD-01 enforcement) | 3 | LOAD-01 | unit test greps `src/data/*.ts` | `npx vitest run --project unit src/data/__tests__/loaders.thin.test.ts` | ❌ created Wave 3 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

All infrastructure is already in place. No Wave 0 gaps.

- ✅ Vitest unit project — exists, passing 127 tests
- ✅ Vitest browser project — exists and configured in `vitest.config.ts`, zero tests today (filled in Wave 2)
- ✅ Playwright chromium — cached locally at `~/.cache/ms-playwright/chromium-*`
- ✅ Shared fixtures — existing `RouterLinkStub` pattern from `@vue/test-utils`
- ✅ No new dependencies required

**Wave 0 Pre-flight check (Wave 1 first task):**

- [ ] `ls .github/workflows/` — confirm whether CI currently runs `test:browser`; if yes, ensure `playwright install chromium` exists or is added (Assumption A7 from RESEARCH.md)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual parity of 7 pages in light + dark themes after refactor | SFC-01..07 | No snapshot tests in the project — visual regression is by-eye | `npm run dev` → open each refactored page, toggle theme, confirm no prose missing, no broken layout, no `<strong>`/`<em>` loss in key copy |
| Storybook stories for refactored pages still render | SFC-01..07 | Phase gate | `npm run build-storybook` → load each page story, confirm clean render |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (N/A — no gaps)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30 s
- [ ] `nyquist_compliant: true` set in frontmatter (flip after gsd-plan-checker passes)

**Approval:** pending
