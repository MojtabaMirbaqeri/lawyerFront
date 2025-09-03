<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

// --- تعریف نوع داده برای هر درخواست برداشت ---
type WithdrawalRequest = {
  id: number;
  fullName: string;
  amount: string;
  status: string;
  bankInfo: string;
  createdAt: string;
};

// --- تابع برای واکشی مجدد داده‌ها (برای صفحه‌بندی و رفرش) ---
const refetch = async (page: number = 1) => {
  const response = await useGet({
    url: "withdrawal-requests/pending",
    includeAuthHeader: true,
    query: { page, per_page: 10 }, // ارسال per_page در کوئری برای تمیزی بیشتر
  });

  const responseData = response.data;

  // مپ کردن داده‌های دریافتی از API به فرمت مورد نیاز جدول
  data.value =
    responseData?.data?.map((req: any) => ({
      id: req.id,
      fullName: `${req.lawyer?.user?.name || ""} ${
        req.lawyer?.user?.family || ""
      }`,
      amount: req.formatted_amount,
      status: req.status_text,
      bankInfo: req.bank_card,
      createdAt: req.created_at
        ? new Date(req.created_at).toLocaleDateString("fa-IR")
        : "-",
    })) ?? []; // استفاده از ?? [] برای جلوگیری از خطا در صورت خالی بودن پاسخ

  // به‌روزرسانی اطلاعات صفحه‌بندی
  pagination.value.total = responseData?.meta?.total || 0;
};

// --- دریافت داده‌های اولیه ---
const { data: initialData } = await useGet({
  url: "withdrawal-requests/pending",
  includeAuthHeader: true,
  query: { per_page: 10 },
});

// --- متغیرهای Reactive ---
const data = ref<WithdrawalRequest[]>(
  initialData?.data?.map((req: any) => ({
    id: req.id,
    fullName: `${req.lawyer?.user?.name || ""} ${
      req.lawyer?.user?.family || ""
    }`,
    amount: req.formatted_amount,
    status: req.status_text,
    bankInfo: req.bank_card,
    createdAt: req.created_at
      ? new Date(req.created_at).toLocaleDateString("fa-IR")
      : "-",
  })) ?? [] // استفاده از ?? [] برای جلوگیری از خطا
);

// --- تعریف ستون‌های جدول ---
const columns: TableColumn<WithdrawalRequest>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  { accessorKey: "status", header: "وضعیت" },
  { accessorKey: "amount", header: "مبلغ" },
  {
    accessorKey: "bankInfo",
    header: "بانک مقصد",
    cell: ({ row }) =>
      `${row.original.bankInfo?.card_holder_name}\n${row.original.bankInfo?.card_holder_name}`,
  },
  { accessorKey: "createdAt", header: "تاریخ" },
  { accessorKey: "actions", header: "فعالیت" },
];

// --- تنظیمات صفحه‌بندی ---
const pagination = ref({
  pageIndex: 1,
  pageSize: initialData?.meta?.per_page || 10,
  total: initialData?.meta?.total || 0, // مقدار اولیه برای جلوگیری از خطا
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
  const res = await usePost({
    url: `withdrawal-requests/${id}/reject`,
    includeAuthHeader: true,
    body: { rejection_reason: comment },
  });

  if (res.statusCode === 200) {
    // ۱. داده‌های صفحه فعلی را مجدداً واکشی کن
    await refetch(pagination.value.pageIndex);

    // ۲. بررسی کن آیا صفحه خالی شده و صفحه اول نیست
    if (data.value.length === 0 && pagination.value.pageIndex > 1) {
      // ۳. اگر شرط برقرار بود، به صفحه قبل برو
      // watcher به صورت خودکار refetch را برای صفحه جدید صدا می‌زند
      pagination.value.pageIndex--;
    }
  }
};

const acceptHandle = async (id: number) => {
  const res = await usePost({
    url: `withdrawal-requests/${id}/approve`,
    includeAuthHeader: true,
  });

  if (res.statusCode === 200) {
    // ۱. داده‌های صفحه فعلی را مجدداً واکشی کن
    await refetch(pagination.value.pageIndex);

    // ۲. بررسی کن آیا صفحه خالی شده و صفحه اول نیست
    if (data.value.length === 0 && pagination.value.pageIndex > 1) {
      // ۳. اگر شرط برقرار بود، به صفحه قبل برو
      pagination.value.pageIndex--;
    }
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
        root: 'rounded-[7px] border border-gray-200 overflow-y-hidden',
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

    <div class="flex justify-center py-4">
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