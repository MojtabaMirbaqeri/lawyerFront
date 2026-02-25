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
        <div class="calc-grid">
          <!-- فرم مخصوص مهریه -->
          <div
            v-if="slug === 'dowry'"
            class="dowry-card"
          >
            <div class="dowry-card-header">
              <span class="dowry-card-header-accent" />
              <div>
                <h2 class="dowry-card-title">محاسبه مهریه به نرخ روز</h2>
                <p class="dowry-card-subtitle">آنلاین و بر اساس شاخص بانک مرکزی</p>
              </div>
            </div>
            <div class="dowry-card-body">
              <p class="dowry-instruction">
                سال عقد، سال اخذ مهریه و مبلغ مهریه را وارد کنید. محاسبه طبق <strong>فرمول قوه‌قضاییه</strong> و <strong>شاخص بهای کالاها و خدمات مصرفی</strong> بانک مرکزی انجام می‌شود.
              </p>
              <form class="dowry-form" @submit.prevent="onDowrySubmit">
                <div class="dowry-fields">
                  <div class="dowry-field">
                    <label class="dowry-label">مبلغ مهریه<span class="dowry-hint"> (به تومان)</span>
                    </label>
                    <input
                      v-model.number="dowryForm.original_amount"
                      type="number"
                      min="0"
                      step="1"
                      class="dowry-input"
                      placeholder="مثلاً ۵۰,۰۰۰,۰۰۰"
                      required
                    >
                  </div>
                  <div class="dowry-field">
                    <label class="dowry-label">سال عقد</label>
                    <select
                      v-model.number="dowryForm.marriage_year"
                      class="dowry-input"
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      <option
                        v-for="opt in dowryYearOptions"
                        :key="String(opt.value)"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                  <div class="dowry-field">
                    <label class="dowry-label">سال اخذ مهریه</label>
                    <select
                      v-model.number="dowryForm.claim_year"
                      class="dowry-input"
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      <option
                        v-for="opt in dowryYearOptions"
                        :key="String(opt.value)"
                        :value="opt.value"
                      >
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <button type="submit" class="dowry-submit" :disabled="calcPending">
                  <Icon v-if="!calcPending" name="lucide:calculator" class="w-5 h-5" />
                  {{ calcPending ? 'در حال محاسبه...' : 'محاسبه نرخ روز مهریه' }}
                </button>
              </form>
            </div>
          </div>
          <!-- فرم عمومی سایر ماشین‌حساب‌ها -->
          <div v-else class="form-panel">
            <h2 class="form-panel-title">ورودی‌ها</h2>
            <LegalCalculatorsCalculatorForm
              :schema="detail.form_schema"
              :pending="calcPending"
              @submit="onCalculate"
            />
          </div>
          <div class="result-panel">
            <!-- نتیجه مخصوص مهریه: کارت با عنوان، مبلغ درشت، جزئیات و فرمول -->
            <template v-if="result && slug === 'dowry'">
              <div class="dowry-result-card">
                <div class="dowry-result-badge">نتیجه محاسبه</div>
                <h3 class="dowry-result-heading">مبلغ مهریه به نرخ روز</h3>
                <div class="dowry-result-primary">
                  <span class="dowry-result-value">{{ formatDowryNumber(result.primary_value) }}</span>
                  <span class="dowry-result-currency">{{ result.currency || 'تومان' }}</span>
                </div>
                <div v-if="result.breakdown?.length" class="dowry-result-details">
                  <h4 class="dowry-result-details-title">جزئیات</h4>
                  <ul class="dowry-result-details-list">
                    <li v-for="(row, i) in result.breakdown" :key="i" class="dowry-result-detail-row">
                      <span class="dowry-result-detail-label">{{ row.label }}</span>
                      <span class="dowry-result-detail-value">{{ typeof row.value === 'number' ? formatDowryNumber(row.value) : row.value }}</span>
                    </li>
                  </ul>
                </div>
                <div class="dowry-result-formula">
                  <span class="dowry-result-formula-label">فرمول قوه‌قضاییه:</span>
                  <span class="dowry-result-formula-text">مبلغ مهریه × (شاخص سال مطالبه ÷ شاخص سال عقد)</span>
                </div>
                <p class="dowry-result-source">شاخص‌ها از جدول شاخص بهای کالاها و خدمات مصرفی (سالانه) بانک مرکزی است.</p>
                <div v-if="result.warnings?.length" class="dowry-result-warnings">
                  <p v-for="(w, i) in result.warnings" :key="i" class="dowry-result-warning-item">{{ w }}</p>
                </div>
                <p v-if="result.disclaimer" class="dowry-result-disclaimer">{{ result.disclaimer }}</p>
                <LegalCalculatorsResultCta
                  :slug="slug"
                  :cta-title="result.cta?.title"
                  :cta-url="result.cta?.url"
                />
              </div>
            </template>
            <template v-else-if="result">
              <div class="result-box">
                <LegalCalculatorsResultRenderer :result="result" />
                <LegalCalculatorsResultCta
                  :slug="slug"
                  :cta-title="result.cta?.title"
                  :cta-url="result.cta?.url"
                />
              </div>
            </template>
            <p v-else class="result-placeholder">پس از پر کردن فرم و زدن دکمه محاسبه، نتیجه اینجا نمایش داده می‌شود.</p>
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

const dowryForm = reactive<{ marriage_year: number | ''; claim_year: number | ''; original_amount: number | '' }>({
  marriage_year: '',
  claim_year: '',
  original_amount: '',
})

const dowryYearOptions = computed(() => {
  const schema = detail.value?.form_schema
  if (!schema?.fields) return []
  const field = schema.fields.find((f: { name: string }) => f.name === 'marriage_year')
  const opts = (field?.options ?? []) as unknown as { value: number; label: string }[]
  return opts
})

function formatDowryNumber(n: unknown): string {
  if (typeof n !== 'number') return String(n ?? '')
  return new Intl.NumberFormat('fa-IR').format(n)
}

async function onDowrySubmit() {
  if (dowryForm.marriage_year === '' || dowryForm.claim_year === '' || dowryForm.original_amount === '') return
  await onCalculate({
    marriage_year: dowryForm.marriage_year,
    claim_year: dowryForm.claim_year,
    original_amount: dowryForm.original_amount,
  })
}

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
.result-panel {
  @apply min-h-[200px];
}
.result-placeholder {
  @apply text-gray-500;
}

.calc-grid {
  @apply grid gap-8 lg:grid-cols-2;
}

.form-panel {
  @apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm;
}

.form-panel-title {
  @apply mb-4 text-lg font-semibold text-gray-900;
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

/* کارت مهریه */
.dowry-card {
  @apply rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden;
}
.dowry-card-header {
  @apply flex items-center gap-3 border-b border-gray-200 bg-gray-800 px-5 py-4;
}
.dowry-card-header-accent {
  @apply h-8 w-1 shrink-0 rounded-full bg-red-500;
}
.dowry-card-title {
  @apply text-lg font-semibold text-white;
}
.dowry-card-subtitle {
  @apply mt-0.5 text-xs text-gray-300;
}
.dowry-card-body {
  @apply p-6;
}
.dowry-instruction {
  @apply mb-5 text-sm text-gray-600;
}
.dowry-form {
  @apply space-y-5;
}
.dowry-fields {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-4 items-end;
}
.dowry-field {
  @apply flex flex-col gap-1;
}
.dowry-label {
  @apply text-sm font-medium text-gray-700;
}
.dowry-input {
  @apply w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-100;
}
.dowry-hint {
  @apply text-xs text-gray-500 mt-0.5;
}
.dowry-submit {
  @apply w-full rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors;
}

/* کارت نتیجه مهریه */
.dowry-result-card {
  @apply rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5;
}
.dowry-result-badge {
  @apply inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md w-fit;
}
.dowry-result-heading {
  @apply text-base font-semibold text-gray-800 border-b border-gray-100 pb-2;
}
.dowry-result-primary {
  @apply flex items-baseline gap-2 flex-wrap;
}
.dowry-result-value {
  @apply text-2xl font-bold text-blue-600;
}
.dowry-result-currency {
  @apply text-base text-gray-600;
}
.dowry-result-details {
  @apply rounded-lg bg-gray-50/80 p-4;
}
.dowry-result-details-title {
  @apply text-sm font-semibold text-gray-700 mb-3;
}
.dowry-result-details-list {
  @apply space-y-2;
}
.dowry-result-detail-row {
  @apply flex justify-between items-center text-sm;
}
.dowry-result-detail-label {
  @apply text-gray-600;
}
.dowry-result-detail-value {
  @apply font-medium text-gray-900;
}
.dowry-result-formula {
  @apply rounded-lg border border-gray-200 bg-white px-4 py-3 flex flex-col gap-0.5;
}
.dowry-result-formula-label {
  @apply text-xs font-medium text-gray-500;
}
.dowry-result-formula-text {
  @apply text-sm text-gray-800 font-mono;
}
.dowry-result-source {
  @apply text-xs text-gray-500;
}
.dowry-result-warnings {
  @apply rounded-lg bg-amber-50 p-3 text-amber-800 text-sm;
}
.dowry-result-warning-item {
  @apply mb-0.5 last:mb-0;
}
.dowry-result-disclaimer {
  @apply text-xs text-gray-500 border-t border-gray-100 pt-3;
}
</style>
