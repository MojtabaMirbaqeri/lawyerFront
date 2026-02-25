<template>
  <main class="legal-calculator-single">
    <div class="container py-8">
      <div v-if="error" class="rounded-lg bg-red-50 p-4 text-red-700">
        {{ error }}
      </div>
      <template v-else-if="detail">
        <header class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">{{ detail.metadata?.title }}</h1>
          <p v-if="detail.metadata?.short_description" class="mt-2 text-gray-600">
            {{ detail.metadata.short_description }}
          </p>
        </header>
        <div class="grid gap-8 lg:grid-cols-2">
          <div class="form-panel rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 class="mb-4 text-lg font-semibold">ورودی‌ها</h2>
            <LegalCalculatorsCalculatorForm
              :schema="detail.form_schema"
              :pending="calcPending"
              @submit="onCalculate"
            />
          </div>
          <div class="result-panel">
            <div v-if="result" class="result-box">
              <LegalCalculatorsResultRenderer :result="result" />
              <LegalCalculatorsResultCta
                :slug="slug"
                :cta-title="result.cta?.title"
                :cta-url="result.cta?.url"
              />
            </div>
            <p v-else class="text-gray-500">پس از پر کردن فرم و زدن دکمه محاسبه، نتیجه اینجا نمایش داده می‌شود.</p>
          </div>
        </div>
      </template>
      <div v-else-if="pending" class="flex justify-center py-12">
        <span class="text-gray-500">در حال بارگذاری...</span>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { CalculatorDetail, CalculatorResult } from '~/composables/useLegalCalculators'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { fetchCalculatorBySlug, calculate } = useLegalCalculators()
const detail = ref<CalculatorDetail | null>(null)
const result = ref<CalculatorResult | null>(null)
const pending = ref(true)
const calcPending = ref(false)
const error = ref<string | null>(null)

async function loadDetail() {
  pending.value = true
  error.value = null
  const res = await fetchCalculatorBySlug(slug.value)
  if (res.data) {
    detail.value = res.data
    useSeoMeta({
      title: (res.data.metadata?.meta_title as string) || (res.data.metadata?.title as string) || 'ماشین‌حساب حقوقی',
      description: (res.data.metadata?.meta_description as string) || (res.data.metadata?.short_description as string) || '',
    })
  } else {
    error.value = 'ماشین‌حساب یافت نشد.'
  }
  pending.value = false
}

async function onCalculate(payload: Record<string, unknown>) {
  if (!slug.value) return
  calcPending.value = true
  result.value = null
  const res = await calculate(slug.value, payload)
  if (res.data) result.value = res.data
  calcPending.value = false
}

watch(slug, loadDetail, { immediate: true })
</script>

<style scoped>
@reference "tailwindcss";

.legal-calculator-single {
  @apply min-h-screen bg-gray-50;
}
.result-box {
  @apply space-y-4;
}
</style>
