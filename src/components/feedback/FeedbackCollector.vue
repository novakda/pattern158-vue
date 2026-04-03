<script setup lang="ts">
import './feedback.css'
import FeedbackTrigger from './FeedbackTrigger.vue'
import { useFeedbackConfig } from '@/composables/useFeedbackConfig'
import { useFeedback } from '@/composables/useFeedback'

const config = useFeedbackConfig()
const feedback = useFeedback()
</script>

<template>
  <Teleport to="body">
    <div class="fb-root">
      <FeedbackTrigger
        :disabled="!config.isConfigured"
        @activate="feedback.activate()"
      />
    </div>
  </Teleport>
</template>
