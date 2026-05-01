import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import ContactPage from './ContactPage.vue'
import { hero, colleagueQuotes } from '@/content/contact'
import { roleFit } from '@/content/sections/roleFit'
import { companyFit } from '@/content/sections/companyFit'
import { compensation } from '@/content/sections/compensation'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('ContactPage: hero title and role-fit heading visible', async () => {
  const screen = render(ContactPage, renderOptions())
  await expect.element(screen.getByRole('heading', { name: hero.title })).toBeVisible()
  await expect.element(screen.getByRole('heading', { name: roleFit.heading })).toBeVisible()
})

test('ContactPage: role-fit first looking-for item and company-fit first thesis visible', async () => {
  const screen = render(ContactPage, renderOptions())
  await expect.element(screen.getByText(roleFit.lookingFor[0].name)).toBeVisible()
  await expect.element(screen.getByText(companyFit.criteria[0].thesis)).toBeVisible()
})

test('ContactPage: compensation table first row and first colleague quote visible', async () => {
  const screen = render(ContactPage, renderOptions())
  await expect.element(screen.getByText(compensation.rows[0].term)).toBeVisible()
  await expect.element(screen.getByText(compensation.rows[0].value)).toBeVisible()
  await expect.element(screen.getByText(colleagueQuotes[0].quote)).toBeVisible()
})
