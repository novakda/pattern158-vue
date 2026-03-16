<script setup lang="ts">
import ExpertiseBadge from '@/components/ExpertiseBadge.vue'
import type { ExpertiseLevel } from '@/components/ExpertiseBadge.types'
import TechTags from '@/components/TechTags.vue'
import type { Tag } from '@/components/TechTags.types'

defineProps<{
  name: string
  level: ExpertiseLevel
  summary: string
  dateRange?: string
  tags?: Tag[]
}>()
</script>

<template>
  <div class="tech-card">
    <div class="tech-card-header">
      <h3 class="tech-name">{{ name }}</h3>
      <ExpertiseBadge :level="level" />
    </div>
    <p class="tech-summary">{{ summary }}</p>
    <p v-if="dateRange" class="tech-data-line">{{ dateRange }}</p>
    <TechTags v-if="tags?.length" :tags="tags" />
  </div>
</template>
