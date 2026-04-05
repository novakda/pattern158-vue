import { reactive, readonly } from 'vue'
import type { FeedbackState, FeedbackPhase, ElementCapture } from '@/components/feedback/feedback.types'
import { screenshotCapture } from '@/components/feedback/screenshotCapture'

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
  }
}
