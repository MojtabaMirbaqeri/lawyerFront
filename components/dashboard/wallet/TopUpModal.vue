<template>
  <UModal :open="open" :ui="{ width: 'max-w-lg' }" @update:open="$emit('update:open', $event)">
    <template #content>
      <div class="topup-modal overflow-auto bg-white shadow-xl rounded-lg" dir="rtl">
        <div class="border-b border-slate-100 px-6 pt-6 pb-4">
          <h2 class="text-xl font-bold text-slate-800">شارژ کیف پول</h2>
          <p class="text-slate-600 text-sm mt-1">مبلغ مورد نظر را انتخاب کنید و از طریق درگاه پرداخت شارژ کنید.</p>
        </div>

        <div class="p-6 space-y-6">
          <!-- Preset amounts -->
          <div>
            <p class="text-sm font-medium text-slate-700 mb-3">مبلغ شارژ</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in presetAmounts"
                :key="preset"
                type="button"
                class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors"
                :class="selectedAmount === preset ? 'border-[#0EA5E9] bg-sky-50 text-[#0EA5E9]' : 'border-slate-200 hover:border-slate-300 text-slate-700'"
                @click="selectedAmount = preset; customAmount = ''"
              >
                {{ preset.toLocaleString('fa-IR') }}
              </button>
            </div>
          </div>

          <!-- Custom amount -->
          <div>
            <label for="topup-custom-amount" class="block text-sm font-medium text-slate-700 mb-1">مبلغ دلخواه (تومان)</label>
            <input
              id="topup-custom-amount"
              v-model="customAmount"
              type="text"
              inputmode="numeric"
              placeholder="مثال: ۱۵۰۰۰۰۰"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0EA5E9] focus:border-[#0EA5E9] outline-none"
              @input="onCustomAmountInput"
            />
            <p class="text-xs text-slate-500 mt-1">حداقل {{ (topupConfig.topup_min_amount ?? 10000).toLocaleString('fa-IR') }} و حداکثر {{ (topupConfig.topup_max_amount ?? 50000000).toLocaleString('fa-IR') }} تومان</p>
            <p v-if="amountError" class="text-sm text-red-600 mt-1">{{ amountError }}</p>
          </div>

          <!-- Summary card -->
          <div v-if="effectiveAmount > 0" class="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
            <p class="text-sm font-medium text-slate-700 mb-2">خلاصه</p>
            <div class="flex justify-between text-sm">
              <span class="text-slate-600">مبلغ شارژ:</span>
              <span class="font-bold text-slate-800">{{ effectiveAmount.toLocaleString('fa-IR') }} تومان</span>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span class="text-slate-600">روش پرداخت:</span>
              <span class="font-medium">زرین‌پال</span>
            </div>
            <p class="text-xs text-slate-500 mt-3">پس از تکمیل پرداخت، کیف پول شما شارژ می‌شود.</p>
          </div>

          <!-- Confirm dialog -->
          <UModal v-model:open="showConfirm" :ui="{ width: 'max-w-sm' }">
            <template #content>
              <div class="p-6 text-center" dir="rtl">
                <p class="text-slate-800 font-medium">شما در حال شارژ کیف پول به مبلغ {{ effectiveAmount.toLocaleString('fa-IR') }} تومان هستید. ادامه می‌دهید؟</p>
                <div class="flex gap-3 justify-center mt-6">
                  <button
                    type="button"
                    class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                    @click="showConfirm = false"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 bg-[#0EA5E9] text-white rounded-lg hover:bg-sky-600 disabled:opacity-50"
                    :disabled="submitting"
                    @click="doSubmit"
                  >
                    {{ submitting ? 'در حال انتقال به درگاه…' : 'تأیید و پرداخت' }}
                  </button>
                </div>
              </div>
            </template>
          </UModal>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              class="flex-1 px-4 py-3 bg-[#0EA5E9] text-white font-medium rounded-xl hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!canSubmit || submitting"
              @click="showConfirm = true"
            >
              {{ submitting ? 'در حال انتقال به درگاه…' : 'پرداخت و شارژ کیف پول' }}
            </button>
            <button
              type="button"
              class="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50"
              @click="$emit('update:open', false)"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  open: { type: Boolean, default: false },
});

const emit = defineEmits(['update:open', 'success']);

const presetAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];
const selectedAmount = ref(0);
const customAmount = ref('');
const topupConfig = ref({ topup_min_amount: 10000, topup_max_amount: 50000000 });
const showConfirm = ref(false);
const submitting = ref(false);
const amountError = ref('');

const effectiveAmount = computed(() => {
  if (customAmount.value) {
    const num = parseInt(String(customAmount.value).replace(/\D/g, ''), 10);
    return Number.isNaN(num) ? 0 : num;
  }
  return selectedAmount.value || 0;
});

const minAmount = computed(() => topupConfig.value.topup_min_amount ?? 10000);
const maxAmount = computed(() => topupConfig.value.topup_max_amount ?? 50000000);

const canSubmit = computed(() => {
  const n = effectiveAmount.value;
  return n >= minAmount.value && n <= maxAmount.value;
});

function onCustomAmountInput(e) {
  const v = e.target.value;
  const digits = v.replace(/\D/g, '');
  customAmount.value = digits ? Number(digits).toLocaleString('fa-IR') : '';
  if (customAmount.value) {
    selectedAmount.value = 0;
  }
  validateAmount();
}

function validateAmount() {
  const n = effectiveAmount.value;
  if (n <= 0) {
    amountError.value = '';
    return;
  }
  if (n < minAmount.value) {
    amountError.value = `حداقل مبلغ ${minAmount.value.toLocaleString('fa-IR')} تومان است.`;
    return;
  }
  if (n > maxAmount.value) {
    amountError.value = `حداکثر مبلغ ${maxAmount.value.toLocaleString('fa-IR')} تومان است.`;
    return;
  }
  amountError.value = '';
}

watch(effectiveAmount, () => validateAmount());

async function doSubmit() {
  if (!canSubmit.value || submitting.value) return;
  submitting.value = true;
  try {
    const res = await usePost({
      url: 'user/wallet/topups',
      includeAuthHeader: true,
      body: { amount: effectiveAmount.value },
    }, false);
    const data = res?.data?.data ?? res?.data;
    const redirectUrl = data?.redirect_url;
    if (redirectUrl && typeof window !== 'undefined') {
      showConfirm.value = false;
      emit('update:open', false);
      window.location.href = redirectUrl;
      return;
    }
    useToast().add({ title: res?.data?.message ?? 'خطا در اتصال به درگاه', color: 'error' });
  } catch (e) {
    useToast().add({ title: e?.data?.message ?? 'خطا در ایجاد درخواست شارژ', color: 'error' });
  } finally {
    submitting.value = false;
  }
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    selectedAmount.value = 0;
    customAmount.value = '';
    amountError.value = '';
    try {
      const res = await useGet({ url: 'user/wallet/topups/config', includeAuthHeader: true }, false);
      const data = res?.data?.data ?? res?.data;
      if (data) topupConfig.value = data;
    } catch (_) {}
  }
});
</script>
