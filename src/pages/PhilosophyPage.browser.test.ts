import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import PhilosophyPage from './PhilosophyPage.vue'
import { pattern158Origin } from '@/content/sections/pattern158Origin'
import { methodologySteps } from '@/content/sections/howIWork'
import { aiClarity } from '@/content/sections/aiClarity'
import { designThinking, moralSpine, closingLine } from '@/content/philosophy'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('PhilosophyPage: Pattern 158 origin heading and first paragraph visible', async () => {
  const screen = render(PhilosophyPage, renderOptions())
  await expect
    .element(screen.getByRole('heading', { name: pattern158Origin.heading }))
    .toBeVisible()
  await expect.element(screen.getByText(pattern158Origin.paragraphs[0])).toBeVisible()
})

test('PhilosophyPage: design thinking heading, moral spine quote, and methodology step 1 visible', async () => {
  const screen = render(PhilosophyPage, renderOptions())
  await expect
    .element(screen.getByRole('heading', { name: designThinking.heading }))
    .toBeVisible()
  await expect.element(screen.getByText(moralSpine.quote.text)).toBeVisible()
  await expect.element(screen.getByText(moralSpine.quote.cite)).toBeVisible()
  await expect
    .element(screen.getByRole('heading', { name: methodologySteps[0].heading }))
    .toBeVisible()
})

test('PhilosophyPage: AI clarity heading and closing line visible', async () => {
  const screen = render(PhilosophyPage, renderOptions())
  await expect.element(screen.getByRole('heading', { name: aiClarity.heading })).toBeVisible()
  await expect.element(screen.getByText(closingLine)).toBeVisible()
})
