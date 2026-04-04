<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { captureElement } from './captureElement'
import { useFeedback } from '@/composables/useFeedback'

const feedback = useFeedback()

const hoveredElement = ref<HTMLElement | null>(null)
const highlightStyle = ref({
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  display: 'none',
})

const overlayRef = ref<HTMLElement | null>(null)

function isFeedbackElement(el: HTMLElement): boolean {
  // Check if the element itself has an fb- class
  for (const cls of el.classList) {
    if (cls.startsWith('fb-')) return true
  }
  // Check if it's inside a .fb-root ancestor
  if (el.closest('.fb-root')) return true
  return false
}

function onMouseMove(event: MouseEvent) {
  const overlay = overlayRef.value
  if (!overlay) return

  // Temporarily hide overlay to probe what's underneath
  overlay.style.pointerEvents = 'none'
  const elementBelow = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null
  overlay.style.pointerEvents = 'all'

  if (!elementBelow || isFeedbackElement(elementBelow)) {
    hoveredElement.value = null
    highlightStyle.value = { ...highlightStyle.value, display: 'none' }
    return
  }

  hoveredElement.value = elementBelow
  const rect = elementBelow.getBoundingClientRect()
  highlightStyle.value = {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    display: 'block',
  }
}

function onClick(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()

  if (hoveredElement.value) {
    const capture = captureElement(hoveredElement.value)
    feedback.selectElement(hoveredElement.value, capture)
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    feedback.deactivate()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div
    ref="overlayRef"
    class="fb-picker-overlay"
    @mousemove="onMouseMove"
    @click="onClick"
  />
  <div
    class="fb-picker-highlight"
    :style="highlightStyle"
  />
</template>
