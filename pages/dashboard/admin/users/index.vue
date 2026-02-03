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
                class="w-72"
              />
            </div>

            <!-- Wallet Filter -->
            <select v-model="walletFilter" @change="applyFilters" class="select-dashboard w-44!">
              <option value="all">همه کاربران</option>
              <option value="with_balance">دارای موجودی</option>
              <option value="zero_balance">بدون موجودی</option>
            </select>

            <!-- Activity Filter -->
            <select v-model="activityFilter" @change="applyFilters" class="select-dashboard w-40!">
              <option value="all">همه</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
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
    <dashboard-admin-generic-table
      :data="data"
      :columns="tableColumns"
      :current-page="page"
      :total-items="total"
      :items-per-page="15"
      row-key="phone"
      empty-title="کاربری یافت نشد"
      empty-message="با تغییر فیلترها یا جستجو، کاربران را پیدا کنید"
      empty-icon="lucide:users"
      @update:page="page = $event"
    >
      <!-- Custom cell for user info -->
      <template #cell-fullName="{ row }">
        <div class="flex items-center gap-3">
          <div class="avatar-placeholder avatar-sm">
            {{ getInitials(row.fullName) }}
          </div>
          <div>
            <span class="font-medium text-gray-900">{{ row.fullName || 'بدون نام' }}</span>
          </div>
        </div>
      </template>

      <!-- Custom cell for phone -->
      <template #cell-phone="{ value }">
        <span class="font-mono text-gray-600">{{ value }}</span>
      </template>

      <!-- Custom cell for active tickets -->
      <template #cell-activeTicket="{ value }">
        <span v-if="value > 0" class="badge badge-info">{{ value }}</span>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- Custom cell for orders -->
      <template #cell-orders="{ value }">
        <span v-if="value > 0" class="font-medium">{{ value }}</span>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- Custom cell for comments -->
      <template #cell-comments="{ value }">
        <span v-if="value > 0" class="font-medium">{{ value }}</span>
        <span v-else class="text-gray-400">-</span>
      </template>

      <!-- Custom cell for wallet amount -->
      <template #cell-amount="{ value }">
        <span class="font-medium" :class="value > 0 ? 'text-green-600' : 'text-gray-400'">
          {{ formatCurrency(value) }}
        </span>
      </template>

      <!-- Custom actions -->
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button class="btn-icon" title="مشاهده جزئیات" @click="viewUserDetails(row)">
            <Icon name="lucide:eye" class="w-4 h-4" />
          </button>
          <UDropdownMenu
            :content="{ align: 'end' }"
            :items="getUserActions(row)"
          >
            <button class="btn-icon">
              <Icon name="lucide:more-vertical" class="w-4 h-4" />
            </button>
          </UDropdownMenu>
        </div>
      </template>
    </dashboard-admin-generic-table>

    <!-- User Details Modal -->
    <UModal v-model:open="showUserModal">
      <template #body>
        <div class="modal-content">
          <!-- <div class="modal-header">
            <h3 class="modal-title">جزئیات کاربر</h3>
            <button @click="showUserModal = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div> -->
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
                <span class="user-stat-value text-green-600">{{ formatCurrency(selectedUser.amount) }}</span>
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
import { ref, watch } from "vue";

useHead({
  title: "مدیریت کاربران | وکیلینجا",
});

// State
const page = ref(1);
const total = ref(0);
const data = ref([]);
const searchQuery = ref('');
const walletFilter = ref('all');
const activityFilter = ref('all');
const showUserModal = ref(false);
const selectedUser = ref(null);

// Table configuration
const tableColumns = [
  { key: 'fullName', label: 'کاربر' },
  { key: 'phone', label: 'شماره تماس' },
  { key: 'activeTicket', label: 'تیکت‌های فعال', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'orders', label: 'نوبت‌ها', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'comments', label: 'نظرات', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'amount', label: 'موجودی کیف پول', headerClass: 'text-center', cellClass: 'text-center', format: 'currency' },
];

const getUserActions = (user) => [
  {
    label: 'مشاهده نوبت‌ها',
    icon: 'lucide:calendar',
    onSelect: () => viewUserAppointments(user),
  },
  {
    label: 'مشاهده تیکت‌ها',
    icon: 'lucide:ticket',
    onSelect: () => viewUserTickets(user),
  },
  { type: 'separator' },
  {
    label: 'ارسال نوتیفیکیشن',
    icon: 'lucide:bell',
    onSelect: () => sendNotification(user),
  },
  {
    label: 'مسدود کردن',
    icon: 'lucide:ban',
    onSelect: () => blockUser(user),
  },
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
        wallet: walletFilter.value !== 'all' ? walletFilter.value : undefined,
        activity: activityFilter.value !== 'all' ? activityFilter.value : undefined,
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
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.map(p => p.charAt(0)).join('').substring(0, 2) || '?';
};

const formatCurrency = (value) => {
  if (!value) return '۰ تومان';
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
};

const viewUserDetails = (user) => {
  selectedUser.value = user;
  showUserModal.value = true;
};

const viewUserAppointments = () => {
  useToast().add({ title: 'این قابلیت به زودی اضافه می‌شود', color: 'info' });
};

const viewUserTickets = () => {
  useToast().add({ title: 'این قابلیت به زودی اضافه می‌شود', color: 'info' });
};

const sendNotification = (user) => {
  useToast().add({ title: `ارسال نوتیفیکیشن به ${user.fullName}`, color: 'info' });
};

const blockUser = () => {
  useToast().add({ title: `این قابلیت به زودی اضافه می‌شود`, color: 'warning' });
};

const exportUsers = () => {
  useToast().add({ title: 'فایل اکسل در حال آماده‌سازی...', color: 'info' });
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
