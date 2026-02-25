<template>
  <div class="legal-calculators-admin">
    <div class="page-header">
      <h1 class="page-title">ماشین‌حساب‌های حقوقی</h1>
      <p class="page-desc">{{ total }} ماشین‌حساب در سیستم</p>
    </div>
    <div class="card-dashboard">
      <div v-if="pending" class="p-8 text-center text-gray-500">در حال بارگذاری...</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-right">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="p-3 font-medium">عنوان</th>
              <th class="p-3 font-medium">slug</th>
              <th class="p-3 font-medium">دسته</th>
              <th class="p-3 font-medium">وضعیت</th>
              <th class="p-3 font-medium">نسخه‌ها</th>
              <th class="p-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="p-3">{{ item.title }}</td>
              <td class="p-3 font-mono text-sm">{{ item.slug }}</td>
              <td class="p-3">{{ item.category || '-' }}</td>
              <td class="p-3">
                <span :class="item.is_active ? 'text-green-600' : 'text-gray-400'">
                  {{ item.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="p-3">{{ item.versions_count ?? 0 }}</td>
              <td class="p-3">
                <NuxtLink
                  :to="`/dashboard/admin/legal-calculators/${item.id}/edit`"
                  class="text-primary-600 hover:underline text-sm"
                >
                  ویرایش
                </NuxtLink>
                <NuxtLink
                  :to="`/dashboard/admin/legal-calculators/${item.id}/versions`"
                  class="mr-3 text-primary-600 hover:underline text-sm"
                >
                  نسخه‌ها
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="data.length === 0 && !pending" class="p-8 text-center text-gray-500">
          ماشین‌حسابی یافت نشد. ابتدا دیتابیس را seed کنید.
        </div>
      </div>
      <div v-if="total > 20" class="flex justify-between p-4 border-t">
        <span class="text-sm text-gray-500">صفحه {{ page }} از {{ Math.ceil(total / 20) }}</span>
        <button class="btn-secondary text-sm" @click="page++" :disabled="page >= Math.ceil(total / 20)">بعدی</button>
        <button class="btn-secondary text-sm" @click="page--" :disabled="page <= 1">قبلی</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const data = ref<Record<string, unknown>[]>([])
const total = ref(0)
const page = ref(1)
const pending = ref(true)

async function load() {
  pending.value = true
  const res = await useGet({
    url: 'admin/legal-calculators',
    includeAuthHeader: true,
    query: { per_page: 20, page: page.value },
  }, false)
  const body = res.data as { data?: { data?: unknown[]; total?: number }; data?: unknown[] }
  const list = body?.data?.data ?? body?.data
  if (Array.isArray(list)) {
    data.value = list
    total.value = (body?.data as { total?: number })?.total ?? list.length
  }
  pending.value = false
}

onMounted(load)
watch(page, load)
</script>

<style scoped>
@reference "tailwindcss";

.page-header { @apply mb-6; }
.page-title { @apply text-xl font-bold text-gray-900; }
.page-desc { @apply text-sm text-gray-500; }
</style>
