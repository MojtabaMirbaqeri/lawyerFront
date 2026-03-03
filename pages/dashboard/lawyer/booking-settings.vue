<template>
  <div class="booking-settings-page">
    <div class="page-header mb-8">
      <h1 class="page-title">تنظیمات رزرو</h1>
      <p class="page-description mt-1">
        نحوه دریافت و تأیید نوبت‌ها و قوانین پرداخت را مشخص کنید.
      </p>
    </div>

    <div v-if="loading" class="card-dashboard flex justify-center items-center py-16">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <form v-else class="space-y-6" @submit.prevent="save">
      <!-- تأیید نوبت -->
      <div class="card-dashboard overflow-hidden">
        <div class="section-header">
          <UIcon name="lucide:check-circle-2" class="section-icon" />
          <div>
            <h2 class="section-title">تأیید نوبت</h2>
            <p class="section-desc">تعیین کنید نوبت‌ها به‌صورت خودکار تأیید شوند یا نیاز به تأیید دستی داشته باشند.</p>
          </div>
        </div>
        <div class="card-dashboard-body p-6 pt-0 space-y-4">
          <div class="setting-row">
            <div>
              <span class="setting-label">تأیید خودکار نوبت‌ها</span>
              <p class="setting-hint">در صورت فعال بودن، نوبت بدون نیاز به تأیید شما رزرو می‌شود.</p>
            </div>
            <USwitch v-model="form.auto_accept" />
          </div>
        </div>
      </div>

      <!-- شیوه پرداخت -->
      <div class="card-dashboard overflow-hidden">
        <div class="section-header">
          <UIcon name="lucide:credit-card" class="section-icon" />
          <div>
            <h2 class="section-title">شیوه پرداخت</h2>
            <p class="section-desc">نحوه دریافت مبلغ مشاوره (فقط حضوری، پیش‌پرداخت یا پرداخت کامل آنلاین).</p>
          </div>
        </div>
        <div class="card-dashboard-body p-6 pt-0 space-y-5">
          <div>
            <label class="setting-label block mb-2">شیوه پرداخت</label>
            <UICSelect
              v-model="form.payment_policy"
              :items="[
                { id: 'offline_only', label: 'بدون پرداخت آنلاین (فقط حضوری)' },
                { id: 'deposit_required', label: 'پیش‌پرداخت لازم' },
                { id: 'full_payment_required', label: 'پرداخت کامل لازم' },
              ]"
              class="max-w-sm"
            />
          </div>
          <template v-if="form.payment_policy === 'deposit_required'">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="setting-label block mb-2">نوع پیش‌پرداخت</label>
                <UICSelect
                  v-model="form.deposit_type"
                  :items="[
                    { id: 'fixed', label: 'مبلغ ثابت' },
                    { id: 'percent', label: 'درصد' },
                  ]"
                  class="w-full"
                />
              </div>
              <div>
                <label class="setting-label block mb-2">مبلغ یا درصد</label>
                <UInput
                  v-model="form.deposit_value"
                  type="number"
                  min="0"
                  placeholder="مثال: 50000 یا 30"
                  class="w-full"
                />
              </div>
            </div>
            <div>
              <label class="setting-label block mb-2">مهلت پرداخت (دقیقه)</label>
              <UInput
                v-model="form.payment_timeout_minutes"
                type="number"
                min="5"
                max="1440"
                class="w-28"
              />
              <p class="setting-hint mt-1">زمانی که کاربر برای انجام پیش‌پرداخت فرصت دارد.</p>
            </div>
          </template>
        </div>
      </div>

      <!-- زمان‌بندی و فاصله‌ها -->
      <div class="card-dashboard overflow-hidden">
        <div class="section-header">
          <UIcon name="lucide:clock" class="section-icon" />
          <div>
            <h2 class="section-title">زمان‌بندی و فاصله‌ها</h2>
            <p class="section-desc">فاصله بین نوبت‌ها، حداقل زمان تا رزرو و افق رزرو.</p>
          </div>
        </div>
        <div class="card-dashboard-body p-6 pt-0">
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label class="setting-label block mb-2">فاصله قبل از نوبت (دقیقه)</label>
              <UInput
                v-model="form.buffer_before_minutes"
                type="number"
                min="0"
                max="120"
                class="w-full sm:max-w-[140px]"
              />
            </div>
            <div>
              <label class="setting-label block mb-2">فاصله بعد از نوبت (دقیقه)</label>
              <UInput
                v-model="form.buffer_after_minutes"
                type="number"
                min="0"
                max="120"
                class="w-full sm:max-w-[140px]"
              />
            </div>
            <div>
              <label class="setting-label block mb-2">حداقل فاصله تا زمان رزرو (دقیقه)</label>
              <UInput
                v-model="form.minimum_notice_minutes"
                type="number"
                min="0"
                class="w-full sm:max-w-[140px]"
              />
              <p class="setting-hint mt-1">اسلات‌هایی که زودتر از این مقدار از الان باشند نمایش داده نمی‌شوند.</p>
            </div>
            <div>
              <label class="setting-label block mb-2">افق رزرو (روز)</label>
              <UInput
                v-model="form.booking_horizon_days"
                type="number"
                min="1"
                max="365"
                class="w-full sm:max-w-[140px]"
              />
              <p class="setting-hint mt-1">حداکثر تعداد روزی که کاربر می‌تواند از امروز به بعد رزرو کند.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- دکمه ذخیره -->
      <div class="flex flex-row justify-end px-1 py-2">
        <button
          type="submit"
          class="btn-primary inline-flex items-center gap-2 min-w-[160px] justify-center"
          :disabled="saving"
        >
          <UIcon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin shrink-0" />
          <span>{{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
useHead({ title: 'تنظیمات رزرو | وکیل وکیل' });
const toast = useToast();
const form = ref({
  auto_accept: true,
  payment_policy: 'offline_only',
  deposit_type: null,
  deposit_value: null,
  buffer_before_minutes: 0,
  buffer_after_minutes: 0,
  minimum_notice_minutes: 0,
  booking_horizon_days: 30,
  payment_timeout_minutes: 15,
});
const loading = ref(true);
const saving = ref(false);
const fetchSettings = async () => {
  try {
    const res = await useGet({ url: 'lawyer/booking-settings', includeAuthHeader: true });
    if (res.data?.data) {
      const d = res.data.data;
      form.value = {
        auto_accept: !!d.auto_accept,
        payment_policy: d.payment_policy || 'offline_only',
        deposit_type: d.deposit_type,
        deposit_value: d.deposit_value,
        buffer_before_minutes: d.buffer_before_minutes ?? 0,
        buffer_after_minutes: d.buffer_after_minutes ?? 0,
        minimum_notice_minutes: d.minimum_notice_minutes ?? 0,
        booking_horizon_days: d.booking_horizon_days ?? 30,
        payment_timeout_minutes: d.payment_timeout_minutes ?? 15,
      };
    }
  } catch (e) {
    toast.add({ title: 'خطا در بارگذاری تنظیمات', color: 'error' });
  } finally {
    loading.value = false;
  }
};
const save = async () => {
  saving.value = true;
  try {
    await usePut({ url: 'lawyer/booking-settings', includeAuthHeader: true, body: form.value });
    toast.add({ title: 'تنظیمات با موفقیت ذخیره شد', color: 'success' });
  } catch (e) {
    toast.add({ title: e?.data?.message || 'خطا در ذخیره', color: 'error' });
  } finally {
    saving.value = false;
  }
};
onMounted(fetchSettings);
</script>

<style scoped>
@reference "tailwindcss";

.section-header {
  @apply flex gap-3 p-6 pb-2 items-start;
}
.section-icon {
  @apply w-6 h-6 shrink-0 mt-0.5;
  color: hsl(var(--primary));
}
.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}
:global(.dark) .section-title {
  color: #f1f5f9;
}
.section-desc {
  font-size: 0.875rem;
  margin-top: 0.125rem;
  color: #334155;
}
:global(.dark) .section-desc {
  color: #cbd5e1;
}
.setting-row {
  @apply flex flex-wrap items-center justify-between gap-4 py-3;
}
.setting-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
}
:global(.dark) .setting-label {
  color: #e2e8f0;
}
.setting-hint {
  font-size: 0.75rem;
  margin-top: 0.125rem;
  color: #475569;
}
:global(.dark) .setting-hint {
  color: #94a3b8;
}
</style>
