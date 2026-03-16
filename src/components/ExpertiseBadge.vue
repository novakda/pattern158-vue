<script setup lang="ts">
import type { ExpertiseLevel } from './ExpertiseBadge.types'

defineProps<{
  level: ExpertiseLevel
}>()

const labels: Record<ExpertiseLevel, string> = {
  deep: 'Deep',
  working: 'Working',
  aware: 'Aware',
}
</script>

<template>
  <span class="expertise-badge" :class="`badge-${level}`">{{ labels[level] }}</span>
</template>
