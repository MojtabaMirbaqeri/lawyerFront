<template>
  <div class="topup-result-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold">نتیجه شارژ کیف پول</h1>
      <p class="text-slate-600 text-sm mt-1">وضعیت تراکنش شارژ</p>
    </div>

    <div v-if="loading" class="card-dashboard">
      <div class="card-dashboard-body p-8 flex items-center justify-center gap-2 text-slate-600">
        <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
        <span>در حال بررسی نتیجه پرداخت...</span>
      </div>
    </div>

    <template v-else>
      <!-- Success -->
      <div v-if="status === 'verified' || status === 'success'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-green-600 mb-4">
            <Icon name="lucide:check-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">شارژ کیف پول با موفقیت انجام شد</h2>
          </div>
          <p class="text-slate-600 mb-4">مبلغ به کیف پول شما اضافه شد.</p>
          <div v-if="topup" class="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-4">
            <p class="text-sm text-slate-600"><span class="font-medium">مبلغ شارژ شده:</span> {{ (topup.amount ?? 0).toLocaleString('fa-IR') }} تومان</p>
            <p v-if="topup.ref_id" class="text-sm text-slate-600 mt-1"><span class="font-medium">شماره پیگیری:</span> {{ topup.ref_id }}</p>
            <p v-if="walletBalance !== null" class="text-sm text-slate-600 mt-1"><span class="font-medium">موجودی فعلی:</span> {{ walletBalance.toLocaleString('fa-IR') }} تومان</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/dashboard/wallet" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a75]">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              بازگشت به کیف پول
            </NuxtLink>
            <NuxtLink to="/lawyers" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              رزرو مشاوره
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Failed / Canceled -->
      <div v-else-if="status === 'failed' || status === 'canceled'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-amber-600 mb-4">
            <Icon name="lucide:alert-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">پرداخت تکمیل نشد</h2>
          </div>
          <p class="text-slate-600 mb-4">کیف پول شارژ نشد. در صورت نیاز می‌توانید دوباره تلاش کنید.</p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/dashboard/wallet" class="inline-flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-sky-600">
              <Icon name="lucide:refresh-cw" class="w-4 h-4" />
              تلاش مجدد
            </NuxtLink>
            <NuxtLink to="/dashboard/wallet" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              بازگشت به کیف پول
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Already processed -->
      <div v-else-if="status === 'already_processed'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-slate-600 mb-4">
            <Icon name="lucide:info" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">این تراکنش قبلاً بررسی شده است</h2>
          </div>
          <p class="text-slate-600 mb-4">وضعیت این شارژ از قبل ثبت شده است.</p>
          <p v-if="walletBalance !== null" class="text-sm text-slate-600 mb-4">موجودی فعلی کیف پول: {{ walletBalance.toLocaleString('fa-IR') }} تومان</p>
          <NuxtLink to="/dashboard/wallet" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a75]">
            <Icon name="lucide:wallet" class="w-4 h-4" />
            بازگشت به کیف پول
          </NuxtLink>
        </div>
      </div>

      <!-- Pending / Unknown -->
      <div v-else class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-slate-500 mb-4">
            <Icon name="lucide:help-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">در حال بررسی</h2>
          </div>
          <p class="text-slate-600 mb-4">نتیجه پرداخت در حال بررسی است. در صورت کسر وجه، با پشتیبانی تماس بگیرید.</p>
          <NuxtLink to="/dashboard/wallet" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            بازگشت به کیف پول
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const route = useRoute();

const result = computed(() => (route.query.result || '').toLowerCase());
const topupId = computed(() => route.query.topup_id ? String(route.query.topup_id).trim() : null);

const topup = ref(null);
const walletBalance = ref(null);
const loading = ref(true);

const status = computed(() => {
  if (topup.value?.status === 'verified') return 'verified';
  return result.value || (topup.value?.status === 'verified' ? 'verified' : '');
});

useHead({ title: 'نتیجه شارژ کیف پول | وکیل وکیل' });

watch([result, topupId], async () => {
  topup.value = null;
  walletBalance.value = null;
  if (!topupId.value) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const res = await useGet({ url: `user/wallet/topups/${topupId.value}`, includeAuthHeader: true }, false);
    topup.value = res.data?.data ?? res.data ?? null;
    if (topup.value?.status === 'verified') {
      const sumRes = await useGet({ url: 'user/wallet', includeAuthHeader: true }, false);
      const sum = sumRes?.data?.data ?? sumRes?.data;
      if (sum && typeof sum.balance === 'number') walletBalance.value = sum.balance;
    }
  } catch (_) {}
  loading.value = false;
}, { immediate: true });
</script>
