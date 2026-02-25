<template>
  <section>
    <div class="">
      <UICTabs
        class="lg:w-[601px] xl:w-[683px] primary-box shadow-none"
        :content="true"
        v-model="setdef"
        :items="items"
        :ui="{ trigger:'shrink-0' }"
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["dis", "pos", "sch", "lawyerId", "lawyerFullName", "initialReviews", "initialReviewsLastPage"]);
const newDis = ref('')

if (props.dis) {
  newDis.value = props.dis
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/\r/g, "\n") // CR → LF
    .replace(/\n/g, "<br/>");
}

const items = computed(() => [
  {
    label: "درباره من",
    value: "about",
    dis: newDis.value,
    iconTr: "hugeicons:user-account",
    slot: "about",
  },
  {
    label: "زمان مشاوره",
    value: "visit",
    slot: "visit",
    sch: props.sch,
  },
  {
    label: "دیدگاه‌ها",
    value: "comment",
    slot: "comment",
    lawyerId: props.lawyerId,
    lawyerFullName: props.lawyerFullName,
    initialReviews: props.initialReviews,
    initialReviewsLastPage: props.initialReviewsLastPage,
  },
]);

const setdef = ref(items.value[0].value);
</script>

<style>
</style>