<template>
  <div
    class="relative ds-table-con h-[100%] flex flex-col gap-6 justify-between"
  >
    <!-- بخش پیام‌ها -->
    <div
      :style="{ height: `calc(77vh - ${useAuthStore().height?.height}px)` }"
      class="flex flex-col gap-3 overflow-y-auto px-5 pb-7"
    >
      <div class="mx-auto py-1.5">{{ res.data.data.data.ticket.title }}</div>
      <dashboard-messages :items="grouped" />
    </div>
    <div>
      <dashboard-send-ticket :status="res.data.data.data.ticket.status.value" @send-ticket="(detail) => sendTicket(detail)" />
    </div>
  </div>
</template>

<script setup>
console.log(useRoute().params.id);

const size = 10 * 1024 * 1024;

const totalSize = ref(0);

const sendTicket = async (detail) => {
  totalSize.value = 0;
  console.log(detail);
  const formData = new FormData();
  if (detail.file) {
    detail.file.map((file) => {
      return (totalSize.value += file.size);
    });
  }
  if (totalSize.value > size) {
    useToast().add({
      title: "حجم فایل ها نباید بیش از 10 مگابایت باشد",
      color: "error",
    });
  }

  if (detail.dis === "" || detail.dis.length < 3 || detail.dis.length > 1000) {
    useToast().add({
      title: "مقدار کامنت نباید کمتر از 3 حرف باشد",
      color: "error",
    });
  } else {
    formData.append("message", detail.dis);
    formData.append("is_internal", 0);
    if(detail.file){
      detail.file.forEach((file) => {
        formData.append("attachments[]", file);
      })
    }

    const res = await usePost({
      url: `tickets/${useRoute().params.id}/messages`,
      includeAuthHeader: true,
      body: formData,
    });

    if (res.statusCode === 200 || res.statusCode === 201) {
      useToast().add({
        title: "تیکت شما با موفقیت ارسال شد",
        color: "success",
      });

      refetch()
    }
  }

  // const formData = new FormData()
};

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

const refetch = async () => {
  const res = await useGet({
    url: `tickets/${useRoute().params.id}/messages`,
    includeAuthHeader: true,
  });
  console.log(res.data.data.data.messages);

  data.value = res.data.data.data.messages;

  // گروه‌بندی بر اساس تاریخ (YYYY-MM-DD)
  grouped.value = Object.values(
    data.value.reduce((acc, item) => {
      const date = item.created_at.split("T")[0]; // فقط تاریخ رو جدا می‌کنیم
      if (!acc[date]) {
        acc[date] = { date, messages: [] };
      }
      acc[date].messages.push(item);
      return acc;
    }, {})
  );
};

console.log(grouped.value);
</script>

<style scoped>
</style>