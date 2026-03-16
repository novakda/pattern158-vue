import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PhilosophyPage from './PhilosophyPage.vue'

const meta = {
  title: 'Pages/PhilosophyPage',
  component: PhilosophyPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PhilosophyPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
