import type { Meta, StoryObj } from '@storybook/vue3-vite'
import HeroMinimal from './HeroMinimal.vue'

const meta = {
  title: 'Components/HeroMinimal',
  component: HeroMinimal,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroMinimal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Technologies',
    subtitle: 'Production-proven expertise across modern engineering and eLearning systems',
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'FAQ',
  },
}

export const WithIntroSlot: Story = {
  args: {
    title: 'Technologies',
    subtitle: 'Production-proven expertise across modern engineering and eLearning systems',
  },
  render: (args) => ({
    components: { HeroMinimal },
    setup() {
      return { args }
    },
    template: `
      <HeroMinimal v-bind="args">
        <p class="hero-intro">Curated expertise spanning modern software development and deep domain knowledge in
          eLearning platforms. Each technology below reflects real production work—not aspirational skills.</p>
      </HeroMinimal>
    `,
  }),
}
