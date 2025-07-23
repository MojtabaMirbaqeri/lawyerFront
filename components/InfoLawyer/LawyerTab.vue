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
const props = defineProps(['dis','pos',])
const items = ref([
  {
    label: "درباره من",
    value: "about",
    dis:props.dis ,
    iconTr: "hugeicons:user-account",
    slot: "about",
  },
  {
    label: "موقعیت وکیل",
    value: "position",
    slot: "position",
    pos:props.pos
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