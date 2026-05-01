import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FaqFilterBar from './FaqFilterBar.vue'

const testCategories = [
  { id: 'hiring', heading: 'Hiring Logistics', intro: 'About hiring' },
  { id: 'expertise', heading: 'Technical Expertise', intro: 'About expertise' },
  { id: 'approach', heading: 'Approach & Methodology', intro: 'About approach' },
]

const testCounts: Record<string, number> = {
  hiring: 5,
  expertise: 8,
  approach: 3,
}

const totalCount = 16

describe('FaqFilterBar', () => {
  it('renders "All" pill button', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: null, counts: testCounts, totalCount },
    })
    const allBtn = wrapper.find('[data-filter="all"]')
    expect(allBtn.exists()).toBe(true)
    expect(allBtn.text()).toBe('All')
  })

  it('renders one pill per category', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: null, counts: testCounts, totalCount },
    })
    const pills = wrapper.findAll('.filter-pill')
    // 3 categories + 1 "All" = 4
    expect(pills).toHaveLength(4)
  })

  it('"All" pill has active class when activeFilter is null', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: null, counts: testCounts, totalCount },
    })
    const allBtn = wrapper.find('[data-filter="all"]')
    expect(allBtn.classes()).toContain('active')
  })

  it('category pill has active class when it matches activeFilter', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: 'expertise', counts: testCounts, totalCount },
    })
    const expertiseBtn = wrapper.find('[data-filter="expertise"]')
    expect(expertiseBtn.classes()).toContain('active')
    const allBtn = wrapper.find('[data-filter="all"]')
    expect(allBtn.classes()).not.toContain('active')
  })

  it('clicking a category pill emits filter-change with category id', async () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: null, counts: testCounts, totalCount },
    })
    await wrapper.find('[data-filter="hiring"]').trigger('click')
    expect(wrapper.emitted('filter-change')).toEqual([['hiring']])
  })

  it('clicking "All" pill emits filter-change with null', async () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: 'hiring', counts: testCounts, totalCount },
    })
    await wrapper.find('[data-filter="all"]').trigger('click')
    expect(wrapper.emitted('filter-change')).toEqual([[null]])
  })

  it('displays total count when activeFilter is null', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: null, counts: testCounts, totalCount },
    })
    const countLabel = wrapper.find('.filter-count')
    expect(countLabel.text()).toBe('16 questions')
  })

  it('displays filtered count when a category is active', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: 'expertise', counts: testCounts, totalCount },
    })
    const countLabel = wrapper.find('.filter-count')
    expect(countLabel.text()).toBe('8 questions')
  })

  it('count label uses "question" singular for count of 1', () => {
    const wrapper = mount(FaqFilterBar, {
      props: {
        categories: testCategories,
        activeFilter: 'approach',
        counts: { ...testCounts, approach: 1 },
        totalCount,
      },
    })
    const countLabel = wrapper.find('.filter-count')
    expect(countLabel.text()).toBe('1 question')
  })

  it('all pills are buttons with type="button"', () => {
    const wrapper = mount(FaqFilterBar, {
      props: { categories: testCategories, activeFilter: null, counts: testCounts, totalCount },
    })
    const buttons = wrapper.findAll('.filter-pill')
    buttons.forEach(btn => {
      expect(btn.element.tagName).toBe('BUTTON')
      expect(btn.attributes('type')).toBe('button')
    })
  })
})
