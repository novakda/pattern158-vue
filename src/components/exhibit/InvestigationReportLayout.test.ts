import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InvestigationReportLayout from './InvestigationReportLayout.vue'
import { exhibits } from '@/data/exhibits'
import type { Exhibit } from '@/data/exhibits'

const irFixture = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-j')!

describe('InvestigationReportLayout', () => {
  const mountOptions = {
    global: { stubs: { RouterLink: true, TechTags: true, PersonnelCard: true, FindingsTable: true } },
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

  it('renders timeline entries with dates and descriptions', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-timeline').exists()).toBe(true)
    expect(wrapper.findAll('.timeline-entry').length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain('Initial Report')
    expect(wrapper.text()).toContain('Anomalous Completion Rates Flagged')
  })

  it('renders metadata section with key-value cards', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.find('.exhibit-metadata').exists()).toBe(true)
    expect(wrapper.findAll('.metadata-card').length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain('Industry')
    expect(wrapper.text()).toContain('Automotive / Dealership Training')
  })

  it('does not render section with empty timeline entries', () => {
    const emptyExhibit: Exhibit = {
      label: 'Test', client: 'Test', date: '2025', title: 'Test',
      exhibitType: 'investigation-report',
      impactTags: ['test'], exhibitLink: '/exhibits/test',
      sections: [{ heading: 'Empty Timeline', type: 'timeline', entries: [] }],
    }
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: emptyExhibit },
      ...mountOptions,
    })
    expect(wrapper.text()).not.toContain('Empty Timeline')
    expect(wrapper.find('.exhibit-timeline').exists()).toBe(false)
    expect(wrapper.findAll('.exhibit-section').length).toBe(0)
  })

  it('does not render section with empty metadata items', () => {
    const emptyExhibit: Exhibit = {
      label: 'Test', client: 'Test', date: '2025', title: 'Test',
      exhibitType: 'investigation-report',
      impactTags: ['test'], exhibitLink: '/exhibits/test',
      sections: [{ heading: 'Empty Meta', type: 'metadata', items: [] }],
    }
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: emptyExhibit },
      ...mountOptions,
    })
    expect(wrapper.text()).not.toContain('Empty Meta')
    expect(wrapper.findAll('.exhibit-section').length).toBe(0)
  })

  it('renders Project Team section when exhibit has personnel', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.text()).toContain('Project Team')
  })

  it('does not render Project Team section when exhibit has no personnel', () => {
    const noPersonnelExhibit: Exhibit = {
      label: 'Test', client: 'Test', date: '2025', title: 'Test',
      exhibitType: 'investigation-report',
      impactTags: ['test'], exhibitLink: '/exhibits/test',
    }
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: noPersonnelExhibit },
      ...mountOptions,
    })
    expect(wrapper.text()).not.toContain('Project Team')
  })

  it('renders findings section when exhibit has findings', () => {
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: irFixture },
      ...mountOptions,
    })
    expect(wrapper.find('findings-table-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain(irFixture.findingsHeading!)
  })

  it('does not render findings section when exhibit has no findings', () => {
    const noFindingsExhibit: Exhibit = {
      label: 'Test', client: 'Test', date: '2025', title: 'Test',
      exhibitType: 'investigation-report',
      impactTags: ['test'], exhibitLink: '/exhibits/test',
    }
    const wrapper = mount(InvestigationReportLayout, {
      props: { exhibit: noFindingsExhibit },
      ...mountOptions,
    })
    expect(wrapper.find('findings-table-stub').exists()).toBe(false)
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
