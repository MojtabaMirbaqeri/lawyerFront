<template>
  <div class="relative">
    <Transition name="fade">
      <div v-if="showBanner && bannerVisible" class="warning-banner" role="alert">
        <button
          type="button"
          class="warning-banner__close"
          aria-label="بستن"
          @click="bannerVisible = false">
          <Icon name="solar:close-square-linear" class="size-5" />
        </button>
        <span class="warning-banner__text">
          <slot name="banner-text">
            وکیل‌وکیل، اطلاعات موجود بصورت خودکار از منابع عمومی جمع‌آوری شده و هیچ‌گونه
            مسئولیتی در قبال صحت یا به‌روزرسانی آن‌ها ندارد.
            <NuxtLink to="/privacy-policy" class="text-primary">بیشتر بخوانید</NuxtLink>:
          </slot>
        </span>
      </div>
    </Transition>
    <NavigationBar />
    <div class="">
      <slot />
    </div>
    <Footer />
  </div>
</template>
<script setup>
const route = useRoute();

const bannerVisible = ref(true);

const showBanner = computed(() => {
  const p = route.path;
  const parts = p.split("/").filter(Boolean);
  return (
    parts[0] === "lawyer" && parts.length >= 3 && !!route.params.id && !!route.params.slug
  );
});
</script>

<style scoped>
.warning-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
  position: relative;
  text-align: center;
}

.warning-banner__text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.warning-banner__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: #b45309;
  cursor: pointer;
  border-radius: 0.25rem;
  transition:
    background 0.2s,
    color 0.2s;
}

.warning-banner__close:hover {
  background: rgba(245, 158, 11, 0.2);
  color: #92400e;
}

/* transition name="fade" */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
