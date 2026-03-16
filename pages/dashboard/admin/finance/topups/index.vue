<template>
  <div class="topups-admin-page">
    <div class="page-header mb-6">
      <NuxtLink to="/dashboard/admin/billing" class="text-slate-600 text-sm mb-2 inline-block">← بازگشت به امور مالی</NuxtLink>
      <h1 class="text-xl font-bold">شارژهای کیف پول</h1>
      <p class="text-slate-600 text-sm mt-1">لیست و وضعیت شارژهای کیف پول کاربران</p>
    </div>

    <div class="flex flex-wrap gap-4 mb-4">
      <select
        v-model="filters.status"
        class="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        @change="fetchTopups"
      >
        <option value="">همه وضعیت‌ها</option>
        <option value="pending">در انتظار</option>
        <option value="gateway_requested">ارسال به درگاه</option>
        <option value="verified">تکمیل شده</option>
        <option value="failed">ناموفق</option>
        <option value="canceled">لغو شده</option>
        <option value="expired">منقضی</option>
      </select>
      <input
        v-model="filters.user_id"
        type="text"
        placeholder="شناسه کاربر"
        class="border border-slate-300 rounded-lg px-3 py-2 text-sm w-32"
        @keyup.enter="fetchTopups"
      />
      <input
        v-model="filters.date_from"
        type="date"
        class="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        @change="fetchTopups"
      />
      <input
        v-model="filters.date_to"
        type="date"
        class="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        @change="fetchTopups"
      />
      <button
        class="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
        @click="fetchTopups"
      >
        جستجو
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center text-slate-500">در حال بارگذاری...</div>
    <div v-else class="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="p-3 font-semibold">شناسه</th>
              <th class="p-3 font-semibold">کاربر</th>
              <th class="p-3 font-semibold">مبلغ</th>
              <th class="p-3 font-semibold">وضعیت</th>
              <th class="p-3 font-semibold">شماره پیگیری</th>
              <th class="p-3 font-semibold">تاریخ</th>
              <th class="p-3 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in topups" :key="t.id" class="border-b border-slate-100 hover:bg-slate-50">
              <td class="p-3">{{ t.id }}</td>
              <td class="p-3">{{ t.user?.name }} {{ t.user?.family }}</td>
              <td class="p-3 font-medium">{{ Number(t.amount).toLocaleString('fa-IR') }} تومان</td>
              <td class="p-3">
                <span :class="statusClass(t.status)">{{ statusLabel(t.status) }}</span>
              </td>
              <td class="p-3">{{ t.ref_id ?? '—' }}</td>
              <td class="p-3">{{ formatDate(t.created_at) }}</td>
              <td class="p-3">
                <NuxtLink
                  :to="`/dashboard/admin/finance/topups/${t.id}`"
                  class="text-slate-700 hover:underline"
                >
                  جزئیات
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="topups.length === 0" class="p-6 text-slate-500 text-center">شارژی یافت نشد.</p>
      <div v-if="meta.last_page > 1" class="p-3 border-t border-slate-100 flex justify-center gap-2">
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="meta.current_page <= 1"
          @click="page--; fetchTopups()"
        >
          قبلی
        </button>
        <span class="py-1">{{ meta.current_page }} / {{ meta.last_page }}</span>
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="meta.current_page >= meta.last_page"
          @click="page++; fetchTopups()"
        >
          بعدی
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const topups = ref([]);
const meta = ref({ current_page: 1, last_page: 1 });
const page = ref(1);
const filters = ref({
  status: '',
  user_id: '',
  date_from: '',
  date_to: '',
});

function statusLabel(s) {
  const map = {
    pending: 'در انتظار',
    gateway_requested: 'ارسال به درگاه',
    verified: 'تکمیل شده',
    failed: 'ناموفق',
    canceled: 'لغو شده',
    expired: 'منقضی',
  };
  return map[s] ?? s;
}

function statusClass(s) {
  if (s === 'verified') return 'text-green-600';
  if (s === 'failed' || s === 'canceled' || s === 'expired') return 'text-red-600';
  return 'text-slate-600';
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function fetchTopups() {
  loading.value = true;
  try {
    const res = await useGet({
      url: 'admin/wallet/topups',
      includeAuthHeader: true,
      query: {
        per_page: 15,
        page: page.value,
        status: filters.value.status || undefined,
        user_id: filters.value.user_id || undefined,
        date_from: filters.value.date_from || undefined,
        date_to: filters.value.date_to || undefined,
      },
    }, false);
    topups.value = res?.data?.data ?? [];
    meta.value = res?.data?.meta ?? { current_page: 1, last_page: 1 };
  } finally {
    loading.value = false;
  }
}

onMounted(fetchTopups);
useHead({ title: 'شارژهای کیف پول | وکیل وکیل' });
</script>
