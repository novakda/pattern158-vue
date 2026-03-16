import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FaqPage from './FaqPage.vue'

const meta = {
  title: 'Pages/FaqPage',
  component: FaqPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FaqPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
