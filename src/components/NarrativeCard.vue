<script setup lang="ts">
defineProps<{
  narrative: {
    title: string
    description: string
    clients: string
  }
}>()
</script>

<template>
  <div class="narrative-card">
    <h3>{{ narrative.title }}</h3>
    <p>{{ narrative.description }}</p>
    <span class="narrative-clients">{{ narrative.clients }}</span>
  </div>
</template>
