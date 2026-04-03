import type { FeedbackConfig } from '@/components/feedback/feedback.types'

export function useFeedbackConfig(): FeedbackConfig {
  const token = import.meta.env.VITE_GITHUB_TOKEN ?? ''
  const repo = import.meta.env.VITE_GITHUB_REPO ?? ''
  const enabled = import.meta.env.MODE !== 'production'

  const missingVars: string[] = []
  if (!token) missingVars.push('VITE_GITHUB_TOKEN')
  if (!repo) missingVars.push('VITE_GITHUB_REPO')

  if (missingVars.length > 0) {
    console.warn(
      `[FeedbackCollector] Missing env vars: ${missingVars.join(', ')}. ` +
      'Add them to .env.local to enable GitHub issue submission. ' +
      'See .env.example for details.'
    )
  }

  const isConfigured = enabled && !!token && !!repo

  return {
    token,
    repo,
    enabled,
    isConfigured,
    missingVars,
  }
}
