<script setup lang="ts">
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-not-found')
useSeo({
  title: '404 — Page Not Found | Pattern 158',
  description: 'The page you requested could not be found.',
  path: '/404',
})
</script>

<template>
  <section class="not-found">
    <div class="container">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <p class="not-found-subtext">Use the navigation above or return to the homepage.</p>
      <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
    </div>
  </section>
</template>
