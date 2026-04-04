import { reactive, readonly } from 'vue'
import type { FeedbackState, FeedbackPhase, ElementCapture } from '@/components/feedback/feedback.types'

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

function selectElement(el: HTMLElement, capture: ElementCapture) {
  state.selectedElement = el
  state.capture = capture
  state.phase = 'annotating'
}

function deactivate() {
  if (state.phase === 'picking') {
    reset()
  }
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
  }
}
