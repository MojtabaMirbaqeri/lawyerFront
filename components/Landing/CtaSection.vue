<template>
  <section class="cta-section">
    <div class="cta-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
    
    <div class="container">
      <div class="cta-content">
        <h2 class="cta-title">
          آماده دریافت مشاوره حقوقی هستید؟
        </h2>
        <p class="cta-subtitle">
          همین الان با بهترین وکلای کشور مشاوره کنید
        </p>
        <div class="cta-buttons">
          <button type="button" class="cta-btn cta-btn--primary" aria-label="رزرو وقت مشاوره" @click="navigateTo('/lawyers')">
            <UIcon name="heroicons:calendar-days-solid" class="size-5!" aria-hidden="true" />
            رزرو وقت مشاوره
          </button>
          <button type="button" class="cta-btn cta-btn--secondary" aria-label="تماس با پشتیبانی" @click="navigateTo('tel:+982110014488')">
            <UIcon name="heroicons:phone-solid" class="size-5!" aria-hidden="true" />
            تماس با پشتیبانی
          </button>
        </div>
        <p class="cta-hint">
          <UIcon name="heroicons:shield-check-solid" class="size-4!" />
          ضمانت بازگشت وجه در صورت عدم رضایت
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
@reference "tailwindcss";

.cta-section {
  @apply relative py-20 lg:py-24 overflow-hidden;
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
}

.cta-bg {
  @apply absolute inset-0 overflow-hidden pointer-events-none;
}

.blob {
  @apply absolute rounded-full opacity-20;
  filter: blur(80px);
}

.blob-1 {
  @apply w-[600px] h-[600px] -top-40 -end-40;
  background: #f59e0b;
}

.blob-2 {
  @apply w-[500px] h-[500px] -bottom-40 -start-40;
  background: #3b82f6;
}

.cta-content {
  @apply relative z-10 text-center max-w-3xl mx-auto;
}

.cta-title {
  @apply text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4;
}

.cta-subtitle {
  @apply text-lg lg:text-xl text-white/70 mb-8;
}

.cta-buttons {
  @apply flex flex-col sm:flex-row items-center justify-center gap-4 mb-6;
}

.cta-btn {
  @apply flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all;
}

.cta-btn--primary {
  @apply font-bold;
  color: #1e3a5f;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
}

.cta-btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(251, 191, 36, 0.5);
}

.cta-btn--secondary {
  @apply text-white border-2 border-white/30 bg-white/10;
  backdrop-filter: blur(10px);
}

.cta-btn--secondary:hover {
  @apply bg-white/20 border-white/50;
}

.cta-hint {
  @apply flex items-center justify-center gap-2 text-sm text-white/50;
}
</style>
