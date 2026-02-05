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
      <h1 class="page-title">ویرایش مقاله</h1>
    </div>

    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
    </div>

    <div v-else-if="!article" class="card-dashboard p-8 text-center">
      <p class="text-gray-600">مقاله یافت نشد.</p>
      <NuxtLink to="/dashboard/lawyer/articles" class="text-[var(--accent)] mt-2 inline-block">
        بازگشت به لیست
      </NuxtLink>
    </div>

    <div v-else class="card-dashboard">
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
              <span v-else>ذخیره تغییرات</span>
            </button>
            <NuxtLink to="/dashboard/lawyer/articles" class="btn-secondary">انصراف</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = computed(() => route.params.id);

useHead({ title: "ویرایش مقاله | وکیلینجا" });

const article = ref(null);
const pending = ref(true);
const state = reactive({
  title: "",
  summary: "",
  body: "",
  image: "",
});
const errors = ref({});
const loading = ref(false);

async function fetchArticle() {
  pending.value = true;
  const res = await useGet({
    url: `articles/show/${id.value}`,
    includeAuthHeader: true,
  });
  pending.value = false;
  if (res.data?.data) {
    article.value = res.data.data;
    state.title = article.value.title;
    state.summary = article.value.summary ?? "";
    state.body = article.value.body ?? "";
    state.image = article.value.image ?? "";
  } else {
    article.value = null;
  }
}

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
  const res = await usePut({
    url: `articles/${id.value}`,
    includeAuthHeader: true,
    body: {
      title: state.title.trim(),
      summary: state.summary?.trim() || null,
      body: state.body.trim(),
      image: state.image?.trim() || null,
    },
  });
  loading.value = false;
  if (res.statusCode === 200) {
    useToast().add({ title: "مقاله با موفقیت بروزرسانی شد.", color: "success" });
    await fetchArticle();
  }
}

await fetchArticle();
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
