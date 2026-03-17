<script setup lang="ts">
defineProps<{
  question: string
  answer: string
}>()
</script>

<template>
  <div class="faq-item">
    <h3 class="faq-question">{{ question }}</h3>
    <div class="faq-answer">
      <p v-for="(paragraph, i) in answer.split('\n\n')" :key="i">{{ paragraph }}</p>
    </div>
  </div>
</template>
