<script setup lang="ts">
import { computed } from 'vue'
import type { ExhibitFindingEntry } from '@/data/exhibits'

const props = defineProps<{
  findings: ExhibitFindingEntry[]
  heading?: string
}>()

const displayHeading = computed(() => props.heading ?? 'Findings')

const columnPattern = computed(() => {
  if (props.findings.some(f => f.severity)) return 'severity'
  if (props.findings.some(f => f.background)) return 'background'
  return 'default'
})
</script>

<template>
  <section class="findings-table-section">
    <h3 class="findings-table-heading">{{ displayHeading }}</h3>

    <!-- Desktop: semantic table -->
    <table class="findings-table-desktop">
      <thead>
        <tr>
          <th>Finding</th>
          <template v-if="columnPattern === 'severity'">
            <th>Description</th>
            <th>Severity</th>
          </template>
          <template v-else-if="columnPattern === 'background'">
            <th>Background</th>
            <th>Resolution</th>
          </template>
          <template v-else>
            <th>Description</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, i) in findings" :key="i">
          <td>{{ entry.finding }}</td>
          <template v-if="columnPattern === 'severity'">
            <td>{{ entry.description }}</td>
            <td>
              <span
                v-if="entry.severity"
                :class="['findings-table-badge', 'findings-table-badge--' + entry.severity.toLowerCase()]"
              >{{ entry.severity }}</span>
            </td>
          </template>
          <template v-else-if="columnPattern === 'background'">
            <td>{{ entry.background }}</td>
            <td>{{ entry.resolution }}</td>
          </template>
          <template v-else>
            <td>{{ entry.description }}</td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- Mobile: stacked cards -->
    <div class="findings-table-mobile">
      <div v-for="(entry, i) in findings" :key="i" class="findings-table-card">
        <div class="findings-table-field">
          <span class="findings-table-label">Finding</span>
          <span class="findings-table-value">{{ entry.finding }}</span>
        </div>

        <template v-if="columnPattern === 'severity'">
          <div class="findings-table-field">
            <span class="findings-table-label">Description</span>
            <span class="findings-table-value">{{ entry.description }}</span>
          </div>
          <div v-if="entry.severity" class="findings-table-field">
            <span class="findings-table-label">Severity</span>
            <span class="findings-table-value">
              <span
                :class="['findings-table-badge', 'findings-table-badge--' + entry.severity.toLowerCase()]"
              >{{ entry.severity }}</span>
            </span>
          </div>
        </template>

        <template v-else-if="columnPattern === 'background'">
          <div class="findings-table-field">
            <span class="findings-table-label">Background</span>
            <span class="findings-table-value">{{ entry.background }}</span>
          </div>
          <div class="findings-table-field">
            <span class="findings-table-label">Resolution</span>
            <span class="findings-table-value">{{ entry.resolution }}</span>
          </div>
        </template>

        <template v-else>
          <div class="findings-table-field">
            <span class="findings-table-label">Description</span>
            <span class="findings-table-value">{{ entry.description }}</span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
