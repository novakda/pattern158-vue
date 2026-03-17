import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BrandElement from './BrandElement.vue'

const meta = {
  title: 'Components/BrandElement',
  component: BrandElement,
} satisfies Meta<typeof BrandElement>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    element: {
      title: '1. Provider of Clarity',
      label: 'The outcome.',
      description: 'Enter chaos, deliver understanding. Legacy systems, undefined requirements, failing courses \u2014 hand Dan a mess, get back clarity.',
    },
  },
}

export const WithSourceNote: Story = {
  args: {
    element: {
      title: '2. I Cheat, But I Cheat Fair',
      label: 'The method.',
      description: 'Build tools that skip tedium through proper engineering \u2014 documented, maintainable, ethical optimization.',
      sourceNote: 'The Three Stooges, \u201cHealthy, Wealthy and Dumb,\u201d 1938',
    },
  },
}
