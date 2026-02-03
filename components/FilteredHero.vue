<template>
  <header class="filtered-hero">
    <div class="hero-bg">
      <div class="blob blob-1"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="container">
      <h1 class="hero-title">{{ title }}</h1>
      <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>

      <div class="search-wrapper">
        <div class="search-inner">
          <UInput
            v-model="searchQuery"
            class="search-input w-full"
            placeholder="جستجوی وکلا..."
            :ui="{
              base: 'w-full rounded-2xl border-0 bg-transparent py-3.5 pe-14 ps-5 text-base text-gray-800 placeholder:text-gray-500 ring-0 focus-visible:ring-0',
              trailing: 'hidden',
            }"
            @keydown.enter="handleSearch" />
          <button type="button" class="search-btn" @click="handleSearch" aria-label="جستجو">
            <UIcon name="heroicons:magnifying-glass-solid" class="size-5!" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
});

const searchQuery = ref("");
const filtersStore = useFiltersStore();

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    filtersStore.selectedFilters.searchField = searchQuery.value;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.filtered-hero {
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

.container {
  @apply relative flex flex-col items-center justify-center gap-4 md:gap-5 max-w-4xl mx-auto;
}

.hero-title {
  @apply text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight;
}

.hero-subtitle {
  @apply text-base md:text-lg text-white/85 max-w-xl;
}

.search-wrapper {
  @apply w-full max-w-xl mt-2;
}

.search-inner {
  @apply relative flex items-center rounded-2xl overflow-hidden;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.08);
}

.search-btn {
  @apply absolute end-2 size-11 rounded-xl flex items-center justify-center text-[#1e3a5f] transition-transform hover:scale-105 active:scale-95;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
}

@keyframes blob-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.05);
  }
}
</style>
