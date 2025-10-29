<template>
  <UTabs
    v-model="selectedTab"
    color="primary"
    variant="link"
    class="tabs-custom"
    :ui="ui"
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
          <div class="text-box" v-html="item.dis.slice(0, 300)" v-if="showMore === false">
          </div>
          <div v-html="item.dis" class="text-box" v-else>
          </div>
          <div
            class="read-more text-primary cursor-pointer"
            @click="showMore = !showMore"
            v-if="item.dis.length > 300"
          >
          {{ showMore === false ? 'بیشتر' : 'بستن' }}
          </div>
        </div>
      </div>
    </template>
    <template #position="{ item }">
      <div class="w-full h-[300px]">
        <info-lawyer-pos :pos="item.pos" />
      </div>
    </template>
    <template #visit="{ item }">
      <InfoLawyerVisitTima :sch="item.sch" />
    </template>
  </UTabs>
</template>
<script setup>

const showMore = ref(false);

defineProps({
  items: {
    type: Array,
    required: true,
  },
  content: {
    type: Boolean,
  },
  ui:{
    type:Object
  }
});

const selectedTab = defineModel({
  type: String,
});
</script>
<style scoped>
@reference "tailwindcss";
.text-box {
  white-space: pre-line; /* \n تبدیل میشه به اینتر */
}
</style>