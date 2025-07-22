<template>
  <div id="navBar">
    <div class="container">
      <UIcon name="heroicons:bars-3-solid" class="size-7! lg:hidden!" />
      <NuxtImg src="/images/logo.png" class="h-6 " />
      <NuxtLink to="#" class="ms-auto">
        <UButton
          color="secondary"
          class="text-secondary! gap-0.5 text-base"
          variant="outline"
          >ورود<UIcon name="mage:login" class="size-5! rotate-180"
        /></UButton>
      </NuxtLink>
    </div>
  </div>
</template>
<style scoped>
@reference "tailwindcss";
#navBar {
  @apply sticky top-0 start-0 z-10 py-2;
  @apply w-full;
  @apply bg-white shadow-lg;
}

.container {
  @apply flex items-center gap-6;
}
</style>