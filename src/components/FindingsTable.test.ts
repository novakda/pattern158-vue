import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FindingsTable from './FindingsTable.vue'
import { exhibits } from '@/data/exhibits'
import type { ExhibitFindingEntry } from '@/data/exhibits'

// Real data fixtures
const exhibitA = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-a')!
const exhibitL = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-l')!
const exhibitE = exhibits.find(e => e.exhibitLink === '/exhibits/exhibit-e')!

describe('FindingsTable', () => {
  const mountTable = (findings: ExhibitFindingEntry[], heading?: string) =>
    mount(FindingsTable, { props: { findings, ...(heading !== undefined && { heading }) } })

  describe('RNDR-01: Desktop table rendering', () => {
    it('renders a semantic table element with findings-table-desktop class', () => {
      const wrapper = mountTable([{ finding: 'Test', description: 'Desc' }])
      expect(wrapper.find('table.findings-table-desktop').exists()).toBe(true)
      expect(wrapper.find('thead').exists()).toBe(true)
      expect(wrapper.find('tbody').exists()).toBe(true)
    })

    it('renders th headers for 2-col default pattern', () => {
      const wrapper = mountTable([{ finding: 'F1', description: 'D1' }])
      const headers = wrapper.findAll('th').map(th => th.text())
      expect(headers).toContain('Finding')
      expect(headers).toContain('Description')
    })

    it('renders td cells with finding data', () => {
      const wrapper = mountTable([{ finding: 'Test finding', description: 'Test desc' }])
      const cells = wrapper.findAll('td').map(td => td.text())
      expect(cells).toContain('Test finding')
      expect(cells).toContain('Test desc')
    })
  })

  describe('RNDR-02: Mobile card rendering', () => {
    it('renders mobile card container with findings-table-mobile class', () => {
      const wrapper = mountTable([{ finding: 'F1', description: 'D1' }])
      expect(wrapper.find('.findings-table-mobile').exists()).toBe(true)
    })

    it('renders one card per finding with findings-table-card class', () => {
      const wrapper = mountTable([
        { finding: 'F1', description: 'D1' },
        { finding: 'F2', description: 'D2' },
      ])
      expect(wrapper.findAll('.findings-table-card').length).toBe(2)
    })

    it('renders labeled fields inside each card', () => {
      const wrapper = mountTable([{ finding: 'Card test', description: 'Card desc' }])
      const card = wrapper.find('.findings-table-card')
      expect(card.text()).toContain('Card test')
      expect(card.text()).toContain('Card desc')
    })
  })

  describe('RNDR-03: Column-adaptive rendering', () => {
    it('detects default 2-col pattern when only finding and description present', () => {
      const wrapper = mountTable([{ finding: 'F', description: 'D' }])
      const headers = wrapper.findAll('th').map(th => th.text())
      expect(headers).toHaveLength(2)
      expect(headers).toContain('Finding')
      expect(headers).toContain('Description')
    })

    it('detects severity 3-col pattern when any finding has severity', () => {
      const wrapper = mountTable([{ finding: 'F', severity: 'High', description: 'D' }])
      const headers = wrapper.findAll('th').map(th => th.text())
      expect(headers).toHaveLength(3)
      expect(headers).toContain('Finding')
      expect(headers).toContain('Description')
      expect(headers).toContain('Severity')
    })

    it('detects background 3-col pattern when any finding has background', () => {
      const wrapper = mountTable([{ finding: 'F', background: 'B', resolution: 'R' }])
      const headers = wrapper.findAll('th').map(th => th.text())
      expect(headers).toHaveLength(3)
      expect(headers).toContain('Finding')
      expect(headers).toContain('Background')
      expect(headers).toContain('Resolution')
    })
  })

  describe('RNDR-04: Severity badges', () => {
    it('renders Critical badge with correct class', () => {
      const wrapper = mountTable([{ finding: 'F', severity: 'Critical', description: 'D' }])
      const badge = wrapper.find('.findings-table-badge.findings-table-badge--critical')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('Critical')
    })

    it('renders High badge with correct class', () => {
      const wrapper = mountTable([{ finding: 'F', severity: 'High', description: 'D' }])
      const badge = wrapper.find('.findings-table-badge.findings-table-badge--high')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toBe('High')
    })

    it('does not render badge when severity is absent', () => {
      const wrapper = mountTable([{ finding: 'F', description: 'D' }])
      expect(wrapper.find('.findings-table-badge').exists()).toBe(false)
    })
  })

  describe('Heading', () => {
    it('renders default heading "Findings" when prop omitted', () => {
      const wrapper = mountTable([{ finding: 'F', description: 'D' }])
      expect(wrapper.find('.findings-table-heading').text()).toBe('Findings')
    })

    it('renders custom heading when provided', () => {
      const wrapper = mountTable([{ finding: 'F', description: 'D' }], 'Custom Heading')
      expect(wrapper.find('.findings-table-heading').text()).toBe('Custom Heading')
    })
  })

  describe('Real data integration', () => {
    it('renders Exhibit A findings (background pattern) with correct card count', () => {
      const wrapper = mountTable(exhibitA.findings!)
      expect(wrapper.findAll('.findings-table-card').length).toBe(exhibitA.findings!.length)
    })

    it('renders Exhibit L findings (severity pattern) with badges', () => {
      const wrapper = mountTable(exhibitL.findings!)
      expect(wrapper.find('.findings-table-badge').exists()).toBe(true)
    })

    it('renders Exhibit E findings (default pattern)', () => {
      const wrapper = mountTable(exhibitE.findings!)
      expect(wrapper.find('.findings-table-badge').exists()).toBe(false)
    })
  })
})
