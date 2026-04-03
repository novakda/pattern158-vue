<script setup lang="ts">
import type { ExhibitPersonnelEntry } from '@/data/exhibits'

defineProps<{
  personnel: ExhibitPersonnelEntry[]
}>()
</script>

<template>
  <div class="personnel-grid">
    <div
      v-for="(person, i) in personnel"
      :key="i"
      :class="['personnel-card', { 'personnel-card--self': person.isSelf }]"
    >
      <!-- Named person: show name in primary position -->
      <div v-if="person.name" class="personnel-name">{{ person.name }}</div>
      <!-- Anonymous person: show title in name position with muted/italic styling (D-04, D-06) -->
      <div v-else-if="person.title" class="personnel-name personnel-name--anonymous">
        {{ person.title }}
      </div>

      <!-- Role field (priority over title per D-03) -->
      <div v-if="person.role" class="personnel-role">{{ person.role }}</div>

      <!-- Title as detail field (only when person has a name, so title is not already shown above) -->
      <div v-if="person.name && person.title" class="personnel-title">{{ person.title }}</div>

      <!-- Organization -->
      <div v-if="person.organization" class="personnel-org">{{ person.organization }}</div>
    </div>
  </div>
</template>
