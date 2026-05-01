import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FaqAccordionItem from './FaqAccordionItem.vue'

const testItem = {
  id: 'test-question',
  question: 'Is this a test?',
  answer: 'Yes, this is a test answer.\n\nWith multiple paragraphs.',
  categories: ['hiring', 'expertise'],
}

describe('FaqAccordionItem', () => {
  it('renders question text', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    expect(wrapper.text()).toContain('Is this a test?')
  })

  it('hides answer when isOpen is false', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    const panel = wrapper.find(`#faq-answer-test-question`)
    expect(panel.attributes('hidden')).toBeDefined()
  })

  it('shows answer when isOpen is true', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: true },
    })
    const panel = wrapper.find(`#faq-answer-test-question`)
    expect(panel.attributes('hidden')).toBeUndefined()
    expect(panel.text()).toContain('Yes, this is a test answer.')
  })

  it('emits toggle event when button is clicked', async () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('button has aria-expanded="false" when closed', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('button has aria-expanded="true" when open', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: true },
    })
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('button has aria-controls matching answer panel id', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    expect(wrapper.find('button').attributes('aria-controls')).toBe('faq-answer-test-question')
  })

  it('answer panel has correct id', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: true },
    })
    expect(wrapper.find('[role="region"]').attributes('id')).toBe('faq-answer-test-question')
  })

  it('renders category pills', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    const pills = wrapper.findAll('.faq-category-pill')
    expect(pills).toHaveLength(2)
    expect(pills[0].text()).toBe('hiring')
    expect(pills[1].text()).toBe('expertise')
  })

  it('button is inside an h3', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.find('button').exists()).toBe(true)
  })

  it('has is-open class when open', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: true },
    })
    expect(wrapper.classes()).toContain('is-open')
  })

  it('does not have is-open class when closed', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: false },
    })
    expect(wrapper.classes()).not.toContain('is-open')
  })

  it('splits answer into paragraphs on double newline', () => {
    const wrapper = mount(FaqAccordionItem, {
      props: { item: testItem, isOpen: true },
    })
    const paragraphs = wrapper.findAll('.faq-answer p')
    expect(paragraphs).toHaveLength(2)
  })
})
