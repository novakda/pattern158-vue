<script setup lang="ts">
import HomeHero from '@/components/HomeHero.vue'
import SpecialtyCard from '@/components/SpecialtyCard.vue'
import StatsSection from '@/components/StatsSection.vue'
import InfluencesList from '@/components/InfluencesList.vue'
import FindingCard from '@/components/FindingCard.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
import { intro, featuredProjectsHeading, fieldReportsHeading, teaserQuotes } from '@/content/home'
import { techPills } from '@/data/techPills'
import { specialties } from '@/data/specialties'
import { stats } from '@/data/stats'
import { influences } from '@/data/influences'
import { findings } from '@/data/findings'

useBodyClass('page-index')
useSeo({
  title: 'Pattern 158 | Dan Novak - Systems Architect',
  description: 'Dan Novak - Systems architect with 28+ years rescuing enterprise systems. Specializing in legacy system integration, cross-platform solutions, and AI implementation.',
  path: '/',
})
</script>

<template>
  <HomeHero :tech-pills="techPills" />

  <section class="intro">
    <div class="container">
      <h2>{{ intro.heading }}</h2>
      <p>{{ intro.body }}</p>

      <div class="specialties">
        <SpecialtyCard
          v-for="s in specialties"
          :key="s.title"
          :title="s.title"
          :description="s.description"
        />
      </div>
    </div>
  </section>

  <StatsSection :stats="stats" />

  <InfluencesList :influences="influences" />

  <section class="findings" :id="featuredProjectsHeading.id">
    <div class="container">
      <h2>{{ featuredProjectsHeading.title }}</h2>
      <FindingCard v-for="f in findings" :key="f.number" :finding="f" />
    </div>
  </section>

  <section class="field-reports-teaser">
    <div class="container">
      <h2>{{ fieldReportsHeading.title }}</h2>
      <p class="section-subtitle">{{ fieldReportsHeading.subtitle }}</p>

      <div class="teaser-quotes">
        <TestimonialQuote
          v-for="q in teaserQuotes"
          :key="q.quote"
          :quote="q.quote"
          :cite="q.cite"
          :context="q.context"
        />
      </div>

      <router-link to="/case-files" class="btn btn-primary">View All Case Files</router-link>
    </div>
  </section>
</template>
