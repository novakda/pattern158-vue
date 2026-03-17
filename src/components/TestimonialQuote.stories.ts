import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TestimonialQuote from './TestimonialQuote.vue'

const meta = {
  title: 'Components/TestimonialQuote',
  component: TestimonialQuote,
} satisfies Meta<typeof TestimonialQuote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    quote:
      'Dan delivered a working cross-domain SCORM solution when no vendor had one. It ran without issues for over a decade.',
    cite: 'Director of eLearning, Energy Sector Client',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    quote:
      'The debugging tool Dan built cut our QA cycle from half a day to under an hour. It changed how our whole team worked.',
    cite: 'QA Lead, eLearning Development Team',
    variant: 'secondary',
  },
}

export const WithContext: Story = {
  args: {
    quote:
      'I have worked with many contractors over the years. Dan is one of the few who genuinely understands the full stack — from the LMS to the learner experience.',
    cite: 'VP of Training, Fortune 500 Client',
    context: 'Regarding a multi-year eLearning infrastructure engagement',
    variant: 'primary',
  },
}

export const Anonymous: Story = {
  args: {
    quote:
      'The investigation report was thorough and actionable. We implemented the recommendations and saw completion rates recover within two months.',
  },
}
