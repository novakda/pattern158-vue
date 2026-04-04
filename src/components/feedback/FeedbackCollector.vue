<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import './feedback.css'
import FeedbackTrigger from './FeedbackTrigger.vue'
import PickerOverlay from './PickerOverlay.vue'
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
    </div>
  </Teleport>
</template>
