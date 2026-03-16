<script setup lang="ts">
defineProps<{
  quote: string
  cite: string
  context?: string
  variant?: 'primary' | 'secondary'
}>()
</script>

<template>
  <blockquote class="testimonial-quote" :class="{ 'testimonial-secondary': variant === 'secondary' }">
    <p class="quote-text">{{ quote }}</p>
    <footer class="quote-attribution">
      <cite>{{ cite }}</cite>
      <p v-if="context" class="quote-context">{{ context }}</p>
    </footer>
  </blockquote>
</template>
