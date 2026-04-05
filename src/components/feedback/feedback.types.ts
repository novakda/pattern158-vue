export type FeedbackPhase = 'idle' | 'picking' | 'capturing' | 'annotating' | 'submitting' | 'done' | 'error'

export interface ElementCapture {
  tag: string
  selectorPath: string
  boundingRect: DOMRect
  screenshotDataUri: string | null
  componentName: string | null
}

export interface EnvironmentMeta {
  pageUrl: string
  viewport: { width: number; height: number }
  userAgent: string
}

export interface FeedbackState {
  phase: FeedbackPhase
  selectedElement: HTMLElement | null
  capture: ElementCapture | null
  comment: string
  error: string | null
  issueUrl: string | null
}

export interface FeedbackConfig {
  token: string
  repo: string
  labels: string[]
  enabled: boolean
  isConfigured: boolean
  missingVars: string[]
}
