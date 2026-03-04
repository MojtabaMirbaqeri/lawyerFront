<template>
  <div class="wallet-detail-page">
    <div class="page-header mb-6">
      <NuxtLink to="/dashboard/admin/finance/wallets" class="text-slate-600 text-sm mb-2 inline-block hover:underline">← بازگشت به لیست کیف پول‌ها</NuxtLink>
      <h1 class="text-xl font-bold text-slate-900">جزئیات کیف پول</h1>
      <p class="text-slate-600 text-sm mt-1">{{ ownerTypeLabel(ownerType) }} — شناسه {{ ownerId }}</p>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-slate-500">در حال بارگذاری...</p>
    </div>

    <template v-else>
      <!-- خلاصه موجودی (کارت‌ها مثل billing) -->
      <section class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(val, key) in wallet"
            :key="key"
            class="bg-white border border-slate-200 rounded-lg p-4"
          >
            <p class="text-sm text-slate-600">{{ label(key) }}</p>
            <p class="text-xl font-bold text-slate-900 mt-1">{{ typeof val === 'number' ? val.toLocaleString('fa-IR') : val }}</p>
          </div>
        </div>
      </section>

      <!-- بخش مدیریت: واریز / برداشت دستی -->
      <section class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <h2 class="text-base font-semibold text-slate-800 mb-2">مدیریت کیف پول — واریز یا برداشت دستی</h2>
        <p class="text-slate-600 text-sm mb-3">از این بخش می‌توانید مبلغ را به صورت دستی واریز یا برداشت کنید. دلیل را حتماً وارد کنید.</p>
        <form class="bg-white rounded-lg p-4 border border-slate-200" @submit.prevent="submitAdjustment">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">جهت</label>
              <select v-model="adjustForm.direction" class="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm" required>
                <option value="credit">واریز (افزایش موجودی)</option>
                <option value="debit">برداشت (کاهش موجودی)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">مبلغ (تومان) *</label>
              <input v-model.number="adjustForm.amount" type="number" min="1" class="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm" required placeholder="مثال: 100000" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">دلیل *</label>
              <input v-model="adjustForm.reason" type="text" class="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm" required placeholder="مثال: اصلاح خطا، تسویه دستی" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">یادداشت داخلی (اختیاری)</label>
            <textarea v-model="adjustForm.internal_note" rows="2" class="border border-slate-300 rounded-lg px-3 py-2 w-full text-sm" placeholder="یادداشت برای پرونده داخلی" />
          </div>
          <button
            type="submit"
            class="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50"
            :disabled="adjustSaving"
          >
            {{ adjustSaving ? 'در حال ثبت...' : 'اعمال اصلاح' }}
          </button>
        </form>
      </section>

      <!-- آخرین تراکنش‌ها -->
      <section class="bg-white border border-slate-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-slate-800 mb-4">آخرین تراکنش‌ها</h2>
        <ul class="divide-y divide-slate-200">
          <li v-for="tx in recentTransactions" :key="tx.id" class="py-3 flex justify-between items-start gap-4">
            <div class="min-w-0">
              <p class="font-medium text-slate-800 text-sm">{{ tx.type ?? tx.type_text }}</p>
              <p class="text-slate-500 text-sm mt-0.5">{{ tx.description }}</p>
              <p class="text-slate-400 text-xs mt-1">{{ formatDate(tx.created_at) }}</p>
            </div>
            <span class="font-medium text-slate-900 text-sm shrink-0">{{ tx.amount?.toLocaleString('fa-IR') }} تومان</span>
          </li>
        </ul>
        <p v-if="recentTransactions.length === 0" class="text-slate-500 py-8 text-center text-sm">تراکنشی یافت نشد.</p>
      </section>
    </template>
  </div>
</template>

<script setup>
const route = useRoute();
const ownerType = computed(() => route.params.ownerType);
const ownerId = computed(() => parseInt(route.params.ownerId, 10));

const loading = ref(true);
const wallet = ref({});
const recentTransactions = ref([]);
const adjustForm = ref({ amount: '', direction: 'credit', reason: '', internal_note: '' });
const adjustSaving = ref(false);

function ownerTypeLabel(type) {
  const map = { platform: 'پلتفرم', lawyer: 'وکیل', user: 'کاربر' };
  return map[type] ?? type;
}

function label(k) {
  const map = { balance: 'موجودی', total_earned: 'کل درآمد', total_withdrawn: 'کل برداشت', total_credited: 'کل واریز', total_debited: 'کل برداشت', total_income: 'کل درآمد', total_expenses: 'کل هزینه‌ها', is_frozen: 'مسدود' };
  return map[k] ?? k;
}

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('fa-IR');
}

async function fetchDetail() {
  const res = await useGet({
    url: `admin/wallets/${ownerType.value}/${ownerId.value}`,
    includeAuthHeader: true,
  }, false);
  if (res?.data?.data) {
    wallet.value = res.data.data.wallet ?? {};
    recentTransactions.value = res.data.data.recent_transactions ?? [];
  }
}

async function submitAdjustment() {
  adjustSaving.value = true;
  try {
    await usePost({
      url: `admin/wallets/${ownerType.value}/${ownerId.value}/adjustment`,
      includeAuthHeader: true,
      body: {
        amount: Number(adjustForm.value.amount),
        direction: adjustForm.value.direction,
        reason: adjustForm.value.reason,
        internal_note: adjustForm.value.internal_note || undefined,
      },
    });
    useToast().add({ color: 'success', description: 'اصلاح با موفقیت اعمال شد.' });
    adjustForm.value = { amount: '', direction: 'credit', reason: '', internal_note: '' };
    await fetchDetail();
  } catch (e) {
    useToast().add({ color: 'error', description: e?.data?.message || 'خطا در اعمال اصلاح.' });
  } finally {
    adjustSaving.value = false;
  }
}

onMounted(async () => {
  await fetchDetail();
  loading.value = false;
});

useHead({ title: 'جزئیات کیف پول | وکیل وکیل' });
</script>
