<script setup lang="ts">
import { cultureFit } from '@/content/sections/cultureFit'
</script>

<template>
  <section class="culture-fit">
    <div class="container">
      <h2>{{ cultureFit.heading }}</h2>

      <div class="culture-criteria">
        <div v-for="item in cultureFit.items" :key="item.lead" class="culture-item">
          <p><strong>{{ item.lead }}</strong> {{ item.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
