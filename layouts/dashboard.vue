<template>
  <div class="flex justify-between">
    <ClientOnly>
      <dashboard-layout :chat-items="chatItems || []" />
      <div class="w-full">
        <!-- وقتی هیچ اتاقی انتخاب نشده -->
        <nav
          class="dashboard-nav"
          v-if="chatStore.chatRooms?.length <= 0 || chatStore.selectedRoom == 0"
        >
          <UIcon
            name="solar:hamburger-menu-outline"
            class="size-6! lg:hidden!"
            @click="openSideBarHandle"
          />
          <UserProfile
            :reverse="true"
            :detail="{
              name: `${authStore?.user?.name} ${authStore?.user?.family}`,
              text: authStore?.user?.phone,
            }"
          />
        </nav>

        <!-- وقتی اتاق انتخاب شده -->
        <nav class="dashboard-nav" v-else>
          <UIcon
            name="solar:hamburger-menu-outline"
            class="size-6! lg:hidden!"
            @click="openSideBarHandle"
          />
          <UserProfile
            :reverse="true"
            :detail="{
              name: roomName,
              text: chatStore?.roomInfo?.phone,
            }"
          />
        </nav>

        <div
          class="space-y-4"
          :class="{ 'ds-container': $route.path.startsWith('/dashboard') }"
        >
          <UAlert
            v-if="
              authStore.user?.user_type == 'lawyer' &&
              authStore.user?.lawyer_id == null
            "
            title="عدم دسترسی!"
            description="احراز هویت شما در دست بررسی می باشد!"
            color="warning"
            variant="subtle"
            icon="solar:shield-warning-linear"
            :ui="{
              icon: 'size-8!',
              title: 'font-bold text-base',
              root: 'items-center',
            }"
          />
          <slot
            v-if="!(
              authStore.user?.user_type == 'lawyer' &&
              authStore.user?.lawyer_id == null &&
              $route.path == '/dashboard/lawyer'
            )"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const chatStore = useChatStore();

defineProps(["chatItems"]);

const openSideBarHandle = () => {
  document.body.classList.add("overflow-hidden!");
  dashboardStore.openSidebar = true;
};

// اسم اتاق یا شخص مقابل
const roomName = computed(() => {
  const room = chatStore.roomInfo;
  if (!room) return "";

  // گروه
  if (room.members?.length > 2) {
    return room.name || `${authStore.user?.name ?? ""} ${authStore.user?.family ?? ""}`.trim();
  }

  // چت خصوصی (پیدا کردن فرد مقابل)
  const other = room.members?.find((m) => m.id !== authStore.user.id);
  if (!other) return "";

  return `${other.name ?? ""} ${other.family ?? ""}`.trim();
});

// وقتی کامپوننت mount شد
onMounted(() => {
  if (chatStore.selectedRoom !== 0) {
    console.log("Room ID exists:", chatStore.selectedRoom);
    console.log("Room Name on mount:", roomName.value);
  }
});

// وقتی اطلاعات اتاق آپدیت شد (مثلاً از API اومد)
watch(
  () => chatStore.roomInfo,
  (newVal) => {
    if (newVal) {
      console.log("Room Info updated:", newVal);
      console.log("Room Name updated:", roomName.value);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
@reference "tailwindcss";
.dashboard-nav {
  @apply border-b border-gray-300 px-5 py-3 lg:px-6 lg:py-5 sticky top-0 z-10 backdrop-blur-lg lg:z-50 bg-white/80 flex items-center justify-between lg:h-20!;
}
</style>
