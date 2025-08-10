<template>
  <UTabs
    v-model="selectedTab"
    color="primary"
    variant="link"
    :content="content"
    :items="items"
  >
    <template #about="{ item }">
      <div class="flex-col flex gap-3">
        <div class="label flex items-center gap-2">
          <UIcon :name="item.iconTr" />
          <span>{{ item.label }}</span>
        </div>
        <div class="dis text-justify whitespace-break-spaces">
          {{ item.dis }}
        </div>
      </div>
    </template>
    <template #position="{ item }">
      <div class="w-full h-[300px]">
        <info-lawyer-pos :pos="item.pos" />
      </div>
    </template>
    <template #visit="{ item }">
      <InfoLawyerVisitTima :sch="item.sch"/>
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
