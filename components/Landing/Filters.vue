<template>
  <div class="filters-con">
    <div class="header py-2.5 bg-gray-100 px-1.5 rounded-md">
      <UIcon name="system-uicons:filtering" class="size-6! text-primary" />
      <h3>فیلتر ها</h3>
    </div>
    <div class="body">
      <div>
        <h3>شیوه ویزیت</h3>
        <div>
          <UICSelectButton
            v-model="filtersVal.visitType"
            :items="filtersItems.visitTypes"
            :multiple="true"
          />
        </div>
      </div>
      <div>
        <h3>جنسیت وکیل</h3>
        <div>
          <UICSelectButton
            v-model="filtersVal.gender"
            :items="filtersItems.genders"
          />
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <h3>تخصص ها</h3>
          <div>
            <UICSelectButton
              v-model="filtersVal.lawyerSpecialty"
              :items="filtersItems.specialties.slice(0, 5)"
            />
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium! ps-2">- سایر تخصص ها</h3>
          <div>
            <USelectMenu
              v-model="filtersVal.lawyerSpecialty"
              :items="filtersItems.specialties"
              value-key="id"
              label-key="title"
              :ui="{
                base: ' rounded-full w-full py-2 cursor-pointer',
                leadingIcon: 'text-primary size-5!',
                trailingIcon: 'size-5!',
              }"
              placeholder="تخصص مورد نظر خود را انتخاب کنید"
              icon="hugeicons:target-02"
              :search-input="{
                placeholder: 'جستجو...',
              }"
            />
          </div>
        </div>
      </div>
      <div class="pb-0!">
        <UICSecondaryBtn
          :disabled="!haveFiltersChanged"
          class="w-full rounded-lg! py-2.5!"
          @click="applyFilters()"
        >
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

const applyFilters = () => {
  filtersStore.applyFilters(filtersVal);
  filtersStore.drawerVisiblity = false;
};
</script>
<style scoped>
@reference "tailwindcss";
.filters-con .body {
  @apply divide-y divide-gray-300;
}
.filters-con .header {
  @apply flex items-center gap-2;
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