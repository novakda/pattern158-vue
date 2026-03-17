import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ContactGuidance from './ContactGuidance.vue'

const meta = {
  title: 'Components/ContactGuidance',
  component: ContactGuidance,
} satisfies Meta<typeof ContactGuidance>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
