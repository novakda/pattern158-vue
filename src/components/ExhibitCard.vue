<script setup lang="ts">
import type { Exhibit } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

defineProps<{
  exhibit: Exhibit
}>()
</script>

<template>
  <div :class="['exhibit-card', 'detail-exhibit', 'type-' + exhibit.exhibitType]">
    <div class="exhibit-header">
      <span class="exhibit-label">{{ exhibit.label }}</span>
      <span class="exhibit-client">{{ exhibit.client }}</span>
      <span class="exhibit-date">{{ exhibit.date }}</span>
    </div>
    <h3 class="exhibit-title">{{ exhibit.title }}</h3>

    <slot name="quote">
      <blockquote v-for="(q, i) in exhibit.quotes" :key="i">
        {{ q.text }}
        <div class="attribution">
          <template v-if="q.attribution">{{ q.attribution }}</template>
          <span v-if="q.role" class="role">{{ q.role }}</span>
        </div>
      </blockquote>
    </slot>

    <slot name="context">
      <div v-if="exhibit.contextText" class="exhibit-context">
        <h4>{{ exhibit.contextHeading }}</h4>
        <p>{{ exhibit.contextText }}</p>
      </div>
    </slot>

    <slot name="table">
      <table v-if="exhibit.resolutionTable" class="resolution-table">
        <thead>
          <tr><th>Issue</th><th>Resolution</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in exhibit.resolutionTable" :key="i">
            <td data-label="Issue">{{ row.issue }}</td>
            <td data-label="Resolution">{{ row.resolution }}</td>
          </tr>
        </tbody>
      </table>
    </slot>

    <slot name="actions">
      <div class="impact-tags">
        <TechTags :tags="exhibit.impactTags" />
      </div>
      <router-link :to="exhibit.exhibitLink" class="exhibit-link">
        {{ exhibit.exhibitType === 'investigation-report' ? 'View Full Investigation Report' : 'View Engineering Brief' }}
      </router-link>
    </slot>
  </div>
</template>
