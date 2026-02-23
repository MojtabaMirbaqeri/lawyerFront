<template>
  <section>
    <div class="">
      <ClientOnly>
        <UICTabs
          class="lg:w-[601px] xl:w-[683px] primary-box shadow-none"
          :content="true"
          v-model="setdef"
          :items="items"
          :ui="{ trigger:'shrink-0' }"
        />
        <template #fallback>
          <div class="lg:w-[601px] xl:w-[683px] primary-box shadow-none">
            <div class="relative flex p-1 border-b border-default py-1.5 -mb-px">
              <span
                v-for="item in items"
                :key="item.value"
                class="px-3 py-1.5 text-sm font-semibold shrink-0"
              >
                {{ item.label }}
              </span>
            </div>
            <div class="p-4" v-html="newDis" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["dis", "pos", "sch"]);
const newDis = ref('')

if (props.dis) {
  newDis.value = props.dis
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/\r/g, "\n") // CR → LF
    .replace(/\n/g, "<br/>");
}

const items = ref([
  {
    label: "درباره من",
    value: "about",
    dis: newDis.value,
    iconTr: "hugeicons:user-account",
    slot: "about",
  },
  {
    label: "موقعیت وکیل",
    value: "position",
    slot: "position",
    pos: props.pos,
  },
  {
    label: "زمان مشاوره",
    value: "visit",
    slot: "visit",
    sch: props.sch,
  },
]);

const setdef = ref(items.value[0].value);
</script>

<style>
</style>