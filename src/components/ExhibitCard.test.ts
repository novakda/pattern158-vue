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
  exhibitType: 'engineering-brief' as const,
  impactTags: [],
  exhibitLink: '/exhibits/exhibit-j',
}

describe('ExhibitCard CTA text (STRUCT-02)', () => {
  it('renders emphatic CTA for investigation-report type', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { ...baseExhibit, exhibitType: 'investigation-report' as const },
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' }, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Full Investigation Report')
  })

  it('renders engineering brief CTA for engineering-brief type', () => {
    const wrapper = mount(ExhibitCard, {
      props: {
        exhibit: { ...baseExhibit, exhibitType: 'engineering-brief' as const },
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' }, TechTags: true } },
    })
    expect(wrapper.text()).toContain('View Engineering Brief')
    expect(wrapper.text()).not.toContain('View Full Investigation Report')
  })
})
