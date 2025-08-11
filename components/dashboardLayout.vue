<template>
  <div id="dashboard-layout">
    <ThingSidebarProvider>
      <ThingSidebar side="right">
        <ThingSheetHeader class="header">
          <NuxtLink to="/">
            <NuxtImg src="/images/logo.png" alt="" class="w-25" />
          </NuxtLink>
        </ThingSheetHeader>
        <ThingSidebarContent class="px-2.5 divide-y divide-gray-200">
          <ThingSidebarGroup>
            <ThingSidebarGroupLabel :label="authStore.user?.user_type" />
            <ThingSidebarGroupContent>
              <ThingSidebarMenu>
                <ThingSidebarMenuItem
                  v-for="item in dashboardStore.sidebarRoutes"
                  :key="item.url"
                >
                  <ThingSidebarMenuButton as-child class="ds-menu-item">
                    <NuxtLink :to="item.url">
                      <Icon :name="item.icon" class="size-4.5!" />
                      <span>{{ item.title }}</span>
                    </NuxtLink>
                  </ThingSidebarMenuButton>
                </ThingSidebarMenuItem>
              </ThingSidebarMenu>
            </ThingSidebarGroupContent>
          </ThingSidebarGroup>
          <ThingSidebarGroup>
            <ThingSidebarGroupContent>
              <DashboardLogoutBtn />
            </ThingSidebarGroupContent>
          </ThingSidebarGroup>
        </ThingSidebarContent>
      </ThingSidebar>
    </ThingSidebarProvider>
  </div>
</template>

<script lang="ts" setup>
// Menu items.
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
</script>

<style scoped>
@reference "tailwindcss";

.header {
  @apply p-5 lg:h-20! justify-center border-b border-gray-300;
}

[data-sidebar="group"] {
  @apply px-0;
}
</style>
