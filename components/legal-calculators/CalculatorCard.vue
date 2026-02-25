<template>
  <NuxtLink
    :to="`/legal-calculators/${item.slug}`"
    class="legal-calc-card"
  >
    <div class="legal-calc-card-inner">
      <div v-if="item.icon" class="legal-calc-card-icon">
        <Icon :name="item.icon" class="size-8" />
      </div>
      <h3 class="legal-calc-card-title">{{ item.title }}</h3>
      <p v-if="item.short_description" class="legal-calc-card-desc">{{ item.short_description }}</p>
      <span class="legal-calc-card-link">محاسبه <Icon name="lucide:arrow-left" class="size-4" /></span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CalculatorListItem } from '~/composables/useLegalCalculators'

defineProps<{ item: CalculatorListItem }>()
</script>

<style scoped>
@reference "tailwindcss";

.legal-calc-card {
  @apply block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md;
}
.legal-calc-card-inner {
  @apply flex flex-col gap-2;
}
.legal-calc-card-icon {
  @apply mb-2 flex size-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600;
}
.legal-calc-card-title {
  @apply text-lg font-semibold text-gray-900;
}
.legal-calc-card-desc {
  @apply text-sm text-gray-600 line-clamp-2;
}
.legal-calc-card-link {
  @apply mt-2 flex items-center gap-1 text-sm font-medium text-blue-600;
}
</style>
