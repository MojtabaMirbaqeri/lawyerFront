<template>
  <section class="legal-qa-admin">
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت سوال و جواب حقوقی</h1>
        <p class="page-description">تایید سوالات و پاسخ‌های در انتظار و مدیریت وضعیت.</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/dashboard/admin/legal-qa/reports" class="btn-secondary no-underline">
          <UIcon name="lucide:flag" class="size-4" />
          گزارش‌ها
        </NuxtLink>
        <NuxtLink to="/dashboard/admin/legal-qa/categories" class="btn-secondary no-underline">
          <UIcon name="lucide:folder-tree" class="size-4" />
          دسته‌بندی‌ها
        </NuxtLink>
      </div>
    </div>

    <div class="legal-qa-tabs">
      <button
        type="button"
        :class="['legal-qa-tab', tab === 'questionsPending' && 'legal-qa-tab--active']"
        @click="tab = 'questionsPending'; fetchQuestionsPending()"
      >
        <UIcon name="lucide:message-circle-question" class="size-4" />
        سوالات در انتظار
        <span v-if="questionsPending.length" class="legal-qa-tab-count">{{ questionsPending.length }}</span>
      </button>
      <button
        type="button"
        :class="['legal-qa-tab', tab === 'questionsPublished' && 'legal-qa-tab--active']"
        @click="tab = 'questionsPublished'; fetchQuestionsPublished()"
      >
        <UIcon name="lucide:check-circle" class="size-4" />
        سوالات تایید شده
        <span v-if="questionsPublished.length" class="legal-qa-tab-count">{{ questionsPublished.length }}</span>
      </button>
      <button
        type="button"
        :class="['legal-qa-tab', tab === 'questionsHidden' && 'legal-qa-tab--active']"
        @click="tab = 'questionsHidden'; fetchQuestionsHidden()"
      >
        <UIcon name="lucide:eye-off" class="size-4" />
        سوالات غیرفعال شده
        <span v-if="questionsHidden.length" class="legal-qa-tab-count">{{ questionsHidden.length }}</span>
      </button>
      <button
        type="button"
        :class="['legal-qa-tab', tab === 'answers' && 'legal-qa-tab--active']"
        @click="tab = 'answers'; fetchAnswers()"
      >
        <UIcon name="lucide:message-square" class="size-4" />
        پاسخ‌های در انتظار
        <span v-if="answers.length" class="legal-qa-tab-count">{{ answers.length }}</span>
      </button>
    </div>

    <div class="card-dashboard">
      <div v-if="loading" class="legal-qa-loading">
        <UIcon name="lucide:loader-2" class="size-10 animate-spin text-gray-400" />
        <p class="mt-3 text-sm text-gray-500">در حال بارگذاری...</p>
      </div>

      <template v-else-if="tab === 'questionsPending'">
        <div v-if="!questionsPending.length" class="legal-qa-empty">
          <UIcon name="lucide:check-circle" class="size-12 text-green-500" />
          <p class="font-medium text-gray-700">سوالی در انتظار تایید نیست</p>
          <p class="text-sm text-gray-500 mt-1">همه سوالات بررسی شده‌اند.</p>
        </div>
        <div v-else class="legal-qa-table-wrap">
          <table class="legal-qa-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>ثبت‌کننده</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in questionsPending" :key="row.id">
                <td>
                  <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="legal-qa-link" target="_blank">
                    {{ row.title }}
                  </NuxtLink>
                </td>
                <td class="legal-qa-muted">{{ row.is_anonymous ? 'ناشناس' : (row.author_name || '—') }}</td>
                <td>
                  <span :class="['legal-qa-badge', row.status === 'pending' ? 'legal-qa-badge--pending' : 'legal-qa-badge--default']">
                    {{ statusQ(row.status) }}
                  </span>
                </td>
                <td class="legal-qa-muted">{{ row.created_at_formatted }}</td>
                <td>
                  <div class="legal-qa-actions">
                    <button
                      v-if="row.status === 'pending'"
                      type="button"
                      class="btn-success text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="setQuestionStatus(row.id, 'published')"
                    >
                      <UIcon name="lucide:check" class="size-4" />
                      تایید
                    </button>
                    <button
                      v-if="row.status === 'pending'"
                      type="button"
                      class="btn-danger text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="setQuestionStatus(row.id, 'rejected')"
                    >
                      <UIcon name="lucide:x" class="size-4" />
                      رد
                    </button>
                    <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="legal-qa-link legal-qa-link--sm" target="_blank">
                      <UIcon name="lucide:external-link" class="size-3.5" />
                      مشاهده
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else-if="tab === 'questionsPublished'">
        <div v-if="!questionsPublished.length" class="legal-qa-empty">
          <UIcon name="lucide:file-question" class="size-12 text-gray-400" />
          <p class="font-medium text-gray-700">سوال تایید شده‌ای یافت نشد</p>
          <p class="text-sm text-gray-500 mt-1">سوالات پس از تایید در اینجا نمایش داده می‌شوند.</p>
        </div>
        <div v-else class="legal-qa-table-wrap">
          <table class="legal-qa-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>ثبت‌کننده</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in questionsPublished" :key="row.id">
                <td>
                  <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="legal-qa-link" target="_blank">
                    {{ row.title }}
                  </NuxtLink>
                </td>
                <td class="legal-qa-muted">{{ row.is_anonymous ? 'ناشناس' : (row.author_name || '—') }}</td>
                <td>
                  <span :class="['legal-qa-badge', row.status === 'published' ? 'legal-qa-badge--success' : 'legal-qa-badge--default']">
                    {{ statusQ(row.status) }}
                  </span>
                </td>
                <td class="legal-qa-muted">{{ row.created_at_formatted }}</td>
                <td>
                  <div class="legal-qa-actions">
                    <button
                      type="button"
                      class="btn-secondary text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="setQuestionStatus(row.id, 'hidden')"
                    >
                      <UIcon name="lucide:eye-off" class="size-4" />
                      غیرفعال
                    </button>
                    <button
                      type="button"
                      class="btn-danger text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="confirmDeleteQuestion(row)"
                    >
                      <UIcon name="lucide:trash-2" class="size-4" />
                      حذف سوال
                    </button>
                    <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="legal-qa-link legal-qa-link--sm" target="_blank">
                      <UIcon name="lucide:external-link" class="size-3.5" />
                      مشاهده
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else-if="tab === 'questionsHidden'">
        <div v-if="!questionsHidden.length" class="legal-qa-empty">
          <UIcon name="lucide:eye-off" class="size-12 text-gray-400" />
          <p class="font-medium text-gray-700">سوال غیرفعال شده‌ای یافت نشد</p>
          <p class="text-sm text-gray-500 mt-1">سوالاتی که غیرفعال کرده‌اید در اینجا نمایش داده می‌شوند.</p>
        </div>
        <div v-else class="legal-qa-table-wrap">
          <table class="legal-qa-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>ثبت‌کننده</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in questionsHidden" :key="row.id">
                <td>
                  <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="legal-qa-link" target="_blank">
                    {{ row.title }}
                  </NuxtLink>
                </td>
                <td class="legal-qa-muted">{{ row.is_anonymous ? 'ناشناس' : (row.author_name || '—') }}</td>
                <td>
                  <span :class="['legal-qa-badge', 'legal-qa-badge--hidden']">
                    {{ statusQ(row.status) }}
                  </span>
                </td>
                <td class="legal-qa-muted">{{ row.created_at_formatted }}</td>
                <td>
                  <div class="legal-qa-actions">
                    <button
                      type="button"
                      class="btn-success text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="setQuestionStatus(row.id, 'published')"
                    >
                      <UIcon name="lucide:eye" class="size-4" />
                      فعال کردن
                    </button>
                    <button
                      type="button"
                      class="btn-danger text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="confirmDeleteQuestion(row)"
                    >
                      <UIcon name="lucide:trash-2" class="size-4" />
                      حذف سوال
                    </button>
                    <NuxtLink :to="`/legal/questions/${row.slug || row.id}`" class="legal-qa-link legal-qa-link--sm" target="_blank">
                      <UIcon name="lucide:external-link" class="size-3.5" />
                      مشاهده
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <div v-if="!answers.length" class="legal-qa-empty">
          <UIcon name="lucide:check-circle" class="size-12 text-green-500" />
          <p class="font-medium text-gray-700">پاسخی در انتظار تایید نیست</p>
          <p class="text-sm text-gray-500 mt-1">همه پاسخ‌ها بررسی شده‌اند.</p>
        </div>
        <div v-else class="legal-qa-table-wrap">
          <table class="legal-qa-table">
            <thead>
              <tr>
                <th>سوال / پاسخ</th>
                <th>وکیل</th>
                <th>تاریخ</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in answers" :key="row.id">
                <td>
                  <span class="legal-qa-excerpt">{{ row.body?.replace(/<[^>]+>/g, '').slice(0, 80) }}…</span>
                  <NuxtLink v-if="row.question_id" :to="`/legal/questions/${row.question?.slug || row.question_id}`" class="legal-qa-link legal-qa-link--sm mt-1 block" target="_blank">
                    مشاهده سوال
                  </NuxtLink>
                </td>
                <td class="legal-qa-muted">{{ row.lawyer?.full_name || '—' }}</td>
                <td class="legal-qa-muted">{{ row.created_at_formatted }}</td>
                <td>
                  <div class="legal-qa-actions">
                    <button
                      v-if="row.status === 'pending'"
                      type="button"
                      class="btn-success text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="setAnswerStatus(row.id, 'published')"
                    >
                      <UIcon name="lucide:check" class="size-4" />
                      تایید
                    </button>
                    <button
                      v-if="row.status === 'pending'"
                      type="button"
                      class="btn-danger text-sm! py-1.5! px-3!"
                      :disabled="actionLoading === row.id"
                      @click="setAnswerStatus(row.id, 'rejected')"
                    >
                      <UIcon name="lucide:x" class="size-4" />
                      رد
                    </button>
                    <NuxtLink v-if="row.question_id" :to="`/legal/questions/${row.question?.slug || row.question_id}`" class="legal-qa-link legal-qa-link--sm" target="_blank">
                      <UIcon name="lucide:external-link" class="size-3.5" />
                      مشاهده سوال
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
const tab = ref('questionsPending');
const questionsPending = ref([]);
const questionsPublished = ref([]);
const questionsHidden = ref([]);
const answers = ref([]);
const loading = ref(false);
const actionLoading = ref(null);

function statusQ(s) {
  const map = { draft: "پیش‌نویس", pending: "در انتظار", published: "منتشر شده", closed: "بسته", rejected: "رد شده", hidden: "مخفی" };
  return map[s] || s;
}

async function fetchQuestionsPending() {
  loading.value = true;
  const res = await useGet({
    url: "admin/legal/questions",
    includeAuthHeader: true,
    query: { status: "pending", per_page: 50 },
  });
  loading.value = false;
  questionsPending.value = res.data?.data ?? [];
}

async function fetchQuestionsPublished() {
  loading.value = true;
  const res = await useGet({
    url: "admin/legal/questions",
    includeAuthHeader: true,
    query: { status: "published", per_page: 50 },
  });
  loading.value = false;
  questionsPublished.value = res.data?.data ?? [];
}

async function fetchQuestionsHidden() {
  loading.value = true;
  const res = await useGet({
    url: "admin/legal/questions",
    includeAuthHeader: true,
    query: { status: "hidden", per_page: 50 },
  });
  loading.value = false;
  questionsHidden.value = res.data?.data ?? [];
}

async function setQuestionStatus(id, status) {
  actionLoading.value = id;
  try {
    await usePatch({
      url: `admin/legal/questions/${id}/status`,
      includeAuthHeader: true,
      body: { status },
    });
    if (tab.value === 'questionsPending') await fetchQuestionsPending();
    if (tab.value === 'questionsPublished') await fetchQuestionsPublished();
    if (tab.value === 'questionsHidden') await fetchQuestionsHidden();
  } finally {
    actionLoading.value = null;
  }
}

async function confirmDeleteQuestion(row) {
  if (!confirm(`آیا از حذف سوال «${row.title}» اطمینان دارید؟`)) return;
  actionLoading.value = row.id;
  try {
    const res = await useDelete({
      url: `legal/questions/${row.id}`,
      includeAuthHeader: true,
    });
    if (res?.status === true || res?.statusCode === 200) {
      useToast().add({ title: 'سوال حذف شد', color: 'success' });
      if (tab.value === 'questionsHidden') await fetchQuestionsHidden();
      else await fetchQuestionsPublished();
    }
  } finally {
    actionLoading.value = null;
  }
}

async function fetchAnswers() {
  loading.value = true;
  const res = await useGet({
    url: "admin/legal/answers",
    includeAuthHeader: true,
    query: { status: "pending", per_page: 50 },
  });
  loading.value = false;
  answers.value = res.data?.data ?? [];
}

async function setAnswerStatus(id, status) {
  actionLoading.value = id;
  try {
    await usePatch({
      url: `admin/legal/answers/${id}/status`,
      includeAuthHeader: true,
      body: { status },
    });
    await fetchAnswers();
  } finally {
    actionLoading.value = null;
  }
}

useHead({ title: "مدیریت سوال و جواب | ادمین" });
await fetchQuestionsPending();
</script>

<style scoped>
@reference "tailwindcss";

.legal-qa-admin {
  @apply space-y-6;
}

.legal-qa-tabs {
  @apply flex rounded-xl border border-gray-200 bg-gray-50/50 p-1;
}
.legal-qa-tab {
  @apply flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors;
}
.legal-qa-tab--active {
  @apply bg-white text-[var(--accent)] shadow-sm;
}
.legal-qa-tab-count {
  @apply rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600;
}
.legal-qa-tab--active .legal-qa-tab-count {
  @apply bg-[var(--accent)]/15 text-[var(--accent)];
}

.legal-qa-loading {
  @apply flex flex-col items-center justify-center py-16;
}
.legal-qa-empty {
  @apply flex flex-col items-center justify-center py-16 text-center;
}
.legal-qa-table-wrap {
  @apply overflow-x-auto;
}
.legal-qa-table {
  @apply w-full text-right;
}
.legal-qa-table thead {
  @apply border-b border-gray-200 bg-gray-50/80;
}
.legal-qa-table th {
  @apply px-5 py-3.5 text-sm font-semibold text-gray-700;
}
.legal-qa-table tbody tr {
  @apply border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/50;
}
.legal-qa-table td {
  @apply px-5 py-3.5 text-sm;
}
.legal-qa-link {
  @apply text-[var(--accent)] hover:underline line-clamp-2;
}
.legal-qa-link--sm {
  @apply inline-flex items-center gap-1.5 text-xs;
}
.legal-qa-badge {
  @apply inline-flex rounded-lg px-2.5 py-0.5 text-xs font-medium;
}
.legal-qa-badge--pending {
  @apply bg-amber-100 text-amber-800;
}
.legal-qa-badge--default {
  @apply bg-gray-100 text-gray-600;
}
.legal-qa-badge--success {
  @apply bg-green-100 text-green-800;
}
.legal-qa-badge--hidden {
  @apply bg-gray-200 text-gray-700;
}
.legal-qa-muted {
  @apply text-gray-500;
}
.legal-qa-excerpt {
  @apply line-clamp-2 text-gray-700;
}
.legal-qa-actions {
  @apply flex flex-wrap items-center gap-2;
}
</style>
