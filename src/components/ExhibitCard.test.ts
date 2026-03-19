import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock vue-router before importing the component
vi.mock('vue-router', () => ({
  RouterLink: { template: '<a><slot /></a>' },
}))

import ExhibitCard from './ExhibitCard.vue'

const baseExhibit = {
  label: 'Exhibit J',
  client: 'General Motors',
  date: '2019',
  title: 'Test Exhibit',
  impactTags: [],
  exhibitLink: '/exhibits/exhibit-j',
}

describe('ExhibitCard CTA text (STRUCT-02)', () => {
  it('renders emphatic CTA when investigationReport is true', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { ...baseExhibit, investigationReport: true },
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' }, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Full Investigation Report')
  })

  it('renders neutral CTA when investigationReport is false', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { ...baseExhibit, investigationReport: false },
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' }, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Investigation Report')
    expect(wrapper.text()).not.toContain('View Full Investigation Report')
  })

  it('renders neutral CTA when investigationReport is absent (undefined)', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { ...baseExhibit },
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' }, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Investigation Report')
    expect(wrapper.text()).not.toContain('View Full Investigation Report')
  })
})
