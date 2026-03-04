<template>
  <div class="wallet-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold">کیف پول</h1>
      <p class="text-slate-600 text-sm mt-1">موجودی و تراکنش‌های کیف پول شما</p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-slate-500">در حال بارگذاری...</p>
    </div>

    <template v-else>
      <section class="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">خلاصه</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 bg-slate-50 rounded-lg">
            <p class="text-sm text-slate-600">موجودی</p>
            <p class="text-xl font-bold text-slate-900">{{ summary.balance?.toLocaleString('fa-IR') ?? 0 }} تومان</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-lg">
            <p class="text-sm text-slate-600">مجموع واریزها</p>
            <p class="text-xl font-bold text-slate-900">{{ summary.total_credited?.toLocaleString('fa-IR') ?? 0 }} تومان</p>
          </div>
          <div class="p-4 bg-slate-50 rounded-lg">
            <p class="text-sm text-slate-600">مجموع برداشت‌ها</p>
            <p class="text-xl font-bold text-slate-900">{{ summary.total_debited?.toLocaleString('fa-IR') ?? 0 }} تومان</p>
          </div>
        </div>
        <p v-if="summary.is_frozen" class="mt-3 text-amber-600 text-sm">کیف پول شما در حال حاضر مسدود است.</p>
      </section>

      <section class="bg-white border border-slate-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">تراکنش‌ها</h2>
        <div v-if="transactions.length === 0" class="text-slate-500 py-8 text-center">
          هنوز تراکنشی ثبت نشده است.
        </div>
        <ul v-else class="divide-y divide-slate-200">
          <li
            v-for="tx in transactions"
            :key="tx.id"
            class="py-3 flex flex-wrap justify-between items-center gap-2"
          >
            <div>
              <span class="font-medium">{{ tx.type_text ?? tx.type }}</span>
              <span class="text-slate-500 text-sm block">{{ tx.description }}</span>
              <span class="text-slate-400 text-xs">{{ formatDate(tx.created_at) }}</span>
            </div>
            <span :class="isCredit(tx.type) ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ tx.formatted_amount ?? (tx.amount + ' تومان') }}
            </span>
          </li>
        </ul>
        <div v-if="totalPages > 1" class="mt-4 flex justify-center gap-2">
          <button
            class="px-3 py-1 border rounded disabled:opacity-50"
            :disabled="page <= 1"
            @click="page--; fetchTransactions()"
          >
            قبلی
          </button>
          <span class="py-1">{{ page }} / {{ totalPages }}</span>
          <button
            class="px-3 py-1 border rounded disabled:opacity-50"
            :disabled="page >= totalPages"
            @click="page++; fetchTransactions()"
          >
            بعدی
          </button>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
const loading = ref(true);
const summary = ref({ balance: 0, total_credited: 0, total_debited: 0, is_frozen: false });
const transactions = ref([]);
const page = ref(1);
const perPage = 10;
const totalPages = ref(1);

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function isCredit(type) {
  return ['credit', 'refund_credit', 'adjustment_credit'].includes(type);
}

async function fetchSummary() {
  const res = await useGet({ url: 'user/wallet', includeAuthHeader: true }, false);
  if (res?.data?.data) {
    summary.value = res.data.data;
  }
}

async function fetchTransactions() {
  const res = await useGet({
    url: 'user/wallet/transactions',
    includeAuthHeader: true,
    query: { page: page.value, per_page: perPage },
  }, false);
  if (res?.data?.data) {
    transactions.value = res.data.data;
  }
  if (res?.data?.meta) {
    totalPages.value = res.data.meta.last_page ?? 1;
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchSummary(), fetchTransactions()]);
  } finally {
    loading.value = false;
  }
});

useHead({ title: 'کیف پول | وکیل وکیل' });
</script>
