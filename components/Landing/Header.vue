<template>
  <header>
    <div class="container">
      <h1 class="header-title">
        مشاوره آنلاین با
        <ClientOnly>{{ useGlobalStore()?.lawyersCount?.toLocaleString() }}</ClientOnly>
        نفر از بهترین متخصصین وکالت
      </h1>
      <div class="w-full">
        <div class="relative z-50" ref="searchWrapper">
          <UInput
            v-model="lawyerNameFilter"
            class="w-full relative z-10"
            name="laweyerNameFilter"
            placeholder="جست و جوی وکلا"
            :ui="{
              base: 'w-full rounded-full border border-gray-200 py-3 md:text-base  ring-0 focus-visible:ring-0 ps-[134px] sm:ps-[178px]',
              trailing: 'pe-0 m-1',
              leading: 'ps-0 m-1.5',
            }"
            @keydown.enter="search"
            @focus="handleFocus">
            <template #trailing>
              <div class="search-btn" @click="search">
                <UIcon name="hugeicons:search-02" class="size-5! text-white" />
              </div>
            </template>
            <template #leading>
              <USelectMenu
                v-model="filtersStore.selectedFilters.province"
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
                }" />
            </template>
          </UInput>

          <!-- Suggest Box -->
          <Transition name="fade">
            <div v-if="showSuggestBox" class="suggest-box text-secondary">
              <!-- Loader -->
              <div v-if="loading" class="space-y-2">
                <USkeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-xl" />
              </div>

              <!-- Lawyers list -->
              <div
                v-else-if="lawyers?.length"
                class="max-h-72 overflow-y-auto flex flex-col gap-2">
                <NuxtLink
                  v-for="lawyer in lawyers"
                  :key="lawyer.id"
                  :to="`/lawyer/${lawyer.id}`">
                  <LawyerProfile
                    class="border border-gray-200 p-3 rounded-xl"
                    :information="{
                      ...lawyer,
                      lawyer_info: {
                        name: lawyer.name,
                        family: lawyer.family,
                        profile_image: lawyer.profile_image,
                      },
                    }"
                    :show="true"
                    :show-experience="false"
                    :ui="{
                      base: 'items-start! w-full!',
                      avatar: 'size-14! lg:size-16!',
                      name: 'justify-between!',
                    }">
                    <template #badges>
                      <UICBadge
                        variant="yellow"
                        icon-size="size-4! lg:size-5!"
                        :value="Number(lawyer.average_rating).toFixed(1)"
                        icon="ic:round-star" />
                    </template>
                  </LawyerProfile>
                </NuxtLink>
              </div>
              <div
                v-else
                class="flex items-center gap-2 p-4 justify-center border border-gray-200 rounded-xl bg-gray-50">
                <UIcon
                  name="hugeicons:information-diamond"
                  class="align-middle size-6!" />
                <h1 class="font-semibold text-lg">وکیلی یافت نشد</h1>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="space-y-1.5">
        <div class="latest-visit">
          <UIcon name="ic:round-access-alarms" class="size-4!" />
          7 دقیقه پیش
        </div>
        <p class="text-sm">آخرین مشاوره دریافت شده در تخصص ثبت اسناد</p>
      </div>
      <div class="p-2 cursor-pointer flex custom-bounce" @click="navigateTo('#lawyers')">
        <UIcon name="proicons:chevron-down" class="size-6!" />
      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(["scrollToLawyers"]);
const filtersStore = useFiltersStore();

const provinces = ref(null);
onMounted(async () => {
  const provincesRes = await fetch("/provinces.json");
  provinces.value = await provincesRes.json();
  provinces.value.unshift({
    id: 0,
    name: "ایران",
  });
  filtersStore.selectedFilters.province = provinces.value[0].id;

  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const lawyerNameFilter = ref(filtersStore.selectedFilters.searchField || "");

// این رو اضافه کن
watch(
  () => filtersStore.selectedFilters.searchField,
  (newValue) => {
    lawyerNameFilter.value = newValue || "";
  }
);
const searchWrapper = ref(null);
const showSuggestBox = ref(false);
const loading = ref(false);
const lawyers = ref([]);

// Debounced search function
let searchTimeout = null;

const performSearch = async (searchQuery) => {
  if (searchQuery.length >= 3) {
    showSuggestBox.value = true;
    loading.value = true;

    try {
      const { data, status } = await useGet({
        url: "lawyer-search/suggestions",
        query: {
          query: searchQuery,
          per_page: 5,
        },
      });

      if (status && data.data.data?.lawyers) {
        lawyers.value = data.data.data.lawyers;
        console.log(lawyers.value);
      } else {
        lawyers.value = [];
      }
    } catch (error) {
      lawyers.value = [];
      console.error("Search error:", error);
    } finally {
      loading.value = false;
    }
  } else {
    showSuggestBox.value = false;
    lawyers.value = [];
  }
};

watch(lawyerNameFilter, (val) => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Set new timeout for debounce (500ms delay)
  searchTimeout = setTimeout(() => {
    performSearch(val);
  }, 800);
});

const search = () => {
  filtersStore.selectedFilters.searchField = lawyerNameFilter.value;
  showSuggestBox.value = false;
};

const handleClickOutside = (e) => {
  if (searchWrapper.value && !searchWrapper.value.contains(e.target)) {
    showSuggestBox.value = false;
  }
};

const handleFocus = () => {
  if (lawyerNameFilter.value.length >= 3) {
    showSuggestBox.value = true;
  }
};

// Clean up timeout on component unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
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

.suggest-box {
  @apply absolute top-1/2 start-0 w-full p-3 rounded-b-xl bg-white border border-gray-200 flex flex-col gap-2 pt-10 text-start shadow-lg;
}
</style>
