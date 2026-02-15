<template>
  <div class="articles-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت مقالات</h1>
        <p class="page-description">{{ total }} مقاله در سیستم ثبت شده است</p>
      </div>
      <NuxtLink to="/dashboard/admin/articles/add" class="btn-primary">
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>افزودن مقاله</span>
      </NuxtLink>
    </div>

    <div class="stats-grid-sm">
      <div class="stat-mini" @click="applyStatusFilter('pending')">
        <div class="stat-mini-icon bg-amber-100 text-amber-600">
          <Icon name="lucide:clock" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.pending }}</span>
          <span class="stat-mini-label">در انتظار تایید</span>
        </div>
      </div>
      <div class="stat-mini" @click="applyStatusFilter('approved')">
        <div class="stat-mini-icon bg-green-100 text-green-600">
          <Icon name="lucide:check-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.approved }}</span>
          <span class="stat-mini-label">تایید شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="applyStatusFilter('rejected')">
        <div class="stat-mini-icon bg-red-100 text-red-600">
          <Icon name="lucide:x-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.rejected }}</span>
          <span class="stat-mini-label">رد شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="applyStatusFilter('')">
        <div class="stat-mini-icon bg-blue-100 text-blue-600">
          <Icon name="lucide:file-text" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ total }}</span>
          <span class="stat-mini-label">همه</span>
        </div>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <div class="action-bar-start">
            <div class="search-box">
              <Icon name="lucide:search" class="icon" />
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="جستجو در مقالات..."
                class="w-64"
              />
            </div>
            <select v-model="statusFilter" @change="applyFilters" class="select-dashboard w-40!">
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="approved">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="reviews-list">
        <div v-for="article in data" :key="article.id" class="review-item">
          <div class="review-content">
            <div class="review-header">
              <div class="review-user">
                <div>
                  <button
                    type="button"
                    class="review-user-name clickable"
                    @click="openArticleView(article)"
                  >
                    {{ article.title }}
                  </button>
                  <span class="review-date">{{ article.created_at_formatted }}</span>
                </div>
              </div>
              <span class="badge" :class="getStatusBadgeClass(article.status)">
                {{ getStatusLabel(article.status) }}
              </span>
            </div>
            <div class="review-lawyer">
              <Icon name="lucide:user" class="w-4 h-4 text-gray-400" />
              <span>{{ article.author_name }}</span>
            </div>
            <p v-if="article.summary" class="review-text line-clamp-2">{{ article.summary }}</p>
            <div class="review-actions">
              <button
                type="button"
                class="btn-secondary text-sm! py-1.5! px-3!"
                @click="openArticleView(article)"
              >
                <Icon name="lucide:eye" class="w-4 h-4" />
                مشاهده مقاله
              </button>
              <template v-if="article.status === 'pending'">
                <button
                  @click="approveArticle(article.id)"
                  class="btn-success text-sm! py-1.5! px-3!"
                >
                  <Icon name="lucide:check" class="w-4 h-4" />
                  تایید
                </button>
                <button
                  @click="rejectArticle(article.id)"
                  class="btn-danger text-sm! py-1.5! px-3!"
                >
                  <Icon name="lucide:x" class="w-4 h-4" />
                  رد
                </button>
              </template>
              <button
                type="button"
                class="btn-icon text-red-600!"
                title="حذف"
                @click="deleteArticle(article)"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        </div>

        <div v-if="data.length === 0" class="empty-state py-16">
          <div class="empty-state-icon">
            <Icon name="lucide:file-text" class="w-8 h-8" />
          </div>
          <h4 class="empty-state-title">مقاله‌ای یافت نشد</h4>
          <p class="empty-state-description">با تغییر فیلترها نتایج جدید ببینید</p>
        </div>
      </div>

      <div v-if="total > 15" class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500">صفحه {{ page }} از {{ Math.ceil(total / 15) }}</span>
        <UPagination
          v-model:page="page"
          :items-per-page="15"
          :total="total"
          show-edges
          :sibling-count="1"
          :ui="{ list: 'gap-1', item: 'min-w-8 h-8 text-sm', first: 'scale-x-[-1]', last: 'scale-x-[-1]', prev: 'scale-x-[-1]', next: 'scale-x-[-1]' }"
        />
      </div>
    </div>

    <!-- مودال مشاهده کامل مقاله -->
    <UModal v-model:open="showArticleModal" :ui="{ width: 'max-w-3xl' }">
      <template #content>
        <div class="article-view-modal">
          <div class="article-view-header">
            <h2 class="article-view-title">{{ selectedArticle?.title }}</h2>
            <button type="button" class="article-view-close" @click="closeArticleView" aria-label="بستن">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div v-if="articleViewLoading" class="article-view-loading">
            <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400" />
            <span class="text-sm text-gray-500 mt-2">در حال بارگذاری...</span>
          </div>
          <template v-else-if="selectedArticle">
            <div class="article-view-meta">
              <span><Icon name="lucide:user" class="w-4 h-4 inline" /> {{ selectedArticle.author_name }}</span>
              <span><Icon name="lucide:calendar" class="w-4 h-4 inline" /> {{ selectedArticle.created_at_formatted }}</span>
              <span class="badge" :class="getStatusBadgeClass(selectedArticle.status)">
                {{ getStatusLabel(selectedArticle.status) }}
              </span>
            </div>
            <div v-if="selectedArticle.image" class="article-view-image-wrap">
              <img
                :src="articleImageSrc(selectedArticle.image)"
                :alt="selectedArticle.title"
                class="article-view-image"
              />
            </div>
            <p v-if="selectedArticle.summary" class="article-view-summary">{{ selectedArticle.summary }}</p>
            <div class="article-view-body ql-editor prose prose-gray max-w-none" v-html="articleBodyHtml"></div>
            <div class="article-view-actions">
              <button type="button" class="btn-secondary" @click="closeArticleView">بستن</button>
              <template v-if="selectedArticle.status === 'pending'">
                <button
                  type="button"
                  class="btn-success"
                  :disabled="articleActionLoading"
                  @click="approveFromModal"
                >
                  <Icon v-if="articleActionLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  تایید مقاله
                </button>
                <button
                  type="button"
                  class="btn-danger"
                  :disabled="articleActionLoading"
                  @click="rejectFromModal"
                >
                  رد مقاله
                </button>
              </template>
              <button
                type="button"
                class="btn-icon text-red-600!"
                title="حذف"
                :disabled="articleActionLoading"
                @click="deleteFromModal"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
                حذف
              </button>
            </div>
          </template>
        </div>
      </template>
    </UModal>

    <!-- مودال تأیید حذف مقاله -->
    <UICConfirmModal
      v-model="showDeleteModal"
      title="حذف مقاله"
      :message="deleteTarget ? `آیا از حذف مقاله «${deleteTarget.title}» اطمینان دارید؟ این عمل قابل بازگشت نیست.` : ''"
      confirm-text="حذف"
      variant="danger"
      :loading="isDeleting"
      @confirm="executeDeleteArticle"
    />
  </div>
</template>

<script setup>
useHead({ title: "مدیریت مقالات | وکیلینجا" });

const page = ref(1);
const data = ref([]);
const total = ref(0);
const searchQuery = ref("");
const statusFilter = ref("");
const statusCounts = ref({ pending: 0, approved: 0, rejected: 0 });
const showDeleteModal = ref(false);
const deleteTarget = ref(null);
const isDeleting = ref(false);

const showArticleModal = ref(false);
const selectedArticle = ref(null);
const articleViewLoading = ref(false);
const articleActionLoading = ref(false);

const config = useRuntimeConfig();
function articleImageSrc(image) {
  if (!image || typeof image !== "string") return "";
  const base = (config.public?.imageBase || "").replace(/\/$/, "") || "";
  const trimmed = image.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return base ? `${base}${path}` : path;
}

const articleBodyHtml = computed(() => {
  const b = selectedArticle.value?.body ?? "";
  if (!b) return "";
  if (b.includes("<") && b.includes(">")) return b;
  return b.replace(/\n/g, "<br />");
});

async function openArticleView(article) {
  selectedArticle.value = null;
  showArticleModal.value = true;
  articleViewLoading.value = true;
  const res = await useGet({
    url: `admin/articles/${article.id}`,
    includeAuthHeader: true,
  });
  articleViewLoading.value = false;
  if (res.data?.data) {
    selectedArticle.value = res.data.data;
  } else {
    useToast().add({ title: "خطا در بارگذاری مقاله", color: "error" });
    showArticleModal.value = false;
  }
}

function closeArticleView() {
  showArticleModal.value = false;
  selectedArticle.value = null;
}

async function approveFromModal() {
  if (!selectedArticle.value) return;
  articleActionLoading.value = true;
  await usePost({
    url: `admin/articles/${selectedArticle.value.id}/approve`,
    includeAuthHeader: true,
  });
  articleActionLoading.value = false;
  useToast().add({ title: "مقاله تایید شد", color: "success" });
  selectedArticle.value = { ...selectedArticle.value, status: "approved" };
  fetchArticles(page.value, true);
}

async function rejectFromModal() {
  if (!selectedArticle.value) return;
  articleActionLoading.value = true;
  await usePost({
    url: `admin/articles/${selectedArticle.value.id}/reject`,
    includeAuthHeader: true,
  });
  articleActionLoading.value = false;
  useToast().add({ title: "مقاله رد شد", color: "success" });
  selectedArticle.value = { ...selectedArticle.value, status: "rejected" };
  fetchArticles(page.value, true);
}

function deleteFromModal() {
  if (!selectedArticle.value) return;
  deleteTarget.value = { id: selectedArticle.value.id, title: selectedArticle.value.title };
  showArticleModal.value = false;
  selectedArticle.value = null;
  showDeleteModal.value = true;
}

let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchArticles(1, true);
  }, 500);
};

const applyFilters = () => {
  page.value = 1;
  fetchArticles(1, true);
};

function applyStatusFilter(status) {
  statusFilter.value = status;
  page.value = 1;
  fetchArticles(1, true);
}

async function fetchArticles(pageNum = 1, setTotal = false) {
  const res = await useGet({
    url: "admin/articles",
    includeAuthHeader: true,
    query: {
      page: pageNum,
      per_page: 15,
      status: statusFilter.value || undefined,
      search: searchQuery.value || undefined,
    },
  });

  const list = res.data?.data ?? [];
  data.value = list.map((a) => ({
    id: a.id,
    title: a.title,
    summary: a.summary,
    status: a.status,
    author_name: a.author_name,
    created_at_formatted: a.created_at_formatted,
  }));

  if (setTotal) {
    total.value = res.data?.meta?.total ?? list.length;
    const counts = res.data?.meta?.status_counts;
    if (counts && typeof counts === "object") {
      statusCounts.value = {
        pending: Number(counts.pending) || 0,
        approved: Number(counts.approved) || 0,
        rejected: Number(counts.rejected) || 0,
      };
    } else {
      statusCounts.value = { pending: 0, approved: 0, rejected: 0 };
      data.value.forEach((a) => {
        if (statusCounts.value[a.status] !== undefined) statusCounts.value[a.status]++;
      });
    }
  }
}

watch(() => page.value, (p) => fetchArticles(p));

await fetchArticles(page.value, true);

async function approveArticle(id) {
  await usePost({
    url: `admin/articles/${id}/approve`,
    includeAuthHeader: true,
  });
  useToast().add({ title: "مقاله تایید شد", color: "success" });
  fetchArticles(page.value, true);
}

async function rejectArticle(id) {
  await usePost({
    url: `admin/articles/${id}/reject`,
    includeAuthHeader: true,
  });
  useToast().add({ title: "مقاله رد شد", color: "success" });
  fetchArticles(page.value, true);
}

function deleteArticle(article) {
  deleteTarget.value = article;
  showDeleteModal.value = true;
}

async function executeDeleteArticle() {
  if (!deleteTarget.value) return;
  isDeleting.value = true;
  const res = await useDelete({
    url: `admin/articles/${deleteTarget.value.id}`,
    includeAuthHeader: true,
  });
  isDeleting.value = false;
  showDeleteModal.value = false;
  deleteTarget.value = null;
  if (res.status) {
    useToast().add({ title: "مقاله حذف شد", color: "success" });
    fetchArticles(page.value, true);
  } else {
    useToast().add({ title: res.message || "خطا در حذف مقاله", color: "error" });
  }
}

function getStatusLabel(status) {
  const labels = {
    pending: "در انتظار",
    approved: "تایید شده",
    rejected: "رد شده",
  };
  return labels[status] || status;
}

function getStatusBadgeClass(status) {
  const classes = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-error",
  };
  return classes[status] || "badge-gray";
}
</script>

<style scoped>
@reference "tailwindcss";
.articles-page {
  @apply space-y-6;
}
.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}
.page-title {
  @apply text-xl font-bold text-gray-900;
}
.page-description {
  @apply text-sm text-gray-500 mt-1;
}
.stats-grid-sm {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4;
}
.stat-mini {
  @apply bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3 cursor-pointer transition-all;
  box-shadow: var(--shadow-sm);
}
.stat-mini:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}
.stat-mini-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
}
.stat-mini-content {
  @apply flex flex-col;
}
.stat-mini-value {
  @apply text-xl font-bold text-gray-900;
}
.stat-mini-label {
  @apply text-xs text-gray-500;
}
.reviews-list {
  @apply divide-y divide-gray-100;
}
.review-item {
  @apply flex gap-4 p-5;
}
.review-content {
  @apply flex-1 space-y-3;
}
.review-header {
  @apply flex items-start justify-between;
}
.review-user-name {
  @apply block font-medium text-gray-900;
}
.review-date {
  @apply block text-xs text-gray-400;
}
.review-lawyer {
  @apply flex items-center gap-2 text-sm text-gray-500;
}
.review-text {
  @apply text-sm text-gray-700 leading-relaxed;
}
.review-actions {
  @apply flex items-center gap-2;
}
.empty-state {
  @apply text-center;
}
.empty-state-icon {
  @apply text-gray-300 mb-4;
}
.empty-state-title {
  @apply text-lg font-medium text-gray-600;
}
.empty-state-description {
  @apply text-sm text-gray-500 mt-1;
}
.search-box {
  @apply flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 bg-white;
}
.search-box .icon {
  @apply w-4 h-4 text-gray-400;
}
.action-bar {
  @apply flex flex-wrap items-center justify-between gap-4;
}
.action-bar-start {
  @apply flex flex-wrap items-center gap-3;
}
.btn-success,
.btn-danger {
  @apply inline-flex items-center gap-1;
}
.btn-icon {
  @apply p-2 rounded-lg hover:bg-gray-100 transition;
}

.review-user-name.clickable {
  @apply text-right cursor-pointer hover:text-[var(--accent)] hover:underline bg-transparent border-none w-full;
}

.article-view-modal {
  @apply bg-white rounded-xl overflow-hidden flex flex-col max-h-[85vh];
}
.article-view-header {
  @apply flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100 shrink-0;
}
.article-view-title {
  @apply text-lg font-semibold text-gray-900 flex-1;
}
.article-view-close {
  @apply p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition;
}
.article-view-loading {
  @apply flex flex-col items-center justify-center py-12;
}
.article-view-meta {
  @apply flex flex-wrap items-center gap-3 px-6 pt-4 text-sm text-gray-500 shrink-0;
}
.article-view-image-wrap {
  @apply px-6 py-4 max-w-xs;
}
.article-view-image {
  @apply w-full h-28 object-contain block bg-gray-50 rounded-lg;
}
.article-view-summary {
  @apply px-6 py-2 text-sm text-gray-600 leading-relaxed border-b border-gray-100;
}
.article-view-body {
  @apply px-6 py-4 overflow-y-auto text-sm text-gray-700 leading-relaxed flex-1 min-h-0;
  text-align: right;
}
.article-view-actions {
  @apply flex flex-wrap items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0;
}
</style>
