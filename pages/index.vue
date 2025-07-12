<template>
  <main>
    <LandingHeader />
    <UIBreadCrumb
      :items="[
        {
          label: 'خانه',
          to: '/',
        },
      ]"
    />
    <div class="container pt-0">
      <LandingFilters />
      <main class="space-y-4">
        <div class="space-y-4">
          <UISecondaryBtn>
            مشاهده همه <UIcon name="proicons:chevron-left" />
          </UISecondaryBtn>
          <UISelectButton v-model="testVal" :items="testItems" />
        </div>
        <div class="filters-trigger primary-box">
          <UIcon name="system-uicons:filtering" class="size-6! text-primary" />
          فیلتر ها
          <UIcon name="proicons:chevron-left" class="ms-auto" />
        </div>
        <UITabs v-model="selectedTab" :content="false" :items="tabItems" />
      </main>
    </div>
  </main>
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

const testItems = [
  { label: "همه", value: "all" },
  { label: "وکیل پایه یک دادگستری", value: "1" },
  { label: "وکیل پایه دو دادگستری", value: "2" },
  { label: "کارآموز وکالت", value: "3" },
  { label: "وکیل تسخیری", value: "4" },
  { label: "وکیل معاضدتی", value: "5" },
  { label: "وکیل اتفاقی", value: "6" },
  { label: "وکیل موضوع ماده 187", value: "7" },
];

const testVal = ref(testItems[0].value);
</script>
<style scoped>
@reference "tailwindcss";
.filters-trigger {
  @apply cursor-pointer flex items-center gap-2 font-semibold;
}
</style>
