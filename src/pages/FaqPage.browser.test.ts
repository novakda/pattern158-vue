import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import FaqPage from './FaqPage.vue'
import { hero, colleagueQuotesHeading, colleagueQuotes } from '@/content/faqPage'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('FaqPage: hero title and subtitle visible', async () => {
  const screen = render(FaqPage, renderOptions())
  await expect.element(screen.getByRole('heading', { name: hero.title })).toBeVisible()
  await expect.element(screen.getByText(hero.subtitle)).toBeVisible()
})

test('FaqPage: colleague quotes heading and both quotes visible', async () => {
  const screen = render(FaqPage, renderOptions())
  await expect
    .element(screen.getByRole('heading', { name: colleagueQuotesHeading }))
    .toBeVisible()
  for (const q of colleagueQuotes) {
    await expect.element(screen.getByText(q.quote)).toBeVisible()
  }
})
