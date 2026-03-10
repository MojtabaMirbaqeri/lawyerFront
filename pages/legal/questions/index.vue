<template>
  <main class="legal-questions-page">
    <LegalHero
      title="سوال و جواب حقوقی"
      subtitle="سوالات حقوقی کاربران و پاسخ وکلای متخصص. سوال خود را بپرسید یا در پاسخ‌ها جستجو کنید."
    >
      <template #actions>
        <NuxtLink
          to="/legal/ask"
          class="legal-cta-btn legal-cta-btn--hero"
        >
          <UIcon name="lucide:plus-circle" class="size-5" />
          ثبت سوال
        </NuxtLink>
      </template>
    </LegalHero>

    <div class="container py-8 lg:py-10">
      <h2 class="legal-section-title">جستجو در سوالات</h2>
      <div class="legal-filters-card">
        <div class="legal-filters-row">
          <div class="legal-search-wrap">
            <UIcon name="lucide:search" class="legal-input-icon" />
            <input
              v-model="searchQuery"
              type="text"
              class="legal-input legal-input--search"
              placeholder="جستجو در سوالات..."
              @keyup.enter="fetchQuestions"
            />
          </div>
          <select
            v-model="categoryId"
            class="legal-input legal-select"
            @change="fetchQuestions"
          >
            <option :value="null">همه دسته‌ها</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <select
            v-model="sort"
            class="legal-input legal-select"
            @change="fetchQuestions"
          >
            <option value="newest">جدیدترین</option>
            <option value="most_answered">بیشترین پاسخ</option>
            <option value="most_viewed">بیشترین بازدید</option>
          </select>
          <button
            type="button"
            class="legal-btn legal-btn--primary"
            @click="fetchQuestions"
          >
            <UIcon name="lucide:search" class="size-4" />
            جستجو
          </button>
        </div>
      </div>

      <div v-if="pending" class="legal-loading">
        <UIcon name="lucide:loader-2" class="size-10 animate-spin text-gray-400" />
        <p class="mt-3 text-sm text-gray-500">در حال بارگذاری سوالات...</p>
      </div>

      <div v-else-if="!questions.length" class="legal-empty-wrap">
        <div class="legal-empty">
          <div class="legal-empty-icon-wrap">
            <UIcon name="lucide:help-circle" class="size-16 text-[var(--accent)]" />
          </div>
          <h3 class="legal-empty-title">سوالی یافت نشد</h3>
          <p class="legal-empty-desc">با فیلترهای دیگر جستجو کنید یا اولین سوال را بپرسید.</p>
          <NuxtLink to="/legal/ask" class="legal-btn legal-btn--primary legal-btn--empty-cta">
            <UIcon name="lucide:plus-circle" class="size-5" />
            ثبت سوال جدید
          </NuxtLink>
        </div>
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
            <p class="legal-question-card-excerpt" v-html="excerpt(q.body)"></p>
            <div class="legal-question-card-meta">
              <span class="legal-question-card-meta-item">
                <UIcon name="lucide:user" class="size-3.5" />
                {{ q.author_name || 'ناشناس' }}
              </span>
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
          <div v-if="q.category" class="legal-question-card-tag">
            {{ q.category.name }}
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
useHead({ title: "سوال و جواب حقوقی | وکیل وکیل" });
useSeoMeta({
  title: "سوال و جواب حقوقی | وکیل وکیل",
  description: "سوالات حقوقی کاربران و پاسخ وکلای متخصص. مشاوره حقوقی آنلاین.",
});

const page = ref(1);
const perPage = ref(15);
const total = ref(0);
const questions = ref([]);
const categories = ref([]);
const pending = ref(true);
const searchQuery = ref("");
const categoryId = ref(null);
const sort = ref("newest");

function excerpt(body) {
  if (!body) return "";
  const text = body.replace(/<[^>]+>/g, "").slice(0, 120);
  return text + (body.length > 120 ? "…" : "");
}

async function fetchCategories() {
  const res = await useGet({ url: "legal/categories", includeAuthHeader: false });
  const raw = res.data?.data ?? res.data;
  categories.value = Array.isArray(raw) ? raw : [];
}

async function fetchQuestions() {
  pending.value = true;
  const query = {
    page: page.value,
    per_page: perPage.value,
    sort: sort.value,
  };
  if (searchQuery.value) query.search = searchQuery.value;
  if (categoryId.value) query.category_id = categoryId.value;
  const res = await useGet({
    url: "legal/questions",
    query,
    includeAuthHeader: false,
  });
  pending.value = false;
  const data = res.data?.data ?? res.data;
  questions.value = Array.isArray(data) ? data : [];
  total.value = res.data?.meta?.total ?? questions.value.length;
}

watch(() => page.value, () => fetchQuestions());
await fetchCategories();
await fetchQuestions();
</script>

<style scoped>
@reference "tailwindcss";

.legal-questions-page {
  @apply min-h-screen bg-[var(--surface-subtle)];
}

.legal-cta-btn {
  @apply inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all no-underline;
}
.legal-cta-btn--hero {
  @apply bg-white text-[#1e3a5f] shadow-[0_4px_20px_rgba(0,0,0,0.2)] border-2 border-white/90 hover:bg-white hover:shadow-[0_6px_28px_rgba(0,0,0,0.25)] hover:scale-[1.02] active:scale-[0.98];
}

.legal-section-title {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.legal-filters-card {
  @apply rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm mb-8;
}
.legal-filters-row {
  @apply flex items-center gap-3;
}
.legal-search-wrap {
  @apply relative flex-1 min-w-[200px];
}
.legal-input-icon {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none;
}
.legal-input {
  @apply w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm transition-colors focus:border-[var(--accent)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20;
}
.legal-input--search {
  @apply pe-10;
}
.legal-select {
  @apply min-w-[140px] appearance-none bg-no-repeat;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-position: left 0.5rem center;
  background-size: 1.25rem;
  padding-left: 2.25rem;
}
.legal-btn {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all;
}
.legal-btn--primary {
  @apply bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-dark)] hover:shadow-md;
}

.legal-loading {
  @apply flex flex-col items-center justify-center py-16;
}

.legal-empty-wrap {
  @apply flex justify-center py-8;
}
.legal-empty {
  @apply flex flex-col items-center justify-center text-center rounded-2xl border border-gray-200 bg-white shadow-sm p-8 md:p-12 max-w-md w-full;
}
.legal-empty-icon-wrap {
  @apply mb-5 rounded-full bg-[var(--accent)]/10 p-6;
}
.legal-empty-title {
  @apply text-xl font-bold text-gray-800;
}
.legal-empty-desc {
  @apply mt-2 text-sm text-gray-500;
}
.legal-btn--empty-cta {
  @apply mt-6 px-6 py-3 text-base font-semibold;
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
.legal-question-card-tag {
  @apply mt-3 inline-flex w-fit rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600;
}

.legal-pagination-wrap {
  @apply mt-10 flex justify-center;
}
</style>
