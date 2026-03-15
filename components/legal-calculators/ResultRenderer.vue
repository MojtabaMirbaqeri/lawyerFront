<template>
  <div class="result-renderer">
    <div class="result-summary">{{ result.summary }}</div>
    <template v-if="result.result_type === 'amount' && result.primary_value != null">
      <div class="result-primary">
        <span class="result-value">{{ formatNumber(result.primary_value) }}</span>
        <span v-if="result.currency" class="result-currency">{{ result.currency === 'IRR' ? 'ریال' : result.currency }}</span>
      </div>
    </template>
    <template v-else-if="result.result_type === 'date' && result.primary_value">
      <div class="result-primary result-date">{{ result.primary_value }}</div>
    </template>
    <div v-if="result.breakdown?.length" class="result-breakdown">
      <h4 class="result-section-title">جزئیات</h4>
      <ul class="breakdown-list">
        <li v-for="(row, i) in result.breakdown" :key="i" class="breakdown-row">
          <span class="breakdown-label">{{ row.label }}</span>
          <span class="breakdown-value">{{ typeof row.value === 'number' ? formatNumber(row.value) : row.value }}</span>
        </li>
      </ul>
    </div>
    <div v-if="result.table?.length" class="result-table-wrap">
      <h4 class="result-section-title">جدول سهم‌الوراثه</h4>
      <div class="overflow-x-auto">
        <table class="result-table">
          <thead>
            <tr>
              <th v-for="key in tableKeys" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in result.table" :key="ri">
              <td v-for="key in tableKeys" :key="key">{{ row[key] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="result.explanation?.length" class="result-explanation">
      <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
        <li v-for="(line, i) in result.explanation" :key="i">{{ line }}</li>
      </ul>
    </div>
    <div v-if="result.warnings?.length" class="result-warnings">
      <p v-for="(w, i) in result.warnings" :key="i" class="warning-item">{{ w }}</p>
    </div>
    <div v-if="result.disclaimer" class="result-disclaimer">
      {{ result.disclaimer }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalculatorResult } from '~/composables/useLegalCalculators'

const props = defineProps<{ result: CalculatorResult }>()

const tableKeys = computed(() => {
  const t = props.result.table
  if (!t?.length) return []
  return Object.keys(t[0])
})

function formatNumber(n: unknown): string {
  if (typeof n !== 'number') return String(n)
  return new Intl.NumberFormat('fa-IR').format(n)
}
</script>

<style scoped>
@reference "tailwindcss";

.result-renderer {
  @apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}
.result-summary {
  @apply text-lg font-medium text-gray-800 mb-4;
}
.result-primary {
  @apply text-2xl font-bold text-blue-600 mb-4;
}
.result-currency {
  @apply text-base font-normal text-gray-600 mr-2;
}
.result-date {
  @apply text-xl;
}
.result-section-title {
  @apply text-sm font-semibold text-gray-700 mb-2;
}
.breakdown-list {
  @apply space-y-2;
}
.breakdown-row {
  @apply flex justify-between text-sm;
}
.breakdown-label {
  @apply text-gray-600;
}
.breakdown-value {
  @apply font-medium;
}
.result-table {
  @apply w-full border-collapse text-sm;
}
.result-table th,
.result-table td {
  @apply border border-gray-200 px-3 py-2 text-right;
}
.result-table th {
  @apply bg-gray-50 font-medium;
}
.result-warnings {
  @apply mt-4 rounded-lg bg-amber-50 p-3 text-amber-800 text-sm;
}
.warning-item {
  @apply mb-1 last:mb-0;
}
.result-disclaimer {
  @apply mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3;
}
</style>
