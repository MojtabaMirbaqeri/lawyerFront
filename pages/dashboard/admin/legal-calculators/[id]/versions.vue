<template>
  <div class="versions-admin">
    <div class="page-header flex items-center gap-4 mb-6">
      <NuxtLink to="/dashboard/admin/legal-calculators" class="text-primary-600 hover:underline">لیست ماشین‌حساب‌ها</NuxtLink>
      <NuxtLink :to="`/dashboard/admin/legal-calculators/${id}/edit`" class="text-primary-600 hover:underline">ویرایش ماشین‌حساب</NuxtLink>
      <h1 class="text-xl font-bold">نسخه‌ها</h1>
    </div>
    <div class="card-dashboard p-6">
      <h2 class="font-semibold mb-4">افزودن نسخه</h2>
      <form class="flex flex-wrap gap-4 items-end mb-8" @submit.prevent="addVersion">
        <div>
          <label class="block text-sm mb-1">برچسب نسخه (مثلاً 1404)</label>
          <input v-model="newVersion.version_label" type="text" class="rounded border px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">از تاریخ</label>
          <input v-model="newVersion.effective_from" type="date" class="rounded border px-3 py-2" required />
        </div>
        <div>
          <label class="block text-sm mb-1">مرجع قانونی</label>
          <input v-model="newVersion.legal_reference" type="text" class="rounded border px-3 py-2" />
        </div>
        <button type="submit" class="btn-primary" :disabled="addPending">افزودن</button>
      </form>
      <table class="w-full text-right">
        <thead>
          <tr class="border-b">
            <th class="p-2">برچسب</th>
            <th class="p-2">از تاریخ</th>
            <th class="p-2">فعال</th>
            <th class="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in versions" :key="v.id" class="border-b">
            <td class="p-2">{{ v.version_label }}</td>
            <td class="p-2">{{ v.effective_from }}</td>
            <td class="p-2">{{ v.is_active ? 'بله' : 'خیر' }}</td>
            <td class="p-2">
              <NuxtLink :to="`/dashboard/admin/legal-calculators/versions/${v.id}/rates`" class="text-primary-600 hover:underline text-sm">نرخ‌ها</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="versions.length === 0 && !pending" class="text-gray-500 py-4">نسخه‌ای ثبت نشده است.</p>
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
const newVersion = reactive({ version_label: '', effective_from: '', legal_reference: '' })

async function load() {
  pending.value = true
  const res = await useGet({ url: `admin/legal-calculators/${id.value}/versions`, includeAuthHeader: true }, false)
  const body = res.data as { data?: unknown[] }
  versions.value = (Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []) as Record<string, unknown>[]
  pending.value = false
}

async function addVersion() {
  addPending.value = true
  await usePost({
    url: `admin/legal-calculators/${id.value}/versions`,
    includeAuthHeader: true,
    body: newVersion,
  }, true)
  addPending.value = false
  await load()
}

onMounted(() => load())
watch(id, load)
</script>
