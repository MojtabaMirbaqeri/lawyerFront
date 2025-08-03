<template>
  <div class="flex justify-between">
    <ClientOnly>
      <dashboard-layout />
    </ClientOnly>
    <div class="w-full">
      <nav class="border-b p-6 sticky top-0 backdrop-blur-lg lg:z-50">
        <div class="trigger lg:hidden">
          <div class="openBtn">
            <UIcon name="solar:hamburger-menu-outline" class="size-5!" @click="openSideBarHandle" />
          </div>
        </div>
      </nav>
      <slot />
    </div>
  </div>
</template>

<script setup>
const dashboardStore = useDashboardStore();
const openSideBarHandle = () => {
  dashboardStore.openSidebar = true;
};
</script>

<style>
</style>