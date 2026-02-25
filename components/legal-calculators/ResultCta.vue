<template>
  <div class="result-cta">
    <h4 class="result-cta-title">{{ ctaTitle }}</h4>
    <p class="result-cta-desc">برای دریافت مشاوره تخصصی با وکیل همین الان اقدام کنید.</p>
    <div class="result-cta-buttons">
      <NuxtLink :to="ctaUrl" class="btn-cta btn-cta-primary" @click="track('book')">
        رزرو وقت مشاوره
      </NuxtLink>
      <NuxtLink to="/lawyers" class="btn-cta btn-cta-secondary" @click="track('lawyers')">
        مشاهده وکلای متخصص
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  slug: string
  ctaTitle?: string
  ctaUrl?: string
}>()

const { trackConversion } = useLegalCalculators()

const ctaTitle = computed(() => props.ctaTitle || 'نیاز به مشاوره حقوقی دارید؟')
const ctaUrl = computed(() => props.ctaUrl || '/lawyers')

function track(type: string) {
  trackConversion(props.slug, { cta_type: type })
}
</script>

<style scoped>
@reference "tailwindcss";

.result-cta {
  @apply mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-6;
}
.result-cta-title {
  @apply text-lg font-semibold text-gray-900 mb-1;
}
.result-cta-desc {
  @apply text-sm text-gray-600 mb-4;
}
.result-cta-buttons {
  @apply flex flex-wrap gap-3;
}
.btn-cta {
  @apply inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors;
}
.btn-cta-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
.btn-cta-secondary {
  @apply border border-blue-600 text-blue-600 hover:bg-blue-50;
}
</style>
