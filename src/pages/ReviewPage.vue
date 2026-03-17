<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-review')
useSeo({
  title: 'Review | Pattern 158 - Dan Novak',
  description: 'Review page for Pattern 158 Solutions.',
  path: '/review',
})
</script>

<template>
  <HeroMinimal title="Review" subtitle="Stakeholder review area" />

  <section class="content-section">
    <div class="container">
      <p>This page is reserved for stakeholder review of ongoing engagements. For project inquiries, please visit the <router-link to="/contact">contact page</router-link>.</p>
    </div>
  </section>
</template>
