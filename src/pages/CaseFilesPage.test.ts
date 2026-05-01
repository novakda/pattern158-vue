import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock vue-router before importing the component
vi.mock('vue-router', () => ({
  RouterLink: { template: '<a><slot /></a>' },
}))

// Mock @unhead/vue useHead to be a no-op in tests
vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
}))

import CaseFilesPage from './CaseFilesPage.vue'

describe('CaseFilesPage', () => {
  it('renders all 15 exhibits', () => {
    const wrapper = mount(CaseFilesPage, {
      global: { stubs: { TechTags: true } },
    })
    const cards = wrapper.findAll('.exhibit-card')
    expect(cards.length).toBe(15)
  })

  it('groups exhibits into Investigation Reports and Engineering Briefs sections', () => {
    const wrapper = mount(CaseFilesPage, {
      global: { stubs: { TechTags: true } },
    })
    const irHeading = wrapper.find('#ir-heading')
    expect(irHeading.exists()).toBe(true)
    expect(irHeading.text()).toContain('Investigation Reports')

    const ebHeading = wrapper.find('#eb-heading')
    expect(ebHeading.exists()).toBe(true)
    expect(ebHeading.text()).toContain('Engineering Briefs')
  })

  it('renders stats bar with portfolio statistics', () => {
    const wrapper = mount(CaseFilesPage, {
      global: { stubs: { TechTags: true } },
    })
    const text = wrapper.text()
    expect(text).toContain('38')
    expect(text).toContain('Projects Documented')
    expect(text).toContain('6,000+')
    expect(text).toContain('Emails Archived')
    expect(text).toContain('15+')
    expect(text).toContain('Industries')
  })

  it('renders project directory tables', () => {
    const wrapper = mount(CaseFilesPage, {
      global: { stubs: { TechTags: true } },
    })
    const directory = wrapper.find('.portfolio-directory')
    expect(directory.exists()).toBe(true)
    const tables = wrapper.findAll('.directory-table')
    expect(tables.length).toBe(7)
  })

  it('does not contain Three Lenses content', () => {
    const wrapper = mount(CaseFilesPage, {
      global: { stubs: { TechTags: true } },
    })
    expect(wrapper.text()).not.toContain('Three Lenses')
    expect(wrapper.findAll('.narrative-card').length).toBe(0)
  })

  it('displays Case Files hero title', () => {
    const wrapper = mount(CaseFilesPage, {
      global: { stubs: { TechTags: true } },
    })
    const text = wrapper.text()
    expect(text).toContain('Case Files')
    expect(text).toContain('Documented evidence')
  })
})
