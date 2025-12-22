<template>
  <header class="filtered-hero">
    <div class="container">
      <h1 class="hero-title">{{ title }}</h1>
      <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>

      <div class="search-wrapper">
        <UInput
          v-model="searchQuery"
          class="search-input w-full max-w-[440px]"
          placeholder="جستجوی وکلا..."
          :ui="{
            base: 'w-full rounded-full border bg-[#E1E1E3] border-[#00000047] py-3 md:text-base ring-0 focus-visible:ring-0',
            trailing: 'pe-0 m-1',
          }"
          @keydown.enter="handleSearch">
          <template #trailing>
            <div class="search-btn" @click="handleSearch">
              <UIcon name="hugeicons:search-02" class="size-6! text-[#919191]" />
            </div>
          </template>
        </UInput>
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
  @apply p-5 px-1 pt-9 pb-12 rounded-b-[40px] bg-[#EEEEF8] text-center text-white;
}

.container {
  @apply flex flex-col items-center justify-center gap-4;
}

.hero-title {
  @apply text-[24px] md:text-[32px] font-bold text-[#242397];
}

.hero-subtitle {
  @apply text-base md:text-lg text-[#242397]/80;
}

.search-wrapper {
  @apply w-full max-w-2xl;
}

.search-btn {
  @apply aspect-square h-full border border-[#00000047] bg-[#EEEEF8] rounded-full flex items-center justify-center cursor-pointer hover:opacity-70 transition duration-300;
}
</style>
