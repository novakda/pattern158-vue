<script setup lang="ts">
import type { ExhibitPersonnelEntry } from '@/data/exhibits'

defineProps<{
  personnel: ExhibitPersonnelEntry[]
}>()
</script>

<template>
  <div class="personnel-grid">
    <!-- Scaffold only — tests should fail -->
  </div>
</template>
