<template>
  <div class="filters-con">
    <div class="header">
      <UIcon name="system-uicons:filtering" class="size-6! text-primary" />
      <h3>فیلتر ها</h3>
      <Transition name="page">
        <div
          v-if="filtersStore.hasActiveFilters"
          class="text-blue-500 ms-auto me-1.5 cursor-pointer hover:text-blue-700 transition-colors"
          @click="clearAllFilters">
          پاکسازی فیلتر ها
        </div>
      </Transition>
    </div>
    <div class="body">
      <div>
        <h3>شیوه مشاوره</h3>
        <div>
          <UICSelectButton
            v-model="filtersVal.visitType"
            :items="filtersItems.visitTypes"
            :multiple="true" />
        </div>
      </div>
      <div>
        <h3>جنسیت وکیل</h3>
        <div>
          <UICSelectButton
            v-model="filtersVal.gender"
            :items="filtersItems.genders"
            :clearable="true" />
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <h3>تخصص ها</h3>
          <div>
            <USelectMenu
              v-model="filtersVal.lawyerSpecialty"
              :items="filtersItems.specialties"
              :multiple="true"
              value-key="id"
              label-key="title"
              :ui="{
                base: ' rounded-full w-full py-2.5 cursor-pointer',
                leadingIcon: 'text-primary size-5!',
                trailingIcon: 'size-5!',
              }"
              placeholder="تخصص مورد نظر خود را انتخاب کنید"
              icon="hugeicons:target-02"
              :search-input="{
                placeholder: 'جستجو...',
              }" />
          </div>
        </div>

        <!-- تخصص های انتخاب شده -->
        <div v-if="filtersVal.lawyerSpecialty?.length">
          <h3 class="text-sm font-medium! ps-2">- تخصص های انتخاب شده</h3>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="id in filtersVal.lawyerSpecialty"
              :key="id"
              class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-blue-200"
              @click="removeSpecialty(id)">
              <UIcon name="hugeicons:cancel-01" class="size-4.5!" />
              <span>
                {{ filtersItems.specialties.find((s) => s.id === id)?.title }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div class="pb-0!">
        <UICSecondaryBtn
          :disabled="!haveFiltersChanged"
          class="w-full rounded-lg! py-2.5! font-semibold"
          @click="applyFilters()">
          اعمال فیلترها
        </UICSecondaryBtn>
      </div>
    </div>
  </div>
</template>
<script setup>
const filtersStore = useFiltersStore();

const filtersItems = {
  visitTypes: filtersStore.visitTypes,
  genders: filtersStore.genders,
  specialties: filtersStore.lawyerSpecialties,
};

const filtersVal = reactive({
  visitType: filtersStore.selectedFilters.visitType,
  gender: filtersStore.selectedFilters.gender,
  lawyerSpecialty: filtersStore.selectedFilters.lawyerSpecialty,
});

const haveFiltersChanged = computed(() => {
  return (
    JSON.stringify(filtersVal.visitType) !==
      JSON.stringify(filtersStore.selectedFilters.visitType) ||
    filtersVal.gender !== filtersStore.selectedFilters.gender ||
    filtersVal.lawyerSpecialty !== filtersStore.selectedFilters.lawyerSpecialty
  );
});

// const hasActiveFilters = computed(() => {
//   return (
//     filtersVal.visitType?.length > 0 ||
//     filtersVal.gender !== null ||
//     filtersVal.lawyerSpecialty?.length > 0 ||
//     filtersStore.selectedFilters.searchField ||
//     filtersStore.selectedFilters.city ||
//     filtersStore.selectedFilters.province != 0
//   );
// });

const removeSpecialty = (id) => {
  filtersVal.lawyerSpecialty = filtersVal.lawyerSpecialty.filter((s) => s !== id);
};

const applyFilters = () => {
  filtersStore.applyFilters(filtersVal);
  filtersStore.drawerVisiblity = false;
};

const clearAllFilters = () => {
  // پاکسازی فیلترهای محلی
  filtersVal.visitType = [];
  filtersVal.gender = null;
  filtersVal.lawyerSpecialty = null;

  // پاکسازی فیلترهای store
  filtersStore.clearFilters();

  // بستن drawer
  filtersStore.drawerVisiblity = false;
};
</script>
<style scoped>
@reference "tailwindcss";
.filters-con .body {
  @apply divide-y divide-gray-300;
}
.filters-con .header {
  @apply flex items-center gap-2 py-2.5 bg-gray-100 px-1.5 rounded-md;
}
.filters-con .body > div {
  @apply py-4;
}
.filters-con h3 {
  @apply font-semibold text-black;
}
.filters-con .body h3 {
  @apply mb-1.5;
}
</style>
