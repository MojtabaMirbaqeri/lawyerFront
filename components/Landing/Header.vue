<template>
  <header>
    <h1 class="text-[24px] md:text-[32px] font-bold">
      مشاوره آنلاین با 48 نفر از بهترین متخصصین وکالت
    </h1>
    <p>آخرین مشاوره دریافت شده در تخصص ثبت اسناد</p>
    <div class="p-2 cursor-pointer flex">
      <UIcon name="proicons:chevron-down" class="size-6!" />
    </div>
  </header>
</template>
<script setup>
</script>
<style scoped>
@reference "tailwindcss";
header {
  @apply p-4 pt-9 rounded-b-[40px] text-center text-white;
  @apply flex flex-col items-center;
  background-image: radial-gradient(
    circle 404px at 20.3% 15.9%,
    rgba(0, 79, 255, 1) 0%,
    rgb(0, 183, 255) 90%
  );
}
</style>