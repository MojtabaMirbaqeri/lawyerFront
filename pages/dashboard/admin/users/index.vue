<template>
  <div class="users-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت کاربران</h1>
        <p class="page-description">{{ total }} کاربر در سیستم ثبت شده است</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="exportUsers" class="btn-secondary">
          <Icon name="lucide:download" class="w-4 h-4" />
          <span>خروجی اکسل</span>
        </button>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <div class="action-bar-start">
            <!-- Search -->
            <div class="search-box">
              <Icon name="lucide:search" class="icon" />
              <input
                v-model="searchQuery"
                @input="debouncedSearch"
                type="text"
                placeholder="جستجوی نام یا شماره تلفن..."
                class="w-72" />
            </div>

            <!-- Wallet Filter -->
            <UICSelect
              v-model="walletFilter"
              :items="walletFilterItems"
              placeholder="همه کاربران"
              class="w-44!"
              @update:model-value="applyFilters" />

            <!-- Activity Filter -->
            <UICSelect
              v-model="activityFilter"
              :items="activityFilterItems"
              placeholder="همه"
              class="w-40!"
              @update:model-value="applyFilters" />
          </div>

          <div class="action-bar-end">
            <span class="text-sm text-gray-500">
              نمایش {{ data.length }} از {{ total }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card-dashboard">
      <div class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>کاربر</th>
              <th>شماره تماس</th>
              <th class="text-center">تیکت‌های فعال</th>
              <th class="text-center">نوبت‌ها</th>
              <th class="text-center">نظرات</th>
              <th class="text-center">موجودی کیف پول</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in data" :key="user.phone">
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar-placeholder avatar-sm">
                    {{ getInitials(user.fullName) }}
                  </div>
                  <div>
                    <span class="font-medium text-gray-900">{{
                      user.fullName || "بدون نام"
                    }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="font-mono text-gray-600">{{ user.phone }}</span>
              </td>
              <td class="text-center">
                <span v-if="user.activeTicket > 0" class="badge badge-info">
                  {{ user.activeTicket }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="text-center">
                <span v-if="user.orders > 0" class="font-medium">{{ user.orders }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="text-center">
                <span v-if="user.comments > 0" class="font-medium">{{
                  user.comments
                }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="text-center">
                <span
                  class="font-medium"
                  :class="user.amount > 0 ? 'text-green-600' : 'text-gray-400'">
                  {{ formatCurrency(user.amount) }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="viewUserDetails(user)"
                    class="btn-icon"
                    title="مشاهده جزئیات">
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </button>
                  <UDropdownMenu
                    :content="{ align: 'end' }"
                    :items="getUserActions(user)">
                    <button class="btn-icon">
                      <Icon name="lucide:more-vertical" class="w-4 h-4" />
                    </button>
                  </UDropdownMenu>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="data.length === 0" class="empty-state py-16">
        <div class="empty-state-icon">
          <Icon name="lucide:users" class="w-8 h-8" />
        </div>
        <h4 class="empty-state-title">کاربری یافت نشد</h4>
        <p class="empty-state-description">
          با تغییر فیلترها یا جستجو، کاربران را پیدا کنید
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="data.length > 0"
        class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500">
          صفحه {{ page }} از {{ Math.ceil(total / 15) }}
        </span>
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

    <!-- User Details Modal -->
    <UModal v-model:open="showUserModal">
      <template #content>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">جزئیات کاربر</h3>
            <button @click="showUserModal = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="user-detail-header">
              <div class="avatar-placeholder avatar-xl">
                {{ getInitials(selectedUser.fullName) }}
              </div>
              <div>
                <h4 class="text-lg font-semibold">{{ selectedUser.fullName }}</h4>
                <span class="text-gray-500">{{ selectedUser.phone }}</span>
              </div>
            </div>
            <div class="user-stats-grid">
              <div class="user-stat">
                <span class="user-stat-value">{{ selectedUser.orders }}</span>
                <span class="user-stat-label">نوبت</span>
              </div>
              <div class="user-stat">
                <span class="user-stat-value">{{ selectedUser.activeTicket }}</span>
                <span class="user-stat-label">تیکت فعال</span>
              </div>
              <div class="user-stat">
                <span class="user-stat-value">{{ selectedUser.comments }}</span>
                <span class="user-stat-label">نظر</span>
              </div>
              <div class="user-stat">
                <span class="user-stat-value text-green-600">{{
                  formatCurrency(selectedUser.amount)
                }}</span>
                <span class="user-stat-label">موجودی</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showUserModal = false" class="btn-secondary">بستن</button>
            <button class="btn-primary" @click="sendNotification(selectedUser)">
              <Icon name="lucide:bell" class="w-4 h-4" />
              ارسال نوتیفیکیشن
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { ref, watch, h } from "vue";

useHead({
  title: "مدیریت کاربران | وکیلینجا",
});

// State
const page = ref(1);
const total = ref(0);
const data = ref([]);
const searchQuery = ref("");
const walletFilter = ref("all");
const activityFilter = ref("all");
const showUserModal = ref(false);
const selectedUser = ref(null);

// Filter items for UICSelect
const walletFilterItems = [
  { id: "all", label: "همه کاربران" },
  { id: "with_balance", label: "دارای موجودی" },
  { id: "zero_balance", label: "بدون موجودی" },
];

const activityFilterItems = [
  { id: "all", label: "همه" },
  { id: "active", label: "فعال" },
  { id: "inactive", label: "غیرفعال" },
];

// Debounced search
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    fetchData(1, true);
  }, 500);
};

// Fetch data
const fetchData = async (pageNumber, setTotal = false) => {
  try {
    const res = await useGet({
      url: "users",
      includeAuthHeader: true,
      query: {
        page: pageNumber,
        search: searchQuery.value || undefined,
        wallet: walletFilter.value !== "all" ? walletFilter.value : undefined,
        activity: activityFilter.value !== "all" ? activityFilter.value : undefined,
      },
    });

    data.value = res.data.data.map((user) => ({
      id: user.id,
      fullName: `${user?.name || ""} ${user?.family || ""}`.trim(),
      phone: user?.phone,
      amount: user.wallet_balance || 0,
      activeTicket: user?.ticket_count || 0,
      orders: user?.appointment_count || 0,
      comments: user?.review_count || 0,
    }));

    if (setTotal && res.data.meta) {
      total.value = res.data.meta.total;
    }
  } catch (error) {
    console.error("خطا در واکشی اطلاعات کاربران:", error);
    useToast().add({ title: "خطا در دریافت اطلاعات", color: "error" });
  }
};

// Initial fetch
await fetchData(1, true);

// Watch page changes
watch(page, (newPage) => {
  fetchData(newPage);
});

// Apply filters
const applyFilters = () => {
  page.value = 1;
  fetchData(1, true);
};

// Utilities
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (
    parts
      .map((p) => p.charAt(0))
      .join("")
      .substring(0, 2) || "?"
  );
};

const formatCurrency = (value) => {
  if (!value) return "۰ تومان";
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
};

const viewUserDetails = (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const getUserActions = (user) => [
  {
    label: "مشاهده نوبت‌ها",
    icon: "lucide:calendar",
    onSelect: () => {
      // TODO: Navigate to user appointments
      useToast().add({ title: "این قابلیت به زودی اضافه می‌شود", color: "info" });
    },
  },
  {
    label: "مشاهده تیکت‌ها",
    icon: "lucide:ticket",
    onSelect: () => {
      // TODO: Navigate to user tickets
      useToast().add({ title: "این قابلیت به زودی اضافه می‌شود", color: "info" });
    },
  },
  { type: "separator" },
  {
    label: "ارسال نوتیفیکیشن",
    icon: "lucide:bell",
    onSelect: () => sendNotification(user),
  },
  {
    label: "مسدود کردن",
    icon: "lucide:ban",
    onSelect: () => blockUser(user),
  },
];

const sendNotification = (user) => {
  // TODO: Implement notification sending
  useToast().add({ title: `ارسال نوتیفیکیشن به ${user.fullName}`, color: "info" });
};

const blockUser = (user) => {
  // TODO: Implement user blocking
  useToast().add({ title: `این قابلیت به زودی اضافه می‌شود`, color: "warning" });
};

const exportUsers = () => {
  // TODO: Implement export
  useToast().add({ title: "فایل اکسل در حال آماده‌سازی...", color: "info" });
};
</script>

<style scoped>
@reference "tailwindcss";

.users-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.btn-primary,
.btn-secondary {
  @apply inline-flex items-center gap-2;
}

/* User Details Modal */
.user-detail-header {
  @apply flex items-center gap-4 pb-4 border-b border-gray-100 mb-4;
}

.user-stats-grid {
  @apply grid grid-cols-2 sm:grid-cols-4 gap-4;
}

.user-stat {
  @apply bg-gray-50 rounded-lg p-3 text-center;
}

.user-stat-value {
  @apply block text-xl font-bold text-gray-900;
}

.user-stat-label {
  @apply text-xs text-gray-500;
}
</style>
