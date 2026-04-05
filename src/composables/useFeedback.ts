import { reactive, readonly } from 'vue'
import type { FeedbackState, FeedbackPhase, ElementCapture } from '@/components/feedback/feedback.types'
import { screenshotCapture } from '@/components/feedback/screenshotCapture'
import { submitFeedback } from '@/components/feedback/githubSubmit'
import { useFeedbackConfig } from '@/composables/useFeedbackConfig'

const state = reactive<FeedbackState>({
  phase: 'idle',
  selectedElement: null,
  capture: null,
  comment: '',
  error: null,
  issueUrl: null,
})

function setPhase(phase: FeedbackPhase) {
  state.phase = phase
}

function activate() {
  state.phase = 'picking'
}

async function selectElement(el: HTMLElement, capture: ElementCapture) {
  state.selectedElement = el
  state.capture = capture
  state.phase = 'capturing'

  try {
    const dataUri = await screenshotCapture(el)
    state.capture!.screenshotDataUri = dataUri
    state.phase = 'annotating'
  } catch (error) {
    console.warn('Screenshot capture failed:', error)
    state.error = 'Screenshot capture failed. You can retry or continue without screenshot.'
    state.phase = 'error'
  }
}

function deactivate() {
  if (state.phase === 'picking') {
    reset()
  }
}

function setComment(text: string) {
  state.comment = text
}

function cancel() {
  reset()
}

function reset() {
  state.phase = 'idle'
  state.selectedElement = null
  state.capture = null
  state.comment = ''
  state.error = null
  state.issueUrl = null
}

async function submit() {
  const config = useFeedbackConfig()
  if (!config.isConfigured || !state.capture) return

  state.phase = 'submitting'
  state.error = null

  try {
    const result = await submitFeedback({
      token: config.token,
      repo: config.repo,
      labels: config.labels,
      capture: state.capture,
      comment: state.comment,
      environment: {
        pageUrl: window.location.href,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        userAgent: navigator.userAgent,
      },
    })
    state.issueUrl = result.issueUrl
    state.phase = 'done'
  } catch (err) {
    state.error = err instanceof Error ? err.message : 'Submission failed'
    state.phase = 'error'
  }
}

async function retry() {
  await submit()
}

export function useFeedback() {
  return {
    state: readonly(state),
    activate,
    deactivate,
    selectElement,
    cancel,
    reset,
    setPhase,
    setComment,
    submit,
    retry,
  }
}
