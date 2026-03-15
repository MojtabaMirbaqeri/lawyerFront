<template>
  <header class="page-hero">
    <div class="hero-bg">
      <div class="blob blob-1" />
      <div class="grid-pattern" />
    </div>
    <div class="hero-container">
      <h1 class="hero-title">{{ title }}</h1>
      <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped>
@reference "tailwindcss";

.page-hero {
  @apply relative py-12 md:py-16 px-4 text-center overflow-hidden;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1a2f4a 100%);
}

.hero-bg {
  @apply absolute inset-0 pointer-events-none;
}

.blob {
  @apply absolute rounded-full opacity-20;
  filter: blur(80px);
}

.blob-1 {
  @apply w-[400px] h-[400px] -top-32 -end-20;
  background: linear-gradient(135deg, #2d5a87, #f59e0b);
  animation: blob-float 10s ease-in-out infinite;
}

.grid-pattern {
  @apply absolute inset-0 opacity-[0.04];
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 48px 48px;
}

.hero-container {
  @apply container relative flex flex-col items-center justify-center gap-3 md:gap-4 max-w-4xl mx-auto;
}

.hero-title {
  @apply text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight;
}

.hero-subtitle {
  @apply text-base md:text-lg text-white/90 max-w-2xl leading-relaxed;
}

@keyframes blob-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.05); }
}
</style>
