<template>
  <aside class="dashboard-sidebar" :class="{ collapsed: collapsed }">
    <!-- Sidebar Header -->
    <div class="sidebar-header">
      <NuxtLink to="/" class="logo-link">
        <NuxtImg
          v-if="!collapsed"
          :src="logoUrl"
          alt="Logo"
          class="logo-full"
          width="140"
          height="32"
          loading="eager" />
        <div v-else class="logo-mini">
          <Icon name="custom:logo" class="size-6! text-white" />
        </div>
      </NuxtLink>

      <!-- Collapse Button (Desktop) -->
      <button @click="$emit('toggle-collapse')" class="collapse-btn hidden lg:flex">
        <Icon
          :name="collapsed ? 'lucide:chevron-left' : 'lucide:chevron-right'"
          class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <!-- Main Menu -->
      <div class="nav-section" v-if="chatItems.length <= 0">
        <template v-for="item in dashboardStore.sidebarRoutes" :key="item.url">
          <NuxtLink
            :to="item.url"
            class="nav-item"
            :class="{ active: isActiveRoute(item.url) }">
            <div class="nav-icon">
              <Icon :name="item.icon" class="size-4.5!" />
            </div>
            <span v-if="!collapsed" class="nav-label">{{ item.title }}</span>
            <div v-if="collapsed" class="nav-tooltip">{{ item.title }}</div>
          </NuxtLink>
        </template>
      </div>

      <!-- Chat Rooms -->
      <div class="nav-section" v-else>
        <div class="section-title" v-if="!collapsed">
          <span>گفتگوها</span>
        </div>
        <template v-for="room in chatRooms" :key="room.id">
          <button
            @click="chatStore.selectRoom(room)"
            class="chat-item"
            :class="{ active: chatStore.selectedRoom === room.id }">
            <div class="chat-avatar">
              <template v-if="getChatPartner(room)?.profile">
                <NuxtImg
                  :src="chatAvatarUrl(getChatPartner(room).profile)"
                  alt="profile"
                  width="36"
                  height="36"
                  loading="lazy"
                  class="avatar avatar-sm" />
              </template>
              <template v-else>
                <div
                  class="avatar-placeholder avatar-sm"
                  :style="{ backgroundColor: getColor(room.id) }">
                  {{
                    getInitials(getChatPartner(room)?.name, getChatPartner(room)?.family)
                  }}
                </div>
              </template>
            </div>
            <div v-if="!collapsed" class="chat-info">
              <span class="chat-name"
                >{{ getChatPartner(room)?.name }}
                {{ getChatPartner(room)?.family || "" }}</span
              >
            </div>
          </button>
        </template>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <!-- Back to Dashboard (for Chat) -->
      <button
        v-if="$route.path.startsWith('/chat')"
        @click="navigateTo('/dashboard')"
        class="footer-btn">
        <Icon name="lucide:layout-dashboard" class="w-5 h-5" />
        <span v-if="!collapsed">برگشت به داشبورد</span>
      </button>

      <!-- Logout -->
      <DashboardLogoutBtn
        v-if="$route.path.startsWith('/dashboard')"
        :collapsed="collapsed" />
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";

// Stores
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const route = useRoute();
const config = useRuntimeConfig();

// لوگو: آدرس مطلق تا روی سرور درست لود شود (با baseURL در صورت دیپلوی در زیرمسیر)
const logoUrl = computed(() => {
  const base = (config.app?.baseURL || "/").replace(/\/?$/, "");
  return `${base}/images/main-logo.svg`;
});

// آواتار چت: مسیرهای نسبی از API را با imageBase ترکیب می‌کنیم (اسلش اول مسیر حذف می‌شود)
function chatAvatarUrl(profile) {
  return useImageUrl(profile) || "";
}

// Props
const props = defineProps({
  chatItems: {
    type: Array,
    required: true,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
});

// Emits
defineEmits(["toggle-collapse"]);

// Data
const chatRooms = ref(props.chatItems ? props.chatItems[0] : []);

// Check if route is active (exact match only, so parent items like Dashboard don't stay active on sub-pages)
const isActiveRoute = (url) => {
  return route.path === url;
};

// Colors for chat avatars
const colors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

const getColor = (id) => {
  const index = id % colors.length;
  return colors[index];
};

const getInitials = (name, family) => {
  if (!name && !family) return "?";
  const first = name ? name.charAt(0) : "";
  const last = family ? family.charAt(0) : "";
  return (first + last).toUpperCase();
};

const getChatPartner = (room) => {
  if (!room) return null;
  if (room.members.length > 2) {
    return { name: room.name, family: "", profile: room.profile_image || null };
  }
  if (room.members.length === 2) {
    const partner = room.members.find((member) => member.id !== authStore.user?.id);
    return {
      name: partner?.name,
      family: partner?.family,
      profile: partner?.profile_image || null,
    };
  }
  return null;
};
</script>

<style scoped>
@reference "tailwindcss";

.dashboard-sidebar {
  @apply fixed top-0 right-0 h-screen z-50 flex flex-col transition-all! duration-300;
  width: 280px;
  background: var(--sidebar-bg);
  border-left: 1px solid var(--sidebar-border);
}

.dashboard-sidebar.collapsed {
  width: 80px;
  overflow: hidden !important;
}

@media (max-width: 1023px) {
  .dashboard-sidebar {
    @apply translate-x-full;
    transition: transform 0.2s ease;
  }

  .dashboard-sidebar.open {
  }
}

/* Header */
.sidebar-header {
  @apply flex items-center justify-between px-5 h-16 border-b;
  border-color: var(--sidebar-border);
}

.logo-link {
  @apply flex items-center;
}

.logo-full {
  @apply h-8 w-auto;
  filter: brightness(0) invert(1);
}

.logo-mini {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
  background: var(--sidebar-active);
}

.collapse-btn {
  @apply w-8 h-8 rounded-lg items-center justify-center;
  background: var(--sidebar-hover);
  color: var(--sidebar-text-muted);
  transition: all 0.15s ease;
}

.collapse-btn:hover {
  background: var(--sidebar-active);
  color: white;
}

/* Navigation */
.sidebar-nav {
  @apply flex-1 overflow-y-auto overflow-x-clip py-4;
  scrollbar-width: thin;
  scrollbar-color: var(--sidebar-border) transparent;
}

/* ظاهر اسکرول منو - WebKit (Chrome, Edge, Safari) */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--sidebar-border);
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--sidebar-text-muted);
}

.dashboard-sidebar.collapsed .sidebar-nav {
  overflow-y: hidden;
  overflow-x: hidden;
}

.nav-section {
  @apply px-3;
}

.section-title {
  @apply px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2;
  color: var(--sidebar-text-muted);
}

.nav-item {
  @apply flex items-center gap-3 px-3 py-3 rounded-lg mb-1 relative;
  color: var(--sidebar-text);
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: var(--sidebar-hover);
  color: white;
}

.nav-item.active {
  background: var(--sidebar-active);
  color: white;
}

.nav-item.active::before {
  content: "";
  @apply absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full;
  background: var(--accent);
}

.nav-icon {
  @apply w-5 h-5 flex-shrink-0 flex items-center justify-center;
}

.nav-item.active .nav-icon {
  color: var(--accent);
}

.nav-label {
  @apply text-sm font-medium whitespace-nowrap;
}

.nav-tooltip {
  @apply absolute right-full mr-2 px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none;
  background: var(--surface-dark);
  color: white;
  transition: opacity 0.15s ease;
}

.collapsed .nav-item:hover .nav-tooltip {
  @apply opacity-100;
}

.collapsed .nav-item {
  @apply justify-center px-0;
}

.collapsed .nav-icon {
  @apply size-9! rounded-lg;
}

/* Chat Items */
.chat-item {
  @apply flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-right mb-1;
  color: var(--sidebar-text);
  transition: all 0.15s ease;
}

.chat-item:hover {
  background: var(--sidebar-hover);
}

.chat-item.active {
  background: var(--sidebar-active);
}

.chat-avatar {
  @apply flex-shrink-0;
}

.chat-info {
  @apply flex-1 min-w-0;
}

.chat-name {
  @apply block text-sm font-medium truncate;
}

/* Footer */
.sidebar-footer {
  @apply p-3 border-t;
  border-color: var(--sidebar-border);
}

.footer-btn {
  @apply flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium;
  color: var(--sidebar-text);
  transition: all 0.15s ease;
}

.footer-btn:hover {
  background: var(--sidebar-hover);
  color: white;
}

.collapsed .footer-btn {
  @apply justify-center;
}
</style>
