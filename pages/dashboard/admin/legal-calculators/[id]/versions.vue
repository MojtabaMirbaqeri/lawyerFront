<template>
  <div class="versions-admin-page">
    <div class="page-header">
      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink to="/dashboard/admin/legal-calculators" class="btn-secondary text-sm! py-1.5! px-3!">
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
          لیست ماشین‌حساب‌ها
        </NuxtLink>
        <NuxtLink :to="`/dashboard/admin/legal-calculators/${id}/edit`" class="btn-secondary text-sm! py-1.5! px-3!">
          <Icon name="lucide:edit" class="w-4 h-4" />
          ویرایش ماشین‌حساب
        </NuxtLink>
        <button
          v-if="calculatorSlug === 'blood-money'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showDiyahHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل دیه
        </button>
        <button
          v-if="calculatorSlug === 'dowry'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showDowryHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل مهریه
        </button>
        <h1 class="page-title">نسخه‌ها</h1>
      </div>
    </div>

    <Teleport v-if="calculatorSlug === 'blood-money'" to="body">
      <Transition name="diyah-help-fade">
        <div
          v-if="showDiyahHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showDiyahHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل نرخ‌های ماشین‌حساب دیه
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showDiyahHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                برای هر نسخه (سال) ماشین‌حساب دیه، در صفحه «نرخ‌ها» باید نرخ‌های زیر را تعریف کنید. می‌توانید از دکمه «کپی نسخه» برای کپی کردن نرخ‌های سال قبل استفاده کنید و فقط مقادیر تغییرکرده را ویرایش کنید.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه کامل نرخ‌ها (کپی و در فرم افزودن نرخ استفاده کنید)</h3>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: full_diyah_amount — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">500000000</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: victim_gender_multipliers — نوع: json</span>
                  <pre class="admin-diyah-sample-pre">{{ diyahSampleVictimGender }}</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: incident_categories — نوع: json</span>
                  <pre class="admin-diyah-sample-pre">{{ diyahSampleIncidentCategories }}</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: special_conditions — نوع: json</span>
                  <pre class="admin-diyah-sample-pre">{{ diyahSampleSpecialConditions }}</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: haram_month_multiplier — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">1.33</pre>
                </div>
              </section>
              <p class="admin-diyah-help-note">
                پس از ذخیره نرخ‌ها، در صفحه عمومی «محاسبه دیه» فیلدهای سال، نوع جنایت، جنسیت مقتول و محاسبه در ماه حرام از همین نرخ‌ها پر می‌شوند.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showDiyahHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport v-if="calculatorSlug === 'dowry'" to="body">
      <Transition name="diyah-help-fade">
        <div
          v-if="showDowryHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showDowryHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل ماشین‌حساب مهریه
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showDowryHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                ماشین‌حساب مهریه برای محاسبه <strong>مبلغ مهریه به نرخ روز</strong> طبق فرمول قوه‌قضاییه و بر اساس <strong>شاخص تورم سالانه بانک مرکزی</strong> استفاده می‌شود. ابتدا یک نسخه (مثلاً برچسب «۱۴۰۴») با تاریخ اثر ایجاد کنید، سپس از جدول زیر روی «نرخ‌ها» کلیک کنید و برای هر سال شمسی، شاخص همان سال را با کلید <code class="font-mono text-xs bg-gray-200 px-1 rounded">coefficient_YYYY</code> از نوع numeric اضافه کنید.
              </p>
              <p class="admin-diyah-help-intro">
                <strong>فرمول:</strong> مبلغ به نرخ روز = مبلغ مهریه × (شاخص سال مطالبه ÷ شاخص سال عقد). مقادیر شاخص را از جدول «شاخص بهای کالاها و خدمات مصرفی» بانک مرکزی بگیرید و هر سال به‌روزرسانی کنید.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه شاخص (سال مبنا ۱۳۹۵ = ۱۰۰)</h3>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">۱۳۹۵=100، ۱۴۰۰=437.042، ۱۴۰۱=640.225، ۱۴۰۲=974.75، ۱۴۰۳=1306.77، ۱۴۰۴=تقریبی تا اعلام رسمی</span>
                  <pre class="admin-diyah-sample-pre">هر سال را به‌صورت یک نرخ جدا (کلید coefficient_YYYY، نوع numeric) در صفحه نرخ‌ها اضافه کنید.</pre>
                </div>
              </section>
              <p class="admin-diyah-help-note">
                در صفحه عمومی، کاربر سال عقد، سال اخذ مهریه و مبلغ مهریه (به تومان) را وارد می‌کند و مبلغ به نرخ روز بر اساس همین شاخص‌ها محاسبه می‌شود.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showDowryHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="card-dashboard">
      <div class="card-dashboard-header">
        <h2 class="card-dashboard-title">افزودن نسخه</h2>
      </div>
      <div class="card-dashboard-body">
        <form class="action-bar flex flex-wrap gap-4 items-end mb-6" @submit.prevent="addVersion">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">برچسب نسخه (مثلاً 1404)</label>
            <input v-model="newVersion.version_label" type="text" class="input-dashboard w-32" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">از تاریخ</label>
            <input v-model="newVersion.effective_from" type="date" class="input-dashboard" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">تا تاریخ (اختیاری)</label>
            <input v-model="newVersion.effective_to" type="date" class="input-dashboard" />
          </div>
          <div class="min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">مرجع قانونی</label>
            <input v-model="newVersion.legal_reference" type="text" class="input-dashboard w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">وضعیت</label>
            <select v-model="newVersion.status" class="select-dashboard w-36">
              <option value="draft">پیش‌نویس</option>
              <option value="active">فعال</option>
              <option value="archived">بایگانی</option>
            </select>
          </div>
          <div class="w-full min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 mb-1">یادداشت (اختیاری)</label>
            <input v-model="newVersion.notes" type="text" class="input-dashboard w-full" placeholder="یادداشت داخلی" />
          </div>
          <div class="w-full flex justify-end">
            <button type="submit" class="btn-primary" :disabled="addPending">
              <Icon name="lucide:plus" class="w-4 h-4" />
              افزودن نسخه
            </button>
          </div>
        </form>

        <div class="overflow-x-auto">
          <table class="table-dashboard">
            <thead>
              <tr>
                <th>برچسب</th>
                <th>از تاریخ</th>
                <th>تا تاریخ</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in versions" :key="v.id">
                <td>{{ v.version_label }}</td>
                <td>{{ formatDate(v.effective_from) }}</td>
                <td>{{ formatDate(v.effective_to) || '—' }}</td>
                <td>
                  <span class="badge" :class="statusBadgeClass(v.status)">
                    {{ statusLabel(v.status) }}
                  </span>
                </td>
                <td>
                  <div class="flex flex-wrap gap-2">
                    <NuxtLink
                      :to="`/dashboard/admin/legal-calculators/versions/${v.id}/rates`"
                      class="btn-secondary text-sm! py-1.5! px-3!"
                    >
                      <Icon name="lucide:list" class="w-4 h-4" />
                      نرخ‌ها
                    </NuxtLink>
                    <button
                      type="button"
                      class="btn-secondary text-sm! py-1.5! px-3!"
                      :disabled="duplicatePending === v.id"
                      @click="duplicateVersion(v)"
                    >
                      <Icon name="lucide:copy" class="w-4 h-4" />
                      کپی نسخه
                    </button>
                    <template v-if="v.status !== 'active'">
                      <button
                        type="button"
                        class="btn-primary text-sm! py-1.5! px-3!"
                        :disabled="actionPending === v.id"
                        @click="setVersionStatus(v, 'active')"
                      >
                        فعال‌سازی
                      </button>
                    </template>
                    <template v-else>
                      <button
                        type="button"
                        class="btn-secondary text-sm! py-1.5! px-3!"
                        :disabled="actionPending === v.id"
                        @click="setVersionStatus(v, 'draft')"
                      >
                        غیرفعال
                      </button>
                    </template>
                    <button
                      v-if="v.status !== 'active'"
                      type="button"
                      class="text-red-600 hover:text-red-800 text-sm! py-1.5! px-3!"
                      :disabled="deletePending === v.id"
                      @click="deleteVersion(v)"
                    >
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="versions.length === 0 && !pending" class="empty-state py-12">
          <div class="empty-state-icon">
            <Icon name="lucide:layers" class="w-8 h-8" />
          </div>
          <h4 class="empty-state-title">نسخه‌ای ثبت نشده است</h4>
          <p class="empty-state-description">با فرم بالا یک نسخه جدید اضافه کنید.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const id = computed(() => route.params.id as string)
const versions = ref<Record<string, unknown>[]>([])
const pending = ref(true)
const addPending = ref(false)
const calculatorSlug = ref<string | null>(null)
const showDiyahHelp = ref(false)
const showDowryHelp = ref(false)

const diyahSampleVictimGender = '{"male":1,"female":0.5}'
const diyahSampleIncidentCategories = `[
  {"key":"percentage","label":"درصدی","multiplier":1},
  {"key":"murder","label":"قتل نفس","multiplier":1},
  {"key":"fetus","label":"جنین","multiplier":0.05},
  {"key":"body_parts","label":"اعضای بدن","multiplier":1},
  {"key":"deceased_violation","label":"جنابت بر میت","multiplier":1}
]`
const diyahSampleSpecialConditions = '[{"value":"haram_month","label":"محاسبه دیه در ماه حرام"}]'
const newVersion = reactive({
  version_label: '',
  effective_from: '',
  effective_to: '' as string,
  legal_reference: '',
  status: 'draft' as string,
  notes: '',
})
const duplicatePending = ref<number | null>(null)
const actionPending = ref<number | null>(null)
const deletePending = ref<number | null>(null)

async function load() {
  pending.value = true
  const res = await useGet({ url: `admin/legal-calculators/${id.value}/versions`, includeAuthHeader: true }, false)
  const body = res.data as { data?: unknown[] }
  versions.value = (Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []) as Record<string, unknown>[]
  pending.value = false
}

async function addVersion() {
  addPending.value = true
  const body: Record<string, unknown> = {
    version_label: newVersion.version_label,
    effective_from: newVersion.effective_from,
    legal_reference: newVersion.legal_reference || undefined,
    effective_to: newVersion.effective_to || undefined,
    status: newVersion.status,
    notes: newVersion.notes || undefined,
  }
  await usePost({
    url: `admin/legal-calculators/${id.value}/versions`,
    includeAuthHeader: true,
    body,
  }, true)
  addPending.value = false
  await load()
}

function formatDate(val: unknown): string {
  if (!val) return ''
  const s = String(val).slice(0, 10)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) return `${m[1]}/${m[2]}/${m[3]}`
  return s || ''
}

function statusLabel(status: unknown): string {
  const s = String(status ?? '')
  if (s === 'active') return 'فعال'
  if (s === 'draft') return 'پیش‌نویس'
  if (s === 'archived') return 'بایگانی'
  return s || '—'
}

function statusBadgeClass(status: unknown): string {
  const s = String(status ?? '')
  if (s === 'active') return 'badge-success'
  if (s === 'draft') return 'badge'
  if (s === 'archived') return 'badge-error'
  return 'badge'
}

async function duplicateVersion(v: Record<string, unknown>) {
  const vid = v.id as number
  duplicatePending.value = vid
  const res = await usePost({
    url: 'admin/legal-calculator-versions/duplicate',
    includeAuthHeader: true,
    body: { source_version_id: vid },
  }, true)
  duplicatePending.value = null
  if (res.status && res.data) {
    const payload = res.data as { data?: { id?: number }; id?: number }
    const newId = payload?.data?.id ?? payload?.id
    if (newId) {
      await navigateTo(`/dashboard/admin/legal-calculators/versions/${newId}/rates`)
      return
    }
  }
  await load()
}

async function setVersionStatus(v: Record<string, unknown>, status: string) {
  const vid = v.id as number
  actionPending.value = vid
  await usePatch({
    url: `admin/legal-calculator-versions/${vid}`,
    includeAuthHeader: true,
    body: { status },
  }, true)
  actionPending.value = null
  await load()
}

async function deleteVersion(v: Record<string, unknown>) {
  if (!confirm('آیا از حذف این نسخه اطمینان دارید؟')) return
  const vid = v.id as number
  deletePending.value = vid
  const res = await useDelete({ url: `admin/legal-calculator-versions/${vid}`, includeAuthHeader: true })
  deletePending.value = null
  if (res.status !== false) await load()
}

async function loadCalculator() {
  const res = await useGet({ url: `admin/legal-calculators/${id.value}`, includeAuthHeader: true }, false)
  const body = res.data as { data?: { slug?: string } }
  const slug = body?.data?.slug
  calculatorSlug.value = typeof slug === 'string' ? slug : null
}

onMounted(() => {
  load()
  loadCalculator()
})
watch(id, () => {
  load()
  loadCalculator()
})

useHead({ title: 'نسخه‌های ماشین‌حساب | پنل ادمین' })
</script>

<style scoped>
@reference "tailwindcss";

.versions-admin-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.page-title {
  @apply text-xl font-bold text-gray-900;
}

.admin-diyah-help-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4;
}

.admin-diyah-help-modal {
  @apply my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl;
}

.admin-diyah-help-header {
  @apply flex items-center justify-between border-b border-gray-200 px-6 py-4;
}

.admin-diyah-help-title {
  @apply flex items-center gap-2 text-lg font-bold text-gray-900;
}

.admin-diyah-help-close {
  @apply rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700;
}

.admin-diyah-help-body {
  @apply max-h-[70vh] overflow-y-auto px-6 py-4;
}

.admin-diyah-help-intro {
  @apply mb-4 text-sm text-gray-600;
}

.admin-diyah-sample-section {
  @apply mb-4;
}

.admin-diyah-sample-title {
  @apply mb-3 text-sm font-semibold text-gray-800;
}

.admin-diyah-sample-block {
  @apply mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3;
}

.admin-diyah-sample-label {
  @apply mb-1 block text-xs font-medium text-gray-500;
}

.admin-diyah-sample-pre {
  @apply overflow-x-auto font-mono text-xs text-gray-800 whitespace-pre-wrap break-all;
}

.admin-diyah-help-note {
  @apply mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800;
}

.admin-diyah-help-footer {
  @apply border-t border-gray-200 px-6 py-4;
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
