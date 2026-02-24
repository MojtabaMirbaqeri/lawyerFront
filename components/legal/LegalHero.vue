<template>
  <header class="legal-hero">
    <div class="legal-hero-bg">
      <div class="legal-hero-blob legal-hero-blob-1"></div>
      <div class="legal-hero-grid"></div>
    </div>
    <div class="container legal-hero-inner">
      <h1 class="legal-hero-title">{{ title }}</h1>
      <p v-if="subtitle" class="legal-hero-subtitle">{{ subtitle }}</p>
      <div v-if="$slots.actions" class="legal-hero-actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
});
</script>

<style scoped>
@reference "tailwindcss";

.legal-hero {
  @apply relative py-12 md:py-16 px-4 text-center overflow-hidden;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1a2f4a 100%);
}

.legal-hero-bg {
  @apply absolute inset-0 pointer-events-none;
}

.legal-hero-blob {
  @apply absolute rounded-full opacity-20;
  filter: blur(80px);
}

.legal-hero-blob-1 {
  @apply w-[320px] h-[320px] -top-24 -end-16;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  animation: legal-blob-float 12s ease-in-out infinite;
}

.legal-hero-grid {
  @apply absolute inset-0 opacity-[0.05];
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
  background-size: 40px 40px;
}

.legal-hero-inner {
  @apply relative flex flex-col items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto;
}

.legal-hero-title {
  @apply text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight;
}

.legal-hero-subtitle {
  @apply text-base md:text-lg text-white/90;
}

.legal-hero-actions {
  @apply mt-5 md:mt-6 flex flex-wrap items-center justify-center gap-3;
}

@keyframes legal-blob-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(15px, -15px) scale(1.05); }
}
</style>
