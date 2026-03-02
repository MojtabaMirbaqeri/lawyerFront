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
        <div class="map-loading-pulse" />
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
              :class="['province-chip', { 'province-chip-highlight': highlightedProvince?.id === p.id }]"
              @mouseenter="highlightedProvince = p"
              @mouseleave="highlightedProvince = null"
            >
              <span class="province-chip-name">{{ p.name }}</span>
              <span class="province-chip-count">{{ p.active_lawyer_count }} وکیل</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Desktop: list (left) + map (right). Mobile: list only above, map full width below -->
        <div class="map-and-list">
          <div class="province-list-desktop">
            <input
              v-model="provinceSearch"
              type="text"
              class="province-search-input"
              placeholder="جستجوی نام استان..."
            />
            <div class="province-list-scroll">
              <NuxtLink
                v-for="p in filteredProvinces"
                :key="p.id"
                :to="resolveProvinceLawyersRoute(p)"
                :class="['province-list-item', { 'province-list-item-highlight': highlightedProvince?.id === p.id }]"
                @mouseenter="highlightedProvince = p"
                @mouseleave="highlightedProvince = null"
              >
                <span class="province-list-name">{{ p.name }}</span>
                <span class="province-list-count">{{ p.active_lawyer_count }} وکیل</span>
              </NuxtLink>
            </div>
          </div>
          <div class="map-box">
            <MapsIranProvincesMap
              :provinces-with-counts="provincesWithCounts"
              :highlighted-province="highlightedProvince"
              @select="onProvinceSelect"
              @update:highlighted-province="highlightedProvince = $event"
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
const highlightedProvince = ref<ProvinceWithCount | null>(null)

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
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.section-header {
  @apply text-center mb-8 lg:mb-10;
}

.section-subtitle {
  @apply text-gray-600 text-base lg:text-lg mt-2;
}

.map-loading {
  @apply flex flex-col items-center justify-center gap-4 py-20 text-gray-500;
}

.map-loading-pulse {
  @apply w-14 h-14 rounded-full bg-blue-100;
  animation: loading-dot 1.2s ease-in-out infinite;
}

@keyframes loading-dot {
  0%, 100% { opacity: 0.5; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

.province-search-input {
  @apply w-full rounded-xl border border-gray-200 px-4 py-3 mb-3 text-gray-800 placeholder-gray-400 transition-colors;
  @apply focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none;
}

.province-chips {
  @apply flex flex-wrap gap-2 max-h-64 overflow-y-auto;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #e2e8f0;
}

.province-chips::-webkit-scrollbar {
  width: 8px;
}

.province-chips::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.province-chips::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.province-chips::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.province-chip {
  @apply inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm no-underline transition-all duration-200 shadow-sm;
  @apply hover:border-blue-300 hover:bg-blue-50 hover:shadow-md;
}

.province-chip-highlight {
  @apply border-blue-300 bg-blue-50 shadow-md;
}

.province-chip-name {
  @apply font-medium text-gray-800;
}

.province-chip-count {
  @apply text-gray-500 text-xs;
}

.map-and-list {
  @apply flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch;
}

/* RTL: map right, list left — swap order so map is first (right) */
[dir="rtl"] .map-and-list .map-box { order: 1; }
[dir="rtl"] .map-and-list .province-list-desktop { order: 2; }

.province-list-desktop {
  @apply hidden lg:flex flex-col w-full lg:w-1/2 lg:min-w-0;
}

.province-list-desktop .province-search-input {
  @apply mb-3;
}

.province-list-scroll {
  @apply grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 overflow-y-auto min-h-0 max-h-[28rem];
  scrollbar-gutter: stable;
}

/* Custom scrollbar for province list */
.province-list-scroll {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #e2e8f0;
}

.province-list-scroll::-webkit-scrollbar {
  width: 8px;
}

.province-list-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.province-list-scroll::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

.province-list-scroll::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.province-list-item {
  @apply flex flex-col rounded-xl border border-gray-200 bg-white px-2.5 py-2 text-center text-sm no-underline transition-all duration-200;
  @apply hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5;
}

.province-list-item-highlight {
  @apply border-blue-300 bg-blue-50 shadow-md -translate-y-0.5;
}

.province-list-name {
  @apply font-medium text-gray-800 break-words leading-snug;
}

.province-list-count {
  @apply text-gray-500 text-xs mt-0.5;
}

.map-box {
  @apply w-full overflow-hidden lg:w-1/2 lg:min-w-0;
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
