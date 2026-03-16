<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="specialty-card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>
