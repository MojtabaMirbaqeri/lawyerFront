<template>
  <section class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
    <div class="border-b border-slate-200/80 bg-slate-50/50 px-4 py-3">
      <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">
        <span class="h-1 w-1 rounded-full bg-primary" />
        انتخاب شیوه مشاوره
      </h2>
    </div>
    <div class="space-y-4 p-4 pb-20 lg:pb-4">
      <InfoLawyerVisitBoxes v-model="activeBtn" :items="items" />
      <div class="sidebar-btn flex flex-col gap-4 p-5 lg:static lg:p-0 lg:gap-3">
        <div class="choosed-visit flex justify-between items-center">
          <span class="text-sm font-medium text-slate-800">{{ items[activeBtn - 1]?.title }}</span>
          <span class="text-sm font-bold text-slate-700">{{ items[activeBtn - 1]?.price }} <span class="font-normal text-slate-400">تومان</span></span>
        </div>
        <UICSecondaryBtn
          :disabled="!props.active"
          @click="
            navigateTo(
              `/reserve/${$route.params.id}?visit_type=${
                items.find((item) => item.id === activeBtn)?.value
              }`
            )
          "
          class="flex items-center justify-center rounded-[8px]!"
        >
          <span class="text-center text-base">ادامه فرآیند</span>
        </UICSecondaryBtn>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(['items','active'])

const activeBtn = ref("0");
</script>

<style scoped>
@reference "tailwindcss";

.sidebar-btn {
  @apply fixed lg:shadow-none lg:z-0 shadow-[0_35px_35px_20px_rgba(0,0,0,0.25)] gap-6 rounded-t-[14px] lg:static bottom-0 right-0 mx-auto lg:mx-0 bg-white z-50 left-0 flex flex-col border-t border-slate-200/80;
}
</style>