<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import StatItem from '@/components/StatItem.vue'
import ExhibitCard from '@/components/ExhibitCard.vue'
import TestimonialsMetrics from '@/components/TestimonialsMetrics.vue'
import { exhibits } from '@/data/exhibits'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

useBodyClass('page-testimonials')
useSeo({
  title: 'Field Reports | Pattern 158 - Dan Novak',
  description: 'Field reports and case studies from Dan Novak\'s 28+ year career. Evidence from Electric Boat, Wells Fargo, HSBC, SunTrust, TD Bank, and more.',
  path: '/testimonials',
})
</script>

<template>
  <HeroMinimal title="FIELD REPORTS" subtitle="Documented evidence from incident sites across 28+ years of engineering work">
    <span class="classification">Corroborated &middot; Primary Sources &middot; 2005&ndash;2022</span>
  </HeroMinimal>

  <section class="summary">
    <div class="container">
      <h2>Executive Summary</h2>
      <p>The following exhibits are drawn from professional correspondence spanning 17 years across enterprise clients including General Dynamics Electric Boat, HSBC, Wells Fargo, SunTrust, and TD Bank. Each citation is sourced from professional correspondence.</p>
      <div class="stats-bar">
        <StatItem number="17" label="Years Documented" />
        <StatItem number="600+" label="Labor Hours Saved (Single Project)" />
        <StatItem number="5" label="Critical Issues Resolved (2-Day Onsite)" />
        <StatItem number="1,216" label="Lessons Refreshed (Content Overhaul)" />
      </div>
    </div>
  </section>

  <section class="exhibits" id="exhibits">
    <div class="container">
      <h2>Exhibits</h2>
      <p class="section-subtitle">Direct quotations from primary sources, organized by engagement</p>
      <ExhibitCard v-for="e in exhibits.slice(0, 9)" :key="e.label" :exhibit="e" />

      <div class="investigation-reports-heading">
        <h2>Investigation Reports</h2>
        <p class="section-subtitle">Methodology-driven case studies: the investigation is the deliverable</p>
      </div>
      <ExhibitCard v-for="e in exhibits.slice(9)" :key="e.label" :exhibit="e" />
    </div>
  </section>

  <TestimonialsMetrics />
</template>
