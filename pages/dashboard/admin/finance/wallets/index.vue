<template>
  <div class="wallets-page">
    <div class="page-header mb-6">
      <NuxtLink to="/dashboard/admin/billing" class="text-slate-600 text-sm mb-2 inline-block">← بازگشت به امور مالی</NuxtLink>
      <h1 class="text-xl font-bold">لیست کیف پول‌ها</h1>
      <p class="text-slate-600 text-sm mt-1">جستجو و مشاهده کیف پول کاربران، وکلا و پلتفرم</p>
    </div>

    <div class="flex flex-wrap gap-4 mb-4">
      <select
        v-model="ownerType"
        class="border border-slate-300 rounded-lg px-3 py-2 text-sm"
        @change="fetchWallets"
      >
        <option value="">همه</option>
        <option value="user">کاربران</option>
        <option value="lawyer">وکلا</option>
        <option value="platform">پلتفرم</option>
      </select>
      <input
        v-model="search"
        type="text"
        placeholder="جستجو (نام یا شناسه)"
        class="border border-slate-300 rounded-lg px-3 py-2 text-sm w-48"
        @keyup.enter="fetchWallets"
      />
      <button
        class="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
        @click="fetchWallets"
      >
        جستجو
      </button>
    </div>

    <div v-if="loading" class="py-8 text-center text-slate-500">در حال بارگذاری...</div>
    <div v-else class="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <table class="w-full text-right text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="p-3 font-semibold">نوع</th>
            <th class="p-3 font-semibold">مالک</th>
            <th class="p-3 font-semibold">شناسه</th>
            <th class="p-3 font-semibold">موجودی</th>
            <th class="p-3 font-semibold">وضعیت</th>
            <th class="p-3 font-semibold">عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in wallets" :key="w.owner_type + '-' + w.owner_id" class="border-b border-slate-100 hover:bg-slate-50">
            <td class="p-3">{{ ownerTypeLabel(w.owner_type) }}</td>
            <td class="p-3">{{ w.owner_name }}</td>
            <td class="p-3">{{ w.owner_id }}</td>
            <td class="p-3 font-medium">{{ Number(w.balance).toLocaleString('fa-IR') }} تومان</td>
            <td class="p-3">
              <span v-if="w.is_frozen" class="text-amber-600">مسدود</span>
              <span v-else class="text-green-600">فعال</span>
            </td>
            <td class="p-3">
              <NuxtLink
                :to="`/dashboard/admin/finance/wallets/${w.owner_type}/${w.owner_id}`"
                class="text-slate-700 hover:underline"
              >
                جزئیات
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="wallets.length === 0" class="p-6 text-slate-500 text-center">کیف پولی یافت نشد.</p>
    </div>
  </div>
</template>

<script setup>
const loading = ref(true);
const wallets = ref([]);
const ownerType = ref('');
const search = ref('');

function ownerTypeLabel(type) {
  const map = { user: 'کاربر', lawyer: 'وکیل', platform: 'پلتفرم' };
  return map[type] ?? type;
}

async function fetchWallets() {
  loading.value = true;
  try {
    const res = await useGet({
      url: 'admin/wallets',
      includeAuthHeader: true,
      query: { owner_type: ownerType.value || undefined, search: search.value || undefined },
    }, false);
    wallets.value = res?.data?.data ?? [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchWallets);
useHead({ title: 'لیست کیف پول‌ها | وکیل وکیل' });
</script>
