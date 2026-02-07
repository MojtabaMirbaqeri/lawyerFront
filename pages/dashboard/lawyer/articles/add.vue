<template>
  <div class="article-form-page">
    <div class="page-header mb-6">
      <NuxtLink
        to="/dashboard/lawyer/articles"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <Icon name="lucide:arrow-right" class="w-4 h-4 scale-x-[-1]" />
        بازگشت به لیست مقالات
      </NuxtLink>
      <h1 class="page-title">افزودن مقاله</h1>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body p-6">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">عنوان *</label>
            <input
              v-model="state.title"
              type="text"
              class="input-dashboard w-full"
              placeholder="عنوان مقاله"
              maxlength="255"
            />
            <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">خلاصه</label>
            <textarea
              v-model="state.summary"
              class="input-dashboard w-full"
              rows="2"
              placeholder="خلاصه کوتاه (اختیاری)"
              maxlength="500"
            />
            <p v-if="errors.summary" class="text-red-500 text-xs mt-1">{{ errors.summary }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">متن مقاله *</label>
            <ClientOnly>
              <RichTextEditor v-model="state.body" placeholder="متن کامل مقاله" min-height="200px" />
              <template #fallback>
                <textarea
                  v-model="state.body"
                  class="input-dashboard w-full min-h-[200px]"
                  placeholder="متن کامل مقاله"
                />
              </template>
            </ClientOnly>
            <p v-if="errors.body" class="text-red-500 text-xs mt-1">{{ errors.body }}</p>
          </div>
          <div>
            <ArticleImageUpload v-model="state.image" />
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary" :disabled="loading">
              <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span v-else>ثبت مقاله</span>
            </button>
            <NuxtLink to="/dashboard/lawyer/articles" class="btn-secondary">انصراف</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "افزودن مقاله | وکیلینجا" });

const state = reactive({
  title: "",
  summary: "",
  body: "",
  image: "",
});
const errors = ref({});
const loading = ref(false);

function validate() {
  errors.value = {};
  if (!state.title?.trim()) errors.value.title = "عنوان الزامی است.";
  if (!state.body?.trim()) errors.value.body = "متن مقاله الزامی است.";
  if (state.summary?.length > 500) errors.value.summary = "خلاصه حداکثر ۵۰۰ کاراکتر.";
  return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
  if (!validate()) return;
  loading.value = true;
  const res = await usePost({
    url: "articles",
    includeAuthHeader: true,
    body: {
      title: state.title.trim(),
      summary: state.summary?.trim() || null,
      body: state.body.trim(),
      image: state.image?.trim() || null,
    },
  });
  loading.value = false;
  if (res.statusCode === 201 || res.statusCode === 200) {
    useToast().add({ title: "مقاله با موفقیت ثبت شد. پس از تایید ادمین نمایش داده می‌شود.", color: "success" });
    await navigateTo("/dashboard/lawyer/articles");
  }
}
</script>

<style scoped>
@reference "tailwindcss";
.page-title {
  @apply text-xl font-bold text-gray-900;
}
.input-dashboard {
  @apply rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)];
}
</style>
