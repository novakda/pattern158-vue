import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TechnologiesPage from './TechnologiesPage.vue'

const meta = {
  title: 'Pages/TechnologiesPage',
  component: TechnologiesPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TechnologiesPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
