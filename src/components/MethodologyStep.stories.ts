import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MethodologyStep from './MethodologyStep.vue'

const meta = {
  title: 'Components/MethodologyStep',
  component: MethodologyStep,
} satisfies Meta<typeof MethodologyStep>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    step: {
      title: 'Deconstruct the Chaos',
      description: 'I use forensic engineering to understand \u201cblack box\u201d legacy systems. Never blame the human first \u2014 investigate the design. Systems thinking over code debugging.',
    },
  },
}

export const BuildTheTool: Story = {
  args: {
    step: {
      title: 'Build the Tool',
      description: 'I create reusable frameworks (middleware, CMS templates, AI agents) to solve the root cause. Don\u2019t fix individual bugs \u2014 prevent entire categories of problems.',
    },
  },
}
