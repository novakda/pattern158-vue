import type { Meta, StoryObj } from '@storybook/vue3-vite'
import HomeHero from './HomeHero.vue'

const meta = {
  title: 'Components/HomeHero',
  component: HomeHero,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HomeHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    techPills: [
      'JavaScript',
      'Node.js',
      'Vue.js',
      'TypeScript',
      'SQL',
      'REST APIs',
      'AI Integration',
      'Power Platform',
    ],
  },
}

export const FewerPills: Story = {
  args: {
    techPills: ['Vue.js', 'TypeScript', 'Node.js'],
  },
}
