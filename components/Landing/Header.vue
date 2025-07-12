<template>
  <header>
    <h1 class="header-title">
      مشاوره آنلاین با 48 نفر از بهترین متخصصین وکالت
    </h1>
    <div class="w-full">
      <UInput
        v-model="lawyerNameFilter"
        class="w-full"
        name="laweyerNameFilter"
        placeholder="نام وکیل را وارد کنید"
        :ui="{
          base: 'w-full rounded-full py-3 text-base ring-0 focus-visible:ring-0 ps-[134px]',
          trailing: 'pe-0 m-1',
          leading: 'ps-0 m-1.5',
        }"
      >
        <template #trailing>
          <div class="search-btn">
            <UIcon name="hugeicons:search-02" class="size-5! text-white" />
          </div>
        </template>
        <template #leading>
          <USelectMenu
            v-model="selectedCity"
            class="h-full"
            :ui="{
              base: 'font-semibold text-base rounded-full w-[120px]',
              leadingIcon: 'text-primary size-5!',
              trailingIcon: 'size-4!',
            }"
            :items="cities"
            icon="i-ph-map-pin-duotone"
            :search-input="{
              placeholder: 'جستجو...',
            }"
          />
        </template>
      </UInput>
    </div>
    <div class="space-y-1.5">
      <div class="latest-visit">
        <UIcon name="ic:round-access-alarms" class="size-4!" />
        7 دقیقه پیش
      </div>
      <p class="text-sm">آخرین مشاوره دریافت شده در تخصص ثبت اسناد</p>
    </div>
    <div class="p-2 cursor-pointer flex">
      <UIcon name="proicons:chevron-down" class="size-6!" />
    </div>
  </header>
</template>
<script setup>
const lawyerNameFilter = ref("");
const cities = ref(["ایران", "یزد", "تهران", "اصفهان", "اردبیل", "کرمان"]);
const selectedCity = ref("ایران");
</script>
<style scoped>
@reference "tailwindcss";
header {
  @apply p-5 pt-9 rounded-b-[40px] text-center text-white;
  @apply flex flex-col items-center gap-4;
  background-image: radial-gradient(
    circle 404px at 20.3% 15.9%,
    rgba(0, 79, 255, 1) 0%,
    rgb(0, 183, 255) 90%
  );
}

.header-title {
  @apply text-[24px] md:text-[32px] font-bold pb-2;
}

.search-btn {
  @apply aspect-square h-full bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:opacity-70 transition duration-300;
}

.latest-visit {
  @apply w-max mx-auto p-1 px-1.5 flex items-center gap-1.5 text-sm leading-3 rounded-full border border-dashed border-white;
}
</style>