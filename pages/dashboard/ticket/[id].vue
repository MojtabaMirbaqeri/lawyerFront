<template>
  <div class="relative h-full flex flex-col gap-6 justify-between">
  <!-- بخش پیام‌ها -->
  <div class="flex flex-col gap-3 max-h-[65vh] overflow-y-auto px-5 pb-7">
    <dashboard-messages :items="grouped" />
  </div>

  <!-- بخش ارسال پیام -->
  <div>
    <dashboard-send-ticket />
  </div>
</div>

</template>

<script setup>
console.log(useRoute().params.id);

const res = await useGet({
  url: `tickets/${useRoute().params.id}/messages`,
  includeAuthHeader: true,
});
console.log(res.data.data.data.messages);

const data = ref(res.data.data.data.messages);

// گروه‌بندی بر اساس تاریخ (YYYY-MM-DD)
const grouped = ref(
  Object.values(
    data.value.reduce((acc, item) => {
      const date = item.created_at.split("T")[0]; // فقط تاریخ رو جدا می‌کنیم
      if (!acc[date]) {
        acc[date] = { date, messages: [] };
      }
      acc[date].messages.push(item);
      return acc;
    }, {})
  )
);

console.log(grouped.value);
</script>

<style scoped>
</style>