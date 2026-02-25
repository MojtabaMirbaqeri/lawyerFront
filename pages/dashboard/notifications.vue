<template>
  <div class="notifications-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">اعلان‌ها</h1>
        <p class="page-description">
          {{ totalCount }} اعلان
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="btn-secondary"
          :disabled="notificationStore.unreadCount === 0 || markingAll"
          @click="handleMarkAllRead">
          <Icon name="lucide:check-all" class="w-4 h-4" />
          <span>همه را بخوان</span>
        </button>
      </div>
    </div>

    <div class="card-dashboard">
      <div class="tabs-dashboard mb-0">
        <button
          type="button"
          class="tab-item"
          :class="{ 'tab-item--active': filter === 'all' }"
          @click="filter = 'all'; page = 1">
          همه
        </button>
        <button
          type="button"
          class="tab-item"
          :class="{ 'tab-item--active': filter === 'unread' }"
          @click="filter = 'unread'; page = 1">
          خوانده نشده ({{ notificationStore.unreadCount }})
        </button>
      </div>

      <div class="relative min-h-[200px]">
        <div
          v-if="notificationStore.loading"
          class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80">
          <div class="flex flex-col items-center gap-3">
            <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-500" />
            <p class="text-sm text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>

        <template v-else-if="notificationStore.list.length === 0">
          <div class="empty-state py-16">
            <div class="empty-state-icon">
              <Icon name="lucide:bell-off" class="w-8 h-8 text-gray-300" />
            </div>
            <h4 class="empty-state-title">اعلانی وجود ندارد</h4>
            <p class="empty-state-description">
              {{ filter === 'unread' ? 'همه اعلان‌ها را خوانده‌اید.' : 'هنوز اعلانی برای شما ارسال نشده است.' }}
            </p>
          </div>
        </template>

        <ul v-else class="notifications-list">
          <li
            v-for="n in notificationStore.list"
            :key="n.id"
            class="notification-row"
            :class="{ 'notification-row--unread': !n.read_at }">
            <button
              type="button"
              class="notification-row-inner"
              @click="onRowClick(n)">
              <span v-if="!n.read_at" class="notification-row-dot" />
              <div class="notification-row-content">
                <span class="notification-row-title">{{ n.title }}</span>
                <p class="notification-row-message">{{ n.message }}</p>
                <span class="notification-row-time">{{ timeAgo(n.created_at) }}</span>
              </div>
              <Icon name="lucide:chevron-left" class="w-4 h-4 text-gray-400 shrink-0" />
            </button>
          </li>
        </ul>

        <div
          v-if="!notificationStore.loading && notificationStore.list.length > 0 && totalPages > 1"
          class="flex items-center justify-between p-4 border-t border-gray-100">
          <span class="text-sm text-gray-500">
            صفحه {{ page }} از {{ totalPages }}
          </span>
          <UPagination
            :page="page"
            :items-per-page="15"
            :total="totalCount"
            show-edges
            :sibling-count="1"
            :ui="{
              list: 'gap-1',
              item: 'min-w-8 h-8 text-sm',
              first: 'scale-x-[-1]',
              last: 'scale-x-[-1]',
              prev: 'scale-x-[-1]',
              next: 'scale-x-[-1]',
            }"
            @update:page="page = $event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'اعلان‌ها | داشبورد',
});

const notificationStore = useNotificationStore();
const filter = ref('all');
const page = ref(1);
const markingAll = ref(false);

const meta = computed(() => notificationStore.meta);
const totalCount = computed(() => {
  const m = meta.value;
  if (m?.total !== undefined) return m.total;
  return notificationStore.list.length;
});
const totalPages = computed(() => {
  const m = meta.value;
  if (m?.last_page !== undefined) return m.last_page;
  return 1;
});

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const s = Math.floor((now - date) / 1000);
  if (s < 60) return 'همین الان';
  if (s < 3600) return `${Math.floor(s / 60)} دقیقه پیش`;
  if (s < 86400) return `${Math.floor(s / 3600)} ساعت پیش`;
  if (s < 604800) return `${Math.floor(s / 86400)} روز پیش`;
  return date.toLocaleDateString('fa-IR');
}

async function onRowClick(n) {
  if (!n.read_at) await notificationStore.markAsRead(n.id);
  if (n.action_url) {
    navigateTo(n.action_url);
  }
}

async function handleMarkAllRead() {
  markingAll.value = true;
  try {
    await notificationStore.markAllAsRead();
    useToast().add({ title: 'همه اعلان‌ها خوانده شدند', color: 'success' });
  } finally {
    markingAll.value = false;
  }
}

async function load() {
  await notificationStore.fetchList({
    filter: filter.value,
    page: page.value,
    per_page: 15,
  });
}

watch([filter, page], () => {
  load();
}, { immediate: true });
</script>

<style scoped>
@reference "tailwindcss";

.notifications-page {
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

.tab-item--active {
  @apply border-blue-500 text-blue-600;
  border-bottom-color: blue;
}

.notifications-list {
  @apply divide-y divide-gray-100;
}

.notification-row {
  @apply list-none;
}

.notification-row--unread {
  @apply bg-blue-50/30;
}

.notification-row-inner {
  @apply w-full flex items-center gap-3 px-4 py-4 text-right hover:bg-gray-50 transition-colors;
}

.notification-row-dot {
  @apply w-2 h-2 rounded-full bg-blue-500 shrink-0;
}

.notification-row-content {
  @apply flex-1 min-w-0;
}

.notification-row-title {
  @apply block text-sm font-medium text-gray-800;
}

.notification-row-message {
  @apply text-sm text-gray-500 mt-0.5 line-clamp-2;
}

.notification-row-time {
  @apply block text-xs text-gray-400 mt-1;
}

.empty-state {
  @apply flex flex-col items-center justify-center text-center;
}

.empty-state-icon {
  @apply mb-3;
}

.empty-state-title {
  @apply text-base font-medium text-gray-700;
}

.empty-state-description {
  @apply text-sm text-gray-500 mt-1;
}
</style>
