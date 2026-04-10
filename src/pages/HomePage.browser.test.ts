import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import HomePage from './HomePage.vue'
import {
  intro,
  teaserQuotes,
  featuredProjectsHeading,
  fieldReportsHeading,
} from '@/content/home'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('HomePage: intro heading and body from content module are visible', async () => {
  const screen = render(HomePage, renderOptions())
  await expect.element(screen.getByRole('heading', { name: intro.heading })).toBeVisible()
  await expect.element(screen.getByText(intro.body)).toBeVisible()
})

test('HomePage: section headings from content module render as h2', async () => {
  const screen = render(HomePage, renderOptions())
  await expect
    .element(screen.getByRole('heading', { name: featuredProjectsHeading.title }))
    .toBeVisible()
  await expect
    .element(screen.getByRole('heading', { name: fieldReportsHeading.title }))
    .toBeVisible()
})

test('HomePage: both teaser quotes from content module render inside testimonial components', async () => {
  const screen = render(HomePage, renderOptions())
  for (const q of teaserQuotes) {
    await expect.element(screen.getByText(q.quote)).toBeVisible()
  }
})
