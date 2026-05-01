<script setup lang="ts">
import { exhibits } from '@/data/exhibits'

const rows = exhibits.flatMap(e =>
  (e.personnel || []).map(p => ({
    exhibit: e.label.replace('Exhibit ', ''),
    entryType: p.entryType || '—',
    name: p.name || '',
    title: p.title || '',
    role: p.role || '',
    organization: p.organization || '',
  }))
)
</script>

<template>
  <div class="diag-page">
    <h1>Personnel Diagnostic ({{ rows.length }} entries)</h1>

    <!-- Desktop: table -->
    <table class="diag-table">
      <thead>
        <tr>
          <th>Ex</th>
          <th>Type</th>
          <th>Name</th>
          <th>Title</th>
          <th>Role</th>
          <th>Organization</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in rows" :key="i" :class="'diag-entry-' + r.entryType">
          <td>{{ r.exhibit }}</td>
          <td>{{ r.entryType }}</td>
          <td>{{ r.name || '—' }}</td>
          <td>{{ r.title || '—' }}</td>
          <td>{{ r.role || '—' }}</td>
          <td>{{ r.organization || '—' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Mobile: cards -->
    <div class="diag-cards">
      <div v-for="(r, i) in rows" :key="i" :class="['diag-card', 'diag-entry-' + r.entryType]">
        <div class="diag-card-header">
          <span class="diag-card-exhibit">{{ r.exhibit }}</span>
          <span class="diag-card-type">{{ r.entryType }}</span>
        </div>
        <div class="diag-card-heading">{{ r.name || r.title || r.role || '—' }}</div>
        <div v-if="r.name && r.title" class="diag-card-field"><span class="diag-label">Title</span> {{ r.title }}</div>
        <div v-if="!r.name && r.role" class="diag-card-field"><span class="diag-label">Role</span> {{ r.role }}</div>
        <div v-if="r.name && r.role" class="diag-card-field"><span class="diag-label">Role</span> {{ r.role }}</div>
        <div v-if="r.organization" class="diag-card-field"><span class="diag-label">Org</span> {{ r.organization }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diag-page {
  padding: 1.5rem;
  font-family: monospace;
  font-size: 13px;
}
h1 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Desktop table */
.diag-table {
  border-collapse: collapse;
  width: 100%;
}
.diag-table thead tr {
  background: #333;
  color: #fff;
  text-align: left;
}
.diag-table th, .diag-table td {
  padding: 3px 8px;
  border-bottom: 1px solid #ddd;
}
.diag-table .diag-entry-group {
  background: #fff3cd;
  opacity: 0.8;
}
.diag-table .diag-entry-anonymized {
  background: #f0f0f0;
  font-style: italic;
}

/* Mobile cards — hidden on desktop */
.diag-cards {
  display: none;
}

.diag-card {
  border-left: 4px solid #666;
  background: #fafafa;
  margin-bottom: 0.75rem;
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
}
.diag-card.diag-entry-group {
  border-left-style: dashed;
  border-left-color: #c90;
  background: #fffbe6;
  opacity: 0.8;
}
.diag-card.diag-entry-anonymized {
  font-style: italic;
  background: #f4f4f4;
  border-left-color: #aaa;
}
.diag-card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}
.diag-card-exhibit {
  font-weight: bold;
  font-size: 0.85rem;
}
.diag-card-type {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
}
.diag-card-heading {
  font-weight: bold;
  font-size: 1rem;
  font-family: sans-serif;
  margin-bottom: 0.3rem;
}
.diag-card-field {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.15rem;
}
.diag-label {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: #999;
  margin-right: 0.4rem;
}

@media (max-width: 768px) {
  .diag-table {
    display: none;
  }
  .diag-cards {
    display: block;
  }
}
</style>
