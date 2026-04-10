import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { RouterLinkStub } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'

import CaseFilesPage from './CaseFilesPage.vue'
import {
  hero,
  stats,
  investigationReportsHeading,
  projectDirectoryHeading,
  projectDirectory,
} from '@/content/caseFiles'

const renderOptions = () => ({
  global: {
    plugins: [createHead()],
    stubs: { 'router-link': RouterLinkStub },
  },
})

test('CaseFilesPage: hero title, classification, and stats row visible', async () => {
  const screen = render(CaseFilesPage, renderOptions())
  await expect.element(screen.getByRole('heading', { name: hero.title })).toBeVisible()
  await expect.element(screen.getByText(hero.classification)).toBeVisible()
  await expect.element(screen.getByText(stats[0].number)).toBeVisible()
  await expect.element(screen.getByText(stats[0].label)).toBeVisible()
})

test('CaseFilesPage: Investigation Reports heading and Project Directory heading visible', async () => {
  const screen = render(CaseFilesPage, renderOptions())
  await expect
    .element(screen.getByRole('heading', { name: investigationReportsHeading.title }))
    .toBeVisible()
  await expect
    .element(screen.getByRole('heading', { name: projectDirectoryHeading.title }))
    .toBeVisible()
})

test('CaseFilesPage: first industry group and its first client entry visible', async () => {
  const screen = render(CaseFilesPage, renderOptions())
  const firstGroup = projectDirectory[0]
  const firstEntry = firstGroup.entries[0]
  await expect
    .element(screen.getByRole('heading', { name: firstGroup.industry }))
    .toBeVisible()
  await expect.element(screen.getByText(firstEntry.client)).toBeVisible()
  await expect.element(screen.getByText(firstEntry.project)).toBeVisible()
})
