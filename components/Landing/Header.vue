<template>
  <header>
    <!-- Background Elements -->
    <div class="hero-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <div class="container">
      <div class="hero-grid">
        <!-- Content Side -->
        <div class="hero-content">
          <div class="hero-badge">
            <UIcon name="heroicons:sparkles-solid" class="size-4!" />
            پلتفرم هوشمند حقوقی
          </div>

          <h1 class="hero-title">
            دسترسی آسان به
            <span class="title-highlight">بهترین وکلای</span>
            کشور
          </h1>

          <p class="hero-description">
            با وکیل‌وکیل در کمترین زمان به مشاوره حقوقی تخصصی دسترسی پیدا کنید. بیش از ۱۲۷
            هزار وکیل متخصص آماده پاسخگویی هستند.
          </p>

          <!-- Search Box -->
          <div class="search-box" ref="searchWrapper">
            <div class="search-inner">
              <UInput
                v-model="lawyerNameFilter"
                class="w-full"
                name="lawyerNameFilter"
                placeholder="نام وکیل یا تخصص را جستجو کنید..."
                :ui="{
                  base: 'w-full rounded-xl border-0 bg-transparent py-4 text-base ring-0 focus-visible:ring-0 pe-24',
                }"
                @keydown.enter="search"
                @focus="handleFocus">
              </UInput>
              <button class="search-btn" @click="search">
                <UIcon name="heroicons:magnifying-glass-solid" class="size-5!" />
              </button>
            </div>

            <!-- Suggest Box -->
            <Transition name="fade">
              <div v-if="showSuggestBox" class="suggest-box">
                <div v-if="loading" class="space-y-2">
                  <USkeleton v-for="i in 3" :key="i" class="h-16 w-full rounded-xl" />
                </div>
                <div
                  v-else-if="lawyers?.length"
                  class="max-h-60 overflow-y-auto flex flex-col gap-2">
                  <NuxtLink
                    v-for="lawyer in lawyers"
                    :key="lawyer.id"
                    :to="`/lawyer/${lawyer.id}/${(lawyer.name + ' ' + lawyer.family).trim().replace(/\s+/g, '-')}`"
                    class="suggestion-item">
                    <div class="flex items-center gap-3">
                      <div class="size-12 rounded-full bg-gray-100 overflow-hidden">
                        <NuxtImg
                          v-if="lawyer.profile_image"
                          :src="config.public.imageBase + lawyer.profile_image"
                          class="w-full h-full object-cover" />
                        <NuxtImg
                          v-else
                          src="/images/nullavatar.png"
                          class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 class="font-semibold text-gray-800">
                          {{ lawyer.name }} {{ lawyer.family }}
                        </h4>
                        <p class="text-sm text-gray-500">
                          {{ lawyer.specialty || "وکیل دادگستری" }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-500">
                      <UIcon name="heroicons:star-solid" class="size-4!" />
                      <span class="font-bold">{{
                        Number(lawyer.average_rating).toFixed(1)
                      }}</span>
                    </div>
                  </NuxtLink>
                </div>
                <div v-else class="text-center py-4 text-gray-500">وکیلی یافت نشد</div>
              </div>
            </Transition>
          </div>

          <!-- Quick Actions -->
          <div
            class="quick-actions"
            :class="{ 'quick-actions--dropdown-open': showSuggestBox }">
            <button class="quick-btn" @click="navigateTo('/lawyers')">
              <UIcon name="heroicons:squares-2x2-solid" class="size-5!" />
              مشاهده همه وکلا
            </button>
            <button class="quick-btn" @click="navigateTo('tel:+982110014488')">
              <UIcon name="heroicons:phone-solid" class="size-5!" />
              تماس با پشتیبانی
            </button>
          </div>
        </div>

        <!-- Image Side -->
        <div class="hero-visual">
          <div class="visual-card">
            <img src="/images/vector-lawyer.webp" alt="Lawyer" class="main-image" />
          </div>

          <!-- Floating Cards -->
          <div class="floating-card floating-card--top">
            <UIcon name="heroicons:shield-check-solid" class="size-6! text-green-500" />
            <span>وکلای تأیید شده</span>
          </div>

          <div class="floating-card floating-card--bottom">
            <UIcon name="heroicons:star-solid" class="size-6! text-yellow-500" />
            <span>امتیاز ۴.۹ از ۵</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const filtersStore = useFiltersStore();
const searchWrapper = ref(null);
const lawyerNameFilter = ref("");
const showSuggestBox = ref(false);
const loading = ref(false);
const lawyers = ref([]);
const config = useRuntimeConfig();

let searchTimeout = null;

const performSearch = async (searchQuery) => {
  if (searchQuery.length >= 3) {
    showSuggestBox.value = true;
    loading.value = true;
    try {
      const { data, status } = await useGet({
        url: "lawyer-search/suggestions",
        query: { query: searchQuery, per_page: 5 },
      });
      if (status && data.data.data?.lawyers) {
        lawyers.value = data.data.data.lawyers;
      } else {
        lawyers.value = [];
      }
    } catch (error) {
      lawyers.value = [];
    } finally {
      loading.value = false;
    }
  } else {
    showSuggestBox.value = false;
    lawyers.value = [];
  }
};

watch(lawyerNameFilter, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(val), 500);
});

const search = () => {
  filtersStore.selectedFilters.searchField = lawyerNameFilter.value;
  showSuggestBox.value = false;
  navigateTo("/lawyers");
};

const handleFocus = () => {
  if (lawyerNameFilter.value.length >= 3) showSuggestBox.value = true;
};

const handleClickOutside = (e) => {
  if (searchWrapper.value && !searchWrapper.value.contains(e.target)) {
    showSuggestBox.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (searchTimeout) clearTimeout(searchTimeout);
});
</script>

<style scoped>
@reference "tailwindcss";

header {
  @apply relative min-h-[90vh] flex items-center py-20 lg:py-0 overflow-hidden;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #1a2f4a 100%);
}

.hero-bg {
  @apply absolute inset-0 overflow-hidden pointer-events-none;
}

.blob {
  @apply absolute rounded-full opacity-30;
  filter: blur(100px);
}

.blob-1 {
  @apply w-[600px] h-[600px] -top-40 -end-40;
  background: linear-gradient(135deg, #2d5a87, #f59e0b);
  animation: blob-float 8s ease-in-out infinite;
}

.blob-2 {
  @apply w-[500px] h-[500px] -bottom-40 -start-40;
  background: linear-gradient(135deg, #1e3a5f, #3b7ab5);
  animation: blob-float 10s ease-in-out infinite 2s;
}

@keyframes blob-float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

.grid-pattern {
  @apply absolute inset-0 opacity-[0.03];
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-grid {
  @apply grid lg:grid-cols-2 gap-12 lg:gap-16 items-center;
}

.hero-content {
  @apply text-center lg:text-start;
}

.hero-badge {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-6;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6;
}

.title-highlight {
  @apply relative;
  color: #fbbf24;
}

.hero-description {
  @apply text-lg text-white/80 max-w-xl mb-8 mx-auto lg:mx-0;
}

.search-box {
  @apply relative max-w-xl mx-auto lg:mx-0 mb-6 overflow-visible;
}

.search-inner {
  @apply relative flex items-center rounded-2xl overflow-hidden;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.search-btn {
  @apply absolute end-[1%] size-12 rounded-[19px] flex items-center justify-center text-[#1e3a5f];
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
}

.suggest-box {
  @apply absolute top-full left-0 right-0 z-50 mt-3 w-full p-3 rounded-2xl bg-white;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.suggestion-item {
  @apply flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors;
}

.quick-actions {
  @apply flex flex-wrap justify-center lg:justify-start gap-3 transition-[margin] duration-200;
}

.quick-actions--dropdown-open {
  margin-top: calc(0.75rem + 15rem + 0.5rem);
}

.quick-btn {
  @apply flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium transition-all;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.quick-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.hero-visual {
  @apply relative hidden lg:block;
}

.visual-card {
  @apply relative rounded-3xl overflow-hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.main-image {
  @apply w-full h-auto;
}

.floating-card {
  @apply absolute flex items-center gap-2 px-4 py-3 rounded-xl bg-white shadow-xl font-medium text-gray-800;
  animation: float 4s ease-in-out infinite;
}

.floating-card--top {
  @apply top-10 -start-10;
  animation-delay: 0s;
}

.floating-card--bottom {
  @apply bottom-10 -end-10;
  animation-delay: 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
