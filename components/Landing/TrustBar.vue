<template>
  <section class="trust-bar">
    <div class="container">
      <div class="trust-items">
        <div class="trust-item">
          <div class="trust-icon">
            <UIcon name="heroicons:users-solid" class="size-6!" />
          </div>
          <div class="trust-content">
            <span class="trust-number">
              <ClientOnly>{{ useGlobalStore()?.lawyersCount?.toLocaleString() || '127,000' }}+</ClientOnly>
            </span>
            <span class="trust-label">وکیل متخصص</span>
          </div>
        </div>
        
        <div class="trust-divider"></div>
        
        <div class="trust-item">
          <div class="trust-icon">
            <UIcon name="heroicons:chat-bubble-left-right-solid" class="size-6!" />
          </div>
          <div class="trust-content">
            <span class="trust-number">50,000+</span>
            <span class="trust-label">مشاوره موفق</span>
          </div>
        </div>
        
        <div class="trust-divider"></div>
        
        <div class="trust-item">
          <div class="trust-icon">
            <UIcon name="heroicons:star-solid" class="size-6!" />
          </div>
          <div class="trust-content">
            <span class="trust-number">4.9</span>
            <span class="trust-label">امتیاز کاربران</span>
          </div>
        </div>
        
        <div class="trust-divider"></div>
        
        <div class="trust-item">
          <div class="trust-icon">
            <UIcon name="heroicons:map-pin-solid" class="size-6!" />
          </div>
          <div class="trust-content">
            <span class="trust-number">31</span>
            <span class="trust-label">استان کشور</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
@reference "tailwindcss";

.trust-bar {
  @apply py-6 lg:py-8;
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.06) 0%, rgba(45, 90, 135, 0.05) 100%);
  border-top: 1px solid rgba(30, 58, 95, 0.12);
  border-bottom: 1px solid rgba(30, 58, 95, 0.12);
}

.trust-items {
  @apply flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-4;
}

.trust-item {
  @apply flex items-center gap-3;
}

.trust-icon {
  @apply size-12 lg:size-14 rounded-2xl flex items-center justify-center text-[#1e3a5f];
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
}

.trust-content {
  @apply flex flex-col;
}

.trust-number {
  @apply text-2xl lg:text-3xl font-black text-gray-800;
}

.trust-label {
  @apply text-sm lg:text-base text-gray-500;
}

.trust-divider {
  @apply hidden lg:block w-px h-12 bg-gray-200;
}
</style>
