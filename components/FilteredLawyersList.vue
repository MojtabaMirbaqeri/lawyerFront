<template>
  <section id="lawyers" class="space-y-4">
    <div ref="lawyersListRef" class="lg:flex gap-4 xl:gap-5 items-start">
      <LandingSidebar class="hidden lg:block sticky top-[80px] grow-0 shrink" />
      <main class="space-y-4 grow">
        <UICTabs
          v-model="sortBy"
          :content="false"
          :items="tabItems"
          class="sort-tabs"
          :ui="{ root: 'primary-box sha', trigger: 'shrink-0' }" />
        <div v-if="lawyersRef?.data?.length" class="lawyers-con">
          <NuxtLink
            v-for="lawyer in lawyersRef?.data"
            :key="lawyer.id"
            :to="`/${props.link}${lawyer.id}/${(lawyer.name + ' ' + lawyer.family)
              .trim()
              .replace(/\s+/g, '-')}`">
            <LawyerCard :titlebtn="titlebtn" :lawyer-info="lawyer" />
          </NuxtLink>
        </div>
        <UICPagination
          v-model="currentPage"
          class="w-fit! mx-auto"
          :total="lawyersRef?.meta?.total || 0"
          :page-size="lawyersRef?.meta?.per_page || 10" />
      </main>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  link: {
    type: String,
    default: "lawyer/",
  },
  titlebtn: {
    type: String,
    default: "",
  },
  provinceId: {
    type: Number,
    default: null,
  },
  specialtyId: {
    type: Number,
    default: null,
  },
});

const filtersStore = useFiltersStore();
const route = useRoute();
const { readFromUrl, writeToUrl } = useUrlFilters();

// Initialize from URL
const urlFilters = readFromUrl();
const currentPage = ref(urlFilters.page);
const sortBy = ref(urlFilters.sort);
const lawyersRef = ref({ data: [], meta: { total: 0, per_page: 10 } });
const lawyersListRef = ref(null);

const tabItems = ref(filtersStore.sortItems);

// Fetch lawyers based on props and URL params
async function fetchLawyers() {
  const query = {
    page: currentPage.value,
    sort: sortBy.value,
  };

  if (props.provinceId) {
    query.province_id = props.provinceId;
  }

  if (props.specialtyId) {
    query["specialty_id[]"] = props.specialtyId;
  }

  const { data } = await useGet({
    url: "lawyers",
    query,
  });

  lawyersRef.value = data;
}

// Watch page and sort changes and update URL + fetch
watch([currentPage, sortBy], () => {
  writeToUrl({ sort: sortBy.value, page: currentPage.value }, true);
  fetchLawyers();
});

// Watch URL changes (browser back/forward)
watch(
  () => route.query,
  () => {
    const filters = readFromUrl();
    if (filters.page !== currentPage.value || filters.sort !== sortBy.value) {
      currentPage.value = filters.page;
      sortBy.value = filters.sort;
      // fetchLawyers will be called by the watch above
    }
  }
);

// Initial fetch
await fetchLawyers();
</script>

<style scoped>
@reference "tailwindcss";
.lawyers-con {
  @apply grid grid-cols-1 md:grid-cols-3 gap-5;
}
</style>
