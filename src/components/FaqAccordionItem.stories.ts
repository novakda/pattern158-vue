import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FaqAccordionItem from './FaqAccordionItem.vue'

const meta = {
  title: 'Components/FaqAccordionItem',
  component: FaqAccordionItem,
  argTypes: {
    isOpen: { control: 'boolean' },
  },
} satisfies Meta<typeof FaqAccordionItem>

export default meta
type Story = StoryObj<typeof meta>

const sampleItem = {
  id: 'available-new-projects',
  question: 'Are you available for new projects?',
  answer: "Yes, I'm available for contract, contract-to-hire, or full-time positions. I was laid off from GP Strategies in January 2026 and am actively seeking new opportunities.\n\nI'm interested in roles involving legacy system modernization, LMS/SCORM integration, enterprise system architecture, accessibility remediation (WCAG 2.1 AA+), and AI-assisted development tooling.",
  categories: ['hiring'],
}

export const Closed: Story = {
  args: {
    item: sampleItem,
    isOpen: false,
  },
}

export const Open: Story = {
  args: {
    item: sampleItem,
    isOpen: true,
  },
}

export const MultiCategory: Story = {
  args: {
    item: {
      id: 'ai-development-workflow',
      question: 'How do you use AI in your development workflow?',
      answer: "I use Claude Code as a core development tool for architecture planning, code generation, testing, and documentation. The Pattern 158 portfolio site itself was built using an AI-assisted workflow with structured milestones and phase-based execution.\n\nI also have experience building AI-powered features: semantic search, document classification, and intelligent form processing using OpenAI and Anthropic APIs.",
      categories: ['ai-tooling', 'approach'],
    },
    isOpen: true,
  },
}

export const WithExhibitNote: Story = {
  args: {
    item: {
      id: 'legacy-approach',
      question: 'How do you approach legacy system modernization?',
      answer: "I treat legacy systems as crime scenes, not construction sites. Before writing any code, I perform forensic analysis to understand what the system actually does versus what people think it does.\n\nThis involves protocol-level tracing, dependency mapping, and building diagnostic tooling to make the invisible visible.",
      categories: ['legacy', 'approach'],
      exhibitNote: 'See Exhibit A for a real-world example of this methodology applied to a SCORM integration failure.',
      exhibitUrl: '/case-files/exhibit-a',
    },
    isOpen: true,
  },
}
