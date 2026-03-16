import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ContactPage from './ContactPage.vue'

const meta = {
  title: 'Pages/ContactPage',
  component: ContactPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ContactPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
