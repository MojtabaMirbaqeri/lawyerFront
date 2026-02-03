<template>
  <div class="appointments-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت نوبت‌ها</h1>
        <p class="page-description">{{ total }} نوبت در سیستم</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div class="view-toggle">
          <button @click="viewMode = 'calendar'" class="view-btn" :class="{ active: viewMode === 'calendar' }">
            <Icon name="lucide:calendar" class="w-4 h-4" />
          </button>
          <button @click="viewMode = 'list'" class="view-btn" :class="{ active: viewMode === 'list' }">
            <Icon name="lucide:list" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid-sm">
      <div class="stat-mini" @click="statusFilter = 'reserved'">
        <div class="stat-mini-icon bg-green-100 text-green-600">
          <Icon name="lucide:calendar-check" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.reserved }}</span>
          <span class="stat-mini-label">رزرو شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="statusFilter = 'pending_payment'">
        <div class="stat-mini-icon bg-amber-100 text-amber-600">
          <Icon name="lucide:clock" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.pending_payment }}</span>
          <span class="stat-mini-label">در انتظار پرداخت</span>
        </div>
      </div>
      <div class="stat-mini" @click="statusFilter = 'done'">
        <div class="stat-mini-icon bg-blue-100 text-blue-600">
          <Icon name="lucide:check-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.done }}</span>
          <span class="stat-mini-label">تکمیل شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="statusFilter = 'cancelled'">
        <div class="stat-mini-icon bg-red-100 text-red-600">
          <Icon name="lucide:x-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.cancelled }}</span>
          <span class="stat-mini-label">لغو شده</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <div class="action-bar-start">
            <UICSelect
              v-model="statusFilter"
              :items="statusFilterItems"
              placeholder="همه وضعیت‌ها"
              class="w-40!"
              @update:model-value="applyFilters"
            />
            <UICSelect
              v-model="typeFilter"
              :items="typeFilterItems"
              placeholder="همه انواع"
              class="w-36!"
              @update:model-value="applyFilters"
            />
          </div>
          <div class="action-bar-end">
            <button v-if="statusFilter || typeFilter" @click="clearFilters" class="btn-ghost text-sm!">
              <Icon name="lucide:x" class="w-4 h-4" />
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="card-dashboard">
      <div class="card-dashboard-body">
        <div class="calendar-placeholder">
          <div class="calendar-header">
            <button class="btn-icon" @click="prevWeek">
              <Icon name="lucide:chevron-right" class="w-5 h-5" />
            </button>
            <span class="text-lg font-semibold">{{ currentWeekLabel }}</span>
            <button class="btn-icon" @click="nextWeek">
              <Icon name="lucide:chevron-left" class="w-5 h-5" />
            </button>
          </div>
          <div class="calendar-scroll-wrap">
            <div class="calendar-grid">
            <div v-for="day in weekDays" :key="day.date" class="calendar-day-column">
              <div class="calendar-day-header-cell" :class="{ 'today': day.isToday }">
                <span class="day-name">{{ day.name }}</span>
                <span class="day-number">{{ day.number }}</span>
              </div>
              <div class="calendar-day-content">
                <div v-for="apt in getDayAppointments(day.date)" :key="apt.id" class="calendar-event" :class="getEventClass(apt.status)">
                  <span class="event-time">{{ apt.time }}</span>
                  <span class="event-title">{{ apt.user }}</span>
                  <span class="event-type">{{ apt.type }}</span>
                </div>
                <div v-if="getDayAppointments(day.date).length === 0" class="calendar-empty-day">
                  -
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="card-dashboard">
      <div class="overflow-x-auto">
        <table class="table-dashboard">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>کاربر</th>
              <th>وکیل</th>
              <th>نوع</th>
              <th>تاریخ</th>
              <th>ساعت</th>
              <th>وضعیت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="apt in filteredData" :key="apt.id">
              <td><span class="font-mono text-gray-600">#{{ apt.id }}</span></td>
              <td>
                <div class="flex items-center gap-2">
                  <div class="avatar-placeholder avatar-sm">{{ getInitials(apt.user) }}</div>
                  <span class="font-medium">{{ apt.user }}</span>
                </div>
              </td>
              <td>{{ apt.lawyer }}</td>
              <td><span class="badge" :class="getTypeBadgeClass(apt.typeRaw)">{{ apt.type }}</span></td>
              <td>{{ apt.date }}</td>
              <td class="font-mono">{{ apt.time }}</td>
              <td><span class="badge" :class="getStatusBadgeClass(apt.status)">{{ getStatusLabel(apt.status) }}</span></td>
              <td>
                <div v-if="apt.status !== 'done'" class="flex items-center justify-end gap-1">
                  <button v-if="apt.status !== 'cancelled' && authStore.user?.user_type === 'lawyer'" @click="completeAppointment(apt.id)" class="btn-icon" title="اتمام جلسه">
                    <Icon name="lucide:check" class="w-4 h-4" />
                  </button>
                  <button v-if="apt.status !== 'cancelled' && authStore.user?.user_type !== 'lawyer'" @click="openCancelModal(apt.id)" class="btn-icon" title="لغو نوبت">
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                  <button v-if="apt.status === 'cancelled'" @click="rebookAppointment(apt)" class="btn-primary text-sm! py-1.5! px-3!">
                    نوبت مجدد
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredData.length === 0" class="empty-state py-16">
        <div class="empty-state-icon">
          <Icon name="lucide:calendar-x" class="w-8 h-8" />
        </div>
        <h4 class="empty-state-title">نوبتی یافت نشد</h4>
        <p class="empty-state-description">با تغییر فیلترها نتایج جدید ببینید</p>
      </div>

      <!-- Pagination -->
      <div v-if="total > 15" class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500">صفحه {{ page }} از {{ Math.ceil(total / 15) }}</span>
        <UPagination v-model:page="page" :items-per-page="15" :total="total" :sibling-count="1"
          :ui="{ list: 'gap-1', item: 'min-w-8 h-8 text-sm', first: 'hidden', last: 'hidden', prev: 'scale-x-[-1]', next: 'scale-x-[-1]' }"
        />
      </div>
    </div>

    <!-- Cancel Modal -->
    <UModal v-model:open="isCancelModalOpen">
      <template #content>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">لغو نوبت</h3>
            <button @click="isCancelModalOpen = false" class="btn-icon">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="modal-body">
            <div class="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
              <Icon name="lucide:alert-triangle" class="w-6 h-6 text-red-500" />
              <p class="text-sm text-red-700">آیا از لغو نوبت خود مطمئن هستید؟ این عمل قابل بازگشت نیست.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="isCancelModalOpen = false" class="btn-secondary">انصراف</button>
            <button @click="handleConfirmCancel" class="btn-danger">
              <Icon name="lucide:x" class="w-4 h-4" />
              تایید و لغو
            </button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { h, resolveComponent } from "vue";

useHead({ title: "نوبت‌ها | وکیلینجا" });

const authStore = useAuthStore();

// State
const viewMode = ref('list');
const page = ref(1);
const total = ref(0);
const data = ref([]);
const statusFilter = ref(null);
const typeFilter = ref(null);
const isCancelModalOpen = ref(false);
const appointmentToCancelId = ref(null);
const currentWeekOffset = ref(0);

// Filter items for UICSelect
const statusFilterItems = [
  { id: null, label: 'همه وضعیت‌ها' },
  { id: 'reserved', label: 'رزرو شده' },
  { id: 'pending_payment', label: 'در انتظار پرداخت' },
  { id: 'done', label: 'تکمیل شده' },
  { id: 'cancelled', label: 'لغو شده' },
];

const typeFilterItems = [
  { id: null, label: 'همه انواع' },
  { id: 'inperson', label: 'حضوری' },
  { id: 'phone', label: 'تلفنی' },
  { id: 'chat', label: 'چت' },
];

// Status counts
const statusCounts = ref({ reserved: 0, pending_payment: 0, done: 0, cancelled: 0 });

// Fetch data
const refetch = async (pageNum = null, setTotal = false) => {
  try {
    const res = await useGet({
      url: "appointments",
      includeAuthHeader: true,
      query: {
        page: pageNum ? pageNum : undefined,
        status: statusFilter.value || undefined,
        type: typeFilter.value || undefined,
      },
    });

    data.value = res.data.data.map((appointment) => ({
      id: appointment?.id,
      user: `${appointment?.user?.name} ${appointment?.user?.family}`,
      lawyer: `${appointment?.lawyer?.name} ${appointment?.lawyer?.family}`,
      lawyerId: appointment?.lawyer?.id,
      type: getTypeLabel(appointment?.type),
      typeRaw: appointment?.type,
      date: new Date(appointment?.date).toLocaleDateString("fa"),
      dateRaw: appointment?.date,
      time: appointment?.time?.slice(0, 5),
      status: appointment?.status,
      paymentStatus: appointment?.payment?.status,
      roomId: appointment?.chat_room,
    }));

    if (setTotal) {
      total.value = res.data.meta.total;
      calculateStatusCounts();
    }
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
  }
};

// Initial fetch
const res = await useGet({ url: "appointments", includeAuthHeader: true, query: { page: 1 } });
total.value = res.data.meta.total;

data.value = res.data.data.map((appointment) => ({
  id: appointment?.id,
  user: `${appointment?.user?.name} ${appointment?.user?.family}`,
  lawyer: `${appointment?.lawyer?.name} ${appointment?.lawyer?.family}`,
  lawyerId: appointment?.lawyer?.id,
  type: getTypeLabel(appointment?.type),
  typeRaw: appointment?.type,
  date: new Date(appointment?.date).toLocaleDateString("fa"),
  dateRaw: appointment?.date,
  time: appointment?.time?.slice(0, 5),
  status: appointment?.status,
  paymentStatus: appointment?.payment?.status,
  roomId: appointment?.chat_room,
}));

calculateStatusCounts();

// Watch page changes
watch(() => page.value, (newPage) => refetch(newPage));

// Filter functions
const applyFilters = () => {
  page.value = 1;
  refetch(1, true);
};

const clearFilters = () => {
  statusFilter.value = null;
  typeFilter.value = null;
  refetch(1, true);
};

const filteredData = computed(() => {
  let result = data.value;
  if (statusFilter.value) {
    result = result.filter(a => a.status === statusFilter.value);
  }
  if (typeFilter.value) {
    result = result.filter(a => a.typeRaw === typeFilter.value);
  }
  return result;
});

function calculateStatusCounts() {
  statusCounts.value = { reserved: 0, pending_payment: 0, done: 0, cancelled: 0 };
  data.value.forEach(a => {
    if (statusCounts.value[a.status] !== undefined) {
      statusCounts.value[a.status]++;
    }
  });
}

// Calendar
const weekDays = computed(() => {
  const days = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset.value * 7);
  
  const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      name: dayNames[i],
      number: date.toLocaleDateString('fa-IR', { day: 'numeric' }),
      date: date.toISOString().split('T')[0],
      isToday: date.toDateString() === today.toDateString(),
    });
  }
  return days;
});

const currentWeekLabel = computed(() => {
  const start = weekDays.value[0];
  const end = weekDays.value[6];
  return `${start.number} تا ${end.number}`;
});

const prevWeek = () => { currentWeekOffset.value--; };
const nextWeek = () => { currentWeekOffset.value++; };

const getDayAppointments = (date) => {
  return data.value.filter(a => a.dateRaw === date).slice(0, 3);
};

const getEventClass = (status) => {
  const classes = { reserved: 'event-success', pending_payment: 'event-warning', done: 'event-info', cancelled: 'event-error' };
  return classes[status] || '';
};

// Helpers
function getTypeLabel(type) {
  const labels = { inperson: 'حضوری', phone: 'تلفنی', chat: 'چت' };
  return labels[type] || type;
}

function getTypeBadgeClass(type) {
  const classes = { inperson: 'badge-warning', phone: 'badge-info', chat: 'badge-success' };
  return classes[type] || 'badge-gray';
}

function getStatusLabel(status) {
  const labels = { reserved: 'رزرو شده', pending_payment: 'در انتظار پرداخت', done: 'تکمیل شده', cancelled: 'لغو شده' };
  return labels[status] || status;
}

function getStatusBadgeClass(status) {
  const classes = { reserved: 'badge-success', pending_payment: 'badge-warning', done: 'badge-info', cancelled: 'badge-error' };
  return classes[status] || 'badge-gray';
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(p => p.charAt(0)).join('').substring(0, 2);
}

// Actions
const openCancelModal = (id) => {
  appointmentToCancelId.value = id;
  isCancelModalOpen.value = true;
};

const handleConfirmCancel = async () => {
  if (appointmentToCancelId.value) {
    try {
      const res = await useDelete({
        url: `appointments/${appointmentToCancelId.value}`,
        includeAuthHeader: true,
      });
      if (res.status) {
        useToast().add({ title: "نوبت با موفقیت لغو شد", color: "success" });
        refetch(page.value, true);
      } else {
        useToast().add({ title: res.message || "مشکلی رخ داده است", color: "error" });
      }
    } catch (error) {
      useToast().add({ title: "مشکلی رخ داده است", color: "error" });
    }
  }
  isCancelModalOpen.value = false;
  appointmentToCancelId.value = null;
};

const completeAppointment = async (id) => {
  try {
    const res = await usePost({
      url: `appointments/${id}/complete`,
      includeAuthHeader: true,
    });
    if (res.statusCode === 200) {
      useToast().add({ title: "جلسه با موفقیت تکمیل شد", color: "success" });
      refetch(page.value, true);
    } else {
      useToast().add({ title: "مشکلی رخ داده است", color: "error" });
    }
  } catch (error) {
    useToast().add({ title: "مشکلی رخ داده است", color: "error" });
  }
};

const rebookAppointment = (apt) => {
  navigateTo(`/lawyer/${apt.lawyerId}/${apt.lawyer.trim().replace(/\s+/g, '-')}`);
};
</script>

<style scoped>
@reference "tailwindcss";

.appointments-page {
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

/* View Toggle */
.view-toggle {
  @apply flex items-center border border-gray-200 rounded-lg overflow-hidden;
}

.view-btn {
  @apply p-2 text-gray-500 transition-colors flex;
}

.view-btn:hover {
  @apply bg-gray-50 text-gray-700;
}

.view-btn.active {
  @apply bg-blue-50 text-blue-600;
}

/* Calendar */
.calendar-placeholder {
  @apply space-y-4;
}

.calendar-header {
  @apply flex items-center justify-center gap-4;
}

.calendar-scroll-wrap {
  @apply min-w-0 overflow-x-auto -mx-1 px-1;
  -webkit-overflow-scrolling: touch;
}

.calendar-grid {
  @apply grid grid-cols-7 gap-2 min-w-0;
}

.calendar-day-column {
  @apply bg-gray-50 rounded-lg overflow-hidden min-w-0;
}

.calendar-day-header-cell {
  @apply p-3 text-center border-b border-gray-200;
}

.calendar-day-header-cell.today {
  @apply bg-blue-500 text-white;
}

.day-name {
  @apply block text-xs text-gray-500;
}

.today .day-name {
  @apply text-blue-100;
}

.day-number {
  @apply block text-lg font-semibold;
}

.calendar-day-content {
  @apply p-2 min-h-[120px] space-y-1;
}

.calendar-event {
  @apply p-2 rounded text-xs min-w-0;
}

.event-success {
  @apply bg-green-100 text-green-700;
}

.event-warning {
  @apply bg-amber-100 text-amber-700;
}

.event-info {
  @apply bg-blue-100 text-blue-700;
}

.event-error {
  @apply bg-red-100 text-red-700;
}

.event-time {
  @apply block font-mono font-medium;
}

.event-title {
  @apply block truncate min-w-0;
}

.event-type {
  @apply block text-[10px] opacity-70 truncate min-w-0;
}

.calendar-empty-day {
  @apply text-center text-gray-300 py-4;
}

@media (max-width: 768px) {
  .calendar-scroll-wrap {
    @apply -mx-3 px-3;
  }

  .calendar-grid {
    min-width: 560px;
    @apply gap-1.5;
  }

  .calendar-day-column {
    min-width: 72px;
  }

  .calendar-day-header-cell {
    @apply p-2;
  }

  .day-name {
    @apply text-[10px];
  }

  .day-number {
    @apply text-sm;
  }

  .calendar-day-content {
    @apply p-1.5 min-h-[80px] space-y-1;
  }

  .calendar-event {
    @apply p-1.5 text-[10px];
  }

  .event-time {
    @apply text-[10px];
  }

  .event-title {
    @apply text-[10px] max-w-full;
  }

  .event-type {
    @apply text-[9px];
  }
}

.btn-primary,
.btn-secondary,
.btn-danger {
  @apply inline-flex items-center gap-2;
}
</style>
