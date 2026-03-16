import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AccessibilityPage from './AccessibilityPage.vue'

const meta = {
  title: 'Pages/AccessibilityPage',
  component: AccessibilityPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AccessibilityPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
