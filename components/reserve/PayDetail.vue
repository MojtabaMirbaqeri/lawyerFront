<template>
  <div class="primary-box">
    <h1 class="sec-header mb-3">اطلاعات پرداخت</h1>

    <div class="pay-detail">
      <div class="flex flex-col gap-3">
        <div class="top">
          <div
            class="bg-[#1e3a5f]/10 flex flex-col gap-3 p-3 border rounded-[8px] text-[#1e3a5f] border-[#1e3a5f]"
          >
            <div class="tax flex justify-between">
              <div class="title">قیمت اصلی</div>
              <div class="price">{{ detailPrice?.mainPrice ?? 0 }} تومان</div>
            </div>
            <div class="tax flex justify-between">
              <div class="title">تخفیف</div>
              <div class="price">{{ detailPrice?.offerValue ?? 0 }} تومان</div>
            </div>
            <USeparator class="opacity-30" color="primary" />
            <div class="top border-b border-[#1e3a5f]/30 pb-2">
              <div class="tax flex justify-between">
                <div class="title">قیمت نهایی</div>
                <div class="price">{{ detailPrice?.price ?? 0 }} تومان</div>
              </div>
            </div>
            <template v-if="payNowAmount != null && payNowAmount > 0">
              <div class="tax flex justify-between font-semibold">
                <div class="title">{{ payNowLabel }}</div>
                <div class="price">{{ formatNumber(payNowAmount) }} تومان</div>
              </div>
            </template>
            <div class="bottom p-2 rounded-b-[8px] flex items-start gap-2">
              <UIcon
                name="hugeicons:information-diamond"
                class="size-4! lg:size-5! opacity-80 shrink-0"
              />
              <span class="opacity-80 paragraph">{{ paymentInfoText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  detailPrice: { type: Object, default: () => ({}) },
  bookingPolicy: { type: Object, default: null },
  visitType: { type: String, default: "inperson" },
});

const policy = computed(() => props.bookingPolicy?.policy ?? "offline_only");

const payNowAmount = computed(() => {
  const price = Number(props.detailPrice?.price) || 0;
  if (price <= 0) return null;
  if (policy.value === "full_payment_required") return price;
  if (policy.value === "deposit_required" && props.bookingPolicy) {
    const t = props.bookingPolicy.deposit_type ?? "fixed";
    const v = Number(props.bookingPolicy.deposit_value) || 0;
    if (t === "percent") return Math.round((price * v) / 100);
    return Math.min(v, price);
  }
  return null;
});

const payNowLabel = computed(() => {
  if (policy.value === "deposit_required") return "مبلغ قابل پرداخت الان (پیش‌پرداخت)";
  if (policy.value === "full_payment_required") return "مبلغ قابل پرداخت الان";
  return "";
});

const paymentInfoText = computed(() => {
  if (policy.value === "offline_only") {
    return "پرداخت در محل مشاوره (حضوری) انجام می‌شود.";
  }
  if (policy.value === "deposit_required" && payNowAmount.value != null) {
    return `مبلغ ${formatNumber(payNowAmount.value)} تومان به صورت آنلاین پرداخت می‌شود و از هزینه مشاوره کسر می‌گردد. مابقی در محل از شما دریافت می‌شود.`;
  }
  if (policy.value === "full_payment_required") {
    return "پرداخت کامل به صورت آنلاین انجام می‌شود.";
  }
  return "مبلغ به صورت آنلاین یا در محل قابل پرداخت است.";
});

function formatNumber(n) {
  return new Intl.NumberFormat("fa-IR").format(n);
}
</script>

<style>
</style>