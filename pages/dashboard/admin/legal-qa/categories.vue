<template>
  <section class="legal-qa-categories">
    <div class="page-header">
      <div>
        <h1 class="page-title">دسته‌بندی‌های سوال و جواب حقوقی</h1>
        <p class="page-description">افزودن و ویرایش دسته‌بندی‌ها برای سوالات حقوقی.</p>
      </div>
      <NuxtLink to="/dashboard/admin/legal-qa" class="btn-secondary no-underline">
        <UIcon name="lucide:arrow-right" class="size-4 scale-x-[-1]" />
        بازگشت به مدیریت سوال و جواب
      </NuxtLink>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body">
        <h2 class="card-dashboard-title mb-4">{{ editingId ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی' }}</h2>
        <form class="categories-form" @submit.prevent="saveCategory">
          <div class="categories-form-grid">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">نام <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="مثال: حقوق خانواده"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">توضیح (اختیاری)</label>
              <input
                v-model="form.description"
                type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="توضیح کوتاه"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ترتیب نمایش</label>
              <input
                v-model.number="form.sort_order"
                type="number"
                min="0"
                class="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div class="categories-form-checkbox pt-7">
              <input v-model="form.is_active" type="checkbox" id="cat-active" class="categories-form-checkbox-input" />
              <label for="cat-active" class="categories-form-checkbox-label">فعال (در فرم ثبت سوال نمایش داده شود)</label>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button type="submit" class="btn-primary">
              {{ editingId ? 'بروزرسانی' : 'افزودن' }}
            </button>
            <button v-if="editingId" type="button" class="btn-secondary" @click="cancelEdit">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="card-dashboard">
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>نام</th>
              <th>اسلاگ</th>
              <th>ترتیب</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td class="font-medium">{{ row.name }}</td>
              <td class="text-gray-500 text-sm">{{ row.slug }}</td>
              <td>{{ row.sort_order }}</td>
              <td>
                <span :class="['badge', row.is_active ? 'badge-success' : 'badge-error']">
                  {{ row.is_active ? 'فعال' : 'غیرفعال' }}
                </span>
              </td>
              <td class="flex gap-2">
                <button type="button" class="btn-secondary text-sm! py-1.5! px-3!" @click="startEdit(row)">
                  ویرایش
                </button>
                <button type="button" class="btn-danger text-sm! py-1.5! px-3!" @click="confirmDelete(row)">
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!list.length" class="empty-state py-16">
          <p class="text-gray-500">دسته‌بندی ثبت نشده است.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const list = ref([]);
const loading = ref(true);
const editingId = ref(null);
const form = ref({
  name: '',
  description: '',
  sort_order: 0,
  is_active: true,
});

async function fetchList() {
  loading.value = true;
  const res = await useGet({
    url: 'admin/legal/categories',
    includeAuthHeader: true,
  });
  loading.value = false;
  const raw = res.data?.data ?? res.data;
  list.value = Array.isArray(raw) ? raw : [];
}

function startEdit(row) {
  editingId.value = row.id;
  form.value = {
    name: row.name,
    description: row.description ?? '',
    sort_order: row.sort_order ?? 0,
    is_active: !!row.is_active,
  };
}

function cancelEdit() {
  editingId.value = null;
  form.value = { name: '', description: '', sort_order: 0, is_active: true };
}

async function saveCategory() {
  if (editingId.value) {
    const res = await usePatch({
      url: `admin/legal/categories/${editingId.value}`,
      includeAuthHeader: true,
      body: form.value,
    });
    if (res.data?.data || res.statusCode === 200) {
      useToast().add({ title: 'دسته‌بندی بروزرسانی شد', color: 'success' });
      cancelEdit();
      await fetchList();
    }
  } else {
    const res = await usePost({
      url: 'admin/legal/categories',
      includeAuthHeader: true,
      body: form.value,
    });
    if (res.data?.data || res.statusCode === 201) {
      useToast().add({ title: 'دسته‌بندی اضافه شد', color: 'success' });
      form.value = { name: '', description: '', sort_order: 0, is_active: true };
      await fetchList();
    }
  }
}

async function confirmDelete(row) {
  if (!confirm(`آیا از حذف «${row.name}» اطمینان دارید؟`)) return;
  const res = await useDelete({
    url: `admin/legal/categories/${row.id}`,
    includeAuthHeader: true,
  });
  if (res?.statusCode === 200 || res?.status) {
    useToast().add({ title: 'دسته‌بندی حذف شد', color: 'success' });
    if (editingId.value === row.id) cancelEdit();
    await fetchList();
  }
}

useHead({ title: 'دسته‌بندی‌های سوال و جواب | ادمین' });
await fetchList();
</script>

<style scoped>
@reference "tailwindcss";

.legal-qa-categories {
  @apply space-y-6;
}

.categories-form-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
}

.categories-form-checkbox {
  @apply flex items-center gap-3;
}

.categories-form-checkbox-input {
  @apply h-5 w-5 rounded border-gray-300 text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 focus:ring-offset-0 cursor-pointer;
}

.categories-form-checkbox-label {
  @apply text-sm font-medium text-gray-700 cursor-pointer select-none;
}
</style>
