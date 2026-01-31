<template>
  <div class="dashboard-wrapper">
    <ClientOnly>
      <!-- Sidebar -->
      <dashboard-layout :chat-items="chatItems || []" :collapsed="sidebarCollapsed" @toggle-collapse="toggleSidebar" />
      
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
              <button class="header-icon-btn relative">
                <Icon name="lucide:bell" class="w-5 h-5" />
                <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
              </button>
              
              <!-- User Menu -->
              <div class="user-menu">
                <div class="user-avatar">
                  <template v-if="authStore.user?.profile_image">
                    <img :src="authStore.user.profile_image" alt="Profile" class="avatar avatar-md" />
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
          <!-- Warning Alert for Lawyers Pending Verification -->
          <UAlert
            v-if="authStore.user?.user_type == 'lawyer' && authStore.user?.lawyer_id == null"
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
            }"
          />
          
          <!-- Page Slot: با v-show تا با عوض شدن شرط، کامپوننت unmount نشه و خطای emitsOptions/exposed نده -->
          <div
            v-show="!(
              authStore.user?.user_type == 'lawyer' &&
              authStore.user?.lawyer_id == null &&
              $route.path === '/dashboard/lawyer'
            )"
          >
            <slot />
          </div>
        </main>
      </div>
      
      <!-- Mobile Sidebar Overlay -->
      <Transition name="fade">
        <div v-if="mobileSidebarOpen" class="mobile-overlay" @click="closeMobileSidebar"></div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<script setup>
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const route = useRoute();

defineProps(["chatItems"]);

// Sidebar state
const sidebarCollapsed = ref(false);
const mobileSidebarOpen = ref(false);
const notificationCount = ref(3); // TODO: Connect to real notifications

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
  const currentRoute = routes.find(r => path.startsWith(r.url));
  return currentRoute?.title || 'داشبورد';
});

// User info
const userName = computed(() => {
  const user = authStore.user;
  if (!user) return '';
  return `${user.name || ''} ${user.family || ''}`.trim() || 'کاربر';
});

const userInitials = computed(() => {
  const user = authStore.user;
  if (!user) return '?';
  const first = user.name?.charAt(0) || '';
  const last = user.family?.charAt(0) || '';
  return (first + last).toUpperCase() || '?';
});

const userRoleLabel = computed(() => {
  const type = authStore.user?.user_type;
  switch(type) {
    case 'admin': return 'مدیر سیستم';
    case 'lawyer': return 'وکیل';
    case 'user': return 'کاربر';
    default: return '';
  }
});

// Room name for chat
const roomName = computed(() => {
  const room = chatStore.roomInfo;
  if (!room) return "";
  if (room.members?.length > 2) {
    return room.name || `${authStore.user?.name ?? ""} ${authStore.user?.family ?? ""}`.trim();
  }
  const other = room.members?.find((m) => m.id !== authStore.user.id);
  if (!other) return "";
  return `${other.name ?? ""} ${other.family ?? ""}`.trim();
});

onMounted(() => {
  if (chatStore.selectedRoom !== 0) {
    console.log("Room ID exists:", chatStore.selectedRoom);
  }
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

// Close mobile sidebar on route change
watch(() => route.path, () => {
  closeMobileSidebar();
});
</script>

<style scoped>
@reference "tailwindcss";

.dashboard-wrapper {
  @apply flex min-h-screen;
  background: var(--surface-subtle);
}

.dashboard-main {
  @apply flex-1 flex flex-col min-h-screen transition-all duration-200;
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
</style>
