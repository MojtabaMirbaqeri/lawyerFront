<template>
  <section class="legal-qa-reports">
    <div class="page-header">
      <div>
        <h1 class="page-title">گزارش‌های سوال و جواب</h1>
        <p class="page-description">گزارش‌های abuse و موارد گزارش‌شده توسط کاربران.</p>
      </div>
      <NuxtLink to="/dashboard/admin/legal-qa" class="btn-secondary no-underline">
        <UIcon name="lucide:arrow-right" class="size-4 scale-x-[-1]" />
        بازگشت به مدیریت سوال و جواب
      </NuxtLink>
    </div>

    <div class="card-dashboard">
      <div v-if="loading" class="legal-qa-loading">
        <UIcon name="lucide:loader-2" class="size-10 animate-spin text-gray-400" />
        <p class="mt-3 text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
      <div v-else-if="!list.length" class="legal-qa-empty">
        <UIcon name="lucide:flag" class="size-12 text-gray-400" />
        <p class="font-medium text-gray-700">گزارشی یافت نشد</p>
      </div>
      <div v-else class="legal-qa-table-wrap">
        <table class="legal-qa-table">
          <thead>
            <tr>
              <th>نوع / شناسه</th>
              <th>دلیل</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td class="text-sm">{{ reportableTypeLabel(row.reportable_type) }} #{{ row.reportable_id }}</td>
              <td class="text-sm">{{ reasonLabel(row.reason) }}</td>
              <td>
                <span :class="['legal-qa-badge', reportStatusClass(row.status)]">{{ reportStatusLabel(row.status) }}</span>
              </td>
              <td class="legal-qa-muted text-sm">{{ row.created_at }}</td>
              <td>
                <div class="legal-qa-actions">
                  <button
                    v-if="row.status === 'open' || row.status === 'reviewing'"
                    type="button"
                    class="btn-success text-sm! py-1.5! px-3!"
                    @click="updateReportStatus(row.id, 'resolved')"
                  >
                    <UIcon name="lucide:check" class="size-4" />
                    حل شده
                  </button>
                  <button
                    v-if="row.status === 'open' || row.status === 'reviewing'"
                    type="button"
                    class="btn-secondary text-sm! py-1.5! px-3!"
                    @click="updateReportStatus(row.id, 'rejected')"
                  >
                    <UIcon name="lucide:x" class="size-4" />
                    رد گزارش
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
const list = ref([]);
const loading = ref(true);

async function fetchList() {
  loading.value = true;
  const res = await useGet({
    url: "admin/legal/reports",
    includeAuthHeader: true,
    query: { per_page: 50 },
  });
  loading.value = false;
  list.value = res.data?.data ?? [];
}

function reportableTypeLabel(type) {
  if (type?.includes('Question')) return 'سوال';
  if (type?.includes('Answer')) return 'پاسخ';
  return type || '—';
}
function reasonLabel(r) {
  const map = { spam: 'اسپم', harassment: 'آزار', personal_data: 'اطلاعات شخصی', illegal_request: 'درخواست غیرقانونی', other: 'سایر' };
  return map[r] || r;
}
function reportStatusLabel(s) {
  const map = { open: 'باز', reviewing: 'در حال بررسی', resolved: 'حل شده', rejected: 'رد شده' };
  return map[s] || s;
}
function reportStatusClass(s) {
  const map = { open: 'bg-amber-100 text-amber-800', reviewing: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800', rejected: 'bg-gray-100 text-gray-600' };
  return map[s] || 'bg-gray-100 text-gray-600';
}

async function updateReportStatus(id, status) {
  await usePatch({
    url: `admin/legal/reports/${id}`,
    includeAuthHeader: true,
    body: { status },
  });
  await fetchList();
}

useHead({ title: "گزارش‌های سوال و جواب | ادمین" });
await fetchList();
</script>

<style scoped>
@reference "tailwindcss";

.legal-qa-reports {
  @apply space-y-6;
}
.legal-qa-loading {
  @apply flex flex-col items-center justify-center py-16;
}
.legal-qa-empty {
  @apply flex flex-col items-center justify-center gap-3 py-16 text-center;
}
.legal-qa-table-wrap {
  @apply overflow-x-auto;
}
.legal-qa-table {
  @apply w-full text-right;
}
.legal-qa-table thead {
  @apply border-b border-gray-200 bg-gray-50/80;
}
.legal-qa-table th {
  @apply px-5 py-3.5 text-sm font-semibold text-gray-700;
}
.legal-qa-table tbody tr {
  @apply border-b border-gray-100 last:border-0 hover:bg-gray-50/50;
}
.legal-qa-table td {
  @apply px-5 py-3.5 text-sm;
}
.legal-qa-badge {
  @apply inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium;
}
.legal-qa-muted {
  @apply text-gray-500;
}
.legal-qa-actions {
  @apply flex flex-wrap items-center gap-2;
}
</style>
