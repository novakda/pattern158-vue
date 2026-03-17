import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ContactMethods from './ContactMethods.vue'

const meta = {
  title: 'Components/ContactMethods',
  component: ContactMethods,
} satisfies Meta<typeof ContactMethods>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
