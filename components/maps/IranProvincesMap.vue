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
        در حال بارگذاری نقشه...
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
}>()

const emit = defineEmits<{
  select: [province: ProvinceWithCount]
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
  mapWrapperRef.value?.querySelectorAll('.province-hover').forEach((el) => el.classList.remove('province-hover'))
  const target = (e.target as HTMLElement)?.closest?.('path')
  if (!target?.id) {
    hoveredProvince.value = null
    return
  }
  const province = getProvinceFromPath(target.id)
  hoveredProvince.value = province ?? null
  if (province) target.classList.add('province-hover')
}

function onMapMouseLeave(e: MouseEvent) {
  const wrapper = mapWrapperRef.value
  const related = e.relatedTarget as Node | null
  if (wrapper && related && !wrapper.contains(related)) {
    hoveredProvince.value = null
    wrapper.querySelectorAll('.province-hover').forEach((el) => el.classList.remove('province-hover'))
  }
}

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
  @apply w-full max-w-4xl mx-auto;
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
  @apply flex items-center justify-center py-24 text-gray-500;
}

.map-tooltip-fixed {
  @apply fixed z-50 pointer-events-none;
}
</style>
