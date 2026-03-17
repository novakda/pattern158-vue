import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NarrativeCard from './NarrativeCard.vue'

const meta = {
  title: 'Components/NarrativeCard',
  component: NarrativeCard,
} satisfies Meta<typeof NarrativeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    narrative: {
      title: 'Enterprise Integration Architect',
      description: 'Complex multi-system integrations where nothing was designed to work together. Cross-domain SCORM dispatch, federated platform facades, protocol translation layers.',
      clients: 'GDEB \u00b7 HSBC \u00b7 GM \u00b7 Wells Fargo \u00b7 BP \u00b7 SunTrust',
    },
  },
}

export const AIModernization: Story = {
  args: {
    narrative: {
      title: 'AI-Driven Legacy Modernization',
      description: 'Forensic engineering amplified by AI tooling. Using LLMs to pressure-test analysis, generate baselines, and surface gaps that manual review misses.',
      clients: 'Microsoft MCAPS \u00b7 Power Platform \u00b7 GitHub Spec Kit \u00b7 Copilot Studio',
    },
  },
}
