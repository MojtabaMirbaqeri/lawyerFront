<template>
  <section>
    <div class="page-header mb-6">
      <h1 class="page-title">سوالات من</h1>
      <p class="page-desc">سوالات حقوقی که شما ثبت کرده‌اید.</p>
    </div>
    <NuxtLink to="/legal/ask" class="mb-4 inline-block rounded-lg bg-[var(--ui-primary)] px-4 py-2 text-sm text-white">
      ثبت سوال جدید
    </NuxtLink>
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
    </div>
    <div v-else-if="!list.length" class="empty-state py-16 text-center">
      <UIcon name="lucide:help-circle" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600">هنوز سوالی ثبت نکرده‌اید.</p>
      <NuxtLink to="/legal/ask" class="mt-4 inline-block text-[var(--accent)]">ثبت سوال</NuxtLink>
    </div>
    <div v-else class="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <table class="w-full text-right">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="p-3 text-sm font-medium text-gray-700">عنوان</th>
            <th class="p-3 text-sm font-medium text-gray-700">وضعیت</th>
            <th class="p-3 text-sm font-medium text-gray-700">تاریخ</th>
            <th class="p-3 text-sm font-medium text-gray-700">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in list" :key="row.id" class="border-b border-gray-100 last:border-0">
            <td class="p-3">
              <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="text-[var(--accent)] hover:underline line-clamp-2">
                {{ row.title }}
              </NuxtLink>
            </td>
            <td class="p-3">
              <span :class="['badge', statusBadgeClass(row.status)]">{{ statusLabel(row.status) }}</span>
            </td>
            <td class="p-3 text-sm text-gray-500">{{ row.created_at_formatted }}</td>
            <td class="p-3">
              <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="text-sm text-[var(--accent)]">مشاهده</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="meta.total > meta.per_page" class="flex justify-center gap-2 p-3 border-t">
        <button type="button" :disabled="meta.current_page <= 1" @click="fetchList(meta.current_page - 1)">قبلی</button>
        <span>صفحه {{ meta.current_page }} از {{ meta.last_page }}</span>
        <button type="button" :disabled="meta.current_page >= meta.last_page" @click="fetchList(meta.current_page + 1)">بعدی</button>
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
    url: "legal/my-questions",
    includeAuthHeader: true,
    query: { page, per_page: 15 },
  });
  loading.value = false;
  list.value = res.data?.data ?? [];
  const m = res.data?.meta ?? {};
  meta.value = { current_page: m.current_page ?? 1, last_page: m.last_page ?? 1, per_page: m.per_page ?? 15, total: m.total ?? 0 };
}

function statusLabel(s) {
  const map = { draft: "پیش‌نویس", pending: "در انتظار تایید", published: "منتشر شده", closed: "بسته", rejected: "رد شده", hidden: "مخفی" };
  return map[s] || s;
}
function statusBadgeClass(s) {
  const map = { published: "badge-success", pending: "badge-warning", rejected: "badge-error", closed: "badge-gray", hidden: "badge-gray" };
  return map[s] || "badge-gray";
}

useHead({ title: "سوالات من | داشبورد" });
await fetchList();
</script>

<style scoped>
@reference "tailwindcss";

.legal-questions-page {
  @apply space-y-6;
}
</style>
