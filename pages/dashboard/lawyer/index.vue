<!-- eslint-disable vue/no-parsing-error -->
<template>
  <section class="grid grid-cols-1 gap-3 lg:gap-4">
    <div class="ds-table-con">
      <h2>شما {{ comProfile }} درصد پروفایل خود را تکمیل کرده اید.</h2>
      <UICProgressBar :value="comProfile" class="mb-2 lg:mb-4" />
      <DashboardLawyerDetailBox v-if="dashboardRes?.data" :stats="dashboardRes?.data" />
    </div>

    <!-- نوبت‌های امروز -->
    <div class="ds-table-con">
      <h1 class="font-semibold text-lg">نوبت‌های امروز</h1>
      <UICDataTable
        :columns="appointmentColumns"
        :data="dashboardRes.data.today_appointments"
        :show-pagination="false" />
    </div>

    <div class="grid grid-cols-1 gap-3 lg:gap-4">
      <!-- دیدگاه‌های اخیر -->
      <div class="ds-table-con">
        <h1 class="font-semibold text-lg">دیدگاه‌های اخیر</h1>
        <UICDataTable
          :columns="reviewColumns"
          :data="dashboardRes.data.recent_reviews"
          :show-pagination="false" />
      </div>

      <!-- تیکت‌های اخیر -->
      <div class="ds-table-con">
        <h1 class="font-semibold text-lg">تیکت‌های اخیر</h1>
        <UICDataTable
          :columns="ticketColumns"
          :data="dashboardRes.data.recent_tickets"
          :show-pagination="false" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { h, resolveComponent } from "vue";

const UBadge = resolveComponent("UBadge");

const comProfile = ref(80);

const { data: dashboardRes } = await useGet({
  url: "lawyer/dashboard",
  includeAuthHeader: true,
});

// ========== ستون‌های جدول نوبت‌های امروز ==========
const appointmentColumns = [
  { accessorKey: "id", header: "شناسه" },
  {
    accessorKey: "type",
    header: "نوع ویزیت",
    cell: ({ row }) => {
      const map = { inperson: "حضوری", phone: "تلفنی", chat: "چت آنلاین" };
      return map[row.original.type] || row.original.type;
    },
  },
  { accessorKey: "client_name", header: "موکل" },
  { accessorKey: "time", header: "ساعت" },
  { accessorKey: "duration", header: "مدت زمان (دقیقه)" },
];

// ========== ستون‌های جدول دیدگاه‌های اخیر ==========
const reviewColumns = [
  { accessorKey: "id", header: "شناسه" },
  { accessorKey: "client_name", header: "کاربر" },
  { accessorKey: "comment", header: "نظر" },
  { accessorKey: "rating", header: "امتیاز" },
  {
    accessorKey: "reply",
    header: "ریپلای",
    cell: ({ row }) => row.original.reply || "-",
  },
  {
    accessorKey: "created_at",
    header: "زمان",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // ساعت 24 ساعته
      });
    },
  },
];

// ========== ستون‌های جدول تیکت‌های اخیر ==========
const ticketColumns = [
  { accessorKey: "ticket_number", header: "شناسه تیکت" },
  { accessorKey: "title", header: "عنوان" },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const color = {
        open: "primary",
        closed: "error",
        in_progress: "secondary",
        answered: "success",
        waiting_for_user: "warning",
      }[row.original.status];

      return h(
        UBadge,
        { class: "capitalize", variant: "soft", color },
        () => row.original.status_label
      );
    },
  },
  { accessorKey: "priority_label", header: "اولویت" },
  {
    accessorKey: "created_at",
    header: "زمان",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // ساعت 24 ساعته
      });
    },
  },
];
</script>
