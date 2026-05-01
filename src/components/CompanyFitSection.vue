<script setup lang="ts">
import { companyFit } from '@/content/sections/companyFit'
</script>

<template>
  <section class="company-fit">
    <div class="container">
      <h2>{{ companyFit.heading }}</h2>

      <div class="fit-criteria">
        <p v-for="p in companyFit.criteria" :key="p.thesis">
          <strong>{{ p.thesis }}</strong> {{ p.body }}
        </p>
      </div>
    </div>
  </section>
</template>
