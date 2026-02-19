<template>
  <main>
    <div class="container py-8 lg:py-12">
      <div v-if="pending" class="flex justify-center py-12">
        <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
      </div>

      <div v-else-if="!article" class="empty-state py-16 text-center">
        <UIcon name="lucide:file-x" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-600">مقاله یافت نشد</h3>
        <NuxtLink to="/articles" class="mt-4 inline-block text-[var(--accent)] hover:underline">
          بازگشت به لیست مقالات
        </NuxtLink>
      </div>

      <article v-else class="article-single max-w-3xl mx-auto">
        <header class="mb-8">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">{{ article.title }}</h1>
          <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{{ article.author_name }}</span>
            <span>•</span>
            <span>{{ article.created_at_formatted }}</span>
          </div>
        </header>
        <div v-if="article.image" class="mb-8 overflow-hidden rounded-xl max-w-xs">
          <ArticleImage :image="article.image" :alt="article.title" variant="single" loading="lazy" class="w-full h-28" />
        </div>
        <div class="article-body ql-editor prose prose-gray max-w-none" v-html="articleBodyHtml"></div>
        <footer class="mt-12 pt-6 border-t border-gray-200">
          <NuxtLink
            to="/articles"
            class="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
          >
            <UIcon name="lucide:arrow-right" class="w-4 h-4 scale-x-[-1]" />
            بازگشت به لیست مقالات
          </NuxtLink>
        </footer>
      </article>
    </div>
  </main>
</template>

<script setup>
import "quill/dist/quill.snow.css";

const route = useRoute();
const slug = computed(() => route.params.slug);

const article = ref(null);
const pending = ref(true);

const articleBodyHtml = computed(() => {
  const b = article.value?.body ?? "";
  if (!b) return "";
  if (b.includes("<") && b.includes(">")) return b;
  return b.replace(/\n/g, "<br />");
});

async function fetchArticle() {
  pending.value = true;
  const res = await useGet({
    url: `articles/slug/${slug.value}`,
    includeAuthHeader: false,
  });
  pending.value = false;
  if (res.data?.data) {
    article.value = res.data.data;
  } else {
    article.value = null;
  }
}

useHead({
  title: () => (article.value ? `${article.value.title} | وکیل وکیل` : "مقاله | وکیل وکیل"),
});
useSeoMeta({
  title: () => (article.value ? `${article.value.title} | وکیل وکیل` : "مقاله"),
  description: () => article.value?.summary || "مقاله حقوقی",
});

await fetchArticle();
</script>

<style scoped>
@reference "tailwindcss";
.article-body {
  text-align: right;
}
.prose br {
  display: block;
  content: "";
  margin-top: 0.5em;
}
</style>
