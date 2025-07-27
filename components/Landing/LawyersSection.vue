<template>
  <section class="space-y-4">
    <div class="space-y-4 xl:space-y-5">
      <div class="space-y-4">
        <UICDrawer
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
        </UICDrawer>
        <UICSelectButton
          v-model="filtersStore.selectedFilters.lawyerType"
          :items="lawyerTypes.slice(0, 6)"
        />
      </div>
      <UICDrawer
        v-model="filtersStore.drawerVisiblity"
        title="filters"
        description="filter laywers"
        class="overflow-y-auto!"
      >
        <template #button>
          <div class="filters-trigger primary-box">
            <UIcon
              name="system-uicons:filtering"
              class="size-6! text-primary"
            />
            فیلتر ها
            <UIcon name="proicons:chevron-left" class="ms-auto" />
          </div>
        </template>
        <template #default><LandingFilters /></template>
      </UICDrawer>
    </div>
    <div class="lg:flex gap-4 xl:gap-5 items-start">
      <LandingSidebar class="hidden lg:block sticky top-[90px]" />
      <main class="space-y-4 grow">
        <UICTabs
          v-model="selectedTab"
          :content="false"
          :items="tabItems"
          class="sort-tabs"
        />
        <div ref="lawyersListRef" class="lawyers-con">
          <NuxtLink
            v-for="lawyer in lawyersRef.data"
            :key="lawyer.id"
            :to="`/lawyer/${lawyer.id}`"
          >
            <LawyerCard :lawyer-info="lawyer" />
          </NuxtLink>
        </div>
        <UICPagination
          v-model="currentLawyersPage"
          class="w-fit! mx-auto"
          :total="lawyersRef.meta.total"
          :page-size="lawyersRef.meta.per_page"
        />
      </main>
    </div>
  </section>
</template>
<script setup>
import { useFiltersStore } from "~/store/filters";
const filtersStore = useFiltersStore();

const { data: lawyers } = await useGet({
  url: "lawyers",
});
const lawyersRef = ref(lawyers);
const scrollToElement = useScrollToElement();

const currentLawyersPage = ref(1);
const lawyersListRef = ref(null);

watch(currentLawyersPage, async (page) => {
  lawyersRef.value = (
    await useGet({
      url: "lawyers",
      query: {
        page: page,
        base_id: filtersStore.selectedFilters.lawyerType,
      },
    })
  ).data;

  nextTick(() => {
    if (lawyersListRef.value) {
      scrollToElement(lawyersListRef.value);
    }
  });
});

const tabItems = ref([
  {
    label: "پیش فرض",
    value: "default",
  },
  {
    label: "بالاترین تجربه",
    value: "experience",
  },
  {
    label: "بیشترین امتیاز",
    value: "score",
  },
]);

const selectedTab = ref(tabItems.value[0].value);

const lawyerTypes = filtersStore.lawyerTypes;
watch(filtersStore.selectedFilters, async (filters) => {
  console.log(filters);
  lawyersRef.value = (
    await useGet({
      url: "lawyers",
      query: {
        page: currentLawyersPage.value,
        base_id: filters.lawyerType,
        specialty_id: filters.lawyerSpecialty,
        gender: filters.gender,
      },
    })
  ).data;
  currentLawyersPage.value = 1;
  scrollToElement(lawyersListRef.value);
});
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