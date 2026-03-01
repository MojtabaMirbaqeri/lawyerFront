<template>
  <section id="provinces-map" class="find-lawyers-by-province">
    <div class="container">
      <div class="section-header">
        <h2 class="sec-header">
          <span class="gradient-text">وکلای فعال</span> بر اساس استان
        </h2>
        <p class="section-subtitle">
          روی نقشه یا لیست استان کلیک کنید تا لیست وکلای آن استان را ببینید
        </p>
      </div>

      <div v-if="pending" class="map-loading">
        <span>در حال بارگذاری...</span>
      </div>

      <template v-else>
        <!-- Mobile: searchable province list -->
        <div class="lg:hidden province-list-mobile mb-6">
          <input
            v-model="provinceSearch"
            type="text"
            class="province-search-input"
            placeholder="جستجوی نام استان..."
          />
          <div class="province-chips">
            <NuxtLink
              v-for="p in filteredProvinces"
              :key="p.id"
              :to="resolveProvinceLawyersRoute(p)"
              class="province-chip"
            >
              <span class="province-chip-name">{{ p.name }}</span>
              <span class="province-chip-count">{{ p.active_lawyer_count }} وکیل</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Map + optional desktop list -->
        <div class="map-and-list">
          <div class="map-box">
            <MapsIranProvincesMap
              :provinces-with-counts="provincesWithCounts"
              @select="onProvinceSelect"
            />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { resolveProvinceLawyersRoute } from '~/utils/provinceRouteMap'
import { useProvinceMapData } from '~/composables/useProvinceMapData'
import type { ProvinceWithCount } from '~/composables/useProvinceMapData'

const { provincesWithCounts, pending } = useProvinceMapData()
const provinceSearch = ref('')

const filteredProvinces = computed(() => {
  const list = provincesWithCounts.value
  const q = (provinceSearch.value ?? '').trim()
  if (!q) return list
  return list.filter((p) => p.name.includes(q))
})

function onProvinceSelect(_province: ProvinceWithCount) {
  // Navigation is handled in IranProvincesMap; optional analytics hook here
}
</script>

<style scoped>
@reference "tailwindcss";

.find-lawyers-by-province {
  @apply py-16 lg:py-10;
}

.section-header {
  @apply text-center mb-8 lg:mb-10;
}

.section-subtitle {
  @apply text-gray-600 text-base lg:text-lg mt-2;
}

.map-loading {
  @apply flex justify-center py-16 text-gray-500;
}

.province-search-input {
  @apply w-full rounded-xl border border-gray-200 px-4 py-3 mb-3 text-gray-800 placeholder-gray-400;
}

.province-chips {
  @apply flex flex-wrap gap-2 max-h-64 overflow-y-auto;
}

.province-chip {
  @apply inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm no-underline transition shadow-sm;
  @apply hover:border-blue-300 hover:bg-blue-50;
}

.province-chip-name {
  @apply font-medium text-gray-800;
}

.province-chip-count {
  @apply text-gray-500 text-xs;
}

.map-and-list {
  @apply flex flex-col lg:flex-row gap-6 items-start;
}

.map-box {
  @apply w-full overflow-hidden;
}
</style>

<style>
@reference "tailwindcss";

.find-lawyers-by-province .gradient-text {
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
