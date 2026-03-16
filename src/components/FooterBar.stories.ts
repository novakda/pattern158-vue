import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FooterBar from './FooterBar.vue'

const meta = {
  title: 'Components/FooterBar',
  component: FooterBar,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FooterBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
