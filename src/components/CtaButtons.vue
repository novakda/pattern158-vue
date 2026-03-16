<script setup lang="ts">
defineProps<{
  primaryLabel: string
  primaryTo: string
  secondaryLabel: string
  secondaryTo: string
}>()
</script>

<template>
  <div class="cta-buttons">
    <router-link :to="primaryTo" class="btn btn-primary">{{ primaryLabel }}</router-link>
    <router-link :to="secondaryTo" class="btn btn-secondary">{{ secondaryLabel }}</router-link>
  </div>
</template>
