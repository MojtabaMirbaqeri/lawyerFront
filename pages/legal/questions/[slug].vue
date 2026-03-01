<template>
  <main class="legal-detail-page">
    <div class="container py-6 lg:py-10">
      <div v-if="pending" class="legal-detail-loading">
        <UIcon name="lucide:loader-2" class="size-10 animate-spin text-gray-400" />
        <p class="mt-3 text-sm text-gray-500">در حال بارگذاری...</p>
      </div>

      <div v-else-if="!question" class="legal-detail-empty">
        <div class="legal-detail-empty-icon">
          <UIcon name="lucide:help-circle" class="size-14 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-700">سوال یافت نشد</h3>
        <NuxtLink to="/legal/questions" class="legal-btn legal-btn--primary mt-6 inline-flex">
          <UIcon name="lucide:arrow-right" class="size-4 scale-x-[-1]" />
          بازگشت به لیست سوالات
        </NuxtLink>
      </div>

      <article v-else class="legal-detail-article">
        <nav class="legal-breadcrumb" aria-label="مسیر">
          <NuxtLink to="/legal/questions" class="legal-breadcrumb-link">سوال و جواب حقوقی</NuxtLink>
          <span class="legal-breadcrumb-sep">/</span>
          <span class="legal-breadcrumb-current" aria-current="page">{{ question.title }}</span>
        </nav>

        <div v-if="question.status === 'pending'" class="legal-pending-notice">
          <UIcon name="lucide:clock" class="size-5 shrink-0" />
          <p>سوال شما در انتظار تایید ادمین است و پس از تایید برای همه نمایش داده می‌شود.</p>
        </div>

        <div v-if="isAdmin" class="legal-admin-actions">
          <button
            v-if="question.status === 'published'"
            type="button"
            class="legal-btn legal-btn--outline legal-btn--danger-outline"
            :disabled="adminActionLoading"
            @click="adminHideQuestion"
          >
            <UIcon name="lucide:eye-off" class="size-4" />
            غیرفعال کردن سوال
          </button>
          <button
            type="button"
            class="legal-btn legal-btn--danger"
            :disabled="adminActionLoading"
            @click="adminDeleteQuestion"
          >
            <UIcon name="lucide:trash-2" class="size-4" />
            حذف سوال
          </button>
        </div>

        <div class="legal-detail-card">
          <header class="legal-detail-header">
            <h1 class="legal-detail-title">{{ question.title }}</h1>
            <div class="legal-detail-meta">
              <span class="legal-detail-meta-item">
                <UIcon name="lucide:user" class="size-4" />
                {{ question.author_name || 'ناشناس' }}
              </span>
              <span class="legal-detail-meta-item">
                <UIcon name="lucide:calendar" class="size-4" />
                {{ question.created_at_formatted }}
              </span>
              <span class="legal-detail-meta-item">
                <UIcon name="lucide:message-circle" class="size-4" />
                {{ question.answers_count }} پاسخ
              </span>
              <span class="legal-detail-meta-item">
                <UIcon name="lucide:eye" class="size-4" />
                {{ question.views_count }} بازدید
              </span>
            </div>
            <div v-if="question.category" class="legal-detail-tag">
              {{ question.category.name }}
            </div>
          </header>

          <div class="legal-detail-body prose prose-gray max-w-none text-right" v-html="bodyHtml"></div>

          <div v-if="question.attachments?.length" class="legal-detail-attachments">
            <a
              v-for="att in question.attachments"
              :key="att.id"
              :href="att.url"
              target="_blank"
              rel="noopener"
              class="legal-attachment-link"
            >
              <UIcon name="lucide:paperclip" class="size-4" />
              {{ att.original_name }}
            </a>
          </div>

          <div class="legal-detail-disclaimer">
            <UIcon name="lucide:shield-alert" class="size-5 shrink-0 text-amber-600" />
            <p>پاسخ‌ها صرفاً اطلاع‌رسانی عمومی هستند و جایگزین مشاوره حقوقی نیستند.</p>
          </div>
        </div>

        <section class="legal-answers-section">
          <h2 class="legal-answers-title">
            <UIcon name="lucide:message-square" class="size-5" />
            پاسخ‌ها ({{ question.answers?.length ?? 0 }})
          </h2>

          <div v-if="isLawyer && question.status === 'published'" class="legal-answer-form-card">
            <h3 class="legal-answer-form-title">ثبت پاسخ</h3>
            <p class="legal-answer-form-desc">به عنوان وکیل می‌توانید به این سوال پاسخ دهید. پاسخ پس از تایید ادمین نمایش داده می‌شود.</p>
            <form class="legal-answer-form" @submit.prevent="submitAnswer">
              <textarea
                v-model="answerForm.body"
                class="legal-answer-textarea"
                placeholder="متن پاسخ خود را بنویسید (حداقل ۲۰ کاراکتر)..."
                required
                minlength="20"
                rows="5"
              />
              <button
                type="submit"
                :disabled="answerSending"
                class="legal-btn legal-btn--primary legal-answer-submit"
              >
                <UIcon v-if="answerSending" name="lucide:loader-2" class="size-4 animate-spin" />
                <UIcon v-else name="lucide:send" class="size-4" />
                {{ answerSending ? 'در حال ارسال...' : 'ثبت پاسخ' }}
              </button>
            </form>
          </div>

          <div v-if="!question.answers?.length" class="legal-answers-empty">
            <UIcon name="lucide:inbox" class="size-10 text-gray-300" />
            <p class="text-sm text-gray-500">هنوز پاسخی ثبت نشده است.</p>
          </div>
          <div v-else class="legal-answers-list">
            <div
              v-for="ans in question.answers"
              :key="ans.id"
              :class="['legal-answer-card', ans.is_best && 'legal-answer-card--best']"
            >
              <div v-if="ans.is_best" class="legal-answer-badge">
                <UIcon name="lucide:check-circle" class="size-4" />
                بهترین پاسخ
              </div>
              <div class="legal-answer-header">
                <div class="legal-answer-avatar">
                  <UIcon name="lucide:user" class="size-5 text-gray-500" />
                </div>
                <div class="legal-answer-author">
                  <NuxtLink
                    v-if="ans.lawyer?.id"
                    :to="lawyerProfilePath(ans.lawyer)"
                    class="font-semibold text-gray-900 hover:text-primary hover:underline"
                  >
                    {{ ans.lawyer?.full_name || 'وکیل' }}
                  </NuxtLink>
                  <span v-else class="font-semibold text-gray-900">{{ ans.lawyer?.full_name || 'وکیل' }}</span>
                  <span class="text-xs text-gray-500">{{ ans.created_at_formatted }}</span>
                </div>
              </div>
              <div class="legal-answer-body prose prose-gray max-w-none text-right text-sm" v-html="answerBody(ans.body)"></div>
              <div v-if="ans.attachments?.length" class="legal-answer-attachments">
                <a
                  v-for="att in ans.attachments"
                  :key="att.id"
                  :href="att.url"
                  target="_blank"
                  rel="noopener"
                  class="legal-answer-att-link"
                >
                  <UIcon name="lucide:paperclip" class="size-3.5" />
                  {{ att.original_name }}
                </a>
              </div>
              <div v-if="isAdmin" class="legal-answer-admin-actions">
                <button
                  type="button"
                  class="legal-btn legal-btn--sm legal-btn--danger-outline"
                  :disabled="answerDeleting === ans.id"
                  @click="confirmDeleteAnswer(ans)"
                >
                  <UIcon v-if="answerDeleting === ans.id" name="lucide:loader-2" class="size-3.5 animate-spin" />
                  <UIcon v-else name="lucide:trash-2" class="size-3.5" />
                  حذف پاسخ
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer class="legal-detail-footer">
          <NuxtLink to="/legal/questions" class="legal-btn legal-btn--outline">
            <UIcon name="lucide:arrow-right" class="size-4 scale-x-[-1]" />
            بازگشت به لیست سوالات
          </NuxtLink>
        </footer>
      </article>
    </div>
  </main>
</template>

<script setup>
const route = useRoute();
const slug = computed(() => route.params.slug);
const auth = useAuthStore();
const isLawyer = computed(() => !!auth.user?.lawyer_id);
const isAdmin = computed(() => auth.user?.user_type === 'admin');

const question = ref(null);
const pending = ref(true);
const answerForm = ref({ body: '' });
const answerSending = ref(false);
const adminActionLoading = ref(false);
const answerDeleting = ref(null);

const bodyHtml = computed(() => {
  const b = question.value?.body ?? "";
  if (!b) return "";
  if (b.includes("<") && b.includes(">")) return b;
  return b.replace(/\n/g, "<br />");
});

function answerBody(body) {
  if (!body) return "";
  if (body.includes("<") && body.includes(">")) return body;
  return body.replace(/\n/g, "<br />");
}

function lawyerProfilePath(lawyer) {
  if (!lawyer?.id) return '/lawyer';
  const slug = (lawyer.full_name || 'profile').trim().replace(/\s+/g, '-') || 'profile';
  return `/lawyer/${lawyer.id}/${slug}`;
}

async function fetchQuestion() {
  pending.value = true;
  const res = await useGet({
    url: `legal/questions/${slug.value}`,
    includeAuthHeader: true,
  });
  pending.value = false;
  if (res.data?.data) {
    question.value = res.data.data;
  } else {
    question.value = null;
  }
}

async function submitAnswer() {
  if (!question.value?.id || answerSending.value || (answerForm.value.body || '').trim().length < 20) return;
  answerSending.value = true;
  const res = await usePost({
    url: `legal/questions/${question.value.id}/answers`,
    includeAuthHeader: true,
    body: { body: answerForm.value.body.trim() },
  });
  answerSending.value = false;
  if (res.data?.data || res.statusCode === 201) {
    answerForm.value.body = '';
    useToast().add({ title: 'پاسخ شما ثبت شد و پس از تایید ادمین نمایش داده می‌شود.', color: 'success' });
    await fetchQuestion();
  }
}

async function adminHideQuestion() {
  if (!question.value?.id || adminActionLoading.value) return;
  adminActionLoading.value = true;
  try {
    await usePatch({
      url: `admin/legal/questions/${question.value.id}/status`,
      includeAuthHeader: true,
      body: { status: 'hidden' },
    });
    useToast().add({ title: 'سوال غیرفعال شد', color: 'success' });
    await fetchQuestion();
  } finally {
    adminActionLoading.value = false;
  }
}

async function adminDeleteQuestion() {
  if (!question.value?.id) return;
  if (!confirm('آیا از حذف این سوال اطمینان دارید؟ این عمل قابل بازگشت نیست.')) return;
  adminActionLoading.value = true;
  try {
    const res = await useDelete({
      url: `legal/questions/${question.value.id}`,
      includeAuthHeader: true,
    });
    if (res?.status === true || res?.statusCode === 200) {
      useToast().add({ title: 'سوال حذف شد', color: 'success' });
      await navigateTo('/dashboard/admin/legal-qa');
    }
  } finally {
    adminActionLoading.value = false;
  }
}

async function confirmDeleteAnswer(ans) {
  if (!confirm('آیا از حذف این پاسخ اطمینان دارید؟')) return;
  answerDeleting.value = ans.id;
  try {
    const res = await useDelete({
      url: `legal/answers/${ans.id}`,
      includeAuthHeader: true,
    });
    if (res?.status === true || res?.statusCode === 200) {
      useToast().add({ title: 'پاسخ حذف شد', color: 'success' });
      await fetchQuestion();
    }
  } finally {
    answerDeleting.value = null;
  }
}

useHead({
  title: () => (question.value ? `${question.value.title} | سوال و جواب حقوقی | وکیل وکیل` : "سوال حقوقی | وکیل وکیل"),
});
useSeoMeta({
  title: () => (question.value ? `${question.value.title} | سوال و جواب حقوقی` : "سوال حقوقی"),
  description: () => {
    const q = question.value;
    if (!q?.body) return "سوال حقوقی";
    const text = q.body.replace(/<[^>]+>/g, "").slice(0, 160);
    return text + (q.body.length > 160 ? "…" : "");
  },
});

useHead({
  script: () => {
    const q = question.value;
    if (!q || !q.answers?.length) return [];
    const mainEntity = {
      "@type": "Question",
      name: q.title,
      text: q.body?.replace(/<[^>]+>/g, "").slice(0, 500),
      dateCreated: q.created_at,
      author: { "@type": "Person", name: q.author_name || "ناشناس" },
      answerCount: q.answers?.length ?? 0,
      acceptedAnswer: q.answers?.find((a) => a.is_best)
        ? {
            "@type": "Answer",
            text: q.answers.find((a) => a.is_best)?.body?.replace(/<[^>]+>/g, "").slice(0, 500),
            dateCreated: q.answers.find((a) => a.is_best)?.created_at,
            author: { "@type": "Person", name: q.answers.find((a) => a.is_best)?.lawyer?.full_name },
          }
        : undefined,
    };
    return [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity,
        }),
      },
    ];
  },
});

await fetchQuestion();
</script>

<style scoped>
@reference "tailwindcss";

.legal-detail-page {
  @apply min-h-screen bg-[var(--surface-subtle)];
}

.legal-detail-loading,
.legal-detail-empty {
  @apply flex flex-col items-center justify-center py-16;
}
.legal-detail-empty-icon {
  @apply mb-4 rounded-full bg-gray-100 p-6;
}

.legal-detail-article {
  @apply max-w-3xl mx-auto;
}

.legal-breadcrumb {
  @apply flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6;
}
.legal-breadcrumb-link {
  @apply text-[var(--accent)] hover:underline;
}
.legal-breadcrumb-sep {
  @apply text-gray-300;
}
.legal-breadcrumb-current {
  @apply text-gray-700 line-clamp-1;
}

.legal-pending-notice {
  @apply mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800;
}

.legal-detail-card {
  @apply rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm;
}
.legal-detail-header {
  @apply border-b border-gray-100 pb-6;
}
.legal-detail-title {
  @apply text-xl md:text-2xl font-bold text-gray-900 leading-snug;
}
.legal-detail-meta {
  @apply mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500;
}
.legal-detail-meta-item {
  @apply inline-flex items-center gap-1.5;
}
.legal-detail-tag {
  @apply mt-3 inline-flex rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600;
}
.legal-detail-body {
  @apply mt-6 text-right;
}
.legal-detail-body :deep(br) {
  @apply block mt-2;
}
.legal-detail-attachments {
  @apply mt-6 flex flex-wrap gap-2;
}
.legal-attachment-link {
  @apply inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:border-gray-300;
}
.legal-detail-disclaimer {
  @apply mt-6 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800;
}

.legal-answers-section {
  @apply mt-8;
}
.legal-answers-title {
  @apply flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4;
}

.legal-answer-form-card {
  @apply mb-6 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 md:p-6;
}
.legal-answer-form-title {
  @apply text-base font-semibold text-gray-900;
}
.legal-answer-form-desc {
  @apply mt-1 text-sm text-gray-500 mb-4;
}
.legal-answer-form {
  @apply flex flex-col gap-3;
}
.legal-answer-textarea {
  @apply w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 resize-y min-h-[120px];
}
.legal-answer-submit {
  @apply w-fit;
}

.legal-answers-empty {
  @apply flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white py-12;
}
.legal-answers-list {
  @apply space-y-4;
}
.legal-answer-card {
  @apply rounded-2xl border border-gray-200 bg-white p-5 shadow-sm;
}
.legal-answer-card--best {
  @apply border-emerald-200 bg-emerald-50/50 shadow-sm;
}
.legal-answer-badge {
  @apply mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white;
}
.legal-answer-header {
  @apply flex items-center gap-3 mb-4;
}
.legal-answer-avatar {
  @apply flex size-10 items-center justify-center rounded-full bg-gray-100;
}
.legal-answer-author {
  @apply flex flex-col;
}
.legal-answer-body {
  @apply text-right;
}
.legal-answer-body :deep(br) {
  @apply block mt-1;
}
.legal-answer-attachments {
  @apply mt-3 flex flex-wrap gap-2;
}
.legal-answer-att-link {
  @apply inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline;
}

.legal-detail-footer {
  @apply mt-8 pt-6 border-t border-gray-200;
}
.legal-btn {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all no-underline;
}
.legal-btn--primary {
  @apply bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] hover:shadow-md;
}
.legal-btn--outline {
  @apply border border-gray-300 bg-white text-gray-700 hover:border-[var(--accent)] hover:bg-gray-50 hover:text-[var(--accent)];
}
.legal-btn--danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
.legal-btn--danger-outline {
  @apply border border-red-300 bg-white text-red-700 hover:bg-red-50 hover:border-red-400;
}
.legal-btn--sm {
  @apply py-1.5 px-3 text-xs;
}
.legal-admin-actions {
  @apply mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/50 p-4;
}
.legal-answer-admin-actions {
  @apply mt-3 pt-3 border-t border-gray-100;
}
</style>
