<template>
  <div
    v-if="province"
    class="province-map-tooltip"
    role="tooltip"
  >
    <p class="font-semibold text-gray-900">{{ province.name }}</p>
    <p class="text-sm text-gray-600">
      {{ province.active_lawyer_count }} وکیل فعال
    </p>
    <p class="text-xs text-blue-600 mt-1">
      مشاهده وکلای فعال این استان
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProvinceWithCount } from '~/composables/useProvinceMapData'

defineProps<{
  province: ProvinceWithCount | null
}>()
</script>

<style scoped>
@reference "tailwindcss";

@keyframes province-tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.province-map-tooltip {
  @apply pointer-events-none rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg;
  animation: province-tooltip-in 0.15s ease-out;
}
</style>
