<script setup lang="ts">
import type { Exhibit } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

defineProps<{ exhibit: Exhibit }>()
</script>

<template>
  <div class="exhibit-detail-page">
    <section class="exhibit-detail-header">
      <div class="container">
        <nav class="exhibit-back-nav">
          <router-link to="/case-files">&larr; Back to Case Files</router-link>
        </nav>
        <div class="exhibit-meta-header">
          <span class="exhibit-label">{{ exhibit.label }}</span>
          <span class="exhibit-client">{{ exhibit.client }}</span>
          <span class="exhibit-date">{{ exhibit.date }}</span>
        </div>
        <h1 class="exhibit-detail-title">{{ exhibit.title }}</h1>
        <span class="expertise-badge badge-aware exhibit-type-badge">Investigation Report</span>
      </div>
    </section>

    <section class="exhibit-detail-body">
      <div class="container">

        <div v-if="exhibit.quotes?.length" class="exhibit-quotes">
          <blockquote v-for="(q, i) in exhibit.quotes" :key="i" class="exhibit-quote">
            <p>{{ q.text }}</p>
            <footer class="attribution">
              <span v-if="q.attribution">{{ q.attribution }}</span>
              <span v-if="q.role" class="role">{{ q.role }}</span>
            </footer>
          </blockquote>
        </div>

        <template v-if="exhibit.sections?.length">
          <div v-for="(section, i) in exhibit.sections" :key="i" class="exhibit-section">
            <h2 v-if="section.heading">{{ section.heading }}</h2>
            <p v-if="section.type === 'text' && section.body">{{ section.body }}</p>
            <table v-if="section.type === 'table' && section.rows?.length" class="exhibit-table">
              <thead v-if="section.columns?.length">
                <tr>
                  <th v-for="col in section.columns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in section.rows" :key="ri">
                  <td v-for="(cell, ci) in row" :key="ci" :data-label="section.columns?.[ci]">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <div v-else-if="exhibit.contextText" class="exhibit-context">
          <h2 v-if="exhibit.contextHeading">{{ exhibit.contextHeading }}</h2>
          <p>{{ exhibit.contextText }}</p>
        </div>

        <div v-if="exhibit.resolutionTable?.length" class="exhibit-resolution">
          <h2>Resolution</h2>
          <table class="resolution-table">
            <thead>
              <tr><th>Issue</th><th>Resolution</th></tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in exhibit.resolutionTable" :key="i">
                <td data-label="Issue">{{ row.issue }}</td>
                <td data-label="Resolution">{{ row.resolution }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="exhibit-impact-tags">
          <h2>Skills &amp; Technologies</h2>
          <TechTags :tags="exhibit.impactTags" />
        </div>

      </div>
    </section>
  </div>
</template>
