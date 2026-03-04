<template>
  <div class="billing-page">
    <div class="page-header flex justify-between items-center mb-6">
      <div>
        <h1 class="text-xl font-bold">امور مالی</h1>
        <p class="text-slate-600 text-sm mt-1">خلاصه مالی پلتفرم و مدیریت کیف پول‌ها</p>
      </div>
      <NuxtLink
        to="/dashboard/admin/finance/wallets"
        class="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
      >
        لیست کیف پول‌ها
      </NuxtLink>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-slate-500">در حال بارگذاری...</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">موجودی پلتفرم</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ (overview.platform_balance ?? 0).toLocaleString('fa-IR') }} تومان</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">مجموع موجودی وکلا</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ (overview.total_lawyer_balances ?? 0).toLocaleString('fa-IR') }} تومان</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">مجموع موجودی کاربران</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ (overview.total_user_balances ?? 0).toLocaleString('fa-IR') }} تومان</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-lg p-4">
          <p class="text-sm text-slate-600">درخواست‌های برداشت در انتظار</p>
          <p class="text-xl font-bold text-slate-900 mt-1">{{ overview.pending_withdrawals_count ?? 0 }} درخواست</p>
          <p class="text-sm text-slate-500">{{ (overview.pending_withdrawals_amount ?? 0).toLocaleString('fa-IR') }} تومان</p>
        </div>
      </div>

      <section class="bg-white border border-slate-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">درخواست‌های برداشت در انتظار بررسی</h2>
        <dashboard-admin-withdrawable-data-table />
      </section>
    </template>
  </div>
</template>

<script setup>
const loading = ref(true);
const overview = ref({
  platform_balance: 0,
  total_lawyer_balances: 0,
  total_user_balances: 0,
  pending_withdrawals_count: 0,
  pending_withdrawals_amount: 0,
});

async function fetchOverview() {
  try {
    const res = await useGet({ url: 'admin/finance/overview', includeAuthHeader: true }, false);
    if (res?.data?.data) {
      overview.value = res.data.data;
    }
  } catch (_) {
    // fallback: leave overview at defaults
  }
}

onMounted(async () => {
  await fetchOverview();
  loading.value = false;
});

useHead({ title: 'امور مالی | وکیل وکیل' });
</script>
