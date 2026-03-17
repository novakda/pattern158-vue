import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatsSection from './StatsSection.vue'

const meta = {
  title: 'Components/StatsSection',
  component: StatsSection,
} satisfies Meta<typeof StatsSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stats: [
      { number: '28+', label: 'Years' },
      { number: '5,200+', label: 'Projects' },
      { number: '40+', label: 'Clients' },
      { number: '930+', label: 'Testimonials' },
    ],
  },
}

export const FewStats: Story = {
  args: {
    stats: [
      { number: '28+', label: 'Years' },
      { number: '40+', label: 'Clients' },
    ],
  },
}
