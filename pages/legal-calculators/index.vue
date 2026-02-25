<template>
  <main class="legal-calculators-page">
    <div class="container py-10">
      <header class="page-header mb-10">
        <h1 class="page-title">ماشین‌حساب‌های حقوقی</h1>
        <p class="page-desc">
          با استفاده از ابزارهای زیر می‌توانید برآورد اولیه از دیه، مهریه، ارث، حق الثبت و سایر موارد حقوقی داشته باشید.
          نتایج صرفاً جنبه اطلاع‌رسانی دارند و برای تصمیم نهایی مشاوره با وکیل توصیه می‌شود.
        </p>
      </header>
      <div v-if="pending" class="flex justify-center py-12">
        <span class="text-gray-500">در حال بارگذاری...</span>
      </div>
      <div v-else class="calculators-grid">
        <LegalCalculatorsCalculatorCard
          v-for="item in calculators"
          :key="item.slug"
          :item="item"
        />
      </div>
      <section class="mt-16">
        <LandingCtaSection />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { CalculatorListItem } from '~/composables/useLegalCalculators'

useSeoMeta({
  title: 'ماشین‌حساب‌های حقوقی | وکیل وکیل',
  description: 'محاسبه دیه، مهریه، ارث، حق الثبت و سایر موارد حقوقی. نتایج اطلاع‌رسانی؛ برای تصمیم نهایی با وکیل مشورت کنید.',
})

const { fetchCalculators } = useLegalCalculators()
const calculators = ref<CalculatorListItem[]>([])
const pending = ref(true)

onMounted(async () => {
  pending.value = true
  const res = await fetchCalculators()
  calculators.value = res.data ?? []
  pending.value = false
})
</script>

<style scoped>
@reference "tailwindcss";

.legal-calculators-page {
  @apply min-h-screen bg-gray-50;
}
.page-header {
  @apply text-center max-w-2xl mx-auto;
}
.page-title {
  @apply text-3xl font-bold text-gray-900 mb-4;
}
.page-desc {
  @apply text-gray-600;
}
.calculators-grid {
  @apply grid gap-6 sm:grid-cols-2 lg:grid-cols-3;
}
</style>
