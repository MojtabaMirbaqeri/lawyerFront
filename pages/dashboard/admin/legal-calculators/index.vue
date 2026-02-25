<template>
  <div class="legal-calculators-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">ماشین‌حساب‌های حقوقی</h1>
        <p class="page-description">{{ total }} ماشین‌حساب در سیستم</p>
      </div>
      <button
        type="button"
        class="btn-secondary flex items-center gap-2"
        @click="showHelpModal = true"
      >
        <Icon name="lucide:help-circle" class="w-5 h-5" />
        راهنمای افزودن و مدیریت
      </button>
    </div>

    <Teleport to="body">
      <Transition name="help-fade">
        <div
          v-if="showHelpModal"
          class="help-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          @click.self="showHelpModal = false"
        >
          <div class="help-modal">
            <div class="help-modal-header">
              <h2 id="help-title" class="help-modal-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنمای ماشین‌حساب‌های حقوقی
              </h2>
              <button
                type="button"
                class="help-modal-close"
                aria-label="بستن"
                @click="showHelpModal = false"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="help-modal-body">
              <section class="help-section">
                <h3 class="help-section-title">۱. افزودن ماشین‌حساب جدید</h3>
                <p class="help-text">
                  در حال حاضر ماشین‌حساب‌ها از طریق سیدر یا مستقیم در دیتابیس ایجاد می‌شوند. برای اضافه کردن نوع جدید ماشین‌حساب (مثلاً یک محاسبه‌گر حقوقی دیگر) باید در بک‌اند سرویس مربوطه را ثبت و در رجیستری اضافه کنید؛ سپس از این صفحه می‌توانید رکورد ماشین‌حساب را در دیتابیس ایجاد کنید و عنوان، slug، دسته، نوع خروجی، متن disclaimer و CTA را در بخش «ویرایش» تنظیم کنید.
                </p>
              </section>
              <section class="help-section">
                <h3 class="help-section-title">۲. افزودن نسخه (سال مقررات)</h3>
                <ul class="help-list">
                  <li>روی یکی از ماشین‌حساب‌ها روی <strong>«نسخه‌ها»</strong> کلیک کنید.</li>
                  <li>در فرم «افزودن نسخه» برچسب نسخه (مثلاً <strong>۱۴۰۴</strong> یا <strong>۱۴۰۵</strong>)، <strong>از تاریخ</strong> و در صورت نیاز <strong>تا تاریخ</strong> و <strong>مرجع قانونی</strong> را وارد کنید.</li>
                  <li>وضعیت را روی پیش‌نویس بگذارید تا بعد از تکمیل نرخ‌ها آن را فعال کنید.</li>
                  <li>با زدن «افزودن نسخه» نسخهٔ جدید ساخته می‌شود.</li>
                </ul>
              </section>
              <section class="help-section">
                <h3 class="help-section-title">۳. کپی نسخه برای سال بعد</h3>
                <ul class="help-list">
                  <li>برای به‌روزرسانی سالانه (مثلاً از ۱۴۰۴ به ۱۴۰۵) روی دکمه <strong>«کپی نسخه»</strong> کنار نسخهٔ فعلی کلیک کنید.</li>
                  <li>یک نسخهٔ جدید به‌صورت پیش‌نویس ساخته می‌شود و همهٔ نرخ‌ها کپی می‌شوند.</li>
                  <li>وارد «نرخ‌ها» شوید و فقط مقادیر تغییرکرده (مثلاً مبلغ دیه یا ضرایب) را ویرایش کنید.</li>
                  <li>در صورت نیاز از تاریخ نسخهٔ جدید را (مثلاً اول سال ۱۴۰۵) تنظیم و سپس آن را <strong>«فعال‌سازی»</strong> کنید. با فعال‌سازی، نسخه‌های قبلی که با این بازه هم‌پوشانی دارند به‌صورت خودکار بایگانی می‌شوند.</li>
                </ul>
              </section>
              <section class="help-section">
                <h3 class="help-section-title">۴. مدیریت نرخ‌ها و ضرایب</h3>
                <ul class="help-list">
                  <li>از صفحهٔ نسخه‌ها روی <strong>«نرخ‌ها»</strong> برای همان نسخه کلیک کنید.</li>
                  <li>با فرم «افزودن نرخ» می‌توانید یک نرخ جدید اضافه کنید: <strong>کلید (key)</strong> (مثلاً <code>full_diyah_amount</code>)، <strong>نوع مقدار</strong> (عددی، متنی، جیسون، بولین) و مقدار مربوطه را وارد کنید.</li>
                  <li>برای ویرایش روی «ویرایش» کنار هر نرخ کلیک کنید، مقدار را تغییر دهید و ذخیره کنید.</li>
                  <li>نرخ‌های نوع <strong>json</strong> باید آرایه یا شی معتبر باشند (مثلاً برای دسته‌بندی نوع جنایت یا ضرایب جنسیت).</li>
                </ul>
              </section>
              <section class="help-section">
                <h3 class="help-section-title">۵. مثال: ماشین‌حساب دیه</h3>
                <p class="help-text">
                  برای دیه، در هر نسخه معمولاً این نرخ‌ها تعریف می‌شوند: <code>full_diyah_amount</code> (مبلغ پایه)، <code>victim_gender_multipliers</code> (ضرایب جنسیت مقتول، مثلاً مرد: ۱ و زن: ۰.۵)، <code>incident_categories</code> (نوع جنایت: درصدی، قتل نفس، جنین، اعضای بدن، جنابت بر میت به‌همراه ضریب هر کدام)، <code>special_conditions</code> (مثلاً ماه حرام)، <code>haram_month_multiplier</code> (ضریب ماه حرام، مثلاً ۱.۳۳). پس از ذخیرهٔ نرخ‌ها، فرم عمومی دیه در سایت به‌صورت خودکار سال، نوع جنایت، جنسیت مقتول و محاسبه در ماه حرام را از همین نرخ‌ها می‌خواند. در صفحهٔ نسخه‌ها و نرخ‌های ماشین‌حساب دیه دکمه <strong>«راهنما و نمونه کامل دیه»</strong> را بزنید تا نمونهٔ آمادهٔ کپی را ببینید.
                </p>
              </section>
              <section class="help-section">
                <h3 class="help-section-title">۶. مثال: ماشین‌حساب مهریه (شاخص تورم)</h3>
                <p class="help-text">
                  ماشین‌حساب مهریه برای محاسبه <strong>مبلغ مهریه به نرخ روز</strong> طبق فرمول قوه‌قضاییه و بر اساس <strong>شاخص بهای کالاها و خدمات مصرفی (سالانه) بانک مرکزی</strong> است. کاربر سال عقد، سال اخذ مهریه و مبلغ مهریه (به تومان) را وارد می‌کند. در هر نسخه باید برای هر سال شمسی یک نرخ از نوع <strong>numeric</strong> با کلید <code>coefficient_YYYY</code> و مقدار برابر <strong>شاخص سالانه</strong> همان سال تعریف کنید. فرمول: مبلغ به نرخ روز = مبلغ مهریه × (شاخص سال مطالبه ÷ شاخص سال عقد). در صفحهٔ نسخه‌ها و نرخ‌های ماشین‌حساب مهریه دکمه <strong>«راهنما و نمونه کامل مهریه»</strong> را بزنید تا راهنمای کامل و مقادیر نمونهٔ شاخص را ببینید.
                </p>
              </section>
            </div>
            <div class="help-modal-footer">
              <button type="button" class="btn-primary" @click="showHelpModal = false">
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <dashboard-admin-generic-table
      :data="data"
      :columns="tableColumns"
      :loading="pending"
      :show-pagination="total > perPage"
      :current-page="page"
      :total-items="total"
      :items-per-page="perPage"
      row-key="id"
      empty-title="ماشین‌حسابی یافت نشد"
      empty-message="ابتدا دیتابیس را seed کنید یا از پنل ماشین‌حساب‌ها یک مورد اضافه کنید."
      empty-icon="lucide:calculator"
      @update:page="page = $event"
    >
      <template #cell-title="{ value }">
        <span class="font-medium text-gray-900">{{ value }}</span>
      </template>
      <template #cell-slug="{ value }">
        <span class="font-mono text-sm text-gray-600">{{ value }}</span>
      </template>
      <template #cell-category="{ value }">
        <span class="text-gray-600">{{ value || '–' }}</span>
      </template>
      <template #cell-is_active="{ value }">
        <span class="badge" :class="value ? 'badge-success' : 'badge-error'">
          {{ value ? 'فعال' : 'غیرفعال' }}
        </span>
      </template>
      <template #cell-versions_count="{ value }">
        <span class="text-gray-600">{{ value ?? 0 }}</span>
      </template>
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <NuxtLink
            :to="`/dashboard/admin/legal-calculators/${row.id}/edit`"
            class="btn-secondary text-sm! py-1.5! px-3!"
          >
            <Icon name="lucide:edit" class="w-4 h-4" />
            ویرایش
          </NuxtLink>
          <NuxtLink
            :to="`/dashboard/admin/legal-calculators/${row.id}/versions`"
            class="btn-secondary text-sm! py-1.5! px-3!"
          >
            <Icon name="lucide:layers" class="w-4 h-4" />
            نسخه‌ها
          </NuxtLink>
        </div>
      </template>
    </dashboard-admin-generic-table>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const tableColumns = [
  { key: 'title', label: 'عنوان' },
  { key: 'slug', label: 'slug' },
  { key: 'category', label: 'دسته' },
  { key: 'is_active', label: 'وضعیت' },
  { key: 'versions_count', label: 'نسخه‌ها' },
]

const data = ref<Record<string, unknown>[]>([])
const total = ref(0)
const page = ref(1)
const perPage = 20
const pending = ref(true)
const showHelpModal = ref(false)

async function load() {
  pending.value = true
  const res = await useGet({
    url: 'admin/legal-calculators',
    includeAuthHeader: true,
    query: { per_page: perPage, page: page.value },
  }, false)
  const body = res.data as { data?: { data?: unknown[]; total?: number; current_page?: number }; data?: unknown[] }
  const list = body?.data?.data ?? body?.data
  if (Array.isArray(list)) {
    data.value = list
    const meta = body?.data as { total?: number }
    total.value = meta?.total ?? list.length
  }
  pending.value = false
}

onMounted(load)
watch(page, load)

useHead({ title: 'ماشین‌حساب‌های حقوقی | پنل ادمین' })
</script>

<style scoped>
@reference "tailwindcss";

.legal-calculators-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.page-title {
  @apply text-xl font-bold text-gray-900;
}

.page-description {
  @apply text-sm text-gray-500;
}

.help-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4;
}

.help-modal {
  @apply my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl;
}

.help-modal-header {
  @apply flex items-center justify-between border-b border-gray-200 px-6 py-4;
}

.help-modal-title {
  @apply flex items-center gap-2 text-lg font-bold text-gray-900;
}

.help-modal-close {
  @apply rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700;
}

.help-modal-body {
  @apply max-h-[60vh] overflow-y-auto px-6 py-4;
}

.help-modal-footer {
  @apply border-t border-gray-200 px-6 py-4;
}

.help-section {
  @apply mb-5 last:mb-0;
}

.help-section-title {
  @apply mb-2 text-base font-semibold text-gray-800;
}

.help-text {
  @apply text-sm leading-relaxed text-gray-600;
}

.help-list {
  @apply list-inside list-disc space-y-1.5 text-sm text-gray-600;
}

.help-list li {
  @apply leading-relaxed;
}

.help-list code {
  @apply rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs;
}

.help-fade-enter-active,
.help-fade-leave-active {
  transition: opacity 0.2s ease;
}

.help-fade-enter-from,
.help-fade-leave-to {
  opacity: 0;
}
</style>
