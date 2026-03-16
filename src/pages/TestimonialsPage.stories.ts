import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TestimonialsPage from './TestimonialsPage.vue'

const meta = {
  title: 'Pages/TestimonialsPage',
  component: TestimonialsPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TestimonialsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
