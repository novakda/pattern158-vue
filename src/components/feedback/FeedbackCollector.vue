<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import './feedback.css'
import FeedbackTrigger from './FeedbackTrigger.vue'
import PickerOverlay from './PickerOverlay.vue'
import AnnotationPanel from './AnnotationPanel.vue'
import { useFeedbackConfig } from '@/composables/useFeedbackConfig'
import { useFeedback } from '@/composables/useFeedback'

const config = useFeedbackConfig()
const feedback = useFeedback()

function onKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault()
    if (feedback.state.phase === 'idle') {
      feedback.activate()
    } else if (feedback.state.phase === 'picking') {
      feedback.deactivate()
    }
  }
}

onMounted(() => document.addEventListener('keydown', onKeyDown))
onUnmounted(() => document.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <Teleport to="body">
    <div class="fb-root">
      <FeedbackTrigger
        v-show="feedback.state.phase === 'idle'"
        :disabled="!config.isConfigured"
        @activate="feedback.activate()"
      />
      <PickerOverlay v-if="feedback.state.phase === 'picking'" />
      <div v-if="feedback.state.phase === 'capturing' || feedback.state.phase === 'submitting'" class="fb-capture-overlay">
        <div style="text-align: center">
          <div class="fb-capture-spinner" />
          <div class="fb-capture-label">{{ feedback.state.phase === 'capturing' ? 'Capturing...' : 'Submitting...' }}</div>
        </div>
      </div>
      <AnnotationPanel v-if="feedback.state.phase === 'annotating'" />

      <!-- Done state -->
      <div v-if="feedback.state.phase === 'done'" class="fb-panel fb-done-panel">
        <div class="fb-done-icon">&#10003;</div>
        <div class="fb-done-title">Feedback Submitted</div>
        <a
          v-if="feedback.state.issueUrl"
          :href="feedback.state.issueUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="fb-done-link"
        >
          View Issue on GitHub &rarr;
        </a>
        <button class="fb-panel-btn fb-panel-btn--submit" @click="feedback.reset()">
          New Report
        </button>
      </div>

      <!-- Error state -->
      <div v-if="feedback.state.phase === 'error'" class="fb-panel fb-error-panel">
        <div class="fb-error-icon">&#9888;</div>
        <div class="fb-error-title">Submission Failed</div>
        <div class="fb-error-message">{{ feedback.state.error }}</div>
        <div class="fb-panel-actions">
          <button class="fb-panel-btn fb-panel-btn--cancel" @click="feedback.reset()">Cancel</button>
          <button class="fb-panel-btn fb-panel-btn--submit" @click="feedback.retry()">Retry</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
