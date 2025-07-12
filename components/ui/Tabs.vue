<template>
  <UTabs
    v-model="selectedTab"
    color="primary"
    variant="link"
    :content="content"
    :items="items"
    :ui="{
      list: `tabs-list primary-box overflow-hidden border-b-0 justify-center sm:justify-start sm:px-4 items-center py-1.5`,
      indicator: 'h-1.5 bottom-auto bottom-[-2px] ',
      trigger: 'font-semibold cursor-pointer',
    }"
  >
    <template #content>
      <slot name="content" />
    </template>
  </UTabs>
</template>
<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  content: {
    type: Boolean,
  },
});
const selectedTab = defineModel({ type: String });
</script>
<style>
@reference "tailwindcss";
.tabs-list::before {
  @apply hidden sm:block h-full text-sm pe-4 text-[var(--ui-gray)];
  content: "مرتب سازی بر اساس:";
}
</style>