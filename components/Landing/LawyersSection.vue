<template>
  <section id="lawyers" class="space-y-4">
    <div class="space-y-4">
      <div>
        <!-- <UICDrawer
          title="lawyer types"
          description="Categorization of lawyers by type"
        >
          <template #button>
            <UICSecondaryBtn>
              مشاهده همه <UIcon name="proicons:chevron-left" />
            </UICSecondaryBtn>
          </template>
          <template #default>
            <div class="flex flex-col gap-2 text-black">
              <div
                v-for="type in lawyerTypes"
                :key="type.id"
                class="flex items-center justify-between py-2 px-2 rounded-lg bg-gray-100 border border-gray-200 transition-all duration-200 cursor-pointer"
                :class="{
                  'bg-gray-200!  border-gray-400!':
                    type.id == filtersStore.selectedFilters.lawyerType,
                }"
                @click="filtersStore.selectedFilters.lawyerType = type.id"
              >
                {{ type.title }}
                <UIcon name="proicons:chevron-left" class="ms-auto" />
              </div>
            </div>
          </template>
        </UICDrawer> -->
        <UICSelectButton
          v-model="filtersStore.selectedFilters.lawyerType"
          :items="lawyerTypes" />
      </div>
      <UICDrawer
        v-model="filtersStore.drawerVisiblity"
        title="filters"
        description="filter laywers"
        class="overflow-y-auto!">
        <template #button>
          <div class="filters-trigger primary-box">
            <UChip inset :show="filtersStore.hasActiveFilters" position="bottom-right">
              <UIcon name="system-uicons:filtering" class="size-6! text-primary" />
            </UChip>
            فیلتر ها
            <UIcon name="proicons:chevron-left" class="ms-auto" />
          </div>
        </template>
        <template #default><LandingFilters /></template>
      </UICDrawer>
    </div>
    <div ref="lawyersListRef" class="lg:flex gap-4 xl:gap-5 items-start">
      <LandingSidebar class="hidden lg:block sticky top-[80px] grow-0 shrink" />
      <main class="space-y-4 grow shrink-0">
        <UICTabs
          v-model="filtersStore.selectedFilters.sortBy"
          :content="false"
          :items="tabItems"
          class="sort-tabs" :ui="{root:'primary-box sha'}" />
        <div v-if="lawyersRef?.data?.length" class="lawyers-con">
          <NuxtLink
            v-for="lawyer in lawyersRef?.data"
            :key="lawyer.id"
            :to="`/${props.link}${lawyer.id}`">
            <LawyerCard :titlebtn="titlebtn" :lawyer-info="lawyer" />
          </NuxtLink>
        </div>
        <Transition name="fade">
          <LawyerCard
            v-if="staticLawyerInfo && (!lawyersRef?.data?.length || lawyersRef.data == 0)"
            :lawyer-info="staticLawyerInfo"
            :is-empty="true" />
        </Transition>
        <UICPagination
          v-model="currentLawyersPage"
          class="w-fit! mx-auto"
          :total="lawyersRef.meta.total"
          :page-size="lawyersRef.meta.per_page" />
      </main>
    </div>
  </section>
</template>

<script setup>
const filtersStore = useFiltersStore();
const globalStore = useGlobalStore();

const props = defineProps(["link", "titlebtn"]);
const lawyersRef = ref(null);

const staticLawyerInfo = ref(null);
const currentLawyersPage = ref(1);
const lawyersListRef = ref(null);

const tabItems = ref(filtersStore.sortItems);
filtersStore.selectedFilters.sortBy = tabItems.value[0].value;

const lawyerTypes = [...filtersStore.lawyerTypes];
lawyerTypes.unshift({
  id: 0,
  title: "همه",
});
filtersStore.selectedFilters.lawyerType = lawyerTypes[0].id;

const scrollToElement = useScrollToElement(80);

const isFilterChange = ref(false);

onMounted(async () => {
  const res = await fetch("/lawyer-sample.json");
  staticLawyerInfo.value = await res.json();
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

  await fetchLawyers();
});

watch(filtersStore.selectedFilters, async () => {
  console.log("triggered");
  const oldPage = currentLawyersPage.value;
  isFilterChange.value = true;
  currentLawyersPage.value = 1;

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
  const { data } = await useGet({
    url: "lawyers",
    query: {
      page: currentLawyersPage.value,
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
  lawyersRef.value = data;
  if (!useGlobalStore().lawyersCount) {
    useGlobalStore().lawyersCount = data.meta.total;
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
.filters-trigger {
  @apply cursor-pointer flex items-center gap-2 font-semibold lg:hidden;
}
</style>
<style>
@reference "tailwindcss";
.sort-tabs .tabs-list::before {
  @apply hidden sm:block h-full text-sm pe-4 text-[var(--ui-gray)];
  content: "مرتب سازی بر اساس:";
}
.lawyers-con {
  @apply flex flex-col gap-3;
}
</style>
