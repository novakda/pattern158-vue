export type FeedbackPhase = 'idle' | 'picking' | 'annotating' | 'submitting' | 'done' | 'error'

export interface ElementCapture {
  tag: string
  selectorPath: string
  boundingRect: DOMRect
  screenshotDataUri: string | null
  componentName: string | null
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
  enabled: boolean
  isConfigured: boolean
  missingVars: string[]
}
