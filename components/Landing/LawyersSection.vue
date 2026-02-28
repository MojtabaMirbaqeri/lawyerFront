<template>
  <section id="lawyers" class="lawyers-section">
    <!-- Section Header (hidden on dedicated /lawyers page) -->
    <div v-if="!hideSectionHeader" class="section-header">
      <h2 class="sec-header">
        لیست <span class="gradient-text">وکلای متخصص</span>
      </h2>
      <p class="section-subtitle">بهترین وکلا را با توجه به تخصص و رتبه‌بندی انتخاب کنید</p>
    </div>

    <!-- Type Filter -->
    <div class="type-filter">
      <UICSelectButton
        v-model="filtersStore.selectedFilters.lawyerType"
        :items="lawyerTypes" />
    </div>

    <!-- Phone-only Filter Trigger -->
    <div class="sm:hidden">
      <UICDrawer
        v-model="filtersStore.drawerVisiblity"
        title="filters"
        description="filter laywers"
        class="overflow-y-auto!">
        <template #button>
          <div class="filters-trigger">
            <UChip inset :show="filtersStore.hasActiveFilters" position="bottom-right">
              <UIcon name="heroicons:funnel-solid" class="size-5! text-[#1e3a5f]" />
            </UChip>
            <span>فیلترها</span>
            <UIcon name="heroicons:chevron-left-solid" class="size-4! ms-auto" />
          </div>
        </template>
        <template #default><LandingFilters /></template>
      </UICDrawer>
    </div>
    
    <!-- Main Content -->
    <div ref="lawyersListRef" class="lawyers-layout">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <LandingSidebar />
      </aside>
      
      <!-- Lawyers Grid -->
      <main class="lawyers-main">
        <!-- Sort Tabs -->
        <div class="sort-bar">
          <span class="sort-label">مرتب‌سازی:</span>
          <UICTabs
            v-model="filtersStore.selectedFilters.sortBy"
            :content="false"
            :items="tabItems"
            :ui="{ trigger: 'shrink-0 text-sm' }" />
        </div>
        
        <!-- Lawyers Grid -->
        <div v-if="lawyersRef?.data?.length" class="lawyers-grid">
          <NuxtLink
            v-for="lawyer in lawyersRef?.data"
            :key="lawyer.id"
            :to="`/${props.link}${lawyer.id}/${(lawyer.name + ' ' + lawyer.family).trim().replace(/\s+/g, '-')}`">
            <LawyerCard :titlebtn="titlebtn" :lawyer-info="lawyer" />
          </NuxtLink>
        </div>
        
        <!-- Empty State -->
        <Transition name="fade">
          <LawyerCard
            v-if="staticLawyerInfo && (!lawyersRef?.data?.length || lawyersRef.data == 0)"
            :lawyer-info="staticLawyerInfo"
            :is-empty="true" />
        </Transition>
        
        <!-- Pagination -->
        <div v-if="lawyersRef?.meta" class="pagination-wrapper">
          <UICPagination
            v-model="currentLawyersPage"
            :total="lawyersRef.meta.total"
            :page-size="lawyersRef.meta.per_page" />
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
const filtersStore = useFiltersStore();
const globalStore = useGlobalStore();
const route = useRoute();
const { readFromUrl, writeToUrl } = useUrlFilters();

const props = defineProps({
  link: { type: String, default: "lawyer/" },
  titlebtn: { type: String, default: "رزرو مشاوره" },
  hideSectionHeader: { type: Boolean, default: false },
});
const lawyersRef = ref(null);

const staticLawyerInfo = ref(null);
const currentLawyersPage = ref(1);
const lawyersListRef = ref(null);

const tabItems = ref(filtersStore.sortItems);

const lawyerTypes = [...filtersStore.lawyerTypes];
lawyerTypes.unshift({
  id: 0,
  title: "همه",
});

const scrollToElement = useScrollToElement(80);

const isFilterChange = ref(false);
const isInitialLoad = ref(true);

// Read URL params FIRST and sync store from URL only (تا با جابجایی صفحه فیلتر/سرچ باقی نماند)
const urlFilters = readFromUrl();

currentLawyersPage.value = urlFilters.page;
filtersStore.selectedFilters.sortBy = urlFilters.sort || tabItems.value[0].value;
filtersStore.selectedFilters.lawyerType = urlFilters.type ?? lawyerTypes[0].id;
filtersStore.selectedFilters.gender = urlFilters.gender ?? null;
filtersStore.selectedFilters.province = urlFilters.province ?? 0;
filtersStore.selectedFilters.lawyerSpecialty = urlFilters.specialty ?? null;
filtersStore.selectedFilters.city = urlFilters.city ?? null;
filtersStore.selectedFilters.visitType = urlFilters.visit ? [urlFilters.visit] : [];
filtersStore.selectedFilters.searchField = urlFilters.search || null;

onMounted(async () => {
  const res = await fetch("/lawyer-sample.json");
  staticLawyerInfo.value = await res.json();

  // Mark as loaded to enable URL sync
  isInitialLoad.value = false;
});

watch(currentLawyersPage, async (newPage, oldPage) => {
  // اگر تغییر از فیلتر بوده و صفحه تغییر نکرده، fetch نکن
  if (isFilterChange.value && newPage === oldPage) {
    isFilterChange.value = false;
    return;
  }

  // اگر تغییر از فیلتر بوده و صفحه تغییر کرده، فلگ را reset کن
  if (isFilterChange.value) {
    isFilterChange.value = false;
  }

  // Update URL with new page (skip on initial load)
  if (!isInitialLoad.value) {
    writeToUrl(
      {
        sort: filtersStore.selectedFilters.sortBy,
        page: newPage,
        gender: filtersStore.selectedFilters.gender,
        province: filtersStore.selectedFilters.province,
        specialty: filtersStore.selectedFilters.lawyerSpecialty,
        city: filtersStore.selectedFilters.city,
        type: filtersStore.selectedFilters.lawyerType,
        visit: filtersStore.selectedFilters.visitType,
        search: filtersStore.selectedFilters.searchField,
      },
      true
    );
  }

  await fetchLawyers();
});

watch(filtersStore.selectedFilters, async () => {
  const oldPage = currentLawyersPage.value;
  isFilterChange.value = true;
  currentLawyersPage.value = 1;

  // Update URL with new filters (skip on initial load)
  if (!isInitialLoad.value) {
    writeToUrl(
      {
        sort: filtersStore.selectedFilters.sortBy,
        page: 1,
        gender: filtersStore.selectedFilters.gender,
        province: filtersStore.selectedFilters.province,
        specialty: filtersStore.selectedFilters.lawyerSpecialty,
        city: filtersStore.selectedFilters.city,
        type: filtersStore.selectedFilters.lawyerType,
        visit: filtersStore.selectedFilters.visitType,
        search: filtersStore.selectedFilters.searchField,
      },
      true
    );
  }

  // اگر در صفحه 1 هستیم، watch اجرا نمی‌شود، پس خودمان fetch کنیم
  if (globalStore.sidebarVisblity) {
    globalStore.toggleSidebar();
  }
  if (oldPage === 1) {
    isFilterChange.value = false;
    await fetchLawyers();
  }
});

const isFirstLoad = ref(true);
async function fetchLawyers() {
  if (!isFirstLoad.value) {
    useLoaderStore().showLoader({ blur: true });
  }
  const { data } = await useGet({
    url: "lawyers",
    query: {
      page: currentLawyersPage.value,
      per_page: 12,
      base_id: filtersStore.selectedFilters.lawyerType,
      "specialty_id[]": filtersStore.selectedFilters.lawyerSpecialty || [],
      gender: filtersStore.selectedFilters.gender,
      sort: filtersStore.selectedFilters.sortBy,
      "visit_types[]": filtersStore.selectedFilters.visitType,
      province_id: filtersStore.selectedFilters.province,
      city_id: filtersStore.selectedFilters.city,
      name: filtersStore.selectedFilters.searchField,
    },
  });
  lawyersRef.value = data ?? { data: [], meta: { total: 0, per_page: 12 } };
  if (data?.meta && !useGlobalStore().lawyersCount) {
    useGlobalStore().lawyersCount = data.meta.total;
  }
  if (!isFirstLoad.value) {
    useLoaderStore().hideLoader();
  }
  nextTick(() => {
    // فقط بعد از اولین بار
    if (!isFirstLoad.value && lawyersListRef.value) {
      scrollToElement(lawyersListRef.value);
    }
    isFirstLoad.value = false;
  });
}

await fetchLawyers();
</script>

<style scoped>
@reference "tailwindcss";

.lawyers-section {
  @apply space-y-6 py-16 lg:py-20;
}

.section-header {
  @apply text-center mb-8;
}

.section-subtitle {
  @apply text-gray-500 text-base lg:text-lg mt-2;
}

.type-filter {
  @apply mb-4;
}

.filters-trigger {
  @apply cursor-pointer flex items-center gap-3 font-semibold;
  @apply bg-white rounded-2xl py-3.5 px-5;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.filters-trigger:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.lawyers-layout {
  @apply flex gap-6 lg:gap-8 items-start mt-6;
}

.filters-sidebar {
  @apply hidden lg:block w-72 shrink-0 sticky top-[90px];
}

.filters-sidebar :deep(.sidebar) {
  @apply rounded-2xl overflow-hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.lawyers-main {
  @apply grow space-y-6;
}

.sort-bar {
  @apply flex items-center gap-3 bg-white rounded-2xl px-5 py-3;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.sort-label {
  @apply text-gray-500 text-sm hidden sm:block;
}

.lawyers-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-5;
}

.pagination-wrapper {
  @apply flex justify-center pt-6;
}
</style>

<style>
@reference "tailwindcss";

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>


