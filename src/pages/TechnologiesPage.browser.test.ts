import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import TechnologiesPage from './TechnologiesPage.vue'
import { hero } from '@/content/technologies'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('TechnologiesPage: hero title and subtitle visible', async () => {
  const screen = render(TechnologiesPage, renderOptions())
  await expect
    .element(screen.getByRole('heading', { name: hero.title, exact: true, level: 1 }))
    .toBeVisible()
  await expect.element(screen.getByText(hero.subtitle)).toBeVisible()
})

test('TechnologiesPage: intro paragraph visible', async () => {
  const screen = render(TechnologiesPage, renderOptions())
  await expect.element(screen.getByText(hero.introParagraph)).toBeVisible()
})
