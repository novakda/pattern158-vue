import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FaqItem from './FaqItem.vue'

const meta = {
  title: 'Components/FaqItem',
  component: FaqItem,
} satisfies Meta<typeof FaqItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    question: 'Are you available for new projects?',
    answer: 'Yes, I\'m available for contract, contract-to-hire, or full-time positions. I was laid off from GP Strategies in January 2026 and am actively seeking new opportunities.',
  },
}

export const LongAnswer: Story = {
  args: {
    question: 'What are your primary technical specializations?',
    answer: 'My deepest expertise spans three intersecting domains: eLearning systems architecture (SCORM, xAPI, AICC at the protocol level), enterprise system integration, and AI-assisted legacy modernization.\n\nOn the eLearning side, I\'ve diagnosed and resolved cross-domain SCORM failures, protocol translation issues, and LMS integration problems that stumped internal teams — often because the root cause was architectural, not code-level.\n\nOn the engineering side, I build middleware, facades, and diagnostic tooling. I use forensic engineering methodology to understand black-box systems before touching code.',
  },
}
