<script setup lang="ts">
import type { Stat } from '@/data/stats'
import StatItem from '@/components/StatItem.vue'

defineProps<{
  stats: Stat[]
}>()
</script>

<template>
  <section class="stats-section" aria-label="Career statistics">
    <div class="container">
      <div class="stats-row">
        <StatItem
          v-for="stat in stats"
          :key="stat.label"
          :number="stat.number"
          :label="stat.label"
        />
      </div>
    </div>
  </section>
</template>
