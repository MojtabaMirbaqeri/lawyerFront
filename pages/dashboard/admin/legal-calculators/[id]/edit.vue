<template>
  <div class="legal-calc-edit">
    <div class="page-header flex items-center gap-4 mb-6">
      <NuxtLink to="/dashboard/admin/legal-calculators" class="text-primary-600 hover:underline">بازگشت به لیست</NuxtLink>
      <h1 class="text-xl font-bold">ویرایش ماشین‌حساب</h1>
    </div>
    <div v-if="pending" class="card-dashboard p-8 text-center text-gray-500">در حال بارگذاری...</div>
    <form v-else-if="form" class="card-dashboard p-6 space-y-4" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium mb-1">عنوان</label>
        <input v-model="form.title" type="text" class="w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">slug</label>
        <input v-model="form.slug" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">توضیح کوتاه</label>
        <input v-model="form.short_description" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">دسته</label>
        <input v-model="form.category" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">نوع خروجی</label>
        <select v-model="form.result_type" class="w-full rounded border px-3 py-2">
          <option value="amount">amount</option>
          <option value="table">table</option>
          <option value="breakdown">breakdown</option>
          <option value="date">date</option>
          <option value="mixed">mixed</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <input v-model="form.is_active" type="checkbox" />
        <label>فعال</label>
      </div>
      <div class="flex items-center gap-2">
        <input v-model="form.is_featured" type="checkbox" />
        <label>ویژه</label>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">متن disclaimer</label>
        <textarea v-model="form.disclaimer_text" class="w-full rounded border px-3 py-2" rows="2"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">عنوان CTA</label>
        <input v-model="form.cta_title" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">لینک CTA</label>
        <input v-model="form.cta_url" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">meta_title</label>
        <input v-model="form.meta_title" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">meta_description</label>
        <input v-model="form.meta_description" type="text" class="w-full rounded border px-3 py-2" />
      </div>
      <button type="submit" class="btn-primary" :disabled="savePending">{{ savePending ? 'در حال ذخیره...' : 'ذخیره' }}</button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const id = computed(() => route.params.id as string)
const form = ref<Record<string, unknown> | null>(null)
const pending = ref(true)
const savePending = ref(false)

async function load() {
  pending.value = true
  const res = await useGet({ url: `admin/legal-calculators/${id.value}`, includeAuthHeader: true }, false)
  const body = res.data as { data?: Record<string, unknown> }
  form.value = body?.data ?? body ?? null
  pending.value = false
}

async function save() {
  if (!form.value) return
  savePending.value = true
  await usePatch({
    url: `admin/legal-calculators/${id.value}`,
    includeAuthHeader: true,
    body: form.value,
  }, true)
  savePending.value = false
}

onMounted(() => load())
watch(id, load)
</script>
