import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ExpertiseBadge from './ExpertiseBadge.vue'
import { expertiseLevels } from './ExpertiseBadge.types'

const meta = {
  title: 'Components/ExpertiseBadge',
  component: ExpertiseBadge,
  argTypes: {
    level: {
      control: 'select',
      options: [...expertiseLevels],
    },
  },
} satisfies Meta<typeof ExpertiseBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Deep: Story = {
  args: {
    level: 'deep',
  },
}

export const Working: Story = {
  args: {
    level: 'working',
  },
}

export const Aware: Story = {
  args: {
    level: 'aware',
  },
}
