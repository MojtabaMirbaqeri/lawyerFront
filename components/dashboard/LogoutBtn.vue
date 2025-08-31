<template>
  <ThingSidebarMenuButton
    as-child
    class="logout-btn ds-menu-item"
    @click="useAuthStore().logout()"
  >
    <NuxtLink>
      <Icon name="solar:login-2-outline" class="size-4.5!" />
      <span>خروج</span>
    </NuxtLink>
  </ThingSidebarMenuButton>
</template>
<style scoped>
@reference "tailwindcss";
.logout-btn {
  @apply text-red-600 bg-red-100/70 hover:text-red-600! hover:bg-red-100 cursor-pointer border border-red-200;
}
</style>