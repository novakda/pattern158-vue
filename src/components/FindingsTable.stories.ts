import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FindingsTable from './FindingsTable.vue'

const meta = {
  title: 'Components/FindingsTable',
  component: FindingsTable,
} satisfies Meta<typeof FindingsTable>

export default meta
type Story = StoryObj<typeof meta>

export const TwoColumnVariant: Story = {
  args: {
    findings: [
      {
        finding: 'Cross-Domain SCORM Framework',
        description:
          'Engineered cross-domain communication layer enabling SCORM content to report scores across security boundaries without violating same-origin policy.',
      },
      {
        finding: 'Automated Regression Suite',
        description:
          'Built end-to-end test harness covering 14 LMS integrations, reducing manual QA cycles from 3 days to 4 hours per release.',
      },
      {
        finding: 'Content Packaging Pipeline',
        description:
          'Developed build tooling that validated SCORM manifests, optimized media assets, and produced deployment-ready packages in a single CLI command.',
      },
    ],
  },
}

export const SeverityVariant: Story = {
  args: {
    heading: 'Audit Findings',
    findings: [
      {
        finding: 'Unencrypted PII in Transit',
        description:
          'Student records transmitted between LMS and reporting service over unencrypted HTTP endpoints.',
        severity: 'High',
      },
      {
        finding: 'Missing Input Validation',
        description:
          'Assessment score submissions accepted arbitrary string values without server-side type checking.',
        severity: 'Medium',
      },
      {
        finding: 'Verbose Error Messages',
        description:
          'API error responses included internal stack traces and database connection strings in non-production environments.',
        severity: 'Low',
      },
    ],
  },
}

export const BackgroundResolutionVariant: Story = {
  args: {
    findings: [
      {
        finding: 'Legacy Data Migration',
        background:
          'Historical training records stored in a flat-file format with inconsistent date encoding across 6 regional offices.',
        resolution:
          'Built a normalization pipeline that parsed all known date variants and migrated 240K records into the new relational schema with full audit trail.',
      },
      {
        finding: 'Deployment Bottleneck',
        background:
          'Release process required manual coordination across 3 teams with a 2-week lead time for production deployments.',
        resolution:
          'Introduced CI/CD pipeline with automated environment provisioning, cutting deployment lead time to under 2 hours.',
      },
      {
        finding: 'Knowledge Silos',
        background:
          'Critical system behavior documented only in tribal knowledge held by two senior engineers approaching retirement.',
        resolution:
          'Conducted structured knowledge extraction sessions and produced runbooks covering all operational procedures.',
      },
    ],
  },
}
