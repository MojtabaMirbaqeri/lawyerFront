<template>
  <div class="legal-calc-edit-page">
    <div class="page-header">
      <div class="flex items-center gap-3">
        <NuxtLink to="/dashboard/admin/legal-calculators" class="btn-secondary text-sm! py-1.5! px-3!">
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
          بازگشت به لیست
        </NuxtLink>
        <h1 class="page-title">ویرایش ماشین‌حساب</h1>
      </div>
    </div>

    <div v-if="pending" class="card-dashboard p-8 text-center">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
      <p class="text-sm text-gray-500 mt-2">در حال بارگذاری...</p>
    </div>

    <form v-else-if="form" class="card-dashboard card-dashboard-body" @submit.prevent="save">
      <div class="ds-form-grid space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">عنوان</label>
          <input v-model="form.title" type="text" class="input-dashboard w-full" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">slug</label>
          <input v-model="form.slug" type="text" class="input-dashboard w-full font-mono" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">توضیح کوتاه</label>
          <input v-model="form.short_description" type="text" class="input-dashboard w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">دسته</label>
          <input v-model="form.category" type="text" class="input-dashboard w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">نوع خروجی</label>
          <select v-model="form.result_type" class="select-dashboard w-full">
            <option value="amount">amount</option>
            <option value="table">table</option>
            <option value="breakdown">breakdown</option>
            <option value="date">date</option>
            <option value="mixed">mixed</option>
          </select>
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_active" type="checkbox" class="rounded border-gray-300" />
            <span class="text-sm font-medium text-gray-700">فعال</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="form.is_featured" type="checkbox" class="rounded border-gray-300" />
            <span class="text-sm font-medium text-gray-700">ویژه</span>
          </label>
        </div>
        <div class="col-span-full">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">متن disclaimer</label>
          <textarea v-model="form.disclaimer_text" class="input-dashboard w-full" rows="3" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">عنوان CTA</label>
          <input v-model="form.cta_title" type="text" class="input-dashboard w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">لینک CTA</label>
          <input v-model="form.cta_url" type="text" class="input-dashboard w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">meta_title</label>
          <input v-model="form.meta_title" type="text" class="input-dashboard w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">meta_description</label>
          <input v-model="form.meta_description" type="text" class="input-dashboard w-full" />
        </div>
      </div>
      <div class="mt-6 pt-4 border-t border-gray-100">
        <button type="submit" class="btn-primary" :disabled="savePending">
          {{ savePending ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}
        </button>
      </div>
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

useHead({ title: 'ویرایش ماشین‌حساب | پنل ادمین' })
</script>

<style scoped>
@reference "tailwindcss";

.legal-calc-edit-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.page-title {
  @apply text-xl font-bold text-gray-900;
}

.ds-form-grid {
  @apply grid gap-4;
}
@media (min-width: 640px) {
  .ds-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.ds-form-grid .col-span-full {
  grid-column: 1 / -1;
}
</style>
