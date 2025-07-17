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
                    type.id == selectedLawyerType,
                }"
                @click="selectedLawyerType = type.id"
              >
                {{ type.title }}
                <UIcon name="proicons:chevron-left" class="ms-auto" />
              </div>
            </div>
          </template>
        </UICDrawer>
        <UICSelectButton
          v-model="selectedLawyerType"
          :items="lawyerTypes.slice(0, 6)"
        />
      </div>
      <UICDrawer
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
        <div class="lawyers-con">
          <NuxtLink v-for="i in 15" :key="i" to="/lawyer/5">
            <LawyerCard />
          </NuxtLink>
        </div>
        <UICPagination class="w-fit! mx-auto" />
      </main>
    </div>
  </section>
</template>
<script setup>
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

const lawyerTypes = [
  { title: "همه", id: "all" },
  { title: "وکیل پایه یک دادگستری", id: "1" },
  { title: "وکیل پایه دو دادگستری", id: "2" },
  { title: "کارآموز وکالت", id: "3" },
  { title: "وکیل تسخیری", id: "4" },
  { title: "وکیل معاضدتی", id: "5" },
  { title: "وکیل اتفاقی", id: "6" },
  { title: "وکیل موضوع ماده 187", id: "7" },
];

const selectedLawyerType = ref(lawyerTypes[0].id);
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