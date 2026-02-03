<script setup lang="ts">
// --- تعریف نوع داده برای هر درخواست برداشت ---
type WithdrawalRequest = {
  id: number;
  fullName: string;
  amount: string;
  status: string;
  bankInfo: any;
  createdAt: string;
};

// --- تابع برای واکشی مجدد داده‌ها (برای صفحه‌بندی و رفرش) ---
const refetch = async (page: number = 1) => {
  const response = await useGet({
    url: "withdrawal-requests/pending",
    includeAuthHeader: true,
    query: { page, per_page: 10 },
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
    })) ?? [];

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
  })) ?? []
);

// --- تعریف ستون‌های جدول برای GenericTable ---
const tableColumns = [
  { key: 'id', label: 'شناسه', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'status', label: 'وضعیت', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'amount', label: 'مبلغ', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'bankInfo', label: 'بانک مقصد', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'createdAt', label: 'تاریخ', headerClass: 'text-center', cellClass: 'text-center' },
];

// --- تنظیمات صفحه‌بندی ---
const pagination = ref({
  pageIndex: 1,
  pageSize: initialData?.meta?.per_page || 10,
  total: initialData?.meta?.total || 0,
});

// --- نظارت بر تغییر صفحه برای واکشی داده‌های جدید ---
watch(
  () => pagination.value.pageIndex,
  (newPage) => {
    refetch(newPage);
  }
);

const isLoading = ref(false);

// --- توابع مربوط به تایید و رد درخواست ---
const rejectHandle = async (comment: string, id: number) => {
  isLoading.value = true;
  const res = await usePost({
    url: `withdrawal-requests/${id}/reject`,
    includeAuthHeader: true,
    body: { rejection_reason: comment },
  });

  if (res.statusCode === 200) {
    useToast().add({ title: "درخواست برداشت با موفقیت رد شد", color: "success" });
    await refetch(pagination.value.pageIndex);

    if (data.value.length === 0 && pagination.value.pageIndex > 1) {
      pagination.value.pageIndex--;
    }
  }
  isLoading.value = false;
};

const acceptHandle = async (id: number) => {
  isLoading.value = true;
  const res = await usePost({
    url: `withdrawal-requests/${id}/approve`,
    includeAuthHeader: true,
    body: undefined,
  });

  if (res.statusCode === 200) {
    useToast().add({ title: "درخواست برداشت با موفقیت تایید شد", color: "success" });
    await refetch(pagination.value.pageIndex);

    if (data.value.length === 0 && pagination.value.pageIndex > 1) {
      pagination.value.pageIndex--;
    }
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="withdrawal-table">
    <dashboard-admin-generic-table
      :data="data"
      :columns="tableColumns"
      :current-page="pagination.pageIndex"
      :total-items="pagination.total"
      :items-per-page="pagination.pageSize"
      row-key="id"
      empty-title="درخواست برداشتی یافت نشد"
      empty-message="هیچ درخواست برداشت در انتظاری وجود ندارد"
      empty-icon="lucide:wallet"
      @update:page="pagination.pageIndex = $event"
    >
      <!-- Custom cell for ID -->
      <template #cell-id="{ value }">
        <span class="text-gray-600">#{{ value }}</span>
      </template>

      <!-- Custom cell for status -->
      <template #cell-status="{ value }">
        <span class="badge badge-warning">{{ value }}</span>
      </template>

      <!-- Custom cell for amount -->
      <template #cell-amount="{ value }">
        <span class="font-semibold text-green-600">{{ value }}</span>
      </template>

      <!-- Custom cell for bank info -->
      <template #cell-bankInfo="{ value }">
        <div class="text-sm whitespace-pre-line">
          <div v-if="value?.card_holder_name">{{ value.card_holder_name }}</div>
          <div v-if="value?.card_number">{{ value.card_number }}</div>
          <div v-if="!value?.card_holder_name && !value?.card_number">{{ value || '-' }}</div>
        </div>
      </template>

      <!-- Custom cell for date -->
      <template #cell-createdAt="{ value }">
        <span class="text-sm text-gray-600">{{ value }}</span>
      </template>

      <!-- Custom actions -->
      <template #actions="{ row }">
        <div class="flex items-center justify-center">
          <UICChooseStatusModal
            next-word="درخواست برداشت"
            @reject="(comment) => rejectHandle(comment, row.id)"
            @accept="acceptHandle(row.id)"
          />
        </div>
      </template>
    </dashboard-admin-generic-table>
  </div>
</template>

<style scoped>
@reference 'tailwindcss';
.withdrawal-table {
  @apply space-y-4;
}
</style>
