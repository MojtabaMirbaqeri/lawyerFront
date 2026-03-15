<template>
  <main class="legal-calculators-page">
    <PageHero
      title="ماشین‌حساب‌های حقوقی"
      subtitle="برآورد اولیه دیه، مهریه، ارث، حق‌الثبت و سایر موارد حقوقی. نتایج جنبه اطلاع‌رسانی دارند؛ برای تصمیم نهایی مشاوره با وکیل توصیه می‌شود."
    />

    <div class="content-section">
      <div>
        <div v-if="pending" class="loading-state">
          <Icon name="lucide:loader-2" class="size-8 animate-spin text-gray-400" />
          <p class="mt-3 text-sm text-gray-500">در حال بارگذاری ابزارها...</p>
        </div>

        <div v-else-if="!calculators.length" class="empty-state">
          <Icon name="lucide:calculator" class="size-14 text-gray-300" />
          <h2 class="mt-4 text-lg font-semibold text-gray-700">ماشین‌حسابی یافت نشد</h2>
          <p class="mt-2 text-sm text-gray-500">به زودی ابزارهای محاسبه در دسترس قرار می‌گیرند.</p>
        </div>

        <template v-else>
          <div class="section-head">
            <h2 class="section-title">انتخاب ابزار محاسبه</h2>
            <p class="section-desc">یکی از ابزارهای زیر را انتخاب کنید و با وارد کردن اطلاعات، برآورد اولیه را مشاهده کنید.</p>
          </div>
          <div class="calculators-grid container">
            <LegalCalculatorsCalculatorCard
              v-for="item in calculators"
              :key="item.slug"
              :item="item"
            />
          </div>
        </template>

        <section class="cta-section">
          <LandingCtaSection />
        </section>
      </div>
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

.content-section {
  @apply py-10 lg:py-14;
}

.loading-state,
.empty-state {
  @apply flex flex-col items-center justify-center py-20 text-center;
}

.section-head {
  @apply mb-8 lg:mb-10 justify-items-center;
}

.section-title {
  @apply text-xl font-bold text-gray-900 lg:text-2xl;
}

.section-desc {
  @apply mt-2 text-gray-600 max-w-2xl;
}

.calculators-grid {
  @apply grid gap-6 sm:grid-cols-2 lg:grid-cols-3;
}

.cta-section {
  @apply mt-16 lg:mt-20 pt-8 border-t border-gray-200;
}
</style>
