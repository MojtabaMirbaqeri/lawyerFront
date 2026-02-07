<template>
  <div class="articles-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">مقالات من</h1>
        <p class="page-description">{{ total }} مقاله ثبت شده است</p>
      </div>
      <NuxtLink to="/dashboard/lawyer/articles/add" class="btn-primary">
        <Icon name="lucide:plus" class="w-4 h-4" />
        <span>افزودن مقاله</span>
      </NuxtLink>
    </div>

    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <select v-model="statusFilter" @change="applyFilters" class="select-dashboard w-40!">
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار تایید</option>
            <option value="approved">تایید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="reviews-list">
        <div v-for="article in data" :key="article.id" class="review-item">
          <div class="review-content flex-1">
            <div class="review-header">
              <div class="review-user">
                <div>
                  <span class="review-user-name">{{ article.title }}</span>
                  <span class="review-date">{{ article.created_at_formatted }}</span>
                </div>
              </div>
              <span class="badge" :class="getStatusBadgeClass(article.status)">
                {{ getStatusLabel(article.status) }}
              </span>
            </div>
            <p v-if="article.summary" class="review-text line-clamp-2">{{ article.summary }}</p>
            <div class="review-actions mt-3">
              <NuxtLink
                :to="`/dashboard/lawyer/articles/edit/${article.id}`"
                class="btn-success text-sm! py-1.5! px-3!"
              >
                <Icon name="lucide:edit" class="w-4 h-4" />
                ویرایش
              </NuxtLink>
              <button
                type="button"
                class="btn-danger text-sm! py-1.5! px-3!"
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
          <p class="empty-state-description">می‌توانید مقاله جدید اضافه کنید</p>
          <NuxtLink to="/dashboard/lawyer/articles/add" class="btn-primary mt-4">
            افزودن مقاله
          </NuxtLink>
        </div>
      </div>

      <div v-if="total > 15" class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500">صفحه {{ page }} از {{ Math.ceil(total / 15) }}</span>
        <UPagination
          v-model:page="page"
          :items-per-page="15"
          :total="total"
          :sibling-count="1"
          :ui="{ list: 'gap-1', item: 'min-w-8 h-8 text-sm', first: 'hidden', last: 'hidden', prev: 'scale-x-[-1]', next: 'scale-x-[-1]' }"
        />
      </div>
    </div>

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
useHead({ title: "مقالات من | وکیلینجا" });

const page = ref(1);
const total = ref(0);
const data = ref([]);
const statusFilter = ref("");
const showDeleteModal = ref(false);
const deleteTarget = ref(null);
const isDeleting = ref(false);

async function fetchArticles() {
  const res = await useGet({
    url: "articles/my",
    includeAuthHeader: true,
    query: { page: page.value, per_page: 15, status: statusFilter.value || undefined },
  });
  if (res.data?.data) {
    data.value = res.data.data;
    total.value = res.data.meta?.total ?? res.data.data.length;
  } else {
    data.value = [];
  }
}

const applyFilters = () => {
  page.value = 1;
  fetchArticles();
};

watch(() => page.value, () => fetchArticles());
await fetchArticles();

function getStatusLabel(status) {
  const labels = { pending: "در انتظار تایید", approved: "تایید شده", rejected: "رد شده" };
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

function deleteArticle(article) {
  deleteTarget.value = article;
  showDeleteModal.value = true;
}

async function executeDeleteArticle() {
  if (!deleteTarget.value) return;
  isDeleting.value = true;
  const res = await useDelete({
    url: `articles/${deleteTarget.value.id}`,
    includeAuthHeader: true,
  });
  isDeleting.value = false;
  showDeleteModal.value = false;
  deleteTarget.value = null;
  if (res.status) {
    useToast().add({ title: "مقاله حذف شد", color: "success" });
    fetchArticles();
  }
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
</style>
