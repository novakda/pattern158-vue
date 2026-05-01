<script setup lang="ts">
import HeroMinimal from '@/components/HeroMinimal.vue'
import StatItem from '@/components/StatItem.vue'
import ExhibitCard from '@/components/ExhibitCard.vue'
import { exhibits } from '@/data/exhibits'
import {
  hero,
  stats,
  investigationReportsHeading,
  engineeringBriefsHeading,
  projectDirectoryHeading,
  projectDirectory,
} from '@/content/caseFiles'
import { useBodyClass } from '@/composables/useBodyClass'
import { useSeo } from '@/composables/useSeo'

const investigationReports = exhibits.filter(e => e.exhibitType === 'investigation-report')
const engineeringBriefs = exhibits.filter(e => e.exhibitType === 'engineering-brief')

useBodyClass('page-case-files')
useSeo({
  title: 'Case Files | Pattern 158 - Dan Novak',
  description: 'Documented evidence from 28+ years of engineering work. Investigation reports and engineering briefs from enterprise clients.',
  path: '/case-files',
})
</script>

<template>
  <HeroMinimal :title="hero.title" :subtitle="hero.subtitle">
    <span class="classification">{{ hero.classification }}</span>
  </HeroMinimal>

  <section class="case-files-stats" aria-label="Portfolio statistics">
    <div class="container">
      <div class="stats-bar">
        <StatItem v-for="s in stats" :key="s.label" :number="s.number" :label="s.label" />
      </div>
    </div>
  </section>

  <section class="case-files-exhibits" :aria-labelledby="investigationReportsHeading.id">
    <div class="container">
      <h2 :id="investigationReportsHeading.id">{{ investigationReportsHeading.title }}</h2>
      <p class="section-subtitle">{{ investigationReportsHeading.subtitle }}</p>
      <ExhibitCard v-for="e in investigationReports" :key="e.label" :exhibit="e" compact />
    </div>
  </section>

  <section class="case-files-exhibits" :aria-labelledby="engineeringBriefsHeading.id">
    <div class="container">
      <h2 :id="engineeringBriefsHeading.id">{{ engineeringBriefsHeading.title }}</h2>
      <p class="section-subtitle">{{ engineeringBriefsHeading.subtitle }}</p>
      <ExhibitCard v-for="e in engineeringBriefs" :key="e.label" :exhibit="e" compact />
    </div>
  </section>

  <section class="portfolio-directory" :aria-labelledby="projectDirectoryHeading.id">
    <div class="container">
      <h2 :id="projectDirectoryHeading.id">{{ projectDirectoryHeading.title }}</h2>
      <p class="section-subtitle">{{ projectDirectoryHeading.subtitle }}</p>

      <template v-for="group in projectDirectory" :key="group.industry">
        <h3 class="directory-industry">{{ group.industry }}</h3>
        <div class="directory-table-wrap">
          <table class="directory-table">
            <thead>
              <tr><th>Client</th><th>Project</th><th>Dates</th><th>Role</th></tr>
            </thead>
            <tbody>
              <tr v-for="entry in group.entries" :key="entry.client + entry.project">
                <td data-label="Client">{{ entry.client }}</td>
                <td data-label="Project">{{ entry.project }}</td>
                <td data-label="Dates">{{ entry.dates }}</td>
                <td data-label="Role">{{ entry.role }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </section>
</template>
