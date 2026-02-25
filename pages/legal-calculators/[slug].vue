<template>
  <main class="legal-calculator-single">
    <div class="container py-8">
      <div v-if="error" class="rounded-lg bg-red-50 p-4 text-red-700">
        {{ error }}
      </div>
      <template v-else-if="detail">
        <header class="mb-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ detail.metadata?.title }}</h1>
              <p v-if="detail.metadata?.short_description" class="mt-2 text-gray-600">
                {{ detail.metadata.short_description }}
              </p>
            </div>
            <button
              v-if="slug === 'blood-money'"
              type="button"
              class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              @click="showDiyahHelp = true"
            >
              <Icon name="lucide:help-circle" class="w-5 h-5" />
              راهنمای محاسبه دیه
            </button>
          </div>
        </header>

        <Teleport v-if="slug === 'blood-money'" to="body">
          <Transition name="diyah-help-fade">
            <div
              v-if="showDiyahHelp"
              class="diyah-help-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="diyah-help-title"
              @click.self="showDiyahHelp = false"
            >
              <div class="diyah-help-modal">
                <div class="diyah-help-header">
                  <h2 id="diyah-help-title" class="diyah-help-title">
                    <Icon name="lucide:book-open" class="w-5 h-5" />
                    راهنمای محاسبه دیه
                  </h2>
                  <button
                    type="button"
                    class="diyah-help-close"
                    aria-label="بستن"
                    @click="showDiyahHelp = false"
                  >
                    <Icon name="lucide:x" class="w-5 h-5" />
                  </button>
                </div>
                <div class="diyah-help-body">
                  <p class="diyah-help-intro">
                    با وارد کردن سال و نوع جنایت و جنسیت مقتول می‌توانید دیه را به‌صورت آنلاین برآورد کنید. توضیح فیلدها:
                  </p>
                  <ul class="diyah-help-list">
                    <li><strong>سال:</strong> سال مقررات دیه را انتخاب کنید (مثلاً ۱۴۰۴). مبلغ و ضرایب بر اساس مقررات همان سال محاسبه می‌شود.</li>
                    <li><strong>نوع جنایت:</strong> نوع حادثه را انتخاب کنید — درصدی، قتل نفس، جنین، اعضای بدن یا جنابت بر میت. هر نوع طبق مقررات ضریب خاص خود را دارد.</li>
                    <li><strong>جنسیت مقتول:</strong> جنسیت مقتول (مرد یا زن) را انتخاب کنید؛ در برخی موارد مبلغ دیه بر اساس جنسیت متفاوت است.</li>
                    <li><strong>محاسبه دیه در ماه حرام:</strong> در صورت وقوع جنایت در ماه حرام، با فعال کردن این گزینه ضریب ماه حرام اعمال می‌شود.</li>
                  </ul>
                  <p class="diyah-help-note">
                    نتیجهٔ محاسبه صرفاً جنبه اطلاع‌رسانی دارد و برای تعیین مبلغ قطعی حتماً با وکیل یا کارشناس حقوقی مشورت کنید.
                  </p>
                </div>
                <div class="diyah-help-footer">
                  <button type="button" class="diyah-help-btn" @click="showDiyahHelp = false">
                    متوجه شدم
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
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
const showDiyahHelp = ref(false)

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

.diyah-help-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4;
}

.diyah-help-modal {
  @apply my-8 w-full max-w-lg rounded-xl bg-white shadow-xl;
}

.diyah-help-header {
  @apply flex items-center justify-between border-b border-gray-200 px-6 py-4;
}

.diyah-help-title {
  @apply flex items-center gap-2 text-lg font-bold text-gray-900;
}

.diyah-help-close {
  @apply rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700;
}

.diyah-help-body {
  @apply px-6 py-4;
}

.diyah-help-intro {
  @apply mb-4 text-sm text-gray-600;
}

.diyah-help-list {
  @apply list-inside list-disc space-y-2 text-sm text-gray-600;
}

.diyah-help-note {
  @apply mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800;
}

.diyah-help-footer {
  @apply border-t border-gray-200 px-6 py-4;
}

.diyah-help-btn {
  @apply rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700;
}

.diyah-help-fade-enter-active,
.diyah-help-fade-leave-active {
  transition: opacity 0.2s ease;
}

.diyah-help-fade-enter-from,
.diyah-help-fade-leave-to {
  opacity: 0;
}
</style>
