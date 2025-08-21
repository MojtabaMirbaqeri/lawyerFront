<template>
  <section>
    <div class="ds-table-con">
      <UICDataTable
        :data="data"
        :columns="columns"
        :total="total"
        v-model="page"
      />
    </div>
  </section>
</template>

<script setup>
import { h, resolveComponent, ref, watch } from "vue";

// کامپوننت‌های مورد نیاز برای رندر داینامیک در جدول
const UBadge = resolveComponent("UBadge");

// متغیر برای مدیریت صفحه فعلی
const page = ref(1);
const data = ref([]);
const total = ref(0);

// تابع اصلی برای دریافت داده‌ها از سرور
const refetch = async (currentPage = 1) => {
  try {
    const res = await useGet({
      url: "payments", // تغییر API به payments
      includeAuthHeader: true,
      query: {
        page: currentPage,
      },
    });

    // مپ کردن داده‌های دریافت شده برای نمایش در جدول
    // نکته: با توجه به ساختار API، اطلاعات کاربر و وکیل در داخل آبجکت appointment وجود ندارد.
    // این بخش برای جلوگیری از خطا کامنت شد. در صورت نیاز باید API اصلاح شود.
    data.value = res.data.data.map((payment) => {
      return {
        id: payment?.id,
        // user: `${payment?.appointment?.user?.name} ${payment?.appointment?.user?.family}`,
        // lawyer: `${payment?.appointment?.lawyer?.name} ${payment?.appointment?.lawyer?.family}`,
        appointmentId: payment?.appointment_id,
        amount: `${payment?.amount} تومان`, // افزودن واحد پول
        gateway: payment?.gateway || "نامشخص", // مدیریت مقدار null
        refId: payment?.ref_id || "-",
        createdAt: new Date(payment?.created_at).toLocaleDateString("fa"),
        status: payment?.status,
      };
    });

    // تنظیم تعداد کل آیتم‌ها برای صفحه‌بندی
    total.value = res.data.total;

  } catch (error) {
    console.error("Failed to fetch payments:", error);
    // می‌توانید در اینجا یک پیام خطا به کاربر نمایش دهید
  }
};

// واچر برای تغییر صفحه
watch(
  () => page.value,
  async (newPage) => {
    await refetch(newPage);
  }
);

// تعریف ستون‌های جدول
const columns = ref([
  {
    accessorKey: "id",
    header: "شناسه پرداخت",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "appointmentId",
    header: "شناسه نوبت",
  },
  {
    accessorKey: "amount",
    header: "مبلغ",
  },
  {
    accessorKey: "gateway",
    header: "درگاه پرداخت",
  },
    {
    accessorKey: "refId",
    header: "کد رهگیری",
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ ایجاد",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const statusValue = row.getValue("status");
      // تعریف رنگ‌ها بر اساس وضعیت پرداخت
      const colorMap = {
        pending: "warning",
        failed: "error",
        paid: "success", // فرض می‌کنیم وضعیت موفق paid باشد
        succeeded: "success" // یا succeeded
      };
      // تعریف ترجمه وضعیت‌ها
      const labelMap = {
        pending: "در انتظار",
        failed: "ناموفق",
        paid: "پرداخت موفق",
        succeeded: "پرداخت موفق"
      };

      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "soft",
          color: colorMap[statusValue] || "gray",
        },
        () => labelMap[statusValue] || statusValue
      );
    },
  },
]);


// دریافت داده‌های اولیه هنگام بارگذاری کامپوننت
await refetch(page.value);

</script>