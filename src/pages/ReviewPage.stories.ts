import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ReviewPage from './ReviewPage.vue'

const meta = {
  title: 'Pages/ReviewPage',
  component: ReviewPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ReviewPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
