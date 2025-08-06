<template>
  <div id="navBar">
    <div class="container">
      <UIcon name="heroicons:bars-3-solid" class="size-7! lg:hidden!" />
      <NuxtImg src="/images/logo.png" class="h-6" />

      <ClientOnly>
        <NuxtLink :to="auth.token ? '/dashboard' : '/register'" class="ms-auto">
          <UButton
            color="secondary"
            class="text-secondary! gap-0.5 text-base"
            variant="outline"
          >
            {{ auth.token ? "پنل کاربری" : "ورود / ثبت نام" }}
            <UIcon name="mage:login" class="size-5! rotate-180" />
          </UButton>
        </NuxtLink>
      </ClientOnly>
    </div>
  </div>
</template>
<script setup>
const auth = useAuthStore();
</script>
<style scoped>
@reference "tailwindcss";
#navBar {
  @apply sticky top-0 start-0 z-[100] py-2;
  @apply w-full;
  @apply bg-white shadow-lg;
}

.container {
  @apply flex items-center gap-6;
}
</style>