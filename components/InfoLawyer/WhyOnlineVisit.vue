<template>
  <section>
    <div class="">
      <h2 class="sec-header">چرا مشاوره آنلاین؟</h2>
      <div class="options flex flex-col gap-3 mt-5">
        <div
          v-for="option in options"
          :key="option"
          class="option flex gap-2 items-center"
        >
          <div class="image w-full max-w-[48px]">
            <NuxtImg
              class="filter-blue w-full"
              :src="`/images/${option.image}`"
              alt=""
            />
          </div>
          <div class="">
            <div class="title text-[14px] md:text-[16px] font-bold">
              {{ option.title }}
            </div>
            <div class="dis text-[12px] md:text-[14px] max-w-[550px]">
              {{ option.dis }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const options = ref([
  {
    id: 1,
    title: "حذف معطلی در دفتر",
    dis: "در مراجعه حضوری به وکیل، معمولاً حداقل یک ساعت باید منتظر رسیدن نوبت بمانید؛ اما با استفاده از مشاوره آنلاین حقوقی، این انتظار حذف شده و در زمان شما صرفه‌جویی می‌شود.",
    image: "Waiting.svg",
  },
  {
    id: 2,
    title: "دسترسی آسان و سریع به وکیل",
    dis: "بدون نیاز به مراجعه حضوری درشرایطی که الزامی به حضور در دفتر وجود ندارد از مشاوره به شیوه دلخواه بهره مند میشوید.",
    image: "Accessibility.svg",
  },
  {
    id: 3,
    title: "پشتیبانی ویژه و سریع",
    dis: "در ۲۴ ساعت روز و ۷ روز هفته، با کمترین زمان انتظار. در صورت عدم رضایت از خدمات ارائه شده در اولین فرصت ممکن بررسی میشود.",
    image: "Supporter.svg",
  },
]);
</script>

<style>
</style>
