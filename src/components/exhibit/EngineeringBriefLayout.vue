<script setup lang="ts">
import type { Exhibit, ExhibitSection } from '@/data/exhibits'
import TechTags from '@/components/TechTags.vue'

defineProps<{ exhibit: Exhibit }>()

function sectionHasContent(section: ExhibitSection): boolean {
  switch (section.type) {
    case 'text': return !!section.body
    case 'table': return !!(section.rows?.length)
    case 'timeline': return !!(section.entries?.length)
    case 'metadata': return !!(section.items?.length)
    case 'flow': return !!(section.steps?.length)
    default: return false
  }
}
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
        <span class="expertise-badge badge-deep exhibit-type-badge">Engineering Brief</span>
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

        <div v-if="exhibit.personnel?.length" class="exhibit-section">
          <h2>Personnel</h2>
          <table class="exhibit-table">
            <thead>
              <tr>
                <template v-if="exhibit.personnel[0].involvement">
                  <th>Role</th>
                  <th>Involvement</th>
                </template>
                <template v-else>
                  <th>Name</th>
                  <th>Title</th>
                  <th>{{ exhibit.personnel[0].organization !== undefined ? 'Organization' : 'Role' }}</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, pi) in exhibit.personnel" :key="pi">
                <template v-if="p.involvement">
                  <td data-label="Role">{{ p.role }}</td>
                  <td data-label="Involvement">{{ p.involvement }}</td>
                </template>
                <template v-else>
                  <td data-label="Name">{{ p.name }}</td>
                  <td data-label="Title">{{ p.title }}</td>
                  <td :data-label="p.organization !== undefined ? 'Organization' : 'Role'">{{ p.organization ?? p.role }}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>

        <template v-if="exhibit.sections?.length">
          <template v-for="(section, i) in exhibit.sections" :key="i">
            <div v-if="sectionHasContent(section)" class="exhibit-section">
              <h2 v-if="section.heading">{{ section.heading }}</h2>
              <p v-if="section.type === 'text' && section.body">{{ section.body }}</p>
              <table v-else-if="section.type === 'table' && section.rows?.length" class="exhibit-table">
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
              <div v-else-if="section.type === 'timeline'" class="exhibit-timeline">
                <p v-if="section.body">{{ section.body }}</p>
                <div v-for="(entry, ei) in section.entries" :key="ei" class="timeline-entry">
                  <span class="timeline-marker"></span>
                  <span class="timeline-date">{{ entry.date }}</span>
                  <h3 v-if="entry.heading" class="timeline-heading">{{ entry.heading }}</h3>
                  <p v-if="entry.body" class="timeline-body">{{ entry.body }}</p>
                  <blockquote v-if="entry.quote" class="timeline-quote">
                    <p>{{ entry.quote }}</p>
                    <footer v-if="entry.quoteAttribution">{{ entry.quoteAttribution }}</footer>
                  </blockquote>
                </div>
              </div>
              <dl v-else-if="section.type === 'metadata'" class="exhibit-metadata">
                <div v-for="(item, mi) in section.items" :key="mi" class="metadata-card">
                  <dt>{{ item.label }}</dt>
                  <dd>{{ item.value }}</dd>
                </div>
              </dl>
              <div v-else-if="section.type === 'flow'">
                <p v-if="section.body">{{ section.body }}</p>
                <div class="exhibit-flow" style="display:flex;flex-wrap:wrap;align-items:center;">
                  <template v-for="(step, si) in section.steps" :key="si">
                    <div v-if="si > 0" class="flow-arrow"></div>
                    <div class="flow-step">
                      <div class="flow-node">
                        <span class="flow-label">{{ step.label }}</span>
                        <span class="flow-detail">{{ step.detail }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
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
