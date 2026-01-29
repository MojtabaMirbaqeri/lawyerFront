<template>
  <div class="lawyer-dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">داشبورد</h1>
        <p class="page-description">خوش آمدید، {{ authStore.user?.name }}</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/dashboard/lawyer/profile" class="btn-primary">
          <Icon name="lucide:user" class="w-4 h-4" />
          <span>ویرایش پروفایل</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Profile Completion Alert -->
    <div v-if="comProfile < 100" class="profile-completion-card">
      <div class="profile-completion-content">
        <div class="profile-completion-info">
          <Icon name="lucide:info" class="w-5 h-5 text-blue-500" />
          <div>
            <h4 class="font-medium text-gray-900">تکمیل پروفایل</h4>
            <p class="text-sm text-gray-500">پروفایل کامل‌تر = مشتریان بیشتر</p>
          </div>
        </div>
        <div class="profile-completion-progress">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">{{ comProfile }}% تکمیل شده</span>
            <NuxtLink to="/dashboard/lawyer/profile" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
              تکمیل پروفایل
              <Icon name="lucide:arrow-left" class="w-4 h-4 inline" />
            </NuxtLink>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" :style="{ width: `${comProfile}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon">
          <Icon name="lucide:calendar-check" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ dashboardRes?.data?.stats?.total_appointments || 0 }}</span>
          <span class="stat-card-label">کل نوبت‌ها</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon success">
          <Icon name="lucide:wallet" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ formatCurrency(dashboardRes?.data?.stats?.total_income || 0) }}</span>
          <span class="stat-card-label">درآمد کل</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon warning">
          <Icon name="lucide:star" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ dashboardRes?.data?.stats?.average_rating || '0.0' }}</span>
          <span class="stat-card-label">میانگین امتیاز</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-icon info">
          <Icon name="lucide:message-circle" class="w-6 h-6 text-white" />
        </div>
        <div class="stat-content">
          <span class="stat-card-value">{{ dashboardRes?.data?.stats?.total_reviews || 0 }}</span>
          <span class="stat-card-label">نظرات</span>
        </div>
      </div>
    </div>

    <!-- Today's Appointments -->
    <div class="card-dashboard">
      <div class="card-dashboard-header">
        <h3 class="card-dashboard-title">
          <Icon name="lucide:calendar" class="w-5 h-5 text-blue-500 inline ml-2" />
          نوبت‌های امروز
        </h3>
        <NuxtLink to="/dashboard/appointments" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
          مشاهده همه
          <Icon name="lucide:arrow-left" class="w-4 h-4 inline" />
        </NuxtLink>
      </div>
      <div class="card-dashboard-body p-0!">
        <div v-if="!dashboardRes?.data?.today_appointments?.length" class="empty-state py-12">
          <div class="empty-state-icon">
            <Icon name="lucide:calendar-x" class="w-8 h-8" />
          </div>
          <h4 class="empty-state-title">نوبتی برای امروز ندارید</h4>
          <p class="empty-state-description">نوبت‌های جدید در اینجا نمایش داده می‌شوند</p>
        </div>
        <div v-else class="appointments-list">
          <div v-for="apt in dashboardRes.data.today_appointments" :key="apt.id" class="appointment-item">
            <div class="appointment-time">
              <Icon name="lucide:clock" class="w-4 h-4" />
              <span>{{ apt.time }}</span>
            </div>
            <div class="appointment-info">
              <span class="appointment-client">{{ apt.client_name }}</span>
              <div class="appointment-meta">
                <span class="badge" :class="getTypeBadgeClass(apt.type)">{{ getTypeLabel(apt.type) }}</span>
                <span class="text-gray-400">{{ apt.duration }} دقیقه</span>
              </div>
            </div>
            <button v-if="apt.type === 'chat'" class="btn-primary text-sm! py-1.5! px-3!">
              <Icon name="lucide:message-square" class="w-4 h-4" />
              آغاز چت
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Reviews -->
      <div class="card-dashboard">
        <div class="card-dashboard-header">
          <h3 class="card-dashboard-title">
            <Icon name="lucide:star" class="w-5 h-5 text-amber-500 inline ml-2" />
            نظرات اخیر
          </h3>
        </div>
        <div class="card-dashboard-body p-0!">
          <div v-if="!dashboardRes?.data?.recent_reviews?.length" class="empty-state py-10">
            <div class="empty-state-icon">
              <Icon name="lucide:message-circle" class="w-6 h-6" />
            </div>
            <h4 class="empty-state-title text-sm!">نظری ثبت نشده</h4>
          </div>
          <div v-else class="reviews-list-compact">
            <div v-for="review in dashboardRes.data.recent_reviews" :key="review.id" class="review-item-compact">
              <div class="review-header-compact">
                <span class="font-medium text-gray-900">{{ review.client_name }}</span>
                <div class="review-rating-compact">
                  <Icon v-for="i in 5" :key="i" name="lucide:star" class="w-3.5 h-3.5" :class="i <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'" />
                </div>
              </div>
              <p class="review-text-compact">{{ review.comment }}</p>
              <span class="review-date-compact">{{ formatDate(review.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Tickets -->
      <div class="card-dashboard">
        <div class="card-dashboard-header">
          <h3 class="card-dashboard-title">
            <Icon name="lucide:ticket" class="w-5 h-5 text-purple-500 inline ml-2" />
            تیکت‌های اخیر
          </h3>
          <NuxtLink to="/dashboard/ticket/tickets" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            مشاهده همه
          </NuxtLink>
        </div>
        <div class="card-dashboard-body p-0!">
          <div v-if="!dashboardRes?.data?.recent_tickets?.length" class="empty-state py-10">
            <div class="empty-state-icon">
              <Icon name="lucide:ticket" class="w-6 h-6" />
            </div>
            <h4 class="empty-state-title text-sm!">تیکتی ثبت نشده</h4>
          </div>
          <div v-else class="tickets-list-compact">
            <div v-for="ticket in dashboardRes.data.recent_tickets" :key="ticket.id" class="ticket-item-compact" @click="navigateTo(`/dashboard/ticket/${ticket.id}`)">
              <div class="ticket-info-compact">
                <span class="ticket-number-compact">#{{ ticket.ticket_number }}</span>
                <span class="ticket-title-compact">{{ ticket.title }}</span>
              </div>
              <span class="badge" :class="getTicketStatusBadgeClass(ticket.status)">{{ ticket.status_label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h, resolveComponent } from "vue";

useHead({ title: "داشبورد | وکیلینجا" });

const authStore = useAuthStore();
const UBadge = resolveComponent("UBadge");

const { data: dashboardRes } = await useGet({
  url: "lawyer/dashboard",
  includeAuthHeader: true,
});

const comProfile = ref(dashboardRes?.data?.profile_completion?.completion_percentage || 0);

// Helpers
const formatCurrency = (value) => {
  if (!value) return '۰ تومان';
  return new Intl.NumberFormat('fa-IR').format(value / 10) + ' تومان';
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("fa-IR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTypeLabel = (type) => {
  const labels = { inperson: 'حضوری', phone: 'تلفنی', chat: 'چت' };
  return labels[type] || type;
};

const getTypeBadgeClass = (type) => {
  const classes = { inperson: 'badge-warning', phone: 'badge-info', chat: 'badge-success' };
  return classes[type] || 'badge-gray';
};

const getTicketStatusBadgeClass = (status) => {
  const classes = { open: 'badge-info', closed: 'badge-gray', in_progress: 'badge-warning', answered: 'badge-success', waiting_for_user: 'badge-warning' };
  return classes[status] || 'badge-gray';
};
</script>

<style scoped>
@reference "tailwindcss";

.lawyer-dashboard {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.btn-primary {
  @apply inline-flex items-center gap-2;
}

/* Profile Completion Card */
.profile-completion-card {
  @apply bg-blue-50 rounded-xl p-5 border border-blue-100;
}

.profile-completion-content {
  @apply flex flex-col lg:flex-row lg:items-center gap-4;
}

.profile-completion-info {
  @apply flex items-center gap-3;
}

.profile-completion-progress {
  @apply flex-1;
}

/* Stats Grid */
.stats-grid {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4;
}

.stat-content {
  @apply flex flex-col flex-1;
}

/* Appointments List */
.appointments-list {
  @apply divide-y divide-gray-100;
}

.appointment-item {
  @apply flex items-center gap-4 p-4;
}

.appointment-time {
  @apply flex items-center gap-2 text-sm font-mono text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg;
}

.appointment-info {
  @apply flex-1;
}

.appointment-client {
  @apply block font-medium text-gray-900;
}

.appointment-meta {
  @apply flex items-center gap-3 mt-1;
}

/* Reviews Compact */
.reviews-list-compact {
  @apply divide-y divide-gray-100;
}

.review-item-compact {
  @apply p-4;
}

.review-header-compact {
  @apply flex items-center justify-between mb-2;
}

.review-rating-compact {
  @apply flex items-center gap-0.5;
}

.review-text-compact {
  @apply text-sm text-gray-600 line-clamp-2;
}

.review-date-compact {
  @apply text-xs text-gray-400 mt-2 block;
}

/* Tickets Compact */
.tickets-list-compact {
  @apply divide-y divide-gray-100;
}

.ticket-item-compact {
  @apply flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors;
}

.ticket-info-compact {
  @apply flex items-center gap-3;
}

.ticket-number-compact {
  @apply text-xs font-mono text-gray-400;
}

.ticket-title-compact {
  @apply text-sm font-medium text-gray-900;
}
</style>
