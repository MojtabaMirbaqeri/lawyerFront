<template>
  <div class="settings-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">تنظیمات</h1>
        <p class="page-description">تنظیمات عمومی و درصد سود پلتفرم</p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <p class="text-gray-500">در حال بارگذاری...</p>
    </div>

    <section v-else class="ds-form-section">
      <UForm :schema="schema" :state="state" class="ds-form" @submit="onSubmit">
        <div class="ds-form-grid">
          <UICInput
            v-model="state.site_title"
            name="site_title"
            label="عنوان سایت" />

          <UICInput
            v-model.number="state.platform_commission_percent"
            name="platform_commission_percent"
            label="درصد سود پلتفرم (۰ تا ۱۰۰)"
            type="number"
            min="0"
            max="100" />

          <UICInput
            v-model.number="state.booking_cancellation_window_hours"
            name="booking_cancellation_window_hours"
            label="مهلت لغو توسط کاربر (ساعت)"
            type="number"
            min="0"
            max="168" />
          <p class="text-sm text-slate-500 col-span-full">تا چند ساعت قبل از زمان نوبت، کاربر می‌تواند نوبت را لغو کند. مثال: ۲۴</p>

          <UICInput
            v-model.number="state.booking_manual_approval_timeout_minutes"
            name="booking_manual_approval_timeout_minutes"
            label="مدت زمان پاسخ‌گویی وکیل به درخواست رزرو (دقیقه)"
            type="number"
            min="5"
            max="1440" />
          <p class="text-sm text-slate-500 col-span-full">پس از این مدت بدون پاسخ وکیل، درخواست رزرو منقضی می‌شود.</p>
        </div>

        <div class="mt-4">
          <UICSecondaryBtn type="submit" :disabled="saving">
            {{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
          </UICSecondaryBtn>
        </div>
      </UForm>
    </section>
  </div>
</template>

<script setup>
import { object, string, number } from "yup";

useHead({
  title: "تنظیمات | وکیل وکیل",
});

const loading = ref(true);
const saving = ref(false);

const state = reactive({
  site_title: "",
  platform_commission_percent: 20,
  booking_cancellation_window_hours: 24,
  booking_manual_approval_timeout_minutes: 60,
});

const schema = object({
  site_title: string().required("عنوان سایت الزامی است"),
  platform_commission_percent: number()
    .required("درصد سود پلتفرم الزامی است")
    .min(0, "حداقل ۰")
    .max(100, "حداکثر ۱۰۰")
    .integer("عدد صحیح"),
  booking_cancellation_window_hours: number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || Number.isNaN(Number(originalValue))) return 24;
      return Number(originalValue);
    })
    .min(0, "حداقل ۰")
    .max(168, "حداکثر ۱۶۸")
    .integer("عدد صحیح"),
  booking_manual_approval_timeout_minutes: number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || Number.isNaN(Number(originalValue))) return 60;
      return Number(originalValue);
    })
    .min(5, "حداقل ۵")
    .max(1440, "حداکثر ۱۴۴۰")
    .integer("عدد صحیح"),
});

const loadSettings = async () => {
  loading.value = true;
  try {
    const res = await useGet({
      url: "settings",
      includeAuthHeader: true,
    }, false);
    if (res.status && res.data) {
      state.site_title = res.data.site_title ?? "";
      state.platform_commission_percent = res.data.platform_commission_percent ?? 20;
      state.booking_cancellation_window_hours = res.data.booking_cancellation_window_hours ?? 24;
      state.booking_manual_approval_timeout_minutes = res.data.booking_manual_approval_timeout_minutes ?? 60;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(loadSettings);

const onSubmit = async () => {
  saving.value = true;
  try {
    const rawHours = state.booking_cancellation_window_hours;
    const rawMinutes = state.booking_manual_approval_timeout_minutes;
    const cancellationHours = (rawHours === "" || rawHours === null) ? 24 : Number(rawHours);
    const approvalMinutes = (rawMinutes === "" || rawMinutes === null) ? 60 : Number(rawMinutes);
    const body = {
      site_title: state.site_title,
      platform_commission_percent: Math.round(Number(state.platform_commission_percent)),
      booking_cancellation_window_hours: Number.isNaN(cancellationHours) ? 24 : Math.round(Math.max(0, Math.min(168, cancellationHours))),
      booking_manual_approval_timeout_minutes: Number.isNaN(approvalMinutes) ? 60 : Math.round(Math.max(5, Math.min(1440, approvalMinutes))),
    };
    const res = await usePost({
      url: "settings",
      includeAuthHeader: true,
      body,
    });
    if (res.statusCode === 200) {
      useToast().add({
        color: "success",
        description: "تنظیمات با موفقیت ذخیره شد.",
      });
    }
  } finally {
    saving.value = false;
  }
};
</script>
