<template>
  <div class="">
    <div class="bg-white flex flex-col gap-3 py-4 px-3 rounded-[14px]">
      <div class="top">
        <div class="title flex justify-between items-center">
          <span>انتخاب شیوه ویزیت</span>
          <div
            class="size-[40px] border border-primary rounded-full flex justify-center items-center"
          >
            <UIcon
              name="solar:question-circle-linear"
              class="size-6 text-primary"
            />
          </div>
        </div>
        <!-- <div class="off"></div> -->
      </div>
      <div class="boxes">
        <InfoLawyerVisitBoxes v-model="activeBtn" :items="items" />
      </div>
      <div class="sidebar-btn">
        <div class="choosed-visit flex justify-between">
          <div class="title">{{ items[activeBtn - 1].title }}</div>
          <div class="price">{{ items[activeBtn - 1].price }}</div>
        </div>
        <UICSecondaryBtn
          @click="navigateTo('/reserve/4')"
          class="flex items-center justify-center"
          ><span class="text-center text-base"
            >ادامه فرآیند</span
          ></UICSecondaryBtn
        >
      </div>
    </div>
  </div>
</template>

<script setup>
const items = ref([
  {
    id: "1",
    title: "مشاوره تلفنی",
    price: "360,000",
    icon: "hugeicons:telephone",
  },
  {
    id: "2",
    title: "مشاوره حضوری",
    price: "400,000",
    icon: "hugeicons:building-06",
  },
  {
    id: "3",
    title: "مشاوره متنی",
    price: "250,000",
    icon: "hugeicons:message-multiple-02",
  },
]);

const activeBtn = ref("1");
</script>

<style scoped>
@reference "tailwindcss";

.sidebar-btn {
  @apply fixed lg:shadow-none lg:z-0 shadow-[0_35px_35px_20px_rgba(0,0,0,0.25)] gap-6 rounded-t-[14px] lg:static bottom-0 right-0 mx-auto lg:mx-0 bg-white p-4 z-50 left-0 flex flex-col;
}
</style>