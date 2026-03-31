import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EngineeringBriefLayout from './EngineeringBriefLayout.vue'
import { exhibits } from '@/data/exhibits'

const ebFixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')!

describe('EngineeringBriefLayout', () => {
  const mountOptions = {
    global: { stubs: { RouterLink: true, TechTags: true } },
  }

  it('renders exhibit title', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain(ebFixture.title)
  })

  it('renders Engineering Brief badge with badge-deep class', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-type-badge.badge-deep').exists()).toBe(true)
    expect(wrapper.text()).toContain('Engineering Brief')
  })

  it('renders sections when exhibit has sections', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.findAll('.exhibit-section').length).toBeGreaterThan(0)
  })

  it('renders quotes when exhibit has quotes', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-quote').exists()).toBe(true)
  })

  it('renders impact tags section', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain('Skills & Technologies')
  })

  it('uses non-forensic framing without Investigation Summary heading', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    // EB exhibits use "Engineering Brief" badge, not forensic "Investigation Summary" heading
    expect(wrapper.text()).toContain('Engineering Brief')
    expect(wrapper.text()).not.toContain('Investigation Summary')
  })
})
