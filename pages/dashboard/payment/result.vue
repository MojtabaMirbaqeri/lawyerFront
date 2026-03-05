<template>
  <div class="payment-result-page">
    <div class="page-header mb-6">
      <h1 class="text-xl font-bold">نتیجه پرداخت</h1>
      <p class="text-slate-600 text-sm mt-1">وضعیت پرداخت شما</p>
    </div>

    <div v-if="loading" class="card-dashboard">
      <div class="card-dashboard-body p-8 flex items-center justify-center gap-2 text-slate-600">
        <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
        <span>در حال بررسی نتیجه پرداخت...</span>
      </div>
    </div>

    <template v-else>
      <!-- Success -->
      <div v-if="result === 'success'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-green-600 mb-4">
            <Icon name="lucide:check-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">پرداخت شما با موفقیت انجام شد</h2>
          </div>
          <p class="text-slate-600 mb-4">رزرو شما نهایی شد. جزئیات نوبت در پنل شما قابل مشاهده است.</p>
          <div v-if="payment" class="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-4">
            <p class="text-sm text-slate-600"><span class="font-medium">مبلغ پرداختی:</span> {{ (payment.amount ?? 0).toLocaleString('fa-IR') }} تومان</p>
            <p v-if="payment.ref_id" class="text-sm text-slate-600 mt-1"><span class="font-medium">شماره پیگیری:</span> {{ payment.ref_id }}</p>
          </div>
          <NuxtLink to="/dashboard/appointments" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a75]">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            مشاهده نوبت‌ها
          </NuxtLink>
        </div>
      </div>

      <!-- Failed -->
      <div v-else-if="result === 'failed'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-red-600 mb-4">
            <Icon name="lucide:x-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">پرداخت ناموفق بود</h2>
          </div>
          <p class="text-slate-600 mb-4">پرداخت تکمیل نشد و نوبت تأیید نشده است. در صورت کسر وجه، با پشتیبانی تماس بگیرید.</p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="appointmentId ? `/dashboard/appointments?pay=${appointmentId}` : '/dashboard/appointments'" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              <Icon name="lucide:refresh-cw" class="w-4 h-4" />
              تلاش مجدد برای پرداخت
            </NuxtLink>
            <NuxtLink to="/dashboard/appointments" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              بازگشت به نوبت‌ها
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Canceled -->
      <div v-else-if="result === 'canceled'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-amber-600 mb-4">
            <Icon name="lucide:alert-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">پرداخت توسط شما تکمیل نشد</h2>
          </div>
          <p class="text-slate-600 mb-4">پرداخت در درگاه انجام نشد. در صورت نیاز می‌توانید مجدداً اقدام به پرداخت کنید.</p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink :to="appointmentId ? `/dashboard/appointments?pay=${appointmentId}` : '/dashboard/appointments'" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a75]">
              <Icon name="lucide:credit-card" class="w-4 h-4" />
              تلاش مجدد برای پرداخت
            </NuxtLink>
            <NuxtLink to="/dashboard/appointments" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              <Icon name="lucide:calendar" class="w-4 h-4" />
              بازگشت به نوبت‌ها
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Already processed -->
      <div v-else-if="result === 'already_processed'" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-slate-600 mb-4">
            <Icon name="lucide:info" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">این پرداخت قبلاً بررسی شده است</h2>
          </div>
          <p class="text-slate-600 mb-4">وضعیت نوبت و پرداخت شما از قبل ثبت شده است.</p>
          <NuxtLink to="/dashboard/appointments" class="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a75]">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            مشاهده نوبت‌ها
          </NuxtLink>
        </div>
      </div>

      <!-- Unknown -->
      <div v-else class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex items-center gap-3 text-slate-500 mb-4">
            <Icon name="lucide:help-circle" class="w-10 h-10" />
            <h2 class="text-lg font-semibold text-slate-900">نتیجه پرداخت نامشخص است</h2>
          </div>
          <p class="text-slate-600 mb-4">در صورت ابهام با پشتیبانی تماس بگیرید.</p>
          <NuxtLink to="/dashboard/appointments" class="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
            بازگشت به نوبت‌ها
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const route = useRoute();

const result = computed(() => (route.query.result || '').toLowerCase());
const paymentId = computed(() => route.query.payment_id ? String(route.query.payment_id).trim() : null);

const payment = ref(null);
const loading = ref(true);

useHead({ title: 'نتیجه پرداخت | وکیلینجا' });

// Fetch payment when we have payment_id (for success receipt and for retry link appointment_id)
const appointmentId = computed(() => payment.value?.appointment?.id ?? null);

watch([result, paymentId], async () => {
  payment.value = null;
  if (!paymentId.value) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const res = await useGet({ url: `payments/${paymentId.value}`, includeAuthHeader: true }, false);
    payment.value = res.data?.data ?? res.data ?? null;
  } catch (_) {
    // ignore
  }
  loading.value = false;
}, { immediate: true });
</script>
