<template>
  <div class="coupons-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت کپن‌ها</h1>
        <p class="page-description">مدیریت کدهای تخفیف</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink to="coupons/add" class="btn-primary">
          <Icon name="lucide:plus" class="w-4 h-4" />
          <span>ایجاد کپن</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Coupons Table -->
    <dashboard-admin-generic-table
      :data="couponsRes?.data || []"
      :columns="tableColumns"
      :show-pagination="false"
      row-key="id"
      empty-title="کپنی یافت نشد"
      empty-message="برای ایجاد کپن جدید روی دکمه ایجاد کپن کلیک کنید"
      empty-icon="lucide:ticket-percent"
    >
      <!-- Custom cell for ID -->
      <template #cell-id="{ value }">
        <span class="text-gray-600">#{{ value }}</span>
      </template>

      <!-- Custom cell for code -->
      <template #cell-code="{ value }">
        <span class="font-mono font-semibold text-blue-600">{{ value }}</span>
      </template>

      <!-- Custom cell for type -->
      <template #cell-type="{ value }">
        <span class="badge badge-info">{{ value === 'amount' ? 'مقداری' : 'درصدی' }}</span>
      </template>

      <!-- Custom cell for value -->
      <template #cell-value="{ row }">
        <span class="font-medium">
          {{ row.type === 'amount' ? row.value.toLocaleString() + ' تومان' : row.value + '%' }}
        </span>
      </template>

      <!-- Custom cell for status -->
      <template #cell-is_active="{ value }">
        <span class="badge" :class="value ? 'badge-success' : 'badge-error'">
          {{ value ? 'فعال' : 'غیرفعال' }}
        </span>
      </template>

      <!-- Custom cell for expires_at -->
      <template #cell-expires_at="{ value }">
        <span class="text-sm text-gray-600">{{ formatDate(value) }}</span>
      </template>

      <!-- Custom actions -->
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button class="btn-icon" title="ویرایش" @click="navigateTo(`/dashboard/admin/coupons/edit/${row.id}`)">
            <Icon name="lucide:edit" class="w-4 h-4" />
          </button>
          <button class="btn-icon text-red-600!" title="حذف" @click="deleteCoupon(row)">
            <Icon name="lucide:trash-2" class="w-4 h-4" />
          </button>
        </div>
      </template>
    </dashboard-admin-generic-table>
  </div>
</template>

<script setup>
const tableColumns = [
  { key: 'id', label: 'شماره کپن' },
  { key: 'code', label: 'کد تخفیف' },
  { key: 'type', label: 'نوع کپن' },
  { key: 'value', label: 'مقدار' },
  { key: 'is_active', label: 'وضعیت' },
  { key: 'usage_limit', label: 'محدودیت استفاده' },
  { key: 'used_count', label: 'تعداد استفاده' },
  { key: 'expires_at', label: 'تاریخ انقضا' },
];

const couponsRes = ref(
  await useGet({
    url: "coupons",
    includeAuthHeader: true,
  })
);

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const deleteCoupon = async (coupon) => {
  const res = await useDelete({
    url: `coupons/${coupon.id}`,
    includeAuthHeader: true,
  });
  if (res.statusCode == 200) {
    couponsRes.value = await useGet({
      url: "coupons",
      includeAuthHeader: true,
    });
    useToast().add({
      title: "کد تخفیف با موفقیت حذف شد.",
      color: "success",
    });
  } else {
    useToast().add({
      title: res.message || "خطا در حذف کد تخفیف.",
      color: "error",
    });
  }
};

useHead({
  title: "مدیریت کپن‌ها | وکیل وکیل",
});
</script>

<style scoped>
@reference "tailwindcss";

.coupons-page {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.btn-primary {
  @apply inline-flex items-center gap-2;
}
</style>
