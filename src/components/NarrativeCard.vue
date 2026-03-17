<script setup lang="ts">
import type { Narrative } from '@/data/portfolioNarratives'

defineProps<{
  narrative: Narrative
}>()
</script>

<template>
  <div class="narrative-card">
    <h3>{{ narrative.title }}</h3>
    <p>{{ narrative.description }}</p>
    <span class="narrative-clients">{{ narrative.clients }}</span>
  </div>
</template>
