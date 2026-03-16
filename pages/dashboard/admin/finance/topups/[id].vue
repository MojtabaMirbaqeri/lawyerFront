<template>
  <div class="topup-detail-page">
    <div class="page-header mb-6">
      <NuxtLink to="/dashboard/admin/finance/topups" class="text-slate-600 text-sm mb-2 inline-block">← بازگشت به لیست شارژها</NuxtLink>
      <h1 class="text-xl font-bold">جزئیات شارژ کیف پول</h1>
      <p class="text-slate-600 text-sm mt-1">شناسه: {{ topup?.id }}</p>
    </div>

    <div v-if="loading" class="py-8 text-center text-slate-500">در حال بارگذاری...</div>
    <div v-else-if="topup" class="bg-white border border-slate-200 rounded-lg p-6 max-w-2xl">
      <dl class="grid grid-cols-1 gap-3 text-sm">
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">کاربر</dt>
          <dd class="font-medium">{{ topup.user?.name }} {{ topup.user?.family }} ({{ topup.user?.phone ?? '—' }})</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">مبلغ</dt>
          <dd class="font-medium">{{ Number(topup.amount).toLocaleString('fa-IR') }} تومان</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">وضعیت</dt>
          <dd class="font-medium">{{ topup.status }}</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">درگاه</dt>
          <dd class="font-medium">{{ topup.gateway ?? '—' }}</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">Authority (درگاه)</dt>
          <dd class="font-mono text-xs break-all">{{ topup.gateway_authority ?? '—' }}</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">شماره پیگیری</dt>
          <dd class="font-medium">{{ topup.ref_id ?? '—' }}</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">تراکنش کیف پول</dt>
          <dd class="font-medium">
            <NuxtLink
              v-if="topup.user_wallet_transaction_id"
              :to="`/dashboard/admin/finance/wallets/user/${topup.user_id}`"
              class="text-[#0EA5E9] hover:underline"
            >
              #{{ topup.user_wallet_transaction_id }}
            </NuxtLink>
            <span v-else>—</span>
          </dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">تاریخ ایجاد</dt>
          <dd class="font-medium">{{ formatDate(topup.created_at) }}</dd>
        </div>
        <div class="flex justify-between border-b border-slate-100 pb-2">
          <dt class="text-slate-600">تاریخ واریز</dt>
          <dd class="font-medium">{{ topup.credited_at ? formatDate(topup.credited_at) : '—' }}</dd>
        </div>
      </dl>
    </div>
    <div v-else class="py-8 text-center text-slate-500">شارژ یافت نشد.</div>
  </div>
</template>

<script setup>
const route = useRoute();
const id = computed(() => route.params.id);

const loading = ref(true);
const topup = ref(null);

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function fetchTopup() {
  if (!id.value) return;
  loading.value = true;
  try {
    const res = await useGet({
      url: `admin/wallet/topups/${id.value}`,
      includeAuthHeader: true,
    }, false);
    topup.value = res?.data?.data ?? res?.data ?? null;
  } finally {
    loading.value = false;
  }
}

watch(id, fetchTopup, { immediate: true });
useHead({ title: 'جزئیات شارژ | وکیل وکیل' });
</script>
