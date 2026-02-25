<template>
  <div class="rates-admin">
    <div class="page-header flex items-center gap-4 mb-6">
      <NuxtLink to="/dashboard/admin/legal-calculators" class="text-primary-600 hover:underline">لیست ماشین‌حساب‌ها</NuxtLink>
      <h1 class="text-xl font-bold">نرخ‌ها و ضرایب</h1>
    </div>
    <div class="card-dashboard p-6">
      <h2 class="font-semibold mb-4">افزودن نرخ</h2>
      <form class="flex flex-wrap gap-4 items-end mb-8" @submit.prevent="addRate">
        <div>
          <label class="block text-sm mb-1">کلید (key)</label>
          <input v-model="newRate.key" type="text" class="rounded border px-3 py-2 w-48" required />
        </div>
        <div>
          <label class="block text-sm mb-1">نوع مقدار</label>
          <select v-model="newRate.value_type" class="rounded border px-3 py-2">
            <option value="numeric">numeric</option>
            <option value="text">text</option>
            <option value="json">json</option>
            <option value="boolean">boolean</option>
          </select>
        </div>
        <div v-if="newRate.value_type === 'numeric'">
          <label class="block text-sm mb-1">مقدار عددی</label>
          <input v-model.number="newRate.value_numeric" type="number" step="any" class="rounded border px-3 py-2 w-32" />
        </div>
        <div v-else-if="newRate.value_type === 'text'">
          <label class="block text-sm mb-1">مقدار متنی</label>
          <input v-model="newRate.value_text" type="text" class="rounded border px-3 py-2 w-48" />
        </div>
        <button type="submit" class="btn-primary" :disabled="addPending">افزودن</button>
      </form>
      <table class="w-full text-right">
        <thead>
          <tr class="border-b">
            <th class="p-2">کلید</th>
            <th class="p-2">نوع</th>
            <th class="p-2">مقدار</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rates" :key="r.id" class="border-b">
            <td class="p-2 font-mono text-sm">{{ r.key }}</td>
            <td class="p-2">{{ r.value_type }}</td>
            <td class="p-2 text-sm">{{ displayValue(r) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="rates.length === 0 && !pending" class="text-gray-500 py-4">نرخی ثبت نشده است.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const versionId = computed(() => route.params.versionId as string)
const rates = ref<Record<string, unknown>[]>([])
const pending = ref(true)
const addPending = ref(false)
const newRate = reactive({
  key: '',
  value_type: 'numeric' as string,
  value_numeric: 0 as number | '',
  value_text: '',
})

function displayValue(r: Record<string, unknown>): string {
  if (r.value_type === 'numeric') return String(r.value_numeric ?? '')
  if (r.value_type === 'text') return String(r.value_text ?? '')
  if (r.value_type === 'json') return JSON.stringify(r.value_json ?? {})
  return String(r.value_text ?? '')
}

async function load() {
  pending.value = true
  const res = await useGet({
    url: `admin/legal-calculator-versions/${versionId.value}/rates`,
    includeAuthHeader: true,
  }, false)
  const body = res.data as { data?: unknown[] }
  rates.value = (Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []) as Record<string, unknown>[]
  pending.value = false
}

async function addRate() {
  addPending.value = true
  const body: Record<string, unknown> = {
    key: newRate.key,
    value_type: newRate.value_type,
  }
  if (newRate.value_type === 'numeric') body.value_numeric = newRate.value_numeric
  else if (newRate.value_type === 'text') body.value_text = newRate.value_text
  await usePost({
    url: `admin/legal-calculator-versions/${versionId.value}/rates`,
    includeAuthHeader: true,
    body,
  }, true)
  addPending.value = false
  await load()
}

onMounted(() => load())
watch(versionId, load)
</script>
