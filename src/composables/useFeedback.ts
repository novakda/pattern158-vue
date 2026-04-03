import { reactive, readonly } from 'vue'
import type { FeedbackState, FeedbackPhase } from '@/components/feedback/feedback.types'

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
    cancel,
    reset,
    setPhase,
  }
}
