<template>
  <div id="dashboard-layout">
    <ThingSidebarProvider>
      <ThingSidebar side="right">
        <ThingSheetHeader
          class="p-5 lg:h-20! justify-center border-b border-gray-300"
        >
          <img src="/images/logo.png" alt="" class="w-25" />
        </ThingSheetHeader>
        <ThingSidebarContent>
          <ThingSidebarGroup class="px-2.5">
            <ThingSidebarGroupLabel label="پنل ادمین" />
            <ThingSidebarGroupContent>
              <ThingSidebarMenu>
                <ThingSidebarMenuItem v-for="item in route" :key="item.title">
                  <ThingSidebarMenuButton as-child class="pc-items">
                    <NuxtLink :to="item.url">
                      <Icon :name="item.icon" class="size-4.5!" />
                      <span>{{ item.title }}</span>
                    </NuxtLink>
                  </ThingSidebarMenuButton>
                </ThingSidebarMenuItem>
              </ThingSidebarMenu>
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

const route = dashboardStore.adminRoute;
</script>

<style scoped>
@reference "tailwindcss";

.pc-items {
  @apply py-5 px-4 overflow-clip relative;
  transition: all 0.3s;
}

.pc-items::before {
  content: " ";
  @apply absolute h-[85%]! w-[9px] rounded-full bg-blue-500 translate-x-[calc(100%+1px)] start-0 transition-all duration-300;
}

.pc-items:hover {
  @apply text-blue-500;
}

.router-link-active {
  @apply text-blue-500 bg-blue-100/80;
}

.pc-items.router-link-active::before {
  @apply bg-blue-500 translate-x-1/2!;
}
</style>
