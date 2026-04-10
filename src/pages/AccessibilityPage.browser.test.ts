import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import AccessibilityPage from './AccessibilityPage.vue'
import { hero, commitment, testing, feedback, technicalSpecs } from '@/content/accessibility'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('AccessibilityPage: hero title and commitment heading visible', async () => {
  const screen = render(AccessibilityPage, renderOptions())
  await expect.element(screen.getByRole('heading', { name: hero.title })).toBeVisible()
  await expect.element(screen.getByText(hero.lead)).toBeVisible()
  await expect.element(screen.getByRole('heading', { name: commitment.heading })).toBeVisible()
})

test('AccessibilityPage: testing definition list first term and description visible', async () => {
  const screen = render(AccessibilityPage, renderOptions())
  await expect.element(screen.getByText(testing.methods[0].term)).toBeVisible()
  await expect.element(screen.getByText(testing.methods[0].description)).toBeVisible()
})

test('AccessibilityPage: feedback email and technical specs intro visible', async () => {
  const screen = render(AccessibilityPage, renderOptions())
  await expect.element(screen.getByText(feedback.emailDisplay)).toBeVisible()
  await expect.element(screen.getByText(technicalSpecs.intro)).toBeVisible()
})
