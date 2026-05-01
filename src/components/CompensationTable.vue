<script setup lang="ts">
import { compensation } from '@/content/sections/compensation'
</script>

<template>
  <section class="compensation">
    <div class="container">
      <h2>{{ compensation.heading }}</h2>

      <div class="compensation-table-wrapper">
        <table class="compensation-table">
          <caption class="sr-only">{{ compensation.caption }}</caption>
          <tbody>
            <tr v-for="row in compensation.rows" :key="row.term">
              <th scope="row">{{ row.term }}</th>
              <td>{{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
