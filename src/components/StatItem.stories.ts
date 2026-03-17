import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatItem from './StatItem.vue'

const meta = {
  title: 'Components/StatItem',
  component: StatItem,
} satisfies Meta<typeof StatItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    number: '28+',
    label: 'Years',
  },
}

export const LargeNumber: Story = {
  args: {
    number: '5,200+',
    label: 'Projects',
  },
}

export const WithPlusSign: Story = {
  args: {
    number: '930+',
    label: 'Testimonials',
  },
}
