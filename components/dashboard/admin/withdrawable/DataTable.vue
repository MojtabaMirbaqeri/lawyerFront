<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

// --- تعریف نوع داده برای هر درخواست برداشت ---
type WithdrawalRequest = {
  id: number;
  fullName: string;
  amount: string;
  status: string;
  bankInfo: string;
  createdAt: string; // یا Date اگر می‌خواهی تبدیل کنی
};

// --- تابع برای واکشی مجدد داده‌ها (برای صفحه‌بندی و رفرش) ---
const refetch = async (page: number = 1) => {
  const response = await useGet({
    url: "withdrawal-requests/pending?per_page=10",
    includeAuthHeader: true,
    query: { page },
  });

  const responseData = response.data;
  // مپ کردن داده‌های دریافتی از API به فرمت مورد نیاز جدول
  data.value = responseData.data.map((req: any) => ({
    id: req.id,
    fullName: `${req.lawyer?.user?.name || ""} ${
      req.lawyer?.user?.family || ""
    }`,
    amount: req.formatted_amount,
    status: req.status_text,
    bankInfo: req.bank_info || "اطلاعات بانکی ثبت نشده",
    createdAt: req.created_at
      ? new Date(req.created_at).toLocaleDateString("fa-IR")
      : "-", // فرمت‌دهی تاریخ
  }));
  console.log(data.value);
  

  // به‌روزرسانی اطلاعات صفحه‌بندی
  pagination.value.total = responseData.meta.total;
};

// --- دریافت داده‌های اولیه ---
const { data: initialData } = await useGet({
  url: "withdrawal-requests/pending?per_page=10",
  includeAuthHeader: true,
  query: undefined,
});

// --- متغیرهای Reactive ---
const data = ref<WithdrawalRequest[]>(
  initialData.data.map((req: any) => ({
    id: req.id,
    fullName: `${req.lawyer?.user?.name || ""} ${
      req.lawyer?.user?.family || ""
    }`,
    amount: req.formatted_amount,
    status: req.status_text,
    bankInfo: req.bank_info || "اطلاعات بانکی ثبت نشده",
    createdAt: req.created_at
      ? new Date(req.created_at).toLocaleDateString("fa-IR")
      : "-", // فرمت‌دهی تاریخ
  }))
);

// --- تعریف ستون‌های جدول ---
// این ستون‌ها دقیقاً مطابق با تصویر نمونه‌ای که فرستادی چیده شده‌اند.
const columns: TableColumn<WithdrawalRequest>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "status",
    header: "وضعیت",
  },
  {
    accessorKey: "amount",
    header: "مبلغ",
  },
  {
    // ترکیب نام وکیل و اطلاعات بانکی در یک ستون
    accessorKey: "bankInfo",
    header: "بانک مقصد",
    cell: ({ row }) => {
      const bankInfo = row.original.bankInfo;
      const fullName = row.original.fullName;
      return `${fullName}\n${bankInfo}`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ",
  },
  {
    // ستون سفارشی برای دکمه‌های تایید و رد
    accessorKey: "actions",
    header: "فعالیت",
  },
];

// --- تنظیمات صفحه‌بندی ---
const pagination = ref({
  pageIndex: 1,
  pageSize: initialData.meta.per_page || 10,
  total: initialData.meta.total,
});

// --- نظارت بر تغییر صفحه برای واکشی داده‌های جدید ---
watch(
  () => pagination.value.pageIndex,
  (newPage) => {
    refetch(newPage);
  }
);

// --- توابع مربوط به تایید و رد درخواست ---
const rejectHandle = async (comment: string, id: number) => {
  //              👇 متد به usePost تغییر کرد
  const res = await usePost({
    //         👇 آیدی داینامیک در URL قرار گرفت
    url: `withdrawal-requests/${id}/reject`,
    includeAuthHeader: true,
    // دلیل رد همچنان در body ارسال می‌شود
    body: { rejection_reason: comment },
  });

  if (res.statusCode === 200) {
    // واکشی مجدد داده‌ها پس از موفقیت
    refetch(pagination.value.pageIndex);
  }
};

const acceptHandle = async (id: number) => {
  //              👇 متد به usePost تغییر کرد
  const res = await usePost({
    //         👇 آیدی داینامیک در URL قرار گرفت
    url: `withdrawal-requests/${id}/approve`,
    includeAuthHeader: true,
    body: undefined,
  });

  if (res.statusCode === 200) {
    // واکشی مجدد داده‌های صفحه فعلی پس از موفقیت
    refetch(pagination.value.pageIndex);
  }
};
</script>

<template>
  <div class="ds-table-con">
    <UTable
      :data="data"
      :columns="columns"
      class="flex-1"
      :ui="{
        root: 'rounded-[7px]',
        thead: 'bg-primary',
        th: 'text-white text-center!',
        td: 'text-center whitespace-pre-line', // whitespace-pre-line برای نمایش صحیح اطلاعات بانک
      }"
    >
      <template #actions-cell="{ row }">
        <div>
          <UICChooseStatusModal
            @reject="(comment) => rejectHandle(comment, row.original.id)"
            @accept="acceptHandle(row.original.id)"
          />
        </div>
      </template>
    </UTable>

    <div class="flex justify-center border-t border-default py-4">
      <UPagination
        v-model:page="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        :ui="{
          first: 'hidden',
          prev: 'scale-x-[-1]',
          next: 'scale-x-[-1]',
          last: 'hidden',
        }"
        @update:page="(p) => (pagination.pageIndex = p)"
      />
    </div>
  </div>
</template>