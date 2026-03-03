<template>
  <section
    class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
      <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
        <span class="h-1 w-1 rounded-full bg-primary" />
        انتخاب شیوه مشاوره
      </h2>
    </div>
    <div class="space-y-4 p-4 pb-20 lg:pb-4">
      <InfoLawyerVisitBoxes v-model="activeBtn" :items="items" />
      <div class="sidebar-btn mb-[88px] flex-col gap-4 p-5 lg:static lg:p-0 lg:gap-3">
        <!-- <div class="choosed-visit flex justify-between items-center">
          <span class="text-sm font-medium text-slate-800">{{
            items[activeBtn - 1]?.title
          }}</span>
          <span class="text-sm font-bold text-slate-700"
            >{{ items[activeBtn - 1]?.price }}
            <span class="font-normal text-slate-400">تومان</span></span
          >
        </div> -->
        <div class="flex flex-col gap-2.5">
          <template v-if="canReserve">
            <NuxtLink
              :to="{
                path: `/reserve/${$route.params.id}`,
                query: {
                  visit_type: selectedVisitType,
                },
              }"
              class="flex items-center justify-center rounded-[8px] gap-2 py-3 px-4 font-medium text-white bg-primary hover:opacity-90 transition-opacity">
              <Icon name="lucide:calendar-plus" class="w-5 h-5" />
              <span class="text-center text-base">رزرو نوبت</span>
            </NuxtLink>
          </template>
          <template v-else>
            <div
              class="flex items-center justify-center rounded-[8px] gap-2 py-3 px-4 font-medium text-slate-500 bg-slate-100 cursor-not-allowed"
              :title="reserveDisabledMessage">
              <Icon name="lucide:calendar-x" class="w-5 h-5" />
              <span class="text-center text-base">رزرو نوبت</span>
            </div>
            <p class="text-xs text-slate-500 text-center">{{ reserveDisabledMessage }}</p>
          </template>
          <DirectCall :phone="phoneNumber" :lawyer-id="lawyerId" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  phoneNumber: { type: String, default: "" },
  lawyerId: { type: [Number, String], default: null },
  /** وقتی وکیل برای هیچ نوع مشاوره ساعت کاری تنظیم نکرده باشد false است */
  hasWorkingHours: { type: Boolean, default: false },
});

const activeBtn = ref("0");

/** پیش‌فرض: اولین نوع مشاوره که ساعت کاری دارد انتخاب شود */
watch(
  () => props.items,
  (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    const firstActive = items.find((i) => i.active === true);
    if (firstActive && activeBtn.value === "0") {
      activeBtn.value = firstActive.id;
    }
  },
  { immediate: true }
);

const selectedItem = computed(() =>
  props.items.find((item) => item.id === activeBtn.value)
);

const selectedVisitType = computed(
  () => selectedItem.value?.value || "inperson"
);

/** فقط در صورت وجود ساعت کاری و فعال بودن نوع مشاوره انتخاب‌شده امکان رزرو هست */
const canReserve = computed(() => {
  if (!props.hasWorkingHours) return false;
  return selectedItem.value?.active === true;
});

const reserveDisabledMessage = computed(() => {
  if (!props.hasWorkingHours) return "وکیل ساعت کاری مشخص نکرده است.";
  if (!selectedItem.value?.active) return "وکیل برای این نوع مشاوره ساعت کاری مشخص نکرده است.";
  return "";
});
</script>

<style scoped>
@reference "tailwindcss";

.sidebar-btn {
  @apply fixed lg:shadow-none lg:z-0 shadow-[0_35px_35px_20px_rgba(0,0,0,0.25)] gap-6 rounded-t-[14px] lg:static bottom-0 right-0 mx-auto lg:mx-0 bg-white z-50 left-0 flex flex-col border-t border-slate-200/80;
}
</style>
