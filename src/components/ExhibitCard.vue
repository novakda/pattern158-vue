<script setup lang="ts">
import type { Exhibit } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

defineProps<{
  exhibit: Exhibit
}>()
</script>

<template>
  <div :class="['exhibit-card', exhibit.isDetailExhibit ? 'detail-exhibit' : '']">
    <div class="exhibit-header">
      <span class="exhibit-label">{{ exhibit.label }}</span>
      <span class="exhibit-client">{{ exhibit.client }}</span>
      <span class="exhibit-date">{{ exhibit.date }}</span>
    </div>
    <h3 class="exhibit-title">{{ exhibit.title }}</h3>

    <slot name="quote" />

    <slot name="context" />

    <slot name="actions">
      <div class="impact-tags">
        <TechTags :tags="exhibit.impactTags" />
      </div>
      <router-link v-if="exhibit.exhibitLink" :to="exhibit.exhibitLink" class="exhibit-link">
        View Full Investigation Report
      </router-link>
    </slot>
  </div>
</template>
