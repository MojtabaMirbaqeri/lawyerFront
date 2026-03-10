<template>
  <main class="legal-category-page">
    <LegalHero
      :title="categoryName"
      :subtitle="`سوالات حقوقی در دسته «${categoryName}»`"
    />

    <div class="container py-8 lg:py-10">
      <div v-if="pending" class="legal-loading">
        <UIcon name="lucide:loader-2" class="size-10 animate-spin text-gray-400" />
        <p class="mt-3 text-sm text-gray-500">در حال بارگذاری...</p>
      </div>

      <div v-else-if="!questions.length" class="legal-empty">
        <div class="legal-empty-icon-wrap">
          <UIcon name="lucide:help-circle" class="size-14 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-700">سوالی در این دسته یافت نشد</h3>
        <NuxtLink to="/legal/questions" class="legal-btn legal-btn--primary mt-6">
          همه سوالات
        </NuxtLink>
      </div>

      <div v-else class="legal-questions-grid">
        <NuxtLink
          v-for="q in questions"
          :key="q.id"
          :to="`/legal/questions/${q.slug || q.id}`"
          class="legal-question-card"
        >
          <div class="legal-question-card-body">
            <h2 class="legal-question-card-title">{{ q.title }}</h2>
            <p class="legal-question-card-excerpt">{{ (q.body || "").replace(/<[^>]+>/g, "").slice(0, 120) }}…</p>
            <div class="legal-question-card-meta">
              <span class="legal-question-card-meta-item">
                <UIcon name="lucide:message-circle" class="size-3.5" />
                {{ q.answers_count }} پاسخ
              </span>
              <span class="legal-question-card-meta-item">
                <UIcon name="lucide:calendar" class="size-3.5" />
                {{ q.created_at_formatted }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-if="total > perPage" class="legal-pagination-wrap">
        <UPagination
          v-model:page="page"
          :items-per-page="perPage"
          :total="total"
          show-edges
          :sibling-count="1"
          :ui="{ list: 'gap-1', item: 'min-w-9 h-9 text-sm rounded-lg', first: 'scale-x-[-1]', last: 'scale-x-[-1]', prev: 'scale-x-[-1]', next: 'scale-x-[-1]' }"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
const route = useRoute();
const slug = computed(() => route.params.slug);
const categoryName = ref(slug.value);
const page = ref(1);
const perPage = ref(15);
const total = ref(0);
const questions = ref([]);
const pending = ref(true);

async function fetchCategoryAndQuestions() {
  pending.value = true;
  const catRes = await useGet({ url: "legal/categories", includeAuthHeader: false });
  const cats = catRes.data?.data ?? catRes.data ?? [];
  const cat = Array.isArray(cats) ? cats.find((c) => String(c.slug) === String(slug.value) || String(c.id) === String(slug.value)) : null;
  if (cat) categoryName.value = cat.name;
  const categoryId = cat?.id ?? null;
  const qRes = await useGet({
    url: "legal/questions",
    query: { category_id: categoryId, page: page.value, per_page: perPage.value },
    includeAuthHeader: false,
  });
  pending.value = false;
  const data = qRes.data?.data ?? qRes.data;
  questions.value = Array.isArray(data) ? data : [];
  total.value = qRes.data?.meta?.total ?? questions.value.length;
}

watch(slug, () => { page.value = 1; fetchCategoryAndQuestions(); });
watch(page, () => fetchCategoryAndQuestions());

useHead({ title: () => `${categoryName.value} | سوال و جواب حقوقی | وکیل وکیل` });
useSeoMeta({ title: () => `سوالات ${categoryName.value} | وکیل وکیل` });
await fetchCategoryAndQuestions();
</script>

<style scoped>
@reference "tailwindcss";

.legal-category-page {
  @apply min-h-screen bg-[var(--surface-subtle)];
}

.legal-loading {
  @apply flex flex-col items-center justify-center py-16;
}
.legal-empty {
  @apply flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200 bg-white;
}
.legal-empty-icon-wrap {
  @apply mb-4 rounded-full bg-gray-100 p-6;
}

.legal-questions-grid {
  @apply grid gap-5 sm:grid-cols-2 lg:grid-cols-3;
}
.legal-question-card {
  @apply block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-[var(--accent)]/30 hover:shadow-md;
}
.legal-question-card:hover .legal-question-card-title {
  color: var(--accent);
}
.legal-question-card-body {
  @apply flex flex-col;
}
.legal-question-card-title {
  @apply font-semibold text-gray-900 line-clamp-2 leading-snug transition-colors;
}
.legal-question-card-excerpt {
  @apply mt-2 text-sm text-gray-500 line-clamp-2;
}
.legal-question-card-meta {
  @apply mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400;
}
.legal-question-card-meta-item {
  @apply inline-flex items-center gap-1.5;
}

.legal-btn {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all no-underline;
}
.legal-btn--primary {
  @apply bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] hover:shadow-md;
}

.legal-pagination-wrap {
  @apply mt-10 flex justify-center;
}
</style>
