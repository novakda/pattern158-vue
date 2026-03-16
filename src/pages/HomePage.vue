<script setup lang="ts">
import HomeHero from '@/components/HomeHero.vue'
import SpecialtyCard from '@/components/SpecialtyCard.vue'
import StatsSection from '@/components/StatsSection.vue'
import InfluencesList from '@/components/InfluencesList.vue'
import FindingCard from '@/components/FindingCard.vue'
import TestimonialQuote from '@/components/TestimonialQuote.vue'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'
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

const teaserQuotes = [
  {
    quote: 'Dan\u2019s technical expertise is tremendous\u2026 with his help, we were able to solve two large technical issues we were having, one that will have a direct impact on the Flash conversion process and save a lot of time and money.',
  },
  {
    quote: 'This resulted in a savings of about 600 hours of labor by allowing us to publish large batches of lessons unattended.',
    cite: 'Manager, Content Team',
    context: 'On publishing automation built during 1,216-lesson refresh',
  },
]
</script>

<template>
  <HomeHero :tech-pills="techPills" />

  <section class="intro">
    <div class="container">
      <h2>I Reverse-Engineer Chaos Into Clarity</h2>
      <p>After 28 years building and rescuing enterprise systems, I've learned that the best solutions aren't always the obvious ones&#x2014;they're the elegant shortcuts that work properly.</p>

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

  <section class="findings" id="work">
    <div class="container">
      <h2>Featured Projects</h2>
      <FindingCard v-for="f in findings" :key="f.number" :finding="f" />
    </div>
  </section>

  <section class="field-reports-teaser">
    <div class="container">
      <h2>From the Field</h2>
      <p class="section-subtitle">Direct feedback from engagements spanning 17 years</p>

      <div class="teaser-quotes">
        <TestimonialQuote
          v-for="q in teaserQuotes"
          :key="q.quote"
          :quote="q.quote"
          :cite="q.cite"
          :context="q.context"
        />
      </div>

      <router-link to="/testimonials" class="btn btn-primary">View All Field Reports</router-link>
    </div>
  </section>
</template>
