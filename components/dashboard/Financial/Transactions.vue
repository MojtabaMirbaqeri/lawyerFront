<template>
  <div>
    <div v-if="isInitialLoading">
      <USkeleton class="h-8 w-48 mb-6" />
      <div class="space-y-3 border border-gray-200 rounded-lg p-4">
        <USkeleton v-for="i in 5" :key="i" class="h-8 w-full" />
      </div>
    </div>

    <section v-else class="ds-table-con">
      <h2 class="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
        تاریخچه تراکنش‌ها
      </h2>
      <UICDataTable
        v-model="page"
        :columns="columns"
        :data="transactions"
        :total="total"
        :per-page="perPage"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, watch, h, resolveComponent } from "vue";

// -- کامپوننت‌های لازم برای جدول --
const UBadge = resolveComponent("UBadge");

// -- متغیرهای State --
const isInitialLoading = ref(true);
const transactions = ref([]);
const page = ref(1);
const total = ref(0);
const perPage = ref(0);

// -- تابع برای فرمت تاریخ و زمان --
function formatDateTime(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day} - ${hours}:${minutes}`;
}

// -- تابع اصلی برای گرفتن داده‌ها --
async function refetch(newPage = 1) {
  // در شروع هر بار فراخوانی، اگر اولین بار است، لودینگ را فعال نگه می‌داریم
  if (page.value === 1 && !transactions.value.length) {
    isInitialLoading.value = true;
  }

  try {
    const res = await useGet({
      url: "wallet/transactions?per_page=10",
      includeAuthHeader: true,
      query: { page: newPage },
    });

    // نکته: ساختار پاسخ شما کمی متفاوت است، داده‌ها در res.data.data و متا در res.data.meta قرار دارد
    if (res.status) {
      transactions.value = res.data.data || [];
      total.value = res.data.meta?.total || 0;
      perPage.value = res.data.meta?.per_page;
    }
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    useToast().add({ description: "خطا در دریافت تراکنش‌ها.", color: "error" });
  } finally {
    isInitialLoading.value = false;
  }
}

// -- واچر برای تغییر صفحه --
watch(page, (newPage) => {
  refetch(newPage);
});

// -- فراخوانی اولیه داده‌ها --
refetch(page.value);

// -- تعریف ستون‌های جدول --
const columns = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "type_text",
    header: "نوع تراکنش",
  },
  {
    accessorKey: "formatted_amount",
    header: "مبلغ",
    cell: ({ row }) => {
      const amount = row.getValue("formatted_amount");
      // اگر مبلغ منفی بود (برداشت)، قرمز نمایش بده
      const colorClass = amount.includes("-")
        ? "text-red-500"
        : "text-green-500";
      return h(
        "span",
        {
          class: `font-semibold ${colorClass}`,
        },
        amount
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "تاریخ و زمان",
    cell: ({ row }) => formatDateTime(row.getValue("created_at")),
  },
  {
    accessorKey: "status", // از status انگلیسی برای منطق استفاده می‌کنیم
    header: "وضعیت",
    cell: ({ row }) => {
      const statusValue = row.getValue("status");
      const statusText = row.original.status_text; // از status_text فارسی برای نمایش
      const colorMap = {
        completed: "success",
        pending: "warning",
        failed: "error",
      };

      const color = colorMap[statusValue] || "primary";

      return h(UBadge, { variant: "soft", color }, () => statusText);
    },
  },
];
</script>

<style scoped>
</style>