<template>
  <main>
    <div class="container py-8 lg:py-12">
      <div class="page-header mb-8">
        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">مقالات</h1>
        <p class="text-gray-500 mt-1">آخرین مقالات و مطالب حقوقی</p>
      </div>

      <div v-if="pending" class="flex justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="!articles.length" class="empty-state py-16 text-center">
        <UIcon name="lucide:file-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-600">مقاله‌ای یافت نشد</h3>
        <p class="text-gray-500 text-sm mt-1">به زودی مقالات جدید منتشر می‌شود.</p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="article in articles"
          :key="article.id"
          :to="`/articles/${article.slug}`"
          class="article-card group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
        >
          <div v-if="article.image" class="mb-4 overflow-hidden rounded-lg max-w-xs h-28">
            <ArticleImage :image="article.image" :alt="article.title" variant="card" loading="lazy" class="h-28 w-full" />
          </div>
          <div v-else class="mb-4 flex h-28 items-center justify-center rounded-lg bg-gray-100 max-w-xs">
            <UIcon name="lucide:file-text" class="w-12 h-12 text-gray-400" />
          </div>
          <h2 class="font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--accent)]">
            {{ article.title }}
          </h2>
          <p v-if="article.summary" class="mt-2 text-sm text-gray-500 line-clamp-2">
            {{ article.summary }}
          </p>
          <div class="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>{{ article.author_name }}</span>
            <span>{{ article.created_at_formatted }}</span>
          </div>
        </NuxtLink>
      </div>

      <div v-if="total > perPage" class="mt-8 flex justify-center">
        <UPagination
          v-model:page="page"
          :items-per-page="perPage"
          :total="total"
          show-edges
          :sibling-count="1"
          :ui="{ list: 'gap-1', item: 'min-w-8 h-8 text-sm', first: 'scale-x-[-1]', last: 'scale-x-[-1]', prev: 'scale-x-[-1]', next: 'scale-x-[-1]' }"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
useHead({ title: "مقالات | وکیل وکیل" });
useSeoMeta({
  title: "مقالات | وکیل وکیل",
  description: "آخرین مقالات و مطالب حقوقی از وکلای متخصص.",
});

const page = ref(1);
const perPage = ref(15);
const total = ref(0);
const articles = ref([]);
const pending = ref(true);

async function fetchArticles() {
  pending.value = true;
  const res = await useGet({
    url: "articles",
    query: { page: page.value, per_page: perPage.value },
    includeAuthHeader: false,
  });
  pending.value = false;
  if (res.data?.data) {
    articles.value = res.data.data;
    total.value = res.data.meta?.total ?? res.data.data.length;
  } else {
    articles.value = [];
  }
}

watch(() => page.value, () => fetchArticles());
await fetchArticles();
</script>

<style scoped>
@reference "tailwindcss";
</style>
