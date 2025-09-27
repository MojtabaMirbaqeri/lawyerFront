<!-- eslint-disable vue/no-ref-as-operand -->
<template>
  <div class="ds-table-con">
    <!-- جدول داده‌ها با قابلیت صفحه‌بندی -->
    <UICDataTable
      :data="data"
      :columns="columns"
      :total="total"
      v-model="page"
    />
  </div>
</template>

<script setup>
import { ref, watch, h } from "vue";

// متغیرهای لازم برای صفحه‌بندی
const page = ref(1); // شماره صفحه فعلی
const total = ref(0); // تعداد کل آیتم‌ها
const data = ref([]); // داده‌های جدول که در ابتدا خالی است

// ستون‌های جدول (بدون تغییر نسبت به کد اصلی شما)
const columns = [
  {
    accessorKey: "fullName",
    header: "نام نام خانوادگی",
  },
  {
    accessorKey: "phone",
    header: "تلفن",
  },
  {
    accessorKey: "activeTicket",
    header: "تیکت فعال",
  },
  {
    accessorKey: "orders",
    header: "سفارشات",
  },
  {
    accessorKey: "comments",
    header: "دیدگاه",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-center" }, "موجودی کیف پول"),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount") || 0);
      const formatted = new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
      return h("div", { class: "text-center font-medium" }, formatted);
    },
  },
];

/**
 * تابع برای واکشی داده‌ها از سرور بر اساس شماره صفحه
 * @param {number} pageNumber - شماره صفحه‌ای که باید واکشی شود
 * @param {boolean} setTotal - آیا باید تعداد کل آیتم‌ها را تنظیم کند؟ (فقط برای اولین درخواست)
 */
const fetchData = async (pageNumber, setTotal = false) => {
  try {
    const res = await useGet({
      url: 'users',
      includeAuthHeader: true,
      query: {
        page: pageNumber,
      },
    });

    // مپ کردن داده‌های دریافت شده برای نمایش در جدول
    data.value = res.data.data.map((user) => ({
      fullName: `${user?.name || ''} ${user?.family || ''}`.trim(),
      phone: user?.phone,
      amount: user.wallet_balance || 0,
      activeTicket: user?.ticket_count,
      orders: user?.appointment_count,
      comments: user?.review_count,
    }));

    // تنظیم تعداد کل آیتم‌ها برای صفحه‌بندی (فقط در اولین بار)
    if (setTotal && res.data.meta) {
      total.value = res.data.meta.total;
    }
  } catch (error) {
    console.error("خطا در واکشی اطلاعات کاربران:", error);
    // می‌توانید در اینجا یک پیام خطا به کاربر نمایش دهید
  }
};

// واکشی اطلاعات اولیه برای صفحه اول
await fetchData(1, true);

// نظارت بر تغییرات متغیر page و واکشی مجدد اطلاعات در صورت تغییر
watch(page, (newPage) => {
  fetchData(newPage);
});
</script>

<style>
/* می‌توانید استایل‌های مورد نظر خود را در اینجا اضافه کنید */
</style>
