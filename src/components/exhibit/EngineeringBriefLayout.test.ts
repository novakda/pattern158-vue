import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EngineeringBriefLayout from './EngineeringBriefLayout.vue'
import { exhibits } from '@/data/exhibits'
import type { Exhibit } from '@/data/exhibits'

const ebFixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')!
const flowFixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')!
const personnelFixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-b')!

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

  it('renders timeline entries with dates and descriptions', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-timeline').exists()).toBe(true)
    expect(wrapper.findAll('.timeline-entry').length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain('September 5, 2017')
    expect(wrapper.text()).toContain('SVP Directs Engagement')
  })

  it('renders timeline entry quotes', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.timeline-quote').exists()).toBe(true)
  })

  it('renders metadata section with key-value cards', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-metadata').exists()).toBe(true)
    expect(wrapper.findAll('.metadata-card').length).toBeGreaterThanOrEqual(1)
  })

  it('renders flow section with steps', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: flowFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.flow-step').exists()).toBe(true)
    expect(wrapper.findAll('.flow-node').length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain('PowerPoint')
    expect(wrapper.text()).toContain('Azure DevOps')
  })

  it('renders flow section introductory body text', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: flowFixture },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain('Requirements degraded through multiple format conversions')
  })

  it('does not render section with empty entries/items/steps', () => {
    const emptyExhibit: Exhibit = {
      label: 'Test', client: 'Test', date: '2025', title: 'Test',
      exhibitType: 'engineering-brief',
      impactTags: ['test'], exhibitLink: '/exhibits/test',
      sections: [{ heading: 'Ghost Section', type: 'timeline', entries: [] }],
    }
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: emptyExhibit },
      ...mountOptions,
    })
    expect(wrapper.text()).not.toContain('Ghost Section')
    expect(wrapper.findAll('.exhibit-section').length).toBe(0)
  })

  it('renders personnel table with heading for exhibits with personnel data', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: personnelFixture },
      ...mountOptions,
    })
    const personnelHeading = wrapper.findAll('h2').find(h => h.text() === 'Personnel')
    expect(personnelHeading).toBeTruthy()
    expect(wrapper.text()).toContain('Dan Novak')
  })

  it('renders findings table with heading for exhibits with findings data', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    const findingsHeading = wrapper.findAll('h2').find(h => h.text() === 'Findings')
    expect(findingsHeading).toBeTruthy()
  })

  it('renders technologies table with heading for exhibits with technologies data', () => {
    const wrapper = mount(EngineeringBriefLayout, {
      props: { exhibit: ebFixture },
      ...mountOptions,
    })
    const techHeading = wrapper.findAll('h2').find(h => h.text() === 'Technologies')
    expect(techHeading).toBeTruthy()
    expect(wrapper.text()).toContain('eLearning Protocols')
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
