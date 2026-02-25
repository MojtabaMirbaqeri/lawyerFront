<template>
  <div class="dashboard-wrapper">
    <ClientOnly>
      <!-- Sidebar -->
      <dashboard-layout
        :class="{ 'translate-x-0!': mobileSidebarOpen }"
        :chat-items="chatItems || []"
        :collapsed="sidebarCollapsed"
        @toggle-collapse="toggleSidebar" />

      <!-- Main Content Area -->
      <div class="dashboard-main" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <!-- Dashboard Header -->
        <header class="dashboard-header">
          <div class="header-content">
            <!-- Mobile Menu Toggle -->
            <button @click="openMobileSidebar" class="mobile-menu-btn lg:hidden">
              <Icon name="lucide:menu" class="w-5 h-5" />
            </button>

            <!-- Breadcrumb -->
            <nav class="breadcrumb hidden lg:flex">
              <NuxtLink to="/dashboard" class="breadcrumb-item">
                <Icon name="lucide:home" class="w-4 h-4" />
              </NuxtLink>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">{{ currentPageTitle }}</span>
            </nav>

            <!-- Header Actions -->
            <div class="header-actions">
              <!-- Search -->
              <div class="header-search hidden md:flex">
                <Icon name="lucide:search" class="search-icon" />
                <input type="text" placeholder="جستجو..." class="search-input" />
              </div>

              <!-- Notifications -->
              <UPopover
                v-model:open="notificationPopoverOpen"
                :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
                :open-delay="0"
                mode="click">
                <button class="header-icon-btn relative" type="button">
                  <Icon name="lucide:bell" class="w-5 h-5" />
                  <span v-if="notificationStore.unreadCount > 0" class="notification-badge">{{
                    notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount
                  }}</span>
                </button>
                <template #content>
                  <div class="notifications-dropdown">
                    <div class="notifications-dropdown-header">
                      <span class="font-semibold text-gray-800">اعلان‌ها</span>
                    </div>
                    <div class="notifications-dropdown-list">
                      <div
                        v-if="notificationStore.loadingRecent"
                        class="flex items-center justify-center py-8 text-gray-500">
                        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin" />
                      </div>
                      <template v-else-if="notificationStore.recent.length === 0">
                        <div class="py-8 text-center text-sm text-gray-500">
                          اعلانی وجود ندارد
                        </div>
                      </template>
                      <template v-else>
                        <button
                          v-for="n in notificationStore.recent"
                          :key="n.id"
                          type="button"
                          class="notification-item"
                          :class="{ 'notification-item--unread': !n.read_at }"
                          @click="onNotificationClick(n)">
                          <div class="notification-item-content">
                            <span class="notification-item-title">{{ n.title }}</span>
                            <p class="notification-item-message">{{ (n.message || '').slice(0, 80) }}{{ (n.message || '').length > 80 ? '…' : '' }}</p>
                            <span class="notification-item-time">{{ timeAgo(n.created_at) }}</span>
                          </div>
                          <span v-if="!n.read_at" class="notification-item-dot" />
                        </button>
                      </template>
                    </div>
                    <div class="notifications-dropdown-footer">
                      <button
                        type="button"
                        class="notifications-footer-btn"
                        :disabled="notificationStore.unreadCount === 0"
                        @click="markAllReadAndClose">
                        همه را بخوان
                      </button>
                      <NuxtLink
                        to="/dashboard/notifications"
                        class="notifications-footer-link"
                        @click="notificationPopoverOpen = false">
                        مشاهده همه اعلان‌ها
                      </NuxtLink>
                    </div>
                  </div>
                </template>
              </UPopover>

              <!-- User Menu -->
              <div class="user-menu">
                <div class="user-avatar">
                  <template v-if="authStore.user?.profile_image">
                    <NuxtImg
                      :src="authStore.user.profile_image"
                      alt="Profile"
                      width="40"
                      height="40"
                      loading="lazy"
                      class="avatar avatar-md" />
                  </template>
                  <template v-else>
                    <div class="avatar-placeholder avatar-md">
                      {{ userInitials }}
                    </div>
                  </template>
                </div>
                <div class="user-info hidden lg:block">
                  <span class="user-name">{{ userName }}</span>
                  <span class="user-role">{{ userRoleLabel }}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="dashboard-content">
          <!-- بنر بازگشت به پنل ادمین (ورود موقت به پنل وکیل) -->
          <div
            v-if="showImpersonationBanner"
            class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <p class="text-sm font-medium text-blue-800">
              شما در حال مشاهده پنل وکیل به عنوان ادمین هستید.
            </p>
            <button
              type="button"
              class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              @click="exitImpersonation">
              <Icon name="lucide:arrow-right-to-line" class="w-4 h-4" />
              بازگشت به پنل ادمین
            </button>
          </div>

          <!-- Warning Alert for Lawyers Pending Verification -->
          <UAlert
            v-if="
              authStore.user?.user_type == 'lawyer' && authStore.user?.lawyer_id == null
            "
            title="در انتظار تایید"
            description="احراز هویت شما در حال بررسی است. پس از تایید، به تمام امکانات دسترسی خواهید داشت."
            color="warning"
            variant="subtle"
            icon="lucide:shield-alert"
            class="mb-6"
            :ui="{
              icon: 'size-6!',
              title: 'font-semibold text-sm',
              description: 'text-sm',
              root: 'items-center rounded-xl border border-amber-200 bg-amber-50',
            }" />

          <!-- Page Slot: با v-show تا با عوض شدن شرط، کامپوننت unmount نشه و خطای emitsOptions/exposed نده -->
          <div
            v-show="
              !(
                authStore.user?.user_type == 'lawyer' &&
                authStore.user?.lawyer_id == null &&
                $route.path === '/dashboard/lawyer'
              )
            ">
            <slot />
          </div>
        </main>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <Transition name="fade">
        <div
          v-if="mobileSidebarOpen"
          class="mobile-overlay"
          @click="closeMobileSidebar"></div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<script setup>
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();
const route = useRoute();

defineProps(["chatItems"]);

const notificationPopoverOpen = ref(false);

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

async function onNotificationClick(n) {
  notificationPopoverOpen.value = false;
  if (!n.read_at) await notificationStore.markAsRead(n.id);
  if (n.action_url) {
    navigateTo(n.action_url);
  } else {
    navigateTo('/dashboard/notifications');
  }
}

async function markAllReadAndClose() {
  await notificationStore.markAllAsRead();
  notificationPopoverOpen.value = false;
  useToast().add({ title: 'همه اعلان‌ها خوانده شدند', color: 'success' });
}

watch(notificationPopoverOpen, (open) => {
  if (open) notificationStore.fetchRecent(10);
});

const IMPERSONATE_KEYS = {
  token: "adminRestoreToken",
  user: "adminRestoreUser",
  flag: "impersonating",
};
const isImpersonating = ref(false);

const showImpersonationBanner = computed(
  () =>
    authStore.user?.user_type === "lawyer" &&
    isImpersonating.value &&
    route.path.startsWith("/dashboard/lawyer"),
);

function exitImpersonation() {
  if (typeof sessionStorage === "undefined") return;
  const token = sessionStorage.getItem(IMPERSONATE_KEYS.token);
  const userStr = sessionStorage.getItem(IMPERSONATE_KEYS.user);
  sessionStorage.removeItem(IMPERSONATE_KEYS.token);
  sessionStorage.removeItem(IMPERSONATE_KEYS.user);
  sessionStorage.removeItem(IMPERSONATE_KEYS.flag);
  isImpersonating.value = false;
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    if (token && user) authStore.restoreAuth(token, user);
  } catch (_) {}
  navigateTo("/dashboard/admin");
}

// Sidebar state
const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const openMobileSidebar = () => {
  dashboardStore.openSidebar = true;
  mobileSidebarOpen.value = true;
  document.body.classList.add("overflow-hidden");
};

const closeMobileSidebar = () => {
  dashboardStore.openSidebar = false;
  mobileSidebarOpen.value = false;
  document.body.classList.remove("overflow-hidden");
};

// Current page title
const currentPageTitle = computed(() => {
  const path = route.path;
  const routes = dashboardStore.sidebarRoutes || [];
  const currentRoute = routes.find((r) => path.startsWith(r.url));
  return currentRoute?.title || "داشبورد";
});

// User info
const userName = computed(() => {
  const user = authStore.user;
  if (!user) return "";
  return `${user.name || ""} ${user.family || ""}`.trim() || "کاربر";
});

const userInitials = computed(() => {
  const user = authStore.user;
  if (!user) return "?";
  const first = user.name?.charAt(0) || "";
  const last = user.family?.charAt(0) || "";
  return (first + last).toUpperCase() || "?";
});

const userRoleLabel = computed(() => {
  const type = authStore.user?.user_type;
  switch (type) {
    case "admin":
      return "مدیر سیستم";
    case "lawyer":
      return "وکیل";
    case "user":
      return "کاربر";
    default:
      return "";
  }
});

// Room name for chat
const roomName = computed(() => {
  const room = chatStore.roomInfo;
  if (!room) return "";
  if (room.members?.length > 2) {
    return (
      room.name || `${authStore.user?.name ?? ""} ${authStore.user?.family ?? ""}`.trim()
    );
  }
  const other = room.members?.find((m) => m.id !== authStore.user.id);
  if (!other) return "";
  return `${other.name ?? ""} ${other.family ?? ""}`.trim();
});

onMounted(() => {
  if (
    typeof sessionStorage !== "undefined" &&
    authStore.user?.user_type === "lawyer" &&
    route.path.startsWith("/dashboard/lawyer") &&
    sessionStorage.getItem(IMPERSONATE_KEYS.flag) === "1"
  ) {
    isImpersonating.value = true;
  }
  if (chatStore.selectedRoom !== 0) {
    console.log("Room ID exists:", chatStore.selectedRoom);
  }
  notificationStore.fetchUnreadCount(false);
  notificationStore.startPolling();
});

onUnmounted(() => {
  notificationStore.stopPolling();
});

watch(
  () => chatStore.roomInfo,
  (newVal) => {
    if (newVal) {
      console.log("Room Info updated:", newVal);
    }
  },
  { immediate: true },
);

// وقتی به مسیر وکیل می‌رویم، وضعیت امپرسونیشن را از sessionStorage بخوان
watch(
  () => route.path,
  (path) => {
    if (
      typeof sessionStorage !== "undefined" &&
      path.startsWith("/dashboard/lawyer") &&
      sessionStorage.getItem(IMPERSONATE_KEYS.flag) === "1"
    ) {
      isImpersonating.value = true;
    }
  },
  { immediate: true },
);

// Close mobile sidebar on route change
watch(
  () => route.path,
  () => {
    closeMobileSidebar();
  },
);
</script>

<style scoped>
@reference "tailwindcss";

.dashboard-wrapper {
  @apply flex min-h-screen overflow-x-hidden;
  background: var(--surface-subtle);
}

.dashboard-main {
  @apply flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden transition-all duration-200;
  margin-right: 280px;
}

.dashboard-main.sidebar-collapsed {
  margin-right: 80px;
}

@media (max-width: 1023px) {
  .dashboard-main {
    margin-right: 0;
  }
}

/* Header */
.dashboard-header {
  @apply sticky top-0 z-40;
  background: white;
  border-bottom: 1px solid var(--table-border);
}

.header-content {
  @apply flex items-center justify-between h-16 px-6;
}

.mobile-menu-btn {
  @apply p-2 rounded-lg hover:bg-gray-100 transition-colors;
}

/* Breadcrumb */
.breadcrumb {
  @apply items-center gap-2 text-sm;
}

.breadcrumb-item {
  @apply text-gray-400 hover:text-gray-600 transition-colors;
}

.breadcrumb-separator {
  @apply text-gray-300;
}

.breadcrumb-current {
  @apply text-gray-700 font-medium;
}

/* Header Actions */
.header-actions {
  @apply flex items-center gap-3;
}

.header-search {
  @apply relative items-center;
}

.header-search .search-icon {
  @apply absolute right-3 w-4 h-4 text-gray-400;
}

.header-search .search-input {
  @apply pr-10 pl-4 py-2 w-64 rounded-lg border border-gray-200 text-sm bg-gray-50;
  @apply focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100;
  transition: all 0.15s ease;
}

.header-icon-btn {
  @apply p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors;
}

.notification-badge {
  @apply absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center;
  background: var(--status-error);
  color: white;
}

/* User Menu */
.user-menu {
  @apply flex items-center gap-3 pr-3 border-r border-gray-200;
}

.user-avatar {
  @apply relative;
}

.user-info {
  @apply flex flex-col;
}

.user-name {
  @apply text-sm font-medium text-gray-800;
}

.user-role {
  @apply text-xs text-gray-500;
}

/* Main Content */
.dashboard-content {
  @apply flex-1 p-6;
}

/* Mobile Overlay */
.mobile-overlay {
  @apply fixed inset-0 z-40 bg-black/50 lg:hidden;
  backdrop-filter: blur(4px);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .dashboard-content {
    @apply p-3;
  }

  .dashboard-header {
    @apply px-3 py-2;
  }

  .header-title {
    @apply text-sm;
  }

  .user-menu {
    @apply gap-2 pr-2;
  }

  .user-name {
    @apply text-xs;
  }

  .user-role {
    @apply text-[10px];
  }

  .notification-badge {
    @apply w-3.5 h-3.5 text-[8px];
  }
}

/* Notifications dropdown */
.notifications-dropdown {
  @apply w-80 max-h-[min(24rem,70vh)] flex flex-col bg-white rounded-xl shadow-lg border border-gray-100;
}
.notifications-dropdown-header {
  @apply px-4 py-3 border-b border-gray-100;
}
.notifications-dropdown-list {
  @apply overflow-y-auto flex-1 min-h-0;
}
.notification-item {
  @apply w-full flex items-start gap-2 px-4 py-3 text-right border-b border-gray-50 hover:bg-gray-50 transition-colors;
}
.notification-item--unread {
  @apply bg-blue-50/50;
}
.notification-item-content {
  @apply flex-1 min-w-0;
}
.notification-item-title {
  @apply block text-sm font-medium text-gray-800 truncate;
}
.notification-item-message {
  @apply text-xs text-gray-500 mt-0.5 line-clamp-2;
}
.notification-item-time {
  @apply block text-[10px] text-gray-400 mt-1;
}
.notification-item-dot {
  @apply w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5;
}
.notifications-dropdown-footer {
  @apply flex items-center justify-between gap-2 px-4 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl;
}
.notifications-footer-btn {
  @apply text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
}
.notifications-footer-link {
  @apply text-xs font-medium text-gray-600 hover:text-gray-800;
}
</style>
