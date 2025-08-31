<template>
  <div class="flex justify-between">
    <ClientOnly>
      <dashboard-layout />
      <div class="w-full">
        <nav class="dashboard-nav">
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
        <div class="ds-container space-y-4">
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
            v-if="
              !(
                authStore.user?.user_type == 'lawyer' &&
                authStore.user?.lawyer_id == null && 
                $route.path == '/dashboard/lawyer'
              )
            "
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();

const openSideBarHandle = () => {
  document.body.classList.add("overflow-hidden!");
  dashboardStore.openSidebar = true;
};
</script>

<style scoped>
@reference "tailwindcss";
.dashboard-nav {
  @apply border-b border-gray-300 px-5 py-3 lg:px-6 lg:py-5 sticky top-0 z-10 backdrop-blur-lg lg:z-50 bg-white/80 flex items-center justify-between lg:h-20!;
}
</style>