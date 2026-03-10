<template>
  <div class="iran-provinces-map relative">
    <div
      ref="mapWrapperRef"
      class="map-wrapper"
      @click="onMapClick"
      @mouseover="onMapMouseOver"
      @mouseleave="onMapMouseLeave"
      @mousemove="onMapMouseMove"
    >
      <div
        v-if="svgContent"
        class="svg-container"
        dir="ltr"
        v-html="svgContent"
      />
      <div
        v-else
        class="map-placeholder"
      >
        <div class="map-placeholder-pulse" />
        <span class="map-placeholder-text">در حال بارگذاری نقشه...</span>
      </div>
    </div>
    <Teleport to="body">
      <div
        v-if="hoveredProvince"
        class="map-tooltip-fixed"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <MapsProvinceMapTooltip :province="hoveredProvince" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProvinceWithCount } from '~/composables/useProvinceMapData'
import { svgPathIdToEnName } from '~/utils/svgProvinceIdMap'
import { resolveProvinceLawyersRoute } from '~/utils/provinceRouteMap'

const props = defineProps<{
  provincesWithCounts: ProvinceWithCount[]
  highlightedProvince: ProvinceWithCount | null
}>()

const emit = defineEmits<{
  select: [province: ProvinceWithCount]
  'update:highlightedProvince': [value: ProvinceWithCount | null]
}>()

const mapWrapperRef = ref<HTMLElement | null>(null)
const svgContent = ref<string>('')
const hoveredProvince = ref<ProvinceWithCount | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const TOOLTIP_OFFSET = 16

onMounted(async () => {
  try {
    const res = await $fetch<string>('/maps/iran-provinces.svg', { responseType: 'text' })
    svgContent.value = res ?? ''
  } catch {
    svgContent.value = ''
  }
})

function getProvinceFromPath(pathId: string): ProvinceWithCount | undefined {
  const enName = svgPathIdToEnName(pathId)
  if (!enName) return undefined
  return props.provincesWithCounts.find((p) => p.en_name === enName)
}

function onMapClick(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest?.('path')
  if (!target?.id) return
  const province = getProvinceFromPath(target.id)
  if (province) {
    emit('select', province)
    navigateTo(resolveProvinceLawyersRoute(province))
  }
}

function onMapMouseOver(e: MouseEvent) {
  applyMapHighlight(null)
  const target = (e.target as HTMLElement)?.closest?.('path')
  if (!target?.id) {
    hoveredProvince.value = null
    emit('update:highlightedProvince', null)
    return
  }
  const province = getProvinceFromPath(target.id)
  hoveredProvince.value = province ?? null
  if (province) {
    target.classList.add('province-hover')
    emit('update:highlightedProvince', province)
  }
}

function onMapMouseLeave(e: MouseEvent) {
  const wrapper = mapWrapperRef.value
  const related = e.relatedTarget as Node | null
  if (wrapper && related && !wrapper.contains(related)) {
    hoveredProvince.value = null
    emit('update:highlightedProvince', null)
    nextTick(() => applyMapHighlight(props.highlightedProvince ?? null))
  }
}

function applyMapHighlight(province: ProvinceWithCount | null) {
  const wrapper = mapWrapperRef.value
  const provincesG = wrapper?.querySelector('#provinces')
  if (!provincesG) return
  const paths = provincesG.querySelectorAll('path')
  paths.forEach((path) => {
    path.classList.remove('province-hover')
    if (province && getProvinceFromPath(path.id)?.en_name === province.en_name) {
      path.classList.add('province-hover')
    }
  })
}

watch(
  () => [props.highlightedProvince, svgContent.value] as const,
  () => {
    if (!hoveredProvince.value) nextTick(() => applyMapHighlight(props.highlightedProvince ?? null))
  },
  { immediate: true }
)

function onMapMouseMove(e: MouseEvent) {
  if (hoveredProvince.value) {
    tooltipX.value = Math.min(e.clientX + TOOLTIP_OFFSET, window.innerWidth - 220)
    tooltipY.value = Math.min(e.clientY + TOOLTIP_OFFSET, window.innerHeight - 120)
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.iran-provinces-map {
  @apply w-full mx-auto;
}

.map-wrapper {
  @apply relative cursor-pointer overflow-hidden rounded-xl;
}

.svg-container :deep(svg) {
  @apply w-full h-auto block;
  transition: fill 0.2s ease;
}

.svg-container :deep(#provinces path) {
  fill: var(--surface-200, #e5e7eb);
  stroke: var(--surface-400, #9ca3af);
}

.svg-container :deep(#provinces path.province-hover),
.svg-container :deep(#provinces path:hover) {
  fill: var(--primary-200, #bfdbfe);
  stroke: var(--primary-500, #3b82f6);
}

.map-placeholder {
  @apply flex flex-col items-center justify-center gap-3 py-24;
}

.map-placeholder-pulse {
  @apply w-16 h-16 rounded-full bg-blue-100;
  animation: map-pulse 1.2s ease-in-out infinite;
}

.map-placeholder-text {
  @apply text-sm text-gray-500;
}

@keyframes map-pulse {
  0%, 100% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}

.map-tooltip-fixed {
  @apply fixed z-50 pointer-events-none;
}
</style>
