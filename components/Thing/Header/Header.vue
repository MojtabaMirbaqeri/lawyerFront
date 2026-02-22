<template>
  <header
    class="sticky top-0 z-30 flex items-center justify-between w-full h-20 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300"
  >
    <!-- Left Side: Mobile Menu & Breadcrumbs/Title -->
    <div class="flex items-center gap-4">
      <button
        @click="openSideBarHandle"
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
      >
        <UIcon
          name="solar:hamburger-menu-linear"
          class="size-6 text-[#1e3a5f]"
        />
      </button>

      <!-- Optional Title/Breadcrumb area -->
      <h1 class="text-lg font-bold text-[#1e3a5f] hidden sm:block">
        {{ pageTitle }}
      </h1>
    </div>

    <!-- Right Side: Interaction Area -->
    <div class="flex items-center gap-3 sm:gap-6">
      <!-- Chat Back Button (Mobile only logic from original) -->
      <UIcon
        v-if="$route.path == '/chat'"
        name="ic:round-arrow-back-ios-new"
        class="size-5 lg:hidden cursor-pointer text-[#1e3a5f]"
        @click="navigateTo('/dashboard')"
      />

      <!-- Notification Bell -->
      <div
        class="relative cursor-pointer p-2 rounded-full hover:bg-gray-50 transition-colors group"
      >
        <UIcon
          name="solar:bell-bing-linear"
          class="size-6 text-gray-500 group-hover:text-[#f59e0b] transition-colors"
        />
        <span
          class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"
        ></span>
      </div>

      <!-- User Dropdown -->
      <UDropdown
        :items="dropdownItems"
        :ui="{ item: { disabled: 'cursor-text select-text' } }"
        :popper="{ placement: 'bottom-end' }"
      >
        <div
          class="flex items-center gap-3 cursor-pointer p-1.5 pr-2 pl-4 rounded-full border border-gray-100 hover:shadow-md transition-shadow bg-white"
        >
          <UAvatar
            :src="userAvatar"
            :alt="userName"
            size="sm"
            class="ring-2 ring-gray-100"
          />
          <div class="hidden md:flex flex-col items-start ml-2">
            <span class="text-sm font-bold text-[#1e3a5f] leading-none">{{
              userName
            }}</span>
            <span class="text-xs text-gray-400 mt-1">{{ userRole }}</span>
          </div>
          <UIcon
            name="solar:alt-arrow-down-linear"
            class="size-4 text-gray-400"
          />
        </div>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
          <UIcon
            :name="item.icon"
            class="flex-shrink-0 size-4 text-gray-400 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const route = useRoute();

// Computed for dynamic title
const pageTitle = computed(() => {
  if (route.path.startsWith("/chat")) {
    return chatStore.roomInfo?.name || "گفتگو";
  }
  return "داشبورد مدیریت";
});

// User Info
const userName = computed(
  () =>
    `${authStore.user?.name || ""} ${authStore.user?.family || ""}`.trim() ||
    "کاربر مهمان",
);
const userRole = computed(() =>
  authStore.user?.user_type === "lawyer" ? "وکیل دادگستری" : "کاربر عادی",
);
const userAvatar = computed(() => useStorageImageUrl(authStore.user?.profile_image) || "");

// Dropdown Items
const dropdownItems = [
  [
    {
      label: userName.value,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "پروفایل کاربری",
      icon: "solar:user-circle-linear",
      click: () => navigateTo("/dashboard/profile"),
    },
    {
      label: "تنظیمات",
      icon: "solar:settings-linear",
    },
  ],
  [
    {
      label: "خروج از حساب",
      icon: "solar:logout-2-linear",
      click: () => handleLogout(),
    },
  ],
];

const openSideBarHandle = () => {
  document.body.classList.add("overflow-hidden!");
  dashboardStore.openSidebar = true;
};

const handleLogout = async () => {
  // Implement logout logic here or call authStore logout
  // authStore.logout();
  navigateTo("/login");
};
</script>

<style scoped>
/* Scoped styles if needed, mostly Tailwind used */
</style>
