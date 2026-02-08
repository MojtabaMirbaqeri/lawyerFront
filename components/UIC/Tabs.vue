<template>
  <UTabs
    v-model="selectedTab"
    color="amber"
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
          <div class="text-box" v-html="removePhoneNumbers(item.dis.slice(0, 300))" v-if="showMore === false">
          </div>
          <div v-html="removePhoneNumbers(item.dis)" class="text-box" v-else>
          </div>
          <div
            class="read-more text-[#1e3a5f] cursor-pointer"
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

// تابع برای حذف شماره موبایل از متن
const removePhoneNumbers = (text) => {
  if (!text) return text;
  // حذف شماره موبایل با فرمت 09xxx (09 به دنبال 8 یا 9 رقم)
  return text.replace(/09\d{8,9}/g, '');
};
</script>
<style scoped>
@reference "tailwindcss";
.text-box {
  white-space: pre-line; /* \n تبدیل میشه به اینتر */
}
</style>