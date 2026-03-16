<script setup lang="ts">
import type { Influence } from '@/data/influences'

defineProps<{
  influences: Influence[]
}>()
</script>

<template>
  <section class="content-section influences-compact">
    <div class="container">
      <h2>Five Core Influences</h2>
      <p class="section-subtitle">
        Not abstract inspirations&#x2014;specific sources that shaped how I solve problems.
        <router-link to="/philosophy#influences" class="link-primary">Full details &#x2192;</router-link>
      </p>

      <dl class="influences-list">
        <template v-for="influence in influences" :key="influence.term">
          <dt>{{ influence.term }}</dt>
          <dd>
            <template v-for="(segment, i) in influence.segments" :key="i">
              <template v-if="segment.link">
                {{ segment.text }}<router-link :to="segment.link.to" class="link-primary">{{ segment.link.text }}</router-link>
              </template>
              <template v-else>{{ segment.text }}</template>
            </template>
          </dd>
        </template>
      </dl>
    </div>
  </section>
</template>
