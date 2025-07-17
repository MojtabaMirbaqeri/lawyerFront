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
              v-model="filtersVal.specialty"
              :items="filtersItems.specialties.slice(0, 5)"
            />
          </div>
        </div>
        <div>
          <h3 class="text-sm font-medium! ps-2">- سایر تخصص ها</h3>
          <div>
            <USelectMenu
              v-model="filtersVal.specialty"
              :items="filtersItems.specialties"
              value-key="id"
              label-key="title"
              :ui="{
                base: 'text-base rounded-full w-full py-2 cursor-pointer',
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
    </div>
  </div>
</template>
<script setup>
const filtersItems = {
  visitTypes: [
    {
      title: "تلفنی",
      id: "phone",
      icon: "hugeicons:telephone",
    },
    {
      title: "متنی",
      id: "chat",
      icon: "hugeicons:message-multiple-02",
    },
    {
      title: "حضوری",
      id: "inperson",
      icon: "hugeicons:building-06",
    },
  ],
  genders: [
    { title: "مرد", id: "male", icon: "hugeicons:male-02" },
    {
      title: "زن",
      id: "female",
      icon: "hugeicons:female-02",
    },
  ],
  types: [
    {
      id: 0,
      title: "همه",
    },
    {
      id: 1,
      title: "وکیل پایه یک دادگستری",
    },
    {
      id: 2,
      title: "وکیل پایه دو دادگستری",
    },
    {
      id: 3,
      title: "کارآموز وکالت",
    },
    {
      id: 4,
      title: "وکیل تسخیری",
    },
    {
      id: 5,
      title: "وکیل معاضدتی",
    },
    {
      id: 6,
      title: "وکیل اتفاقی",
    },
    {
      id: 7,
      title: "وکیل موضوع ماده 187",
    },
  ],
  specialties: [
    {
      id: 1,
      title: "وکیل ثبت احوال",
    },
    {
      id: 2,
      title: "وکیل بیمه",
    },
    {
      id: 3,
      title: "وکیل ملکی",
    },
    {
      id: 4,
      title: "وکیل مالیات",
    },
    {
      id: 5,
      title: "وکیل شرکت ها",
    },
    {
      id: 6,
      title: "وکیل انحصار وراثت",
    },
    {
      id: 7,
      title: "وکیل دیوان عدالت اداری",
    },
    {
      id: 8,
      title: "وکیل خانواده",
    },
    {
      id: 9,
      title: "وکیل وصول مطالبات",
    },
    {
      id: 10,
      title: "وکیل قراردادها",
    },
    {
      id: 11,
      title: "وکیل جرایم اینترنتی",
    },
    {
      id: 12,
      title: "وکیل اداره کار",
    },
    {
      id: 13,
      title: "وکیل بین الملل",
    },
    {
      id: 14,
      title: "وکیل مالکیت معنوی",
    },
    {
      id: 15,
      title: "وکیل کیفری (جرایم)",
    },
    {
      id: 16,
      title: "وکیل اجرای احکام",
    },
    {
      id: 17,
      title: "وکیل جرایم علیه اشخاص",
    },
    {
      id: 18,
      title: "وکیل جرایم علیه اموال",
    },
    {
      id: 19,
      title: "وکیل جرایم علیه امنیت کشور",
    },
    {
      id: 20,
      title: "وکیل اموال و مالکیت",
    },
    {
      id: 21,
      title: "وکیل ثبت اسناد",
    },
    {
      id: 22,
      title: "وکیل داوری",
    },
    {
      id: 23,
      title: "وکیل سربازی و نظام وظیفه",
    },
  ],
};
const filtersVal = reactive({
  visitType: null,
  gender: null,
  specialty: null,
});
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