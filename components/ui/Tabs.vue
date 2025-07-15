<template>
  <UTabs
    v-model="selectedTab"
    color="primary"
    variant="link"
    :content="content"
    :items="items"
    :ui="{
      root: 'primary-box sm:px-4 py-0',
      list: `tabs-list overflow-hidden border-b-0 justify-center py-1.5 sm:justify-start  items-center `,
      indicator: 'h-1.5 bottom-auto bottom-[-2px] ',
      trigger: 'font-semibold cursor-pointer',
      content: 'py-4',
    }"
  >
    <template #about="{ item }">
      <div class="flex-col flex gap-3">
        <div class="label flex items-center gap-2">
          <UIcon :name="item.iconTr" />
          <span>{{ item.label }}</span>
        </div>
        <div class="dis text-justify">{{ item.dis }}</div>
      </div>
    </template>
    <template #position="{ item }">
      <div class="w-full h-[300px]">
        <info-lawyer-pos :pos="[31.8900648, 54.3441156]"/>
      </div>
    </template>
    <template #visit="{ item }">
      <InfoLawyerVisitTima/>
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

const selectedTab = defineModel({
  type: String,
});

</script>
