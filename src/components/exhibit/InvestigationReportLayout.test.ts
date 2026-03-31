import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InvestigationReportLayout from './InvestigationReportLayout.vue'
import { exhibits } from '@/data/exhibits'
import type { Exhibit } from '@/data/exhibits'

const irFixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-j')!

describe('InvestigationReportLayout', () => {
  const mountOptions = {
    global: { stubs: { RouterLink: true, TechTags: true } },
  }

  it('renders exhibit title', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain(irFixture.title)
  })

  it('renders Investigation Report badge with badge-aware class', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-type-badge.badge-aware').exists()).toBe(true)
    expect(wrapper.text()).toContain('Investigation Report')
  })

  it('renders sections when exhibit has sections', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.findAll('.exhibit-section').length).toBeGreaterThan(0)
  })

  it('renders timeline section heading for IR exhibit', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    // Exhibit J has a timeline section with heading "Sequence of Events"
    expect(wrapper.text()).toContain('Sequence of Events')
  })

  it('renders impact tags section', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain('Skills & Technologies')
  })

  it('renders context fallback when no sections', () => {
    const minimalExhibit: Exhibit = {
      label: 'Test',
      client: 'Test Client',
      date: '2025',
      title: 'Test Title',
      exhibitType: 'investigation-report',
      contextHeading: 'Test Heading',
      contextText: 'Test context text for fallback',
      impactTags: ['tag1'],
      exhibitLink: '/exhibits/test',
    }
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: minimalExhibit },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain('Test context text for fallback')
    expect(wrapper.text()).toContain('Test Heading')
  })
})
