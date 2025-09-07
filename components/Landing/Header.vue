<template>
  <header>
    <div class="container">
      <h1 class="header-title">
        مشاوره آنلاین با
        <ClientOnly>{{ useGlobalStore()?.lawyersCount }}</ClientOnly> نفر از
        بهترین متخصصین وکالت
      </h1>
      <div class="w-full">
        <UInput
          v-model="lawyerNameFilter"
          class="w-full"
          name="laweyerNameFilter"
          placeholder="نام وکیل را وارد کنید"
          :ui="{
            base: 'w-full rounded-full py-3 md:text-base  ring-0 focus-visible:ring-0 ps-[134px] sm:ps-[178px]',
            trailing: 'pe-0 m-1',
            leading: 'ps-0 m-1.5',
          }"
          @keydown.enter="search"
        >
          <template #trailing>
            <div class="search-btn" @click="search">
              <UIcon name="hugeicons:search-02" class="size-5! text-white" />
            </div>
          </template>
          <template #leading>
            <USelectMenu
              v-model="useFiltersStore().selectedFilters.city"
              class="h-full"
              :ui="{
                base: 'font-semibold text-xs sm:text-sm rounded-full w-[120px] sm:w-[160px]',
                itemLabel: 'text-[13px]! sm:text-sm!',
                leadingIcon: 'text-primary size-5!',
                trailingIcon: 'size-4!',
              }"
              :items="provinces"
              value-key="id"
              label-key="name"
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
      <div
        class="p-2 cursor-pointer flex custom-bounce"
        @click="$emit('scrollToLawyers')"
      >
        <UIcon name="proicons:chevron-down" class="size-6!" />
      </div>
    </div>
  </header>
</template>
<script setup>
defineEmits(["scrollToLawyers"]);
const provinces = ref(null);
onMounted(async () => {
  const provincesRes = await fetch("/provinces.json");
  provinces.value = await provincesRes.json();
  provinces.value.unshift({
    id: 0,
    name: "ایران",
  });
  useFiltersStore().selectedFilters.city = provinces.value[0].id;
});

const lawyerNameFilter = ref("");
const search = () => {
  useFiltersStore().selectedFilters.searchField = lawyerNameFilter.value;
};
</script>
<style scoped>
@reference "tailwindcss";
header {
  @apply p-5 px-1 pt-9 rounded-b-[40px] text-center text-white;
  background-image: radial-gradient(
    circle 404px at 20.3% 15.9%,
    rgba(0, 79, 255, 1) 0%,
    rgb(0, 183, 255) 90%
  );
}

.container {
  @apply flex flex-col items-center gap-4 max-w-3xl;
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

@keyframes bounce-custom {
  0%,
  100% {
    transform: translateY(-6px);
  }
  50% {
    transform: translateY(6px);
  }
}

.custom-bounce {
  animation: bounce-custom 2s infinite;
}
</style>