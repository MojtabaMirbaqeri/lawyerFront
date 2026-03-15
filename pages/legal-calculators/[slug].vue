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
            <button
              v-if="slug === 'delay-damages'"
              type="button"
              class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              @click="showDelayDamagesHelp = true"
            >
              <Icon name="lucide:help-circle" class="w-5 h-5" />
              راهنمای محاسبه خسارت تأخیر تأدیه
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

        <Teleport v-if="slug === 'delay-damages'" to="body">
          <Transition name="diyah-help-fade">
            <div
              v-if="showDelayDamagesHelp"
              class="diyah-help-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delay-damages-help-title"
              @click.self="showDelayDamagesHelp = false"
            >
              <div class="diyah-help-modal">
                <div class="diyah-help-header">
                  <h2 id="delay-damages-help-title" class="diyah-help-title">
                    <Icon name="lucide:book-open" class="w-5 h-5" />
                    راهنمای محاسبه خسارت تأخیر تأدیه
                  </h2>
                  <button
                    type="button"
                    class="diyah-help-close"
                    aria-label="بستن"
                    @click="showDelayDamagesHelp = false"
                  >
                    <Icon name="lucide:x" class="w-5 h-5" />
                  </button>
                </div>
                <div class="diyah-help-body">
                  <p class="diyah-help-intro">
                    طبق <strong>ماده ۵۲۲ آیین دادرسی مدنی</strong>، خسارت تأخیر تأدیه با در نظر گرفتن کاهش ارزش پول و <strong>شاخص سالانه بانک مرکزی</strong> محاسبه می‌شود.
                  </p>
                  <p class="diyah-help-intro">
                    <strong>نوع محاسبه:</strong> سالانه (فقط سال سررسید و سال پرداخت) یا ماهانه (به‌همراه ماه سررسید و ماه پرداخت برای دقت بیشتر).
                  </p>
                  <p class="diyah-help-intro">
                    <strong>فرمول:</strong> مبلغ به‌روز = مبلغ اصل × (شاخص زمان پرداخت ÷ شاخص زمان سررسید)؛ خسارت تأخیر = مبلغ به‌روز − مبلغ اصل.
                  </p>
                  <p class="diyah-help-note">
                    نتیجهٔ محاسبه صرفاً جنبه اطلاع‌رسانی دارد و برای مطالبه رسمی مشاوره حقوقی توصیه می‌شود.
                  </p>
                </div>
                <div class="diyah-help-footer">
                  <button type="button" class="diyah-help-btn" @click="showDelayDamagesHelp = false">
                    متوجه شدم
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>

        <div class="calc-grid">
          <!-- فرم مخصوص مهریه -->
          <LegalCalculatorsCalculatorThemedCard
            v-if="slug === 'dowry'"
            theme="red"
            title="محاسبه مهریه به نرخ روز"
            subtitle="آنلاین و بر اساس شاخص بانک مرکزی"
            instruction="سال عقد، سال اخذ مهریه و مبلغ مهریه را وارد کنید. محاسبه طبق فرمول قوه‌قضاییه و شاخص بهای کالاها و خدمات مصرفی بانک مرکزی انجام می‌شود."
          >
            <form class="dowry-form" @submit.prevent="onDowrySubmit">
              <div class="dowry-fields">
                <div class="dowry-field">
                  <label class="dowry-label">مبلغ مهریه<span class="dowry-hint"> (به تومان)</span></label>
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
          </LegalCalculatorsCalculatorThemedCard>
          <!-- فرم مخصوص خسارت تأخیر تأدیه -->
          <LegalCalculatorsCalculatorThemedCard
            v-else-if="slug === 'delay-damages'"
            theme="amber"
            title="محاسبه خسارت تأخیر تأدیه"
            subtitle="بر اساس شاخص سالانه بانک مرکزی (ماده ۵۲۲)"
            instruction="محاسبه خسارت تاخیر تادیه به دو روش استفاده از شاخص متوسط سال و استفاده از شاخص هر ماه به صورت جداگانه امکان‌پذیر است."
          >
            <form class="delay-damages-form" @submit.prevent="onDelayDamagesSubmit">
              <div class="delay-damages-fields">
                <div class="delay-damages-field delay-damages-field-full">
                  <label class="delay-damages-label">نوع محاسبه</label>
                  <div class="delay-damages-radio-group">
                    <label class="delay-damages-radio">
                      <input v-model="delayDamagesForm.calculation_type" type="radio" value="yearly" />
                      <span>سالانه</span>
                    </label>
                    <label class="delay-damages-radio">
                      <input v-model="delayDamagesForm.calculation_type" type="radio" value="monthly" />
                      <span>ماهانه</span>
                    </label>
                  </div>
                </div>
                <div class="delay-damages-field">
                  <label class="delay-damages-label">مبلغ (به تومان)</label>
                  <input
                    v-model.number="delayDamagesForm.principal_amount"
                    type="number"
                    min="0"
                    step="1"
                    class="delay-damages-input"
                    placeholder="مثلاً ۱۰,۰۰۰,۰۰۰"
                    required
                  >
                </div>
                <template v-if="delayDamagesForm.calculation_type === 'yearly'">
                  <div class="delay-damages-field">
                    <LegalCalculatorsYearPicker
                      v-model="delayDamagesForm.due_year"
                      label="سال سررسید"
                      :min-year="1315"
                      :max-year="1410"
                    />
                  </div>
                  <div class="delay-damages-field">
                    <LegalCalculatorsYearPicker
                      v-model="delayDamagesForm.payment_year"
                      label="سال پرداخت"
                      :min-year="1315"
                      :max-year="1410"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="delay-damages-field">
                    <LegalCalculatorsMonthYearPicker
                      v-model="delayDamagesForm.due_date"
                      label="زمان سررسید"
                      :min-year="1315"
                      :max-year="1410"
                    />
                  </div>
                  <div class="delay-damages-field">
                    <LegalCalculatorsMonthYearPicker
                      v-model="delayDamagesForm.payment_date"
                      label="زمان پرداخت"
                      :min-year="1315"
                      :max-year="1410"
                    />
                  </div>
                </template>
                <div v-if="delayDamagesVersionOptions.length" class="delay-damages-field delay-damages-field-full">
                  <label class="delay-damages-label">نسخه شاخص</label>
                  <select v-model="delayDamagesForm.version_label" class="delay-damages-input">
                    <option value="">آخرین نسخه</option>
                    <option
                      v-for="opt in delayDamagesVersionOptions"
                      :key="String(opt.value)"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
              </div>
              <button type="submit" class="delay-damages-submit" :disabled="calcPending">
                <Icon v-if="!calcPending" name="lucide:calculator" class="w-5 h-5" />
                {{ calcPending ? 'در حال محاسبه...' : 'محاسبه خسارت تأخیر' }}
              </button>
            </form>
          </LegalCalculatorsCalculatorThemedCard>
          <!-- فرم عمومی سایر ماشین‌حساب‌ها (دیه، ارث، حق‌الثبت و ...) -->
          <LegalCalculatorsCalculatorThemedCard
            v-else
            :theme="calculatorTheme"
            :title="(detail.metadata?.title as string) ?? 'ورودی‌ها'"
            :subtitle="(detail.metadata?.short_description as string) ?? undefined"
          >
            <LegalCalculatorsCalculatorForm
              :schema="detail.form_schema"
              :pending="calcPending"
              @submit="onCalculate"
            />
          </LegalCalculatorsCalculatorThemedCard>
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
import type { PersianMonthYear } from '~/utils/persianDate'

type CalculatorTheme = 'red' | 'amber' | 'blue' | 'emerald' | 'violet'

/** نقشه slug به تم رنگی برای ماشین‌حساب‌های عمومی */
const SLUG_THEME_MAP: Record<string, CalculatorTheme> = {
  'blood-money': 'blue',
  inheritance: 'emerald',
  'registration-fee': 'violet',
}

const DEFAULT_CALCULATOR_THEME: CalculatorTheme = 'blue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const calculatorTheme = computed<CalculatorTheme>(() => {
  return SLUG_THEME_MAP[slug.value] ?? DEFAULT_CALCULATOR_THEME
})

const { fetchCalculatorBySlug, calculate } = useLegalCalculators()
const detail = ref<CalculatorDetail | null>(null)
const result = ref<CalculatorResult | null>(null)
const pending = ref(true)
const calcPending = ref(false)
const error = ref<string | null>(null)
const showDiyahHelp = ref(false)
const showDelayDamagesHelp = ref(false)

const dowryForm = reactive<{ marriage_year: number | ''; claim_year: number | ''; original_amount: number | '' }>({
  marriage_year: '',
  claim_year: '',
  original_amount: '',
})

const delayDamagesForm = reactive<{
  calculation_type: 'yearly' | 'monthly'
  principal_amount: number | ''
  due_year: number | null
  payment_year: number | null
  due_date: PersianMonthYear | null
  payment_date: PersianMonthYear | null
  version_label: string
}>({
  calculation_type: 'yearly',
  principal_amount: '',
  due_year: null,
  payment_year: null,
  due_date: null,
  payment_date: null,
  version_label: '',
})

const delayDamagesVersionOptions = computed(() => {
  const schema = detail.value?.form_schema
  if (!schema?.fields) return []
  const field = schema.fields.find((f: { name: string }) => f.name === 'version_label')
  return (field?.options ?? []) as { value: string; label: string }[]
})

async function onDelayDamagesSubmit() {
  const payload: Record<string, unknown> = {
    calculation_type: delayDamagesForm.calculation_type,
    principal_amount: delayDamagesForm.principal_amount,
    version_label: delayDamagesForm.version_label || undefined,
  }
  if (delayDamagesForm.calculation_type === 'yearly') {
    if (delayDamagesForm.due_year == null || delayDamagesForm.payment_year == null) return
    payload.due_year = delayDamagesForm.due_year
    payload.payment_year = delayDamagesForm.payment_year
  } else {
    const due = delayDamagesForm.due_date
    const pay = delayDamagesForm.payment_date
    if (!due?.year || !due?.month || !pay?.year || !pay?.month) return
    payload.due_year = due.year
    payload.payment_year = pay.year
    payload.due_month = due.month
    payload.payment_month = pay.month
  }
  await onCalculate(payload)
}

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

/* فرم مهریه (layout داخل کارت تم‌دار) */
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
  @apply w-full rounded-lg px-6 py-3 text-base font-medium text-white disabled:opacity-50 transition-colors;
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

/* فرم خسارت تأخیر (layout داخل کارت تم‌دار) */
.delay-damages-form {
  @apply space-y-5;
}
.delay-damages-fields {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4 items-end;
}
.delay-damages-field-full {
  @apply sm:col-span-2;
}
.delay-damages-field {
  @apply flex flex-col gap-1;
}
.delay-damages-label {
  @apply text-sm font-medium text-gray-700;
}
.delay-damages-input {
  @apply w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100;
}
.delay-damages-radio-group {
  @apply flex flex-wrap gap-4;
}
.delay-damages-radio {
  @apply flex items-center gap-2 cursor-pointer text-sm text-gray-700;
}
.delay-damages-radio input {
  @apply rounded-full;
}
.delay-damages-submit {
  @apply w-full rounded-lg px-6 py-3 text-base font-medium text-white disabled:opacity-50 transition-colors;
}
</style>
