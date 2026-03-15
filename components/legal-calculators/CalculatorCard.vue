<template>
  <NuxtLink
    :to="`/legal-calculators/${item.slug}`"
    class="legal-calc-card"
  >
    <div class="legal-calc-card-inner">
      <div class="legal-calc-card-icon" :data-theme="cardTheme">
        <Icon :name="cardIcon" class="size-8" />
      </div>
      <div class="legal-calc-card-content">
        <h3 class="legal-calc-card-title">{{ item.title }}</h3>
        <p v-if="item.short_description" class="legal-calc-card-desc">{{ item.short_description }}</p>
        <span class="legal-calc-card-link">محاسبه <Icon name="lucide:arrow-left" class="size-4" /></span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CalculatorListItem } from '~/composables/useLegalCalculators'

const props = defineProps<{ item: CalculatorListItem }>()

/** آیکون یکتا برای هر ماشین‌حساب — همیشه از این نقشه استفاده می‌شود تا همه متمایز باشند */
const SLUG_ICON_MAP: Record<string, string> = {
  'blood-money': 'lucide:hand-coins',
  dowry: 'lucide:gem',
  'delay-damages': 'lucide:calendar-clock',
  inheritance: 'lucide:landmark',
  'registration-fee': 'lucide:stamp',
}

/** آیکون‌های متنوع برای slugهای ناشناخته (هر کدام متفاوت) */
const FALLBACK_ICONS = [
  'lucide:calculator',
  'lucide:scale',
  'lucide:file-text',
  'lucide:banknote',
  'lucide:briefcase',
  'lucide:gavel',
  'lucide:scroll-text',
  'lucide:clipboard-list',
  'lucide:pie-chart',
  'lucide:circle-dollar-sign',
] as const

function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = ((h << 5) - h + slug.charCodeAt(i)) | 0
  return Math.abs(h)
}

const cardIcon = computed(() => {
  const slug = props.item.slug
  const fromMap = SLUG_ICON_MAP[slug]
  if (fromMap) return fromMap
  const index = hashSlug(slug) % FALLBACK_ICONS.length
  return FALLBACK_ICONS[index]
})

/** تم رنگی کارت (هماهنگ با صفحهٔ هر ماشین‌حساب) */
const SLUG_THEME_MAP: Record<string, string> = {
  dowry: 'red',
  'delay-damages': 'amber',
  'blood-money': 'blue',
  inheritance: 'emerald',
  'registration-fee': 'violet',
}

const cardTheme = computed(() => SLUG_THEME_MAP[props.item.slug] ?? 'blue')
</script>

<style scoped>
@reference "tailwindcss";

.legal-calc-card {
  @apply block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-300 hover:shadow-md;
}
.legal-calc-card-inner {
  @apply flex gap-4;
}
.legal-calc-card-icon {
  @apply flex size-14 shrink-0 items-center justify-center rounded-xl;
}
.legal-calc-card-icon[data-theme="red"] {
  @apply bg-red-50 text-red-600;
}
.legal-calc-card-icon[data-theme="amber"] {
  @apply bg-amber-50 text-amber-600;
}
.legal-calc-card-icon[data-theme="blue"] {
  @apply bg-blue-50 text-blue-600;
}
.legal-calc-card-icon[data-theme="emerald"] {
  @apply bg-emerald-50 text-emerald-600;
}
.legal-calc-card-icon[data-theme="violet"] {
  @apply bg-violet-50 text-violet-600;
}
.legal-calc-card-content {
  @apply min-w-0 flex flex-col gap-1;
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
