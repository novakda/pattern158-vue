import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SpecialtyCard from './SpecialtyCard.vue'

const meta = {
  title: 'Components/SpecialtyCard',
  component: SpecialtyCard,
} satisfies Meta<typeof SpecialtyCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'eLearning Systems Architecture',
    description:
      'SCORM/AICC compliance, LMS integrations, cross-domain delivery frameworks, and courseware CMS design. 20+ years building production eLearning infrastructure.',
  },
}

export const LongDescription: Story = {
  args: {
    title: 'Full-Stack Web Development',
    description:
      'Vue.js, TypeScript, Node.js, REST APIs, SQL databases, and modern build tooling. From greenfield applications to legacy system rescue and migration. Emphasis on maintainability, performance, and accessible UI patterns that scale across teams and time. Comfortable owning the full vertical from schema design to deployment pipeline.',
  },
}

export const ShortDescription: Story = {
  args: {
    title: 'AI Integration',
    description: 'Microsoft Copilot Studio, prompt engineering, and hybrid AI/structured-data architectures.',
  },
}
