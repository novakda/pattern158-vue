<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useFeedback } from '@/composables/useFeedback'
import { computePanelPosition } from './panelPosition'
import type { EnvironmentMeta } from './feedback.types'
import AnnotationCanvas from './AnnotationCanvas.vue'

const feedback = useFeedback()
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref({ top: '0px', left: '0px' })
const detailsOpen = ref(false)
const annotationCanvasRef = ref<InstanceType<typeof AnnotationCanvas> | null>(null)

const canSubmit = computed(() => feedback.state.comment.trim().length > 0)
const isSubmitting = computed(() => feedback.state.phase === 'submitting')

const envMeta = computed<EnvironmentMeta>(() => ({
  pageUrl: window.location.href,
  viewport: { width: window.innerWidth, height: window.innerHeight },
  userAgent: navigator.userAgent,
}))

const truncatedSelector = computed(() => {
  const s = feedback.state.capture?.selectorPath ?? ''
  return s.length > 40 ? s.slice(0, 37) + '...' : s
})

function handleCancel() {
  feedback.cancel()
}

function handleSubmit() {
  if (annotationCanvasRef.value) {
    feedback.updateScreenshot(annotationCanvasRef.value.compositeScreenshot())
  }
  feedback.submit()
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
  }
}

function autoResize(e: Event) {
  const textarea = e.target as HTMLTextAreaElement
  textarea.style.height = 'auto'
  const height = Math.max(80, Math.min(textarea.scrollHeight, 160))
  textarea.style.height = height + 'px'
}

onMounted(async () => {
  document.addEventListener('keydown', onKeyDown)

  await nextTick()
  const rect = feedback.state.capture?.boundingRect
  if (rect) {
    const pos = computePanelPosition(rect, 360, panelRef.value?.offsetHeight ?? 400)
    panelStyle.value = { top: pos.top + 'px', left: pos.left + 'px' }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div ref="panelRef" class="fb-panel" :style="panelStyle">
    <!-- Screenshot with annotation canvas -->
    <AnnotationCanvas
      v-if="feedback.state.capture?.screenshotDataUri"
      ref="annotationCanvasRef"
      :screenshot-src="feedback.state.capture.screenshotDataUri"
    />

    <!-- Metadata summary -->
    <div class="fb-panel-meta">
      <div class="fb-panel-meta-summary">
        <span class="fb-panel-meta-tag">{{ feedback.state.capture?.tag }}</span>
        <span class="fb-panel-meta-selector" :title="feedback.state.capture?.selectorPath">{{ truncatedSelector }}</span>
      </div>
      <button class="fb-panel-meta-toggle" @click="detailsOpen = !detailsOpen">
        {{ detailsOpen ? 'Less' : 'More' }}
      </button>
      <div v-if="detailsOpen" class="fb-panel-meta-details">
        <div><strong>URL:</strong> {{ envMeta.pageUrl }}</div>
        <div><strong>Viewport:</strong> {{ envMeta.viewport.width }}x{{ envMeta.viewport.height }}</div>
        <div><strong>UA:</strong> {{ envMeta.userAgent }}</div>
        <div v-if="feedback.state.capture?.componentName"><strong>Component:</strong> {{ feedback.state.capture.componentName }}</div>
        <div><strong>Selector:</strong> {{ feedback.state.capture?.selectorPath }}</div>
      </div>
    </div>

    <!-- Comment textarea -->
    <textarea
      :value="feedback.state.comment"
      @input="(e) => { feedback.setComment((e.target as HTMLTextAreaElement).value); autoResize(e) }"
      class="fb-panel-comment"
      placeholder="Describe the issue..."
      rows="4"
    />

    <!-- Actions -->
    <div class="fb-panel-actions">
      <button class="fb-panel-btn fb-panel-btn--cancel" @click="handleCancel">Cancel</button>
      <button class="fb-panel-btn fb-panel-btn--submit" :disabled="!canSubmit || isSubmitting" @click="handleSubmit">{{ isSubmitting ? 'Submitting...' : 'Submit' }}</button>
    </div>
  </div>
</template>
