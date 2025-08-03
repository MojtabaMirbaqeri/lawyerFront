<template>
  <div class="">
    <ThingSidebarProvider>
      <ThingSidebar side="right">
        <ThingSidebarContent>
          <ThingSidebarGroup>
            <ThingSheetHeader class="p-2">
                <img src="/images/logo.png" alt="" class="w-25">
            </ThingSheetHeader>
            <ThingSidebarGroupLabel label="Application" />
            <ThingSidebarGroupContent>
              <ThingSidebarMenu>
                <ThingSidebarMenuItem v-for="item in route" :key="item.title">
                  <ThingSidebarMenuButton as-child class="pc-items">
                    <NuxtLink :to="item.url">
                      <Icon :name="item.icon" />
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

const route = dashboardStore.adminRoute
</script>

<style scoped>
@reference "tailwindcss";

.pc-items{
  @apply py-5 px-4;
  transition: all 0.3s;
}

.pc-items:hover{
  @apply text-blue-500
}

.router-link-active{
  @apply text-blue-500 border border-blue-500
}
</style>