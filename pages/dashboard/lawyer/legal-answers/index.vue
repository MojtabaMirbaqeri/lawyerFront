<template>
  <section class="legal-answers-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">پاسخ‌های حقوقی من</h1>
        <p class="page-description">پاسخ‌هایی که به سوالات حقوقی کاربران داده‌اید.</p>
      </div>
      <NuxtLink to="/legal/questions" class="btn-secondary no-underline">
        <UIcon name="lucide:message-circle-question" class="size-4" />
        مشاهده سوالات
      </NuxtLink>
    </div>

    <div class="card-dashboard">
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <UIcon name="lucide:loader-2" class="size-10 animate-spin text-gray-400" />
        <p class="mt-3 text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
      <div v-else-if="!list.length" class="empty-state">
        <div class="empty-state-icon">
          <UIcon name="lucide:message-circle-question" class="size-10 text-gray-400" />
        </div>
        <h4 class="empty-state-title">هنوز پاسخی ثبت نکرده‌اید</h4>
        <p class="empty-state-description">با پاسخ به سوالات حقوقی، تخصص خود را به اشتراک بگذارید.</p>
        <NuxtLink to="/legal/questions" class="btn-primary mt-4 no-underline">مشاهده سوالات</NuxtLink>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="legal-answers-table">
          <thead>
            <tr>
              <th>سوال</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>
                <NuxtLink :to="`/legal/questions/${row.question?.slug || row.question?.id}`" class="legal-answers-link">
                  {{ row.question?.title || '—' }}
                </NuxtLink>
              </td>
              <td>
                <span :class="['legal-answers-badge', statusClass(row.status)]">{{ statusLabel(row.status) }}</span>
                <span v-if="row.is_best" class="legal-answers-badge legal-answers-badge--best">بهترین</span>
              </td>
              <td class="legal-answers-muted">{{ row.created_at_formatted }}</td>
              <td>
                <NuxtLink :to="`/legal/questions/${row.question?.slug || row.question?.id}`" class="legal-answers-link legal-answers-link--sm">مشاهده</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="list.length && meta.total > meta.per_page" class="legal-answers-pagination">
        <button
          type="button"
          class="legal-answers-pagination-btn"
          :disabled="meta.current_page <= 1"
          @click="fetchList(meta.current_page - 1)"
        >
          قبلی
        </button>
        <span class="legal-answers-pagination-info">صفحه {{ meta.current_page }} از {{ meta.last_page }}</span>
        <button
          type="button"
          class="legal-answers-pagination-btn"
          :disabled="meta.current_page >= meta.last_page"
          @click="fetchList(meta.current_page + 1)"
        >
          بعدی
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const list = ref([]);
const meta = ref({ current_page: 1, last_page: 1, per_page: 15, total: 0 });
const loading = ref(true);

async function fetchList(page = 1) {
  loading.value = true;
  const res = await useGet({
    url: "legal/my-answers",
    includeAuthHeader: true,
    query: { page, per_page: 15 },
  });
  loading.value = false;
  list.value = res.data?.data ?? [];
  const m = res.data?.meta ?? {};
  meta.value = { current_page: m.current_page ?? 1, last_page: m.last_page ?? 1, per_page: m.per_page ?? 15, total: m.total ?? 0 };
}

function statusLabel(s) {
  const map = { pending: "در انتظار تایید", published: "منتشر شده", hidden: "مخفی", rejected: "رد شده" };
  return map[s] || s;
}
function statusClass(s) {
  const map = { published: "bg-green-100 text-green-800", pending: "bg-amber-100 text-amber-800", rejected: "bg-red-100 text-red-800", hidden: "bg-gray-200 text-gray-700" };
  return map[s] || "bg-gray-100 text-gray-600";
}

useHead({ title: "پاسخ‌های حقوقی من | داشبورد" });
await fetchList();
</script>

<style scoped>
@reference "tailwindcss";

.legal-answers-page {
  @apply space-y-6;
}

.legal-answers-table {
  @apply w-full text-right;
}
.legal-answers-table thead {
  @apply border-b border-gray-200 bg-gray-50/80;
}
.legal-answers-table th {
  @apply px-5 py-3.5 text-sm font-semibold text-gray-700;
}
.legal-answers-table tbody tr {
  @apply border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50;
}
.legal-answers-table td {
  @apply px-5 py-3.5 text-sm;
}
.legal-answers-link {
  @apply text-[var(--accent)] hover:underline line-clamp-2;
}
.legal-answers-link--sm {
  @apply inline-flex text-sm;
}
.legal-answers-badge {
  @apply ml-1 inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium;
}
.legal-answers-badge--best {
  @apply bg-green-100 text-green-800;
}
.legal-answers-muted {
  @apply text-gray-500;
}

.legal-answers-pagination {
  @apply flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 px-5 py-4;
}
.legal-answers-pagination-btn {
  @apply rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50;
}
.legal-answers-pagination-info {
  @apply text-sm text-gray-500;
}
</style>
