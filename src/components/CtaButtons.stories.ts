import type { Meta, StoryObj } from '@storybook/vue3-vite'
import CtaButtons from './CtaButtons.vue'

const meta = {
  title: 'Components/CtaButtons',
  component: CtaButtons,
} satisfies Meta<typeof CtaButtons>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    primaryLabel: 'Get in Touch',
    primaryTo: '/contact',
    secondaryLabel: 'View My Work',
    secondaryTo: '/portfolio',
  },
}

export const AlternateLabels: Story = {
  args: {
    primaryLabel: 'See Portfolio',
    primaryTo: '/portfolio',
    secondaryLabel: 'Read Philosophy',
    secondaryTo: '/philosophy',
  },
}
