<template>
  <div class="admin-dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">داشبورد مدیریت</h1>
        <p class="page-description">نمای کلی از وضعیت سیستم</p>
      </div>
      <div class="quick-actions">
        <NuxtLink to="/dashboard/admin/lawyerlist/add" class="btn-primary">
          <Icon name="lucide:user-plus" class="w-4 h-4" />
          <span>افزودن وکیل</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/admin/tickets" class="btn-secondary">
          <Icon name="lucide:ticket" class="w-4 h-4" />
          <span>تیکت‌ها</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon">
          <Icon name="lucide:users" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ stats.totalUsers }}</span>
          <span class="stat-card-label">کل کاربران</span>
          <span class="stat-card-change positive">
            <Icon name="lucide:trending-up" class="w-3 h-3" />
            {{ stats.usersGrowth }}%
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon success">
          <Icon name="lucide:scale" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ stats.totalLawyers }}</span>
          <span class="stat-card-label">وکلای فعال</span>
          <span class="stat-card-change positive">
            <Icon name="lucide:trending-up" class="w-3 h-3" />
            {{ stats.lawyersGrowth }}%
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon warning">
          <Icon name="lucide:calendar-check" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ stats.todayAppointments }}</span>
          <span class="stat-card-label">نوبت‌های امروز</span>
          <span
            class="stat-card-change"
            :class="stats.appointmentsChange >= 0 ? 'positive' : 'negative'">
            <Icon
              :name="
                stats.appointmentsChange >= 0
                  ? 'lucide:trending-up'
                  : 'lucide:trending-down'
              "
              class="w-3 h-3" />
            {{ Math.abs(stats.appointmentsChange) }}%
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon info">
          <Icon name="lucide:wallet" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ formatCurrency(stats.totalRevenue) }}</span>
          <span class="stat-card-label">درآمد ماهانه</span>
          <span class="stat-card-change positive">
            <Icon name="lucide:trending-up" class="w-3 h-3" />
            {{ stats.revenueGrowth }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-grid">
      <!-- Weekly Appointments Chart -->
      <div class="card-dashboard">
        <div class="card-dashboard-header">
          <h3 class="card-dashboard-title">نوبت‌های هفتگی</h3>
          <div class="flex items-center gap-2">
            <span class="badge badge-info">این هفته</span>
          </div>
        </div>
        <div class="card-dashboard-body">
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div
                v-for="(day, index) in weeklyData"
                :key="index"
                class="chart-bar-wrapper">
                <div
                  class="chart-bar"
                  :style="{ height: `${(day.value / maxWeeklyValue) * 100}%` }"></div>
                <span class="chart-bar-label">{{ day.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Appointment Types -->
      <div class="card-dashboard">
        <div class="card-dashboard-header">
          <h3 class="card-dashboard-title">انواع نوبت‌ها</h3>
        </div>
        <div class="card-dashboard-body">
          <div class="donut-stats">
            <div class="donut-item">
              <div class="donut-color bg-blue-500"></div>
              <div class="donut-info">
                <span class="donut-label">چت آنلاین</span>
                <span class="donut-value">{{ appointmentTypes.chat }}%</span>
              </div>
            </div>
            <div class="donut-item">
              <div class="donut-color bg-green-500"></div>
              <div class="donut-info">
                <span class="donut-label">تماس تلفنی</span>
                <span class="donut-value">{{ appointmentTypes.phone }}%</span>
              </div>
            </div>
            <div class="donut-item">
              <div class="donut-color bg-amber-500"></div>
              <div class="donut-info">
                <span class="donut-label">حضوری</span>
                <span class="donut-value">{{ appointmentTypes.inperson }}%</span>
              </div>
            </div>
          </div>
          <div class="donut-chart">
            <svg viewBox="0 0 36 36" class="donut-svg">
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#e5e7eb"
                stroke-width="3"></circle>
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#3b82f6"
                stroke-width="3"
                stroke-dasharray="40 60"
                stroke-dashoffset="25"></circle>
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#22c55e"
                stroke-width="3"
                stroke-dasharray="35 65"
                stroke-dashoffset="-15"></circle>
              <circle
                cx="18"
                cy="18"
                r="15.91549430918954"
                fill="transparent"
                stroke="#f59e0b"
                stroke-width="3"
                stroke-dasharray="25 75"
                stroke-dashoffset="-50"></circle>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Appointments & Pending Tasks -->
    <div class="tables-grid">
      <!-- Today's Appointments -->
      <div class="card-dashboard">
        <div class="card-dashboard-header">
          <h3 class="card-dashboard-title">نوبت‌های امروز</h3>
          <NuxtLink
            to="/dashboard/appointments"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه
            <Icon name="lucide:arrow-left" class="w-4 h-4 inline mr-1" />
          </NuxtLink>
        </div>
        <div class="card-dashboard-body p-0!">
          <div v-if="todayAppointments.length === 0" class="empty-state py-12">
            <div class="empty-state-icon">
              <Icon name="lucide:calendar-x" class="w-8 h-8" />
            </div>
            <h4 class="empty-state-title">نوبتی برای امروز ثبت نشده</h4>
            <p class="empty-state-description">
              نوبت‌های جدید در اینجا نمایش داده می‌شوند
            </p>
          </div>
          <table v-else class="table-dashboard">
            <thead>
              <tr>
                <th>کاربر</th>
                <th>وکیل</th>
                <th>نوع</th>
                <th>ساعت</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appointment in todayAppointments" :key="appointment.id">
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar-placeholder avatar-sm">
                      {{ getInitials(appointment.user) }}
                    </div>
                    <span>{{ appointment.user }}</span>
                  </div>
                </td>
                <td>{{ appointment.lawyer }}</td>
                <td>
                  <span class="badge" :class="getTypeBadgeClass(appointment.type)">
                    {{ getTypeLabel(appointment.type) }}
                  </span>
                </td>
                <td class="font-mono">{{ appointment.time }}</td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(appointment.status)">
                    {{ getStatusLabel(appointment.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pending Tasks -->
      <div class="card-dashboard">
        <div class="card-dashboard-header">
          <h3 class="card-dashboard-title">در انتظار اقدام</h3>
        </div>
        <div class="card-dashboard-body">
          <div class="pending-list">
            <NuxtLink to="/dashboard/admin/registerlawyer" class="pending-item">
              <div class="pending-icon bg-amber-100 text-amber-600">
                <Icon name="lucide:user-check" class="w-5 h-5" />
              </div>
              <div class="pending-info">
                <span class="pending-title">تایید وکلای جدید</span>
                <span class="pending-count">{{ pendingCounts.lawyers }} مورد</span>
              </div>
              <Icon name="lucide:chevron-left" class="w-5 h-5 text-gray-400" />
            </NuxtLink>

            <NuxtLink to="/dashboard/admin/tickets" class="pending-item">
              <div class="pending-icon bg-blue-100 text-blue-600">
                <Icon name="lucide:message-square" class="w-5 h-5" />
              </div>
              <div class="pending-info">
                <span class="pending-title">تیکت‌های باز</span>
                <span class="pending-count">{{ pendingCounts.tickets }} مورد</span>
              </div>
              <Icon name="lucide:chevron-left" class="w-5 h-5 text-gray-400" />
            </NuxtLink>

            <NuxtLink to="/dashboard/admin/comments" class="pending-item">
              <div class="pending-icon bg-purple-100 text-purple-600">
                <Icon name="lucide:message-circle" class="w-5 h-5" />
              </div>
              <div class="pending-info">
                <span class="pending-title">نظرات در انتظار تایید</span>
                <span class="pending-count">{{ pendingCounts.comments }} مورد</span>
              </div>
              <Icon name="lucide:chevron-left" class="w-5 h-5 text-gray-400" />
            </NuxtLink>

            <NuxtLink to="/dashboard/admin/billing" class="pending-item">
              <div class="pending-icon bg-green-100 text-green-600">
                <Icon name="lucide:banknote" class="w-5 h-5" />
              </div>
              <div class="pending-info">
                <span class="pending-title">درخواست‌های برداشت</span>
                <span class="pending-count">{{ pendingCounts.withdrawals }} مورد</span>
              </div>
              <Icon name="lucide:chevron-left" class="w-5 h-5 text-gray-400" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: "داشبورد ادمین | وکیلینجا",
});

// Mock data - TODO: Replace with API calls
const stats = ref({
  totalUsers: 1248,
  usersGrowth: 12,
  totalLawyers: 86,
  lawyersGrowth: 8,
  todayAppointments: 24,
  appointmentsChange: 5,
  totalRevenue: 45600000,
  revenueGrowth: 15,
});

const pendingCounts = ref({
  lawyers: 5,
  tickets: 12,
  comments: 8,
  withdrawals: 3,
});

const weeklyData = ref([
  { label: "شنبه", value: 12 },
  { label: "یکشنبه", value: 19 },
  { label: "دوشنبه", value: 15 },
  { label: "سه‌شنبه", value: 22 },
  { label: "چهارشنبه", value: 18 },
  { label: "پنجشنبه", value: 25 },
  { label: "جمعه", value: 8 },
]);

const maxWeeklyValue = computed(() => Math.max(...weeklyData.value.map((d) => d.value)));

const appointmentTypes = ref({
  chat: 40,
  phone: 35,
  inperson: 25,
});

const todayAppointments = ref([
  {
    id: 1,
    user: "علی محمدی",
    lawyer: "دکتر احمدی",
    type: "chat",
    time: "10:00",
    status: "reserved",
  },
  {
    id: 2,
    user: "مریم رضایی",
    lawyer: "خانم کریمی",
    type: "phone",
    time: "11:30",
    status: "reserved",
  },
  {
    id: 3,
    user: "حسین نوری",
    lawyer: "آقای موسوی",
    type: "inperson",
    time: "14:00",
    status: "done",
  },
  {
    id: 4,
    user: "فاطمه زارعی",
    lawyer: "دکتر احمدی",
    type: "chat",
    time: "16:00",
    status: "pending_payment",
  },
]);

// Utility functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("fa-IR").format(value / 10) + " تومان";
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts
    .map((p) => p.charAt(0))
    .join("")
    .substring(0, 2);
};

const getTypeLabel = (type) => {
  const labels = { chat: "چت", phone: "تلفنی", inperson: "حضوری" };
  return labels[type] || type;
};

const getTypeBadgeClass = (type) => {
  const classes = {
    chat: "badge-info",
    phone: "badge-success",
    inperson: "badge-warning",
  };
  return classes[type] || "badge-gray";
};

const getStatusLabel = (status) => {
  const labels = {
    reserved: "رزرو شده",
    done: "انجام شده",
    pending_payment: "در انتظار پرداخت",
    cancelled: "لغو شده",
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    reserved: "badge-success",
    done: "badge-gray",
    pending_payment: "badge-warning",
    cancelled: "badge-error",
  };
  return classes[status] || "badge-gray";
};

// TODO: Fetch real data from API
// const { data: dashboardData } = await useGet('admin/dashboard');
</script>

<style scoped>
@reference "tailwindcss";

.admin-dashboard {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.quick-actions {
  @apply flex items-center gap-3;
}

.quick-actions .btn-primary,
.quick-actions .btn-secondary {
  @apply inline-flex items-center gap-2;
}

/* Stats Grid */
.stats-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
}

.stat-content {
  @apply flex flex-col flex-1;
}

/* Charts Grid */
.charts-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

/* Chart Placeholder */
.chart-placeholder {
  @apply h-48;
}

.chart-bars {
  @apply flex items-end justify-between h-full gap-2;
}

.chart-bar-wrapper {
  @apply flex-1 flex flex-col items-center gap-2;
}

.chart-bar {
  @apply w-full rounded-t-md min-h-[8px];
  background: linear-gradient(to top, var(--accent), var(--accent-light));
}

.chart-bar-label {
  @apply text-xs text-gray-500;
}

/* Donut Chart */
.donut-stats {
  @apply space-y-3 mb-4;
}

.donut-item {
  @apply flex items-center gap-3;
}

.donut-color {
  @apply w-3 h-3 rounded-full;
}

.donut-info {
  @apply flex items-center justify-between flex-1;
}

.donut-label {
  @apply text-sm text-gray-600;
}

.donut-value {
  @apply text-sm font-semibold text-gray-900;
}

.donut-chart {
  @apply w-32 h-32 mx-auto;
}

.donut-svg {
  @apply w-full h-full transform -rotate-90;
}

/* Tables Grid */
.tables-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

.tables-grid > :first-child {
  @apply lg:col-span-2;
}

/* Pending List */
.pending-list {
  @apply space-y-2;
}

.pending-item {
  @apply flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors;
}

.pending-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
}

.pending-info {
  @apply flex-1;
}

.pending-title {
  @apply block text-sm font-medium text-gray-900;
}

.pending-count {
  @apply block text-xs text-gray-500;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .dashboard-overview {
    @apply gap-4;
  }

  .quick-actions {
    @apply flex-wrap gap-2;
  }

  .quick-actions .btn-primary,
  .quick-actions .btn-secondary {
    @apply text-xs px-3 py-2;
  }

  .stat-card {
    @apply p-3;
  }

  .stat-icon {
    @apply w-10 h-10;
  }

  .stat-value {
    @apply text-xl;
  }

  .stat-label {
    @apply text-xs;
  }

  .chart-card {
    @apply p-3;
  }

  .card-header {
    @apply flex-col items-start gap-2 mb-3;
  }

  .card-title {
    @apply text-sm;
  }

  .pending-item {
    @apply p-2 gap-3;
  }

  .pending-icon {
    @apply w-8 h-8;
  }

  .pending-title {
    @apply text-xs;
  }

  .donut-chart {
    @apply w-24 h-24;
  }

  .legend-items {
    @apply grid grid-cols-2 gap-2;
  }
}
</style>
