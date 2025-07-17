<template>
  <section>
    <div class="">
      <UICTabs
        class="lg:w-[601px] xl:w-[683px]"
        :content="true"
        v-model="setdef"
        :items="items"
      />
    </div>
  </section>
</template>

<script setup>
const items = ref([
  {
    label: "درباره من",
    value: "about",
    dis: `با سلام بنده مسلم هادلی هستم  دکترای روانشناسی سلامت، افتخار همکاری با شبکه دو سیما و شبکه های اجتماعی فراملیتی، مسلط به زبان فارسی و ترکی ، تسلط به قوانین و فرهنگ خانوادگی کشورهای اروپایی، 
حوزه فعالیت تخصصی: مداخله در بحرانهای خانوادگی (خیانت در روابط زوجین، خیانت در روابط بین فردی با پارتنر و یا دوستان از جنس مخالف، سکسو تراپی و مشکلات جنسی)، مشاوره پیش از ازدواج و طلاق، درمان اختلالات خلقی، افسردگی، اختلال دو قطبی، اضطراب و استرس، وسواس و...`,
    iconTr: "hugeicons:user-account",
    slot: "about",
  },
  {
    label: "موقعیت ویکیل",
    value: "position",
    slot: "position",
  },
  {
    label: "زمان مشاوره",
    value: "visit",
    slot: "visit",
  },
]);

const setdef = ref(items.value[0].value);
</script>

<style>
</style>