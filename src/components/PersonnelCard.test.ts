import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonnelCard from './PersonnelCard.vue'
import { exhibits } from '@/data/exhibits'
import type { ExhibitPersonnelEntry } from '@/data/exhibits'

// Real data fixture
const exhibitA = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')!

describe('PersonnelCard', () => {
  // Helper to mount with personnel array
  const mountCard = (personnel: ExhibitPersonnelEntry[]) =>
    mount(PersonnelCard, { props: { personnel } })

  describe('RNDR-01: Named person display', () => {
    it('renders name, title, organization, and role for a named person', () => {
      const wrapper = mountCard([
        { name: 'Dan Novak', title: 'Lead Investigator', organization: 'GP Strategies', role: 'Solution architecture', isSelf: true },
      ])
      expect(wrapper.text()).toContain('Dan Novak')
      expect(wrapper.text()).toContain('Lead Investigator')
      expect(wrapper.text()).toContain('GP Strategies')
      expect(wrapper.text()).toContain('Solution architecture')
    })

    it('renders partial fields without showing undefined', () => {
      const wrapper = mountCard([
        { name: 'Jane Doe', title: 'Engineer' },
      ])
      expect(wrapper.text()).toContain('Jane Doe')
      expect(wrapper.text()).toContain('Engineer')
      expect(wrapper.text()).not.toContain('undefined')
    })
  })

  describe('RNDR-02: Anonymous person display', () => {
    it('shows title in name position with anonymous class when name is absent', () => {
      const wrapper = mountCard([
        { title: 'Program Manager', organization: 'GP Strategies', role: 'Coordinated engagement' },
      ])
      expect(wrapper.text()).toContain('Program Manager')
      expect(wrapper.text()).toContain('GP Strategies')
      expect(wrapper.find('.personnel-name--anonymous').exists()).toBe(true)
      expect(wrapper.text()).not.toContain('Unknown')
    })

    it('does not duplicate title text', () => {
      const wrapper = mountCard([
        { title: 'Program Manager', organization: 'GP Strategies', role: 'Coordinated engagement' },
      ])
      const text = wrapper.text()
      const count = (text.match(/Program Manager/g) || []).length
      expect(count).toBe(1)
    })
  })

  describe('RNDR-03: Self highlight', () => {
    it('applies personnel-card--self class when isSelf is true', () => {
      const wrapper = mountCard([
        { name: 'Dan Novak', isSelf: true },
      ])
      expect(wrapper.find('.personnel-card--self').exists()).toBe(true)
    })

    it('does not apply self class for non-self entries', () => {
      const wrapper = mountCard([
        { name: 'Other Person' },
      ])
      expect(wrapper.find('.personnel-card--self').exists()).toBe(false)
    })
  })

  describe('Grid rendering', () => {
    it('renders personnel-grid container', () => {
      const wrapper = mountCard([{ name: 'Test' }])
      expect(wrapper.find('.personnel-grid').exists()).toBe(true)
    })

    it('renders correct number of cards for Exhibit A data', () => {
      const wrapper = mountCard(exhibitA.personnel!)
      expect(wrapper.findAll('.personnel-card').length).toBe(exhibitA.personnel!.length)
    })
  })
})
