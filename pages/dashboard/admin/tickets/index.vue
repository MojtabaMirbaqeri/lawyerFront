<template>
  <div class="tickets-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت تیکت‌ها</h1>
        <p class="page-description">{{ total }} تیکت در سیستم</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div class="view-toggle">
          <button
            @click="viewMode = 'kanban'"
            class="view-btn"
            :class="{ active: viewMode === 'kanban' }">
            <Icon name="lucide:columns-3" class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'list'"
            class="view-btn"
            :class="{ active: viewMode === 'list' }">
            <Icon name="lucide:list" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid-sm">
      <div class="stat-mini" @click="setStatusFilter('open')">
        <div class="stat-mini-icon bg-blue-100 text-blue-600">
          <Icon name="lucide:inbox" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.open }}</span>
          <span class="stat-mini-label">باز</span>
        </div>
      </div>
      <div class="stat-mini" @click="setStatusFilter('in_progress')">
        <div class="stat-mini-icon bg-amber-100 text-amber-600">
          <Icon name="lucide:clock" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.in_progress }}</span>
          <span class="stat-mini-label">در حال بررسی</span>
        </div>
      </div>
      <div class="stat-mini" @click="setStatusFilter('answered')">
        <div class="stat-mini-icon bg-green-100 text-green-600">
          <Icon name="lucide:check-circle" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.answered }}</span>
          <span class="stat-mini-label">پاسخ داده شده</span>
        </div>
      </div>
      <div class="stat-mini" @click="setStatusFilter('closed')">
        <div class="stat-mini-icon bg-gray-100 text-gray-600">
          <Icon name="lucide:archive" class="w-5 h-5" />
        </div>
        <div class="stat-mini-content">
          <span class="stat-mini-value">{{ statusCounts.closed }}</span>
          <span class="stat-mini-label">بسته شده</span>
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
                v-model="globalFilter"
                @change="searchHandle"
                type="text"
                placeholder="جستجوی تیکت..."
                class="w-64" />
            </div>
            <UICSelect
              v-model="status"
              :items="filterStore.ticketFilter.status"
              placeholder="وضعیت"
              class="w-36!" />
            <UICSelect
              v-model="priority"
              :items="filterStore.ticketFilter.priority"
              placeholder="اولویت"
              class="w-36!" />
            <UICSelect
              v-model="type"
              :items="filterStore.ticketFilter.type"
              placeholder="نوع"
              class="w-36!" />
          </div>
          <div class="action-bar-end">
            <button
              v-if="status || priority || type || globalFilter"
              @click="clearFilters"
              class="btn-ghost text-sm!">
              <Icon name="lucide:x" class="w-4 h-4" />
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="kanban-board">
      <div v-for="column in kanbanColumns" :key="column.status" class="kanban-column">
        <div class="kanban-header">
          <div class="flex items-center gap-2">
            <div class="kanban-dot" :class="`bg-${column.color}-500`"></div>
            <span class="kanban-title">{{ column.title }}</span>
          </div>
          <span class="kanban-count">{{ getColumnTickets(column.status).length }}</span>
        </div>
        <div class="kanban-cards">
          <div
            v-for="ticket in getColumnTickets(column.status)"
            :key="ticket.ticketId"
            class="kanban-card"
            @click="openTicket(ticket)">
            <div class="kanban-card-header">
              <span class="ticket-number">#{{ ticket.id }}</span>
              <span class="badge" :class="getPriorityBadgeClass(ticket.priorityVal)">{{
                ticket.priority
              }}</span>
            </div>
            <h4 class="kanban-card-title">{{ ticket.ticketTitle }}</h4>
            <div class="kanban-card-footer">
              <div class="kanban-card-user">
                <div class="avatar-placeholder avatar-xs">
                  {{ getInitials(ticket.fullname) }}
                </div>
                <span>{{ ticket.fullname }}</span>
              </div>
              <span class="kanban-card-type">{{ ticket.type }}</span>
            </div>
          </div>
          <div v-if="getColumnTickets(column.status).length === 0" class="kanban-empty">
            بدون تیکت
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <dashboard-admin-generic-table
      v-else
      :data="data"
      :columns="tableColumns"
      :current-page="page"
      :total-items="total"
      :items-per-page="15"
      row-key="ticketId"
      row-class="cursor-pointer"
      :on-row-click="true"
      empty-title="تیکتی یافت نشد"
      empty-message="با تغییر فیلترها یا جستجو، تیکت‌ها را مشاهده کنید"
      empty-icon="lucide:ticket"
      @update:page="page = $event"
      @row-click="openTicket"
    >
      <!-- Custom cell for ticket number -->
      <template #cell-id="{ value }">
        <span class="font-mono text-gray-600">#{{ value }}</span>
      </template>

      <!-- Custom cell for title -->
      <template #cell-ticketTitle="{ value }">
        <span class="font-medium text-gray-900">{{ value }}</span>
      </template>

      <!-- Custom cell for user -->
      <template #cell-fullname="{ row }">
        <div class="flex items-center gap-2">
          <div class="avatar-placeholder avatar-sm">{{ getInitials(row.fullname) }}</div>
          <span>{{ row.fullname }}</span>
        </div>
      </template>

      <!-- Custom cell for priority -->
      <template #cell-priority="{ row }">
        <span class="badge" :class="getPriorityBadgeClass(row.priorityVal)">{{ row.priority }}</span>
      </template>

      <!-- Custom cell for type -->
      <template #cell-type="{ value }">
        <span class="text-gray-600">{{ value }}</span>
      </template>

      <!-- Custom cell for status -->
      <template #cell-status="{ row }">
        <span class="badge" :class="getStatusBadgeClass(row.statusVal)">{{ row.status }}</span>
      </template>

      <!-- Custom actions -->
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1" @click.stop>
          <button class="btn-icon" title="مشاهده" @click="openTicket(row)">
            <Icon name="lucide:eye" class="w-4 h-4" />
          </button>
          <button v-if="row.statusVal !== 'closed'" class="btn-icon" title="بستن تیکت" @click="closeTicket(row)">
            <Icon name="lucide:archive" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </dashboard-admin-generic-table>
  </div>
</template>

<script setup>
useHead({ title: "مدیریت تیکت‌ها | وکیلینجا" });

const filterStore = useFiltersStore();
const viewMode = ref("list");
const globalFilter = ref("");
const status = ref(0);
const priority = ref(0);
const type = ref(0);
const page = ref(1);
const selectQuery = ref();

// Table configuration
const tableColumns = [
  { key: 'id', label: 'شماره تیکت' },
  { key: 'ticketTitle', label: 'عنوان' },
  { key: 'fullname', label: 'کاربر' },
  { key: 'priority', label: 'اولویت' },
  { key: 'type', label: 'دپارتمان' },
  { key: 'status', label: 'وضعیت' },
];

// Kanban columns
const kanbanColumns = [
  { status: "open", title: "باز", color: "blue" },
  { status: "in_progress", title: "در حال بررسی", color: "amber" },
  { status: "answered", title: "پاسخ داده شده", color: "green" },
  { status: "waiting_for_user", title: "در انتظار کاربر", color: "purple" },
  { status: "closed", title: "بسته شده", color: "gray" },
];

// Status counts
const statusCounts = ref({
  open: 0,
  in_progress: 0,
  answered: 0,
  waiting_for_user: 0,
  closed: 0,
});

watch([status, priority, type], async (newVal) => {
  const obj = { status: newVal[0], priority: newVal[1], type: newVal[2] };
  selectQuery.value = obj;
  refetch(null, selectQuery.value, true);
  page.value = 1;
});

const searchHandle = () => {
  if (!globalFilter.value) {
    refetch(null, null, true, null);
  } else {
    refetch(null, null, true, globalFilter.value);
    page.value = 1;
  }
};

const clearFilters = () => {
  status.value = 0;
  priority.value = 0;
  type.value = 0;
  globalFilter.value = "";
  refetch(null, null, true);
};

const setStatusFilter = (statusVal) => {
  const statusOption = filterStore.ticketFilter.status.find((s) => s.value === statusVal);
  if (statusOption) {
    status.value = statusOption.id;
  }
};

const refetch = async (pageNum = null, query = null, setTotal = false, search = null) => {
  const res = await useGet({
    url: "tickets",
    includeAuthHeader: true,
    query: {
      page: pageNum ? pageNum : undefined,
      status: query && query.status ? query.status : undefined,
      priority: query && query.priority ? query.priority : undefined,
      type: query && query.type ? query.type : undefined,
      search: search ? search : undefined,
    },
  });

  const ticketsData = res?.data?.data?.data ?? {};
  const ticketsList = Array.isArray(ticketsData.tickets) ? ticketsData.tickets : [];
  data.value = ticketsList.map((ticket) => ({
    id: ticket?.ticket_number,
    ticketTitle: ticket?.title,
    priority: ticket?.priority?.label,
    priorityVal: ticket?.priority?.value,
    type: ticket?.type?.label,
    status: ticket?.status?.label,
    statusVal: ticket?.status?.value,
    fullname: ticket?.user ? `${ticket.user.name ?? ""} ${ticket.user.family ?? ""}`.trim() || "—" : "—",
    ticketId: ticket?.id,
    createdAt: ticket?.created_at,
  }));

  if (setTotal) {
    total.value = ticketsData.pagination?.total ?? 0;
  }
};

watch(
  () => page.value,
  async (pageNum) => {
    if (
      selectQuery.value?.status ||
      selectQuery.value?.priority ||
      selectQuery.value?.type
    ) {
      refetch(pageNum, selectQuery.value, true);
    } else if (globalFilter.value) {
      refetch(pageNum, null, null, globalFilter.value);
    } else {
      refetch(pageNum, null);
    }
  },
);

// Initial fetch
const res = await useGet({ url: "tickets", includeAuthHeader: true });
const ticketsData = res?.data?.data?.data ?? {};
const ticketsList = Array.isArray(ticketsData.tickets) ? ticketsData.tickets : [];
const tickets = ref(ticketsList);
const total = ref(ticketsData.pagination?.total ?? 0);

const data = ref(
  tickets.value.map((ticket) => ({
    id: ticket?.ticket_number,
    ticketTitle: ticket?.title,
    priority: ticket?.priority?.label,
    priorityVal: ticket?.priority?.value,
    type: ticket?.type?.label,
    status: ticket?.status?.label,
    statusVal: ticket?.status?.value,
    fullname: ticket?.user ? `${ticket.user.name ?? ""} ${ticket.user.family ?? ""}`.trim() || "—" : "—",
    ticketId: ticket?.id,
    createdAt: ticket?.created_at,
  })),
);

// Calculate status counts
const calculateStatusCounts = () => {
  statusCounts.value = {
    open: 0,
    in_progress: 0,
    answered: 0,
    waiting_for_user: 0,
    closed: 0,
  };
  data.value.forEach((t) => {
    if (statusCounts.value[t.statusVal] !== undefined) {
      statusCounts.value[t.statusVal]++;
    }
  });
};
calculateStatusCounts();
watch(data, calculateStatusCounts, { deep: true });

// Helpers
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p.charAt(0))
    .join("")
    .substring(0, 2);
};

const getColumnTickets = (statusVal) =>
  data.value.filter((t) => t.statusVal === statusVal);

const getPriorityBadgeClass = (priority) => {
  const classes = {
    high: "badge-error",
    medium: "badge-warning",
    low: "badge-info",
    urgent: "badge-error",
  };
  return classes[priority] || "badge-gray";
};

const getStatusBadgeClass = (status) => {
  const classes = {
    open: "badge-info",
    closed: "badge-gray",
    in_progress: "badge-warning",
    answered: "badge-success",
    waiting_for_user: "badge-warning",
  };
  return classes[status] || "badge-gray";
};

const openTicket = (ticket) => {
  navigateTo(`/dashboard/ticket/${ticket.ticketId}`);
};

const closeTicket = async (ticket) => {
  const postRes = await usePost({
    url: `tickets/${ticket.ticketId}/close`,
    includeAuthHeader: true,
  });
  if (postRes.statusCode == 200) {
    useToast().add({ title: "تیکت با موفقیت بسته شد", color: "success" });
    refetch(page.value, selectQuery.value, true);
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.tickets-page {
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

/* Kanban */
.kanban-board {
  @apply flex gap-4 overflow-x-auto pb-4;
}

.kanban-column {
  @apply flex-shrink-0 w-72 bg-gray-50 rounded-xl;
}

.kanban-header {
  @apply flex items-center justify-between p-3 border-b border-gray-200;
}

.kanban-dot {
  @apply w-2.5 h-2.5 rounded-full;
}

.kanban-title {
  @apply text-sm font-semibold text-gray-700;
}

.kanban-count {
  @apply text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600;
}

.kanban-cards {
  @apply p-3 space-y-2 max-h-[500px] overflow-y-auto;
}

.kanban-card {
  @apply bg-white rounded-lg p-3 border border-gray-100 cursor-pointer transition-all;
  box-shadow: var(--shadow-sm);
}

.kanban-card:hover {
  box-shadow: var(--shadow-md);
}

.kanban-card-header {
  @apply flex items-center justify-between mb-2;
}

.ticket-number {
  @apply text-xs font-mono text-gray-400;
}

.kanban-card-title {
  @apply text-sm font-medium text-gray-900 mb-3 line-clamp-2;
}

.kanban-card-footer {
  @apply flex items-center justify-between text-xs text-gray-500;
}

.kanban-card-user {
  @apply flex items-center gap-1.5;
}

.avatar-xs {
  @apply w-5 h-5 text-[10px];
}

.kanban-card-type {
  @apply text-gray-400;
}

.kanban-empty {
  @apply text-center py-8 text-sm text-gray-400;
}
</style>
