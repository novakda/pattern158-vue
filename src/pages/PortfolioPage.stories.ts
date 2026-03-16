import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PortfolioPage from './PortfolioPage.vue'

const meta = {
  title: 'Pages/PortfolioPage',
  component: PortfolioPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PortfolioPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
