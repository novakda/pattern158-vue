import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TechCard from './TechCard.vue'

const meta = {
  title: 'Components/TechCard',
  component: TechCard,
  decorators: [
    () => ({
      template: '<div style="max-width: 400px;"><story /></div>',
    }),
  ],
} satisfies Meta<typeof TechCard>

export default meta
type Story = StoryObj<typeof meta>

export const WithTagsAndDate: Story = {
  args: {
    name: 'JavaScript',
    level: 'deep',
    summary: 'Primary language across full career. SCORM runtime APIs, cross-browser debugging, modern ES6+ features, Vue.js component architecture, Node.js tooling.',
    dateRange: '2009–2022',
    tags: [
      { label: 'BMS', title: 'Bristol-Myers Squibb' },
      { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
      { label: 'Nalco', title: 'Nalco (Ecolab)' },
      { label: 'AEP', title: 'American Electric Power' },
    ],
  },
}

export const SummaryOnly: Story = {
  args: {
    name: 'TypeScript',
    level: 'working',
    summary: 'Type-safe JavaScript for larger projects. Interface definitions, generics, strict type checking.',
  },
}

export const AwareLevel: Story = {
  args: {
    name: 'C#/.NET',
    level: 'aware',
    summary: 'Exposure through platform work and legacy system integration.',
    dateRange: '2009–2022',
    tags: [
      { label: 'Sikorsky', title: 'Sikorsky Aircraft (Lockheed Martin)' },
      { label: 'NASA', title: 'NASA' },
    ],
  },
}
