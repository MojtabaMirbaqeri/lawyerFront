<template>
  <div class="comments-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت دیدگاه‌ها</h1>
        <p class="page-description">{{ total }} دیدگاه در سیستم ثبت شده است</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid-sm">
      <div class="stat-mini" @click="statusFilter = 'pending'">
        <div class="stat-mini-icon bg-amber-100 text-amber-600">
          <Icon name="lucide:clock" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.pending }}</span>
          <span class="stat-mini-label">در انتظار تایید</span>
        </div>
      </div>
      <div class="stat-mini" @click="statusFilter = 'approved'">
        <div class="stat-mini-icon bg-green-100 text-green-600">
          <Icon name="lucide:check-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.approved }}</span>
          <span class="stat-mini-label">تایید شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="statusFilter = 'rejected'">
        <div class="stat-mini-icon bg-red-100 text-red-600">
          <Icon name="lucide:x-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.rejected }}</span>
          <span class="stat-mini-label">رد شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="statusFilter = ''">
        <div class="stat-mini-icon bg-blue-100 text-blue-600">
          <Icon name="lucide:star" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ avgRating }}</span>
          <span class="stat-mini-label">میانگین امتیاز</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
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
                placeholder="جستجو در دیدگاه‌ها..."
                class="w-64" />
            </div>
            <UICSelect
              v-model="statusFilter"
              :items="statusFilterItems"
              placeholder="همه وضعیت‌ها"
              class="w-40!"
              @update:model-value="applyFilters" />
            <UICSelect
              v-model="ratingFilter"
              :items="ratingFilterItems"
              placeholder="همه امتیازها"
              class="w-36!"
              @update:model-value="applyFilters" />
          </div>
          <div class="action-bar-end">
            <!-- Bulk Actions -->
            <div v-if="selectedReviews.size > 0" class="flex items-center gap-2">
              <span class="text-sm text-gray-600"
                >{{ selectedReviews.size }} مورد انتخاب شده</span
              >
              <button @click="bulkApprove" class="btn-success text-sm! py-1.5! px-3!">
                <Icon name="lucide:check" class="w-4 h-4" />
                تایید همه
              </button>
              <button @click="bulkReject" class="btn-danger text-sm! py-1.5! px-3!">
                <Icon name="lucide:x" class="w-4 h-4" />
                رد همه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="card-dashboard">
      <div class="reviews-list">
        <div v-for="review in filteredData" :key="review.id" class="review-item">
          <div class="review-checkbox">
            <input
              type="checkbox"
              :checked="selectedReviews.has(review.id)"
              @change="toggleSelect(review.id)"
              class="form-checkbox" />
          </div>
          <div class="review-content">
            <div class="review-header">
              <div class="review-user">
                <div class="avatar-placeholder avatar-sm">
                  {{ getInitials(review.fullname) }}
                </div>
                <div>
                  <span class="review-user-name">{{ review.fullname }}</span>
                  <span class="review-date">{{ review.created_at }}</span>
                </div>
              </div>
              <div class="review-meta">
                <div class="review-rating">
                  <NuxtRating
                    :read-only="true"
                    :rating-value="review.rating"
                    :rating-size="16"
                    dir="ltr"
                    :rating-content="[
                      9.153, 5.408, 12.0, 2.0, 14.847, 5.408, 15.175, 5.996, 15.995, 7.178,
                      17.325, 7.628, 17.961, 7.772, 21.943, 9.548, 19.72, 13.43, 19.286,
                      13.937, 18.464, 15.117, 18.465, 16.577, 18.531, 17.254, 18.145, 21.76,
                      13.925, 20.751, 13.328, 20.477, 12.0, 20.025, 10.672, 20.477, 10.076,
                      20.751, 5.856, 21.761, 5.469, 17.254, 5.535, 16.578, 5.535, 15.118,
                      4.714, 13.938, 4.28, 13.43, 2.057, 9.548, 6.04, 7.772, 6.676, 7.628,
                      8.005, 7.178, 8.825, 5.996,
                    ]"
                  />
                </div>
                <span class="badge" :class="getStatusBadgeClass(review.status)">{{
                  getStatusLabel(review.status)
                }}</span>
              </div>
            </div>
            <div class="review-lawyer">
              <Icon name="lucide:scale" class="w-4 h-4 text-gray-400" />
              <span>{{ review.lawyer }}</span>
            </div>
            <p class="review-text">{{ review.comment }}</p>
            <div class="review-actions" v-if="review.status === 'pending'">
              <button
                @click="acceptHandle(review.id)"
                class="btn-success text-sm! py-1.5! px-3!">
                <Icon name="lucide:check" class="w-4 h-4" />
                تایید
              </button>
              <button
                @click="rejectHandle(review.id)"
                class="btn-danger text-sm! py-1.5! px-3!">
                <Icon name="lucide:x" class="w-4 h-4" />
                رد
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredData.length === 0" class="empty-state py-16">
          <div class="empty-state-icon">
            <Icon name="lucide:message-circle" class="w-8 h-8" />
          </div>
          <h4 class="empty-state-title">دیدگاهی یافت نشد</h4>
          <p class="empty-state-description">با تغییر فیلترها نتایج جدید ببینید</p>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="total > 15"
        class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500"
          >صفحه {{ page }} از {{ Math.ceil(total / 15) }}</span
        >
        <UPagination
          v-model:page="page"
          :items-per-page="15"
          :total="total"
          :sibling-count="1"
          :ui="{
            list: 'gap-1',
            item: 'min-w-8 h-8 text-sm',
            first: 'hidden',
            last: 'hidden',
            prev: 'scale-x-[-1]',
            next: 'scale-x-[-1]',
          }" />
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: "مدیریت دیدگاه‌ها | وکیلینجا" });

const page = ref(1);
const data = ref([]);
const total = ref(0);
const searchQuery = ref("");
const statusFilter = ref(null);
const ratingFilter = ref(null);
const selectedReviews = ref(new Set());

// Filter items for UICSelect
const statusFilterItems = [
  { id: null, label: "همه وضعیت‌ها" },
  { id: "pending", label: "در انتظار" },
  { id: "approved", label: "تایید شده" },
  { id: "rejected", label: "رد شده" },
];

const ratingFilterItems = [
  { id: null, label: "همه امتیازها" },
  { id: "5", label: "۵ ستاره" },
  { id: "4", label: "۴ ستاره" },
  { id: "3", label: "۳ ستاره" },
  { id: "2", label: "۲ ستاره" },
  { id: "1", label: "۱ ستاره" },
];

// Stats
const statusCounts = ref({ pending: 0, approved: 0, rejected: 0 });
const avgRating = ref("4.2");

// Debounced search
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchReviews(1, true);
  }, 500);
};

// Filtered data
const filteredData = computed(() => {
  let result = data.value;
  if (statusFilter.value) {
    result = result.filter((r) => r.status === statusFilter.value);
  }
  if (ratingFilter.value) {
    result = result.filter((r) => r.rating === parseInt(ratingFilter.value));
  }
  return result;
});

const applyFilters = () => {
  page.value = 1;
  fetchReviews(1, true);
};

async function fetchReviews(pageNum = 1, setTotal = false) {
  const res = await useGet({
    url: "admin/reviews",
    includeAuthHeader: true,
    query: {
      page: pageNum,
      status: statusFilter.value || undefined,
      rating: ratingFilter.value || undefined,
      search: searchQuery.value || undefined,
    },
  });

  const reviews = res.data.data;
  data.value = reviews.map((rev) => ({
    id: rev.id,
    fullname: `${rev.user?.name} ${rev.user?.family}`,
    lawyer: rev.lawyer?.full_name,
    rating: rev.rating,
    comment: rev.comment,
    status: rev.status,
    created_at: rev.created_at_formatted,
  }));

  if (setTotal) {
    total.value = res.data.meta.total;
    calculateStats();
  }
}

const calculateStats = () => {
  statusCounts.value = { pending: 0, approved: 0, rejected: 0 };
  let totalRating = 0;
  data.value.forEach((r) => {
    if (statusCounts.value[r.status] !== undefined) {
      statusCounts.value[r.status]++;
    }
    totalRating += r.rating;
  });
  if (data.value.length > 0) {
    avgRating.value = (totalRating / data.value.length).toFixed(1);
  }
};

watch(
  () => page.value,
  (p) => fetchReviews(p),
);

await fetchReviews(page.value, true);

// Actions
async function acceptHandle(id) {
  await usePost({ url: `admin/reviews/${id}/approve`, includeAuthHeader: true });
  fetchReviews(page.value, true);
  useToast().add({ title: "دیدگاه تایید شد", color: "success" });
}

async function rejectHandle(id) {
  await usePost({ url: `admin/reviews/${id}/reject`, includeAuthHeader: true });
  fetchReviews(page.value, true);
  useToast().add({ title: "دیدگاه رد شد", color: "success" });
}

// Bulk actions
const toggleSelect = (id) => {
  if (selectedReviews.value.has(id)) {
    selectedReviews.value.delete(id);
  } else {
    selectedReviews.value.add(id);
  }
};

const bulkApprove = async () => {
  for (const id of selectedReviews.value) {
    await usePost({ url: `admin/reviews/${id}/approve`, includeAuthHeader: true });
  }
  selectedReviews.value.clear();
  fetchReviews(page.value, true);
  useToast().add({ title: "دیدگاه‌های انتخابی تایید شدند", color: "success" });
};

const bulkReject = async () => {
  for (const id of selectedReviews.value) {
    await usePost({ url: `admin/reviews/${id}/reject`, includeAuthHeader: true });
  }
  selectedReviews.value.clear();
  fetchReviews(page.value, true);
  useToast().add({ title: "دیدگاه‌های انتخابی رد شدند", color: "success" });
};

// Helpers
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .substring(0, 2);
};

const getStatusLabel = (status) => {
  const labels = { pending: "در انتظار", approved: "تایید شده", rejected: "رد شده" };
  return labels[status] || status;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-error",
  };
  return classes[status] || "badge-gray";
};
</script>

<style scoped>
@reference "tailwindcss";

.comments-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

/* Stats Grid Small */
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

/* Reviews List */
.reviews-list {
  @apply divide-y divide-gray-100;
}

.review-item {
  @apply flex gap-4 p-5;
}

.review-checkbox {
  @apply pt-1;
}

.form-checkbox {
  @apply w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500;
}

.review-content {
  @apply flex-1 space-y-3;
}

.review-header {
  @apply flex items-start justify-between;
}

.review-user {
  @apply flex items-center gap-3;
}

.review-user-name {
  @apply block font-medium text-gray-900;
}

.review-date {
  @apply block text-xs text-gray-400;
}

.review-meta {
  @apply flex items-center gap-3;
}

.review-rating {
  @apply flex items-center gap-0.5;
}

.review-lawyer {
  @apply flex items-center gap-2 text-sm text-gray-500;
}

.review-text {
  @apply text-sm text-gray-700 leading-relaxed;
}

.review-actions {
  @apply flex items-center gap-2 pt-2;
}

.btn-success,
.btn-danger {
  @apply inline-flex items-center gap-1;
}
</style>
